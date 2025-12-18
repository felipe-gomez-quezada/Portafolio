import { X, Printer, Mail, Linkedin, Github, MapPin, Calendar, Briefcase, GraduationCap, Award, Languages, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import cvData from "@/data/cvData.json";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface LiveCVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveCVModal = ({ isOpen, onClose }: LiveCVModalProps) => {
  const { language, t } = useLanguage();
  const { personal, experience, techStack, skills, education, languages: languagesData, certifications } = cvData;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const cvElement = document.querySelector('.cv-container') as HTMLElement;
    if (!cvElement) return;

    try {
      // Crear canvas del CV
      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');

      // Calcular dimensiones del PDF (A4)
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // PRIMERO: Agregar texto real para ATS (antes de la imagen para que esté en el fondo)
      // El texto será invisible pero presente para los sistemas ATS
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255); // Texto blanco (invisible sobre fondo blanco pero presente en el PDF)

      // Construir todo el texto del CV
      let fullText = `${personal.name}\n`;
      fullText += `${personal.title[language as keyof typeof personal.title]}\n`;
      fullText += `${personal.email} | ${personal.phone} | ${personal.location}\n`;
      fullText += `${personal.links.linkedin} | ${personal.links.github}\n\n`;
      fullText += `PROFESSIONAL EXPERIENCE\n`;
      experience.forEach((exp) => {
        fullText += `${exp.role[language as keyof typeof exp.role]} | ${exp.company} | ${language === 'es' ? exp.period : exp.periodEn}\n`;
        fullText += `${exp.focus[language as keyof typeof exp.focus]}\n`;
        fullText += `${exp.description[language as keyof typeof exp.description]}\n\n`;
      });
      fullText += `EDUCATION\n`;
      education.forEach((edu) => {
        fullText += `${edu.degree[language as keyof typeof edu.degree]} | ${edu.institution} | ${edu.period}\n`;
        if (edu.description[language as keyof typeof edu.description]) {
          fullText += `${edu.description[language as keyof typeof edu.description]}\n`;
        }
        fullText += `\n`;
      });
      fullText += `SKILLS: ${skills[language as keyof typeof skills].join(', ')}\n\n`;
      fullText += `TECHNICAL STACK: `;
      techStack.production.items.forEach((item) => {
        fullText += `${item.name} (${item.category}), `;
      });
      techStack.experimental.items.forEach((item) => {
        fullText += `${item.name} (${item.category}), `;
      });
      fullText += `\n\n`;
      fullText += `LANGUAGES\n`;
      languagesData.forEach((lang) => {
        fullText += `${lang.language[language as keyof typeof lang.language]}: ${lang.level[language as keyof typeof lang.level]}\n`;
      });
      fullText += `\nCERTIFICATIONS\n`;
      certifications.forEach((cert) => {
        fullText += `${cert.name} | ${cert.issuer} | ${cert.date}\n`;
        fullText += `${cert.description[language as keyof typeof cert.description]}\n\n`;
      });

      // Agregar texto invisible al final del PDF (fuera del área visible pero presente)
      const textLines = fullText.split('\n');
      textLines.forEach((line, index) => {
        pdf.text(line, 0, pdfHeight * 10 + (index * 0.1)); // Fuera del área visible
      });

      // SEGUNDO: Agregar imagen visual del CV
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // Agregar metadatos para ATS
      pdf.setProperties({
        title: `${personal.name} - CV`,
        subject: 'Curriculum Vitae',
        author: personal.name,
        keywords: skills[language as keyof typeof skills].join(', ') + ', ' +
                 techStack.production.items.map(i => i.name).join(', '),
        creator: 'Portfolio Website'
      });

      // Descargar PDF
      pdf.save(`${personal.shortName.replace(/\s+/g, '_')}_CV_${language.toUpperCase()}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback a print si falla
      window.print();
    }
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
                onClick={handleDownloadPDF}
                className="border-border/50 hover:border-primary/50"
              >
                <Download className="h-4 w-4 mr-2" />
                {t("cv.print")}
                <span className="ml-2 text-sm">{language === 'es' ? '🇪🇸' : '🇺🇸'}</span>
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
                    {languagesData.map((lang, index) => (
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
