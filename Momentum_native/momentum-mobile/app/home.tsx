import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../src/context/AuthContext";
import { useHabits } from "../src/context/HabitsContext";
import { validateHabitName } from "../src/utils/validators";
import { formatDateLong, capitalize } from "../src/utils/helpers";
import { AiCoach } from "../src/components/AiCoach";
import { WeeklyCalendar } from "../src/components/WeeklyCalendar";

export default function Home() {
  const { currentUser, logout } = useAuth();
  const {
    habits,
    isLoading,
    addHabit,
    deleteHabit,
    editHabit,
    toggleHabit,
    completedToday,
    maxStreak,
    weeklyRate,
  } = useHabits();

  const [showInput, setShowInput] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [inputError, setInputError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const firstName = capitalize(currentUser?.name?.split(" ")[0] ?? "Usuario");
  const TODAY = new Date().toISOString().split("T")[0];

  const handleAddHabit = async () => {
    const err = validateHabitName(newHabitName);
    if (err) return setInputError(err);

    await addHabit(newHabitName);
    setNewHabitName("");
    setInputError("");
    setShowInput(false);
  };

  const handleConfirmEdit = async (id: number) => {
    const err = validateHabitName(editingName);
    if (err) return;

    await editHabit(id, editingName);
    setEditingId(null);
    setEditingName("");
  };

  // Alert nativo de confirmación antes de eliminar
  const handleDeleteHabit = (id: number, name: string) => {
    Alert.alert(
      "Eliminar hábito",
      `¿Seguro que quieres eliminar "${name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteHabit(id),
        },
      ]
    );
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  // Pantalla de carga mientras AsyncStorage trae los hábitos
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22d3ee" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          {/* Badge de la app */}
          <View style={styles.badge}>
            <Ionicons name="radio-button-on" size={12} color="#22d3ee" />
            <Text style={styles.badgeText}>Momentum</Text>
          </View>
          <Text style={styles.greeting}>
            Hola, <Text style={styles.greetingName}>{firstName}</Text> 👋
          </Text>
          <Text style={styles.greetingSubtitle}>
            {habits.length === 0
              ? "Agrega tu primer hábito para comenzar"
              : completedToday === habits.length
              ? "¡Completaste todos tus hábitos hoy! 🎉"
              : `Te faltan ${habits.length - completedToday} hábito${
                  habits.length - completedToday !== 1 ? "s" : ""
                } por hoy`}
          </Text>
        </View>

        {/* Botón cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Calendario semanal */}
      <WeeklyCalendar />

      {/* Tarjetas de estadísticas */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={[styles.statValue, { color: "#f97316" }]}>{maxStreak}</Text>
          <Text style={styles.statLabel}>Mejor racha</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={20} color="#34d399" />
          <Text style={[styles.statValue, { color: "#34d399" }]}>
            {completedToday}/{habits.length}
          </Text>
          <Text style={styles.statLabel}>Completados</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={20} color="#22d3ee" />
          <Text style={[styles.statValue, { color: "#22d3ee" }]}>{weeklyRate}%</Text>
          <Text style={styles.statLabel}>De hoy</Text>
        </View>
      </View>

      {/* Título de sección con fecha */}
      {habits.length > 0 && (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Hábitos de hoy</Text>
          <Text style={styles.sectionDate}>
            {capitalize(formatDateLong(new Date()))}
          </Text>
        </View>
      )}

      {/* Lista de hábitos */}
      {habits.map((habit) => {
        const isCompletedToday =
          habit.completed && habit.lastCompletedDate === TODAY;
        const isEditing = editingId === habit.id;

        return (
          <View key={habit.id} style={styles.habitCard}>
            {/* Punto de color del hábito */}
            <View style={[styles.habitDot, { backgroundColor: habit.color }]} />

            <View style={styles.habitInfo}>
              {isEditing ? (
                // Modo edición — input inline
                <View style={styles.editRow}>
                  <TextInput
                    style={styles.editInput}
                    value={editingName}
                    onChangeText={setEditingName}
                    onSubmitEditing={() => handleConfirmEdit(habit.id)}
                    autoFocus
                    returnKeyType="done"
                  />
                  <TouchableOpacity onPress={() => handleConfirmEdit(habit.id)}>
                    <Ionicons name="checkmark" size={18} color="#34d399" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setEditingId(null)}>
                    <Ionicons name="close" size={18} color="#64748b" />
                  </TouchableOpacity>
                </View>
              ) : (
                // Modo normal — nombre y racha
                <Text
                  style={[
                    styles.habitName,
                    isCompletedToday && styles.habitNameDone,
                  ]}
                  numberOfLines={1}
                >
                  {habit.name}
                </Text>
              )}
              <Text style={styles.habitStreak}>
                {habit.streak > 0
                  ? `🔥 ${habit.streak} días seguidos`
                  : "⚡ Sin racha aún"}
              </Text>

              {/* Barra de progreso */}
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: isCompletedToday ? "100%" : "0%",
                      backgroundColor: habit.color,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Botones de acción */}
            {!isEditing && (
              <View style={styles.habitActions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => {
                    setEditingId(habit.id);
                    setEditingName(habit.name);
                  }}
                >
                  <Ionicons name="pencil-outline" size={14} color="#64748b" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => handleDeleteHabit(habit.id, habit.name)}
                >
                  <Ionicons name="trash-outline" size={14} color="#64748b" />
                </TouchableOpacity>

                {/* Toggle completado */}
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    isCompletedToday && {
                      backgroundColor: habit.color + "22",
                      borderColor: habit.color + "55",
                    },
                  ]}
                  onPress={() => toggleHabit(habit.id)}
                >
                  <Ionicons
                    name={isCompletedToday ? "checkmark-circle" : "ellipse-outline"}
                    size={18}
                    color={isCompletedToday ? habit.color : "#64748b"}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}

      {/* Empty state */}
      {habits.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🎯</Text>
          <Text style={styles.emptyTitle}>No tienes hábitos todavía</Text>
          <Text style={styles.emptySubtitle}>
            Agrega tu primero para empezar a construir tu rutina
          </Text>
        </View>
      )}

      {/* Input para agregar hábito */}
      {showInput && (
        <View style={styles.addInputCard}>
          <TextInput
            style={styles.addInput}
            value={newHabitName}
            onChangeText={(t) => {
              setNewHabitName(t);
              setInputError("");
            }}
            placeholder="Nombre del nuevo hábito..."
            placeholderTextColor="#475569"
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAddHabit}
          />
          {inputError ? (
            <Text style={styles.inputError}>{inputError}</Text>
          ) : null}
          <View style={styles.addInputActions}>
            <TouchableOpacity style={styles.addConfirmBtn} onPress={handleAddHabit}>
              <Text style={styles.addConfirmText}>Agregar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addCancelBtn}
              onPress={() => {
                setShowInput(false);
                setNewHabitName("");
                setInputError("");
              }}
            >
              <Text style={styles.addCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Botón agregar hábito */}
      {!showInput && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowInput(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Agregar nuevo hábito</Text>
        </TouchableOpacity>
      )}

      {/* AI Coach */}
      <AiCoach
        completedToday={completedToday}
        totalHabits={habits.length}
        maxStreak={maxStreak}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07111f",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#07111f",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  badgeText: {
    color: "#cbd5e1",
    fontSize: 11,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
  },
  greetingName: {
    color: "#22d3ee",
  },
  greetingSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 10,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    gap: 4,
  },
  statIcon: {
    fontSize: 18,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e2e8f0",
  },
  sectionDate: {
    fontSize: 11,
    color: "#64748b",
  },
  habitCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  habitDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  habitInfo: {
    flex: 1,
    minWidth: 0,
  },
  habitName: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
  habitNameDone: {
    // Tachado cuando está completado
    textDecorationLine: "line-through",
    color: "#64748b",
  },
  habitStreak: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  editInput: {
    flex: 1,
    color: "white",
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    paddingBottom: 2,
  },
  habitActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    marginBottom: 16,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    maxWidth: 220,
  },
  addInputCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  addInput: {
    color: "white",
    fontSize: 14,
  },
  inputError: {
    color: "#f87171",
    fontSize: 11,
    marginTop: 6,
  },
  addInputActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  addConfirmBtn: {
    flex: 1,
    backgroundColor: "#0e7490",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  addConfirmText: {
    color: "white",
    fontSize: 13,
    fontWeight: "600",
  },
  addCancelBtn: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  addCancelText: {
    color: "#94a3b8",
    fontSize: 13,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#7c3aed",
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 4,
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});