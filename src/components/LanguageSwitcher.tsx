import { useEffect, useState } from 'react';

const LanguageSwitcher = () => {
  const [lang, setLang] = useState('ur');

  useEffect(() => {
    // Check current cookie
    const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
    if (match && match[2] === '/ur/en') {
      setLang('en');
    } else {
      setLang('ur');
    }

    // Add Google Translate script if not added
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      // @ts-ignore
      window.googleTranslateElementInit = () => {
        // @ts-ignore
        new window.google.translate.TranslateElement(
          { pageLanguage: 'ur', autoDisplay: false },
          'google_translate_element'
        );
      };
    }
  }, []);

  const switchLanguage = (newLang: string) => {
    if (newLang === 'en') {
      document.cookie = 'googtrans=/ur/en; path=/';
      document.cookie = 'googtrans=/ur/en; domain=' + window.location.hostname + '; path=/';
    } else {
      document.cookie = 'googtrans=/ur/ur; path=/';
      document.cookie = 'googtrans=/ur/ur; domain=' + window.location.hostname + '; path=/';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + window.location.hostname + '; path=/;';
    }
    window.location.reload();
  };

  return (
    <div className="fixed bottom-6 left-6 z-[9999] flex items-center gap-1 bg-[#1a1a1a]/95 backdrop-blur-xl border border-[#2a2a2a] p-1.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
      <div id="google_translate_element" className="invisible absolute w-0 h-0"></div>
      <button
        onClick={() => switchLanguage('ur')}
        className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 font-urdu ${
          lang === 'ur' 
            ? 'bg-gradient-to-r from-[#0f9d58] to-[#0a7a44] text-white shadow-lg scale-105' 
            : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
        }`}
      >
        اردو
      </button>
      <button
        onClick={() => switchLanguage('en')}
        className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
          lang === 'en' 
            ? 'bg-gradient-to-r from-[#0f9d58] to-[#0a7a44] text-white shadow-lg scale-105' 
            : 'text-gray-400 hover:text-white hover:bg-[#2a2a2a]'
        }`}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;
