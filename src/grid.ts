import { Cell } from './cell'

export class Grid {
    cells: Cell[]
    cellsGroupedByColumn: Cell[][]
    cellsGroupedByReversedColumn: Cell[][]
    cellsGroupedByRow: Cell[][]
    cellsGroupedByReversedRow: Cell[][]

    constructor(gridElement: HTMLElement, countCells: number) {
        gridElement.style.setProperty('--cell-count', countCells.toString())
        this.cells = []

        for (let i = 0; i < Math.pow(countCells, 2); i++) {
            this.cells.push(new Cell(gridElement, i % countCells, Math.floor(i / countCells)))
        }

        this.cellsGroupedByColumn = this.cellsGroupeByColumn()

        this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map((column) =>
            [...column].reverse()
        )

        this.cellsGroupedByRow = this.cellsGroupeByRow()

        this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map((row) => [...row].reverse())
    }

    getRandomEmptyCell() {
        const emptyCells = this.cells.filter((cell) => cell.isEmpty())
        const randomIndex = Math.floor(Math.random() * emptyCells.length)
        return emptyCells[randomIndex]
    }

    cellsGroupeByColumn(): Cell[][] {
        return this.cells.reduce((groupedCells: Cell[][], cell) => {
            groupedCells[cell.x] = groupedCells[cell.x] || []
            groupedCells[cell.x][cell.y] = cell
            return groupedCells
        }, [])
    }

    cellsGroupeByRow() {
        return this.cells.reduce((groupedCells: Cell[][], cell) => {
            groupedCells[cell.y] = groupedCells[cell.y] || []
            groupedCells[cell.y][cell.x] = cell
            return groupedCells
        }, [])
    }
}
