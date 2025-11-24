import { stylesService } from '../services/api';

async function runTests() {
    console.log('🧪 Iniciando testes manuais da API...\n');

    try {
        // Teste 1: Get Haircuts
        console.log('1️⃣  Testando getHaircuts()...');
        const start = Date.now();
        const haircuts = await stylesService.getHaircuts();
        const duration = Date.now() - start;

        if (haircuts.length > 0 && haircuts[0].category === 'haircut') {
            console.log(`✅ Sucesso! Retornou ${haircuts.length} cortes em ${duration}ms`);
        } else {
            console.error('❌ Falha: Dados inválidos');
        }

        // Teste 2: Get Beards
        console.log('\n2️⃣  Testando getBeards()...');
        const beards = await stylesService.getBeards();

        if (beards.length > 0 && beards[0].category === 'beard') {
            console.log(`✅ Sucesso! Retornou ${beards.length} barbas`);
        } else {
            console.error('❌ Falha: Dados inválidos');
        }

        console.log('\n🎉 Todos os testes passaram!');

    } catch (error) {
        console.error('\n❌ Erro fatal nos testes:', error);
        process.exit(1);
    }
}

runTests();
