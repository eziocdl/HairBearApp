# 🚀 Guia de Instalação - HairBearApp

## ⚠️ Problema de Versão do Node.js

Você está usando **Node.js 18.18.2**, mas o Next.js 16 requer **Node.js ≥20.9.0**.

### Soluções:

---

## ✅ Opção 1: Atualizar Node.js (Recomendado)

### Usando NVM (Node Version Manager)

```bash
# Instalar NVM (se ainda não tiver)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recarregar terminal
source ~/.zshrc

# Instalar Node 20
nvm install 20

# Usar Node 20
nvm use 20

# Verificar versão
node --version  # Deve mostrar v20.x.x

# Voltar ao projeto e rodar
cd /Users/eziolima/.gemini/antigravity/playground/resonant-satellite/hairbearapp
npm run dev
```

### Usando Homebrew (macOS)

```bash
# Atualizar Homebrew
brew update

# Instalar Node 20
brew install node@20

# Linkar versão
brew link node@20

# Verificar
node --version

# Rodar projeto
cd /Users/eziolima/.gemini/antigravity/playground/resonant-satellite/hairbearapp
npm run dev
```

---

## ✅ Opção 2: Downgrade Next.js (Temporário)

Se não puder atualizar o Node agora:

```bash
cd /Users/eziolima/.gemini/antigravity/playground/resonant-satellite/hairbearapp

# Desinstalar Next.js 16
npm uninstall next

# Instalar Next.js 14 (compatível com Node 18)
npm install next@14.2.18

# Rodar projeto
npm run dev
```

⚠️ **Nota**: Algumas features podem não funcionar perfeitamente com Next.js 14.

---

## ✅ Opção 3: Usar Docker (Isolado)

```bash
# Criar Dockerfile
cat > Dockerfile << 'EOF'
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
EOF

# Build imagem
docker build -t hairbearapp .

# Rodar container
docker run -p 3000:3000 -v $(pwd):/app hairbearapp
```

---

## 📋 Checklist Pós-Instalação

Depois de resolver o problema do Node:

```bash
# 1. Verificar versão do Node
node --version  # Deve ser ≥20.9.0

# 2. Limpar cache (se necessário)
rm -rf node_modules package-lock.json
npm install

# 3. Rodar desenvolvimento
npm run dev

# 4. Abrir no navegador
# http://localhost:3000
```

---

## 🐛 Troubleshooting

### Erro: "Module not found"

```bash
# Reinstalar dependências
rm -rf node_modules
npm install
```

### Erro: "Port 3000 already in use"

```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou rodar em outra porta
npm run dev -- -p 3001
```

### Erro: "Cannot find module 'framer-motion'"

```bash
# Reinstalar dependência específica
npm install framer-motion
```

### Erro de TypeScript

```bash
# Verificar tipos
npm run type-check

# Limpar cache TypeScript
rm -rf .next
npm run dev
```

---

## 🎯 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Rodar produção
npm start

# Lint
npm run lint

# Type check
npm run type-check

# Limpar tudo
rm -rf .next node_modules
npm install
```

---

## 📊 Verificar Instalação

Após rodar `npm run dev`, você deve ver:

```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
○ Network:      http://192.168.x.x:3000
```

Abra http://localhost:3000 e você verá a página de **Onboarding** do HairBearApp! 🎉

---

## 🆘 Ainda com Problemas?

1. **Verifique logs completos**: `npm run dev 2>&1 | tee debug.log`
2. **Versões instaladas**: `npm list`
3. **Cache do npm**: `npm cache clean --force`
4. **Reinstalação completa**:
   ```bash
   rm -rf node_modules package-lock.json .next
   npm install
   npm run dev
   ```

---

## 📞 Suporte

Se nenhuma solução funcionar, abra uma issue com:
- Versão do Node: `node --version`
- Versão do npm: `npm --version`
- Sistema operacional: `uname -a`
- Log completo do erro

---

**Boa sorte! 🚀**
