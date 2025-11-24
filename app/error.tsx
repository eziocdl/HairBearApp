'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
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
                        Ops! Algo deu errado
                    </h2>
                    <p className="text-slate-400">
                        Não se preocupe, seus dados estão seguros. Tente novamente ou volte para a página inicial.
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
                        Tentar Novamente
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => window.location.href = '/'}
                    >
                        Voltar ao Início
                    </Button>
                </div>

                <p className="text-xs text-slate-500">
                    Se o problema persistir, entre em contato conosco.
                </p>
            </div>
        </div>
    );
}
