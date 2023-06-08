import { Tile } from 'tile'

export class Cell {
    x: number
    y: number
    linkedTile: Tile | null = null
    linkedTileForMerge: Tile | null = null
    constructor(gridElement: HTMLElement, x: number, y: number) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        gridElement.append(cell)

        this.x = x
        this.y = y
    }

    linkTile(tile: Tile) {
        tile.setXY(this.x, this.y)
        this.linkedTile = tile
    }

    isEmpty() {
        return !this.linkedTile
    }

    unlinkTile() {
        this.linkedTile = null
    }

    unlinkTileForMerge() {
        this.linkedTileForMerge = null
    }

    linkTileForMerge(tile: Tile) {
        tile.setXY(this.x, this.y)
        this.linkedTileForMerge = tile
    }

    hasTileForMerge() {
        return !!this.linkedTileForMerge
    }

    canAccept(newTile: Tile) {
        return (
            this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile?.value === newTile.value)
        )
    }

    mergeTiles() {
        this.linkedTile?.setValue(this.linkedTile.value + Number(this.linkedTileForMerge?.value))
        this.linkedTileForMerge?.removeFromDom()
        this.unlinkTileForMerge()
    }
}
