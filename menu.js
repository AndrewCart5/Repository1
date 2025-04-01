class GameMenu {
    constructor() {
        this.currentGame = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('typingGame').addEventListener('click', () => this.startGame('typing'));
        document.getElementById('boatGame').addEventListener('click', () => this.startGame('boat'));
        document.getElementById('minecraftGame').addEventListener('click', () => this.startGame('minecraft'));
        document.getElementById('cityGuesser').addEventListener('click', () => this.startGame('city'));
        document.getElementById('menuButton').addEventListener('click', () => this.showMenu());
        document.getElementById('restartButton').addEventListener('click', () => this.restartGame());
    }

    startGame(gameType) {
        // Hide menu and show game UI
        document.getElementById('gameMenu').style.display = 'none';
        document.getElementById('gameUI').style.display = 'block';
        document.getElementById('gameOver').style.display = 'none';

        // Initialize the selected game
        switch(gameType) {
            case 'typing':
                this.currentGame = new TypingGame();
                break;
            case 'boat':
                this.currentGame = new BoatGame();
                break;
            case 'minecraft':
                this.currentGame = new MinecraftGame();
                break;
            case 'city':
                this.currentGame = new CityGuesser();
                break;
        }
    }

    showMenu() {
        // Hide game UI and show menu
        document.getElementById('gameUI').style.display = 'none';
        document.getElementById('gameMenu').style.display = 'block';
        document.getElementById('gameOver').style.display = 'none';
        
        // Clean up current game if it exists
        if (this.currentGame) {
            this.currentGame = null;
        }
    }

    restartGame() {
        if (this.currentGame) {
            this.currentGame.restartGame();
            document.getElementById('gameOver').style.display = 'none';
        }
    }
}

// Initialize the menu when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gameMenu = new GameMenu();
}); 