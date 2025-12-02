import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

async function testGenAI() {
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyAyJ97A_xZH7_hwrc2e7JGUoSCrVpezhuw';

    console.log('🧪 TESTE: @google/genai SDK com gemini-2.5-flash-image');
    console.log('━'.repeat(60));

    try {
        const genAI = new GoogleGenAI({ apiKey });

        // Ler imagem de teste
        const imagePath = path.resolve('public/images/backgrounds/haircut.png');
        if (!fs.existsSync(imagePath)) {
            console.error('❌ Imagem de teste não encontrada:', imagePath);
            return;
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        const systemInstruction = `
You are an Ultra-Photorealistic Hair & Beard Try-On AI Agent.
Sua missão é aplicar SOMENTE cortes de cabelo e estilos de barba diretamente na foto real enviada pelo usuário.
HARDLOCK — EDIÇÃO LOCAL ULTRA REALISTA (SEM GERAR ROSTO NOVO)
`;

        const prompt = "Apply a buzz cut style to this person.";

        console.log('🚀 Enviando requisição...');

        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [
                { text: prompt },
                { inlineData: { mimeType: 'image/png', data: base64Image } }
            ],
            config: {
                systemInstruction: systemInstruction,
            }
        });

        console.log('\n✅ RESPOSTA RECEBIDA');

        const candidate = response.candidates?.[0];
        const part = candidate?.content?.parts?.[0];

        if (part?.inlineData?.data) {
            console.log('   🖼️  Imagem gerada com sucesso!');
            console.log('   Tamanho:', part.inlineData.data.length, 'bytes');

            // Salvar para verificar
            const buffer = Buffer.from(part.inlineData.data, 'base64');
            fs.writeFileSync('test_output_v2.png', buffer);
            console.log('   💾 Salvo em: test_output_v2.png');
        } else {
            console.log('   ⚠️  Nenhuma imagem retornada.');
            console.log(JSON.stringify(response, null, 2));
        }

    } catch (error) {
        console.error('\n❌ ERRO NO TESTE:', error);
    }
}

testGenAI();
