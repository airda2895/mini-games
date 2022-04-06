import { Component, ViewChild, Output, EventEmitter, AfterViewInit, HostListener } from '@angular/core';
import { Board } from 'src/app/models/board.model';
import { CheckHits } from './models/check-hits.model';
import { Enemy } from './models/enemy.model';
import { Player } from './models/player.model';
import { FinalBoss } from './models/final-boss.model';
import { FinalBossShots } from './models/final-boss-shots';
import { PlayerShots } from './models/player-shots.model';
import { EnemyShots } from './models/enemy-shots.model';
import { EnemyBombs } from './models/enemy-bombs.model';
import { CountdownConfig } from 'ngx-countdown';

@Component({
  selector: 'space-invaders-game',
  templateUrl: './space-invaders-game.component.html',
  styleUrls: ['./space-invaders-game.component.css']
})
export class SpaceInvadersGameComponent  implements AfterViewInit {
  @ViewChild('gameContentRef', {static: false}) gameContentRef: any;
  @ViewChild('gameInfoRef', {static: false}) gameInfoRef: any;
  @ViewChild('cd', {static: false}) cd: any;

  private button1 = {x: 0, y: 0, width: 215, heigth: 100};

  public countdownConfig: CountdownConfig = {leftTime: 360, format: 'mm:ss', demand: false};

  private gameStruct: {
    player?: Player,
    currentLevel: number,
    finalBoss?: FinalBoss,
    checkHits: CheckHits,
    KEY_LEFT: number,
    KEY_RIGHT: number,
    KEY_SPACEBAR: number,
    keyboard: Array<boolean>,
    gameContent?: Board;
    gameContentCX?: CanvasRenderingContext2D;
    gameContentEl?: HTMLCanvasElement;
    arrayEnemies: Enemy[];
    arrayEnemyShots: EnemyShots[];
    arrayEnemyBombs: EnemyBombs[];
    arraySpaceShipShots: PlayerShots[];
    arrayFinalBossShots: FinalBossShots[];
    imgScenario: HTMLImageElement;
    imgPlayer: HTMLImageElement;
    imgPlayerShots: HTMLImageElement;
    imgEnemy:  HTMLImageElement;
    imgEnemyShots: HTMLImageElement;
    imgFinalBoss1: HTMLImageElement;
		imgFinalBoss2: HTMLImageElement;
		imgFinalBoss3: HTMLImageElement;
		imgFinalBoss4: HTMLImageElement;
    imgBomb: HTMLImageElement;
    score: number;
  } = {
    checkHits: new CheckHits(),
    currentLevel: 1,
    KEY_LEFT: 37,
    KEY_RIGHT: 39,
    KEY_SPACEBAR: 32,
    arrayEnemies: [],
    arrayEnemyShots: [],
    arrayEnemyBombs: [],
    arraySpaceShipShots: [],
    arrayFinalBossShots: [],
    keyboard: [],
    imgPlayer: new Image(),
    imgPlayerShots: new Image(),
    imgScenario: new Image(),
    imgEnemy: new Image(),
    imgEnemyShots: new Image(),
    imgFinalBoss1: new Image(),
    imgFinalBoss2: new Image(),
    imgFinalBoss3: new Image(),
    imgFinalBoss4: new Image(),
    imgBomb: new Image(),
    score: 0
  };

  private gameLost = false;
  private wonGame = false;
  private gameOver = false;
  private gamePaused = false;
  private finalBoss = new FinalBoss();
  private enemy = new Enemy();
  private player = new Player();

  private gameInfoCX!: CanvasRenderingContext2D;
  private gameInfo: Board | undefined;
  private gameInfoEl?: HTMLCanvasElement;
  private scrollBackground = 0;
  private currentAnimation: any;

  

  @HostListener('document:click', ['$event']) onClick = (e: any): void => {
    if(this.isInside(e, this.button1) && (this.gameLost || this.wonGame)) {
      this.playAgain();
    }
  }

  @HostListener('document:keydown', ['$event']) onKeyDown = (e: any) => {
    this.gameStruct.keyboard[e.keyCode] = true;

    if(e.keyCode === 80) {
      this.gamePaused = !this.gamePaused;
      if(this.cd.status === 1) {
        this.cd.resume();
        this.animate();
      } else { 
        this.cd.pause();
        cancelAnimationFrame(this.currentAnimation);
      }
    }
  }


  @HostListener('document:keyup', ['$event']) onKeyUp = (e: any) => {
    this.gameStruct.keyboard[e.keyCode] = false;
  }

  public finishedTimer($event: any) {
    if($event.left <= 0) {
      cancelAnimationFrame(this.currentAnimation);
      this.gameOver = true;
      this.drawGameOverScreen();
    }
  }

  isInside(pos:any, rect: any): boolean {
    return pos.offsetX > rect.x && pos.offsetX < rect.x+rect.width && pos.offsetY < rect.y+rect.heigth && pos.offsetY > rect.y
  }

  playAgain(): any {
    if(this.wonGame) this.gameStruct.currentLevel = 1;
    this.player.life = 3;
    this.gameStruct.arrayEnemies = [];
    this.initializeEnemies();
    this.finalBoss.life = 25;
    this.gameLost = false;
    this.wonGame = false;
    this.drawInfoText();
  }

  ngAfterViewInit(): void {
    this.gameStruct.gameContentEl = this.gameContentRef.nativeElement;
    this.gameStruct.gameContent = new Board(800, 500, this.gameStruct.gameContentEl);
    this.gameStruct.gameContent.setCanvasConfig();
    this.gameStruct.gameContentCX = this.gameStruct.gameContent.getCanvas().cx;

    this.gameInfoEl = this.gameInfoRef.nativeElement;
    this.gameInfo = new Board(800, 50, this.gameInfoEl);
    this.gameInfo.setCanvasConfig();
    this.gameInfoCX = this.gameInfo.getCanvas().cx;
    this.loadPictures();
  }

  loadPictures(): void {
    this.gameStruct.imgScenario.src = 'assets/space-invaders/scenario.png';
    this.gameStruct.imgPlayer.src = 'assets/space-invaders/player.png';
    this.gameStruct.imgPlayerShots.src = 'assets/space-invaders/playerShot.png'
    this.gameStruct.imgEnemy.src = 'assets/space-invaders/enemy.png';
    this.gameStruct.imgEnemyShots.src = 'assets/space-invaders/enemyShot.png';
    this.gameStruct.imgFinalBoss1.src = 'assets/space-invaders/finalBoss1.png';
    this.gameStruct.imgFinalBoss2.src = 'assets/space-invaders/finalBoss2.png';
    this.gameStruct.imgFinalBoss3.src = 'assets/space-invaders/finalBoss3.png';
    this.gameStruct.imgFinalBoss4.src = 'assets/space-invaders/finalBoss4.png';
    this.gameStruct.imgBomb.src = 'assets/space-invaders/bomb.png';
    
    this.gameStruct.imgBomb.onload = () => {
      this.initializeEnemies();
      this.initializePlayer();
      this.initializeFinalBoss();
      this.animate();
    }
  }

  animate(): void {
    this.drawInfoText();
    this.drawScenario();
    this.drawPlayer();
    this.drawEnemies();
    this.drawFinalBoss();
    this.checkScore();
    this.currentAnimation = requestAnimationFrame(this.animate.bind(this));
  }

  checkScore(): void {
    if(this.player.life < 0) {
      this.player.life = 0;
      this.gameLost = true;
    }
    if(this.gameStruct.arrayEnemies!.length === 0 && this.gameStruct.currentLevel < 4) {
      this.gameStruct.currentLevel++;
      if(this.gameStruct.currentLevel < 5)this.initializeEnemies();
    }
    if(this.gameLost) {
      this.drawGameLostScreen();
    }
    if(this.finalBoss.life <= 0 && this.gameStruct.arrayEnemies.length === 0) {
      this.wonGame = true;
      this.drawGameWonScreen();
    }
  }

  clearGameContent(): void {
    this.gameStruct.gameContentCX!.clearRect(0, 0, this.gameStruct.gameContentEl!.width, this.gameStruct.gameContentEl!.height);
  }

  drawGameLostScreen(): void {
    this.clearGameContent();
    this.drawTitleMenuScreen('40px', 'You lost!');
    this.drawButtonMenuScreen('40px', this.button1, 'Play again', this.gameStruct.gameContentEl!.height/2.65, this.gameStruct.gameContentEl!.height/2, 100);
  }

  private drawGameOverScreen(): void {
    this.clearGameContent();
    this.drawTitleMenuScreen('40px', 'Game over');
  }
  
  drawGameWonScreen(): void {
    this.clearGameContent();
    this.drawTitleMenuScreen('60px', 'You won!');
    this.drawButtonMenuScreen('40px', this.button1, 'Play again', this.gameStruct.gameContentEl!.height/2.65, this.gameStruct.gameContentEl!.height/2, 100);
  }

  drawTitleMenuScreen(fontSize: string, text: string): void {
    this.gameStruct.gameContentCX!.font = `${fontSize} Arial`;
    this.gameStruct.gameContentCX!.fillStyle = "white";
    this.gameStruct.gameContentCX!.textAlign = "center";
    this.gameStruct.gameContentCX!.fillText(text, this.gameStruct.gameContentEl!.width/2, this.gameStruct.gameContentEl!.height/5);
  }

  drawButtonMenuScreen(fontSize: string, button: any, text: string, buttonPosY: number, textPosY: number, buttonHeight: number): void {
    this.gameStruct.gameContentCX!.beginPath();
    this.gameStruct.gameContentCX!.strokeStyle = 'white';
    button.x = this.gameStruct.gameContentEl!.width/2.75;
    button.y = buttonPosY;
    this.gameStruct.gameContentCX!.rect(button.x, button.y, 215, buttonHeight);
    this.gameStruct.gameContentCX!.stroke();
    this.gameStruct.gameContentCX!.closePath();
    this.gameStruct.gameContentCX!.font = `${fontSize} Arial`;
    this.gameStruct.gameContentCX!.fillStyle = 'white';
    this.gameStruct.gameContentCX!.fillText(text, this.gameStruct.gameContentEl!.width/2, textPosY);
  }

  initializeEnemies(): void {
    let j = 0;
    for (let i=0; i <= 7; i++) {
      if(j==10 || j==30 || j==40 || j==50) {
        j = 0;
      }
      const enemy = new Enemy;
      this.enemy = enemy;
      enemy.initialize(this.gameStruct, this.gameStruct.gameContentCX, this.gameStruct.gameContentEl, i, j);
      this.gameStruct.arrayEnemies!.push(enemy);
      j++;   		
    }
  }

  initializeFinalBoss(): void {
    this.gameStruct.finalBoss = this.finalBoss.initialize(this.gameStruct);
  }

  initializePlayer(): void {
    this.player.initialize(this.gameStruct);
		this.gameStruct.player = this.player;
  }

  drawEnemies(): void {
    for (var i = 0; i<this.gameStruct.arrayEnemies!.length; i++) {
      this.gameStruct.arrayEnemies![i].draw(i);
    }
    for (var i = 0; i < this.gameStruct.arrayEnemyShots!.length; i++) {
      this.gameStruct.arrayEnemyShots![i].draw();
      if(this.gameStruct.arrayEnemyShots![i].y >= this.gameStruct.gameContentEl!.width) {
          this.gameStruct.arrayEnemyShots!.splice(i, 1);
      }
    }
    for (var i = 0; i < this.gameStruct.arrayEnemyBombs!.length; i++) {
      this.gameStruct.arrayEnemyBombs![i].draw();
      if(this.gameStruct.arrayEnemyBombs![i].y >= this.gameStruct.gameContentEl!.width) {
          this.gameStruct.arrayEnemyBombs!.splice(i, 1);
      }
    }
    this.gameStruct.checkHits.checkHitsEnemy(this.gameStruct);
  }

  drawFinalBoss(): void {
    if(this.gameStruct.currentLevel === 4 && this.gameStruct.finalBoss!.life > 0) {
      this.gameStruct.finalBoss = this.finalBoss.draw();
    }
  }


  drawScenario(): void {
    if (this.scrollBackground >= this.gameStruct.gameContentEl!.height) {
      this.scrollBackground = 0;
    }

    this.scrollBackground += 0.25; 
    this.gameStruct.gameContentCX!.drawImage(this.gameStruct.imgScenario, 0, 0, this.gameStruct.imgScenario!.width, this.gameStruct.imgScenario!.height, 0, -this.gameStruct.gameContentEl!.height+this.scrollBackground, this.gameStruct.gameContentEl!.width, this.gameStruct.gameContentEl!.height);
		this.gameStruct.gameContentCX!.drawImage(this.gameStruct.imgScenario, 0, 0, this.gameStruct.imgScenario!.width, this.gameStruct.imgScenario!.height, 0, this.scrollBackground, this.gameStruct.gameContentEl!.width, this.gameStruct.gameContentEl!.height);
  }

  drawPlayer(): void {
    this.player.draw();
    this.gameStruct.checkHits.checkHitsPlayer(this.gameStruct);
  }

  drawInfoText(): void {
    this.gameInfoCX.clearRect(0, 0, this.gameInfoEl!.width, this.gameInfoEl!.height);
    this.gameInfoCX.font = "30px Arial";
    this.gameInfoCX.fillStyle = "white";
    this.gameInfoCX.textAlign = "center";
    this.gameInfoCX.fillText(`Game 2: Space Invaders | Life: ${this.gameStruct.player!.life} | Level: ${this.gameStruct!.currentLevel}`, this.gameInfoEl!.width/2, this.gameInfoEl!.height/1.5);
  }
}
