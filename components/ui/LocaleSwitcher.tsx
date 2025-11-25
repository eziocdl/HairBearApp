'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useState, useTransition } from 'react';

type Locale = 'pt-BR' | 'en-US';

const localeNames: Record<Locale, string> = {
    'pt-BR': 'PT',
    'en-US': 'EN'
};

export default function LocaleSwitcher() {
    const router = useRouter();
    const currentLocale = useLocale() as Locale;
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const switchLocale = (newLocale: Locale) => {
        if (newLocale === currentLocale) {
            setIsOpen(false);
            return;
        }

        startTransition(() => {
            // Remove current locale and add new locale to pathname
            const currentPath = pathname.replace(`/${currentLocale}`, '');
            router.replace(`/${newLocale}${currentPath}`);
        });

        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium text-slate-300 hover:text-white disabled:opacity-50"
                aria-label="Change language"
            >
                <Globe className="w-4 h-4" />
                <span>{localeNames[currentLocale]}</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute top-full right-0 mt-2 bg-dark-lighter border border-white/10 rounded-lg shadow-xl overflow-hidden z-20 min-w-[120px]">
                        {Object.entries(localeNames).map(([locale, name]) => (
                            <button
                                key={locale}
                                onClick={() => switchLocale(locale as Locale)}
                                disabled={isPending}
                                className={`w-full px-4 py-2 text-left text-sm transition-colors disabled:opacity-50 ${currentLocale === locale
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                {name === 'PT' ? '🇧🇷 Português' : '🇺🇸 English'}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
