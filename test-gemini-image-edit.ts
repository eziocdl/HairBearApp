import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';

async function testImageEditing() {
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyAyJ97A_xZH7_hwrc2e7JGUoSCrVpezhuw';

    console.log('🧪 TESTE: Gemini 2.5 Flash Image - Edição Multimodal');
    console.log('━'.repeat(60));

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // Testar modelo 2.5 Flash Image
        console.log('\n📝 Modelo: gemini-2.5-flash-image');
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

        // Imagem de teste (substituir por uma real)
        const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='; // 1x1 pixel vermelho

        const hardlockPrompt = `
You are an Ultra-Photorealistic Hair & Beard Try-On AI Agent.

EDIT THIS IMAGE: Apply a "pompadour" haircut style to the person in this photo.

CRITICAL RULES:
- ONLY modify hair pixels
- PRESERVE 100% of face, skin, background, lighting
- DO NOT create a new person
- DO NOT apply filters or reconstruction

Return the edited image maintaining the exact same face and background.
`;

        console.log('🚀 Enviando requisição...');
        console.log('   Prompt:', hardlockPrompt.substring(0, 100) + '...');

        const result = await model.generateContent([
            hardlockPrompt,
            {
                inlineData: {
                    data: testImageBase64,
                    mimeType: "image/png",
                },
            },
        ]);

        const response = result.response;
        console.log('\n✅ RESPOSTA RECEBIDA');
        console.log('━'.repeat(60));

        // Verificar estrutura da resposta
        console.log('\n📊 Estrutura da resposta:');
        console.log('   Candidates:', response.candidates?.length || 0);

        if (response.candidates && response.candidates[0]) {
            const candidate = response.candidates[0];
            console.log('   Parts:', candidate.content?.parts?.length || 0);

            if (candidate.content?.parts) {
                candidate.content.parts.forEach((part, idx) => {
                    console.log(`\n   Part ${idx + 1}:`);
                    if (part.text) {
                        console.log('     ✍️  Tipo: TEXT');
                        console.log('     Conteúdo:', part.text.substring(0, 200));
                    }
                    if (part.inlineData) {
                        console.log('     🖼️  Tipo: INLINE_DATA (IMAGEM!)');
                        console.log('     MIME:', part.inlineData.mimeType);
                        console.log('     Tamanho:', part.inlineData.data.length, 'bytes');

                        // Salvar imagem
                        const buffer = Buffer.from(part.inlineData.data, 'base64');
                        const ext = part.inlineData.mimeType.split('/')[1];
                        const filename = `test_output_${Date.now()}.${ext}`;
                        fs.writeFileSync(filename, buffer);
                        console.log('     ✅ Imagem salva:', filename);
                    }
                });
            }
        }

        // Exibir resposta completa (JSON)
        console.log('\n📄 Resposta completa (JSON):');
        console.log(JSON.stringify(response, null, 2));

        console.log('\n━'.repeat(60));
        console.log('✅ TESTE COMPLETO');

    } catch (error) {
        console.error('\n❌ ERRO NO TESTE:');
        console.error(error);

        if (error instanceof Error) {
            console.error('\nMensagem:', error.message);
            console.error('Stack:', error.stack);
        }
    }
}

// Executar teste
testImageEditing().catch(console.error);
