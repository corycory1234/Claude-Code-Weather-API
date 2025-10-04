import { useLanguage } from '../context/LanguageContext';

const WeatherCard = ({ weather, isLoading, error, onRetry }) => {
  const { t, currentLang } = useLanguage();

  // 載入狀態
  if (isLoading) {
    return (
      <div
        className="
          w-full max-w-2xl mx-auto
          bg-white/90 backdrop-blur-sm
          rounded-3xl shadow-2xl
          p-6 md:p-8
        "
      >
        <div className="animate-pulse space-y-6">
          {/* 城市名稱骨架 */}
          <div className="h-8 bg-gray-200 rounded-lg w-1/3" />
          {/* 溫度骨架 */}
          <div className="h-24 bg-gray-200 rounded-lg w-1/2" />
          {/* 詳細資訊骨架 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-gray-200 rounded-lg" />
            <div className="h-16 bg-gray-200 rounded-lg" />
            <div className="h-16 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <div
        className="
          w-full max-w-2xl mx-auto
          bg-white/90 backdrop-blur-sm
          rounded-3xl shadow-2xl
          p-8 md:p-12
          text-center
        "
      >
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
        <p className="text-gray-500 mb-6">{t(error)}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="
              px-6 py-2.5
              bg-blue-500 hover:bg-blue-600 active:bg-blue-700
              text-white font-medium rounded-lg
              transition-colors
            "
          >
            {t('retry')}
          </button>
        )}
      </div>
    );
  }

  // 無資料
  if (!weather) {
    return null;
  }

  // 溫度顏色動態變化
  const tempColor =
    weather.temp > 30
      ? 'text-orange-500'
      : weather.temp < 15
      ? 'text-cyan-600'
      : 'text-gray-700';

  // 格式化日期
  const formatDate = () => {
    const options = {
      month: currentLang === 'zh-TW' ? 'long' : 'long',
      day: 'numeric',
      weekday: currentLang === 'zh-TW' ? 'long' : 'long',
    };
    return new Date().toLocaleDateString(currentLang === 'zh-TW' ? 'zh-TW' : 'en-US', options);
  };

  return (
    <div
      className="
        w-full max-w-2xl mx-auto
        bg-white/90 backdrop-blur-sm
        rounded-3xl shadow-2xl
        p-6 md:p-8
        border border-white/50
      "
    >
      {/* 頂部：城市名稱與日期 */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            {weather.city}, {weather.country}
          </h1>
          <p className="text-sm text-gray-500">{formatDate()}</p>
        </div>
        {/* 天氣圖示 */}
        <div className="text-5xl">{weather.icon}</div>
      </div>

      {/* 主要區域：當前溫度 */}
      <div className="mb-8">
        <div className="flex items-start gap-2">
          <span className={`text-7xl md:text-8xl font-extralight ${tempColor}`}>
            {Math.round(weather.temp)}
          </span>
          <span className="text-3xl md:text-4xl font-light text-gray-400 mt-2">°C</span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-lg text-gray-600">
            {t('feelsLike')} {Math.round(weather.feelsLike)}°
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-lg font-medium text-gray-700 capitalize">{weather.description}</span>
        </div>
      </div>

      {/* 溫度範圍視覺化 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-orange-50 rounded-xl">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-cyan-600 font-medium">↓ {Math.round(weather.tempMin)}°</span>
          <span className="text-gray-500">{t('todayRange')}</span>
          <span className="text-orange-600 font-medium">↑ {Math.round(weather.tempMax)}°</span>
        </div>
        {/* 溫度條 */}
        <div className="h-2 bg-gradient-to-r from-cyan-300 via-yellow-300 to-orange-400 rounded-full" />
      </div>

      {/* 底部：次要資訊網格 */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
        {/* 風速風向 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="text-lg font-medium text-gray-800">{weather.windSpeed} m/s</div>
          <div className="text-xs text-gray-500 mt-1">{weather.windDirection}</div>
        </div>

        {/* 濕度 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
              />
            </svg>
          </div>
          <div className="text-lg font-medium text-gray-800">{weather.humidity}%</div>
          <div className="text-xs text-gray-500 mt-1">{t('humidity')}</div>
        </div>

        {/* 氣壓 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-lg font-medium text-gray-800">{weather.pressure}</div>
          <div className="text-xs text-gray-500 mt-1">hPa</div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
