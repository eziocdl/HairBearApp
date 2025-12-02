'use client';

import { motion } from 'framer-motion';
import { Camera, Image as ImageIcon, ChevronRight, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/lib/navigation';
import Button from '@/components/ui/Button';
import LocaleSwitcher from '@/components/ui/LocaleSwitcher';
import { useAppStore } from '@/lib/store';

export default function Home() {
    const router = useRouter();
    const t = useTranslations('home');
    const common = useTranslations('common');
    const styles = useTranslations('styles');
    const { setCurrentStage, setSelectedStyle } = useAppStore();

    const handleCameraClick = () => {
        setCurrentStage('camera');
        router.push('/camera');
    };

    const handleGalleryClick = () => {
        setCurrentStage('upload');
        router.push('/upload');
    };

    return (
        <div className="min-h-screen flex flex-col bg-dark">
            {/* Hero Section with Background Image */}
            <div className="relative min-h-[80vh] w-full overflow-hidden flex flex-col">
                {/* Background Image & Overlay */}
                <div
                    className="absolute inset-0 z-0"
                >
                    <img
                        src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
                        alt="Barbershop Background"
                        className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/40 to-dark" />
                    <div className="absolute inset-0 bg-gradient-to-r from-dark/70 via-transparent to-dark/70" />
                </div>

                {/* Header */}
                <header className="absolute top-0 left-0 right-0 p-6 z-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">H</span>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">{common('appName')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <LocaleSwitcher />
                        <button
                            onClick={() => router.push('/tryon')}
                            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                        >
                            <Sparkles className="w-4 h-4" />
                            Ultra Try-On
                        </button>
                        <button className="text-sm text-slate-300 font-medium hover:text-white transition-colors">
                            {common('login')}
                        </button>
                    </div>
                </header>

                {/* Hero Content */}
                <main className="relative z-10 flex-1 flex flex-col justify-end pb-12 px-6 md:justify-center md:pb-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-xl mx-auto w-full space-y-6"
                    >
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 w-fit">
                                <Star className="w-3 h-3 text-accent fill-accent" />
                                <span className="text-xs font-medium text-white uppercase tracking-wider">{t('badge')}</span>
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                                {t('heroTitle')} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300">
                                    {t('heroSubtitle')}
                                </span>
                            </h1>
                            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-md">
                                {t('heroDescription')}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                icon={<Camera className="w-5 h-5" />}
                                onClick={handleCameraClick}
                            >
                                {t('simulateNow')}
                            </Button>
                            <Button
                                variant="secondary"
                                size="lg"
                                fullWidth
                                icon={<ImageIcon className="w-5 h-5" />}
                                onClick={handleGalleryClick}
                            >
                                {t('uploadFromGallery')}
                            </Button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm text-slate-400">{t('private')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-6 h-6 rounded-full bg-slate-600 border-2 border-dark" />
                                    ))}
                                </div>
                                <span className="text-sm text-slate-400">{t('simulationsToday')}</span>
                            </div>
                        </div>
                    </motion.div>
                </main>
            </div>


            {/* Quiz CTA Section */}
            <section className="py-16 md:py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5" />
                <div className="max-w-5xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" />
                            {t('quizBadge')}
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                            {t('quizTitle')}
                        </h2>
                        <p className="text-base md:text-lg text-slate-400">
                            {t('quizDescription')}
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <Button
                                variant="primary"
                                size="lg"
                                icon={<ChevronRight className="w-5 h-5" />}
                                onClick={() => router.push('/quiz')}
                            >
                                {t('quizCta')}
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-dark-lighter to-dark shadow-2xl p-4 md:p-8 flex items-center justify-center group">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="grid grid-cols-2 gap-4 w-full h-full">
                                <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop" className="rounded-xl w-full h-full object-cover" alt="Style 1" />
                                <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop" className="rounded-xl w-full h-full object-cover" alt="Style 2" />
                                <img src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop" className="rounded-xl w-full h-full object-cover" alt="Style 3" />
                                <img src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1974&auto=format&fit=crop" className="rounded-xl w-full h-full object-cover" alt="Style 4" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Styles Gallery */}
            <section className="py-16 md:py-24 px-6 bg-dark">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            {t('trendingTitle')}
                        </h2>
                        <p className="text-slate-400">
                            {t('trendingDescription')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            {
                                name: styles('fadeModern'),
                                image: '/fade-modern.png',
                                id: 'fade_modern'
                            },
                            {
                                name: styles('beardLumberjack'),
                                image: '/beard-sidepart.jpg',
                                id: 'beard_lumberjack'
                            },
                            {
                                name: styles('pompadour'),
                                image: '/beard-pompadour.png',
                                id: 'pompadour'
                            },
                            {
                                name: styles('buzzCut'),
                                image: '/buzz-cut.png',
                                id: 'buzz_cut'
                            },
                        ].map((style, i) => (
                            <div
                                key={i}
                                onClick={() => {
                                    setSelectedStyle(style.id);
                                    setCurrentStage('upload');
                                    router.push('/upload');
                                }}
                                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/50 transition-all cursor-pointer"
                            >
                                <img
                                    src={style.image}
                                    alt={style.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-90" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-white font-bold text-lg">{style.name}</h3>
                                    <span className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300 block">
                                        {t('styleSimulate')}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center pt-8">
                        <Button
                            variant="secondary"
                            onClick={() => router.push('/pricing')}
                        >
                            {t('viewPricing')}
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center border-t border-white/5 bg-dark">
                <p className="text-slate-500 text-sm">
                    {t('copyright')}
                </p>
            </footer>
        </div>
    );
}
