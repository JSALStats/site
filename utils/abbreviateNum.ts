export function abbreviateNum(num: number) {
    const units = ["", "K", "M", "B", "T"];
    let unitIndex = 0;

    while (num >= 1000 && unitIndex < units.length - 1) {
        num /= 1000;
        unitIndex++;
    }

    return parseFloat(num.toFixed(3)) + units[unitIndex];
}
