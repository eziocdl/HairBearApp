# 🎨 Guia de Assets para Android - HairBearApp

## 📋 Checklist de Assets Necessários

### **Ícones do App (Obrigatório)**

#### Android Requirements
```
android/app/src/main/res/
├── mipmap-mdpi/
│   └── ic_launcher.png         (48x48)
│   └── ic_launcher_round.png   (48x48)
├── mipmap-hdpi/
│   └── ic_launcher.png         (72x72)
│   └── ic_launcher_round.png   (72x72)
├── mipmap-xhdpi/
│   └── ic_launcher.png         (96x96)
│   └── ic_launcher_round.png   (96x96)
├── mipmap-xxhdpi/
│   └── ic_launcher.png         (144x144)
│   └── ic_launcher_round.png   (144x144)
└── mipmap-xxxhdpi/
    └── ic_launcher.png         (192x192)
    └── ic_launcher_round.png   (192x192)
```

---

## 🚀 Forma FÁCIL - Gerar Automaticamente

### Opção 1: Capacitor Assets Tool (Recomendado)

```bash
# 1. Criar ícone master (1024x1024)
# Pode usar Figma, Canva, ou qualquer editor
# Salvar como: resources/icon.png

# 2. Criar splash screen (2732x2732 recommended)
# Salvar como: resources/splash.png

# 3. Gerar todos os tamanhos automaticamente
npm install -g @capacitor/assets
capacitor-assets generate --android
```

### Opção 2: Android Asset Studio (Online)

1. Acesse: https://romannurik.github.io/AndroidAssetStudio/
2. Escolha "Launcher icon generator"
3. Upload seu ícone master
4. Download zip com todos os tamanhos
5. Extrair em `android/app/src/main/res/`

---

## 🎨 Design do Ícone - Sugestões

### Conceito para HairBearApp

```
┌─────────────────┐
│                 │
│    🧔 + ✂️      │  ← Emoji ou ícone estilizado
│                 │
│   HairBear      │  ← Texto opcional
│                 │
└─────────────────┘

Cores sugeridas:
- Background: #0f172a (dark slate)
- Ícone: #10b981 (emerald green - primary)
- Accent: #f59e0b (amber)
```

### Ferramentas para Criar Ícone

1. **Figma** (Grátis): https://figma.com
2. **Canva** (Grátis): https://canva.com
3. **Inkscape** (Grátis, open source)
4. **Adobe Illustrator** (Pago)

---

## 🖼️ Splash Screen

### Tamanhos Recomendados

```
resources/
└── splash.png (2732x2732) - Centro 1200x1200 safe zone
```

### Design Sugestão

```
┌───────────────────────────────┐
│                               │
│                               │
│          ┌─────────┐          │
│          │         │          │
│          │  LOGO   │          │  ← Centralizado
│          │         │          │
│          └─────────┘          │
│                               │
│        HairBearApp            │  ← Nome do app
│                               │
│                               │
└───────────────────────────────┘

Background: #0f172a (dark)
Logo: #10b981 (green)
Texto: #f1f5f9 (light)
```

---

## 📱 Google Play Store Assets

### Obrigatórios

| Asset | Tamanho | Formato | Descrição |
|-------|---------|---------|-----------|
| **Ícone do app** | 512x512 | PNG | Ícone principal (32-bit PNG) |
| **Feature Graphic** | 1024x500 | PNG ou JPG | Banner principal da loja |
| **Screenshots Phone** | 320-3840px width | PNG ou JPG | Mínimo 2, máximo 8 |

### Opcionais (mas recomendados)

| Asset | Tamanho | Formato |
|-------|---------|---------|
| Screenshots Tablet 7" | 600-3840px | PNG/JPG |
| Screenshots Tablet 10" | 1080-3840px | PNG/JPG |
| Video Promocional | Máx 30s | YouTube |

---

## 📸 Screenshots Recomendados

Capturar em diferentes stages:

1. **Onboarding** (Stage 1)
   - Landing page com CTAs

2. **Camera** (Stage 2)
   - Interface de captura

3. **Suggestions** (Stage 4)
   - Grid de estilos disponíveis

4. **Results** (Stage 5)
   - Carousel com antes/depois
   - Resultado final premium

5. **Reference Flow** (Stage 6)
   - Upload de referência

### Ferramentas para Screenshots

```bash
# Emulador Android Studio
1. Abrir emulador
2. Rodar app
3. Tools > AVD Manager > Camera icon (screenshot)

# Dispositivo real
1. Conectar USB
2. Habilitar Developer Options
3. adb shell screencap -p /sdcard/screenshot.png
```

---

## 🎯 Exemplo de Estrutura Final

```
hairbearapp/
├── resources/               # Assets master
│   ├── icon.png            (1024x1024)
│   ├── splash.png          (2732x2732)
│   └── playstore/
│       ├── icon-512.png
│       ├── feature-graphic.png
│       └── screenshots/
│           ├── phone-1.png
│           ├── phone-2.png
│           ├── phone-3.png
│           └── phone-4.png
│
└── android/                # Gerado automaticamente
    └── app/src/main/res/
        ├── mipmap-mdpi/
        ├── mipmap-hdpi/
        └── ...
```

---

## ⚡ Quick Start

### Gerar Assets em 5 Minutos

```bash
# 1. Criar pastas
mkdir -p resources/playstore/screenshots

# 2. Criar ícone master no Canva/Figma
# Baixar como icon.png (1024x1024)
# Salvar em: resources/icon.png

# 3. Criar splash (opcional, pode usar ícone mesmo)
cp resources/icon.png resources/splash.png

# 4. Gerar todos os tamanhos
npm install -g @capacitor/assets
capacitor-assets generate --android

# 5. Pronto! ✅
```

---

## 🎨 Templates Prontos (opcional)

Se quiser usar templates prontos:

1. **Flaticon**: https://flaticon.com (ícones grátis)
2. **Icons8**: https://icons8.com (biblioteca gigante)
3. **Freepik**: https://freepik.com (vetores)

**Lembre-se:** Verificar licença para uso comercial!

---

## ✅ Checklist Final

Antes de submeter para Play Store:

- [ ] Ícone 512x512 PNG criado
- [ ] Feature graphic 1024x500 criado
- [ ] Mínimo 2 screenshots phone
- [ ] Ícones gerados para Android (todos os tamanhos)
- [ ] Splash screen configurado
- [ ] Testado em emulador
- [ ] Testado em dispositivo real

---

## 💡 Dica Pro

Para review rápido na Play Store, invista tempo em:

1. ✨ Screenshots **bonitos** e **profissionais**
2. 🎨 Feature graphic **impactante**
3. 📝 Descrição **clara** e **objetiva**

**Tempo estimado:** 2-3 horas para criar todos os assets do zero.

---

**Próximo passo:** Depois de criar os assets, seguir [MOBILE.md](./MOBILE.md) para build e deploy!
