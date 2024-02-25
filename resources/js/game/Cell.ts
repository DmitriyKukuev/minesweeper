const MAX_AROUND_MINE_COUNT = 8;

export default class Cell {
    protected isChecked: boolean = false;
    public aroundMineCount: number = 0;
    protected mine: boolean = false;

    constructor(
        protected size: number,
        protected column: number,
        protected row: number,
        protected context: CanvasRenderingContext2D, // todo один глобальный
    ) {
    }

    get hasMine(): boolean {
        return this.mine;
    }

    get hasAroundMineCount(): boolean {
        return this.aroundMineCount > 0;
    }

    public setMine(): this {
        this.mine = true
        this.aroundMineCount = -1; // для дебага

        return this;
    }

    public check(): this {
        this.isChecked = true;

        return this;
    }

    public setAroundMineCount(value: number) {
        if (value > MAX_AROUND_MINE_COUNT) {
            throw new Error('Максимум 8 мин вокруг');
        }

        if (!this.hasMine) {
            this.aroundMineCount = value;
        }

        return this;
    }

    //todo refac и красивый квадрат
    public draw(): void {
        const x = this.column * this.size;
        const y = this.row * this.size;
        const halsSize = Math.ceil(this.size / 2);
        const centerX = x + halsSize;
        const centerY = y + halsSize;

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

        //todo отрисовка для дебага

        if (this.hasMine) {
            const radius = Math.ceil(this.size / 4);

            this.context.beginPath();
            this.context.arc(centerX, centerY, radius, 0, Math.PI * 4);
            this.context.fillStyle = '#e51919';
            this.context.fill();
        }

        if (this.hasAroundMineCount) {
            this.context.fillStyle = '#111111';
            this.context.font = '14px Arial';
            this.context.fillText(this.aroundMineCount, centerX, centerY)
        }
    }
}
