import React, { useEffect, useState, useRef } from 'react';

const GoogleTranslate = () => {
  const [currentLang, setCurrentLang] = useState('default');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const langNames = {
    'default': 'Select Language',
    'en': 'ENGLISH',
    'hi': 'HINDI',
    'gu': 'GUJARATI'
  };

  useEffect(() => {
    // Identify current language for UI
    const getActiveLang = () => {
      const match = document.cookie.match(/googtrans=\/([^/]+)\/([^/]+)/);
      if (match && match[2] && langNames[match[2]]) {
        return match[2];
      }
      return 'default';
    };
    setCurrentLang(getActiveLang());

    // Initialize Google Translate
    const timer = setTimeout(() => {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'auto',
              includedLanguages: 'en,gu,hi',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: true
            },
            'google_translate_element'
          );
        }
      };

      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
      }
    }, 300);

    // 4. Click outside to close
    const clickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', clickOutside);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', clickOutside);
    };
  }, []);

  const changeLanguage = (code) => {
    const domains = [window.location.hostname, `.${window.location.hostname}`];
    
    if (code === 'default') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      domains.forEach(d => {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${d}`;
      });
    } else {
      const val = `/auto/${code}`;
      document.cookie = `googtrans=${val}; path=/`;
      domains.forEach(d => {
        document.cookie = `googtrans=${val}; path=/; domain=${d}`;
      });
    }

    setCurrentLang(code);
    setIsOpen(false);
    window.location.reload();
  };

  return (
    <div className="language-dropdown-container notranslate" ref={containerRef}>
      <button
        className="language-active-pill"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Language Menu"
      >
        <span>{langNames[currentLang]}</span>
      </button>

      {isOpen && (
        <div className="language-popup-menu">
          {Object.keys(langNames).map((code) => (
            <button
              key={code}
              className={`lang-option ${currentLang === code ? 'active' : ''}`}
              onClick={() => changeLanguage(code)}
            >
              {langNames[code]}
            </button>
          ))}
        </div>
      )}

      {/* Target for Google (hidden) */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </div>
  );
};

export default GoogleTranslate;