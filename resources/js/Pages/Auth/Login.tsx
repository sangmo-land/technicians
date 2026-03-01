import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/hooks/useTranslation';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const features = [
        { icon: '🏗️', title: t('login.feature1Title'), desc: t('login.feature1Desc') },
        { icon: '📋', title: t('login.feature2Title'), desc: t('login.feature2Desc') },
        { icon: '⭐', title: t('login.feature3Title'), desc: t('login.feature3Desc') },
    ];

    return (
        <>
            <Head title={t('login.pageTitle')} />

            <div className="flex min-h-screen">
                {/* Left Panel — Branding */}
                <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
                    {/* Decorative elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full translate-x-1/3 translate-y-1/3" />
                        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
                        {/* Grid pattern */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                            backgroundSize: '60px 60px'
                        }} />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
                        {/* Logo */}
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <Link href="/" className="inline-flex items-center gap-3 group">
                                <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="text-2xl font-bold text-white tracking-tight">
                                    Civil<span className="text-amber-400">Hire</span>
                                </span>
                            </Link>
                        </motion.div>

                        {/* Center Content */}
                        <div className="flex-1 flex flex-col justify-center -mt-8">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
                                <h1 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
                                    {t('login.welcomeBack')}<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                                        {t('login.futureOfHiring')}
                                    </span>
                                </h1>
                                <p className="text-slate-400 text-base xl:text-lg leading-relaxed max-w-md">
                                    {t('login.leftDescription')}
                                </p>
                            </motion.div>

                            <div className="mt-10 space-y-5">
                                {features.map((f, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.4 + i * 0.15 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                                            {f.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold text-sm">{f.title}</h3>
                                            <p className="text-slate-400 text-sm mt-0.5">{f.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom testimonial */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
                        >
                            <div className="flex items-center gap-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-slate-300 text-sm italic leading-relaxed">
                                &ldquo;{t('login.testimonial')}&rdquo;
                            </p>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">ET</div>
                                <div>
                                    <p className="text-white text-sm font-medium">{t('login.testimonialName')}</p>
                                    <p className="text-slate-500 text-xs">{t('login.testimonialRole')}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Panel — Login Form */}
                <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12 sm:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full max-w-md"
                    >
                        {/* Mobile logo */}
                        <div className="lg:hidden mb-8 text-center">
                            <Link href="/" className="inline-flex items-center gap-2.5">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-slate-800 tracking-tight">
                                    Civil<span className="text-amber-500">Hire</span>
                                </span>
                            </Link>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{t('login.heading')}</h2>
                            <p className="mt-2 text-slate-500">
                                {t('login.noAccount')}{' '}
                                <Link href={route('register')} className="text-amber-600 hover:text-amber-700 font-semibold transition-colors">
                                    {t('login.createOneFree')}
                                </Link>
                            </p>
                        </div>

                        {status && (
                            <div className="mb-6 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                    {t('login.emailLabel')}
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        autoComplete="username"
                                        autoFocus
                                        placeholder={t('login.emailPlaceholder')}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 ${
                                            errors.email ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1.5" />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                        {t('login.passwordLabel')}
                                    </label>
                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                                        >
                                            {t('login.forgotPassword')}
                                        </Link>
                                    )}
                                </div>
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
                                        autoComplete="current-password"
                                        placeholder={t('login.passwordPlaceholder')}
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
                                <InputError message={errors.password} className="mt-1.5" />
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked as false)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center group-hover:border-slate-400 peer-checked:group-hover:border-amber-600">
                                            <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-sm text-slate-600 select-none">{t('login.rememberMe')}</span>
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="relative w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {processing ? (
                                        <>
                                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            {t('login.signingIn')}
                                        </>
                                    ) : (
                                        <>
                                            {t('login.signIn')}
                                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-gray-50 px-4 text-slate-400 uppercase tracking-wider font-medium">{t('login.trustedByPros')}</span>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-2 gap-4 text-center">
                            {[
                                { value: '2,500+', label: t('login.statWorkers') },
                                { value: '12K+', label: t('login.statHires') },
                            ].map((stat, i) => (
                                <div key={i} className="py-3 px-2 rounded-xl bg-white border border-slate-100">
                                    <div className="text-lg font-bold text-slate-800">{stat.value}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <p className="mt-8 text-center text-xs text-slate-400">
                            By signing in, you agree to our{' '}
                            <a href="#" className="text-slate-500 hover:text-amber-600 underline transition-colors">Terms</a>
                            {' '}and{' '}
                            <a href="#" className="text-slate-500 hover:text-amber-600 underline transition-colors">Privacy Policy</a>
                        </p>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
