import type { GitHubStats } from '../../types/stats';
import { escapeXml } from '../../utils/sanitize';
import { getTheme } from './themes';

function formatNumber(num: number): string {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}

export function generateStatsSvg(stats: GitHubStats, themeName?: string | null): string {
    const theme = getTheme(themeName);
    const cleanName = escapeXml(stats.name);
    const cleanUsername = escapeXml(stats.username);

    const topLanguages = stats.languages.slice(0, 4);

    let currentX = 25;
    const barWidthTotal = 445;
    const progressBars = topLanguages
        .map((lang) => {
            const segmentWidth = (lang.percentage / 100) * barWidthTotal;
            const rect = `<rect x="${currentX.toFixed(1)}" y="180" width="${segmentWidth.toFixed(1)}" height="8" fill="${lang.color}" rx="2"/>`;
            currentX += segmentWidth;
            return rect;
        })
        .join('\n      ');

    const languageLegends = topLanguages
        .map((lang, index) => {
            const x = 25 + (index % 2) * 220;
            const y = 210 + Math.floor(index / 2) * 20;
            const cleanLangName = escapeXml(lang.name);
            return `
      <circle cx="${x}" cy="${y - 4}" r="4" fill="${lang.color}" />
      <text x="${x + 12}" y="${y}" class="text-sub" fill="${theme.textColor}">${cleanLangName} (${lang.percentage}%)</text>`;
        })
        .join('');

    return `<svg width="495" height="255" viewBox="0 0 495 255" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 600; }
    .stat-label { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 400; }
    .stat-val { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 700; }
    .text-sub { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; }
  </style>

  <!-- Card Border & Background -->
  <rect x="0.5" y="0.5" width="494" height="254" rx="10" fill="${theme.background}" stroke="${theme.borderColor}"/>

  <!-- Title -->
  <text x="25" y="38" class="title" fill="${theme.titleColor}">${cleanName}&apos;s GitHub Stats</text>
  <text x="470" y="38" text-anchor="end" class="text-sub" fill="${theme.iconColor}">@${cleanUsername}</text>

  <line x1="25" y1="52" x2="470" y2="52" stroke="${theme.borderColor}" stroke-width="1"/>

  <!-- Left Stats Column -->
  <g transform="translate(25, 75)">
    <!-- Stars -->
    <g transform="translate(0, 0)">
      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" fill="${theme.iconColor}"/>
      <text x="25" y="12" class="stat-label" fill="${theme.textColor}">Total Stars:</text>
      <text x="140" y="12" class="stat-val" fill="${theme.textColor}">${formatNumber(stats.starsCount)}</text>
    </g>

    <!-- Forks -->
    <g transform="translate(0, 26)">
      <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h4.5A2.25 2.25 0 0012.5 6.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zM10.25 4a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM8 10a.75.75 0 100-1.5.75.75 0 000 1.5zm0 1.5a2.25 2.25 0 110-4.5 2.25 2.25 0 010 4.5z" fill="${theme.iconColor}"/>
      <text x="25" y="12" class="stat-label" fill="${theme.textColor}">Total Forks:</text>
      <text x="140" y="12" class="stat-val" fill="${theme.textColor}">${formatNumber(stats.forksCount)}</text>
    </g>

    <!-- Repositories -->
    <g transform="translate(0, 52)">
      <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8.5V1.5z" fill="${theme.iconColor}"/>
      <text x="25" y="12" class="stat-label" fill="${theme.textColor}">Original Repos:</text>
      <text x="140" y="12" class="stat-val" fill="${theme.textColor}">${formatNumber(stats.originalRepos)}</text>
    </g>
  </g>

  <!-- Right Stats Column -->
  <g transform="translate(260, 75)">
    <!-- Followers -->
    <g transform="translate(0, 0)">
      <path d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zM1.5 13a2.5 2.5 0 012.5-2.5h3a2.5 2.5 0 012.5 2.5v1a.75.75 0 01-1.5 0v-1a1 1 0 00-1-1H4a1 1 0 00-1 1v1a.75.75 0 01-1.5 0v-1z" fill="${theme.iconColor}"/>
      <text x="25" y="12" class="stat-label" fill="${theme.textColor}">Followers:</text>
      <text x="140" y="12" class="stat-val" fill="${theme.textColor}">${formatNumber(stats.followers)}</text>
    </g>

    <!-- Recent Commits -->
    <g transform="translate(0, 26)">
      <path d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.002 4.002 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z" fill="${theme.iconColor}"/>
      <text x="25" y="12" class="stat-label" fill="${theme.textColor}">Recent Commits:</text>
      <text x="140" y="12" class="stat-val" fill="${theme.textColor}">${stats.activity.recentCommits}</text>
    </g>

    <!-- Recent PRs -->
    <g transform="translate(0, 52)">
      <path d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-1.5.75a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm1.5 7.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-1.5.75a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" fill="${theme.iconColor}"/>
      <text x="25" y="12" class="stat-label" fill="${theme.textColor}">Recent PRs:</text>
      <text x="140" y="12" class="stat-val" fill="${theme.textColor}">${stats.activity.recentPullRequests}</text>
    </g>
  </g>

  <!-- Languages Progress Bar -->
  <rect x="25" y="180" width="${barWidthTotal}" height="8" rx="2" fill="${theme.barTrackColor}"/>
  ${progressBars}

  <!-- Language Legends -->
  ${languageLegends}
</svg>`;
}

export function generateErrorSvg(message: string): string {
    const cleanMessage = escapeXml(message);
    return `<svg width="495" height="120" viewBox="0 0 495 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="495" height="120" rx="10" fill="#0d1117" stroke="#da3633"/>
  <text x="25" y="45" font-family="-apple-system, sans-serif" font-size="16" font-weight="600" fill="#f85149">GitHub Stats Error</text>
  <text x="25" y="80" font-family="-apple-system, sans-serif" font-size="13" fill="#c9d1d9">${cleanMessage}</text>
</svg>`;
}