import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateStatsSvg, generateErrorSvg } from '../src/lib/svg/generator.ts';
import type { GitHubStats } from '../src/types/stats.ts';

const mockStats: GitHubStats = {
    username: 'testuser',
    name: 'Test User',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
    profileUrl: 'https://github.com/testuser',
    totalRepos: 15,
    forkedRepos: 3,
    originalRepos: 12,
    starsCount: 39,
    forksCount: 14,
    followers: 120,
    following: 45,
    totalCommitsLastYear: 481,
    totalPRs: 8,
    totalIssues: 10,
    contributedToLastYear: 16,
    rankGrade: 'B-',
    rankPercentage: 45,
    streak: {
        totalContributions: 618,
        contributionRange: 'Aug 6, 2024 - Present',
        currentStreak: 4,
        currentStreakRange: 'Sep 22 - Sep 25',
        longestStreak: 30,
        longestStreakRange: 'May 12 - Jun 10',
    },
    languages: [
        { name: 'TypeScript', bytes: 70000, percentage: 70.0, color: '#3178c6' },
        { name: 'Go', bytes: 30000, percentage: 30.0, color: '#00ADD8' },
    ],
    activity: {
        recentCommits: 20,
        recentPullRequests: 2,
        recentIssues: 1,
        totalRecentEvents: 23,
    },
};

describe('SVG Generator', () => {
    test('should generate valid SVG markup with escaped content', () => {
        const svg = generateStatsSvg(mockStats, 'synthwave');

        assert.ok(svg.startsWith('<svg'));
        assert.ok(svg.endsWith('</svg>'));
        assert.ok(svg.includes("Test User's GitHub Stats"));
        assert.ok(svg.includes('Total Stars Earned:'));
        assert.ok(svg.includes('39'));
        assert.ok(svg.includes('B-'));
        assert.ok(svg.includes('618'));
    });

    test('should apply light theme colors when requested', () => {
        const svg = generateStatsSvg(mockStats, 'light');

        assert.ok(svg.includes('#ffffff'));
        assert.ok(svg.includes('#0969da'));
    });

    test('should generate error SVG without breaking XML tags', () => {
        const errorSvg = generateErrorSvg('User <not_found> & invalid');

        assert.ok(errorSvg.startsWith('<svg'));
        assert.ok(errorSvg.includes('&lt;not_found&gt; &amp; invalid'));
    });
});