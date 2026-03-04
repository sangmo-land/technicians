import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { useTranslation } from '@/hooks/useTranslation';
import {
    User, Search, Settings, Eye, Briefcase, Camera, Tag,
    ChevronRight, CheckCircle, AlertCircle, Clock, MapPin,
    Star, TrendingUp, Shield, Edit3, ArrowRight,
} from 'lucide-react';

interface Props {
    profile: any;
    stats: { profileViews: number; portfolioPhotos: number; workExperiences: number; categories: number };
}

export default function Dashboard({ profile, stats }: Props) {
    const { t } = useTranslation();
    const { auth } = usePage().props as any;
    const user = auth.user;

    /* Profile completeness */
    const checks = [
        { label: t('dashboard.checkBio'), done: !!profile?.bio },
        { label: t('dashboard.checkPhone'), done: !!user?.phone },
        { label: t('dashboard.checkPhoto'), done: !!user?.avatar },
        { label: t('dashboard.checkLocation'), done: !!profile?.state },
        { label: t('dashboard.checkCategory'), done: stats.categories > 0 },
        { label: t('dashboard.checkExperience'), done: !!profile?.experience_level },
        { label: t('dashboard.checkRate'), done: !!profile?.daily_rate && Number(profile.daily_rate) > 0 },
        { label: t('dashboard.checkPortfolio'), done: stats.portfolioPhotos > 0 },
    ];
    const completedCount = checks.filter(c => c.done).length;
    const completionPct = Math.round((completedCount / checks.length) * 100);

    const availabilityConfig: Record<string, { dot: string; label: string; bg: string }> = {
        available: { dot: 'bg-emerald-500', label: t('availability.available'), bg: 'bg-emerald-50 text-emerald-700' },
        busy: { dot: 'bg-amber-500', label: t('availability.busy'), bg: 'bg-amber-50 text-amber-700' },
        not_available: { dot: 'bg-gray-400', label: t('availability.unavailable'), bg: 'bg-gray-100 text-gray-600' },
    };
    const avail = availabilityConfig[profile?.availability || 'not_available'] || availabilityConfig.not_available;

    const quickLinks = [
        { href: '/worker/profile', icon: Edit3, label: t('dashboard.editProfile'), desc: t('dashboard.editProfileDesc'), color: 'amber' },
        { href: '/workers', icon: Search, label: t('dashboard.browseWorkers'), desc: t('dashboard.browseWorkersDesc'), color: 'blue' },
        { href: '/profile', icon: Settings, label: t('dashboard.accountSettings'), desc: t('dashboard.accountSettingsDesc'), color: 'slate' },
    ];

    const colorMap: Record<string, string> = {
        amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
        slate: 'bg-slate-100 text-slate-600 group-hover:bg-slate-200',
    };

    return (
        <AppLayout>
            <Head title={t('dashboard.title')} />

            {/* Hero banner */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        {/* Avatar */}
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                            {user.avatar ? (
                                <img src={`/storage/${user.avatar}`} alt={user.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/10 shadow-xl" />
                            ) : (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center ring-4 ring-white/10 shadow-xl">
                                    <span className="text-2xl sm:text-3xl font-bold text-white">{user.name?.charAt(0)?.toUpperCase()}</span>
                                </div>
                            )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('dashboard.welcome', { name: user.name })}</h1>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${avail.bg}`}>
                                    <span className={`w-2 h-2 rounded-full ${avail.dot} ${profile?.availability === 'available' ? 'animate-pulse' : ''}`} />
                                    {avail.label}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm sm:text-base">
                                {profile?.title || t('dashboard.completeProfile')}
                                {profile?.state && <span className="inline-flex items-center gap-1 ml-3 text-gray-500"><MapPin className="w-3.5 h-3.5" />{profile.state}</span>}
                            </p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <Link href="/worker/profile"
                                className="hidden sm:inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5">
                                <Edit3 className="w-4 h-4" />
                                {t('dashboard.editProfile')}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { icon: Eye, value: stats.profileViews, label: t('dashboard.statViews'), color: 'text-blue-600 bg-blue-50' },
                        { icon: Camera, value: stats.portfolioPhotos, label: t('dashboard.statPhotos'), color: 'text-purple-600 bg-purple-50' },
                        { icon: Briefcase, value: stats.workExperiences, label: t('dashboard.statExperience'), color: 'text-emerald-600 bg-emerald-50' },
                        { icon: Tag, value: stats.categories, label: t('dashboard.statCategories'), color: 'text-amber-600 bg-amber-50' },
                    ].map((stat, i) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-xs text-gray-500">{stat.label}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left column — Profile completion (order-2 on mobile, order-1 on lg) */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        className="lg:col-span-2 order-2 lg:order-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5 sm:p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-amber-500" />
                                    {t('dashboard.profileStrength')}
                                </h2>
                                <span className={`text-sm font-bold ${completionPct === 100 ? 'text-emerald-600' : completionPct >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                                    {completionPct}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPct}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${completionPct === 100 ? 'bg-emerald-500' : completionPct >= 60 ? 'bg-amber-500' : 'bg-red-400'}`}
                                />
                            </div>
                            {completionPct < 100 && (
                                <p className="text-xs text-gray-400 mt-2">{t('dashboard.completeProfileHint')}</p>
                            )}
                        </div>
                        <div className="divide-y divide-gray-50">
                            {checks.map((check, i) => (
                                <div key={i} className={`flex items-center gap-3 px-5 sm:px-6 py-3 ${check.done ? '' : 'bg-amber-50/30'}`}>
                                    {check.done ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                                    )}
                                    <span className={`text-sm ${check.done ? 'text-gray-500 line-through' : 'text-gray-700 font-medium'}`}>
                                        {check.label}
                                    </span>
                                    {!check.done && (
                                        <Link href="/worker/profile" className="ml-auto text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-0.5">
                                            {t('dashboard.fix')} <ChevronRight className="w-3 h-3" />
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right column — Quick actions (order-1 on mobile, order-2 on lg) */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="order-1 lg:order-2 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-gray-400" />
                            {t('dashboard.quickActions')}
                        </h2>
                        {quickLinks.map((link, i) => (
                            <motion.div key={link.href} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05 }}>
                                <Link href={link.href}
                                    className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all group">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${colorMap[link.color]}`}>
                                        <link.icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 text-sm">{link.label}</h3>
                                        <p className="text-xs text-gray-500 truncate">{link.desc}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                                </Link>
                            </motion.div>
                        ))}

                        {/* Tip card */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-5">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                                    <Star className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-amber-900 mb-1">{t('dashboard.tipTitle')}</h4>
                                    <p className="text-xs text-amber-700 leading-relaxed">{t('dashboard.tipDesc')}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

            </div>
        </AppLayout>
    );
}
