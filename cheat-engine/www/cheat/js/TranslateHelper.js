import {KeyValueStorage} from './KeyValueStorage.js'

class Translator {
    constructor () {
        this.url = 'http://localhost:5000/translate'
    }

    async isAvailable () {
        try {
            await this.__translate('test')
            return true
        } catch (e) {
            return false
        }

    }

    async __translate (text) {
        return axios.get(this.url, {
            params: {
                text: text
            }
        })
    }

    async translate (text) {
        try {
            return (await this.__translate(text)).data
        } catch (err) {
            return text
        }
    }

    async translateBulk (texts) {
        texts = texts.map(text => text.replace('\n', ''))
        return (await this.translate(texts.join('\n'))).split('\n')
    }
}

export const TRANSLATOR = new Translator()


class TranslateSettings {
    constructor () {
        this.kvStorage = new KeyValueStorage('./www/cheat-settings/translate.json')
        this.__readSettings()
    }

    __readSettings () {
        const json = this.kvStorage.getItem('data')

        if (!json) {
            this.data = {
                enabled: false,
                targets: {
                    items: false,
                    variables: true,
                    switches: true,
                    maps: true,
                }
            }
            return
        }

        this.data = JSON.parse(json)
    }

    __writeSettings () {
        this.kvStorage.setItem('data', JSON.stringify(this.data))
    }

    setEnabled (flag) {
        this.data.enabled = flag
        this.__writeSettings()
    }

    isEnabled () {
        return this.data.enabled
    }

    getTargets () {
        return this.data.targets
    }

    setTargets (targets) {
        this.data.targets = targets
        this.__writeSettings()
    }

    isItemTranslateEnabled () {
        return this.isEnabled() && this.getTargets().items
    }

    isVariableTranslateEnabled () {
        return this.isEnabled() && this.getTargets().variables
    }

    isSwitchTranslateEnabled () {
        return this.isEnabled() && this.getTargets().switches
    }

    isMapTranslateEnabled () {
        return this.isEnabled() && this.getTargets().maps
    }
}

export const TRANSLATE_SETTINGS = new TranslateSettings()
