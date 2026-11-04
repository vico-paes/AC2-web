const mongoose = require('mongoose');

async function conectarBanco() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI não definida no arquivo .env');
  }
  await mongoose.connect(uri, { dbName: process.env.MONGODB_DB || 'escola' });
  console.log('Conectado ao MongoDB');
}

module.exports = conectarBanco;
