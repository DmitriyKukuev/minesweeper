import {TDefaultDifficultPreset, TDifficultPreset} from '@/types/difficult-settings.ts';
import {EDefaultPreset} from '@/enums/EDefaultPreset.ts';
import {defaultPresets} from '@/helper/defaultPresets.ts';

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
