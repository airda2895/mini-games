import { Component, ViewChild, Output, HostListener, EventEmitter, AfterViewInit } from '@angular/core';
import { Board } from 'src/app/models/board.model';
import { CountdownConfig } from 'ngx-countdown';

@Component({
  selector: 'maze-game',
  templateUrl: './maze-game.component.html',
  styleUrls: ['./maze-game.component.css']
})
export class MazeGame implements AfterViewInit {

  @ViewChild('gameContentRef', {static: false}) gameContentRef: any;
  @ViewChild('gameInfoRef', {static: false}) gameInfoRef: any;
  @Output() spaceInvadersGame = new EventEmitter();

  private gameContentCX!: CanvasRenderingContext2D;
  private gameContent: Board | undefined;
  private gameContentEl: any;

  private gameInfoCX!: CanvasRenderingContext2D;
  private gameInfo: Board | undefined;
  private gameInfoEl: any;

  private characterSpriteSh = {cols: 4, rows: 4, srcX: 0, srcY: 0, totalFrames: 2, currentFrame: 0, imgSpriteSheet: new Image(), spriteWidth: 0, spriteHeight: 0, posX: 1, posY: 1, prevPosX: 0, prevPosY: 0}
  private images = {imgTreasure: new Image(), imgEnemy: new Image(), imgFloor: new Image(), imgGrass: new Image(), imgExit: new Image(), imgPlayer: new Image(), imgFire: new Image(), imgBridge: new Image(), imgExtinguisher: new Image()};
  private arrayQuestions: any;
  private currentIndexQuestion: any;
  private gameLost = false;
  private wonGame = false;
  private gameOver = false;
  public answeringQuestion = false;
  private score = 0;
  private lives = 3;
  private button1 = {x: 0, y: 0, width: 215, heigth: 100};
  private button2 = {x: 0, y: 0, width: 215, heigth: 100};
  private arrayMaze: any;
  private currentMaze = 0;
  private justSentHome = false;
  public countdownConfig: CountdownConfig = {leftTime: 900, format: 'mm:ss', demand: false};
  public questionTimerConfig: CountdownConfig = {leftTime: 10, format: 'mm:ss', demand: false};

  ngAfterViewInit(): void {
    this.gameContentEl = this.gameContentRef.nativeElement;
    this.gameContent = new Board(800, 500, this.gameContentEl);
    this.gameContent.setCanvasConfig();
    this.gameContentCX = this.gameContent.getCanvas().cx;

    this.gameInfoEl = this.gameInfoRef.nativeElement;
    this.gameInfo = new Board(800, 50, this.gameInfoEl);
    this.gameInfo.setCanvasConfig();
    this.gameInfoCX = this.gameInfo.getCanvas().cx;
    this.initializeMazeArray();
    this.initializeQuestionsArray();
    this.drawInfoText();
    this.loadPictures();
  }

  initializeMazeArray(): void {
    this.arrayMaze = [
      [
        // Level 1
        [0, 0, -1, 1, 1, 1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 1, 0, 1],
        [1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
        [1, 0, 1, 2, 1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 2],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
        [0, 1, 0, 1, 1, 1, 1, 1, 2, 1, 0, 0, 1, 0, 0, 0],
        [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0],
        [0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 4]
      ],
      [
        // Level 2
        [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 4],
        [0, 0, 0, 0, 0, 5, 0, 2, 1, 0, 0, 1, 1, 0, 1, 0],
        [0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 2, 0, 3, 0],
        [1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 1, 1, 1],
        [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 6, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 3, 0, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 5, 1],
        [0, 0, 0, 5, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 2],
        [-1, 1, 1, 1, 1, 1, 2, 1, 0, 0, 1, 0, 1, 1, 0, 1]
      ],
      [
        // Level 3
        [0, 0, 5, 5, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1],
        [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 3, 0, 0, 0, 0],
        [1, 0, 1, 1, 1, 6, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
        [0, 0, 3, 0, 0, 0, 0, -1, 1, 2, 0, 0, 1, 0, 3, 0],
        [0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
        [0, 1, 0, 0, 5, 2, 1, 1, 0, 2, 1, 0, 0, 3, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 2, 1, 0, 1, 0, 1, 0],
        [1, 0, 0, 0, 5, 2, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
        [1, 3, 0, 0, 1, 1, 1, 0, 2, 1, 0, 0, 1, 0, 0, 0],
        [1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 4, 1]
      ]
    ];
  }

  public finishedTimer($event: any) {
    if($event.left <= 0) {
      this.gameOver = true;
      this.drawGameOverScreen();
    }
  }

  public finishedQuestion($event: any) {
    if($event.left <= 0) {
      this.answeringQuestion = false;
    }
  }

  @HostListener('document:keydown', ['$event']) onKeyDown = (e: any) => {
    const cs = this.characterSpriteSh;
      let moved = false;
      for(let y = 0; y < this.arrayMaze[this.currentMaze].length; y ++) {
        for (let x = 0; x < this.arrayMaze[this.currentMaze][y].length; x++) {
          if (this.arrayMaze[this.currentMaze][y][x] === -1 || this.arrayMaze[this.currentMaze][y][x] === -2) {
            if(e.key === 'ArrowRight' && !moved && !this.justSentHome) {
              moved = this.movePlayer(0, 24, y, x, 0, 1);
            } else if (e.key === 'ArrowLeft' && !moved && !this.justSentHome) {
              moved = this.movePlayer(0, 48, y, x, 0, -1);
            } else if (e.key === 'ArrowUp' && !moved && !this.justSentHome) {
              moved = this.movePlayer(0, 72, y, x, -1, 0);
            } else if (e.key === 'ArrowDown' && !moved && !this.justSentHome) {
              moved = this.movePlayer(0, 0, y, x, 1, 0);
            }       
          }
          if(!this.gameLost && !this.wonGame && !this.answeringQuestion) this.drawMaze();

        }
      }
    }

  @HostListener('document:click', ['$event']) onClick = (e: any) => {
    if(this.isInside(e, this.button1) && this.gameLost) {
      this.playAgain();
    } else if(this.isInside(e, this.button2) && this.wonGame) {
      this.playAgain();
    } else if (this.isInside(e, this.button1) && this.answeringQuestion) {
      this.checkAnswer(0)
    } else if (this.isInside(e, this.button2) && this.answeringQuestion) {
      this.checkAnswer(1);
    } else if (this.isInside(e, this.button1) && (this.wonGame || this.gameOver)) {
      this.spaceInvadersGame.emit();
    }
  }

  private checkAnswer(answerClicked: number): void {
    if(this.arrayQuestions[this.currentMaze][this.currentIndexQuestion].correctAnswer === answerClicked) this.score = this.score + 20;
    this.arrayQuestions[this.currentMaze][this.currentIndexQuestion].answered = true;
    this.drawInfoText();
    this.answeringQuestion = false;
    // Open walls after answering question (for level 3)
    if(this.currentMaze === 2) {
      if((this.arrayMaze[2][5][5] !== 2 && this.arrayMaze[2][7][5] !== 2)) {
        this.arrayMaze[2][9][4] = 0;
        this.arrayMaze[2][9][5] = 0;
        this.arrayMaze[2][9][6] = 0;
        this.arrayMaze[2][9][7] = 0;
        this.arrayMaze[2][9][8] = 0;
      }
      if(this.arrayMaze[2][3][9] !== 2) this.arrayMaze[2][4][9] = 0;
    }
    this.drawMaze();
  }
  private isInside(pos:any, rect: any): boolean {
    return pos.offsetX > rect.x && pos.offsetX < rect.x+rect.width && pos.offsetY < rect.y+rect.heigth && pos.offsetY > rect.y;
  }

  private playAgain(): void {
    this.initializeMazeArray();
    this.initializeQuestionsArray();
    if(this.wonGame) this.currentMaze = 0;
    this.lives = 3;
    this.score = 0;
    this.gameLost = false;
    this.wonGame = false;
    this.drawInfoText();
    this.drawMaze();
  }
  
  private initializeQuestionsArray(): void {
    this.arrayQuestions = [
      [
        {question: "What is the PI number?", answers: ['3.1416', '3.1516'], correctAnswer: 0, answered: false}, 
        {question: "Who developed the power?", answers: ['Charles Edison', 'Thomas Alva Edison'], correctAnswer: 1, answered: false},
        {question: "Which group is followed by this series: 2Z3, 4Y5, 6X7...?", answers: ['8W9', '8V9'], correctAnswer: 0, answered: false},
        {question: "Which city is larger?", answers: ['Mexico City', 'Moscow'], correctAnswer: 0, answered: false},
        {question: "When did Michael Jackson die?", answers: ['2008', '2009'], correctAnswer: 0, answered: false}
      ],
      [
        {question: "What's the capital of Canada?", answers: ['Toronto', 'Ottawa'], correctAnswer: 0, answered: false}, 
        {question: "What was the worst Windows version?", answers: ['Windows 8', 'Windows Vista'], correctAnswer: 1, answered: false},
        {question: "Where is Big Ben located at?", answers: ['Paris', 'London'], correctAnswer: 1, answered: false},
        {question: "What's the second largest city of the EU?", answers: ['Madrid', 'Rome'], correctAnswer: 0, answered: false},
        {question: "When did civil Spanish war end?", answers: ['1939', '1938'], correctAnswer: 0, answered: false}
      ],
      [
        {question: "What's the continent with best quality life", answers: ['Europe', 'Australia'], correctAnswer: 0, answered: false}, 
        {question: "When did humans walk on the moon for the first time?", answers: ['1969', '1965'], correctAnswer: 0, answered: false},
        {question: "What was the first Disney film", answers: ['Mickey Mouse', 'Snow White'], correctAnswer: 1, answered: false},
        {question: "Where did Ping-Pong start?", answers: ['United Kingdom', 'Australia'], correctAnswer: 0, answered: false},
        {question: "What's the age of Earth?", answers: ['4.543', '4.200'], correctAnswer: 0, answered: false},
        {question: "What's the speed of light?", answers: ['300.000 km/s', '250.000 km/s'], correctAnswer: 0, answered: false},
        {question: "When is Sun closest to Earth?", answers: ['November', 'December'], correctAnswer: 1, answered: false}
      ]
    ];
  }

  private movePlayer(srcX: number, srcY: number, y: number, x: number, nextIndexY: number, nextIndexX: number): boolean {
    this.characterSpriteSh.srcX = srcX;
    this.characterSpriteSh.srcY = srcY;
    // Put extinguisher back to its original place
    switch(this.currentMaze) {
      case 1:
        if(this.arrayMaze[1][5][3] === 0) this.arrayMaze[1][5][3] = 6;
        break;
      case 2:
        if(this.arrayMaze[2][2][5] === 0) this.arrayMaze[2][2][5] = 6;
    }
    // Player with extinguisher hits fire
    if(this.currentMaze != 0 && this.arrayMaze[this.currentMaze][y][x] === -2 && this.arrayMaze[this.currentMaze][y + nextIndexY][x + nextIndexX] === 5) {
      this.arrayMaze[this.currentMaze][y + nextIndexY][x + nextIndexX] = -1;
      this.arrayMaze[this.currentMaze][y][x] = 0;
    } else if(this.checkEnemyCollision(y, x, nextIndexY, nextIndexX, 3) || this.checkEnemyCollision(y, x, nextIndexY, nextIndexX, 5)) {
      return false;
    // Player hits treasure
    } else if (this.arrayMaze[this.currentMaze][y + nextIndexY][x + nextIndexX] === 2) {
      this.answeringQuestion = true;
      this.drawQuizzScreen();
      this.arrayMaze[this.currentMaze][y + nextIndexY][x + nextIndexX] = -1;
      this.arrayMaze[this.currentMaze][y][x] = 0;

    // Player hits enemy
    } else if(this.arrayMaze[this.currentMaze][y + nextIndexY][x + nextIndexX] === 4) {
      if(this.currentMaze < this.arrayMaze.length-1) {
        this.currentMaze++;
        this.drawInfoText();
      } else {
        this.wonGame = true;
        this.drawWonGameScreen();
      }
    // Player hits extinguisher
    } else if (this.arrayMaze[this.currentMaze][y + nextIndexY][x + nextIndexX] === 6) {
      this.arrayMaze[this.currentMaze][y + nextIndexY][x + nextIndexX] = -2;
      this.arrayMaze[this.currentMaze][y][x] = 0;
    // Player hits nothing (floor)
    } else if(this.arrayMaze[this.currentMaze][y + nextIndexY][x + nextIndexX] !== 1) {
      this.arrayMaze[this.currentMaze][y + nextIndexY][x + nextIndexX] = this.arrayMaze[this.currentMaze][y][x];
      this.arrayMaze[this.currentMaze][y][x] = 0;
    }
    return true;
  }

  private moveEnemy(x: number, y: number, newX: number): void {
    this.checkEnemyCollision(y, newX, 0, 0, -1);
    this.checkEnemyCollision(y, newX, 0, 0, -2);
    this.arrayMaze[this.currentMaze][y][x] = 0;
    this.arrayMaze[this.currentMaze][y][newX] = 3;
  }
  private checkEnemyCollision(y: number, x: number, nextIndexY: number, nextIndexX: number, objectToCheck: number): boolean {
    if((this.arrayMaze[this.currentMaze][y + nextIndexY][x + nextIndexX] === objectToCheck) && this.arrayMaze[this.currentMaze]) {
      if(this.lives > 0) {
        this.lives--;
        this.arrayMaze[this.currentMaze][y][x] = 0;
        this.justSentHome = true;
        switch(this.currentMaze) {
          case 0:
            this.arrayMaze[this.currentMaze][0][2] = -1;
            break;
          case 1:
            this.arrayMaze[this.currentMaze][9][0] = -1;
            break;
          case 2:
            this.arrayMaze[this.currentMaze][3][7] = -1;
            break;
        }
        this.drawInfoText();
        setTimeout(() => {this.justSentHome = false}, 600);
      } else {
        this.gameLost = true;
        this.drawGameLostScreen();
      }
      return true;
    }
    return false;
  }

  private clearGameContent(): void {
    this.gameContentCX.clearRect(0, 0, this.gameContentEl.width, this.gameContentEl.height);
  }

  private drawGameLostScreen(): void {
    this.clearGameContent();
    this.drawTitleMenuScreen('40px', 'You lost!');
    this.drawButtonMenuScreen('40px', this.button1, 'Play again', this.gameContentEl.height/2.65, this.gameContentEl.height/2, 100);
  }

  private drawGameOverScreen(): void {
    this.clearGameContent();
    this.drawTitleMenuScreen('40px', 'Game over');
    this.drawButtonMenuScreen('40px', this.button1, 'Next game', this.gameContentEl.height/2.65, this.gameContentEl.height/2, 100);
  }

  private drawWonGameScreen(): void {
    this.clearGameContent();
    this.drawTitleMenuScreen('60px', 'You won!');
    this.drawButtonMenuScreen('40px', this.button1, 'Next game', this.gameContentEl.height/2.65, this.gameContentEl.height/2, 100);
    this.drawButtonMenuScreen('40px', this.button2, 'Play again', this.gameContentEl.height/1.4, this.gameContentEl.height/1.2, 100);
  }

  private drawQuizzScreen(): void {
    this.currentIndexQuestion = this.getIndexQuestion();
    this.clearGameContent();
    this.drawTitleMenuScreen('30px', this.arrayQuestions[this.currentMaze][this.currentIndexQuestion].question);
    this.drawButtonMenuScreen('22px', this.button1, this.arrayQuestions[this.currentMaze][this.currentIndexQuestion].answers[0], this.gameContentEl.height/2.48, this.gameContentEl.height/2, 80);
    this.drawButtonMenuScreen('22px', this.button2, this.arrayQuestions[this.currentMaze][this.currentIndexQuestion].answers[1], this.gameContentEl.height/1.35, this.gameContentEl.height/1.2, 80);
  }

  private drawTitleMenuScreen(fontSize: string, text: string) {
    this.gameContentCX.font = `${fontSize} Arial`;
    this.gameContentCX.fillStyle = "white";
    this.gameContentCX.textAlign = "center";
    this.gameContentCX.fillText(text, this.gameContentEl.width/2, this.gameContentEl.height/5);
  }

  private drawButtonMenuScreen(fontSize: string, button: any, text: string, buttonPosY: number, textPosY: number, buttonHeight: number) {
    this.gameContentCX.beginPath();
    this.gameContentCX.strokeStyle = 'white';
    button.x = this.gameContentEl.width/2.75;
    button.y = buttonPosY;
    this.gameContentCX.rect(button.x, button.y, 215, buttonHeight);
    this.gameContentCX.stroke();
    this.gameContentCX.closePath();
    this.gameContentCX.font = `${fontSize} Arial`;
    this.gameContentCX.fillStyle = 'white';
    this.gameContentCX.fillText(text, this.gameContentEl.width/2, textPosY);
  }

  private getIndexQuestion() {
    for(let i = 0; i < this.arrayQuestions[this.currentMaze].length; i ++) {
      if(!this.arrayQuestions[this.currentMaze][i].answered) return i;
    }
    return;
  }

  private drawInfoText(): void {
    this.gameInfoCX.clearRect(0, 0, this.gameInfoEl.width, this.gameInfoEl.height);
    this.gameInfoCX.font = "30px Arial";
    this.gameInfoCX.fillStyle = "white";
    this.gameInfoCX.textAlign = "center";
    this.gameInfoCX.fillText(`Game 1: Maze | Score: ${this.score} | Lives: ${this.lives} | Level: ${this.currentMaze+1}`, this.gameInfoEl.width/2.2, this.gameInfoEl.height/1.5); 
  }

  private loadPictures(): void {
    this.images.imgTreasure.src = 'assets/maze-game/treasure.png';
    this.images.imgEnemy.src = 'assets/maze-game/enemy.png';
    this.images.imgFloor.src = 'assets/maze-game/floor-2.png';
    this.images.imgGrass.src = 'assets/maze-game/grass.png';
    this.images.imgExit.src = 'assets/maze-game/exit.png';
    this.images.imgPlayer.src = 'assets/maze-game/spritesheetCharacter.png';
    this.images.imgBridge.src = 'assets/maze-game/bridge.png';
    this.images.imgFire.src = 'assets/maze-game/fire.png';
    this.images.imgExtinguisher.src = 'assets/maze-game/extinguisher.png';

    this.images.imgExtinguisher.onload = () => {
      this.characterSpriteSh.spriteWidth = this.images.imgPlayer.width / this.characterSpriteSh.cols;
      this.characterSpriteSh.spriteHeight = this.images.imgPlayer.height / this.characterSpriteSh.rows;
      this.drawMaze();
      setInterval(() => {this.moveEnemies()}, 700);
    }
  }

  private moveEnemies(): void {
    for(let y = 0; y < this.arrayMaze[this.currentMaze].length; y ++) {
      for (let x = 0; x < this.arrayMaze[this.currentMaze][y].length; x++) {
        if(this.arrayMaze[this.currentMaze][y][x] === 3) {
          // Enemies movements for level 1
          if(this.currentMaze === 0 && y === 2) {
            this.moveEnemy(x, y, Math.floor(Math.random() * (13 - 7) + 7));
          } else if (this.currentMaze === 0 && y === 8) {
            this.moveEnemy(x, y, Math.floor(Math.random() * (5 - 0) + 0));
          // Enemies movements for level 2
          } else if (this.currentMaze === 1 && y === 2) {
            this.moveEnemy(x, y, Math.floor(Math.random() * (16 - 12) + 12));
          } else if (this.currentMaze === 1 && y === 3) {
            this.moveEnemy(x, y, Math.floor(Math.random() * (10 - 1) + 1));
          } else if (this.currentMaze === 1 && y === 6) {
            this.moveEnemy(x, y, Math.floor(Math.random() * (4 - 1) + 1));
           // Enemies movements for level 3
          } else if (this.currentMaze === 2 && y === 1) {
            this.moveEnemy(x, y, Math.floor(Math.random() * (16 - 7) + 7));
          } else if (this.currentMaze === 2 && y === 3 && (x <= 6)) {
            this.moveEnemy(x, y, Math.floor(Math.random() * (6 - 0) + 0));
          } else if (this.currentMaze === 2 && y === 3 && (x >= 12)) {
            this.moveEnemy(x, y, Math.floor(Math.random() * (16 - 13) + 13));
          } else if (this.currentMaze === 2 && y === 5) {
            this.moveEnemy(x, y, Math.floor(Math.random() * (16 - 11) + 11));
          } else if (this.currentMaze === 2 && y === 7) {
              this.moveEnemy(x, y, Math.floor(Math.random() * (3 - 1) + 1));
          } else if (this.currentMaze === 2 && y === 8) {
            this.moveEnemy(x, y, Math.floor(Math.random() * (4 - 1) + 1));
          }
          
          if(!this.answeringQuestion && !this.gameLost && !this.wonGame && !this.gameOver) this.drawMaze();
        } 
      }
    }
  }

  private drawMaze(): void { //Loop mazeArray and print a square with certain color depending on what kind of value
    const cs = this.characterSpriteSh;
    for (var y = 0; y < this.arrayMaze[this.currentMaze].length; y++) {
      for (var x = 0; x < this.arrayMaze[this.currentMaze][y].length; x++) {
        if (this.arrayMaze[this.currentMaze][y][x] === -1) {
          this.gameContentCX.drawImage(this.images.imgFloor, x * 50, y * 50, 50, 50);
          this.gameContentCX.drawImage(this.images.imgPlayer, cs.srcX, cs.srcY, cs.spriteWidth, cs.spriteHeight, x * 50, y * 50, cs.spriteWidth+5, cs.spriteHeight+5);
        } else if(this.arrayMaze[this.currentMaze][y][x] === 0) {
          this.gameContentCX.drawImage(this.images.imgFloor, x * 50, y * 50, 50, 50);
        } else if (this.arrayMaze[this.currentMaze][y][x] === 1) {
          this.gameContentCX.drawImage(this.images.imgGrass, x * 50, y * 50, 50, 50);
        } else if (this.arrayMaze[this.currentMaze][y][x] === 2) {
          this.gameContentCX.drawImage(this.images.imgFloor, x * 50, y * 50, 50, 50);
          this.gameContentCX.drawImage(this.images.imgTreasure, x * 50, y*52, 30, 30);
        } else if (this.arrayMaze[this.currentMaze][y][x] === 3) {
          this.gameContentCX.drawImage(this.images.imgFloor, x * 50, y * 50, 50, 50);
          this.gameContentCX.drawImage(this.images.imgEnemy, x * 50, y * 50, 37, 37);
        } else if (this.arrayMaze[this.currentMaze][y][x] === 4) {
          this.gameContentCX.drawImage(this.images.imgFloor, x * 50, y * 50, 50, 50);
          this.gameContentCX.drawImage(this.images.imgExit, x * 50, y * 50, 50, 50);
        } else if (this.arrayMaze[this.currentMaze][y][x] === 5) {
          this.gameContentCX.drawImage(this.images.imgFloor, x * 50, y * 50, 50, 50);
          this.gameContentCX.drawImage(this.images.imgFire, x * 50.5, y * 50.5, 40, 40);
        } else if (this.arrayMaze[this.currentMaze][y][x] === 6) {
          this.gameContentCX.drawImage(this.images.imgFloor, x * 50, y * 50, 50, 50);
          this.gameContentCX.drawImage(this.images.imgExtinguisher, x * 50.5, y * 50.5, 35, 40);
        } else if (this.arrayMaze[this.currentMaze][y][x] === -2) {
          this.gameContentCX.drawImage(this.images.imgFloor, x * 50, y * 50, 50, 50);
          this.gameContentCX.drawImage(this.images.imgPlayer, cs.srcX, cs.srcY, cs.spriteWidth, cs.spriteHeight, x * 50, y * 50, cs.spriteWidth+5, cs.spriteHeight+5);
          this.gameContentCX.drawImage(this.images.imgExtinguisher, x * 52, y * 50.5, 20, 25);
        }
      }
    }
  }
}
