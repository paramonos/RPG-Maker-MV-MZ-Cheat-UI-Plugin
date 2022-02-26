// RPG MV API : https://kinoar.github.io/rmmv-doc-web/index.html

// import 'https://cdn.jsdelivr.net/npm/vue@2.x/dist/vue.js'
// import 'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.js'

import '../libs/vue.js'
import '../libs/vuetify.js'

import MainComponent from '../MainComponent.js'

// initialize vue
new Vue({
    vuetify: new Vuetify(),
    components: { MainComponent }
}).$mount('#app')
