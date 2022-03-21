export class CheckHits {
    private touchedEnemy = false;

    checkHitsEnemy(gameStruct: any) {
        // Aquesta funció verifica si dos elements han col·lisionat.
        if(gameStruct.currentLevel < 5) {
            for(var i in gameStruct.arraySpaceShipShots) {
                const currentShot = gameStruct.arraySpaceShipShots[i];
                for(var j in gameStruct.arrayEnemies) {
                    const currentEnemy = gameStruct.arrayEnemies[j];
                    if (CheckHits.hit(currentShot, currentEnemy, false)) {
                        if(gameStruct.currentLevel !== 2 || (parseInt(j) !== 3 || this.touchedEnemy)) gameStruct.arrayEnemies.splice(gameStruct.arrayEnemies.indexOf(currentEnemy),1);
                        if(gameStruct.currentLevel === 2 && parseInt(j) === 3) this.touchedEnemy = true;
                        gameStruct.arraySpaceShipShots.splice(i, 1);
                        gameStruct.score++;
                    }
                }
            }
        }

        if(gameStruct.currentLevel === 4 && gameStruct.finalBoss.life > 0) {
            for(var i in gameStruct.arraySpaceShipShots) {
                var currentShot = gameStruct.arraySpaceShipShots[i];
                if(CheckHits.hit(currentShot, gameStruct.finalBoss, false)) {
                    gameStruct.arraySpaceShipShots.splice(i, 1);
                    gameStruct.score++;
                    gameStruct.finalBoss.life--;
                }
            }
        }
    }

    checkHitsBoss(gameStruct: any) {
        if(CheckHits.hit(gameStruct.finalBoss, gameStruct.spaceShip, false)) {
            gameStruct.player.life = 0;
        }
    }

    checkHitsPlayer(gameStruct: any) {
        if(gameStruct.currentLevel < 5) {
            if(gameStruct.player.life >= 0) {
                gameStruct.arrayEnemyShots.forEach(function(currentShot: any, i: number) {
                    if(CheckHits.hit(currentShot, gameStruct.player, false)) {
                        gameStruct.arrayEnemyShots.splice(i, 1);
                        if(Math.floor(Math.random() * 1000) < 500) gameStruct.player.life--;
                    }
                });
                
            }
        }
        if(gameStruct.currentLevel > 2) {
            gameStruct.arrayEnemyBombs.forEach(function(currentBomb: any, i: number) {
                if(CheckHits.hit(currentBomb, gameStruct.player, true)) {
                    gameStruct.arrayEnemyBombs.splice(i, 1);
                    gameStruct.player.life--;
                }
            });
        }
        if(gameStruct.currentLevel === 4) {
            gameStruct.arrayFinalBossShots.forEach(function(currentShot: any, i: number) {
                if(CheckHits.hit(currentShot, gameStruct.player, false)) {
                    gameStruct.arrayFinalBossShots.splice(i, 1);
                    gameStruct.player.life--;
                }
            });
        }
    
    }
    
    static hit(a: any, b: any, bomb: any) {
        let hit = false;
        let currentWidth = a.width;
        let currentX = a.x;
        if(bomb) currentWidth = currentWidth + 200, currentX = a.x - 100;
            //Col·lisions horitzontals
            if (b.x + b.width >= currentX && b.x < currentX + currentWidth) {
                //Col·lisions verticals
                if (b.y + b.height >= a.y && b.y < a.y + a.height) {
                    hit = true;
                }
            }
            //Col·lisió de a amb b
            if (b.x <= currentX && b.x + b.width >= currentX + currentWidth) {
                if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
                    hit = true;
                }
            }
            //Col·lisió de b amb a
            if (currentX <= b.x && currentX + currentWidth >= b.x + b.width) {
                if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
                    hit = true;
                }
            }
        return hit;
    }
}	
	