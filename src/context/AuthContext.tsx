import React, { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface UserData {
  name: string;
  password: string;
}

interface AuthContextType {
  userData: UserData | null;
  isLoggedIn: boolean;
  register: (name: string, password: string) => void;
  login: (name: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
const [userData, setUserData] = useLocalStorage<UserData | null>("user_data", null);
  const [isLoggedIn, setIsLoggedIn, removeIsLoggedIn] = useLocalStorage<boolean>("isLoggedIn", false);

  const register = (name: string, password: string) => {
    setUserData({ name, password });
  };

  const login = (name: string, password: string): boolean => {
    if (!userData) return false;
    if (userData.name === name && userData.password === password) {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    removeIsLoggedIn();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ userData, isLoggedIn, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};