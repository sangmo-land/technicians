import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { JobCategory, Skill } from '@/types';

interface Props {
    categories: JobCategory[];
    allSkills: Skill[];
}

export default function JobCreate({ categories, allSkills }: Props) {
    const form = useForm({
        title: '',
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        job_category_id: '',
        employment_type: 'full_time',
        experience_level: 'entry',
        location: '',
        salary_min: '',
        salary_max: '',
        salary_period: 'month',
        positions_available: '1',
        application_deadline: '',
        project_name: '',
        project_duration_months: '',
        is_urgent: false,
        skills: [] as number[],
    });

    const toggleSkill = (id: number) => {
        const current = form.data.skills;
        form.setData('skills', current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/employer/jobs');
    };

    return (
        <AppLayout>
            <Head title="Post a Job - CivilHire" />

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white">Post a New Job</motion.h1>
                    <p className="text-gray-300 mt-1">Fill in the details to find the right candidates</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                                <input type="text" value={form.data.title}
                                    onChange={(e) => form.setData('title', e.target.value)} required
                                    placeholder="e.g. Senior Formwork Maker"
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                                {form.errors.title && <p className="text-red-500 text-sm mt-1">{form.errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select value={form.data.job_category_id}
                                    onChange={(e) => form.setData('job_category_id', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                                    <option value="">Select category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                                <input type="text" value={form.data.location}
                                    onChange={(e) => form.setData('location', e.target.value)} required
                                    placeholder="e.g. New York, NY"
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                                <select value={form.data.employment_type}
                                    onChange={(e) => form.setData('employment_type', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                                    <option value="full_time">Full Time</option>
                                    <option value="part_time">Part Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="temporary">Temporary</option>
                                    <option value="daily">Daily</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                                <select value={form.data.experience_level}
                                    onChange={(e) => form.setData('experience_level', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                                    <option value="entry">Entry Level</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="experienced">Experienced</option>
                                    <option value="expert">Expert</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Positions Available</label>
                                <input type="number" min="1" value={form.data.positions_available}
                                    onChange={(e) => form.setData('positions_available', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                                <input type="date" value={form.data.application_deadline}
                                    onChange={(e) => form.setData('application_deadline', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-3">
                                    <input type="checkbox" checked={form.data.is_urgent}
                                        onChange={(e) => form.setData('is_urgent', e.target.checked)}
                                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                                    <span className="text-sm font-medium text-gray-700">Mark as Urgent Hiring</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Salary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compensation</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Salary</label>
                                <input type="number" min="0" value={form.data.salary_min}
                                    onChange={(e) => form.setData('salary_min', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Salary</label>
                                <input type="number" min="0" value={form.data.salary_max}
                                    onChange={(e) => form.setData('salary_max', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period</label>
                                <select value={form.data.salary_period}
                                    onChange={(e) => form.setData('salary_period', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                                    <option value="hour">Per Hour</option>
                                    <option value="day">Per Day</option>
                                    <option value="week">Per Week</option>
                                    <option value="month">Per Month</option>
                                    <option value="year">Per Year</option>
                                    <option value="project">Per Project</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Project */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                                <input type="text" value={form.data.project_name}
                                    onChange={(e) => form.setData('project_name', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                                <input type="number" min="1" value={form.data.project_duration_months}
                                    onChange={(e) => form.setData('project_duration_months', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                        </div>
                    </div>

                    {/* Description Fields */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                            <textarea rows={6} value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)} required
                                placeholder="Provide a detailed description of the job..."
                                className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            {form.errors.description && <p className="text-red-500 text-sm mt-1">{form.errors.description}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                            <textarea rows={4} value={form.data.requirements}
                                onChange={(e) => form.setData('requirements', e.target.value)}
                                placeholder="List the requirements for this position..."
                                className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                            <textarea rows={4} value={form.data.responsibilities}
                                onChange={(e) => form.setData('responsibilities', e.target.value)}
                                placeholder="List the key responsibilities..."
                                className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                            <textarea rows={3} value={form.data.benefits}
                                onChange={(e) => form.setData('benefits', e.target.value)}
                                placeholder="List the benefits offered..."
                                className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h2>
                        <p className="text-sm text-gray-500 mb-4">Select the skills needed for this job</p>
                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                            {allSkills.map((skill) => (
                                <button key={skill.id} type="button" onClick={() => toggleSkill(skill.id)}
                                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                                        form.data.skills.includes(skill.id)
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
                        <a href="/employer/dashboard" className="px-6 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50">Cancel</a>
                        <button type="submit" disabled={form.processing}
                            className="px-8 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50">
                            {form.processing ? 'Publishing...' : 'Publish Job'}
                        </button>
                    </div>
                </motion.form>
            </div>
        </AppLayout>
    );
}
