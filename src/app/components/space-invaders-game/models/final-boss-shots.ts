export class FinalBossShots {
	private gameStruct: any;
    private cx?: CanvasRenderingContext2D;
    private x: number = 0;
    private y: number = 0;
    private width: number = 0;
    private height: number = 0;

	initialize(gameStruct: any, boss: any) {
		this.gameStruct = gameStruct;
		this.cx = gameStruct.gameContentCX;
		this.x = boss.x+boss.width/2;
		this.y = boss.y+boss.height;
		this.width = 24;
		this.height = 36;
		return this;
	}

	draw() {
		move(this)
		this.cx!.drawImage(this.gameStruct.imgEnemyShots, this.x, this.y, this.width, this.height);
		function move(context: any) {
			context.y = context.y+3;
		}
	}
}