class GameMenu {
    constructor() {
        this.currentGame = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('typingGame').addEventListener('click', () => {
            this.startGame('typing');
        });

        document.getElementById('boatGame').addEventListener('click', () => {
            this.startGame('boat');
        });

        document.getElementById('minecraftGame').addEventListener('click', () => {
            this.startGame('minecraft');
        });

        document.getElementById('menuButton').addEventListener('click', () => {
            this.returnToMenu();
        });
    }

    startGame(gameType) {
        // Hide menu, show game UI
        document.getElementById('gameMenu').style.display = 'none';
        document.getElementById('gameUI').style.display = 'block';
        
        // Hide game over display
        document.getElementById('gameOver').style.display = 'none';

        // Stop current game if exists
        if (this.currentGame) {
            this.currentGame.gameOver = true;
        }

        // Start new game
        switch(gameType) {
            case 'typing':
                this.currentGame = new Game();
                break;
            case 'boat':
                this.currentGame = new BoatGame();
                break;
            case 'minecraft':
                this.currentGame = new MinecraftGame();
                break;
        }
    }

    returnToMenu() {
        // Stop current game
        if (this.currentGame) {
            this.currentGame.gameOver = true;
            this.currentGame = null;
        }

        // Hide game UI and game over, show menu
        document.getElementById('gameUI').style.display = 'none';
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('gameMenu').style.display = 'block';
    }
}

// Initialize menu when page loads
window.onload = () => {
    new GameMenu();
}; 