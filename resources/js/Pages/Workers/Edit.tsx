import { Head, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { WorkerProfile, JobCategory, Skill } from '@/types';

interface Props {
    profile: WorkerProfile;
    categories: JobCategory[];
    allSkills: Skill[];
}

export default function WorkerEdit({ profile, categories, allSkills }: Props) {
    const form = useForm({
        professional_title: profile.professional_title || '',
        bio: profile.bio || '',
        experience_level: profile.experience_level || 'entry',
        years_of_experience: profile.years_of_experience?.toString() || '',
        hourly_rate: profile.hourly_rate?.toString() || '',
        daily_rate: profile.daily_rate?.toString() || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        phone_secondary: profile.phone_secondary || '',
        certifications: profile.certifications || '',
        languages: profile.languages || '',
        is_available: profile.is_available ?? true,
        skills: profile.skills?.map(s => s.id) || [],
        categories: profile.categories?.map(c => c.id) || [],
    });

    const toggleItem = (field: 'skills' | 'categories', id: number) => {
        const current = form.data[field] as number[];
        form.setData(field, current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put('/worker/profile');
    };

    return (
        <AppLayout>
            <Head title="Edit Profile - CivilHire" />

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white">Edit Your Profile</motion.h1>
                    <p className="text-gray-300 mt-1">Showcase your skills and experience to employers</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
                                <input type="text" value={form.data.professional_title}
                                    onChange={(e) => form.setData('professional_title', e.target.value)}
                                    placeholder="e.g. Senior Formwork Maker"
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                                {form.errors.professional_title && <p className="text-red-500 text-sm mt-1">{form.errors.professional_title}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea rows={4} value={form.data.bio}
                                    onChange={(e) => form.setData('bio', e.target.value)}
                                    placeholder="Tell employers about yourself, your experience, and what makes you stand out..."
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                                <select value={form.data.experience_level}
                                    onChange={(e) => form.setData('experience_level', e.target.value as 'entry' | 'intermediate' | 'experienced' | 'expert')}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                                    <option value="entry">Entry Level</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="experienced">Experienced</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                                <input type="number" min="0" value={form.data.years_of_experience}
                                    onChange={(e) => form.setData('years_of_experience', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                        </div>
                    </div>

                    {/* Rates */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rates</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                                <input type="number" min="0" step="0.01" value={form.data.hourly_rate}
                                    onChange={(e) => form.setData('hourly_rate', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate ($)</label>
                                <input type="number" min="0" step="0.01" value={form.data.daily_rate}
                                    onChange={(e) => form.setData('daily_rate', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input type="text" value={form.data.city}
                                    onChange={(e) => form.setData('city', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                                <input type="text" value={form.data.state}
                                    onChange={(e) => form.setData('state', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <input type="text" value={form.data.country}
                                    onChange={(e) => form.setData('country', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                        </div>
                    </div>

                    {/* Additional */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone</label>
                                <input type="text" value={form.data.phone_secondary}
                                    onChange={(e) => form.setData('phone_secondary', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                                <input type="text" value={form.data.languages}
                                    onChange={(e) => form.setData('languages', e.target.value)}
                                    placeholder="e.g. English, Spanish"
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                                <textarea rows={3} value={form.data.certifications}
                                    onChange={(e) => form.setData('certifications', e.target.value)}
                                    placeholder="List your certifications, one per line"
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-3">
                                    <input type="checkbox" checked={form.data.is_available}
                                        onChange={(e) => form.setData('is_available', e.target.checked)}
                                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                                    <span className="text-sm font-medium text-gray-700">I am currently available for work</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Job Categories</h2>
                        <p className="text-sm text-gray-500 mb-4">Select the categories that match your expertise</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {categories.map((cat) => (
                                <button key={cat.id} type="button" onClick={() => toggleItem('categories', cat.id)}
                                    className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                                        (form.data.categories as number[]).includes(cat.id)
                                            ? 'bg-amber-100 text-amber-800 border-2 border-amber-400'
                                            : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                                    }`}>
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
                        <p className="text-sm text-gray-500 mb-4">Select your skills</p>
                        <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                            {allSkills.map((skill) => (
                                <button key={skill.id} type="button" onClick={() => toggleItem('skills', skill.id)}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                        (form.data.skills as number[]).includes(skill.id)
                                            ? 'bg-amber-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}>
                                    {skill.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <a href="/dashboard" className="px-6 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50">Cancel</a>
                        <button type="submit" disabled={form.processing}
                            className="px-8 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50">
                            {form.processing ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>
                </motion.form>
            </div>
        </AppLayout>
    );
}
