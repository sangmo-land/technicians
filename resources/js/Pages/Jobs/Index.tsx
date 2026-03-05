import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { JobCategory, JobListing, PaginatedData } from '@/types';
import { getCategoryColor } from '@/utils/categoryColors';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
    jobs: PaginatedData<JobListing>;
    categories: JobCategory[];
    filters: {
        search?: string;
        category?: string;
        location?: string;
        type?: string;
        experience?: string;
        salary_min?: string;
        salary_max?: string;
        sort?: string;
    };
}

const typeColors: Record<string, string> = {
    full_time: 'bg-green-100 text-green-700', part_time: 'bg-blue-100 text-blue-700',
    contract: 'bg-purple-100 text-purple-700', temporary: 'bg-yellow-100 text-yellow-700', daily: 'bg-orange-100 text-orange-700',
};

export default function JobsIndex({ jobs, categories, filters }: Props) {
    const { t } = useTranslation();
    const typeLabels: Record<string, string> = {
        full_time: t('jobTypes.full_time'), part_time: t('jobTypes.part_time'), contract: t('jobTypes.contract'), temporary: t('jobTypes.temporary'), daily: t('jobTypes.daily'),
    };
    const [search, setSearch] = useState(filters.search || '');
    const [location, setLocation] = useState(filters.location || '');
    const [category, setCategory] = useState(filters.category || '');
    const [type, setType] = useState(filters.type || '');
    const [experience, setExperience] = useState(filters.experience || '');
    const [sort, setSort] = useState(filters.sort || 'latest');

    const applyFilters = (overrides: Record<string, string> = {}) => {
        const params = { search, location, category, type, experience, sort, ...overrides };
        // Remove empty values
        Object.keys(params).forEach((key) => {
            if (!params[key as keyof typeof params]) delete params[key as keyof typeof params];
        });
        router.get('/jobs', params, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title={t('jobs.pageTitle')}>
                <meta name="description" content={t('jobs.seoDescription', { count: jobs.total || 0 })} />
                <meta property="og:title" content={t('jobs.pageTitle')} />
                <meta property="og:description" content={t('jobs.seoDescription', { count: jobs.total || 0 })} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:image" content={`${window.location.origin}/images/logoNexJobs.png`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={t('jobs.pageTitle')} />
                <meta name="twitter:description" content={t('jobs.seoDescription', { count: jobs.total || 0 })} />
                <meta name="twitter:image" content={`${window.location.origin}/images/logoNexJobs.png`} />
                <script type="application/ld+json">{JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: 'Construction & Real Estate Jobs in Cameroon',
                    description: t('jobs.seoDescription', { count: jobs.total || 0 }),
                    url: `${window.location.origin}/jobs`,
                    numberOfItems: jobs.total || 0,
                    itemListElement: jobs.data.slice(0, 10).map((job, i) => ({
                        '@type': 'ListItem',
                        position: i + 1,
                        item: {
                            '@type': 'JobPosting',
                            title: job.title,
                            datePosted: job.created_at,
                            validThrough: job.application_deadline || undefined,
                            employmentType: job.employment_type?.toUpperCase(),
                            hiringOrganization: {
                                '@type': 'Organization',
                                name: job.company?.name || 'Employer',
                            },
                            jobLocation: {
                                '@type': 'Place',
                                address: {
                                    '@type': 'PostalAddress',
                                    addressLocality: job.location || '',
                                    addressCountry: 'CM',
                                },
                            },
                            url: `${window.location.origin}/jobs/${job.id}`,
                        },
                    })),
                })}</script>
            </Head>

            {/* Hero */}
            <div className="bg-slate-900 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-white mb-1">{t('jobs.heroHeading')}</h1>
                    <p className="text-slate-400 text-sm">{t('jobs.heroSub', { count: jobs.total || 0 })}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24 space-y-6">
                            <h3 className="font-semibold text-gray-900 text-lg">{t('jobs.filtersHeading')}</h3>

                            {/* Search */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.searchLabel')}</label>
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters({ search: search })}
                                    placeholder={t('jobs.searchPlaceholder')} className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.locationLabel')}</label>
                                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters({ location: location })}
                                    placeholder={t('jobs.locationPlaceholder')} className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500" />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.categoryLabel')}</label>
                                <select value={category} onChange={(e) => { setCategory(e.target.value); applyFilters({ category: e.target.value }); }}
                                    className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">{t('common.allCategories')}</option>
                                    {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>

                            {/* Employment Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.typeLabel')}</label>
                                <select value={type} onChange={(e) => { setType(e.target.value); applyFilters({ type: e.target.value }); }}
                                    className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">{t('common.allTypes')}</option>
                                    {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('jobs.experienceLabel')}</label>
                                <select value={experience} onChange={(e) => { setExperience(e.target.value); applyFilters({ experience: e.target.value }); }}
                                    className="w-full rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500">
                                    <option value="">{t('common.allLevels')}</option>
                                    <option value="entry">{t('levels.entry')}</option>
                                    <option value="intermediate">{t('levels.intermediate')}</option>
                                    <option value="experienced">{t('levels.senior')}</option>
                                    <option value="expert">{t('levels.expert')}</option>
                                </select>
                            </div>

                            <button onClick={() => applyFilters()}
                                className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-lg font-medium transition-colors">
                                {t('jobs.applyFilters')}
                            </button>

                            <button onClick={() => { setSearch(''); setLocation(''); setCategory(''); setType(''); setExperience(''); router.get('/jobs'); }}
                                className="w-full text-gray-500 hover:text-gray-700 py-2 text-sm font-medium transition-colors">
                                {t('jobs.clearFilters')}
                            </button>
                        </div>
                    </div>

                    {/* Job List */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-500 text-sm">{t('jobs.jobsFound', { count: jobs.total || 0 })}</p>
                            <select value={sort} onChange={(e) => { setSort(e.target.value); applyFilters({ sort: e.target.value }); }}
                                className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="latest">{t('jobs.sortLatest')}</option>
                                <option value="salary_high">{t('jobs.sortHighest')}</option>
                                <option value="salary_low">{t('jobs.sortLowest')}</option>
                                <option value="views">{t('jobs.sortViewed')}</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {jobs.data.map((job, i) => {
                                const daysAgo = Math.floor((Date.now() - new Date(job.created_at).getTime()) / 86400000);
                                const timeLabel = daysAgo === 0 ? t('common.today') : daysAgo === 1 ? t('common.yesterday') : daysAgo < 7 ? t('common.daysAgo', { n: daysAgo }) : daysAgo < 30 ? t('common.weeksAgo', { n: Math.floor(daysAgo / 7) }) : new Date(job.created_at).toLocaleDateString();
                                const isNew = daysAgo <= 3;

                                return (
                                <motion.div key={job.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04, duration: 0.35 }}>
                                    <Link href={`/jobs/${job.slug}`}
                                        className="group relative block bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 p-6 overflow-hidden">

                                        {/* Subtle gradient accent on hover */}
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

                                        {/* Header: Company logo + Info + Badges */}
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex items-start gap-3.5">
                                                <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                                                    <span className="text-white font-bold text-sm">{job.company?.name?.substring(0, 2).toUpperCase() || 'CO'}</span>
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug truncate">{job.title}</h3>
                                                    <p className="text-sm text-slate-500 mt-0.5 truncate">{job.company?.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                {isNew && (
                                                    <span className="relative flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-wider ring-1 ring-inset ring-emerald-200/60">
                                                        <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                        New
                                                    </span>
                                                )}
                                                {job.is_featured && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-600 text-[10px] font-bold rounded-full uppercase tracking-wider ring-1 ring-inset ring-amber-200/60">
                                                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                                        {t('common.featured')}
                                                    </span>
                                                )}
                                                {job.is_urgent && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase tracking-wider ring-1 ring-inset ring-red-200/60">
                                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01" /></svg>
                                                        {t('jobs.urgent')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Meta pills */}
                                        <div className="flex items-center flex-wrap gap-2 mb-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                                                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                                {job.location}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg ${typeColors[job.employment_type]}`}>
                                                {typeLabels[job.employment_type]}
                                            </span>
                                            {job.job_category && (
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ring-1 ring-inset ${getCategoryColor(job.job_category.name)}`}>
                                                    {job.job_category.name}
                                                </span>
                                            )}
                                        </div>

                                        {/* Footer: Salary + Time */}
                                        <div className="flex items-center justify-between pt-3.5 border-t border-slate-100/80">
                                            {(job.salary_min || job.salary_max) ? (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-[15px] font-bold text-slate-900">
                                                        {job.salary_min && `${Number(job.salary_min).toLocaleString()} FCFA`}
                                                        {job.salary_min && job.salary_max && <span className="text-slate-300 mx-0.5">–</span>}
                                                        {job.salary_max && `${Number(job.salary_max).toLocaleString()} FCFA`}
                                                    </span>
                                                    <span className="text-xs text-slate-400">/{job.salary_period}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-300 italic">{t('jobs.negotiable')}</span>
                                            )}
                                            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {timeLabel}
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                                );
                            })}

                            {jobs.data.length === 0 && (
                                <div className="text-center py-16">
                                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">{t('jobs.noJobs')}</h3>
                                    <p className="text-gray-500">{t('jobs.noJobsHint')}</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {jobs.last_page > 1 && (
                            <div className="flex justify-center mt-8 gap-1">
                                {jobs.links.map((link, i) => (
                                    <Link key={i} href={link.url || '#'} preserveScroll
                                        className={`px-3 py-2 rounded-lg text-sm ${link.active ? 'bg-slate-800 text-white' : link.url ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
