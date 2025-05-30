import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Principal ({navigation}){
    const [usuario, setUsuario] = useState({});

    useEffect(() => {
        const buscarUsuarioLogado = async () => {
            const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
            if (usuarioLogado) {
                setUsuario(JSON.parse(usuarioLogado));
            } else {
                navigation.navigate('Login');
            }
        } 

        buscarUsuarioLogado();
    },[])

    const botaoLogOut = async () => {
        await AsyncStorage.removeItem('UsuarioLogado');
        navigation.navigate('Login');
    }

    return (
        <View style={{backgroundColor: '#008080', flex: 1,}}>
        <View style={styles.container}>
            <View style={{alignItems: 'center', flexdirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.title}>Bem-vindo ao GFP, {usuario.nome}!</Text>
            <TouchableOpacity style={styles.bottonSair} onPress={botaoLogOut}>
                <Text style={styles.bottonSairText}>Sair</Text>
            </TouchableOpacity>
            </View>
            <View style={{marginTop: 20}}>
                <Text style={styles.subtitle}>Gerenciador de Finanças Pessoais</Text>
                <Text style={styles.subtitle}>Tela Principal</Text>
            </View>
        
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#008080',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
    },
    bottonSair: {
        backgroundColor: '#008080',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20,
        width: '50%',
    },
    bottonSairText: {
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#f8f8f8',
    },
})