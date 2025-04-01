class BoatGame extends Game {
    constructor() {
        super();
        this.setupCanvas();
        this.setupEventListeners();
        this.boat = {
            x: 100,
            y: this.canvas.height / 2,
            width: 60,
            height: 30,
            speed: 5
        };
        this.obstacles = [];
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
            if (e.key === 'ArrowUp') {
                this.boat.y -= this.boat.speed;
            } else if (e.key === 'ArrowDown') {
                this.boat.y += this.boat.speed;
            }
        });
    }

    generateObstacle() {
        const obstacle = {
            x: this.canvas.width,
            y: Math.random() * (this.canvas.height - 50),
            width: 30,
            height: 50,
            speed: 3 + this.currentLevel
        };
        this.obstacles.push(obstacle);
    }

    update() {
        if (this.isGameOver) return;

        // Keep boat within canvas bounds
        this.boat.y = Math.max(0, Math.min(this.canvas.height - this.boat.height, this.boat.y));

        // Generate obstacles
        if (Math.random() < 0.02) {
            this.generateObstacle();
        }

        // Update obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.x -= obstacle.speed;
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(index, 1);
                this.score += 10;
                this.updateScore(10);
            }
        });

        // Check collisions
        this.obstacles.forEach(obstacle => {
            if (this.checkCollision(this.boat, obstacle)) {
                this.lives--;
                this.updateLives();
                if (this.lives <= 0) {
                    this.endGame();
                }
            }
        });

        // Level progression
        if (this.score >= this.currentLevel * 100) {
            this.currentLevel++;
            this.updateLevel();
        }
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
        this.ctx.fillStyle = '#0077BE';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw boat
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(this.boat.x, this.boat.y, this.boat.width, this.boat.height);

        // Draw obstacles
        this.ctx.fillStyle = '#FF0000';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    restartGame() {
        super.restartGame();
        this.obstacles = [];
        this.boat.y = this.canvas.height / 2;
    }
} 