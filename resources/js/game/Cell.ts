export default class Cell {
    constructor(
        protected size: number,
        protected column: number,
        protected row: number,
        protected context: CanvasRenderingContext2D,
    ) {
    }

    public draw(): void {
        const x = this.column * this.size;
        const y = this.row * this.size;

        this.context.strokeStyle = '#00fffa';
        this.context.strokeRect(x, y, this.size, this.size);
        this.context.fillStyle = '#1476a9';
        this.context.fillRect(x, y, this.size, this.size);
    }
}
