# ⚡ TechEasy - Simplificando sua Infraestrutura

O **TechEasy** é um ecossistema focado em simplificar a escolha e a validação de arquiteturas de software para startups e grandes corporações. Este projeto é uma aplicação web completa desenvolvida seguindo o padrão de arquitetura **MVC (Model-View-Controller)**, utilizando persistência em banco de dados relacional e uma interface moderna totalmente responsiva (mobile-first).

---

## 🚀 Funcionalidades Principais

* **Roteamento Dinâmico:** Navegação fluida entre páginas institucionais (Home, Sobre, Contato) utilizando rotas tratadas pelo Express.
* **Assistente Virtual de Stack (Interativo):** Um simulador inteligente focado na experiência do usuário, processando respostas em tempo de execução para recomendar a melhor combinação de Front-end, Back-end, Banco de dados e Infraestrutura em Nuvem.
* **Painel Administrativo Completo (CRUD):** Área restrita protegida por formulários que permite criar, listar, buscar, atualizar e deletar tecnologias cadastradas.
* **Mecanismo de Busca Real:** Barra de pesquisa integrada diretamente ao banco de dados utilizando cláusulas condicionais SQL (`LIKE`).
* **Design Consistente & Responsivo:** Construído sob o framework Bootstrap 5.3.3, testado e adaptado para funcionar perfeitamente em telas móveis e desktops, incluindo o fechamento automático do menu hamburguer em interações mobile.

---

## 🛠️ Tecnologias Utilizadas

O ecossistema foi construído utilizando as seguintes tecnologias:

* **Back-End:** Node.js, Express
* **Front-End / Views:** EJS (Embedded JavaScript Templates), Bootstrap 5, HTML5, CSS3
* **Banco de Dados:** SQLite3 (Driver nativo rodando localmente de forma otimizada)
* **Ambiente de Desenvolvimento:** Nodemon (Hot-reload automático do servidor)

---

## 📂 Arquitetura do Projeto

A estrutura de pastas segue o padrão MVC rigorosamente isolado para facilitar a manutenção e escalabilidade:

```text
techeasy-app/
├── src/
│   ├── config/       # Arquivo de conexão e inicialização do SQLite3
│   ├── controllers/  # Camada lógica de negócio (Site e Painel Admin)
│   └── routes/       # Definição dos endpoints REST da aplicação
├── views/
│   ├── partials/     # Componentes reaproveitáveis (Header, Footer)
│   └── ...           # Telas do ecossistema renderizadas dinamicamente (.ejs)
├── server.js         # Arquivo principal de inicialização do Express
└── techeasy.db       # Arquivo gerado dinamicamente para o banco local

💻 Como Rodar o Projeto Localmente
Siga o passo a passo abaixo para instalar as dependências e subir a aplicação no seu ambiente local.

1. Clonar o Repositório
Bash
git clone [https://github.com/eduforte2024/techeasy-app.git](https://github.com/eduforte2024/techeasy-app.git)
cd techeasy-app
2. Instalar as Dependências
Certifique-se de ter o Node.js instalado na sua máquina. Execute:

Bash
npm install
3. Rodar em Ambiente de Desenvolvimento
Para rodar a aplicação usando o nodemon (o servidor irá reiniciar automaticamente a cada alteração no código):

Bash
npm run dev
4. Rodar em Ambiente de Produção
Para rodar de forma convencional:

Bash
npm start
5. Acessar a Aplicação
Abra o seu navegador web e acesse a URL:

Plaintext
http://localhost:3000
🔒 Dados de Acesso Padrão (Área Administrativa)
Ao entrar na página Área Restrita, os dados previamente definidos para testes do painel de administração são:

Usuário: admin

Senha: 123456

Nota: Ao iniciar o servidor pela primeira vez, o banco de dados techeasy.db será criado automaticamente no diretório raiz e uma tecnologia de exemplo (Node.js + Express) será inserida na tabela para fins de teste inicial do CRUD.

📝 Licença
Este projeto está sob a licença MIT. Sinta-se livre para usar, estudar e evoluir a aplicação.

Desenvolvido por eduforte2024 - 2026 🚀
