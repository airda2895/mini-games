import { Component, ViewChild, AfterViewInit, HostListener, EventEmitter, Output } from '@angular/core';
import { Board } from 'src/app/models/board.model';
import { CountdownConfig } from 'ngx-countdown';

@Component({
  selector: 'snake-game',
  templateUrl: './snake-game.component.html',
  styleUrls: ['./snake-game.component.css']
})
export class SnakeGameComponent  implements AfterViewInit {
  @ViewChild('gameContentRef', {static: false}) gameContentRef: any;
  @ViewChild('gameInfoRef', {static: false}) gameInfoRef: any;
  @ViewChild('cd', {static: false}) cd: any;

  private button1 = {x: 0, y: 0, width: 350, heigth: 100};

  public countdownConfig: CountdownConfig = {leftTime: 500, format: 'mm:ss', demand: false};

  private gameContentCX!: CanvasRenderingContext2D;
  private gameContent: Board | undefined;
  private gameContentEl?: HTMLCanvasElement;

  private gameInfoCX!: CanvasRenderingContext2D;
  private gameInfo: Board | undefined;
  private gameInfoEl?: HTMLCanvasElement;
  private imgEnemy = new Image();

  private snake_col = 'lightblue';
  private snake_border = 'darkblue';

  private snake: Array<any> = [];
  private enemies: Array<any>  = [];

  private gameOver = false;
  private gamePaused = false;
  private gameLost = false;
  public blackBackground = false;

  private score = 0;
  // True if changing direction
  private changing_direction = false;
  // Horizontal velocity
  private food_x!: number;
  private food_y!: number;
  private dx = 25;
  // Vertical velocity
  private dy = 0;

  @HostListener('document:click', ['$event']) onClick = (e: any): void => {
    if(this.isInside(e, this.button1) && (this.gameLost)) {
      this.playAgain();
    }
  }

  @HostListener('document:keydown', ['$event']) onKeyDown = (e: any): void => {
    this.change_direction(e);
    if(e.keyCode === 32) this.blackBackground = true; 
    if(e.keyCode === 80) {
      this.gamePaused = !this.gamePaused;
      (this.cd.status === 1) ? this.cd.resume() : this.cd.pause();
      this.main();
    }
  }

  public finishedTimer($event: any) {
    if($event.left <= 0) {
      this.gameOver = true;
    }
  }

  private playAgain(): void {
    this.initializeSnakeObject();
    this.blackBackground = false;
    this.gameLost = false;
    this.score = 0;
    this.enemies = [];
    this.dx = 25;
    this.dy = 0;
    this.gen_food();
    this.main(); 
  }

  private isInside(pos:any, rect: any): boolean {
    return pos.offsetX > rect.x && pos.offsetX < rect.x+rect.width && pos.offsetY < rect.y+rect.heigth && pos.offsetY > rect.y
  }

  ngAfterViewInit(): void {
    this.gameContentEl = this.gameContentRef.nativeElement;
    this.gameContent = new Board(800, 500, this.gameContentEl);
    this.gameContent.setCanvasConfig();
    this.gameContentCX = this.gameContent.getCanvas().cx;

    this.gameInfoEl = this.gameInfoRef.nativeElement;
    this.gameInfo = new Board(800, 50, this.gameInfoEl);
    this.gameInfo.setCanvasConfig();
    this.gameInfoCX = this.gameInfo.getCanvas().cx;
    this.imgEnemy.src = 'assets/snake-game/enemy2.png';
    this.imgEnemy.onload = () => {
      this.drawInfoText();
      // Start game
      this.initializeSnakeObject();
      this.main();
      this.gen_food();
    }
  }

  private initializeSnakeObject(): void {
    this.snake = [{x: 200, y: 200},
    {x: 175, y: 200},
    {x: 150, y: 200},
    {x: 125, y: 200},
    {x: 100, y: 200}]
  }

  private main(): void {
    const that = this;
    if (this.has_game_ended()) {
      this.clearGameContent();
      this.drawLostGame();
      this.gameLost = true;
      this.blackBackground = true;
      return
    } else if (this.gameOver) {
      this.drawGameOverScreen();
      this.blackBackground = true;
      return;
    };
        this.changing_direction = false;
        setTimeout(function onTick() {
          that.clearGameContent();
          
          
          if((that.snake.length === 10 && that.enemies.length === 0) || 
            (that.snake.length === 15 && that.enemies.length === 1) || 
            (that.snake.length === 20 && that.enemies.length === 2) ||
            (that.snake.length === 25 && that.enemies.length === 3) ||
            (that.snake.length === 30 && that.enemies.length === 4) ||
            (that.snake.length === 35 && that.enemies.length === 4) || 
            (that.snake.length === 40 && that.enemies.length === 5) ||
            (that.snake.length === 45 && that.enemies.length === 6) ||
            (that.snake.length === 50 && that.enemies.length === 7) || 
            (that.snake.length === 55 && that.enemies.length === 7)) {
              that.gen_wall();
          }

          that.drawFood();
          if(that.enemies.length > 0) that.drawWall();
          that.move_snake();
          that.drawSnake();
          // Repeat
          if(!that.gameLost && !that.gamePaused) that.main();
      }, 100);
  } 

  // Draw the snake on the canvas
  private drawSnake(): void {
    // Draw each part
    this.snake.forEach((snakePart: any)=> this.drawSnakePart(snakePart))
  }

  private drawFood(): void {
    this.gameContentCX.fillStyle = 'lightgreen';
    this.gameContentCX.strokeStyle = 'darkgreen';
    this.gameContentCX.fillRect(this.food_x, this.food_y, 25, 25);
    this.gameContentCX.strokeRect(this.food_x, this.food_y, 25, 25);
  }

  private drawWall(): void {
    this.enemies.forEach((enemyItem) => {
      this.gameContentCX.drawImage(this.imgEnemy, enemyItem.x, enemyItem.y, 50, 25);
    });
  }

  // Draw one snake part
  private drawSnakePart(snakePart: any): void {
    // Set the colour of the snake part
    this.gameContentCX.fillStyle = this.snake_col;
    // Set the border colour of the snake part
    this.gameContentCX.strokeStyle = this.snake_border;
    // Draw a "filled" rectangle to represent the snake part at the coordinates
    // the part is located
    this.gameContentCX.fillRect(snakePart.x, snakePart.y, 25, 25);
    // Draw a border around the snake part
    this.gameContentCX.strokeRect(snakePart.x, snakePart.y, 25, 25);
  }

  private has_game_ended(): boolean {
    for (let i = 4; i < this.snake.length; i++) {
      if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y) return true;
    }

    for (let i = 0; i < this.enemies.length; i++) {
      if (this.enemies[i].x === this.snake[0].x && this.enemies[i].y === this.snake[0].y) return true;
    }
    const hitLeftWall = this.snake[0].x < 0;
    const hitRightWall = this.snake[0].x > this.gameContentEl!.width - 25;
    const hitToptWall = this.snake[0].y < 0;
    const hitBottomWall = this.snake[0].y > this.gameContentEl!.height - 25;
    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall
  }

  private gen_food(): void {
    let has_eaten = false;
    const that = this;
    // Generate a random number the food x-coordinate
    this.food_x = this.random_food_wall(0, this.gameContentEl!.width - 25);
    // Generate a random number for the food y-coordinate
    this.food_y = this.random_food_wall(0, this.gameContentEl!.height - 25);
    // if the new food location is where the snake currently is, generate a new food location
    this.snake.forEach(function has_snake_eaten_food(part: any) {
      has_eaten = part.x == that.food_x && part.y == that.food_y;
    });
    this.enemies.forEach(function has_snake_eaten_food(part: any) {
      has_eaten = part.x == that.food_x && part.y == that.food_y;
    });
    if (has_eaten) that.gen_food();
  }

  private gen_wall(): void {
    let createdWall = false;
    const that = this;
    // Generate a random number the wall x-coordinate
    const wall_x = this.random_food_wall(0, this.gameContentEl!.width - 25);
    // Generate a random number for the wall y-coordinate
    const wall_y = this.random_food_wall(0, this.gameContentEl!.height - 25);
    // if the new wall location is where the snake currently is, generate a new wall location
    this.snake.forEach(function has_snake_touched_wall(part: any) {
      const has_touched = part.x == wall_x && part.y == wall_y;
      if (has_touched) {
        that.gen_wall();
      } else if(!createdWall) {
        that.enemies.push({x: wall_x, y: wall_y});
        createdWall = true;
      }
    });
  }

  private change_direction(event: any): void {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    
  // Prevent the snake from reversing
  
    if (this.changing_direction) return;
    this.changing_direction = true;
    const keyPressed = event.keyCode;
    const goingUp = this.dy === -25;
    const goingDown = this.dy === 25;
    const goingRight = this.dx === 25;
    const goingLeft = this.dx === -25;
    if (keyPressed === LEFT_KEY && !goingRight) {
      this.dx = -25;
      this.dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
      this.dx = 0;
      this.dy = -25;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
      this.dx = 25;
      this.dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
      this.dx = 0;
      this.dy = 25;
    }
  }

  private move_snake(): void {
    // Create the new Snake's head
    const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
    // Add the new head to the beginning of snake body
    this.snake.unshift(head);
    const has_eaten_food = this.snake[0].x === this.food_x && this.snake[0].y === this.food_y;
    if (has_eaten_food && this.snake.length < 34) {
      // Increase score
      this.score += 10;
      if(Math.floor(Math.random() * 5000) < 600) this.snake.pop();
      // Display score on screen
      this.drawInfoText();
      // Generate new food location
      this.gen_food();
    } else {
      // Remove the last part of snake body
      this.snake.pop();
    }
  }

  private random_food_wall(min: number, max: number) {
    return Math.round((Math.random() * (max-min) + min) / 25) * 25;
  }

  private clearGameContent(): void {
    this.gameContentCX!.clearRect(0, 0, this.gameContentEl!.width, this.gameContentEl!.height);
  }

  private drawGameOverScreen(): void {
    this.clearGameContent();
    this.drawTitleMenuScreen('40px', 'Game over');
  }

  private drawLostGame(): void {
    this.clearGameContent();
    this.drawTitleMenuScreen('40px', 'You lost!');
    this.drawButtonMenuScreen('40px', this.button1, 'Play again', this.gameContentEl!.height/2.75, this.gameContentEl!.height/2.07, 100);
  }

  private drawTitleMenuScreen(fontSize: string, text: string): void {
    this.gameContentCX!.font = `${fontSize} Arial`;
    this.gameContentCX!.fillStyle = "white";
    this.gameContentCX!.textAlign = "center";
    this.gameContentCX!.fillText(text, this.gameContentEl!.width/2, this.gameContentEl!.height/5);
  }

  private drawButtonMenuScreen(fontSize: string, button: any, text: string, buttonPosY: number, textPosY: number, buttonHeight: number): void {
    this.gameContentCX!.beginPath();
    this.gameContentCX!.strokeStyle = 'white';
    button.x = this.gameContentEl!.width/3.3;
    button.y = buttonPosY;
    this.gameContentCX!.rect(button.x, button.y, button.width, buttonHeight);
    this.gameContentCX!.stroke();
    this.gameContentCX!.closePath();
    this.gameContentCX!.font = `${fontSize} Arial`;
    this.gameContentCX!.fillStyle = 'white';
    this.gameContentCX!.fillText(text, this.gameContentEl!.width/1.92, textPosY);
  }

  private drawInfoText(): void {
    this.gameInfoCX.clearRect(0, 0, this.gameInfoEl!.width, this.gameInfoEl!.height);
    this.gameInfoCX.font = "30px Arial";
    this.gameInfoCX.fillStyle = "white";
    this.gameInfoCX.textAlign = "center";
    this.gameInfoCX.fillText(`Game 4: Snake | Score: ${this.score}`, this.gameInfoEl!.width/2, this.gameInfoEl!.height/1.5);
  }
}
