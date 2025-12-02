import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { image } = body;

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

        const genAI = new GoogleGenAI({ apiKey });

        // Remove header do base64 se existir
        const base64Data = image.split(',')[1] || image;

        const prompt = `
  Analise o rosto na foto e sugira estilos que combinem com o formato do rosto, 
  estrutura óssea e características faciais.

  Retorne EXATAMENTE no formato JSON abaixo, sem texto adicional:
  {
    "haircuts": ["nome1", "nome2", "nome3", "nome4", "nome5"],
    "beards": ["nome1", "nome2", "nome3", "nome4", "nome5"]
  }

  Regras:
  - 5 sugestões de cortes de cabelo (nomes em português)
  - 5 sugestões de estilos de barba (nomes em português)
  - Considere o formato do rosto e características visíveis
  - Sugira estilos variados (clássico, moderno, ousado)
  `;

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔍 GEMINI 2.0 FLASH ANALYSIS');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const response = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
                { text: prompt },
                { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
            ],
            config: {
                responseMimeType: 'application/json'
            }
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
            try {
                const suggestions = JSON.parse(text);
                return NextResponse.json(suggestions);
            } catch (e) {
                console.error('Erro ao parsear JSON:', e);
                // Fallback manual parsing if needed, or just return error
                return NextResponse.json(
                    { error: 'Falha ao processar resposta do Gemini' },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Nenhuma resposta gerada' },
            { status: 500 }
        );

    } catch (error) {
        console.error('💥 ERRO NA ANÁLISE:', error);
        return NextResponse.json(
            { error: 'Falha interna na análise' },
            { status: 500 }
        );
    }
}
