function gravedad(a, b) {
	let F = [b.pos[0] - a.pos[0], b.pos[1] - a.pos[1]];
	let m = a.mass * b.mass / Math.pow(Math.sqrt(Math.pow(a.pos[0]-b.pos[0],2)+Math.pow(a.pos[1]-b.pos[1],2)),3);
	return [F[0]*m, F[1]*m];
}

function collision(a, b, d){
	return dist(a[0],a[1],b[0],b[1]) < d-10;
}

class Objeto {

	constructor(
			pos = [0,0],
			vel = [0,0],
			acc = [0,0],
			rad = 10,
			mass = 50,
			color = [0,0,0],
			alive = true,
			fixed = false
		) {
		this.pos = pos;
		this.vel = vel;
		this.acc = acc;
		this.rad = rad;
		this.mass = mass;
		this.color = color;		
		this.alive = alive;
		this.fixed = fixed;

	}

	setAcc(acc) {
		this.acc[0] = acc[0];
		this.acc[1] = acc[1];
	}

	accelerate() {

		this.vel[0] += this.acc[0];
		this.vel[1] += this.acc[1];
	}

	move() {
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

class Universo {

	constructor() {
		this.objetos = [];
	}
	

	calculate() {
		let i, j, F, Fg, alives = [], max = this.objetos.length;
		for(i = 0; i < max; i++) {
			F = [0,0];
			for(j = 0; j < max; j++) {
				if(i !== j && this.objetos[i].alive) {
					if(collision(this.objetos[i].pos,this.objetos[j].pos,this.objetos[i].rad + this.objetos[j].rad)) {
						
						if(this.objetos[i].mass > this.objetos[j].mass){
							clr = this.objetos[i].color;
							x = this.objetos[i].pos[0];
							y = this.objetos[i].pos[1];
						}else {
							clr = this.objetos[j].color;
							x = this.objetos[j].pos[0];
							y = this.objetos[j].pos[1];
						}
						
						let fusion = new Objeto(
							[
								x,
								y,
							],
							[0,0],
							[0,0],
							this.objetos[i].rad + this.objetos[j].rad,
							this.objetos[i].mass + this.objetos[j].mass,
							clr
						);
						this.objetos[i].alive = false;
						this.objetos[j].alive = false;
						this.objetos.push(fusion);
					}
					Fg = gravedad(this.objetos[i],this.objetos[j]);
					F[0] += Fg[0];
					F[1] += Fg[1];
				}
			}
			this.objetos[i].setAcc([F[0]/this.objetos[i].mass, F[1]/this.objetos[i].mass]);
		}
		for(i = 0; i < this.objetos.length; i++) {
			if(this.objetos[i].alive) alives.push(this.objetos[i]);
		}
		this.objetos = alives;
	}

	fix() {
		let massive = 0;
		for(let i = 0; i < this.objetos.length; i++) {
			if(this.objetos[i].mass > this.objetos[massive].mass) {
				massive = i;
			}
		}
		this.objetos[massive].fixed = true;
	}

	run(zoom,x,y) {
		this.calculate();
		for(const objeto of this.objetos) {
			objeto.run(zoom,x,y);
		}
	}
}