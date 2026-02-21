"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "@/src/types/user";
import { getStoredToken, clearStoredToken } from "@/src/lib/api-client";
import { setStoredUser, clearStoredUser } from "@/src/lib/mock-storage";
import { fetchMe, logout as apiLogout } from "@/src/services/api/auth";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (u: User) => void;
  logout: () => Promise<void>;
  updateUser: (data: Partial<Pick<User, "name" | "firstName" | "lastName" | "email" | "phone" | "document_number">>) => void;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      fetchMe()
        .then((u) => {
          setUserState(u);
          if (u) setStoredUser(JSON.stringify(u));
        })
        .catch(() => {
          setUserState(null);
          clearStoredUser();
          clearStoredToken();
        })
        .finally(() => {
          setIsLoading(false);
          setHydrated(true);
        });
    } else {
      clearStoredUser();
      setUserState(null);
      setIsLoading(false);
      setHydrated(true);
    }
  }, []);

  const login = useCallback((u: User) => {
    setUserState(u);
    setStoredUser(JSON.stringify(u));
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setUserState(null);
    clearStoredUser();
  }, []);

  const updateUser = useCallback((data: Partial<Pick<User, "name" | "firstName" | "lastName" | "email" | "phone" | "document_number">>) => {
    setUserState((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...data };
      if (data.firstName !== undefined || data.lastName !== undefined) {
        next.name = [next.firstName, next.lastName].filter(Boolean).join(" ").trim() || next.name;
      }
      setStoredUser(JSON.stringify(next));
      return next;
    });
  }, []);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) setStoredUser(JSON.stringify(u));
    else clearStoredUser();
  }, []);

  const value: AuthContextValue = { user, isLoading, login, logout, updateUser, setUser };

  if (!hydrated) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
