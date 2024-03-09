export function numberPadStart(number: number, padCount: number = 2): string {
    return number.toString().padStart(padCount, '0');
}
