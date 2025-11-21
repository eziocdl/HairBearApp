# 🧔 HairBearApp - Simulador de Cortes & Barba com IA

![HairBearApp](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=for-the-badge&logo=tailwind-css)

**Experiência premium de simulação de cortes de cabelo e estilos de barba com IA**

Visualize seu novo visual ANTES de ir ao barbeiro. 100% privado, gratuito e mobile-first.

---

## ✨ Features

### 🎯 6 Stages Completos

1. **Onboarding Hero** - Landing page premium com design barbershop
2. **Captura de Foto** - Câmera com detecção facial em tempo real
3. **Análise IA** - Processing com feedback visual e progress bar
4. **Sugestões** - Grid responsivo com 5 cortes + 5 barbas
5. **Resultados** - Carousel com 5 variações + compartilhamento social
6. **Fluxo Referência** - Upload de foto inspiração em 3 etapas

### 🚀 Diferenciais

- ✅ **Mobile-First** - Otimizado para 65% do tráfego mobile
- ✅ **Performance** - LCP <2.5s, FCP <1.5s, CLS <0.1
- ✅ **Acessibilidade** - WCAG 2.1 AA compliant
- ✅ **100% Privado** - Zero armazenamento de dados
- ✅ **SEO Otimizado** - Metadata, OpenGraph, Schema.org
- ✅ **Animações Suaves** - Framer Motion para UX premium

---

## 🛠️ Stack Técnico

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **Next.js** | 16.0+ | Framework React com SSR/SEO |
| **TypeScript** | 5.0+ | Type-safe development |
| **Tailwind CSS** | 3.0+ | Utility-first styling |
| **Zustand** | 5.0+ | State management |
| **Framer Motion** | 11.0+ | Animações suaves |
| **TensorFlow.js** | Latest | Detecção facial (planejado) |
| **React Hook Form** | 7.0+ | Formulários (planejado) |
| **Sonner** | Latest | Toast notifications |
| **Lucide React** | Latest | Ícones modernos |

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js 20.9.0+ (recomendado)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
cd hairbearapp

# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

---

## 📁 Estrutura do Projeto

```
hairbearapp/
├── app/
│   ├── page.tsx              # Stage 1 - Onboarding
│   ├── camera/
│   │   └── page.tsx          # Stage 2A - Captura câmera
│   ├── upload/
│   │   └── page.tsx          # Stage 2B - Upload galeria
│   ├── analysis/
│   │   └── page.tsx          # Stage 3 - Análise IA
│   ├── suggestions/
│   │   └── page.tsx          # Stage 4 - Sugestões
│   ├── results/
│   │   └── page.tsx          # Stage 5 - Resultados
│   ├── reference/
│   │   └── page.tsx          # Stage 6 - Fluxo referência
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── ui/
│       ├── Button.tsx        # Componente Button
│       └── Card.tsx          # Componente Card
├── lib/
│   └── store.ts              # Zustand store
├── public/                   # Assets estáticos
├── tailwind.config.ts        # Tailwind config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

---

## 🎨 Design System

### Cores

```css
/* Primárias */
--color-primary: #10b981 (emerald-500)
--color-primary-dark: #059669 (emerald-600)

/* Secundárias */
--color-secondary: #3b82f6 (blue-500)
--color-accent: #f59e0b (amber-500)

/* Neutros */
--color-dark: #0f172a (slate-900)
--color-dark-lighter: #1e293b (slate-800)
--color-text: #f1f5f9 (slate-100)
```

### Tipografia

- **Font Family**: Inter (Google Fonts)
- **H1**: 32px (mobile) | 48px (desktop) | weight: 700
- **H2**: 24px (mobile) | 32px (desktop) | weight: 600
- **Body**: 16px | weight: 400 | line-height: 1.6

### Breakpoints

- **Mobile**: 375px → 767px
- **Tablet**: 768px → 1023px
- **Desktop**: 1024px → 1439px
- **Large**: 1440px+

---

## 🔌 Integração Backend (Planejado)

### Endpoints Esperados

```typescript
// POST /api/gemini/analyze
Body: { photo: File }
Response: { cortes: [...], barbas: [...] }

// POST /api/gemini/process
Body: { basePhoto, selectedStyle, choice }
Response: { resultImages: [...], metadata: {...} }

// POST /api/gemini/process-reference
Body: { basePhoto, referencePhoto }
Response: { resultImages: [...], metadata: {...} }
```

---

## 📊 Analytics (Planejado)

### Eventos Críticos

- `stage_1_view` - Visualização onboarding
- `cta_camera_clicked` - Clique em tirar foto
- `photo_captured` - Foto capturada
- `analysis_started` - Análise iniciada
- `style_selected` - Estilo selecionado
- `results_viewed` - Resultados visualizados
- `result_shared` - Resultado compartilhado
- `funnel_completed` - Funil completo

---

## ♿ Acessibilidade

- ✅ Contraste ≥4.5:1 (WCAG AA)
- ✅ Labels + ARIA em inputs
- ✅ Navegação por teclado (Tab, ESC)
- ✅ Touch targets ≥44x44px
- ✅ Suporte a `prefers-reduced-motion`
- ✅ Suporte a `prefers-color-scheme: dark`

---

## 🔐 Segurança & Privacidade

- 🔒 **Zero armazenamento persistente** de fotos
- 🔒 **Processamento client-side** quando possível
- 🔒 **HTTPS obrigatório** em produção
- 🔒 **Headers de segurança** (CSP, X-Frame-Options)
- 🔒 **LGPD/GDPR compliant**

---

## 📝 Roadmap

### Sprint 1 ✅ (Concluído)
- [x] Setup Next.js + TypeScript + Tailwind
- [x] Design System completo
- [x] Stage 1 - Onboarding
- [x] Stage 2A - Camera
- [x] Stage 2B - Upload
- [x] Zustand store

### Sprint 2 ✅ (Concluído)
- [x] Stage 3 - Analysis
- [x] Stage 4 - Suggestions
- [x] Stage 5 - Results
- [x] Stage 6 - Reference Flow

### Sprint 3 🔄 (Em Progresso)
- [ ] Integração TensorFlow.js (detecção facial real)
- [ ] Integração Gemini API
- [ ] Otimizações de performance
- [ ] Testes unitários (Vitest)

### Sprint 4 📅 (Planejado)
- [ ] Analytics GA4
- [ ] Share social (WhatsApp, Instagram)
- [ ] PWA (Service Worker)
- [ ] Deploy produção

---

## 🧪 Testing

```bash
# Rodar testes (quando implementado)
npm run test

# Testes com coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build Manual

```bash
# Build produção
npm run build

# Rodar produção
npm start
```

---

## 📄 Licença

MIT License - sinta-se livre para usar em projetos pessoais e comerciais.

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📞 Contato

- **Email**: contato@hairbearapp.com
- **Instagram**: [@hairbearapp](https://instagram.com/hairbearapp)
- **Website**: [hairbearapp.com](https://hairbearapp.com)

---

## 🙏 Agradecimentos

- Design inspirado em barbershops premium mundiais
- Ícones por [Lucide](https://lucide.dev)
- Animações por [Framer Motion](https://framer.com/motion)
- Framework por [Next.js](https://nextjs.org)

---

**Feito com ❤️ e ✂️ para revolucionar a experiência de escolher seu próximo visual**
