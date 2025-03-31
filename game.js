class Word {
    constructor(text, x, y, speed) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 0;
        this.height = 0;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.lives = 3;
        this.words = [];
        this.currentInput = '';
        this.gameOver = false;
        this.currentLevel = 1;
        this.wordsPerLevel = 10;
        this.wordsTypedInLevel = 0;
        
        // Word lists for different levels
        this.wordLists = {
            1: ['hello', 'world', 'coding', 'game', 'fun', 'play', 'type', 'fast',
                'quick', 'speed', 'skill', 'learn', 'practice', 'improve', 'master'],
            2: ['programming', 'computer', 'keyboard', 'developer', 'software',
                'database', 'network', 'system', 'application', 'interface'],
            3: ['algorithm', 'functionality', 'implementation', 'architecture',
                'framework', 'optimization', 'integration', 'deployment', 'maintenance'],
            4: ['encryption', 'authentication', 'authorization', 'configuration',
                'documentation', 'validation', 'initialization', 'synchronization'],
            5: ['infrastructure', 'virtualization', 'containerization', 'microservices',
                'distributed', 'redundancy', 'scalability', 'performance']
        };
        
        this.setupCanvas();
        this.setupEventListeners();
        this.startGame();
    }

    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.checkWord();
                this.currentInput = '';
            } else if (e.key === 'Backspace') {
                this.currentInput = this.currentInput.slice(0, -1);
            } else if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
                this.currentInput += e.key.toLowerCase();
            }
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.restartGame();
        });
    }

    startGame() {
        this.gameLoop();
        this.spawnWord();
        this.updateLevelDisplay();
    }

    spawnWord() {
        if (this.gameOver) return;
        
        const wordList = this.wordLists[this.currentLevel];
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        const x = Math.random() * (this.canvas.width - 100) + 50;
        const y = -30;
        
        // Increase speed with each level
        const baseSpeed = 1;
        const speedMultiplier = 1 + (this.currentLevel - 1) * 0.3;
        const speed = (baseSpeed + Math.random() * 0.5) * speedMultiplier;
        
        this.words.push(new Word(word, x, y, speed));
        
        // Decrease spawn delay with each level
        const baseDelay = 2000;
        const delayMultiplier = 1 - (this.currentLevel - 1) * 0.1;
        const delay = (baseDelay + Math.random() * 1000) * delayMultiplier;
        
        setTimeout(() => this.spawnWord(), delay);
    }

    update() {
        if (this.gameOver) return;

        // Update word positions
        this.words.forEach((word, index) => {
            word.y += word.speed;
            
            // Check if word reached bottom
            if (word.y > this.canvas.height + 30) {
                this.words.splice(index, 1);
                this.lives--;
                this.updateLives();
                
                if (this.lives <= 0) {
                    this.endGame();
                }
            }
        });
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw words
        this.words.forEach(word => {
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(word.text, word.x, word.y);
        });
        
        // Draw current input
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillText(this.currentInput, this.canvas.width / 2, this.canvas.height - 50);
        
        // Draw level progress
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Level ${this.currentLevel} - Words: ${this.wordsTypedInLevel}/${this.wordsPerLevel}`, 
            this.canvas.width / 2, 30);
    }

    checkWord() {
        const wordIndex = this.words.findIndex(word => word.text === this.currentInput);
        if (wordIndex !== -1) {
            this.words.splice(wordIndex, 1);
            this.score += 10;
            this.wordsTypedInLevel++;
            this.updateScore();
            
            // Check if level is complete
            if (this.wordsTypedInLevel >= this.wordsPerLevel) {
                this.nextLevel();
            }
        }
    }

    nextLevel() {
        this.currentLevel++;
        this.wordsTypedInLevel = 0;
        this.words = []; // Clear existing words
        this.updateLevelDisplay();
        
        // Add bonus points for completing level
        const levelBonus = this.currentLevel * 50;
        this.score += levelBonus;
        this.updateScore();
        
        // Show level complete message
        this.showLevelCompleteMessage();
    }

    showLevelCompleteMessage() {
        const message = `Level ${this.currentLevel - 1} Complete! +${(this.currentLevel - 1) * 50} bonus points!`;
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.font = '36px Arial';
        this.ctx.fillText(message, this.canvas.width / 2, this.canvas.height / 2);
        
        // Hide message after 2 seconds
        setTimeout(() => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }, 2000);
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    updateLives() {
        document.getElementById('lives').textContent = this.lives;
    }

    updateLevelDisplay() {
        document.getElementById('level').textContent = this.currentLevel;
    }

    endGame() {
        this.gameOver = true;
        document.getElementById('gameOver').style.display = 'block';
        document.getElementById('finalScore').textContent = this.score;
    }

    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.words = [];
        this.currentInput = '';
        this.gameOver = false;
        this.currentLevel = 1;
        this.wordsTypedInLevel = 0;
        document.getElementById('gameOver').style.display = 'none';
        this.updateScore();
        this.updateLives();
        this.updateLevelDisplay();
        this.startGame();
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.onload = () => {
    new Game();
}; 