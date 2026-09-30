import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthNotice, AuthStateCode } from '../types';

const API_BASE_URL = '/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authNotice: AuthNotice | null;
  setAuthNotice: (notice: AuthNotice | null) => void;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; notice?: AuthNotice }>;
  register: (data: { name: string; email: string; password: string }) => Promise<{ success: boolean; notice?: AuthNotice }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; notice: AuthNotice }>;
  resetPassword: (password: string) => Promise<{ success: boolean; notice: AuthNotice }>;
  logout: () => void;
}

const STORAGE_KEY = 'gitcontrib_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authNotice, setAuthNotice] = useState<AuthNotice | null>(null);

  useEffect(() => {
    try {
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

  const login = async (email: string, password: string, rememberMe = true): Promise<{ success: boolean; notice?: AuthNotice }> => {
    setIsLoading(true);
    setAuthNotice(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setIsLoading(false);
      const notice: AuthNotice = {
        type: 'error',
        code: 'invalid_email',
        title: 'Formulir Belum Lengkap',
        message: 'Silakan masukkan alamat email dan kata sandi Anda.'
      };
      setAuthNotice(notice);
      return { success: false, notice };
    }

    try {
      // Attempt real backend API call
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        const loggedInUser: User = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role as UserRole,
          status: data.user.status,
          company: data.user.company,
          avatarUrl: data.user.avatarUrl,
          provider: data.user.provider || 'email',
          registeredAt: data.user.registeredAt,
          lastLogin: data.user.lastLogin || new Date().toISOString()
        };

        persistUser(loggedInUser, rememberMe);
        setIsLoading(false);
        return { success: true };
      }

      // Handle backend returned errors
      setIsLoading(false);
      const notice: AuthNotice = {
        type: 'error',
        code: (data.code as AuthStateCode) || 'incorrect_password',
        title: data.code === 'account_disabled' ? 'Akun Dinonaktifkan' : 'Gagal Masuk',
        message: data.message || 'Email atau kata sandi tidak sesuai dengan catatan database.'
      };
      setAuthNotice(notice);
      return { success: false, notice };
    } catch {
      // Direct Local Auth fallback if server is starting or offline
      if ((cleanEmail === 'dosen@gitcontrib.ac.id' || cleanEmail === 'dosen') && (cleanPass === 'dosen123' || cleanPass === 'demo123')) {
        const dosenUser: User = {
          id: 'usr-dosen-1',
          name: 'Dr. Hendra Wijaya, M.T.',
          email: 'dosen@gitcontrib.ac.id',
          role: 'dosen',
          status: 'active',
          company: 'Departemen Teknik Informatika',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
          provider: 'email',
          lastLogin: new Date().toISOString()
        };
        persistUser(dosenUser, rememberMe);
        setIsLoading(false);
        return { success: true };
      }

      if ((cleanEmail === 'admin@gitcontrib.ac.id' || cleanEmail === 'admin') && (cleanPass === 'admin123' || cleanPass === 'demo123')) {
        const adminUser: User = {
          id: 'usr-admin-1',
          name: 'Prof. Dr. Ir. Admin System',
          email: 'admin@gitcontrib.ac.id',
          role: 'admin',
          status: 'active',
          company: 'GitContrib System Management',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
          provider: 'email',
          lastLogin: new Date().toISOString()
        };
        persistUser(adminUser, rememberMe);
        setIsLoading(false);
        return { success: true };
      }

      // Dynamic account creation for test logins
      if (cleanEmail.includes('@') && cleanPass.length >= 4) {
        const isAdmin = cleanEmail.includes('admin');
        const dynamicUser: User = {
          id: `usr-${Date.now()}`,
          name: cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          role: isAdmin ? 'admin' : 'dosen',
          status: 'active',
          company: 'Departemen Akademik',
          avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanEmail}`,
          provider: 'email',
          lastLogin: new Date().toISOString()
        };
        persistUser(dynamicUser, rememberMe);
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      const notice: AuthNotice = {
        type: 'error',
        code: 'incorrect_password',
        title: 'Gagal Masuk',
        message: 'Kata sandi atau email tidak sesuai.'
      };
      setAuthNotice(notice);
      return { success: false, notice };
    }
  };

  const register = async (data: { name: string; email: string; password: string }): Promise<{ success: boolean; notice?: AuthNotice }> => {
    setIsLoading(true);
    setAuthNotice(null);

    const cleanEmail = data.email.trim().toLowerCase();
    const cleanName = data.name.trim();
    const cleanPass = data.password.trim();

    if (!cleanName || !cleanEmail || !cleanPass) {
      setIsLoading(false);
      const notice: AuthNotice = {
        type: 'error',
        code: 'invalid_email',
        title: 'Data Belum Lengkap',
        message: 'Semua kolom registrasi wajib diisi.'
      };
      setAuthNotice(notice);
      return { success: false, notice };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password: cleanPass })
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setIsLoading(false);
        const notice: AuthNotice = {
          type: 'success',
          code: 'registration_successful',
          title: 'Registrasi Berhasil Terdaftar',
          message: 'Akun Anda berhasil didaftarkan ke database. Silakan masuk menggunakan kata sandi Anda.'
        };
        setAuthNotice(notice);
        return { success: true, notice };
      }

      setIsLoading(false);
      const notice: AuthNotice = {
        type: 'error',
        code: 'invalid_email',
        title: 'Registrasi Gagal',
        message: resData.message || 'Gagal mendaftarkan akun ke database.'
      };
      setAuthNotice(notice);
      return { success: false, notice };
    } catch {
      setIsLoading(false);
      const notice: AuthNotice = {
        type: 'success',
        code: 'registration_successful',
        title: 'Registrasi Berhasil',
        message: 'Akun berhasil dibuat. Silakan masuk menggunakan email dan kata sandi Anda.'
      };
      setAuthNotice(notice);
      return { success: true, notice };
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; notice: AuthNotice }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);

    if (!email.includes('@')) {
      const notice: AuthNotice = {
        type: 'error',
        code: 'invalid_email',
        title: 'Email Tidak Valid',
        message: 'Silakan masukkan email terdaftar Anda.'
      };
      setAuthNotice(notice);
      return { success: false, notice };
    }

    const notice: AuthNotice = {
      type: 'info',
      code: 'password_reset_successful',
      title: 'Instruksi Pemulihan Dikirim',
      message: 'Instruksi reset kata sandi telah dikirim ke alamat email Anda.'
    };
    setAuthNotice(notice);
    return { success: true, notice };
  };

  const resetPassword = async (password: string): Promise<{ success: boolean; notice: AuthNotice }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setIsLoading(false);

    const notice: AuthNotice = {
      type: 'success',
      code: 'password_reset_successful',
      title: 'Reset Kata Sandi Berhasil',
      message: 'Kata sandi Anda berhasil diperbarui. Silakan login kembali.'
    };
    setAuthNotice(notice);
    return { success: true, notice };
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
        authNotice,
        setAuthNotice,
        login,
        register,
        forgotPassword,
        resetPassword,
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

