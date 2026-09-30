import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (data: { name: string; email: string; password: string; role?: string; company?: string }) => Promise<{ success: boolean; error?: string }>;
  loginWithDemo: (preset?: 'owner' | 'reviewer' | 'analyst') => void;
  loginWithGithub: () => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const STORAGE_KEY = 'gitcontrib_auth_user';
const USERS_KEY = 'gitcontrib_registered_users';

// Pre-configured default users
const DEFAULT_USERS: Array<User & { passwordHash: string }> = [
  {
    id: 'usr-crist',
    name: 'Crist Garcia Pasaribu',
    email: 'cristgarciapasaribu@gmail.com',
    role: 'Lead Platform Engineer',
    company: 'GitContrib Core',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
    provider: 'email',
    passwordHash: 'demo123',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'usr-alex',
    name: 'Alex Chen',
    email: 'alex.chen@gitcontrib.io',
    role: 'Senior ML Engineer',
    company: 'Data Dynamics',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
    provider: 'email',
    passwordHash: 'demo123',
    lastLogin: new Date().toISOString()
  },
  {
    id: 'usr-reviewer',
    name: 'Rekan Tim / Reviewer',
    email: 'rekan.reviewer@gmail.com',
    role: 'Code Reviewer & Contributor',
    company: 'Open Source Collab',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
    provider: 'demo',
    passwordHash: 'demo123',
    lastLogin: new Date().toISOString()
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from storage
  useEffect(() => {
    try {
      // Initialize registered users store if not present
      if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      }

      // Check current session
      const savedUserStr = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr);
        if (parsed && parsed.email) {
          setUser(parsed);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistUser = (newUser: User, remember: boolean = true) => {
    setUser(newUser);
    const dataStr = JSON.stringify(newUser);
    if (remember) {
      localStorage.setItem(STORAGE_KEY, dataStr);
    } else {
      sessionStorage.setItem(STORAGE_KEY, dataStr);
    }
  };

  const login = async (email: string, password: string, rememberMe = true): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // Smooth realistic latency

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setIsLoading(false);
      return { success: false, error: 'Silakan isi email dan kata sandi.' };
    }

    try {
      let registered: Array<User & { passwordHash?: string }> = [];
      const stored = localStorage.getItem(USERS_KEY);
      if (stored) {
        registered = JSON.parse(stored);
      } else {
        registered = DEFAULT_USERS;
      }

      const found = registered.find((u) => u.email.toLowerCase() === cleanEmail);

      // If user exists and password matches, or if any demo user with password "demo123"
      if (found) {
        if (found.passwordHash && found.passwordHash !== cleanPass && cleanPass !== 'demo123') {
          setIsLoading(false);
          return { success: false, error: 'Kata sandi tidak sesuai. (Petunjuk demo: gunakan "demo123")' };
        }

        const loggedInUser: User = {
          id: found.id,
          name: found.name,
          email: found.email,
          role: found.role || 'Repository Analyst',
          company: found.company || 'Engineering Team',
          avatarUrl: found.avatarUrl,
          provider: found.provider || 'email',
          lastLogin: new Date().toISOString()
        };

        persistUser(loggedInUser, rememberMe);
        setIsLoading(false);
        return { success: true };
      }

      // If not in registered list, but user entered a valid email & password >= 4 chars, allow dynamic login as analyst
      if (cleanEmail.includes('@') && cleanPass.length >= 4) {
        const usernamePart = cleanEmail.split('@')[0];
        const formattedName = usernamePart
          .split(/[._-]/)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ');

        const dynamicUser: User = {
          id: `usr-${Date.now()}`,
          name: formattedName || 'Dev Analyst',
          email: cleanEmail,
          role: 'Analyst & Contributor',
          company: 'GitHub Community',
          avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanEmail}`,
          provider: 'email',
          lastLogin: new Date().toISOString()
        };

        // Also add to registered users
        registered.push({ ...dynamicUser, passwordHash: cleanPass });
        localStorage.setItem(USERS_KEY, JSON.stringify(registered));

        persistUser(dynamicUser, rememberMe);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'Email atau kata sandi tidak valid. Minimal 4 karakter kata sandi.' };
    } catch {
      setIsLoading(false);
      return { success: false, error: 'Terjadi kesalahan sistem saat mencoba masuk.' };
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    company?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim();
    const cleanPass = data.password.trim();

    if (!cleanName || !cleanEmail || !cleanPass) {
      setIsLoading(false);
      return { success: false, error: 'Semua kolom wajib diisi lengkap.' };
    }

    if (!cleanEmail.includes('@')) {
      setIsLoading(false);
      return { success: false, error: 'Format email tidak valid.' };
    }

    if (cleanPass.length < 5) {
      setIsLoading(false);
      return { success: false, error: 'Kata sandi minimal terdiri dari 5 karakter.' };
    }

    try {
      let registered: Array<User & { passwordHash?: string }> = [];
      const stored = localStorage.getItem(USERS_KEY);
      if (stored) {
        registered = JSON.parse(stored);
      } else {
        registered = DEFAULT_USERS;
      }

      if (registered.some((u) => u.email.toLowerCase() === cleanEmail)) {
        setIsLoading(false);
        return { success: false, error: 'Email ini sudah terdaftar. Silakan langsung login.' };
      }

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        role: data.role?.trim() || 'Software Engineer',
        company: data.company?.trim() || 'Development Team',
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanEmail}`,
        provider: 'email',
        lastLogin: new Date().toISOString()
      };

      registered.push({ ...newUser, passwordHash: cleanPass });
      localStorage.setItem(USERS_KEY, JSON.stringify(registered));

      persistUser(newUser, true);
      setIsLoading(false);
      return { success: true };
    } catch {
      setIsLoading(false);
      return { success: false, error: 'Gagal membuat akun baru.' };
    }
  };

  const loginWithDemo = (preset: 'owner' | 'reviewer' | 'analyst' = 'owner') => {
    setIsLoading(true);
    setTimeout(() => {
      let chosen = DEFAULT_USERS[0];
      if (preset === 'reviewer') chosen = DEFAULT_USERS[2];
      if (preset === 'analyst') chosen = DEFAULT_USERS[1];

      const demoUser: User = {
        id: chosen.id,
        name: chosen.name,
        email: chosen.email,
        role: chosen.role,
        company: chosen.company,
        avatarUrl: chosen.avatarUrl,
        provider: 'demo',
        lastLogin: new Date().toISOString()
      };

      persistUser(demoUser, true);
      setIsLoading(false);
    }, 400);
  };

  const loginWithGithub = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const githubUser: User = {
      id: `gh-usr-${Date.now()}`,
      name: 'GitHub Engineer',
      email: 'engineer@github.user',
      role: 'Open Source Contributor',
      company: 'GitHub Public Contributor',
      avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
      provider: 'github',
      lastLogin: new Date().toISOString()
    };

    persistUser(githubUser, true);
    setIsLoading(false);
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const googleUser: User = {
      id: `gg-usr-${Date.now()}`,
      name: 'Crist Garcia Pasaribu',
      email: 'cristgarciapasaribu@gmail.com',
      role: 'Lead Platform Engineer',
      company: 'Workspace Cloud',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
      provider: 'google',
      lastLogin: new Date().toISOString()
    };

    persistUser(googleUser, true);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithDemo,
        loginWithGithub,
        loginWithGoogle,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
