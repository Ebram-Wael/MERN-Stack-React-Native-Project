import { create } from "zustand";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoadingIn: false,

  register: async (email, userName, password) => {
    set({ isLoadingIn: true });
    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userName, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, token: data.token, isLoadingIn: false });
      return { success: true, user: data.user };
    } catch (error) {
        set({ isLoadingIn: false });
        console.error("Registration error:", error);
        return { success: false, message: error.message || "Registration failed" };
    }
  },
}));

export default useAuthStore;
