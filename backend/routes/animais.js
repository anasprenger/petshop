
import { Router } from "express";
import db from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [animais] = await db.query(
      "SELECT * FROM animais ORDER BY id DESC"
    );
    res.json(animais);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao listar animais." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const [animais] = await db.execute(
      "SELECT * FROM animais WHERE id = ?",
      [req.params.id]
    );

    if (animais.length === 0) {
      return res.status(404).json({ erro: "Animal não encontrado." });
    }

    res.json(animais[0]);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao consultar animal." });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nome, especie, raca, idade, tutor, telefone } = req.body;

    if (!nome?.trim() || !especie?.trim() || !tutor?.trim()) {
      return res.status(400).json({
        erro: "Nome, espécie e tutor são obrigatórios.",
      });
    }

    const [resultado] = await db.execute(
      `INSERT INTO animais (nome, especie, raca, idade, tutor, telefone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nome.trim(),
        especie.trim(),
        raca || null,
        idade === "" || idade == null ? null : Number(idade),
        tutor.trim(),
        telefone || null,
      ]
    );

    res.status(201).json({
      id: resultado.insertId,
      nome,
      especie,
      raca,
      idade,
      tutor,
      telefone,
    });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao cadastrar animal." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { nome, especie, raca, idade, tutor, telefone } = req.body;

    if (!nome?.trim() || !especie?.trim() || !tutor?.trim()) {
      return res.status(400).json({
        erro: "Nome, espécie e tutor são obrigatórios.",
      });
    }

    const [resultado] = await db.execute(
      `UPDATE animais
       SET nome = ?, especie = ?, raca = ?, idade = ?, tutor = ?, telefone = ?
       WHERE id = ?`,
      [
        nome.trim(),
        especie.trim(),
        raca || null,
        idade === "" || idade == null ? null : Number(idade),
        tutor.trim(),
        telefone || null,
        req.params.id,
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Animal não encontrado." });
    }

    res.json({ mensagem: "Animal atualizado com sucesso." });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao atualizar animal." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const [resultado] = await db.execute(
      "DELETE FROM animais WHERE id = ?",
      [req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Animal não encontrado." });
    }

    res.json({ mensagem: "Animal excluído com sucesso." });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao excluir animal." });
  }
});

export default router;
