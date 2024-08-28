import Circle from './geometries/Circle';
import { loadImage } from "./loaderAssets";

export default class Hero extends Circle {
    constructor(x, y, velocity = 10, width, height, FRAMES = 60) {
        super(x, y, 0);
        
        this.cellWidth = 191; // Atualizado para corresponder ao tamanho do sprite
        this.cellHeight = 161; // Atualizado para corresponder ao tamanho do sprite
        this.cellX = 0;
        this.cellY = 0;

        this.totalSprites = 12; 
        this.spriteSpeed = 1;

        this.width = width;
        this.height = height;
        this.size = this.width;

        this.speed = velocity * this.spriteSpeed;
        this.status = 'right';

        this.showHit = false;

        this.imgLoaded = false;
        loadImage('img/flying_dragon-red.png').then(img => {
            this.img = img;
            this.imgLoaded = true;
        });

        this.setHit();
        this.setControlsKeys();
        this.setSprites();

        this.lastFrameTime = 0;
        this.controlSprite(FRAMES);
    }

    grow(amount) {
        this.width += amount;
        this.height += amount;
        this.size = this.width / 2;
        this.setHit();
    }

    shrink(amount) {
        this.width = Math.max(this.width - amount, 32);
        this.height = Math.max(this.height - amount, 32);
        this.size = this.width / 2;
        this.setHit();
    }

	controlSprite(FRAMES) {
		// Define a célula do sprite para um frame específico (ex: 0 para o primeiro frame)
		this.cellX = 0; // ou qualquer outro valor fixo conforme necessário
	
		// Se você não quiser atualizar a célula do sprite periodicamente
		const updateSprite = () => {
			if (this.imgLoaded) {
				// Você pode optar por não atualizar a célula do sprite
				// Atualização não é necessária se você deseja que permaneça em um frame específico
				requestAnimationFrame(updateSprite); // Continue pedindo atualização
			} else {
				requestAnimationFrame(updateSprite); // Continue pedindo atualização até a imagem ser carregada
			}
		};
	
		requestAnimationFrame(updateSprite); // Inicia a animação
	}


    draw(CTX) {
        if (!this.imgLoaded) return;

        this.cellY = this.sprites[this.status] * this.cellHeight;

        CTX.drawImage(
            this.img,
            this.cellX * this.cellWidth,
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

    setHit() {
        this.hit = new Circle(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.size * 0.5,
            5,
            "rgba(0,0,255,.3)"
        );
    }

    setSprites() {
        this.sprites = {
            'up': 0,
            'right': 1,
            'down': 2,
            'left': 3
        };
    }

    setControlsKeys() {
        this.controls = {
            "d": "right",
            "a": "left",
            "w": "up",
            "s": "down"
        };
    }

    update() {
        this.hit.x = this.x + this.width / 2;
        this.hit.y = this.y + this.height / 2;
    }

    move(limits, key) {
        this.setMovements();

        this.status = this.controls[key] ? this.controls[key] : this.status;

        let movement = this.movements[this.status];

        if (movement) {
            this.x = Math.max(0, Math.min(limits.width - this.width, movement.x));
            this.y = Math.max(0, Math.min(limits.height - this.height, movement.y));
        }

        this.update();
    }

    colide(other) {
        return this.hit.colide(other);
    }

    collectYellowBall() {
        this.size += 10;
        this.width = this.size * 2;
        this.height = this.size * 2;
        this.setHit();
    }

    setMovements() {
        this.movements = {
            'right': { x: this.x + this.speed, y: this.y },
            'left': { x: this.x - this.speed, y: this.y },
            'up': { x: this.x, y: this.y - this.speed },
            'down': { x: this.x, y: this.y + this.speed }
        };
    }
}
