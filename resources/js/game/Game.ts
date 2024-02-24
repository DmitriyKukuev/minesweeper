import Cell from '@/game/Cell.ts';

export default class Game {
    protected cells: Cell[][] = [];
    protected columns: number = 0;
    protected rows: number = 0;
    protected cellSize: number = 0;
    protected minesCount: number = 0;

    constructor(
        settings, //todo сделать объект настроек и передавать
        protected context: CanvasRenderingContext2D, // todo refac
    ) {
        this.columns = settings.columns;
        this.rows = settings.rows;
        this.cellSize = settings.cellSize;
        this.minesCount = settings.minesCount;
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
                row.push(new Cell(this.cellSize, j, i, this.context));
            }

            this.cells.push(row);
        }

        //todo пока при запуске игры, а не первом клике
        this.generateMines();
        this.draw();
    }

    public generateMines(): void {
        //todo процедурная генерация мин
        this.cells[3][4].setMine();
        this.cells[9][4].setMine();
        this.cells[0][1].setMine();
        this.cells[5][9].setMine();
    }

    protected getCellByCoords(x: number, y: number): Cell {
        const column = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        return this.cells[row][column];
    }

    public updateByCoords(x: number, y: number): void {
        const cell = this.getCellByCoords(x, y);
        cell.check().draw();
    }
}
