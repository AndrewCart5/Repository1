class Obstacle {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
    }
}

class BoatGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.lives = 3;
        this.obstacles = [];
        this.gameOver = false;
        this.currentLevel = 1;
        this.boat = {
            x: 100,
            y: 300,
            width: 60,
            height: 30,
            speed: 5
        };
        
        this.setupCanvas();
        this.setupEventListeners();
        this.startGame();
    }

    setupCanvas() {
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    this.boat.y = Math.max(0, this.boat.y - this.boat.speed);
                    break;
                case 'ArrowDown':
                    this.boat.y = Math.min(this.canvas.height - this.boat.height, this.boat.y + this.boat.speed);
                    break;
            }
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.restartGame();
        });
    }

    startGame() {
        this.gameLoop();
        this.spawnObstacle();
        this.updateLevelDisplay();
    }

    spawnObstacle() {
        if (this.gameOver) return;
        
        const baseSpeed = 3;
        const speedMultiplier = 1 + (this.currentLevel - 1) * 0.2;
        const speed = baseSpeed * speedMultiplier;
        
        const obstacle = new Obstacle(
            this.canvas.width,
            Math.random() * (this.canvas.height - 50),
            30,
            50,
            speed
        );
        
        this.obstacles.push(obstacle);
        
        // Decrease spawn delay with each level
        const baseDelay = 2000;
        const delayMultiplier = 1 - (this.currentLevel - 1) * 0.1;
        const delay = (baseDelay + Math.random() * 1000) * delayMultiplier;
        
        setTimeout(() => this.spawnObstacle(), delay);
    }

    update() {
        if (this.gameOver) return;

        // Update obstacle positions
        this.obstacles.forEach((obstacle, index) => {
            obstacle.x -= obstacle.speed;
            
            // Check collision
            if (this.checkCollision(this.boat, obstacle)) {
                this.lives--;
                this.updateLives();
                this.obstacles.splice(index, 1);
                
                if (this.lives <= 0) {
                    this.endGame();
                }
            }
            // Remove obstacles that are off screen
            else if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(index, 1);
                this.score += 10;
                this.updateScore();
                
                // Check if level is complete
                if (this.score >= this.currentLevel * 100) {
                    this.nextLevel();
                }
            }
        });
    }

    checkCollision(boat, obstacle) {
        return boat.x < obstacle.x + obstacle.width &&
               boat.x + boat.width > obstacle.x &&
               boat.y < obstacle.y + obstacle.height &&
               boat.y + boat.height > obstacle.y;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw water background
        this.ctx.fillStyle = '#0077be';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw boat
        this.ctx.fillStyle = '#8b4513';
        this.ctx.fillRect(this.boat.x, this.boat.y, this.boat.width, this.boat.height);
        
        // Draw obstacles
        this.ctx.fillStyle = '#ff4444';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
        
        // Draw level progress
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Level ${this.currentLevel} - Score: ${this.score}/${this.currentLevel * 100}`, 
            this.canvas.width / 2, 30);
    }

    nextLevel() {
        this.currentLevel++;
        this.obstacles = []; // Clear existing obstacles
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
        this.obstacles = [];
        this.gameOver = false;
        this.currentLevel = 1;
        this.boat.y = 300;
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