import { useEffect, useState, useRef } from "react";
import { Eye } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Counter } from "counterapi";

// Configuración de CounterAPI
const COUNTER_WORKSPACE = "felipe-gomez-quezadas-team-2177";
const COUNTER_NAME = "felipe-gomez-portfolio";
const SESSION_STORAGE_KEY = "up_count";

// Crear instancia del contador
const counter = new Counter({ workspace: COUNTER_WORKSPACE });

// Interfaz para la respuesta de CounterAPI que incluye up_count
interface CounterAPIResponse {
  value?: number;
  up_count?: number;
  [key: string]: unknown;
}

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
          const result = await counter.get(COUNTER_NAME);
          // CounterAPI retorna up_count en lugar de value
          const currentCount = result.data?.up_count ?? 0;
          setCount(currentCount);
          animateCount(0, currentCount);
        } catch (error) {
          console.error("Error fetching visit count:", error);
          setCount(0);
        }
        return;
      }

      try {
        // Incrementamos el contador directamente (solo una vez por sesión)
        // Si no existe, up() lo creará automáticamente
        const upResult = await counter.up(COUNTER_NAME);
        console.log("Up result:", upResult);
        // CounterAPI retorna up_count en lugar de value
        const newCount = upResult?.data?.up_count ?? 0;

        // Marcar que ya contamos esta sesión
        hasCountedRef.current = true;
        sessionStorage.setItem(SESSION_STORAGE_KEY, "true");

        // Mostrar el nuevo valor con animación
        setIsAnimating(true);
        setCount(newCount);
        animateCount(0, newCount);

        // Removemos la animación después de que termine
        setTimeout(() => {
          setIsAnimating(false);
        }, 800);
      } catch (error) {
        console.error("Error incrementing visit count:", error);
        // En caso de error, intentar obtener el valor actual
        try {
          const getResult = await counter.get(COUNTER_NAME);
          // CounterAPI retorna up_count en lugar de value
          const currentCount = getResult?.data?.up_count ?? 0;
          setCount(currentCount);
          animateCount(0, currentCount);
        } catch (getError) {
          console.error("Error fetching visit count:", getError);
          setCount(0);
        }
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

