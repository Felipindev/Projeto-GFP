import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { enderecoServidor } from '../utils';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [lembrar, setLembrar] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

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
    console.log(dados);
    localStorage.setItem('token', dados.token);
    localStorage.setItem('usuario', JSON.stringify(dados.usuario));
    if (lembrar) {
        localStorage.setItem('lembrarUsuario', JSON.stringify({
            token: dados.token,
            usuario: dados.nome
        }));
    } else {
        localStorage.removeItem('lembrarUsuario');
    }
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

    useEffect(() => {
    const usuarioSalvo = localStorage.getItem('lembrarUsuario');
    if (usuarioSalvo) {
        const { token, usuario } = JSON.parse(usuarioSalvo);
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        navigate('/principal');
    }
}, [navigate]);

    return (
        <div style={styles.container}>
            <img style={styles.logo} src="/src/assets/logo.png" alt="Logo" />
            <h2 style={styles.title}>Bem-vindo ao GFP</h2>
            <p style={styles.subtitle}>Gerencie suas finanças de forma simples e eficiente</p>
            <input style={styles.input} type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div style={{ position: 'relative', width: '35%' }}>
                <input
                    style={{ ...styles.input, width: '100%', marginBottom: 0 }}
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <span
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    style={{
                        position: 'absolute',
                        right: 15,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        cursor: 'pointer',
                        fontSize: 22,
                        color: '#41d3be',
                        userSelect: 'none'
                    }}
                    title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                    {mostrarSenha ? "🙈" : "👁️"}
                </span>
            </div>
            <div style={styles.checkboxContainer}>
                <input type="checkbox" id="lembrar" checked={lembrar} onChange={e => setLembrar(e.target.checked)} />
                <label htmlFor="lembrar" style={{ color: '#94a3b8', marginLeft: '15px', marginTop:"10px" }}>Lembrar de mim</label>
            </div>
            <div style={styles.footer}>
                <p style={styles.footerText}>Esqueceu a senha?<span style={styles.footerLink}>Recupere-a</span></p>
                <p style={styles.footerText2}>Não tem uma conta?<span style={styles.footerLink} onClick={() => navigate('/cadastro')}>Cadastre-se</span></p>
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
        textDecoration: 'underline',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginLeft: '10px',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '20px',
    },
    checkboxContainer: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        marginTop: "10px"
    },
    checkbox: {
        marginRight: '10px',
    },

}