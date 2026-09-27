import type { GitHubStats, CardOptions } from '../../types/stats';
import { escapeXml } from '../../utils/sanitize';
import { getTheme } from './themes';

export function generateStatsSvg(
    stats: GitHubStats,
    optionsOrTheme?: string | CardOptions
): string {
    const options: CardOptions =
        typeof optionsOrTheme === 'string'
            ? { theme: optionsOrTheme, hideBorder: false }
            : optionsOrTheme ?? {};

    const theme = getTheme(options.theme);
    const hideBorder = Boolean(options.hideBorder);
    const name = escapeXml(stats.name || stats.username);

    const ringRadius = 36;
    const circumference = 2 * Math.PI * ringRadius;
    const progressOffset = circumference - (stats.rankPercentage / 100) * circumference;

    const strokeAttr = hideBorder
        ? 'stroke="transparent" stroke-width="0"'
        : `stroke="${theme.border}" stroke-width="1.5"`;

    const starIcon = `<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="none" stroke="${theme.label}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
    const commitIcon = `<circle cx="12" cy="12" r="10" fill="none" stroke="${theme.label}" stroke-width="2"/><polyline points="12 6 12 12 16 14" fill="none" stroke="${theme.label}" stroke-width="2" stroke-linecap="round"/>`;
    const prIcon = `<circle cx="18" cy="18" r="3" fill="none" stroke="${theme.label}" stroke-width="2"/><circle cx="6" cy="6" r="3" fill="none" stroke="${theme.label}" stroke-width="2"/><path d="M13 6h3a2 2 0 0 1 2 2v7M6 9v12" fill="none" stroke="${theme.label}" stroke-width="2" stroke-linecap="round"/>`;
    const issueIcon = `<circle cx="12" cy="12" r="10" fill="none" stroke="${theme.label}" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="${theme.label}" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="${theme.label}" stroke-width="2" stroke-linecap="round"/>`;
    const contribIcon = `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" fill="none" stroke="${theme.label}" stroke-width="2"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill="none" stroke="${theme.label}" stroke-width="2"/>`;

    return `<svg width="890" height="200" viewBox="0 0 890 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .header { font: 700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: ${theme.title}; }
    .label { font: 500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: ${theme.label}; }
    .value { font: 700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: ${theme.value}; }
    .grade-text { font: 800 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: ${theme.value}; text-anchor: middle; }
    .big-num { font: 800 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: ${theme.title}; text-anchor: middle; }
    .streak-title { font: 700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: ${theme.title}; text-anchor: middle; }
    .streak-title-active { font: 700 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: ${theme.fire}; text-anchor: middle; }
    .sub-date { font: 400 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; fill: ${theme.label}; text-anchor: middle; }
  </style>

  <g transform="translate(10, 10)">
    <rect width="400" height="180" rx="8" fill="${theme.background}" ${strokeAttr}/>

    <text x="20" y="32" class="header">${name}'s GitHub Stats</text>

    <g transform="translate(20, 48)">
      <svg width="16" height="16" viewBox="0 0 24 24">${starIcon}</svg>
      <text x="26" y="13" class="label">Total Stars Earned:</text>
      <text x="235" y="13" class="value">${stats.starsCount}</text>
    </g>

    <g transform="translate(20, 72)">
      <svg width="16" height="16" viewBox="0 0 24 24">${commitIcon}</svg>
      <text x="26" y="13" class="label">Total Commits (last year):</text>
      <text x="235" y="13" class="value">${stats.totalCommitsLastYear}</text>
    </g>

    <g transform="translate(20, 96)">
      <svg width="16" height="16" viewBox="0 0 24 24">${prIcon}</svg>
      <text x="26" y="13" class="label">Total PRs:</text>
      <text x="235" y="13" class="value">${stats.totalPRs}</text>
    </g>

    <g transform="translate(20, 120)">
      <svg width="16" height="16" viewBox="0 0 24 24">${issueIcon}</svg>
      <text x="26" y="13" class="label">Total Issues:</text>
      <text x="235" y="13" class="value">${stats.totalIssues}</text>
    </g>

    <g transform="translate(20, 144)">
      <svg width="16" height="16" viewBox="0 0 24 24">${contribIcon}</svg>
      <text x="26" y="13" class="label">Contributed to (last year):</text>
      <text x="235" y="13" class="value">${stats.contributedToLastYear}</text>
    </g>

    <g transform="translate(325, 102)">
      <circle cx="0" cy="0" r="${ringRadius}" fill="none" stroke="${theme.ringBg}" stroke-width="6"/>
      <circle cx="0" cy="0" r="${ringRadius}" fill="none" stroke="${theme.ringProgress}" stroke-width="6"
              stroke-dasharray="${circumference}" stroke-dashoffset="${progressOffset}"
              stroke-linecap="round" transform="rotate(-90)"/>
      <text x="0" y="8" class="grade-text">${stats.rankGrade}</text>
    </g>
  </g>

  <g transform="translate(425, 10)">
    <rect width="455" height="180" rx="8" fill="${theme.background}" ${strokeAttr}/>

    <g transform="translate(85, 0)">
      <text x="0" y="65" class="big-num">${stats.streak.totalContributions}</text>
      <text x="0" y="98" class="streak-title">Total Contributions</text>
      <text x="0" y="128" class="sub-date">${stats.streak.contributionRange}</text>
    </g>

    <line x1="160" y1="25" x2="160" y2="155" stroke="${theme.divider}" stroke-width="1.5"/>

    <g transform="translate(235, 75)">
      <circle cx="0" cy="0" r="38" fill="none" stroke="${theme.ringBg}" stroke-width="4"/>
      <g transform="translate(-8, -48)">
        <path d="M8.5 2C8.5 2 4 6.5 4 10.5C4 13.5 6 15 8.5 15C11 15 13 13.5 13 10.5C13 6.5 8.5 2 8.5 2Z" fill="${theme.fire}"/>
        <path d="M8.5 7C8.5 7 6 9.5 6 11.5C6 13 7 14 8.5 14C10 14 11 13 11 11.5C11 9.5 8.5 7 8.5 7Z" fill="${theme.background}"/>
      </g>
      <text x="0" y="9" class="big-num" style="fill: ${theme.fire}; font-size: 26px;">${stats.streak.currentStreak}</text>
      <text x="0" y="60" class="streak-title-active">Current Streak</text>
      <text x="0" y="80" class="sub-date" style="fill: #8b949e;">${stats.streak.currentStreakRange}</text>
    </g>

    <line x1="310" y1="25" x2="310" y2="155" stroke="${theme.divider}" stroke-width="1.5"/>

    <!-- Kolom 3: Longest Streak -->
    <g transform="translate(385, 0)">
      <text x="0" y="65" class="big-num">${stats.streak.longestStreak}</text>
      <text x="0" y="98" class="streak-title">Longest Streak</text>
      <text x="0" y="128" class="sub-date">${stats.streak.longestStreakRange}</text>
    </g>
  </g>
</svg>`;
}

export function generateErrorSvg(message: string): string {
    const safeMessage = escapeXml(message);
    return `<svg width="500" height="120" viewBox="0 0 500 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="120" rx="8" fill="#2b213a" stroke="#ef3550" stroke-width="1.5"/>
  <text x="250" y="55" fill="#ef3550" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="16" font-weight="700" text-anchor="middle">Error Generating Stats</text>
  <text x="250" y="80" fill="#e2e9ec" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="12" text-anchor="middle">${safeMessage}</text>
</svg>`;
}