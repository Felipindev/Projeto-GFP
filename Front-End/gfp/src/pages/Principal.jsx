import React, { useState, useEffect } from 'react';

export default function Principal() {
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        // Tenta pegar do localStorage (lembrarUsuario ou usuario)
        const lembrar = localStorage.getItem('UsuarioLogado');
        if (lembrar) {
            try {
                const { usuario } = JSON.parse(lembrar);
                setUsuario(usuario);
                console.log("Usuário recuperado do localStorage:", usuario);
            } catch (error) {
                console.error("Erro ao ler lembrarUsuario do localStorage:", error);
                setUsuario(null);
            }
        } else {
            const usuarioLocal = localStorage.getItem('usuario');
            if (usuarioLocal) {
                try {
                    setUsuario(JSON.parse(usuarioLocal));
                } catch (error) {
                    console.error("Erro ao ler usuário do localStorage:", error);
                    setUsuario(null);
                }
            }
        }
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.logoContainer}>
                <h1 style={styles.Title}>
                    Bem-vindo ao GFP{usuario && usuario ? `, ${usuario}` : ""}!
                </h1>
                <button style={styles.buttonSair} onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                    localStorage.removeItem('lembrarUsuario');
                    window.location.href = '/';
                }}>Sair</button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <h2 style={styles.subtitle}>Gerenciador de Finanças Pessoais</h2>
                <h3 style={styles.subtitle}>Tela Principal</h3>
                <p style={styles.subtitle}>Esta é a tela principal do seu aplicativo de finanças pessoais.</p>
            </div>
        </div>
    )
}

const styles = {
    buttonSair: {
        backgroundColor: '#41d3be',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '20px',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f8f8',
        padding: '20px',
        margin: 'auto',
    },
    Title: {
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
}