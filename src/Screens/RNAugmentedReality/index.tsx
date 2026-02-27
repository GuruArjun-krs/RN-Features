import React, { useEffect, useState } from 'react';
import { ListRenderItem, FlatList, NativeModules, View, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ItemType } from '../../Utils/types';
import ARItem from '../../Components/ARItems';
import { checkARSupport } from '../../Utils/permission';

const { ARViewerModule } = NativeModules;

const dataAndroid: ItemType[] = [
    {
        name: 'Android Url',
        aRUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
    },
];

const dataIOS: ItemType[] = [
    {
        name: 'IOS Url',
        aRUrl: 'https://developer.apple.com/augmented-reality/quick-look/models/biplane/toy_biplane_idle.usdz',
    },
];

const RNArVr = () => {
    const [infoState, setInfoState] = useState({
        arSupported: false,
        arReason: '',
    })

    const onTouchAssetHandler = (item: ItemType) => {
        ARViewerModule.displayInAR(item?.aRUrl);
    };

    useEffect(() => {
        const checkARSupportDevice = async () => {
            const arSupport = await checkARSupport();
            setInfoState((prev) => ({ ...prev, arSupported: arSupport.supported, arReason: arSupport.reason }))
        };
        checkARSupportDevice();
    }, [])

    const renderItem: ListRenderItem<ItemType> = ({ item }) => {
        return <ARItem item={item} onPress={() => onTouchAssetHandler(item)} />;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            {infoState?.arSupported ? (
                <FlatList
                    data={Platform.OS === 'android' ? dataAndroid : dataIOS}
                    renderItem={renderItem}
                />
            ) : (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{infoState?.arReason}</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

export default RNArVr