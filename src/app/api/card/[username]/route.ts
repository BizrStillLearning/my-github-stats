import { NextRequest, NextResponse } from 'next/server';
import { getOrFetchStats } from '@/lib/cache/stats';
import { generateStatsSvg, generateErrorSvg } from '@/lib/svg/generator';
import { isValidGithubUsername } from '@/utils/sanitize';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ username: string }> }
) {
    try {
        const { username } = await context.params;

        if (!isValidGithubUsername(username)) {
            const errorSvg = generateErrorSvg('Invalid GitHub username');
            return new NextResponse(errorSvg, {
                status: 400,
                headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
            });
        }

        const { searchParams } = new URL(request.url);
        const theme = searchParams.get('theme') || 'synthwave';
        const hideBorderParam = searchParams.get('hide_border');
        const hideBorder = hideBorderParam === 'true' || hideBorderParam === '1';

        const stats = await getOrFetchStats(username);
        const svg = generateStatsSvg(stats, { theme, hideBorder });

        return new NextResponse(svg, {
            status: 200,
            headers: {
                'Content-Type': 'image/svg+xml; charset=utf-8',
                'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=900',
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        console.error('Error generating card SVG:', error);
        const errorSvg = generateErrorSvg(message);

        return new NextResponse(errorSvg, {
            status: 200,
            headers: {
                'Content-Type': 'image/svg+xml; charset=utf-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    }
}