import { Head, useForm, usePage, router } from '@inertiajs/react';
import { FormEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import InputError from '@/Components/InputError';
import { UserPlus, Users, CheckCircle, Mail, Lock, Phone, Briefcase, MapPin, Clock, Banknote, Languages, ChevronDown, Camera, Upload, ImagePlus, X, User, SwitchCamera } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cameroonRegions } from '@/data/cameroonLocations';
import { compressImage } from '@/utils/compressImage';

interface AddedUser {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

interface Category {
    id: number;
    name: string;
}

interface Props {
    addedUsers: AddedUser[];
    categories: Category[];
}

export default function AddUser({ addedUsers, categories }: Props) {
    const { flash } = usePage().props as any;
    const { t } = useTranslation();
    const [showCredentials, setShowCredentials] = useState(true);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [portfolioPreviews, setPortfolioPreviews] = useState<string[]>([]);
    const [cameraOpen, setCameraOpen] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const portfolioInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        category_id: '',
        daily_rate: '',
        experience_level: 'entry',
        years_experience: '0',
        state: '',
        languages: [] as string[],
        avatar: null as File | null,
        portfolio_photos: [] as File[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('users.add.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setAvatarPreview(null);
                setPortfolioPreviews([]);
                setShowCredentials(true);
                if (avatarInputRef.current) avatarInputRef.current.value = '';
                if (portfolioInputRef.current) portfolioInputRef.current.value = '';
            },
        });
    };

    const toggleLanguage = (lang: string) => {
        setData('languages', data.languages.includes(lang)
            ? data.languages.filter(l => l !== lang)
            : [...data.languages, lang]
        );
    };

    const handleAvatarFile = async (file: File | undefined) => {
        if (!file) return;
        const compressed = await compressImage(file, 800, 800, 0.85);
        setData('avatar', compressed);
        const reader = new FileReader();
        reader.onload = (e) => setAvatarPreview(e.target?.result as string);
        reader.readAsDataURL(compressed);
    };

    const removeAvatar = () => {
        setData('avatar', null);
        setAvatarPreview(null);
        if (avatarInputRef.current) avatarInputRef.current.value = '';
    };

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCameraOpen(false);
        setCameraError(null);
    }, []);

    const startStream = useCallback(async (facing: 'user' | 'environment') => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facing, width: { ideal: 640 }, height: { ideal: 640 } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play().catch(() => {});
                };
            }
            return true;
        } catch {
            return false;
        }
    }, []);

    const openCamera = async () => {
        setCameraError(null);
        const ok = await startStream(facingMode);
        if (ok) {
            setCameraOpen(true);
        } else {
            setCameraError(t('addUser.cameraError'));
            setCameraOpen(true);
        }
    };

    const switchCamera = async () => {
        const newMode = facingMode === 'user' ? 'environment' : 'user';
        setFacingMode(newMode);
        await startStream(newMode);
    };

    // Callback ref — attaches the stream to the video element as soon as it mounts
    const onVideoRef = useCallback((node: HTMLVideoElement | null) => {
        videoRef.current = node;
        if (node && streamRef.current) {
            node.srcObject = streamRef.current;
            node.onloadedmetadata = () => {
                node.play().catch(() => {});
            };
        }
    }, []);

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;
        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

        canvas.toBlob((blob) => {
            if (!blob) return;
            const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
            setData('avatar', file);
            setAvatarPreview(canvas.toDataURL('image/jpeg', 0.9));
            stopCamera();
        }, 'image/jpeg', 0.9);
    };

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handlePortfolioFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const rawFiles = Array.from(files);
        const compressed = await Promise.all(
            rawFiles.map((f) => compressImage(f, 1200, 1200, 0.8))
        );
        const combined = [...data.portfolio_photos, ...compressed].slice(0, 10);
        setData('portfolio_photos', combined);

        compressed.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPortfolioPreviews((prev) => [...prev, e.target?.result as string].slice(0, 10));
            };
            reader.readAsDataURL(file);
        });
    };

    const removePortfolioPhoto = (index: number) => {
        setData('portfolio_photos', data.portfolio_photos.filter((_, i) => i !== index));
        setPortfolioPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const previewEmail = data.name.trim()
        ? `${data.name.trim().toLowerCase().replace(/\s+/g, '.')}@mail.com`
        : '';
    const previewPassword = data.name.trim()
        ? data.name.trim().toLowerCase()
        : '';

    const canSubmit = data.name.trim() && data.category_id && data.daily_rate && data.state && data.languages.length > 0;

    return (
        <AppLayout>
            <Head title={t('addUser.pageTitle')} />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <UserPlus className="w-6 h-6 text-amber-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{t('addUser.heading')}</h1>
                    </div>
                    <p className="text-gray-500 ml-14">
                        {t('addUser.description')}
                    </p>
                </motion.div>

                {/* Success Dialog */}
                <AnimatePresence>
                    {flash?.success && showCredentials && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                            >
                                <div className="p-6 text-center">
                                    <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{t('addUser.successTitle')}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{t('addUser.successNote')}</p>

                                    <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <span className="text-gray-500">{t('addUser.email')}:</span>
                                            <code className="bg-white px-2 py-0.5 rounded border text-gray-900 font-mono text-xs ml-auto">
                                                {flash.success.match(/Email: (.+?) \|/)?.[1] ?? ''}
                                            </code>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                            <span className="text-gray-500">{t('addUser.password')}:</span>
                                            <code className="bg-white px-2 py-0.5 rounded border text-gray-900 font-mono text-xs ml-auto">
                                                {flash.success.match(/Password: (.+)$/)?.[1] ?? ''}
                                            </code>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowCredentials(false)}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            {t('addUser.addAnother')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.visit('/workers')}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Users className="w-4 h-4" />
                                            {t('addUser.goToWorkers')}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('addUser.userDetails')}</h2>

                            <form onSubmit={submit} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {t('addUser.fullName')} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                            placeholder={t('addUser.namePlaceholder')}
                                        />
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {t('addUser.phoneNumber')}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                            placeholder={t('addUser.phonePlaceholder')}
                                        />
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    </div>
                                    <InputError message={errors.phone} className="mt-1" />
                                </div>

                                {/* Divider - Profile Section */}
                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('addUser.profileSection')}</span>
                                    </div>
                                </div>

                                {/* Job Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {t('addUser.jobCategory')} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.category_id}
                                            onChange={(e) => setData('category_id', e.target.value)}
                                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors appearance-none bg-white"
                                        >
                                            <option value="">{t('addUser.selectCategory')}</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <InputError message={errors.category_id} className="mt-1" />
                                </div>

                                {/* Daily Rate */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {t('addUser.dailyRate')} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.daily_rate}
                                            onChange={(e) => setData('daily_rate', e.target.value)}
                                            className="w-full pl-10 pr-20 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                            placeholder="5000"
                                        />
                                        <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">FCFA / {t('addUser.day')}</span>
                                    </div>
                                    <InputError message={errors.daily_rate} className="mt-1" />
                                </div>

                                {/* Experience Level + Years */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            {t('addUser.experienceLevel')} <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={data.experience_level}
                                                onChange={(e) => setData('experience_level', e.target.value)}
                                                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors appearance-none bg-white"
                                            >
                                                <option value="entry">{t('addUser.levelEntry')}</option>
                                                <option value="intermediate">{t('addUser.levelIntermediate')}</option>
                                                <option value="experienced">{t('addUser.levelExperienced')}</option>
                                                <option value="expert">{t('addUser.levelExpert')}</option>
                                            </select>
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        <InputError message={errors.experience_level} className="mt-1" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            {t('addUser.yearsExperience')} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            value={data.years_experience}
                                            onChange={(e) => setData('years_experience', e.target.value)}
                                            className="w-full py-2.5 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                            placeholder="0"
                                        />
                                        <InputError message={errors.years_experience} className="mt-1" />
                                    </div>
                                </div>

                                {/* Region / State */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {t('addUser.region')} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={data.state}
                                            onChange={(e) => setData('state', e.target.value)}
                                            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors appearance-none bg-white"
                                        >
                                            <option value="">{t('addUser.selectRegion')}</option>
                                            {cameroonRegions.map((r) => (
                                                <option key={r.name} value={r.name}>{r.name}</option>
                                            ))}
                                        </select>
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                    <InputError message={errors.state} className="mt-1" />
                                </div>

                                {/* Languages */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {t('addUser.languages')} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex gap-4">
                                        {['English', 'French'].map((lang) => (
                                            <label key={lang} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.languages.includes(lang)}
                                                    onChange={() => toggleLanguage(lang)}
                                                    className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                                                />
                                                <span className="text-sm text-gray-700">{lang === 'English' ? t('addUser.english') : t('addUser.french')}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.languages} className="mt-1" />
                                </div>

                                {/* Divider - Photos Section */}
                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                                    <div className="relative flex justify-center">
                                        <span className="bg-white px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{t('addUser.photosSection')}</span>
                                    </div>
                                </div>

                                {/* Profile Photo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('addUser.profilePhoto')} <span className="text-gray-400 text-xs font-normal">({t('addUser.optional')})</span>
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50">
                                                {avatarPreview ? (
                                                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                        <User className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            {avatarPreview && (
                                                <button
                                                    type="button"
                                                    onClick={removeAvatar}
                                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                type="button"
                                                onClick={() => avatarInputRef.current?.click()}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
                                            >
                                                <Upload className="w-4 h-4" />
                                                {t('addUser.uploadPhoto')}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={openCamera}
                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all"
                                            >
                                                <Camera className="w-4 h-4" />
                                                {t('addUser.takePhoto')}
                                            </button>
                                        </div>
                                        <input
                                            ref={avatarInputRef}
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            className="hidden"
                                            onChange={(e) => handleAvatarFile(e.target.files?.[0])}
                                        />
                                        <canvas ref={canvasRef} className="hidden" />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1.5">{t('addUser.photoHint')}</p>
                                    <InputError message={errors.avatar} className="mt-1" />

                                    {/* Camera Modal */}
                                    <AnimatePresence>
                                        {cameraOpen && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
                                                onClick={stopCamera}
                                            >
                                                <motion.div
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.9, opacity: 0 }}
                                                    className="bg-white rounded-2xl overflow-hidden shadow-2xl max-w-sm w-full"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                                        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                            <Camera className="w-4 h-4 text-amber-500" />
                                                            {t('addUser.takePhoto')}
                                                        </h3>
                                                        <button type="button" onClick={stopCamera} className="text-gray-400 hover:text-gray-600">
                                                            <X className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    <div className="relative bg-black aspect-square">
                                                        {cameraError ? (
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3 p-6">
                                                                <Camera className="w-10 h-10 text-gray-400" />
                                                                <p className="text-sm text-center text-gray-300">{cameraError}</p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <video
                                                                    ref={onVideoRef}
                                                                    autoPlay
                                                                    playsInline
                                                                    muted
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={switchCamera}
                                                                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
                                                                    title={t('addUser.switchCamera')}
                                                                >
                                                                    <SwitchCamera className="w-5 h-5" />
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="p-4 flex justify-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={stopCamera}
                                                            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                                        >
                                                            {t('addUser.cameraCancel')}
                                                        </button>
                                                        {!cameraError && (
                                                            <button
                                                                type="button"
                                                                onClick={capturePhoto}
                                                                className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center gap-2 shadow-sm"
                                                            >
                                                                <Camera className="w-4 h-4" />
                                                                {t('addUser.cameraCapture')}
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Portfolio Photos (Optional) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {t('addUser.portfolioPhotos')} <span className="text-gray-400 text-xs font-normal">({t('addUser.optional')})</span>
                                    </label>
                                    <p className="text-xs text-gray-400 mb-3">{t('addUser.portfolioHint')}</p>

                                    {/* Portfolio Preview Grid */}
                                    {portfolioPreviews.length > 0 && (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                                            {portfolioPreviews.map((preview, index) => (
                                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                                    <img src={preview} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removePortfolioPhoto(index)}
                                                        className="absolute top-1 right-1 w-5 h-5 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Upload Zone */}
                                    {data.portfolio_photos.length < 10 && (
                                        <button
                                            type="button"
                                            onClick={() => portfolioInputRef.current?.click()}
                                            className="w-full flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-amber-400 hover:bg-amber-50/30 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-amber-100 text-gray-400 group-hover:text-amber-500 transition-colors">
                                                <ImagePlus className="w-5 h-5" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-gray-600 group-hover:text-amber-700">{t('addUser.addPortfolioPhotos')}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">{t('addUser.portfolioMax')}</p>
                                            </div>
                                        </button>
                                    )}

                                    <input
                                        ref={portfolioInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => handlePortfolioFiles(e.target.files)}
                                    />
                                    <InputError message={errors.portfolio_photos} className="mt-1" />
                                </div>

                                {/* Auto-generated credentials preview */}
                                {data.name.trim() && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                                    >
                                        <p className="text-sm font-medium text-blue-800 mb-2">{t('addUser.credentialsPreview')}</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4 text-blue-500" />
                                                <span className="text-blue-700">{t('addUser.email')}:</span>
                                                <code className="bg-blue-100 px-2 py-0.5 rounded text-blue-900 font-mono text-xs">
                                                    {previewEmail}
                                                </code>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Lock className="w-4 h-4 text-blue-500" />
                                                <span className="text-blue-700">{t('addUser.password')}:</span>
                                                <code className="bg-blue-100 px-2 py-0.5 rounded text-blue-900 font-mono text-xs">
                                                    {previewPassword}
                                                </code>
                                            </div>
                                        </div>
                                        <p className="text-xs text-blue-500 mt-2">
                                            {t('addUser.credentialsNote')}
                                        </p>
                                    </motion.div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={processing || !canSubmit}
                                    className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <UserPlus className="w-4 h-4" />
                                    )}
                                    {processing ? t('addUser.creating') : t('addUser.addUserBtn')}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Users Added List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Users className="w-5 h-5 text-gray-400" />
                                <h2 className="text-lg font-semibold text-gray-900">{t('addUser.usersYouAdded')}</h2>
                            </div>

                            {addedUsers.length === 0 ? (
                                <div className="text-center py-8">
                                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">{t('addUser.noUsersYet')}</p>
                                    <p className="text-gray-400 text-xs mt-1">{t('addUser.noUsersDesc')}</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {addedUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <span className="text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 bg-blue-100 text-blue-700">
                                                Worker
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400">
                                    {t('addUser.totalUsers', { count: addedUsers.length })}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AppLayout>
    );
}
