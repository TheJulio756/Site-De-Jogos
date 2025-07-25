# ApproveIt Games - Plataforma de Jogos Educativos

Uma plataforma completa para criação e compartilhamento de jogos educativos baseados em termos e definições. O sistema permite que usuários cadastrem conteúdo educativo e automaticamente gerem três tipos de jogos interativos: Jogo da Memória, Jogo de Associação e Quiz.

## 📋 Descrição do Projeto

O ApproveIt Games é uma aplicação web desenvolvida para facilitar o aprendizado através de jogos educativos. A plataforma oferece uma interface intuitiva onde educadores e estudantes podem:

- **Gerenciar Conteúdo**: Cadastrar termos e definições organizados por categorias
- **Gerar Jogos Automaticamente**: Criar jogos interativos a partir do conteúdo cadastrado
- **Compartilhar Experiências**: Disponibilizar jogos para outros usuários através de códigos únicos
- **Acompanhar Progresso**: Registrar e visualizar resultados das partidas

### Tipos de Jogos Disponíveis

1. **🧠 Jogo da Memória**: Encontre os pares correspondentes entre termos e definições
2. **🔗 Jogo de Associação**: Arraste termos para suas definições correspondentes
3. **❓ Quiz**: Responda perguntas de múltipla escolha sobre os termos cadastrados

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **bcrypt** - Criptografia de senhas
- **express-session** - Gerenciamento de sessões
- **cors** - Habilitação de CORS
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização e responsividade
- **JavaScript (ES6+)** - Interatividade e lógica do cliente
- **Drag and Drop API** - Funcionalidade de arrastar e soltar
- **Local Storage** - Armazenamento local de dados do jogo

### Funcionalidades Implementadas
- Sistema completo de autenticação (login, registro, logout)
- CRUD completo para gerenciamento de usuários
- CRUD completo para termos e definições
- Geração automática de jogos baseada em algoritmos
- Sistema de compartilhamento com códigos únicos
- Registro e armazenamento de resultados das partidas
- Interface responsiva para desktop e mobile
- Sistema de pontuação dinâmica
- Suporte a categorização de conteúdo

## 📦 Instalação e Configuração

### Pré-requisitos

Certifique-se de ter instalado em seu sistema:
- **Node.js** (versão 14 ou superior)
- **npm** (geralmente incluído com Node.js)
- **MongoDB** (local ou MongoDB Atlas)

### Passo a Passo

1. **Clone ou extraia o projeto**
   ```bash
   # Se usando Git
   git clone <url-do-repositorio>
   cd approveit-games-platform
   
   # Ou extraia o arquivo ZIP fornecido
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```
   
   > **Nota**: Se houver conflitos de dependências, use:
   ```bash
   npm install --force
   ```

3. **Configure as variáveis de ambiente**
   
   Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   MONGODB_URI=mongodb://localhost:27017/approveit_games
   PORT=3001
   SESSION_SECRET=seu_segredo_aqui
   ```

4. **Configure o banco de dados**
   
   **Opção A - MongoDB Local:**
   - Instale e inicie o MongoDB em sua máquina
   - O banco será criado automaticamente na primeira execução
   
   **Opção B - MongoDB Atlas (Recomendado):**
   - Crie uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Crie um cluster gratuito
   - Obtenha a string de conexão
   - Substitua `MONGODB_URI` no arquivo `.env`

5. **Inicie o servidor**
   ```bash
   npm start
   ```

6. **Acesse a aplicação**
   
   Abra seu navegador e acesse:
   ```
   http://localhost:3001/login.html
   ```

## 🎮 Como Usar

### 1. Primeiro Acesso

1. **Registre-se**: Acesse `/register.html` e crie sua conta
2. **Faça Login**: Use suas credenciais em `/login.html`
3. **Explore o Dashboard**: Você será redirecionado para a página inicial

### 2. Gerenciando Conteúdo

1. **Acesse "Termos"** no menu de navegação
2. **Adicione Termos**: Use o formulário para cadastrar novos termos e definições
3. **Organize por Categorias**: Selecione ou crie categorias para organizar seu conteúdo
4. **Edite ou Exclua**: Use os botões de ação em cada termo cadastrado

### 3. Criando Jogos

1. **Acesse "Jogos"** no menu de navegação
2. **Selecione o Tipo**: Escolha entre Memória, Associação ou Quiz
3. **Configure**: Selecione a categoria de termos (opcional)
4. **Gere o Jogo**: Clique em "Gerar e Jogar" ou "Gerar e Compartilhar"

### 4. Compartilhando Jogos

1. **Gere um Jogo Compartilhável**: Use a opção "Gerar e Compartilhar"
2. **Obtenha o Código**: Um código de 6 caracteres será gerado
3. **Compartilhe**: Envie o código ou link para outros usuários
4. **Jogue**: Outros usuários podem usar o código em "Jogar por Código"

### 5. Jogando

**Jogo da Memória:**
- Clique nas cartas para virá-las
- Encontre os pares termo-definição
- Complete no menor tempo possível

**Jogo de Associação:**
- Arraste termos para suas definições correspondentes
- Use mouse (desktop) ou toque (mobile)
- Conecte todos os pares corretamente

**Quiz:**
- Leia o termo apresentado
- Selecione a definição correta entre as alternativas
- Responda todas as perguntas

## 🗂️ Estrutura do Projeto

```
approveit-games-platform/
├── server.js                 # Servidor principal Express
├── gameGenerator.js          # Lógicas de geração de jogos
├── package.json              # Dependências e scripts
├── .env                      # Variáveis de ambiente
├── .env.example              # Exemplo de configuração
├── README.md                 # Documentação
├── site/                     # Frontend principal
│   ├── indexcomeco.html      # Dashboard principal
│   ├── login.html            # Página de login
│   ├── register.html         # Página de registro
│   ├── terms.html            # Gerenciamento de termos
│   ├── games.html            # Criação de jogos
│   ├── play.html             # Jogar por código
│   ├── commons.css           # Estilos compartilhados
│   └── styles.css            # Estilos específicos
└── terms-and-definitions/    # Jogos interativos
    ├── memory/               # Jogo da Memória
    │   ├── indexmemory.html
    │   └── style.css
    ├── association/          # Jogo de Associação
    │   ├── index.html
    │   └── styles.css
    ├── quiz/                 # Quiz
    │   ├── index.html
    │   └── styles.css
    └── sounds/               # Efeitos sonoros
        ├── bell.wav
        ├── caught.wav
        └── win.wav
```

## 🔧 Scripts Disponíveis

```bash
# Iniciar o servidor em produção
npm start

# Iniciar o servidor em desenvolvimento (se nodemon estiver instalado)
npm run dev

# Instalar dependências
npm install

# Instalar dependências forçando resolução de conflitos
npm install --force
```

## 🌐 Endpoints da API

### Autenticação
- `POST /login` - Autenticar usuário
- `POST /register` - Registrar novo usuário
- `GET /logout` - Encerrar sessão
- `POST /api/change-password` - Alterar senha

### Usuários
- `GET /api/user` - Informações do usuário logado
- `GET /session` - Status da sessão

### Termos e Definições
- `GET /api/terms` - Listar termos do usuário
- `POST /api/terms` - Criar novo termo
- `PUT /api/terms/:id` - Atualizar termo
- `DELETE /api/terms/:id` - Deletar termo

### Jogos
- `POST /api/games/generate` - Gerar jogo
- `POST /api/games/calculate-score` - Calcular pontuação
- `POST /api/games/share` - Criar jogo compartilhável
- `GET /api/games/:shareCode` - Buscar jogo por código

### Resultados
- `POST /api/results` - Salvar resultado
- `GET /api/results/:gameId` - Buscar resultados de um jogo

## 🎯 Funcionalidades Principais

### Gerenciamento de Usuários (CRUD)
- ✅ Cadastro de usuários com validação
- ✅ Sistema de login/autenticação seguro
- ✅ Alteração de senha
- ✅ Sessões persistentes
- ✅ Logout seguro

### Cadastro de Conteúdo
- ✅ CRUD completo para termos e definições
- ✅ Categorização de conteúdo
- ✅ Validação de dados
- ✅ Interface intuitiva

### Geração dos Jogos
- ✅ **Jogo da Memória**: Pares termo-definição com sistema de pontuação
- ✅ **Jogo de Associação**: Drag & drop responsivo com feedback visual
- ✅ **Quiz**: Múltipla escolha com explicações detalhadas
- ✅ Algoritmos de embaralhamento
- ✅ Sistema de pontuação dinâmica

### Compartilhamento dos Jogos
- ✅ Geração de códigos únicos de 6 caracteres
- ✅ Links compartilháveis diretos
- ✅ Acesso público aos jogos compartilhados
- ✅ Interface para jogar por código

### Registro de Resultados
- ✅ Armazenamento de pontuação, acertos, erros e tempo
- ✅ Identificação do jogador
- ✅ Histórico de partidas
- ✅ Estatísticas por jogo

## 📱 Responsividade

A aplicação foi desenvolvida com design responsivo, funcionando perfeitamente em:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (até 767px)

### Recursos Mobile
- Interface touch-friendly
- Drag & drop otimizado para toque
- Navegação adaptada
- Botões e textos dimensionados adequadamente

## 🔒 Segurança

- **Criptografia de Senhas**: bcrypt com salt rounds
- **Sessões Seguras**: express-session com secret configurável
- **Validação de Dados**: Sanitização de inputs
- **CORS Configurado**: Acesso controlado entre domínios
- **Autenticação Obrigatória**: Rotas protegidas por middleware

## 🚀 Deploy e Produção

### Variáveis de Ambiente para Produção
```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/approveit_games
PORT=3001
SESSION_SECRET=chave_secreta_super_forte_aqui
NODE_ENV=production
```

### Considerações para Deploy
1. **Banco de Dados**: Use MongoDB Atlas para produção
2. **Variáveis de Ambiente**: Configure todas as variáveis necessárias
3. **HTTPS**: Configure SSL/TLS para conexões seguras
4. **Process Manager**: Use PM2 ou similar para gerenciar o processo
5. **Logs**: Configure sistema de logs adequado

## 🐛 Solução de Problemas

### Problemas Comuns

**Erro de Conexão com MongoDB:**
```
Erro na conexão com MongoDB: MongoNetworkError
```
**Solução**: Verifique se o MongoDB está rodando e se a string de conexão está correta.

**Conflitos de Dependências:**
```
npm ERR! peer dep missing
```
**Solução**: Use `npm install --force` ou `npm install --legacy-peer-deps`

**Porta já em uso:**
```
Error: listen EADDRINUSE :::3001
```
**Solução**: Altere a porta no arquivo `.env` ou termine o processo que está usando a porta.

**Sessão não persiste:**
**Solução**: Verifique se `SESSION_SECRET` está configurado no `.env`

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- **Desenvolvimento**: Equipe ApproveIt
- **Tecnologias**: Node.js, Express, MongoDB, HTML5, CSS3, JavaScript

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento

---

**ApproveIt Games** - Transformando aprendizado em diversão! 🎮📚

