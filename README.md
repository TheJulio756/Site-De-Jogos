# Site de Jogos - Sistema de Redefinição de Senha

## 📋 Sobre o Projeto

Este é um projeto de site de jogos educativos com sistema completo de autenticação, incluindo funcionalidade de redefinição de senha por email.

## ✨ Funcionalidades Implementadas

### Sistema de Redefinição de Senha
- ✅ Solicitação de redefinição por email
- ✅ Envio de email com link seguro
- ✅ Página de redefinição com validação de token
- ✅ Interface consistente com o design do projeto
- ✅ Validação de senhas em tempo real
- ✅ Tokens com expiração de 1 hora
- ✅ Mensagens de feedback para o usuário

### Outras Funcionalidades
- Sistema de login e registro
- Gerenciamento de termos e definições
- Jogos educativos (memória, associação, quiz)
- Compartilhamento de jogos
- Sistema de pontuação

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- MongoDB (local ou Atlas)
- Conta Gmail para envio de emails

### Configuração

1. **Instalar dependências:**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   
   Copie o arquivo `.env.example` para `.env` e configure:
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/sitedejogos
   # ou para MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/sitedejogos
   
   # Sessão
   SESSION_SECRET=seu_segredo_super_secreto_aqui
   
   # Email (Gmail)
   EMAIL_USER=seu-email@gmail.com
   EMAIL_PASS=sua-senha-de-app-do-gmail
   
   # Porta
   PORT=3001
   ```

3. **Configurar Gmail para envio de emails:**
   - Ative a verificação em 2 etapas na sua conta Google
   - Gere uma "Senha de app" específica para este projeto
   - Use essa senha no campo `EMAIL_PASS`

4. **Iniciar o servidor:**
   ```bash
   npm start
   ```

5. **Acessar o sistema:**
   - Abra o navegador em: `http://localhost:3001`
   - Você será redirecionado para a página de login

## 📧 Como Funciona a Redefinição de Senha

1. **Solicitar redefinição:**
   - Na página de login, clique em "Esqueci minha senha"
   - Digite o email cadastrado
   - Clique em "Enviar Link de Redefinição"

2. **Receber email:**
   - Verifique sua caixa de entrada (e spam)
   - Clique no link recebido

3. **Redefinir senha:**
   - Você será levado à página de redefinição
   - Digite a nova senha (mínimo 6 caracteres)
   - Confirme a nova senha
   - Clique em "Redefinir Senha"

4. **Fazer login:**
   - Após redefinir, você será direcionado ao login
   - Use a nova senha para entrar

## 🔧 Estrutura do Projeto

```
projeto/
├── backend/
│   ├── server.js              # Servidor principal
│   ├── gameGenerator.js       # Gerador de jogos
│   ├── package.json          # Dependências
│   ├── .env.example          # Exemplo de configuração
│   └── node_modules/         # Dependências instaladas
└── frontend/
    ├── site/
    │   ├── login.html         # Página de login
    │   ├── resgistrar.html    # Página de registro
    │   ├── esqueciasenha.html # Página de recuperação
    │   ├── reset-password.html # Página de redefinição (NOVA)
    │   ├── auth-styles.css    # Estilos de autenticação
    │   └── ...               # Outras páginas
    └── terms-and-definitions/ # Jogos educativos
```

## 🆕 Arquivos Adicionados/Modificados

### Novos Arquivos:
- `frontend/site/reset-password.html` - Página de redefinição de senha
- `backend/.env.example` - Exemplo de configuração

### Arquivos Modificados:
- `backend/server.js` - Adicionado sistema de redefinição de senha
- `backend/package.json` - Adicionadas dependências nodemailer e crypto
- `frontend/site/esqueciasenha.html` - Melhorada interface e mensagens

## 🔐 Segurança

- Tokens de redefinição são únicos e criptografados
- Tokens expiram em 1 hora
- Senhas são criptografadas com bcrypt
- Validação de entrada em todas as rotas
- Proteção contra ataques de força bruta

## 📱 Responsividade

- Interface totalmente responsiva
- Funciona em desktop, tablet e mobile
- Design consistente em todas as páginas

## 🎨 Design

- Interface moderna e intuitiva
- Animações suaves e micro-interações
- Feedback visual para todas as ações
- Cores e tipografia consistentes
- Ícones expressivos para cada funcionalidade

## 🐛 Solução de Problemas

### Email não está sendo enviado:
1. Verifique se as credenciais do Gmail estão corretas
2. Certifique-se de usar uma "Senha de app" e não a senha normal
3. Verifique se a verificação em 2 etapas está ativada

### Erro de conexão com MongoDB:
1. Verifique se o MongoDB está rodando
2. Confirme a string de conexão no arquivo `.env`
3. Para MongoDB Atlas, verifique as permissões de IP

### Página não carrega:
1. Verifique se o servidor está rodando na porta correta
2. Confirme se não há conflitos de porta
3. Verifique os logs do console para erros

## 📞 Suporte

Para dúvidas ou problemas, verifique:
1. Os logs do servidor no terminal
2. O console do navegador (F12)
3. As configurações do arquivo `.env`

---

**Desenvolvido com ❤️ para educação e aprendizado**

