window.__require = function e(t, i, o) {
function n(r, s) {
if (!i[r]) {
if (!t[r]) {
var l = r.split("/");
l = l[l.length - 1];
if (!t[l]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = l;
}
var d = i[r] = {
exports: {}
};
t[r][0].call(d.exports, function(e) {
return n(t[r][1][e] || e);
}, d, d.exports, e, t, i, o);
}
return i[r].exports;
}
for (var a = "function" == typeof __require && __require, r = 0; r < o.length; r++) n(o[r]);
return n;
}({
BRNNControlle: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "ab251z71BtLqK1zqs2QLrsE", "BRNNControlle");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("MultiBase"), n = e("BRNNModel"), a = e("BRNNView"), r = cc._decorator, s = r.ccclass;
r.property;
var l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.View = null;
t.Model = null;
return t;
}
t.prototype.update = function(e) {
if (this.Model.time) {
this.Model.newTime += e;
this.Model.newTime > 1 && this.Model.time--;
}
};
t.prototype.initProxy = function() {
var e = this;
this.View = this.node.getComponent(a.default);
this.Model = wUtils.creatorProxy(new n.BRNNModel());
this.Model.onEvevt("gameState", function(t) {
e.View.setGameStatus(1 == t);
e.View.setBtn_Bank(1 == t);
if (1 != t) {
e.View.chip_On_Off(0);
e.View.setBtn_go_on(!1);
} else e.Model.gold = e.Model.gold;
e.m_setBankBtn(1 == t);
e.Model.selectChip = -1;
});
this.Model.onEvevt("time", function(t) {
t = !t || t <= 0 ? 0 : t;
e.View.setTime(t || 0, e.Model.gameState, e.Model.banker.num);
e.Model.newTime = 0;
});
this.Model.onEvevt("gold", function(t) {
e.View.setMyGold(t);
wGameData.getKey("uid") != e.Model.banker.uid && 1 == e.Model.gameState && e.View.chip_On_Off(t);
var i = e.Model.getLastbet(e.Model.lastbet);
1 == e.Model.gameState && i && e.Model.gold >= i && wGameData.getKey("uid") != e.Model.banker.uid ? e.View.setBtn_go_on(!0) : e.View.setBtn_go_on(!1);
if (t < n.BRNNConfig.chip[e.Model.selectChip]) for (;n.BRNNConfig.chip[--e.Model.selectChip] && !(t >= n.BRNNConfig.chip[e.Model.selectChip]); ) ;
});
this.Model.onEvevt("banker", function(t) {
var i = t.uid == wGameData.getKey("uid");
e.View.setDealerInfo(e.Model.banker);
if (i) {
e.View.chip_On_Off(0);
e.View.setBtn_go_on(!1);
e.View.setBtn_SZhuang(!1);
e.View.setBtn_XZhuang(!0);
} else {
i = e.Model.applyNum.includes(wGameData.getKey("uid"));
e.View.setBtn_SZhuang(!i);
e.View.setBtn_XZhuang(i);
}
});
this.Model.onEvevt("selectChip", function(t) {
e.View.selectChip(t);
});
this.Model.onEvevt("playerNum", function(t) {
e.View.upPlayerCpunt(t);
});
};
t.prototype.start = function() {
var e = this;
this.initProxy();
this.initNetWorkEvevt();
this.scheduleOnce(function() {
e.m_init();
}, .2);
};
t.prototype.m_roomInfo = function(e) {
this.Model.initRoom(JSON.parse(JSON.stringify(e)));
this.View.initPlayer(e.moreScore);
var t = {};
for (var i in e.mybat) {
this.View.setMyBetNum(i, e.mybat[i]);
!t[i] && (t[i] = []);
t[i].push(e.mybat[i]);
}
if (1 != this.Model.gameState) ; else {
this.View.initPoker();
this.Model.bet = t;
}
this.View.upTrend(this.Model.history);
this.Model.gold = this.Model.gold;
this.View.setBtn_Bank(!0);
this.Model.getLastbet(t) && (this.Model.lastbet = t);
if (!(2 == this.Model.gameState && this.Model.time <= 3)) {
var o = this.Model.allBet;
for (var i in o) {
var n = this.Model.maxScoreSplit(o[i]);
this.View.initChip(n, i);
this.View.setBetNum(i, o[i]);
this.Model.totalBet += o[i];
}
this.View.setTotalBetNum(this.Model.totalBet, this.Model.banker.gold / 10 - this.Model.totalBet);
}
};
t.prototype.Msg_BRNN_Bet = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i;
return __generator(this, function() {
this.View.initPlayer(e.moreScore);
this.View.start_bet();
this.Model.gold = this.Model.gold;
this.ininStart();
this.View.recoveryChip();
(t = this.node.getChildByName("result")) && wUIHelp.easeIn(t.getChildByName("main"), function() {
t.active = !1;
});
this.Model.applyNum = e.applyBanker;
i = e.banker;
this.Model.banker = i;
this.Model.gameState = 1;
this.Model.time = e.time;
return [ 2 ];
});
});
};
t.prototype.Msg_BRNN_Res = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o, n, a, r;
return __generator(this, function(s) {
switch (s.label) {
case 0:
this.launchAllChip();
this.Model.gameState = 2;
this.Model.time = e.time;
this.View.stop_bet();
return [ 4, wUtils.syncDelayed(.5, this) ];

case 1:
s.sent();
return [ 4, this.View.dealCards() ];

case 2:
s.sent();
this.View.openCard(e.banker, e.hall);
return [ 4, wUtils.syncDelayed(.3, this) ];

case 3:
s.sent();
return [ 4, this.View.CPAnim() ];

case 4:
s.sent();
this.View.showWin(e.hall);
return [ 4, wUtils.syncDelayed(.5, this) ];

case 5:
s.sent();
t = !0;
i = !0;
for (a in e.hall) {
e.hall[a].score > 0 && (t = !1);
e.hall[a].score < 0 && (i = !1);
}
return [ 4, this.View.bankerRecoveryChip(e.hall) ];

case 6:
s.sent();
return [ 4, wUtils.syncDelayed(.5, this) ];

case 7:
s.sent();
t && wUIManager.showTips("庄家通杀", wUIManager.TIPS_WHITE);
return [ 4, this.View.bankerGiveChip(e.hall, this.Model) ];

case 8:
s.sent();
i && wUIManager.showTips("庄家通赔", wUIManager.TIPS_WHITE);
for (o in this.Model.history) {
r = this.Model.history[o];
n = e.hall[o].win;
r.info.push(n);
r.win += n ? 1 : 0;
r.tran += n ? 0 : 1;
}
this.View.upTrend(this.Model.history);
this.View.chipFlyPlayer(e.player[wGameData.getKey("uid")], this.Model.bet, e.hall, this.Model);
for (a in e.player) {
r = e.player[a];
this.upPlayerGold(a, r.gold);
if (a == this.Model.banker.uid) {
this.Model.banker.gold = r.gold;
this.View.setDealerInfo(this.Model.banker);
}
}
this.Model.getLastbet(this.Model.bet) && (this.Model.lastbet = this.Model.bet);
this.Model.bet = {};
return [ 4, wUtils.syncDelayed(1.6, this) ];

case 9:
s.sent();
cc.isValid(this, !0) && wViewMgr.openPage({
path: "prefab/BRNNResult",
bundle: "BRNN",
data: {
msg: e,
model: this.Model
}
});
return [ 2 ];
}
});
});
};
t.prototype.ininStart = function() {
this.Model.initDesktop();
this.View.initPoker();
this.View.initMyBetNum();
this.View.initBetNum();
this.View.setTotalBetNum(0);
};
t.prototype.Msg_BRNN_Act_Bet = function(e) {
var t = wGameData.getKey("uid");
!this.Model.bet[e.code] && (this.Model.bet[e.code] = []);
this.Model.bet[e.code].push(e.bat);
this.upPlayerGold(t, this.Model.gold - e.bat);
for (var i = 0, o = 0, a = this.Model.bet[e.code]; o < a.length; o++) i += a[o];
this.View.setMyBetNum(e.code, i);
this.Model.totalBet += e.bat;
this.View.setTotalBetNum(this.Model.totalBet, this.Model.banker.gold / 10 - this.Model.totalBet);
this.Model.allBet[e.code] += e.bat;
this.View.setBetNum(e.code, this.Model.allBet[e.code]);
var r = [ e.bat ];
-1 == n.BRNNConfig.chip.indexOf(e.bat) && (r = this.Model.maxScoreSplit(e.bat));
for (var s = 0; s < r.length; s++) this.View.myBet(e.code, r[s]);
wAudioMgr.playSound("sound/ADD_GOLD", this.m_game);
};
t.prototype.Msg_BRNN_Table = function(e) {
var t = e;
for (var i in t) {
var o = t[i];
if (i != wGameData.getKey("uid")) for (var n in o) {
var a = o[n];
if (a) for (var r = 0, s = this.Model.scoreSplit(a); r < s.length; r++) {
var l = s[r];
this.Model.jettonList.push([ l, n, i ]);
}
}
}
this.initFhip();
};
t.prototype.initFhip = function() {
var e = this;
if (!(this.Model.jettonList.length <= 0)) {
this.Model.jettonList.sort(function() {
return Math.random() > .5 ? -1 : 1;
});
var t = this.Model.time > 2 ? 2 : .5;
this.unscheduleAllCallbacks();
this.schedule(function() {
e.launchFhip();
}, t / this.Model.jettonList.length);
this.schedule(function() {
e.Model.jettonSound = !0;
}, .2);
}
};
t.prototype.launchFhip = function(e) {
void 0 === e && (e = !0);
var t = this.Model.jettonList.shift();
if (t) {
if (e) {
this.View.playerBet(t[0], t[1]);
if (this.Model.jettonSound) {
this.Model.jettonSound = !1;
wAudioMgr.playSound("sound/ADD_GOLD", this.m_game);
}
}
if (t[2] != wGameData.getKey("uid")) {
this.Model.totalBet += t[0];
this.View.setTotalBetNum(this.Model.totalBet, this.Model.banker.gold / 10 - this.Model.totalBet);
this.Model.allBet[t[1]] += t[0];
this.View.setBetNum(t[1], this.Model.allBet[t[1]]);
}
} else this.unscheduleAllCallbacks();
};
t.prototype.upPlayerGold = function(e, t) {
if (e == wGameData.getKey("uid")) {
wGameData.setKey("gold", t);
this.Model.gold = t;
}
};
t.prototype.launchAllChip = function() {
var e = this;
this.unscheduleAllCallbacks();
if (this.Model.jettonList.length) {
for (var t = {}, i = 0, o = this.Model.jettonList; i < o.length; i++) {
var n = o[i], a = n[2];
!t[a] && (t[a] = {});
var r = n[1];
!t[a][r] && (t[a][r] = 0);
t[a][r] += n[0];
}
this.Model.jettonList = [];
var s = function(i) {
var o = function(o) {
var n = t[i][o];
l.Model.maxScoreSplit(n).forEach(function(t) {
e.Model.jettonList.push([ t, o, i ]);
});
};
for (var n in t[i]) o(n);
}, l = this;
for (var a in t) s(a);
wAudioMgr.playSound("sound/ADD_GOLD", this.m_game);
for (;this.Model.jettonList.length; ) this.launchFhip(!1);
}
};
t.prototype.Msg_BRNN_QiangBanker = function(e) {
for (var t = 0, i = e.list; t < i.length; t++) {
var o = i[t];
this.Msg_BRNN_Act_Banker({
uid: o
});
}
};
t.prototype.Msg_BRNN_Act_Banker = function(e) {
var t = e.uid;
if (this.Model.applyNum.includes(Number(e.uid))) wUIManager.showTips("您已经在申请列表中", wUIManager.TIPS_WHITE); else {
this.Model.applyNum.push(t);
if (e.uid == wGameData.getKey("uid")) {
wUIManager.showTips("上庄申请已提交", wUIManager.TIPS_WHITE);
this.Model.isbanker = !1;
this.View.setBtn_XZhuang(!0);
this.View.setBtn_SZhuang(!1);
}
}
};
t.prototype.Msg_BRNN_Act_BankerOut = function(e) {
e.uid;
if (this.Model.applyNum.includes(Number(e.uid))) {
var t = this.Model.applyNum.indexOf(Number(e.uid));
-1 != t && this.Model.applyNum.splice(t, 1);
if (e.uid == wGameData.getKey("uid")) {
wUIManager.showTips("下庄申请已提交", wUIManager.TIPS_WHITE);
this.Model.isbanker = !0;
this.View.setBtn_XZhuang(!1);
this.View.setBtn_SZhuang(this.Model.banker.uid != wGameData.getKey("uid"));
}
} else wLog.e("玩家不在上庄列表中");
};
t.prototype.Msg_BRNN_Add = function() {
this.Model.playerNum++;
};
t.prototype.Msg_BRNN_Out = function(e) {
if (e.uid != wGameData.getKey("uid")) {
this.Model.playerNum--;
var t = this.Model.applyNum.indexOf(Number(e.uid));
-1 != t && this.Model.applyNum.splice(t, 1);
}
};
t.prototype.onClick = function(e, t) {
switch (t) {
case "hall":
if (this.Model.getLastbet(this.Model.bet) || this.Model.banker.uid == wGameData.getKey("uid")) {
wUIManager.showTips("游戏进行中,请等待游戏结束", wUIManager.TIPS_OK);
break;
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
case "5":
wAudioMgr.playSound("sound/SELECTED", "BRNN");
this.Model.selectChip = t;
return;

case "bet1":
case "bet2":
case "bet3":
case "bet4":
this.playerBet(t[3]);
break;

case "qz":
if (wGameData.getKey("gold") < 6e8) {
wUIManager.showConfirmUI({
content: "您的欢乐豆不足，无法抢庄\n抢庄条件：6亿欢乐豆",
title: "系统提示"
});
break;
}
wNetWork.send("Msg_BRNN_QiangBanker", []);
break;

case "sz":
if (wGameData.getKey("gold") < 3e8) {
wUIManager.showConfirmUI({
content: "您的欢乐豆不足，无法上庄\n上庄条件：3亿欢乐豆",
title: "系统提示"
});
break;
}
wNetWork.send("Msg_BRNN_Act_Banker", []);
this.View.setBtn_SZhuang(!1);
break;

case "xz":
wNetWork.send("Msg_BRNN_Act_BankerOut", []);
this.View.setBtn_XZhuang(!1);
break;

case "playerlist":
wViewMgr.openPage({
path: "prefab/BRNNPlayerList",
bundle: "BRNN"
});
}
wAudioMgr.playBtnSound();
};
t.prototype.playerBet = function(e) {
1 == this.Model.gameState ? -1 != this.Model.selectChip ? this.Model.banker.uid != wGameData.getKey("uid") ? wNetWork.send("Msg_BRNN_Act_Bet", {
bat: n.BRNNConfig.chip[this.Model.selectChip],
code: Number(e)
}) : wUIManager.showTips("庄家不能下注！", wUIManager.TIPS_WHITE) : wUIManager.showTips("请选择下注筹码！", wUIManager.TIPS_WHITE) : wUIManager.showTips("请稍后，还没到下注时间哟！", wUIManager.TIPS_WHITE);
};
t.prototype.lastBet = function() {
var e = this.Model.lastbet, t = !1;
for (var i in e) if (Object.prototype.hasOwnProperty.call(e, i)) {
for (var o = 0, n = 0, a = e[i]; n < a.length; n++) {
var r = a[n];
o += Number(r);
}
if (o) {
wNetWork.send("Msg_BRNN_Act_Bet", {
bat: o,
code: Number(i)
});
t = !0;
}
}
if (t) {
this.View.setBtn_go_on(!1);
this.Model.lastbet = {};
}
};
t.prototype.m_upGameGold = function() {
this.Model.gold = wGameData.getKey("gold");
};
t.prototype.m_NetWorkState = function() {};
t.prototype.initNetWorkEvevt = function() {
var e = this;
wGEvent.on("Msg_BRNN_Out", function(t) {
1 == t.status ? e.Msg_BRNN_Out(t.data) : wLog.e("玩家退出失败");
}, this);
wGEvent.on("Msg_BRNN_Bet", function(t) {
1 == t.status ? e.Msg_BRNN_Bet(t.data).catch(function(e) {
wLog.e(e);
}) : wLog.e("玩家押注失败");
}, this);
wGEvent.on("Msg_BRNN_Res", function(t) {
1 == t.status ? e.Msg_BRNN_Res(t.data) : wLog.e("玩家开奖失败");
}, this);
wGEvent.on("Msg_BRNN_Act_Bet", function(t) {
1 == t.status ? e.Msg_BRNN_Act_Bet(t.data) : wLog.e("玩家下注失败");
}, this);
wGEvent.on("Msg_BRNN_Table", function(t) {
1 == t.status ? e.Msg_BRNN_Table(t.data) : wLog.e("桌面情况失败");
}, this);
wGEvent.on("Msg_BRNN_Act_Banker", function(t) {
if (1 == t.status) e.Msg_BRNN_Act_Banker(t.data); else {
wLog.e("申请庄家失败");
e.View.setBtn_SZhuang(!0);
}
}, this);
wGEvent.on("Msg_BRNN_Add", function(t) {
1 == t.status ? e.Msg_BRNN_Add(t.data) : wLog.e("玩家退出失败");
}, this);
wGEvent.on("Msg_BRNN_Act_BankerOut", function(t) {
if (1 == t.status) e.Msg_BRNN_Act_BankerOut(t.data); else {
wLog.e("申请下家失败");
e.View.setBtn_XZhuang(!0);
}
}, this);
wGEvent.on("Msg_BRNN_Head", function(t) {
1 == t.status ? e.View.initPlayer(t.data.moreScore) : wLog.e("更新6个头像失败");
}, this);
wGEvent.on("Msg_BRNN_QiangBanker", function(t) {
1 == t.status ? e.Msg_BRNN_QiangBanker(t.data) : wLog.e("抢庄成功");
}, this);
};
return __decorate([ s ], t);
}(o.default);
i.default = l;
cc._RF.pop();
}, {
BRNNModel: "BRNNModel",
BRNNView: "BRNNView",
MultiBase: void 0
} ],
BRNNLoad: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "36ab3tGFRhJo5PuqzmFxTof", "BRNNLoad");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("Config"), n = cc._decorator, a = n.ccclass;
n.property;
var r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.isEnterRoom = !1;
return t;
}
t.prototype.onLoad = function() {
var e = this, t = o.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir(t.prefabUrl, t.enName);
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
e.initShow();
}, this);
};
t.prototype.onEnable = function() {
var e = this;
this.scheduleOnce(function() {
e.enterRoom(5);
}, .6);
for (var t = function(e) {
wUIHelp.playSpine(e, "start", function() {
wUIHelp.playSpine(e, "idle", null, !0);
});
}, i = 0, o = this.node.getChildByName("main").children; i < o.length; i++) t(o[i]);
};
t.prototype.initShow = function() {
var e = this;
this.isEnterRoom = !1;
var t = cc.fadeOut(.2), i = cc.callFunc(function() {
e.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
e.node.parent.destroyAllChildren();
}
}), o = cc.sequence(t, i);
this.node.runAction(o);
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
wViewMgr.enterHall();
}
};
t.prototype.enterRoom = function(e) {
var t = this;
if (!this.isEnterRoom) {
wGameData.roomLevel = e;
if (wGameData.gameRepair()) {
wUIManager.showTips("游戏维护中");
wViewMgr.enterHall();
} else {
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
}
}
};
t.prototype.loadGame = function() {
var e = o.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(e.prefabUrl, function() {}, function(e, t) {
e ? wLog.e(e) : wViewMgr.openGame(t);
}, e.enName);
};
return __decorate([ a ], t);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {
Config: void 0
} ],
BRNNModel: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "64d801uvx1MGJVNOQNGZ8BM", "BRNNModel");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.BRNNModel = i.BRNNConfig = void 0;
i.BRNNConfig = {
chip: [ 1e3, 1e4, 1e5, 1e6, 5e6, 1e7 ]
};
var o = function() {
function e() {
this.gameState = 1;
this.time = 0;
this.newTime = 0;
this.jettonSound = !0;
this.jettonList = [];
this.totalBet = 0;
this.bet = {};
this.lastbet = {};
this.selectChip = -1;
this.allBet = {
1: 0,
2: 0,
3: 0,
4: 0
};
this.isbanker = !1;
}
e.prototype.initRoom = function(e) {
this.isbanker = e.banker.isbanker;
for (var t in e.hall) this.allBet[t] = e.hall[t].score;
this.applyNum = e.applyBanker;
this.banker = e.banker || {};
this.playerNum = e.playerCount;
this.history = e.history;
this.gold = wGameData.getKey("gold");
this.circle = e.circle;
this.gameState = e.gameState;
this.time = e.time;
};
e.prototype.getLastbet = function(e) {
var t = 0;
for (var i in e) for (var o = 0, n = e[i]; o < n.length; o++) t += n[o];
return t;
};
e.prototype.initDesktop = function() {
this.allBet = {
1: 0,
2: 0,
3: 0,
4: 0
};
this.jettonList = [];
this.totalBet = 0;
};
e.prototype.scoreSplit = function(e) {
for (var t = []; ;) {
for (var o = 0, n = 5; n > -1; n--) if (e > i.BRNNConfig.chip[n]) {
o = n;
break;
}
if (o < 1) {
for (;e > 0; ) {
t.push(1e3);
e -= 1e3;
}
break;
}
var a = o - 1 > -1 ? o - 1 : 0, r = i.BRNNConfig.chip[wUtils.random(a, o)];
t.push(r);
e -= r;
}
return t;
};
e.prototype.maxScoreSplit = function(e) {
for (var t = [], o = 5; o > -1; o--) for (var n = i.BRNNConfig.chip[o]; e >= n; ) {
t.push(n);
e -= n;
}
return t;
};
return e;
}();
i.BRNNModel = o;
cc._RF.pop();
}, {} ],
BRNNPlayerList: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "61c913se4VJzp30KdqPmTGM", "BRNNPlayerList");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("PopupBase"), n = cc._decorator, a = n.ccclass, r = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
return t;
}
t.prototype.onLoad = function() {
var e = this;
wUtils.sendMsg("Msg_BRNN_GetUserList", {}, this).then(function(t) {
t = t.players || [];
var i = [];
for (var o in t) if (Object.prototype.hasOwnProperty.call(t, o)) {
t[o].uid = o;
i.push(t[o]);
}
e.initList(i);
});
};
t.prototype.initList = function(e) {
cc.find("label", this.main).getComponent(cc.Label).string = e.length + "在线";
e.sort(function(e, t) {
return t.gold - e.gold;
});
for (var t = this.main.getChildByName("item"), i = 0; i < e.length; i++) {
var o = cc.instantiate(t);
o.parent = this.content;
o.active = !0;
var n = e[i], a = n.uid == wGameData.getKey("uid") ? n.nickname : n.username;
o.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(a, 8);
wUIHelp.setHead(cc.find("head/head", o), n.headimgurl);
o.getChildByName("gold").getComponent(cc.Label).string = wUtils.goldFormat(n.gold, 1, 1);
}
};
__decorate([ r(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ a ], t);
}(o.default);
i.default = s;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
BRNNResult: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "9e41ev80W1DUqOBsyN4wQz3", "BRNNResult");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("PopupBase"), n = cc._decorator, a = n.ccclass, r = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.resultImg = null;
t.poker = null;
return t;
}
t.prototype.init = function(e) {
var t = e.msg, i = e.model, o = this.main;
i.banker.uid == wGameData.getKey("uid") ? o.getChildByName("bname").getComponent(cc.Label).string = wUtils.handleNameLen(i.banker.nickname, 8) : o.getChildByName("bname").getComponent(cc.Label).string = i.banker.username;
o.getChildByName("mname").getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 8);
var n = t.player[wGameData.getKey("uid")];
n && (n = n.score);
!n && (n = 0);
o.getChildByName("fail").active = n < 0;
o.getChildByName("win").active = n >= 0;
var a = o.getChildByName("type");
for (var r in a.children) {
var s = a.children[r];
if ("5" != r) {
if ("0" == r) {
var l = this.resultImg.getSpriteFrame(t.banker.type + ".png");
s.getChildByName("type").getComponent(cc.Sprite).spriteFrame = l;
var c = t.player[i.banker.uid].score;
s.getChildByName("yin").active = !1;
s.getChildByName("shu").active = !1;
var d = s.getChildByName(c >= 0 ? "yin" : "shu");
d.active = !0;
d.getComponent(cc.Label).string = (c >= 0 ? "+" : "-") + wUtils.numConvert(Math.abs(c));
} else {
l = this.resultImg.getSpriteFrame(t.hall[r].type + ".png");
s.getChildByName("type").getComponent(cc.Sprite).spriteFrame = l;
c = t.hall[r].score;
s.getChildByName("label").getComponent(cc.Label).string = (c >= 0 ? "+" : "-") + wUtils.numConvert(Math.abs(c));
}
for (var h = s.getChildByName("poker"), p = "0" == r ? t.banker.hands : t.hall[r].hands, u = "0" == r ? t.banker.type : t.hall[r].type, g = 0, m = h.children; g < m.length; g++) {
var f = m[g];
wUIHelp.hideSonNode(f);
this.setPokerRes(f, p[f.name]);
f.y = -44;
u > 1 && u < 12 && ("3" == f.name || "4" == f.name) && (f.y = -34);
}
} else {
wUIHelp.hideSonNode(s);
if (0 == n) {
wAudioMgr.playSound("sound/WIN", "BRNN");
s.children[0].active = !0;
} else if (n > 0) {
wAudioMgr.playSound("sound/WIN", "BRNN");
s.children[2].active = !0;
s.children[2].getComponent(cc.Label).string = "+" + wUtils.numConvert(n);
} else {
wAudioMgr.playSound("sound/LOSE", "BRNN");
s.children[1].active = !0;
s.children[1].getComponent(cc.Label).string = "-" + wUtils.numConvert(Math.abs(n));
}
}
}
var y = o.getChildByName("rank");
wUIHelp.hideSonNode(y);
var v = [];
for (var r in t.player) if (r != i.banker.uid) {
var N = t.player[r];
N.uid = Number(r);
v.push(N);
}
v.sort(function(e, t) {
return t.score - e.score;
});
if (v[0].score <= 0) {
y.active = !1;
o.getChildByName("ts").active = !0;
} else {
y.active = !0;
o.getChildByName("ts").active = !1;
for (var _ = 0; _ < 5; _++) {
s = y.children[_];
if (v[_] && v[_].score > 0) {
s.active = !0;
v[_].uid != wGameData.getKey("uid") ? s.getChildByName("name").getComponent(cc.Label).string = v[_].username : s.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 8);
c = v[_].score;
s.getChildByName("gold").getComponent(cc.Label).string = "+" + wUtils.numConvert(Math.abs(c));
}
}
}
};
t.prototype.start = function() {
var e = this;
this.scheduleOnce(function() {
e.hide(!1);
}, 4.5);
};
t.prototype.onHide = function() {
this.node.destroy();
};
t.prototype.setPokerRes = function(e, t) {
var i = Math.floor(t / 100), o = t % 100 - 1;
if (i < 14) for (var n = {
pai: d = "plist_puke_value_" + o % 2 + "_" + i,
hua: "plist_puke_color_small_" + o,
dh: "plist_puke_color_big_" + o
}, a = 0, r = e.children; a < r.length; a++) {
var s = r[a];
if (n[s.name]) {
var l = this.poker.getSpriteFrame(n[s.name]);
s.getComponent(cc.Sprite).spriteFrame = l;
s.active = !0;
}
} else {
var c = e.getChildByName("p2");
c.active = !0;
var d = "plist_puke_joker_big_" + (14 == i ? 0 : 1);
c.getComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame(d);
}
};
__decorate([ r(cc.SpriteAtlas) ], t.prototype, "resultImg", void 0);
__decorate([ r(cc.SpriteAtlas) ], t.prototype, "poker", void 0);
return __decorate([ a ], t);
}(o.default);
i.default = s;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
BRNNView: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "0f27e8+0YZCmbko4/FCiDL8", "BRNNView");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("NodePool"), n = e("BRNNModel"), a = cc._decorator, r = a.ccclass, s = a.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.btn_SZhuang = null;
t.btn_XZhuang = null;
t.chipContent = null;
t.btn_Bank = null;
t.btn_go_on = null;
t.jetton = null;
t.jettonPool = null;
t.jettonPos1 = null;
t.cardList = [];
t.poker = null;
t.pokerType = null;
t.trendContent = null;
t.trendImg = [];
t.faPaiContent = null;
return t;
}
t.prototype.onLoad = function() {
this.init();
};
t.prototype.init = function() {
wUIHelp.setHead(cc.find("bottom/player/head/head", this.node), wGameData.getKey("headimgurl"));
cc.find("bottom/player/name", this.node).getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 8);
this.setBtn_go_on(!1);
this.setDealerInfo(null);
this.initBetNum();
this.initMyBetNum();
this.initPoker();
var e = new cc.Node();
e.addComponent(cc.Sprite).spriteFrame = this.jetton.getSpriteFrame("1.png");
this.jettonPool = new o.default(e);
this.jettonPool.put(e);
};
t.prototype.dealCards = function() {
var e = this;
return new Promise(function(t) {
wUIHelp.hideSonNode(e.faPaiContent);
for (var i = [ 1.2, .95, .9, .85, .94 ], o = function(o) {
e.scheduleOnce(function() {
for (var n = [], a = function(a) {
var r = e.faPaiContent.children[5 * o + a];
n.push(r);
e.scheduleOnce(function() {
wAudioMgr.playSound("sound/FAIPAI", "BRNN");
r.active = !0;
r.scale = 0;
var s = r.getComponent(cc.Animation);
s.play().speed = i[o];
if (4 == a) {
s.off("stop");
s.on("stop", function() {
n.forEach(function(e, t) {
if (0 != t) {
var i = cc.moveBy(.1, cc.v2(38.1 * t, 0));
e.runAction(i);
}
});
4 == o && e.scheduleOnce(function() {
t();
}, .1);
});
}
}, .1 * a);
}, r = 0; r < 5; r++) a(r);
}, .6 * o);
}, n = 0; n < 5; n++) o(n);
});
};
t.prototype.setPokerRes = function(e, t) {
var i = Math.floor(t / 100), o = t % 100 - 1;
if (i < 14) for (var n = {
pai: d = "plist_puke_value_" + o % 2 + "_" + i,
hua: "plist_puke_color_small_" + o,
dh: "plist_puke_color_big_" + o
}, a = 0, r = e.children; a < r.length; a++) {
var s = r[a];
if (n[s.name]) {
var l = this.poker.getSpriteFrame(n[s.name]);
s.getComponent(cc.Sprite).spriteFrame = l;
s.active = !0;
}
} else {
var c = e.getChildByName("p2");
c.active = !0;
var d = "plist_puke_joker_big_" + (14 == i ? 0 : 1);
c.getComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame(d);
}
};
t.prototype.openCard = function(e, t) {
var i = this;
wUIHelp.hideSonNode(this.faPaiContent);
var o = this.cardList, n = Object.values(t);
n.unshift(e);
for (var a = function(e) {
var t = o[e];
t.active = !0;
var a = JSON.parse(JSON.stringify(n[e].hands));
n[e].type > 1 && a.sort(function() {
return Math.random() - .5;
});
t.pokerData = n[e];
for (var r = function(e) {
if ("CP" == e.name) return "continue";
e.pokerID = a[e.name];
e.active = !0;
if ("4" != e.name) {
var t = cc.moveTo(.15, cc.v2(76, -44)), o = cc.callFunc(function() {
e.getComponent(cc.Sprite).spriteFrame = i.poker.getSpriteFrame("plist_puke_front_big");
i.setPokerRes(e, a[e.name]);
}), n = cc.moveTo(.15, e.spos), r = cc.sequence(t, o, n);
e.runAction(r);
}
}, s = 0, l = t.children; s < l.length; s++) r(l[s]);
}, r = 0; r < o.length; r++) a(r);
};
t.prototype.CPAnim = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t, i, o, n = this;
return __generator(this, function(a) {
switch (a.label) {
case 0:
(e = this.cardList.slice(1)).push(this.cardList[0]);
t = function(t) {
var o, a, r, s, l;
return __generator(this, function(c) {
switch (c.label) {
case 0:
e[t].zIndex = 10 - t;
o = e[t].children[4];
a = e[t].children[5];
r = cc.rotateTo(.15, -90);
s = cc.callFunc(function() {
return __awaiter(n, void 0, void 0, function() {
var i, n, r = this;
return __generator(this, function(s) {
switch (s.label) {
case 0:
o.active = !1;
o.getComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame("plist_puke_front_big");
a.active = !0;
(i = a.getComponent(cc.Animation)).off("stop");
i.play("CPAnim");
i.on("stop", function() {
a.active = !1;
r.showPokerType(t, e[t].pokerData, e[t]);
});
n = a.getChildByName("kanpai");
wUIHelp.hideSonNode(n);
this.setPokerRes(n, o.pokerID);
this.setPokerRes(o, o.pokerID);
return [ 4, wUtils.syncDelayed(1, this) ];

case 1:
s.sent();
o.active = !0;
o.getComponent(cc.Animation).play("showPoker");
return [ 2 ];
}
});
});
});
l = cc.sequence(r, s);
o.runAction(l);
return [ 4, wUtils.syncDelayed(1.5, i) ];

case 1:
c.sent();
return [ 2 ];
}
});
};
i = this;
o = 0;
a.label = 1;

case 1:
return o < e.length ? [ 5, t(o) ] : [ 3, 4 ];

case 2:
a.sent();
a.label = 3;

case 3:
o++;
return [ 3, 1 ];

case 4:
return [ 2 ];
}
});
});
};
t.prototype.showPokerType = function(e, t, i) {
var o = cc.find("table/pokerTips/t" + e, this.node);
o.active = !0;
var n = o.getChildByName("type");
n.getComponent(cc.Sprite).spriteFrame = this.pokerType.getSpriteFrame(t.type + ".png");
e = 0;
switch (t.type - 1) {
case 0:
e = 0;
break;

case 1:
case 2:
case 3:
e = 1;
break;

case 4:
case 5:
case 6:
e = 2;
break;

case 7:
case 8:
case 9:
e = 3;
break;

default:
e = 4;
}
var a = o.getChildByName("di");
a.getComponent(cc.Sprite).spriteFrame = this.pokerType.getSpriteFrame("d" + e + ".png");
a.scale = .8;
var r = cc.scaleTo(.15, .95);
a.runAction(r);
n.scale = 1.2;
var s = cc.scaleTo(.15, .9);
n.runAction(s);
var l = t.type - 1;
l > 10 && (l = 10);
var c = "sound/result/womanbull" + l;
wAudioMgr.playSound(c, "BRNN");
if (t.type > 1 && t.type < 12) for (var d = 0, h = i.children; d < h.length; d++) {
var p = h[d];
if ("CP" != p.name) {
wUIHelp.hideSonNode(p);
this.setPokerRes(p, t.hands[p.name]);
"3" != p.name && "4" != p.name || (p.y += 20);
}
}
};
t.prototype.initPoker = function() {
for (var e = 0, t = this.cardList; e < t.length; e++) {
var i = t[e];
wUIHelp.hideSonNode(i);
for (var o = 0, n = i.children; o < n.length; o++) {
var a = n[o];
if ("CP" != a.name) {
a.getComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame("plist_puke_back_big_2");
wUIHelp.hideSonNode(a);
!a.spos && (a.spos = a.getPosition());
a.setPosition(a.spos);
}
}
}
var r = this.node.getChildByName("table").getChildByName("pokerTips");
wUIHelp.hideSonNode(r);
wUIHelp.hideSonNode(this.faPaiContent);
};
t.prototype.playerBet = function(e, t) {
var i = this.node.getChildByName("table");
this.jettonPos1 || (this.jettonPos1 = i.getChildByName("players").getPosition());
var o = i.getChildByName("pos" + t).position;
o.x = wUtils.random(o.x - 70, o.x + 70);
o.y = wUtils.random(o.y - 60, o.y + 60);
this.jettonAni(this.jettonPos1, o, e, t, 1);
};
t.prototype.myBet = function(e, t) {
var i = this.node.getChildByName("table"), o = n.BRNNConfig.chip.indexOf(t), a = wUtils.local_world__POS(cc.find("bottom/chip/" + o, this.node));
a = wUtils.world_local_POS(i, a);
var r = i.getChildByName("pos" + e).position;
r.x = wUtils.random(r.x - 70, r.x + 70);
r.y = wUtils.random(r.y - 60, r.y + 60);
this.jettonAni(a, r, t, e, 1);
};
t.prototype.bankerRecoveryChip = function(e) {
var t = this, i = {};
for (var o in e) e[o].score < 0 && (i[o] = !0);
for (var n = null, a = [], r = 0, s = this.node.getChildByName("table").getChildByName("chip").children; r < s.length; r++) {
var l = s[r];
i[l.name] && a.push(l);
}
var c = cc.v2(-358, 285);
if (Object.keys(i).length) {
wAudioMgr.playSound("sound/GET_GOLD", "BRNN");
var d = a.length / 20;
d < 1 && (d = 1);
this.schedule(function e() {
for (var i = function() {
var i = a.shift();
if (!i) {
t.unschedule(e);
n();
return {
value: void 0
};
}
i.zIndex = 10;
var o = cc.moveTo(.5, c).easing(cc.easeBackIn()), r = cc.callFunc(function() {
t.jettonPool.put(i);
});
i.stopAllActions();
i.runAction(cc.sequence(o, r));
}, o = 0; o < d; o++) {
var r = i();
if ("object" == typeof r) return r.value;
}
}.bind(this), .01, 60, 0);
} else this.scheduleOnce(function() {
n();
}, .5);
return new Promise(function(e) {
n = e;
});
};
t.prototype.bankerGiveChip = function(e, t) {
var i = this, o = !0, n = this.node.getChildByName("table"), a = function(a) {
var s = e[a].score;
if (s <= 0) return "continue";
var l = t.maxScoreSplit(s);
if (l.length <= 0) return "continue";
o = !1;
var c = Math.ceil(l.length / 20), d = n.getChildByName("pos" + a).getPosition();
r.schedule(function e() {
for (var t = 0; t < c; t++) {
var o = l.shift();
if (!o) {
i.unschedule(e);
return;
}
var n = wUtils.random(d.x - 70, d.x + 70), r = wUtils.random(d.y - 60, d.y + 60);
i.jettonAni(cc.v2(-358, 285), cc.v2(n, r), o, a, 1);
}
}.bind(r), .01, 60, 0);
}, r = this;
for (var s in e) a(s);
var l = o ? .3 : .8;
o || wAudioMgr.playSound("sound/GET_GOLD", "BRNN");
return new Promise(function(e) {
i.scheduleOnce(function() {
e(!0);
}, l);
});
};
t.prototype.chipFlyPlayer = function(e, t, i, o) {
for (var n = this, a = this.node.getChildByName("table"), r = {
1: [],
2: [],
3: [],
4: []
}, s = 0, l = this.node.getChildByName("table").getChildByName("chip").children; s < l.length; s++) {
var c = l[s];
r[c.name].push(c);
}
this.jettonPos1 || (this.jettonPos1 = a.getChildByName("players").getPosition());
var d = {};
if (e && e.score > 0) for (var h in t) i[h].win && (d[h] = 2 * t[h].reduce(function(e, t) {
return e + t;
}, 0));
var p = !1, u = a.getChildByName("myChip"), g = function(e) {
var t = cc.v2(-626, -178), i = o.scoreSplit(d[e]), a = r[e].splice(0, i.length);
if (a.length <= 0) return "continue";
var s = a.length / 20;
s < 1 && (s = 1);
m.schedule(function e() {
for (var i = function() {
var i = a.pop();
if (!i) {
n.unschedule(e);
return {
value: void 0
};
}
i.parent = u;
var o = i.getPosition().sub(t).mag() / 200 * .2, r = cc.moveTo(o, t).easing(cc.easeBackIn()), s = cc.delayTime(.01), l = cc.callFunc(function() {
n.jettonPool.put(i);
});
i.stopAllActions();
i.runAction(cc.sequence(r, s, l));
}, o = 0; o < s; o++) {
var r = i();
if ("object" == typeof r) return r.value;
}
}.bind(m), .01, 60, 0);
}, m = this;
for (var f in d) g(f);
var y = wUtils.local_world__POS(cc.find("right/players", this.node));
y = wUtils.world_local_POS(u, y);
var v = function(e) {
var t = r[e];
if (t.length <= 0) return "continue";
p = !0;
var i = t.length / 30;
i < 1 && (i = 1);
N.schedule(function e() {
for (var o = function() {
var i = t.pop();
if (!i) {
n.unschedule(e);
return {
value: void 0
};
}
var o = cc.moveTo(.5, y).easing(cc.easeBackIn()), a = cc.callFunc(function() {
n.jettonPool.put(i);
});
i.stopAllActions();
i.runAction(cc.sequence(o, a));
}, a = 0; a < i; a++) {
var r = o();
if ("object" == typeof r) return r.value;
}
}.bind(N), .01, 60, 0);
}, N = this;
for (var h in r) v(h);
p && wAudioMgr.playSound("sound/GET_GOLD", "BRNN");
this.scheduleOnce(function() {
wAudioMgr.playSound("sound/SETTLEMENT", "BRNN");
}, .6);
};
t.prototype.jettonAni = function(e, t, i, o, n) {
var a = this.node.getChildByName("table").getChildByName("chip"), r = this.jettonPool.getNode, s = this.jetton.getSpriteFrame(Math.floor(i / 1e3) + ".png");
r.getComponent(cc.Sprite).spriteFrame = s;
r.stopAllActions();
r.setPosition(e);
var l = e.sub(t).mag() / 200 * .12;
r.active = !0;
a.addChild(r, n, "" + o);
var c = cc.moveTo(l, t).easing(cc.easeOut(2));
r.runAction(c);
};
t.prototype.showWin = function(e) {
var t = this.node.getChildByName("table");
for (var i in e) {
var o = t.getChildByName("winTips").children[Number(i) - 1];
if (e[i].win > 0) {
o.active = !0;
o.opacity = 0;
var n = cc.fadeTo(.1, 255), a = cc.delayTime(.3), r = cc.fadeTo(.1, 0), s = cc.delayTime(.3), l = cc.repeat(cc.sequence(n, a, r, s), 5);
o.runAction(l);
}
}
};
t.prototype.recoveryChip = function() {
var e = this.node.getChildByName("table").getChildByName("chip");
e.children.length && wLog.w("还有节点没有回收");
this.jettonPool.recoveryAll(e);
(e = this.node.getChildByName("table").getChildByName("myChip")).children.length && wLog.w("还有节点没有回收");
this.jettonPool.recoveryAll(e);
};
t.prototype.initMyBetNum = function() {
for (var e = 1; e < 5; e++) this.setMyBetNum(e, 0);
};
t.prototype.setMyBetNum = function(e, t) {
this.node.getChildByName("table").getChildByName("myBet" + e).getComponent(cc.Label).string = t ? wUtils.numConvert(t) : "";
};
t.prototype.setTotalBetNum = function(e, t) {
void 0 === t && (t = 0);
this.node.getChildByName("table").getChildByName("layout").getChildByName("totalBet").getComponent(cc.Label).string = wUtils.numConvert(e);
var i = Math.floor(t);
i < 0 && (i = 0);
cc.find("top/layout/xz", this.node).getComponent(cc.Label).string = "剩余下注:" + i;
};
t.prototype.initBetNum = function() {
for (var e = 1; e < 5; e++) this.setBetNum(e, 0);
};
t.prototype.setBetNum = function(e, t) {
this.node.getChildByName("table").getChildByName("bet" + e).getComponent(cc.Label).string = wUtils.numConvert(t);
};
t.prototype.setBtn_SZhuang = function(e) {
this.btn_SZhuang.active = e;
};
t.prototype.setBtn_XZhuang = function(e) {
this.btn_XZhuang.active = e;
};
t.prototype.selectChip = function(e) {
for (var t = 0, i = this.chipContent.children; t < i.length; t++) {
var o = i[t];
if (o.children[1].active && e != o.name) {
o.children[1].active = !1;
var n = o.children[0];
n.active = !0;
n.y = 10;
var a = cc.moveTo(.1, cc.v2(0, 0));
n.stopAllActions();
n.runAction(a);
}
}
var r = this.chipContent.children[e];
if (r && !r.children[1].active) {
var s = r.children[0];
s.active = !1;
s.y = 0;
(s = r.children[1]).active = !0;
s.y = 0;
var l = cc.moveTo(.1, cc.v2(0, 10));
s.stopAllActions();
s.runAction(l);
}
};
t.prototype.setGameStatus = function(e) {
this.node.getChildByName("top").getChildByName("time").getChildByName("type").getComponent(cc.Label).string = e ? "下注时间" : "开奖时间";
};
t.prototype.setBtn_Bank = function(e) {
this.btn_Bank.interactable = e;
};
t.prototype.chip_On_Off = function(e) {
e = Math.floor(e / 10);
for (var t = n.BRNNConfig.chip, i = 0, o = this.chipContent.children; i < o.length; i++) {
var a = o[i];
a.getComponent(cc.Button).interactable = e >= t[a.name];
if (e < t[a.name]) for (var r = 0, s = a.children; r < s.length; r++) {
var l = s[r];
l.stopAllActions();
l.setPosition(0, 0);
l.active = "img" == l.name;
}
}
};
t.prototype.setBtn_go_on = function(e) {
this.btn_go_on.interactable = e;
};
t.prototype.setTime = function(e, t, i) {
var o = cc.find("top/time/anim", this.node), n = cc.find("label", o).getComponent(cc.Label);
n.string = "" + e;
var a = this.node.getChildByName("top").getChildByName("time").getChildByName("type");
if (1 == t) {
if (e <= 5) {
wAudioMgr.playSound("sound/TIME_WARIMG", "BRNN");
o.getComponent(cc.Animation).play();
} else a.getComponent(cc.Label).string = "下注时间";
7 == e && wAudioMgr.playSound("sound/ADD_GOLD_EX", "BRNN");
}
if (2 == t) if (e <= 3) {
a.getComponent(cc.Label).string = "空闲时间";
if (3 == e) {
this.initPoker();
this.recoveryChip();
this.initMyBetNum();
this.initBetNum();
this.setTotalBetNum(0);
i >= 10 && this.tipsBanker(0);
}
} else {
a.getComponent(cc.Label).string = "开奖时间";
n.string = "" + (e - 3);
}
};
t.prototype.setMyGold = function(e) {
cc.find("bottom/player/layout/Label", this.node).getComponent(cc.Label).string = wUtils.numConvert(e);
};
t.prototype.setDealerInfo = function(e) {
var t = this.node.getChildByName("top").getChildByName("banker");
t.getChildByName("gold").getComponent(cc.Label).string = e ? wUtils.numConvert(e.gold) : "";
var i = e ? e.username : "";
e && e.uid == wGameData.getKey("uid") && (i = wUtils.handleNameLen(e.nickname, 12));
t.getChildByName("name").getComponent(cc.Label).string = i;
var o = cc.find("head/head", t);
o.active = e;
if (e) {
wUIHelp.setHead(o, e.headimgurl);
cc.find("top/layout/lz", this.node).getComponent(cc.Label).string = "连庄：" + e.num;
}
};
t.prototype.upPlayerCpunt = function(e) {
cc.find("right/players/label", this.node).getComponent(cc.Label).string = "" + e;
};
t.prototype.stop_bet = function() {
var e = this.node.getChildByName("tips").getChildByName("stop");
wAudioMgr.playSound("sound/STOP_W", "BRNN");
e.active = !0;
e.opacity = 0;
e.stopAllActions();
var t = cc.fadeTo(.25, 255), i = cc.delayTime(.8), o = cc.fadeTo(.25, 0), n = cc.callFunc(function() {
e.active = !1;
}), a = cc.sequence(t, i, o, n);
e.runAction(a);
};
t.prototype.start_bet = function() {
var e = this.node.getChildByName("tips").getChildByName("start");
wAudioMgr.playSound("sound/START_W", "BRNN");
e.active = !0;
e.opacity = 0;
e.stopAllActions();
var t = cc.fadeTo(.25, 255), i = cc.delayTime(.8), o = cc.fadeTo(.25, 0), n = cc.callFunc(function() {
e.active = !1;
}), a = cc.sequence(t, i, o, n);
e.runAction(a);
};
t.prototype.initChip = function(e, t) {
var i = this, o = this.node.getChildByName("table"), n = o.getChildByName("chip"), a = cc.find("pos" + t, o).getPosition();
e.forEach(function(e) {
var o = i.jetton.getSpriteFrame(Math.floor(e / 1e3) + ".png"), r = i.jettonPool.getNode;
r.getComponent(cc.Sprite).spriteFrame = o;
n.addChild(r, 1, "" + t);
r.active = !0;
var s = wUtils.random(a.x - 70, a.x + 70), l = wUtils.random(a.y - 60, a.y + 60);
r.setPosition(cc.v2(s, l));
});
};
t.prototype.tipsBanker = function() {
var e = this.node.getChildByName("tips").getChildByName("banker");
e.active = !0;
e.opacity = 0;
e.stopAllActions();
var t = cc.fadeTo(.25, 255), i = cc.delayTime(.8), o = cc.fadeTo(.25, 0), n = cc.callFunc(function() {
e.active = !1;
}), a = cc.sequence(t, i, o, n);
e.runAction(a);
};
t.prototype.upTrend = function(e) {
var t = this.trendContent.getComponent("Layout_z");
t._removeAllChildren();
for (var i = e[1].info.length, o = 0; o < i; o++) {
for (var n = [], a = 1; a < 5; a++) n.push(e[a].info[o]);
o == i - 1 && n.push(!0);
t._addClick(n, i - o);
}
for (var r in e) if (Object.prototype.hasOwnProperty.call(e, r)) {
var s = e[r].info, l = 0;
for (o = s.length - 1; o > -1 && s[o]; o--) l++;
cc.find("trend/label/" + r, this.node).getComponent(cc.Label).string = "" + l;
}
};
t.prototype.upTrendItem = function(e, t) {
e.active = !0;
e.getChildByName("new").active = t[4];
for (var i = 1; i < 5; i++) e.getChildByName("" + i).getComponent(cc.Sprite).spriteFrame = this.trendImg[Number(t[i - 1])];
};
t.prototype.initPlayer = function(e) {
var t = 0;
for (var i in e) if (Object.prototype.hasOwnProperty.call(e, i) && !(t > 3)) {
var o = cc.find("player/" + t++, this.node);
o.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(e[i].username, 4);
wUIHelp.setHead(cc.find("head/head", o), e[i].headimgurl);
}
};
__decorate([ s(cc.Node) ], t.prototype, "btn_SZhuang", void 0);
__decorate([ s(cc.Node) ], t.prototype, "btn_XZhuang", void 0);
__decorate([ s(cc.Node) ], t.prototype, "chipContent", void 0);
__decorate([ s(cc.Button) ], t.prototype, "btn_Bank", void 0);
__decorate([ s(cc.Button) ], t.prototype, "btn_go_on", void 0);
__decorate([ s(cc.SpriteAtlas) ], t.prototype, "jetton", void 0);
__decorate([ s(cc.Node) ], t.prototype, "cardList", void 0);
__decorate([ s(cc.SpriteAtlas) ], t.prototype, "poker", void 0);
__decorate([ s(cc.SpriteAtlas) ], t.prototype, "pokerType", void 0);
__decorate([ s(cc.Node) ], t.prototype, "trendContent", void 0);
__decorate([ s([ cc.SpriteFrame ]) ], t.prototype, "trendImg", void 0);
__decorate([ s(cc.Node) ], t.prototype, "faPaiContent", void 0);
return __decorate([ r ], t);
}(cc.Component);
i.default = l;
cc._RF.pop();
}, {
BRNNModel: "BRNNModel",
NodePool: void 0
} ]
}, {}, [ "BRNNControlle", "BRNNLoad", "BRNNModel", "BRNNPlayerList", "BRNNResult", "BRNNView" ]);