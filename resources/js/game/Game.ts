import Cell from '@/game/Cell.ts';

export default class Game {
    protected cells: Cell[][] = [];

    constructor(
        protected columns: number,
        protected rows: number,
        protected cellSize: number,
        protected context: CanvasRenderingContext2D,
    ) {
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

        this.draw();
    }
}
