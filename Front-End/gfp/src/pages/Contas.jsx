import React, { useState, useEffect, useContext} from 'react'
import { UsuarioContext } from '../UsuarioContext.jsx'
import { enderecoServidor } from '../utils.jsx'
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'

export default function Contas(){
    const { dadosUsuario, setDadosUsuario, carregando } = useContext(UsuarioContext)
    const [dadosLista, setDadosLista] = useState([])

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

    return(
        <div>  
            <h1 className= 'text-3xl font-bold mb-6'>Contas</h1>
            <section className='bg-white p-4 rounded-lg shadow-md'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-xl font-bold text-gray-800'>Lista de Contas</h3>
                    <button className='bg-gradient-to-r from-blue-500 to-cyan-700 text-white px-4 py-2 rounded-lg flex items-center gap-2'>
                        <MdAdd className='w-8 h-8' />
                        Adicionar Conta
                    </button>

                </div>
                
            </section>
        </div>
    )
}