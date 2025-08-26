import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

//3.10.50

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async (email, userName, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch("http://192.168.1.3:3000/api/auth/register", {
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
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true, user: data.user };
    } catch (error) {
      set({ isLoading: false });
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    }
  },
  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userJson = await AsyncStorage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      set({ user: user, token: token });
    } catch (error) {
      console.log("Auth check filed", error);
    }
  },
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await fetch("http://192.168.1.3:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "something went wrong");
      }
      console.log("My data Login", data);
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
  logout: async () => {
    try {
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("token");
      set({ token: null, user: null });
    } catch (error) {
      console.error(error);
    }
  },
}));

export default useAuthStore;
