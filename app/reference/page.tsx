'use client';

import { motion } from 'framer-motion';
import { Camera, Upload, X, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function ReferencePage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [basePreview, setBasePreview] = useState<string | null>(null);
    const [referencePreview, setReferencePreview] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const referenceInputRef = useRef<HTMLInputElement>(null);
    const { setBasePhoto, setReferencePhoto, setCurrentStage } = useAppStore();

    const handleBasePhotoUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setBasePreview(e.target?.result as string);
            file.arrayBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: file.type });
                setBasePhoto(blob);
            });
            toast.success('Foto base carregada!');
            setCurrentStep(2);
        };
        reader.readAsDataURL(file);
    };

    const handleReferencePhotoUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            setReferencePreview(e.target?.result as string);
            file.arrayBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: file.type });
                setReferencePhoto(blob);
            });
            toast.success('Foto de referência carregada!');
            setCurrentStep(3);
        };
        reader.readAsDataURL(file);
    };

    const handleProcess = () => {
        if (!confirmed) {
            toast.error('Por favor, confirme os uploads');
            return;
        }

        setCurrentStage('results');
        toast.success('Processando com referência...');
        router.push('/results');
    };

    const handleCancel = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="p-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-4">
                    {currentStep > 1 && (
                        <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                    )}
                    <div>
                        <h1 className="text-xl font-bold text-white">Usar Referência</h1>
                        <p className="text-sm text-slate-400">Etapa {currentStep}/3</p>
                    </div>
                </div>
                <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>
            </header>

            {/* Progress Indicator */}
            <div className="px-6 py-4 bg-dark-lighter/50">
                <div className="max-w-md mx-auto flex items-center justify-center gap-2">
                    {[1, 2, 3].map((step) => (
                        <div
                            key={step}
                            className={`h-2 flex-1 rounded-full transition-all ${step === currentStep
                                    ? 'bg-primary'
                                    : step < currentStep
                                        ? 'bg-primary/50'
                                        : 'bg-slate-700'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-md w-full space-y-6"
                >
                    {/* Step 1 - Base Photo */}
                    {currentStep === 1 && (
                        <>
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-white">
                                    ETAPA 1/3 — FOTO BASE
                                </h2>
                                <p className="text-slate-400">
                                    Tire uma foto sua ou escolha da galeria
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    icon={<Camera className="w-6 h-6" />}
                                    onClick={() => router.push('/camera')}
                                >
                                    USAR CÂMERA
                                </Button>

                                <Button
                                    variant="secondary"
                                    size="lg"
                                    fullWidth
                                    icon={<Upload className="w-6 h-6" />}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    ESCOLHER DA GALERIA
                                </Button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleBasePhotoUpload(e.target.files[0])}
                                    className="hidden"
                                />
                            </div>
                        </>
                    )}

                    {/* Step 2 - Reference Photo */}
                    {currentStep === 2 && (
                        <>
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-white">
                                    ETAPA 2/3 — REFERÊNCIA
                                </h2>
                                <p className="text-slate-400">
                                    Envie imagem de referência (corte ou barba que quer)
                                </p>
                            </div>

                            {basePreview && (
                                <Card>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={basePreview}
                                            alt="Base"
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">Sua foto</p>
                                            <p className="text-xs text-slate-400">Carregada ✓</p>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    </div>
                                </Card>
                            )}

                            <Card
                                className="border-2 border-dashed border-slate-600 hover:border-primary transition-colors cursor-pointer"
                                onClick={() => referenceInputRef.current?.click()}
                            >
                                <div className="text-center space-y-3 py-8">
                                    <div className="flex justify-center">
                                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                                            <Upload className="w-8 h-8 text-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Upload Referência</p>
                                        <p className="text-sm text-slate-400">Frontal ou lateral OK</p>
                                    </div>
                                </div>
                            </Card>

                            <input
                                ref={referenceInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleReferencePhotoUpload(e.target.files[0])}
                                className="hidden"
                            />

                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                <p className="text-sm text-blue-300">
                                    ℹ️ <strong>Dica:</strong> Escolha uma foto clara do corte/barba que deseja
                                </p>
                            </div>
                        </>
                    )}

                    {/* Step 3 - Confirm */}
                    {currentStep === 3 && (
                        <>
                            <div className="text-center space-y-2">
                                <h2 className="text-2xl font-bold text-white">
                                    ETAPA 3/3 — CONFIRMAR
                                </h2>
                                <p className="text-slate-400">
                                    Suas fotos estão prontas
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Base Photo */}
                                <Card>
                                    <div className="space-y-3">
                                        {basePreview && (
                                            <img
                                                src={basePreview}
                                                alt="Sua foto"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="text-center">
                                            <p className="font-semibold text-white">Sua Foto</p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setCurrentStep(1)}
                                            >
                                                Trocar
                                            </Button>
                                        </div>
                                    </div>
                                </Card>

                                {/* Reference Photo */}
                                <Card>
                                    <div className="space-y-3">
                                        {referencePreview && (
                                            <img
                                                src={referencePreview}
                                                alt="Referência"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                        )}
                                        <div className="text-center">
                                            <p className="font-semibold text-white">Referência</p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setCurrentStep(2)}
                                            >
                                                Trocar
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <Card className="bg-primary/10 border-primary/30">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={confirmed}
                                        onChange={(e) => setConfirmed(e.target.checked)}
                                        className="w-5 h-5 rounded text-primary"
                                    />
                                    <span className="text-white font-medium">
                                        Confirmo os uploads e quero processar
                                    </span>
                                </label>
                            </Card>

                            <div className="space-y-3">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    onClick={handleProcess}
                                    disabled={!confirmed}
                                >
                                    PROCESSAR
                                </Button>

                                <Button
                                    variant="secondary"
                                    size="md"
                                    fullWidth
                                    onClick={handleCancel}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
