import HealthSettingTab from './HealthSettingTab.js'
import {BattleCheat} from '../js/CheatHelper.js'

export default {
    name: 'HealthSettingPanel',

    components: {
        HealthSettingTab
    },

    template: `
<v-card 
    class="ma-0 pa-0"
    flat>
    <v-card-subtitle>Enemy</v-card-subtitle>
    <v-card-text>
        <v-btn @click.prevent="changeAllEnemyHealth(0)">Set 0</v-btn>
        <v-btn @click.prevent="changeAllEnemyHealth(1)">Set 1</v-btn>
        <v-btn @click.prevent="recoverAllEnemy">Recovery</v-btn>
    </v-card-text>
    
    <v-card-subtitle>Party</v-card-subtitle>
    <v-card-text>
        <v-btn @click.prevent="changeAllPartyHealth(0)">Set 0</v-btn>
        <v-btn @click.prevent="changeAllPartyHealth(1)">Set 1</v-btn>
        <v-btn @click.prevent="recoverAllParty">Recovery</v-btn>
    </v-card-text>
    
    <template v-if="enemy && enemy.length > 0">
        <v-card-subtitle>Enemy Details</v-card-subtitle>
        <v-card-text>
            <health-setting-tab
                :items="enemy"
                @change="onDetailChange">
            </health-setting-tab>
        </v-card-text>
    </template>
    
    <template v-if="party && party.length > 0">
        <v-card-subtitle>Party Details</v-card-subtitle>
        <v-card-text>
            <health-setting-tab
                :items="party"
                @change="onDetailChange">
            </health-setting-tab>
        </v-card-text>
    </template>
    
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
            enemy: [],
            party: []
        }
    },

    created () {
        this.initializeVariables()
    },

    methods: {
        initializeVariables () {
            this.enemy = $gameTroop.members().map(member => member)
            this.party = $gameParty.members().map(member => member)
        },

        recoverAllEnemy () {
            BattleCheat.recoverAllEnemy()
            this.initializeVariables()
        },

        recoverAllParty () {
            BattleCheat.recoverAllParty()
            this.initializeVariables()
        },

        changeAllEnemyHealth (newHp) {
            BattleCheat.changeAllEnemyHealth(newHp)
            this.initializeVariables()
        },

        changeAllPartyHealth (newHp) {
            BattleCheat.changeAllPartyHealth(newHp)
            this.initializeVariables()
        },

        onDetailChange (items) {
            for (const item of items) {
                const member = item._member
                member.setHp(Number(item.hp.hp))
                member.setMp(Number(item.mp.mp))
            }
            this.initializeVariables()
        }
    }
}
