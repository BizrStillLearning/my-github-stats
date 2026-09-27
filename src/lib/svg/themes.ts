export interface CardTheme {
    background: string;
    borderColor: string;
    titleColor: string;
    textColor: string;
    iconColor: string;
    barTrackColor: string;
}

export const THEMES: Record<string, CardTheme> = {
    dark: {
        background: '#0d1117',
        borderColor: '#30363d',
        titleColor: '#58a6ff',
        textColor: '#c9d1d9',
        iconColor: '#8b949e',
        barTrackColor: '#21262d',
    },
    light: {
        background: '#ffffff',
        borderColor: '#d0d7de',
        titleColor: '#0969da',
        textColor: '#24292f',
        iconColor: '#57606a',
        barTrackColor: '#eaeef2',
    },
};

export function getTheme(themeName?: string | null): CardTheme {
    if (themeName && themeName.toLowerCase() === 'light') {
        return THEMES.light;
    }
    return THEMES.dark;
}