import type {
    GitHubUserResponse,
    GitHubRepositoryResponse,
    GitHubEvent,
} from '../../types/github';

const GITHUB_API_BASE = 'https://api.github.com';

function getHeaders(): HeadersInit {
    const token = process.env.GITHUB_TOKEN?.trim();

    const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'my-github-stats-app',
    };

    if (token) {
        headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    return headers;
}

export async function getUser(username: string): Promise<GitHubUserResponse> {
    const res = await fetch(`${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`, {
        headers: getHeaders(),
    });

    if (!res.ok) {
        const errorBody = await res.text();
        console.error(`GitHub API Error (/users/${username}):`, res.status, errorBody);
        throw new Error(`GitHub API returned status ${res.status}: ${res.statusText}`);
    }

    return res.json();
}

export async function getRepositories(username: string): Promise<GitHubRepositoryResponse[]> {
    const res = await fetch(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
        {
            headers: getHeaders(),
        }
    );

    if (!res.ok) {
        const errorBody = await res.text();
        console.error(`GitHub API Error (/repos):`, res.status, errorBody);
        throw new Error(`GitHub API returned status ${res.status}: ${res.statusText}`);
    }

    return res.json();
}

export async function getUserEvents(username: string): Promise<GitHubEvent[]> {
    const res = await fetch(
        `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}/events/public?per_page=100`,
        {
            headers: getHeaders(),
        }
    );

    if (!res.ok) {
        console.warn(`Could not fetch public events: status ${res.status}`);
        return [];
    }

    return res.json();
}

export async function getRepositoryLanguages(
    owner: string,
    repo: string
): Promise<Record<string, number>> {
    const res = await fetch(
        `${GITHUB_API_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`,
        {
            headers: getHeaders(),
        }
    );

    if (!res.ok) {
        return {};
    }

    return res.json();
}
