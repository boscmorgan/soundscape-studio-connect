import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Language, heroTranslations } from "@/lib/i18n";
import { mailtoLink } from "@/lib/utils";

interface HeroSectionProps {
  language: Language;
}

const translations = heroTranslations;

interface MobileSectionProps {
  quadrant: {
    id: string;
    service: {
      title: string;
      description: string;
      cta: string;
    };
  };
  index: number;
  activeIndex: number;
  onVisible: (idx: number) => void;
}

const heroImage = '/lovable-uploads/d60cfc4b-6c44-42b3-8a9d-f53c0c728f93.png';

const MobileServiceSection = ({ quadrant, index, activeIndex, onVisible }: MobileSectionProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onVisible(index);
          }
        });
      },
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [index, onVisible]);

  const stateClass =
    index === activeIndex ? 'fade-slide-end' : index < activeIndex ? 'fade-slide-out' : 'fade-slide-start';

  return (
    <div
      ref={ref}
      className="relative sticky top-0 h-screen flex items-center justify-center text-center"
    >
      <button
        className={`relative z-10 max-w-xs p-8 text-white transition-all duration-700 transform focus:outline-none ${stateClass}`}
        onClick={() =>
          (window.location.href = mailtoLink(`${quadrant.service.title} Service Inquiry`))
        }
      >
        <h3 className="text-3xl font-bold mb-4">{quadrant.service.title}</h3>
        <p className="text-base mb-6 opacity-90">{quadrant.service.description}</p>
        <div className="px-6 py-2 border border-white/50 rounded-full text-sm font-medium">
          {quadrant.service.cta}
        </div>
      </button>
    </div>
  );
};

export const HeroSection = ({ language }: HeroSectionProps) => {
  const [hoveredQuadrant, setHoveredQuadrant] = useState<string | null>(null);
  const [isAnyQuadrantHovered, setIsAnyQuadrantHovered] = useState(false);
  const isMobile = useIsMobile();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const t = translations[language];
  const quadrants = [
    { id: 'mixing', service: t.services.mixing, position: 'top-left' },
    { id: 'mastering', service: t.services.mastering, position: 'top-right' },
    { id: 'production', service: t.services.production, position: 'bottom-left' },
    { id: 'musicianship', service: t.services.musicianship, position: 'bottom-right' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const progress = Math.min(window.scrollY / window.innerHeight, quadrants.length);
      setScrollProgress(Math.min(progress, 1));
      const index = Math.min(
        quadrants.length - 1,
        Math.max(Math.round(window.scrollY / window.innerHeight) - 1, 0)
      );
      setActiveIndex(index);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuadrantEnter = (quadrantId: string) => {
    setHoveredQuadrant(quadrantId);
    setIsAnyQuadrantHovered(true);
  };

  const handleMouseLeave = () => {
    setHoveredQuadrant(null);
    setIsAnyQuadrantHovered(false);
  };

  if (isMobile) {
    const mobileHeight = `${(quadrants.length + 1) * 100}vh`;
    return (
      <section className="relative" style={{ height: mobileHeight }}>
        <div className="sticky top-0 h-screen w-screen overflow-hidden">
          <img
            src={heroImage}
            className="h-full w-full object-cover transition-all duration-700"
            style={{ filter: `blur(${8 * scrollProgress}px)` }}
            alt={t.imageAlt}
          />
          <div
            className="absolute inset-0 bg-black transition-opacity duration-700"
            style={{ opacity: 0.4 * scrollProgress }}
          />
        </div>
        {quadrants.map((quadrant, idx) => (
          <MobileServiceSection
            key={quadrant.id}
            quadrant={quadrant}
            index={idx}
            activeIndex={activeIndex}
            onVisible={setActiveIndex}
          />
        ))}
      </section>
    );
  }

  return (
    <section className="relative flex justify-center h-screen min-h-[70vh] overflow-hidden">
      {/* Main Hero Image Container */}
      <div
        className="relative w-full h-full max-w-screen-lg mx-auto cursor-none"
        onMouseLeave={handleMouseLeave}
      >
        {/* Base Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url('${heroImage}')`,
            filter: isAnyQuadrantHovered ? 'blur(4px)' : 'none'
          }}
        />

        {/* Light overlay for text readability when hovered */}
        {isAnyQuadrantHovered && (
          <div className="absolute inset-0 bg-black/20 transition-all duration-500" />
        )}

        {/* Quadrants */}
        {quadrants.map((quadrant) => (
          <button
            key={quadrant.id}
            className={`absolute w-1/2 h-1/2 transition-all duration-300 cursor-pointer group focus:outline-none ${
              quadrant.position === 'top-left' ? 'top-0 left-0' :
              quadrant.position === 'top-right' ? 'top-0 right-0' :
              quadrant.position === 'bottom-left' ? 'bottom-0 left-0' :
              'bottom-0 right-0'
            }`}
            onMouseEnter={() => handleQuadrantEnter(quadrant.id)}
            onFocus={() => handleQuadrantEnter(quadrant.id)}
            onBlur={handleMouseLeave}
            onClick={() =>
              (window.location.href = mailtoLink(`${quadrant.service.title} Service Inquiry`))
            }
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
          </button>
        ))}
      </div>
    </section>
  );
};
