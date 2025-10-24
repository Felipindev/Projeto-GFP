import react, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  TextInput,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Estilos from "../styles/Estilos";
import { enderecoServidor, calcularDatasPeriodo, formatarData } from "../utils";
import { useIsFocused } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

export default function Transacoes({ navigation }) {
  const [dadosLista, setDadosLista] = useState([]);
  const [usuario, setUsuario] = useState({});
  const [atualizando, setAtualizando] = useState(false);

  //guardadno os dados do filtro
  const [pesquisa, setPesquisa] = useState("");
  const [filtro, setFiltro] = useState({
    tipo: "todos",
    status: "todos",
    periodo: "esteMes",
  });

  //hook para verificar se a tela está visível para o usuário
  const isFocused = useIsFocused();

  const buscarDadosAPI = async () => {
    if (!usuario.token) return; 
    try {
      //calcular as datas de início e fim do período selecionado
      const { dataInicio, dataFim } = calcularDatasPeriodo(filtro.periodo);

      //usa o urlsearchparams para montar a query string de forma segura
      const parametros = new URLSearchParams();

      parametros.append("dataInicio", dataInicio);
      parametros.append("dataFim", dataFim);

      const resposta = await fetch(
        `${enderecoServidor}/transacao?${parametros.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${usuario.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const dados = await resposta.json();
      setDadosLista(dados);
      console.log("dados lista: ", dados);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
      setAtualizando(false);
    }
  };

  //executa quando a variavel usuario é carregada
  useEffect(() => {
    if (isFocused == true) {
      buscarDadosAPI();
    }
  }, [usuario, isFocused, filtro.periodo]);

  useEffect(() => {
    buscarUsuarioLogado();
  }, []);

  const buscarUsuarioLogado = async () => {
    const usuarioLogado = await AsyncStorage.getItem("UsuarioLogado");
    if (usuarioLogado) {
      setUsuario(JSON.parse(usuarioLogado));
    } else {
      navigation.navigate("Login");
    }
  };

  const botaoExcluir = async (id) => {
    Alert.alert("Confirmar", "Tem certeza que deseja excluir esta transação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const resposta = await fetch(`${enderecoServidor}/transacao/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${usuario.token}`,
                "Content-Type": "application/json",
              },
            });
            if (resposta.ok) {
              buscarDadosAPI();
            } else {
              const texto = await resposta.text();
              console.error("Erro ao excluir transação:", resposta.status, texto);
            }
          } catch (error) {
            console.error("Erro ao buscar dados da API:", error);
          }
        },
      },
    ]);
  };

  const montarStatus = (item) => {
    const hoje = new Date();
    const vencimento = new Date(item.data_vencimento);
    let status = {};

    if (item.data_pagamento != null) {
      status = {
        cor: "#27ae60",
        icone: "check-circle",
        texto: `Pago em ${formatarData(item.data_pagamento)}`,
      };
    } else if (vencimento < hoje) {
      status = {
        cor: "#e74c3c",
        icone: "error",
        texto: `vencido em ${formatarData(item.data_vencimento)}`,
      };
    } else {
      status = {
        cor: "#f39c12",
        icone: "access-time",
        texto: `vencerá em ${formatarData(item.data_vencimento)}`,
      };
    }

    return status;
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
          Authorization: `Bearer ${usuario.token}`,
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

  const exibirItemLista = ({ item }) => {
    const status = montarStatus(item);

    return (
      <TouchableOpacity style={styles.ItemLista} activeOpacity={0.85}>
        {/* icone */}
        <View
          style={{
            backgroundColor: item.cor,
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <MaterialIcons name={item.icone} size={20} color={"#fff"} />
        </View>

        {/* informações da transacao */}
        <View style={styles.viewTrans}>
          <Text style={styles.descricao}>{item.descricao}</Text>
          <Text style={styles.subcategoria}>{item.nome_subcategoria}</Text>
          <Text style={styles.subcategoria}>{item.nome_conta}</Text>

          {/* status */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name={status.icone} color={status.cor} size={14} />
            <Text
              style={{
                fontSize: 12,
                marginLeft: 6,
                fontWeight: "500",
                color: status.cor,
              }}
            >
              {status.texto}
            </Text>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: item.tipo_transacao == "ENTRADA" ? "#27ae60" : "#e34c3c",
            }}
          >
            R$ {Number(item.valor).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {
                !item.data_pagamento && (
                    <TouchableOpacity onPress={() => botaoQuitar(item.id_transacao)}>
                        <MaterialIcons name='done' style={{color: "#27ae60"}}/>
                    </TouchableOpacity>
                )
            }
            <MaterialIcons
              name="delete"
              size={24}
              color="#e63946"
              style={styles.icon}
              onPress={() => botaoExcluir(item.id_conta)}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("CadContas")}>
          <MaterialIcons
            name="add"
            size={28}
            color="#fff"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={Estilos.conteudoHeader}>
      <View style={Estilos.conteudoCorpo}>
        <View style={styles.containerText}>
          <Text style={styles.text}>
            ADMINISTRE <Text style={styles.textPlus}>TODAS</Text> AS SUAS
            TRANSAÇÕES!
          </Text>
        </View>
        {/* seçaõ de filtros */}
        <View>
          <View style={styles.filtrosRow}>
            <TextInput
              style={styles.inputFiltrar}
              placeholder="Buscar descrição, subcategoria ou conta"
              value={pesquisa}
              onChangeText={setPesquisa}
            />
            <View style={styles.pickerWrap}>
              <Picker
                selectedValue={filtro.periodo}
                onValueChange={(item) => setFiltro({ ...filtro, periodo: item })}
                style={styles.picker}
              >
                <Picker.Item label="Este Mês" value="esteMes" />
                <Picker.Item label="Mês Passado" value="mesPassado" />
                <Picker.Item label="Últimos 7 dias" value="ultimos7" />
                <Picker.Item label="Últimos 30 dias" value="ultimos30" />
                <Picker.Item label="Todos" value="todos" />
              </Picker>
            </View>
          </View>
        </View>
        {/*FlatList para exibir os dados da API*/}
        <FlatList
          data={dadosLista
            .filter((item) => item.descricao.toLowerCase().includes(pesquisa.toLowerCase()))}
          renderItem={exibirItemLista}
          keyExtractor={(item) => String(item.id_transacao)}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={buscarDadosAPI}
              tintColor="#008080"
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  viewTrans: {
    flex: 1,
  },
  descricao: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subcategoria: {
    fontSize: 13,
    color: "#777",
  },
  texto: {},
  ItemLista: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imagemLista: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: "#e0e0e0",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  icon: {
    marginLeft: 10,
  },
  tipoConta: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  nomeLista: {
    fontSize: 14,
    color: "#666",
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    textAlign: "center",
    letterSpacing: 1,
    marginTop: 15
  },
  textPlus: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    border: "solid 1px #008080",
    padding: 10,
    backgroundColor: "#008080",
    borderRadius: 10,
  },
  containerText: {
    padding: 10,
    marginVertical: 10,
    gap: 20,
  },
  filtrosRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 15,
  },
  inputFiltrar: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    elevation: 1,
  },
  pickerWrap: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
});
