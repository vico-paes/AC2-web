const mongoose = require('mongoose');

const disciplinaSchema = new mongoose.Schema(
  {
    codigo: { type: String, required: true, trim: true, uppercase: true },
    nome: { type: String, required: true, trim: true },
    professor: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const alunoSchema = new mongoose.Schema(
  {
    ra: { type: String, required: true, unique: true, trim: true },
    nome: { type: String, required: true, trim: true },
    disciplinas: {
      type: [disciplinaSchema],
      default: [],
      validate: {
        validator: (disciplinas) => {
          const codigos = disciplinas.map((d) => d.codigo);
          return new Set(codigos).size === codigos.length;
        },
        message: 'O aluno não pode possuir disciplinas com códigos repetidos'
      }
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model('Aluno', alunoSchema, 'alunos');
