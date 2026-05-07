import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiTarget,
  FiTrendingUp,
  FiCheckCircle,
  FiPlus,
  FiLogOut,
  FiZap,
  FiCircle,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiX,
} from "react-icons/fi";

interface Habit {
  id: number;
  name: string;
  streak: number;
  completed: boolean;
  color: string;
  lastCompletedDate: string | null;
}

const COLORS = ["#34d399", "#22d3ee", "#a78bfa", "#f97316", "#f472b6", "#60a5fa"];
const TODAY = new Date().toISOString().split("T")[0];

const loadHabits = (): Habit[] => {
  try {
    return JSON.parse(localStorage.getItem("habits") ?? "[]");
  } catch {
    return [];
  }
};

const saveHabits = (habits: Habit[]) => {
  localStorage.setItem("habits", JSON.stringify(habits));
};

export const Home: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>(loadHabits);
  const [showInput, setShowInput] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("user_data") ?? "{}");
  const firstName = userData.name?.split(" ")[0] ?? "Usuario";

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  const completedToday = habits.filter((h) => h.completed && h.lastCompletedDate === TODAY).length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak), 0) : 0;
  const weeklyRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const isCompleting = !(h.completed && h.lastCompletedDate === TODAY);
        return {
          ...h,
          completed: isCompleting,
          lastCompletedDate: isCompleting ? TODAY : null,
          streak: isCompleting ? h.streak + 1 : Math.max(0, h.streak - 1),
        };
      })
    );
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: newHabitName.trim(),
        streak: 0,
        completed: false,
        color: COLORS[prev.length % COLORS.length],
        lastCompletedDate: null,
      },
    ]);
    setNewHabitName("");
    setShowInput(false);
  };

  const deleteHabit = (id: number) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const startEdit = (habit: Habit) => {
    setEditingId(habit.id);
    setEditingName(habit.name);
  };

  const confirmEdit = (id: number) => {
    if (!editingName.trim()) return;
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: editingName.trim() } : h))
    );
    setEditingId(null);
    setEditingName("");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
  const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-[#07111f] text-white relative overflow-hidden">
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
              {habits.length === 0
                ? "Agrega tu primer hábito para comenzar"
                : completedToday === habits.length
                ? "¡Completaste todos tus hábitos hoy! 🎉"
                : `Te faltan ${habits.length - completedToday} hábito${habits.length - completedToday !== 1 ? "s" : ""} por hoy`}
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
            { icon: "🔥", value: maxStreak, label: "Mejor racha", color: "text-orange-400" },
            {
              icon: <FiCheckCircle />,
              value: `${completedToday}/${habits.length}`,
              label: "Hoy completados",
              color: "text-emerald-400",
            },
            {
              icon: <FiTrendingUp />,
              value: `${weeklyRate}%`,
              label: "Completado hoy",
              color: "text-cyan-400",
            },
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
        {habits.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">Hábitos de hoy</h2>
            <span className="text-xs text-slate-500">
              {new Date().toLocaleDateString("es-CO", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-3 mb-5"
        >
          <AnimatePresence>
            {habits.map((habit) => {
              const isCompletedToday = habit.completed && habit.lastCompletedDate === TODAY;
              const isEditing = editingId === habit.id;

              return (
                <motion.div
                  key={habit.id}
                  variants={item}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  layout
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: habit.color }}
                    />

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") confirmEdit(habit.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className="flex-1 bg-transparent text-sm text-white outline-none border-b border-white/20 pb-0.5"
                          />
                          <button onClick={() => confirmEdit(habit.id)} className="text-emerald-400 hover:text-emerald-300">
                            <FiCheck size={14} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-300">
                            <FiX size={14} />
                          </button>
                        </div>
                      ) : (
                        <p className={`text-sm font-medium truncate ${isCompletedToday ? "line-through text-slate-400" : ""}`}>
                          {habit.name}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-0.5">
                        {habit.streak > 0 ? `🔥 ${habit.streak} días seguidos` : "⚡ Sin racha aún"}
                      </p>
                      <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          animate={{ width: isCompletedToday ? "100%" : "0%" }}
                          transition={{ duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{ background: habit.color }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    {!isEditing && (
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => startEdit(habit)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition"
                        >
                          <FiEdit2 size={13} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteHabit(habit.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition"
                        >
                          <FiTrash2 size={13} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => toggleHabit(habit.id)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition"
                          style={{
                            background: isCompletedToday ? `${habit.color}22` : "rgba(255,255,255,0.06)",
                            border: `1px solid ${isCompletedToday ? habit.color + "55" : "rgba(255,255,255,0.1)"}`,
                            color: isCompletedToday ? habit.color : "#64748b",
                          }}
                        >
                          {isCompletedToday ? <FiCheckCircle size={15} /> : <FiCircle size={15} />}
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {habits.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-dashed border-white/15 bg-white/3 p-10 text-center mb-5"
          >
            <div className="text-4xl mb-3">🎯</div>
            <p className="text-slate-300 font-medium text-sm">No tienes hábitos todavía</p>
            <p className="text-slate-500 text-xs mt-1">Agrega tu primero para empezar a construir tu rutina</p>
          </motion.div>
        )}

        {/* Add habit input */}
        <AnimatePresence>
          {showInput && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md mb-3"
            >
              <input
                autoFocus
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addHabit();
                  if (e.key === "Escape") setShowInput(false);
                }}
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
                  onClick={() => { setShowInput(false); setNewHabitName(""); }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300"
                >
                  Cancelar
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
        {habits.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md flex items-center gap-3"
          >
            <FiZap className="text-yellow-400 text-xl flex-shrink-0" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="text-white font-medium">Consejo: </span>
              La consistencia supera a la perfección. Un hábito pequeño hecho todos los días vale más que uno grande hecho de vez en cuando.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};