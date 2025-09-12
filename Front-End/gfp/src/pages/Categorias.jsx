import { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext.jsx";
import { enderecoServidor } from "../utils.jsx";
import Estilos from "../styles/Estilos.jsx";
import { IconesCategorias } from "../utils.jsx";
import { MdAdd, MdArrowForwardIos, MdDelete, MdEdit, MdExpandMore, } from "react-icons/md";
import CategoriasModal from "./CategoriasModal.jsx";
import SubCategoriasModal from "./SubCategoriasModal.jsx";

export default function Categorias() {
  const { dadosUsuario, carregando } = useContext(UsuarioContext);
  const [dadosLista, setDadosLista] = useState([]);

  //variaveis de estado para o modal de adicionar
  const [modalAberto, setModalAberto] = useState(false);
  const [itemAlterar, setItemAlterar] = useState(null);

  //NOVOS ESTADOS PARA SUBCATEGORIA
  const [categoriaAbertaId, setCategoriaAbertaId] = useState(null); //armazena o id da categoria que eu cliquei
  const [subcategoriaLista, setSubcategoriaLista] = useState([]);
  const [subcategoriaModalAberto, setSubcategoriaModalAberto] = useState(false);
  const [subcategoriaItemAlterar, setSubcategoriaItemAlterar] = useState(null);

  //função para fechar o modal, alterando a variavel para false
  const fecharModal = () => {
    setModalAberto(false);
    setItemAlterar(null);
    buscarDadosAPI();
  };

  const botaoAlterar = (item) => {
    setModalAberto(true);
    setItemAlterar(item);
  };

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
    const estaAberta = categoriaAbertaId == item.id_categoria;

    return (
      <section key={item.id_categoria}>
        <div
          className={Estilos.linhaListagem}
          onClick={() => exibirListagemSubcategorias(item.id_categoria)}
        >
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
            {!estaAberta ? 
              <MdArrowForwardIos className="h-7 w-7" />
              : 
              <MdExpandMore className="w-7 h-7 text-gray-500" />
            }

            <button
              className={Estilos.botaoAlterar}
              onClick={() => botaoAlterar(item)}
            >
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
        {/* exibindo lista de subcategorias */}
        {estaAberta ? exibirSubcategorias(item) : null}
      </section>
    );
  };

  //funções subcategoria
  const exibirListagemSubcategorias = (id) => {
    if (categoriaAbertaId == id) {
      setCategoriaAbertaId(null);
    } else {
      setCategoriaAbertaId(id);
      buscarDadosSubCategoriasAPI(id);
    }
  };

  const buscarDadosSubCategoriasAPI = async (id) => {
    try {
      const resposta = await fetch(`${enderecoServidor}/subCategorias/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${dadosUsuario.token}`,
          "Content-Type": "application/json",
        },
      });
      const dados = await resposta.json();
      setSubcategoriaLista(dados);
      console.log("Dados recebidos (detalhe):", JSON.stringify(dados, null, 2));
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  const botaoNovaSubcategoria = () => {
    setSubcategoriaItemAlterar(null);
    setSubcategoriaModalAberto(true);
  };

  const botaoAlterarSubcategoria = (item) => {
    setSubcategoriaItemAlterar(item);
    setSubcategoriaModalAberto(true);
  };

  const botaoExcluirSubcategoria = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta subcategoria?"))
      return;
    try {
      const resposta = await fetch(`${enderecoServidor}/subCategorias/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${dadosUsuario.token}`,
          "Content-Type": "application/json",
        },
      });
      if (resposta.ok) {
        buscarDadosSubCategoriasAPI(categoriaAbertaId);
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  const fecharModalSubcategoria = () => {
    setSubcategoriaModalAberto(false);
    setSubcategoriaItemAlterar(null);
    if (categoriaAbertaId != null) {
      buscarDadosSubCategoriasAPI(categoriaAbertaId);
    }
  };

  const exibirSubcategorias = (categoria) => {
    return (
      <div className="bg-gray-50 p-4 mb-4 mt-2 ml-10 rounded-lg shadow-inner border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold text-gray-700 italic">
            Subcategorias de {categoria.nome}
          </h4>
          <button
            onClick={botaoNovaSubcategoria}
            className="bg-gradient-to-r from-blue-500 to-cyan-700 px-3 py-1 rounded-md flex items-center"
          >
            <MdAdd className="w-5 h-5 mr-1" /> Nova SubCategoria
          </button>
        </div>

        {subcategoriaLista.length == 0 ? (
          <p className="font-bold italic text-gray-800">
            nenhuma subcategoria Cadastrada
          </p>
        ) : null}

        <div className="space-y-2">
          {subcategoriaLista.map((subcategoria) => (
            <div
              key={subcategoria.id_subcategoria}
              className="flex justify-between items-center p-2 bg-white rounded shadow-sm "
            >
              <p className="text-gray-800">{subcategoria.nome}</p>
              <div className="flex items-center space-x-2">
                <button
                  className={Estilos.botaoAlterar}
                  onClick={() => botaoAlterarSubcategoria(subcategoria)}
                >
                  <MdEdit className="h7 w-7 text-green-800" />
                </button>
                <button
                  className={Estilos.botaoExcluir}
                  onClick={() =>
                    botaoExcluirSubcategoria(subcategoria.id_subcategoria)
                  }
                >
                  <MdDelete className="h7 w-7 text-red-800" />
                </button>
              </div>
            </div>
          ))}
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

      <SubCategoriasModal
        modalAberto={subcategoriaModalAberto}
        fecharModal={fecharModalSubcategoria}
        itemAlterar={subcategoriaItemAlterar}
        categoriaPai={categoriaAbertaId}
      />
    </div>
  );
}
