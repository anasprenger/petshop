require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const animaisRoutes = require('./routes/animais');
const servicosRoutes = require('./routes/servicos');
const resumoRoutes = require('./routes/resumo');

const app = express();

app.use(cors());
app.use(express.json());

// Verifica se a API e o banco estão respondendo
app.get('/api/saude', async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok' });
});

app.use('/api/animais', animaisRoutes);
app.use('/api/servicos', servicosRoutes);
app.use('/api/resumo', resumoRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Express 5 encaminha para cá os erros das rotas assíncronas
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição.' });
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ erro: 'Animal não encontrado.', campos: { animal_id: 'Animal não encontrado.' } });
  }
  if (['ER_BAD_FIELD_ERROR', 'ER_NO_SUCH_TABLE'].includes(err.code)) {
    console.error('O banco não tem a estrutura esperada:', err.message);
    return res.status(500).json({
      erro: `O banco não tem a estrutura esperada (${err.sqlMessage}). Rode o script database/atualizar_petshop_db.sql.`,
    });
  }
  if (['ECONNREFUSED', 'ER_ACCESS_DENIED_ERROR', 'ER_BAD_DB_ERROR'].includes(err.code)) {
    console.error('Falha ao acessar o MySQL:', err.message);
    return res.status(503).json({ erro: 'Banco de dados indisponível. Tente novamente em instantes.' });
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, '0.0.0.0', (erro) => {
  if (erro) throw erro;
  console.log(`API do PetCare em http://localhost:${PORT}/api`);
});
