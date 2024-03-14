export enum EPreset {
    beginner,
    amateur,
    professional,
}

export type TPreset = {
    columnsCount: number;
    rowsCount: number;
    minesCount: number;
}

const defaultPresets: Record<EPreset, TPreset> = {
    [EPreset.beginner]: {
        columnsCount: 9,
        rowsCount: 9,
        minesCount: 10,
    },
    [EPreset.amateur]: {
        columnsCount: 16,
        rowsCount: 16,
        minesCount: 40,
    },
    [EPreset.professional]: {
        columnsCount: 30,
        rowsCount: 16,
        minesCount: 99,
    },
}

export default class Settings {
    public columnsCount: number = 0;
    public rowsCount: number = 0;
    public minesCount: number = 0;

    constructor(preset: EPreset | TPreset) {
        // Тип preset = EPreset
        if (typeof preset === 'number') {
            preset = defaultPresets[preset];
        }

        this.columnsCount = preset.columnsCount;
        this.rowsCount = preset.rowsCount;
        this.minesCount = preset.minesCount;
    }
}
