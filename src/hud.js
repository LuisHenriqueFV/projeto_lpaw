const hud = (ctx,texto, color = "red",y=0)=>{
	ctx.font = 'bold 24px Arial';
	ctx.textBaseline = "top";
	let textMetric = ctx.measureText(texto)
	ctx.fillStyle = color;
	ctx.fillText(texto,
		ctx.canvas.width / 2 - textMetric.width / 2,
		y)
}

export default hud