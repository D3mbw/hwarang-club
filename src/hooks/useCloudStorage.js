import { useState, useEffect, useRef } from 'react';

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
  if (typeof data === 'object') return data;
  return {};
}

export function useCloudStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(normalizeData(initialValue));
  const [loading, setLoading] = useState(true);
  const binIdRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const loadFromCloud = async () => {
      try {
        const savedBinId = localStorage.getItem(`hwarang-bin-${key}`);
        if (savedBinId) {
          binIdRef.current = savedBinId;
          const response = await fetch(`${API_URL}/b/${savedBinId}/latest`, {
            headers: { 'X-Master-Key': MASTER_KEY }
          });
          if (response.ok) {
            const data = await response.json();
            const normalized = normalizeData(data.record);
            if (Object.keys(normalized).length > 0) {
              setStoredValue(normalized);
              localStorage.setItem(key, JSON.stringify(normalized));
              setLoading(false);
              return;
            }
          }
        }
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          const normalized = normalizeData(parsed);
          if (Object.keys(normalized).length > 0) {
            setStoredValue(normalized);
          }
        }
      } catch (error) {
        console.error('Cloud load error:', error);
        const saved = localStorage.getItem(key);
        if (saved) setStoredValue(normalizeData(JSON.parse(saved)));
      }
      setLoading(false);
    };
    loadFromCloud();
  }, [key]);

  const saveToCloud = async (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(async () => {
        try {
          if (binIdRef.current) {
            await fetch(`${API_URL}/b/${binIdRef.current}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': MASTER_KEY,
              },
              body: JSON.stringify(value),
            });
          } else {
            const response = await fetch(`${API_URL}/b`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': MASTER_KEY,
                'X-Bin-Name': `hwarang-${key}`,
              },
              body: JSON.stringify(value),
            });
            if (response.ok) {
              const data = await response.json();
              binIdRef.current = data.metadata.id;
              localStorage.setItem(`hwarang-bin-${key}`, data.metadata.id);
            }
          }
        } catch (error) {
          console.error('Cloud save error:', error);
        }
      }, 1000);
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const updateValue = (newValue) => {
    const valueToStore = newValue instanceof Function ? newValue(storedValue) : newValue;
    setStoredValue(valueToStore);
    saveToCloud(valueToStore);
  };

  return [storedValue, updateValue, loading];
}
