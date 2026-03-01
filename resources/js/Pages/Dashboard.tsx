import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const user = auth.user;

    return (
        <AppLayout>
            <Head title="Dashboard - CivilHire" />

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-3xl font-bold text-white">Welcome, {user.name}</h1>
                        <p className="text-gray-300 mt-1">Your personal dashboard</p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.role === 'worker' && (
                        <>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                                <Link href="/worker/profile"
                                    className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-amber-200 transition-all group">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Edit Profile</h3>
                                    <p className="text-sm text-gray-500">Update your skills, experience, and availability</p>
                                </Link>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                                <Link href="/my-applications"
                                    className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-amber-200 transition-all group">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">My Applications</h3>
                                    <p className="text-sm text-gray-500">Track your submitted job applications</p>
                                </Link>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <Link href="/saved-jobs"
                                    className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-amber-200 transition-all group">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Saved Jobs</h3>
                                    <p className="text-sm text-gray-500">View jobs you've bookmarked for later</p>
                                </Link>
                            </motion.div>

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                                <Link href="/jobs"
                                    className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-amber-200 transition-all group">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Browse Jobs</h3>
                                    <p className="text-sm text-gray-500">Find new opportunities in civil engineering</p>
                                </Link>
                            </motion.div>
                        </>
                    )}

                    {user.role === 'employer' && (
                        <>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Link href="/employer/dashboard"
                                    className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-amber-200 transition-all group">
                                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Employer Dashboard</h3>
                                    <p className="text-sm text-gray-500">View stats, manage listings and applications</p>
                                </Link>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
