import { SpeedCheat, SceneCheat } from '../js/CheatHelper.js'

export default {
    name: 'GeneralPanel',

    template: `
<v-card 
    class="ma-0 pa-0"
    flat>
    <v-card-subtitle class="pb-0">Edit</v-card-subtitle>
    
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
            @change="onGoldChange">
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
                <span class="grey--text text--lighten-1 align-self-center mr-2">Speed</span>
                <v-icon color="grey lighten-3" @click="addSpeed(-stepSpeed)">mdi-chevron-left</v-icon>
            </template>
            <template v-slot:append>
                <v-icon color="grey lighten-3" @click="addSpeed(stepSpeed)">mdi-chevron-right</v-icon>
                <span class="grey--text text--lighten-1 align-self-center ml-2">{{speed.toFixed(1)}}</span>
            </template>
        </v-slider>
        <v-checkbox
            v-model="fixSpeed"
            hide-details
            dense
            label="Fixed"
            @change="onSpeedChange">
        </v-checkbox>
    </v-card-text>
    
    <v-card-subtitle class="mt-3">Quick Actions</v-card-subtitle>
    
    <v-card-text class="py-0">
        <v-btn
            @click="gotoTitle">
            To Title
        </v-btn>
    </v-card-text>
    
    <v-card-text>
        <v-btn 
            class="mr-1"
            @click="toggleSaveScene">
            Open Save
        </v-btn>
        <v-btn
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
            stepSpeed: 0.5
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
        },

        onNoClipChange () {
            $gamePlayer._through = this.noClip
        },

        onSpeedChange () {
            SpeedCheat.setSpeed(this.speed, this.fixSpeed)

            if (!this.fixSpeed) {
                SpeedCheat.removeFixSpeedInterval()
            }
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
        },

        gotoTitle () {
            SceneCheat.gotoTitle()
        },

        toggleSaveScene () {
            SceneCheat.toggleSaveScene()
        },

        toggleLoadScene () {
            SceneCheat.toggleLoadScene()
        }
    }
}
