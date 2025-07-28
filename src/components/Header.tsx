import { Button } from "@/components/ui/button";

interface HeaderProps {
  language: 'en' | 'it';
  onLanguageChange: (lang: 'en' | 'it') => void;
}

const translations = {
  en: {
    music: "Music",
    services: "Services", 
    contact: "Contact",
    cta: "Let's Work!"
  },
  it: {
    music: "Musica",
    services: "Servizi",
    contact: "Contatto", 
    cta: "Lavoriamo!"
  }
};

export const Header = ({ language, onLanguageChange }: HeaderProps) => {
  const t = translations[language];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tight">
            LOELASH
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="mailto:info@loelash.com?subject=Music Inquiry"
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              {t.music}
            </a>
            <a 
              href="mailto:info@loelash.com?subject=Services Inquiry"
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              {t.services}
            </a>
            <a 
              href="mailto:info@loelash.com?subject=Contact Request"
              className="text-foreground hover:text-primary transition-colors duration-200"
            >
              {t.contact}
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onLanguageChange('en')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  language === 'en' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </button>
              <span className="text-muted-foreground">|</span>
              <button
                onClick={() => onLanguageChange('it')}
                className={`text-sm font-medium transition-colors duration-200 ${
                  language === 'it' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                IT
              </button>
            </div>

            {/* CTA Button */}
            <Button 
              variant="cta" 
              size="sm"
              asChild
            >
              <a href="mailto:info@loelash.com?subject=Let's Work Together!">
                {t.cta}
              </a>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};