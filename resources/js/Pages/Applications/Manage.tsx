import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { JobApplication, JobListing } from '@/types';

interface Props {
    job: JobListing;
    applications: JobApplication[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    reviewed: 'bg-blue-100 text-blue-800',
    shortlisted: 'bg-purple-100 text-purple-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    withdrawn: 'bg-gray-100 text-gray-700',
};

const statusOptions = ['pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'];

export default function ApplicationsManage({ job, applications }: Props) {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const updateStatus = (appId: number, status: string) => {
        router.put(`/employer/applications/${appId}/status`, { status }, { preserveScroll: true });
    };

    return (
        <AppLayout>
            <Head title={`Applications for ${job.title} - NexJobs`} />

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/employer/my-jobs" className="text-amber-400 hover:text-amber-300 text-sm mb-2 inline-flex items-center">
                        ← Back to My Jobs
                    </Link>
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold text-white">Applications</h1>
                        <p className="text-gray-300 mt-1">For: {job.title} · {applications.length} application{applications.length !== 1 ? 's' : ''}</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {applications.length > 0 ? (
                    <div className="space-y-4">
                        {applications.map((app, i) => (
                            <motion.div key={app.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                                <span className="text-amber-600 font-bold text-lg">{app.user?.name?.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{app.user?.name}</h3>
                                                <p className="text-sm text-gray-500">{app.user?.email}</p>
                                                <p className="text-xs text-gray-400">Applied {new Date(app.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[app.status]}`}>
                                                {app.status}
                                            </span>
                                            <button onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                                                className="p-1 text-gray-400 hover:text-gray-600">
                                                <svg className={`w-5 h-5 transition-transform ${expandedId === app.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status Buttons */}
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {statusOptions.map((status) => (
                                            <button key={status} onClick={() => updateStatus(app.id, status)}
                                                disabled={app.status === status}
                                                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors ${
                                                    app.status === status
                                                        ? 'bg-amber-600 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}>
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedId === app.id && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                        className="border-t border-gray-100 bg-gray-50 p-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {app.cover_letter && (
                                                <div>
                                                    <h4 className="font-medium text-gray-900 text-sm mb-1">Cover Letter</h4>
                                                    <p className="text-sm text-gray-600 whitespace-pre-line">{app.cover_letter}</p>
                                                </div>
                                            )}
                                            <div className="space-y-2 text-sm">
                                                {app.expected_salary && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Expected Salary</span>
                                                        <span className="font-medium">${Number(app.expected_salary).toLocaleString()}</span>
                                                    </div>
                                                )}
                                                {app.available_start_date && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Available From</span>
                                                        <span className="font-medium">{new Date(app.available_start_date).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                                {app.user?.phone && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Phone</span>
                                                        <span className="font-medium">{app.user.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {app.user && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <Link href={`/workers/${app.user.id}`}
                                                    className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                                                    View Worker Profile →
                                                </Link>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                        <p className="text-gray-500">Applications will appear here as candidates apply.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
