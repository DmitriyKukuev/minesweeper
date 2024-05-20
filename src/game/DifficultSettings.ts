export enum EDefaultPreset {
    beginner = 'beginner',
    amateur = 'amateur',
    professional = 'professional',
}

export type TDifficultPreset = {
    columnsCount: number;
    rowsCount: number;
    minesCount: number;
}

const defaultPresets: Record<EDefaultPreset, TDifficultPreset> = {
    [EDefaultPreset.beginner]: {
        columnsCount: 9,
        rowsCount: 9,
        minesCount: 10,
    },
    [EDefaultPreset.amateur]: {
        columnsCount: 16,
        rowsCount: 16,
        minesCount: 40,
    },
    [EDefaultPreset.professional]: {
        columnsCount: 30,
        rowsCount: 16,
        minesCount: 99,
    },
}

export default class DifficultSettings {
    public columnsCount: number = 0;
    public rowsCount: number = 0;
    public minesCount: number = 0;

    constructor(preset: EDefaultPreset | TDifficultPreset) {
        if (typeof preset === 'string') {
            preset = defaultPresets[preset];
        }

        this.columnsCount = preset.columnsCount;
        this.rowsCount = preset.rowsCount;
        this.minesCount = preset.minesCount;
    }

    public setPreset(preset: EDefaultPreset | TDifficultPreset): this {
        if (typeof preset === 'string') {
            preset = defaultPresets[preset];
        }

        this.columnsCount = preset.columnsCount;
        this.rowsCount = preset.rowsCount;
        this.minesCount = preset.minesCount;

        return this;
    }
}
