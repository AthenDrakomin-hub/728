window.__require = function e(t, i, o) {
function a(s, r) {
if (!i[s]) {
if (!t[s]) {
var c = s.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!r && l) return l(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = c;
}
var d = i[s] = {
exports: {}
};
t[s][0].call(d.exports, function(e) {
return a(t[s][1][e] || e);
}, d, d.exports, e, t, i, o);
}
return i[s].exports;
}
for (var n = "function" == typeof __require && __require, s = 0; s < o.length; s++) a(o[s]);
return a;
}({
SRNNRoomLoad: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "badd8G1FwFP7KLuwjKFf4Zt", "SRNNRoomLoad");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("Config"), a = cc._decorator, n = a.ccclass, s = a.property, r = function(e) {
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
t.isAnim = !1;
t.isExit = !1;
return t;
}
t.prototype.onLoad = function() {
var e = this;
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
var t = e.content;
e.isAnim && (e.room.getComponent(cc.Animation).play().wrapMode = cc.WrapMode.Reverse);
var i = e.isAnim ? e.room.getChildByName("scrollView") : e.room;
i.opacity = 0;
var o = cc.fadeTo(.2, 255);
i.runAction(o);
for (var a = 0; a < t.childrenCount; a++) {
var n = t.children[a];
!n.endPos && (n.endPos = cc.v2(n.x, n.y));
n.x = n.endPos.x + 250;
var s = cc.moveTo(.2, n.endPos).easing(cc.easeBackOut());
s.speed(.5);
n.stopAllActions();
n.runAction(s);
}
e.isAnim = !0;
};
if (this.load.active) {
var i = cc.find("logo", this.load);
wUIHelp.playSpine(i, "start", function() {
wUIHelp.playSpine(i, "idle", null, !0);
});
this.scheduleOnce(function() {
t();
var o = cc.fadeOut(.15), a = cc.callFunc(function() {
e.load.active = !1;
}), n = cc.sequence(o, a);
i.runAction(n);
}, .7);
} else t();
};
t.prototype.exitAnim = function() {
var e = this;
this.node.children[0].active = !1;
var t = this.room.getChildByName("scrollView"), i = cc.fadeTo(.13, 0), o = cc.callFunc(function() {
t.opacity = 255;
e.node.children[0].active = !0;
e.isEnterRoom = !1;
e.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
e.node.parent.destroyAllChildren();
}
});
t.runAction(cc.sequence(i, o));
this.room.getComponent(cc.Animation).play().wrapMode = cc.WrapMode.Normal;
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
var o = wGEvent.on("Msg_Hall_EnterGame", function(e) {
t.Msg_Hall_EnterGame(e);
wGEvent.off(o);
t.unscheduleAllCallbacks();
o = null;
}, this);
this.scheduleOnce(function() {
if (o) {
t.isEnterRoom = !1;
wGEvent.off(o);
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
wAudioMgr.playBtnSound();
var e = wGameData.getKey("gold"), t = wGameData.roomConfig, i = 1;
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && "5" != o && t[o].min_gold <= e && (i = t[o].level);
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
var e = this, t = o.Config.GamePrefab[wGameData.gameID];
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
var e = o.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir(e.prefabUrl, e.enName);
};
__decorate([ s(cc.Node) ], t.prototype, "room", void 0);
__decorate([ s(cc.Node) ], t.prototype, "load", void 0);
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
__decorate([ s(cc.Node) ], t.prototype, "top", void 0);
__decorate([ s(cc.Node) ], t.prototype, "bottom", void 0);
__decorate([ s(cc.Sprite) ], t.prototype, "head", void 0);
__decorate([ s(cc.Label) ], t.prototype, "nickname", void 0);
__decorate([ s(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ s(cc.Label) ], t.prototype, "bankGold", void 0);
return __decorate([ n ], t);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {
Config: void 0
} ],
SRNNTableSelect: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e02f2GmBl9DR5961Lff0sMO", "SRNNTableSelect");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = cc._decorator, a = o.ccclass, n = o.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.titleImg = [];
t.title = null;
t.content = null;
t.copyItem = null;
t.tableList = {};
t.maxTableNum = 4;
return t;
}
t.prototype.onLoad = function() {
this.initTable();
this.initTableList(wGameData.tableList);
this.title.spriteFrame = this.titleImg[wGameData.roomLevel - 1];
wGEvent.on("Msg_Hall_SyncGameTables", this.Msg_Hall_SyncGameTables, this);
};
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
for (var o = 0; o < this.maxTableNum; o++) {
var a = i.getChildByName("player" + o);
a.getChildByName("info").active = !1;
a.getChildByName("zw").active = !0;
}
for (var n in e.player) if (Object.prototype.hasOwnProperty.call(e.player, n)) {
var s = i.getChildByName("player" + (Number(n) - 1));
wUIHelp.setHead(cc.find("info/head", s), e.player[n].head, !0);
cc.find("info/name", s).getComponent(cc.Label).string = wUtils.handleNameLen(e.player[n].nickname, 8);
cc.find("info/zb", s).active = 0 == e.status;
s.getChildByName("info").active = !0;
s.getChildByName("zw").active = !1;
}
i.stopAllActions();
i.active = !0;
i.getChildByName("bg").tableID = e.tableID;
i.getChildByName("state").active = 1 == e.status;
};
t.prototype.kuStartSend = function() {
wAudioMgr.playBtnSound();
for (var e = [], t = -1, i = 1; i <= wConstant.maxTable; i++) {
var o = this.tableList[i];
Object.keys(o.player).length < this.maxTableNum && e.push(o);
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
t.prototype.onEnable = function() {
var e = cc.find("top/title", this.node);
e.y += 300;
e.opacity = 0;
var t = cc.moveBy(.3, cc.v2(0, -300)).easing(cc.easeOut(3)), i = cc.fadeTo(.3, 255), o = cc.spawn(t, i);
e.runAction(o);
var a = this.content.parent;
a.y -= 600;
a.opacity = 0;
t = cc.moveBy(.3, cc.v2(0, 600)).easing(cc.easeOut(3));
i = cc.fadeTo(.3, 255);
o = cc.spawn(t, i);
a.runAction(o);
};
t.prototype.update = function() {
var e = this.content.parent.parent.getComponent(cc.ScrollView).getScrollOffset().y;
this.node.getChildByName("bg").y = -60 + e;
this.node.getChildByName("bg").y < -60 ? this.node.getChildByName("bg").y = -60 : this.node.getChildByName("bg").y > 60 && (this.node.getChildByName("bg").y = 60);
};
__decorate([ n([ cc.SpriteFrame ]) ], t.prototype, "titleImg", void 0);
__decorate([ n(cc.Sprite) ], t.prototype, "title", void 0);
__decorate([ n(cc.Node) ], t.prototype, "content", void 0);
__decorate([ n(cc.Node) ], t.prototype, "copyItem", void 0);
return __decorate([ a ], t);
}(cc.Component);
i.default = s;
cc._RF.pop();
}, {} ],
SRNN_Auto: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "30307KxbQpPJKbXi8PekY9K", "SRNN_Auto");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("PopupBase"), a = cc._decorator, n = a.ccclass;
a.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.init = function(e) {
this.cb = e;
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
var i = t;
5 == t && (i = wUtils.random(1, 4));
this.hide();
this.cb && this.cb(i);
this.cb = null;
};
return __decorate([ n ], t);
}(o.default);
i.default = s;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
SRNN_Controlle: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "55726mwwQ5AjqAsbyl+ngDn", "SRNN_Controlle");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("PokerTableBase"), a = e("Config"), n = e("SRNN_Player"), s = cc._decorator, r = s.ccclass, c = s.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.playerView = [];
t.titleImg = [];
t.playerList = {};
t.myAuto = !1;
t.isStartAnim = !1;
return t;
}
t.prototype.start = function() {
cc.find("bg/type", this.node).getComponent(cc.Sprite).spriteFrame = this.titleImg[wGameData.roomLevel - 1];
this.initMsgEvevt();
this.p_init();
};
t.prototype.addPlayer = function(e) {
if ((e = JSON.parse(JSON.stringify(e))).uid) {
var t = e.seat - this.my_s_seat;
t < 0 && (t += 4);
e.c_seat = t;
} else {
e.uid = this.my_uid;
e.c_seat = 0;
this.my_s_seat = e.seat;
this.my_info = e;
}
e.s_seat = e.seat;
e.view = this.playerView[e.c_seat];
this.playerList[e.uid] = e;
e.view.addPlayer(e);
return e;
};
t.prototype.p_roomInfo = function(e) {
this.hands = e.hands;
this.doublescore = e.doublescore;
this.banker = e.banker;
this.gameState = e.gameState;
4 == this.gameState && (this.gameState = 0);
var t = e.players;
this.addPlayer(t[this.my_uid]);
for (var i in t) if (i != this.my_uid) {
(n = t[i]).uid = i;
this.addPlayer(n);
}
4 == this.gameState && (this.gameState = 0);
var o = this.my_info;
this.myAuto = o.istuo;
this.setAutoBtn(Boolean(this.myAuto));
this.p_setBankBtn(0 == this.gameState);
if (0 != this.gameState) if (1 != this.gameState) {
if (2 == this.gameState) {
this.Msg_SRNN_Bet(e.msg, !0);
for (var a in this.playerList) {
if ((n = this.playerList[a]).bet) {
n.view.setProgTime(0);
n.view.setBetNum(n.bet);
this.initXZBet(null, null);
}
n.isrealy || a != this.my_uid || this.setTips("ddks", !0);
}
}
if (3 != this.gameState) ; else for (var a in this.playerList) if ((n = this.playerList[a]).isrealy) {
if (!n.ishow) {
n.view.setProgTime(e.msg.time);
a == this.my_uid && this.setOpenPoker(!0);
}
n.uid == e.banker && n.view.setState("bank", !0);
n.view.setBetNum(n.bet, !0);
n.poker = e.msg.players[a];
n.view.initPoker(e.msg.players[a], n.ishow);
} else a == this.my_uid && this.setTips("ddks", !0);
} else {
this.Msg_SRNN_CallBanker(e.msg, !0);
for (var a in this.playerList) {
(n = this.playerList[a]).view.setState("bj", 1 == n.callbanker);
n.isrealy || a != this.my_uid || this.setTips("ddks", !0);
}
} else {
o.ready || this.setStartBtn(!0);
for (var a in this.playerList) {
var n;
(n = this.playerList[a]).view.setState("zb", n.ready);
if (!n.ready) {
var s = e.msg ? e.msg.time : 0;
n.view.setProgTime(s);
}
}
Object.keys(this.playerList).length < 2 && this.setTips("ddwj", !0);
}
};
t.prototype.Msg_SRNN_CallBanker = function(e, t) {
void 0 === t && (t = !1);
return __awaiter(this, void 0, void 0, function() {
var i, o;
return __generator(this, function(a) {
switch (a.label) {
case 0:
!t && this.initShow();
if (t || this.isStartAnim) return [ 3, 2 ];
this.isStartAnim = !0;
this.showStartAnim();
wAudioMgr.playSound("sound/effect_game_start", "SRNN");
return [ 4, wUtils.syncDelayed(.5, this) ];

case 1:
a.sent();
a.label = 2;

case 2:
this.gameState = 1;
for (i in this.playerList) {
o = this.playerList[i];
e.uid == o.uid ? o.view.setProgTime(e.time - .5) : o.view.setProgTime(0);
o.view.setState("zb", !1);
}
this.setRobBankBtn(e.uid == this.my_uid);
this.my_info.isrealy && this.setTips("bank", e.uid != this.my_uid);
this.p_setBankBtn(!1);
return [ 2 ];
}
});
});
};
t.prototype.Msg_SRNN_Bet = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
var i, o;
return __generator(this, function(a) {
switch (a.label) {
case 0:
this.my_info.isrealy && this.setTips("bank", !1);
this.setRobBankBtn(!1);
this.gameState = 2;
this.banker = e.banker;
for (i in this.playerList) {
o = this.playerList[i];
e.banker == o.uid ? o.view.setProgTime(0) : o.isrealy && o.view.setProgTime(e.time - .8);
o.view.setState("bj", !1);
}
wAudioMgr.playSound("sound/effect_banker", "SRNN");
this.showBankAnim(this.playerList[e.banker].view);
return t ? [ 3, 2 ] : [ 4, wUtils.syncDelayed(.8, this) ];

case 1:
a.sent();
a.label = 2;

case 2:
e.banker != this.my_uid && this.my_info.isrealy ? this.initXZBet(e.bet, this.my_info.gold) : this.my_info.isrealy && this.setTips("bet", !0);
return [ 2 ];
}
});
});
};
t.prototype.Msg_SRNN_FaCards = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o, a, n, s, r = this;
return __generator(this, function(c) {
switch (c.label) {
case 0:
this.my_info.isrealy && this.setTips("bet", !1);
this.initXZBet(null, null);
return [ 4, wUtils.syncDelayed(.5, this) ];

case 1:
c.sent();
this.gameState = 3;
t = [];
for (i in this.playerList) {
(o = this.playerList[i]).view.setProgTime(0);
o.view.setState();
t.push(o);
}
wAudioMgr.playSound("sound/effect_send_card", "SRNN");
t.sort(function(e, t) {
return e.c_seat - t.c_seat;
});
a = 0;
n = function(i) {
var o = t[i], n = e.players[o.uid];
if (n) {
o.poker = n;
o.view.showFPAnim(n.hands, a++);
}
};
for (s = 1; s < t.length; s++) {
n(s);
s == t.length - 1 && n(0);
}
this.scheduleOnce(function() {
for (var t in r.playerList) {
var i = r.playerList[t];
if (e.players[t]) {
i.ishow || i.view.setProgTime(e.time - 1.5);
t == r.my_uid && r.setOpenPoker(!0);
}
}
}, 1);
return [ 2 ];
}
});
});
};
t.prototype.Msg_SRNN_Res = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o, a, n, s, r, c, l, d, p, h, u, m, y, g = this;
return __generator(this, function(_) {
switch (_.label) {
case 0:
this.gameState = 4;
this.setTips("ddks", !1);
this.setOpenPoker(!1);
t = e.players;
i = function(e) {
var i = o.playerList[e];
i.isrealy = 0;
i.view.setBetNum(0);
i.view.setProgTime(0);
i.view.setState();
if (i.poker) {
if (e == o.my_uid) i.ishow || i.view.setPokerType(i.poker.type); else {
i.view.openPokerAnim(i.poker.hands);
o.scheduleOnce(function() {
i.view.setPokerType(i.poker.type);
}, .3);
}
o.scheduleOnce(function() {
i.view.setWinGold(t[e].score);
}, .35);
}
i.ishow = 0;
};
o = this;
for (m in this.playerList) i(m);
return [ 4, wUtils.syncDelayed(1, this) ];

case 1:
_.sent();
a = [];
n = this.playerList[this.banker];
wAudioMgr.playSound("sound/effect_win_gold", "SRNN");
for (u in t) {
s = t[u];
(y = this.playerList[u]).gold = s.gold;
y.view.setGold(s.gold);
if (u == this.my_uid) {
y.allWinScore += s.score;
y.winScore = s.score;
s.score > 0 ? wAudioMgr.playSound("sound/effect_win", "SRNN") : wAudioMgr.playSound("sound/effect_lose", "SRNN");
}
s.score > 0 && a.push(u);
if (this.banker != u) {
r = s.score > 0 ? n.c_seat : y.c_seat;
c = s.score > 0 ? y.c_seat : n.c_seat;
this.showWinGoldAnim(r, c);
}
}
l = function(e) {
d.scheduleOnce(function() {
g.playerList[e].view.showWinAnim();
}, .5);
};
d = this;
p = 0;
for (h = a; p < h.length; p++) {
u = h[p];
l(u);
}
this.gameState = 0;
this.p_setBankBtn(!0);
return [ 4, wUtils.syncDelayed(1, this) ];

case 2:
_.sent();
this.setStartBtn(!0);
for (m in this.playerList) (y = this.playerList[m]).isrealy || y.view.setProgTime(e.time - 2);
return [ 2 ];
}
});
});
};
t.prototype.Msg_SRNN_Act_CallBanker = function(e) {
var t = this.playerList[e.uid];
t.view.setProgTime(0);
t.view.setState("bj", 1 == e.type);
e.uid == this.my_uid && this.setRobBankBtn(!1);
};
t.prototype.Msg_SRNN_Act_Bet = function(e) {
var t = this.playerList[e.uid];
t.view.setProgTime(0);
t.view.setBetNum(e.bet);
t.gold -= e.bet;
t.view.setGold(t.gold);
wAudioMgr.playSound("sound/effect_money", "SRNN");
e.uid == this.my_uid && this.initXZBet(null, null);
};
t.prototype.Msg_SRNN_Act_Show = function(e) {
var t = this.playerList[e.uid];
t.ishow = 1;
t.view.setProgTime(0);
if (e.uid == this.my_uid) {
t.view.setPokerType(t.poker.type);
this.setOpenPoker(!1);
} else this.scheduleOnce(function() {
t.view.setOK(!0);
}, .5);
};
t.prototype.Msg_SRNN_Ready = function(e) {
var t = this.playerList[e.uid];
t.isrealy = 1;
t.view.initShow();
t.view.setProgTime(0);
t.view.setState("zb", !0);
e.uid == this.my_uid && this.setStartBtn(!1);
};
t.prototype.Msg_SRNN_Add = function(e) {
var t = this.addPlayer(e);
if (0 == this.gameState) {
t.view.setProgTime(20);
this.setTips("ddwj", !1);
}
};
t.prototype.p_quitGame = function(e) {
this.playerList[e.uid].view.deletePlayer();
delete this.playerList[e.uid];
Object.keys(this.playerList).length < 2 && this.setTips("ddwj", !0);
};
t.prototype.Msg_SRNN_Act_Tuo = function(e) {
if (e.uid == this.my_uid) {
this.myAuto = e.istuo;
this.setAutoBtn(Boolean(this.myAuto));
}
};
t.prototype.showBankAnim = function(e) {
var t = this, i = this.node.getChildByName("bank");
wUIHelp.hideSonNode(i);
i.scale = 1;
i.setPosition(0, 0);
i.active = !0;
var o = i.getChildByName("spine");
o.active = !0;
o.getComponent(sp.Skeleton).setAnimation(1, "animation", !1);
var a = cc.find("state/bank", e.node);
(a = wUtils.world_local_POS(this.node, wUtils.local_world__POS(a))).y += 20;
this.scheduleOnce(function() {
var e = cc.moveTo(.3, a), o = cc.scaleTo(.3, .7), n = cc.callFunc(function() {
var e = i.getChildByName("boom");
e.active = !0;
e.getComponent(cc.ParticleSystem).resetSystem();
t.scheduleOnce(function() {
e.active = !1;
}, .4);
}), s = cc.sequence(cc.spawn(e, o), n);
i.runAction(s);
}, .5);
};
t.prototype.showStartAnim = function() {
var e = this.node.getChildByName("start");
e.active = !0;
(e = e.getComponent(sp.Skeleton)).setAnimation(1, "animation", !1);
this.scheduleOnce(function() {
e.active = !1;
}, .5);
};
t.prototype.showWinGoldAnim = function(e, t) {
var i = this.node.getChildByName("winUI"), o = i.getChildByName("content"), a = i.getChildByName("gold"), n = this.playerView[e].node.children[1];
n = wUtils.world_local_POS(o, wUtils.local_world__POS(n));
var s = this.playerView[t].node.children[1];
s = wUtils.world_local_POS(o, wUtils.local_world__POS(s));
for (var r = 0; r < 10; r++) this.scheduleOnce(function() {
var e = cc.instantiate(a);
o.addChild(e, 2);
e.active = !0;
e.setPosition(n);
var t = n.sub(s).mag() / 400 * .45, i = cc.v2(s.x + wUtils.random(-10, 10), s.y + wUtils.random(-10, 10)), r = cc.moveTo(t, i).easing(cc.easeInOut(3)), c = cc.delayTime(.01), l = cc.callFunc(function() {
e.destroy();
});
e.runAction(cc.sequence(r, c, l));
}, .03 * r);
};
t.prototype.initShow = function() {
for (var e = function(e) {
var t = cc.fadeOut(.4), i = cc.callFunc(function() {
e.destroy();
}), o = cc.sequence(t, i);
e.runAction(o);
}, t = 0, i = this.node.getChildByName("winUI").getChildByName("content").children; t < i.length; t++) e(i[t]);
for (var o in this.playerList) {
var a = this.playerList[o];
a.view.initShow();
a.isrealy = !0;
}
this.node.getChildByName("bank").active = !1;
};
t.prototype.initXZBet = function(e, t) {
var i = this.node.getChildByName("xiazhu");
i.active = Boolean(e) && !this.myAuto;
if (i.active) for (var o = 0; o < e.length; o++) {
var n = i.children[o];
n.betNum = e[o];
n.children[0].getComponent(cc.Label).string = e[o];
if (e[o] <= t) {
n.getComponent(cc.Button).interactable = !0;
wUIHelp.setNodeColor(n, a.Config.colorSet.white);
} else {
n.getComponent(cc.Button).interactable = !1;
wUIHelp.setNodeColor(n, a.Config.colorSet.ash);
}
}
};
t.prototype.setTips = function(e, t) {
var i = this.node.getChildByName("tips");
wUIHelp.hideSonNode(i);
i.getChildByName(e).active = t;
};
t.prototype.setAutoBtn = function(e) {
var t = this.node.getChildByName("autoBtn");
if (e) {
t.children[1].active = !1;
t.children[0].active = !0;
} else {
t.children[1].active = !0;
t.children[0].active = !1;
}
};
t.prototype.setStartBtn = function(e) {
var t = this.node.getChildByName("btn");
wUIHelp.hideSonNode(t);
var i = t.getChildByName("start");
i.active = e && !this.myAuto;
i.active && this.playerView[0].node.getChildByName("poker").active ? i.setPosition(415, -293) : i.setPosition(22, -70);
};
t.prototype.setRobBankBtn = function(e) {
var t = this.node.getChildByName("btn");
wUIHelp.hideSonNode(t);
t.getChildByName("robBank").active = e && !this.myAuto;
};
t.prototype.setOpenPoker = function(e) {
var t = this.node.getChildByName("btn");
wUIHelp.hideSonNode(t);
t.getChildByName("openPoker").active = e && !this.myAuto;
};
t.prototype.p_upGameGold = function(e) {
this.my_info.gold = e;
this.my_info.view.setGold(e);
};
t.prototype.initMsgEvevt = function() {
var e = this;
this.my_uid = wGameData.getKey("uid");
for (var t = function(t) {
wGEvent.on(t, function(i) {
1 == i.status ? e[t](i.data) : console.error("evevt", i);
}, i);
}, i = this, o = 0, a = [ "Msg_SRNN_CallBanker", "Msg_SRNN_Bet", "Msg_SRNN_FaCards", "Msg_SRNN_Res", "Msg_SRNN_Act_CallBanker", "Msg_SRNN_Act_Bet", "Msg_SRNN_Act_Show", "Msg_SRNN_Add", "Msg_SRNN_Ready", "Msg_SRNN_Act_Tuo", "Msg_SRNN_ChangGold" ]; o < a.length; o++) t(a[o]);
};
t.prototype.betOnClick = function(e) {
wAudioMgr.playBtnSound();
var t = e.target.betNum;
wNetWork.send("Msg_SRNN_Act_Bet", {
bet: t
});
this.initXZBet(null, null);
};
t.prototype.onClick = function(e, t) {
switch (t) {
case "tg":
wViewMgr.openPage({
path: "prefab/SRNNAuto",
bundle: wGameData.getGameName(),
data: function(e) {
wNetWork.send("Msg_SRNN_Act_Tuo", {
istuo: e
});
}
});
break;

case "qxtg":
wNetWork.send("Msg_SRNN_Act_Tuo", {
istuo: 0
});
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
if (0 != this.gameState && this.my_info.isrealy) {
wUIManager.showTips("游戏正在进行中！", wUIManager.TIPS_OK);
return;
}
wAudioMgr.playCloseSound();
this.p_sendQuitGame();
return;

case "start":
wNetWork.send("Msg_SRNN_Ready", []);
this.setStartBtn(!1);
break;

case "robBank":
wNetWork.send("Msg_SRNN_Act_CallBanker", {
type: 2
});
this.setRobBankBtn(!1);
break;

case "noRobBank":
wNetWork.send("Msg_SRNN_Act_CallBanker", {
type: 1
});
this.setRobBankBtn(!1);
break;

case "openPoker":
this.setOpenPoker(!1);
wNetWork.send("Msg_SRNN_Act_Show", []);
}
wAudioMgr.playBtnSound();
};
t.prototype.Msg_SRNN_ChangGold = function(e) {
var t = this.playerList[e.uid];
t.gold = e.gold;
t.view.setGold(e.gold);
};
__decorate([ c(n.default) ], t.prototype, "playerView", void 0);
__decorate([ c([ cc.SpriteFrame ]) ], t.prototype, "titleImg", void 0);
return __decorate([ r ], t);
}(o.default);
i.default = l;
cc._RF.pop();
}, {
Config: void 0,
PokerTableBase: void 0,
SRNN_Player: "SRNN_Player"
} ],
SRNN_Player: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e8dffYBP75LNJYyi20MmHi/", "SRNN_Player");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = cc._decorator, a = o.ccclass, n = o.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.poker = null;
t.nnImg = null;
t.prog = null;
t.gold = null;
t.state = null;
return t;
}
t.prototype.onLoad = function() {
this.prog = this.node.getChildByName("prog");
this.gold = this.node.getChildByName("gold").getComponent(cc.Label);
this.state = this.node.getChildByName("state");
for (var e = this.node.getChildByName("poker"), t = 0; t < 5; t++) {
var i = e.children[t];
i.startPos = i.getPosition();
}
this.node.active = !1;
};
t.prototype.addPlayer = function(e) {
this.node.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(e.nickname, 8);
wUIHelp.setHead(this.node.getChildByName("head"), e.headimgurl, !0);
this.setGold(e.gold);
this.initShow();
this.node.active = !0;
};
t.prototype.initShow = function() {
this.node.getChildByName("renx").active = !1;
this.node.getChildByName("anim").active = !1;
this.setState();
this.initPoker();
this.setOK();
this.setWinGold(0);
this.setProgTime(0);
this.setBetNum(0);
};
t.prototype.deletePlayer = function() {
this.node.active = !1;
};
t.prototype.setGold = function(e) {
this.gold.string = wUtils.goldFormat(e);
};
t.prototype.setProgTime = function(e) {
if (e <= 0) this.prog.active = !1; else {
this.prog.active = !0;
this.prog.getComponent(cc.Animation).play("progAnim").speed = 1 / e;
}
};
t.prototype.setState = function(e, t) {
var i = this.state.getChildByName(e);
if (i) {
i.active = t;
var o = this.node.getChildByName("poker");
t && "zb" == e && o.active && (i.active = !1);
} else wUIHelp.hideSonNode(this.state);
};
t.prototype.setBetNum = function(e, t) {
void 0 === t && (t = !1);
var i = this.node.getChildByName("bet");
i.active = Boolean(e);
if (e) {
var o = i.getChildByName("label").getComponent(cc.Label);
if (t) o.string = wUtils.numConvert(e); else {
o.string = "";
var a = wUtils.local_world__POS(this.node.getChildByName("head"));
a = wUtils.world_local_POS(i, a);
for (var n = 0; n < 3; n++) {
var s = i.children[n];
!s.startPos && (s.startPos = s.getPosition());
s.setPosition(a);
var r = cc.delayTime(.05 * n), c = cc.moveTo(.2, s.startPos);
s.runAction(cc.sequence(r, c));
}
var l = cc.delayTime(.2), d = cc.callFunc(function() {
o.string = wUtils.numConvert(e);
});
o.node.runAction(cc.sequence(l, d));
}
}
};
t.prototype.setWinGold = function(e) {
var t = this.node.getChildByName("win");
t.active = e;
if (e) {
wUIHelp.hideSonNode(t);
var i = e > 0 ? t.getChildByName("win") : t.getChildByName("lose");
i.active = !0;
i.getComponent(cc.Label).string = (e > 0 ? "+" : "") + wUtils.numConvert(e);
}
};
t.prototype.showWinAnim = function() {
var e = this, t = this.node.getChildByName("renx");
t.active = !0;
wUIHelp.playSpine(t, "animation", function() {
t.active = !1;
});
this.scheduleOnce(function() {
var t = e.node.getChildByName("anim");
t.active = !0;
t.getComponent("Animation").play(function() {
t.getComponent("Animation").play(function() {
t.active = !1;
});
});
}, .2);
};
t.prototype.setOK = function(e) {
void 0 === e && (e = !1);
this.setState("zb", e);
};
t.prototype.initPoker = function(e, t) {
var i = this.node.getChildByName("poker");
i.active = Boolean(e);
if (i.active) for (var o = "0" == this.node.name, a = 0; a < 5; a++) {
var n = i.children[a];
wUIHelp.hideSonNode(n, !1);
var s = o ? "plist_puke_front_big" : "plist_puke_back_big_2", r = this.poker.getSpriteFrame(s);
n.getComponent(cc.Sprite).spriteFrame = r;
this.setPokerRes(n, e.hands[a]);
if ("0" == this.node.name) t && this.setPokerType(e.type); else {
wUIHelp.hideSonNode(n, !1);
this.setOK(t);
}
} else this.node.getChildByName("type").active = !1;
};
t.prototype.setPokerRes = function(e, t) {
var i = Math.floor(t / 100), o = t % 100 - 1;
if (i < 14) for (var a = {
pai: d = "plist_puke_value_" + o % 2 + "_" + i,
hua: "plist_puke_color_small_" + o,
dh: "plist_puke_color_big_" + o
}, n = 0, s = e.children; n < s.length; n++) {
var r = s[n], c = this.poker.getSpriteFrame(a[r.name]);
r.getComponent(cc.Sprite).spriteFrame = c;
r.active = !0;
} else {
var l = e.getChildByName("wang");
l.active = !0;
var d = "plist_puke_joker_big_" + (14 == i ? 0 : 1);
l.getComponent(cc.Sprite).spriteFrame = this.poker.getSpriteFrame(d);
}
};
t.prototype.setPokerType = function(e) {
this.node.getChildByName("type").active = !0;
var t = this.nnImg.getSpriteFrame("qznnb_niu_" + (e - 1) + ".png");
cc.find("type/mul", this.node).getComponent(cc.Sprite).spriteFrame = t;
var i = 0;
switch (e - 1) {
case 0:
i = 0;
break;

case 1:
case 2:
case 3:
i = 1;
break;

case 4:
case 5:
case 6:
i = 2;
break;

case 7:
case 8:
case 9:
i = 3;
break;

default:
i = 4;
}
this.node.getChildByName("type").getComponent(cc.Sprite).spriteFrame = this.nnImg.getSpriteFrame(i + ".png");
if (0 != i) for (var o = 2; o < 5; o++) this.node.getChildByName("poker").getChildByName("" + o).x += 15;
if ("0" == this.node.name) {
var a = 1;
wGameData.getKey("headimgurl") % 12 < 6 && (a = 0);
var n = e - 1;
n > 10 && (n = 10);
var s = "sound/effect_niu_" + a + "_" + n;
wAudioMgr.playSound(s, "SRNN");
}
};
t.prototype.showFPAnim = function(e) {
var t = this, i = this.node.getChildByName("poker");
i.active = !0;
var o = wUtils.local_world__POS(this.node.parent);
o = wUtils.world_local_POS(i, o);
for (var a = function(a) {
var s = i.children[a];
wUIHelp.hideSonNode(s, !1);
var r = n.poker.getSpriteFrame("plist_puke_back_big_2");
s.getComponent(cc.Sprite).spriteFrame = r;
s.setPosition(o);
s.scale = .2;
var c = i.children[0].startPos, l = cc.v2(c.x + -200, c.y + 200), d = cc.delayTime(.08 * a), p = cc.callFunc(function() {}), h = cc.bezierTo(.35, [ o, l, c ]).easing(cc.easeIn(.8)), u = cc.scaleTo(.2, .75), m = cc.scaleTo(.15, 1), y = cc.spawn(h, cc.sequence(u, m)), g = void 0;
if (4 == a) {
var _ = cc.callFunc(function() {
t.movePokerAnim(e);
});
g = cc.sequence(d, p, y, _);
} else g = cc.sequence(d, p, y);
s.runAction(g);
}, n = this, s = 0; s < 5; s++) a(s);
};
t.prototype.movePokerAnim = function(e) {
for (var t = this, i = this.node.getChildByName("poker"), o = 0; o < 5; o++) {
var a = i.children[o], n = cc.moveTo(.15, a.startPos);
if ("0" != this.node.name) a.runAction(n); else {
var s = cc.callFunc(function() {
t.openPokerAnim(e);
});
a.runAction(cc.sequence(n, s));
}
}
};
t.prototype.openPokerAnim = function(e) {
for (var t = this, i = this.node.getChildByName("poker"), o = function(o) {
var a = i.children[o], n = cc.scaleTo(.15, 0, 1), s = cc.skewTo(.15, -10, -10), r = cc.callFunc(function() {
a.skewX = 10;
a.skewY = 10;
a.getComponent(cc.Sprite).spriteFrame = t.poker.getSpriteFrame("plist_puke_front_big");
t.setPokerRes(a, e[o]);
}), c = cc.scaleTo(.15, 1), l = cc.skewTo(.15, 0, 0);
a.runAction(cc.sequence(cc.spawn(n, s), r, cc.spawn(c, l)));
}, a = 0; a < 5; a++) o(a);
};
__decorate([ n(cc.SpriteAtlas) ], t.prototype, "poker", void 0);
__decorate([ n(cc.SpriteAtlas) ], t.prototype, "nnImg", void 0);
return __decorate([ a ], t);
}(cc.Component);
i.default = s;
cc._RF.pop();
}, {} ]
}, {}, [ "SRNNRoomLoad", "SRNNTableSelect", "SRNN_Auto", "SRNN_Controlle", "SRNN_Player" ]);