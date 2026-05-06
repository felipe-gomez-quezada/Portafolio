import { X, Mail, Linkedin, Github, MapPin, Calendar, Briefcase, GraduationCap, Award, Languages, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import cvData from "@/data/cvData.json";
import jsPDF from 'jspdf';

interface LiveCVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveCVModal = ({ isOpen, onClose }: LiveCVModalProps) => {
  const { language, t } = useLanguage();
  const { personal, experience, techStack, skills, education, languages: languagesData, certifications } = cvData;
  const hasCertifications = certifications.length > 0;
  const handleDownloadPDF = () => {
    const lang = language as 'es' | 'en';
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pW = 210, pH = 297;
    const mL = 14, mR = 14, mT = 14;
    const totalW = pW - mL - mR; // 182mm

    const rightW = 54;
    const divGap = 7;
    const leftW = totalW - rightW - divGap; // 121mm
    const rightX = mL + leftW + divGap;

    const LH = { xs: 3.3, sm: 3.8, md: 4.2, lg: 5.0 };

    type RGB = { r: number; g: number; b: number };
    const rgb = (r: number, g: number, b: number): RGB => ({ r, g, b });
    const C = {
      ink:     rgb(15, 15, 15),
      heading: rgb(30, 30, 30),
      body:    rgb(55, 55, 55),
      sub:     rgb(85, 85, 85),
      muted:   rgb(115, 115, 115),
      faint:   rgb(155, 155, 155),
      rule:    rgb(185, 185, 185),
      light:   rgb(220, 220, 220),
    };

    const applyFill  = (c: RGB) => pdf.setFillColor(c.r, c.g, c.b);
    const applyDraw  = (c: RGB) => pdf.setDrawColor(c.r, c.g, c.b);
    const applyText  = (c: RGB) => pdf.setTextColor(c.r, c.g, c.b);

    const font = (size: number, bold = false, color: RGB = C.body) => {
      pdf.setFontSize(size);
      pdf.setFont('helvetica', bold ? 'bold' : 'normal');
      applyText(color);
    };

    const tw = (str: string, size: number) =>
      pdf.getStringUnitWidth(str) * size / pdf.internal.scaleFactor;

    const wrap = (str: string, maxW: number) =>
      pdf.splitTextToSize(str, maxW) as string[];

    const hLine = (x: number, y: number, w: number, color: RGB = C.rule, lw = 0.25) => {
      applyDraw(color);
      pdf.setLineWidth(lw);
      pdf.line(x, y, x + w, y);
    };

    const section = (x: number, y: number, w: number, title: string): number => {
      font(7.5, true, C.ink);
      pdf.text(title.toUpperCase(), x, y);
      hLine(x, y + 1.8, w, C.rule, 0.4);
      return y + 6;
    };

    // ── TOP ACCENT BAR ──
    applyFill(C.ink);
    pdf.rect(0, 0, pW, 3.5, 'F');

    // ── HEADER ──
    let hy = mT + 6;

    font(21, true, C.ink);
    pdf.text(personal.name, mL, hy);
    hy += 6.5;

    font(10.5, false, C.sub);
    pdf.text(personal.title[lang], mL, hy);
    hy += 5.2;

    // Strip emoji before wrapping — jsPDF Helvetica can't measure emoji width correctly
    const summaryText = personal.subheadline[lang].replace(/\p{Emoji}/gu, '').replace(/\s{2,}/g, ' ').trim();
    font(8, false, C.muted);
    const summaryLines = wrap(summaryText, 100);
    pdf.text(summaryLines, mL, hy);

    // Contact block (right-aligned)
    const cx = pW - mR;
    let cy = mT + 6;
    const contacts: { label: string; url: string | null }[] = [
      { label: personal.email,                          url: `mailto:${personal.email}` },
      { label: personal.phone,                          url: null },
      { label: personal.location,                       url: null },
      { label: 'linkedin.com/in/felipegomezquezada',   url: personal.links.linkedin },
      { label: 'github.com/felipe-gomez-quezada',      url: personal.links.github },
    ];

    contacts.forEach(item => {
      font(7.5, false, item.url ? C.sub : C.muted);
      pdf.text(item.label, cx, cy, { align: 'right' });
      if (item.url) {
        const w = tw(item.label, 7.5);
        pdf.link(cx - w, cy - 3.2, w, 3.8, { url: item.url });
      }
      cy += 4.4;
    });

    const summaryLineMm = 3.55;
    const summaryBottomY = hy + summaryLines.length * summaryLineMm;
    const contactsBottomY = cy + 1;
    const headerBottom = Math.max(mT + 47, summaryBottomY + 9, contactsBottomY + 4);
    hLine(mL, headerBottom, totalW, C.ink, 0.6);

    // ── BODY ──
    const bodyY = headerBottom + 7;
    const footerY = pH - 8;
    const footerRuleY = footerY - 3;
    const sidebarTop = bodyY - 4;
    const sidebarBottomInset = 0.35;
    const sidebarH = Math.max(0, footerRuleY - sidebarTop - sidebarBottomInset);
    let lY = bodyY;
    let rY = bodyY;

    // ── LEFT: EXPERIENCE ──
    lY = section(mL, lY, leftW, t('cv.professionalExp'));

    experience.forEach((exp, i) => {
      if (i > 0) {
        lY += 4;
        hLine(mL, lY, leftW, C.light, 0.2);
        lY += 5;
      }

      const period = lang === 'es' ? exp.period : exp.periodEn;

      font(9, true, C.heading);
      pdf.text(exp.role[lang], mL, lY);
      font(7.5, false, C.faint);
      pdf.text(period, mL + leftW, lY, { align: 'right' });
      lY += LH.md;

      font(8.5, false, C.body);
      pdf.text(exp.company, mL, lY);
      lY += LH.md;

      font(8, false, C.muted);
      pdf.text(exp.focus[lang], mL, lY);
      lY += LH.md;

      font(7.5, false, C.sub);
      const descLines = wrap(exp.description[lang], leftW);
      pdf.text(descLines, mL, lY);
      lY += descLines.length * LH.xs + 2.5;
    });

    lY += 6;

    // ── LEFT: EDUCATION ──
    lY = section(mL, lY, leftW, t('cv.education'));

    education.forEach((edu, i) => {
      if (i > 0) lY += 2;

      font(9, true, C.heading);
      const degLines = wrap(edu.degree[lang], leftW - 22);
      pdf.text(degLines, mL, lY);
      font(7.5, false, C.faint);
      pdf.text(edu.period, mL + leftW, lY, { align: 'right' });
      lY += degLines.length * LH.md;

      font(8.5, false, C.body);
      pdf.text(edu.institution, mL, lY);
      lY += LH.md;

      const desc = edu.description[lang];
      if (desc) {
        font(7.5, false, C.muted);
        const dLines = wrap(desc, leftW);
        pdf.text(dLines, mL, lY);
        lY += dLines.length * LH.xs + 1;
      }
      lY += 2;
    });

    // ── RIGHT SIDEBAR background (termina en la misma Y que la regla del pie) ──
    applyFill(rgb(248, 248, 248));
    pdf.rect(rightX - 3, sidebarTop, rightW + 5, sidebarH, 'F');

    // ── RIGHT: SKILLS ──
    rY = section(rightX, rY, rightW, t('cv.coreCompetencies'));

    skills[lang].forEach(skill => {
      font(8, false, C.body);
      pdf.text(`• ${skill}`, rightX, rY);
      rY += LH.md;
    });
    rY += 5;

    // ── RIGHT: TECH STACK ──
    rY = section(rightX, rY, rightW, t('cv.technicalStack'));

    font(7.5, true, C.sub);
    pdf.text(techStack.production.title[lang], rightX, rY);
    rY += 4;
    techStack.production.items.forEach(item => {
      font(7.5, false, C.body);
      pdf.text(`• ${item.name}`, rightX, rY);
      rY += LH.sm;
    });
    rY += 3;

    font(7.5, true, C.sub);
    pdf.text(techStack.experimental.title[lang], rightX, rY);
    rY += 4;
    techStack.experimental.items.forEach(item => {
      font(7.5, false, C.body);
      pdf.text(`• ${item.name}`, rightX, rY);
      rY += LH.sm;
    });
    rY += 5;

    // ── RIGHT: LANGUAGES ──
    rY = section(rightX, rY, rightW, t('cv.languages'));

    languagesData.forEach(langItem => {
      font(8, true, C.heading);
      pdf.text(langItem.language[lang], rightX, rY);
      font(7.5, false, C.muted);
      pdf.text(langItem.level[lang], rightX + rightW, rY, { align: 'right' });
      rY += LH.lg;
    });
    rY += 4;

    if (hasCertifications) {
      // ── RIGHT: CERTIFICATIONS ──
      rY = section(rightX, rY, rightW, t('cv.certifications'));

      certifications.forEach((cert, i) => {
        if (i > 0) rY += 3;

        font(8, true, C.heading);
        const certLines = wrap(cert.name, rightW);
        pdf.text(certLines, rightX, rY);
        rY += certLines.length * LH.md;

        font(7.5, false, C.sub);
        pdf.text(`${cert.issuer} · ${cert.date}`, rightX, rY);
        rY += LH.sm;

        font(7.5, false, C.muted);
        const certDescLines = wrap(cert.description[lang], rightW);
        pdf.text(certDescLines, rightX, rY);
        rY += certDescLines.length * LH.xs;
      });
    }

    // ── COLUMN DIVIDER (misma altura que el fondo gris hasta la regla del pie) ──
    const colDivX = mL + leftW + divGap / 2;
    applyDraw(C.light);
    pdf.setLineWidth(0.25);
    pdf.line(colDivX, sidebarTop, colDivX, footerRuleY - sidebarBottomInset);

    // ── FOOTER ──
    hLine(mL, footerRuleY, totalW, C.light, 0.2);
    font(6.5, false, C.faint);
    pdf.text(personal.name, mL, footerY);
    pdf.text(String(new Date().getFullYear()), pW - mR, footerY, { align: 'right' });

    // ── METADATA ──
    pdf.setProperties({
      title: `${personal.name} - CV`,
      subject: 'Curriculum Vitae',
      author: personal.name,
      keywords: [
        ...skills[lang],
        ...techStack.production.items.map(i => i.name),
        ...techStack.experimental.items.map(i => i.name),
      ].join(', '),
      creator: 'Portfolio Website',
    });

    pdf.save(`${personal.shortName.replace(/\s+/g, '_')}_CV_${lang.toUpperCase()}.pdf`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm overflow-y-auto no-print">
      <div className="min-h-screen py-8 px-4">
        <div className="w-full max-w-[210mm] mx-auto">
          {/* Modal Header - Hidden on print */}
          <div className="flex items-center justify-between mb-6 no-print">
            <h2 className="text-2xl font-bold text-foreground">{t("cv.title")}</h2>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                title={t("cv.atsDownloadTitle")}
                aria-label={`${t("cv.atsDownloadPrimary")}. ${t("cv.atsDownloadSecondary")}. ${t("cv.atsDownloadTitle")}`}
                className="group border-border/50 hover:border-primary/50 focus-visible:border-primary/50 focus-visible:bg-accent h-auto min-h-9 gap-2 py-2 px-3 focus-visible:text-accent-foreground"
              >
                <Download
                  className="h-4 w-4 shrink-0 self-center text-foreground transition-colors group-hover:text-accent-foreground group-focus-visible:text-accent-foreground"
                  aria-hidden
                />
                <span className="flex flex-col items-start text-left leading-tight">
                  <span className="text-sm font-medium transition-colors group-hover:text-accent-foreground group-focus-visible:text-accent-foreground">
                    {t("cv.atsDownloadPrimary")}
                  </span>
                  <span className="text-[10px] font-normal text-muted-foreground transition-colors group-hover:text-accent-foreground group-focus-visible:text-accent-foreground">
                    {t("cv.atsDownloadSecondary")}
                  </span>
                </span>
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
                  <p className="text-muted-foreground max-w-xl md:max-w-2xl leading-relaxed">
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

            {/* CV Body: flex en impresión (index.css) mantiene borde lateral y fondo gris a toda la altura */}
            <div className="cv-body flex flex-col gap-8 p-8 md:flex-row md:items-stretch md:gap-0">
              {/* Main Column - Experience */}
              <div className="min-w-0 space-y-8 md:flex-[2] md:min-w-0 md:pr-6 lg:pr-8">
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    {t("cv.professionalExp")}
                  </h2>
                  <div className="space-y-10">
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

              {/* Sidebar: borde vertical y fondo alineados con la altura de la columna principal */}
              <aside className="min-w-0 space-y-8 border-t border-border pt-8 md:flex-1 md:min-w-0 md:border-l md:border-t-0 md:border-border md:bg-muted/50 md:pl-6 md:pr-5 md:pt-0 lg:pl-7 lg:pr-6">
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

                <Separator className="mx-auto h-px !w-[calc(100%-0.75rem)] max-w-full bg-border" />

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

                <Separator className="mx-auto h-px !w-[calc(100%-0.75rem)] max-w-full bg-border" />

                {/* Languages */}
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Languages className="h-4 w-4 text-primary" />
                    {t("cv.languages")}
                  </h2>
                  <div className="space-y-2.5">
                    {languagesData.map((lang, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-3 gap-y-0.5 items-baseline text-sm"
                      >
                        <span className="text-foreground shrink-0">
                          {lang.language[language as keyof typeof lang.language]}
                        </span>
                        <span className="min-w-0 text-muted-foreground text-right leading-snug pl-1">
                          {lang.level[language as keyof typeof lang.level]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {hasCertifications && (
                  <>
                    <Separator className="mx-auto h-px !w-[calc(100%-0.75rem)] max-w-full bg-border" />

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
                  </>
                )}
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCVModal;
