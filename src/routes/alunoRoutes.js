const { Router } = require('express');
const alunoController = require('../controllers/alunoController');
const disciplinaController = require('../controllers/disciplinaController');

const router = Router();

router.get('/', alunoController.listar);
router.post('/', alunoController.cadastrar);
router.get('/:ra', alunoController.buscarPorRa);
router.put('/:ra', alunoController.atualizar);
router.delete('/:ra', alunoController.excluir);
router.get('/:ra/resumo', alunoController.resumo);

router.get('/:ra/disciplinas', alunoController.listarDisciplinas);
router.post('/:ra/disciplinas', disciplinaController.adicionar);
router.put('/:ra/disciplinas/:codigo', disciplinaController.atualizar);
router.delete('/:ra/disciplinas/:codigo', disciplinaController.remover);

module.exports = router;
