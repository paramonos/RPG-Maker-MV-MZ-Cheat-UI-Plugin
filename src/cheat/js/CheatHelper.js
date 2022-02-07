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

        // TODO: notify
    }

    static quickLoad (slot = 1) {
        DataManager.loadGame(slot);
        SceneManager.goto(Scene_Map);

        // TODO: notify
    }
}
