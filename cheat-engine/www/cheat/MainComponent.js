import CheatModal from './CheatModal.js'
import { GLOBAL_SHORTCUT } from "./js/GlobalShortcut.js"
import { GeneralCheat } from './js/CheatHelper.js'
import AlertSnackbar from './components/AlertSnackbar.js'
import ConfirmDialog from './components/ConfirmDialog.js'
import { customizeRPGMakerFunctions } from './init/customize_functions.js'
import {Key} from './js/KeyCodes.js'
import {Alert} from'./js/AlertHelper.js'

export default {
    name: 'MainComponent',
    components: { CheatModal, AlertSnackbar, ConfirmDialog },
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
    <confirm-dialog></confirm-dialog>
</div>`,

    style: `
    #cheat-modal: {
        opacity: 0.7;
    }
    `,

    data () {
        return {
            currentKey: Key.createEmpty(),
            show: false,
            currentComponentName: null
        }
    },

    created () {
        const self = this

        customizeRPGMakerFunctions(self)

        GeneralCheat.toggleCheatModal = (componentName = null) => {
            this.toggleCheatModal(componentName)
        }

        GeneralCheat.openCheatModal = (componentName = null) => {
            this.openCheatModal(componentName)
        }

        window.addEventListener('keydown', this.onGlobalKeyDown)
        window.addEventListener('keyup', this.onGlobalKeyUp)

        this.checkVersion()
    },

    beforeDestroy () {
        window.removeEventListener('keydown', this.onGlobalKeyDown)
        window.removeEventListener('keyup', this.onGlobalKeyUp)
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
            if (e.repeat) {
                GLOBAL_SHORTCUT.runKeyRepeatEvent(e, Key.fromKey(this.currentKey))
            } else {
                GLOBAL_SHORTCUT.runKeyLeaveEvent(e, Key.fromKey(this.currentKey))
                this.currentKey.add(e.keyCode)
                this.currentKey.adjustCombiningKey(e)
                GLOBAL_SHORTCUT.runKeyEnterEvent(e, Key.fromKey(this.currentKey))
            }
        },

        onGlobalKeyUp (e) {
            GLOBAL_SHORTCUT.runKeyLeaveEvent(e, Key.fromKey(this.currentKey))
            this.currentKey.remove(e.keyCode)
            GLOBAL_SHORTCUT.runKeyEnterEvent(e, Key.fromKey(this.currentKey))
        },

        openCheatModal (componentName) {
            if (componentName) {
                this.currentComponentName = componentName
            }

            this.show = true
        },

        toggleCheatModal (componentName) {
            const prevComponentName = this.currentComponentName

            if (componentName) {
                this.currentComponentName = componentName
            }

            // close
            if (this.show) {
                // hide modal if only componentName unchanged
                if (!componentName || componentName === prevComponentName) {
                    this.show = false
                }
                return
            }

            // open
            this.show = true
        },

        async checkVersion () {
            if (!Utils.isNwjs()) {
                return
            }

            try {
                const releaseInfo = (await axios.get('https://api.github.com/repos/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin/releases/latest')).data

                const currentCheatVersion = this.getCurrentCheatVersion()

                if (!currentCheatVersion) {
                    return
                }

                if (currentCheatVersion < releaseInfo.tag_name) {
                    Alert.warn(`New cheat version has been released : ${currentCheatVersion} → ${releaseInfo.tag_name}`, null, 3000)
                }
            } catch (err) {

            }
        },

        getCurrentCheatVersion () {
            try {
                const targetDir = Utils.RPGMAKER_NAME === 'MV' ? 'www' : '.'

                const description = JSON.parse(require('fs').readFileSync(targetDir + '/cheat-version-description.json', 'utf-8'))

                return description.version
            } catch (err) {
                return null
            }
        }
    }
}
