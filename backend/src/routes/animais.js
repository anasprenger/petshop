const { Router } = require('express');
const pool = require('../db');
const { COLUNAS_ANIMAL, COLUNAS_SERVICO } = require('../queries');
const { validarAnimal, lerId, temErros } = require('../validation');

const router = Router();

async function buscarAnimal(id) {
  const [[animal]] = await pool.execute(`SELECT ${COLUNAS_ANIMAL} FROM animais a WHERE a.id = ?`, [id]);
  return animal;
}

// GET /api/animais — lista os animais com a quantidade de serviços de cada um
router.get('/', async (req, res) => {
  const [animais] = await pool.execute(`
    SELECT ${COLUNAS_ANIMAL},
           (SELECT COUNT(*) FROM servicos s WHERE s.animal_id = a.id) AS total_servicos
    FROM animais a
    ORDER BY a.nome`);
  res.json(animais);
});

// GET /api/animais/:id — detalhes do animal e histórico de serviços
router.get('/:id', async (req, res) => {
  const id = lerId(req.params.id);
  if (!id) return res.status(400).json({ erro: 'ID de animal inválido.' });

  const animal = await buscarAnimal(id);
  if (!animal) return res.status(404).json({ erro: 'Animal não encontrado.' });

  const [servicos] = await pool.execute(
    `SELECT ${COLUNAS_SERVICO} FROM servicos s WHERE s.animal_id = ? ORDER BY s.data DESC, s.id DESC`,
    [id],
  );
  res.json({ ...animal, servicos });
});

// POST /api/animais — cadastra um animal
router.post('/', async (req, res) => {
  const { dados, campos } = validarAnimal(req.body);
  if (temErros(campos)) return res.status(400).json({ erro: 'Verifique os campos informados.', campos });

  const [resultado] = await pool.execute(
    `INSERT INTO animais (nome, especie, raca, idade, tutor, telefone, observacoes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [dados.nome, dados.especie, dados.raca, dados.idade, dados.tutor_nome, dados.telefone, dados.observacoes],
  );
  res.status(201).json(await buscarAnimal(resultado.insertId));
});

// PUT /api/animais/:id — atualiza um animal
router.put('/:id', async (req, res) => {
  const id = lerId(req.params.id);
  if (!id) return res.status(400).json({ erro: 'ID de animal inválido.' });

  const { dados, campos } = validarAnimal(req.body);
  if (temErros(campos)) return res.status(400).json({ erro: 'Verifique os campos informados.', campos });

  const [resultado] = await pool.execute(
    `UPDATE animais
     SET nome = ?, especie = ?, raca = ?, idade = ?, tutor = ?, telefone = ?, observacoes = ?
     WHERE id = ?`,
    [dados.nome, dados.especie, dados.raca, dados.idade, dados.tutor_nome, dados.telefone, dados.observacoes, id],
  );
  if (resultado.affectedRows === 0) return res.status(404).json({ erro: 'Animal não encontrado.' });

  res.json(await buscarAnimal(id));
});

// DELETE /api/animais/:id — exclui o animal e, na mesma transação, todos os serviços dele
router.delete('/:id', async (req, res) => {
  const id = lerId(req.params.id);
  if (!id) return res.status(400).json({ erro: 'ID de animal inválido.' });

  const conexao = await pool.getConnection();
  try {
    await conexao.beginTransaction();
    const [servicos] = await conexao.execute('DELETE FROM servicos WHERE animal_id = ?', [id]);
    const [animal] = await conexao.execute('DELETE FROM animais WHERE id = ?', [id]);

    if (animal.affectedRows === 0) {
      await conexao.rollback();
      return res.status(404).json({ erro: 'Animal não encontrado.' });
    }

    await conexao.commit();
    res.json({ mensagem: 'Animal excluído.', servicos_removidos: servicos.affectedRows });
  } catch (erro) {
    await conexao.rollback();
    throw erro;
  } finally {
    conexao.release();
  }
});

module.exports = router;
