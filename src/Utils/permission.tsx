import { PermissionsAndroid, Platform, NativeModules } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
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

export const requestNotificationPermission = async () => {
    if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
};

export const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
        const auth = await Geolocation.requestAuthorization('whenInUse');
        return auth === 'granted';
    }

    if (Platform.OS === 'android') {
        try {
            // 1. Check if we already have it first (Prevents unnecessary Activity calls)
            const hasPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );
            if (hasPermission) return true;

            // 2. If not, request it
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your GPS to work offline.',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.error("Permission Request Error:", err);
            return false;
        }
    }
    return false;
};