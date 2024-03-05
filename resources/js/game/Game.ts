import Cell from '@/game/Cell.ts';
import {random} from '@/helper/random.ts';

enum EGameStatus {
    created,
    initiated,
    started,
    won,
    lost,
}

export default class Game {
    protected cells: Cell[][] = [];
    protected columnsCount: number = 0;
    protected rowsCount: number = 0;
    protected cellSize: number = 0;
    protected minesCount: number = 0;
    protected status: EGameStatus = EGameStatus.created;

    constructor(
        settings, //todo сделать объект настроек и передавать
        protected context: CanvasRenderingContext2D,
    ) {
        this.columnsCount = settings.columns;
        this.rowsCount = settings.rows;
        this.cellSize = settings.cellSize;
        this.minesCount = settings.mineCount;
    }

    public get isStarted(): boolean {
        return this.status === EGameStatus.started;
    }

    public get isFinished(): boolean {
        return this.status === EGameStatus.won
            || this.status === EGameStatus.lost;
    }

    public get realMinesCount(): number {
        let count = 0;

        this.cells.forEach((row) => {
            row.forEach((cell) => {
                if (cell.hasMine) {
                    count++;
                }
            });
        });

        return count;
    }

    protected setStatus(status: EGameStatus): this {
        this.status = status;

        return this;
    }

    protected draw(): void {
        for (const rowKey in this.cells) {
            const row = this.cells[rowKey];

            for (const columnKey in row) {
                const cell = row[columnKey];

                cell.draw();
            }
        }
    }

    /**
     * @param firstCell Ячейка вокруг и в которой не сгенерируются мины
     */
    public start(firstCell?: Cell): void {
        this.generateMines(firstCell);
        this.setCellsAroundMineCount();
        this.setStatus(EGameStatus.started);
        this.draw(); // todo remove
    }

    public init(): void {
        this.cells = [];

        for (let i = 0; i < this.rowsCount; i++) {
            const row: Cell[] = [];

            for (let j = 0; j < this.columnsCount; j++) {
                row.push(new Cell(this.cellSize, i, j, this.context));
            }

            this.cells.push(row);
        }

        this.setStatus(EGameStatus.initiated);
        this.draw();
    }

    /**
     * @param firstCell Ячейка вокруг и в которой не сгенерируются мины
     */
    public generateMines(firstCell?: Cell): void {
        if (!firstCell) {
            for (let i = 0; i < this.minesCount; i++) {
                const column = random(0, this.columnsCount - 1);
                const row = random(0, this.rowsCount - 1);
                const cell = this.cells[row][column];

                cell.setMine();
            }

            return;
        }

        const excludedRowIndexes = [
            firstCell.rowIndex - 1,
            firstCell.rowIndex,
            firstCell.rowIndex + 1,
        ];

        const excludedColumnIndexes = [
            firstCell.columnIndex - 1,
            firstCell.columnIndex,
            firstCell.columnIndex + 1,
        ];

        const localCells: Cell[] = [];

        this.cells.forEach((row) => {
            row.forEach((cell) => {
                if (
                    excludedRowIndexes.includes(cell.rowIndex)
                    && excludedColumnIndexes.includes(cell.columnIndex)
                ) {
                    return;
                }

                localCells.push(cell);
            });
        });

        for (let i = 0; i < this.minesCount; i++) {
            const index = random(0, localCells.length - 1);
            const localCell = localCells[index];
            const realCell = this.cells[localCell.rowIndex][localCell.columnIndex];
            realCell.setMine();
            localCells.splice(index, 1);
        }
    }

    protected getCellByCoords(x: number, y: number): Cell {
        const column = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        return this.cells[row][column];
    }

    //todo отдельный метод для отрисовки мин
    public onLeftClick(x: number, y: number): void {
        const firstCell = this.getCellByCoords(x, y);

        if (!this.isStarted) {
            this.start(firstCell);
        }

        const cellsToCheckAround: Cell[] = [firstCell];

        do {
            const cell = cellsToCheckAround.pop();

            if (!cell || cell.isChecked) {
                continue;
            }

            cell.check();

            if (cell.hasMine) {
                return;
            }

            if (cell.hasAroundMinesCount) {
                continue;
            }

            cell.forAroundCells((nearCell) => {
                cellsToCheckAround.push(nearCell);
            }, this.cells);
        } while (cellsToCheckAround.length)
    }

    public onRightClick(x: number, y: number): void {
        const cell = this.getCellByCoords(x, y);
        cell.flag();
    }

    protected setCellAroundMineCount(cell: Cell): void {
        if (cell.hasMine) {
            return;
        }

        let aroundMineCount = 0;

        cell.forAroundCells((nearCell) => {
            if (nearCell.hasMine) {
                aroundMineCount++;
            }
        }, this.cells);

        cell.setAroundMineCount(aroundMineCount);
    }

    protected setCellsAroundMineCount(): void {
        for (let row = 0; row < this.rowsCount; row++) {
            for (let column = 0; column < this.columnsCount; column++) {
                const cell = this.cells[row][column];

                this.setCellAroundMineCount(cell);
            }
        }
    }
}
