window.__require = function e(t, o, n) {
function i(l, s) {
if (!o[l]) {
if (!t[l]) {
var r = l.split("/");
r = r[r.length - 1];
if (!t[r]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(r, !0);
if (a) return a(r, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = r;
}
var d = o[l] = {
exports: {}
};
t[l][0].call(d.exports, function(e) {
return i(t[l][1][e] || e);
}, d, d.exports, e, t, o, n);
}
return o[l].exports;
}
for (var a = "function" == typeof __require && __require, l = 0; l < n.length; l++) i(n[l]);
return i;
}({
JXLWControlle: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "1a5c38xlzZGRLwbeLzWtpwc", "JXLWControlle");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("ArcadeBase"), i = e("LuckyPlayer"), a = e("NetInterface"), l = e("GoldRoll"), s = e("JXLWModel"), r = e("JXLWRotate"), c = e("JXLWView"), d = cc._decorator, u = d.ccclass, h = d.property, p = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.JXLWView = null;
t.btn_start = null;
t.JXLWRotate = null;
t.LuckyPlayer = null;
t.GoldRoll = null;
t.jackNum = null;
t.JXLWModel = null;
t.failCount = 0;
t.winCount = 0;
return t;
}
t.prototype.onLoad = function() {
this.initProxy();
this.vg_init();
};
t.prototype.initProxy = function() {
var e = this;
this.JXLWModel = s.JXLWCreatorProxy();
this.JXLWModel.onEvevt("gameState", function(t) {
e.JXLWView.setBtnEnabled(0 == t);
e.LuckyPlayer.setBtnState(0 == t);
});
this.JXLWModel.onEvevt("linnum", function(t) {
e.JXLWView.setLine(t);
});
this.JXLWModel.onEvevt("gear", function(t) {
e.JXLWView.setGear(t * e.JXLWModel.di_score);
});
this.JXLWModel.onEvevt("bet", function(t) {
e.JXLWView.setBet(t);
});
this.JXLWModel.onEvevt("gold", function(t) {
e.JXLWView.setGold(t);
});
this.JXLWModel.onEvevt("allWinGold", function(t) {
e.JXLWView.setWinGold(t);
});
this.JXLWModel.onEvevt("auto", function(t) {
e.JXLWView.setAutoState(t);
t && 0 == e.JXLWModel.gameState && e.requestRoll();
t ? e.offEvent() : e.onEvent();
});
this.JXLWModel.auto = !1;
};
t.prototype.vg_upGameGold = function() {
this.JXLWModel.gold = this.JXLWModel.getGold();
};
t.prototype.vg_roomInfo = function(e) {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(t) {
switch (t.label) {
case 0:
if (this.vg_isInit) return [ 3, 3 ];
this.JXLWModel.roomlv = e.level;
this.JXLWModel.setGold(e.gold);
this.JXLWModel.gold = this.JXLWModel.getGold();
this.JXLWModel.di_score = e.doublescore;
s.JXLWConfig.maxgear = e.max_multiple;
this.JXLWModel.free = e.free;
this.JXLWModel.curfree = e.free;
this.JXLWModel.auto = !1;
this.JXLWModel.initIcon(e.map);
this.JXLWView.setBottomIcon(this.JXLWModel.iconList);
if (!this.JXLWModel.free) return [ 3, 2 ];
this.JXLWModel.linnum = e.line;
this.JXLWModel.gear = e.curgrade;
return [ 4, this.JXLWView.startFree(this.JXLWModel.curfree) ];

case 1:
t.sent();
this.JXLWView.setFreeCount(this.JXLWModel.curfree - 1);
this.requestRoll();
return [ 3, 3 ];

case 2:
this.JXLWModel.linnum = 9;
this.JXLWModel.gear = 1;
t.label = 3;

case 3:
this.initJackPot();
1 == this.JXLWModel.roomlv && 1e7 == this.JXLWModel.gold && wUIManager.showConfirmUI_B({
type: 3
});
return [ 2 ];
}
});
});
};
t.prototype.vg_rollMessage = function(e) {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(t) {
switch (t.label) {
case 0:
if (1 != e.status) {
wLog.e("旋转消息出现错误");
return [ 2 ];
}
this.JXLWModel.initRollMsg(e.data);
this.JXLWModel.gold -= this.JXLWModel.conscore;
if (this.JXLWModel.gold == e.data.gold) {
this.failCount++;
this.winCount = 0;
} else {
this.winCount++;
this.failCount = 0;
}
this.JXLWView.setTopIcon(this.JXLWModel.iconList);
this.JXLWView.initRollShow();
this.JXLWRotate.roll();
return [ 4, wUtils.syncDelayed(.15, this) ];

case 1:
t.sent();
this.JXLWModel.gameState = 2;
return [ 2 ];
}
});
});
};
t.prototype.rollEnd = function() {
this.JXLWModel.gameState = 3;
this.processControlle(this.JXLWModel.gameState);
};
t.prototype.processControlle = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t, o, n, i, a;
return __generator(this, function(l) {
switch (l.label) {
case 0:
this.JXLWView.setBottomIcon(this.JXLWModel.iconList);
if (this.JXLWModel.winline.length) {
wAudioMgr.playSound("sound/sound-tiger-win-line", wGameData.getGameName());
this.JXLWView.showIconResult(this.JXLWModel.winline);
}
return [ 4, wUtils.syncDelayed(.1, this) ];

case 1:
l.sent();
if (!this.JXLWModel.jackpot) return [ 3, 3 ];
this.playJack();
wLog.w("->>>>>>>>>>>>>>>>中奖池了");
o = this.JXLWModel.score + this.JXLWModel.jackpot;
return [ 4, this.JXLWView.jackPot(o, this.JXLWModel.jackWinNum, this.JXLWModel.jackpot) ];

case 2:
l.sent();
this.addWinGold(this.JXLWModel.jackpot);
l.label = 3;

case 3:
if (!this.JXLWModel.score && !this.JXLWModel.winline.length) return [ 3, 9 ];
e = this.JXLWModel.winline.filter(function(e) {
if (12 == e.type) return !0;
});
this.play777(e.length > 0);
if (!(e.length > 0) || this.JXLWModel.jackpot) return [ 3, 5 ];
t = 0;
o = 3;
n = 0;
for (i = e; n < i.length; n++) {
a = i[n];
t += a.multiple;
a.num > o && (o = a.num);
}
return [ 4, this.JXLWView.qqq(this.JXLWModel.score, o, t) ];

case 4:
l.sent();
l.label = 5;

case 5:
wAudioMgr.playSound("sound/sound-win", wGameData.getGameName());
return !this.JXLWModel.score || this.JXLWModel.jackpot || e.length ? [ 3, 7 ] : [ 4, this.JXLWView.showWinType(this.JXLWModel.winType, this.JXLWModel.score) ];

case 6:
l.sent();
wAudioMgr.playSound("sound/sound-get-gold", wGameData.getGameName());
l.label = 7;

case 7:
this.JXLWView.showIconMul(this.JXLWModel.winline);
return [ 4, wUtils.syncDelayed(this.JXLWModel.auto ? 1.2 : .4, this) ];

case 8:
l.sent();
this.addWinGold(this.JXLWModel.score);
l.label = 9;

case 9:
if (!this.JXLWModel.curfree) return [ 3, 12 ];
this.playFree();
wLog.w("->>>>>>>>>>>>>>>>中免费了" + this.JXLWModel.curfree);
return [ 4, this.JXLWView.startFree(this.JXLWModel.curfree) ];

case 10:
l.sent();
return [ 4, this.JXLWView.setFreeCount(this.JXLWModel.free - 1) ];

case 11:
l.sent();
l.label = 12;

case 12:
if (this.JXLWModel.curfree) this.requestRoll(); else if (this.JXLWModel.free) {
this.playFail();
this.playWin();
this.JXLWView.setFreeCount(this.JXLWModel.free - 1);
this.requestRoll();
} else {
this.JXLWModel.score && wAudioMgr.playSound("sound/sound-tiger-stop", wGameData.getGameName());
this.playFail();
this.playWin();
this.JXLWView.endFree();
this.JXLWModel.auto ? this.requestRoll() : this.JXLWModel.gameState = 0;
}
return [ 2 ];
}
});
});
};
t.prototype.addWinGold = function(e) {
this.JXLWModel.gold += e;
this.JXLWModel.allWinGold += e;
this.JXLWView.playGoldSpine();
};
t.prototype.playFree = function() {
var e = wUtils.random(1, 2);
wAudioMgr.playSound("sound/sound-diamond-" + e, wGameData.getGameName());
};
t.prototype.playFail = function() {
if (0 != this.failCount && this.failCount % 3 == 0) {
var e = 2, t = "small";
switch (!0) {
case this.failCount < 3:
return;

case this.failCount >= 3:
break;

case this.failCount >= 6:
t = "middle";
break;

case this.failCount >= 9:
t = "big";
e = 4;
}
var o = wUtils.random(1, e);
wAudioMgr.playSound("sound/sound-lose-" + t + "-" + o, wGameData.getGameName());
}
};
t.prototype.playWin = function() {
if (0 != this.winCount && this.winCount % 3 == 0) {
var e = "small";
switch (!0) {
case this.winCount < 3:
return;

case this.winCount >= 3:
break;

case this.winCount >= 6:
e = "middle";
break;

case this.winCount >= 9:
e = "big";
}
var t = wUtils.random(1, 2);
wAudioMgr.playSound("sound/sound-win-" + e + "-" + t, wGameData.getGameName());
}
};
t.prototype.playJack = function() {
var e = wUtils.random(1, 2);
wAudioMgr.playSound("sound/sound-box-" + e, wGameData.getGameName());
};
t.prototype.play777 = function(e) {
if (e) {
var t = wUtils.random(1, 2);
wAudioMgr.playSound("sound/sound-777-" + t, wGameData.getGameName());
}
};
t.prototype.onClick = function(e, t) {
switch (t) {
case "jack":
wLog.i("点击了jackpot");
break;

case "line":
this.JXLWModel.linnum++;
this.JXLWView.showLine(this.JXLWModel.linnum);
this.JXLWView.showLineID(this.JXLWModel.linnum);
wAudioMgr.playSound("sound/sound-tiger-line-button", wGameData.getGameName());
return;

case "bet":
this.JXLWModel.gear++;
break;

case "max":
wAudioMgr.playSound("sound/sound-tiger-line-button", wGameData.getGameName());
if (this.JXLWModel.linnum == s.JXLWConfig.line && this.JXLWModel.gear == s.JXLWConfig.maxgear) {
wUIManager.showTips("已处于满压状态", wUIManager.TIPS_WHITE);
break;
}
this.JXLWModel.maxBet();
this.JXLWView.showLineID(s.JXLWConfig.line);
this.JXLWView.showLine(s.JXLWConfig.line);
return;

case "auto":
this.JXLWModel.auto = !1;
break;

case "free":
if (2 == this.JXLWModel.gameState) {
this.JXLWRotate.stop();
return;
}
break;

case "bank":
if (1 == this.JXLWModel.roomlv) {
wUIManager.showTips("体验房不能进行提款操作");
return;
}
if (0 != this.JXLWModel.gameState) {
wUIManager.showTips("开奖进行中,请在开奖结束后取款", wUIManager.TIPS_OK);
return;
}
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
break;

case "hall":
this.vg_quitGame(0 != this.JXLWModel.gameState);
}
wAudioMgr.playBtnSound();
};
t.prototype.startEvent = function() {
var e = this;
wAudioMgr.playBtnSound();
this.scheduleOnce(function() {
e.JXLWModel.auto = !0;
}, 1);
};
t.prototype.endEvent = function() {
this.unscheduleAllCallbacks();
this.JXLWModel.auto || (0 != this.JXLWModel.gameState ? 2 != this.JXLWModel.gameState || this.JXLWRotate.stop() : this.requestRoll());
};
t.prototype.onEvent = function() {
var e = this.btn_start;
e.on(cc.Node.EventType.TOUCH_START, this.startEvent, this);
e.on(cc.Node.EventType.TOUCH_END, this.endEvent, this);
e.on(cc.Node.EventType.TOUCH_CANCEL, this.endEvent, this);
this.JXLWRotate.setEndCall(this.rollEnd.bind(this));
};
t.prototype.offEvent = function() {
var e = this.btn_start;
e.off(cc.Node.EventType.TOUCH_START, this.startEvent, this);
e.off(cc.Node.EventType.TOUCH_END, this.endEvent, this);
e.off(cc.Node.EventType.TOUCH_CANCEL, this.endEvent, this);
};
t.prototype.requestRoll = function() {
this.JXLWModel.gold != this.JXLWModel.getGold() && wLog.e("->>>>>>>>>>>>>>>>金币计算错误");
var e = this.JXLWModel.bet;
if (!this.JXLWModel.free && e > this.JXLWModel.gold) {
this.JXLWModel.gameState = 0;
this.JXLWModel.auto = !1;
wUIManager.showTips("金币不足");
} else {
this.JXLWModel.gameState = 1;
this.vg_sendRollMsg({
multiple: this.JXLWModel.gear,
line: this.JXLWModel.linnum
});
}
};
t.prototype.initJackPot = function() {
var e = this;
this.jackNum = 0;
wGEvent.on("Msg_Game_Jackpot", function(t) {
if (1 == t.status) {
var o = t.data[0] ? t.data[0].jackpot : 0, n = (o = String(o)).length - wUtils.random(4, 6), i = wGameData.roomLevel;
0 == i && (i = 2);
n -= i - 1;
for (var a = [], l = 0; l < n; l++) a.push(o[l]);
for (l = n; l < o.length; l++) a.push(wUtils.random(0, 9) + "");
if (!(o = Number(a.join("")))) return;
e.jackNum ? e.GoldRoll.setNum(o) : e.GoldRoll.initNum(o);
e.jackNum = o;
}
}, this);
wNetWork.send("Msg_Game_Jackpot", {
gtype: wGameData.gameID,
level: this.JXLWModel.roomlv
});
var t = cc.callFunc(function() {
wNetWork.send("Msg_Game_Jackpot", {
gtype: wGameData.gameID,
level: e.JXLWModel.roomlv
});
}), o = cc.delayTime(5), n = cc.repeatForever(cc.sequence(t, o));
this.node.stopAllActions();
this.node.runAction(n);
};
t.prototype.vg_NetWorkState = function(e) {
e != a.netWorkState.CLOSEDING && e != a.netWorkState.CLOSED || this.node.stopAllActions();
};
__decorate([ h(c.default) ], t.prototype, "JXLWView", void 0);
__decorate([ h(cc.Node) ], t.prototype, "btn_start", void 0);
__decorate([ h(r.default) ], t.prototype, "JXLWRotate", void 0);
__decorate([ h(i.default) ], t.prototype, "LuckyPlayer", void 0);
__decorate([ h(l.default) ], t.prototype, "GoldRoll", void 0);
return __decorate([ u ], t);
}(n.default);
o.default = p;
cc._RF.pop();
}, {
ArcadeBase: void 0,
GoldRoll: void 0,
JXLWModel: "JXLWModel",
JXLWRotate: "JXLWRotate",
JXLWView: "JXLWView",
LuckyPlayer: void 0,
NetInterface: void 0
} ],
JXLWLoad: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "76cf6ur2E5EVaOu8w26uDqf", "JXLWLoad");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Config"), i = cc._decorator, a = i.ccclass;
i.property;
var l = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {
var e = this;
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
this.preloadGameRes();
if (wGameData.isReconnect) this.loadRoom(); else {
var t = wGEvent.on("Msg_Hall_GameSessions", function(o) {
e.Msg_Hall_GameSessions(o);
wGEvent.off(t);
e.unscheduleAllCallbacks();
t = null;
}, this);
this.scheduleOnce(function() {
if (t) {
wUIManager.showTips("请求游戏配置失败");
wGEvent.off(t);
wViewMgr.enterHall();
}
}, 10);
wNetWork.send("Msg_Hall_GameSessions", {
gtype: wGameData.gameID
});
}
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
var e = n.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir(e.prefabUrl, e.enName);
wRes.preloadDir("prefab/Room", e.enName);
};
t.prototype.loadRoom = function() {
var e = this, t = wGameData.gameID, o = cc.Canvas.instance.node.getChildByName("Room");
o.active = !0;
var i = n.Config.GamePrefab[t];
wRes.loadRes("prefab/Room", function(t, n) {
return __awaiter(e, void 0, void 0, function() {
return __generator(this, function() {
if (t) {
wViewMgr.enterHall();
return [ 2 ];
}
cc.instantiate(n).parent = o;
wGameData.isReconnect ? this.node.zIndex = 100 : this.node.destroy();
return [ 2 ];
});
});
}, i.enName);
};
return __decorate([ a ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {
Config: void 0
} ],
JXLWLuckyPlayer: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "7032aguIa5NK6pzn194MdD6", "JXLWLuckyPlayer");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("JXLWModel"), i = e("JXLWRotate"), a = e("JXLWView"), l = cc._decorator, s = l.ccclass, r = l.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.JXLWView = null;
t.btn_Play = null;
t.JXLWRotate = null;
t.JXLWModel = null;
t.gameList = [];
return t;
}
t.prototype.onLoad = function() {
this.initProxy();
};
t.prototype.init = function() {
var e = this;
this.btn_Play.interactable = !1;
var t = JSON.parse(JSON.stringify(this.node.data)), o = this.node.getChildByName("bottom");
cc.find("info/name", o).getComponent(cc.Label).string = t.nickname;
var n = t.data;
this.gameList = t.data;
wUIHelp.setHead(cc.find("info/head", o), t.headimgurl);
var i = {
level: 1,
gold: n[0].gold - n[0].jackpot - n[0].score + n[0].conscore,
doublescore: t.doublescore,
line: t.line,
curgrade: t.curgrade,
map: t.map
};
this.vg_roomInfo(i);
this.scheduleOnce(function() {
var t = {
status: 1,
data: e.gameList.shift()
};
e.vg_rollMessage(t);
}, .5);
};
t.prototype.onEnable = function() {
this.JXLWRotate.setEndCall(this.rollEnd.bind(this));
this.init();
};
t.prototype.initProxy = function() {
var e = this;
this.JXLWModel = n.JXLWCreatorProxy();
this.JXLWModel.onEvevt("gameState", function() {});
this.JXLWModel.onEvevt("linnum", function(t) {
e.JXLWView.setLine(t);
e.JXLWView.showLineID(t);
});
this.JXLWModel.onEvevt("gear", function(t) {
e.JXLWView.setGear(t * e.JXLWModel.di_score);
});
this.JXLWModel.onEvevt("bet", function(t) {
e.JXLWView.setBet(t);
});
this.JXLWModel.onEvevt("gold", function(t) {
e.JXLWView.setGold(t);
cc.find("bottom/info/gold", e.node).getComponent(cc.Label).string = "" + t;
});
this.JXLWModel.onEvevt("allWinGold", function(t) {
e.JXLWView.setWinGold(t);
});
this.JXLWModel.auto = !1;
};
t.prototype.vg_roomInfo = function(e) {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function() {
this.JXLWModel.roomlv = e.level;
this.JXLWModel.setGold(e.gold);
this.JXLWModel.gold = this.JXLWModel.getGold();
this.JXLWModel.di_score = e.doublescore;
this.JXLWModel.linnum = e.line;
this.JXLWModel.gear = e.curgrade;
n.JXLWConfig.maxgear = 5;
this.JXLWModel.allWinGold = 0;
this.JXLWModel.auto = !1;
this.JXLWModel.initIcon(e.map);
this.JXLWView.initRollShow();
this.JXLWView.setBottomIcon(this.JXLWModel.iconList);
return [ 2 ];
});
});
};
t.prototype.vg_rollMessage = function(e) {
if (1 == e.status) {
this.JXLWModel.gameState = 2;
this.JXLWModel.initRollMsg(e.data);
this.JXLWModel.gold -= this.JXLWModel.conscore;
this.JXLWView.setTopIcon(this.JXLWModel.iconList);
this.JXLWView.initRollShow();
this.JXLWRotate.roll();
} else wLog.e("旋转消息出现错误");
};
t.prototype.rollEnd = function() {
this.JXLWModel.gameState = 3;
this.processControlle(this.JXLWModel.gameState);
};
t.prototype.processControlle = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t, o, n, i, a, l = this;
return __generator(this, function(s) {
switch (s.label) {
case 0:
this.JXLWView.setBottomIcon(this.JXLWModel.iconList);
if (this.JXLWModel.winline.length) {
this.playSound("sound/sound-tiger-win-line");
wAudioMgr.playSound("sound/sound-tiger-win-line", wGameData.getGameName());
this.JXLWView.showIconResult(this.JXLWModel.winline);
}
return [ 4, wUtils.syncDelayed(.1, this) ];

case 1:
s.sent();
if (!cc.isValid(this.node, !0)) return [ 2 ];
if (!this.JXLWModel.jackpot) return [ 3, 3 ];
wLog.w("->>>>>>>>>>>>>>>>中奖池了");
o = this.JXLWModel.score + this.JXLWModel.jackpot;
return [ 4, this.JXLWView.jackPot(o, this.JXLWModel.jackWinNum, this.JXLWModel.jackpot) ];

case 2:
s.sent();
this.addWinGold(this.JXLWModel.jackpot + this.JXLWModel.score);
this.playSound("sound/sound-get-gold");
s.label = 3;

case 3:
if (!this.JXLWModel.score && !this.JXLWModel.winline.length) return [ 3, 9 ];
e = this.JXLWModel.winline.filter(function(e) {
if (12 == e.type) return !0;
});
this.play777(e.length > 0);
if (!(e.length > 0) || this.JXLWModel.jackpot) return [ 3, 5 ];
t = 0;
o = 3;
n = 0;
for (i = e; n < i.length; n++) {
a = i[n];
t += a.multiple;
a.num > o && (o = a.num);
}
return [ 4, this.JXLWView.qqq(this.JXLWModel.score, o, t) ];

case 4:
s.sent();
s.label = 5;

case 5:
wAudioMgr.playSound("sound/sound-win", wGameData.getGameName());
return !this.JXLWModel.score || this.JXLWModel.jackpot || e.length ? [ 3, 7 ] : [ 4, this.JXLWView.showWinType(this.JXLWModel.winType, this.JXLWModel.score) ];

case 6:
s.sent();
wAudioMgr.playSound("sound/sound-get-gold", wGameData.getGameName());
s.label = 7;

case 7:
this.JXLWView.showIconMul(this.JXLWModel.winline);
return [ 4, wUtils.syncDelayed(this.JXLWModel.auto ? 1.2 : .4, this) ];

case 8:
s.sent();
this.addWinGold(this.JXLWModel.score);
s.label = 9;

case 9:
if (!this.JXLWModel.curfree) return [ 3, 12 ];
this.playFree();
wLog.w("->>>>>>>>>>>>>>>>中免费了" + this.JXLWModel.curfree);
return [ 4, this.JXLWView.startFree(this.JXLWModel.curfree) ];

case 10:
s.sent();
return [ 4, this.JXLWView.setFreeCount(this.JXLWModel.free - 1) ];

case 11:
s.sent();
s.label = 12;

case 12:
if (this.JXLWModel.curfree) this.requestRoll(); else if (this.JXLWModel.free) {
this.JXLWView.setFreeCount(this.JXLWModel.free - 1);
this.requestRoll();
} else {
this.JXLWModel.score && wAudioMgr.playSound("sound/sound-tiger-stop", wGameData.getGameName());
this.JXLWModel.gameState = 0;
this.JXLWView.endFree();
wUIManager.showConfirmUI({
content: "回放已经结束",
horizntalAlign: cc.Label.HorizontalAlign.CENTER,
okTips: "重播",
ok_b_Tips: "去赚豆",
title: "提示",
ok_b_open: !0,
ok_b_CB: function() {
wAudioMgr.stopAllEffects();
l.node.destroy();
},
okCB: function() {
l.init();
},
cancelCB: function() {
wAudioMgr.stopAllEffects();
l.node.destroy();
}
});
}
return [ 2 ];
}
});
});
};
t.prototype.addWinGold = function(e) {
this.JXLWModel.gold += e;
this.JXLWModel.allWinGold += e;
this.JXLWView.playGoldSpine();
};
t.prototype.onClick = function(e, t) {
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
};
t.prototype.requestRoll = function() {
var e = {
status: 1,
data: this.gameList.shift()
};
this.vg_rollMessage(e);
};
t.prototype.playSound = function(e) {
wAudioMgr.playSound(e, wGameData.getGameName());
};
t.prototype.playFree = function() {
var e = wUtils.random(1, 2);
this.playSound("sound/sound-diamond-" + e);
};
t.prototype.play777 = function(e) {
if (e) {
var t = wUtils.random(1, 2);
this.playSound("sound/sound-777-" + t);
}
};
__decorate([ r(a.default) ], t.prototype, "JXLWView", void 0);
__decorate([ r(cc.Button) ], t.prototype, "btn_Play", void 0);
__decorate([ r(i.default) ], t.prototype, "JXLWRotate", void 0);
return __decorate([ s ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {
JXLWModel: "JXLWModel",
JXLWRotate: "JXLWRotate",
JXLWView: "JXLWView"
} ],
JXLWModel: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "00e9brUVZ1Cs75W2X8eSczY", "JXLWModel");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.JXLWCreatorProxy = o.JXLWConfig = void 0;
o.JXLWConfig = {
line: 9,
maxgear: 5,
iconNum: 14,
icon_w: 139,
icon_h: 139,
spineList: [ "", "spines/jxlw_gameobjlizhi", "spines/jxlw_gameobjjuzi", "spines/jxlw_gameobjmangguo", "spines/jxlw_gameobjxigua", "spines/jxlw_gameobjboluo", "spines/jxlw_gameobjpinguo", "spines/jxlw_gameobjyingtao", "spines/jxlw_gameobjxiangjiao", "spines/jxlw_gameobjlingdang", "spines/jxlw_gameobjputao", "spines/jxlw_gameobjbar", "spines/jxlw_gameobj37", "spines/jxlw_gameobjzs", "spines/jxlw_gameobjbaoxiang" ],
lineConfig: [ [], [ 1, 1, 1, 1, 1 ], [ 2, 2, 2, 2, 2 ], [ 0, 0, 0, 0, 0 ], [ 2, 1, 0, 1, 2 ], [ 0, 1, 2, 1, 0 ], [ 1, 2, 2, 2, 1 ], [ 1, 0, 0, 0, 1 ], [ 2, 2, 1, 0, 0 ], [ 0, 0, 1, 2, 2 ] ]
};
var n = function() {
function e() {
this.gold = 0;
this.experienceGold = 0;
this.win = 0;
this.iconList = [ [], [], [], [], [] ];
this.auto = !1;
this.linnum = 1;
this.bet = 0;
this.gear = 1;
this.di_score = 100;
this.roomlv = 0;
this.jackpot = 0;
this.jackWinNum = 0;
this.curfree = 0;
this.free = 0;
this.score = 0;
this.conscore = 0;
this.mul = 0;
this.winline = [];
this.allWinGold = 0;
this.min_gold = 0;
this.gameState = 0;
this.winType = 1;
this.playerList = {};
this.keyCb = {};
}
e.prototype.maxBet = function() {
this.linnum = o.JXLWConfig.line;
this.gear = o.JXLWConfig.maxgear;
};
e.prototype.initIcon = function(e) {
var t = this;
e.forEach(function(e, o) {
e.forEach(function(e, n) {
t.iconList[n][o] = e || 1;
});
});
this.iconList[0].length || (this.iconList = [ [ 1, 1, 1 ], [ 1, 1, 1 ], [ 1, 1, 1 ], [ 1, 1, 1 ], [ 1, 1, 1 ] ]);
};
e.prototype.initRollMsg = function(e) {
this.jackpot = e.jackpot;
this.curfree = e.curfree;
this.free = e.free;
this.score = e.score;
this.conscore = e.conscore;
this.winType = e.type;
this.setGold(e.gold);
this.initIcon(e.map);
this.winline = e.win;
this.mul = 0;
this.jackWinNum;
for (var t in e.win) {
var o = e.win[t];
this.mul += o.multiple;
14 == o.type && o.num > this.jackWinNum && (this.jackWinNum = o.num);
}
};
e.prototype.getGold = function() {
return 1 == this.roomlv ? this.experienceGold : wGameData.getKey("gold");
};
e.prototype.setGold = function(e) {
1 == this.roomlv ? this.experienceGold = e : wGameData.user.gold = e;
};
e.prototype.onEvevt = function(e, t) {
"function" == typeof t ? this.keyCb[e] = t : wLog.e("对象绑定错误");
};
return e;
}();
o.JXLWCreatorProxy = function() {
var e = new n(), t = new Proxy(e, {
get: function(e, t) {
return e[t];
},
set: function(e, n, i) {
switch (n) {
case "linnum":
i > o.JXLWConfig.line && (i = 1);
t.bet = e.gear * e.di_score * i;
break;

case "gear":
i > o.JXLWConfig.maxgear && (i = 1);
t.bet = e.linnum * e.di_score * i;
}
e[n] = i;
e.keyCb[n] && e.keyCb[n](i);
return !0;
}
});
return t;
};
cc._RF.pop();
}, {} ],
JXLWRoom: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "d540aa6ySNLLbPdUWhIZnDI", "JXLWRoom");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Config"), i = cc._decorator, a = i.ccclass, l = i.property, s = function(e) {
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
t.isExit = !1;
return t;
}
t.prototype.onLoad = function() {
var e = this;
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
e.initShow();
}, this);
wGameData.isReconnect ? this.loadGame() : this.initRoom();
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
this.bankGold && (this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank")));
}
};
t.prototype.initRoom = function() {
var e = wGameData.roomConfig;
for (var t in e) if (Object.prototype.hasOwnProperty.call(e, t)) {
var o = Number(t) - 1;
this.content.getChildByName("" + o).on("click", this.roomOnClick, this);
}
this.head && wUIHelp.setHead(this.head, wGameData.getKey("headimgurl"));
this.nickname && (this.nickname.string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10));
this.bankGold && (this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank")));
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
this.top.y = 500;
var e = cc.moveTo(.15, cc.v2(0, 375)).easing(cc.easeBackOut());
e.speed(.3);
this.top.runAction(e);
this.bottom.stopAllActions();
this.bottom.y = -100;
var t = cc.moveTo(.15, cc.v2(0, 0)).easing(cc.easeBackOut());
t.speed(.3);
this.bottom.runAction(t);
var o = this.content;
this.node.getChildByName("main").opacity = 0;
var n = cc.fadeTo(.5, 255);
this.node.getChildByName("main").runAction(n);
for (var i = 0; i < o.childrenCount; i++) {
var a = o.children[i], l = cc.v2(a.x, a.y);
a.x += 250;
var s = cc.moveTo(.2, l).easing(cc.easeBackOut());
s.speed(.35);
a.runAction(s);
}
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
var n = wGEvent.on("Msg_Hall_EnterRoom", function(e) {
t.Msg_Hall_EnterRoom(e);
wGEvent.off(n);
t.unscheduleAllCallbacks();
n = null;
}, this);
this.scheduleOnce(function() {
if (n) {
t.isEnterRoom = !1;
wGEvent.off(n);
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
t.prototype.faststart = function() {
wAudioMgr.playBtnSound();
var e = wGameData.getKey("gold"), t = wGameData.roomConfig, o = 1;
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && t[n].min_gold <= e && (o = t[n].level);
this.enterRoom(o);
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
break;

case "faststart":
this.faststart();
}
wAudioMgr.playBtnSound();
}
};
t.prototype.loadGame = function() {
var e = n.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(e.prefabUrl, function() {}, function(e, t) {
e ? wLog.e(e) : wViewMgr.openGame(t);
}, e.enName);
};
__decorate([ l(cc.Node) ], t.prototype, "content", void 0);
__decorate([ l(cc.Node) ], t.prototype, "top", void 0);
__decorate([ l(cc.Node) ], t.prototype, "bottom", void 0);
__decorate([ l(cc.Sprite) ], t.prototype, "head", void 0);
__decorate([ l(cc.Label) ], t.prototype, "nickname", void 0);
__decorate([ l(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ l(cc.Label) ], t.prototype, "bankGold", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {
Config: void 0
} ],
JXLWRotate: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "3d20fVC6zlIJbvBoMyxVGU/", "JXLWRotate");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.rollNodes = [];
t.onRoll = !1;
t.onStop = !1;
t.oneCallback = null;
t.item_h = null;
t.view_h = 3;
return t;
}
t.prototype.onLoad = function() {
this.item_h = this.node.height;
};
t.prototype.roll = function() {
var e = this;
if (this.onRoll) this.stop(); else {
wAudioMgr.playSound("sound/sound-tiger-roll-start", wGameData.getGameName());
this.onRoll = !0;
for (var t = function(t) {
var n = o.rollNodes[t], i = -(n.height - o.item_h + 44), a = .7 / o.rollNodes[0].height * o.rollNodes[t].height;
n.target_pos = i;
var l = cc.moveTo(a, cc.v2(n.x, i)), s = cc.callFunc(function() {
e.onStop = !0;
}), r = cc.delayTime(.02), c = cc.callFunc(function() {
wAudioMgr.playSound("sound/sound-tiger-roll-end", wGameData.getGameName());
4 == t && wAudioMgr.stopEffects("sound/sound-tiger-roll-start");
}), d = cc.moveBy(.22, cc.v2(0, 44)).easing(cc.easeIn(1)), u = cc.callFunc(function() {
if (t == e.rollNodes.length - 1) {
e.rotateEnd();
e.oneCallback && e.oneCallback();
}
}), h = cc.sequence(l, s, r, c, d, u);
n.runAction(h);
}, o = this, n = 0; n < this.rollNodes.length; ++n) t(n);
}
};
t.prototype.stop = function() {
var e = this;
if (!this.onStop) {
this.onStop = !0;
for (var t = function(t) {
var n = o.rollNodes[t];
n.stopAllActions();
n.y = n.target_pos + 40;
var i = cc.moveBy(.11, cc.v2(0, -40)), a = cc.callFunc(function() {
if (0 == t) {
wAudioMgr.playSound("sound/sound-tiger-roll-end", wGameData.getGameName());
wAudioMgr.stopEffects("sound/sound-tiger-roll-start");
}
}), l = cc.moveBy(.22, cc.v2(0, 40)).easing(cc.easeIn(1)), s = cc.callFunc(function() {
if (t == e.rollNodes.length - 1) {
e.rotateEnd();
e.oneCallback && e.oneCallback();
}
}), r = cc.sequence(i, a, l, s);
n.runAction(r);
}, o = this, n = 0; n < this.rollNodes.length; ++n) t(n);
}
};
t.prototype.rotateEnd = function() {
this.onRoll = !1;
this.onStop = !1;
};
t.prototype.setEndCall = function(e) {
this.oneCallback = e;
};
__decorate([ a([ cc.Node ]) ], t.prototype, "rollNodes", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {} ],
JXLWView: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "c51a4UYEJ9CEJlu2XP7Sn2+", "JXLWView");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("GoldRoll"), i = e("GoldAnim"), a = e("JXLWModel"), l = cc._decorator, s = l.ccclass, r = l.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.iconImg = null;
t.line = null;
t.gear = null;
t.bet = null;
t.gold = null;
t.goldSpine = null;
t.win = null;
t.btnContent = null;
t.iconRotate = null;
t.iconResult = null;
t.btn_start = null;
t.btn_auto = null;
t.lineList = null;
t.lineIdList = null;
t.iconMul = null;
t.winType0 = null;
t.winType1 = null;
t.numImg = null;
t.lineNode = null;
return t;
}
t.prototype.onLoad = function() {
var e = this;
this.iconImg || wRes.loadRes("_res/Atlas_plist/JXLWLuckyPlayer/阿松大", cc.SpriteAtlas, function(t, o) {
if (!t) {
e.iconImg = o;
e._pendingIcons && (e.setBottomIcon(e._pendingIcons), e._pendingIcons = null);
e._pendingTopIcons && (e.setTopIcon(e._pendingTopIcons), e._pendingTopIcons = null);
e._pendingMixIcon && (e.setMixIcon(), e._pendingMixIcon = !1);
}
}, "JXLW");
wRes.loadResDir("spines", "JXLW");
var t = this.node.getChildByName("bottom");
cc.find("info/name", t).getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 8);
wUIHelp.setHead(cc.find("info/head", t), wGameData.getKey("headimgurl"), !0);
this.iconResult.active = !1;
this.iconRotate.children.forEach(function(e, t) {
for (var o = 0; o < 15 + 5 * t; o++) {
var n = new cc.Node();
n.setContentSize(a.JXLWConfig.icon_w, a.JXLWConfig.icon_h);
n.parent = e;
n.y = o * a.JXLWConfig.icon_h;
var i = new cc.Node();
i.parent = n;
i.scale = .9;
i.addComponent(cc.Sprite);
}
e.height = (15 + 5 * t) * a.JXLWConfig.icon_h;
});
if ("JXLWLuckyPlayer" != this.node.name) for (var o = [ "line", "bet", "free" ], n = (e = function(e) {
var t = n.btnContent.getChildByName(o[e]), i = function(e) {
t.children[0].y = e;
};
t.on("touchstart", function() {
i(2 == e ? -11 : 4);
});
t.on("touchcancel", function() {
i(2 == e ? -6 : e ? 10 : 8.5);
});
t.on("touchend", function() {
i(2 == e ? -6 : e ? 10 : 8.5);
});
}, this), i = 0; i < o.length; i++) e(i);
};
t.prototype.start = function() {
this.node.getChildByName("jack").active = !1;
this.node.getChildByName("qqq").active = !1;
};
t.prototype.initRollShow = function() {
this.setMixIcon();
this.showLine(0);
this.iconResult.active = !1;
this.iconMul.active = !1;
if (this.lineNode) {
this.lineNode.forEach(function(e, t) {
t.children[0].active = !0;
});
this.lineNode = null;
}
};
t.prototype.jackPot = function(e, t, o) {
return __awaiter(this, void 0, void 0, function() {
var a, l, s, r, c, d, u, h, p, g = this;
return __generator(this, function(m) {
switch (m.label) {
case 0:
wAudioMgr.playSound("sound/sound-tiger-box", wGameData.getGameName());
e = e.toString();
(a = this.node.getChildByName("jack")).getChildByName("label").getComponent(cc.Label).string = "x" + t;
a.getChildByName("gold").getComponent(cc.Label).string = "";
a.active = !0;
a.getChildByName("GoldAnim").getComponent(i.default).playAnim();
l = a.getChildByName("spine").getComponent(sp.Skeleton);
wUIHelp.playSpine(l, "start", function() {
wUIHelp.playSpine(l, "idle", null, !0);
});
s = a.getChildByName("gold");
wUIHelp.CountUp_(s, 0, e, .3 * e.length, null, "+");
r = a.getChildByName("content");
c = 0;
for (d = r.children; c < d.length; c++) d[c].active = !1;
u = 0;
o = o.toString();
h = o.length - 1;
m.label = 1;

case 1:
if (!(h >= 0)) return [ 3, 4 ];
p = u++;
r.children[p].active = !0;
r.children[p].getComponent(n.default).setNum(o[h], !0);
return [ 4, wUtils.syncDelayed(wUtils.random(2, 4) / 10, this) ];

case 2:
m.sent();
m.label = 3;

case 3:
h--;
return [ 3, 1 ];

case 4:
return [ 4, wUtils.syncDelayed(1.5, this) ];

case 5:
m.sent();
return [ 2, new Promise(function(e) {
return __awaiter(g, void 0, void 0, function() {
var t, o, n, i;
return __generator(this, function() {
e(!0);
t = cc.moveBy(.1, 0, 10);
o = cc.fadeTo(.15, 0);
n = cc.callFunc(function() {
a.active = !1;
a.y = 0;
a.opacity = 255;
});
i = cc.sequence(cc.spawn(t, o), n);
a.runAction(i);
return [ 2 ];
});
});
}) ];
}
});
});
};
t.prototype.qqq = function(e, t, o) {
return __awaiter(this, void 0, void 0, function() {
var a, l, s, r, c, d, u, h, p, g = this;
return __generator(this, function(m) {
switch (m.label) {
case 0:
wAudioMgr.playSound("sound/sound-tiger-777", wGameData.getGameName(), !0);
o = o.toString();
(a = this.node.getChildByName("qqq")).getChildByName("label").getComponent(cc.Label).string = "x" + t;
a.getChildByName("gold").getComponent(cc.Label).string = "";
a.active = !0;
a.getChildByName("GoldAnim").getComponent(i.default).playAnim();
l = a.getChildByName("spine").getComponent(sp.Skeleton);
wUIHelp.playSpine(l, "start", function() {
wUIHelp.playSpine(l, "idle", null, !0);
});
s = a.getChildByName("gold");
wUIHelp.CountUp_(s, 0, e, .3 * o.length, null, "+");
r = a.getChildByName("content");
c = 0;
for (d = r.children; c < d.length; c++) d[c].active = !1;
u = 0;
h = o.length - 1;
m.label = 1;

case 1:
if (!(h >= 0)) return [ 3, 4 ];
p = u++;
r.children[p].active = !0;
r.children[p].getComponent(n.default).setNum(o[h], !0);
return [ 4, wUtils.syncDelayed(wUtils.random(2, 4) / 10, this) ];

case 2:
m.sent();
m.label = 3;

case 3:
h--;
return [ 3, 1 ];

case 4:
return [ 4, wUtils.syncDelayed(1.5, this) ];

case 5:
m.sent();
return [ 2, new Promise(function(e) {
return __awaiter(g, void 0, void 0, function() {
var t, o, n, i;
return __generator(this, function() {
e(!0);
t = cc.moveBy(.1, 0, 10);
o = cc.fadeTo(.15, 0);
n = cc.callFunc(function() {
a.active = !1;
a.y = 0;
a.opacity = 255;
});
i = cc.sequence(cc.spawn(t, o), n);
a.runAction(i);
return [ 2 ];
});
});
}) ];
}
});
});
};
t.prototype.startFree = function(e) {
var t = this, o = this.node.getChildByName("free").getChildByName("count");
this.setFreeCount(e);
o.active = !0;
o.scale = 1;
var n = o.children[0].getComponent(sp.Skeleton);
wUIHelp.playSpine(n, "start", function() {
t.btnContent.getChildByName("free").active = !0;
wUIHelp.easeIn(o, function() {
i();
});
});
var i = null;
return new Promise(function(e) {
i = e;
});
};
t.prototype.setFreeCount = function(e) {
this.node.getChildByName("free").getChildByName("count").getChildByName("num").getComponent(cc.Label).string = "" + e;
cc.find("free/freecount", this.btnContent).getComponent(cc.Label).string = "" + e;
};
t.prototype.endFree = function() {
cc.find("free", this.btnContent).active = !1;
};
t.prototype.showIconResult = function(e) {
var t = {}, o = new Map();
for (var n in e) {
var i = e[n].num, l = a.JXLWConfig.lineConfig[e[n].line];
t[e[n].line] = !0;
13 == e[n].type && (i = 5);
for (var s = 0; s < i; s++) {
var r = this.iconRotate.children[s].children[l[s]];
13 == e[n].type ? 13 == r.icon && o.set(r, r.icon) : o.set(r, r.icon);
}
}
this.showLine(t);
var c = this.iconResult.getChildByName("content");
wUIHelp.hideSonNode(c);
var d = 0;
o.forEach(function(e, t) {
t.children[0].active = !1;
var o = wUtils.local_world__POS(t);
o = wUtils.world_local_POS(c, o);
var n = c.children[d++];
n || ((n = cc.instantiate(c.children[0])).parent = c);
n.setPosition(o);
var i = a.JXLWConfig.spineList[e], l = n.getChildByName("spine").getComponent(sp.Skeleton);
n.active = !0;
wRes.loadRes(i, sp.SkeletonData, function(e, t) {
l.skeletonData = t;
l.setAnimation(2, "animation", !0);
}, wGameData.getGameName());
});
this.lineNode = o;
this.iconResult.active = !0;
};
t.prototype.showIconMul = function(e, t) {
void 0 === t && (t = !1);
this.iconMul.stopAllActions();
if (t) {
this.iconMul.opacity = 255;
this.iconMul.y = -123;
} else {
wUIHelp.hideSonNode(this.iconMul);
for (var o = 0; o < e.length; o++) {
var n = e[o];
if (n.multiple) {
var i = this.iconMul.children[o];
i || ((i = cc.instantiate(this.iconMul.children[0])).parent = this.iconMul);
var a = i.getChildByName("icon").getComponent(cc.Sprite), l = "" + n.type;
a.spriteFrame = this.iconImg.getSpriteFrame(l);
var s = n.multiple >= 1 ? "x" + n.multiple : "x" + 100 * n.multiple + "%";
i.getChildByName("mul").getComponent(cc.Label).string = s;
i.active = !0;
}
}
this.iconMul.active = e.length;
this.iconMul.opacity = 0;
this.iconMul.y = -178;
var r = cc.fadeIn(.15), c = cc.moveTo(.15, 0, -123), d = cc.spawn(r, c);
this.iconMul.runAction(d);
}
};
t.prototype.showWinType = function(e, t) {
var o = this;
return new Promise(function(n) {
var i = o["winType" + (e = 4 == e ? 1 : 0)];
i.scale = 1;
var a = i.getChildByName("label").getComponent(cc.Label);
a.string = "0";
var l = i.getChildByName("label1").getComponent(cc.Label);
l.string = "0";
i.active = !0;
var s = wUIHelp.CountUp(a, 0, t, 1, "+"), r = wUIHelp.CountUp(l, 0, t, 1, "+"), c = i.getChildByName("content");
if (e) {
var d = c.getChildByName("bigwin");
wUIHelp.playSpine(d, "animation");
o.scheduleOnce(function() {
var e = cc.fadeTo(.25, 0), t = cc.callFunc(function() {
i.active = !1;
i.opacity = 255;
n(!0);
}), o = cc.sequence(e, t);
i.runAction(o);
}, 2.5);
} else {
for (var u = function e() {
for (var d = 0, u = c.children; d < u.length; d++) {
var h = u[d];
h.stopAllActions();
h.active = !1;
}
s.pauseResume();
r.pauseResume();
a.string = "+" + t;
l.string = "+" + t;
o.scheduleOnce(function() {
i.active = !1;
}, .3);
n(!0);
i.off("touchstart", e, o);
o.scheduleOnce(function() {
o.showIconMul(null, !0);
});
}, h = function(e) {
var t = c.children[e];
t || ((t = cc.instantiate(c.children[0])).parent = c);
t.name = e + "";
t.active = !0;
t.opacity = 0;
t.stopAllActions();
t.scale = wUtils.random(50, 70) / 100;
t.setPosition(wUtils.random(-45, 45), -100);
t.angle = wUtils.random(0, 360);
var a = cc.delayTime(.015 * e), l = t.x + wUtils.random(-120, 120), s = cc.fadeIn(.2), r = cc.moveTo(.25, cc.v2(l, 150)), d = cc.moveTo(.3, cc.v2(l, wUtils.random(-10, 10))).easing(cc.easeBackOut()), h = cc.callFunc(function() {
20 == e && n(!0);
if (29 == e) for (var t = function(e) {
var t = Number(e.name), n = cc.delayTime(.02 * t), a = cc.scaleTo(.1, .25), l = cc.moveTo(.2, cc.v2(-440, -193)).easing(cc.easeBackIn()), s = cc.callFunc(function() {
if (29 == e.name) {
i.off("touchstart", u, o);
var t = cc.delayTime(.5), n = cc.fadeTo(.15, 0), a = cc.callFunc(function() {
i.active = !1;
i.opacity = 255;
});
i.runAction(cc.sequence(t, n, a));
}
e.opacity = 0;
});
e.runAction(cc.sequence(n, a, l, s));
}, a = 0, l = c.children; a < l.length; a++) t(l[a]);
}), p = cc.sequence(a, cc.spawn(s, r), d, h);
t.runAction(p);
}, p = 0; p < 30; p++) h(p);
i.on("touchstart", u, o);
i._touchListener.setSwallowTouches(!1);
}
});
};
t.prototype.setBottomIcon = function(e) {
var t = this;
if (this.iconImg) {
cc.log("[JXLW] setBottomIcon, iconImg type:", typeof this.iconImg, "node:", this.iconImg && this.iconImg.name);
this.iconRotate.children.forEach(function(o, n) {
for (var i = 0; i < 3; i++) {
var a = o.children[i], l = e[n][i];
a.icon = l;
var s = "" + l, r = t.iconImg.getSpriteFrame(s);
r || cc.warn("[JXLW] getSpriteFrame null for:", s);
a.children[0].getComponent(cc.Sprite).spriteFrame = r;
}
o.y = 0;
});
} else {
cc.warn("[JXLW] iconImg is null, deferring");
this._pendingIcons = e;
}
};
t.prototype.setTopIcon = function(e) {
var t = this;
this.iconImg ? this.iconRotate.children.forEach(function(o, n) {
for (var i = o.childrenCount - 3, a = i; a < o.childrenCount; a++) {
var l = o.children[a].children[0].getComponent(cc.Sprite), s = "" + e[n][a - i];
l.spriteFrame = t.iconImg.getSpriteFrame(s);
}
}) : this._pendingTopIcons = e;
};
t.prototype.setMixIcon = function() {
var e = this;
this.iconImg ? this.iconRotate.children.forEach(function(t) {
for (var o = t.childrenCount - 3, n = 3; n < o; n++) {
var i = t.children[n].children[0].getComponent(cc.Sprite), l = wUtils.random(1, a.JXLWConfig.iconNum);
i.spriteFrame = e.iconImg.getSpriteFrame("" + l);
}
}) : this._pendingMixIcon = !0;
};
t.prototype.showLine = function(e) {
var t = this, o = !1;
this.lineList.children.forEach(function(n, i) {
var a = t.lineIdList.children[i];
if ("number" == typeof e) n.active = i < e; else {
var l = Boolean(e[i + 1]);
n.active = l;
l && (o = !0);
}
for (var s = function(t) {
var o = t.getComponent(cc.Toggle);
o.node.stopAllActions();
o.isChecked = n.active;
if ("number" != typeof e && n.active) {
var i = cc.delayTime(.5), a = cc.callFunc(function() {
o.isChecked = !o.isChecked;
}), l = cc.repeatForever(cc.sequence(i, a));
o.node.runAction(l);
}
}, r = 0, c = a.children; r < c.length; r++) s(c[r]);
});
this.lineList.parent.getChildByName("anim").active = o;
};
t.prototype.showLineID = function(e) {
this.lineIdList.children.forEach(function(t, o) {
for (var n = o < e ? "check" : "uncheck", i = 0, a = t.children; i < a.length; i++) a[i].getComponent(cc.Toggle)[n]();
});
};
t.prototype.setLine = function(e) {
this.line.string = "" + e;
};
t.prototype.setGear = function(e) {
this.gear.string = "" + e;
};
t.prototype.setBet = function(e) {
this.bet.string = "" + e;
};
t.prototype.setGold = function(e) {
if (this.gold.goldCount) this.gold.setNum(e); else {
this.gold.goldCount = !0;
this.gold.initNum(e);
}
};
t.prototype.setWinGold = function(e) {
this.win.goldCount = e;
this.win.string = "" + e;
};
t.prototype.playGoldSpine = function() {
this.goldSpine.node.active = !0;
this.goldSpine.setAnimation(0, "animation", !1);
};
t.prototype.setBtnEnabled = function(e) {
for (var t = 0; t < 3; t++) {
var o = this.btnContent.children[t].getComponent(cc.Button);
o.interactable = e;
t < 2 && (o.node.children[0].color = e ? cc.color(255, 255, 255) : cc.color(140, 140, 140));
}
};
t.prototype.setAutoState = function(e) {
this.btn_auto.active = e;
this.btn_start.active = !e;
};
__decorate([ r(cc.SpriteAtlas) ], t.prototype, "iconImg", void 0);
__decorate([ r(cc.Label) ], t.prototype, "line", void 0);
__decorate([ r(cc.Label) ], t.prototype, "gear", void 0);
__decorate([ r(cc.Label) ], t.prototype, "bet", void 0);
__decorate([ r(n.default) ], t.prototype, "gold", void 0);
__decorate([ r(sp.Skeleton) ], t.prototype, "goldSpine", void 0);
__decorate([ r(cc.Label) ], t.prototype, "win", void 0);
__decorate([ r(cc.Node) ], t.prototype, "btnContent", void 0);
__decorate([ r(cc.Node) ], t.prototype, "iconRotate", void 0);
__decorate([ r(cc.Node) ], t.prototype, "iconResult", void 0);
__decorate([ r(cc.Node) ], t.prototype, "btn_start", void 0);
__decorate([ r(cc.Node) ], t.prototype, "btn_auto", void 0);
__decorate([ r(cc.Node) ], t.prototype, "lineList", void 0);
__decorate([ r(cc.Node) ], t.prototype, "lineIdList", void 0);
__decorate([ r(cc.Node) ], t.prototype, "iconMul", void 0);
__decorate([ r(cc.Node) ], t.prototype, "winType0", void 0);
__decorate([ r(cc.Node) ], t.prototype, "winType1", void 0);
__decorate([ r(cc.SpriteAtlas) ], t.prototype, "numImg", void 0);
return __decorate([ s ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {
GoldAnim: void 0,
GoldRoll: void 0,
JXLWModel: "JXLWModel"
} ]
}, {}, [ "JXLWControlle", "JXLWLoad", "JXLWLuckyPlayer", "JXLWModel", "JXLWRoom", "JXLWRotate", "JXLWView" ]);