import { unstable_cache } from 'next/cache';
import { getUser, getRepositories, getUserEvents } from '@/lib/github/client';
import { processGitHubStats } from '@/lib/stats/calculator';
import { GitHubStats } from '@/types/stats';

const CACHE_TTL_SECONDS = 1800;

export async function fetchUserStatsWithCache(username: string): Promise<GitHubStats> {
    const getCachedStats = unstable_cache(
        async (targetUser: string) => {
            const [user, repos, events] = await Promise.all([
                getUser(targetUser),
                getRepositories(targetUser),
                getUserEvents(targetUser).catch(() => []),
            ]);

            return processGitHubStats(user, repos, events);
        },
        ['github-user-stats'],
        {
            revalidate: CACHE_TTL_SECONDS,
            tags: [`stats-${username.toLowerCase()}`],
        }
    );

    return getCachedStats(username);
}