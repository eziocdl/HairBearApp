# 📱 Guia de Conversão para App Android - Ionic/Capacitor

## Overview

Este guia vai transformar o HairBearApp em um app nativo Android usando Capacitor (sucessor do Cordova).

---

## 🚀 Instalação do Capacitor

### 1. Instalar Dependências

```bash
# Instalar Capacitor
npm install @capacitor/core @capacitor/cli

# Inicializar Capacitor
npx cap init
# App name: HairBearApp
# App ID: com.hairbear.app (formato reverse domain)
# Web dir: out (Next.js com static export)

# Adicionar plataforma Android
npm install @capacitor/android
npx cap add android
```

---

## 📝 Configurações Necessárias

### 2. Atualizar `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ⚠️ OBRIGATÓRIO para Capacitor
  trailingSlash: true,
  images: {
    unoptimized: true, // Next/Image não funciona em static export
  },
  reactStrictMode: true,

  // Headers de segurança (não aplicam em static export, mas manter)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 3. Criar `capacitor.config.ts`

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hairbear.app',
  appName: 'HairBearApp',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    // Para desenvolvimento local:
    // url: 'http://192.168.1.100:3000',
    // cleartext: true,
  },
  android: {
    buildOptions: {
      keystorePath: 'android/keystore.jks', // Para produção
      keystoreAlias: 'hairbearapp',
    },
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0f172a',
      showSpinner: false,
    },
    Camera: {
      permissions: {
        camera: 'needed',
      },
    },
  },
};

export default config;
```

---

## 📸 Plugins Capacitor Úteis

### 4. Instalar Plugins para Features do App

```bash
# Camera (para captura de foto)
npm install @capacitor/camera

# Filesystem (para salvar imagens)
npm install @capacitor/filesystem

# Share (para compartilhamento social)
npm install @capacitor/share

# Status Bar (estilização)
npm install @capacitor/status-bar

# Splash Screen
npm install @capacitor/splash-screen

# Haptics (vibração feedback)
npm install @capacitor/haptics

# Toast (notificações nativas)
npm install @capacitor/toast
```

---

## 🔧 Adaptações no Código

### 5. Wrapper para Camera (exemplo)

Criar `lib/mobile/camera.ts`:

```typescript
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export async function takePicture(): Promise<Blob | null> {
  // Verificar se está rodando em mobile
  if (!Capacitor.isNativePlatform()) {
    // Fallback para web (usar getUserMedia)
    return null;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });

    // Converter para Blob
    const response = await fetch(image.webPath!);
    const blob = await response.blob();
    
    return blob;
  } catch (error) {
    console.error('Camera error:', error);
    return null;
  }
}

export async function pickFromGallery(): Promise<Blob | null> {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });

    const response = await fetch(image.webPath!);
    const blob = await response.blob();
    
    return blob;
  } catch (error) {
    console.error('Gallery error:', error);
    return null;
  }
}
```

### 6. Wrapper para Share (exemplo)

Criar `lib/mobile/share.ts`:

```typescript
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export async function shareImage(imageUrl: string, title: string) {
  if (!Capacitor.isNativePlatform()) {
    // Fallback para Web Share API
    if (navigator.share) {
      await navigator.share({
        title,
        text: 'Olha meu novo visual no HairBearApp!',
        url: imageUrl,
      });
    }
    return;
  }

  await Share.share({
    title,
    text: 'Olha meu novo visual no HairBearApp!',
    url: imageUrl,
    dialogTitle: 'Compartilhar resultado',
  });
}
```

---

## 🏗️ Build e Deploy Android

### 7. Build para Android

```bash
# 1. Build do Next.js (static export)
npm run build

# 2. Copiar arquivos para Android
npx cap copy android

# 3. Abrir no Android Studio
npx cap open android
```

### 8. No Android Studio

1. **Configurar Gradle**:
   - Build > Select Build Variant > release
   
2. **Gerar APK assinado**:
   - Build > Generate Signed Bundle / APK
   - Escolha APK
   - Crie keystore novo ou use existente
   
3. **Configurar permissões** em `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
    <!-- Permissões -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" 
                     android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.INTERNET" />
    
    <!-- Feature camera -->
    <uses-feature android:name="android.hardware.camera" android:required="true" />
    
    <application>
        <!-- Configurações -->
    </application>
</manifest>
```

---

## 📦 Publicar na Google Play Store

### 9. Requisitos

- ✅ Conta Google Play Developer ($25 taxa única)
- ✅ APK/AAB assinado
- ✅ Ícones do app (512x512, 192x192, etc)
- ✅ Screenshots (diferentes tamanhos de tela)
- ✅ Descrição curta (80 chars)
- ✅ Descrição longa (4000 chars)
- ✅ Política de privacidade URL

### 10. Checklist Google Play

- [ ] **Ícone do app**: 512x512 PNG
- [ ] **Feature Graphic**: 1024x500 PNG
- [ ] **Screenshots**: 
  - Phone: 2 mínimo (320-3840 width)
  - Tablet 7": opcional
  - Tablet 10": opcional
- [ ] **Descrição Curta**: Max 80 caracteres
- [ ] **Descrição Longa**: Max 4000 caracteres
- [ ] **Categoria**: Beleza / Lifestyle
- [ ] **Classificação de conteúdo**: Preencher questionário
- [ ] **Política de Privacidade**: URL obrigatória
- [ ] **APK/AAB**: Assinado com keystore

### 11. Assets para Google Play

Criar pasta `marketing/`:

```
marketing/
├── icon-512.png         # Ícone principal
├── feature-graphic.png  # 1024x500
├── screenshots/
│   ├── phone-1.png
│   ├── phone-2.png
│   ├── phone-3.png
│   └── ...
└── privacy-policy.md    # Hospedar em algum lugar
```

---

## 🎯 Exemplo de Descrição para Google Play

### Título
```
HairBearApp - Simulador de Cortes IA
```

### Descrição Curta
```
Veja seu novo visual antes de ir ao barbeiro! Simulador de cortes com IA 100% grátis
```

### Descrição Longa
```
🧔 DESCUBRA SEU PRÓXIMO VISUAL COM IA

O HairBearApp é o simulador de cortes de cabelo e barba mais prático do Brasil! 
Tire uma foto e veja como você ficaria com diferentes estilos - tudo isso ANTES 
de ir ao barbeiro.

✨ RECURSOS PRINCIPAIS:

📸 Captura Instantânea
• Tire uma foto ou escolha da galeria
• Processamento rápido com IA

🎨 Estilos Variados
• Pompadour, Fade, Buzz Cut, Side Part
• Estilos de barba profissionais
• Combinações de cabelo + barba

🔒 100% Privado
• Zero armazenamento de fotos
• Processamento local no seu celular
• Seus dados são seus

📱 Mobile-First
• Interface otimizada para celular
• Navegação intuitiva
• Resultados em segundos

⚡ Totalmente Gratuito
• Sem anúncios invasivos
• Sem compras dentro do app
• Todas as funcionalidades liberadas

👨‍💼 QUEM DEVE USAR?

• Homens que querem mudar o visual
• Quem tem medo de errar no corte
• Barbeiros que querem mostrar estilos aos clientes
• Qualquer pessoa curiosa sobre novos looks

🎯 COMO FUNCIONA?

1. Tire ou escolha uma foto
2. Selecione estilos de corte ou barba
3. Veja os resultados realistas
4. Compartilhe com amigos ou leve ao barbeiro!

📞 SUPORTE

Dúvidas ou sugestões? Entre em contato:
contato@hairbearapp.com

Transforme seu visual com confiança! 💈✂️
```

---

## 🚨 Troubleshooting Comum

### Build fails no Android
```bash
# Limpar e rebuild
cd android
./gradlew clean
cd ..
npx cap sync android
```

### Imagens não aparecem
- Verificar `images.unoptimized: true` no next.config.js
- Usar caminhos relativos ou base64

### Camera não funciona
- Verificar permissões no AndroidManifest.xml
- Testar em dispositivo real (não emulador)

---

## 📚 Recursos Úteis

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Studio Download](https://developer.android.com/studio)
- [Google Play Console](https://play.google.com/console)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)

---

## 🎓 Próximos Passos

1. ✅ Completar features web primeiro
2. ✅ Testar extensivamente no browser
3. ⏭️ Instalar Capacitor
4. ⏭️ Configurar plugins necessários
5. ⏭️ Build e testar no Android
6. ⏭️ Preparar assets para Google Play
7. ⏭️ Submeter para review

**Boa sorte com o lançamento! 🚀📱**
