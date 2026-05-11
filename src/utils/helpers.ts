export const getTodayString = (): string =>
  new Date().toISOString().split("T")[0];

export const HABIT_COLORS = [
  "#34d399",
  "#22d3ee",
  "#a78bfa",
  "#f97316",
  "#f472b6",
  "#60a5fa",
];

export const getNextColor = (index: number): string =>
  HABIT_COLORS[index % HABIT_COLORS.length];

export const formatDateLong = (date: Date): string =>
  date.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);