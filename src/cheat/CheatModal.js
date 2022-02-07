import GeneralPanel from './panels/GeneralPanel.js'
import HealthSettingPanel from './panels/HealthSettingPanel.js'
import StatsSettingPanel from './panels/StatsSettingPanel.js'
import ItemSettingPanel from './panels/ItemSettingPanel.js'
import WeaponSettingPanel from './panels/WeaponSettingPanel.js'
import ArmorSettingPanel from './panels/ArmorSettingPanel.js'
import VariableSettingPanel from './panels/VariableSettingPanel.js'
import SwitchSettingPanel from './panels/SwitchSettingPanel.js'
import SaveRecallPanel from './panels/SaveRecallPanel.js'
import TeleportPanel from './panels/TeleportPanel.js'

export default {
    name: 'CheatModal',

    components: {
        GeneralPanel,
        HealthSettingPanel,
        StatsSettingPanel,
        ItemSettingPanel,
        WeaponSettingPanel,
        ArmorSettingPanel,
        VariableSettingPanel,
        SwitchSettingPanel,
        SaveRecallPanel,
        TeleportPanel
    },

    template: `
<v-card 
    dark
    width="700" 
    height="400"
    style="z-index: 999 !important;">
    <v-row class="fill-height ma-0 pa-0">
        <div
            :style="'width: ' + navWidth + 'px;'"
            class="fill-height d-inline pa-2 overflow-y-auto hide-scrollbar">
            <v-treeview
                :active.sync="navTreeModel"
                transition
                return-object
                open-all
                dense
                :items="navTreeItems"
                activatable
                item-key="name"
                open-on-click
                @update:active="onNavTreeUpdate">
            </v-treeview>
        </div>
        <v-divider vertical></v-divider>
        <div
            :style="'width: calc(100% - ' + navWidth + 'px - 1px);'"
            class="fill-height d-inline pa-2 overflow-y-auto hide-scrollbar">
            <keep-alive>
                <component :is="currentComponentName"></component>
            </keep-alive>
        </div>
    </v-row>
</v-card>
    `,

    model: {
        prop: 'currentComponentName',
        event: 'change'
    },

    props: {
        currentComponentName: {
            type: String
        }
    },

    data () {
      return {
          navWidth: 200,

          navTreeModel: undefined,

          navTreeItems: [
              {
                  name: 'General',
                  component: 'general-panel'
              },
              {
                  name: 'Shortcuts',
                  component: ''
              },
              {
                  name: 'Enemy/Party Health',
                  component: 'health-setting-panel'
              },
              {
                  name: 'Stats/Level',
                  component: 'stats-setting-panel'
              },
              {
                  name: 'Items',
                  children: [
                      {
                          name: 'Item',
                          component: 'item-setting-panel'
                      },
                      {
                          name: 'Weapon',
                          component: 'weapon-setting-panel'
                      },
                      {
                          name: 'Armor',
                          component: 'armor-setting-panel'
                      }
                  ]
              },
              {
                  name: 'Clear States',
                  component: ''
              },
              {
                  name: 'Variables',
                  component: 'variable-setting-panel'
              },
              {
                  name: 'Switches',
                  component: 'switch-setting-panel'
              },
              {
                  name: 'Save Locations',
                  component: 'save-recall-panel'
              },
              {
                  name: 'Teleport',
                  component: 'teleport-panel'
              }
          ]
      }
    },

    computed: {
        componentNameToNavItem () {
            const ret = {}
            this.iterateLeaf(this.navTreeItems, item => {
                ret[item.component] = item
            })
            return ret
        }
    },

    mounted () {
        let navItem = this.componentNameToNavItem[this.currentComponentName]

        if (!navItem) {
            navItem = Object.values(this.componentNameToNavItem)[0]
            this.$emit('change', navItem.component)
        }
        this.navTreeModel = [navItem]
    },

    methods: {
        onNavTreeUpdate (data) {
            if (data && data.length === 1) {
                this.$emit('change', data[0].component)
            }
        },

        iterateLeaf (node, leafFunc) {
            if (Array.isArray(node)) {
                for (const item of node) {
                    this.iterateLeaf(item, leafFunc)
                }
            } else if (Object.hasOwnProperty.call(node, 'children')) {
                this.iterateLeaf(node.children, leafFunc)
            } else {
                leafFunc(node)
            }
        }
    }
}
