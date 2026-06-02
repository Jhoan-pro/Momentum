import React, { createContext, useContext } from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import { getTodayString, getNextColor } from "../utils/helpers";
import { useAuth } from "./AuthContext";

// Estructura de un hábito
export interface Habit {
  id: number;
  name: string;
  streak: number;
  completed: boolean;
  lastCompletedDate: string | null;
  color: string;
  history: string[]; // Todas las fechas en que fue completado (YYYY-MM-DD)
}

// Lo que expone el contexto a los componentes
interface HabitsContextType {
  habits: Habit[];
  isLoading: boolean;
  addHabit: (name: string) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
  editHabit: (id: number, name: string) => Promise<void>;
  toggleHabit: (id: number) => Promise<void>;
  completedToday: number;
  maxStreak: number;
  weeklyRate: number;
}

const HabitsContext = createContext<HabitsContextType | null>(null);

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  // Clave única por usuario — cada usuario tiene sus propios hábitos
  const habitsKey = currentUser ? `habits_${currentUser.name}` : "habits_guest";

  const [habits, setHabits, , isLoading] = useAsyncStorage<Habit[]>(habitsKey, []);

  const TODAY = getTodayString();

  // Agrega un nuevo hábito con historial vacío
  const addHabit = async (name: string): Promise<void> => {
    await setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.trim(),
        streak: 0,
        completed: false,
        lastCompletedDate: null,
        color: getNextColor(prev.length),
        history: [],
      },
    ]);
  };

  // Elimina un hábito por su id
  const deleteHabit = async (id: number): Promise<void> => {
    await setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Edita el nombre de un hábito
  const editHabit = async (id: number, name: string): Promise<void> => {
    await setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: name.trim() } : h))
    );
  };

  // Marca o desmarca un hábito como completado hoy
  // También actualiza la racha y el historial de fechas
  const toggleHabit = async (id: number): Promise<void> => {
    await setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;

        const isCompleting = !(h.completed && h.lastCompletedDate === TODAY);
        const currentHistory = h.history || [];

        // Agrega o quita la fecha de hoy del historial
        const newHistory = isCompleting
          ? [...new Set([...currentHistory, TODAY])]
          : currentHistory.filter((date) => date !== TODAY);

        return {
          ...h,
          completed: isCompleting,
          lastCompletedDate: isCompleting ? TODAY : null,
          streak: isCompleting ? h.streak + 1 : Math.max(0, h.streak - 1),
          history: newHistory,
        };
      })
    );
  };

  // Cantidad de hábitos completados hoy
  const completedToday = habits.filter(
    (h) => h.completed && h.lastCompletedDate === TODAY
  ).length;

  // La racha más larga entre todos los hábitos
  const maxStreak =
    habits.length > 0 ? Math.max(...habits.map((h) => h.streak), 0) : 0;

  // Porcentaje de hábitos completados hoy
  const weeklyRate =
    habits.length > 0
      ? Math.round((completedToday / habits.length) * 100)
      : 0;

  return (
    <HabitsContext.Provider
      value={{
        habits,
        isLoading,
        addHabit,
        deleteHabit,
        editHabit,
        toggleHabit,
        completedToday,
        maxStreak,
        weeklyRate,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

// Hook para consumir el contexto — lanza error si se usa fuera del provider
export const useHabits = (): HabitsContextType => {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits debe usarse dentro de HabitsProvider");
  return ctx;
};