window.__require = function e(t, i, o) {
function n(s, r) {
if (!i[s]) {
if (!t[s]) {
var l = s.split("/");
l = l[l.length - 1];
if (!t[l]) {
var c = "function" == typeof __require && __require;
if (!r && c) return c(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = l;
}
var d = i[s] = {
exports: {}
};
t[s][0].call(d.exports, function(e) {
return n(t[s][1][e] || e);
}, d, d.exports, e, t, i, o);
}
return i[s].exports;
}
for (var a = "function" == typeof __require && __require, s = 0; s < o.length; s++) n(o[s]);
return n;
}({
SDBControlle: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "0ca1dZNeNNCg4ccemjdMuVl", "SDBControlle");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("MultiBase"), n = e("SDBModel"), a = e("SDBView"), s = cc._decorator, r = s.ccclass;
s.property;
var l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.View = null;
t.Model = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.initProxy();
this.initNetWorkEvevt();
this.scheduleOnce(function() {
e.m_init();
});
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
this.Model = wUtils.creatorProxy(new n.SDBModel());
this.Model.onEvevt("gameState", function(t) {
e.View.setBtn_Bank(1 == t);
if (1 != t) {
e.View.chip_On_Off(0);
e.View.setBtn_go_on(!1);
} else e.Model.gold = e.Model.gold;
e.m_setBankBtn(1 == t);
});
this.Model.onEvevt("time", function(t) {
t = !t || t <= 0 ? 0 : t;
e.View.setTime(t || 0, e.Model.gameState);
e.Model.newTime = 0;
});
this.Model.onEvevt("gold", function(t) {
e.View.setMyGold(t);
e.Model.banker && wGameData.getKey("uid") != e.Model.banker.uid && 1 == e.Model.gameState && e.View.chip_On_Off(t);
var i = e.Model.lastbet;
1 == e.Model.gameState && i && e.Model.gold >= i && wGameData.getKey("uid") != e.Model.banker.uid ? e.View.setBtn_go_on(!0) : e.View.setBtn_go_on(!1);
if (t < n.SDBConfig.chip[e.Model.selectChip]) for (;n.SDBConfig.chip[--e.Model.selectChip] && !(t >= n.SDBConfig.chip[e.Model.selectChip]); ) ; else e.Model.selectChip = e.Model.selectChip;
});
this.Model.onEvevt("banker", function(t) {
if (t.uid == wGameData.getKey("uid")) {
e.View.chip_On_Off(0);
e.View.setBtn_go_on(!1);
}
e.View.upBankerShow(t);
});
this.Model.onEvevt("selectChip", function(t) {
e.View.selectChip(t);
});
this.Model.onEvevt("allnum", function(t) {
e.View.upPlayerCpunt(t);
});
this.Model.onEvevt("totalBet", function(t) {
e.View.setTotalBetNum(t);
var i = e.Model.banker.gold / 3 - t;
e.View.setSYBetNum(Math.floor(i));
});
this.Model.onEvevt("mybet", function(t) {
e.View.setMyBetNum(t);
});
};
t.prototype.initNetWorkEvevt = function() {
var e = this;
wGEvent.on("Msg_SDB_PlayerAct", function(t) {
1 == t.status ? e.Msg_SDB_PlayerAct(t.data) : wLog.e("玩家退出失败");
}, this);
wGEvent.on("Msg_SDB_Out", function(t) {
1 == t.status ? e.Msg_SDB_Out(t.data) : wLog.e("玩家退出失败");
}, this);
wGEvent.on("Msg_SDB_StageBet", function(t) {
1 == t.status ? e.Msg_SDB_StageBet(t.data) : wLog.e("玩家押注失败");
}, this);
wGEvent.on("Msg_SDB_StageEnd", function(t) {
1 == t.status ? e.Msg_SDB_StageEnd(t.data) : wLog.e("玩家开奖失败");
}, this);
wGEvent.on("Msg_SDB_ActBet", function(t) {
1 == t.status ? e.Msg_SDB_ActBet(t.data) : wLog.e("玩家下注失败");
}, this);
wGEvent.on("Msg_SDB_SysActBet", function(t) {
1 == t.status ? e.Msg_SDB_SysActBet(t.data) : wLog.e("桌面情况失败");
}, this);
wGEvent.on("Msg_SDB_BankerInfo", function(t) {
1 == t.status ? e.Msg_SDB_BankerInfo(t.data) : wLog.e("桌面情况失败");
}, this);
wGEvent.on("Msg_SDB_StageBankerCards", function(t) {
1 == t.status ? e.Msg_SDB_StageBankerCards(t.data) : wLog.e("桌面情况失败");
}, this);
wGEvent.on("Msg_SDB_StagePlayerCards", function(t) {
1 == t.status ? e.Msg_SDB_StagePlayerCards(t.data) : wLog.e("桌面情况失败");
}, this);
wGEvent.on("Msg_SDB_BuyCards", function(t) {
1 == t.status ? e.Msg_SDB_BuyCards(t.data) : wLog.e("桌面情况失败");
}, this);
wGEvent.on("Msg_SDB_ToBanker", function(t) {
1 == t.status ? e.Msg_SDB_ToBanker(t.data) : wLog.e("桌面情况失败");
}, this);
};
t.prototype.m_roomInfo = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i;
return __generator(this, function() {
this.Model.initRoom(JSON.parse(JSON.stringify(e)));
this.View.initPlayerList(e.players);
t = wGameData.getKey("uid");
this.Model.banker.uid == t || e.list.includes(t) ? this.View.showSX_Banekr_Btn("xz", !0) : this.View.showSX_Banekr_Btn("xz", !1);
if (4 == this.Model.gameState) {
this.Model.lastbet = e.mybet;
return [ 2 ];
}
this.Model.mybet = e.mybet;
this.Model.totalBet = e.allbet;
this.View.initAllChip(this.Model.scoreSplit(e.allbet - e.mybet));
this.View.initMyChip(this.Model.scoreSplit(e.mybet));
this.Model.bankerPoker = e.banker_cards || [];
this.Model.myPoker = e.self_cards;
if (2 == this.Model.gameState) if (this.Model.banker.uid == wGameData.getKey("uid")) {
this.View.initPlayerPoker(e.self_cards);
i = this.Model.getPID(e.self_cards);
this.View.showPokerType(e.self_cards, 1, i);
this.View.showCZBtn(i < 10.5 && e.self_cards.length < 5);
} else if (e.self_cards.length) {
this.View.initBankerPoker(e.banker.cards_num);
this.View.initPlayerPoker(e.self_cards);
} else this.View.initBankerPoker(e.banker.cards_num); else if (3 == this.Model.gameState) if (this.Model.banker.uid == wGameData.getKey("uid")) {
this.View.initPlayerPoker(e.self_cards);
this.View.showPokerType(e.self_cards, 1, this.Model.getPID(e.self_cards));
} else if (e.self_cards.length) {
this.View.initBankerPoker(e.banker.cards_num);
this.View.initPlayerPoker(e.self_cards);
i = this.Model.getPID(e.self_cards);
this.View.showCZBtn(i < 10.5 && e.self_cards.length < 5);
} else this.View.initBankerPoker(e.banker.cards_num);
return [ 2 ];
});
});
};
t.prototype.Msg_SDB_StageBet = function(e) {
wAudioMgr.playSound("sound/START_W", "SDB");
this.Model.mybet = 0;
this.Model.bankerPoker = [];
this.Model.myPoker = [];
this.Model.gold = this.Model.gold;
this.View.closeResult();
this.ininStart();
this.View.start_bet();
this.Model.gameState = 1;
this.Model.time = e.time;
this.View.initPlayerList(e.players);
this.Model.banker.circle++;
this.View.setBankerNum(this.Model.banker.circle);
};
t.prototype.ininStart = function() {
this.View.initPoker();
this.View.recoveryChip();
this.Model.initDesktop();
this.View.initBetNum();
this.Model.totalBet = 0;
};
t.prototype.Msg_SDB_ActBet = function(e) {
this.Model.gold -= e.gold;
this.Model.mybet += e.gold;
this.View.myBet(e.gold);
this.View.setBankerNum(this.Model.banker.circle);
};
t.prototype.Msg_SDB_SysActBet = function(e) {
this.unscheduleAllCallbacks();
this.Model.jettonList.length = 0;
for (var t = e.allbets - this.Model.totalBet, i = 0, o = this.Model.scoreSplit(t); i < o.length; i++) {
var n = o[i];
this.Model.jettonList.push(n);
}
this.initFhip();
};
t.prototype.initFhip = function() {
var e = this;
if (!(this.Model.jettonList.length <= 0)) {
this.Model.jettonList.sort(function() {
return Math.random() > .5 ? -1 : 1;
});
var t = (this.Model.time > 2 ? 2 : .5) / this.Model.jettonList.length;
this.schedule(function() {
e.launchFhip();
}, t);
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
this.View.playerBet(t);
if (this.Model.jettonSound) {
this.Model.jettonSound = !1;
wAudioMgr.playSound("sound/Add_score", "SDB");
}
}
this.Model.totalBet += t;
} else this.unscheduleAllCallbacks();
};
t.prototype.Msg_SDB_BankerInfo = function(e) {
this.Model.banker = e;
var t = this.Model.applyNum.indexOf(Number(e.uid));
-1 != t && this.Model.applyNum.splice(t, 1);
var i = wGameData.getKey("uid");
this.Model.banker.uid == i || this.Model.applyNum.includes(i) ? this.View.showSX_Banekr_Btn("xz", !0) : this.View.showSX_Banekr_Btn("xz", !1);
wUIManager.showTips("轮换庄家", wUIManager.TIPS_WHITE);
};
t.prototype.Msg_SDB_StageBankerCards = function(e) {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(t) {
switch (t.label) {
case 0:
wAudioMgr.playSound("sound/STOW_W", "SDB");
this.Model.gameState = 2;
this.Model.time = e.time;
this.Model.selectChip = -1;
this.launchAllChip();
this.Model.bankerPoker.push(e.pid);
e.self_cards && this.Model.myPoker.push(e.self_cards);
if (this.Model.banker.uid != wGameData.getKey("uid")) return [ 3, 1 ];
this.View.playerFPAnim(e.pid, 1);
this.View.showCZBtn(!0);
return [ 3, 4 ];

case 1:
if (!e.self_cards) return [ 3, 3 ];
this.View.bankerFPAnim(1);
return [ 4, wUtils.syncDelayed(.05, this) ];

case 2:
t.sent();
this.View.playerFPAnim(e.self_cards, 1);
return [ 3, 4 ];

case 3:
this.View.bankerFPAnim(1);
t.label = 4;

case 4:
return [ 2 ];
}
});
});
};
t.prototype.Msg_SDB_StagePlayerCards = function(e) {
this.Model.gameState = 3;
this.Model.time = e.time;
this.View.showCZBtn(this.Model.myPoker.length);
};
t.prototype.Msg_SDB_BuyCards = function(e) {
var t = this;
if (2 == this.Model.gameState) {
this.Model.bankerPoker.push(e.pid);
var i = this.Model.bankerPoker.length;
if (this.Model.banker.uid == wGameData.getKey("uid")) {
this.View.playerFPAnim(e.pid, i);
if (i >= 5 || this.Model.getPID(this.Model.bankerPoker) > 10.5) {
this.View.showCZBtn(!1);
this.scheduleOnce(function() {
t.View.showPokerType(t.Model.bankerPoker, 1, t.Model.getPID(t.Model.bankerPoker));
}, 1);
}
} else this.View.bankerFPAnim(i);
} else if (3 == this.Model.gameState) {
this.Model.myPoker.push(e.pid);
i = this.Model.myPoker.length;
this.View.playerFPAnim(e.pid, i);
if (i >= 5 || this.Model.getPID(this.Model.myPoker) > 10.5) {
this.View.showCZBtn(!1);
this.scheduleOnce(function() {
t.View.showPokerType(t.Model.myPoker, 1, t.Model.getPID(t.Model.myPoker));
}, 1);
}
} else wLog.e("------------错误产生");
};
t.prototype.Msg_SDB_ToBanker = function(e) {
this.Model.applyNum = e.list;
this.Model.applyNum.includes(wGameData.getKey("uid")) ? this.View.showSX_Banekr_Btn("xz", !0) : this.View.showSX_Banekr_Btn("xz", !1);
};
t.prototype.Msg_SDB_StageEnd = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o = this;
return __generator(this, function(n) {
switch (n.label) {
case 0:
this.unscheduleAllCallbacks();
this.Model.gameState = 4;
this.Model.time = e.time;
this.View.showCZBtn(!1);
this.Model.lastbet = this.Model.mybet;
if (e.self_cards.length) {
this.View.showPlayerPoker(e.self_cards, 1);
this.View.showPokerType(e.self_cards, 1, this.Model.getPID(e.self_cards));
}
this.View.showPlayerPoker(e.banker_cards, 0);
this.View.showPokerType(e.banker_cards, 0, this.Model.getPID(e.banker_cards));
this.scheduleOnce(function() {
o.playPokerSound(e.banker_cards, e.self_cards);
}, .2);
t = this.Model.scoreSplit(Math.abs(e.bankerwin));
return e.bankerwin > 0 ? [ 4, this.View.bankerRecoveryChip(t, e.self_win, this.Model.getTSPoker(e.banker_cards)) ] : [ 3, 2 ];

case 1:
n.sent();
return [ 3, 4 ];

case 2:
if (!(e.bankerwin < 0)) return [ 3, 4 ];
i = [];
e.self_win > 0 && (i = this.Model.scoreSplit(this.Model.mybet));
return [ 4, this.View.bankerGiveChip(t, i) ];

case 3:
n.sent();
n.label = 4;

case 4:
return [ 4, this.View.chipFlyPlayer() ];

case 5:
n.sent();
e.bankerwin < 0 && this.View.showPlayerWin(Math.abs(e.bankerwin));
e.self_win > 0 && this.View.showMyWin(e.self_win);
return [ 4, wUtils.syncDelayed(.5, this) ];

case 6:
n.sent();
this.Model.gold = e.gold;
this.Model.banker.gold += e.bankerwin;
this.View.upBankGold(this.Model.banker.gold);
this.View.showResult(e, this.Model);
return [ 2 ];
}
});
});
};
t.prototype.playPokerSound = function(e, t) {
var i = this, o = function(e) {
var t = i.Model.getPID(e);
if (10.5 == t && 5 == e.length) return "11b";
if (t < 10.5 && 5 == e.length) return "11a";
if (t > 10.5) return "0a";
var o = Math.floor(t);
return o + (o == t ? "a" : "b");
}, n = "sound/cardTypeSound/Z_sdbJsPx_" + o(e);
wAudioMgr.playSound(n, "SDB");
t && t.length > 0 && this.scheduleOnce(function() {
var t = "sound/cardTypeSound/X_sdbJsPx_" + o(e);
wAudioMgr.playSound(t, "SDB");
}, 1.3);
};
t.prototype.launchAllChip = function() {
var e = this;
this.unscheduleAllCallbacks();
if (this.Model.jettonList.length) {
for (var t = {}, i = 0, o = this.Model.jettonList; i < o.length; i++) {
var n = o[i], a = n[1];
!t[a] && (t[a] = 0);
t[a] += n[0];
}
this.Model.jettonList.length = 0;
var s = function(i) {
var o = t[i];
r.Model.maxScoreSplit(o).forEach(function(t) {
e.Model.jettonList.push([ t, i ]);
});
}, r = this;
for (var a in t) s(a);
wAudioMgr.playSound("sound/Add_score", "SDB");
for (;this.Model.jettonList.length; ) this.launchFhip(!1);
}
};
t.prototype.onClick = function(e, t) {
switch (t) {
case "closeResult":
wAudioMgr.playCloseSound();
this.View.closeResult();
return;

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
return;

case "0":
case "1":
case "2":
case "3":
case "4":
case "5":
case "6":
this.Model.selectChip = t;
this.playerBet();
return;

case "playerlist":
wViewMgr.openPage({
path: "prefab/SDBPlayerList",
bundle: "SDB"
});
break;

case "yp":
wNetWork.send("Msg_SDB_BuyCards", {});
break;

case "tp":
this.View.showCZBtn(!1);
this.Model.banker.uid == wGameData.getKey("uid") ? this.View.showPokerType(this.Model.bankerPoker, 1, this.Model.getPID(this.Model.bankerPoker)) : this.View.showPokerType(this.Model.myPoker, 1, this.Model.getPID(this.Model.myPoker));
wAudioMgr.playCloseSound();
break;

case "sz":
if (wGameData.getKey("gold") < 5e7) {
wUIManager.showConfirmUI({
content: "您的欢乐豆不足，无法上庄\n上庄条件：5000万欢乐豆",
title: "系统提示"
});
break;
}
wNetWork.send("Msg_SDB_ToBanker", {
stage: 1
});
wUIManager.showTips("上庄申请成功", wUIManager.TIPS_WHITE);
break;

case "xz":
wNetWork.send("Msg_SDB_ToBanker", {
stage: 0
});
wUIManager.showTips("下庄申请成功", wUIManager.TIPS_WHITE);
}
wAudioMgr.playBtnSound();
};
t.prototype.playerBet = function() {
if (1 == this.Model.gameState && -1 != this.Model.selectChip) {
wAudioMgr.playSound("sound/Add_score", "SDB");
wNetWork.send("Msg_SDB_ActBet", {
gold: n.SDBConfig.chip[this.Model.selectChip]
});
}
};
t.prototype.lastBet = function() {
if (1 == this.Model.gameState) {
for (var e = this.Model.lastbet, t = !1, i = 0, o = this.Model.maxScoreSplit(e); i < o.length; i++) {
var n = o[i];
if (n) {
wNetWork.send("Msg_SDB_ActBet", {
gold: n
});
t = !0;
}
}
if (t) {
this.View.setBtn_go_on(!1);
this.Model.lastbet = null;
}
}
};
t.prototype.m_upGameGold = function() {
this.Model.gold = wGameData.getKey("gold");
};
t.prototype.m_NetWorkState = function() {};
t.prototype.Msg_SDB_PlayerAct = function() {
++this.Model.allnum;
};
t.prototype.Msg_SDB_Out = function(e) {
e.uid != wGameData.getKey("uid") && --this.Model.allnum;
};
return __decorate([ r ], t);
}(o.default);
i.default = l;
cc._RF.pop();
}, {
MultiBase: void 0,
SDBModel: "SDBModel",
SDBView: "SDBView"
} ],
SDBLoad: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "ead75R5j8lOAa9L9LdAprDL", "SDBLoad");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("Config"), n = cc._decorator, a = n.ccclass;
n.property;
var s = function(e) {
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
i.default = s;
cc._RF.pop();
}, {
Config: void 0
} ],
SDBModel: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "5c330kQtkVHtK7xZWioV2SD", "SDBModel");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.SDBModel = i.SDBConfig = void 0;
i.SDBConfig = {
chip: [ 100, 1e3, 1e4, 1e5, 1e6, 5e6, 1e7 ]
};
var o = function() {
function e() {
this.gameState = 1;
this.time = 0;
this.newTime = 0;
this.banker = {};
this.allnum = 0;
this.jettonSound = !0;
this.jettonList = [];
this.totalBet = 0;
this.lastbet = 0;
this.selectChip = -1;
this.mybet = 0;
this.bankerturn = !1;
this.bankerPoker = [];
this.myPoker = [];
}
e.prototype.initRoom = function(e) {
this.allnum = e.allnum;
this.banker = e.banker;
this.gold = wGameData.getKey("gold");
this.gameState = e.stage;
this.time = e.time;
this.applyNum = e.list;
};
e.prototype.initDesktop = function() {
this.jettonList = [];
this.totalBet = 0;
};
e.prototype.scoreSplit = function(e) {
for (var t = []; ;) {
for (var o = 0, n = 7; n > -1; n--) if (e > i.SDBConfig.chip[n]) {
o = n;
break;
}
if (o < 1) {
for (;e > 0; ) {
t.push(100);
e -= 100;
}
break;
}
var a = o - 1 > -1 ? o - 1 : 0, s = i.SDBConfig.chip[wUtils.random(a, o)];
t.push(s);
e -= s;
}
return t;
};
e.prototype.maxScoreSplit = function(e) {
for (var t = [], o = 7; o > -1; o--) for (var n = i.SDBConfig.chip[o]; e >= n; ) {
t.push(n);
e -= n;
}
return t;
};
e.prototype.getPID = function(e) {
for (var t = 0, i = 0, o = e; i < o.length; i++) {
var n = o[i], a = Math.floor(n / 100);
t += a <= 10 ? a : .5;
}
return t;
};
e.prototype.getTSPoker = function(e) {
var t = this.getPID(e);
return 10.5 == t && 5 == e.length || t < 10.5 && 5 == e.length || 10.5 == t;
};
return e;
}();
i.SDBModel = o;
cc._RF.pop();
}, {} ],
SDBPlayerList: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "53e190JixBD34rqVB1vQTTt", "SDBPlayerList");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("PopupBase"), n = cc._decorator, a = n.ccclass, s = n.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
return t;
}
t.prototype.onLoad = function() {
var e = this;
wUtils.sendMsg("Msg_SDB_GetUserList", {}, this).then(function(t) {
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
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ a ], t);
}(o.default);
i.default = r;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
SDBView: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "7e6944iOudJZ4RMZaWve/oj", "SDBView");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("NodePool"), n = e("SDBModel"), a = cc._decorator, s = a.ccclass, r = a.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.chipContent = null;
t.btn_Bank = null;
t.btn_go_on = null;
t.jettonPool = null;
t.jettonImg = null;
t.poker = null;
t.selectChipImg = [];
t.dsImg = null;
t.sdbJxPxImg = null;
t.resultFont = [];
t.createdNodeArr = [];
t.trendList = [];
t.pidList = [];
return t;
}
t.prototype.onLoad = function() {
var e = wUtils.handleNameLen(wGameData.getKey("nickname"), 8);
cc.find("bottom/player/name", this.node).getComponent(cc.Label).string = e;
var t = cc.find("bottom/player/head/head", this.node);
wUIHelp.setHead(t, wGameData.getKey("headimgurl"));
this.setBtn_go_on(!1);
this.initBetNum();
this.setTotalBetNum(0);
var i = new cc.Node();
i.addComponent(cc.Sprite);
this.jettonPool = new o.default(i);
this.jettonPool.put(i);
};
t.prototype.initBetNum = function() {
this.setTotalBetNum(0);
this.setMyBetNum(0);
};
t.prototype.setSYBetNum = function(e) {
this.node.getChildByName("table").getChildByName("syxz").getComponent(cc.Label).string = e ? wUtils.numConvert(e) : "0";
};
t.prototype.setMyBetNum = function(e) {
this.node.getChildByName("table").getChildByName("mybet").getComponent(cc.Label).string = e ? wUtils.numConvert(e) : "";
};
t.prototype.setBankerNum = function(e) {
this.node.getChildByName("table").getChildByName("lz").getComponent(cc.Label).string = "" + e;
};
t.prototype.setTotalBetNum = function(e) {
this.node.getChildByName("table").getChildByName("totalbet").getComponent(cc.Label).string = e ? wUtils.numConvert(e) : "0";
};
t.prototype.upPlayerCpunt = function(e) {
cc.find("players/label", this.node).getComponent(cc.Label).string = "" + e;
};
t.prototype.setMyGold = function(e) {
cc.find("bottom/player/gold", this.node).getComponent(cc.Label).string = wUtils.goldFormat(e, 2, 1);
};
t.prototype.setBtn_go_on = function(e) {
this.btn_go_on.interactable = e;
};
t.prototype.upBankerShow = function(e) {
var t = this.node.getChildByName("banker"), i = e.uid == wGameData.getKey("uid") ? wUtils.handleNameLen(e.nickname, 8) : e.username;
t.getChildByName("name").getComponent(cc.Label).string = i;
this.upBankGold(e.gold);
wUIHelp.setHead(cc.find("head/head", t), e.headimgurl);
this.setBankerNum(e.circle);
};
t.prototype.upBankGold = function(e) {
cc.find("banker/gold", this.node).getComponent(cc.Label).string = wUtils.goldFormat(e, 2, 1);
};
t.prototype.initAllChip = function(e) {
var t = this, i = this.node.getChildByName("table"), o = i.getChildByName("chip");
e.forEach(function(e) {
var n = "Sdb_Battle_Xcm" + e, a = t.jettonImg.getSpriteFrame(n), s = t.jettonPool.getNode;
s.getComponent(cc.Sprite).spriteFrame = a;
o.addChild(s, 1);
s.active = !0;
var r = wUtils.random(0, 1), l = i.getChildByName("" + r), c = wUtils.world_local_POS(i, wUtils.local_world__POS(l)), d = l.width / 2, h = l.height / 2, u = wUtils.random(c.x - d, c.x + d), p = wUtils.random(c.y - h, c.y + h);
s.setPosition(cc.v2(u, p));
});
};
t.prototype.initMyChip = function(e) {
var t = this, i = this.node.getChildByName("table"), o = i.getChildByName("chip"), n = i.getChildByName("2"), a = wUtils.world_local_POS(i, wUtils.local_world__POS(n)), s = n.width / 2, r = n.height / 2;
e.forEach(function(e) {
var i = "Sdb_Battle_Xcm" + e, n = t.jettonImg.getSpriteFrame(i), l = t.jettonPool.getNode;
l.getComponent(cc.Sprite).spriteFrame = n;
o.addChild(l, 1);
l.active = !0;
var c = wUtils.random(a.x - s, a.x + s), d = wUtils.random(a.y - r, a.y + r);
l.setPosition(cc.v2(c, d));
});
};
t.prototype.recoveryChip = function() {
var e = this.node.getChildByName("table").getChildByName("chip");
e.children.length && wLog.w("还有节点没有回收");
this.jettonPool.recoveryAll(e);
};
t.prototype.setTime = function(e, t) {
var i = cc.find("time/anim", this.node), o = cc.find("label", i).getComponent(cc.Label);
o.string = "" + e;
var n = cc.find("time/type", this.node).getComponent(cc.Label);
if (4 != t && e <= 5) {
i.getComponent(cc.Animation).play();
wAudioMgr.playSound("sound/TIME_WARIMG", "SDB");
}
if (4 == t) if (e <= 3) {
this.initPoker();
this.recoveryChip();
this.initBetNum();
n.string = "空闲时间";
} else {
n.string = "结算时间";
o.string = "" + (e - 3);
} else 3 == t ? n.string = "闲家要牌" : 2 == t ? n.string = "庄家要牌" : 1 == t && (n.string = "下注时间");
};
t.prototype.start_bet = function() {
var e = cc.find("tips", this.node);
e.active = !0;
e.opacity = 0;
var t = cc.fadeIn(.25), i = cc.delayTime(.5), o = cc.fadeOut(.25), n = cc.callFunc(function() {
e.active = !1;
}), a = cc.sequence(t, i, o, n);
e.runAction(a);
};
t.prototype.initPoker = function() {
for (var e = this, t = function(t) {
for (var i = 0, o = t.children; i < o.length; i++) {
var n = o[i];
n.active = !1;
n.getComponent(cc.Sprite).spriteFrame = e.poker.getSpriteFrame("plist_puke_back_big_2");
wUIHelp.hideSonNode(n);
}
}, i = this.node.getChildByName("poker"), o = 0; o < 2; o++) {
t(i.getChildByName("poker" + o));
i.getChildByName("type" + o).active = !1;
}
};
t.prototype.myBet = function(e) {
var t = this.node.getChildByName("table"), i = n.SDBConfig.chip.indexOf(e), o = wUtils.local_world__POS(cc.find("bottom/chip/" + i, this.node));
o = wUtils.world_local_POS(t, o);
var a = t.getChildByName("2"), s = wUtils.world_local_POS(t, wUtils.local_world__POS(a)), r = a.width / 2, l = a.height / 2;
s.x = wUtils.random(s.x - r, s.x + r);
s.y = wUtils.random(s.y - l, s.y + l);
this.jettonAni(o, s, e, 2, 1);
};
t.prototype.playerBet = function(e) {
var t = wUtils.random(0, 1), i = this.node.getChildByName("players").getPosition(), o = this.node.getChildByName("table"), n = o.getChildByName("" + t), a = wUtils.world_local_POS(o, wUtils.local_world__POS(n)), s = n.width / 2, r = n.height / 2;
a.x = wUtils.random(a.x - s, a.x + s);
a.y = wUtils.random(a.y - r, a.y + r);
this.jettonAni(i, a, e, t, 1);
};
t.prototype.jettonAni = function(e, t, i, o, n) {
var a = this.node.getChildByName("table").getChildByName("chip"), s = this.jettonPool.getNode, r = "Sdb_Battle_Xcm" + i, l = this.jettonImg.getSpriteFrame(r);
s.getComponent(cc.Sprite).spriteFrame = l;
s.stopAllActions();
s.setPosition(e);
s.active = !0;
a.addChild(s, -n, "" + o);
var c = cc.moveTo(.25, t).easing(cc.easeOut(1.5));
s.runAction(c);
};
t.prototype.getLayoutPos = function(e, t) {
for (var i = t ? 61.5 : 58, o = (104 * e - (e - 1) * i) / -2, n = [], a = 0; a < e; a++) {
var s = o + 52 + 104 * a - a * i;
n.push(s);
}
return n;
};
t.prototype.initBankerPoker = function(e) {
var t = this.getLayoutPos(e, 0), i = cc.find("poker/poker0", this.node), o = wUtils.local_world__POS(this.node);
o = wUtils.world_local_POS(i, o);
for (var n = 0; n < e; n++) {
var a = i.children[n];
a.active = !0;
a.x = t[n];
}
};
t.prototype.bankerFPAnim = function(e) {
var t = this;
if (this.pidList.length) this.pidList.push(e); else {
this.pidList.push(e);
(function e(i) {
wAudioMgr.playSound("sound/send_card", "SDB");
var o = t.getLayoutPos(i, 0), n = cc.find("poker/poker0", t.node), a = wUtils.local_world__POS(t.node);
a = wUtils.world_local_POS(n, a);
for (var s = function(s) {
var r = n.children[s];
r.active = !0;
var l = cc.moveTo(.15, cc.v2(o[s], 0)), c = cc.callFunc(function() {
if (0 == s) {
t.pidList.shift();
t.pidList.length && e(t.pidList[0]);
}
});
if (s <= i - 2) r.runAction(cc.sequence(l, c)); else {
r.setPosition(a);
r.scale = .5;
var d = cc.scaleTo(.15, 1), h = cc.sequence(cc.spawn(l, d), c);
r.runAction(h);
}
}, r = 0; r < i; r++) s(r);
})(e);
}
};
t.prototype.playerFPAnim = function(e, t) {
var i = this;
wAudioMgr.playSound("sound/send_card", "SDB");
var o = this.getLayoutPos(t, 1), n = cc.find("poker/poker1", this.node), a = wUtils.local_world__POS(this.node);
a = wUtils.world_local_POS(n, a);
for (var s = function(s) {
var l = n.children[s];
l.active = !0;
l.stopAllActions();
var c = cc.moveTo(.15, cc.v2(o[s], 0));
if (s <= t - 2) {
r.setNodePoker(l, l.pid);
l.angle = 0;
l.scale = 1;
l.runAction(c);
} else {
l.pid = e;
l.setPosition(a);
l.scale = .5;
var d = cc.scaleTo(.15, 1), h = cc.callFunc(function() {
1 == t || t - 1 != s ? i.setNodePoker(l, e) : i.CPAnim(l, e);
}), u = cc.sequence(cc.spawn(c, d), h);
l.runAction(u);
}
}, r = this, l = 0; l < t; l++) s(l);
};
t.prototype.initPlayerPoker = function(e) {
for (var t = this.getLayoutPos(e.length, 1), i = cc.find("poker/poker1", this.node), o = 0; o < e.length; o++) {
var n = i.children[o];
n.pid = e[o];
n.active = !0;
this.setNodePoker(n, e[o]);
n.x = t[o];
}
};
t.prototype.CPAnim = function(e, t) {
var i = this, o = cc.find("poker/CP", this.node), n = cc.rotateTo(.15, -90), a = cc.callFunc(function() {
return __awaiter(i, void 0, void 0, function() {
var i, n, a;
return __generator(this, function(s) {
switch (s.label) {
case 0:
i = wUtils.local_world__POS(e);
i = wUtils.world_local_POS(o.parent, i);
e.active = !1;
o.active = !0;
o.x = i.x;
(n = o.getComponent(cc.Animation)).off("stop");
n.play("CPAnim");
n.on("stop", function() {
o.active = !1;
e.active = !0;
e.angle = 0;
});
a = o.getChildByName("kanpai");
wUIHelp.hideSonNode(a);
this.setNodePoker(a, t);
return [ 4, wUtils.syncDelayed(.8, this) ];

case 1:
s.sent();
this.setNodePoker(e, t);
e.active = !0;
e.angle = 0;
return [ 2 ];
}
});
});
}), s = cc.sequence(n, a);
e.runAction(s);
};
t.prototype.setNodePoker = function(e, t) {
var i = e.getComponent(cc.Sprite);
i && (i.spriteFrame = this.poker.getSpriteFrame("plist_puke_front_big"));
var o = Math.floor(t / 100), n = t % 100 - 1;
if (o < 14) for (var a = {
p0: "plist_puke_value_" + n % 2 + "_" + o,
h0: "plist_puke_color_small_" + n,
dh: "plist_puke_color_big_" + n
}, s = 0, r = e.children; s < r.length; s++) {
var l = r[s];
if (a[l.name]) {
var c = this.poker.getSpriteFrame(a[l.name]);
l.getComponent(cc.Sprite).spriteFrame = c;
l.active = !0;
}
} else if (16 == o) {
var d = e.getChildByName("w");
d.active = !0;
var h = "plist_puke_joker_big_" + (1 == n ? 0 : 1);
d.getComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame(h);
} else wLog.e("牌型出问题了");
};
t.prototype.showCZBtn = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o, n, a, s, r, l;
return __generator(this, function(c) {
switch (c.label) {
case 0:
t = this.node.getChildByName("btn");
if (!e) return [ 3, 1 ];
if (t.active) return [ 2 ];
t.active = !0;
i = [ -210, 210 ];
o = 0;
for (n = t.children; o < n.length; o++) {
(r = n[o]).x = 0;
l = cc.moveTo(.15, cc.v2(i.shift(), -130));
r.runAction(l);
}
return [ 3, 3 ];

case 1:
if (!t.active) return [ 2 ];
a = 0;
for (s = t.children; a < s.length; a++) {
r = s[a];
l = cc.moveTo(.15, cc.v2(0, -130));
r.runAction(l);
}
return [ 4, wUtils.syncDelayed(.15, this) ];

case 2:
c.sent();
t.active = !1;
c.label = 3;

case 3:
return [ 2 ];
}
});
});
};
t.prototype.showSX_Banekr_Btn = function(e, t) {
for (var i = 0, o = this.node.getChildByName("btn_banker").children; i < o.length; i++) {
var n = o[i];
n.name == e ? n.active = t : n.active = !t;
}
};
t.prototype.showPokerType = function(e, t, i, o) {
void 0 === o && (o = !0);
var n = cc.find("poker/type" + t, this.node);
if (!n.active) {
n.active = !0;
wUIHelp.hideSonNode(n);
var a = null;
if (10.5 == i && 5 == e.length) a = n.getChildByName("whj"); else if (i < 10.5 && 5 == e.length) a = n.getChildByName("wxj"); else if (.5 == i) a = n.getChildByName("bd"); else if (i <= 10.5) {
a = n.getChildByName("ds");
Math.ceil(i) == i ? a.getChildByName("b").active = !1 : a.getChildByName("b").active = !0;
var s = Math.floor(i);
a.getChildByName("n").getComponent(cc.Sprite).spriteFrame = this.dsImg.getSpriteFrame("Effect_" + s + ".png");
} else a = n.getChildByName("bp");
a.active = !0;
if (o) {
a.scale = 1;
!a.spos && (a.spos = a.getPosition());
a.y -= 70;
var r = cc.moveTo(.15, a.spos), l = cc.delayTime(.3), c = cc.scaleTo(.15, .6), d = cc.sequence(r, l, c);
a.runAction(d);
} else a.scale = .6;
}
};
t.prototype.showPlayerPoker = function(e, t) {
var i = this.getLayoutPos(e.length, t), o = cc.find("poker/poker" + t, this.node);
wUIHelp.hideSonNode(o);
for (var n = 0; n < e.length; n++) {
var a = o.children[n];
a.active = !0;
a.setPosition(cc.v2(i[n], 0));
a.scale = 1;
a.stopAllActions();
this.setNodePoker(a, e[n]);
}
1 == t && (cc.find("poker/CP", this.node).active = !1);
};
t.prototype.bankerRecoveryChip = function(e, t, i) {
for (var o = this, n = null, a = [], s = 0, r = 0, l = this.node.getChildByName("table").getChildByName("chip").children; r < l.length; r++) {
var c = l[r];
if (i) a.push(c); else {
var d = c.name;
t < 0 && "2" == d && a.push(c);
if (!("2" == d || s >= e.length)) {
a.push(c);
s++;
}
}
}
var h = cc.v2(-80, 294), u = a.length / 45;
u < 1 && (u = 1);
this.schedule(function e() {
for (var t = function() {
var t = a.shift();
if (!t) {
o.unschedule(e);
o.scheduleOnce(function() {
n(!0);
}, .3);
return {
value: void 0
};
}
t.zIndex = 10;
var i = cc.moveTo(.25, h), s = cc.callFunc(function() {
o.jettonPool.put(t);
});
t.stopAllActions();
t.runAction(cc.sequence(i, s));
}, i = 0; i < u; i++) {
var s = t();
if ("object" == typeof s) return s.value;
}
}.bind(this), .01, 100, 0);
wAudioMgr.playSound("sound/GET_GOLD", "SDB");
return new Promise(function(e) {
n = e;
});
};
t.prototype.bankerGiveChip = function(e, t) {
var i = this, o = this.node.getChildByName("table"), n = Math.ceil(e.length / 40), a = null;
this.schedule(function s() {
for (var r = 0; r < n; r++) {
var l = e.shift();
if (!l) {
i.unschedule(s);
i.scheduleOnce(function() {
a(!0);
}, .3);
return;
}
var c = wUtils.random(0, 1), d = o.getChildByName("" + c), h = wUtils.local_world__POS(d);
h = wUtils.world_local_POS(o, h);
var u = d.width / 2, p = d.height / 2, g = wUtils.random(h.x - u, h.x + u), f = wUtils.random(h.y - p, h.y + p);
i.jettonAni(cc.v2(-80, 294), cc.v2(g, f), l, c, 1);
var m = t.shift();
if (m) {
var w = o.getChildByName("2"), y = wUtils.world_local_POS(o, wUtils.local_world__POS(w)), _ = w.width / 2, v = w.height / 2;
y.x = wUtils.random(y.x - _, y.x + _);
y.y = wUtils.random(y.y - v, y.y + v);
i.jettonAni(cc.v2(-80, 294), y, m, 2, 1);
}
}
}.bind(this), .01, 50, 0);
wAudioMgr.playSound("sound/GET_GOLD", "SDB");
return new Promise(function(e) {
a = e;
});
};
t.prototype.chipFlyPlayer = function() {
var e = this;
wAudioMgr.playSound("sound/GET_GOLD", "SDB");
for (var t = null, i = [], o = 0, n = this.node.getChildByName("table").getChildByName("chip").children; o < n.length; o++) {
var a = n[o];
i.push(a);
}
var s = i.length / 45;
s < 1 && (s = 1);
this.schedule(function o() {
for (var n = function() {
var n = i.shift();
if (!n) {
e.unschedule(o);
e.scheduleOnce(function() {
t();
}, .3);
return {
value: void 0
};
}
n.zIndex = 10;
var a = "2" == n.name ? cc.v2(-611, -324) : cc.v2(-446.8, -205.5), s = cc.moveTo(.25, a), r = cc.callFunc(function() {
e.jettonPool.put(n);
});
n.stopAllActions();
n.runAction(cc.sequence(s, r));
}, a = 0; a < s; a++) {
var r = n();
if ("object" == typeof r) return r.value;
}
}.bind(this), .01, 100, 0);
this.scheduleOnce(function() {
wAudioMgr.playSound("sound/SETTLEMENT", "SDB");
}, .5);
return new Promise(function(e) {
t = e;
});
};
t.prototype.showPlayerWin = function(e) {
var t = cc.find("players/win", this.node);
t.active = !0;
t.getComponent(cc.Label).string = "+" + wUtils.numConvert(e);
t.y = -57;
t.opacity = 255;
var i = cc.moveTo(.15, cc.v2(0, 63)), o = cc.delayTime(1), n = cc.moveBy(.15, cc.v2(0, 15)), a = cc.fadeOut(.15), s = cc.spawn(n, a), r = cc.callFunc(function() {
t.active = !1;
}), l = cc.sequence(i, o, s, r);
t.runAction(l);
};
t.prototype.showMyWin = function(e) {
var t = cc.find("players/mywin", this.node);
t.active = !0;
t.getComponent(cc.Label).string = "+" + wUtils.numConvert(e);
t.y = -103;
t.opacity = 255;
var i = cc.moveBy(.15, cc.v2(0, 30)), o = cc.delayTime(1), n = cc.moveBy(.15, cc.v2(0, 10)), a = cc.fadeOut(.15), s = cc.spawn(n, a), r = cc.callFunc(function() {
t.active = !1;
}), l = cc.sequence(i, o, s, r);
t.runAction(l);
};
t.prototype.showResult = function(e, t) {
var i = this.node.getChildByName("result");
i.active = !0;
var o = i.getChildByName("main");
wUIHelp.easeBackOut(o);
e.self_win >= 0 ? wAudioMgr.playSound("sound/win", "SDB") : wAudioMgr.playSound("sound/lose", "SDB");
o.getChildByName("winbg").active = e.self_win >= 0;
o.getChildByName("losebg").active = e.self_win < 0;
cc.find("my/name", o).getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10);
cc.find("my/win", o).active = e.self_win >= 0;
var n = cc.find("my/win", o).getComponent(cc.Label);
n.string = (e.self_win >= 0 ? "+" : "") + e.self_win;
n.font = this.resultFont[e.self_win >= 0 ? 0 : 1];
n.node.active = e.self_bet;
cc.find("my/wxz", o).active = !e.self_bet;
(n = cc.find("zj/win", o).getComponent(cc.Label)).string = (e.bankerwin >= 0 ? "+" : "") + e.bankerwin;
n.font = this.resultFont[e.bankerwin >= 0 ? 0 : 1];
var a = o.getChildByName("list");
wUIHelp.hideSonNode(a);
for (var s = e.bigwiner, r = 0; r < s.length; r++) {
var l = a.children[r], c = s[r];
l.active = !0;
l.getChildByName("name").getComponent(cc.Label).string = c.username;
l.getChildByName("New Label").getComponent(cc.Label).string = "+" + c.win;
}
for (var d = 0, h = [ "self_cards", "banker_cards" ]; d < h.length; d++) {
var u = h[d], p = e[u], g = o.getChildByName(u);
g.active = p.length;
p.length;
var f = g.getChildByName("poker");
wUIHelp.hideSonNode(f);
for (r = 0; r < p.length; r++) {
l = f.children[r];
wUIHelp.hideSonNode(l);
this.setNodePoker(l, p[r]);
l.active = !0;
}
var m = t.getPID(p);
g.getChildByName("lose").active = !1;
var w = g.getChildByName("type").getComponent(cc.Sprite);
if (10.5 == m && 5 == p.length) w.spriteFrame = this.sdbJxPxImg.getSpriteFrame("sdbJsPx_11b"); else if (m < 10.5 && 5 == p.length) w.spriteFrame = this.sdbJxPxImg.getSpriteFrame("sdbJsPx_11a"); else if (m > 10.5) {
g.getChildByName("lose").active = !0;
w.spriteFrame = this.sdbJxPxImg.getSpriteFrame("sdbJsPx_0a");
} else {
var y = Math.floor(m), _ = "sdbJsPx_" + y + (y == m ? "a" : "b");
w.spriteFrame = this.sdbJxPxImg.getSpriteFrame(_);
}
}
};
t.prototype.closeResult = function() {
var e = this.node.getChildByName("result");
if (e.active && !e.isAnim) {
e.isAnim = !0;
var t = e.getChildByName("main");
wUIHelp.easeIn(t, function() {
e.active = !1;
e.isAnim = !1;
});
}
};
t.prototype.initPlayerList = function(e) {
e = Object.values(e);
for (var t = this.node.getChildByName("playerList"), i = 0; i < e.length; i++) {
var o = t.children[i];
if (o) {
o.getChildByName("name").getComponent(cc.Label).string = e[i].username;
wUIHelp.setHead(cc.find("head/head", o), e[i].headimgurl);
}
}
};
t.prototype.selectChip = function(e) {
var t = this.chipContent.getChildByName("" + e), i = this.chipContent.getChildByName("dir");
if (t) {
wUIHelp.hideSonNode(this.chipContent, !0);
t.active = !1;
i.active = !0;
i.x = t.x;
i.getComponent(cc.Sprite).spriteFrame = this.selectChipImg[e];
} else i.active = !1;
};
t.prototype.setBtn_Bank = function(e) {
this.btn_Bank.interactable = e;
};
t.prototype.chip_On_Off = function(e) {
for (var t = n.SDBConfig.chip, i = 0; i < t.length; i++) {
var o = this.chipContent.getChildByName("" + i), a = e >= t[i];
o.getComponent(cc.Button).interactable = a;
a || (o.active = !0);
}
};
__decorate([ r(cc.Node) ], t.prototype, "chipContent", void 0);
__decorate([ r(cc.Button) ], t.prototype, "btn_Bank", void 0);
__decorate([ r(cc.Button) ], t.prototype, "btn_go_on", void 0);
__decorate([ r(cc.SpriteAtlas) ], t.prototype, "jettonImg", void 0);
__decorate([ r(cc.SpriteAtlas) ], t.prototype, "poker", void 0);
__decorate([ r(cc.SpriteFrame) ], t.prototype, "selectChipImg", void 0);
__decorate([ r(cc.SpriteAtlas) ], t.prototype, "dsImg", void 0);
__decorate([ r(cc.SpriteAtlas) ], t.prototype, "sdbJxPxImg", void 0);
__decorate([ r([ cc.Font ]) ], t.prototype, "resultFont", void 0);
return __decorate([ s ], t);
}(cc.Component);
i.default = l;
cc._RF.pop();
}, {
NodePool: void 0,
SDBModel: "SDBModel"
} ]
}, {}, [ "SDBControlle", "SDBLoad", "SDBModel", "SDBPlayerList", "SDBView" ]);