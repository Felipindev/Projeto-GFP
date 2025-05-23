import { Text, View, TouchableOpacity, StyleSheet, FlatList, Image, Alert, RefreshControl} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useLayoutEffect} from 'react';
import Estilos from '../styles/Estilos';
import CorPrincipal from '../styles/Estilos'
import { enderecoServidor } from '../utils';

const Categorias = ({navigation}) => {
    const [dadosLista, setDadosLista] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [atualizando, setAtualizando] = useState(false);

    useLayoutEffect(() => {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity>
                        <MaterialIcons name="add" size={28} color="#fff"  
                            style={{marginRight: 15}} />                    
                    </TouchableOpacity>
                )
            })
        }, [navigation])

    const buscarDadosAPI = async () => {
        try{
            const resposta = await fetch(`${enderecoServidor}/categorias`,{
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
        if (usuario && usuario.token){
            buscarDadosAPI();
        }
    }, [usuario])

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
            const resposta = await fetch(`${enderecoServidor}/categorias/${id}`,{
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
                    <View style={[styles.iconeCategoria, { backgroundColor: item.cor || "#008080" }]}>
                        <MaterialIcons
                            name={item.icone || "category"} // nome do ícone vindo do banco, ou um padrão
                            size={24}
                            color={"#fff"}   // cor vinda do banco, ou um padrão
                            />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.nomeLista}>{item.nome.toUpperCase()}</Text>
                        <Text style={styles.tipoTransacao}>R$00,00</Text>
                    </View>
                    <MaterialIcons name='edit' size={24} color='#008080' style={styles.icon}
                        // onPress={() => navigation.navigate('CadContas', {Conta: item})}
                    />
                    <MaterialIcons name='delete' size={24} color='#e63946' style={styles.icon}
                        onPress={() => botaoExcluir(item.id_categoria)}
                    />
                </TouchableOpacity>
            )
        }

    return(
        <View style={Estilos.conteudoHeader}>
            <View style={Estilos.conteudoCorpo}>
                <View style={styles.containerText}>
                    <Text style={styles.text}>ADMINISTRE <Text style={styles.textPlus}>TODAS</Text> AS SUAS CATEGORIAS!</Text> 
                </View>
                {/*FlatList para exibir os dados da API*/}
                    <FlatList
                        data={dadosLista}
                        renderItem={exibirItemLista}
                        keyExtractor={(item) => item.id_categoria} 
                        refreshControl={
                            <RefreshControl
                                refreshing={atualizando}
                                onRefresh={buscarDadosAPI}
                            />
                        }
                    />
            </View>
        </View>
    )
}
export default Categorias

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
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
    tipoTransacao: {
        fontSize: 14,
        color: '#666',
    },
    nomeLista: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#666',
    },
    textPlus: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
        border: 'solid 1px #008080',
        padding: 10,
        backgroundColor: '#008080',
        borderRadius: 10,

    },
    containerText: {
        padding: 10,
        marginVertical: 10,
        gap: 20,
    },
    iconeCategoria: {
    marginRight: 16, 
    borderRadius: 20,
    padding: 4,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
},
})