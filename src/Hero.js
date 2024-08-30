import Circle from './geometries/Circle';
import { loadImage } from "./loaderAssets";

export default class Hero extends Circle {
    constructor(x, y, velocity = 10, width, height, FRAMES = 60) {
        super(x, y, 0);

        // Dimensões de cada célula do sprite
        this.cellWidth = 210; 
        this.cellHeight = 160; 
        this.cellX = 0;
        this.cellY = 0;

        // Configuração do sprite
        this.totalSprites = 64; 
        this.spriteSpeed = 7;

        // Dimensões do herói
        this.width = width;
        this.height = height;
        this.size = this.width;

        // Velocidade do herói
        this.baseSpeed = velocity;
        this.speed = this.baseSpeed; 
        this.status = 'right'; // Direção inicial

        this.showHit = false; // Controle da exibição do hitbox

        // Carrega a imagem do sprite do herói
        this.imgLoaded = false;
        loadImage('img/reddragonfly_sprite.png').then(img => {
            this.img = img;
            this.imgLoaded = true;
        });

        // Configurações iniciais
        this.setHit();
        this.setControlsKeys();
        this.setSprites();

        // Controle da animação do sprite
        this.lastFrameTime = 0;
        this.controlSprite(FRAMES);
    }

    // Aumenta o tamanho do herói
    grow(amount) {
        this.width += amount;
        this.height += amount;
        this.size = this.width / 2;
        this.setHit();
    }

    // Diminui o tamanho do herói
    shrink(amount) {
        this.width = Math.max(this.width - amount, 32);
        this.height = Math.max(this.height - amount, 32);
        this.size = this.width / 2;
        this.setHit();
    }

    // Controla a animação do sprite
    controlSprite(FRAMES) {
        const updateSprite = () => {
            if (this.imgLoaded) {
                this.frameCounter = (this.frameCounter || 0) + 2;
                if (this.frameCounter >= FRAMES / this.spriteSpeed) {
                    this.cellX = (this.cellX + 1) % 4; // Muda para o próximo frame horizontal
                    this.frameCounter = 0;
                }
                requestAnimationFrame(updateSprite);
            } else {
                requestAnimationFrame(updateSprite);
            }
        };
        requestAnimationFrame(updateSprite);
    }

    // Desenha o herói na tela
    draw(CTX) {
        if (!this.imgLoaded) return;
    
        this.cellY = this.sprites[this.status] * this.cellHeight; // Mantém a direção
    
        CTX.drawImage(
            this.img,
            this.cellX * this.cellWidth, // Altera para usar o frame atual do sprite horizontalmente
            this.cellY,
            this.cellWidth,
            this.cellHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    
        if (this.showHit) {
            this.hit.draw(CTX);
        }
    }

    // Define a área de colisão (hitbox) do herói
    setHit() {
        this.hit = new Circle(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.size * 0.5,
            5,
            "rgba(0,0,255,.3)"
        );
    }

    // Define os sprites para cada direção
    setSprites() {
        this.sprites = {
            'up': 0,
            'right': 4,
            'down': 8,
            'left': 12
        };
    }

    // Define as teclas de controle do herói
    setControlsKeys() {
        this.controls = {
            "d": "right",
            "a": "left",
            "w": "up",
            "s": "down"
        };
    }

    // Atualiza a posição do hitbox com base na posição do herói
    update() {
        this.hit.x = this.x + this.width / 2;
        this.hit.y = this.y + this.height / 2;
    }

    // Move o herói com base nas teclas pressionadas
    move(limits, key) {
        this.setMovements();

        this.status = this.controls[key] || this.status;

        const movimento = this.movements[this.status];

        if (movimento) {
            this.x = movimento.x;
            this.y = movimento.y;

            // Tratamento para mover o herói para o lado oposto da tela se ele sair dos limites
            if (this.x > limits.width) this.x = -this.width;
            if (this.x + this.width < 0) this.x = limits.width;
            if (this.y > limits.height) this.y = -this.height;
            if (this.y + this.height < 0) this.y = limits.height;
        }

        this.update();
    }

    // Verifica se há colisão com outro objeto
    colide(other) {
        return this.hit.colide(other);
    }

    // Aumenta o tamanho do herói ao coletar uma energia
    collectCorvo() {
        this.increaseSpeed(2); // Aumenta a velocidade do herói
        this.grow(10);         // Aumenta o tamanho do herói
    }

    // Aumenta a velocidade do herói
    increaseSpeed(amount) {
        this.speed += amount;
    }

    // Define os movimentos do herói com base na direção
    setMovements() {
        this.movements = {
            'right': { x: this.x + this.speed, y: this.y },
            'left': { x: this.x - this.speed, y: this.y },
            'up': { x: this.x, y: this.y - this.speed },
            'down': { x: this.x, y: this.y + this.speed }
        };
    }
}
