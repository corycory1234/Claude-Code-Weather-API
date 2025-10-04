import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { currentLang, switchLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'zh-TW', name: '繁體中文', flag: '🇹🇼' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode) => {
    switchLanguage(langCode);
    setIsOpen(false);
  };

  const currentLanguage = languages.find((l) => l.code === currentLang) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
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
        aria-label="切換語言"
        aria-expanded={isOpen}
      >
        <span className="text-xl md:text-2xl">{currentLanguage.flag}</span>
        <span className="hidden md:block text-sm font-medium text-gray-700">
          {currentLanguage.name}
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
        <div
          className="
            absolute top-full right-0 mt-2
            w-48
            bg-white
            rounded-lg shadow-xl
            border border-gray-100
            overflow-hidden
            z-50
          "
          role="listbox"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`
                w-full px-4 py-3
                flex items-center gap-3
                hover:bg-blue-50
                transition-colors
                ${currentLang === lang.code ? 'bg-blue-50' : ''}
              `}
              role="option"
              aria-selected={currentLang === lang.code}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-sm font-medium text-gray-700">{lang.name}</span>
              {currentLang === lang.code && (
                <svg className="w-4 h-4 ml-auto text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
