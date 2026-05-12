export const validateName = (name: string): string | null => {
  if (!name.trim()) return "El nombre es obligatorio";
  if (name.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "La contraseña es obligatoria";
  if (password.includes(" ")) return "La contraseña no puede contener espacios";
  if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
  return null;
};

export const validateHabitName = (name: string): string | null => {
  if (!name.trim()) return "El nombre del hábito es obligatorio";
  if (name.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
  if (name.trim().length > 60) return "El nombre no puede superar 60 caracteres";
  return null;
};