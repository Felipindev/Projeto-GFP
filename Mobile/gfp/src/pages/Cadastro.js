import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";
import { enderecoServidor } from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

// Ícone de olho (usando emoji, pode trocar por um ícone de biblioteca se quiser)
const EyeIcon = ({ visible }) => (
  <Text style={{ fontSize: 22 }}>{visible ? "🙈" : "👁️"}</Text>
);

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoAcesso, setTipoAcesso] = useState("usuario");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  const botaoCadastro = async () => {
    let erro = false;
    setErroNome("");
    setErroEmail("");
    setErroSenha("");

    if (!nome) {
      setErroNome("Preencha o nome");
      erro = true;
    }
    if (!email) {
      setErroEmail("Preencha o email");
      erro = true;
    }
    if (!senha) {
      setErroSenha("Preencha a senha");
      erro = true;
    }
    if (erro) return;

    try {
      const resposta = await fetch(`${enderecoServidor}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha,
          tipo_acesso: tipoAcesso,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("Cadastro realizado com sucesso!");
        navigation.navigate("Login");
        console.log("Cadastro realizado com sucesso:", dados);
      } else {
        console.log("Erro do backend:", dados)
        throw new Error(dados.error || "Erro ao cadastrar");
      }
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);
      alert(error.message);
      return;
    }
  };

  return (
    <LinearGradient colors={["#1e293b", "#0a0a0a"]} style={styles.container}>
      <View style={styles.container}>
        <Image source={require("../assets/logo(2).png")} style={styles.logo} />
        <Text style={styles.title}>Crie sua conta no GFP</Text>
        <Text style={styles.subtitle}>
          Gerencie suas finanças de forma simples e eficiente
        </Text>
        {erroNome ? <Text style={styles.erroMsg}>{erroNome}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#aaa"
          onChangeText={setNome}
          value={nome}
        />
        {erroEmail ? <Text style={styles.erroMsg}>{erroEmail}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          onChangeText={setEmail}
          value={email}
        />
        {erroSenha ? <Text style={styles.erroMsg}>{erroSenha}</Text> : null}
        <View style={styles.senhaContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Senha"
            placeholderTextColor="#aaa"
            onChangeText={setSenha}
            value={senha}
            secureTextEntry={!mostrarSenha}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setMostrarSenha(!mostrarSenha)}
          >
            <EyeIcon visible={mostrarSenha} />
          </TouchableOpacity>
        </View>
        <Picker
          selectedValue={tipoAcesso}
          style={styles.input}
          onValueChange={(itemValue) => setTipoAcesso(itemValue)}
        >
          <Picker.Item style={styles.valueInput} label="Usuário" value="usuario" />
          <Picker.Item style={styles.valueInput} label="Admin" value="admin" />
        </Picker>
        <TouchableOpacity style={styles.button} onPress={botaoCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Já tem uma conta?{" "}
            <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
              Faça login
            </Text>
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#41d3be",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#334155",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    color: "#f8fafc",
    fontSize: 16,
  },
  senhaContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  eyeButton: {
    padding: 10,
    marginLeft: -45,
    zIndex: 1,
  },
  valueInput: {
    color: "#f8fafc",
    fontSize: 16,
    backgroundColor: "#334155",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#41d3be",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  link: {
    color: "#41d3be",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  footer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  erroMsg: {
    color: '#e63946',
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 8,
},
});