class Cursor {
    private element: HTMLElement
    private blinkTime: number = 1000
    private blinkerInterval

    constructor(id: string) {
        this.element = document.getElementById(id)
        this.startBlinking()
    }

    private hide = (): void => {
        this.element.classList.add("invisible")
        this.element.classList.remove("visible")

    }
    private show = (): void => {
        this.element.classList.add("visible")
        this.element.classList.remove("invisible")
    }

    private startBlinking(): void {
        this.blinkerInterval = setInterval(() => {
            setTimeout(this.hide, 0)
            setTimeout(this.show, this.blinkTime * 0.4)
        }, this.blinkTime)

        this.show()
    }

    private stopBlinking(): void {
        clearInterval(this.blinkerInterval)
    }

    hasMovedHook(): void {
        this.stopBlinking()
        this.startBlinking()
    }
}