import Circle from './geometries/Circle';

export default class Smile extends Circle {

    constructor(x, y, size, speed = 10, color = "#00f") {
        super(x, y, size, speed, color);
        this.status = 'ArrowDown';
    }

    paint(ctx) {
        // Desenhar o Smile
        this.draw(ctx);
        this.circ(ctx,
            this.x - this.size / 2.5,
            this.y - this.size / 4,
            this.size * .1, 1, 'black', 'black');

        this.circ(ctx,
            this.x + this.size / 2.5,
            this.y - this.size / 4,
            this.size * .1, 1, 'black', 'black');

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.arc(this.x, this.y + this.size / 4, this.size / 2, 0, Math.PI);
        ctx.strokeStyle = "#000";
        ctx.stroke();

        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.stroke();
    }

    colide(other) {
        const collisionRadius = this.size * 0.9; // Tamanho reduzido para colisão
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
