import { Github, Linkedin, Heart, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import cvData from "@/data/cvData.json";

const Footer = () => {
  const { language, t } = useLanguage();
  const { personal } = cvData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 px-4 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left side */}
          <div className="text-center md:text-left">
            <p className="text-lg font-semibold text-foreground mb-1">
              {personal.shortName}
            </p>
            <p className="text-sm text-muted-foreground">
              {personal.title[language as keyof typeof personal.title]}
            </p>
          </div>

          {/* Center - Social links */}
          <div className="flex items-center gap-4">
            <a 
              href={personal.links.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
            >
              <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
            <a 
              href={personal.links.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-secondary/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
            >
              <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              {t("footer.builtWith")} <Heart className="h-4 w-4 text-destructive fill-destructive" /> {t("footer.and")}
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="hover:bg-primary/10 hover:text-primary"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {personal.shortName}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
