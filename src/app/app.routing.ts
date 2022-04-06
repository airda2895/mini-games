import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpaceInvadersGameComponent } from './components/space-invaders-game/space-invaders-game.component';
import { SnakeGameComponent } from './components/snake-game/snake-game.component';
import { MazeGameComponent } from './components/maze-game/maze-game.component';
import { BreakoutGameComponent } from './components/breakout-game/breakout-game.component';

const appRoutes: Routes = [
    {path: '', component: MazeGameComponent},
    {path: 'maze-game', component: MazeGameComponent},
    {path: 'space-invaders-game', component: SpaceInvadersGameComponent},
    {path: 'breakout-game', component: BreakoutGameComponent},
    {path: 'snake-game', component: SnakeGameComponent}
]

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);