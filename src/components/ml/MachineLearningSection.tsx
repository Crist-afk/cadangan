import React, { useState } from 'react';
import { Cpu, Layers, Download, CheckCircle2, Info, ArrowRight, Table, BarChart2 } from 'lucide-react';
import { Repository, Contributor, MLCluster } from '../../types';
import { getClustersWithCounts } from '../../data/mockRepositories';
import { StaggerContainer } from '../animations/StaggerContainer';

interface MachineLearningSectionProps {
  repo: Repository;
  contributors: Contributor[];
  onSelectContributor: (contributor: Contributor) => void;
}

export const MachineLearningSection: React.FC<MachineLearningSectionProps> = ({
  repo,
  contributors,
  onSelectContributor
}) => {
  const [xAxisFeature, setXAxisFeature] = useState<'commitFrequency' | 'activeSpanRatio' | 'burstinessScore'>('commitFrequency');
  const [yAxisFeature, setYAxisFeature] = useState<'codeChurnRatio' | 'fileSpreadIndex' | 'maintenanceRatio'>('codeChurnRatio');
  const [hoveredContributor, setHoveredContributor] = useState<Contributor | null>(null);

  const clusters = getClustersWithCounts(contributors);

  // Features list
  const featuresMeta = [
    {
      id: 'f1',
      name: 'Commit Frequency (f₁)',
      formula: 'commits / active_weeks',
      description: 'Measures continuous velocity during periods of active engagement.',
      unit: 'commits / week',
      weight: '25%'
    },
    {
      id: 'f2',
      name: 'Active Days Span Ratio (f₂)',
      formula: 'active_days / total_repository_span_days',
      description: 'Quantifies persistence across repository lifecycle versus localized bursts.',
      unit: '0.0 - 1.0 ratio',
      weight: '20%'
    },
    {
      id: 'f3',
      name: 'Code Churn Asymmetry (f₃)',
      formula: 'lines_added / (lines_deleted + 1)',
      description: 'Differentiates net-new feature additions from code refactoring or pruning.',
      unit: 'addition / deletion ratio',
      weight: '20%'
    },
    {
      id: 'f4',
      name: 'Architectural File Spread Index (f₄)',
      formula: 'count(unique_directory_subsystems_modified)',
      description: 'Identifies whether changes are localized to single components or cross-cutting.',
      unit: '1 - 10 scale',
      weight: '15%'
    },
    {
      id: 'f5',
      name: 'Temporal Burstiness Score (f₅)',
      formula: 'B = (σ_Δt - μ_Δt) / (σ_Δt + μ_Δt)',
      description: 'Distinguishes steady Poisson-like commit patterns from bursty sprint intervals.',
      unit: '-1.0 to 1.0 (0=steady, 1=bursty)',
      weight: '10%'
    },
    {
      id: 'f6',
      name: 'Maintenance vs Feature Ratio (f₆)',
      formula: '(doc_commits + test_commits) / total_commits',
      description: 'Proportion of modifications dedicated to testing, docs, and maintenance.',
      unit: '0.0 - 1.0 ratio',
      weight: '10%'
    }
  ];

  // Helper to compute SVG coordinates for scatter plot
  const plotWidth = 540;
  const plotHeight = 320;
  const padding = 45;

  const getCoordinates = (contributor: Contributor) => {
    let xVal = 0;
    let xMax = 10;
    if (xAxisFeature === 'commitFrequency') {
      xVal = contributor.features.commitFrequency;
      xMax = 10;
    } else if (xAxisFeature === 'activeSpanRatio') {
      xVal = contributor.features.activeSpanRatio;
      xMax = 1.0;
    } else if (xAxisFeature === 'burstinessScore') {
      xVal = contributor.features.burstinessScore;
      xMax = 1.0;
    }

    let yVal = 0;
    let yMax = 5.0;
    if (yAxisFeature === 'codeChurnRatio') {
      yVal = contributor.features.codeChurnRatio;
      yMax = 5.0;
    } else if (yAxisFeature === 'fileSpreadIndex') {
      yVal = contributor.features.fileSpreadIndex;
      yMax = 10.0;
    } else if (yAxisFeature === 'maintenanceRatio') {
      yVal = contributor.features.maintenanceRatio;
      yMax = 1.0;
    }

    const x = padding + (xVal / xMax) * (plotWidth - padding * 2);
    const y = plotHeight - padding - (yVal / yMax) * (plotHeight - padding * 2);
    return { x, y };
  };

  const handleDownloadDataset = () => {
    const header = 'Contributor,Login,Cluster,CommitCount,ActiveDays,CommitFrequency,ActiveSpanRatio,ChurnRatio,FileSpread,Burstiness\n';
    const rows = contributors.map(c => 
      `"${c.name}",${c.login},"${c.clusterId}",${c.commitCount},${c.activeDays},${c.features.commitFrequency},${c.features.activeSpanRatio},${c.features.codeChurnRatio},${c.features.fileSpreadIndex},${c.features.burstinessScore}`
    ).join('\n');
    
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${repo.name}-contributor-ml-dataset.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#ffffff] min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Title & Methodology Notice */}
      <div className="pb-4 border-b border-[#d0d7de]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold text-[#0969da] bg-[#ddf4ff] border border-[#54aeff] rounded-md mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>Unsupervised K-Means Pattern Discovery (k=4)</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#1f2328]">
              Machine Learning Analysis & Contributor Pattern Clustering
            </h2>
            <p className="text-xs sm:text-sm text-[#57606a] mt-0.5">
              Empirical modeling of behavioral activity characteristics derived from Git commit signatures and code churn.
            </p>
          </div>

          <button
            onClick={handleDownloadDataset}
            className="self-start sm:self-center px-3 py-1.5 text-xs font-medium text-[#1f2328] bg-[#f6f8fa] hover:bg-[#eaeef2] border border-[#d0d7de] rounded-md flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#57606a]" />
            <span>Export ML Dataset (CSV)</span>
          </button>
        </div>

        {/* Neutrality Disclaimer strictly per user instruction */}
        <div className="mt-4 p-3 border border-[#d0d7de] rounded-md bg-[#f6f8fa] flex items-start gap-2.5 text-xs text-[#57606a]">
          <Info className="w-4 h-4 text-[#0969da] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#1f2328]">Objective Pattern Framing:</strong> Machine Learning results classify workflow modalities and temporal rhythms (e.g. continuous cadence vs sprint bursts, maintenance vs new modules). These patterns describe how commits are distributed in Git history and do not measure individual competence, ranking, or software engineer quality.
          </p>
        </div>
      </div>

      {/* Section 1: Features Used in Model */}
      <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
        <h3 className="text-sm font-semibold text-[#1f2328] mb-1">
          1. Feature Engineering & Vector Specification
        </h3>
        <p className="text-xs text-[#57606a] mb-4">
          Six standardized behavioral features extracted from the Git commit log and unified diff streams.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {featuresMeta.map((feat, index) => (
            <div 
              key={feat.id} 
              className="stagger-item p-3.5 border border-[#d0d7de] rounded-md bg-[#f6f8fa]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1f2328]">{feat.name}</span>
                <span className="text-[10px] font-mono text-[#57606a] bg-white border border-[#d0d7de] px-1.5 py-0.5 rounded">
                  Weight: {feat.weight}
                </span>
              </div>
              <div className="mt-1.5 text-[11px] font-mono text-[#0969da] bg-white border border-[#d0d7de] px-2 py-1 rounded">
                {feat.formula}
              </div>
              <p className="text-[11px] text-[#57606a] mt-2 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: 2D Feature Cluster Projection (Interactive SVG Scatter Plot) */}
      <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#1f2328]">
              2. 2D Feature Space Cluster Projection
            </h3>
            <p className="text-xs text-[#57606a]">
              Interactive multidimensional projection of contributor vectors across chosen features.
            </p>
          </div>

          {/* Axis Selectors */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#57606a]">X-Axis:</span>
              <select
                value={xAxisFeature}
                onChange={(e) => setXAxisFeature(e.target.value as any)}
                className="bg-[#f6f8fa] border border-[#d0d7de] rounded px-2 py-1 text-xs font-medium text-[#1f2328] focus:outline-none"
              >
                <option value="commitFrequency">Commit Frequency</option>
                <option value="activeSpanRatio">Active Span Ratio</option>
                <option value="burstinessScore">Burstiness Score</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[#57606a]">Y-Axis:</span>
              <select
                value={yAxisFeature}
                onChange={(e) => setYAxisFeature(e.target.value as any)}
                className="bg-[#f6f8fa] border border-[#d0d7de] rounded px-2 py-1 text-xs font-medium text-[#1f2328] focus:outline-none"
              >
                <option value="codeChurnRatio">Churn Asymmetry Ratio</option>
                <option value="fileSpreadIndex">File Spread Index</option>
                <option value="maintenanceRatio">Maintenance Ratio</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scatter Plot Canvas */}
        <div className="relative border border-[#d0d7de] rounded-md bg-[#f6f8fa] p-4 flex flex-col items-center">
          <svg
            viewBox={`0 0 ${plotWidth} ${plotHeight}`}
            className="w-full max-w-[700px] h-[320px] select-none"
          >
            {/* Grid Lines */}
            <line x1={padding} y1={padding} x2={padding} y2={plotHeight - padding} stroke="#d0d7de" strokeWidth="1" />
            <line x1={padding} y1={plotHeight - padding} x2={plotWidth - padding} y2={plotHeight - padding} stroke="#d0d7de" strokeWidth="1" />

            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75].map((ratio) => {
              const y = plotHeight - padding - ratio * (plotHeight - padding * 2);
              return (
                <line
                  key={ratio}
                  x1={padding}
                  y1={y}
                  x2={plotWidth - padding}
                  y2={y}
                  stroke="#e1e4e8"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Vertical Grid lines */}
            {[0.25, 0.5, 0.75].map((ratio) => {
              const x = padding + ratio * (plotWidth - padding * 2);
              return (
                <line
                  key={ratio}
                  x1={x}
                  y1={padding}
                  x2={x}
                  y2={plotHeight - padding}
                  stroke="#e1e4e8"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Axis Labels */}
            <text
              x={plotWidth / 2}
              y={plotHeight - 12}
              textAnchor="middle"
              className="text-[11px] font-mono fill-[#57606a]"
            >
              {xAxisFeature === 'commitFrequency' ? 'Commit Frequency (commits / week)' : xAxisFeature === 'activeSpanRatio' ? 'Active Span Ratio (0 - 1.0)' : 'Burstiness Score'}
            </text>

            <text
              x={-plotHeight / 2}
              y={16}
              transform="rotate(-90)"
              textAnchor="middle"
              className="text-[11px] font-mono fill-[#57606a]"
            >
              {yAxisFeature === 'codeChurnRatio' ? 'Code Churn (Add / Del Ratio)' : yAxisFeature === 'fileSpreadIndex' ? 'File Spread (1 - 10)' : 'Maintenance Ratio'}
            </text>

            {/* Data Points */}
            {contributors.map((c) => {
              const { x, y } = getCoordinates(c);
              const cl = clusters.find((cluster) => cluster.id === c.clusterId);
              const color = cl ? cl.color : '#1f2328';
              const isHovered = hoveredContributor?.id === c.id;

              return (
                <g
                  key={c.id}
                  className="cursor-pointer"
                  onClick={() => onSelectContributor(c)}
                  onMouseEnter={() => setHoveredContributor(c)}
                  onMouseLeave={() => setHoveredContributor(null)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 9 : 6}
                    fill={color}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all duration-150"
                  />
                  {isHovered && (
                    <text
                      x={x}
                      y={y - 12}
                      textAnchor="middle"
                      className="text-[10px] font-mono font-bold fill-[#1f2328]"
                    >
                      {c.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Hover Detail Card */}
          {hoveredContributor && (
            <div className="mt-3 p-2.5 bg-[#ffffff] border border-[#d0d7de] rounded-md text-xs flex items-center justify-between w-full max-w-[700px] shadow-2xs">
              <div className="flex items-center gap-2">
                <img
                  src={hoveredContributor.avatarUrl}
                  alt={hoveredContributor.name}
                  className="w-5 h-5 rounded-full border border-[#d0d7de]"
                />
                <span className="font-semibold text-[#1f2328]">{hoveredContributor.name}</span>
                <span className="text-[#57606a] font-mono">@{hoveredContributor.login}</span>
                <span className="text-[#57606a]">·</span>
                <span className="text-[#0969da] font-medium">
                  {clusters.find((cl) => cl.id === hoveredContributor.clusterId)?.shortTag}
                </span>
              </div>
              <div className="font-mono text-[11px] text-[#57606a]">
                Commits: {hoveredContributor.commitCount} · Churn: {hoveredContributor.features.codeChurnRatio.toFixed(2)}:1
              </div>
            </div>
          )}

          {/* Cluster Legend */}
          <div className="mt-3 pt-3 border-t border-[#d0d7de] w-full flex items-center justify-center gap-4 flex-wrap text-xs">
            {clusters.map((cl) => (
              <div key={cl.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cl.color }}></span>
                <span className="text-[#1f2328] font-medium">{cl.shortTag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Discovered Patterns & Characteristics */}
      <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
        <h3 className="text-sm font-semibold text-[#1f2328] mb-1">
          3. Discovered Contribution Patterns & Centroids
        </h3>
        <p className="text-xs text-[#57606a] mb-5">
          Detailed behavioral characteristics for each identified Git activity pattern.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clusters.map((cl) => {
            const clusterMembers = contributors.filter((c) => c.clusterId === cl.id);

            return (
              <div
                key={cl.id}
                className="p-4 border border-[#d0d7de] rounded-md bg-[#ffffff] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: cl.color }}
                      ></span>
                      <h4 className="text-sm font-bold text-[#1f2328]">{cl.name}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#f6f8fa] border border-[#d0d7de] rounded">
                      {cl.contributorCount} contributors
                    </span>
                  </div>

                  <p className="text-xs text-[#57606a] mt-2 leading-relaxed">
                    {cl.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#d0d7de] space-y-2 text-xs">
                    <div>
                      <span className="text-[#57606a] block font-medium">Commit Cadence:</span>
                      <span className="font-mono text-[#1f2328] text-[11px]">{cl.characteristics.commitCadence}</span>
                    </div>
                    <div>
                      <span className="text-[#57606a] block font-medium">Code Churn Profile:</span>
                      <span className="font-mono text-[#1f2328] text-[11px]">{cl.characteristics.codeChurnProfile}</span>
                    </div>
                    <div>
                      <span className="text-[#57606a] block font-medium">File Scope:</span>
                      <span className="font-mono text-[#1f2328] text-[11px]">{cl.characteristics.fileSpread}</span>
                    </div>
                  </div>
                </div>

                {/* Contributors in this cluster */}
                <div className="mt-4 pt-3 border-t border-[#d0d7de]">
                  <span className="text-[11px] font-semibold text-[#57606a] block mb-2">
                    Contributors in this pattern ({clusterMembers.length}):
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {clusterMembers.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => onSelectContributor(m)}
                        className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#f6f8fa] hover:bg-[#eaeef2] border border-[#d0d7de] rounded text-xs transition-colors cursor-pointer"
                      >
                        <img
                          src={m.avatarUrl}
                          alt={m.name}
                          className="w-4 h-4 rounded-full border border-[#d0d7de]"
                        />
                        <span className="font-medium text-[#1f2328]">{m.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 4: Full Contributor Dataset Table */}
      <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-[#1f2328]">
              4. Complete Normalized Feature Dataset
            </h3>
            <p className="text-xs text-[#57606a]">
              Exact feature vectors feeding the unsupervised clustering pipeline.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#d0d7de] rounded-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f6f8fa] border-b border-[#d0d7de] text-[#57606a] font-semibold">
                <th className="py-2.5 px-3">Contributor</th>
                <th className="py-2.5 px-3">Pattern</th>
                <th className="py-2.5 px-3 text-right">f₁ (Freq)</th>
                <th className="py-2.5 px-3 text-right">f₂ (Span)</th>
                <th className="py-2.5 px-3 text-right">f₃ (Churn)</th>
                <th className="py-2.5 px-3 text-right">f₄ (Spread)</th>
                <th className="py-2.5 px-3 text-right">f₅ (Burst)</th>
                <th className="py-2.5 px-3 text-right">f₆ (Maint)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d0d7de] font-mono">
              {contributors.map((c) => {
                const cl = clusters.find((cluster) => cluster.id === c.clusterId);
                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectContributor(c)}
                    className="hover:bg-[#f6f8fa] transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 px-3 font-sans font-medium text-[#1f2328]">
                      {c.name}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="text-[11px]" style={{ color: cl?.color }}>
                        {cl?.shortTag}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {c.features.commitFrequency.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {(c.features.activeSpanRatio * 100).toFixed(0)}%
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {c.features.codeChurnRatio.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {c.features.fileSpreadIndex.toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {c.features.burstinessScore.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums">
                      {c.features.maintenanceRatio.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
