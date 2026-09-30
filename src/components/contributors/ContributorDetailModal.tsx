import React, { useState } from 'react';
import { X, GitCommit, Calendar, Clock, PlusCircle, MinusCircle, FileText, CheckCircle2, Layers, BarChart2 } from 'lucide-react';
import { Contributor, MLCluster } from '../../types';
import { ML_CLUSTERS } from '../../data/mockRepositories';

interface ContributorDetailModalProps {
  contributor: Contributor | null;
  onClose: () => void;
  onSelectAnotherContributor?: (contributor: Contributor) => void;
}

export const ContributorDetailModal: React.FC<ContributorDetailModalProps> = ({
  contributor,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'characteristics' | 'punchcard'>('timeline');

  if (!contributor) return null;

  const cluster = ML_CLUSTERS[contributor.clusterId];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#ffffff] border border-[#d0d7de] rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#d0d7de] bg-[#f6f8fa] flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <img
              src={contributor.avatarUrl}
              alt={contributor.name}
              className="w-12 h-12 rounded-full border border-[#d0d7de] bg-white mt-0.5"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-bold text-[#1f2328]">{contributor.name}</h3>
                <span className="text-xs font-mono text-[#57606a]">@{contributor.login}</span>
                <span className="text-xs text-[#57606a]">·</span>
                <span className="text-xs text-[#57606a]">{contributor.email}</span>
              </div>

              {/* Neutral Contribution Pattern Label */}
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#57606a]">Contribution Pattern:</span>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border"
                  style={{
                    backgroundColor: cluster.accentBg,
                    color: cluster.color,
                    borderColor: cluster.accentBorder
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cluster.color }}></span>
                  <span>{cluster.name}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#57606a] hover:text-[#1f2328] p-1.5 rounded-md hover:bg-[#eaeef2] transition-colors cursor-pointer"
            aria-label="Close contributor details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="border-b border-[#d0d7de] px-5 bg-[#ffffff] flex items-center gap-6 text-xs font-medium text-[#57606a]">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-[#fd8c73] text-[#1f2328] font-semibold'
                : 'border-transparent hover:text-[#1f2328]'
            }`}
          >
            Activity Timeline & Commits ({contributor.commitCount})
          </button>

          <button
            onClick={() => setActiveTab('characteristics')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'characteristics'
                ? 'border-[#fd8c73] text-[#1f2328] font-semibold'
                : 'border-transparent hover:text-[#1f2328]'
            }`}
          >
            Activity Characteristics & Metrics
          </button>

          <button
            onClick={() => setActiveTab('punchcard')}
            className={`py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'punchcard'
                ? 'border-[#fd8c73] text-[#1f2328] font-semibold'
                : 'border-transparent hover:text-[#1f2328]'
            }`}
          >
            Commit Cadence Punchcard (24x7)
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Statistical Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            <div className="p-2.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
              <span className="text-[10px] text-[#57606a] block">Commit Count</span>
              <span className="text-base font-bold font-mono text-[#1f2328] tabular-nums">
                {contributor.commitCount}
              </span>
            </div>
            <div className="p-2.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
              <span className="text-[10px] text-[#57606a] block">Active Days</span>
              <span className="text-base font-bold font-mono text-[#1f2328] tabular-nums">
                {contributor.activeDays} d
              </span>
            </div>
            <div className="p-2.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
              <span className="text-[10px] text-[#57606a] block">Duration Span</span>
              <span className="text-base font-bold font-mono text-[#1f2328] tabular-nums">
                {contributor.contributionDurationDays} d
              </span>
            </div>
            <div className="p-2.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
              <span className="text-[10px] text-[#57606a] block">Lines Added</span>
              <span className="text-base font-bold font-mono text-[#1a7f37] tabular-nums">
                +{contributor.linesAdded.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
              <span className="text-[10px] text-[#57606a] block">Lines Deleted</span>
              <span className="text-base font-bold font-mono text-[#cf222e] tabular-nums">
                -{contributor.linesDeleted.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
              <span className="text-[10px] text-[#57606a] block">Total Lines Changed</span>
              <span className="text-base font-bold font-mono text-[#1f2328] tabular-nums">
                {contributor.totalLinesChanged.toLocaleString()}
              </span>
            </div>
            <div className="p-2.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md">
              <span className="text-[10px] text-[#57606a] block">Files Touched</span>
              <span className="text-base font-bold font-mono text-[#1f2328] tabular-nums">
                {contributor.filesChanged}
              </span>
            </div>
          </div>

          {/* Tab 1: Chronological Activity Timeline */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#57606a] pb-2 border-b border-[#d0d7de]">
                <span>Chronological commit log with Git diff numstats</span>
                <span className="font-mono">
                  {contributor.firstCommitDate} → {contributor.lastCommitDate}
                </span>
              </div>

              <div className="space-y-3">
                {contributor.recentCommits.map((commit) => (
                  <div
                    key={commit.sha}
                    className="p-3.5 border border-[#d0d7de] rounded-md bg-[#ffffff] hover:border-[#0969da] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <GitCommit className="w-4 h-4 text-[#57606a] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-[#1f2328]">{commit.message}</p>
                          <p className="text-[11px] text-[#57606a] mt-1">
                            Authored on <span className="font-mono">{commit.date}</span> · {commit.filesChanged} files modified
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs shrink-0 self-end sm:self-center">
                        <span className="font-mono text-[#1a7f37] font-semibold">+{commit.additions}</span>
                        <span className="font-mono text-[#cf222e] font-semibold">-{commit.deletions}</span>
                        <span className="font-mono text-[11px] bg-[#f6f8fa] border border-[#d0d7de] px-2 py-0.5 rounded text-[#0969da]">
                          {commit.sha}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Weekly Commit Trend */}
              <div className="pt-4 border-t border-[#d0d7de]">
                <h4 className="text-xs font-semibold text-[#1f2328] mb-3">Weekly Commit Volume Breakdown</h4>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {contributor.weeklyActivity.map((w) => (
                    <div key={w.week} className="p-2 border border-[#d0d7de] rounded bg-[#f6f8fa] text-center">
                      <span className="text-[10px] text-[#57606a] block">{w.week}</span>
                      <span className="text-xs font-bold font-mono text-[#1f2328] block mt-0.5">
                        {w.commits}
                      </span>
                      <span className="text-[9px] font-mono text-[#1a7f37] block">
                        +{w.additions}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Activity Characteristics & Machine Learning Vectors */}
          {activeTab === 'characteristics' && (
            <div className="space-y-6">
              {/* Pattern Explanation Box */}
              <div className="p-4 border border-[#d0d7de] rounded-md bg-[#f6f8fa]">
                <h4 className="text-xs font-semibold text-[#1f2328]">
                  Pattern Profile: {cluster.name}
                </h4>
                <p className="text-xs text-[#57606a] mt-1 leading-relaxed">
                  {cluster.description}
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#57606a] font-medium block">Commit Cadence:</span>
                    <span className="text-[#1f2328] font-mono text-[11px]">{cluster.characteristics.commitCadence}</span>
                  </div>
                  <div>
                    <span className="text-[#57606a] font-medium block">Code Churn Profile:</span>
                    <span className="text-[#1f2328] font-mono text-[11px]">{cluster.characteristics.codeChurnProfile}</span>
                  </div>
                  <div>
                    <span className="text-[#57606a] font-medium block">File Scope:</span>
                    <span className="text-[#1f2328] font-mono text-[11px]">{cluster.characteristics.fileSpread}</span>
                  </div>
                  <div>
                    <span className="text-[#57606a] font-medium block">Temporal Pattern:</span>
                    <span className="text-[#1f2328] font-mono text-[11px]">{cluster.characteristics.temporalPattern}</span>
                  </div>
                </div>
              </div>

              {/* Feature Vectors Display */}
              <div>
                <h4 className="text-xs font-semibold text-[#1f2328] mb-3">
                  Extracted Machine Learning Feature Vectors
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#57606a]">Commit Frequency (commits / active week)</span>
                      <span className="font-mono font-semibold text-[#1f2328]">{contributor.features.commitFrequency.toFixed(1)} / wk</span>
                    </div>
                    <div className="w-full bg-[#f6f8fa] border border-[#d0d7de] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1f2328] h-full rounded-full" style={{ width: `${Math.min(100, contributor.features.commitFrequency * 10)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#57606a]">Active Span Ratio (active days / total duration)</span>
                      <span className="font-mono font-semibold text-[#1f2328]">{(contributor.features.activeSpanRatio * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-[#f6f8fa] border border-[#d0d7de] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1f2328] h-full rounded-full" style={{ width: `${contributor.features.activeSpanRatio * 100}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#57606a]">Code Churn Asymmetry (additions / deletions)</span>
                      <span className="font-mono font-semibold text-[#1f2328]">{contributor.features.codeChurnRatio.toFixed(2)} : 1</span>
                    </div>
                    <div className="w-full bg-[#f6f8fa] border border-[#d0d7de] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1f2328] h-full rounded-full" style={{ width: `${Math.min(100, contributor.features.codeChurnRatio * 20)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#57606a]">Architectural File Spread Index (1 - 10)</span>
                      <span className="font-mono font-semibold text-[#1f2328]">{contributor.features.fileSpreadIndex.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-[#f6f8fa] border border-[#d0d7de] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1f2328] h-full rounded-full" style={{ width: `${contributor.features.fileSpreadIndex * 10}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#57606a]">Temporal Burstiness Score (0: steady, 1: bursty)</span>
                      <span className="font-mono font-semibold text-[#1f2328]">{contributor.features.burstinessScore.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-[#f6f8fa] border border-[#d0d7de] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#1f2328] h-full rounded-full" style={{ width: `${contributor.features.burstinessScore * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Types Breakdown */}
              <div className="pt-4 border-t border-[#d0d7de]">
                <h4 className="text-xs font-semibold text-[#1f2328] mb-3">
                  Modified File Subsystems & Extensions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {contributor.topFileTypes.map((ft) => (
                    <div key={ft.type} className="p-2.5 border border-[#d0d7de] rounded-md bg-[#ffffff] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#57606a]" />
                        <span className="font-medium text-[#1f2328]">{ft.type}</span>
                      </div>
                      <span className="font-mono text-[#57606a]">{ft.count} files ({ft.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Commit Punchcard (Day of Week vs Hour of Day) */}
          {activeTab === 'punchcard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#57606a]">
                <span>24x7 Commit Hour Distribution Matrix</span>
                <div className="flex items-center gap-2 text-[11px]">
                  <span>Less</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#ebedf0] border border-[#d0d7de]"></span>
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#9be9a8]"></span>
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#40c463]"></span>
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#30a14e]"></span>
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#216e39]"></span>
                  </div>
                  <span>More</span>
                </div>
              </div>

              {/* Punchcard Grid */}
              <div className="border border-[#d0d7de] rounded-md p-4 bg-[#f6f8fa] overflow-x-auto">
                <div className="min-w-[500px]">
                  {/* Hours Header */}
                  <div className="flex items-center text-[10px] font-mono text-[#57606a] mb-1.5 pl-10">
                    {Array.from({ length: 24 }).map((_, h) => (
                      <div key={h} className="flex-1 text-center">
                        {h % 3 === 0 ? `${h}h` : ''}
                      </div>
                    ))}
                  </div>

                  {/* Days Rows */}
                  {daysOfWeek.map((day, dayIdx) => (
                    <div key={day} className="flex items-center gap-1.5 mb-1.5">
                      <span className="w-8 text-[11px] font-mono text-[#57606a] text-right">
                        {day}
                      </span>
                      <div className="flex-1 flex items-center gap-1">
                        {contributor.punchcard[dayIdx].map((val, hourIdx) => {
                          let bgColor = '#ebedf0';
                          if (val > 10) bgColor = '#216e39';
                          else if (val > 6) bgColor = '#30a14e';
                          else if (val > 3) bgColor = '#40c463';
                          else if (val > 0) bgColor = '#9be9a8';

                          return (
                            <div
                              key={hourIdx}
                              title={`${day} at ${hourIdx}:00 - ${val} commits`}
                              className="flex-1 h-4 rounded-xs border border-[rgba(0,0,0,0.06)] cursor-pointer hover:scale-110 transition-transform"
                              style={{ backgroundColor: bgColor }}
                            ></div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-[#57606a]">
                Commit timestamps normalized to repository UTC offset. Intensity indicates aggregated commit concentration.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#d0d7de] bg-[#f6f8fa] flex justify-between items-center text-xs">
          <span className="text-[#57606a]">
            Identity verified from Git log author email: {contributor.email}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#ffffff] border border-[#d0d7de] hover:bg-[#eaeef2] text-[#1f2328] font-medium rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
