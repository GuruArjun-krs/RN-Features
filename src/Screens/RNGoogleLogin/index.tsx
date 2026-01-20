import React, { useEffect } from 'react'
import { Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { googleClient } from '../../../googleAuth'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const RNGoogleLogin = () => {

    useEffect(() => {
        googleClient()
    }, [])

    const handleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            console.log('User Info:', userInfo);

            /*
              userInfo.user.email
              userInfo.user.name
              userInfo.user.photo
              userInfo.idToken
            */
        } catch (error) {
            console.log('Google Signin Error', error);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Button title='Login' onPress={handleLogin} />
        </SafeAreaView>
    )
}

export default RNGoogleLogin
