import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { WorkerProfile, JobCategory, PaginatedData } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { getCategoryColor } from '@/utils/categoryColors';

interface Props {
    workers: PaginatedData<WorkerProfile>;
    categories: JobCategory[];
    filters: {
        search?: string;
        category?: string;
        experience?: string;
        location?: string;
        availability?: string;
    };
}

export default function WorkersIndex({ workers, categories, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [location, setLocation] = useState(filters.location || '');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const applyFilters = (key: string, value: string) => {
        router.get('/workers', { ...filters, [key]: value || undefined }, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/workers', { ...filters, search, location }, { preserveState: true });
    };

    const clearAllFilters = () => {
        setSearch('');
        setLocation('');
        router.get('/workers', {}, { preserveState: true });
    };

    const activeFilterCount = [filters.category, filters.experience, filters.availability, filters.search, filters.location].filter(Boolean).length;

    const experienceLevels = ['entry', 'intermediate', 'experienced', 'expert'];

    const translateCategory = (name: string) => {
        const key = `categories.${name}`;
        const translated = t(key);
        return translated !== key ? translated : name;
    };

    /* ─── Sidebar Filter Content (shared between desktop & mobile) ─── */
    const FilterSidebar = () => (
        <div className="space-y-6">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl flex items-center justify-center shadow-sm">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">{t('workersIndex.filters')}</h3>
                        <p className="text-[11px] text-slate-400">{t('workersIndex.refineResults')}</p>
                    </div>
                </div>
                {activeFilterCount > 0 && (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">
                        {activeFilterCount}
                    </span>
                )}
            </div>

            {/* Clear All */}
            {activeFilterCount > 0 && (
                <button
                    onClick={clearAllFilters}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-colors border border-red-100"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {t('workersIndex.resetFilters')}
                </button>
            )}

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* ── Search ── */}
            <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {t('workersIndex.searchLabel')}
                </label>
                <form onSubmit={handleSearch}>
                    <div className="relative">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('workersIndex.searchPlaceholder')}
                            className="w-full rounded-xl border-gray-200 bg-gray-50 pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400"
                        />
                        {search && (
                            <button type="button" onClick={() => { setSearch(''); applyFilters('search', ''); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* ── Location ── */}
            <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t('workersIndex.locationLabel')}
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                        placeholder={t('workersIndex.locationPlaceholder')}
                        className="w-full rounded-xl border-gray-200 bg-gray-50 pl-4 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder-slate-400"
                    />
                    {location && (
                        <button type="button" onClick={() => { setLocation(''); applyFilters('location', ''); }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    )}
                </div>
                {/* Apply search button */}
                {(search !== (filters.search || '') || location !== (filters.location || '')) && (
                    <button
                        onClick={(e) => handleSearch(e as any)}
                        className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                    >
                        {t('workersIndex.applySearch')}
                    </button>
                )}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* ── Trade Category ── */}
            <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    {t('workersIndex.categoryLabel')}
                </label>
                <div className="space-y-1 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                    {/* All Categories option */}
                    <button
                        onClick={() => applyFilters('category', '')}
                        className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                            !filters.category
                                ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100'
                                : 'text-slate-600 hover:bg-gray-50 hover:text-slate-800'
                        }`}
                    >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            !filters.category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </div>
                        <span className="flex-1">{t('workersIndex.allCategories')}</span>
                        {!filters.category && (
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        )}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => applyFilters('category', filters.category === String(cat.id) ? '' : String(cat.id))}
                            className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                filters.category === String(cat.id)
                                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100'
                                    : 'text-slate-600 hover:bg-gray-50 hover:text-slate-800'
                            }`}
                        >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                                filters.category === String(cat.id) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                            }`}>
                                {(cat.worker_profiles_count || 0)}
                            </div>
                            <span className="flex-1 truncate">{translateCategory(cat.name)}</span>
                            {filters.category === String(cat.id) && (
                                <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* ── Experience Level ── */}
            <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    {t('workersIndex.experienceLabel')}
                </label>
                <div className="space-y-1.5">
                    {experienceLevels.map((level) => {
                        const isActive = filters.experience === level;
                        const colors: Record<string, { active: string; dot: string }> = {
                            entry:        { active: 'bg-slate-50 text-slate-700 border-slate-200',   dot: 'bg-slate-400' },
                            intermediate: { active: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
                            experienced:  { active: 'bg-blue-50 text-blue-700 border-blue-200',     dot: 'bg-blue-500' },
                            expert:       { active: 'bg-amber-50 text-amber-700 border-amber-200',  dot: 'bg-amber-500' },
                        };
                        const c = colors[level] || colors.entry;
                        return (
                            <button
                                key={level}
                                onClick={() => applyFilters('experience', isActive ? '' : level)}
                                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                    isActive ? `${c.active} font-semibold border` : 'text-slate-600 hover:bg-gray-50'
                                }`}
                            >
                                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isActive ? c.dot : 'bg-gray-300'}`} />
                                <span className="flex-1">{t(`levels.${level}`)}</span>
                                {isActive && (
                                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* ── Availability ── */}
            <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('workersIndex.availabilityLabel')}
                </label>
                <div className="space-y-1.5">
                    {[
                        { value: 'available', label: t('availability.availableForWork'), dot: 'bg-emerald-500', activeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                        { value: 'busy', label: t('availability.currentlyBusy'), dot: 'bg-orange-500', activeBg: 'bg-orange-50 text-orange-700 border-orange-200' },
                    ].map(({ value, label, dot, activeBg }) => {
                        const isActive = filters.availability === value;
                        return (
                            <button
                                key={value}
                                onClick={() => applyFilters('availability', isActive ? '' : value)}
                                className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                    isActive ? `${activeBg} font-semibold border` : 'text-slate-600 hover:bg-gray-50'
                                }`}
                            >
                                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isActive ? dot : 'bg-gray-300'} ${isActive && value === 'available' ? 'animate-pulse' : ''}`} />
                                <span className="flex-1">{label}</span>
                                {isActive && (
                                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* ── Quick Stats ── */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t('workersIndex.quickStats')}</p>
                <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{t('workersIndex.totalWorkers')}</span>
                        <span className="text-xs font-bold text-slate-800">{workers.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{t('workersIndex.categoriesAvailable')}</span>
                        <span className="text-xs font-bold text-slate-800">{categories.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{t('workersIndex.resultsPerPage')}</span>
                        <span className="text-xs font-bold text-slate-800">{workers.per_page}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <AppLayout>
            <Head title={t('workersIndex.pageTitle')}>
                <meta name="description" content={t('workersIndex.seoDescription')} />
                <meta property="og:title" content={t('workersIndex.seoOgTitle')} />
                <meta property="og:description" content={t('workersIndex.seoOgDescription')} />
                <meta property="og:type" content="website" />
            </Head>

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/[0.06] rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/[0.06] rounded-full blur-3xl" />
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
                    {/* Breadcrumb */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                        <Link href="/" className="hover:text-white transition-colors">{t('workersIndex.home')}</Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <span className="text-slate-200">{t('workersIndex.workers')}</span>
                    </motion.div>

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-semibold text-amber-400 mb-3">
                                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                                {t('workersIndex.workerCount', { count: workers.total })}
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 tracking-tight">
                                {t('workersIndex.heading')}
                            </h1>
                            <p className="text-slate-400 text-base lg:text-lg max-w-xl leading-relaxed">
                                {t('workersIndex.subheading')}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Main Content: Sidebar + Results */}
            <section className="bg-gray-50/70 min-h-[70vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* ─── Mobile Filter Toggle ─── */}
                        <div className="lg:hidden">
                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                {t('workersIndex.filtersAndSearch')}
                                {activeFilterCount > 0 && (
                                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">{activeFilterCount}</span>
                                )}
                            </button>
                        </div>

                        {/* ─── Mobile Filter Drawer ─── */}
                        <AnimatePresence>
                            {mobileFiltersOpen && (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setMobileFiltersOpen(false)}
                                        className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
                                    />
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: 0 }}
                                        exit={{ x: '-100%' }}
                                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                        className="fixed top-0 left-0 bottom-0 w-[320px] max-w-[85vw] bg-white z-50 lg:hidden overflow-y-auto"
                                    >
                                        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
                                            <h2 className="font-bold text-slate-800">{t('workersIndex.filtersAndSearch')}</h2>
                                            <button
                                                onClick={() => setMobileFiltersOpen(false)}
                                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                            >
                                                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <FilterSidebar />
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        {/* ─── Desktop Left Sidebar ─── */}
                        <motion.aside
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="hidden lg:block w-[300px] flex-shrink-0"
                        >
                            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                                <FilterSidebar />
                            </div>
                        </motion.aside>

                        {/* ─── Results Column ─── */}
                        <div className="flex-1 min-w-0">
                            {/* Active Filter Chips */}
                            {activeFilterCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-wrap gap-2 mb-5"
                                >
                                    {filters.search && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            &ldquo;{filters.search}&rdquo;
                                            <button onClick={() => { setSearch(''); applyFilters('search', ''); }} className="hover:text-blue-900 ml-0.5">&times;</button>
                                        </span>
                                    )}
                                    {filters.location && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-100">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                            {filters.location}
                                            <button onClick={() => { setLocation(''); applyFilters('location', ''); }} className="hover:text-emerald-900 ml-0.5">&times;</button>
                                        </span>
                                    )}
                                    {filters.category && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg border border-amber-100">
                                            {translateCategory(categories.find(c => String(c.id) === filters.category)?.name || filters.category)}
                                            <button onClick={() => applyFilters('category', '')} className="hover:text-amber-900 ml-0.5">&times;</button>
                                        </span>
                                    )}
                                    {filters.experience && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg border border-purple-100">
                                            {t(`levels.${filters.experience}`)}
                                            <button onClick={() => applyFilters('experience', '')} className="hover:text-purple-900 ml-0.5">&times;</button>
                                        </span>
                                    )}
                                    {filters.availability && (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-100">
                                            {filters.availability === 'available' ? t('availability.availableForWork') : t('availability.currentlyBusy')}
                                            <button onClick={() => applyFilters('availability', '')} className="hover:text-green-900 ml-0.5">&times;</button>
                                        </span>
                                    )}
                                </motion.div>
                            )}

                            {/* Results Header */}
                            <div className="flex items-center justify-between mb-5">
                                <p className="text-sm text-slate-500">
                                    {t('workersIndex.showing')} <span className="font-semibold text-slate-700">{workers.data.length}</span> {t('workersIndex.of')} <span className="font-semibold text-slate-700">{workers.total}</span> {t('workersIndex.professionals')}
                                </p>
                            </div>

                            {/* Workers Grid */}
                            {workers.data.length > 0 ? (
                                <div className="grid sm:grid-cols-2 gap-5">
                                    {workers.data.map((worker, i) => {
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
                                        const rating = reviewCount > 0 ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount : 0;

                                        return (
                                            <motion.div
                                                key={worker.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.04 }}
                                            >
                                                <Link
                                                    href={`/workers/${worker.id}`}
                                                    className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden h-full group"
                                                >
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
                                                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${getCategoryColor(primaryCategory.name)}`}>{translateCategory(primaryCategory.name)}</span>
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
                                    })}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-20 bg-white rounded-2xl border border-gray-100"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{t('workersIndex.noWorkers')}</h3>
                                    <p className="text-slate-500 mb-6 max-w-md mx-auto">{t('workersIndex.noWorkersHint')}</p>
                                    {activeFilterCount > 0 && (
                                        <button
                                            onClick={clearAllFilters}
                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            {t('workersIndex.resetFilters')}
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {/* Pagination */}
                            {workers.last_page > 1 && (
                                <div className="flex items-center justify-center mt-10 gap-1">
                                    {workers.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                                link.active
                                                    ? 'bg-slate-800 text-white shadow-sm'
                                                    : link.url
                                                        ? 'text-slate-600 hover:bg-white hover:shadow-sm hover:border-gray-200 border border-transparent'
                                                        : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
