import React, { useState } from 'react';
import { GitBranch, GitCommit, Search, ArrowRight, Key, Check, Lock, LogIn, UserPlus } from 'lucide-react';
import { Repository } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getStoredGitHubToken, setStoredGitHubToken } from '../../services/githubService';

const EXAMPLE_PUBLIC_REPOS = [
  { id: 'example-hello-world', owner: 'octocat', name: 'Hello-World', url: 'https://github.com/octocat/Hello-World' },
  { id: 'example-gitignore', owner: 'github', name: 'gitignore', url: 'https://github.com/github/gitignore' }
];
  onStartAnalysis: (repoUrl: string) => void;
  presetRepos: Repository[];
  onNavigateToAuth: (view: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  presetRepos,
  onNavigateToAuth
}) => {
  const { isAuthenticated, setAuthNotice } = useAuth();
  const [inputUrl, setInputUrl] = useState('');
  const [previewTab, setPreviewTab] = useState<'commits' | 'contributors' | 'diffs'>('commits');
  const [showTokenSettings, setShowTokenSettings] = useState(false);
  const [token, setToken] = useState(getStoredGitHubToken());
  const [tokenSaved, setTokenSaved] = useState(false);

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredGitHubToken(token);
    setTokenSaved(true);
    setTimeout(() => setTokenSaved(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setAuthNotice({
        type: 'warning',
        code: 'logged_out',
        title: 'Sign In Required',
        message: 'Pengguna WAJIB login atau membuat akun terlebih dahulu sebelum dapat mengakses fitur utama analisis GitContrib.'
      });
      onNavigateToAuth('login');
      return;
    }

    if (inputUrl.trim()) {
      onStartAnalysis(inputUrl.trim());
    }
  };

  const handleSelectPreset = (url: string) => {
    setInputUrl(url);
  };

  return (
    <div className="bg-[#ffffff] min-h-[calc(100vh-3.5rem)] text-[#1f2328] font-sans">
      {/* Hero Section */}
      <section className="border-b border-[#d0d7de] pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium text-[#1f2328] bg-[#f6f8fa] border border-[#d0d7de] rounded-md mb-6">
            <span className="w-2 h-2 rounded-full bg-[#1a7f37]"></span>
            <span>Git History Analytics Engine & Contributor Clustering</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1f2328] text-balance">
            Understand Contribution Patterns from Git History
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[#57606a] leading-relaxed max-w-2xl">
            GitContrib menganalisis histori GitHub Repository untuk membantu memahami pola aktivitas contributor berdasarkan karakteristik Git objektif dan pengelompokan Machine Learning.
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => onNavigateToAuth('login')}
                  className="px-5 py-2.5 bg-[#1a7f37] hover:bg-[#1f883d] text-white font-semibold text-sm rounded-md transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToAuth('register')}
                  className="px-5 py-2.5 bg-[#f6f8fa] hover:bg-[#eaeef2] text-[#1f2328] font-semibold text-sm rounded-md border border-[#d0d7de] transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-[#57606a]" />
                  <span>Create Account</span>
                </button>
              </>
            ) : (
              <div className="p-2.5 bg-[#dafbe1] border border-[#4ac26b]/50 text-[#1a7f37] rounded-md text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Terautentikasi · Akses Analisis Repositori Aktif</span>
              </div>
            )}
          </div>

          {/* Repository Input Form */}
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-2xl">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#57606a]">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#ffffff] border border-[#d0d7de] rounded-md text-[#1f2328] font-mono placeholder:text-[#8c959f] focus:outline-none focus:ring-2 focus:ring-[#0969da] transition-all shadow-2xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#1f2328] hover:bg-[#24292f] text-white font-semibold text-sm rounded-md transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <span>Analyze Repository</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Presets List & Live Notice */}
            <div className="mt-3.5 flex flex-col gap-2 text-xs text-[#57606a]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-[#1f2328]">Contoh repositori publik:</span>
                {EXAMPLE_PUBLIC_REPOS.map((repo) => (
                  <button
                    type="button"
                    key={repo.id}
                    onClick={() => handleSelectPreset(repo.url)}
                    className="font-mono text-[#0969da] hover:underline bg-[#f6f8fa] border border-[#d0d7de] px-2 py-0.5 rounded transition-colors"
                  >
                    {repo.owner}/{repo.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 pt-1 text-[11px] text-[#57606a]">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a7f37]"></span>
                  <span>Live GitHub REST API: Memproses histori commit & kontribusi secara real-time.</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTokenSettings(!showTokenSettings)}
                  className="text-[#0969da] hover:underline flex items-center gap-1 font-mono"
                >
                  <Key className="w-3 h-3" />
                  <span>{showTokenSettings ? 'Sembunyikan Token API' : 'Token GitHub (Opsional)'}</span>
                </button>
              </div>

              {showTokenSettings && (
                <div className="mt-2 p-3 bg-[#f6f8fa] border border-[#d0d7de] rounded-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1f2328] text-xs">
                      GitHub Personal Access Token (PAT)
                    </span>
                    <span className="text-[11px] text-[#57606a]">
                      Meningkatkan batas rate limit dari 60 menjadi 5.000 request/jam
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="flex-1 px-2.5 py-1 text-xs font-mono border border-[#d0d7de] rounded bg-white text-[#1f2328] focus:outline-none focus:ring-1 focus:ring-[#0969da]"
                    />
                    <button
                      type="button"
                      onClick={handleSaveToken}
                      className="px-3 py-1 bg-[#1f2328] hover:bg-[#24292f] text-white text-xs font-medium rounded transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {tokenSaved ? (
                        <>
                          <Check className="w-3 h-3 text-[#7ee787]" />
                          <span>Disimpan</span>
                        </>
                      ) : (
                        <span>Simpan</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* GitHub-Inspired Interface Visual Representation */}
        <div className="mt-12 border border-[#d0d7de] rounded-md bg-[#ffffff] shadow-2xs overflow-hidden">
          <div className="bg-[#f6f8fa] border-b border-[#d0d7de] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-[#1f2328]">
                <span className="text-[#0969da]">gitcontrib-lab</span>
                <span className="text-[#57606a]">/</span>
                <span className="text-[#0969da] font-bold">gitcontrib-core</span>
              </div>
              <span className="text-[11px] font-medium border border-[#d0d7de] rounded-full px-2 py-0.2 text-[#57606a] bg-white">
                public
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#57606a]">
              <div className="flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-[#57606a]" />
                <span className="font-mono font-medium text-[#1f2328]">main</span>
              </div>
              <span>·</span>
              <span className="font-mono">1,420 commits</span>
              <span>·</span>
              <span className="font-mono">14 contributors</span>
            </div>
          </div>

          <div className="border-b border-[#d0d7de] bg-[#ffffff] px-4 flex items-center gap-4 text-xs font-medium text-[#57606a]">
            <button
              onClick={() => setPreviewTab('commits')}
              className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
                previewTab === 'commits'
                  ? 'border-[#fd8c73] text-[#1f2328] font-semibold'
                  : 'border-transparent hover:text-[#1f2328]'
              }`}
            >
              Commit History Stream
            </button>
            <button
              onClick={() => setPreviewTab('contributors')}
              className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
                previewTab === 'contributors'
                  ? 'border-[#fd8c73] text-[#1f2328] font-semibold'
                  : 'border-transparent hover:text-[#1f2328]'
              }`}
            >
              Contributor Activity Cadence
            </button>
            <button
              onClick={() => setPreviewTab('diffs')}
              className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
                previewTab === 'diffs'
                  ? 'border-[#fd8c73] text-[#1f2328] font-semibold'
                  : 'border-transparent hover:text-[#1f2328]'
              }`}
            >
              Line Churn & Diff Metrics
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {previewTab === 'commits' && (
              <div className="divide-y divide-[#d0d7de]">
                <div className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <img
                      src="https://api.dicebear.com/7.x/identicon/svg?seed=budipratama"
                      alt="Budi Pratama"
                      className="w-5 h-5 rounded-full mt-0.5 border border-[#d0d7de]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#1f2328]">
                        refactor(engine): optimize commit graph topological traversal
                      </p>
                      <p className="text-[11px] text-[#57606a] mt-0.5">
                        <span className="font-semibold text-[#1f2328]">Budi Pratama</span> committed 12 hours ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-[#1a7f37] font-medium">+142</span>
                    <span className="font-mono text-[#cf222e] font-medium">-98</span>
                    <span className="font-mono text-[11px] bg-[#f6f8fa] border border-[#d0d7de] px-2 py-0.5 rounded text-[#0969da]">
                      7f9a2b1
                    </span>
                  </div>
                </div>

                <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <img
                      src="https://api.dicebear.com/7.x/identicon/svg?seed=sitirahma"
                      alt="Siti Rahmawati"
                      className="w-5 h-5 rounded-full mt-0.5 border border-[#d0d7de]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#1f2328]">
                        feat(views): add interactive commit punchcard heatmap view
                      </p>
                      <p className="text-[11px] text-[#57606a] mt-0.5">
                        <span className="font-semibold text-[#1f2328]">Siti Rahmawati</span> committed 2 days ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-mono text-[#1a7f37] font-medium">+380</span>
                    <span className="font-mono text-[#cf222e] font-medium">-22</span>
                    <span className="font-mono text-[11px] bg-[#f6f8fa] border border-[#d0d7de] px-2 py-0.5 rounded text-[#0969da]">
                      4b7e912
                    </span>
                  </div>
                </div>
              </div>
            )}

            {previewTab === 'contributors' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 border border-[#d0d7de] rounded-md bg-[#f6f8fa]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0969da]"></div>
                    <span className="text-xs font-semibold text-[#1f2328]">Sustained Core</span>
                  </div>
                  <p className="text-xs text-[#57606a] mt-1.5">
                    Continuous cadence across all weeks, balanced refactoring and architecture maintenance.
                  </p>
                </div>

                <div className="p-3 border border-[#d0d7de] rounded-md bg-[#f6f8fa]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1a7f37]"></div>
                    <span className="text-xs font-semibold text-[#1f2328]">Sprint Feature</span>
                  </div>
                  <p className="text-xs text-[#57606a] mt-1.5">
                    Bursty intervals with high net additions during feature release sprints.
                  </p>
                </div>

                <div className="p-3 border border-[#d0d7de] rounded-md bg-[#f6f8fa]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8250df]"></div>
                    <span className="text-xs font-semibold text-[#1f2328]">Maintenance & Patch</span>
                  </div>
                  <p className="text-xs text-[#57606a] mt-1.5">
                    Bug resolution, unit test hardening, and dependency maintenance.
                  </p>
                </div>
              </div>
            )}

            {previewTab === 'diffs' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#57606a]">Repository Total Line Churn</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-[#1a7f37] font-semibold">+184,520 lines added</span>
                    <span className="text-[#cf222e] font-semibold">-62,410 lines deleted</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-[#cf222e] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#1a7f37]" style={{ width: '74.7%' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
