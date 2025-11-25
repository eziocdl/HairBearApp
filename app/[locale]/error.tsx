'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations('error');
    useEffect(() => {
        // Log the error to an error reporting service (e.g., Sentry)
        console.error('Error caught by Error Boundary:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-lighter px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-6xl">😬</h1>
                    <h2 className="text-2xl font-bold text-slate-100">
                        {t('title')}
                    </h2>
                    <p className="text-slate-400">
                        {t('description')}
                    </p>
                </div>

                {process.env.NODE_ENV === 'development' && error.message && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-left">
                        <p className="text-red-400 text-sm font-mono break-words">
                            {error.message}
                        </p>
                    </div>
                )}

                <div className="flex gap-3 justify-center">
                    <Button
                        variant="primary"
                        onClick={reset}
                    >
                        {t('tryAgainButton')}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => window.location.href = '/'}
                    >
                        {t('backButton')}
                    </Button>
                </div>

                <p className="text-xs text-slate-500">
                    {t('contactSupport')}
                </p>
            </div>
        </div>
    );
}
