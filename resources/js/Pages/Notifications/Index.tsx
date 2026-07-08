import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { PaginatedData } from '@/types';

interface Notification {
    id: number;
    created_at: string;
    work_post: {
        id: number;
        description: string;
        city?: string | null;
        state?: string | null;
        technicians_needed?: number | null;
        budget?: string | null;
        status: 'open' | 'filled' | 'closed';
        user: { id: number; name: string; avatar?: string | null };
        category?: { id: number; name: string } | null;
    } | null;
}

interface Props {
    notifications: PaginatedData<Notification>;
    unreadIds: number[];
}

export default function NotificationsIndex({ notifications, unreadIds }: Props) {
    const { t } = useTranslation();

    function timeAgo(dateStr: string) {
        const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
        if (days === 0) return t('common.today');
        if (days === 1) return t('common.yesterday');
        if (days < 7) return t('common.daysAgo', { n: days });
        if (days < 30) return t('common.weeksAgo', { n: Math.floor(days / 7) });
        return new Date(dateStr).toLocaleDateString();
    }

    const translateCategory = (name: string) =>
        t(`categories.${name}`) !== `categories.${name}` ? t(`categories.${name}`) : name;

    return (
        <AppLayout>
            <Head title={t('notifications.pageTitle')} />

            <div className="min-h-screen bg-gray-50 py-8 md:py-12">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">{t('notifications.heading')}</h1>

                    {notifications.data.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-4">
                                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900">{t('notifications.empty')}</h3>
                            <p className="text-sm text-gray-500 mt-1">{t('notifications.emptyHint')}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.data.map((notification) => {
                                const post = notification.work_post;
                                if (!post) return null;
                                const isNew = unreadIds.includes(notification.id);

                                return (
                                    <motion.div key={notification.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                                        <Link
                                            href="/feed"
                                            className={`block bg-white rounded-2xl border p-4 shadow-sm hover:shadow transition-shadow ${isNew ? 'border-blue-200 bg-blue-50/40' : 'border-gray-100'}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                    {post.user.avatar ? (
                                                        <img src={`/storage/${post.user.avatar}`} alt="" className="w-full h-full object-cover" loading="lazy" />
                                                    ) : (
                                                        <span className="text-white font-bold text-sm">{post.user.name?.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="text-sm text-gray-800">
                                                            <span className="font-bold">{t('notifications.postedNew', { name: post.user.name })}</span>
                                                        </p>
                                                        {isNew && (
                                                            <span className="flex-shrink-0 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                                                                {t('notifications.new')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.description}</p>
                                                    <div className="flex flex-wrap items-center gap-2 mt-2">
                                                        {post.category && (
                                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[11px] font-semibold">
                                                                {translateCategory(post.category.name)}
                                                            </span>
                                                        )}
                                                        {(post.city || post.state) && (
                                                            <span className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-[11px] font-medium">
                                                                {[post.city, post.state].filter(Boolean).join(', ')}
                                                            </span>
                                                        )}
                                                        {post.budget && (
                                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold">
                                                                {post.budget}
                                                            </span>
                                                        )}
                                                        <span className="text-[11px] text-gray-400 ml-auto">{timeAgo(notification.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {notifications.last_page > 1 && (
                        <div className="flex flex-wrap justify-center gap-1.5 mt-8">
                            {notifications.links.map((link, i) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span key={i} className="px-3.5 py-2 rounded-lg text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: link.label }} />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
