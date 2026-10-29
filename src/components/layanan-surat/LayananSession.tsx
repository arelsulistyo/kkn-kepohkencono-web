"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { User } from "firebase/auth";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import LoginDialog from "./LoginDialog";

interface LayananSession {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  requestLogin: (onLoggedIn?: () => void) => void;
}

const SessionContext = createContext<LayananSession | null>(null);

export function LayananSessionProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { toast } = useToast();
  const [loginOpen, setLoginOpen] = useState(false);
  const afterLogin = useRef<(() => void) | null>(null);

  const requestLogin = useCallback((onLoggedIn?: () => void) => {
    afterLogin.current = onLoggedIn ?? null;
    setLoginOpen(true);
  }, []);

  const handleLogout = useCallback(async () => {
    const result = await logout();
    if (result.success) {
      toast({ title: "Logout berhasil", description: "Sampai jumpa kembali!" });
    }
  }, [logout, toast]);

  const value = useMemo(
    () => ({ user, loading, logout: handleLogout, requestLogin }),
    [user, loading, handleLogout, requestLogin]
  );

  return (
    <SessionContext.Provider value={value}>
      {children}
      <LoginDialog
        open={loginOpen}
        onOpenChange={(open) => {
          setLoginOpen(open);
          if (!open) afterLogin.current = null;
        }}
        onLoggedIn={() => {
          const next = afterLogin.current;
          afterLogin.current = null;
          setLoginOpen(false);
          next?.();
        }}
      />
    </SessionContext.Provider>
  );
}

export function useLayananSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useLayananSession must be used inside LayananSessionProvider");
  return session;
}
