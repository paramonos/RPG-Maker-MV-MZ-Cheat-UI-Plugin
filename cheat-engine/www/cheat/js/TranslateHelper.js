import {KeyValueStorage} from './KeyValueStorage.js'

// Translation Bank for caching translations
class TranslationBank {
    constructor() {
        this.storage = new KeyValueStorage('./www/cheat-settings/translation-bank.json')
        this.cache = this.loadCache()
    }

    loadCache() {
        try {
            const data = this.storage.getItem('translations')
            return data ? JSON.parse(data) : {}
        } catch (error) {
            console.warn('Failed to load translation cache:', error)
            return {}
        }
    }

    saveCache() {
        try {
            this.storage.setItem('translations', JSON.stringify(this.cache))
            console.log(`Translation bank saved with ${Object.keys(this.cache).length} entries`)
        } catch (error) {
            console.error('Failed to save translation cache:', error)
        }
    }

    // Get cached translation
    get(originalText) {
        if (!originalText || typeof originalText !== 'string') return null
        const key = this.createKey(originalText)
        return this.cache[key] || null
    }

    // Store successful translation
    set(originalText, translatedText) {
        if (!originalText || !translatedText || typeof originalText !== 'string') return
        if (originalText === translatedText) return // Don't cache unchanged text

        const key = this.createKey(originalText)
        this.cache[key] = {
            original: originalText,
            translated: translatedText,
            timestamp: Date.now(),
            source: 'lingva'
        }
        this.saveCache()
    }

    // Create consistent cache key
    createKey(text) {
        return text.trim().toLowerCase()
    }

    // Get cache statistics
    getStats() {
        const entries = Object.values(this.cache)
        return {
            totalEntries: entries.length,
            oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null,
            newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : null
        }
    }

    // Clear old entries (optional maintenance)
    clearOldEntries(maxAge = 30 * 24 * 60 * 60 * 1000) { // 30 days default
        const cutoff = Date.now() - maxAge
        const oldSize = Object.keys(this.cache).length

        Object.keys(this.cache).forEach(key => {
            if (this.cache[key].timestamp < cutoff) {
                delete this.cache[key]
            }
        })

        const newSize = Object.keys(this.cache).length
        if (oldSize !== newSize) {
            this.saveCache()
            console.log(`Cleaned translation bank: ${oldSize} → ${newSize} entries`)
        }
    }

    // Export/import for backup
    export() {
        return JSON.stringify(this.cache, null, 2)
    }

    import(jsonData) {
        try {
            const imported = JSON.parse(jsonData)
            this.cache = { ...this.cache, ...imported }
            this.saveCache()
            return true
        } catch (error) {
            console.error('Failed to import translation data:', error)
            return false
        }
    }
}

// Global translation bank instance
export const TRANSLATION_BANK = new TranslationBank()

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
    },

    lingva: {
        id: 'lingva',
        name: 'Lingva Translate (Auto-detect → EN)',
        helpUrl: 'https://github.com/thedaviddelta/lingva-translate',
        data: {
            method: 'get',
            urlPattern: `https://lingva.ml/api/v1/auto/en/${END_POINT_URL_PATTERN_TEXT_SYMBOL}`,
            isLingva: true
        }
    }
}

export const RECOMMEND_CHUNK_SIZE = {
    ezTransWeb: 500,
    ezTransServer: 100,
    lingva: 10
}

// Maximum safe chunk sizes for different services
export const MAX_CHUNK_SIZE = {
    ezTransWeb: 1000,
    ezTransServer: 500,
    lingva: 20  // Lingva has stricter limits
}

// Optimal parallel request limits
export const MAX_PARALLEL_REQUESTS = {
    ezTransWeb: 50,
    ezTransServer: 20,
    lingva: 5   // Conservative for public API
}

// Batch translation settings
export const BATCH_TRANSLATION = {
    // Delimiter to separate multiple texts in one request
    delimiter: ' ⟨SEP⟩ ',

    // Maximum characters per batch request
    maxBatchLength: {
        lingva: 1500,      // Conservative for URL length
        // Note: ezTrans services use original method, not batch
    },

    // Maximum items per batch
    maxBatchItems: {
        lingva: 50,        // Can fit many short variable names
        // Note: ezTrans services use original method, not batch
    },

    // Services that should NOT use batch translation
    excludeFromBatch: ['ezTransWeb', 'ezTransServer']
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

        // For Lingva API, try multiple endpoints with fallbacks
        if (epData.isLingva) {
            return await this.__translateLingva(text)
        }

        // For other APIs, use the original logic
        let encodedText = encodeURI(text)
        const realUrl = epData.urlPattern.replace(END_POINT_URL_PATTERN_TEXT_SYMBOL, encodedText)

        let response
        try {
            if (epData.method === 'get') {
                response = (await axios.get(realUrl)).data
            } else if (epData.method === 'post') {
                const body = epData.body ? epData.body : ''
                response = (await axios.post(realUrl, body.replace(END_POINT_URL_PATTERN_TEXT_SYMBOL, text))).data
            } else {
                return text
            }
        } catch (error) {
            console.warn('Translation request failed:', error.message)
            return text
        }

        return response || text
    }

    async __translateLingva (text) {
        // Use only the fastest, most reliable endpoint first
        const primaryEndpoint = `https://lingva.ml/api/v1/auto/en/${encodeURIComponent(text)}`

        try {
            const response = await axios.get(primaryEndpoint, {
                timeout: 3000, // Reduced timeout for speed
                headers: {
                    'Accept': 'application/json'
                }
            })

            if (response.data && response.data.translation && response.data.translation !== text) {
                return response.data.translation
            }
        } catch (error) {
            // Quick fallback to plausibility cloud
            try {
                const fallbackEndpoint = `https://translate.plausibility.cloud/api/v1/auto/en/${encodeURIComponent(text)}`
                const response = await axios.get(fallbackEndpoint, {
                    timeout: 3000,
                    headers: { 'Accept': 'application/json' }
                })

                if (response.data && response.data.translation && response.data.translation !== text) {
                    return response.data.translation
                }
            } catch (fallbackError) {
                // If both fail, return original quickly
            }
        }

        return text
    }

    async __translateBulk (texts) {
        return (await this.translate(texts.join('\n'))).split('\n')
    }

    async translate (text) {
        try {
            // Check translation bank first
            const cached = TRANSLATION_BANK.get(text)
            if (cached) {
                console.log(`Cache hit: "${text}" → "${cached.translated}"`)
                return cached.translated
            }

            // If not in cache, translate and store
            const translated = await this.__translate(text)

            // Store successful translation in bank
            if (translated && translated !== text) {
                TRANSLATION_BANK.set(text, translated)
                console.log(`Cached: "${text}" → "${translated}"`)
            }

            return translated
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

    getAdaptiveChunkSize(requestedSize, endPointId) {
        const maxSafe = MAX_CHUNK_SIZE[endPointId] || 50
        const maxParallel = MAX_PARALLEL_REQUESTS[endPointId] || 10

        if (requestedSize <= maxSafe) {
            return requestedSize
        }

        console.warn(`Chunk size ${requestedSize} too large for ${endPointId}. Using safe limit: ${maxSafe}`)
        return maxSafe
    }

    async translateBulk (texts) {
        // Handle empty or invalid input
        if (!texts || !Array.isArray(texts) || texts.length === 0) {
            console.warn('translateBulk: Invalid or empty texts array')
            return []
        }

        // Clean up texts and preserve original indices
        const cleanedTexts = texts.map(text => text ? text.replace('\n', '') : text)

        const epData = this.settings.getEndPointData()
        const requestedChunkSize = this.settings.getBulkTranslateChunkSize()

        // Check if this is a JP→KR endpoint (ezTrans services)
        const isJpToKr = epData.id === 'ezTransWeb' || epData.id === 'ezTransServer'

        if (isJpToKr) {
            console.log(`Using original translation method for JP→KR endpoint: ${epData.id}`)
            return await this.translateBulkOriginal(cleanedTexts)
        }

        // For other endpoints, use the new batch system
        const safeChunkSize = this.getAdaptiveChunkSize(requestedChunkSize, epData.id || 'unknown')
        console.log(`Requested chunk size: ${requestedChunkSize}, Using safe size: ${safeChunkSize}`)

        // Check cache statistics
        const cacheHits = cleanedTexts.filter(text => TRANSLATION_BANK.get(text)).length
        console.log(`Translating ${cleanedTexts.length} texts (${cacheHits} cached, ${cleanedTexts.length - cacheHits} new)`)

        const textsChunk = []

        for (let i = 0; i < cleanedTexts.length; i += safeChunkSize) {
            const chunk = cleanedTexts.slice(i, Math.min(cleanedTexts.length, i + safeChunkSize))

            // For Lingva API, use controlled parallel translation
            if (epData.isLingva) {
                const translatedChunk = await this.translateLingvaChunk(chunk)
                textsChunk.push(translatedChunk)
            } else {
                // Use bulk translation for other services
                textsChunk.push(await this.__translateBulk(chunk))
            }
        }

        const result = [].concat(...textsChunk)
        console.log(`Translation completed. Input: ${texts.length}, Output: ${result.length}`)
        return result
    }

    async translateBulkOriginal (texts) {
        console.log(`🔄 Using original translation method for ${texts.length} texts`)

        // Use the original repository's bulk translation logic
        const chunkSize = this.settings.getBulkTranslateChunkSize()
        const textsChunk = []

        for (let i = 0; i < texts.length; i += chunkSize) {
            const chunk = texts.slice(i, Math.min(texts.length, i + chunkSize))
            console.log(`Processing chunk ${Math.floor(i / chunkSize) + 1}: ${chunk.length} items`)

            // Use the original __translateBulk method
            textsChunk.push(await this.__translateBulk(chunk))
        }

        const result = [].concat(...textsChunk)
        console.log(`✅ Original translation completed. Input: ${texts.length}, Output: ${result.length}`)
        return result
    }

    createBatches(texts, endPointId) {
        const config = BATCH_TRANSLATION
        const maxLength = config.maxBatchLength[endPointId] || 1000
        const maxItems = config.maxBatchItems[endPointId] || 20
        const delimiter = config.delimiter

        const batches = []
        let currentBatch = []
        let currentLength = 0

        for (const text of texts) {
            if (!text || !text.trim()) {
                currentBatch.push('')
                continue
            }

            const textLength = text.length + delimiter.length

            // Check if adding this text would exceed limits
            if (currentBatch.length > 0 &&
                (currentLength + textLength > maxLength || currentBatch.length >= maxItems)) {

                // Start new batch
                batches.push(currentBatch)
                currentBatch = [text]
                currentLength = text.length
            } else {
                // Add to current batch
                currentBatch.push(text)
                currentLength += textLength
            }
        }

        // Add final batch if not empty
        if (currentBatch.length > 0) {
            batches.push(currentBatch)
        }

        return batches
    }

    async translateBatch(batch) {
        const delimiter = BATCH_TRANSLATION.delimiter

        // Filter out empty texts but remember their positions
        const textMap = []
        const nonEmptyTexts = []

        batch.forEach((text, index) => {
            if (text && text.trim()) {
                textMap.push({ originalIndex: index, batchIndex: nonEmptyTexts.length })
                nonEmptyTexts.push(text)
            } else {
                textMap.push({ originalIndex: index, batchIndex: -1 })
            }
        })

        if (nonEmptyTexts.length === 0) {
            return batch // All empty, return as-is
        }

        // Combine texts with delimiter
        const combinedText = nonEmptyTexts.join(delimiter)
        console.log(`🔗 Batch translation: ${nonEmptyTexts.length} items in one request`)
        console.log(`📏 Combined length: ${combinedText.length} characters`)

        try {
            // Translate the combined text
            const translatedCombined = await this.translate(combinedText)

            // Split the result back
            const translatedParts = translatedCombined.split(delimiter)

            // Reconstruct the original array with translations
            const results = new Array(batch.length)
            textMap.forEach(mapping => {
                if (mapping.batchIndex >= 0 && mapping.batchIndex < translatedParts.length) {
                    results[mapping.originalIndex] = translatedParts[mapping.batchIndex].trim()
                } else {
                    results[mapping.originalIndex] = batch[mapping.originalIndex] || ''
                }
            })

            console.log(`✅ Batch translation successful: ${nonEmptyTexts.length} → ${translatedParts.length}`)
            return results

        } catch (error) {
            console.warn('Batch translation failed, falling back to individual translation:', error)

            // Fallback: translate individually
            const results = new Array(batch.length)
            for (let i = 0; i < batch.length; i++) {
                if (batch[i] && batch[i].trim()) {
                    try {
                        results[i] = await this.translate(batch[i])
                        await new Promise(resolve => setTimeout(resolve, 100)) // Small delay
                    } catch (individualError) {
                        results[i] = batch[i] // Keep original on failure
                    }
                } else {
                    results[i] = batch[i] || ''
                }
            }
            return results
        }
    }

    async translateLingvaChunk(chunk) {
        const endPointId = 'lingva'

        // Use batch translation for efficiency
        const batches = this.createBatches(chunk, endPointId)
        console.log(`📦 Created ${batches.length} batches from ${chunk.length} items`)

        const allResults = []

        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i]
            console.log(`🔄 Processing batch ${i + 1}/${batches.length} (${batch.length} items)`)

            const batchResults = await this.translateBatch(batch)
            allResults.push(...batchResults)

            // Delay between batches to be respectful
            if (i < batches.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 300))
            }
        }

        return allResults
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

                endPointSelection: 'lingva',

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

                bulkTranslateChunkSize: 10
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

// Initialize translation bank cleanup on load
setTimeout(() => {
    TRANSLATION_BANK.clearOldEntries()
}, 1000)
