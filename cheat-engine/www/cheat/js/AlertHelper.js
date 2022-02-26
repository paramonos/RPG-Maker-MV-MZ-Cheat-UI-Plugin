export class Alert {
    static alertInternal (level, msg, err = null) {
        if (err) {
            alert(`[cheat plugin ${level}] ${msg}\n\n[cause] ${err}`)
        } else {
            alert(`[cheat plugin ${level}] ${msg}`)
        }
    }

    static success (msg, err = null) {
        this.alertInternal('success', msg, err)
    }

    static info (msg, err = null) {
        this.alertInternal('info', msg, err)
    }

    static warn (msg, err = null) {
        this.alertInternal('warn', msg, err)
    }

    static error (msg, err = null) {
        this.alertInternal('error', msg, err)
    }
}
