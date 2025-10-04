import { useState, useEffect, useCallback } from 'react';
import { getWeatherByCity } from '../services/weatherAPI';
import { useLanguage } from '../context/LanguageContext';

/**
 * useWeather Hook - 天氣資料獲取
 * @param {string} city - 城市名稱
 * @returns {Object} { weather, loading, error, refetch }
 */
export const useWeather = (city) => {
  const { getApiLangCode } = useLanguage();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 快取機制（5分鐘）
  const [cache, setCache] = useState({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5分鐘

  const fetchWeather = useCallback(async () => {
    if (!city) return;

    const lang = getApiLangCode();
    const cacheKey = `${city}_${lang}`;

    // 檢查快取
    const cachedData = cache[cacheKey];
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      setWeather(cachedData.data);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCity(city, lang);
      setWeather(data);

      // 更新快取
      setCache((prev) => ({
        ...prev,
        [cacheKey]: {
          data,
          timestamp: Date.now(),
        },
      }));
    } catch (err) {
      let errorMessage = 'apiError';

      if (err.message === 'CITY_NOT_FOUND') {
        errorMessage = 'cityNotFound';
      } else if (err.message === 'API_RATE_LIMIT') {
        errorMessage = 'apiRateLimit';
      } else if (err.message === 'API_ERROR') {
        errorMessage = 'apiError';
      } else {
        errorMessage = 'networkError';
      }

      setError(errorMessage);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [city, getApiLangCode, cache]);

  useEffect(() => {
    fetchWeather();
  }, [city, getApiLangCode]);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather,
  };
};
