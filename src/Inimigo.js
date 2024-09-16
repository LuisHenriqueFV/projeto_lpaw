import Colisao from "./Colisao";
import { loadImage } from "./loaderAssets";

export default class Inimigo extends Colisao {
    constructor(x, y, raio, speed = 10, FRAMES = 60, imageSrc = 'img/fogo.png') {
        super(x, y, raio);

        this.spriteLargura = 48; 
        this.spriteAltura = 46; 
        this.spriteColuna = 0;
        this.spriteLinha = 0;

        this.totalSprites = 7; 
        this.spriteSpeed = 100; 
        this.spriteFrame = 0;
        this.contadorCiclos = 0; 
        this.maxSpriteSpeed = 300; 

        this.speed = speed;

        this.imgLoaded = false;
        loadImage(imageSrc).then(img => {
            this.img = img;
            this.imgLoaded = true;
        });

        this.controlarSprite(FRAMES);
    }

    controlarSprite(FRAMES) {
        const updateSprite = () => {
            if (this.imgLoaded) {
                this.contadorCiclos++;
                
                if (this.contadorCiclos >= this.spriteSpeed) {
                    this.spriteFrame++;
                    
                    if (this.spriteFrame >= this.totalSprites) {
                        this.spriteFrame = 0;
                    }
                    
                    this.spriteColuna = this.spriteFrame;
                    this.contadorCiclos = 0; 

                    if (this.spriteSpeed <= this.maxSpriteSpeed) {
                        this.spriteFrame = 0; 
                    }
                }

                requestAnimationFrame(updateSprite);
            } else {
                requestAnimationFrame(updateSprite);
            }
        };

        requestAnimationFrame(updateSprite);
    }

    draw(ctx) {
        if (!this.imgLoaded) return;

        ctx.drawImage(
            this.img,
            this.spriteColuna * this.spriteLargura,
            this.spriteLinha * this.spriteAltura,
            this.spriteLargura,
            this.spriteAltura,
            this.x - this.raio,
            this.y - this.raio,
            this.raio * 2,
            this.raio * 2
        );
    }

    move(limits) {
        this.y += this.speed;
        this.limits(limits);
    }

    limits(limits) {
        if (this.y - this.raio > limits.height + this.raio) {
            this.y = -this.raio;
            this.x = Math.random() * limits.width;
        }
    }
}