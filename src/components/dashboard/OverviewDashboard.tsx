import React, { useState } from 'react';
import { GitCommit, Users, Calendar, Clock, PlusCircle, MinusCircle, FileCode, Filter, ChevronRight, Layers, BarChart2 } from 'lucide-react';
import { Repository, Contributor, MLCluster } from '../../types';
import { getClustersWithCounts } from '../../data/mockRepositories';

interface OverviewDashboardProps {
  repo: Repository;
  contributors: Contributor[];
  onSelectContributor: (contributor: Contributor) => void;
  onNavigateToML: () => void;
  onNavigateToContributors: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  repo,
  contributors,
  onSelectContributor,
  onNavigateToML,
  onNavigateToContributors
}) => {
  const [timeRange, setTimeRange] = useState<'all' | '90d' | '30d'>('all');
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  const clusters = getClustersWithCounts(contributors);

  // Aggregated weekly data across contributors
  const weeklyData = React.useMemo(() => {
    if (contributors.length > 0 && contributors[0].weeklyActivity && contributors[0].weeklyActivity.length > 0) {
      return contributors[0].weeklyActivity.map((w, idx) => {
        let commitsSum = 0;
        let addSum = 0;
        let delSum = 0;
        contributors.forEach((c) => {
          if (c.weeklyActivity && c.weeklyActivity[idx]) {
            commitsSum += c.weeklyActivity[idx].commits;
            addSum += c.weeklyActivity[idx].additions;
            delSum += c.weeklyActivity[idx].deletions;
          }
        });
        return {
          week: w.week,
          commits: commitsSum,
          additions: addSum,
          deletions: delSum
        };
      });
    }
    return [];
  }, [contributors]);

  const maxWeeklyCommits = weeklyData.length > 0 ? Math.max(...weeklyData.map((w) => w.commits), 1) : 1;

  return (
    <div className="bg-[#ffffff] min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Title & Scope Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d0d7de]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1f2328]">
            Contributor Analysis Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-[#57606a] mt-0.5">
            Git history statistical decomposition across <span className="font-mono font-medium text-[#1f2328]">{contributors.length} contributors</span> and <span className="font-mono font-medium text-[#1f2328]">{repo.totalCommits.toLocaleString()} commits</span>.
          </p>
        </div>

        {/* Time Window Selector */}
        <div className="flex items-center gap-1 p-1 bg-[#f6f8fa] border border-[#d0d7de] rounded-md text-xs font-medium">
          <button
            onClick={() => setTimeRange('all')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              timeRange === 'all'
                ? 'bg-white text-[#1f2328] font-semibold shadow-2xs'
                : 'text-[#57606a] hover:text-[#1f2328]'
            }`}
          >
            All Time (365d)
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              timeRange === '90d'
                ? 'bg-white text-[#1f2328] font-semibold shadow-2xs'
                : 'text-[#57606a] hover:text-[#1f2328]'
            }`}
          >
            Last 90 Days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${
              timeRange === '30d'
                ? 'bg-white text-[#1f2328] font-semibold shadow-2xs'
                : 'text-[#57606a] hover:text-[#1f2328]'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Key Metrics: Non-Gamified Data Analysis per User Instruction */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="p-3.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
          <span className="text-[11px] font-medium text-[#57606a] block">Total Contributors</span>
          <div className="mt-1 text-xl font-bold font-mono text-[#1f2328] tabular-nums">
            {repo.totalContributors}
          </div>
          <span className="text-[10px] text-[#57606a] mt-0.5 block">Unique author emails</span>
        </div>

        <div className="p-3.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
          <span className="text-[11px] font-medium text-[#57606a] block">Total Commits</span>
          <div className="mt-1 text-xl font-bold font-mono text-[#1f2328] tabular-nums">
            {repo.totalCommits.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#57606a] mt-0.5 block">Reachable branch HEAD</span>
        </div>

        <div className="p-3.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
          <span className="text-[11px] font-medium text-[#57606a] block">Active Days</span>
          <div className="mt-1 text-xl font-bold font-mono text-[#1f2328] tabular-nums">
            {repo.activeDays} <span className="text-xs font-normal text-[#57606a]">days</span>
          </div>
          <span className="text-[10px] text-[#57606a] mt-0.5 block">≥1 commit landed</span>
        </div>

        <div className="p-3.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
          <span className="text-[11px] font-medium text-[#57606a] block">Contribution Span</span>
          <div className="mt-1 text-xl font-bold font-mono text-[#1f2328] tabular-nums">
            {repo.contributionDurationDays} <span className="text-xs font-normal text-[#57606a]">days</span>
          </div>
          <span className="text-[10px] text-[#57606a] mt-0.5 block">First to latest commit</span>
        </div>

        <div className="p-3.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
          <span className="text-[11px] font-medium text-[#57606a] block">Lines Added</span>
          <div className="mt-1 text-xl font-bold font-mono text-[#1a7f37] tabular-nums">
            +{repo.linesAdded.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#57606a] mt-0.5 block">Insertions recorded</span>
        </div>

        <div className="p-3.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
          <span className="text-[11px] font-medium text-[#57606a] block">Lines Deleted</span>
          <div className="mt-1 text-xl font-bold font-mono text-[#cf222e] tabular-nums">
            -{repo.linesDeleted.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#57606a] mt-0.5 block">Deletions & cleanups</span>
        </div>

        <div className="p-3.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
          <span className="text-[11px] font-medium text-[#57606a] block">Total Lines Changed</span>
          <div className="mt-1 text-xl font-bold font-mono text-[#1f2328] tabular-nums">
            {repo.totalLinesChanged.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#57606a] mt-0.5 block">Aggregate code churn</span>
        </div>
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contributor Activity Over Time (2 cols wide) */}
        <div className="lg:col-span-2 border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#1f2328]">
                Contributor Activity Over Time
              </h3>
              <p className="text-xs text-[#57606a]">
                Weekly commit volume and code churn intensity across repository branches.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#57606a]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#1f2328] rounded-xs"></span>
                <span>Commits</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#1a7f37] rounded-xs"></span>
                <span>Additions</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#cf222e] rounded-xs"></span>
                <span>Deletions</span>
              </span>
            </div>
          </div>

          {/* SVG Bar & Curve Chart */}
          <div className="h-60 w-full relative pt-4 pb-6">
            <div className="h-full flex items-end gap-3 sm:gap-6 justify-between px-2">
              {weeklyData.map((item, index) => {
                const heightPercent = Math.round((item.commits / maxWeeklyCommits) * 100);
                const isHovered = hoveredWeek === index;

                return (
                  <div
                    key={item.week}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredWeek(index)}
                    onMouseLeave={() => setHoveredWeek(null)}
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-2 bg-[#1f2328] text-white text-[11px] p-2 rounded shadow-md z-20 whitespace-nowrap pointer-events-none">
                        <div className="font-semibold">{item.week}</div>
                        <div className="font-mono text-[#7ee787]">{item.commits} commits</div>
                        <div className="font-mono text-xs">
                          +{item.additions.toLocaleString()} / -{item.deletions.toLocaleString()} lines
                        </div>
                      </div>
                    )}

                    {/* Bar visualization */}
                    <div className="w-full max-w-[36px] bg-[#f6f8fa] border border-[#d0d7de] rounded-t flex flex-col justify-end overflow-hidden h-full">
                      <div
                        className={`w-full transition-all duration-200 ${
                          isHovered ? 'bg-[#0969da]' : 'bg-[#1f2328]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      ></div>
                    </div>

                    <span className="text-[10px] font-mono text-[#57606a] mt-2 whitespace-nowrap">
                      {item.week}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lines Added vs Deleted & Churn Ratio (1 col) */}
        <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[#1f2328]">
              Lines Added vs Deleted
            </h3>
            <p className="text-xs text-[#57606a] mt-0.5">
              Repository net code churn balance.
            </p>

            {/* Differential Bar */}
            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#57606a]">Additions (+)</span>
                  <span className="font-mono font-semibold text-[#1a7f37]">
                    +{repo.linesAdded.toLocaleString()} ({Math.round((repo.linesAdded / repo.totalLinesChanged) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-[#f6f8fa] border border-[#d0d7de] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1a7f37] h-full rounded-full"
                    style={{
                      width: `${Math.round((repo.linesAdded / repo.totalLinesChanged) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#57606a]">Deletions (-)</span>
                  <span className="font-mono font-semibold text-[#cf222e]">
                    -{repo.linesDeleted.toLocaleString()} ({Math.round((repo.linesDeleted / repo.totalLinesChanged) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-[#f6f8fa] border border-[#d0d7de] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-[#cf222e] h-full rounded-full"
                    style={{
                      width: `${Math.round((repo.linesDeleted / repo.totalLinesChanged) * 100)}%`
                    }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#d0d7de] text-xs text-[#57606a] space-y-2">
                <div className="flex justify-between">
                  <span>Churn Asymmetry Ratio:</span>
                  <span className="font-mono font-semibold text-[#1f2328]">
                    {(repo.linesAdded / (repo.linesDeleted || 1)).toFixed(2)} : 1
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Net Code Expansion:</span>
                  <span className="font-mono font-semibold text-[#1f2328]">
                    +{(repo.linesAdded - repo.linesDeleted).toLocaleString()} lines
                  </span>
                </div>
                <p className="text-[11px] text-[#57606a] leading-tight pt-1">
                  A balanced churn ratio (1.0–2.0) typically indicates healthy architectural refactoring alongside feature growth.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#d0d7de]">
            <button
              onClick={onNavigateToContributors}
              className="text-xs text-[#0969da] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Examine individual contributor churn</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Commit Distribution & Contributor Pattern Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commit Distribution Across Contributors */}
        <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#1f2328]">
                Commit Distribution Across Contributors
              </h3>
              <p className="text-xs text-[#57606a]">
                Proportion of commits contributed by top active authors.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {contributors.slice(0, 5).map((c) => {
              const commitPct = Math.round((c.commitCount / repo.totalCommits) * 100);
              return (
                <div
                  key={c.id}
                  onClick={() => onSelectContributor(c)}
                  className="p-2.5 rounded-md hover:bg-[#f6f8fa] border border-transparent hover:border-[#d0d7de] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={c.avatarUrl}
                        alt={c.name}
                        className="w-5 h-5 rounded-full border border-[#d0d7de]"
                      />
                      <span className="font-semibold text-[#1f2328] group-hover:text-[#0969da]">
                        {c.name}
                      </span>
                      <span className="text-[#57606a] font-mono text-[11px]">@{c.login}</span>
                    </div>
                    <div className="font-mono text-xs text-[#1f2328]">
                      {c.commitCount} commits <span className="text-[#57606a]">({commitPct}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-[#f6f8fa] border border-[#d0d7de] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1f2328] group-hover:bg-[#0969da] h-full rounded-full transition-colors"
                      style={{ width: `${commitPct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#d0d7de] flex justify-between items-center text-xs">
            <span className="text-[#57606a]">
              Showing top 5 of {contributors.length} contributors
            </span>
            <button
              onClick={onNavigateToContributors}
              className="text-[#0969da] hover:underline font-medium cursor-pointer"
            >
              View all contributors table →
            </button>
          </div>
        </div>

        {/* Contributor Pattern Clusters (Machine Learning Preview) */}
        <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#1f2328]">
                  Contributor Pattern Clusters
                </h3>
                <p className="text-xs text-[#57606a]">
                  Behavioral activity patterns discovered via unsupervised K-Means clustering.
                </p>
              </div>
              <button
                onClick={onNavigateToML}
                className="text-xs font-semibold text-[#0969da] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>ML Methodology</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clusters.map((cl) => (
                <div
                  key={cl.id}
                  className="p-3 border border-[#d0d7de] rounded-md bg-[#f6f8fa] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cl.color }}
                        ></span>
                        <span className="text-xs font-semibold text-[#1f2328]">{cl.shortTag}</span>
                      </div>
                      <span className="text-xs font-mono font-semibold text-[#1f2328] bg-white border border-[#d0d7de] px-1.5 py-0.5 rounded">
                        {cl.contributorCount}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#57606a] mt-2 line-clamp-2">
                      {cl.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#d0d7de]/70 text-[10px] font-mono text-[#57606a]">
                    Cadence: {cl.centroid.commitFrequency} / week
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-3 rounded-md bg-[#f6f8fa] border border-[#d0d7de] text-xs text-[#57606a]">
            <span className="font-semibold text-[#1f2328]">Note on Pattern Analysis:</span>{' '}
            Clusters are derived from objective Git logs (cadence, churn, file spread) to identify workflow modalities, not personal capability or grading.
          </div>
        </div>
      </div>
    </div>
  );
};
