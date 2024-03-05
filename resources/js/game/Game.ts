import Cell from '@/game/Cell.ts';
import {random} from '@/helper/random.ts';
import {env} from '@/helper/env.ts';

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

    /**
     * Отрисовка всего поля, или массива ячеек, или ячейки
     * @param cells Ячейка или ячейки для отрисовки
     */
    protected draw(cells?: Cell|Array<Cell>): void {
        if (!cells) {
            this.cells.forEach((row) => {
                row.forEach((cell) => {
                    cell.draw();
                });
            });

            return;
        }

        if (!Array.isArray(cells)) {
            cells = [<Cell>cells];
        }

        cells?.forEach((cell) => {
            cell.draw();
        });
    }

    /**
     * @param firstCell Ячейка вокруг и в которой не сгенерируются мины
     */
    public start(firstCell?: Cell): void {
        this.generateMines(firstCell);
        this.setCellsAroundMineCount();
        this.setStatus(EGameStatus.started);

        // Если включены читы, то отрисовать все поле
        if (env.isCheatsEnabled && env.isDev) {
            this.draw();
        }
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

    /**
     * Получить массив ячеек вокруг ячейки
     * @param cell
     * @protected
     */
    protected getAroundCells(cell: Cell): Cell[] {
        const aroundCells: Cell[] = [];

        for (let i = cell.rowIndex - 1; i <= cell.rowIndex + 1; i++) {
            for (let j = cell.columnIndex - 1; j <= cell.columnIndex + 1; j++) {
                if (
                    (i === cell.rowIndex && j === cell.columnIndex)
                    || !this.cells[i]
                    || !this.cells[i][j]
                ) {
                    continue;
                }

                aroundCells.push(this.cells[i][j]);
            }
        }

        return aroundCells;
    }

    public onLeftClick(x: number, y: number): void {
        const firstCell = this.getCellByCoords(x, y);

        if (!this.isStarted) {
            this.start(firstCell);
        }

        const cellsToCheckAround: Cell[] = [firstCell];
        const cellsToDraw: Cell[] = [];

        do {
            const cell = cellsToCheckAround.pop();

            if (!cell || cell.isChecked) {
                continue;
            }

            cell.check();
            cellsToDraw.push(cell);

            if (cell.hasMine) {
                return;
            }

            if (cell.hasAroundMinesCount) {
                continue;
            }

            this.getAroundCells(cell).forEach((nearCell) => {
                cellsToCheckAround.push(nearCell);
            });
        } while (cellsToCheckAround.length)

        this.draw(cellsToDraw);
    }

    public onRightClick(x: number, y: number): void {
        const cell = this.getCellByCoords(x, y);
        cell.flag();
        this.draw(cell);
    }

    protected setCellAroundMineCount(cell: Cell): void {
        if (cell.hasMine) {
            return;
        }

        const aroundMineCount = this
            .getAroundCells(cell)
            .reduce((count, nearCell) => {
                if (nearCell.hasMine) {
                    count++;
                }

                return count;
            }, 0);

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
