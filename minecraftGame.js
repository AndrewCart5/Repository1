class MinecraftGame extends Game {
    constructor() {
        super();
        this.setupCanvas();
        this.setupEventListeners();
        this.blocks = [];
        this.currentBlockType = 'grass';
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
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.player.x -= 5;
            } else if (e.key === 'ArrowRight') {
                this.player.x += 5;
            } else if (e.key === ' ') {
                this.player.y -= 10;
            } else if (e.key >= '1' && e.key <= '4') {
                const types = ['grass', 'dirt', 'stone', 'wood'];
                this.currentBlockType = types[parseInt(e.key) - 1];
            }
        });

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.placeBlock(x, y);
        });
    }

    createBlock(type, position) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const materials = [
            this.materials[type].side,  // right
            this.materials[type].side,  // left
            this.materials[type].top,   // top
            this.materials[type].bottom, // bottom
            this.materials[type].side,  // front
            this.materials[type].side   // back
        ];
        
        const mesh = new THREE.Mesh(geometry, materials);
        mesh.position.set(position.x, position.y, position.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }

    generateLevel() {
        // Clear existing blocks
        this.blocks.forEach(block => this.scene.remove(block));
        this.blocks = [];
        
        // Generate ground
        for (let x = -10; x <= 10; x++) {
            for (let z = -10; z <= 10; z++) {
                // Grass layer
                const grassBlock = this.createBlock('grass', { x, y: -1, z });
                this.blocks.push(grassBlock);
                
                // Dirt layer
                const dirtBlock = this.createBlock('dirt', { x, y: -2, z });
                this.blocks.push(dirtBlock);
                
                // Stone layer
                const stoneBlock = this.createBlock('stone', { x, y: -3, z });
                this.blocks.push(stoneBlock);
            }
        }
        
        // Add blocks to scene
        this.blocks.forEach(block => this.scene.add(block));
        
        // Generate random blocks based on level
        const numBlocks = 5 + this.currentLevel * 2;
        for (let i = 0; i < numBlocks; i++) {
            const x = Math.floor(Math.random() * 20) - 10;
            const y = Math.floor(Math.random() * 5);
            const z = Math.floor(Math.random() * 20) - 10;
            const types = Object.keys(this.materials);
            const type = types[Math.floor(Math.random() * types.length)];
            
            const block = this.createBlock(type, { x, y, z });
            this.blocks.push(block);
            this.scene.add(block);
        }
    }

    placeBlock(x, y) {
        const gridX = Math.floor(x / 32);
        const gridY = Math.floor(y / 32);
        const block = this.createBlock(this.currentBlockType, { x: gridX, y: gridY, z: 0 });
        this.blocks.push(block);
        this.scene.add(block);
    }

    update() {
        if (this.isGameOver) return;

        // Apply gravity to player
        this.player.y += 0.5;

        // Check collisions
        this.checkCollisions();

        // Level progression
        if (this.blocks.length >= this.currentLevel * 20) {
            this.currentLevel++;
            this.updateLevel();
            this.generateLevel();
        }
    }

    checkCollisions() {
        this.blocks.forEach(block => {
            if (this.checkCollision(this.player, block)) {
                this.player.y = block.position.y - this.player.height;
            }
        });
    }

    checkCollision(player, block) {
        return player.x < block.position.x + 1 &&
               player.x + player.width > block.position.x &&
               player.y < block.position.y + 1 &&
               player.y + player.height > block.position.y;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw sky
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw blocks
        this.blocks.forEach(block => {
            this.ctx.fillStyle = this.getBlockColor(block.type);
            this.ctx.fillRect(
                block.position.x * 32,
                block.position.y * 32,
                32,
                32
            );
        });

        // Draw player
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(
            this.player.x * 32,
            this.player.y * 32,
            32,
            32
        );

        // Draw selected block type
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(10, 10, 32, 32);
        this.ctx.fillStyle = this.getBlockColor(this.currentBlockType);
        this.ctx.fillRect(12, 12, 28, 28);
    }

    getBlockColor(type) {
        const colors = {
            grass: '#4CAF50',
            dirt: '#8B4513',
            stone: '#808080',
            wood: '#8B4513'
        };
        return colors[type] || '#000000';
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    restartGame() {
        super.restartGame();
        this.blocks = [];
        this.generateLevel();
    }
} 