import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from 'sonner';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import ReactQueryProvider from '@/lib/react-query-provider';

const inter = Inter({ subsets: ["latin"] });

// Force static export for all pages (required for Capacitor)
export const dynamic = 'force-static';

export function generateStaticParams() {
    return [{ locale: 'pt-BR' }, { locale: 'en-US' }];
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'metadata' });

    return {
        title: t('title'),
        description: t('description'),
        keywords: t('keywords').split(', '),
        openGraph: {
            title: t('ogTitle'),
            description: t('ogDescription'),
            type: "website",
        },
    };
}

export default async function LocaleLayout({
    children,
    params: { locale }
}: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
}>) {
    unstable_setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className={inter.className}>
                <NextIntlClientProvider messages={messages}>
                    <ReactQueryProvider>
                        {children}
                        <Toaster position="top-center" richColors />
                    </ReactQueryProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
