import fs from 'fs';
import path from 'path';

const API_BASE = 'http://localhost:3000';
const DELAY_BETWEEN_REQUESTS = 2000; // 2 segundos entre cada requisição

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testTryOnFlow() {
    console.log('🧪 TESTE DO FLUXO ULTRA TRY-ON');
    console.log('━'.repeat(60));

    // 1. Carregar imagem de teste
    const imagePath = path.resolve('public/images/backgrounds/haircut.png');
    if (!fs.existsSync(imagePath)) {
        console.error('❌ Imagem de teste não encontrada:', imagePath);
        return;
    }
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    console.log('✅ Imagem de teste carregada');

    // 2. Testar /api/analyze
    console.log('\n📡 Testando /api/analyze...');
    try {
        const analyzeRes = await fetch(`${API_BASE}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image })
        });

        if (!analyzeRes.ok) {
            console.error('❌ Falha na Análise:', analyzeRes.status, await analyzeRes.text());
            return;
        }

        const suggestions = await analyzeRes.json();
        console.log('✅ Análise Sucesso:');
        console.log('  Cortes:', suggestions.haircuts?.join(', ') || 'N/A');
        console.log('  Barbas:', suggestions.beards?.join(', ') || 'N/A');

        // 3. Testar /api/generate (UMA variação por vez)
        console.log('\n📡 Testando /api/generate (1 variação por vez com delay)...');

        const styleId = suggestions.haircuts?.[0] || 'Undercut';
        const choice = 'Haircut';

        console.log(`  Estilo selecionado: ${styleId}`);
        console.log(`  Categoria: ${choice}`);

        const generatedImages: string[] = [];

        for (let i = 0; i < 3; i++) { // Testar apenas 3 variações para evitar rate limit
            console.log(`\n  → Gerando variação ${i + 1}/3...`);

            try {
                const generateRes = await fetch(`${API_BASE}/api/generate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        styleId,
                        choice,
                        image: base64Image,
                        variationIndex: i
                    })
                });

                if (!generateRes.ok) {
                    const errorText = await generateRes.text();
                    console.error(`  ❌ Falha na variação ${i + 1}:`, generateRes.status, errorText);

                    if (generateRes.status === 429) {
                        console.warn('  ⚠️  Rate limit atingido! Aguardando 5 segundos...');
                        await sleep(5000);
                        continue;
                    }
                    continue;
                }

                const data = await generateRes.json();
                if (data.success && data.variations?.[0]) {
                    generatedImages.push(data.variations[0]);
                    console.log(`  ✅ Variação ${i + 1} gerada com sucesso!`);

                    // Salvar imagem
                    const imgData = data.variations[0].replace(/^data:image\/png;base64,/, '');
                    fs.writeFileSync(`test_variation_${i + 1}.png`, Buffer.from(imgData, 'base64'));
                    console.log(`  💾 Salva como: test_variation_${i + 1}.png`);
                } else {
                    console.error(`  ⚠️  Resposta inesperada para variação ${i + 1}:`, data);
                }

            } catch (e) {
                console.error(`  ❌ Erro na variação ${i + 1}:`, e);
            }

            // Delay entre requisições para evitar rate limit
            if (i < 2) {
                console.log(`  ⏳ Aguardando ${DELAY_BETWEEN_REQUESTS / 1000}s antes da próxima...`);
                await sleep(DELAY_BETWEEN_REQUESTS);
            }
        }

        console.log('\n━'.repeat(60));
        console.log('📊 RESUMO:');
        console.log(`  Total de imagens geradas: ${generatedImages.length}/3`);

        if (generatedImages.length > 0) {
            console.log('\n✅ TESTE CONCLUÍDO COM SUCESSO!');
            console.log('  As imagens foram salvas como test_variation_X.png');
        } else {
            console.log('\n❌ NENHUMA IMAGEM FOI GERADA');
            console.log('  Verifique os erros acima para mais detalhes');
        }

    } catch (error) {
        console.error('💥 ERRO GERAL:', error);
    }
}

testTryOnFlow();
