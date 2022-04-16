import {Key} from '../js/KeyCodes.js'

export default {
    name: 'ShortcutPanel',

    template: `
<v-text-field
    v-model="showingText"
    :label="label"
    :solo="solo"
    :outlined="outlined"
    :background-color="backgroundColor"
    dense
    hide-details
    @keydown.self.stop.prevent="onShortcutInput"
    @focus="$event.target.select()">
    <template v-slot:append>
        <v-btn 
            v-if="deletable"
            :disabled="shortcut.isEmpty()"
            small
            :style="deleteBtnStyle"
            icon
            @click="onDeleteClick">
            <v-icon small>mdi-close-circle</v-icon>
        </v-btn>
    </template>
</v-text-field>
    `,

    data () {
        return {
        }
    },

    model: {
        prop: 'shortcut',
        event: 'change'
    },

    props: {
        shortcut: {
            type: Key,
            default: () => Key.createEmpty()
        },

        deletable: {
            type: Boolean,
            default: true
        },

        label: {
            type: String,
            default: ''
        },

        solo: {
            type: Boolean,
            default: false
        },

        outlined: {
            type: Boolean,
            default: false
        },

        backgroundColor: {
            type: String,
            default: undefined
        },

        combiningKeyAlone: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        deleteBtnStyle () {
            return `opacity: ${this.shortcut.isEmpty() ? 0 : 0.7}`
        },

        showingText () {
            return this.shortcut.asDisplayString()
        }
    },

    methods : {
        onDeleteClick () {
            const eventKey = Key.createEmpty()
            this.$emit('change', eventKey)
            this.$emit('input', eventKey)
        },

        onShortcutInput (e) {
            const eventKey = Key.fromEvent(e)

            if (eventKey.isCombiningKey() && !this.combiningKeyAlone) {
                return
            }

            if (!eventKey.equals(this.shortcut)) {
                this.$emit('change', eventKey)
            }

            this.$emit('input', eventKey)
        }
    }
}
