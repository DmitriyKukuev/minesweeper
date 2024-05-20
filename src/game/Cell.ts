const MAX_AROUND_MINE_COUNT = 8;

enum ECellStatus {
    unmarked,
    checked,
    flagged,
}

export default class Cell {
    public readonly id: string = '';
    protected aroundMinesCount: number = 0;
    protected mine: boolean = false;
    protected status: ECellStatus = ECellStatus.unmarked;
    protected pressed: boolean = false;

    constructor(
        protected size: number,
        public rowIndex: number,
        public columnIndex: number,
        protected ctx: CanvasRenderingContext2D,
    ) {
        this.id = `${rowIndex}-${columnIndex}`;
    }

    public get hasMine(): boolean {
        return this.mine;
    }

    public get hasAroundMinesCount(): boolean {
        return this.aroundMinesCount > 0;
    }

    public get getAroundMinesCount(): number {
        return this.aroundMinesCount;
    }

    public get isChecked(): boolean {
        return this.status === ECellStatus.checked;
    }

    public get isFlagged(): boolean {
        return this.status === ECellStatus.flagged;
    }

    public get isPressed(): boolean {
        return this.pressed;
    }

    public setPressed(state: boolean): this {
        this.pressed = state;

        return this;
    }

    public setMine(): this {
        this.mine = true
        this.aroundMinesCount = -1; // для дебага

        return this;
    }

    public setStatus(status: ECellStatus): this {
        this.status = status;

        return this;
    }

    public setAroundMineCount(value: number) {
        if (value > MAX_AROUND_MINE_COUNT) {
            throw new Error(`Максимум ${MAX_AROUND_MINE_COUNT} мин вокруг`);
        }

        if (!this.hasMine) {
            this.aroundMinesCount = value;
        }

        return this;
    }

    public check(): this {
        if (this.isFlagged || this.isChecked) {
            return this;
        }

        return this.setStatus(ECellStatus.checked);
    }

    /**
     * Пометить ячейку флажком
     */
    public flag(): this {
        if (this.isChecked) {
            return this;
        }

        if (this.isFlagged) {
            this.setStatus(ECellStatus.unmarked);
        } else {
            this.setStatus(ECellStatus.flagged);
        }

        return this;
    }

    //todo refac и красивый квадрат
    //todo методы по отрисовки разных состояний в отдельный класс
    public draw(): void {
        const x = this.columnIndex * this.size;
        const y = this.rowIndex * this.size;
        const halsSize = Math.ceil(this.size / 2);
        const centerX = x + halsSize;
        const centerY = y + halsSize;

        this.ctx.clearRect(x, y, this.size, this.size);

        if (this.isPressed) {
            this.ctx.fillStyle = '#0f4660';
            this.ctx.fillRect(x, y, this.size, this.size);
            this.ctx.strokeStyle = '#00fffa';
            this.ctx.strokeRect(x + 1, y + 1, this.size - 2, this.size - 2);
        } else if (this.isChecked) {
            this.ctx.fillStyle = '#c3cfd5';
            this.ctx.fillRect(x, y, this.size, this.size);
            this.ctx.strokeStyle = '#111111';
            this.ctx.strokeRect(x + 1, y + 1, this.size - 2, this.size - 2);

            if (this.hasMine) {
                const radius = Math.ceil(this.size / 4);

                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 4);
                this.ctx.fillStyle = '#e51919';
                this.ctx.fill();
            }

            if (this.hasAroundMinesCount) {
                this.ctx.fillStyle = '#111111';
                this.ctx.font = '14px Arial';
                this.ctx.fillText(String(this.aroundMinesCount), centerX, centerY);
            }
        } else {
            this.ctx.fillStyle = '#1476a9';
            this.ctx.fillRect(x, y, this.size, this.size);
            this.ctx.strokeStyle = '#00fffa';
            this.ctx.strokeRect(x + 1, y + 1, this.size - 2, this.size - 2);

            if (this.isFlagged) {
                const delta = this.size * 2/5;
                this.ctx.fillStyle = '#ce4747';
                this.ctx.strokeStyle = '#111111';
                this.ctx.beginPath();
                this.ctx.moveTo(x + delta, y + 1/2 * delta);
                this.ctx.lineTo(x + 2 * delta, y  + delta);
                this.ctx.lineTo(x + delta, y + 3/2 * delta);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.moveTo(x + delta, y + 3/2 * delta);
                this.ctx.lineTo(x + delta, y + 2 * delta);
                this.ctx.stroke();
            }
        }
    }
}
