import { useState } from "react";
import { Code2, Layers, Server, Cloud, Zap, Sparkles, Triangle, Database, Bot, BookOpen, Mail, Box, LucideIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import cvData from "@/data/cvData.json";

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Layers,
  Server,
  Cloud,
  Zap,
  Sparkles,
  Triangle,
  Database,
  Bot,
  BookOpen,
  Mail,
  Container: Box,
};

interface TechItem {
  name: string;
  category: string;
  icon: string;
}

interface TechCategoryProps {
  title: string;
  subtitle: string;
  items: TechItem[];
  variant: "production" | "experimental" | "toolkit";
  toolsLabel: string;
  showAll: boolean;
  maxItems: number;
}

const TechCategory = ({ title, subtitle, items, variant, toolsLabel, showAll, maxItems }: TechCategoryProps) => {
  const hasMoreThanMax = items.length > maxItems;
  const displayItems = hasMoreThanMax && !showAll ? items.slice(0, maxItems) : items;

  const variantStyles = {
    production: "border-primary/30 hover:border-primary/60",
    experimental: "border-accent/30 hover:border-accent/60",
    toolkit: "border-muted-foreground/30 hover:border-muted-foreground/60",
  };

  const badgeVariants = {
    production: "bg-primary/20 text-primary border-primary/30",
    experimental: "bg-accent/20 text-accent border-accent/30",
    toolkit: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div className={`bento-item ${variantStyles[variant]} flex flex-col ${!showAll ? 'h-full' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Badge className={`${badgeVariants[variant]} border font-mono text-xs`}>
          {items.length} {toolsLabel}
        </Badge>
      </div>
      <div className={`grid grid-cols-1 gap-3 ${!showAll ? 'flex-1' : ''}`}>
        {displayItems.map((item) => {
          const IconComponent = iconMap[item.icon] || Code2;
          return (
            <div
              key={item.name}
              className="tech-card group flex items-center gap-4"
            >
              <div className={`p-2 rounded-lg ${variant === 'production' ? 'bg-primary/10' : variant === 'experimental' ? 'bg-accent/10' : 'bg-muted'}`}>
                <IconComponent className={`h-5 w-5 ${variant === 'production' ? 'text-primary' : variant === 'experimental' ? 'text-accent' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TechRadar = () => {
  const { language, t } = useLanguage();
  const { techStack } = cvData;
  const [showAll, setShowAll] = useState(false);
  const maxItems = 3;

  // Check if any category has more than maxItems
  const hasMoreItems = 
    techStack.production.items.length > maxItems ||
    techStack.experimental.items.length > maxItems ||
    techStack.toolkit.items.length > maxItems;

  return (
    <section id="tech-stack" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-secondary text-muted-foreground border-border mb-4">
            {t("tech.badge")}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t("tech.title")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("tech.description")}
          </p>
        </div>

        {/* Bento Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${!showAll ? 'items-stretch' : 'items-start'}`}>
          <div className="flex">
            <TechCategory
              title={techStack.production.title[language as keyof typeof techStack.production.title]}
              subtitle={techStack.production.subtitle[language as keyof typeof techStack.production.subtitle]}
              items={techStack.production.items}
              variant="production"
              toolsLabel={t("tech.tools")}
              showAll={showAll}
              maxItems={maxItems}
            />
          </div>
          <div className="flex">
            <TechCategory
              title={techStack.experimental.title[language as keyof typeof techStack.experimental.title]}
              subtitle={techStack.experimental.subtitle[language as keyof typeof techStack.experimental.subtitle]}
              items={techStack.experimental.items}
              variant="experimental"
              toolsLabel={t("tech.tools")}
              showAll={showAll}
              maxItems={maxItems}
            />
          </div>
          <div className="md:col-span-2 lg:col-span-1 flex">
            <TechCategory
              title={techStack.toolkit.title[language as keyof typeof techStack.toolkit.title]}
              subtitle={techStack.toolkit.subtitle[language as keyof typeof techStack.toolkit.subtitle]}
              items={techStack.toolkit.items}
              variant="toolkit"
              toolsLabel={t("tech.tools")}
              showAll={showAll}
              maxItems={maxItems}
            />
          </div>
        </div>

        {/* Global Show More/Less Button */}
        {hasMoreItems && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(!showAll)}
              className="border-border/50 hover:border-primary/50 hover:bg-primary/5"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  {t("tech.showLess")}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  {t("tech.showMore")}
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TechRadar;
