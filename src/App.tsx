import React, { useState } from 'react';
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
import { Repository, Contributor } from './types';
import { MOCK_REPOSITORIES, MOCK_CONTRIBUTORS } from './data/mockRepositories';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [repositories, setRepositories] = useState<Repository[]>(MOCK_REPOSITORIES);
  const [activeRepo, setActiveRepo] = useState<Repository | null>(MOCK_REPOSITORIES[0]);
  const [contributors, setContributors] = useState<Contributor[]>(MOCK_CONTRIBUTORS);
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [selectedContributor, setSelectedContributor] = useState<Contributor | null>(null);

  // If loading auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#238636]/30 border-t-[#3fb950] rounded-full animate-spin" />
          <span className="text-xs text-[#8b949e] font-mono">Memuat portal GitContrib...</span>
        </div>
      </div>
    );
  }

  // Gatekeeper: Require login before entering the web application
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Handle user starting analysis from landing page
  const handleStartAnalysis = (repoUrl: string) => {
    const cleanUrl = repoUrl.toLowerCase().trim();
    // Check if matching an existing mock repo exactly
    const existing = repositories.find(
      (r) => cleanUrl === r.url.toLowerCase() || (r.id.startsWith('repo-') && cleanUrl === `${r.owner}/${r.name}`.toLowerCase())
    );

    if (existing && !cleanUrl.includes('/') && existing.url.toLowerCase() === cleanUrl) {
      setActiveRepo(existing);
    } else {
      // Parse repository URL or owner/name
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
    setCurrentTab('landing');
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1f2328] flex flex-col font-sans antialiased">
      {/* GitHub-Inspired Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        activeRepo={activeRepo}
        onSelectRepo={handleSelectRepo}
        allRepos={repositories}
        onNewAnalysisClick={handleNewAnalysisClick}
      />

      {/* Main View Port */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onStartAnalysis={handleStartAnalysis}
            presetRepos={repositories}
          />
        )}

        {currentTab === 'pipeline' && activeRepo && (
          <AnalysisProgressPage
            key={activeRepo.id}
            repo={activeRepo}
            onComplete={handlePipelineComplete}
            onBackToLanding={() => setCurrentTab('landing')}
          />
        )}

        {currentTab === 'dashboard' && activeRepo && (
          <OverviewDashboard
            repo={activeRepo}
            contributors={contributors}
            onSelectContributor={(c) => setSelectedContributor(c)}
            onNavigateToML={() => setCurrentTab('ml')}
            onNavigateToContributors={() => setCurrentTab('contributors')}
          />
        )}

        {currentTab === 'contributors' && (
          <ContributorListView
            contributors={contributors}
            onSelectContributor={(c) => setSelectedContributor(c)}
          />
        )}

        {currentTab === 'analysis' && activeRepo && (
          <DeepActivityAnalysis
            repo={activeRepo}
            contributors={contributors}
            onSelectContributor={(c) => setSelectedContributor(c)}
          />
        )}

        {currentTab === 'ml' && activeRepo && (
          <MachineLearningSection
            repo={activeRepo}
            contributors={contributors}
            onSelectContributor={(c) => setSelectedContributor(c)}
          />
        )}

        {currentTab === 'reports' && activeRepo && (
          <ReportsPage
            repo={activeRepo}
            contributors={contributors}
          />
        )}

        {currentTab === 'settings' && activeRepo && (
          <SettingsPage
            repo={activeRepo}
            onReanalyze={() => setCurrentTab('pipeline')}
          />
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
              Analyze new repository
            </button>
          </div>
        </div>
      </footer>
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
