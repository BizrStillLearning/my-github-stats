import { NextRequest, NextResponse } from 'next/server';
import { fetchUserStatsWithCache } from '@/lib/cache/stats';
import { isValidGithubUsername } from '@/utils/sanitize';
import { GitHubApiError } from '@/lib/github/errors';
import { ApiResponse, GitHubStats } from '@/types/stats';

interface RouteContext {
    params: Promise<{
        username: string;
    }>;
}

export async function GET(
    _request: NextRequest,
    context: RouteContext
): Promise<NextResponse<ApiResponse<GitHubStats>>> {
    try {
        const { username } = await context.params;

        if (!username || !isValidGithubUsername(username)) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_USERNAME',
                        message: 'Invalid GitHub username format',
                    },
                },
                { status: 400 }
            );
        }

        const stats = await fetchUserStatsWithCache(username);

        return NextResponse.json(
            {
                success: true,
                data: stats,
            },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900',
                },
            }
        );
    } catch (error: unknown) {
        if (error instanceof GitHubApiError) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: error.code,
                        message: error.message,
                    },
                },
                { status: error.status }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'An unexpected internal server error occurred',
                },
            },
            { status: 500 }
        );
    }
}