import { Repository, MLCluster, Contributor, CommitActivity } from '../types';

export const ML_CLUSTERS: Record<string, MLCluster> = {
  'cluster-1': {
    id: 'cluster-1',
    name: 'Sustained Core Architecture Contributor',
    shortTag: 'Sustained Core',
    description: 'Displays continuous commit activity across the entire repository lifecycle with high file breadth, balanced additions/deletions, and low burstiness.',
    characteristics: {
      commitCadence: 'Evenly distributed across weekdays (average 4.8 commits/active week)',
      codeChurnProfile: 'Balanced additions vs deletions (1.2:1 churn ratio reflecting refactoring)',
      fileSpread: 'Broad impact across multiple packages, core architecture, and build systems',
      temporalPattern: 'Long duration with consistent weekly appearances (>65% active weeks)',
      primaryRole: 'Architectural foundation, continuous integration, and module maintenance'
    },
    centroid: {
      commitFrequency: 4.8,
      activeRatio: 0.68,
      churnRatio: 1.25,
      fileSpreadIndex: 8.7,
      burstinessScore: 0.22,
      maintenanceRatio: 0.44
    },
    color: '#0969da', // GitHub Blue
    accentBg: '#ddf4ff',
    accentBorder: '#54aeff',
    contributorCount: 0 // dynamically calculated
  },
  'cluster-2': {
    id: 'cluster-2',
    name: 'Sprint-Focused Feature Contributor',
    shortTag: 'Sprint Feature',
    description: 'Characterized by high additions-to-deletions ratio, concentrated commit bursts during release cycles, and focused file scope in product features.',
    characteristics: {
      commitCadence: 'Clustered in high-frequency bursts (average 8.2 commits/active week during active sprints)',
      codeChurnProfile: 'Net additions heavy (4.1:1 churn ratio introducing fresh components)',
      fileSpread: 'Localized to specific feature submodules, UI components, or domain logic',
      temporalPattern: 'Periods of intense daily commits followed by inactive intervals (burstiness >0.65)',
      primaryRole: 'Net-new feature implementation, page building, and product capabilities'
    },
    centroid: {
      commitFrequency: 8.2,
      activeRatio: 0.32,
      churnRatio: 4.10,
      fileSpreadIndex: 5.4,
      burstinessScore: 0.74,
      maintenanceRatio: 0.18
    },
    color: '#1a7f37', // GitHub Green
    accentBg: '#dafbe1',
    accentBorder: '#4ac26b',
    contributorCount: 0
  },
  'cluster-3': {
    id: 'cluster-3',
    name: 'Targeted Patch & Maintenance Contributor',
    shortTag: 'Maintenance & Patch',
    description: 'Shows targeted commits addressing specific bugfixes, dependency upgrades, unit test expansion, and refactoring with negative or neutral net lines.',
    characteristics: {
      commitCadence: 'Paced commits tied to issues, PR reviews, or regression investigations (2.3 commits/active week)',
      codeChurnProfile: 'High deletions-to-additions ratio (0.8:1 churn ratio removing dead code or optimizing lines)',
      fileSpread: 'Cross-cutting touches on test files, utilities, and configuration manifests',
      temporalPattern: 'Steady recurring touchpoints triggered by release stabilization phases',
      primaryRole: 'Defect resolution, test coverage hardening, and code cleanup'
    },
    centroid: {
      commitFrequency: 2.3,
      activeRatio: 0.41,
      churnRatio: 0.85,
      fileSpreadIndex: 6.2,
      burstinessScore: 0.38,
      maintenanceRatio: 0.68
    },
    color: '#8250df', // GitHub Purple
    accentBg: '#fbefff',
    accentBorder: '#c297ff',
    contributorCount: 0
  },
  'cluster-4': {
    id: 'cluster-4',
    name: 'Periodic Documentation & Peripheral Contributor',
    shortTag: 'Docs & Peripheral',
    description: 'Demonstrates low-frequency, discrete commits focused on markdown documentation, translation, asset updates, or isolated minor corrections.',
    characteristics: {
      commitCadence: 'Occasional commits with intervals of several weeks (1.1 commits/active week)',
      codeChurnProfile: 'Low overall line churn, primarily documentation and static assets',
      fileSpread: 'Restricted to documentation directories, README, config, or single leaf files',
      temporalPattern: 'Low overall active day span (<15% total repo duration)',
      primaryRole: 'Documentation enhancement, typo remediation, and configuration sync'
    },
    centroid: {
      commitFrequency: 1.1,
      activeRatio: 0.12,
      churnRatio: 2.20,
      fileSpreadIndex: 2.1,
      burstinessScore: 0.45,
      maintenanceRatio: 0.82
    },
    color: '#9a6700', // GitHub Gold/Bronze
    accentBg: '#fff8c5',
    accentBorder: '#eac54f',
    contributorCount: 0
  }
};

export const MOCK_REPOSITORIES: Repository[] = [
  {
    id: 'repo-1',
    name: 'gitcontrib-core',
    owner: 'gitcontrib-lab',
    description: 'High-throughput Git history extraction engine & contribution pattern analyzer using machine learning clustering.',
    visibility: 'public',
    defaultBranch: 'main',
    branches: ['main', 'develop', 'feat/v2-clustering', 'fix/git-diff-parser'],
    stars: 342,
    forks: 58,
    lastAnalyzed: '2026-09-24T06:30:00Z',
    totalCommits: 1420,
    totalContributors: 14,
    activeDays: 218,
    contributionDurationDays: 365,
    linesAdded: 184520,
    linesDeleted: 62410,
    totalLinesChanged: 246930,
    url: 'https://github.com/gitcontrib-lab/gitcontrib-core'
  },
  {
    id: 'repo-2',
    name: 'smart-iot-telemetry',
    owner: 'telkom-lab',
    description: 'Distributed MQTT telemetry aggregator and time-series analysis service for environmental sensor networks.',
    visibility: 'public',
    defaultBranch: 'main',
    branches: ['main', 'staging', 'sensor-firmware-v3'],
    stars: 89,
    forks: 24,
    lastAnalyzed: '2026-09-22T14:15:00Z',
    totalCommits: 648,
    totalContributors: 8,
    activeDays: 142,
    contributionDurationDays: 240,
    linesAdded: 92400,
    linesDeleted: 28150,
    totalLinesChanged: 120550,
    url: 'https://github.com/telkom-lab/smart-iot-telemetry'
  },
  {
    id: 'repo-3',
    name: 'react-query-state',
    owner: 'frontend-collective',
    description: 'Zero-overhead atomic state container with optimistic updates and Git-like undo history tree.',
    visibility: 'public',
    defaultBranch: 'main',
    branches: ['main', 'next', 'v3-alpha'],
    stars: 1240,
    forks: 182,
    lastAnalyzed: '2026-09-20T11:00:00Z',
    totalCommits: 2890,
    totalContributors: 22,
    activeDays: 310,
    contributionDurationDays: 520,
    linesAdded: 345000,
    linesDeleted: 142000,
    totalLinesChanged: 487000,
    url: 'https://github.com/frontend-collective/react-query-state'
  }
];

export const MOCK_CONTRIBUTORS: Contributor[] = [
  {
    id: 'contrib-1',
    name: 'Budi Pratama',
    login: 'budipratama',
    email: 'budi.pratama@gitcontrib.io',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=budipratama',
    clusterId: 'cluster-1',
    commitCount: 384,
    activeDays: 168,
    contributionDurationDays: 360,
    firstCommitDate: '2025-10-02',
    lastCommitDate: '2026-09-23',
    linesAdded: 48200,
    linesDeleted: 29400,
    totalLinesChanged: 77600,
    filesChanged: 142,
    features: {
      commitFrequency: 5.1,
      activeSpanRatio: 0.72,
      codeChurnRatio: 1.64,
      fileSpreadIndex: 9.1,
      burstinessScore: 0.18,
      weekendActivityRatio: 0.12,
      maintenanceRatio: 0.48
    },
    topFileTypes: [
      { type: 'TypeScript (.ts/.tsx)', count: 210, percentage: 55 },
      { type: 'Go Core (.go)', count: 110, percentage: 29 },
      { type: 'Config & CI (.yml/.json)', count: 42, percentage: 11 },
      { type: 'Docs (.md)', count: 22, percentage: 5 }
    ],
    recentCommits: [
      {
        sha: '7f9a2b1',
        message: 'refactor(engine): optimize commit graph topological traversal',
        authorName: 'Budi Pratama',
        authorLogin: 'budipratama',
        date: '2026-09-23 16:42',
        additions: 142,
        deletions: 98,
        filesChanged: 4,
        isMerge: false
      },
      {
        sha: '3c1d8e4',
        message: 'perf(parser): reduce memory allocation during chunked git blame streaming',
        authorName: 'Budi Pratama',
        authorLogin: 'budipratama',
        date: '2026-09-21 11:20',
        additions: 86,
        deletions: 112,
        filesChanged: 3,
        isMerge: false
      },
      {
        sha: '9a0f5d2',
        message: 'feat(core): implement incremental caching layer for git packfile reads',
        authorName: 'Budi Pratama',
        authorLogin: 'budipratama',
        date: '2026-09-18 14:05',
        additions: 310,
        deletions: 45,
        filesChanged: 6,
        isMerge: false
      }
    ],
    weeklyActivity: [
      { week: 'W-1', commits: 9, additions: 640, deletions: 320 },
      { week: 'W-2', commits: 11, additions: 920, deletions: 410 },
      { week: 'W-3', commits: 8, additions: 530, deletions: 290 },
      { week: 'W-4', commits: 12, additions: 1100, deletions: 480 },
      { week: 'W-5', commits: 7, additions: 420, deletions: 190 },
      { week: 'W-6', commits: 10, additions: 810, deletions: 350 },
      { week: 'W-7', commits: 14, additions: 1250, deletions: 600 },
      { week: 'W-8', commits: 9, additions: 740, deletions: 310 }
    ],
    punchcard: [
      [0, 0, 0, 0, 0, 0, 1, 2, 4, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Sun
      [0, 0, 0, 0, 0, 0, 0, 3, 8, 12, 14, 9, 6, 8, 11, 14, 10, 5, 2, 0, 0, 0, 0, 0], // Mon
      [0, 0, 0, 0, 0, 0, 0, 2, 9, 15, 12, 8, 5, 9, 13, 12, 8, 4, 1, 0, 0, 0, 0, 0], // Tue
      [0, 0, 0, 0, 0, 0, 0, 4, 11, 16, 15, 11, 7, 10, 15, 14, 9, 3, 0, 0, 0, 0, 0, 0], // Wed
      [0, 0, 0, 0, 0, 0, 0, 2, 7, 13, 11, 7, 6, 8, 12, 11, 7, 2, 0, 0, 0, 0, 0, 0], // Thu
      [0, 0, 0, 0, 0, 0, 0, 3, 6, 10, 8, 6, 4, 7, 9, 8, 4, 1, 0, 0, 0, 0, 0, 0], // Fri
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0] // Sat
    ]
  },
  {
    id: 'contrib-2',
    name: 'Siti Rahmawati',
    login: 'sitirahma',
    email: 'siti.rahma@gitcontrib.io',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=sitirahma',
    clusterId: 'cluster-2',
    commitCount: 295,
    activeDays: 82,
    contributionDurationDays: 310,
    firstCommitDate: '2025-11-15',
    lastCommitDate: '2026-09-22',
    linesAdded: 52100,
    linesDeleted: 11800,
    totalLinesChanged: 63900,
    filesChanged: 98,
    features: {
      commitFrequency: 8.4,
      activeSpanRatio: 0.36,
      codeChurnRatio: 4.41,
      fileSpreadIndex: 5.8,
      burstinessScore: 0.72,
      weekendActivityRatio: 0.28,
      maintenanceRatio: 0.16
    },
    topFileTypes: [
      { type: 'React UI (.tsx)', count: 182, percentage: 62 },
      { type: 'Styles (.css)', count: 64, percentage: 22 },
      { type: 'Types (.ts)', count: 35, percentage: 12 },
      { type: 'Tests (.test.ts)', count: 14, percentage: 4 }
    ],
    recentCommits: [
      {
        sha: '4b7e912',
        message: 'feat(views): add interactive commit punchcard heatmap view',
        authorName: 'Siti Rahmawati',
        authorLogin: 'sitirahma',
        date: '2026-09-22 18:30',
        additions: 380,
        deletions: 22,
        filesChanged: 5,
        isMerge: false
      },
      {
        sha: '8c2f109',
        message: 'feat(filter): support multi-branch diff selection and date slider',
        authorName: 'Siti Rahmawati',
        authorLogin: 'sitirahma',
        date: '2026-09-20 20:15',
        additions: 490,
        deletions: 48,
        filesChanged: 7,
        isMerge: false
      },
      {
        sha: '1e5a730',
        message: 'feat(dashboard): design contributor metric summary cards',
        authorName: 'Siti Rahmawati',
        authorLogin: 'sitirahma',
        date: '2026-09-17 22:10',
        additions: 620,
        deletions: 35,
        filesChanged: 8,
        isMerge: false
      }
    ],
    weeklyActivity: [
      { week: 'W-1', commits: 16, additions: 1800, deletions: 120 },
      { week: 'W-2', commits: 22, additions: 2400, deletions: 210 },
      { week: 'W-3', commits: 4, additions: 320, deletions: 40 },
      { week: 'W-4', commits: 0, additions: 0, deletions: 0 },
      { week: 'W-5', commits: 18, additions: 1950, deletions: 180 },
      { week: 'W-6', commits: 24, additions: 2800, deletions: 310 },
      { week: 'W-7', commits: 5, additions: 450, deletions: 60 },
      { week: 'W-8', commits: 2, additions: 180, deletions: 25 }
    ],
    punchcard: [
      [0, 0, 0, 0, 0, 0, 0, 1, 3, 5, 4, 3, 2, 2, 4, 6, 8, 7, 5, 3, 1, 0, 0, 0], // Sun
      [0, 0, 0, 0, 0, 0, 0, 1, 4, 8, 9, 7, 4, 5, 8, 12, 14, 12, 8, 5, 2, 0, 0, 0], // Mon
      [0, 0, 0, 0, 0, 0, 0, 0, 3, 7, 8, 6, 3, 4, 7, 11, 13, 10, 7, 4, 1, 0, 0, 0], // Tue
      [0, 0, 0, 0, 0, 0, 0, 2, 5, 10, 11, 8, 5, 6, 10, 14, 16, 14, 9, 6, 2, 0, 0, 0], // Wed
      [0, 0, 0, 0, 0, 0, 0, 1, 4, 8, 7, 5, 3, 4, 6, 10, 12, 10, 6, 3, 1, 0, 0, 0], // Thu
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 5, 6, 4, 2, 3, 5, 8, 9, 8, 5, 2, 0, 0, 0, 0], // Fri
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 4, 3, 2, 2, 3, 5, 7, 6, 4, 2, 1, 0, 0, 0] // Sat
    ]
  },
  {
    id: 'contrib-3',
    name: 'David Chen',
    login: 'davidchen-dev',
    email: 'david.chen@gitcontrib.io',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=davidchen',
    clusterId: 'cluster-3',
    commitCount: 218,
    activeDays: 98,
    contributionDurationDays: 340,
    firstCommitDate: '2025-10-18',
    lastCommitDate: '2026-09-21',
    linesAdded: 16800,
    linesDeleted: 19400,
    totalLinesChanged: 36200,
    filesChanged: 114,
    features: {
      commitFrequency: 2.8,
      activeSpanRatio: 0.44,
      codeChurnRatio: 0.86,
      fileSpreadIndex: 6.9,
      burstinessScore: 0.34,
      weekendActivityRatio: 0.08,
      maintenanceRatio: 0.74
    },
    topFileTypes: [
      { type: 'Tests (.test.ts)', count: 104, percentage: 48 },
      { type: 'TypeScript Core (.ts)', count: 68, percentage: 31 },
      { type: 'Config (.json/.yml)', count: 32, percentage: 15 },
      { type: 'Docs (.md)', count: 14, percentage: 6 }
    ],
    recentCommits: [
      {
        sha: '2d8a11e',
        message: 'test(clustering): add deterministic unit tests for k-means centroid updates',
        authorName: 'David Chen',
        authorLogin: 'davidchen-dev',
        date: '2026-09-21 09:40',
        additions: 120,
        deletions: 40,
        filesChanged: 3,
        isMerge: false
      },
      {
        sha: '6a4b22c',
        message: 'fix(git-history): resolve off-by-one index in commit window aggregation',
        authorName: 'David Chen',
        authorLogin: 'davidchen-dev',
        date: '2026-09-16 15:12',
        additions: 18,
        deletions: 24,
        filesChanged: 2,
        isMerge: false
      },
      {
        sha: '9e7f33d',
        message: 'refactor(deps): clean unused imports and bump peer dependencies',
        authorName: 'David Chen',
        authorLogin: 'davidchen-dev',
        date: '2026-09-12 14:05',
        additions: 45,
        deletions: 180,
        filesChanged: 12,
        isMerge: false
      }
    ],
    weeklyActivity: [
      { week: 'W-1', commits: 5, additions: 220, deletions: 310 },
      { week: 'W-2', commits: 7, additions: 340, deletions: 420 },
      { week: 'W-3', commits: 6, additions: 290, deletions: 380 },
      { week: 'W-4', commits: 8, additions: 410, deletions: 510 },
      { week: 'W-5', commits: 5, additions: 260, deletions: 290 },
      { week: 'W-6', commits: 6, additions: 310, deletions: 340 },
      { week: 'W-7', commits: 7, additions: 380, deletions: 460 },
      { week: 'W-8', commits: 4, additions: 190, deletions: 250 }
    ],
    punchcard: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Sun
      [0, 0, 0, 0, 0, 0, 0, 2, 7, 9, 8, 6, 4, 6, 8, 9, 6, 3, 1, 0, 0, 0, 0, 0], // Mon
      [0, 0, 0, 0, 0, 0, 0, 3, 8, 10, 9, 7, 5, 7, 9, 10, 7, 4, 1, 0, 0, 0, 0, 0], // Tue
      [0, 0, 0, 0, 0, 0, 0, 2, 7, 9, 8, 6, 4, 6, 8, 9, 6, 3, 1, 0, 0, 0, 0, 0], // Wed
      [0, 0, 0, 0, 0, 0, 0, 2, 6, 8, 7, 5, 3, 5, 7, 8, 5, 2, 0, 0, 0, 0, 0, 0], // Thu
      [0, 0, 0, 0, 0, 0, 0, 1, 5, 7, 6, 4, 3, 4, 6, 7, 4, 2, 0, 0, 0, 0, 0, 0], // Fri
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // Sat
    ]
  },
  {
    id: 'contrib-4',
    name: 'Maya Kusuma',
    login: 'mayakusuma',
    email: 'maya.kusuma@gitcontrib.io',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=mayakusuma',
    clusterId: 'cluster-4',
    commitCount: 64,
    activeDays: 24,
    contributionDurationDays: 280,
    firstCommitDate: '2025-12-05',
    lastCommitDate: '2026-09-10',
    linesAdded: 8400,
    linesDeleted: 2100,
    totalLinesChanged: 10500,
    filesChanged: 36,
    features: {
      commitFrequency: 1.2,
      activeSpanRatio: 0.14,
      codeChurnRatio: 4.0,
      fileSpreadIndex: 2.3,
      burstinessScore: 0.42,
      weekendActivityRatio: 0.15,
      maintenanceRatio: 0.88
    },
    topFileTypes: [
      { type: 'Documentation (.md)', count: 48, percentage: 75 },
      { type: 'Localization (.json)', count: 12, percentage: 19 },
      { type: 'Examples (.ts)', count: 4, percentage: 6 }
    ],
    recentCommits: [
      {
        sha: '1a3d90f',
        message: 'docs(api): document machine learning feature engineering formulas',
        authorName: 'Maya Kusuma',
        authorLogin: 'mayakusuma',
        date: '2026-09-10 14:22',
        additions: 140,
        deletions: 12,
        filesChanged: 2,
        isMerge: false
      },
      {
        sha: '5c8b74e',
        message: 'docs(readme): add installation guide and architectural sequence diagram',
        authorName: 'Maya Kusuma',
        authorLogin: 'mayakusuma',
        date: '2026-08-28 16:50',
        additions: 95,
        deletions: 15,
        filesChanged: 1,
        isMerge: false
      }
    ],
    weeklyActivity: [
      { week: 'W-1', commits: 0, additions: 0, deletions: 0 },
      { week: 'W-2', commits: 3, additions: 240, deletions: 30 },
      { week: 'W-3', commits: 0, additions: 0, deletions: 0 },
      { week: 'W-4', commits: 2, additions: 180, deletions: 20 },
      { week: 'W-5', commits: 0, additions: 0, deletions: 0 },
      { week: 'W-6', commits: 4, additions: 350, deletions: 45 },
      { week: 'W-7', commits: 0, additions: 0, deletions: 0 },
      { week: 'W-8', commits: 1, additions: 90, deletions: 10 }
    ],
    punchcard: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 2, 1, 1, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 2, 1, 2, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  {
    id: 'contrib-5',
    name: 'Ahmad Fauzi',
    login: 'ahmadfauzi',
    email: 'ahmad.fauzi@gitcontrib.io',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=ahmadfauzi',
    clusterId: 'cluster-1',
    commitCount: 224,
    activeDays: 132,
    contributionDurationDays: 350,
    firstCommitDate: '2025-10-10',
    lastCommitDate: '2026-09-19',
    linesAdded: 28400,
    linesDeleted: 14200,
    totalLinesChanged: 42600,
    filesChanged: 89,
    features: {
      commitFrequency: 4.6,
      activeSpanRatio: 0.62,
      codeChurnRatio: 2.0,
      fileSpreadIndex: 8.2,
      burstinessScore: 0.24,
      weekendActivityRatio: 0.10,
      maintenanceRatio: 0.38
    },
    topFileTypes: [
      { type: 'Go Core (.go)', count: 120, percentage: 54 },
      { type: 'TypeScript (.ts)', count: 70, percentage: 31 },
      { type: 'Docker / CI', count: 34, percentage: 15 }
    ],
    recentCommits: [
      {
        sha: '9c4d211',
        message: 'ci: add matrix pipeline for node 20 and node 22 compatibility tests',
        authorName: 'Ahmad Fauzi',
        authorLogin: 'ahmadfauzi',
        date: '2026-09-19 11:15',
        additions: 64,
        deletions: 18,
        filesChanged: 3,
        isMerge: false
      }
    ],
    weeklyActivity: [
      { week: 'W-1', commits: 6, additions: 520, deletions: 280 },
      { week: 'W-2', commits: 8, additions: 680, deletions: 310 },
      { week: 'W-3', commits: 5, additions: 440, deletions: 210 },
      { week: 'W-4', commits: 7, additions: 590, deletions: 270 },
      { week: 'W-5', commits: 6, additions: 510, deletions: 230 },
      { week: 'W-6', commits: 7, additions: 600, deletions: 260 },
      { week: 'W-7', commits: 8, additions: 710, deletions: 320 },
      { week: 'W-8', commits: 5, additions: 420, deletions: 190 }
    ],
    punchcard: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 5, 8, 9, 7, 5, 6, 8, 9, 7, 4, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 2, 6, 9, 10, 8, 5, 7, 9, 10, 7, 3, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 5, 8, 8, 6, 4, 6, 8, 8, 6, 2, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 2, 6, 8, 7, 5, 4, 5, 7, 8, 5, 2, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 4, 6, 5, 4, 3, 4, 5, 6, 4, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  },
  {
    id: 'contrib-6',
    name: 'Elena Rostova',
    login: 'erostova',
    email: 'elena.rostova@gitcontrib.io',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=erostova',
    clusterId: 'cluster-2',
    commitCount: 168,
    activeDays: 54,
    contributionDurationDays: 240,
    firstCommitDate: '2026-01-10',
    lastCommitDate: '2026-09-18',
    linesAdded: 36400,
    linesDeleted: 8200,
    totalLinesChanged: 44600,
    filesChanged: 64,
    features: {
      commitFrequency: 7.8,
      activeSpanRatio: 0.31,
      codeChurnRatio: 4.43,
      fileSpreadIndex: 5.1,
      burstinessScore: 0.76,
      weekendActivityRatio: 0.32,
      maintenanceRatio: 0.14
    },
    topFileTypes: [
      { type: 'React UI (.tsx)', count: 110, percentage: 65 },
      { type: 'Data Visuals (.svg/.ts)', count: 42, percentage: 25 },
      { type: 'Styles (.css)', count: 16, percentage: 10 }
    ],
    recentCommits: [
      {
        sha: '3f8e12d',
        message: 'feat(export): integrate structured JSON and CSV report generation serializers',
        authorName: 'Elena Rostova',
        authorLogin: 'erostova',
        date: '2026-09-18 19:40',
        additions: 410,
        deletions: 34,
        filesChanged: 4,
        isMerge: false
      }
    ],
    weeklyActivity: [
      { week: 'W-1', commits: 14, additions: 1450, deletions: 110 },
      { week: 'W-2', commits: 18, additions: 1920, deletions: 160 },
      { week: 'W-3', commits: 2, additions: 140, deletions: 20 },
      { week: 'W-4', commits: 0, additions: 0, deletions: 0 },
      { week: 'W-5', commits: 15, additions: 1680, deletions: 140 },
      { week: 'W-6', commits: 19, additions: 2100, deletions: 200 },
      { week: 'W-7', commits: 3, additions: 210, deletions: 30 },
      { week: 'W-8', commits: 1, additions: 90, deletions: 10 }
    ],
    punchcard: [
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 3, 2, 2, 3, 5, 7, 8, 6, 4, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 3, 6, 7, 5, 4, 5, 7, 10, 11, 9, 6, 3, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 5, 6, 4, 3, 4, 6, 9, 10, 8, 5, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 4, 7, 8, 6, 4, 5, 8, 11, 12, 10, 7, 4, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 6, 4, 2, 3, 5, 7, 8, 7, 4, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 4, 3, 2, 2, 4, 6, 7, 5, 3, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 2, 1, 2, 3, 5, 6, 5, 3, 1, 0, 0, 0, 0]
    ]
  },
  {
    id: 'contrib-7',
    name: 'Rian Hidayat',
    login: 'rianhidayat',
    email: 'rian.hidayat@gitcontrib.io',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=rianhidayat',
    clusterId: 'cluster-3',
    commitCount: 67,
    activeDays: 38,
    contributionDurationDays: 290,
    firstCommitDate: '2025-11-20',
    lastCommitDate: '2026-09-14',
    linesAdded: 4800,
    linesDeleted: 6100,
    totalLinesChanged: 10900,
    filesChanged: 42,
    features: {
      commitFrequency: 2.1,
      activeSpanRatio: 0.38,
      codeChurnRatio: 0.78,
      fileSpreadIndex: 5.6,
      burstinessScore: 0.36,
      weekendActivityRatio: 0.05,
      maintenanceRatio: 0.72
    },
    topFileTypes: [
      { type: 'Tests (.spec.ts)', count: 35, percentage: 52 },
      { type: 'Types & Utils (.ts)', count: 24, percentage: 36 },
      { type: 'Config (.json)', count: 8, percentage: 12 }
    ],
    recentCommits: [
      {
        sha: '4d1f89c',
        message: 'fix(parser): prevent null reference exception on uncommitted git index headers',
        authorName: 'Rian Hidayat',
        authorLogin: 'rianhidayat',
        date: '2026-09-14 10:20',
        additions: 14,
        deletions: 22,
        filesChanged: 2,
        isMerge: false
      }
    ],
    weeklyActivity: [
      { week: 'W-1', commits: 2, additions: 90, deletions: 120 },
      { week: 'W-2', commits: 3, additions: 140, deletions: 190 },
      { week: 'W-3', commits: 2, additions: 80, deletions: 110 },
      { week: 'W-4', commits: 3, additions: 160, deletions: 210 },
      { week: 'W-5', commits: 2, additions: 110, deletions: 140 },
      { week: 'W-6', commits: 2, additions: 95, deletions: 130 },
      { week: 'W-7', commits: 3, additions: 150, deletions: 200 },
      { week: 'W-8', commits: 1, additions: 60, deletions: 80 }
    ],
    punchcard: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 3, 2, 2, 3, 4, 4, 3, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 3, 2, 2, 3, 4, 4, 3, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 3, 2, 2, 3, 4, 4, 3, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 2, 1, 1, 2, 3, 3, 2, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
  }
];

// Helper to calculate cluster counts
export function getClustersWithCounts(contributors: Contributor[]): MLCluster[] {
  const counts: Record<string, number> = {
    'cluster-1': 0,
    'cluster-2': 0,
    'cluster-3': 0,
    'cluster-4': 0,
  };

  contributors.forEach(c => {
    if (counts[c.clusterId] !== undefined) {
      counts[c.clusterId]++;
    }
  });

  return Object.values(ML_CLUSTERS).map(cl => ({
    ...cl,
    contributorCount: counts[cl.id] || 0
  }));
}
