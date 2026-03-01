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
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold text-slate-800">Civil<span className="text-blue-600">Hire</span></span>
                            </Link>

                            <div className="hidden md:flex items-center ml-10 space-x-8">
                                <Link href="/jobs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                                    {t('nav.findJobs')}
                                </Link>
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

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden">
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
                                <Link href="/jobs" className="block py-2 text-gray-600 hover:text-blue-600 font-medium">{t('nav.findJobs')}</Link>
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
                                <div className="pt-2 border-t border-gray-100"><LanguageSwitcher variant="light" /></div>
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

            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <Link href="/" className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <span className="text-lg font-bold text-white">Civil<span className="text-blue-400">Hire</span></span>
                            </Link>
                            <p className="text-sm">{t('footer.tagline')}</p>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">{t('footer.forWorkers')}</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/jobs" className="hover:text-blue-400 transition-colors">{t('footer.browseJobs')}</Link></li>
                                <li><Link href="/register" className="hover:text-blue-400 transition-colors">{t('footer.createProfile')}</Link></li>
                                <li><Link href="/my-applications" className="hover:text-blue-400 transition-colors">{t('footer.myApplications')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">{t('footer.forEmployers')}</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/register" className="hover:text-blue-400 transition-colors">{t('footer.postJob')}</Link></li>
                                <li><Link href="/workers" className="hover:text-blue-400 transition-colors">{t('footer.browseWorkers')}</Link></li>
                                <li><Link href="/employer/dashboard" className="hover:text-blue-400 transition-colors">{t('footer.employerDashboard')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-semibold mb-4">{t('footer.jobCategories')}</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/jobs?category=1" className="hover:text-blue-400 transition-colors">{t('footer.formworkMaker')}</Link></li>
                                <li><Link href="/jobs?category=2" className="hover:text-blue-400 transition-colors">{t('footer.ironBender')}</Link></li>
                                <li><Link href="/jobs?category=3" className="hover:text-blue-400 transition-colors">{t('footer.mason')}</Link></li>
                                <li><Link href="/jobs?category=4" className="hover:text-blue-400 transition-colors">{t('footer.concreteWorker')}</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-10 pt-6 text-center text-sm">
                        <p>{t('common.copyright', { year: new Date().getFullYear() })}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
