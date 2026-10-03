window.__require = function e(t, o, a) {
function n(r, c) {
if (!o[r]) {
if (!t[r]) {
var s = r.split("/");
s = s[s.length - 1];
if (!t[s]) {
var d = "function" == typeof __require && __require;
if (!c && d) return d(s, !0);
if (i) return i(s, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = s;
}
var l = o[r] = {
exports: {}
};
t[r][0].call(l.exports, function(e) {
return n(t[r][1][e] || e);
}, l, l.exports, e, t, o, a);
}
return o[r].exports;
}
for (var i = "function" == typeof __require && __require, r = 0; r < a.length; r++) n(a[r]);
return n;
}({
MJHJLoad: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "42f52ZcR+xHPrEf3gaFjM/d", "MJHJLoad");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = cc._decorator, n = a.ccclass;
a.property;
var i = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {
var e = this;
this.preloadGameRes();
var t = cc.find("main/spine", this.node);
wUIHelp.playSpine(t, "start", function() {
wUIHelp.playSpine(t, "idle", null, !0);
});
this.scheduleOnce(function() {
e.loadRoom();
}, .8);
};
t.prototype.preloadGameRes = function() {
wRes.preloadDir("prefab/Room", "MJHJ");
};
t.prototype.loadRoom = function() {
var e = this, t = cc.Canvas.instance.node.getChildByName("MJHJ");
t.active = !0;
wRes.loadRes("prefab/Room", function(o, a) {
return __awaiter(e, void 0, void 0, function() {
var e, n, i, r = this;
return __generator(this, function() {
if (o) {
wViewMgr.enterHall();
return [ 2 ];
}
this.node.zIndex = 100;
e = cc.fadeOut(.25);
n = cc.callFunc(function() {
cc.instantiate(a).parent = t;
r.scheduleOnce(function() {
r.node.destroy();
});
});
i = cc.sequence(e, n);
this.node.getChildByName("main").runAction(i);
return [ 2 ];
});
});
}, "MJHJ");
};
return __decorate([ n ], t);
}(cc.Component);
o.default = i;
cc._RF.pop();
}, {} ],
MJHJRoom: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "7cf8ft6ZHhIBbstEfCjE+F5", "MJHJRoom");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = e("HotUpDate"), n = e("Config"), i = cc._decorator, r = i.ccclass, c = i.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.top = null;
t.bottom = null;
t.head = null;
t.nickname = null;
t.gold = null;
t.bankGold = null;
t.isEnterRoom = !1;
t.download = [];
t.gameList = {};
t.isExit = !1;
return t;
}
t.prototype.start = function() {
wGEvent.on("local_Event", this.local_Event, this);
this.enterAni();
this.initXZ();
};
t.prototype.initXZ = function() {
var e = this, t = this.content, o = function(o) {
var r = t.children[o].children[1], c = r.parent.name, s = n.Config.GamePrefab[c];
if (!s) return "continue";
i.setMaintainGame(wGameData.gameState[c], r);
wGameData.gameState.onEvevt(c, function(t) {
e.setMaintainGame(t, r);
});
if (!wConstant.isCheckHotUp) return "continue";
var d = a.wHotUpDate.getAllVersion(s.enName) || "0.0.0", l = wGameData.allVersion[s.enName] || "0.0.1";
d = Number(d.split(".")[2]);
if ((l = Number(l.split(".")[2])) > d) {
var p = cc.instantiate(cc.find("main/HotUpDateGame", i.node));
p.active = !0;
r.addChild(p, 1, c);
p.setPosition(0, 0);
p.on("click", i.addDownload, i);
i.gameList[c] = {
node: p
};
}
}, i = this;
for (var r in t.children) o(r);
this.head && wUIHelp.setHead(this.head, wGameData.getKey("headimgurl"));
this.nickname && (this.nickname.string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10));
};
t.prototype.setMaintainGame = function(e, t) {
if (cc.isValid(t, !0)) if (2 == e) t.getChildByName("maintain") || wRes.loadRes(n.Config.ViewConfig.MaintainGame, function(e, o) {
try {
var a = cc.instantiate(o);
if (!cc.isValid(t, !0)) return;
t.addChild(a, 10, "maintain");
a.on("click", function() {
wUIManager.showTips("游戏维护中");
});
} catch (e) {
wLog.i(e);
}
}); else {
var o = t.getChildByName("maintain");
o && o.destroy();
}
};
t.prototype.addDownload = function(e) {
if (!this.download.includes(e.node)) {
this.download.push(e.node);
if (1 == this.download.length) this.downLoadGame(e.node); else {
var t = e.node.name, o = "<color=#29E618>「</c><color=#ffffff>" + n.Config.GamePrefab[t].zhName + "<color=#29E618>」已加入安装队列！</c></color>";
wUIManager.showTips(o);
}
e.node.getChildByName("img").active = !1;
e.node.getChildByName("prog").active = !0;
}
};
t.prototype.downLoadGame = function(e, t) {
var o = this, i = e.getChildByName("prog").getComponent(cc.ProgressBar), r = i.node.getChildByName("label").getComponent(cc.Label), c = e.name, s = n.Config.GamePrefab[c], d = "<color=#29E618>「</c><color=#ffffff>" + s.zhName + "<color=#29E618>」已开始下载！</c></color>";
wUIManager.showTips(d);
a.wHotUpDate.upDateGame(function n(d, l) {
if (cc.isValid(o)) if (d != a.HotUpDateState.UPDATE_PROGRESSION) if (d != a.HotUpDateState.UPDATE_FAILED) {
if (d == a.HotUpDateState.UPDATE_FINISHED) {
e.destroy();
a.wHotUpDate.saveVersion(s.enName, wGameData.allVersion[s.enName]);
delete o.gameList[c];
var p = "<color=#29E618>「</c><color=#ffffff>" + s.zhName + "<color=#29E618>」已成功安装！</c></color>";
wUIManager.showTips(p);
if (t) {
t();
return;
}
}
o.download.shift();
o.download.length && o.downLoadGame(o.download[0]);
} else {
wLog.e("重新下载游戏");
a.wHotUpDate.upDateGame(n, s.enName);
} else {
var u = l.downloadedBytes / l.totalBytes || 0;
i.progress = u;
r.string = Math.floor(100 * u) + "%";
} else d == a.HotUpDateState.UPDATE_FINISHED && a.wHotUpDate.saveVersion(s.enName, wGameData.allVersion[s.enName]);
}, s.enName);
};
t.prototype.onEnable = function() {
this.gold && (this.gold.string = wUtils.numConvert(wGameData.getKey("gold")));
};
t.prototype.local_Event = function(e) {
switch (e) {
case "up_Gold":
this.gold && (this.gold.string = wUtils.numConvert(wGameData.getKey("gold")));
this.bankGold && (this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank")));
}
};
t.prototype.initShow = function() {
this.isEnterRoom = !1;
this.node.parent.active = !1;
};
t.prototype.enterAni = function() {
this.top.y = 500;
var e = cc.moveTo(.15, cc.v2(0, 375)).easing(cc.easeBackOut());
e.speed(.3);
this.top.runAction(e);
this.bottom.y = -100;
var t = cc.moveTo(.15, cc.v2(0, 0)).easing(cc.easeBackOut());
t.speed(.3);
this.bottom.runAction(t);
var o = this.content;
this.node.getChildByName("main").opacity = 0;
var a = cc.fadeTo(.5, 255);
this.node.getChildByName("main").runAction(a);
for (var n = 0; n < o.childrenCount; n++) {
var i = o.children[n], r = cc.v2(i.x, i.y);
i.x += 250;
var c = cc.moveTo(.2, r).easing(cc.easeBackOut());
c.speed(.35);
i.runAction(c);
}
};
t.prototype.roomOnClick = function(e) {
wAudioMgr.playBtnSound();
if (wGameData.getKey("uid").toString().length < 4) wUIManager.showTips("权限不足", wUIManager.TIPS_OK); else {
var t = Number(e.target.name);
console.warn("点击了游戏：" + t);
wGameData.gameID = t;
n.Config.GamePrefab[t] ? wGameData.gameRepair() ? wUIManager.showTips("游戏维护中") : wViewMgr.enterSite() : wUIManager.showTips("游戏暂未开启");
}
};
t.prototype.onClick = function(e, t) {
if (!this.isExit) {
switch (t) {
case "exit":
this.isExit = !0;
this.node.destroy();
wAudioMgr.playCloseSound();
wViewMgr.enterHall();
return;

case "bank":
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
break;

case "cz":
wViewMgr.openPage({
path: "Prefab/Recharge"
});
}
wAudioMgr.playBtnSound();
}
};
__decorate([ c(cc.Node) ], t.prototype, "content", void 0);
__decorate([ c(cc.Node) ], t.prototype, "top", void 0);
__decorate([ c(cc.Node) ], t.prototype, "bottom", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "head", void 0);
__decorate([ c(cc.Label) ], t.prototype, "nickname", void 0);
__decorate([ c(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ c(cc.Label) ], t.prototype, "bankGold", void 0);
return __decorate([ r ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {
Config: void 0,
HotUpDate: void 0
} ]
}, {}, [ "MJHJLoad", "MJHJRoom" ]);