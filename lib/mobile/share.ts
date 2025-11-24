/**
 * Mobile Share Wrapper
 * Abstração que funciona tanto em Web quanto em Mobile (Capacitor)
 */

import { isNativePlatform } from './camera';

export interface ShareOptions {
    title?: string;
    text?: string;
    url?: string;
    files?: File[];
}

/**
 * Compartilha conteúdo
 * Funciona em Web (Web Share API) e Mobile (Capacitor)
 */
export async function share(options: ShareOptions): Promise<boolean> {
    try {
        if (isNativePlatform()) {
            // Mobile: Usar Capacitor Share
            const { Share } = await import('@capacitor/share');

            await Share.share({
                title: options.title || 'HairBearApp',
                text: options.text || 'Confira meu novo visual!',
                url: options.url,
                dialogTitle: 'Compartilhar',
            });

            return true;
        } else {
            // Web: Usar Web Share API (se disponível)
            if (navigator.share) {
                const shareData: any = {
                    title: options.title,
                    text: options.text,
                    url: options.url,
                };

                // Web Share API Level 2 suporta files
                if (options.files && options.files.length > 0) {
                    shareData.files = options.files;
                }

                await navigator.share(shareData);
                return true;
            } else {
                // Fallback: copiar URL para clipboard
                if (options.url && navigator.clipboard) {
                    await navigator.clipboard.writeText(options.url);
                    console.log('URL copiada para clipboard');
                    return true;
                }

                console.warn('Web Share API não disponível');
                return false;
            }
        }
    } catch (error: any) {
        // Usuário cancelou compartilhamento
        if (error.name === 'AbortError') {
            console.log('Compartilhamento cancelado');
            return false;
        }

        console.error('Erro ao compartilhar:', error);
        return false;
    }
}

/**
 * Compartilha imagem
 */
export async function shareImage(imageUrl: string, title: string = 'Meu novo visual'): Promise<boolean> {
    try {
        // Em mobile, pode compartilhar URL direto
        if (isNativePlatform()) {
            return await share({
                title,
                text: 'Confira meu novo visual no HairBearApp! 💈✂️',
                url: imageUrl,
            });
        }

        // Em web, tentar compartilhar como arquivo
        if (typeof navigator !== 'undefined' && 'share' in navigator) {
            // Buscar imagem e converter para File
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'hairbear-result.jpg', { type: 'image/jpeg' });

            return await share({
                title,
                text: 'Confira meu novo visual no HairBearApp! 💈✂️',
                files: [file],
            });
        }

        // Fallback: abrir em nova aba
        if (typeof window !== 'undefined') {
            window.open(imageUrl, '_blank');
        }
        return true;
    } catch (error) {
        console.error('Erro ao compartilhar imagem:', error);
        return false;
    }
}

/**
 * Verifica se sharing está disponível
 */
export function canShare(): boolean {
    if (isNativePlatform()) {
        return true; // Capacitor sempre suporta
    }

    return !!(navigator.share || navigator.clipboard);
}
