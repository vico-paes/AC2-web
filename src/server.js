require('dotenv').config({ quiet: true });
const app = require('./app');
const conectarBanco = require('./config/database');

const PORT = process.env.PORT || 3000;

conectarBanco()
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });
