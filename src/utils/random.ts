export function randomRange(min: number, max: number, random = Math.random): number {
    const a = Math.min(min, max);
    const b = Math.max(min, max);

    return a + (b - a) * random();

}
export function randomRangeInt(min: number, max: number, random = Math.random): number {
    const a = Math.min(min, max);
    const b = Math.max(min, max);

    return Math.floor(a + (b - a) * random());
}

export function randomEmptyCell(twoDArray: any[][], type: string) {
    const gridSize = twoDArray[0].length
    let emptyCells: { row: number, col: number }[] = []
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (twoDArray[row][col][type] == -1)
                emptyCells.push({ row, col })
        }
    }
    const randomChoose = randomRangeInt(0, emptyCells.length - 1)
    return emptyCells[randomChoose]
}



