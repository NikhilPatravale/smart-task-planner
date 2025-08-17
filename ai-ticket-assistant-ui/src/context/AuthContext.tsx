import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

type AuthContextProps = PropsWithChildren;
type AuthContextState = {
  isTokenPresent: boolean;
};

const AuthContext = createContext({ isTokenPresent: false });

export default function AuthContextProvider({ children }: AuthContextProps) {
  const path = window.location.pathname;
  const [isTokenPresent, setIsTokenPresent] = useState<boolean>(false);

  useEffect(() => {
    const newToken = Cookies.get("taskToken");
    setIsTokenPresent(!!newToken);
  }, [path]);


  return (
    <AuthContext.Provider value={{ isTokenPresent }} >
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

