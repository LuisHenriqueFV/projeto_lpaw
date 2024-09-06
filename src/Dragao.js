import Colisao from './geometries/Colisao';
import { loadImage } from "./loaderAssets";

export default class Dragao extends Colisao {
    constructor(x, y, velocity = 10, width, height, FRAMES = 60) {
        super(x, y, 0);

        // Dimensões de cada célula do sprite
        this.cellWidth = 210; 
        this.cellHeight = 160; 
        this.cellX = 0;
        this.cellY = 0;

        // Configuração do sprite
        this.totalSprites = 64; 
        this.spriteSpeed = 24;

        // Dimensões do herói
        this.width = width;
        this.height = height;
        this.size = this.width;

        // Velocidade do herói
        this.baseSpeed = velocity;
        this.speed = this.baseSpeed; 
        this.direcaoInicial = 'right'; // Direção inicial

        this.showHit = false; // Controle da exibição do hitbox

        // Carrega a imagem do sprite do herói
        this.imgLoaded = false;
        loadImage('img/reddragonfly_sprite.png').then(img => {
            this.img = img;
            this.imgLoaded = true;
        });

        // Configurações iniciais
        this.setHit();
        this.setControlsKeys();
        this.setSprites();

        // Controle da animação do sprite
        this.lastFrameTime = 0;
        this.controlarSprite(FRAMES);
    }

    aumentarTamanho(tamanhoAjuste) {
        this.width += tamanhoAjuste;
        this.height += tamanhoAjuste;
        this.size = this.width / 2;
        this.setHit();
    }

    diminuirTamanho(tamanhoAjuste) {
        this.width = Math.max(this.width - tamanhoAjuste, 32);
        this.height = Math.max(this.height - tamanhoAjuste, 32);
        this.size = this.width / 2;
        this.setHit();
    }

    controlarSprite(FRAMES) {
        const updateSprite = () => {
            if (this.imgLoaded) {
                this.frameCounter = (this.frameCounter || 0) + 2;
                if (this.frameCounter >= FRAMES / this.spriteSpeed) {
                    this.cellX = (this.cellX + 1) % 4; // Muda para o próximo frame horizontal
                    this.frameCounter = 0;
                }
                requestAnimationFrame(updateSprite);
            } else {
                requestAnimationFrame(updateSprite);
            }
        };
        requestAnimationFrame(updateSprite);
    }

    // Desenha o herói na tela
    draw(CTX) {
        if (!this.imgLoaded) return;
    
        this.cellY = this.sprites[this.direcaoInicial] * this.cellHeight; // Mantém a direção
    
        CTX.drawImage(
            this.img,
            this.cellX * this.cellWidth, // Altera para usar o frame atual do sprite horizontalmente
            this.cellY,
            this.cellWidth,
            this.cellHeight,
            this.x,
            this.y,
            this.width,
            this.height
        );
    
        if (this.showHit) {
            this.hit.draw(CTX);
        }
    }

    // Define a área de colisão (hitbox) do herói
    setHit() {
        this.hit = new Colisao(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.size * 0.5,
            5,
            "rgba(0,0,255,.3)"
        );
    }

    // Define os sprites para cada direção
    setSprites() {
        this.sprites = {
            'up': 0,
            'right': 4,
            'down': 8,
            'left': 12
        };
    }

    // Define as teclas de controle do herói
    setControlsKeys() {
        this.controls = {
            "d": "right",
            "a": "left",
            "w": "up",
            "s": "down"
        };
    }

    // Atualiza a posição do hitbox com base na posição do herói
    update() {
        this.hit.x = this.x + this.width / 2;
        this.hit.y = this.y + this.height / 2;
    }

    // Move o herói com base nas teclas pressionadas
    move(limits, key) {
        this.setMovements();

        this.direcaoInicial = this.controls[key] || this.direcaoInicial;

        const movimento = this.movements[this.direcaoInicial];

        if (movimento) {
            this.x = movimento.x;
            this.y = movimento.y;

            // Tratamento para mover o herói para o lado oposto da tela se ele sair dos limites
            if (this.x > limits.width) this.x = -this.width;
            if (this.x + this.width < 0) this.x = limits.width;
            if (this.y > limits.height) this.y = -this.height;
            if (this.y + this.height < 0) this.y = limits.height;
        }

        this.update();
    }

    // Verifica se há colisão com outro objeto
    colide(other) {
        return this.hit.colide(other);
    }

    // Aumenta o tamanho do herói ao coletar uma energia
    coletarEnergia() {
        this.alteraVelocidade(2); // Aumenta a velocidade do herói
        this.diminuirTamanho(10);         // dimunui o tamanho do herói
    }

    // Aumenta a velocidade do herói
    alteraVelocidade(tamanhoAjuste) {
        this.speed += tamanhoAjuste;
    }

    // Define os movimentos do herói com base na direção
    setMovements() {
        this.movements = {
            'right': { x: this.x + this.speed, y: this.y },
            'left': { x: this.x - this.speed, y: this.y },
            'up': { x: this.x, y: this.y - this.speed },
            'down': { x: this.x, y: this.y + this.speed }
        };
    }
}
