import React, { useState } from 'react';
import {
  ChevronDown,
  LogOut,
  User,
  Shield
} from 'lucide-react';
import { Repository } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { AnimatedDropdown } from '../animations/AnimatedDropdown';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  activeRepo: Repository | null;
  onSelectRepo: (repo: Repository) => void;
  allRepos: Repository[];
  onNewAnalysisClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  activeRepo,
  onSelectRepo,
  allRepos,
  onNewAnalysisClick,
}) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRepoDropdown, setShowRepoDropdown] = useState(false);

  const isAdmin = user?.role === 'admin';
  const repoDisplayName = activeRepo ? activeRepo.name : 'Belum ada repositori';

  return (
    <header className="border-b border-[#e5e7eb] bg-white sticky top-0 z-30 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Section: Green Icon + GitContrib Logo + / + Repo Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange(isAdmin ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              {/* Green Git Icon Box */}
              <div className="w-8 h-8 rounded-md bg-[#167d37] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9 1.48 1.48.51.39 1.15.54 1.69.48 0 .66.01 1.28.01 1.48 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                </svg>
              </div>

              {/* Wordmark */}
              <span className="text-lg font-bold tracking-tight text-[#111827]">
                GitContrib
              </span>
            </button>

            {/* Separator Slash */}
            <span className="text-[#9ca3af] font-light text-base sm:text-lg">/</span>

            {/* Repository Selector Dropdown / Name */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowRepoDropdown(!showRepoDropdown)}
                className="text-sm font-medium text-[#6b7280] hover:text-[#111827] flex items-center gap-1.5 py-1 px-1.5 rounded transition-colors cursor-pointer"
                title="Klik untuk memilih repositori"
              >
                <span>{repoDisplayName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
              </button>

              {/* Repo Selector Menu */}
<<<<<<< HEAD
              {showRepoDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowRepoDropdown(false)} />
                  <div className="absolute left-0 mt-1.5 w-60 bg-white border border-[#e5e7eb] rounded-lg shadow-lg py-1.5 z-50 text-xs">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider border-b border-[#f3f4f6]">
                      Pilih Repositori
                    </div>
                    {allRepos.length === 0 ? (
                      <p className="px-3 py-2 text-[#6b7280]">Belum ada repositori di akun ini.</p>
                    ) : (
                      allRepos.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          onSelectRepo(r);
                          setShowRepoDropdown(false);
                          if (currentTab === 'landing') {
                            onTabChange('dashboard');
                          }
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#f9fafb] cursor-pointer ${
                          activeRepo?.id === r.id ? 'font-bold text-[#111827] bg-[#f3f4f6]' : 'text-[#4b5563]'
                        }`}
                      >
                        <span className="truncate">{r.owner}/{r.name}</span>
                        {activeRepo?.id === r.id && <span className="w-1.5 h-1.5 rounded-full bg-[#167d37]" />}
                      </button>
                    ))
                    )}
                    <div className="border-t border-[#f3f4f6] pt-1 mt-1 px-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowRepoDropdown(false);
                          onNewAnalysisClick();
                        }}
                        className="w-full text-center py-1.5 text-[#167d37] font-semibold hover:bg-[#f0fdf4] rounded transition-colors"
                      >
                        + Analisis Repositori Baru
                      </button>
                    </div>
                  </div>
                </>
              )}
=======
              <AnimatedDropdown
                isOpen={showRepoDropdown}
                onClose={() => setShowRepoDropdown(false)}
                className="absolute left-0 mt-1.5 w-60 bg-white border border-[#e5e7eb] rounded-lg shadow-lg py-1.5 z-50 text-xs"
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider border-b border-[#f3f4f6]">
                  Pilih Repositori
                </div>
                {allRepos.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      onSelectRepo(r);
                      setShowRepoDropdown(false);
                      if (currentTab === 'landing') {
                        onTabChange('dashboard');
                      }
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#f9fafb] cursor-pointer ${
                      activeRepo?.id === r.id ? 'font-bold text-[#111827] bg-[#f3f4f6]' : 'text-[#4b5563]'
                    }`}
                  >
                    <span className="truncate">{r.owner}/{r.name}</span>
                    {activeRepo?.id === r.id && <span className="w-1.5 h-1.5 rounded-full bg-[#167d37]" />}
                  </button>
                ))}
                <div className="border-t border-[#f3f4f6] pt-1 mt-1 px-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRepoDropdown(false);
                      onNewAnalysisClick();
                    }}
                    className="w-full text-center py-1.5 text-[#167d37] font-semibold hover:bg-[#f0fdf4] rounded transition-colors"
                  >
                    + Analisis Repositori Baru
                  </button>
                </div>
              </AnimatedDropdown>
>>>>>>> 1275c96c29fed675522a325a3651012ddbb95027
            </div>
          </div>

          {/* Right Section: Navigation Links (Exact matching image style) */}
          <nav className="flex items-center gap-1 sm:gap-2 text-sm">
            {/* Beranda */}
            <button
              onClick={() => onTabChange('landing')}
              className={`nav-item px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                currentTab === 'landing'
                  ? 'bg-[#f3f4f6] text-[#111827] font-semibold'
                  : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f9fafb]'
              }`}
            >
              Beranda
            </button>

            {/* Dashboard */}
            <button
              onClick={() => onTabChange('dashboard')}
              className={`nav-item px-3.5 py-1.5 rounded-lg font-medium cursor-pointer ${
                currentTab === 'dashboard'
                  ? 'bg-[#f3f4f6] text-[#111827] font-semibold'
                  : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f9fafb]'
              }`}
            >
              Dashboard
            </button>

            {/* Kontributor */}
            <button
              onClick={() => onTabChange('contributors')}
              className={`nav-item px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                currentTab === 'contributors'
                  ? 'bg-[#f3f4f6] text-[#111827] font-semibold'
                  : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f9fafb]'
              }`}
            >
              Kontributor
            </button>

            {/* Pola ML */}
            <button
              onClick={() => onTabChange('ml')}
              className={`nav-item px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                currentTab === 'ml'
                  ? 'bg-[#f3f4f6] text-[#111827] font-semibold'
                  : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f9fafb]'
              }`}
            >
              Pola ML
            </button>

            {/* Laporan */}
            <button
              onClick={() => onTabChange('reports')}
              className={`nav-item px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                currentTab === 'reports'
                  ? 'bg-[#f3f4f6] text-[#111827] font-semibold'
                  : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f9fafb]'
              }`}
            >
              Laporan
            </button>

            {/* Pengaturan */}
            <button
              onClick={() => onTabChange('settings')}
              className={`nav-item px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
                currentTab === 'settings'
                  ? 'bg-[#f3f4f6] text-[#111827] font-semibold'
                  : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f9fafb]'
              }`}
            >
              Pengaturan
            </button>

            {/* User Avatar & Menu */}
            {user && (
              <div className="relative ml-2 pl-2 border-l border-[#e5e7eb]">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[#f3f4f6] transition-colors focus:outline-none cursor-pointer"
                  title={`${user.name} (${user.role})`}
                >
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#d1d5db]"
                  />
                </button>

                <AnimatedDropdown
                  isOpen={showUserMenu}
                  onClose={() => setShowUserMenu(false)}
                  className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-[#e5e7eb] py-1.5 z-50 text-xs"
                >
                  <div className="px-3.5 py-2 border-b border-[#f3f4f6] bg-[#f9fafb]">
                    <p className="font-bold text-[#111827] truncate">{user.name}</p>
                    <p className="text-[#6b7280] text-[11px] truncate mt-0.5">{user.email}</p>
                    <span className="inline-block mt-1.5 text-[10px] font-bold bg-[#dcfce7] text-[#15803d] px-2 py-0.5 rounded-full uppercase">
                      Role: {user.role}
                    </span>
                  </div>

                  <div className="border-t border-[#f3f4f6] pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full text-left px-3.5 py-2 text-[#dc2626] hover:bg-[#fef2f2] flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-[#dc2626]" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </AnimatedDropdown>
              </div>
            )}
          </nav>

        </div>
      </div>
    </header>
  );
};
