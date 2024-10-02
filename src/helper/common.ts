export function numberPadStart(number: number, padCount: number = 2): string {
    return number.toString().padStart(padCount, '0');
}

export function random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
