export const locales = ['pt-BR', 'en-US'] as const;
export const defaultLocale = 'pt-BR' as const;
export type Locale = typeof locales[number];

export const routing = {
    locales,
    defaultLocale
};
