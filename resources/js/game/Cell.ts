export default class Cell {
    protected isChecked: boolean = false;
    protected hasMine: boolean = false;

    constructor(
        protected size: number,
        protected column: number,
        protected row: number,
        protected context: CanvasRenderingContext2D, // todo один глобальный
    ) {
    }

    //todo refac и красивый квадрат
    public draw(): void {
        const x = this.column * this.size;
        const y = this.row * this.size;

        this.context.clearRect(x, y, this.size, this.size);

        if (this.isChecked) {
            this.context.fillStyle = '#c3cfd5';
            this.context.fillRect(x, y, this.size, this.size);
            this.context.strokeStyle = '#111111';
            this.context.strokeRect(x + 1, y + 1, this.size - 2, this.size - 2);
        } else {
            this.context.fillStyle = '#1476a9';
            this.context.fillRect(x, y, this.size, this.size);
            this.context.strokeStyle = '#00fffa';
            this.context.strokeRect(x + 1, y + 1, this.size - 2, this.size - 2);
        }

        //todo показываем мину всегда
        if (this.hasMine) {
            const halsSize = Math.ceil(this.size / 2);
            const centerX = x + halsSize;
            const centerY = y + halsSize;
            const radius = Math.ceil(this.size / 4);

            this.context.beginPath();
            this.context.arc(centerX, centerY, radius, 0, Math.PI * 4);
            this.context.fillStyle = '#e51919';
            this.context.fill();
        }
    }

    public check(): this {
        this.isChecked = true;

        return this;
    }

    public setMine(): this {
        this.hasMine = true

        return this;
    }
}
