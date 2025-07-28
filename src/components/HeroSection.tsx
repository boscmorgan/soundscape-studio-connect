import { useState } from "react";

interface HeroSectionProps {
  language: 'en' | 'it';
}

const translations = {
  en: {
    headline: "Craft your sound. Shape your future.",
    subline: "Mixing. Mastering. Musicianship.",
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
    headline: "Crea il tuo suono. Modella il tuo futuro.",
    subline: "Mixing. Mastering. Musicianship.",
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const t = translations[language];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  const quadrants = [
    { id: 'mixing', service: t.services.mixing, position: 'top-left' },
    { id: 'mastering', service: t.services.mastering, position: 'top-right' },
    { id: 'production', service: t.services.production, position: 'bottom-left' },
    { id: 'musicianship', service: t.services.musicianship, position: 'bottom-right' },
  ];

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Hero Text */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 text-center pointer-events-none">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-hero-text mb-4 tracking-tight">
          {t.headline}
        </h1>
        <p className="text-xl md:text-2xl text-hero-text/80 font-light tracking-wide">
          {t.subline}
        </p>
      </div>

      {/* Main Hero Image Container */}
      <div 
        className="relative w-full h-full cursor-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredQuadrant(null)}
      >
        {/* Base Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-300"
          style={{ 
            backgroundImage: `url('/lovable-uploads/d60cfc4b-6c44-42b3-8a9d-f53c0c728f93.png')`,
            filter: hoveredQuadrant ? 'blur(8px) brightness(0.3)' : 'brightness(0.4)'
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-hero-overlay/40" />

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
            onMouseEnter={() => setHoveredQuadrant(quadrant.id)}
            onClick={() => window.location.href = `mailto:info@loelash.com?subject=${quadrant.service.title} Service Inquiry`}
          >
            {/* Quadrant Image (visible on hover) */}
            {hoveredQuadrant === quadrant.id && (
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                style={{ 
                  backgroundImage: `url('/lovable-uploads/d60cfc4b-6c44-42b3-8a9d-f53c0c728f93.png')`,
                  filter: 'brightness(0.7)'
                }}
              />
            )}
            
            {/* Service Content Overlay */}
            <div className={`absolute inset-0 bg-quadrant-overlay/80 transition-all duration-300 ${
              hoveredQuadrant === quadrant.id 
                ? 'opacity-100' 
                : 'opacity-0 group-hover:opacity-100'
            }`}>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 text-hero-text">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {quadrant.service.title}
                </h3>
                <p className="text-sm md:text-base mb-6 opacity-90 max-w-xs">
                  {quadrant.service.description}
                </p>
                <div className="px-6 py-2 border border-hero-text/50 rounded-full text-sm font-medium hover:bg-hero-text hover:text-primary transition-all duration-200">
                  {quadrant.service.cta}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Mouse follower spotlight effect */}
        {hoveredQuadrant && (
          <div 
            className="absolute pointer-events-none transition-all duration-100"
            style={{
              left: mousePosition.x - 100,
              top: mousePosition.y - 100,
              width: 200,
              height: 200,
              background: `radial-gradient(circle, transparent 0%, rgba(0,0,0,0.8) 70%)`,
              borderRadius: '50%',
              zIndex: 20
            }}
          />
        )}
      </div>
    </section>
  );
};