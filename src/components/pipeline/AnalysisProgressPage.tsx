import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  Loader2,
  Terminal,
  ArrowRight,
  Play,
  Pause,
  FastForward,
  AlertTriangle,
  Key,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Repository, Contributor, PipelineStage } from '../../types';
import { INITIAL_PIPELINE_STAGES } from '../../data/pipelineStages';
import {
  fetchLiveGitHubRepository,
  parseGitHubRepoInput,
  getStoredGitHubToken,
  setStoredGitHubToken,
  GitHubApiError
} from '../../services/githubService';
import { MOCK_CONTRIBUTORS } from '../../data/mockRepositories';
import { AnimatedProgressBar } from '../animations/AnimatedProgressBar';

interface AnalysisProgressPageProps {
  repo: Repository;
  onComplete: (analyzedRepo?: Repository, analyzedContributors?: Contributor[]) => void;
  onBackToLanding?: () => void;
}

export const AnalysisProgressPage: React.FC<AnalysisProgressPageProps> = ({
  repo,
  onComplete,
  onBackToLanding
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [allLogs, setAllLogs] = useState<string[]>([
    `[${new Date().toISOString().substring(11, 19)}] Initializing GitContrib analysis runner for ${repo.owner}/${repo.name}...`,
    `[${new Date().toISOString().substring(11, 19)}] Resolving repository locator: ${repo.url}`
  ]);
  const [isDone, setIsDone] = useState<boolean>(false);

  // Live GitHub fetch states
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);
  const [liveResolvedData, setLiveResolvedData] = useState<{
    repo: Repository;
    contributors: Contributor[];
  } | null>(null);
  const [errorInfo, setErrorInfo] = useState<GitHubApiError | null>(null);
  const [tokenInput, setTokenInput] = useState<string>(getStoredGitHubToken());
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);
  const [isLiveSuccess, setIsLiveSuccess] = useState<boolean>(false);

  const fetchAttemptedRef = useRef<boolean>(false);

  const addLog = (line: string) => {
    const timestamp = new Date().toISOString().substring(11, 19);
    setAllLogs((prev) => [...prev, `[${timestamp}] ${line}`]);
  };

  // Perform live fetch if repository URL is a GitHub repo
  const triggerLiveFetch = async (overrideToken?: string) => {
    const parsed = parseGitHubRepoInput(repo.url);
    if (!parsed) {
      addLog(`Local repository definition detected. Using built-in Git history model.`);
      return;
    }

    setIsFetchingLive(true);
    setErrorInfo(null);
    addLog(`Initiating live GitHub REST API extraction for github.com/${parsed.owner}/${parsed.repo}...`);

    try {
      const result = await fetchLiveGitHubRepository(
        parsed.owner,
        parsed.repo,
        overrideToken !== undefined ? overrideToken : undefined,
        (msg) => addLog(msg)
      );

      setLiveResolvedData({
        repo: result.repo,
        contributors: result.contributors
      });
      setIsLiveSuccess(true);
      setIsFetchingLive(false);
      addLog(`Live data extraction and K-Means clustering completed successfully.`);
    } catch (err: any) {
      setIsFetchingLive(false);
      const apiErr: GitHubApiError = err.status
        ? err
        : {
            status: 0,
            message: err.message || 'Failed to connect to GitHub API',
            isRateLimit: false,
            isNotFound: false
          };

      setErrorInfo(apiErr);
      addLog(`[ERROR HTTP ${apiErr.status}] ${apiErr.message}`);

      if (apiErr.isRateLimit) {
        addLog(`GitHub unauthenticated hourly rate limit reached (60 calls/hour). Provide a Personal Access Token or continue with synthetic model.`);
      }
    }
  };

  useEffect(() => {
    if (!fetchAttemptedRef.current) {
      fetchAttemptedRef.current = true;
      triggerLiveFetch();
    }
  }, [repo.url]);

  // Derive stage status reactively
  const stages: PipelineStage[] = INITIAL_PIPELINE_STAGES.map((s, idx) => {
    let status: 'pending' | 'running' | 'completed' = 'pending';
    if (isDone || idx < currentStageIndex) {
      status = 'completed';
    } else if (idx === currentStageIndex) {
      status = 'running';
    }
    return { ...s, status };
  });

  // Stage progression timer
  useEffect(() => {
    if (isPaused || isDone || errorInfo) return;

    if (currentStageIndex >= INITIAL_PIPELINE_STAGES.length) {
      setIsDone(true);
      return;
    }

    const activeStage = INITIAL_PIPELINE_STAGES[currentStageIndex];
    const stageDuration = Math.max(300, activeStage.durationMs / speedMultiplier);

    const timer = setTimeout(() => {
      // Add stage completion log
      addLog(`[STAGE ${activeStage.id}] ${activeStage.name} completed`);

      if (currentStageIndex + 1 >= INITIAL_PIPELINE_STAGES.length) {
        setIsDone(true);
      } else {
        setCurrentStageIndex((prev) => prev + 1);
      }
    }, stageDuration);

    return () => clearTimeout(timer);
  }, [currentStageIndex, isPaused, speedMultiplier, isDone, errorInfo]);

  const handleSaveTokenAndRetry = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredGitHubToken(tokenInput);
    setShowTokenInput(false);
    setErrorInfo(null);
    setCurrentStageIndex(0);
    setIsDone(false);
    triggerLiveFetch(tokenInput);
  };

  const handleContinueWithSimulation = () => {
    // Generate realistic custom repository & contributors so user isn't stuck
    setErrorInfo(null);
    addLog(`Resuming analysis using high-fidelity algorithmic model for ${repo.owner}/${repo.name}...`);
    // Create localized contributors based on repo owner & name
    const simulatedContributors = MOCK_CONTRIBUTORS.map((c, i) => ({
      ...c,
      id: `contrib-${repo.owner}-${i}`,
      email: `${c.login}@${repo.name}.dev`
    }));

    setLiveResolvedData({
      repo: {
        ...repo,
        isLiveGitHub: false
      },
      contributors: simulatedContributors
    });
  };

  const handleFinalCompletion = () => {
    if (liveResolvedData) {
      onComplete(liveResolvedData.repo, liveResolvedData.contributors);
    } else {
      onComplete(repo, MOCK_CONTRIBUTORS);
    }
  };

  const progressPercentage = Math.round(
    (stages.filter((s) => s.status === 'completed').length / stages.length) * 100
  );

  return (
    <div className="bg-[#ffffff] min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Header Required by Brief */}
      <div className="border border-[#d0d7de] rounded-md bg-[#f6f8fa] p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-[#0969da]">{repo.owner}</span>
              <span className="text-[#57606a]">/</span>
              <span className="text-base font-bold text-[#1f2328]">{repo.name}</span>
              <span className="text-[11px] font-medium border border-[#d0d7de] rounded-full px-2 py-0.5 text-[#57606a] bg-white">
                {repo.visibility}
              </span>

              {isLiveSuccess && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium border border-[#4ac26b] rounded-full px-2 py-0.5 text-[#1a7f37] bg-[#dafbe1]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a7f37]"></span>
                  Live GitHub Connected
                </span>
              )}
            </div>
            <p className="text-xs text-[#57606a] mt-1">
              Analyzing repository commit history, diff numstats, and contributor activity graphs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isDone
                  ? 'bg-[#dafbe1] text-[#1a7f37] border-[#4ac26b]'
                  : errorInfo
                  ? 'bg-[#ffebe9] text-[#cf222e] border-[#ff8182]'
                  : 'bg-[#ddf4ff] text-[#0969da] border-[#54aeff]'
              }`}
            >
              {isDone ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Analysis Ready</span>
                </>
              ) : errorInfo ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>API Limit / Attention Required</span>
                </>
              ) : (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Repository</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="mt-4 pt-3 border-t border-[#d0d7de] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[#57606a] block">Target Branch:</span>
            <span className="font-mono font-semibold text-[#1f2328]">
              {liveResolvedData?.repo.defaultBranch || repo.defaultBranch}
            </span>
          </div>
          <div>
            <span className="text-[#57606a] block">Visibility:</span>
            <span className="font-medium text-[#1f2328] capitalize">
              {liveResolvedData?.repo.visibility || repo.visibility}
            </span>
          </div>
          <div>
            <span className="text-[#57606a] block">Last Analyzed:</span>
            <span className="font-mono text-[#1f2328]">
              {new Date(repo.lastAnalyzed).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-[#57606a] block">Overall Status:</span>
            <span className="font-semibold text-[#1f2328]">
              {isDone
                ? 'Completed (100%)'
                : errorInfo
                ? 'Attention Required'
                : `Executing Stage ${Math.min(currentStageIndex + 1, 7)} of 7`}
            </span>
          </div>
        </div>
      </div>

      {/* GitHub API Diagnostic Notice (if 403 rate limit or 404) */}
      {errorInfo && (
        <div className="mt-6 border border-[#d0d7de] rounded-md bg-[#f6f8fa] p-5 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-md bg-[#ffebe9] text-[#cf222e] mt-0.5 border border-[#ff8182]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[#1f2328]">
                {errorInfo.isRateLimit
                  ? 'GitHub API Unauthenticated Rate Limit Reached (HTTP 403)'
                  : errorInfo.isNotFound
                  ? 'Repository Not Found or Private (HTTP 404)'
                  : `GitHub API Response: HTTP ${errorInfo.status}`}
              </h3>
              <p className="text-xs text-[#57606a] mt-1 leading-relaxed">
                {errorInfo.isRateLimit
                  ? 'GitHub limits unauthenticated REST API requests from shared IP addresses to 60 calls per hour. You can provide an optional personal access token (which grants 5,000 calls/hour) or continue with our high-fidelity synthetic model for this repository.'
                  : errorInfo.isNotFound
                  ? `GitHub could not find the public repository at "${repo.url}". Check whether the repository is public or if the URL has typos.`
                  : errorInfo.message}
              </p>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                {errorInfo.isRateLimit && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowTokenInput(!showTokenInput)}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#1f2328] hover:bg-[#24292f] text-white rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>{showTokenInput ? 'Hide Token Input' : 'Enter GitHub Personal Access Token'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleContinueWithSimulation}
                      className="px-3 py-1.5 text-xs font-semibold bg-[#ffffff] hover:bg-[#f6f8fa] text-[#1f2328] border border-[#d0d7de] rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#0969da]" />
                      <span>Continue with High-Fidelity Simulation</span>
                    </button>
                  </>
                )}

                {errorInfo.isNotFound && onBackToLanding && (
                  <button
                    type="button"
                    onClick={onBackToLanding}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#1f2328] hover:bg-[#24292f] text-white rounded-md transition-colors cursor-pointer"
                  >
                    Return and Check Repository URL
                  </button>
                )}
              </div>

              {/* Token Input Form */}
              {showTokenInput && (
                <form onSubmit={handleSaveTokenAndRetry} className="mt-4 p-3.5 bg-white border border-[#d0d7de] rounded-md space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[#1f2328] block mb-1">
                      GitHub Personal Access Token (PAT)
                    </label>
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full px-3 py-1.5 text-xs font-mono border border-[#d0d7de] rounded bg-[#ffffff] text-[#1f2328] focus:ring-2 focus:ring-[#0969da] focus:outline-none"
                    />
                    <p className="text-[11px] text-[#57606a] mt-1">
                      Your token is saved only in your local browser storage. Only read-only public repo permissions are needed.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-semibold bg-[#1a7f37] hover:bg-[#1f883d] text-white rounded transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Save Token & Retry Live Fetch</span>
                    </button>
                    <a
                      href="https://github.com/settings/tokens/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#0969da] hover:underline flex items-center gap-1 ml-2"
                    >
                      <span>Create Token on GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar & Speed Controls */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <AnimatedProgressBar
            value={progressPercentage}
            showLabel
            barColor="bg-[#1a7f37]"
            height="h-2.5"
          />
        </div>

        <div className="flex items-center gap-2">
          {!isDone && !errorInfo && (
            <>
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="px-2.5 py-1 text-xs border border-[#d0d7de] rounded bg-[#ffffff] hover:bg-[#f6f8fa] text-[#1f2328] flex items-center gap-1 transition-colors cursor-pointer"
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSpeedMultiplier(speedMultiplier === 1 ? 4 : 1)}
                className={`px-2.5 py-1 text-xs border rounded flex items-center gap-1 transition-colors cursor-pointer ${
                  speedMultiplier > 1
                    ? 'bg-[#dafbe1] border-[#4ac26b] text-[#1a7f37] font-semibold'
                    : 'border-[#d0d7de] bg-[#ffffff] hover:bg-[#f6f8fa] text-[#1f2328]'
                }`}
              >
                <FastForward className="w-3 h-3" />
                <span>{speedMultiplier > 1 ? '4x Speed' : 'Fast'}</span>
              </button>
            </>
          )}

          {isDone && (
            <button
              onClick={handleFinalCompletion}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#1a7f37] hover:bg-[#1f883d] rounded-md transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer animate-pulse"
            >
              <span>View Contributor Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 7-Stage Process List */}
      <div className="mt-6 border border-[#d0d7de] rounded-md bg-[#ffffff] divide-y divide-[#d0d7de] shadow-2xs">
        {stages.map((stage) => {
          const isCurrent = stage.status === 'running' && !errorInfo;
          const isComplete = stage.status === 'completed';
          const isPending = stage.status === 'pending';

          return (
            <div
              key={stage.id}
              className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                isCurrent ? 'bg-[#f6f8fa]' : 'bg-[#ffffff]'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isComplete && <CheckCircle2 className="w-4 h-4 text-[#1a7f37]" />}
                  {isCurrent && <Loader2 className="w-4 h-4 text-[#0969da] animate-spin" />}
                  {isPending && <span className="w-4 h-4 rounded-full border border-[#d0d7de] inline-block"></span>}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1f2328]">
                      {stage.id}. {stage.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-mono font-medium text-[#0969da] bg-[#ddf4ff] px-1.5 py-0.5 rounded">
                        running
                      </span>
                    )}
                    {isComplete && (
                      <span className="text-[10px] font-mono font-medium text-[#1a7f37] bg-[#dafbe1] px-1.5 py-0.5 rounded">
                        done
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#57606a] mt-0.5">{stage.detail}</p>
                </div>
              </div>

              <div className="text-xs font-mono text-[#57606a] whitespace-nowrap">
                {isComplete ? 'OK' : isCurrent ? 'active' : 'queued'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Real-Time Console Output */}
      <div className="mt-6 border border-[#d0d7de] rounded-md bg-[#1f2328] text-white shadow-2xs overflow-hidden">
        <div className="px-4 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-xs text-[#8b949e]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span className="font-mono text-[11px]">gitcontrib analysis runner</span>
            {isFetchingLive && (
              <span className="text-[10px] text-[#7ee787] flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7ee787] animate-ping"></span>
                streaming GitHub API
              </span>
            )}
          </div>
          <span className="font-mono text-[11px]">{allLogs.length} events logged</span>
        </div>

        <div className="p-4 font-mono text-xs text-[#e6edf3] h-48 overflow-y-auto space-y-1.5 bg-[#0d1117]">
          {allLogs.length === 0 ? (
            <div className="text-[#8b949e] italic">Initializing analysis environment...</div>
          ) : (
            allLogs.map((line, i) => (
              <div
                key={i}
                className={
                  line.includes('[STAGE')
                    ? 'text-[#58a6ff] font-semibold'
                    : line.includes('[ERROR')
                    ? 'text-[#ff7b72] font-semibold'
                    : line.includes('HTTP 200') || line.includes('verified') || line.includes('completed') || line.includes('Live data')
                    ? 'text-[#7ee787]'
                    : line.includes('Warning') || line.includes('rate limit')
                    ? 'text-[#f2cc60]'
                    : 'text-[#8b949e]'
                }
              >
                {line}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
