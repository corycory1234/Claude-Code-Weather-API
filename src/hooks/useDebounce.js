import { useState, useEffect } from 'react';

/**
 * useDebounce Hook - 防抖處理
 * @param {any} value - 要防抖的值
 * @param {number} delay - 延遲時間（毫秒）
 * @returns {any} 防抖後的值
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清理函數
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
