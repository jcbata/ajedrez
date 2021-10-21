// para iniciar nodejs http-server
class Pieza {
	constructor(
			tipo = 0,
			pos = [0,0],
			piezaSize = 60,
			bando = 0,
			vivo = false,
			img = null
		) {
		this.piezaSize=piezaSize;
		this.tipo =tipo;
		this.pos = pos; // posición en la matriz del tablero
		this.posAnt = pos;
		this.coord = [this.pos[0]*piezaSize,this.pos[1]*piezaSize]; //para dibujar
		this.bando = bando;
		this.vivo = vivo; // no usado
		this.img = img;
		this.posSel = [-1,-1];
		this.movPosibles=[];
	

	}

	
	
	

	dibujar(estilo) {
		//estos valores dependenden de la imágen png
		let _estilo = estilo;
		let ancho = img.width/6;
		let alto = img.height/12;
		let bandoPos = 0; // identifica el bando (Blancas o Negras)

		if(this.bando<0) bandoPos = _estilo*alto*2;
		if(this.bando>0) bandoPos = _estilo*alto*2+alto;

		if(this.tipo>0){
			image(this.img, //imagen completa
				this.coord[1],this.coord[0],  // posición en el tablero
				this.piezaSize, this.piezaSize, // tamaño del sprite
				(this.tipo - 1)*ancho,bandoPos  // recorte inicio del sprite 0,0
				,ancho,alto); // recorte fin del sprite ancho
			
		}
	}


}


class Tablero {
	
	constructor(
			tabl=[]
			) {
		this.tablero=tabl;
		this.movimientos=[];
		this.piezas = [];
		this.tam = 60;
		this.margen=2;
		this.coordMouse=[-1,-1];
		this.turno = 1;
		this.posSel=[-1,-1];
		this.piezaSel=[-1,-1];
		this.jaque = 0;
		this.posK_b = [];
		this.posK_n = [];
		// cantidad movimientos posibles
		this.movimientos_n =0; 
		this.movimientos_b =0;

		this.movimientos.push(JSON.parse( JSON.stringify( this.tablero ) ));
	}

	cargaPiezas(img){
		let i,j;
		this.piezas=[];

		for(i=0;i<this.tablero.length;i++){
	
			for(j=0;j<this.tablero[i].length;j++){
	
				let bando = 0
				if(this.tablero[i][j]!=0) bando =abs(this.tablero[i][j]) / this.tablero[i][j];

				if(this.tablero[i][j]!=0)
				this.piezas.push(new Pieza(abs(this.tablero[i][j]),[i,j],this.tam,bando,1,img));

				if(this.tablero[i][j] == -6) this.posK_n = [i,j];
				if(this.tablero[i][j] == 6) this.posK_b = [i,j];


			}
			

			
		}

		// carga movimientos posibles para cada pieza	
		this.movimientos_n =0;
		this.movimientos_b =0;
		for(let k= 0;k<this.piezas.length;k++){

			for(i=0;i<this.tablero.length;i++){
	
				for(j=0;j<this.tablero[i].length;j++){

					if(this.posicionEsValida(this.tablero, this.piezas[k].pos, [i,j])){
				
						if(this.piezas[k].bando > 0){
							this.movimientos_b++;
						}else{
							this.movimientos_n++;
						}
					
						this.piezas[k].movPosibles.push([i,j]);
					}

				}
			}
		}
	}
	

	fCoordMouse(x,y){
		let pos = [-1,-1];
		pos = [(y/this.tam|0),(x/this.tam|0)];
		// tamañox (8) -> this.tablero[0].length*this.tam;   x -> mX 
		if(mouseX > tablero.tablero[0].length*tablero.tam )					
			pos = [-1,-1];
		if(mouseX < 0)					
			pos = [-1,-1];
		if(mouseY > tablero.tablero.length*tablero.tam )
			pos = [-1,-1];
		if(mouseY < 0)					
			pos = [-1,-1];

		return pos;
	}


	mover(pieza,posDestino=[]) {
		if(posDestino.length==0){
			return;
		}
		if(pieza.bando != this.turno) return;


		//valida destino si está en Jaque
		// si jaque
		//if(this.jaque!= 0){
			// aquí se debe validar si en la posición de destino persiste el jaque.
			let _newTablero =JSON.parse( JSON.stringify( this.tablero ) );
			_newTablero[pieza.pos[0]][pieza.pos[1]] = 0;

			_newTablero[posDestino[0]][posDestino[1]] = pieza.tipo*pieza.bando;

			if(this.validaJaque(_newTablero)==pieza.bando){
				console.log("Persiste el Jaque!");
				return;
			}

		//}

	

		//if(!this.validaTipo(pieza,posDestino)) return;

		if(!this.posicionEsValida(this.tablero, pieza.pos, posDestino)){ 
			console.log("Posición Ilegal: "+posDestino);
			return;}

					// valida que la casilla de destino no esté amenazada por el otro bando
		if(pieza.tipo==6)		
		for(let i=0;i<this.piezas.length;i++ ){
			if(this.piezas[i].bando != pieza.bando) // si es una pieza del otro bando 
			for(let j=0;j<this.piezas[i].movPosibles.length;j++){ // se busca si alguna otra pieza amenaza el destino
				if( this.piezas[i].tipo != 1 && this.piezas[i].movPosibles[j][0] ==  posDestino[0]
					&& this.piezas[i].movPosibles[j][1] ==  posDestino[1]){
						console.log("Casilla amenazada: "+posDestino);
					return;
				}
				/*
				// no necesario, ya se valida en el persiste el Jaque!

				if( this.piezas[i].tipo == 1 && this.piezas[i].pos[0] ==  posDestino[0]-1*this.piezas[i].bando
					&& abs(posDestino[1]-this.piezas[i].pos[1])==1){
						console.log("Casilla amenazada por Peón: "+posDestino);
					return;
				}
				*/
			}
		}

		if( pieza.tipo== 6 &&	abs(posDestino[0]==pieza.pos[0]) && abs(posDestino[1]-pieza.pos[1])==2 ){
			//  si es enrroque movemos la torre

			let sentido = posDestino[1]-pieza.pos[1];
			let posTorre = [pieza.pos[0],this.tablero[0].length-1]; // ubicamos posición de la torre.
			if(sentido<0) posTorre = [pieza.pos[0],0];

			this.tablero[pieza.pos[0]][pieza.pos[1]+sentido/abs(sentido)] = this.tablero[posTorre[0]][posTorre[1]];
			this.tablero[posTorre[0]][posTorre[1]] = 0;

		}
		this.tablero[pieza.pos[0]][pieza.pos[1]] = 0;

		this.tablero[posDestino[0]][posDestino[1]] = pieza.tipo*pieza.bando;
		
		// corona Peón
		if(pieza.tipo ==1 && (posDestino[0]==0 || posDestino[0] == this.tablero.length-1))
		this.tablero[posDestino[0]][posDestino[1]] = 5*pieza.bando;
		
		this.movimientos.push(JSON.parse( JSON.stringify( this.tablero ) ));
		
		this.jaque = this.validaJaque(this.tablero);

		if(this.jaque != 0){ console.log("Jaque!"); 

		// Si Jaque Mate.

		

		// 1 Movimientos posibles del rey.

		// 2 posibilidad de eliminar las amenazas.

		// 3 posibilidad de obstruir las amenazas.

	
	
	    }

		// ningún movimiento posible





		//pieza.pos = posDestino;
		this.turno=this.turno*-1

	}

	validaJaque(_matriz){
		// verifica si alguna pieza hace jaque a algún Rey
		let _jaque=0;
		let _posKn, _posKb;
		for(let i = 0; i < _matriz.length; i++) {
			
			for(let j = 0; j < _matriz[i].length; j++) {

				if(_matriz[i][j]==6) _posKb=[i,j];
				if(_matriz[i][j]==-6) _posKn=[i,j];

			}
		
		}

		for(let i = 0; i < _matriz.length; i++) {
			
			for(let j = 0; j < _matriz[i].length; j++) {

				if(_matriz[i][j]!=0)
				if(abs(_matriz[i][j])/_matriz[i][j] >0){

					if(this.posicionEsValida(_matriz, [i,j], _posKn)) 
						_jaque=-1; // jaque al rey negro

				}
				else{
					if(this.posicionEsValida(_matriz, [i,j], _posKb)) 
						_jaque=1; // jaque al rey blanco

				}

			}
		
		}
		return _jaque;
	}

	validaObstaculo(_tablero,origen,destino){
		let valido = true;
			// verificar que no salte
		// diferencia
		let diferenciaX = destino[0] -origen[0];
		let diferenciaY = destino[1] - origen[1];
		// sentido
		let sentidoX = 0;
		if(diferenciaX != 0)
		sentidoX = diferenciaX/abs(diferenciaX);

		let sentidoY = 0;
		if(diferenciaY != 0)
		sentidoY = diferenciaY/abs(diferenciaY);	

		let _x = origen[0];
		let _y = origen[1];

		while (destino[1] != _y || destino[0] != _x) {
			
			_x = _x +sentidoX;
			_y = _y +sentidoY;
			if(destino[1] != _y || destino[0] != _x)
				if(_tablero[_x][_y] != 0) valido = false;

		}

		return valido;
	}
	
	dibujar(color=[255,200,12,255]){
		
		let c=1;
		let _tam = this.tam;
		let _margen=this.margen;
		
		strokeWeight(_margen);
		stroke(color);
		noFill();
		rect(0, 0, this.tablero[0].length*_tam+_margen/2, this.tablero.length*_tam+_margen/2);

		/*
		for(let k= 0;k<this.piezas.length;k++){
			
			this.piezas[k].movPosibles= [];
		}
		*/

		
		for(let i = 0; i < this.tablero.length; i++) {
			
			for(let j = 0; j < this.tablero[i].length; j++) {

				// dibuja tablero
				noStroke();
				if (c==0){ color[3]=255; fill(color); c=1;} 
				else { color[3]=5; fill(color); c=0; }
				square(i*_tam+_margen/2, j*_tam+_margen/2, _tam);

				// dibjuja última jugada.
				if(this.movimientos.length>1)
				if(this.tablero[j][i]!= this.movimientos[this.movimientos.length-2][j][i]){
					
					fill(240,80,12,150);
					square(i*_tam+_margen/2, j*_tam+_margen/2, _tam);
				}


				// dibuja Piezas
				


				// dibuja movimiento posible
				this.dibujaMovimientoPosible(i,j,[12,100,240,80]);


				
			}
			if (c==0){ color[3]=255; fill(color); c=1;} 
				else { color[3]=5; fill(color); c=0; }
		}
		
		
	}

	dibujaMovimientoPosible(i,j,color=[12,100,240,80]){
		// Si no se selecciona una Pieza no continúa
		if(!this.piezaSel) return;
		if(this.piezaSel[0]<0) return;
		if(this.tablero[this.piezaSel[0]][this.piezaSel[1]]==0) return;
		
		let _tam = this.tam;
		let _margen=this.margen;
		let _piezaSel = abs(this.tablero[this.piezaSel[0]][this.piezaSel[1]]);
		let _bando = (this.tablero[this.piezaSel[0]][this.piezaSel[1]])/abs(this.tablero[this.piezaSel[0]][this.piezaSel[1]]);
		
		//if(this.turno!=_bando) return;
						
		noStroke();
		fill(color);
		
		if(this.posicionEsValida(this.tablero, this.piezaSel, [j,i]))
		//square(i*_tam+_margen/2, j*_tam+_margen/2, _tam);
		circle(i*_tam+_tam/2, j*_tam+_tam/2+_margen/2, _tam/2);
				


	}

	

	posicionEsValida(_tablero, posOrigen, posDestino){
		// también util para movimiento posible
		let valido = false;

		let _pieza = abs(_tablero[posOrigen[0]][posOrigen[1]]);
		let _bando = (_tablero[posOrigen[0]][posOrigen[1]])/abs(_tablero[posOrigen[0]][posOrigen[1]]);
		if(_pieza==0) return false;

		// no puede comer a la misma pieza
		if(_tablero[posDestino[0]][posDestino[1]] / abs(_tablero[posDestino[0]][posDestino[1]]) == _bando ){
			return false;
		}
			// aquí se debe validar si en la posición de destino persiste el jaque.
			/*
			let _newTablero =JSON.parse( JSON.stringify( this.tablero ) );
			_newTablero[_pieza.pos[0]][_pieza.pos[1]] = 0;

			_newTablero[posDestino[0]][posDestino[1]] = _pieza*_bando; //se mueve la pieza a la posición final

			if(this.validaJaque(_newTablero)==_bando){
				console.log("Persiste el Jaque!");
				return;
			}

		*/

		switch(_pieza){
			case 1: // Peon
				// avanzar de 1 en 1
				if(posDestino[0]==posOrigen[0]-1*_bando
				   && posDestino[1]==posOrigen[1]
				   && _tablero[posDestino[0]][posDestino[1]] == 0 ) valido = true; 
				// avanzar de 2 en la posición inicial
				if(posDestino[0]==posOrigen[0]-2*_bando
					&& posDestino[1]==posOrigen[1]
					&& _tablero[posDestino[0]][posDestino[1]] == 0
					&& _tablero[posDestino[0]+1*_bando][posDestino[1]] == 0
					&& (posOrigen[0] == 1 || posOrigen[0] == _tablero.length-2)) valido = true;
				//comer
				
				if(posDestino[0]==posOrigen[0]-1*_bando
					&& _tablero[posDestino[0]][posDestino[1]] != 0 
					&& abs(posDestino[1]-posOrigen[1])==1) valido = true; 


				 // falta peón al paso

				break;
			case 2: // Caballo
				if((abs(posDestino[0]-posOrigen[0])==2 && abs(posDestino[1]-posOrigen[1]) == 1)
				|| (abs(posDestino[0]-posOrigen[0])==1 && abs(posDestino[1]-posOrigen[1]) == 2)
				) valido = true;
			
				break;
			case 3: // Alfil
				if(abs(posDestino[0]-posOrigen[0])==abs(posDestino[1]-posOrigen[1])) 
					valido = this.validaObstaculo(_tablero,posOrigen,posDestino);
				
				break;
			case 4: // Torre
				if(posDestino[0]==posOrigen[0]||posDestino[1] ==posOrigen[1]) {
					valido = this.validaObstaculo(_tablero,posOrigen,posDestino);
									
				}
				break;
			case 5: // Dama
				if((abs(posDestino[0]-posOrigen[0])==abs(posDestino[1]-posOrigen[1]))
				|| (posDestino[0]==posOrigen[0]||posDestino[1] ==posOrigen[1]))
				valido = this.validaObstaculo(_tablero,posOrigen,posDestino);
				break;
			case 6: // Rey

				

				if(	abs(posDestino[0]-posOrigen[0])<=1	&& abs(posDestino[1]-posOrigen[1])<=1 ) valido = true;
				
				
				// Enrroque
				if(	abs(posDestino[0]==posOrigen[0]) && abs(posDestino[1]-posOrigen[1])==2 ){

					

					let sentido = posDestino[1]-posOrigen[1];
					let posTorre = [posOrigen[0],_tablero[0].length-1]; // ubicamos posición de la torre.
					if(sentido<0) posTorre = [posOrigen[0],0];

					//verificamos  si hay obstáculo

					if(this.validaObstaculo(_tablero,posOrigen,posTorre)){
						valido = true;
						// verificamos que no se hayan movido el Rey o la Torre
						for(let k=0;k<this.movimientos.length;k++){
							if(_tablero[posOrigen[0]][posOrigen[1]]!= this.movimientos[k][posOrigen[0]][posOrigen[1]]
							|| _tablero[posTorre[0]][posTorre[1]]!= this.movimientos[k][posTorre[0]][posTorre[1]]
								){ 
									valido = false;
									break;
								}

						}
					}else{
						valido = false;
					}

					


				}

				
				

				break;

			default:
				valido = false;
				break;	

		}
		
		return valido;
	}


	
}