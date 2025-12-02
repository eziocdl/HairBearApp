export interface StyleSuggestions {
    haircuts: string[];      // 5 sugestões de cortes
    beards: string[];        // 5 sugestões de barbas
}

export type AnalysisChoice = 'haircut' | 'beard' | 'haircut_beard';

export interface TryOnOption {
    type: 'haircut' | 'haircut_beard' | 'beard';
    code: 1 | 2 | 3;
    label: string;
}

export interface ConversationMessage {
    role: 'assistant' | 'user';
    content: string;
    images?: string[];       // Base64 das imagens geradas
    timestamp: Date;
}

export interface TryOnState {
    step: 'waiting_photo' | 'analyzing' | 'showing_suggestions' |
    'waiting_option' | 'generating' | 'showing_results' | 'post_results';
    userPhoto: string | null;
    referencePhoto: string | null;
    suggestions: StyleSuggestions | null;
    selectedOption: TryOnOption | null;
    selectedStyle: string | null;
    generatedImages: string[];
}

export const TRYON_OPTIONS: TryOnOption[] = [
    { type: 'haircut', code: 1, label: 'Corte' },
    { type: 'haircut_beard', code: 2, label: 'Corte + Barba' },
    { type: 'beard', code: 3, label: 'Barba' }
];

export const POST_RESULT_OPTIONS = [
    { code: 1, label: 'Sim, testar outro estilo' },
    { code: 2, label: 'Enviar outra foto' },
    { code: 3, label: 'Finalizar' }
];
