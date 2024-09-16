export default class Colisao {
	constructor(x, y, raio) {
		this.x = x;
		this.y = y;
		this.raio = raio;
	}

	colisao(circ){                     
		return this.raio + circ.raio >= Math.sqrt((this.x - circ.x)**2 + (this.y - circ.y)**2);
	}
}