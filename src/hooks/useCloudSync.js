import { useState, useEffect, useCallback } from 'react';

function normalize(data) {
  if (!data) return {};
  if (Array.isArray(data)) {
    const obj = {};
    data.forEach((item) => { if (item?.id) obj[item.id] = item; });
    return obj;
  }
  if (typeof data === 'object') return data;
  return {};
}

export function useCloudSync(storageKey) {
  const [data, setData] = useState(() => {
    try {
      const local = localStorage.getItem(storageKey);
      return local ? normalize(JSON.parse(local)) : {};
    } catch {
      return {};
    }
  });
  const [ready] = useState(true);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, storageKey]);

  const update = useCallback((fn) => {
    setData((prev) => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      return next;
    });
  }, []);

  const resetData = useCallback(() => {
    setData({});
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return [data, update, ready, null, false, resetData];
}
