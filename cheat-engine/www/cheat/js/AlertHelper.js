export class Alert {
    static alertInternal (level, msg, err = null, timeout = 1500) {
        if (err) {
            alert(`[cheat plugin ${level}] ${msg}\n\n[cause] ${err}`)
        } else {
            alert(`[cheat plugin ${level}] ${msg}`)
        }
    }

    static success (msg, err = null, timeout = 1500) {
        this.alertInternal('success', msg, err, timeout)
    }

    static info (msg, err = null, timeout = 1500) {
        this.alertInternal('info', msg, err, timeout)
    }

    static warn (msg, err = null, timeout = 1500) {
        this.alertInternal('warn', msg, err, timeout)
    }

    static error (msg, err = null, timeout = 1500) {
        this.alertInternal('error', msg, err, timeout)
    }
}
