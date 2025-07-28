import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Youtube, Mail } from "lucide-react";

interface FooterProps {
  language: 'en' | 'it';
}

const translations = {
  en: {
    contact: "Get in Touch",
    rights: "© 2024 LOELASH. All rights reserved.",
    email: "info@loelash.com"
  },
  it: {
    contact: "Mettiti in Contatto",
    rights: "© 2024 LOELASH. Tutti i diritti riservati.",
    email: "info@loelash.com"
  }
};

export const Footer = ({ language }: FooterProps) => {
  const t = translations[language];

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://instagram.com/loelash",
      label: "Instagram"
    },
    {
      icon: Twitter, 
      href: "https://twitter.com/loelash",
      label: "Twitter"
    },
    {
      icon: Youtube,
      href: "https://youtube.com/loelash", 
      label: "YouTube"
    }
  ];

  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo and Contact */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="text-xl font-bold">LOELASH</div>
            
            <Button 
              variant="outline" 
              size="sm"
              asChild
              className="rounded-full"
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
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};