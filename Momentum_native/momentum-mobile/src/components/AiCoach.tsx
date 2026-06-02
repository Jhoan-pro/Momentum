import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AiCoachProps {
  completedToday: number;
  totalHabits: number;
  maxStreak: number;
}

export const AiCoach = ({ completedToday, totalHabits, maxStreak }: AiCoachProps) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setIsTyping(true);
    let promptResponse = "";

    // Genera el mensaje según el estado actual de los hábitos
    if (totalHabits === 0) {
      promptResponse = "Estoy listo para ayudarte. Crea tu primer hábito y empecemos a medir tu progreso.";
    } else if (completedToday === totalHabits) {
      promptResponse = `¡Día perfecto! Completaste ${completedToday} de ${totalHabits} hábitos. Tu mejor racha es de ${maxStreak} días. ¡Sigue así!`;
    } else if (completedToday === 0) {
      promptResponse = "Un nuevo día es una nueva oportunidad. Empieza con la tarea más fácil para ganar impulso.";
    } else {
      promptResponse = `Llevas ${completedToday} de ${totalHabits} hábitos hoy. Estás a mitad de camino, ¡terminemos fuerte!`;
    }

    // Simula efecto de escritura letra por letra
    let i = 0;
    setMessage("");
    const timer = setInterval(() => {
      setMessage(promptResponse.slice(0, i));
      i++;
      if (i > promptResponse.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [completedToday, totalHabits, maxStreak]);

  return (
    <View style={styles.container}>
      {/* Ícono del coach con indicador de actividad */}
      <View style={styles.iconWrapper}>
        {isTyping ? (
          // Spinner mientras "piensa"
          <ActivityIndicator size="small" color="#22d3ee" />
        ) : (
          <Ionicons name="hardware-chip-outline" size={18} color="#a78bfa" />
        )}
      </View>

      {/* Texto del mensaje con efecto typewriter */}
      <View style={styles.textWrapper}>
        <Text style={styles.text}>
          <Text style={styles.label}>Coach IA: </Text>
          {message}
          {/* Cursor parpadeante mientras escribe */}
          {isTyping && <Text style={styles.cursor}>|</Text>}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 16,
    backgroundColor: "rgba(139,92,246,0.08)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.25)",
    borderRadius: 16,
    padding: 14,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(139,92,246,0.15)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    fontSize: 12,
    color: "#cbd5e1",
    lineHeight: 18,
  },
  label: {
    // Texto "Coach IA:" en degradado no es posible en RN directamente,
    // usamos violet como aproximación
    color: "#a78bfa",
    fontWeight: "700",
  },
  cursor: {
    color: "#22d3ee",
    fontWeight: "700",
  },
});