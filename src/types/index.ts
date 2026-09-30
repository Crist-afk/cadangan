export type Visibility = 'public' | 'private';

export interface Repository {
  id: string;
  name: string;
  owner: string;
  description: string;
  visibility: Visibility;
  defaultBranch: string;
  branches: string[];
  stars: number;
  forks: number;
  lastAnalyzed: string;
  totalCommits: number;
  totalContributors: number;
  activeDays: number;
  contributionDurationDays: number;
  linesAdded: number;
  linesDeleted: number;
  totalLinesChanged: number;
  url: string;
  isLiveGitHub?: boolean;
}

export interface CommitActivity {
  sha: string;
  message: string;
  authorName: string;
  authorLogin: string;
  date: string;
  additions: number;
  deletions: number;
  filesChanged: number;
  isMerge: boolean;
}

export type ClusterId = 'cluster-1' | 'cluster-2' | 'cluster-3' | 'cluster-4';

export interface MLCluster {
  id: ClusterId;
  name: string;
  shortTag: string;
  description: string;
  characteristics: {
    commitCadence: string;
    codeChurnProfile: string;
    fileSpread: string;
    temporalPattern: string;
    primaryRole: string;
  };
  centroid: {
    commitFrequency: number;     // commits per active week
    activeRatio: number;          // active days / total days
    churnRatio: number;           // additions / deletions
    fileSpreadIndex: number;      // distinct modules
    burstinessScore: number;      // 0 (steady) to 1 (bursty)
    maintenanceRatio: number;     // docs/tests/refactors proportion
  };
  color: string;
  accentBg: string;
  accentBorder: string;
  contributorCount: number;
}

export interface Contributor {
  id: string;
  name: string;
  login: string;
  email: string;
  avatarUrl: string;
  clusterId: ClusterId;
  commitCount: number;
  activeDays: number;
  contributionDurationDays: number;
  firstCommitDate: string;
  lastCommitDate: string;
  linesAdded: number;
  linesDeleted: number;
  totalLinesChanged: number;
  filesChanged: number;
  features: {
    commitFrequency: number;     // commits / active week
    activeSpanRatio: number;     // active days / duration
    codeChurnRatio: number;      // additions / deletions ratio
    fileSpreadIndex: number;     // 1-10 scale
    burstinessScore: number;     // 0-1 scale
    weekendActivityRatio: number;// 0-1 scale
    maintenanceRatio: number;    // 0-1 scale
  };
  recentCommits: CommitActivity[];
  weeklyActivity: { week: string; commits: number; additions: number; deletions: number }[];
  punchcard: number[][]; // 7 days (Sun-Sat) x 24 hours
  topFileTypes: { type: string; count: number; percentage: number }[];
}

export interface PipelineStage {
  id: number;
  name: string;
  detail: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  durationMs: number;
  logLines: string[];
}

export interface AnalysisReport {
  id: string;
  title: string;
  repoName: string;
  repoOwner: string;
  branch: string;
  generatedAt: string;
  datasetSummary: {
    totalCommits: number;
    totalContributors: number;
    timeframe: string;
    totalLinesChanged: number;
  };
  clusterBreakdown: {
    clusterName: string;
    count: number;
    percentage: number;
  }[];
  notes?: string;
}

export type UserRole = 'dosen' | 'admin';
export type AccountStatus = 'active' | 'disabled' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  avatarUrl?: string;
  company?: string;
  provider?: 'email' | 'github' | 'google' | 'demo';
  registeredAt?: string;
  lastLogin?: string;
}

export type AuthStateCode =
  | 'logged_out'
  | 'logged_in'
  | 'invalid_email'
  | 'incorrect_password'
  | 'account_not_found'
  | 'account_disabled'
  | 'session_expired'
  | 'email_not_verified'
  | 'password_reset_successful'
  | 'registration_successful';

export interface AuthNotice {
  type: 'error' | 'success' | 'warning' | 'info';
  code: AuthStateCode;
  title: string;
  message: string;
}
