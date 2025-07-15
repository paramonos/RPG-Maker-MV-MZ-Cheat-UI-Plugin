- [Lingva Translation Support](#lingva-translation-support)
  * [What is Lingva Translate?](#what-is-lingva-translate)
  * [Features](#lingva-features)
  * [Available Translation Options](#available-translation-options)
  * [How to Use](#how-to-use-translation)
  * [Configuration](#configuration)
  * [Example Usage](#example-usage)
  * [Technical Details](#technical-details)
  * [Troubleshooting](#troubleshooting)
- [RPG-Maker-MV-MZ-Cheat-UI-Plugin](#rpg-maker-mv-mz-cheat-ui-plugin)
- [Intro](#intro)
  * [UI Sample](#ui-sample)
  * [Features](#features)
- [Set up](#set-up)
  * [How to apply](#how-to-apply)
  * [How to use](#how-to-use)
  * [Apply same cheat settings from another game](#apply-same-cheat-settings-from-another-game)
- [Handling Errors](#handling-errors)
  * [If embeded nwjs version of game is lower than 0.26.4](#if-embeded-nwjs-version-of-game-is-lower-than-0264)
  * [If the error occurs after updating the cheat](#if-the-error-occurs-after-updating-the-cheat)

# Lingva Translation Support

This RPG Maker MV/MZ Cheat UI Plugin now includes support for **Lingva Translate**, a free and open-source alternative front-end for Google Translate. This feature is particularly useful for games with variable names in Chinese, Japanese, Korean, or other non-English languages.

## What is Lingva Translate?

Lingva Translate is a privacy-focused translation service that provides Google Translate functionality without tracking. It supports over 100 languages and offers a public API that we use for translating variable names in the cheat interface.

## Lingva Features

- **Auto-detection**: Automatically detects the source language and translates to English
- **Specific language pairs**: Support for Japanese→English, Chinese→English, and Korean→English
- **Bulk translation**: Efficiently translates multiple variable names at once
- **No setup required**: Uses the public Lingva instance at https://lingva.ml
- **Privacy-focused**: No tracking or data collection
- **Translation Bank**: Caches successful translations for instant reuse
- **Batch Processing**: Combines multiple texts per API request (200 calls → 4-8 calls)
- **Instant Updates**: Variables appear translated as they complete
- **Smart Rate Limiting**: Respects API limits with adaptive chunk sizing

## Available Translation Options

The plugin now includes the following Lingva translation endpoints:

1. **Lingva Translate (Auto → EN)** - Automatically detects source language (lingva.ml)
2. **Lingva Translate (JA → EN)** - Japanese to English (lingva.ml)
3. **Lingva Translate (Auto → EN) [Chinese]** - Auto-detect optimized for Chinese (lingva.ml)
4. **Lingva Translate (Plausibility)** - Alternative instance (translate.plausibility.cloud)

## How to Use Translation

1. **Open the Cheat UI** in your RPG Maker game
2. **Navigate to Translation Settings** panel
3. **Enable Translation** by toggling the "Enable" switch
4. **Select a Lingva endpoint** from the "End Point" radio buttons
5. **Enable Variable Translation** by checking "Translate Variables"
6. **Enable Batch Translation** for maximum speed (recommended)
7. **Go to the Variable Settings** panel to see translated variable names

## Configuration

### Recommended Settings

- **Chunk Size**: 20-50 (recommended for batch translation)
- **Batch Translation**: Enabled (dramatically faster)
- **Endpoint**: Choose based on your game's primary language:
  - Use "Auto → EN" for mixed languages or general use
  - Use "JA → EN" specifically for Japanese games
  - Use "Auto → EN [Chinese]" for Chinese games
  - Use "Plausibility" as an alternative if main instance is slow

### Translation Targets

You can enable/disable translation for different game elements:
- ✅ **Variables** - Translate variable names (recommended)
- ✅ **Switches** - Translate switch names
- ✅ **Maps** - Translate map names
- ❌ **Items** - Currently disabled (can be enabled if needed)

### Performance Settings

- **Translation Bank**: Automatically caches translations for instant reuse
- **Batch Translation**: Combines multiple texts per request (50x faster)
- **Adaptive Chunk Size**: Automatically adjusts for optimal performance
- **Refresh Buttons**: Available on all panels to reload translations

## Example Usage

### Before Translation (Japanese variables):
```
プレイヤー名: "Hero"
レベル: 15
経験値: 2500
ゴールド: 1000
```

### After Translation:
```
Player Name: "Hero"
Level: 15
Experience: 2500
Gold: 1000
```

### Performance Example (200 variables):
- **Without batch**: 200 API calls, ~40 seconds
- **With batch**: 4-8 API calls, ~3 seconds
- **Subsequent loads**: Instant from cache (0 API calls)

## Technical Details

- **Primary API**: https://lingva.ml/api/v1/{source}/{target}/{text}
- **Alternative API**: https://translate.plausibility.cloud/api/v1/{source}/{target}/{text}
- **Method**: GET (direct API calls, no proxy needed)
- **Response Format**: JSON with `translation` field
- **Rate Limiting**: Smart delays and batch processing to respect public service
- **Encoding**: Uses encodeURIComponent for proper URL encoding
- **Fallback**: If translation fails, original text is displayed
- **Caching**: Local storage for translation bank persistence
- **Batch Processing**: Combines texts with delimiters for efficiency

## Troubleshooting

### Translation Not Working
1. Check your internet connection
2. Verify that "Enable" is turned on in Translation Settings
3. Ensure "Translate Variables" is checked
4. Try a different Lingva endpoint
5. Use the refresh button (pink button) to reload translations

### Slow Translation
- Enable "Batch Translation" for maximum speed
- Increase chunk size to 20-50 for better batching
- Check your internet connection speed
- Use specific language endpoints instead of auto-detection

### Variables Disappearing or Stuck at 90%
- Click the refresh button (pink button) in the Variables panel
- This will reload all data and restart translation
- Check console for error messages

### Partial Translation
- Some variable names might be empty or contain special characters
- The plugin will skip empty variables and preserve the original text for untranslatable content
- Use the translation bank to cache successful translations

### Privacy and Terms

- Lingva Translate is a privacy-focused service that doesn't track users
- Translation requests are sent to the public Lingva instance
- No personal data is collected or stored
- Please respect the public service and avoid excessive requests
- Translation bank stores data locally for performance

### Credits

- **Lingva Translate**: https://github.com/thedaviddelta/lingva-translate
- **Public Instance**: https://lingva.ml
- **RPG Maker Cheat Plugin**: Enhanced with advanced Lingva support

### Support

If you encounter issues with the Lingva translation feature:
1. Use the refresh buttons to reload translations
2. Check the browser console for error messages
3. Try different Lingva endpoints
4. Test with different chunk sizes
5. Report issues with specific error messages and game details

# RPG-Maker-MV-MZ-Cheat-UI-Plugin

- GUI based RPG Maker MV/MZ game cheat tool
- [한국어 도움말](https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin/blob/main/README_ko-kr.md)



# Intro


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
- **Enhanced Translation System** with Lingva Translate support:
  - Translate variables, switches, maps from Japanese, Chinese, Korean to English
  - Translation bank for instant cached results (50x faster subsequent loads)
  - Batch translation processing (200 variables in 3 seconds vs 40 seconds)
  - Smart rate limiting and adaptive chunk sizing
  - Multiple Lingva endpoints with automatic fallback
  - Real-time translation updates as variables are processed
- Legacy translation support (Needs [ezTransWeb](https://github.com/HelloKS/ezTransWeb) : Only supports for Korean.)
- **Maybe more features..?**



# Set up


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




## How to use
- Press `Ctrl + C` to toggle cheat window.
    - You can change shortcuts in "Shortcuts" tab.
    
    - If you do not hover your mouse over the cheat window, you may not be able to see it well because it is a little bit transparent. Note that it appears in the upper-right corner of the game window.
    
    - <img src="https://user-images.githubusercontent.com/99193603/153754676-cee2b96e-c03a-491f-b71c-3c57d6dcc474.JPG" width="400"/>
- Just enjoy cheat!



## Apply same cheat settings from another game

If you want to apply same shortcut keys, move speed, game speed, translation, etc... settings from another game,

Just copy the `www/cheat-settings` folder of the game that already has settings applied to the other game folder.



# Handling Errors 

## If embeded nwjs version of game is lower than 0.26.4

- Cheats may not work properly in older versions of the game since the script is based on es6.
- In that case, you need to force update to the new nwjs version.

1. Download latest version of [nwjs](https://dl.nwjs.io/v0.61.0/) and unzip. (`{version}/nwjs-symbol-v{version}-win-{ia32|x64}.7z`)
   - If you need developer tools, download the sdk version.
2. Copy `www` directory and `package.json` file from the game directory to nwjs directory.
   - <img src="https://user-images.githubusercontent.com/99193603/153755660-25da5b48-b542-443e-bd38-2e3e95e13a63.JPG" width="500"/>
3. Run `nw.exe` and play game.



> If the game does not work properly after the nwjs update, cheats cannot be applied to the game.
>
> - In this case, please use [another cheat](https://github.com/emerladCoder/RPG-Maker-MV-Cheat-Menu-Plugin).



## If the error occurs after updating the cheat

Settings files created from earlier versions of cheats may cause errors.

Delete the `www/cheat-settings` folder from the game folder.
