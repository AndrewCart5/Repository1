class MinecraftGame {
    constructor() {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded! Please wait for the page to load completely.');
            return;
        }

        // Hide the 2D canvas and show the WebGL canvas
        document.getElementById('gameCanvas').style.display = 'none';
        this.canvas = document.getElementById('webglCanvas');
        this.canvas.style.display = 'block';
        
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.currentLevel = 1;
        this.blocks = [];
        this.selectedBlock = 'grass';
        
        // Three.js setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background
        
        // Create camera first
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        
        // Player setup
        this.player = {
            position: new THREE.Vector3(0, 2, 0),
            rotation: new THREE.Euler(0, 0, 0),
            speed: 0.1,
            turnSpeed: 0.02,
            jumpVelocity: 0,
            gravity: 0.01,
            jumping: false
        };
        
        // Block materials
        this.materials = {
            grass: {
                top: new THREE.MeshStandardMaterial({ color: 0x4CAF50 }),
                side: new THREE.MeshStandardMaterial({ color: 0x8B4513 }),
                bottom: new THREE.MeshStandardMaterial({ color: 0x8B4513 })
            },
            dirt: {
                top: new THREE.MeshStandardMaterial({ color: 0x8B4513 }),
                side: new THREE.MeshStandardMaterial({ color: 0x8B4513 }),
                bottom: new THREE.MeshStandardMaterial({ color: 0x8B4513 })
            },
            stone: {
                top: new THREE.MeshStandardMaterial({ color: 0x808080 }),
                side: new THREE.MeshStandardMaterial({ color: 0x808080 }),
                bottom: new THREE.MeshStandardMaterial({ color: 0x808080 })
            },
            wood: {
                top: new THREE.MeshStandardMaterial({ color: 0x8B4513 }),
                side: new THREE.MeshStandardMaterial({ color: 0x8B4513 }),
                bottom: new THREE.MeshStandardMaterial({ color: 0x8B4513 })
            },
            house: {
                top: new THREE.MeshStandardMaterial({ color: 0x8B4513 }),
                side: new THREE.MeshStandardMaterial({ color: 0x8B4513 }),
                bottom: new THREE.MeshStandardMaterial({ color: 0x8B4513 })
            },
            mountain: {
                top: new THREE.MeshStandardMaterial({ color: 0x808080 }),
                side: new THREE.MeshStandardMaterial({ color: 0x808080 }),
                bottom: new THREE.MeshStandardMaterial({ color: 0x808080 })
            },
            water: {
                top: new THREE.MeshStandardMaterial({ 
                    color: 0x0077BE,
                    transparent: true,
                    opacity: 0.8
                }),
                side: new THREE.MeshStandardMaterial({ 
                    color: 0x0077BE,
                    transparent: true,
                    opacity: 0.8
                }),
                bottom: new THREE.MeshStandardMaterial({ 
                    color: 0x0077BE,
                    transparent: true,
                    opacity: 0.8
                })
            },
            snow: {
                top: new THREE.MeshStandardMaterial({ color: 0xFFFFFF }),
                side: new THREE.MeshStandardMaterial({ color: 0xFFFFFF }),
                bottom: new THREE.MeshStandardMaterial({ color: 0xFFFFFF })
            }
        };
        
        // Lighting
        this.setupLighting();
        
        // Add crosshair
        this.crosshair = document.createElement('div');
        this.crosshair.style.position = 'absolute';
        this.crosshair.style.top = '50%';
        this.crosshair.style.left = '50%';
        this.crosshair.style.transform = 'translate(-50%, -50%)';
        this.crosshair.style.width = '20px';
        this.crosshair.style.height = '20px';
        this.crosshair.style.border = '2px solid white';
        this.crosshair.style.borderRadius = '50%';
        this.crosshair.style.pointerEvents = 'none';
        document.body.appendChild(this.crosshair);

        // Add raycaster for block selection
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Set up event listeners
        this.setupEventListeners();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Generate level and start game
        this.generateLevel();
        this.startGame();
    }

    resizeCanvas() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update canvas size
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Update camera aspect ratio
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(width, height);
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            switch(e.key) {
                case 'w':
                    this.player.position.z -= this.player.speed;
                    break;
                case 's':
                    this.player.position.z += this.player.speed;
                    break;
                case 'a':
                    this.player.position.x -= this.player.speed;
                    break;
                case 'd':
                    this.player.position.x += this.player.speed;
                    break;
                case ' ':
                    if (!this.player.jumping) {
                        this.player.jumping = true;
                        this.player.jumpVelocity = -0.2;
                    }
                    break;
                case '1':
                    this.selectedBlock = 'grass';
                    break;
                case '2':
                    this.selectedBlock = 'dirt';
                    break;
                case '3':
                    this.selectedBlock = 'stone';
                    break;
                case '4':
                    this.selectedBlock = 'wood';
                    break;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.gameOver) return;
            
            // Rotate camera based on mouse movement
            this.player.rotation.y -= e.movementX * this.player.turnSpeed;
            this.player.rotation.x -= e.movementY * this.player.turnSpeed;
            
            // Limit vertical rotation
            this.player.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.player.rotation.x));
        });

        // Lock pointer when clicking on canvas
        this.canvas.addEventListener('click', () => {
            this.canvas.requestPointerLock();
        });

        document.getElementById('restartButton').addEventListener('click', () => {
            this.restartGame();
        });

        // Add click handler for block breaking
        this.canvas.addEventListener('click', (e) => {
            if (this.gameOver) return;
            
            // Calculate mouse position in normalized device coordinates
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            // Update the picking ray with the camera and mouse position
            this.raycaster.setFromCamera(this.mouse, this.camera);

            // Calculate objects intersecting the picking ray
            const intersects = this.raycaster.intersectObjects(this.blocks);

            if (intersects.length > 0) {
                // Get the first intersected block
                const block = intersects[0].object;
                
                // Remove the block from the scene and blocks array
                this.scene.remove(block);
                this.blocks = this.blocks.filter(b => b !== block);
                
                // Add points for breaking a block
                this.score += 10;
                this.updateScore();
            }
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

    createHouse(position) {
        const houseBlocks = [];
        const width = 5;
        const height = 4;
        const depth = 5;

        // Create walls
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                for (let z = 0; z < depth; z++) {
                    // Skip interior blocks
                    if (y > 0 && x > 0 && x < width - 1 && z > 0 && z < depth - 1) continue;
                    
                    const block = this.createBlock('house', {
                        x: position.x + x - width/2,
                        y: position.y + y,
                        z: position.z + z - depth/2
                    });
                    houseBlocks.push(block);
                }
            }
        }

        // Add roof
        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {
                const block = this.createBlock('house', {
                    x: position.x + x - width/2,
                    y: position.y + height,
                    z: position.z + z - depth/2
                });
                houseBlocks.push(block);
            }
        }

        // Add door
        const doorX = position.x;
        const doorZ = position.z + depth/2 + 1;
        for (let y = 0; y < 2; y++) {
            const block = this.createBlock('house', {
                x: doorX,
                y: position.y + y,
                z: doorZ
            });
            houseBlocks.push(block);
        }

        return houseBlocks;
    }

    createLake(position, size) {
        const lakeBlocks = [];
        const depth = 3;

        // Create lake bottom
        for (let x = -size; x <= size; x++) {
            for (let z = -size; z <= size; z++) {
                // Create rough edges
                if (Math.random() > 0.8) continue;
                
                for (let y = 0; y < depth; y++) {
                    const block = this.createBlock('water', {
                        x: position.x + x,
                        y: position.y + y,
                        z: position.z + z
                    });
                    lakeBlocks.push(block);
                }
            }
        }

        return lakeBlocks;
    }

    createMountainRange(position, size) {
        const mountainBlocks = [];
        const numMountains = 3;
        const spacing = size / 2;

        for (let i = 0; i < numMountains; i++) {
            const x = position.x + (i - 1) * spacing;
            const z = position.z;
            const mountainSize = size * (0.7 + Math.random() * 0.3);
            const mountainHeight = mountainSize * 2;
            
            // Create mountain shape using layers
            for (let y = 0; y < mountainHeight; y++) {
                const layerSize = mountainSize * (1 - y/mountainHeight);
                for (let mx = -layerSize; mx <= layerSize; mx++) {
                    for (let mz = -layerSize; mz <= layerSize; mz++) {
                        // Create rough edges
                        if (Math.random() > 0.7) continue;
                        
                        // Add snow at the top
                        const material = y > mountainHeight * 0.8 ? 'snow' : 'mountain';
                        const block = this.createBlock(material, {
                            x: x + mx,
                            y: position.y + y,
                            z: z + mz
                        });
                        mountainBlocks.push(block);
                    }
                }
            }
        }

        return mountainBlocks;
    }

    generateLevel() {
        // Clear existing blocks
        this.blocks.forEach(block => this.scene.remove(block));
        this.blocks = [];
        
        // Generate larger ground
        const mapSize = 30; // Increased from 10
        for (let x = -mapSize; x <= mapSize; x++) {
            for (let z = -mapSize; z <= mapSize; z++) {
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
        
        // Generate mountain ranges
        const numRanges = 2 + this.currentLevel;
        for (let i = 0; i < numRanges; i++) {
            const x = Math.floor(Math.random() * mapSize * 2) - mapSize;
            const z = Math.floor(Math.random() * mapSize * 2) - mapSize;
            const size = 5 + Math.floor(Math.random() * 3);
            const mountainBlocks = this.createMountainRange({ x, y: 0, z }, size);
            this.blocks.push(...mountainBlocks);
            mountainBlocks.forEach(block => this.scene.add(block));
        }
        
        // Generate lakes
        const numLakes = 2 + Math.floor(this.currentLevel / 2);
        for (let i = 0; i < numLakes; i++) {
            const x = Math.floor(Math.random() * mapSize * 2) - mapSize;
            const z = Math.floor(Math.random() * mapSize * 2) - mapSize;
            const size = 4 + Math.floor(Math.random() * 3);
            const lakeBlocks = this.createLake({ x, y: -1, z }, size);
            this.blocks.push(...lakeBlocks);
            lakeBlocks.forEach(block => this.scene.add(block));
        }
        
        // Generate houses
        const numHouses = 2 + Math.floor(this.currentLevel / 2);
        for (let i = 0; i < numHouses; i++) {
            const x = Math.floor(Math.random() * mapSize * 2) - mapSize;
            const z = Math.floor(Math.random() * mapSize * 2) - mapSize;
            const houseBlocks = this.createHouse({ x, y: 0, z });
            this.blocks.push(...houseBlocks);
            houseBlocks.forEach(block => this.scene.add(block));
        }
        
        // Generate random blocks based on level
        const numBlocks = 10 + this.currentLevel * 3;
        for (let i = 0; i < numBlocks; i++) {
            const x = Math.floor(Math.random() * mapSize * 2) - mapSize;
            const y = Math.floor(Math.random() * 5);
            const z = Math.floor(Math.random() * mapSize * 2) - mapSize;
            const types = Object.keys(this.materials);
            const type = types[Math.floor(Math.random() * types.length)];
            
            const block = this.createBlock(type, { x, y, z });
            this.blocks.push(block);
            this.scene.add(block);
        }
    }

    update() {
        if (this.gameOver) return;

        // Update player position
        if (this.player.jumping) {
            this.player.position.y += this.player.jumpVelocity;
            this.player.jumpVelocity += this.player.gravity;
            
            // Check for ground collision
            if (this.player.position.y <= 2) {
                this.player.position.y = 2;
                this.player.jumping = false;
                this.player.jumpVelocity = 0;
            }
        }

        // Update camera position and rotation
        this.camera.position.copy(this.player.position);
        this.camera.rotation.copy(this.player.rotation);
    }

    draw() {
        this.renderer.render(this.scene, this.camera);
    }

    nextLevel() {
        this.currentLevel++;
        this.player.position.set(0, 2, 0);
        this.player.rotation.set(0, 0, 0);
        this.player.jumping = false;
        this.player.jumpVelocity = 0;
        this.updateLevelDisplay();
        this.generateLevel();
        
        // Add bonus points for completing level
        const levelBonus = this.currentLevel * 50;
        this.score += levelBonus;
        this.updateScore();
        
        // Show level complete message
        this.showLevelCompleteMessage();
    }

    showLevelCompleteMessage() {
        const message = `Level ${this.currentLevel - 1} Complete! +${(this.currentLevel - 1) * 50} bonus points!`;
        const text = document.createElement('div');
        text.style.position = 'absolute';
        text.style.top = '50%';
        text.style.left = '50%';
        text.style.transform = 'translate(-50%, -50%)';
        text.style.color = '#4CAF50';
        text.style.fontSize = '36px';
        text.style.fontFamily = 'Arial';
        text.textContent = message;
        document.body.appendChild(text);
        
        setTimeout(() => {
            document.body.removeChild(text);
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
        // Hide WebGL canvas and show 2D canvas
        this.canvas.style.display = 'none';
        document.getElementById('gameCanvas').style.display = 'block';
        // Remove crosshair
        this.crosshair.remove();
    }

    restartGame() {
        this.score = 0;
        this.lives = 3;
        this.blocks = [];
        this.gameOver = false;
        this.currentLevel = 1;
        this.player.position.set(0, 2, 0);
        this.player.rotation.set(0, 0, 0);
        this.player.jumping = false;
        this.player.jumpVelocity = 0;
        document.getElementById('gameOver').style.display = 'none';
        // Hide 2D canvas and show WebGL canvas
        document.getElementById('gameCanvas').style.display = 'none';
        this.canvas.style.display = 'block';
        // Add crosshair back
        document.body.appendChild(this.crosshair);
        this.updateScore();
        this.updateLives();
        this.updateLevelDisplay();
        this.generateLevel();
        this.startGame();
    }

    startGame() {
        // Initial render
        this.draw();
        // Start game loop
        this.gameLoop();
    }

    gameLoop() {
        if (!this.gameOver) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
} 