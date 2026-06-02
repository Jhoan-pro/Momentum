import React, { createContext, useContext } from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";

// Estructura de un usuario guardado
interface UserData {
  name: string;
  password: string;
}

// Lo que expone el contexto a los componentes
interface AuthContextType {
  currentUser: UserData | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  register: (name: string, password: string) => Promise<boolean>;
  login: (name: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Array de todos los usuarios registrados
  const [users, setUsers, , usersLoading] = useAsyncStorage<UserData[]>("users", []);

  // Usuario actualmente logueado
  const [currentUser, setCurrentUser, removeCurrentUser, userLoading] =
    useAsyncStorage<UserData | null>("currentUser", null);

  // Estado de sesión activa
  const [isLoggedIn, setIsLoggedIn, removeIsLoggedIn, loginLoading] =
    useAsyncStorage<boolean>("isLoggedIn", false);

  // Mientras cualquiera de los tres valores carga, mostramos loading
  const isLoading = usersLoading || userLoading || loginLoading;

  // Registra un nuevo usuario — retorna false si el nombre ya existe
  const register = async (name: string, password: string): Promise<boolean> => {
    const exists = users.some(
      (u) => u.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) return false;

    await setUsers([...users, { name, password }]);
    return true;
  };

  // Busca el usuario en el array y activa la sesión si coincide
  const login = async (name: string, password: string): Promise<boolean> => {
    const found = users.find(
      (u) =>
        u.name.toLowerCase() === name.toLowerCase() &&
        u.password === password
    );
    if (!found) return false;

    await setCurrentUser(found);
    await setIsLoggedIn(true);
    return true;
  };

  // Limpia la sesión activa sin borrar el usuario registrado
  const logout = async (): Promise<void> => {
    await removeCurrentUser();
    await removeIsLoggedIn();
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoggedIn, isLoading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir el contexto — lanza error si se usa fuera del provider
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};