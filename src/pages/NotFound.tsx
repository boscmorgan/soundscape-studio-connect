import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Language, notFoundTranslations } from "@/lib/i18n";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const language: Language = navigator.language.startsWith("it") ? "it" : "en";
  const t = notFoundTranslations[language];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">{t.message}</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          {t.cta}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
