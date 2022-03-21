import { FinalBossShots } from "./final-boss-shots";

export class FinalBoss {
    private defaultFinalBossWidth: number;
    private defaultFinalBossHeight: number;
    private finalBossShots: FinalBossShots;
    private goToLeft: boolean;
    private goToRight: boolean;
    private goToBottom: boolean;
    private goToTop: boolean;
    private gameStruct: any;
    private cx?: CanvasRenderingContext2D;
    private width: number = 0;
    private height: number = 0;
    private x: number = 0;
    private y: number = 0;
    public life: number = 0;
	
	constructor() { 
		this.defaultFinalBossWidth = 500;
        this.defaultFinalBossHeight = 325; 
        this.finalBossShots = new FinalBossShots;
        this.goToLeft = false;
        this.goToRight = true;
        this.goToBottom = false;
        this.goToTop = false;
    }
	initialize(gameStruct: any) {
		this.gameStruct = gameStruct;
		this.cx = gameStruct.gameContentCX;
		this.width = gameStruct.gameContent.width / 4;
		this.height = gameStruct.gameContent.width / 4;
		this.x = 0;
		this.y = 0;
		this.life = 25;
		return this;
	}

	draw() {
		move(this);
		if(this.gameStruct.finalBoss.life<=25 && this.gameStruct.finalBoss.life>15) {
			this.cx!.drawImage(this.gameStruct.imgFinalBoss1, this.x, this.y, this.width, this.height);
		} else if (this.gameStruct.finalBoss.life<=15 && this.gameStruct.finalBoss.life>7) {
			this.cx!.drawImage(this.gameStruct.imgFinalBoss2, this.x, this.y, this.width, this.height);
		} else if (this.gameStruct.finalBoss.life<=7 && this.gameStruct.finalBoss.life>3) {
			this.cx!.drawImage(this.gameStruct.imgFinalBoss3, this.x, this.y, this.width, this.height);
		} else if (this.gameStruct.finalBoss.life<=3 && this.gameStruct.finalBoss.life>0) {
			this.cx!.drawImage(this.gameStruct.imgFinalBoss4, this.x, this.y, this.width, this.height);
		}
		createShot(this);
		shot(this);
		this.gameStruct.finalBoss = this;
		function createShot(context: any) {
			if (Math.floor(Math.random() * 30) == 0) {
				var currentShot = new FinalBossShots
				context.finalBossShots = currentShot;
				currentShot.initialize(context.gameStruct, context);
				context.gameStruct.arrayFinalBossShots.push(currentShot);
			}
		}
		function shot(context: any) {
			for(var i = 0; i<context.gameStruct.arrayFinalBossShots.length; i++) {
				context.gameStruct.arrayFinalBossShots[i].draw();
				if(context.gameStruct.arrayFinalBossShots[i].y>=context.cx.height) {
					context.gameStruct.arrayFinalBossShots.splice(i, 1);
				}
			}
		}
		function move(context: any) {

			if(context.goToLeft) {
				context.x = context.x - 3;
			} else if (context.gotoRight) {
				context.x = context.x + 3;
			}

			if(context.x >= context.gameStruct.gameContentEl.width-context.width) {
				context.goToLeft = true;
				context.gotoRight = false;
			} else if (context.x <= 0) {
				context.goToTop = false;
				context.goToBottom = false;
				context.gotoRight = true;
				context.goToLeft = false;
			} else if (Math.round(context.x) == Math.floor(Math.random() * context.cx.width/2) + 1 && context.y <= 0) {
				context.goToLeft = false;
				context.gotoRight = false;
				context.goToBottom = true;
			} else if (context.y >= context.cx.height-context.height-10) {
				context.goToBottom = false;
				context.goToTop = true;
			}
			if(context.y <0) {
				context.goToTop = false;
				context.goToLeft = true;
				context.y = 0;
			
			}
		}
	return this;
	}
}