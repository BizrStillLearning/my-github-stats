import type {
    GitHubUserResponse,
    GitHubRepositoryResponse,
    GitHubLanguagesResponse,
    GitHubEvent,
} from '@/types/github';
import { GitHubApiError } from './errors';

const GITHUB_API_BASE = 'https://api.github.com';
const DEFAULT_TIMEOUT_MS = 8000;

interface FetchOptions {
    timeoutMs?: number;
}

async function requestGithub<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const token = process.env.GITHUB_TOKEN;
    const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

    const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'my-github-stats-app',
    };

    if (token && token.trim() !== '') {
        headers.Authorization = `Bearer ${token.trim()}`;
    }

    let response: Response;
    try {
        response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
            headers,
            signal: AbortSignal.timeout(timeoutMs),
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.name === 'TimeoutError') {
            throw new GitHubApiError('GitHub API request timed out', 'TIMEOUT', 504);
        }
        throw new GitHubApiError('Failed to communicate with GitHub API', 'GITHUB_API_ERROR', 500);
    }

    if (!response.ok) {
        const remainingRate = response.headers.get('x-ratelimit-remaining');
        if (response.status === 403 && remainingRate === '0') {
            throw new GitHubApiError('GitHub API rate limit exceeded', 'RATE_LIMITED', 429);
        }

        if (response.status === 404) {
            throw new GitHubApiError('Resource or user not found on GitHub', 'USER_NOT_FOUND', 404);
        }

        throw new GitHubApiError(
            `GitHub API returned status ${response.status}`,
            'GITHUB_API_ERROR',
            response.status
        );
    }

    return (await response.json()) as T;
}

export async function getUser(username: string): Promise<GitHubUserResponse> {
    return requestGithub<GitHubUserResponse>(`/users/${encodeURIComponent(username)}`);
}

export async function getRepositories(
    username: string,
    perPage = 100
): Promise<GitHubRepositoryResponse[]> {
    return requestGithub<GitHubRepositoryResponse[]>(
        `/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&type=owner&sort=updated`
    );
}

export async function getRepositoryLanguages(
    owner: string,
    repo: string
): Promise<GitHubLanguagesResponse> {
    return requestGithub<GitHubLanguagesResponse>(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`
    );
}

export async function getUserEvents(username: string, perPage = 30): Promise<GitHubEvent[]> {
    return requestGithub<GitHubEvent[]>(
        `/users/${encodeURIComponent(username)}/events/public?per_page=${perPage}`
    );
}