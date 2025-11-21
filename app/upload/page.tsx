'use client';

import { motion } from 'framer-motion';
import { Upload, X, CheckCircle, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function UploadPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [validating, setValidating] = useState(false);
    const [validated, setValidated] = useState(false);
    const { setBasePhoto, setCurrentStage } = useAppStore();

    const validateFile = async (file: File): Promise<boolean> => {
        // Validar tamanho
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Arquivo muito grande! Máximo 10MB');
            return false;
        }

        // Validar tipo
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Formato inválido! Use JPEG, PNG ou WebP');
            return false;
        }

        // Validar dimensões
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                if (img.width < 360 || img.height < 480) {
                    toast.error('Imagem muito pequena! Mínimo 360x480px');
                    resolve(false);
                } else {
                    resolve(true);
                }
            };
            img.src = URL.createObjectURL(file);
        });
    };

    const handleFile = async (file: File) => {
        setValidating(true);

        const isValid = await validateFile(file);

        if (isValid) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
                setValidated(true);
                setValidating(false);

                // Converter para Blob
                file.arrayBuffer().then((buffer) => {
                    const blob = new Blob([buffer], { type: file.type });
                    setBasePhoto(blob);
                });

                toast.success('Foto validada com sucesso!');
            };
            reader.readAsDataURL(file);
        } else {
            setValidating(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleContinue = () => {
        setCurrentStage('analysis');
        router.push('/analysis');
    };

    const handleCancel = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="p-6 flex items-center justify-between border-b border-white/10">
                <h1 className="text-xl font-bold text-white">Enviar Foto</h1>
                <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full space-y-6"
                >
                    {!preview ? (
                        <>
                            {/* Drag & Drop Zone */}
                            <Card
                                className={`relative border-2 border-dashed transition-all duration-300 ${dragActive
                                        ? 'border-primary bg-primary/10'
                                        : 'border-slate-600 hover:border-slate-500'
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <div className="text-center space-y-4 py-12">
                                    <div className="flex justify-center">
                                        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                                            <Upload className="w-10 h-10 text-primary" />
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            Arraste sua foto aqui
                                        </h3>
                                        <p className="text-slate-400">
                                            ou clique para selecionar
                                        </p>
                                    </div>

                                    <div className="text-sm text-slate-500 space-y-1">
                                        <p>✓ JPEG, PNG ou WebP</p>
                                        <p>✓ Máximo 10MB</p>
                                        <p>✓ Mínimo 360x480px</p>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </div>
                            </Card>

                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                icon={<ImageIcon className="w-6 h-6" />}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                SELECIONAR FOTO
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* Preview */}
                            <Card className="relative">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-64 object-cover rounded-lg"
                                        />

                                        {validated && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute top-2 right-2 bg-primary rounded-full p-2"
                                            >
                                                <CheckCircle className="w-6 h-6 text-white" />
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/30 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                        <div className="text-sm">
                                            <p className="font-semibold text-white">Foto validada!</p>
                                            <p className="text-slate-300">Pronta para análise</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <div className="space-y-3">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    onClick={handleContinue}
                                >
                                    CONTINUAR
                                </Button>

                                <Button
                                    variant="secondary"
                                    size="md"
                                    fullWidth
                                    onClick={() => {
                                        setPreview(null);
                                        setValidated(false);
                                    }}
                                >
                                    Trocar Foto
                                </Button>
                            </div>
                        </>
                    )}

                    {validating && (
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 text-primary">
                                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                <span>Validando imagem...</span>
                            </div>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
