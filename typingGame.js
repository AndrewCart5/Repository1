class TypingGame extends Game {
    constructor() {
        super();
        this.words = [
            "programming", "javascript", "computer", "keyboard", "monitor",
            "software", "hardware", "network", "database", "algorithm",
            "function", "variable", "constant", "string", "number",
            "boolean", "array", "object", "class", "method"
        ];
        this.currentWord = "";
        this.setupCanvas();
        this.setupEventListeners();
        this.generateWord();
        this.gameLoop();
    }

    setupCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const input = document.getElementById('wordInput');
                if (input && input.value.trim()) {
                    this.checkWord(input.value.trim());
                    input.value = '';
                }
            }
        });
    }

    generateWord() {
        this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
        this.updateUI();
    }

    updateUI() {
        const gameUI = document.getElementById('gameUI');
        if (!gameUI) return;

        // Keep the existing score, lives, and level containers
        const scoreContainer = document.querySelector('.score-container');
        const livesContainer = document.querySelector('.lives-container');
        const levelContainer = document.querySelector('.level-container');

        // Add the game-specific UI
        const gameContent = document.createElement('div');
        gameContent.className = 'typing-game-content';
        gameContent.innerHTML = `
            <div class="word-display">
                <h2>${this.currentWord}</h2>
            </div>
            <div class="input-container">
                <input type="text" id="wordInput" placeholder="Type the word...">
            </div>
        `;

        // Clear previous content and add new content
        gameUI.innerHTML = '';
        gameUI.appendChild(scoreContainer);
        gameUI.appendChild(livesContainer);
        gameUI.appendChild(levelContainer);
        gameUI.appendChild(gameContent);
    }

    checkWord(input) {
        if (input.toLowerCase() === this.currentWord.toLowerCase()) {
            this.updateScore(10);
            this.showMessage('Correct!', 'success');
            this.currentLevel++;
            this.updateLevel();
            this.generateWord();
        } else {
            this.lives--;
            this.updateLives();
            this.showMessage('Wrong! Try again!', 'error');
            
            if (this.lives <= 0) {
                this.endGame();
            }
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 2000);
    }

    endGame() {
        super.endGame();
    }

    restartGame() {
        super.restartGame();
        this.generateWord();
    }

    gameLoop() {
        if (!this.isGameOver) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
} 