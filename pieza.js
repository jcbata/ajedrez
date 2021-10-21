

function collision(a, b, d){
	return dist(a[0],a[1],b[0],b[1]) < d-10;
}

class Pieza {

	constructor(
			pos = [0,0],
			posAnt = [0,0],
			color = 0,
			vivo = false,
			img = null
		) {
		this.pos = pos;
		this.posAnt = posAnt;
		this.color = color;
		this.vivo = vivo;
		this.img = img;

	}

	
	
	mover() {
		if(this.fixed) return;
		//if(this.pos[0] < 0 || this.pos[0] > width) this.vel[0] = -this.vel[0];
		//if(this.pos[1] < 0 || this.pos[1] > height) this.vel[1] = -this.vel[1];

		this.pos[0] += this.vel[0];
		this.pos[1] += this.vel[1];
	}

	render(zoom,x,y) {
		fill(this.color);
		
		circle(x+this.pos[0]*zoom,y+this.pos[1],this.rad*zoom);
	}

	run(zoom,x,y) {
		this.accelerate();
		this.move();
		
		this.render(zoom,x,y);
	}
}

class Tablero {
	
	constructor() {
		this.tablero=[8,8];
	}
	
	dibujar(){
		let i,j, _tam = 60;
		let c=1, _margen=2;
		
		strokeWeight(_margen);
		stroke(51);
		noFill();
		
		rect(0, 0, this.tablero[0]*_tam+_margen/2, this.tablero[1]*_tam+_margen/2);
		
		noStroke();
		
		for(i = 0; i < this.tablero[0]; i++) {
			
			for(j = 0; j < this.tablero[1]; j++) {

				if (c==0){ fill(255, 204, 0); c=1;} 
				else { fill(255, 255, 255); c=0; }
				
				square(i*_tam+_margen/2, j*_tam+_margen/2, _tam);
				
			}
			if (c==0){ fill(255, 204, 0); c=1;} 
				else { fill(255, 255, 255); c=0; }
		}
		
		
	}

	
}