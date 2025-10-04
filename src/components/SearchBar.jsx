import { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { searchCities } from '../services/weatherAPI';
import { useLanguage } from '../context/LanguageContext';

const SearchBar = ({ onCitySelect }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');

  const debouncedQuery = useDebounce(query, 300);

  // 搜尋城市建議
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchCities(debouncedQuery, 5);
        setSuggestions(results);
      } catch (err) {
        console.error('Search error:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSelectCity = (cityName) => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    onCitySelect(cityName);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSelectCity(query.trim());
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 搜尋框容器 */}
      <div className="relative">
        {/* 主輸入框 */}
        <div
          className={`
            relative flex items-center
            bg-white/90 backdrop-blur-sm
            rounded-2xl shadow-lg
            border-2 transition-all duration-200
            ${
              error
                ? 'border-red-300 shadow-red-100'
                : 'border-transparent hover:border-blue-200 focus-within:border-blue-400 focus-within:shadow-xl'
            }
          `}
        >
          {/* 搜尋圖示 */}
          <div className="pl-5 pr-3">
            {isLoading ? (
              <svg
                className="w-5 h-5 text-blue-500 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>

          {/* 輸入框 */}
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
              setError('');
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={t('searchPlaceholder')}
            className="
              flex-1 py-4 pr-4
              bg-transparent
              text-gray-800 text-base md:text-lg
              placeholder-gray-400
              focus:outline-none
            "
            aria-label={t('searchPlaceholder')}
          />

          {/* 清除按鈕 */}
          {query && (
            <button
              onClick={handleClear}
              className="
                mr-4 p-1.5 rounded-full
                text-gray-400 hover:text-gray-600 hover:bg-gray-100
                transition-colors
              "
              aria-label={t('searchClear')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div
            className="
              absolute top-full mt-2 w-full
              px-4 py-2
              bg-red-50 border border-red-200 rounded-lg
              text-sm text-red-600
              flex items-center gap-2
            "
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t(error)}</span>
          </div>
        )}

        {/* 搜尋建議下拉 */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            className="
              absolute top-full mt-3 w-full
              bg-white/95 backdrop-blur-sm
              rounded-xl shadow-2xl
              border border-gray-100
              max-h-80 overflow-y-auto
              py-2
              z-50
            "
          >
            {suggestions.map((city) => (
              <button
                key={city.id}
                onClick={() => handleSelectCity(city.name)}
                className="
                  w-full px-5 py-3
                  text-left
                  hover:bg-blue-50 active:bg-blue-100
                  transition-colors
                  flex items-center justify-between
                  group
                "
              >
                <div>
                  <div className="text-gray-800 font-medium">{city.name}</div>
                  <div className="text-sm text-gray-500">{city.country}</div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
