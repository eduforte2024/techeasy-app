# Relatório Técnico de Pesquisa: Análise Arquitetural do Sistema de Biblioteca

**Para:** Usuarios da area de tacnologia  
**De:** Rduarda Silva Forte  
**Assunto:** Levantamento técnico, ciclo de vida de componentes, mapeamento objeto-relacional e análise de escalabilidade do banco de dados.  

---

## ⚙️ O Motor do ASP.NET (Injeção de Dependência)

### O que é Injeção de Dependência (DI) e qual problema ela resolve?
A Injeção de Dependência é um padrão de projeto estrutural utilizado para alcançar a Inversão de Controle (IoC) entre classes e suas dependências. No contexto do nosso Controller conversando com o Banco de Dados, a DI resolve o problema do **acoplamento rígido**.

Sem a DI, o Controller precisaria instanciar manualmente o contexto do banco de dados (ex: `var context = new BibliotecaContext();`). Isso traria sérios problemas estruturais:
* **Dificuldade de manutenção:** Se a forma de criar o contexto mudasse, todos os Controllers precisariam ser alterados manualmente.
* **Impossibilidade de testes unitários:** Não seria possível isolar a lógica do Controller usando dados simulados (mocks), pois ele estaria permanentemente amarrado ao banco físico.
* **Gerenciamento ineficiente de conexões:** O desenvolvedor seria o responsável por abrir e fechar as conexões, aumentando o risco de vazamento de memória e conexões órfãs.

Com a DI ativa, o ASP.NET Core assume a responsabilidade de instanciar e injetar automaticamente o contexto do banco diretamente no construtor do Controller quando ele é requisitado.

### Os Três Ciclos de Vida dos Serviços
No arquivo `Program.cs`, o tempo de vida e o escopo de reutilização dos objetos injetados são determinados por três categorias principais:

1. **Transient (`AddTransient`):** Os serviços de tempo de vida temporário são criados cada vez que são solicitados do contêiner de serviços. Essa vida útil funciona melhor para serviços leves e sem estado (stateless).
2. **Scoped (`AddScoped`):** Os serviços de tempo de vida com escopo são criados uma vez por requisição HTTP do cliente. Todos os componentes que processam aquela mesma requisição compartilham a mesma instância do serviço. Ao término da requisição, a instância é automaticamente descartada.
3. **Singleton (`AddSingleton`):** Os serviços de tempo de vida singleton são criados na primeira vez que são solicitados (ou quando o `Program.cs` é executado) e cada solicitação subsequente usará a mesma instância exata até que a aplicação seja reiniciada.

> ⚠️ **Por que o banco de dados nunca deve ser um Singleton?**
> O contexto do Entity Framework (`DbContext`) não foi projetado para ser *thread-safe*. Se configurado como Singleton, uma única instância do contexto atenderia múltiplos usuários e requisições concorrentes ao mesmo tempo. Isso causaria corrupção de transações, misturaria dados de requisições de usuários diferentes e travaria o sistema gerando a exceção crítica `InvalidOperationException`. Por isso, mapeamos obrigatoriamente como **Scoped**.

---

## 🪄 A Mágica do Banco de Dados (EF Core e ORM)

### O que é uma ferramenta ORM e suas vantagens?
Um **ORM (Object-Relational Mapper)** é uma tecnologia que mapeia a estrutura de objetos do código orientado a objetos diretamente para as tabelas de um banco de dados relacional. O Entity Framework Core é o ORM oficial do ecossistema .NET.

A principal vantagem para o tempo de desenvolvimento da equipe é a **produtividade e abstração da complexidade**. Os desenvolvedores não precisam escrever consultas ou comandos SQL puros (como `CREATE TABLE`, `INSERT INTO`) dentro de strings de texto no código C#. Toda a manipulação de dados é feita usando coleções C# e consultas expressas em LINQ (*Language Integrated Query*), o que diminui drasticamente erros de sintaxe e digitação.

### A Abordagem Code-First
A abordagem **Code-First (Código Primeiro)** define que a estrutura do banco de dados (tabelas, colunas, chaves primárias e relacionamentos) deve ser desenhada primeiramente usando classes C# normais (chamadas de Entidades) e configurações no código. O banco de dados físico se torna um mero reflexo do que foi programado, sendo gerado e atualizado de forma automatizada com base nas modificações dessas classes.

### Como funcionam as Migrations e o `dotnet ef database update`?
As *Migrations* funcionam como um controle de versão para o esquema do nosso banco de dados. Cada alteração feita nas classes C# gera um arquivo de migração que descreve o que mudou.

Nos bastidores, quando executamos o comando `dotnet ef database update` no terminal, o Entity Framework realiza o seguinte fluxo:
* Ele se conecta ao banco de dados configurado e procura por uma tabela especial do sistema chamada `__EFMigrationsHistory`.
* Se essa tabela não existir (como no primeiro acesso), ele a cria automaticamente.
* O EF compara os nomes das migrações listadas nos arquivos do projeto de código com os registros armazenados dentro da tabela `__EFMigrationsHistory` do banco de dados.
* Ele identifica quais arquivos de migration locais ainda não foram aplicados naquele banco de dados específico.
* Para cada migração pendente, o EF traduz o código C# da migração para os comandos SQL correspondentes daquele banco de dados (neste caso, dialeto SQLite) e executa o script.
* Após aplicar com sucesso, o nome da migration é adicionado como uma nova linha na tabela `__EFMigrationsHistory`, garantindo que o sistema saiba exatamente onde parou.

---

## 🗄️ O Limite do nosso SQLite

### Vantagens do SQLite no Ambiente de Desenvolvimento
* **Configuração Zero:** Não há necessidade de instalar, gerenciar ou configurar servidores locais pesados (como instâncias locais de SQL Server ou Postgres no Docker).
* **Portabilidade Total:** O banco de dados inteiro reside em um único arquivo local (ex: `biblioteca.db`). Ele pode ser facilmente compartilhado via Git, permitindo que qualquer desenvolvedor clone o repositório e execute o sistema na hora.
* **Consumo Mínimo de Recursos:** Como roda direto em processo e lê um arquivo local, ele é extremamente leve para máquinas de desenvolvimento.

### O Ponto Fraco: Concorrência de Escrita
O SQLite adota um modelo de bloqueio muito simples para garantir a integridade dos dados. Sempre que uma operação de **escrita** (`INSERT`, `UPDATE` ou `DELETE`) é iniciada, o SQLite realiza um **bloqueio exclusivo em todo o arquivo do banco de dados**.

Isso significa que enquanto um usuário está gravando algo, nenhum outro usuário consegue escrever no banco simultaneamente; as outras tentativas de gravação precisam entrar em uma fila de espera. Em um cenário com a projeção de 10.000 acessos simultâneos no próximo mês, esse modelo gerará graves gargalos de concorrência. Os usuários enfrentarão lentidões severas e o sistema começará a estourar erros de travamento conhecidos como `database is locked` ou *Timeouts*.

### A Hora Certa de Migrar
A hora certa de abandonar o SQLite é **imediatamente antes de mover a aplicação para o ambiente de homologação (Staging) ou Produção real**. O SQLite nunca deve ser utilizado para sistemas corporativos web multiusuário em escala produtiva.

Devemos migrar a plataforma para um banco de dados baseado em servidor robusto (como **PostgreSQL** ou **SQL Server** na nuvem), onde a concorrência é gerenciada ao nível de linhas e páginas, permitindo milhares de leituras e escritas simultâneas de forma otimizada. Graças ao uso do EF Core, essa migração requer apenas a substituição do provedor no arquivo `Program.cs` e a respectiva string de conexão.
