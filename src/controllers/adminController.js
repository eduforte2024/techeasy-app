const db = require('../config/database');

// Listar tecnologias no painel
exports.listarTecnologias = (req, res) => {
    const search = req.query.search || '';
    let query = "SELECT * FROM tecnologias";
    let params = [];

    if (search) {
        query += " WHERE nome LIKE ? OR descricao LIKE ?";
        params = [`%${search}%`, `%${search}%`];
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).send("Erro interno no banco de dados.");
        }
        res.render('admin', { title: 'Painel Admin', page: 'admin', tecnologias: rows, search });
    });
};

// Renderizar tela de cadastro
exports.renderCadastrar = (req, res) => {
    res.render('cadastrar', { title: 'Nova Tecnologia', page: 'admin' });
};

// Salvar nova tecnologia (POST)
exports.salvarTecnologia = (req, res) => {
    const { nome, descricao } = req.body;
    db.run("INSERT INTO tecnologias (nome, descricao) VALUES (?, ?)", [nome, descricao], (err) => {
        if (err) return res.status(500).send("Erro ao salvar.");
        res.redirect('/admin');
    });
};

// Renderizar tela de edição
exports.renderEditar = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM tecnologias WHERE id = ?", [id], (err, row) => {
        if (err || !row) return res.status(404).send("Tecnologia não encontrada.");
        res.render('editar', { title: 'Modificar Tecnologia', page: 'admin', tecnologia: row });
    });
};

// Atualizar tecnologia (POST)
exports.atualizarTecnologia = (req, res) => {
    const { id } = req.params;
    const { nome, descricao } = req.body;
    db.run("UPDATE tecnologias SET nome = ?, descricao = ? WHERE id = ?", [nome, descricao, id], (err) => {
        if (err) return res.status(500).send("Erro ao atualizar.");
        res.redirect('/admin');
    });
};

// Deletar tecnologia
exports.deletarTecnologia = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM tecnologias WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).send("Erro ao excluir.");
        res.redirect('/admin');
    });
};
