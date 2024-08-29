export default class Smile {
    constructor(x, y, size, speed = 10, image) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.image = image;
    }

    paint(ctx) {
        ctx.drawImage(this.image, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
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

    moveRandomly(limits) {
        this.x = Math.random() * (limits.width - this.size) + this.size;
        this.y = Math.random() * (limits.height - this.size) + this.size;
    }
}
