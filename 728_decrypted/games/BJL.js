window.__require = function t(e, n, i) {
function o(a, l) {
if (!n[a]) {
if (!e[a]) {
var s = a.split("/");
s = s[s.length - 1];
if (!e[s]) {
var c = "function" == typeof __require && __require;
if (!l && c) return c(s, !0);
if (r) return r(s, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = s;
}
var h = n[a] = {
exports: {}
};
e[a][0].call(h.exports, function(t) {
return o(e[a][1][t] || t);
}, h, h.exports, t, e, n, i);
}
return n[a].exports;
}
for (var r = "function" == typeof __require && __require, a = 0; a < i.length; a++) o(i[a]);
return o;
}({
BJLChart: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "5ff45gVm+NMnJcghOFeynve", "BJLChart");
Object.defineProperty(n, "__esModule", {
value: !0
});
var i = t("BJLTrendIem"), o = cc._decorator, r = o.ccclass, a = o.property, l = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.trendItemController = null;
e.l_content = null;
e.trendList = null;
e.isAnim = !1;
return e;
}
e.prototype.upLabel = function() {
var t = this.trendList.reduce(function(t, e) {
return t + (e[5] ? 1 : 0);
}, 0);
this.l_content.getChildByName("drawl").getComponent(cc.Label).string = "" + t;
t = this.trendList.reduce(function(t, e) {
return t + (e[3] ? 1 : 0);
}, 0);
this.l_content.getChildByName("zhuangl").getComponent(cc.Label).string = "" + t;
t = this.trendList.reduce(function(t, e) {
return t + (e[4] ? 1 : 0);
}, 0);
this.l_content.getChildByName("xianl").getComponent(cc.Label).string = "" + t;
t = this.trendList.reduce(function(t, e) {
return t + (e[1] ? 1 : 0);
}, 0);
this.l_content.getChildByName("zdui").getComponent(cc.Label).string = "" + t;
t = this.trendList.reduce(function(t, e) {
return t + (e[2] ? 1 : 0);
}, 0);
this.l_content.getChildByName("xdui").getComponent(cc.Label).string = "" + t;
this.l_content.getChildByName("zjs").getComponent(cc.Label).string = "" + this.trendList.length;
};
e.prototype.init = function(t) {
this.trendList = t;
if (this.node.active) {
this.upLabel();
this.trendItemController.init(t);
}
};
e.prototype.onClick = function() {
var t = this;
if (!this.isAnim) {
wAudioMgr.playBtnSound();
this.isAnim = !0;
var e = this.node.getChildByName("main"), n = cc.moveTo(.15, cc.v2(0, -375)), i = cc.fadeTo(.2, 0), o = cc.callFunc(function() {
t.node.active = !1;
t.isAnim = !1;
}), r = cc.sequence(cc.spawn(n, i), o);
e.runAction(r);
}
};
e.prototype.openShow = function(t) {
var e = this;
this.node.active = !0;
this.init(t);
var n = this.node.getChildByName("main");
n.opacity = 0;
n.y = -375;
this.isAnim = !0;
var i = cc.moveTo(.15, cc.v2(0, 0)), o = cc.fadeTo(.25, 255), r = cc.callFunc(function() {
e.isAnim = !1;
}), a = cc.sequence(cc.spawn(i, o), r);
n.runAction(a);
};
__decorate([ a(i.default) ], e.prototype, "trendItemController", void 0);
__decorate([ a(cc.Node) ], e.prototype, "l_content", void 0);
return __decorate([ r ], e);
}(cc.Component);
n.default = l;
cc._RF.pop();
}, {
BJLTrendIem: "BJLTrendIem"
} ],
BJLControlle: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "d89539xrFZDDbl6qeLOgG1D", "BJLControlle");
Object.defineProperty(n, "__esModule", {
value: !0
});
var i = t("MultiBase"), o = t("BJLChart"), r = t("BJLModel"), a = t("BJLView"), l = cc._decorator, s = l.ccclass;
l.property;
var c = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.Chart = null;
e.View = null;
e.Model = null;
return e;
}
e.prototype.start = function() {
this.initProxy();
this.initNetWorkEvevt();
this.m_init();
};
e.prototype.initBtnEvent = function() {
this.node.on(cc.Node.EventType.TOUCH_START, function(t) {
for (var e = 1; e < 9; e++) {
var n = cc.find("table/" + e + "/ani", this.node).getComponent(cc.Collider), i = t.getLocation();
i = wUtils.world_local_POS(n.node, i);
if (cc.Intersection.pointInPolygon(i, n.points)) {
this.playerBet(e);
break;
}
}
}, this);
};
e.prototype.update = function(t) {
if (this.Model.time) {
this.Model.newTime += t;
this.Model.newTime > 1 && this.Model.time--;
}
};
e.prototype.initProxy = function() {
var t = this;
this.Chart = this.node.getChildByName("BJLChart").getComponent(o.default);
this.View = this.node.getComponent(a.default);
this.Model = wUtils.creatorProxy(new r.BJLModel());
this.Model.onEvevt("gameState", function(e) {
t.View.setGameStatus(1 == e);
t.View.setBtn_Bank(1 == e);
if (1 != e) {
t.View.chip_On_Off(0);
t.View.setBtn_go_on(!1);
} else t.Model.gold = t.Model.gold;
t.m_setBankBtn(1 == e);
});
this.Model.onEvevt("time", function(e) {
e = !e || e <= 0 ? 0 : e;
t.View.setTime(e || 0, t.Model.gameState);
t.Model.newTime = 0;
});
this.Model.onEvevt("gold", function(e) {
t.View.setMyGold(e);
t.Model.banker && wGameData.getKey("uid") != t.Model.banker.uid && 1 == t.Model.gameState && t.View.chip_On_Off(e);
var n = t.Model.getLastbet(t.Model.lastbet);
1 == t.Model.gameState && n && t.Model.gold >= n && wGameData.getKey("uid") != t.Model.banker.uid ? t.View.setBtn_go_on(!0) : t.View.setBtn_go_on(!1);
if (e < r.BJLConfig.chip[t.Model.selectChip]) for (;r.BJLConfig.chip[--t.Model.selectChip] && !(e >= r.BJLConfig.chip[t.Model.selectChip]); ) ;
});
this.Model.onEvevt("banker", function(e) {
if (e.uid == wGameData.getKey("uid")) {
t.View.chip_On_Off(0);
t.View.setBtn_go_on(!1);
}
});
this.Model.onEvevt("selectChip", function(e) {
t.View.selectChip(e);
});
this.Model.onEvevt("allnum", function(e) {
t.View.upPlayerCpunt(e);
});
this.Model.onEvevt("totalBet", function(e) {
t.View.setTotalBetNum(e);
});
};
e.prototype.initNetWorkEvevt = function() {
var t = this;
wGEvent.on("Msg_BJL_PlayerAct", function(e) {
1 == e.status ? t.Msg_BJL_PlayerAct(e.data) : wLog.e("玩家退出失败");
}, this);
wGEvent.on("Msg_BJL_Out", function(e) {
1 == e.status ? t.Msg_BJL_Out(e.data) : wLog.e("玩家退出失败");
}, this);
wGEvent.on("Msg_BJL_StageBet", function(e) {
1 == e.status ? t.Msg_BJL_StageBet(e.data) : wLog.e("玩家押注失败");
}, this);
wGEvent.on("Msg_BJL_StageEnd", function(e) {
1 == e.status ? t.Msg_BJL_StageEnd(e.data) : wLog.e("玩家开奖失败");
}, this);
wGEvent.on("Msg_BJL_ActBet", function(e) {
1 == e.status ? t.Msg_BJL_ActBet(e.data) : wLog.e("玩家下注失败");
}, this);
wGEvent.on("Msg_BJL_SysActBet", function(e) {
1 == e.status ? t.Msg_BJL_SysActBet(e.data) : wLog.e("桌面情况失败");
}, this);
wGEvent.on("Msg_BJL_ListInfo", function(e) {
1 == e.status ? t.Msg_BJL_ListInfo(e.data) : wLog.e("桌面情况失败");
}, this);
};
e.prototype.m_roomInfo = function(t) {
this.initBtnEvent();
this.Model.initRoom(JSON.parse(JSON.stringify(t)));
var e = 2 == this.Model.gameState && this.Model.time <= 3, n = {};
for (var i in t.mybet) {
!e && this.View.setMyBetNum(i, t.mybet[i]);
!n[i] && (n[i] = []);
n[i].push(t.mybet[i]);
}
if (!e) {
var o = this.Model.allBet;
for (var i in o) {
var r = this.Model.maxScoreSplit(o[i]);
this.View.initChip(r, i);
this.View.setBetNum(i, o[i]);
this.Model.totalBet += o[i];
}
}
if (1 == this.Model.gameState || e) this.Model.bet = n; else {
this.View.initResultPoker(t.result);
this.View.showResult(t.result, this.Model);
this.View.winTable(t.result.result);
}
this.Model.getLastbet(n) && (this.Model.lastbet = n);
this.View.initTrend(this.Model.history);
this.Chart.init(this.Model.history);
this.Model.gold = this.Model.gold;
this.View.initPlayerList(t.playerlist);
};
e.prototype.Msg_BJL_StageBet = function(t) {
this.Model.gold = this.Model.gold;
this.View.closeResult();
this.ininStart();
wAudioMgr.playSound("sound/START_W", "BJL");
this.View.start_bet();
this.Model.gameState = 1;
this.Model.time = t.time;
};
e.prototype.ininStart = function() {
this.View.initPoker();
this.View.recoveryChip();
this.Model.initDesktop();
this.View.initMyBetNum();
this.View.initBetNum();
this.Model.totalBet = 0;
this.View.winTable(null);
this.View.stopWinTable();
};
e.prototype.Msg_BJL_StageEnd = function(t) {
return __awaiter(this, void 0, void 0, function() {
var e, n;
return __generator(this, function(i) {
switch (i.label) {
case 0:
this.Model.gameState = 2;
this.launchAllChip();
this.Model.time = t.time;
this.Model.selectChip = -1;
return [ 4, wUtils.syncDelayed(.5, this) ];

case 1:
i.sent();
return [ 4, this.View.dealCards(t.cards.banker, t.cards.player) ];

case 2:
i.sent();
e = this.View.showCardType(t.result, t.cards);
n = "sound/x/X_" + e[0];
wAudioMgr.playSound(n, "BJL");
this.scheduleOnce(function() {
var t = "sound/z/Z_" + e[1];
wAudioMgr.playSound(t, "BJL");
}, 1.2);
this.scheduleOnce(function() {
e[0] > e[1] ? wAudioMgr.playSound("sound/x/X_Y", "BJL") : e[0] < e[1] && wAudioMgr.playSound("sound/z/Z_Y", "BJL");
}, 2.5);
return [ 4, wUtils.syncDelayed(1, this) ];

case 3:
i.sent();
return [ 4, this.View.bankerRecoveryChip(t.result) ];

case 4:
i.sent();
return [ 4, this.View.bankerGiveChip(t.result, this.Model) ];

case 5:
i.sent();
this.View.chipFlyPlayer(t.win, this.Model.bet, t.result, this.Model);
return [ 4, wUtils.syncDelayed(1, this) ];

case 6:
i.sent();
this.upPlayerGold(wGameData.getKey("uid"), t.gold);
this.Model.getLastbet(this.Model.bet) && (this.Model.lastbet = this.Model.bet);
this.Model.history.push(t.result);
this.View.addTrend(this.Model.history.length - 1, t.result, !0);
this.Chart.init(this.Model.history);
this.View.showResult(t, this.Model);
this.View.winTable(t.result);
this.Model.bet = {};
return [ 2 ];
}
});
});
};
e.prototype.Msg_BJL_ActBet = function(t) {
var e = wGameData.getKey("uid");
!this.Model.bet[t.region] && (this.Model.bet[t.region] = []);
this.Model.bet[t.region].push(t.gold);
this.upPlayerGold(e, this.Model.gold - t.gold);
for (var n = 0, i = 0, o = this.Model.bet[t.region]; i < o.length; i++) n += o[i];
this.View.setMyBetNum(t.region, n);
this.Model.totalBet += t.gold;
this.Model.allBet[t.region] += t.gold;
this.View.setBetNum(t.region, this.Model.allBet[t.region]);
var a = [ t.gold ];
-1 == r.BJLConfig.chip.indexOf(t.gold) && (a = this.Model.maxScoreSplit(t.gold));
for (var l = 0; l < a.length; l++) this.View.myBet(t.region, a[l]);
t.gold;
};
e.prototype.upPlayerGold = function(t, e) {
wGameData.setKey("gold", e);
this.Model.gold = e;
};
e.prototype.Msg_BJL_SysActBet = function(t) {
this.unscheduleAllCallbacks();
this.Model.jettonList.length = 0;
var e = t;
for (var n in e) {
var i = e[n];
i -= this.Model.allBet[n];
for (var o = 0, r = this.Model.scoreSplit(i); o < r.length; o++) {
var a = r[o];
this.Model.jettonList.push([ a, n ]);
}
}
this.initFhip();
};
e.prototype.initFhip = function() {
var t = this;
if (!(this.Model.jettonList.length <= 0)) {
this.Model.jettonList.sort(function() {
return Math.random() > .5 ? -1 : 1;
});
var e = (this.Model.time > 2 ? 2 : .5) / this.Model.jettonList.length;
this.schedule(function() {
t.launchFhip();
}, e);
this.schedule(function() {
t.Model.jettonSound = !0;
}, .2);
}
};
e.prototype.launchFhip = function(t) {
void 0 === t && (t = !0);
var e = this.Model.jettonList.shift();
if (e) {
if (t) {
this.View.playerBet(e[0], e[1]);
if (this.Model.jettonSound) {
this.Model.jettonSound = !1;
wAudioMgr.playSound("sound/GET_GOLD", "BJL");
}
}
this.Model.totalBet += e[0];
this.Model.allBet[e[1]] += e[0];
this.View.setBetNum(e[1], this.Model.allBet[e[1]]);
} else this.unscheduleAllCallbacks();
};
e.prototype.launchAllChip = function() {
var t = this;
this.unscheduleAllCallbacks();
if (this.Model.jettonList.length) {
for (var e = {}, n = 0, i = this.Model.jettonList; n < i.length; n++) {
var o = i[n], r = o[1];
!e[r] && (e[r] = 0);
e[r] += o[0];
}
this.Model.jettonList.length = 0;
var a = function(n) {
var i = e[n];
l.Model.maxScoreSplit(i).forEach(function(e) {
t.Model.jettonList.push([ e, n ]);
});
}, l = this;
for (var r in e) a(r);
wAudioMgr.playSound("sound/GET_GOLD", "BJL");
for (;this.Model.jettonList.length; ) this.launchFhip(!1);
}
};
e.prototype.onClick = function(t, e) {
switch (e) {
case "closeResult":
this.View.closeResult();
break;

case "hall":
if (this.Model.getLastbet(this.Model.bet) || this.Model.banker && this.Model.banker.uid == wGameData.getKey("uid")) {
wUIManager.showTips("游戏进行中,请等待游戏结束", wUIManager.TIPS_OK);
return;
}
wAudioMgr.playCloseSound();
this.m_quitGame();
return;

case "bank":
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
break;

case "bet":
this.lastBet();
break;

case "0":
case "1":
case "2":
case "3":
case "4":
this.Model.selectChip = e;
wAudioMgr.playSound("sound/SELECTED", "BJL");
return;

case "playerlist":
wViewMgr.openPage({
path: "prefab/BJLPlayerList",
bundle: "BJL"
});
break;

case "trend":
this.Chart.openShow(this.Model.history);
}
wAudioMgr.playBtnSound();
};
e.prototype.playerBet = function(t) {
1 == this.Model.gameState ? -1 != this.Model.selectChip ? wNetWork.send("Msg_BJL_ActBet", {
gold: r.BJLConfig.chip[this.Model.selectChip],
region: Number(t)
}) : wUIManager.showTips("请选择下注筹码！", wUIManager.TIPS_WHITE) : wUIManager.showTips("请稍后，还没到下注时间哟！", wUIManager.TIPS_WHITE);
};
e.prototype.lastBet = function() {
var t = this.Model.lastbet, e = !1;
for (var n in t) if (Object.prototype.hasOwnProperty.call(t, n)) {
for (var i = 0, o = 0, r = t[n]; o < r.length; o++) {
var a = r[o];
i += Number(a);
}
if (i) {
wNetWork.send("Msg_BJL_ActBet", {
gold: i,
region: Number(n)
});
e = !0;
}
}
if (e) {
this.View.setBtn_go_on(!1);
this.Model.lastbet = {};
}
};
e.prototype.m_upGameGold = function() {
this.Model.gold = wGameData.getKey("gold");
};
e.prototype.m_NetWorkState = function() {};
e.prototype.Msg_BJL_PlayerAct = function() {
++this.Model.allnum;
};
e.prototype.Msg_BJL_Out = function(t) {
t.uid != wGameData.getKey("uid") && --this.Model.allnum;
};
e.prototype.Msg_BJL_ListInfo = function(t) {
this.View.initPlayerList(t);
};
return __decorate([ s ], e);
}(i.default);
n.default = c;
cc._RF.pop();
}, {
BJLChart: "BJLChart",
BJLModel: "BJLModel",
BJLView: "BJLView",
MultiBase: void 0
} ],
BJLLoad: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "faa133Nih1CCo+cwvqVvFOY", "BJLLoad");
Object.defineProperty(n, "__esModule", {
value: !0
});
var i = t("Config"), o = cc._decorator, r = o.ccclass;
o.property;
var a = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.isEnterRoom = !1;
return e;
}
e.prototype.onLoad = function() {
var t = this, e = i.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir(e.prefabUrl, e.enName);
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
t.initShow();
}, this);
};
e.prototype.onEnable = function() {
var t = this;
this.scheduleOnce(function() {
t.enterRoom(5);
}, .5);
};
e.prototype.initShow = function() {
var t = this;
this.isEnterRoom = !1;
var e = cc.fadeOut(.2), n = cc.callFunc(function() {
t.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
t.node.parent.destroyAllChildren();
}
}), i = cc.sequence(e, n);
this.node.runAction(i);
};
e.prototype.Msg_Hall_EnterRoom = function(t) {
if (1 == t.status) {
wGameData.roomID = t.data.rid;
this.loadGame();
} else {
wLog.e("进入房间消息失败");
wGameData.roomID = null;
wGameData.isReconnect = !1;
wUIManager.hideLoadingUI();
wViewMgr.enterHall();
}
};
e.prototype.enterRoom = function(t) {
var e = this;
if (!this.isEnterRoom) {
wGameData.roomLevel = t;
if (wGameData.gameRepair()) {
wUIManager.showTips("游戏维护中");
wViewMgr.enterHall();
} else {
this.isEnterRoom = !0;
var n = wGEvent.on("Msg_Hall_EnterRoom", function(t) {
e.Msg_Hall_EnterRoom(t);
wGEvent.off(n);
e.unscheduleAllCallbacks();
n = null;
}, this);
this.scheduleOnce(function() {
if (n) {
e.isEnterRoom = !1;
wGEvent.off(n);
}
}, 20);
wNetWork.send("Msg_Hall_EnterRoom", {
tableid: 0,
gtype: Number(wGameData.gameID),
level: t
});
}
}
};
e.prototype.loadGame = function() {
var t = i.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(t.prefabUrl, function() {}, function(t, e) {
t ? wLog.e(t) : wViewMgr.openGame(e);
}, t.enName);
};
return __decorate([ r ], e);
}(cc.Component);
n.default = a;
cc._RF.pop();
}, {
Config: void 0
} ],
BJLModel: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "8f475WVUalPo4PIP5QL7L2B", "BJLModel");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.BJLModel = n.trendHelper = n.BJLConfig = void 0;
n.BJLConfig = {
chip: [ 1e4, 1e5, 1e6, 5e6, 1e7 ],
bet: {
1: 11,
2: 11,
3: 1,
4: 1,
5: 8,
6: 2,
7: 2,
8: 32
}
};
n.trendHelper = new function() {
this.TYPE_DUI = 1;
this.TYPE_XIAN = 2;
this.TYPE_ZHUANG = 4;
this.TYPE_HU = 8;
this.HONG = 1;
this.LAN = 2;
this.getDaluArr = function(t) {
var e, n, i = [], o = 0, r = 0;
for (e = 0; e < t.length; ++e) for (n = 0; n < t[e].length; ++n) {
var a = t[e][n], l = Number(a[0]), s = a.slice(1);
if ((l & this.TYPE_HU) > 0) {
if (i[o] && i[o][r]) {
var c = i[o][r][0] + "h";
++r;
i[o][r] = c + s;
}
} else if (i[o] && i[o][r]) {
if ((l & this.TYPE_ZHUANG) > 0 && (Number(i[o][r][0]) & this.TYPE_ZHUANG) > 0) ++r; else if ((l & this.TYPE_XIAN) > 0 && (Number(i[o][r][0]) & this.TYPE_XIAN) > 0) ++r; else {
i[++o] = [];
r = 0;
}
i[o][r] = l + s;
} else {
i[o] = [];
i[o][r] = l + s;
}
}
return i;
};
this.getFormatArr = function(t) {
var e, n, i = 0, o = 0, r = [];
for (e = 0; e < t.length; ++e) {
r[i = e] || (r[i] = [ null, null, null, null, null ]);
for (n = 0; n < t[e].length; ++n) if (0 === n) {
o = 0;
r[i][o] = t[e][n];
} else if (null !== r[i][o + 1] || 5 === o || null === r[i][o - 1]) {
r[++i] || (r[i] = [ null, null, null, null, null ]);
r[i][o] = t[e][n];
} else {
++o;
r[i][o] = t[e][n];
}
}
return r;
};
this.getDaluArr_1 = function(t) {
var e, n, i = [], o = 0, r = 0;
for (e = 0; e < t.length; ++e) for (n = 0; n < t[e].length; ++n) if ((t[e][n] & this.TYPE_HU) > 0) i[o] && i[o][r] && (i[o][r] += this.TYPE_HU); else if (i[o] && i[o][r]) {
if ((t[e][n] & this.TYPE_ZHUANG) > 0 && (i[o][r] & this.TYPE_ZHUANG) > 0) ++r; else if ((t[e][n] & this.TYPE_XIAN) > 0 && (i[o][r] & this.TYPE_XIAN) > 0) ++r; else {
i[++o] = [];
r = 0;
}
i[o][r] = t[e][n];
} else {
i[o] = [];
i[o][r] = t[e][n];
}
return i;
};
this.getFormatArr_1 = function(t) {
var e, n, i = 0, o = 0, r = [];
for (e = 0; e < t.length; ++e) {
r[i = e] || (r[i] = [ null, null, null ]);
for (n = 0; n < t[e].length; ++n) if (0 === n) {
o = 0;
r[i][o] = t[e][n];
} else if (null !== r[i][o + 1] || 5 === o || null === r[i][o - 1]) {
r[++i] || (r[i] = [ null, null, null ]);
r[i][o] = t[e][n];
} else {
++o;
r[i][o] = t[e][n];
}
}
return r;
};
this.getDayanArr = function(t) {
var e, n, i = [];
for (e = 1; e < t.length; ++e) {
n = 1 === e ? 1 : 0;
for (;n < t[e].length; ) {
var o = 0 === n ? t[e - 1].length === t[e - 2].length ? this.HONG : this.LAN : t[e - 1][n] ? this.HONG : t[e - 1][n - 1] ? this.LAN : this.HONG;
if (0 === i.length) i.push([ o ]); else {
var r = i[i.length - 1];
0 === r.length ? r.push(o) : r[r.length - 1] !== o ? i.push([ o ]) : r.push(o);
}
++n;
}
}
return i;
};
this.getXiaoluArr = function(t) {
var e, n, i = [];
for (e = 2; e < t.length; ++e) {
n = 2 === e ? 1 : 0;
for (;n < t[e].length; ) {
var o = 0 === n ? t[e - 1].length === t[e - 3].length ? this.HONG : this.LAN : t[e - 2][n] ? this.HONG : t[e - 2][n - 1] ? this.LAN : this.HONG;
if (0 === i.length) i.push([ o ]); else {
var r = i[i.length - 1];
0 === r.length ? r.push(o) : r[r.length - 1] !== o ? i.push([ o ]) : r.push(o);
}
++n;
}
}
return i;
};
this.getTanglangArr = function(t) {
var e, n, i = [];
for (e = 3; e < t.length; ++e) {
n = 3 === e ? 1 : 0;
for (;n < t[e].length; ) {
var o = 0 === n ? t[e - 1].length === t[e - 4].length ? this.HONG : this.LAN : t[e - 3][n] ? this.HONG : t[e - 3][n - 1] ? this.LAN : this.HONG;
if (0 === i.length) i.push([ o ]); else {
var r = i[i.length - 1];
0 === r.length ? r.push(o) : r[r.length - 1] !== o ? i.push([ o ]) : r.push(o);
}
++n;
}
}
return i;
};
}();
var i = function() {
function t() {
this.gameState = 1;
this.time = 0;
this.newTime = 0;
this.banker = {};
this.allnum = 0;
this.jettonSound = !0;
this.jettonList = [];
this.allBet = null;
this.totalBet = 0;
this.bet = {};
this.lastbet = {};
this.selectChip = -1;
this.bankerturn = !1;
}
t.prototype.initRoom = function(t) {
this.allBet = t.allbet;
this.allnum = t.allnum;
this.history = t.history;
this.gold = wGameData.getKey("gold");
this.gameState = t.stage;
this.time = t.time;
};
t.prototype.getLastbet = function(t) {
var e = 0;
for (var n in t) for (var i = 0, o = t[n]; i < o.length; i++) e += o[i];
return e;
};
t.prototype.initDesktop = function() {
this.allBet = {
1: 0,
2: 0,
3: 0,
4: 0,
5: 0,
6: 0,
7: 0,
8: 0
};
this.jettonList = [];
this.totalBet = 0;
};
t.prototype.scoreSplit = function(t) {
for (var e = []; ;) {
for (var i = 0, o = 5; o > -1; o--) if (t > n.BJLConfig.chip[o]) {
i = o;
break;
}
if (i < 1) {
for (;t > 0; ) {
e.push(1e4);
t -= 1e4;
}
break;
}
var r = i - 1 > -1 ? i - 1 : 0, a = n.BJLConfig.chip[wUtils.random(r, i)];
e.push(a);
t -= a;
}
return e;
};
t.prototype.maxScoreSplit = function(t) {
for (var e = [], i = 5; i > -1; i--) for (var o = n.BJLConfig.chip[i]; t >= o; ) {
e.push(o);
t -= o;
}
return e;
};
return t;
}();
n.BJLModel = i;
cc._RF.pop();
}, {} ],
BJLPlayerList: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "9e82eKy7tdKAZqTU98gP7/M", "BJLPlayerList");
Object.defineProperty(n, "__esModule", {
value: !0
});
var i = t("PopupBase"), o = cc._decorator, r = o.ccclass, a = o.property, l = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.content = null;
return e;
}
e.prototype.onLoad = function() {
var t = this;
wUtils.sendMsg("Msg_BJL_GetUserList", {}, this).then(function(e) {
var n = [];
for (var i in e) if (Object.prototype.hasOwnProperty.call(e, i)) {
e[i].uid = i;
n.push(e[i]);
}
t.initList(n);
});
};
e.prototype.initList = function(t) {
cc.find("label", this.main).getComponent(cc.Label).string = t.length + "在线";
t.sort(function(t, e) {
return e.gold - t.gold;
});
for (var e = this.main.getChildByName("item"), n = 0; n < t.length; n++) {
var i = cc.instantiate(e);
i.parent = this.content;
i.active = !0;
var o = t[n], r = o.uid == wGameData.getKey("uid") ? o.nickname : o.username;
i.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(r, 8);
wUIHelp.setHead(cc.find("head/head", i), o.headimgurl);
i.getChildByName("gold").getComponent(cc.Label).string = wUtils.goldFormat(o.gold, 1, 1);
}
};
__decorate([ a(cc.Node) ], e.prototype, "content", void 0);
return __decorate([ r ], e);
}(i.default);
n.default = l;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
BJLTrendIem: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "4d6fdJAeGhAs4o98USxebMQ", "BJLTrendIem");
Object.defineProperty(n, "__esModule", {
value: !0
});
var i = cc._decorator, o = i.ccclass, r = i.property, a = t("BJLModel"), l = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.zhupanContent = null;
e.daluContent = null;
e.dayanContent = null;
e.tanglangContent = null;
e.xiaoluContent = null;
return e;
}
e.prototype.onLoad = function() {
this.createdNodeArr = [];
};
e.prototype.clearOldData = function() {
for (var t = 0; t < this.createdNodeArr.length; ++t) this.createdNodeArr[t].destroy();
this.createdNodeArr = [];
};
e.prototype.init = function(t) {
this.clearOldData();
var e = this.convertToZhupanArr(t);
this.writeZhuPan(e);
var n = [];
for (var i in t) for (var o = t[i], r = 3; r < 6; r++) if (o[r]) {
var l = r + " ";
o[1] && (l += "z");
o[2] && (l += "x");
n.push(l);
break;
}
var s = this.convertToZhupanArr1(n), c = a.trendHelper.getDaluArr(s);
c = a.trendHelper.getFormatArr(c);
this.writeDalu(c);
var h = this.convertToZhupanArr2(n);
h = a.trendHelper.getDaluArr_1(h);
var d = a.trendHelper.getDayanArr(h);
this.writeDayan(a.trendHelper.getFormatArr_1(d));
var u = a.trendHelper.getXiaoluArr(h);
this.writeXiaolu(a.trendHelper.getFormatArr_1(u));
var p = a.trendHelper.getTanglangArr(h);
this.writeTanglang(a.trendHelper.getFormatArr_1(p));
};
e.prototype.convertToZhupanArr = function(t) {
for (var e = [], n = [], i = 0; i < t.length; ++i) {
var o = t[i], r = "";
o[3] ? r += "3" : o[4] ? r += "4" : o[5] && (r += "5");
o[1] && (r += "z");
o[2] && (r += "x");
n.push(r);
if (6 === n.length) {
e.push(n);
n = [];
}
}
0 !== n.length && e.push(n);
return e;
};
e.prototype.convertToZhupanArr1 = function(t) {
for (var e = [], n = [], i = 0; i < t.length; ++i) {
var o = t[i], r = o.slice(1);
o.includes("3") ? n.push(a.trendHelper.TYPE_ZHUANG + r) : o.includes("4") ? n.push(a.trendHelper.TYPE_XIAN + r) : o.includes("5") && n.push(a.trendHelper.TYPE_HU + r);
if (5 === n.length) {
e.push(n);
n = [];
}
}
0 !== n.length && e.push(n);
return e;
};
e.prototype.convertToZhupanArr2 = function(t) {
for (var e = [], n = [], i = 0; i < t.length; ++i) {
var o = t[i];
o.slice(1);
o.includes("3") ? n.push(a.trendHelper.TYPE_ZHUANG) : o.includes("4") ? n.push(a.trendHelper.TYPE_XIAN) : o.includes("5") && n.push(a.trendHelper.TYPE_HU);
if (3 === n.length) {
e.push(n);
n = [];
}
}
0 !== n.length && e.push(n);
return e;
};
e.prototype.writeZhuPan = function(t) {
for (var e = this.zhupanContent.getComponent(cc.ScrollView).content, n = e.getChildByName("item").height / 6, i = 11; i < t.length + 1; i++) (a = e.children[i]) || ((a = cc.instantiate(e.children[e.childrenCount - 1])).parent = e);
for (i = 0; i < t.length; ++i) for (var o = e.children[i], r = 0; r < t[i].length; ++r) {
var a;
(a = this.getZhupanNodeByType(t[i][r])).active = !0;
o.addChild(a, 1, "item");
a.x = 0;
a.y = -n * r - 25.4;
this.createdNodeArr.push(a);
}
this.zhupanContent.getComponent(cc.ScrollView).scrollToRight();
};
e.prototype.getZhupanNodeByType = function(t) {
var e = this.node.getChildByName("zlcopy"), n = null;
n = t.includes("3") ? e.getChildByName("zhuang") : t.includes("4") ? e.getChildByName("xian") : e.getChildByName("he");
n = cc.instantiate(n);
var i = null;
t.includes("z") && (i = e.getChildByName("z")).setPosition(-17.5, 17.5);
t.includes("x") && (i = e.getChildByName("x")).setPosition(17.5, -17.5);
if (i) {
(i = cc.instantiate(i)).parent = n;
i.active = !0;
}
return n;
};
e.prototype.writeDalu = function(t) {
for (var e = this.daluContent.getComponent(cc.ScrollView).content, n = e.getChildByName("item").height / 6, i = n / 2, o = 33; o < t.length + 1; o++) (l = e.children[o]) || ((l = cc.instantiate(e.children[e.childrenCount - 1])).parent = e);
for (o = 0; o < t.length; ++o) for (var r = e.children[o], a = 0; a < t[o].length; ++a) if (t[o][a]) {
var l;
(l = this.getDaluNodeByType(t[o][a])).active = !0;
r.addChild(l, 1, "item");
l.x = 0;
l.y = -n * a - i;
this.createdNodeArr.push(l);
}
this.daluContent.getComponent(cc.ScrollView).scrollToRight();
};
e.prototype.getDaluNodeByType = function(t) {
var e = this.node.getChildByName("dlcopy"), n = null, i = t.slice(1);
n = (Number(t[0]) & a.trendHelper.TYPE_ZHUANG) > 0 ? e.getChildByName("lan") : e.getChildByName("hong");
(n = cc.instantiate(n)).children[0].active = i.includes("h");
var o = null;
i.includes("z") && (o = e.getChildByName("z")).setPosition(-8, 8);
i.includes("x") && (o = e.getChildByName("x")).setPosition(8, -8);
if (o) {
(o = cc.instantiate(o)).parent = n;
o.active = !0;
}
return n;
};
e.prototype.writeXiaolu = function(t) {
for (var e = this.xiaoluContent.getComponent(cc.ScrollView).content, n = e.getChildByName("item").height / 6, i = n / 2, o = 33; o < t.length + 1; o++) (l = e.children[o]) || ((l = cc.instantiate(e.children[e.childrenCount - 1])).parent = e);
for (o = 0; o < t.length; ++o) for (var r = e.children[o], a = 0; a < t[o].length; ++a) if (t[o][a]) {
var l;
(l = this.getXiaoluNodeByType(t[o][a])).active = !0;
r.addChild(l, 1, "item");
l.x = 0;
l.y = -n * a - i;
this.createdNodeArr.push(l);
}
this.xiaoluContent.getComponent(cc.ScrollView).scrollToRight();
};
e.prototype.getXiaoluNodeByType = function(t) {
var e = t === a.trendHelper.HONG ? this.node.getChildByName("xlcopy").getChildByName("hong") : this.node.getChildByName("xlcopy").getChildByName("lan");
return cc.instantiate(e);
};
e.prototype.writeTanglang = function(t) {
for (var e = this.tanglangContent.getComponent(cc.ScrollView).content, n = e.getChildByName("item").height / 6, i = n / 2, o = 33; o < t.length + 1; o++) (l = e.children[o]) || ((l = cc.instantiate(e.children[e.childrenCount - 1])).parent = e);
for (o = 0; o < t.length; ++o) for (var r = e.children[o], a = 0; a < t[o].length; ++a) if (t[o][a]) {
var l;
(l = this.getTanglangNodeByType(t[o][a])).active = !0;
r.addChild(l, 1, "item");
l.x = 0;
l.y = -n * a - i;
this.createdNodeArr.push(l);
}
this.tanglangContent.getComponent(cc.ScrollView).scrollToRight();
};
e.prototype.getTanglangNodeByType = function(t) {
var e = t === a.trendHelper.HONG ? this.node.getChildByName("jycopy").getChildByName("hong") : this.node.getChildByName("jycopy").getChildByName("lan");
return cc.instantiate(e);
};
e.prototype.writeDayan = function(t) {
for (var e = this.dayanContent.getComponent(cc.ScrollView).content, n = e.getChildByName("item").height / 6, i = n / 2, o = 33; o < t.length + 1; o++) (l = e.children[o]) || ((l = cc.instantiate(e.children[e.childrenCount - 1])).parent = e);
for (o = 0; o < t.length; ++o) for (var r = e.children[o], a = 0; a < t[o].length; ++a) if (t[o][a]) {
var l;
(l = this.getDayanNodeType(t[o][a])).active = !0;
r.addChild(l, 1, "item");
l.x = 0;
l.y = -n * a - i;
this.createdNodeArr.push(l);
}
this.dayanContent.getComponent(cc.ScrollView).scrollToRight();
};
e.prototype.getDayanNodeType = function(t) {
var e = t === a.trendHelper.HONG ? this.node.getChildByName("dycopy").getChildByName("hong") : this.node.getChildByName("dycopy").getChildByName("lan");
return cc.instantiate(e);
};
__decorate([ r(cc.Node) ], e.prototype, "zhupanContent", void 0);
__decorate([ r(cc.Node) ], e.prototype, "daluContent", void 0);
__decorate([ r(cc.Node) ], e.prototype, "dayanContent", void 0);
__decorate([ r(cc.Node) ], e.prototype, "tanglangContent", void 0);
__decorate([ r(cc.Node) ], e.prototype, "xiaoluContent", void 0);
return __decorate([ o ], e);
}(cc.Component);
n.default = l;
cc._RF.pop();
}, {
BJLModel: "BJLModel"
} ],
BJLView: [ function(t, e, n) {
"use strict";
cc._RF.push(e, "f410edALqRLTYd2WHKXD/Wn", "BJLView");
Object.defineProperty(n, "__esModule", {
value: !0
});
var i = t("NodePool"), o = t("BJLModel"), r = cc._decorator, a = r.ccclass, l = r.property, s = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.chipContent = null;
e.btn_Bank = null;
e.btn_go_on = null;
e.jettonPool = null;
e.jettonPos1 = null;
e.poker = null;
e.allImg = null;
e.xianPoker = null;
e.zhuangPoker = null;
e.kanpaiImg = [];
e.resultFont = [];
e.lZTypeImg = [];
e.zsContent = null;
e.createdNodeArr = [];
e.trendList = [];
return e;
}
e.prototype.onLoad = function() {
this.init();
};
e.prototype.init = function() {
cc.find("bottom/player/name", this.node).getComponent(cc.Label).string = wGameData.getKey("nickname");
wUIHelp.setHead(cc.find("bottom/player/head/head", this.node), wGameData.getKey("headimgurl"));
this.setBtn_go_on(!1);
this.initBetNum();
this.initMyBetNum();
this.setTotalBetNum(0);
var t = new cc.Node();
t.addComponent(cc.Sprite).spriteFrame = this.allImg.getSpriteFrame("1.png");
this.jettonPool = new i.default(t);
this.jettonPool.put(t);
this.playBGAnim(wUtils.random(1, 4));
};
e.prototype.playBGAnim = function(t) {
var e = this, n = this.node.getChildByName("bg").getChildByName("spine");
wUIHelp.playSpine(n, "suiji" + t, function() {
e.playBGAnim(wUtils.random(1, 4));
});
};
e.prototype.setBtn_go_on = function(t) {
this.btn_go_on.interactable = t;
};
e.prototype.initBetNum = function() {
for (var t = 1; t < 9; t++) this.setBetNum(t, 0);
};
e.prototype.setBetNum = function(t, e) {
this.node.getChildByName("table").getChildByName("" + t).getChildByName("bet").getComponent(cc.Label).string = e ? wUtils.numConvert(e) : "";
};
e.prototype.initMyBetNum = function() {
for (var t = 1; t < 9; t++) this.setMyBetNum(t, 0);
};
e.prototype.setMyBetNum = function(t, e) {
this.node.getChildByName("table").getChildByName("" + t).getChildByName("mybet").getComponent(cc.Label).string = e ? wUtils.numConvert(e) : "";
};
e.prototype.setTotalBetNum = function(t) {
cc.find("table/layout/totalbet", this.node).getComponent(cc.Label).string = wUtils.numConvert(t);
};
e.prototype.upPlayerCpunt = function(t) {
cc.find("players/label", this.node).getComponent(cc.Label).string = "" + t;
};
e.prototype.setTime = function(t, e) {
var n = cc.find("tableBG/time/anim", this.node), i = cc.find("label", n).getComponent(cc.Label);
i.string = "" + t;
if (1 == e && 5 == t && 0 != t) {
var o = cc.find("tips/spine", this.node).getComponent(sp.Skeleton);
o.node.active = !0;
o.setSkin("2");
wUIHelp.playSpine(o, "animation", function() {
o.node.active = !1;
});
} else if (1 == e && 1 == t) {
wAudioMgr.playSound("sound/STOP_W", "BJL");
this.stop_bet();
}
if (1 == e && t <= 5) {
wAudioMgr.playSound("sound/TIME_WARIMG", "BJL");
n.getComponent(cc.Animation).play();
}
if (2 == e) if (t <= 3) {
this.initPoker();
this.recoveryChip();
this.initMyBetNum();
this.initBetNum();
this.winTable(null);
this.stopWinTable();
cc.find("tableBG/time/type", this.node).getComponent(cc.Label).string = "空闲时间";
} else i.string = "" + (t - 3);
};
e.prototype.setMyGold = function(t) {
cc.find("bottom/player/gold", this.node).getComponent(cc.Label).string = wUtils.goldFormat(t, 1, 1);
};
e.prototype.stop_bet = function() {
var t = cc.find("tips/spine", this.node).getComponent(sp.Skeleton);
t.node.active = !0;
t.setSkin("3");
wUIHelp.playSpine(t, "animation", function() {
t.node.active = !1;
});
};
e.prototype.start_bet = function() {
var t = cc.find("tips/spine", this.node).getComponent(sp.Skeleton);
t.node.active = !0;
t.setSkin("1");
wUIHelp.playSpine(t, "animation", function() {
t.node.active = !1;
});
};
e.prototype.setGameStatus = function(t) {
this.node.getChildByName("tableBG").getChildByName("time").getChildByName("type").getComponent(cc.Label).string = t ? "下注时间" : "开奖时间";
};
e.prototype.selectChip = function(t) {
var e = this.chipContent.getChildByName("" + t), n = this.chipContent.getChildByName("dir");
if (e) {
n.active = !0;
n.x = e.x;
} else n.active = !1;
};
e.prototype.setBtn_Bank = function(t) {
this.btn_Bank.interactable = t;
};
e.prototype.chip_On_Off = function(t) {
for (var e = o.BJLConfig.chip, n = 0; n < e.length; n++) this.chipContent.getChildByName("" + n).getComponent(cc.Button).interactable = t >= e[n];
};
e.prototype.playerBet = function(t, e) {
var n = this.node.getChildByName("table");
this.jettonPos1 || (this.jettonPos1 = n.getChildByName("dir").getPosition());
var i = n.getChildByName("" + e).getChildByName("dir"), o = wUtils.world_local_POS(n, wUtils.local_world__POS(i)), r = i.width / 2, a = i.height / 2;
o.x = wUtils.random(o.x - r, o.x + r);
o.y = wUtils.random(o.y - a, o.y + a);
this.jettonAni(this.jettonPos1, o, t, e, 1);
};
e.prototype.jettonAni = function(t, e, n, i, o) {
var r = this.node.getChildByName("table").getChildByName("chip"), a = this.jettonPool.getNode, l = Math.floor(n / 1e4) + ".png", s = this.allImg.getSpriteFrame(l);
a.getComponent(cc.Sprite).spriteFrame = s;
a.stopAllActions();
a.setPosition(t);
var c = t.sub(e).mag() / 200 * .13;
a.active = !0;
r.addChild(a, o, "" + i);
var h = cc.moveTo(c, e).easing(cc.easeIn(1.5));
a.runAction(h);
};
e.prototype.initChip = function(t, e) {
var n = this, i = this.node.getChildByName("table"), o = i.getChildByName("chip"), r = i.getChildByName("" + e).getChildByName("dir"), a = wUtils.world_local_POS(i, wUtils.local_world__POS(r)), l = r.width / 2, s = r.height / 2;
t.forEach(function(t) {
var i = Math.floor(t / 1e4) + ".png", r = n.allImg.getSpriteFrame(i), c = n.jettonPool.getNode;
c.getComponent(cc.Sprite).spriteFrame = r;
o.addChild(c, 1, "" + e);
c.active = !0;
var h = wUtils.random(a.x - l, a.x + l), d = wUtils.random(a.y - s, a.y + s);
c.setPosition(cc.v2(h, d));
});
};
e.prototype.recoveryChip = function() {
var t = this.node.getChildByName("table").getChildByName("chip");
t.children.length && wLog.w("还有节点没有回收");
this.jettonPool.recoveryAll(t);
};
e.prototype.myBet = function(t, e) {
var n = this.node.getChildByName("table"), i = o.BJLConfig.chip.indexOf(e), r = wUtils.local_world__POS(cc.find("bottom/chip/" + i, this.node));
r = wUtils.world_local_POS(n, r);
var a = n.getChildByName("" + t).getChildByName("dir"), l = wUtils.world_local_POS(n, wUtils.local_world__POS(a)), s = a.width / 2, c = a.height / 2;
l.x = wUtils.random(l.x - s, l.x + s);
l.y = wUtils.random(l.y - c, l.y + c);
this.jettonAni(r, l, e, t, 1);
};
e.prototype.bankerRecoveryChip = function(t) {
for (var e = this, n = null, i = [], o = 0, r = this.node.getChildByName("table").getChildByName("chip").children; o < r.length; o++) {
var a = r[o], l = a.name;
t[l] || (t[5] ? 4 != l && 3 != l && i.push(a) : i.push(a));
}
var s = cc.v2(0, 230);
if (i.length) {
var c = i.length / 45;
c < 1 && (c = 1);
this.schedule(function t() {
for (var o = function() {
var o = i.shift();
if (!o) {
e.unschedule(t);
n();
return {
value: void 0
};
}
o.zIndex = 10;
var r = o.getPosition().sub(s).mag() / 200 * .12, a = cc.moveTo(r, s), l = cc.callFunc(function() {
e.jettonPool.put(o);
});
o.stopAllActions();
o.runAction(cc.sequence(a, l));
}, r = 0; r < c; r++) {
var a = o();
if ("object" == typeof a) return a.value;
}
}.bind(this), .01, 100, 0);
} else this.scheduleOnce(function() {
n();
}, .5);
return new Promise(function(t) {
n = t;
});
};
e.prototype.bankerGiveChip = function(t, e) {
var n = this, i = !0, r = this.node.getChildByName("table"), a = function(a) {
if (!t[a]) return "continue";
var s = e.allBet[a] * o.BJLConfig.bet[a], c = e.scoreSplit(s);
if (c.length <= 0) return "continue";
i = !1;
var h = Math.ceil(c.length / 40), d = r.getChildByName("" + a).getChildByName("dir"), u = wUtils.local_world__POS(d);
u = wUtils.world_local_POS(r, u);
var p = d.width / 2, g = d.height / 2;
l.schedule(function t() {
for (var e = 0; e < h; e++) {
var i = c.shift();
if (!i) {
n.unschedule(t);
return;
}
var o = wUtils.random(u.x - p, u.x + p), r = wUtils.random(u.y - g, u.y + g);
n.jettonAni(cc.v2(0, 230), cc.v2(o, r), i, a, 1);
}
}.bind(l), .01, 50, 0);
}, l = this;
for (var s in t) a(s);
var c = i ? .3 : .8;
return new Promise(function(t) {
n.scheduleOnce(function() {
t(!0);
}, c);
});
};
e.prototype.chipFlyPlayer = function(t, e, n, i) {
for (var r = this, a = this.node.getChildByName("table"), l = {
1: [],
2: [],
3: [],
4: [],
5: [],
6: [],
7: [],
8: []
}, s = this.node.getChildByName("table").getChildByName("chip"), c = 0, h = s.children; c < h.length; c++) {
var d = h[c];
l[d.name].push(d);
}
this.jettonPos1 || (this.jettonPos1 = a.getChildByName("dir").getPosition());
var u = {};
for (var p in e) n[p] ? u[p] = e[p].reduce(function(t, e) {
return t + e;
}, 0) * (o.BJLConfig.bet[p] + 1) : n[5] && t >= 0 && (u[p] = e[p].reduce(function(t, e) {
return t + e;
}, 0));
var g = a.getChildByName("chip"), m = function(t) {
var e = cc.v2(-615, -221), n = i.maxScoreSplit(u[t]), o = l[t].splice(0, n.length);
if (o.length <= 0) return "continue";
var a = o.length / 45;
a < 1 && (a = 1);
f.schedule(function t() {
for (var n = function() {
var n = o.pop();
if (!n) {
r.unschedule(t);
return {
value: void 0
};
}
n.parent = g;
var i = n.getPosition().sub(e).mag() / 320 * .1, a = cc.moveTo(i, e).easing(cc.easeOut(1.5)), l = cc.callFunc(function() {
r.jettonPool.put(n);
});
n.stopAllActions();
n.runAction(cc.sequence(a, l));
}, i = 0; i < a; i++) {
var l = n();
if ("object" == typeof l) return l.value;
}
}.bind(f), .01, 50, 0);
}, f = this;
for (var y in u) m(y);
var v = this.jettonPos1, _ = function(t) {
var e = l[t];
if (e.length <= 0) return "continue";
var n = e.length / 45;
n < 1 && (n = 1);
w.schedule(function t() {
for (var i = function() {
var n = e.pop();
if (!n) {
r.unschedule(t);
return {
value: void 0
};
}
var i = n.getPosition().sub(v).mag() / 320 * .1, o = cc.moveTo(i, v).easing(cc.easeOut(1.5)), a = cc.callFunc(function() {
r.jettonPool.put(n);
});
n.stopAllActions();
n.runAction(cc.sequence(o, a));
}, o = 0; o < n; o++) {
var a = i();
if ("object" == typeof a) return a.value;
}
}.bind(w), .01, 50, 0);
}, w = this;
for (var p in l) _(p);
this.scheduleOnce(function() {
wAudioMgr.playSound("sound/SETTLEMENT", "BJL");
}, .6);
s.childrenCount;
};
e.prototype.initResultPoker = function(t) {
for (var e = t.cards, n = e.banker, i = e.player, o = 0; o < 3; o++) {
if (n[o]) {
var r = this.zhuangPoker.children[o];
this.setNodePoker(r, n[o]);
}
if (i[o]) {
r = this.xianPoker.children[o];
this.setNodePoker(r, i[o]);
}
}
var a = this.node.getChildByName("table");
for (o = 0; o < 2; o++) {
var l = a.getChildByName("win" + o);
l.active = !0;
wUIHelp.hideSonNode(l);
var s = l.getChildByName("ds");
s.active = !0;
var c = 0 == o ? e.player : e.banker;
l.x = 0 == o ? 3 == c.length ? -394 : -421.422 : 3 == c.length ? 425.773 : 398;
var h = this.getCardNum(c);
s.getComponent(cc.Sprite).spriteFrame = this.allImg.getSpriteFrame("hlssm_point_" + h + ".png");
}
};
e.prototype.dealCards = function(t, e) {
return __awaiter(this, void 0, void 0, function() {
var n, i, o, r, a, l = this;
return __generator(this, function(s) {
switch (s.label) {
case 0:
this.initPoker();
n = wUtils.local_world__POS(cc.find("tableBG/fapaipos", this.node));
i = function(t, e) {
return new Promise(function(i) {
t.active = !0;
!t.startPos && (t.startPos = t.getPosition());
t.setPosition(wUtils.world_local_POS(t.parent, n));
t.scale = 0;
var o = cc.scaleTo(.3, 1), r = cc.moveTo(.3, t.startPos), a = cc.spawn(o, r), s = cc.scaleTo(.2, 0, 1), c = cc.callFunc(function() {
l.setNodePoker(t, e);
}), h = cc.scaleTo(.2, 1), d = cc.callFunc(function() {
i(!0);
}), u = cc.sequence(a, s, c, h, d);
t.runAction(u);
});
};
wAudioMgr.playSound("sound/FAIPAI", "BJL");
return [ 4, i(this.xianPoker.children[0], e[0]) ];

case 1:
s.sent();
wAudioMgr.playSound("sound/FAIPAI", "BJL");
return [ 4, i(this.zhuangPoker.children[0], t[0]) ];

case 2:
s.sent();
o = function(t) {
return new Promise(function(e) {
t.active = !0;
!t.startPos && (t.startPos = t.getPosition());
t.setPosition(wUtils.world_local_POS(t.parent, n));
t.scale = 0;
var i = cc.moveTo(.3, t.startPos), o = cc.scaleTo(.3, 1), r = cc.rotateTo(.3, 90), a = cc.spawn(i, o, r), l = cc.callFunc(function() {
e(!0);
}), s = cc.sequence(a, l);
t.runAction(s);
});
};
r = function(t, e) {
return new Promise(function(n) {
t.opacity = 0;
var i = cc.find("table/CP", l.node);
i.active = !0;
i.getChildByName("anim").getComponent(cc.Sprite).spriteFrame = l.kanpaiImg[0];
var o = i.getChildByName("kanpai");
o.setContentSize(0, 0);
l.setNodePoker(o, e);
var r = wUtils.world_local_POS(l.node, wUtils.local_world__POS(t));
i.x = r.x + 5;
var a = i.getComponent(cc.Animation);
a.on("stop", function() {
i.active = !1;
a.off("stop");
n();
}, l);
a.play("CPAnim");
l.scheduleOnce(function() {
l.setNodePoker(t, e);
t.scale = 2;
t.opacity = 255;
t.angle = -70;
var n = cc.scaleTo(.15, 1), i = cc.rotateTo(.15, 0), o = cc.spawn(n, i);
t.runAction(o);
}, 1);
});
};
a = 1;
s.label = 3;

case 3:
if (!(a < 3)) return [ 3, 12 ];
if (!e[a]) return [ 3, 5 ];
wAudioMgr.playSound("sound/FAIPAI", "BJL");
return [ 4, o(this.xianPoker.children[a]) ];

case 4:
s.sent();
s.label = 5;

case 5:
if (!t[a]) return [ 3, 7 ];
wAudioMgr.playSound("sound/FAIPAI", "BJL");
return [ 4, o(this.zhuangPoker.children[a]) ];

case 6:
s.sent();
s.label = 7;

case 7:
return e[a] ? [ 4, r(this.xianPoker.children[a], e[a]) ] : [ 3, 9 ];

case 8:
s.sent();
s.label = 9;

case 9:
return t[a] ? [ 4, r(this.zhuangPoker.children[a], t[a]) ] : [ 3, 11 ];

case 10:
s.sent();
s.label = 11;

case 11:
a++;
return [ 3, 3 ];

case 12:
return [ 2, Promise.resolve() ];
}
});
});
};
e.prototype.setNodePoker = function(t, e) {
"kanpai" != t.name && (t.getComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame("plist_puke_front_big"));
var n = Math.floor(e / 100), i = e % 100 - 1, o = t.getChildByName("p0");
o.active = !0;
var r = "plist_puke_value_" + i % 2 + "_" + n;
o.getComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame(r);
(o = t.getChildByName("h0")).active = !0;
r = "plist_puke_color_small_" + i;
o.getComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame(r);
if (o = t.getChildByName("dh")) {
o.active = !0;
r = "plist_puke_color_big_" + i;
o.getComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame(r);
}
};
e.prototype.initPoker = function() {
var t = this, e = function(e) {
for (var n = 0, i = e.children; n < i.length; n++) {
var o = i[n];
o.active = !1;
o.getComponent(cc.Sprite).spriteFrame = t.poker.getSpriteFrame("plist_puke_back_big_2");
wUIHelp.hideSonNode(o);
}
};
e(this.zhuangPoker);
e(this.xianPoker);
for (var n = this.node.getChildByName("table"), i = 0; i < 2; i++) n.getChildByName("win" + i).active = !1;
};
e.prototype.showCardType = function(t, e) {
for (var n = this, i = this.node.getChildByName("table"), o = [], r = function(r) {
var l = i.getChildByName("win" + r);
l.active = !0;
wUIHelp.hideSonNode(l);
var s = l.getChildByName("ds");
s.active = !0;
var c = 0 == r ? e.player : e.banker;
l.x = 0 == r ? 3 == c.length ? -394 : -421.422 : 3 == c.length ? 425.773 : 398;
var h = a.getCardNum(c);
o.push(h);
s.getComponent(cc.Sprite).spriteFrame = a.allImg.getSpriteFrame("hlssm_point_" + h + ".png");
var d = null;
(t[4] && 0 == r || t[3] && 1 == r) && (d = l.getChildByName("anim"));
d && a.scheduleOnce(function() {
d.active = !0;
d.getComponent("Animation").play(function() {
n.scheduleOnce(function() {
d.active = !1;
}, 1.5);
});
}, .8);
}, a = this, l = 0; l < 2; l++) r(l);
return o;
};
e.prototype.getCardNum = function(t) {
for (var e = 0, n = 0, i = t; n < i.length; n++) {
var o = i[n], r = Math.floor(o / 100);
e += r >= 10 ? 0 : r;
}
return e % 10;
};
e.prototype.winTable = function(t) {
for (var e = this.node.getChildByName("table"), n = 1; n < 9; n++) {
var i = e.getChildByName("" + n).getChildByName("ani");
i.active = t && t[n];
i.active && i.getComponent("Animation").play();
}
};
e.prototype.stopWinTable = function() {
for (var t = this.node.getChildByName("table"), e = 1; e < 9; e++) t.getChildByName("" + e).getChildByName("ani").getComponent("Animation").stop();
};
e.prototype.showResult = function(t, e) {
var n = this.node.getChildByName("result");
n.active = !0;
var i = n.getChildByName("main");
wUIHelp.easeBackOut(i);
t.win >= 0 ? wAudioMgr.playSound("sound/GAME_WIN", "BJL") : wAudioMgr.playSound("sound/GAME_LOSE", "BJL");
i.getChildByName("winbg").active = t.win >= 0;
i.getChildByName("losebg").active = t.win < 0;
cc.find("my/name", i).getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10);
cc.find("my/win", i).active = t.win >= 0;
var o = cc.find("my/win", i).getComponent(cc.Label);
o.string = (t.win >= 0 ? "+" : "") + t.win;
o.font = this.resultFont[t.win >= 0 ? 0 : 1];
o.node.active = e.getLastbet(e.bet) > 0;
cc.find("my/wxz", i).active = e.getLastbet(e.bet) <= 0;
(o = cc.find("zj/win", i).getComponent(cc.Label)).string = (t.bankerwin >= 0 ? "+" : "") + t.bankerwin;
o.font = this.resultFont[t.bankerwin >= 0 ? 0 : 1];
var r = i.getChildByName("list");
wUIHelp.hideSonNode(r);
var a = [];
for (var l in t.bigwiner) if (Object.prototype.hasOwnProperty.call(t.bigwiner, l)) {
t.bigwiner[l].uid = l;
a.push(t.bigwiner[l]);
}
a.sort(function(t, e) {
return e.win - t.win;
});
for (var s = 0; s < a.length; s++) {
var c = r.children[s], h = a[s];
c.active = !0;
c.getChildByName("name").getComponent(cc.Label).string = h.uid != wGameData.getKey("uid") ? h.username : h.nickname;
c.getChildByName("New Label").getComponent(cc.Label).string = "+" + h.win;
}
for (var d = 0, u = [ "player", "banker" ]; d < u.length; d++) {
var p = u[d], g = i.getChildByName(p), m = g.getChildByName("poker");
wUIHelp.hideSonNode(m);
var f = t.cards[p];
for (s = 0; s < f.length; s++) {
this.setNodePoker(m.children[s], f[s]);
m.children[s].active = !0;
}
var y = this.getCardNum(t.cards[p]);
g.getChildByName("type").getComponent(cc.Sprite).spriteFrame = this.allImg.getSpriteFrame("hlssm_txt_js_" + y + ".png");
g.getChildByName("lose").active = "player" == p ? t.result[3] : t.result[4];
m.getComponent(cc.Layout).updateLayout();
g.getChildByName("lose").width = .39 * m.width;
}
t.win < 0 || e.getLastbet(e.bet);
};
e.prototype.closeResult = function() {
var t = this.node.getChildByName("result");
if (t.active && !t.isAnim) {
t.isAnim = !0;
var e = t.getChildByName("main");
wUIHelp.easeIn(e, function() {
t.active = !1;
t.isAnim = !1;
});
}
};
e.prototype.initPlayerList = function(t) {
for (var e = this.node.getChildByName("playerList"), n = 0; n < t.length; n++) {
var i = e.children[n];
if (i) {
i.getChildByName("name").getComponent(cc.Label).string = t[n].username;
wUIHelp.setHead(cc.find("head/head", i), t[n].headimgurl);
}
}
};
e.prototype.addTrend = function(t, e, n) {
void 0 === n && (n = !1);
var i = this.zsContent, o = i.children[t];
o || ((o = cc.instantiate(i.children[1])).parent = i);
var r = o.getChildByName("type");
r.active = !0;
r.y = 31;
var a = 0;
if (e[5]) {
a = 1;
r.y = 0;
} else if (e[3]) {
a = 2;
r.y = -31;
}
r.getComponent(cc.Sprite).spriteFrame = this.lZTypeImg[a];
n && i.parent.parent.getComponent(cc.ScrollView).scrollToRight();
};
e.prototype.initTrend = function(t) {
for (var e = 0; e < t.length; e++) this.addTrend(e, t[e]);
};
__decorate([ l(cc.Node) ], e.prototype, "chipContent", void 0);
__decorate([ l(cc.Button) ], e.prototype, "btn_Bank", void 0);
__decorate([ l(cc.Button) ], e.prototype, "btn_go_on", void 0);
__decorate([ l(cc.SpriteAtlas) ], e.prototype, "poker", void 0);
__decorate([ l(cc.SpriteAtlas) ], e.prototype, "allImg", void 0);
__decorate([ l(cc.Node) ], e.prototype, "xianPoker", void 0);
__decorate([ l(cc.Node) ], e.prototype, "zhuangPoker", void 0);
__decorate([ l([ cc.SpriteFrame ]) ], e.prototype, "kanpaiImg", void 0);
__decorate([ l([ cc.Font ]) ], e.prototype, "resultFont", void 0);
__decorate([ l(cc.SpriteFrame) ], e.prototype, "lZTypeImg", void 0);
__decorate([ l(cc.Node) ], e.prototype, "zsContent", void 0);
return __decorate([ a ], e);
}(cc.Component);
n.default = s;
cc._RF.pop();
}, {
BJLModel: "BJLModel",
NodePool: void 0
} ]
}, {}, [ "BJLChart", "BJLControlle", "BJLLoad", "BJLModel", "BJLPlayerList", "BJLTrendIem", "BJLView" ]);