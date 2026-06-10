const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../../techeasy.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('📦 Conectado com sucesso ao banco de dados SQLite.');
    }
});

// Inicialização da tabela de tecnologias se não existir
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tecnologias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT NOT NULL
        )
    `, (err) => {
        if (!err) {
            db.get("SELECT COUNT(*) as count FROM tecnologias", [], (err, row) => {
                if (row && row.count === 0) {
                    db.run("INSERT INTO tecnologias (nome, descricao) VALUES (?, ?)", [
                        "Node.js + Express", 
                        "Aplicações escaláveis e APIs REST rápidas de arquitetura MVC."
                    ]);
                }
            });
        }
    });
});

module.exports = db;
