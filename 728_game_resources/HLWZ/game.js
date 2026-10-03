window.__require = function e(t, i, a) {
function o(r, s) {
if (!i[r]) {
if (!t[r]) {
var l = r.split("/");
l = l[l.length - 1];
if (!t[l]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(l, !0);
if (n) return n(l, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = l;
}
var d = i[r] = {
exports: {}
};
t[r][0].call(d.exports, function(e) {
return o(t[r][1][e] || e);
}, d, d.exports, e, t, i, a);
}
return i[r].exports;
}
for (var n = "function" == typeof __require && __require, r = 0; r < a.length; r++) o(a[r]);
return o;
}({
HLWZRoomLoad: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "5b39bXcGopLEo/KsiVqRjIS", "HLWZRoomLoad");
Object.defineProperty(i, "__esModule", {
value: !0
});
var a = e("Config"), o = cc._decorator, n = o.ccclass, r = o.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.room = null;
t.load = null;
t.content = null;
t.top = null;
t.bottom = null;
t.head = null;
t.nickname = null;
t.gold = null;
t.bankGold = null;
t.isEnterRoom = !1;
t.contentX = null;
t.isAnim = !1;
t.isExit = !1;
return t;
}
t.prototype.onLoad = function() {
var e = this;
this.scheduleOnce(function() {
e.contentX || (e.contentX = wUtils.world_local_POS(e.node, wUtils.local_world__POS(e.content.children[0])).x);
}, .3);
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
this.preloadGameRes();
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
e.initShow();
}, this);
if (wGameData.isReconnect) this.loadGame(); else {
this.head && wUIHelp.setHead(this.head, wGameData.getKey("headimgurl"));
this.nickname && (this.nickname.string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10));
this.bankGold && (this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank")));
wUtils.sendMsg("Msg_Hall_GameSessions", {
gtype: wGameData.gameID
}, this).then(function(e) {
wGameData.roomConfig = e;
}).catch(function() {});
wGEvent.on("Msg_Hall_SyncGameTables", function(e) {
1 == e.status ? wGameData.tableList = e.data : wLog.e("桌面同步消息失败");
}, this);
}
};
t.prototype.onEnable = function() {
if (!wGameData.isReconnect) {
this.gold && (this.gold.string = wUtils.numConvert(wGameData.getKey("gold")));
this.enterAnim();
}
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
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
this.node.parent.destroyAllChildren();
}
};
t.prototype.enterAnim = function() {
var e = this, t = function() {
e.room.active = !0;
var t = e.content, i = e.isAnim ? e.room.getChildByName("scrollView") : e.room;
i.opacity = 0;
var a = cc.fadeTo(.2, 255);
i.runAction(a);
for (var o = 1; o < t.childrenCount; o++) {
var n = t.children[o];
!n.endPos && (n.endPos = cc.v2(n.x, n.y));
n.x = n.endPos.x + 250;
var r = cc.moveTo(.2, n.endPos).easing(cc.easeBackOut());
r.speed(.5);
n.stopAllActions();
n.runAction(r);
}
e.isAnim = !0;
};
if (this.load.active) {
var i = this.load.getChildByName("logo");
i.y = 150;
var a = cc.moveTo(.15, cc.v2(0, 0)), o = cc.fadeTo(.1, 255), n = cc.delayTime(.05), r = cc.fadeTo(.06, 0), s = cc.moveTo(.1, cc.v2(0, 150)), l = cc.callFunc(function() {
e.load.active = !1;
}), c = cc.sequence(cc.spawn(a, o), n, cc.spawn(r, s), l);
i.runAction(c);
this.scheduleOnce(function() {
t();
}, .25);
} else t();
};
t.prototype.exitAnim = function() {
var e = this, t = this.content;
this.node.children[0].active = !1;
this.room.getChildByName("bottom").active = !1;
this.room.getChildByName("logo").active = !1;
var i = this.room.getChildByName("scrollView"), a = cc.fadeTo(.15, 0), o = cc.callFunc(function() {
i.opacity = 255;
e.node.children[0].active = !0;
e.room.getChildByName("bottom").active = !0;
e.room.getChildByName("logo").active = !0;
e.isEnterRoom = !1;
e.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
e.node.parent.destroyAllChildren();
}
});
i.runAction(cc.sequence(a, o));
for (var n = function(e) {
var i = t.children[e], a = cc.v2(i.x, i.y), o = cc.moveBy(.2, cc.v2(250, 0)), n = cc.callFunc(function() {
i.setPosition(a);
});
i.runAction(cc.sequence(o, n));
}, r = 1; r < t.childrenCount; r++) n(r);
};
t.prototype.Msg_Hall_EnterGame = function(e) {
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
var i = wGameData.roomConfig[e];
if (i) if (i.min_gold > wGameData.getKey("gold")) wUIManager.enterRoomFailTips(i.min_gold); else if (wGameData.gameRepair()) wUIManager.showTips("游戏维护中"); else {
this.isEnterRoom = !0;
var a = wGEvent.on("Msg_Hall_EnterGame", function(e) {
t.Msg_Hall_EnterGame(e);
wGEvent.off(a);
t.unscheduleAllCallbacks();
a = null;
}, this);
this.scheduleOnce(function() {
if (a) {
t.isEnterRoom = !1;
wGEvent.off(a);
}
}, 20);
wNetWork.send("Msg_Hall_EnterGame", {
tableid: 0,
gtype: Number(wGameData.gameID),
level: e
});
} else wUIManager.showTips("游戏配置错误，请重新进入游戏！");
}
};
t.prototype.faststart = function() {
var e = wGameData.getKey("gold"), t = wGameData.roomConfig, i = 1;
for (var a in t) Object.prototype.hasOwnProperty.call(t, a) && t[a].min_gold <= e && (i = t[a].level);
this.enterRoom(i);
};
t.prototype.roomOnClick = function(e) {
wAudioMgr.playBtnSound();
var t = e.target.name;
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
var e = this, t = a.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(t.prefabUrl, function() {}, function(t, i) {
if (t) wLog.e(t); else {
wViewMgr.openGame(i);
e.scheduleOnce(function() {
e.exitAnim();
});
}
}, t.enName);
};
t.prototype.preloadGameRes = function() {
var e = a.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir(e.prefabUrl, e.enName);
};
__decorate([ r(cc.Node) ], t.prototype, "room", void 0);
__decorate([ r(cc.Node) ], t.prototype, "load", void 0);
__decorate([ r(cc.Node) ], t.prototype, "content", void 0);
__decorate([ r(cc.Node) ], t.prototype, "top", void 0);
__decorate([ r(cc.Node) ], t.prototype, "bottom", void 0);
__decorate([ r(cc.Sprite) ], t.prototype, "head", void 0);
__decorate([ r(cc.Label) ], t.prototype, "nickname", void 0);
__decorate([ r(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ r(cc.Label) ], t.prototype, "bankGold", void 0);
return __decorate([ n ], t);
}(cc.Component);
i.default = s;
cc._RF.pop();
}, {
Config: void 0
} ],
HLWZTableSelect: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "74cccemjMBGiZoCOla1jZBd", "HLWZTableSelect");
Object.defineProperty(i, "__esModule", {
value: !0
});
var a = cc._decorator, o = a.ccclass, n = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.title = null;
t.content = null;
t.copyItem = null;
t.tableList = {};
t.maxTableNum = 2;
return t;
}
t.prototype.onLoad = function() {
this.initTable();
this.initTableList(wGameData.tableList);
this.updateTitle();
wGEvent.on("Msg_Hall_SyncGameTables", this.Msg_Hall_SyncGameTables, this);
};
t.prototype.sendMsg = function() {};
t.prototype.initTable = function() {
for (var e = 1; e <= wConstant.maxTable; e++) {
var t = {
tableID: e,
player: {}
};
this.tableList[e] = t;
this.initItem(t);
}
};
t.prototype.Msg_Hall_SyncGameTables = function(e) {
if (1 == e.status) {
this.initTable();
wGameData.tableList = e.data;
this.initTableList(wGameData.tableList);
} else wLog.e("桌面同步消息失败");
};
t.prototype.initTableList = function(e) {
for (var t in e) if (Object.prototype.hasOwnProperty.call(e, t)) {
var i = {
tableID: t,
player: e[t].players,
status: e[t].status
};
this.tableList[t] = i;
this.initItem(i);
}
};
t.prototype.initItem = function(e) {
var t = e.tableID, i = this.content.getChildByName("" + t);
if (!i) {
i = cc.instantiate(this.copyItem);
this.content.addChild(i, 1, "" + t);
}
i.getChildByName("idx").getComponent(cc.Label).string = e.tableID < 10 ? "0" + e.tableID : e.tableID;
for (var a = 0; a < 2; a++) {
var o = i.getChildByName("player" + a);
o.getChildByName("info").active = !1;
o.getChildByName("zw").active = !0;
}
for (var n in e.player) if (Object.prototype.hasOwnProperty.call(e.player, n)) {
var r = i.getChildByName("player" + (Number(n) - 1));
wUIHelp.setHead(cc.find("info/head", r), e.player[n].head, !0);
cc.find("info/name", r).getComponent(cc.Label).string = wUtils.handleNameLen(e.player[n].nickname, 8);
cc.find("info/zb", r).active = 0 == e.status;
r.getChildByName("info").active = !0;
r.getChildByName("zw").active = !1;
}
i.stopAllActions();
i.active = !0;
i.getChildByName("bg").tableID = e.tableID;
i.getChildByName("state").active = Object.keys(e.player).length >= this.maxTableNum && 1 == e.status;
};
t.prototype.kuStartSend = function() {
for (var e = [], t = -1, i = 1; i <= wConstant.maxTable; i++) {
var a = this.tableList[i];
Object.keys(a.player).length < this.maxTableNum && e.push(a);
}
e.sort(function(e, t) {
return Object.keys(t.player).length - Object.keys(e.player).length;
});
e.length && (t = e[0].tableID);
this.sendAddTable(t);
};
t.prototype.checkRoomNum = function(e) {
var t = this.tableList[e];
return !(t && Object.keys(t.player).length >= this.maxTableNum);
};
t.prototype.sendAddTable = function(e) {
this.checkRoomNum(e) ? wGEvent.emit("local_Event", "changeTable", e) : wUIManager.showTips("此桌人数已满,请选择其他桌");
};
t.prototype.onClick = function(e, t) {
switch (t) {
case "rule":
wAudioMgr.playBtnSound();
wViewMgr.openPage({
path: "prefab/Rule",
bundle: wGameData.getGameName()
});
break;

case "ksks":
wAudioMgr.playBtnSound();
this.kuStartSend();
break;

case "exit":
wAudioMgr.playCloseSound();
wUIManager.showGameOutTips({
okCB: function() {
wNetWork.send("Msg_Hall_OutGame", {
gtype: Number(wGameData.gameID),
level: wGameData.roomLevel
});
}
});
break;

default:
wAudioMgr.playBtnSound();
this.sendAddTable(e.target.tableID);
}
};
t.prototype.updateTitle = function() {
var e = this.title.getComponent(sp.Skeleton);
e.setSkin("level" + wGameData.roomLevel);
e.setAnimation(0, "start", !1) && e.setCompleteListener(function(t) {
"start" == (t.animation.name ? t.animation.name : "") && e.setAnimation(0, "idle", !0);
});
};
__decorate([ n(cc.Node) ], t.prototype, "title", void 0);
__decorate([ n(cc.Node) ], t.prototype, "content", void 0);
__decorate([ n(cc.Node) ], t.prototype, "copyItem", void 0);
return __decorate([ o ], t);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {} ],
HLWZ_Controlle: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "2af2014fKZOiLlACMMqkxsF", "HLWZ_Controlle");
Object.defineProperty(i, "__esModule", {
value: !0
});
var a = e("PokerTableBase"), o = e("HLWZ_Player"), n = e("HLWZ_View"), r = cc._decorator, s = r.ccclass, l = r.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.playerView = [];
t.isAllIn = !1;
t.fapaiCount = 0;
t.betCount = 0;
t.minbet = 0;
t.allbet = 0;
t.curbet = [];
t.readytime = 30;
t.View = null;
t.playerList = {};
return t;
}
t.prototype.start = function() {
this.View = this.node.getComponent(n.default);
this.initMsgEvevt();
this.p_init();
};
t.prototype.p_roomInfo = function(e) {
var t = e.players;
this.View.setTableInfo(e.rid, e.tid);
for (var i in t) {
var a = t[i], o = this.getSeat(a.uid);
a.seat = o;
var n = this.playerView[a.seat];
n.initPlayer(a);
a.playerView = n;
this.playerList[o] = a;
}
var r = this.playerList[0];
this.doublescore = e.doublescore;
this.gameState = e.stage;
this.fapaiCount = this.gameState;
this.View.setAllInFire(!1);
if (0 == this.gameState) {
this.View.setTotalBet(!1, 0);
r.ready || this.View.setStartBtn(!0);
for (var s in this.playerList) {
(a = this.playerList[s]).playerView.setProgTime(this.readytime);
a.playerView.setState(0, a.ready);
a.ready && a.playerView.setProgTime(0);
}
1 == e.level && 1e7 == r.gold && wUIManager.showConfirmUI_B({
type: 3
});
} else {
for (var s in e.allbets) {
var l = this.getSeat(s);
this.View.jettonAnim(l, e.allbets[s]);
}
var c = 0;
for (var s in e.curbet) {
var d = this.getSeat(s), p = this.playerList[d];
this.View.setBet(d, e.curbet[s].gold);
p.playerView.setState(e.curbet[s].act, !0);
4 == e.curbet[s].act && this.View.setAllInFire(!0);
c++;
}
this.betCount = c;
this.minbet = e.notice.minbet;
this.allbet = e.allbet;
o = this.getSeat(e.notice.uid);
(a = this.getPlayer(e.notice.uid)).playerView.setProgTime(e.notice.time);
if (0 == o) {
this.View.setBetButton(!0);
this.View.initXZBet(this.doublescore, this.betCount, e.notice.isda, this.fapaiCount);
}
this.View.setTotalBet(!0, e.allbet);
for (var h = [], u = 0; u < e.players.length; u++) e.players[u].uid == wGameData.getKey("uid") ? h[0] = e.players[u].cards : h[1] = e.players[u].cards;
this.View.initPaiShow(h);
}
this.p_setBankBtn(0 == this.gameState);
};
t.prototype.Msg_HLWZ_Ready = function(e) {
this.isAllIn = !1;
this.fapaiCount = 0;
this.allbet = 0;
this.View.setWinNum(!1);
var t = e.data;
this.getPlayer(t.uid);
if (t.uid == wGameData.getKey("uid")) {
this.View.setStartBtn(!1);
this.View.initPoker();
this.View.isCardB = !0;
this.View.isopen = !1;
var i = this.playerList[0];
i.playerView.setProgTime(0);
i.playerView.setState(0, !0);
}
};
t.prototype.Msg_HLWZ_PlayerAct = function(e) {
var t = e.data, i = this.getSeat(t.uid);
t.seat = i;
var a = this.playerView[t.seat];
a.initPlayer(t);
t.playerView = a;
this.playerList[i] = t;
a.setProgTime(this.readytime);
};
t.prototype.Msg_HLWZ_CallUserAct = function(e) {
var t = this;
this.clearPlayerState();
for (var i in this.playerList) this.playerList[i].playerView.setProgTime(0);
var a = e.data, o = this.getPlayer(a.uid), n = this.getSeat(o.uid);
this.minbet = a.minbet;
var r = 0 == this.betCount ? 1 : 0;
o.playerView.setProgTime(a.time - .5);
this.scheduleOnce(function() {
if (0 == n) {
t.View.setBetButton(!0);
t.View.initXZBet(t.doublescore, t.betCount, a.isda, t.fapaiCount);
}
t.betCount++;
}, .2 + r);
};
t.prototype.Msg_HLWZ_FaCards = function(e) {
var t = this;
this.curbet = [ 0, 0 ];
this.betCount = 0;
var i = e.data;
this.View.setBetButton(!1);
if (0 == this.fapaiCount) {
this.doublescore;
for (var a in this.playerList) {
var o = this.playerList[a], n = this.getSeat(o.uid);
this.View.jettonAnim(n, 2 * this.doublescore);
this.allbet += 2 * this.doublescore;
o.gold -= 2 * this.doublescore;
o.playerView.setGold(o.gold);
}
this.View.setTotalBet(!0, this.allbet);
}
this.fapaiCount++;
this.scheduleOnce(function() {
t.gameState = 1;
t.View.setBet(0);
t.View.setBet(1);
t.clearPlayerState();
var e = [ i.cards[wGameData.getKey("uid")], i.cards[t.playerList[1].uid] ];
t.View.sendCard(e);
}, .5);
};
t.prototype.Msg_HLWZ_LookCards = function(e) {
var t = e.data;
this.getPlayer(t.uid).playerView.setState(5, !0);
t.uid != wGameData.getKey("uid") && this.View.showOtherLookCard();
};
t.prototype.Msg_HLWZ_ActBet = function(e) {
var t = e.data;
this.clearPlayerState();
for (var i in this.playerList) this.playerList[i].playerView.setProgTime(0);
var a = this.getPlayer(t.uid), o = this.getSeat(t.uid);
if (4 == t.act) {
this.isAllIn = !0;
a.playerView.allInShow(!0);
wAudioMgr.playBgMusic("sound/allinBg", "HLWZ");
this.View.setAllInFire(!0);
}
wAudioMgr.playSound("sound/act" + t.act + "_" + o, "HLWZ");
a.playerView.setState(t.act, !0);
t.uid == wGameData.getKey("uid") && this.View.setBetButton(!1);
if (3 != t.act) {
this.View.jettonAnim(o, t.gold);
this.allbet += t.gold;
this.View.setTotalBet(!0, this.allbet);
this.curbet[o] += t.gold;
this.View.setBet(o, this.curbet[o]);
a.gold -= t.gold;
a.playerView.setGold(a.gold);
}
};
t.prototype.Msg_HLWZ_Result = function(e) {
var t = this, i = e.data;
this.gameState = 3;
for (var a in this.playerList) {
var o = this.playerList[a];
o.playerView.setProgTime(0);
o.playerView.allInShow(!1);
}
this.View.setBetButton(!1);
this.scheduleOnce(function() {
t.View.setAllInFire(!1);
t.View.setBet(0);
t.View.setBet(1);
t.clearPlayerState();
t.View.kaiPaiShow(i.cards);
t.View.setTotalBet(!1, 0);
wAudioMgr.playBgMusic("sound/bgm", "HLWZ");
var e = t.playerList[0];
t.View.winShow(i.winner, i.usergold[e.uid] - e.playerView.selfgold);
for (var a in t.playerList) {
(n = t.playerList[a]).gold = i.usergold[n.uid];
n.playerView.setGold(i.usergold[n.uid]);
n.playerView.setTotal(i.usergold[n.uid]);
}
t.gameState = 0;
t.isAllIn = !1;
for (var o in t.playerList) {
var n;
(n = t.playerList[o]).playerView.setProgTime(t.readytime);
}
t.scheduleOnce(function() {
t.View.setStartBtn(!0, !0);
}, 2);
}, .7 + (this.isAllIn ? .8 : 0));
this.scheduleOnce(function() {
t.p_setBankBtn(!0);
t.playerList[0].gold < t.doublescore && wUIManager.showTips("您的金币少于入场限制" + t.doublescore + "，不能进行游戏！");
}, 3);
};
t.prototype.p_quitGame = function() {
this.playerView[1].initPlayer(null);
this.node.getChildByName("poker").getChildByName("1").active = !1;
this.node.getChildByName("poker").getChildByName("1type").active = !1;
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "chat":
break;

case "table":
if (0 != this.gameState) {
wUIManager.showTips("游戏正在进行中！", wUIManager.TIPS_OK);
return;
}
wGEvent.emit("local_Event", "changeTable");
break;

case "bank":
if (1 == wGameData.roomLevel) {
wUIManager.showTips("体验场不能打开银行", wUIManager.TIPS_OK);
return;
}
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
break;

case "hall":
if (0 != this.gameState) {
wUIManager.showTips("游戏正在进行中！", wUIManager.TIPS_OK);
return;
}
wAudioMgr.playCloseSound();
this.p_sendQuitGame();
break;

case "start":
wNetWork.send("Msg_HLWZ_Ready", []);
break;

case "showmaincard":
this.View.showMyCard();
}
};
t.prototype.betOnClick = function(e, t) {
wAudioMgr.playBtnSound();
var i = -1;
switch (t) {
case "fold":
i = -1;
break;

case "allin":
i = this.playerList[0].gold;
break;

case "call":
i = this.minbet;
break;

case "bujia":
i = 0;
break;

case "bet1":
i = this.doublescore + this.minbet;
break;

case "bet2":
i = 2 * this.doublescore + this.minbet;
break;

case "bet3":
i = 4 * this.doublescore + this.minbet;
}
wNetWork.send("Msg_HLWZ_ActBet", {
gold: i
});
};
t.prototype.p_upGameGold = function(e) {
this.playerList[0].gold = e;
this.playerList[0].playerView.setGold(e);
};
t.prototype.initMsgEvevt = function() {
for (var e = this, t = function(t) {
wGEvent.on(t, function(i) {
1 == i.status ? e[t](i) : console.error("evevt", i);
}, i);
}, i = this, a = 0, o = [ "Msg_HLWZ_Ready", "Msg_HLWZ_FaCards", "Msg_HLWZ_StageBet", "Msg_HLWZ_CallUserAct", "Msg_HLWZ_LookCards", "Msg_HLWZ_ActBet", "Msg_HLWZ_Result", "Msg_HLWZ_PlayerAct", "Msg_HLWZ_ChangGold" ]; a < o.length; a++) t(o[a]);
};
t.prototype.getSeat = function(e) {
return e == wGameData.getKey("uid") ? 0 : 1;
};
t.prototype.getPlayer = function(e) {
return this.playerList[this.getSeat(e)];
};
t.prototype.Msg_HLWZ_ChangGold = function(e) {
var t = this.getPlayer(e.data.uid);
t.gold = e.data.gold;
t.playerView.setGold(e.data.gold);
};
t.prototype.clearPlayerState = function() {
for (var e in this.playerList) this.playerList[e].playerView.setState("", !1);
};
__decorate([ l(o.default) ], t.prototype, "playerView", void 0);
return __decorate([ s ], t);
}(a.default);
i.default = c;
cc._RF.pop();
}, {
HLWZ_Player: "HLWZ_Player",
HLWZ_View: "HLWZ_View",
PokerTableBase: void 0
} ],
HLWZ_Player: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "a626fGEv5xHa5gd22rwotzy", "HLWZ_Player");
Object.defineProperty(i, "__esModule", {
value: !0
});
var a = cc._decorator, o = a.ccclass;
a.property;
var n = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.head = null;
t.prog = null;
t.gold = null;
t.state = null;
return t;
}
t.prototype.onLoad = function() {
this.initNode();
};
t.prototype.initNode = function() {
this.head = this.node.getChildByName("head").getComponent(cc.Sprite);
this.prog = this.node.getChildByName("prog");
this.gold = this.node.getChildByName("gold").getComponent(cc.Label);
this.state = this.node.getChildByName("state");
};
t.prototype.initPlayer = function(e) {
if (e) {
this.node.active = !0;
this.head.spriteFrame = null;
wUIHelp.setHead(this.head, e.headimgurl, !0);
this.node.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(e.nickname, 6);
wUIHelp.hideSonNode(this.state);
this.setGold(e.gold);
this.setProgTime(0);
this.setTotal(e.gold);
} else this.node.active = !1;
};
t.prototype.setGold = function(e) {
this.gold.string = wUtils.goldFormat(e, 2);
};
t.prototype.setTotal = function(e) {
this.selfgold = e;
};
t.prototype.setState = function(e, t) {
var i = "";
switch (e) {
case 0:
i = "准备";
break;

case 1:
i = "加注";
break;

case 2:
i = "跟注";
break;

case 3:
i = "弃牌";
break;

case 4:
i = "全下";
break;

case 5:
i = "已看牌";
}
var a = this.state.getChildByName("zb");
a.active = t;
a.getChildByName("New Label").getComponent(cc.Label).string = i;
};
t.prototype.setProgTime = function(e) {
if (e <= 0) this.prog.active = !1; else {
this.prog.active = !0;
this.prog.getComponent(cc.Animation).play().speed = 1 / e;
}
};
t.prototype.winShow = function() {
var e = this.node.getChildByName("win").getComponent(sp.Skeleton);
e.node.active = !0;
e.setAnimation(1, "animation", !0);
var t = cc.delayTime(2), i = cc.callFunc(function() {
e.node.active = !1;
});
e.node.runAction(cc.sequence(t, i));
};
t.prototype.allInShow = function(e) {
var t = this.node.getChildByName("allin").getComponent(sp.Skeleton);
t.node.active = e;
t.setAnimation(1, "animation", !0);
};
return __decorate([ o ], t);
}(cc.Component);
i.default = n;
cc._RF.pop();
}, {} ],
HLWZ_View: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "33f7fsY2aNLm6W1ASxbqWmL", "HLWZ_View");
Object.defineProperty(i, "__esModule", {
value: !0
});
var a = cc._decorator, o = a.ccclass, n = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.typeSpine = [];
t.title = null;
t.pokerImg = null;
t.selfcard = null;
t.titleImg = [];
t.jettonImg = [];
t.font = [];
t.cardType = [];
t.isopen = !1;
t.isCardB = !0;
t.jetlist = [ 1, 10, 100, 200, 1e3, 1e4, 1e5, 1e6, 5e6, 1e7 ];
t.cardPosX = [ -10, -40, -70, -100 ];
t.cards = [];
t.posy = [ -190, 290 ];
t.posx = [ 20, 70, 90, 110, 130 ];
return t;
}
t.prototype.onLoad = function() {
this.controlle = this.node.getComponent("HLWZ_Controlle");
};
t.prototype.setTableInfo = function(e, t) {
this.title.spriteFrame = this.titleImg[wGameData.roomLevel - 1];
this.title.node.getChildByName("roomid").getChildByName("tid").getComponent(cc.Label).string = "" + t;
};
t.prototype.setPlayerNum = function(e) {
this.node.getChildByName("playerNum").getChildByName("label").getComponent(cc.Label).string = "" + e;
};
t.prototype.setAllInFire = function(e) {
var t = this.node.getChildByName("Effect");
t.active = e;
if (1 == e) {
t.getComponent(sp.Skeleton).setAnimation(1, "animation", !0);
t.scaleX = this.node.x / t.x;
}
};
t.prototype.setTotalBet = function(e, t) {
var i = this.node.getChildByName("totalBet");
i.active = e;
i.getChildByName("num").getComponent(cc.Label).string = wUtils.numConvert(t);
};
t.prototype.setStartBtn = function(e, t) {
void 0 === t && (t = !1);
var i = this.node.getChildByName("btn");
wUIHelp.hideSonNode(i);
var a = i.getChildByName("start");
a.active = e && !this.controlle.myAuto;
a.active && t ? a.setPosition(385, -170) : a.setPosition(0, -170);
};
t.prototype.setBetButton = function(e) {
var t = this.node.getChildByName("btn");
wUIHelp.hideSonNode(t);
if (e) {
t.getChildByName("bettle").y = -280;
t.getChildByName("bettle").getComponent(cc.Animation).play();
} else t.getChildByName("bettle").active = e;
};
t.prototype.initXZBet = function(e, t, i, a) {
var o = this.node.getChildByName("btn").getChildByName("bettle");
o.active = Boolean(e);
if (o.active) {
for (var n = 0; n < 3; n++) {
var r = o.getChildByName("bet" + n);
r.num = e * Math.pow(2, n);
r.children[1].getComponent(cc.Label).string = wUtils.numConvert(r.num);
if (2 == i) {
r.getComponent(cc.Button).interactable = !0;
r.children[0].active = !1;
} else {
r.getComponent(cc.Button).interactable = !1;
r.children[0].active = !0;
}
}
var s = o.getChildByName("allin");
if (i > 0 && a >= 2) {
s.getComponent(cc.Button).interactable = !0;
s.children[0].active = !1;
} else {
s.getComponent(cc.Button).interactable = !1;
s.children[0].active = !0;
}
var l = o.getChildByName("call"), c = o.getChildByName("bujia");
if (0 == t) {
c.active = !0;
l.active = !1;
} else {
c.active = !1;
l.active = !0;
}
}
};
t.prototype.setWinNum = function(e, t) {
var i = this.node.getChildByName("winNum").getChildByName("z").getComponent(cc.Label);
i.node.active = e;
if (t && 0 != t) {
var a;
if (t > 0) {
wAudioMgr.playSound("sound/game_win", "HLWZ");
i.font = this.font[0];
a = "+";
} else {
wAudioMgr.playSound("sound/game_lose", "HLWZ");
i.font = this.font[1];
}
i.string = a + wUtils.numConvert(t);
} else i.node.active = !1;
};
t.prototype.jettonAnim = function(e, t) {
if (0 != t) for (var i = wUtils.splitBet(this.jetlist, t), a = [ -280, 280 ], o = [ -30, 70 ], n = this.node.getChildByName("jetnode"), r = wUtils.local_world__POS(cc.find("player/" + e + "/head", this.node), this.node), s = function(e) {
var t = i[1][e], s = cc.instantiate(n);
s.parent = l.node.getChildByName("jetton");
s.active = !0;
s.getComponent(cc.Sprite).spriteFrame = l.jettonImg[t];
s.setPosition(r);
s.scale = .4;
var c = cc.v2(wUtils.random(a[0], a[1]), wUtils.random(o[0], o[1])), d = wUtils.random(0, 2);
l.scheduleOnce(function() {
wAudioMgr.playSound("sound/addscore", "HLWZ");
var e = cc.moveTo(.2, c), t = cc.scaleTo(.1, 1), i = cc.spawn(e, t);
s.runAction(i);
}, .1 * d);
}, l = this, c = 0; c < i[1].length; c++) s(c);
};
t.prototype.setBet = function(e, t) {
var i = this.node.getChildByName("player").children[e].getChildByName("bet");
i.getComponent(cc.Label).string = t ? "+" + wUtils.numConvert(t) : "";
var a = i.getChildByName("sp").getComponent(sp.Skeleton);
a.node.active = !!t;
t && a.setAnimation(1, "animation", !1);
};
t.prototype.winShow = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
var i, a, o = this;
return __generator(this, function(n) {
switch (n.label) {
case 0:
wGameData.getKey("uid");
this.setWinNum(!0, t);
i = this.controlle.getSeat(e);
a = function(e) {
for (var t = o.node.getChildByName("jetton"), i = wUtils.local_world__POS(cc.find("player/" + e + "/head", o.node), o.node), a = function(e) {
var a = t.children[e];
!a.ePos && (a.ePos = a.getPosition());
wAudioMgr.playSound("sound/getscore", "HLWZ");
var o = cc.moveTo(.4, cc.v2(i.x, i.y)), n = cc.scaleTo(.4, .4), r = cc.spawn(o, n), s = cc.callFunc(function() {
a.active = !1;
a.scale = 1;
3 == e && a.destroy();
}), l = cc.sequence(r, s);
a.stopAllActions();
a.runAction(l);
}, n = 0; n < t.children.length; n++) a(n);
};
return [ 4, wUtils.syncDelayed(.7, this) ];

case 1:
n.sent();
a(i);
return [ 2 ];
}
});
});
};
t.prototype.kaiPaiShow = function(e) {
var t = this.node.getChildByName("poker");
for (var i in e) {
var a = e[i], o = i == wGameData.getKey("uid") ? 0 : 1, n = t.getChildByName("" + o);
n.active = !0;
for (var r = 0; r < a.cards.length; r++) {
var s = a.cards[r], l = n.children[r];
this.setPokerNode(s, l);
var c = this.pokerImg.getSpriteFrame("plist_puke_front_big");
l.getComponent(cc.Sprite).spriteFrame = c;
wUIHelp.hideSonNode(l, !0);
}
var d = 0;
if (-1 == a.value) {
d = 0;
wAudioMgr.playSound("sound/guo_" + o, "HLWZ");
} else {
d = a.value;
4 != a.value && wAudioMgr.playSound("sound/type" + a.value + "_" + o, "HLWZ");
}
var p = this.typeSpine[d];
this.cardType[o].node.active = !0;
this.cardType[o].skeletonData = p;
this.cardType[o].setAnimation(1, "animation", !1);
}
};
t.prototype.initPaiShow = function(e) {
this.cards = wUtils.clone(e);
for (var t = this.node.getChildByName("poker"), i = 0; i < 2; i++) {
var a = e[i], o = t.getChildByName("" + i);
o.active = !0;
wUIHelp.hideSonNode(o);
for (var n = this.cardPosX[a.length - 2], r = 0; r < a.length; r++) {
var s = o.children[r];
s.active = !0;
s.setPosition(cc.v2(n + 50 * r, this.posy[i]));
s.spos = s.getPosition();
wUIHelp.hideSonNode(s);
if (0 != r) {
this.setPokerNode(a[r], s);
var l = this.pokerImg.getSpriteFrame("plist_puke_front_big");
s.getComponent(cc.Sprite).spriteFrame = l;
wUIHelp.hideSonNode(s, !0);
}
}
}
};
t.prototype.sendCard = function(e) {
if (0 == this.cards.length) {
this.initPoker();
for (var t = this.node.getChildByName("poker"), i = 0; i < 2; i++) {
var a = t.getChildByName("" + i);
a.active = !0;
wUIHelp.hideSonNode(a);
}
this.cards = wUtils.clone(e);
this.faPaiShow(e, 1);
} else {
var o = [], n = this.cards[0].length;
for (i = 0; i < e.length; i++) {
o[i] = [];
for (var r = 0, s = n; s < e[i].length; s++) {
this.cards[i][s] = e[i][s];
o[i][r] = e[i][s];
r++;
}
}
this.faPaiShow(o, n);
}
};
t.prototype.faPaiShow = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
var i, a, o, n, r, s = this;
return __generator(this, function(l) {
switch (l.label) {
case 0:
i = this.node.getChildByName("poker");
a = this.node.getChildByName("sendCard").getChildByName("fapaiqi");
return [ 4, new Promise(function(o) {
for (var n = 0; n < 2; n++) for (var r = s.posy[n], l = i.getChildByName("" + n), c = 0; c < e[n].length; c++) for (var d = 0, p = l.children; d < p.length; d++) if (1 != (_ = p[d]).active) {
_.active = !0;
wUIHelp.hideSonNode(_);
var h = s.pokerImg.getSpriteFrame("plist_puke_back_big_3");
_.getComponent(cc.Sprite).spriteFrame = h;
_.spos = cc.v2(s.posx[Number(_.name)], r);
c >= 1 && 1 != t && (_.spos.x += 30 * c);
_.position = a.position;
_.scale = .3;
wAudioMgr.playSound("sound/fapai", "HLWZ");
var u = cc.delayTime(.08 * c), m = cc.moveTo(.2, _.spos), g = cc.scaleTo(.15, 1), y = cc.sequence(u, cc.spawn(m, g));
_.runAction(y);
break;
}
var v = .2 + .08 * e[0].length;
for (n = 0; n < 2; n++) for (var f = 0, w = (l = i.getChildByName("" + n)).children; f < w.length; f++) {
var _;
if ((_ = w[f]).active) {
var b = 1 != t ? e[0].length : 1, C = cc.v2(_.spos.x - 30 * b, _.spos.y);
_.spos = C;
u = cc.delayTime(v);
m = cc.moveTo(.1, C);
g = cc.callFunc(function() {
o();
});
y = cc.sequence(u, m, g);
_.runAction(y);
}
}
}) ];

case 1:
l.sent();
o = function(e) {
var a = n.cards[e], o = i.getChildByName("" + e);
o.active = !0;
for (var r = function(e) {
var t = o.children[e];
t.is3DNode = !0;
var i = cc.moveTo(.1, t.spos), n = cc.callFunc(function() {
var i = cc.rotate3DBy(.1, cc.v3(0, -90, 0)), o = cc.callFunc(function() {
s.setPokerNode(a[e], t);
var i = s.pokerImg.getSpriteFrame("plist_puke_front_big");
t.getComponent(cc.Sprite).spriteFrame = i;
wUIHelp.hideSonNode(t, !0);
}), n = cc.rotate3DBy(.1, cc.v3(0, 90, 0)), r = cc.sequence(i, o, n);
t.runAction(r);
}), r = cc.sequence(i, n);
t.runAction(r);
}, l = t; l < a.length; l++) r(l);
};
n = this;
for (r = 0; r < 2; r++) o(r);
return [ 2 ];
}
});
});
};
t.prototype.showMyCard = function() {
var e = this;
this.isCardB = !this.isCardB;
this.selfcard.interactable = !1;
var t = this.cards[0][0], i = this.node.getChildByName("poker").getChildByName("0");
i.active = !0;
var a = i.children[0];
this.rotateCard = a;
var o = cc.moveTo(.1, a.spos), n = cc.callFunc(function() {
var i = cc.rotate3DBy(.1, cc.v3(0, -90, 0)), o = cc.callFunc(function() {
wUIHelp.hideSonNode(a);
if (e.isopen) {
i = e.pokerImg.getSpriteFrame("plist_puke_back_big_3");
a.getComponent(cc.Sprite).spriteFrame = i;
e.isopen = !1;
} else {
e.setPokerNode(t, a);
var i = e.pokerImg.getSpriteFrame("plist_puke_front_big");
a.getComponent(cc.Sprite).spriteFrame = i;
e.isopen = !0;
wUIHelp.hideSonNode(a, !0);
}
!e.isCardB && e.controlle.gameState > 0 && wNetWork.send("Msg_HLWZ_LookCards", {});
}), n = cc.rotate3DBy(.1, cc.v3(0, 90, 0)), r = cc.callFunc(function() {
e.selfcard.interactable = !0;
}), s = cc.sequence(i, o, n, r);
a.runAction(s);
}), r = cc.sequence(o, n);
a.runAction(r);
};
t.prototype.showOtherLookCard = function() {
var e = this.node.getChildByName("poker").getChildByName("1").getChildByName("0"), t = e.spos, i = cc.moveTo(.2, cc.v2(t.x - 50, t.y + 60)), a = cc.moveTo(.2, t), o = cc.sequence(i, a);
e.runAction(o);
};
t.prototype.initPoker = function() {
this.cards = [];
for (var e = 0, t = this.node.getChildByName("poker").children; e < t.length; e++) t[e].active = !1;
};
t.prototype.getPokerUrl = function(e) {
var t = Math.floor(e / 100), i = e % 100 - 1;
return {
pai: "plist_puke_value_" + i % 2 + "_" + (t = t > 13 ? t - 13 : t),
hua: "plist_puke_color_small_" + i,
dh: "plist_puke_color_big_" + i
};
};
t.prototype.setPokerNode = function(e, t) {
t.children[1].opacity = 0;
t = t.children[0];
for (var i = this.getPokerUrl(e), a = 0, o = t.children; a < o.length; a++) {
var n = o[a];
n.getComponent(cc.Sprite).spriteFrame = this.pokerImg.getSpriteFrame(i[n.name]);
n.active = !0;
}
};
__decorate([ n(sp.SkeletonData) ], t.prototype, "typeSpine", void 0);
__decorate([ n(cc.Sprite) ], t.prototype, "title", void 0);
__decorate([ n(cc.SpriteAtlas) ], t.prototype, "pokerImg", void 0);
__decorate([ n(cc.Button) ], t.prototype, "selfcard", void 0);
__decorate([ n([ cc.SpriteFrame ]) ], t.prototype, "titleImg", void 0);
__decorate([ n([ cc.SpriteFrame ]) ], t.prototype, "jettonImg", void 0);
__decorate([ n([ cc.Font ]) ], t.prototype, "font", void 0);
__decorate([ n([ sp.Skeleton ]) ], t.prototype, "cardType", void 0);
return __decorate([ o ], t);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {} ]
}, {}, [ "HLWZRoomLoad", "HLWZTableSelect", "HLWZ_Controlle", "HLWZ_Player", "HLWZ_View" ]);