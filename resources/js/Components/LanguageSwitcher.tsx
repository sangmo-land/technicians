import { useTranslation } from '@/hooks/useTranslation';
import { useState, useRef, useEffect } from 'react';

const languages = [
    { code: 'en', label: 'EN', flag: '🇬🇧', name: 'English' },
    { code: 'fr', label: 'FR', flag: '🇫🇷', name: 'Français' },
];

export default function LanguageSwitcher({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
    const { locale, switchLocale } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const current = languages.find((l) => l.code === locale) || languages[0];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const textColor = variant === 'dark' ? 'text-slate-300 hover:text-white' : 'text-gray-600 hover:text-gray-900';
    const bgColor = variant === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200';
    const hoverBg = variant === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-gray-50';
    const activeBg = variant === 'dark' ? 'bg-slate-700' : 'bg-blue-50';

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${textColor}`}
            >
                <span className="text-base leading-none">{current.flag}</span>
                <span>{current.label}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className={`absolute right-0 mt-1 w-36 rounded-lg border shadow-lg z-50 overflow-hidden ${bgColor}`}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => { switchLocale(lang.code); setOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-colors ${hoverBg} ${locale === lang.code ? activeBg : ''} ${textColor}`}
                        >
                            <span className="text-base leading-none">{lang.flag}</span>
                            <span>{lang.name}</span>
                            {locale === lang.code && (
                                <svg className="w-4 h-4 ml-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
