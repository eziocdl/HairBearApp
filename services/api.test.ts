import { describe, it, expect } from 'vitest';
import { stylesService } from './api';

describe('Styles Service (Mock)', () => {

    it('should fetch haircuts successfully', async () => {
        const start = Date.now();
        const haircuts = await stylesService.getHaircuts();
        const end = Date.now();
        const duration = end - start;

        // Verificar se retornou dados
        expect(haircuts).toBeDefined();
        expect(haircuts.length).toBeGreaterThan(0);

        // Verificar integridade dos dados
        expect(haircuts[0]).toHaveProperty('id');
        expect(haircuts[0]).toHaveProperty('name');
        expect(haircuts[0].category).toBe('haircut');

        // Verificar se houve delay (simulação de rede)
        // O delay configurado é 800ms, então deve demorar pelo menos isso
        expect(duration).toBeGreaterThanOrEqual(750);
    });

    it('should fetch beards successfully', async () => {
        const beards = await stylesService.getBeards();

        expect(beards).toBeDefined();
        expect(beards.length).toBeGreaterThan(0);
        expect(beards[0].category).toBe('beard');
    });

    it('should fetch all styles', async () => {
        const allStyles = await stylesService.getAll();

        expect(allStyles.length).toBeGreaterThan(0);

        // Deve conter ambos os tipos
        const hasHaircut = allStyles.some(s => s.category === 'haircut');
        const hasBeard = allStyles.some(s => s.category === 'beard');

        expect(hasHaircut).toBe(true);
        expect(hasBeard).toBe(true);
    });
});
