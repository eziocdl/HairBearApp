'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ScanFace, Sparkles, BrainCircuit, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/lib/store';

export default function AnalysisPage() {
    const router = useRouter();
    const t = useTranslations('analysisPage');
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(1);
    const { basePhoto, setCurrentStage } = useAppStore();

    useEffect(() => {
        if (!basePhoto) {
            router.push('/');
            return;
        }

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => {
                        setCurrentStage('suggestions');
                        router.push('/suggestions');
                    }, 1000);
                    return 100;
                }
                return prev + 2;
            });
        }, 150); // Acelerado para demo

        return () => clearInterval(progressInterval);
    }, [basePhoto, router, setCurrentStage]);

    useEffect(() => {
        if (progress >= 40 && currentStep === 1) setCurrentStep(2);
        else if (progress >= 70 && currentStep === 2) setCurrentStep(3);
    }, [progress, currentStep]);

    const steps = [
        { id: 1, label: t('faceMapping'), icon: ScanFace, progress: 40 },
        { id: 2, label: t('geometryAnalysis'), icon: BrainCircuit, progress: 70 },
        { id: 3, label: t('generatingSuggestions'), icon: Sparkles, progress: 100 },
    ];


    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-dark">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-white">
                        {t('title')}
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {t('description')}
                    </p>
                </div>

                {/* Preview Circular */}
                {basePhoto && (
                    <div className="flex justify-center relative">
                        <div className="relative w-32 h-32">
                            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-slow" />
                            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
                            <div className="absolute inset-2 rounded-full overflow-hidden bg-slate-800">
                                <img
                                    src={URL.createObjectURL(basePhoto)}
                                    alt="Preview"
                                    className="w-full h-full object-cover opacity-80"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Card */}
                <Card className="space-y-6 border-white/5 bg-white/5">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium uppercase tracking-wider text-slate-400">
                            <span>{t('progress')}</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "linear" }}
                            />
                        </div>
                    </div>

                    {/* Steps List */}
                    <div className="space-y-4">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div
                                    key={step.id}
                                    className={`flex items-center gap-4 transition-colors duration-300 ${isActive || isCompleted ? 'opacity-100' : 'opacity-40'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${isCompleted
                                        ? 'bg-primary border-primary text-white'
                                        : isActive
                                            ? 'border-primary text-primary'
                                            : 'border-slate-600 text-slate-600'
                                        }`}>
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-4 h-4" />
                                        ) : isActive ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <span className="text-xs">{step.id}</span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <p className={`text-sm font-medium ${isActive || isCompleted ? 'text-white' : 'text-slate-500'
                                            }`}>
                                            {step.label}
                                        </p>
                                    </div>

                                    <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-slate-600'
                                        }`} />
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
