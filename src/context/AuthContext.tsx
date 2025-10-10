// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";  // ✅ type-only import
import { fetchAuthSession, signOut } from "aws-amplify/auth";

type AuthCtx = {
  user: { email: string } | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({} as AuthCtx);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const readSession = async () => {
    try {
      const session = await fetchAuthSession();
      const email = session?.tokens?.idToken?.payload?.email as string | undefined;
      setUser(email ? { email } : null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    readSession();
  }, []);

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        refresh: readSession,
        logout: async () => {
          await signOut();
          await readSession();
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
