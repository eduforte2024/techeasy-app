const express = require('express');
const path = require('path');
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do motor de views (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares utilitários
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas do ecossistema
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor TechEasy rodando em http://localhost:${PORT}`);
});
