window.__require = function e(t, o, i) {
function n(r, a) {
if (!o[r]) {
if (!t[r]) {
var c = r.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!a && l) return l(c, !0);
if (s) return s(c, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = c;
}
var d = o[r] = {
exports: {}
};
t[r][0].call(d.exports, function(e) {
return n(t[r][1][e] || e);
}, d, d.exports, e, t, o, i);
}
return o[r].exports;
}
for (var s = "function" == typeof __require && __require, r = 0; r < i.length; r++) n(i[r]);
return n;
}({
DFDCControlle: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "ef9c71P5JpGAKej1hq8m6e2", "DFDCControlle");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("ArcadeBase"), n = e("NetInterface"), s = e("DFDCLuckyList"), r = e("DFDCModel"), a = e("DFDCRotate"), c = e("DFDCView"), l = cc._decorator, d = l.ccclass, u = l.property, h = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.btn_start = null;
t.DFDCRotate = null;
t.LuckyPlayer = null;
t.View = null;
t.Model = null;
return t;
}
t.prototype.onLoad = function() {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function() {
this.initData();
wAudioMgr.playBgMusic("sound/" + wGameData.roomLevel, "DFDC");
this.vg_init();
return [ 2 ];
});
});
};
t.prototype.initData = function() {
var e = this;
this.Model = wUtils.creatorProxy(new r.DFDCModel());
this.View = this.node.getComponent(c.default);
this.View.init(this.Model);
this.Model.onEvevt("bet", function(t) {
if (t > e.Model.maxBet) e.Model.bet = 1; else if (t < 1) e.Model.bet = e.Model.maxBet; else {
e.View.setMul(e.Model.di_score * r.DFDCConfig.mul[e.Model.mul] * t);
e.View.setMaxBtn(e.Model.getMaxBet());
}
});
this.Model.onEvevt("mul", function(t) {
if (t > e.Model.maxMul) e.Model.mul = 1; else if (t < 1) e.Model.mul = e.Model.maxMul; else {
e.View.setMul(e.Model.di_score * r.DFDCConfig.mul[t] * e.Model.bet);
e.View.setMaxBtn(e.Model.getMaxBet());
e.View.setMulSpine(e.Model.initMul, t);
e.View.setJpMulShow(e.Model.initMul, t);
e.View.setMulIcon(e.Model.initMul, t, 5 == e.Model.level ? 4 : 3);
e.Model.initMul = t;
e.View.recoveryNode();
e.Model.jackPotData = e.Model.jackPotData;
}
});
this.Model.onEvevt("gameState", function(t) {
e.View.setBtnEnabled(0 == t && !e.Model.free);
e.LuckyPlayer.setBtnState(0 == t);
});
this.Model.onEvevt("gold", function(t) {
e.View.setGold(t);
});
this.Model.onEvevt("auto", function(t) {
e.View.setAutoState(t);
t && 0 == e.Model.gameState && e.requestRoll();
t ? e.offEvent() : e.onEvent();
});
this.Model.onEvevt("jackPotData", function() {
var t = e.Model.getJackPotList();
e.View.setJackPotData(t);
});
this.Model.auto = !1;
this.DFDCRotate.setEndCall(this.rollEnd.bind(this));
this.DFDCRotate.setIconCall(this.View.setIconSprite.bind(this.View));
this.DFDCRotate.setEndIconCall(function() {
e.View.setTopIcon(e.Model.iconList);
});
};
t.prototype.vg_roomInfo = function(e) {
if (!this.vg_isInit && !this.Model.isInitScene) {
this.Model.level = e.level;
this.Model.initIcon(e.map);
this.View.setAngleContentH(this.Model.iconList[0].length);
this.View.setBottomIcon(this.Model.iconList);
this.Model.isInitScene = !0;
this.Model.gold = e.gold;
this.Model.di_score = e.doublescore;
this.Model.maxMul = e.max_multiple;
this.Model.maxBet = e.max_gear;
this.Model.free = e.free;
this.Model.free4 = e.free4;
this.Model.curfree = e.free;
this.Model.mul = e.curgrade;
this.Model.bet = e.gear;
if (this.Model.free) {
this.go_on_Game();
this.Model.gameState = 0;
}
}
this.initJackPot();
};
t.prototype.vg_rollMessage = function(e) {
if (1 == e.status) {
e.data.conscore && this.View.setWinGold(0);
this.View.setWinTips(!0);
this.Model.free && this.View.setFreeCount(this.Model.free - 1);
if (3 == wGameData.roomLevel && 3 != this.Model.iconList[0].length && 3 == e.data.map[0].length) {
this.View.setAngleContentH(3);
for (var t = 0; t < 5; t++) this.Model.iconList[t].splice(3);
this.View.setBottomIcon(this.Model.iconList);
}
this.Model.gameState = 2;
this.View.setBtnStart(!1);
this.View.recoveryNode();
this.Model.initRollMsg(e.data);
this.View.initRollShow();
wAudioMgr.playSound("sound/roll_start", "DFDC");
wAudioMgr.playSound("sound/roll_move", "DFDC", !0);
this.DFDCRotate.roll(this.Model.rotateJS ? .6 : 1.2, 6 - this.Model.mul, this.Model.iconList[0].length);
if (0 == e.data.conscore) {
this.Model.allWinGold += e.data.score;
this.Model.allWinGold += e.data.jackpot;
} else this.Model.allWinGold = 0;
} else wLog.e("旋转消息出现错误");
};
t.prototype.go_on_Game = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t, o;
return __generator(this, function(i) {
switch (i.label) {
case 0:
wLog.w("->>>>>>>>>>>>>>>>中免费了" + this.Model.curfree);
switch (this.Model.level) {
case 2:
return [ 3, 1 ];

case 3:
return [ 3, 2 ];

case 4:
return [ 3, 5 ];

case 5:
return [ 3, 8 ];
}
return [ 3, 9 ];

case 1:
return [ 3, 9 ];

case 2:
e = this.Model.iconList[0].length;
t = {
5: 5,
4: 10,
3: 15
};
3 == e && (e = t[this.Model.free]);
return 0 != this.Model.free4 ? [ 3, 4 ] : [ 4, this.View.startZSYYFree() ];

case 3:
e = i.sent();
this.Model.free = t[e];
this.initFree(e);
return [ 2 ];

case 4:
this.initFree(e);
return [ 2 ];

case 5:
return 0 != this.Model.free4 ? [ 3, 7 ] : [ 4, this.View.startCFXMFree() ];

case 6:
o = i.sent();
this.Model.free = o;
this.initFree();
return [ 2 ];

case 7:
case 8:
return [ 3, 9 ];

case 9:
this.View.initFreeBG(!0);
this.View.showFreeBtn(!0);
this.View.setFreeCount(this.Model.free);
this.Model.allWinGold = 0;
wAudioMgr.playBgMusic("sound/f" + wGameData.roomLevel, "DFDC");
return [ 2 ];
}
});
});
};
t.prototype.initFree = function(e) {
void 0 === e && (e = 3);
this.View.initFreeBG(!0);
var t = [ [ 10, 10, 10 ], [ 4, 4, 4 ], [ 3, 3, 3 ], [ 2, 2, 2 ], [ 1, 1, 1 ] ];
if (3 != e) {
this.View.setAngleContentH(e);
for (var o = 0; o < 5; o++) for (var i = 0; i < e - 3; i++) t[o].push(t[o][0]);
}
this.View.recoveryNode();
this.View.setBottomIcon(t);
this.View.showFreeBtn(!0);
this.View.setFreeCount(this.Model.free);
this.View.setWinGold(0);
this.View.setWinTips(!1);
this.Model.allWinGold = 0;
};
t.prototype.winJackPot = function() {
return __awaiter(this, void 0, void 0, function() {
var e = this;
return __generator(this, function(t) {
switch (t.label) {
case 0:
this.View.setPenShow(4, function() {
e.View.setPenShow(5, null);
});
return [ 4, wUtils.syncDelayed(3.5, this) ];

case 1:
t.sent();
return [ 4, new Promise(function(t) {
wViewMgr.openPage({
path: "prefab/DFDCJackPot",
bundle: "DFDC",
data: {
isBool: !0,
Model: e.Model,
cb: function() {
t(!0);
}
}
});
}) ];

case 2:
t.sent();
this.View.setWinGold(this.Model.jackpot);
this.Model.gold += this.Model.jackpot;
return [ 4, wUtils.syncDelayed(1.5, this) ];

case 3:
t.sent();
return [ 2 ];
}
});
});
};
t.prototype.jlffProcessControlle = function() {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(e) {
switch (e.label) {
case 0:
this.View.setWinTips(!1);
this.View.setBottomIcon(this.Model.iconList);
if (!this.Model.curMap.length) return [ 3, 2 ];
this.View.showIconResult(this.Model.curMap);
return [ 4, wUtils.syncDelayed(.4, this) ];

case 1:
e.sent();
e.label = 2;

case 2:
return this.Model.curMap.length ? [ 4, this.View.showWinEffect(this.Model.jackpot ? 1 : this.Model.winType, this.Model.score) ] : [ 3, 4 ];

case 3:
e.sent();
this.Model.gold += this.Model.score;
e.label = 4;

case 4:
return this.View.wildShow(this.Model.iconList.length) ? [ 4, wUtils.syncDelayed(.3, this) ] : [ 3, 6 ];

case 5:
e.sent();
e.label = 6;

case 6:
if (!this.Model.jackpot) return [ 3, 8 ];
wLog.w("->>>>>>>>>>>>>>>>中奖池了");
return [ 4, this.winJackPot() ];

case 7:
e.sent();
e.label = 8;

case 8:
if (!this.Model.free || !this.Model.conscore) return [ 3, 11 ];
wLog.w("->>>>>>>>>>>>>>>>中免费了" + this.Model.curfree);
wAudioMgr.playSound("sound/zfree", "DFDC");
return [ 4, this.View.startFree(this.Model.curfree) ];

case 9:
e.sent();
return [ 4, this.View.startJLFFFree() ];

case 10:
e.sent();
this.initFree();
wAudioMgr.playBgMusic("sound/f" + wGameData.roomLevel, "DFDC");
return [ 3, 13 ];

case 11:
if (!this.Model.curfree) return [ 3, 13 ];
wLog.w("免费中出现免费:", this.Model.curfree);
return [ 4, this.View.startFree(this.Model.curfree) ];

case 12:
e.sent();
this.View.setFreeCount(this.Model.free);
e.label = 13;

case 13:
return [ 4, this.View.endFree(this.Model.free) ];

case 14:
e.sent();
this.Model.auto ? this.requestRoll() : this.Model.gameState = 0;
return [ 2 ];
}
});
});
};
t.prototype.zsyyProcessControlle = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t;
return __generator(this, function(o) {
switch (o.label) {
case 0:
this.View.setWinTips(!1);
this.View.setBottomIcon(this.Model.iconList);
if (!this.Model.curMap.length) return [ 3, 2 ];
this.View.showIconResult(this.Model.curMap);
return [ 4, wUtils.syncDelayed(.4, this) ];

case 1:
o.sent();
o.label = 2;

case 2:
return this.Model.curMap.length ? [ 4, this.View.showWinEffect(this.Model.jackpot ? 1 : this.Model.winType, this.Model.score) ] : [ 3, 4 ];

case 3:
o.sent();
this.Model.gold += this.Model.score;
o.label = 4;

case 4:
return this.View.wildShow(this.Model.iconList.length) ? [ 4, wUtils.syncDelayed(.3, this) ] : [ 3, 6 ];

case 5:
o.sent();
o.label = 6;

case 6:
if (!this.Model.jackpot) return [ 3, 8 ];
wLog.w("->>>>>>>>>>>>>>>>中奖池了");
return [ 4, this.winJackPot() ];

case 7:
o.sent();
o.label = 8;

case 8:
if (0 != this.Model.free4 || !this.Model.curfree) return [ 3, 10 ];
wAudioMgr.playSound("sound/zfree", "DFDC");
wLog.w("->>>>>>>>>>>>>>>>中免费了" + this.Model.curfree);
return [ 4, this.View.startZSYYFree() ];

case 9:
e = o.sent();
t = {
5: 5,
4: 10,
3: 15
};
this.Model.free = t[e];
this.initFree(e);
wAudioMgr.playBgMusic("sound/f" + wGameData.roomLevel, "DFDC");
return [ 3, 12 ];

case 10:
if (!this.Model.curfree) return [ 3, 12 ];
wLog.w("免费中出现免费:", this.Model.curfree);
return [ 4, this.View.startFree(this.Model.curfree) ];

case 11:
o.sent();
this.View.setFreeCount(this.Model.free);
o.label = 12;

case 12:
return [ 4, this.View.endFree(this.Model.free) ];

case 13:
o.sent();
this.Model.auto ? this.requestRoll() : this.Model.gameState = 0;
return [ 2 ];
}
});
});
};
t.prototype.cfxmProcessControlle = function() {
return __awaiter(this, void 0, void 0, function() {
var e;
return __generator(this, function(t) {
switch (t.label) {
case 0:
this.View.setWinTips(!1);
this.View.setBottomIcon(this.Model.iconList);
if (!this.Model.curMap.length) return [ 3, 2 ];
this.View.showIconResult(this.Model.curMap);
return [ 4, wUtils.syncDelayed(.4, this) ];

case 1:
t.sent();
t.label = 2;

case 2:
return this.Model.curMap.length ? [ 4, this.View.showWinEffect(this.Model.jackpot ? 1 : this.Model.winType, this.Model.score) ] : [ 3, 4 ];

case 3:
t.sent();
this.Model.gold += this.Model.score;
t.label = 4;

case 4:
return this.View.wildShow(this.Model.iconList.length) ? [ 4, wUtils.syncDelayed(.3, this) ] : [ 3, 6 ];

case 5:
t.sent();
t.label = 6;

case 6:
if (!this.Model.jackpot) return [ 3, 8 ];
wLog.w("->>>>>>>>>>>>>>>>中奖池了");
return [ 4, this.winJackPot() ];

case 7:
t.sent();
t.label = 8;

case 8:
if (0 != this.Model.free4 || !this.Model.curfree) return [ 3, 10 ];
wAudioMgr.playSound("sound/zfree", "DFDC");
wLog.w("->>>>>>>>>>>>>>>>中免费了" + this.Model.curfree);
return [ 4, this.View.startCFXMFree() ];

case 9:
e = t.sent();
this.Model.free = e;
this.initFree();
wAudioMgr.playBgMusic("sound/f" + wGameData.roomLevel, "DFDC");
return [ 3, 12 ];

case 10:
if (!this.Model.curfree) return [ 3, 12 ];
wLog.w("免费中出现免费:", this.Model.curfree);
return [ 4, this.View.startFree(this.Model.curfree) ];

case 11:
t.sent();
this.View.setFreeCount(this.Model.free);
t.label = 12;

case 12:
return [ 4, this.View.endFree(this.Model.free) ];

case 13:
t.sent();
this.Model.auto ? this.requestRoll() : this.Model.gameState = 0;
return [ 2 ];
}
});
});
};
t.prototype.jgfcProcessControlle = function() {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(e) {
switch (e.label) {
case 0:
this.View.setWinTips(!1);
this.View.setBottomIcon(this.Model.iconList);
if (!this.Model.curMap.length) return [ 3, 2 ];
this.View.showIconResult(this.Model.curMap);
return [ 4, wUtils.syncDelayed(.4, this) ];

case 1:
e.sent();
e.label = 2;

case 2:
return this.Model.curMap.length ? [ 4, this.View.showWinEffect(this.Model.jackpot ? 1 : this.Model.winType, this.Model.score) ] : [ 3, 4 ];

case 3:
e.sent();
this.Model.gold += this.Model.score;
e.label = 4;

case 4:
return this.View.wildShow(this.Model.iconList.length) ? [ 4, wUtils.syncDelayed(.3, this) ] : [ 3, 6 ];

case 5:
e.sent();
e.label = 6;

case 6:
if (!this.Model.jackpot) return [ 3, 8 ];
wLog.w("->>>>>>>>>>>>>>>>中奖池了");
return [ 4, this.winJackPot() ];

case 7:
e.sent();
e.label = 8;

case 8:
if (!this.Model.free || !this.Model.conscore) return [ 3, 11 ];
wAudioMgr.playSound("sound/zfree", "DFDC");
wLog.w("->>>>>>>>>>>>>>>>中免费了" + this.Model.curfree);
return [ 4, this.View.startFree(this.Model.curfree) ];

case 9:
e.sent();
return [ 4, this.View.startJLFFFree() ];

case 10:
e.sent();
this.initFree(4);
wAudioMgr.playBgMusic("sound/f" + wGameData.roomLevel, "DFDC");
return [ 3, 13 ];

case 11:
if (!this.Model.curfree) return [ 3, 13 ];
wLog.w("免费中出现免费:", this.Model.curfree);
this.View.jgfcAddFreeCount();
return [ 4, this.View.startFree(this.Model.curfree) ];

case 12:
e.sent();
this.View.setFreeCount(this.Model.free);
e.label = 13;

case 13:
return [ 4, this.View.endFree(this.Model.free) ];

case 14:
e.sent();
this.Model.auto ? this.requestRoll() : this.Model.gameState = 0;
return [ 2 ];
}
});
});
};
t.prototype.onClick = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
var o;
return __generator(this, function() {
switch (t) {
case "js":
this.Model.rotateJS = !this.Model.rotateJS;
break;

case "rule":
wViewMgr.openPage({
path: "prefab/Rule",
bundle: wGameData.getGameName()
});
break;

case "betadd":
this.Model.bet++;
break;

case "betsub":
this.Model.bet--;
break;

case "mul":
if ((o = Number(e.node.name)) == this.Model.mul) return [ 2 ];
this.Model.mul = o;
break;

case "max":
this.Model.bet = this.Model.maxBet;
this.Model.mul = this.Model.maxMul;
break;

case "auto":
this.Model.auto = !1;
break;

case "stop":
this.DFDCRotate.stop();
break;

case "bank":
if (0 != this.Model.gameState) {
wUIManager.showTips("游戏进行中,请等待游戏结束", wUIManager.TIPS_OK);
break;
}
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
break;

case "hall":
wAudioMgr.playCloseSound();
this.vg_quitGame(0 != this.Model.gameState);
return [ 2 ];
}
wAudioMgr.playBtnSound();
return [ 2 ];
});
});
};
t.prototype.onEvent = function() {
var e = this.btn_start;
e.on(cc.Node.EventType.TOUCH_START, this.startEvent, this);
e.on(cc.Node.EventType.TOUCH_END, this.endEvent, this);
e.on(cc.Node.EventType.TOUCH_CANCEL, this.endEvent, this);
this.DFDCRotate.setEndCall(this.rollEnd.bind(this));
};
t.prototype.offEvent = function() {
var e = this.btn_start;
e.off(cc.Node.EventType.TOUCH_START, this.startEvent, this);
e.off(cc.Node.EventType.TOUCH_END, this.endEvent, this);
e.off(cc.Node.EventType.TOUCH_CANCEL, this.endEvent, this);
};
t.prototype.startEvent = function() {
var e = this;
this.scheduleOnce(function() {
e.Model.auto = !0;
}, 1);
};
t.prototype.endEvent = function() {
this.unscheduleAllCallbacks();
this.Model.auto || 0 != this.Model.gameState || this.requestRoll();
};
t.prototype.requestRoll = function() {
var e = this.Model.di_score * r.DFDCConfig.mul[this.Model.mul] * this.Model.bet;
if (!this.Model.free && e > this.Model.gold) {
this.Model.gameState = 0;
this.Model.auto = !1;
wUIManager.showTips("金币不足");
} else {
this.Model.gameState = 1;
this.vg_sendRollMsg({
multiple: this.Model.mul,
gear: this.Model.bet
});
}
};
t.prototype.vg_upGameGold = function() {
this.Model.gold = wGameData.getKey("gold");
};
t.prototype.rollEnd = function(e) {
if (4 == e) {
wAudioMgr.stopEffects("sound/roll_start");
wAudioMgr.stopEffects("sound/roll_move");
this.Model.gameState = 3;
this.View.setBtnStart(!0);
this[this.Model.getGameType() + "ProcessControlle"]();
}
};
t.prototype.initJackPot = function() {
var e = this;
wGEvent.on("Msg_Game_Jackpot", function(t) {
if (1 == t.status) {
var o = t.data[0] ? t.data[0].jackpot : 0;
o && (o += wUtils.random(Math.ceil(o / wUtils.random(7, 10)), wUtils.random(6, 10)) * (wUtils.random(1, 10) <= 5 ? 1 : -1));
e.Model.jackPotData = o;
}
}, this);
this.node.stopAllActions();
var t = cc.callFunc(function() {
wNetWork.send("Msg_Game_Jackpot", {
gtype: wGameData.gameID,
level: e.Model.level
});
}), o = cc.delayTime(5), i = cc.repeatForever(cc.sequence(t, o));
this.node.runAction(i);
};
t.prototype.vg_NetWorkState = function(e) {
e != n.netWorkState.CLOSEDING && e != n.netWorkState.CLOSED || this.node.stopAllActions();
};
__decorate([ u(cc.Node) ], t.prototype, "btn_start", void 0);
__decorate([ u(a.default) ], t.prototype, "DFDCRotate", void 0);
__decorate([ u(s.default) ], t.prototype, "LuckyPlayer", void 0);
return __decorate([ d ], t);
}(i.default);
o.default = h;
cc._RF.pop();
}, {
ArcadeBase: void 0,
DFDCLuckyList: "DFDCLuckyList",
DFDCModel: "DFDCModel",
DFDCRotate: "DFDCRotate",
DFDCView: "DFDCView",
NetInterface: void 0
} ],
DFDCJackPot: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "436d5EGhcRKIIAjlIQtQQjL", "DFDCJackPot");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("PopupBase"), n = cc._decorator, s = n.ccclass, r = n.property, a = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.mul = null;
t.pen = null;
t.Model = null;
t.cb = null;
t.list = [ 1, 1, 2, 2, 3, 3, 4, 4 ];
t.posList = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
t.typeCount = {
1: [],
2: [],
3: [],
4: []
};
return t;
}
t.prototype.show = function(e) {
this.init(e);
this.node.opacity = 0;
this.content.active = !1;
};
t.prototype.onEnable = function() {
var e = this, t = cc.fadeIn(.5), o = cc.callFunc(function() {
e.pen.setCompleteListener(function() {
e.main.getChildByName("pen").opacity = 255;
e.pen.node.active = !1;
e.content.active = !0;
e.isGz || e.scheduleOnce(function() {
e.playFP();
}, 1.5);
});
e.pen.setAnimation(1, "animation1", !1);
});
this.node.runAction(cc.sequence(t, o));
};
t.prototype.init = function(e) {
this.isGz = e.isBool;
this.Model = e.Model;
this.cb = e.cb;
this.list.sort(function() {
return Math.random() - .5;
});
this.list.sort(function() {
return Math.random() - .5;
});
this.list.push(this.Model.jackpotType);
this.posList.sort(function() {
return Math.random() - .5;
});
this.posList.sort(function() {
return Math.random() - .5;
});
this.setMulSpine(e.Model.mul);
this.setJackPot();
};
t.prototype.playFP = function(e) {
var t = this;
if (this.list.length <= 0) {
for (var o = this.typeCount[this.Model.jackpotType], i = 0; i < o.length; i++) o[i].setAnimation(1, "animation2", !0);
wAudioMgr.playSound("sound/sound-jackpot-result", "DFDC");
this.scheduleOnce(function() {
t.playWin();
}, 2);
} else {
wAudioMgr.playSound("sound/sound-jackpot-draw", "DFDC");
var n = this.list.shift(), s = null;
(s = e ? e.getComponent(sp.Skeleton) : this.content.children[this.posList.shift()].getComponent(sp.Skeleton)).setSkin("skin" + n);
s.setAnimation(1, "animation1", !1);
this.scheduleOnce(function() {
s.setAnimation(1, "animation3", !0);
(!t.isGz || t.list.length <= 0) && t.scheduleOnce(function() {
t.playFP();
}, .2);
}, 1.1);
this.typeCount[n].push(s);
2 == this.typeCount[n].length && this.main.getChildByName("bgspine").getComponent(sp.Skeleton).setAnimation(1, "animation" + n, !1);
}
};
t.prototype.playWin = function() {
var e = this;
wAudioMgr.playSound("sound/sound-jackpot-win", "DFDC");
var t = this.main.getChildByName("win").getChildByName("" + this.Model.jackpotType).getComponent(sp.Skeleton);
t.node.active = !0;
var o = t.setAnimation(1, "animation1", !1);
t.setTrackCompleteListener(o, function() {
t.setAnimation(1, "animation2", !0);
wUIHelp.CountUp_(t.node.children[0], 0, e.Model.jackpot, 1.5);
});
this.scheduleOnce(function() {
var t = cc.fadeOut(.3), o = cc.callFunc(function() {
e.cb && e.cb();
e.node.destroy();
});
e.node.runAction(cc.sequence(t, o));
}, 10);
var i = this.main.getChildByName("lizi");
i.active = !0;
i.getComponent(cc.ParticleSystem).resetSystem();
};
t.prototype.setMulSpine = function(e) {
for (var t = 2; t <= e; t++) {
var o = this.mul.getChildByName("" + t);
o.color = cc.color(255, 255, 255);
o.children[0].color = cc.color(255, 255, 255);
o.children[1].active = !0;
o.children[1].children[0].getComponent(cc.ParticleSystem).resetSystem();
}
};
t.prototype.setJackPot = function() {
for (var e = [ 0, .005, .025, .07, .9 ], t = this.Model.jackpot / e[this.Model.jackpotType], o = 2; o <= 5; o++) {
var i = this.mul.getChildByName("" + o);
o - 1 == this.Model.jackpotType ? i.children[0].getComponent(cc.Label).string = wUtils.numConvert(this.Model.jackpot) : i.children[0].getComponent(cc.Label).string = wUtils.numConvert(Math.floor(t * e[o - 1]));
wLog.e(Math.floor(t * e[o - 1]));
}
};
t.prototype.onClick = function(e) {
if (!(this.list.length <= 0) && this.isGz) {
e.target.active = !1;
this.playFP(e.target.parent);
}
};
__decorate([ r(cc.Node) ], t.prototype, "content", void 0);
__decorate([ r(cc.Node) ], t.prototype, "mul", void 0);
__decorate([ r(sp.Skeleton) ], t.prototype, "pen", void 0);
return __decorate([ s ], t);
}(i.default);
o.default = a;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
DFDCLoad: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b096bk45iVFB7fH26FSgQyl", "DFDCLoad");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("Config"), n = cc._decorator, s = n.ccclass;
n.property;
var r = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t = this;
return __generator(this, function(o) {
switch (o.label) {
case 0:
wAudioMgr.playBgMusic("sound/2", wGameData.getGameName());
return [ 4, this.preloadGameRes() ];

case 1:
o.sent();
if (wGameData.isReconnect) this.loadRoom(); else {
e = wGEvent.on("Msg_Hall_GameSessions", function(o) {
t.Msg_Hall_GameSessions(o);
wGEvent.off(e);
t.unscheduleAllCallbacks();
e = null;
}, this);
this.scheduleOnce(function() {
if (e) {
wUIManager.showTips("请求游戏配置失败");
wGEvent.off(e);
wViewMgr.enterHall();
}
}, 10);
wNetWork.send("Msg_Hall_GameSessions", {
gtype: wGameData.gameID
});
}
return [ 2 ];
}
});
});
};
t.prototype.Msg_Hall_GameSessions = function(e) {
if (1 == e.status && e.data) {
wGameData.roomConfig = e.data;
this.loadRoom();
} else {
wLog.e("请求游戏配置失败");
wViewMgr.enterHall();
}
};
t.prototype.preloadGameRes = function() {
return new Promise(function(e) {
var t = i.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir([ "prefab/JLFFMain", "prefab/ZSYHMain", "prefab/CFXMMain", "prefab/JGFCMain", "prefab/Room" ], function() {
e();
}, t.enName);
});
};
t.prototype.closePage = function() {
var e = this, t = cc.fadeOut(.25), o = cc.callFunc(function() {
e.node.destroy();
}), i = cc.sequence(t, o);
this.node.runAction(i);
};
t.prototype.loadRoom = function() {
var e = this, t = wGameData.gameID, o = cc.Canvas.instance.node.getChildByName("Room");
o.active = !0;
var n = i.Config.GamePrefab[t];
wRes.loadRes("prefab/Room", function(t, i) {
return __awaiter(e, void 0, void 0, function() {
return __generator(this, function() {
if (t) {
wViewMgr.enterHall();
return [ 2 ];
}
cc.instantiate(i).parent = o;
wGameData.isReconnect ? this.node.zIndex = 100 : this.closePage();
return [ 2 ];
});
});
}, n.enName);
};
return __decorate([ s ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {
Config: void 0
} ],
DFDCLuckyList: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "abaa9X/uwVINbkzRaKEK3fi", "DFDCLuckyList");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, n = i.ccclass, s = i.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.listPb = null;
t.showPb = null;
t.typeImg = [];
t.rankingImg = [];
t.content = null;
t.item = null;
t.listName = [];
t.newList = [];
t.historyList = [];
t.btnList = [];
t.isPlay = !0;
return t;
}
t.prototype.onLoad = function() {
wGEvent.on("Msg_Game_Back_List", this.Msg_Game_Back_List, this);
var e = wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function(t) {
if (1 == t.status) {
wGEvent.off(e);
wNetWork.send("Msg_Game_Back_List", {
level: wGameData.roomLevel
});
}
}, this);
};
t.prototype.Msg_Game_Back_List = function(e) {
var t = this;
if (1 == e.status) {
this.newList = e.data.new.filter(function(e) {
if (e.level == wGameData.roomLevel) return !0;
});
this.historyList = e.data.history.filter(function(e) {
if (e.level == wGameData.roomLevel) return !0;
});
this.newList.forEach(function(e) {
t.listName.push(e);
});
this.historyList.forEach(function(e) {
t.listName.push(e);
});
this.carouselName();
}
};
t.prototype.openShow = function() {
var e = this, t = cc.instantiate(this.listPb);
this.node.addChild(t, 10, "listContent");
var o = t.getChildByName("main");
wUIHelp.easeBackOut(o);
o.getChildByName("close").on("click", this.closeList, this);
var i = cc.find("content/toggle1", o), n = cc.find("checkmark/scrollView", i).getComponent(cc.ScrollView).content;
this.initList(n, this.newList, "ZX");
i.on("click", function() {
wAudioMgr.playBtnSound();
});
var s = cc.find("content/toggle2", o);
s.on("toggle", function t() {
var o = cc.find("checkmark/scrollView", s).getComponent(cc.ScrollView).content;
e.initList(o, e.historyList, "LS");
s.off("toggle", t, e);
}, this);
s.on("click", function() {
wAudioMgr.playBtnSound();
});
};
t.prototype.carouselName = function() {
var e = this;
if (!(this.listName.length <= 0)) {
var t = 0, o = function(t) {
e.item.getChildByName("n").getComponent(cc.Label).string = wUtils.handleNameLen(t.nickname, 4);
e.item.getChildByName("t").getComponent(cc.Sprite).spriteFrame = e.typeImg[t.type];
};
o(this.listName[t++]);
var i = cc.delayTime(4), n = cc.moveTo(.2, cc.v2(0, 40)), s = cc.callFunc(function() {
e.item.y = -40;
t >= e.listName.length && (t = 0);
o(e.listName[t++]);
}), r = cc.moveTo(.2, cc.v2(0, 0)), a = cc.repeatForever(cc.sequence(i, n, s, r));
this.item.runAction(a);
}
};
t.prototype.initItem = function(e, t) {
var o = t.i, i = e.getChildByName("play");
i.data = t;
i.off("click");
i.on("click", this.play, this);
var n = i.getComponent(cc.Button);
n.interactable = this.isPlay;
this.btnList.push(n);
e.getChildByName("type").getComponent(cc.Sprite).spriteFrame = this.typeImg[t.type];
e.getChildByName("gold").getComponent(cc.Label).string = wUtils.numConvert(t.score);
e.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(t.nickname, 10);
e.getChildByName("count").getComponent(cc.Label).string = t.playnum;
var s = cc.sys.localStorage.getItem("DFDC_" + t.id);
e.getChildByName("dzCount").getComponent(cc.Label).string = s ? "1" : 0;
var r = e.getChildByName("dz");
r.getComponent(cc.Button).interactable = !s;
r.off("click");
s || r.on("click", function() {
cc.sys.localStorage.setItem("DFDC_" + t.id, 1);
r.off("click");
e.getChildByName("dzCount").getComponent(cc.Label).string = "1";
r.getComponent(cc.Button).interactable = !1;
}, this);
for (var a = t.created.split(" "), c = 0; c < 2; c++) {
var l = e.getChildByName("time" + c);
l.getComponent(cc.Label).string = a[c];
l.active = !0;
}
var d = e.getChildByName("ranking");
d.getComponent(cc.Sprite).spriteFrame = this.rankingImg[o > 3 ? 3 : o];
d.getChildByName("label").getComponent(cc.Label).string = o > 2 ? "" + (o + 1) : "";
d.active = !0;
e.active = !0;
};
t.prototype.initList = function(e, t, o) {
var i = e.getComponent("Layout_z"), n = new cc.Component.EventHandler();
n.target = this.node;
n.component = "DFDCLuckyList";
n.handler = "initItem";
i.eventHandler = n;
e.parent.getChildByName("no").active = !t.length;
for (var s = 0; s < t.length; s++) {
var r = t[s];
r.i = s;
r.TYPE = o;
i._addClick(r);
}
};
t.prototype.closeList = function() {
wAudioMgr.playCloseSound();
var e = this.node.getChildByName("listContent"), t = e.getChildByName("main");
wUIHelp.easeIn(t, function() {
e.destroy();
});
};
t.prototype.openList = function() {
wAudioMgr.playBtnSound();
this.openShow();
};
t.prototype.play = function(e) {
var t = this;
wAudioMgr.playBtnSound();
var o = e.node.data;
wLog.i("--\x3e>要播放的信息：", o);
var i = wGEvent.on("Msg_Game_Back_Info", function(e) {
wGEvent.off(i);
if (1 == e.status) {
var n = cc.instantiate(t.showPb);
e.data.level = o.level;
n.data = e.data;
n.data.nickname = o.nickname;
n.data.headimgurl = o.headimgurl;
t.node.addChild(n, 100);
}
}, this);
wNetWork.send("Msg_Game_Back_Info", {
id: o.id
}, !0);
};
t.prototype.setBtnState = function(e) {
this.isPlay = e;
for (var t = 0, o = this.btnList; t < o.length; t++) o[t].interactable = e;
};
__decorate([ s(cc.Prefab) ], t.prototype, "listPb", void 0);
__decorate([ s(cc.Prefab) ], t.prototype, "showPb", void 0);
__decorate([ s([ cc.SpriteFrame ]) ], t.prototype, "typeImg", void 0);
__decorate([ s([ cc.SpriteFrame ]) ], t.prototype, "rankingImg", void 0);
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
__decorate([ s(cc.Node) ], t.prototype, "item", void 0);
return __decorate([ n ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {} ],
DFDCLuckyPlayer: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "4a55dewDG9EErMPB5ulPx85", "DFDCLuckyPlayer");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("DFDCModel"), n = e("DFDCRotate"), s = e("DFDCView"), r = cc._decorator, a = r.ccclass, c = r.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.DFDCRotate = null;
t.btn_Play = null;
t.View = null;
t.Model = null;
return t;
}
t.prototype.onEnable = function() {
this.initData();
this.init();
};
t.prototype.init = function() {
this.btn_Play.node.active = !1;
var e = JSON.parse(JSON.stringify(this.node.data)), t = e.data;
this.gameList = e.data;
var o = wUtils.handleNameLen(e.nickname, 10);
cc.find("bottom/info/name", this.node).getComponent(cc.Label).string = o;
wUIHelp.setHead(cc.find("bottom/info/head", this.node), e.headimgurl);
var i = this.gameList[0], n = {
level: e.level,
doublescore: e.doublescore,
curgrade: e.curgrade,
gear: e.gear,
map: e.map,
gold: i.gold - i.score + i.conscore,
max_multiple: 5,
max_gear: 10
};
this.Model.allWinGold = 0;
this.vg_roomInfo(n);
if (t[0].jackpot) {
this.Model.jackPotData = 0;
for (var s = [ .1, .15, .3, .45 ], r = t[0].jackpot, a = t[0].jacktype, c = r / s[a], l = [], d = 2; d <= 5; d++) d - 1 == a ? l.push(r) : l.push(Math.floor(c * s[d - 1]));
this.View.setJackPotData(l);
} else this.Model.jackPotData = t[0].jackpotAll;
var u = {
status: 1,
data: this.gameList.shift()
};
this.vg_rollMessage(u);
};
t.prototype.initData = function() {
var e = this;
this.Model = wUtils.creatorProxy(new i.DFDCModel());
this.View = this.node.getComponent(s.default);
this.View.init(this.Model);
this.Model.onEvevt("bet", function(t) {
if (t > e.Model.maxBet) e.Model.bet = 1; else if (t < 1) e.Model.bet = e.Model.maxBet; else {
e.View.setMul(e.Model.di_score * i.DFDCConfig.mul[e.Model.mul] * t);
e.View.setMaxBtn(e.Model.getMaxBet());
}
});
this.Model.onEvevt("mul", function(t) {
if (t > e.Model.maxMul) e.Model.mul = 1; else if (t < 1) e.Model.mul = e.Model.maxMul; else {
e.View.setMul(e.Model.di_score * i.DFDCConfig.mul[t] * e.Model.bet);
e.View.setMaxBtn(e.Model.getMaxBet());
e.View.setMulSpine(e.Model.initMul, t);
e.View.setJpMulShow(e.Model.initMul, t, !1);
e.View.setMulIcon(e.Model.initMul, t, 5 == e.Model.level ? 4 : 3);
e.Model.initMul = t;
e.View.recoveryNode();
e.Model.jackPotData = e.Model.jackPotData;
}
});
this.Model.onEvevt("gameState", function() {
e.View.setBtnEnabled(!1);
});
this.Model.onEvevt("gold", function(t) {
e.View.setGold(t);
});
this.Model.onEvevt("auto", function(t) {
e.View.setAutoState(t);
t && 0 == e.Model.gameState && e.requestRoll();
t ? e.offEvent() : e.onEvent();
});
this.Model.onEvevt("jackPotData", function() {
var t = e.Model.getJackPotList();
e.View.setJackPotData(t);
});
this.DFDCRotate.setEndCall(this.rollEnd.bind(this));
this.DFDCRotate.setIconCall(this.View.setIconSprite.bind(this.View));
this.DFDCRotate.setEndIconCall(function() {
e.View.setTopIcon(e.Model.iconList);
});
};
t.prototype.vg_roomInfo = function(e) {
if (0 == this.Model.gameState) {
this.Model.level = e.level;
this.Model.initIcon(e.map);
this.View.setAngleContentH(this.Model.iconList[0].length);
this.View.setBottomIcon(this.Model.iconList);
this.Model.isInitScene = !0;
this.Model.gold = e.gold;
this.Model.di_score = e.doublescore;
this.Model.maxMul = e.max_multiple;
this.Model.maxBet = e.max_gear;
this.Model.bet = e.gear;
this.Model.mul = e.curgrade;
this.Model.free = e.free;
this.Model.free4 = e.free4;
this.Model.curfree = e.free;
this.Model.free && wLog.e("初始化数据出现了错误");
}
};
t.prototype.vg_rollMessage = function(e) {
if (1 == e.status) {
e.data.conscore && this.View.setWinGold(0);
this.View.setWinTips(!0);
this.Model.free && this.View.setFreeCount(this.Model.free - 1);
if (3 == wGameData.roomLevel && 3 != this.Model.iconList[0].length && 3 == e.data.map[0].length) {
this.View.setAngleContentH(3);
for (var t = 0; t < 5; t++) this.Model.iconList[t].splice(3);
this.View.setBottomIcon(this.Model.iconList);
}
this.Model.gameState = 2;
this.View.setBtnStart(!1);
this.View.recoveryNode();
this.Model.initRollMsg(e.data);
this.View.initRollShow();
wAudioMgr.playSound("sound/roll_start", "DFDC");
wAudioMgr.playSound("sound/roll_move", "DFDC", !0);
this.DFDCRotate.roll(.6, 6 - this.Model.mul, this.Model.iconList[0].length);
if (0 == e.data.conscore) {
this.Model.allWinGold += e.data.score;
this.Model.allWinGold += e.data.jackpot;
} else this.Model.allWinGold = 0;
} else wLog.e("旋转消息出现错误");
};
t.prototype.initFree = function(e) {
void 0 === e && (e = 3);
this.View.initFreeBG(!0);
var t = [ [ 10, 10, 10 ], [ 4, 4, 4 ], [ 3, 3, 3 ], [ 2, 2, 2 ], [ 1, 1, 1 ] ];
if (3 != e) {
this.View.setAngleContentH(e);
for (var o = 0; o < 5; o++) for (var i = 0; i < e - 3; i++) t[o].push(t[o][0]);
}
this.View.recoveryNode();
this.View.setBottomIcon(t);
this.View.showFreeBtn(!0);
this.View.setFreeCount(this.Model.free);
this.View.setWinGold(0);
this.View.setWinTips(!1);
this.Model.allWinGold = 0;
};
t.prototype.winJackPot = function() {
return __awaiter(this, void 0, void 0, function() {
var e = this;
return __generator(this, function(t) {
switch (t.label) {
case 0:
this.View.setPenShow(4, function() {
e.View.setPenShow(5, null);
});
wAudioMgr.playSound("sound/sound-jackpot-exp", "DFDC");
return [ 4, wUtils.syncDelayed(3.5, this) ];

case 1:
t.sent();
return [ 4, new Promise(function(t) {
wViewMgr.openPage({
path: "prefab/DFDCJackPot",
bundle: "DFDC",
data: {
isBool: !0,
Model: e.Model,
cb: function() {
t(!0);
}
}
});
}) ];

case 2:
t.sent();
this.View.setWinGold(this.Model.jackpot);
this.Model.gold += this.Model.jackpot;
return [ 4, wUtils.syncDelayed(1.5, this) ];

case 3:
t.sent();
return [ 2 ];
}
});
});
};
t.prototype.jlffProcessControlle = function() {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(e) {
switch (e.label) {
case 0:
this.View.setWinTips(!1);
this.View.setBottomIcon(this.Model.iconList);
if (!this.Model.curMap.length) return [ 3, 2 ];
this.View.showIconResult(this.Model.curMap);
return [ 4, wUtils.syncDelayed(.4, this) ];

case 1:
e.sent();
e.label = 2;

case 2:
return this.Model.curMap.length ? [ 4, this.View.showWinEffect(this.Model.jackpot ? 1 : this.Model.winType, this.Model.score) ] : [ 3, 4 ];

case 3:
e.sent();
this.Model.gold += this.Model.score;
e.label = 4;

case 4:
return this.View.wildShow(this.Model.iconList.length) ? [ 4, wUtils.syncDelayed(.3, this) ] : [ 3, 6 ];

case 5:
e.sent();
e.label = 6;

case 6:
if (!this.Model.jackpot) return [ 3, 8 ];
wLog.w("->>>>>>>>>>>>>>>>中奖池了");
return [ 4, this.winJackPot() ];

case 7:
e.sent();
e.label = 8;

case 8:
if (!this.Model.curfree || this.Model.free != this.Model.curfree) return [ 3, 12 ];
wAudioMgr.playSound("sound/zfree", "DFDC");
wLog.w("->>>>>>>>>>>>>>>>中免费了" + this.Model.curfree);
return [ 4, this.View.startFree(this.Model.curfree) ];

case 9:
e.sent();
return [ 4, this.View.startJLFFFree() ];

case 10:
e.sent();
this.initFree();
wAudioMgr.playBgMusic("sound/f" + wGameData.roomLevel, "DFDC");
return [ 4, wUtils.syncDelayed(1, this) ];

case 11:
e.sent();
this.requestRoll();
return [ 3, 18 ];

case 12:
if (!this.Model.curfree) return [ 3, 15 ];
wLog.w("免费中出现免费:", this.Model.curfree);
return [ 4, this.View.startFree(this.Model.curfree) ];

case 13:
e.sent();
this.View.setFreeCount(this.Model.free);
return [ 4, wUtils.syncDelayed(.8, this) ];

case 14:
e.sent();
this.requestRoll();
return [ 3, 18 ];

case 15:
if (!this.Model.free) return [ 3, 16 ];
this.requestRoll();
return [ 3, 18 ];

case 16:
return [ 4, this.View.endFree(this.Model.free) ];

case 17:
e.sent();
this.Model.auto ? this.requestRoll() : this.Model.gameState = 0;
this.btn_Play.node.active = !0;
e.label = 18;

case 18:
return [ 2 ];
}
});
});
};
t.prototype.zsyyProcessControlle = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t;
return __generator(this, function(o) {
switch (o.label) {
case 0:
this.View.setWinTips(!1);
this.View.setBottomIcon(this.Model.iconList);
if (!this.Model.curMap.length) return [ 3, 2 ];
this.View.showIconResult(this.Model.curMap);
return [ 4, wUtils.syncDelayed(.4, this) ];

case 1:
o.sent();
o.label = 2;

case 2:
return this.Model.curMap.length ? [ 4, this.View.showWinEffect(this.Model.jackpot ? 1 : this.Model.winType, this.Model.score) ] : [ 3, 4 ];

case 3:
o.sent();
this.Model.gold += this.Model.score;
o.label = 4;

case 4:
return this.View.wildShow(this.Model.iconList.length) ? [ 4, wUtils.syncDelayed(.3, this) ] : [ 3, 6 ];

case 5:
o.sent();
o.label = 6;

case 6:
if (!this.Model.jackpot) return [ 3, 8 ];
wLog.w("->>>>>>>>>>>>>>>>中奖池了");
return [ 4, this.winJackPot() ];

case 7:
o.sent();
o.label = 8;

case 8:
if (0 != this.Model.free4 || !this.Model.curfree) return [ 3, 11 ];
wAudioMgr.playSound("sound/zfree", "DFDC");
wLog.w("->>>>>>>>>>>>>>>>中免费了" + this.Model.curfree);
return [ 4, this.View.startZSYYFree() ];

case 9:
e = o.sent();
t = {
5: 5,
4: 10,
3: 15
};
this.Model.free = t[e];
this.initFree(e);
wAudioMgr.playBgMusic("sound/f" + wGameData.roomLevel, "DFDC");
return [ 4, wUtils.syncDelayed(1, this) ];

case 10:
o.sent();
this.requestRoll();
return [ 3, 17 ];

case 11:
if (!this.Model.curfree) return [ 3, 14 ];
wLog.w("免费中出现免费:", this.Model.curfree);
return [ 4, this.View.startFree(this.Model.curfree) ];

case 12:
o.sent();
this.View.setFreeCount(this.Model.free);
return [ 4, wUtils.syncDelayed(.8, this) ];

case 13:
o.sent();
this.requestRoll();
return [ 3, 17 ];

case 14:
if (!this.Model.free) return [ 3, 15 ];
this.requestRoll();
return [ 3, 17 ];

case 15:
return [ 4, this.View.endFree(this.Model.free) ];

case 16:
o.sent();
this.Model.auto ? this.requestRoll() : this.Model.gameState = 0;
this.btn_Play.node.active = !0;
o.label = 17;

case 17:
return [ 2 ];
}
});
});
};
t.prototype.cfxmProcessControlle = function() {
return __awaiter(this, void 0, void 0, function() {
var e;
return __generator(this, function(t) {
switch (t.label) {
case 0:
this.View.setWinTips(!1);
this.View.setBottomIcon(this.Model.iconList);
if (!this.Model.curMap.length) return [ 3, 2 ];
this.View.showIconResult(this.Model.curMap);
return [ 4, wUtils.syncDelayed(.4, this) ];

case 1:
t.sent();
t.label = 2;

case 2:
return this.Model.curMap.length ? [ 4, this.View.showWinEffect(this.Model.jackpot ? 1 : this.Model.winType, this.Model.score) ] : [ 3, 4 ];

case 3:
t.sent();
this.Model.gold += this.Model.score;
t.label = 4;

case 4:
return this.View.wildShow(this.Model.iconList.length) ? [ 4, wUtils.syncDelayed(.3, this) ] : [ 3, 6 ];

case 5:
t.sent();
t.label = 6;

case 6:
if (!this.Model.jackpot) return [ 3, 8 ];
wLog.w("->>>>>>>>>>>>>>>>中奖池了");
return [ 4, this.winJackPot() ];

case 7:
t.sent();
t.label = 8;

case 8:
if (0 != this.Model.free4 || !this.Model.curfree) return [ 3, 11 ];
wAudioMgr.playSound("sound/zfree", "DFDC");
wLog.w("->>>>>>>>>>>>>>>>中免费了" + this.Model.curfree);
return [ 4, this.View.startCFXMFree() ];

case 9:
e = t.sent();
this.Model.free = e;
this.initFree();
wAudioMgr.playBgMusic("sound/f" + wGameData.roomLevel, "DFDC");
return [ 4, wUtils.syncDelayed(1, this) ];

case 10:
t.sent();
this.requestRoll();
return [ 3, 17 ];

case 11:
if (!this.Model.curfree) return [ 3, 14 ];
wLog.w("免费中出现免费:", this.Model.curfree);
return [ 4, this.View.startFree(this.Model.curfree) ];

case 12:
t.sent();
this.View.setFreeCount(this.Model.free);
return [ 4, wUtils.syncDelayed(.8, this) ];

case 13:
t.sent();
this.requestRoll();
return [ 3, 17 ];

case 14:
if (!this.Model.free) return [ 3, 15 ];
this.requestRoll();
return [ 3, 17 ];

case 15:
return [ 4, this.View.endFree(this.Model.free) ];

case 16:
t.sent();
this.Model.auto ? this.requestRoll() : this.Model.gameState = 0;
this.btn_Play.node.active = !0;
t.label = 17;

case 17:
return [ 2 ];
}
});
});
};
t.prototype.jgfcProcessControlle = function() {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(e) {
switch (e.label) {
case 0:
this.View.setWinTips(!1);
this.View.setBottomIcon(this.Model.iconList);
if (!this.Model.curMap.length) return [ 3, 2 ];
this.View.showIconResult(this.Model.curMap);
return [ 4, wUtils.syncDelayed(.4, this) ];

case 1:
e.sent();
e.label = 2;

case 2:
return this.Model.curMap.length ? [ 4, this.View.showWinEffect(this.Model.jackpot ? 1 : this.Model.winType, this.Model.score) ] : [ 3, 4 ];

case 3:
e.sent();
this.Model.gold += this.Model.score;
e.label = 4;

case 4:
return this.View.wildShow(this.Model.iconList.length) ? [ 4, wUtils.syncDelayed(.3, this) ] : [ 3, 6 ];

case 5:
e.sent();
e.label = 6;

case 6:
if (!this.Model.jackpot) return [ 3, 8 ];
wLog.w("->>>>>>>>>>>>>>>>中奖池了");
return [ 4, this.winJackPot() ];

case 7:
e.sent();
e.label = 8;

case 8:
if (!this.Model.curfree || this.Model.free != this.Model.curfree) return [ 3, 12 ];
wAudioMgr.playSound("sound/zfree", "DFDC");
wLog.w("->>>>>>>>>>>>>>>>中免费了" + this.Model.curfree);
return [ 4, this.View.startFree(this.Model.curfree) ];

case 9:
e.sent();
return [ 4, this.View.startJLFFFree() ];

case 10:
e.sent();
this.initFree(4);
wAudioMgr.playBgMusic("sound/f" + wGameData.roomLevel, "DFDC");
return [ 4, wUtils.syncDelayed(1, this) ];

case 11:
e.sent();
this.requestRoll();
return [ 3, 18 ];

case 12:
if (!this.Model.curfree) return [ 3, 15 ];
wLog.w("免费中出现免费:", this.Model.curfree);
this.View.jgfcAddFreeCount();
return [ 4, this.View.startFree(this.Model.curfree) ];

case 13:
e.sent();
this.View.setFreeCount(this.Model.free);
return [ 4, wUtils.syncDelayed(.8, this) ];

case 14:
e.sent();
this.requestRoll();
return [ 3, 18 ];

case 15:
if (!this.Model.free) return [ 3, 16 ];
this.requestRoll();
return [ 3, 18 ];

case 16:
return [ 4, this.View.endFree(this.Model.free) ];

case 17:
e.sent();
this.Model.auto ? this.requestRoll() : this.Model.gameState = 0;
this.btn_Play.node.active = !0;
e.label = 18;

case 18:
return [ 2 ];
}
});
});
};
t.prototype.onClick = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function() {
switch (t) {
case "exit":
wAudioMgr.stopAllEffects();
wAudioMgr.playCloseSound();
this.node.destroy();
break;

case "play":
wAudioMgr.playBtnSound();
this.init();
}
wAudioMgr.playBtnSound();
return [ 2 ];
});
});
};
t.prototype.onEvent = function() {
this.DFDCRotate.setEndCall(this.rollEnd.bind(this));
};
t.prototype.offEvent = function() {};
t.prototype.startEvent = function() {
var e = this;
this.scheduleOnce(function() {
e.Model.auto = !0;
}, 1);
};
t.prototype.endEvent = function() {
this.unscheduleAllCallbacks();
this.Model.auto || (0 != this.Model.gameState ? 2 != this.Model.gameState || this.DFDCRotate.stop() : this.requestRoll());
};
t.prototype.requestRoll = function() {
var e = this.gameList.shift();
if (e) {
var t = {
status: 1,
data: e
};
this.vg_rollMessage(t);
} else {
this.btn_Play.interactable = !0;
this.btn_Play.node.opacity = 255;
}
};
t.prototype.vg_upGameGold = function() {
this.Model.gold = wGameData.getKey("gold");
};
t.prototype.rollEnd = function(e) {
wAudioMgr.playSound("sound/roll_end", "DFDC");
if (4 == e) {
wAudioMgr.stopEffects("sound/roll_start");
wAudioMgr.stopEffects("sound/roll_move");
this.Model.gameState = 3;
this[this.Model.getGameType() + "ProcessControlle"]();
}
};
__decorate([ c(n.default) ], t.prototype, "DFDCRotate", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btn_Play", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {
DFDCModel: "DFDCModel",
DFDCRotate: "DFDCRotate",
DFDCView: "DFDCView"
} ],
DFDCModel: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "1662en92rhNjrfGdVyW2AQ3", "DFDCModel");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.DFDCModel = o.DFDCConfig = void 0;
o.DFDCConfig = {
mul: [ 0, 1, 4, 7, 10, 15 ],
mulNum: [ 0, 100, 100, 175, 250, 375 ],
lv_jpUrlType: {
2: "jlff",
3: "zsyy",
4: "cfxm",
5: "jgfc"
},
iconUrl: {
2: "plist_dfdc_icon_",
3: "plist_dfdc_icon_2_",
4: "plist_dfdc_icon_3_",
5: "plist_dfdc_icon_4_"
},
iconID: {
1: "1",
2: "2",
3: "3",
4: "4",
5: "6",
6: "7",
7: "8",
8: "9",
9: "17",
10: "5",
11: "16",
12: "10",
13: "11",
14: "12",
15: "13",
16: "14",
17: "15",
18: "18"
},
jlffIconSpine: {
1: "dfdczj_1",
2: "dfdczj_2",
3: "dfdczj_3",
4: "dfdczj_4_guess_2",
5: "dfdczj_6",
6: "dfdczj_7",
7: "dfdczj_3_guess_2",
8: "dfdczj_4",
9: "dfdczj_18",
10: "dfdczj_5",
11: "dfdczj_16_guess_4",
12: "dfdczj_10",
13: "dfdczj_11",
14: "dfdczj_12",
15: "dfdczj_13",
16: "dfdczj_14",
17: "dfdczj_15"
},
zsyyIconSpine: {
1: "dfdczj_2_1_guess_3",
2: "dfdczj_2_2_guess_40",
3: "dfdczj_2_3_guess_13",
4: "dfdczj_2_4",
5: "dfdczj_2_6_guess_2",
6: "dfdczj_2_7_guess_37",
7: "dfdczj_2_8_guess_19",
8: "dfdczj_2_9_guess_4",
9: "dfdczj_2_17_guess_35",
10: "dfdczj_2_5_guess_38",
11: "dfdczj_2_16_guess_8",
12: "dfdczj_2_10_guess_13",
13: "dfdczj_2_11_guess_14",
14: "dfdczj_2_12_guess_15",
15: "dfdczj_2_13_guess_5",
16: "dfdczj_2_14",
17: "dfdczj_2_15_guess_6",
18: "dfdczj_2_18_guess_11"
},
cfxmIconSpine: {
1: "dfdczj_3_1_guess_7",
2: "dfdczj_3_2_guess_21",
3: "dfdczj_3_3_guess_4",
4: "dfdczj_3_4_guess_29",
5: "dfdczj_3_6_guess_25",
6: "dfdczj_3_7_guess_8",
7: "dfdczj_3_8_guess_18",
8: "dfdczj_3_9_guess_20",
9: "dfdczj_3_17_guess_34",
10: "dfdczj_3_5_guess_5",
11: "dfdczj_3_16_guess_3",
12: "dfdczj_3_10_guess_24",
13: "dfdczj_3_11_guess_32",
14: "dfdczj_3_12",
15: "dfdczj_3_13_guess_12",
16: "dfdczj_3_14_guess_23",
17: "dfdczj_3_15_guess_28"
},
jgfcIconSpine: {
1: "dfdczj_4_1_guess_2",
2: "dfdczj_4_2_guess_18",
3: "dfdczj_4_3_guess_14",
4: "dfdczj_4_4_guess_10",
5: "dfdczj_4_6_guess_11",
6: "dfdczj_4_7_guess_22",
7: "dfdczj_4_8_guess_30",
8: "dfdczj_4_9_guess_17",
9: "dfdczj_4_17_guess_39",
10: "dfdczj_4_5_guess_4",
11: "dfdczj_4_16_guess_5",
12: "dfdczj_4_10_guess_2",
13: "dfdczj_4_11_guess_17",
14: "dfdczj_4_12_guess_8",
15: "dfdczj_4_13_guess_16",
16: "dfdczj_4_14_guess_10",
17: "dfdczj_4_15_guess_9"
}
};
var i = function() {
function e() {
this.gold = 0;
this.win = 0;
this.iconList = [ [], [], [], [], [] ];
this.auto = !1;
this.initMul = 1;
this.mul = 1;
this.maxMul = 0;
this.bet = 0;
this.maxBet = 0;
this.di_score = 100;
this.conscore = 0;
this.winBet = 0;
this.score = 0;
this.allWinGold = 0;
this.jackpot = 0;
this.jackpotType = 0;
this.jackpotAll = 0;
this.curfree = 0;
this.free = 0;
this.gameState = 0;
this.isInitScene = !1;
this.jackPotData = 0;
this.rotateJS = !1;
}
e.prototype.initIcon = function(e) {
if (e && e.length) this.iconList = e; else for (var t = wUtils.random(9, 17), o = 5 == this.level ? 4 : 3, i = 0; i < 5; i++) for (var n = 0; n < o; n++) this.iconList[i].push(t);
};
e.prototype.initRollMsg = function(e) {
this.conscore = e.conscore;
this.winBet = e.beishu;
this.score = e.score;
this.gold -= e.conscore;
this.curMap = e.curMap;
this.curfree = e.curfree;
this.free4 = e.free4;
this.free = e.free;
this.diamonds = e.diamonds;
this.jackpot = e.jackpot;
this.jackpotType = e.jacktype;
this.jackpotAll = e.jackpotAll;
this.winType = e.type;
this.initIcon(e.map);
};
e.prototype.getMaxBet = function() {
return this.bet != this.maxBet || this.mul != this.maxMul;
};
e.prototype.getGameType = function() {
return o.DFDCConfig.lv_jpUrlType[this.level];
};
e.prototype.getIcon = function(e) {
return o.DFDCConfig.iconUrl[this.level] + o.DFDCConfig.iconID[e];
};
e.prototype.getIconSpine = function(e) {
var t = this.getGameType();
return "spine/" + t + "/icon/" + o.DFDCConfig[t + "IconSpine"][e];
};
e.prototype.getJackPotList = function() {
for (var e = [ .1, .15, .3, .45 ], t = [], i = o.DFDCConfig.mulNum[this.mul] / 100, n = 0; n < e.length; n++) t.push(this.jackPotData * e[n] / 3.75 * i);
return t;
};
return e;
}();
o.DFDCModel = i;
cc._RF.pop();
}, {} ],
DFDCRoom: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "134fbgBOphOMYTrDh+qNPtH", "DFDCRoom");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("Config"), n = cc._decorator, s = n.ccclass, r = n.property, a = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.top = null;
t.gold = null;
t.jackPot = null;
t.isEnterRoom = !1;
t.isExit = !1;
return t;
}
t.prototype.onLoad = function() {
var e = this;
wAudioMgr.playBgMusic("sound/room", wGameData.getGameName());
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
e.initShow();
}, this);
if (wGameData.isReconnect) this.loadGame(); else {
this.initRoom();
this.initJackPot();
}
};
t.prototype.onEnable = function() {
if (!wGameData.isReconnect) {
this.gold && (this.gold.string = wUtils.numConvert(wGameData.getKey("gold")));
this.enterAni();
}
};
t.prototype.local_Event = function(e) {
switch (e) {
case "up_Gold":
this.gold && (this.gold.string = wUtils.numConvert(wGameData.getKey("gold")));
}
};
t.prototype.initRoom = function() {
var e = wGameData.roomConfig;
for (var t in e) if (Object.prototype.hasOwnProperty.call(e, t)) {
var o = Number(t) - 1;
this.content.getChildByName("" + o).on("click", this.roomOnClick, this);
}
};
t.prototype.initShow = function() {
this.isEnterRoom = !1;
this.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
this.node.parent.destroyAllChildren();
}
};
t.prototype.enterAni = function() {
this.top.stopAllActions();
this.top.y = 450;
var e = cc.moveTo(.25, cc.v2(0, 362)), t = cc.moveTo(.15, cc.v2(0, 375));
this.top.runAction(cc.sequence(e, t));
this.content.stopAllActions();
this.content.x = 150;
e = cc.moveTo(.25, cc.v2(-12, 0));
t = cc.moveTo(.15, cc.v2(0, 0));
this.content.runAction(cc.sequence(e, t));
};
t.prototype.Msg_Hall_EnterRoom = function(e) {
if (1 == e.status) {
wGameData.roomID = e.data.rid;
this.loadGame();
} else {
wLog.e("进入房间消息失败");
wGameData.roomID = null;
wGameData.isReconnect = !1;
wUIManager.hideLoadingUI();
}
};
t.prototype.enterRoom = function(e) {
var t = this;
if (!this.isEnterRoom) {
wGameData.roomLevel = e;
var o = wGameData.roomConfig[e];
if (o) if (o.min_gold > wGameData.getKey("gold")) wUIManager.enterRoomFailTips(o.min_gold); else if (wGameData.gameRepair()) wUIManager.showTips("游戏维护中"); else {
this.isEnterRoom = !0;
var i = wGEvent.on("Msg_Hall_EnterRoom", function(e) {
t.Msg_Hall_EnterRoom(e);
wGEvent.off(i);
t.unscheduleAllCallbacks();
i = null;
}, this);
this.scheduleOnce(function() {
if (i) {
t.isEnterRoom = !1;
wGEvent.off(i);
}
}, 20);
wNetWork.send("Msg_Hall_EnterRoom", {
tableid: 0,
gtype: Number(wGameData.gameID),
level: e
});
} else wUIManager.showTips("游戏配置错误，请重新进入游戏！");
}
};
t.prototype.roomOnClick = function(e) {
wAudioMgr.playBtnSound();
var t = e.node.name;
this.enterRoom(Number(t) + 1);
};
t.prototype.onClick = function(e) {
if (!this.isExit) {
switch (e.target.name) {
case "exit":
this.isExit = !0;
wAudioMgr.playCloseSound();
wViewMgr.enterHall();
return;

case "rule":
wViewMgr.openPage({
path: "prefab/Rule",
bundle: wGameData.getGameName()
});
break;

case "bank":
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
}
wAudioMgr.playBtnSound();
}
};
t.prototype.loadGame = function() {
var e = i.Config.GamePrefab[wGameData.gameID];
wRes.loadRes([ "prefab/JLFFMain", "prefab/ZSYHMain", "prefab/CFXMMain", "prefab/JGFCMain" ][wGameData.roomLevel - 2], function() {}, function(e, t) {
e ? wLog.e(e) : wViewMgr.openGame(t);
}, e.enName);
};
t.prototype.initJackPot = function() {
var e = this;
wGEvent.on("Msg_Game_Jackpot", function(t) {
if (1 == t.status && t.data) {
var o = t.data[0] ? t.data[0].jackpot : 0;
o && (o += wUtils.random(500, 200) * (wUtils.random(1, 10) <= 5 ? 1 : -1));
e.setJackPotData(o);
}
}, this);
this.node.stopAllActions();
var t = cc.callFunc(function() {
wNetWork.send("Msg_Game_Jackpot", {
gtype: wGameData.gameID,
level: 2
});
}), o = cc.delayTime(5), i = cc.repeatForever(cc.sequence(t, o));
this.node.runAction(i);
};
t.prototype.setJackPotData = function(e, t) {
void 0 === t && (t = 10);
for (var o = [ .1, .15, .3, .45 ], i = 0; i < 4; i++) {
var n = this.jackPot.getChildByName("" + (i + 2)), s = Math.floor(e * o[i]);
n.getComponent(cc.Label).string = wUtils.numConvert(s);
}
};
__decorate([ r(cc.Node) ], t.prototype, "content", void 0);
__decorate([ r(cc.Node) ], t.prototype, "top", void 0);
__decorate([ r(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ r(cc.Node) ], t.prototype, "jackPot", void 0);
return __decorate([ s ], t);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {
Config: void 0
} ],
DFDCRotate: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "5a1f4MYPZxHlYxskoWtX06K", "DFDCRotate");
var i;
Object.defineProperty(o, "__esModule", {
value: !0
});
o.RollConfig = void 0;
o.RollConfig = {
contentHeigth: 494,
item_V_Num: 3,
item_H_Num: 5,
allCount: 11,
manyItem: 4,
addRollSpeed: 1100,
rollSpeed: 3e3,
bufferLen: 50,
bufferTime: .25,
speedCount: 1
};
(function(e) {
e[e.START = 0] = "START";
e[e.ENDING = 1] = "ENDING";
e[e.END = 2] = "END";
})(i || (i = {}));
var n = cc._decorator, s = n.ccclass, r = n.property, a = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.rollNodes = [];
t.onRoll = !1;
t.onStop = !1;
t.oneCallback = null;
t.setIconSpriteCall = null;
t.setEndIcon = null;
t.iconList = [ [], [], [], [], [] ];
t.rollStatus = [];
t.speedIdx = {};
t.rollEndIdx = -1;
return t;
}
t.prototype.start = function() {
for (var e = 0; e < this.rollNodes.length; e++) for (var t = 0, o = this.rollNodes[e].children; t < o.length; t++) {
var i = o[t];
this.iconList[e].push(i);
}
};
t.prototype.rotateEnd = function() {
this.onRoll = !1;
this.onStop = !1;
};
t.prototype.setEndCall = function(e) {
this.oneCallback = e;
};
t.prototype.setIconCall = function(e) {
this.setIconSpriteCall = e;
};
t.prototype.setEndIconCall = function(e) {
this.setEndIcon = e;
};
t.prototype.stop = function() {
return __awaiter(this, void 0, void 0, function() {
var e;
return __generator(this, function() {
if (this.onStop || !this.onRoll) return [ 2 ];
for (e = 0; e < this.rollNodes.length; e++) this.rollNodes[e].stopAllActions();
this.rotateEnd();
this.unscheduleAllCallbacks();
this.oneCallback(4);
return [ 2 ];
});
});
};
t.prototype.roll = function(e, t, n) {
var s = this;
if (!this.onRoll) {
this.onRoll = !0;
this.rollEndIdx = -1;
this.speedIdx = {};
this.iconStartIDx = t;
o.RollConfig.item_V_Num = n;
for (var r = function(e) {
var t = a.rollNodes[e];
t.endPosY = -(t.height - o.RollConfig.contentHeigth);
a.rollStatus[e] = i.END;
a.scheduleOnce(function() {
o = cc.moveBy(.15, cc.v2(0, 70));
n = cc.callFunc(function() {
s.rollStatus[e] = i.START;
});
r = cc.sequence(o, n);
t.runAction(r);
var o, n, r;
}, .08 * e);
}, a = this, c = 0; c < this.rollNodes.length; c++) r(c);
this.scheduleOnce(function() {
s.onStop = !0;
}, 2 * e);
}
};
t.prototype.swapIcon = function(e, t) {
var i;
void 0 === t && (t = 0);
for (var n = this.iconList[e], s = o.RollConfig.allCount - o.RollConfig.item_V_Num + e * t, r = 0; s < n.length; s++, 
r++) {
var a = n[s].getChildByName("icon").getComponent(cc.Sprite);
n[r].getChildByName("icon").getComponent(cc.Sprite).spriteFrame = a.spriteFrame;
i = [ n[r].icon, [ n[s].icon ] ];
n[s].icon = i[0];
n[r].icon = i[1];
}
};
t.prototype.randomIcon = function(e) {
for (var t = this.iconList[e], i = o.RollConfig.item_V_Num + 2; i < t.length; i++) {
var n = t[i];
n.icon = this.getIconID();
this.setIconSpriteCall(n, n.icon);
}
};
t.prototype.getIconID = function() {
return wUtils.random(this.iconStartIDx, 17);
};
t.prototype.update = function(e) {
var t = this;
if (this.onRoll) for (var n = function(n) {
if (s.rollStatus[n] == i.END) return "continue";
var r = o.RollConfig.rollSpeed;
s.onStop && s.speedIdx[s.rollEndIdx] >= 0 && s.rollEndIdx == n && (r = o.RollConfig.addRollSpeed);
var a = r * e, c = s.rollNodes[n];
c.y -= a;
var l = s.rollStatus[n] == i.ENDING, d = l ? c.endPosY : s.rollNodes[0].endPosY;
if (c.y > d + (l ? -o.RollConfig.bufferLen : 0)) return "continue";
if (!s.onStop || s.speedIdx[n] > 0) {
s.rollEndIdx == n && s.speedIdx[n]--;
s.swapIcon(n);
s.randomIcon(n);
c.y -= d;
} else {
s.rollStatus[n]++;
l = s.rollStatus[n] == i.ENDING;
s.swapIcon(n, l ? 0 : o.RollConfig.manyItem);
c.y -= d;
if (l) {
s.randomIcon(n);
s.setEndIcon(n);
} else if (s.rollStatus[n] == i.END) {
n == s.rollNodes.length - 1 && s.rotateEnd();
s.rollEndIdx = n + 1;
wAudioMgr.playSound("sound/roll_end", "DFDC");
var u = cc.moveTo(o.RollConfig.bufferTime, cc.v2(c.x, 0)), h = cc.callFunc(function() {
t.oneCallback && t.oneCallback(n);
}), p = cc.sequence(u, h);
c.runAction(p);
}
}
}, s = this, r = 0; r < this.rollNodes.length; r++) n(r);
};
__decorate([ r([ cc.Node ]) ], t.prototype, "rollNodes", void 0);
return __decorate([ s ], t);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
DFDCRule: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "075d5k7A7VMOqQ1jXKg0plM", "DFDCRule");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("PopupBase"), n = cc._decorator, s = n.ccclass, r = n.property, a = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
return t;
}
t.prototype.onLoad = function() {
var e = this;
this.content.opacity = 0;
for (var t = "UI/rule/" + (wGameData.roomLevel - 1) + "_", o = function(o) {
var i = t + o;
wRes.loadRes(i, cc.SpriteFrame, function(t, i) {
e.content.getChildByName("" + o).getComponent(cc.Sprite).spriteFrame = i;
}, "DFDC");
}, i = 1; i < 5; i++) o(i);
};
t.prototype.onShow = function() {
var e = this;
this.scheduleOnce(function() {
e.content.opacity = 255;
}, .2);
};
__decorate([ r(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ s ], t);
}(i.default);
o.default = a;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
DFDCSelectFreeCfxm: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "1eac4QBEqFOYogj6hgWVQkr", "DFDCSelectFreeCfxm");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("PopupBase"), n = e("NetInterface"), s = cc._decorator, r = s.ccclass, a = s.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.btn_suiji = null;
t.list = [];
t.type = null;
t.curfree = null;
return t;
}
t.prototype.onLoad = function() {
wGEvent.on("Msg_DFDC_ChangeIcon", this.Msg_DFDC_ChangeIcon, this);
wGEvent.on("local_SocketState", this.vg_NetWorkState, this);
};
t.prototype.vg_NetWorkState = function(e) {
e != n.netWorkState.CONNECTSUCCESS && e != n.netWorkState.RECONNECTSUCCESS || this.initBtn();
};
t.prototype.show = function(e) {
var t = this, o = this.node.getChildByName("spine");
o.active = !0;
wUIHelp.playSpine(o, "animation", function() {
o.active = !1;
});
this.main.opacity = 0;
var i = cc.fadeIn(.3), n = cc.callFunc(function() {
t.init(e);
}), s = cc.sequence(i, n);
this.scheduleOnce(function() {
t.main.runAction(s);
}, .5);
};
t.prototype.init = function(e) {
var t = this;
this.Model = e.Model;
this.cb = e.cb;
this.curfree = e.curfree;
if (this.curfree) {
this.btn_suiji.interactable = !1;
this.scheduleOnce(function() {
t.Msg_DFDC_ChangeIcon({
status: 1
});
}, 1.2);
} else this.initBtn();
};
t.prototype.Msg_DFDC_ChangeIcon = function(e) {
var t = this;
if (1 == e.status) {
var o = this.curfree;
this.curfree || (o = {
5: 20,
4: 15,
3: 10,
2: 7,
1: 5
}[this.type]);
wAudioMgr.playSound("sound/sound-free-choice-cfxm", "DFDC");
var i = this.main.getChildByName("jgspine");
i.active = !0;
i.getComponent(sp.Skeleton).setSkin("cfxm_mfyx" + o);
this.cb(o);
wUIHelp.playSpine(i, "animation", function() {
t.node.destroy();
});
} else wLog.e("出现错误");
};
t.prototype.sendMsg = function(e) {
this.setBtn_ZH();
wNetWork.send("Msg_DFDC_ChangeIcon", {
type: 5 == e ? 10 : e
});
this.type = e;
};
t.prototype.onClick = function() {
if (!this.type) {
wAudioMgr.playSound("sound/sound-free-random-zsyy", "DFDC");
var e = wUtils.random(0, this.list.length - 1);
this.sendMsg(this.list[e]);
}
};
t.prototype.initBtn = function() {
for (var e = this, t = function(t) {
var i = o.content.children[t], n = Number(i.name);
i.getComponent(cc.Button).interactable = !0;
o.list.push(n);
o.curfree || i.on("click", function() {
wAudioMgr.playSound("sound/sound-button", "DFDC");
e.sendMsg(n);
});
}, o = this, i = 0; i < 5; i++) t(i);
this.btn_suiji.interactable = !0;
};
t.prototype.setBtn_ZH = function() {
for (var e = 0, t = this.content.children; e < t.length; e++) t[e].getComponent(cc.Button).interactable = !1;
this.btn_suiji.interactable = !1;
};
__decorate([ a(cc.Node) ], t.prototype, "content", void 0);
__decorate([ a(cc.Button) ], t.prototype, "btn_suiji", void 0);
return __decorate([ r ], t);
}(i.default);
o.default = c;
cc._RF.pop();
}, {
NetInterface: void 0,
PopupBase: void 0
} ],
DFDCSelectFreeZsyy: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b3237rSGZFIgrwbwyUN7H9Y", "DFDCSelectFreeZsyy");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("PopupBase"), n = e("NetInterface"), s = cc._decorator, r = s.ccclass, a = s.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.btn_suiji = null;
t.list = [];
t.type = null;
t.curfree = null;
return t;
}
t.prototype.onLoad = function() {
wGEvent.on("Msg_DFDC_ChangeMap", this.Msg_DFDC_ChangeMap, this);
wGEvent.on("local_SocketState", this.vg_NetWorkState, this);
};
t.prototype.vg_NetWorkState = function(e) {
e != n.netWorkState.CONNECTSUCCESS && e != n.netWorkState.RECONNECTSUCCESS || this.initBtn();
};
t.prototype.show = function(e) {
var t = this, o = this.node.getChildByName("spine");
o.active = !0;
wUIHelp.playSpine(o, "animation", function() {
o.active = !1;
});
this.main.opacity = 0;
var i = cc.fadeIn(.3), n = cc.callFunc(function() {
t.init(e);
}), s = cc.sequence(i, n);
this.scheduleOnce(function() {
t.main.runAction(s);
}, .5);
};
t.prototype.init = function(e) {
var t = this;
this.Model = e.Model;
this.cb = e.cb;
this.curfree = e.curfree;
if (this.curfree) {
this.btn_suiji.interactable = !1;
this.scheduleOnce(function() {
t.Msg_DFDC_ChangeMap({
status: 1
});
}, 1.2);
} else this.initBtn();
};
t.prototype.Msg_DFDC_ChangeMap = function(e) {
var t = this;
if (1 == e.status) {
wAudioMgr.playSound("sound/sound-free-choice-zsyy", "DFDC");
var o = {
5: 5,
4: 10,
3: 15
}, i = this.curfree;
if (this.curfree) {
o = {
5: 5,
10: 4,
15: 3
};
this.type = o[i];
} else i = o[this.type];
var n = this.main.getChildByName("jgspine");
n.active = !0;
n.getComponent(sp.Skeleton).setSkin("zsyh_mfyx" + i);
this.cb(this.type);
wUIHelp.playSpine(n, "animation", function() {
t.node.destroy();
});
} else wLog.e("出现错误");
};
t.prototype.sendMsg = function(e) {
this.setBtn_ZH();
wNetWork.send("Msg_DFDC_ChangeMap", {
width: e
});
this.type = e;
};
t.prototype.onClick = function() {
if (!this.type) {
wAudioMgr.playSound("sound/sound-free-random-zsyy", "DFDC");
var e = wUtils.random(0, this.list.length - 1);
this.sendMsg(this.list[e]);
}
};
t.prototype.initBtn = function() {
for (var e = this, t = function(t) {
var i = o.content.children[t], n = Number(i.name);
i.getComponent(cc.Button).interactable = !0;
o.list.push(n);
o.curfree || i.on("click", function() {
wAudioMgr.playSound("sound/sound-button", "DFDC");
e.sendMsg(n);
});
}, o = this, i = 0; i < 3; i++) t(i);
this.btn_suiji.interactable = !0;
};
t.prototype.setBtn_ZH = function() {
for (var e = 0, t = this.content.children; e < t.length; e++) t[e].getComponent(cc.Button).interactable = !1;
this.btn_suiji.interactable = !1;
};
__decorate([ a(cc.Node) ], t.prototype, "content", void 0);
__decorate([ a(cc.Button) ], t.prototype, "btn_suiji", void 0);
return __decorate([ r ], t);
}(i.default);
o.default = c;
cc._RF.pop();
}, {
NetInterface: void 0,
PopupBase: void 0
} ],
DFDCView: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e355c/SIm1GRa79tCXr+qEc", "DFDCView");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("NodePool"), n = e("DFDCRotate"), s = cc._decorator, r = s.ccclass, a = s.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.icon = [];
t.commonImg = null;
t.bottomBtnList = [];
t.mul = null;
t.jackPot = null;
t.jpMul = null;
t.myGold = null;
t.win = null;
t.btn_start = null;
t.btn_stop = null;
t.btn_auto = null;
t.btn_free = null;
t.aContent = null;
t.iContent = null;
t.freeNode = null;
t.iconFrame = null;
t.iconSp = null;
t.zsyhZSMul = null;
t.jgfcFreeCount = null;
t.count = 0;
return t;
}
t.prototype.init = function(e) {
var t = this;
this.Model = e;
var o = this.node.getChildByName("item");
for (var s in this.aContent.children) for (var r = this.aContent.children[s], a = 0; a < n.RollConfig.allCount + Number(s) * n.RollConfig.manyItem; a++) {
var c = cc.instantiate(o);
c.parent = r;
c.x = 0;
c.active = !0;
}
var l = "spine/" + this.Model.getGameType() + "/icon";
wRes.preloadDir(l, function() {
wLog.i("----------icon预加载完成");
}, "DFDC");
wRes.loadRes("prefab/IconFrame", cc.Prefab, function(e, o) {
t.iconFrame = new i.default(o, 5);
}, "DFDC");
var d = new cc.Node();
d.addComponent(sp.Skeleton).premultipliedAlpha = !1;
this.iconSp = new i.default(d, 2);
wRes.loadRes("prefab/jgfc_free", cc.Prefab, function(e, o) {
t.jgfcFreeCount = new i.default(o, 4);
}, "DFDC");
if (3 == wGameData.roomLevel) {
var u = this.node.getChildByName("zsyh_wild");
this.zsyhZSMul = new i.default(u, 1);
this.zsyhZSMul.put(u);
}
var h = wUtils.handleNameLen(wGameData.getKey("nickname"), 10);
cc.find("bottom/info/name", this.node).getComponent(cc.Label).string = h;
wUIHelp.setHead(cc.find("bottom/info/head", this.node), wGameData.getKey("headimgurl"));
};
t.prototype.startJLFFFree = function() {
var e = this;
return new Promise(function(t) {
var o = e.freeNode.getChildByName("spine");
o.active = !0;
e.scheduleOnce(function() {
cc.find("freeBg", e.node).active = !0;
t(1);
}, .5);
wAudioMgr.playSound("sound/jg", "DFDC");
wUIHelp.playSpine(o, "animation", function() {
o.active = !1;
});
});
};
t.prototype.jgfcAddFreeCount = function() {
for (var e = this.Model.iconList[0].length, t = 0, o = this.aContent.children; t < o.length; t++) for (var i = o[t], n = 0; n < e; n++) {
var s = i.children[n], r = s.icon;
if (11 == r || 9 == r) {
var a = this.getPos(s, this.iContent), c = this.jgfcFreeCount.getNode;
this.iContent.addChild(c, 50, "jgfc_free");
c.setPosition(a);
wUIHelp.playSpine(c, "animation", null, !0);
if (255 != s.opacity) continue;
s.opacity = 0;
var l = this.iconFrame.getNode;
l.scale = s.scale;
this.iContent.addChild(l, 5);
l.setPosition(a);
}
}
};
t.prototype.startCFXMFree = function(e) {
var t = this;
wAudioMgr.playSound("sound/freexc", "DFDC");
return new Promise(function(o) {
wViewMgr.openPage({
path: "prefab/cfxmSelectFree",
bundle: "DFDC",
data: {
Model: t.Model,
cb: o,
curfree: e
}
});
});
};
t.prototype.startZSYYFree = function(e) {
var t = this;
wAudioMgr.playSound("sound/freexc", "DFDC");
return new Promise(function(o) {
wViewMgr.openPage({
path: "prefab/zsyySelectFree",
bundle: "DFDC",
data: {
Model: t.Model,
cb: o,
curfree: e
}
});
});
};
t.prototype.initFreeBG = function(e) {
cc.find("freeBg", this.node).active = e;
};
t.prototype.setFreeCount = function(e) {
this.btn_free.getChildByName("label").getComponent(cc.Label).string = "" + e;
};
t.prototype.startFree = function(e) {
var t = this;
return new Promise(function(o) {
var i = t.freeNode.getChildByName("start");
i.active = !0;
var n = i.getChildByName("spine");
n.children[0].children[0].children[0].children[2].getChildByName("label").getComponent(cc.Label).string = "" + e;
wUIHelp.playSpine(n, "animation", function() {
i.active = !1;
}, !1);
wAudioMgr.playSound("sound/free", "DFDC");
t.scheduleOnce(function() {
o(1);
}, 1);
});
};
t.prototype.endFree = function(e) {
var t = this, o = this.node.getChildByName("freeBg");
if (e || !o.active) return Promise.resolve();
var i = cc.fadeOut(.15), n = cc.callFunc(function() {
o.active = !1;
o.opacity = 255;
t.showFreeBtn(!1);
}), s = cc.sequence(i, n);
o.runAction(s);
this.scheduleOnce(function() {
return Promise.resolve();
}, .15);
};
t.prototype.showFreeBtn = function(e) {
this.btn_free.active = e;
};
t.prototype.initRollShow = function() {
this.setRandomIcon(this.Model.iconList[0].length);
this.setTopIcon(this.Model.iconList);
};
t.prototype.getPos = function(e, t) {
var o = wUtils.local_world__POS(e);
return wUtils.world_local_POS(t, o);
};
t.prototype.wildShow = function() {
for (var e = this, t = [], o = this.Model.iconList, i = 0; i < o.length; i++) for (var n = 0; n < o[i].length; n++) if (11 == o[i][n]) {
var s = this.aContent.children[i].children[n];
t.push(s);
}
for (var r = 0, a = t; r < a.length; r++) if (255 == (s = a[r]).opacity) {
var c = this.iconSp.getNode;
c.scale = s.scale;
var l = this.getPos(s, this.iContent);
this.setIconSpine(c, 11);
this.iContent.addChild(c, 10);
c.setPosition(l);
var d = this.iconFrame.getNode;
d.scale = s.scale;
this.iContent.addChild(d, 5);
d.setPosition(l);
}
var u = this.node.getChildByName("anim"), h = u.getChildByName("lz");
wUIHelp.hideSonNode(h);
var p = u.getChildByName("spine"), f = function(o) {
var i = g.getPos(t[o], u), n = h.children[o];
n.setPosition(i);
n.active = !0;
n.getComponent(cc.ParticleSystem).resetSystem();
var s = cc.bezierTo(.3, [ i, cc.v2(-250, 240), cc.v2(0, 320) ]).easing(cc.easeOut(2.5)), r = cc.callFunc(function() {
n.getComponent(cc.ParticleSystem).stopSystem();
e.scheduleOnce(function() {
n.active = !1;
}, .3);
if (0 == o) {
p.active = !0;
wAudioMgr.playSound("sound/pen", "DFDC");
wUIHelp.playSpine(p, "animation", function() {
p.active = !1;
});
}
}), a = cc.sequence(s, r);
n.stopAllActions();
n.runAction(a);
}, g = this;
for (i = 0; i < t.length; i++) f(i);
return t.length;
};
t.prototype.showIconResult = function(e) {
for (var t = [], o = 0, i = e; o < i.length; o++) {
var n = i[o], s = this.aContent.children[n[0]].children[n[1]];
t.push(s);
}
for (var r = 0, a = t; r < a.length; r++) {
(s = a[r]).opacity = 0;
var c = s.icon, l = null, d = this.getPos(s, this.iContent);
(l = this.iconSp.getNode).scale = s.scale;
this.setIconSpine(l, c);
if (3 == this.Model.level && "18" == c) {
var u = this.zsyhZSMul.getNode;
u.parent = l;
u.setPosition(0, 0);
u.active = !0;
var h = u.getComponent(sp.Skeleton);
h.setSkin(this.Model.diamonds);
wUIHelp.playSpine(h, "animation", null, !0);
}
this.iContent.addChild(l, 10);
l.setPosition(d);
var p = this.iconFrame.getNode;
p.scale = s.scale;
this.iContent.addChild(p, 5);
p.setPosition(d);
}
this.setIconColor(!1);
};
t.prototype.showWinEffect = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
var e, o, i, n, s;
return __generator(this, function() {
e = null;
(o = cc.find("win/win1", this.node)).active = !0;
(i = o.getChildByName("spine")).active = !0;
wUIHelp.playSpine(i, "animation", function() {
i.active = !1;
});
this.setWinGold(t);
o.getChildByName("bg").opacity = 40;
o.getChildByName("gold").getComponent(cc.Label).string = "+" + t;
o.getChildByName("gold").opacity = 255;
wAudioMgr.playSound("sound/win1", "DFDC");
n = function(t) {
var i = o.children[t];
i.y = -270;
i.scale = 1;
i.stopAllActions();
var n = cc.fadeIn(.1).easing(cc.easeOut(2)), s = cc.moveTo(.15, cc.v2(0, -230 - 3 * (t - 1))).easing(cc.easeOut(2)), r = cc.spawn(n, s), a = cc.callFunc(function() {
1 == t && e();
}), c = cc.delayTime(.5), l = cc.moveBy(.15, cc.v2(0, 30)), d = cc.scaleTo(.15, 1.4), u = cc.fadeOut(.15), h = cc.spawn(l, d, u), p = cc.callFunc(function() {
1 == t && (o.active = !1);
}), f = cc.sequence(r, a, c, h, p);
i.runAction(f);
};
for (s = 1; s < 3; s++) n(s);
return [ 2, new Promise(function(t) {
e = t;
}) ];
});
});
};
t.prototype.setIconSpine = function(e, t) {
2 == wGameData.roomLevel && 9 == t && (e.scale = 1.4);
var o = e.getComponent(sp.Skeleton);
o.skeletonData = null;
var i = this.Model.getIconSpine(t);
wRes.loadRes(i, sp.SkeletonData, function(e, t) {
o.skeletonData = t;
wUIHelp.playSpine(o, "animation", null, !0);
}, "DFDC");
};
t.prototype.recoveryNode = function() {
for (;this.iContent.childrenCount; ) {
var e = this.iContent.children[0];
e.scale = 1;
switch (e.name) {
case "IconFrame":
this.iconFrame.put(e);
break;

case "jgfc_free":
this.jgfcFreeCount.put(e);
break;

default:
3 == this.Model.level && e.childrenCount && this.zsyhZSMul.put(e.children[0]);
this.iconSp.put(e);
}
}
this.setIconColor(!0);
this.aContent.children.forEach(function(e) {
for (var t = 0; t < 5; t++) e.children[t].opacity = 255;
});
};
t.prototype.setIconColor = function(e) {
for (var t = e ? cc.color(255, 255, 255) : cc.color(140, 140, 140), o = 0, i = this.aContent.children; o < i.length; o++) for (var n = i[o], s = 0; s < 5; s++) n.children[s].children[0].color = t;
};
t.prototype.setBottomIcon = function(e) {
var t = this, o = e[0].length;
this.aContent.children.forEach(function(i, n) {
for (var s = 0; s < o; s++) {
var r = i.children[s], a = e[n][s];
t.setIconSprite(r, a, o);
}
i.y = 0;
});
};
t.prototype.setTopIcon = function(e) {
var t = this, o = e[0].length;
this.aContent.children.forEach(function(i, n) {
for (var s = i.childrenCount - o, r = s; r < i.childrenCount; r++) t.setIconSprite(i.children[r], e[n][r - s], o);
});
};
t.prototype.setRandomIcon = function(e) {
var t = this;
this.aContent.children.forEach(function(o) {
for (var i = o.childrenCount, n = e; n < i; n++) t.setIconSprite(o.children[n], wUtils.random(9, 17), e);
});
};
t.prototype.setAngleContentH = function(e) {
var t = {
5: .59,
4: .744,
3: 1
};
this.aContent.children.forEach(function(o) {
for (var i = 0, n = o.children; i < n.length; i++) n[i].scale = t[e];
o.getComponent(cc.Layout).updateLayout();
});
};
t.prototype.setIconSprite = function(e, t) {
e.icon = t;
var o = e.children[0].getComponent(cc.Sprite), i = this.Model.getIcon(t), n = this.icon[this.Model.level - 2].getSpriteFrame(i);
o.spriteFrame = n;
};
t.prototype.setPenShow = function(e, t, o) {
void 0 === o && (o = !1);
var i = cc.find("mul/pen", this.node).getComponent(sp.Skeleton), n = "animation" + e;
i.setAnimation(1, n, o);
i.setCompleteListener(function(e) {
if (e.animation.name == n && t) {
t();
t = null;
}
});
if (3 == e) {
this.count++;
this.count >= 10 && i.setSkin("jubaopen2");
} else if (4 == e) {
i.setSkin("jubaopen3");
this.count = 0;
this.scheduleOnce(function() {
i.setSkin("jubaopen1");
i.setAnimation(1, "animation1", !0);
}, 3);
}
};
t.prototype.setAutoState = function(e) {
this.btn_auto.active = e;
};
t.prototype.setGold = function(e) {
this.myGold.string = e;
};
t.prototype.setWinGold = function(e) {
if (e) {
var t = Number(this.win.string) || 0;
this.win.string = "" + (e + t);
var o = this.win.node.parent.getChildByName("spine");
o.active = !0;
wUIHelp.playSpine(o, "animation", function() {
o.active = !1;
});
} else this.win.string = "" + e;
};
t.prototype.setBtnEnabled = function(e) {
for (var t = 0; t < 3; t++) this.bottomBtnList[t].interactable = e;
for (var o = 0, i = cc.find("bottom/toggle", this.node).children; o < i.length; o++) i[o].getComponent(cc.Toggle).interactable = e;
};
t.prototype.setBtnStart = function(e) {
var t = this;
if (e) {
this.node.stopAllActions();
this.btn_stop.active = !1;
} else {
var o = cc.delayTime(.1), i = cc.callFunc(function() {
t.btn_stop.active = !0;
}), n = cc.sequence(o, i);
this.node.stopAllActions();
this.node.runAction(n);
}
this.btn_start.getComponent(cc.Button).interactable = e;
this.btn_start.getChildByName("btnDis").active = !e;
this.btn_free.getChildByName("btnDis").active = !e;
};
t.prototype.setMaxBtn = function(e) {
this.bottomBtnList[0].node.children[0].active = !e;
};
t.prototype.setMul = function(e) {
this.mul.string = e;
};
t.prototype.setWinTips = function(e) {
var t = this.win.node.parent.getChildByName("tips");
t.active = e;
this.win.node.active = !e;
if (e) {
var o = [ 1, 2, 4, 5, 6 ][wUtils.random(0, 4)];
t.getComponent(cc.Sprite).spriteFrame = this.commonImg.getSpriteFrame("dfdcLedText_" + o);
}
};
t.prototype.setMulIcon = function(e, t, o) {
for (var i = {
2: 4,
3: 3,
4: 2,
5: 1
}, n = e + 1; n <= t; n++) for (var s = 0, r = this.aContent.children; s < r.length; s++) for (var a = r[s], c = 0; c < o; c++) (u = a.children[c]).icon == i[n] + 4 && this.setIconSprite(u, i[n], o);
for (n = t + 1; n <= 5; n++) for (var l = 0, d = this.aContent.children; l < d.length; l++) {
a = d[l];
for (c = 0; c < o; c++) {
var u;
(u = a.children[c]).icon == i[n] && this.setIconSprite(u, i[n] + 4, o);
}
}
cc.find("bottom/toggle/" + t, this.node).getComponent(cc.Toggle).check();
};
t.prototype.setJackPotData = function(e) {
for (var t = 0; t < 4; t++) {
var o = this.jackPot.getChildByName("" + (t + 2)).getChildByName("label"), i = wUtils.numConvert(Math.floor(e[t]));
o.getComponent(cc.Label).string = "" + i;
}
};
t.prototype.setJpMulShow = function(e, t, o) {
void 0 === o && (o = !0);
return __awaiter(this, void 0, void 0, function() {
var i, n, s, r = this;
return __generator(this, function() {
if (!this.jpMul.isAnim) {
this.jpMul.isAnim = !0;
return [ 2 ];
}
if (!o) return [ 2 ];
if (!this.jpMul.active) {
this.jpMul.active = !0;
wUIHelp.easeBackOut(this.jpMul);
}
this.unscheduleAllCallbacks();
this.scheduleOnce(function() {
wUIHelp.easeIn(r.jpMul, function() {
r.jpMul.active = !1;
});
}, 2);
for (n = e + 1; n <= t; n++) if (1 != n) {
(s = this.jpMul.getChildByName("i" + n)).active = !0;
if (!(i = s.getChildByName("spine")).active) {
i.active = !0;
wUIHelp.playSpine(i, "animation");
}
}
for (n = t + 1; n <= 5; n++) if (1 != n) {
(s = this.jpMul.getChildByName("i" + n)).active = !1;
s.getChildByName("spine").active = !1;
}
this.jpMul.getChildByName("label").getComponent(cc.Sprite).spriteFrame = this.commonImg.getSpriteFrame("txtJP_" + t);
return [ 2 ];
});
});
};
t.prototype.setMulSpine = function(e, t) {
for (var o = e + 1; o <= t; o++) this.jackPot.getChildByName("" + o).getChildByName("ani").active = !1;
for (o = t + 1; o <= 5; o++) this.jackPot.getChildByName("" + o).getChildByName("ani").active = !0;
};
__decorate([ a(cc.SpriteAtlas) ], t.prototype, "icon", void 0);
__decorate([ a(cc.SpriteAtlas) ], t.prototype, "commonImg", void 0);
__decorate([ a([ cc.Button ]) ], t.prototype, "bottomBtnList", void 0);
__decorate([ a(cc.Label) ], t.prototype, "mul", void 0);
__decorate([ a(cc.Node) ], t.prototype, "jackPot", void 0);
__decorate([ a(cc.Node) ], t.prototype, "jpMul", void 0);
__decorate([ a(cc.Label) ], t.prototype, "myGold", void 0);
__decorate([ a(cc.Label) ], t.prototype, "win", void 0);
__decorate([ a(cc.Node) ], t.prototype, "btn_start", void 0);
__decorate([ a(cc.Node) ], t.prototype, "btn_stop", void 0);
__decorate([ a(cc.Node) ], t.prototype, "btn_auto", void 0);
__decorate([ a(cc.Node) ], t.prototype, "btn_free", void 0);
__decorate([ a(cc.Node) ], t.prototype, "aContent", void 0);
__decorate([ a(cc.Node) ], t.prototype, "iContent", void 0);
__decorate([ a(cc.Node) ], t.prototype, "freeNode", void 0);
return __decorate([ r ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {
DFDCRotate: "DFDCRotate",
NodePool: void 0
} ]
}, {}, [ "DFDCControlle", "DFDCJackPot", "DFDCLoad", "DFDCLuckyList", "DFDCLuckyPlayer", "DFDCModel", "DFDCRoom", "DFDCRotate", "DFDCRule", "DFDCSelectFreeCfxm", "DFDCSelectFreeZsyy", "DFDCView" ]);