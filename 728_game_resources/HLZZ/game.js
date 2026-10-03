window.__require = function e(t, n, o) {
function i(r, c) {
if (!n[r]) {
if (!t[r]) {
var s = r.split("/");
s = s[s.length - 1];
if (!t[s]) {
var l = "function" == typeof __require && __require;
if (!c && l) return l(s, !0);
if (a) return a(s, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = s;
}
var d = n[r] = {
exports: {}
};
t[r][0].call(d.exports, function(e) {
return i(t[r][1][e] || e);
}, d, d.exports, e, t, n, o);
}
return n[r].exports;
}
for (var a = "function" == typeof __require && __require, r = 0; r < o.length; r++) i(o[r]);
return i;
}({
HLZZController: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "573d4YORY5Anbbui+N0F/wv", "HLZZController");
Object.defineProperty(n, "__esModule", {
value: !0
});
var o = e("MultiBase"), i = e("HLZZModel"), a = e("HLZZView"), r = cc._decorator, c = r.ccclass;
r.property;
var s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.View = null;
t.Model = null;
return t;
}
t.prototype.initNetWorkEvevt = function() {
for (var e = this, t = function(t) {
wGEvent.on(t, function(n) {
1 == n.status ? e[t] ? e[t](n.data) : wLog.e(t) : console.error("evevt", n);
}, n);
}, n = this, o = 0, i = [ "Msg_HLZZ_StartGame", "Msg_HLZZ_Socre_in", "Msg_HLZZ_Out", "Msg_HLZZ_Add", "Msg_HLZZ_UpDateBanber", "Msg_HLZZ_Do", "Msg_HLZZ_Again", "Msg_HLZZ_CHECK", "Msg_HLZZ_TurnBanber", "Msg_HLZZ_OutBanber", "Msg_HLZZ_UPBanber" ]; o < i.length; o++) t(i[o]);
};
t.prototype.update = function(e) {
if (this.Model.time) {
this.Model.newTime += e;
this.Model.newTime > 1 && this.Model.time--;
}
};
t.prototype.initProxy = function() {
var e = this;
this.View = this.node.getComponent(a.default);
this.Model = wUtils.creatorProxy(new i.HLZZModel());
this.Model.onEvevt("gameState", function(t) {
e.View.setBtn_Bank(3 != t);
if (2 != t) {
e.View.chip_On_Off(0);
e.View.setBtn_go_on(!1);
} else e.Model.gold = e.Model.gold;
e.m_setBankBtn(3 != t);
e.Model.selectChip = -1;
});
this.Model.onEvevt("time", function(t) {
t = !t || t <= 0 ? 0 : t;
e.View.setTime(t || 0, e.Model.gameState, e.Model.banker.num);
e.Model.newTime = 0;
});
this.Model.onEvevt("gold", function(t) {
e.View.setMyGold(t);
wGameData.getKey("uid") != e.Model.banker.uid && 2 == e.Model.gameState && e.View.chip_On_Off(t);
var n = e.Model.getLastbet(e.Model.lastbet);
2 == e.Model.gameState && n && e.Model.gold >= n && wGameData.getKey("uid") != e.Model.banker.uid ? e.View.setBtn_go_on(!0) : e.View.setBtn_go_on(!1);
if (t < i.HLZZConfig.chip[e.Model.selectChip]) for (;i.HLZZConfig.chip[--e.Model.selectChip] && !(t >= i.HLZZConfig.chip[e.Model.selectChip]); ) ;
});
this.Model.onEvevt("banker", function(t) {
var n = t.uid == wGameData.getKey("uid");
e.View.setBankerInfo(e.Model.banker);
if (n) {
e.View.chip_On_Off(0);
e.View.setBtn_go_on(!1);
e.View.setBtn_SZhuang(!1);
e.View.setBtn_XZhuang(!0);
}
});
this.Model.onEvevt("selectChip", function(t) {
e.View.selectChip(t);
});
this.Model.onEvevt("playerNum", function(t) {
e.View.upPlayerCpunt(t);
});
this.Model.onEvevt("circle", function(t) {
e.View.setBankerCircle(t);
});
for (var t = cc.find("table", this.node), n = function(n) {
var i = t.getChildByName("" + n);
i.on(cc.Node.EventType.TOUCH_START, function() {
i.children[0].active = !0;
}, o);
i.on(cc.Node.EventType.TOUCH_END, function() {
i.children[0].active = !1;
e.onClick(null, "bet" + n);
}, o);
i.on(cc.Node.EventType.TOUCH_CANCEL, function() {
i.children[0].active = !1;
}, o);
}, o = this, r = 1; r < 7; r++) n(r);
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
var t = {};
for (var n in e.me_socre_in) {
var o = e.me_socre_in[n].gold_all;
this.View.setMyBetNum(n, o);
t[n] = o;
}
this.Model.bet = t;
this.View.upTrend(e.history);
this.Model.gold = this.Model.gold;
this.View.setBtn_Bank(!0);
this.Model.getLastbet(t) && (this.Model.lastbet = t);
if (3 == this.Model.gameState && this.Model.time <= 3) this.Model.bet = {}; else {
var i = this.Model.allBet;
for (var n in i) {
var a = this.Model.maxScoreSplit(i[n]);
this.View.setBetNum(n, i[n]);
this.Model.totalBet += i[n];
3 != this.Model.gameState && this.View.initChip(a, n);
}
this.View.setTotalBetNum(this.Model.totalBet, this.Model.banker.gold - this.Model.totalBet);
if (3 == this.Model.gameState) {
this.Model.bet = {};
this.View.initShowPoker(e.turnover);
wViewMgr.openPage({
path: "prefab/HLZZResult",
bundle: "HLZZ",
data: {
msg: e,
model: this.Model
}
});
}
}
};
t.prototype.Msg_HLZZ_StartGame = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, n;
return __generator(this, function() {
this.View.start_bet();
this.Model.gold = this.Model.gold;
this.ininStart();
this.View.recoveryChip();
(t = this.node.getChildByName("result")) && wUIHelp.easeIn(t.getChildByName("main"), function() {
t.active = !1;
});
if ((n = e.info).uid == this.Model.banker.uid) this.Model.circle++; else {
if (this.Model.banker.uid == wGameData.getKey("uid")) {
this.View.setBtn_SZhuang(!0);
this.View.setBtn_XZhuang(!1);
}
this.Model.circle = 1;
}
this.Model.banker = n;
this.Model.gameState = 2;
this.Model.time = e.time;
return [ 2 ];
});
});
};
t.prototype.Msg_HLZZ_Socre_in = function(e) {
for (var t in e) {
var n = e[t].gold_all, o = n - (this.Model.gold_all[t] || 0) - (this.Model.bet[t] || 0);
this.Model.gold_all[t] = n;
if (!(o <= 0)) for (var i = 0, a = this.Model.scoreSplit(o); i < a.length; i++) {
var r = a[i];
this.Model.jettonList.push([ r, t ]);
}
}
this.initFhip();
};
t.prototype.Msg_HLZZ_UpDateBanber = function() {
this.View.tipsBanker(1);
};
t.prototype.Msg_HLZZ_Do = function(e) {
var t = wGameData.getKey("uid"), n = e.me_socre_in;
for (var o in n) if (Object.prototype.hasOwnProperty.call(n, o)) {
var a = n[o].gold_all, r = this.Model.bet[o] || 0;
this.Model.bet[o] = a;
this.View.setMyBetNum(o, a);
var c = a - r;
if (!(c <= 0)) {
this.Model.gold_all[o] = e.socre_in[o].gold_all;
this.Model.totalBet += c;
this.View.setTotalBetNum(this.Model.totalBet, this.Model.banker.gold - this.Model.totalBet);
this.Model.allBet[o] += c;
this.View.setBetNum(o, this.Model.allBet[o]);
this.upPlayerGold(t, this.Model.gold - c);
var s = [ c ];
-1 == i.HLZZConfig.chip.indexOf(c) && (s = this.Model.maxScoreSplit(c));
for (var l = 0; l < s.length; l++) this.View.myBet(o, s[l]);
}
}
this.Model.gold != e.gold && wLog.e("客户端和服务器的金币对不上了");
this.Msg_HLZZ_Socre_in(e.socre_in);
};
t.prototype.Msg_HLZZ_Again = function(e) {
this.Msg_HLZZ_Do(e);
};
t.prototype.Msg_HLZZ_CHECK = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, n, o, i, a, r, c;
return __generator(this, function(s) {
switch (s.label) {
case 0:
this.launchAllChip();
this.Model.gameState = 3;
this.Model.time = e.time;
this.View.stop_bet();
return [ 4, wUtils.syncDelayed(1, this) ];

case 1:
s.sent();
t = wUtils.random(1, 6);
n = wUtils.random(1, 6);
return [ 4, this.View.playDice([ t, n ]) ];

case 2:
s.sent();
o = (t + n - 2) % 4;
i = e.turnover;
a = i.other;
r = [ a[1].card, a[2].card, a[3].card, i.banber_card ];
c = [ a[1].card_set, a[2].card_set, a[3].card_set, i.banber_card_set ];
this.View.dealCards(o, r, c);
return [ 4, wUtils.syncDelayed(5.5, this) ];

case 3:
s.sent();
wLog.i("-----------发牌结束");
this.View.showWin(i.other);
return [ 4, wUtils.syncDelayed(1.5, this) ];

case 4:
s.sent();
return [ 4, this.View.bankerRecoveryChip(i.other) ];

case 5:
s.sent();
return [ 4, wUtils.syncDelayed(.5, this) ];

case 6:
s.sent();
return [ 4, this.View.bankerGiveChip(i.other, this.Model) ];

case 7:
s.sent();
this.View.chipFlyPlayer(this.Model.bet, i.other, this.Model);
this.upPlayerGold(wGameData.getKey("uid"), e.gold);
this.Model.gameState = 4;
this.Model.banker.gold = i.banber_gold;
this.View.setBankerInfo(this.Model.banker);
this.Model.getLastbet(this.Model.bet) && (this.Model.lastbet = this.Model.bet);
this.Model.bet = {};
this.View.upTrend(e.history);
return [ 4, wUtils.syncDelayed(1.6, this) ];

case 8:
s.sent();
wAudioMgr.playSound("sound/show_getscore", "HLZZ");
wViewMgr.openPage({
path: "prefab/HLZZResult",
bundle: "HLZZ",
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
t.prototype.Msg_HLZZ_UPBanber = function() {
this.Msg_HLZZ_TurnBanber({});
};
t.prototype.Msg_HLZZ_TurnBanber = function() {
wUIManager.showTips("上庄申请已提交", wUIManager.TIPS_WHITE);
this.View.setBtn_XZhuang(!0);
this.View.setBtn_SZhuang(!1);
};
t.prototype.Msg_HLZZ_OutBanber = function() {
wUIManager.showTips("下庄申请已提交", wUIManager.TIPS_WHITE);
this.View.setBtn_XZhuang(!1);
this.View.setBtn_SZhuang(!0);
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
wAudioMgr.playSound("sound/addscorelarge", this.m_game);
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
wAudioMgr.playSound("sound/addscore", this.m_game);
}
}
this.Model.totalBet += t[0];
this.View.setTotalBetNum(this.Model.totalBet, this.Model.banker.gold - this.Model.totalBet);
this.Model.allBet[t[1]] += t[0];
this.View.setBetNum(t[1], this.Model.allBet[t[1]]);
} else this.unscheduleAllCallbacks();
};
t.prototype.launchAllChip = function() {
var e = this;
this.unscheduleAllCallbacks();
if (this.Model.jettonList.length) {
for (var t = {}, n = 0, o = this.Model.jettonList; n < o.length; n++) {
var i = o[n], a = i[1];
!t[a] && (t[a] = 0);
t[a] += i[0];
}
this.Model.jettonList = [];
var r = function(n) {
var o = t[n];
c.Model.maxScoreSplit(o).forEach(function(t) {
e.Model.jettonList.push([ t, n ]);
});
}, c = this;
for (var a in t) r(a);
wAudioMgr.playSound("sound/addscore", this.m_game);
for (;this.Model.jettonList.length; ) this.launchFhip(!1);
}
};
t.prototype.ininStart = function() {
this.Model.initDesktop();
this.View.initPoker();
this.View.initMyBetNum();
this.View.initBetNum();
this.View.setTotalBetNum(0);
};
t.prototype.upPlayerGold = function(e, t) {
if (e == wGameData.getKey("uid")) {
wGameData.setKey("gold", t);
this.Model.gold = t;
}
};
t.prototype.onClick = function(e, t) {
switch (t) {
case "hall":
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
this.Model.selectChip = t;
return;

case "bet1":
case "bet2":
case "bet3":
case "bet4":
case "bet5":
case "bet6":
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
wNetWork.send("Msg_HLZZ_UPBanber", []);
break;

case "sz":
if (wGameData.getKey("gold") < 3e8) {
wUIManager.showConfirmUI({
content: "您的欢乐豆不足，无法上庄\n上庄条件：3亿欢乐豆",
title: "系统提示"
});
break;
}
wNetWork.send("Msg_HLZZ_TurnBanber", []);
this.View.setBtn_SZhuang(!1);
break;

case "xz":
wNetWork.send("Msg_HLZZ_OutBanber", []);
this.View.setBtn_XZhuang(!1);
break;

case "playerlist":
wViewMgr.openPage({
path: "prefab/HLZZPlayerList",
bundle: "HLZZ"
});
}
wAudioMgr.playBtnSound();
};
t.prototype.playerBet = function(e) {
2 == this.Model.gameState ? -1 != this.Model.selectChip ? this.Model.banker.uid != wGameData.getKey("uid") ? wNetWork.send("Msg_HLZZ_Do", {
gold: i.HLZZConfig.chip[this.Model.selectChip],
set_id: Number(e)
}) : wUIManager.showTips("庄家不能下注！", wUIManager.TIPS_WHITE) : wUIManager.showTips("请选择下注筹码！", wUIManager.TIPS_WHITE) : wUIManager.showTips("请稍后，还没到下注时间哟！", wUIManager.TIPS_WHITE);
};
t.prototype.lastBet = function() {
var e = this.Model.lastbet;
for (var t in e) if (Object.prototype.hasOwnProperty.call(e, t)) {
var n = e[t];
n && wNetWork.send("Msg_HLZZ_Do", {
gold: n,
set_id: Number(t)
});
}
this.View.setBtn_go_on(!1);
this.Model.lastbet = {};
};
t.prototype.m_upGameGold = function() {
this.Model.gold = wGameData.getKey("gold");
};
t.prototype.m_NetWorkState = function() {};
t.prototype.Msg_HLZZ_Add = function() {
this.Model.playerNum++;
};
t.prototype.Msg_HLZZ_Out = function(e) {
e.uid != wGameData.getKey("uid") && this.Model.playerNum--;
};
return __decorate([ c ], t);
}(o.default);
n.default = s;
cc._RF.pop();
}, {
HLZZModel: "HLZZModel",
HLZZView: "HLZZView",
MultiBase: void 0
} ],
HLZZLoad: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "6e7d18k1nlOsYXCc4tqR4g6", "HLZZLoad");
Object.defineProperty(n, "__esModule", {
value: !0
});
var o = e("Config"), i = cc._decorator, a = i.ccclass;
i.property;
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
var n = cc.find("main/spine", this.node);
wUIHelp.playSpine(n, "start", function() {
wUIHelp.playSpine(n, "idle", null, !0);
});
};
t.prototype.onEnable = function() {
var e = this;
this.scheduleOnce(function() {
e.enterRoom(5);
}, .3);
};
t.prototype.initShow = function() {
var e = this;
this.isEnterRoom = !1;
var t = cc.fadeOut(.2), n = cc.callFunc(function() {
e.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
e.node.parent.destroyAllChildren();
}
}), o = cc.sequence(t, n);
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
}
}
};
t.prototype.loadGame = function() {
var e = o.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(e.prefabUrl, function() {}, function(e, t) {
if (e) wLog.e(e); else {
wLog.i("进入游戏");
wViewMgr.openGame(t);
}
}, e.enName);
};
return __decorate([ a ], t);
}(cc.Component);
n.default = r;
cc._RF.pop();
}, {
Config: void 0
} ],
HLZZModel: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e646159aj9GUI0ZtfbmyEox", "HLZZModel");
Object.defineProperty(n, "__esModule", {
value: !0
});
n.HLZZModel = n.HLZZConfig = void 0;
n.HLZZConfig = {
chip: [ 1e3, 1e4, 1e5, 1e6, 5e6, 1e7 ],
pokerType: {
zhizunbao: 1,
shuangtian: 2,
shuangdi: 3,
shuangren: 4,
shuanghe: 5,
shuangmei: 6,
shuangchang: 7,
shuangbandeng: 8,
shuangfutou: 9,
shuanghongtou: 10,
shuangtongchui: 11,
shuangyaowu: 12,
zajiu: 13,
zaba: 14,
zaqi: 15,
zawu: 16,
tianwangjiu: 17,
tiangang: 18,
digang: 19
}
};
var o = function() {
function e() {
this.applyNum = [];
this.gameState = 1;
this.time = 0;
this.newTime = 0;
this.jettonSound = !0;
this.jettonList = [];
this.totalBet = 0;
this.bet = {};
this.lastbet = {};
this.selectChip = -1;
this.bankGold = 0;
this.allBet = {
1: 0,
2: 0,
3: 0,
4: 0,
5: 0,
6: 0
};
this.gold_all = {};
}
e.prototype.initRoom = function(e) {
this.gold_all = e.socre_in;
for (var t in e.socre_in) {
var n = e.socre_in[t].gold_all;
this.allBet[t] = n;
this.gold_all[t] = n;
}
this.banker = e.banker_info || {};
this.playerNum = e.players_count;
this.gold = e.gold;
this.gameState = e.game_status;
this.time = e.time;
this.circle = e.circle;
};
e.prototype.getLastbet = function(e) {
var t = 0;
for (var n in e) t += e[n];
return t;
};
e.prototype.initDesktop = function() {
this.allBet = {
1: 0,
2: 0,
3: 0,
4: 0,
5: 0,
6: 0
};
this.gold_all = {};
this.jettonList = [];
this.totalBet = 0;
};
e.prototype.scoreSplit = function(e) {
for (var t = []; ;) {
for (var o = 0, i = 5; i > -1; i--) if (e > n.HLZZConfig.chip[i]) {
o = i;
break;
}
if (o < 1) {
for (;e > 0; ) {
t.push(1e3);
e -= 1e3;
}
break;
}
var a = o - 1 > -1 ? o - 1 : 0, r = n.HLZZConfig.chip[wUtils.random(a, o)];
t.push(r);
e -= r;
}
return t;
};
e.prototype.maxScoreSplit = function(e) {
for (var t = [], o = 5; o > -1; o--) for (var i = n.HLZZConfig.chip[o]; e >= i; ) {
t.push(i);
e -= i;
}
return t;
};
return e;
}();
n.HLZZModel = o;
cc._RF.pop();
}, {} ],
HLZZPlayerList: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "3cd964iZvBDBpM8xStWoR/L", "HLZZPlayerList");
Object.defineProperty(n, "__esModule", {
value: !0
});
var o = e("PopupBase"), i = cc._decorator, a = i.ccclass, r = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
return t;
}
t.prototype.onLoad = function() {
var e = this;
wUtils.sendMsg("Msg_HLZZ_GetPlayers", {}, this).then(function(t) {
wLog.e(t);
var n = [];
for (var o in t.players) Object.prototype.hasOwnProperty.call(t.players, o) && n.push(t.players[o].info);
e.initList(n);
});
};
t.prototype.initList = function(e) {
cc.find("label", this.main).getComponent(cc.Label).string = e.length + "在线";
e.sort(function(e, t) {
return t.gold - e.gold;
});
for (var t = this.main.getChildByName("item"), n = 0; n < e.length; n++) {
var o = cc.instantiate(t);
o.parent = this.content;
o.active = !0;
var i = e[n], a = i.uid == wGameData.getKey("uid") ? wGameData.getKey("nickname") : i.nickname;
o.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(a, 8);
wUIHelp.setHead(cc.find("head/head", o), i.headimgurl);
o.getChildByName("money").getComponent(cc.Label).string = wUtils.goldFormat(i.gold, 1, 1);
}
};
__decorate([ r(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ a ], t);
}(o.default);
n.default = c;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
HLZZResult: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "c067cU2DbxKNrl02QcinepK", "HLZZResult");
Object.defineProperty(n, "__esModule", {
value: !0
});
var o = e("PopupBase"), i = e("HLZZModel"), a = cc._decorator, r = a.ccclass, c = a.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.resultImg = null;
t.poker = null;
t.font = [];
return t;
}
t.prototype.init = function(e) {
var t = this, n = e.msg, o = e.model;
this.scheduleOnce(function() {
t.hide(!1);
}, o.time - 3);
var i = this.main.getChildByName("zj");
o.banker.uid == wGameData.getKey("uid") ? i.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 12) : i.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(o.banker.nickname, 12);
cc.find("my/name", this.main).getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 12);
n.gold_change >= 0 ? wAudioMgr.playSound("sound/game_win", "HLZZ") : wAudioMgr.playSound("sound/game_lose", "HLZZ");
this.main.getChildByName("winbg").active = n.gold_change >= 0;
this.main.getChildByName("losebg").active = n.gold_change < 0;
var a = n.gold_change, r = cc.find("my/win", this.main).getComponent(cc.Label);
r.string = (a > 0 ? "+" : "") + wUtils.numConvert(a);
r.font = this.font[a >= 0 ? 1 : 0];
r.node.active = 0 != a;
cc.find("my/wxz", this.main).active = 0 == a;
var c = n.turnover;
this.setPoker(cc.find("zj", this.main), c.banber_card, c.banber_card_set, c.banber_gold_change);
for (var s = c.other, l = 1; l < 7; l++) {
var d = s[l];
this.setPoker(cc.find("" + l, this.main), d.card, d.card_set, d.gold_change);
}
this.main.getChildByName("tongsha").active = n.turnover.is_win;
var h = this.main.getChildByName("list");
wUIHelp.hideSonNode(h);
if (!n.turnover.is_win) {
var u = c.win;
for (l = 0; l < u.length && l < 3; l++) {
var p = h.children[l];
d = u[l].gold_change;
p.getChildByName("gold").getComponent(cc.Label).string = "+" + wUtils.numConvert(d);
var g = u[l].nickname;
u[l].uid == wGameData.getKey("uid") && (g = wUtils.handleNameLen(wGameData.getKey("nickname"), 12));
p.getChildByName("name").getComponent(cc.Label).string = g;
p.active = !0;
}
}
};
t.prototype.onHide = function() {
this.node.destroy();
};
t.prototype.setPokerRes = function(e, t) {
var n = Math.floor(t / 100), o = 4 - t % 100;
n > 15 && (n = 1);
var i = {
p0: "plist_puke_value_" + o % 2 + "_" + n,
h0: "plist_puke_color_small_" + o,
dh: "plist_puke_color_big_" + o
};
if ("kanpai" != e.name) {
var a = this.poker.getSpriteFrame("plist_puke_front_big");
e.getComponent(cc.Sprite).spriteFrame = a;
}
for (var r = 0, c = e.children; r < c.length; r++) {
var s = c[r];
if (i[s.name]) {
var l = this.poker.getSpriteFrame(i[s.name]);
s.getComponent(cc.Sprite).spriteFrame = l;
s.active = !0;
}
}
};
t.prototype.setPoker = function(e, t, n, o) {
var a = e.getChildByName("win").getComponent(cc.Label);
a.string = (o > 0 ? "+" : "") + wUtils.numConvert(o);
var r = o >= 0 ? 1 : 0;
"zj" == e.name ? a.font = this.font[r] : a.font = this.font[r + 2];
var c = e.getChildByName("poker");
if (c) {
for (var s = 0; s < t.length; s++) this.setPokerRes(c.children[s], t[s]);
var l = e.getChildByName("type");
wUIHelp.hideSonNode(l);
var d = null;
if (n.type) {
d = l.children[1];
var h = "Hlzz_result_px" + i.HLZZConfig.pokerType[n.type] + ".png";
d.getComponent(cc.Sprite).spriteFrame = this.resultImg.getSpriteFrame(h);
} else {
d = l.children[0];
h = "p" + n.num + ".png";
d.children[0].getComponent(cc.Sprite).spriteFrame = this.resultImg.getSpriteFrame(h);
}
d.active = !0;
}
};
__decorate([ c(cc.SpriteAtlas) ], t.prototype, "resultImg", void 0);
__decorate([ c(cc.SpriteAtlas) ], t.prototype, "poker", void 0);
__decorate([ c(cc.Font) ], t.prototype, "font", void 0);
return __decorate([ r ], t);
}(o.default);
n.default = s;
cc._RF.pop();
}, {
HLZZModel: "HLZZModel",
PopupBase: void 0
} ],
HLZZView: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "4f6fbsqHUdKmaafuFjIVfPZ", "HLZZView");
Object.defineProperty(n, "__esModule", {
value: !0
});
var o = e("NodePool"), i = e("HLZZModel"), a = cc._decorator, r = a.ccclass, c = a.property, s = function(e) {
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
t.cardList = [];
t.poker = null;
t.pokerType = null;
t.trendContent = null;
t.trendImg = [];
t.faPaiContent = null;
return t;
}
t.prototype.onLoad = function() {
wUIHelp.setHead(cc.find("bottom/info/head/head", this.node), wGameData.getKey("headimgurl"));
cc.find("bottom/info/name", this.node).getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 12);
this.setBtn_go_on(!1);
this.setBankerInfo(null);
this.initBetNum();
this.initMyBetNum();
this.initPoker();
var e = new cc.Node();
e.addComponent(cc.Sprite).spriteFrame = this.jetton.getSpriteFrame("c1000.png");
this.jettonPool = new o.default(e);
this.jettonPool.put(e);
};
t.prototype.playDice = function(e) {
var t = this, n = this.node.getChildByName("dice");
n.active = !0;
for (var o = 0; o < 2; o++) n.children[o].getComponent(cc.Animation).play("" + e[o]);
wAudioMgr.playSound("sound/drawsice", "HLZZ");
return new Promise(function(e) {
t.scheduleOnce(function() {
e(!0);
}, 1.3);
t.scheduleOnce(function() {
n.active = !1;
}, 2.3);
});
};
t.prototype.dealCards = function(e, t, n) {
return __awaiter(this, void 0, void 0, function() {
var o, i, a, r = this;
return __generator(this, function(c) {
switch (c.label) {
case 0:
wUIHelp.hideSonNode(this.faPaiContent, !0);
o = function(o) {
var a, c;
return __generator(this, function(s) {
switch (s.label) {
case 0:
a = function(a) {
var c, s, l, d, h, u, p, g, f, m, v, _;
return __generator(this, function(y) {
switch (y.label) {
case 0:
c = e;
(s = cc.find("table/poker" + e++ + "/card", i.node)).active = !0;
e > 3 && (e = 0);
l = s.children[o];
(d = wUtils.local_world__POS(s.children[0])).x += 44.5 * o;
d = wUtils.world_local_POS(i.faPaiContent, d);
h = i.faPaiContent.children["" + (4 * o + a)];
u = cc.moveTo(.15, cc.v2(106.5, -110));
p = cc.rotateTo(.06, 0);
g = cc.scaleTo(.1, l.scale);
f = cc.moveTo(.2, d);
m = cc.spawn(g, f);
v = cc.callFunc(function() {
var e = t[c][o];
r.setPokerRes(l, e);
if (o) r.scheduleOnce(function() {
h.active = !1;
r.CPAnim(l, n[c], e, c);
}, .8 + .2 * a); else {
h.active = !1;
l.active = !0;
}
});
_ = cc.sequence(u, p, m, v);
h.runAction(_);
wAudioMgr.playSound("sound/fapai", "HLZZ");
return [ 4, wUtils.syncDelayed(.3, i) ];

case 1:
y.sent();
return [ 2 ];
}
});
};
c = 0;
s.label = 1;

case 1:
return c < 4 ? [ 5, a(c) ] : [ 3, 4 ];

case 2:
s.sent();
s.label = 3;

case 3:
c++;
return [ 3, 1 ];

case 4:
return [ 2 ];
}
});
};
i = this;
a = 0;
c.label = 1;

case 1:
return a < 2 ? [ 5, o(a) ] : [ 3, 4 ];

case 2:
c.sent();
c.label = 3;

case 3:
a++;
return [ 3, 1 ];

case 4:
return [ 2 ];
}
});
});
};
t.prototype.CPAnim = function(e, t, n, o) {
return __awaiter(this, void 0, void 0, function() {
var i, a, r, c = this;
return __generator(this, function(s) {
switch (s.label) {
case 0:
i = cc.find("table/poker" + o, this.node);
a = cc.find("CP", i);
this.setPokerRes(a.children[1], n);
a.active = !0;
(r = a.getComponent(cc.Animation)).off("stop");
r.play("CPAnim");
r.on("stop", function() {
a.active = !1;
c.showPokerType(o, t, !0);
});
return [ 4, wUtils.syncDelayed(1, this) ];

case 1:
s.sent();
e.parent.getComponent(cc.Animation).play("showPoker");
return [ 2 ];
}
});
});
};
t.prototype.setPokerRes = function(e, t) {
var n = Math.floor(t / 100), o = 4 - t % 100;
n > 15 && (n = 1);
var i = {
p0: "plist_puke_value_" + o % 2 + "_" + n,
h0: "plist_puke_color_small_" + o,
dh: "plist_puke_color_big_" + o
};
if ("kanpai" != e.name) {
var a = this.poker.getSpriteFrame("plist_puke_front_big");
e.getComponent(cc.Sprite).spriteFrame = a;
}
for (var r = 0, c = e.children; r < c.length; r++) {
var s = c[r];
if (i[s.name]) {
var l = this.poker.getSpriteFrame(i[s.name]);
s.getComponent(cc.Sprite).spriteFrame = l;
s.active = !0;
}
}
};
t.prototype.openCard = function(e, t) {
var n = this;
wUIHelp.hideSonNode(this.faPaiContent);
var o = this.cardList, i = Object.values(t);
i.unshift(e);
for (var a = function(e) {
var t = o[e];
t.active = !0;
var a = JSON.parse(JSON.stringify(i[e].hands));
i[e].type > 1 && a.sort(function() {
return Math.random() - .5;
});
t.pokerData = i[e];
for (var r = function(e) {
if ("CP" == e.name) return "continue";
e.pokerID = a[e.name];
e.active = !0;
if ("4" != e.name) {
var t = cc.moveTo(.15, cc.v2(76, -44)), o = cc.callFunc(function() {
e.getComponent(cc.Sprite).spriteFrame = n.poker.getSpriteFrame("plist_puke_front_big");
n.setPokerRes(e, a[e.name]);
}), i = cc.moveTo(.15, e.spos), r = cc.sequence(t, o, i);
e.runAction(r);
}
}, c = 0, s = t.children; c < s.length; c++) r(s[c]);
}, r = 0; r < o.length; r++) a(r);
};
t.prototype.showPokerType = function(e, t, n) {
void 0 === n && (n = !1);
var o = cc.find("table/poker" + e + "/cardTypeBg", this.node);
o.active = !0;
wUIHelp.hideSonNode(o);
var a = null;
if (t.type) {
a = o.children[0];
var r = "Hlzz_result_pukepx" + i.HLZZConfig.pokerType[t.type] + ".png";
a.getComponent(cc.Sprite).spriteFrame = this.jetton.getSpriteFrame(r);
n && wAudioMgr.playSound("sound/type/" + t.type, "HLZZ");
} else {
(a = o.children[1]).children[0].getComponent(cc.Label).string = "" + t.num;
n && wAudioMgr.playSound("sound/type/" + t.num + "dian", "HLZZ");
}
a.active = !0;
};
t.prototype.initPoker = function() {
for (var e = 0, t = this.cardList; e < t.length; e++) {
var n = t[e];
wUIHelp.hideSonNode(n);
for (var o = 0, i = n.getChildByName("card").children; o < i.length; o++) {
(c = i[o]).active = !1;
c.getComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame("plist_puke_back_big_2");
wUIHelp.hideSonNode(c);
!c.spos && (c.spos = c.getPosition());
c.setPosition(c.spos);
}
}
for (var a = 0, r = this.faPaiContent.children; a < r.length; a++) {
var c;
(c = r[a]).active = !1;
c.scale = .27;
c.setPosition(22.5, -26);
}
for (var s = this.node.getChildByName("table"), l = 1; l < 7; l++) {
var d = s.getChildByName("" + l);
d.stopAllActions();
d.getChildByName("win").active = !1;
d.getChildByName("ani").active = !1;
}
};
t.prototype.initShowPoker = function(e) {
var t = this, n = this.node.getChildByName("table"), o = function(e, o, i) {
var a = n.getChildByName("poker" + e).children[0];
a.active = !0;
for (var r = 0; r < 2; r++) {
var c = a.children[r];
c.active = !0;
t.setPokerRes(c, o[r]);
}
t.showPokerType(e, i);
};
o(3, e.banber_card, e.banber_card_set);
for (var i = 1; i < 4; i++) {
var a = e.other[i];
o(i - 1, a.card, a.card_set);
}
};
t.prototype.playerBet = function(e, t) {
var n = cc.find("bottom/players", this.node).position, o = wUtils.local_world__POS(cc.find("table/" + t + "/dir", this.node));
(o = wUtils.world_local_POS(this.node, o)).x = wUtils.random(o.x - 128, o.x + 128);
o.y = wUtils.random(o.y - 40, o.y + 40);
this.jettonAni(n, o, e, t, 1);
};
t.prototype.myBet = function(e, t) {
var n = this.node.getChildByName("table"), o = i.HLZZConfig.chip.indexOf(t), a = wUtils.local_world__POS(cc.find("bottom/chip/" + o, this.node));
a = wUtils.world_local_POS(n, a);
var r = wUtils.local_world__POS(cc.find("table/" + e + "/dir", this.node));
(r = wUtils.world_local_POS(this.node, r)).x = wUtils.random(r.x - 128, r.x + 128);
r.y = wUtils.random(r.y - 40, r.y + 40);
this.jettonAni(a, r, t, e, 1);
};
t.prototype.bankerRecoveryChip = function(e) {
var t = this, n = {};
for (var o in e) e[o].gold_change < 0 && (n[o] = !0);
for (var i = null, a = [], r = 0, c = this.node.getChildByName("table").getChildByName("chip").children; r < c.length; r++) {
var s = c[r];
n[s.name] && a.push(s);
}
var l = cc.v2(-429.2, 312.4);
if (Object.keys(n).length) {
var d = cc.find("table/lz", this.node);
wAudioMgr.playSound("sound/getscore", "HLZZ");
var h = a.length / 30;
h < 1 && (h = 1);
this.schedule(function e() {
for (var n = function() {
var n = a.shift();
if (!n) {
t.unschedule(e);
d.getComponent(cc.ParticleSystem).stopSystem();
i();
return {
value: void 0
};
}
n.zIndex = 10;
var o = cc.moveTo(.3, l), r = cc.callFunc(function() {
t.jettonPool.put(n);
});
n.stopAllActions();
n.runAction(cc.sequence(o, r));
}, o = 0; o < h; o++) {
var r = n();
if ("object" == typeof r) return r.value;
}
}.bind(this), .01, 60, 0);
this.scheduleOnce(function() {
d.active = !0;
d.getComponent(cc.ParticleSystem).resetSystem();
}, .5);
} else this.scheduleOnce(function() {
i();
}, .5);
return new Promise(function(e) {
i = e;
});
};
t.prototype.bankerGiveChip = function(e, t) {
var n = this, o = !0, i = this.node.getChildByName("table"), a = cc.v2(-429.2, 312.4), r = function(r) {
var s = e[r].gold_change;
if (s <= 0) return "continue";
var l = t.maxScoreSplit(s);
if (l.length <= 0) return "continue";
o = !1;
var d = Math.ceil(l.length / 30), h = wUtils.local_world__POS(cc.find(r + "/dir", i));
h = wUtils.world_local_POS(c.node, h);
c.schedule(function e() {
for (var t = 0; t < d; t++) {
var o = l.shift();
if (!o) {
n.unschedule(e);
return;
}
var i = wUtils.random(h.x - 128, h.x + 128), c = wUtils.random(h.y - 40, h.y + 40);
n.jettonAni(a, cc.v2(i, c), o, r, 1);
}
}.bind(c), .01, 60, 0);
}, c = this;
for (var s in e) r(s);
var l = o ? .3 : .8;
o || wAudioMgr.playSound("sound/getscore", "HLZZ");
return new Promise(function(e) {
n.scheduleOnce(function() {
e(!0);
}, l);
});
};
t.prototype.chipFlyPlayer = function(e, t, n) {
for (var o = this, i = this.node.getChildByName("table"), a = {
1: [],
2: [],
3: [],
4: [],
5: [],
6: []
}, r = i.getChildByName("chip"), c = 0, s = r.children; c < s.length; c++) {
var l = s[c];
a[l.name].push(l);
}
var d = r, h = function(i) {
if (!e[i] || t[i].gold_change < 0) return "continue";
var r = cc.v2(-619.2, -314), c = n.maxScoreSplit(e[i] * (t[i].is_win ? 2 : 1)), s = a[i].splice(0, c.length);
if (s.length <= 0) return "continue";
var l = s.length / 20;
l < 1 && (l = 1);
u.schedule(function e() {
for (var t = function() {
var t = s.pop();
if (!t) {
o.unschedule(e);
return {
value: void 0
};
}
t.parent = d;
var n = cc.moveTo(.3, r), i = cc.delayTime(.01), a = cc.callFunc(function() {
o.scheduleOnce(function() {
o.jettonPool.put(t);
});
});
t.stopAllActions();
t.runAction(cc.sequence(n, i, a));
}, n = 0; n < l; n++) {
var i = t();
if ("object" == typeof i) return i.value;
}
}.bind(u), .01, 60, 0);
}, u = this;
for (var p in e) h(p);
var g = cc.find("bottom/players", this.node).getPosition(), f = function(e) {
var t = a[e];
if (t.length <= 0) return "continue";
var n = t.length / 30;
n < 1 && (n = 1);
m.schedule(function e() {
for (var i = function() {
var n = t.pop();
if (!n) {
o.unschedule(e);
return {
value: void 0
};
}
var i = cc.moveTo(.3, g), a = cc.callFunc(function() {
o.scheduleOnce(function() {
o.jettonPool.put(n);
});
});
n.stopAllActions();
n.runAction(cc.sequence(i, a));
}, a = 0; a < n; a++) {
var r = i();
if ("object" == typeof r) return r.value;
}
}.bind(m), .01, 60, 0);
}, m = this;
for (var v in a) f(v);
wAudioMgr.playSound("sound/getscore", "HLZZ");
this.scheduleOnce(function() {}, .6);
};
t.prototype.jettonAni = function(e, t, n, o, i) {
var a = this.node.getChildByName("table").getChildByName("chip"), r = this.jettonPool.getNode, c = this.jetton.getSpriteFrame("c" + n + ".png");
r.getComponent(cc.Sprite).spriteFrame = c;
r.stopAllActions();
r.setPosition(e);
var s = e.sub(t).mag() / 200 * .12;
r.active = !0;
a.addChild(r, i, "" + o);
var l = cc.moveTo(s, t).easing(cc.easeOut(2));
r.runAction(l);
};
t.prototype.showWin = function(e) {
var t = this.node.getChildByName("table"), n = function(n) {
if (!e[n].is_win) return "continue";
var o = t.getChildByName("" + n), i = o.getChildByName("win");
i.active = !0;
wUIHelp.playSpine(i, "animation", function() {
i.active = !1;
});
var a = o.getChildByName("ani"), r = cc.callFunc(function() {
a.active = !0;
}), c = cc.delayTime(.5), s = cc.callFunc(function() {
a.active = !1;
}), l = cc.repeatForever(cc.sequence(r, c.clone(), s, c));
o.runAction(l);
};
for (var o in e) n(o);
};
t.prototype.recoveryChip = function() {
var e = this.node.getChildByName("table").getChildByName("chip");
e.children.length && wLog.w("还有节点没有回收");
this.jettonPool.recoveryAll(e);
};
t.prototype.initMyBetNum = function() {
for (var e = 1; e < 7; e++) this.setMyBetNum(e, 0);
};
t.prototype.setMyBetNum = function(e, t) {
cc.find("table/" + e + "/mybet", this.node).getComponent(cc.Label).string = t ? wUtils.numConvert(t) : "";
};
t.prototype.setTotalBetNum = function(e, t) {
void 0 === t && (t = 0);
cc.find("table/layout/totalbet", this.node).getComponent(cc.Label).string = wUtils.numConvert(e);
var n = Math.floor(t);
n < 0 && (n = 0);
n = wUtils.numConvert(n);
cc.find("table/layout/leftbet", this.node).getComponent(cc.Label).string = "" + n;
};
t.prototype.initBetNum = function() {
for (var e = 1; e < 7; e++) this.setBetNum(e, 0);
};
t.prototype.setBetNum = function(e, t) {
cc.find("table/" + e + "/bet", this.node).getComponent(cc.Label).string = wUtils.numConvert(t);
};
t.prototype.setBtn_SZhuang = function(e) {
this.btn_SZhuang.active = e;
};
t.prototype.setBtn_XZhuang = function(e) {
this.btn_XZhuang.active = e;
};
t.prototype.selectChip = function(e) {
for (var t = 0, n = this.chipContent.children; t < n.length; t++) {
var o = n[t];
if (o.children[1].active && e != o.name) {
o.children[1].active = !1;
var i = o.children[0];
i.active = !0;
i.y = 10;
var a = cc.moveTo(.1, cc.v2(0, 0));
i.stopAllActions();
i.runAction(a);
}
}
var r = this.chipContent.children[e];
if (r && !r.children[1].active) {
var c = r.children[0];
c.active = !1;
c.y = 0;
(c = r.children[1]).active = !0;
c.y = 0;
var s = cc.moveTo(.1, cc.v2(0, 10));
c.stopAllActions();
c.runAction(s);
}
};
t.prototype.setBtn_Bank = function(e) {
this.btn_Bank.interactable = e;
};
t.prototype.chip_On_Off = function(e) {
for (var t = i.HLZZConfig.chip, n = 0, o = this.chipContent.children; n < o.length; n++) {
var a = o[n];
a.getComponent(cc.Button).interactable = e >= t[a.name];
if (e < t[a.name]) for (var r = 0, c = a.children; r < c.length; r++) {
var s = c[r];
s.stopAllActions();
s.setPosition(0, 0);
s.active = "img" == s.name;
}
}
};
t.prototype.setBtn_go_on = function(e) {
this.btn_go_on.interactable = e;
};
t.prototype.setTime = function(e, t, n) {
var o = cc.find("time/anim", this.node), i = cc.find("label", o).getComponent(cc.Label);
i.string = "" + e;
var a = this.node.getChildByName("time").getChildByName("type");
if (2 == t) {
a.getComponent(cc.Label).string = "下注时间";
if (e <= 5) {
wAudioMgr.playSound("sound/time_warning", "HLZZ");
o.getComponent(cc.Animation).play();
}
}
if (2 != t) if (e <= 3) {
a.getComponent(cc.Label).string = "空闲时间";
if (3 == e) {
this.initPoker();
this.recoveryChip();
this.initMyBetNum();
this.initBetNum();
this.setTotalBetNum(0);
n >= 10 && this.tipsBanker(0);
}
} else {
a.getComponent(cc.Label).string = "开牌时间";
i.string = "" + (e - 3);
}
};
t.prototype.setMyGold = function(e) {
cc.find("bottom/info/gold", this.node).getComponent(cc.Label).string = wUtils.numConvert(e);
};
t.prototype.setBankerInfo = function(e) {
var t = this.node.getChildByName("banker");
t.getChildByName("gold").getComponent(cc.Label).string = e ? wUtils.numConvert(e.gold) : "";
var n = e ? wUtils.handleNameLen(e.nickname, 12) : "";
e && e.uid == wGameData.getKey("uid") && (n = wUtils.handleNameLen(wGameData.getKey("nickname"), 12));
t.getChildByName("name").getComponent(cc.Label).string = n;
var o = cc.find("head/head", t);
o.active = e;
e && wUIHelp.setHead(o, e.headimgurl);
};
t.prototype.setBankerCircle = function(e) {
cc.find("banker/num", this.node).getComponent(cc.Label).string = "" + e;
};
t.prototype.upPlayerCpunt = function(e) {
cc.find("bottom/players/label", this.node).getComponent(cc.Label).string = "" + e;
};
t.prototype.stop_bet = function() {
var e = this.node.getChildByName("tips").getChildByName("stop");
wAudioMgr.playSound("sound/stop", "HLZZ");
e.active = !0;
e.opacity = 0;
e.stopAllActions();
var t = cc.fadeTo(.25, 255), n = cc.delayTime(.6), o = cc.fadeTo(.25, 0), i = cc.callFunc(function() {
e.active = !1;
}), a = cc.sequence(t, n, o, i);
e.runAction(a);
};
t.prototype.start_bet = function() {
var e = this.node.getChildByName("tips").getChildByName("start");
wAudioMgr.playSound("sound/start", "HLZZ");
e.active = !0;
e.opacity = 0;
e.stopAllActions();
var t = cc.fadeTo(.25, 255), n = cc.delayTime(.6), o = cc.fadeTo(.25, 0), i = cc.callFunc(function() {
e.active = !1;
}), a = cc.sequence(t, n, o, i);
e.runAction(a);
};
t.prototype.initChip = function(e, t) {
var n = this, o = this.node.getChildByName("table"), i = o.getChildByName("chip"), a = wUtils.local_world__POS(cc.find(t + "/dir", o));
a = wUtils.world_local_POS(this.node, a);
e.forEach(function(e) {
var o = n.jetton.getSpriteFrame("c" + e + ".png"), r = n.jettonPool.getNode;
r.getComponent(cc.Sprite).spriteFrame = o;
i.addChild(r, 1, "" + t);
r.active = !0;
var c = wUtils.random(a.x - 128, a.x + 128), s = wUtils.random(a.y - 40, a.y + 40);
r.setPosition(cc.v2(c, s));
});
};
t.prototype.tipsBanker = function() {
var e = this.node.getChildByName("tips").getChildByName("banker");
e.active = !0;
e.opacity = 0;
e.stopAllActions();
var t = cc.fadeTo(.25, 255), n = cc.delayTime(.6), o = cc.fadeTo(.25, 0), i = cc.callFunc(function() {
e.active = !1;
}), a = cc.sequence(t, n, o, i);
e.runAction(a);
};
t.prototype.upTrend = function(e) {
var t = this.trendContent.getComponent("Layout_z");
t._removeAllChildren();
for (var n = e.data.length, o = 0; o < n; o++) {
var i = [ e.data[o] ];
o == n - 1 && i.push(!0);
t._addClick(i, n - o);
}
var a = cc.find("records/bg", this.node), r = e.record;
for (var c in r) {
var s = r[c].reduce(function(e, t) {
return e + (1 == t ? 1 : 0);
}, 0), l = Math.floor(s / r[c].length * 100);
a.getChildByName(c).getComponent(cc.Label).string = l + "%";
}
};
t.prototype.upTrendItem = function(e, t) {
e.active = !0;
e.getChildByName("bg").active = t[1];
for (var n = 1; n < 4; n++) e.getChildByName("" + n).getComponent(cc.Sprite).spriteFrame = this.trendImg[Number(t[0][n])];
};
__decorate([ c(cc.Node) ], t.prototype, "btn_SZhuang", void 0);
__decorate([ c(cc.Node) ], t.prototype, "btn_XZhuang", void 0);
__decorate([ c(cc.Node) ], t.prototype, "chipContent", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btn_Bank", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btn_go_on", void 0);
__decorate([ c(cc.SpriteAtlas) ], t.prototype, "jetton", void 0);
__decorate([ c(cc.Node) ], t.prototype, "cardList", void 0);
__decorate([ c(cc.SpriteAtlas) ], t.prototype, "poker", void 0);
__decorate([ c(cc.SpriteAtlas) ], t.prototype, "pokerType", void 0);
__decorate([ c(cc.Node) ], t.prototype, "trendContent", void 0);
__decorate([ c([ cc.SpriteFrame ]) ], t.prototype, "trendImg", void 0);
__decorate([ c(cc.Node) ], t.prototype, "faPaiContent", void 0);
return __decorate([ r ], t);
}(cc.Component);
n.default = s;
cc._RF.pop();
}, {
HLZZModel: "HLZZModel",
NodePool: void 0
} ]
}, {}, [ "HLZZController", "HLZZLoad", "HLZZModel", "HLZZPlayerList", "HLZZResult", "HLZZView" ]);