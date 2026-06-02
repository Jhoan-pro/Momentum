// Retorna la fecha de hoy en formato YYYY-MM-DD
// Se usa para comparar si un hábito fue completado hoy
export const getTodayString = (): string =>
  new Date().toISOString().split("T")[0];

// Paleta de colores para los hábitos — se asignan en orden cíclico
export const HABIT_COLORS = [
  "#34d399", // emerald
  "#22d3ee", // cyan
  "#a78bfa", // violet
  "#f97316", // orange
  "#f472b6", // pink
  "#60a5fa", // blue
];

// Retorna el siguiente color según el índice actual de hábitos
export const getNextColor = (index: number): string =>
  HABIT_COLORS[index % HABIT_COLORS.length];

// Formatea una fecha larga en español: "lunes, 2 de junio"
export const formatDateLong = (date: Date): string =>
  date.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

// Pone en mayúscula la primera letra de un string
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);