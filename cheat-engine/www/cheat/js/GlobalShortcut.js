import {Key} from './KeyCodes.js'
import {Alert} from './AlertHelper.js'
import {cloneObject} from './Tools.js'
import {SpeedCheat, SceneCheat, GeneralCheat, BattleCheat} from './CheatHelper.js'
import {ShortcutMap} from './ShortcutHelper.js'

// default shortcut settings
const defaultShortcutSettings = {
    toggleCheatModal: {
        shortcut: 'ctrl c'
    },

    toggleCheatModalToSaveLocationComponent: {
        shortcut: 'ctrl m'
    },

    quickSave: {
        shortcut: 'ctrl s',
        param: {
            slot: 1 // 1-indexed
        }
    },

    quickLoad: {
        shortcut: 'ctrl q',
        param: {
            slot: 1 // 1-indexed
        }
    },

    openSaveScene: {
        shortcut: 'ctrl ['
    },

    openLoadScene: {
        shortcut: 'ctrl ]'
    },

    gotoTitle: {
        shortcut: 'ctrl t'
    },

    toggleNoClip: {
        shortcut: 'ctrl w'
    },

    enemyWound: {
        shortcut: 'alt 1'
    },

    enemyRecovery: {
        shortcut: 'alt 0'
    },

    partyWound: {
        shortcut: 'alt 2'
    },

    partyRecovery: {
        shortcut: 'alt 9'
    },

    setSpeed: {
        shortcut: '', // no keymap
        param: {
            speed: 5
        }
    },

    openDevTool: {
        shortcut: 'f12'
    }
}

function isInValueInRange(value, lowerBound, upperBound) {
    try {
        value = Number(value)
    } catch (err) {
        return 'Value must be a number'
    }

    if (isNaN(value) || !Number.isInteger(value)) {
        return 'Value must be a number'
    }

    if (value < lowerBound || upperBound < value) {
        return `Value must be between [${lowerBound}, ${upperBound}]`
    }

    return false
}

// immutable
const shortcutConfig = {
    toggleCheatModal: {
        name: 'Toggle cheat window',
        desc: 'Key mapping required',
        necessary: true,
        action (param) {
            GeneralCheat.toggleCheatModal()
        }
    },

    toggleCheatModalToSaveLocationComponent: {
        name: 'Toggle cheat window with "Save Locations" tab',
        desc: '',
        action (param) {
            GeneralCheat.toggleCheatModal('save-recall-panel')
        }
    },

    quickSave: {
        name: 'Quick save',
        desc: 'Quick save to certain slot',
        param: {
            slot: {
                name: 'Slot',
                desc: 'Slot for saved',
                isInvalidValue (value) {
                    return isInValueInRange(value, 1, DataManager.maxSavefiles())
                },
                convertValue (value) {
                    return Number(value)
                }
            }
        },
        action (param) {
            SceneCheat.quickSave(param.slot)
        }
    },

    quickLoad: {
        name: 'Quick load',
        desc: 'Quick load from certain slot',
        param: {
            slot: {
                name: 'Slot',
                desc: 'Slot for loaded',
                isInvalidValue (value) {
                    return isInValueInRange(value, 1, DataManager.maxSavefiles())
                },
                convertValue (value) {
                    return Number(value)
                }
            }
        },
        action (param) {
            SceneCheat.quickLoad(param.slot)
        }
    },

    openSaveScene: {
        name: 'Open save scene',
        desc: '',
        action (param) {
            SceneCheat.toggleSaveScene()
        }
    },

    openLoadScene: {
        name: 'Open load scene',
        desc: '',
        action (param) {
            SceneCheat.toggleLoadScene()
        }
    },

    gotoTitle: {
        name: 'Go to title',
        desc: '',
        action (param) {
            SceneCheat.gotoTitle()
        }
    },

    toggleNoClip: {
        name: 'Toggle no clip',
        desc: '',
        action (param) {
            GeneralCheat.toggleNoClip(true)
        }
    },

    enemyWound: {
        name: 'Set enemies HP to 1',
        desc: '',
        action (param) {
            BattleCheat.changeAllEnemyHealth(1)
        }
    },

    enemyRecovery: {
        name: 'Recover all enemies',
        desc: 'Fill HP/MP to max',
        action (param) {
            BattleCheat.recoverAllEnemy()
        }
    },

    partyWound: {
        name: 'Set party HP to 1',
        desc: '',
        action (param) {
            BattleCheat.changeAllPartyHealth(1)
        }
    },

    partyRecovery: {
        name: 'Recover all party',
        desc: 'Fill HP/MP to max',
        action (param) {
            BattleCheat.recoverAllParty()
        }
    },

    setSpeed: {
        name: 'Set speed',
        desc: 'Set speed to certain value',
        param: {
            speed: {
                name: 'Speed',
                desc: 'Speed for set',
                isInvalidValue (value) {
                    return isInValueInRange(value, 1, 10)
                },
                convertValue (value) {
                    return Number(value)
                }
            }
        },
        action (param) {
            SpeedCheat.removeFixSpeedInterval()
            SpeedCheat.setSpeed(param.speed)
        }
    },

    openDevTool: {
        name: 'Open dev tool',
        desc: 'Open Chromium dev tool',
        action (param) {
            if (Utils.isNwjs()) {
                require('nw.gui').Window.get().showDevTools()
            }
        }
    }
}

class ShortcutConfig {
    constructor (id, config) {
        this.id = id

        const fields = ['name', 'desc', 'necessary', 'param', 'action']

        for (const field of fields) {
            this[field] = config[field]
        }

        if (!this.necessary) this.necessary = false
        if (!this.param) this.param = {}
        if (!this.action) this.action = (param) => {}
    }

    getAction (shortcutSetting) {
        return () => {
            this.action(shortcutSetting.param)
        }
    }
}

/**
 * parse string written keymap to Key object
 *
 * @param src: string written keymap
 * @param dest: object which Key objects be stored
 */
function parseStringToKeyObject(src) {
    const ret = cloneObject(src)

    for (const key of Object.keys(src)) {
        ret[key].shortcut = Key.fromString(src[key].shortcut)
    }

    return ret
}


function parseKeyObjectToString(src) {
    const ret = cloneObject(src)

    for (const key of Object.keys(src)) {
        ret[key].shortcut = src[key].shortcut.asString()
    }

    return ret
}


class GlobalShortcut {
    constructor () {
        this.initialize()
    }

    initialize () {
        console.log('__global shortcut initialized')

        this.shortcutSettingsFile = './www/cheat-settings/shortcuts.json'

        // initialize shortcut settings
        this.shortcutSettings = {}
        this.readShortcutSettings()

        // initialize shortcut config
        this.shortcutConfig = {}
        this.initializeShortcutConfig()

        // migrate if settings file is old version
        this.migrateShortcutSettings()

        // initialize shortcut map
        this.shortcutMap = new ShortcutMap()
        this.initializeShortcutMap()
    }

    initializeShortcutConfig () {
        this.shortcutConfig = {}

        for (const key of Object.keys(shortcutConfig)) {
            this.shortcutConfig[key] = new ShortcutConfig(key, shortcutConfig[key])
        }
    }


    migrateShortcutSettings () {
        let defaultSettings = null
        const assignedKeys = new Set(Object.values(this.shortcutSettings).map(setting => setting.shortcut.asString()))

        for (const shortcutConfig of Object.values(this.shortcutConfig)) {
            if (!Object.hasOwnProperty.call(this.shortcutSettings, shortcutConfig.id)) {
                // initialize default settings if not initialized
                if (!defaultSettings) {
                    defaultSettings = parseStringToKeyObject(defaultShortcutSettings)
                }

                // handle conflict keys
                const defaultSetting = defaultSettings[shortcutConfig.id]
                if (!defaultSetting.shortcut.isEmpty() && assignedKeys.has(defaultSetting.shortcut.asString())) {
                    console.warn(`key conflicts while migrating : ${shortcutConfig.name} - ${defaultSetting.shortcut.asString()}`)
                    defaultSetting.shortcut = Key.createEmpty()
                }

                assignedKeys.add(defaultSetting.shortcut.asString())

                this.shortcutSettings[shortcutConfig.id] = defaultSettings[shortcutConfig.id]
            }
        }

        // if settings migrated, save to file
        if (defaultSettings) {
            console.warn('__settings migrated')
            this.writeShortcutSettings()
        }
    }

    initializeShortcutMap () {
        for (const shortcutConfig of Object.values(this.shortcutConfig)) {
            const shortcutSetting = this.shortcutSettings[shortcutConfig.id]

            this.shortcutMap.register(shortcutSetting.shortcut, shortcutConfig, shortcutConfig.getAction(shortcutSetting))
        }
    }

    runKeyEvent (e) {
        if (this.shortcutMap.run(Key.fromEvent(e))) {
            e.preventDefault()
            e.stopImmediatePropagation()
            e.stopPropagation()
        }
    }

    /**
     * read raw shortcut settings
     *
     */
    readRawShortcutSettings () {
        // if nwjs environment, read shortcut settings from file
        if (Utils.isNwjs()) {
            const fs = require('fs')
            const path = require('path')

            try {
                // read settings file
                return JSON.parse(fs.readFileSync(this.shortcutSettingsFile, 'utf-8'))
            } catch (err) {
                try {
                    // create default settings file
                    this.writeRawShortcutSettings(defaultShortcutSettings)

                    // read created file
                    return JSON.parse(fs.readFileSync(this.shortcutSettingsFile, 'utf-8'))
                } catch (fileWriteErr) {
                    Alert.warn('Can\'t initialize shortcut settings file. Use internal data instead.\n(You can use cheat plugin anyway)', err)
                    return defaultShortcutSettings
                }
            }
        }

        // if using browser, read default shortcut settings
        console.warn('[cheat plugin warn] Use default settings')
        return defaultShortcutSettings
    }

    /**
     * read and parse shortcut settings
     */
    readShortcutSettings () {
        const rawSettings = this.readRawShortcutSettings()
        this.shortcutSettings = {}

        try {
            this.shortcutSettings = parseStringToKeyObject(rawSettings)
        } catch (err) {
            Alert.warn('Can\'t parse shortcut settings. Use default settings instead.\n(You can use cheat plugin anyway)', err)

            try {
                this.shortcutSettings = parseStringToKeyObject(defaultShortcutSettings)
            } catch (err) {
                Alert.error('Can\'t parse shortcut settings. Cheat plugin will not work properly', err)
            }
        }
    }

    writeRawShortcutSettings (shortcutSettings) {
        if (Utils.isNwjs()) {
            const fs = require('fs')
            const path = require('path')

            // remove previous settings file
            try {
                fs.unlinkSync(this.shortcutSettingsFile)
            } catch (e) {
            }

            // create parent directory if not exists
            const parentDir = path.dirname(this.shortcutSettingsFile)

            if (!fs.existsSync(parentDir)) {
                fs.mkdirSync(parentDir, {recursive: true})
            }

            // create file
            fs.writeFileSync(this.shortcutSettingsFile, JSON.stringify(shortcutSettings, null, 2))
        }
    }

    writeShortcutSettings () {
        this.writeRawShortcutSettings(parseKeyObjectToString(this.shortcutSettings))
    }

    restoreDefaultSettings () {
        if (Utils.isNwjs()) {
            // remove settings file
            try {
                require('fs').unlinkSync(this.shortcutSettingsFile)
            } catch (e) {
            }

            this.initialize()
        }
    }

    getSettings (shortcutId) {
        return this.shortcutSettings[shortcutId]
    }

    getConfig (shortcutId) {
        return this.shortcutConfig[shortcutId]
    }

    getParamConfig (shortcutId, paramId) {
        return this.getConfig(shortcutId).param[paramId]
    }

    getParam (shortcutId, paramId) {
        return this.getSettings(shortcutId).param[paramId]
    }

    getShortcut (shortcutId) {
        return this.getSettings(shortcutId).shortcut
    }

    setShortcut (shortcutId, newKey) {
        // not need to change shortcut
        const prevKey = this.getShortcut(shortcutId)
        if (prevKey.equals(newKey)) {
            return
        }

        const existingValue = this.shortcutMap.getValue(newKey)
        if (existingValue) {
            throw Error(`Conflict with existing shortcut : [${newKey.asDisplayString()}] ${existingValue.name}`)
        }

        // remove prev key binding if prev key exists
        this.shortcutMap.remove(prevKey)

        // bind key
        const currValue = this.getConfig(shortcutId)
        const currSettings = this.getSettings(shortcutId)
        this.shortcutMap.register(newKey, currValue, currValue.getAction(currSettings))

        // change settings
        currSettings.shortcut = newKey

        // write changed settings
        this.writeShortcutSettings()
    }

    setParam (shortcutId, paramId, newValue) {
        const paramConfig = this.getParamConfig(shortcutId, paramId)

        const invalidMsg = paramConfig.isInvalidValue(newValue)

        if (invalidMsg) {
            throw Error(invalidMsg)
        }

        this.getSettings(shortcutId).param[paramId] = paramConfig.convertValue(newValue)

        this.writeShortcutSettings()
    }
}

export const GLOBAL_SHORTCUT = new GlobalShortcut()
