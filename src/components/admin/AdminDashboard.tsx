import React, { useState } from 'react';
import {
  Users,
  Key,
  Cpu,
  Activity,
  History,
  AlertTriangle,
  FileSpreadsheet,
  Settings as SettingsIcon,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Plus,
  Trash2,
  Shield,
  Edit,
  Power,
  RotateCcw,
  Terminal,
  Database,
  ExternalLink,
  Sliders,
  Play,
  LogOut,
  ChevronDown
} from 'lucide-react';
import {
  MOCK_USERS,
  MOCK_GITHUB_API_CONFIG,
  MOCK_AI_MODEL_CONFIG,
  MOCK_MONITORING_ANALYSES,
  MOCK_ERROR_LOGS,
  MOCK_AUDIT_LOGS,
  MOCK_SYSTEM_CONFIG,
  GitHubApiConfig,
  AIModelConfig,
  MonitoringAnalysisItem,
  ErrorLogItem,
  AuditLogItem,
  SystemConfig
} from '../../data/mockAdminData';
import { User, UserRole, AccountStatus } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { StaggerContainer } from '../animations/StaggerContainer';
import { AnimatedProgressBar } from '../animations/AnimatedProgressBar';
import { AnimatedDropdown } from '../animations/AnimatedDropdown';

export type AdminTab =
  | 'overview'
  | 'users'
  | 'github-api'
  | 'ai-ml'
  | 'monitoring'
  | 'history'
  | 'logs'
  | 'audit'
  | 'config';

export const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // State management for interactive Admin features
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [apiConfig, setApiConfig] = useState<GitHubApiConfig>(MOCK_GITHUB_API_CONFIG);
  const [aiConfig, setAiConfig] = useState<AIModelConfig>(MOCK_AI_MODEL_CONFIG);
  const [monitoringList, setMonitoringList] = useState<MonitoringAnalysisItem[]>(MOCK_MONITORING_ANALYSES);
  const [errorLogs, setErrorLogs] = useState<ErrorLogItem[]>(MOCK_ERROR_LOGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(MOCK_AUDIT_LOGS);
  const [sysConfig, setSysConfig] = useState<SystemConfig>(MOCK_SYSTEM_CONFIG);

  // Filters & Modal States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [isTestConnectionLoading, setIsTestConnectionLoading] = useState(false);
  const [testConnectionNotice, setTestConnectionNotice] = useState<string | null>(null);
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainStep, setRetrainStep] = useState<string | null>(null);

  // User Actions
  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus: AccountStatus = u.status === 'active' ? 'disabled' : 'active';
          const newAudit: AuditLogItem = {
            id: `aud-${Date.now()}`,
            userEmail: user?.email || 'admin@gitcontrib.ac.id',
            userName: user?.name || 'Admin System',
            role: 'admin',
            activity: `Admin changed account status to ${nextStatus}`,
            target: u.email,
            timestamp: new Date().toISOString(),
            ipAddress: '127.0.0.1'
          };
          setAuditLogs((aud) => [newAudit, ...aud]);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleChangeUserRole = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newAudit: AuditLogItem = {
            id: `aud-${Date.now()}`,
            userEmail: user?.email || 'admin@gitcontrib.ac.id',
            userName: user?.name || 'Admin System',
            role: 'admin',
            activity: `Admin changed role to ${newRole}`,
            target: u.email,
            timestamp: new Date().toISOString(),
            ipAddress: '127.0.0.1'
          };
          setAuditLogs((aud) => [newAudit, ...aud]);
          return { ...u, role: newRole };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;
    if (confirm(`Apakah Anda yakin ingin menghapus akun ${targetUser.email}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setAuditLogs((aud) => [
        {
          id: `aud-${Date.now()}`,
          userEmail: user?.email || 'admin@gitcontrib.ac.id',
          userName: user?.name || 'Admin System',
          role: 'admin',
          activity: 'Admin deleted user account',
          target: targetUser.email,
          timestamp: new Date().toISOString(),
          ipAddress: '127.0.0.1'
        },
        ...aud
      ]);
    }
  };

  const handleTestApiConnection = () => {
    setIsTestConnectionLoading(true);
    setTestConnectionNotice(null);
    setTimeout(() => {
      setIsTestConnectionLoading(false);
      setTestConnectionNotice('Koneksi ke GitHub REST API Terverifikasi: Status 200 OK (Remaining 4,250/5,000)');
    }, 800);
  };

  const handleStartRetraining = () => {
    setIsRetraining(true);
    setRetrainStep('1. Dataset Preprocessing (18,400 Git Commits)...');
    setTimeout(() => {
      setRetrainStep('2. Feature Engineering & Normalization (6 Metrics)...');
      setTimeout(() => {
        setRetrainStep('3. K-Means Centroid Convergence (k=4)...');
        setTimeout(() => {
          setRetrainStep('4. Model Evaluation (Silhouette Score: 0.758)...');
          setTimeout(() => {
            setIsRetraining(false);
            setRetrainStep(null);
            setAiConfig((prev) => ({
              ...prev,
              version: `v2.2.0-stable`,
              trainingDate: new Date().toISOString(),
              evaluationResult: {
                ...prev.evaluationResult,
                silhouetteScore: 0.758
              },
              history: [
                { version: 'v2.2.0-stable', date: 'Hari Ini', silhouetteScore: 0.758, status: 'active' },
                ...prev.history.map((h) => ({ ...h, status: 'archived' as const }))
              ]
            }));
            setAuditLogs((aud) => [
              {
                id: `aud-${Date.now()}`,
                userEmail: user?.email || 'admin@gitcontrib.ac.id',
                userName: user?.name || 'Admin System',
                role: 'admin',
                activity: 'Admin retrained ML model',
                target: 'New active model v2.2.0-stable deployed',
                timestamp: new Date().toISOString(),
                ipAddress: '127.0.0.1'
              },
              ...aud
            ]);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#1f2328] font-sans">
      
      {/* DEDICATED ADMIN TOP HEADER */}
      <header className="border-b border-[#e5e7eb] bg-[#111827] text-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Admin Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[#2563eb] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white leading-tight">
                  GitContrib Admin Portal
                </span>
                <span className="text-[10px] text-[#9ca3af] font-mono leading-none">
                  System Administration & Control Center
                </span>
              </div>
              <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e3a8a] text-[#60a5fa] border border-[#3b82f6]/40 font-bold uppercase">
                ADMIN ACCESS
              </span>
            </div>

            {/* Admin User Profile & Sign Out */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1f2937] transition-colors focus:outline-none cursor-pointer"
                >
                  <img
                    src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80'}
                    alt="Admin Avatar"
                    className="w-7 h-7 rounded-full object-cover border border-[#374151]"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-white leading-tight">{user?.name || 'Admin System'}</div>
                    <div className="text-[10px] text-[#9ca3af] truncate">{user?.email || 'admin@gitcontrib.ac.id'}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#9ca3af]" />
                </button>

                <AnimatedDropdown
                  isOpen={showUserMenu}
                  onClose={() => setShowUserMenu(false)}
                  className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-[#e5e7eb] py-1.5 z-50 text-xs text-[#111827]"
                >
                  <div className="px-3.5 py-2 border-b border-[#f3f4f6] bg-[#f9fafb]">
                    <p className="font-bold text-[#111827] truncate">{user?.name || 'Admin System'}</p>
                    <p className="text-[#6b7280] text-[11px] truncate mt-0.5">{user?.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold bg-[#dbeafe] text-[#1e40af] px-2 py-0.5 rounded-full uppercase">
                      ADMINISTRATOR
                    </span>
                  </div>

                  <div className="pt-1">
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
            </div>

          </div>
        </div>
      </header>

      {/* Main Admin Navigation Tabs (Strict 8 required categories + Dashboard Overview) */}
      <div className="border-b border-[#e5e7eb] bg-[#f9fafb] px-4 sm:px-6 lg:px-8 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto text-xs font-medium py-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`nav-item flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'border-[#2563eb] text-[#2563eb] bg-white rounded-t'
                : 'border-transparent text-[#4b5563] hover:text-[#111827]'
            }`}
          >
            <Activity className="w-4 h-4 text-[#2563eb]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold transition-colors cursor-pointer shrink-0 ${
              activeTab === 'users'
                ? 'border-[#2563eb] text-[#2563eb] bg-white rounded-t'
                : 'border-transparent text-[#4b5563] hover:text-[#111827]'
            }`}
          >
            <Users className="w-4 h-4 text-[#16a34a]" />
            <span>1. User Management</span>
            <span className="ml-1 text-[10px] bg-[#e5e7eb] px-1.5 py-0.2 rounded text-[#374151]">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('github-api')}
            className={`nav-item flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold cursor-pointer shrink-0 ${
              activeTab === 'github-api'
                ? 'border-[#2563eb] text-[#2563eb] bg-white rounded-t'
                : 'border-transparent text-[#4b5563] hover:text-[#111827]'
            }`}
          >
            <Key className="w-4 h-4 text-[#9333ea]" />
            <span>2. GitHub API</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-ml')}
            className={`nav-item flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold cursor-pointer shrink-0 ${
              activeTab === 'ai-ml'
                ? 'border-[#2563eb] text-[#2563eb] bg-white rounded-t'
                : 'border-transparent text-[#4b5563] hover:text-[#111827]'
            }`}
          >
            <Cpu className="w-4 h-4 text-[#d97706]" />
            <span>3. AI / ML</span>
          </button>

          <button
            onClick={() => setActiveTab('monitoring')}
            className={`nav-item flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold cursor-pointer shrink-0 ${
              activeTab === 'monitoring'
                ? 'border-[#2563eb] text-[#2563eb] bg-white rounded-t'
                : 'border-transparent text-[#4b5563] hover:text-[#111827]'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-[#2563eb]" />
            <span>4. Analysis Monitoring</span>
            <span className="ml-1 text-[10px] bg-[#dcfce7] text-[#15803d] px-1.5 py-0.2 rounded font-bold">
              {monitoringList.filter((m) => m.status === 'processing').length} Active
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`nav-item flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold cursor-pointer shrink-0 ${
              activeTab === 'history'
                ? 'border-[#2563eb] text-[#2563eb] bg-white rounded-t'
                : 'border-transparent text-[#4b5563] hover:text-[#111827]'
            }`}
          >
            <History className="w-4 h-4 text-[#4b5563]" />
            <span>5. Analysis History</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`nav-item flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold cursor-pointer shrink-0 ${
              activeTab === 'logs'
                ? 'border-[#2563eb] text-[#2563eb] bg-white rounded-t'
                : 'border-transparent text-[#4b5563] hover:text-[#111827]'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-[#dc2626]" />
            <span>6. Error Logs</span>
            <span className="ml-1 text-[10px] bg-[#fee2e2] text-[#dc2626] px-1.5 py-0.2 rounded font-bold">
              {errorLogs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`nav-item flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold cursor-pointer shrink-0 ${
              activeTab === 'audit'
                ? 'border-[#2563eb] text-[#2563eb] bg-white rounded-t'
                : 'border-transparent text-[#4b5563] hover:text-[#111827]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-[#2563eb]" />
            <span>7. Audit Log</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`nav-item flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-semibold cursor-pointer shrink-0 ${
              activeTab === 'config'
                ? 'border-[#2563eb] text-[#2563eb] bg-white rounded-t'
                : 'border-transparent text-[#4b5563] hover:text-[#111827]'
            }`}
          >
            <SettingsIcon className="w-4 h-4 text-[#4b5563]" />
            <span>8. System Config</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ----------------- TAB OVERVIEW ----------------- */}
        {activeTab === 'overview' && (
          <div key="overview" className="page-enter space-y-6">
            {/* Metric KPI Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="stagger-item p-4 rounded-md border border-[#d0d7de] bg-[#f6f8fa]" style={{ animationDelay: '0ms' }}>
                <div className="text-xs text-[#57606a] font-medium">Total Users</div>
                <div className="text-2xl font-bold text-[#1f2328] mt-1">{users.length}</div>
                <div className="text-[11px] text-[#1a7f37] mt-1 font-medium">
                  {users.filter((u) => u.status === 'active').length} Active Accounts
                </div>
              </div>

              <div className="stagger-item p-4 rounded-md border border-[#d0d7de] bg-[#f6f8fa]" style={{ animationDelay: '50ms' }}>
                <div className="text-xs text-[#57606a] font-medium">Analyses Today</div>
                <div className="text-2xl font-bold text-[#1f2328] mt-1">12</div>
                <div className="text-[11px] text-[#0969da] mt-1 font-medium">
                  1 Running · 0 Failed
                </div>
              </div>

              <div className="stagger-item p-4 rounded-md border border-[#d0d7de] bg-[#f6f8fa]" style={{ animationDelay: '100ms' }}>
                <div className="text-xs text-[#57606a] font-medium">GitHub API Rate Limit</div>
                <div className="text-2xl font-bold text-[#1f2328] mt-1">4,250</div>
                <div className="text-[11px] text-[#57606a] mt-1 font-mono">
                  / 5,000 requests (85% remaining)
                </div>
              </div>

              <div className="stagger-item p-4 rounded-md border border-[#d0d7de] bg-[#f6f8fa]" style={{ animationDelay: '150ms' }}>
                <div className="text-xs text-[#57606a] font-medium">AI ML Cluster Model</div>
                <div className="text-2xl font-bold text-[#1f2328] mt-1">v2.1.0</div>
                <div className="text-[11px] text-[#1a7f37] mt-1 font-medium">
                  Silhouette: 0.742 (High)
                </div>
              </div>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Running Analyses Activity */}
              <div className="border border-[#d0d7de] rounded-md bg-white p-4">
                <div className="flex items-center justify-between mb-3 border-b border-[#d0d7de] pb-2">
                  <h3 className="text-xs font-bold text-[#1f2328] flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-[#0969da] animate-spin" />
                    Running Analyses (Monitoring)
                  </h3>
                  <button
                    onClick={() => setActiveTab('monitoring')}
                    className="text-xs text-[#0969da] hover:underline cursor-pointer"
                  >
                    View All Monitoring
                  </button>
                </div>

                <div className="space-y-3">
                  {monitoringList.map((item) => (
                    <div key={item.id} className="p-3 bg-[#f6f8fa] border border-[#d0d7de] rounded text-xs">
                      <div className="flex items-center justify-between font-mono font-semibold">
                        <span className="text-[#0969da]">{item.owner}/{item.repoName}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'completed' ? 'bg-[#dafbe1] text-[#1a7f37]' :
                          item.status === 'processing' ? 'bg-[#ddf4ff] text-[#0969da]' :
                          item.status === 'queued' ? 'bg-[#fff8c5] text-[#9a6700]' : 'bg-[#ffebe9] text-[#cf222e]'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[#57606a] mt-1 text-[11px] flex justify-between">
                        <span>User: {item.userName}</span>
                        <span>Process Step: {item.currentStepIndex}/7</span>
                      </div>
                      <div className="mt-2 w-full bg-[#d0d7de] h-1.5 rounded-full overflow-hidden">
                        <AnimatedProgressBar
                          value={item.progressPercentage}
                          barColor="bg-[#0969da]"
                          bgColor="bg-[#d0d7de]"
                          height="h-1.5"
                          duration={400}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent System & Error Logs */}
              <div className="border border-[#d0d7de] rounded-md bg-white p-4">
                <div className="flex items-center justify-between mb-3 border-b border-[#d0d7de] pb-2">
                  <h3 className="text-xs font-bold text-[#1f2328] flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#cf222e]" />
                    Recent System & Error Logs
                  </h3>
                  <button
                    onClick={() => setActiveTab('logs')}
                    className="text-xs text-[#0969da] hover:underline cursor-pointer"
                  >
                    View Error Logs
                  </button>
                </div>

                <div className="space-y-3">
                  {errorLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-[#f6f8fa] border border-[#d0d7de] rounded text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#cf222e]">{log.category}</span>
                        <span className="text-[10px] text-[#57606a] font-mono">{log.timestamp.slice(11, 19)}</span>
                      </div>
                      <p className="text-[11px] text-[#1f2328] mt-1 line-clamp-1">{log.errorDetail}</p>
                      <div className="text-[10px] text-[#57606a] mt-1 font-mono">{log.repository}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 1: USER MANAGEMENT ----------------- */}
        {activeTab === 'users' && (
          <div key="users" className="page-enter space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f6f8fa] p-3 border border-[#d0d7de] rounded-md">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#57606a]" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Cari akun berdasarkan nama atau email..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#d0d7de] rounded text-[#1f2328] focus:outline-none focus:ring-1 focus:ring-[#0969da]"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-[#d0d7de] rounded text-[#1f2328]"
                >
                  <option value="all">Semua Role</option>
                  <option value="dosen">Dosen</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="text-xs text-[#57606a]">
                Menampilkan <span className="font-bold text-[#1f2328]">{filteredUsers.length}</span> dari {users.length} pengguna
              </div>
            </div>

            {/* Users Table */}
            <div className="border border-[#d0d7de] rounded-md overflow-hidden bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f6f8fa] border-b border-[#d0d7de] text-[#57606a] font-semibold">
                    <th className="p-3">Nama Lengkap</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Terdaftar</th>
                    <th className="p-3">Login Terakhir</th>
                    <th className="p-3 text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d0d7de]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#f6f8fa] transition-colors">
                      <td className="p-3 font-semibold text-[#1f2328] flex items-center gap-2">
                        <img src={u.avatarUrl} alt={u.name} className="w-6 h-6 rounded-full border border-[#d0d7de]" />
                        <span>{u.name}</span>
                      </td>
                      <td className="p-3 font-mono text-[#0969da]">{u.email}</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeUserRole(u.id, e.target.value as UserRole)}
                          className="px-2 py-0.5 text-xs bg-white border border-[#d0d7de] rounded font-semibold text-[#1f2328]"
                        >
                          <option value="dosen">Dosen</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'active' ? 'bg-[#dafbe1] text-[#1a7f37]' :
                          u.status === 'pending' ? 'bg-[#fff8c5] text-[#9a6700]' : 'bg-[#ffebe9] text-[#cf222e]'
                        }`}>
                          {u.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-[#57606a]">{u.registeredAt?.slice(0, 10)}</td>
                      <td className="p-3 text-[#57606a]">{u.lastLogin?.slice(0, 10)}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded border transition-colors cursor-pointer ${
                            u.status === 'active'
                              ? 'border-[#d0d7de] text-[#cf222e] hover:bg-[#ffebe9]'
                              : 'border-[#1a7f37] bg-[#dafbe1] text-[#1a7f37] hover:bg-[#2da44e]/20'
                          }`}
                        >
                          {u.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="px-2 py-1 text-[11px] text-[#cf222e] hover:bg-[#ffebe9] rounded border border-transparent transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: GITHUB API MANAGEMENT ----------------- */}
        {activeTab === 'github-api' && (
          <div key="github-api" className="page-enter space-y-6">
            <div className="p-5 border border-[#d0d7de] rounded-md bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-[#d0d7de] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1f2328]">Konfigurasi GitHub REST API</h3>
                  <p className="text-xs text-[#57606a] mt-0.5">
                    Atur Personal Access Token (PAT) untuk meningkatkan batas rate limit API dari 60 menjadi 5.000 request/jam.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#dafbe1] text-[#1a7f37] border border-[#4ac26b]/50 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Status: Connected
                </span>
              </div>

              {testConnectionNotice && (
                <div className="p-3 rounded bg-[#dafbe1] border border-[#4ac26b]/50 text-[#1a7f37] text-xs font-medium">
                  {testConnectionNotice}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1f2328] mb-1">
                    Aktif Token (Masked)
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={apiConfig.configuredTokenMasked}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-[#f6f8fa] border border-[#d0d7de] rounded text-[#57606a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f2328] mb-1">
                    Rate Limit Usage
                  </label>
                  <div className="px-3 py-1.5 text-xs font-mono bg-[#f6f8fa] border border-[#d0d7de] rounded text-[#1f2328] flex justify-between">
                    <span>4,250 Sisa / 5,000 Total</span>
                    <span className="text-[#1a7f37] font-bold">85% Available</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleTestApiConnection}
                  disabled={isTestConnectionLoading}
                  className="px-4 py-2 bg-[#1f2328] hover:bg-[#24292f] text-white text-xs font-semibold rounded flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isTestConnectionLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Activity className="w-3.5 h-3.5 text-[#7ee787]" />
                  )}
                  <span>Test Connection</span>
                </button>
              </div>
            </div>

            {/* Request Logs */}
            <div className="border border-[#d0d7de] rounded-md bg-white p-4">
              <h4 className="text-xs font-bold text-[#1f2328] mb-3">Log Request GitHub API Terakhir</h4>
              <div className="divide-y divide-[#d0d7de]">
                {apiConfig.requestLogs.map((req) => (
                  <div key={req.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.statusCode === 200 ? 'bg-[#dafbe1] text-[#1a7f37]' : 'bg-[#ffebe9] text-[#cf222e]'
                      }`}>
                        {req.statusCode}
                      </span>
                      <span className="text-[#1f2328] font-bold">{req.method}</span>
                      <span className="text-[#0969da]">{req.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[#57606a] text-[11px]">
                      <span>{req.responseTimeMs} ms</span>
                      <span>{req.timestamp.slice(11, 19)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: AI / ML MANAGEMENT ----------------- */}
        {activeTab === 'ai-ml' && (
          <div key="ai-ml" className="page-enter space-y-6">
            <div className="p-5 border border-[#d0d7de] rounded-md bg-white space-y-4">
              <div className="flex items-center justify-between border-b border-[#d0d7de] pb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1f2328]">{aiConfig.modelName}</h3>
                  <p className="text-xs text-[#57606a] mt-0.5">
                    Versi Model Aktif: <span className="font-mono font-bold text-[#1f2328]">{aiConfig.version}</span> · Ditraining pada {aiConfig.trainingDate.slice(0, 10)}
                  </p>
                </div>

                <button
                  onClick={handleStartRetraining}
                  disabled={isRetraining}
                  className="px-4 py-2 bg-[#1a7f37] hover:bg-[#1f883d] text-white text-xs font-semibold rounded flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Jalankan Retraining Model</span>
                </button>
              </div>

              {retrainStep && (
                <div className="p-3 rounded bg-[#ddf4ff] border border-[#54aeff]/40 text-[#0969da] text-xs font-mono flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{retrainStep}</span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-[#f6f8fa] border border-[#d0d7de] rounded">
                  <div className="text-[#57606a]">Silhouette Score</div>
                  <div className="text-lg font-bold text-[#1f2328] mt-1">{aiConfig.evaluationResult.silhouetteScore}</div>
                </div>

                <div className="p-3 bg-[#f6f8fa] border border-[#d0d7de] rounded">
                  <div className="text-[#57606a]">Inertia (Sum Squared)</div>
                  <div className="text-lg font-bold text-[#1f2328] mt-1">{aiConfig.evaluationResult.inertia}</div>
                </div>

                <div className="p-3 bg-[#f6f8fa] border border-[#d0d7de] rounded">
                  <div className="text-[#57606a]">Jumlah Cluster (k)</div>
                  <div className="text-lg font-bold text-[#1f2328] mt-1">{aiConfig.clustersCount} Patterns</div>
                </div>

                <div className="p-3 bg-[#f6f8fa] border border-[#d0d7de] rounded">
                  <div className="text-[#57606a]">Ukuran Dataset</div>
                  <div className="text-lg font-bold text-[#1f2328] mt-1">{aiConfig.datasetSize.toLocaleString()} Commits</div>
                </div>
              </div>
            </div>

            {/* Model History */}
            <div className="border border-[#d0d7de] rounded-md bg-white p-4">
              <h4 className="text-xs font-bold text-[#1f2328] mb-3">Riwayat Versi Model ML</h4>
              <div className="divide-y divide-[#d0d7de]">
                {aiConfig.history.map((h) => (
                  <div key={h.version} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[#1f2328]">{h.version}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        h.status === 'active' ? 'bg-[#dafbe1] text-[#1a7f37]' : 'bg-[#f6f8fa] text-[#57606a]'
                      }`}>
                        {h.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 font-mono text-[#57606a]">
                      <span>Tanggal: {h.date}</span>
                      <span>Silhouette: {h.silhouetteScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: ANALYSIS MONITORING ----------------- */}
        {activeTab === 'monitoring' && (
          <div key="monitoring" className="page-enter space-y-4">
            <h3 className="text-sm font-bold text-[#1f2328]">Pemantauan Analisis Berjalan (Real-Time Monitoring)</h3>
            <div className="border border-[#d0d7de] rounded-md overflow-hidden bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f6f8fa] border-b border-[#d0d7de] text-[#57606a] font-semibold">
                    <th className="p-3">ID Analisis</th>
                    <th className="p-3">Repositori</th>
                    <th className="p-3">Pengguna</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Progres %</th>
                    <th className="p-3">Tahap Berjalan Saat Ini</th>
                    <th className="p-3">Durasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d0d7de]">
                  {monitoringList.map((m) => (
                    <tr key={m.id} className="hover:bg-[#f6f8fa] transition-colors">
                      <td className="p-3 font-mono font-bold text-[#0969da]">{m.id}</td>
                      <td className="p-3 font-mono font-semibold text-[#1f2328]">{m.owner}/{m.repoName}</td>
                      <td className="p-3 text-[#57606a]">{m.userName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.status === 'completed' ? 'bg-[#dafbe1] text-[#1a7f37]' :
                          m.status === 'processing' ? 'bg-[#ddf4ff] text-[#0969da]' :
                          m.status === 'queued' ? 'bg-[#fff8c5] text-[#9a6700]' : 'bg-[#ffebe9] text-[#cf222e]'
                        }`}>
                          {m.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold">{m.progressPercentage}%</td>
                      <td className="p-3 text-[#1f2328] font-mono text-[11px]">{m.currentProcess}</td>
                      <td className="p-3 text-[#57606a] font-mono">{(m.durationMs / 1000).toFixed(1)}s</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- TAB 5: ANALYSIS HISTORY ----------------- */}
        {activeTab === 'history' && (
          <div key="history" className="page-enter space-y-4">
            <h3 className="text-sm font-bold text-[#1f2328]">Riwayat Seluruh Analisis Repositori</h3>
            <div className="border border-[#d0d7de] rounded-md overflow-hidden bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f6f8fa] border-b border-[#d0d7de] text-[#57606a] font-semibold">
                    <th className="p-3">ID Analisis</th>
                    <th className="p-3">Repositori</th>
                    <th className="p-3">Pengguna</th>
                    <th className="p-3">Tanggal Analisis</th>
                    <th className="p-3">Jumlah Kontributor</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Versi Model</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d0d7de]">
                  {monitoringList.map((m) => (
                    <tr key={m.id} className="hover:bg-[#f6f8fa] transition-colors">
                      <td className="p-3 font-mono font-bold text-[#0969da]">{m.id}</td>
                      <td className="p-3 font-mono font-semibold text-[#1f2328]">{m.owner}/{m.repoName}</td>
                      <td className="p-3 text-[#57606a]">{m.userName}</td>
                      <td className="p-3 text-[#57606a]">{m.startTime.slice(0, 10)}</td>
                      <td className="p-3 font-bold text-[#1f2328]">14 Kontributor</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.status === 'completed' ? 'bg-[#dafbe1] text-[#1a7f37]' :
                          m.status === 'processing' ? 'bg-[#ddf4ff] text-[#0969da]' :
                          m.status === 'queued' ? 'bg-[#fff8c5] text-[#9a6700]' : 'bg-[#ffebe9] text-[#cf222e]'
                        }`}>
                          {m.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[#57606a]">v2.1.0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- TAB 6: ERROR & SYSTEM LOGS ----------------- */}
        {activeTab === 'logs' && (
          <div key="logs" className="page-enter space-y-4">
            <h3 className="text-sm font-bold text-[#1f2328]">Error & System Logs (Kategoris)</h3>
            <div className="border border-[#d0d7de] rounded-md overflow-hidden bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f6f8fa] border-b border-[#d0d7de] text-[#57606a] font-semibold">
                    <th className="p-3">Kategori Error</th>
                    <th className="p-3">Repositori</th>
                    <th className="p-3">Proses</th>
                    <th className="p-3">Waktu Log</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Rincian Error</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d0d7de]">
                  {errorLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#f6f8fa] transition-colors">
                      <td className="p-3 font-bold text-[#cf222e]">{log.category}</td>
                      <td className="p-3 font-mono text-[#57606a]">{log.repository}</td>
                      <td className="p-3 font-semibold text-[#1f2328]">{log.process}</td>
                      <td className="p-3 text-[#57606a] font-mono">{log.timestamp.slice(0, 19)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f6f8fa] text-[#57606a] border border-[#d0d7de]">
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-[#57606a] max-w-xs truncate">{log.errorDetail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- TAB 7: AUDIT LOG ----------------- */}
        {activeTab === 'audit' && (
          <div key="audit" className="page-enter space-y-4">
            <h3 className="text-sm font-bold text-[#1f2328]">Audit Log Aktivitas Sistem</h3>
            <div className="border border-[#d0d7de] rounded-md overflow-hidden bg-white">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#f6f8fa] border-b border-[#d0d7de] text-[#57606a] font-semibold">
                    <th className="p-3">Pengguna</th>
                    <th className="p-3">Aktivitas</th>
                    <th className="p-3">Target / Detail</th>
                    <th className="p-3">Waktu (Timestamp)</th>
                    <th className="p-3">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d0d7de]">
                  {auditLogs.map((aud) => (
                    <tr key={aud.id} className="hover:bg-[#f6f8fa] transition-colors">
                      <td className="p-3 font-semibold text-[#1f2328]">{aud.userName} ({aud.userEmail})</td>
                      <td className="p-3 font-semibold text-[#0969da]">{aud.activity}</td>
                      <td className="p-3 font-mono text-[#1f2328]">{aud.target}</td>
                      <td className="p-3 text-[#57606a] font-mono">{aud.timestamp.slice(0, 19)}</td>
                      <td className="p-3 text-[#57606a] font-mono">{aud.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- TAB 8: SYSTEM CONFIGURATION ----------------- */}
        {activeTab === 'config' && (
          <div key="config" className="page-enter space-y-6">
            <div className="p-5 border border-[#d0d7de] rounded-md bg-white space-y-4">
              <h3 className="text-sm font-bold text-[#1f2328] border-b border-[#d0d7de] pb-2">Pengaturan Umum & Sistem</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#1f2328] mb-1">Nama Aplikasi</label>
                  <input
                    type="text"
                    value={sysConfig.general.appName}
                    onChange={(e) => setSysConfig({ ...sysConfig, general: { ...sysConfig.general, appName: e.target.value } })}
                    className="w-full px-3 py-1.5 border border-[#d0d7de] rounded text-[#1f2328]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1f2328] mb-1">Maksimum Concurrent Analysis</label>
                  <input
                    type="number"
                    value={sysConfig.analysis.maxConcurrentAnalyses}
                    onChange={(e) => setSysConfig({ ...sysConfig, analysis: { ...sysConfig.analysis, maxConcurrentAnalyses: Number(e.target.value) } })}
                    className="w-full px-3 py-1.5 border border-[#d0d7de] rounded text-[#1f2328]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1f2328] mb-1">Analysis Timeout (Detik)</label>
                  <input
                    type="number"
                    value={sysConfig.analysis.analysisTimeoutSeconds}
                    onChange={(e) => setSysConfig({ ...sysConfig, analysis: { ...sysConfig.analysis, analysisTimeoutSeconds: Number(e.target.value) } })}
                    className="w-full px-3 py-1.5 border border-[#d0d7de] rounded text-[#1f2328]"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-[#f6f8fa] border border-[#d0d7de] rounded">
                  <div>
                    <div className="font-semibold text-[#1f2328]">Mode Perawatan (Maintenance Mode)</div>
                    <div className="text-[11px] text-[#57606a]">Membatasi akses pengguna biasa selama pemeliharaan</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={sysConfig.system.maintenanceMode}
                    onChange={(e) => setSysConfig({ ...sysConfig, system: { ...sysConfig.system, maintenanceMode: e.target.checked } })}
                    className="w-4 h-4 rounded text-[#0969da]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
