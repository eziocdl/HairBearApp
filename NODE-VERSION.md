# ⚠️ Notas Importantes - Node.js Version

## Problema Atual: Vitest requer Node 20+

O usuário está rodando **Node 18.18.2**, mas algumas dependências de teste requerem **Node 20+**:

- `vitest@4.0.13` → requer Node 20+
- `jsdom@27.2.0` → requer Node 20+
- `@vitejs/plugin-react@5.1.1` → requer Node 20+

## Soluções

### Opção 1: Atualizar Node.js (Recomendado) ✅

```bash
# Usando NVM
nvm install 20
nvm use 20

# Ou baixar direto
# https://nodejs.org/en/download/

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install

# Rodar testes
npm test
```

### Opção 2: Downgrade do Vitest (Temporário)

```bash
# Remover versões incompatíveis
npm uninstall vitest @vitejs/plugin-react jsdom

# Instalar versões compatíveis com Node 18
npm install -D vitest@1.6.0 @vitejs/plugin-react@4.3.1 jsdom@24.1.0

# Rodar testes
npm test
```

### Opção 3: Skip Tests Temporariamente

Se você quer fazer deploy **imediatamente** sem  testes:

1. Comentar os scripts de teste no package.json
2. Remover job de testes do `.github/workflows/ci.yml`
3. Fazer build e deploy normalmente

```bash
npm run build    # Funciona perfeitamente
npm start        # Deploy OK
```

## Status Atual

- ✅ **TypeScript**: Funcionando (sem erros)
- ✅ **Build**: Funcionando (13 páginas OK)
- ⚠️ **Testes**: Preparados mas requerem Node 20
- ✅ **Deploy**: Pronto (independente de testes)
- ✅ **Mobile**: Documentado e pronto

## Recomendação

**Para deploy imediato**: Use Node 18, mas pule os testes (build funciona perfeitamente)

**Para desenvolvimento completo**: Atualize para Node 20 LTS

## Verificar Versão Atual

```bash
node -v     # Deve mostrar v20.x.x
npm -v      # Deve mostrar 9.x.x ou 10.x.x
```

---

**Nota**: O Next.js e toda a aplicação funcionam perfeitamente com Node 18. 
A limitação é apenas para o framework de testes moderno.
