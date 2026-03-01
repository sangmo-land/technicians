import { Head, Link, router } from '@inertiajs/react';
import { motion, type Easing } from 'framer-motion';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { JobCategory, WorkerProfile, PaginatedData } from '@/types';
import { getCategoryColor } from '@/utils/categoryColors';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
    categories: JobCategory[];
    stats: {
        total_jobs: number;
        total_workers: number;
        total_categories: number;
        total_companies: number;
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

/* Category icon map – unique SVG paths per trade */
const categoryIcons: Record<string, string> = {
    'Masonry': 'M3 10h18M3 14h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z',
    'Iron Bending': 'M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3',
    'Formwork': 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    'Concrete Work': 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    'Welding': 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z',
    'Plumbing': 'M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z',
    'Electrical': 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    'Tiling': 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
    'Painting': 'M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42',
    'Steel Fixing': 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085',
    'Scaffolding': 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21',
    'Crane Operation': 'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
    'Plastering': 'M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z',
    'Surveying': 'M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    'Roofing': 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
    'Excavation': 'M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3',
    'Carpentry': 'M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z',
    'MEP': 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
};

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
};

const defaultAccent = { bg: 'hover:bg-blue-50/60', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', hoverBorder: 'hover:border-blue-200', countBg: 'bg-blue-50', countText: 'text-blue-600' };

const getCategoryAccent = (name: string) => {
    const lower = name.toLowerCase();
    for (const [key, accent] of Object.entries(categoryAccents)) {
        if (lower.includes(key)) return accent;
    }
    return defaultAccent;
};

const getCategoryIcon = (name: string): string => {
    for (const [key, path] of Object.entries(categoryIcons)) {
        if (name.toLowerCase().includes(key.toLowerCase())) return path;
    }
    return 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4';
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

                    {/* Rate badge */}
                    {worker.hourly_rate && (
                        <div className="absolute bottom-3 right-3">
                            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-sm font-extrabold text-gray-900 shadow-sm">
                                {Number(worker.hourly_rate).toLocaleString()} <span className="text-gray-400 font-medium text-[10px]">FCFA{t('workerCard.hr')}</span>
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

                    {/* Skills */}
                    {worker.skills && worker.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {worker.skills.slice(0, 3).map((skill) => (
                                <span key={skill.id} className="px-2 py-0.5 text-[11px] font-medium text-gray-600 bg-gray-100 rounded-md">
                                    {skill.name}
                                </span>
                            ))}
                            {worker.skills.length > 3 && (
                                <span className="px-2 py-0.5 text-[11px] font-medium text-gray-400 bg-gray-50 rounded-md">+{worker.skills.length - 3}</span>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-gray-100">
                        {primaryCategory && (
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${getCategoryColor(primaryCategory.name)}`}>{primaryCategory.name}</span>
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/jobs', { search: searchQuery, location: searchLocation });
    };

    return (
        <AppLayout>
            <Head title={t('home.pageTitle')} />

            {/* Hero */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/[0.07] rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/[0.05] rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/[0.03] rounded-full blur-3xl" />
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
                        backgroundSize: '80px 80px'
                    }} />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-36">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-500/10 to-amber-500/10 text-blue-300 rounded-full text-sm font-medium mb-8 border border-blue-500/20 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
                            </span>
                            {t('home.heroStatPill', { jobs: stats.total_jobs, workers: stats.total_workers })}
                        </motion.div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
                            {t('home.heroHeading1')}<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">{t('home.heroHeading2')}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                            {t('home.heroDescription')}
                        </p>
                        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            onSubmit={handleSearch} className="bg-white/[0.95] backdrop-blur-xl rounded-2xl p-2 flex flex-col md:flex-row items-stretch gap-2 shadow-2xl shadow-black/20 max-w-2xl mx-auto ring-1 ring-white/10">
                            <div className="flex-1 flex items-center px-4">
                                <svg className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input type="text" placeholder={t('home.searchPlaceholderJob')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-3 border-0 focus:ring-0 text-gray-900 placeholder-slate-400 text-sm bg-transparent" />
                            </div>
                            <div className="flex-1 flex items-center px-4 border-t md:border-t-0 md:border-l border-slate-200">
                                <svg className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <input type="text" placeholder={t('home.searchPlaceholderLocation')} value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)}
                                    className="w-full py-3 border-0 focus:ring-0 text-gray-900 placeholder-slate-400 text-sm bg-transparent" />
                            </div>
                            <button type="submit" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 rounded-xl font-semibold transition-all text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40">
                                {t('home.searchJobs')}
                            </button>
                        </motion.form>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 flex flex-wrap items-center justify-center gap-2 text-sm">
                            <span className="text-slate-500">{t('home.trending')}</span>
                            {(t('home.trendingTerms') as any as string[]).map((term: string) => (
                                <Link key={term} href={`/jobs?search=${encodeURIComponent(term)}`} className="px-3.5 py-1.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 rounded-full transition-all border border-white/[0.08] hover:border-white/20 text-xs font-medium">{term}</Link>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Floating stat pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="hidden lg:flex justify-center gap-8 mt-16"
                    >
                        {[
                            { icon: '💼', value: stats.total_jobs, label: t('home.activeJobs') },
                            { icon: '👷', value: stats.total_workers, label: t('home.skilledWorkers') },
                            { icon: '🏗️', value: stats.total_companies, label: t('home.companies') },
                            { icon: '📋', value: stats.total_categories, label: t('home.tradeCategories') },
                        ].map((s) => (
                            <div key={s.label} className="flex items-center gap-3 bg-white/[0.06] backdrop-blur-sm border border-white/[0.08] rounded-2xl px-5 py-3">
                                <span className="text-xl">{s.icon}</span>
                                <div>
                                    <p className="text-white font-bold text-lg leading-none">{s.value.toLocaleString()}</p>
                                    <p className="text-slate-400 text-xs mt-0.5">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Trusted By / Social Proof Bar */}
            <section className="py-8 border-b border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{t('home.trustedBy')}</p>
                        <div className="flex items-center gap-8 sm:gap-12 opacity-40">
                            {['BuildRight', 'PeakStruct', 'Atlantic Infra', 'SolidBase', 'GreenVille'].map((name) => (
                                <span key={name} className="text-sm font-bold text-slate-600 tracking-wide whitespace-nowrap">{name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Counters (mobile-visible version) */}
            <section className="py-12 lg:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: t('home.activeJobs'), value: stats.total_jobs, color: 'from-blue-500 to-blue-600', icon: '💼' },
                            { label: t('home.skilledWorkers'), value: stats.total_workers, color: 'from-amber-500 to-orange-500', icon: '👷' },
                            { label: t('home.tradeCategories'), value: stats.total_categories, color: 'from-emerald-500 to-teal-500', icon: '📋' },
                            { label: t('home.companies'), value: stats.total_companies, color: 'from-purple-500 to-indigo-500', icon: '🏗️' },
                        ].map((stat, i) => (
                            <motion.div key={stat.label} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                                className="relative overflow-hidden bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-[0.06] rounded-full -translate-y-1/3 translate-x-1/3`} />
                                <span className="text-2xl mb-2 block">{stat.icon}</span>
                                <p className="text-2xl font-extrabold text-slate-900">{stat.value.toLocaleString()}</p>
                                <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
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
                        <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors group">
                            {t('home.viewAllCategories')}
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </motion.div>
                    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {categories.slice(0, 12).map((cat, i) => {
                            const iconPath = getCategoryIcon(cat.name);
                            const accent = getCategoryAccent(cat.name);
                            const jobCount = cat.job_listings_count || 0;
                            return (
                                <motion.div key={cat.id} custom={i} variants={fadeUp}>
                                    <Link href={`/jobs?category=${cat.id}`}
                                        className={`flex items-center gap-5 bg-white ${accent.bg} rounded-2xl px-6 py-5 border border-gray-100/80 ${accent.hoverBorder} transition-all duration-300 group hover:shadow-xl hover:shadow-slate-200/50 h-full`}>
                                        {/* Icon */}
                                        <div className={`w-14 h-14 ${accent.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
                                            <svg className={`w-7 h-7 ${accent.iconColor} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
                                            </svg>
                                        </div>
                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-slate-800 text-[15px] leading-snug group-hover:text-slate-900 transition-colors truncate">{cat.name}</h3>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 ${accent.countBg} ${accent.countText} text-xs font-bold rounded-full`}>
                                                    {jobCount}
                                                </span>
                                                <span className="text-xs text-slate-400 font-medium">{jobCount === 1 ? t('home.openPosition') : t('home.openPositions')}</span>
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

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
                        <p className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-3">{t('home.testimonialsLabel')}</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t('home.testimonialsHeading')}</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                quote: t('home.testimonial1'),
                                name: t('home.testimonial1Name'),
                                role: t('home.testimonial1Role'),
                                initials: 'JN',
                                gradient: 'from-blue-500 to-blue-600',
                            },
                            {
                                quote: t('home.testimonial2'),
                                name: t('home.testimonial2Name'),
                                role: t('home.testimonial2Role'),
                                initials: 'AB',
                                gradient: 'from-amber-500 to-orange-500',
                            },
                            {
                                quote: t('home.testimonial3'),
                                name: t('home.testimonial3Name'),
                                role: t('home.testimonial3Role'),
                                initials: 'PF',
                                gradient: 'from-emerald-500 to-teal-500',
                            },
                        ].map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, si) => (
                                        <svg key={si} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed flex-1">&ldquo;{testimonial.quote}&rdquo;</p>
                                <div className="mt-5 pt-5 border-t border-gray-200 flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                                        {testimonial.initials}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{testimonial.name}</p>
                                        <p className="text-xs text-slate-400">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
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
                            <Link href="/jobs" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/[0.06] transition-all text-sm backdrop-blur-sm">
                                {t('home.browseJobs')}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </AppLayout>
    );
}
