import {env} from '@/helper/env.ts';

const MAX_AROUND_MINE_COUNT = 8;

enum ECellStatus {
    unmarked,
    checked,
    flagged,
}

export default class Cell {
    protected aroundMinesCount: number = 0;
    protected mine: boolean = false;
    public readonly id: string = '';
    protected status: ECellStatus = ECellStatus.unmarked;

    constructor(
        protected size: number,
        public rowIndex: number,
        public columnIndex: number,
        protected context: CanvasRenderingContext2D,
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

        //todo завершение игры
        if (this.hasMine) {
            alert('you died');
            this.setStatus(ECellStatus.checked);

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
        if (env.isCheatsEnabled && env.isDev) {
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

            if (this.hasAroundMinesCount) {
                this.context.fillStyle = '#111111';
                this.context.font = '14px Arial';
                this.context.fillText(String(this.aroundMinesCount), centerX, centerY);
            }
        } else {
            this.context.fillStyle = '#1476a9';
            this.context.fillRect(x, y, this.size, this.size);
            this.context.strokeStyle = '#00fffa';
            this.context.strokeRect(x + 1, y + 1, this.size - 2, this.size - 2);

            if (this.isFlagged) {
                const delta = this.size * 2/5;
                this.context.fillStyle = '#ce4747';
                this.context.strokeStyle = '#111111';
                this.context.beginPath();
                this.context.moveTo(x + delta, y + 1/2 * delta);
                this.context.lineTo(x + 2 * delta, y  + delta);
                this.context.lineTo(x + delta, y + 3/2 * delta);
                this.context.closePath();
                this.context.fill();
                this.context.moveTo(x + delta, y + 3/2 * delta);
                this.context.lineTo(x + delta, y + 2 * delta);
                this.context.stroke();
            }
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

        if (this.hasAroundMinesCount) {
            this.context.fillStyle = '#111111';
            this.context.font = '14px Arial';
            this.context.fillText(String(this.aroundMinesCount), centerX, centerY);
        }

        if (this.isFlagged) {
            const delta = this.size * 2/5;
            this.context.fillStyle = '#ce4747';
            this.context.strokeStyle = '#111111';
            this.context.beginPath();
            this.context.moveTo(x + delta, y + 1/2 * delta);
            this.context.lineTo(x + 2 * delta, y  + delta);
            this.context.lineTo(x + delta, y + 3/2 * delta);
            this.context.closePath();
            this.context.fill();
            this.context.moveTo(x + delta, y + 3/2 * delta);
            this.context.lineTo(x + delta, y + 2 * delta);
            this.context.stroke();
        }
    }
}
