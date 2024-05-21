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

export type TDefaultDifficultPreset = TDifficultPreset & {
    name: string;
}

export const defaultPresets: Record<EDefaultPreset, TDefaultDifficultPreset> = {
    [EDefaultPreset.beginner]: {
        name: 'Новичок',
        columnsCount: 9,
        rowsCount: 9,
        minesCount: 10,
    },
    [EDefaultPreset.amateur]: {
        name: 'Любитель',
        columnsCount: 16,
        rowsCount: 16,
        minesCount: 40,
    },
    [EDefaultPreset.professional]: {
        name: 'Профессионал',
        columnsCount: 30,
        rowsCount: 16,
        minesCount: 99,
    },
}

export default class DifficultSettings {
    public name: string = 'Своя игра';
    public columnsCount: number = 0;
    public rowsCount: number = 0;
    public minesCount: number = 0;

    constructor(preset: EDefaultPreset | TDifficultPreset) {
        this.setPreset(preset);
    }

    public setPreset(preset: EDefaultPreset | TDifficultPreset): this {
        let localPreset: TDifficultPreset;

        if (typeof preset === 'string') {
            localPreset = defaultPresets[preset];
            this.name = (<TDefaultDifficultPreset>localPreset).name;
        } else {
            localPreset = preset;
        }

        this.columnsCount = localPreset.columnsCount;
        this.rowsCount = localPreset.rowsCount;
        this.minesCount = localPreset.minesCount;

        return this;
    }
}
