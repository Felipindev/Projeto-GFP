import React, { useState, useEffect, useContext } from "react";
import CardIndicador from "../components/CardIndicador.jsx";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  YAxis,
  Bar,
  XAxis,
  BarChart,
} from "recharts";
import { UsuarioContext } from "../UsuarioContext.jsx";
import {
  enderecoServidor,
  nomesTipoConta,
  iconesTipoConta,
  IconesCategorias,
  calcularDatasPeriodo,
  listaCores,
  CORES_GRAFICO,
  formatarDinheiro,
} from "../utils.jsx";
import {
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
  const [dadosDashboard, setDadosDashboard] = useState({
    kpis: { despesas: 0, receitas: 0 },
    categorias: [],
    subcategorias: [],
    vencimento: [],
    evolucao6meses: [],
  });

  //variaveis de estado para analise com IA
  const [analise, setAnalise] = useState("");
  const [carregandoAnalise, setCarregandoAnalise] = useState(null);
  const [erroAnalise, setErroAnalise] = useState(null);
  const [modalAnaliseAberto, setModalAnaliseAberto] = useState(false);

  const buscarDadosAPI = async () => {
    try {
      //calcular as datas de início e fim do período selecionado
      const { dataInicio, dataFim } = calcularDatasPeriodo(filtro.periodo);

      //usa o urlsearchparams para montar a query string de forma segura
      const parametros = new URLSearchParams();

      parametros.append("dataInicio", dataInicio);
      parametros.append("dataFim", dataFim);

      setCarregando(true);

      const resposta = await fetch(
        `${enderecoServidor}/transacoes/dadosDashboard?${parametros.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${dadosUsuario.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const dados = await resposta.json();
      setDadosDashboard(dados);
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

  //função do modal de analise com IA
  const ModalAnalise = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Análise Financeira com IA
          </h2>
          <button
            onClick={() => setModalAnaliseAberto(false)}
            className="text-gray-400 hover:text-gray-600 text-3xl"
          >
            &times;
          </button>
        </div>
        <div className="min-h-[200px]">
          {carregandoAnalise && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Analisando suas finanças...</p>
            </div>
          )}
          {erroAnalise && (
            <p className="text-red-700 bg-red-50 p-4 rounded-lg">
              {erroAnalise}
            </p>
          )}
          {analise && (
            <div className="prose max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed">
              {analise}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={() => setModalAnaliseAberto(false)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );

  //função para chamar API da OPENAI 
  const analiseComIA = async () => {
    setCarregandoAnalise(true);
    setErroAnalise(null)
    setAnalise('')
    setModalAnaliseAberto(true)

    try {
      // criando o prompt de comando pra enviar por bichin
      const prompt = `
        Você é um consultor financeiro excepcional, tem um ótimo poder de analise de dados e explica de forma clara e facil de entender e resolver.
         Analise os dados do seu novo cliente:
         -Receitas: ${dadosDashboard.kpis.receitas},
         -Despesas: ${dadosDashboard.kpis.despesas},
         -despesas por categorias: ${JSON.stringify(dadosDashboard.categorias)},
         -despesas por subcategorias: ${JSON.stringify(dadosDashboard.subcategorias)},
         -ultimos 6 meses: ${dadosDashboard.evolucao6meses},
         -datas de vencimento de transacões: ${dadosDashboard.vencimento}.
        Com base em todos os dados, forneca uma analise objetiva, clara, bem explicada mas curta (máx 200 palavras):
        1. Uma avaliação geral da saúde financeira deste período
        2. Aponte a categoria e subcategoria que mais impactou as despesas (se achar necessario)
        3. dê uma dica pratica e acionável para melhorar no próximo mês.
        4. analise a evolução das despesas e possiveis tendencias
        
      `;

      //API key - é a chave secreta da OPENAI
      const apikey = 'SAI_CURIOSO';

      const resposta = await fetch(
        `https://api.openai.com/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${apikey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{role: 'user', content: prompt}],
            max_tokens: 300,
            temperature: 0.7,
          })
        }
      );
      const dados = await resposta.json();
      setAnalise(dados.choices[0].message.content);
      console.log("Dados ia:", dados);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    } finally {
      setCarregandoAnalise(false)
    }
  }

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
              onChange={(e) =>
                setFiltro({ ...filtro, periodo: e.target.value })
              }
            >
              <option value="esteMes" className="text-gray-800 bg-transparent">
                Este Mês
              </option>
              <option
                value="mesPassado"
                className="text-gray-800 bg-transparent"
              >
                Mês Passado
              </option>
              <option value="ultimos7" className="text-gray-800 bg-transparent">
                Últimos 7 dias
              </option>
              <option
                value="ultimos30"
                className="text-gray-800 bg-transparent"
              >
                Últimos 30 dias
              </option>
              <option value="todos" className="text-gray-800 bg-transparent">
                Todos
              </option>
            </select>
          </div>
          <button className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-blue-700 to bg-blue-800 hover:bg-blue-900 font-semibold text-white shadow-md transition-colors duration-300"
            onClick={analiseComIA}
          >
            <MdAutoAwesome className="h-6 w-6" />
            Análise com IA
          </button>
        </div>
      </section>

      {/* seção 1: CARDS DE INDICADORES OU OS KPIS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <CardIndicador
          cor={"#10b981"}
          titulo={"total de receitas"}
          icone={<MdTrendingUp className="h-9 w-9" />}
          valor={formatarDinheiro(dadosDashboard.kpis.receitas)}
        />
        <CardIndicador
          cor={"#f21"}
          titulo={"total de despesas"}
          icone={<MdTrendingDown className="h-9 w-9" />}
          valor={formatarDinheiro(dadosDashboard.kpis.despesas)}
        />
        <CardIndicador
          cor={"#4bf"}
          titulo={"saldo do período"}
          icone={<MdWallet className="h-9 w-9" />}
          valor={formatarDinheiro(
            dadosDashboard.kpis.receitas - dadosDashboard.kpis.despesas
          )}
        />
      </section>

      {/* seção 2: GRÁFICOS DE ANÁLISE */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* graficos catwgorias */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
            Despesas por categoria
          </h3>
          {dadosDashboard.categorias.length == 0 ? (
            <p className="text-gray-600 text-center">
              Nenhuma despesa registrada no período.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={dadosDashboard.categorias}
                  dataKey={"valor"}
                  nameKey="nome"
                  outerRadius={120}
                  fill={listaCores[25]}
                  label={(item) => item.valor}
                >
                  {dadosDashboard.categorias.map((item, index) => (
                    <Cell
                      key={index}
                      fill={CORES_GRAFICO[index % CORES_GRAFICO.length]}
                    />
                  ))}
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* gráfico subcategorias */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
            Despesas por Subcategorias
          </h3>
          {dadosDashboard.subcategorias.length == 0 ? (
            <p className="text-gray-600 text-center">
              Nenhuma despesa registrada no período.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={dadosDashboard.subcategorias}
                  dataKey={"valor"}
                  nameKey="nome"
                  outerRadius={120}
                  fill={listaCores[25]}
                  label={(item) => item.valor}
                >
                  {dadosDashboard.subcategorias.map((item, index) => (
                    <Cell
                      key={index}
                      fill={CORES_GRAFICO[index % CORES_GRAFICO.length]}
                    />
                  ))}
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* seção 3: grafico ultimos 6 meses */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* graficos catwgorias */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
            Últimos 6 meses
          </h3>
          <div className="space-y-3">
            {dadosDashboard.evolucao6meses.length == 0 ? (
              <p className="text-gray-600 text-center">
                Nenhuma registro no período.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={330}>
                <BarChart data={dadosDashboard.evolucao6meses}>
                  <XAxis dataKey={"mes"} fontSize={12} />
                  <YAxis />
                  <Legend />
                  <Bar
                    dataKey={"total_despesas"}
                    fill="#f44"
                    name={"Despesas"}
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey={"total_receitas"}
                    fill="#10b981"
                    name={"Receitas"}
                    radius={[8, 8, 0, 0]}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      border: "none",
                      boxShadow: "0 8px 8px rgba(0,0,0,0.5)",
                    }}
                    itemStyle={{ color: "#222" }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      {/* seção 4: listagens */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* graficos catwgorias */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
            Próximos vencimentos
          </h3>
          <div className="space-y-3"></div>
        </div>
      </section>

      {/* incluindo modal se variavel for true */}
      {
        modalAnaliseAberto == true ? <ModalAnalise /> : null
      }
    </div>
  );
}
