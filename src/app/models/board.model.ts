export class Board {
    public width: number | undefined;
    public height: number | undefined;
    public canvasEl: any | undefined;
    public cx: CanvasRenderingContext2D;

    constructor(width: number, height: number, canvasEl: any) {
        this.width = width;
        this.height = height;
        this.canvasEl = canvasEl;
        this.cx = canvasEl.getContext('2d');
    }

    public setCanvasConfig() {
        this.canvasEl.width = this.width;
        this.canvasEl.height = this.height;
    }

    public getCanvas() {
        return {canvasEl: this.canvasEl, cx: this.cx};
    }
}