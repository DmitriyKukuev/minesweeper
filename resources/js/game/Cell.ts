import {isDebug} from '@/helper/env.ts';

const MAX_AROUND_MINE_COUNT = 8;

export default class Cell {
    protected checked: boolean = false;
    public aroundMineCount: number = 0;
    protected mine: boolean = false;
    public readonly id: string = '';

    constructor(
        protected size: number,
        public rowIndex: number,
        public columnIndex: number,
        protected context: CanvasRenderingContext2D, // todo один глобальный
    ) {
        this.id = `${rowIndex}-${columnIndex}`;
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
        allCellsArray: this[][],
    ): void {
        for (let i = this.rowIndex - 1; i <= this.rowIndex + 1; i++) {
            for (let j = this.columnIndex - 1; j <= this.columnIndex + 1; j++) {
                if (
                    (i === this.rowIndex && j === this.columnIndex)
                    || !allCellsArray[i]
                    || !allCellsArray[i][j]
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
        if (isDebug()) {
            this.cheatDraw();
            return;
        }

        const x = this.columnIndex * this.size;
        const y = this.rowIndex * this.size;
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

    /**
     * Отрисовка с читерством - видно цифры и мины
     * @protected
     */
    protected cheatDraw(): void {
        const x = this.columnIndex * this.size;
        const y = this.rowIndex * this.size;
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
    }
}
