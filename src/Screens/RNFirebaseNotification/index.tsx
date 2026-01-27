import React, { useEffect } from 'react'
import { Button, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { requestNotificationPermission } from '../../Utils/permission';

const RNFirebaseNotification = () => {
    useEffect(() => {
        requestNotificationPermission()
        const getFcm = async () => {
            const fcmToken = await messaging().getToken();
            console.log('FCM Token:', fcmToken);
        };
        getFcm();
    }, [])

    async function triggerLocalNotification() {
        await notifee.createChannel({
            id: 'default',
            name: 'Test Channel',
            sound: 'default',
            vibration: true,
        });

        await notifee.displayNotification({
            title: 'Inna Pulla',
            body: 'Vanakkam maamae from local uh',
            android: {
                channelId: 'default',
                pressAction: { id: 'default' },
                sound: 'default',
            },
        });
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button color={'green'} title='Trigger Notification' onPress={triggerLocalNotification} />
            </View>
        </SafeAreaView>
    )
}

export default RNFirebaseNotification
