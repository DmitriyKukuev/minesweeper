import Cell from '@/game/Cell.ts';
import {random} from '@/helper/common.ts';

export default class Game {
    protected cells: Cell[][] = [];
    protected columns: number = 0; // todo не нравится название
    protected rows: number = 0; // todo не нравится название
    protected cellSize: number = 0;
    protected mineCount: number = 0;

    constructor(
        settings, //todo сделать объект настроек и передавать
        protected context: CanvasRenderingContext2D, // todo refac
    ) {
        this.columns = settings.columns;
        this.rows = settings.rows;
        this.cellSize = settings.cellSize;
        this.mineCount = settings.mineCount;
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

    public start(): void {
        for (let i = 0; i < this.rows; i++) {
            const row: Cell[] = [];

            for (let j = 0; j < this.columns; j++) {
                row.push(new Cell(this.cellSize, i, j, this.context));
            }

            this.cells.push(row);
        }

        //todo пока при запуске игры, а не первом клике
        this.generateMines();
        this.setCellsAroundMineCount();
        this.draw();
    }

    //todo сделать при первом клике
    public generateMines(): void {
        for (let i = 0; i < this.mineCount; i++) {
            const column = random(0, this.columns - 1);
            const row = random(0, this.rows - 1);
            const cell = this.cells[row][column];

            cell.setMine();
        }
    }

    protected getCellByCoords(x: number, y: number): Cell {
        const column = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        return this.cells[row][column];
    }

    //todo отдельный метод для отрисовки мин
    public onClick(x: number, y: number): void {
        const cellsToCheckAround: Cell[] = [];
        const firstCell = this.getCellByCoords(x, y);

        cellsToCheckAround.push(firstCell);

        do {
            const cell = cellsToCheckAround.pop();

            if (!cell || cell.isChecked) {
                continue;
            }

            cell.onClick();

            if (cell.hasMine) {
                return;
            }

            if (cell.hasAroundMineCount) {
                continue;
            }

            cell.forAroundCells((nearCell) => {
                cellsToCheckAround.push(nearCell);
            }, this.rows, this.columns, this.cells);
        } while (cellsToCheckAround.length)
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
        }, this.rows, this.columns, this.cells);

        cell.setAroundMineCount(aroundMineCount);
    }

    protected setCellsAroundMineCount(): void {
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                const cell = this.cells[row][column];

                this.setCellAroundMineCount(cell);
            }
        }
    }
}
