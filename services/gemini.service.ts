import { GoogleGenAI, type GenerateContentResponse } from '@google/genai';
import { getGeminiApiKey } from '../lib/env';
import type {
  GeminiMessage,
  FileValidationResult,
  AudioFileConstraints,
  ImageFileConstraints,
  GenerateContentOptions,
  TranscribeAudioOptions,
  GenerateImageOptions,
  GeminiError,
} from './types/gemini.types';

class GeminiService {
  private readonly genAI: GoogleGenAI;
  private systemInstruction: string = '';

  // File constraints
  private readonly audioConstraints: AudioFileConstraints = {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/webm', 'audio/ogg']
  };

  private readonly imageConstraints: ImageFileConstraints = {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/heic', 'image/heif']
  };

  constructor() {
    const apiKey = getGeminiApiKey();
    this.genAI = new GoogleGenAI({ apiKey });
    this.loadSystemInstruction();
  }

  private async loadSystemInstruction(): Promise<void> {
    try {
      const response = await fetch('/system-instruction.md');
      if (response.ok) {
        this.systemInstruction = await response.text();
      } else {
        console.warn('Não foi possível carregar system-instruction.md');
      }
    } catch (error) {
      console.warn('Erro ao carregar system-instruction.md:', error);
    }
  }

  async generateContent(
    prompt: string,
    options: GenerateContentOptions = {}
  ): Promise<string> {
    try {
      const model = options.model || 'gemini-2.0-flash';
      const systemInstruction = options.systemInstruction || this.systemInstruction;

      const response = await this.genAI.models.generateContent({
        model,
        contents: prompt,
        ...(systemInstruction && { config: { systemInstruction } })
      });

      return this.extractTextFromResponse(response);
    } catch (error) {
      throw this.handleError(error, 'generateContent');
    }
  }

  async transcribeAudio(
    file: File,
    options: TranscribeAudioOptions = {}
  ): Promise<string> {
    // Validar arquivo
    const validation = this.validateAudioFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    try {
      const base64Audio = await this.fileToBase64(file);
      const prompt = options.prompt || 
        "Transcreva este áudio para texto em português brasileiro. Retorne APENAS o texto falado, sem marcações, títulos, formatações ou comentários extras. Seja natural e corrido:";

      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          prompt,
          {
            inlineData: {
              mimeType: file.type,
              data: base64Audio
            }
          }
        ]
      });

      const rawTranscription = this.extractTextFromResponse(response);
      return this.cleanTranscriptionText(rawTranscription);
    } catch (error) {
      throw this.handleError(error, 'transcribeAudio');
    }
  }

  async generateImage(
    prompt: string,
    options: GenerateImageOptions = {}
  ): Promise<string> {
    try {
      if (options.referenceImage) {
        return await this.generateImageWithReference(prompt, options.referenceImage, options);
      }

      const model = options.model || 'gemini-2.5-flash-image';
      const systemInstruction = options.systemInstruction || this.systemInstruction;

      const response = await this.genAI.models.generateContent({
        model,
        contents: prompt,
        ...(systemInstruction && { config: { systemInstruction } })
      });

      return this.extractImageFromResponse(response);
    } catch (error) {
      throw this.handleImageGenerationError(error);
    }
  }

  private async generateImageWithReference(
    prompt: string,
    referenceImage: File,
    options: GenerateImageOptions = {}
  ): Promise<string> {
    // Validar arquivo de imagem
    const validation = this.validateImageFile(referenceImage);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    try {
      const base64Image = await this.fileToBase64(referenceImage);
      const model = options.model || 'gemini-2.5-flash-image';
      const systemInstruction = options.systemInstruction || this.systemInstruction;

      const contents = [
        { text: prompt },
        {
          inlineData: {
            mimeType: referenceImage.type,
            data: base64Image
          }
        }
      ];

      const response = await this.genAI.models.generateContent({
        model,
        contents,
        ...(systemInstruction && { config: { systemInstruction } })
      });

      return this.extractImageFromResponse(response);
    } catch (error) {
      throw this.handleImageGenerationError(error);
    }
  }

  // Validation methods
  validateAudioFile(file: File): FileValidationResult {
    if (file.size > this.audioConstraints.maxSize) {
      return {
        isValid: false,
        error: `Arquivo muito grande. Tamanho máximo permitido: ${this.audioConstraints.maxSize / 1024 / 1024}MB`
      };
    }

    if (!this.audioConstraints.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Tipo de arquivo não suportado: ${file.type}. Tipos permitidos: ${this.audioConstraints.allowedTypes.join(', ')}`
      };
    }

    return { isValid: true };
  }

  validateImageFile(file: File): FileValidationResult {
    if (file.size > this.imageConstraints.maxSize) {
      return {
        isValid: false,
        error: `Arquivo muito grande. Tamanho máximo permitido: ${this.imageConstraints.maxSize / 1024 / 1024}MB`
      };
    }

    if (!this.imageConstraints.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Tipo de arquivo não suportado: ${file.type}. Tipos permitidos: ${this.imageConstraints.allowedTypes.join(', ')}`
      };
    }

    return { isValid: true };
  }

  // Utility methods
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Erro ao ler o arquivo'));
      reader.readAsDataURL(file);
    });
  }

  private extractTextFromResponse(response: GenerateContentResponse): string {
    // Estrutura completa da API Gemini
    if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Não foi possível extrair texto da resposta');
  }

  private extractImageFromResponse(response: GenerateContentResponse): string {
    console.log('Resposta completa da API:', response);

    // Procurar pela imagem na estrutura de candidates
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && 'data' in part.inlineData) {
            const imageData = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            const base64Image = `data:${mimeType};base64,${imageData}`;
            console.log('Imagem encontrada, MIME type:', mimeType);
            return base64Image;
          }
        }
      }
    }

    console.error('Estrutura de resposta inesperada:', response);
    throw new Error('Nenhuma imagem foi encontrada na resposta da API');
  }

  private cleanTranscriptionText(text: string): string {
    // Remove marcações de markdown e formatações extras
    let cleanText = text
      .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove **texto**
      .replace(/\*([^*]+)\*/g, '$1')     // Remove *texto*
      .replace(/#{1,6}\s*/g, '')         // Remove # ## ### etc
      .replace(/\n{2,}/g, ' ')           // Replace múltiplas quebras por espaço
      .replace(/\s+/g, ' ')              // Replace múltiplos espaços por um
      .trim();                           // Remove espaços das bordas

    // Adicionar pontuação se necessário
    if (cleanText && !cleanText.match(/[.!?]$/)) {
      cleanText += '.';
    }

    return cleanText;
  }

  private handleError(error: unknown, operation: string): GeminiError {
    console.error(`Erro em ${operation}:`, error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return {
      message: `Erro em ${operation}: ${errorMessage}`,
      type: 'api',
      details: error
    };
  }

  private handleImageGenerationError(error: unknown): GeminiError {
    console.error('Erro na geração de imagem:', error);

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

    // Tratamento específico para erro de cota
    if (errorMessage.includes('quota') || errorMessage.includes('limit')) {
      return {
        message: 'Limite de cota excedido para geração de imagens. Você atingiu o limite do plano gratuito. Tente novamente mais tarde.',
        type: 'quota',
        details: error
      };
    }

    return {
      message: errorMessage,
      type: 'api',
      details: error
    };
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
export default geminiService;