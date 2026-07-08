import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import InputError from '@/Components/InputError';
import { useTranslation } from '@/hooks/useTranslation';
import { cameroonRegions } from '@/data/cameroonLocations';
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

interface SuggestedWorker {
    id: number;
    user_id: number;
    title?: string | null;
    city?: string | null;
    state?: string | null;
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
    suggestedWorkers: SuggestedWorker[];
}

function Avatar({ user, size = 'w-10 h-10' }: { user: { name: string; avatar?: string | null }; size?: string }) {
    return (
        <div className={`${size} rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden`}>
            {user.avatar ? (
                <img src={`/storage/${user.avatar}`} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
                <span className="text-white font-bold text-sm">{user.name?.charAt(0).toUpperCase()}</span>
            )}
        </div>
    );
}

/* ── Live technician search (typeahead) ───────────────────── */
function WorkerSearch() {
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
        <div ref={ref} className="relative w-full max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl shadow-black/25 px-4">
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    onFocus={() => q.trim().length >= 2 && setOpen(true)}
                    onKeyDown={(e) => { if (e.key === 'Enter') goToAllResults(); }}
                    placeholder={t('feed.searchWorkersPlaceholder')}
                    className="w-full py-3.5 px-3 border-0 focus:ring-0 text-sm text-gray-900 placeholder-slate-400 bg-transparent"
                />
                {loading && (
                    <svg className="w-4 h-4 text-amber-500 gear-spin flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                )}
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-black/20 overflow-hidden z-40"
                    >
                        {results.length === 0 ? (
                            <p className="px-4 py-4 text-sm text-gray-400 text-center">{t('feed.noResults')}</p>
                        ) : (
                            <div className="py-1.5">
                                {results.map((worker) => (
                                    <Link key={worker.id} href={`/workers/${worker.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50/60 transition-colors">
                                        <Avatar user={worker} size="w-9 h-9" />
                                        <div className="min-w-0 text-left">
                                            <p className="text-sm font-semibold text-gray-900 truncate">{worker.name}</p>
                                            <p className="text-xs text-gray-400 truncate">{[worker.title, worker.location].filter(Boolean).join(' · ')}</p>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </Link>
                                ))}
                            </div>
                        )}
                        <button onClick={goToAllResults} className="w-full px-4 py-3 border-t border-gray-100 text-sm font-semibold text-blue-600 hover:bg-blue-50/60 transition-colors text-center">
                            {t('feed.seeAllResults')}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FeedIndex({ posts, categories, filters, suggestedWorkers }: Props) {
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

    const statusStyles: Record<Post['status'], string> = {
        open: 'bg-emerald-50 text-emerald-700',
        filled: 'bg-blue-50 text-blue-700',
        closed: 'bg-gray-100 text-gray-500',
    };

    return (
        <AppLayout>
            <Head title={t('feed.pageTitle')}>
                <meta name="description" content={t('home.seoDescription')} />
            </Head>

            {/* ── Hero banner: blueprint + crane + live search ─── */}
            <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 blueprint-grid" />
                    <div className="absolute -top-24 -left-24 w-[480px] h-[480px] bg-blue-600/[0.08] rounded-full blur-[100px]" />
                    <div className="absolute -bottom-32 -right-24 w-[420px] h-[420px] bg-amber-500/[0.06] rounded-full blur-[90px]" />
                </div>

                {/* Tower crane silhouette, gently swaying */}
                <svg
                    viewBox="0 0 220 170"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="crane-sway hidden md:block absolute right-6 lg:right-16 bottom-0 h-[170px] lg:h-[200px] w-auto text-white/[0.09] pointer-events-none select-none"
                    aria-hidden="true"
                >
                    {/* base + mast */}
                    <path d="M42 170v-6h36v6M52 164V34M68 164V34M52 148h16M52 128h16M52 108h16M52 88h16M52 68h16M52 48h16" />
                    <path d="M52 148l16-20M68 128l-16-20M52 88l16-20M68 68l-16-20" strokeWidth="2" />
                    {/* cab + apex */}
                    <path d="M46 34h28v-12H46zM60 22V8" />
                    {/* jib, counter-jib, ties, counterweight */}
                    <path d="M74 30h138M74 38h130M12 30h34M60 8l84 22M60 8l150 22M60 8L20 30M12 30v14h14V30" />
                    {/* trolley cable + hook */}
                    <g className="hook-bob">
                        <path d="M158 38v40" strokeWidth="2" />
                        <path d="M166 78c0 6-8 6-8 0m4 0v-2a5 5 0 015-5" strokeWidth="2.5" />
                    </g>
                </svg>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
                    <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                        {t('feed.homeHeading')}
                    </motion.h1>
                    <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
                        className="block mx-auto mt-3 h-1.5 w-24 rounded-full hazard-stripes hazard-stripes--animated opacity-90"
                    />
                    <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400 mt-3 text-sm md:text-base max-w-xl mx-auto">
                        {t('feed.homeTagline')}
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
                        <WorkerSearch />
                    </motion.div>
                    {!auth?.user && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-5 flex items-center justify-center gap-3">
                            <Link href="/register" className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-amber-500/20">
                                {t('nav.signUp')}
                            </Link>
                            <Link href="/login" className="border border-white/15 text-slate-200 hover:bg-white/[0.06] hover:text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all">
                                {t('nav.logIn')}
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* Safety-tape divider into the feed */}
                <div className="relative h-1.5 hazard-stripes hazard-stripes--animated opacity-70" />
            </div>

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">

                    {/* ── Left rail: profile card ─────────────────── */}
                    <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24">
                        {auth?.user ? (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="h-16 bg-gradient-to-r from-slate-800 to-blue-900 blueprint-grid" />
                                <div className="px-5 pb-5 -mt-7">
                                    <Avatar user={auth.user} size="w-14 h-14" />
                                    <p className="font-bold text-gray-900 mt-3">{auth.user.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{auth.user.email}</p>
                                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
                                        {auth.worker_profile_id && (
                                            <Link href={`/workers/${auth.worker_profile_id}`} className="block px-2 py-1.5 -mx-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 transition-colors">
                                                {t('nav.myProfile')}
                                            </Link>
                                        )}
                                        <Link href="/notifications" className="block px-2 py-1.5 -mx-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 transition-colors">
                                            {t('nav.notifications')}
                                        </Link>
                                        <Link href="/workers" className="block px-2 py-1.5 -mx-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50/60 transition-colors">
                                            {t('nav.findWorkers')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <p className="font-bold text-gray-900">{t('feed.heading')}</p>
                                <p className="text-sm text-gray-500 mt-1">{t('feed.loginToPost')}</p>
                                <Link href="/register" className="mt-4 block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                                    {t('nav.signUp')}
                                </Link>
                                <Link href="/login" className="mt-2 block text-center border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                                    {t('nav.logIn')}
                                </Link>
                            </div>
                        )}
                    </aside>

                    {/* ── Center: the feed ────────────────────────── */}
                    <div className="lg:col-span-6 max-w-2xl mx-auto lg:mx-0 lg:max-w-none">

                    {/* Composer */}
                    {auth?.user && (
                        <form onSubmit={publish} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
                            <div className="flex gap-3">
                                <Avatar user={auth.user} />
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    onFocus={() => setComposerExpanded(true)}
                                    placeholder={t('feed.composerPlaceholder')}
                                    rows={composerExpanded ? 3 : 2}
                                    className="flex-1 border-0 focus:ring-0 text-sm text-gray-900 placeholder-gray-400 resize-none bg-transparent"
                                />
                            </div>
                            <InputError message={errors.description} className="mt-1" />

                            <AnimatePresence>
                                {composerExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
                                            <select
                                                value={data.category_id}
                                                onChange={(e) => setData('category_id', e.target.value)}
                                                className="rounded-lg border-gray-200 text-xs text-gray-700 focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">{t('feed.anyCategory')}</option>
                                                {categories.map((c) => (
                                                    <option key={c.id} value={c.id}>{translateCategory(c.name)}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={data.state}
                                                onChange={(e) => setData('state', e.target.value)}
                                                className="rounded-lg border-gray-200 text-xs text-gray-700 focus:border-blue-500 focus:ring-blue-500"
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
                                                className="rounded-lg border-gray-200 text-xs text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <input
                                                type="number"
                                                min={1}
                                                max={100}
                                                value={data.technicians_needed}
                                                onChange={(e) => setData('technicians_needed', e.target.value)}
                                                placeholder={t('feed.detailsNeeded')}
                                                className="rounded-lg border-gray-200 text-xs text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                            <input
                                                type="text"
                                                value={data.budget}
                                                onChange={(e) => setData('budget', e.target.value)}
                                                placeholder={t('feed.budgetPlaceholder')}
                                                className="col-span-2 sm:col-span-1 rounded-lg border-gray-200 text-xs text-gray-700 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex justify-end mt-3">
                                <button
                                    type="submit"
                                    disabled={processing || data.description.trim().length < 10}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
                                >
                                    {t('feed.publish')}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <select
                            value={filters.category || ''}
                            onChange={(e) => applyFilter('category', e.target.value)}
                            className="rounded-full border-gray-200 bg-white text-xs font-medium text-gray-600 py-1.5 pl-3 pr-8 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">{t('feed.allTrades')}</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{translateCategory(c.name)}</option>
                            ))}
                        </select>
                        <select
                            value={filters.region || ''}
                            onChange={(e) => applyFilter('region', e.target.value)}
                            className="rounded-full border-gray-200 bg-white text-xs font-medium text-gray-600 py-1.5 pl-3 pr-8 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">{t('feed.allRegions')}</option>
                            {cameroonRegions.map((r) => (
                                <option key={r.name} value={r.name}>{r.name}</option>
                            ))}
                        </select>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => applyFilter('status', e.target.value)}
                            className="rounded-full border-gray-200 bg-white text-xs font-medium text-gray-600 py-1.5 pl-3 pr-8 focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">{t('feed.allPosts')}</option>
                            <option value="open">{t('feed.statusOpen')}</option>
                            <option value="filled">{t('feed.statusFilled')}</option>
                            <option value="closed">{t('feed.statusClosed')}</option>
                        </select>
                    </div>

                    {/* Feed */}
                    {posts.data.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 flex items-center justify-center mb-4">
                                <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 18a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1H3a1 1 0 00-1 1v2zM10 10V5a1 1 0 011-1h2a1 1 0 011 1v5M4 15v-3a6 6 0 016-6M14 6a6 6 0 016 6v3" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900">{t('feed.emptyFeed')}</h3>
                            <p className="text-sm text-gray-500 mt-1">{t('feed.emptyFeedHint')}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.data.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    auth={auth}
                                    t={t}
                                    timeAgo={timeAgo}
                                    translateCategory={translateCategory}
                                    statusStyles={statusStyles}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="flex flex-wrap justify-center gap-1.5 mt-8">
                            {posts.links.map((link, i) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span key={i} className="px-3.5 py-2 rounded-lg text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: link.label }} />
                                )
                            ))}
                        </div>
                    )}
                    </div>

                    {/* ── Right rail: technician discovery ────────── */}
                    <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24">
                        {suggestedWorkers.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4">
                                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2 18a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1H3a1 1 0 00-1 1v2zM10 10V5a1 1 0 011-1h2a1 1 0 011 1v5M4 15v-3a6 6 0 016-6M14 6a6 6 0 016 6v3" /></svg>
                                    {t('feed.suggestedTechnicians')}
                                </p>
                                <div className="space-y-3">
                                    {suggestedWorkers.map((worker) => (
                                        <Link key={worker.id} href={`/workers/${worker.id}`} className="flex items-center gap-3 group">
                                            <Avatar user={worker.user} size="w-9 h-9" />
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 truncate transition-colors">{worker.user.name}</p>
                                                <p className="text-[11px] text-gray-400 truncate">
                                                    {worker.title
                                                        || (worker.job_categories?.[0] && translateCategory(worker.job_categories[0].name))
                                                        || [worker.city, worker.state].filter(Boolean).join(', ')}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <Link href="/workers" className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                    {t('home.viewAllWorkers')}
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </Link>
                            </div>
                        )}
                    </aside>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

/* ── Post card ────────────────────────────────────────────── */
function PostCard({
    post,
    auth,
    t,
    timeAgo,
    translateCategory,
    statusStyles,
}: {
    post: Post;
    auth: any;
    t: (key: string, params?: Record<string, string | number>) => string;
    timeAgo: (dateStr: string) => string;
    translateCategory: (name: string) => string;
    statusStyles: Record<Post['status'], string>;
}) {
    const [showInterested, setShowInterested] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentBody, setCommentBody] = useState('');
    const [sendingComment, setSendingComment] = useState(false);

    const isOwner = auth?.user?.id === post.user_id;
    const myInterest = auth?.user ? post.interests.find((i) => i.user_id === auth.user.id) : undefined;
    const isTechnician = !!auth?.worker_profile_id;

    const toggleInterest = () => {
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
        router.patch(route('feed.status', post.id), { status }, { preserveScroll: true });
    };

    const deletePost = () => {
        if (confirm(t('feed.confirmDelete'))) {
            router.delete(route('feed.destroy', post.id), { preserveScroll: true });
        }
    };

    const statusLabel = {
        open: t('feed.statusOpen'),
        filled: t('feed.statusFilled'),
        closed: t('feed.statusClosed'),
    }[post.status];

    return (
        <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="post-card bg-white rounded-2xl border border-gray-100 shadow-sm"
        >
            <div className="p-5 pb-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {post.user.worker_profile ? (
                            <Link href={`/workers/${post.user.worker_profile.id}`}>
                                <Avatar user={post.user} />
                            </Link>
                        ) : (
                            <Avatar user={post.user} />
                        )}
                        <div className="min-w-0">
                            <p className="font-bold text-gray-900 text-sm truncate">
                                {post.user.name}
                                {isOwner && <span className="ml-2 text-[11px] font-semibold text-blue-600">{t('feed.yourPost')}</span>}
                            </p>
                            <p className="text-xs text-gray-400">
                                {timeAgo(post.created_at)}
                                {isOwner && post.notified_count > 0 && (
                                    <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 font-medium">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg>
                                        {t('feed.notified', { n: post.notified_count })}
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${statusStyles[post.status]}`}>
                            {post.status === 'open' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                            {statusLabel}
                        </span>
                        {isOwner && (
                            <button onClick={deletePost} aria-label={t('feed.delete')} title={t('feed.delete')} className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Body */}
                <p className="mt-3 text-[15px] text-gray-800 leading-relaxed whitespace-pre-line">{post.description}</p>

                {/* Meta chips */}
                {(post.category || post.city || post.state || post.technicians_needed || post.budget) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {post.category && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-semibold">
                                {translateCategory(post.category.name)}
                            </span>
                        )}
                        {(post.city || post.state) && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full text-[11px] font-medium">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                {[post.city, post.state].filter(Boolean).join(', ')}
                            </span>
                        )}
                        {post.technicians_needed && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-[11px] font-semibold">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                {t('feed.needed', { n: post.technicians_needed })}
                            </span>
                        )}
                        {post.budget && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold">
                                {post.budget}
                            </span>
                        )}
                    </div>
                )}

                {/* Counts row */}
                {(post.likes_count > 0 || post.comments_count > 0 || post.interests_count > 0) && (
                    <div className="flex items-center gap-4 mt-3 pb-3 text-xs text-gray-400">
                        {post.likes_count > 0 && (
                            <span className="inline-flex items-center gap-1.5">
                                <span className="w-4.5 h-4.5 w-[18px] h-[18px] rounded-full bg-blue-600 flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672v-.633A.75.75 0 0115 2a2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729h-5.373c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777z" /></svg>
                                </span>
                                {t('feed.likesCount', { n: post.likes_count })}
                            </span>
                        )}
                        {post.comments_count > 0 && (
                            <button onClick={() => setShowComments(!showComments)} className="hover:text-blue-600 transition-colors">
                                {t('feed.commentsCount', { n: post.comments_count })}
                            </button>
                        )}
                        {post.interests_count > 0 && (
                            <button onClick={() => setShowInterested(!showInterested)} className="inline-flex items-center gap-1.5 hover:text-blue-600 transition-colors ml-auto">
                                <span className="flex -space-x-1.5">
                                    {post.interests.slice(0, 3).map((interest) => (
                                        <span key={interest.id} className="ring-2 ring-white rounded-full">
                                            <Avatar user={interest.user} size="w-5 h-5" />
                                        </span>
                                    ))}
                                </span>
                                {post.technicians_needed
                                    ? t('feed.slots', { count: post.interests_count, needed: post.technicians_needed })
                                    : t('feed.interestedCount', { n: post.interests_count })}
                            </button>
                        )}
                    </div>
                )}

                {/* Job-site progress: positions filled */}
                {post.technicians_needed ? (
                    <div className="mt-3 pb-4">
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, Math.round((post.interests_count / post.technicians_needed) * 100))}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className={`h-full rounded-full ${
                                    post.interests_count >= post.technicians_needed
                                        ? 'hazard-stripes hazard-stripes--animated'
                                        : 'bg-amber-400'
                                }`}
                            />
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Action bar */}
            <div className="flex items-stretch border-t border-gray-100 px-2 py-1">
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={toggleLike}
                    className={`flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-semibold transition-colors ${
                        post.liked_by_me ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                >
                    <svg className="w-[18px] h-[18px]" fill={post.liked_by_me ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={post.liked_by_me ? 0 : 2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V2.75a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398.306-.774 1.086-1.227 1.918-1.227h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                    {post.liked_by_me ? t('feed.liked') : t('feed.like')}
                </motion.button>

                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                    </svg>
                    {t('feed.comment')}
                </button>

                {isOwner ? (
                    post.status === 'open' ? (
                        <button onClick={() => setStatus('filled')} className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {t('feed.markFilled')}
                        </button>
                    ) : (
                        <button onClick={() => setStatus('open')} className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors">
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                            {t('feed.reopen')}
                        </button>
                    )
                ) : !auth?.user ? (
                    <Link href="/login" className="group flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-semibold text-amber-600 hover:bg-amber-50 transition-colors">
                        <svg className="w-[18px] h-[18px] group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" /></svg>
                        {t('feed.imInterested')}
                    </Link>
                ) : isTechnician && (myInterest || post.status === 'open') ? (
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={toggleInterest}
                        className={`group flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-semibold transition-colors ${
                            myInterest ? 'text-emerald-600 hover:bg-emerald-50' : 'text-amber-600 hover:bg-amber-50'
                        }`}
                    >
                        {myInterest ? (
                            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        ) : (
                            <svg className="w-[18px] h-[18px] group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" /></svg>
                        )}
                        {myInterest ? t('feed.interested') : t('feed.imInterested')}
                    </motion.button>
                ) : null}
            </div>

            {/* Comments */}
            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                            {post.comments.map((comment) => (
                                <div key={comment.id} className="flex gap-2.5 group">
                                    <Avatar user={comment.user} size="w-8 h-8" />
                                    <div className="min-w-0 flex-1">
                                        <div className="inline-block bg-gray-50 rounded-2xl rounded-tl-md px-3.5 py-2">
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
                                <form onSubmit={submitComment} className="flex items-center gap-2.5 pt-1">
                                    <Avatar user={auth.user} size="w-8 h-8" />
                                    <div className="flex-1 flex items-center bg-gray-50 rounded-full border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-colors pr-1.5">
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
                                <Link href="/login" className="block text-center text-[13px] font-semibold text-blue-600 hover:text-blue-700 pt-1">
                                    {t('feed.loginToComment')}
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interested technicians (expandable) */}
            <AnimatePresence>
                {showInterested && post.interests.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-gray-100 px-5 py-4">
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
                                                    className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                                                >
                                                    {t('feed.viewProfile')}
                                                </Link>
                                            )}
                                            {isOwner && interest.user.phone && (
                                                <a
                                                    href={`https://wa.me/${interest.user.phone.replace(/\D/g, '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-[#25D366]/10 text-[#128C4A] hover:bg-[#25D366]/20 transition-colors"
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
        </motion.article>
    );
}
