# RPG-Maker-MV-MZ-Cheat-UI-Plugin
- GUI based RPG Maker MV/MZ game cheat tool
- [한국어 도움말](https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin/blob/main/README_ko-kr.md)


## UI Sample
<p float="left">
  <img src="https://user-images.githubusercontent.com/99193603/153754676-cee2b96e-c03a-491f-b71c-3c57d6dcc474.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754683-4e7a09a5-2d31-436d-8546-7a5d658eb282.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754687-732648c8-3483-42bb-9634-dd22d674dfed.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754692-38e04218-7726-4827-a45b-95485de51a3c.JPG" width="500"/>
  <img src="https://user-images.githubusercontent.com/99193603/153754696-0cbc76f9-99fa-47a7-a0d0-6510a2f76e01.JPG" width="500"/>
</p>


## Features
- Good usability based on GUI.
- Supports both RPG MV/MZ games.
- Editing stats, gold, speed, items, variables, switches ...
- Accelerate game speed (x0.1 ~ x10)
- Supports no clip mode, god mode.
- Disable random encounter.
- Force battle victory/defeat/escape/abort.
- Supports useful customizable shortcuts.
    - Toggle save/load window, quick save/load, goto title, toggle no clip, editing party/enemy HP ...
- Easy to find items, switched, variables, etc by searching text.
- Save location and recall, teleport cheats.
- Supports developers tool.
- Translate variables, switches, maps. (Needs [ezTransWeb](https://github.com/HelloKS/ezTransWeb) : Only supports for Korean.)
- **Maybe more features..?**


## How to apply 
1. Unpack game if needed.
2. Download latest version of `rpg-{mv|mz}-cheat-{version}.zip` from **[releases](https://github.com/paramonos/RPG-Maker-MV-Cheat-UI-Plugin/releases)** and unzip.
3. Copy unziped directories to `{game directory}/www` (for MZ, just copy to `{game_directory}`).
    - It will overwrite `www/js/main.js` file, so it is strongly recommended to make a backup file.
    - Example for RPG MV
      <br/><img src="https://user-images.githubusercontent.com/99193603/153755213-b07f1abb-9c99-4157-857c-2f3a81e4a82a.JPG" width="500"/>
      <br/><img src="https://user-images.githubusercontent.com/99193603/155840463-ae64385f-60c1-478c-b266-8e9580a878e6.png" width="500"/>
    - Example for RPG MZ
      <br/><img src="https://user-images.githubusercontent.com/99193603/155840462-028771ef-580c-4b45-969a-85f26329fef0.png" width="500"/>


### If embeded nwjs version of game is lower than 0.26.4
- Cheats may not work properly in older versions of the game since the script is based on es6.
- In that case, you need to force update to the new nwjs version.

1. Download latest version of [nwjs](https://dl.nwjs.io/v0.61.0/) and unzip. (`{version}/nwjs-symbol-v{version}-win-{ia32|x64}.7z`)
    - If you need developer tools, download the sdk version.
2. Copy `www` directory and `package.json` file from the game directory to nwjs directory.
    - <img src="https://user-images.githubusercontent.com/99193603/153755660-25da5b48-b542-443e-bd38-2e3e95e13a63.JPG" width="500"/>
3. Run `nw.exe` and play game.


## How to use
- Press `Ctrl + C` to toggle cheat window.
    - You can change shortcuts in "Shortcuts" tab.
    
    - If you do not hover your mouse over the cheat window, you may not be able to see it well because it is a little bit transparent. Note that it appears in the upper-right corner of the game window.
    
    - <img src="https://user-images.githubusercontent.com/99193603/153754676-cee2b96e-c03a-491f-b71c-3c57d6dcc474.JPG" width="400"/>
- Just enjoy cheat!
