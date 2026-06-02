import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hook genérico que reemplaza useLocalStorage de la versión web.
// AsyncStorage es asíncrono a diferencia de localStorage,
// por eso necesitamos useEffect y useState para manejar la carga inicial.
export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Carga el valor guardado cuando el componente se monta
  useEffect(() => {
    const loadValue = async () => {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error leyendo ${key} de AsyncStorage:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key]);

  // Guarda un nuevo valor — acepta valor directo o función (igual que useState)
  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error guardando ${key} en AsyncStorage:`, error);
      }
    },
    [key, storedValue]
  );

  // Elimina el valor y vuelve al valor inicial
  const removeValue = useCallback(async () => {
    try {
      setStoredValue(initialValue);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error eliminando ${key} de AsyncStorage:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, isLoading] as const;
}