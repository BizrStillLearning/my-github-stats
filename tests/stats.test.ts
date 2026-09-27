import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeActivity } from '../src/lib/stats/calculator';
import type { GitHubEvent } from '../src/types/github';

describe('Stats Processing Logic', () => {
    test('should correctly summarize activity events', () => {
        const mockEvents: GitHubEvent[] = [
            {
                id: '1',
                type: 'PushEvent',
                actor: { id: 10, login: 'tester' },
                created_at: '2026-09-27T00:00:00Z',
                payload: {
                    commits: [{ sha: 'a', message: 'feat: add test' }, { sha: 'b', message: 'fix: bug' }],
                },
            },
            {
                id: '2',
                type: 'PullRequestEvent',
                actor: { id: 10, login: 'tester' },
                created_at: '2026-09-27T01:00:00Z',
            },
            {
                id: '3',
                type: 'IssuesEvent',
                actor: { id: 10, login: 'tester' },
                created_at: '2026-09-27T02:00:00Z',
            },
        ];

        const summary = summarizeActivity(mockEvents);

        assert.equal(summary.recentCommits, 2);
        assert.equal(summary.recentPullRequests, 1);
        assert.equal(summary.recentIssues, 1);
        assert.equal(summary.totalRecentEvents, 3);
    });

    test('should handle empty event list gracefully', () => {
        const summary = summarizeActivity([]);
        assert.deepEqual(summary, {
            recentCommits: 0,
            recentPullRequests: 0,
            recentIssues: 0,
            totalRecentEvents: 0,
        });
    });
});