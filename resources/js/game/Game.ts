import Cell from '@/game/Cell.ts';
import {random, randomWithExcluded} from '@/helper/random.ts';

enum EGameStatus {
    created,
    initiated,
    started,
    won,
    lost,
}

export default class Game {
    protected cells: Cell[][] = [];
    protected columns: number = 0; // todo не нравится название
    protected rows: number = 0; // todo не нравится название
    protected cellSize: number = 0;
    protected mineCount: number = 0;
    protected status: EGameStatus = EGameStatus.created;

    constructor(
        settings, //todo сделать объект настроек и передавать
        protected context: CanvasRenderingContext2D, // todo refac
    ) {
        this.columns = settings.columns;
        this.rows = settings.rows;
        this.cellSize = settings.cellSize;
        this.mineCount = settings.mineCount;
    }

    get isStarted(): boolean {
        return this.status === EGameStatus.started;
    }

    get isFinished(): boolean {
        return this.status === EGameStatus.won
            || this.status === EGameStatus.lost;
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
        this.status = EGameStatus.started;
        this.draw(); // todo remove
    }

    public init(): void {
        this.cells = [];

        for (let i = 0; i < this.rows; i++) {
            const row: Cell[] = [];

            for (let j = 0; j < this.columns; j++) {
                row.push(new Cell(this.cellSize, i, j, this.context));
            }

            this.cells.push(row);
        }

        this.status = EGameStatus.initiated;
        this.draw();
    }

    /**
     * todo - понял, что неправильный алгоритмы генерации
     * @param firstCell Ячейка вокруг и в которой не сгенерируются мины
     */
    public generateMines(firstCell?: Cell): void {
        if (!firstCell) {
            for (let i = 0; i < this.mineCount; i++) {
                const column = random(0, this.columns - 1);
                const row = random(0, this.rows - 1);
                const cell = this.cells[row][column];

                cell.setMine();
            }

            return;
        }

        const excludedColumnIndexes = [
            firstCell.column - 1,
            firstCell.column,
            firstCell.column + 1,
        ];

        const excludedRowIndexes = [
            firstCell.row - 1,
            firstCell.row,
            firstCell.row + 1,
        ];

        for (let i = 0; i < this.mineCount; i++) {
            const column = randomWithExcluded(0, this.columns - 1, excludedColumnIndexes);
            const row = randomWithExcluded(0, this.rows - 1, excludedRowIndexes);
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
        const firstCell = this.getCellByCoords(x, y);

        if (!this.isStarted) {
            this.start(firstCell);
        }

        const cellsToCheckAround: Cell[] = [];
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
