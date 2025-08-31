import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect } from 'react';
import AuthService from '../../service/AuthService';
import fetchWithAuth from "../../utils/fetchWithAuth";

type AuthResultType = {
  status: string;
  message: string;
};

type AuthContextState = {
  accessToken: string | null;
  logout: () => Promise<AuthResultType>;
  login: (email: string, password: string) => Promise<AuthResultType>;
};

const AuthContext = createContext<AuthContextState>({
  accessToken: null,
  logout: () => Promise.resolve({ status: "failed", message: "" }),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: async (e: string, p: string) => Promise.resolve({ status: "failed", message: "" }),
});

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const accessToken = AuthService.getAuth();

  useEffect(() => {
    (async function () {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
          credentials: "include"
        });

        if (response.ok) {
          const data = await response.json();
          AuthService.setAuth(data.accessToken);
        }
      } catch (error) {
        console.error("❌ Token refresh failed", error);
      }
    })();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResultType> => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (response.ok) {
        const data = await response.json();
        AuthService.setAuth(data.accessToken);
        return { status: "success", message: "" }
      }

      return { status: "failed", message: "Login failed" };
    } catch (error) {
      console.error("❌ Login failed", error);

      const errorMessage = error instanceof Error ? error.message : String(error);
      return { status: "failed", message: errorMessage };
    }
  }

  const logout = async () => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
        credentials: "include",
      });

      if (response.ok) {
        AuthService.clearAuth();
        return { status: "success", message: "" }
      }
      return { status: "failed", message: "Logout failed" };
    } catch (error) {
      console.log("❌ Error during log out", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return { status: "failed", message: errorMessage };
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, logout, login }} >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextState => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth should be used inside scope of context");
  }

  return context;
}

