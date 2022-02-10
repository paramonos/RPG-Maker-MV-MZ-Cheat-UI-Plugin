//=============================================================================
// main.js
//=============================================================================

PluginManager.setup($plugins);

// import cheat js file
PluginManager._path= 'js/plugins/';
PluginManager.loadScript('../../cheat/import.js');

window.onload = function() {
    SceneManager.run(Scene_Boot);
};
