import { HAIRCUT_STYLES, BEARD_STYLES } from './mocks/styles';

// Tipos
export interface Style {
    id: string;
    name: string;
    description: string;
    image: string;
    category: 'haircut' | 'beard';
}

export interface AnalysisResult {
    status: 'success' | 'error';
    message: string;
    data?: {
        faceShape: string;
        recommendations: string[];
    };
}

// Helper para simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Service para buscar estilos disponíveis
 * GET /api/styles
 */
export const stylesService = {
    getHaircuts: async (): Promise<Style[]> => {
        await delay(800); // Simula latência
        return HAIRCUT_STYLES as Style[];
    },

    getBeards: async (): Promise<Style[]> => {
        await delay(800);
        return BEARD_STYLES as Style[];
    },

    getAll: async (): Promise<Style[]> => {
        await delay(1000);
        return [...HAIRCUT_STYLES, ...BEARD_STYLES] as Style[];
    },

    generateVariations: async (styleId: string, choice: 'haircut' | 'haircut_beard' | 'beard', image?: string): Promise<string[]> => {
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    styleId,
                    choice,
                    image // Agora passamos a imagem real (base64)
                }),
            });

            if (!response.ok) {
                throw new Error('Falha na requisição à API');
            }

            const data = await response.json();
            return data.variations;
        } catch (error) {
            console.error('Erro no service generateVariations:', error);
            throw error;
        }
    }
};

/**
 * Service para análise de imagem
 * POST /api/analyze
 */
export const analysisService = {
    analyzePhoto: async (photo: Blob): Promise<AnalysisResult> => {
        try {
            // Se não tiver chave, usa o mock (fallback)
            // Nota: Em produção real, isso deve ser tratado no backend para não expor a chave,
            // mas para este MVP híbrido client-side, verificamos aqui.
            // Como estamos no client, não temos acesso direto a process.env.GOOGLE_API_KEY se não for prefixado com NEXT_PUBLIC_
            // Vamos mover essa lógica para uma Server Action ou API Route para segurança.

            // Por enquanto, vamos chamar uma nova rota de API para análise
            const formData = new FormData();
            formData.append('image', photo);

            const response = await fetch('/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Falha na análise da imagem');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro na análise:', error);
            // Fallback para mock em caso de erro (para não travar o app)
            await delay(2000);
            return {
                status: 'success',
                message: 'Análise concluída (Modo Offline)',
                data: {
                    faceShape: 'Oval',
                    recommendations: ['pompadour', 'fade']
                }
            };
        }
    }
};
