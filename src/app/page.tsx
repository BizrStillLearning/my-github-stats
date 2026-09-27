'use client';

import { useState } from 'react';
import type { GitHubStats, ApiResponse } from '@/types/stats';

export default function HomePage() {
    const [username, setUsername] = useState('');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [copied, setCopied] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        const cleanUsername = username.trim();
        if (!cleanUsername) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/stats/${encodeURIComponent(cleanUsername)}`);
            const json = (await res.json()) as ApiResponse<GitHubStats>;

            if ('data' in json && json.success) {
                setStats(json.data);
            } else if ('error' in json) {
                setError(json.error.message || 'Failed to fetch GitHub stats');
                setStats(null);
            } else {
                setError('Failed to fetch GitHub stats');
                setStats(null);
            }
        } catch {
            setError('Network error or server unreachable');
            setStats(null);
        } finally {
            setLoading(false);
        }
    }

    const cardUrl = stats
        ? `${typeof window !== 'undefined' ? window.location.origin : ''}/api/card/${stats.username}?theme=${theme}`
        : '';

    const markdownSnippet = stats
        ? `[![${stats.username}'s GitHub Stats](${cardUrl})](https://github.com/${stats.username})`
        : '';

    function handleCopy() {
        if (!markdownSnippet) return;
        navigator.clipboard.writeText(markdownSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                        My GitHub Stats
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400">
                        Generate clean, real-time SVG stats cards for your GitHub profile README.
                    </p>
                </header>

                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Enter GitHub username (e.g. torvalds)"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="flex-1 bg-[#161b22] border border-[#30363d] rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#58a6ff] transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading || !username.trim()}
                        className="bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center min-w-[120px]"
                    >
                        {loading ? (
                            <span className="inline-block animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            'Generate'
                        )}
                    </button>
                </form>

                {error && (
                    <div className="bg-[#da3633]/10 border border-[#da3633] text-[#f85149] px-4 py-3 rounded-lg max-w-xl mx-auto text-sm text-center">
                        {error}
                    </div>
                )}

                {stats && (
                    <div className="space-y-8 pt-4">
                        <section className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <h2 className="text-lg font-semibold text-white">Live Card Preview</h2>

                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-400">Theme:</span>
                                    <button
                                        onClick={() => setTheme('dark')}
                                        className={`px-3 py-1 rounded text-xs font-semibold ${
                                            theme === 'dark' ? 'bg-[#30363d] text-white' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Dark
                                    </button>
                                    <button
                                        onClick={() => setTheme('light')}
                                        className={`px-3 py-1 rounded text-xs font-semibold ${
                                            theme === 'light' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                                        }`}
                                    >
                                        Light
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-center p-4 bg-[#0d1117] rounded-lg border border-[#30363d] overflow-x-auto">
                                <img
                                    src={`/api/card/${stats.username}?theme=${theme}&t=${Date.now()}`}
                                    alt={`${stats.username}'s GitHub stats`}
                                    className="max-w-full h-auto drop-shadow-md"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-400">
                                    Markdown for GitHub README
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={markdownSnippet}
                                        className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white text-xs font-medium px-4 py-2 rounded transition-colors whitespace-nowrap"
                                    >
                                        {copied ? 'Copied!' : 'Copy Markdown'}
                                    </button>
                                </div>
                            </div>
                        </section>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl text-center">
                                <div className="text-xs text-gray-400">Stars Earned</div>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {stats.starsCount.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl text-center">
                                <div className="text-xs text-gray-400">Total Forks</div>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {stats.forksCount.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl text-center">
                                <div className="text-xs text-gray-400">Original Repos</div>
                                <div className="text-2xl font-bold text-white mt-1">{stats.originalRepos}</div>
                            </div>
                            <div className="bg-[#161b22] border border-[#30363d] p-4 rounded-xl text-center">
                                <div className="text-xs text-gray-400">Followers</div>
                                <div className="text-2xl font-bold text-white mt-1">
                                    {stats.followers.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {stats.languages.length > 0 && (
                            <section className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 space-y-4">
                                <h3 className="text-base font-semibold text-white">Top Languages Distribution</h3>
                                <div className="space-y-3">
                                    {stats.languages.map((lang) => (
                                        <div key={lang.name} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                        <span className="flex items-center gap-2">
                          <span
                              className="inline-block w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: lang.color }}
                          />
                          <span className="font-medium text-gray-200">{lang.name}</span>
                        </span>
                                                <span className="text-gray-400">{lang.percentage}%</span>
                                            </div>
                                            <div className="w-full bg-[#21262d] rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${lang.percentage}%`,
                                                        backgroundColor: lang.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
