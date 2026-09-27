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
    languages: LanguageStat[];
    activity: ActivitySummary;
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