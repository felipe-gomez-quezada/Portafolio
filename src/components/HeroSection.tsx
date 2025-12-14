import { Download, Github, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import cvData from "@/data/cvData.json";

interface HeroSectionProps {
  onOpenCV: () => void;
}

const HeroSection = ({ onOpenCV }: HeroSectionProps) => {
  const { language, t } = useLanguage();
  const { personal } = cvData;

  const headline = personal.headline[language as keyof typeof personal.headline];
  const subheadline = personal.subheadline[language as keyof typeof personal.subheadline];
  const [headlinePart1, headlinePart2] = headline.split("&");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float animation-delay-400" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-border/20 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-border/10 rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm text-muted-foreground">{t("hero.available")}</span>
        </div>

        {/* Name */}
        <h2 className="text-lg md:text-xl font-mono text-primary mb-4 animate-fade-in animation-delay-200">
          {personal.shortName}
        </h2>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in animation-delay-400">
          <span className="gradient-text">{headlinePart1}&</span>
          <br />
          <span className="text-foreground">{headlinePart2}</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in animation-delay-600">
          {subheadline}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in animation-delay-600">
          <Button 
            size="lg" 
            className="group bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 font-semibold"
            onClick={onOpenCV}
          >
            <Download className="mr-2 h-4 w-4" />
            {t("hero.downloadCV")}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="group border-border/50 hover:border-primary/50 hover:bg-primary/5 px-8 h-12"
            asChild
          >
            <a href={personal.links.github} target="_blank" rel="noopener noreferrer">
              <Github className="mr-2 h-4 w-4" />
              {t("hero.viewGithub")}
            </a>
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 animate-fade-in animation-delay-600">
          <a 
            href={personal.links.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          >
            <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          </a>
          <a 
            href={personal.links.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
          >
            <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-border/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
