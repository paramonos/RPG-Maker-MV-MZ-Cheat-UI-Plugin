import {TRANSLATE_SETTINGS, DEFAULT_END_POINTS, RECOMMEND_CHUNK_SIZE} from '../js/TranslateHelper.js'
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
        <span class="caption grey--text">Number of sentences to be translated simultaneously.</span><br/>
        <span class="caption grey--text">If the translation doesn't work properly, try reducing the size.</span><br/>
        <span v-if="recommendChunkSizeDesc" class="caption font-weight-bold teal--text">{{recommendChunkSizeDesc}}</span>
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

            bulkTranslateChunkSize: 500
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
        }
    },

    methods: {
        async initializeVariables () {
            this.enabled = TRANSLATE_SETTINGS.isEnabled()

            this.endPointSelection = TRANSLATE_SETTINGS.getEndPointSelection()
            this.customEndPointData = TRANSLATE_SETTINGS.getCustomEndPointData()

            this.targets = TRANSLATE_SETTINGS.getTargets()
            this.bulkTranslateChunkSize = TRANSLATE_SETTINGS.getBulkTranslateChunkSize()

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

        onChnageBulkTranslateChunkSize () {
            const validateMsg = isInValueInRange(this.bulkTranslateChunkSize, 1, 2000)

            if (validateMsg) {
                Alert.error(validateMsg)
                this.bulkTranslateChunkSize = 500
                return
            }

            TRANSLATE_SETTINGS.setBulkTranslateChunkSize(Number(this.bulkTranslateChunkSize))
        }
    }
}
