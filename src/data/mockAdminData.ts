import { User, UserRole, AccountStatus } from '../types';

export interface GitHubApiConfig {
  status: 'connected' | 'disconnected' | 'rate_limited';
  rateLimitUsed: number;
  rateLimitTotal: number;
  resetTime: string;
  configuredTokenMasked: string;
  failedRequestsCount: number;
  requestLogs: {
    id: string;
    endpoint: string;
    method: 'GET' | 'POST';
    statusCode: number;
    responseTimeMs: number;
    timestamp: string;
  }[];
}

export interface AIModelConfig {
  activeModelId: string;
  modelName: string;
  version: string;
  algorithm: string;
  clustersCount: number;
  datasetSize: number;
  trainingDate: string;
  parameters: {
    maxIterations: number;
    tolerance: number;
    initMethod: string;
    randomState: number;
  };
  evaluationResult: {
    silhouetteScore: number;
    inertia: number;
    daviesBouldinIndex: number;
    calinskiHarabaszScore: number;
  };
  history: {
    version: string;
    date: string;
    silhouetteScore: number;
    status: 'active' | 'archived' | 'deprecated';
  }[];
}

export interface MonitoringAnalysisItem {
  id: string;
  repoUrl: string;
  repoName: string;
  owner: string;
  userEmail: string;
  userName: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progressPercentage: number;
  currentProcess: string;
  currentStepIndex: number;
  startTime: string;
  durationMs: number;
}

export interface ErrorLogItem {
  id: string;
  category: 'GitHub API Error' | 'Repository Access Error' | 'Invalid Repository URL' | 'Database Error' | 'AI/ML Error' | 'Processing Error' | 'Authentication Error';
  repository: string;
  process: string;
  timestamp: string;
  status: 'unresolved' | 'investigating' | 'resolved';
  errorDetail: string;
}

export interface AuditLogItem {
  id: string;
  userEmail: string;
  userName: string;
  role: UserRole;
  activity: string;
  target: string;
  timestamp: string;
  ipAddress: string;
}

export interface SystemConfig {
  general: {
    appName: string;
    environment: string;
    dataRetentionDays: number;
    allowSelfRegistration: boolean;
  };
  analysis: {
    maxRepositorySizeMB: number;
    analysisTimeoutSeconds: number;
    maxConcurrentAnalyses: number;
    cacheDurationHours: number;
  };
  ai: {
    activeModelVersion: string;
    minContributorsForML: number;
    autoRetrainOnNewData: boolean;
  };
  system: {
    maintenanceMode: boolean;
    debugLogging: boolean;
  };
}

export const MOCK_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Prof. Dr. Ir. Admin System',
    email: 'admin@gitcontrib.ac.id',
    role: 'admin',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
    company: 'Universitas Teknologi / GitContrib Admin',
    provider: 'email',
    registeredAt: '2025-01-10T08:00:00Z',
    lastLogin: '2026-10-01T00:15:00Z'
  },
  {
    id: 'usr-dosen-1',
    name: 'Dr. Hendra Wijaya, M.T.',
    email: 'dosen@gitcontrib.ac.id',
    role: 'dosen',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&auto=format&fit=crop&q=80',
    company: 'Departemen Teknik Informatika',
    provider: 'email',
    registeredAt: '2025-02-15T09:30:00Z',
    lastLogin: '2026-09-30T18:45:00Z'
  },
  {
    id: 'usr-dosen-2',
    name: 'Siti Rahmawati, S.Kom., M.Cs.',
    email: 'siti.rahma@university.ac.id',
    role: 'dosen',
    status: 'active',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
    company: 'Fakultas Ilmu Komputer',
    provider: 'email',
    registeredAt: '2025-03-01T11:20:00Z',
    lastLogin: '2026-09-29T14:10:00Z'
  },
  {
    id: 'usr-dosen-3',
    name: 'Budi Pratama, M.Sc.',
    email: 'budi.pratama@univ-tech.id',
    role: 'dosen',
    status: 'pending',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=budi.pratama',
    company: 'Lab Rekayasa Perangkat Lunak',
    provider: 'email',
    registeredAt: '2026-09-28T16:00:00Z',
    lastLogin: '2026-09-28T16:05:00Z'
  },
  {
    id: 'usr-dosen-4',
    name: 'Ir. Ahmad Zaelani, M.Eng.',
    email: 'ahmad.zaelani@inst-tech.ac.id',
    role: 'dosen',
    status: 'disabled',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=ahmad.z',
    company: 'Prodi Sistem Informasi',
    provider: 'email',
    registeredAt: '2025-05-12T10:00:00Z',
    lastLogin: '2026-08-10T11:20:00Z'
  }
];

export const MOCK_GITHUB_API_CONFIG: GitHubApiConfig = {
  status: 'connected',
  rateLimitUsed: 750,
  rateLimitTotal: 5000,
  resetTime: '2026-10-01T01:00:00Z',
  configuredTokenMasked: 'ghp_••••••••••••91A2',
  failedRequestsCount: 3,
  requestLogs: [
    { id: 'req-101', endpoint: '/repos/vitejs/vite/commits', method: 'GET', statusCode: 200, responseTimeMs: 142, timestamp: '2026-09-30T23:55:12Z' },
    { id: 'req-102', endpoint: '/repos/vitejs/vite/contributors', method: 'GET', statusCode: 200, responseTimeMs: 185, timestamp: '2026-09-30T23:55:14Z' },
    { id: 'req-103', endpoint: '/repos/expressjs/express/stats/commit_activity', method: 'GET', statusCode: 200, responseTimeMs: 210, timestamp: '2026-09-30T23:40:08Z' },
    { id: 'req-104', endpoint: '/repos/private-org/restricted-repo/commits', method: 'GET', statusCode: 404, responseTimeMs: 88, timestamp: '2026-09-30T22:15:30Z' },
    { id: 'req-105', endpoint: '/repos/gitcontrib-lab/gitcontrib-core/commits', method: 'GET', statusCode: 200, responseTimeMs: 120, timestamp: '2026-09-30T21:05:00Z' }
  ]
};

export const MOCK_AI_MODEL_CONFIG: AIModelConfig = {
  activeModelId: 'mdl-kmeans-v2.1',
  modelName: 'GitContrib Unsupervised K-Means Archetype Profiler',
  version: 'v2.1.0-stable',
  algorithm: 'K-Means Clustering with Min-Max Feature Scaling',
  clustersCount: 4,
  datasetSize: 18400,
  trainingDate: '2026-09-15T14:00:00Z',
  parameters: {
    maxIterations: 300,
    tolerance: 0.0001,
    initMethod: 'k-means++',
    randomState: 42
  },
  evaluationResult: {
    silhouetteScore: 0.742,
    inertia: 18.45,
    daviesBouldinIndex: 0.412,
    calinskiHarabaszScore: 1420.8
  },
  history: [
    { version: 'v2.1.0-stable', date: '2026-09-15', silhouetteScore: 0.742, status: 'active' },
    { version: 'v2.0.4-rc1', date: '2026-08-01', silhouetteScore: 0.718, status: 'archived' },
    { version: 'v1.8.0', date: '2026-05-20', silhouetteScore: 0.685, status: 'deprecated' }
  ]
};

export const MOCK_MONITORING_ANALYSES: MonitoringAnalysisItem[] = [
  {
    id: 'ans-8821',
    repoUrl: 'https://github.com/vitejs/vite',
    repoName: 'vite',
    owner: 'vitejs',
    userEmail: 'dosen@gitcontrib.ac.id',
    userName: 'Dr. Hendra Wijaya, M.T.',
    status: 'processing',
    progressPercentage: 72,
    currentProcess: 'Running Machine Learning Clustering Algorithm',
    currentStepIndex: 6,
    startTime: '2026-10-01T00:14:10Z',
    durationMs: 14200
  },
  {
    id: 'ans-8820',
    repoUrl: 'https://github.com/expressjs/express',
    repoName: 'express',
    owner: 'expressjs',
    userEmail: 'siti.rahma@university.ac.id',
    userName: 'Siti Rahmawati, S.Kom., M.Cs.',
    status: 'queued',
    progressPercentage: 15,
    currentProcess: 'Validating Repository URL & Access Permissions',
    currentStepIndex: 1,
    startTime: '2026-10-01T00:15:02Z',
    durationMs: 2100
  },
  {
    id: 'ans-8819',
    repoUrl: 'https://github.com/gitcontrib-lab/gitcontrib-core',
    repoName: 'gitcontrib-core',
    owner: 'gitcontrib-lab',
    userEmail: 'dosen@gitcontrib.ac.id',
    userName: 'Dr. Hendra Wijaya, M.T.',
    status: 'completed',
    progressPercentage: 100,
    currentProcess: 'Analysis Complete. Report Generated.',
    currentStepIndex: 7,
    startTime: '2026-09-30T23:30:00Z',
    durationMs: 18500
  },
  {
    id: 'ans-8818',
    repoUrl: 'https://github.com/invalid-org/unknown-repo',
    repoName: 'unknown-repo',
    owner: 'invalid-org',
    userEmail: 'budi.pratama@univ-tech.id',
    userName: 'Budi Pratama, M.Sc.',
    status: 'failed',
    progressPercentage: 28,
    currentProcess: 'Fetching Git History failed: HTTP 404 Repository Not Found',
    currentStepIndex: 2,
    startTime: '2026-09-30T22:15:00Z',
    durationMs: 4200
  }
];

export const MOCK_ERROR_LOGS: ErrorLogItem[] = [
  {
    id: 'err-401',
    category: 'GitHub API Error',
    repository: 'github.com/private-org/restricted-repo',
    process: 'Fetching Git History',
    timestamp: '2026-09-30T22:15:30Z',
    status: 'investigating',
    errorDetail: 'HTTP 404: Repository not found or bad credentials. Rate limit remaining: 4,250.'
  },
  {
    id: 'err-402',
    category: 'Invalid Repository URL',
    repository: 'https://github.com/invalid-url-format###',
    process: 'Validating Repository',
    timestamp: '2026-09-30T21:10:05Z',
    status: 'resolved',
    errorDetail: 'URL Validation Regex failure: input URL contains illegal characters or non-standard protocol.'
  },
  {
    id: 'err-403',
    category: 'AI/ML Error',
    repository: 'github.com/test-org/empty-commits-repo',
    process: 'Feature Engineering & Clustering',
    timestamp: '2026-09-29T18:40:22Z',
    status: 'resolved',
    errorDetail: 'Insufficient commit sample count (< 3 contributors). K-Means skipped due to low sample variance.'
  },
  {
    id: 'err-404',
    category: 'Authentication Error',
    repository: 'N/A',
    process: 'Admin Login',
    timestamp: '2026-09-29T16:00:12Z',
    status: 'resolved',
    errorDetail: 'User attempted sign in with disabled account credentials: ahmad.zaelani@inst-tech.ac.id.'
  }
];

export const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-901',
    userEmail: 'admin@gitcontrib.ac.id',
    userName: 'Prof. Dr. Ir. Admin System',
    role: 'admin',
    activity: 'Admin changed account status',
    target: 'budi.pratama@univ-tech.id -> Approved to Active',
    timestamp: '2026-10-01T00:10:00Z',
    ipAddress: '192.168.1.5'
  },
  {
    id: 'aud-902',
    userEmail: 'admin@gitcontrib.ac.id',
    userName: 'Prof. Dr. Ir. Admin System',
    role: 'admin',
    activity: 'Admin changed GitHub API configuration',
    target: 'Updated PAT token ghp_••••91A2',
    timestamp: '2026-09-30T20:45:00Z',
    ipAddress: '192.168.1.5'
  },
  {
    id: 'aud-903',
    userEmail: 'dosen@gitcontrib.ac.id',
    userName: 'Dr. Hendra Wijaya, M.T.',
    role: 'dosen',
    activity: 'User ran repository analysis',
    target: 'https://github.com/vitejs/vite',
    timestamp: '2026-09-30T18:45:00Z',
    ipAddress: '192.168.1.18'
  },
  {
    id: 'aud-904',
    userEmail: 'admin@gitcontrib.ac.id',
    userName: 'Prof. Dr. Ir. Admin System',
    role: 'admin',
    activity: 'Admin retrained model',
    target: 'Retrained model version v2.1.0-stable with 18,400 dataset samples',
    timestamp: '2026-09-15T14:00:00Z',
    ipAddress: '192.168.1.5'
  },
  {
    id: 'aud-905',
    userEmail: 'dosen@gitcontrib.ac.id',
    userName: 'Dr. Hendra Wijaya, M.T.',
    role: 'dosen',
    activity: 'User login',
    target: 'Dosen Dashboard Portal Access',
    timestamp: '2026-09-30T18:30:00Z',
    ipAddress: '192.168.1.18'
  }
];

export const MOCK_SYSTEM_CONFIG: SystemConfig = {
  general: {
    appName: 'GitContrib - Contributor Pattern Analytics System',
    environment: 'Production',
    dataRetentionDays: 180,
    allowSelfRegistration: true
  },
  analysis: {
    maxRepositorySizeMB: 500,
    analysisTimeoutSeconds: 300,
    maxConcurrentAnalyses: 5,
    cacheDurationHours: 24
  },
  ai: {
    activeModelVersion: 'v2.1.0-stable',
    minContributorsForML: 2,
    autoRetrainOnNewData: false
  },
  system: {
    maintenanceMode: false,
    debugLogging: true
  }
};
