export class PlayerShots {
	private gameStruct: any;
    private cx?: CanvasRenderingContext2D;
    private width: number = 0;
    private height: number = 0;
    private x: number = 0;
    private y: number = 0;
	initialize(gameStruct: any, xShot: number, yShot: number) {
        this.gameStruct = gameStruct;
		this.cx = gameStruct.gameContentCX;
		this.width = 24;
		this.height = 36;
		this.x = xShot+gameStruct.player.width/3;
		this.y = yShot
		return this;
	}
	draw() {
		moveShot(this)
        this.cx!.drawImage(this.gameStruct.imgPlayerShots, this.x, this.y);
        function moveShot(context: any) {
        	context.y = context.y - 3;
        }
        return this;
  	}
}