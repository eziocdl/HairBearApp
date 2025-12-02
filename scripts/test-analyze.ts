import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

async function testAnalyze() {
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyAyJ97A_xZH7_hwrc2e7JGUoSCrVpezhuw';

    console.log('🧪 TESTE: Análise Facial com gemini-2.0-flash');
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

        const prompt = `
  Analise o rosto na foto e sugira estilos que combinem com o formato do rosto, 
  estrutura óssea e características faciais.

  Retorne EXATAMENTE no formato JSON abaixo, sem texto adicional:
  {
    "haircuts": ["nome1", "nome2", "nome3", "nome4", "nome5"],
    "beards": ["nome1", "nome2", "nome3", "nome4", "nome5"]
  }
  `;

        console.log('🚀 Enviando requisição de análise...');

        const response = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [
                { text: prompt },
                { inlineData: { mimeType: 'image/png', data: base64Image } }
            ],
            config: {
                responseMimeType: 'application/json'
            }
        });

        console.log('\n✅ RESPOSTA RECEBIDA');
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
            console.log('📄 JSON Retornado:');
            console.log(text);
            try {
                const json = JSON.parse(text);
                console.log('\n✅ JSON Válido!');
                console.log('Cortes:', json.haircuts.length);
                console.log('Barbas:', json.beards.length);
            } catch (e) {
                console.error('❌ Erro ao parsear JSON:', e);
            }
        } else {
            console.log('⚠️ Nenhum texto retornado.');
        }

    } catch (error) {
        console.error('\n❌ ERRO NO TESTE:', error);
    }
}

testAnalyze();
