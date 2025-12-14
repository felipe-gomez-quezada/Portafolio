import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TechRadar from "@/components/TechRadar";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import LiveCVModal from "@/components/LiveCVModal";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import cvData from "@/data/cvData.json";

const Index = () => {
  const [isCVOpen, setIsCVOpen] = useState(false);
  const { language } = useLanguage();

  const title = cvData.personal.title[language as keyof typeof cvData.personal.title];
  const description = cvData.personal.subheadline[language as keyof typeof cvData.personal.subheadline];

  return (
    <>
      <Helmet>
        <title>{cvData.personal.shortName} | {title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={`${cvData.personal.shortName} | ${title}`} />
        <meta property="og:description" content={description} />
        <meta name="robots" content="index, follow" />
        <html lang={language} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation onOpenCV={() => setIsCVOpen(true)} />
        
        <main>
          <HeroSection onOpenCV={() => setIsCVOpen(true)} />
          <TechRadar />
          <ExperienceTimeline />
        </main>

        <Footer />

        <LiveCVModal isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} />
      </div>
    </>
  );
};

export default Index;
