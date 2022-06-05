import {Alert} from './AlertHelper.js'
import {KeyValueStorage} from './KeyValueStorage.js'

export class GeneralCheat {
    // static saveCheatSettings () {
    //     const saveData = {
    //         godMode: {
    //             actorIds: this.getGodModeOnActorIds()
    //         },
    //     }
    //
    //     localStorage.setItem('cheat.settings.general', JSON.stringify(saveData))
    // }
    //
    // static initializeCheatSettings () {
    //     if (this.initialized) {
    //         return
    //     }
    //
    //     // load save data from localStorage
    //     let saveData = localStorage.getItem('cheat.settings.general')
    //
    //     if (!saveData) {
    //         this.initialized = true
    //         return
    //     }
    //
    //     saveData = JSON.parse(saveData)
    //     console.log(saveData)
    //
    //     // godMode
    //     if (saveData.godMode) {
    //         const godModeData = saveData.godMode
    //         // actors
    //         if (godModeData.actorIds) {
    //             for (const actorId of godModeData.actorIds) {
    //                 console.log('god mode on', actorId, $gameActors.actor(actorId))
    //                 this.godModeOn($gameActors.actor(actorId))
    //             }
    //         }
    //     }
    //
    //     this.initialized = true
    // }

    // will be replaced from main component
    static toggleCheatModal (componentName = null) {

    }

    static openCheatModal (componentName = null) {

    }

    static toggleNoClip (notify = false) {
        $gamePlayer._through = !$gamePlayer._through

        if (notify) {
            Alert.success(`No clip toggled: ${$gamePlayer._through}`)
        }
    }

    static getGodModeOnActorIds () {
        if (!this.godModeMap) {
            return []
        }

        const ret = []

        for (const actor of this.godModeMap.keys()) {
            const data = this.godModeMap.get(actor)

            if (data.godMode) {
                ret.push(actor._actorId)
            }
        }

        return ret
    }

    static getGodModeData (actor) {
        if (!this.godModeMap) {
            this.godModeMap = new Map()
        }

        if (this.godModeMap.has(actor)) {
            return this.godModeMap.get(actor)
        }

        const defaultData = {
            godMode: false,
            gainHp: null,
            setHp: null,
            gainMp: null,
            setMp: null,
            gainTp: null,
            setTp: null,
            paySkillCost: null,
            godModeInterval: null
        }

        this.godModeMap.set(actor, defaultData)

        return defaultData
    }

    static godModeOn (actor) {
        if (actor instanceof Game_Actor && !this.isGodMode(actor)) {
            const godModeData = this.getGodModeData(actor)
            godModeData.godMode = true

            actor.gainHP_bkup = actor.gainHp
            actor.gainHp = function(value) {
                value = actor.mhp
                actor.gainHP_bkup(value)
            }

            actor.setHp_bkup = actor.setHp
            actor.setHp = function(hp) {
                hp = actor.mhp
                actor.setHp_bkup(hp)
            }

            actor.gainMp_bkup = actor.gainMp
            actor.gainMp = function (value) {
                value = actor.mmp
                actor.gainMp_bkup(value)
            }

            actor.setMp_bkup = actor.setMp
            actor.setMp = function(mp) {
                mp = actor.mmp
                actor.setMp_bkup(mp)
            }

            actor.gainTp_bkup = actor.gainTp
            actor.gainTp = function (value) {
                value = actor.maxTp()
                actor.gainTp_bkup(value)
            }

            actor.setTp_bkup = actor.setTp
            actor.setTp = function(tp) {
                tp = actor.maxTp()
                actor.setTp_bkup(tp)
            }

            actor.paySkillCost_bkup = actor.paySkillCost
            actor.paySkillCost = function (skill) {
                // do nothing
            }

            godModeData.godModeInterval = setInterval(function() {
                actor.gainHp(actor.mhp)
                actor.gainMp(actor.mmp)
                actor.gainTp(actor.maxTp())
            }, 1000)

            this.saveCheatSettings()
        }
    }

    static godModeOff (actor) {
        if (actor instanceof Game_Actor && this.isGodMode(actor)) {
            const godModeData = this.getGodModeData(actor)
            godModeData.godMode = false

            clearInterval(godModeData.godModeInterval)
            godModeData.godModeInterval = null

            // actor.godMode field remains in save file, but backup methods aren't
            //
            if (actor.gainHP_bkup) {
                actor.gainHp = actor.gainHP_bkup
                actor.setHp = actor.setHp_bkup
                actor.gainMp = actor.gainMp_bkup
                actor.setMp = actor.setMp_bkup
                actor.gainTp = actor.gainTp_bkup
                actor.setTp = actor.setTp_bkup
                actor.paySkillCost = actor.paySkillCost_bkup
            }

            this.saveCheatSettings()
        }
    }

    static toggleGodMode (actor) {
        if (this.isGodMode(actor)) {
            this.godModeOff(actor)
        } else {
            this.godModeOn(actor)
        }
    }

    static isGodMode (actor) {
        return this.getGodModeData(actor).godMode
    }
}

export class GameSpeedCheat {
    static sceneOptions () {
        if (!this._sceneOptions) {
            this._sceneOptions = {
                all () {
                    return true
                },

                battle () {
                    return SceneManager._scene instanceof Scene_Battle
                }
            }
        }

        return this._sceneOptions
    }

    static getRate () {
        if (this.rate) {
            return this.rate
        }

        return 1
    }

    static getSceneOption () {
        if (this.sceneOption) {
            return this.sceneOption
        }

        return this.sceneOptions().all
    }

    static removeApplied () {
        if (this.isApplied) {
            SceneManager.updateScene = this.origin_SceneManager_updateScene
            Scene_Map.prototype.update = this.origin_Scene_Map_update
            Spriteset_Base.prototype.update = this.origin_Spriteset_Base_update
            this.isApplied = false
        }
    }

    static setGameSpeed (rate, sceneOption) {
        // backup original functions
        if (!this.origin_SceneManager_updateScene) {
            this.origin_SceneManager_updateScene = SceneManager.updateScene
        }

        if (!this.origin_Scene_Map_update) {
            this.origin_Scene_Map_update = Scene_Map.prototype.update
        }

        if (!this.origin_Spriteset_Base_update) {
            this.origin_Spriteset_Base_update = Spriteset_Base.prototype.update
        }

        if (!sceneOption) {
            sceneOption = GameSpeedCheat.sceneOptions().all
        }

        this.rate = rate
        this.sceneOption = sceneOption

        // remove previously modified functions
        this.removeApplied()

        // if rate is 1, do not modify functions
        if (Math.abs(rate - 1.0) < Number.EPSILON) {
            return
        }

        // updateScene triggers event such as key inpuy, mouse input ...
        // It occurs double click.
        const SceneManager_updateScene = this.origin_SceneManager_updateScene
        let currentUpdateSceneRate = 0
        SceneManager.updateScene = function () {
            if (!sceneOption()) {
                SceneManager_updateScene.call(this)
                return
            }

            currentUpdateSceneRate += rate
            const currStep = Math.floor(currentUpdateSceneRate)
            currentUpdateSceneRate -= currStep

            if (currStep > 0) {
                // update original frame
                SceneManager_updateScene.call(this)

                // update duplicated frames
                for (let i = 0; i < currStep - 1; ++i) {
                    SceneManager.updateInputData()
                    SceneManager.changeScene()
                    SceneManager_updateScene.call(this)
                }
            }
        }

        this.isApplied = true
    }

    static __writeSettings (rate, sceneOption) {
        const options = GameSpeedCheat.sceneOptions()
        const sceneOptionKey = Object.keys(GameSpeedCheat.sceneOptions()).find(key => options[key] === sceneOption)

        const storage = new KeyValueStorage('./www/cheat-settings/gameSpeed.json')

        storage.setItem('data', JSON.stringify({ rate: rate, sceneOption: sceneOptionKey }))
    }

    static __readSettings () {
        const storage = new KeyValueStorage('./www/cheat-settings/gameSpeed.json')

        const json = storage.getItem('data')

        if (!json) {
            return
        }

        const data = JSON.parse(json)

        GameSpeedCheat.setGameSpeed(data.rate, GameSpeedCheat.sceneOptions()[data.sceneOption])
    }
}

export class SpeedCheat {
    // static fixed = null // WARN: declaring static variable occurs error in nw.js (why?)

    static isFixed () {
        return !!SpeedCheat.fixed
    }

    static setFixSpeedInterval (speed) {
        if (SpeedCheat.isFixed()) {
            SpeedCheat.removeFixSpeedInterval()
        }

        SpeedCheat.fixed = setInterval(() => {
            SpeedCheat.__setSpeed(speed, false)
        }, 1000)
    }

    static removeFixSpeedInterval () {
        if (SpeedCheat.isFixed()) {
            clearInterval(SpeedCheat.fixed)
            SpeedCheat.fixed = undefined
        }
    }

    static __setSpeed(speed) {
        $gamePlayer.setMoveSpeed(speed)
    }

    static setSpeed (speed, fixed = false) {
        SpeedCheat.__setSpeed(speed)

        if (fixed) {
            SpeedCheat.setFixSpeedInterval(speed)
        } else {
            SpeedCheat.removeFixSpeedInterval()
        }
    }

    static __writeSettings (speed, fixed) {
        const storage = new KeyValueStorage('./www/cheat-settings/speed.json')

        storage.setItem('data', JSON.stringify({ speed: speed, fixed: fixed }))
    }

    static __readSettings () {
        const storage = new KeyValueStorage('./www/cheat-settings/speed.json')

        const json = storage.getItem('data')

        if (!json) {
            return
        }

        const data = JSON.parse(json)

        if (data.fixed) {
            SpeedCheat.setSpeed(data.speed, data.fixed)
        }
    }
}

export class SceneCheat {
    static gotoTitle () {
        SceneManager.goto(Scene_Title)
    }

    static toggleSaveScene () {
        if (SceneManager._scene.constructor === Scene_Save) {
            SceneManager.pop()
        } else if (SceneManager._scene.constructor === Scene_Load) {
            SceneManager.goto(Scene_Save)
        } else {
            SceneManager.push(Scene_Save)
        }
    }

    static toggleLoadScene () {
        if (SceneManager._scene.constructor === Scene_Load) {
            SceneManager.pop()
        } else if (SceneManager._scene.constructor === Scene_Save) {
            SceneManager.goto(Scene_Load)
        } else {
            SceneManager.push(Scene_Load)
        }
    }

    static quickSave (slot = 1) {
        $gameSystem.onBeforeSave()
        DataManager.saveGame(slot)

        Alert.success(`Game saved to slot ${slot}`)
    }

    static quickLoad (slot = 1) {
        DataManager.loadGame(slot)
        SceneManager.goto(Scene_Map)

        Alert.success(`Game loaded from slot ${slot}`)
    }
}

export class BattleCheat {
    static recover (member) {
        member.setHp(member.mhp)
        member.setMp(member.mmp)
        member.setTp(member.maxTp())
    }

    static recoverAllEnemy () {
        for (const member of $gameTroop.members()) {
            this.recover(member)
        }

        Alert.success('Recovery all enemies')
    }

    static recoverAllParty () {
        for (const member of $gameParty.members()) {
            this.recover(member)
        }

        Alert.success('Recovery all party members')
    }

    static fillTpAllEnemy () {
        for (const member of $gameTroop.members()) {
            member.setTp(member.maxTp())
        }

        Alert.success('Fill TP all enemies')
    }

    static fillTpAllParty () {
        for (const member of $gameParty.members()) {
            member.setTp(member.maxTp())
        }

        Alert.success('Fill TP all party members')
    }

    static changeAllEnemyHealth (newHp) {
        for (const member of $gameTroop.members()) {
            member.setHp(newHp)
        }

        Alert.success(`HP ${newHp} for all enemies`)
    }

    static changeAllPartyHealth (newHp) {
        for (const member of $gameParty.members()) {
            member.setHp(newHp)
        }

        Alert.success(`HP ${newHp} for all party members`)
    }

    static canExecuteBattleEndProcess () {
        return SceneManager._scene && SceneManager._scene.constructor === Scene_Battle && BattleManager._phase !== 'battleEnd'
    }

    static encounterBattle () {
        $gamePlayer._encounterCount = 0
    }

    static victory () {
        if (this.canExecuteBattleEndProcess()) {
            $gameTroop.members().forEach(enemy => {
                enemy.addNewState(enemy.deathStateId())
            })
            BattleManager.processVictory()
            Alert.success('Forced victory from battle!')
            return true
        }
        return false
    }

    static defeat () {
        if (this.canExecuteBattleEndProcess()) {
            $gameParty.members().forEach(actor => {
                actor.addNewState(actor.deathStateId())
            })
            BattleManager.processDefeat()
            Alert.success('Forced defeat from battle...')
            return true
        }
        return false
    }

    static escape () {
        if (this.canExecuteBattleEndProcess()) {
            $gameParty.performEscape()
            SoundManager.playEscape()
            BattleManager._escaped = true
            BattleManager.processEscape()
            Alert.success('Forced escape from battle')
            return true
        }
        return false
    }

    static abort () {
        if (this.canExecuteBattleEndProcess()) {
            $gameParty.performEscape()
            SoundManager.playEscape()
            BattleManager._escaped = true
            BattleManager.processAbort()
            Alert.success('Forced abort battle')
            return true
        }
        return false
    }

    static toggleDisableRandomEncounter () {
        // change $gamePlayer.canEncounter function
        // if canEncounter is false, $gamePlayer.updateEncounterCount() do not decreases $gamePlayer._encounterCount
        if (this.isDisableRandomEncounter()) {
            if (this.canEncounter_bkup) {
                $gamePlayer.canEncounter = this.canEncounter_bkup
            }

        } else {
            this.canEncounter_bkup = $gamePlayer.canEncounter

            $gamePlayer.canEncounter = function () {
                return false
            }
        }

        this.disableRandomEncounter = !this.isDisableRandomEncounter()
    }

    static isDisableRandomEncounter () {
        return !!this.disableRandomEncounter && this.disableRandomEncounter
    }
}

export class MessageCheat {
    static initialize () {
        this.skip = false

        // Skip message display animation
        // It seems to be executed whenever each character is output in the message window
        const _Window_Message_updateShowFast = Window_Message.prototype.updateShowFast;
        Window_Message.prototype.updateShowFast = function () {
            _Window_Message_updateShowFast.call(this);
            // 여기에 skip 키 입력 체크
            if (MessageCheat.skip) {
                this._showFast = true;
                this._pauseSkip = true;
            }
        };

        // Skip waiting for input after displaying text
        // It seems to always run every few ms
        const _Window_Message_updateInput = Window_Message.prototype.updateInput;
        Window_Message.prototype.updateInput = function () {
            const ret = _Window_Message_updateInput.call(this);

            if(this.pause && MessageCheat.skip){
                this.pause = false;

                if (!this._textState) {
                    this.terminateMessage();
                }
                return true;
            }

            return ret;
        };

        // Accelerates the scrolling message speed
        const Window_ScrollText_scrollSpeed = Window_ScrollText.prototype.scrollSpeed;
        Window_ScrollText.prototype.scrollSpeed = function () {
            let ret = Window_ScrollText_scrollSpeed.call(this);

            if (MessageCheat.skip){ // 여기에서 skip 키 입력 체크
                ret *= 100;
            }

            return ret;
        };


        // --------------------------- 배틀 로그 관련
        // Accelerates the battle log output speed
        const _Window_BattleLog_messageSpeed = Window_BattleLog.prototype.messageSpeed;
        Window_BattleLog.prototype.messageSpeed = function () {
            let ret = _Window_BattleLog_messageSpeed.call(this);

            if (MessageCheat.skip){ // 여기에서 skip 키 입력 체크
                ret = 1;
            }

            return ret;
        };
    }

    static startSkip (gameSpeed) {
        if (gameSpeed === 1) {
            this.gameSpeedBackup = null
        } else {
            this.gameSpeedBackup = {
                rate: GameSpeedCheat.getRate(),
                sceneOption: GameSpeedCheat.getSceneOption()
            }

            GameSpeedCheat.setGameSpeed(gameSpeed, GameSpeedCheat.sceneOptions().all)
        }

        this.skip = true
    }

    static stopSkip () {
        if (this.gameSpeedBackup) {
            // restore game speed
            GameSpeedCheat.setGameSpeed(this.gameSpeedBackup.rate, this.gameSpeedBackup.sceneOption)
            this.gameSpeedBackup = null
        }

        this.skip = false
    }
}


async function multiRetryAction (action, intervalTimeout, maxTryCount) {
    let finished = false
    let tryCount = 0

    const interval = setInterval(() => {
        try {
            ++tryCount
            action()
            finished = true
        } catch (e) {
            console.log(e)
            if (tryCount < maxTryCount) {
                // try again
                return
            }
        }

        clearInterval(interval)
    }, intervalTimeout)
}

function initialize () {
    const intervalTimeout = 500
    const maxTryCount = 100

    const initializeActions = [
        SpeedCheat.__readSettings,
        GameSpeedCheat.__readSettings
    ]

    const intervals = initializeActions.forEach(action => multiRetryAction(action, intervalTimeout, maxTryCount))
}

initialize()
