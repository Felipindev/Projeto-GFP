import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enderecoServidor } from "../utils";

// Ícone de olho (usando emoji, pode trocar por um ícone de biblioteca se quiser)
function EyeIcon({ visible }) {
  return <span style={{ fontSize: 22, cursor: "pointer" }}>{visible ? "🙈" : "👁️"}</span>;
}

export default function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipoAcesso, setTipoAcesso] = useState("usuario");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function botaoCadastro(e) {
    e.preventDefault();
    try {
      if (nome === "" || email === "" || senha === "" || tipoAcesso === "") {
        throw new Error("Preencha todos os campos");
      }
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
        navigate("/");
        console.log("Cadastro realizado com sucesso:", dados);
      } else {
        console.log("Erro do backend:", dados);
        throw new Error(dados.error || "Erro ao cadastrar");
      }
    } catch (error) {
      console.error("Erro ao realizar cadastro:", error);
      alert(error.message);
      return;
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.logoContainer}>
        <img src="/src/assets/logo.png" alt="Logo" style={styles.logo} />
        <h2 style={styles.title}>Crie sua conta no GFP</h2>
        <p style={styles.subtitle}>Gerencie suas finanças de forma simples e eficiente</p>
      </div>
      <div style={styles.formContainer}>
      <form onSubmit={botaoCadastro} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div style={styles.senhaContainer}>
          <input
            style={{ ...styles.input, flex: 1, marginBottom: 0 }}
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />
          <span
            style={styles.eyeButton}
            onClick={() => setMostrarSenha(!mostrarSenha)}
            title={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
          >
            <EyeIcon visible={mostrarSenha} />
          </span>
        </div>
        <select
          style={styles.input}
          value={tipoAcesso}
          onChange={e => setTipoAcesso(e.target.value)}
        >
          <option value="usuario">Usuário</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" style={styles.button}>Cadastrar</button>
      </form>
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Já tem uma conta?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/")}
            tabIndex={0}
            role="button"
          >
            Faça login
          </span>
        </p>
      </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #1e293b 0%, #0a0a0a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: 500,
    padding: 40,
    borderRadius: 8,
    backgroundColor: "#1e293b",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  senhaContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    position: "relative",
  },
  logo: {
    width: 150,
    height: 150,
    padding: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#41d3be",
    marginTop: 20,
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
    fontSize: 15,
    border: "none",
    outline: "none",
    boxSizing: "border-box",
  },
  eyeButton: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    zIndex: 1,
    userSelect: "none",
  },
  button: {
    backgroundColor: "#41d3be",
    padding: "15px 20px",
    borderRadius: 8,
    width: "100%",
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    border: "none",
    marginBottom: 20,
    cursor: "pointer",
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
    textDecoration: "underline",
    cursor: "pointer",
  },
  footer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
  },
  form: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  }
};