import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { Language, footerTranslations } from "@/lib/i18n";

interface FooterProps {
  language: Language;
  onContact: (subject: string) => void;
}

const translations = footerTranslations;

export const Footer = ({ language, onContact }: FooterProps) => {
  const t = translations[language];

  const socialLinks = [
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/loelashmusic/",
      label: "Instagram"
    },
    {
      icon: FaYoutube,
      href: "https://www.youtube.com/channel/UCB8DDjynd7VBZEdXlA3kg2g",
      label: "YouTube"
    },
    {
      icon: SiTiktok,
      href: "https://www.tiktok.com/@loelashmusic",
      label: "TikTok"
    }
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo and Contact */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <img 
              src="/lovable-uploads/56b6f8cb-ea6a-416d-9253-07f2c388031e.png" 
              alt="LOELASH" 
              className="h-6 w-auto filter invert"
            />
            <Button
              variant="default"
              size="sm"
              className="rounded-full bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground border border-primary"
              onClick={() => onContact('Contact Request')}
            >
              <Mail className="w-4 h-4 mr-2" />
              <span>{t.contact}</span>
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
        {/* ...existing code... */}
      </div>
    </footer>
  );
};