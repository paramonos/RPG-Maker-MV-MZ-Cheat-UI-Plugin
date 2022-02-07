export default {
    name: 'SaveRecallPanel',

    template: `
<v-card flat class="ma-0 pa-0">
    <v-card-subtitle class="ma-0 pa-0">Save Location</v-card-subtitle>
    <span class="body-2 green--text text--darken-1">Map : {{currentMapName}}</span>
    <v-text-field
        label="Location Alias"
        solo
        background-color="grey darken-3"
        v-model="locationAliasInput"
        dense
        hide-details
        @keydown.self.stop>
        <template v-slot:append-outer>
            <v-tooltip
                bottom>
                <span>Save current location</span>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn
                        class="mt-n1"
                        color="teal"
                        x-small
                        fab
                        v-on="on"
                        v-bind="attrs"
                        @click="onAddLocation">
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
        </template>
    </v-text-field>

    <v-card-subtitle class="ma-0 pa-0 mt-5">Recall Location</v-card-subtitle>
    <v-data-table
        v-if="tableHeaders"
        class="mt-2"
        denses
        :headers="tableHeaders"
        :items="tableItems"
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
                @keydown.self.stop>
            </v-text-field>
        </template>
        <template
            v-slot:item.coord="{ item }">
            {{ item.coord.x }}, {{ item.coord.y }}
        </template>
        <template
            v-slot:item.actions="{ item, index }">
            <v-btn
                color="green"
                x-small
                fab
                @click="teleportLocation(item.mapId, item.coord.x, item.coord.y)">
                <v-icon small>mdi-map-marker</v-icon>
            </v-btn>
            
            <v-btn
                color="red"
                class="ml-2"
                x-small
                fab
                @click="removeLocation(index)">
                <v-icon small>mdi-delete</v-icon>
            </v-btn>
        </template>
    </v-data-table>
    
    <v-tooltip
        bottom>
        <span>Reload from game data</span>
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
                @click="initializeVariables">
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
        </template>
    </v-tooltip>
</v-card>
    `,

    data () {
        return {
            locationAliasInput: '',

            search: '',

            locations: [],

            currentMapName: '',

            tableHeaders: [
                {
                    text: 'Name',
                    value: 'name'
                },
                {
                    text: 'Map',
                    value: 'mapName'
                },
                {
                    text: 'Coord',
                    value: 'coord'
                },
                {
                    text: 'Actions',
                    value: 'actions'
                }
            ]
        }
    },

    mounted () {
        this.initializeVariables()
    },

    computed: {
        tableItems () {
            return this.locations.map(location => {
                return {
                    name: location.name,
                    mapName: ($dataMapInfos[location.mapId] ? $dataMapInfos[location.mapId].name : 'NULL'),
                    mapId: location.mapId,
                    coord: {
                        x: location.x,
                        y: location.y
                    }
                }
            })
        },

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
        initializeVariables () {
            console.log($gameMap.mapId())
            this.loadLocations()
            this.currentMapName = this.getMapFullPath($gameMap.mapId())
        },

        getMapFullPath (id) {
            if (!id || !$dataMapInfos[id]) {
                return 'NULL'
            }

            let fullPath = []
            this.getMapAncestors(id, fullPath)

            return fullPath.map(id => $dataMapInfos[id].name).join(' / ')
        },

        getMapAncestors (id, path) {
            path.push(id)
            if ($dataMapInfos[id].parentId === 0) {
                path.reverse()
                return
            }

            this.getMapAncestors($dataMapInfos[id].parentId, path)
        },

        saveLocations () {
            localStorage.setItem('cheat.locations', JSON.stringify(this.locations))
        },

        loadLocations () {
            const data = localStorage.getItem('cheat.locations')

            if (!data) {
                this.locations = []
                return
            }

            this.locations = JSON.parse(data)
        },

        onAddLocation () {
            this.addLocation(this.locationAliasInput)
            this.locationAliasInput = ''
        },

        addLocation (locationAlias) {
            this.locations.push({
                name: locationAlias,
                mapId: $gameMap.mapId(),
                x: $gamePlayer.x,
                y: $gamePlayer.y
            })
            this.saveLocations()
        },

        removeLocation (index) {
            this.locations.splice(index, 1)
            this.saveLocations()
        },

        teleportLocation (mapId, x, y) {
            $gamePlayer.reserveTransfer(mapId, x, y, $gamePlayer.direction(), 0);
            $gamePlayer.setPosition(x, y);
        },

        tableItemFilter (value, search, item) {
            if (search === null || search.trim() === '') {
                return true
            }

            return item.name.contains(search) || item.mapName.contains(search) || String(item.value).contains(search)
        }
    }
}
