import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence, type Easing } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { JobCategory, WorkerProfile, PaginatedData } from '@/types';
import { getCategoryColor } from '@/utils/categoryColors';
import { useTranslation } from '@/hooks/useTranslation';
import {
    Layers, Link2, BrickWall, FlaskConical, Hammer, Compass,
    Construction, Truck, Zap, Wrench, Flame, PaintRoller,
    Fence, HardHat, Droplets, Route, ArrowDownToLine,
    Grid3x3, Settings, Home, Shovel, type LucideIcon,
} from 'lucide-react';

/* ── Animated number counter hook ───────────────── */
function useCountUp(target: number, duration = 2000) {
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const start = useCallback(() => setStarted(true), []);

    useEffect(() => {
        if (!started) return;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(interval);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);
        return () => clearInterval(interval);
    }, [started, target, duration]);

    return { count, start };
}

interface Props {
    categories: JobCategory[];
    stats: {
        total_workers: number;
        total_categories: number;
    };
    technicians: PaginatedData<WorkerProfile>;
    techFilters: {
        tech_search?: string;
        tech_category?: string;
    };
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as Easing },
    }),
};

const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* Category icon map – Lucide React icons per trade */
const categoryIconMap: Record<string, LucideIcon> = {
    'formwork':        Layers,           // Layered form panels
    'iron':            Link2,            // Connected steel bars
    'steel':           Link2,            // Steel fixing / rebar
    'mason':           BrickWall,        // Brick wall
    'brick':           BrickWall,        // Bricklaying
    'concrete':        FlaskConical,     // Concrete mixing
    'carpenter':       Hammer,           // Hammer & woodwork
    'survey':          Compass,          // Surveying instrument
    'crane':           Construction,     // Crane / construction
    'heavy':           Truck,            // Heavy equipment
    'equipment':       Truck,            // Equipment operator
    'electric':        Zap,              // Electrical / lightning
    'plumb':           Wrench,           // Pipe wrench / plumbing
    'weld':            Flame,            // Welding flame
    'fabricat':        Flame,            // Metal fabrication
    'paint':           PaintRoller,      // Paint roller
    'decorator':       PaintRoller,      // Decorator
    'scaffold':        Fence,            // Scaffolding structure
    'site engineer':   HardHat,          // Hard hat / engineer
    'waterproof':      Droplets,         // Water droplets
    'road':            Route,            // Road / route
    'asphalt':         Route,            // Asphalt road
    'pile':            ArrowDownToLine,  // Driving piles down
    'foundation':      ArrowDownToLine,  // Foundation work
    'til':             Grid3x3,          // Tile grid pattern
    'floor':           Grid3x3,          // Floor tiling
    'plaster':         Shovel,           // Plastering trowel
    'roof':            Home,             // Roofing / house
    'excavat':         Shovel,           // Excavation / digging
    'mep':             Settings,         // Mechanical engineering
};

const DefaultCategoryIcon = Construction;  // Fallback icon

/* Rich accent color sets per trade for category cards */
const categoryAccents: Record<string, { bg: string; iconBg: string; iconColor: string; hoverBorder: string; countBg: string; countText: string }> = {
    'masonry':     { bg: 'hover:bg-orange-50/60', iconBg: 'bg-orange-100', iconColor: 'text-orange-600', hoverBorder: 'hover:border-orange-200', countBg: 'bg-orange-50', countText: 'text-orange-600' },
    'iron':        { bg: 'hover:bg-slate-50/60', iconBg: 'bg-slate-100', iconColor: 'text-slate-600', hoverBorder: 'hover:border-slate-300', countBg: 'bg-slate-50', countText: 'text-slate-600' },
    'steel':       { bg: 'hover:bg-slate-50/60', iconBg: 'bg-slate-100', iconColor: 'text-slate-600', hoverBorder: 'hover:border-slate-300', countBg: 'bg-slate-50', countText: 'text-slate-600' },
    'formwork':    { bg: 'hover:bg-amber-50/60', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', hoverBorder: 'hover:border-amber-200', countBg: 'bg-amber-50', countText: 'text-amber-600' },
    'concrete':    { bg: 'hover:bg-stone-50/60', iconBg: 'bg-stone-100', iconColor: 'text-stone-600', hoverBorder: 'hover:border-stone-300', countBg: 'bg-stone-50', countText: 'text-stone-600' },
    'weld':        { bg: 'hover:bg-red-50/60', iconBg: 'bg-red-100', iconColor: 'text-red-600', hoverBorder: 'hover:border-red-200', countBg: 'bg-red-50', countText: 'text-red-600' },
    'plumb':       { bg: 'hover:bg-cyan-50/60', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-600', hoverBorder: 'hover:border-cyan-200', countBg: 'bg-cyan-50', countText: 'text-cyan-600' },
    'electric':    { bg: 'hover:bg-yellow-50/60', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', hoverBorder: 'hover:border-yellow-200', countBg: 'bg-yellow-50', countText: 'text-yellow-700' },
    'til':         { bg: 'hover:bg-lime-50/60', iconBg: 'bg-lime-100', iconColor: 'text-lime-600', hoverBorder: 'hover:border-lime-200', countBg: 'bg-lime-50', countText: 'text-lime-600' },
    'paint':       { bg: 'hover:bg-pink-50/60', iconBg: 'bg-pink-100', iconColor: 'text-pink-600', hoverBorder: 'hover:border-pink-200', countBg: 'bg-pink-50', countText: 'text-pink-600' },
    'scaffold':    { bg: 'hover:bg-emerald-50/60', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', hoverBorder: 'hover:border-emerald-200', countBg: 'bg-emerald-50', countText: 'text-emerald-600' },
    'crane':       { bg: 'hover:bg-sky-50/60', iconBg: 'bg-sky-100', iconColor: 'text-sky-600', hoverBorder: 'hover:border-sky-200', countBg: 'bg-sky-50', countText: 'text-sky-600' },
    'plaster':     { bg: 'hover:bg-violet-50/60', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', hoverBorder: 'hover:border-violet-200', countBg: 'bg-violet-50', countText: 'text-violet-600' },
    'survey':      { bg: 'hover:bg-indigo-50/60', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600', hoverBorder: 'hover:border-indigo-200', countBg: 'bg-indigo-50', countText: 'text-indigo-600' },
    'roof':        { bg: 'hover:bg-teal-50/60', iconBg: 'bg-teal-100', iconColor: 'text-teal-600', hoverBorder: 'hover:border-teal-200', countBg: 'bg-teal-50', countText: 'text-teal-600' },
    'excavat':     { bg: 'hover:bg-amber-50/60', iconBg: 'bg-amber-100', iconColor: 'text-amber-700', hoverBorder: 'hover:border-amber-200', countBg: 'bg-amber-50', countText: 'text-amber-600' },
    'carpent':     { bg: 'hover:bg-yellow-50/60', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-700', hoverBorder: 'hover:border-yellow-200', countBg: 'bg-yellow-50', countText: 'text-yellow-700' },
    'mep':         { bg: 'hover:bg-fuchsia-50/60', iconBg: 'bg-fuchsia-100', iconColor: 'text-fuchsia-600', hoverBorder: 'hover:border-fuchsia-200', countBg: 'bg-fuchsia-50', countText: 'text-fuchsia-600' },
    'heavy':       { bg: 'hover:bg-zinc-50/60', iconBg: 'bg-zinc-100', iconColor: 'text-zinc-600', hoverBorder: 'hover:border-zinc-300', countBg: 'bg-zinc-50', countText: 'text-zinc-600' },
    'equipment':   { bg: 'hover:bg-zinc-50/60', iconBg: 'bg-zinc-100', iconColor: 'text-zinc-600', hoverBorder: 'hover:border-zinc-300', countBg: 'bg-zinc-50', countText: 'text-zinc-600' },
    'site eng':    { bg: 'hover:bg-blue-50/60', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', hoverBorder: 'hover:border-blue-200', countBg: 'bg-blue-50', countText: 'text-blue-600' },
    'waterproof':  { bg: 'hover:bg-teal-50/60', iconBg: 'bg-teal-100', iconColor: 'text-teal-600', hoverBorder: 'hover:border-teal-200', countBg: 'bg-teal-50', countText: 'text-teal-600' },
    'road':        { bg: 'hover:bg-gray-50/60', iconBg: 'bg-gray-100', iconColor: 'text-gray-600', hoverBorder: 'hover:border-gray-300', countBg: 'bg-gray-50', countText: 'text-gray-600' },
    'asphalt':     { bg: 'hover:bg-gray-50/60', iconBg: 'bg-gray-100', iconColor: 'text-gray-600', hoverBorder: 'hover:border-gray-300', countBg: 'bg-gray-50', countText: 'text-gray-600' },
    'pile':        { bg: 'hover:bg-violet-50/60', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', hoverBorder: 'hover:border-violet-200', countBg: 'bg-violet-50', countText: 'text-violet-600' },
    'foundation':  { bg: 'hover:bg-violet-50/60', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', hoverBorder: 'hover:border-violet-200', countBg: 'bg-violet-50', countText: 'text-violet-600' },
};

const defaultAccent = { bg: 'hover:bg-blue-50/60', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', hoverBorder: 'hover:border-blue-200', countBg: 'bg-blue-50', countText: 'text-blue-600' };

const getCategoryAccent = (name: string) => {
    const lower = name.toLowerCase();
    for (const [key, accent] of Object.entries(categoryAccents)) {
        if (lower.includes(key)) return accent;
    }
    return defaultAccent;
};

const getCategoryIcon = (name: string): LucideIcon => {
    const lower = name.toLowerCase();
    for (const [key, Icon] of Object.entries(categoryIconMap)) {
        if (lower.includes(key)) return Icon;
    }
    return DefaultCategoryIcon;
};


function TechnicianCard({ worker, index }: { worker: WorkerProfile; index: number }) {
    const { t } = useTranslation();
    const avail = {
        available: { dot: 'bg-emerald-500', text: 'text-emerald-700', label: t('availability.available') },
        busy: { dot: 'bg-amber-500', text: 'text-amber-700', label: t('availability.busy') },
        not_available: { dot: 'bg-gray-400', text: 'text-gray-500', label: t('availability.unavailable') },
    }[worker.availability] || { dot: 'bg-gray-400', text: 'text-gray-500', label: t('availability.unavailable') };

    const levelLabels: Record<string, string> = {
        entry: t('levels.entry'), intermediate: t('levels.mid'), experienced: t('levels.senior'), expert: t('levels.expert'),
    };

    const levelColors: Record<string, string> = {
        entry: 'bg-sky-50 text-sky-700',
        intermediate: 'bg-violet-50 text-violet-700',
        experienced: 'bg-amber-50 text-amber-700',
        expert: 'bg-rose-50 text-rose-700',
    };

    const primaryCategory = worker.job_categories?.[0] || worker.categories?.[0];
    const coverPhoto = worker.portfolio_photos?.[0];
    const reviews = worker.user?.reviews_received || [];
    const reviewCount = reviews.length;
    const rating = reviewCount > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;

    return (
        <motion.div custom={index} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Link href={`/workers/${worker.id}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden h-full group">

                {/* Cover Photo */}
                <div className="relative h-44 overflow-hidden">
                    {coverPhoto ? (
                        <img src={`/storage/${coverPhoto.path}`} alt={coverPhoto.caption || ''}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-700 via-blue-800 to-indigo-900">
                            <div className="absolute inset-0 opacity-10" style={{
                                backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                    {/* Availability badge */}
                    <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
                            <span className={`w-2 h-2 rounded-full ${avail.dot} ${worker.availability === 'available' ? 'animate-pulse' : ''}`} />
                            <span className={`text-[11px] font-semibold ${avail.text}`}>{avail.label}</span>
                        </span>
                    </div>

                    {/* Featured badge */}
                    {worker.is_featured && (
                        <div className="absolute top-3 right-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                {t('common.featured')}
                            </span>
                        </div>
                    )}

                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Avatar + Name */}
                    <div className="flex items-start gap-3.5 -mt-11 relative z-10 mb-4">
                        <div className="w-[52px] h-[52px] rounded-xl overflow-hidden ring-[3px] ring-white shadow-lg flex-shrink-0">
                            {worker.user?.avatar ? (
                                <img src={`/storage/${worker.user.avatar}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">{worker.user?.name?.charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 pt-6">
                            <h3 className="font-bold text-gray-900 text-[15px] leading-tight truncate group-hover:text-blue-600 transition-colors">{worker.user?.name}</h3>
                            <p className="text-[13px] text-gray-500 truncate mt-0.5">{worker.title || worker.professional_title || t('workerCard.civilWorker')}</p>
                        </div>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 text-[13px] text-gray-500 mb-3">
                        {(worker.city || worker.state) && (
                            <span className="flex items-center gap-1.5 truncate">
                                <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                {worker.city || worker.location}{worker.state ? `, ${worker.state}` : ''}
                            </span>
                        )}
                        {worker.years_experience > 0 && (
                            <span className="flex items-center gap-1.5 flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                                <span className="font-semibold text-gray-600">{worker.years_experience}</span> {worker.years_experience === 1 ? t('common.year') : t('common.years')}
                            </span>
                        )}
                    </div>

                    {/* Rating */}
                    {rating > 0 && (
                        <div className="flex items-center gap-1.5 mb-3">
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-amber-700">{rating.toFixed(1)}</span>
                            <span className="text-[11px] text-gray-400">({reviewCount} {reviewCount === 1 ? t('common.review') : t('common.reviews')})</span>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
                        {primaryCategory && (
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${getCategoryColor(primaryCategory.name)}`}>{t(`categories.${primaryCategory.name}`) !== `categories.${primaryCategory.name}` ? t(`categories.${primaryCategory.name}`) : primaryCategory.name}</span>
                        )}
                        {worker.experience_level && (
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${levelColors[worker.experience_level] || 'bg-gray-50 text-gray-600'}`}>
                                {levelLabels[worker.experience_level] || worker.experience_level}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function Welcome({ categories, stats, technicians, techFilters }: Props) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [techSearch, setTechSearch] = useState(techFilters?.tech_search || '');

    /* ── Rotating trade word ─────────────────────────────── */
    const rotatingTrades = (t('home.heroRotatingTrades') as any as string[]) || ['Electricians', 'Plumbers', 'Welders', 'Masons', 'Carpenters'];
    const [tradeIndex, setTradeIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setTradeIndex((i) => (i + 1) % rotatingTrades.length), 3000);
        return () => clearInterval(interval);
    }, [rotatingTrades.length]);

    /* ── Animated counters ────────────────────────────────── */
    const workerCounter = useCountUp(stats.total_workers, 2200);
    const categoryCounter = useCountUp(stats.total_categories, 1800);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/workers', { search: searchQuery, location: searchLocation });
    };

    /* Trade accent colors for the rotating word */
    const tradeColors = [
        'from-amber-300 via-amber-400 to-orange-400',
        'from-cyan-300 via-cyan-400 to-blue-400',
        'from-red-300 via-red-400 to-rose-500',
        'from-orange-300 via-orange-400 to-amber-500',
        'from-yellow-300 via-yellow-400 to-amber-400',
    ];

    return (
        <AppLayout>
            <Head title={t('home.pageTitle')}>
                <meta name="description" content={t('home.seoDescription')} />
                <meta property="og:title" content={t('home.seoOgTitle')} />
                <meta property="og:description" content={t('home.seoOgDescription')} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:image" content={`${window.location.origin}/images/logoNexJobs.png`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={t('home.seoOgTitle')} />
                <meta name="twitter:description" content={t('home.seoOgDescription')} />
                <meta name="twitter:image" content={`${window.location.origin}/images/logoNexJobs.png`} />
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'NexJobs',
                    url: window.location.origin,
                    description: t('home.seoJsonLdSiteDescription'),
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: `${window.location.origin}/workers?search={search_term_string}`,
                        'query-input': 'required name=search_term_string',
                    },
                })}</script>
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'NexJobs',
                    url: window.location.origin,
                    logo: `${window.location.origin}/images/logoNexJobs.png`,
                    description: t('home.seoJsonLdOrgDescription'),
                    areaServed: { '@type': 'Country', name: 'Cameroon' },
                    sameAs: [],
                })}</script>
            </Head>

            {/* ═══════════════════════════════════════════════════════
                HERO SECTION — Comprehensive Professional Design
            ═══════════════════════════════════════════════════════ */}
            <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden">
                {/* ── Layered background ──────────────────────────── */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Radial glow accents */}
                    <div className="absolute -top-32 -left-32 w-[700px] h-[700px] bg-blue-600/[0.08] rounded-full blur-[120px]" />
                    <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-amber-500/[0.06] rounded-full blur-[100px]" />
                    <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/[0.04] rounded-full blur-[80px]" />
                    <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-emerald-500/[0.03] rounded-full blur-[90px]" />
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.025]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.2) 1px, transparent 1px)',
                        backgroundSize: '72px 72px'
                    }} />
                    {/* Dot pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.4) 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }} />
                    {/* Diagonal accent lines */}
                    <svg className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02]" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <line x1="0" y1="100" x2="100" y2="0" stroke="white" strokeWidth=".3" />
                        <line x1="20" y1="100" x2="100" y2="20" stroke="white" strokeWidth=".2" />
                        <line x1="40" y1="100" x2="100" y2="40" stroke="white" strokeWidth=".15" />
                    </svg>
                </div>

                {/* ── Floating decorative elements (desktop) ──────── */}
                <div className="absolute inset-0 hidden lg:block pointer-events-none">
                    {/* Floating tool icons */}
                    <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-[18%] left-[8%] w-14 h-14 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] flex items-center justify-center rotate-12">
                        <svg className="w-7 h-7 text-amber-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z" /></svg>
                    </motion.div>
                    <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute top-[30%] right-[7%] w-12 h-12 rounded-xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] flex items-center justify-center -rotate-6">
                        <svg className="w-6 h-6 text-blue-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    </motion.div>
                    <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                        className="absolute bottom-[25%] left-[5%] w-10 h-10 rounded-lg bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] flex items-center justify-center rotate-6">
                        <svg className="w-5 h-5 text-emerald-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" /></svg>
                    </motion.div>
                    <motion.div animate={{ y: [0, 16, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                        className="absolute bottom-[32%] right-[10%] w-11 h-11 rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] flex items-center justify-center -rotate-12">
                        <svg className="w-5 h-5 text-rose-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /></svg>
                    </motion.div>
                </div>

                {/* ── Main content ────────────────────────────────── */}
                <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        {/* ── Left column: Text + Search ─────────────── */}
                        <div className="lg:col-span-7 text-center lg:text-left">
                            {/* Status badge */}
                            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                                <span className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-amber-500/10 text-blue-300 rounded-full text-[13px] font-medium border border-blue-400/15 backdrop-blur-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                                    </span>
                                    {t('home.heroStatPill', { workers: stats.total_workers, categories: stats.total_categories })}
                                </span>
                            </motion.div>

                            {/* Heading with rotating trade word */}
                            <motion.h1
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-white leading-[1.08] tracking-tight"
                            >
                                {t('home.heroHeadingPrefix')}{' '}
                                <span className="block sm:inline">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={rotatingTrades[tradeIndex]}
                                            initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                            exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                                            transition={{ duration: 0.4 }}
                                            className={`inline-block text-transparent bg-clip-text bg-gradient-to-r ${tradeColors[tradeIndex % tradeColors.length]}`}
                                        >
                                            {rotatingTrades[tradeIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                <br />
                                <span className="text-slate-300 text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold">
                                    {t('home.heroHeadingSuffix')}
                                </span>
                            </motion.h1>

                            {/* Subheading */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.25 }}
                                className="mt-6 text-base md:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                            >
                                {t('home.heroSubheading')}
                            </motion.p>

                            {/* Feature badges */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.35 }}
                                className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3"
                            >
                                {[
                                    { label: t('home.heroBadgeVerified'), icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
                                    { label: t('home.heroBadgeInstantHire'), icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
                                    { label: t('home.heroBadgeSecure'), icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
                                ].map((badge) => (
                                    <span key={badge.label} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${badge.color}`}>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={badge.icon} /></svg>
                                        {badge.label}
                                    </span>
                                ))}
                            </motion.div>

                            {/* Search form */}
                            <motion.form
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 }}
                                onSubmit={handleSearch}
                                className="mt-10 bg-white/[0.97] backdrop-blur-xl rounded-2xl p-2 flex flex-col sm:flex-row items-stretch gap-2 shadow-2xl shadow-black/25 max-w-2xl mx-auto lg:mx-0 ring-1 ring-white/10"
                            >
                                <div className="flex-1 flex items-center px-4">
                                    <svg className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input type="text" placeholder={t('home.searchPlaceholderJob')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full py-3 border-0 focus:ring-0 text-gray-900 placeholder-slate-400 text-sm bg-transparent" />
                                </div>
                                <div className="flex-1 flex items-center px-4 border-t sm:border-t-0 sm:border-l border-slate-200">
                                    <svg className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                    <input type="text" placeholder={t('home.searchPlaceholderLocation')} value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}
                                        className="w-full py-3 border-0 focus:ring-0 text-gray-900 placeholder-slate-400 text-sm bg-transparent" />
                                </div>
                                <button type="submit" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98]">
                                    {t('home.searchWorkers')}
                                </button>
                            </motion.form>

                            {/* Top trade category tags */}
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                                className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-sm">
                                <span className="text-slate-500 text-xs">{t('home.trending')}</span>
                                {categories.slice(0, 5).map((cat) => (
                                    <Link key={cat.id} href={`/workers?category=${cat.id}`}
                                        className="px-3 py-1 bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-slate-200 rounded-full transition-all border border-white/[0.07] hover:border-white/15 text-[11px] font-medium">
                                        {t(`categories.${cat.name}`) !== `categories.${cat.name}` ? t(`categories.${cat.name}`) : cat.name}
                                    </Link>
                                ))}
                            </motion.div>
                        </div>

                        {/* ── Right column: Stats + Visual cards ──────── */}
                        <div className="lg:col-span-5 hidden lg:block">
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.7, delay: 0.3 }}
                                className="relative"
                            >
                                {/* Main visual card */}
                                <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/[0.1] p-8 shadow-2xl shadow-black/20">
                                    {/* Glow accent behind card */}
                                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-transparent to-amber-500/20 rounded-3xl blur-xl opacity-40" />

                                    <div className="relative">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <img src="/images/logoNexJobs.png" alt="NexJobs" className="h-10 w-auto brightness-0 invert" />
                                                <div>
                                                    <p className="text-slate-400 text-[11px]">Live Platform Stats</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-400/10 border border-emerald-400/20 rounded-full">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">Live</span>
                                            </div>
                                        </div>

                                        {/* Stats grid */}
                                        <motion.div
                                            className="grid grid-cols-2 gap-4"
                                            onViewportEnter={() => { workerCounter.start(); categoryCounter.start(); }}
                                        >
                                            {[
                                                { value: workerCounter.count, suffix: '+', label: t('home.heroStatWorkers'), gradient: 'from-blue-400 to-blue-500', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
                                                { value: categoryCounter.count, suffix: '+', label: t('home.heroStatProjects'), gradient: 'from-amber-400 to-orange-400', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400', icon: 'M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0' },
                                                { value: '4.9', suffix: '/5', label: t('home.heroStatRating'), gradient: 'from-emerald-400 to-teal-400', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400', icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z' },
                                                { value: '98', suffix: '%', label: t('home.heroStatHires'), gradient: 'from-violet-400 to-purple-400', iconBg: 'bg-violet-500/10', iconColor: 'text-violet-400', icon: 'M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.038 4.092 9.75 4.8 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z' },
                                            ].map((stat, i) => (
                                                <motion.div
                                                    key={stat.label}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.5 + i * 0.1 }}
                                                    className="bg-white/[0.04] hover:bg-white/[0.07] rounded-2xl p-4 border border-white/[0.06] transition-all duration-300 group/stat"
                                                >
                                                    <div className={`w-9 h-9 ${stat.iconBg} rounded-xl flex items-center justify-center mb-3 group-hover/stat:scale-110 transition-transform`}>
                                                        <svg className={`w-4.5 h-4.5 ${stat.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} /></svg>
                                                    </div>
                                                    <p className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${stat.gradient} leading-none`}>
                                                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}{stat.suffix}
                                                    </p>
                                                    <p className="text-slate-400 text-[11px] font-medium mt-1.5">{stat.label}</p>
                                                </motion.div>
                                            ))}
                                        </motion.div>

                                        {/* Bottom mini trust bar inside card */}
                                        <div className="mt-6 pt-5 border-t border-white/[0.06]">
                                            <div className="flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {['bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500', 'bg-violet-500'].map((bg, i) => (
                                                        <div key={i} className={`w-8 h-8 rounded-full ${bg} ring-2 ring-slate-900 flex items-center justify-center`}>
                                                            <span className="text-white text-[10px] font-bold">{String.fromCharCode(65 + i)}</span>
                                                        </div>
                                                    ))}
                                                    <div className="w-8 h-8 rounded-full bg-white/10 ring-2 ring-slate-900 flex items-center justify-center">
                                                        <span className="text-slate-300 text-[9px] font-bold">+{Math.max(0, stats.total_workers - 5)}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg key={star} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                    <span className="text-slate-400 text-[11px] ml-1 font-medium">4.9</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* ── Bottom stats strip (mobile) ─────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="lg:hidden mt-12 grid grid-cols-2 gap-3"
                    >
                        {[
                            { value: stats.total_workers, label: t('home.heroStatWorkers'), icon: '👷', color: 'from-amber-500/20 to-amber-500/5' },
                            { value: stats.total_categories, label: t('home.tradeCategories'), icon: '📋', color: 'from-blue-500/20 to-blue-500/5' },
                        ].map((stat) => (
                            <div key={stat.label} className="relative overflow-hidden bg-white/[0.05] backdrop-blur-sm rounded-2xl p-4 border border-white/[0.08]">
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-30`} />
                                <div className="relative">
                                    <span className="text-lg">{stat.icon}</span>
                                    <p className="text-white font-extrabold text-xl mt-1">{stat.value.toLocaleString()}+</p>
                                    <p className="text-slate-400 text-[11px] mt-0.5">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* ── Bottom wave separator ────────────────────────── */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" className="w-full h-8 md:h-12" preserveAspectRatio="none">
                        <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Trusted By / Social Proof Bar */}
            <section className="py-8 border-b border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex-shrink-0">{t('home.trustedBy')}</p>
                        <div className="flex items-center gap-8 sm:gap-12">
                            {['BuildRight', 'PeakStruct', 'Atlantic Infra', 'SolidBase', 'GreenVille'].map((name) => (
                                <span key={name} className="text-sm font-bold text-slate-300 tracking-wide whitespace-nowrap hover:text-slate-500 transition-colors cursor-default">{name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <p className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-3">{t('home.howItWorksLabel')}</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{t('home.howItWorksHeading')}</h2>
                        <p className="text-slate-500 max-w-xl mx-auto">{t('home.howItWorksDescription')}</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-16 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-blue-200 via-amber-200 to-blue-200" />

                        {[
                            { step: '01', title: t('home.step1Title'), desc: t('home.step1Desc'), color: 'from-blue-500 to-blue-600', ring: 'ring-blue-100' },
                            { step: '02', title: t('home.step2Title'), desc: t('home.step2Desc'), color: 'from-amber-500 to-amber-600', ring: 'ring-amber-100' },
                            { step: '03', title: t('home.step3Title'), desc: t('home.step3Desc'), color: 'from-emerald-500 to-emerald-600', ring: 'ring-emerald-100' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.step}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="relative text-center group"
                            >
                                <div className={`relative z-10 w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg ring-8 ${item.ring} group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="text-white font-extrabold text-xl">{item.step}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-24 bg-gradient-to-b from-gray-50/80 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
                        <div>
                            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-3">{t('home.exploreLabel')}</p>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{t('home.categoriesHeading')}</h2>
                            <p className="text-slate-500 mt-3 max-w-lg text-base leading-relaxed">{t('home.categoriesDescription')}</p>
                        </div>
                        <Link href="/workers" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group">
                            {t('home.viewAllCategories')}
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </motion.div>
                    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {categories.slice(0, 12).map((cat, i) => {
                            const IconComponent = getCategoryIcon(cat.name);
                            const accent = getCategoryAccent(cat.name);
                            const workerCount = cat.worker_profiles_count || 0;
                            return (
                                <motion.div key={cat.id} custom={i} variants={fadeUp}>
                                    <Link href={`/workers?category=${cat.id}`}
                                        className={`flex items-center gap-5 bg-white ${accent.bg} rounded-2xl px-6 py-5 border border-gray-100/80 ${accent.hoverBorder} transition-all duration-300 group hover:shadow-xl hover:shadow-slate-200/50 h-full`}>
                                        {/* Icon */}
                                        <div className={`w-14 h-14 ${accent.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                                            <IconComponent className={`w-7 h-7 ${accent.iconColor} transition-colors`} strokeWidth={1.5} />
                                        </div>
                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-800 text-[15px] leading-snug group-hover:text-slate-900 transition-colors truncate">{t(`categories.${cat.name}`) !== `categories.${cat.name}` ? t(`categories.${cat.name}`) : cat.name}</h3>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 ${accent.countBg} ${accent.countText} text-xs font-bold rounded-full`}>
                                                    {workerCount}
                                                </span>
                                                <span className="text-xs text-slate-400 font-medium">{workerCount === 1 ? t('home.availableWorker') : t('home.availableWorkers')}</span>
                                            </div>
                                        </div>
                                        {/* Arrow */}
                                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Available Technicians */}
            <section className="py-20 bg-gray-50/70" id="technicians">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                        <div>
                            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">{t('home.ourProfessionals')}</p>
                            <h2 className="text-3xl font-bold text-slate-800">{t('home.skilledTechnicians')}</h2>
                            <p className="text-gray-500 mt-2 max-w-lg">{t('home.techDescription')}</p>
                        </div>
                        <Link href="/workers" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:text-gray-900 transition-all shadow-sm hover:shadow">
                            {t('home.viewAllWorkers')}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </motion.div>

                    {/* Search & Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            router.get('/', { ...techFilters, tech_search: techSearch || undefined }, { preserveScroll: true, only: ['technicians', 'techFilters'] });
                        }} className="flex-1 flex gap-2">
                            <div className="flex-1 relative">
                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <input type="text" value={techSearch} onChange={(e) => setTechSearch(e.target.value)}
                                    placeholder={t('home.searchByNameSkill')}
                                    className="w-full rounded-xl border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white shadow-sm" />
                            </div>
                            <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                                {t('common.search')}
                            </button>
                        </form>
                        <select value={techFilters?.tech_category || ''}
                            onChange={(e) => router.get('/', { ...techFilters, tech_category: e.target.value || undefined }, { preserveScroll: true, only: ['technicians', 'techFilters'] })}
                            className="rounded-xl border-gray-200 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm">
                            <option value="">{t('common.allCategories')}</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    {technicians.data.length > 0 ? (
                        <>
                            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {technicians.data.map((worker, i) => (
                                    <TechnicianCard key={worker.id} worker={worker} index={i} />
                                ))}
                            </motion.div>

                            {/* Pagination */}
                            {technicians.last_page > 1 && (
                                <div className="flex justify-center mt-10 gap-1">
                                    {technicians.links.map((link, i) => (
                                        <Link key={i} href={link.url || '#'} preserveScroll
                                            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-slate-800 text-white shadow-sm'
                                                    : link.url
                                                        ? 'text-gray-600 hover:bg-white hover:shadow-sm'
                                                        : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{t('home.noTechnicians')}</h3>
                            <p className="text-gray-500 text-sm mt-1">{t('home.noTechDescription')}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950">
                {/* Decorative */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/[0.06] rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/[0.06] rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }} />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-full text-sm text-slate-300 mb-8">
                            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            {t('home.ctaBadge', { count: stats.total_workers.toLocaleString() })}
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                            {t('home.ctaHeading1')}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">{t('home.ctaHeading2')}</span>
                        </h2>
                        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            {t('home.ctaDescription')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register" className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 text-sm">
                                {t('home.getStartedFree')}
                                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                            <Link href="/workers" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/[0.06] transition-all text-sm backdrop-blur-sm">
                                {t('home.browseWorkers')}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </AppLayout>
    );
}
