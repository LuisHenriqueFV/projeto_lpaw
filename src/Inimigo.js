import Colisao from "./Colisao";
import { loadImage } from "./loaderAssets";

export default class Inimigo extends Colisao {
    constructor(x, y, raio, velocidade = 10, FRAMES = 60, imageSrc = 'img/fogo.png') {
        super(x, y, raio);

        this.spriteLargura = 48; 
        this.spriteAltura = 46; 
        this.colunaAtual = 0;
        this.linhaAtual = 0;

        this.totalSprites = 6; 
        this.velocidadeTrocaSprite = 120; 
        this.quadroAtual = 0;
        this.contadorFrames = 0; 
        this.velocidadeMaximaSprite = 300; 

        this.velocidade = velocidade;

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
                //a cada segundo, o clico aumenta para 60
                this.contadorFrames++;
                
                if (this.contadorFrames >= this.velocidadeTrocaSprite) {
                    this.quadroAtual++;
                    
                    if (this.quadroAtual >= this.totalSprites) {
                        this.quadroAtual = 0;
                    }
                    
                    this.colunaAtual = this.quadroAtual;
                    this.contadorFrames = 0; 

                    if (this.velocidadeTrocaSprite <= this.velocidadeMaximaSprite) {
                        this.quadroAtual = 0; 
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
            this.colunaAtual * this.spriteLargura,
            this.linhaAtual * this.spriteAltura,
            this.spriteLargura,
            this.spriteAltura,
            this.x - this.raio,
            this.y - this.raio,
            this.raio * 2,
            this.raio * 2
        );
    }

    move(limits) {
        this.y += this.velocidade;
        this.limits(limits);
    }

    limits(limits) {
        if (this.y - this.raio > limits.height + this.raio) {
            this.y = -this.raio;
            this.x = Math.random() * limits.width;
        }
    }
}