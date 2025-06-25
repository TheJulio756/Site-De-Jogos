# Site-De-Jogos
Entrega 1 do site de jogos - Programação Web II

# Site De Jogos - Plataforma de Jogos Educativos

## 🚀 Visão Geral do Projeto

O Site De Jogos é uma plataforma interativa e educativa que permite aos usuários transformar seus conhecimentos em jogos divertidos e desafiadores. Com foco no aprendizado ativo, a plataforma oferece ferramentas para gerenciar termos e definições, gerar automaticamente diferentes tipos de jogos (Memória, Associação e Quiz) e compartilhar esses jogos com outros usuários. Além disso, registra os resultados das partidas para acompanhamento do desempenho.

## ✨ Funcionalidades Implementadas (Primeira Entrega)

### 👤 Gerenciamento de Usuários (CRUD)
- **Cadastro de Usuários**: Permite que novos usuários se registrem na plataforma.
- **Login/Autenticação**: Sistema seguro de login para acesso à conta.
- **Alteração de Senha**: Funcionalidade para que os usuários possam atualizar suas senhas.

### 📚 Cadastro de Conteúdo
- **Cadastro de Termos e Definições**: Usuários podem criar e gerenciar seus próprios termos e definições, que servem como base para a geração dos jogos.

### 🎮 Geração dos Jogos
A partir dos termos e definições cadastrados, a plataforma gera automaticamente os seguintes tipos de jogos:
- **Jogo da Memória**: Associação de pares termo <-> definição.
- **Jogo de Associação**: Associação direta entre um termo e sua definição correspondente.
- **Jogo de Quiz**: Apresenta um termo e múltiplas definições como alternativas, onde o usuário deve escolher a correta.

### 🔗 Compartilhamento dos Jogos
- Os jogos gerados podem ser compartilhados com outros usuários através de um **link compartilhável** ou **código de acesso**.

### 📊 Registro de Resultados
- Cada partida jogada tem seu resultado registrado, incluindo:
  - **Pontuação**
  - **Número de Acertos**
  - **Número de Erros**
  - **Tempo da Partida**
  - **Identificação do Jogador**

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js, Express.js, Mongoose (para MongoDB), bcrypt (para criptografia de senhas), express-session (para gerenciamento de sessões), dotenv (para variáveis de ambiente).
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla).
- **Banco de Dados**: MongoDB Atlas (NoSQL).
- **Design**: CSS Grid, Flexbox, Animações CSS para uma interface moderna e responsiva.

## 📋 Como Instalar e Executar o Projeto

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:
- **Node.js**: Versão 14 ou superior (inclui npm).
- **MongoDB Atlas**: Uma conta e um cluster configurado para obter a URI de conexão.

### Configuração do Banco de Dados (MongoDB Atlas)

1. **Crie um Cluster no MongoDB Atlas**: Se você ainda não tem um, crie um cluster gratuito no site do MongoDB Atlas.
2. **Obtenha a URI de Conexão**: No seu cluster, vá em `Database Access` para criar um usuário de banco de dados e em `Network Access` para configurar as permissões de IP. Em seguida, vá em `Databases` > `Connect` e escolha a opção `Connect your application` para obter a URI de conexão. Ela será similar a esta:
   `mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority`
3. **Atualize o arquivo `.env`**: No diretório `backend/`, crie um arquivo chamado `.env` (se ele não existir) e adicione as seguintes variáveis, substituindo os valores pelos seus:
   ```
   MONGODB_URI=mongodb+srv://gutierresmilgrau:YB1arO56MZjYWOFc@clusterprojetosite.xrs2rna.mongodb.net/approveit?retryWrites=true&w=majority&appName=ClusterProjetoSite
   PORT=3001
   SESSION_SECRET=seusegredoaqui
   ```
   - `MONGODB_URI`: A URI de conexão do seu cluster MongoDB Atlas.
   - `PORT`: A porta em que o servidor backend será executado (padrão: 3001).
   - `SESSION_SECRET`: Uma string secreta para a sessão do Express (use uma string complexa e única).

### Passos para Execução

1. **Clone o repositório** (se ainda não o fez):
   ```bash
   git clone <link-do-repositorio>
   cd approveit-games-platform
   ```
   *(Nota: O projeto foi entregue como um arquivo ZIP, então este passo é apenas para referência futura com GitHub.)*

2. **Navegue até o diretório do backend**:
   ```bash
   cd backend
   ```

3. **Instale as dependências do backend**:
   ```bash
   npm install
   ```

4. **Inicie o servidor backend**:
   ```bash
   node server.js
   ```
   O servidor estará rodando em `http://localhost:3001`.

5. **Acesse a aplicação no navegador**:
   Abra seu navegador e acesse:
   `http://localhost:3001/login.html`

## 📁 Estrutura de Arquivos do Projeto

```
projeto/
├── backend/
│   ├── server.js              # ⭐ ARQUIVO PRINCIPAL (backend)
│   ├── package.json           # Dependências do projeto
│   ├── .env                   # Variáveis de ambiente (configuração do MongoDB)
│   ├── gameGenerator.js       # Lógica de geração de jogos
│   └── node_modules/          # Dependências instaladas (gerado por npm install)
└── frontend/
    └── site/
        ├── auth-styles.css    # Estilos das páginas de autenticação
        ├── login.html         # Página de login redesenhada
        ├── resgistrar.html    # Página de registro redesenhada
        ├── esqueciasenha.html # Página de recuperação de senha redesenhada
        ├── indexcomeco.html   # Página principal (dashboard)
        ├── styles.css         # Estilos gerais do site
        └── script.js          # Scripts do frontend
    └── terms-and-definitions/ # Páginas e scripts para os jogos
        ├── association/
        ├── memory/
        └── quiz/
```

## 🔑 Observações Importantes

- **Executável**: O projeto é totalmente executável seguindo as instruções acima.
- **Backend Consolidado**: Todas as funcionalidades do backend estão contidas no `server.js`.
- **Dados Persistentes**: Os dados de usuários, termos, jogos compartilhados e resultados são armazenados no MongoDB Atlas.
- **Design**: As telas de login, registro e recuperação de senha foram redesenhadas para uma experiência de usuário mais moderna e consistente com o restante do site.

## 📞 Suporte

Em caso de dúvidas ou problemas na execução, verifique:
1. Se o Node.js está instalado e na versão correta.
2. Se todas as dependências foram instaladas (`npm install` no diretório `backend`).
3. Se a porta 3001 não está sendo utilizada por outro processo.
4. Se a `MONGODB_URI` no seu arquivo `.env` está correta e se o seu cluster MongoDB Atlas permite conexões do seu IP.

---
*Este README foi gerado automaticamente e revisado para atender aos requisitos da entrega.*

