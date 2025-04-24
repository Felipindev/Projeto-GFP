import { useState } from 'react'
import { useNavigate, Link} from 'react-router-dom'
import { enderecoServidor } from '../utils';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function login(e) {
        e.preventDefault();

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
                localStorage.setItem('token', dados.token);
                localStorage.setItem('usuario', JSON.stringify(dados.usuario));
                navigate('/principal');
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
        <div style={styles.container}>
            <img style={styles.logo} src="/src/assets/logo.png" alt="Logo" />
            <h2 style={styles.title}>Bem-vindo ao GFP</h2>
            <p style={styles.subtitle}>Gerencie suas finanças de forma simples e eficiente</p>
            <input style={styles.input} type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input style={styles.input} type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <div style={styles.footer}>
                <p style={styles.footerText}>Esqueceu a senha?<span style={styles.footerLink}>Recupere-a</span></p>
                <p style={styles.footerText2}>Não tem uma conta?<span style={styles.footerLink}>Cadastre-se</span></p>
            </div>
            <button style={styles.button} onClick={(e) => login(e)}>Entrar</button>
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1e293b',
        padding: '20px',
        margin: 'auto',
    },
    logo: {
        width: '150px',
        height: '150px',
        marginBottom: '20px',
        marginTop: '20px',
        borderRadius: '10px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#41d3be',
        marginBottom: '10px',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: '16px',
        color: '#94a3b8',
        marginBottom: '30px',
        textAlign: 'center',
    },
    input: {
        width: '35%',
        backgroundColor: '#334155',
        color: '#fff',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '25px',
        border: "none",
        height: '45px',
    },
    button: {
        width: '20%',
        backgroundColor: '#41d3be',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px',
        cursor: 'pointer',
        textDecoration: 'none',
        textAlign: 'center',
        border: "none",
        height: '45px',
    },
    footerText: {
        fontSize: '14px',
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: '20px',
        padding: '10px',
        gap:'10px',
    },
    footerText2: {
        fontSize: '14px',
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: '20px',
        marginLeft: '20px',
        borderLeft: '1px solid #94a3b8',
        padding: '15px',
        gap:'10px'
    },
    footerLink: {
        color: '#41d3be',
        textDecoration: 'none',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '20px',
    }

}