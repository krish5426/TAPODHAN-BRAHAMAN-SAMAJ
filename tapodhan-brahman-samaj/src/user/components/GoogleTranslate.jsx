import React, { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,gu,hi',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
            },
            'google_translate_element'
          );
        }
      };

      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.onerror = () => {
          console.warn('Google Translate script failed to load (likely blocked by Ad-blocker).');
        };
        document.body.appendChild(script);
      } else if (window.google && window.google.translate) {
        window.googleTranslateElementInit();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        display: 'block',
        visibility: 'visible',
        minHeight: '20px',
        minWidth: '100px'
      }}
    ></div>
  );
};

export default GoogleTranslate;