# Solução para Erro de Coverage no CI/CD

## Problema
O step "Generate coverage report" falha com erro:
```
MISSING DEPENDENCY Cannot find dependency '@vitest/coverage-v8'
```

## Correções Aplicadas

### 1. Dependência Instalada (commit fade9f4)
```bash
npm install --save-dev @vitest/coverage-v8@^1.6.0
```

### 2. Cache Dependency Path Adicionado (commit c4641f3)
Adicionado `cache-dependency-path: 'package-lock.json'` em todos os jobs do workflow para forçar atualização do cache.

## Se o Erro Persistir

### Opção 1: Limpar Cache do GitHub Actions (RECOMENDADO)
1. Vá para o repositório no GitHub
2. Clique em **Actions** → **Caches**
3. Delete todos os caches antigos
4. Execute o workflow novamente

### Opção 2: Desabilitar Coverage Temporariamente
Se precisar fazer o pipeline passar urgentemente, comente o step de coverage no `.github/workflows/ci.yml`:

```yaml
# - name: Generate coverage report
#   run: npm run test:coverage
```

### Opção 3: Forçar Reinstalação no CI
Adicione `npm cache clean --force` antes do `npm ci`:

```yaml
- name: Clean npm cache
  run: npm cache clean --force

- name: Install dependencies
  run: npm ci
```

## Verificação Local
Para garantir que funciona localmente:
```bash
rm -rf node_modules
npm ci
npm run test:coverage
```

✅ Deve gerar o relatório de coverage sem erros.
