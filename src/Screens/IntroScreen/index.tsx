import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Dimensions, Image, TouchableOpacity, View } from 'react-native'

const { width, height } = Dimensions.get('window')

const IntroScreen = () => {
    const navigation = useNavigation<any>()

    return (
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#FFFFFF' }} activeOpacity={0.8} onPress={() => navigation.navigate('moduleSelect')}>
            <Image source={require('../../Assets/Images/Png/introImg.jpg')} resizeMode='cover' style={{ width: width, height: height }} />
        </TouchableOpacity>
    )
}

export default IntroScreen
