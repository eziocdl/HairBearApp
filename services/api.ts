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
    }
};

/**
 * Service para análise de imagem
 * POST /api/analyze
 */
export const analysisService = {
    analyzePhoto: async (photo: Blob): Promise<AnalysisResult> => {
        await delay(3000); // Simula processamento pesado de IA

        // Simula sucesso (90%) ou erro (10%)
        const isSuccess = Math.random() > 0.1;

        if (isSuccess) {
            return {
                status: 'success',
                message: 'Análise concluída com sucesso',
                data: {
                    faceShape: 'Oval',
                    recommendations: ['pompadour', 'fade']
                }
            };
        } else {
            throw new Error('Falha ao detectar rosto na imagem');
        }
    }
};
