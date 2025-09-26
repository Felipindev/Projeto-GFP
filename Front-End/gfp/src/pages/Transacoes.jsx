import React, { useState, useEffect, useContext} from 'react'
import { UsuarioContext } from '../UsuarioContext.jsx'
import { enderecoServidor, nomesTipoConta, iconesTipoConta, IconesCategorias } from '../utils.jsx'
import { MdAdd, MdEdit, MdDelete, MdCreditCard, MdAccountBalance, MdEmail, MdFeaturedPlayList, MdAttachMoney, MdAttachEmail, MdAutoGraph } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import Estilos from "../styles/Estilos.jsx"

export default function Transacoes(){
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext)
    const [dadosLista, setDadosLista] = useState([])

    const navigate = useNavigate()

    const buscarDadosAPI = async () => {
        try{
            const resposta = await fetch(`${enderecoServidor}/transacao`,{
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
            if (!window.confirm("Tem certeza que deseja excluir esta transação?")) return;
            try{
                const resposta = await fetch(`${enderecoServidor}/transacao/${id}`,{
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
                <div key={item.id_transacao} className={Estilos.linhaListagem}>
                    <div className={`text-white rounded-full p-2`} style={{backgroundColor: item.cor}}>
                        {IconesCategorias[item.icone]}
                    </div>
                    <div className='flex-1 p-2'>
                        <p className='text-gray-800 font-semibold text-sm truncate'>{item.descricao}</p>
                        <div className='flex justify-between items-center'>
                            <div>
                                <p className='text-sm text-gray-500 truncate'>{item.nome_subcategoria}</p>
                                <div className='flex '>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

    return(
        <div>  
            <h1 className= 'text-3xl font-bold mb-6'>transações</h1>
            <section className='bg-white p-4 rounded-lg shadow-md'>
                <div className='flex justify-between items-center mb-4'>     
                    {/* conteudo da busca de transcoes */}
                </div>

                 {/* lista de contas cadastradas */}
                <section>
                    {dadosLista.map(item => exibirItemLista(item))}
                </section>
            </section>

           
        </div>
    )
}