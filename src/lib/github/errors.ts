export type GitHubErrorCode =
    | 'USER_NOT_FOUND'
    | 'RATE_LIMITED'
    | 'TIMEOUT'
    | 'INVALID_USERNAME'
    | 'GITHUB_API_ERROR';

export class GitHubApiError extends Error {
    public readonly code: GitHubErrorCode;
    public readonly status: number;

    constructor(message: string, code: GitHubErrorCode, status: number) {
        super(message);
        this.name = 'GitHubApiError';
        this.code = code;
        this.status = status;
    }
}