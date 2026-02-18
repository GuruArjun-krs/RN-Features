import React, { useState, useCallback, useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface ChatProps {
    route: { params: { roomId: string; otherUser?: { name: string } } };
}

const RNFirebaseChat = ({ route }: ChatProps) => {
    const { roomId, otherUser } = route.params;
    const [messages, setMessages] = useState<IMessage[]>([]);
    const currentUser = auth().currentUser;

    useEffect(() => {
        if (!roomId) return;

        const unsubscribe = firestore()
            .collection('Chats')
            .doc(roomId)
            .collection('Messages')
            .orderBy('createdAt', 'desc') // GiftedChat expects newest first
            .onSnapshot(querySnapshot => {
                if (!querySnapshot) return;

                const msgs = querySnapshot.docs.map(doc => {
                    const data = doc.data();

                    // Helper to handle the timestamp properly
                    const createdAt = data.createdAt ? data.createdAt.toDate() : new Date();

                    return {
                        _id: doc.id, // Use the Firestore Document ID
                        text: data.text || '',
                        createdAt: createdAt,
                        user: {
                            _id: data.user?._id || 'unknown', // Ensure this ID exists
                            name: data.user?.name || 'User',
                            avatar: data.user?.avatar || undefined,
                        },
                    };
                });

                setMessages(msgs);
            }, error => {
                console.error("Listener Error: ", error);
            });

        return () => unsubscribe();
    }, [roomId]);

    const onSend = useCallback(async (newMessages: IMessage[] = []) => {
        if (!roomId || !currentUser) return;

        const msg = newMessages[0];

        try {
            // 1. Add the message
            await firestore()
                .collection('Chats')
                .doc(roomId)
                .collection('Messages')
                .add({
                    text: msg.text,
                    createdAt: firestore.FieldValue.serverTimestamp(),
                    user: {
                        _id: currentUser.uid,
                        name: currentUser.displayName || 'User',
                        // FIX: Ensure this is NEVER undefined. Use null or a string.
                        avatar: currentUser.photoURL || null
                    },
                });

            // 2. Update the parent room doc
            await firestore()
                .collection('Chats')
                .doc(roomId)
                .set({
                    lastMessage: msg.text,
                    lastUpdated: firestore.FieldValue.serverTimestamp(),
                    // FIX: Ensure roomId logic doesn't produce undefined values
                    participants: [
                        currentUser.uid,
                        roomId.replace(currentUser.uid, '').replace('_', '') || 'unknown'
                    ]
                }, { merge: true });

        } catch (error) {
            console.error("Failed to send message:", error);
        }

    }, [roomId, currentUser]);

    if (!currentUser || !roomId) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={{ padding: 15, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                    {otherUser?.name ? `Chat with ${otherUser.name}` : 'Chat'}
                </Text>
            </View>

            <GiftedChat
                messages={messages}
                onSend={msgs => onSend(msgs)}
                user={{
                    _id: currentUser.uid,
                    name: currentUser.displayName || 'Me',
                }}
                isUserAvatarVisible
                isSendButtonAlwaysVisible
                isScrollToBottomEnabled
            />
        </SafeAreaView>
    );
};

export default RNFirebaseChat;