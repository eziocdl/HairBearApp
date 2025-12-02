import fs from 'fs';
import path from 'path';

async function testIntegration() {
    const baseUrl = 'http://localhost:3000';

    console.log('🧪 TESTE DE INTEGRAÇÃO: API Endpoints');
    console.log('━'.repeat(60));

    // 1. Load Image
    const imagePath = path.resolve('public/images/backgrounds/haircut.png');
    if (!fs.existsSync(imagePath)) {
        console.error('❌ Imagem de teste não encontrada:', imagePath);
        return;
    }
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

    // 2. Test /api/analyze
    console.log('\n📡 Testando /api/analyze...');
    try {
        const analyzeRes = await fetch(`${baseUrl}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image })
        });

        if (analyzeRes.ok) {
            const data = await analyzeRes.json();
            console.log('✅ Análise Sucesso:', JSON.stringify(data, null, 2));
        } else {
            console.error('❌ Falha na Análise:', analyzeRes.status, await analyzeRes.text());
        }
    } catch (e) {
        console.error('❌ Erro ao conectar com /api/analyze:', e);
    }

    // 3. Test /api/generate
    console.log('\n📡 Testando /api/generate (1 variação)...');
    try {
        const generateRes = await fetch(`${baseUrl}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                styleId: 'Undercut',
                choice: 'Haircut',
                image: base64Image,
                variationIndex: 0
            })
        });

        if (generateRes.ok) {
            const data = await generateRes.json();
            if (data.success && data.variations?.length > 0) {
                console.log('✅ Geração Sucesso! Imagem recebida.');
                // Save image to verify
                const imgData = data.variations[0].replace(/^data:image\/png;base64,/, '');
                fs.writeFileSync('test_integration_output.png', Buffer.from(imgData, 'base64'));
                console.log('💾 Imagem salva em test_integration_output.png');
            } else {
                console.error('⚠️ Resposta inesperada:', data);
            }
        } else {
            console.error('❌ Falha na Geração:', generateRes.status, await generateRes.text());
        }
    } catch (e) {
        console.error('❌ Erro ao conectar com /api/generate:', e);
    }
}

testIntegration();
