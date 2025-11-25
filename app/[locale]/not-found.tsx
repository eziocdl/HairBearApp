import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';

export default function NotFound() {
    const t = useTranslations('notFound');
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark to-dark-lighter px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-8xl font-bold text-primary">404</h1>
                    <h2 className="text-2xl font-bold text-slate-100">
                        {t('title')}
                    </h2>
                    <p className="text-slate-400">
                        {t('description')}
                    </p>
                </div>

                <Link href="/">
                    <Button variant="primary" fullWidth>
                        {t('backButton')}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
