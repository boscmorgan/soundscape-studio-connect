import { useState } from "react";

interface HeroSectionProps {
  language: 'en' | 'it';
}

const translations = {
  en: {
    services: {
      mixing: {
        title: "Mixing",
        description: "Transform your raw tracks into polished, professional recordings with precise balance and clarity.",
        cta: "Get Mixed"
      },
      mastering: {
        title: "Mastering", 
        description: "Give your music the final touch with industry-standard mastering for streaming and physical release.",
        cta: "Get Mastered"
      },
      production: {
        title: "Production",
        description: "From concept to completion, bring your musical vision to life with professional production.",
        cta: "Start Producing"
      },
      musicianship: {
        title: "Musicianship",
        description: "Expert session work and musical arrangement to enhance your creative projects.",
        cta: "Collaborate"
      }
    }
  },
  it: {
    services: {
      mixing: {
        title: "Mixing",
        description: "Trasforma le tue tracce grezze in registrazioni professionali con equilibrio e chiarezza precisi.",
        cta: "Fai Mixare"
      },
      mastering: {
        title: "Mastering",
        description: "Dai alla tua musica il tocco finale con mastering professionale per streaming e rilascio fisico.",
        cta: "Fai Masterizzare"
      },
      production: {
        title: "Produzione",
        description: "Dal concetto al completamento, porta in vita la tua visione musicale con produzione professionale.",
        cta: "Inizia a Produrre"
      },
      musicianship: {
        title: "Musicianship",
        description: "Lavoro di sessione esperto e arrangiamento musicale per migliorare i tuoi progetti creativi.",
        cta: "Collabora"
      }
    }
  }
};

export const HeroSection = ({ language }: HeroSectionProps) => {
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null);
  const [isAnyQuadrantHovered, setIsAnyQuadrantHovered] = useState(false);

  const t = translations[language];

  const quadrants = [
    { id: 'mixing', service: t.services.mixing, position: 'top-left' },
    { id: 'mastering', service: t.services.mastering, position: 'top-right' },
    { id: 'production', service: t.services.production, position: 'bottom-left' },
    { id: 'musicianship', service: t.services.musicianship, position: 'bottom-right' },
  ];

  const handleQuadrantEnter = (quadrantId: string) => {
    setHoveredQuadrant(quadrantId);
    setIsAnyQuadrantHovered(true);
  };

  const handleMouseLeave = () => {
    setHoveredQuadrant(null);
    setIsAnyQuadrantHovered(false);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Main Hero Image Container */}
      <div 
        className="relative w-full h-full cursor-none"
        onMouseLeave={handleMouseLeave}
      >
        {/* Base Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ 
            backgroundImage: `url('/lovable-uploads/d60cfc4b-6c44-42b3-8a9d-f53c0c728f93.png')`,
            filter: isAnyQuadrantHovered ? 'blur(4px)' : 'none'
          }}
        />

        {/* Light overlay for text readability when hovered */}
        {isAnyQuadrantHovered && (
          <div className="absolute inset-0 bg-black/20 transition-all duration-500" />
        )}

        {/* Quadrants */}
        {quadrants.map((quadrant) => (
          <div
            key={quadrant.id}
            className={`absolute w-1/2 h-1/2 transition-all duration-300 cursor-pointer group ${
              quadrant.position === 'top-left' ? 'top-0 left-0' :
              quadrant.position === 'top-right' ? 'top-0 right-0' :
              quadrant.position === 'bottom-left' ? 'bottom-0 left-0' :
              'bottom-0 right-0'
            }`}
            onMouseEnter={() => handleQuadrantEnter(quadrant.id)}
            onClick={() => window.location.href = `mailto:info@loelash.com?subject=${quadrant.service.title} Service Inquiry`}
          >
            {/* Service Content Overlay - Only visible when any quadrant is hovered */}
            <div className={`absolute inset-0 transition-all duration-500 ${
              isAnyQuadrantHovered 
                ? 'opacity-100' 
                : 'opacity-0'
            }`}>
              <div className={`absolute inset-0 flex flex-col justify-center items-center text-center p-8 text-white transition-all duration-300 ${
                hoveredQuadrant === quadrant.id 
                  ? 'filter-none' 
                  : isAnyQuadrantHovered ? 'filter blur-sm' : ''
              }`}>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {quadrant.service.title}
                </h3>
                <p className="text-sm md:text-base mb-6 opacity-90 max-w-xs">
                  {quadrant.service.description}
                </p>
                <div className="px-6 py-2 border border-white/50 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all duration-200">
                  {quadrant.service.cta}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};