import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SignUpFirebase = ({ navigation }: { navigation: any }) => {
    const [initializing, setInitializing] = useState(true);

    const SignupSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, 'Name is too short!')
            .max(50, 'Name is too long!')
            .required('Full Name is required'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
    });

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                navigation.replace('UserListScreen');
            } else {
                setInitializing(false);
            }
        });
        return unsubscribe;
    }, [navigation]);

    const createUserInFirestore = async (user: FirebaseAuthTypes.User, userName: string) => {
        try {
            await firestore().collection('Users').doc(user.uid).set({
                id: user.uid,
                name: userName,
                email: user.email,
                avatar: null,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });
            console.log('User added to Firestore!');
        } catch (error) {
            console.error('Error adding user to Firestore:', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: ''
        },
        validationSchema: SignupSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                const userCredential = await auth().createUserWithEmailAndPassword(
                    values.email,
                    values.password
                );

                if (userCredential.user) {
                    await userCredential.user.updateProfile({
                        displayName: values.name,
                    });
                    await createUserInFirestore(userCredential.user, values.name);
                }

            } catch (error: any) {
                console.error(error);
                if (error.code === 'auth/email-already-in-use') {
                    setErrors({ email: 'That email address is already in use!' });
                } else if (error.code === 'auth/invalid-email') {
                    setErrors({ email: 'That email address is invalid!' });
                } else {
                    Alert.alert('Error', error.message);
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (initializing) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to start chatting!</Text>
                </View>

                <View style={styles.formContainer}>
                    {/* Name Input */}
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={[
                            styles.input,
                            formik.touched.name && formik.errors.name ? styles.inputError : null
                        ]}
                        placeholder="John Doe"
                        placeholderTextColor="#aaa"
                        onChangeText={formik.handleChange('name')}
                        onBlur={formik.handleBlur('name')}
                        value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <Text style={styles.errorText}>{formik.errors.name}</Text>
                    )}

                    {/* Email Input */}
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[
                            styles.input,
                            formik.touched.email && formik.errors.email ? styles.inputError : null
                        ]}
                        placeholder="hello@example.com"
                        placeholderTextColor="#aaa"
                        onChangeText={formik.handleChange('email')}
                        onBlur={formik.handleBlur('email')}
                        value={formik.values.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <Text style={styles.errorText}>{formik.errors.email}</Text>
                    )}

                    {/* Password Input */}
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={[
                            styles.input,
                            formik.touched.password && formik.errors.password ? styles.inputError : null
                        ]}
                        placeholder="********"
                        placeholderTextColor="#aaa"
                        onChangeText={formik.handleChange('password')}
                        onBlur={formik.handleBlur('password')}
                        value={formik.values.password}
                        secureTextEntry
                    />
                    {formik.touched.password && formik.errors.password && (
                        <Text style={styles.errorText}>{formik.errors.password}</Text>
                    )}

                    {/* Sign Up Button */}
                    <TouchableOpacity
                        style={[
                            styles.button,
                            (!formik.isValid || formik.isSubmitting) ? styles.buttonDisabled : null
                        ]}
                        onPress={() => formik.handleSubmit()}
                        disabled={formik.isSubmitting}
                    >
                        {formik.isSubmitting ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    {/* Styled Link to Login */}
                    <TouchableOpacity
                        style={styles.linkContainer}
                        onPress={() => navigation.navigate('LoginFirebase')}
                    >
                        <Text style={styles.linkText}>Already have an account? <Text style={styles.linkBold}>Log In</Text></Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    headerContainer: {
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    formContainer: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        backgroundColor: '#F5F5F5',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF5F5',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 32,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#A0CFFF',
        shadowOpacity: 0,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // New Styles for Link
    linkContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#666',
        fontSize: 14,
    },
    linkBold: {
        color: '#007AFF',
        fontWeight: 'bold',
    }
});

export default SignUpFirebase;