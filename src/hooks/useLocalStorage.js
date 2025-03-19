// src/hooks/useLocalStorage.js
import { useState, useEffect } from "react";

// Custom hook to manage localStorage values
export default function useLocalStorage(key, initialValue) {
  // State to store the value
  const [storedValue, setStoredValue] = useState(initialValue);

  // Effect to load the value from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(key);
      setStoredValue(item ? JSON.parse(item) : initialValue);
    }
  }, [key, initialValue]);

  // Function to set the value and save it to localStorage
  const setValue = (value) => {
    setStoredValue(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  };

  return [storedValue, setValue];
}
