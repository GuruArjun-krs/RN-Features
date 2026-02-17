import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface ChatProps {
    route: { params: { roomId: string } };
}

const RNFirebaseChat = ({ route }: ChatProps) => {
    const roomId = route?.params?.roomId;
    const [messages, setMessages] = useState<IMessage[]>([]);
    const currentUser = auth().currentUser;

    useEffect(() => {
        if (!roomId) return;

        const unsubscribe = firestore()
            .collection('rooms')
            .doc(roomId)
            .collection('messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot(querySnapshot => {
                const msgs: IMessage[] = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        _id: doc.id,
                        text: data.text || '',
                        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
                        user: {
                            _id: data.user?._id || 'unknown',
                            name: data.user?.name || 'Anonymous',
                            avatar: data.user?.avatar || undefined,
                        },
                    } as IMessage;
                });
                setMessages(msgs);
            });

        return () => unsubscribe();
    }, [roomId]);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        if (!roomId || !currentUser) return;

        const { text, user: messageUser } = newMessages[0];

        firestore()
            .collection('rooms')
            .doc(roomId)
            .collection('messages')
            .add({
                text,
                createdAt: firestore.FieldValue.serverTimestamp(),
                user: messageUser,
            });
    }, [roomId, currentUser]);

    if (!currentUser) return null;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <GiftedChat
                messages={messages}
                onSend={msgs => onSend(msgs)}
                user={{
                    _id: currentUser.uid,
                    name: currentUser.displayName || 'Guest',
                }}
                isUsernameVisible
                isAvatarOnTop
                isSendButtonAlwaysVisible
            />
        </SafeAreaView>
    );
};

export default RNFirebaseChat;