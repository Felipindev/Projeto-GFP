import { BD } from "../db.js";
import jwt from "jsonwebtoken";
const secretKey = "chave-secreta";

class RotasTransacoes {
  static async nova(req, res) {
    const {
      valor,
      descricao,
      data_transacao,
      data_vencimento,
      data_pagamento,
      tipo_transacao,
      id_conta,
      id_categoria,
      id_subcategoria,
      id_usuario,
      num_parcelas,
      parcela_atual,
    } = req.body;
    try {
      const transacao = await BD.query(
        `INSERT INTO transacoes (valor, descricao, data_transacao, data_vencimento, data_pagamento, tipo_transacao, id_conta, id_categoria, id_subcategoria, id_usuario, num_parcelas, parcela_atual)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [
          valor,
          descricao,
          data_transacao,
          data_vencimento,
          data_pagamento,
          tipo_transacao,
          id_conta,
          id_categoria,
          id_subcategoria,
          id_usuario,
          num_parcelas,
          parcela_atual,
        ]
      );
      res.status(201).json("Transação criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar a transação:", error);
      res.status(500).json({ error: "Erro ao criar a transação" });
    }
  }
  static async listar(req, res) {
    try {
      const transacoes = await BD.query(`
    SELECT 
        t.id_transacao,
        t.valor,
        t.descricao,
        t.data_transacao,
        t.data_vencimento,
        t.data_pagamento,
        t.tipo_transacao,
        t.num_parcelas,
        t.parcela_atual,

        lt.nome AS nome_conta,
        c.nome AS nome_categoria,
        c.icone,
        c.cor,
        sc.nome AS nome_subcategoria,
        u.nome AS nome_usuario

        FROM transacoes t
        LEFT JOIN contas lt ON t.id_conta = lt.id_conta
        LEFT JOIN categorias c ON t.id_categoria = c.id_categoria
        LEFT JOIN subcategorias sc ON t.id_subcategoria = sc.id_subcategoria
        JOIN usuarios u ON t.id_usuario = u.id_usuario`);
        res.status(200).json(transacoes.rows);
    } catch (error) {
      console.error("Erro ao listar as transações:", error);
      res.status(500).json({ error: "Erro ao listar as transações" });
    }
  }

  static async listarPorID(req,res){
    const { id_transacao } = req.params;
    try {
        const transacao = await BD.query(`SELECT 
        t.id_transacao,
        t.valor,
        t.descricao,
        t.data_transacao,
        t.data_vencimento,
        t.data_pagamento,
        t.tipo_transacao,
        t.num_parcelas,
        t.parcela_atual,

        lt.nome AS nome_conta,
        c.nome AS nome_categoria,
        sc.nome AS nome_subcategoria,
        u.nome AS nome_usuario

        FROM transacoes t
        LEFT JOIN contas lt ON t.id_conta = lt.id_conta
        LEFT JOIN categorias c ON t.id_categoria = c.id_categoria
        LEFT JOIN subcategorias sc ON t.id_subcategoria = sc.id_subcategoria
        JOIN usuarios u ON t.id_usuario = u.id_usuario
        WHERE id_transacao = $1
        ORDER BY t.id_transacao ASC` , [id_transacao]);

        if (transacao.rows.length === 0) {
            return res.status(404).json({ error: "Transação não encontrada" });
        }
        res.status(200).json(transacao.rows[0]);
    } catch (error) {
        console.error("Erro ao listar a transação:", error);
        res.status(500).json({ error: "Erro ao listar a transação" });
    }
  }

  static async atualizarTodos(req,res) {
    const { id_transacao } = req.params;
    const {
      valor,
      descricao,
      data_transacao,
      data_vencimento,
      data_pagamento,
      tipo_transacao,
      id_conta,
      id_categoria,
      id_subcategoria,
      id_usuario,
      num_parcelas,
      parcela_atual,
    } = req.body;

    try {
      const transacao = await BD.query(
        `UPDATE transacoes SET valor = $1, descricao = $2, data_transacao = $3, data_vencimento = $4, data_pagamento = $5, tipo_transacao = $6, id_conta = $7, id_categoria = $8, id_subcategoria = $9, id_usuario = $10, num_parcelas = $11, parcela_atual = $12 WHERE id_transacao = $13 RETURNING *`,
        [
          valor,
          descricao,
          data_transacao,
          data_vencimento,
          data_pagamento,
          tipo_transacao,
          id_conta,
          id_categoria,
          id_subcategoria,
          id_usuario,
          num_parcelas,
          parcela_atual,
          id_transacao,
        ]
      );

      if (transacao.rows.length === 0) {
        return res.status(404).json({ error: "Transação não encontrada" });
      }
      res.status(200).json("Transação atualizada com sucesso!");
    }
      catch(error){
        console.error("Erro ao atualizar a transação:", error);
        res.status(500).json({ error: "Erro ao atualizar a transação" });
      }
    }

    static async atualizar(req,res){
        const { id_transacao } = req.params;
        const {
            valor,
            descricao,
            data_transacao,
            data_vencimento,
            data_pagamento,
            tipo_transacao,
            id_conta,
            id_categoria,
            id_subcategoria,
            id_usuario,
            num_parcelas,
            parcela_atual,
          } = req.body;

        try {
            const campos = [];
            const valores = [];

            if (valor !== undefined) {
                campos.push(`valor = $${valores.length + 1}`)
                valores.push(valor);
            }

            if (descricao !== undefined) {
                campos.push(`descricao = $${valores.length + 1}`)
                valores.push(descricao);
            }

            if (data_transacao !== undefined) {
                campos.push(`data_transacao = $${valores.length + 1}`)
                valores.push(data_transacao);
            }

            if (data_vencimento !== undefined) {
                campos.push(`data_vencimento = $${valores.length + 1}`)
                valores.push(data_vencimento);
            }

            if (data_pagamento !== undefined) {
                campos.push(`data_pagamento = $${valores.length + 1}`)
                valores.push(data_pagamento);
            }

            if (tipo_transacao !== undefined) {
                campos.push(`tipo_transacao = $${valores.length + 1}`)
                valores.push(tipo_transacao);
            }

            if (id_conta !== undefined) {
                campos.push(`id_conta = $${valores.length + 1}`)
                valores.push(id_conta);
            }

            if (id_categoria !== undefined) {
                campos.push(`id_categoria = $${valores.length + 1}`)
                valores.push(id_categoria);
            }

            if (id_subcategoria !== undefined) {
                campos.push(`id_subcategoria = $${valores.length + 1}`)
                valores.push(id_subcategoria);
            }

            if (id_usuario !== undefined) {
                campos.push(`id_usuario = $${valores.length + 1}`)
                valores.push(id_usuario);
            }

            if (num_parcelas !== undefined) {
                campos.push(`num_parcelas = $${valores.length + 1}`)
                valores.push(num_parcelas);
            }

            if (parcela_atual !== undefined) {
                campos.push(`parcela_atual = $${valores.length + 1}`)
                valores.push(parcela_atual);
            }

            if (campos.length === 0) {
                return res.status(400).json({ error: "Nenhum campo para atualizar" });
            }
            const query = `UPDATE transacoes SET ${campos.join(", ")} WHERE id_transacao = ${id_transacao} RETURNING *`;
            const transacao = await BD.query(query, valores);

            if (transacao.rows.length === 0) {
                return res.status(404).json({ error: "Transação não encontrada" });
            }

            res.status(200).json("Transação atualizada com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar a transação:", error);
            res.status(500).json({ error: "Erro ao atualizar a transação" });
        }
    }

    static async deletar(req,res){
        const { id_transacao } = req.params;

        try {
            const transacao = await BD.query("DELETE FROM transacoes WHERE id_transacao = $1 RETURNING *", [id_transacao]);
            if (transacao.rows.length === 0) {
                return res.status(404).json({ error: "Transação não encontrada" });
            }
            res.status(200).json("Transação excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir a transação:", error);
            res.status(500).json({ error: "Erro ao excluir a transação" });
            
        }
    }

    //criar rota pra filtrar transacoes por data de vencimento ou pagamento
    //dentro de um intervalo específico

    static async filtrarPorData(req, res) {
      const { data_inicio, data_fim, tipo_data } = req.query;

      let colunaData
      if (tipo_data == 'vencimento'){
        colunaData = 'data_vencimento'
      }
      else if (tipo_data == 'pagamento'){
        colunaData = 'data_pagamento'
      }
      else{
        return res.status(400).json({ error: "Tipo de data inválido, use 'vencimento' ou 'pagamento'" });
      }
      try {
        const query = `SELECT t.*, u.nome as nome_usuario, ct.nome as nome from transacoes as t
        left join usuarios as u on t.id_usuario = u.id_usuario
        join contas as ct on t.id_conta = ct.id_conta
        WHERE ${colunaData} BETWEEN $1 AND $2
        order by ${colunaData} asc
        `
        const transacoes = await BD.query(query, [data_inicio, data_fim]);
        res.status(200).json(transacoes.rows);
        
        if (transacoes.rows.length === 0) {
          return res.status(404).json({ error: "Nenhuma transação encontrada" });
        }
      }
      catch (error) {
        console.error("Erro ao filtrar transações por data:", error);
        res.status(500).json({message: "Erro ao filtrar transações por data" , error: error.message });
      }
    }

    //somando transacoes entrada ou saida
    static async somarTransacoes (req, res) {
      const { tipo, id_usuario} = req.query;
      try{
        const tipoTransacao = tipo.toUpperCase();
        const query = `
          SELECT SUM(valor) as total 
          FROM transacoes
          WHERE tipo_transacao = $1 AND id_usuario = $2
          `
        const resultado = await BD.query(query, [tipoTransacao, id_usuario]);

        let total = resultado.rows[0].total;

        if (total === null) {
          total = 0
        }
        res.status(200).json({total: parseFloat(total)});
      } catch (error) {
        console.error("Erro ao somar transações:", error);
        res.status(500).json({ error: "Erro ao somar transações" });
      }
    }

    //consulta para pagamentos vencidos7
    static async transacoesVencidas(req, res){
      const { id_usuario } = req.query;
      try {
        const query = `
          SELECT t.valor, t.data_vencimento, t.data_pagamento, t.data_transacao,
          u.nome as nome_usuario, 
          ct.nome as nome_categoria, 
          c.nome as nome_conta, 
          sct.nome as nome_subcategoria
          FROM transacoes as t
          LEFT JOIN usuarios u ON t.id_usuario = u.id_usuario
          LEFT JOIN contas c ON t.id_conta = c.id_conta
          LEFT JOIN categorias ct ON t.id_categoria = ct.id_categoria
          LEFT JOIN subcategorias sct ON t.id_subcategoria = sct.id_subcategoria
          WHERE t.data_vencimento < CURRENT_DATE AND t.id_usuario = $1
          ORDER BY t.data_vencimento ASC
          `
        const transacoes = await BD.query(query, [id_usuario]);

        //funcao para formatar data
        const formatarDataBr = (data) => {
          if(!data) return null
          return new Date(data).toLocaleDateString('pt-BR'); //converte a data para o padrão BR
        }

        const dadosFormatados = transacoes.rows.map(t => ({
          ...t, //copia todas as propriedades origais da resultado para a "t"
          data_transacao: formatarDataBr(t.data_transacao),
          data_vencimento: formatarDataBr(t.data_vencimento),
          data_pagamento: formatarDataBr(t.data_pagamento),
        }))
        res.status(200).json(dadosFormatados);

        if (transacoes.rows.length === 0) {
          return res.status(404).json({ error: "Nenhuma transação encontrada" });
        }
      } catch (error) {
        console.error("Erro ao buscar transações vencidas:", error);
        res.status(500).json({message: "Erro ao buscar transacoes vencidas", error: error.message });
      }
    }
}

export default RotasTransacoes;
