import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { secureStorage } from "../utils/storage";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setToken, token } = useAuthStore();

  useEffect(() => {
    const rehydrateAuth = async () => {
      const storedToken = await secureStorage.getItem("auth_token");
      if (storedToken && !token) {
        setToken(storedToken);
      }
    };
    rehydrateAuth();
  }, [setToken, token]);

  return <>{children}</>;
}
