const { Router } = require('express');
const pool = require('../db');
const { SELECT_SERVICO } = require('../queries');

const router = Router();

// GET /api/resumo — números do painel inicial e próximos agendamentos
router.get('/', async (req, res) => {
  const [[totais]] = await pool.execute(`
    SELECT
      (SELECT COUNT(*) FROM animais) AS total_animais,
      COALESCE(SUM(status = 'agendado'), 0) AS agendados,
      COALESCE(SUM(status = 'em_andamento'), 0) AS em_andamento,
      COALESCE(SUM(status = 'concluido'), 0) AS concluidos,
      COALESCE(SUM(CASE WHEN status = 'concluido' THEN valor END), 0) AS receita_concluida,
      COALESCE(SUM(CASE WHEN status <> 'concluido' THEN valor END), 0) AS receita_prevista
    FROM servicos`);

  const [proximos] = await pool.execute(
    `${SELECT_SERVICO} WHERE s.status = 'agendado' AND s.data >= CURDATE() ORDER BY s.data, s.id LIMIT 5`,
  );

  res.json({ ...totais, proximos });
});

module.exports = router;
