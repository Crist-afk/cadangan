import { Contributor, Repository, User } from '../types';
import { MOCK_CONTRIBUTORS, MOCK_REPOSITORIES } from '../data/mockRepositories';

const WORKSPACE_KEY_PREFIX = 'gitcontrib_workspace_';

const DEMO_SAMPLE_IDS = new Set(['usr-dosen-1']);
const DEMO_SAMPLE_EMAILS = new Set(['dosen@gitcontrib.ac.id']);

export interface UserWorkspace {
  repositories: Repository[];
  contributors: Contributor[];
  activeRepoId: string | null;
}

export function isDemoSampleAccount(user: Pick<User, 'id' | 'email'> | null | undefined): boolean {
  if (!user) return false;
  const email = (user.email || '').trim().toLowerCase();
  return DEMO_SAMPLE_IDS.has(user.id) || DEMO_SAMPLE_EMAILS.has(email);
}

function storageKey(userId: string): string {
  return `${WORKSPACE_KEY_PREFIX}${userId}`;
}

export function readUserWorkspace(userId: string): UserWorkspace | null {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserWorkspace;
    if (!parsed || !Array.isArray(parsed.repositories) || !Array.isArray(parsed.contributors)) {
      return null;
    }
    return {
      repositories: parsed.repositories,
      contributors: parsed.contributors,
      activeRepoId: parsed.activeRepoId ?? null
    };
  } catch {
    return null;
  }
}

export function saveUserWorkspace(userId: string, workspace: UserWorkspace): void {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(workspace));
  } catch {
    // Ignore quota / private-mode failures
  }
}

export function emptyWorkspace(): UserWorkspace {
  return {
    repositories: [],
    contributors: [],
    activeRepoId: null
  };
}

export function demoWorkspace(): UserWorkspace {
  return {
    repositories: MOCK_REPOSITORIES,
    contributors: MOCK_CONTRIBUTORS,
    activeRepoId: MOCK_REPOSITORIES[0]?.id ?? null
  };
}

export function loadUserWorkspace(user: Pick<User, 'id' | 'email'> | null | undefined): UserWorkspace {
  if (!user) return emptyWorkspace();

  const saved = readUserWorkspace(user.id);
  if (saved) return saved;

  if (isDemoSampleAccount(user)) {
    return demoWorkspace();
  }

  return emptyWorkspace();
}

export function resolveActiveRepo(workspace: UserWorkspace): Repository | null {
  if (workspace.repositories.length === 0) return null;
  return workspace.repositories.find((r) => r.id === workspace.activeRepoId) ?? workspace.repositories[0];
}
