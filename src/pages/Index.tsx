import { useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TechRadar from "@/components/TechRadar";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import LiveCVModal from "@/components/LiveCVModal";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import cvData from "@/data/cvData.json";

const Index = () => {
  const [isCVOpen, setIsCVOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>{cvData.personal.name} | {cvData.personal.title}</title>
        <meta name="description" content={cvData.personal.subheadline} />
        <meta property="og:title" content={`${cvData.personal.name} | ${cvData.personal.title}`} />
        <meta property="og:description" content={cvData.personal.subheadline} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://felipegomez.dev" />
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
