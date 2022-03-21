import { EnemyBombs } from "./enemy-bombs.model";
import { EnemyShots } from "./enemy-shots.model";
export class Enemy {
    private gameStruct: any;
    private cx!: CanvasRenderingContext2D;
    public width: number = 0;
    public height: number = 0;
    public x: number = 0;
    public y: number = 0;

    initialize(gameStruct: any, gameContentCX: any, canvasEl: any, i: number, j: number) {
        this.gameStruct = gameStruct;
        this.cx = gameContentCX;
        this.width = canvasEl.width / 15;
        this.height = canvasEl.width / 15;
        this.x = j * this.width*1.9;
        if(i<=10) {
            this.y = 0;
        } else if (i>=10 && i<=20) {
            this.y = canvasEl.height/ 7;
        } else if (i>=20 && i<=30) {
            this.y = canvasEl.height/ 3.5;
        } else if (i>=30 && i<=40) {
            this.y = canvasEl.height/ 2.2;
        } else if (i>=40 && i<=50) {
            this.y = canvasEl.height/ 1.6;
        }
        return this;
    }

    draw(i: number) {
        this.cx.drawImage(this.gameStruct.imgEnemy, this.x, this.gameStruct.arrayEnemies[i].y, this.width, this.height);
        createShoot(this);
        createBomb(this);

        function createShoot(context: any) {
            context.gameStruct.arrayEnemies.forEach(function(currentEnemy: Enemy, i: number) {
                // Això és la IA dels enemics
                if (Math.floor(Math.random() * 500/context.gameStruct.currentLevel) == 0) {
                    const currentShot = new EnemyShots;
                    context.enemyShots = currentShot;
                    currentShot.initialize(currentEnemy, context.gameStruct)
                    context.gameStruct.arrayEnemyShots.push(currentShot);
                }
            });
        }

        function createBomb(context: any) {
            context.gameStruct.arrayEnemies.forEach(function(currentEnemy: Enemy, i: number) {
                if(Math.floor(Math.random() * 500) === 0 && context.gameStruct.arrayEnemyBombs.length === 0 && context.gameStruct.currentLevel > 2) {
                    const currentBomb = new EnemyBombs;
                    context.enemyBombs = currentBomb;
                    currentBomb.initialize(currentEnemy, context.gameStruct)
                    context.gameStruct.arrayEnemyBombs.push(currentBomb);
                }
            }); 
        }
    }
}