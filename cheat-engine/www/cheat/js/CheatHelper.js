import {Alert} from './AlertHelper.js'

export class GeneralCheat {
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

            actor.gainHP_bkup = actor.gainHp;
            actor.gainHp = function(value) {
                value = actor.mhp;
                actor.gainHP_bkup(value);
            };

            actor.setHp_bkup = actor.setHp;
            actor.setHp = function(hp) {
                hp = actor.mhp;
                actor.setHp_bkup(hp);
            };

            actor.gainMp_bkup = actor.gainMp;
            actor.gainMp = function (value) {
                value = actor.mmp;
                actor.gainMp_bkup(value);
            };

            actor.setMp_bkup = actor.setMp;
            actor.setMp = function(mp) {
                mp = actor.mmp;
                actor.setMp_bkup(mp);
            };

            actor.gainTp_bkup = actor.gainTp;
            actor.gainTp = function (value) {
                value = actor.maxTp();
                actor.gainTp_bkup(value);
            };

            actor.setTp_bkup = actor.setTp;
            actor.setTp = function(tp) {
                tp = actor.maxTp();
                actor.setTp_bkup(tp);
            };

            actor.paySkillCost_bkup = actor.paySkillCost;
            actor.paySkillCost = function (skill) {
                // do nothing
            };

            godModeData.godModeInterval = setInterval(function() {
                actor.gainHp(actor.mhp);
                actor.gainMp(actor.mmp);
                actor.gainTp(actor.maxTp());
            }, 1000);
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
            SpeedCheat.setSpeed(speed, false)
        }, 1000)
    }

    static removeFixSpeedInterval () {
        if (SpeedCheat.isFixed()) {
            clearInterval(SpeedCheat.fixed)
            SpeedCheat.fixed = undefined
        }
    }

    static setSpeed (speed, fixed = false) {
        $gamePlayer.setMoveSpeed(speed)

        if (fixed) {
            SpeedCheat.setFixSpeedInterval(speed)
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
        DataManager.loadGame(slot);
        SceneManager.goto(Scene_Map);

        Alert.success(`Game loaded from slot ${slot}`)
    }
}

export class BattleCheat {
    static recover (member) {
        member.setHp(member.mhp)
        member.setMp(member.mmp)
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
}
