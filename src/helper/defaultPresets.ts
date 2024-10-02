import {EDefaultPreset} from '@/enums/EDefaultPreset.ts';
import {TDefaultDifficultPreset} from '@/types/difficult-settings.ts';

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
