import React, { useEffect, useState } from 'react';
import {
    FlatList,
    TouchableOpacity,
    Text,
    View,
    ActivityIndicator,
    StyleSheet,
    ListRenderItem,
    Alert
} from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

const UserListScreen = ({ navigation }: { navigation: any }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const currentUser = auth().currentUser;

    const handleLogout = async () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await auth().signOut();
                            navigation.replace('SignUpFirebase');
                        } catch (error) {
                            console.error("Logout Error:", error);
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = firestore()
            .collection('Users')
            .onSnapshot(
                (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot | null) => {
                    if (!querySnapshot) {
                        setLoading(false);
                        return;
                    }

                    const usersData: User[] = [];
                    querySnapshot.forEach(doc => {
                        const data = doc.data();
                        if (doc.id !== currentUser.uid) {
                            usersData.push({
                                id: doc.id,
                                name: data.name || 'Unknown User',
                                email: data.email || 'No Email',
                                avatar: data.avatar || undefined,
                            });
                        }
                    });

                    setUsers(usersData);
                    setLoading(false);
                },
                (error) => {
                    console.error("Firestore Error:", error);
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, [currentUser]);

    const startChat = (user: User) => {
        const roomId = [currentUser?.uid, user.id].sort().join('_');
        navigation.navigate('RNFirebaseChat', { roomId, otherUser: user });
    };

    const renderUserItem: ListRenderItem<User> = ({ item }) => (
        <TouchableOpacity
            style={styles.userCard}
            onPress={() => startChat(item)}
        >
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                    {item.name ? item.name.charAt(0).toUpperCase() : '?'}
                </Text>
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ marginTop: 10 }}>Loading users...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chats</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={renderUserItem}
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Text style={styles.emptyText}>No users found.</Text>
                        <Text style={{ color: 'gray', fontSize: 12 }}>
                            (Try creating a second account to see it here)
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    logoutButton: {
        padding: 8,
    },
    logoutText: {
        color: '#ff3b30',
        fontWeight: '600',
        fontSize: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#e1e1e1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    userEmail: {
        fontSize: 14,
        color: '#888',
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
        marginBottom: 10,
    }
});

export default UserListScreen;