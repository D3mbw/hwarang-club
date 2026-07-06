import { useState, useEffect, useCallback, useRef } from 'react';

const GIST_ID = '95f894b48d09b764c7b91cb8d7e922c0';
const RAW_URL = `https://gist.githubusercontent.com/D3mbw/${GIST_ID}/raw/data.json`;
const GIST_API = `https://api.github.com/gists/${GIST_ID}`;
const ADMIN_PASSWORD = 'hwarang2009';

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
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('hw-admin') === '1');
  const pollRef = useRef(null);
  const latestRef = useRef(data);
  const skipRef = useRef(0);

  useEffect(() => { latestRef.current = data; }, [data]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (skipRef.current > 0) { skipRef.current--; return; }
      try {
        const res = await fetch(`${RAW_URL}?_t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok && !cancelled) {
          const all = await res.json();
          const norm = normalize(all[storageKey]);
          setData(norm);
          localStorage.setItem(`hw-cloud-${storageKey}`, JSON.stringify(norm));
        }
      } catch {}
      if (!cancelled) setReady(true);
    }
    load();
    pollRef.current = setInterval(load, 5000);
    return () => { cancelled = true; clearInterval(pollRef.current); };
  }, [storageKey]);

  const saveToGist = useCallback(async (allData) => {
    try {
      const token = import.meta.env.VITE_GH_TOKEN || '';
      if (!token) { console.error('No GitHub token available'); return false; }
      const res = await fetch(GIST_API, {
        method: 'PATCH',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: { 'data.json': { content: JSON.stringify(allData, null, 2) } }
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Gist save error:', err.message || res.status);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Gist save error:', e);
      return false;
    }
  }, []);

  const update = useCallback((fn) => {
    skipRef.current = 3;
    setData((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      latestRef.current = next;
      localStorage.setItem(`hw-cloud-${storageKey}`, JSON.stringify(next));

      const allData = JSON.parse(localStorage.getItem('hw-sync-all') || '{}');
      allData[storageKey] = next;
      localStorage.setItem('hw-sync-all', JSON.stringify(allData));
      saveToGist(allData);

      return next;
    });
  }, [storageKey, saveToGist]);

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('hw-admin', '1');
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hw-admin');
    setIsAdmin(false);
  }, []);

  const resetData = useCallback(() => {
    skipRef.current = 3;
    setData({});
    latestRef.current = {};
    localStorage.removeItem(`hw-cloud-${storageKey}`);
    const allData = JSON.parse(localStorage.getItem('hw-sync-all') || '{}');
    allData[storageKey] = {};
    localStorage.setItem('hw-sync-all', JSON.stringify(allData));
    saveToGist(allData);
  }, [storageKey, saveToGist]);

  return { data, update, ready, isAdmin, login, logout, resetData };
}
