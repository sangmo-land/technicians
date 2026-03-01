import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { JobListing } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
    job: JobListing;
    relatedJobs: JobListing[];
    isSaved: boolean;
    hasApplied: boolean;
}

const typeColors: Record<string, string> = {
    full_time: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    part_time: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    contract: 'bg-purple-50 text-purple-700 ring-purple-600/20',
    temporary: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    daily: 'bg-rose-50 text-rose-700 ring-rose-600/20',
};

export default function JobShow({ job, relatedJobs, isSaved, hasApplied }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const [showApplyModal, setShowApplyModal] = useState(false);

    const typeLabels: Record<string, string> = {
        full_time: t('jobTypes.full_time'), part_time: t('jobTypes.part_time'), contract: t('jobTypes.contract'), temporary: t('jobTypes.temporary'), daily: t('jobTypes.daily'),
    };

    const expLevelLabels: Record<string, string> = {
        entry: t('levels.entry'), junior: t('levels.junior'), mid: t('levels.mid'), senior: t('levels.senior'), lead: t('levels.lead'), executive: t('levels.executive'),
    };

    function timeAgo(dateStr: string) {
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return t('common.today');
        if (days === 1) return t('common.yesterday');
        if (days < 7) return t('common.daysAgo', { n: days });
        if (days < 30) return t('common.weeksAgo', { n: Math.floor(days / 7) });
        return t('common.monthsAgo', { n: Math.floor(days / 30) });
    }

    function daysUntil(dateStr: string) {
        const diff = new Date(dateStr).getTime() - Date.now();
        const days = Math.ceil(diff / 86400000);
        if (days < 0) return t('jobShow.expired');
        if (days === 0) return t('common.today');
        if (days === 1) return t('jobShow.tomorrow');
        return t('jobShow.daysLeft', { count: days });
    }

    const form = useForm({
        cover_letter: '',
        expected_salary: '',
        available_start_date: '',
    });

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/jobs/${job.id}/apply`, {
            onSuccess: () => setShowApplyModal(false),
        });
    };

    const salaryDisplay = () => {
        if (!job.salary_min && !job.salary_max) return null;
        const min = job.salary_min ? `${Number(job.salary_min).toLocaleString()} FCFA` : '';
        const max = job.salary_max ? `${Number(job.salary_max).toLocaleString()} FCFA` : '';
        const range = min && max ? `${min} – ${max}` : min || max;
        return range;
    };

    const deadlineUrgent = job.application_deadline
        ? (new Date(job.application_deadline).getTime() - Date.now()) / 86400000 <= 7
        : false;

    return (
        <AppLayout>
            <Head title={`${job.title} - CivilHire`} />

            {/* ═══════ Hero Section ═══════ */}
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-600/5 rounded-full blur-3xl" />
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm mb-8">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">{t('jobShow.home')}</Link>
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <Link href="/jobs" className="text-gray-400 hover:text-white transition-colors">{t('jobShow.jobs')}</Link>
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        <span className="text-gray-300 truncate max-w-[200px]">{job.title}</span>
                    </nav>

                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="flex-1 min-w-0">
                                {/* Badges row */}
                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${typeColors[job.employment_type] || 'bg-gray-50 text-gray-700 ring-gray-600/20'}`}>
                                        {typeLabels[job.employment_type]}
                                    </span>
                                    {job.is_featured && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 ring-1 ring-inset ring-amber-500/30">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            Featured
                                        </span>
                                    )}
                                    {job.is_urgent && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 ring-1 ring-inset ring-red-500/30 animate-pulse">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                            {t('jobShow.urgentHire')}
                                        </span>
                                    )}
                                    {job.is_remote && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 ring-1 ring-inset ring-cyan-500/30">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {t('jobShow.remote')}
                                        </span>
                                    )}
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">{job.title}</h1>

                                {/* Meta info */}
                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-gray-300">
                                    {job.company && (
                                        <span className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                                                <span className="text-amber-400 text-xs font-bold">{job.company.name.charAt(0)}</span>
                                            </div>
                                            <span className="font-medium text-white">{job.company.name}</span>
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5 text-sm">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                        {job.location}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Posted {timeAgo(job.created_at)}
                                    </span>
                                    {job.views_count > 0 && (
                                        <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            {t('jobShow.views', { count: job.views_count.toLocaleString() })}
                                        </span>
                                    )}
                                </div>

                                {/* Salary highlight */}
                                {salaryDisplay() && (
                                    <div className="mt-5 inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-3">
                                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span className="text-xl font-bold text-white">{salaryDisplay()}</span>
                                        <span className="text-sm text-gray-400">/ {job.salary_period}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 lg:mt-6">
                                {auth?.user && (
                                    <Link href={`/jobs/${job.id}/save`} method="post" as="button"
                                        className={`group inline-flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${isSaved
                                            ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25'
                                            : 'border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                                        }`}>
                                        <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                        {isSaved ? t('common.saved') : t('common.save')}
                                    </Link>
                                )}
                                <button
                                    onClick={() => navigator.share?.({ title: job.title, url: window.location.href }) || navigator.clipboard.writeText(window.location.href)}
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-white text-sm font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
                                    {t('common.share')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ═══════ Main Content ═══════ */}
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* ─── Left Column ─── */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex-1 min-w-0 space-y-6">

                            {/* Key Details Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {(job.salary_min || job.salary_max) && (
                                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
                                            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{t('jobShow.salary')}</p>
                                        <p className="font-bold text-gray-900 text-sm">
                                            {job.salary_min && `${Number(job.salary_min).toLocaleString()} FCFA`}
                                            {job.salary_min && job.salary_max && ' – '}
                                            {job.salary_max && `${Number(job.salary_max).toLocaleString()} FCFA`}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">{t('jobShow.per', { period: job.salary_period })}</p>
                                    </div>
                                )}
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
                                    </div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{t('jobShow.experience')}</p>
                                    <p className="font-bold text-gray-900 text-sm capitalize">{expLevelLabels[job.experience_level] || job.experience_level}</p>
                                </div>
                                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                    </div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{t('jobShow.positions')}</p>
                                    <p className="font-bold text-gray-900 text-sm">{job.positions_available} {job.positions_available === 1 ? t('jobShow.opening', { count: '' }).trim() : t('jobShow.openings', { count: '' }).trim()}</p>
                                </div>
                                {job.application_deadline && (
                                    <div className={`bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow ${deadlineUrgent ? 'border-red-200' : 'border-gray-100'}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${deadlineUrgent ? 'bg-red-50' : 'bg-violet-50'}`}>
                                            <svg className={`w-5 h-5 ${deadlineUrgent ? 'text-red-600' : 'text-violet-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                                        </div>
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{t('jobShow.deadline')}</p>
                                        <p className="font-bold text-gray-900 text-sm">{new Date(job.application_deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        <p className={`text-xs mt-0.5 ${deadlineUrgent ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>{daysUntil(job.application_deadline)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Description Section */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-900">{t('jobShow.description')}</h2>
                                    </div>
                                </div>
                                <div className="px-8 py-6">
                                    <div className="prose prose-gray prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900" dangerouslySetInnerHTML={{ __html: job.description }} />
                                </div>
                            </div>

                            {/* Requirements */}
                            {job.requirements && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-8 py-6 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900">{t('jobShow.requirements')}</h2>
                                        </div>
                                    </div>
                                    <div className="px-8 py-6">
                                        <div className="prose prose-gray prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900" dangerouslySetInnerHTML={{ __html: job.requirements }} />
                                    </div>
                                </div>
                            )}

                            {/* Responsibilities */}
                            {job.responsibilities && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-8 py-6 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900">{t('jobShow.responsibilities')}</h2>
                                        </div>
                                    </div>
                                    <div className="px-8 py-6">
                                        <div className="prose prose-gray prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900" dangerouslySetInnerHTML={{ __html: job.responsibilities }} />
                                    </div>
                                </div>
                            )}

                            {/* Benefits */}
                            {job.benefits && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-8 py-6 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900">{t('jobShow.benefits')}</h2>
                                        </div>
                                    </div>
                                    <div className="px-8 py-6">
                                        <div className="prose prose-gray prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900" dangerouslySetInnerHTML={{ __html: job.benefits }} />
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {job.skills && job.skills.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="px-8 py-6 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                            </div>
                                            <h2 className="text-lg font-bold text-gray-900">{t('jobShow.requiredSkills')}</h2>
                                        </div>
                                    </div>
                                    <div className="px-8 py-6">
                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.map((skill) => (
                                                <span key={skill.id} className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors cursor-default">
                                                    {skill.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* ─── Right Sidebar ─── */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }} className="lg:w-[360px] flex-shrink-0 space-y-6">

                            {/* Apply Card */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                                <div className="p-6">
                                    {auth?.user ? (
                                        hasApplied ? (
                                            <div className="text-center py-4">
                                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                                    <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <p className="font-bold text-gray-900 text-lg">{t('jobShow.applicationSubmitted')}</p>
                                                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{t('jobShow.applicationReceived')}</p>
                                                <Link href="/my-applications" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-medium mt-4 group">
                                                    {t('jobShow.viewMyApplications')}
                                                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div>
                                                <button onClick={() => setShowApplyModal(true)}
                                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-amber-600/25 hover:shadow-xl hover:shadow-amber-600/30 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" /></svg>
                                                    {t('jobShow.applyNow')}
                                                </button>
                                                {job.application_deadline && (
                                                    <p className={`text-center text-xs mt-3 ${deadlineUrgent ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                                                        {deadlineUrgent ? '⚡ ' : ''}{t('jobShow.applicationCloses', { date: new Date(job.application_deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) })}
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-center py-2">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                                            </div>
                                            <p className="text-sm text-gray-500 mb-4">{t('jobShow.signInToApply')}</p>
                                            <Link href="/login" className="block w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 text-center shadow-lg shadow-amber-600/20">
                                                {t('jobShow.signInButton')}
                                            </Link>
                                            <Link href="/register" className="block text-sm text-gray-500 hover:text-amber-600 mt-3 transition-colors">
                                                {t('jobShow.noAccountRegister')}
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* Company Info */}
                                {job.company && (
                                    <div className="border-t border-gray-100 p-6">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{t('jobShow.aboutCompany')}</p>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-sm">
                                                <span className="text-white font-bold text-lg">{job.company.name.charAt(0)}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-gray-900 truncate">{job.company.name}</p>
                                                {job.company.city && (
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                                        {job.company.city}, {job.company.state}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {job.company.description && (
                                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-4">{job.company.description}</p>
                                        )}
                                    </div>
                                )}

                                {/* Job Details */}
                                <div className="border-t border-gray-100 p-6">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{t('jobShow.jobDetails')}</p>
                                    <div className="space-y-3">
                                        {job.job_category && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6h.008v.008H6V6z" /></svg>
                                                    {t('jobShow.category')}</span>
                                            </div>
                                        )}
                                        {job.project_name && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
                                                    {t('jobShow.project')}
                                                </span>
                                                <span className="text-sm font-medium text-gray-900">{job.project_name}</span>
                                            </div>
                                        )}
                                        {job.project_duration_months && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {t('jobShow.duration')}
                                                </span>
                                                <span className="text-sm font-medium text-gray-900">{t('jobShow.months', { count: job.project_duration_months })}</span>
                                            </div>
                                        )}
                                        {job.start_date && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                                                    {t('jobShow.startDate')}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Posted
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">{new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Related Jobs */}
                            {relatedJobs.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>
                                            </div>
                                            <h3 className="font-bold text-gray-900">{t('jobShow.similarPositions')}</h3>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {relatedJobs.map((rJob) => (
                                            <Link key={rJob.id} href={`/jobs/${rJob.slug}`}
                                                className="flex items-start gap-3 p-5 hover:bg-gray-50/80 transition-colors group">
                                                <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-amber-50 flex items-center justify-center flex-shrink-0 transition-colors">
                                                    <span className="text-xs font-bold text-gray-500 group-hover:text-amber-600 transition-colors">{rJob.company?.name?.charAt(0) || '?'}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-gray-900 text-sm group-hover:text-amber-700 transition-colors truncate">{rJob.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{rJob.company?.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                                            {rJob.location}
                                                        </span>
                                                    </div>
                                                </div>
                                                <svg className="w-4 h-4 text-gray-300 group-hover:text-amber-500 ml-auto mt-1 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ═══════ Apply Modal ═══════ */}
            <AnimatePresence>
                {showApplyModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setShowApplyModal(false)}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: 'spring', duration: 0.4 }}
                            className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-white">{t('jobShow.applyForPosition')}</h2>
                                        <p className="text-sm text-gray-300 mt-0.5">{job.title} · {job.company?.name}</p>
                                    </div>
                                    <button onClick={() => setShowApplyModal(false)} className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
                                <form onSubmit={handleApply} className="p-6 space-y-5">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                            {t('jobShow.coverLetter')}
                                        </label>
                                        <textarea rows={5} value={form.data.cover_letter}
                                            onChange={(e) => form.setData('cover_letter', e.target.value)}
                                            placeholder={t('jobShow.coverLetterPlaceholder')}
                                            className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none text-sm" />
                                        {form.errors.cover_letter && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{form.errors.cover_letter}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {t('jobShow.expectedSalary')}
                                            </label>
                                            <input type="number" value={form.data.expected_salary}
                                                onChange={(e) => form.setData('expected_salary', e.target.value)}
                                                placeholder={t('jobShow.salaryPlaceholder')}
                                                className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm" />
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                                                Start Date
                                            </label>
                                            <input type="date" value={form.data.available_start_date}
                                                onChange={(e) => form.setData('available_start_date', e.target.value)}
                                                className="w-full rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm" />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-3 border-t border-gray-100">
                                        <button type="button" onClick={() => setShowApplyModal(false)}
                                            className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors text-sm">
                                            {t('common.cancel')}
                                        </button>
                                        <button type="submit" disabled={form.processing}
                                            className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold disabled:opacity-50 transition-all shadow-lg shadow-amber-600/20 text-sm flex items-center justify-center gap-2">
                                            {form.processing ? (
                                                <>
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                                                    {t('jobShow.submitting')}
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                                                    {t('jobShow.submitApplication')}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AppLayout>
    );
}
