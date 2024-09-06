export default class Colisao {
	constructor(x, y, size) {
		this.x = x;
		this.y = y;
		this.size = size;
	}

	colide(circ){                      //calcula a distância entre os centros dos dois objetos
		return this.size + circ.size >= Math.sqrt((this.x - circ.x)**2 + (this.y - circ.y)**2);
	}
}
