import React, { useState, useEffect, useContext} from 'react'
import { UsuarioContext } from '../UsuarioContext.jsx'
import { enderecoServidor, nomesTipoConta, iconesTipoConta } from '../utils.jsx'
import { MdAdd, MdEdit, MdDelete, MdCreditCard, MdAccountBalance, MdEmail, MdFeaturedPlayList, MdAttachMoney, MdAttachEmail, MdAutoGraph } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import Estilos from "../styles/Estilos.jsx"

export default function Contas(){
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext)
    const [dadosLista, setDadosLista] = useState([])

    const navigate = useNavigate()

    const buscarDadosAPI = async () => {
        try{
            const resposta = await fetch(`${enderecoServidor}/contas`,{
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${dadosUsuario.token}`,
                    'Content-Type': 'application/json'
                }
            });
            const dados = await resposta.json();
            setDadosLista(dados);
            console.log("Dados recebidos:", dados);
            
        }catch (error) {
            console.error("Erro ao buscar dados da API:", error);
        }
    }
        //executa quando a variavel usuario é carregada
        useEffect(() => {
            if (!carregando || dadosUsuario){
                buscarDadosAPI();
            }
        }, [dadosUsuario])

        const botaoExcluir = async (id) => {
            if (!window.confirm("Tem certeza que deseja excluir esta conta?")) return;
            try{
                const resposta = await fetch(`${enderecoServidor}/contas/${id}`,{
                    method: 'DELETE',
                    headers:{
                        'Authorization': `Bearer ${dadosUsuario.token}`,
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

        //função para exibir cada item da lista
        const exibirItemLista = (item) => {
            return(
                <div key={item.id_conta} className="flex items-center bg-gradient-to-r from-white-100 via-purple-100 to-gray-100 shadow-lg rounded-xl p-4 mb-4 transition-transform hover:scale-101">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full mr-4 shadow-md" style={{backgroundColor: '#E0F7FA'}}>
                        <span className="text-3xl text-cyan-600">{iconesTipoConta[item.tipo_conta]}</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-lg font-bold text-gray-800 mb-1">{item.nome}</p>
                        <p className="text-sm text-gray-600">{nomesTipoConta[item.tipo_conta]}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button title="Editar" className="bg-white border border-gray-300 rounded-full p-2 hover:bg-blue-200 transition-colors" onClick={() => navigate('/cadcontas', { state: { itemAlterar : item } })}>
                            <MdEdit className="text-blue-600 text-xl" />
                        </button>
                        <button title="Excluir" className="bg-white border border-gray-300 rounded-full p-2 hover:bg-red-200 transition-colors" onClick={() => botaoExcluir(item.id_conta)}>
                            <MdDelete className="text-red-600 text-xl" />
                        </button>
                    </div>
                </div>
            )
        }

    return(
        <div className="min-h-screen py-8 px-2 sm:px-8">
            <h1 className="text-4xl font-extrabold text-center mb-10">Contas</h1>
            <section className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Lista de Contas</h3>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-5 py-2 rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition-transform"
                            onClick={() => navigate("/cadcontas")}
                    >
                        <MdAdd className="w-7 h-7" />
                        Adicionar Conta 
                    </button>
                </div>
                <section>
                    {dadosLista.length === 0 ? (
                        <p className="text-center text-gray-400 text-lg">Nenhuma conta encontrada.</p>
                    ) : (
                        dadosLista.map(item => exibirItemLista(item))
                    )}
                </section>
            </section>
        </div>
    )
}