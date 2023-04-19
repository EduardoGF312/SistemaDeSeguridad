import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AwesomeAlert from 'react-native-awesome-alerts';
import jwtDecode from 'jwt-decode';


export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    //CONSTANTES PARA CONTROLAR EL ESTADO DE LA ALERTA SUCCESS
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    //CONSTANTES PARA CONTROLAR EL ESTADO DE LA ALERTA ERROR
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    //CONSTANTE PARA VERIFICAR QUE EL CAMPO USUARIO NO ESTE VACIO
    const [usernameError, setUsernameError] = useState('');
    //CONSTANTE PARA VERIFICAR QUE EL CAMPO
    const [passwordError, setPasswordError] = useState('');
    //CONSTANTE PARA HACER QUE TENGA SOLO 3 MINUTOS PARA ACCEDER
    const [timeRemaining, setTimeRemaining] = useState(180);
    //CONSTANTE PARA VERIFICAR QUE EL USUARIO INICIO SESION Y PODER PAUSAR EL CONTADOR
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    //CONSTANTE PARA VERIFICAR QUE EL USUARIO CAMBIO DE PANTALLA Y SE PAUSE EL CONTADOR
    const [isOnHomeScreen, setIsOnHomeScreen] = useState(false);
    const[token, setToken] = useState(null);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!isOnHomeScreen) {
                setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 1);
            }
        }, 1000); // Actualizar cada 1000 ms (1 segundo)

        const timeoutId = setTimeout(() => {
            if (!isLoggedIn) {
                navigation.navigate('Rfid');
            }
        }, 180000); // 3 minutos = 180000 ms

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [navigation, isLoggedIn, isOnHomeScreen]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
    };

    //MOSTAR ALERTA DE SUCCESS
    const showSuccessAlertHandler = () => {
        setShowSuccessAlert(true);
    };

    //OCULTAR ALERTA SUCCES Y MANDAR AL SUARIO A LA PANTALLA HOME
    const hideSuccessAlertHandler = (username) => {
        setShowSuccessAlert(false);
        //SE MANDA LA VARIABLE USERNAME A LA PANTALLA HOME
        navigation.navigate('Home', {username});
        setIsLoggedIn(true);
        setTimeRemaining(180);
        setIsOnHomeScreen(true);
    };

    //MOSTRAR ALERTA DE ERROR
    const showErrorAlertHandler = () => {
        setShowErrorAlert(true);
    };

    //OCULTAR ALERTA DE ERROR
    const hideErrorAlertHandler = () => {
        setShowErrorAlert(false);
    };

    //HANDLE PARA VERIFICAR QUE NO ESTE VACIO LOS CAMPOS, Y TAMBIEN RECIBIR EL TOKEN, Y COMPROBAR QUE EL USUARIO EXISTE
    const handleLogin = async (e) => {
        e.preventDefault()

        let validationPassed = true;

        if (username.trim() === '') {
            setUsernameError('El nombre de usuario es obligatorio');
            validationPassed = false;
        } else {
            setUsernameError('');
        }

        if (password.trim() === '') {
            setPasswordError('La contraseña es obligatoria');
            validationPassed = false;
        } else {
            setPasswordError('');
        }

        if (!validationPassed) {
            return;
        }

        var log = {
            username: username,
            password: password
        }

        try {
            const response = await axios.post('https://appsecureraul.fly.dev/api/login/userlogin', log);
            const receivedToken = response.data.token;

            //Decodificar el token y extrar el nombre del usuario
            // const decodedToken = jwtDecode(token);
            // const username = decodedToken.username;

            // Convertir el nombre de usuario a una cadena si no lo es
            // const usernameString = typeof username === 'string' ? username : JSON.stringify(username);

            //Almacenamos el token y el nombre del usuario en SecureStore
            await SecureStore.setItemAsync('authToken', receivedToken);
            await SecureStore.setItemAsync('username', username);

            setToken(receivedToken);

            showSuccessAlertHandler();
        } catch (error) {
            console.log(error);
            showErrorAlertHandler();
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.form}>
                <Text style={styles.title}>Inicio de sesión</Text>
                <Text style={{ color: 'black', marginTop: -60, alignSelf: 'center', fontSize: 19, marginBottom: 50 }}>Tiempo restante: {formatTime(timeRemaining)}</Text>
                <View>
                    <View style={styles.inputContainer}>
                        <Icon name="user" size={20} color="gray" style={{ position: 'absolute', left: 15, top: 18, zIndex: 1 }} />
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setUsername(text)}
                            value={username}
                            placeholder="Nombre de usuario"
                            autoCapitalize="none"
                            autoFocus={true}
                        />
                    </View>
                    {usernameError ? <Text style={[styles.errorText, { top: 60 }]}>{usernameError}</Text> : null}

                    <View style={styles.inputContainer}>
                        <Icon name="lock" size={22} color="gray" style={{ position: 'absolute', left: 18, top: 18, zIndex: 1 }} />
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            placeholder="Contraseña"
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                        />
                    </View>
                    {passwordError ? <Text style={[styles.errorText, { top: 155 }]}>{passwordError}</Text> : null}

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 20 }}>Inicia sesión</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <StatusBar barStyle="light-content" />

            {/* ALERTA DE SUCCESS*/}
            <AwesomeAlert
                show={showSuccessAlert}
                title='Inicio de sesion exitoso'
                // message='Has iniciado sesion correctamente'
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText='OK'
                onConfirmPressed={() => {
                    //SE DECODIFICA EL TOKEN
                    const decodedToken = jwtDecode(token);
                    //SE OBTIENE EL USERNAME DEL TOKEN YA DECODIFICADO
                    const username = decodedToken.username;
                    hideSuccessAlertHandler(username);
                }}
                titleStyle={{ color: 'green' }}
                confirmButtonColor='green'
            />

            {/* ALERTA DE ERROR*/}
            <AwesomeAlert
                show={showErrorAlert}
                title='Error en el inicio de sesión'
                // message='Has iniciado sesion correctamente'
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showConfirmButton={true}
                confirmText='OK'
                onConfirmPressed={hideErrorAlertHandler}
                titleStyle={{ color: 'red' }}
                confirmButtonColor='red'
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: "#09456c",
        alignSelf: "center",
        paddingBottom: 60,

    },
    input: {
        backgroundColor: "#F6F7FB",
        height: 58,
        marginBottom: 35,
        fontSize: 16,
        borderRadius: 10,
        padding: 12,
        paddingStart: 50
    },
    form: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    button: {
        backgroundColor: '#09456c',
        height: 58,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    errorText: {
        color: 'red',
        position: 'absolute',
        fontSize: 16,
    },
});