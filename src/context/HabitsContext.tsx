import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getTodayString, getNextColor } from "../utils/helpers";

export interface Habit {
  id: number;
  name: string;
  streak: number;
  completed: boolean;
  lastCompletedDate: string | null;
  color: string;
}

interface HabitsContextType {
  habits: Habit[];
  addHabit: (name: string) => void;
  deleteHabit: (id: number) => void;
  editHabit: (id: number, name: string) => void;
  toggleHabit: (id: number) => void;
  completedToday: number;
  maxStreak: number;
  weeklyRate: number;
}

const HabitsContext = createContext<HabitsContextType | null>(null);

export const HabitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useLocalStorage<Habit[]>("habits", []);

  const TODAY = getTodayString();

  const addHabit = (name: string) => {
    setHabits((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.trim(),
        streak: 0,
        completed: false,
        lastCompletedDate: null,
        color: getNextColor(prev.length),
      },
    ]);
  };

  const deleteHabit = (id: number) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const editHabit = (id: number, name: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: name.trim() } : h))
    );
  };

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

  const completedToday = habits.filter(
    (h) => h.completed && h.lastCompletedDate === TODAY
  ).length;

  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak), 0) : 0;

  const weeklyRate =
    habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <HabitsContext.Provider
      value={{ habits, addHabit, deleteHabit, editHabit, toggleHabit, completedToday, maxStreak, weeklyRate }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = (): HabitsContextType => {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits debe usarse dentro de HabitsProvider");
  return ctx;
};