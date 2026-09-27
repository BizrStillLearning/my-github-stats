import { NextRequest, NextResponse } from 'next/server';
import { fetchUserStatsWithCache } from '@/lib/cache/stats';
import { generateStatsSvg, generateErrorSvg } from '@/lib/svg/generator';
import { isValidGithubUsername } from '@/utils/sanitize';
import { GitHubApiError } from '@/lib/github/errors';

interface RouteContext {
    params: Promise<{
        username: string;
    }>;
}

export async function GET(
    request: NextRequest,
    context: RouteContext
): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const theme = searchParams.get('theme');

    const svgHeaders = {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900',
    };

    try {
        const { username } = await context.params;

        if (!username || !isValidGithubUsername(username)) {
            const errorSvg = generateErrorSvg('Invalid GitHub username format');
            return new NextResponse(errorSvg, {
                status: 400,
                headers: svgHeaders,
            });
        }

        const stats = await fetchUserStatsWithCache(username);
        const svgContent = generateStatsSvg(stats, theme);

        return new NextResponse(svgContent, {
            status: 200,
            headers: svgHeaders,
        });
    } catch (error: unknown) {
        let errorMessage = 'An error occurred while generating stats';
        let statusCode = 500;

        if (error instanceof GitHubApiError) {
            errorMessage = error.message;
            statusCode = error.status;
        }

        const errorSvg = generateErrorSvg(errorMessage);
        return new NextResponse(errorSvg, {
            status: statusCode,
            headers: svgHeaders,
        });
    }
}