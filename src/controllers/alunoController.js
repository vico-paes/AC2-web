const Aluno = require('../models/Aluno');
const { camposFaltando, escaparRegex } = require('./validacoes');

async function listar(req, res) {
  const { nome, disciplina } = req.query;
  const filtro = {};

  if (nome !== undefined) {
    filtro.nome = { $regex: escaparRegex(String(nome).trim()), $options: 'i' };
  }

  if (disciplina !== undefined) {
    filtro['disciplinas.codigo'] = String(disciplina).trim().toUpperCase();
  }

  const alunos = await Aluno.find(filtro, { _id: 0 }).sort({ ra: 1 });
  res.status(200).json(alunos);
}

async function buscarPorRa(req, res) {
  const aluno = await Aluno.findOne({ ra: req.params.ra }, { _id: 0 });
  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
  res.status(200).json(aluno);
}

async function listarDisciplinas(req, res) {
  const aluno = await Aluno.findOne({ ra: req.params.ra }, { _id: 0 });
  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
  res.status(200).json(aluno.disciplinas);
}

async function cadastrar(req, res) {
  const faltando = camposFaltando(req.body, ['ra', 'nome']);
  if (faltando.length > 0) {
    return res.status(400).json({ erro: `Campo(s) obrigatório(s) não informado(s): ${faltando.join(', ')}` });
  }

  const disciplinas = req.body.disciplinas ?? [];
  if (!Array.isArray(disciplinas)) {
    return res.status(400).json({ erro: 'O campo disciplinas deve ser uma lista' });
  }

  for (const disciplina of disciplinas) {
    const faltandoDisciplina = camposFaltando(disciplina, ['codigo', 'nome', 'professor']);
    if (faltandoDisciplina.length > 0) {
      return res.status(400).json({ erro: `Campo(s) obrigatório(s) da disciplina não informado(s): ${faltandoDisciplina.join(', ')}` });
    }
  }

  const codigos = disciplinas.map((d) => d.codigo.trim().toUpperCase());
  if (new Set(codigos).size !== codigos.length) {
    return res.status(409).json({ erro: 'Disciplina duplicada: o aluno não pode possuir códigos de disciplina repetidos' });
  }

  const ra = req.body.ra.trim();
  if (await Aluno.exists({ ra })) {
    return res.status(409).json({ erro: 'RA já cadastrado' });
  }

  const aluno = await Aluno.create({
    ra,
    nome: req.body.nome,
    disciplinas: disciplinas.map(({ codigo, nome, professor }) => ({ codigo, nome, professor }))
  });

  const { _id, ...dados } = aluno.toObject();
  res.status(201).json({ mensagem: 'Aluno cadastrado com sucesso', aluno: dados });
}

async function atualizar(req, res) {
  const faltando = camposFaltando(req.body, ['nome']);
  if (faltando.length > 0) {
    return res.status(400).json({ erro: 'Campo obrigatório não informado: nome' });
  }

  const aluno = await Aluno.findOneAndUpdate(
    { ra: req.params.ra },
    { $set: { nome: req.body.nome.trim() } },
    { returnDocument: 'after', projection: { _id: 0 } }
  );

  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
  res.status(200).json({ mensagem: 'Nome do aluno atualizado com sucesso', aluno });
}

async function excluir(req, res) {
  const aluno = await Aluno.findOneAndDelete({ ra: req.params.ra }, { projection: { _id: 0 } });
  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }
  res.status(200).json({ mensagem: 'Aluno e suas disciplinas excluídos com sucesso', aluno });
}

async function resumo(req, res) {
  const aluno = await Aluno.findOne({ ra: req.params.ra });
  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado' });
  }

  res.status(200).json({
    ra: aluno.ra,
    nome: aluno.nome,
    totalDisciplinas: aluno.disciplinas.length,
    professores: [...new Set(aluno.disciplinas.map((d) => d.professor))]
  });
}

module.exports = { listar, buscarPorRa, listarDisciplinas, cadastrar, atualizar, excluir, resumo };
