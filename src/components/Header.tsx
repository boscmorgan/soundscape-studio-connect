import { Button } from "@/components/ui/button";
import { Language, headerTranslations } from "@/lib/i18n";

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header = ({ language, onLanguageChange }: HeaderProps) => {
  const t = headerTranslations[language];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/56b6f8cb-ea6a-416d-9253-07f2c388031e.png" 
              alt="LOELASH" 
              className="h-8 w-auto"
            />
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="mailto:info@loelash.com?subject=Music Inquiry"
              className="px-4 py-2 rounded-full bg-background text-foreground hover:bg-muted transition-all duration-200 border border-border"
            >
              {t.music}
            </a>
            <a 
              href="mailto:info@loelash.com?subject=Services Inquiry"
              className="px-4 py-2 rounded-full bg-background text-foreground hover:bg-muted transition-all duration-200 border border-border"
            >
              {t.services}
            </a>
            <a 
              href="mailto:info@loelash.com?subject=Contact Request"
              className="px-4 py-2 rounded-full bg-background text-foreground hover:bg-muted transition-all duration-200 border border-border"
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
              className="rounded-full"
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