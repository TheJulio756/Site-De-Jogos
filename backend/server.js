const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcrypt');
const cors = require('cors');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const GameGenerator = require('./gameGenerator');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ 
  secret: process.env.SESSION_SECRET || 'seusegredoaqui', 
  resave: false, 
  saveUninitialized: true 
}));

// Conectar ao MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB Atlas'))
.catch(err => console.error('Erro na conexão com MongoDB:', err));

// Schema do Usuário
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'seu-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'sua-senha-de-app'
  }
});

// Schema para Categorias Personalizadas
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Índice composto para garantir que um usuário não possa ter categorias duplicadas
CategorySchema.index({ name: 1, userId: 1 }, { unique: true });

const Category = mongoose.model('Category', CategorySchema);

// Schema para Termos e Definições
const TermDefinitionSchema = new mongoose.Schema({
  term: { type: String, required: true },
  definition: { type: String, required: true },
  category: { type: String, default: 'geral' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const TermDefinition = mongoose.model('TermDefinition', TermDefinitionSchema);

// Schema para Jogos Compartilhados
const SharedGameSchema = new mongoose.Schema({
  gameType: { type: String, required: true, enum: ['memory', 'association', 'quiz', 'word-search'] },
  terms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TermDefinition' }],
  shareCode: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const SharedGame = mongoose.model('SharedGame', SharedGameSchema);

// Schema para Resultados de Jogos
const GameResultSchema = new mongoose.Schema({
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'SharedGame' },
  gameType: { type: String, required: true },
  playerName: { type: String, required: true },
  score: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  gameTime: { type: Number, required: true }, // em segundos
  completedAt: { type: Date, default: Date.now }
});

const GameResult = mongoose.model('GameResult', GameResultSchema);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../frontend/site')));
app.use('/terms-and-definitions', express.static(path.join(__dirname, '../frontend/terms-and-definitions')));

// Middleware para tratar erros de sessão
app.use((req, res, next) => {
  res.locals.error = req.session.error;
  delete req.session.error;
  next();
});

// Middleware para verificar autenticação
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }
  next();
};

// === ROTAS DE AUTENTICAÇÃO ===

// Login
app.post('/login', async (req, res) => {
  try {
    const usernameOrEmail = req.body.usernameOrEmail?.trim();
    const password = req.body.password;

    if (!usernameOrEmail || !password) {
      req.session.error = 'Usuário ou senha não preenchidos';
      return res.redirect('/login.html');
    }

    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) {
      req.session.error = 'Usuário não encontrado';
      return res.redirect('/login.html');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      req.session.error = 'Senha incorreta';
      return res.redirect('/login.html');
    }

    req.session.userId = user._id;
    res.redirect('/indexcomeco.html');
  } catch (error) {
    console.error('Erro no login:', error);
    req.session.error = 'Erro interno do servidor';
    res.redirect('/login.html');
  }
});

// Registro
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      req.session.error = 'Todos os campos são obrigatórios';
      return res.redirect('/resgistrar.html');
    }

    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
      req.session.error = 'Usuário ou email já cadastrado';
      return res.redirect('/resgistrar.html');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.redirect('/login.html');
  } catch (error) {
    console.error('Erro no registro:', error);
    req.session.error = 'Erro ao registrar usuário';
    res.redirect('/resgistrar.html');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

// Recuperação de senha
app.post('/recover', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.redirect('/esqueciasenha.html?error=invalid_email');
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.redirect('/esqueciasenha.html?error=email_not_found');
    }
    
    // Gerar token de redefinição
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hora
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();
    
    // Enviar email com link de redefinição
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password.html?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'seu-email@gmail.com',
      to: email,
      subject: 'Redefinição de Senha - Site de Jogos',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Redefinição de Senha</h2>
          <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Redefinir Senha</a>
          <p>Este link expira em 1 hora.</p>
          <p>Se você não solicitou esta redefinição, ignore este email.</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.redirect('/esqueciasenha.html?success=password_reset_sent');
  } catch (error) {
    console.error('Erro na recuperação:', error);
    res.redirect('/esqueciasenha.html?error=server_error');
  }
});

// Verificar token de redefinição
app.get('/api/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }
    
    res.json({ valid: true, email: user.email });
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Redefinir senha
app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
    }
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }
    
    // Atualizar senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Alterar senha
app.post('/api/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ROTAS DE CATEGORIAS ===

// Listar categorias do usuário (padrões + personalizadas)
app.get('/api/categories', requireAuth, async (req, res) => {
  try {
    // Categorias padrão
    const defaultCategories = [
      'geral',
      'ciencias',
      'matematica',
      'historia',
      'geografia',
      'portugues',
      'ingles',
      'outros'
    ];

    // Categorias personalizadas do usuário
    const customCategories = await Category.find({ userId: req.session.userId })
      .sort({ createdAt: -1 });

    const allCategories = [
      ...defaultCategories.map(cat => ({ name: cat, isDefault: true })),
      ...customCategories.map(cat => ({ name: cat.name, isDefault: false, _id: cat._id }))
    ];

    res.json(allCategories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar nova categoria personalizada
app.post('/api/categories', requireAuth, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nome da categoria é obrigatório' });
    }

    const categoryName = name.trim().toLowerCase();

    // Verificar se não é uma categoria padrão
    const defaultCategories = [
      'geral', 'ciencias', 'matematica', 'historia', 
      'geografia', 'portugues', 'ingles', 'outros'
    ];

    if (defaultCategories.includes(categoryName)) {
      return res.status(400).json({ error: 'Esta categoria já existe como padrão' });
    }

    const newCategory = new Category({
      name: categoryName,
      userId: req.session.userId
    });

    await newCategory.save();
    res.status(201).json({ name: newCategory.name, isDefault: false, _id: newCategory._id });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Categoria já existe' });
    }
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar categoria personalizada
app.delete('/api/categories/:id', requireAuth, async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    });

    if (!deletedCategory) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    // Atualizar termos que usam esta categoria para 'geral'
    await TermDefinition.updateMany(
      { userId: req.session.userId, category: deletedCategory.name },
      { category: 'geral' }
    );

    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ROTAS DE TERMOS E DEFINIÇÕES ===

// Listar termos do usuário
app.get('/api/terms', requireAuth, async (req, res) => {
  try {
    const terms = await TermDefinition.find({ userId: req.session.userId })
      .sort({ createdAt: -1 });
    res.json(terms);
  } catch (error) {
    console.error('Erro ao buscar termos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar novo termo
app.post('/api/terms', requireAuth, async (req, res) => {
  try {
    const { term, definition, category } = req.body;
    
    if (!term || !definition) {
      return res.status(400).json({ error: 'Termo e definição são obrigatórios' });
    }

    const newTerm = new TermDefinition({
      term: term.trim(),
      definition: definition.trim(),
      category: category || 'geral',
      userId: req.session.userId
    });

    await newTerm.save();
    res.status(201).json(newTerm);
  } catch (error) {
    console.error('Erro ao criar termo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar termo
app.put('/api/terms/:id', requireAuth, async (req, res) => {
  try {
    const { term, definition, category } = req.body;
    
    const updatedTerm = await TermDefinition.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      { term, definition, category },
      { new: true }
    );

    if (!updatedTerm) {
      return res.status(404).json({ error: 'Termo não encontrado' });
    }

    res.json(updatedTerm);
  } catch (error) {
    console.error('Erro ao atualizar termo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Deletar termo
app.delete('/api/terms/:id', requireAuth, async (req, res) => {
  try {
    const deletedTerm = await TermDefinition.findOneAndDelete({
      _id: req.params.id,
      userId: req.session.userId
    });

    if (!deletedTerm) {
      return res.status(404).json({ error: 'Termo não encontrado' });
    }

    res.json({ message: 'Termo deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar termo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ROTAS DE JOGOS ===

// Gerar jogo baseado nos termos do usuário
app.post('/api/games/generate', requireAuth, async (req, res) => {
  try {
    const { gameType, termIds, category } = req.body;
    
    if (!gameType) {
      return res.status(400).json({ error: 'Tipo de jogo é obrigatório' });
    }

    let terms;
    
    if (termIds && termIds.length > 0) {
      // Usar termos específicos
      terms = await TermDefinition.find({
        _id: { $in: termIds },
        userId: req.session.userId
      });
    } else if (category) {
      // Usar termos de uma categoria específica
      terms = await TermDefinition.find({
        category: category,
        userId: req.session.userId
      });
    } else {
      // Usar todos os termos do usuário
      terms = await TermDefinition.find({ userId: req.session.userId });
    }

    if (terms.length === 0) {
      return res.status(400).json({ error: 'Nenhum termo encontrado' });
    }

    // Gerar o jogo
    const gameData = GameGenerator.generateGame(gameType, terms);
    
    res.json({
      ...gameData,
      termsUsed: terms.length,
      category: category || 'todas'
    });
  } catch (error) {
    console.error('Erro ao gerar jogo:', error);
    res.status(400).json({ error: error.message });
  }
});

// Calcular pontuação de um jogo
app.post('/api/games/calculate-score', async (req, res) => {
  try {
    const { gameType, gameData } = req.body;
    
    if (!gameType || !gameData) {
      return res.status(400).json({ error: 'Tipo de jogo e dados são obrigatórios' });
    }

    const score = GameGenerator.calculateScore(gameType, gameData);
    
    res.json({ score });
  } catch (error) {
    console.error('Erro ao calcular pontuação:', error);
    res.status(400).json({ error: error.message });
  }
});

// Gerar código de compartilhamento
function generateShareCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Criar jogo compartilhável
app.post('/api/games/share', requireAuth, async (req, res) => {
  try {
    const { gameType, termIds } = req.body;
    
    if (!gameType || !termIds || termIds.length === 0) {
      return res.status(400).json({ error: 'Tipo de jogo e termos são obrigatórios' });
    }

    // Verificar se os termos pertencem ao usuário
    const terms = await TermDefinition.find({
      _id: { $in: termIds },
      userId: req.session.userId
    });

    if (terms.length !== termIds.length) {
      return res.status(400).json({ error: 'Alguns termos não foram encontrados' });
    }

    let shareCode;
    let codeExists = true;
    
    // Gerar código único
    while (codeExists) {
      shareCode = generateShareCode();
      const existingGame = await SharedGame.findOne({ shareCode });
      codeExists = !!existingGame;
    }

    const sharedGame = new SharedGame({
      gameType,
      terms: termIds,
      shareCode,
      createdBy: req.session.userId
    });

    await sharedGame.save();
    res.status(201).json({ shareCode, gameId: sharedGame._id });
  } catch (error) {
    console.error('Erro ao criar jogo compartilhado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar jogo por código
app.get('/api/games/:shareCode', async (req, res) => {
  try {
    const game = await SharedGame.findOne({ shareCode: req.params.shareCode })
      .populate('terms')
      .populate('createdBy', 'username');

    if (!game) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }

    res.json(game);
  } catch (error) {
    console.error('Erro ao buscar jogo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ROTAS DE RESULTADOS ===

// Salvar resultado do jogo
app.post('/api/results', async (req, res) => {
  try {
    const { gameId, gameType, playerName, score, correctAnswers, wrongAnswers, gameTime } = req.body;
    
    if (!gameType || !playerName || score === undefined || correctAnswers === undefined || wrongAnswers === undefined || gameTime === undefined) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const result = new GameResult({
      gameId: gameId || null,
      gameType,
      playerName: playerName.trim(),
      score,
      correctAnswers,
      wrongAnswers,
      gameTime
    });

    await result.save();
    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao salvar resultado:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar resultados de um jogo
app.get('/api/results/:gameId', async (req, res) => {
  try {
    const results = await GameResult.find({ gameId: req.params.gameId })
      .sort({ score: -1, gameTime: 1 });
    
    res.json(results);
  } catch (error) {
    console.error('Erro ao buscar resultados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// === ROTAS UTILITÁRIAS ===

// Verificar sessão
app.get('/session', (req, res) => {
  res.json({ 
    error: res.locals.error || null,
    authenticated: !!req.session.userId,
    userId: req.session.userId || null
  });
});

// Informações do usuário logado
app.get('/api/user', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota padrão para login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Iniciar servidor
const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}/login.html`);
});


// === ROTAS DE ESTATÍSTICAS DO USUÁRIO ===

// Schema para Estatísticas do Usuário
const UserStatsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  gamesCreated: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 },
  bestScore: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

const UserStats = mongoose.model('UserStats', UserStatsSchema);

// Buscar jogos criados pelo usuário
app.get('/api/user/games-created', requireAuth, async (req, res) => {
  try {
    const count = await SharedGame.countDocuments({ createdBy: req.session.userId });
    
    // Atualizar estatísticas do usuário
    await UserStats.findOneAndUpdate(
      { userId: req.session.userId },
      { gamesCreated: count, updatedAt: new Date() },
      { upsert: true }
    );
    
    res.json({ count });
  } catch (error) {
    console.error('Erro ao buscar jogos criados:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar estatísticas de jogos jogados pelo usuário
app.get('/api/user/game-stats', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Buscar estatísticas do usuário
    let userStats = await UserStats.findOne({ userId: req.session.userId });
    
    if (!userStats) {
      // Criar estatísticas iniciais se não existir
      userStats = new UserStats({
        userId: req.session.userId,
        gamesCreated: 0,
        gamesPlayed: 0,
        bestScore: 0
      });
      await userStats.save();
    }
    
    res.json({ 
      gamesPlayed: userStats.gamesPlayed,
      bestScore: userStats.bestScore
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas de jogos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar estatísticas quando um jogo é jogado ou criado
app.post('/api/user/update-game-stats', requireAuth, async (req, res) => {
  try {
    const { score, isGameCreation } = req.body;
    
    if (score === undefined || score === null) {
      return res.status(400).json({ error: 'Pontuação é obrigatória' });
    }

    // Buscar ou criar estatísticas do usuário
    let userStats = await UserStats.findOne({ userId: req.session.userId });
    
    if (!userStats) {
      userStats = new UserStats({
        userId: req.session.userId,
        gamesCreated: isGameCreation ? 1 : 0,
        gamesPlayed: isGameCreation ? 0 : 1,
        bestScore: isGameCreation ? 0 : score
      });
    } else {
      if (isGameCreation) {
        userStats.gamesCreated += 1;
      } else {
        userStats.gamesPlayed += 1;
        if (score > userStats.bestScore) {
          userStats.bestScore = score;
        }
      }
      userStats.updatedAt = new Date();
    }
    
    await userStats.save();
    
    res.json({ 
      message: 'Estatísticas atualizadas com sucesso',
      gamesCreated: userStats.gamesCreated,
      gamesPlayed: userStats.gamesPlayed,
      bestScore: userStats.bestScore
    });
  } catch (error) {
    console.error('Erro ao atualizar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

