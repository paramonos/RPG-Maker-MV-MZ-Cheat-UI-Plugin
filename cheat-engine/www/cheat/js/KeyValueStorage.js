export class KeyValueStorage {
    constructor (filePath) {
        if (Utils.isNwjs()) {
            this.filePath = filePath
            this.fileEncoding = 'utf-8'
            this.fileSystem = require('fs')
        }
    }

    getItem (key) {
        if (!Utils.isNwjs()) {
            return localStorage.getItem(key)
        }

        return this.__getItemFromFile(key)
    }

    setItem (key, value) {
        if (!Utils.isNwjs()) {
            localStorage.setItem(key, value)
            return
        }

        this.__setItemToFile(key, value)
    }

    __readFile () {
        if (!this.fileSystem.existsSync(this.filePath)) {
            return {}
        }

        return JSON.parse(this.fileSystem.readFileSync(this.filePath, this.fileEncoding))
    }

    __getItemFromFile (key) {
        return this.__readFile()[key]
    }

    __setItemToFile (key, value) {
        const data = this.__readFile()

        data[key] = value

        this.fileSystem.writeFileSync(this.filePath, JSON.stringify(data))
    }
}

export const KEY_VALUE_STORAGE = new KeyValueStorage('./www/cheat-settings/kv-storage.json')
