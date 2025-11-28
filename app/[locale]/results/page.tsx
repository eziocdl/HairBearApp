'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Share2, Download, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';

export default function ResultsPage() {
    const router = useRouter();
    const t = useTranslations('resultsPage');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [liked, setLiked] = useState(false);
    const { selectedStyle, reset } = useAppStore();

    // Mock Results (usando cores sólidas para simular fotos diferentes)
    const results = [
        { id: 1, quality: 98, fidelity: 100, color: 'bg-slate-800' },
        { id: 2, quality: 95, fidelity: 98, color: 'bg-slate-700' },
        { id: 3, quality: 92, fidelity: 95, color: 'bg-slate-900' },
        { id: 4, quality: 96, fidelity: 97, color: 'bg-gray-800' },
        { id: 5, quality: 94, fidelity: 99, color: 'bg-zinc-800' },
    ];

    const currentResult = results[currentIndex];

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === results.length - 1 ? 0 : prev + 1));
    };

    const handlePrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? results.length - 1 : prev - 1));
    };

    return (
        <div className="min-h-screen flex flex-col bg-dark">
            <header className="p-4 border-b border-white/5 flex justify-between items-center bg-dark/90 backdrop-blur-md sticky top-0 z-20">
                <div>
                    <h1 className="text-lg font-bold text-white">{t('title')}</h1>
                    <p className="text-xs text-slate-400">{selectedStyle || t('customStyle')}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => router.push('/suggestions')}>
                    <RotateCcw className="w-4 h-4 mr-2" /> {t('tryAnother')}
                </Button>
            </header>

            <main className="flex-1 p-4 flex flex-col max-w-lg mx-auto w-full">
                {/* Main Image Carousel */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black mb-6 group">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`absolute inset-0 ${currentResult.color} flex items-center justify-center`}
                        >
                            {/* Placeholder for Generated Image */}
                            <div className="text-center opacity-20">
                                <span className="text-6xl font-bold text-white">{t('photo')} {currentIndex + 1}</span>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Overlay */}
                    <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={handlePrevious} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button onClick={handleNext} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {results.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/40'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Metrics & Actions */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                            <span className="text-xs text-slate-400 uppercase tracking-wider">{t('realism')}</span>
                            <span className="text-sm font-bold text-emerald-400">{currentResult.quality}%</span>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                            <span className="text-xs text-slate-400 uppercase tracking-wider">{t('fidelity')}</span>
                            <span className="text-sm font-bold text-emerald-400">{currentResult.fidelity}%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <Button
                            variant={liked ? "primary" : "secondary"}
                            onClick={() => setLiked(!liked)}
                            className="flex flex-col gap-1 h-auto py-3"
                        >
                            <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
                            <span className="text-[10px]">{t('save')}</span>
                        </Button>
                        <Button variant="secondary" className="flex flex-col gap-1 h-auto py-3">
                            <Share2 className="w-5 h-5" />
                            <span className="text-[10px]">{t('share')}</span>
                        </Button>
                        <Button variant="secondary" className="flex flex-col gap-1 h-auto py-3">
                            <Download className="w-5 h-5" />
                            <span className="text-[10px]">{t('downloadHD')}</span>
                        </Button>
                    </div>

                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={() => {
                            reset();
                            router.push('/');
                        }}
                    >
                        {t('finishExperience')}
                    </Button>
                </div>
            </main>
        </div>
    );
}
