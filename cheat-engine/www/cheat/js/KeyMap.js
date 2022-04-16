// WARN: 필요 없는지 확인
// import CheatKeyMap from '../settings/CheatKeyMap.js'
// import { CHAR_TO_CODE_LOWERCASE } from "./KeyCodes.js";
//
// class Key {
//     constructor(text) {
//         const keys = text.toLowerCase().split(' ')
//         if (keys.length === 0) {
//             throw Error('키맵이 없음.')
//         }
//
//         this.code = null
//         this.alt = false
//         this.ctrl = false
//         this.shift = false
//         this.meta = false
//
//         for (let key of keys) {
//             key = key.trim()
//
//             switch (key) {
//                 case 'ctrl':
//                     this.ctrl = true
//                     break
//                 case 'alt':
//                     this.alt = true
//                     break
//                 case 'shift':
//                     this.shift = true
//                     break
//                 case 'meta':
//                     this.meta = true
//                     break
//                 default:
//                     if (this.code !== null) {
//                         throw Error('여러 일반키를 조합할 수 없습니다.')
//                     }
//                     if (!Object.hasOwnProperty.call(CHAR_TO_CODE_LOWERCASE, key)) {
//                         throw Error('알 수 없는 키입니다. : ' + key)
//                     }
//                     this.code = CHAR_TO_CODE_LOWERCASE[key]
//             }
//         }
//     }
//
//     check (e) {
//         return this.ctrl === e.ctrlKey
//             && this.alt === e.altKey
//             && this.shift === e.shiftKey
//             && this.meta === e.metaKey
//             && this.code === e.keyCode
//     }
// }
//
// export const KEY_SETTINGS = {}
//
// function parseToKeyObject(src, dest) {
//     for (const key of Object.keys(src)) {
//         const value = src[key]
//
//         if (typeof value === 'object') {
//             dest[key] = {}
//             parseToKeyObject(value, dest[key])
//             continue
//         }
//
//         dest[key] = new Key(value)
//     }
// }
//
// parseToKeyObject(CheatKeyMap, KEY_SETTINGS)
