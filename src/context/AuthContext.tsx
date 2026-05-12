import React, { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface UserData {
  name: string;
  password: string;
}

interface AuthContextType {
  currentUser: UserData | null;
  isLoggedIn: boolean;
  register: (name: string, password: string) => boolean;
  login: (name: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  //  Array de usuarios 
  const [users, setUsers] = useLocalStorage<UserData[]>("users", []);
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>("isLoggedIn", false);
  const [currentUser, setCurrentUser] = useLocalStorage<UserData | null>("currentUser", null);

  const register = (name: string, password: string): boolean => {
    // Verificar si el usuario ya existe
    const exists = users.some((u) => u.name.toLowerCase() === name.toLowerCase());
    if (exists) return false;

    setUsers([...users, { name, password }]);
    return true;
  };

  const login = (name: string, password: string): boolean => {
    const found = users.find(
      (u) => u.name.toLowerCase() === name.toLowerCase() && u.password === password
    );
    if (!found) return false;

    setCurrentUser(found);
    setIsLoggedIn(true);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};