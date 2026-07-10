import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import DarkModeToggle from '@/Components/DarkModeToggle';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
    header?: ReactNode;
    children: ReactNode;
}

export default function GuestLayout({ header, children }: Props) {
    const { auth, siteVisits, profileIncomplete, unreadNotifications, adminPhone, footerCategories } = usePage().props as any;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showProfileReminder, setShowProfileReminder] = useState(false);
    const [showFloatingNav, setShowFloatingNav] = useState(false);
    const [floatingMenuOpen, setFloatingMenuOpen] = useState(false);
    const reduceMotion = useReducedMotion();
    const { t } = useTranslation();

    useEffect(() => {
        const onScroll = () => setShowFloatingNav(window.scrollY > 280);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!showFloatingNav) setFloatingMenuOpen(false);
    }, [showFloatingNav]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });

    const whatsAppDigits = String(adminPhone ?? '').replace(/\D/g, '');
    const whatsAppLink = whatsAppDigits ? `https://wa.me/${whatsAppDigits}` : null;

    const notificationBell = auth?.user && (
        <Link href="/notifications" className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors" aria-label={t('nav.notifications')} title={t('nav.notifications')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {unreadNotifications > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
            )}
        </Link>
    );

    useEffect(() => {
        if (auth?.user && profileIncomplete) {
            const dismissed = sessionStorage.getItem('profileReminderDismissed');
            if (!dismissed) {
                setShowProfileReminder(true);
            }
        }
    }, [auth?.user, profileIncomplete]);

    const handleProfileReminderOk = () => {
        setShowProfileReminder(false);
        sessionStorage.setItem('profileReminderDismissed', '1');
        router.visit('/worker/profile');
    };

    const handleProfileReminderDismiss = () => {
        setShowProfileReminder(false);
        sessionStorage.setItem('profileReminderDismissed', '1');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col overflow-x-hidden">
            {/* Navigation */}
            <nav className="relative z-40 bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <img src="/images/logoNexJobs.png" alt="NexJobs" className="h-14 w-auto" />
                            </Link>

                            <div className="hidden md:flex items-center ml-10 space-x-8">
                                <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                    {t('nav.feed')}
                                </Link>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/workers" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 pl-3.5 pr-4 py-2 rounded-full text-sm font-bold transition-colors shadow-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                {t('nav.findWorkers')}
                            </Link>
                            {notificationBell}
                            <DarkModeToggle />
                            <LanguageSwitcher variant="light" />
                            {auth?.user ? (
                                <>
                                    {auth.worker_profile_id && (
                                        <Link
                                            href={`/workers/${auth.worker_profile_id}`}
                                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                                        >
                                            {t('nav.myProfile')}
                                        </Link>
                                    )}
                                    {(auth.user.can_add_users || auth.user.role === 'admin') && (
                                        <Link
                                            href="/users/add"
                                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                                        >
                                            {t('nav.addUsers')}
                                        </Link>
                                    )}
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                                    >
                                        {t('nav.logOut')}
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                                    >
                                        {t('nav.logIn')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                                    >
                                        {t('nav.signUp')}
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile menu button + language switcher */}
                        <div className="flex items-center gap-2 md:hidden">
                            <Link href="/workers" aria-label={t('nav.findWorkers')} title={t('nav.findWorkers')} className="p-2 rounded-full bg-amber-500 text-slate-900">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                            </Link>
                            {notificationBell}
                            <DarkModeToggle />
                            <LanguageSwitcher variant="light" />
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-gray-500 hover:text-gray-700 p-2"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="md:hidden border-t border-gray-100 overflow-hidden"
                        >
                            <div className="px-4 py-3 space-y-2">
                                <Link href="/" className="block py-2 text-gray-600 hover:text-blue-600 font-medium">{t('nav.feed')}</Link>
                                <Link href="/workers" className="block py-2 text-gray-600 hover:text-blue-600 font-medium">{t('nav.findWorkers')}</Link>
                                {auth?.user ? (
                                    <>
                                        {auth.worker_profile_id && (
                                            <Link href={`/workers/${auth.worker_profile_id}`} className="block py-2 text-gray-600 hover:text-blue-600 font-medium">{t('nav.myProfile')}</Link>
                                        )}
                                        {(auth.user.can_add_users || auth.user.role === 'admin') && (
                                            <Link href="/users/add" className="block py-2 text-gray-600 hover:text-blue-600 font-medium">{t('nav.addUsers')}</Link>
                                        )}
                                        <Link href="/logout" method="post" as="button" className="block py-2 text-gray-600 hover:text-blue-600 font-medium">{t('nav.logOut')}</Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" className="block py-2 text-gray-600 hover:text-blue-600 font-medium">{t('nav.logIn')}</Link>
                                        <Link href="/register" className="block py-2 bg-slate-800 text-white rounded-lg text-center font-medium">{t('nav.signUp')}</Link>
                                    </>
                                )}

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Floating nav — appears once the page is scrolled past the header zone */}
            <AnimatePresence>
                {showFloatingNav && (
                    <motion.div
                        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -24 }}
                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -24 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed top-3 inset-x-0 z-50 flex justify-center px-3 pointer-events-none"
                    >
                        <div className="pointer-events-auto relative rounded-full p-[2px] floating-nav-ring">
                            <nav
                                aria-label="NexJobs"
                                className="flex items-center gap-0.5 sm:gap-1 pl-2.5 pr-1.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md"
                            >
                                {/* Logo mark only (crops the wordmark out of the combined logo) */}
                                <Link href="/" className="mr-1 block h-8 w-[26px] overflow-hidden" aria-label="NexJobs">
                                    <img src="/images/logoNexJobs.png" alt="" className="h-8 w-auto max-w-none brightness-0 invert" />
                                </Link>
                                <Link
                                    href="/workers"
                                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                                    <span className="hidden sm:inline">{t('nav.findWorkers')}</span>
                                </Link>
                                {auth?.user && (
                                    <Link
                                        href="/notifications"
                                        className="relative p-2 text-slate-300 hover:text-amber-400 transition-colors"
                                        aria-label={t('nav.notifications')}
                                        title={t('nav.notifications')}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                        </svg>
                                        {unreadNotifications > 0 && (
                                            <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                                {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                            </span>
                                        )}
                                    </Link>
                                )}
                                <LanguageSwitcher variant="dark" />
                                <span className="w-px h-5 bg-white/10 mx-0.5" aria-hidden="true" />
                                <button
                                    onClick={scrollToTop}
                                    aria-label={t('nav.backToTop')}
                                    title={t('nav.backToTop')}
                                    className="p-2 text-slate-300 hover:text-amber-400 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setFloatingMenuOpen(!floatingMenuOpen)}
                                    aria-label={t('nav.menu')}
                                    title={t('nav.menu')}
                                    aria-expanded={floatingMenuOpen}
                                    className={`p-2 rounded-full transition-colors ${floatingMenuOpen ? 'text-amber-400 bg-white/5' : 'text-slate-300 hover:text-amber-400'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        {floatingMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </nav>

                            {/* Floating menu dropdown */}
                            <AnimatePresence>
                                {floatingMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-[-1]" onClick={() => setFloatingMenuOpen(false)} aria-hidden="true" />
                                        <motion.div
                                            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
                                            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                                            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.97 }}
                                            transition={{ duration: 0.18, ease: 'easeOut' }}
                                            className="absolute right-0 top-full mt-2 w-56 p-1.5 rounded-2xl bg-slate-900/95 backdrop-blur-md ring-1 ring-white/10 shadow-xl shadow-slate-950/40"
                                        >
                                            <Link href="/" onClick={() => setFloatingMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                                                {t('nav.feed')}
                                            </Link>
                                            <Link href="/workers" onClick={() => setFloatingMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                                                {t('nav.findWorkers')}
                                            </Link>
                                            {auth?.worker_profile_id && (
                                                <Link href={`/workers/${auth.worker_profile_id}`} onClick={() => setFloatingMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                                                    {t('nav.myProfile')}
                                                </Link>
                                            )}
                                            {auth?.user && (auth.user.can_add_users || auth.user.role === 'admin') && (
                                                <Link href="/users/add" onClick={() => setFloatingMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                                                    {t('nav.addUsers')}
                                                </Link>
                                            )}
                                            <div className="my-1.5 h-px bg-white/10" aria-hidden="true" />
                                            {auth?.user ? (
                                                <Link href="/logout" method="post" as="button" className="block w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                                                    {t('nav.logOut')}
                                                </Link>
                                            ) : (
                                                <>
                                                    <Link href="/login" onClick={() => setFloatingMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
                                                        {t('nav.logIn')}
                                                    </Link>
                                                    <Link href="/register" onClick={() => setFloatingMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-bold text-amber-400 hover:text-amber-300 hover:bg-white/5 transition-colors">
                                                        {t('nav.signUp')}
                                                    </Link>
                                                </>
                                            )}
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {header && (
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="flex-1">{children}</main>

            {/* Incomplete Profile Reminder Dialog */}
            <AnimatePresence>
                {showProfileReminder && (
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
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 text-center"
                        >
                            <div className="mx-auto w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-5">
                                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {t('profileReminder.title')}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                {t('profileReminder.message')}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={handleProfileReminderOk}
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 text-sm"
                                >
                                    {t('profileReminder.completeNow')}
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </button>
                                <button
                                    onClick={handleProfileReminderDismiss}
                                    className="inline-flex items-center justify-center text-gray-500 hover:text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors text-sm border border-gray-200 hover:bg-gray-50"
                                >
                                    {t('profileReminder.later')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400">
                {/* Safety-stripe brand accent */}
                <div
                    aria-hidden="true"
                    className="h-1.5 w-full"
                    style={{ background: 'repeating-linear-gradient(-45deg, #f59e0b 0px, #f59e0b 14px, #0f172a 14px, #0f172a 28px)' }}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:grid-cols-12">
                        {/* Brand + contact */}
                        <div className="col-span-2 md:col-span-4 lg:col-span-5">
                            <Link href="/" className="inline-flex items-center">
                                <img src="/images/logoNexJobs.png" alt="NexJobs" className="h-12 w-auto brightness-0 invert" />
                            </Link>
                            <p className="mt-4 text-sm leading-relaxed max-w-sm">
                                {t('footer.tagline')}
                            </p>
                            {whatsAppLink && (
                                <div className="mt-6">
                                    <p className="text-xs text-slate-500 mb-2">{t('footer.whatsappHint')}</p>
                                    <a
                                        href={whatsAppLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:border-amber-500 hover:text-slate-950 text-sm font-semibold transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                        {t('footer.whatsappCta')}
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Quick links */}
                        <div className="lg:col-span-2">
                            <h3 className="text-slate-200 text-xs font-semibold uppercase tracking-widest mb-4">{t('footer.quickLinks')}</h3>
                            <ul className="space-y-2.5 text-sm">
                                <li><Link href="/" className="hover:text-amber-400 transition-colors">{t('nav.feed')}</Link></li>
                                <li><Link href="/workers" className="hover:text-amber-400 transition-colors">{t('footer.browseWorkers')}</Link></li>
                                <li><Link href="/jobs" className="hover:text-amber-400 transition-colors">{t('footer.browseJobs')}</Link></li>
                            </ul>
                        </div>

                        {/* Trade categories (top live categories from the platform) */}
                        {footerCategories?.length > 0 && (
                            <div className="lg:col-span-3">
                                <h3 className="text-slate-200 text-xs font-semibold uppercase tracking-widest mb-4">{t('footer.tradeCategories')}</h3>
                                <ul className="space-y-2.5 text-sm">
                                    {footerCategories.map((category: { id: number; name: string }) => (
                                        <li key={category.id}>
                                            <Link href={`/workers?category=${category.id}`} className="hover:text-amber-400 transition-colors">
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Get started */}
                        <div className="lg:col-span-2">
                            <h3 className="text-slate-200 text-xs font-semibold uppercase tracking-widest mb-4">{t('footer.getStarted')}</h3>
                            <ul className="space-y-2.5 text-sm">
                                <li><Link href="/" className="hover:text-amber-400 transition-colors">{t('footer.postWork')}</Link></li>
                                {auth?.user ? (
                                    <>
                                        {auth.worker_profile_id && (
                                            <li><Link href={`/workers/${auth.worker_profile_id}`} className="hover:text-amber-400 transition-colors">{t('nav.myProfile')}</Link></li>
                                        )}
                                        <li><Link href="/notifications" className="hover:text-amber-400 transition-colors">{t('nav.notifications')}</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link href="/register" className="hover:text-amber-400 transition-colors">{t('footer.createProfile')}</Link></li>
                                        <li><Link href="/login" className="hover:text-amber-400 transition-colors">{t('nav.logIn')}</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-slate-800/70">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                        <p className="text-xs text-slate-500">{t('common.copyright', { year: new Date().getFullYear() })}</p>
                        <p className="text-xs text-slate-600">{t('footer.madeIn')}</p>
                        <p className="text-xs text-slate-500">{t('footer.siteVisits', { count: siteVisits?.toLocaleString() ?? '0' })}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
