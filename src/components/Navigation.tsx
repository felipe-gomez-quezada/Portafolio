import { useState, useEffect } from "react";
import { Menu, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link, useLocation, useNavigate } from "react-router-dom";
import cvData from "@/data/cvData.json";

interface NavigationProps {
  onOpenCV: () => void;
}

const Navigation = ({ onOpenCV }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#tech-stack", label: t("nav.techStack"), isRoute: false },
    { href: "#experience", label: t("nav.experience"), isRoute: false },
    { href: "/contacto", label: t("nav.workTogether"), isRoute: true },
  ];

  const scrollToSection = (href: string) => {
    // Si estamos en otra página, navegar a la principal con el hash
    if (location.pathname !== "/") {
      navigate(`/${href}`);
    } else {
      // Si estamos en la página principal, hacer scroll
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold gradient-text">
              {cvData.personal.shortName.split(" ")[0]}
            </span>
            <span className="text-xl font-light text-muted-foreground">
              .dev
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => 
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </button>
              )
            )}
            <LanguageSwitcher />
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenCV}
              className="border-primary/50 text-primary hover:bg-primary/10"
            >
              <FileText className="h-4 w-4 mr-2" />
              {t("nav.viewCV")}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => 
                link.isRoute ? (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="text-left py-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                )
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onOpenCV();
                  setIsMobileMenuOpen(false);
                }}
                className="border-primary/50 text-primary hover:bg-primary/10 w-fit"
              >
                <FileText className="h-4 w-4 mr-2" />
                {t("nav.viewCV")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
