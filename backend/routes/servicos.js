
import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [servicos] = await db.query(`
      SELECT s.*, a.nome AS nome_animal
      FROM servicos s
      INNER JOIN animais a ON a.id = s.animal_id
      ORDER BY s.id DESC
    `);

    res.json(servicos);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao listar serviços." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [servicos] = await db.execute(
      "SELECT * FROM servicos WHERE id = ?",
      [req.params.id]
    );

    if (servicos.length === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    res.json(servicos[0]);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao consultar serviço." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { animal_id, tipo, data, valor, status, observacoes } = req.body;

    if (
      !animal_id ||
      !tipo?.trim() ||
      !data ||
      valor === "" ||
      valor == null ||
      !Number.isFinite(Number(valor)) ||
      Number(valor) < 0
    ) {
      return res.status(400).json({
        erro: "Informe animal, tipo, data e um valor válido.",
      });
    }

    const [animais] = await db.execute(
      "SELECT id FROM animais WHERE id = ?",
      [animal_id]
    );

    if (animais.length === 0) {
      return res.status(400).json({ erro: "Animal não encontrado." });
    }

    const [resultado] = await db.execute(
      `INSERT INTO servicos
       (animal_id, tipo, data, valor, status, observacoes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        animal_id,
        tipo.trim(),
        data,
        Number(valor),
        status || "Agendado",
        observacoes || null,
      ]
    );

    res.status(201).json({
      id: resultado.insertId,
      mensagem: "Serviço cadastrado com sucesso.",
    });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao cadastrar serviço." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { animal_id, tipo, data, valor, status, observacoes } = req.body;

    if (
      !animal_id ||
      !tipo?.trim() ||
      !data ||
      valor === "" ||
      valor == null ||
      !Number.isFinite(Number(valor)) ||
      Number(valor) < 0
    ) {
      return res.status(400).json({
        erro: "Informe animal, tipo, data e um valor válido.",
      });
    }

    const [resultado] = await db.execute(
      `UPDATE servicos
       SET animal_id = ?, tipo = ?, data = ?, valor = ?,
           status = ?, observacoes = ?
       WHERE id = ?`,
      [
        animal_id,
        tipo.trim(),
        data,
        Number(valor),
        status || "Agendado",
        observacoes || null,
        req.params.id,
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    res.json({ mensagem: "Serviço atualizado com sucesso." });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao atualizar serviço." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [resultado] = await db.execute(
      "DELETE FROM servicos WHERE id = ?",
      [req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Serviço não encontrado." });
    }

    res.json({ mensagem: "Serviço excluído com sucesso." });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao excluir serviço." });
  }
});

export default router;
