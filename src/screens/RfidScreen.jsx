import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

export default function RfidScreen({ navigation }) {
    const [uid, setUID] = useState('');
    const animValue = new Animated.Value(0);
    const isFocused = useIsFocused();

    useEffect(() => {
        const backAction = () =>{
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
            return true;
        }

        if(isFocused) {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
            return () => backHandler.remove();
        }
    }, [isFocused]);

    const updateUid = async () => {
        try {
            const response = await axios.get('https://blynk.cloud/external/api/update?token=Dx1InWoXSFRWQZszOKzWzURNuQk0MGG-&v1=""');
            setUID(response.data);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        updateUid();
    }, []);

    useEffect(() => {
        const getUid = async () => {
            try {
                const response = await axios.get('https://blynk.cloud/external/api/get?token=Dx1InWoXSFRWQZszOKzWzURNuQk0MGG-&v1')
                if(isFocused) {
                    setUID(response.data);
                }
                console.log(response)
            } catch (error) {
                console.log(error);
            }
        };

        const interval = setInterval(getUid, 1000);
        return () => {
            clearInterval(interval)
            setUID('');
        };
    }, [isFocused]);

    useEffect(() => {
        if(uid && isFocused) {
            Animated.timing(animValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login', params: { uid }}],
                });
                animValue.setValue(0);
            });
            
        }
    }, [uid, isFocused]);

    
    const chapaStyle = {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        transform: [
            {
                rotateZ: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                }),
            },
        ],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Coloca tu carta sobre el lector</Text>
            <TouchableOpacity>
                <Animated.Image source={require('../../assets/chapa.png')} style={chapaStyle} />
            </TouchableOpacity>
            <Text style={[styles.status, {color: uid ? 'green' : 'red'}]}>{uid ? 'Abierto' : 'Cerrado'}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 160,
        marginLeft: 10,
        marginRight: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: "#09456c",
        alignSelf: "center",
        paddingBottom: 30,
        textAlign: 'center'

    },
    status: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 20,
    },
})