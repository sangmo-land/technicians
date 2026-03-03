import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { Company } from '@/types';

interface Props {
    company: Company | null;
}

export default function CompanyEdit({ company }: Props) {
    const form = useForm({
        name: company?.name || '',
        description: company?.description || '',
        website: company?.website || '',
        phone: company?.phone || '',
        email: company?.email || '',
        address: company?.address || '',
        city: company?.city || '',
        state: company?.state || '',
        country: company?.country || '',
        employee_count: company?.employee_count?.toString() || '',
        founded_year: company?.founded_year?.toString() || '',
        specializations: company?.specializations || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put('/employer/company');
    };

    return (
        <AppLayout>
            <Head title="Company Profile" />

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white">{company ? 'Edit' : 'Create'} Company Profile</motion.h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit} className="space-y-6">

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                                <input type="text" value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)} required
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                                {form.errors.name && <p className="text-red-500 text-sm mt-1">{form.errors.name}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea rows={4} value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="Tell candidates about your company..."
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <input type="url" value={form.data.website}
                                    onChange={(e) => form.setData('website', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input type="text" value={form.data.phone}
                                    onChange={(e) => form.setData('phone', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
                                <input type="text" value={form.data.specializations}
                                    onChange={(e) => form.setData('specializations', e.target.value)}
                                    placeholder="e.g. Residential, Commercial, Infrastructure"
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input type="text" value={form.data.address}
                                    onChange={(e) => form.setData('address', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
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

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Info</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
                                <input type="number" min="1" value={form.data.employee_count}
                                    onChange={(e) => form.setData('employee_count', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Founded Year</label>
                                <input type="number" min="1900" max={new Date().getFullYear()} value={form.data.founded_year}
                                    onChange={(e) => form.setData('founded_year', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <a href="/employer/dashboard" className="px-6 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50">Cancel</a>
                        <button type="submit" disabled={form.processing}
                            className="px-8 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50">
                            {form.processing ? 'Saving...' : 'Save Company'}
                        </button>
                    </div>
                </motion.form>
            </div>
        </AppLayout>
    );
}
