import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Switch,
} from "react-native";
import { useState, useEffect } from "react";
import { enderecoServidor } from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

// Ícone de olho (usando emoji, pode trocar por um ícone de biblioteca se quiser)
const EyeIcon = ({ visible }) => (
  <Text style={{ fontSize: 22 }}>{visible ? "🙈" : "👁️"}</Text>
);

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);

  useEffect(() => {
    const buscarUsuarioLogado = async () => {
      const usuarioLogado = await AsyncStorage.getItem("UsuarioLogado");
      if (usuarioLogado) {
        const usuario = JSON.parse(usuarioLogado);
        if(usuario.lembrar == true){
          navigation.navigate("MenuDrawer");
        }
      }
    }

    buscarUsuarioLogado();
},[])

  const botaoLogin = async () => {
    try {
      if (email === "" || senha === "") {
        throw new Error("Preencha todos os campos");
      }
      const resposta = await fetch(`${enderecoServidor}/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          senha: senha,
        }),
      });
      const dados = await resposta.json();

      if (resposta.ok) {
        console.log("Login bem-sucedido:", dados);
        AsyncStorage.setItem("UsuarioLogado", JSON.stringify({...dados, lembrar}));
        navigation.navigate("MenuDrawer");
      } else {
        throw new Error(dados.message || "Erro ao fazer login");
      }
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      alert(error.message);
      return;
    }
  };

  return (
    <LinearGradient colors={["#1e293b", "#0a0a0a"]} style={styles.container}>
      <View style={styles.container}>
        <Image source={require("../assets/logo(2).png")} style={styles.logo} />
        <Text style={styles.title}>Bem-vindo ao GFP</Text>
        <Text style={styles.subtitle}>
          Gerencie suas finanças de forma simples e eficiente
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          onChangeText={setEmail}
          value={email}
        />
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
        <View style={styles.switch}>
          <View style={styles.switchContainer}>
            <Switch
              value={lembrar}
              onValueChange={setLembrar}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
            />
            <Text style={styles.switchText}>Lembrar-me</Text>
          </View>

            <Text style={styles.footerText}>
              Esqueceu sua senha? <Text style={styles.link}>Recupere-a</Text>
            </Text>
          </View>
        <TouchableOpacity style={styles.button} onPress={botaoLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Não tem uma conta?{" "}
            <Text style={styles.link} onPress={() => navigation.navigate("Cadastro")}>
              Cadastre-se
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
    border: "1px solid #41d3be",
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
  switch: {
    marginBottom: 10,
    color: "#41d3be",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 45,
  },
  switchText: {
    color: "#41d3be",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  }
});