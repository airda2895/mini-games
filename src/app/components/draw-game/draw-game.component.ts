import { AfterViewInit, Component, HostListener, Output, ViewChild, EventEmitter } from '@angular/core';
import { Board } from 'src/app/models/board.model';
import { CountdownComponent, CountdownConfig } from 'ngx-countdown';
@Component({
  selector: 'draw-game',
  templateUrl: './draw-game.component.html',
  styleUrls: ['./draw-game.component.css']
})
export class DrawGame implements AfterViewInit {

  @ViewChild('gameContentRef', {static: false}) gameContentRef: any;
  @ViewChild('gameInfoRef', {static: false}) gameInfoRef: any;
  @ViewChild('cd', { static: false }) private countdown!: CountdownComponent;

  @Output() mazeGame = new EventEmitter;
  private gameContentCX!: CanvasRenderingContext2D;
  private gameContent: Board | undefined;
  private gameContentEl: any;

  private gameInfoCX!: CanvasRenderingContext2D;
  private gameInfo: Board | undefined;
  private gameInfoEl: any;
  public sampleDraw = '../../../assets/draw-game/sample-1.png';

  private button1 = {x: 0, y: 0, width: 215, heigth: 100};
  private button2 = {x: 0, y: 0, width: 215, heigth: 100};

  public countdownConfig: CountdownConfig = {leftTime: 5, format: 'mm:ss', demand: false};
  public arrayImgsCounts = [{leftTime: 10, img: '../../../assets/draw-game/sample-1.png'}, 
                              {leftTime: 20, img: '../../../assets/draw-game/sample-2.png'}, 
                              {leftTime: 15, img: '../../../assets/draw-game/sample-3.png'},
                              {leftTime: 25, img: '../../../assets/draw-game/sample-4.png'},
                              {leftTime: 15, img: '../../../assets/draw-game/sample-5.png'},
                              {leftTime: 30, img: '../../../assets/draw-game/sample-6.png'},
                              {leftTime: 50, img: '../../../assets/draw-game/sample-7.png'},
                              {leftTime: 25, img: '../../../assets/draw-game/sample-8.png'},
                              {leftTime: 23, img: '../../../assets/draw-game/sample-9.png'},
                              {leftTime: 25, img: '../../../assets/draw-game/sample-10.png'},
                              {leftTime: 30, img: '../../../assets/draw-game/sample-11.png'}];
  public currentSample = 0;
  private drawTools = {rubber: {img: new Image(), button: {x: 0, y: 10, width: 40, heigth: 40}},
                          line1: {img: new Image(), button: {x: 0, y: 10, width: 40, heigth: 40}},
                          line2: {img: new Image(), button: {x: 0, y: 10, width: 40, heigth: 40}},
                          line3: {img: new Image(), button: {x: 0, y: 10, width: 40, heigth: 40}},
                          line4: {img: new Image(), button: {x: 0, y: 10, width: 40, heigth: 40}}};
  

  private points: Array<any> = [[]];
  private lineWidth = 1; 
  private score = 0;
  private finishedDraw = false;
  public finishedGame = false

  @HostListener('document:mousedown', ['$event']) onMouseDown = () => {this.finishedDraw = false}
  @Output() snakeGame = new EventEmitter();
  
  @HostListener('document:mouseup', ['$event']) onMouseUp = (e: any) => {
    if(this.countdown.left >= 2000) this.finishedDraw = true;
    this.points.push(new Array());
    if(this.isInside(e, this.drawTools.rubber.button)) {
      this.clearContent(this.gameContentCX, this.gameContentEl);
      this.drawAllTools();
    } else if (this.isInside(e, this.drawTools.line1.button)) {
      this.lineWidth = 1;
    } else if (this.isInside(e, this.drawTools.line2.button)) {
      this.lineWidth = 2;
    } else if (this.isInside(e, this.drawTools.line3.button)) {
      this.lineWidth = 3.5;
    } else if (this.isInside(e, this.drawTools.line4.button)) {
      this.lineWidth = 6;
    } else if (this.isInside(e, this.button1) && this.finishedGame) {
      this.snakeGame.emit();
    } else if (this.isInside(e, this.button2) && this.finishedGame) {
      this.playAgain();
    }
  }

  @HostListener('document:mousemove', ['$event']) onMouseMove = (e: any) => {
    this.countdown.begin();
    if(e.target.id === 'gameContent') {
      this.write(e);
    }
  }

  playAgain(): any {
    this.score = 0;
    this.finishedGame = false;
    this.finishedDraw = false;
    this.currentSample = 0;
    this.clearContent(this.gameContentCX, this.gameContentEl);
    this.drawAllTools();
    this.setSample();
  }

  finishedTimer(event: any): void {
    if(event.action === 'done') {
      if(this.currentSample < this.arrayImgsCounts.length-1) {
        if(this.finishedDraw) this.score += 10;
        this.currentSample++;
        this.setSample();
        this.drawInfoText();
        this.finishedDraw = false;
      } else {
        this.finishedGame = true;
        this.drawFinishedGameScreen();
      }
    }
  }

  isInside(pos:any, rect: any): boolean {
    return pos.offsetX > rect.x && pos.offsetX < rect.x+rect.width && pos.offsetY < rect.y+rect.heigth && pos.offsetY > rect.y
  }

  ngAfterViewInit(): void {
    this.gameContentEl = this.gameContentRef.nativeElement;
    this.gameContent = new Board(500, 500, this.gameContentEl);
    this.gameContent.setCanvasConfig();
    this.gameContentCX = this.gameContent.getCanvas().cx;

    this.gameInfoEl = this.gameInfoRef.nativeElement;
    this.gameInfo = new Board(800, 50, this.gameInfoEl);
    this.gameInfo.setCanvasConfig();
    this.gameInfoCX = this.gameInfo.getCanvas().cx;
    this.loadImages();
  }

  private loadImages(): void {
    this.drawTools.rubber.img.src = '../../../assets/draw-game/rubber.png';
    this.drawTools.line1.img.src = '../../../assets/draw-game/line-1.png';
    this.drawTools.line2.img.src = '../../../assets/draw-game/line-2.png';
    this.drawTools.line3.img.src = '../../../assets/draw-game/line-3.png';
    this.drawTools.line4.img.src = '../../../assets/draw-game/line-4.png';

    this.drawTools.line4.img.onload = () => {
      this.drawInfoText();
      this.setSample();
      this.drawAllTools();
    }
  }

  private drawAllTools() {
    this.drawTool(this.drawTools.rubber.img, this.drawTools.rubber.button, 10);
    this.drawTool(this.drawTools.line1.img, this.drawTools.line1.button, 70);
    this.drawTool(this.drawTools.line2.img, this.drawTools.line2.button, 120);
    this.drawTool(this.drawTools.line3.img, this.drawTools.line3.button, 170);
    this.drawTool(this.drawTools.line4.img, this.drawTools.line4.button, 220);
  }

  private setSample(): void {
    this.sampleDraw = this.arrayImgsCounts[this.currentSample].img;
    this.countdownConfig = {leftTime: this.arrayImgsCounts[this.currentSample].leftTime, format: 'mm:ss', demand: false};
    this.gameContentCX.clearRect(0, 0, this.gameContentEl.width, this.gameContentEl.height);
    this.drawAllTools();
  }

  private write(res: any): void {
    if (res.buttons !== 1) return;
    const rect = this.gameContentEl.getBoundingClientRect();
    const prevPos = {
      x: res.clientX - rect.left,
      y: res.clientY - rect.top
    };
    this.writeSingle(prevPos)
  }

  private writeSingle(prevPos: any, emit = true): void {
    const indexPointsArray = this.points.length-1;
    this.points[indexPointsArray].push(prevPos);
    if (this.points[indexPointsArray].length > 3) {
      const prevPost = this.points[indexPointsArray][this.points[indexPointsArray].length -1];
      const currentPos = this.points[indexPointsArray][this.points[indexPointsArray].length -2];
      this.drawOnCanvas(prevPost, currentPos);
    }
  }

  private drawOnCanvas(prevPos: any, currentPos: any): void {
    if(!this.gameContentCX) {
      return;
    }
    this.gameContentCX.beginPath();
    if(prevPos) {
      this.gameContentCX.lineWidth = this.lineWidth;
      this.gameContentCX.moveTo(prevPos.x, prevPos.y);
      this.gameContentCX.lineTo(currentPos.x, currentPos.y);
      this.gameContentCX.stroke();
    }
  }

  drawFinishedGameScreen(): void {
    this.clearContent(this.gameContentCX, this.gameContentEl);
    this.drawTitleMenuScreen('40px', 'FinishedGame');
    this.drawButtonMenuScreen('40px', this.button1, 'Next game', this.gameContentEl!.height/2.65, this.gameContentEl!.height/2, 100);
    this.drawButtonMenuScreen('40px', this.button2, 'Play again', this.gameContentEl!.height/1.4, this.gameContentEl!.height/1.2, 100);
  }

  drawTitleMenuScreen(fontSize: string, text: string): void {
    this.gameContentCX!.font = `${fontSize} Arial`;
    this.gameContentCX!.fillStyle = "white";
    this.gameContentCX!.textAlign = "center";
    this.gameContentCX!.fillText(text, this.gameContentEl!.width/2, this.gameContentEl!.height/5);
  }

  drawButtonMenuScreen(fontSize: string, button: any, text: string, buttonPosY: number, textPosY: number, buttonHeight: number): void {
    this.gameContentCX!.beginPath();
    this.gameContentCX!.strokeStyle = 'white';
    button.x = this.gameContentEl!.width/3.5;
    button.y = buttonPosY;
    this.gameContentCX!.rect(button.x, button.y, 215, buttonHeight);
    this.gameContentCX!.stroke();
    this.gameContentCX!.closePath();
    this.gameContentCX!.font = `${fontSize} Arial`;
    this.gameContentCX!.fillStyle = 'white';
    this.gameContentCX!.fillText(text, this.gameContentEl!.width/2, textPosY);
  }

  drawTool(image: HTMLImageElement, button: any, x: number): void {
    button.x = x;
    this.gameContentCX.drawImage(image, x, 10, 40, 40);
  }

  clearContent(cx: CanvasRenderingContext2D, el: any): void {
    cx.clearRect(0, 0, el.width, el.height);
  }

  drawInfoText(): void {
    this.clearContent(this.gameInfoCX, this.gameInfoEl);
    this.gameInfoCX.font = "30px Arial";
    this.gameInfoCX.fillStyle = "white";
    this.gameInfoCX.textAlign = "center";
    this.gameInfoCX.fillText(`Game 6: Draw game | Score: ${this.score}`, this.gameInfoEl!.width/2, this.gameInfoEl!.height/1.5);
  }
}
