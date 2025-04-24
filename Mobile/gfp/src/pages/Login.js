import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { useState } from 'react';

export default function Login({ navigation }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function login() {
            try {
                if (email === "" || senha === "") {
                    alert("Preencha todos os campos!");
                    throw new Error("Preencha todos os campos!");
                }
                const resposta = await fetch(`${enderecoServidor}/usuarios/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        senha: senha,
                    }),
                })
                if (resposta.ok) {
                    const dados = await resposta.json();
                    // localStorage.setItem('token', dados.token);
                    // localStorage.setItem('usuario', JSON.stringify(dados.usuario));
                    // navigate('/principal');
                } else {
                    const erro = await resposta.json();
                    alert(erro.message);
                    throw new Error(erro.message);
                }
            } catch (error) {
                console.error("Erro ao fazer login:", error);
                alert(error.message);
                return 
            }
        }


    return (
        <View style={styles.container}>
            <Image source={require('../assets/logo(2).png')} style={styles.logo} />
            <Text style={styles.title}>Bem-vindo ao GFP</Text>
            <Text style={styles.subtitle}>Gerencie suas finanças de forma simples e eficiente</Text>
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#aaa" onChange={(e) => setEmail(e.nativeEvent.text)} />
            <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#aaa" onChange={(e) => setSenha(e.nativeEvent.text)} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MenuDrawer')}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
                Não tem uma conta? <Text style={styles.link}>Cadastre-se</Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e293b',
        alignItems: 'center',
        justifyContent: 'center',
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
        fontWeight: 'bold',
        color: '#41d3be',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#334155',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        color: '#f8fafc',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#41d3be',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
    },
    link: {
        color: '#41d3be',
        fontWeight: 'bold',
    },
});