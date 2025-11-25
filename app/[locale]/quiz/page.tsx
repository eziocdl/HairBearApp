'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import { ChevronRight, ChevronLeft, Check, User, Scissors, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';



export default function QuizPage() {
    const router = useRouter();
    const t = useTranslations('quizPage');
    const { setQuizResults, setCurrentStage } = useAppStore();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const questions = [
        {
            id: 'stylePreference',
            title: t('styleQuestion'),
            description: t('styleDescription'),
            options: [
                {
                    id: 'classic',
                    label: t('classic'),
                    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop',
                    description: t('classicDesc')
                },
                {
                    id: 'modern',
                    label: t('modern'),
                    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1976&auto=format&fit=crop',
                    description: t('modernDesc')
                },
                {
                    id: 'bold',
                    label: t('bold'),
                    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop',
                    description: t('boldDesc')
                },
            ],
        },
    ];

    const currentQuestion = questions[step];

    const handleOptionSelect = (optionId: string) => {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
    };

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            // Finish quiz
            setQuizResults({
                faceShape: null, // AI will detect this
                hairType: answers.hairType || null,
                stylePreference: answers.stylePreference || null,
            });
            // Redirect to camera or upload
            setCurrentStage('camera'); // Or maybe a dedicated results page first? Let's go to camera for now as "Action"
            router.push('/camera');
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        } else {
            router.back();
        }
    };

    return (
        <div className="min-h-screen bg-dark flex flex-col">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/5">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 max-w-2xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full space-y-8"
                    >
                        <div className="space-y-2 text-center">
                            <span className="text-primary text-sm font-bold tracking-wider uppercase">
                                {t('step')} {step + 1} {t('of')} {questions.length}
                            </span>
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                {currentQuestion.title}
                            </h1>
                            <p className="text-slate-400 text-lg">
                                {currentQuestion.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {currentQuestion.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionSelect(option.id)}
                                    className={`
                                        relative group overflow-hidden rounded-2xl border-2 text-left transition-all duration-300 aspect-[3/4]
                                        ${answers[currentQuestion.id] === option.id
                                            ? 'border-primary ring-2 ring-primary/50 ring-offset-2 ring-offset-dark'
                                            : 'border-white/10 hover:border-white/30'
                                        }
                                    `}
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={option.image}
                                            alt={option.label}
                                            className={`w-full h-full object-cover transition-transform duration-700 ${answers[currentQuestion.id] === option.id ? 'scale-110' : 'group-hover:scale-110'
                                                }`}
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent transition-opacity duration-300 ${answers[currentQuestion.id] === option.id ? 'opacity-90' : 'opacity-60 group-hover:opacity-80'
                                            }`} />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-2xl font-bold ${answers[currentQuestion.id] === option.id ? 'text-primary' : 'text-white'
                                                }`}>
                                                {option.label}
                                            </span>
                                            {answers[currentQuestion.id] === option.id && (
                                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
                                                    <Check className="w-5 h-5 text-dark" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-300 font-medium">
                                            {option.description}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between w-full mt-12 pt-6 border-t border-white/10">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        {t('back')}
                    </button>

                    <Button
                        variant="primary"
                        onClick={handleNext}
                        disabled={!answers[currentQuestion.id]}
                        icon={<ChevronRight className="w-5 h-5" />}
                    >
                        {step === questions.length - 1 ? t('viewResults') : t('next')}
                    </Button>
                </div>
            </main>
        </div>
    );
}
