// customize mv functions
export function customizeRPGMakerFunctions (mainComponent) {
    // WARN: directly changing engine code can be dangerous
    // remove preventDefault
    TouchInput._onWheel = function () {
        this._events.wheelX += event.deltaX
        this._events.wheelY += event.deltaY
    }

    // ignore click event when cheat modal shown and click inside cheat modal
    const TouchInput_onMouseDown = TouchInput._onMouseDown
    TouchInput._onMouseDown = function(event) {
        if (mainComponent.show) {
            const bcr = document.querySelector('#cheat-modal').getBoundingClientRect();
            if (bcr.left <= event.clientX && event.clientX <= bcr.left + bcr.width
                && bcr.top <= event.clientY && event.clientY <= bcr.top + bcr.height) {
                return
            }
        }

        TouchInput_onMouseDown.call(this, event)
    }
}
