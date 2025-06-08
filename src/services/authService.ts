import api from "./api";
import type { LoginRequest, AuthResponse } from "../types/auth";

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // async register(userData: RegisterRequest): Promise<AuthResponse> {
  //   const response = await api.post('/auth/register', userData)
  //   return response.data
  // }
};
