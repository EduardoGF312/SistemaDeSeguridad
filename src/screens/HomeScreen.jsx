import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store';

export default function HomeScreen({ route, navigation }) {
  const [username, setUsername] = useState(route.params.username);

  useEffect(() => {
    const getUsername = async () => {
      const storedUsername = await SecureStore.getItemAsync('username');
      if(storedUsername) {
        setUsername(storedUsername);
      }
    };

    if(!username) {
      getUsername();
    }
  }, []);
  
  return (
    <View style={styles.container}>
      <Text>Welcome, {username}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})