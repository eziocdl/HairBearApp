import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';

// Configuração para evitar timeout
export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { styleId, choice, image, variationIndex, referenceImage } = body;

        if (!image) {
            return NextResponse.json(
                { error: 'Imagem é obrigatória' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'GOOGLE_API_KEY não configurada' },
                { status: 500 }
            );
        }

        // Inicializa o cliente com o novo SDK
        const genAI = new GoogleGenAI({ apiKey });

        // Remove header do base64 se existir
        const base64Data = image.split(',')[1] || image;

        // Carregar System Instructions do arquivo ou usar fallback
        let systemInstruction = '';
        try {
            const systemInstructionPath = path.join(process.cwd(), 'public', 'system-instruction-ultra-tryon.md');
            if (fs.existsSync(systemInstructionPath)) {
                systemInstruction = fs.readFileSync(systemInstructionPath, 'utf-8');
            } else {
                // Fallback hardcoded caso o arquivo não seja encontrado (ex: serverless environment issues)
                systemInstruction = `
You are an Ultra-Photorealistic Hair & Beard Try-On AI Agent.
Sua missão é aplicar SOMENTE cortes de cabelo e estilos de barba diretamente na foto real enviada pelo usuário.
HARDLOCK — EDIÇÃO LOCAL ULTRA REALISTA (SEM GERAR ROSTO NOVO)
`;
            }
        } catch (error) {
            console.warn('⚠️ Falha ao ler system instructions, usando fallback.', error);
            systemInstruction = `
You are an Ultra-Photorealistic Hair & Beard Try-On AI Agent.
Sua missão é aplicar SOMENTE cortes de cabelo e estilos de barba diretamente na foto real enviada pelo usuário.
HARDLOCK — EDIÇÃO LOCAL ULTRA REALISTA (SEM GERAR ROSTO NOVO)
`;
        }

        // Construir o prompt
        let finalPrompt = '';
        if (styleId && choice) {
            // Logic adapted from spec
            // choice maps to: 'Haircut' | 'Haircut + Beard' | 'Beard' (from frontend)
            // But spec uses 'haircut' | 'haircut_beard' | 'beard'
            // We need to map it correctly. Let's assume frontend sends readable strings or we map them here.

            let typeDescription = 'corte de cabelo';
            let optionType = 'haircut';

            if (choice === 'Haircut + Beard') {
                typeDescription = 'corte de cabelo e barba';
                optionType = 'haircut_beard';
            } else if (choice === 'Beard') {
                typeDescription = 'estilo de barba';
                optionType = 'beard';
            }

            finalPrompt = `
  Aplique o ${typeDescription} "${styleId}" na foto do usuário.

  INSTRUÇÕES CRÍTICAS:
  - Edite SOMENTE os pixels do cabelo${optionType !== 'haircut' ? ' e/ou barba' : ''}
  - PRESERVE 100% do rosto, pele, luz, fundo e expressão
  - O resultado deve parecer uma foto REAL após um corte verdadeiro
  - ZERO filtros, ZERO reconstrução facial
  - Gere uma imagem ultra-realista

  ${referenceImage ? 'Use a imagem de referência APENAS para extrair o formato/geometria do corte.' : ''}
  `;

            if (variationIndex !== undefined) {
                finalPrompt += `\n\nVariação ${variationIndex + 1} de 5. Aplique uma interpretação ligeiramente diferente do estilo mantendo a essência.`;
            }

        } else {
            return NextResponse.json(
                { error: 'Parâmetros insuficientes para gerar o prompt' },
                { status: 400 }
            );
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🚀 GEMINI 2.5 FLASH IMAGE GENERATION');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Prompt:', finalPrompt);

        const contents: any[] = [
            { text: finalPrompt },
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
        ];

        if (referenceImage) {
            const refBase64 = referenceImage.split(',')[1] || referenceImage;
            contents.push({
                inlineData: { mimeType: 'image/jpeg', data: refBase64 }
            });
        }

        const variationPromises = Array.from({ length: 5 }, async (_, idx: number) => {
            try {
                const resp = await genAI.models.generateContent({
                    model: 'gemini-2.5-flash-image',
                    contents: contents,
                    config: {
                        systemInstruction: systemInstruction,
                    },
                });
                const cand = resp.candidates?.[0];
                const part = cand?.content?.parts?.[0];
                if (part?.inlineData?.data) {
                    const imageData = part.inlineData.data;
                    const base64Image = `data:image/png;base64,${imageData}`;
                    console.log(`✅ Variation ${idx + 1} generated successfully`);
                    return base64Image;
                }
                console.warn(`⚠️ Variation ${idx + 1} missing image data`);
                return null;
            } catch (e: unknown) {
                console.error(`❌ Error generating variation ${idx + 1}:`, e);
                return null;
            }
        });

        const variations = (await Promise.all(variationPromises)).filter(
            (image): image is string => image !== null
        );

        if (variations.length > 0) {
            console.log(`✅ ${variations.length} imagens geradas com sucesso!`);
            return NextResponse.json({
                success: true,
                variations: variations,
                message: 'Imagens geradas com Gemini 2.5 Flash Image'
            });
        }

        console.error('⚠️ Nenhuma imagem válida foi retornada pelo Gemini.');

        return NextResponse.json(
            { error: 'O Gemini não retornou nenhuma imagem válida.' },
            { status: 500 }
        );

    } catch (error: unknown) {
        console.error('❌ Erro geral na API:', error);
        return NextResponse.json(
            { error: 'Erro interno no servidor', details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

