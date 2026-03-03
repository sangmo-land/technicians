import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { JobApplication, PaginatedData } from '@/types';

interface Props {
    applications: PaginatedData<JobApplication>;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-purple-100 text-purple-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-700',
};

export default function ApplicationsIndex({ applications }: Props) {
    const handleWithdraw = (id: number) => {
        if (confirm('Are you sure you want to withdraw this application?')) {
            router.post(`/applications/${id}/withdraw`);
        }
    };

    return (
        <AppLayout>
            <Head title="My Applications" />

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white">My Applications</motion.h1>
                    <p className="text-gray-300 mt-1">Track the status of your job applications</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {applications.data.length > 0 ? (
                    <div className="space-y-4">
                        {applications.data.map((app, i) => (
                            <motion.div key={app.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl border border-gray-200 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Link href={`/jobs/${app.job_listing?.slug}`}
                                                className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors">
                                                {app.job_listing?.title}
                                            </Link>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[app.status]}`}>
                                                {app.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>{app.job_listing?.company?.name}</span>
                                            <span>{app.job_listing?.location}</span>
                                            <span>Applied {new Date(app.created_at).toLocaleDateString()}</span>
                                        </div>
                                        {app.cover_letter && (
                                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{app.cover_letter}</p>
                                        )}
                                        {app.employer_notes && (
                                            <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                                                <p className="text-sm text-blue-700"><strong>Employer note:</strong> {app.employer_notes}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        {app.status === 'pending' && (
                                            <button onClick={() => handleWithdraw(app.id)}
                                                className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                Withdraw
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                        <p className="text-gray-500 mb-4">Browse jobs and start applying!</p>
                        <Link href="/jobs" className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700">
                            Browse Jobs
                        </Link>
                    </div>
                )}

                {applications.last_page > 1 && (
                    <div className="flex justify-center mt-8 gap-1">
                        {applications.links.map((link, i) => (
                            <Link key={i} href={link.url || '#'} preserveScroll
                                className={`px-3 py-2 rounded-lg text-sm ${link.active ? 'bg-amber-600 text-white' : link.url ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
