import { useEffect, useState } from 'react';
import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { formatWifiData, getCountryFromBarcode, openExternalLink } from '../../Utils/barCodeUtils';

const RNBarCodeScanner = () => {
    const insets = useSafeAreaInsets()
    const [torchOn, settorchOn] = useState(false);
    const [enableOnCodeScanned, setEnableOnCodeScanned] = useState(true);
    const { requestPermission: requestCameraPermission } = useCameraPermission();
    const device = useCameraDevice('back');

    useEffect(() => {
        handleCameraPermission();
    }, []);

    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: codes => {
            if (enableOnCodeScanned) {
                let value = codes[0]?.value;
                let type = codes[0]?.type;

                if (type === 'qr') {
                    openExternalLink(value as any).catch(error => {
                        showAlert('Detail', formatWifiData(value), false);
                    });
                } else {
                    const countryOfOrigin = getCountryFromBarcode(value);
                    console.log(`Country of Origin for ${value}: ${countryOfOrigin}`);
                    showAlert(value, countryOfOrigin);
                }
                setEnableOnCodeScanned(false);
            }
        },
    });

    const handleCameraPermission = async () => {
        const granted = await requestCameraPermission();

        if (!granted) {
            Alert.alert('Camera permission is required to use the camera. Please grant permission in your device settings.');
            Linking.openSettings();
        }
    };

    const showAlert = (value = '', countryOfOrigin = '', showMoreBtn = true) => {
        Alert.alert(value, countryOfOrigin, showMoreBtn
            ? [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'More',
                    onPress: () => {
                        settorchOn(false);
                        setEnableOnCodeScanned(true);
                        openExternalLink('https://www.barcodelookup.com/' + value);
                    },
                },
            ]
            : [
                {
                    text: 'Cancel',
                    onPress: () => setEnableOnCodeScanned(true),
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    };

    const RoundButtonWithImage = () => {
        return (
            <TouchableOpacity onPress={() => settorchOn(prev => !prev)} style={{ alignItems: 'center', position: 'absolute', zIndex: 1, right: 20, top: insets.top + 20 }}>
                <View style={{ backgroundColor: '#FFF', borderRadius: 50, width: 50, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={torchOn ? require('../../Assets/Images/Png/flashlight_on.png') : require('../../Assets/Images/Png/torch_off.png')} style={{ width: 25, height: 25 }} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            {!device ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ margin: 10 }}>Camera Not Found</Text>
                </View>
            ) : (
                <>
                    <RoundButtonWithImage />
                    <Camera
                        codeScanner={codeScanner}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={true}
                        torch={torchOn ? 'on' : 'off'}
                        onTouchEnd={() => setEnableOnCodeScanned(true)}
                    />
                </>
            )}
        </SafeAreaView>
    )
}

export default RNBarCodeScanner