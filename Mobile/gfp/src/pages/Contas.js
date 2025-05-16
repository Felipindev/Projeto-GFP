import react, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Estilos from '../styles/Estilos';
import { enderecoServidor } from '../utils';

export default function Contas (navigation) {
    const [dadosLista, setDadosLista] = useState([]);
    const [usuario, setUsuario] = useState({});

    const buscarDadosAPI = async () => {
        try{
            const resposta = await fetch(`${enderecoServidor}/contas`,{
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${usuario.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const dados = await resposta.json();
            setDadosLista(dados);
        }catch (error) {
            console.error("Erro ao buscar dados da API:", error);
        }
    }

    useEffect(() => {
        buscarUsuarioLogado();
    }, []);

    //executa quando a variavel usuario é carregada
    useEffect(() => {
        buscarDadosAPI();
    },[usuario])

    const buscarUsuarioLogado = async () => {
        const usuarioLogado = await AsyncStorage.getItem('UsuarioLogado');
        if (usuarioLogado) {
            setUsuario(JSON.parse(usuarioLogado));
        } else {
            navigation.navigate('Login');
        }
    } 

    const botaoExcluir = async (id) => {
        try{
            const resposta = await fetch(`${enderecoServidor}/contas/${id}`,{
                method: 'DELETE',
                headers:{
                    'Authorization': `Bearer ${usuario.token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (resposta.ok) {
                buscarDadosAPI();
            }
        }catch (error) {
            console.error("Erro ao buscar dados da API:", error);
        }
    }

    const exibirItemLista = ({item}) => {
        return(
            <TouchableOpacity style={styles.ItemLista} >
                <Image source={require('../assets/logo(2).png')} style={styles.imagemLista} />
                <View style={styles.textContainer}>
                    <Text style={styles.tipoConta}>{item.tipo_conta}</Text>
                    <Text style={styles.nomeLista}>{item.nome}</Text>
                </View>
                <MaterialIcons name='edit' size={24} color='#008080' style={styles.icon} />
                <MaterialIcons name='delete' size={24} color='#e63946' style={styles.icon}
                    onPress={() => botaoExcluir(item.id_conta)}
                />
            </TouchableOpacity>
        )
    }

    return(
        <View style={Estilos.conteudoHeader}>
            <View style={Estilos.conteudoCorpo}>
                <Text>Contas</Text> 
                {/*FlatList para exibir os dados da API*/}
                <FlatList
                   data={dadosLista}
                   renderItem={exibirItemLista}
                   keyExtractor={(item) => item.id_conta}
                   
                />
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
    },
    ItemLista: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginVertical: 6,
        marginHorizontal: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    imagemLista: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
        backgroundColor: '#e0e0e0',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    icon: {
        marginLeft: 10,
    },
    tipoConta: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    nomeLista: {
        fontSize: 14,
        color: '#666',
    },

})