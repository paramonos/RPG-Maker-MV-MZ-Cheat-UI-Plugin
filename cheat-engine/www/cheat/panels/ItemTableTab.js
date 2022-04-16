export default {
    name: 'ItemTableTab',

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
                    md="6">
                    <v-checkbox
                        v-model="excludeNameless"
                        dense
                        hide-details
                        label="Hide Nameless Items"
                        @change="onTableFilterChange">
                    
                    </v-checkbox>
                </v-col>
                <v-col
                    cols="12"
                    md="6">
                    <v-checkbox
                        v-model="onlyOwnedItems"
                        dense
                        hide-details
                        label="Only Owned Items"
                        @change="onTableFilterChange">
                    
                    </v-checkbox>
                </v-col>
            </v-row>
        </template>
        <template
            v-slot:item.amount="{ item }">
            <v-text-field
                background-color="grey darken-3"
                class="d-inline-flex"
                height="10"
                style="width: 60px;"
                hide-details
                solo
                v-model="item.amount"
                label="Amount"
                dense
                @keydown.self.stop
                @change="onItemChange(item)"
                @focus="$event.target.select()">
            </v-text-field>
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
            search: '',
            excludeNameless: false,
            onlyOwnedItems: false,
            tableHeaders: [],
            tableItems: []
        }
    },

    props: {
        items: [],
        headers: {
            type: Array
        },
        asTableData: {
            type: Function
        },
        searchableAttrs: {
            type: Array,
            default: []
        }
    },

    created () {
    },

    watch: {
        items: {
            immediate: true,
            handler () {
                this.initializeVariables()
            }
        }
    },

    computed: {
        filteredTableItems () {
            return this.tableItems.filter(item => {
                if (this.excludeNameless && !item.name) {
                    return false
                }

                if (this.onlyOwnedItems && item.amount === 0) {
                    return false
                }

                return true
            })
        }
    },

    methods: {
        initializeVariables () {
            this.tableHeaders = this.headers.slice(0)
            this.tableHeaders.push({
                text: 'Amount',
                value: 'amount'
            })

            this.tableItems = this.items.filter(item => !!item).map(item => {
                const tableItem = this.asTableData(item)
                tableItem._item = item
                tableItem.amount = $gameParty.numItems(item)

                return tableItem
            })
        },

        onItemChange (item) {
            // modify amount
            const diff = item.amount - $gameParty.numItems(item._item)
            $gameParty.gainItem(item._item, diff)

            // refresh
            item.amount = $gameParty.numItems(item._item)
        },

        onTableFilterChange () {
        },

        tableItemFilter (value, search, item) {
            if (search === null || search.trim() === '') {
                return true
            }

            search = search.toLowerCase()
            for (const attr of this.searchableAttrs) {
                if (item[attr].toLowerCase().contains(search)) {
                    return true
                }
            }

            return false
        }
    }
}
