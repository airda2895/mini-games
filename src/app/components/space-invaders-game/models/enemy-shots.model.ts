import { Enemy } from "./enemy.model";

export class EnemyShots {
	private defaultEnemyShotHeight: number;
	private defaultEnemyShotWidth: number;
	private gameStruct: any;
	private cx?: CanvasRenderingContext2D;
	private x: number = 0;
	public y: number = 0;
	private width: number = 0;
	private height: number = 0;
	constructor() {
		this.defaultEnemyShotHeight = 33;
		this.defaultEnemyShotWidth = 33;
	}
	
	initialize(currentEnemy: Enemy, gameStruct: any) {
		this.gameStruct = gameStruct;
		this.cx = gameStruct.gameContentCX;
		this.x = currentEnemy.x + (currentEnemy.width/2) - 10;
		this.y = currentEnemy.width;
		if(gameStruct.gameContent.width<=1000) {
			this.width = gameStruct.gameContent.width / 35;
			this.height = gameStruct.gameContent.width / 35;
		} else {
			this.width = this.defaultEnemyShotWidth;
			this.height = this.defaultEnemyShotHeight;
		}
	}
	
	draw() {	
		moveShot(this);
        this.cx!.drawImage(this.gameStruct.imgEnemyShots, this.x, this.y, this.width, this.height);
        function moveShot(context: any) {
        	context.y = context.y + 3;
        }
	}
}