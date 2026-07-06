import { useState, useEffect, useCallback, useRef } from 'react';

const GIST_ID = '95f894b48d09b764c7b91cb8d7e922c0';
const RAW_URL = `https://gist.githubusercontent.com/D3mbw/${GIST_ID}/raw/data.json`;
const GIST_API = `https://api.github.com/gists/${GIST_ID}`;

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
  const [syncing, setSyncing] = useState(false);
  const pollRef = useRef(null);
  const latestRef = useRef(data);

  useEffect(() => { latestRef.current = data; }, [data]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
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
    setSyncing(true);
    try {
      const token = localStorage.getItem('hw-token') || import.meta.env.VITE_GH_TOKEN || '';
      if (!token) { setSyncing(false); return; }

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
      }
    } catch (e) {
      console.error('Gist save error:', e);
    }
    setSyncing(false);
  }, []);

  const update = useCallback((fn) => {
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

  const resetData = useCallback(() => {
    setData({});
    latestRef.current = {};
    localStorage.removeItem(`hw-cloud-${storageKey}`);
    const allData = JSON.parse(localStorage.getItem('hw-sync-all') || '{}');
    allData[storageKey] = {};
    localStorage.setItem('hw-sync-all', JSON.stringify(allData));
    saveToGist(allData);
  }, [storageKey, saveToGist]);

  return [data, update, ready, resetData, syncing];
}
