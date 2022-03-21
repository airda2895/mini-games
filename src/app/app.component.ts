import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mini-games';
  currentGame: any;

  constructor() {
    this.currentGame = {
      mazeGame: false,
      spaceInvadersGame: false,
      breakoutGame: false,
      snakeGame: true,
    }
  }
  showSpaceInvadersGame() {
    this.currentGame.mazeGame = false;
    this.currentGame.spaceInvadersGame = true;
  }

  showBreakoutGame() {
    this.currentGame.spaceInvadersGame = false;
    this.currentGame.breakoutGame = true;
  }
  
  showSnakeGame() {
    this.currentGame.breakoutGame = false;
    this.currentGame.snakeGame = true;
  }
  showMazeGame() {
    this.currentGame.snakeGame = false;
    this.currentGame.mazeGame = true;
  }
}
