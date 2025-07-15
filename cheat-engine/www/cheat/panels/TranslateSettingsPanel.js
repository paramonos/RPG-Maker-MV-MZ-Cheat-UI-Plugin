import {TRANSLATE_SETTINGS, DEFAULT_END_POINTS, RECOMMEND_CHUNK_SIZE, MAX_CHUNK_SIZE, TRANSLATION_BANK} from '../js/TranslateHelper.js'
import {TRANSLATOR} from '../js/TranslateHelper.js'
import {isInValueInRange} from '../js/GlobalShortcut.js';
import {Alert} from '../js/AlertHelper.js'

export default {
    name: 'TranslateSettingsPanel',

    template: `
<v-card flat class="ma-0 pa-0">
    <v-card-subtitle class="pb-0 font-weight-bold">Usage</v-card-subtitle>
    <v-card-text class="pb-0">
        <span
            v-if="selectedDefaultEndPoint">
            <a 
                v-if="selectedDefaultEndPoint.helpUrl" 
                :href="selectedDefaultEndPoint.helpUrl" 
                target="_blank">
                {{selectedDefaultEndPoint.name}}
            </a>
            <span v-else>{{selectedDefaultEndPoint.name}}</span>
            must be running before translation.
        </span>
        <span
            v-if="isCustomEndPoint">
            Custom translation server must be running before translation.
        </span>
    </v-card-text>
    <v-card-text class="py-0" :class="translatorStatusColor + '--text'">
        {{translatorStatusMessage}}
    </v-card-text>
    <v-card-subtitle class="pb-0 mt-4 font-weight-bold">Translate</v-card-subtitle>
    <v-card-text class="py-0">
        <v-switch
            v-model="enabled"
            label="Enable"
            dense
            hide-details
            @click.self.stop
            @change="onChangeEnabled">
        </v-switch>
    </v-card-text>
    
    <v-card-subtitle class="pb-0 mt-4 font-weight-bold">End Point</v-card-subtitle>
    <v-card-text class="py-0">
        <v-radio-group 
            hide-details
            v-model="endPointSelection" 
            @change="onChangeEndPoint"
            :disabled="!enabled">
            <v-radio
                v-for="item in endPointList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </v-radio>
        </v-radio-group>
    </v-card-text>
    
    <v-card-text 
        class="py-0 mt-1 mb-0" 
        v-if="selectedDefaultEndPoint && selectedDefaultEndPoint.helpUrl">
        <a :href="selectedDefaultEndPoint.helpUrl" target="_blank">How to set up "{{selectedDefaultEndPoint.name}}"</a>
    </v-card-text>
    
    <v-card-text 
        class="py-0 mt-4 mb-0"
        v-if="isCustomEndPoint">
        <v-row>
            <v-col
                cols="12"
                md="3">
                <v-select
                    v-model="customEndPointData.method"
                    dense
                    hide-details
                    :items="restApiMethods"
                    item-value="value"
                    item-text="name"
                    background-color="grey darken-3"
                    label="Method"
                    solo
                    :disabled="!enabled"
                    @change="onChangeCustomEndPointMethod">
                    <template v-slot:selection="{ item }">
                        <span class="body-2">{{item.name}}</span>
                    </template>
                </v-select>
            </v-col>
            <v-col
                cols="12"
                md="9">
                <v-text-field
                    class="body-2"
                    v-model="customEndPointData.urlPattern"
                    dense
                    hide-details
                    label="URL Pattern"
                    background-color="grey darken-3"
                    solo
                    :disabled="!enabled"
                    @keydown.self.stop
                    @change="onChangeCustomEndPointUrlPattern">
                </v-text-field>
            </v-col>
        </v-row>
        
        <v-textarea
            class="mt-2"
            v-model="customEndPointData.body"
            solo
            dense
            hide-details
            row-height="1"
            auto-grow
            background-color="grey darken-3"
            label="Body"
            :disabled="!enabled"
            @keydown.self.stop
            @change="onChangeCustomEndPointBody">
        </v-textarea>
    </v-card-text>
    
    
    <v-card-subtitle class="pb-0 mt-4 font-weight-bold">Bulk translate</v-card-subtitle>
    <v-card-text class="py-0 mt-1">
        <v-text-field
            class="body-2"
            v-model="bulkTranslateChunkSize"
            dense
            hide-details
            label="Chunk size"
            background-color="grey darken-3"
            solo
            :disabled="!enabled"
            @keydown.self.stop
            @change="onChnageBulkTranslateChunkSize">
        </v-text-field>
        <span class="caption grey--text">Number of items to combine into single API requests using delimiters.</span><br/>
        <span class="caption grey--text">Higher values = fewer API calls but longer requests.</span><br/>
        <span v-if="recommendChunkSizeDesc" class="caption font-weight-bold teal--text">{{recommendChunkSizeDesc}}</span><br/>
        <span v-if="chunkSizeWarning.message" :class="chunkSizeWarning.class">{{chunkSizeWarning.message}}</span>

        <v-switch
            v-model="useBatchTranslation"
            label="Use Batch Translation (Combine multiple texts per request)"
            :disabled="!enabled"
            dense
            hide-details
            class="mt-3"
            @change="onChangeBatchTranslation">
        </v-switch>
        <span class="caption grey--text">
            Batch mode combines multiple texts with delimiters, dramatically reducing API calls.<br/>
            Example: 200 variables → 4-8 API calls instead of 200 individual calls.<br/>
            <span v-if="isJpToKrEndpoint" class="orange--text font-weight-bold">
                ⚠️ JP→KR endpoints use original method (batch mode disabled for compatibility)
            </span>
        </span>
    </v-card-text>

    
    <v-card-subtitle class="pb-0 mt-4 font-weight-bold">Targets</v-card-subtitle>
    <v-card-text class="py-0">
<!--        <v-switch-->
<!--            v-model="targets.items"-->
<!--            label="Translate Items"-->
<!--            :disabled="!enabled"-->
<!--            dense-->
<!--            hide-details-->
<!--            @click.self.stop-->
<!--            @change="onChangeTargetsValue">-->
<!--        </v-switch>-->
        
        <v-switch
            class="mb-1 mt-4"
            v-model="targets.variables"
            label="Translate Variables"
            :disabled="!enabled"
            dense
            hide-details
            @click.self.stop
            @change="onChangeTargetsValue">
        </v-switch>
        
        <v-switch
            v-model="targets.switches"
            class="my-1"
            label="Translate Switches"
            :disabled="!enabled"
            dense
            hide-details
            @click.self.stop
            @change="onChangeTargetsValue">
        </v-switch>
        
        <v-switch
            v-model="targets.maps"
            class="my-1"
            label="Translate Maps"
            :disabled="!enabled"
            dense
            hide-details
            @click.self.stop
            @change="onChangeTargetsValue">
        </v-switch>
    </v-card-text>

    <v-card-subtitle class="pb-0 mt-4 font-weight-bold">Translation Bank</v-card-subtitle>
    <v-card-text class="py-0">
        <v-row>
            <v-col cols="12" md="6">
                <v-chip small color="green" text-color="white" class="mr-2">
                    <v-icon small left>mdi-database</v-icon>
                    {{bankStats.totalEntries}} cached
                </v-chip>
                <v-chip small color="blue" text-color="white">
                    <v-icon small left>mdi-clock</v-icon>
                    {{bankStats.ageText}}
                </v-chip>
            </v-col>
            <v-col cols="12" md="6">
                <v-btn
                    small
                    color="orange"
                    @click="clearTranslationBank"
                    :disabled="!enabled">
                    <v-icon small left>mdi-delete</v-icon>
                    Clear Bank
                </v-btn>
                <v-btn
                    small
                    color="blue"
                    class="ml-2"
                    @click="exportTranslationBank"
                    :disabled="!enabled">
                    <v-icon small left>mdi-export</v-icon>
                    Export
                </v-btn>
            </v-col>
        </v-row>
        <span class="caption grey--text">
            Translation bank stores successful translations for instant reuse.<br/>
            Cached translations load instantly without API calls.
        </span>
    </v-card-text>
</v-card>
    `,

    data () {
        return {
            translatorStatusChangedTime: 0,
            translatorChecking: false,
            translatorRunning: false,
            enabled: false,
            targets: {},

            endPointSelection: '',

            restApiMethods: [
                {
                    name: 'GET',
                    value: 'get'
                },
                {
                    name: 'POST',
                    value: 'post'
                }
            ],

            customEndPointData: {},

            bulkTranslateChunkSize: 500,

            // Translation bank stats
            bankStats: {
                totalEntries: 0,
                ageText: 'No data'
            },

            // Chunk size warning
            chunkSizeWarning: {
                message: '',
                class: ''
            },

            // Batch translation setting
            useBatchTranslation: true
        }
    },

    created () {
        this.initializeVariables()
    },

    computed: {
        translatorStatusMessage () {
            if (this.translatorChecking) {
                return 'Checking translation server...'
            }

            if (this.translatorRunning) {
                const serverName = this.selectedDefaultEndPoint ? this.selectedDefaultEndPoint.name : 'Custom'
                return `Translation server(${serverName}) is now running`
            }

            return 'WARN: Translator server is not running'
        },

        translatorStatusColor () {
            if (this.translatorChecking) {
                return 'orange'
            }

            if (this.translatorRunning) {
                return 'green'
            }

            return 'red'
        },

        endPointList () {
            const ret = Object.values(DEFAULT_END_POINTS).map(ep => ({ id: ep.id, name: ep.name }))
            ret.push({ id: 'custom', name: 'Custom' })

            return ret
        },

        isCustomEndPoint () {
            return this.endPointSelection === 'custom'
        },

        selectedDefaultEndPoint () {
            return DEFAULT_END_POINTS[this.endPointSelection]
        },

        recommendChunkSizeDesc () {
            if (this.isCustomEndPoint || !RECOMMEND_CHUNK_SIZE[this.endPointSelection]) {
                return null
            }

            return `Recommended chunk size for ${this.selectedDefaultEndPoint.name} : ${RECOMMEND_CHUNK_SIZE[this.endPointSelection]}`
        },

        isJpToKrEndpoint () {
            return this.endPointSelection === 'ezTransWeb' || this.endPointSelection === 'ezTransServer'
        }
    },

    methods: {
        async initializeVariables () {
            this.enabled = TRANSLATE_SETTINGS.isEnabled()

            this.endPointSelection = TRANSLATE_SETTINGS.getEndPointSelection()
            this.customEndPointData = TRANSLATE_SETTINGS.getCustomEndPointData()

            this.targets = TRANSLATE_SETTINGS.getTargets()
            this.bulkTranslateChunkSize = TRANSLATE_SETTINGS.getBulkTranslateChunkSize()

            // Load batch translation preference
            this.useBatchTranslation = localStorage.getItem('useBatchTranslation') !== 'false'

            this.updateBankStats()
            this.checkChunkSize()
            this.checkTranslatorAvailable()
        },

        onChangeEnabled () {
            TRANSLATE_SETTINGS.setEnabled(this.enabled)
        },

        onChangeTargetsValue () {
            TRANSLATE_SETTINGS.setTargets(this.targets)
        },

        async checkTranslatorAvailable () {
            const time = Date.now()

            this.translatorChecking = true
            const currentRunningState = await TRANSLATOR.isAvailable()

            if (this.translatorStatusChangedTime < time) {
                this.translatorStatusChangedTime = time
                this.translatorChecking = false
                this.translatorRunning = currentRunningState
            }
        },

        onChangeEndPoint () {
            TRANSLATE_SETTINGS.setEndPointSelection(this.endPointSelection)
            this.checkTranslatorAvailable()
        },

        onChangeCustomEndPointMethod () {
            TRANSLATE_SETTINGS.setCustomEndPointMethod(this.customEndPointData.method)
            this.checkTranslatorAvailable()
        },

        onChangeCustomEndPointUrlPattern () {
            TRANSLATE_SETTINGS.setCustomEndPointUrlPattern(this.customEndPointData.urlPattern)
            this.checkTranslatorAvailable()
        },

        onChangeCustomEndPointBody () {
            TRANSLATE_SETTINGS.setCustomEndPointBody(this.customEndPointData.body)
            this.checkTranslatorAvailable()
        },

        checkChunkSize () {
            const chunkSize = Number(this.bulkTranslateChunkSize)
            const endPointId = this.endPointSelection
            const maxSafe = MAX_CHUNK_SIZE[endPointId] || 50

            if (chunkSize <= 0) {
                this.chunkSizeWarning = {
                    message: 'Chunk size must be greater than 0',
                    class: 'caption font-weight-bold red--text'
                }
            } else if (chunkSize > maxSafe) {
                this.chunkSizeWarning = {
                    message: `⚠️ Large chunk size (${chunkSize}) may cause issues with ${endPointId}. Recommended max: ${maxSafe}`,
                    class: 'caption font-weight-bold orange--text'
                }
            } else if (chunkSize > 100) {
                this.chunkSizeWarning = {
                    message: `⚠️ Large chunk size may be slower due to rate limiting`,
                    class: 'caption font-weight-bold amber--text'
                }
            } else {
                this.chunkSizeWarning = {
                    message: '✅ Good chunk size for reliable translation',
                    class: 'caption font-weight-bold green--text'
                }
            }
        },

        onChnageBulkTranslateChunkSize () {
            const validateMsg = isInValueInRange(this.bulkTranslateChunkSize, 1, 2000)

            if (validateMsg) {
                Alert.error(validateMsg)
                this.bulkTranslateChunkSize = 500
                return
            }

            this.checkChunkSize()
            TRANSLATE_SETTINGS.setBulkTranslateChunkSize(Number(this.bulkTranslateChunkSize))
        },

        onChangeBatchTranslation () {
            // Store batch translation preference
            localStorage.setItem('useBatchTranslation', this.useBatchTranslation.toString())
            console.log(`Batch translation ${this.useBatchTranslation ? 'enabled' : 'disabled'}`)
        },

        updateBankStats () {
            const stats = TRANSLATION_BANK.getStats()
            this.bankStats.totalEntries = stats.totalEntries

            if (stats.newestEntry) {
                const age = Date.now() - stats.newestEntry
                const days = Math.floor(age / (24 * 60 * 60 * 1000))
                if (days > 0) {
                    this.bankStats.ageText = `${days} days old`
                } else {
                    this.bankStats.ageText = 'Recent'
                }
            } else {
                this.bankStats.ageText = 'No data'
            }
        },

        clearTranslationBank () {
            if (confirm('Clear all cached translations? This cannot be undone.')) {
                TRANSLATION_BANK.cache = {}
                TRANSLATION_BANK.saveCache()
                this.updateBankStats()
                Alert.success('Translation bank cleared')
            }
        },

        exportTranslationBank () {
            try {
                const data = TRANSLATION_BANK.export()
                const blob = new Blob([data], { type: 'application/json' })
                const url = URL.createObjectURL(blob)

                const a = document.createElement('a')
                a.href = url
                a.download = `translation-bank-${new Date().toISOString().split('T')[0]}.json`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)

                Alert.success('Translation bank exported')
            } catch (error) {
                Alert.error('Failed to export translation bank')
                console.error('Export error:', error)
            }
        }
    }
}
