function validateNwjsVersion () {
    if (!(typeof require === 'function' && typeof process === 'object')) {
        return true
    }

    const nwjsVersion = process.versions['node-webkit']
    const minRequiredNwjsVersion = '0.26.4'

    if (nwjsVersion < minRequiredNwjsVersion) {
        let msg = ''
        let docsUrl = ''

        if (/^ko\b/.test(navigator.language)) {
            msg = `게임의 Node Webkit 버전이 치트를 사용하기에 너무 낮습니다.
  - 현재 버전=${nwjsVersion}, 최소 요구 버전=${minRequiredNwjsVersion}
치트가 제대로 동작하지 않을 수 있습니다.

해결 방법을 보려면 "확인"을 눌러주세요.`
            docsUrl = 'https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin/blob/main/README_ko-kr.md#%EA%B2%8C%EC%9E%84%EC%9D%98-nwjs-%EB%B2%84%EC%A0%84%EC%9D%B4-0264-%EB%B3%B4%EB%8B%A4-%EB%82%AE%EC%9D%80-%EA%B2%BD%EC%9A%B0-%EC%98%9B%EB%82%A0-%EB%B2%84%EC%A0%84%EC%9D%98-mv-%EA%B2%8C%EC%9E%84%EC%9D%B8-%EA%B2%BD%EC%9A%B0'
        } else {
            msg = `Node Webkit version of game is too low to using cheat
  - version=${nwjsVersion}, minimum required version=${minRequiredNwjsVersion}
Cheat may not work properly.

Click "OK" button to see the solution.
`
            docsUrl = 'https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin#if-embeded-nwjs-version-of-game-is-lower-than-0264'
        }

        if (window.confirm(msg)) {
            window.open(docsUrl, '_blank');
        }
        return false
    }

    return true
}

function applyCheat () {
    function __addScript(type, src) {
        var cheatScript = document.createElement('script');
        cheatScript.type = type;
        cheatScript.src = src

        document.body.appendChild(cheatScript)
    }

    function __loadJavaScript(src) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = false;
        script._url = src;
        document.body.appendChild(script);
    }

    // load libs
    __loadJavaScript('cheat/libs/axios.min.js')

    // add <div id='app'> node for vue
    const appDiv = document.createElement('div')

    appDiv.id = 'app'
    appDiv.innerHTML = `
<v-app
    app
    dark
    style="background-color: black;">
    <v-main
        dark>
        <main-component></main-component>
    </v-main>
</v-app>
`

    document.body.appendChild(appDiv)

    // import in head
    document.head.innerHTML += `
<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@mdi/font@6.x/css/materialdesignicons.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css" rel="stylesheet">
<link href="cheat/css/main.css" rel="stylesheet">
`

    // import in body
    // __loadJavaScript('cheat/init/setup.js')
    __addScript('module', 'cheat/init/setup.js')
}

validateNwjsVersion()
applyCheat()
