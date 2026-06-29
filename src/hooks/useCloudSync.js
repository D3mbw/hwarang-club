import { useState, useEffect, useCallback, useRef } from 'react';

const REPO = 'D3mbw/hwarang-club';
const BRANCH = 'master';
const RAW_URL = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/data/sync.json`;
const API_URL = `https://api.github.com/repos/${REPO}/contents/data/sync.json`;

function normalize(data) {
  if (!data) return {};
  if (Array.isArray(data)) {
    const obj = {};
    data.forEach((item) => { if (item?.id) obj[item.id] = item; });
    return obj;
  }
  return typeof data === 'object' ? data : {};
}

export function useCloudSync(storageKey) {
  const [data, setData] = useState({});
  const [ready, setReady] = useState(false);
  const pollRef = useRef(null);
  const tokenRef = useRef(localStorage.getItem('hw-gh-token') || '');
  const shaRef = useRef(null);
  const latestRef = useRef({});

  const isAdmin = !!tokenRef.current;

  useEffect(() => { latestRef.current = data; }, [data]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${RAW_URL}?t=${Date.now()}`);
        if (res.ok && !cancelled) {
          const all = await res.json();
          const norm = normalize(all[storageKey]);
          setData(norm);
          localStorage.setItem(`hw-local-${storageKey}`, JSON.stringify(norm));
        }
      } catch {}

      if (!cancelled) {
        setReady(true);
        startPolling();
      }
    }

    load();

    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [storageKey]);

  function startPolling() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${RAW_URL}?t=${Date.now()}`);
        if (res.ok) {
          const all = await res.json();
          const norm = normalize(all[storageKey]);
          if (JSON.stringify(latestRef.current) !== JSON.stringify(norm)) {
            setData(norm);
            localStorage.setItem(`hw-local-${storageKey}`, JSON.stringify(norm));
          }
        }
      } catch {}
    }, 5000);
  }

  const saveToGitHub = useCallback(async (allData) => {
    const token = tokenRef.current;
    if (!token) return;

    try {
      let sha = shaRef.current;
      if (!sha) {
        const metaRes = await fetch(`${API_URL}?ref=${BRANCH}`, {
          headers: { Authorization: `token ${token}` }
        });
        if (metaRes.ok) {
          const meta = await metaRes.json();
          sha = meta.sha;
          shaRef.current = sha;
        }
      }

      const content = btoa(unescape(encodeURIComponent(JSON.stringify(allData, null, 2))));

      const body = { message: `Update data: ${Date.now()}`, content, branch: BRANCH };
      if (sha) body.sha = sha;

      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const json = await res.json();
        shaRef.current = json.content?.sha || null;
      }
    } catch (e) {
      console.error('GitHub save error:', e);
    }
  }, []);

  const update = useCallback((fn) => {
    setData((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      latestRef.current = next;
      localStorage.setItem(`hw-local-${storageKey}`, JSON.stringify(next));

      const allData = JSON.parse(localStorage.getItem('hw-sync-all') || '{}');
      allData[storageKey] = next;
      localStorage.setItem('hw-sync-all', JSON.stringify(allData));
      saveToGitHub(allData);

      return next;
    });
  }, [storageKey, saveToGitHub]);

  const setToken = useCallback((token) => {
    tokenRef.current = token;
    localStorage.setItem('hw-gh-token', token);
  }, []);

  const resetData = useCallback(() => {
    setData({});
    latestRef.current = {};
    localStorage.removeItem(`hw-local-${storageKey}`);
  }, [storageKey]);

  return [data, update, ready, setToken, isAdmin, resetData];
}
