import test, { describe } from 'node:test';
import assert from 'node:assert/strict';
import { generateStatsSvg, generateErrorSvg } from '../src/lib/svg/generator';
import type { GitHubStats } from '../src/types/stats';

const mockStats: GitHubStats = {
    username: 'testuser',
    name: 'Test <User>',
    avatarUrl: 'https://example.com/avatar.png',
    profileUrl: 'https://github.com/testuser',
    totalRepos: 10,
    forkedRepos: 2,
    originalRepos: 8,
    starsCount: 150,
    forksCount: 25,
    followers: 50,
    following: 10,
    languages: [
        { name: 'TypeScript', bytes: 8000, percentage: 80.0, color: '#3178c6' },
        { name: 'Go', bytes: 2000, percentage: 20.0, color: '#00ADD8' },
    ],
    activity: {
        recentCommits: 14,
        recentPullRequests: 2,
        recentIssues: 0,
        totalRecentEvents: 16,
    },
};

describe('SVG Generator', () => {
    test('should generate valid SVG markup with escaped content', () => {
        const svg = generateStatsSvg(mockStats, 'dark');

        assert.equal(svg.startsWith('<svg'), true);
        assert.equal(svg.endsWith('</svg>'), true);
        assert.equal(svg.includes('Test &lt;User&gt;&apos;s GitHub Stats'), true);
        assert.equal(svg.includes('<script>'), false);
        assert.equal(svg.includes('TypeScript (80%)'), true);
    });

    test('should apply light theme colors when requested', () => {
        const svgLight = generateStatsSvg(mockStats, 'light');
        assert.equal(svgLight.includes('#ffffff'), true);
    });

    test('should generate error SVG without breaking XML tags', () => {
        const errorSvg = generateErrorSvg('User not found: <unknown>');
        assert.equal(errorSvg.startsWith('<svg'), true);
        assert.equal(errorSvg.includes('&lt;unknown&gt;'), true);
    });
});