import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

export default function RfidScreen({navigation}) {
    return (
        <View style={styles.container}>
            <Text>RfidScreen</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ fontWeight: 'bold', color: 'black', fontSize: 20 }}>Inicia sesión</Text>
            </TouchableOpacity>
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