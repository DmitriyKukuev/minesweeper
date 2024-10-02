export type TDifficultPreset = {
    columnsCount: number;
    rowsCount: number;
    minesCount: number;
}

export type TDefaultDifficultPreset = TDifficultPreset & {
    name: string;
}
