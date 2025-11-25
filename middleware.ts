import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always' // URLs sempre com locale: /pt-BR/camera
});

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ['/', '/(pt-BR|en-US)/:path*']
};
