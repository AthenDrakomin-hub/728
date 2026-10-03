window.__require = function t(e, o, i) {
function n(r, l) {
if (!o[r]) {
if (!e[r]) {
var s = r.split("/");
s = s[s.length - 1];
if (!e[s]) {
var c = "function" == typeof __require && __require;
if (!l && c) return c(s, !0);
if (a) return a(s, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = s;
}
var h = o[r] = {
exports: {}
};
e[r][0].call(h.exports, function(t) {
return n(e[r][1][t] || t);
}, h, h.exports, t, e, o, i);
}
return o[r].exports;
}
for (var a = "function" == typeof __require && __require, r = 0; r < i.length; r++) n(i[r]);
return n;
}({
LHDChart: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "a2164tQvnxAP70Y6RW+E+Hh", "LHDChart");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("PopupBase"), n = t("LHDTrendIem"), a = cc._decorator, r = a.ccclass, l = a.property, s = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.top = null;
e.topContent = null;
e.trendlist = null;
e.trendImg = [];
e.trendItemController = null;
e.l_content = null;
e.trendList = null;
return e;
}
e.prototype.onLoad = function() {
wGEvent.on("trendChart", this.init, this);
};
e.prototype.upTop = function() {
var t = this.trendList, e = t.length - 19;
t = t.slice(e < 0 ? 0 : e);
for (var o = 0; o < 19; o++) {
var i = this.trendlist.children[o], n = !!t[o];
i.active = n;
n && (i.getComponent(cc.Sprite).spriteFrame = this.trendImg[t[o] - 1]);
}
e = t.length - 1;
var a = t.reduce(function(t, e) {
return t + (1 == e ? 1 : 0);
}, 0), r = a / (a + t.reduce(function(t, e) {
return t + (3 == e ? 1 : 0);
}, 0));
this.l_content.getChildByName("l").getComponent(cc.Label).string = Math.round(100 * r) + "%";
this.l_content.getChildByName("h").getComponent(cc.Label).string = Math.round(100 * (1 - r)) + "%";
};
e.prototype.init = function(t) {
this.trendList = JSON.parse(JSON.stringify(t));
this.upTop();
this.trendItemController.init(t);
};
__decorate([ l(cc.Node) ], e.prototype, "top", void 0);
__decorate([ l(cc.Node) ], e.prototype, "topContent", void 0);
__decorate([ l(cc.Node) ], e.prototype, "trendlist", void 0);
__decorate([ l([ cc.SpriteFrame ]) ], e.prototype, "trendImg", void 0);
__decorate([ l(n.default) ], e.prototype, "trendItemController", void 0);
__decorate([ l(cc.Node) ], e.prototype, "l_content", void 0);
return __decorate([ r ], e);
}(i.default);
o.default = s;
cc._RF.pop();
}, {
LHDTrendIem: "LHDTrendIem",
PopupBase: void 0
} ],
LHDControlle: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "cc67aVJE9FFk4cF/LtZILT5", "LHDControlle");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("MultiBase"), n = t("LHDModel"), a = t("LHDView"), r = cc._decorator, l = r.ccclass;
r.property;
var s = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.LHDView = null;
e.LHDModel = null;
e.betList = {
1: 0,
2: 0,
3: 0
};
return e;
}
e.prototype.onLoad = function() {
this.initProxy();
this.initNetWorkEvevt();
this.m_init();
};
e.prototype.update = function(t) {
if (this.LHDModel.time) {
this.LHDModel.newTime += t;
this.LHDModel.newTime > 1 && this.LHDModel.time--;
}
};
e.prototype.initProxy = function() {
var t = this;
this.LHDView = this.node.getComponent(a.default);
this.LHDModel = wUtils.creatorProxy(new n.LHDModel());
this.LHDModel.onEvevt("gameState", function(e) {
t.LHDView.setBtn_Bank(1 == e);
if (1 != e) {
t.LHDView.chip_On_Off(0);
t.LHDView.setBtn_go_on(!1);
} else t.LHDModel.gold = t.LHDModel.gold;
t.m_setBankBtn(1 == e);
});
this.LHDModel.onEvevt("time", function(e) {
e = !e || e <= 0 ? 0 : e;
t.LHDView.setTime(e || 0, t.LHDModel.gameState);
t.LHDModel.newTime = 0;
});
this.LHDModel.onEvevt("gold", function(e) {
t.LHDView.setMyGold(e);
1 == t.LHDModel.gameState && t.LHDView.chip_On_Off(e);
var o = t.LHDModel.getLastbet(t.LHDModel.lastbet);
1 == t.LHDModel.gameState && o && t.LHDModel.gold >= o ? t.LHDView.setBtn_go_on(!0) : t.LHDView.setBtn_go_on(!1);
if (-1 == t.LHDModel.selectChip) e >= 1e4 && (t.LHDModel.selectChip = 0); else if (e < n.LHDConfig.chip[t.LHDModel.selectChip]) for (;n.LHDConfig.chip[--t.LHDModel.selectChip] && !(e >= n.LHDConfig.chip[t.LHDModel.selectChip]); ) ; else t.LHDModel.selectChip = t.LHDModel.selectChip;
});
this.LHDModel.onEvevt("longBet", function(e) {
t.LHDView.setBetNum(1, e);
});
this.LHDModel.onEvevt("huBet", function(e) {
t.LHDView.setBetNum(3, e);
});
this.LHDModel.onEvevt("heBet", function(e) {
t.LHDView.setBetNum(2, e);
});
this.LHDModel.onEvevt("selectChip", function(e) {
t.LHDView.selectChip(e);
});
this.LHDModel.onEvevt("playerNum", function(e) {
t.LHDView.upPlayerCpunt(e);
});
};
e.prototype.m_roomInfo = function(t) {
var e = this;
this.LHDModel.initRoom(JSON.parse(JSON.stringify(t)));
this.LHDView.setTrend(this.LHDModel.history);
1 != this.LHDModel.gameState ? t.time > 3 && this.LHDView.startVS(function() {
e.LHDView.waitStart();
}) : this.LHDView.startVS();
var o = {
1: [ t.Loongbet ],
2: [ t.flatbet ],
3: [ t.tigerbet ]
};
1 == this.LHDModel.gameState && (this.LHDModel.bet = o);
this.LHDModel.getLastbet(o) && (this.LHDModel.lastbet = o);
this.LHDView.setMyBetNum(1, t.Loongbet);
this.betList[1] = t.prize[1].score;
this.LHDView.setMyBetNum(2, t.flatbet);
this.betList[2] = t.prize[2].score;
this.LHDView.setMyBetNum(3, t.tigerbet);
this.betList[3] = t.prize[3].score;
this.LHDModel.gold = this.LHDModel.gold;
this.upTableChip();
this.Msg_LHD_Head(t);
};
e.prototype.upTableChip = function() {
var t = this.LHDModel.scoreSplit(this.betList[1]);
this.LHDView.initChip(t, 1);
t = this.LHDModel.scoreSplit(this.betList[2]);
this.LHDView.initChip(t, 2);
t = this.LHDModel.scoreSplit(this.betList[3]);
this.LHDView.initChip(t, 3);
};
e.prototype.Msg_LHD_State_Stake = function(t) {
this.betList = {
1: 0,
2: 0,
3: 0
};
wAudioMgr.playSound("sound/ksxz", wGameData.getGameName());
for (var e = 1; e < 4; e++) this.LHDView.setMyBetNum(e, 0);
this.LHDModel.initDesktop();
this.LHDView.recoveryChip();
this.LHDModel.gameState = 1;
this.LHDModel.time = t.time - 1;
this.LHDModel.banker = t.banker || {};
this.LHDView.start_end(!0);
};
e.prototype.Msg_LHD_State_Open = function(t) {
return __awaiter(this, void 0, void 0, function() {
var e, o, i, n, a;
return __generator(this, function(r) {
switch (r.label) {
case 0:
wAudioMgr.playSound("sound/tzxz", wGameData.getGameName());
this.unscheduleAllCallbacks();
this.LHDModel.jettonList.length && this.launchAllChip();
for (i in this.betList) Object.prototype.hasOwnProperty.call(this.betList, i) && this.LHDView.setBetNum(i, this.betList[i]);
e = this.LHDModel.win_or_lose(t.Loong, t.tiger);
this.LHDModel.gameState = 2;
this.LHDModel.time = t.time;
this.LHDView.start_end(!1);
return [ 4, wUtils.syncDelayed(1, this) ];

case 1:
r.sent();
return [ 4, this.LHDView.openCard([ t.Loong, t.tiger ]) ];

case 2:
r.sent();
this.LHDView.winType(e);
return [ 4, wUtils.syncDelayed(.5, this) ];

case 3:
r.sent();
o = [ 1, 3, 2 ][e];
return [ 4, this.LHDView.bankerRecoveryChip(o) ];

case 4:
r.sent();
return [ 4, wUtils.syncDelayed(.7, this) ];

case 5:
r.sent();
switch (e) {
case 0:
wAudioMgr.playSound("sound/long", wGameData.getGameName());
break;

case 1:
wAudioMgr.playSound("sound/hu", wGameData.getGameName());
break;

case 2:
wAudioMgr.playSound("sound/he", wGameData.getGameName());
}
return [ 4, this.LHDView.bankerGiveChip(o, t.player, this.LHDModel) ];

case 6:
r.sent();
this.LHDModel.history.push(o);
wGEvent.emit("trendChart", this.LHDModel.history);
this.LHDView.setTrend(this.LHDModel.history, !1);
return [ 4, wUtils.syncDelayed(.5, this) ];

case 7:
r.sent();
this.LHDView.chipFlyPlayer(o, t.player, this.LHDModel);
this.LHDView.particleShow(o);
wAudioMgr.playSound("sound/lz", wGameData.getGameName());
return [ 4, wUtils.syncDelayed(.5, this) ];

case 8:
r.sent();
this.LHDView.showWinGold(t.player, this.LHDModel);
if (this.LHDModel.getLastbet(this.LHDModel.bet)) {
this.LHDModel.lastbet = this.LHDModel.bet;
this.LHDModel.bet = {};
}
for (i in t.player) {
n = t.player[i];
this.upPlayerGold(i, n.gold);
}
for (a = 1; a < 4; a++) this.LHDView.setMyBetNum(a, 0);
return [ 2 ];
}
});
});
};
e.prototype.Msg_LHD_Act_Bet = function(t) {
var e = wGameData.getKey("uid");
!this.LHDModel.bet[t.code] && (this.LHDModel.bet[t.code] = []);
this.LHDModel.bet[t.code].push(t.bat);
this.upPlayerGold(e, this.LHDModel.gold - t.bat);
for (var o = 0, i = 0, a = this.LHDModel.bet[t.code]; i < a.length; i++) o += a[i];
this.LHDView.setMyBetNum(t.code, o);
this.LHDModel[this.LHDModel.get_id_key(t.code)] += t.bat;
var r = [ t.bat ];
-1 == n.LHDConfig.chip.indexOf(t.bat) && (r = this.LHDModel.scoreSplit(t.bat));
this.LHDView.showMyChip(t.code, r);
};
e.prototype.playerBet = function(t) {
1 == this.LHDModel.gameState ? -1 != this.LHDModel.selectChip ? wNetWork.send("Msg_LHD_Act_Bet", {
bat: n.LHDConfig.chip[this.LHDModel.selectChip],
code: Number(t)
}) : wUIManager.showTips("请选择下注筹码！") : wUIManager.showTips("请稍后,还未到下注时间哟!", wUIManager.TIPS_WHITE);
};
e.prototype.lastBet = function() {
var t = this.LHDModel.lastbet, e = !1;
for (var o in t) if (Object.prototype.hasOwnProperty.call(t, o)) {
for (var i = 0, n = 0, a = t[o]; n < a.length; n++) {
var r = a[n];
i += Number(r);
}
if (i) {
wNetWork.send("Msg_LHD_Act_Bet", {
bat: i,
code: Number(o)
});
e = !0;
}
}
if (e) {
this.LHDView.setBtn_go_on(!1);
this.LHDModel.lastbet = {};
}
};
e.prototype.Msg_LHD_Act_Table = function(t) {
var e = t;
for (var o in e) {
var i = e[o];
if (o != wGameData.getKey("uid")) for (var n in i) {
var a = i[n].score;
if (a) for (var r = 0, l = this.LHDModel.scoreSplit(a); r < l.length; r++) {
var s = l[r];
this.LHDModel.jettonList.push([ 10, s, n, o ]);
}
}
}
this.initFhip();
for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
i = e[n];
this.betList[1] += i[1].score;
this.betList[2] += i[2].score;
this.betList[3] += i[3].score;
}
};
e.prototype.launchFhip = function(t, e) {
void 0 === t && (t = 1);
void 0 === e && (e = !0);
var o = this.LHDModel.jettonList.shift();
if (o) {
e && this.LHDView.showChip(o[0], o[1], o[2], t);
o[3] != wGameData.getKey("uid") && (this.LHDModel[this.LHDModel.get_id_key(o[2])] += o[1]);
} else this.unscheduleAllCallbacks();
};
e.prototype.upPlayerGold = function(t, e) {
if (t == wGameData.getKey("uid")) {
wGameData.setKey("gold", e);
this.LHDModel.gold = e;
}
};
e.prototype.initFhip = function() {
var t = this;
if (!(this.LHDModel.jettonList.length <= 0)) {
this.LHDModel.jettonList.sort(function() {
return Math.random() > .5 ? -1 : 1;
});
var e = this.LHDModel.time > 2 ? 2 : .5;
this.unscheduleAllCallbacks();
this.schedule(function() {
t.launchFhip();
}, e / this.LHDModel.jettonList.length);
this.schedule(function() {
t.LHDModel.jettonList.length && wAudioMgr.playSound("sound/chip", t.m_game);
}, .4);
}
};
e.prototype.launchAllChip = function() {
for (var t = this, e = {}, o = 0, i = this.LHDModel.jettonList; o < i.length; o++) {
var n = i[o], a = n[0];
!e[a] && (e[a] = {});
var r = n[2];
!e[a][r] && (e[a][r] = {
gold: 0,
uid: n[3]
});
e[a][r].gold += n[1];
}
this.LHDModel.jettonList = [];
var l = function(o) {
var i = function(i) {
var n = e[o][i];
s.LHDModel.maxScoreSplit(n.gold).forEach(function(e) {
t.LHDModel.jettonList.push([ o, e, i, n.uid ]);
});
};
for (var n in e[o]) i(n);
}, s = this;
for (var a in e) l(a);
wAudioMgr.playSound("sound/chip", this.m_game);
for (;this.LHDModel.jettonList.length; ) this.launchFhip(3);
};
e.prototype.onClick = function(t, e) {
switch (e) {
case "hall":
if (this.LHDModel.getLastbet(this.LHDModel.bet)) {
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
return;

case "0":
case "1":
case "2":
case "3":
case "4":
case "5":
this.LHDModel.selectChip = e;
break;

case "bet1":
case "bet2":
case "bet3":
this.playerBet(e[3]);
break;

case "playerlist":
wViewMgr.openPage({
path: "prefab/LHDPlayerList",
bundle: "LHD"
});
break;

case "trend":
wViewMgr.openPage({
path: "prefab/LHDChart",
bundle: "LHD",
data: this.LHDModel.history
});
}
wAudioMgr.playBtnSound();
};
e.prototype.Msg_LHD_Head = function(t) {
var e = 0;
for (var o in t.moreScore) this.LHDView.upPlayer(e++, t.moreScore[o]);
for (var o in t.moreWin) this.LHDView.upPlayer(e++, t.moreWin[o]);
};
e.prototype.Msg_LHD_Out = function() {
this.LHDModel.playerNum--;
};
e.prototype.Msg_LHD_Add = function() {
this.LHDModel.playerNum++;
};
e.prototype.m_upGameGold = function() {
this.LHDModel.gold = wGameData.getKey("gold");
};
e.prototype.m_NetWorkState = function() {};
e.prototype.initNetWorkEvevt = function() {
var t = this;
wGEvent.on("Msg_LHD_State_Stake", function(e) {
1 == e.status ? t.Msg_LHD_State_Stake(e.data) : wLog.e("玩家押注失败");
}, this);
wGEvent.on("Msg_LHD_State_Open", function(e) {
1 == e.status ? t.Msg_LHD_State_Open(e.data) : wLog.e("玩家开奖失败");
}, this);
wGEvent.on("Msg_LHD_Act_Bet", function(e) {
1 == e.status ? t.Msg_LHD_Act_Bet(e.data) : wLog.e("玩家下注失败");
}, this);
wGEvent.on("Msg_LHD_Act_Table", function(e) {
1 == e.status ? t.Msg_LHD_Act_Table(e.data) : wLog.e("桌面情况失败");
}, this);
wGEvent.on("Msg_LHD_Out", function(e) {
1 == e.status ? t.Msg_LHD_Out(e.data) : wLog.e("玩家退出失败");
}, this);
wGEvent.on("Msg_LHD_Add", function(e) {
1 == e.status ? t.Msg_LHD_Add(e.data) : wLog.e("玩家退出失败");
}, this);
wGEvent.on("Msg_LHD_Head", function(e) {
1 == e.status ? t.Msg_LHD_Head(e.data) : wLog.e("更新6个头像失败");
}, this);
};
return __decorate([ l ], e);
}(i.default);
o.default = s;
cc._RF.pop();
}, {
LHDModel: "LHDModel",
LHDView: "LHDView",
MultiBase: void 0
} ],
LHDLoad: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "af1adT6gZhNwq6NlYVkBvGQ", "LHDLoad");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("Config"), n = cc._decorator, a = n.ccclass;
n.property;
var r = function(t) {
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
}, .6);
for (var e = function(t) {
wUIHelp.playSpine(t, "start", function() {
wUIHelp.playSpine(t, "idle", null, !0);
});
}, o = 0, i = this.node.getChildByName("main").children; o < i.length; o++) e(i[o]);
};
e.prototype.initShow = function() {
var t = this;
this.isEnterRoom = !1;
var e = cc.fadeOut(.2), o = cc.callFunc(function() {
t.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
t.node.parent.destroyAllChildren();
}
}), i = cc.sequence(e, o);
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
var o = wGEvent.on("Msg_Hall_EnterRoom", function(t) {
e.Msg_Hall_EnterRoom(t);
wGEvent.off(o);
e.unscheduleAllCallbacks();
o = null;
}, this);
this.scheduleOnce(function() {
if (o) {
e.isEnterRoom = !1;
wGEvent.off(o);
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
return __decorate([ a ], e);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {
Config: void 0
} ],
LHDModel: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "e45c1bvjsZIyZo/4JI1m+RW", "LHDModel");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.LHDModel = o.LHDConfig = void 0;
o.LHDConfig = {
chip: [ 1e4, 1e5, 1e6, 5e6, 1e7, 5e7 ],
chipLabel: [ "1万", "10万", "1百万", "5百万", "1千万", "5千万" ],
cardUrl: [ "game-longhudazhan-gui-longhudazhan-main-gui-lhdz-value-", "game-longhudazhan-gui-longhudazhan-main-gui-lhdz-color-", "game-longhudazhan-gui-longhudazhan-main-gui-lhdz-color-big" ]
};
var i = function() {
function t() {
this.gameState = 1;
this.time = 0;
this.newTime = 0;
this.longBet = 0;
this.huBet = 0;
this.heBet = 0;
this.jettonList = [];
this.bet = {};
this.lastbet = {};
this.selectChip = -1;
this.isbanker = !1;
}
t.prototype.initRoom = function(t) {
this.history = t.history;
this.playerNum = t.playerCount;
this.gameState = t.gameState;
this.gold = wGameData.getKey("gold");
this.time = t.time;
this.banker = t.banker || {};
var e = t.prize;
for (var o in e) this[this.get_id_key(o)] = e[o].score;
};
t.prototype.getLastbet = function(t) {
var e = 0;
for (var o in t) for (var i = 0, n = t[o]; i < n.length; i++) e += n[i];
return e;
};
t.prototype.win_or_lose = function(t, e) {
var o = Math.floor(t / 100), i = Math.floor(e / 100);
return o == i ? 2 : o > i ? 0 : 1;
};
t.prototype.get_id_key = function(t) {
return 1 == t ? "longBet" : 2 == t ? "heBet" : "huBet";
};
t.prototype.initDesktop = function() {
this.longBet = 0;
this.huBet = 0;
this.heBet = 0;
this.jettonList = [];
};
t.prototype.scoreSplit = function(t) {
for (var e = [], i = o.LHDConfig.chip.length - 1; ;) {
var n = -1;
if (t >= o.LHDConfig.chip[i]) n = wUtils.random(0, i); else for (var a = i - 1; a > -1; a--) if (t >= o.LHDConfig.chip[a]) {
n = a;
break;
}
if (n >= 0) {
var r = o.LHDConfig.chip[n];
e.push(r);
t -= r;
}
if (t <= 0 || t < o.LHDConfig.chip[0]) return e;
}
};
t.prototype.maxScoreSplit = function(t) {
for (var e = [], i = 5; i > -1; i--) for (var n = o.LHDConfig.chip[i]; t >= n; ) {
e.push(n);
t -= n;
}
return e;
};
return t;
}();
o.LHDModel = i;
cc._RF.pop();
}, {} ],
LHDPlayerList: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "ff9a4gR9zZEup6s0g3Cfyz2", "LHDPlayerList");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("PopupBase"), n = cc._decorator, a = n.ccclass, r = n.property, l = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.content = null;
return e;
}
e.prototype.onLoad = function() {
var t = this;
wUtils.sendMsg("Msg_LHD_GetUserList", {}, this).then(function(e) {
e = e.players;
var o = [];
for (var i in e) if (Object.prototype.hasOwnProperty.call(e, i)) {
e[i].uid = i;
o.push(e[i]);
}
t.initList(o);
});
};
e.prototype.initList = function(t) {
cc.find("label", this.main).getComponent(cc.Label).string = t.length + "在线";
t.sort(function(t, e) {
return e.gold - t.gold;
});
for (var e = this.main.getChildByName("item"), o = 0; o < t.length; o++) {
var i = cc.instantiate(e);
i.parent = this.content;
i.active = !0;
var n = t[o], a = n.uid == wGameData.getKey("uid") ? n.nickname : n.username;
i.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(a, 8);
wUIHelp.setHead(cc.find("head/head", i), n.headimgurl);
i.getChildByName("gold").getComponent(cc.Label).string = wUtils.goldFormat(n.gold, 1, 1);
}
};
__decorate([ r(cc.Node) ], e.prototype, "content", void 0);
return __decorate([ a ], e);
}(i.default);
o.default = l;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
LHDTrendIem: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "f45874MDplNBIfIFe7sO8ZV", "LHDTrendIem");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, n = i.ccclass, a = i.property, r = new function() {
this.TYPE_DUI = 1;
this.TYPE_XIAN = 2;
this.TYPE_ZHUANG = 4;
this.TYPE_HU = 8;
this.HONG = 1;
this.LAN = 2;
this.getDaluArr = function(t) {
var e, o, i = [], n = 0, a = 0;
for (e = 0; e < t.length; ++e) for (o = 0; o < t[e].length; ++o) if ((t[e][o] & this.TYPE_HU) > 0) i[n] && i[n][a] && (i[n][a] += this.TYPE_HU); else if (i[n] && i[n][a]) {
if ((t[e][o] & this.TYPE_ZHUANG) > 0 && (i[n][a] & this.TYPE_ZHUANG) > 0) ++a; else if ((t[e][o] & this.TYPE_XIAN) > 0 && (i[n][a] & this.TYPE_XIAN) > 0) ++a; else {
i[++n] = [];
a = 0;
}
i[n][a] = t[e][o];
} else {
i[n] = [];
i[n][a] = t[e][o];
}
return i;
};
this.getFormatArr = function(t) {
var e, o, i = 0, n = 0, a = [];
for (e = 0; e < t.length; ++e) {
a[i = e] || (a[i] = [ null, null, null, null, null, null ]);
for (o = 0; o < t[e].length; ++o) if (0 === o) {
n = 0;
a[i][n] = t[e][o];
} else if (null !== a[i][n + 1] || 5 === n || null === a[i][n - 1]) {
a[++i] || (a[i] = [ null, null, null, null, null, null ]);
a[i][n] = t[e][o];
} else {
++n;
a[i][n] = t[e][o];
}
}
return a;
};
this.getDayanArr = function(t) {
var e, o, i = [];
for (e = 1; e < t.length; ++e) {
o = 1 === e ? 1 : 0;
for (;o < t[e].length; ) {
var n = 0 === o ? t[e - 1].length === t[e - 2].length ? this.HONG : this.LAN : t[e - 1][o] ? this.HONG : t[e - 1][o - 1] ? this.LAN : this.HONG;
if (0 === i.length) i.push([ n ]); else {
var a = i[i.length - 1];
0 === a.length ? a.push(n) : a[a.length - 1] !== n ? i.push([ n ]) : a.push(n);
}
++o;
}
}
return i;
};
this.getXiaoluArr = function(t) {
var e, o, i = [];
for (e = 2; e < t.length; ++e) {
o = 2 === e ? 1 : 0;
for (;o < t[e].length; ) {
var n = 0 === o ? t[e - 1].length === t[e - 3].length ? this.HONG : this.LAN : t[e - 2][o] ? this.HONG : t[e - 2][o - 1] ? this.LAN : this.HONG;
if (0 === i.length) i.push([ n ]); else {
var a = i[i.length - 1];
0 === a.length ? a.push(n) : a[a.length - 1] !== n ? i.push([ n ]) : a.push(n);
}
++o;
}
}
return i;
};
this.getTanglangArr = function(t) {
var e, o, i = [];
for (e = 3; e < t.length; ++e) {
o = 3 === e ? 1 : 0;
for (;o < t[e].length; ) {
var n = 0 === o ? t[e - 1].length === t[e - 4].length ? this.HONG : this.LAN : t[e - 3][o] ? this.HONG : t[e - 3][o - 1] ? this.LAN : this.HONG;
if (0 === i.length) i.push([ n ]); else {
var a = i[i.length - 1];
0 === a.length ? a.push(n) : a[a.length - 1] !== n ? i.push([ n ]) : a.push(n);
}
++o;
}
}
return i;
};
}(), l = function(t) {
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
this.writeAllRoad(e);
};
e.prototype.convertToZhupanArr = function(t) {
for (var e = [], o = [], i = 0; i < t.length; ++i) {
var n = t[i];
1 === n ? o.push(r.TYPE_ZHUANG) : 3 === n ? o.push(r.TYPE_XIAN) : 2 === n && o.push(r.TYPE_HU);
if (6 === o.length) {
e.push(o);
o = [];
}
}
0 !== o.length && e.push(o);
return e;
};
e.prototype.writeAllRoad = function(t) {
var e = r.getDaluArr(t), o = r.getDayanArr(e), i = r.getXiaoluArr(e), n = r.getTanglangArr(e);
this.writeZhuPan(t);
this.writeDalu(r.getFormatArr(e));
this.writeDayan(r.getFormatArr(o));
this.writeTanglang(r.getFormatArr(n));
this.writeXiaolu(r.getFormatArr(i));
};
e.prototype.writeZhuPan = function(t) {
for (var e = this.zhupanContent.getComponent(cc.ScrollView).content, o = e.getChildByName("item").height / 6, i = 10; i < t.length; i++) (r = e.children[i]) || ((r = cc.instantiate(e.children[e.childrenCount - 1])).parent = e);
for (i = 0; i < t.length; ++i) for (var n = e.children[i], a = 0; a < t[i].length; ++a) {
var r;
(r = this.getZhupanNodeByType(t[i][a])).active = !0;
n.addChild(r, 1, "item");
r.x = -1;
r.y = -o * a - 20;
this.createdNodeArr.push(r);
}
this.zhupanContent.getComponent(cc.ScrollView).scrollToRight();
};
e.prototype.getZhupanNodeByType = function(t) {
var e, o = this.node.getChildByName("zlcopy");
e = (t & r.TYPE_ZHUANG) > 0 ? o.getChildByName("zhuang") : (t & r.TYPE_XIAN) > 0 ? o.getChildByName("xian") : o.getChildByName("he");
return cc.instantiate(e);
};
e.prototype.writeXiaolu = function(t) {
for (var e, o, i, n = this.xiaoluContent.getComponent(cc.ScrollView).content, a = 12; a < Math.ceil(t.length / 2); a++) {
var r = n.children[a];
r || ((r = cc.instantiate(n.children[n.childrenCount - 1])).parent = n);
}
for (e = 0; e < t.length; ++e) {
var l = Math.floor(e / 2), s = n.children[l];
for (o = 0; o < t[e].length; ++o) if (t[e][o]) {
(i = this.getXiaoluNodeByType(t[e][o])).active = !0;
i.parent = s;
i.x = e % 2 * 9 - 6;
i.y = -5 - 10.5 * o;
this.createdNodeArr.push(i);
}
}
this.xiaoluContent.getComponent(cc.ScrollView).scrollToRight();
};
e.prototype.getXiaoluNodeByType = function(t) {
var e, o = this.node.getChildByName("xlcopy");
e = t === r.HONG ? o.getChildByName("hong") : o.getChildByName("lan");
return cc.instantiate(e);
};
e.prototype.writeTanglang = function(t) {
for (var e, o, i, n = this.tanglangContent.getComponent(cc.ScrollView).content, a = 14; a < Math.ceil(t.length / 2); a++) {
var r = n.children[a];
r || ((r = cc.instantiate(n.children[n.childrenCount - 1])).parent = n);
}
for (e = 0; e < t.length; ++e) {
var l = Math.floor(e / 2), s = n.children[l];
for (o = 0; o < t[e].length; ++o) if (t[e][o]) {
(i = this.getTanglangNodeByType(t[e][o])).active = !0;
i.parent = s;
i.x = e % 2 * 9 - 6;
i.y = -5 - 10.5 * o;
this.createdNodeArr.push(i);
}
}
this.tanglangContent.getComponent(cc.ScrollView).scrollToRight();
};
e.prototype.getTanglangNodeByType = function(t) {
var e, o = this.node.getChildByName("jycopy");
e = t === r.HONG ? o.getChildByName("hong") : o.getChildByName("lan");
return cc.instantiate(e);
};
e.prototype.writeDayan = function(t) {
for (var e, o, i, n = this.dayanContent.getComponent(cc.ScrollView).content, a = 14; a < Math.ceil(t.length / 2); a++) {
var r = n.children[a];
r || ((r = cc.instantiate(n.children[n.childrenCount - 1])).parent = n);
}
for (e = 0; e < t.length; ++e) {
var l = Math.floor(e / 2), s = n.children[l];
for (o = 0; o < t[e].length; ++o) if (t[e][o]) {
(i = this.getDayanNodeType(t[e][o])).active = !0;
i.parent = s;
i.x = e % 2 * 9 - 6;
i.y = -5 - 10.5 * o;
this.createdNodeArr.push(i);
}
}
this.dayanContent.getComponent(cc.ScrollView).scrollToRight();
};
e.prototype.getDayanNodeType = function(t) {
var e, o = this.node.getChildByName("dycopy");
e = t === r.HONG ? o.getChildByName("hong") : o.getChildByName("lan");
return cc.instantiate(e);
};
e.prototype.writeDalu = function(t) {
for (var e = this.daluContent.getComponent(cc.ScrollView).content, o = e.getChildByName("item").height / 6, i = o / 2, n = 26; n < t.length; n++) (l = e.children[n]) || ((l = cc.instantiate(e.children[e.childrenCount - 1])).parent = e);
for (n = 0; n < t.length; ++n) for (var a = e.children[n], r = 0; r < t[n].length; ++r) if (t[n][r]) {
var l;
(l = this.getDaluNodeByType(t[n][r])).active = !0;
a.addChild(l, 1, "item");
l.x = -2;
l.y = -o * r - i - 1;
this.createdNodeArr.push(l);
}
this.daluContent.getComponent(cc.ScrollView).scrollToRight();
};
e.prototype.getDaluNodeByType = function(t) {
var e = this.node.getChildByName("dlcopy"), o = null;
o = (t & r.TYPE_ZHUANG) > 0 ? e.getChildByName("lan") : e.getChildByName("hong");
o = cc.instantiate(o);
if (Math.floor(t / r.TYPE_HU) > 0) {
var i = null;
(i = 12 == t ? cc.instantiate(e.getChildByName("1")) : cc.instantiate(e.getChildByName("2"))).parent = o;
i.setPosition(0, 2);
i.active = !0;
}
return o;
};
__decorate([ a(cc.Node) ], e.prototype, "zhupanContent", void 0);
__decorate([ a(cc.Node) ], e.prototype, "daluContent", void 0);
__decorate([ a(cc.Node) ], e.prototype, "dayanContent", void 0);
__decorate([ a(cc.Node) ], e.prototype, "tanglangContent", void 0);
__decorate([ a(cc.Node) ], e.prototype, "xiaoluContent", void 0);
return __decorate([ n ], e);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {} ],
LHDView: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "b5ad61QFCtLTJb2+Y8feGir", "LHDView");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("NodePool"), n = t("LHDModel"), a = cc._decorator, r = a.ccclass, l = a.property, s = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.playerContent = null;
e.myGold = null;
e.btn_Bank = null;
e.btn_go_on = null;
e.chipContent = null;
e.statusImg = [];
e.trendlist = null;
e.trendImg = [];
e.card = [];
e.cardImg = null;
e.jetton = null;
e.chipFont = [];
e.jettonPool = null;
e.jettonStartPos = null;
return e;
}
e.prototype.onLoad = function() {
this.init();
};
e.prototype.init = function() {
cc.find("bottom/player/name", this.node).getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 8);
var t = cc.find("bottom/player/head/head", this.node);
wUIHelp.setHead(t, wGameData.getKey("headimgurl"));
this.setBtn_go_on(!1);
var e = this.node.getChildByName("item");
this.jettonPool = new i.default(e);
this.jettonPool.put(e);
for (var o = function(t) {
var e = cc.find("stake/" + t, n.node);
e.on("touchstart", function() {
e.getComponent(cc.Sprite).enabled = !0;
});
e.on("touchend", function() {
e.getComponent(cc.Sprite).enabled = !1;
});
e.on("touchcancel", function() {
e.getComponent(cc.Sprite).enabled = !1;
});
}, n = this, a = 1; a < 4; a++) o(a);
};
e.prototype.setBetNum = function(t, e) {
cc.find("stake/" + {
1: "l_Label",
2: "he_Label",
3: "hu_Label"
}[t], this.node).getComponent(cc.Label).string = wUtils.goldFormat(e);
};
e.prototype.setMyBetNum = function(t, e) {
cc.find("stake/betLabel" + t, this.node).getComponent(cc.Label).string = e ? "" + wUtils.goldFormat(e) : "";
};
e.prototype.setTrend = function(t, e) {
void 0 === e && (e = !0);
var o = t.length - 14;
t = t.slice(o < 0 ? 0 : o);
for (var i = 0; i < 14; i++) {
var n = this.trendlist.children[i], a = !!t[i];
n.active = a;
a && (n.getComponent(cc.Sprite).spriteFrame = this.trendImg[t[i] - 1]);
}
(o = t.length - 1) > -1 && ((n = this.trendlist.children[o]).active = e);
};
e.prototype.openNode = function() {
for (var t = this.trendlist.children.length - 1, e = 0; e < t; e++) {
var o = this.trendlist.children[e], i = this.trendlist.children[e + 1];
if (!i) {
wLog.e("算法出现错误");
break;
}
if (0 == e && !o.active) {
o.active = !0;
break;
}
if (o.active && !i.active) {
i.active = !0;
break;
}
}
};
e.prototype.setTime = function(t, e) {
var o = this, i = this.node.getChildByName("top").getChildByName("time");
i.getComponent(cc.Label).string = "" + t;
var n = this.node.getChildByName("top").getChildByName("timeAnim");
if (2 == e && 2 == t) {
this.hidePoker();
this.startVS(function() {
o.initCard();
});
}
var a = this.node.getChildByName("top").getChildByName("img").getComponent(cc.Sprite);
if (1 == e) {
n.active = t <= 5;
i.active = t > 5;
if (t <= 5) {
n.getComponent(sp.Skeleton).setSkin("" + t);
wUIHelp.playSpine(n, "animation");
wAudioMgr.playSound("sound/jg", "LHD");
}
a.spriteFrame = this.statusImg[0];
} else {
n.active = !1;
i.active = !0;
if (t < 3) a.spriteFrame = this.statusImg[2]; else {
a.spriteFrame = this.statusImg[1];
i.getComponent(cc.Label).string = "" + (t - 3);
}
}
};
e.prototype.setBtn_Bank = function(t) {
this.btn_Bank.interactable = t;
};
e.prototype.setBtn_go_on = function(t) {
this.btn_go_on.interactable = t;
};
e.prototype.setMyGold = function(t) {
!t && (t = 0);
this.myGold.string = wUtils.numConvert(t);
};
e.prototype.upPlayer = function(t, e) {
var o = this.playerContent.getChildByName("" + t);
wUIHelp.setHead(cc.find("head/head", o), e.headimgurl);
o.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(e.username, 4);
};
e.prototype.upPlayerCpunt = function(t) {
cc.find("all/count", this.playerContent).getComponent(cc.Label).string = "" + t;
};
e.prototype.showWinGold = function(t, e) {
var o = [ "", "+", "-" ], i = 0, n = function(t) {
t.opacity = 0;
t.active = !0;
var e = cc.moveBy(.25, cc.v2(0, 30)).easing(cc.easeIn(1)), o = cc.fadeTo(.25, 255), i = cc.delayTime(2), n = cc.moveBy(.25, cc.v2(0, 30)).easing(cc.easeIn(1)), a = cc.fadeTo(.25, 255), r = cc.callFunc(function() {
t.active = !1;
}), l = cc.sequence(cc.spawn(e, o), i, cc.spawn(n, a), r);
t.runAction(l);
}, a = e.banker ? e.banker.uid : 0;
for (var r in t) if (Object.prototype.hasOwnProperty.call(t, r)) {
var l = t[r];
if (0 != l.score) {
var s = l.score > 0 ? 1 : 2;
if (r == wGameData.getKey("uid")) {
(c = this.playerContent.getChildByName("label" + s)).y = -290;
c.getComponent(cc.Label).string = o[s] + wUtils.numConvert(Math.abs(l.score));
n(c);
} else l.score > 0 && r != a && (i += l.score);
}
}
wLog.e(i);
if (i > 0) {
var c;
(c = this.playerContent.getChildByName("all1")).y = -250;
c.getComponent(cc.Label).string = "+" + wUtils.numConvert(i);
n(c);
}
};
e.prototype.waitStart = function() {
var t = this.node.getChildByName("tips").getChildByName("wait").getComponent(sp.Skeleton);
t.node.active = !0;
t.setSkin("3");
wUIHelp.playSpine(t, "animation", function() {
t.node.active = !1;
});
};
e.prototype.start_end = function(t) {
var e = this.node.getChildByName("tips").getChildByName("status");
e.active = !0;
var o = e.getComponent(sp.Skeleton);
o.setSkin(t ? "1" : "2");
wUIHelp.playSpine(o, "animation", function() {
e.active = !1;
});
};
e.prototype.startVS = function(t) {
var e = this.node.getChildByName("tips").getChildByName("start");
e.active = !0;
var o = e.getComponent(sp.Skeleton);
wAudioMgr.playSound("sound/vs", "LHD");
wUIHelp.playSpine(o, "start", function() {
e.active = !1;
t && t();
});
};
e.prototype.winType = function(t) {
var e = this.node.getChildByName("tips").getChildByName("win" + t);
e.active = !0;
wUIHelp.playSpine(e, "animation", function() {
e.active = !1;
});
};
e.prototype.particleShow = function(t) {
var e = this, o = this.node.getChildByName("tips"), i = wUtils.local_world__POS(this.trendlist.children[13]);
i = wUtils.world_local_POS(o, i);
var n = wUtils.local_world__POS(cc.find("stake/" + t, this.node));
n = wUtils.world_local_POS(o, n);
var a = o.getChildByName("lz");
a.setPosition(n);
a.active = !0;
a.getComponent(cc.ParticleSystem).resetSystem();
var r = n.sub(i).mag() / 200 * .15, l = cc.moveTo(r, i), s = cc.callFunc(function() {
a.getComponent(cc.ParticleSystem).stopSystem();
var t = o.getChildByName("lz4");
t.setPosition(i);
t.active = !0;
wUIHelp.playSpine(t, "animation", function() {
t.active = !1;
a.active = !1;
});
e.scheduleOnce(function() {
e.openNode();
e.playLZ("all");
}, .4);
});
a.runAction(cc.sequence(l, s));
};
e.prototype.setChip = function(t, e) {
var o = this.jetton.getSpriteFrame(Math.floor(e / 1e4) + ".png");
t.getComponent(cc.Sprite).spriteFrame = o;
var i = t.getChildByName("label").getComponent(cc.Label), a = n.LHDConfig.chip.indexOf(e);
i.font = this.chipFont[a];
i.string = n.LHDConfig.chipLabel[a];
t.scale = 1;
t.active = !0;
};
e.prototype.initChip = function(t, e) {
var o = this, i = 2 == e ? 60 : 80, n = this.node.getChildByName("chip"), a = wUtils.local_world__POS(cc.find("stake/" + e, this.node));
t.forEach(function(t) {
var r = o.jettonPool.getNode;
n.addChild(r, 1, "" + e);
o.setChip(r, t);
var l = wUtils.random(a.x - i, a.x + i), s = wUtils.random(a.y - 60, a.y + 35), c = wUtils.world_local_POS(n, cc.v2(l, s));
r.setPosition(c);
});
};
e.prototype.recoveryChip = function() {
var t = this.node.getChildByName("chip");
t.children.length && wLog.w("还有节点没有回收");
this.jettonPool.recoveryAll(t);
};
e.prototype.bankerRecoveryChip = function(t) {
var e = this;
if (2 != t) {
wAudioMgr.playSound("sound/chip", "LHD");
for (var o = null, i = [], n = this.node.getChildByName("chip"), a = 0, r = n.children; a < r.length; a++) {
var l = r[a];
l.name != t && i.push(l);
}
if (0 != i.length) {
var s = wUtils.local_world__POS(this.node.getChildByName("pos" + t));
s = wUtils.world_local_POS(n, s);
var c = i.length / 40;
this.schedule(function n() {
for (var a = function() {
var a = i.shift();
if (!a) {
e.unschedule(n);
if (o) {
o();
e.playLZ(t);
}
o = null;
return {
value: void 0
};
}
a.zIndex = 10;
var r = a.getPosition().sub(s).mag() / 200 * .1, l = cc.moveTo(r, s).easing(cc.easeBackIn()), c = cc.callFunc(function() {
e.jettonPool.put(a);
});
a.stopAllActions();
a.runAction(cc.sequence(l, c));
}, r = 0; r < c; r++) {
var l = a();
if ("object" == typeof l) return l.value;
}
}.bind(this), .01, 70, 0);
} else this.scheduleOnce(function() {
o();
}, .3);
return new Promise(function(t) {
o = t;
});
}
this.scheduleOnce(function() {
Promise.resolve();
}, .3);
};
e.prototype.bankerGiveChip = function(t, e, o) {
var i = this;
wAudioMgr.playSound("sound/chip", "LHD");
var n = null, a = 0;
for (var r in e) if (Object.prototype.hasOwnProperty.call(e, r)) {
var l = e[r].score;
l > 0 && (a += l);
}
if (!(a <= 0)) {
var s = function(t, e) {
var a = o.maxScoreSplit(t), r = i.node.getChildByName("chip"), l = wUtils.local_world__POS(cc.find("stake/" + e, i.node)), s = 2 == e ? 60 : 80, c = wUtils.local_world__POS(i.node.getChildByName("pos" + e));
c = wUtils.world_local_POS(r, c);
var h = Math.ceil(a.length / 40);
i.schedule(function t() {
for (var o = 0; o < h; o++) {
var d = a.shift();
if (!d) {
i.unschedule(t);
n && n();
n = null;
return;
}
var p = i.jettonPool.getNode;
p.stopAllActions();
r.addChild(p, 20, "" + e);
i.setChip(p, d);
p.setPosition(c);
var u = wUtils.random(l.x - s, l.x + s), g = wUtils.random(l.y - 60, l.y + 35), f = wUtils.world_local_POS(r, cc.v2(u, g)), y = p.getPosition().sub(f).mag() / 200 * .1, m = cc.moveTo(y, f).easing(cc.easeOut(2));
p.runAction(m);
}
}.bind(i), .01, 70, 0);
};
if (2 == t) {
s(Math.floor(a / 2), 1);
s(Math.floor(a / 2), 3);
} else s(a, t);
return new Promise(function(t) {
n = t;
});
}
this.scheduleOnce(function() {
Promise.resolve();
}, .3);
};
e.prototype.getPlayerPos = function(t, e) {
return e == wGameData.getKey("uid") ? wUtils.local_world__POS(cc.find("bottom/player/head", this.node)) : wUtils.local_world__POS(this.playerContent.getChildByName("all"));
};
e.prototype.chipFlyPlayer = function(t, e, o) {
var i = this;
wAudioMgr.playSound("sound/chip", "LHD");
for (var n = {
1: [],
2: [],
3: []
}, a = this.node.getChildByName("chip"), r = 0, l = a.children; r < l.length; r++) {
var s = l[r];
n[s.name].push(s);
}
var c = function(r) {
if (!Object.prototype.hasOwnProperty.call(e, r)) return "continue";
var l = e[r];
if (l.score > 0) {
var s = Math.floor(l.score / .97), c = o.scoreSplit(s), d = wUtils.world_local_POS(a, h.getPlayerPos(o, r)), p = c.length / 20, u = n[t].splice(0, c.length);
h.schedule(function t() {
for (var e = function() {
var e = c.shift();
if (!e) {
i.unschedule(t);
return {
value: void 0
};
}
var o = u.pop();
if (!o) return "continue";
o.stopAllActions();
i.setChip(o, e);
var n = o.getPosition().sub(d).mag() / 200 * .1, a = cc.moveTo(n, d).easing(cc.easeBackIn()), r = cc.callFunc(function() {
i.jettonPool.put(o);
});
o.runAction(cc.sequence(a, r));
}, o = 0; o < p; o++) {
var n = e();
if ("object" == typeof n) return n.value;
}
}.bind(h), .01, 70, 0);
} else if (0 == l.score) {
s = l.batGold;
for (var g = o.scoreSplit(s), f = wUtils.world_local_POS(a, h.getPlayerPos(o, r)), y = g.length / 40, m = [], v = 0; v < g.length; v++) m.push(n[1].pop() || n[3].pop());
h.schedule(function t() {
for (var e = function() {
var e = g.shift();
if (!e) {
i.unschedule(t);
return {
value: void 0
};
}
var o = m.pop();
if (!o) return "continue";
o.stopAllActions();
i.setChip(o, e);
var n = o.getPosition().sub(f).mag() / 200 * .1, a = cc.moveTo(n, f).easing(cc.easeBackIn()), r = cc.callFunc(function() {
i.jettonPool.put(o);
});
o.runAction(cc.sequence(a, r));
}, o = 0; o < y; o++) {
var n = e();
if ("object" == typeof n) return n.value;
}
}.bind(h), .01, 70, 0);
}
}, h = this;
for (var d in e) c(d);
var p = __spreadArrays(n[1], n[2], n[3]), u = p.length / 20, g = wUtils.world_local_POS(a, this.getPlayerPos(o, -1));
this.schedule(function t() {
for (var e = function() {
var e = p.pop();
if (!e) {
i.unschedule(t);
return {
value: void 0
};
}
e.stopAllActions();
var o = e.getPosition().sub(g).mag() / 200 * .1, n = cc.moveTo(o, g).easing(cc.easeBackIn()), a = cc.callFunc(function() {
i.jettonPool.put(e);
});
e.runAction(cc.sequence(n, a));
}, o = 0; o < u; o++) {
var n = e();
if ("object" == typeof n) return n.value;
}
}.bind(this), .01, 70, 0);
};
e.prototype.showChip = function(t, e, o, i) {
void 0 === i && (i = 1);
var n = 2 == o ? 60 : 80, a = this.node.getChildByName("chip"), r = this.jettonStartPos = wUtils.local_world__POS(this.playerContent.getChildByName("all")), l = wUtils.local_world__POS(cc.find("stake/" + o, this.node)), s = this.jettonPool.getNode;
a.addChild(s, i, "" + o);
this.setChip(s, e);
s.stopAllActions();
s.setPosition(wUtils.world_local_POS(a, r));
var c = wUtils.random(l.x - n, l.x + n), h = wUtils.random(l.y - 60, l.y + 35), d = wUtils.world_local_POS(a, cc.v2(c, h)), p = s.getPosition().sub(d).mag() / 200 * .12, u = cc.moveTo(p, d).easing(cc.easeOut(2));
s.runAction(u);
};
e.prototype.showMyChip = function(t, e) {
for (var o = this.node.getChildByName("chip"), i = wUtils.local_world__POS(cc.find("stake/" + t, this.node)), a = 2 == t ? 60 : 80, r = 0, l = e; r < l.length; r++) {
var s = l[r], c = n.LHDConfig.chip.indexOf(s), h = wUtils.local_world__POS(this.chipContent.children[c]);
h = wUtils.world_local_POS(o, h);
var d = this.jettonPool.getNode;
o.addChild(d, 1, "" + t);
this.setChip(d, s);
d.stopAllActions();
d.setPosition(h);
var p = wUtils.random(i.x - a, i.x + a), u = wUtils.random(i.y - 60, i.y + 35), g = wUtils.world_local_POS(o, cc.v2(p, u)), f = d.getPosition().sub(g).mag() / 200 * .1, y = cc.moveTo(f, g).easing(cc.easeOut(3));
d.runAction(y);
}
};
e.prototype.chip_On_Off = function(t) {
for (var e = n.LHDConfig.chip, o = 0, i = this.chipContent.children; o < i.length; o++) {
var a = i[o];
a.getChildByName("bg").active = t >= e[a.name];
a.getChildByName("bg").getComponent(cc.Sprite).enabled = !1;
a.getComponent(cc.Toggle).interactable = t >= e[a.name];
a.y = -9;
}
};
e.prototype.selectChip = function(t) {
for (var e = 0, o = this.chipContent.children; e < o.length; e++) {
var i = o[e];
i.y = -9;
i.getChildByName("bg").getComponent(cc.Sprite).enabled = !1;
}
var n = this.chipContent.children[t];
if (n) {
n.y = 0;
n.getChildByName("bg").getComponent(cc.Sprite).enabled = !0;
}
};
e.prototype.openCard = function(t) {
return __awaiter(this, void 0, void 0, function() {
var e, o, i;
return __generator(this, function(n) {
switch (n.label) {
case 0:
e = function(e) {
var i, n;
return __generator(this, function(a) {
switch (a.label) {
case 0:
i = o.card[e];
o.setNodePoker(i.getChildByName("poker"), t[e]);
o.setNodePoker(cc.find("CP/kanpai", i), t[e]);
i.getComponent(cc.Animation).play("lpokerAnim");
return [ 4, wUtils.syncDelayed(.17, o) ];

case 1:
a.sent();
(n = i.getChildByName("CP").getComponent(cc.Animation)).node.active = !0;
n.off("stop");
n.play();
n.on("stop", function() {
n.node.active = !1;
var o = Math.floor(t[e] / 100);
wAudioMgr.playSound("sound/" + o, "LHD");
});
return [ 4, wUtils.syncDelayed(1, o) ];

case 2:
a.sent();
wAudioMgr.playSound("sound/faipai", "LHD");
i.getComponent(cc.Animation).play("lkpAnim");
return [ 4, wUtils.syncDelayed(.2, o) ];

case 3:
a.sent();
return [ 2 ];
}
});
};
o = this;
i = 0;
n.label = 1;

case 1:
return i < 2 ? [ 5, e(i) ] : [ 3, 4 ];

case 2:
n.sent();
n.label = 3;

case 3:
i++;
return [ 3, 1 ];

case 4:
return [ 2, new Promise(function(t) {
t(1);
}) ];
}
});
});
};
e.prototype.setNodePoker = function(t, e) {
var o = Math.floor(e / 100), i = e % 100 - 1, n = t.getChildByName("p0"), a = "plist_puke_value_" + i % 2 + "_" + o;
n.getComponent(cc.Sprite).spriteFrame = this.cardImg.getSpriteFrame(a);
a = "plist_puke_color_small_" + i;
(n = t.getChildByName("h0")).getComponent(cc.Sprite).spriteFrame = this.cardImg.getSpriteFrame(a);
if (n = t.getChildByName("dh")) {
a = "plist_puke_color_big_" + i;
n.getComponent(cc.Sprite).spriteFrame = this.cardImg.getSpriteFrame(a);
}
};
e.prototype.initCard = function() {
for (var t = 0; t < 2; t++) {
var e = this.card[t];
if (!e.getChildByName("di").active) {
e.getComponent(cc.Animation).play("showPoker");
wAudioMgr.playSound("sound/faipai", "LHD");
}
}
};
e.prototype.hidePoker = function() {
for (var t = 0; t < 2; t++) this.card[t].getChildByName("poker").active = !1;
};
e.prototype.playLZ = function(t) {
var e = cc.find("pos" + t + "/winLZ", this.node);
"all" == t && (e = cc.find("player/all/winLZ", this.node));
e.active = !0;
e.getComponent(cc.ParticleSystem).resetSystem();
this.scheduleOnce(function() {
e.active = !1;
}, 1);
};
__decorate([ l(cc.Node) ], e.prototype, "playerContent", void 0);
__decorate([ l(cc.Label) ], e.prototype, "myGold", void 0);
__decorate([ l(cc.Button) ], e.prototype, "btn_Bank", void 0);
__decorate([ l(cc.Button) ], e.prototype, "btn_go_on", void 0);
__decorate([ l(cc.Node) ], e.prototype, "chipContent", void 0);
__decorate([ l([ cc.SpriteFrame ]) ], e.prototype, "statusImg", void 0);
__decorate([ l(cc.Node) ], e.prototype, "trendlist", void 0);
__decorate([ l([ cc.SpriteFrame ]) ], e.prototype, "trendImg", void 0);
__decorate([ l([ cc.Node ]) ], e.prototype, "card", void 0);
__decorate([ l(cc.SpriteAtlas) ], e.prototype, "cardImg", void 0);
__decorate([ l(cc.SpriteAtlas) ], e.prototype, "jetton", void 0);
__decorate([ l(cc.Font) ], e.prototype, "chipFont", void 0);
return __decorate([ r ], e);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {
LHDModel: "LHDModel",
NodePool: void 0
} ]
}, {}, [ "LHDChart", "LHDControlle", "LHDLoad", "LHDModel", "LHDPlayerList", "LHDTrendIem", "LHDView" ]);