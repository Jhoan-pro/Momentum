import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser, FiLock, FiArrowRight, FiCheckCircle, FiTarget, FiTrendingUp,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { validateName, validatePassword } from "../utils/validators";

export const Login: React.FC = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, userData } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const nameErr = validateName(name);
    if (nameErr) return setError(nameErr);
    const passErr = validatePassword(password);
    if (passErr) return setError(passErr);

    if (!userData) return setError("No existe ninguna cuenta. Por favor crea una.");

    const ok = login(name, password);
    if (ok) {
      navigate("/home");
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-white relative flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.20),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.18),_transparent_25%),radial-gradient(circle_at_bottom,_rgba(139,92,246,0.16),_transparent_30%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center"
      >
        {/* Left panel */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur-md">
              <FiTarget className="text-cyan-400" />
              Momentum
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Construye hábitos que realmente{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                transforman tu vida
              </span>
            </h1>
            <p className="max-w-lg text-slate-300 text-lg leading-relaxed">
              Organiza tu rutina, mide tu progreso y mantén la disciplina con una experiencia visual moderna, simple y motivadora.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <FiCheckCircle className="mb-3 text-2xl text-emerald-400" />
                <p className="text-sm text-slate-300">Seguimiento diario</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <FiTrendingUp className="mb-3 text-2xl text-cyan-400" />
                <p className="text-sm text-slate-300">Progreso visible</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <FiTarget className="mb-3 text-2xl text-violet-400" />
                <p className="text-sm text-slate-300">Metas claras</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30">
              <FiTarget className="text-2xl text-white" />
            </div>
            <h2 className="text-3xl font-bold">Bienvenido de nuevo</h2>
            <p className="mt-2 text-sm text-slate-300">Inicia sesión para continuar con tus hábitos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Nombre</label>
              <div className="relative">
                <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200">Contraseña</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500"
            >
              Entrar <FiArrowRight />
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-300">
            ¿No tienes cuenta?{" "}
            <Link to="/create-account" className="font-semibold text-cyan-400 transition hover:text-cyan-300">
              Crea una aquí
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};