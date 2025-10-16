import React, { useState, useEffect, useContext } from "react";
import CardIndicador from "../components/CardIndicador.jsx";
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
  MdAutoAwesome,
  MdTrendingUp,
  MdTrendingDown,
  MdWallet,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Estilos from "../styles/Estilos.jsx";

export default function Dashboard() {
  const { dadosUsuario } = useContext(UsuarioContext);
  const [filtro, setFiltro] = useState({ periodo: "esteMes" });
  const [carregando, setCarregando] = useState(true);

  return (
    <div>
      {/* cabeçalho com filtro e botao de analise de IA */}
      <section className="flex mb-8 justify-between items-center gap-4 sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Financeiro</h1>
          <p className="text-gray-200">Resumo de suas finanças</p>
        </div>
        <div className="flex items-center gap-3">
            <div>
          <select
            className={`${Estilos.inputCadastro}`}
            value={filtro.periodo}
            onChange={(e) => setFiltro({ ...filtro, periodo: e.target.value })}
          >
            <option value="esteMes" className="text-gray-800 bg-transparent">Este Mês</option>
            <option value="mesPassado" className="text-gray-800 bg-transparent">Mês Passado</option>
            <option value="ultimos7" className="text-gray-800 bg-transparent">Últimos 7 dias</option>
            <option value="ultimos30" className="text-gray-800 bg-transparent">Últimos 30 dias</option>
            <option value="todos" className="text-gray-800 bg-transparent">Todos</option>
          </select>
          </div>
            <button className='flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-blue-700 to bg-blue-800 hover:bg-blue-900 font-semibold text-white shadow-md transition-colors duration-300'>
                <MdAutoAwesome className="h-6 w-6" />
                Análise com IA
            </button>
        </div>

      </section>

      {/* seção 1: CARDS DE INDICADORES OU OS KPIS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <CardIndicador cor={'#10b981'} titulo={'total de receitas'} icone={<MdTrendingUp className="h-9 w-9"/>} valor={222}/>
        <CardIndicador cor={'#f21'} titulo={'total de despesas'} icone={<MdTrendingDown className="h-9 w-9"/>} valor={222}/>
        <CardIndicador cor={'#4bf'} titulo={'saldo do período'} icone={<MdWallet className="h-9 w-9"/>} valor={222}/>
      </section>
    </div>
  );
}
