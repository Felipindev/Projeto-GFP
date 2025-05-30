import { BD } from "../db.js";
import jwt from "jsonwebtoken";

const secretKey = "chave-secreta";

class RotasCategorias {
    static async nova(req,res) {
        const { nome, tipo_transacao, gasto_fixo, id_usuario, cor, icone } = req.body;
        try {
            const categoria = await BD.query(`INSERT INTO categorias (nome, tipo_transacao, gasto_fixo, id_usuario, cor, icone)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [nome, tipo_transacao, gasto_fixo, id_usuario, cor, icone]);

            if (categoria.rows.length === 0) {
                    return res.status(404).json({ error: "Categoria não encontrada" });
                }
            res.status(201).json('Categoria criada com sucesso!');
        } catch (error) {
            console.error("Erro ao criar a categoria:", error);
            res.status(500).json({ error: "Erro ao criar a categoria" });
        }
    }

    static async listar(req, res) {
        try {
            const categorias = await BD.query(`SELECT * FROM categorias where ativo = true`);;
            res.status(200).json(categorias.rows);
        } catch (error) {
            console.error("Erro ao listar as categorias:", error);
            res.status(500).json({ error: "Erro ao listar as categorias" });
        }
    }

    static async listarPorID(req,res){
        const { id_categoria } = req.params;
        try {
            const categoria = await BD.query(`SELECT ct. *, u.nome AS nome_usuario FROM categorias AS ct
                    LEFT JOIN usuarios u ON ct.id_usuario = u.id_usuario WHERE ct.id_categoria = $1
                ORDER BY ct.id_categoria`, [id_categoria]);
            if (categoria.rows.length === 0) {
                return res.status(404).json({ error: "categoria não encontrado" });
            }
            res.status(200).json(categoria.rows[0]);
        } catch (error) {
            console.error("Erro ao listar a categoria:", error);
            res.status(500).json({ error: "Erro ao listar a categoria" });
        }
    }

    static async atualizarTodos(req,res) {
        const { id_categoria } = req.params;
        const { nome, tipo_transacao, gasto_fixo, ativo } = req.body;

        try {
            const categoria = await BD.query(`UPDATE categorias SET nome = $1, tipo_transacao = $2, gasto_fixo = $3, ativo = $4 WHERE id_categoria = $5 RETURNING *`, [nome, tipo_transacao, gasto_fixo, ativo, id_categoria]);
            if (categoria.rows.length === 0) {
                return res.status(404).json({ error: "categoria não encontrado" });
            }
            res.status(200).json(categoria.rows[0]);
        } catch (error) {
            console.error("Erro ao atualizar a categoria:", error);
            res.status(500).json({ error: "Erro ao atualizar a categoria" });
        }
    }

    static async atualizar (req,res){
        const { id_categoria } = req.params;
        const { nome, tipo_transacao, gasto_fixo, ativo } = req.body;

        try {
            const campos = [];
            const valores = [];

            if (nome != undefined)  {
                campos.push(`nome = $${valores.length + 1}`);
                valores.push(nome);
            }
            if (tipo_transacao != undefined) {
                campos.push(`tipo_transacao = $${valores.length + 1}`);
                valores.push(tipo_transacao);
            }
            if (gasto_fixo != undefined) {
                campos.push(`gasto_fixo = $${valores.length + 1}`);
                valores.push(gasto_fixo);
            }
            if (ativo != undefined){
                campos.push(`ativo = $${valores.length + 1}`);
                valores.push(ativo);
            }

            if(campos.length === 0){
                return res.status(400).json({
                    message: "Nenhum campo para atualizar foi fornecido."
                });
            }

            const query = `UPDATE categorias SET ${campos.join(', ')} WHERE id_categoria = ${id_categoria} RETURNING *`
            const resultado = await BD.query(query, valores);

            if (resultado.rows.length === 0) {
                return res.status(404).json({
                    message: "categoria não encontrado."
                });
            }
            return res.status(200).json(resultado.rows[0]);

        } catch (error) {
            console.error("Erro ao atualizar o usuário:", error);
            res.status(500).json({ error: "Erro ao atualizar o usuário" });
        }
    }

    static async deletar(req,res) {
        const {id_categoria} = req.params;
        try {
            const resultado = await BD.query(`UPDATE categorias SET ativo = false WHERE id_categoria = ${id_categoria} RETURNING *`);
            if (resultado.rows.length === 0) {
                return res.status(404).json({ error: "categoria não encontrado" });
            }
            res.status(200).json(resultado.rows[0]);
        } catch (error) {
            console.error("Erro ao excluir a categoria:", error);
            res.status(500).json({ error: "Erro ao excluir a categoria" });
        }
    }

    //funçaõ de filtrar por tipo de categoria (entrada ou saida)
    static async filtrarCategoria(req,res){
       const {tipo_transacao} = req.query
       try {
            const query = `SELECT * FROM categorias WHERE tipo_transacao LIKE $1 AND ativo = true ORDER BY nome DESC`;
            const valores = [`%${tipo_transacao}%`]
            const resposta = await BD.query(query, valores)

            if (resposta.rows.length === 0) {
                return res.status(404).json({ error: "Nenhuma categoria encontrada com este tipo" });
            }
            return res.status(200).json(resposta.rows)
       } catch (error) {
            console.error("Erro ao filtrar a categoria:", error);
            res.status(500).json({ message: "Erro ao filtrar categoria", error: error.message });
       }
    }
}

export default RotasCategorias;