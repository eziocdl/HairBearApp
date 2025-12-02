'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
    TryOnState,
    ConversationMessage,
    TryOnOption,
    TRYON_OPTIONS,
    POST_RESULT_OPTIONS,
    StyleSuggestions
} from '@/types/tryon';

export default function UltraTryonPage() {
    const t = useTranslations('TryOn');
    const chatAreaRef = useRef<HTMLDivElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const refInputRef = useRef<HTMLInputElement>(null);

    // State
    const [currentState, setCurrentState] = useState<TryOnState>({
        step: 'waiting_photo',
        userPhoto: null,
        referencePhoto: null,
        suggestions: null,
        selectedOption: null,
        selectedStyle: null,
        generatedImages: []
    });

    const [messages, setMessages] = useState<ConversationMessage[]>([
        {
            role: 'assistant',
            content: t('welcome'),
            timestamp: new Date()
        }
    ]);

    const [isLoading, setIsLoading] = useState(false);
    const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

    // Computed
    const showReferenceOption = currentState.step === 'showing_suggestions' || currentState.step === 'waiting_option';

    // Effects
    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const scrollToBottom = () => {
        if (chatAreaRef.current) {
            setTimeout(() => {
                chatAreaRef.current!.scrollTop = chatAreaRef.current!.scrollHeight;
            }, 100);
        }
    };

    // Helpers
    const addMessage = (role: 'assistant' | 'user', content: string, images?: string[]) => {
        setMessages(prev => [...prev, { role, content, images, timestamp: new Date() }]);
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Handlers
    const onPhotoSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await fileToBase64(file);

            setCurrentState(prev => ({ ...prev, userPhoto: base64, step: 'analyzing' }));
            addMessage('user', '📷 [Foto enviada]');
            addMessage('assistant', t('analyzing'));
            setIsLoading(true);

            // Call Analysis API
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 })
            });

            if (!response.ok) throw new Error('Falha na análise');

            const suggestions: StyleSuggestions = await response.json();

            setCurrentState(prev => ({ ...prev, suggestions, step: 'showing_suggestions' }));
            setIsLoading(false);
            showSuggestionsMessage(suggestions);

        } catch (error) {
            console.error(error);
            setIsLoading(false);
            addMessage('assistant', t('errorAnalyzing'));
            setCurrentState(prev => ({ ...prev, step: 'waiting_photo' }));
        }
    };

    const onReferenceSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await fileToBase64(file);
            setCurrentState(prev => ({ ...prev, referencePhoto: base64 }));
            addMessage('user', '📎 [Referência adicionada]');
        } catch (error) {
            console.error(error);
        }
    };

    const showSuggestionsMessage = (suggestions: StyleSuggestions) => {
        const cuts = suggestions.haircuts.map((c, i) => `  ${i + 1}. ${c}`).join('\n');
        const beards = suggestions.beards.map((b, i) => `  ${i + 1}. ${b}`).join('\n');

        addMessage('assistant',
            `${t('basedonAnalysis')}\n\n` +
            `${t('haircuts')}\n${cuts}\n\n` +
            `${t('beards')}\n${beards}\n\n` +
            `${t('whichOption')}\n1 — ${t('optionHaircut')}\n2 — ${t('optionBoth')}\n3 — ${t('optionBeard')}`
        );

        setCurrentState(prev => ({ ...prev, step: 'waiting_option' }));
    };

    const selectOption = (option: TryOnOption) => {
        setCurrentState(prev => ({ ...prev, selectedOption: option }));
        addMessage('user', `${option.code} — ${option.label}`);
        addMessage('assistant', t('whichStyle', { style: option.label.toLowerCase() }));
        setCurrentState(prev => ({ ...prev, step: 'showing_suggestions' }));
    };

    const selectStyle = async (styleName: string, type: 'haircut' | 'beard') => {
        let optionType = currentState.selectedOption?.type || type as any;

        // If user clicked a suggestion directly without selecting option first, infer option
        if (!currentState.selectedOption) {
            // Logic to infer could be complex, for now default to the type clicked
            // But better to force option selection flow or just handle it gracefully
            // For simplicity, let's assume if they click a haircut suggestion, they want haircut tryon
            // If they click beard, beard tryon.
            // If they want combo, they should have selected option 2.
        }

        setCurrentState(prev => ({ ...prev, selectedStyle: styleName, step: 'generating' }));
        addMessage('user', styleName);
        addMessage('assistant', t('generating', { style: styleName }));
        setIsLoading(true);

        try {
            // Parallel requests for 5 variations
            const requests = Array(5).fill(null).map((_, i) => {
                return fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        styleId: styleName,
                        choice: optionType === 'haircut' ? 'Haircut' : (optionType === 'beard' ? 'Beard' : 'Haircut + Beard'),
                        image: currentState.userPhoto,
                        referenceImage: currentState.referencePhoto,
                        variationIndex: i
                    })
                }).then(res => res.json());
            });

            const results = await Promise.all(requests);
            const images = results
                .filter(r => r.success && r.variations?.[0])
                .map(r => r.variations[0]);

            if (images.length === 0) throw new Error('Nenhuma imagem gerada com sucesso');

            setCurrentState(prev => ({ ...prev, generatedImages: images, step: 'post_results' }));
            setIsLoading(false);
            addMessage('assistant', t('hereAreVariations'), images);
            addMessage('assistant', `${t('testAnotherQuestion')}\n1 — ${t('testAnother')}\n2 — ${t('sendOtherPhoto')}\n3 — ${t('finish')}`);

        } catch (error) {
            console.error(error);
            setIsLoading(false);
            addMessage('assistant', t('errorGenerating'));
            setCurrentState(prev => ({ ...prev, step: 'showing_suggestions' }));
        }
    };

    const handlePostResult = (code: number) => {
        const option = POST_RESULT_OPTIONS.find(o => o.code === code);
        addMessage('user', `${code} — ${option?.label}`);

        switch (code) {
            case 1: // Testar outro estilo
                setCurrentState(prev => ({ ...prev, step: 'showing_suggestions', selectedStyle: null }));
                addMessage('assistant', t('whichOption'));
                break;
            case 2: // Enviar outra foto
                resetState();
                addMessage('assistant', t('welcome'));
                break;
            case 3: // Finalizar
                addMessage('assistant', t('finish') + '! 👋');
                break;
        }
    };

    const resetState = () => {
        setCurrentState({
            step: 'waiting_photo',
            userPhoto: null,
            referencePhoto: null,
            suggestions: null,
            selectedOption: null,
            selectedStyle: null,
            generatedImages: []
        });
    };

    const downloadImage = (e: React.MouseEvent, img: string, index: number) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = img;
        link.download = `hairbear-style-${index + 1}.png`;
        link.click();
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
            {/* Header */}
            <header className="p-4 text-center border-b border-white/10 bg-[#1a1a2e]/50 backdrop-blur-md sticky top-0 z-10">
                <h1 className="text-xl font-bold">💇‍♂️ Hair & Beard Try-On</h1>
            </header>

            {/* Chat Area */}
            <div
                ref={chatAreaRef}
                className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth"
            >
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`max-w-[85%] ${msg.role === 'assistant' ? 'self-start' : 'self-end'}`}
                    >
                        <div className={`p-3 whitespace-pre-wrap ${msg.role === 'assistant'
                            ? 'bg-white/10 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl'
                            : 'bg-[#4a6cf7] rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl'
                            }`}>
                            {msg.content}

                            {msg.images && msg.images.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                                    {msg.images.map((img, i) => (
                                        <div
                                            key={i}
                                            className="relative cursor-pointer group aspect-square"
                                            onClick={() => setFullscreenImage(img)}
                                        >
                                            <img
                                                src={img}
                                                alt={`Variation ${i + 1}`}
                                                className="w-full h-full object-cover rounded-lg transition-transform group-hover:scale-105"
                                            />
                                            <button
                                                onClick={(e) => downloadImage(e, img, i)}
                                                className="absolute bottom-1 right-1 bg-black/70 p-1.5 rounded text-xs hover:bg-black/90 transition-colors"
                                            >
                                                ⬇️
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="self-start max-w-[85%]">
                        <div className="bg-white/10 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl p-4 flex gap-2 items-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.32s]"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.16s]"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-[#1a1a2e]/50 backdrop-blur-md">
                {currentState.step === 'waiting_photo' && (
                    <div className="flex gap-4 justify-center">
                        <input
                            type="file"
                            accept="image/*"
                            capture="user"
                            onChange={onPhotoSelected}
                            ref={photoInputRef}
                            hidden
                        />
                        <button
                            onClick={() => photoInputRef.current?.click()}
                            className="px-6 py-3 bg-[#4a6cf7] rounded-xl font-medium hover:scale-105 transition-transform shadow-lg shadow-[#4a6cf7]/20"
                        >
                            {t('takePhoto')}
                        </button>
                        <button
                            onClick={() => photoInputRef.current?.click()} // Same input for now, could separate if needed
                            className="px-6 py-3 bg-white/10 rounded-xl font-medium hover:scale-105 transition-transform border border-white/20"
                        >
                            {t('gallery')}
                        </button>
                    </div>
                )}

                {currentState.step === 'waiting_option' && (
                    <div className="flex flex-wrap gap-2 justify-center">
                        {TRYON_OPTIONS.map(option => (
                            <button
                                key={option.code}
                                onClick={() => selectOption(option)}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-full hover:bg-[#4a6cf7] hover:border-[#4a6cf7] transition-all"
                            >
                                {option.code} — {option.label}
                            </button>
                        ))}
                    </div>
                )}

                {currentState.step === 'showing_suggestions' && (
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm opacity-70 w-full mb-1">Cortes:</span>
                            {currentState.suggestions?.haircuts.map(cut => (
                                <button
                                    key={cut}
                                    onClick={() => selectStyle(cut, 'haircut')}
                                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-[#4a6cf7] hover:border-[#4a6cf7] transition-all"
                                >
                                    {cut}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm opacity-70 w-full mb-1">Barbas:</span>
                            {currentState.suggestions?.beards.map(beard => (
                                <button
                                    key={beard}
                                    onClick={() => selectStyle(beard, 'beard')}
                                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-[#4a6cf7] hover:border-[#4a6cf7] transition-all"
                                >
                                    {beard}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {currentState.step === 'post_results' && (
                    <div className="flex flex-wrap gap-2 justify-center">
                        {POST_RESULT_OPTIONS.map(option => (
                            <button
                                key={option.code}
                                onClick={() => handlePostResult(option.code)}
                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-full hover:bg-[#4a6cf7] hover:border-[#4a6cf7] transition-all"
                            >
                                {option.code} — {option.label}
                            </button>
                        ))}
                    </div>
                )}

                {showReferenceOption && (
                    <div className="mt-4 text-center">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onReferenceSelected}
                            ref={refInputRef}
                            hidden
                        />
                        <button
                            onClick={() => refInputRef.current?.click()}
                            className="text-[#4a6cf7] text-sm underline hover:text-[#4a6cf7]/80"
                        >
                            {t('addReference')}
                        </button>
                        {currentState.referencePhoto && (
                            <span className="ml-2 text-green-400 text-sm">{t('referenceAdded')}</span>
                        )}
                    </div>
                )}
            </div>

            {/* Fullscreen Viewer */}
            {fullscreenImage && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setFullscreenImage(null)}
                >
                    <img
                        src={fullscreenImage}
                        alt="Fullscreen"
                        className="max-w-full max-h-full object-contain"
                    />
                    <button
                        className="absolute top-4 right-4 text-white text-3xl opacity-70 hover:opacity-100"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
}
