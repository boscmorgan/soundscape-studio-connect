import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { SubHeader } from "@/components/SubHeader";
import { HeroSection } from "@/components/HeroSection";
import { TrustAndTestimonialsSection } from "@/components/TrustAndTestimonialsSection";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { ContactDialog } from "@/components/ContactDialog";
import type { Language } from "@/lib/i18n";
import { seoTranslations } from "@/lib/i18n";

/**
 * Detects user's preferred language based on browser settings
 * Returns 'it' for Italian speakers, 'en' for everyone else
 */
function detectLanguage(): Language {
  const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en';
  const primaryLang = browserLang.split('-')[0].toLowerCase();
  const languages = navigator.languages || [browserLang];
  const hasItalian = languages.some(lang => lang.toLowerCase().startsWith('it'));

  return (primaryLang === 'it' || hasItalian) ? 'it' : 'en';
}

const Index = () => {
  const [language] = useState<Language>(detectLanguage);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('');

  useEffect(() => {
    const seo = seoTranslations[language];
    document.documentElement.lang = language;
    document.title = seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', seo.description);
    }
  }, [language]);

  const handleContact = (subject: string) => {
    setContactSubject(subject);
    setContactOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} onContact={handleContact} />
      <SubHeader language={language} />
      <HeroSection language={language} onContact={handleContact} />
      <TrustAndTestimonialsSection language={language} />
      <AboutSection language={language} />
      <Footer language={language} onContact={handleContact} />
      <ContactDialog
        open={contactOpen}
        onOpenChange={setContactOpen}
        subject={contactSubject}
        language={language}
      />
    </div>
  );
};

export default Index;