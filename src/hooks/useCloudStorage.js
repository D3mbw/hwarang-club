import { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = 'https://api.jsonbin.io/v3';
const MASTER_KEY = '$2a$10$4oKJfMKMnGBkFMqhQgyq/.XKwkLFqDkAiJMPFAkBO7kJB1c5RGPiy';

function normalizeData(data) {
  if (!data) return {};
  if (Array.isArray(data)) {
    const obj = {};
    data.forEach((item) => {
      if (item && item.id) obj[item.id] = item;
    });
    return obj;
  }
  if (typeof data === 'object' && !Array.isArray(data)) return data;
  return {};
}

export function useCloudStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(normalizeData(initialValue));
  const [loading, setLoading] = useState(true);
  const binIdRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const savedBinId = localStorage.getItem(`hwarang-bin-${key}`);
        if (savedBinId) {
          binIdRef.current = savedBinId;
          const response = await fetch(`${API_URL}/b/${savedBinId}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
          });
          if (response.ok && !cancelled) {
            const data = await response.json();
            const normalized = normalizeData(data.record);
            setStoredValue(normalized);
            localStorage.setItem(key, JSON.stringify(normalized));
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Cloud load error:', e);
      }

      if (!cancelled) {
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            setStoredValue(normalizeData(JSON.parse(saved)));
          } catch (e) {}
        }
        setLoading(false);
      }
    };

    loadData();
    return () => { cancelled = true; };
  }, [key]);

  const saveToCloud = useCallback((value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const binId = binIdRef.current;
        if (binId) {
          const res = await fetch(`${API_URL}/b/${binId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Master-Key': MASTER_KEY,
            },
            body: JSON.stringify(value),
          });
          if (!res.ok) {
            binIdRef.current = null;
            localStorage.removeItem(`hwarang-bin-${key}`);
          }
        } else {
          const res = await fetch(`${API_URL}/b`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Master-Key': MASTER_KEY,
              'X-Bin-Name': `hwarang-v2-${key}`,
            },
            body: JSON.stringify(value),
          });
          if (res.ok) {
            const data = await res.json();
            binIdRef.current = data.metadata.id;
            localStorage.setItem(`hwarang-bin-${key}`, data.metadata.id);
          }
        }
      } catch (e) {
        console.error('Cloud save error:', e);
      }
    }, 500);
  }, [key]);

  const updateValue = useCallback((newValue) => {
    const valueToStore = typeof newValue === 'function' ? newValue(storedValue) : newValue;
    setStoredValue(valueToStore);
    saveToCloud(valueToStore);
  }, [storedValue, saveToCloud]);

  return [storedValue, updateValue, loading];
}
