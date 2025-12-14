import { X, Printer, Download, Mail, Linkedin, Github, MapPin, Calendar, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import cvData from "@/data/cvData.json";

interface LiveCVModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveCVModal = ({ isOpen, onClose }: LiveCVModalProps) => {
  const { personal, experience, techStack, skills } = cvData;

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
            <h2 className="text-2xl font-bold text-foreground">Live CV</h2>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrint}
                className="border-border/50 hover:border-primary/50"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print to PDF
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
                  <p className="text-xl text-primary font-medium mb-4">{personal.title}</p>
                  <p className="text-muted-foreground max-w-md">
                    {personal.subheadline}
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
                    Professional Experience
                  </h2>
                  <div className="space-y-6">
                    {experience.map((exp) => (
                      <div key={exp.id} className="relative pl-6 border-l-2 border-border hover:border-primary/50 transition-colors">
                        <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-primary -translate-x-[5px]" />
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                          <h3 className="font-semibold text-foreground">{exp.role}</h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{exp.period}</span>
                          </div>
                        </div>
                        <p className="text-primary font-medium text-sm mb-2">{exp.company}</p>
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {exp.focus}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Skills */}
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-4">Core Competencies</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
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
                  <h2 className="text-lg font-bold text-foreground mb-4">Technical Stack</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-primary mb-2">{techStack.production.title}</p>
                      <div className="flex flex-wrap gap-1">
                        {techStack.production.items.map((item) => (
                          <Badge key={item.name} variant="secondary" className="text-xs">
                            {item.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-accent mb-2">{techStack.experimental.title}</p>
                      <div className="flex flex-wrap gap-1">
                        {techStack.experimental.items.map((item) => (
                          <Badge key={item.name} variant="secondary" className="text-xs bg-accent/10">
                            {item.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">{techStack.toolkit.title}</p>
                      <div className="flex flex-wrap gap-1">
                        {techStack.toolkit.items.map((item) => (
                          <Badge key={item.name} variant="outline" className="text-xs">
                            {item.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
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
