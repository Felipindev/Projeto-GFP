import { Text, View, TouchableOpacity, StyleSheet, FlatList, Image, Alert, RefreshControl, Modal, TextInput, Button} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useLayoutEffect} from 'react';
import Estilos from '../styles/Estilos';
import CorPrincipal from '../styles/Estilos'
import { enderecoServidor, listaCores, listaIcones } from '../utils';

const Categorias = ({navigation}) => {
    const [dadosLista, setDadosLista] = useState([]);
    const [usuario, setUsuario] = useState({});
    const [atualizando, setAtualizando] = useState(false);
    const [modalVisible, setModalVisible] = useState(false)
    const [nomeCategoria, setNomeCategoria] = useState('')
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null)

    const [corModalVisible, setCorModalVisible] = useState(false)
    const [iconeModalVisible, setIconeModalVisible] = useState(false)
    const [cor, setCor] = useState('#aaff')
    const [icone, setIcone] = useState('wallet')

    const [erroNome, setErroNome] = useState('');

    useLayoutEffect(() => {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity>
                        <MaterialIcons name="add" size={28} color="#fff"  
                            style={{marginRight: 15}} 
                            onPress={() => setModalVisible(true)}
                            />                    
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
                        onPress={() => botaoEditar(item)}
                    />
                    <MaterialIcons name='delete' size={24} color='#e63946' style={styles.icon}
                        onPress={() => botaoExcluir(item.id_categoria)}
                    />
                </TouchableOpacity>
            )
        }

        const botaoSalvar = async () => {
            let erro = false;
            setErroNome('');

            if (nomeCategoria.trim() === '') {
                setErroNome('O nome da categoria é obrigatório:');
                erro = true
            }
            if (erro) {
                return;
            }
            try{
                const dados = {
                    nome: nomeCategoria,
                    tipo_transacao: 'ENTRADA',
                    gasto_fixo: false,
                    ativo: true,
                    id_usuario: usuario.id_usuario,
                    cor: cor,
                    icone: icone
                }

                let endpoint = `${enderecoServidor}/categorias`;
                let metodo = 'POST';

                if (categoriaSelecionada) {
                    endpoint = `${enderecoServidor}/categorias/${categoriaSelecionada.id_categoria}`;
                    metodo = 'PUT';
                }

                const resposta = await fetch(endpoint, {
                    method: metodo,
                    headers: {
                        'Authorization': `Bearer ${usuario.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                })
                console.log(dados);
                

                if (resposta.ok) {
                    if (metodo === 'PUT') {
                        alert("Categoria editada com sucesso!");
                    } else {
                        alert("Categoria salva com sucesso!");
                        
                    }
                    setModalVisible(false);
                    setNomeCategoria('');
                    setCategoriaSelecionada(null);
                    buscarDadosAPI();
                }

            } catch (error) {
                console.error("Erro ao salvar categoria:", error);
                alert("Erro ao salvar categoria: " + error);
            }
        }

        const botaoEditar = (item) => {
            setCategoriaSelecionada(item);
            setNomeCategoria(item.nome);
            setCor(item.cor);
            setIcone(item.icone);
            setModalVisible(true);
        }

        const botaoCancelar = () => {
            setModalVisible(false);
            setNomeCategoria('');
            setCategoriaSelecionada(null);
            setErroNome('');
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
            <Modal visible={modalVisible} transparent={true} animationType='slide' onRequestClose={() => setModalVisible(false)}>
                <View style={Estilos.modalFundo}>
                    <View style={Estilos.modalConteudo}>
                        <Text style={Estilos.modalTitulo}>NOVA CATEGORIA</Text>
                        {erroNome ? <Text style={Estilos.erroMsg}>{erroNome}</Text> : null}
                        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                            <TextInput style={Estilos.inputModal} placeholder='Nome da categoria' placeholderTextColor={'#aaa'}
                                value={nomeCategoria} onChangeText={setNomeCategoria}
                            />
                            <TouchableOpacity style={[Estilos.corBotao, { backgroundColor: cor }]} onPress={()=> setCorModalVisible(true)}/>
                            <TouchableOpacity style={Estilos.iconeBotao} onPress={()=> setIconeModalVisible(true)}>
                                <MaterialIcons name={icone} size={24} color={'#fff'} />
                            </TouchableOpacity>
                        </View>
                        <View style={Estilos.modalBotoes}>
                            <TouchableOpacity onPress={botaoCancelar} styles={Estilos.botaoCancelar}>
                                <Text style={Estilos.TextbotaoCancelar}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={botaoSalvar} styles={Estilos.botaoSalvar}>
                                <Text style={Estilos.TextbotaoSalvar}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Modal de seleção de cor */}
            <Modal
                visible={corModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setCorModalVisible(false)}>
                <View style={Estilos.modalFundo}>
                    <View style={Estilos.seletorContainer}>
                        <TouchableOpacity onPress={() => setCorModalVisible(false)} style={Estilos.fecharModal}>
                            <MaterialIcons name="close" size={24} color={'#fff'} />
                        </TouchableOpacity>
                        <Text style={Estilos.modalTitulo}>ESCOLHA UMA COR:</Text>
                        <View style={Estilos.listaModal}>
                            {listaCores.map((corItem) => (
                                <TouchableOpacity
                                    key={corItem}
                                    style={[Estilos.corBotao, { backgroundColor: corItem }]}
                                    onPress={() => {
                                        setCor(corItem);
                                        setCorModalVisible(false);
                                    }}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de seleção de ícone */}
            <Modal
                visible={iconeModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIconeModalVisible(false)}>

                <View style={Estilos.modalFundo}>
                    <View style={Estilos.seletorContainer}>
                        <Text style={Estilos.modalTitulo}>Escolha um ícone</Text>
                        <View style={Estilos.listaModal}>
                            {listaIcones.map((iconeItem) => (
                                <TouchableOpacity
                                    key={iconeItem}
                                    style={Estilos.iconeBotao}
                                    onPress={() => {
                                        setIcone(iconeItem);
                                        setIconeModalVisible(false);
                                    }}>
                                    <MaterialIcons name={iconeItem} size={24} color="#FFF" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
export default Categorias

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f6fa',
    },
    ItemLista: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginVertical: 8,
        marginHorizontal: 12,
        shadowColor: '#008080',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#e6f7f4',
    },
    iconeCategoria: {
        marginRight: 18,
        borderRadius: 24,
        padding: 8,
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        shadowColor: '#008080',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nomeLista: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    tipoTransacao: {
        fontSize: 14,
        color: '#008080',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    icon: {
        marginLeft: 12,
        padding: 4,
        borderRadius: 8,
        backgroundColor: '#f1f6fa',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#222',
        textAlign: 'center',
        letterSpacing: 1,
    },
    textPlus: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 6,
        backgroundColor: '#008080',
        borderRadius: 12,
        overflow: 'hidden',
    },
    containerText: {
        padding: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
})