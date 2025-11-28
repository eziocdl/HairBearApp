'use client';

import { motion } from 'framer-motion';
import { Camera, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from '@/lib/navigation';
import { useTranslations } from 'next-intl';
import Button from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';
import { toast } from 'sonner';

export default function CameraPage() {
    const router = useRouter();
    const t = useTranslations('cameraPage');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [faceDetected, setFaceDetected] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [capturing, setCapturing] = useState(false);
    const { setBasePhoto, setCurrentStage } = useAppStore();

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            // Simular detecção de rosto após 2 segundos
            setTimeout(() => {
                setFaceDetected(true);
                setFeedback(t('perfect'));
            }, 2000);

        } catch (error) {
            console.error('Erro ao acessar câmera:', error);
            toast.error(t('errorCamera'));
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };


    useEffect(() => {
        setFeedback(t('positionFace'));
        startCamera();
        return () => {
            stopCamera();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const capturePhoto = async () => {
        if (!videoRef.current || !canvasRef.current) return;

        setCapturing(true);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
            if (blob) {
                setBasePhoto(blob);
                stopCamera();
                setCurrentStage('analysis');
                toast.success(t('photoSuccess'));
                router.push('/analysis');
            }
        }, 'image/jpeg', 0.9);
    };

    const handleCancel = () => {
        stopCamera();
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-black">
            {/* Header */}
            <header className="p-4 flex items-center justify-between bg-dark/80 backdrop-blur-lg">
                <h1 className="text-lg font-semibold text-white">{t('title')}</h1>
                <button
                    onClick={handleCancel}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <X className="w-6 h-6 text-white" />
                </button>
            </header>

            {/* Camera View */}
            <main className="flex-1 relative flex items-center justify-center">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                />

                {/* Face Detection Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative"
                    >
                        <div
                            className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-4 ${faceDetected ? 'border-primary' : 'border-white/30'
                                } transition-colors duration-300`}
                            style={{
                                boxShadow: faceDetected
                                    ? '0 0 40px rgba(16, 185, 129, 0.5)'
                                    : '0 0 20px rgba(255, 255, 255, 0.2)',
                            }}
                        />

                        {faceDetected && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-4 -right-4 bg-primary rounded-full p-2"
                            >
                                <CheckCircle className="w-6 h-6 text-white" />
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Feedback */}
                <div className="absolute top-8 left-0 right-0 flex justify-center">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-dark/80 backdrop-blur-lg px-6 py-3 rounded-full flex items-center gap-2"
                    >
                        {faceDetected ? (
                            <CheckCircle className="w-5 h-5 text-primary" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                        )}
                        <span className="text-white font-medium">{feedback}</span>
                    </motion.div>
                </div>

                {/* Hidden Canvas */}
                <canvas ref={canvasRef} className="hidden" />
            </main>

            {/* Controls */}
            <div className="p-6 bg-dark/80 backdrop-blur-lg">
                <div className="max-w-md mx-auto space-y-4">
                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        icon={<Camera className="w-6 h-6" />}
                        onClick={capturePhoto}
                        disabled={!faceDetected || capturing}
                        loading={capturing}
                    >
                        {capturing ? t('capturing') : t('capturePhoto')}
                    </Button>

                    <p className="text-center text-sm text-slate-400">
                        {t('tip')}
                    </p>
                </div>
            </div>
        </div>
    );
}
