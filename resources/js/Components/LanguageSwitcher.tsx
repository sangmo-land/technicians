import { useTranslation } from '@/hooks/useTranslation';
import { useState, useRef, useEffect } from 'react';

/* Inline SVG flag components for cross-platform rendering */
function GBFlag({ className = '' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
            <path fill="#012169" d="M0 0h640v480H0z" />
            <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 302 81 480H0v-60l239-178L0 64V0z" />
            <path fill="#C8102E" d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z" />
            <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z" />
            <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z" />
        </svg>
    );
}

function FRFlag({ className = '' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
            <path fill="#002395" d="M0 0h213.3v480H0z" />
            <path fill="#FFF" d="M213.3 0h213.4v480H213.3z" />
            <path fill="#ED2939" d="M426.7 0H640v480H426.7z" />
        </svg>
    );
}

const FlagComponent: Record<string, ({ className }: { className?: string }) => JSX.Element> = {
    en: GBFlag,
    fr: FRFlag,
};

const languages = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'fr', label: 'FR', name: 'Français' },
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
                {(() => { const Flag = FlagComponent[current.code]; return <Flag className="w-5 h-5 rounded-sm shadow-sm ring-1 ring-black/10" />; })()}
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
                            {(() => { const Flag = FlagComponent[lang.code]; return <Flag className="w-5 h-5 rounded-sm shadow-sm ring-1 ring-black/10" />; })()}
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
