import { useState, useEffect, useCallback, useRef } from 'react';

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
  const binId = useRef(null);
  const saveTimer = useRef(null);
  const pollTimer = useRef(null);

  const API = 'https://api.jsonbin.io/v3';
  const API_KEY = useRef(localStorage.getItem('hw-api-key') || '');

  useEffect(() => {
    const load = async () => {
      const local = localStorage.getItem(storageKey);
      if (local) {
        try { setData(normalize(JSON.parse(local))); } catch {}
      }

      if (API_KEY.current) {
        const savedBin = localStorage.getItem(`hw-bin-${storageKey}`);
        if (savedBin) {
          binId.current = savedBin;
          try {
            const res = await fetch(`${API}/b/${savedBin}/latest`, {
              headers: { 'X-Access-Key': API_KEY.current }
            });
            if (res.ok) {
              const json = await res.json();
              const norm = normalize(json.record);
              setData(norm);
              localStorage.setItem(storageKey, JSON.stringify(norm));
            }
          } catch {}
        }
      }

      setReady(true);
      if (API_KEY.current) startPolling();
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
      if (!binId.current || !API_KEY.current) return;
      try {
        const res = await fetch(`${API}/b/${binId.current}/latest`, {
          headers: { 'X-Access-Key': API_KEY.current }
        });
        if (res.ok) {
          const json = await res.json();
          const norm = normalize(json.record);
          setData((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(norm)) {
              localStorage.setItem(storageKey, JSON.stringify(norm));
              return norm;
            }
            return prev;
          });
        }
      } catch {}
    }, 8000);
  }

  const saveToCloud = useCallback((value) => {
    if (!API_KEY.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        if (binId.current) {
          await fetch(`${API}/b/${binId.current}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Access-Key': API_KEY.current,
            },
            body: JSON.stringify(value),
          });
        } else {
          const res = await fetch(`${API}/b`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Access-Key': API_KEY.current,
              'X-Bin-Name': `hw-${storageKey}`,
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
    }, 1500);
  }, [storageKey]);

  const update = useCallback((fn) => {
    setData((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      localStorage.setItem(storageKey, JSON.stringify(next));
      saveToCloud(next);
      return next;
    });
  }, [storageKey, saveToCloud]);

  const setApiKey = useCallback((key) => {
    API_KEY.current = key;
    localStorage.setItem('hw-api-key', key);
    if (key) startPolling();
  }, []);

  return [data, update, ready, setApiKey, !!API_KEY.current];
}
