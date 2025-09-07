import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from 'react';
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
  login: async (_email: string, _password: string) => Promise.resolve({ status: "failed", message: "" }),
});

export default function AuthContextProvider({ children }: PropsWithChildren) {
  const [authState, setAuthState] = useState({
    isLoading: true,
    error: null as string | null,
  });
  const accessToken = AuthService.getAuth();

  const { isLoading } = authState;

  useEffect(() => {
    (async function () {
      AuthService.clearAuth();
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
          credentials: "include"
        });

        if (response.ok) {
          const data = await response.json();
          AuthService.setAuth(data.accessToken);
          setAuthState({ isLoading: false, error: null });
          return;
        }
        console.log("❌ Token refresh failed", response.statusText);
        setAuthState({ isLoading: false, error: "Some error occurred during authentication" });
      } catch (error) {
        console.error("❌ Token refresh failed", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        setAuthState({ isLoading: false, error: errorMessage });
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // if (error) {
  //   return <Navigate to="/login" />
  // }

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

