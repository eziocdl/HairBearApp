'use client';

import { Check, Star, Zap, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useRouter } from '@/lib/navigation';
import { useTranslations } from 'next-intl';



export default function PricingPage() {
    const router = useRouter();
    const t = useTranslations('pricingPage');

    const plans = [
        {
            name: t('basic'),
            price: t('basicPrice'),
            description: t('basicDesc'),
            features: [t('basicFeature1'), t('basicFeature2'), t('basicFeature3'), t('basicFeature4')],
            cta: t('basicCta'),
            popular: false,
        },
        {
            name: t('pro'),
            price: t('proPrice'),
            period: t('proPeriod'),
            description: t('proDesc'),
            features: [t('proFeature1'), t('proFeature2'), t('proFeature3'), t('proFeature4'), t('proFeature5')],
            cta: t('proCta'),
            popular: true,
        },
        {
            name: t('barber'),
            price: t('barberPrice'),
            period: t('barberPeriod'),
            description: t('barberDesc'),
            features: [t('barberFeature1'), t('barberFeature2'), t('barberFeature3'), t('barberFeature4'), t('barberFeature5')],
            cta: t('barberCta'),
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-dark text-white">
            {/* Header */}
            <header className="py-12 md:py-20 px-6 text-center space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
                <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tight">
                    {t('mainTitle')} <span className="text-primary">{t('mainTitleHighlight')}</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>
            </header>

            {/* Pricing Cards */}
            <main className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`
                relative p-8 rounded-3xl border flex flex-col
                ${plan.popular
                                    ? 'bg-white/10 border-primary shadow-2xl shadow-primary/20 md:scale-105 z-10'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10 transition-colors'
                                }
              `}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-dark font-bold px-4 py-1 rounded-full text-sm">
                                    {t('mostPopular')}
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    {plan.period && <span className="text-slate-400">{plan.period}</span>}
                                </div>
                                <p className="text-slate-400 mt-4">{plan.description}</p>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-slate-300">
                                        <div className={`p-1 rounded-full ${plan.popular ? 'bg-primary/20 text-primary' : 'bg-white/10 text-slate-400'}`}>
                                            <Check className="w-4 h-4" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.popular ? 'primary' : 'secondary'}
                                fullWidth
                                onClick={() => router.push('/signup')} // Placeholder route
                            >
                                {plan.cta}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Features Grid */}
                <div className="mt-16 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">{t('fastProcessing')}</h3>
                        <p className="text-slate-400">
                            {t('fastProcessingDesc')}
                        </p>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                            <Star className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">{t('photorealistic')}</h3>
                        <p className="text-slate-400">
                            {t('photorealisticDesc')}
                        </p>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                            <Shield className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">{t('totalPrivacy')}</h3>
                        <p className="text-slate-400">
                            {t('totalPrivacyDesc')}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
