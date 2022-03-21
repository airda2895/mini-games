import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MazeGame } from './components/maze-game/maze-game.component';
import { SpaceInvadersGameComponent } from './components/space-invaders-game/space-invaders-game.component';
import { SnakeGameComponent } from './components/snake-game/snake-game.component';
import { CountdownModule } from 'ngx-countdown';
import { BreakoutGameComponent } from './components/breakout-game/breakout-game.component';

@NgModule({
  declarations: [
    AppComponent,
    MazeGame,
    SpaceInvadersGameComponent,
    SnakeGameComponent,
    BreakoutGameComponent
  ],
  imports: [
    BrowserModule,
    CountdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
