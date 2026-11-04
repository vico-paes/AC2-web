# Projeto Escola – API REST com Node.js e MongoDB

API REST para gerenciamento de alunos e disciplinas de uma instituição de ensino, desenvolvida com Node.js, Express e MongoDB (Mongoose).

## Tecnologias

- Node.js 18+
- Express
- MongoDB / MongoDB Atlas
- Mongoose
- dotenv

## Estrutura do projeto

```
projeto-escola/
├── src/
│   ├── config/         # Conexão com o MongoDB
│   ├── controllers/    # Regras de negócio e validações
│   ├── models/         # Schema do aluno e das disciplinas
│   ├── routes/         # Definição dos endpoints
│   ├── app.js          # Configuração do Express e tratamento de erros
│   ├── server.js       # Inicialização do servidor
│   └── seed.js         # Carga inicial de alunos
├── evidencias/
│   ├── sucesso/
│   └── erros/
├── .env.example
├── package.json
├── README.md
└── RESPOSTA_TECNICA.md
```

## Instalação

```bash
git clone https://github.com/vico-paes/AC2-web.git
cd AC2-web
npm install
```

## Configuração do MongoDB

1. Crie um cluster no [MongoDB Atlas](https://www.mongodb.com/atlas) (ou utilize um MongoDB local).
2. No Atlas, crie um usuário de banco em **Database Access** e libere o seu IP em **Network Access**.
3. Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

4. Preencha as variáveis no `.env`:

```
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/
MONGODB_DB=escola
```

Para MongoDB local, use `MONGODB_URI=mongodb://localhost:27017`.

## Carga inicial dos dados

O comando abaixo limpa a coleção `alunos` e insere os alunos iniciais:

```bash
npm run seed
```

## Execução

```bash
npm start
```

Ou, em modo de desenvolvimento (reinicia ao salvar):

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

## Endpoints

| Método | Rota | Descrição |
|---|---|---|
| GET | `/alunos` | Lista todos os alunos |
| GET | `/alunos?nome=jo` | Filtra alunos por nome (parcial, sem diferenciar maiúsculas/minúsculas) |
| GET | `/alunos?disciplina=MAT101` | Lista alunos matriculados na disciplina |
| GET | `/alunos/:ra` | Busca aluno pelo RA |
| GET | `/alunos/:ra/disciplinas` | Lista as disciplinas do aluno |
| GET | `/alunos/:ra/resumo` | RA, nome, total de disciplinas e professores sem repetição |
| POST | `/alunos` | Cadastra um aluno |
| PUT | `/alunos/:ra` | Atualiza o nome do aluno |
| DELETE | `/alunos/:ra` | Exclui o aluno e suas disciplinas |
| POST | `/alunos/:ra/disciplinas` | Adiciona uma disciplina ao aluno |
| PUT | `/alunos/:ra/disciplinas/:codigo` | Atualiza nome e professor da disciplina |
| DELETE | `/alunos/:ra/disciplinas/:codigo` | Remove a disciplina do aluno |

### Exemplos de corpo

`POST /alunos`

```json
{
  "ra": "5",
  "nome": "Lucas",
  "disciplinas": [
    { "codigo": "MAT101", "nome": "Matemática", "professor": "Prof. Carlos" }
  ]
}
```

`PUT /alunos/:ra`

```json
{ "nome": "Lucas Silva" }
```

`POST /alunos/:ra/disciplinas`

```json
{ "codigo": "QUI101", "nome": "Química", "professor": "Prof. Paula" }
```

`PUT /alunos/:ra/disciplinas/:codigo`

```json
{ "nome": "Química Geral", "professor": "Prof. Ricardo" }
```

## Regras e códigos HTTP

| Código | Situação |
|---|---|
| 200 | Consulta, atualização ou exclusão realizada |
| 201 | Aluno ou disciplina cadastrados |
| 400 | Campo obrigatório ausente ou JSON inválido |
| 404 | Aluno ou disciplina não encontrados |
| 409 | RA duplicado ou disciplina duplicada para o aluno |

Todas as respostas de erro retornam um JSON no formato:

```json
{ "erro": "Aluno não encontrado" }
```

## Testes no Postman

O arquivo `projeto-escola.postman_collection.json` contém as 22 requisições usadas nas evidências (pastas **Sucesso** e **Erros**), na ordem em que devem ser executadas. Para usar, importe o arquivo no Postman (ou Thunder Client), rode `npm run seed` para restaurar os dados iniciais e execute as requisições na sequência.

Os prints dos testes ficam em `evidencias/sucesso` e `evidencias/erros`.
