import { createContext, useContext, useState, useEffect } from 'react';
import zhTW from '../i18n/zh-TW';
import en from '../i18n/en';

// 建立 Context
const LanguageContext = createContext();

// 語言包映射
const languages = {
  'zh-TW': zhTW,
  'en': en,
};

// 語言代碼映射（用於 API）
const langCodeMap = {
  'zh-TW': 'zh_tw',
  'en': 'en',
};

/**
 * Language Provider 元件
 */
export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    // 從 localStorage 讀取語言偏好，否則使用預設值
    const savedLang = localStorage.getItem('preferredLanguage');
    return savedLang || import.meta.env.VITE_DEFAULT_LANGUAGE || 'zh-TW';
  });

  // 當語言變更時，儲存到 localStorage
  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLang);
  }, [currentLang]);

  // 切換語言函數
  const switchLanguage = (lang) => {
    if (languages[lang]) {
      setCurrentLang(lang);
    }
  };

  // 取得翻譯文字
  const t = (key) => {
    const keys = key.split('.');
    let value = languages[currentLang];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return value;
  };

  // 取得 API 語言代碼
  const getApiLangCode = () => {
    return langCodeMap[currentLang] || 'en';
  };

  const value = {
    currentLang,
    switchLanguage,
    t,
    getApiLangCode,
    availableLanguages: Object.keys(languages),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * useLanguage Hook
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
