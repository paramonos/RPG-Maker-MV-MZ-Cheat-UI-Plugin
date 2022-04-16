import {TRANSLATE_SETTINGS, TRANSLATOR} from '../js/TranslateHelper.js'
import {Alert} from '../js/AlertHelper.js'

export default {
    name: 'TeleportPanel',

    template: `
<v-card flat class="ma-0 pa-0">
    <v-row>
        <v-col
            cols="12"
            md="6">
            <v-text-field
                v-model="inputX"
                label="X"
                dense
                background-color="grey darken-3"
                hide-details
                outlined
                @keydown.self.stop
                @focus="$event.target.select()">
            </v-text-field>
        </v-col>
        <v-col
            cols="12"
            md="6">
            <v-text-field
                v-model="inputY"
                label="Y"
                dense
                background-color="grey darken-3"
                hide-details
                outlined
                @keydown.self.stop
                @focus="$event.target.select()">
            </v-text-field>
        </v-col>
    </v-row>

    <v-data-table
        v-if="tableHeaders"
        class="mt-2"
        denses
        :headers="filteredTableHeaders"
        :items="maps"
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
            <v-checkbox
                v-model="excludeFullPath"
                label="Hide Full Path Field">
            </v-checkbox>
        </template>
        <template
            v-slot:item.fullPath="{ item }">
            {{item.fullPathJoin}}
        </template>
        <template
            v-slot:item.actions="{ item, index }">
            <v-tooltip
                bottom>
                <span>Teleport</span>
                <template v-slot:activator="{ on, attrs }">
                
                    <v-btn
                        color="green"
                        x-small
                        fab
                        v-bind="attrs"
                        v-on="on"
                        @click="teleportLocation(item.id, Number(inputX), Number(inputY))">
                        <v-icon small>mdi-map-marker</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
        </template>
    </v-data-table>
</v-card>
    `,

    data () {
        return {
            inputX: '0',
            inputY: '0',

            search: '',
            excludeFullPath: false,

            maps: [],

            tableHeaders: [
                {
                    text: 'Id',
                    value: 'id'
                },
                {
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'FullPath',
                    value: 'fullPath'
                },
                {
                    text: 'Actions',
                    value: 'actions'
                }
            ]
        }
    },

    created () {
        this.initializeVariables()
    },

    computed: {
        filteredTableHeaders () {
            if (this.excludeFullPath) {
                return this.tableHeaders.filter(header => header.value !== 'fullPath')
            }

            return this.tableHeaders
        }
    },

    methods: {
        async initializeVariables () {
            const rawDataMapInfos = $dataMapInfos.filter(mapInfo => !!mapInfo)
            const mapNames = await this.getMapNames($dataMapInfos)

            this.maps = $dataMapInfos.filter(mapInfo => !!mapInfo).map(mapInfo => {
                let fullPath = []

                this.getMapAncestors(mapInfo.id, fullPath)
                fullPath = fullPath.map(id => mapNames[id])

                return {
                    _mapInfo: mapInfo,
                    id: mapInfo.id,
                    fullPath: fullPath,
                    fullPathJoin: fullPath.join(' / '),
                    name: mapNames[mapInfo.id],
                }
            })
        },

        async getMapNames (dataMapInfos) {
            const rawNames = dataMapInfos.map(m => m ? m.name : '')

            if (TRANSLATE_SETTINGS.isMapTranslateEnabled()) {
                return await TRANSLATOR.translateBulk(rawNames)
            }

            return rawNames
        },

        getMapAncestors (id, path) {
            path.push(id)
            if ($dataMapInfos[id].parentId === 0) {
                path.reverse()
                return
            }

            this.getMapAncestors($dataMapInfos[id].parentId, path)
        },

        teleportLocation (mapId, x, y) {
            $gamePlayer.reserveTransfer(mapId, x, y, $gamePlayer.direction(), 0);
            $gamePlayer.setPosition(x, y);
        },

        tableItemFilter (value, search, item) {
            if (search === null || search.trim() === '') {
                return true
            }

            search = search.toLowerCase()

            return item.name.toLowerCase().contains(search) || item.fullPathJoin.toLowerCase().contains(search) || String(item.id).toLowerCase().contains(search)
        }
    }
}
