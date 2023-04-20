import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen({ route, navigation }) {
  const [username, setUsername] = useState(route.params.username);
  const { uid, loginTime } = route.params;

  // Verificar si loginTime está definido y formatearlo, o usar un valor predeterminado
  const loginTimeDate = new Date(loginTime)
  const formattedLoginTime = loginTime
    ? `${loginTimeDate.getHours()}:${loginTimeDate.getMinutes()}:${loginTimeDate.getSeconds()}`
    : 'No disponible';


  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    };

    if (!username) {
      getUsername();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido {username}</Text>
      <Text style={{ color: 'black', marginTop: -30, alignSelf: 'center', fontSize: 25, marginBottom: 50 }}>Tu credencial es: {uid}</Text>
      <Text style={{ color: 'black', marginTop: -30, alignSelf: 'center', fontSize: 25, marginBottom: 50, textAlign: 'center' }}>Hora de inicio de sesión: {formattedLoginTime} </Text>
      <Icon name='time' size={30} color='gray' style={{position: 'absolute', top: 268, left: 95}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: "#09456c",
    alignSelf: "center",
    paddingBottom: 60,
    marginTop: 100,
  },
})