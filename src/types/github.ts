export interface GitHubUserResponse {
    login: string;
    name: string | null;
    avatar_url: string;
    html_url: string;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
}

export interface GitHubRepositoryResponse {
    id: number;
    name: string;
    full_name: string;
    fork: boolean;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    size: number;
}

export type GitHubLanguagesResponse = Record<string, number>;

export interface GitHubEventActor {
    id: number;
    login: string;
}

export interface GitHubEvent {
    id: string;
    type: string;
    actor: GitHubEventActor;
    created_at: string;
    payload?: {
        action?: string;
        commits?: Array<{
            sha: string;
            message: string;
        }>;
    };
}