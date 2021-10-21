let width = screen.width, height = screen.height;
let tablero, img;


function preload(){
	img = loadImage('img/chess.png');
	
}

function setup() {
	createCanvas(width, height);

	// Carga imágen
	img.loadPixels();
	
		//carga tablero
	tablero = new Tablero([
			[-4,-2,-3,-5,-6,-3,-2,-4],
			[-1,-1,-1,-1,-1,-1,-1,-1],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[1,1,1,1,1,1,1,1],
			[4,2,3,5,6,3,2,4]
		]);
	
	tablero.cargaPiezas(img);

	
}


function draw() {
	//background(0);
	clear();
	tablero.dibujar([255,200,12,255]);

	for(let z=0;z<tablero.piezas.length;z++){
		tablero.piezas[z].dibujar(0);
		
	}


	//tablero.dibujaMovimientoPosible();


	
	

}

function mousePressed() {
	x = mouseX;
	y = mouseY;
	//fullscreen(true);
	console.log(tablero.fCoordMouse(x,y));
	tablero.posSel = tablero.fCoordMouse(x,y);
	tablero.piezaSel = tablero.posSel;

	
		
	
}
function mouseDragged() {
	x = mouseX;
	y = mouseY;

	
	
	for(i=0;i<tablero.piezas.length;i++){


		tablero.piezas[i].coord = [tablero.piezas[i].pos[0]*tablero.tam,tablero.piezas[i].pos[1]*tablero.tam];
		

		if(mouseIsPressed){
			
			if(tablero.piezas[i].pos[0] == tablero.posSel[0] && tablero.piezas[i].pos[1] == tablero.posSel[1]){


				if(mouseX > tablero.tablero[0].length*tablero.tam -tablero.tam/2)					
					x=tablero.tablero[0].length*tablero.tam-tablero.tam/2;
				if(mouseX < tablero.tam/2)					
					x=tablero.tam/2;

				if(mouseY > tablero.tablero.length*tablero.tam -tablero.tam/2)
					y=tablero.tablero.length*tablero.tam-tablero.tam/2;
				if(mouseY < tablero.tam/2)					
					y=tablero.tam/2;


				tablero.piezas[i].coord = [y-tablero.tam/2,x-tablero.tam/2];
			}

		}
	
	}
	

	
}

function touchEnded() {
	

	for(i=0;i<tablero.piezas.length;i++){ 
		// el buqle es para buscar la pieza seleccinada. aunque también se podría ubicar solo con las coordenadas posSel

		if(tablero.posSel[0]>-1){
			
			if(tablero.piezas[i].pos[0] == tablero.posSel[0] && tablero.piezas[i].pos[1] == tablero.posSel[1]){
				//valida que la pieza sea la seleccionada
				if(tablero.tablero[0].length*tablero.tam>=mouseX && tablero.tablero.length*tablero.tam>=mouseY){
				tablero.mover(tablero.piezas[i],tablero.fCoordMouse(x,y));
				tablero.cargaPiezas(img);	// crea las piezas en el tablero a partir de la matriz
				}
			}
			
		}
		if(tablero.piezas[i])
		tablero.piezas[i].coord = [tablero.piezas[i].pos[0]*tablero.tam,tablero.piezas[i].pos[1]*tablero.tam];
	}

	tablero.posSel = [-1,-1];

}

function mouseWheel(event) {
  //print(event.delta);
  //move the square according to the vertical scroll amount
  //pos += event.delta;
  //uncomment to block page scrolling
  //return false;
  
}



function keyTyped() {
	
}