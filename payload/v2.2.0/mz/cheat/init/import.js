var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
(function () {
    function e() { var e; var t = window.process; return t == null || (e = t.versions) == null ? void 0 : e["node-webkit"]; }
    function t(e) { return e.split(".").map(function (e) { return Number.parseInt(e, 10) || 0; }); }
    function n(e, n) { var r = t(e), i = t(n), a = Math.max(r.length, i.length); for (var e_1 = 0; e_1 < a; e_1 += 1) {
        var o, s;
        var t_1 = ((o = r[e_1]) == null ? 0 : o) - ((s = i[e_1]) == null ? 0 : s);
        if (t_1 !== 0)
            return t_1 < 0;
    } return !1; }
    function r(e) { return window.require(e); }
    function i() { return r("fs"); }
    function a() { return r("path"); }
    function o(e) { window.__mvMzCheatGuard = e; }
    function s(e) {
        "@babel/helpers - typeof";
        return s = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function (e) { return typeof e; } : function (e) { return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e; }, s(e);
    }
    function c(e, t) { if (s(e) != "object" || !e)
        return e; var n = e[Symbol.toPrimitive]; if (n !== void 0) {
        var r = n.call(e, t || "default");
        if (s(r) != "object")
            return r;
        throw TypeError("@@toPrimitive must return a primitive value.");
    } return (t === "string" ? String : Number)(e); }
    function l(e) { var t = c(e, "string"); return s(t) == "symbol" ? t : t + ""; }
    function u(e, t, n) { return (t = l(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e; }
    function d(e, t) { var n = Object.keys(e); if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter(function (t) { return Object.getOwnPropertyDescriptor(e, t).enumerable; })), n.push.apply(n, r);
    } return n; }
    function f(e) { for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t] == null ? {} : arguments[t];
        t % 2 ? d(Object(n), !0).forEach(function (t) { u(e, t, n[t]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : d(Object(n)).forEach(function (t) { Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t)); });
    } return e; }
    var p = "./www/cheat-settings", m = "".concat(p, "/update");
    "".concat(m);
    var h = "".concat(m, "/previous"), g = "cheat-version-description.json", _ = "cheat", ee = "".concat(_, "/init/import.js");
    function te() { return i().existsSync("./www/".concat(ee)) ? "./www" : "."; }
    function v(e) { i().existsSync(e) || (v(a().dirname(e)), i().mkdirSync(e)); }
    function ne(e, t) { v(a().dirname(t)), i().copyFileSync(e, t); }
    function y(e, t) {
        if (t === void 0) { t = ""; }
        return i().existsSync(e) ? i().readdirSync(e).reduce(function (n, r) { var a = "".concat(t).concat(r); return i().statSync("".concat(e, "/").concat(r)).isDirectory() ? __spreadArray(__spreadArray([], __read(n), false), __read(y("".concat(e, "/").concat(r), "".concat(a, "/"))), false) : __spreadArray(__spreadArray([], __read(n), false), [a], false); }, []) : [];
    }
    var b = "".concat(m, "/update-record.json"), x = "utf-8", re = ["swapping", "installed", "starting", "rolledBack"], ie = /^v\d+\.\d+\.\d+$/, ae = ["".concat(_, "/cheat.js"), "".concat(_, "/init/import.js"), g];
    function oe(e) { return !!e && re.some(function (t) { return t === e.phase; }) && typeof e.version == "string" && typeof e.previousVersion == "string"; }
    function S() { if (!i().existsSync(b))
        return null; try {
        var e_2 = JSON.parse(i().readFileSync(b, x));
        return oe(e_2) ? e_2 : null;
    }
    catch (e) {
        return null;
    } }
    function C(e) { v(m), i().writeFileSync(b, JSON.stringify(e)); }
    function w() { var e = te(); y(h).forEach(function (t) { return ne("".concat(h, "/").concat(t), "".concat(e, "/").concat(t)); }); }
    function se() { var e = S(); e && e.phase !== "rolledBack" && (e.phase === "installed" ? C(f(f({}, e), {}, { phase: "starting" })) : (w(), C(f(f({}, e), {}, { phase: "rolledBack", isAnnounced: !1 })))); }
    function T(e) { if (!i().existsSync(e))
        return null; try {
        var t_2 = JSON.parse(i().readFileSync(e, x)), n_1 = t_2 == null ? void 0 : t_2.version;
        return typeof n_1 == "string" && ie.test(n_1) ? n_1 : null;
    }
    catch (e) {
        return null;
    } }
    function ce() { return ae.every(function (e) { return i().existsSync("".concat(h, "/").concat(e)); }); }
    function E() { var e = S(); if (e && e.phase !== "rolledBack")
        return null; var t = T("".concat(te(), "/").concat(g)), r = T("".concat(h, "/").concat(g)); return !t || !r || !n(r.slice(1), t.slice(1)) || !ce() ? null : { version: t, previousVersion: r }; }
    function le(e) { var t = E(); if (!t || t.version !== e.version || t.previousVersion !== e.previousVersion)
        throw Error("go-back target changed: ".concat(e.version, " -> ").concat(e.previousVersion)); C({ phase: "swapping", version: e.version, previousVersion: e.previousVersion }), w(), C({ phase: "rolledBack", version: e.version, previousVersion: e.previousVersion, isAnnounced: !1 }); }
    var ue = ["cheat/cheat.js", "cheat/init/import.js"];
    function de() { return { records: [], droppedCount: 0 }; }
    function D(e) { return ue.some(function (t) { return e.indexOf(t) >= 0; }); }
    function fe(e) { return e.replace(/"[^"]*"/g, "\"…\"").replace(/\d+(?:\.\d+)?/g, "#"); }
    function pe(e) {
        var t = e.split("\n").filter(function (e) { return D(e); });
        if (t.length === 0)
            return "";
        var n = t[0].trim(), r = n.indexOf("cheat/"), i = /^at\s+([^\s(]+)\s+\(/.exec(n), a = n.slice(r).replace(/\)$/, "");
        return i ? "".concat(i[1], "@").concat(a) : a;
    }
    function O(e) { return [e.place.gate, e.place.where, e.name, fe(e.message), pe(e.stack) || e.location].join("|"); }
    function k(e, t) { for (var n_2 = 0; n_2 < e.length; n_2 += 1)
        if (e[n_2].signature === t)
            return n_2; return -1; }
    function me(e) { var t = e.records.reduce(function (e, t) { return t.lastAt < e.lastAt ? t : e; }); return { records: e.records.filter(function (e) { return e !== t; }), droppedCount: e.droppedCount + 1 }; }
    function he(e, t, n) { var r = O(t), i = k(e.records, r); if (i >= 0)
        return { records: e.records.map(function (e, r) { return r === i ? f(f({}, e), {}, { count: e.count + 1, lastAt: n, context: t.context || e.context }) : e; }), droppedCount: e.droppedCount }; var a = e.records.length >= 50 ? me(e) : e, o = f(f({}, t), {}, { signature: r, count: 1, firstAt: n, lastAt: n, notifiedAt: null }); return { records: a.records.concat([o]), droppedCount: a.droppedCount }; }
    function ge(e, t) { var n = k(e.records, t); return n >= 0 ? e.records[n] : null; }
    function _e(e, t) { return e.notifiedAt === null || t - e.notifiedAt >= 6e4; }
    function ve(e, t, n) { return { records: e.records.map(function (e) { return e.signature === t ? f(f({}, e), {}, { notifiedAt: n }) : e; }), droppedCount: e.droppedCount }; }
    function A(e, t) { return e.records.filter(function (e) { return e.place.gate === t; }); }
    var ye = 50, be = 12, j = "unknown";
    function xe(e, t) { return t.filter(function (e) { return e.prefix.length > 0; }).sort(function (e, t) { return t.prefix.length - e.prefix.length; }).reduce(function (e, t) { return e.split(t.prefix).join(t.replacement); }, e); }
    function Se(e) { var t = e.replace(/\\/g, "/"); return [e, t, e.replace(/\//g, "\\"), "file:///".concat(t.replace(/^\//, "")), encodeURI(t)]; }
    function Ce(e) { return e.replace(/[\\/]+$/, ""); }
    function we(e) { var t = [], n = function (e, n) { e && Se(Ce(e)).forEach(function (e) { t.push({ prefix: e, replacement: n }); }); }; return n(e.page, "<game>"), n(e.game, "<game>"), n(e.home, "~"), t; }
    function M(e) { return new Date(e).toISOString(); }
    function Te(e) { return e.length > 500 ? "".concat(e.slice(0, 500), "... (").concat(e.length, " chars)") : e; }
    function Ee(e) {
        var t = e.place, n = t.where ? "".concat(t.gate, " ").concat(t.where) : t.gate, r = e.location ? " (".concat(e.location, ")") : "", i = e.count > 1 ? " x".concat(e.count, ", ").concat(M(e.firstAt), " ~ ").concat(M(e.lastAt)) : ", ".concat(M(e.firstAt)), a = "- [".concat(n, "] ").concat(e.name, ": ").concat(Te(e.message)).concat(r).concat(i), o = e.context ? ["    context: ".concat(e.context)] : [], s = e.stack.split("\n").map(function (e) { return e.trim(); }).filter(function (e) { return e.indexOf("at ") === 0; }).slice(0, be).map(function (e) { return "    ".concat(e); });
        return [a].concat(o, s);
    }
    function De(e) { var t = e.droppedCount > 0 ? ["- ... ".concat(e.droppedCount, " older kinds dropped")] : []; if (e.records.length === 0)
        return ["Errors: none"].concat(t); var n = e.records.slice().sort(function (e, t) { return t.lastAt - e.lastAt; }), r = n.slice(0, ye), i = r.reduce(function (e, t) { return e.concat(Ee(t)); }, ["Errors (".concat(e.records.length, " kinds):")]), a = n.length - r.length; return i.concat(a > 0 ? ["- ... ".concat(a, " more kinds")] : [], t); }
    function Oe(e) { return e.stages.length === 0 ? "Stages: none" : "Stages: ".concat(e.stages.map(function (e) { return e.isFailed ? e.essential ? "".concat(e.name, " FAILED (essential)") : "".concat(e.name, " FAILED") : "".concat(e.name, " ok"); }).join(", ")); }
    function ke(e) { if (!e.update)
        return "Update: none"; var _a = e.update, t = _a.phase, n = _a.version, r = _a.previousVersion; return t === "starting" ? "Update: ".concat(n, " is starting (rolls back to ").concat(r, " on next launch if this start fails)") : "Update: rolled back from ".concat(n, " to ").concat(r); }
    function Ae(e) { return e ? e.stage ? "Result: ".concat(e.kind, " (stage: ").concat(e.stage, ")") : "Result: ".concat(e.kind) : "Result: ok"; }
    function je(e, t, n, r) {
        var i = e.runtimeTooOld ? " (below required ".concat(e.runtimeTooOld.minimum, ")") : "";
        return xe(["Cheat report", Ae(t), "Game: ".concat(n.game || j), "Loader: ".concat(e.loaderVersion), "Cheat: ".concat(e.cheatVersion || j), "Engine: ".concat(n.engine || j), "NW.js: ".concat(n.nwjsVersion || "none").concat(i), "Chromium: ".concat(n.chromiumVersion || j), "OS: ".concat(n.platform || j), "Language: ".concat(e.language || j), "Files: cheat.js ".concat(e.script).concat(e.isStylesheetMissing ? ", cheat.css missing" : ""), "Evaluation: ".concat(e.evaluation), Oe(e), ke(e), "Now: ".concat(n.context || j)].concat(De(e.errors), ["Plugins (".concat(n.plugins.length, "): ").concat(n.plugins.join(", ") || "none")]).join("\n"), r);
    }
    var Me = "cheat.language", N = "".concat(p, "/kv-storage.json");
    function P() { return window; }
    function F(e, t) { try {
        return e();
    }
    catch (e) {
        return t;
    } }
    function I() { var _a = P(), e = _a.nw, t = _a.require; return e || (t ? t("nw.gui") : null); }
    function Ne(e) { var t = /Chrome\/([\d.]+)/.exec(e); return t ? t[1] : ""; }
    function Pe() { var e = P().Utils; return !e || !e.RPGMAKER_NAME ? "" : e.RPGMAKER_VERSION ? "".concat(e.RPGMAKER_NAME, " ").concat(e.RPGMAKER_VERSION) : e.RPGMAKER_NAME; }
    function Fe() { var e = P().$plugins; return !e || typeof e.filter != "function" ? [] : e.filter(function (e) { return !!e && e.status === !0; }).map(function (e) { return String(e.name); }); }
    function Ie() { var e = P().$dataSystem; return e && typeof e.gameTitle == "string" ? e.gameTitle : ""; }
    function Le() { var e = P().process; return e && e.platform ? "".concat(e.platform, " ").concat(e.arch || "").trim() : ""; }
    function Re(e) { var t = P().process; return { game: F(Ie, ""), engine: F(Pe, ""), nwjsVersion: F(function () { return t && t.versions && t.versions["node-webkit"] || ""; }, ""), chromiumVersion: F(function () { return Ne(navigator.userAgent); }, ""), platform: F(Le, ""), plugins: F(Fe, []), context: e }; }
    function ze() { return location.href.split(/[?#]/)[0].replace(/\/[^/]*$/, ""); }
    function Be() { var e = P().process, t = e && e.env; return t && (t.USERPROFILE || t.HOME) || ""; }
    function Ve() { var e = P().process; return e && e.cwd ? e.cwd() : ""; }
    function He() { return we({ page: F(ze, ""), game: F(Ve, ""), home: F(Be, "") }); }
    function Ue(e) { var t = e("fs"); if (!t.existsSync(N))
        return ""; var n = JSON.parse(t.readFileSync(N, "utf-8"))[Me]; return typeof n == "string" ? n : ""; }
    function We() { var e = P().require; return F(function () { return e ? Ue(e) : localStorage.getItem("cheat.language") || ""; }, ""); }
    function Ge(e) { var t = F(function () { var e = I(); return e && e.Shell ? e.Shell : null; }, null); t ? t.openExternal(e) : window.open(e, "_blank"); }
    function Ke(e) { var t = I(); if (!t || !t.Clipboard)
        throw Error("NW.js clipboard is not available."); t.Clipboard.get().set(e, "text"); }
    var qe = ["ko", "en", "ja", "zh"], Je = { ko: { "title.scriptMissing": "치트 파일이 없습니다", "title.scriptUnreadable": "이 게임에서는 치트를 읽지 못합니다", "title.startFailed": "치트를 시작하지 못했습니다", "title.stalled": "치트가 시작을 마치지 못했습니다", "title.partial": "일부 기능을 켜지 못했습니다", "title.runtimeTooOld": "게임의 NW.js 버전이 낮습니다", "summary.scriptMissing": "cheat 폴더의 파일이 빠져서 치트를 시작하지 못했습니다. 치트를 다시 넣어 주세요.", "summary.scriptUnreadable": "게임에 든 NW.js 가 너무 옛것이라 치트 파일을 읽지 못했습니다. 해결 방법을 보고 NW.js 를 바꿔 주세요.", "summary.startFailed": "준비하다 오류가 나서 치트 창을 열 수 없습니다. 게임을 다시 켜도 그대로면 「자세히 보기」의 내용을 복사해 제보해 주세요.", "summary.stalled": "준비가 중간에 멈춰서 치트 창을 열 수 없습니다. 게임을 다시 켜도 그대로면 「자세히 보기」의 내용을 복사해 제보해 주세요.", "summary.partial": "치트 창은 열리지만 몇 가지 기능이 동작하지 않을 수 있습니다. 어떤 기능인지는 「자세히 보기」에 있습니다.", "summary.runtimeTooOld": "지금은 {version} 이고 치트에는 {minimum} 이상이 필요합니다. 치트가 제대로 동작하지 않을 수 있습니다.", "update.rollbackNext": "게임을 다시 켜면 이전 버전 {previous} 로 돌아갑니다.", "hint.reopen": "닫아도 {key} 를 누르면 다시 볼 수 있습니다.", "button.details": "자세히 보기", "button.hideDetails": "접기", "button.close": "닫기", "button.copy": "복사", "button.guide": "해결 방법 보기", "copy.done": "암호화해서 복사했습니다. 개발자만 열어 볼 수 있으니 제보할 곳에 그대로 붙여 주세요.", "copy.doneUnlocked": "복사했습니다. 이 환경에서는 암호화하지 못해 위 내용이 그대로 들어갑니다. 붙이기 전에 살펴 주세요.", "copy.failed": "복사하지 못했습니다. 글을 골라 직접 복사해 주세요.", "details.label": "제보할 내용입니다", "button.goBack": "{previous} 로 되돌리기", "button.goBackConfirm": "되돌리기", "button.cancel": "취소", "goBack.confirm": "{previous} 로 되돌립니다. 게임을 다시 켜면 적용되고, 자동 업데이트는 {version} 을 다시 받지 않습니다.", "goBack.done": "되돌렸습니다. 게임을 다시 켜면 {previous} 로 시작합니다.", "goBack.failed": "되돌리지 못했습니다. 게임을 다시 켠 뒤 한 번 더 해 보고, 그래도 안 되면 치트를 다시 넣어 주세요." }, en: { "title.scriptMissing": "Cheat files are missing", "title.scriptUnreadable": "This game can't read the cheat", "title.startFailed": "The cheat couldn't start", "title.stalled": "The cheat didn't finish starting", "title.partial": "Some features didn't turn on", "title.runtimeTooOld": "The game's NW.js is too old", "summary.scriptMissing": "Files in the cheat folder are missing, so the cheat couldn't start. Install the cheat again.", "summary.scriptUnreadable": "The game's NW.js is too old to read the cheat files. See the fix and update NW.js.", "summary.startFailed": "Something went wrong while it was getting ready, so the cheat window can't open. If restarting the game doesn't help, copy the text under Show details and report it.", "summary.stalled": "Getting ready stopped partway, so the cheat window can't open. If restarting the game doesn't help, copy the text under Show details and report it.", "summary.partial": "The cheat window opens, but a few features may not work. Show details lists which ones.", "summary.runtimeTooOld": "The game has {version}, and the cheat needs {minimum} or newer. The cheat may not work properly.", "update.rollbackNext": "Restart the game to go back to the previous version, {previous}.", "hint.reopen": "Closed it? Press {key} to see it again.", "button.details": "Show details", "button.hideDetails": "Hide details", "button.close": "Close", "button.copy": "Copy", "button.guide": "See the fix", "copy.done": "Copied and encrypted so only the developer can read it. Paste it as is where you report the problem.", "copy.doneUnlocked": "Copied. It couldn't be encrypted here, so the text above goes in as is. Look it over before you paste it.", "copy.failed": "Couldn't copy. Select the text and copy it yourself.", "details.label": "What gets reported", "button.goBack": "Go back to {previous}", "button.goBackConfirm": "Go back", "button.cancel": "Cancel", "goBack.confirm": "This goes back to {previous}. It takes effect when you restart the game, and automatic updates won't install {version} again.", "goBack.done": "Done. Restart the game to start with {previous}.", "goBack.failed": "Couldn't go back. Restart the game and try again. If that doesn't help, install the cheat again." }, ja: { "title.scriptMissing": "チートのファイルがありません", "title.scriptUnreadable": "このゲームではチートを読み込めません", "title.startFailed": "チートを起動できませんでした", "title.stalled": "チートの起動が終わりませんでした", "title.partial": "一部の機能をオンにできませんでした", "title.runtimeTooOld": "ゲームの NW.js のバージョンが古いです", "summary.scriptMissing": "cheat フォルダのファイルが足りないため、チートを起動できませんでした。チートを入れ直してください。", "summary.scriptUnreadable": "ゲームに入っている NW.js が古すぎて、チートのファイルを読み込めませんでした。解決方法を見て NW.js を新しくしてください。", "summary.startFailed": "準備中にエラーが起きたため、チートメニューを開けません。ゲームを再起動しても直らない場合は、「詳しく見る」の内容をコピーして報告してください。", "summary.stalled": "準備が途中で止まったため、チートメニューを開けません。ゲームを再起動しても直らない場合は、「詳しく見る」の内容をコピーして報告してください。", "summary.partial": "チートメニューは開けますが、いくつかの機能が動かないかもしれません。どの機能かは「詳しく見る」にあります。", "summary.runtimeTooOld": "今は {version} で、チートには {minimum} 以上が必要です。チートが正しく動かないことがあります。", "update.rollbackNext": "ゲームを再起動すると、前のバージョン {previous} に戻ります。", "hint.reopen": "閉じても {key} を押すともう一度表示できます。", "button.details": "詳しく見る", "button.hideDetails": "詳細を隠す", "button.close": "閉じる", "button.copy": "コピー", "button.guide": "解決方法を見る", "copy.done": "暗号化してコピーしました。開発者だけが読めるので、報告先にそのまま貼り付けてください。", "copy.doneUnlocked": "コピーしました。この環境では暗号化できないため、上の内容がそのまま入ります。貼り付ける前に確認してください。", "copy.failed": "コピーできませんでした。文字を選んで直接コピーしてください。", "details.label": "報告する内容です", "button.goBack": "{previous} に戻す", "button.goBackConfirm": "戻す", "button.cancel": "キャンセル", "goBack.confirm": "{previous} に戻します。ゲームを再起動すると反映され、自動アップデートで {version} がまた入ることはありません。", "goBack.done": "戻しました。ゲームを再起動すると {previous} で始まります。", "goBack.failed": "戻せませんでした。ゲームを再起動してもう一度試し、それでもだめならチートを入れ直してください。" }, zh: { "title.scriptMissing": "作弊文件缺失", "title.scriptUnreadable": "这个游戏读不了作弊文件", "title.startFailed": "作弊没能启动", "title.stalled": "作弊没有启动完成", "title.partial": "部分功能没能开启", "title.runtimeTooOld": "游戏的 NW.js 版本太低", "summary.scriptMissing": "cheat 文件夹里的文件不全，作弊没能启动。请重新安装作弊。", "summary.scriptUnreadable": "游戏自带的 NW.js 太旧，读不了作弊文件。请查看解决方法并更新 NW.js。", "summary.startFailed": "准备时出错了，作弊窗口打不开。如果重启游戏后还是这样，请复制「查看详情」里的内容并反馈。", "summary.stalled": "准备中途停住了，作弊窗口打不开。如果重启游戏后还是这样，请复制「查看详情」里的内容并反馈。", "summary.partial": "作弊窗口能打开，但有几个功能可能用不了。是哪些功能可以在「查看详情」里看到。", "summary.runtimeTooOld": "当前是 {version}，作弊需要 {minimum} 或更高版本。作弊可能无法正常使用。", "update.rollbackNext": "重启游戏后会回到上一个版本 {previous}。", "hint.reopen": "关掉后按 {key} 可以再次查看。", "button.details": "查看详情", "button.hideDetails": "收起详情", "button.close": "关闭", "button.copy": "复制", "button.guide": "查看解决方法", "copy.done": "已加密复制，只有开发者能看到。请原样粘贴到反馈的地方。", "copy.doneUnlocked": "已复制。这里没法加密，上面的内容会原样贴出去。粘贴前请先看一下。", "copy.failed": "没能复制。请选中文字后自己复制。", "details.label": "要反馈的内容", "button.goBack": "退回到 {previous}", "button.goBackConfirm": "退回", "button.cancel": "取消", "goBack.confirm": "将退回到 {previous}。重启游戏后生效，自动更新也不会再装回 {version}。", "goBack.done": "已退回。重启游戏后会以 {previous} 启动。", "goBack.failed": "没能退回。请重启游戏后再试一次，还是不行就重新安装作弊。" } };
    function Ye(e) { var t = (e || "").toLowerCase(), n = qe.filter(function (e) { return t.indexOf(e) === 0; }); return n.length > 0 ? n[0] : "en"; }
    function L(e, t, n) {
        if (n === void 0) { n = {}; }
        return Je[e][t].replace(/\{(\w+)\}/g, function (e, t) { return Object.prototype.hasOwnProperty.call(n, t) ? n[t] : e; });
    }
    var R = "cheat-startup-card", z = "cheat-startup-card-layer", Xe = "#".concat(R, " { z-index: 2147483000 !important; }"), Ze = 27, Qe = "#ff6b6b", $e = "#f5b942", et = "-apple-system, \"Segoe UI\", \"Malgun Gothic\", \"Apple SD Gothic Neo\", \"Hiragino Sans\", \"Yu Gothic\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif", tt = "Consolas, Menlo, \"Courier New\", monospace", B = "all: initial; box-sizing: border-box; display: block; font-family: ".concat(et, "; font-size: 13px; line-height: 1.5; color: #f2f2f4; text-align: left; white-space: normal;"), nt = ["mousedown", "pointerdown", "touchstart", "wheel", "keydown", "keypress"];
    function V(e, t, n) {
        if (n === void 0) { n = ""; }
        var r = document.createElement(e);
        return r.style.cssText = t, n && (r.textContent = n), r;
    }
    function H(e, t, n) { var r = V("button", "".concat(B, " display: inline-block; cursor: pointer; margin: 10px 8px 0 0; padding: 4px 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.3); background: ").concat(t ? "rgba(255, 255, 255, 0.16)" : "transparent", "; font-weight: 600;"), e); return r.type = "button", r.addEventListener("click", n), r; }
    function rt(e) { e.stopPropagation(); }
    function it(e, t) { nt.forEach(function (t) { return e.addEventListener(t, rt); }), e.addEventListener("keydown", function (e) { e.keyCode === Ze && t(); }); }
    function U(e) { for (; e.firstChild;)
        e.removeChild(e.firstChild); }
    function at(e, t, n) { var r = { previous: t.previousVersion, version: t.version }, i = function (t) { return L(e.language, t, r); }, a = V("div", "".concat(B, " margin-top: 6px;")); a.setAttribute("data-go-back", ""); var o = t.state, s = !1; function c(e) { var t = V("div", "".concat(B, " margin-top: 4px; color: #dcdce2;"), i(e)); t.setAttribute("role", "status"), a.appendChild(t); } function l(e) {
        if (e === void 0) { e = !1; }
        if (s = !1, U(a), o === "done") {
            c("goBack.done");
            return;
        }
        o === "failed" && c("goBack.failed");
        var t = H(i("button.goBack"), !0, f);
        a.appendChild(t), e && t.focus();
    } function u() { l(!0); } function d() { o = n() ? "done" : "failed", l(); } function f() { s = !0, U(a), a.appendChild(V("div", "".concat(B, " margin-top: 4px; color: #dcdce2;"), i("goBack.confirm"))), a.appendChild(H(i("button.goBackConfirm"), !0, d)); var e = H(i("button.cancel"), !1, u); a.appendChild(e), e.focus(); } return l(), { section: a, cancelConfirmation: function () { return s ? (u(), !0) : !1; } }; }
    function ot(e, t, n, r) { var i = n.locked === null ? n.text : n.locked, a = n.locked === null ? "copy.doneUnlocked" : "copy.done"; try {
        Ke(i), t.textContent = L(r, a);
        return;
    }
    catch (e) { } e.value = i, e.focus(), e.select(); var o = !1; try {
        o = document.execCommand("copy");
    }
    catch (e) {
        o = !1;
    } t.textContent = L(r, o ? a : "copy.failed"); }
    function st(e) { var t = function (t) { return L(e.language, t); }, n = V("div", "".concat(B, " display: none; margin-top: 10px;")), r = V("div", "".concat(B, " font-size: 12px; color: #c9c9d1;"), t("details.label")), i = V("textarea", "".concat(B, " width: 100%; height: 168px; margin-top: 4px; padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.24); background: rgba(0, 0, 0, 0.45); font-family: ").concat(tt, "; font-size: 11px; white-space: pre; overflow: auto; resize: vertical;")); i.readOnly = !0, i.setAttribute("aria-label", t("details.label")), i.setAttribute("spellcheck", "false"); var a = V("span", "".concat(B, " display: inline-block; margin-top: 10px; font-size: 12px; color: #c9c9d1;")); a.setAttribute("role", "status"); var o = { text: "", locked: null, errorKinds: 0 }, s = H(t("button.copy"), !0, function () { return ot(i, a, o, e.language); }); return n.appendChild(r), n.appendChild(i), n.appendChild(s), n.appendChild(a), { section: n, refresh: function () { o = e.report(), i.value = o.text, a.textContent = ""; } }; }
    function ct() { if (document.getElementById(z))
        return; var e = document.createElement("style"); e.id = z, e.textContent = Xe, (document.head || document.documentElement).appendChild(e); }
    function W() { var e = document.getElementById(R); e && e.parentNode && e.parentNode.removeChild(e); }
    function lt(e, t) { W(), ct(); var n = function (t) { return L(e.language, t); }, r = V("div", "".concat(B, " position: fixed; top: 12px; right: 12px; z-index: 2147483000; width: 360px; max-width: calc(100% - 24px); padding: 12px 14px; border-radius: 10px; border-left: 4px solid ").concat(e.isFatal ? Qe : $e, "; background: rgba(22, 22, 26, 0.96); box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);")); r.id = R, r.lang = e.language, r.setAttribute("role", e.isFatal ? "alert" : "status"), r.setAttribute("data-handles-escape", ""); var i = e.goBack ? at(e, e.goBack, t.goBack) : null; it(r, function () { i && i.cancelConfirmation() || t.close(); }), r.appendChild(V("div", "".concat(B, " font-size: 14px; font-weight: 700;"), e.title)), e.lines.forEach(function (e) { r.appendChild(V("div", "".concat(B, " margin-top: 4px; color: #dcdce2;"), e)); }), i && r.appendChild(i.section); var a = st(e), o = V("div", B); e.hasGuide && o.appendChild(H(n("button.guide"), !0, t.openGuide)); var s = H(n("button.details"), !1, function () { var e = a.section.style.display === "none"; e && a.refresh(), a.section.style.display = e ? "block" : "none", s.textContent = n(e ? "button.hideDetails" : "button.details"), s.setAttribute("aria-expanded", String(e)); }); s.setAttribute("aria-expanded", "false"), o.appendChild(s), o.appendChild(H(n("button.close"), !1, t.close)), r.appendChild(o), r.appendChild(a.section), (document.body || document.documentElement).appendChild(r); }
    var ut = "-----BEGIN PUBLIC KEY-----\nMIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAoC8VmQNFlcI+kqA1Z552\nY912zreIPPeMRcEdU5zFhoejmHHnI5WpKJ3dxizgvd++hzLkf4bldITXJROiHjy6\ni+28VAprjG5GXrJgiUzDQZkud/H8OZ40KAghZW95wjG3r4vUeRV6s6PVowL+VLRT\n24OrpEg8K+optVrx9TFpUp+nRAvxW16ITCCSlpQfnRuMGdC+NlXGsoq6WO+dYV4P\nCDgVXQ2AaNH+gw0gf3s+wqV5tjq2eO+aZjgMkBA5gwgHwNmNVDJy3HaEVPRuEJlG\n+WD11BL0tjpCDrHbqPTqN8s9xjSR2p5g/gQ2xhnU1PCO9ifN/GdKCu5OM52nsZ6f\n/i0xNPO59GLfFIA/HzOQXxKXmk3/kvVvXTN1/l9QnkEygbQU8LOxi3sddDuMvnNF\nftFPmUMawnZTZ7BCo7gLKcR1oboNtjw07TXS+ncf+9d+jAJkn4Mt3DXUPVQNbw34\nHdNVYS5/MzNREfCz6/jQW5hfgqaoDB10bcEq3KxeF89zAgMBAAE=\n-----END PUBLIC KEY-----\n", dt = "-----BEGIN CHEAT REPORT-----", ft = "-----END CHEAT REPORT-----", pt = 64, mt = 32, ht = 12, gt = "aes-256-gcm";
    function _t(e, t) { var n = []; for (var r_1 = 0; r_1 < e.length; r_1 += t)
        n.push(e.slice(r_1, r_1 + t)); return n; }
    function vt(e, t, n) {
        var r = n("crypto"), i = n("zlib"), a = n("buffer"), o = r.randomBytes(mt), s = r.randomBytes(ht), c = r.createCipheriv(gt, o, s), l = a.Buffer.concat([c.update(i.deflateRawSync(e)), c.final()]), u = ["1", r.publicEncrypt(t, o).toString("base64"), s.toString("base64"), c.getAuthTag().toString("base64"), l.toString("base64")];
        return [dt].concat(_t(u.join("."), pt), [ft]).join("\n");
    }
    function yt(e) { var t = window.require; if (!t)
        return null; try {
        return vt(e, ut, t);
    }
    catch (e) {
        return console.error(e), null;
    } }
    function bt(e) { return { loaderVersion: e, cheatVersion: "", script: "pending", isStylesheetMissing: !1, evaluation: "none", stages: [], errors: de(), isStarted: !1, isDeadlinePassed: !1, update: null, runtimeTooOld: null, language: "", openKeyLabel: "" }; }
    function G(e, t) { return f(f({}, e), t); }
    function xt(e, t, n) { return G(e, { errors: he(e.errors, t, n) }); }
    function St(e, t) { return G(e, { stages: e.stages.concat([{ name: t, essential: !1, isFailed: !1 }]) }); }
    function Ct(e, t, n) { return G(e, { stages: (e.stages.some(function (e) { return e.name === t; }) ? e.stages : e.stages.concat([{ name: t, essential: n, isFailed: !0 }])).map(function (e) { return e.name === t ? { name: t, essential: n, isFailed: !0 } : e; }) }); }
    function K(e, t) {
        if (t === void 0) { t = ""; }
        return { kind: e, isFatal: !0, stage: t };
    }
    function q(e, t) {
        if (t === void 0) { t = ""; }
        return { kind: e, isFatal: !1, stage: t };
    }
    function J(e, t) { var n = e.filter(t); return n.length > 0 ? n[0] : null; }
    function wt(e) { var t = A(e.errors, "global"); return t.length === 0 ? null : t[0].name === "SyntaxError" ? K("scriptUnreadable") : K("startFailed"); }
    function Tt(e) { return e.script === "pending" ? "load" : e.evaluation === "evaluating" ? "evaluate" : e.stages.length > 0 ? e.stages[e.stages.length - 1].name : "beforeStart"; }
    function Et(e) { var t = J(e.stages, function (e) { return e.isFailed && e.essential; }); if (t)
        return K("startFailed", t.name); var n = J(e.stages, function (e) { return e.isFailed; }); if (n)
        return q("partial", n.name); var r = A(e.errors, "loader").length > 0; return e.isStylesheetMissing || r ? q("partial") : e.runtimeTooOld ? q("runtimeTooOld") : null; }
    function Y(e) { if (e.script === "missing")
        return K("scriptMissing"); if (e.evaluation === "failed")
        return K("startFailed", "evaluate"); if (e.evaluation === "none") {
        var t_3 = wt(e);
        if (t_3)
            return t_3;
    } return e.isStarted ? Et(e) : e.isDeadlinePassed && (e.evaluation !== "none" || e.script !== "loaded") ? K("stalled", Tt(e)) : e.runtimeTooOld ? q("runtimeTooOld") : null; }
    function Dt(e, t) { return !e || !t ? e === t : e.kind === t.kind && e.stage === t.stage; }
    var Ot = 1e4, kt = 67, At = "C";
    function X(e) { return function () {
        var t = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            t[_i] = arguments[_i];
        }
        try {
            e.apply(void 0, __spreadArray([], __read(t), false));
        }
        catch (e) {
            console.error(e);
        }
    }; }
    function Z(e) { return typeof e == "object" && e && e.stack !== void 0 ? String(e.stack) : ""; }
    function jt(e) { var t = /^(?:Uncaught )?(\w*Error)\b/.exec(e); return t ? t[1] : "Error"; }
    function Mt(e, t, n, r) {
        if (r === void 0) { r = ""; }
        var i = typeof e == "object" && e ? e : {}, a = i.message === void 0 ? String(e) : String(i.message);
        return { place: t, context: n, name: i.name === void 0 ? jt(a) : String(i.name), message: a, stack: Z(e), location: r };
    }
    function Nt(e) { var t = e.indexOf("cheat/"); return t >= 0 ? e.slice(t) : e; }
    function Pt(e) { var t = e; return !t || !t.tagName ? !1 : t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable; }
    function Ft(e) { return e.keyCode === kt && !e.ctrlKey && !e.altKey && !e.metaKey; }
    function It() { return typeof WeakSet == "function" ? new WeakSet : null; }
    function Lt(e) { return e != null && e.isAlreadyShown === !0; }
    var Rt = (function () {
        function Rt(e, t) {
            u(this, "guideUrls", void 0), u(this, "state", void 0), u(this, "displayed", null), u(this, "isCardOpen", !1), u(this, "matchesOpenKey", function () { return !1; }), u(this, "describeContext", function () { return ""; }), u(this, "notifyError", null), u(this, "gameErrors", It()), u(this, "goBack", null), this.guideUrls = t, this.state = bt(e);
        }
        Rt.prototype.update = function (e) { this.state = e(this.state), this.isSettled() || this.present(Y(this.state)); };
        Rt.prototype.recordError = function (e, t, n) {
            if (n === void 0) { n = {}; }
            var r = Mt(e, t, this.contextSafely(), n.location), i = Date.now();
            this.update(function (e) { return xt(e, r, i); }), n.isAlreadyShown !== !0 && this.noticeError(O(r), i);
        };
        Rt.prototype.markGameError = function (e) { this.gameErrors && typeof e == "object" && e && this.gameErrors.add(e); };
        Rt.prototype.isGameError = function (e) { return !!this.gameErrors && typeof e == "object" && !!e && this.gameErrors.has(e); };
        Rt.prototype.markStarted = function () { this.state = G(this.state, { isStarted: !0 }), this.present(Y(this.state)); };
        Rt.prototype.markDeadlinePassed = function () { this.state.isStarted || (this.state = G(this.state, { isDeadlinePassed: !0 }), this.present(Y(this.state))); };
        Rt.prototype.offerGoBack = function (e) { this.goBack = { offer: e, state: "offered" }; };
        Rt.prototype.runGoBack = function () { var e = this.goBack; if (!e)
            return !1; if (e.state === "done")
            return !0; try {
            return e.offer.goBack(), e.state = "done", !0;
        }
        catch (t) {
            return console.error(t), e.state = "failed", this.recordError(t, { gate: "loader", where: "goBack" }), !1;
        } };
        Rt.prototype.setOpenKey = function (e, t) { this.matchesOpenKey = t, this.update(function (t) { return G(t, { openKeyLabel: e }); }); };
        Rt.prototype.setContextProvider = function (e) { this.describeContext = e; };
        Rt.prototype.setErrorListener = function (e) { this.notifyError = e; };
        Rt.prototype.report = function () { var e = this.reportText(); return { text: e, locked: yt(e), errorKinds: this.state.errors.records.length }; };
        Rt.prototype.reportText = function () { return je(this.state, this.displayed, Re(this.contextSafely()), He()); };
        Rt.prototype.reopenWithKey = function (e) { this.isCardOpen || !this.displayed || !this.displayed.isFatal || e.repeat || Pt(e.target) || (Ft(e) || this.matchesOpenKeySafely(e)) && this.openCard(); };
        Rt.prototype.isSettled = function () { return this.state.isStarted || this.state.isDeadlinePassed; };
        Rt.prototype.noticeError = function (e, t) { var n = ge(this.state.errors, e); this.notifyError && this.state.isStarted && n && _e(n, t) && (this.state = G(this.state, { errors: ve(this.state.errors, e, t) }), this.notifyError({ message: n.message, place: n.place, count: n.count })); };
        Rt.prototype.contextSafely = function () { try {
            return this.describeContext();
        }
        catch (e) {
            return "";
        } };
        Rt.prototype.matchesOpenKeySafely = function (e) { try {
            return this.matchesOpenKey(e);
        }
        catch (e) {
            return !1;
        } };
        Rt.prototype.present = function (e) { Dt(e, this.displayed) || (this.displayed = e, e ? this.openCard() : this.closeCard()); };
        Rt.prototype.openCard = function () {
            var _this = this;
            var e = this.displayed;
            if (!e)
                return;
            var t = this.viewOf(e);
            e.isFatal && console.error(this.reportText()), lt(t, { close: X(function () { return _this.closeCard(); }), openGuide: X(function () { return Ge(_this.guideUrlOf(t.language)); }), goBack: function () { return _this.runGoBack(); } }), this.isCardOpen = !0;
        };
        Rt.prototype.closeCard = function () { W(), this.isCardOpen = !1; };
        Rt.prototype.languageOf = function () { return Ye(this.state.language || We() || navigator.language); };
        Rt.prototype.guideUrlOf = function (e) { return e === "ko" ? this.guideUrls.korean : this.guideUrls.other; };
        Rt.prototype.goBackViewOf = function (e) { var t = this.goBack; return !e.isFatal || !t ? null : { version: t.offer.version, previousVersion: t.offer.previousVersion, state: t.state }; };
        Rt.prototype.viewOf = function (e) {
            var _this = this;
            var t = this.languageOf(), _a = this.state, n = _a.runtimeTooOld, r = _a.update, i = _a.openKeyLabel, a = function (e, n) {
                if (n === void 0) { n = {}; }
                return L(t, e, n);
            }, o = n ? { version: n.version, minimum: n.minimum } : {}, s = [a("summary.".concat(e.kind), o)];
            return n && e.kind !== "runtimeTooOld" && s.push(a("summary.runtimeTooOld", o)), e.isFatal && r && r.phase === "starting" && s.push(a("update.rollbackNext", { previous: r.previousVersion })), e.isFatal && s.push(a("hint.reopen", { key: i || At })), { language: t, isFatal: e.isFatal, title: a("title.".concat(e.kind)), lines: s, hasGuide: !!n || e.kind === "scriptUnreadable", goBack: this.goBackViewOf(e), report: function () { return _this.report(); } };
        };
        return Rt;
    }());
    function zt(e) { typeof main < "u" && main && main.error === e && (main.error = null); }
    function Q(e, t, n) { return e.isGameError(t) ? !1 : D(n) || D(Z(t)); }
    function Bt(e) { window.addEventListener("error", X(function (t) { if (t.target !== window)
        return; var n = t.error !== void 0 && t.error !== null ? t.error : t.message, r = t.filename || ""; if (!Q(e, n, r))
        return; t.preventDefault(), t.stopImmediatePropagation(), zt(n), console.error(n); var i = r ? "".concat(Nt(r), ":").concat(t.lineno, ":").concat(t.colno) : ""; e.recordError(n, { gate: "global", where: "" }, { location: i }); }), !0), window.addEventListener("unhandledrejection", X(function (t) { var n = t.reason; Q(e, n, "") && (t.preventDefault(), t.stopImmediatePropagation(), console.error(n), e.recordError(n, { gate: "global", where: "promise" })); }), !0), window.addEventListener("keydown", X(function (t) { return e.reopenWithKey(t); }), !0); var t = X(function () { window.setTimeout(X(function () { return e.markDeadlinePassed(); }), Ot); }); document.readyState === "complete" ? t() : window.addEventListener("load", t); }
    function Vt(e) { return { evaluating: X(function (t) { return e.update(function (e) { return G(e, { cheatVersion: t, evaluation: "evaluating" }); }); }), evaluated: X(function () { return e.update(function (e) { return G(e, { evaluation: "evaluated" }); }); }), evaluateFailed: X(function (t) { e.update(function (e) { return G(e, { evaluation: "failed" }); }), e.recordError(t, { gate: "topLevel", where: "" }); }), stageStarted: X(function (t) { return e.update(function (e) { return St(e, t); }); }), stageFailed: X(function (t, n, r) { e.update(function (e) { return Ct(e, t, n); }), e.recordError(r, { gate: "stage", where: t }); }), started: X(function () { return e.markStarted(); }), setLanguage: X(function (t) { return e.update(function (e) { return G(e, { language: t }); }); }), setOpenKey: X(function (t, n) { return e.setOpenKey(t, n); }), recordError: X(function (t, n, r) { e.recordError(t, n, { isAlreadyShown: Lt(r) }); }), markGameError: X(function (t) { return e.markGameError(t); }), setErrorListener: X(function (t) { return e.setErrorListener(t); }), setContextProvider: X(function (t) { return e.setContextProvider(t); }), report: function () { return e.report(); } }; }
    function Ht(e, t) { var n = new Rt(e, t); return X(function () { return Bt(n); })(), X(function () { return o(Vt(n)); })(), { protect: function (e, t) { try {
            t();
        }
        catch (t) {
            console.error(t), X(function () { return n.recordError(t, { gate: "loader", where: e }); })();
        } }, noteRuntimeTooOld: X(function (e, t) { return n.update(function (n) { return G(n, { runtimeTooOld: { version: e, minimum: t } }); }); }), noteUpdate: X(function (e) { return n.update(function (t) { return G(t, { update: e }); }); }), offerGoBack: X(function (e) { return n.offerGoBack(e); }), watchCheatScript: X(function (e) { e.addEventListener("load", X(function () { return n.update(function (e) { return G(e, { script: "loaded" }); }); })), e.addEventListener("error", X(function () { return n.update(function (e) { return G(e, { script: "missing" }); }); })); }), watchStylesheet: X(function (e) { e.addEventListener("error", X(function () { return n.update(function (e) { return G(e, { isStylesheetMissing: !0 }); }); })); }) }; }
    var $ = Ht("v2.2.0", { korean: "https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin/blob/main/README_ko-kr.md#%EA%B2%8C%EC%9E%84%EC%9D%98-nwjs-%EB%B2%84%EC%A0%84%EC%9D%B4-0264-%EB%B3%B4%EB%8B%A4-%EB%82%AE%EC%9D%80-%EA%B2%BD%EC%9A%B0-%EC%98%9B%EB%82%A0-%EB%B2%84%EC%A0%84%EC%9D%98-mv-%EA%B2%8C%EC%9E%84%EC%9D%B8-%EA%B2%BD%EC%9A%B0", other: "https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin#if-embeded-nwjs-version-of-game-is-lower-than-0264" });
    function Ut() { var t = e(); t && n(t, "0.25.4") && $.noteRuntimeTooOld(t, "0.25.4"); }
    function Wt() { e() && se(); }
    function Gt() { if (!e())
        return; var t = S(); if (!t)
        return; var n = t.version, r = t.previousVersion; t.phase === "starting" ? $.noteUpdate({ phase: "starting", version: n, previousVersion: r }) : t.phase === "rolledBack" && t.isAnnounced === !1 && $.noteUpdate({ phase: "rolledBack", version: n, previousVersion: r }); }
    function Kt() { if (!e())
        return; var t = E(); t && $.offerGoBack({ version: t.version, previousVersion: t.previousVersion, goBack: function () { return le(t); } }); }
    function qt(e) { var t = document.createElement("link"); t.rel = "stylesheet", t.href = e, $.watchStylesheet(t), document.head.appendChild(t); }
    function Jt(e) { var t = document.createElement("script"); t.type = "text/javascript", t.src = e, t.async = !1, $.watchCheatScript(t), document.body.appendChild(t); }
    $.protect("runtimeCheck", Ut), $.protect("updateRecovery", Wt), $.protect("updateNote", Gt), $.protect("goBackOffer", Kt), $.protect("stylesheet", function () { return qt("cheat/cheat.css"); }), $.protect("script", function () { return Jt("cheat/cheat.js"); });
})();
