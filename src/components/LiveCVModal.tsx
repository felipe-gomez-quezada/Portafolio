import { X, Printer, Mail, Linkedin, Github, MapPin, Calendar, Briefcase, GraduationCap, Award, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import cvData from "@/data/cvData.json";

interface LiveCVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveCVModal = ({ isOpen, onClose }: LiveCVModalProps) => {
  const { language, t } = useLanguage();
  const { personal, experience, techStack, skills, education, languages, certifications } = cvData;

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm overflow-y-auto no-print">
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Modal Header - Hidden on print */}
          <div className="flex items-center justify-between mb-6 no-print">
            <h2 className="text-2xl font-bold text-foreground">{t("cv.title")}</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="border-border/50 hover:border-primary/50"
              >
                <Printer className="h-4 w-4 mr-2" />
                {t("cv.print")}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* CV Document */}
          <div className="cv-container bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            {/* CV Header */}
            <div className="cv-header bg-gradient-to-r from-primary/10 to-accent/10 p-8 border-b border-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {personal.name}
                  </h1>
                  <p className="text-xl text-primary font-medium mb-4">
                    {personal.title[language as keyof typeof personal.title]}
                  </p>
                  <p className="text-muted-foreground max-w-md">
                    {personal.subheadline[language as keyof typeof personal.subheadline]}
                  </p>
                </div>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{personal.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary" />
                    <span>{personal.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a 
                      href={personal.links.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="text-xs">LinkedIn</span>
                    </a>
                    <a 
                      href={personal.links.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span className="text-xs">GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CV Body */}
            <div className="p-8 grid md:grid-cols-3 gap-8">
              {/* Main Column - Experience */}
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    {t("cv.professionalExp")}
                  </h2>
                  <div className="space-y-6">
                    {experience.map((exp) => (
                      <div key={exp.id} className="relative pl-6 border-l-2 border-border hover:border-primary/50 transition-colors">
                        <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-primary -translate-x-[5px]" />
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {exp.role[language as keyof typeof exp.role]}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{language === 'es' ? exp.period : exp.periodEn}</span>
                          </div>
                        </div>
                        <p className="text-primary font-medium text-sm mb-2">{exp.company}</p>
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {exp.focus[language as keyof typeof exp.focus]}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          {exp.description[language as keyof typeof exp.description]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    {t("cv.education")}
                  </h2>
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={index} className="relative pl-6 border-l-2 border-border">
                        <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-accent -translate-x-[5px]" />
                        <h3 className="font-semibold text-foreground">
                          {edu.degree[language as keyof typeof edu.degree]}
                        </h3>
                        <p className="text-sm text-primary">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground">{edu.period}</p>
                        {edu.description[language as keyof typeof edu.description] && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {edu.description[language as keyof typeof edu.description]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Skills */}
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4">{t("cv.coreCompetencies")}</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills[language as keyof typeof skills].map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="border-primary/30 text-foreground hover:bg-primary/10 transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Tech Stack */}
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4">{t("cv.technicalStack")}</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-primary mb-2">
                        {techStack.production.title[language as keyof typeof techStack.production.title]}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {techStack.production.items.map((item) => (
                          <Badge key={item.name} variant="secondary" className="text-xs">
                            {item.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-accent mb-2">
                        {techStack.experimental.title[language as keyof typeof techStack.experimental.title]}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {techStack.experimental.items.map((item) => (
                          <Badge key={item.name} variant="secondary" className="text-xs bg-accent/10">
                            {item.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Languages */}
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Languages className="h-4 w-4 text-primary" />
                    {t("cv.languages")}
                  </h2>
                  <div className="space-y-2">
                    {languages.map((lang, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {lang.language[language as keyof typeof lang.language]}
                        </span>
                        <span className="text-muted-foreground">
                          {lang.level[language as keyof typeof lang.level]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Certifications */}
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    {t("cv.certifications")}
                  </h2>
                  <div className="space-y-3">
                    {certifications.map((cert, index) => (
                      <div key={index}>
                        <p className="font-medium text-foreground text-sm">{cert.name}</p>
                        <p className="text-xs text-primary">{cert.issuer} - {cert.date}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {cert.description[language as keyof typeof cert.description]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCVModal;
