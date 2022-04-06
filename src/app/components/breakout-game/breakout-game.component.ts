import { Component, AfterViewInit, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { Board } from 'src/app/models/board.model';
import { CountdownConfig } from 'ngx-countdown';
@Component({
  selector: 'breakout-game',
  templateUrl: './breakout-game.component.html',
  styleUrls: ['./breakout-game.component.css']
})


export class BreakoutGameComponent implements AfterViewInit {
  // GAME VARIABLES AND CONSTANTS
  @ViewChild('gameContentRef', {static: false}) gameContentRef: any;
  @ViewChild('gameInfoRef', {static: false}) gameInfoRef: any;
  @ViewChild('cd', {static: false}) cd: any;

  private gameContentCX!: CanvasRenderingContext2D;
  private gameContent: Board | undefined;
  private gameContentEl?: HTMLCanvasElement;

  private gameInfoCX!: CanvasRenderingContext2D;
  private gameInfo: Board | undefined;
  private gameInfoEl?: HTMLCanvasElement;

  private PADDLE_WIDTH = 100;
  private PADDLE_MARGIN_BOTTOM = 50;
  private PADDLE_HEIGHT = 20;
  private BALL_RADIUS = 8;
  private LIFE = 3; // PLAYER HAS 3 LIVES
  private SCORE = 0;
  private SCORE_UNIT = 10;
  private LEVEL = 0;
  private MAX_LEVEL = 3;
  private GAME_OVER = false;
  private GAME_PAUSED = false;
  private LOST_GAME = false;
  private WON_GAME = false;
  private leftArrow = false;
  private rightArrow = false;
  private BG_IMG = new Image();
  private paddle: any;
  private ball: any = {
    x : null,
    y : null,
    radius : null,
    speed : 4,
    dx : null,
    dy : null
  };
  private frame: any;
  private brick = {
    row : 1,
    column : 5,
    width : 55,
    height : 20,
    offSetLeft : 20,
    offSetTop : 20,
    marginTop : 40,
    fillColor : "#2e3548",
    strokeColor : "#FFF"
  }
  private bricks: any[] = [];

  private button1 = {x: 0, y: 0, width: 215, heigth: 100};
  private button2 = {x: 0, y: 0, width: 215, heigth: 100};

  public countdownConfig: CountdownConfig = {leftTime: 500, format: 'mm:ss', demand: false};

  ngAfterViewInit(): void {

    this.gameContentEl = this.gameContentRef.nativeElement;
    this.gameContent = new Board(400, 500, this.gameContentEl);
    this.gameContent.setCanvasConfig();
    this.gameContentCX = this.gameContent.getCanvas().cx;

    this.gameInfoEl = this.gameInfoRef.nativeElement;
    this.gameInfo = new Board(800, 50, this.gameInfoEl);
    this.gameInfo.setCanvasConfig();
    this.gameInfoCX = this.gameInfo.getCanvas().cx;

    this.BG_IMG.src = 'assets/breakout-game/bg.jpg';
    this.BG_IMG.onload = () => {
      this.createPaddle();
      this.createBall();
      this.createBricks();
      this.drawInfoText();
      this.loop();
    }
  }

  public finishedTimer($event: any) {
    if($event.left <= 0) {
      this.GAME_OVER = true;
      this.drawGameOverScreen();
    }
  }

  @HostListener('document:click', ['$event']) onClick = (e: any): void => {
    if (this.isInside(e, this.button1) && (this.LOST_GAME || this.WON_GAME)) {
      this.playAgain();
    }
  }

  @HostListener('document:keydown', ['$event']) onKeyDown = (e: any): void => {
    if(e.keyCode == 37) {
      this.leftArrow = true;
    } else if(e.keyCode == 39){
      this.rightArrow = true;
    }
  }

  private isInside(pos:any, rect: any): boolean {
    return pos.offsetX > rect.x && pos.offsetX < rect.x+rect.width && pos.offsetY < rect.y+rect.heigth && pos.offsetY > rect.y
  }

  @HostListener('document:keyup', ['$event']) onKeyUp = (e: any): void => {
    if(e.keyCode == 37) {
      this.leftArrow = false;
    } else if(e.keyCode == 39) {
      this.rightArrow = false;
    }

    if(e.keyCode === 80) {
      this.GAME_PAUSED = !this.GAME_PAUSED;
      (this.cd.status === 1) ? this.cd.resume() : this.cd.pause();
      this.loop();
    }
  }

  private playAgain(): void {
    if(Math.floor(Math.random() * 100) < 30) alert('');
    if(this.WON_GAME) {
      this.WON_GAME = false;
      this.brick.row = 1;
      this.ball.speed = 4;
    } else {
      this.LOST_GAME = false;
    }
    this.LIFE = 3;
    this.SCORE = 0;
    this.drawInfoText();
    this.createBricks();
    this.loop();

  }

  // DRAW FUNCTION
  private draw(): void {
    this.drawPaddle();
    this.drawBall();
    this.drawBricks();
  }

  // UPDATE GAME FUNCTION
  private update(): void {
    this.movePaddle();
    this.moveBall();
    this.ballWallCollision();
    this.ballPaddleCollision();
    this.ballBrickCollision();
    this.levelUp();
  }

  // GAME LOOP
  private loop(): void {
    // CLEAR THE CANVAS
    this.gameContentCX.drawImage(this.BG_IMG, 0, 0);
    
    this.draw();
    this.update();
    
    if(!this.LOST_GAME && !this.GAME_OVER && !this.WON_GAME && !this.GAME_PAUSED && this.LIFE > 0) {
      this.frame = requestAnimationFrame(() => {this.loop()});
    } else if(!this.WON_GAME && !this.GAME_PAUSED) {
      this.LOST_GAME = true;
      cancelAnimationFrame(this.frame);
      this.drawGameLostScreen();
    } else if (this.GAME_PAUSED) {
      cancelAnimationFrame(this.frame);
    } else {
      cancelAnimationFrame(this.frame);
      this.drawGameWonScreen();
    }
  }

  // level up
  private levelUp(): void{
    let isLevelDone = true;
    // check if all the bricks are broken
    for(let r = 0; r < this.brick.row; r++){
        for(let c = 0; c < this.brick.column; c++){
            isLevelDone = isLevelDone && ! this.bricks[r][c].status;
        }
    }
    
    if(isLevelDone) {
      if(this.LEVEL >= this.MAX_LEVEL) {
        this.WON_GAME = true;
          return;
      }
      this.brick.row++;
      this.createBricks();
      this.ball.speed += 1;
      this.createBall();
      this.LEVEL++;
    }
  }

  // CREATE PADDLE
  private createPaddle():void {
    this.paddle = {
      x : this.gameContentEl!.width/2 - this.PADDLE_WIDTH/2,
      y : this.gameContentEl!.height - this.PADDLE_MARGIN_BOTTOM - this.PADDLE_HEIGHT,
      width : this.PADDLE_WIDTH,
      height : this.PADDLE_HEIGHT,
      dx :5
    }
  }
  // CREATE THE BALL
  private createBall(): void {
    this.ball.x = this.gameContentEl!.width/2;
    this.ball.y = this.paddle.y - this.BALL_RADIUS;
    this.ball.radius = this.BALL_RADIUS;
    this.ball.dx = 3 * (Math.random() * 2 - 1);
    this.ball.dy = -3;
  }

  // CREATE THE BRICKS
  private createBricks(): void {
    for(let r = 0; r < this.brick.row; r++){
      this.bricks[r] = [];
      for(let c = 0; c < this.brick.column; c++){
        this.bricks[r][c] = {
              x : c * ( this.brick.offSetLeft + this.brick.width ) + this.brick.offSetLeft,
              y : r * ( this.brick.offSetTop + this.brick.height ) + this.brick.offSetTop + this.brick.marginTop,
              status : true
          }
      }
    }
  }

  // draw the bricks
  private drawBricks(): void {
    for(let r = 0; r < this.brick.row; r++){
        for(let c = 0; c < this.brick.column; c++){
            let b = this.bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                this.gameContentCX.fillStyle = this.brick.fillColor;
                this.gameContentCX.fillRect(b.x, b.y, this.brick.width, this.brick.height);
                
                this.gameContentCX.strokeStyle = this.brick.strokeColor;
                this.gameContentCX.strokeRect(b.x, b.y, this.brick.width, this.brick.height);
            }
        }
    }
  }

  // ball brick collision
  private ballBrickCollision(): void {
    for(let r = 0; r < this.brick.row; r++){
        for(let c = 0; c < this.brick.column; c++){
            let b = this.bricks[r][c];
            // if the brick isn't broken
            if(b.status){
                if(this.ball.x + this.ball.radius > b.x && this.ball.x - this.ball.radius < b.x + this.brick.width && this.ball.y + this.ball.radius > b.y && this.ball.y - this.ball.radius < b.y + this.brick.height){
                  this.ball.dy = - this.ball.dy;
                  b.status = false; // the brick is broken
                  this.SCORE += this.SCORE_UNIT;
                  this.drawInfoText();
                }
            }
        }
    }
  }

  // DRAW PADDLE
  private drawPaddle(): void {
    this.gameContentCX.fillStyle = "#2e3548";
    this.gameContentCX.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    
    this.gameContentCX.strokeStyle = "#ffcd05";
    this.gameContentCX.strokeRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
  }

  // DRAW THE BALL
  private drawBall(): void {
    this.gameContentCX.beginPath();
    
    this.gameContentCX.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI*2);
    this.gameContentCX.fillStyle = "#ffcd05";
    this.gameContentCX.fill();
    
    this.gameContentCX.strokeStyle = "#2e3548";
    this.gameContentCX.stroke();
    
    this.gameContentCX.closePath();
  }

  // MOVE THE BALL
  private moveBall(): void {
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;
  }

  // BALL AND WALL COLLISION DETECTION
  private ballWallCollision(): void {
    if(this.ball.x + this.ball.radius > this.gameContentEl!.width || this.ball.x - this.ball.radius < 0){
      this.ball.dx = - this.ball.dx;
    }
    
    if(this.ball.y - this.ball.radius < 0){
      this.ball.dy = -this.ball.dy;
    }
    
    if(this.ball.y + this.ball.radius > this.gameContentEl!.height){
      this.LIFE--; // LOSE LIFE
      this.createBall();
      this.drawInfoText();
    }
  }

  // BALL AND PADDLE COLLISION
  private ballPaddleCollision(): void {
    if(this.ball.x < this.paddle.x + this.paddle.width && this.ball.x > this.paddle.x && this.paddle.y < this.paddle.y + this.paddle.height && this.ball.y > this.paddle.y){
        
        // CHECK WHERE THE BALL HIT THE PADDLE
        let collidePoint = this.ball.x - (this.paddle.x + this.paddle.width/2);
        
        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (this.paddle.width/2);
        
        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI/3;
            
            
        this.ball.dx = this.ball.speed * Math.sin(angle);
        this.ball.dy = - this.ball.speed * Math.cos(angle);
    }
  }

  // MOVE PADDLE
  private movePaddle() {
    if(this.rightArrow && this.paddle.x + this.paddle.width < this.gameContentEl!.width){
      this.paddle.x += this.paddle.dx;
    } else if(this.leftArrow && this.paddle.x > 0) {
      this.paddle.x -= this.paddle.dx;
    }
}

  private drawInfoText(): void {
    this.gameInfoCX.clearRect(0, 0, this.gameInfoEl!.width, this.gameInfoEl!.height);
    this.gameInfoCX.font = "30px Arial";
    this.gameInfoCX.fillStyle = "white";
    this.gameInfoCX.textAlign = "center";
    this.gameInfoCX.fillText(`Game 3: Break the bricks | Score: ${this.SCORE} | Life: ${this.LIFE}`, this.gameInfoEl!.width/2.2, this.gameInfoEl!.height/1.5);
  }

  clearGameContent(): void {
    this.gameContentCX!.clearRect(0, 0, this.gameContentEl!.width, this.gameContentEl!.height);
  }

  drawGameOverScreen(): void {
    this.clearGameContent();
    this.drawTitleMenuScreen('40px', 'Game over!');
  }

  drawGameWonScreen(): void {
    this.clearGameContent();
    this.drawTitleMenuScreen('40px', 'You won!');
    this.drawButtonMenuScreen('40px', this.button1, 'Play again', this.gameContentEl!.height/2.65, this.gameContentEl!.height/2, 100, this.gameContentEl!.width/4.3);
  }

  drawGameLostScreen(): void {
    this.clearGameContent();
    this.drawTitleMenuScreen('40px', 'You lost!');
    this.drawButtonMenuScreen('40px', this.button1, 'Play again', this.gameContentEl!.height/2.65, this.gameContentEl!.height/2, 100, this.gameContentEl!.width/4.3);
  }

  drawTitleMenuScreen(fontSize: string, text: string): void {
    this.gameContentCX!.font = `${fontSize} Arial`;
    this.gameContentCX!.fillStyle = "white";
    this.gameContentCX!.textAlign = "center";
    this.gameContentCX!.fillText(text, this.gameContentEl!.width/2, this.gameContentEl!.height/5);
  }

  drawButtonMenuScreen(fontSize: string, button: any, text: string, buttonPosY: number, textPosY: number, buttonHeight: number, buttonX: number): void {
    this.gameContentCX!.beginPath();
    this.gameContentCX!.strokeStyle = 'white';
    button.x = buttonX;
    button.y = buttonPosY;
    this.gameContentCX!.rect(button.x, button.y, 215, buttonHeight);
    this.gameContentCX!.stroke();
    this.gameContentCX!.closePath();
    this.gameContentCX!.font = `${fontSize} Arial`;
    this.gameContentCX!.fillStyle = 'white';
    this.gameContentCX!.fillText(text, this.gameContentEl!.width/2, textPosY);
  }
}
