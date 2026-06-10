const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const adminController = require('../controllers/adminController');

// Rotas Públicas do Site
router.get('/', siteController.renderHome);
router.get('/sobre', siteController.renderSobre);
router.get('/servicos', siteController.renderServicos);
router.get('/servicos/assistente', siteController.renderAssistente);
router.get('/servicos/:tipo', siteController.renderDetalheServico);
router.get('/contato', siteController.renderContato);
router.get('/login', siteController.renderLogin);

// Rotas Administrativas (CRUD com Banco SQLite)
router.get('/admin', adminController.listarTecnologias);
router.get('/admin/cadastrar', adminController.renderCadastrar);
router.post('/admin/cadastrar', adminController.salvarTecnologia);
router.get('/admin/editar/:id', adminController.renderEditar);
router.post('/admin/editar/:id', adminController.atualizarTecnologia);
router.get('/admin/deletar/:id', adminController.deletarTecnologia);

module.exports = router;
