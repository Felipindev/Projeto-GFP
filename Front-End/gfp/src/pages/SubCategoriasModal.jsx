import React, { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext.jsx";
import { enderecoServidor } from "../utils.jsx";
import { MdCreditCard, MdClose, MdSave } from "react-icons/md";
import Estilos from "../styles/Estilos.jsx";

export default function SubCategoriasModal({modalAberto, fecharModal, itemAlterar}) {
  const { dadosUsuario } = useContext(UsuarioContext);

  const [nome, setNome] = useState("");
  
  useEffect(() => {
    if (itemAlterar) {
      setNome(itemAlterar.nome);
    }
  }, [itemAlterar, modalAberto])

  if(modalAberto == false){
    return null
  }

  const botaoSalvar = async () => {
    if (nome.trim() == "") {
      alert("Informe o nome da categoria");
      return;
    }

    const dados = {
      nome: nome,
      ativo: true,
    };

    try {
      let endpoint = `${enderecoServidor}/categorias`;
      let metodo = "POST";

      if (itemAlterar) {
        endpoint = `${enderecoServidor}/categorias/${itemAlterar.id_categoria}`;
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
        alert("Categoria editada com sucesso");
        fecharModal()
      } else {
        alert("Categoria Cadastrada com sucesso")
        fecharModal()
      }
    } catch (error) {
      alert("Erro ao salvar categoria: " + error.message);
      console.error("erro ao salvar categoria: ", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 animate-bounce py-6 px-4">
      <section className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-gray-800">
        {/* cabeçalho */}
        <header className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
          <MdCreditCard className="text-cyan-600 h-8 w-8" />
          {itemAlterar ? <h2 className="text-2xl font-bold">Editar Categoria</h2> : <h2 className="text-2xl font-bold">Nova Categoria</h2>}
        </header>

        {/* formulario  */}
        <div className="space-y-5">
          <label className={Estilos.labelCadastro}>Nome da Categoria</label>
          <input
            className={Estilos.inputCadastro}
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Alimentação, lazer, etc"
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
