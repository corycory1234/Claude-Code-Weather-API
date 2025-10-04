# 氣象查詢 Web UI/UX 設計規範文檔 (DRD)

**文檔版本**：v1.0
**最後更新**：2025-01-04
**設計師**：UI/UX Designer
**專案**：氣象查詢 Web (React 19 + Vite + Tailwind CSS)

---

## 一、設計系統基礎

### 1.1 色彩系統

```js
// 主要色彩
背景漸層: "bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100"
卡片背景: "bg-white/90 backdrop-blur-sm"
文字主色: "text-gray-800"
文字次要: "text-gray-500"

// 功能色彩
主要動作: "bg-blue-500 hover:bg-blue-600"
錯誤狀態: "bg-red-50 border-red-200 text-red-600"
成功狀態: "bg-green-50 border-green-200"

// 天氣狀態色彩
高溫(>30°): "text-orange-500"
舒適(15-30°): "text-gray-700"
低溫(<15°): "text-cyan-600"
晴天圖示: "text-yellow-400"
雨天圖示: "text-blue-400"
陰天圖示: "text-gray-400"
```

### 1.2 字型系統

```js
// 字體大小
超大數字(溫度): "text-7xl md:text-8xl font-extralight"  // 72px/96px
城市名稱: "text-2xl md:text-3xl font-bold"              // 24px/30px
次標題: "text-lg md:text-xl font-medium"                // 18px/20px
一般文字: "text-base"                                    // 16px
小字: "text-sm text-gray-500"                           // 14px
極小字: "text-xs text-gray-400"                         // 12px

// 字重
font-extralight  // 200 - 溫度數字
font-light       // 300 - 次要數字
font-normal      // 400 - 一般文字
font-medium      // 500 - 強調文字
font-bold        // 700 - 標題
```

### 1.3 間距系統

```js
// 卡片內距
手機版: "p-6"      // 24px
桌面版: "p-8"      // 32px

// 元件間距
緊密: "gap-2"      // 8px
標準: "gap-4"      // 16px
寬鬆: "gap-6"      // 24px

// 區塊間距
section: "space-y-6 md:space-y-8"
```

---

## 二、元件設計規範

### 2.1 搜尋框元件

#### HTML + Tailwind 完整代碼

```jsx
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 搜尋框容器 */}
      <div className="relative">
        {/* 主輸入框 */}
        <div className={`
          relative flex items-center
          bg-white/90 backdrop-blur-sm
          rounded-2xl shadow-lg
          border-2 transition-all duration-200
          ${error
            ? 'border-red-300 shadow-red-100'
            : 'border-transparent hover:border-blue-200 focus-within:border-blue-400 focus-within:shadow-xl'
          }
        `}>
          {/* 搜尋圖示 */}
          <div className="pl-5 pr-3">
            {isLoading ? (
              <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>

          {/* 輸入框 */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜尋城市..."
            className="
              flex-1 py-4 pr-4
              bg-transparent
              text-gray-800 text-base md:text-lg
              placeholder-gray-400
              focus:outline-none
            "
          />

          {/* 清除按鈕 */}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="
                mr-4 p-1.5 rounded-full
                text-gray-400 hover:text-gray-600 hover:bg-gray-100
                transition-colors
              "
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="
            absolute top-full mt-2 w-full
            px-4 py-2
            bg-red-50 border border-red-200 rounded-lg
            text-sm text-red-600
            flex items-center gap-2
          ">
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* 搜尋建議下拉 */}
        {suggestions.length > 0 && (
          <div className="
            absolute top-full mt-3 w-full
            bg-white/95 backdrop-blur-sm
            rounded-xl shadow-2xl
            border border-gray-100
            max-h-80 overflow-y-auto
            py-2
          ">
            {suggestions.map((city, index) => (
              <button
                key={index}
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
                <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
```

#### 狀態設計規範

| 狀態 | 邊框 | 陰影 | 說明 |
|------|------|------|------|
| **Default** | `border-transparent` | `shadow-lg` | 初始狀態 |
| **Hover** | `border-blue-200` | `shadow-lg` | 滑鼠懸停 |
| **Focus** | `border-blue-400` | `shadow-xl` | 輸入中 |
| **Loading** | `border-blue-300` | `shadow-xl` | 搜尋圖示變成 spinner |
| **Error** | `border-red-300` | `shadow-red-100` | 紅色邊框 + 錯誤訊息 |

---

### 2.2 當日天氣卡片

#### HTML + Tailwind 完整代碼

```jsx
const WeatherCard = ({ weather, isLoading, error }) => {
  // 載入狀態
  if (isLoading) {
    return (
      <div className="
        w-full max-w-2xl mx-auto
        bg-white/90 backdrop-blur-sm
        rounded-3xl shadow-2xl
        p-6 md:p-8
      ">
        <div className="animate-pulse space-y-6">
          {/* 城市名稱骨架 */}
          <div className="h-8 bg-gray-200 rounded-lg w-1/3"/>
          {/* 溫度骨架 */}
          <div className="h-24 bg-gray-200 rounded-lg w-1/2"/>
          {/* 詳細資訊骨架 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-gray-200 rounded-lg"/>
            <div className="h-16 bg-gray-200 rounded-lg"/>
            <div className="h-16 bg-gray-200 rounded-lg"/>
          </div>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (error) {
    return (
      <div className="
        w-full max-w-2xl mx-auto
        bg-white/90 backdrop-blur-sm
        rounded-3xl shadow-2xl
        p-8 md:p-12
        text-center
      ">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        <p className="text-gray-500 mb-6">無法取得天氣資訊</p>
        <button className="
          px-6 py-2.5
          bg-blue-500 hover:bg-blue-600 active:bg-blue-700
          text-white font-medium rounded-lg
          transition-colors
        ">
          重新載入
        </button>
      </div>
    );
  }

  // 正常顯示
  const tempColor = weather.temp > 30 ? 'text-orange-500' :
                    weather.temp < 15 ? 'text-cyan-600' :
                    'text-gray-700';

  return (
    <div className="
      w-full max-w-2xl mx-auto
      bg-white/90 backdrop-blur-sm
      rounded-3xl shadow-2xl
      p-6 md:p-8
      border border-white/50
    ">
      {/* 頂部：城市名稱與日期 */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            {weather.city}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString('zh-TW', {
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>
        {/* 天氣圖示 */}
        <div className="text-5xl">
          {weather.icon}
        </div>
      </div>

      {/* 主要區域：當前溫度 */}
      <div className="mb-8">
        <div className="flex items-start gap-2">
          <span className={`text-7xl md:text-8xl font-extralight ${tempColor}`}>
            {Math.round(weather.temp)}
          </span>
          <span className="text-3xl md:text-4xl font-light text-gray-400 mt-2">
            °C
          </span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-lg text-gray-600">
            體感 {Math.round(weather.feelsLike)}°
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-lg font-medium text-gray-700 capitalize">
            {weather.description}
          </span>
        </div>
      </div>

      {/* 溫度範圍視覺化 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-orange-50 rounded-xl">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-cyan-600 font-medium">
            ↓ {Math.round(weather.tempMin)}°
          </span>
          <span className="text-gray-500">今日溫度範圍</span>
          <span className="text-orange-600 font-medium">
            ↑ {Math.round(weather.tempMax)}°
          </span>
        </div>
        {/* 溫度條 */}
        <div className="h-2 bg-gradient-to-r from-cyan-300 via-yellow-300 to-orange-400 rounded-full"/>
      </div>

      {/* 底部：次要資訊網格 */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
        {/* 風速風向 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="text-lg font-medium text-gray-800">
            {weather.windSpeed} m/s
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {weather.windDirection}
          </div>
        </div>

        {/* 濕度 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
            </svg>
          </div>
          <div className="text-lg font-medium text-gray-800">
            {weather.humidity}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            濕度
          </div>
        </div>

        {/* 氣壓 */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-lg font-medium text-gray-800">
            {weather.pressure}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            hPa
          </div>
        </div>
      </div>
    </div>
  );
};
```

#### 響應式規範

| 元素 | 手機版 (< 768px) | 桌面版 (≥ 768px) |
|------|------------------|------------------|
| 卡片內距 | `p-6` | `p-8` |
| 城市名稱 | `text-2xl` | `text-3xl` |
| 溫度數字 | `text-7xl` | `text-8xl` |
| 次要資訊 | `text-sm` | `text-base` |
| 圓角 | `rounded-3xl` | `rounded-3xl` |

---

### 2.3 語言切換按鈕

```jsx
const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('zh-TW');

  const languages = [
    { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
  ];

  return (
    <div className="relative">
      {/* 觸發按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2
          px-3 md:px-4 py-2
          bg-white/80 hover:bg-white
          border border-gray-200 hover:border-gray-300
          rounded-lg
          transition-all
          group
        "
      >
        <span className="text-xl md:text-2xl">
          {languages.find(l => l.code === currentLang).flag}
        </span>
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {languages.find(l => l.code === currentLang).name}
        </span>
        <svg
          className={`
            w-4 h-4 text-gray-500
            transition-transform duration-200
            ${isOpen ? 'rotate-180' : ''}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <div className="
          absolute top-full right-0 mt-2
          w-48
          bg-white
          rounded-lg shadow-xl
          border border-gray-100
          overflow-hidden
          z-50
        ">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setCurrentLang(lang.code);
                setIsOpen(false);
              }}
              className={`
                w-full px-4 py-3
                flex items-center gap-3
                hover:bg-blue-50
                transition-colors
                ${currentLang === lang.code ? 'bg-blue-50' : ''}
              `}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-sm font-medium text-gray-700">
                {lang.name}
              </span>
              {currentLang === lang.code && (
                <svg className="w-4 h-4 ml-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

### 2.4 熱門城市標籤

```jsx
const PopularCities = ({ onCityClick }) => {
  const cities = [
    { name: '台北', icon: '🇹🇼' },
    { name: '東京', icon: '🇯🇵' },
    { name: '紐約', icon: '🇺🇸' },
    { name: '倫敦', icon: '🇬🇧' },
    { name: '巴黎', icon: '🇫🇷' },
    { name: '雪梨', icon: '🇦🇺' },
    { name: '新加坡', icon: '🇸🇬' },
    { name: '首爾', icon: '🇰🇷' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <h3 className="text-sm font-medium text-gray-500 mb-3">
        熱門城市
      </h3>
      <div className="flex flex-wrap gap-2">
        {cities.map((city) => (
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
            <span>{city.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
```

---

### 2.5 整體頁面佈局

```jsx
const WeatherApp = () => {
  return (
    <div className="
      min-h-screen
      bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100
      px-4 py-6 md:py-12
    ">
      {/* Header */}
      <header className="
        max-w-7xl mx-auto
        flex items-center justify-between
        mb-8 md:mb-12
      ">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="
            w-10 h-10 md:w-12 md:h-12
            bg-gradient-to-br from-blue-500 to-cyan-500
            rounded-xl
            flex items-center justify-center
            text-white text-xl md:text-2xl
            shadow-lg
          ">
            ☀️
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            氣象查詢
          </h1>
        </div>

        {/* 語言切換 */}
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto space-y-8">
        {/* 搜尋區域 */}
        <section>
          <SearchBar />
          <PopularCities />
        </section>

        {/* 天氣卡片 */}
        <section>
          <WeatherCard />
        </section>
      </main>

      {/* Footer (可選) */}
      <footer className="
        max-w-7xl mx-auto
        mt-12 pt-6 border-t border-gray-200/50
        text-center text-sm text-gray-500
      ">
        資料來源：OpenWeatherMap API
      </footer>
    </div>
  );
};
```

---

## 三、響應式斷點總覽

### 3.1 手機版 (< 768px)

```css
/* 核心設定 */
容器內距: p-4 到 p-6
字體大小: text-base (主要內容)
溫度數字: text-7xl
城市名稱: text-2xl
搜尋框: 全寬 w-full
熱門城市: 2-3 個一行，可換行
```

### 3.2 桌面版 (≥ 768px)

```css
/* 核心設定 */
容器內距: p-6 到 p-8
字體大小: text-lg (主要內容)
溫度數字: text-8xl
城市名稱: text-3xl
搜尋框: 固定最大寬度 max-w-2xl
熱門城市: 單行顯示，橫向排列
語言按鈕: 顯示完整文字
```

---

## 四、互動動畫規範

### 4.1 過渡效果

```css
/* 標準過渡 */
transition-colors     /* 顏色變化（按鈕、邊框） */
transition-all        /* 綜合效果（卡片、輸入框） */
duration-200          /* 200ms（快速回饋） */

/* 特殊效果 */
hover:scale-105       /* 熱門城市標籤放大 */
active:scale-95       /* 點擊縮小回饋 */
animate-spin          /* 載入 spinner */
animate-pulse         /* 骨架屏 */
```

### 4.2 陰影層次

```css
shadow-lg            /* 基礎卡片 */
shadow-xl            /* 搜尋框 focus */
shadow-2xl           /* 天氣卡片 */
hover:shadow-md      /* 熱門城市 hover */
```

---

## 五、無障礙設計

### 5.1 鍵盤導航

```jsx
// 確保所有互動元素可 Tab 導航
<button tabIndex={0}>
<input tabIndex={0}>

// Escape 關閉下拉選單
useEffect(() => {
  const handleEsc = (e) => {
    if (e.key === 'Escape') setIsOpen(false);
  };
  window.addEventListener('keydown', handleEsc);
  return () => window.removeEventListener('keydown', handleEsc);
}, []);
```

### 5.2 ARIA 標籤

```jsx
<input
  aria-label="搜尋城市"
  aria-describedby="search-hint"
/>

<button
  aria-label="清除搜尋"
  aria-pressed={isOpen}
/>

<div role="listbox" aria-label="城市建議">
```

---

## 六、設計資產清單

### 6.1 需要的 SVG 圖示

```markdown
✅ 搜尋圖示 (放大鏡)
✅ 清除圖示 (X)
✅ 載入 Spinner
✅ 錯誤圖示 (驚嘆號)
✅ 天氣圖示 (雲、太陽、雨)
✅ 風速圖示 (箭頭)
✅ 濕度圖示 (水滴)
✅ 氣壓圖示 (儀表)
✅ 下拉箭頭
✅ 勾選圖示
```

### 6.2 色彩變數 (可選用 CSS 變數)

```css
:root {
  --color-primary: #3B82F6;      /* blue-500 */
  --color-primary-hover: #2563EB; /* blue-600 */
  --color-text: #1F2937;          /* gray-800 */
  --color-text-muted: #6B7280;    /* gray-500 */
  --color-warm: #F97316;          /* orange-500 */
  --color-cool: #0891B2;          /* cyan-600 */
}
```

---

## 七、設計交付檔案結構

```
/src
├── components/
│   ├── SearchBar.jsx          # 搜尋框完整代碼
│   ├── WeatherCard.jsx        # 天氣卡片完整代碼
│   ├── LanguageSwitcher.jsx   # 語言切換完整代碼
│   └── PopularCities.jsx      # 熱門城市完整代碼
├── pages/
│   └── WeatherApp.jsx         # 整體頁面佈局
└── assets/
    └── icons/                 # SVG 圖示資源
```

---

## 八、實作檢查清單

### ✅ 開發前確認
- [ ] 所有 Tailwind 類別已測試有效
- [ ] 響應式斷點在實際裝置測試
- [ ] 顏色對比度符合 WCAG AA 標準
- [ ] 所有互動狀態已定義
- [ ] 載入與錯誤狀態已設計

### ✅ 開發中確認
- [ ] 使用 `className` 組合 Tailwind 類別
- [ ] 避免內聯 style（除非動態計算）
- [ ] 長串類別考慮抽取為常量或元件
- [ ] focus、hover、active 狀態正常運作

### ✅ 上線前確認
- [ ] 手機實際測試（iOS + Android）
- [ ] 平板實際測試
- [ ] 桌面瀏覽器測試（Chrome, Safari, Firefox）
- [ ] 鍵盤導航完整可用
- [ ] 螢幕閱讀器測試（VoiceOver / NVDA）

---

## 九、設計與開發對接

### 9.1 設計師交付給前端工程師

**設計資產**：
- ✅ 完整的 Tailwind CSS 類別規範
- ✅ 各狀態視覺設計（預設/hover/focus/loading/error）
- ✅ 響應式斷點規範
- ✅ 元件結構與佈局代碼

**協作要點**：
1. 所有設計已使用 Tailwind 原生類別，可直接複製使用
2. 響應式設計已定義完整，使用 `md:` 前綴標記桌面版樣式
3. 互動動畫使用 Tailwind 內建 transition 類別
4. 若需調整，請維持整體設計系統一致性

### 9.2 前端工程師實作重點

**優先實作順序**：
1. **階段一**：搜尋框 + 天氣卡片（核心功能）
2. **階段二**：語言切換 + 熱門城市（輔助功能）
3. **階段三**：載入與錯誤狀態（完善體驗）

**技術整合**：
- 使用設計規範中的 Tailwind 類別
- API 資料填充至對應的資料欄位
- 實作狀態管理（loading/error/success）
- 確保響應式在實際裝置測試

---

**設計規範文檔結束**

---

**附錄：快速參考**

```js
// 主要色彩速查
primary: blue-500
background: gradient from-blue-50 via-cyan-50 to-blue-100
card: white/90 backdrop-blur-sm
error: red-50 / red-600

// 字體速查
溫度: text-7xl md:text-8xl font-extralight
標題: text-2xl md:text-3xl font-bold
正文: text-base / text-lg

// 間距速查
卡片內距: p-6 md:p-8
元件間距: gap-4
區塊間距: space-y-6 md:space-y-8
```
