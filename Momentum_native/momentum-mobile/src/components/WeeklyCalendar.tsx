import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useHabits } from "../context/HabitsContext";

// Tipos posibles para cada día de la semana
type DayStatus = "completed" | "missed" | "today" | "future";

interface WeekDay {
  letter: string;
  status: DayStatus;
}

// Convierte una fecha a string YYYY-MM-DD respetando la zona horaria local
const toDateString = (date: Date): string => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().split("T")[0];
};

export const WeeklyCalendar = () => {
  const { habits } = useHabits();

  const generateWeek = (): WeekDay[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // getDay() retorna 0=domingo, convertimos a 0=lunes
    const currentDayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1;

    const weekData: WeekDay[] = [];
    const letters = ["L", "M", "M", "J", "V", "S", "D"];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() - currentDayOfWeek + i);

      const dateStr = toDateString(dayDate);
      const todayStr = toDateString(today);

      let status: DayStatus = "future";

      if (dateStr === todayStr) {
        // Es hoy
        status = "today";
      } else if (dayDate.getTime() > today.getTime()) {
        // Es un día futuro
        status = "future";
      } else {
        // Es un día pasado — verificamos si todos los hábitos fueron completados
        if (habits.length === 0) {
          status = "missed";
        } else {
          const didCompleteAll = habits.every(
            (h) => h.history && h.history.includes(dateStr)
          );
          status = didCompleteAll ? "completed" : "missed";
        }
      }

      weekData.push({ letter: letters[i], status });
    }

    return weekData;
  };

  const currentWeek = generateWeek();

  // Retorna el estilo del círculo según el estado del día
  const getDotStyle = (status: DayStatus) => {
    switch (status) {
      case "completed":
        return styles.dotCompleted;
      case "today":
        return styles.dotToday;
      case "missed":
        return styles.dotMissed;
      case "future":
      default:
        return styles.dotFuture;
    }
  };

  // Retorna el estilo del texto dentro del círculo
  const getDotTextStyle = (status: DayStatus) => {
    switch (status) {
      case "completed":
        return styles.dotTextCompleted;
      case "today":
        return styles.dotTextToday;
      case "missed":
        return styles.dotTextMissed;
      case "future":
      default:
        return styles.dotTextFuture;
    }
  };

  return (
    <View style={styles.container}>
      {currentWeek.map((day, index) => (
        <View key={index} style={styles.dayColumn}>
          {/* Letra del día — L, M, M, J, V, S, D */}
          <Text style={styles.dayLetter}>{day.letter}</Text>

          {/* Círculo con estado del día */}
          <View style={[styles.dot, getDotStyle(day.status)]}>
            <Text style={[styles.dotText, getDotTextStyle(day.status)]}>
              {day.status === "completed" ? "✓" : ""}
              {day.status === "missed" ? "✕" : ""}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 4,
  },
  dayColumn: {
    alignItems: "center",
    gap: 8,
  },
  dayLetter: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // Completado — verde sólido
  dotCompleted: {
    backgroundColor: "#10b981",
  },
  dotTextCompleted: {
    color: "white",
  },

  // Hoy — borde verde sin fondo
  dotToday: {
    borderWidth: 2,
    borderColor: "#10b981",
    backgroundColor: "transparent",
  },
  dotTextToday: {
    color: "#10b981",
  },

  // Fallado — rojo suave
  dotMissed: {
    backgroundColor: "rgba(239,68,68,0.2)",
  },
  dotTextMissed: {
    color: "#ef4444",
  },

  // Futuro — gris neutro
  dotFuture: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  dotTextFuture: {
    color: "#475569",
  },
});