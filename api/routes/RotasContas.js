import { BD } from "../db.js";
import jwt from "jsonwebtoken";
const secretKey = "chave-secreta";

class RotasContas {
    static async novaConta(req, res) {
        const { nome, tipo_conta, saldo, ativo, conta_padrao } = req.body;
        try {
            const contas = await BD.query(`INSERT INTO contas (nome, tipo_conta, saldo, ativo, conta_padrao)
                VALUES ($1, $2, $3, $4, $5) RETURNING *`, [nome, tipo_conta, saldo, ativo, conta_padrao]);
            res.status(201).json('conta criado com sucesso!');
        } catch (error) {
            console.error("Erro ao criar o conta:", error);
            res.status(500).json({ error: "Erro ao criar conta" });
        }
    }

    static async listar(req, res) {
        try {
            const contas = await BD.query(`SELECT * FROM contas where ativo = true ORDER BY nome`);
            res.status(200).json(contas.rows);
        } catch (error) {
            console.error("Erro ao listar as contas:", error);
            res.status(500).json({ error: "Erro ao listar as contas" });
        }
    }

    static async listarporID(req,res){
        const { id_conta } = req.params;
        try {
            const contas = await BD.query(`SELECT * FROM contas WHERE id_conta = $1`, [id_conta]);
            if (contas.rows.length === 0) {
                return res.status(404).json({ error: "conta não encontrada" });
            }
            res.status(200).json(contas.rows[0]);
        } catch (error) {
            console.error("Erro ao listar contas:", error);
            res.status(500).json({ error: "Erro ao listar contas" });
        }
    }

    static async atualizarTodos(req,res) {
        const { id_conta } = req.params;
        const { nome, tipo_conta, saldo, ativo, conta_padrao } = req.body;

        try {
            const contas = await BD.query(`UPDATE contas SET nome = $1, tipo_conta = $2, saldo = $3, ativo = $4, conta_padrao = $5 WHERE id_conta = $6 RETURNING *`, [nome, tipo_conta, saldo, ativo, conta_padrao, id_conta]);
            if (contas.rows.length === 0) {
                return res.status(404).json({ error: "conta não encontrada" });
            }
            res.status(200).json(contas.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar conta:", error);
            res.status(500).json({ error: "Erro ao atualizar a conta" });
        }
    }

    static async deletar(req,res){
        const { id_conta } = req.params;
        try {
            const contas = await BD.query(`UPDATE contas SET ativo = false WHERE id_conta = $1 RETURNING *`, [id_conta]);
            if (contas.rows.length === 0) {
                return res.status(404).json({ error: "conta não encontrada" });
            }
            res.status(200).json(contas.rows[0]);
        } catch (error) {
            console.error("Erro ao deletar a conta:", error);
            res.status(500).json({ error: "Erro ao deletar a conta" });
        }
    }

    static async atualizar(req,res){
        const { id_conta } = req.params;
        const { nome, tipo_conta, saldo, ativo, conta_padrao } = req.body;

        try {
            const campos = [];
            const valores = [];

            if (nome !== undefined) {
                campos.push(`nome = $${valores.length + 1}`);
                valores.push(nome);
            }

            if (tipo_conta !== undefined) {
                campos.push(`tipo_conta = $${valores.length + 1}`);
                valores.push(tipo_conta);
            }

            if (saldo !== undefined) {
                campos.push(`saldo = $${valores.length + 1}`);
                valores.push(saldo);
            }

            if (ativo !== undefined) {
                campos.push(`ativo = $${valores.length + 1}`);
                valores.push(ativo);
            }

            if (conta_padrao !== undefined) {
                campos.push(`conta_padrao = $${valores.length + 1}`);
                valores.push(conta_padrao);
            }

            if (campos.length === 0) {
                return res.status(400).json({ error: "Nenhum campo para atualizar foi fornecido" });
            }

            const query = `UPDATE contas SET ${campos.join(", ")} WHERE id_conta = ${id_conta} RETURNING *`;
            const contas = await BD.query(query, valores);

            if (contas.rows.length === 0) {
                return res.status(404).json({ error: "conta não encontrada" });
            }

            res.status(200).json(contas.rows[0]);

        } catch (error) {
            console.error("Erro ao atualizar conta:", error);
            res.status(500).json({ error: "Erro ao atualizar conta" });
        }
    }

    static async filtrarContas(req, res){
        const { nome } = req.query;
        try {
            const query = `SELECT * FROM contas WHERE nome LIKE $1 AND ativo = true order by nome`;
            const valores = [`%${nome}%`];
            if (!nome) {
                return res.status(400).json({ error: "Nome da conta não fornecido" });
            }

            const contas = await BD.query(query, valores);

            if (contas.rows.length === 0) {
                return res.status(404).json({ error: "Nenhuma conta encontrada com esse nome" });
            }
            res.status(200).json(contas.rows);
        } catch (error) {
            console.error("Erro ao filtrar contas:", error);
            res.status(500).json({ error: "Erro ao filtrar contas" });
        }
    }
}



export default RotasContas