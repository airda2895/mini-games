/**
* Aquesta classe tindrà, a part del constructor, dos mètodes "públics": initialize() i draw().
* La funció moveSpaceShip() serà "privada". Com que estrictament no existeix l'encapsulació en JavaScript,
* per fer privada la funció moveSpaceShip() cal passar-li el context (this) de la classe Player, perquè sinó
* no podrà accedir a les seves variables.
*/
import { PlayerShots } from "./player-shots.model";
export class Player {
    private gameStruct: any;
    private cx?: CanvasRenderingContext2D;
    private width: number = 0;
    private height: number = 0;
    private x: number = 0;
    private y: number = 0;
    private playerShots: PlayerShots;
    private keyboard: Array<boolean> = [];
    private limitTop: number = 0;
    private limitBottom: number = 0;
    private limitLeft: number = 0;
    private limitRight: number = 0;
    private shiftX: number = 0;
    private shiftY: number = 0;
    public life: number = 0;
    private usedBombs: number = 0;

	constructor() {
		this.playerShots = new PlayerShots();
		/*this.bomb = new Bomb;
		this.fire = false;*/
	}

	initialize(gameStruct: any) {
		/**
		* La mida de la nau, així com la seva velocitat, sempre serà relatiu a la mida del canvas.
		* Si no es fes així, la jugabilitat es veuria afectada en funció de la mida de la pantalla.
		* Per exemple, si el desplaçament és un valor absolut, tardariem més en desplaçar-nos si
		* la pantalla és de 1920x1080 respecte a 640x480.
		*/
		this.gameStruct = gameStruct;
		this.cx = gameStruct.gameContentCX;
		this.keyboard = gameStruct.keyboard;
		this.width = gameStruct.gameContentEl.width / 15;
		this.height = gameStruct.gameContentEl.width / 15;
		this.x = (gameStruct.gameContentEl.width / 2) - (this.width / 2);
		this.y = gameStruct.gameContentEl.height-this.height;
		this.limitTop = 0;
		this.limitBottom = gameStruct.gameContentEl.height;
		this.limitLeft = 0;
		this.limitRight = gameStruct.gameContentEl.width;
		this.shiftX = this.width / 8; // desplaçament en l'eix de les X (avança 1/8 de la seva mida)
		this.shiftY = this.height / 8; // desplaçament en l'eix de les Y (avança 1/8 de la seva mida)
		this.life = 3;
		this.usedBombs = 2;
		return this;
	}

	draw() {
		moveSpaceShip(this);
		if(this.gameStruct.arraySpaceShipShots.length>0) {
			this.shoot(this);
			this.deleteShot(this);
		}
		this.cx!.drawImage(this.gameStruct.imgPlayer, this.x, this.y, this.width, this.height);
		return this.gameStruct;
		function moveSpaceShip(context: any) {
			if (context.keyboard[context.gameStruct.KEY_LEFT]) {
				context.x -= context.shiftX;
				if (context.x <= context.limitLeft) context.x = context.limitLeft;
			} else if (context.keyboard[context.gameStruct.KEY_RIGHT]) {
				context.x += context.shiftX;
				if (context.x >= (context.limitRight - context.width)) context.x = (context.limitRight - context.width);
			}
			if (context.keyboard[context.gameStruct.KEY_SPACEBAR]) {
				if (!context.fire) {
					//context.gameStruct.shotSound.play();
					context.createNewShot(context);
					context.fire = true;
				}
			} else if(context.keyboard[context.gameStruct.KEY_CTRL]) {
				if (!context.fire && context.usedBombs<=2 && context.usedBombs>=1) {
					context.gameStruct.shotSound.play();
					context.createBomb(context);
					context.fire = true;
					context.usedBombs--;
				}
			} else {
				context.fire = false;
			}
		}
	}
	createNewShot(context: any) {
		let currentShot = new PlayerShots;
		context.spaceShipShots = currentShot;
		currentShot.initialize(context.gameStruct, context.x, context.y);
		context.gameStruct.arraySpaceShipShots.push(currentShot);
	}
	shoot(context: any) {
		for(var i = 0; i<context.gameStruct.arraySpaceShipShots.length; i++) {
			context.gameStruct.arraySpaceShipShots[i] = context.gameStruct.arraySpaceShipShots[i].draw();
		}
	}
	deleteShot(context: any) {
		for(var i = 0; i<context.gameStruct.arraySpaceShipShots.length; i++) {
			if(context.gameStruct.arraySpaceShipShots[i].y<=0) {
				context.gameStruct.arraySpaceShipShots.splice(i, 1);
			}
		}
	}
} 