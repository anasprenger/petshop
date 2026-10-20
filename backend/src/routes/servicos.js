const { Router } = require('express');
const pool = require('../db');
const { SELECT_SERVICO } = require('../queries');
const { STATUS, validarServico, lerId, temErros } = require('../validation');

const router = Router();

async function buscarServico(id) {
  const [[servico]] = await pool.execute(`${SELECT_SERVICO} WHERE s.id = ?`, [id]);
  return servico;
}

async function animalExiste(id) {
  const [[animal]] = await pool.execute('SELECT id FROM animais WHERE id = ?', [id]);
  return Boolean(animal);
}

const animalInexistente = {
  erro: 'Verifique os campos informados.',
  campos: { animal_id: 'Animal não encontrado.' },
};

// GET /api/servicos?status=agendado&animal_id=1 — lista os serviços (filtros opcionais)
router.get('/', async (req, res) => {
  const filtros = [];
  const params = [];

  if (req.query.status !== undefined) {
    if (!STATUS.includes(req.query.status)) return res.status(400).json({ erro: 'Status inválido.' });
    filtros.push('s.status = ?');
    params.push(req.query.status);
  }
  if (req.query.animal_id !== undefined) {
    const animalId = lerId(req.query.animal_id);
    if (!animalId) return res.status(400).json({ erro: 'ID de animal inválido.' });
    filtros.push('s.animal_id = ?');
    params.push(animalId);
  }

  const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
  const [servicos] = await pool.execute(`${SELECT_SERVICO} ${where} ORDER BY s.data DESC, s.id DESC`, params);
  res.json(servicos);
});

// GET /api/servicos/:id — detalhes do serviço com o animal relacionado
router.get('/:id', async (req, res) => {
  const id = lerId(req.params.id);
  if (!id) return res.status(400).json({ erro: 'ID de serviço inválido.' });

  const servico = await buscarServico(id);
  if (!servico) return res.status(404).json({ erro: 'Serviço não encontrado.' });
  res.json(servico);
});

// POST /api/servicos — cadastra um serviço para um animal existente
router.post('/', async (req, res) => {
  const { dados, campos } = validarServico(req.body);
  if (temErros(campos)) return res.status(400).json({ erro: 'Verifique os campos informados.', campos });
  if (!(await animalExiste(dados.animal_id))) return res.status(400).json(animalInexistente);

  const [resultado] = await pool.execute(
    `INSERT INTO servicos (animal_id, tipo, data, valor, observacoes, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [dados.animal_id, dados.tipo, dados.data, dados.valor, dados.descricao, dados.status],
  );
  res.status(201).json(await buscarServico(resultado.insertId));
});

// PUT /api/servicos/:id — atualiza um serviço
router.put('/:id', async (req, res) => {
  const id = lerId(req.params.id);
  if (!id) return res.status(400).json({ erro: 'ID de serviço inválido.' });

  const { dados, campos } = validarServico(req.body);
  if (temErros(campos)) return res.status(400).json({ erro: 'Verifique os campos informados.', campos });
  if (!(await animalExiste(dados.animal_id))) return res.status(400).json(animalInexistente);

  const [resultado] = await pool.execute(
    `UPDATE servicos
     SET animal_id = ?, tipo = ?, data = ?, valor = ?, observacoes = ?, status = ?
     WHERE id = ?`,
    [dados.animal_id, dados.tipo, dados.data, dados.valor, dados.descricao, dados.status, id],
  );
  if (resultado.affectedRows === 0) return res.status(404).json({ erro: 'Serviço não encontrado.' });

  res.json(await buscarServico(id));
});

// DELETE /api/servicos/:id — exclui um serviço
router.delete('/:id', async (req, res) => {
  const id = lerId(req.params.id);
  if (!id) return res.status(400).json({ erro: 'ID de serviço inválido.' });

  const [resultado] = await pool.execute('DELETE FROM servicos WHERE id = ?', [id]);
  if (resultado.affectedRows === 0) return res.status(404).json({ erro: 'Serviço não encontrado.' });

  res.json({ mensagem: 'Serviço excluído.' });
});

module.exports = router;
