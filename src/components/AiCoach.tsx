import { useState, useEffect } from 'react';
import { FiCpu } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface AiCoachProps {
  completedToday: number;
  totalHabits: number;
  maxStreak: number;
}

export const AiCoach = ({ completedToday, totalHabits, maxStreak }: AiCoachProps) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Simulamos la respuesta de una IA analizando tus datos
  useEffect(() => {
    setIsTyping(true);
    let promptResponse = "";

    if (totalHabits === 0) {
      promptResponse = "Estoy listo para ayudarte. Crea tu primer hábito y empecemos a medir tu progreso.";
    } else if (completedToday === totalHabits) {
      promptResponse = `¡Día perfecto! Has completado ${completedToday} de ${totalHabits}. Tu mejor racha es de ${maxStreak} días. ¡Sigue así!`;
    } else if (completedToday === 0) {
      promptResponse = "Un nuevo día es una nueva oportunidad. Empieza con la tarea más fácil para ganar impulso.";
    } else {
      promptResponse = `Llevas ${completedToday} de ${totalHabits} hábitos hoy. Estás a mitad de camino, ¡terminemos fuerte!`;
    }

    // simular que la IA "piensa"
    let i = 0;
    setMessage("");
    const timer = setInterval(() => {
      setMessage(promptResponse.slice(0, i));
      i++;
      if (i > promptResponse.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 30); // Velocidad de escritura

    return () => clearInterval(timer);
  }, [completedToday, totalHabits, maxStreak]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 p-4 backdrop-blur-md flex items-start gap-3 shadow-lg shadow-violet-500/5 relative overflow-hidden"
    >
      {/* Brillo de fondo animado */}
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 blur-xl opacity-50 animate-pulse" />
      
      <div className="relative p-1.5 rounded-lg bg-violet-500/20 text-violet-400 flex-shrink-0">
        <FiCpu size={18} className={isTyping ? "animate-pulse text-cyan-400" : ""} />
      </div>
      
      <div className="relative">
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-bold mr-1">
            Coach IA:
          </span>
          {message}
          {isTyping && <span className="inline-block w-1 h-3 ml-1 bg-cyan-400 animate-ping" />}
        </p>
      </div>
    </motion.div>
  );
};