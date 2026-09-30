import React, { useState } from 'react';
import {
  GitBranch,
  GitCommit,
  Users,
  BarChart3,
  Cpu,
  FileText,
  Settings,
  ExternalLink,
  LogOut,
  ChevronDown,
  Search,
  ArrowLeft,
  Sparkles,
  Layers,
  HelpCircle,
  Database
} from 'lucide-react';
import { Repository } from '../../types';
import { useAuth } from '../../context/AuthContext';

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

  const isRepoView = activeRepo && currentTab !== 'landing' && currentTab !== 'pipeline';

  return (
    <header className="border-b border-[#d0d7de] bg-[#ffffff] sticky top-0 z-30 shadow-2xs">
      {/* Top Bar: Wordmark, Quick Navigation, and User Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          
          {/* Zone 1: Logo & Brand Name */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onTabChange('landing')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0969da] rounded-md py-1 cursor-pointer"
              title="Kembali ke Beranda"
            >
              <div className="w-8 h-8 rounded-md bg-[#1f2328] text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-[#24292f] transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                  <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9 1.48 1.48.51.39 1.15.54 1.69.48 0 .66.01 1.28.01 1.48 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-[#1f2328] leading-tight">
                  GitContrib
                </span>
                <span className="text-[10px] font-medium text-[#57606a] leading-none hidden xs:inline">
                  Analytics Platform
                </span>
              </div>
            </button>

            {/* Clean Pill Badge */}
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-[#57606a] bg-[#f6f8fa] border border-[#d0d7de] px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a7f37]"></span>
              <span>v1.4 Git History Engine</span>
            </span>
          </div>

          {/* Zone 2: Navigation Links (Clean & Contextual) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-medium text-[#57606a]">
            {isRepoView ? (
              /* When in Repo Detail View: show clean switcher back to all repos or quick overview */
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => onTabChange('landing')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[#57606a] hover:text-[#1f2328] hover:bg-[#f6f8fa] rounded-md transition-colors cursor-pointer"
                  title="Kembali ke Halaman Cari & Beranda"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Jelajahi Repositori Lain</span>
                </button>
                <span className="text-[#d0d7de]">|</span>
                <span className="px-2 py-1 text-[#57606a] font-medium flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#0969da]" />
                  <span>Mode Analisis Aktif</span>
                </span>
              </div>
            ) : (
              /* When in Landing / Overview View */
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onTabChange('landing')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    currentTab === 'landing'
                      ? 'bg-[#f6f8fa] text-[#1f2328] font-semibold border border-[#d0d7de]'
                      : 'hover:text-[#1f2328] hover:bg-[#f6f8fa]'
                  }`}
                >
                  Beranda
                </button>
                {activeRepo && (
                  <button
                    onClick={() => onTabChange('dashboard')}
                    className="px-3 py-1.5 rounded-md hover:text-[#1f2328] hover:bg-[#f6f8fa] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Dashboard Repo</span>
                  </button>
                )}
                <button
                  onClick={() => onTabChange('settings')}
                  className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                    currentTab === 'settings'
                      ? 'bg-[#f6f8fa] text-[#1f2328] font-semibold border border-[#d0d7de]'
                      : 'hover:text-[#1f2328] hover:bg-[#f6f8fa]'
                  }`}
                >
                  Pengaturan
                </button>
              </div>
            )}
          </nav>

          {/* Zone 3: Primary Actions & User Profile */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Repository Selector Dropdown (visible when repos exist) */}
            {allRepos.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md px-2 py-1 text-xs">
                <GitBranch className="w-3.5 h-3.5 text-[#57606a]" />
                <select
                  value={activeRepo ? activeRepo.id : ''}
                  onChange={(e) => {
                    const found = allRepos.find((r) => r.id === e.target.value);
                    if (found) {
                      onSelectRepo(found);
                      if (currentTab === 'landing') {
                        onTabChange('dashboard');
                      }
                    }
                  }}
                  className="text-xs bg-transparent border-none text-[#1f2328] font-medium focus:ring-0 focus:outline-none cursor-pointer max-w-[140px] lg:max-w-[190px] truncate"
                  aria-label="Pilih Repositori"
                >
                  {allRepos.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.owner}/{r.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* New Analysis Button */}
            <button
              onClick={onNewAnalysisClick}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1a7f37] hover:bg-[#1f883d] border border-[rgba(31,35,40,0.15)] rounded-md transition-colors whitespace-nowrap shadow-2xs cursor-pointer flex items-center gap-1.5"
              title="Analisis Repositori GitHub Baru"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Analisis Baru</span>
              <span className="sm:hidden">Analisis</span>
            </button>

            {/* User Profile & Logout Dropdown */}
            {user && (
              <div className="relative border-l border-[#d0d7de] pl-2 sm:pl-2.5 ml-0.5">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 rounded-md hover:bg-[#f6f8fa] border border-[#d0d7de] transition-colors focus:outline-none cursor-pointer"
                  title={`${user.name} (${user.role})`}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-5 h-5 rounded-full object-cover border border-[#d0d7de]"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#0969da] text-white flex items-center justify-center text-[10px] font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:inline text-xs font-semibold text-[#1f2328] max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#57606a]" />
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-[#d0d7de] py-1.5 z-50 text-xs">
                      {/* User Info Header */}
                      <div className="px-3.5 py-2.5 border-b border-[#d0d7de] bg-[#f6f8fa]">
                        <p className="font-bold text-[#1f2328] truncate">{user.name}</p>
                        <p className="text-[#57606a] text-[11px] truncate mt-0.5">{user.email}</p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="inline-block text-[10px] font-semibold bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/40 px-2 py-0.5 rounded-full">
                            {user.role}
                          </span>
                          {user.company && (
                            <span className="text-[10px] text-[#57606a] truncate">
                              @{user.company}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Navigation Actions */}
                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            onTabChange('settings');
                          }}
                          className="w-full text-left px-3.5 py-2 text-[#1f2328] hover:bg-[#f6f8fa] flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5 text-[#57606a]" />
                          <span>Pengaturan Sesi & Repositori</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            onTabChange('landing');
                          }}
                          className="w-full text-left px-3.5 py-2 text-[#1f2328] hover:bg-[#f6f8fa] flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <Search className="w-3.5 h-3.5 text-[#57606a]" />
                          <span>Cari Repositori Publik</span>
                        </button>
                      </div>

                      {/* Logout Action */}
                      <div className="border-t border-[#d0d7de] pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="w-full text-left px-3.5 py-2 text-[#cf222e] hover:bg-[#ffebe9] flex items-center gap-2 font-medium cursor-pointer transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5 text-[#cf222e]" />
                          <span>Keluar (Logout)</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sub-header: Repository Context Bar (when viewing a repository) */}
      {isRepoView && (
        <div className="bg-[#f6f8fa] border-t border-[#d0d7de]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3.5 pb-0">
            {/* Top row: Breadcrumb, badges, metadata, and actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3">
              
              {/* Repository Breadcrumb & Status Badges */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center gap-1.5 text-base sm:text-lg font-semibold text-[#1f2328]">
                  <button
                    onClick={() => onTabChange('landing')}
                    className="text-[#0969da] hover:underline cursor-pointer font-medium"
                    title="Jelajahi repositori milik organisasi ini"
                  >
                    {activeRepo.owner}
                  </button>
                  <span className="text-[#8c959f]">/</span>
                  <span className="text-[#1f2328] font-bold">
                    {activeRepo.name}
                  </span>
                </div>

                {/* Visibility Badge */}
                <span className="text-[11px] font-semibold border border-[#d0d7de] rounded-full px-2.5 py-0.5 text-[#57606a] bg-white capitalize shadow-2xs">
                  {activeRepo.visibility}
                </span>

                {/* Live Data Badge */}
                {activeRepo.isLiveGitHub ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold border border-[#4ac26b]/50 rounded-full px-2.5 py-0.5 text-[#1a7f37] bg-[#dafbe1] shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a7f37] animate-pulse"></span>
                    Live GitHub API
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium border border-[#d0d7de] rounded-full px-2 py-0.5 text-[#57606a] bg-white shadow-2xs">
                    Dataset Demo
                  </span>
                )}

                {/* Branch and Commits Metrics */}
                <div className="flex items-center gap-1.5 ml-1">
                  <span className="inline-flex items-center gap-1 text-xs text-[#57606a] bg-white px-2 py-0.5 rounded-md border border-[#d0d7de] font-mono shadow-2xs">
                    <GitBranch className="w-3 h-3 text-[#57606a]" />
                    <span>{activeRepo.branches.length} {activeRepo.branches.length === 1 ? 'branch' : 'branches'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-[#57606a] bg-white px-2 py-0.5 rounded-md border border-[#d0d7de] font-mono tabular-nums shadow-2xs">
                    <GitCommit className="w-3 h-3 text-[#57606a]" />
                    <span>{activeRepo.totalCommits.toLocaleString()} commits</span>
                  </span>
                </div>
              </div>

              {/* Status and GitHub link */}
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#d0d7de] text-[#1f2328] font-medium shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#1a7f37]"></span>
                  <span>Analisis Lengkap</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#d0d7de] text-[#57606a] shadow-2xs">
                  <span className="text-[#8c959f]">Branch:</span>
                  <span className="font-mono font-medium text-[#1f2328]">{activeRepo.defaultBranch}</span>
                </span>
                <a
                  href={activeRepo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-[#d0d7de] text-[#0969da] hover:text-[#0550ae] hover:border-[#0969da] font-medium transition-colors shadow-2xs"
                  title="Buka Repositori di GitHub Resmi"
                >
                  <span>Buka di GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Bottom row: GitHub-style Repository Navigation Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto border-b border-transparent">
              <button
                onClick={() => onTabChange('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-md transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'border-[#fd8c73] bg-[#ffffff] text-[#1f2328] border-t border-x border-[#d0d7de] -mb-[1px]'
                    : 'text-[#57606a] hover:text-[#1f2328] hover:bg-[#eaeef2]/60 border-transparent'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#57606a]" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onTabChange('contributors')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-md transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
                  currentTab === 'contributors'
                    ? 'border-[#fd8c73] bg-[#ffffff] text-[#1f2328] border-t border-x border-[#d0d7de] -mb-[1px]'
                    : 'text-[#57606a] hover:text-[#1f2328] hover:bg-[#eaeef2]/60 border-transparent'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#57606a]" />
                <span>Kontributor</span>
                <span className="text-[10px] bg-[#afb8c1]/20 text-[#24292f] rounded-full px-1.5 py-0.2 font-mono">
                  {activeRepo.totalContributors}
                </span>
              </button>

              <button
                onClick={() => onTabChange('analysis')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-md transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
                  currentTab === 'analysis'
                    ? 'border-[#fd8c73] bg-[#ffffff] text-[#1f2328] border-t border-x border-[#d0d7de] -mb-[1px]'
                    : 'text-[#57606a] hover:text-[#1f2328] hover:bg-[#eaeef2]/60 border-transparent'
                }`}
              >
                <GitCommit className="w-3.5 h-3.5 text-[#57606a]" />
                <span>Timeline Aktivitas</span>
              </button>

              <button
                onClick={() => onTabChange('ml')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-md transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
                  currentTab === 'ml'
                    ? 'border-[#fd8c73] bg-[#ffffff] text-[#1f2328] border-t border-x border-[#d0d7de] -mb-[1px]'
                    : 'text-[#57606a] hover:text-[#1f2328] hover:bg-[#eaeef2]/60 border-transparent'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-[#57606a]" />
                <span>Machine Learning</span>
              </button>

              <button
                onClick={() => onTabChange('reports')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-md transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
                  currentTab === 'reports'
                    ? 'border-[#fd8c73] bg-[#ffffff] text-[#1f2328] border-t border-x border-[#d0d7de] -mb-[1px]'
                    : 'text-[#57606a] hover:text-[#1f2328] hover:bg-[#eaeef2]/60 border-transparent'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#57606a]" />
                <span>Laporan & Export</span>
              </button>

              <button
                onClick={() => onTabChange('settings')}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-md transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
                  currentTab === 'settings'
                    ? 'border-[#fd8c73] bg-[#ffffff] text-[#1f2328] border-t border-x border-[#d0d7de] -mb-[1px]'
                    : 'text-[#57606a] hover:text-[#1f2328] hover:bg-[#eaeef2]/60 border-transparent'
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-[#57606a]" />
                <span>Pengaturan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
