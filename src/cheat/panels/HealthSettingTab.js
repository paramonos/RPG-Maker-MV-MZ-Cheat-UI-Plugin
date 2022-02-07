export default {
    name: 'HealthSettingTab',

    template: `
<div>
    <v-data-table
        v-if="tableHeaders"
        denses
        hide-default-footer
        :headers="tableHeaders"
        :items="editingItems">
        <template
            v-slot:item.hp="{ item }">
            <v-text-field
                background-color="grey darken-3"
                class="d-inline-flex"
                height="10"
                style="width: 60px;"
                hide-details
                solo
                v-model="item.hp.hp"
                label="Curr Hp"
                dense
                @keydown.self.stop
                @change="onDataChange">
            </v-text-field>
            / {{item.hp.mhp}}
        </template>
        <template
            v-slot:item.mp="{ item }">
            <v-text-field
                background-color="grey darken-3"
                class="d-inline-flex"
                height="10"
                style="width: 60px;"
                hide-details
                solo
                v-model="item.mp.mp"
                label="Curr Mp"
                dense
                @keydown.self.stop
                @change="onDataChange">
            </v-text-field>
            / {{item.mp.mmp}}
        </template>
    </v-data-table>
</div>
    `,

    data () {
        return {
            tableHeaders: [
                {
                    text: 'Name',
                    value: 'name',
                },
                {
                    text: 'Hp',
                    value: 'hp'
                },
                {
                    text: 'Mp',
                    value: 'mp'
                }
            ],

            editingItems: [],
        }
    },

    props: {
        items: {
            type: Array,
            default: []
        }
    },

    watch: {
        items: {
            immediate: true,
            handler () {
                this.editingItems = this.items.map((member) => {
                    return {
                        _member: member,
                        name: member.name(),
                        hp: {
                            hp: member.hp,
                            mhp: member.mhp,
                        },
                        mp: {
                            mp: member.mp,
                            mmp: member.mmp
                        }
                    }
                })
            }
        }
    },

    methods: {
        onDataChange () {
            this.$emit('change', this.editingItems)
        }
    }
}
