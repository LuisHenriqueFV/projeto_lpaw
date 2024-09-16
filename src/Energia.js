import Colisao from './Colisao';
import { loadImage } from "./loaderAssets";

export default class Energia extends Colisao {
    constructor(x, y, raio, speed = 10, FRAMES = 60, imageSrc = 'img/energia.png') {
        super(x, y, raio);

        this.spriteLargura = 87; 
        this.spriteAltura = 98; 
        this.spriteColuna = 0;
        this.spriteLinha = 0;

        this.totalSprites = 16; 
        this.spriteSpeed = 14;
        this.spriteFrame = 0;
        this.contadorCiclos = 0; 

        this.speed = speed;

        this.imgLoaded = false;
        loadImage(imageSrc).then(img => {
            this.img = img;
            this.imgLoaded = true;
        });

        this.controlarSprite();
    }

    controlarSprite() {
        const updateSprite = () => {
            if (this.imgLoaded) {
                this.contadorCiclos++;
                if (this.contadorCiclos >= this.spriteSpeed) {
                    this.spriteFrame++;
                    if (this.spriteFrame >= this.totalSprites) {
                        this.spriteFrame = 0;
                    }
                    
                    this.spriteColuna = (this.spriteFrame % 4) * this.spriteLargura;
                    this.spriteLinha = Math.floor(this.spriteFrame / 4) * this.spriteAltura;
                    this.contadorCiclos = 0; 
                }
                requestAnimationFrame(updateSprite);
            } else {
                requestAnimationFrame(updateSprite);
            }
        };

        requestAnimationFrame(updateSprite);
    }

    paint(ctx) {
        if (!this.imgLoaded) return;

        ctx.drawImage(
            this.img,
            this.spriteColuna, 
            this.spriteLinha, 
            this.spriteLargura,
            this.spriteAltura,
            this.x - this.raio,
            this.y - this.raio,
            this.raio * 2,
            this.raio * 2
        );
    }

    moveRandomly(limits) {
        this.x = Math.random() * (limits.width - this.raio) + this.raio;
        this.y = Math.random() * (limits.height - this.raio) + this.raio;
    }

    colisao(other) {
        const collisionRadius = this.raio * 0.5; 
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (collisionRadius + other.raio);
    }

    limits(limits) {
        this.x = this.x + this.raio > limits.width ? limits.width - this.raio : this.x;
        this.x = this.x - this.raio < 0 ? this.raio : this.x;

        this.y = this.y + this.raio > limits.height ? limits.height - this.raio : this.y;
        this.y = this.y - this.raio < 0 ? this.raio : this.y;
    }
}