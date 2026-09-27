import type {
    GitHubUserResponse,
    GitHubRepositoryResponse,
    GitHubEvent,
} from '../../types/github';
import type { GitHubStats, LanguageStat, ActivitySummary } from '../../types/stats';
import { getRepositoryLanguages } from '../github/client';

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Go: '#00ADD8',
    'C++': '#f34b7d',
    C: '#555555',
    Java: '#b07219',
    Rust: '#dea584',
    PHP: '#4F5D95',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Vue: '#41b883',
    Shell: '#89e051',
    Ruby: '#701516',
};

export function summarizeActivity(events: GitHubEvent[]): ActivitySummary {
    let recentCommits = 0;
    let recentPullRequests = 0;
    let recentIssues = 0;

    for (const event of events) {
        if (event.type === 'PushEvent') {
            recentCommits += event.payload?.commits?.length ?? 1;
        } else if (event.type === 'PullRequestEvent') {
            recentPullRequests += 1;
        } else if (event.type === 'IssuesEvent') {
            recentIssues += 1;
        }
    }

    return {
        recentCommits,
        recentPullRequests,
        recentIssues,
        totalRecentEvents: events.length,
    };
}

export async function calculateLanguageStats(
    owner: string,
    repos: GitHubRepositoryResponse[],
    maxReposToScan = 15
): Promise<LanguageStat[]> {
    const targetRepos = repos
        .filter((repo) => !repo.fork && repo.size > 0)
        .sort((a, b) => b.stargazers_count - a.stargazers_count || b.size - a.size)
        .slice(0, maxReposToScan);

    if (targetRepos.length === 0) {
        return [];
    }

    const languagePromises = targetRepos.map((repo) =>
        getRepositoryLanguages(owner, repo.name).catch(() => ({}))
    );

    const languageMaps = await Promise.all(languagePromises);

    const aggregatedBytes: Record<string, number> = {};
    let totalBytes = 0;

    for (const langMap of languageMaps) {
        for (const [lang, bytes] of Object.entries(langMap)) {
            const byteNum = typeof bytes === 'number' ? bytes : 0;
            aggregatedBytes[lang] = (aggregatedBytes[lang] ?? 0) + byteNum;
            totalBytes += byteNum;
        }
    }

    if (totalBytes === 0) {
        return [];
    }

    return Object.entries(aggregatedBytes)
        .map(([name, bytes]) => {
            const percentage = parseFloat(((bytes / totalBytes) * 100).toFixed(1));
            return {
                name,
                bytes,
                percentage,
                color: LANGUAGE_COLORS[name] ?? '#8b949e',
            };
        })
        .filter((stat) => stat.percentage >= 0.5)
        .sort((a, b) => b.percentage - a.percentage);
}

export async function processGitHubStats(
    user: GitHubUserResponse,
    repos: GitHubRepositoryResponse[],
    events: GitHubEvent[]
): Promise<GitHubStats> {
    let starsCount = 0;
    let forksCount = 0;
    let forkedRepos = 0;

    for (const repo of repos) {
        starsCount += repo.stargazers_count;
        forksCount += repo.forks_count;
        if (repo.fork) {
            forkedRepos += 1;
        }
    }

    const originalRepos = Math.max(0, repos.length - forkedRepos);
    const languages = await calculateLanguageStats(user.login, repos);
    const activity = summarizeActivity(events);

    return {
        username: user.login,
        name: user.name || user.login,
        avatarUrl: user.avatar_url,
        profileUrl: user.html_url,
        totalRepos: user.public_repos,
        forkedRepos,
        originalRepos,
        starsCount,
        forksCount,
        followers: user.followers,
        following: user.following,
        languages,
        activity,
    };
}