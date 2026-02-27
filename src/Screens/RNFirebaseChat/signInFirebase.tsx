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
import auth from '@react-native-firebase/auth';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const LoginFirebase = ({ navigation }: { navigation: any }) => {
    const [initializing, setInitializing] = useState(true);

    // 1. Validation Schema (Only Email & Password)
    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required'),
    });

    // 2. Auth Listener (Auto-redirect if already logged in)
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

    // 3. Formik Setup
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: LoginSchema,
        onSubmit: async (values, { setSubmitting, setErrors }) => {
            try {
                // A. Sign In with Firebase
                await auth().signInWithEmailAndPassword(values.email, values.password);

                // Navigation is handled by the useEffect listener automatically

            } catch (error: any) {
                console.error(error);
                // Handle specific Firebase errors
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    Alert.alert('Login Failed', 'Invalid email or password.');
                } else if (error.code === 'auth/invalid-email') {
                    setErrors({ email: 'Invalid email address format.' });
                } else if (error.code === 'auth/too-many-requests') {
                    Alert.alert('Error', 'Too many attempts. Try again later.');
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
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Log in to continue chatting</Text>
                </View>

                <View style={styles.formContainer}>

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

                    {/* Submit Button */}
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
                            <Text style={styles.buttonText}>Log In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Link to Sign Up */}
                    <TouchableOpacity
                        style={styles.linkContainer}
                        onPress={() => navigation.navigate('SignUpFirebase')}
                    >
                        <Text style={styles.linkText}>Don't have an account? <Text style={styles.linkBold}>Sign Up</Text></Text>
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

export default LoginFirebase;