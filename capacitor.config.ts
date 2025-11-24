import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.hairbear.app',
    appName: 'HairBearApp',
    webDir: 'out', // Next.js static export directory

    server: {
        androidScheme: 'https',
        // Para desenvolvimento local (descomentar se necessário):
        // url: 'http://192.168.1.100:3000',
        // cleartext: true,
    },

    android: {
        buildOptions: {
            // Keystore para release build (criar depois)
            // keystorePath: 'android/keystore.jks',
            // keystoreAlias: 'hairbearapp',
        },
        allowMixedContent: false,
    },

    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            launchAutoHide: true,
            backgroundColor: '#0f172a', // Dark theme
            androidScaleType: 'CENTER_CROP',
            showSpinner: false,
            androidSpinnerStyle: 'large',
            iosSpinnerStyle: 'small',
            spinnerColor: '#10b981', // Primary green
        },

        Camera: {
            // Permissões serão configuradas no AndroidManifest.xml
        },

        StatusBar: {
            style: 'dark',
            backgroundColor: '#0f172a',
        },
    },
};

export default config;
