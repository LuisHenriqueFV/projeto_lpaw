import Circle from './geometries/Circle'
import { loadImage } from "./loaderAssets"

export default class Hero extends Circle {

	constructor(x, y, velocity = 10, width, height, FRAMES = 60) {
		super(x, y, 0);
		loadImage('img/sprite.png').then(img => this.img = img);
		
		this.cellWidth = 32;   // largura da célula de recorte
		this.cellHeight = 48; // altura da célula de recorte
		this.cellX = 0;
		this.cellY = 0;
		
		this.totalSprites = 4; // Total de sprites por linha
		this.spriteSpeed = 1;
		
		this.setSprites();
		this.controlSprite(FRAMES);

		this.width = width;
		this.height = height;
		this.size = this.width / 2;

		this.speed = velocity * this.spriteSpeed;
		this.status = 'down';
		
		this.showHit = true;
		this.setHit();

		this.setControlsKeys();
	}

	controlSprite(FRAMES) { // Controla a animação do sprite
		setInterval(() => {
			this.cellX = this.cellX < this.totalSprites - 1 ? this.cellX + 1 : 0;
		}, 1000 / (FRAMES * this.spriteSpeed / 10));
	}

	draw(CTX) {
		this.cellY = this.sprites[this.status] * this.cellHeight;

		CTX.drawImage(
			this.img,
			this.cellX * this.cellWidth, 
			this.cellY, 
			this.cellWidth,
			this.cellHeight, 
			this.x, 
			this.y,
			this.width,
			this.height 
		);

		this.showHit && this.hit.draw(CTX);
	}

	setHit() {
		this.hit = new Circle(
			this.x + this.width / 2,
			this.y + this.height / 2,
			this.size * 0.5, 5,
			"rgba(0,0,255,.3)"
		);
	}

	setSprites() {
		this.sprites = {
			'down': 0,       // Linha 0
			'up': 3,         // Linha 3
			'left': 1,       // Linha 1
			'right': 2       // Linha 2
		};
	}

	setControlsKeys() {
		this.controls = {
			"s": "down",
			"w": "up",
			"a": "left",
			"d": "right"
		};
	}

	setMovements() {
		this.movements = {
			'down': { y: this.y + this.speed },
			'up': { y: this.y - this.speed },
			'left': { x: this.x - this.speed },
			'right': { x: this.x + this.speed }
		};
	}

	update() {
		this.hit.x = this.x + this.width / 2;
		this.hit.y = this.y + this.height / 2;
	}

	move(limits, key) {
		this.setMovements();

		this.status = this.controls[key] ? this.controls[key] : this.status;

		let newx = this.movements[this.status]?.x;
		let newy = this.movements[this.status]?.y;

		this.x = newx != undefined ? newx : this.x;
		this.y = newy != undefined ? newy : this.y;

		this.limits(limits);
		this.update();
	}

	colide(other) {
		return this.hit.colide(other);
	}
}
