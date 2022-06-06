import KeyInputField from '../components/KeyInputField.js'
import { GLOBAL_SHORTCUT } from '../js/GlobalShortcut.js'
import {Key} from '../js/KeyCodes.js'
import {Alert} from '../js/AlertHelper.js'

export default {
    name: 'ShortcutPanel',

    components: {
        KeyInputField
    },

    template: `
<v-card flat class="ma-0 pa-0">
    <v-row>
        <v-col
            cols="12"
            md="8">
            <v-text-field
                label="Search..."
                solo
                background-color="grey darken-3"
                v-model="search"
                dense
                hide-details
                @keydown.self.stop
                @input="onSearchChange"
                @focus="$event.target.select()">
            </v-text-field>
        </v-col>
        <v-col
            cols="12"
            md="4">
            <key-input-field
                v-model="shortcutSearch"
                label="Shortcut"
                solo
                dense
                background-color="grey darken-3"
                hide-details
                combining-key-alone
                @change="onShortcutSearchChange">
            </key-input-field>
        </v-col>
    </v-row>
    <v-card-text
        class="pa-0 d-flex justify-space-between align-center">
        <v-checkbox
            class="d-inline-flex"
            v-model="hideDesc"
            label="Hide Description Field">
        </v-checkbox>
        <v-tooltip
            bottom>
            <span>Restore to default settings</span>
            <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="green"
                    v-bind="attrs"
                    v-on="on"
                    x-small
                    fab
                    @click="restoreToDefault">
                    <v-icon small>mdi-restore</v-icon>
                </v-btn>
            </template>
        </v-tooltip>
    </v-card-text>
    <v-data-table
        class="mt-2"
        denses
        single-expand
        :headers="filteredHeaders"
        :expanded.sync="tableExpanded"
        :items="filteredShortcuts"
        :search="search"
        :custom-filter="tableItemFilter"
        :items-per-page="5">
        <template
            v-slot:item.shortcut="{ item }">
            <key-input-field
                style="width: 170px;"
                v-model="item.shortcut"
                :deletable="!item.necessary"
                label="No Shortcut"
                solo
                dense
                background-color="grey darken-3"
                :combining-key-alone="item.combiningKeyAlone"
                hide-details
                @change="onShortcutChange($event, item)">
            </key-input-field>
        </template>
        <template
            v-slot:item.param="{ item, index }">
            <v-btn
                v-if="Object.keys(item.paramDesc).length > 0"
                color="blue-grey"
                dark
                x-small
                fab
                @click="changeExpanded(item)">
                <v-icon small>mdi-cog</v-icon>
            </v-btn>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="ma-0 pa-0">
                <v-card 
                    flat
                    class="ma-0 py-2 px-0"
                    v-if="Object.keys(item.paramDesc).length > 0">
                    <v-card-subtitle
                        class="py-0 mb-1">
                        Parameters
                    </v-card-subtitle>
                    <v-card-text
                        class="py-0 my-0 mb-1"
                        v-for="paramKey in Object.keys(item.paramDesc)"
                        :key="paramKey">
                        <v-row
                            class="ma-0 pa-0">
                            <v-col
                                class="pa-0"
                                cols="12"
                                md="3">
                                <v-text-field
                                    v-model="item.param[paramKey].value"
                                    outlined
                                    dense
                                    hide-details
                                    @keydown.self.stop
                                    @change="onParameterChange($event, item, paramKey)"
                                    :label="item.paramDesc[paramKey].name"
                                    @focus="$event.target.select()">
                                </v-text-field>
                            </v-col>
                            <v-col
                                class="pa-0 d-inline-flex align-center"
                                cols="12"
                                md="9">
                                <span class="ml-3">: {{item.paramDesc[paramKey].desc}}</span>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </td>
        </template>
    </v-data-table>
</v-card>
    `,

    data () {
        return {
            shortcuts: [],

            tableExpanded: [],

            hideDesc: true,
            search: '',
            shortcutSearch: Key.createEmpty(),

            tableHeaders: [
                {
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'Desc',
                    value: 'desc',
                },
                {
                    text: 'Shortcut',
                    value: 'shortcut'
                },
                {
                    text: 'Param',
                    value: 'param'
                }
            ]
        }
    },

    created () {
        this.initializeVariables()
    },

    computed: {
        filteredHeaders () {
            return this.tableHeaders.filter(header => !this.hideDesc || header.value !== 'desc')
        },

        filteredShortcuts () {
            return this.shortcuts.filter(item => {
                return this.shortcutSearch.isEmpty() || item.shortcut.contains(this.shortcutSearch)
            })
        }
    },

    methods: {
        restoreToDefault () {
            GLOBAL_SHORTCUT.restoreDefaultSettings()
            this.initializeVariables()
        },

        onSearchChange (search) {
          this.shortcutSearch = Key.createEmpty()
        },

        onShortcutSearchChange (key) {
            this.search = ''
        },

        changeExpanded (item) {
            if (this.tableExpanded.length === 1 && this.tableExpanded[0] === item) {
                this.tableExpanded = []
            } else {
                this.tableExpanded = [item]
            }
        },

        onShortcutChange (key, item) {
            try {
                GLOBAL_SHORTCUT.setShortcut(item.id, key)
            } catch (err) {
                Alert.error(err.message)
            }

            item.shortcut = GLOBAL_SHORTCUT.getShortcut(item.id)
        },

        onParameterChange(value, item, paramId) {
            try {
                GLOBAL_SHORTCUT.setParam(item.id, paramId, value)
            } catch (err) {
                Alert.error(err.message)
            }

            item.param[paramId].value = GLOBAL_SHORTCUT.getParam(item.id, paramId)
        },

        convertToInternalData (settings, config) {
            const param = {}

            if (settings.param) {
                for (const paramName of Object.keys(settings.param)) {
                    param[paramName] = {
                        id: paramName,
                        value: settings.param[paramName]
                    }
                }

            }

            return {
                id: config.id,
                name: config.name,
                desc: config.desc,
                necessary: config.necessary,
                combiningKeyAlone: config.combiningKeyAlone,
                paramDesc: config.param,

                // use deep copy of settings
                shortcut: Key.fromKey(settings.shortcut),
                param: param
            }
        },

        initializeVariables () {
            this.shortcuts = Object.keys(GLOBAL_SHORTCUT.shortcutConfig).map(key => {
                return this.convertToInternalData(GLOBAL_SHORTCUT.shortcutSettings[key], GLOBAL_SHORTCUT.shortcutConfig[key])
            })
        },

        tableItemFilter (value, search, item) {
            if (search === null || search.trim() === '') {
                return true
            }

            search = search.toLowerCase()
            return item.name.toLowerCase().contains(search) || item.desc.toLowerCase().contains(search) || item.shortcut.asDisplayString().toLowerCase().contains(search)
        }
    }
}
