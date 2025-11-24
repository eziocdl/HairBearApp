'use client';

import { motion } from 'framer-motion';
import { Star, TrendingUp, X, Scissors, User, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';
import { stylesService, Style } from '@/services/api';

export default function SuggestionsPage() {
    const router = useRouter();
    const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState<'haircut' | 'haircut_beard' | 'beard'>('haircut_beard');
    const { setSelectedStyle, setSelectedChoice: setStoreChoice, setCurrentStage } = useAppStore();

    // Fetch Haircuts
    const { data: haircuts, isLoading: isLoadingHaircuts } = useQuery({
        queryKey: ['styles', 'haircut'],
        queryFn: stylesService.getHaircuts
    });

    // Fetch Beards
    const { data: beards, isLoading: isLoadingBeards } = useQuery({
        queryKey: ['styles', 'beard'],
        queryFn: stylesService.getBeards
    });

    const handleStyleClick = (styleId: string) => {
        setSelectedStyleId(styleId);
        setShowModal(true);
    };

    const handleConfirm = () => {
        if (!selectedStyleId) return;
        setSelectedStyle(selectedStyleId);
        setStoreChoice(selectedChoice);
        setCurrentStage('results');
        setShowModal(false);
        toast.success('Gerando seu novo visual...');
        router.push('/results');
    };

    const StyleCard = ({ style }: { style: Style }) => (
        <Card
            hoverable
            onClick={() => handleStyleClick(style.id)}
            className="relative overflow-hidden group border-white/5 bg-white/5 hover:border-primary/50 transition-colors"
        >
            <div className="space-y-4">
                {/* Placeholder Image Area */}
                <div className="w-full aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    {style.category === 'haircut' ? (
                        <Scissors className="w-12 h-12 text-slate-600 group-hover:text-primary transition-colors" />
                    ) : (
                        <User className="w-12 h-12 text-slate-600 group-hover:text-primary transition-colors" />
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-white text-base">{style.name}</h3>
                        <div className="flex items-center gap-1 bg-black/30 px-1.5 py-0.5 rounded">
                            <Star className="w-3 h-3 fill-accent text-accent" />
                            <span className="text-xs font-medium text-white">4.8</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-400">{style.description}</p>
                </div>

                <Button variant="outline" size="sm" fullWidth className="text-xs py-2">
                    Visualizar
                </Button>
            </div>
        </Card>
    );

    const LoadingSkeleton = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white/5 rounded-xl p-4 space-y-4 animate-pulse">
                    <div className="w-full aspect-square bg-white/10 rounded-lg" />
                    <div className="space-y-2">
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen pb-20 bg-dark">
            <header className="sticky top-0 z-10 p-6 bg-dark/90 backdrop-blur-lg border-b border-white/5">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-xl font-bold text-white">
                        Sugestões para Você
                    </h1>
                    <p className="text-sm text-slate-400">
                        Baseado na análise do seu rosto
                    </p>
                </div>
            </header>

            <main className="p-6">
                <div className="max-w-6xl mx-auto space-y-10">
                    <section>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Scissors className="w-4 h-4" /> Cortes Recomendados
                        </h2>
                        {isLoadingHaircuts ? (
                            <LoadingSkeleton />
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {haircuts?.map((style) => (
                                    <StyleCard key={style.id} style={style} />
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <User className="w-4 h-4" /> Estilos de Barba
                        </h2>
                        {isLoadingBeards ? (
                            <LoadingSkeleton />
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                {beards?.map((style) => (
                                    <StyleCard key={style.id} style={style} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Modal de Escolha */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-sm"
                    >
                        <Card className="space-y-6 border-white/10 bg-dark-lighter">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h3 className="text-lg font-bold text-white">
                                    Personalizar Visualização
                                </h3>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { id: 'haircut', label: 'Apenas Corte' },
                                    { id: 'haircut_beard', label: 'Corte + Barba', recommended: true },
                                    { id: 'beard', label: 'Apenas Barba' }
                                ].map((option) => (
                                    <label
                                        key={option.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all ${selectedChoice === option.id
                                            ? 'bg-primary/10 border-primary'
                                            : 'bg-white/5 border-transparent hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedChoice === option.id ? 'border-primary' : 'border-slate-500'
                                                }`}>
                                                {selectedChoice === option.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                                            </div>
                                            <div>
                                                <span className={`block text-sm font-medium ${selectedChoice === option.id ? 'text-white' : 'text-slate-300'
                                                    }`}>
                                                    {option.label}
                                                </span>
                                            </div>
                                        </div>
                                        {option.recommended && (
                                            <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                                                RECOMENDADO
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>

                            <Button variant="primary" size="lg" fullWidth onClick={handleConfirm}>
                                Gerar Resultado
                            </Button>
                        </Card>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
