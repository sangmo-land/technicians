import { useState, useEffect, useCallback } from 'react';
import { t as translate, getLocale, setLocale as setAppLocale } from '@/i18n';

export function useTranslation() {
    const [locale, setLocaleState] = useState(getLocale);

    useEffect(() => {
        const handler = (e: Event) => {
            setLocaleState((e as CustomEvent).detail);
        };
        window.addEventListener('locale-changed', handler);
        return () => window.removeEventListener('locale-changed', handler);
    }, []);

    const t = useCallback(
        (key: string, params?: Record<string, string | number>) => translate(key, params),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [locale]
    );

    const switchLocale = useCallback((newLocale: string) => {
        setAppLocale(newLocale);
    }, []);

    return { t, locale, switchLocale };
}
