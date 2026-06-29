import { useState, useEffect, useCallback, useRef } from 'react';

const API = 'https://api.jsonbin.io/v3';
const POLL_INTERVAL = 5000;

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
  const binIdRef = useRef(null);
  const saveTimerRef = useRef(null);
  const pollRef = useRef(null);
  const apiKeyRef = useRef(localStorage.getItem('hw-api-key') || '');
  const latestDataRef = useRef({});

  useEffect(() => {
    latestDataRef.current = data;
  }, [data]);

  function startPolling() {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      if (!binIdRef.current || !apiKeyRef.current) return;
      try {
        const res = await fetch(`${API}/b/${binIdRef.current}/latest`, {
          headers: { 'X-Access-Key': apiKeyRef.current }
        });
        if (res.ok) {
          const json = await res.json();
          const norm = normalize(json.record);
          const current = latestDataRef.current;
          if (JSON.stringify(current) !== JSON.stringify(norm)) {
            setData(norm);
            localStorage.setItem(storageKey, JSON.stringify(norm));
          }
        }
      } catch {}
    }, POLL_INTERVAL);
  }

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const local = localStorage.getItem(storageKey);
      if (local) {
        try {
          const parsed = normalize(JSON.parse(local));
          if (!cancelled) setData(parsed);
        } catch {}
      }

      const binKey = `hw-bin-${storageKey}`;
      const savedBin = localStorage.getItem(binKey);

      if (apiKeyRef.current && savedBin) {
        binIdRef.current = savedBin;
        try {
          const res = await fetch(`${API}/b/${savedBin}/latest`, {
            headers: { 'X-Access-Key': apiKeyRef.current }
          });
          if (res.ok && !cancelled) {
            const json = await res.json();
            const norm = normalize(json.record);
            setData(norm);
            localStorage.setItem(storageKey, JSON.stringify(norm));
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
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [storageKey]);

  const saveToCloud = useCallback((value) => {
    if (!apiKeyRef.current) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        const key = apiKeyRef.current;
        if (binIdRef.current) {
          const res = await fetch(`${API}/b/${binIdRef.current}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Access-Key': key,
            },
            body: JSON.stringify(value),
          });
          if (!res.ok) {
            binIdRef.current = null;
            localStorage.removeItem(`hw-bin-${storageKey}`);
          }
        } else {
          const res = await fetch(`${API}/b`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Access-Key': key,
              'X-Bin-Name': `hw-sync-${storageKey}-${Date.now()}`,
            },
            body: JSON.stringify(value),
          });
          if (res.ok) {
            const json = await res.json();
            binIdRef.current = json.metadata.id;
            localStorage.setItem(`hw-bin-${storageKey}`, json.metadata.id);
          }
        }
      } catch {}
    }, 1000);
  }, [storageKey]);

  const update = useCallback((fn) => {
    setData((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      latestDataRef.current = next;
      localStorage.setItem(storageKey, JSON.stringify(next));
      saveToCloud(next);
      return next;
    });
  }, [storageKey, saveToCloud]);

  const setApiKey = useCallback((key) => {
    apiKeyRef.current = key;
    localStorage.setItem('hw-api-key', key);
    if (key) {
      startPolling();
    } else {
      if (pollRef.current) clearInterval(pollRef.current);
    }
  }, []);

  const resetData = useCallback(() => {
    setData({});
    latestDataRef.current = {};
    localStorage.removeItem(storageKey);
    localStorage.removeItem(`hw-bin-${storageKey}`);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (apiKeyRef.current && binIdRef.current) {
      fetch(`${API}/b/${binIdRef.current}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Access-Key': apiKeyRef.current,
        },
        body: JSON.stringify({}),
      }).catch(() => {});
    }
  }, [storageKey]);

  return [data, update, ready, setApiKey, !!apiKeyRef.current, resetData];
}
