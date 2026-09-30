import { PipelineStage } from '../types';

export const INITIAL_PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1,
    name: 'Validating Repository',
    detail: 'Verifying repository accessibility, commit tree integrity, and default branch HEAD ref.',
    status: 'pending',
    durationMs: 900,
    logLines: [
      'GET /repos/{owner}/{repo} -> HTTP 200 OK',
      'Resolving default branch ref refs/heads/main',
      'Tree SHA verified: 4b825dc642cb6eb9a060e54bf8d69288fbee4904',
      'Repository validated successfully'
    ]
  },
  {
    id: 2,
    name: 'Fetching Git History',
    detail: 'Streaming commit log objects, author metadata, and topological commit parent relationships.',
    status: 'pending',
    durationMs: 1400,
    logLines: [
      'Executing: git rev-list --topo-order --format=raw HEAD',
      'Extracted 1,420 total commits across all reachable branch trees',
      'Parsed author signatures, GPG commit verification hashes, and timestamps',
      'Git history index cached in in-memory pack buffer'
    ]
  },
  {
    id: 3,
    name: 'Extracting Contributors',
    detail: 'Mapping author identities, canonicalizing emails, and resolving multi-alias contributions.',
    status: 'pending',
    durationMs: 1000,
    logLines: [
      'Applying .mailmap aliasing and Git author canonicalization rules',
      'Identified 14 unique active contributors across commit history',
      'Compiled first/last commit boundary dates and active span windows',
      'Contributor identity graph resolved'
    ]
  },
  {
    id: 4,
    name: 'Processing Data',
    detail: 'Computing line additions, deletions, code churn, and file modification frequencies.',
    status: 'pending',
    durationMs: 1200,
    logLines: [
      'Analyzing git diff numstat outputs per commit record',
      'Calculated 184,520 lines added, 62,410 lines deleted (246,930 total lines changed)',
      'Categorized file modifications across 18 directory trees',
      'Generated 24x7 commit punchcard matrix and weekly cadence histograms'
    ]
  },
  {
    id: 5,
    name: 'Feature Engineering',
    detail: 'Normalizing multi-dimensional Git metrics: frequency, active span ratio, code churn, and burstiness.',
    status: 'pending',
    durationMs: 1100,
    logLines: [
      'Extracting feature vector f_1: commit frequency (commits / active week)',
      'Extracting feature vector f_2: active day persistence ratio (active_days / duration)',
      'Extracting feature vector f_3: churn asymmetry index (additions / deletions)',
      'Extracting feature vector f_4: architectural file spread index (subsystem breadth)',
      'Extracting feature vector f_5: temporal burstiness B = (σ - μ) / (σ + μ)',
      'Extracting feature vector f_6: maintenance vs feature ratio (test/doc/config fraction)',
      'Standardized z-score matrix with MinMax [0.0, 1.0] scaling'
    ]
  },
  {
    id: 6,
    name: 'Running Machine Learning',
    detail: 'Executing K-Means clustering with Silhouette Score validation and centroid convergence.',
    status: 'pending',
    durationMs: 1500,
    logLines: [
      'Evaluating cluster separation across k ∈ [2, 6] using silhouette analysis',
      'Optimal k=4 identified (silhouette score: 0.741, inertia: 14.82)',
      'Converged in 12 iterations (tolerance: 1e-4)',
      'Identified 4 distinct behavioral contribution patterns',
      'Calculated cluster centroids and dimensional distance variance'
    ]
  },
  {
    id: 7,
    name: 'Generating Analysis',
    detail: 'Synthesizing objective Git activity characteristics, dataset tables, and report artifacts.',
    status: 'pending',
    durationMs: 800,
    logLines: [
      'Constructed neutral contribution pattern narratives',
      'Assembled multi-contributor timeline vectors and punchcard visuals',
      'Generated structured dataset summary and exportable report schema',
      'Analysis pipeline completed successfully'
    ]
  }
];
