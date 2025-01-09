import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: { email: null, id: null }, // Estado inicial del usuario

      login: (userData) => set({ user: userData }), // Acción para iniciar sesión
      logout: () => set({ user: { email: null, id: null } }) // Acción para cerrar sesión
    }),
    {
      name: "user-session", // Nombre de la clave en localStorage
      getStorage: () => localStorage, // Almacenamos en localStorage
    }
  )
);

export default useUserStore;
