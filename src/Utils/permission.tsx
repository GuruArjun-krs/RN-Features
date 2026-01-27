import { PermissionsAndroid, Platform, NativeModules } from 'react-native';
const { ARViewerModule } = NativeModules;

export const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
};

export const checkARSupport = async (): Promise<{ supported: boolean, reason?: any }> => {

    if (!ARViewerModule || !ARViewerModule.isARSupportedOnDevice) {
        return { supported: false, reason: 'AR module not available.' };
    }

    return new Promise(resolve => {
        try {
            ARViewerModule.isARSupportedOnDevice((result: string) => {
                switch (result) {
                    case 'SUPPORTED':
                        resolve({ supported: true });
                        break;
                    case 'UNAVAILABLE':
                        resolve({
                            supported: false,
                            reason: Platform.OS === 'android' ? 'Google Play Services for AR not installed.' : 'ARKit unavailable on this device.',
                        });
                        break;
                    case 'TRANSIENT':
                    default:
                        resolve({
                            supported: false,
                            reason: 'This device does not support AR features.',
                        });
                        break;
                }
            });
        } catch (err) {
            console.log('Error checking AR support:', err);
            resolve({ supported: false, reason: 'Error invoking AR check.' });
        }
    });
};
