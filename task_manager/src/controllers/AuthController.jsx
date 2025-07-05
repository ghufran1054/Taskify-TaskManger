import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000/api"; // adjust for production if needed

export const useAuthController = () => {
  const { login: setAuthUser, logout: clearAuth } = useAuth();

  const signup = async (email, password, username) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || "Signup failed" };
      }

      return { success: true, message: "Signup successful!" };
    } catch (err) {
      return { success: false, message: err.toString() };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || "Login failed" };
      }

      const { token, user } = data;

      setAuthUser( user, token);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.toString() };
    }
  };

  const logout = () => {
    clearAuth();
  };

  return { signup, login, logout };
};
