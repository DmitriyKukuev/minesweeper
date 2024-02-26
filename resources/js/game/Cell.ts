const MAX_AROUND_MINE_COUNT = 8;

export default class Cell {
    protected checked: boolean = false;
    public aroundMineCount: number = 0;
    protected mine: boolean = false;
    public readonly id: string = '';

    constructor(
        protected size: number,
        protected row: number, // todo не нравится название
        protected column: number, // todo не нравится название
        protected context: CanvasRenderingContext2D, // todo один глобальный
    ) {
        this.id = `${row}-${column}`;
    }

    public get hasMine(): boolean {
        return this.mine;
    }

    public get hasAroundMineCount(): boolean {
        return this.aroundMineCount > 0;
    }

    public get isChecked(): boolean {
        return this.checked;
    }

    public setMine(): this {
        this.mine = true
        this.aroundMineCount = -1; // для дебага

        return this;
    }

    public check(): this {
        this.checked = true;

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

    public forAroundCells(
        callback: (nearCell: this) => void,
        maxRows: number,
        maxColumns: number,
        allCellsArray: this[][],
    ): void {
        for (let i = this.row - 1; i <= this.row + 1; i++) {
            for (let j = this.column - 1; j <= this.column + 1; j++) {
                if (
                    (i === this.row && j === this.column)
                    || i < 0
                    || i >= maxRows
                    || j < 0
                    || j >= maxColumns
                ) {
                    continue;
                }

                const nearCell = allCellsArray[i][j];

                callback(nearCell);
            }
        }
    }

    public onClick(): this {
        if (this.isChecked) {
            return this;
        }

        //todo завершение игры
        if (this.hasMine) {
            alert('you died');
            this.check().draw();

            return this;
        }

        //todo делать отрисовку отдельно
        this.check().draw();

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
                this.context.fillText(String(this.aroundMineCount), centerX, centerY);
            }
        } else {
            this.context.fillStyle = '#1476a9';
            this.context.fillRect(x, y, this.size, this.size);
            this.context.strokeStyle = '#00fffa';
            this.context.strokeRect(x + 1, y + 1, this.size - 2, this.size - 2);
        }
    }
}
