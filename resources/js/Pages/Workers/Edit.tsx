import { Head, useForm, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import { cameroonRegions } from '@/data/cameroonLocations';
import { compressImage } from '@/utils/compressImage';
import AppLayout from '@/Layouts/AppLayout';
import { WorkerProfile, JobCategory, Skill, WorkExperience, PortfolioPhoto } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import {
    User, FileText, Briefcase, MapPin, Globe, Award,
    ChevronRight, ChevronLeft, Check, Save, Sparkles,
    Clock, Banknote, Languages, ShieldCheck, Tag,
    AlertCircle, HardHat, Plus, Trash2, Calendar,
    Camera, Upload, X, ImagePlus, Pencil, Phone,
} from 'lucide-react';

interface Props {
    profile: WorkerProfile;
    categories: JobCategory[];
    allSkills: Skill[];
}

/* ── Step config ─────────────────────────────────── */
interface WorkExpEntry {
    id?: number;
    job_title: string;
    company_name: string;
    project_name: string;
    description: string;
    location: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
}

const emptyExp = (): WorkExpEntry => ({
    job_title: '', company_name: '', project_name: '', description: '',
    location: '', start_date: '', end_date: '', is_current: false,
});

const STEPS = [
    { key: 'identity', icon: User },
    { key: 'experience', icon: Briefcase },
    { key: 'work_history', icon: HardHat },
    { key: 'rates', icon: Banknote },
    { key: 'location', icon: MapPin },
    { key: 'details', icon: Globe },
    { key: 'categories', icon: Tag },
    { key: 'portfolio', icon: Camera },
] as const;

/* ── Fade animation ──────────────────────────────── */
const fadeSlide = {
    initial: { opacity: 0, x: 24 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
    exit: { opacity: 0, x: -24, transition: { duration: 0.2 } },
};

export default function WorkerEdit({ profile, categories, allSkills }: Props) {
    const { t } = useTranslation();
    const initialStep = typeof window !== 'undefined'
        ? Math.min(Math.max(Number(new URLSearchParams(window.location.search).get('step')) || 0, 0), STEPS.length - 1)
        : 0;
    const [step, setStep] = useState(initialStep);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0, initialStep]));
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [errorStep, setErrorStep] = useState<number | null>(null);

    const goToStep = (i: number) => {
        setStep(i);
        setVisitedSteps(prev => new Set(prev).add(i));
    };

    const arrayToString = (arr: unknown): string => {
        if (Array.isArray(arr)) return arr.join(', ');
        if (typeof arr === 'string') return arr;
        return '';
    };

    /* Resolve the primary category ID from the profile title */
    const existingCategoryIds = (profile.job_categories ?? profile.categories)?.map(c => c.id) || [];
    const matchedPrimary = categories.find(c => c.name === profile.title);
    const initialPrimaryCategoryId = matchedPrimary?.id.toString() || '';

    const initialExperiences: WorkExpEntry[] = (profile.work_experiences && profile.work_experiences.length > 0)
        ? profile.work_experiences.map(we => ({
            id: we.id,
            job_title: we.job_title || '',
            company_name: we.company_name || '',
            project_name: we.project_name || '',
            description: we.description || '',
            location: we.location || '',
            start_date: we.start_date ? we.start_date.split('T')[0] : '',
            end_date: we.end_date ? we.end_date.split('T')[0] : '',
            is_current: we.is_current || false,
        }))
        : [];

    const [workExperiences, setWorkExperiences] = useState<WorkExpEntry[]>(initialExperiences);

    /* ── Portfolio photos state ───────────────────── */
    const [photos, setPhotos] = useState<PortfolioPhoto[]>(profile.portfolio_photos || []);
    const [uploading, setUploading] = useState(false);
    const [editingCaption, setEditingCaption] = useState<number | null>(null);
    const [captionText, setCaptionText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── Profile photo (avatar) state ────────────── */
    const [avatar, setAvatar] = useState<string | null>(profile.user?.avatar || null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Sync photos when props change (after Inertia redirect)
    useEffect(() => {
        setPhotos(profile.portfolio_photos || []);
    }, [profile.portfolio_photos]);

    // Sync avatar when props change
    useEffect(() => {
        setAvatar(profile.user?.avatar || null);
    }, [profile.user?.avatar]);

    const addExperience = () => setWorkExperiences(prev => [...prev, emptyExp()]);
    const removeExperience = (idx: number) => setWorkExperiences(prev => prev.filter((_, i) => i !== idx));
    const updateExperience = (idx: number, field: keyof WorkExpEntry, value: string | boolean) => {
        setWorkExperiences(prev => prev.map((exp, i) => {
            if (i !== idx) return exp;
            const updated = { ...exp, [field]: value };
            if (field === 'is_current' && value === true) updated.end_date = '';
            return updated;
        }));
    };

    const form = useForm({
        title: profile.title || '',
        primary_category_id: initialPrimaryCategoryId,
        bio: profile.bio || '',
        phone: profile.user?.phone || '',
        experience_level: profile.experience_level || 'entry',
        years_experience: profile.years_experience?.toString() || '0',
        hourly_rate: profile.hourly_rate?.toString() || '0',
        daily_rate: profile.daily_rate?.toString() || '',
        city: profile.city || '',
        state: profile.state || '',
        availability: profile.availability || 'available',
        certifications: arrayToString(profile.certifications),
        languages: Array.isArray(profile.languages) ? profile.languages.join(', ') : (profile.languages || ''),
        skills: profile.skills?.map(s => s.id) || [],
        categories: existingCategoryIds,
    });

    /* When the primary category changes, update title + categories */
    const handlePrimaryCategoryChange = (categoryId: string) => {
        const prevPrimaryId = Number(form.data.primary_category_id);
        const newPrimaryId = Number(categoryId);
        const cat = categories.find(c => c.id === newPrimaryId);

        // Update title to the category name
        form.setData(data => {
            const currentCats = data.categories as number[];
            // Remove old primary from categories if it was there
            let updated = prevPrimaryId ? currentCats.filter(id => id !== prevPrimaryId) : [...currentCats];
            // Add new primary
            if (newPrimaryId && !updated.includes(newPrimaryId)) {
                updated = [newPrimaryId, ...updated];
            }
            // Ensure max 3 total
            if (updated.length > 3) updated = updated.slice(0, 3);
            return {
                ...data,
                primary_category_id: categoryId,
                title: cat?.name || '',
                categories: updated,
            };
        });
    };

    const primaryCatId = Number(form.data.primary_category_id);
    const extraCategories = (form.data.categories as number[]).filter(id => id !== primaryCatId);

    const toggleCategory = (id: number) => {
        // Don't allow toggling the primary category off from here
        if (id === primaryCatId) return;
        const current = form.data.categories as number[];
        if (current.includes(id)) {
            form.setData('categories', current.filter(x => x !== id));
        } else if (extraCategories.length < 2) {
            form.setData('categories', [...current, id]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Include work experiences in the form data before submitting
        form.transform((data) => ({
            ...data,
            work_experiences: workExperiences,
        }));
        form.put('/worker/profile', {
            onError: (errors) => {
                const fieldToStep: Record<string, number> = {
                    title: 0, primary_category_id: 0, bio: 0, phone: 0,
                    experience_level: 1, years_experience: 1,
                    work_experiences: 2,
                    hourly_rate: 3, daily_rate: 3,
                    city: 4, state: 4,
                    availability: 5, languages: 5, certifications: 5,
                    skills: 6, categories: 6,
                };
                const msgs = Object.values(errors) as string[];
                const firstErrorField = Object.keys(errors)[0];
                const targetStep = fieldToStep[firstErrorField] ?? null;
                setErrorMessages(msgs);
                setErrorStep(targetStep);
                setShowErrorDialog(true);
            },
        });
    };

    const markTouched = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));

    /* ── Cameroon cascading location state ────────── */
    // Derive initial region/division from existing profile data
    const inferredRegion = useMemo(() => {
        if (!profile.state) return '';
        const found = cameroonRegions.find(r => r.name === profile.state);
        return found ? found.name : '';
    }, [profile.state]);

    const inferredDivision = useMemo(() => {
        if (!inferredRegion || !profile.city) return '';
        const region = cameroonRegions.find(r => r.name === inferredRegion);
        if (!region) return '';
        for (const div of region.divisions) {
            if (div.subdivisions.some(s => s.name === profile.city)) return div.name;
        }
        return '';
    }, [inferredRegion, profile.city]);

    const [selectedRegion, setSelectedRegion] = useState(inferredRegion);
    const [selectedDivision, setSelectedDivision] = useState(inferredDivision);

    const availableDivisions = useMemo(() => {
        const region = cameroonRegions.find(r => r.name === selectedRegion);
        return region ? region.divisions : [];
    }, [selectedRegion]);

    const availableSubdivisions = useMemo(() => {
        const region = cameroonRegions.find(r => r.name === selectedRegion);
        if (!region) return [];
        const div = region.divisions.find(d => d.name === selectedDivision);
        return div ? div.subdivisions : [];
    }, [selectedRegion, selectedDivision]);

    /* ── Language toggle helpers ──────────────────── */
    const selectedLanguages = useMemo(() => {
        const raw = form.data.languages;
        if (!raw) return [] as string[];
        return raw.split(',').map((s: string) => s.trim()).filter(Boolean);
    }, [form.data.languages]);

    const toggleLanguage = (lang: string) => {
        const current = selectedLanguages;
        const next = current.includes(lang)
            ? current.filter((l: string) => l !== lang)
            : [...current, lang];
        form.setData('languages', next.join(', '));
    };

    /* ── Per-step validation ─────────────────────────── */
    const workExpValid = workExperiences.length === 0 || workExperiences.every(
        we => we.job_title.trim() !== '' && we.company_name.trim() !== '' && we.start_date !== '' && (we.is_current || we.end_date !== '')
    );
    const stepFieldsValid = [
        /* 0 identity     */ form.data.primary_category_id !== '' && form.data.bio.trim() !== '' && form.data.phone.trim() !== '',
        /* 1 experience   */ form.data.experience_level.trim() !== '' && form.data.years_experience.trim() !== '' && Number(form.data.years_experience) >= 0,
        /* 2 work history */ workExpValid,
        /* 3 rates        */ form.data.daily_rate.trim() !== '' && Number(form.data.daily_rate) > 0,
        /* 4 location     */ form.data.state.trim() !== '',
        /* 5 details      */ form.data.availability.trim() !== '' && form.data.languages.trim().length > 0,
        /* 6 categories   */ true, /* always valid — primary category is enforced in step 0; extra categories are optional */
        /* 7 portfolio    */ true, /* always valid — portfolio photos are optional */
    ];
    // A step counts as "done" only if the user has visited it AND all its fields are valid
    const stepValid = stepFieldsValid.map((valid, i) => visitedSteps.has(i) && valid);
    const isFormValid = stepFieldsValid.every(Boolean);
    const completedSteps = stepValid.filter(Boolean).length;
    const progressPct = Math.round((completedSteps / STEPS.length) * 100);

    const stepLabels = [
        t('workerEdit.basicInfo'),
        t('workerEdit.experienceLevel'),
        t('workerEdit.workHistory'),
        t('workerEdit.rates'),
        t('workerEdit.location'),
        t('workerEdit.additionalDetails'),
        t('workerEdit.jobCategories'),
        t('workerEdit.portfolio'),
    ];

    /* ── Avatar upload handler ────────────────────── */
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const compressed = await compressImage(file, 800, 800, 0.85);

        const formData = new FormData();
        formData.append('avatar', compressed);

        setUploadingAvatar(true);
        router.post('/worker/profile/avatar', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setUploadingAvatar(false);
                if (avatarInputRef.current) avatarInputRef.current.value = '';
            },
            onError: () => {
                setUploadingAvatar(false);
                if (avatarInputRef.current) avatarInputRef.current.value = '';
            },
        });
    };

    /* ── Portfolio handlers ───────────────────────── */
    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const compressed = await Promise.all(
            Array.from(files).map((f) => compressImage(f, 1200, 1200, 0.8))
        );

        const formData = new FormData();
        compressed.forEach(file => formData.append('photos[]', file));

        setUploading(true);
        router.post('/worker/profile/photos', formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
            onError: () => {
                setUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    const handleDeletePhoto = (photoId: number) => {
        if (!confirm(t('workerEdit.confirmDeletePhoto') || 'Delete this photo?')) return;
        router.delete(`/worker/profile/photos/${photoId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setPhotos(prev => prev.filter(p => p.id !== photoId));
            },
        });
    };

    const startEditCaption = (photo: PortfolioPhoto) => {
        setEditingCaption(photo.id);
        setCaptionText(photo.caption || '');
    };

    const saveCaption = (photoId: number) => {
        router.patch(`/worker/profile/photos/${photoId}/caption`, { caption: captionText }, {
            preserveScroll: true,
            onSuccess: () => {
                setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, caption: captionText } : p));
                setEditingCaption(null);
            },
        });
    };

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
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 lg:-mt-6 pb-16">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">

                    {/* ── Sidebar steps (desktop) ──────────────── */}
                    <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-28 bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 p-4 space-y-1">
                            {STEPS.map((s, i) => {
                                const Icon = s.icon;
                                const isActive = step === i;
                                const isDone = stepValid[i];
                                return (
                                    <button key={s.key} type="button" onClick={() => goToStep(i)}
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
                    <div className="lg:hidden -mx-4 sm:-mx-6">
                        <div className="overflow-x-auto px-4 sm:px-6 pb-3 scrollbar-hide">
                            <div className="flex gap-2 w-max">
                                {STEPS.map((s, i) => {
                                    const Icon = s.icon;
                                    const isActive = step === i;
                                    const isDone = stepValid[i];
                                    return (
                                        <button key={s.key} type="button" onClick={() => goToStep(i)}
                                            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                                                ${isActive
                                                    ? 'bg-amber-500 text-white shadow-md'
                                                    : isDone
                                                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                                        : 'bg-white text-gray-500 ring-1 ring-gray-200'
                                                }`}>
                                            {isDone && !isActive ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                                            <span className="hidden sm:inline">{stepLabels[i]}</span>
                                        </button>
                                    );
                                })}
                            </div>
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
                                            <select required value={form.data.primary_category_id}
                                                onBlur={() => markTouched('title')}
                                                onChange={(e) => handlePrimaryCategoryChange(e.target.value)}
                                                className={inputCls(touched.title && !form.data.primary_category_id)}>
                                                <option value="">{t('workerEdit.selectProfessionalTitle') || 'Select your professional title...'}</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id.toString()}>
                                                        {t(`categories.${cat.name}`) !== `categories.${cat.name}` ? t(`categories.${cat.name}`) : cat.name}
                                                    </option>
                                                ))}
                                            </select>
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

                                        <div>
                                            <label className={labelCls}>{t('workerEdit.phoneNumber')} <span className="text-red-400">*</span></label>
                                            <div className="relative">
                                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <input type="tel" required value={form.data.phone}
                                                    onBlur={() => markTouched('phone')}
                                                    onChange={(e) => form.setData('phone', e.target.value)}
                                                    placeholder={t('workerEdit.phonePlaceholder')}
                                                    className={`${inputCls(touched.phone && !form.data.phone.trim())} pl-10`} />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">{t('workerEdit.phoneHint')}</p>
                                            {fieldError('phone')}
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

                                {/* ── Step 2: Work History ────────────── */}
                                {step === 2 && (
                                    <motion.div key="work_history" {...fadeSlide} className="p-6 sm:p-8 space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-orange-600">
                                                    <HardHat className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-gray-900">{t('workerEdit.workHistory')} <span className="text-sm font-normal text-gray-400">({t('workerEdit.optional')})</span></h2>
                                                    <p className="text-xs text-gray-400">{t('workerEdit.workHistoryDesc')}</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={addExperience}
                                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 shadow-sm transition-all">
                                                <Plus className="w-4 h-4" />
                                                {t('workerEdit.addExperience')}
                                            </button>
                                        </div>

                                        {workExperiences.length === 0 && (
                                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                                                <HardHat className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                                <p className="text-sm font-medium text-gray-400">{t('workerEdit.noExperienceYet')}</p>
                                                <p className="text-xs text-gray-300 mt-1">{t('workerEdit.noExperienceHint')}</p>
                                            </div>
                                        )}

                                        <div className="space-y-5">
                                            {workExperiences.map((exp, idx) => (
                                                <div key={idx} className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-4 relative">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                            {t('workerEdit.experienceEntry')} #{idx + 1}
                                                        </span>
                                                        <button type="button" onClick={() => removeExperience(idx)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            {t('workerEdit.remove')}
                                                        </button>
                                                    </div>

                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className={labelCls}>{t('workerEdit.jobTitle')} <span className="text-red-400">*</span></label>
                                                            <input type="text" value={exp.job_title}
                                                                onChange={(e) => updateExperience(idx, 'job_title', e.target.value)}
                                                                placeholder={t('workerEdit.jobTitlePlaceholder')}
                                                                className={inputCls(!exp.job_title.trim() && touched[`exp_${idx}_title`])}
                                                                onBlur={() => markTouched(`exp_${idx}_title`)} />
                                                        </div>
                                                        <div>
                                                            <label className={labelCls}>{t('workerEdit.companyName')} <span className="text-red-400">*</span></label>
                                                            <input type="text" value={exp.company_name}
                                                                onChange={(e) => updateExperience(idx, 'company_name', e.target.value)}
                                                                placeholder={t('workerEdit.companyNamePlaceholder')}
                                                                className={inputCls(!exp.company_name.trim() && touched[`exp_${idx}_company`])}
                                                                onBlur={() => markTouched(`exp_${idx}_company`)} />
                                                        </div>
                                                    </div>

                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className={labelCls}>{t('workerEdit.project')}</label>
                                                            <input type="text" value={exp.project_name}
                                                                onChange={(e) => updateExperience(idx, 'project_name', e.target.value)}
                                                                placeholder={t('workerEdit.projectPlaceholder')}
                                                                className={inputCls()} />
                                                        </div>
                                                        <div>
                                                            <label className={labelCls}>{t('workerEdit.expLocation')}</label>
                                                            <div className="relative">
                                                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                <input type="text" value={exp.location}
                                                                    onChange={(e) => updateExperience(idx, 'location', e.target.value)}
                                                                    placeholder={t('workerEdit.expLocationPlaceholder')}
                                                                    className={`${inputCls()} pl-10`} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className={labelCls}>{t('workerEdit.expDescription')}</label>
                                                        <textarea rows={3} value={exp.description}
                                                            onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                                                            placeholder={t('workerEdit.expDescriptionPlaceholder')}
                                                            className={inputCls()} />
                                                    </div>

                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className={labelCls}>{t('workerEdit.startDate')} <span className="text-red-400">*</span></label>
                                                            <div className="relative">
                                                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                <input type="date" value={exp.start_date}
                                                                    onChange={(e) => updateExperience(idx, 'start_date', e.target.value)}
                                                                    className={`${inputCls(!exp.start_date && touched[`exp_${idx}_start`])} pl-10`}
                                                                    onBlur={() => markTouched(`exp_${idx}_start`)} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className={labelCls}>{t('workerEdit.endDate')} {!exp.is_current && <span className="text-red-400">*</span>}</label>
                                                            <div className="relative">
                                                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                <input type="date" value={exp.end_date}
                                                                    onChange={(e) => updateExperience(idx, 'end_date', e.target.value)}
                                                                    disabled={exp.is_current}
                                                                    className={`${inputCls(!exp.is_current && !exp.end_date && touched[`exp_${idx}_end`])} pl-10 disabled:bg-gray-100 disabled:text-gray-400`}
                                                                    onBlur={() => markTouched(`exp_${idx}_end`)} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                                                        <input type="checkbox" checked={exp.is_current}
                                                            onChange={(e) => updateExperience(idx, 'is_current', e.target.checked)}
                                                            className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500" />
                                                        <span className="text-sm font-medium text-gray-600">{t('workerEdit.currentlyWorking')}</span>
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Step 3: Rates ────────────────────── */}
                                {step === 3 && (
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

                                {/* ── Step 4: Location ─────────────────── */}
                                {step === 4 && (
                                    <motion.div key="location" {...fadeSlide} className="p-6 sm:p-8 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-50 text-rose-600">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900">{t('workerEdit.location')}</h2>
                                                <p className="text-xs text-gray-400">{t('workerEdit.locationDesc')}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            {/* Region */}
                                            <div>
                                                <label className={labelCls}>{t('workerEdit.region')} <span className="text-red-400">*</span></label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                    <select
                                                        value={selectedRegion}
                                                        onBlur={() => markTouched('state')}
                                                        onChange={(e) => {
                                                            const region = e.target.value;
                                                            setSelectedRegion(region);
                                                            setSelectedDivision('');
                                                            form.setData(prev => ({ ...prev, state: region, city: '' }));
                                                        }}
                                                        className={`${inputCls(touched.state && !form.data.state.trim())} pl-10 appearance-none`}>
                                                        <option value="">{t('workerEdit.selectRegion')}</option>
                                                        {cameroonRegions.map(r => (
                                                            <option key={r.name} value={r.name}>{r.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                {fieldError('state')}
                                            </div>

                                            {/* Division (Optional) */}
                                            {selectedRegion && (
                                                <div>
                                                    <label className={labelCls}>{t('workerEdit.division')} <span className="text-gray-400 text-xs font-normal">({t('workerEdit.optional')})</span></label>
                                                    <select
                                                        value={selectedDivision}
                                                        onChange={(e) => {
                                                            const div = e.target.value;
                                                            setSelectedDivision(div);
                                                            form.setData('city', '');
                                                        }}
                                                        className={`${inputCls()} appearance-none`}>
                                                        <option value="">{t('workerEdit.selectDivision')}</option>
                                                        {availableDivisions.map(d => (
                                                            <option key={d.name} value={d.name}>{d.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {/* Subdivision (Optional) */}
                                            {selectedDivision && (
                                                <div>
                                                    <label className={labelCls}>{t('workerEdit.subdivision')} <span className="text-gray-400 text-xs font-normal">({t('workerEdit.optional')})</span></label>
                                                    <select
                                                        value={form.data.city}
                                                        onChange={(e) => form.setData('city', e.target.value)}
                                                        className={`${inputCls()} appearance-none`}>
                                                        <option value="">{t('workerEdit.selectSubdivision')}</option>
                                                        {availableSubdivisions.map(s => (
                                                            <option key={s.name} value={s.name}>{s.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {/* ── Step 5: Additional Details ───────── */}
                                {step === 5 && (
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
                                                    <div className="space-y-2">
                                                        {(['English', 'French'] as const).map((lang) => {
                                                            const isSelected = selectedLanguages.includes(lang);
                                                            return (
                                                                <button key={lang} type="button"
                                                                    onClick={() => toggleLanguage(lang)}
                                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all
                                                                        ${isSelected ? 'border-amber-400 bg-amber-50 text-amber-700 ring-2 ring-amber-200' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                                                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all
                                                                        ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-gray-300'}`}>
                                                                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                                                    </div>
                                                                    <Languages className="w-4 h-4 text-gray-400" />
                                                                    {lang === 'English' ? t('workerEdit.english') : t('workerEdit.french')}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                    {touched.languages && selectedLanguages.length === 0 && (
                                                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                                            className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" /> {t('workerEdit.languageRequired')}
                                                        </motion.p>
                                                    )}
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

                                {/* ── Step 6: Categories ───────────────── */}
                                {step === 6 && (
                                    <motion.div key="categories" {...fadeSlide} className="p-6 sm:p-8 space-y-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-600">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900">{t('workerEdit.jobCategories')}</h2>
                                                <p className="text-xs text-gray-400">
                                                    {t('workerEdit.additionalCategoriesDesc') || 'Select up to 2 additional categories to complement your primary title'}
                                                    <span className={`ml-2 font-bold ${extraCategories.length >= 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                                                        ({extraCategories.length}/2)
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Show primary category as locked */}
                                        {primaryCatId > 0 && (() => {
                                            const primaryCat = categories.find(c => c.id === primaryCatId);
                                            if (!primaryCat) return null;
                                            const catName = t(`categories.${primaryCat.name}`) !== `categories.${primaryCat.name}` ? t(`categories.${primaryCat.name}`) : primaryCat.name;
                                            return (
                                                <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-blue-400 bg-blue-50 text-blue-800 ring-2 ring-blue-200/60 shadow-sm">
                                                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500 text-white flex-shrink-0">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className="text-sm font-semibold">{catName}</span>
                                                        <span className="block text-[11px] text-blue-500 font-medium">{t('workerEdit.primaryTitle') || 'Primary title'}</span>
                                                    </div>
                                                    <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                                </div>
                                            );
                                        })()}

                                        {fieldError('categories')}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {categories.filter(cat => cat.id !== primaryCatId).map((cat) => {
                                                const isSelected = (form.data.categories as number[]).includes(cat.id);
                                                const isDisabled = !isSelected && extraCategories.length >= 2;
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

                                {/* ── Step 7: Portfolio Photos ──────── */}
                                {step === 7 && (
                                    <motion.div key="portfolio" {...fadeSlide} className="p-6 sm:p-8 space-y-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-purple-600">
                                                    <Camera className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h2 className="text-lg font-bold text-gray-900">{t('workerEdit.portfolio')} <span className="text-sm font-normal text-gray-400">({t('workerEdit.optional')})</span></h2>
                                                    <p className="text-xs text-gray-400">{t('workerEdit.portfolioDesc')}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-bold ${photos.length >= 12 ? 'text-red-500' : 'text-gray-400'}`}>
                                                {photos.length}/12
                                            </span>
                                        </div>

                                        {/* ── Profile Photo (Avatar) ─────── */}
                                        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl border border-gray-100 p-5">
                                            <h3 className="text-sm font-bold text-gray-800 mb-3">{t('workerEdit.profilePhoto')}</h3>
                                            <p className="text-xs text-gray-400 mb-4">{t('workerEdit.profilePhotoDesc')}</p>

                                            <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                                                onChange={handleAvatarUpload} className="hidden" />

                                            <div className="flex items-center gap-5">
                                                {/* Current avatar preview */}
                                                <div className="relative group/avatar flex-shrink-0">
                                                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-200 bg-white shadow-sm">
                                                        {avatar ? (
                                                            <img src={`/storage/${avatar}`} alt="Profile" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                                <User className="w-10 h-10 text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    {uploadingAvatar && (
                                                        <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                                                            <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Upload button + hints */}
                                                <div className="flex-1 space-y-2">
                                                    <button type="button" onClick={() => avatarInputRef.current?.click()}
                                                        disabled={uploadingAvatar}
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all disabled:opacity-50 disabled:cursor-wait">
                                                        <Upload className="w-4 h-4" />
                                                        {avatar ? t('workerEdit.changePhoto') : t('workerEdit.uploadPhoto')}
                                                    </button>
                                                    <p className="text-[11px] text-gray-400">{t('workerEdit.photoRequirements')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ── Divider ─────────────────────── */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-px bg-gray-200" />
                                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('workerEdit.workPhotos')}</span>
                                            <div className="flex-1 h-px bg-gray-200" />
                                        </div>

                                        {/* Upload area */}
                                        <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp"
                                            onChange={handlePhotoUpload} className="hidden" />

                                        {photos.length < 12 && (
                                            <button type="button" onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="w-full flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-gray-200 rounded-2xl hover:border-amber-400 hover:bg-amber-50/30 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-wait group">
                                                {uploading ? (
                                                    <>
                                                        <svg className="animate-spin w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                        </svg>
                                                        <span className="text-sm font-medium text-amber-600">{t('workerEdit.uploadingPhotos')}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-100 group-hover:bg-amber-100 text-gray-400 group-hover:text-amber-500 transition-colors">
                                                            <ImagePlus className="w-7 h-7" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm font-semibold text-gray-600 group-hover:text-amber-700">{t('workerEdit.uploadPhotos')}</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{t('workerEdit.uploadPhotosHint')}</p>
                                                        </div>
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {/* Photo grid */}
                                        {photos.length === 0 && !uploading && (
                                            <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                                                <Camera className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                                <p className="text-sm font-medium text-gray-400">{t('workerEdit.noPhotosYet')}</p>
                                                <p className="text-xs text-gray-300 mt-1">{t('workerEdit.noPhotosHint')}</p>
                                            </div>
                                        )}

                                        {photos.length > 0 && (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {photos.map((photo) => (
                                                    <div key={photo.id} className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 aspect-square">
                                                        <img src={`/storage/${photo.path}`} alt={photo.caption || 'Portfolio photo'}
                                                            className="w-full h-full object-cover" loading="lazy" />

                                                        {/* Overlay on hover */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

                                                        {/* Delete button */}
                                                        <button type="button" onClick={() => handleDeletePhoto(photo.id)}
                                                            className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-red-500/90 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-lg">
                                                            <X className="w-4 h-4" />
                                                        </button>

                                                        {/* Caption area */}
                                                        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                            {editingCaption === photo.id ? (
                                                                <div className="flex items-center gap-1.5">
                                                                    <input type="text" value={captionText}
                                                                        onChange={(e) => setCaptionText(e.target.value)}
                                                                        onKeyDown={(e) => e.key === 'Enter' && saveCaption(photo.id)}
                                                                        placeholder={t('workerEdit.captionPlaceholder')}
                                                                        className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-white/90 border-0 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500" autoFocus />
                                                                    <button type="button" onClick={() => saveCaption(photo.id)}
                                                                        className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-white hover:bg-amber-600">
                                                                        <Check className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button type="button" onClick={() => setEditingCaption(null)}
                                                                        className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-gray-500/80 text-white hover:bg-gray-600">
                                                                        <X className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button type="button" onClick={() => startEditCaption(photo)}
                                                                    className="w-full flex items-center gap-1.5 text-xs text-white/90 hover:text-white transition-colors">
                                                                    <Pencil className="w-3 h-3 flex-shrink-0" />
                                                                    <span className="truncate">{photo.caption || t('workerEdit.addCaption')}</span>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Tip card */}
                                        <div className="flex items-start gap-3 bg-purple-50 rounded-xl p-4 border border-purple-100">
                                            <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                                            <div className="text-sm text-purple-700 leading-relaxed">
                                                <p className="font-semibold mb-0.5">{t('workerEdit.portfolioTipTitle')}</p>
                                                <p className="text-purple-600">{t('workerEdit.portfolioTipDesc')}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ── Navigation bar ────────────────────── */}
                            <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 md:px-8 py-4 sm:py-5 bg-gray-50/80 border-t border-gray-100">
                                <button type="button" onClick={() => goToStep(Math.max(0, step - 1))} disabled={step === 0}
                                    className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all disabled:opacity-30 disabled:pointer-events-none">
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline">{t('workerEdit.back') || 'Back'}</span>
                                </button>

                                <div className="flex items-center gap-1.5 order-last sm:order-none w-full sm:w-auto justify-center">
                                    {STEPS.map((_, i) => (
                                        <button key={i} type="button" onClick={() => goToStep(i)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300
                                                ${i === step ? 'w-6 bg-amber-500' : stepValid[i] ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                                    ))}
                                </div>

                                {step < STEPS.length - 1 ? (
                                    <button type="button" onClick={() => goToStep(step + 1)}
                                        className="inline-flex items-center gap-1.5 px-3 sm:px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-800 text-white hover:bg-slate-900 shadow-sm transition-all">
                                        {t('workerEdit.next') || 'Next'}
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button type="submit" disabled={form.processing || !isFormValid}
                                        className="inline-flex items-center gap-1.5 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md">
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

            {/* ── Validation Error Dialog ──────────────────── */}
            <AnimatePresence>
                {showErrorDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {t('workerEdit.errorDialogTitle')}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {t('workerEdit.errorDialogDesc')}
                                    </p>
                                    <ul className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                                        {errorMessages.map((msg, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-red-600">
                                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                                                {msg}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        {errorStep !== null && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowErrorDialog(false);
                                                    goToStep(errorStep);
                                                }}
                                                className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all text-sm shadow-sm"
                                            >
                                                {t('workerEdit.errorDialogGoToStep')}
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => setShowErrorDialog(false)}
                                            className="inline-flex items-center justify-center text-gray-500 hover:text-gray-700 px-5 py-2.5 rounded-xl font-medium transition-colors text-sm border border-gray-200 hover:bg-gray-50"
                                        >
                                            {t('workerEdit.errorDialogDismiss')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AppLayout>
    );
}
