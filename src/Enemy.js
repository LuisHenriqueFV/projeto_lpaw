import Colisao from "./geometries/Colisao";
import { loadImage } from "./loaderAssets";

export default class Enemy extends Colisao {
    constructor(x, y, size, speed = 10, FRAMES = 60, imageSrc = 'img/fogo.png') {
        super(x, y, size);

        this.cellWidth = 48; 
        this.cellHeight = 46; 
        this.cellX = 0;
        this.cellY = 0;

        this.totalSprites = 7; 
        this.spriteSpeed = 100; 
        this.spriteFrame = 0;
        this.frameCounter = 0; 
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
                this.frameCounter++;
                
                if (this.frameCounter >= this.spriteSpeed) {
                    this.spriteFrame++;
                    
                    if (this.spriteFrame >= this.totalSprites) {
                        this.spriteFrame = 0;
                    }
                    
                    this.cellX = this.spriteFrame;
                    this.frameCounter = 0; 

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

    move(limits) {
        this.y += this.speed;
        this.limits(limits);
    }

    limits(limits) {
        if (this.y - this.size > limits.height + this.size) {
            this.y = -this.size;
            this.x = Math.random() * limits.width;
        }
    }
}
