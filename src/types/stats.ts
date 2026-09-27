export interface LanguageStat {
    name: string;
    bytes: number;
    percentage: number;
    color: string;
}

export interface ActivitySummary {
    recentCommits: number;
    recentPullRequests: number;
    recentIssues: number;
    totalRecentEvents: number;
}

export interface StreakStats {
    totalContributions: number;
    contributionRange: string;
    currentStreak: number;
    currentStreakRange: string;
    longestStreak: number;
    longestStreakRange: string;
}

export interface GitHubStats {
    username: string;
    name: string;
    avatarUrl: string;
    profileUrl: string;
    totalRepos: number;
    forkedRepos: number;
    originalRepos: number;
    starsCount: number;
    forksCount: number;
    followers: number;
    following: number;
    totalCommitsLastYear: number;
    totalPRs: number;
    totalIssues: number;
    contributedToLastYear: number;
    rankGrade: string;
    rankPercentage: number;
    streak: StreakStats;
    languages: LanguageStat[];
    activity: ActivitySummary;
}

export type ThemeName =
    | 'synthwave'
    | 'dark'
    | 'light'
    | 'dracula'
    | 'nord'
    | 'tokyonight'
    | 'gruvbox'
    | 'catppuccin'
    | 'onedark'
    | 'monokai'
    | 'cobalt2'
    | 'radical';

export interface ThemeColors {
    background: string;
    cardBg: string;
    border: string;
    divider: string;
    title: string;
    label: string;
    value: string;
    accent: string;
    fire: string;
    ringBg: string;
    ringProgress: string;
}

export interface CardOptions {
    theme?: string | null;
    hideBorder?: boolean;
}

export interface ApiResponseSuccess<T> {
    success: true;
    data: T;
}

export interface ApiResponseError {
    success: false;
    error: {
        code: string;
        message: string;
    };
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;