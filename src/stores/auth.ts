import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { authService } from "../services/authService";
import type { User, LoginRequest, AuthResponse } from "../types/auth";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(
    () => user.value?.roles?.includes("ROLE_ADMIN") || false
  );
  const isTeacher = computed(
    () => user.value?.roles?.includes("ROLE_TEACHER") || false
  );
  const isStudent = computed(
    () => user.value?.roles?.includes("ROLE_STUDENT") || false
  );

  const setAuth = (authResponse: AuthResponse) => {
    token.value = authResponse.token;
    user.value = {
      id: authResponse.id,
      email: authResponse.email,
      firstName: authResponse.firstName,
      lastName: authResponse.lastName,
      roles: authResponse.roles,
    };
    localStorage.setItem("token", authResponse.token);
    localStorage.setItem("user", JSON.stringify(user.value));
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const login = async (credentials: LoginRequest) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await authService.login(credentials);
      setAuth(response);
      return response;
    } catch (err: any) {
      error.value = err.response?.data?.message || "Login failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    clearAuth();
  };

  const checkAuth = () => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      try {
        token.value = savedToken;
        user.value = JSON.parse(savedUser);
      } catch (err) {
        clearAuth();
      }
    }
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent,
    login,
    logout,
    checkAuth,
  };
});
