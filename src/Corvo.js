import Circle from './geometries/Circle';
import { loadImage } from "./loaderAssets";

export default class Corvo extends Circle {
    constructor(x, y, size, speed = 10, FRAMES = 60, imageSrc = 'img/explode3.png') {
        super(x, y, size);

        // Dimensões de cada célula do sprite
        this.cellWidth = 48; 
        this.cellHeight = 46; 
        this.cellX = 0;
        this.cellY = 0;

        // Configuração do sprite
        this.totalSprites = 7; 
        this.spriteSpeed = 20;
        this.spriteFrame = 0;
        this.frameCounter = 0; // Contador para controlar a troca de sprites

        // Velocidade do Corvo
        this.speed = speed;

        // Carrega a imagem do sprite do Corvo
        this.imgLoaded = false;
        loadImage(imageSrc).then(img => {
            this.img = img;
            this.imgLoaded = true;
        });

        // Controle da animação do sprite
        this.controlSprite(FRAMES);
    }

    // Controla a animação do sprite
    controlSprite(FRAMES) {
        const updateSprite = () => {
            if (this.imgLoaded) {
                this.frameCounter++;
                if (this.frameCounter >= this.spriteSpeed) {
                    this.spriteFrame++;
                    if (this.spriteFrame >= this.totalSprites) {
                        this.spriteFrame = 0;
                    }
                    this.cellX = this.spriteFrame;
                    this.frameCounter = 0; // Reinicia o contador
                }
                requestAnimationFrame(updateSprite);
            } else {
                requestAnimationFrame(updateSprite);
            }
        };

        requestAnimationFrame(updateSprite);
    }

    // Desenha o Corvo na tela
    paint(ctx) {
        if (!this.imgLoaded) return;

        ctx.drawImage(
            this.img,
            this.cellX * this.cellWidth,
            this.cellY * this.cellHeight,
            this.cellWidth,
            this.cellHeight,
            this.x - this.size,
            this.y - this.size,
            this.size * 2,
            this.size * 2
        );
    }

    // Move o Corvo de forma aleatória
    moveRandomly(limits) {
        this.x = Math.random() * (limits.width - this.size) + this.size;
        this.y = Math.random() * (limits.height - this.size) + this.size;
    }

    // Verifica colisão com outro objeto
    colide(other) {
        const collisionRadius = this.size * 0.5; 
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (collisionRadius + other.size);
    }

    // Mantém o Corvo dentro dos limites
    limits(limits) {
        this.x = this.x + this.size > limits.width ? limits.width - this.size : this.x;
        this.x = this.x - this.size < 0 ? this.size : this.x;

        this.y = this.y + this.size > limits.height ? limits.height - this.size : this.y;
        this.y = this.y - this.size < 0 ? this.size : this.y;
    }
}