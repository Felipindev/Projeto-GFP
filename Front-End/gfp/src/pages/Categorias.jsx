import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext.jsx";
import { enderecoServidor } from "../utils.jsx";
import { useNavigate } from "react-router-dom";
import Estilos from "../styles/Estilos.jsx";
import { IconesCategorias } from "../utils.jsx";
import { MdAdd, MdDelete, MdEdit } from "react-icons/md";
import CategoriasModal from "./CategoriasModal.jsx";

export default function Categorias() {
  const { dadosUsuario, carregando } = useContext(UsuarioContext);
  const [dadosLista, setDadosLista] = useState([]);

  //variaveis de estado para o modal de adicionar 
  const [modalAberto, setModalAberto] = useState(false);
  const [itemAlterar, setItemAlterar] = useState(null);

  const navigate = useNavigate();

  //função para fechar o modal, alterando a variavel para false
  const fecharModal = () => {
    setModalAberto(false)
    setItemAlterar(null)
    buscarDadosAPI()
  }

  const botaoAlterar = (item) => {
    setModalAberto(true)
    setItemAlterar(item)
  }

  const buscarDadosAPI = async () => {
    try {
      const resposta = await fetch(`${enderecoServidor}/categorias`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${dadosUsuario.token}`,
          "Content-Type": "application/json",
        },
      });
      const dados = await resposta.json();
      setDadosLista(dados);
      console.log("Dados recebidos:", dados);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };
  //executa quando a variavel usuario é carregada
  useEffect(() => {
    if (!carregando || dadosUsuario) {
      buscarDadosAPI();
    }
  }, [dadosUsuario]);

  const botaoExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?"))
      return;
    try {
      const resposta = await fetch(`${enderecoServidor}/categorias/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${dadosUsuario.token}`,
          "Content-Type": "application/json",
        },
      });
      if (resposta.ok) {
        buscarDadosAPI();
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  //função para exibir cada item da lista
  const exibirItemLista = (item) => {
    return (
      <div key={item.id_categoria} className={Estilos.linhaListagem}>
        {/* icones */}
        <div
          className="p-2 text-white rounded-full"
          style={{ backgroundColor: item.cor }}
        >
          {IconesCategorias[item.icone]}
        </div>
        <div className="flex-1 ml-4">
          <p className="font-bold text-gray-800 mb-2 ml-1">{item.nome}</p>
          <span
            className={
              item.tipo_transacao === "SAIDA"
                ? "px-2 py-1 text-sm font-bold text-red-700 bg-red-200 rounded-full"
                : item.tipo_transacao === "ENTRADA"
                ? "px-2 py-1 text-sm font-bold text-green-700 bg-green-200 rounded-full"
                : "px-2 py-1 text-sm text-gray-700 bg-gray-200 rounded-full"
            }
          >
            {item.tipo_transacao}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className={Estilos.botaoAlterar}
            onClick={() => botaoAlterar(item)}>
            <MdEdit className="h7 w-7 text-green-800" />
          </button>
          <button
            className={Estilos.botaoExcluir}
            onClick={() => botaoExcluir(item.id_categoria)}
          >
            <MdDelete className="h7 w-7 text-red-800" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Categorias</h1>
      <section className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Lista de Categorias
          </h3>
          <button
            className={Estilos.botaoCadastro}
            onClick={() => setModalAberto(true)}
          >
            <MdAdd className="w-8 h-8" />
            Adicionar Categoria
          </button>
        </div>

        {/* lista de categorias cadastradas */}
        <section>{dadosLista.map((item) => exibirItemLista(item))}</section>
      </section>

      <CategoriasModal 
        modalAberto={modalAberto}
        fecharModal={fecharModal}
        itemAlterar={itemAlterar}
      />
    </div>
  );
}
