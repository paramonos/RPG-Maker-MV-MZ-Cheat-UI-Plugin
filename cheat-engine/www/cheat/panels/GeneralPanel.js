import { GeneralCheat, GameSpeedCheat, SpeedCheat, SceneCheat } from '../js/CheatHelper.js'

export default {
    name: 'GeneralPanel',

    template: `
<v-card 
    class="ma-0 pa-0"
    flat>
    <v-card-subtitle class="pb-0 font-weight-bold">Edit</v-card-subtitle>
    
    <v-card-text 
        class="py-0">
        <v-checkbox
            v-model="noClip"
            label="No Clip"
            @change="onNoClipChange">
        </v-checkbox>
    </v-card-text>
    
    <v-card-text class="py-0">
        <v-text-field
            v-model="gold"
            label="Gold"
            outlined
            dense
            hide-details
            @keydown.self.stop
            @change="onGoldChange"
            @focus="$event.target.select()">
        </v-text-field>
    </v-card-text>
    
    <v-card-text class="pt-4 pb-0">
        <v-slider
            v-model="speed"
            :min="minSpeed"
            :max="maxSpeed"
            :step="stepSpeed"
            thumb-label
            thumb-color="red"
            hide-details
            @change="onSpeedChange">
            <template v-slot:prepend>
                <span class="grey--text text--lighten-1 align-self-center mr-2 body-2" style="white-space: nowrap;">Move Speed</span>
                <v-icon color="grey lighten-3" @click="addSpeed(-stepSpeed)">mdi-chevron-left</v-icon>
            </template>
            <template v-slot:append>
                <v-icon color="grey lighten-3" @click="addSpeed(stepSpeed)">mdi-chevron-right</v-icon>
                <span class="grey--text text--lighten-1 align-self-center ml-2">{{speed.toFixed(1)}}</span>
            </template>
        </v-slider>
        <v-checkbox
            v-model="fixSpeed"
            class="pt-0"
            hide-details
            dense
            label="Fixed"
            @change="onSpeedChange">
        </v-checkbox>
        
        <v-slider
            v-model="gameSpeed"
            :min="minGameSpeed"
            :max="maxGameSpeed"
            :step="stepGameSpeed"
            class="mt-3"
            thumb-label
            thumb-color="red"
            hide-details
            @change="onGameSpeedChange">
            <template v-slot:prepend>
                <span class="grey--text text--lighten-1 align-self-center mr-2 d-inline-block body-2" style="white-space: nowrap;">Game Speed</span>
                <v-icon color="grey lighten-3" @click="addGameSpeed(-stepGameSpeed)">mdi-chevron-left</v-icon>
            </template>
            <template v-slot:append>
                <v-icon color="grey lighten-3" @click="addGameSpeed(stepGameSpeed)">mdi-chevron-right</v-icon>
                <span class="grey--text text--lighten-1 align-self-center ml-2 mr-2">x{{gameSpeed.toFixed(1)}}</span>
                <v-icon size="16" color="grey lighten-3 ml-2" @click="setGameSpeed(1)">mdi-restore</v-icon>
            </template>
        </v-slider>
        
        <v-checkbox
            v-model="applyAllForGameSpeed"
            class="d-inline-flex pt-0"
            hide-details
            dense
            label="All"
            @change="onApplyAllForGameSpeedChange">
        </v-checkbox>
        <v-checkbox
            v-model="applyBattleForGameSpeed"
            class="d-inline-flex ml-2 pt-0 mb-0"
            hide-details
            dense
            label="Battle"
            @change="onApplyBattleForGameSpeedChange">
        </v-checkbox>
    </v-card-text>
    
    <v-card-subtitle class="mt-3 font-weight-bold">Quick Actions</v-card-subtitle>
    
    <v-card-text class="py-0">
        <v-btn
            small
            @click="gotoTitle">
            To Title
        </v-btn>
    </v-card-text>
    
    <v-card-text>
        <v-btn 
            small
            class="mr-1"
            @click="toggleSaveScene">
            Open Save
        </v-btn>
        <v-btn
            small
            @click="toggleLoadScene">
            Open Load
        </v-btn>
    </v-card-text>
    
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
            godMode: false,
            noClip: false,
            gold: 0,
            speed: 0,
            fixSpeed: false,

            minSpeed: 1,
            maxSpeed: 10,
            stepSpeed: 0.5,

            gameSpeed: 1,
            minGameSpeed: 0.1,
            maxGameSpeed: 10,
            stepGameSpeed: 0.1,
            applyAllForGameSpeed: false,
            applyBattleForGameSpeed: false
        }
    },

    created () {
        this.initializeVariables()
    },

    methods: {
        initializeVariables () {
            this.noClip = $gamePlayer._through
            this.speed = $gamePlayer.moveSpeed()
            this.fixSpeed = SpeedCheat.isFixed()
            this.gold = $gameParty._gold

            this.gameSpeed = GameSpeedCheat.getRate()
            const gameSpeedSceneOption = GameSpeedCheat.getSceneOption()
            if (gameSpeedSceneOption === GameSpeedCheat.sceneOptions().all) {
                this.applyAllForGameSpeed = true
            } else if (gameSpeedSceneOption === GameSpeedCheat.sceneOptions().battle) {
                this.applyBattleForGameSpeed = true
            }
        },

        onNoClipChange () {
            GeneralCheat.toggleNoClip()
            this.initializeVariables()
        },

        onSpeedChange () {
            SpeedCheat.setSpeed(this.speed, this.fixSpeed)
            SpeedCheat.__writeSettings(this.speed, this.fixSpeed)
            this.initializeVariables()
        },

        addSpeed (amount) {
            this.speed = Math.min(Math.max(this.speed + amount, this.minSpeed), this.maxSpeed)
            this.onSpeedChange()
        },

        onGoldChange () {
            if (isNaN(this.gold) || !Number.isInteger(Number(this.gold)) || this.gold < 0) {
                return
            }

            const diff = this.gold - $gameParty._gold

            if (diff < 0) {
                $gameParty.loseGold(-diff)
            } else if (diff > 0) {
                $gameParty.gainGold(diff)
            }

            this.gold = $gameParty._gold
            this.initializeVariables()
        },

        gotoTitle () {
            SceneCheat.gotoTitle()
        },

        toggleSaveScene () {
            SceneCheat.toggleSaveScene()
        },

        toggleLoadScene () {
            SceneCheat.toggleLoadScene()
        },

        onGameSpeedChange () {
            let sceneOption = null
            if (this.applyAllForGameSpeed) {
                sceneOption = GameSpeedCheat.sceneOptions().all
            } else if (this.applyBattleForGameSpeed) {
                sceneOption = GameSpeedCheat.sceneOptions().battle
            }

            GameSpeedCheat.setGameSpeed(this.gameSpeed, sceneOption)
            GameSpeedCheat.__writeSettings(this.gameSpeed, sceneOption)
            this.initializeVariables()
        },

        addGameSpeed (amount) {
            this.gameSpeed = Math.min(Math.max(this.gameSpeed + amount, this.minGameSpeed), this.maxGameSpeed)
            this.onGameSpeedChange()
        },

        setGameSpeed (amount) {
            this.gameSpeed = 1
            this.onGameSpeedChange()
        },

        onApplyAllForGameSpeedChange () {
            if (this.applyAllForGameSpeed) {
                this.applyBattleForGameSpeed = false
            } else {
                this.applyBattleForGameSpeed = true
            }

            this.onGameSpeedChange()
        },

        onApplyBattleForGameSpeedChange () {
            if (this.applyBattleForGameSpeed) {
                this.applyAllForGameSpeed = false
            } else {
                this.applyAllForGameSpeed = true
            }

            this.onGameSpeedChange()
        }
    }
}
