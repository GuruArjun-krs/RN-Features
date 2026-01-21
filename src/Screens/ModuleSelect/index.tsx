import React from 'react'
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native';

const ModuleSelect = () => {
    const navigation = useNavigation<any>()
    const { width } = Dimensions.get('window')

    const routesName = [
        { name: 'RN Map', routeName: 'rnmap', bgColor: '#000000', textClr: '#FFFFFF' },
        { name: 'RN Google Login', routeName: 'RNGoogleLogin', bgColor: '#000000', textClr: '#FFFFFF' },
        { name: 'RN Argument Reality', routeName: 'RNArVr', bgColor: '#000000', textClr: '#FFFFFF' }
    ];

    const renderRoutes = ({ item }: any) => {
        return (
            <TouchableOpacity style={{ width: width * 0.5, backgroundColor: item?.bgColor, alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: '#FFFFFF' }} onPress={() => navigation.navigate(item.routeName)}>
                <Text style={{ color: item?.textClr }}>{item?.name}</Text>
            </TouchableOpacity>
        );
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={routesName}
                renderItem={renderRoutes}
                style={{ flex: 1 }}
                numColumns={2}
            />
        </SafeAreaView>
    )
}

export default ModuleSelect
