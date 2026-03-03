import { Head, useForm, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { WorkerProfile, JobCategory, Skill } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import {
    User, FileText, Briefcase, MapPin, Globe, Award,
    ChevronRight, ChevronLeft, Check, Save, Sparkles,
    Clock, Banknote, Languages, ShieldCheck, Tag,
    AlertCircle,
} from 'lucide-react';

interface Props {
    profile: WorkerProfile;
    categories: JobCategory[];
    allSkills: Skill[];
}

/* ── Step config ─────────────────────────────────── */
const STEPS = [
    { key: 'identity', icon: User },
    { key: 'experience', icon: Briefcase },
    { key: 'rates', icon: Banknote },
    { key: 'location', icon: MapPin },
    { key: 'details', icon: Globe },
    { key: 'categories', icon: Tag },
] as const;

/* ── Fade animation ──────────────────────────────── */
const fadeSlide = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
    exit: { opacity: 0, x: -24, transition: { duration: 0.2 } },
};

export default function WorkerEdit({ profile, categories, allSkills }: Props) {
    const { t } = useTranslation();
    const [step, setStep] = useState(0);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const arrayToString = (arr: unknown): string => {
        if (Array.isArray(arr)) return arr.join(', ');
        if (typeof arr === 'string') return arr;
        return '';
    };

    const form = useForm({
        title: profile.title || '',
        bio: profile.bio || '',
        experience_level: profile.experience_level || 'entry',
        years_experience: profile.years_experience?.toString() || '0',
        hourly_rate: profile.hourly_rate?.toString() || '',
        daily_rate: profile.daily_rate?.toString() || '',
        city: profile.city || '',
        state: profile.state || '',
        availability: profile.availability || 'available',
        certifications: arrayToString(profile.certifications),
        languages: arrayToString(profile.languages),
        skills: profile.skills?.map(s => s.id) || [],
        categories: (profile.job_categories ?? profile.categories)?.map(c => c.id) || [],
    });

    const toggleCategory = (id: number) => {
        const current = form.data.categories as number[];
        if (current.includes(id)) {
            form.setData('categories', current.filter(x => x !== id));
        } else if (current.length < 3) {
            form.setData('categories', [...current, id]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put('/worker/profile');
    };

    const markTouched = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

    /* ── Per-step validation ─────────────────────────── */
    const stepValid = [
        /* 0 identity   */ form.data.title.trim() !== '' && form.data.bio.trim() !== '',
        /* 1 experience */ form.data.years_experience.trim() !== '',
        /* 2 rates      */ form.data.hourly_rate.trim() !== '' && form.data.daily_rate.trim() !== '',
        /* 3 location   */ form.data.city.trim() !== '' && form.data.state.trim() !== '',
        /* 4 details    */ form.data.languages.trim() !== '',
        /* 5 categories */ (form.data.categories as number[]).length > 0,
    ];
    const isFormValid = stepValid.every(Boolean);
    const completedSteps = stepValid.filter(Boolean).length;
    const progressPct = Math.round((completedSteps / STEPS.length) * 100);

    const stepLabels = [
        t('workerEdit.basicInfo'),
        t('workerEdit.experienceLevel'),
        t('workerEdit.rates'),
        t('workerEdit.location'),
        t('workerEdit.additionalDetails'),
        t('workerEdit.jobCategories'),
    ];

    /* ── Field helper ────────────────────────────────── */
    const fieldError = (name: string) => {
        const err = (form.errors as Record<string, string>)[name];
        if (!err) return null;
        return (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1.5 text-red-500 text-sm mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {err}
            </motion.p>
        );
    };

    const inputCls = (hasError?: boolean) =>
        `w-full rounded-xl border px-4 py-3 text-sm transition-all duration-200 bg-white
         focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500
         ${hasError ? 'border-red-300 bg-red-50/30' : 'border-gray-200 hover:border-gray-300'}`;

    const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

    return (
        <AppLayout>
            <Head title={t('workerEdit.pageTitle')} />

            {/* ── Hero header ──────────────────────────────── */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900" />
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/20 backdrop-blur-sm ring-1 ring-amber-400/30">
                                <Sparkles className="w-6 h-6 text-amber-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{t('workerEdit.heading')}</h1>
                                <p className="text-amber-200/80 text-sm mt-0.5">{t('workerEdit.subtitle')}</p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-slate-400">{t('workerEdit.profileCompletion') || 'Profile completion'}</span>
                                <span className={`text-xs font-bold ${progressPct === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>{progressPct}%</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                                <motion.div
                                    className={`h-full rounded-full ${progressPct === 100 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-amber-400 to-amber-500'}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPct}%` }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ── Main content ─────────────────────────────── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ── Sidebar steps (desktop) ──────────────── */}
                    <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-28 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-4 space-y-1">
                            {STEPS.map((s, i) => {
                                const Icon = s.icon;
                                const isActive = step === i;
                                const isDone = stepValid[i];
                                return (
                                    <button key={s.key} type="button" onClick={() => setStep(i)}
                                        className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-sm font-medium transition-all duration-200
                                            ${isActive
                                                ? 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200/60'
                                                : isDone
                                                    ? 'text-gray-600 hover:bg-gray-50'
                                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                            }`}>
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-colors
                                            ${isActive
                                                ? 'bg-amber-500 text-white shadow-sm'
                                                : isDone
                                                    ? 'bg-emerald-100 text-emerald-600'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {isDone && !isActive ? <Check className="w-4 h-4" strokeWidth={2.5} /> : <Icon className="w-4 h-4" />}
                                        </div>
                                        <span className="truncate">{stepLabels[i]}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.aside>

                    {/* ── Mobile step tabs ──────────────────────── */}
                    <div className="lg:hidden overflow-x-auto -mx-4 px-4 pb-2">
                        <div className="flex gap-2 min-w-max">
                            {STEPS.map((s, i) => {
                                const Icon = s.icon;
                                const isActive = step === i;
                                const isDone = stepValid[i];
                                return (
                                    <button key={s.key} type="button" onClick={() => setStep(i)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                                            ${isActive
                                                ? 'bg-amber-500 text-white shadow-md'
                                                : isDone
                                                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                                    : 'bg-white text-gray-500 ring-1 ring-gray-200'
                                            }`}>
                                        {isDone && !isActive ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                                        {stepLabels[i]}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Form panel ────────────────────────────── */}
                    <form onSubmit={handleSubmit} className="flex-1 min-w-0">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden">
                            <AnimatePresence mode="wait">
                                {/* ── Step 0: Identity ──────────────────── */}
                                {step === 0 && (
                                    <motion.div key="identity" {...fadeSlide} className="p-6 sm:p-8 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-600">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900">{t('workerEdit.basicInfo')}</h2>
                                                <p className="text-xs text-gray-400">{t('workerEdit.subtitle')}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelCls}>{t('workerEdit.professionalTitle')} <span className="text-red-400">*</span></label>
                                            <input type="text" required value={form.data.title}
                                                onBlur={() => markTouched('title')}
                                                onChange={(e) => form.setData('title', e.target.value)}
                                                placeholder={t('workerEdit.professionalTitlePlaceholder')}
                                                className={inputCls(touched.title && !form.data.title.trim())} />
                                            {fieldError('title')}
                                        </div>

                                        <div>
                                            <label className={labelCls}>{t('workerEdit.bio')} <span className="text-red-400">*</span></label>
                                            <textarea rows={5} required value={form.data.bio}
                                                onBlur={() => markTouched('bio')}
                                                onChange={(e) => form.setData('bio', e.target.value)}
                                                placeholder={t('workerEdit.bioPlaceholder')}
                                                className={inputCls(touched.bio && !form.data.bio.trim())} />
                                            <p className="text-xs text-gray-400 mt-1.5 text-right">{form.data.bio.length} / 5000</p>
                                            {fieldError('bio')}
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Step 1: Experience ────────────────── */}
                                {step === 1 && (
                                    <motion.div key="experience" {...fadeSlide} className="p-6 sm:p-8 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 text-violet-600">
                                                <Briefcase className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900">{t('workerEdit.experienceLevel')}</h2>
                                                <p className="text-xs text-gray-400">Tell us about your expertise</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={labelCls}>{t('workerEdit.experienceLevel')} <span className="text-red-400">*</span></label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {(['entry', 'intermediate', 'experienced', 'expert'] as const).map((level) => {
                                                    const labels: Record<string, string> = {
                                                        entry: t('workerEdit.entryLevel'),
                                                        intermediate: t('workerEdit.intermediate'),
                                                        experienced: t('workerEdit.experienced'),
                                                        expert: t('workerEdit.expert'),
                                                    };
                                                    const colors: Record<string, string> = {
                                                        entry: 'border-sky-400 bg-sky-50 text-sky-700 ring-sky-200',
                                                        intermediate: 'border-violet-400 bg-violet-50 text-violet-700 ring-violet-200',
                                                        experienced: 'border-amber-400 bg-amber-50 text-amber-700 ring-amber-200',
                                                        expert: 'border-rose-400 bg-rose-50 text-rose-700 ring-rose-200',
                                                    };
                                                    const isSelected = form.data.experience_level === level;
                                                    return (
                                                        <button key={level} type="button"
                                                            onClick={() => form.setData('experience_level', level)}
                                                            className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200
                                                                ${isSelected ? colors[level] + ' ring-2 shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}>
                                                            {labels[level]}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {fieldError('experience_level')}
                                        </div>

                                        <div>
                                            <label className={labelCls}>{t('workerEdit.yearsOfExperience')} <span className="text-red-400">*</span></label>
                                            <div className="relative">
                                                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input type="number" min="0" max="50" required value={form.data.years_experience}
                                                    onBlur={() => markTouched('years_experience')}
                                                    onChange={(e) => form.setData('years_experience', e.target.value)}
                                                    className={`${inputCls(touched.years_experience && !form.data.years_experience.trim())} pl-10`} />
                                            </div>
                                            {fieldError('years_experience')}
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Step 2: Rates ──────────────────────── */}
                                {step === 2 && (
                                    <motion.div key="rates" {...fadeSlide} className="p-6 sm:p-8 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600">
                                                <Banknote className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900">{t('workerEdit.rates')}</h2>
                                                <p className="text-xs text-gray-400">Set your pricing</p>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className={labelCls}>{t('workerEdit.hourlyRate')} <span className="text-red-400">*</span></label>
                                                <div className="relative">
                                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">FCFA</span>
                                                    <input type="number" min="0" step="100" required value={form.data.hourly_rate}
                                                        onBlur={() => markTouched('hourly_rate')}
                                                        onChange={(e) => form.setData('hourly_rate', e.target.value)}
                                                        placeholder="0"
                                                        className={`${inputCls(touched.hourly_rate && !form.data.hourly_rate.trim())} pl-16`} />
                                                </div>
                                                {fieldError('hourly_rate')}
                                            </div>
                                            <div>
                                                <label className={labelCls}>{t('workerEdit.dailyRate')} <span className="text-red-400">*</span></label>
                                                <div className="relative">
                                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">FCFA</span>
                                                    <input type="number" min="0" step="100" required value={form.data.daily_rate}
                                                        onBlur={() => markTouched('daily_rate')}
                                                        onChange={(e) => form.setData('daily_rate', e.target.value)}
                                                        placeholder="0"
                                                        className={`${inputCls(touched.daily_rate && !form.data.daily_rate.trim())} pl-16`} />
                                                </div>
                                                {fieldError('daily_rate')}
                                            </div>
                                        </div>

                                        {/* Tip card */}
                                        <div className="flex items-start gap-3 bg-amber-50 rounded-xl p-4 border border-amber-100">
                                            <Sparkles className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                                            <div className="text-sm text-amber-700 leading-relaxed">
                                                <p className="font-semibold mb-0.5">Pricing tip</p>
                                                <p className="text-amber-600">Research local market rates and set competitive prices. You can always adjust them later.</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Step 3: Location ───────────────────── */}
                                {step === 3 && (
                                    <motion.div key="location" {...fadeSlide} className="p-6 sm:p-8 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-50 text-rose-600">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900">{t('workerEdit.location')}</h2>
                                                <p className="text-xs text-gray-400">Where clients can find you</p>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className={labelCls}>{t('workerEdit.city')} <span className="text-red-400">*</span></label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <input type="text" required value={form.data.city}
                                                        onBlur={() => markTouched('city')}
                                                        onChange={(e) => form.setData('city', e.target.value)}
                                                        placeholder="e.g. Douala"
                                                        className={`${inputCls(touched.city && !form.data.city.trim())} pl-10`} />
                                                </div>
                                                {fieldError('city')}
                                            </div>
                                            <div>
                                                <label className={labelCls}>{t('workerEdit.stateProvince')} <span className="text-red-400">*</span></label>
                                                <input type="text" required value={form.data.state}
                                                    onBlur={() => markTouched('state')}
                                                    onChange={(e) => form.setData('state', e.target.value)}
                                                    placeholder="e.g. Littoral"
                                                    className={inputCls(touched.state && !form.data.state.trim())} />
                                                {fieldError('state')}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Step 4: Additional Details ─────────── */}
                                {step === 4 && (
                                    <motion.div key="details" {...fadeSlide} className="p-6 sm:p-8 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 text-sky-600">
                                                <Globe className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900">{t('workerEdit.additionalDetails')}</h2>
                                                <p className="text-xs text-gray-400">Languages, availability & certifications</p>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-5">
                                            <div>
                                                <label className={labelCls}>{t('workerEdit.availability')} <span className="text-red-400">*</span></label>
                                                <div className="space-y-2">
                                                    {(['available', 'busy', 'not_available'] as const).map((status) => {
                                                        const labels: Record<string, string> = {
                                                            available: t('availability.available'),
                                                            busy: t('availability.busy'),
                                                            not_available: t('availability.unavailable'),
                                                        };
                                                        const dots: Record<string, string> = {
                                                            available: 'bg-emerald-500',
                                                            busy: 'bg-amber-500',
                                                            not_available: 'bg-gray-400',
                                                        };
                                                        const isSelected = form.data.availability === status;
                                                        return (
                                                            <button key={status} type="button"
                                                                onClick={() => form.setData('availability', status)}
                                                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all
                                                                    ${isSelected ? 'border-amber-400 bg-amber-50 text-amber-700 ring-2 ring-amber-200' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                                                <span className={`w-2.5 h-2.5 rounded-full ${dots[status]} ${status === 'available' && isSelected ? 'animate-pulse' : ''}`} />
                                                                {labels[status]}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {fieldError('availability')}
                                            </div>
                                            <div className="space-y-5">
                                                <div>
                                                    <label className={labelCls}>{t('workerEdit.languages')} <span className="text-red-400">*</span></label>
                                                    <div className="relative">
                                                        <Languages className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                        <input type="text" required value={form.data.languages}
                                                            onBlur={() => markTouched('languages')}
                                                            onChange={(e) => form.setData('languages', e.target.value)}
                                                            placeholder={t('workerEdit.languagesPlaceholder')}
                                                            className={`${inputCls(touched.languages && !form.data.languages.trim())} pl-10`} />
                                                    </div>
                                                    {fieldError('languages')}
                                                </div>
                                                <div>
                                                    <label className={labelCls}>{t('workerEdit.certifications')}</label>
                                                    <div className="relative">
                                                        <Award className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                                                        <textarea rows={3} value={form.data.certifications}
                                                            onChange={(e) => form.setData('certifications', e.target.value)}
                                                            placeholder={t('workerEdit.certificationsPlaceholder')}
                                                            className={`${inputCls()} pl-10`} />
                                                    </div>
                                                    {fieldError('certifications')}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Step 5: Categories ─────────────────── */}
                                {step === 5 && (
                                    <motion.div key="categories" {...fadeSlide} className="p-6 sm:p-8 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900">{t('workerEdit.jobCategories')} <span className="text-red-400">*</span></h2>
                                                <p className="text-xs text-gray-400">
                                                    {t('workerEdit.categoriesDesc')}
                                                    <span className={`ml-2 font-bold ${(form.data.categories as number[]).length >= 3 ? 'text-amber-600' : (form.data.categories as number[]).length === 0 ? 'text-red-400' : 'text-gray-500'}`}>
                                                        ({(form.data.categories as number[]).length}/3)
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        {fieldError('categories')}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {categories.map((cat) => {
                                                const isSelected = (form.data.categories as number[]).includes(cat.id);
                                                const isDisabled = !isSelected && (form.data.categories as number[]).length >= 3;
                                                return (
                                                    <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                                                        disabled={isDisabled}
                                                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left text-sm font-medium transition-all duration-200
                                                            ${isSelected
                                                                ? 'border-amber-400 bg-amber-50 text-amber-800 ring-2 ring-amber-200/60 shadow-sm'
                                                                : isDisabled
                                                                    ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                            }`}>
                                                        <div className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 transition-colors
                                                            ${isSelected ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                            {isSelected ? <Check className="w-4 h-4" strokeWidth={2.5} /> : <Tag className="w-3.5 h-3.5" />}
                                                        </div>
                                                        <span className="truncate">{t(`categories.${cat.name}`) !== `categories.${cat.name}` ? t(`categories.${cat.name}`) : cat.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ── Navigation bar ────────────────────── */}
                            <div className="flex items-center justify-between px-6 sm:px-8 py-5 bg-gray-50/80 border-t border-gray-100">
                                <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all disabled:opacity-30 disabled:pointer-events-none">
                                    <ChevronLeft className="w-4 h-4" />
                                    {t('workerEdit.back') || 'Back'}
                                </button>

                                <div className="flex items-center gap-1.5">
                                    {STEPS.map((_, i) => (
                                        <button key={i} type="button" onClick={() => setStep(i)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300
                                                ${i === step ? 'w-6 bg-amber-500' : stepValid[i] ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                                    ))}
                                </div>

                                {step < STEPS.length - 1 ? (
                                    <button type="button" onClick={() => setStep(step + 1)}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900 shadow-sm transition-all">
                                        {t('workerEdit.next') || 'Next'}
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button type="submit" disabled={form.processing || !isFormValid}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md">
                                        {form.processing ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                {t('workerEdit.saving')}
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                {t('workerEdit.saveProfile')}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* ── Quick preview card ────────────────── */}
                        {isFormValid && (
                            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-5 flex items-start gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex-shrink-0">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-800">Profile ready!</p>
                                        <p className="text-xs text-emerald-600 mt-0.5">All required fields are completed. You can save your profile now.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
