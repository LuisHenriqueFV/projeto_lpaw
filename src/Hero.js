import Circle from './geometries/Circle';
import { loadImage } from "./loaderAssets";

export default class Hero extends Circle {

	constructor(x, y, velocity = 10, width, height, FRAMES = 60) {
		super(x, y, 0);
		loadImage('img/sprite.png').then(img => this.img = img);

		this.cellWidth = 32;  
		this.cellHeight = 48; 
		this.cellX = 0;
		this.cellY = 0;

		this.totalSprites = 4; 
		this.spriteSpeed = 1;

		this.setSprites();
		this.controlSprite(FRAMES);

		this.width = width;
		this.height = height;
		this.size = this.width / 1;

		this.speed = velocity * this.spriteSpeed;
		this.status = 'right'; 

		this.showHit = false;
		this.setHit();

		this.setControlsKeys();

		this.groundY = 350;
		this.y = this.groundY;

	}
	grow(amount) {
        this.width += amount;
        this.height += amount;
        this.size = this.width / 2; 
        this.setHit(); 
    }
	shrink(amount) {
        this.width = Math.max(this.width - amount, 32); // Define um tamanho mínimo
        this.height = Math.max(this.height - amount, 32); // Define um tamanho mínimo
        this.size = this.width / 2; 
        this.setHit(); 
    }

	controlSprite(FRAMES) { 
		setInterval(() => {
			this.cellX = this.cellX < this.totalSprites - 1 ? this.cellX + 1 : 0;
		}, 1000 / (FRAMES * this.spriteSpeed / 10));
	}

	draw(CTX) {
		if (!this.img) return; 

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
			'left': 1,
			'right': 2
		};
	}

	setControlsKeys() {
		this.controls = {
			"d": "right",
			"a": "left"
		};
	}

	setMovements() {
		this.movements = {
			'right': { x: this.x + this.speed },
			'left': { x: this.x - this.speed }
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

		if (newx !== undefined) {
			this.x = Math.max(0, Math.min(limits.width - this.width, newx));
		}

		this.update();
	}

	colide(other) {
		return this.hit.colide(other);
	}

	collectYellowBall() {
		this.size += 10;
		this.width = this.size * 2; 
		this.height = this.size * 2; 
		this.setHit(); 
	}
}