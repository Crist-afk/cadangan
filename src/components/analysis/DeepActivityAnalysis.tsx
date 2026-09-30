import React, { useState } from 'react';
import { GitCommit, Calendar, Clock, GitPullRequest, Code, FolderGit2, BarChart3 } from 'lucide-react';
import { Repository, Contributor } from '../../types';

interface DeepActivityAnalysisProps {
  repo: Repository;
  contributors: Contributor[];
  onSelectContributor: (contributor: Contributor) => void;
}

export const DeepActivityAnalysis: React.FC<DeepActivityAnalysisProps> = ({
  repo,
  contributors,
  onSelectContributor
}) => {
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('all');

  // Directory / Subsystem breakdown data
  const subsystems = [
    { name: 'Core Engine (/src/core)', files: 48, commits: 540, additions: 68400, deletions: 21200, pct: 38 },
    { name: 'UI & Visuals (/src/components)', files: 62, commits: 410, additions: 52100, deletions: 12400, pct: 29 },
    { name: 'Analytics & ML (/src/ml)', files: 24, commits: 260, additions: 34200, deletions: 14100, pct: 18 },
    { name: 'Tests & Benchmarks (/tests)', files: 35, commits: 140, additions: 18500, deletions: 9400, pct: 10 },
    { name: 'Config & CI (/.github)', files: 12, commits: 70, additions: 11320, deletions: 5310, pct: 5 }
  ];

  // Hourly commit volume (aggregated across all contributors)
  const hourlyData = [
    { hour: '00', count: 12 }, { hour: '02', count: 8 }, { hour: '04', count: 4 },
    { hour: '06', count: 18 }, { hour: '08', count: 94 }, { hour: '10', count: 186 },
    { hour: '12', count: 142 }, { hour: '14', count: 218 }, { hour: '16', count: 242 },
    { hour: '18', count: 196 }, { hour: '20', count: 164 }, { hour: '22', count: 86 }
  ];
  const maxHourly = Math.max(...hourlyData.map(h => h.count));

  // Day of week distribution
  const weekdayData = [
    { day: 'Monday', count: 264, pct: 19 },
    { day: 'Tuesday', count: 310, pct: 22 },
    { day: 'Wednesday', count: 345, pct: 24 },
    { day: 'Thursday', count: 278, pct: 20 },
    { day: 'Friday', count: 165, pct: 12 },
    { day: 'Saturday', count: 34, pct: 2 },
    { day: 'Sunday', count: 24, pct: 1 }
  ];

  return (
    <div className="bg-[#ffffff] min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d0d7de]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1f2328]">
            Deep Activity & Temporal Analysis
          </h2>
          <p className="text-xs sm:text-sm text-[#57606a] mt-0.5">
            Temporal cadence, weekday distribution, and directory subsystem modifications.
          </p>
        </div>
      </div>

      {/* Row 1: Hourly Distribution & Weekday Cadence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Distribution */}
        <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#1f2328]">
                Hourly Commit Cadence (24-Hour Cycle)
              </h3>
              <p className="text-xs text-[#57606a]">
                Aggregated commit time-of-day across all active branches.
              </p>
            </div>
            <Clock className="w-4 h-4 text-[#57606a]" />
          </div>

          <div className="h-48 flex items-end gap-2 pt-6 pb-2">
            {hourlyData.map((h) => {
              const heightPct = Math.round((h.count / maxHourly) * 100);
              return (
                <div key={h.hour} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] font-mono text-[#57606a] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                    {h.count}
                  </div>
                  <div className="w-full bg-[#f6f8fa] border border-[#d0d7de] rounded-t overflow-hidden h-full flex flex-col justify-end">
                    <div
                      className="bg-[#1f2328] group-hover:bg-[#0969da] transition-colors w-full rounded-t"
                      style={{ height: `${heightPct}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] font-mono text-[#57606a] mt-1.5">{h.hour}h</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#d0d7de] flex items-center justify-between text-xs text-[#57606a]">
            <span>Peak activity window: 14:00 - 18:00 UTC</span>
            <span className="font-mono">82% daytime commits</span>
          </div>
        </div>

        {/* Day of Week Breakdown */}
        <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-[#1f2328]">
                Weekday vs Weekend Commit Balance
              </h3>
              <p className="text-xs text-[#57606a]">
                Workday cadence distribution (Monday - Sunday).
              </p>
            </div>
            <Calendar className="w-4 h-4 text-[#57606a]" />
          </div>

          <div className="space-y-2.5">
            {weekdayData.map((w) => (
              <div key={w.day} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#1f2328]">{w.day}</span>
                  <span className="font-mono text-[#57606a]">
                    {w.count} commits ({w.pct}%)
                  </span>
                </div>
                <div className="w-full bg-[#f6f8fa] border border-[#d0d7de] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      w.day === 'Saturday' || w.day === 'Sunday'
                        ? 'bg-[#8c959f]'
                        : 'bg-[#1a7f37]'
                    }`}
                    style={{ width: `${w.pct * 4}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-[#d0d7de] text-xs text-[#57606a] flex justify-between">
            <span>Weekday commits: 97%</span>
            <span>Weekend commits: 3%</span>
          </div>
        </div>
      </div>

      {/* Row 2: Subsystem & Directory Churn Breakdown */}
      <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#1f2328]">
              Directory Subsystem Modification Spread
            </h3>
            <p className="text-xs text-[#57606a]">
              Volume of lines added and deleted by architectural layer.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {subsystems.map((sub) => (
            <div key={sub.name} className="p-3 border border-[#d0d7de] rounded-md bg-[#f6f8fa]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-[#57606a]" />
                  <span className="font-semibold text-[#1f2328]">{sub.name}</span>
                  <span className="text-[#57606a]">({sub.files} tracked files)</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-[#1a7f37]">+{sub.additions.toLocaleString()}</span>
                  <span className="text-[#cf222e]">-{sub.deletions.toLocaleString()}</span>
                  <span className="text-[#1f2328] font-semibold">{sub.commits} commits</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white border border-[#d0d7de] h-2 rounded-full overflow-hidden">
                <div className="bg-[#0969da] h-full rounded-full" style={{ width: `${sub.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
