import { useState, useEffect, useCallback, useRef } from 'react';

const GIST_ID = 'e75e546cf7c1f1d8acd85c753b486492';
const API_URL = `https://api.github.com/gists/${GIST_ID}`;

function normalize(data) {
  if (!data || typeof data !== 'object') return {};
  if (Array.isArray(data)) {
    const obj = {};
    data.forEach((item) => { if (item?.id) obj[item.id] = item; });
    return obj;
  }
  return data;
}

export function useCloudSync(storageKey) {
  const [data, setData] = useState({});
  const [ready, setReady] = useState(false);
  const pollRef = useRef(null);
  const tokenRef = useRef(localStorage.getItem('hw-gh-token') || '');
  const latestRef = useRef({});

  useEffect(() => { latestRef.current = data; }, [data]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const res = await fetch(`${API_URL}?t=${Date.now()}`);
        if (res.ok && !cancelled) {
          const gist = await res.json();
          const file = gist.files?.['data.json'];
          if (file) {
            const allData = JSON.parse(file.content);
            const norm = normalize(allData[storageKey] || allData);
            setData(norm);
            localStorage.setItem(`hw-local-${storageKey}`, JSON.stringify(norm));
          }
        }
      } catch (e) {
        console.error('Gist load error:', e);
      }

      const local = localStorage.getItem(`hw-local-${storageKey}`);
      if (local && !cancelled) {
        try {
          const parsed = JSON.parse(local);
          if (Object.keys(parsed).length > 0) {
            setData(prev => Object.keys(prev).length === 0 ? normalize(parsed) : prev);
          }
        } catch {}
      }

      if (!cancelled) {
        setReady(true);
        startPolling();
      }
    }

    init();
    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [storageKey]);

  function startPolling() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}?t=${Date.now()}`);
        if (res.ok) {
          const gist = await res.json();
          const file = gist.files?.['data.json'];
          if (file) {
            const allData = JSON.parse(file.content);
            const norm = normalize(allData[storageKey] || allData);
            if (JSON.stringify(latestRef.current) !== JSON.stringify(norm)) {
              setData(norm);
              localStorage.setItem(`hw-local-${storageKey}`, JSON.stringify(norm));
            }
          }
        }
      } catch {}
    }, 5000);
  }

  const update = useCallback((fn) => {
    setData((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      latestRef.current = next;
      localStorage.setItem(`hw-local-${storageKey}`, JSON.stringify(next));
      saveToGist(storageKey, next);
      return next;
    });
  }, [storageKey]);

  const saveToGist = async (key, value) => {
    const token = tokenRef.current;
    if (!token) return;
    try {
      const fullData = { [key]: value };
      const content = JSON.stringify(fullData, null, 2);
      const body = { files: { 'data.json': { content } } };
      await fetch(API_URL, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.error('Gist save error:', e);
    }
  };

  const setToken = useCallback((token) => {
    tokenRef.current = token;
    localStorage.setItem('hw-gh-token', token);
  }, []);

  const resetData = useCallback(() => {
    setData({});
    latestRef.current = {};
    localStorage.removeItem(`hw-local-${storageKey}`);
  }, [storageKey]);

  const hasToken = !!tokenRef.current;
  return [data, update, ready, setToken, hasToken, resetData];
}
