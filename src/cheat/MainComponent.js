import CheatModal from './CheatModal.js'
import { KEY_SETTINGS } from "./js/KeyMap.js"

export default {
    name: 'MainComponent',
    components: { CheatModal },
    template: `
<div 
    class="pa-2">
    <v-fade-transition leave-absolute>
        <cheat-modal
            v-model="currentComponentName"
            v-if="show">
        </cheat-modal>
    </v-fade-transition>
</div>`,

    data () {
        return {
            show: false,
            currentComponentName: null
        }
    },

    created () {
        window.addEventListener('keydown', this.onGlobalKeyDown)

        // remove preventDefault
        TouchInput._onWheel = function () {
            this._events.wheelX += event.deltaX
            this._events.wheelY += event.deltaY
        }
    },

    beforeDestroy () {
        window.removeEventListener('keydown', this.onGlobalKeyDown)
    },

    watch: {
        show: {
            immediate: true,
            handler (value) {
            }
        }
    },

    methods: {
        onGlobalKeyDown (e) {
            if (KEY_SETTINGS.toggleCheatModal.check(e)) {
                this.toggleCheatModal()
            }
        },

        toggleCheatModal () {
            this.show = !this.show
        }
    }
}
