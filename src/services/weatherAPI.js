// OpenWeatherMap API 服務層
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL;

/**
 * 風向轉換函數：度數 → 中文方位
 * @param {number} deg - 風向度數 (0-360)
 * @param {string} lang - 語言代碼
 * @returns {string} 風向文字
 */
const getWindDirection = (deg, lang = 'zh-TW') => {
  const directionsZh = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
  const directionsEn = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const directions = lang === 'zh-TW' ? directionsZh : directionsEn;
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

/**
 * 天氣圖示映射
 * @param {string} iconCode - OpenWeatherMap 圖示代碼
 * @returns {string} Emoji 圖示
 */
const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': '☀️', // 晴天（白天）
    '01n': '🌙', // 晴天（夜晚）
    '02d': '⛅', // 少雲（白天）
    '02n': '☁️', // 少雲（夜晚）
    '03d': '☁️', // 多雲
    '03n': '☁️',
    '04d': '☁️', // 陰天
    '04n': '☁️',
    '09d': '🌧️', // 陣雨
    '09n': '🌧️',
    '10d': '🌦️', // 雨
    '10n': '🌧️',
    '11d': '⛈️', // 雷雨
    '11n': '⛈️',
    '13d': '❄️', // 雪
    '13n': '❄️',
    '50d': '🌫️', // 霧
    '50n': '🌫️',
  };
  return iconMap[iconCode] || '🌤️';
};

/**
 * 取得當前天氣資訊
 * @param {string} city - 城市名稱
 * @param {string} lang - 語言代碼 (zh_tw 或 en)
 * @returns {Promise<Object>} 天氣資料
 */
export const getWeatherByCity = async (city, lang = 'zh_tw') => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&lang=${lang}&units=metric&appid=${API_KEY}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('CITY_NOT_FOUND');
      }
      if (response.status === 429) {
        throw new Error('API_RATE_LIMIT');
      }
      throw new Error('API_ERROR');
    }

    const data = await response.json();

    // 資料轉換
    return {
      city: data.name,
      country: data.sys.country,
      temp: data.main.temp,
      feelsLike: data.main.feels_like,
      tempMin: data.main.temp_min,
      tempMax: data.main.temp_max,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDeg: data.wind.deg,
      windDirection: getWindDirection(data.wind.deg, lang === 'zh_tw' ? 'zh-TW' : 'en'),
      description: data.weather[0].description,
      icon: getWeatherIcon(data.weather[0].icon),
      iconCode: data.weather[0].icon,
      timestamp: data.dt,
    };
  } catch (error) {
    console.error('Weather API Error:', error);
    throw error;
  }
};

/**
 * 搜尋城市建議
 * @param {string} query - 搜尋關鍵字
 * @param {number} limit - 返回結果數量
 * @returns {Promise<Array>} 城市建議列表
 */
export const searchCities = async (query, limit = 5) => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/find?q=${encodeURIComponent(query)}&limit=${limit}&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('SEARCH_ERROR');
    }

    const data = await response.json();

    return data.list.map((city) => ({
      id: city.id,
      name: city.name,
      country: city.sys.country,
      coord: city.coord,
    }));
  } catch (error) {
    console.error('City Search Error:', error);
    return [];
  }
};

/**
 * 熱門城市列表
 */
export const POPULAR_CITIES = [
  { name: 'Taipei', icon: '🇹🇼', displayNameZh: '台北', displayNameEn: 'Taipei' },
  { name: 'Tokyo', icon: '🇯🇵', displayNameZh: '東京', displayNameEn: 'Tokyo' },
  { name: 'New York', icon: '🇺🇸', displayNameZh: '紐約', displayNameEn: 'New York' },
  { name: 'London', icon: '🇬🇧', displayNameZh: '倫敦', displayNameEn: 'London' },
  { name: 'Paris', icon: '🇫🇷', displayNameZh: '巴黎', displayNameEn: 'Paris' },
  { name: 'Sydney', icon: '🇦🇺', displayNameZh: '雪梨', displayNameEn: 'Sydney' },
  { name: 'Singapore', icon: '🇸🇬', displayNameZh: '新加坡', displayNameEn: 'Singapore' },
  { name: 'Seoul', icon: '🇰🇷', displayNameZh: '首爾', displayNameEn: 'Seoul' },
];
