import Cell from '@/game/Cell.ts';
import Timer from '@/game/Timer.ts';
import DifficultSettings from '@/game/DifficultSettings.ts';
import {random} from '@/helper/common.ts';
import {EGameStatus} from '@/enums/EGameStatus.ts';

export default class Game {
    protected columnsCount: number = 0;
    protected rowsCount: number = 0;
    protected cellSize: number = 0;
    protected minesCount: number = 0;
    protected status: EGameStatus = EGameStatus.created;

    protected cells: Cell[][] = [];
    protected hoveredCells: Cell[] = [];

    protected hasCheckedMine = false;
    protected checkedCellsCount = 0;

    protected timer = new Timer();

    constructor(
        settings: DifficultSettings,
        cellSize: number,
        protected ctx: CanvasRenderingContext2D,
    ) {
        this.columnsCount = settings.columnsCount;
        this.rowsCount = settings.rowsCount;
        this.minesCount = settings.minesCount;
        this.cellSize = cellSize;
    }

    //region Геттеры
    public get isStarted(): boolean {
        return this.status === EGameStatus.started;
    }

    public get isFinished(): boolean {
        return this.status === EGameStatus.won
            || this.status === EGameStatus.lost;
    }

    protected get allWithoutMinesCellsChecked(): boolean {
        return this.checkedCellsCount + this.minesCount === this.rowsCount * this.columnsCount;
    }

    public get getTimer(): Timer {
        return this.timer;
    }

    //endregion

    //region Основные методы игры
    public init(): void {
        this.reboot();
        this.cells = [];

        for (let i = 0; i < this.rowsCount; i++) {
            const row: Cell[] = [];

            for (let j = 0; j < this.columnsCount; j++) {
                row.push(new Cell(this.cellSize, i, j, this.ctx));
            }

            this.cells.push(row);
        }

        this.setStatus(EGameStatus.initiated);
        this.draw();
    }

    /**
     * @param firstCell Ячейка вокруг и в которой не сгенерируются мины
     */
    public start(firstCell?: Cell): void {
        this.generateMines(firstCell);
        this.setCellsAroundMineCount();
        this.timer.start();
        this.setStatus(EGameStatus.started);
    }

    protected finish(status: EGameStatus.won | EGameStatus.lost): void {
        if (status === EGameStatus.lost) {
            alert('you lost');
        } else {
            alert('you won');
        }

        this.timer.stop();
        this.checkMines();
        this.setStatus(status);
    }

    /**
     * Перезагрузить информацию игры для начала новой
     * @protected
     */
    protected reboot(): void {
        this.hasCheckedMine = false;
        this.checkedCellsCount = 0;
        this.timer.reboot();
        this.setStatus(EGameStatus.created);
    }

    protected setStatus(status: EGameStatus): this {
        this.status = status;

        return this;
    }

    /**
     * Отрисовка всего поля, или массива ячеек, или ячейки
     * @param cells Ячейка или ячейки для отрисовки
     */
    protected draw(cells?: Cell | Array<Cell>): void {
        // Если ячейки не выбраны, то рисуем все поле
        if (!cells) {
            this.cells.forEach((row) => {
                row.forEach((cell) => {
                    cell.draw();
                });
            });

            return;
        }

        if (!Array.isArray(cells)) {
            cells = [cells];
        }

        cells.forEach((cell) => {
            cell.draw();
        });
    }

    //endregion

    //region Обработчики кликов
    public onLeftClick(x: number, y: number): void {
        // Нет действий по клику, если игра закончена
        if (this.isFinished) {
            return;
        }

        const firstCell = this.getCellByCoords(x, y);

        if (!this.isStarted) {
            this.start(firstCell);
        }

        if (firstCell.isChecked) {
            this.checkAroundCell(firstCell);
        } else {
            this.checkCells(firstCell);
        }

        if (this.hasCheckedMine) {
            this.finish(EGameStatus.lost);
        } else if (this.allWithoutMinesCellsChecked) {
            this.finish(EGameStatus.won);
        }
    }

    public onRightClick(x: number, y: number): void {
        // Нет действий по клику, если игра закончена
        if (this.isFinished) {
            return;
        }

        const cell = this.getCellByCoords(x, y);
        cell.flag();
        this.draw(cell);
    }

    /**
     * Подсветка ячеек, которые откроются при клике
     * @param x
     * @param y
     */
    public onLeftDown(x: number, y: number): void {
        if (this.isFinished) {
            return;
        }

        const cell = this.getCellByCoords(x, y);

        if (cell.isChecked) {
            const cellsToHover = this
                .getAroundCells(cell)
                .filter((cell) => !cell.isChecked && !cell.isFlagged)

            this.hoveredCells.push(...cellsToHover);
        } else {
            this.hoveredCells.push(cell);
        }

        this.hoveredCells.forEach((cell) => cell.setPressed(true));
        this.draw(this.hoveredCells);
    }

    public onLeftUp(): void {
        this.hoveredCells.forEach((cell) => cell.setPressed(false));
        this.draw(this.hoveredCells);
        this.hoveredCells = [];
    }

    //endregion

    /**
     * @param firstCell Ячейка, вокруг и в которой не сгенерируются мины
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

    protected checkCells(cellsToCheck: Cell | Array<Cell>): void {
        if (!Array.isArray(cellsToCheck)) {
            cellsToCheck = [cellsToCheck];
        }

        const cellsToDraw: Cell[] = [];

        do {
            const cell = cellsToCheck.pop();

            if (!cell || cell.isChecked || cell.isFlagged) {
                continue;
            }

            // Проигрыш
            if (cell.hasMine) {
                this.hasCheckedMine = true;

                break;
            }

            cell.check();
            this.checkedCellsCount++;
            cellsToDraw.push(cell);

            if (cell.hasAroundMinesCount) {
                continue;
            }

            this.getAroundCells(cell).forEach((nearCell) => {
                (<Array<Cell>>cellsToCheck).push(nearCell);
            });
        } while (cellsToCheck.length)

        this.draw(cellsToDraw);
    }

    protected checkMines(): void {
        const cellsToDraw: Cell[] = [];

        this.cells.forEach((row) => {
            row.forEach((cell) => {
                if (cell.hasMine) {
                    cell.check();
                    cellsToDraw.push(cell);
                }
            });
        });

        this.draw(cellsToDraw);
    }

    /**
     * Чекнуть ячейки вокруг с учетом выставленных флажков и количества мин начальной ячейки
     * @param firstCell
     * @protected
     */
    protected checkAroundCell(firstCell: Cell): void {
        if (!firstCell.hasAroundMinesCount) {
            return;
        }

        const aroundCells = this.getAroundCells(firstCell);

        const aroundFlagsCount = aroundCells.reduce((count, cell) => {
            if (cell.isFlagged) {
                count++;
            }

            return count;
        }, 0)

        if (aroundFlagsCount !== firstCell.getAroundMinesCount) {
            return;
        }

        this.checkCells(aroundCells);
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
