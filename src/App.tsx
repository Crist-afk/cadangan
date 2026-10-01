import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/auth/LoginPage';
import { Header } from './components/layout/Header';
import { LandingPage } from './components/landing/LandingPage';
import { AnalysisProgressPage } from './components/pipeline/AnalysisProgressPage';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { ContributorListView } from './components/contributors/ContributorListView';
import { ContributorDetailModal } from './components/contributors/ContributorDetailModal';
import { DeepActivityAnalysis } from './components/analysis/DeepActivityAnalysis';
import { MachineLearningSection } from './components/ml/MachineLearningSection';
import { ReportsPage } from './components/reports/ReportsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
<<<<<<< HEAD
import { Repository, Contributor, User } from './types';
import {
  isDemoSampleAccount,
  loadUserWorkspace,
  resolveActiveRepo,
  saveUserWorkspace
} from './utils/workspaceStorage';
import { GitBranch } from 'lucide-react';
=======
import { PageTransition } from './components/animations/PageTransition';
import { Repository, Contributor } from './types';
import { MOCK_REPOSITORIES, MOCK_CONTRIBUTORS } from './data/mockRepositories';
>>>>>>> 1275c96c29fed675522a325a3651012ddbb95027

function AppContent() {
  const { isAuthenticated, user, isLoading, setAuthNotice } = useAuth();
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [activeRepo, setActiveRepo] = useState<Repository | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [workspaceReady, setWorkspaceReady] = useState(false);
  
  // Current view tabs: 'landing' | 'auth' | 'pipeline' | 'dashboard' | 'contributors' | 'analysis' | 'ml' | 'reports' | 'settings' | 'admin'
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [authSubView, setAuthSubView] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);

  useEffect(() => {
    setWorkspaceReady(false);
    const workspace = loadUserWorkspace(user);
    setRepositories(workspace.repositories);
    setContributors(workspace.contributors);
    setActiveRepo(resolveActiveRepo(workspace));
    setWorkspaceReady(true);
  }, [user?.id]);

  useEffect(() => {
    if (!user || !workspaceReady) return;
    saveUserWorkspace(user.id, {
      repositories,
      contributors,
      activeRepoId: activeRepo?.id ?? null
    });
  }, [user?.id, workspaceReady, repositories, contributors, activeRepo]);

  // Loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f8fa] flex items-center justify-center text-[#1f2328]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#167d37]/30 border-t-[#167d37] rounded-full animate-spin" />
          <span className="text-xs text-[#57606a] font-mono">Memuat portal GitContrib...</span>
        </div>
      </div>
    );
  }

  // Handle opening Auth Pages
  const handleNavigateToAuth = (view: 'login' | 'register') => {
    setAuthSubView(view);
    setCurrentTab('auth');
  };

  // If user is currently on Auth View or attempting unauthenticated access to protected feature
  if (currentTab === 'auth' || (!isAuthenticated && currentTab !== 'landing')) {
    return (
      <LoginPage
        initialView={authSubView}
        onSuccessLogin={(loggedInUser) => {
          if (loggedInUser?.role === 'admin') {
            setCurrentTab('admin');
            return;
          }
          const workspace = loadUserWorkspace(loggedInUser ?? user);
          setCurrentTab(workspace.repositories.length > 0 ? 'dashboard' : 'landing');
        }}
        onNavigateToLanding={() => setCurrentTab('landing')}
      />
    );
  }

  // Role Gatekeeper: If user is logged in as ADMIN, direct them to Admin Dashboard
  const isAdmin = isAuthenticated && user?.role === 'admin';

  // Handle Dosen starting analysis from landing page
  const handleStartAnalysis = (repoUrl: string) => {
    if (!isAuthenticated) {
      setAuthNotice({
        type: 'warning',
        code: 'logged_out',
        title: 'Pengguna Harus Login',
        message: 'Pengguna WAJIB login atau membuat akun terlebih dahulu sebelum dapat mengakses fitur utama analisis GitContrib.'
      });
      handleNavigateToAuth('login');
      return;
    }

    const cleanUrl = repoUrl.toLowerCase().trim();
    const existing = repositories.find(
      (r) => cleanUrl === r.url.toLowerCase() || (r.id.startsWith('repo-') && cleanUrl === `${r.owner}/${r.name}`.toLowerCase())
    );

    if (existing && !cleanUrl.includes('/') && existing.url.toLowerCase() === cleanUrl) {
      setActiveRepo(existing);
    } else {
      const cleanWithoutProto = repoUrl.replace(/^https?:\/\//i, '').replace(/^github\.com\//i, '').replace(/\.git$/i, '');
      const parts = cleanWithoutProto.split('/').filter(Boolean);
      const owner = parts[0] || 'custom-org';
      const name = (parts[1] || 'custom-repo').replace(/\/.*$/, '');

      const customRepo: Repository = {
        id: `repo-${owner}-${name}-${Date.now()}`,
        name: name,
        owner: owner,
        description: `GitHub repository ${owner}/${name} queued for Git history pattern analysis.`,
        visibility: 'public',
        defaultBranch: 'main',
        branches: ['main'],
        stars: 0,
        forks: 0,
        lastAnalyzed: new Date().toISOString(),
        totalCommits: 0,
        totalContributors: 0,
        activeDays: 0,
        contributionDurationDays: 0,
        linesAdded: 0,
        linesDeleted: 0,
        totalLinesChanged: 0,
        url: repoUrl.startsWith('http') ? repoUrl : `https://github.com/${owner}/${name}`,
        isLiveGitHub: true
      };

      setRepositories((prev) => [customRepo, ...prev.filter(r => r.url !== customRepo.url)]);
      setActiveRepo(customRepo);
    }

    setCurrentTab('pipeline');
  };

  const handlePipelineComplete = (analyzedRepo?: Repository, analyzedContributors?: Contributor[]) => {
    if (analyzedRepo) {
      setActiveRepo(analyzedRepo);
      setRepositories((prev) => {
        const filtered = prev.filter((r) => r.id !== analyzedRepo.id && r.url !== analyzedRepo.url);
        return [analyzedRepo, ...filtered];
      });
    }
    if (analyzedContributors && analyzedContributors.length > 0) {
      setContributors(analyzedContributors);
    }
    setCurrentTab('dashboard');
  };

  const handleSelectRepo = (repo: Repository) => {
    setActiveRepo(repo);
    if (currentTab === 'landing' || currentTab === 'pipeline') {
      setCurrentTab('dashboard');
    }
  };

  const handleNewAnalysisClick = () => {
    if (!isAuthenticated) {
      handleNavigateToAuth('login');
      return;
    }
    setCurrentTab('landing');
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1f2328] flex flex-col font-sans antialiased selection:bg-[#0969da] selection:text-white">
      {/* Show Dosen Header ONLY for Non-Admin users */}
      {!isAdmin && (
        <Header
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          activeRepo={activeRepo}
          onSelectRepo={handleSelectRepo}
          allRepos={repositories}
          onNewAnalysisClick={handleNewAnalysisClick}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {/* ADMIN DASHBOARD VIEW (Dedicated Admin Header & 8 Categories) */}
        {isAdmin ? (
          <PageTransition transitionKey="admin">
            <AdminDashboard />
          </PageTransition>
        ) : (
          <PageTransition transitionKey={currentTab}>
            {/* DOSEN & PUBLIC LANDING VIEWS */}
            {currentTab === 'landing' && (
              <LandingPage
                onStartAnalysis={handleStartAnalysis}
                presetRepos={repositories}
                onNavigateToAuth={handleNavigateToAuth}
              />
            )}

            {currentTab === 'pipeline' && activeRepo && (
              <AnalysisProgressPage
                key={activeRepo.id}
                repo={activeRepo}
                allowSyntheticData={isDemoSampleAccount(user)}
                onComplete={handlePipelineComplete}
                onBackToLanding={() => setCurrentTab('landing')}
              />
            )}

            {['dashboard', 'contributors', 'analysis', 'ml', 'reports'].includes(currentTab) &&
              !(activeRepo && contributors.length > 0) && (
              <EmptyWorkspacePrompt onAnalyze={() => setCurrentTab('landing')} />
            )}

            {currentTab === 'dashboard' && activeRepo && contributors.length > 0 && (
              <OverviewDashboard
                repo={activeRepo}
                contributors={contributors}
                onSelectContributor={(c) => setSelectedContributor(c)}
                onNavigateToML={() => setCurrentTab('ml')}
                onNavigateToContributors={() => setCurrentTab('contributors')}
              />
            )}

            {currentTab === 'contributors' && contributors.length > 0 && (
              <ContributorListView
                contributors={contributors}
                onSelectContributor={(c) => setSelectedContributor(c)}
              />
            )}

            {currentTab === 'analysis' && activeRepo && contributors.length > 0 && (
              <DeepActivityAnalysis
                repo={activeRepo}
                contributors={contributors}
                onSelectContributor={(c) => setSelectedContributor(c)}
              />
            )}

            {currentTab === 'ml' && activeRepo && contributors.length > 0 && (
              <MachineLearningSection
                repo={activeRepo}
                contributors={contributors}
                onSelectContributor={(c) => setSelectedContributor(c)}
              />
            )}

            {currentTab === 'reports' && activeRepo && contributors.length > 0 && (
              <ReportsPage
                repo={activeRepo}
                contributors={contributors}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsPage
                repo={activeRepo ?? undefined}
                onReanalyze={() => {
                  if (activeRepo) setCurrentTab('pipeline');
                  else setCurrentTab('landing');
                }}
              />
            )}
          </PageTransition>
        )}
      </main>

      {/* Contributor Detailed Modal */}
      <ContributorDetailModal
        contributor={selectedContributor}
        onClose={() => setSelectedContributor(null)}
      />

      {/* Developer Tool Footer */}
      <footer className="border-t border-[#d0d7de] bg-[#f6f8fa] py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#57606a]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1f2328]">GitContrib</span>
            <span>·</span>
            <span>Git History Contributor Pattern Analysis System</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Objective behavioral metrics</span>
            <span>·</span>
            <span>Zero-ranking architecture</span>
            <span>·</span>
            <button
              onClick={() => setCurrentTab('landing')}
              className="text-[#0969da] hover:underline cursor-pointer"
            >
              Analyze repository
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function EmptyWorkspacePrompt({ onAnalyze }: { onAnalyze: () => void }) {
  return (
    <div className="max-w-xl mx-auto py-20 px-4 text-center">
      <div className="w-12 h-12 mx-auto mb-4 rounded-md bg-[#dafbe1] text-[#1a7f37] flex items-center justify-center">
        <GitBranch className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-bold text-[#1f2328]">Belum ada data analisis</h2>
      <p className="mt-2 text-sm text-[#57606a] leading-relaxed">
        Akun ini masih kosong. Jalankan analisis repositori GitHub untuk mengisi dashboard, daftar kontributor, pola ML, dan laporan.
      </p>
      <button
        type="button"
        onClick={onAnalyze}
        className="mt-5 px-4 py-2 bg-[#1a7f37] hover:bg-[#1f883d] text-white text-sm font-semibold rounded-md cursor-pointer"
      >
        Analisis repositori
      </button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
