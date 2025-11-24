# 📘 DOCUMENTAÇÃO TÉCNICA COMPLETA - HairBearApp

## 🎯 Visão Geral do Projeto

**HairBearApp** é uma aplicação web/mobile para simulação de cortes de cabelo e estilos de barba usando Inteligência Artificial. Permite que usuários visualizem seu novo visual ANTES de ir ao barbeiro, com processamento 100% privado e gratuito.

---

## 📋 ÍNDICE

1. [Arquitetura](#arquitetura)
2. [Tech Stack](#tech-stack)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Funcionalidades](#funcionalidades)
5. [Fluxos de Usuário](#fluxos-de-usuário)
6. [Componentes](#componentes)
7. [State Management](#state-management)
8. [APIs e Integrações](#apis-e-integrações)
9. [Mobile (Capacitor)](#mobile-capacitor)
10. [Deploy](#deploy)
11. [Troubleshooting](#troubleshooting)

---

## 🏗️ ARQUITETURA

### **Diagrama de Arquitetura**

```
┌─────────────────────────────────────────────────────┐
│                   PRESENTATION                      │
│  ┌─────────────────────────────────────────────┐  │
│  │  Next.js 14 App Router                      │  │
│  │  - Server Components (Static Export)        │  │
│  │  - Client Components                        │  │
│  │  - React 18 + TypeScript                    │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                   UI COMPONENTS                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │  Button  │  │   Card   │  │  Framer      │    │
│  │  (4 var) │  │(dragable)│  │  Motion      │    │
│  └──────────┘  └──────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                  STATE MANAGEMENT                   │
│  ┌─────────────────────────────────────────────┐  │
│  │  Zustand Store                              │  │
│  │  - Photos (base, reference)                 │  │
│  │  - Flow (stage, isReference)                │  │
│  │  - Selection (style, choice)                │  │
│  │  - Results (images, quiz)                   │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                   STYLING                           │
│  ┌─────────────────────────────────────────────┐  │
│  │  Tailwind CSS 3.4                           │  │
│  │  - Custom colors (emerald, slate)           │  │
│  │  - Custom animations                        │  │
│  │  - Responsive breakpoints                   │  │
│  │  - Dark theme default                       │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│            MOBILE BRIDGE (Capacitor)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │  Camera  │  │  Share   │  │  Status Bar  │    │
│  │  API     │  │  API     │  │  Splash API  │    │
│  └──────────┘  └──────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              NATIVE PLATFORM                        │
│  ┌──────────────────┐  ┌──────────────────┐       │
│  │   Android APK    │  │   Web Browser    │       │
│  └──────────────────┘  └──────────────────┘       │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ TECH STACK

### **Core Technologies**

| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| **Next.js** | 14.2.18 | Framework React c/ App Router + Static Export |
| **React** | 18.3.1 | UI Library |
| **TypeScript** | 5.x | Type safety e DX |
| **Tailwind CSS** | 3.4.1 | Utility-first styling |
| **Node.js** | 18.18+ | Runtime (20+ recomendado) |

### **State & Data**

| Library | Versão | Uso |
|---------|--------|-----|
| **Zustand** | 4.5.0 | State management global |
| **Zod** | 3.22.0 | Schema validation |
| **React Hook Form** | 7.51.0 | Form handling (futuro) |

### **UI & Animations**

| Library | Versão | Uso |
|---------|--------|-----|
| **Framer Motion** | 11.0.0 | Animações suaves |
| **Lucide React** | 0.350.0 | Ícones modernos |
| **Sonner** | 1.4.0 | Toast notifications |

### **Mobile (Capacitor)**

| Plugin | Versão | Uso |
|--------|--------|-----|
| **@capacitor/core** | 7.4.4 | Runtime core |
| **@capacitor/camera** | Latest | Acesso à câmera |
| **@capacitor/share** | Latest | Compartilhamento |
| **@capacitor/status-bar** | Latest | Status bar styling |

### **Testing & Quality**

| Tool | Versão | Uso |
|------|--------|-----|
| **Vitest** | 4.0.13 | Test runner |
| **Testing Library** | Latest | Component testing |
| **ESLint** | 8.x | Code linting |

---

## 📁 ESTRUTURA DE ARQUIVOS

```
hairbearapp/
├── .github/
│   └── workflows/
│       └── ci.yml                    # CI/CD pipeline
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Stage 1 - Onboarding
│   ├── globals.css                   # Global styles
│   ├── error.tsx                     # Error boundary
│   ├── not-found.tsx                 # 404 page
│   │
│   ├── camera/
│   │   └── page.tsx                  # Stage 2A - Camera
│   ├── upload/
│   │   └── page.tsx                  # Stage 2B - Upload
│   ├── analysis/
│   │   └── page.tsx                  # Stage 3 - Analysis
│   ├── suggestions/
│   │   └── page.tsx                  # Stage 4 - Suggestions
│   ├── results/
│   │   └── page.tsx                  # Stage 5 - Results
│   ├── reference/
│   │   └── page.tsx                  # Stage 6 - Reference
│   ├── quiz/
│   │   └── page.tsx                  # Extra - Quiz
│   └── pricing/
│       └── page.tsx                  # Extra - Pricing
│
├── components/
│   └── ui/
│       ├── Button.tsx                # Button component
│       ├── Button.test.tsx           # Button tests
│       ├── Card.tsx                  # Card component
│       └── Card.test.tsx             # Card tests
│
├── lib/
│   ├── store.ts                      # Zustand store
│   ├── store.test.ts                 # Store tests
│   ├── env.ts                        # Env validation
│   └── mobile/
│       ├── camera.ts                 # Camera wrapper
│       └── share.ts                  # Share wrapper
│
├── public/                           # Static assets
│   ├── hero-bg.png
│   ├── before.png
│   ├── after.png
│   └── [style-images]...
│
├── node_modules/                     # Dependencies
│
├── .env.example                      # Env vars template
├── .gitignore                        # Git ignore rules
├── capacitor.config.ts               # Capacitor config
├── next.config.js                    # Next.js config
├── package.json                      # Dependencies
├── tailwind.config.js                # Tailwind config
├── tsconfig.json                     # TypeScript config
├── vitest.config.ts                  # Vitest config
│
└── [DOCUMENTATION]/
    ├── README.md                     # Project overview
    ├── CHECKLIST.md                  # Complete checklist
    ├── DEPLOY.md                     # Deploy guide
    ├── MOBILE.md                     # Mobile guide
    ├── ASSETS.md                     # Assets guide
    └── DOCUMENTATION.md              # This file
```

---

## ⚙️ FUNCIONALIDADES

### **1. Onboarding (Stage 1)**

**Rota**: `/`  
**Arquivo**: `app/page.tsx`

#### Features:
- Hero section com gradiente e glassmorphism
- CTAs primários ("Tirar Foto" / "Upload da Galeria")
- Trust badges (100% Privado, Gratuito, Rápido)
- Social proof e reviews
- Features highlight
- Footer com links

#### Tecnologias:
- Framer Motion (animações de entrada)
- Lucide Icons (ícones)
- Tailwind gradients

#### Navegação:
```
→ "Tirar Foto" → /camera
→ "Upload" → /upload
→ "Usar Referência" → /reference
```

---

### **2A. Camera Capture (Stage 2A)**

**Rota**: `/camera`  
**Arquivo**: `app/camera/page.tsx`

#### Features:
- Acesso à câmera do device
- Preview em tempo real (placeholder)
- Detecção facial (placeholder para TensorFlow.js)
- Captura de foto
- Armazenamento em Zustand

#### APIs Usadas:
- **Web**: `navigator.mediaDevices.getUserMedia`
- **Mobile**: Capacitor Camera API (via wrapper)

#### Fluxo:
```
1. Request permissão câmera
2. Mostrar preview stream
3. Usuário captura foto
4. Salvar no store (basePhoto)
5. Navegar → /analysis
```

---

### **2B. Upload Photo (Stage 2B)**

**Rota**: `/upload`  
**Arquivo**: `app/upload/page.tsx`

#### Features:
- Drag-and-drop zone
- Click to upload
- Preview de imagem
- Validação (tipo, tamanho)
- Progress feedback

#### Validações:
```typescript
- Tipos aceitos: image/jpeg, image/png, image/webp
- Tamanho máx: 10 MB
- Dimensão mín: 300x300px
```

#### Fluxo:
```
1. Usuário arrasta/seleciona foto
2. Validar arquivo
3. Criar preview
4. Salvar no store (basePhoto)
5. Navegar → /analysis
```

---

### **3. AI Analysis (Stage 3)**

**Rota**: `/analysis`  
**Arquivo**: `app/analysis/page.tsx`

#### Features:
- Loading animation (Framer Motion)
- Progress bar (0% → 100%)
- Status messages simulados
- Auto-navegação para sugestões

#### Simulação:
```typescript
States:
- Detectando rosto... (30%)
- Analisando formato... (60%)
- Gerando sugestões... (90%)
- Concluído! (100%)

Tempo total: ~3 segundos
```

#### Fluxo:
```
1. Entrar na página
2. Mostrar loading com progresso
3. Auto-navegar → /suggestions (3s)
```

---

### **4. Style Suggestions (Stage 4)**

**Rota**: `/suggestions`  
**Arquivo**: `app/suggestions/page.tsx`

#### Features:
- Grid de 5 estilos de corte
- Grid de 5 estilos de barba
- Cards hoverable com scale effect
- Seleção de estilo
- Múltiplas escolhas (cabelo, barba, ambos)

#### Estilos Disponíveis:

**Cabelo:**
- Pompadour
- Fade Moderno
- Buzz Cut
- Side Part
- Undercut

**Barba:**
- Barba Cheia
- Cavanhaque
- Bigode Estilizado
- 3 Dias
- Clean Shave

#### Fluxo:
```
1. Escolher tipo (haircut / beard / both)
2. Selecionar estilo
3. Salvar no store (selectedStyle, selectedChoice)
4. Navegar → /results
```

---

### **5. Results Display (Stage 5)**

**Rota**: `/results`  
**Arquivo**: `app/results/page.tsx`

#### Features:
- Carousel com 5 variações
- Before/After comparison
- Botões de ação:
  - Compartilhar (Web Share API / Capacitor)
  - Baixar resultado
  - Tentar outro estilo
  - Novo processo

#### Tecnologias:
- Framer Motion (carousel animation)
- Capacitor Share (mobile)
- Canvas API (future: merge images)

#### Fluxo:
```
1. Mostrar resultados em carousel
2. Usuário navega entre variações
3. Opções:
   → Compartilhar (share API)
   → Voltar sugestões
   → Reiniciar (reset store)
```

---

### **6. Reference Flow (Stage 6)**

**Rota**: `/reference`  
**Arquivo**: `app/reference/page.tsx`

#### Features:
- Upload de foto própria
- Upload de foto referência
- Comparação lado-a-lado
- Processamento customizado

#### Diferencial:
Usa foto de referência (celebridade, amigo, etc) ao invés de estilos predefinidos.

#### Fluxo:
```
1. Upload base photo
2. Upload reference photo
3. Salvar ambos no store
4. Navegar → /analysis
5. Resultados baseados em referência
```

---

### **Extra: Quiz (Bonus)**

**Rota**: `/quiz`  
**Arquivo**: `app/quiz/page.tsx`

#### Features:
- Questionário de formato de rosto
- Tipo de cabelo
- Preferências de estilo
- Recomendações personalizadas

#### Fluxo:
```
1. Responder perguntas
2. Salvar quiz results
3. Gerar sugestões customizadas
```

---

### **Extra: Pricing**

**Rota**: `/pricing`  
**Arquivo**: `app/pricing/page.tsx`

#### Features:
- Plano 100% gratuito
- Features destacadas
- CTA para começar

---

## 🎨 COMPONENTES

### **Button Component**

**Arquivo**: `components/ui/Button.tsx`

#### Props:
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}
```

#### Variantes:
- **Primary**: Gradient green (CTA principal)
- **Secondary**: Border slate (ação secundária)
- **Outline**: Border primary (destaque)
- **Ghost**: Transparente (ação leve)

#### Uso:
```tsx
<Button variant="primary" size="lg" onClick={handleClick}>
  Começar Agora
</Button>
```

---

### **Card Component**

**Arquivo**: `components/ui/Card.tsx`

#### Props:
```typescript
interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
  className?: string;
  onDragEnter?: React.DragEventHandler;
  onDragLeave?: React.DragEventHandler;
  onDragOver?: React.DragEventHandler;
  onDrop?: React.DragEventHandler;
}
```

#### Features:
- Glassmorphism effect
- Hover scale animation (if hoverable)
- Drag-and-drop support

#### Uso:
```tsx
<Card hoverable onClick={handleSelect}>
  <img src="style.png" />
  <h3>Pompadour</h3>
</Card>
```

---

## 🗄️ STATE MANAGEMENT

### **Zustand Store**

**Arquivo**: `lib/store.ts`

#### States:
```typescript
interface AppState {
  // Photos
  basePhoto: Blob | null;
  referencePhoto: Blob | null;
  
  // Flow
  currentStage: 'onboarding' | 'camera' | 'upload' | ...;
  isReferenceFlow: boolean;
  
  // Selection
  selectedStyle: string | null;
  selectedChoice: 'haircut' | 'haircut_beard' | 'beard' | null;
  
  // Results
  resultImages: string[];
  
  // Quiz
  quizResults: {
    faceShape: string | null;
    hairType: string | null;
    stylePreference: string | null;
  };
}
```

#### Actions:
```typescript
- setBasePhoto(photo: Blob)
- setReferencePhoto(photo: Blob)
- setCurrentStage(stage: string)
- setIsReferenceFlow(bool: boolean)
- setSelectedStyle(style: string)
- setSelectedChoice(choice: string)
- setResultImages(images: string[])
- setQuizResults(results: object)
- reset() // Limpar tudo
```

#### Uso:
```tsx
import { useAppStore } from '@/lib/store';

function Component() {
  const basePhoto = useAppStore(state => state.basePhoto);
  const setBasePhoto = useAppStore(state => state.setBasePhoto);
  
  // ...
}
```

---

## 🔌 APIS E INTEGRAÇÕES

### **Futuras Integrações (Planejado)**

#### **1. Gemini API**
```typescript
// POST /api/gemini/analyze
Body: { photo: File }
Response: { 
  cortes: [{ id, name, preview }],
  barbas: [{ id, name, preview }]
}
```

#### **2. TensorFlow.js**
```typescript
// Detecção facial client-side
import * as facemesh from '@tensorflow-models/face-landmarks-detection';

const model = await facemesh.load();
const predictions = await model.estimateFaces(image);
```

---

## 📱 MOBILE (CAPACITOR)

### **Configuração**

#### **next.config.js**
```javascript
const nextConfig = {
  output: 'export',        // Static HTML export
  trailingSlash: true,     // URLs com /
  images: {
    unoptimized: true,     // Disable Next/Image optimization
  },
};
```

#### **capacitor.config.ts**
```typescript
const config: CapacitorConfig = {
  appId: 'com.hairbear.app',
  appName: 'HairBearApp',
  webDir: 'out',           // Next.js export dir
  
  server: {
    androidScheme: 'https',
  },
  
  plugins: {
    SplashScreen: {
      backgroundColor: '#0f172a',
      showSpinner: false,
    },
  },
};
```

### **Camera Wrapper**

**Arquivo**: `lib/mobile/camera.ts`

#### Features:
- Platform detection (web vs mobile)
- Web: retorna null (usa getUserMedia na página)
- Mobile: usa Capacitor Camera API

#### Uso:
```typescript
import { takePicture, isNativePlatform } from '@/lib/mobile/camera';

if (isNativePlatform()) {
  const blob = await takePicture();
} else {
  // Web camera flow
}
```

### **Share Wrapper**

**Arquivo**: `lib/mobile/share.ts`

#### Features:
- Web Share API (web)
- Capacitor Share (mobile)
- Fallbacks (clipboard, new tab)

#### Uso:
```typescript
import { shareImage } from '@/lib/mobile/share';

await shareImage(imageUrl, 'Meu novo visual');
```

---

## 🚀 DEPLOY

### **Build Commands**

```bash
# Development
npm run dev              # http://localhost:3000

# Type check
npm run type-check       # TSC validation

# Build
npm run build            # Static export → out/

# Production
npm start                # Serve build locally
```

### **Vercel Deploy**
```bash
vercel --prod
```

### **Capacitor Build**
```bash
# 1. Build Next.js
npm run build

# 2. Copy to Android
npx cap copy android

# 3. Open Android Studio
npx cap open android

# 4. Build APK/AAB
# Via Android Studio: Build > Generate Signed Bundle/APK
```

---

## 🐛 TROUBLESHOOTING

### **Erro: Cannot find module '@capacitor/*'**
```bash
# Solução: Instalar dependências
npm install @capacitor/core @capacitor/cli @capacitor/camera
```

### **Erro: Vitest requires Node 20+**
```bash
# Opção 1: Atualizar Node
nvm install 20 && nvm use 20

# Opção 2: Skip testes
# Comentar scripts de test no package.json
```

### **Build falha: output: 'export'**
```bash
# Verificar: next.config.js deve ter output: 'export'
# Remover: API Routes (não funcionam em static export)
```

---

## 📊 MÉTRICAS

### **Bundle Size**
- Shared JS: 87.3 KB
- Página média: 130 KB
- Total build: ~2 MB (out/)

### **Performance**
- Build time: ~15-20s
- Pages: 13 static
- Images: Unoptimized (for Capacitor)

---

## 👥 CONTRIBUINDO

1. Fork o projeto
2. Crie branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add feature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Pull Request

---

## 📄 LICENÇA

MIT License - Uso livre para projetos pessoais e comerciais.

---

**Documentação criada em**: 24/11/2025  
**Versão**: 1.0.0  
**Autor**: Antigravity AI
