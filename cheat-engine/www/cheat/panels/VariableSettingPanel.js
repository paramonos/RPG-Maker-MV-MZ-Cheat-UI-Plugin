import {TRANSLATE_SETTINGS, TRANSLATOR, TRANSLATION_BANK} from '../js/TranslateHelper.js'

export default {
    name: 'VariableSettingPanel',

    template: `
<v-card flat class="ma-0 pa-0">
    <v-data-table
        v-if="tableHeaders"
        denses
        :headers="tableHeaders"
        :items="filteredTableItems"
        :search="search"
        :custom-filter="tableItemFilter"
        :items-per-page="5">
        <template v-slot:top>
            <v-text-field
                label="Search..."
                solo
                background-color="grey darken-3"
                v-model="search"
                dense
                hide-details
                @keydown.self.stop
                @focus="$event.target.select()">
            </v-text-field>
            <v-row
                class="ma-0 pa-0">
                <v-col
                    cols="12"
                    md="12">
                    <v-checkbox
                        v-model="excludeNameless"
                        dense
                        hide-details
                        label="Hide Nameless Items">
                    </v-checkbox>

                    <v-chip
                        v-if="isTranslating"
                        small
                        color="orange"
                        text-color="white"
                        class="ml-2">
                        <v-icon small left>mdi-translate</v-icon>
                        Translating... {{Math.round(translationProgress)}}%
                    </v-chip>
                </v-col>
            </v-row>
        </template>
        <template
            v-slot:item.value="{ item }">
            <v-text-field
                background-color="grey darken-3"
                class="d-inline-flex"
                height="10"
                style="width: 60px;"
                hide-details
                solo
                v-model="item.value"
                label="Value"
                dense
                @keydown.self.stop
                @change="onItemChange(item)"
                @focus="$event.target.select()">
            </v-text-field>
        </template>
    </v-data-table>
    
    <v-tooltip
        bottom>
        <span>Reload variables and translations</span>
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                style="top: 0px; right: 0px;"
                color="pink"
                dark
                small
                absolute
                top
                right
                fab
                v-bind="attrs"
                v-on="on"
                @click="manualRefresh">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
        </template>
    </v-tooltip>
</v-card>
    `,

    data () {
        return {
            search: '',
            excludeNameless: false,

            // Store original data separately from display data
            originalVariableNames: [],
            translatedVariableNames: [],
            lastTranslationState: false,
            translationCheckInterval: null,
            isTranslating: false,
            translationProgress: 0,
            progressInterval: null,
            isInitialized: false,

            tableHeaders: [
                {
                    text: 'Name',
                    value: 'displayName'
                },
                {
                    text: 'Value',
                    value: 'value'
                }
            ],
            tableItems: []
        }
    },

    created () {
        this.initializeVariables()

        // Listen for translation setting changes
        this.translationCheckInterval = setInterval(() => {
            this.checkTranslationSettings()
        }, 1000)
    },

    beforeDestroy () {
        if (this.translationCheckInterval) {
            clearInterval(this.translationCheckInterval)
        }
        if (this.progressInterval) {
            clearInterval(this.progressInterval)
        }
    },

    computed: {
        filteredTableItems () {
            return this.tableItems.filter(item => {
                if (this.excludeNameless && !item.name) {
                    return false
                }

                return true
            })
        }
    },

    methods: {
        async initializeVariables () {
            // Prevent re-initialization if already loaded and not a manual refresh
            if (this.isInitialized && this.tableItems.length > 0) {
                console.log('Variables already initialized, skipping...')
                return
            }

            try {
                console.log('Initializing variables...')

                // STEP 1: Always load original variables first
                this.originalVariableNames = $dataSystem.variables.slice()

                if (!this.originalVariableNames || this.originalVariableNames.length === 0) {
                    console.warn('No variables found in game data')
                    this.tableItems = []
                    return
                }

                // STEP 2: Create table items with original names initially
                this.tableItems = this.originalVariableNames.map((varName, idx) => {
                    return {
                        id: idx,
                        originalName: varName || `Variable ${idx}`,
                        displayName: varName || `Variable ${idx}`,
                        value: $gameVariables.value(idx)
                    }
                }).filter(item => item.id > 0) // Skip index 0 which is usually null

                console.log(`Loaded ${this.tableItems.length} variables with original names`)
                this.isInitialized = true

                // STEP 3: Apply translation if enabled
                await this.updateDisplayNames()

            } catch (error) {
                console.error('Error initializing variables:', error)
                // Fallback: create basic table with original names
                this.createFallbackTable()
            }
        },

        async updateDisplayNames () {
            if (!this.tableItems || this.tableItems.length === 0) {
                console.warn('No table items to update')
                return
            }

            // Clear any existing progress interval
            if (this.progressInterval) {
                clearInterval(this.progressInterval)
                this.progressInterval = null
            }

            try {
                if (TRANSLATE_SETTINGS.isVariableTranslateEnabled() && !this.isTranslating) {
                    console.log('Translation enabled, updating display names...')
                    this.isTranslating = true
                    this.translationProgress = 0

                    // Get only the original names for translation
                    const originalNames = this.tableItems.map(item => item.originalName)

                    // Check if using JP→KR endpoint
                    const endPointData = TRANSLATE_SETTINGS.getEndPointData()
                    const isJpToKr = endPointData.id === 'ezTransWeb' || endPointData.id === 'ezTransServer'

                    if (isJpToKr) {
                        console.log('Using original translation method for JP→KR endpoint')
                        await this.translateWithOriginalMethod(originalNames)
                        return
                    }

                    // For other endpoints, use the new cached/batch method
                    const cacheResults = this.applyCachedTranslations(originalNames)
                    const needsTranslation = cacheResults.uncachedIndices.length

                    console.log(`Translation: ${cacheResults.cacheHits} cached, ${needsTranslation} new`)

                    // If everything is cached, we're done
                    if (needsTranslation === 0) {
                        console.log('All translations from cache - no API calls needed!')
                        this.translationProgress = 100
                        setTimeout(() => {
                            this.isTranslating = false
                            this.translationProgress = 0
                        }, 300)
                        return
                    }

                    // Show progress during translation
                    this.progressInterval = setInterval(() => {
                        if (this.translationProgress < 90) {
                            this.translationProgress = Math.min(this.translationProgress + 10, 90)
                        }
                    }, 200)

                    try {
                        // Translate only uncached names with instant updates
                        await this.translateNamesInstantly(originalNames)

                        this.translationProgress = 100
                        console.log('All display names updated (cached + new translations)')
                    } finally {
                        // Clean up progress
                        if (this.progressInterval) {
                            clearInterval(this.progressInterval)
                            this.progressInterval = null
                        }

                        setTimeout(() => {
                            this.isTranslating = false
                            this.translationProgress = 0
                        }, 500)
                    }
                } else {
                    // Use original names for display
                    this.tableItems.forEach(item => {
                        item.displayName = item.originalName
                    })
                    console.log('Display names reset to original')
                }
            } catch (error) {
                console.error('Error updating display names:', error)

                // Clean up on error
                if (this.progressInterval) {
                    clearInterval(this.progressInterval)
                    this.progressInterval = null
                }

                // Fallback to original names
                this.tableItems.forEach(item => {
                    item.displayName = item.originalName
                })

                this.isTranslating = false
                this.translationProgress = 0
            }
        },

        async translateWithOriginalMethod (originalNames) {
            console.log('🔄 Using original translation method for JP→KR')

            // Show progress during translation
            this.progressInterval = setInterval(() => {
                if (this.translationProgress < 90) {
                    this.translationProgress = Math.min(this.translationProgress + 10, 90)
                }
            }, 200)

            try {
                // Use the original bulk translation method
                const translatedNames = await TRANSLATOR.translateBulk(originalNames)

                // Update display names with translated results
                this.tableItems.forEach((item, index) => {
                    if (translatedNames[index]) {
                        item.displayName = translatedNames[index]
                    }
                })

                this.translationProgress = 100
                console.log('✅ Original method translation completed')

            } finally {
                // Clean up progress
                if (this.progressInterval) {
                    clearInterval(this.progressInterval)
                    this.progressInterval = null
                }

                setTimeout(() => {
                    this.isTranslating = false
                    this.translationProgress = 0
                }, 500)
            }
        },

        applyCachedTranslations (originalNames) {
            let cacheHits = 0
            const uncachedIndices = []

            // Apply cached translations immediately
            originalNames.forEach((name, index) => {
                if (name && name.trim()) {
                    const cached = TRANSLATION_BANK.get(name)
                    if (cached) {
                        // Apply cached translation instantly
                        if (this.tableItems[index]) {
                            this.tableItems[index].displayName = cached.translated
                            console.log(`🏦 Cache hit: "${name}" → "${cached.translated}"`)
                            cacheHits++
                        }
                    } else {
                        // Mark for translation
                        uncachedIndices.push(index)
                    }
                }
            })

            return { cacheHits, uncachedIndices }
        },

        async translateNamesInstantly (originalNames) {
            // Get only the names that need translation (not cached)
            const cacheResults = this.applyCachedTranslations(originalNames)
            const uncachedIndices = cacheResults.uncachedIndices

            if (uncachedIndices.length === 0) {
                console.log('All translations were cached!')
                return
            }

            console.log(`Translating ${uncachedIndices.length} uncached items...`)

            const chunkSize = TRANSLATE_SETTINGS.getBulkTranslateChunkSize()
            let completed = 0

            // Process uncached items in chunks
            for (let i = 0; i < uncachedIndices.length; i += chunkSize) {
                const chunkIndices = uncachedIndices.slice(i, Math.min(uncachedIndices.length, i + chunkSize))
                const chunk = chunkIndices.map(index => originalNames[index])

                // Translate chunk with instant updates
                await this.translateChunkInstantly(chunk, chunkIndices)

                completed += chunk.length
                this.translationProgress = Math.min((completed / uncachedIndices.length) * 90, 90)
            }
        },

        async translateChunkInstantly (chunk, indices) {
            const epData = TRANSLATE_SETTINGS.getEndPointData()

            if (epData.isLingva) {
                // For Lingva, translate each item individually with instant updates
                const translationPromises = chunk.map(async (text, chunkIndex) => {
                    const globalIndex = indices[chunkIndex]

                    if (text && text.trim()) {
                        // Check cache one more time before API call
                        const cached = TRANSLATION_BANK.get(text)
                        if (cached) {
                            console.log(`🏦 Last-minute cache hit: "${text}" → "${cached.translated}"`)
                            if (this.tableItems[globalIndex]) {
                                this.tableItems[globalIndex].displayName = cached.translated
                            }
                            return cached.translated
                        }

                        // Small staggered delay to avoid overwhelming the API
                        await new Promise(resolve => setTimeout(resolve, chunkIndex * 50))

                        try {
                            const translated = await TRANSLATOR.translate(text)

                            // Update display name instantly when translation completes
                            if (this.tableItems[globalIndex] && translated !== text) {
                                this.tableItems[globalIndex].displayName = translated
                                console.log(`✅ API translated: "${text}" → "${translated}"`)
                            }

                            return translated
                        } catch (error) {
                            console.warn(`Failed to translate "${text}":`, error)
                            return text
                        }
                    } else {
                        return text || ''
                    }
                })

                await Promise.all(translationPromises)
            } else {
                // For other services, use bulk translation
                try {
                    const translatedChunk = await TRANSLATOR.__translateBulk(chunk)

                    // Update all items in chunk at once
                    translatedChunk.forEach((translated, chunkIndex) => {
                        const globalIndex = indices[chunkIndex]
                        if (this.tableItems[globalIndex] && translated) {
                            this.tableItems[globalIndex].displayName = translated
                        }
                    })
                } catch (error) {
                    console.error('Bulk translation failed:', error)
                }
            }
        },

        createFallbackTable () {
            console.log('Creating fallback table...')
            try {
                const variables = $dataSystem.variables || []
                this.tableItems = variables.map((varName, idx) => {
                    return {
                        id: idx,
                        originalName: varName || `Variable ${idx}`,
                        displayName: varName || `Variable ${idx}`,
                        value: $gameVariables.value(idx)
                    }
                }).filter(item => item.id > 0)

                console.log(`Fallback table created with ${this.tableItems.length} items`)
            } catch (error) {
                console.error('Error creating fallback table:', error)
                this.tableItems = []
            }
        },

        onItemChange (item) {
            // modify value
            $gameVariables.setValue(item.id, item.value)

            // refresh
            item.value = $gameVariables.value(item.id)
        },

        async checkTranslationSettings () {
            const currentTranslationState = TRANSLATE_SETTINGS.isVariableTranslateEnabled()

            if (currentTranslationState !== this.lastTranslationState && !this.isTranslating) {
                console.log('Translation setting changed, updating display names...')
                this.lastTranslationState = currentTranslationState

                // Only update display names, don't reload everything
                await this.updateDisplayNames()
            }
        },

        async manualRefresh () {
            console.log('🔄 Manual refresh triggered - reloading variables and translations')

            // Clear any ongoing translation
            if (this.progressInterval) {
                clearInterval(this.progressInterval)
                this.progressInterval = null
            }
            this.isTranslating = false
            this.translationProgress = 0

            // Reset state
            this.lastTranslationState = TRANSLATE_SETTINGS.isVariableTranslateEnabled()
            this.isInitialized = false
            this.tableItems = []

            // Full reload from game data with fresh translations
            await this.initializeVariables()

            console.log('✅ Manual refresh completed')
        },

        tableItemFilter (value, search, item) {
            if (search === null || search.trim() === '') {
                return true
            }

            search = search.toLowerCase()

            return item.name.toLowerCase().contains(search) || String(item.value).toLowerCase().contains(search)
        }
    }
}
