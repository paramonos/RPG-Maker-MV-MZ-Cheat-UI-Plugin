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
    <v-card-subtitle class="caption pb-0">Battle</v-card-subtitle>
    <v-card-text class="pt-0 pb-0">
        <v-checkbox
            v-model="disableRandomEncounter"
            hide-details
            dense
            x-small
            class="my-0 py-0"
            @change="onDisableRandomEncounterChange">
            <template v-slot:label>
                <span class="caption">Disable Random Encounter</span>
            </template>
        </v-checkbox>
        <v-btn small @click.prevent="encounterBattle">Encounter</v-btn>
        <v-btn small @click.prevent="victory">Victory</v-btn>
        <v-btn small @click.prevent="defeat">Defeat</v-btn>
        <v-btn small @click.prevent="escape">Escape</v-btn>
        <v-btn small @click.prevent="abort">Abort</v-btn>
    </v-card-text>
    
    <v-card-subtitle class="caption pb-1">Enemy</v-card-subtitle>
    <v-card-text class="pt-0 pb-0">
        <v-btn small @click.prevent="changeAllEnemyHealth(0)">Set 0</v-btn>
        <v-btn small @click.prevent="changeAllEnemyHealth(1)">Set 1</v-btn>
        <v-btn small @click.prevent="recoverAllEnemy">Recovery</v-btn>
        <v-btn small @click.prevent="fillTpAllEnemy">Fill TP</v-btn>
    </v-card-text>
    
    <v-card-subtitle class="caption pb-1">Party</v-card-subtitle>
    <v-card-text class="pt-0 pb-0">
        <v-btn small @click.prevent="changeAllPartyHealth(0)">Set 0</v-btn>
        <v-btn small @click.prevent="changeAllPartyHealth(1)">Set 1</v-btn>
        <v-btn small @click.prevent="recoverAllParty">Recovery</v-btn>
        <v-btn small @click.prevent="fillTpAllParty">Fill TP</v-btn>
    </v-card-text>
    
    <template v-if="enemy && enemy.length > 0">
        <v-card-subtitle class="caption pb-1">Enemy Details</v-card-subtitle>
        <v-card-text class="pt-0 pb-0">
            <health-setting-tab
                :items="enemy"
                @change="onDetailChange">
            </health-setting-tab>
        </v-card-text>
    </template>
    
    <template v-if="party && party.length > 0">
        <v-card-subtitle class="caption pb-1">Party Details</v-card-subtitle>
        <v-card-text class="pt-0 pb-0">
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
            disableRandomEncounter: false,
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
            this.disableRandomEncounter = BattleCheat.isDisableRandomEncounter()
        },

        recoverAllEnemy () {
            BattleCheat.recoverAllEnemy()
            this.initializeVariables()
        },

        recoverAllParty () {
            BattleCheat.recoverAllParty()
            this.initializeVariables()
        },

        fillTpAllEnemy () {
            BattleCheat.fillTpAllEnemy()
            this.initializeVariables()
        },

        fillTpAllParty () {
            BattleCheat.fillTpAllParty()
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

        encounterBattle () {
            BattleCheat.encounterBattle()
        },

        victory () {
            BattleCheat.victory()
        },

        defeat () {
            BattleCheat.defeat()
        },

        escape () {
            BattleCheat.escape()
        },

        abort () {
            BattleCheat.abort()
        },

        onDisableRandomEncounterChange () {
            BattleCheat.toggleDisableRandomEncounter()
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
