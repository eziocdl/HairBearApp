/**
 * Mobile Camera Wrapper
 * Abstração que funciona tanto em Web quanto em Mobile (Capacitor)
 */


/**
 * Verifica se está rodando em plataforma nativa (Capacitor)
 */
export function isNativePlatform(): boolean {
    if (typeof window === 'undefined') return false;

    // Capacitor adiciona essa propriedade global
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(window as any).Capacitor;
}

/**
 * Tira foto usando câmera
 * Funciona em Web (getUserMedia) e Mobile (Capacitor)
 */
export async function takePicture(): Promise<Blob | null> {
    try {
        if (isNativePlatform()) {
            // Mobile: Usar Capacitor Camera
            const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');

            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Camera,
                saveToGallery: false,
            });

            // Converter URI para Blob
            if (image.webPath) {
                const response = await fetch(image.webPath);
                const blob = await response.blob();
                return blob;
            }

            return null;
        } else {
            // Web: Implementado diretamente nas páginas
            return null;
        }
    } catch (error) {
        console.error('Erro ao tirar foto:', error);
        return null;
    }
}

/**
 * Escolhe foto da galeria
 * Funciona em Web (input file) e Mobile (Capacitor)
 */
export async function pickFromGallery(): Promise<Blob | null> {
    try {
        if (isNativePlatform()) {
            // Mobile: Usar Capacitor Camera (source: Photos)
            const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');

            const image = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.Uri,
                source: CameraSource.Photos,
            });

            if (image.webPath) {
                const response = await fetch(image.webPath);
                const blob = await response.blob();
                return blob;
            }

            return null;
        } else {
            // Web: implementado na página de upload mesmo
            return null;
        }
    } catch (error) {
        console.error('Erro ao escolher da galeria:', error);
        return null;
    }
}

/**
 * Requisita permissões de câmera (mobile)
 */
export async function requestCameraPermissions(): Promise<boolean> {
    if (!isNativePlatform()) return true; // Web não precisa

    try {
        const { Camera } = await import('@capacitor/camera');
        const permissions = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });

        return permissions.camera === 'granted' || permissions.photos === 'granted';
    } catch (error) {
        console.error('Erro ao requisitar permissões:', error);
        return false;
    }
}

/**
 * Verifica se tem permissões de câmera
 */
export async function checkCameraPermissions(): Promise<boolean> {
    if (!isNativePlatform()) return true;

    try {
        const { Camera } = await import('@capacitor/camera');
        const permissions = await Camera.checkPermissions();

        return permissions.camera === 'granted' || permissions.photos === 'granted';
    } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        return false;
    }
}
