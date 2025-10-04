import { POPULAR_CITIES } from '../services/weatherAPI';
import { useLanguage } from '../context/LanguageContext';

const PopularCities = ({ onCityClick }) => {
  const { t, currentLang } = useLanguage();

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <h3 className="text-sm font-medium text-gray-500 mb-3">{t('popularCities')}</h3>
      <div className="flex flex-wrap gap-2">
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.name}
            onClick={() => onCityClick(city.name)}
            className="
              flex items-center gap-2
              px-4 py-2
              bg-white/70 hover:bg-white
              border border-gray-200 hover:border-blue-300
              rounded-full
              text-sm font-medium text-gray-700
              hover:text-blue-600
              hover:shadow-md
              transition-all duration-200
              hover:scale-105
              active:scale-95
            "
          >
            <span className="text-lg">{city.icon}</span>
            <span>{currentLang === 'zh-TW' ? city.displayNameZh : city.displayNameEn}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularCities;
