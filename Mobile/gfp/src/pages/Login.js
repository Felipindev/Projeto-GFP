import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { useState } from "react";
import {enderecoServidor} from "../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const botaoLogin = async () => {
    try {
      if (email === "" || senha === "") {
        throw new Error("Preencha todos os campos");
      }
      //autenticando utilizando a API de backend com o fetch e recebendo o token
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
        // Aqui você pode armazenar o token em um estado global ou AsyncStorage, se necessário
        AsyncStorage.setItem("UsuarioLogado", JSON.stringify(dados));
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
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#aaa"
        onChangeText={(text) => setSenha(text)}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={botaoLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Não tem uma conta? <Text style={styles.link}>Cadastre-se</Text>
        </Text>
        <Text style={styles.footerText}>
          Esqueceu sua senha? <Text style={styles.link}>Recupere-a</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
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
    textAlign: "center",
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
});
