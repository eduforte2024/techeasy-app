exports.renderHome = (req, res) => {
    res.render('home', { title: 'Home', page: 'home' });
};

exports.renderSobre = (req, res) => {
    res.render('sobre', { title: 'Sobre Nós', page: 'sobre' });
};

exports.renderServicos = (req, res) => {
    res.render('servicos', { title: 'Nossos Serviços', page: 'servicos' });
};

exports.renderDetalheServico = (req, res) => {
    const { tipo } = req.params;
    res.render('servico-detalhe', { title: 'Detalhes do Serviço', page: 'servicos', tipo });
};

exports.renderAssistente = (req, res) => {
    res.render('servico-assistente', { title: 'Assistente de Stack', page: 'servicos' });
};

exports.renderContato = (req, res) => {
    res.render('contato', { title: 'Contato', page: 'contato' });
};

exports.renderLogin = (req, res) => {
    res.render('login', { title: 'Acesso Restrito', page: 'login' });
};
