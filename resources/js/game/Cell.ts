export default class Cell {
    protected isChecked: boolean = false;
    protected isMine: boolean = false;

    constructor(
        protected size: number,
        protected column: number,
        protected row: number,
        protected context: CanvasRenderingContext2D, // todo один глобальный
    ) {
    }

    public draw(): void {
        const x = this.column * this.size;
        const y = this.row * this.size;

        if (this.isChecked) {
            this.context.strokeStyle = '#111111';
            this.context.strokeRect(x, y, this.size, this.size);
            this.context.fillStyle = '#c3cfd5';
            this.context.fillRect(x, y, this.size, this.size);

            return;
        }

        this.context.strokeStyle = '#00fffa';
        this.context.strokeRect(x, y, this.size, this.size);
        this.context.fillStyle = '#1476a9';
        this.context.fillRect(x, y, this.size, this.size);
    }

    public check(): this {
        this.isChecked = true;

        return this;
    }
}
