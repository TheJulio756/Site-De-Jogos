// Utilitários para geração de jogos
class GameGenerator {
  
  // Embaralhar array
  static shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Gerar jogo da memória
  static generateMemoryGame(terms) {
    if (terms.length < 2) {
      throw new Error('Pelo menos 2 termos são necessários para o jogo da memória');
    }

    // Criar pares de cartas (termo e definição)
    const cards = [];
    terms.forEach((term, index) => {
      cards.push({
        id: `term-${index}`,
        type: 'term',
        content: term.term,
        pairId: index
      });
      cards.push({
        id: `definition-${index}`,
        type: 'definition',
        content: term.definition,
        pairId: index
      });
    });

    // Embaralhar as cartas
    const shuffledCards = this.shuffleArray(cards);

    return {
      gameType: 'memory',
      cards: shuffledCards,
      totalPairs: terms.length,
      instructions: 'Encontre os pares correspondentes entre termos e definições'
    };
  }

  // Gerar jogo de associação
  static generateAssociationGame(terms) {
    if (terms.length < 2) {
      throw new Error('Pelo menos 2 termos são necessários para o jogo de associação');
    }

    // Separar termos e definições
    const termsList = terms.map((term, index) => ({
      id: index,
      content: term.term
    }));

    const definitionsList = terms.map((term, index) => ({
      id: index,
      content: term.definition
    }));

    // Embaralhar as definições
    const shuffledDefinitions = this.shuffleArray(definitionsList);

    return {
      gameType: 'association',
      terms: termsList,
      definitions: shuffledDefinitions,
      instructions: 'Arraste cada termo para sua definição correspondente'
    };
  }

  // Gerar jogo de quiz
  static generateQuizGame(terms) {
    if (terms.length < 4) {
      throw new Error('Pelo menos 4 termos são necessários para o jogo de quiz');
    }

    const questions = [];

    terms.forEach((term, index) => {
      // Criar alternativas incorretas (definições de outros termos)
      const wrongAnswers = terms
        .filter((_, i) => i !== index)
        .map(t => t.definition)
        .slice(0, 3); // Pegar até 3 alternativas incorretas

      // Embaralhar as alternativas
      const allAnswers = this.shuffleArray([
        term.definition, // Resposta correta
        ...wrongAnswers
      ]);

      // Encontrar o índice da resposta correta
      const correctAnswerIndex = allAnswers.findIndex(answer => answer === term.definition);

      questions.push({
        id: index,
        question: term.term,
        answers: allAnswers,
        correctAnswer: correctAnswerIndex,
        explanation: `A definição correta de "${term.term}" é: ${term.definition}`
      });
    });

    // Embaralhar as perguntas
    const shuffledQuestions = this.shuffleArray(questions);

    return {
      gameType: 'quiz',
      questions: shuffledQuestions,
      totalQuestions: questions.length,
      instructions: 'Selecione a definição correta para cada termo apresentado'
    };
  }

  // Gerar jogo baseado no tipo
  static generateGame(gameType, terms) {
    switch (gameType) {
      case 'memory':
        return this.generateMemoryGame(terms);
      case 'association':
        return this.generateAssociationGame(terms);
      case 'quiz':
        return this.generateQuizGame(terms);
      case 'word-search':
        return this.generateWordSearchGame(terms);
      default:
        throw new Error(`Tipo de jogo não suportado: ${gameType}`);
    }
  }

  // Validar pontuação do jogo da memória
  static calculateMemoryScore(totalPairs, correctPairs, timeInSeconds) {
    const baseScore = correctPairs * 100;
    const timeBonus = Math.max(0, 300 - timeInSeconds); // Bônus por tempo (máximo 5 minutos)
    const accuracyBonus = correctPairs === totalPairs ? 200 : 0; // Bônus por completar
    
    return Math.round(baseScore + timeBonus + accuracyBonus);
  }

  // Validar pontuação do jogo de associação
  static calculateAssociationScore(totalTerms, correctAssociations, timeInSeconds) {
    const baseScore = correctAssociations * 150;
    const timeBonus = Math.max(0, 240 - timeInSeconds); // Bônus por tempo (máximo 4 minutos)
    const accuracyBonus = correctAssociations === totalTerms ? 300 : 0; // Bônus por completar
    
    return Math.round(baseScore + timeBonus + accuracyBonus);
  }

  // Validar pontuação do jogo de quiz
  static calculateQuizScore(totalQuestions, correctAnswers, timeInSeconds) {
    const baseScore = correctAnswers * 200;
    const accuracyPercentage = (correctAnswers / totalQuestions) * 100;
    const accuracyBonus = accuracyPercentage >= 80 ? 400 : accuracyPercentage >= 60 ? 200 : 0;
    const timeBonus = Math.max(0, 180 - timeInSeconds); // Bônus por tempo (máximo 3 minutos)
    
    return Math.round(baseScore + accuracyBonus + timeBonus);
  }

  // Validar pontuação do jogo de caça-palavras
  static calculateWordSearchScore(totalWords, wordsFound, timeInSeconds) {
    const baseScore = wordsFound * 250;
    const accuracyPercentage = (wordsFound / totalWords) * 100;
    const accuracyBonus = accuracyPercentage >= 90 ? 500 : accuracyPercentage >= 70 ? 300 : 0;
    const timeBonus = Math.max(0, 600 - timeInSeconds); // Bônus por tempo (máximo 10 minutos)
    
    return Math.round(baseScore + accuracyBonus + timeBonus);
  }

  // Gerar jogo de caça-palavras
  static generateWordSearchGame(terms) {
    if (terms.length < 5) {
      throw new Error('Pelo menos 5 termos são necessários para o jogo de caça-palavras');
    }

    const words = terms.map(t => t.term.toUpperCase());
    const gridSize = 15; // Tamanho da grade para o caça-palavras
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

    // Função auxiliar para verificar se uma palavra pode ser colocada
    function canPlaceWord(word, r, c, dr, dc) {
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return false;
      if (r + word.length * dr >= gridSize || c + word.length * dc >= gridSize) return false;

      for (let i = 0; i < word.length; i++) {
        const newR = r + i * dr;
        const newC = c + i * dc;
        if (grid[newR][newC] !== '' && grid[newR][newC] !== word[i]) {
          return false;
        }
      }
      return true;
    }

    // Função auxiliar para colocar uma palavra na grade
    function placeWord(word, r, c, dr, dc) {
      for (let i = 0; i < word.length; i++) {
        grid[r + i * dr][c + i * dc] = word[i];
      }
    }

    const directions = [
      [0, 1],   // Horizontal
      [1, 0],   // Vertical
      [1, 1],   // Diagonal principal
      [1, -1]   // Diagonal secundária
    ];

    const placedWords = [];

    // Tentar colocar cada palavra
    for (const word of words) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) { // Limitar tentativas para evitar loop infinito
        const r = Math.floor(Math.random() * gridSize);
        const c = Math.floor(Math.random() * gridSize);
        const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];

        if (canPlaceWord(word, r, c, dr, dc)) {
          placeWord(word, r, c, dr, dc);
          placedWords.push(word);
          placed = true;
        }
        attempts++;
      }
    }

    // Preencher espaços vazios com letras aleatórias
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (grid[r][c] === '') {
          grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    return {
      gameType: 'word-search',
      grid: grid,
      words: placedWords,
      instructions: 'Encontre as palavras escondidas na grade'
    };
  }

  // Calcular pontuação baseada no tipo de jogo
  static calculateScore(gameType, gameData) {
    switch (gameType) {
      case 'memory':
        return this.calculateMemoryScore(
          gameData.totalPairs,
          gameData.correctPairs,
          gameData.timeInSeconds
        );
      case 'association':
        return this.calculateAssociationScore(
          gameData.totalTerms,
          gameData.correctAssociations,
          gameData.timeInSeconds
        );
      case 'quiz':
        return this.calculateQuizScore(
          gameData.totalQuestions,
          gameData.correctAnswers,
          gameData.timeInSeconds
        );
      case 'word-search':
        return this.calculateWordSearchScore(
          gameData.totalWords,
          gameData.wordsFound,
          gameData.timeInSeconds
        );
      default:
        return 0;
    }
  }
}

module.exports = GameGenerator;


