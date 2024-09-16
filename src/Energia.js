import Colisao from './geometries/Colisao';
import { loadImage } from "./loaderAssets";

export default class Energia extends Colisao {
    constructor(x, y, size, speed = 10, FRAMES = 60, imageSrc = 'img/energia.png') {
        super(x, y, size);

        this.spriteLargura = 87; 
        this.spriteAltura = 98; 
        this.spriteColuna = 0;
        this.spriteLinha = 0;

        this.totalSprites = 16; 
        this.spriteSpeed = 14;
        this.spriteFrame = 0;
        this.contarNumeroFrames = 0; 

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
                this.contarNumeroFrames++;
                if (this.contarNumeroFrames >= this.spriteSpeed) {
                    this.spriteFrame++;
                    if (this.spriteFrame >= this.totalSprites) {
                        this.spriteFrame = 0;
                    }
                    
                    this.spriteColuna = (this.spriteFrame % 4) * this.spriteLargura;
                    this.spriteLinha = Math.floor(this.spriteFrame / 4) * this.spriteAltura;
                    this.contarNumeroFrames = 0; 
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
            this.x - this.size,
            this.y - this.size,
            this.size * 2,
            this.size * 2
        );
    }

    moveRandomly(limits) {
        this.x = Math.random() * (limits.width - this.size) + this.size;
        this.y = Math.random() * (limits.height - this.size) + this.size;
    }

    colide(other) {
        const collisionRadius = this.size * 0.5; 
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (collisionRadius + other.size);
    }

    limits(limits) {
        this.x = this.x + this.size > limits.width ? limits.width - this.size : this.x;
        this.x = this.x - this.size < 0 ? this.size : this.x;

        this.y = this.y + this.size > limits.height ? limits.height - this.size : this.y;
        this.y = this.y - this.size < 0 ? this.size : this.y;
    }
}
