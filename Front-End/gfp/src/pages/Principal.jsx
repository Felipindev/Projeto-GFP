import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {UsuarioContext} from '../UsuarioContext'

export default function Principal() {
    const {dadosUsuario, setDadosUsuario, carregando} = useContext(UsuarioContext)

    const navigate = useNavigate()

    useEffect(() => {
       if (!dadosUsuario && !carregando){
            navigate('/login')
        }
    }, [dadosUsuario, carregando, navigate]);

    return (
        <div style={styles.container}>
            <div style={styles.logoContainer}>
                <h1 style={styles.Title}>
                    Bem-vindo ao GFP {dadosUsuario?.nome}
                </h1>
                <button style={styles.buttonSair} onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                    localStorage.removeItem('lembrarUsuario');
                    setDadosUsuario(null)
                    navigate('/login')
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
        background: 'linear-gradient(to bottom, #f2f2f2 0%, #41d3be 100%)',
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