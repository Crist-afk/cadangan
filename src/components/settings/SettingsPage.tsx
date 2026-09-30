import React, { useState } from 'react';
import { Settings, Sliders, CheckCircle2, Shield, RotateCcw, Save, Key, ExternalLink, Trash2, User as UserIcon, LogOut } from 'lucide-react';
import { Repository } from '../../types';
import { getStoredGitHubToken, setStoredGitHubToken } from '../../services/githubService';
import { useAuth } from '../../context/AuthContext';
import { StaggerContainer } from '../animations/StaggerContainer';

interface SettingsPageProps {
  repo: Repository;
  onReanalyze: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ repo, onReanalyze }) => {
  const { user, logout } = useAuth();
  const [excludeMerges, setExcludeMerges] = useState(true);
  const [excludeBots, setExcludeBots] = useState(true);
  const [clusterCount, setClusterCount] = useState<number>(4);
  const [minCommits, setMinCommits] = useState<number>(2);
  const [isSaved, setIsSaved] = useState(false);
  const [githubToken, setGithubToken] = useState<string>(getStoredGitHubToken());
  const [tokenNotice, setTokenNotice] = useState<string>('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredGitHubToken(githubToken);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleClearToken = () => {
    setStoredGitHubToken('');
    setGithubToken('');
    setTokenNotice('Token cleared. Using standard unauthenticated limits (60 req/hr).');
    setTimeout(() => setTokenNotice(''), 3000);
  };

  return (
    <div className="bg-[#ffffff] min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-[#d0d7de]">
        <h2 className="text-xl font-bold tracking-tight text-[#1f2328]">
          Analysis Settings & Methodology Configuration
        </h2>
        <p className="text-xs sm:text-sm text-[#57606a] mt-0.5">
          Tune Git history extraction heuristics, bot filtering, and clustering parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Git Extraction Filters */}
        <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
          <h3 className="text-sm font-semibold text-[#1f2328] mb-3">
            Git History Extraction Heuristics
          </h3>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeMerges}
                onChange={(e) => setExcludeMerges(e.target.checked)}
                className="mt-0.5 rounded border-[#d0d7de] text-[#0969da] focus:ring-0"
              />
              <div>
                <span className="text-xs font-semibold text-[#1f2328] block">
                  Exclude Merge Commits
                </span>
                <span className="text-xs text-[#57606a]">
                  Filters out branch merge commits (`Merge branch '...' into ...`) to prevent double-counting diff churn.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeBots}
                onChange={(e) => setExcludeBots(e.target.checked)}
                className="mt-0.5 rounded border-[#d0d7de] text-[#0969da] focus:ring-0"
              />
              <div>
                <span className="text-xs font-semibold text-[#1f2328] block">
                  Filter Automated CI / Bot Accounts
                </span>
                <span className="text-xs text-[#57606a]">
                  Ignores recognized automation handles (e.g. `dependabot[bot]`, `renovate[bot]`, `github-actions[bot]`).
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 2: Machine Learning Clustering Tuning */}
        <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
          <h3 className="text-sm font-semibold text-[#1f2328] mb-3">
            Machine Learning Hyperparameters
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-[#1f2328]">Cluster Target (k):</span>
                <span className="font-mono font-bold text-[#1f2328]">{clusterCount} clusters</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                value={clusterCount}
                onChange={(e) => setClusterCount(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-[#57606a] mt-1 font-mono">
                <span>k=2 (Broad)</span>
                <span>k=4 (Recommended Optimal)</span>
                <span>k=6 (Granular)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#d0d7de]">
              <label className="block font-medium text-[#1f2328] mb-1">
                Minimum Contributor Commit Threshold
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={minCommits}
                onChange={(e) => setMinCommits(parseInt(e.target.value) || 1)}
                className="w-32 px-3 py-1.5 border border-[#d0d7de] rounded text-xs bg-white focus:outline-none"
              />
              <span className="text-[11px] text-[#57606a] block mt-1">
                Contributors with fewer commits are mapped as peripheral documentation or bugfix contributors.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: GitHub API Connection & Authentication */}
        <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#1f2328] flex items-center gap-2">
              <Key className="w-4 h-4 text-[#0969da]" />
              <span>GitHub API Connection & Authentication</span>
            </h3>
            <span className="text-[11px] font-mono text-[#57606a]">
              {githubToken ? 'Authenticated (5,000 req/hr)' : 'Unauthenticated (60 req/hr)'}
            </span>
          </div>

          <p className="text-xs text-[#57606a] mb-4">
            GitContrib queries the public GitHub REST API directly to fetch repository metadata, contributor commits, language distributions, and commit trees. Providing an optional personal access token avoids IP rate limits.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#1f2328] mb-1">
                Personal Access Token (Classic or Fine-grained)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="flex-1 px-3 py-1.5 text-xs font-mono border border-[#d0d7de] rounded bg-white text-[#1f2328] focus:ring-1 focus:ring-[#0969da] focus:outline-none"
                />
                {githubToken && (
                  <button
                    type="button"
                    onClick={handleClearToken}
                    className="px-3 py-1.5 text-xs text-[#cf222e] hover:bg-[#ffebe9] border border-[#d0d7de] rounded flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#57606a] mt-1.5">
                <span>Stored securely in client-side localStorage only. Never transmitted to third parties.</span>
                <a
                  href="https://github.com/settings/tokens/new?scopes=public_repo&description=GitContrib+Analyzer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0969da] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Generate token on GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {tokenNotice && (
              <div className="p-2.5 bg-[#dafbe1] border border-[#4ac26b] text-[#1a7f37] text-xs rounded">
                {tokenNotice}
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Current Authenticated Session */}
        {user && (
          <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
            <h3 className="text-sm font-semibold text-[#1f2328] mb-1 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-[#0969da]" />
              <span>Sesi Pengguna & Otorisasi</span>
            </h3>
            <p className="text-xs text-[#57606a] mb-4">
              Informasi akun yang sedang aktif untuk sesi eksplorasi metrik ini.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#f6f8fa] border border-[#d0d7de]">
              <div className="flex items-center gap-3">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#d0d7de]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0969da] text-white flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm text-[#1f2328] flex items-center gap-2">
                    <span>{user.name}</span>
                    <span className="text-[10px] font-medium bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b] px-2 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  </div>
                  <div className="text-xs text-[#57606a] mt-0.5 font-mono">
                    {user.email} · {user.company || 'Engineering Team'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="px-3.5 py-1.5 text-xs font-semibold text-[#cf222e] hover:bg-[#ffebe9] border border-[#d0d7de] rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar (Logout)</span>
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onReanalyze}
            className="px-4 py-2 text-xs font-medium text-[#cf222e] hover:bg-[#ffebe9] border border-[#d0d7de] rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-run Full Analysis Pipeline</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-[#1a7f37] hover:bg-[#1f883d] rounded-md flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Settings Saved' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
