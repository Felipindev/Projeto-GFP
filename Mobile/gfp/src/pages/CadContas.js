import React, { useState, useEffect, useLayoutEffect} from 'react';
import {View, Text, TextInput, StyleSheet, Switch, TouchableOpacity} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Estilos from '../styles/Estilos';
import { enderecoServidor } from '../utils';

export default function CadContas({navigation, route}) {
    const [inputNome, setInputNome] = useState('');
    const [inputTipo, setInputTipo] = useState('');
    const [inputSaldo, setInputSaldo] = useState('');
    const [inputContaPadrao, setInputContaPadrao] = useState(false);
    const [usuario, setUsuario] = useState({});

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={botaoSalvar}>
                    <MaterialIcons name="save" size={28} color="#fff"  
                        style={{marginRight: 15}} />                    
                </TouchableOpacity>
            )
        })
    }, [navigation, inputNome, inputTipo, inputSaldo, inputContaPadrao]);

    useEffect(() => {
        buscarUsuarioLogado();
    }, []);

    useEffect(()=>{
        if(route.params && route.params.Conta){
            setInputNome(route.params.Conta.nome)
            setInputTipo(route.params.Conta.tipo_conta)
            setInputSaldo(route.params.Conta.saldo.toString())
            setInputContaPadrao(route.params.Conta.conta_padrao)
        }
    }, [route.params])

    const buscarUsuarioLogado = async () => {
        const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
        if (usuarioLogado) {
            setUsuario(JSON.parse(usuarioLogado));
        } else {
            navigation.navigate('Login');
        }
    } 

    const botaoSalvar = async () => {
    try {
        const dados = {
            nome: inputNome,
            tipo_conta: inputTipo,
            saldo: inputSaldo,
            conta_padrao: inputContaPadrao,
            ativo: true
        }
        let endpoint = `${enderecoServidor}/contas`
        let metodo = 'POST'

        if(route.params && route.params.Conta){
            endpoint = `${enderecoServidor}/contas/${route.params.Conta.id_conta}`
            metodo = 'PUT'
        }

        const resposta = await fetch(endpoint, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usuario.token}`
            },
            body: JSON.stringify(dados)
        })
        if (resposta.ok) {
            alert('Conta cadastrada com sucesso')
            navigation.goBack()
        }
    } catch (error) {
        console.error("Erro ao salvar conta", error);
    }
}

    return(
        <View style={Estilos.conteudoHeader}>
            <View style={Estilos.conteudoCorpo}>
                <Text style={styles.titulo}>Nova Conta</Text>
                <Text style={styles.subtitulo}>clique no botão "Salvar" ou clique no ícone no canto superior direito para salvar a conta</Text>
                <View style={styles.formGroup}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="#008080" style={styles.icon} />
                    <TextInput
                        placeholder='Nome da Conta'
                        value={inputNome}
                        onChangeText={setInputNome}
                        style={styles.inputCad}
                        placeholderTextColor="#94a3b8"
                    />
                </View>
                <View style={styles.formGroup}>
                    <MaterialIcons name="category" size={24} color="#008080" style={styles.icon} />
                    <TextInput
                        placeholder='Tipo da Conta (admin / usuario)'
                        value={inputTipo}
                        onChangeText={setInputTipo}
                        style={styles.inputCad}
                        placeholderTextColor="#94a3b8"
                    />
                </View>
                <View style={styles.formGroup}>
                    <MaterialIcons name="attach-money" size={24} color="#008080" style={styles.icon} />
                    <TextInput
                        placeholder='Saldo da Conta ( R$ xxx,xx )'
                        value={inputSaldo}
                        onChangeText={setInputSaldo}
                        keyboardType='numeric'
                        style={styles.inputCad}
                        placeholderTextColor="#94a3b8"
                    />
                </View>
                <View style={styles.switchGroup}>
                    <Text style={styles.labelSwitch}>Conta Padrão</Text>
                    <Switch
                        value={inputContaPadrao}
                        onValueChange={setInputContaPadrao}
                        trackColor={{ false: "#64748b", true: "#008080" }}
                        thumbColor={inputContaPadrao ? "#fff" : "#f4f3f4"}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={botaoSalvar}>
                    <Text style={styles.buttonText}>Salvar Conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#008080',
        marginVertical: 20,
        textAlign: 'center',
        letterSpacing: 1,
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#008080',
        marginVertical: 20,
        textAlign: 'center',
        letterSpacing: 1,
    },
    formGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e6f7f4',
        borderRadius: 10,
        marginBottom: 18,
        paddingHorizontal: 10,
        paddingVertical: 8,
        shadowColor: '#41d3be',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        marginRight: 10,
    },
    inputCad: {
        flex: 1,
        fontSize: 16,
        color: '#222',
        backgroundColor: 'transparent',
        borderWidth: 0,
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    switchGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#e6f7f4',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 30,
    },
    labelSwitch: {
        fontSize: 20,
        color: '#008080',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#008080',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#008080',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
})