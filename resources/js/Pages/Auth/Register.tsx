import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [step, setStep] = useState<1 | 2>(1);
    const { t } = useTranslation();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
    const canProceedStep1 = data.name.trim().length > 0 && isValidEmail;

    return (
        <>
            <Head title={t('register.pageTitle')} />

            <div className="flex min-h-screen">
                {/* Left Panel — Branding */}
                <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
                    {/* Decorative elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full -translate-x-1/3 translate-y-1/3" />
                        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-emerald-400/5 rounded-full" />
                        {/* Grid pattern */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }} />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
                        {/* Logo */}
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <Link href="/" className="inline-flex items-center group">
                                <img src="/images/logoNexJobs.png" alt="NexJobs" className="h-20 w-auto" />
                            </Link>
                        </motion.div>

                        {/* Center Content */}
                        <div className="flex-1 flex flex-col justify-center -mt-4">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                                <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
                                    {t('register.leftHeading1')}<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                                        {t('register.leftHeading2')}
                                    </span>
                                </h1>
                                <p className="text-slate-400 text-base xl:text-lg leading-relaxed max-w-md">
                                    {t('register.leftDescription')}
                                </p>
                            </motion.div>

                            {/* Steps indicator */}
                            <div className="mt-10 space-y-4">
                                {[
                                    { num: 1, title: t('register.step1Label'), desc: t('register.step1Desc') },
                                    { num: 2, title: t('register.step2Label'), desc: t('register.step2Desc') },
                                    { num: 3, title: t('register.step3Label'), desc: t('register.step3Desc') },
                                ].map((s, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                                            s.num === 1 ? 'bg-amber-500 text-white' : 'bg-white/10 text-slate-400 border border-white/10'
                                        }`}>
                                            {s.num}
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold text-sm ${s.num === 1 ? 'text-white' : 'text-slate-400'}`}>{s.title}</h3>
                                            <p className="text-slate-500 text-sm mt-0.5">{s.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom stats */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            className="grid grid-cols-3 gap-3"
                        >
                            {[
                                { value: '2,500+', label: t('register.statWorkers') },
                                { value: '850+', label: t('register.statCompanies') },
                                { value: '95%', label: t('register.statSuccess') },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                                    <div className="text-xl font-bold text-white">{stat.value}</div>
                                    <div className="text-xs text-slate-400 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Right Panel — Register Form */}
                <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-10 sm:px-12 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-lg"
                    >
                        {/* Mobile logo */}
                        <div className="lg:hidden mb-8 text-center">
                            <Link href="/" className="inline-flex items-center">
                                <img src="/images/logoNexJobs.png" alt="NexJobs" className="h-16 w-auto" />
                            </Link>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('register.heading')}</h2>
                            <p className="mt-2 text-slate-500">
                                {t('register.haveAccount')}{' '}
                                <Link href={route('login')} className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                                    {t('register.signIn')}
                                </Link>
                            </p>
                        </div>

                        {/* Step indicator (mobile + desktop) */}
                        <div className="flex items-center gap-3 mb-7">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    step === 1
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                }`}
                            >
                                <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                                    step === 1 ? 'bg-amber-500 text-white' : canProceedStep1 ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-white'
                                }`}>
                                    {step > 1 && canProceedStep1 ? '✓' : '1'}
                                </span>
                                {t('register.stepBasics')}
                            </button>
                            <div className="w-8 h-px bg-slate-200" />
                            <button
                                type="button"
                                onClick={() => canProceedStep1 && setStep(2)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    step === 2
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                }`}
                            >
                                <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${
                                    step === 2 ? 'bg-amber-500 text-white' : 'bg-slate-300 text-white'
                                }`}>
                                    2
                                </span>
                                Security
                            </button>
                        </div>

                        <form onSubmit={submit}>
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-5"
                                    >
                                        {/* Full Name */}
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">{t('register.fullName')}</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    value={data.name}
                                                    autoComplete="name"
                                                    autoFocus
                                                    placeholder={t('register.namePlaceholder')}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                                                        errors.name ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                />
                                            </div>
                                            <InputError message={errors.name} className="mt-1.5" />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">{t('register.emailLabel')}</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    value={data.email}
                                                    autoComplete="username"
                                                    placeholder={t('register.emailPlaceholder')}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                                                        errors.email ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                />
                                                {data.email.trim().length > 0 && !isValidEmail && (
                                                    <p className="mt-1.5 text-xs text-red-500">{t('register.emailInvalid')}</p>
                                                )}
                                            </div>
                                            <InputError message={errors.email} className="mt-1.5" />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                {t('register.phoneLabel')} <span className="text-slate-400 font-normal">{t('register.phoneOptional')}</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="phone"
                                                    type="tel"
                                                    value={data.phone}
                                                    autoComplete="tel"
                                                    placeholder={t('register.phonePlaceholder')}
                                                    onChange={(e) => setData('phone', e.target.value.replace(/[^0-9+]/g, ''))}
                                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                                                        errors.phone ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                />
                                            </div>
                                            <InputError message={errors.phone} className="mt-1.5" />
                                        </div>

                                        {/* Continue button */}
                                        <button
                                            type="button"
                                            onClick={() => canProceedStep1 && setStep(2)}
                                            disabled={!canProceedStep1}
                                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none group flex items-center justify-center gap-2"
                                        >
                                            {t('register.continueBtn')}
                                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-5"
                                    >
                                        {/* Summary bar */}
                                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold">
                                                {data.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 truncate">{data.name}</p>
                                                <p className="text-xs text-slate-400 truncate">{data.email}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                                            >
                                                Edit
                                            </button>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                {t('register.passwordLabel')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={data.password}
                                                    autoComplete="new-password"
                                                    autoFocus
                                                    placeholder={t('register.passwordPlaceholder')}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                                                        errors.password ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    {showPassword ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                            {/* Password strength indicator */}
                                            {data.password.length > 0 && (
                                                <div className="mt-2.5">
                                                    <div className="flex gap-1.5">
                                                        {[1, 2, 3, 4].map((level) => {
                                                            const strength = [
                                                                data.password.length >= 8,
                                                                /[A-Z]/.test(data.password),
                                                                /[0-9]/.test(data.password),
                                                                /[^A-Za-z0-9]/.test(data.password),
                                                            ].filter(Boolean).length;
                                                            const colors = ['bg-red-400', 'bg-orange-400', 'bg-amber-400', 'bg-emerald-400'];
                                                            return (
                                                                <div
                                                                    key={level}
                                                                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                                        level <= strength ? colors[strength - 1] : 'bg-slate-200'
                                                                    }`}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-1.5">
                                                        {t('register.passwordHint')}
                                                    </p>
                                                </div>
                                            )}
                                            <InputError message={errors.password} className="mt-1.5" />
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label htmlFor="password_confirmation" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                {t('register.confirmLabel')}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                    </svg>
                                                </div>
                                                <input
                                                    id="password_confirmation"
                                                    type={showConfirm ? 'text' : 'password'}
                                                    value={data.password_confirmation}
                                                    autoComplete="new-password"
                                                    placeholder={t('register.confirmPlaceholder')}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    className={`w-full pl-11 pr-11 py-3 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                                                        errors.password_confirmation ? 'border-red-300 bg-red-50/50'
                                                        : data.password_confirmation.length > 0 && data.password === data.password_confirmation ? 'border-emerald-300 bg-emerald-50/30'
                                                        : 'border-slate-200 hover:border-slate-300'
                                                    }`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirm(!showConfirm)}
                                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                                >
                                                    {showConfirm ? (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                    )}
                                                </button>
                                                {data.password_confirmation.length > 0 && data.password === data.password_confirmation && (
                                                    <div className="absolute inset-y-0 right-10 flex items-center pointer-events-none">
                                                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <InputError message={errors.password_confirmation} className="mt-1.5" />
                                        </div>

                                        {/* Terms notice */}
                                        <p className="text-xs text-slate-400 leading-relaxed">
                                            By creating an account, you agree to NexJobs&apos;s{' '}
                                            <a href="#" className="text-slate-500 hover:text-amber-600 underline transition-colors">Terms of Service</a>
                                            {' '}and{' '}
                                            <a href="#" className="text-slate-500 hover:text-amber-600 underline transition-colors">Privacy Policy</a>.
                                        </p>

                                        {/* Submit + Back */}
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="px-5 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                                </svg>
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex-1 relative py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
                                            >
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {processing ? (
                                                        <>
                                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                            </svg>
                                                            {t('register.creatingAccount')}
                                                        </>
                                                    ) : (
                                                        <>
                                                            Create account
                                                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </>
                                                    )}
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-xs text-slate-400">
                                {t('register.alreadyHaveAccount')}{' '}
                                <Link href={route('login')} className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                                    {t('register.signInHere')}
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
