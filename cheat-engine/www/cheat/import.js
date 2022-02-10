function __addScript(type, src) {
    var cheatScript = document.createElement('script');
    cheatScript.type = type;
    cheatScript.src = src

    document.body.appendChild(cheatScript)
}

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
__addScript('module', 'cheat/setup.js')
