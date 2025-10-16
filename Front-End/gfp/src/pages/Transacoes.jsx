import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext.jsx";
import {
  enderecoServidor,
  nomesTipoConta,
  iconesTipoConta,
  IconesCategorias,
  calcularDatasPeriodo,
} from "../utils.jsx";
import {
  MdAdd,
  MdDelete,
  MdSearch,
  MdAccountBalance,
  MdEmail,
  MdFeaturedPlayList,
  MdAttachMoney,
  MdAttachEmail,
  MdAutoGraph,
  MdDone,
  MdCheckCircle,
  MdError,
  MdAccessTime,
} from "react-icons/md";
// import { useNavigate } from 'react-router-dom'
import Estilos from "../styles/Estilos.jsx";

export default function Transacoes() {
  const { dadosUsuario, setDadosUsuario, carregando } =
    useContext(UsuarioContext);
  const [dadosLista, setDadosLista] = useState([]);

  //guardadno os dados do filtro
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState({
    tipo: "todos",
    status: "todos",
    periodo: "esteMes",
  });

  // const navigate = useNavigate()

  const buscarDadosAPI = async () => {
    try {
        //calcular as datas de início e fim do período selecionado
        const {dataInicio, dataFim} = calcularDatasPeriodo(filtro.periodo)

        //usa o urlsearchparams para montar a query string de forma segura
        const parametros = new URLSearchParams();

        parametros.append('dataInicio', dataInicio)
        parametros.append('dataFim', dataFim)

      const resposta = await fetch(`${enderecoServidor}/transacao?${parametros.toString()}`, {
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
  }, [dadosUsuario, filtro.periodo]);

  const botaoExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta transação?"))
      return;
    try {
      const resposta = await fetch(`${enderecoServidor}/transacao/${id}`, {
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
  const botaoQuitar = async (id) => {
    if (!window.confirm("Tem certeza que deseja quitar esta conta?")) return;

    const dados = {
      data_pagamento: new Date().toISOString().slice(0, 10),
    };
    try {
      const resposta = await fetch(`${enderecoServidor}/transacao/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${dadosUsuario.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });
      if (resposta.ok) {
        buscarDadosAPI();
      }
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  const montarStatus = (item) => {
    const hoje = new Date();
    const vencimento = new Date(item.data_vencimento);
    let status = {};

    if (item.data_pagamento != null) {
      status = {
        cor: "text-green-600",
        icone: <MdCheckCircle className="h-4 w-4" />,
        texto: `Pago em ${formatarData(item.data_pagamento)}`,
      };
    } else if (vencimento < hoje) {
      status = {
        cor: "text-red-600",
        icone: <MdError className="h-4 w-4" />,
        texto: `vencido em ${formatarData(item.data_vencimento)}`,
      };
    } else {
      status = {
        cor: "text-blue-600",
        icone: <MdAccessTime className="h-4 w-4" />,
        texto: `vencerá em ${formatarData(item.data_vencimento)}`,
      };
    }

    return status;
  };

  const formatarData = (data) => {
    const dataFormatada = new Date(data);
    return dataFormatada.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  //função para exibir cada item da lista
  const exibirItemLista = (item) => {
    const status = montarStatus(item);

    return (
      <div
        key={item.id_transacao}
        className="flex items-center bg-gradient-to-r from-white-100 via-purple-100 to-gray-100 shadow-lg rounded-xl p-4 mb-4 transition-transform hover:scale-101"
      >
        <div
          className="flex items-center justify-center w-14 h-14 rounded-full mr-4 shadow-md"
          style={{ backgroundColor: item.cor }}
        >
          <span className="text-3xl">{IconesCategorias[item.icone]}</span>
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-gray-800 mb-1">
            {item.descricao}
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 truncate">
                {item.nome_subcategoria}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {item.nome_conta}
              </p>

              {/* status */}
              <div
                className={`flex items-center gap-1 text-sm font-medium ${status.cor}`}
              >
                {status.icone}
                <span>{status.texto}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              {/* valor */}
              <span
                className={`font-bold text-lg ${
                  item.tipo_transacao == "SAIDA"
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {item.tipo_transacao === "SAIDA" ? "-" : "+"} R${" "}
                {parseFloat(item.valor).toFixed(2)}
              </span>
              <div className="flex space-x-2 mt-2">
                {!item.data_pagamento && (
                  <button
                    title="Quitar"
                    className="bg-white border border-gray-300 rounded-full p-2 hover:bg-blue-200 transition-colors"
                    onClick={() => botaoQuitar(item.id_transacao)}
                  >
                    <MdDone className="text-blue-600 text-xl" />
                  </button>
                )}

                <button
                  title="Excluir"
                  className="bg-white border border-gray-300 rounded-full p-2 hover:bg-red-200 transition-colors"
                  onClick={() => botaoExcluir(item.id_transacao)}
                >
                  <MdDelete className="text-red-600 text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-5 px-2 sm:px-8">
      <h1 className="text-4xl font-extrabold text-center mb-10 ">Transações</h1>
      <section className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-2xl text-gray-800">
        <div className="flex mb-3 gap-2 flex-wrap ">
          {/* Filtro, busca ou botão de adicionar transação futuramente */}
          <div className="flex-1 min-w-48 ">
            <label>Busca: </label>
            <div className="relative">
              <MdSearch className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="buscar transação..."
                className={`${Estilos.inputCadastro} pl-9`}
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
              />
            </div>
          </div>

          {/* seleção de período*/}
          <div className="flex-1 min-w-48">
            <label>Período: </label>
            <select
              className={`${Estilos.inputCadastro}`}
              value={filtro.periodo}
              onChange={(e) => setFiltro({ ...filtro, periodo: e.target.value })}
            >
              <option value="esteMes">Este Mês</option>
              <option value="mesPassado">Mês Passado</option>
              <option value="ultimos7">Últimos 7 dias</option>
              <option value="ultimos30">Últimos 30 dias</option>
              <option value="todos">Todos</option>
            </select>
          </div>

          {/* seleção de tipo*/}
          <div className="flex-1 min-w-48">
            <label>Tipo: </label>
            <select
              className={`${Estilos.inputCadastro}`}
              value={filtro.tipo}
              onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
            >
              <option value="todos">Todos</option>
              <option value="ENTRADA">Entrada</option>
              <option value="SAIDA">Saída</option>
            </select>
          </div>

          {/* seleção de status*/}
          <div className="flex-1 min-w-48">
            <label>Status: </label>
            <select
              className={`${Estilos.inputCadastro}`}
              value={filtro.status}
              onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
            >
              <option value="todos">Todos</option>
              <option value="aberto">Aberto</option>
              <option value="vencidos">Vencidos</option>
              <option value="pagos">Pagos</option>
            </select>
          </div>
        </div>

        <section>
          {dadosLista.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">
              Nenhuma transação encontrada.
            </p>
          ) : (
            dadosLista
              .filter((item) =>
                item.descricao.toLowerCase().includes(pesquisa.toLowerCase())
              )
              .filter((item) =>
                filtro.tipo == "todos"
                  ? true
                  : item.tipo_transacao == filtro.tipo
              )
              .filter(
                (item) =>
                  filtro.status == "todos" ||
                  (filtro.status == "pagos" && item.data_pagamento != null) ||
                  (filtro.status == "aberto" &&
                    item.data_pagamento == null &&
                    new Date(item.data_vencimento) >= new Date()) ||
                  (filtro.status == "vencidos" &&
                    item.data_pagamento == null &&
                    new Date(item.data_vencimento) < new Date())
              )
              .map((item) => exibirItemLista(item))
          )}
        </section>
      </section>
    </div>
  );
}
