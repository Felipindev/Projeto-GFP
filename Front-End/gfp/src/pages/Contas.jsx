import React, { useState, useEffect, useContext} from 'react'
import { UsuarioContext } from '../UsuarioContext.jsx'
import { enderecoServidor } from '../utils.jsx'
import { MdAdd, MdEdit, MdDelete, MdCreditCard, MdAccountBalance, MdEmail, MdFeaturedPlayList, MdAttachMoney, MdAttachEmail, MdAutoGraph } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import Estilos from "../styles/Estilos.jsx"

export default function Contas(){
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext)
    const [dadosLista, setDadosLista] = useState([])

    const navigate = useNavigate()

    const iconesTipoConta = {
        'CONTA_CORRENTE': <MdAccountBalance className='w-6 h-6'/>,
        'POUPANCA': <MdEmail className='w-6 h-6'/>,
        'CARTAO_CREDITO': <MdCreditCard className='w-6 h-6' />,
        'CARTAO_DEBITO': <MdFeaturedPlayList className='w-6 h-6' />,
        'DINHEIRO': <MdAttachMoney className='w-6 h-6' />,
        'INVESTIMENTO': <MdAutoGraph className='w-6 h-6' />,
    }
    const nomesTipoConta = {
        'CONTA_CORRENTE': 'Conta Corrente',
        'POUPANCA': 'Poupança',
        'CARTAO_CREDITO': 'Cartão de Crédito',
        'CARTAO_DEBITO': 'Cartão de Débito',
        'DINHEIRO': 'Dinheiro',
        'INVESTIMENTO': 'Investimento',
    }

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
                <div key={item.id_conta} className={Estilos.linhaListagem}>
                    <div className='p-2 bg-cyan-100 text-cyan-600 rounded-full'>
                        {iconesTipoConta[item.tipo_conta]}
                    </div>
                    <div className='flex-1 ml-4'>
                        <p className='font-bold text-gray-800'>{item.nome}</p>
                        <p className='text-sm text-gray-600'>{nomesTipoConta[item.tipo_conta]}</p>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <button className={Estilos.botaoAlterar} onClick={() => navigate('/cadcontas', { state: { itemAlterar : item } })}><MdEdit className='h7 w-7 text-green-800'/></button>
                        <button className={Estilos.botaoExcluir} onClick={() => botaoExcluir(item.id_conta)}><MdDelete className='h7 w-7 text-red-800'/></button>
                    </div>
                </div>
            )
        }

    return(
        <div>  
            <h1 className= 'text-3xl font-bold mb-6'>Contas</h1>
            <section className='bg-white p-4 rounded-lg shadow-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-xl font-bold text-gray-800'>Lista de Contas</h3>
                    <button className={Estilos.botaoCadastro}
                            onClick={() => navigate("/cadcontas")}>
                        <MdAdd className='w-8 h-8' />
                        Adicionar Conta 
                    </button>


                </div>

                 {/* lista de contas cadastradas */}
                <section>
                    {dadosLista.map(item => exibirItemLista(item))}
                </section>
            </section>

           
        </div>
    )
}