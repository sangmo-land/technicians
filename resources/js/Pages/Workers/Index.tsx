import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { WorkerProfile, JobCategory, PaginatedData } from '@/types';

interface Props {
    workers: PaginatedData<WorkerProfile>;
    categories: JobCategory[];
    filters: {
        search?: string;
        category?: string;
        experience_level?: string;
        location?: string;
        availability?: string;
    };
}

export default function WorkersIndex({ workers, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [location, setLocation] = useState(filters.location || '');

    const applyFilters = (key: string, value: string) => {
        router.get('/workers', { ...filters, [key]: value || undefined }, { preserveState: true, preserveScroll: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/workers', { ...filters, search, location }, { preserveState: true });
    };

    const experienceLevels = ['entry', 'intermediate', 'experienced', 'expert'];

    return (
        <AppLayout>
            <Head title="Find Workers - CivilHire" />

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white mb-4">Find Skilled Workers</motion.h1>
                    <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, skill, or title..." className="flex-1 rounded-xl border-0 px-4 py-3 focus:ring-2 focus:ring-amber-500" />
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                            placeholder="Location" className="w-40 rounded-xl border-0 px-4 py-3 focus:ring-2 focus:ring-amber-500" />
                        <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">Search</button>
                    </motion.form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filter Chips */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <select value={filters.category || ''} onChange={(e) => applyFilters('category', e.target.value)}
                        className="rounded-lg border-gray-300 text-sm focus:ring-amber-500 focus:border-amber-500">
                        <option value="">All Categories</option>
                        {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
                    </select>
                    <select value={filters.experience_level || ''} onChange={(e) => applyFilters('experience_level', e.target.value)}
                        className="rounded-lg border-gray-300 text-sm focus:ring-amber-500 focus:border-amber-500">
                        <option value="">Any Experience</option>
                        {experienceLevels.map((l) => <option key={l} value={l} className="capitalize">{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                    </select>
                    <select value={filters.availability || ''} onChange={(e) => applyFilters('availability', e.target.value)}
                        className="rounded-lg border-gray-300 text-sm focus:ring-amber-500 focus:border-amber-500">
                        <option value="">Any Availability</option>
                        <option value="available">Available Now</option>
                        <option value="busy">Currently Busy</option>
                    </select>
                </div>

                <p className="text-sm text-gray-500 mb-6">{workers.total} worker{workers.total !== 1 ? 's' : ''} found</p>

                {workers.data.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workers.data.map((worker, i) => (
                            <motion.div key={worker.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}>
                                <Link href={`/workers/${worker.id}`}
                                    className="block bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-amber-200 transition-all p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                                            {worker.user?.avatar ? (
                                                <img src={`/storage/${worker.user.avatar}`} alt="" className="w-14 h-14 rounded-full object-cover" />
                                            ) : (
                                                <span className="text-amber-600 font-bold text-xl">{worker.user?.name?.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 truncate">{worker.user?.name}</h3>
                                            <p className="text-sm text-amber-600 truncate">{worker.professional_title || 'Civil Worker'}</p>
                                        </div>
                                        <span className={`w-3 h-3 rounded-full ${worker.is_available ? 'bg-green-400' : 'bg-gray-300'}`} title={worker.is_available ? 'Available' : 'Busy'} />
                                    </div>

                                    {worker.bio && <p className="text-sm text-gray-500 line-clamp-2 mb-3">{worker.bio}</p>}

                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {worker.skills?.slice(0, 4).map((skill) => (
                                            <span key={skill.id} className="px-2 py-0.5 bg-amber-50 text-amber-700 text-xs rounded-full">{skill.name}</span>
                                        ))}
                                        {(worker.skills?.length || 0) > 4 && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">+{worker.skills!.length - 4}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>{worker.city && `${worker.city}, ${worker.state}`}</span>
                                        <span className="capitalize">{worker.experience_level}</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">No workers found</h3>
                        <p className="text-gray-500">Try adjusting your filters.</p>
                    </div>
                )}

                {/* Pagination */}
                {workers.last_page > 1 && (
                    <div className="flex justify-center mt-8 gap-1">
                        {workers.links.map((link, i) => (
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
