import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { JobListing, PaginatedData } from '@/types';

interface Props {
    jobs: PaginatedData<JobListing>;
}

const typeLabels: Record<string, string> = {
    full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract', temporary: 'Temporary', daily: 'Daily',
};

const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    paused: 'bg-yellow-100 text-yellow-700',
    closed: 'bg-gray-100 text-gray-700',
    expired: 'bg-red-100 text-red-700',
    draft: 'bg-blue-100 text-blue-700',
};

export default function MyJobs({ jobs }: Props) {
    return (
        <AppLayout>
            <Head title="My Jobs - NexJobs" />

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white">My Job Listings</motion.h1>
                    <Link href="/employer/jobs/create"
                        className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Post New Job
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {jobs.data.length > 0 ? (
                    <div className="space-y-4">
                        {jobs.data.map((job, i) => (
                            <motion.div key={job.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Link href={`/jobs/${job.slug}`}
                                                className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors">
                                                {job.title}
                                            </Link>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[job.status] || 'bg-gray-100 text-gray-600'}`}>
                                                {job.status}
                                            </span>
                                            {job.is_urgent && <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-medium">Urgent</span>}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>{job.location}</span>
                                            <span>{typeLabels[job.employment_type]}</span>
                                            <span>{job.applications_count || 0} applications</span>
                                            <span>{job.views_count} views</span>
                                            <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Link href={`/employer/jobs/${job.id}/applications`}
                                            className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-sm font-medium transition-colors">
                                            Applications ({job.applications_count || 0})
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">No jobs posted yet</h3>
                        <p className="text-gray-500 mb-4">Start by posting your first job listing.</p>
                        <Link href="/employer/jobs/create"
                            className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700">
                            Post Your First Job
                        </Link>
                    </div>
                )}

                {jobs.last_page > 1 && (
                    <div className="flex justify-center mt-8 gap-1">
                        {jobs.links.map((link, i) => (
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
