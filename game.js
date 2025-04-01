class Game {
    constructor() {
        this.score = 0;
        this.currentLevel = 1;
        this.lives = 3;
        this.isGameOver = false;
    }

    updateScore(points) {
        this.score += points;
        document.getElementById('score').textContent = this.score;
    }

    updateLives() {
        document.getElementById('lives').textContent = this.lives;
    }

    updateLevel() {
        document.getElementById('level').textContent = this.currentLevel;
    }

    endGame() {
        this.isGameOver = true;
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
    }

    restartGame() {
        this.score = 0;
        this.currentLevel = 1;
        this.lives = 3;
        this.isGameOver = false;
        document.getElementById('gameOver').style.display = 'none';
        this.updateScore(0);
        this.updateLives();
        this.updateLevel();
    }
} 