import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
}

interface ParticleEffectProps {
  className?: string;
  particleCount?: number;
  colors?: string[];
  children?: React.ReactNode;
}

const ParticleEffect = ({ 
  className = "", 
  particleCount = 30,
  colors = ["hsl(175, 80%, 50%)", "hsl(280, 70%, 60%)"],
  children
}: ParticleEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = 1;
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createParticle = (x: number, y: number): Particle => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color,
        opacity: 0.8 + Math.random() * 0.2,
        life: 1,
      };
    };

    const animate = () => {
      const rect = container.getBoundingClientRect();
      // Use CSS dimensions since context is scaled
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Create new particles when hovered
      if (isHovered) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Create particles from center or mouse position
        const spawnX = mouseRef.current.x || centerX;
        const spawnY = mouseRef.current.y || centerY;
        
        if (particlesRef.current.length < particleCount) {
          for (let i = 0; i < 2; i++) {
            particlesRef.current.push(
              createParticle(spawnX, spawnY)
            );
          }
        }
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.015;
        particle.opacity *= 0.985;
        particle.vy += 0.03; // subtle gravity effect
        particle.vx *= 0.98; // slight air resistance

        if (particle.life <= 0 || particle.opacity <= 0.1) {
          return false;
        }

        // Keep particles within bounds with some padding
        const padding = 50;
        if (
          particle.x < -padding || 
          particle.x > rect.width + padding ||
          particle.y < -padding || 
          particle.y > rect.height + padding
        ) {
          return false;
        }

        // Draw particle with glow effect
        ctx.save();
        const alpha = particle.opacity * particle.life;
        
        // Outer glow using radial gradient
        ctx.globalAlpha = alpha * 0.5;
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.3, particle.color);
        gradient.addColorStop(1, "transparent");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Core bright particle
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();

        return true;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHovered, particleCount, colors]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
};

export default ParticleEffect;

