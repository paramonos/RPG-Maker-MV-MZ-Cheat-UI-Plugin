import {TRANSLATE_SETTINGS} from '../js/TranslateHelper.js'
import {TRANSLATOR} from '../js/TranslateHelper.js'

export default {
    name: 'TranslateSettingsPanel',

    template: `
<v-card flat class="ma-0 pa-0">
    <v-card-subtitle class="pb-0">Usage</v-card-subtitle>
    <v-card-text class="pb-0">
        <a href="https://github.com/HelloKS/ezTransWeb" target="_blank">ezTransWeb</a> must be running before translation.
    </v-card-text>
    <v-card-text class="py-0" :class="translatorStatusColor + '--text'">
        {{translatorStatusMessage}}
    </v-card-text>
    <v-card-subtitle class="pb-0 mt-4">Translate</v-card-subtitle>
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
    
    <v-card-subtitle class="pb-0 mt-4">Targets</v-card-subtitle>
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
            label="Translate Switches"
            :disabled="!enabled"
            dense
            hide-details
            @click.self.stop
            @change="onChangeTargetsValue">
        </v-switch>
        
        <v-switch
            v-model="targets.maps"
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
            translatorRunning: false,
            enabled: false,
            targets: {}
        }
    },

    created () {
        this.initializeVariables()
    },

    computed: {
        translatorStatusMessage () {
            if (this.translatorRunning) {
                return 'Translator server is now running'
            }

            return 'WARN: Translator server is not running'
        },

        translatorStatusColor () {
            if (this.translatorRunning) {
                return 'green'
            }

            return 'red'
        }
    },

    methods: {
        async initializeVariables () {
            this.enabled = TRANSLATE_SETTINGS.isEnabled()
            this.targets = TRANSLATE_SETTINGS.getTargets()
            this.translatorRunning = await TRANSLATOR.isAvailable()
        },

        onChangeEnabled () {
            TRANSLATE_SETTINGS.setEnabled(this.enabled)
        },

        onChangeTargetsValue () {
            TRANSLATE_SETTINGS.setTargets(this.targets)
        }
    }
}
