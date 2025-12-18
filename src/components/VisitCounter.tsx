import { useEffect, useState, useRef } from "react";
import { Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Configuración de CountAPI (servicio gratuito de contadores)
const COUNT_API_NAMESPACE = "felipe-gomez-portfolio";
const COUNT_API_KEY = "visits";
const SESSION_STORAGE_KEY = "visit_counted";

interface VisitCounterProps {
  className?: string;
}

const VisitCounter = ({ className }: VisitCounterProps) => {
  const { language, t } = useLanguage();
  const [count, setCount] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const hasCountedRef = useRef(false);

  useEffect(() => {
    const fetchAndIncrementCount = async () => {
      // Evitar múltiples incrementos en la misma sesión
      if (hasCountedRef.current || sessionStorage.getItem(SESSION_STORAGE_KEY)) {
        // Solo obtenemos el contador sin incrementar
        try {
          const getResponse = await fetch(
            `https://api.countapi.xyz/get/${COUNT_API_NAMESPACE}/${COUNT_API_KEY}`
          );
          
          if (getResponse.ok) {
            const getData = await getResponse.json();
            const currentCount = getData.value || 0;
            setCount(currentCount);
            animateCount(0, currentCount);
          }
        } catch (error) {
          console.error("Error fetching visit count:", error);
          setCount(0);
        }
        return;
      }

      try {
        // Primero obtenemos el contador actual
        const getResponse = await fetch(
          `https://api.countapi.xyz/get/${COUNT_API_NAMESPACE}/${COUNT_API_KEY}`
        );
        
        let currentCount = 0;
        
        if (getResponse.ok) {
          const getData = await getResponse.json();
          currentCount = getData.value || 0;
          setCount(currentCount);
          animateCount(0, currentCount);
        }

        // Luego incrementamos el contador (solo una vez por sesión)
        const hitResponse = await fetch(
          `https://api.countapi.xyz/hit/${COUNT_API_NAMESPACE}/${COUNT_API_KEY}`
        );

        if (hitResponse.ok) {
          const hitData = await hitResponse.json();
          const newCount = hitData.value;
          
          // Marcar que ya contamos esta sesión
          hasCountedRef.current = true;
          sessionStorage.setItem(SESSION_STORAGE_KEY, "true");

          // Si el número aumentó, activamos la animación
          if (newCount > currentCount) {
            setIsAnimating(true);
            setCount(newCount);
            animateCount(currentCount, newCount);
            
            // Removemos la animación después de que termine
            setTimeout(() => {
              setIsAnimating(false);
            }, 800);
          }
        }
      } catch (error) {
        console.error("Error fetching visit count:", error);
        setCount(0);
      }
    };

    fetchAndIncrementCount();
  }, []);

  // Función para animar el conteo
  const animateCount = (start: number, end: number) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const duration = 600; // 600ms
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const current = Math.floor(start + (end - start) * easeOut);
      setDisplayCount(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayCount(end);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Función para formatear el número con separadores de miles
  const formatNumber = (num: number): string => {
    return num.toLocaleString(language === 'es' ? 'es-ES' : 'en-US');
  };

  // Limpiar animation frame al desmontar
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (count === null) {
    return (
      <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className || ''}`}>
        <Eye className="h-4 w-4 animate-pulse" />
        <span>{t("footer.loadingVisits")}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <Eye 
        className={`h-4 w-4 text-primary transition-all duration-300 ${
          isAnimating ? 'animate-pulse scale-110' : ''
        }`} 
      />
      <div className="flex items-baseline gap-1">
        <span className="text-xs text-muted-foreground">{t("footer.visits")}</span>
        <span
          className={`text-sm font-semibold text-foreground transition-all duration-300 inline-block ${
            isAnimating
              ? 'scale-125 text-primary drop-shadow-[0_0_12px_rgba(var(--primary),0.6)] font-bold'
              : 'scale-100'
          }`}
        >
          {formatNumber(displayCount)}
        </span>
      </div>
    </div>
  );
};

export default VisitCounter;

