import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, Text, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

interface UserItem {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

const UserListScreen = ({ navigation }: any) => {
    const [users, setUsers] = useState<UserItem[]>([]);
    const currentUser = auth().currentUser;

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('Users')
            .onSnapshot(querySnapshot => {
                const usersData: UserItem[] = [];
                querySnapshot.forEach(doc => {
                    const { name, email, avatar } = doc.data();
                    if (doc.id !== currentUser?.uid) {
                        usersData.push({ id: doc.id, name, email, avatar });
                    }
                });
                setUsers(usersData);
            });

        return () => unsubscribe();
    }, []);

    const startChat = (user: UserItem) => {
        const roomId = [currentUser?.uid, user.id].sort().join('_');
        navigation.navigate('RNFirebaseChat', { roomId, otherUser: user });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => startChat(item)}
                        style={{ padding: 20, borderBottomWidth: 1, borderColor: '#eee' }}
                    >
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        <Text style={{ color: 'gray' }}>{item.email}</Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

export default UserListScreen;