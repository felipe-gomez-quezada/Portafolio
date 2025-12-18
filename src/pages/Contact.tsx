import { Mail, MessageCircle, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LiveCVModal from "@/components/LiveCVModal";
import { useState } from "react";
import cvData from "@/data/cvData.json";

const Contact = () => {
  const { language, t } = useLanguage();
  const [isCVOpen, setIsCVOpen] = useState(false);
  const { personal } = cvData;

  const whatsappNumber = personal.phone.replace(/\s/g, "").replace(/\+/g, ""); // Remove spaces and +
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const emailLink = `mailto:${personal.email}`;
  const linkedinDMLink = `${personal.links.linkedin}?original_referer=https://portafolio.dev/`;

  return (
    <>
      <Helmet>
        <title>{t("contact.title")} | {personal.shortName}</title>
        <meta name="description" content={t("contact.subtitle")} />
        <html lang={language} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navigation onOpenCV={() => setIsCVOpen(true)} />
        
        <main className="flex-1 pt-24 pb-20 px-4">
          <section className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="gradient-text">{t("contact.title")}</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                {t("contact.subtitle")}
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("contact.description")}
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6 animate-fade-in animation-delay-200">
              <h2 className="text-2xl font-semibold text-center mb-8">
                {t("contact.preferredMethods")}
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Email CTA */}
                <a
                  href={emailLink}
                  className="group relative p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{t("contact.email")}</h3>
                      <p className="text-sm text-muted-foreground">{t("contact.emailDesc")}</p>
                    </div>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      <span>{personal.email}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>

                {/* WhatsApp CTA */}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <MessageCircle className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{t("contact.whatsapp")}</h3>
                      <p className="text-sm text-muted-foreground">{t("contact.whatsappDesc")}</p>
                    </div>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      <span>{t("contact.cta")}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>

                {/* LinkedIn CTA */}
                <a
                  href={linkedinDMLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Linkedin className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{t("contact.linkedin")}</h3>
                      <p className="text-sm text-muted-foreground">{t("contact.linkedinDesc")}</p>
                    </div>
                    <div className="flex items-center gap-2 text-primary text-sm font-medium">
                      <span>{t("contact.cta")}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Back to home CTA */}
            <div className="mt-16 text-center animate-fade-in animation-delay-400">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                <span>{t("contact.backHome")}</span>
              </Link>
            </div>
          </section>
        </main>

        <Footer />

        <LiveCVModal isOpen={isCVOpen} onClose={() => setIsCVOpen(false)} />
      </div>
    </>
  );
};

export default Contact;

