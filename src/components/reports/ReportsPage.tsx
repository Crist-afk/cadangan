import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Plus,
  CheckCircle2,
  Calendar,
  FileCode,
  Printer,
  Trash2,
  FileSpreadsheet,
  Copy,
  Check
} from 'lucide-react';
import { Repository, Contributor, AnalysisReport } from '../../types';
import { getClustersWithCounts } from '../../data/mockRepositories';

interface ReportsPageProps {
  repo: Repository;
  contributors: Contributor[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ repo, contributors }) => {
  const clusters = getClustersWithCounts(contributors);

  const [reports, setReports] = useState<AnalysisReport[]>([
    {
      id: 'rep-01',
      title: 'GitContrib Baseline Contribution Pattern Audit',
      repoName: repo.name,
      repoOwner: repo.owner,
      branch: repo.defaultBranch,
      generatedAt: '2026-09-24T06:45:00Z',
      datasetSummary: {
        totalCommits: repo.totalCommits,
        totalContributors: repo.totalContributors,
        timeframe: `${repo.contributionDurationDays} days`,
        totalLinesChanged: repo.totalLinesChanged
      },
      clusterBreakdown: clusters.map((c) => ({
        clusterName: c.name,
        count: c.contributorCount,
        percentage: Math.round((c.contributorCount / (contributors.length || 1)) * 100)
      })),
      notes: 'Initial comprehensive behavioral clustering across main branch history.'
    }
  ]);

  const [selectedReport, setSelectedReport] = useState<AnalysisReport | null>(reports[0]);
  const [isViewingReport, setIsViewingReport] = useState<boolean>(false);
  const [reportTitleInput, setReportTitleInput] = useState<string>('');
  const [reportNotesInput, setReportNotesInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const escapeCsvField = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n') || stringValue.includes('\r')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const triggerDownload = (filename: string, content: string, mimeType: string = 'text/csv;charset=utf-8;') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateAnalysisCSV = (report: AnalysisReport): string => {
    const headers = [
      'report_id',
      'report_title',
      'repo_name',
      'repo_owner',
      'branch',
      'analysis_timestamp',
      'contributor_id',
      'contributor_name',
      'contributor_login',
      'contributor_email',
      'pattern_cluster_id',
      'pattern_cluster_name',
      'commit_count',
      'commit_percentage_of_repo',
      'active_days',
      'contribution_duration_days',
      'lines_added',
      'lines_deleted',
      'net_lines_churn',
      'total_lines_churn',
      'files_changed',
      'first_commit_date',
      'last_commit_date',
      'ml_commit_frequency_weekly',
      'ml_active_span_ratio',
      'ml_code_churn_ratio',
      'ml_file_spread_index',
      'ml_burstiness_score',
      'ml_weekend_activity_ratio',
      'ml_maintenance_ratio'
    ];

    const clusterMap = new Map(clusters.map((cl) => [cl.id, cl.name]));

    const rows = contributors.map((c) => {
      const commitPct = ((c.commitCount / (report.datasetSummary.totalCommits || 1)) * 100).toFixed(2);
      const netLines = c.linesAdded - c.linesDeleted;
      const clusterName = clusterMap.get(c.clusterId) || c.clusterId;

      return [
        escapeCsvField(report.id),
        escapeCsvField(report.title),
        escapeCsvField(report.repoName),
        escapeCsvField(report.repoOwner),
        escapeCsvField(report.branch),
        escapeCsvField(report.generatedAt),
        escapeCsvField(c.id),
        escapeCsvField(c.name),
        escapeCsvField(c.login),
        escapeCsvField(c.email),
        escapeCsvField(c.clusterId),
        escapeCsvField(clusterName),
        escapeCsvField(c.commitCount),
        escapeCsvField(commitPct),
        escapeCsvField(c.activeDays),
        escapeCsvField(c.contributionDurationDays),
        escapeCsvField(c.linesAdded),
        escapeCsvField(c.linesDeleted),
        escapeCsvField(netLines),
        escapeCsvField(c.totalLinesChanged),
        escapeCsvField(c.filesChanged),
        escapeCsvField(c.firstCommitDate),
        escapeCsvField(c.lastCommitDate),
        escapeCsvField(c.features.commitFrequency.toFixed(3)),
        escapeCsvField(c.features.activeSpanRatio.toFixed(4)),
        escapeCsvField(c.features.codeChurnRatio.toFixed(4)),
        escapeCsvField(c.features.fileSpreadIndex.toFixed(2)),
        escapeCsvField(c.features.burstinessScore.toFixed(4)),
        escapeCsvField(c.features.weekendActivityRatio.toFixed(4)),
        escapeCsvField(c.features.maintenanceRatio.toFixed(4))
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\r\n');
  };

  const generateClusterSummaryCSV = (report: AnalysisReport): string => {
    const headers = [
      'report_id',
      'repo_name',
      'cluster_id',
      'cluster_name',
      'contributor_count',
      'contributor_percentage',
      'primary_role',
      'commit_cadence',
      'code_churn_profile',
      'file_spread',
      'temporal_pattern',
      'centroid_commit_frequency',
      'centroid_active_ratio',
      'centroid_churn_ratio',
      'centroid_file_spread_index',
      'centroid_burstiness_score',
      'centroid_maintenance_ratio'
    ];

    const rows = clusters.map((cl) => {
      const breakdown = report.clusterBreakdown.find((b) => b.clusterName === cl.name);
      const count = breakdown ? breakdown.count : cl.contributorCount;
      const pct = breakdown ? breakdown.percentage : Math.round((count / (contributors.length || 1)) * 100);

      return [
        escapeCsvField(report.id),
        escapeCsvField(report.repoName),
        escapeCsvField(cl.id),
        escapeCsvField(cl.name),
        escapeCsvField(count),
        escapeCsvField(pct),
        escapeCsvField(cl.characteristics.primaryRole),
        escapeCsvField(cl.characteristics.commitCadence),
        escapeCsvField(cl.characteristics.codeChurnProfile),
        escapeCsvField(cl.characteristics.fileSpread),
        escapeCsvField(cl.characteristics.temporalPattern),
        escapeCsvField(cl.centroid.commitFrequency.toFixed(2)),
        escapeCsvField(cl.centroid.activeRatio.toFixed(4)),
        escapeCsvField(cl.centroid.churnRatio.toFixed(4)),
        escapeCsvField(cl.centroid.fileSpreadIndex.toFixed(2)),
        escapeCsvField(cl.centroid.burstinessScore.toFixed(4)),
        escapeCsvField(cl.centroid.maintenanceRatio.toFixed(4))
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\r\n');
  };

  const handleExportCSV = (report: AnalysisReport) => {
    const csvContent = generateAnalysisCSV(report);
    const filename = `${report.repoName}-analysis-results-${report.id}.csv`;
    triggerDownload(filename, csvContent, 'text/csv;charset=utf-8;');
    showToast(`Exported analysis results CSV (${contributors.length} rows)`);
  };

  const handleExportClusterSummaryCSV = (report: AnalysisReport) => {
    const csvContent = generateClusterSummaryCSV(report);
    const filename = `${report.repoName}-clusters-summary-${report.id}.csv`;
    triggerDownload(filename, csvContent, 'text/csv;charset=utf-8;');
    showToast(`Exported cluster summary CSV (${report.clusterBreakdown.length} clusters)`);
  };

  const handleCopyCSV = (report: AnalysisReport) => {
    const csvContent = generateAnalysisCSV(report);
    navigator.clipboard.writeText(csvContent).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      showToast('Copied analysis results CSV dataset to clipboard');
    });
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const newReport: AnalysisReport = {
        id: `rep-${Date.now().toString().slice(-4)}`,
        title: reportTitleInput.trim() || `${repo.name} Pattern Analysis Report`,
        repoName: repo.name,
        repoOwner: repo.owner,
        branch: repo.defaultBranch,
        generatedAt: new Date().toISOString(),
        datasetSummary: {
          totalCommits: repo.totalCommits,
          totalContributors: repo.totalContributors,
          timeframe: `${repo.contributionDurationDays} days`,
          totalLinesChanged: repo.totalLinesChanged
        },
        clusterBreakdown: clusters.map((c) => ({
          clusterName: c.name,
          count: c.contributorCount,
          percentage: Math.round((c.contributorCount / (contributors.length || 1)) * 100)
        })),
        notes: reportNotesInput.trim() || 'Custom generated snapshot for team evaluation.'
      };

      setReports([newReport, ...reports]);
      setSelectedReport(newReport);
      setReportTitleInput('');
      setReportNotesInput('');
      setIsGenerating(false);
    }, 600);
  };

  const handleExportMarkdown = (report: AnalysisReport) => {
    const md = `# ${report.title}
**Repository:** ${report.repoOwner}/${report.repoName}
**Branch:** ${report.branch}
**Generated Date:** ${new Date(report.generatedAt).toLocaleString()}

## 1. Dataset Summary
- **Total Commits:** ${report.datasetSummary.totalCommits.toLocaleString()}
- **Total Contributors:** ${report.datasetSummary.totalContributors}
- **Active Window:** ${report.datasetSummary.timeframe}
- **Total Line Churn:** ${report.datasetSummary.totalLinesChanged.toLocaleString()} lines

## 2. Machine Learning Pattern Clustering
| Pattern | Contributor Count | Percentage |
| :--- | :--- | :--- |
${report.clusterBreakdown.map((b) => `| ${b.clusterName} | ${b.count} | ${b.percentage}% |`).join('\n')}

## 3. Contributor Breakdown
| Contributor | Login | Commits | Active Days | Lines Added | Lines Deleted |
| :--- | :--- | :--- | :--- | :--- | :--- |
${contributors.map((c) => `| ${c.name} | @${c.login} | ${c.commitCount} | ${c.activeDays}d | +${c.linesAdded} | -${c.linesDeleted} |`).join('\n')}

---
*Report generated by GitContrib - Git History Contributor Pattern Analyzer.*
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.repoName}-report-${report.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = (report: AnalysisReport) => {
    const data = {
      report,
      contributors: contributors.map((c) => ({
        name: c.name,
        login: c.login,
        cluster: c.clusterId,
        commitCount: c.commitCount,
        activeDays: c.activeDays,
        linesAdded: c.linesAdded,
        linesDeleted: c.linesDeleted,
        features: c.features
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.repoName}-report-${report.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#ffffff] min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#d0d7de]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1f2328]">
            Analysis Reports & Exports
          </h2>
          <p className="text-xs sm:text-sm text-[#57606a] mt-0.5">
            Compile, review, and export formal Git history contribution pattern reports.
          </p>
        </div>
      </div>

      {/* Generator Card & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generate Report Form */}
        <div className="lg:col-span-1 border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <Plus className="w-4 h-4 text-[#1a7f37]" />
            <h3 className="text-sm font-semibold text-[#1f2328]">Generate New Report</h3>
          </div>

          <form onSubmit={handleGenerateReport} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-[#1f2328] mb-1">
                Report Title
              </label>
              <input
                type="text"
                value={reportTitleInput}
                onChange={(e) => setReportTitleInput(e.target.value)}
                placeholder="e.g. Capstone Sprint 4 Contribution Audit"
                className="w-full text-xs px-3 py-2 bg-[#ffffff] border border-[#d0d7de] rounded-md text-[#1f2328] focus:outline-none focus:ring-1 focus:ring-[#0969da]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#1f2328] mb-1">
                Audience & Evaluation Notes
              </label>
              <textarea
                value={reportNotesInput}
                onChange={(e) => setReportNotesInput(e.target.value)}
                rows={3}
                placeholder="Add contextual observations or grading framework notes..."
                className="w-full text-xs px-3 py-2 bg-[#ffffff] border border-[#d0d7de] rounded-md text-[#1f2328] focus:outline-none focus:ring-1 focus:ring-[#0969da]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full px-4 py-2 bg-[#1a7f37] hover:bg-[#1f883d] text-white font-semibold text-xs rounded-md transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Compiling Report...' : 'Generate Report'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Selected Report Preview & Export Controls */}
        <div className="lg:col-span-2 border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs flex flex-col justify-between">
          {selectedReport ? (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d0d7de]">
                <div>
                  <span className="text-[11px] font-mono text-[#57606a]">
                    ID: {selectedReport.id} · {new Date(selectedReport.generatedAt).toLocaleString()}
                  </span>
                  <h3 className="text-base font-bold text-[#1f2328] mt-0.5">
                    {selectedReport.title}
                  </h3>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsViewingReport(true)}
                    className="px-3 py-1.5 text-xs font-medium text-[#1f2328] bg-[#f6f8fa] hover:bg-[#eaeef2] border border-[#d0d7de] rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#57606a]" />
                    <span>View Report</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleExportCSV(selectedReport)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#1a7f37] bg-[#dafbe1] hover:bg-[#c2f3cc] border border-[#4ac26b] rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      title="Export repository analysis results as CSV file"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Export (.csv)</span>
                    </button>
                    <button
                      onClick={() => handleExportMarkdown(selectedReport)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#1f2328] hover:bg-[#24292f] rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                      title="Export Markdown"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>.md</span>
                    </button>
                    <button
                      onClick={() => handleExportJSON(selectedReport)}
                      className="px-2 py-1.5 text-xs font-medium text-[#57606a] hover:text-[#1f2328] border border-[#d0d7de] rounded-md transition-colors cursor-pointer"
                      title="Export as JSON"
                    >
                      .json
                    </button>
                  </div>
                </div>
              </div>

              {/* Dataset Summary */}
              <div>
                <h4 className="text-xs font-semibold text-[#1f2328] mb-2">Dataset Summary</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2.5 bg-[#f6f8fa] border border-[#d0d7de] rounded">
                    <span className="text-[#57606a] block text-[10px]">Repository</span>
                    <span className="font-semibold text-[#1f2328]">{selectedReport.repoOwner}/{selectedReport.repoName}</span>
                  </div>
                  <div className="p-2.5 bg-[#f6f8fa] border border-[#d0d7de] rounded">
                    <span className="text-[#57606a] block text-[10px]">Commits Analyzed</span>
                    <span className="font-mono font-bold text-[#1f2328]">{selectedReport.datasetSummary.totalCommits.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 bg-[#f6f8fa] border border-[#d0d7de] rounded">
                    <span className="text-[#57606a] block text-[10px]">Active Contributors</span>
                    <span className="font-mono font-bold text-[#1f2328]">{selectedReport.datasetSummary.totalContributors}</span>
                  </div>
                  <div className="p-2.5 bg-[#f6f8fa] border border-[#d0d7de] rounded">
                    <span className="text-[#57606a] block text-[10px]">Total Line Churn</span>
                    <span className="font-mono font-bold text-[#1f2328]">{selectedReport.datasetSummary.totalLinesChanged.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Machine Learning Results Breakdown */}
              <div>
                <h4 className="text-xs font-semibold text-[#1f2328] mb-2">Machine Learning Results (k=4)</h4>
                <div className="space-y-2">
                  {selectedReport.clusterBreakdown.map((item) => (
                    <div key={item.clusterName} className="p-2.5 bg-[#f6f8fa] border border-[#d0d7de] rounded flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1f2328]">{item.clusterName}</span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-[#57606a]">{item.count} contributors</span>
                        <span className="font-bold text-[#1f2328]">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* External Data Analysis (CSV Export) */}
              <div className="p-3.5 bg-[#f6f8fa] border border-[#d0d7de] rounded-md space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-[#1a7f37]" />
                    <h4 className="text-xs font-bold text-[#1f2328]">
                      External Data Analysis & CSV Export
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#57606a] bg-white border border-[#d0d7de] px-1.5 py-0.5 rounded self-start sm:self-auto">
                    RFC 4180 Compliant · UTF-8
                  </span>
                </div>

                <p className="text-xs text-[#57606a] leading-relaxed">
                  Export repository contributor records, raw metrics (commits, churn, active days), and high-dimensional ML behavioral feature vectors as CSV files ready for Jupyter Notebook (pandas), R, Tableau, Excel, or Google Sheets.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleExportCSV(selectedReport)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1a7f37] hover:bg-[#1f883d] rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Results CSV ({contributors.length} contributors)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExportClusterSummaryCSV(selectedReport)}
                    className="px-2.5 py-1.5 text-xs font-medium text-[#1f2328] bg-white hover:bg-[#eaeef2] border border-[#d0d7de] rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#57606a]" />
                    <span>Cluster Summary CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyCSV(selectedReport)}
                    className="px-2.5 py-1.5 text-xs font-medium text-[#1f2328] bg-white hover:bg-[#eaeef2] border border-[#d0d7de] rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copy CSV dataset to clipboard"
                  >
                    {copySuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#1a7f37]" />
                        <span className="text-[#1a7f37] font-semibold">Copied CSV</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#57606a]" />
                        <span>Copy CSV</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Evaluation Notes */}
              {selectedReport.notes && (
                <div className="p-3 bg-[#f6f8fa] border border-[#d0d7de] rounded text-xs text-[#57606a]">
                  <span className="font-semibold text-[#1f2328] block mb-1">Evaluator Notes:</span>
                  {selectedReport.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-[#57606a] text-xs">
              Select or generate a report to inspect details.
            </div>
          )}
        </div>
      </div>

      {/* Saved Reports Archive */}
      <div className="border border-[#d0d7de] rounded-md bg-[#ffffff] p-5 shadow-2xs">
        <h3 className="text-sm font-semibold text-[#1f2328] mb-3">
          Saved Report Archive ({reports.length})
        </h3>
        <div className="divide-y divide-[#d0d7de] border border-[#d0d7de] rounded-md">
          {reports.map((rep) => (
            <div
              key={rep.id}
              onClick={() => setSelectedReport(rep)}
              className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors cursor-pointer ${
                selectedReport?.id === rep.id ? 'bg-[#f6f8fa]' : 'hover:bg-[#f6f8fa]'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1f2328]">{rep.title}</span>
                  <span className="text-[10px] font-mono text-[#57606a] bg-white border border-[#d0d7de] px-1.5 py-0.5 rounded">
                    {rep.id}
                  </span>
                </div>
                <div className="text-[11px] text-[#57606a] mt-0.5">
                  Generated on {new Date(rep.generatedAt).toLocaleDateString()} · Branch: {rep.branch} · {rep.datasetSummary.totalCommits} commits
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedReport(rep);
                    setIsViewingReport(true);
                  }}
                  className="px-2.5 py-1 text-xs text-[#0969da] hover:underline cursor-pointer"
                >
                  View
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportCSV(rep);
                  }}
                  className="px-2 py-1 text-xs text-[#1a7f37] bg-[#dafbe1] hover:bg-[#c2f3cc] border border-[#4ac26b] rounded font-medium cursor-pointer flex items-center gap-1"
                  title="Export results as CSV"
                >
                  <FileSpreadsheet className="w-3 h-3" />
                  <span>CSV</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportMarkdown(rep);
                  }}
                  className="px-2 py-1 text-xs text-[#1f2328] hover:bg-[#eaeef2] border border-[#d0d7de] rounded cursor-pointer"
                  title="Export Markdown"
                >
                  .md
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExportJSON(rep);
                  }}
                  className="px-2 py-1 text-xs text-[#57606a] hover:text-[#1f2328] border border-[#d0d7de] rounded cursor-pointer"
                  title="Export JSON"
                >
                  .json
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen Report View Modal (View Report) */}
      {isViewingReport && selectedReport && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-[#ffffff] border border-[#d0d7de] rounded-lg max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#d0d7de] bg-[#f6f8fa] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1f2328]" />
                <span className="text-sm font-bold text-[#1f2328]">Report Document: {selectedReport.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportCSV(selectedReport)}
                  className="px-3 py-1 text-xs border border-[#4ac26b] bg-[#dafbe1] text-[#1a7f37] font-semibold hover:bg-[#c2f3cc] rounded flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Export analysis results as CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => handleExportMarkdown(selectedReport)}
                  className="px-2.5 py-1 text-xs border border-[#d0d7de] rounded bg-white hover:bg-[#eaeef2] text-[#1f2328] flex items-center gap-1 cursor-pointer"
                  title="Export Markdown"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.md</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 text-xs border border-[#d0d7de] rounded bg-white hover:bg-[#eaeef2] text-[#1f2328] flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setIsViewingReport(false)}
                  className="px-3 py-1 text-xs border border-[#d0d7de] rounded bg-white hover:bg-[#eaeef2] text-[#1f2328] font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-[#1f2328]">
              {/* Document Header */}
              <div className="border-b border-[#d0d7de] pb-4">
                <span className="text-xs font-mono text-[#57606a]">GitContrib Analytical Report</span>
                <h1 className="text-2xl font-bold mt-1">{selectedReport.title}</h1>
                <div className="mt-2 text-xs text-[#57606a] flex gap-4">
                  <span>Target: <strong>{selectedReport.repoOwner}/{selectedReport.repoName}</strong></span>
                  <span>Branch: <strong>{selectedReport.branch}</strong></span>
                  <span>Date: <strong>{new Date(selectedReport.generatedAt).toLocaleString()}</strong></span>
                </div>
              </div>

              {/* 1. Summary */}
              <div>
                <h2 className="text-sm font-bold border-b border-[#d0d7de] pb-1 mb-2">1. Dataset Summary</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2 border border-[#d0d7de] rounded">
                    <span className="text-[#57606a] block">Total Commits</span>
                    <span className="font-mono font-bold text-sm">{selectedReport.datasetSummary.totalCommits.toLocaleString()}</span>
                  </div>
                  <div className="p-2 border border-[#d0d7de] rounded">
                    <span className="text-[#57606a] block">Active Contributors</span>
                    <span className="font-mono font-bold text-sm">{selectedReport.datasetSummary.totalContributors}</span>
                  </div>
                  <div className="p-2 border border-[#d0d7de] rounded">
                    <span className="text-[#57606a] block">Lifespan Window</span>
                    <span className="font-mono font-bold text-sm">{selectedReport.datasetSummary.timeframe}</span>
                  </div>
                  <div className="p-2 border border-[#d0d7de] rounded">
                    <span className="text-[#57606a] block">Total Code Churn</span>
                    <span className="font-mono font-bold text-sm">{selectedReport.datasetSummary.totalLinesChanged.toLocaleString()} lines</span>
                  </div>
                </div>
              </div>

              {/* 2. Machine Learning Patterns */}
              <div>
                <h2 className="text-sm font-bold border-b border-[#d0d7de] pb-1 mb-2">2. Discovered Machine Learning Clusters (k=4)</h2>
                <div className="space-y-2 text-xs">
                  {selectedReport.clusterBreakdown.map((b) => (
                    <div key={b.clusterName} className="p-2.5 border border-[#d0d7de] rounded flex justify-between items-center">
                      <span className="font-semibold">{b.clusterName}</span>
                      <span className="font-mono">{b.count} contributors ({b.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Contributor Breakdown Table */}
              <div>
                <h2 className="text-sm font-bold border-b border-[#d0d7de] pb-1 mb-2">3. Contributor Statistical Record</h2>
                <table className="w-full text-left text-xs border border-[#d0d7de] border-collapse">
                  <thead className="bg-[#f6f8fa] font-semibold text-[#57606a]">
                    <tr>
                      <th className="p-2 border-b border-[#d0d7de]">Contributor</th>
                      <th className="p-2 border-b border-[#d0d7de] text-right">Commits</th>
                      <th className="p-2 border-b border-[#d0d7de] text-right">Active Days</th>
                      <th className="p-2 border-b border-[#d0d7de] text-right">Lines Added</th>
                      <th className="p-2 border-b border-[#d0d7de] text-right">Lines Deleted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d0d7de]">
                    {contributors.map((c) => (
                      <tr key={c.id}>
                        <td className="p-2 font-medium">{c.name} (@{c.login})</td>
                        <td className="p-2 text-right font-mono">{c.commitCount}</td>
                        <td className="p-2 text-right font-mono">{c.activeDays}d</td>
                        <td className="p-2 text-right font-mono text-[#1a7f37]">+{c.linesAdded.toLocaleString()}</td>
                        <td className="p-2 text-right font-mono text-[#cf222e]">-{c.linesDeleted.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Notes */}
              {selectedReport.notes && (
                <div className="p-3 border border-[#d0d7de] rounded bg-[#f6f8fa] text-xs">
                  <span className="font-bold block mb-1">Evaluator Notes:</span>
                  <p>{selectedReport.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Export Feedback Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f2328] text-white text-xs px-3.5 py-2.5 rounded-md shadow-lg border border-[#30363d] flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#2da44e]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
