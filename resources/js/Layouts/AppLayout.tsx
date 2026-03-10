import { Link, usePage, router } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
    header?: ReactNode;
    children: ReactNode;
}

export default function GuestLayout({ header, children }: Props) {
    const { auth, siteVisits, profileIncomplete } = usePage().props as any;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showProfileReminder, setShowProfileReminder] = useState(false);
    const { t } = useTranslation();

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
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <img src="/images/logoNexJobs.png" alt="NexJobs" className="h-14 w-auto" />
                            </Link>

                            <div className="hidden md:flex items-center ml-10 space-x-8">
                                <Link href="/workers" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                    {t('nav.findWorkers')}
                                </Link>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            <LanguageSwitcher variant="light" />
                            {auth?.user ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                                    >
                                        {t('nav.dashboard')}
                                    </Link>
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
                                <Link href="/workers" className="block py-2 text-gray-600 hover:text-blue-600 font-medium">{t('nav.findWorkers')}</Link>
                                {auth?.user ? (
                                    <>
                                        <Link href="/dashboard" className="block py-2 text-gray-600 hover:text-blue-600 font-medium">{t('nav.dashboard')}</Link>
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
            <footer className="bg-slate-900 text-slate-400">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <Link href="/" className="flex items-center">
                            <img src="/images/logoNexJobs.png" alt="NexJobs" className="h-8 w-auto brightness-0 invert" />
                        </Link>
                        <div className="flex items-center gap-6 text-sm">
                            <Link href="/workers" className="hover:text-white transition-colors">{t('footer.browseWorkers')}</Link>
                            <Link href="/register" className="hover:text-white transition-colors">{t('footer.createProfile')}</Link>
                        </div>
                        <p className="text-xs text-slate-500">{t('footer.siteVisits', { count: siteVisits?.toLocaleString() ?? '0' })}</p>
                        <p className="text-xs text-slate-500">{t('common.copyright', { year: new Date().getFullYear() })}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
