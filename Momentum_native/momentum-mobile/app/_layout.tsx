import { useEffect } from "react";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { HabitsProvider } from "../src/context/HabitsContext";
import { View, ActivityIndicator } from "react-native";

// Componente interno que maneja la redirección según el estado de sesión
// Debe estar dentro de AuthProvider para poder usar useAuth()
const RootLayout = () => {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    // Si hay sesión activa va al home, si no va al login
    if (isLoggedIn) {
      router.replace("/home");
    } else {
      router.replace("/");
    }
  }, [isLoggedIn, isLoading]);

  // Mientras carga AsyncStorage mostramos un spinner
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#07111f", alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#22d3ee" />
      </View>
    );
  }

  return (
    <>
      {/* Barra de estado clara sobre fondo oscuro */}
      <StatusBar style="light" />

      {/* Stack sin headers visibles — cada pantalla maneja su propio diseño */}
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#07111f" } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="create-account" />
        <Stack.Screen name="home" />
      </Stack>
    </>
  );
};

// Componente raíz — envuelve todo con los providers
// HabitsProvider va dentro de AuthProvider porque necesita currentUser
export default function Layout() {
  return (
    <AuthProvider>
      <HabitsProvider>
        <RootLayout />
      </HabitsProvider>
    </AuthProvider>
  );
}