export function random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomWithExcluded(min: number, max: number, excluded: number[] = []): number {
    const excludedSet = new Set(excluded);
    const numberArray: number[] = [];

    for (let i = min; i <= max; i++) {
        if (!excludedSet.has(i)) {
            numberArray.push(i);
        }
    }

    const index = random(0, numberArray.length - 1);

    return numberArray[index];
}
