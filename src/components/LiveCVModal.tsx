import { useRef } from "react";
import { X, Printer, Mail, Linkedin, Github, MapPin, Calendar, Briefcase, GraduationCap, Award, Languages, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
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
  const cvContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  // Función auxiliar para convertir HSL a RGB
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  };

  const handleDownloadPDF = async () => {
    const cvElement = cvContainerRef.current;
    if (!cvElement) return;

    try {
      // Obtener el color de fondo del tema actual
      const computedStyle = getComputedStyle(document.documentElement);
      const bgColorHSL = computedStyle.getPropertyValue('--card').trim();
      let bgColorRGB: [number, number, number] = [15, 23, 42]; // Default dark color

      if (bgColorHSL) {
        const hslValues = bgColorHSL.split(' ').map(v => parseFloat(v));
        if (hslValues.length >= 3) {
          bgColorRGB = hslToRgb(hslValues[0], hslValues[1], hslValues[2]);
        }
      }

      const bgColorString = `rgb(${bgColorRGB.join(', ')})`;

      // Esperar un momento para asegurar que todos los estilos estén aplicados
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capturar el elemento con html2canvas
      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: bgColorString,
        width: cvElement.scrollWidth,
        height: cvElement.scrollHeight,
        windowWidth: cvElement.scrollWidth,
        windowHeight: cvElement.scrollHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        allowTaint: true,
        removeContainer: false,
        imageTimeout: 15000,
        onclone: (clonedDoc, element) => {
          // Asegurar que el body tenga el fondo correcto
          const body = clonedDoc.body;
          if (body) {
            body.style.backgroundColor = bgColorString;
            body.style.margin = '0';
            body.style.padding = '0';
          }

          // Asegurar que el html tenga el fondo correcto
          const html = clonedDoc.documentElement;
          if (html) {
            html.style.backgroundColor = bgColorString;
            html.style.margin = '0';
            html.style.padding = '0';
          }

          // Asegurar que el elemento clonado mantenga sus estilos
          const clonedElement = clonedDoc.querySelector('.cv-container') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.transform = 'translateZ(0)';
            clonedElement.style.backgroundColor = bgColorString;
          }
        },
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      // Crear PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Convertir dimensiones del canvas a mm
      // html2canvas con scale 2: 1px canvas = 0.5px real = 0.132292mm
      const pxToMm = 0.264583 / 2;
      const imgWidthMm = canvas.width * pxToMm;
      const imgHeightMm = canvas.height * pxToMm;

      // Calcular ratio para ajustar al ancho de la página
      const ratio = pdfWidth / imgWidthMm;
      const scaledWidth = imgWidthMm * ratio;
      const scaledHeight = imgHeightMm * ratio;

      // Si la altura es mayor que una página, ajustar
      let finalWidth = scaledWidth;
      let finalHeight = scaledHeight;
      let finalX = 0;
      let finalY = 0;

      if (scaledHeight > pdfHeight) {
        // Ajustar por altura
        const heightRatio = pdfHeight / imgHeightMm;
        finalWidth = imgWidthMm * heightRatio;
        finalHeight = pdfHeight;
        finalX = (pdfWidth - finalWidth) / 2; // Centrar horizontalmente
        finalY = 0; // Sin margen superior
      } else {
        // Si el contenido es más pequeño que una página, centrar verticalmente
        finalY = (pdfHeight - scaledHeight) / 2;
      }

      // Rellenar fondo
      pdf.setFillColor(bgColorRGB[0], bgColorRGB[1], bgColorRGB[2]);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      // Agregar imagen
      pdf.addImage(imgData, 'PNG', finalX, finalY, finalWidth, finalHeight);

      // Agregar enlaces clicables sobre la imagen
      // Calcular factor de escala: usar las dimensiones del canvas que es lo que realmente se capturó
      // El canvas tiene scale 2, así que canvas.width = elemento.width * 2
      // Necesitamos convertir de píxeles del elemento a mm del PDF usando el mismo ratio que la imagen
      const elementToPdfRatioX = finalWidth / imgWidthMm;
      const elementToPdfRatioY = finalHeight / imgHeightMm;
      
      // Función auxiliar para convertir posición del elemento a posición del PDF
      const elementToPdf = (elementX: number, elementY: number, elementWidth: number, elementHeight: number) => {
        // Convertir píxeles del elemento a mm, luego escalar al tamaño final del PDF
        const xMm = elementX * pxToMm * elementToPdfRatioX;
        const yMm = elementY * pxToMm * elementToPdfRatioY;
        const widthMm = elementWidth * pxToMm * elementToPdfRatioX;
        const heightMm = elementHeight * pxToMm * elementToPdfRatioY;
        
        return {
          x: finalX + xMm,
          y: finalY + yMm,
          width: widthMm,
          height: heightMm
        };
      };

      // Obtener posiciones relativas al contenedor
      const cvRect = cvElement.getBoundingClientRect();
      
      // Email - buscar el span que contiene el email
      const emailSpans = Array.from(cvElement.querySelectorAll('span'));
      const emailElement = emailSpans.find(el => el.textContent?.trim() === personal.email) as HTMLElement;
      if (emailElement) {
        const emailRect = emailElement.getBoundingClientRect();
        const emailRelativeX = emailRect.left - cvRect.left;
        const emailRelativeY = emailRect.top - cvRect.top;
        const emailPos = elementToPdf(emailRelativeX, emailRelativeY, emailRect.width, emailRect.height);
        
        // Agregar enlace de email
        pdf.link(emailPos.x, emailPos.y, emailPos.width, emailPos.height, {
          url: `mailto:${personal.email}`
        });
      }
      
      // LinkedIn - buscar el enlace de LinkedIn
      const linkedinElement = cvElement.querySelector(`a[href="${personal.links.linkedin}"]`) as HTMLElement;
      if (linkedinElement) {
        const linkedinRect = linkedinElement.getBoundingClientRect();
        const linkedinRelativeX = linkedinRect.left - cvRect.left;
        const linkedinRelativeY = linkedinRect.top - cvRect.top;
        const linkedinPos = elementToPdf(linkedinRelativeX, linkedinRelativeY, linkedinRect.width, linkedinRect.height);
        
        // Agregar enlace clicable
        pdf.link(linkedinPos.x, linkedinPos.y, linkedinPos.width, linkedinPos.height, {
          url: personal.links.linkedin
        });
      }

      // GitHub - buscar el enlace de GitHub
      const githubElement = cvElement.querySelector(`a[href="${personal.links.github}"]`) as HTMLElement;
      if (githubElement) {
        const githubRect = githubElement.getBoundingClientRect();
        const githubRelativeX = githubRect.left - cvRect.left;
        const githubRelativeY = githubRect.top - cvRect.top;
        const githubPos = elementToPdf(githubRelativeX, githubRelativeY, githubRect.width, githubRect.height);
        
        // Agregar enlace clicable
        pdf.link(githubPos.x, githubPos.y, githubPos.width, githubPos.height, {
          url: personal.links.github
        });
      }

      // Agregar texto invisible para ATS (fuera del área visible)
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);

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

      // Agregar texto invisible fuera del área visible
      const textLines = fullText.split('\n');
      textLines.forEach((line, index) => {
        pdf.text(line, 0, pdfHeight * 10 + (index * 0.1));
      });

      // Agregar metadatos
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
              <LanguageSwitcher />
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                className="border-border/50 hover:border-primary/50"
              >
                <Download className="h-4 w-4 mr-2" />
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
          <div ref={cvContainerRef} className="cv-container bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
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
                  <div className="flex items-baseline gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{personal.location}</span>
                  </div>

                  <div className="flex items-baseline gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{personal.email}</span>
                  </div>

                  {/* Repetir items-center para LinkedIn y GitHub */}
                  <a
                    href={personal.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-baseline gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="text-xs">Felipe Gómez Quezada</span>
                  </a>
                  <a
                    href={personal.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-baseline gap-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span className="text-xs">felipe-gomez-quezada</span>
                  </a>
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
                          <div className="flex items-baseline gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                            <span>{language === 'es' ? exp.period : exp.periodEn}</span>
                          </div>
                        </div>
                        <p className="text-primary font-medium text-sm mb-2">{exp.company}</p>
                        <Badge variant="secondary" className="mb-2 text-xs px-2.5 py-1.5 flex items-center justify-center" style={{ lineHeight: '1.2' }}>
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
                  <div className="flex flex-wrap gap-1.5">
                    {skills[language as keyof typeof skills].map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="border-primary/30 text-foreground hover:bg-primary/10 transition-colors text-xs px-2.5 py-1.5 flex items-center justify-center"
                        style={{ lineHeight: '1.2' }}
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
                      <div className="flex flex-wrap gap-1.5">
                        {techStack.production.items.map((item) => (
                          <Badge key={item.name} variant="secondary" className="text-xs px-2.5 py-1.5 flex items-center justify-center" style={{ lineHeight: '1.2' }}>
                            {item.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-accent mb-2">
                        {techStack.experimental.title[language as keyof typeof techStack.experimental.title]}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {techStack.experimental.items.map((item) => (
                          <Badge key={item.name} variant="secondary" className="text-xs bg-accent/10 px-2.5 py-1.5 flex items-center justify-center" style={{ lineHeight: '1.2' }}>
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
