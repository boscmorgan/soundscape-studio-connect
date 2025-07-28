import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TrustSection } from "@/components/TrustSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [language, setLanguage] = useState<'en' | 'it'>('en');

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} onLanguageChange={setLanguage} />
      <HeroSection language={language} />
      <TrustSection language={language} />
      <Footer language={language} />
    </div>
  );
};

export default Index;