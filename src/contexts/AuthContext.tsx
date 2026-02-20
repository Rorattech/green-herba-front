"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/src/types/user';
import { getStoredUser, setStoredUser, clearStoredUser } from '@/src/lib/mock-storage';

type AuthContextValue = {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  updateUser: (data: Partial<Pick<User, 'name' | 'firstName' | 'lastName' | 'email'>>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadUser(): User | null {
  const raw = getStoredUser();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(loadUser());
    setHydrated(true);
  }, []);

  const login = useCallback((u: User) => {
    setUser(u);
    setStoredUser(JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearStoredUser();
  }, []);

  const updateUser = useCallback((data: Partial<Pick<User, 'name' | 'firstName' | 'lastName' | 'email'>>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...data };
      if (data.firstName !== undefined || data.lastName !== undefined) {
        next.name = [next.firstName, next.lastName].filter(Boolean).join(' ').trim() || next.name;
      }
      setStoredUser(JSON.stringify(next));
      return next;
    });
  }, []);

  const value: AuthContextValue = { user, login, logout, updateUser };

  if (!hydrated) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
