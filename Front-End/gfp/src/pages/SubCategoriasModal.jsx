import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext.jsx";
import { enderecoServidor } from "../utils.jsx";
import { MdCreditCard, MdClose, MdSave } from "react-icons/md";
import Estilos from "../styles/Estilos.jsx";

export default function SubCategoriasModal({modalAberto, fecharModal, itemAlterar, categoriaPai}) {
  const { dadosUsuario } = useContext(UsuarioContext);

  const [nome, setNome] = useState("");
  
  useEffect(() => {
    if (itemAlterar) {
      setNome(itemAlterar.nome);
    } else {
      setNome("");
    }
  }, [itemAlterar, modalAberto])

  if(modalAberto == false){
    return null
  }

  const botaoSalvar = async () => {
    if (nome.trim() == "") {
      alert("Informe o nome da Subcategoria");
      return;
    }

    const dados = {
      nome: nome,
      id_categoria: categoriaPai,
      gasto_fixo: false,
      cor: "#000000",
      icone: "MdCreditCard",
      ativo: true,
    };

    try {
      let endpoint = `${enderecoServidor}/subCategorias`;
      let metodo = "POST";

      if (itemAlterar) {
        endpoint = `${enderecoServidor}/subCategorias/${itemAlterar.id_subcategoria}`;
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
        alert("SubCategoria editada com sucesso");
        fecharModal()
      } else {
        alert("SubCategoria Cadastrada com sucesso")
        fecharModal()
      }
    } catch (error) {
      alert("Erro ao salvar subcategoria: " + error.message);
      console.error("erro ao salvar subcategoria: ", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 py-6 px-4">
      <section className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-gray-800">
        {/* cabeçalho */}
        <header className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
          <MdCreditCard className="text-cyan-600 h-8 w-8" />
          {itemAlterar ? <h2 className="text-2xl font-bold">Editar Subcategoria</h2> : <h2 className="text-2xl font-bold">Nova Subcategoria</h2>}
        </header>

        {/* formulario  */}
        <div className="space-y-5">
          <label className={Estilos.labelCadastro}>Nome da Subcategoria</label>
          <input
            className={Estilos.inputCadastro}
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Supermercado, escola, etc..."
          />
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
