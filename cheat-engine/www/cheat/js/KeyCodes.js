export const CHAR_TO_CODE= {
    "Backspace":8,
    "Tab":9,
    "Enter":13,
    "Shift":16,
    "Ctrl":17,
    "Alt":18,
    "Pause/Break":19,
    "CapsLock":20,
    "Esc":27,
    "Space":32,
    "PageUp":33,
    "PageDown":34,
    "End":35,
    "Home":36,
    "Left":37,
    "Up":38,
    "Right":39,
    "Down":40,
    "Insert":45,
    "Delete":46,
    "0":48,
    "1":49,
    "2":50,
    "3":51,
    "4":52,
    "5":53,
    "6":54,
    "7":55,
    "8":56,
    "9":57,
    "A":65,
    "B":66,
    "C":67,
    "D":68,
    "E":69,
    "F":70,
    "G":71,
    "H":72,
    "I":73,
    "J":74,
    "K":75,
    "L":76,
    "M":77,
    "N":78,
    "O":79,
    "P":80,
    "Q":81,
    "R":82,
    "S":83,
    "T":84,
    "U":85,
    "V":86,
    "W":87,
    "X":88,
    "Y":89,
    "Z":90,
    "Meta":91, // 윈도우 키
    "RightClick":93,
    "Numpad0":96,
    "Numpad1":97,
    "Numpad2":98,
    "Numpad3":99,
    "Numpad4":100,
    "Numpad5":101,
    "Numpad6":102,
    "Numpad7":103,
    "Numpad8":104,
    "Numpad9":105,
    "Numpad*":106,
    "Numpad+":107,
    "Numpad-":109,
    "Numpad.":110,
    "Numpad/":111,
    "F1":112,
    "F2":113,
    "F3":114,
    "F4":115,
    "F5":116,
    "F6":117,
    "F7":118,
    "F8":119,
    "F9":120,
    "F10":121,
    "F11":122,
    "F12":123,
    "NumLock":144,
    "ScrollLock":145,
    "MyComputer":182,
    "MyCalculator":183,
    ";":186,
    "=":187,
    ",":188,
    "-":189,
    ".":190,
    "/":191,
    "`":192,
    "[":219,
    "\\":220,
    "]":221,
    "'":222
}


const CHAR_TO_CODE_LOWERCASE = {}

for (const key of Object.keys(CHAR_TO_CODE)) {
    CHAR_TO_CODE_LOWERCASE[key.toLowerCase()] = CHAR_TO_CODE[key]
}

const CODE_TO_CHAR_LOWERCASE = {}

for (const key of Object.keys(CHAR_TO_CODE_LOWERCASE)) {
    CODE_TO_CHAR_LOWERCASE[CHAR_TO_CODE_LOWERCASE[key]] = key
}

const COMBINING_KEY_CODES = new Set([17, 18, 16, 91])

export const UNASSIGNED_KEY_CODE = 256
export const MAX_KEY_CODE = UNASSIGNED_KEY_CODE

export class Key {
    constructor(code, ctrl, alt, shift, meta) {
        this.code = code
        this.ctrl = ctrl
        this.alt = alt
        this.shift = shift
        this.meta = meta
    }

    static createEmpty () {
        return new Key(UNASSIGNED_KEY_CODE, false, false, false, false)
    }

    static fromKey (key) {
        return new Key(key.code, key.ctrl, key.alt, key.shift, key.meta)
    }

    static fromString (text) {
        if (!text || text === '') {
            return Key.createEmpty()
        }

        const keys = text.toLowerCase().split(' ')
        if (keys.length === 0) {
            throw Error('키맵이 없음.')
        }

        let code = null
        let ctrl = false
        let alt = false
        let shift = false
        let meta = false

        for (let key of keys) {
            key = key.trim()

            switch (key) {
                case 'ctrl':
                    ctrl = true
                    break
                case 'alt':
                    alt = true
                    break
                case 'shift':
                    shift = true
                    break
                case 'meta':
                    meta = true
                    break
                default:
                    if (code !== null) {
                        throw Error('여러 일반키를 조합할 수 없습니다.')
                    }
                    if (!Object.hasOwnProperty.call(CHAR_TO_CODE_LOWERCASE, key)) {
                        throw Error('알 수 없는 키입니다. : ' + key)
                    }
                    code = CHAR_TO_CODE_LOWERCASE[key]
            }
        }

        // if combining key alone, assign code to UNASSIGNED_KEY_CODE
        if (code === null) {
            code = UNASSIGNED_KEY_CODE
        }

        return new Key(code, ctrl, alt, shift, meta)
    }

    static fromEvent (e) {
        if (COMBINING_KEY_CODES.has(e.keyCode)) {
            return Key._fromCombiningAloneEvent(e)
        }

        return new Key(e.keyCode, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey)
    }

    static _fromCombiningAloneEvent (e) {
        return new Key(UNASSIGNED_KEY_CODE,
            e.keyCode === 17 || e.ctrlKey,
            e.keyCode === 18 || e.altKey,
            e.keyCode === 16 || e.shiftKey,
            e.keyCode === 91 || e.metaKey)
    }

    isEmpty () {
        return this.code === UNASSIGNED_KEY_CODE && !this.ctrl && !this.alt && !this.shift && !this.meta
    }

    /**
     * is code = ctrl, alt, shift, meta?
     */
    isCombiningKey () {
        return this.code === UNASSIGNED_KEY_CODE && !this.isEmpty()
    }

    equals (key) {
        return this.constructor === key.constructor
            && this.code === key.code
            && this.ctrl === key.ctrl
            && this.alt === key.alt
            && this.shift === key.shift
            && this.meta === key.meta
    }

    contains (key) {
        return this.constructor === key.constructor
            && (!key.ctrl || this.ctrl)
            && (!key.alt || this.alt)
            && (!key.shift || this.shift)
            && (!key.meta || this.meta)
            && (key.isCombiningKey() || key.code === this.code)
    }

    countPressingKeys () {
        let cnt = 0
        if (this.code !== UNASSIGNED_KEY_CODE) cnt += 1
        if (this.ctrl) cnt += 1
        if (this.alt) cnt += 1
        if (this.shift) cnt += 1
        if (this.meta) cnt += 1
        return cnt
    }

    /**
     * deprecated
     * @param e
     * @returns {boolean}
     */
    check (e) {
        return this.ctrl === e.ctrlKey
            && this.alt === e.altKey
            && this.shift === e.shiftKey
            && this.meta === e.metaKey
            && this.code === e.keyCode
    }

    asStringArray () {
        if (this.isEmpty()) {
            return []
        }

        const ret = []

        if (this.ctrl) {
            ret.push('ctrl')
        }

        if (this.alt) {
            ret.push('alt')
        }

        if (this.shift) {
            ret.push('shift')
        }

        if (this.meta) {
            ret.push('meta')
        }

        if (this.code !== UNASSIGNED_KEY_CODE) {
            ret.push(CODE_TO_CHAR_LOWERCASE[this.code])
        }

        return ret
    }

    adjustCombiningKey (e) {
        this.ctrl = e.ctrlKey
        this.alt = e.altKey
        this.shift = e.shiftKey
        this.meta = e.metaKey
    }

    add (keyCode) {
        if (COMBINING_KEY_CODES.has(keyCode)) {
            this._setCombiningKey(keyCode, true)
            return
        }

        this.code = keyCode
    }

    remove (keyCode) {
        if (COMBINING_KEY_CODES.has(keyCode)) {
            this._setCombiningKey(keyCode, false)
            return
        }

        if (this.code === keyCode) {
            this.code = UNASSIGNED_KEY_CODE
        }
    }

    _setCombiningKey (keyCode, flag) {
        switch (keyCode) {
            case 17:
                this.ctrl = flag
                break
            case 18:
                this.alt = flag
                break
            case 16:
                this.shift = flag
                break
            case 91:
                this.meta = flag
                break
        }
    }

    capitalize (str) {
        if (str.length === 0) {
            return ''
        }

        else if (str.length === 1) {
            return str.charAt(0).toUpperCase()
        }

        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    asString () {
        return this.asStringArray().join(' ')
    }

    asDisplayString () {
        return this.asStringArray().map(str => this.capitalize(str)).join(' + ')
    }
}
