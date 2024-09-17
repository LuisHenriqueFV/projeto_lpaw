import Colisao from './Colisao';
import { loadImage } from "./loaderAssets";

export default class Energia extends Colisao {
    constructor(x, y, raio, speed = 10, FRAMES = 60, imageSrc = 'img/energia.png') {
        super(x, y, raio);

        this.spriteLargura = 87; 
        this.spriteAltura = 98; 
        this.spriteColuna = 0;
        this.spriteLinha = 0;

        this.totalSprites = 15; 
        this.velocidadeAnimacaoSprite = 14;
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
                if (this.contadorCiclos >= this.velocidadeAnimacaoSprite) {
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

    moveRandomly(limite) {
        this.x = Math.random() * (limite.width - this.raio) + this.raio;
        this.y = Math.random() * (limite.height - this.raio) + this.raio;
    }

    colisao(objetoColidido) {
        const raioColisao = this.raio * 0.5; 
        const dx = this.x - objetoColidido.x;
        const dy = this.y - objetoColidido.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        return distancia < (raioColisao + objetoColidido.raio);
    }
    

    limite(valorLimite) {
        if (this.x + this.extensaoHorizontal > valorLimite.width) {
            this.x = valorLimite.width - this.extensaoHorizontal;
        } else if (this.x - this.extensaoHorizontal < 0) {
            this.x = this.extensaoHorizontal;
        }
    
        if (this.y + this.extensaoVertical > valorLimite.height) {
            this.y = valorLimite.height - this.extensaoVertical;
        } else if (this.y - this.extensaoVertical < 0) {
            this.y = this.extensaoVertical;
        }
    }
}