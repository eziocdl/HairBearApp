# 🚀 Guia de Deploy - HairBearApp

## Opções de Deploy

### 1. Vercel (Recomendado) ⭐

A forma mais simples e otimizada para Next.js.

#### Deploy Automático via GitHub

1. **Conecte seu repositório**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe o repositório do GitHub

2. **Configure as variáveis de ambiente**:
   ```bash
   NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
   NEXT_PUBLIC_GEMINI_API_KEY=sua_api_key_aqui
   NEXT_PUBLIC_ENABLE_ANALYTICS=true
   ```

3. **Deploy**:
   - Vercel fará deploy automaticamente
   - Cada push na branch `main` = novo deploy
   - Pull requests geram preview deployments

#### Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (produção)
vercel --prod

# Deploy (preview)
vercel
```

---

### 2. Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli  

# Login
netlify login

# Build e Deploy
npm run build
netlify deploy --prod
```

**netlify.toml**:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

### 3. Docker + Cloud Run / AWS / Railway

#### Dockerfile

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Build e Run

```bash
# Build
docker build -t hairbearapp .

# Run
docker run -p 3000:3000 hairbearapp
```

---

### 4. Deploy Manual (VPS/DigitalOcean)

```bash
# No servidor
git clone https://github.com/seu-usuario/hairbearapp.git
cd hairbearapp

# Instalar dependências
npm ci

# Build
npm run build

# Rodar com PM2
npm install -g pm2
pm2 start npm --name "hairbearapp" -- start
pm2 save
pm2 startup
```

---

## Checklist Pré-Deploy ✅

- [ ] Todos os testes passando (`npm test`)
- [ ] Type-check sem erros (`npm run type-check`)
- [ ] ESLint sem erros (`npm run lint`)
- [ ] Build de produção OK (`npm run build`)
- [ ] Variáveis de ambiente configuradas
- [ ] `.env.example` atualizado
- [ ] README.md com instruções claras
- [ ] Remover console.logs desnecessários
- [ ] Testar em diferentes browsers
- [ ] Testar responsividade mobile
- [ ] Verificar performance (Lighthouse)
- [ ] Security headers configurados

---

## Variáveis de Ambiente Obrigatórias

```bash
# Produção
NEXT_PUBLIC_APP_URL=https://hairbearapp.com
NODE_ENV=production

# Opcional (quando integrado)
NEXT_PUBLIC_GEMINI_API_KEY=your_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## Performance e Otimizações

### 1. Next.js Config para Produção

Já configurado em `next.config.js`:
- ✅ Image optimization (AVIF, WebP)
- ✅ Security headers
- ✅ React Strict Mode

### 2. Lighthouse Score Alvo

- 🎯 **Performance**: 90+
- 🎯 **Accessibility**: 95+
- 🎯 **Best Practices**: 95+
- 🎯 **SEO**: 100

### 3. Monitoramento

#### Vercel Analytics (Grátis)
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout() {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
```

---

## Domínio Customizado

### Vercel
1. Vá em Settings > Domains
2. Adicione seu domínio
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Netlify
1. Site Settings > Domain Management
2. Add custom domain
3. Configure DNS conforme instruções

---

## Rollback em Caso de Problema

### Vercel
```bash
# Via dashboard: Deployments > Previous deployment > Promote to Production

# Via CLI
vercel rollback [deployment-url]
```

### Manual (PM2)
```bash
git revert HEAD
npm ci
npm run build
pm2 restart hairbearapp
```

---

## Continuous Deployment

Com GitHub Actions (`.github/workflows/ci.yml`), cada push:

1. ✅ Roda testes
2. ✅ Type-check
3. ✅ Lint
4. ✅ Build
5. ✅ Security audit

Se tudo passar, Vercel/Netlify fazem deploy automático.

---

## Monitoramento de Erros (Futuro)

### Sentry

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Em `app/error.tsx`:
```tsx
import * as Sentry from '@sentry/nextjs';

useEffect(() => {
  Sentry.captureException(error);
}, [error]);
```

---

## SSL/HTTPS

- ✅ **Vercel/Netlify**: SSL automático
- ✅ **Docker/VPS**: Use Certbot (Let's Encrypt)

```bash
# Certbot (Ubuntu/Debian)
sudo apt-get install certbot
sudo certbot --nginx -d hairbearapp.com -d www.hairbearapp.com
```

---

## Backup e Disaster Recovery

1. **Código**: Git repository (GitHub/GitLab)
2. **Build artifacts**: Vercel mantém histórico
3. **Dados de usuário**: N/A (100% client-side)

---

## Contato para Deploy Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs/deployment
- **Netlify Docs**: https://docs.netlify.com

---

**Deploy com confiança! 🚀**
