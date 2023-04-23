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
    }

    getRandomEmptyCell() {
        const emptyCells = this.cells.filter((cell) => cell.isEmpty());
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }
}
