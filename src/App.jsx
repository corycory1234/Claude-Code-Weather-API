import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useWeather } from './hooks/useWeather';
import { useLanguage } from './context/LanguageContext';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import LanguageSwitcher from './components/LanguageSwitcher';
import PopularCities from './components/PopularCities';

function App() {
  const { t } = useLanguage();
  const [lastSearchedCity, setLastSearchedCity] = useLocalStorage(
    'lastSearchedCity',
    import.meta.env.VITE_DEFAULT_CITY || 'Taipei'
  );
  const [currentCity, setCurrentCity] = useState(lastSearchedCity);

  const { weather, loading, error, refetch } = useWeather(currentCity);

  const handleCitySelect = (cityName) => {
    setCurrentCity(cityName);
    setLastSearchedCity(cityName);
  };

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100
        px-4 py-6 md:py-12
      "
    >
      {/* Header */}
      <header
        className="
          max-w-7xl mx-auto
          flex items-center justify-between
          mb-8 md:mb-12
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="
              w-10 h-10 md:w-12 md:h-12
              bg-gradient-to-br from-blue-500 to-cyan-500
              rounded-xl
              flex items-center justify-center
              text-white text-xl md:text-2xl
              shadow-lg
            "
          >
            ☀️
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">{t('appName')}</h1>
        </div>

        {/* 語言切換 */}
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto space-y-8">
        {/* 搜尋區域 */}
        <section>
          <SearchBar onCitySelect={handleCitySelect} />
          <PopularCities onCityClick={handleCitySelect} />
        </section>

        {/* 天氣卡片 */}
        <section>
          <WeatherCard weather={weather} isLoading={loading} error={error} onRetry={refetch} />
        </section>
      </main>

      {/* Footer */}
      <footer
        className="
          max-w-7xl mx-auto
          mt-12 pt-6 border-t border-gray-200/50
          text-center text-sm text-gray-500
        "
      >
        {t('dataSource')}
      </footer>
    </div>
  );
}

export default App;
