import { useState, useEffect } from 'react';

/**
 * useLocalStorage Hook - localStorage 狀態管理
 * @param {string} key - localStorage 鍵名
 * @param {any} initialValue - 初始值
 * @returns {[any, Function]} [值, 設定函數]
 */
export const useLocalStorage = (key, initialValue) => {
  // 從 localStorage 讀取初始值
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 更新 localStorage
  const setValue = (value) => {
    try {
      // 允許值為函數（類似 useState）
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      // 儲存到 localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
