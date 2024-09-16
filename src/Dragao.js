import Colisao from './Colisao';
import { loadImage } from "./loaderAssets";

export default class Dragao extends Colisao {
    constructor(x, y, velocidadeInicial, larguraDragao, alturaDragao, FRAMES = 60) {
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
        this.raio = this.larguraDragao / 2;

        this.velocidadeAtual = velocidadeInicial;
    
        this.direcaoInicial = 'right'; 


        this.imgLoaded = false;
        loadImage('img/sprite.png').then(img => {
            this.img = img;
            this.imgLoaded = true;
        });

        this.setHit();
        this.setControleTeclas();
        this.setSprites();

        this.controlarSprite(FRAMES);
    }

    aumentarTamanho(valorTamanho) {
        this.larguraDragao += valorTamanho;
        this.alturaDragao += valorTamanho;
        this.raio = this.larguraDragao / 2;
        this.setHit();
    }

    diminuirTamanho(tamanhoAjuste) {
        this.larguraDragao = Math.max(this.larguraDragao - tamanhoAjuste, 22);
        this.alturaDragao = Math.max(this.alturaDragao - tamanhoAjuste, 22);
        this.raio = this.larguraDragao / 2;
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
        
        CTX.drawImage(
            this.img,
            this.spriteColuna * this.spriteLargura, 
            this.sprites[this.direcaoInicial] * this.spriteAltura,
            this.spriteLargura,
            this.spriteAltura,
            this.x,
            this.y,
            this.larguraDragao,
            this.alturaDragao
        );
    
     
    }

    setHit() {
        this.hit = new Colisao(
            this.x + this.larguraDragao / 2,
            this.y + this.alturaDragao / 2,
            this.raio * 0.5 //reduz a area de colisao referente ao dragao
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

    setControleTeclas() {
        this.controleTeclas = {
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

    move(limite, tecla) {
        this.definirMovimentos();

        this.direcaoInicial = this.controleTeclas[tecla] || this.direcaoInicial;

        const movimentoAtual = this.movementos[this.direcaoInicial];

        //se houver um movimento válido definido, atualiza as coordenadas do dragao
        if (movimentoAtual) {
            this.x = movimentoAtual.x;
            this.y = movimentoAtual.y;

            if (this.x > limite.width) this.x = -this.larguraDragao;
            if (this.x + this.larguraDragao < 0) this.x = limite.width;
            if (this.y > limite.height) this.y = -this.alturaDragao;
            if (this.y + this.alturaDragao < 0) this.y = limite.height;
        }

        this.update();
    }

    colisao(other) {
        return this.hit.colisao(other);
    }

    coletarEnergia() {
        this.alteraVelocidade(2); 
        this.diminuirTamanho(10);    
    }

    alteraVelocidade(tamanhoAjuste) {
        this.velocidadeAtual += tamanhoAjuste;
    }

    
    definirMovimentos() {
        this.movementos = {
            'right': { x: this.x + this.velocidadeAtual, y: this.y },
            'left': { x: this.x - this.velocidadeAtual, y: this.y },
            'up': { x: this.x, y: this.y - this.velocidadeAtual },
            'down': { x: this.x, y: this.y + this.velocidadeAtual }
        };
    }
}