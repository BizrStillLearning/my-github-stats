import { getUser, getRepositories, getUserEvents } from '@/lib/github/client';
import { processGitHubStats } from '@/lib/stats/calculator';
import type { GitHubStats } from '@/types/stats';

interface CacheEntry {
    stats: GitHubStats;
    expiresAt: number;
}

const STATS_CACHE = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000;

export async function getOrFetchStats(username: string): Promise<GitHubStats> {
    const normalizedKey = username.toLowerCase().trim();
    const cached = STATS_CACHE.get(normalizedKey);

    if (cached && cached.expiresAt > Date.now()) {
        return cached.stats;
    }

    const [user, repos, events] = await Promise.all([
        getUser(username),
        getRepositories(username),
        getUserEvents(username),
    ]);

    const stats = await processGitHubStats(user, repos, events);

    STATS_CACHE.set(normalizedKey, {
        stats,
        expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return stats;
}