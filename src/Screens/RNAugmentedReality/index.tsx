import React from 'react';
import { ListRenderItem, FlatList, NativeModules } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemType } from '../../Utils/types';
import ARItem from '../../Components/ARItems';
import data from "../../Static/VrFiles"

const { ARViewerModule } = NativeModules;

const RNArVr = () => {
    const onTouchAssetHandler = (item: ItemType) => {
        ARViewerModule.displayInAR(item?.aRUrl);
    };

    const renderItem: ListRenderItem<ItemType> = ({ item }) => {
        return <ARItem item={item} onPress={() => onTouchAssetHandler(item)} />;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <FlatList
                data={data}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
}

export default RNArVr