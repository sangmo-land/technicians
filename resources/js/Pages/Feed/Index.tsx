import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import InputError from '@/Components/InputError';
import { useTranslation } from '@/hooks/useTranslation';
import { cameroonRegions } from '@/data/cameroonLocations';
import { getCategoryColor } from '@/utils/categoryColors';
import { JobCategory, PaginatedData } from '@/types';

interface FeedUser {
    id: number;
    name: string;
    avatar?: string | null;
    phone?: string | null;
    worker_profile?: { id: number } | null;
}

interface Interest {
    id: number;
    user_id: number;
    message?: string | null;
    created_at: string;
    user: FeedUser;
}

interface Comment {
    id: number;
    user_id: number;
    body: string;
    created_at: string;
    user: FeedUser;
}

interface Post {
    id: number;
    user_id: number;
    description: string;
    city?: string | null;
    state?: string | null;
    technicians_needed?: number | null;
    budget?: string | null;
    status: 'open' | 'filled' | 'closed';
    created_at: string;
    interests_count: number;
    likes_count: number;
    comments_count: number;
    liked_by_me: boolean;
    notified_count: number;
    interests: Interest[];
    comments: Comment[];
    user: FeedUser;
    category?: { id: number; name: string } | null;
}

interface FeaturedWorker {
    id: number;
    user_id: number;
    title?: string | null;
    city?: string | null;
    state?: string | null;
    daily_rate?: string | number | null;
    availability?: string | null;
    user: FeedUser;
    job_categories?: { id: number; name: string }[];
}

interface SearchResult {
    id: number;
    name: string;
    avatar?: string | null;
    title?: string | null;
    location?: string | null;
}

interface Props {
    posts: PaginatedData<Post>;
    categories: JobCategory[];
    filters: { category?: string; region?: string; status?: string };
    featuredWorkers: FeaturedWorker[];
}

function Avatar({ user, size = 'w-10 h-10' }: { user: { name: string; avatar?: string | null }; size?: string }) {
    return (
        <div className={`${size} rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden`}>
            {user.avatar ? (
                <img src={`/storage/${user.avatar}`} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
                <span className="text-slate-600 font-bold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
            )}
        </div>
    );
}

/* ── Shared section heading ── */
function SectionHeader({ label, action }: { label: string; action?: React.ReactNode }) {
    return (
        <div className="mb-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" aria-hidden="true" />
                {label}
            </h2>
            {action}
        </div>
    );
}

/* ── Live technician search (typeahead) ───────────────────── */
function WorkerSearch({ large = false }: { large?: boolean }) {
    const { t } = useTranslation();
    const [q, setQ] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        const trimmed = q.trim();
        if (trimmed.length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }
        setLoading(true);
        const id = setTimeout(() => {
            fetch(`/workers-search?q=${encodeURIComponent(trimmed)}`, { headers: { Accept: 'application/json' } })
                .then((r) => r.json())
                .then((data) => {
                    setResults(data);
                    setOpen(true);
                })
                .catch(() => setResults([]))
                .finally(() => setLoading(false));
        }, 300);
        return () => clearTimeout(id);
    }, [q]);

    const goToAllResults = () => {
        router.get('/workers', q.trim() ? { search: q.trim() } : {});
    };

    return (
        <div ref={ref} className="relative w-full">
            <div className={`flex items-center transition-all ${
                large
                    ? 'bg-white rounded-2xl shadow-2xl shadow-black/20 p-2 pl-5 focus-within:ring-4 focus-within:ring-amber-500/20'
                    : 'bg-gray-100 rounded-xl focus-within:bg-white border border-transparent focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 px-4'
            }`}>
                <svg className={`${large ? 'w-5 h-5' : 'w-4 h-4'} text-gray-400 flex-shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={() => q.trim().length >= 2 && setOpen(true)}
                    onKeyDown={(e) => { if (e.key === 'Enter') goToAllResults(); }}
                    placeholder={t('feed.searchWorkersPlaceholder')}
                    className={`w-full border-0 focus:ring-0 text-gray-900 placeholder-gray-400 bg-transparent ${large ? 'py-3.5 px-3 text-base' : 'py-2.5 px-3 text-sm'}`}
                />
                {loading && (
                    <svg className="w-4 h-4 text-gray-400 gear-spin flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                )}
                {large && (
                    <button
                        type="button"
                        onClick={goToAllResults}
                        aria-label={t('feed.seeAllResults')}
                        className="ml-2 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 transition-all hover:bg-amber-400 hover:scale-[1.03]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                        </svg>
                    </button>
                )}
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-black/10 overflow-hidden z-40"
                    >
                        {results.length === 0 ? (
                            <p className="px-4 py-4 text-sm text-gray-400 text-center">{t('feed.noResults')}</p>
                        ) : (
                            <div className="py-1.5">
                                {results.map((worker) => (
                                    <Link key={worker.id} href={`/workers/${worker.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                                        <Avatar user={worker} size="w-9 h-9" />
                                        <div className="min-w-0 text-left">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{worker.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{[worker.title, worker.location].filter(Boolean).join(' · ')}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                        <button onClick={goToAllResults} className="w-full px-4 py-3 border-t border-gray-100 text-sm font-bold text-amber-600 hover:bg-amber-50 transition-colors text-center">
                            {t('feed.seeAllResults')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FeedIndex({ posts, categories, filters, featuredWorkers }: Props) {
    const { auth } = usePage().props as any;
    const { t } = useTranslation();

    function timeAgo(dateStr: string) {
        const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
        if (days === 0) return t('common.today');
        if (days === 1) return t('common.yesterday');
        if (days < 7) return t('common.daysAgo', { n: days });
        if (days < 30) return t('common.weeksAgo', { n: Math.floor(days / 7) });
        return new Date(dateStr).toLocaleDateString();
    }

    const translateCategory = (name: string) =>
        t(`categories.${name}`) !== `categories.${name}` ? t(`categories.${name}`) : name;

    /* ── Composer ─────────────────────────────────────────── */
    const { data, setData, post: submitPost, processing, errors, reset } = useForm({
        description: '',
        category_id: '',
        city: '',
        state: '',
        technicians_needed: '',
        budget: '',
    });

    const [composerExpanded, setComposerExpanded] = useState(false);

    const publish: FormEventHandler = (e) => {
        e.preventDefault();
        submitPost(route('feed.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setComposerExpanded(false);
            },
        });
    };

    /* ── Filters ──────────────────────────────────────────── */
    const applyFilter = (key: string, value: string) => {
        const next = { ...filters, [key]: value || undefined };
        router.get(route('home'), next as any, { preserveState: true, preserveScroll: true });
    };

    const statusTabs = [
        { value: '', label: t('feed.allPosts') },
        { value: 'open', label: t('feed.statusOpen') },
        { value: 'filled', label: t('feed.statusFilled') },
        { value: 'closed', label: t('feed.statusClosed') },
    ];

    return (
        <AppLayout>
            <Head title={t('feed.pageTitle')}>
                <meta name="description" content={t('home.seoDescription')} />
            </Head>

            {/* Spacious marketplace hero */}
            <section className="relative isolate overflow-hidden bg-[#0b1220]">
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    <div className="absolute -top-48 left-[45%] h-[520px] w-[520px] rounded-full bg-blue-500/[0.12] blur-[120px]" />
                    <div className="absolute -bottom-48 -right-32 h-[480px] w-[480px] rounded-full bg-amber-400/[0.12] blur-[110px]" />
                    <div className="absolute inset-0 opacity-[0.035]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
                        backgroundSize: '64px 64px',
                    }} />
                </div>

                <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)] lg:px-10 lg:py-24">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold tracking-wide text-slate-200 backdrop-blur-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                            </span>
                            {t('siteHome.availableNow')}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="max-w-3xl text-5xl font-bold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl lg:leading-[1.02]"
                        >
                            {t('siteHome.headline')}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12 }}
                            className="mt-7 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg"
                        >
                            {t('siteHome.sub')}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-9 max-w-2xl"
                        >
                            <WorkerSearch large />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.55 }}
                        className="relative hidden lg:block"
                    >
                        <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-7 shadow-2xl shadow-black/20 backdrop-blur-xl">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">{t('siteHome.availableNow')}</p>
                                    <p className="mt-2 text-2xl font-bold text-white">{featuredWorkers.length} {t('home.skilledWorkers')}</p>
                                </div>
                                <Link href="/workers" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-colors hover:bg-amber-500 hover:text-slate-950">
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" /></svg>
                                </Link>
                            </div>

                            <div className="mt-7 space-y-3">
                                {featuredWorkers.length === 0 && (
                                    <div className="rounded-2xl border border-white/[0.06] bg-black/10 px-5 py-8 text-center text-sm text-slate-400">
                                        {t('siteHome.noWorkersYet')}
                                    </div>
                                )}
                                {featuredWorkers.slice(0, 3).map((worker) => {
                                    const trade = worker.title || worker.job_categories?.[0]?.name;
                                    return (
                                        <Link key={worker.id} href={`/workers/${worker.id}`} className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-black/10 p-3.5 transition-all hover:border-white/15 hover:bg-white/[0.08]">
                                            <div className="ring-2 ring-white/10 rounded-full">
                                                <Avatar user={worker.user} size="w-12 h-12" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-white">{worker.user.name}</p>
                                                <p className="mt-0.5 truncate text-sm text-slate-400">{trade ? translateCategory(trade) : t('siteHome.available')}</p>
                                            </div>
                                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,.12)]" />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="absolute -bottom-5 -left-5 rounded-2xl border border-white/10 bg-slate-950/90 px-5 py-3 text-sm font-medium text-slate-300 shadow-xl backdrop-blur">
                            <span className="mr-2 text-amber-400">●</span>
                            {t('feed.howItWorks')}: {t('feed.step3')}
                        </div>
                    </motion.div>
                </div>
            </section>

            <div className="relative min-h-screen bg-slate-50 py-14 md:py-20">
                <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">

                    {/* ══ Workers first: site-badge cards ══ */}
                    <section className="mb-20">
                        <SectionHeader
                            label={t('siteHome.availableNow')}
                            action={
                                <Link href="/workers" className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:text-amber-600 hover:shadow-md">
                                    {t('siteHome.viewAll')}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            }
                        />
                        {featuredWorkers.length === 0 ? (
                            <div className="bg-white rounded-xl border border-slate-200/70 p-10 text-center text-sm text-gray-400">
                                {t('siteHome.noWorkersYet')}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                                {featuredWorkers.map((worker, i) => (
                                    <WorkerBadgeCard key={worker.id} worker={worker} index={i} t={t} translateCategory={translateCategory} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ══ The job board ══ */}
                    <SectionHeader label={t('siteHome.onTheBoard')} />
                    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-10">

                    {/* ── Supporting sidebar ───────────────────────── */}
                    <aside className="hidden lg:order-2 lg:sticky lg:top-24 lg:block space-y-5">
                        {auth?.user ? (
                            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-lg shadow-slate-300/30 overflow-hidden">
                                <div className="h-14 bg-slate-900 border-b-4 border-amber-500" />
                                <div className="px-5 pb-5">
                                    <div className="-mt-8 flex items-end gap-3">
                                        <div className="ring-4 ring-white rounded-full">
                                            <Avatar user={auth.user} size="w-14 h-14" />
                                        </div>
                                    </div>
                                    <div className="mt-2 min-w-0">
                                        <p className="font-bold text-gray-900 truncate">{auth.user.name}</p>
                                        <p className="text-xs text-gray-400 truncate">{auth.user.email}</p>
                                    </div>
                                <nav className="mt-4 pt-4 border-t border-gray-100 space-y-0.5">
                                    {auth.worker_profile_id && (
                                        <Link href={`/workers/${auth.worker_profile_id}`} className="flex items-center gap-3 px-2 py-2 -mx-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                                            {t('nav.myProfile')}
                                        </Link>
                                    )}
                                    <Link href="/notifications" className="flex items-center gap-3 px-2 py-2 -mx-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                                        {t('nav.notifications')}
                                    </Link>
                                    <Link href="/workers" className="flex items-center gap-3 px-2 py-2 -mx-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                        {t('nav.findWorkers')}
                                    </Link>
                                </nav>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-slate-200/70 shadow-lg shadow-slate-300/30 overflow-hidden">
                                <div className="h-14 bg-slate-900 border-b-4 border-amber-500" />
                                <div className="p-5">
                                <p className="font-bold text-gray-900">{t('feed.heading')}</p>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t('feed.loginToPost')}</p>
                                <Link href="/register" className="mt-4 block text-center bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2.5 rounded-full text-sm font-bold transition-colors">
                                    {t('nav.signUp')}
                                </Link>
                                <Link href="/login" className="mt-2 block text-center border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors">
                                    {t('nav.logIn')}
                                </Link>
                                </div>
                            </div>
                        )}

                        {/* How it works */}
                        <div className="rounded-2xl border border-slate-200/70 shadow-lg shadow-slate-300/30 overflow-hidden bg-slate-900 p-5 text-white">
                            <p className="font-display uppercase tracking-wide text-[15px] mb-4 flex items-center gap-2.5">
                                <span className="inline-block w-2 h-4 bg-amber-500 -skew-x-12" aria-hidden="true" />
                                {t('feed.howItWorks')}
                            </p>
                            <ul className="space-y-3.5">
                                {[
                                    { n: '1', text: t('feed.step1') },
                                    { n: '2', text: t('feed.step2') },
                                    { n: '3', text: t('feed.step3') },
                                ].map((s) => (
                                    <li key={s.n} className="flex items-start gap-3">
                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center bg-amber-500 -skew-x-6 text-[11px] font-extrabold text-slate-900">{s.n}</span>
                                        <span className="text-[13px] text-slate-300 leading-snug">{s.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {categories.length > 0 && (
                            <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                                <p className="text-[15px] font-bold text-gray-900 mb-4">{t('feed.popularTrades')}</p>
                                <div className="flex flex-wrap gap-2">
                                    {categories.slice(0, 10).map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => applyFilter('category', String(c.id))}
                                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold ring-1 ring-inset transition-transform hover:-translate-y-0.5 ${getCategoryColor(c.name)}`}
                                        >
                                            {translateCategory(c.name)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* ── Center: timeline ─────────────────────────── */}
                    <main className="min-w-0 max-w-3xl mx-auto lg:order-1 lg:mx-0 lg:max-w-none">

                        {/* Mobile guest CTA */}
                        {!auth?.user && (
                            <div className="lg:hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex items-center justify-between gap-3">
                                <p className="text-sm text-gray-600 flex-1">{t('feed.loginToPost')}</p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <Link href="/login" className="border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors">
                                        {t('nav.logIn')}
                                    </Link>
                                    <Link href="/register" className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors">
                                        {t('nav.signUp')}
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="overflow-visible rounded-[1.75rem] border border-slate-200/70 bg-white shadow-sm">
                            {/* Status tabs */}
                            <div className="flex border-b border-gray-100 px-2 pt-2" role="tablist">
                                {statusTabs.map((tab) => {
                                    const active = (filters.status || '') === tab.value;
                                    return (
                                        <button
                                            key={tab.value}
                                            role="tab"
                                            aria-selected={active}
                                            onClick={() => applyFilter('status', tab.value)}
                                            className={`relative flex-1 rounded-t-xl py-3.5 text-sm transition-colors hover:bg-gray-50 ${
                                                active ? 'font-bold text-gray-900' : 'font-medium text-gray-500'
                                            }`}
                                        >
                                            {tab.label}
                                            {active && <span className="absolute bottom-0 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-amber-500" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Composer */}
                            {auth?.user && (
                                <form onSubmit={publish} className="border-b border-gray-100 px-5 py-5 sm:px-6">
                                    <div className="flex gap-3">
                                        <Avatar user={auth.user} />
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            onFocus={() => setComposerExpanded(true)}
                                            placeholder={t('feed.composerPlaceholder')}
                                            rows={composerExpanded ? 3 : 1}
                                            className="flex-1 resize-none border-0 bg-transparent pt-2 text-base text-gray-900 placeholder-gray-400 focus:ring-0"
                                        />
                                    </div>
                                    <InputError message={errors.description} className="mt-1 ml-13" />

                                    <AnimatePresence>
                                        {composerExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 sm:pl-[52px]">
                                                    <select
                                                        value={data.category_id}
                                                        onChange={(e) => setData('category_id', e.target.value)}
                                                        className="rounded-xl border-gray-200 text-xs text-gray-600 focus:border-amber-500 focus:ring-amber-500"
                                                    >
                                                        <option value="">{t('feed.anyCategory')}</option>
                                                        {categories.map((c) => (
                                                            <option key={c.id} value={c.id}>{translateCategory(c.name)}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={data.state}
                                                        onChange={(e) => setData('state', e.target.value)}
                                                        className="rounded-xl border-gray-200 text-xs text-gray-600 focus:border-amber-500 focus:ring-amber-500"
                                                    >
                                                        <option value="">{t('feed.selectRegion')}</option>
                                                        {cameroonRegions.map((r) => (
                                                            <option key={r.name} value={r.name}>{r.name}</option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        value={data.city}
                                                        onChange={(e) => setData('city', e.target.value)}
                                                        placeholder={t('feed.detailsCity')}
                                                        className="rounded-xl border-gray-200 text-xs text-gray-600 placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500"
                                                    />
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={100}
                                                        value={data.technicians_needed}
                                                        onChange={(e) => setData('technicians_needed', e.target.value)}
                                                        placeholder={t('feed.detailsNeeded')}
                                                        className="rounded-xl border-gray-200 text-xs text-gray-600 placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={data.budget}
                                                        onChange={(e) => setData('budget', e.target.value)}
                                                        placeholder={t('feed.budgetPlaceholder')}
                                                        className="col-span-2 rounded-xl border-gray-200 text-xs text-gray-600 placeholder-gray-400 focus:border-amber-500 focus:ring-amber-500 sm:col-span-1"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex justify-end mt-3">
                                        <button
                                            type="submit"
                                            disabled={processing || data.description.trim().length < 10}
                                            className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            {t('feed.post')}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Trade / region filter row */}
                            <div className="flex items-center gap-1 rounded-b-[1.75rem] bg-slate-50/80 px-5 py-3 sm:px-6">
                                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>
                                <select
                                    value={filters.category || ''}
                                    onChange={(e) => applyFilter('category', e.target.value)}
                                    className="min-w-0 flex-1 sm:flex-none sm:w-auto border-0 bg-transparent text-xs font-medium text-gray-500 py-1 pl-1 pr-7 focus:ring-0 cursor-pointer hover:text-gray-800 transition-colors"
                                >
                                    <option value="">{t('feed.allTrades')}</option>
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>{translateCategory(c.name)}</option>
                                    ))}
                                </select>
                                <select
                                    value={filters.region || ''}
                                    onChange={(e) => applyFilter('region', e.target.value)}
                                    className="min-w-0 flex-1 sm:flex-none sm:w-auto border-0 bg-transparent text-xs font-medium text-gray-500 py-1 pl-1 pr-7 focus:ring-0 cursor-pointer hover:text-gray-800 transition-colors"
                                >
                                    <option value="">{t('feed.allRegions')}</option>
                                    {cameroonRegions.map((r) => (
                                        <option key={r.name} value={r.name}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                            </div>

                            {/* Timeline */}
                            {posts.data.length === 0 ? (
                                <div className="rounded-[1.75rem] border border-slate-200/70 bg-white p-14 text-center shadow-sm">
                                    <div className="w-14 h-14 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-4">
                                        <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2 18a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1H3a1 1 0 00-1 1v2zM10 10V5a1 1 0 011-1h2a1 1 0 011 1v5M4 15v-3a6 6 0 016-6M14 6a6 6 0 016 6v3" />
                                        </svg>
                                    </div>
                                    <h3 className="font-bold text-gray-900">{t('feed.emptyFeed')}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{t('feed.emptyFeedHint')}</p>
                                </div>
                            ) : (
                                posts.data.map((post) => (
                                    <PostRow
                                        key={post.id}
                                        post={post}
                                        auth={auth}
                                        t={t}
                                        timeAgo={timeAgo}
                                        translateCategory={translateCategory}
                                    />
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {posts.last_page > 1 && (
                            <div className="flex flex-wrap justify-center gap-1.5 mt-6">
                                {posts.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveScroll
                                            className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-slate-900 text-white'
                                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span key={i} className="px-3.5 py-2 rounded-full text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                ))}
                            </div>
                        )}
                    </main>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* ── Timeline post row ────────────────────────────────────── */
function PostRow({
    post,
    auth,
    t,
    timeAgo,
    translateCategory,
}: {
    post: Post;
    auth: any;
    t: (key: string, params?: Record<string, string | number>) => string;
    timeAgo: (dateStr: string) => string;
    translateCategory: (name: string) => string;
}) {
    const [showInterested, setShowInterested] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [commentBody, setCommentBody] = useState('');
    const [sendingComment, setSendingComment] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isOwner = auth?.user?.id === post.user_id;
    const myInterest = auth?.user ? post.interests.find((i) => i.user_id === auth.user.id) : undefined;
    const isTechnician = !!auth?.worker_profile_id;

    useEffect(() => {
        if (!menuOpen) return;
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [menuOpen]);

    const toggleInterest = () => {
        if (!auth?.user) {
            router.get('/login');
            return;
        }
        router.post(route('feed.interest', post.id), {}, { preserveScroll: true });
    };

    const toggleLike = () => {
        if (!auth?.user) {
            router.get('/login');
            return;
        }
        router.post(route('feed.like', post.id), {}, { preserveScroll: true });
    };

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        const body = commentBody.trim();
        if (!body || sendingComment) return;
        setSendingComment(true);
        router.post(route('feed.comments.store', post.id), { body }, {
            preserveScroll: true,
            onSuccess: () => setCommentBody(''),
            onFinish: () => setSendingComment(false),
        });
    };

    const deleteComment = (commentId: number) => {
        router.delete(route('feed.comments.destroy', commentId), { preserveScroll: true });
    };

    const setStatus = (status: string) => {
        setMenuOpen(false);
        router.patch(route('feed.status', post.id), { status }, { preserveScroll: true });
    };

    const deletePost = () => {
        setMenuOpen(false);
        if (confirm(t('feed.confirmDelete'))) {
            router.delete(route('feed.destroy', post.id), { preserveScroll: true });
        }
    };

    return (
        <article className="rounded-[1.75rem] border border-slate-200/70 bg-white px-5 py-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60 sm:px-6 sm:py-6">
            <div className="flex gap-4">
                {post.user.worker_profile ? (
                    <Link href={`/workers/${post.user.worker_profile.id}`} className="flex-shrink-0">
                        <Avatar user={post.user} />
                    </Link>
                ) : (
                    <Avatar user={post.user} />
                )}

                <div className="flex-1 min-w-0">
                    {/* Header line */}
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-[15px] text-gray-900 truncate">{post.user.name}</span>
                        {post.status === 'open' ? (
                            <span title={t('feed.statusOpen')} className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                        ) : (
                            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${post.status === 'filled' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                {post.status === 'filled' ? t('feed.statusFilled') : t('feed.statusClosed')}
                            </span>
                        )}
                        <span className="text-sm text-gray-400 flex-shrink-0">· {timeAgo(post.created_at)}</span>

                        {isOwner && (
                            <div ref={menuRef} className="relative ml-auto">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    aria-label="Post menu"
                                    className="p-1.5 -my-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                >
                                    <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M6.75 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM13.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM20.25 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /></svg>
                                </button>
                                <AnimatePresence>
                                    {menuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.1 }}
                                            className="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-gray-100 shadow-xl z-30 py-1 overflow-hidden"
                                        >
                                            {post.status === 'open' ? (
                                                <button onClick={() => setStatus('filled')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                                    {t('feed.markFilled')}
                                                </button>
                                            ) : (
                                                <button onClick={() => setStatus('open')} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                                    {t('feed.reopen')}
                                                </button>
                                            )}
                                            <button onClick={deletePost} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                                                {t('feed.delete')}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <p className="mt-3 text-base leading-7 text-gray-800 whitespace-pre-line">{post.description}</p>

                    {/* Tags: trade + location + budget */}
                    {(post.category || post.city || post.state || post.budget) && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {post.category && (
                                <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold ring-1 ring-inset ${getCategoryColor(post.category.name)}`}>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" /></svg>
                                    {translateCategory(post.category.name)}
                                </span>
                            )}
                            {(post.city || post.state) && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-200/80">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                    {[post.city, post.state].filter(Boolean).join(', ')}
                                </span>
                            )}
                            {post.budget && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200/80">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {post.budget}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Positions progress */}
                    {post.technicians_needed ? (
                        <div className="mt-5 max-w-sm">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-semibold text-slate-500">
                                    {t('feed.slots', { count: post.interests_count, needed: post.technicians_needed })}
                                </span>
                                {post.interests_count >= post.technicians_needed && (
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">✓</span>
                                )}
                            </div>
                            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, Math.round((post.interests_count / post.technicians_needed) * 100))}%` }}
                                    transition={{ duration: 0.7, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${post.interests_count >= post.technicians_needed ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-400'}`}
                                />
                            </div>
                        </div>
                    ) : null}

                    {/* Action row */}
                    <div className="mt-5 flex max-w-md items-center justify-between border-t border-slate-100 pt-3 -ml-2">
                        {/* Comment */}
                        <button
                            onClick={() => setShowComments(!showComments)}
                            title={t('feed.comment')}
                            className="group inline-flex items-center gap-1 p-2 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                        >
                            <span className="p-1 -m-1 rounded-full group-hover:bg-blue-50 transition-colors">
                                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" /></svg>
                            </span>
                            {post.comments_count > 0 && <span className="text-[13px]">{post.comments_count}</span>}
                        </button>

                        {/* Like */}
                        <motion.button
                            whileTap={{ scale: 0.85 }}
                            onClick={toggleLike}
                            title={post.liked_by_me ? t('feed.liked') : t('feed.like')}
                            className={`group inline-flex items-center gap-1 p-2 rounded-full transition-colors ${post.liked_by_me ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'}`}
                        >
                            <span className="p-1 -m-1 rounded-full group-hover:bg-rose-50 transition-colors">
                                <svg className="w-[18px] h-[18px]" fill={post.liked_by_me ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                            </span>
                            {post.likes_count > 0 && <span className="text-[13px]">{post.likes_count}</span>}
                        </motion.button>

                        {/* Interested (technicians) / notified info (owner) */}
                        {isOwner ? (
                            <button
                                onClick={() => setShowInterested(!showInterested)}
                                title={t('feed.interestedTechnicians')}
                                className="group inline-flex items-center gap-1 p-2 rounded-full text-gray-400 hover:text-amber-600 transition-colors"
                            >
                                <span className="p-1 -m-1 rounded-full group-hover:bg-amber-50 transition-colors">
                                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" /></svg>
                                </span>
                                {post.interests_count > 0 && <span className="text-[13px]">{post.interests_count}</span>}
                            </button>
                        ) : (!auth?.user || isTechnician) && (myInterest || post.status === 'open' || !auth?.user) ? (
                            <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={toggleInterest}
                                title={myInterest ? t('feed.interested') : t('feed.imInterested')}
                                className={`group inline-flex items-center gap-1 p-2 rounded-full transition-colors ${myInterest ? 'text-amber-600' : 'text-gray-400 hover:text-amber-600'}`}
                            >
                                <span className="p-1 -m-1 rounded-full group-hover:bg-amber-50 transition-colors">
                                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={myInterest ? 2.4 : 2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" /></svg>
                                </span>
                                <span className="text-[13px] hidden sm:inline">{myInterest ? t('feed.interested') : t('feed.imInterested')}</span>
                                {post.interests_count > 0 && <span className="text-[13px] sm:hidden">{post.interests_count}</span>}
                            </motion.button>
                        ) : (
                            <button
                                onClick={() => setShowInterested(!showInterested)}
                                title={t('feed.interestedTechnicians')}
                                className="group inline-flex items-center gap-1 p-2 rounded-full text-gray-400 hover:text-amber-600 transition-colors"
                            >
                                <span className="p-1 -m-1 rounded-full group-hover:bg-amber-50 transition-colors">
                                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" /></svg>
                                </span>
                                {post.interests_count > 0 && <span className="text-[13px]">{post.interests_count}</span>}
                            </button>
                        )}

                        {/* Interested avatars shortcut */}
                        {post.interests_count > 0 ? (
                            <button onClick={() => setShowInterested(!showInterested)} className="flex -space-x-1.5 items-center p-2" title={t('feed.interestedTechnicians')}>
                                {post.interests.slice(0, 3).map((interest) => (
                                    <span key={interest.id} className="ring-2 ring-white rounded-full">
                                        <Avatar user={interest.user} size="w-5 h-5" />
                                    </span>
                                ))}
                            </button>
                        ) : <span className="w-9" />}
                    </div>

                    {/* Comments thread */}
                    <AnimatePresence>
                        {showComments && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-3 mt-1 border-t border-gray-100 space-y-3">
                                    {post.comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-2.5 group">
                                            <Avatar user={comment.user} size="w-8 h-8" />
                                            <div className="min-w-0 flex-1">
                                                <div className="inline-block bg-gray-100 rounded-2xl rounded-tl-md px-3.5 py-2">
                                                    <p className="text-[13px] font-bold text-gray-900">{comment.user.name}</p>
                                                    <p className="text-[13px] text-gray-700 whitespace-pre-line break-words">{comment.body}</p>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 px-2">
                                                    <span className="text-[11px] text-gray-400">{timeAgo(comment.created_at)}</span>
                                                    {auth?.user && (comment.user_id === auth.user.id || isOwner) && (
                                                        <button
                                                            onClick={() => deleteComment(comment.id)}
                                                            className="text-[11px] text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            {t('feed.delete')}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {auth?.user ? (
                                        <form onSubmit={submitComment} className="flex items-center gap-2.5">
                                            <Avatar user={auth.user} size="w-8 h-8" />
                                            <div className="flex-1 flex items-center bg-gray-100 rounded-full focus-within:bg-white border border-transparent focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-colors pr-1.5">
                                                <input
                                                    type="text"
                                                    value={commentBody}
                                                    onChange={(e) => setCommentBody(e.target.value)}
                                                    placeholder={t('feed.writeComment')}
                                                    maxLength={1000}
                                                    className="flex-1 bg-transparent border-0 focus:ring-0 text-[13px] text-gray-800 placeholder-gray-400 py-2 px-3.5"
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!commentBody.trim() || sendingComment}
                                                    aria-label={t('feed.send')}
                                                    className="w-7 h-7 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors flex-shrink-0"
                                                >
                                                    <svg className="w-3.5 h-3.5 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" /></svg>
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <Link href="/login" className="block text-center text-[13px] font-semibold text-blue-600 hover:underline">
                                            {t('feed.loginToComment')}
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Interested technicians */}
                    <AnimatePresence>
                        {showInterested && post.interests.length > 0 && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-3 mt-1 border-t border-gray-100">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">{t('feed.interestedTechnicians')}</p>
                                    <div className="space-y-2.5">
                                        {post.interests.map((interest) => (
                                            <div key={interest.id} className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <Avatar user={interest.user} size="w-8 h-8" />
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-gray-800 truncate">{interest.user.name}</p>
                                                        <p className="text-[11px] text-gray-400">{timeAgo(interest.created_at)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                                    {interest.user.worker_profile && (
                                                        <Link
                                                            href={`/workers/${interest.user.worker_profile.id}`}
                                                            className="px-3 py-1.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                                        >
                                                            {t('feed.viewProfile')}
                                                        </Link>
                                                    )}
                                                    {isOwner && interest.user.phone && (
                                                        <a
                                                            href={`https://wa.me/${interest.user.phone.replace(/\D/g, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-[#25D366]/10 text-[#128C4A] hover:bg-[#25D366]/20 transition-colors"
                                                        >
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                                            {t('feed.whatsApp')}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </article>
    );
}

/* ── Signature: technician card as a site access badge ────── */
function WorkerBadgeCard({
    worker,
    index,
    t,
    translateCategory,
}: {
    worker: FeaturedWorker;
    index: number;
    t: (key: string, params?: Record<string, string | number>) => string;
    translateCategory: (name: string) => string;
}) {
    const trade = worker.title || (worker.job_categories?.[0] && translateCategory(worker.job_categories[0].name)) || null;
    const location = [worker.city, worker.state?.split('/')[0]?.trim()].filter(Boolean).join(', ');
    const rate = worker.daily_rate && Number(worker.daily_rate) > 0
        ? `${Number(worker.daily_rate).toLocaleString()} FCFA${t('siteHome.perDay')}`
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.35), type: 'spring', stiffness: 260, damping: 24 }}
            className="h-full"
        >
            <Link
                href={`/workers/${worker.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/70"
            >
                <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200/70">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        {t('siteHome.available')}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-all group-hover:bg-amber-500 group-hover:text-slate-950">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" /></svg>
                    </span>
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <div className="rounded-full ring-4 ring-slate-100 transition-colors group-hover:ring-amber-100">
                        <Avatar user={worker.user} size="w-16 h-16" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-bold tracking-tight text-gray-900">{worker.user.name}</p>
                        {trade && <p className="mt-1 truncate text-sm text-gray-500">{trade}</p>}
                    </div>
                </div>

                {worker.job_categories?.[0] && (
                    <span className={`mt-6 inline-flex w-fit rounded-lg px-3 py-1.5 text-[11px] font-bold ring-1 ring-inset ${getCategoryColor(worker.job_categories[0].name)}`}>
                        {translateCategory(worker.job_categories[0].name)}
                    </span>
                )}

                <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
                    {location ? (
                        <p className="inline-flex min-w-0 items-center gap-1.5 truncate text-xs text-gray-500">
                            <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                            {location}
                        </p>
                    ) : <span />}
                    {rate && <span className="flex-shrink-0 text-xs font-bold text-slate-700">{rate}</span>}
                </div>
            </Link>
        </motion.div>
    );
}
