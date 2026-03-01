import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { JobListing } from '@/types';

interface Props {
    savedJobs: JobListing[];
}

const typeLabels: Record<string, string> = {
    full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract', temporary: 'Temporary', daily: 'Daily',
};

export default function SavedJobsIndex({ savedJobs }: Props) {
    return (
        <AppLayout>
            <Head title="Saved Jobs - CivilHire" />

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white">Saved Jobs</motion.h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {savedJobs.length > 0 ? (
                    <div className="space-y-4">
                        {savedJobs.map((job, i) => (
                            <motion.div key={job.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <Link href={`/jobs/${job.slug}`}
                                            className="text-lg font-semibold text-gray-900 hover:text-amber-600 transition-colors">
                                            {job.title}
                                        </Link>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                            <span>{job.company?.name}</span>
                                            <span>{job.location}</span>
                                            <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{typeLabels[job.employment_type]}</span>
                                        </div>
                                        {(job.salary_min || job.salary_max) && (
                                            <p className="text-amber-600 font-semibold mt-2">
                                                {job.salary_min && `${Number(job.salary_min).toLocaleString()} FCFA`}
                                                {job.salary_min && job.salary_max && ' - '}
                                                {job.salary_max && `${Number(job.salary_max).toLocaleString()} FCFA`}
                                                <span className="text-gray-400 font-normal text-sm"> /{job.salary_period}</span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 ml-4">
                                        <Link href={`/jobs/${job.id}/save`} method="post" as="button"
                                            className="p-2 text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                            title="Unsave">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                            </svg>
                                        </Link>
                                        <Link href={`/jobs/${job.slug}`}
                                            className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg font-medium hover:bg-amber-700 transition-colors">
                                            View Job
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">No saved jobs</h3>
                        <p className="text-gray-500 mb-4">Save jobs you're interested in to come back to later.</p>
                        <Link href="/jobs" className="inline-flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700">
                            Browse Jobs
                        </Link>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
