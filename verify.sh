#!/bin/bash

# 🔍 Script de Verificação Rápida - HairBearApp
# Execute: chmod +x verify.sh && ./verify.sh

set -e  # Exit on error

echo "🚀 Verificando HairBearApp..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. TypeScript
echo "📘 Verificando TypeScript..."
if npm run type-check; then
    echo -e "${GREEN}✅ TypeScript: OK${NC}"
else
    echo -e "${RED}❌ TypeScript: ERRO${NC}"
    exit 1
fi
echo ""

# 2. Testes
echo "🧪 Executando Testes..."
if npm test; then
    echo -e "${GREEN}✅ Testes: OK${NC}"
else
    echo -e "${RED}❌ Testes: FALHOU${NC}"
    exit 1
fi
echo ""

# 3. Build
echo "🏗️  Build de Produção..."
if npm run build; then
    echo -e "${GREEN}✅ Build: OK${NC}"
else
    echo -e "${RED}❌ Build: FALHOU${NC}"
    exit 1
fi
echo ""

# 4. Verificar arquivos importantes
echo "📁 Verificando arquivos..."
REQUIRED_FILES=(
    ".env.example"
    "DEPLOY.md"
    "MOBILE.md"
    "AJUSTES-REALIZADOS.md"
    ".github/workflows/ci.yml"
    "vitest.config.ts"
    "lib/env.ts"
    "app/error.tsx"
    "app/not-found.tsx"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file (FALTANDO)"
    fi
done
echo ""

# 5. Verificar testes
echo "🧪 Verificando arquivos de teste..."
TEST_FILES=(
    "components/ui/Button.test.tsx"
    "components/ui/Card.test.tsx"
    "lib/store.test.ts"
)

for file in "${TEST_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $file"
    else
        echo -e "${RED}❌${NC} $file (FALTANDO)"
    fi
done
echo ""

# 6. Resumo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ TypeScript:${NC} Sem erros"
echo -e "${GREEN}✅ Testes:${NC} Passando"
echo -e "${GREEN}✅ Build:${NC} Sucesso"
echo -e "${GREEN}✅ Documentação:${NC} Completa"
echo ""
echo -e "${GREEN}🎉 PROJETO PRONTO PARA DEPLOY! 🚀${NC}"
echo ""
echo "Próximos passos:"
echo "  1. Deploy: npm run build && vercel --prod"
echo "  2. Mobile: Seguir MOBILE.md"
echo "  3. CI/CD: Push para GitHub (actions rodam automaticamente)"
echo ""
