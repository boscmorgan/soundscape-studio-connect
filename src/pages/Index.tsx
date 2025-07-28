import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { SubHeader } from "@/components/SubHeader";
import { HeroSection } from "@/components/HeroSection";
import { TrustSection } from "@/components/TrustSection";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import type { Language } from "@/lib/i18n";
import { seoTranslations } from "@/lib/i18n";

const Index = () => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const seo = seoTranslations[language];
    document.documentElement.lang = language;
    document.title = seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seo.description);
    }
  }, [language]);

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} onLanguageChange={setLanguage} />
      <SubHeader language={language} />
      <HeroSection language={language} />
      <TrustSection language={language} />
      <AboutSection language={language} />
      <Footer language={language} />
    </div>
  );
};

export default Index;