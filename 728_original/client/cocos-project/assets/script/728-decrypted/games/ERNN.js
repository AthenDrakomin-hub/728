window.__require = function e(t, i, o) {
function a(r, s) {
if (!i[r]) {
if (!t[r]) {
var c = r.split("/");
c = c[c.length - 1];
if (!t[c]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = c;
}
var p = i[r] = {
exports: {}
};
t[r][0].call(p.exports, function(e) {
return a(t[r][1][e] || e);
}, p, p.exports, e, t, i, o);
}
return i[r].exports;
}
for (var n = "function" == typeof __require && __require, r = 0; r < o.length; r++) a(o[r]);
return a;
}({
ERNNRoomLoad: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "07c522xAjxPo6aGKTa0XJD9", "ERNNRoomLoad");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("Config"), a = cc._decorator, n = a.ccclass, r = a.property, s = function(e) {
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
t.spineNode = null;
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
var o = cc.fadeTo(.2, 255);
i.runAction(o);
for (var a = 1; a < t.childrenCount; a++) {
var n, r;
!(n = t.children[a]).endPos && (n.endPos = cc.v2(n.x, n.y));
n.x = n.endPos.x + 250;
(r = cc.moveTo(.2, n.endPos).easing(cc.easeBackOut())).speed(.5);
n.stopAllActions();
n.runAction(r);
}
!(n = e.spineNode.children[0]).endPos && (n.endPos = cc.v2(n.x, n.y));
n.x = n.endPos.x - 250;
(r = cc.moveTo(.2, n.endPos).easing(cc.easeBackOut())).speed(.5);
n.stopAllActions();
n.runAction(r);
e.isAnim = !0;
};
if (this.load.active) {
var i = this.load.getChildByName("logo");
i.y = 150;
var o = cc.moveTo(.15, cc.v2(0, 0)), a = cc.fadeTo(.1, 255), n = cc.delayTime(.05), r = cc.fadeTo(.06, 0), s = cc.moveTo(.1, cc.v2(0, 150)), c = cc.callFunc(function() {
e.load.active = !1;
}), l = cc.sequence(cc.spawn(o, a), n, cc.spawn(r, s), c);
i.runAction(l);
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
var i = this.room.getChildByName("scrollView"), o = cc.fadeTo(.15, 0), a = cc.callFunc(function() {
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
i.runAction(cc.sequence(o, a));
for (var n = function(e) {
var i = t.children[e], o = cc.v2(i.x, i.y), a = cc.moveBy(.2, cc.v2(250, 0)), n = cc.callFunc(function() {
i.setPosition(o);
});
i.runAction(cc.sequence(a, n));
}, r = 1; r < t.childrenCount; r++) n(r);
var s = this.spineNode.children[0], c = cc.v2(s.x, s.y), l = cc.moveBy(.2, cc.v2(-250, 0)), p = cc.callFunc(function() {
s.setPosition(c);
});
s.runAction(cc.sequence(l, p));
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
for (var o in t) Object.prototype.hasOwnProperty.call(t, o) && t[o].min_gold <= e && (i = t[o].level);
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
t.prototype.update = function() {
var e = this.content.parent.parent.getComponent(cc.ScrollView).getScrollOffset().x;
this.spineNode.x = e <= 1 ? wUtils.world_local_POS(this.node, wUtils.local_world__POS(this.content.children[0])).x : this.contentX;
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
__decorate([ r(cc.Node) ], t.prototype, "spineNode", void 0);
return __decorate([ n ], t);
}(cc.Component);
i.default = s;
cc._RF.pop();
}, {
Config: void 0
} ],
ERNNTableSelect: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "82ed6oAo0ZO3YU36/+qXMO2", "ERNNTableSelect");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = cc._decorator, a = o.ccclass, n = o.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.titleImg = [];
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
for (var o = 0; o < 2; o++) {
var a = i.getChildByName("player" + o);
a.getChildByName("info").active = !1;
a.getChildByName("zw").active = !0;
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
__decorate([ n([ cc.SpriteFrame ]) ], t.prototype, "titleImg", void 0);
__decorate([ n(cc.Sprite) ], t.prototype, "title", void 0);
__decorate([ n(cc.Node) ], t.prototype, "content", void 0);
__decorate([ n(cc.Node) ], t.prototype, "copyItem", void 0);
return __decorate([ a ], t);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {} ],
ERNN_Auto: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "35a55MJKsVCzIapUaWdAtTs", "ERNN_Auto");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("PopupBase"), a = cc._decorator, n = a.ccclass;
a.property;
var r = function(e) {
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
i.default = r;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
ERNN_Controlle: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "4d54aI0vYNAEbB9BV5acrjV", "ERNN_Controlle");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("PokerTableBase"), a = e("ERNN_Player"), n = e("ERNN_View"), r = cc._decorator, s = r.ccclass, c = r.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.playerView = [];
t.View = null;
t.playerList = {};
t.myAuto = !1;
return t;
}
t.prototype.start = function() {
this.View = this.node.getComponent(n.default);
this.initMsgEvevt();
this.p_init();
};
t.prototype.p_roomInfo = function(e) {
var t = e.players;
for (var i in t) {
(s = t[i]).uid = i;
var o = this.getSeat(i);
s.seat = o;
var a = this.playerView[s.seat];
a.initPlayer(s);
s.playerView = a;
this.playerList[o] = s;
e.msg && e.msg.time && a.setProgTime(e.msg.time);
}
var n = this.playerList[0];
this.hands = e.hands;
this.doublescore = e.doublescore;
this.banker = e.banker;
this.gameState = e.gameState;
this.myAuto = n.istuo;
this.View.setAutoBtn(Boolean(this.myAuto));
4 == this.gameState && (this.gameState = 0);
if (0 == this.gameState) {
n.ready || this.View.setStartBtn(!0);
for (var r in this.playerList) {
(s = this.playerList[r]).playerView.setState("zb", s.ready);
s.ready && s.playerView.setProgTime(0);
}
1 == e.level && 1e7 == n.gold && wUIManager.showConfirmUI_B({
type: 3
});
} else if (1 == this.gameState) {
this.Msg_ERNN_CallBanKer(e.msg);
for (var r in this.playerList) (s = this.playerList[r]).playerView.setState("bj", 1 == s.callbanker);
} else if (2 == this.gameState) this.Msg_ERNN_Bet(e.msg); else if (3 == this.gameState) {
for (var r in this.playerList) {
var s;
0 == (s = this.playerList[r]).seat && this.View.setOpenPoker(1 != s.ishow);
0 == s.ishow && s.playerView.setProgTime(e.msg.time);
}
var c = [ e.msg.players[wGameData.getKey("uid")].hands, e.msg.players[this.playerList[1].uid].hands ];
this.View.initPaiShow(c);
this.getPlayer(e.banker).playerView.setState("bank", !0);
this.View.initJetton(Number(!this.getSeat(e.banker)), e.bet);
}
this.p_setBankBtn(0 == this.gameState);
};
t.prototype.Msg_ERNN_CallBanKer = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o;
return __generator(this, function(a) {
switch (a.label) {
case 0:
if (t = this.node.getChildByName("gamestart")) {
for (i in this.playerList) {
(o = this.playerList[i]).playerView.setState("zb", !1);
o.playerView.setProgTime(null);
}
t.active = !0;
wUIHelp.playSpine(t, "animation", function() {
t.destroy();
});
wAudioMgr.playSound("sound/effect_game_start", "ERNN");
}
this.View.initPoker();
return [ 4, wUtils.syncDelayed(.5, this) ];

case 1:
a.sent();
this.p_setBankBtn(!1);
this.gameState = 1;
for (i in this.playerList) {
(o = this.playerList[i]).playerView.setState("zb", !1);
o.playerView.setProgTime(null);
}
this.View.setRobBankBtn(e.uid == wGameData.getKey("uid"));
this.View.setTips("bank", e.uid != wGameData.getKey("uid"));
this.playerList[this.getSeat(e.uid)].playerView.setProgTime(e.time);
return [ 2 ];
}
});
});
};
t.prototype.Msg_ERNN_Bet = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o;
return __generator(this, function(a) {
switch (a.label) {
case 0:
this.banker = e.banker;
this.getPlayer(e.banker).playerView.setState("bank", !0);
wAudioMgr.playSound("sound/effect_banker", "ERNN");
return [ 4, wUtils.syncDelayed(1, this) ];

case 1:
a.sent();
this.View.setTips("xian", !1);
this.gameState = 2;
for (t in this.playerList) {
(i = this.playerList[t]).playerView.setState("bj", !1);
i.playerView.setProgTime(null);
}
this.View.setOpenPoker(!1);
o = e.banker == wGameData.getKey("uid") ? 1 : 0;
this.playerList[o].playerView.setProgTime(e.time - 1);
if (o) this.View.setTips("xian", !0); else {
e.bet.sort(function(e, t) {
return t - e;
});
this.View.initXZBet(e.bet, this.playerList[o].gold);
}
return [ 2 ];
}
});
});
};
t.prototype.Msg_ERNN_FaCards = function(e) {
var t = this;
this.View.setOpenPoker(!1);
this.View.setTips("xian", !1);
this.View.initXZBet(null, null);
this.scheduleOnce(function() {
t.gameState = 3;
var i = [ e.players[wGameData.getKey("uid")].hands, e.players[t.playerList[1].uid].hands ];
wAudioMgr.playSound("sound/effect_send_card", "ERNN");
t.View.faPaiShow(i);
for (var o in t.playerList) t.playerList[o].playerView.setProgTime(0);
t.scheduleOnce(function() {
for (var i in t.playerList) {
var o = t.playerList[i];
o.ishow || o.playerView.setProgTime(e.time - 1.5);
}
t.View.setOpenPoker(!0);
}, 1);
}, .5);
};
t.prototype.Msg_ERNN_Res = function(e) {
var t = this;
this.gameState = 4;
for (var i in this.playerList) {
var o = this.playerList[i];
o.playerView.setProgTime(0);
e.players[o.uid].headimgurl = o.headimgurl;
}
this.View.setTips("wc", !1);
this.View.setOpenPoker(!1);
this.View.kaiPaiShow(e.players);
this.scheduleOnce(function() {
t.View.winShow(e.players, t.banker);
wAudioMgr.playSound("sound/effect_win_gold", "ERNN");
var i = function(i) {
var o = t.playerList[i], a = e.players[o.uid];
a.score > 0 && t.scheduleOnce(function() {
o.playerView.winShow(a.type);
}, 1);
o.gold = a.gold;
o.playerView.setGold(a.gold, a.score > 0);
if ("0" == i) {
o.allWinScore += a.score;
o.winScore = a.score;
a.score > 0 ? wAudioMgr.playSound("sound/effect_win", "ERNN") : wAudioMgr.playSound("sound/effect_lose", "ERNN");
}
};
for (var o in t.playerList) i(o);
t.gameState = 0;
}, 1);
this.scheduleOnce(function() {
t.p_setBankBtn(!0);
for (var i in t.playerList) {
var o = t.playerList[i];
o.playerView.setProgTime(e.time - 5);
o.playerView.setState("bank", !1);
}
t.playerList[0].gold < t.doublescore ? wUIManager.showTips("您的金币少于入场限制" + t.doublescore + "，不能进行游戏！") : t.View.setStartBtn(!0, !0);
}, 3);
};
t.prototype.Msg_ERNN_Act_Bet = function(e) {
var t = this.getPlayer(e.uid);
this.View.setTips("xian", !1);
wAudioMgr.playSound("sound/effect_money", "ERNN");
this.View.jettonAnim(t.seat, e.bet);
t.gold -= e.bet;
t.playerView.setGold(t.gold);
};
t.prototype.Msg_ERNN_Act_Show = function(e) {
var t = this, i = this.getPlayer(e.uid);
i.ishow = !0;
i.playerView.setProgTime(null);
e.uid != wGameData.getKey("uid") && this.scheduleOnce(function() {
t.View.setTips("wc", !0);
}, .5);
};
t.prototype.Msg_ERNN_Act_CallBanker = function(e) {
var t = this.getPlayer(e.uid);
t.playerView.setProgTime(0);
t.playerView.setState("bj", 1 == e.type);
};
t.prototype.Msg_ERNN_Ready = function(e) {
var t = this.getPlayer(e.uid);
t.playerView.setProgTime(0);
t.playerView.setState("zb", !0);
if (e.uid == wGameData.getKey("uid")) {
this.View.setStartBtn(!1);
this.View.initPoker();
}
};
t.prototype.Msg_ERNN_Add = function(e) {
e.seat = 1;
var t = this.playerView[1];
t.initPlayer(e);
e.playerView = t;
this.playerList[1] = e;
t.initPlayer(e);
t.setProgTime(20);
};
t.prototype.p_quitGame = function() {
this.playerView[1].initPlayer(null);
this.node.getChildByName("poker").getChildByName("1").active = !1;
this.node.getChildByName("poker").getChildByName("1type").active = !1;
};
t.prototype.Msg_ERNN_Act_Tuo = function(e) {
if (e.uid == wGameData.getKey("uid")) {
this.myAuto = e.istuo;
this.View.setAutoBtn(Boolean(this.myAuto));
}
};
t.prototype.onClick = function(e, t) {
switch (t) {
case "tg":
wViewMgr.openPage({
path: "prefab/ERNNAuto",
bundle: wGameData.getGameName(),
data: function(e) {
wNetWork.send("Msg_ERNN_Act_Tuo", {
istuo: e
});
}
});
break;

case "qxtg":
wNetWork.send("Msg_ERNN_Act_Tuo", {
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
if (0 != this.gameState) {
wUIManager.showTips("游戏正在进行中！", wUIManager.TIPS_OK);
return;
}
wAudioMgr.playCloseSound();
this.p_sendQuitGame();
return;

case "start":
wNetWork.send("Msg_ERNN_Ready", []);
this.View.setStartBtn(!1);
break;

case "robBank":
wNetWork.send("Msg_ERNN_Act_CallBanker", {
type: 2
});
this.View.setRobBankBtn(!1);
break;

case "noRobBank":
wNetWork.send("Msg_ERNN_Act_CallBanker", {
type: 1
});
this.View.setRobBankBtn(!1);
break;

case "openPoker":
this.View.setOpenPoker(!1);
wNetWork.send("Msg_ERNN_Act_Show", []);
}
wAudioMgr.playBtnSound();
};
t.prototype.betOnClick = function(e) {
wAudioMgr.playBtnSound();
var t = e.target.betNum;
wNetWork.send("Msg_ERNN_Act_Bet", {
bet: t
});
this.View.initXZBet(null, null);
};
t.prototype.p_upGameGold = function(e) {
this.playerList[0].gold = e;
this.playerList[0].playerView.setGold(e);
};
t.prototype.initMsgEvevt = function() {
for (var e = this, t = function(t) {
wGEvent.on(t, function(i) {
1 == i.status ? e[t](i.data) : console.error("evevt", i);
}, i);
}, i = this, o = 0, a = [ "Msg_ERNN_CallBanKer", "Msg_ERNN_Bet", "Msg_ERNN_Act_Tuo", "Msg_ERNN_FaCards", "Msg_ERNN_Res", "Msg_ERNN_Act_CallBanker", "Msg_ERNN_Act_Bet", "Msg_ERNN_Act_Show", "Msg_ERNN_Ready", "Msg_ERNN_Add", "Msg_ERNN_ChangGold" ]; o < a.length; o++) t(a[o]);
};
t.prototype.getSeat = function(e) {
return e == wGameData.getKey("uid") ? 0 : 1;
};
t.prototype.getPlayer = function(e) {
return this.playerList[this.getSeat(e)];
};
t.prototype.Msg_ERNN_ChangGold = function(e) {
var t = this.getPlayer(e.uid);
t.gold = e.gold;
t.playerView.setGold(e.gold);
};
__decorate([ c(a.default) ], t.prototype, "playerView", void 0);
return __decorate([ s ], t);
}(o.default);
i.default = l;
cc._RF.pop();
}, {
ERNN_Player: "ERNN_Player",
ERNN_View: "ERNN_View",
PokerTableBase: void 0
} ],
ERNN_Player: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "a1811O7TLtFjIg0EbsWplND", "ERNN_Player");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = cc._decorator, a = o.ccclass;
o.property;
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
} else this.node.active = !1;
};
t.prototype.setGold = function(e) {
this.gold.string = wUtils.goldFormat(e, 2);
};
t.prototype.setState = function(e, t) {
var i = this, o = this.state.getChildByName(e);
o.active = t;
if ("bank" == e && t) {
o.active = !1;
var a = this.node.parent.parent.getChildByName("bank"), n = a.getChildByName("spine");
n.active = !0;
wUIHelp.playSpine(n, "animation", function() {
n.active = !1;
var e = cc.instantiate(a.getChildByName("anim"));
e.parent = a;
e.active = !0;
var t = wUtils.world_local_POS(a, wUtils.local_world__POS(o));
e.children[0].active = !0;
var r = cc.moveTo(.15, t), s = cc.callFunc(function() {
e.children[0].active = !1;
e.children[1].active = !0;
i.scheduleOnce(function() {
e.destroy();
o.active = !0;
}, .12);
});
e.runAction(cc.sequence(r, s));
});
} else t && cc.find("poker/0", this.node.parent.parent).active && (o.active = !1);
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
return __decorate([ a ], t);
}(cc.Component);
i.default = n;
cc._RF.pop();
}, {} ],
ERNN_View: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "90611PBGwBLFra/l0+JV8jS", "ERNN_View");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("Config"), a = cc._decorator, n = a.ccclass, r = a.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.typeImg = [];
t.title = null;
t.bgImg = [];
t.pokerImg = null;
t.autoBtn = [];
t.titleImg = [];
return t;
}
t.prototype.onLoad = function() {
this.controlle = this.node.getComponent("ERNN_Controlle");
this.title.spriteFrame = this.titleImg[wGameData.roomLevel - 1];
};
t.prototype.setPlayerNum = function(e) {
this.node.getChildByName("playerNum").getChildByName("label").getComponent(cc.Label).string = "" + e;
};
t.prototype.setStartBtn = function(e, t) {
void 0 === t && (t = !1);
var i = this.node.getChildByName("btn");
wUIHelp.hideSonNode(i);
var o = i.getChildByName("start");
o.active = e && !this.controlle.myAuto;
o.active && t ? o.setPosition(385, -285) : o.setPosition(-8.2, -178.3);
};
t.prototype.setRobBankBtn = function(e) {
var t = this.node.getChildByName("btn");
wUIHelp.hideSonNode(t);
t.getChildByName("robBank").active = e && !this.controlle.myAuto;
};
t.prototype.setAutoBtn = function(e) {
this.autoBtn[0].active = !e;
this.autoBtn[1].active = e;
};
t.prototype.setOpenPoker = function(e) {
var t = this.node.getChildByName("btn");
wUIHelp.hideSonNode(t);
t.getChildByName("openPoker").active = e && !this.controlle.myAuto;
};
t.prototype.setTips = function(e, t) {
var i = this.node.getChildByName("tips");
wUIHelp.hideSonNode(i);
e && (i.getChildByName(e).active = t);
};
t.prototype.initXZBet = function(e, t) {
var i = this.node.getChildByName("xiazhu");
i.active = Boolean(e) && !this.controlle.myAuto;
if (i.active) for (var a = 0; a < e.length; a++) {
var n = i.children[a];
n.betNum = e[a];
n.children[0].getComponent(cc.Label).string = wUtils.numConvert(e[a]);
if (e[a] <= t) {
n.getComponent(cc.Button).interactable = !0;
wUIHelp.setNodeColor(n, o.Config.colorSet.white);
} else {
n.getComponent(cc.Button).interactable = !1;
wUIHelp.setNodeColor(n, o.Config.colorSet.ash);
}
}
};
t.prototype.initJetton = function(e, t) {
this.node.getChildByName("jetton").children[e].active = !0;
this.setBet(e, t);
};
t.prototype.jettonAnim = function(e, t) {
var i = this, o = wUtils.local_world__POS(cc.find("player/" + e + "/head", this.node)), a = this.node.getChildByName("jetton").children[e];
o = wUtils.world_local_POS(a, o);
a.active = !0;
for (var n = function(n) {
var s = a.children[n];
s.active = !0;
!s.ePos && (s.ePos = s.getPosition());
s.setPosition(o);
s.scale = .4;
r.scheduleOnce(function() {
var o, a = e ? .15 : .1, r = cc.moveTo(a, s.ePos), c = cc.scaleTo(a / 2, 1), l = cc.spawn(r, c);
o = 0 == n ? cc.sequence(l, cc.callFunc(function() {
i.setBet(e, t);
})) : l;
s.runAction(o);
}, .1 * n);
}, r = this, s = 0; s < 3; s++) n(s);
};
t.prototype.setBet = function(e, t) {
this.node.getChildByName("player").children[e].getChildByName("bet").getComponent(cc.Label).string = t ? wUtils.numConvert(t) : "";
};
t.prototype.winShow = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
var i, o, a, n, r, s, c, l, p, d = this;
return __generator(this, function(u) {
switch (u.label) {
case 0:
i = function(e) {
var t = wUtils.local_world__POS(cc.find("player/" + Number(!Boolean(e)) + "/head", d.node)), i = d.node.getChildByName("jetton");
t = wUtils.world_local_POS(i, t);
for (var o = 0, a = i.children; o < a.length; o++) {
var n = a[o];
if (n.active) for (var r = function(e) {
var i = n.children[e];
!i.ePos && (i.ePos = i.getPosition());
var o = cc.delayTime(.08 * e), a = cc.moveTo(.2, t), r = cc.scaleTo(.2, .4), s = cc.spawn(a, r), c = cc.callFunc(function() {
i.active = !1;
i.scale = 1;
3 == e && i.destroy();
}), l = cc.sequence(o, s, c);
i.stopAllActions();
i.runAction(l);
}, s = 0; s < n.children.length; s++) r(s);
}
};
o = function(o) {
var n, r, s, c, l, p, d, u, h, m;
return __generator(this, function(g) {
switch (g.label) {
case 0:
n = e[o];
r = o == wGameData.getKey("uid") ? 0 : 1;
a.setBet(r, 0);
if (n.score > 0) return [ 2, "continue" ];
if (o != t) return [ 3, 2 ];
a.jettonAnim(r, 0);
return [ 4, wUtils.syncDelayed(.5, a) ];

case 1:
g.sent();
i(r);
return [ 3, 3 ];

case 2:
if (e[t].type > 7) {
s = cc.find("jetton/" + r, a.node);
c = wUtils.local_world__POS(cc.find("player/" + r + "/head", a.node));
c = wUtils.world_local_POS(s, c);
(l = cc.instantiate(s.children[0])).parent = s;
l.setPosition(c);
l.scale = .4;
p = cc.moveTo(.2, s.children[1].getPosition());
d = cc.scaleTo(.2, 1);
u = cc.spawn(p, d);
h = cc.callFunc(function() {
i(r);
});
m = cc.sequence(u, h);
l.runAction(m);
} else i(r);
g.label = 3;

case 3:
return [ 2 ];
}
});
};
a = this;
n = [];
for (r in e) n.push(r);
s = 0;
u.label = 1;

case 1:
if (!(s < n.length)) return [ 3, 4 ];
p = n[s];
return [ 5, o(p) ];

case 2:
u.sent();
u.label = 3;

case 3:
s++;
return [ 3, 1 ];

case 4:
return [ 4, wUtils.syncDelayed(.2, this) ];

case 5:
u.sent();
c = function(t) {
var i = e[t], o = t == wGameData.getKey("uid") ? 0 : 1, a = l.node.getChildByName("winNum").getChildByName(i.score > 0 ? "z" : "f");
a.getComponent(cc.Label).string = (i.score > 0 ? "+" : "-") + wUtils.numConvert(Math.abs(i.score));
var n = cc.find("player/" + o, l.node).getPosition();
a.setPosition(n);
i.score;
var r = cc.jumpBy(.2, cc.v2(0, 130), 40, 1), s = cc.delayTime(2), c = cc.callFunc(function() {
a.getComponent(cc.Label).string = "";
}), p = cc.sequence(r, s, c);
a.runAction(p);
};
l = this;
for (p in e) c(p);
return [ 2 ];
}
});
});
};
t.prototype.initWinShow = function() {
for (var e = 0, t = this.node.getChildByName("winNum").children; e < t.length; e++) t[e].getComponent(cc.Label).string = "";
};
t.prototype.kaiPaiShow = function(e) {
for (var t = this, i = this.node.getChildByName("poker"), o = function(e) {
var i = cc.scaleTo(.1, 0, 1), o = cc.callFunc(function() {
var i = t.pokerImg.getSpriteFrame("plist_puke_front_big");
e.getComponent(cc.Sprite).spriteFrame = i;
}), a = cc.scaleTo(.1, 1), n = cc.sequence(i, o, a);
e.active = !0;
e.runAction(n);
wUIHelp.hideSonNode(e, !0);
}, a = 0, n = i.getChildByName("1").children; a < n.length; a++) o(n[a]);
var r = function(t) {
var o = e[t], a = t == wGameData.getKey("uid") ? 0 : 1, n = i.getChildByName(a + "type"), r = s.typeImg[o.type - 1];
s.scheduleOnce(function() {
var e = 1;
o.headimgurl % 12 < 6 && (e = 0);
var t = o.type - 1;
t > 10 && (t = 10);
var i = "sound/effect_niu_" + e + "_" + t;
wAudioMgr.playSound(i, "ERNN");
}, .4 * Number(a));
n.children[0].getComponent(cc.Sprite).spriteFrame = r;
var c = 0;
switch (o.type - 1) {
case 0:
c = 0;
break;

case 1:
case 2:
case 3:
c = 1;
break;

case 4:
case 5:
case 6:
c = 2;
break;

case 7:
case 8:
case 9:
c = 3;
break;

default:
c = 4;
}
n.getComponent(cc.Sprite).spriteFrame = s.bgImg[c];
n.active = !0;
}, s = this;
for (var c in e) r(c);
};
t.prototype.initPaiShow = function(e) {
for (var t = this.node.getChildByName("poker"), i = 0; i < 2; i++) {
var o = e[i], a = t.getChildByName("" + i);
a.active = !0;
for (var n = 0; n < 5; n++) {
var r = a.children[n];
this.setPokerNode(o[n], r);
var s = this.pokerImg.getSpriteFrame("plist_puke_front_big");
r.getComponent(cc.Sprite).spriteFrame = s;
wUIHelp.hideSonNode(r, !0);
}
}
};
t.prototype.faPaiShow = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o, a = this;
return __generator(this, function(n) {
switch (n.label) {
case 0:
t = this.node.getChildByName("poker");
this.initPoker();
return [ 4, new Promise(function(e) {
for (var i = function(i) {
var o = t.getChildByName("" + i);
o.active = !0;
for (var n = function(t) {
wUIHelp.hideSonNode(t);
var n = a.pokerImg.getSpriteFrame("plist_puke_back_big_2");
t.getComponent(cc.Sprite).spriteFrame = n;
!t.spos && (t.spos = t.getPosition());
t.setPosition(0, 0);
t.scale = .3;
var r = cc.delayTime(.08 * Number(t.name)), s = cc.bezierTo(.2, [ cc.v2(0, 0), cc.v2(o.children[0].spos.x - 100, i ? 100 : -100), o.children[0].spos ]).easing(cc.easeIn(.8)), c = cc.scaleTo(.15, 1), l = cc.callFunc(function() {
"4" == t.name && 1 == i && e();
}), p = cc.sequence(r, cc.spawn(s, c), l);
t.runAction(p);
}, r = 0, s = o.children; r < s.length; r++) n(s[r]);
}, o = 0; o < 2; o++) i(o);
}) ];

case 1:
n.sent();
i = function(i) {
var o = e[i], n = t.getChildByName("" + i);
n.active = !0;
for (var r = function(e) {
var t = n.children[e], r = cc.moveTo(.2, t.spos), s = cc.callFunc(function() {
if (1 != i) {
var n = cc.scaleTo(.2, 0, 1), r = cc.callFunc(function() {
a.setPokerNode(o[e], t);
var i = a.pokerImg.getSpriteFrame("plist_puke_front_big");
t.getComponent(cc.Sprite).spriteFrame = i;
wUIHelp.hideSonNode(t, !0);
}), s = cc.scaleTo(.2, 1), c = cc.sequence(n, r, s);
t.runAction(c);
} else a.setPokerNode(o[e], t);
}), c = cc.sequence(r, s);
t.runAction(c);
}, s = 0; s < 5; s++) r(s);
};
for (o = 0; o < 2; o++) i(o);
return [ 2 ];
}
});
});
};
t.prototype.initPoker = function() {
for (var e = 0, t = this.node.getChildByName("poker").children; e < t.length; e++) t[e].active = !1;
};
t.prototype.getPokerUrl = function(e) {
var t = e % 100 - 1;
return {
pai: "plist_puke_value_" + t % 2 + "_" + Math.floor(e / 100),
hua: "plist_puke_color_small_" + t,
dh: "plist_puke_color_big_" + t
};
};
t.prototype.setPokerNode = function(e, t) {
t.children[1].opacity = 0;
t = t.children[0];
for (var i = this.getPokerUrl(e), o = 0, a = t.children; o < a.length; o++) {
var n = a[o];
n.getComponent(cc.Sprite).spriteFrame = this.pokerImg.getSpriteFrame(i[n.name]);
n.active = !0;
}
};
__decorate([ r(cc.SpriteFrame) ], t.prototype, "typeImg", void 0);
__decorate([ r(cc.Sprite) ], t.prototype, "title", void 0);
__decorate([ r(cc.SpriteFrame) ], t.prototype, "bgImg", void 0);
__decorate([ r(cc.SpriteAtlas) ], t.prototype, "pokerImg", void 0);
__decorate([ r(cc.Node) ], t.prototype, "autoBtn", void 0);
__decorate([ r([ cc.SpriteFrame ]) ], t.prototype, "titleImg", void 0);
return __decorate([ n ], t);
}(cc.Component);
i.default = s;
cc._RF.pop();
}, {
Config: void 0
} ]
}, {}, [ "ERNNRoomLoad", "ERNNTableSelect", "ERNN_Auto", "ERNN_Controlle", "ERNN_Player", "ERNN_View" ]);