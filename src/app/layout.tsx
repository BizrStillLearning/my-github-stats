import './global.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'My GitHub Stats & Streak',
    description: 'Dynamic SVG GitHub stats cards generator',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className="bg-[#09070f] text-slate-200 antialiased min-h-screen">
        {children}
        </body>
        </html>
    );
}