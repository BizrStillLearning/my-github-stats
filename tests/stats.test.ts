import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeActivity } from '../src/lib/stats/calculator.ts';
import type { GitHubEvent } from '../src/types/github.ts';

describe('Stats Calculator Utility', () => {
    test('should summarize recent activity events correctly', () => {
        const mockActor = {
            id: 1,
            login: 'testuser',
            display_login: 'testuser',
            avatar_url: 'https://avatars.githubusercontent.com/u/1',
        };

        const mockEvents: GitHubEvent[] = [
            {
                id: '1',
                type: 'PushEvent',
                actor: mockActor,
                created_at: '2026-09-01T10:00:00Z',
                payload: {
                    commits: [
                        { sha: 'a1b2c3d', message: 'feat: add initial feature' },
                        { sha: 'e4f5g6h', message: 'fix: resolve bug' },
                    ],
                },
            },
            {
                id: '2',
                type: 'PullRequestEvent',
                actor: mockActor,
                created_at: '2026-09-02T10:00:00Z',
            },
            {
                id: '3',
                type: 'IssuesEvent',
                actor: mockActor,
                created_at: '2026-09-03T10:00:00Z',
            },
        ];

        const summary = summarizeActivity(mockEvents);

        assert.strictEqual(summary.recentCommits, 2);
        assert.strictEqual(summary.recentPullRequests, 1);
        assert.strictEqual(summary.recentIssues, 1);
        assert.strictEqual(summary.totalRecentEvents, 3);
    });
});