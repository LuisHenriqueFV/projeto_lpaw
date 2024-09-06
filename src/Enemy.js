import Colisao from "./geometries/Colisao";
import { loadImage } from "./loaderAssets";

export default class Enemy extends Colisao {
    constructor(x, y, size, speed = 10, FRAMES = 60, imageSrc = 'img/fogo.png') {
        super(x, y, size);

        // Dimensões de cada célula do sprite
        this.cellWidth = 48; 
        this.cellHeight = 46; 
        this.cellX = 0;
        this.cellY = 0;

        // Configuração do sprite
        this.totalSprites = 7; 
        this.spriteSpeed = 100; // Tempo para trocar de sprite (em ms)
        this.spriteFrame = 0;
        this.frameCounter = 0; // Contador para controlar a troca de sprites
        this.maxSpriteSpeed = 300; // Limite máximo para a velocidade da animação

        // Velocidade do Inimigo
        this.speed = speed;

        // Carrega a imagem do sprite do Inimigo
        this.imgLoaded = false;
        loadImage(imageSrc).then(img => {
            this.img = img;
            this.imgLoaded = true;
        });

        // Controle da animação do sprite
        this.controlarSprite(FRAMES);
    }

    // Controla a animação do sprite
    controlarSprite(FRAMES) {
        const updateSprite = () => {
            if (this.imgLoaded) {
                this.frameCounter++;
                
                // Se o frameCounter atingir spriteSpeed, muda o frame do sprite
                if (this.frameCounter >= this.spriteSpeed) {
                    this.spriteFrame++;
                    
                    // Verifica se é o último frame do sprite, caso sim, reinicia
                    if (this.spriteFrame >= this.totalSprites) {
                        this.spriteFrame = 0;
                    }
                    
                    this.cellX = this.spriteFrame;
                    this.frameCounter = 0; // Reseta o frameCounter

                    // Se a velocidade da animação for alta, reinicia imediatamente
                    if (this.spriteSpeed <= this.maxSpriteSpeed) {
                        this.spriteFrame = 0; // Reinicia o frame para iniciar a animação imediatamente
                    }
                }

                // Continua o loop da animação
                requestAnimationFrame(updateSprite);
            } else {
                requestAnimationFrame(updateSprite);
            }
        };

        requestAnimationFrame(updateSprite);
    }

    // Desenha o Inimigo na tela
    draw(ctx) {
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

    // Move o Inimigo
    move(limits) {
        this.y += this.speed;
        this.limits(limits);
    }

    // Mantém o Inimigo dentro dos limites
    limits(limits) {
        if (this.y - this.size > limits.height + this.size) {
            this.y = -this.size;
            this.x = Math.random() * limits.width;
        }
    }
}
