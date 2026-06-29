import { useState, useEffect, useCallback, useRef } from 'react';

const API = 'https://api.jsonbin.io/v3';
const KEY = '$2a$10$4oKJfMKMnGBkFMqhQgyq/.XKwkLFqDkAiJMPFAkBO7kJB1c5RGPiy';

function normalize(data) {
  if (!data) return {};
  if (Array.isArray(data)) {
    const obj = {};
    data.forEach((item) => { if (item?.id) obj[item.id] = item; });
    return obj;
  }
  return typeof data === 'object' ? data : {};
}

export function useCloudSync(storageKey, fallback) {
  const [data, setData] = useState(normalize(fallback));
  const [ready, setReady] = useState(false);
  const binId = useRef(null);
  const saveTimer = useRef(null);
  const pollTimer = useRef(null);

  useEffect(() => {
    const binKey = `hw-bin-${storageKey}`;
    const savedBin = localStorage.getItem(binKey);
    if (savedBin) binId.current = savedBin;

    const load = async () => {
      try {
        if (binId.current) {
          const res = await fetch(`${API}/b/${binId.current}/latest`, {
            headers: { 'X-Access-Key': KEY }
          });
          if (res.ok) {
            const json = await res.json();
            const norm = normalize(json.record);
            setData(norm);
            localStorage.setItem(storageKey, JSON.stringify(norm));
            setReady(true);
            startPolling();
            return;
          }
        }
      } catch {}

      const local = localStorage.getItem(storageKey);
      if (local) {
        try { setData(normalize(JSON.parse(local))); } catch {}
      }
      setReady(true);
      startPolling();
    };

    load();

    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [storageKey]);

  function startPolling() {
    if (pollTimer.current) clearInterval(pollTimer.current);
    pollTimer.current = setInterval(async () => {
      if (!binId.current) return;
      try {
        const res = await fetch(`${API}/b/${binId.current}/latest`, {
          headers: { 'X-Access-Key': KEY }
        });
        if (res.ok) {
          const json = await res.json();
          const norm = normalize(json.record);
          setData((prev) => {
            const prevStr = JSON.stringify(prev);
            const newStr = JSON.stringify(norm);
            if (prevStr !== newStr) {
              localStorage.setItem(storageKey, newStr);
              return norm;
            }
            return prev;
          });
        }
      } catch {}
    }, 5000);
  }

  const persist = useCallback((value) => {
    localStorage.setItem(storageKey, JSON.stringify(value));

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        if (binId.current) {
          const res = await fetch(`${API}/b/${binId.current}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Access-Key': KEY,
            },
            body: JSON.stringify(value),
          });
          if (!res.ok) {
            binId.current = null;
            localStorage.removeItem(`hw-bin-${storageKey}`);
          }
        } else {
          const res = await fetch(`${API}/b`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Access-Key': KEY,
              'X-Bin-Name': `hw3-${storageKey}`,
            },
            body: JSON.stringify(value),
          });
          if (res.ok) {
            const json = await res.json();
            binId.current = json.metadata.id;
            localStorage.setItem(`hw-bin-${storageKey}`, json.metadata.id);
          }
        }
      } catch {}
    }, 800);
  }, [storageKey]);

  const update = useCallback((fn) => {
    setData((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      persist(next);
      return next;
    });
  }, [persist]);

  return [data, update, ready];
}
