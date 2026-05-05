import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
  FiPlus,
  FiLogOut,
  FiZap,
  FiCircle,
} from "react-icons/fi";

interface Habit {
  id: number;
  name: string;
  streak: number;
  completed: boolean;
  color: string;
  progress: number;
}

const INITIAL_HABITS: Habit[] = [
  { id: 1, name: "Meditación 10 min", streak: 8, completed: true, color: "#34d399", progress: 100 },
  { id: 2, name: "Leer 20 páginas", streak: 5, completed: true, color: "#22d3ee", progress: 100 },
  { id: 3, name: "Ejercicio 30 min", streak: 3, completed: false, color: "#a78bfa", progress: 55 },
  { id: 4, name: "Beber 2L de agua", streak: 12, completed: false, color: "#f97316", progress: 70 },
];

export const Home: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [showInput, setShowInput] = useState(false);
  const [newHabit, setNewHabit] = useState("");
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
  const firstName = userData.name?.split(" ")[0] ?? "Usuario";

  const completedToday = habits.filter((h) => h.completed).length;
  const streak = 12;
  const weeklyRate = Math.round((completedToday / habits.length) * 100);

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, completed: !h.completed, progress: !h.completed ? 100 : 50 } : h
      )
    );
  };

  const addHabit = () => {
    if (!newHabit.trim()) return;
    const colors = ["#34d399", "#22d3ee", "#a78bfa", "#f97316", "#f472b6"];
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newHabit.trim(),
        streak: 0,
        completed: false,
        color: colors[prev.length % colors.length],
        progress: 0,
      },
    ]);
    setNewHabit("");
    setShowInput(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-[#07111f] text-white relative overflow-hidden">
      {/* Background radial gradients — mismo estilo que Login/CreateAccount */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.14),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_25%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.18),_transparent_30%)]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 backdrop-blur-md mb-3">
              <FiTarget className="text-cyan-400" />
              Momentum
            </div>
            <h1 className="text-3xl font-bold">
              Hola,{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                {firstName}
              </span>{" "}
              👋
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Llevas <span className="text-orange-400 font-semibold">{streak} días</span> consecutivos. ¡Sigue así!
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 backdrop-blur-md transition hover:bg-white/10"
          >
            <FiLogOut />
            Salir
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { icon: "🔥", value: streak, label: "Racha actual", color: "text-orange-400" },
            { icon: <FiCheckCircle />, value: `${completedToday}/${habits.length}`, label: "Hoy completados", color: "text-emerald-400" },
            { icon: <FiTrendingUp />, value: `${weeklyRate}%`, label: "Completado hoy", color: "text-cyan-400" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={item}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
            >
              <div className={`text-xl mb-2 ${stat.color}`}>{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Habits list */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">Hábitos de hoy</h2>
          <span className="text-xs text-slate-500">{new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3 mb-5"
        >
          {habits.map((habit) => (
            <motion.div
              key={habit.id}
              variants={item}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: habit.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{habit.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {habit.streak > 0 ? `🔥 ${habit.streak} días seguidos` : "⚡ Pendiente hoy"}
                  </p>
                  <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${habit.progress}%` }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: habit.color }}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleHabit(habit.id)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition"
                  style={{
                    background: habit.completed ? `${habit.color}22` : "rgba(255,255,255,0.06)",
                    border: `1px solid ${habit.completed ? habit.color + "55" : "rgba(255,255,255,0.1)"}`,
                    color: habit.completed ? habit.color : "#64748b",
                  }}
                >
                  {habit.completed ? <FiCheckCircle /> : <FiCircle />}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add habit */}
        {showInput && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md mb-3"
          >
            <input
              autoFocus
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
              placeholder="Nombre del nuevo hábito..."
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
            />
            <div className="flex gap-2 mt-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={addHabit}
                className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-xs font-semibold"
              >
                Agregar
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowInput(false)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300"
              >
                Cancelar
              </motion.button>
            </div>
          </motion.div>
        )}

        {!showInput && (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowInput(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-400 hover:to-cyan-400"
          >
            <FiPlus />
            Agregar nuevo hábito
          </motion.button>
        )}

        {/* Motivational footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md flex items-center gap-3"
        >
          <FiZap className="text-yellow-400 text-xl flex-shrink-0" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="text-white font-medium">Consejo del día: </span>
            La consistencia supera a la perfección. Un hábito pequeño hecho todos los días vale más que uno grande hecho de vez en cuando.
          </p>
        </motion.div>
      </div>
    </div>
  );
};