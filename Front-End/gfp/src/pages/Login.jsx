import { useNavigate, Link} from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate();
    return (
        <div style={styles.container}>
            <img style={styles.logo} src="logo(2).png" alt="Logo" />
            <h2 style={styles.title}>Bem-vindo ao GFP</h2>
            <p style={styles.subtitle}>Gerencie suas finanças de forma simples e eficiente</p>
            <input style={styles.input} type="text" placeholder="Email" />
            <input style={styles.input} type="password" placeholder="Senha" />
            <button style={styles.button}><Link to="/principal">Entrar</Link></button>
            <p style={styles.footerText}>Não tem uma conta? <p style={styles.footerLink}>Cadastre-se</p></p>
            <button onClick={() => navigate('/principal')}>Entrar</button>
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
    },
    logo: {
        width: '150px',
        height: '150px',
        marginBottom: '20px',
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
        width: '100%',
        backgroundColor: '#334155',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px',
    },
    button: {
        width: '100%',
        backgroundColor: '#41d3be',
        color: '#fff',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px',
        cursor: 'pointer',
    },
    footerText: {
        fontSize: '14px',
        color: '#94a3b8',
        marginTop: '20px',
        textAlign: 'center',
    },
    footerLink: {
        color: '#41d3be',
        textDecoration: 'none',
    },

}