import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";
import { Language, footerTranslations } from "@/lib/i18n";

interface FooterProps {
  language: Language;
}

const translations = footerTranslations;

export const Footer = ({ language }: FooterProps) => {
  const t = translations[language];

  const socialLinks = [
    {
      icon: FaInstagram,
      href: "https://instagram.com/loelash",
      label: "Instagram"
    },
    {
      icon: FaYoutube,
      href: "https://youtube.com/loelash", 
      label: "YouTube"
    },
    {
      icon: SiTiktok,
      href: "https://tiktok.com/@loelash",
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
              asChild
              className="rounded-full bg-primary-foreground text-primary hover:bg-primary hover:text-primary-foreground border border-primary"
            >
              <a href={`mailto:${t.email}?subject=Contact Request`} className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{t.contact}</span>
              </a>
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