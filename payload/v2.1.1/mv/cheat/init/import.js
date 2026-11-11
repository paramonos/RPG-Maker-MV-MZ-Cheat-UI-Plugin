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
    function e(e) { return window.require(e); }
    function t() { return e("fs"); }
    function n() { return e("path"); }
    function r(e) { window.__mvMzCheatGuard = e; }
    function i(e) {
        "@babel/helpers - typeof";
        return i = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function (e) { return typeof e; } : function (e) { return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e; }, i(e);
    }
    function a(e, t) { if (i(e) != "object" || !e)
        return e; var n = e[Symbol.toPrimitive]; if (n !== void 0) {
        var r = n.call(e, t || "default");
        if (i(r) != "object")
            return r;
        throw TypeError("@@toPrimitive must return a primitive value.");
    } return (t === "string" ? String : Number)(e); }
    function o(e) { var t = a(e, "string"); return i(t) == "symbol" ? t : t + ""; }
    function s(e, t, n) { return (t = o(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e; }
    function c(e, t) { var n = Object.keys(e); if (Object.getOwnPropertySymbols) {
        var r = Object.getOwnPropertySymbols(e);
        t && (r = r.filter(function (t) { return Object.getOwnPropertyDescriptor(e, t).enumerable; })), n.push.apply(n, r);
    } return n; }
    function l(e) { for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t] == null ? {} : arguments[t];
        t % 2 ? c(Object(n), !0).forEach(function (t) { s(e, t, n[t]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : c(Object(n)).forEach(function (t) { Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t)); });
    } return e; }
    var u = "./www/cheat-settings", d = "".concat(u, "/update");
    "".concat(d);
    var f = "".concat(d, "/previous"), ee = "cheat/init/import.js";
    function te() { return t().existsSync("./www/".concat(ee)) ? "./www" : "."; }
    function p(e) { t().existsSync(e) || (p(n().dirname(e)), t().mkdirSync(e)); }
    function ne(e, r) { p(n().dirname(r)), t().copyFileSync(e, r); }
    function m(e, n) {
        if (n === void 0) { n = ""; }
        return t().existsSync(e) ? t().readdirSync(e).reduce(function (r, i) { var a = "".concat(n).concat(i); return t().statSync("".concat(e, "/").concat(i)).isDirectory() ? __spreadArray(__spreadArray([], __read(r), false), __read(m("".concat(e, "/").concat(i), "".concat(a, "/"))), false) : __spreadArray(__spreadArray([], __read(r), false), [a], false); }, []) : [];
    }
    var h = "".concat(d, "/update-record.json"), re = "utf-8", ie = ["swapping", "installed", "starting", "rolledBack"];
    function ae(e) { return !!e && ie.some(function (t) { return t === e.phase; }) && typeof e.version == "string" && typeof e.previousVersion == "string"; }
    function g() { if (!t().existsSync(h))
        return null; try {
        var e_1 = JSON.parse(t().readFileSync(h, re));
        return ae(e_1) ? e_1 : null;
    }
    catch (e) {
        return null;
    } }
    function _(e) { p(d), t().writeFileSync(h, JSON.stringify(e)); }
    function v() { var e = te(); m(f).forEach(function (t) { return ne("".concat(f, "/").concat(t), "".concat(e, "/").concat(t)); }); }
    function oe() { var e = g(); e && e.phase !== "rolledBack" && (e.phase === "installed" ? _(l(l({}, e), {}, { phase: "starting" })) : (v(), _(l(l({}, e), {}, { phase: "rolledBack", isAnnounced: !1 })))); }
    var se = ["cheat/cheat.js", "cheat/init/import.js"];
    function ce() { return { records: [], droppedCount: 0 }; }
    function y(e) { return se.some(function (t) { return e.indexOf(t) >= 0; }); }
    function le(e) { return e.replace(/"[^"]*"/g, "\"…\"").replace(/\d+(?:\.\d+)?/g, "#"); }
    function ue(e) {
        var t = e.split("\n").filter(function (e) { return y(e); });
        if (t.length === 0)
            return "";
        var n = t[0].trim(), r = n.indexOf("cheat/"), i = /^at\s+([^\s(]+)\s+\(/.exec(n), a = n.slice(r).replace(/\)$/, "");
        return i ? "".concat(i[1], "@").concat(a) : a;
    }
    function b(e) { return [e.place.gate, e.place.where, e.name, le(e.message), ue(e.stack) || e.location].join("|"); }
    function x(e, t) { for (var n_1 = 0; n_1 < e.length; n_1 += 1)
        if (e[n_1].signature === t)
            return n_1; return -1; }
    function de(e) { var t = e.records.reduce(function (e, t) { return t.lastAt < e.lastAt ? t : e; }); return { records: e.records.filter(function (e) { return e !== t; }), droppedCount: e.droppedCount + 1 }; }
    function fe(e, t, n) { var r = b(t), i = x(e.records, r); if (i >= 0)
        return { records: e.records.map(function (e, r) { return r === i ? l(l({}, e), {}, { count: e.count + 1, lastAt: n, context: t.context || e.context }) : e; }), droppedCount: e.droppedCount }; var a = e.records.length >= 50 ? de(e) : e, o = l(l({}, t), {}, { signature: r, count: 1, firstAt: n, lastAt: n, notifiedAt: null }); return { records: a.records.concat([o]), droppedCount: a.droppedCount }; }
    function pe(e, t) { var n = x(e.records, t); return n >= 0 ? e.records[n] : null; }
    function me(e, t) { return e.notifiedAt === null || t - e.notifiedAt >= 6e4; }
    function he(e, t, n) { return { records: e.records.map(function (e) { return e.signature === t ? l(l({}, e), {}, { notifiedAt: n }) : e; }), droppedCount: e.droppedCount }; }
    function S(e, t) { return e.records.filter(function (e) { return e.place.gate === t; }); }
    var ge = 10, _e = 12, C = "unknown";
    function ve(e, t) { return t.filter(function (e) { return e.prefix.length > 0; }).sort(function (e, t) { return t.prefix.length - e.prefix.length; }).reduce(function (e, t) { return e.split(t.prefix).join(t.replacement); }, e); }
    function ye(e) { var t = e.replace(/\\/g, "/"); return [e, t, e.replace(/\//g, "\\"), "file:///".concat(t.replace(/^\//, "")), encodeURI(t)]; }
    function be(e) { return e.replace(/[\\/]+$/, ""); }
    function xe(e) { var t = [], n = function (e, n) { e && ye(be(e)).forEach(function (e) { t.push({ prefix: e, replacement: n }); }); }; return n(e.page, "<game>"), n(e.game, "<game>"), n(e.home, "~"), t; }
    function w(e) { return new Date(e).toISOString(); }
    function Se(e) {
        var t = e.place, n = t.where ? "".concat(t.gate, " ").concat(t.where) : t.gate, r = e.location ? " (".concat(e.location, ")") : "", i = e.count > 1 ? " x".concat(e.count, ", ").concat(w(e.firstAt), " ~ ").concat(w(e.lastAt)) : ", ".concat(w(e.firstAt)), a = "- [".concat(n, "] ").concat(e.name, ": ").concat(e.message).concat(r).concat(i), o = e.context ? ["    context: ".concat(e.context)] : [], s = e.stack.split("\n").map(function (e) { return e.trim(); }).filter(function (e) { return e.indexOf("at ") === 0; }).slice(0, _e).map(function (e) { return "    ".concat(e); });
        return [a].concat(o, s);
    }
    function T(e) { var t = e.droppedCount > 0 ? ["- ... ".concat(e.droppedCount, " older kinds dropped")] : []; if (e.records.length === 0)
        return ["Errors: none"].concat(t); var n = e.records.slice().sort(function (e, t) { return t.lastAt - e.lastAt; }), r = n.slice(0, ge), i = r.reduce(function (e, t) { return e.concat(Se(t)); }, ["Errors (".concat(e.records.length, " kinds):")]), a = n.length - r.length; return i.concat(a > 0 ? ["- ... ".concat(a, " more kinds")] : [], t); }
    function E(e) { return e.stages.length === 0 ? "Stages: none" : "Stages: ".concat(e.stages.map(function (e) { return e.isFailed ? e.essential ? "".concat(e.name, " FAILED (essential)") : "".concat(e.name, " FAILED") : "".concat(e.name, " ok"); }).join(", ")); }
    function D(e) { if (!e.update)
        return "Update: none"; var _a = e.update, t = _a.phase, n = _a.version, r = _a.previousVersion; return t === "starting" ? "Update: ".concat(n, " is starting (rolls back to ").concat(r, " on next launch if this start fails)") : "Update: rolled back from ".concat(n, " to ").concat(r); }
    function O(e) { return e ? e.stage ? "Result: ".concat(e.kind, " (stage: ").concat(e.stage, ")") : "Result: ".concat(e.kind) : "Result: ok"; }
    function k(e, t, n, r) {
        var i = e.runtimeTooOld ? " (below required ".concat(e.runtimeTooOld.minimum, ")") : "";
        return ve(["Cheat startup report", O(t), "Loader: ".concat(e.loaderVersion), "Cheat: ".concat(e.cheatVersion || C), "Engine: ".concat(n.engine || C), "NW.js: ".concat(n.nwjsVersion || "none").concat(i), "Chromium: ".concat(n.chromiumVersion || C), "OS: ".concat(n.platform || C), "Language: ".concat(e.language || C), "Files: cheat.js ".concat(e.script).concat(e.isStylesheetMissing ? ", cheat.css missing" : ""), "Evaluation: ".concat(e.evaluation), E(e), D(e)].concat(T(e.errors), ["Plugins (".concat(n.plugins.length, "): ").concat(n.plugins.join(", ") || "none")]).join("\n"), r);
    }
    var A = "cheat.language", j = "".concat(u, "/kv-storage.json");
    function M() { return window; }
    function N(e, t) { try {
        return e();
    }
    catch (e) {
        return t;
    } }
    function P() { var _a = M(), e = _a.nw, t = _a.require; return e || (t ? t("nw.gui") : null); }
    function Ce(e) { var t = /Chrome\/([\d.]+)/.exec(e); return t ? t[1] : ""; }
    function we() { var e = M().Utils; return !e || !e.RPGMAKER_NAME ? "" : e.RPGMAKER_VERSION ? "".concat(e.RPGMAKER_NAME, " ").concat(e.RPGMAKER_VERSION) : e.RPGMAKER_NAME; }
    function Te() { var e = M().$plugins; return !e || typeof e.filter != "function" ? [] : e.filter(function (e) { return !!e && e.status === !0; }).map(function (e) { return String(e.name); }); }
    function Ee() { var e = M().process; return e && e.platform ? "".concat(e.platform, " ").concat(e.arch || "").trim() : ""; }
    function De() { var e = M().process; return { engine: N(we, ""), nwjsVersion: N(function () { return e && e.versions && e.versions["node-webkit"] || ""; }, ""), chromiumVersion: N(function () { return Ce(navigator.userAgent); }, ""), platform: N(Ee, ""), plugins: N(Te, []) }; }
    function Oe() { return location.href.split(/[?#]/)[0].replace(/\/[^/]*$/, ""); }
    function ke() { var e = M().process, t = e && e.env; return t && (t.USERPROFILE || t.HOME) || ""; }
    function Ae() { var e = M().process; return e && e.cwd ? e.cwd() : ""; }
    function je() { return xe({ page: N(Oe, ""), game: N(Ae, ""), home: N(ke, "") }); }
    function Me(e) { var t = e("fs"); if (!t.existsSync(j))
        return ""; var n = JSON.parse(t.readFileSync(j, "utf-8"))[A]; return typeof n == "string" ? n : ""; }
    function Ne() { var e = M().require; return N(function () { return e ? Me(e) : localStorage.getItem("cheat.language") || ""; }, ""); }
    function Pe(e) { var t = N(function () { var e = P(); return e && e.Shell ? e.Shell : null; }, null); t ? t.openExternal(e) : window.open(e, "_blank"); }
    function Fe(e) { var t = P(); if (!t || !t.Clipboard)
        throw Error("NW.js clipboard is not available."); t.Clipboard.get().set(e, "text"); }
    var Ie = ["ko", "en", "ja", "zh"], Le = { ko: { "title.scriptMissing": "치트 파일이 없습니다", "title.scriptUnreadable": "이 게임에서는 치트를 읽지 못합니다", "title.startFailed": "치트를 시작하지 못했습니다", "title.stalled": "치트가 시작을 마치지 못했습니다", "title.partial": "일부 기능을 켜지 못했습니다", "title.runtimeTooOld": "게임의 NW.js 버전이 낮습니다", "summary.scriptMissing": "cheat 폴더의 파일이 빠져서 치트를 시작하지 못했습니다. 치트를 다시 넣어 주세요.", "summary.scriptUnreadable": "게임에 든 NW.js 가 너무 옛것이라 치트 파일을 읽지 못했습니다. 해결 방법을 보고 NW.js 를 바꿔 주세요.", "summary.startFailed": "준비하다 오류가 나서 치트 창을 열 수 없습니다. 게임을 다시 켜도 그대로면 「자세히 보기」의 내용을 복사해 제보해 주세요.", "summary.stalled": "준비가 중간에 멈춰서 치트 창을 열 수 없습니다. 게임을 다시 켜도 그대로면 「자세히 보기」의 내용을 복사해 제보해 주세요.", "summary.partial": "치트 창은 열리지만 몇 가지 기능이 동작하지 않을 수 있습니다. 어떤 기능인지는 「자세히 보기」에 있습니다.", "summary.runtimeTooOld": "지금은 {version} 이고 치트에는 {minimum} 이상이 필요합니다. 치트가 제대로 동작하지 않을 수 있습니다.", "update.rollbackNext": "게임을 다시 켜면 이전 버전 {previous} 로 돌아갑니다.", "hint.reopen": "닫아도 {key} 를 누르면 다시 볼 수 있습니다.", "button.details": "자세히 보기", "button.hideDetails": "접기", "button.close": "닫기", "button.copy": "복사", "button.guide": "해결 방법 보기", "copy.done": "복사했습니다", "copy.failed": "복사하지 못했습니다. 글을 골라 직접 복사해 주세요.", "details.label": "제보할 때 이 내용을 붙여 주세요" }, en: { "title.scriptMissing": "Cheat files are missing", "title.scriptUnreadable": "This game can't read the cheat", "title.startFailed": "The cheat couldn't start", "title.stalled": "The cheat didn't finish starting", "title.partial": "Some features didn't turn on", "title.runtimeTooOld": "The game's NW.js is too old", "summary.scriptMissing": "Files in the cheat folder are missing, so the cheat couldn't start. Install the cheat again.", "summary.scriptUnreadable": "The game's NW.js is too old to read the cheat files. See the fix and update NW.js.", "summary.startFailed": "Something went wrong while it was getting ready, so the cheat window can't open. If restarting the game doesn't help, copy the text under Show details and report it.", "summary.stalled": "Getting ready stopped partway, so the cheat window can't open. If restarting the game doesn't help, copy the text under Show details and report it.", "summary.partial": "The cheat window opens, but a few features may not work. Show details lists which ones.", "summary.runtimeTooOld": "The game has {version}, and the cheat needs {minimum} or newer. The cheat may not work properly.", "update.rollbackNext": "Restart the game to go back to the previous version, {previous}.", "hint.reopen": "Closed it? Press {key} to see it again.", "button.details": "Show details", "button.hideDetails": "Hide details", "button.close": "Close", "button.copy": "Copy", "button.guide": "See the fix", "copy.done": "Copied", "copy.failed": "Couldn't copy. Select the text and copy it yourself.", "details.label": "Paste this when you report the problem" }, ja: { "title.scriptMissing": "チートのファイルがありません", "title.scriptUnreadable": "このゲームではチートを読み込めません", "title.startFailed": "チートを起動できませんでした", "title.stalled": "チートの起動が終わりませんでした", "title.partial": "一部の機能をオンにできませんでした", "title.runtimeTooOld": "ゲームの NW.js のバージョンが古いです", "summary.scriptMissing": "cheat フォルダのファイルが足りないため、チートを起動できませんでした。チートを入れ直してください。", "summary.scriptUnreadable": "ゲームに入っている NW.js が古すぎて、チートのファイルを読み込めませんでした。解決方法を見て NW.js を新しくしてください。", "summary.startFailed": "準備中にエラーが起きたため、チートメニューを開けません。ゲームを再起動しても直らない場合は、「詳しく見る」の内容をコピーして報告してください。", "summary.stalled": "準備が途中で止まったため、チートメニューを開けません。ゲームを再起動しても直らない場合は、「詳しく見る」の内容をコピーして報告してください。", "summary.partial": "チートメニューは開けますが、いくつかの機能が動かないかもしれません。どの機能かは「詳しく見る」にあります。", "summary.runtimeTooOld": "今は {version} で、チートには {minimum} 以上が必要です。チートが正しく動かないことがあります。", "update.rollbackNext": "ゲームを再起動すると、前のバージョン {previous} に戻ります。", "hint.reopen": "閉じても {key} を押すともう一度表示できます。", "button.details": "詳しく見る", "button.hideDetails": "詳細を隠す", "button.close": "閉じる", "button.copy": "コピー", "button.guide": "解決方法を見る", "copy.done": "コピーしました", "copy.failed": "コピーできませんでした。文字を選んで直接コピーしてください。", "details.label": "報告するときはこの内容を貼り付けてください" }, zh: { "title.scriptMissing": "作弊文件缺失", "title.scriptUnreadable": "这个游戏读不了作弊文件", "title.startFailed": "作弊没能启动", "title.stalled": "作弊没有启动完成", "title.partial": "部分功能没能开启", "title.runtimeTooOld": "游戏的 NW.js 版本太低", "summary.scriptMissing": "cheat 文件夹里的文件不全，作弊没能启动。请重新安装作弊。", "summary.scriptUnreadable": "游戏自带的 NW.js 太旧，读不了作弊文件。请查看解决方法并更新 NW.js。", "summary.startFailed": "准备时出错了，作弊窗口打不开。如果重启游戏后还是这样，请复制「查看详情」里的内容并反馈。", "summary.stalled": "准备中途停住了，作弊窗口打不开。如果重启游戏后还是这样，请复制「查看详情」里的内容并反馈。", "summary.partial": "作弊窗口能打开，但有几个功能可能用不了。是哪些功能可以在「查看详情」里看到。", "summary.runtimeTooOld": "当前是 {version}，作弊需要 {minimum} 或更高版本。作弊可能无法正常使用。", "update.rollbackNext": "重启游戏后会回到上一个版本 {previous}。", "hint.reopen": "关掉后按 {key} 可以再次查看。", "button.details": "查看详情", "button.hideDetails": "收起详情", "button.close": "关闭", "button.copy": "复制", "button.guide": "查看解决方法", "copy.done": "已复制", "copy.failed": "没能复制。请选中文字后自己复制。", "details.label": "反馈时请附上这段内容" } };
    function Re(e) { var t = (e || "").toLowerCase(), n = Ie.filter(function (e) { return t.indexOf(e) === 0; }); return n.length > 0 ? n[0] : "en"; }
    function F(e, t, n) {
        if (n === void 0) { n = {}; }
        return Le[e][t].replace(/\{(\w+)\}/g, function (e, t) { return Object.prototype.hasOwnProperty.call(n, t) ? n[t] : e; });
    }
    var I = "cheat-startup-card", L = "cheat-startup-card-layer", ze = "#".concat(I, " { z-index: 2147483000 !important; }"), Be = 27, Ve = "#ff6b6b", He = "#f5b942", Ue = "-apple-system, \"Segoe UI\", \"Malgun Gothic\", \"Apple SD Gothic Neo\", \"Hiragino Sans\", \"Yu Gothic\", \"PingFang SC\", \"Microsoft YaHei\", sans-serif", We = "Consolas, Menlo, \"Courier New\", monospace", R = "all: initial; box-sizing: border-box; display: block; font-family: ".concat(Ue, "; font-size: 13px; line-height: 1.5; color: #f2f2f4; text-align: left; white-space: normal;"), Ge = ["mousedown", "pointerdown", "touchstart", "wheel", "keydown", "keypress"];
    function z(e, t, n) {
        if (n === void 0) { n = ""; }
        var r = document.createElement(e);
        return r.style.cssText = t, n && (r.textContent = n), r;
    }
    function B(e, t, n) { var r = z("button", "".concat(R, " display: inline-block; cursor: pointer; margin: 10px 8px 0 0; padding: 4px 12px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.3); background: ").concat(t ? "rgba(255, 255, 255, 0.16)" : "transparent", "; font-weight: 600;"), e); return r.type = "button", r.addEventListener("click", n), r; }
    function Ke(e) { e.stopPropagation(); }
    function qe(e, t) { Ge.forEach(function (t) { return e.addEventListener(t, Ke); }), e.addEventListener("keydown", function (e) { e.keyCode === Be && t(); }); }
    function Je(e, t, n) { try {
        Fe(e.value), t.textContent = F(n, "copy.done");
        return;
    }
    catch (e) { } e.focus(), e.select(); var r = !1; try {
        r = document.execCommand("copy");
    }
    catch (e) {
        r = !1;
    } t.textContent = F(n, r ? "copy.done" : "copy.failed"); }
    function Ye(e) { var t = function (t) { return F(e.language, t); }, n = z("div", "".concat(R, " display: none; margin-top: 10px;")), r = z("div", "".concat(R, " font-size: 12px; color: #c9c9d1;"), t("details.label")), i = z("textarea", "".concat(R, " width: 100%; height: 168px; margin-top: 4px; padding: 6px 8px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.24); background: rgba(0, 0, 0, 0.45); font-family: ").concat(We, "; font-size: 11px; white-space: pre; overflow: auto; resize: vertical;")); i.readOnly = !0, i.setAttribute("aria-label", t("details.label")), i.setAttribute("spellcheck", "false"); var a = z("span", "".concat(R, " display: inline-block; margin-top: 10px; font-size: 12px; color: #c9c9d1;")); a.setAttribute("role", "status"); var o = B(t("button.copy"), !0, function () { return Je(i, a, e.language); }); return n.appendChild(r), n.appendChild(i), n.appendChild(o), n.appendChild(a), { section: n, refresh: function () { i.value = e.report(), a.textContent = ""; } }; }
    function Xe() { if (document.getElementById(L))
        return; var e = document.createElement("style"); e.id = L, e.textContent = ze, (document.head || document.documentElement).appendChild(e); }
    function V() { var e = document.getElementById(I); e && e.parentNode && e.parentNode.removeChild(e); }
    function Ze(e, t) { V(), Xe(); var n = function (t) { return F(e.language, t); }, r = z("div", "".concat(R, " position: fixed; top: 12px; right: 12px; z-index: 2147483000; width: 360px; max-width: calc(100% - 24px); padding: 12px 14px; border-radius: 10px; border-left: 4px solid ").concat(e.isFatal ? Ve : He, "; background: rgba(22, 22, 26, 0.96); box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);")); r.id = I, r.lang = e.language, r.setAttribute("role", e.isFatal ? "alert" : "status"), r.setAttribute("data-handles-escape", ""), qe(r, t.close), r.appendChild(z("div", "".concat(R, " font-size: 14px; font-weight: 700;"), e.title)), e.lines.forEach(function (e) { r.appendChild(z("div", "".concat(R, " margin-top: 4px; color: #dcdce2;"), e)); }); var i = Ye(e), a = z("div", R); e.hasGuide && a.appendChild(B(n("button.guide"), !0, t.openGuide)); var o = B(n("button.details"), !1, function () { var e = i.section.style.display === "none"; e && i.refresh(), i.section.style.display = e ? "block" : "none", o.textContent = n(e ? "button.hideDetails" : "button.details"), o.setAttribute("aria-expanded", String(e)); }); o.setAttribute("aria-expanded", "false"), a.appendChild(o), a.appendChild(B(n("button.close"), !1, t.close)), r.appendChild(a), r.appendChild(i.section), (document.body || document.documentElement).appendChild(r); }
    function Qe(e) { return { loaderVersion: e, cheatVersion: "", script: "pending", isStylesheetMissing: !1, evaluation: "none", stages: [], errors: ce(), isStarted: !1, isDeadlinePassed: !1, update: null, runtimeTooOld: null, language: "", openKeyLabel: "" }; }
    function H(e, t) { return l(l({}, e), t); }
    function $e(e, t, n) { return H(e, { errors: fe(e.errors, t, n) }); }
    function et(e, t) { return H(e, { stages: e.stages.concat([{ name: t, essential: !1, isFailed: !1 }]) }); }
    function tt(e, t, n) { return H(e, { stages: (e.stages.some(function (e) { return e.name === t; }) ? e.stages : e.stages.concat([{ name: t, essential: n, isFailed: !0 }])).map(function (e) { return e.name === t ? { name: t, essential: n, isFailed: !0 } : e; }) }); }
    function U(e, t) {
        if (t === void 0) { t = ""; }
        return { kind: e, isFatal: !0, stage: t };
    }
    function W(e, t) {
        if (t === void 0) { t = ""; }
        return { kind: e, isFatal: !1, stage: t };
    }
    function G(e, t) { var n = e.filter(t); return n.length > 0 ? n[0] : null; }
    function nt(e) { var t = S(e.errors, "global"); return t.length === 0 ? null : t[0].name === "SyntaxError" ? U("scriptUnreadable") : U("startFailed"); }
    function rt(e) { return e.script === "pending" ? "load" : e.evaluation === "evaluating" ? "evaluate" : e.stages.length > 0 ? e.stages[e.stages.length - 1].name : "beforeStart"; }
    function it(e) { var t = G(e.stages, function (e) { return e.isFailed && e.essential; }); if (t)
        return U("startFailed", t.name); var n = G(e.stages, function (e) { return e.isFailed; }); if (n)
        return W("partial", n.name); var r = S(e.errors, "loader").length > 0; return e.isStylesheetMissing || r ? W("partial") : e.runtimeTooOld ? W("runtimeTooOld") : null; }
    function K(e) { if (e.script === "missing")
        return U("scriptMissing"); if (e.evaluation === "failed")
        return U("startFailed", "evaluate"); if (e.evaluation === "none") {
        var t_1 = nt(e);
        if (t_1)
            return t_1;
    } return e.isStarted ? it(e) : e.isDeadlinePassed && (e.evaluation !== "none" || e.script !== "loaded") ? U("stalled", rt(e)) : e.runtimeTooOld ? W("runtimeTooOld") : null; }
    function at(e, t) { return !e || !t ? e === t : e.kind === t.kind && e.stage === t.stage; }
    var ot = 1e4, st = 67, ct = "C";
    function q(e) { return function () {
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
    function J(e) { return typeof e == "object" && e && e.stack !== void 0 ? String(e.stack) : ""; }
    function lt(e) { var t = /^(?:Uncaught )?(\w*Error)\b/.exec(e); return t ? t[1] : "Error"; }
    function ut(e, t, n, r) {
        if (r === void 0) { r = ""; }
        var i = typeof e == "object" && e ? e : {}, a = i.message === void 0 ? String(e) : String(i.message);
        return { place: t, context: n, name: i.name === void 0 ? lt(a) : String(i.name), message: a, stack: J(e), location: r };
    }
    function dt(e) { var t = e.indexOf("cheat/"); return t >= 0 ? e.slice(t) : e; }
    function ft(e) { var t = e; return !t || !t.tagName ? !1 : t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable; }
    function pt(e) { return e.keyCode === st && !e.ctrlKey && !e.altKey && !e.metaKey; }
    function mt() { return typeof WeakSet == "function" ? new WeakSet : null; }
    function ht(e) { return e != null && e.isAlreadyShown === !0; }
    var gt = (function () {
        function gt(e, t) {
            s(this, "guideUrls", void 0), s(this, "state", void 0), s(this, "displayed", null), s(this, "isCardOpen", !1), s(this, "matchesOpenKey", function () { return !1; }), s(this, "describeContext", function () { return ""; }), s(this, "notifyError", null), s(this, "gameErrors", mt()), this.guideUrls = t, this.state = Qe(e);
        }
        gt.prototype.update = function (e) { this.state = e(this.state), this.isSettled() || this.present(K(this.state)); };
        gt.prototype.recordError = function (e, t, n) {
            if (n === void 0) { n = {}; }
            var r = ut(e, t, this.contextSafely(), n.location), i = Date.now();
            this.update(function (e) { return $e(e, r, i); }), n.isAlreadyShown !== !0 && this.noticeError(b(r), i);
        };
        gt.prototype.markGameError = function (e) { this.gameErrors && typeof e == "object" && e && this.gameErrors.add(e); };
        gt.prototype.isGameError = function (e) { return !!this.gameErrors && typeof e == "object" && !!e && this.gameErrors.has(e); };
        gt.prototype.markStarted = function () { this.state = H(this.state, { isStarted: !0 }), this.present(K(this.state)); };
        gt.prototype.markDeadlinePassed = function () { this.state.isStarted || (this.state = H(this.state, { isDeadlinePassed: !0 }), this.present(K(this.state))); };
        gt.prototype.setOpenKey = function (e, t) { this.matchesOpenKey = t, this.update(function (t) { return H(t, { openKeyLabel: e }); }); };
        gt.prototype.setContextProvider = function (e) { this.describeContext = e; };
        gt.prototype.setErrorListener = function (e) { this.notifyError = e; };
        gt.prototype.reopenWithKey = function (e) { this.isCardOpen || !this.displayed || !this.displayed.isFatal || e.repeat || ft(e.target) || (pt(e) || this.matchesOpenKeySafely(e)) && this.openCard(); };
        gt.prototype.isSettled = function () { return this.state.isStarted || this.state.isDeadlinePassed; };
        gt.prototype.noticeError = function (e, t) { var n = pe(this.state.errors, e); this.notifyError && this.state.isStarted && n && me(n, t) && (this.state = H(this.state, { errors: he(this.state.errors, e, t) }), this.notifyError({ message: n.message, place: n.place, count: n.count })); };
        gt.prototype.contextSafely = function () { try {
            return this.describeContext();
        }
        catch (e) {
            return "";
        } };
        gt.prototype.matchesOpenKeySafely = function (e) { try {
            return this.matchesOpenKey(e);
        }
        catch (e) {
            return !1;
        } };
        gt.prototype.present = function (e) { at(e, this.displayed) || (this.displayed = e, e ? this.openCard() : this.closeCard()); };
        gt.prototype.openCard = function () {
            var _this = this;
            var e = this.displayed;
            if (!e)
                return;
            var t = this.viewOf(e);
            e.isFatal && console.error(t.report()), Ze(t, { close: q(function () { return _this.closeCard(); }), openGuide: q(function () { return Pe(_this.guideUrlOf(t.language)); }) }), this.isCardOpen = !0;
        };
        gt.prototype.closeCard = function () { V(), this.isCardOpen = !1; };
        gt.prototype.languageOf = function () { return Re(this.state.language || Ne() || navigator.language); };
        gt.prototype.guideUrlOf = function (e) { return e === "ko" ? this.guideUrls.korean : this.guideUrls.other; };
        gt.prototype.viewOf = function (e) {
            var _this = this;
            var t = this.languageOf(), _a = this.state, n = _a.runtimeTooOld, r = _a.update, i = _a.openKeyLabel, a = function (e, n) {
                if (n === void 0) { n = {}; }
                return F(t, e, n);
            }, o = n ? { version: n.version, minimum: n.minimum } : {}, s = [a("summary.".concat(e.kind), o)];
            return n && e.kind !== "runtimeTooOld" && s.push(a("summary.runtimeTooOld", o)), e.isFatal && r && r.phase === "starting" && s.push(a("update.rollbackNext", { previous: r.previousVersion })), e.isFatal && s.push(a("hint.reopen", { key: i || ct })), { language: t, isFatal: e.isFatal, title: a("title.".concat(e.kind)), lines: s, hasGuide: !!n || e.kind === "scriptUnreadable", report: function () { return k(_this.state, _this.displayed, De(), je()); } };
        };
        return gt;
    }());
    function Y(e) { typeof main < "u" && main && main.error === e && (main.error = null); }
    function X(e, t, n) { return e.isGameError(t) ? !1 : y(n) || y(J(t)); }
    function _t(e) { window.addEventListener("error", q(function (t) { if (t.target !== window)
        return; var n = t.error !== void 0 && t.error !== null ? t.error : t.message, r = t.filename || ""; if (!X(e, n, r))
        return; t.preventDefault(), t.stopImmediatePropagation(), Y(n), console.error(n); var i = r ? "".concat(dt(r), ":").concat(t.lineno, ":").concat(t.colno) : ""; e.recordError(n, { gate: "global", where: "" }, { location: i }); }), !0), window.addEventListener("unhandledrejection", q(function (t) { var n = t.reason; X(e, n, "") && (t.preventDefault(), t.stopImmediatePropagation(), console.error(n), e.recordError(n, { gate: "global", where: "promise" })); }), !0), window.addEventListener("keydown", q(function (t) { return e.reopenWithKey(t); }), !0); var t = q(function () { window.setTimeout(q(function () { return e.markDeadlinePassed(); }), ot); }); document.readyState === "complete" ? t() : window.addEventListener("load", t); }
    function vt(e) { return { evaluating: q(function (t) { return e.update(function (e) { return H(e, { cheatVersion: t, evaluation: "evaluating" }); }); }), evaluated: q(function () { return e.update(function (e) { return H(e, { evaluation: "evaluated" }); }); }), evaluateFailed: q(function (t) { e.update(function (e) { return H(e, { evaluation: "failed" }); }), e.recordError(t, { gate: "topLevel", where: "" }); }), stageStarted: q(function (t) { return e.update(function (e) { return et(e, t); }); }), stageFailed: q(function (t, n, r) { e.update(function (e) { return tt(e, t, n); }), e.recordError(r, { gate: "stage", where: t }); }), started: q(function () { return e.markStarted(); }), setLanguage: q(function (t) { return e.update(function (e) { return H(e, { language: t }); }); }), setOpenKey: q(function (t, n) { return e.setOpenKey(t, n); }), recordError: q(function (t, n, r) { e.recordError(t, n, { isAlreadyShown: ht(r) }); }), markGameError: q(function (t) { return e.markGameError(t); }), setErrorListener: q(function (t) { return e.setErrorListener(t); }), setContextProvider: q(function (t) { return e.setContextProvider(t); }) }; }
    function yt(e, t) { var n = new gt(e, t); return q(function () { return _t(n); })(), q(function () { return r(vt(n)); })(), { protect: function (e, t) { try {
            t();
        }
        catch (t) {
            console.error(t), q(function () { return n.recordError(t, { gate: "loader", where: e }); })();
        } }, noteRuntimeTooOld: q(function (e, t) { return n.update(function (n) { return H(n, { runtimeTooOld: { version: e, minimum: t } }); }); }), noteUpdate: q(function (e) { return n.update(function (t) { return H(t, { update: e }); }); }), watchCheatScript: q(function (e) { e.addEventListener("load", q(function () { return n.update(function (e) { return H(e, { script: "loaded" }); }); })), e.addEventListener("error", q(function () { return n.update(function (e) { return H(e, { script: "missing" }); }); })); }), watchStylesheet: q(function (e) { e.addEventListener("error", q(function () { return n.update(function (e) { return H(e, { isStylesheetMissing: !0 }); }); })); }) }; }
    var bt = "0.26.4";
    function Z() { var e; var t = window.process; return t == null || (e = t.versions) == null ? void 0 : e["node-webkit"]; }
    function Q(e) { return e.split(".").map(function (e) { return Number.parseInt(e, 10) || 0; }); }
    function xt(e, t) { var n = Q(e), r = Q(t), i = Math.max(n.length, r.length); for (var e_2 = 0; e_2 < i; e_2 += 1) {
        var a, o;
        var t_2 = ((a = n[e_2]) == null ? 0 : a) - ((o = r[e_2]) == null ? 0 : o);
        if (t_2 !== 0)
            return t_2 < 0;
    } return !1; }
    var $ = yt("v2.1.1", { korean: "https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin/blob/main/README_ko-kr.md#%EA%B2%8C%EC%9E%84%EC%9D%98-nwjs-%EB%B2%84%EC%A0%84%EC%9D%B4-0264-%EB%B3%B4%EB%8B%A4-%EB%82%AE%EC%9D%80-%EA%B2%BD%EC%9A%B0-%EC%98%9B%EB%82%A0-%EB%B2%84%EC%A0%84%EC%9D%98-mv-%EA%B2%8C%EC%9E%84%EC%9D%B8-%EA%B2%BD%EC%9A%B0", other: "https://github.com/paramonos/RPG-Maker-MV-MZ-Cheat-UI-Plugin#if-embeded-nwjs-version-of-game-is-lower-than-0264" });
    function St() { var e = Z(); e && xt(e, "0.26.4") && $.noteRuntimeTooOld(e, bt); }
    function Ct() { Z() && oe(); }
    function wt() { if (!Z())
        return; var e = g(); if (!e)
        return; var t = e.version, n = e.previousVersion; e.phase === "starting" ? $.noteUpdate({ phase: "starting", version: t, previousVersion: n }) : e.phase === "rolledBack" && e.isAnnounced === !1 && $.noteUpdate({ phase: "rolledBack", version: t, previousVersion: n }); }
    function Tt(e) { var t = document.createElement("link"); t.rel = "stylesheet", t.href = e, $.watchStylesheet(t), document.head.appendChild(t); }
    function Et(e) { var t = document.createElement("script"); t.type = "text/javascript", t.src = e, t.async = !1, $.watchCheatScript(t), document.body.appendChild(t); }
    $.protect("runtimeCheck", St), $.protect("updateRecovery", Ct), $.protect("updateNote", wt), $.protect("stylesheet", function () { return Tt("cheat/cheat.css"); }), $.protect("script", function () { return Et("cheat/cheat.js"); });
})();
