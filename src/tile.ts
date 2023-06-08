export class Tile {
    value: number = 0
    tileElement: HTMLElement
    x: number = 0
    y: number = 0

    constructor(gridElement: HTMLElement) {
        this.tileElement = document.createElement('div')
        this.tileElement.classList.add('tile')
        this.setValue(Math.random() > 0.5 ? 2 : 4)
        gridElement.append(this.tileElement)
    }

    setXY(x: number, y: number) {
        this.x = x
        this.y = y
        this.tileElement.style.setProperty('--x', x.toString())
        this.tileElement.style.setProperty('--y', y.toString())
    }

    setValue(value: number) {
        this.value = value
        this.tileElement.textContent = value.toString()
        const bgLightness = 100 - Math.log2(value) * 9
        this.tileElement.style.setProperty('--bg-lightness', `${bgLightness}%`)
        this.tileElement.style.setProperty('--text-lightness', `${bgLightness < 50 ? 90 : 10}%`)
    }

    removeFromDom() {
        this.tileElement.remove()
    }

    waitForTransitionEnd() {
        return new Promise((resolve) => {
            this.tileElement.addEventListener('transitionend', resolve, {
                once: true,
            })
        })
    }

    waitForAnimationEnd() {
        return new Promise((resolve) => {
            this.tileElement.addEventListener('animationend', resolve, {
                once: true,
            })
        })
    }
}
