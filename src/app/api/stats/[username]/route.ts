import { NextRequest, NextResponse } from 'next/server';
import { getOrFetchStats } from '@/lib/cache/stats';
import { isValidGithubUsername } from '@/utils/sanitize';

export async function GET(
    _request: NextRequest,
    context: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await context.params;

        if (!isValidGithubUsername(username)) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'INVALID_USERNAME',
                        message: 'Invalid GitHub username provided',
                    },
                },
                { status: 400 }
            );
        }

        const stats = await getOrFetchStats(username);
        return NextResponse.json({ success: true, data: stats });
    } catch (error: unknown) {
        console.error('Error fetching stats API:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';

        return NextResponse.json(
            {
                success: false,
                error: {
                    code: 'FETCH_ERROR',
                    message,
                },
            },
            { status: 500 }
        );
    }
}