import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MazeGameComponent } from './components/maze-game/maze-game.component';
import { SpaceInvadersGameComponent } from './components/space-invaders-game/space-invaders-game.component';
import { SnakeGameComponent } from './components/snake-game/snake-game.component';
import { CountdownModule } from 'ngx-countdown';
import { BreakoutGameComponent } from './components/breakout-game/breakout-game.component';
import { appRoutingProviders, routing } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    MazeGameComponent,
    SpaceInvadersGameComponent,
    SnakeGameComponent,
    BreakoutGameComponent
  ],
  imports: [
    BrowserModule,
    CountdownModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
