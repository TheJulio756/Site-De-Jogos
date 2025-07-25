class WordSearchGame {
    constructor() {
        this.gridSize = 15;
        this.grid = [];
        this.words = [];
        this.foundWords = [];
        this.selectedCells = [];
        this.isSelecting = false;
        this.startTime = null;
        this.timer = null;
        this.score = 0;
        this.hintsUsed = 0;
        
        this.initializeGame();
    }

    async initializeGame() {
        try {
            // Buscar termos do usuário
            const response = await fetch('/api/terms');
            if (response.ok) {
                const terms = await response.json();
                if (terms.length === 0) {
                    alert('Você precisa cadastrar alguns termos primeiro!');
                    window.location.href = '/terms.html';
                    return;
                }
                
                // Selecionar até 10 termos aleatórios
                this.words = this.selectRandomTerms(terms, 10);
                this.setupEventListeners();
                this.startNewGame();
            } else {
                throw new Error('Erro ao carregar termos');
            }
        } catch (error) {
            console.error('Erro ao inicializar jogo:', error);
            alert('Erro ao carregar o jogo. Tente novamente.');
        }
    }

    selectRandomTerms(terms, maxCount) {
        const shuffled = terms.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(maxCount, terms.length)).map(term => ({
            word: term.term.toUpperCase().replace(/\s+/g, ''),
            definition: term.definition,
            originalTerm: term.term
        }));
    }

    setupEventListeners() {
        document.getElementById('new-game-btn').addEventListener('click', () => this.startNewGame());
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        document.getElementById('play-again-btn').addEventListener('click', () => this.startNewGame());
        document.getElementById('close-modal-btn').addEventListener('click', () => this.closeModal());
        
        // Event listeners para seleção de células
        document.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    startNewGame() {
        this.foundWords = [];
        this.selectedCells = [];
        this.score = 0;
        this.hintsUsed = 0;
        this.startTime = Date.now();
        
        this.createGrid();
        this.placeWords();
        this.fillEmptyCells();
        this.renderGrid();
        this.renderWordList();
        this.renderDefinitions();
        this.updateUI();
        this.startTimer();
        this.closeModal();
    }

    createGrid() {
        this.grid = Array(this.gridSize).fill().map(() => Array(this.gridSize).fill(''));
    }

    placeWords() {
        const directions = [
            [0, 1],   // horizontal
            [1, 0],   // vertical
            [1, 1],   // diagonal down-right
            [1, -1],  // diagonal down-left
            [0, -1],  // horizontal reverse
            [-1, 0],  // vertical reverse
            [-1, -1], // diagonal up-left
            [-1, 1]   // diagonal up-right
        ];

        for (const wordObj of this.words) {
            const word = wordObj.word;
            let placed = false;
            let attempts = 0;
            
            while (!placed && attempts < 100) {
                const direction = directions[Math.floor(Math.random() * directions.length)];
                const startRow = Math.floor(Math.random() * this.gridSize);
                const startCol = Math.floor(Math.random() * this.gridSize);
                
                if (this.canPlaceWord(word, startRow, startCol, direction)) {
                    this.placeWord(word, startRow, startCol, direction);
                    wordObj.positions = this.getWordPositions(word, startRow, startCol, direction);
                    placed = true;
                }
                attempts++;
            }
            
            if (!placed) {
                console.warn(`Não foi possível colocar a palavra: ${word}`);
            }
        }
    }

    canPlaceWord(word, row, col, direction) {
        const [dRow, dCol] = direction;
        
        for (let i = 0; i < word.length; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            
            if (newRow < 0 || newRow >= this.gridSize || newCol < 0 || newCol >= this.gridSize) {
                return false;
            }
            
            const currentCell = this.grid[newRow][newCol];
            if (currentCell !== '' && currentCell !== word[i]) {
                return false;
            }
        }
        
        return true;
    }

    placeWord(word, row, col, direction) {
        const [dRow, dCol] = direction;
        
        for (let i = 0; i < word.length; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            this.grid[newRow][newCol] = word[i];
        }
    }

    getWordPositions(word, row, col, direction) {
        const [dRow, dCol] = direction;
        const positions = [];
        
        for (let i = 0; i < word.length; i++) {
            const newRow = row + i * dRow;
            const newCol = col + i * dCol;
            positions.push([newRow, newCol]);
        }
        
        return positions;
    }

    fillEmptyCells() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                if (this.grid[row][col] === '') {
                    this.grid[row][col] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
    }

    renderGrid() {
        const gridElement = document.getElementById('word-grid');
        gridElement.innerHTML = '';
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = this.grid[row][col];
                cell.dataset.row = row;
                cell.dataset.col = col;
                gridElement.appendChild(cell);
            }
        }
    }

    renderWordList() {
        const wordListElement = document.getElementById('word-list');
        wordListElement.innerHTML = '';
        
        this.words.forEach((wordObj, index) => {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item';
            wordItem.textContent = wordObj.originalTerm;
            wordItem.dataset.index = index;
            
            if (this.foundWords.includes(wordObj.word)) {
                wordItem.classList.add('found');
            }
            
            wordListElement.appendChild(wordItem);
        });
        
        document.getElementById('total-count').textContent = this.words.length;
        document.getElementById('found-count').textContent = this.foundWords.length;
    }

    renderDefinitions() {
        const definitionsElement = document.getElementById('definitions-list');
        definitionsElement.innerHTML = '';
        
        this.words.forEach((wordObj, index) => {
            const defItem = document.createElement('div');
            defItem.className = 'definition-item';
            defItem.innerHTML = `<strong>${wordObj.originalTerm}:</strong> ${wordObj.definition}`;
            defItem.dataset.index = index;
            definitionsElement.appendChild(defItem);
        });
    }

    handleMouseDown(e) {
        if (e.target.classList.contains('grid-cell')) {
            this.isSelecting = true;
            this.selectedCells = [e.target];
            this.updateCellSelection();
        }
    }

    handleMouseMove(e) {
        if (this.isSelecting && e.target.classList.contains('grid-cell')) {
            const startCell = this.selectedCells[0];
            const endCell = e.target;
            
            this.selectedCells = this.getCellsInLine(startCell, endCell);
            this.updateCellSelection();
        }
    }

    handleMouseUp(e) {
        if (this.isSelecting) {
            this.isSelecting = false;
            this.checkSelectedWord();
        }
    }

    getCellsInLine(startCell, endCell) {
        const startRow = parseInt(startCell.dataset.row);
        const startCol = parseInt(startCell.dataset.col);
        const endRow = parseInt(endCell.dataset.row);
        const endCol = parseInt(endCell.dataset.col);
        
        const cells = [];
        const rowDiff = endRow - startRow;
        const colDiff = endCol - startCol;
        
        // Verificar se é uma linha válida (horizontal, vertical ou diagonal)
        if (rowDiff === 0 || colDiff === 0 || Math.abs(rowDiff) === Math.abs(colDiff)) {
            const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));
            const rowStep = steps === 0 ? 0 : rowDiff / steps;
            const colStep = steps === 0 ? 0 : colDiff / steps;
            
            for (let i = 0; i <= steps; i++) {
                const row = startRow + Math.round(i * rowStep);
                const col = startCol + Math.round(i * colStep);
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                if (cell) cells.push(cell);
            }
        } else {
            cells.push(startCell);
        }
        
        return cells;
    }

    updateCellSelection() {
        // Limpar seleção anterior
        document.querySelectorAll('.grid-cell.selected').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        // Aplicar nova seleção
        this.selectedCells.forEach(cell => {
            cell.classList.add('selected');
        });
    }

    checkSelectedWord() {
        const selectedWord = this.selectedCells.map(cell => cell.textContent).join('');
        const reversedWord = selectedWord.split('').reverse().join('');
        
        for (const wordObj of this.words) {
            if ((wordObj.word === selectedWord || wordObj.word === reversedWord) && 
                !this.foundWords.includes(wordObj.word)) {
                
                this.foundWords.push(wordObj.word);
                this.selectedCells.forEach(cell => {
                    cell.classList.remove('selected');
                    cell.classList.add('found');
                });
                
                this.score += wordObj.word.length * 10;
                this.updateUI();
                this.renderWordList();
                
                // Tocar som de sucesso
                this.playSound('select');
                
                if (this.foundWords.length === this.words.length) {
                    this.gameComplete();
                }
                return;
            }
        }
        
        // Palavra não encontrada - limpar seleção
        this.selectedCells.forEach(cell => {
            cell.classList.remove('selected');
        });
        this.selectedCells = [];
    }

    showHint() {
        const unFoundWords = this.words.filter(wordObj => !this.foundWords.includes(wordObj.word));
        
        if (unFoundWords.length === 0) return;
        
        const randomWord = unFoundWords[Math.floor(Math.random() * unFoundWords.length)];
        const firstPosition = randomWord.positions[0];
        
        const cell = document.querySelector(`[data-row="${firstPosition[0]}"][data-col="${firstPosition[1]}"]`);
        if (cell) {
            cell.classList.add('hint');
            setTimeout(() => {
                cell.classList.remove('hint');
            }, 2000);
        }
        
        this.hintsUsed++;
        this.score = Math.max(0, this.score - 50); // Penalidade por usar dica
        this.updateUI();
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('found-count').textContent = this.foundWords.length;
    }

    gameComplete() {
        clearInterval(this.timer);
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Bônus por tempo
        const timeBonus = Math.max(0, 300 - elapsed) * 2; // Bônus por completar em menos de 5 minutos
        this.score += timeBonus;
        
        document.getElementById('final-time').textContent = timeString;
        document.getElementById('final-score').textContent = this.score;
        
        // Salvar resultado
        this.saveGameResult(elapsed);
        
        // Mostrar modal
        document.getElementById('game-complete-modal').classList.remove('hidden');
        
        // Tocar som de vitória
        this.playSound('win');
    }

    async saveGameResult(gameTime) {
        try {
            const user = await fetch('/api/user').then(r => r.json());
            const playerName = user.username || 'Jogador';
            
            await fetch('/api/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gameType: 'word-search',
                    playerName: playerName,
                    score: this.score,
                    correctAnswers: this.foundWords.length,
                    wrongAnswers: this.hintsUsed,
                    gameTime: gameTime
                })
            });
        } catch (error) {
            console.error('Erro ao salvar resultado:', error);
        }
    }

    closeModal() {
        document.getElementById('game-complete-modal').classList.add('hidden');
    }

    playSound(soundName) {
        try {
            const audio = new Audio(`../sounds/${soundName}.wav`);
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Erro ao tocar som:', e));
        } catch (error) {
            console.log('Som não disponível:', error);
        }
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new WordSearchGame();
});

