import { Head, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import AppLayout from '@/Layouts/AppLayout';
import { WorkerProfile, JobCategory, Skill } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
    profile: WorkerProfile;
    categories: JobCategory[];
    allSkills: Skill[];
}

export default function WorkerEdit({ profile, categories, allSkills }: Props) {
    const { t } = useTranslation();
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

    const toggleCategory = (id: number) => {
        const current = form.data.categories as number[];
        if (current.includes(id)) {
            form.setData('categories', current.filter(x => x !== id));
        } else if (current.length < 3) {
            form.setData('categories', [...current, id]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put('/worker/profile');
    };

    return (
        <AppLayout>
            <Head title={t('workerEdit.pageTitle')} />

            <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white">{t('workerEdit.heading')}</motion.h1>
                    <p className="text-gray-300 mt-1">{t('workerEdit.subtitle')}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit} className="space-y-6">

                    {/* Basic Info */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('workerEdit.basicInfo')}</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('workerEdit.professionalTitle')}</label>
                                <input type="text" value={form.data.professional_title}
                                    onChange={(e) => form.setData('professional_title', e.target.value)}
                                    placeholder={t('workerEdit.professionalTitlePlaceholder')}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                                {form.errors.professional_title && <p className="text-red-500 text-sm mt-1">{form.errors.professional_title}</p>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('workerEdit.bio')}</label>
                                <textarea rows={4} value={form.data.bio}
                                    onChange={(e) => form.setData('bio', e.target.value)}
                                    placeholder={t('workerEdit.bioPlaceholder')}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('workerEdit.experienceLevel')}</label>
                                <select value={form.data.experience_level}
                                    onChange={(e) => form.setData('experience_level', e.target.value as 'entry' | 'intermediate' | 'experienced' | 'expert')}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                                    <option value="entry">{t('workerEdit.entryLevel')}</option>
                                    <option value="intermediate">{t('workerEdit.intermediate')}</option>
                                    <option value="experienced">{t('workerEdit.experienced')}</option>
                                    <option value="expert">{t('workerEdit.expert')}</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('workerEdit.yearsOfExperience')}</label>
                                <input type="number" min="0" value={form.data.years_of_experience}
                                    onChange={(e) => form.setData('years_of_experience', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                        </div>
                    </div>

                    {/* Rates */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('workerEdit.rates')}</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('workerEdit.hourlyRate')}</label>
                                <input type="number" min="0" step="0.01" value={form.data.hourly_rate}
                                    onChange={(e) => form.setData('hourly_rate', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('workerEdit.dailyRate')}</label>
                                <input type="number" min="0" step="0.01" value={form.data.daily_rate}
                                    onChange={(e) => form.setData('daily_rate', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('workerEdit.location')}</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('workerEdit.city')}</label>
                                <input type="text" value={form.data.city}
                                    onChange={(e) => form.setData('city', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('workerEdit.stateProvince')}</label>
                                <input type="text" value={form.data.state}
                                    onChange={(e) => form.setData('state', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('workerEdit.country')}</label>
                                <input type="text" value={form.data.country}
                                    onChange={(e) => form.setData('country', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                        </div>
                    </div>

                    {/* Additional */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('workerEdit.additionalDetails')}</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('workerEdit.secondaryPhone')}</label>
                                <input type="text" value={form.data.phone_secondary}
                                    onChange={(e) => form.setData('phone_secondary', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('workerEdit.languages')}</label>
                                <input type="text" value={form.data.languages}
                                    onChange={(e) => form.setData('languages', e.target.value)}
                                    placeholder={t('workerEdit.languagesPlaceholder')}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('workerEdit.certifications')}</label>
                                <textarea rows={3} value={form.data.certifications}
                                    onChange={(e) => form.setData('certifications', e.target.value)}
                                    placeholder={t('workerEdit.certificationsPlaceholder')}
                                    className="w-full rounded-lg border-gray-300 focus:ring-amber-500 focus:border-amber-500" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="flex items-center space-x-3">
                                    <input type="checkbox" checked={form.data.is_available}
                                        onChange={(e) => form.setData('is_available', e.target.checked)}
                                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                                    <span className="text-sm font-medium text-gray-700">{t('workerEdit.availableForWork')}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('workerEdit.jobCategories')}</h2>
                        <p className="text-sm text-gray-500 mb-4">
                            {t('workerEdit.categoriesDesc')}
                            <span className={`ml-2 font-medium ${(form.data.categories as number[]).length >= 3 ? 'text-amber-600' : 'text-gray-400'}`}>
                                ({(form.data.categories as number[]).length}/3)
                            </span>
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {categories.map((cat) => {
                                const isSelected = (form.data.categories as number[]).includes(cat.id);
                                const isDisabled = !isSelected && (form.data.categories as number[]).length >= 3;
                                return (
                                    <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                                        disabled={isDisabled}
                                        className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                                            isSelected
                                                ? 'bg-amber-100 text-amber-800 border-2 border-amber-400'
                                                : isDisabled
                                                    ? 'bg-gray-50 text-gray-300 border-2 border-transparent cursor-not-allowed'
                                                    : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                                        }`}>
                                        {t(`categories.${cat.name}`) !== `categories.${cat.name}` ? t(`categories.${cat.name}`) : cat.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <a href="/dashboard" className="px-6 py-2.5 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50">{t('workerEdit.cancel')}</a>
                        <button type="submit" disabled={form.processing}
                            className="px-8 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50">
                            {form.processing ? t('workerEdit.saving') : t('workerEdit.saveProfile')}
                        </button>
                    </div>
                </motion.form>
            </div>
        </AppLayout>
    );
}
