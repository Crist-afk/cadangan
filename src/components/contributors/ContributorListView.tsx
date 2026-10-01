import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ChevronRight, GitCommit, FileText, CheckCircle2 } from 'lucide-react';
import { Contributor, MLCluster } from '../../types';
import { ML_CLUSTERS, getClustersWithCounts } from '../../data/mockRepositories';
import { StaggerContainer } from '../animations/StaggerContainer';

interface ContributorListViewProps {
  contributors: Contributor[];
  onSelectContributor: (contributor: Contributor) => void;
}

type SortField = 'commits' | 'activeDays' | 'linesChanged' | 'linesAdded' | 'linesDeleted' | 'duration';
type SortOrder = 'asc' | 'desc';

export const ContributorListView: React.FC<ContributorListViewProps> = ({
  contributors,
  onSelectContributor
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('commits');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const clusters = getClustersWithCounts(contributors);
  const totalCommitsInRepo = contributors.reduce((sum, c) => sum + c.commitCount, 0);

  const filteredContributors = useMemo(() => {
    return contributors
      .filter((c) => {
        const matchesQuery =
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.login.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCluster =
          selectedClusterFilter === 'all' || c.clusterId === selectedClusterFilter;
        return matchesQuery && matchesCluster;
      })
      .sort((a, b) => {
        let valA = 0;
        let valB = 0;
        switch (sortField) {
          case 'commits':
            valA = a.commitCount;
            valB = b.commitCount;
            break;
          case 'activeDays':
            valA = a.activeDays;
            valB = b.activeDays;
            break;
          case 'linesChanged':
            valA = a.totalLinesChanged;
            valB = b.totalLinesChanged;
            break;
          case 'linesAdded':
            valA = a.linesAdded;
            valB = b.linesAdded;
            break;
          case 'linesDeleted':
            valA = a.linesDeleted;
            valB = b.linesDeleted;
            break;
          case 'duration':
            valA = a.contributionDurationDays;
            valB = b.contributionDurationDays;
            break;
        }
        return sortOrder === 'desc' ? valB - valA : valA - valB;
      });
  }, [contributors, searchQuery, selectedClusterFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-[#ffffff] min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d0d7de]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1f2328]">
            Repository Contributors
          </h2>
          <p className="text-xs sm:text-sm text-[#57606a] mt-0.5">
            Statistical breakdown of active contributors derived from Git commit signatures.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#57606a]">
          <span className="font-mono">{filteredContributors.length} of {contributors.length} displayed</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#57606a]">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contributor by name, handle, or email..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#ffffff] border border-[#d0d7de] rounded-md text-[#1f2328] placeholder:text-[#8c959f] focus:outline-none focus:ring-1 focus:ring-[#0969da]"
          />
        </div>

        {/* Pattern Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-medium bg-[#f6f8fa] p-1 border border-[#d0d7de] rounded-md">
          <button
            onClick={() => setSelectedClusterFilter('all')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
              selectedClusterFilter === 'all'
                ? 'bg-white text-[#1f2328] font-semibold shadow-2xs'
                : 'text-[#57606a] hover:text-[#1f2328]'
            }`}
          >
            All Patterns ({contributors.length})
          </button>
          {clusters.map((cl) => (
            <button
              key={cl.id}
              onClick={() => setSelectedClusterFilter(cl.id)}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                selectedClusterFilter === cl.id
                  ? 'bg-white text-[#1f2328] font-semibold shadow-2xs'
                  : 'text-[#57606a] hover:text-[#1f2328]'
              }`}
            >
              {cl.shortTag} ({cl.contributorCount})
            </button>
          ))}
        </div>
      </div>

      {/* Contributors Data Table */}
      <div className="border border-[#d0d7de] rounded-md overflow-hidden bg-[#ffffff] shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f6f8fa] border-b border-[#d0d7de] text-[#57606a] font-semibold">
                <th className="py-3 px-4">Contributor</th>
                <th className="py-3 px-4">Contribution Pattern</th>
                <th
                  onClick={() => handleSort('commits')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1f2328] select-none"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Commits</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('activeDays')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1f2328] select-none"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Active Days</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('duration')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1f2328] select-none"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Duration</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('linesAdded')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1f2328] select-none"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Lines Added</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('linesDeleted')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1f2328] select-none"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Lines Deleted</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('linesChanged')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-[#1f2328] select-none"
                >
                  <div className="inline-flex items-center gap-1">
                    <span>Total Churn</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d0d7de]">
              {filteredContributors.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#57606a]">
                    No contributors matching &ldquo;{searchQuery}&rdquo;
                  </td>
                </tr>
              ) : (
                filteredContributors.map((c) => {
                  const cluster = ML_CLUSTERS[c.clusterId];
                  const commitPct = Math.round((c.commitCount / totalCommitsInRepo) * 100);

                  return (
                    <tr
                      key={c.id}
                      onClick={() => onSelectContributor(c)}
                      className="hover:bg-[#f6f8fa] transition-colors cursor-pointer group"
                    >
                      {/* Contributor Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatarUrl}
                            alt={c.name}
                            className="w-7 h-7 rounded-full border border-[#d0d7de]"
                          />
                          <div>
                            <div className="font-semibold text-[#1f2328] group-hover:text-[#0969da] transition-colors">
                              {c.name}
                            </div>
                            <div className="text-[11px] text-[#57606a] font-mono">@{c.login}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contribution Pattern Tag */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                          style={{
                            backgroundColor: cluster.accentBg,
                            color: cluster.color,
                            borderColor: cluster.accentBorder
                          }}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: cluster.color }}
                          ></span>
                          <span>{cluster.shortTag}</span>
                        </span>
                      </td>

                      {/* Commits */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono font-semibold text-[#1f2328] tabular-nums">
                          {c.commitCount}
                        </div>
                        <div className="text-[10px] text-[#57606a] font-mono tabular-nums">
                          {commitPct}% of repo
                        </div>
                      </td>

                      {/* Active Days */}
                      <td className="py-3 px-4 text-right font-mono text-[#1f2328] tabular-nums">
                        {c.activeDays} d
                      </td>

                      {/* Duration */}
                      <td className="py-3 px-4 text-right font-mono text-[#57606a] tabular-nums">
                        {c.contributionDurationDays} d
                      </td>

                      {/* Lines Added */}
                      <td className="py-3 px-4 text-right font-mono text-[#1a7f37] font-medium tabular-nums">
                        +{c.linesAdded.toLocaleString()}
                      </td>

                      {/* Lines Deleted */}
                      <td className="py-3 px-4 text-right font-mono text-[#cf222e] font-medium tabular-nums">
                        -{c.linesDeleted.toLocaleString()}
                      </td>

                      {/* Total Churn */}
                      <td className="py-3 px-4 text-right font-mono font-semibold text-[#1f2328] tabular-nums">
                        {c.totalLinesChanged.toLocaleString()}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectContributor(c);
                          }}
                          className="px-2 py-1 text-[11px] font-medium text-[#0969da] hover:bg-[#ddf4ff] rounded border border-[#d0d7de] transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
