import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const flag = language === 'es' ? '🇪🇸' : '🇺🇸';
  const label = language === 'es' ? 'Español' : 'English';

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="gap-2 text-muted-foreground hover:text-foreground"
    >
      <span className="text-base">{flag}</span>
      <span className="text-xs">{label}</span>
    </Button>
  );
};

export default LanguageSwitcher;
