import { Cell } from "./cell.js";

export class Grid {
    constructor(gridElement, countCells) {
        gridElement.style.setProperty("--cell-count", countCells);
        this.cells = [];

        for (let i = 0; i < Math.pow(countCells, 2); i++) {
            this.cells.push(
                new Cell(
                    gridElement,
                    i % countCells,
                    Math.floor(i / countCells)
                )
            );
        }

        this.cellsGroupedByColumn = this.cellsGroupedByColumn();

        this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(
            (column) => [...column].reverse()
        );

        this.cellsGroupedByRow = this.cellsGroupedByRow();

        this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map((row) =>
            [...row].reverse()
        );
    }

    getRandomEmptyCell() {
        const emptyCells = this.cells.filter((cell) => cell.isEmpty());
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }

    cellsGroupedByColumn() {
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.x] = groupedCells[cell.x] || [];
            groupedCells[cell.x][cell.y] = cell;
            return groupedCells;
        }, []);
    }

    cellsGroupedByRow() {
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.y] = groupedCells[cell.y] || [];
            groupedCells[cell.y][cell.x] = cell;
            return groupedCells;
        }, []);
    }
}
