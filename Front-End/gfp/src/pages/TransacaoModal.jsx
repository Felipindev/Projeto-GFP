import { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext.jsx";
import { enderecoServidor } from "../utils.jsx";
import { MdCreditCard, MdClose, MdSave } from "react-icons/md";
import Estilos from "../styles/Estilos.jsx";

export default function TransacaoModal({
  modalAberto,
  fecharModal,
  itemAlterar,
}) {
  const { dadosUsuario } = useContext(UsuarioContext);

  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("SAIDA");
  const [valor, setValor] = useState("");
  const [dataVencimento, setDataVencimento] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dataPagamento, setDataPagamento] = useState(null);
  const [idConta, setIdConta] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [idSubcategoria, setIdSubcategoria] = useState("");

  // variaveis para armazenar os dados da api para os selects
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);

  useEffect(() => {
    if (itemAlterar) {
      // setDescricao(itemAlterar.descricao);
      // setTipo(itemAlterar.tipo);
      // setValor(itemAlterar.valor);
      // setDataVencimento(itemAlterar.data_vencimento ? itemAlterar.data_vencimento.split('T')[0] : new Date().toISOString().split('T')[0]);
      // setDataPagamento(itemAlterar.data_pagamento ? itemAlterar.data_pagamento.split('T')[0] : null);
      // setIdConta(itemAlterar.id_conta);
      // setIdCategoria(itemAlterar.id_categoria);
      // setIdSubcategoria(itemAlterar.id_subcategoria);
    } else {
      setDescricao("");
      setTipo("SAIDA");
      setValor("");
      setDataVencimento(new Date().toISOString().split("T")[0]);
      setDataPagamento(null);
      setIdConta("");
      setIdCategoria("");
      setIdSubcategoria("");
    }

    if (modalAberto == true) {
      carregarContas();
      carregarCategorias();
    }
  }, [itemAlterar, modalAberto]);

  useEffect(() => {
    if (idCategoria != ''){
      carregarSubcategorias(idCategoria);
    }

  }, [idCategoria]);

  if (modalAberto == false) {
    return null;
  }

  //Dados api das contas
  const carregarContas = async () => {
    try {
      const resposta = await fetch(`${enderecoServidor}/contas`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${dadosUsuario.token}`,
          "Content-Type": "application/json",
        },
      });
      const dados = await resposta.json();
      setContas(dados);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  //Dados api das categorias
  const carregarCategorias = async () => {
    try {
      const resposta = await fetch(`${enderecoServidor}/categorias`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${dadosUsuario.token}`,
          "Content-Type": "application/json",
        },
      });
      const dados = await resposta.json();
      setCategorias(dados);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  const carregarSubcategorias = async (id) => {
    try {
      const resposta = await fetch(`${enderecoServidor}/subCategorias/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${dadosUsuario.token}`,
          "Content-Type": "application/json",
        },
      });
      const dados = await resposta.json();
      setSubcategorias(dados);
      console.log("Dados recebidos (detalhe):", JSON.stringify(dados, null, 2));
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };


  const botaoSalvar = async () => {
    if (descricao.trim() == "" || !valor || !dataVencimento) {
      alert("Preencha os campos obrigatórios, marcados com *");
      return;
    }

    const dados = {
      valor: parseFloat(valor),
      descricao: descricao,
      data_vencimento: dataVencimento,
      data_pagamento: dataPagamento,
      tipo_transacao: tipo,
      id_conta: parseInt(idConta),
      id_categoria: parseInt(idCategoria),
      id_subcategoria: parseInt(idSubcategoria),
      id_usuario: dadosUsuario.id_usuario,
    };

    try {
      let endpoint = `${enderecoServidor}/transacao`;
      let metodo = "POST";

      if (itemAlterar) {
        endpoint = `${enderecoServidor}/transacao/${itemAlterar.id_transacao}`;
        metodo = "PUT";
      }

      const resposta = await fetch(endpoint, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dadosUsuario.token}`,
        },
        body: JSON.stringify(dados),
      });

      if (resposta.ok || itemAlterar) {
        alert("transação editada com sucesso");
        fecharModal();
      } else {
        alert("transação Cadastrada com sucesso");
        fecharModal();
      }
    } catch (error) {
      alert("Erro ao salvar transação: " + error.message);
      console.error("erro ao salvar transação: ", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 py-6 px-4">
      <section className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-gray-800">
        {/* cabeçalho */}
        <header className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
          <MdCreditCard className="text-cyan-600 h-8 w-8" />
          {itemAlterar ? (
            <h2 className="text-2xl font-bold">Editar Transação</h2>
          ) : (
            <h2 className="text-2xl font-bold">Nova Transação</h2>
          )}
        </header>

        {/* formulario  */}
        <div className="space-y-5">
          <div className="flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setTipo("ENTRADA")}
              className={`flex-1 rounded-l-md py-2 
              ${
                tipo == "ENTRADA"
                  ? "bg-gradient-to-r from-cyan-400 to-blue-600 text-white"
                  : "bg-gray-200"
              } `}
            >
              ENTRADA
            </button>
            <button
              type="button"
              onClick={() => setTipo("SAIDA")}
              className={`flex-1 rounded-r-md py-2 
              ${
                tipo == "SAIDA"
                  ? "bg-gradient-to-l from-red-400 to-red-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              SAIDA
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2/3">
              <label className={Estilos.labelCadastro}>
                Descrição da Transação *
              </label>
              <input
                className={Estilos.inputCadastro}
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Escola, Supermercado, PetShop..."
              />
            </div>
            <div className="w-1/3">
              <label className={Estilos.labelCadastro}>Valor *</label>
              <input
                className={Estilos.inputCadastro}
                type="number"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ex: 0,00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-1/2">
              <label className={Estilos.labelCadastro}>Data Vencimento *</label>
              <input
                className={Estilos.inputCadastro}
                type="date"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <label className={Estilos.labelCadastro}>Data pagamento</label>
              <input
                className={Estilos.inputCadastro}
                type="date"
                value={dataPagamento}
                onChange={(e) => setDataPagamento(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={Estilos.labelCadastro}>Conta / Cartão</label>
            <select
              className={Estilos.inputCadastro}
              value={idConta}
              onChange={(e) => setIdConta(e.target.value)}
            >
              <option>Selecione uma conta...</option>
              {
                contas.map((conta) => (
                  <option key={conta.id_conta} value={conta.id_conta}>
                    {conta.nome} 
                  </option>
                ))
              }
            </select>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-1/2">
              <label className={Estilos.labelCadastro}>Categoria</label>
              <select
                className={Estilos.inputCadastro}
                value={idCategoria}
                onChange={(e) => setIdCategoria(e.target.value)}
              >
                <option>Selecione uma categoria...</option>
                {
                  categorias.filter(categoria => categoria.tipo_transacao == tipo).map((categoria) => (
                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                      {categoria.nome}
                    </option>
                  ))
                }
              </select>
            </div>
            <div className="w-1/2">
              <label className={Estilos.labelCadastro}>
                Subcategoria ( opcional )
              </label>
              <select
                className={Estilos.inputCadastro}
                value={idSubcategoria}
                onChange={(e) => setIdSubcategoria(e.target.value)}
              >
                <option>Selecione uma subcategoria...</option>
                {
                  subcategorias.filter(subcategoria => subcategoria.id_categoria == idCategoria).map((subcategoria) => (
                    <option key={subcategoria.id_subcategoria} value={subcategoria.id_subcategoria}>
                      {subcategoria.nome}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>

          {/* botoes */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              className={Estilos.botaoOutline}
              onClick={() => fecharModal()}
            >
              <MdClose />
              Cancelar
            </button>
            <button className={Estilos.botao} onClick={botaoSalvar}>
              <MdSave />
              Salvar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
