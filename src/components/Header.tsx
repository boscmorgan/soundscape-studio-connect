import { Button } from "@/components/ui/button";
import { Language, headerTranslations } from "@/lib/i18n";
import { FaInstagram, FaYoutube, FaSoundcloud } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";


interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onContact: (subject: string) => void;
}

export const Header = ({ language, onLanguageChange, onContact }: HeaderProps) => {
  const t = headerTranslations[language];

  const socialLinks = [
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/loelashmusic/",
      label: "Instagram",
    },
    {
      icon: FaYoutube,
      href: "https://www.youtube.com/channel/UCB8DDjynd7VBZEdXlA3kg2g",
      label: "YouTube",
    },
    {
      icon: SiTiktok,
      href: "https://www.tiktok.com/@loelashmusic",
      label: "TikTok",
    },
    {
      icon: FaSoundcloud,
      href: "https://soundcloud.com/loelash",
      label: "SoundCloud",
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Scroll to top"
              className="p-0 border-0 bg-transparent cursor-pointer"
            >
              <img
                src="/lovable-uploads/56b6f8cb-ea6a-416d-9253-07f2c388031e.png"
                alt="LOELASH"
                className="h-8 w-auto"
              />
            </button>
          </div>

          {/* Social links (main navigation items could replace this container) */}
          <div className="hidden md:flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-2 text-foreground/70 hover:text-foreground transition-colors duration-200"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
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
              className="rounded-full"
              onClick={() => onContact("Let's Work Together!")}
            >
              {t.cta}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};