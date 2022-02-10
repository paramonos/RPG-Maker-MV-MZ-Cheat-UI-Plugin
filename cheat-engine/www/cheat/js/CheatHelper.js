import {Alert} from './AlertHelper.js'

export class GeneralCheat {
    // will be replaced from main component
    static toggleCheatModal () {

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
