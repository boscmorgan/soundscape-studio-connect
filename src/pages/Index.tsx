import { useState } from "react";
import { Header } from "@/components/Header";
import { SubHeader } from "@/components/SubHeader";
import { HeroSection } from "@/components/HeroSection";
import { TrustSection } from "@/components/TrustSection";
import { Footer } from "@/components/Footer";
import type { Language } from "@/lib/i18n";

const Index = () => {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} onLanguageChange={setLanguage} />
      <SubHeader language={language} />
      <HeroSection language={language} />
      <TrustSection language={language} />
      <Footer language={language} />
    </div>
  );
};

export default Index;