import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiArrowRight, FiShield, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { validateName, validatePassword } from "../utils/validators";

export const CreateAccount: React.FC = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const nameErr = validateName(name);
    if (nameErr) return setError(nameErr);
    const passErr = validatePassword(password);
    if (passErr) return setError(passErr);

  
    const ok = register(name, password);
    if (!ok) return setError("Ya existe una cuenta con ese nombre.");

    navigate("/");
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#07111f] text-white relative flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(139,92,246,0.20),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.16),_transparent_25%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.18),_transparent_30%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/30">
            <FiShield className="text-2xl text-white" />
          </div>
          <h2 className="text-3xl font-bold">Crear cuenta</h2>
          <p className="mt-2 text-sm text-slate-300">Regístrate para comenzar a construir hábitos</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Nombre</label>
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingresa tu nombre"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
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
                placeholder="Crea una contraseña"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <div className="mb-2 flex items-center gap-2 text-slate-100">
              <FiCheckCircle className="text-emerald-400" />
              Tu cuenta quedará lista en segundos
            </div>
            Podrás iniciar sesión y empezar a registrar tus hábitos diarios.
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 py-3.5 font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-400 hover:to-cyan-400"
          >
            Registrar cuenta <FiArrowRight />
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-300">
          ¿Ya tienes cuenta?{" "}
          <Link to="/" className="font-semibold text-cyan-400 transition hover:text-cyan-300">
            Volver al login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};