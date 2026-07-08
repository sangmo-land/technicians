import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
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
    notified_count: number;
    interests: Interest[];
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

interface Props {
    posts: PaginatedData<Post>;
    categories: JobCategory[];
    filters: { category?: string; region?: string; status?: string };
    suggestedWorkers: SuggestedWorker[];
}

function Avatar({ user, size = 'w-10 h-10' }: { user: FeedUser; size?: string }) {
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
        router.get(route('feed'), next as any, { preserveState: true, preserveScroll: true });
    };

    const statusStyles: Record<Post['status'], string> = {
        open: 'bg-emerald-50 text-emerald-700',
        filled: 'bg-blue-50 text-blue-700',
        closed: 'bg-gray-100 text-gray-500',
    };

    return (
        <AppLayout>
            <Head title={t('feed.pageTitle')} />

            <div className="min-h-screen bg-gray-50 py-8 md:py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-6 lg:items-start">

                    {/* ── Left rail: profile card ─────────────────── */}
                    <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24">
                        {auth?.user ? (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="h-16 bg-gradient-to-r from-slate-800 to-blue-900" />
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
                    {/* Header */}
                    <div className="mb-6 lg:hidden">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{t('feed.heading')}</h1>
                        <p className="text-gray-500 mt-1 text-sm">{t('feed.subheading')}</p>
                    </div>

                    {/* Composer */}
                    {auth?.user ? (
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
                    ) : (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <p className="text-sm text-gray-600">{t('feed.loginToPost')}</p>
                            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors flex-shrink-0">
                                {t('nav.logIn')}
                            </Link>
                        </div>
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
                            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
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
                                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4">{t('feed.suggestedTechnicians')}</p>
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

    const isOwner = auth?.user?.id === post.user_id;
    const myInterest = auth?.user ? post.interests.find((i) => i.user_id === auth.user.id) : undefined;
    const isTechnician = !!auth?.worker_profile_id;

    const toggleInterest = () => {
        router.post(route('feed.interest', post.id), {}, { preserveScroll: true });
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
        >
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
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusStyles[post.status]}`}>{statusLabel}</span>
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

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
                {/* Interest count + avatars */}
                <button
                    onClick={() => setShowInterested(!showInterested)}
                    className="flex items-center gap-2 group"
                    disabled={post.interests_count === 0}
                >
                    <div className="flex -space-x-2">
                        {post.interests.slice(0, 4).map((interest) => (
                            <div key={interest.id} className="ring-2 ring-white rounded-full">
                                <Avatar user={interest.user} size="w-7 h-7" />
                            </div>
                        ))}
                    </div>
                    <span className={`text-xs font-medium ${post.interests_count > 0 ? 'text-gray-600 group-hover:text-blue-600' : 'text-gray-400'} transition-colors`}>
                        {post.technicians_needed
                            ? t('feed.slots', { count: post.interests_count, needed: post.technicians_needed })
                            : t('feed.interestedCount', { n: post.interests_count })}
                    </span>
                </button>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {isOwner ? (
                        <>
                            {post.status === 'open' ? (
                                <button onClick={() => setStatus('filled')} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                                    {t('feed.markFilled')}
                                </button>
                            ) : (
                                <button onClick={() => setStatus('open')} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                                    {t('feed.reopen')}
                                </button>
                            )}
                            <button onClick={deletePost} className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
                                {t('feed.delete')}
                            </button>
                        </>
                    ) : !auth?.user ? (
                        <Link href="/login" className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                            {t('feed.imInterested')}
                        </Link>
                    ) : isTechnician ? (
                        myInterest ? (
                            <button onClick={toggleInterest} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                {t('feed.interested')}
                            </button>
                        ) : post.status === 'open' ? (
                            <button onClick={toggleInterest} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>
                                {t('feed.imInterested')}
                            </button>
                        ) : null
                    ) : null}
                </div>
            </div>

            {/* Interested technicians (expandable) */}
            <AnimatePresence>
                {showInterested && post.interests.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 pt-4 border-t border-gray-100">
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
