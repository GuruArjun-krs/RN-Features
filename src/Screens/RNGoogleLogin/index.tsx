import React, { useEffect, useState } from 'react'
import { Alert, Button, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { googleClient } from '../../../googleAuth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const RNGoogleLogin = () => {
    const [infoState, setInfoState] = useState<any>({
        loginDetails: {}
    })

    useEffect(() => {
        googleClient()
    }, [])

    const handleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setInfoState((prev: any) => ({
                ...prev,
                loginDetails: userInfo?.data
            }))
        } catch (error) {
            console.log('Google Signin Error', error);
        }
    }

    const renderResult = (user: any) => {
        return (
            user && Object.entries(user)?.map(([key, value]) => (
                <View key={key}>
                    <Text>{key}: {String(value)}</Text>
                </View>
            ))
        )
    }

    const handleLogout = async () => {
        await GoogleSignin.signOut();
        Alert.alert('Logged out success')
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                <View style={{ flex: 1 }}>
                    <Button color={'green'} title='Login' onPress={handleLogin} />
                </View>
                <View style={{ flex: 1 }}>
                    <Button color={'red'} title='Logout' onPress={handleLogout} />
                </View>
            </View>

            {renderResult(infoState?.loginDetails?.user)}
        </SafeAreaView>
    )
}

export default RNGoogleLogin
