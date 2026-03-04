import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
    header?: ReactNode;
    children: ReactNode;
}

export default function GuestLayout({ header, children }: Props) {
    const { auth } = usePage().props as any;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
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
                        <p className="text-xs text-slate-500">{t('common.copyright', { year: new Date().getFullYear() })}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
