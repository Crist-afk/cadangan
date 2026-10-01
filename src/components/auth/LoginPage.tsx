import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldAlert,
  Database
} from 'lucide-react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps {
  initialView?: 'login' | 'register' | 'forgot' | 'reset';
  onSuccessLogin?: (user?: User) => void;
  onNavigateToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialView = 'login',
  onSuccessLogin,
  onNavigateToLanding
}) => {
  const {
    login,
    register,
    forgotPassword,
    resetPassword,
    authNotice,
    setAuthNotice,
    isLoading
  } = useAuth();

  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialView);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayView, setDisplayView] = useState(initialView);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Local feedback state
  const [localError, setLocalError] = useState<string | null>(null);

  // Handle view transitions
  useEffect(() => {
    if (authView !== displayView) {
      setIsTransitioning(true);
      const timeout = setTimeout(() => {
        setDisplayView(authView);
        setIsTransitioning(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [authView, displayView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (authView === 'login') {
      const res = await login(email, password);
      if (res.success && onSuccessLogin) {
        onSuccessLogin(res.user);
      }
    } else if (authView === 'register') {
      if (password !== confirmPassword) {
        setLocalError('Konfirmasi kata sandi tidak cocok dengan kata sandi.');
        return;
      }
      const res = await register({
        name: fullName,
        email: email,
        password: password
      });
      if (res.success) {
        setAuthView('login');
      }
    } else if (authView === 'forgot') {
      const res = await forgotPassword(email);
      if (res.success) {
        // Keeps user on page with feedback message
      }
    } else if (authView === 'reset') {
      if (password !== confirmPassword) {
        setLocalError('Konfirmasi kata sandi tidak cocok.');
        return;
      }
      const res = await resetPassword(password);
      if (res.success) {
        setAuthView('login');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#1f2328] flex flex-col justify-between font-sans">
      
      {/* Top Header / Branding */}
      <header className="border-b border-[#d0d7de] bg-[#ffffff] py-3.5 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onNavigateToLanding}
            className="flex items-center gap-2 text-[#1f2328] font-bold text-lg cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-7.5 h-7.5 rounded bg-[#167d37] text-white flex items-center justify-center font-extrabold text-sm">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9 1.48 1.48.51.39 1.15.54 1.69.48 0 .66.01 1.28.01 1.48 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
              </svg>
            </div>
            <span>GitContrib</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            {onNavigateToLanding && (
              <button
                onClick={onNavigateToLanding}
                className="text-[#0969da] hover:underline font-medium"
              >
                ← Kembali ke Beranda
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Form Box (Clean GitHub Form Aesthetic) */}
      <div className="flex-1 flex items-center justify-center p-4 py-10">
        <div className="w-full max-w-md">
          
          {/* Form Card Container */}
          <div 
            className="bg-[#ffffff] border border-[#d0d7de] rounded-lg p-6 sm:p-8 shadow-2xs"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateX(-8px)' : 'translateX(0)',
              transition: 'opacity 200ms ease-out, transform 200ms ease-out',
            }}
          >
            
            {/* Header / Logo */}
            <div className="text-center mb-6">
              <div className="inline-flex w-10 h-10 rounded-md bg-[#167d37] text-white items-center justify-center font-extrabold text-lg mb-3 shadow-2xs">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16">
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9 1.48 1.48.51.39 1.15.54 1.69.48 0 .66.01 1.28.01 1.48 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                </svg>
              </div>

              {authView === 'login' && (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1f2328]">
                    Welcome back to GitContrib
                  </h2>
                  <p className="text-xs text-[#57606a] mt-1">
                    Sign in to analyze GitHub contribution patterns.
                  </p>
                </>
              )}

              {authView === 'register' && (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1f2328]">
                    Create your GitContrib account
                  </h2>
                  <p className="text-xs text-[#57606a] mt-1">
                    Create an account to access GitContrib.
                  </p>
                </>
              )}

              {authView === 'forgot' && (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1f2328]">
                    Reset Password
                  </h2>
                  <p className="text-xs text-[#57606a] mt-1">
                    Masukkan email terdaftar Anda untuk menerima instruksi pemulihan kata sandi.
                  </p>
                </>
              )}

              {authView === 'reset' && (
                <>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1f2328]">
                    Set New Password
                  </h2>
                  <p className="text-xs text-[#57606a] mt-1">
                    Masukkan kata sandi baru untuk akun GitContrib Anda.
                  </p>
                </>
              )}
            </div>

            {/* System Auth Feedback Banners */}
            {authNotice && (
              <div
                className={`mb-4 p-3 rounded-md text-xs border flex items-start gap-2.5 ${
                  authNotice.type === 'error'
                    ? 'bg-[#ffebe9] border-[#ff8182]/60 text-[#cf222e]'
                    : authNotice.type === 'warning'
                    ? 'bg-[#fff8c5] border-[#d29922]/60 text-[#9a6700]'
                    : authNotice.type === 'success'
                    ? 'bg-[#dafbe1] border-[#4ac26b]/60 text-[#1a7f37]'
                    : 'bg-[#ddf4ff] border-[#54aeff]/60 text-[#0969da]'
                }`}
              >
                {authNotice.type === 'error' && <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />}
                {authNotice.type === 'warning' && <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
                {authNotice.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
                {authNotice.type === 'info' && <Info className="w-4 h-4 shrink-0 mt-0.5" />}
                <div>
                  <div className="font-bold">{authNotice.title}</div>
                  <div className="mt-0.5 leading-relaxed">{authNotice.message}</div>
                </div>
              </div>
            )}

            {localError && (
              <div className="mb-4 p-3 rounded-md text-xs bg-[#ffebe9] border border-[#ff8182]/60 text-[#cf222e] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{localError}</span>
              </div>
            )}

            {/* Main Real Authentication Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Register: Full Name */}
              {authView === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-[#1f2328] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="misal: Dr. Hendra Wijaya, M.T."
                    className="w-full px-3 py-2 text-xs bg-white border border-[#d0d7de] rounded text-[#1f2328] placeholder-[#8c959f] focus:outline-none focus:ring-2 focus:ring-[#0969da]"
                  />
                </div>
              )}

              {/* Email Address */}
              {(authView === 'login' || authView === 'register' || authView === 'forgot') && (
                <div>
                  <label className="block text-xs font-semibold text-[#1f2328] mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={authView === 'login' ? 'dosen@gitcontrib.ac.id' : 'name@university.ac.id'}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#d0d7de] rounded text-[#1f2328] placeholder-[#8c959f] focus:outline-none focus:ring-2 focus:ring-[#0969da]"
                  />
                </div>
              )}

              {/* Password */}
              {(authView === 'login' || authView === 'register' || authView === 'reset') && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-[#1f2328]">
                      {authView === 'reset' ? 'New Password' : 'Password'}
                    </label>
                    {authView === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthView('forgot');
                          setAuthNotice(null);
                        }}
                        className="text-[11px] text-[#0969da] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={authView === 'login' ? 'Masukkan kata sandi' : 'Minimal 5 karakter'}
                      className="w-full pl-3 pr-9 py-2 text-xs bg-white border border-[#d0d7de] rounded text-[#1f2328] placeholder-[#8c959f] focus:outline-none focus:ring-2 focus:ring-[#0969da]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-[#57606a] hover:text-[#1f2328]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              {(authView === 'register' || authView === 'reset') && (
                <div>
                  <label className="block text-xs font-semibold text-[#1f2328] mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi Anda"
                    className="w-full px-3 py-2 text-xs bg-white border border-[#d0d7de] rounded text-[#1f2328] placeholder-[#8c959f] focus:outline-none focus:ring-2 focus:ring-[#0969da]"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-[#167d37] hover:bg-[#1f883d] text-white font-semibold text-xs rounded transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {authView === 'login' && 'Sign In'}
                      {authView === 'register' && 'Create Account'}
                      {authView === 'forgot' && 'Send Reset Link'}
                      {authView === 'reset' && 'Reset Password'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Navigation Links */}
            <div className="mt-6 pt-4 border-t border-[#d0d7de] text-center text-xs text-[#57606a]">
              {authView === 'login' && (
                <div>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthView('register');
                      setAuthNotice(null);
                    }}
                    className="text-[#0969da] font-semibold hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </div>
              )}

              {authView === 'register' && (
                <div>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthView('login');
                      setAuthNotice(null);
                    }}
                    className="text-[#0969da] font-semibold hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </div>
              )}

              {(authView === 'forgot' || authView === 'reset') && (
                <div>
                  Remember your password?{' '}
                  <button
                    onClick={() => {
                      setAuthView('login');
                      setAuthNotice(null);
                    }}
                    className="text-[#0969da] font-semibold hover:underline cursor-pointer"
                  >
                    Return to Sign In
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Real XAMPP Database Connection Note */}
          <div className="mt-4 p-3 bg-white border border-[#d0d7de] rounded-md text-[11px] text-[#57606a] space-y-1">
            <div className="font-semibold text-[#1f2328] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#167d37]" />
              <span>Koneksi Database XAMPP (MySQL `gitcontrib`):</span>
            </div>
            <div className="font-mono text-[#0969da]">Akun Dosen: dosen@gitcontrib.ac.id (kata sandi: dosen123)</div>
            <div className="font-mono text-[#0969da]">Akun Admin: admin@gitcontrib.ac.id (kata sandi: admin123)</div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#d0d7de] bg-[#ffffff] py-4 px-4 text-center text-xs text-[#57606a]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GitContrib &copy; 2026 · Real MySQL Database Integration</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span>XAMPP / MariaDB Supported</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
