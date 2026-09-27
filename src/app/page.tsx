'use client';

import { useState } from 'react';
import type { GitHubStats, ApiResponse, ThemeName } from '@/types/stats';
import { AVAILABLE_THEMES, THEMES } from '@/lib/svg/themes';

type ExportFormat = 'html' | 'markdown' | 'url';

export default function HomePage() {
    const [username, setUsername] = useState('BizrStillLearning');
    const [theme, setTheme] = useState<ThemeName>('synthwave');
    const [hideBorder, setHideBorder] = useState(false);
    const [outputFormat, setOutputFormat] = useState<ExportFormat>('html');
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
                setError(json.error.message || 'Gagal memuat statistik pengguna');
                setStats(null);
            } else {
                setError('Gagal memuat data statistik');
                setStats(null);
            }
        } catch {
            setError('Koneksi terputus atau server tidak merespons');
            setStats(null);
        } finally {
            setLoading(false);
        }
    }

    const queryParams = new URLSearchParams({ theme });
    if (hideBorder) queryParams.set('hide_border', 'true');

    const cardPath = stats
        ? `/api/card/${encodeURIComponent(stats.username)}?${queryParams.toString()}`
        : '';

    const fullCardUrl =
        stats && typeof window !== 'undefined'
            ? `${window.location.origin}${cardPath}`
            : cardPath;

    const markdownSnippet = stats
        ? `[![${stats.username}'s GitHub Stats](${fullCardUrl})](https://github.com/${stats.username})`
        : '';

    const htmlSnippet = stats
        ? `<p align="center">\n  <a href="https://github.com/${stats.username}">\n    <img src="${fullCardUrl}" alt="${stats.username}'s GitHub Stats" />\n  </a>\n</p>`
        : '';

    const currentSnippet =
        outputFormat === 'html'
            ? htmlSnippet
            : outputFormat === 'markdown'
                ? markdownSnippet
                : fullCardUrl;

    function handleCopy() {
        if (!currentSnippet) return;
        navigator.clipboard.writeText(currentSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] antialiased">
            <header className="border-b border-[#21262d] bg-[#161b22]/70 backdrop-blur sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        <span className="font-semibold text-sm text-white tracking-tight">GitHub Stats &amp; Streak</span>
                    </div>
                    <span className="text-xs text-[#8b949e] font-mono">github / BizrStillLearning</span>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
                <section className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
              <span className="absolute inset-y-0 left-3 flex items-center text-xs font-mono text-[#8b949e]">
                github.com/
              </span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="username"
                                className="w-full pl-24 pr-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-sm text-white placeholder-[#484f58] focus:outline-none focus:border-[#58a6ff] font-mono transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !username.trim()}
                            className="px-5 py-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-medium text-sm rounded-md transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                'Generate'
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-3 text-xs text-[#f85149] bg-[#f85149]/10 border border-[#f85149]/20 rounded px-3 py-2">
                            {error}
                        </div>
                    )}
                </section>

                {stats && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="space-y-4">
                            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-2.5">
                <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider block">
                  Border Style
                </span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setHideBorder(false)}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                                            !hideBorder
                                                ? 'bg-[#21262d] border-[#8b949e] text-white'
                                                : 'border-[#30363d] text-[#8b949e] hover:text-white'
                                        }`}
                                    >
                                        Show Border
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHideBorder(true)}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors cursor-pointer ${
                                            hideBorder
                                                ? 'bg-[#21262d] border-[#8b949e] text-white'
                                                : 'border-[#30363d] text-[#8b949e] hover:text-white'
                                        }`}
                                    >
                                        Hide Border
                                    </button>
                                </div>
                            </div>

                            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-2.5">
                                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                    Themes ({AVAILABLE_THEMES.length})
                  </span>
                                    <span className="text-xs font-mono text-[#58a6ff] capitalize">{theme}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                                    {AVAILABLE_THEMES.map((t) => {
                                        const themeObj = THEMES[t];
                                        const isSelected = theme === t;
                                        return (
                                            <button
                                                key={t}
                                                type="button"
                                                onClick={() => setTheme(t)}
                                                className={`flex items-center justify-between p-2 rounded text-xs text-left border transition-colors cursor-pointer ${
                                                    isSelected
                                                        ? 'bg-[#21262d] border-[#58a6ff] text-white'
                                                        : 'border-[#30363d] text-[#8b949e] hover:border-[#8b949e] hover:text-white'
                                                }`}
                                            >
                                                <span className="capitalize">{t}</span>
                                                <span
                                                    className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/40"
                                                    style={{ backgroundColor: themeObj.accent }}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden shadow-sm">
                                <div className="px-4 py-2.5 border-b border-[#30363d] flex items-center justify-between bg-[#0d1117]">
                  <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">
                    Card Preview
                  </span>
                                    <span className="text-xs font-mono text-[#8b949e]">
                    Rank: <span className="text-white font-bold">{stats.rankGrade}</span> ({stats.rankPercentage}%)
                  </span>
                                </div>
                                <div className="p-4 sm:p-6 bg-[#010409] flex items-center justify-center overflow-x-auto min-h-[220px]">
                                    <img
                                        src={`${cardPath}&t=${Date.now()}`}
                                        alt={`${stats.username}'s GitHub stats`}
                                        className="max-w-full h-auto"
                                    />
                                </div>
                            </div>

                            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-2.5">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                    <div className="flex items-center gap-1.5 bg-[#0d1117] p-1 rounded-md border border-[#30363d]">
                                        <button
                                            type="button"
                                            onClick={() => setOutputFormat('html')}
                                            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                                                outputFormat === 'html'
                                                    ? 'bg-[#21262d] text-white border border-[#8b949e]'
                                                    : 'text-[#8b949e] hover:text-white'
                                            }`}
                                        >
                                            HTML
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setOutputFormat('markdown')}
                                            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                                                outputFormat === 'markdown'
                                                    ? 'bg-[#21262d] text-white border border-[#8b949e]'
                                                    : 'text-[#8b949e] hover:text-white'
                                            }`}
                                        >
                                            Markdown
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setOutputFormat('url')}
                                            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                                                outputFormat === 'url'
                                                    ? 'bg-[#21262d] text-white border border-[#8b949e]'
                                                    : 'text-[#8b949e] hover:text-white'
                                            }`}
                                        >
                                            Raw URL
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="text-xs font-mono text-[#58a6ff] hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        {copied ? '✓ Copied' : 'Copy'}
                                    </button>
                                </div>

                                <textarea
                                    readOnly
                                    rows={outputFormat === 'html' ? 5 : 2}
                                    value={currentSnippet}
                                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded p-2.5 font-mono text-xs text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] resize-none"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}