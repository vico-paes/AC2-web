const express = require('express');
const alunoRoutes = require('./routes/alunoRoutes');

const app = express();

app.use(express.json());

app.use('/alunos', alunoRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ erro: 'RA já cadastrado' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ erro: Object.values(err.errors).map((e) => e.message).join('; ') });
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

module.exports = app;
