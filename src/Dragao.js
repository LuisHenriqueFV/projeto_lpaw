import Colisao from './geometries/Colisao';
import { loadImage } from "./loaderAssets";

export default class Dragao extends Colisao {
    constructor(x, y, velocity = 10, larguraDragao, alturaDragao, FRAMES = 60) {
        super(x, y, 0);

        this.spriteLargura = 210; 
        this.spriteAltura = 160; 
        this.spriteColuna = 0;
        this.spriteLinha = 0;

        this.contadorCiclos = 0;
        this.totalSprites = 64; 
        this.spriteSpeed = 30;

        this.larguraDragao = larguraDragao;
        this.alturaDragao = alturaDragao;
        this.size = this.larguraDragao / 2;

        this.baseSpeed = velocity;
        this.speed = this.baseSpeed; 
        this.direcaoInicial = 'right'; 

        this.showHit = false;

        this.imgLoaded = false;
        loadImage('img/sprite.png').then(img => {
            this.img = img;
            this.imgLoaded = true;
        });

        this.setHit();
        this.setControlsKeys();
        this.setSprites();

        this.lastFrameTime = 0;
        this.controlarSprite(FRAMES);
    }

    aumentarTamanho(tamanhoAjuste) {
        this.larguraDragao += tamanhoAjuste;
        this.alturaDragao += tamanhoAjuste;
        this.size = this.larguraDragao / 2;
        this.setHit();
    }

    diminuirTamanho(tamanhoAjuste) {
        this.larguraDragao = Math.max(this.larguraDragao - tamanhoAjuste, 22);
        this.alturaDragao = Math.max(this.alturaDragao - tamanhoAjuste, 22);
        this.size = this.larguraDragao / 2;
        this.setHit();
    }

    controlarSprite(FRAMES) {
        const updateSprite = () => {
            if (this.imgLoaded) {
                this.contadorCiclos++; // Contador de ciclos para controlar a troca de quadros
                
                // Verifica se é hora de trocar o quadro
                                        //  60    /       30 = 2
                if (this.contadorCiclos >= FRAMES / this.spriteSpeed) {
                    this.spriteColuna += 1; // Avança para o próximo quadro
    
                    // Ajusta o índice se ultrapassar o número de colunas
                    const maxColunas = 4; // Número total de colunas no sprite sheet
                    while (this.spriteColuna >= maxColunas) {
                        this.spriteColuna = 0; // volta para a primeira coluna
                    }
    
                    this.contadorCiclos = 0; // Reseta o contador de ciclos
                }
                requestAnimationFrame(updateSprite);
            } else {
                requestAnimationFrame(updateSprite);
            }
        };
        requestAnimationFrame(updateSprite);
    }

    draw(CTX) {
        if (!this.imgLoaded) return;
    
        this.spriteLinha = this.sprites[this.direcaoInicial] * this.spriteAltura; 
    
        CTX.drawImage(
            this.img,
            this.spriteColuna * this.spriteLargura, 
            this.spriteLinha,
            this.spriteLargura,
            this.spriteAltura,
            this.x,
            this.y,
            this.larguraDragao,
            this.alturaDragao
        );
    
        if (this.showHit) {
            this.hit.draw(CTX);
        }
    }

    setHit() {
        this.hit = new Colisao(
            this.x + this.larguraDragao / 2,
            this.y + this.alturaDragao / 2,
            this.size * 0.5,
            5,
            "rgba(0,0,255,.3)"
        );
    }

    setSprites() {
        this.sprites = {
            'up': 0,
            'right': 4,
            'down': 8,
            'left': 12
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
        this.hit.x = this.x + this.larguraDragao / 2;
        this.hit.y = this.y + this.alturaDragao / 2;
    }

    move(limits, key) {
        this.setMovements();

        this.direcaoInicial = this.controls[key] || this.direcaoInicial;

        const movimento = this.movements[this.direcaoInicial];

        if (movimento) {
            this.x = movimento.x;
            this.y = movimento.y;

            if (this.x > limits.width) this.x = -this.larguraDragao;
            if (this.x + this.larguraDragao < 0) this.x = limits.width;
            if (this.y > limits.height) this.y = -this.alturaDragao;
            if (this.y + this.alturaDragao < 0) this.y = limits.height;
        }

        this.update();
    }

    colide(other) {
        return this.hit.colide(other);
    }

    coletarEnergia() {
        this.alteraVelocidade(2); 
        this.diminuirTamanho(10);    
    }

    alteraVelocidade(tamanhoAjuste) {
        this.speed += tamanhoAjuste;
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
