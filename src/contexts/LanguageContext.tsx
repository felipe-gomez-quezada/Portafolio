import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  es: {
    // Navigation
    "nav.techStack": "Stack Tecnológico",
    "nav.experience": "Experiencia",
    "nav.viewCV": "Ver CV",
    
    // Hero
    "hero.available": "Disponible para consultoría",
    "hero.headline.part1": "Construyendo Equipos Tech de Alto Rendimiento",
    "hero.headline.part2": "& Arquitecturas Escalables.",
    "hero.subheadline": "CTO especializado en escalar startups. Transformando visión de negocio en realidad de ingeniería.",
    "hero.downloadCV": "Descargar CV",
    "hero.viewGithub": "Ver GitHub",
    
    // Tech Radar
    "tech.badge": "Tech Radar",
    "tech.title": "Stack Tecnológico",
    "tech.description": "Una colección curada de herramientas y tecnologías que uso para construir sistemas escalables y liderar equipos de alto rendimiento.",
    "tech.production.title": "Stack de Producción",
    "tech.production.subtitle": "Expertise Actual",
    "tech.experimental.title": "Laboratorio Experimental",
    "tech.experimental.subtitle": "Aprendiendo Actualmente",
    "tech.toolkit.title": "Toolkit CTO",
    "tech.toolkit.subtitle": "Productividad & IA",
    "tech.tools": "herramientas",
    
    // Experience
    "exp.badge": "Trayectoria",
    "exp.title": "Experiencia",
    "exp.description": "Un historial de liderazgo en transformaciones tecnológicas y construcción de equipos que entregan resultados.",
    "exp.current": "Actual",
    
    // CV Modal
    "cv.title": "CV en Vivo",
    "cv.print": "Imprimir PDF",
    "cv.professionalExp": "Experiencia Profesional",
    "cv.coreCompetencies": "Competencias Clave",
    "cv.technicalStack": "Stack Técnico",
    "cv.education": "Formación Académica",
    "cv.languages": "Idiomas",
    "cv.certifications": "Certificaciones",
    
    // Footer
    "footer.builtWith": "Construido con",
    "footer.and": "y React",
    "footer.rights": "Todos los derechos reservados.",
    
    // Languages
    "lang.spanish": "Español",
    "lang.english": "Inglés",
    "lang.native": "Lengua materna",
    "lang.upperIntermediate": "Nivel Upper-Intermediate",
  },
  en: {
    // Navigation
    "nav.techStack": "Tech Stack",
    "nav.experience": "Experience",
    "nav.viewCV": "View CV",
    
    // Hero
    "hero.available": "Available for consulting",
    "hero.headline.part1": "Building High-Performance Tech Teams",
    "hero.headline.part2": "& Scalable Architectures.",
    "hero.subheadline": "CTO specialized in scaling startups. Transforming business vision into engineering reality.",
    "hero.downloadCV": "Download CV",
    "hero.viewGithub": "View GitHub",
    
    // Tech Radar
    "tech.badge": "Tech Radar",
    "tech.title": "Technology Stack",
    "tech.description": "A curated collection of tools and technologies I use to build scalable systems and lead high-performance teams.",
    "tech.production.title": "Production Stack",
    "tech.production.subtitle": "Current Expertise",
    "tech.experimental.title": "Experimental Lab",
    "tech.experimental.subtitle": "Currently Learning",
    "tech.toolkit.title": "CTO Toolkit",
    "tech.toolkit.subtitle": "Productivity & AI",
    "tech.tools": "tools",
    
    // Experience
    "exp.badge": "Career Path",
    "exp.title": "Experience",
    "exp.description": "A track record of leading technical transformations and building teams that deliver.",
    "exp.current": "Current",
    
    // CV Modal
    "cv.title": "Live CV",
    "cv.print": "Print to PDF",
    "cv.professionalExp": "Professional Experience",
    "cv.coreCompetencies": "Core Competencies",
    "cv.technicalStack": "Technical Stack",
    "cv.education": "Education",
    "cv.languages": "Languages",
    "cv.certifications": "Certifications",
    
    // Footer
    "footer.builtWith": "Built with",
    "footer.and": "and React",
    "footer.rights": "All rights reserved.",
    
    // Languages
    "lang.spanish": "Spanish",
    "lang.english": "English",
    "lang.native": "Native language",
    "lang.upperIntermediate": "Upper-Intermediate Level",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['es']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
