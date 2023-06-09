import './styles/style.scss'
import { Cell } from 'cell'
import { Grid } from './grid'
import { Tile } from './tile'
import Hammer from 'hammerjs'
import { Input } from 'hammerjs'

const gameBoard = document.getElementById('game-board')

const hammer = new Hammer(gameBoard as HTMLElement) as HammerManager & typeof Input

const grid = new Grid(gameBoard as HTMLElement, 4)
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard as HTMLElement))
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard as HTMLElement))

setupInputOnce()

function setupInputOnce() {
    window.addEventListener('keydown', handleInput, { once: true })
}

hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL, threshold: 50 })
hammer.on('swipe', handleInput)

async function handleInput(e: KeyboardEvent | typeof Input) {
    if (!(e instanceof KeyboardEvent)) console.log('e.direction:', e.direction)
    switch (e instanceof KeyboardEvent ? e.key : e.direction) {
        case 'ArrowUp':
        case 8:
            if (!canMoveUp()) {
                setupInputOnce()
                return
            }
            await moveUp()
            break

        case 'ArrowDown':
        case 16:
            if (!canMoveDown()) {
                setupInputOnce()
                return
            }
            await moveDown()
            break

        case 'ArrowLeft':
        case 2:
            if (!canMoveLeft()) {
                setupInputOnce()
                return
            }
            await moveLeft()
            break

        case 'ArrowRight':
        case 4:
            if (!canMoveRight()) {
                setupInputOnce()
                return
            }
            await moveRight()
            break

        default:
            setupInputOnce()
            return
    }

    const newTile = new Tile(gameBoard as HTMLElement)
    grid.getRandomEmptyCell().linkTile(newTile)
    await newTile.waitForAnimationEnd()

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        await newTile.waitForAnimationEnd()
        alert('Try again!')
        return
    }

    setupInputOnce()
}

async function moveUp() {
    await slideTiles(grid.cellsGroupedByColumn)
}

async function moveDown() {
    await slideTiles(grid.cellsGroupedByReversedColumn)
}

async function moveLeft() {
    await slideTiles(grid.cellsGroupedByRow)
}

async function moveRight() {
    await slideTiles(grid.cellsGroupedByReversedRow)
}

async function slideTiles(groupedCells: Cell[][]) {
    const promises: Promise<void | unknown>[] = []
    groupedCells.forEach((group: Cell[]) => slideTilesInGroup(group, promises))

    await Promise.all(promises)

    grid.cells.forEach((cell) => {
        cell.hasTileForMerge() && cell.mergeTiles()
    })
}

function slideTilesInGroup(group: Cell[], promises: Promise<void | unknown>[]) {
    for (let i = 1; i < group.length; i++) {
        if (group[i].isEmpty()) continue

        const cellWithTile = group[i]

        let targetCell
        let j = i - 1

        if (cellWithTile.linkedTile)
            while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
                targetCell = group[j]
                j--
            }

        if (!targetCell) continue

        if (cellWithTile.linkedTile) promises.push(cellWithTile.linkedTile.waitForTransitionEnd())

        if (cellWithTile.linkedTile)
            if (targetCell.isEmpty()) {
                targetCell.linkTile(cellWithTile.linkedTile)
            } else {
                targetCell.linkTileForMerge(cellWithTile.linkedTile)
            }

        cellWithTile.unlinkTile()
    }
}

function canMoveUp() {
    return canMove(grid.cellsGroupedByColumn)
}

function canMoveDown() {
    return canMove(grid.cellsGroupedByReversedColumn)
}

function canMoveLeft() {
    return canMove(grid.cellsGroupedByRow)
}

function canMoveRight() {
    return canMove(grid.cellsGroupedByReversedRow)
}

function canMove(groupedCells: Cell[][]) {
    return groupedCells.some((group: Cell[]) => canMoveInGroup(group))
}

function canMoveInGroup(group: Cell[]) {
    return group.some((cell, index) => {
        if (index === 0) {
            return false
        }

        if (cell.isEmpty()) {
            return false
        }

        const targetCell = group[index - 1]
        if (cell.linkedTile) return targetCell.canAccept(cell.linkedTile)
    })
}
