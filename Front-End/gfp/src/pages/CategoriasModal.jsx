import { useState, useEffect, useContext } from "react";
import { UsuarioContext } from "../UsuarioContext.jsx";
import { enderecoServidor, IconesCategorias, listaCores, listaIcones } from "../utils.jsx";
import { MdCreditCard, MdClose, MdSave, MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import Estilos from "../styles/Estilos.jsx";

export default function CategoriasModal({modalAberto, fecharModal, itemAlterar}) {
  const { dadosUsuario } = useContext(UsuarioContext);

  const [nome, setNome] = useState("");
  // const [descricao, setDescricao] = useState('')
  const [tipoTransacao, setTipoTransacao] = useState('SAIDA')
  const [gastoFixo, setGastoFixo] = useState(false)
  const [cor, setCor] = useState(listaCores[0])
  const [icones, setIcones] = useState(listaIcones[0])
  const [pageIndex, setPageIndex] = useState(0);
  const [pageIndex1, setPageIndex1] = useState(0);
  const coresPorLinha = 8; // quantidade de cores por linha
  const iconesPorLinha = 8; //quantidade de icones por linha

  // calcula o pedaço da lista para a página atual
  const coresVisiveis = listaCores.slice(
    pageIndex * coresPorLinha,
    (pageIndex + 1) * coresPorLinha
  );
  // calcula o pedaço da lista para a página atual
  const iconesVisiveis = listaIcones.slice(
    pageIndex1 * iconesPorLinha,
    (pageIndex1 + 1) * iconesPorLinha
  );

  
  useEffect(() => {
    if (itemAlterar) {
      setNome(itemAlterar.nome);
      setTipoTransacao(itemAlterar.tipo_transacao)
      setGastoFixo(itemAlterar.gasto_fixo)
      setIcones(itemAlterar.icone)
      setCor(itemAlterar.cor)
    } else {
      setNome('')
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
      // descricao: descricao,
      tipo_transacao: tipoTransacao,
      gasto_fixo: gastoFixo,
      id_usuario: dadosUsuario.id_usuario,
      icone: icones,
      cor: cor,
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
    <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 py-6 px-4">
      <section className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg text-gray-800">
        {/* cabeçalho */}
        <header className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
          <MdCreditCard className="text-cyan-600 h-8 w-8" />
          {itemAlterar ? <h2 className="text-2xl font-bold">Editar Categoria</h2> : <h2 className="text-2xl font-bold">Nova Categoria</h2>}
        </header>

        {/* formulario  */}
        <div className="space-y-5">
          <div className="flex rounded-md shadow-sm">
            <button type="button" onClick={() => setTipoTransacao("ENTRADA")} className={`flex-1 rounded-l-md py-2 
              ${tipoTransacao == 'ENTRADA' ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white' : 'bg-gray-200'} `}>ENTRADA
            </button>
            <button type='button' onClick={() => setTipoTransacao("SAIDA")} className={`flex-1 rounded-r-md py-2 
              ${tipoTransacao == 'SAIDA' ? 'bg-gradient-to-l from-red-400 to-red-600 text-white' : 'bg-gray-200'}`}>SAIDA
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2/3">
              <label className={Estilos.labelCadastro}>Nome da Categoria</label>
              <input
                className={Estilos.inputCadastro}
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Alimentação, lazer, etc"
              />
            </div>
              <input
                className="ml-3 items-center " 
                type="checkbox"
                checked={gastoFixo}
                onChange={(e) => setGastoFixo(e.target.checked)} 
              />
              <label>Gasto Fixo</label>
          </div>

          {/* <label className={Estilos.labelCadastro}>Descrição da Categoria (opcional)</label>
          <input
            className={Estilos.inputCadastro}
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Gasto com alimentos"
          /> */}

          <label className={Estilos.labelCadastro}>Escolha uma Cor:</label>
          <div className="flex items-center gap-3">
            {/* botão voltar */}
            <button 
              type="button"
              disabled={pageIndex === 0}
              onClick={() => setPageIndex(prev => Math.max(prev - 1, 0))}
              className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
            >
              <MdArrowBackIos className="w-6 h-6" />
            </button>

            {/* linha de cores */}
            <div className="flex gap-2">
              {coresVisiveis.map((corItem) => (
                <div
                  key={corItem}
                  onClick={() => setCor(corItem)}
                  style={{ backgroundColor: corItem }}
                  className={`w-10 h-10 rounded-full cursor-pointer border-2 transition hover:scale-110
                    ${cor === corItem ? "ring-2 ring-offset-2 scale-110" : ""}`}
                />
              ))}
            </div>

            {/* botão avançar */}
            <button 
              type="button"
              disabled={(pageIndex + 1) * coresPorLinha >= listaCores.length}
              onClick={() => setPageIndex(prev => prev + 1)}
              className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
            >
              <MdArrowForwardIos className="w-6 h-6" />
            </button>
          </div>

          <label className={Estilos.labelCadastro}>Escolha um Icone:</label>
          <div className="flex items-center gap-3">
            {/* botão voltar */}
            <button 
              type="button"
              disabled={pageIndex1 === 0}
              onClick={() => setPageIndex1(prev => Math.max(prev - 1, 0))}
              className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
            >
              <MdArrowBackIos className="w-6 h-6" />
            </button>

            {/* linha de icones */}
            <div className="flex gap-2">
              {iconesVisiveis.map((iconeItem) => (
                <button
                  key={iconeItem}
                  onClick={() => setIcones(iconeItem)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full 
                    ${icones === iconeItem ? "ring-2 ring-offset-2 ring-cyan-500 scale-110" : ""} 
                    cursor-pointer border-2 transition hover:scale-110 text-white`}
                  style={{ backgroundColor: cor }}
                >
                  {IconesCategorias[iconeItem]}
                </button>
              ))}
            </div>

            {/* botão avançar */}
            <button 
              type="button"
              disabled={(pageIndex1 + 1) * iconesPorLinha >= listaIcones.length}
              onClick={() => setPageIndex1(prev => prev + 1)}
              className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
            >
              <MdArrowForwardIos className="w-6 h-6" />
            </button>
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
