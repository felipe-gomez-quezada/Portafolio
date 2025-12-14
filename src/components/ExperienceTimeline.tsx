import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import cvData from "@/data/cvData.json";

const ExperienceTimeline = () => {
  const { language, t } = useLanguage();
  const { experience } = cvData;

  return (
    <section id="experience" className="py-20 px-4 bg-secondary/20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-secondary text-muted-foreground border-border mb-4">
            {t("exp.badge")}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">{t("exp.title")}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("exp.description")}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent md:-translate-x-1/2" />

          {experience.map((exp, index) => (
            <div
              key={exp.id}
              className={`relative flex flex-col md:flex-row gap-8 mb-12 last:mb-0 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-card border-2 border-primary md:-translate-x-1/2 z-10 shadow-glow" />

              {/* Content */}
              <div className={`flex-1 ml-8 md:ml-0 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                <div className={`bento-item hover:border-primary/50 ${exp.current ? 'border-primary/30' : ''}`}>
                  {/* Header */}
                  <div className={`flex items-start justify-between gap-4 mb-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                    <div className={index % 2 === 0 ? "md:text-right" : ""}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {exp.current && (
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                            {t("exp.current")}
                          </Badge>
                        )}
                        <span className="text-sm font-mono text-muted-foreground">
                          {language === 'es' ? exp.period : exp.periodEn}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground">
                        {exp.role[language as keyof typeof exp.role]}
                      </h3>
                      <div className={`flex items-center gap-2 mt-1 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="text-primary font-medium">{exp.company}</span>
                      </div>
                    </div>
                  </div>

                  {/* Focus area */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-border/50 mb-4 ${index % 2 === 0 ? "md:ml-auto" : ""}`}>
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {exp.focus[language as keyof typeof exp.focus]}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {exp.description[language as keyof typeof exp.description]}
                  </p>
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block flex-1" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceTimeline;
