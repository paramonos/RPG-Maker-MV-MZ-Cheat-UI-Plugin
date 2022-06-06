import {KeyValueStorage} from './KeyValueStorage.js'

export const END_POINT_URL_PATTERN_TEXT_SYMBOL = '${TEXT}'

export const DEFAULT_END_POINTS = {
    ezTransWeb: {
        id: 'ezTransWeb',
        name: 'ezTransWeb (JP → KR)',
        helpUrl: 'https://github.com/HelloKS/ezTransWeb',
        data: {
            method: 'get',
            urlPattern: `http://localhost:5000/translate?text=${END_POINT_URL_PATTERN_TEXT_SYMBOL}`
        }
    },

    ezTransServer: {
        id: 'ezTransServer',
        name: 'eztrans-server (JP → KR)',
        helpUrl: 'https://github.com/nanikit/eztrans-server',
        data: {
            method: 'post',
            urlPattern: `http://localhost:8000`,
            body: END_POINT_URL_PATTERN_TEXT_SYMBOL
        }
    }
}

export const RECOMMEND_CHUNK_SIZE = {
    ezTransWeb: 500,
    ezTransServer: 100
}


class Translator {
    constructor (settings) {
        this.settings = settings
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
        const epData = this.settings.getEndPointData()

        const realUrl = epData.urlPattern.replace(END_POINT_URL_PATTERN_TEXT_SYMBOL, encodeURI(text))

        if (epData.method === 'get') {
            return (await axios.get(realUrl)).data
        } else if (epData.method === 'post') {
            const body = epData.body ? epData.body : ''
            return (await axios.post(realUrl, body.replace(END_POINT_URL_PATTERN_TEXT_SYMBOL, text))).data
        }

        return text
    }

    async __translateBulk (texts) {
        return (await this.translate(texts.join('\n'))).split('\n')
    }

    async translate (text) {
        try {
            return (await this.__translate(text))
        } catch (err) {
            return text
        }
    }

    // async translateBulk (texts) {
    //     texts = texts.map(text => text.replace('\n', ''))
    //
    //     const chunkSize = 100
    //     const textsChunk = []
    //
    //     for (let i = 0; i < texts.length; i += chunkSize) {
    //         textsChunk.push(texts.slice(i, Math.min(texts.length, i + chunkSize)))
    //     }
    //
    //     const ret = [].concat(...await Promise.all(textsChunk.map(chunk => this.__translateBulk(chunk))))
    //     return ret
    // }

    async translateBulk (texts) {
        texts = texts.map(text => text.replace('\n', ''))

        const chunkSize = this.settings.getBulkTranslateChunkSize()
        const textsChunk = []

        for (let i = 0; i < texts.length; i += chunkSize) {
            textsChunk.push(await this.__translateBulk(texts.slice(i, Math.min(texts.length, i + chunkSize))))
        }

        return [].concat(...textsChunk)
    }
}


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

                endPointSelection: 'ezTransWeb',

                customEndPointData: {
                    method: 'get',
                    urlPattern: `http://localhost:5000/translate?text=${END_POINT_URL_PATTERN_TEXT_SYMBOL}`,
                    body: ''
                },

                targets: {
                    items: false,
                    variables: true,
                    switches: true,
                    maps: true,
                },

                bulkTranslateChunkSize: 500
            }
            return
        }

        this.data = JSON.parse(json)
    }

    __writeSettings () {
        this.kvStorage.setItem('data', JSON.stringify(this.data))
    }

    getEndPointData () {
        if (this.getEndPointSelection() === 'custom') {
            return this.getCustomEndPointData()
        }

        return DEFAULT_END_POINTS[this.getEndPointSelection()].data
    }

    setEnabled (flag) {
        this.data.enabled = flag
        this.__writeSettings()
    }

    isEnabled () {
        return this.data.enabled
    }


    getEndPointSelection () {
        return this.data.endPointSelection
    }

    setEndPointSelection (endPointId) {
        this.data.endPointSelection = endPointId
        this.__writeSettings()
    }

    getCustomEndPointData () {
        return this.data.customEndPointData
    }

    setCustomEndPointMethod (method) {
        this.data.customEndPointData.method = method
        this.__writeSettings()
    }

    setCustomEndPointUrlPattern (urlPattern) {
        this.data.customEndPointData.urlPattern = urlPattern
        this.__writeSettings()
    }

    setCustomEndPointBody (body) {
        this.data.customEndPointData.body = body
        this.__writeSettings()
    }

    getBulkTranslateChunkSize() {
        return this.data.bulkTranslateChunkSize
    }

    setBulkTranslateChunkSize (chunkSize) {
        this.data.bulkTranslateChunkSize = chunkSize
        this.__writeSettings()
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
export const TRANSLATOR = new Translator(TRANSLATE_SETTINGS)
