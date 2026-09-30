import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User as UserIcon,
  Briefcase,
  Eye,
  EyeOff,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Github,
  HelpCircle,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, register, loginWithDemo, loginWithGithub, loginWithGoogle, isLoading } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [company, setCompany] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessNotice(null);

    if (mode === 'signin') {
      const res = await login(email, password, rememberMe);
      if (!res.success) {
        setErrorMsg(res.error || 'Gagal masuk. Periksa email dan kata sandi Anda.');
      }
    } else {
      const res = await register({
        name,
        email,
        password,
        role,
        company
      });
      if (!res.success) {
        setErrorMsg(res.error || 'Gagal mendaftar.');
      } else {
        setSuccessNotice('Akun berhasil dibuat! Mengalihkan ke sistem...');
      }
    }
  };

  const handleFillDemo = (type: 'owner' | 'reviewer' | 'analyst') => {
    setErrorMsg(null);
    loginWithDemo(type);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex flex-col font-sans selection:bg-[#1f6feb] selection:text-white">
      {/* Top Bar / Branding */}
      <header className="border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#238636] text-white flex items-center justify-center font-bold shadow-md shadow-green-950/40">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9 1.48 1.48.51.39 1.15.54 1.69.48 0 .66.01 1.28.01 1.48 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
              </svg>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-bold text-white tracking-tight">
                GitContrib
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#238636]"></span>
                v1.4 · Portal Akses Aman
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8b949e] bg-[#21262d] px-3 py-1.5 rounded-lg border border-[#30363d]">
            <ShieldCheck className="w-4 h-4 text-[#3fb950]" />
            <span className="font-medium text-[#c9d1d9]">Portal Akses Terverifikasi</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Platform Overview & Live Stats */}
          <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#1f6feb]/10 via-[#238636]/5 to-transparent blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1f6feb]/10 border border-[#1f6feb]/30 text-[#58a6ff] text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analisis Pola Kontributor Repositori Git</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Audit & Klasterisasi Kontributor GitHub Berdasarkan Git History
              </h1>

              <p className="mt-4 text-sm sm:text-base text-[#8b949e] leading-relaxed">
                Masuk untuk mengakses dashboard analitik, klasterisasi machine learning tanpa pemeringkatan ego (Zero-Ranking), serta laporan pola arsitektur kode tim Anda.
              </p>

              {/* Feature Highlights */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#238636]/20 border border-[#238636]/40 flex items-center justify-center text-[#3fb950] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">Analisis Pola Objektif (Zero-Ranking)</h3>
                    <p className="text-xs text-[#8b949e] mt-0.5">
                      Membedakan arketipe peran (Core Architect, Sprint Specialist, Guardian) secara adil tanpa skor ranking subjektif.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#1f6feb]/20 border border-[#1f6feb]/40 flex items-center justify-center text-[#58a6ff] shrink-0 mt-0.5">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">Machine Learning Clustering Engine</h3>
                    <p className="text-xs text-[#8b949e] mt-0.5">
                      Mengekstraksi 7 vektor perilaku: commit cadence, burstiness, churn ratio, dan modular spread.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-[#a371f7]/20 border border-[#a371f7]/40 flex items-center justify-center text-[#bc8cff] shrink-0 mt-0.5">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white">Akses Bebas untuk Kolega & Rekan</h3>
                    <p className="text-xs text-[#8b949e] mt-0.5">
                      Rekan Anda dapat masuk langsung menggunakan akun demo 1-klik untuk meninjau hasil analisis repositori publik.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Live Preview Box */}
            <div className="mt-8 pt-6 border-t border-[#30363d]/80 bg-[#0d1117]/60 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-5 rounded-b-2xl">
              <div className="flex items-center justify-between text-xs text-[#8b949e] mb-2 font-mono">
                <span className="flex items-center gap-1.5 text-[#58a6ff]">
                  <GitBranch className="w-3.5 h-3.5" />
                  Dataset Terverifikasi
                </span>
                <span className="text-[#3fb950] font-semibold">Ready for Review</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-[#161b22] border border-[#30363d]">
                  <div className="text-white font-bold text-sm">3,890+</div>
                  <div className="text-[#8b949e] text-[10px]">Commits Analyzed</div>
                </div>
                <div className="p-2 rounded bg-[#161b22] border border-[#30363d]">
                  <div className="text-white font-bold text-sm">4 Archetypes</div>
                  <div className="text-[#8b949e] text-[10px]">ML Clustered</div>
                </div>
                <div className="p-2 rounded bg-[#161b22] border border-[#30363d]">
                  <div className="text-white font-bold text-sm">&lt; 3.2s</div>
                  <div className="text-[#8b949e] text-[10px]">Pipeline Speed</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Login / Register Form */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
              
              {/* Tab Selector */}
              <div className="flex items-center p-1 bg-[#0d1117] rounded-xl border border-[#30363d] mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    mode === 'signin'
                      ? 'bg-[#21262d] text-white shadow-sm border border-[#30363d]'
                      : 'text-[#8b949e] hover:text-[#c9d1d9]'
                  }`}
                >
                  Masuk (Sign In)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                    mode === 'signup'
                      ? 'bg-[#21262d] text-white shadow-sm border border-[#30363d]'
                      : 'text-[#8b949e] hover:text-[#c9d1d9]'
                  }`}
                >
                  Daftar Akun Baru (Sign Up)
                </button>
              </div>

              {/* Instant One-Click Demo Access (Super useful for user's colleagues!) */}
              <div className="mb-6 p-3.5 rounded-xl bg-gradient-to-r from-[#1f6feb]/15 via-[#238636]/10 to-[#1f6feb]/10 border border-[#1f6feb]/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#58a6ff]" />
                    Akses Cepat Demo (1-Klik Masuk)
                  </span>
                  <span className="text-[10px] text-[#8b949e]">Tanpa ketik kata sandi</span>
                </div>
                <p className="text-[11px] text-[#8b949e] mb-3 leading-relaxed">
                  Rekan kerja dapat langsung mencoba sistem ini secara instan:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('owner')}
                    disabled={isLoading}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-left transition-colors group cursor-pointer"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&auto=format&fit=crop&q=80"
                      alt="Crist Garcia"
                      className="w-7 h-7 rounded-full object-cover border border-[#484f58]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white truncate group-hover:text-[#58a6ff]">
                        Crist Garcia
                      </div>
                      <div className="text-[10px] text-[#8b949e] truncate">Lead Engineer</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFillDemo('reviewer')}
                    disabled={isLoading}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-left transition-colors group cursor-pointer"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&auto=format&fit=crop&q=80"
                      alt="Rekan Reviewer"
                      className="w-7 h-7 rounded-full object-cover border border-[#484f58]"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white truncate group-hover:text-[#3fb950]">
                        Rekan / Reviewer
                      </div>
                      <div className="text-[10px] text-[#8b949e] truncate">Guest Collab</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <button
                  type="button"
                  onClick={() => loginWithGithub()}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  <Github className="w-4 h-4 text-white" />
                  <span>GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-xs font-medium text-white transition-colors cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.54 0 2.92.54 4.01 1.43l3-3C17.2 1.7 14.78 1 12 1 7.42 1 3.53 3.61 1.66 7.39l3.66 2.84C6.2 7.46 8.87 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.69z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.32 14.77c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27L1.66 7.39C.6 9.49 0 11.68 0 14s.6 4.51 1.66 6.61l3.66-2.84z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.08.72-2.45 1.16-4.23 1.16-3.13 0-5.8-2.46-6.68-5.23L1.66 15.99C3.53 19.77 7.42 23 12 23z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center mb-5">
                <div className="border-t border-[#30363d] w-full" />
                <span className="bg-[#161b22] px-3 text-[11px] text-[#8b949e] absolute uppercase tracking-wider">
                  atau gunakan email
                </span>
              </div>

              {/* Notification Badges */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-[#da3633]/15 border border-[#f85149]/40 text-[#f85149] text-xs flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f85149] shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successNotice && (
                <div className="mb-4 p-3 rounded-lg bg-[#238636]/15 border border-[#3fb950]/40 text-[#3fb950] text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successNotice}</span>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-[#c9d1d9] mb-1.5">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8b949e]">
                          <UserIcon className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="misal: Budi Santoso"
                          className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#c9d1d9] mb-1.5">
                          Peran / Jabatan
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8b949e]">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Software Engineer"
                            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#c9d1d9] mb-1.5">
                          Organisasi / Tim
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8b949e]">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Engineering Dept"
                            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-medium text-[#c9d1d9] mb-1.5">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8b949e]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@perusahaan.com atau email github"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-[#c9d1d9]">
                      Kata Sandi
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('cristgarciapasaribu@gmail.com');
                          setPassword('demo123');
                          setErrorMsg(null);
                        }}
                        className="text-[11px] text-[#58a6ff] hover:underline"
                      >
                        Pakai sandi demo (demo123)
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8b949e]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signin' ? 'Masukkan kata sandi (demo123)' : 'Minimal 5 karakter'}
                      className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8b949e] hover:text-[#c9d1d9]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#8b949e]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#30363d] bg-[#0d1117] text-[#1f6feb] focus:ring-0 focus:ring-offset-0"
                    />
                    <span>Ingat saya di browser ini</span>
                  </label>

                  <span className="text-[11px] text-[#8b949e] flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" />
                    Sesi terenkripsi lokal
                  </span>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#238636] hover:bg-[#2ea043] active:bg-[#238636] text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memproses Akses...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'signin' ? 'Masuk ke GitContrib' : 'Buat Akun & Masuk'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Informative Security Disclaimer */}
              <div className="mt-5 text-center text-[11px] text-[#8b949e] border-t border-[#30363d]/60 pt-4">
                <span>
                  Portal ini melindungi akses aplikasi Anda. Rekan kerja dapat membuka tautan publik dan langsung masuk tanpa biaya token tambahan.
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#30363d] py-4 px-6 text-center text-xs text-[#8b949e] bg-[#161b22]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>GitContrib &copy; 2026 · Git History Contributor Pattern Analysis</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privasi Data Aman</span>
            <span>·</span>
            <span>Zero-Ranking Ethics</span>
            <span>·</span>
            <span>Machine Learning Pipeline</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
