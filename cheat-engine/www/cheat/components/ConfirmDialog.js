import {ConfirmDialog} from '../js/DialogHelper.js'

export default {
    name: 'ConfirmDialog',
    template: `
  <v-dialog v-model="showDialog" v-if="options" :width="options.width">
    <v-card
        dark 
        class="pt-4">
      <v-card-text
        class="subtitle-1">
        <template v-for="(msg, idx) in messageArray">
          <span :key="idx">{{msg}}</span>
          <br :key="-idx - 1"/>
        </template>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-for="(action, idx) in options.actions"
          :key="idx"
          text
          class="font-weight-bold"
          :color="action.color"
          @click="action.action">
          <v-icon
            v-if="!action.iconRight"
            class="mr-1">
            {{action.icon}}
          </v-icon>
          <span>{{action.label}}</span>
          <v-icon
            v-if="action.iconRight"
            class="ml-1">
            {{action.icon}}
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  `,

    data: () => ({
        showDialog: false,

        options: undefined
    }),

    mounted() {
        ConfirmDialog.show = this.show
        ConfirmDialog.close = this.close
    },

    computed: {
        messageArray () {
            if (this.options) {
                return this.options.message.split('\n')
            }
            return []
        }
    },

    methods: {
        defaultSettings() {
            return {
                width: 400,
                message: '',
                actions: [{
                    icon: 'mdi-close',
                    iconRight: false,
                    label: '취소',
                    color: 'red',
                    action: this.close
                }]
            }
        },

        show(options) {
            const opt = this.defaultSettings()
            this.copyObjectProps(options, opt)
            this.options = opt
            this.showDialog = true
        },

        close() {
            this.showDialog = false
            this.options = undefined
        },

        copyObjectProps(src, dest) {
            for (const key of Object.keys(src)) {
                const value = src[key]
                if (!Array.isArray(value) && typeof value === 'object' && value !== null && Object.prototype.hasOwnProperty.call(dest, key)) {
                    this.copyObjectProps(value, dest[key])
                } else {
                    dest[key] = src[key]
                }
            }
        }
    }
}
