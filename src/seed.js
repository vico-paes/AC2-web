require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const conectarBanco = require('./config/database');
const Aluno = require('./models/Aluno');

const alunos = [
  {
    ra: '1',
    nome: 'João',
    disciplinas: [
      { codigo: 'MAT101', nome: 'Matemática', professor: 'Prof. Carlos' },
      { codigo: 'HIS101', nome: 'História', professor: 'Prof. Ana' }
    ]
  },
  {
    ra: '2',
    nome: 'Maria',
    disciplinas: [
      { codigo: 'MAT101', nome: 'Matemática', professor: 'Prof. Carlos' },
      { codigo: 'FIS101', nome: 'Física', professor: 'Prof. Carlos' },
      { codigo: 'POR101', nome: 'Português', professor: 'Prof. Beatriz' }
    ]
  },
  {
    ra: '3',
    nome: 'Pedro',
    disciplinas: [
      { codigo: 'HIS101', nome: 'História', professor: 'Prof. Ana' },
      { codigo: 'GEO101', nome: 'Geografia', professor: 'Prof. Marcos' }
    ]
  },
  {
    ra: '4',
    nome: 'Joana',
    disciplinas: [
      { codigo: 'POR101', nome: 'Português', professor: 'Prof. Beatriz' }
    ]
  }
];

async function popular() {
  await conectarBanco();
  await Aluno.deleteMany({});
  await Aluno.syncIndexes();
  await Aluno.insertMany(alunos);
  console.log(`${alunos.length} alunos inseridos com sucesso`);
}

popular()
  .catch((err) => {
    console.error('Erro ao popular o banco:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
