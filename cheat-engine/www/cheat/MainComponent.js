import CheatModal from './CheatModal.js'
import { GLOBAL_SHORTCUT } from "./js/GlobalShortcut.js"
import { GeneralCheat } from './js/CheatHelper.js'
import AlertSnackbar from './components/AlertSnackbar.js'

export default {
    name: 'MainComponent',
    components: { CheatModal, AlertSnackbar },
    template: `
<div 
    class="pa-2"
    ref="rootDiv">
    <v-fade-transition leave-absolute>
        <cheat-modal
            id="cheat-modal"
            class="opaque-on-mouseover"
            v-model="currentComponentName"
            v-if="show"
            >
        </cheat-modal>
    </v-fade-transition>
    <alert-snackbar></alert-snackbar>
</div>`,

    style: `
    #cheat-modal: {
        opacity: 0.7;
    }
    `,

    data () {
        return {
            show: false,
            currentComponentName: null
        }
    },

    created () {
        const self = this

        GeneralCheat.toggleCheatModal = () => {
            this.toggleCheatModal()
        }

        window.addEventListener('keydown', this.onGlobalKeyDown)


        // WARN: directly changing engine code can be dangerous
        // remove preventDefault
        TouchInput._onWheel = function () {
            this._events.wheelX += event.deltaX
            this._events.wheelY += event.deltaY
        }

        // ignore click event when cheat modal shown and click inside cheat modal
        TouchInput._onMouseDown = function(event) {
            if (self.show) {
                const bcr = document.querySelector('#cheat-modal').getBoundingClientRect();
                if (bcr.left <= event.clientX && event.clientX <= bcr.left + bcr.width
                    && bcr.top <= event.clientY && event.clientY <= bcr.top + bcr.height) {
                    return
                }
            }

            if (event.button === 0) {
                this._onLeftButtonDown(event);
            } else if (event.button === 1) {
                this._onMiddleButtonDown(event);
            } else if (event.button === 2) {
                this._onRightButtonDown(event);
            }
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
            GLOBAL_SHORTCUT.runKeyEvent(e)
        },

        toggleCheatModal () {
            this.show = !this.show
        }
    }
}
