import en from './en';
import fr from './fr';

export type Translations = typeof en;
export type TranslationKey = keyof Translations;
export type NestedKeyOf<T> = T extends object
    ? { [K in keyof T]: K extends string ? (T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : K) : never }[keyof T]
    : never;

const translations: Record<string, Translations> = { en, fr };

const STORAGE_KEY = 'civilhire_locale';

export function getLocale(): string {
    if (typeof window === 'undefined') return 'en';
    return localStorage.getItem(STORAGE_KEY) || 'en';
}

export function setLocale(locale: string): void {
    localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    window.dispatchEvent(new CustomEvent('locale-changed', { detail: locale }));
}

/**
 * Get a nested translation value using dot-notation key.
 * Supports interpolation: t('hero.stat', { jobs: 5, workers: 10 })
 */
export function t(key: string, params?: Record<string, string | number>): string {
    const locale = getLocale();
    const dict = translations[locale] || translations.en;

    const parts = key.split('.');
    let value: any = dict;
    for (const part of parts) {
        value = value?.[part];
        if (value === undefined) break;
    }

    // Fallback to English
    if (value === undefined) {
        value = translations.en;
        for (const part of parts) {
            value = value?.[part];
            if (value === undefined) break;
        }
    }

    if (Array.isArray(value)) return value as any;

    if (typeof value !== 'string') return key;

    // Interpolation — replace {{key}} with params
    if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (_, k) => String(params[k] ?? `{{${k}}}`));
    }

    return value;
}
