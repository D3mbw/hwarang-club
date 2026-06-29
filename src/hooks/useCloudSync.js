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
  const [data, setData] = useState(() => {
    try {
      const local = localStorage.getItem(`hw-cloud-${storageKey}`);
      return local ? normalize(JSON.parse(local)) : {};
    } catch { return {}; }
  });
  const [ready, setReady] = useState(false);
  const pollRef = useRef(null);
  const tokenRef = useRef(localStorage.getItem('hw-gh-token') || '');
  const shaRef = useRef(null);
  const latestRef = useRef(data);
  const skipPollsRef = useRef(0);

  const isAdmin = !!tokenRef.current;

  useEffect(() => { latestRef.current = data; }, [data]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (skipPollsRef.current > 0) {
        skipPollsRef.current--;
        return;
      }

      try {
        const url = `${RAW_URL}?_nocache=${Date.now()}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok && !cancelled) {
          const all = await res.json();
          const norm = normalize(all[storageKey]);
          if (Object.keys(norm).length > 0) {
            setData(norm);
            localStorage.setItem(`hw-cloud-${storageKey}`, JSON.stringify(norm));
          }
        }
      } catch {}
      if (!cancelled) setReady(true);
    }

    load();
    pollRef.current = setInterval(load, 8000);

    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [storageKey]);

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
      const body = { message: `Update ${storageKey} ${Date.now()}`, content, branch: BRANCH };
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
      } else {
        shaRef.current = null;
      }
    } catch (e) {
      console.error('GitHub save error:', e);
    }
  }, []);

  const update = useCallback((fn) => {
    skipPollsRef.current = 3;
    setData((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      latestRef.current = next;
      localStorage.setItem(`hw-cloud-${storageKey}`, JSON.stringify(next));

      if (tokenRef.current) {
        const allData = JSON.parse(localStorage.getItem('hw-sync-all') || '{}');
        allData[storageKey] = next;
        localStorage.setItem('hw-sync-all', JSON.stringify(allData));
        saveToGitHub(allData);
      }

      return next;
    });
  }, [storageKey, saveToGitHub]);

  const setToken = useCallback((token) => {
    tokenRef.current = token;
    localStorage.setItem('hw-gh-token', token);
  }, []);

  const resetData = useCallback(() => {
    skipPollsRef.current = 3;
    setData({});
    latestRef.current = {};
    localStorage.removeItem(`hw-cloud-${storageKey}`);
  }, [storageKey]);

  return [data, update, ready, setToken, isAdmin, resetData];
}
