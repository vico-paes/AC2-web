const Aluno = require('../models/Aluno');
const { camposFaltando } = require('./validacoes');

async function adicionar(req, res) {
  const faltando = camposFaltando(req.body, ['codigo', 'nome', 'professor']);
  if (faltando.length > 0) {
    return res.status(400).json({ erro: `Campo(s) obrigatório(s) não informado(s): ${faltando.join(', ')}` });
  }

  const { ra } = req.params;
  const disciplina = {
    codigo: req.body.codigo.trim().toUpperCase(),
    nome: req.body.nome.trim(),
    professor: req.body.professor.trim()
  };

  const aluno = await Aluno.findOne({ ra });
  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  const resultado = await Aluno.updateOne(
    { ra, 'disciplinas.codigo': { $ne: disciplina.codigo } },
    { $push: { disciplinas: disciplina } }
  );

  if (resultado.modifiedCount === 0) {
    return res.status(409).json({ erro: 'Disciplina duplicada: o aluno já está matriculado nessa disciplina' });
  }

  const atualizado = await Aluno.findOne({ ra }, { _id: 0 });
  res.status(201).json({ mensagem: 'Disciplina adicionada com sucesso', aluno: atualizado });
}

async function atualizar(req, res) {
  const faltando = camposFaltando(req.body, ['nome', 'professor']);
  if (faltando.length > 0) {
    return res.status(400).json({ erro: `Campo(s) obrigatório(s) não informado(s): ${faltando.join(', ')}` });
  }

  const { ra } = req.params;
  const codigo = req.params.codigo.trim().toUpperCase();

  if (!(await Aluno.exists({ ra }))) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  const resultado = await Aluno.updateOne(
    { ra, 'disciplinas.codigo': codigo },
    { $set: { 'disciplinas.$.nome': req.body.nome.trim(), 'disciplinas.$.professor': req.body.professor.trim() } }
  );

  if (resultado.matchedCount === 0) {
    return res.status(404).json({ erro: 'Disciplina não encontrada' });
  }

  const aluno = await Aluno.findOne({ ra }, { _id: 0 });
  res.status(200).json({
    mensagem: 'Disciplina atualizada com sucesso',
    disciplina: aluno.disciplinas.find((d) => d.codigo === codigo)
  });
}

async function remover(req, res) {
  const { ra } = req.params;
  const codigo = req.params.codigo.trim().toUpperCase();

  if (!(await Aluno.exists({ ra }))) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  const resultado = await Aluno.updateOne(
    { ra, 'disciplinas.codigo': codigo },
    { $pull: { disciplinas: { codigo } } }
  );

  if (resultado.matchedCount === 0) {
    return res.status(404).json({ erro: 'Disciplina não encontrada' });
  }

  const aluno = await Aluno.findOne({ ra }, { _id: 0 });
  res.status(200).json({ mensagem: 'Disciplina removida com sucesso', aluno });
}

module.exports = { adicionar, atualizar, remover };
