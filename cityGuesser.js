class CityGuesser extends Game {
    constructor() {
        super();
        this.currentCity = null;
        this.cities = [
            {
                name: "Paris",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/800px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg",
                hints: ["Eiffel Tower", "France", "City of Light"],
                options: ["Paris", "London", "New York", "Tokyo"]
            },
            {
                name: "New York",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/800px-New_york_times_square-terabass.jpg",
                hints: ["Big Apple", "Statue of Liberty", "Times Square"],
                options: ["New York", "Chicago", "Los Angeles", "Miami"]
            },
            {
                name: "Tokyo",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Tokyo_Shinjuku_Gyoen_03.jpg/800px-Tokyo_Shinjuku_Gyoen_03.jpg",
                hints: ["Mount Fuji", "Japan", "Shibuya Crossing"],
                options: ["Tokyo", "Seoul", "Beijing", "Shanghai"]
            },
            {
                name: "London",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/London_Big_Ben_Phone_box.jpg/800px-London_Big_Ben_Phone_box.jpg",
                hints: ["Big Ben", "United Kingdom", "Buckingham Palace"],
                options: ["London", "Paris", "Berlin", "Amsterdam"]
            },
            {
                name: "Sydney",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Sydney_Opera_House_-_Dec_2008.jpg/800px-Sydney_Opera_House_-_Dec_2008.jpg",
                hints: ["Opera House", "Australia", "Harbour Bridge"],
                options: ["Sydney", "Melbourne", "Brisbane", "Perth"]
            },
            {
                name: "Dubai",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Dubai_Marina_Skyline.jpg/800px-Dubai_Marina_Skyline.jpg",
                hints: ["Burj Khalifa", "UAE", "Desert"],
                options: ["Dubai", "Abu Dhabi", "Doha", "Riyadh"]
            },
            {
                name: "Venice",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Venice_Grand_Canal.jpg/800px-Venice_Grand_Canal.jpg",
                hints: ["Canals", "Italy", "Gondolas"],
                options: ["Venice", "Rome", "Florence", "Milan"]
            },
            {
                name: "Rio de Janeiro",
                image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/800px-Christ_the_Redeemer_-_Cristo_Redentor.jpg",
                hints: ["Christ the Redeemer", "Brazil", "Copacabana"],
                options: ["Rio de Janeiro", "São Paulo", "Buenos Aires", "Lima"]
            }
        ];

        this.setupCanvas();
        this.setupEventListeners();
        this.generateLevel();
        this.gameLoop();
    }

    setupCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-button')) {
                this.checkGuess(e.target.textContent);
            }
        });
    }

    generateLevel() {
        // Select a random city
        this.currentCity = this.cities[Math.floor(Math.random() * this.cities.length)];
        
        // Create or update the game UI
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
        gameContent.className = 'city-guesser-content';
        gameContent.innerHTML = `
            <div class="image-container">
                <div class="loading-spinner">Loading image...</div>
                <img src="${this.currentCity.image}" 
                     alt="${this.currentCity.name}" 
                     class="city-image" 
                     onload="this.parentElement.querySelector('.loading-spinner').style.display='none'"
                     onerror="this.onerror=null; this.src='https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/800px-Placeholder_view_vector.svg.png'; this.parentElement.querySelector('.loading-spinner').style.display='none'">
            </div>
            <div class="hints">
                <div class="hint">Hint 1: ${this.currentCity.hints[0]}</div>
                <div class="hint">Hint 2: ${this.currentCity.hints[1]}</div>
                <div class="hint">Hint 3: ${this.currentCity.hints[2]}</div>
            </div>
            <div class="options-container">
                ${this.currentCity.options.map(option => `
                    <button class="option-button">${option}</button>
                `).join('')}
            </div>
        `;

        // Clear previous content and add new content
        gameUI.innerHTML = '';
        gameUI.appendChild(scoreContainer);
        gameUI.appendChild(livesContainer);
        gameUI.appendChild(levelContainer);
        gameUI.appendChild(gameContent);
    }

    checkGuess(guess) {
        if (guess === this.currentCity.name) {
            this.updateScore(100);
            this.showMessage('Correct! Well done!', 'success');
            this.currentLevel++;
            this.updateLevel();
            this.generateLevel();
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
        this.generateLevel();
    }

    gameLoop() {
        if (!this.isGameOver) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }
} 