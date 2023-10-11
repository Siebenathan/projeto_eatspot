import { useState, useEffect } from "react";

export default function useLocalStorage(key: string, defaultValue: unknown) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || String(defaultValue));
    } catch (err) {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key])

  return [value, setValue] as const;
}
