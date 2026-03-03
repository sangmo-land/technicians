import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

interface Stats {
    total_jobs: number;
    active_jobs: number;
    total_applications: number;
    pending_applications: number;
}

interface RecentApplication {
    id: number;
    status: string;
    created_at: string;
    user: { id: number; name: string };
    jobListing: { id: number; title: string };
}

interface Props {
    stats: Stats;
    recentApplications: RecentApplication[];
    company: any;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-purple-100 text-purple-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
};

export default function EmployerDashboard({ stats, recentApplications, company }: Props) {
    const { auth } = usePage().props as any;

    return (
        <AppLayout>
            <Head title="Employer Dashboard - NexJobs" />

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold text-white">Employer Dashboard</h1>
                        <p className="text-gray-300 mt-1">Welcome back, {auth.user.name}</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <Link href="/employer/jobs/create"
                        className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Post a Job
                    </Link>
                    <Link href="/employer/company" className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                        Edit Company Profile
                    </Link>
                    <Link href="/workers" className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                        Browse Workers
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Jobs Posted', value: stats.total_jobs, color: 'bg-blue-50 text-blue-600' },
                        { label: 'Active Listings', value: stats.active_jobs, color: 'bg-green-50 text-green-600' },
                        { label: 'Total Applications', value: stats.total_applications, color: 'bg-purple-50 text-purple-600' },
                        { label: 'Pending Review', value: stats.pending_applications, color: 'bg-amber-50 text-amber-600' },
                    ].map((stat, i) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white rounded-xl border border-gray-200 p-5">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className={`text-3xl font-bold mt-1 ${stat.color.split(' ')[1]}`}>{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Recent Applications */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Recent Applications</h2>
                            <Link href="/employer/my-jobs" className="text-amber-600 hover:text-amber-700 text-sm">View all →</Link>
                        </div>
                        {recentApplications.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {recentApplications.map((app) => (
                                    <div key={app.id} className="py-3 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{app.user.name}</p>
                                            <p className="text-xs text-gray-500">Applied for: {app.jobListing.title}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[app.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {app.status}
                                            </span>
                                            <span className="text-xs text-gray-400">{new Date(app.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm py-4 text-center">No applications yet. Post a job to get started!</p>
                        )}
                    </div>

                    {/* Company Preview */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Company</h2>
                        {company ? (
                            <div>
                                <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mb-3">
                                    {company.logo ? (
                                        <img src={`/storage/${company.logo}`} alt="" className="w-16 h-16 rounded-xl object-cover" />
                                    ) : (
                                        <span className="text-amber-600 font-bold text-2xl">{company.name?.charAt(0)}</span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-900">{company.name}</h3>
                                {company.city && <p className="text-sm text-gray-500">{company.city}, {company.state}</p>}
                                {company.description && <p className="text-sm text-gray-500 mt-2 line-clamp-3">{company.description}</p>}
                                <Link href="/employer/company" className="text-amber-600 hover:text-amber-700 text-sm mt-3 inline-block">
                                    Edit Profile →
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-sm mb-3">Set up your company profile to attract better candidates.</p>
                                <Link href="/employer/company" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                                    Create Company Profile →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
