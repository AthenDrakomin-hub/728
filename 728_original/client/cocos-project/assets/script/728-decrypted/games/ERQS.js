window.__require = function e(t, i, o) {
function n(r, d) {
if (!i[r]) {
if (!t[r]) {
var c = r.split("/");
c = c[c.length - 1];
if (!t[c]) {
var s = "function" == typeof __require && __require;
if (!d && s) return s(c, !0);
if (a) return a(c, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = c;
}
var h = i[r] = {
exports: {}
};
t[r][0].call(h.exports, function(e) {
return n(t[r][1][e] || e);
}, h, h.exports, e, t, i, o);
}
return i[r].exports;
}
for (var a = "function" == typeof __require && __require, r = 0; r < o.length; r++) n(o[r]);
return n;
}({
ERQS_Controll: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "53e87W7MaVJN7UqytfuSrY5", "ERQS_Controll");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("PokerBase"), n = e("ERQS_Player"), a = e("ERQS_View"), r = cc._decorator, d = r.ccclass, c = r.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.playerView = [];
t.View = null;
t.playerList = {};
t.state = 0;
return t;
}
t.prototype.start = function() {
this.View = this.node.getComponent(a.default);
this.initMsgEvevt();
this.m_init();
};
t.prototype.m_roomInfo = function(e) {
var t = e.players;
for (var i in t) {
var o = t[i];
o.uid = i;
var n = this.getSeat(i);
o.seat = n;
var a = this.playerView[o.seat];
a.updatePlayerInfo(o);
a.updateTingPaiView(!1);
e.banker == i ? a.updateZhuanView(!0) : a.updateZhuanView(!1);
o.playerView = a;
this.playerList[n] = o;
a.updateReady(e.game_status < 2);
}
this.roomInfo = e;
this.state = e.game_status;
this.View.setRoomInfo(e);
switch (this.state) {
case 0:
case 1:
1 == wGameData.roomLevel && 1e7 == e.gold && wUIManager.showConfirmUI_B({
type: 3
});
break;

case 2:
break;

case 3:
n = this.getSeat(e.turn.uid);
this.View.setDirction(n, e.time);
0 == n && (this.View.canPutCard = !0);
this.View.labelMjNum.node.parent.active = !0;
for (var i in e.players) if (i == wGameData.getKey("uid")) {
for (var r in e.players[i].place) for (var d = e.players[i].place[r], c = 0; c < d.length; c++) this.View.mainCardsData.place.push(d[c]);
this.View.is_listen = e.players[i].is_listen;
this.View.updateMainMj(e.cards, this.View.mainCardsData.place);
this.View.updateMainChupai(e.players[i].outCards);
this.View.updateMainBuhua(e.players[i].hua);
this.View.showAction(e.players[i].ready_do);
this.View.isIntrust = 1 == e.players[i].intrust;
1 == e.players[i].is_listen && this.View.setTingState();
1 == e.players[i].intrust && (this.View.intrustNode.active = !0);
this.View.setTing(e.put_listen);
} else {
for (var r in e.players[i].place) {
d = e.players[i].place[r];
for (c = 0; c < d.length; c++) this.View.otherCardsData.place.push(d[c]);
}
this.View.updateOtherMj(e.players[i].cardsCount, this.View.otherCardsData.place);
this.View.updateOtherChupai(e.players[i].outCards);
this.View.updateOtherBuhua(e.players[i].hua);
}
}
};
t.prototype.p_quitGame = function() {
this.playerView[1].updatePlayerInfo(null);
this.node.getChildByName("nodeOther").active = !1;
};
t.prototype.m_upGameGold = function() {};
t.prototype.m_NetWorkState = function() {};
t.prototype.initMsgEvevt = function() {
for (var e = this, t = function(t) {
wGEvent.on(t, function(i) {
1 == i.status ? e[t](i.data) : console.error("evevt", i);
}, i);
}, i = this, o = 0, n = [ "Msg_ERQS_StartGame", "Msg_ERQS_Deing", "Msg_ERQS_PutListen", "Msg_GAME_ChangGold", "Msg_ERQS_Listen", "Msg_ERQS_Hua", "Msg_ERQS_Flop", "Msg_ERQS_Add", "Msg_ERQS_Out", "Msg_ERQS_PutCard", "Msg_ERQS_Deal", "Msg_ERQS_ShowCards", "Msg_ERQS_GoldChange", "Msg_ERQS_CHECK", "Msg_ERQS_RUN", "Msg_ERQS_InTrust", "Msg_ERQS_Ready", "Msg_ERQS_RefSinglePlayer" ]; o < n.length; o++) t(n[o]);
};
t.prototype.Msg_ERQS_Out = function(e) {
e.uid != wGameData.getKey("uid") && this.p_quitGame({});
};
t.prototype.getSeat = function(e) {
return e == wGameData.getKey("uid") ? 0 : 1;
};
t.prototype.getPlayer = function(e) {
return this.playerList[this.getSeat(e)];
};
t.prototype.Msg_ERQS_StartGame = function(e) {
this.state = 1;
this.roomInfo.banker = e.banker;
for (var t in this.playerList) {
var i = this.playerList[t], o = this.playerView[i.seat];
o.updateReady(!1);
e.banker == this.playerList[t].uid ? o.updateZhuanView(!0) : o.updateZhuanView(!1);
}
this.View.startGame(e);
};
t.prototype.Msg_ERQS_Add = function(e) {
var t = e, i = this.getSeat(t.uid);
t.seat = i;
var o = this.playerView[t.seat];
o.updateOtherInfo(t);
t.playerView = o;
this.playerList[i] = t;
};
t.prototype.Msg_ERQS_Deing = function(e) {
this.View.setFaCard(e);
};
t.prototype.Msg_ERQS_PutListen = function(e) {
Object.keys(e.listen).length > 0 && this.View.setTing(e.listen);
};
t.prototype.Msg_ERQS_Listen = function() {};
t.prototype.Msg_ERQS_Hua = function(e) {
this.View.setBuHua(e);
};
t.prototype.Msg_ERQS_Flop = function(e) {
this.View.addCard(e);
};
t.prototype.Msg_ERQS_PutCard = function(e) {
for (var t in e.uids) if (e.uids[t].ready_do) 0 == this.getSeat(t) && this.View.showAction(e.uids[t].ready_do); else if (t != wGameData.getKey("uid")) {
this.View.playOtherChupaiAni(e.uids[t].pid);
this.View.setDirction(0, e.time);
} else {
this.View.canPutCard = !1;
this.View.setDirction(1, e.time);
this.View.playMainChuPaiAni(e.uids[t].pid, 598, 78, !1);
}
};
t.prototype.sendMsgPutCard = function(e) {
wNetWork.send("Msg_ERQS_PutCard", {
card: e
});
};
t.prototype.Msg_ERQS_Deal = function(e) {
this.View.showDeal(e);
};
t.prototype.sendMsgDeal = function(e) {
wNetWork.send("Msg_ERQS_Deal", {
do: e.do,
pid: e.pid
});
};
t.prototype.Msg_ERQS_ShowCards = function(e) {
for (var t in e.uids) 0 == this.getSeat(t) ? this.View.updateMainMj(e.uids[t], this.View.mainCardsData.place) : this.View.showOtherCard(e.uids[t], this.View.otherCardsData.place);
};
t.prototype.Msg_ERQS_GoldChange = function(e) {
for (var t in e.uids) {
var i = this.getPlayer(t);
i.gold = e.uids[t].gold;
i.playerView.setGold(e.uids[t].gold);
}
};
t.prototype.Msg_ERQS_CHECK = function(e) {
this.state = 0;
this.View.showResult(e);
};
t.prototype.Msg_ERQS_RUN = function() {};
t.prototype.Msg_ERQS_InTrust = function(e) {
if (0 == this.getSeat(e.uid)) {
this.View.isIntrust = e.intrust;
1 == e.intrust && (this.View.intrustNode.active = !0);
}
};
t.prototype.sendInTrust = function(e) {
void 0 === e && (e = 0);
this.View.isIntrust && wNetWork.send("Msg_ERQS_InTrust", {
intrust: e
});
};
t.prototype.Msg_ERQS_Ready = function(e) {
e.uid == wGameData.getKey("uid") && this.View.initNode();
var t = this.getSeat(e.uid), i = this.playerView[t];
i.updateTingPaiView(!1);
i.updateReady(!0);
this.View.nodeOtherPlayer.active = !0;
};
t.prototype.Msg_ERQS_RefSinglePlayer = function() {};
t.prototype.Msg_GAME_ChangGold = function(e) {
var t = this.getPlayer(e.uid);
t.gold = e.gold;
t.playerView.setGold(e.gold);
};
__decorate([ c(n.default) ], t.prototype, "playerView", void 0);
return __decorate([ d ], t);
}(o.default);
i.default = s;
cc._RF.pop();
}, {
ERQS_Player: "ERQS_Player",
ERQS_View: "ERQS_View",
PokerBase: void 0
} ],
ERQS_Player: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "2b7c4aeSm5F4btAqkSpaFlM", "ERQS_Player");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = cc._decorator, n = o.ccclass, a = o.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.spriteHead = null;
t.labelName = null;
t.labelGold = null;
t.spriteTingpai = null;
t.spriteZhuan = null;
t.spriteReady = null;
return t;
}
t.prototype.onLoad = function() {
this.spriteZhuan.node.active = !1;
this.spriteTingpai.node.active = !1;
this.labelName.string = "";
this.labelGold.string = "0";
};
t.prototype.updatePlayerInfo = function(e) {
if (e) {
var t = e.info;
this.node.active = !0;
this.spriteHead.spriteFrame = null;
wUIHelp.setHead(this.spriteHead, t.headimgurl, !0);
this.labelName.string = t.nickname;
this.setGold(t.gold);
this.updateReady(e.ready);
} else this.node.active = !1;
};
t.prototype.updateOtherInfo = function(e) {
if (e) {
this.node.active = !0;
this.labelName.string = e.nickname;
wUIHelp.setHead(this.spriteHead, e.headimgurl, !0);
this.setGold(e.gold);
this.node.getChildByName("spriteTIngpai").active = !1;
this.node.getChildByName("spriteZhuan").active = !1;
this.node.getChildByName("spriteReady").active = !1;
} else this.node.active = !1;
};
t.prototype.setGold = function(e, t) {
void 0 === t && (t = !1);
this.labelGold.string = wUtils.goldFormat(e);
if (t) {
var i = cc.scaleTo(.3, 1.3), o = cc.delayTime(.3), n = cc.scaleTo(.3, 1), a = cc.sequence(i, o, n);
this.labelGold.node.runAction(a);
}
};
t.prototype.updateZhuanView = function(e) {
this.spriteZhuan.node.active = e;
};
t.prototype.updateTingPaiView = function(e) {
this.spriteTingpai.node.active = e;
};
t.prototype.updateReady = function(e) {
this.spriteReady.node.active = e;
};
__decorate([ a(cc.Sprite) ], t.prototype, "spriteHead", void 0);
__decorate([ a(cc.Label) ], t.prototype, "labelName", void 0);
__decorate([ a(cc.Label) ], t.prototype, "labelGold", void 0);
__decorate([ a(cc.Sprite) ], t.prototype, "spriteTingpai", void 0);
__decorate([ a(cc.Sprite) ], t.prototype, "spriteZhuan", void 0);
__decorate([ a(cc.Sprite) ], t.prototype, "spriteReady", void 0);
return __decorate([ n ], t);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {} ],
ERQS_RoomLoad: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "3f0e8B2jgNFqahfsWI4Y371", "ERQS_RoomLoad");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("Config"), n = cc._decorator, a = n.ccclass, r = n.property, d = function(e) {
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
}, this).then(function(t) {
wGameData.roomConfig = t;
for (var i = 0; i < 4; i++) e.content.getChildByName("" + i).getChildByName("New Node").getChildByName("difen").getComponent(cc.Label).string = "准入" + t[i + 1].min_gold;
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
for (var n = 1; n < t.childrenCount; n++) {
var a = t.children[n];
!a.endPos && (a.endPos = cc.v2(a.x, a.y));
a.x = a.endPos.x + 250;
var r = cc.moveTo(.2, a.endPos).easing(cc.easeBackOut());
r.speed(.5);
a.stopAllActions();
a.runAction(r);
}
e.isAnim = !0;
};
if (this.load.active) {
var i = this.load.getChildByName("logo");
i.y = 150;
var o = cc.moveTo(.15, cc.v2(0, 0)), n = cc.fadeTo(.1, 255), a = cc.delayTime(.05), r = cc.fadeTo(.06, 0), d = cc.moveTo(.1, cc.v2(0, 150)), c = cc.callFunc(function() {
e.load.active = !1;
}), s = cc.sequence(cc.spawn(o, n), a, cc.spawn(r, d), c);
i.runAction(s);
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
var i = this.room.getChildByName("scrollView"), o = cc.fadeTo(.15, 0), n = cc.callFunc(function() {
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
i.runAction(cc.sequence(o, n));
for (var a = function(e) {
var i = t.children[e], o = cc.v2(i.x, i.y), n = cc.moveBy(.2, cc.v2(250, 0)), a = cc.callFunc(function() {
i.setPosition(o);
});
i.runAction(cc.sequence(n, a));
}, r = 1; r < t.childrenCount; r++) a(r);
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
var i = wGameData.roomConfig[e];
if (i) if (i.min_gold > wGameData.getKey("gold")) wUIManager.enterRoomFailTips(i.min_gold); else if (wGameData.gameRepair()) wUIManager.showTips("游戏维护中"); else {
this.isEnterRoom = !0;
var o = wGEvent.on("Msg_Hall_EnterRoom", function(e) {
t.Msg_Hall_EnterRoom(e);
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
wNetWork.send("Msg_Hall_EnterRoom", {
tableid: 0,
gtype: Number(wGameData.gameID),
level: e
});
} else wUIManager.showTips("游戏配置错误，请重新进入游戏！");
}
};
t.prototype.faststart = function() {
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
var e = o.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(e.prefabUrl, function() {}, function(e, t) {
e ? wLog.e(e) : wViewMgr.openGame(t);
}, e.enName);
};
t.prototype.preloadGameRes = function() {
var e = o.Config.GamePrefab[wGameData.gameID];
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
return __decorate([ a ], t);
}(cc.Component);
i.default = d;
cc._RF.pop();
}, {
Config: void 0
} ],
ERQS_View: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "4a987lMhLNFlJaKnPoRfGH7", "ERQS_View");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("Config"), n = e("ERQS_Controll"), a = e("FrameAnim "), r = cc._decorator, d = r.ccclass, c = r.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.intrustNode = null;
t.labelMjNum = null;
t.nodeCenter = null;
t.spriteDirctionTopBg = null;
t.spriteDirctionTop = null;
t.spriteDirctionBottomBg = null;
t.spriteDirctionBottom = null;
t.labelCountDown = null;
t.labelDifen = null;
t.nodeDice = null;
t.nodeDice1 = null;
t.nodeDice2 = null;
t.nodeOtherPlayer = null;
t.spriteOtherHead = null;
t.labelOtherName = null;
t.labelOtherGold = null;
t.spriteOtherTingpai = null;
t.spriteOtherZhuan = null;
t.nodeMainPlayer = null;
t.spriteMainHead = null;
t.labelMainName = null;
t.labelMainGold = null;
t.spriteMainTingpai = null;
t.spriteMainZhuan = null;
t.nodeOther = null;
t.nodeOtherMj = null;
t.nodeOtherMjGang1 = null;
t.nodeOtherMjGang1_1 = null;
t.nodeOtherMjGang1_2 = null;
t.nodeOtherMjGang1_3 = null;
t.nodeOtherMjGang1_4 = null;
t.nodeOtherMjGang2 = null;
t.nodeOtherMjGang2_1 = null;
t.nodeOtherMjGang2_2 = null;
t.nodeOtherMjGang2_3 = null;
t.nodeOtherMjGang2_4 = null;
t.nodeOtherMjGang3 = null;
t.nodeOtherMjGang3_1 = null;
t.nodeOtherMjGang3_2 = null;
t.nodeOtherMjGang3_3 = null;
t.nodeOtherMjGang3_4 = null;
t.nodeOtherMjGang4 = null;
t.nodeOtherMjGang4_1 = null;
t.nodeOtherMjGang4_2 = null;
t.nodeOtherMjGang4_3 = null;
t.nodeOtherMjGang4_4 = null;
t.nodeOtherMj1 = null;
t.nodeOtherMj2 = null;
t.nodeOtherMj3 = null;
t.nodeOtherMj4 = null;
t.nodeOtherMj5 = null;
t.nodeOtherMj6 = null;
t.nodeOtherMj7 = null;
t.nodeOtherMj8 = null;
t.nodeOtherMj9 = null;
t.nodeOtherMj10 = null;
t.nodeOtherMj11 = null;
t.nodeOtherMj12 = null;
t.nodeOtherMj13 = null;
t.nodeOtherMj14 = null;
t.nodeOtherShowCard = null;
t.nodeOtherShowCard1 = null;
t.nodeOtherShowCard2 = null;
t.nodeOtherShowCard3 = null;
t.nodeOtherShowCard4 = null;
t.nodeOtherShowCard5 = null;
t.nodeOtherShowCard6 = null;
t.nodeOtherShowCard7 = null;
t.nodeOtherShowCard8 = null;
t.nodeOtherShowCard9 = null;
t.nodeOtherShowCard10 = null;
t.nodeOtherShowCard11 = null;
t.nodeOtherShowCard12 = null;
t.nodeOtherShowCard13 = null;
t.nodeOtherShowCard14 = null;
t.nodeOtherChupai = null;
t.nodeOtherChupai1 = null;
t.nodeOtherChupai2 = null;
t.nodeOtherChupai3 = null;
t.nodeOtherChupai4 = null;
t.nodeOtherChupai5 = null;
t.nodeOtherChupai6 = null;
t.nodeOtherChupai7 = null;
t.nodeOtherChupai8 = null;
t.nodeOtherChupai9 = null;
t.nodeOtherChupai10 = null;
t.nodeOtherChupai11 = null;
t.nodeOtherChupai12 = null;
t.nodeOtherChupai13 = null;
t.nodeOtherChupai14 = null;
t.nodeOtherChupai15 = null;
t.nodeOtherChupai16 = null;
t.nodeOtherChupai17 = null;
t.nodeOtherChupai18 = null;
t.nodeOtherChupai19 = null;
t.nodeOtherChupai20 = null;
t.nodeOtherChupai21 = null;
t.nodeOtherChupai22 = null;
t.nodeOtherChupai23 = null;
t.nodeOtherChupai24 = null;
t.nodeOtherChupai25 = null;
t.nodeOtherChupai26 = null;
t.skeletonOtherPaitisi = null;
t.nodeOtherBuhua = null;
t.nodeOtherBuhua1 = null;
t.nodeOtherBuhua2 = null;
t.nodeOtherBuhua3 = null;
t.nodeOtherBuhua4 = null;
t.nodeOtherBuhua5 = null;
t.nodeOtherBuhua6 = null;
t.nodeOtherBuhua7 = null;
t.nodeOtherBuhua8 = null;
t.nodeOtherBuhuaAni = null;
t.nodeOtherChupaiAni = null;
t.nodeMain = null;
t.nodeMainChupai = null;
t.nodeMainChupai1 = null;
t.nodeMainChupai2 = null;
t.nodeMainChupai3 = null;
t.nodeMainChupai4 = null;
t.nodeMainChupai5 = null;
t.nodeMainChupai6 = null;
t.nodeMainChupai7 = null;
t.nodeMainChupai8 = null;
t.nodeMainChupai9 = null;
t.nodeMainChupai10 = null;
t.nodeMainChupai11 = null;
t.nodeMainChupai12 = null;
t.nodeMainChupai13 = null;
t.nodeMainChupai14 = null;
t.nodeMainChupai15 = null;
t.nodeMainChupai16 = null;
t.nodeMainChupai17 = null;
t.nodeMainChupai18 = null;
t.nodeMainChupai19 = null;
t.nodeMainChupai20 = null;
t.nodeMainChupai21 = null;
t.nodeMainChupai22 = null;
t.nodeMainChupai23 = null;
t.nodeMainChupai24 = null;
t.nodeMainChupai25 = null;
t.nodeMainChupai26 = null;
t.skeletonMainPaitisi = null;
t.nodeMainChupaiAni = null;
t.nodeMainBuhua = null;
t.nodeMainBuhua1 = null;
t.nodeMainBuhua2 = null;
t.nodeMainBuhua3 = null;
t.nodeMainBuhua4 = null;
t.nodeMainBuhua5 = null;
t.nodeMainBuhua6 = null;
t.nodeMainBuhua7 = null;
t.nodeMainBuhua8 = null;
t.nodeMainBuhuaAni = null;
t.nodeMainMj = null;
t.nodeMainMjGang1 = null;
t.nodeMainMjGang1_1 = null;
t.nodeMainMjGang1_2 = null;
t.nodeMainMjGang1_3 = null;
t.nodeMainMjGang1_4 = null;
t.nodeMainMjGang2 = null;
t.nodeMainMjGang2_1 = null;
t.nodeMainMjGang2_2 = null;
t.nodeMainMjGang2_3 = null;
t.nodeMainMjGang2_4 = null;
t.nodeMainMjGang3 = null;
t.nodeMainMjGang3_1 = null;
t.nodeMainMjGang3_2 = null;
t.nodeMainMjGang3_3 = null;
t.nodeMainMjGang3_4 = null;
t.nodeMainMjGang4 = null;
t.nodeMainMjGang4_1 = null;
t.nodeMainMjGang4_2 = null;
t.nodeMainMjGang4_3 = null;
t.nodeMainMjGang4_4 = null;
t.nodeMainMj1 = null;
t.nodeMainMj2 = null;
t.nodeMainMj3 = null;
t.nodeMainMj4 = null;
t.nodeMainMj5 = null;
t.nodeMainMj6 = null;
t.nodeMainMj7 = null;
t.nodeMainMj8 = null;
t.nodeMainMj9 = null;
t.nodeMainMj10 = null;
t.nodeMainMj11 = null;
t.nodeMainMj12 = null;
t.nodeMainMj13 = null;
t.nodeMainMj14 = null;
t.nodeMainMjAni = null;
t.btnClickMj = null;
t.nodeMainAction = null;
t.btnMainGuo = null;
t.btnMainChi = null;
t.btnMainPeng = null;
t.btnMainGang = null;
t.btnMainTing = null;
t.btnMainHu = null;
t.nodeMainTing = null;
t.btnMainTingCancel = null;
t.nodeMainTingReal = null;
t.spriteMainTingBg = null;
t.spriteMainTingHu = null;
t.nodeMainTingDetail = null;
t.nodeMainTingItem = null;
t.nodeMainChi = null;
t.btnMainChiguo = null;
t.nodeMainChi1 = null;
t.nodeMainChiMj1_1 = null;
t.nodeMainChiMj1_2 = null;
t.nodeMainChiMj1_3 = null;
t.nodeMainChi2 = null;
t.nodeMainChiMj2_1 = null;
t.nodeMainChiMj2_2 = null;
t.nodeMainChiMj2_3 = null;
t.nodeMainChi3 = null;
t.nodeMainChiMj3_1 = null;
t.nodeMainChiMj3_2 = null;
t.nodeMainChiMj3_3 = null;
t.btnMainChiback = null;
t.nodeCardAni = null;
t.nodeCardAniReal = null;
t.spriteCardAni = null;
t.nodeMainHuCard = null;
t.nodeOtherHuCard = null;
t.nodeSpine = null;
t.skeletonChi = null;
t.skeletonLongjuanPai = null;
t.skeletonGang = null;
t.skeletonHu = null;
t.skeletonLiuju = null;
t.skeletonPeng = null;
t.skeletonTing = null;
t.skeletonZimo = null;
t.skeletonHucard = null;
t.btnChat = null;
t.btnMenu = null;
t.btnMenuClose = null;
t.nodeMenuMask = null;
t.spriteMenuBg = null;
t.btnMenuChange = null;
t.btnMenuBank = null;
t.btnMenuRule = null;
t.btnMenuChat = null;
t.btnMenuSetting = null;
t.btnMenuBack = null;
t.btnStart = null;
t.spriteAtlasMj = null;
t.spriteAtlasDice = null;
t.spriteFrameMenuNormal = null;
t.spriteFrameMenuSelect = null;
t.spriteFrameWestNormal = null;
t.spriteFrameWestSelect = null;
t.spriteFrameEastNormal = null;
t.spriteFrameEastSelect = null;
t.mjPositionData = [];
t.nodeSelectMj = null;
t.startNodePosition = null;
t.startPosition = null;
t.tingData = null;
t.mainCardsData = {
cards: [],
place: []
};
t.mainChupaiData = [];
t.mainBuhuaData = [];
t.otherCardsData = {
cardscount: 0,
place: []
};
t.otherChupaiData = [];
t.otherBuhuaData = [];
t.controll = null;
t.mainDirectionSpirte = [];
t.otherDirectionSpirte = [];
t.lastMjNum = 0;
t.countdown = 0;
t.cardid = 0;
t.canPutCard = !1;
t.isIntrust = !1;
t.isTing = !1;
t.mainWaitBuhuaData = [];
t.otherWaitBuhuaData = [];
t.is_listen = 0;
t.putpid = 0;
t.cardtype = {
dasixi: "大四喜 88番",
dasanyuan: "大三元 88番",
jiulianbaodeng: "九莲宝灯 88番",
dayuwu: "大于五 88番",
xiaoyuwu: "小于五 88番",
daqixing: "大七星 88番",
sigang: "四杠 88番",
lianqidui: "连七对 88番",
tianhu: "天胡 88番",
dihu: "地胡 88番",
xiaosixi: "小四喜 64番",
xiaosanyuan: "小三元 64番",
sianke: "四暗刻 64番",
shuanglonghui: "双龙会 64番",
ziyise: "字一色 64番",
rehu: "人胡 64番",
sitongshun: "四同顺 48番",
sanyuanqiduizi: "三元七对子 48番",
sixiqiduizi: "四喜七对子 48番",
silianke: "四连刻 48番",
sibugao: "四步高 32番",
hunyaojiu: "混幺九 32番",
sangang: "三杠 32番",
tianting: "天听 32番",
sizike: "四字刻 24番",
dasanfeng: "大三风 24番",
santongshun: "三同顺 24番",
qiduizi: "七对子 24番",
sanlianke: "三连刻 24番",
qinglong: "清龙 16番",
sanbugao: "三步高 16番",
quanhua: "全花 16番",
sananke: "三暗刻 16番",
qingyise: "清一色 16番",
miaoshouhuichun: "妙手回春 8番",
haidilaoyue: "海底捞月 8番",
gangshangkaihua: "杠上开花 8番",
qiangganghu: "抢杠胡 8番",
xiaosanfeng: "小三风 6番",
shuangjianke: "双箭刻 6番",
pengpenghu: "碰碰和 6番",
shuangangang: "双暗杠 6番",
hunyise: "混一色 6番",
quanqiuren: "全求人 6番",
quandaiyao: "全带幺 4番",
shuangminggang: "双明杠 4番",
buqiuren: "不求人 4番",
hujuezhang: "和绝张 4番",
wuhuapai: "无花牌 4番",
baoting: "报听 4番",
baotingyifa: "报听一发 4番",
meilanzhuju: "梅兰竹菊 4番",
chunxiaqiudong: "春夏秋冬 4番",
menfengke: "门风刻 2番",
quanfengke: "圈风刻 2番",
jianke: "箭刻 2番",
pinghu: "平和 2番",
siguiyi: "四归一 2番",
duanyaojiu: "断幺 2番",
shuanganke: "双暗刻 2番",
angang: "暗杠 2番",
menqianqing: "门前清 2番",
yibangao: "一般高 1番",
lianliu: "连六 1番",
laoshaofu: "老少副 1番",
huapai: "花牌 1番",
minggang: "明杠 1番",
bianzhang: "边张 1番",
kanzhang: "坎张 1番",
dandiaozhang: "单钓张 1番",
zimo: "自摸 1番",
dandiaojiang: "单钓将"
};
t.sound = {
11: "wan1",
12: "wan2",
13: "wan3",
14: "wan4",
15: "wan5",
16: "wan6",
17: "wan7",
18: "wan8",
19: "wan9",
41: "hongzhong",
42: "facai",
43: "baiban",
51: "dongfeng",
52: "nanfeng",
53: "xifeng",
54: "buhu"
};
return t;
}
t.prototype.onLoad = function() {
this.controll = this.node.getComponent(n.default);
this.initNode();
this.btnClickMj.node.on(cc.Node.EventType.TOUCH_START, this.onClickStart, this);
this.btnClickMj.node.on(cc.Node.EventType.TOUCH_MOVE, this.onClickMove, this);
this.btnClickMj.node.on(cc.Node.EventType.TOUCH_END, this.onClickEnd, this);
this.btnClickMj.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onClickEnd, this);
this.startPosition = null;
this.fixUI();
};
t.prototype.fixUI = function() {
if (cc.winSize.width < 1334) {
this.nodeMain.scale = cc.winSize.width / 1334;
this.nodeOther.scale = cc.winSize.width / 1334;
} else {
this.nodeMain.scale = 1;
this.nodeOther.scale = 1;
}
};
t.prototype.onClickStart = function(e) {
this.controll.sendInTrust();
for (var t = e.getLocation(), i = this.nodeMainMj.convertToNodeSpaceAR(t), o = 1; o <= 14; o++) {
var n = this["nodeMainMj" + o];
if (Math.abs(n.x - i.x) < 44 && Math.abs(n.y - i.y) < 64 && n.active && n.canSelect) {
this.nodeSelectMj = n;
this.startNodePosition = cc.v2(n.x, n.y);
this.startPosition = i;
break;
}
}
};
t.prototype.onClickMove = function(e) {
var t = e.getLocation(), i = this.nodeMainMj.convertToNodeSpaceAR(t);
if (null != this.startPosition && this.nodeSelectMj) {
this.nodeSelectMj.x = this.startNodePosition.x + (i.x - this.startPosition.x);
this.nodeSelectMj.y = this.startNodePosition.y + (i.y - this.startPosition.y);
}
};
t.prototype.onClickEnd = function(e) {
var t = e.getLocation(), i = this.nodeMainMj.convertToNodeSpaceAR(t);
if (this.nodeSelectMj) if (i.y < 180) if (null != this.startPosition && Math.abs(i.x - this.startPosition.x) < 5 && Math.abs(i.y - this.startPosition.y) < 5 && !0 === this.canPutCard && 0 == this.is_listen) if (78 == this.startNodePosition.y) {
for (var o = 1; o <= 14; o++) this["nodeMainMj" + o].y = 78;
this.nodeSelectMj.y = 88;
this.nodeSelectMj.x = this.startNodePosition.x;
if (this.nodeMainTing.active && this.tingData) for (var n in this.tingData) if (n == this.nodeSelectMj.pid) {
this.showTingView(this.tingData[n]);
break;
}
} else {
this.canPutCard = !1;
n = this.nodeSelectMj.pid;
this.nodeSelectMj.x;
if (this.isTing) {
wNetWork.send("Msg_ERQS_Deal", {
do: 7,
pid: n
}, !0);
this.nodeMainTing.active = !1;
this.nodeMainAction.active = !1;
}
this.controll.sendMsgPutCard(n);
} else {
for (o = 1; o <= 14; o++) {
this["nodeMainMj" + o].y = 78;
this["nodeMainMj" + o].x = this.mjPositionData[o - 1].x;
}
this.nodeMainTing.active && this.tingData && this.showTingView([]);
this.nodeSelectMj = null;
} else if (!0 === this.canPutCard && 0 == this.is_listen) {
this.canPutCard = !1;
n = this.nodeSelectMj.pid;
this.nodeSelectMj.x;
this.nodeSelectMj.y;
if (this.isTing) {
wNetWork.send("Msg_ERQS_Deal", {
do: 7,
pid: n
}, !0);
this.nodeMainTing.active = !1;
this.nodeMainAction.active = !1;
}
this.controll.sendMsgPutCard(n);
} else if (!1 === this.canPutCard) {
for (o = 1; o <= 14; o++) {
this["nodeMainMj" + o].y = 78;
this["nodeMainMj" + o].x = this.mjPositionData[o - 1].x;
}
this.nodeMainTing.active && this.tingData && this.showTingView([]);
this.nodeSelectMj = null;
}
this.startPosition = null;
this.startNodePosition = null;
};
t.prototype.playMainChuPaiAni = function(e, t, i, o) {
var n = this;
this.nodeMainTing.active = !1;
this.nodeMainAction.active = !1;
var a = 14;
if (0 == o) if (null == this.nodeSelectMj) a = 14; else {
this.nodeSelectMj.active = !1;
a = parseInt(this.nodeSelectMj.name.substring(6));
this.nodeSelectMj = null;
}
this.nodeMainChupaiAni.stopAllActions();
this.nodeMainChupaiAni.x = t;
this.nodeMainChupaiAni.y = i;
this.nodeMainChupaiAni.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e);
this.nodeMainChupaiAni.active = !0;
var r = this["nodeMainChupai" + (this.mainChupaiData.length + 1)].x + this.nodeMainChupai.x, d = this["nodeMainChupai" + (this.mainChupaiData.length + 1)].y + this.nodeMainChupai.y;
this.nodeMainChupaiAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(.1, 1), cc.moveTo(.1, r, d)), cc.callFunc(function() {
n.skeletonOtherPaitisi.node.active = !1;
n.skeletonMainPaitisi.node.active = !0;
n.skeletonMainPaitisi.setAnimation(0, "animation", !0);
n.skeletonMainPaitisi.node.setPosition(cc.v2(n["nodeMainChupai" + (n.mainChupaiData.length + 1)].x, n["nodeMainChupai" + (n.mainChupaiData.length + 1)].y + 50));
var t = n.mainChupaiData;
t.push(e);
n.updateMainChupai(t);
for (var i = n.mainCardsData.cards[n.mainCardsData.cards.length - 1], o = 0; o < n.mainCardsData.cards.length; o++) if (e == n.mainCardsData.cards[o]) {
n.mainCardsData.cards.splice(o, 1);
break;
}
var r = n.mainCardsData.cards, d = n.mainCardsData.place;
if (14 != a) {
var c = 14 - 3 * d.length, s = [];
for (o = 0; o < c - 1; o++) o < r.length && s.push(r[o]);
s.sort(function(e, t) {
return e - t;
});
var h = [];
for (o = 0; o < s.length; o++) s[o] < 20 && h.push(s[o]);
for (o = 0; o < s.length; o++) s[o] > 50 && s[o] < 55 && h.push(s[o]);
for (o = 0; o < s.length; o++) s[o] > 40 && s[o] < 44 && h.push(s[o]);
for (o = 0; o < s.length; o++) s[o] > 60 && h.push(s[o]);
r = h;
var l = -1;
for (o = 0; o < r.length; o++) if (r[o] == i) {
l = o + 3 * d.length;
break;
}
var p = function(e) {
if (e < 3 * d.length) n["nodeMainMj" + (e + 1)].active = !1; else if (e < r.length + 3 * d.length) {
n["nodeMainMj" + (e + 1)].active = !0;
n["nodeMainMj" + (e + 1)].x = n.mjPositionData[e].x;
n["nodeMainMj" + (e + 1)].y = n.mjPositionData[e].y;
n["nodeMainMj" + (e + 1)].pid = r[e - 3 * d.length];
n["nodeMainMj" + (e + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = n.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + r[e - 3 * d.length]);
if (0 == n.is_listen) {
n["nodeMainMj" + (e + 1)].canSelect = !0;
n["nodeMainMj" + (e + 1)].getChildByName("sprite").color = cc.color(255, 255, 255);
n["nodeMainMj" + (e + 1)].getChildByName("spriteNum").color = cc.color(255, 255, 255);
} else {
n["nodeMainMj" + (e + 1)].canSelect = !1;
n["nodeMainMj" + (e + 1)].getChildByName("sprite").color = cc.color(150, 150, 150);
n["nodeMainMj" + (e + 1)].getChildByName("spriteNum").color = cc.color(150, 150, 150);
}
if (l == e) {
n["nodeMainMj" + (e + 1)].active = !1;
n.nodeMainMjAni.stopAllActions();
n.nodeMainMjAni.active = !0;
n.nodeMainMjAni.x = n.mjPositionData[13].x;
n.nodeMainMjAni.y = n.mjPositionData[13].y;
n.nodeMainMjAni.angle = 0;
n.nodeMainMjAni.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = n.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + r[e - 3 * d.length]);
n.nodeMainMjAni.runAction(cc.sequence(cc.spawn(cc.moveBy(.167, 0, 78), cc.rotateTo(.167, 20)), cc.moveBy(.1, n.mjPositionData[e].x - n.mjPositionData[13].x, 0), cc.spawn(cc.moveBy(.167, 0, -78), cc.rotateTo(.167, 0)), cc.callFunc(function() {
n["nodeMainMj" + (e + 1)].active = !0;
n.nodeMainMjAni.active = !1;
})));
}
} else n["nodeMainMj" + (e + 1)].active = !1;
};
for (o = 0; o < 14; o++) p(o);
} else n.updateMainMj(r, d);
n.nodeMainChupaiAni.active = !1;
})));
cc.log(this.mainCardsData.cards);
var c = this.sound["" + e];
wAudioMgr.playSound("sound/man/" + c, "ERQS");
};
t.prototype.playOtherChupaiAni = function(e) {
var t = this;
this.putpid = e;
this.updateOtherMj(this.otherCardsData.cardscount - 1, this.otherCardsData.place);
this.nodeOtherChupaiAni.stopAllActions();
this.nodeOtherChupaiAni.x = -365;
this.nodeOtherChupaiAni.y = 0;
this.nodeOtherChupaiAni.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e);
this.nodeOtherChupaiAni.active = !0;
var i = this["nodeOtherChupai" + (this.otherChupaiData.length + 1)].x + this.nodeOtherChupai.x, o = this["nodeOtherChupai" + (this.otherChupaiData.length + 1)].y + this.nodeOtherChupai.y;
this.nodeOtherChupaiAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(.2, 1), cc.moveTo(.2, i, o)), cc.callFunc(function() {
var i = t.otherChupaiData;
i.push(e);
t.updateOtherChupai(i);
t.nodeOtherChupaiAni.active = !1;
t.skeletonMainPaitisi.node.active = !1;
t.skeletonOtherPaitisi.node.active = !0;
t.skeletonOtherPaitisi.setAnimation(0, "animation", !0);
t.skeletonOtherPaitisi.node.setPosition(cc.v2(t["nodeOtherChupai" + t.otherChupaiData.length].x, t["nodeOtherChupai" + t.otherChupaiData.length].y + 50));
})));
var n = this.sound["" + e];
wAudioMgr.playSound("sound/man/" + n, "ERQS");
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
var i = 0;
switch (t) {
case "guo":
i = -99;
wNetWork.send("Msg_ERQS_Deal", {
do: i
}, !0);
this.nodeMainAction.active = !1;
this.controll.sendInTrust();
this.canPutCard = !0;
break;

case "chi":
i = 6;
this.showChiView();
this.nodeMainAction.active = !1;
this.controll.sendInTrust();
break;

case "peng":
i = 5;
wNetWork.send("Msg_ERQS_Deal", {
do: i,
pid: this.waitpengcard
}, !0);
this.nodeMainAction.active = !1;
this.controll.sendInTrust();
break;

case "gang":
i = 3;
wNetWork.send("Msg_ERQS_Deal", {
do: i,
pid: this.waitgangcard
}, !0);
this.nodeMainAction.active = !1;
this.controll.sendInTrust();
this.isTing = !1;
break;

case "ting":
if (null != this.tingData) {
this.isTing = !0;
var o = 0;
for (var n in this.tingData) o += 1;
if (o > 0) {
this.nodeMainAction.active = !1;
this.showTingView([]);
for (var a = 0; a < 14; a++) if (this["nodeMainMj" + (a + 1)].active) {
var r = !1;
for (var n in this.tingData) if (n == this["nodeMainMj" + (a + 1)].pid) {
r = !0;
break;
}
if (r) {
this["nodeMainMj" + (a + 1)].canSelect = !0;
this["nodeMainMj" + (a + 1)].getChildByName("sprite").color = cc.color(255, 255, 255);
this["nodeMainMj" + (a + 1)].getChildByName("spriteNum").color = cc.color(255, 255, 255);
} else {
this["nodeMainMj" + (a + 1)].canSelect = !1;
this["nodeMainMj" + (a + 1)].getChildByName("sprite").color = cc.color(150, 150, 150);
this["nodeMainMj" + (a + 1)].getChildByName("spriteNum").color = cc.color(150, 150, 150);
}
this["nodeMainMj" + (a + 1)].y = 78;
}
}
this.controll.sendInTrust();
}
break;

case "hu":
i = 2;
this.controll.sendInTrust();
wNetWork.send("Msg_ERQS_Deal", {
do: i,
pid: this.waithucard
}, !0);
this.nodeMainAction.active = !1;
break;

case "tingcancel":
this.isTing = !1;
this.nodeMainTing.active = !1;
for (a = 0; a < 14; a++) {
if (this["nodeMainMj" + (a + 1)].active) {
this["nodeMainMj" + (a + 1)].canSelect = !0;
this["nodeMainMj" + (a + 1)].getChildByName("sprite").color = cc.color(255, 255, 255);
this["nodeMainMj" + (a + 1)].getChildByName("spriteNum").color = cc.color(255, 255, 255);
}
this["nodeMainMj" + (a + 1)].y = 78;
}
this.nodeMainAction.active = !0;
this.controll.sendInTrust();
this.canPutCard = !0;
break;

case "chiguo":
this.nodeMainChi.active = !1;
this.nodeMainAction.active = !0;
this.controll.sendInTrust();
break;

case "chi1":
i = 6;
wNetWork.send("Msg_ERQS_Deal", {
do: i,
pid: this.chicard[0]
}, !0);
this.nodeMainChi.active = !1;
this.controll.sendInTrust();
break;

case "chi2":
i = 6;
wNetWork.send("Msg_ERQS_Deal", {
do: i,
pid: this.chicard[1]
}, !0);
this.nodeMainChi.active = !1;
this.controll.sendInTrust();
break;

case "chi3":
i = 6;
wNetWork.send("Msg_ERQS_Deal", {
do: i,
pid: this.chicard[2]
}, !0);
this.nodeMainChi.active = !1;
this.controll.sendInTrust();
break;

case "chiback":
this.nodeMainChi.active = !1;
this.nodeMainAction.active = !0;
this.controll.sendInTrust();
break;

case "chat":
break;

case "menu":
this.btnMenu.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrameMenuSelect;
this.btnMenuClose.node.active = !0;
this.nodeMenuMask.active = !0;
this.spriteMenuBg.node.stopAllActions();
this.spriteMenuBg.node.opacity = 100;
this.spriteMenuBg.node.y = 620;
this.spriteMenuBg.node.runAction(cc.sequence(cc.spawn(cc.moveTo(.1, 0, 0), cc.fadeTo(.1, 255)), cc.moveTo(.067, 0, -40), cc.moveTo(.067, 0, 0)));
break;

case "menuclose":
this.hideMenuNode();
break;

case "menuchange":
this.hideMenuNode();
if (0 != this.controll.state) {
wUIManager.showTips("游戏正在进行中！", wUIManager.TIPS_OK);
return;
}
wGEvent.emit("local_Event", "changeTable");
break;

case "menubank":
this.hideMenuNode();
if (1 == wGameData.roomLevel) {
wUIManager.showTips("体验场不能打开银行", wUIManager.TIPS_OK);
return;
}
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
break;

case "menurule":
this.hideMenuNode();
wViewMgr.openPage({
path: "prefab/Rule",
bundle: "ERQS"
});
break;

case "menuchat":
this.hideMenuNode();
break;

case "menusetting":
this.hideMenuNode();
wViewMgr.openPage({
path: "prefab/Set",
bundle: wGameData.getGameName()
});
break;

case "menuback":
this.hideMenuNode();
this.controll.m_quitGame();
break;

case "start":
wAudioMgr.playCloseSound();
wNetWork.send("Msg_ERQS_Ready", {
ready: !0
});
break;

case "intrust":
this.controll.sendInTrust(0);
this.intrustNode.active = !1;
}
};
t.prototype.hideMenuNode = function() {
var e = this;
this.btnMenu.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrameMenuNormal;
this.btnMenuClose.node.active = !1;
this.spriteMenuBg.node.stopAllActions();
this.spriteMenuBg.node.opacity = 255;
this.spriteMenuBg.node.y = 0;
this.spriteMenuBg.node.runAction(cc.sequence(cc.spawn(cc.moveTo(.1, 0, 40), cc.fadeTo(.1, 0)), cc.callFunc(function() {
e.nodeMenuMask.active = !1;
})));
};
t.prototype.random = function(e, t) {
return Math.floor(Math.random() * (t - e)) + e;
};
t.prototype.showDiceAni = function(e) {
var t = this;
this.lastMjNum = 72;
this.labelMjNum.node.parent.active = !0;
this.labelMjNum.string = "72";
this.controll.state = 2;
this.nodeDice.active = !0;
for (var i = this.random(1, 7), o = this.random(1, 7), n = [], r = 0; r < 31; r++) n[r] = r < 9 ? this.spriteAtlasDice.getSpriteFrame("star_anim_" + i + "_00" + (r + 1)) : this.spriteAtlasDice.getSpriteFrame("star_anim_" + o + "_0" + (r + 1));
var d = this.nodeDice1.getComponent(a.default);
d.updateSpriteFrames(n);
d.playOnce(function() {
t.playFaCardAni(e);
t.nodeDice.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
t.nodeDice.active = !1;
})));
});
var c = [];
for (r = 0; r < 31; r++) c[r] = r < 9 ? this.spriteAtlasDice.getSpriteFrame("star_anim_" + i + "_00" + (r + 1)) : this.spriteAtlasDice.getSpriteFrame("star_anim_" + i + "_0" + (r + 1));
var s = this.nodeDice2.getComponent(a.default);
s.updateSpriteFrames(c);
s.playOnce();
};
t.prototype.playFaCardAni = function(e) {
var t = this;
this.nodeCardAni.active = !0;
this.nodeMainMj.active = !1;
this.nodeMainBuhua.active = !1;
this.nodeMainChupai.active = !1;
cc.winSize.width < 1334 ? this.nodeCardAni.scale = 1334 / cc.winSize.width : this.nodeCardAni.scale = 1;
this.nodeCardAniReal.destroyAllChildren();
for (var i = function(e) {
var i = cc.instantiate(o.spriteCardAni.node);
i.active = !0;
i.scale = .3;
i.opacity = 1;
i.x = 3 * e - 33;
i.y = 335;
o.nodeCardAniReal.addChild(i);
i.runAction(cc.sequence(cc.delayTime(.25 * Math.floor(e / 4)), cc.callFunc(function() {
i.opacity = 255;
t.lastMjNum -= 2;
t.labelMjNum.string = t.lastMjNum.toString();
e % 4 == 1 && wAudioMgr.playSound("sound/kuo", "ERQS");
}), cc.spawn(cc.scaleTo(.25, 1), cc.moveTo(.25, 77.3 * (e - 1) - 468, 80))));
i.runAction(cc.sequence(cc.delayTime(1 + .033 * e), cc.callFunc(function() {
e % 4 == 1 && wAudioMgr.playSound("sound/fapai3", "ERQS");
}), cc.scaleTo(.033, 1.1), cc.scaleTo(.033, 1)));
}, o = this, n = 1; n <= 13; n++) i(n);
this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function() {
e && e();
})));
};
t.prototype.showFaCardReal = function(e, t) {
this.updateMainMj(e, t);
this.updateMainChupai([]);
this.updateMainBuhua([]);
for (var i in e.uids) {
var o = e.uids[i];
1 == this.controll.getSeat(i) && this.updateOtherMj(o, []);
}
};
t.prototype.setFaCard = function(e) {
this.mainCardsData.cards = e.cards;
this.mainCardsData.place = [];
};
t.prototype.initNode = function() {
this.mjPositionData = [ cc.v2(-568, 78), cc.v2(-480, 78), cc.v2(-392, 78), cc.v2(-304, 78), cc.v2(-216, 78), cc.v2(-128, 78), cc.v2(-40, 78), cc.v2(48, 78), cc.v2(136, 78), cc.v2(224, 78), cc.v2(312, 78), cc.v2(400, 78), cc.v2(488, 78), cc.v2(598, 78) ];
this.spriteDirctionTopBg.node.active = !1;
this.spriteDirctionTop.node.active = !1;
this.spriteDirctionBottomBg.node.active = !1;
this.spriteDirctionBottom.node.active = !1;
this.labelMjNum.node.parent.active = !1;
this.nodeMainPlayer.active = !0;
this.spriteMainTingpai.node.active = !1;
this.spriteMainZhuan.node.active = !1;
this.nodeOtherPlayer.active = !1;
this.nodeMain.active = !0;
this.nodeMainChupai.active = !0;
this.nodeMainHuCard.active = !1;
this.nodeOtherHuCard.active = !1;
this.btnStart.active = !1;
for (var e = 1; e <= 26; e++) this["nodeMainChupai" + e].active = !1;
this.skeletonMainPaitisi.node.active = !1;
this.nodeMainBuhua.active = !0;
for (e = 1; e <= 8; e++) this["nodeMainBuhua" + e].active = !1;
this.nodeMainBuhuaAni.active = !1;
this.nodeMainMj.active = !0;
for (e = 1; e <= 4; e++) this["nodeMainMjGang" + e].active = !1;
for (e = 1; e <= 14; e++) {
this["nodeMainMj" + e].active = !1;
this["nodeMainMj" + e].canSelect = !0;
}
this.nodeMainMjAni.active = !1;
this.nodeMainAction.active = !1;
this.nodeMainTing.active = !1;
this.nodeMainChi.active = !1;
this.nodeOther.active = !0;
this.nodeOtherChupai.active = !0;
for (e = 1; e <= 26; e++) this["nodeOtherChupai" + e].active = !1;
this.skeletonOtherPaitisi.node.active = !1;
this.nodeOtherBuhua.active = !0;
for (e = 1; e <= 8; e++) this["nodeOtherBuhua" + e].active = !1;
this.nodeOtherBuhuaAni.active = !1;
this.nodeOtherMj.active = !0;
for (e = 1; e <= 4; e++) this["nodeOtherMjGang" + e].active = !1;
for (e = 1; e <= 14; e++) this["nodeOtherMj" + e].active = !1;
for (e = 1; e <= 14; e++) this["nodeOtherShowCard" + e].active = !1;
this.nodeOtherChupaiAni.active = !1;
this.btnMenu.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrameMenuNormal;
this.btnMenuClose.node.active = !1;
this.nodeMenuMask.active = !1;
this.tingData = null;
this.mainCardsData.cards = [];
this.mainCardsData.place = [];
this.is_listen = 0;
this.mainChupaiData = [];
this.mainBuhuaData = [];
this.otherCardsData.cardscount = 0;
this.otherCardsData.place = [];
this.otherChupaiData = [];
this.otherBuhuaData = [];
this.lastMjNum = 0;
this.cardid = 0;
this.chicard = [];
this.waitgangcard = 0;
this.waitpengcard = 0;
this.waithucard = 0;
this.canPutCard = !1;
this.isTing = !1;
this.mainWaitBuhuaData = [];
this.otherWaitBuhuaData = [];
this.intrustNode.active = !1;
this.putpid = 0;
for (e = 0; e < 2; e++) this.controll.playerView[e].updateZhuanView(!1);
};
t.prototype.setRoomInfo = function(e) {
this.labelMjNum.string = e.cards_last;
this.lastMjNum = e.cards_last;
if (e.game_status > 1) {
this.labelCountDown.string = e.time;
this.setCountDown(e.time);
} else this.labelCountDown.string = "0";
if (0 == e.seat) {
this.mainDirectionSpirte = [ this.spriteFrameEastNormal, this.spriteFrameEastSelect ];
this.otherDirectionSpirte = [ this.spriteFrameWestNormal, this.spriteFrameWestSelect ];
}
this.mainDirectionSpirte = [ this.spriteFrameWestNormal, this.spriteFrameWestSelect ];
this.otherDirectionSpirte = [ this.spriteFrameEastNormal, this.spriteFrameEastSelect ];
this.labelDifen.string = "-底分" + e.rule.doublescore + "-";
};
t.prototype.setDirction = function(e, t) {
void 0 === t && (t = 0);
this.spriteDirctionTopBg.node.active = 1 == e;
this.spriteDirctionTop.node.active = !0;
this.spriteDirctionBottomBg.node.active = 0 == e;
this.spriteDirctionBottom.node.active = !0;
if (0 == e) {
this.spriteDirctionTop.spriteFrame = this.otherDirectionSpirte[0];
this.spriteDirctionBottom.spriteFrame = this.mainDirectionSpirte[1];
} else {
this.spriteDirctionTop.spriteFrame = this.otherDirectionSpirte[1];
this.spriteDirctionBottom.spriteFrame = this.mainDirectionSpirte[0];
}
this.labelCountDown.string = t > 0 ? t.toString() : "0";
this.setCountDown(t);
};
t.prototype.updateMainMj = function(e, t) {
this.nodeCardAni.active = !1;
this.nodeMainMj.active = !0;
for (var i = 14 - 3 * t.length, o = [], n = 0; n < i - 1; n++) n < e.length && o.push(e[n]);
o.sort(function(e, t) {
return e - t;
});
var a = [];
for (n = 0; n < o.length; n++) o[n] < 20 && a.push(o[n]);
for (n = 0; n < o.length; n++) o[n] > 50 && o[n] < 55 && a.push(o[n]);
for (n = 0; n < o.length; n++) o[n] > 40 && o[n] < 44 && a.push(o[n]);
for (n = 0; n < o.length; n++) o[n] > 60 && a.push(o[n]);
e.length >= i && (a[i - 1] = e[i - 1]);
e = a;
cc.log(t);
for (n = 0; n < 14; n++) if (n < 3 * t.length) this["nodeMainMj" + (n + 1)].active = !1; else if (n < e.length + 3 * t.length) {
this["nodeMainMj" + (n + 1)].active = !0;
this["nodeMainMj" + (n + 1)].x = this.mjPositionData[n].x;
this["nodeMainMj" + (n + 1)].y = this.mjPositionData[n].y;
this["nodeMainMj" + (n + 1)].angle = 0;
this["nodeMainMj" + (n + 1)].pid = e[n - 3 * t.length];
this["nodeMainMj" + (n + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + e[n - 3 * t.length]);
if (0 == this.is_listen) {
this["nodeMainMj" + (n + 1)].canSelect = !0;
this["nodeMainMj" + (n + 1)].getChildByName("sprite").color = cc.color(255, 255, 255);
this["nodeMainMj" + (n + 1)].getChildByName("spriteNum").color = cc.color(255, 255, 255);
} else if (13 == n) {
this["nodeMainMj" + (n + 1)].canSelect = !0;
this["nodeMainMj" + (n + 1)].getChildByName("sprite").color = cc.color(255, 255, 255);
this["nodeMainMj" + (n + 1)].getChildByName("spriteNum").color = cc.color(255, 255, 255);
} else {
this["nodeMainMj" + (n + 1)].canSelect = !1;
this["nodeMainMj" + (n + 1)].getChildByName("sprite").color = cc.color(150, 150, 150);
this["nodeMainMj" + (n + 1)].getChildByName("spriteNum").color = cc.color(150, 150, 150);
}
} else this["nodeMainMj" + (n + 1)].active = !1;
for (n = 0; n < 4; n++) if (n < t.length) {
this["nodeMainMjGang" + (n + 1)].active = !0;
for (var r = 0; r < 4; r++) if (r < t[n].arr.length) {
this["nodeMainMjGang" + (n + 1) + "_" + (r + 1)].active = !0;
this["nodeMainMjGang" + (n + 1) + "_" + (r + 1)].getChildByName("spriteNum").active = !0;
if (4 == t[n].type || 5 == t[n].type || 6 == t[n].type) {
this["nodeMainMjGang" + (n + 1) + "_" + (r + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_layFg");
this["nodeMainMjGang" + (n + 1) + "_" + (r + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + t[n].arr[r]);
} else if (3 == t[n].type) if (t[n].uid == wGameData.getKey("uid")) if (r < 3) {
this["nodeMainMjGang" + (n + 1) + "_" + (r + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_layBg");
this["nodeMainMjGang" + (n + 1) + "_" + (r + 1)].getChildByName("spriteNum").active = !1;
} else {
this["nodeMainMjGang" + (n + 1) + "_" + (r + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_layFg");
this["nodeMainMjGang" + (n + 1) + "_" + (r + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + t[n].arr[r]);
this["nodeMainMjGang" + (n + 1) + "_" + (r + 1)].getChildByName("spriteNum").active = !0;
} else {
this["nodeMainMjGang" + (n + 1) + "_" + (r + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_layFg");
this["nodeMainMjGang" + (n + 1) + "_" + (r + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + t[n].arr[r]);
}
} else this["nodeMainMjGang" + (n + 1) + "_" + (r + 1)].active = !1;
} else this["nodeMainMjGang" + (n + 1)].active = !1;
this.mainCardsData = {
cards: e,
place: t
};
};
t.prototype.showDeal = function(e) {
for (var t in e.uids) {
var i = this.controll.getSeat(t), o = e.uids[t].doFinish;
this.setDirction(i, 8);
for (var n in o) switch (n) {
case "2":
var a = o[n], r = void 0;
for (var d in a) r = d;
this.doHu(i, e, r);
0 == i && (this.nodeMainAction.active = !1);
this.canPutCard = !1;
wAudioMgr.playSound("sound/man/yibuxiaoxinjiuhule", "ERQS");
break;

case "3":
this.doGang(i, o[n]);
this.showGangAni(0 == i);
break;

case "4":
this.doBuGang(i, o[n]);
this.showGangAni(0 == i);
break;

case "5":
this.doPeng(i, o[n]);
this.showPengAni(0 == i);
break;

case "6":
this.doChi(i, o[n]);
this.showChiAni(0 == i);
break;

case "7":
this.controll.playerView[i].updateTingPaiView(!0);
this.showTingAni(0 == i);
0 == i && this.setTingState();
}
}
};
t.prototype.doHu = function(e, t, i) {
this.setHuCard(e, i, t.is_pao);
if (t.is_pao) if (0 == e) {
this.otherChupaiData.pop();
this.updateMainChupai(this.otherChupaiData);
this.skeletonOtherPaitisi.node.active = !1;
} else {
this.mainChupaiData.pop();
this.updateOtherChupai(this.mainChupaiData);
this.skeletonMainPaitisi.node.active = !1;
}
};
t.prototype.doGang = function(e, t) {
var i = {
arr: t.arr,
pid: t.pid,
bu: t.order,
type: t.type,
uid: t.uid
}, o = this.controll.getSeat(t.uid);
if (0 == e) {
this.canPutCard = !0;
this.mainCardsData.place.push(i);
if (0 == o) {
for (var n = 0; n < 4; n++) for (var a = 0; a < this.mainCardsData.cards.length; a++) if (i.arr[n] == this.mainCardsData.cards[a]) {
this.mainCardsData.cards.splice(a, 1);
break;
}
} else {
this.otherChupaiData.pop();
for (n = 0; n < 3; n++) for (a = 0; a < this.mainCardsData.cards.length; a++) if (i.arr[n] == this.mainCardsData.cards[a]) {
this.mainCardsData.cards.splice(a, 1);
break;
}
this.updateOtherChupai(this.otherChupaiData);
this.skeletonOtherPaitisi.node.active = !1;
}
this.mainCardsData.cards.sort();
this.updateMainMj(this.mainCardsData.cards, this.mainCardsData.place);
} else {
var r = 0;
if (1 == o) r = 4; else {
this.mainChupaiData.pop();
r = 3;
this.updateMainChupai(this.mainChupaiData);
this.skeletonMainPaitisi.node.active = !1;
}
this.otherCardsData.cardscount -= r;
this.otherCardsData.place.push(i);
this.updateOtherMj(this.otherCardsData.cardscount, this.otherCardsData.place);
}
};
t.prototype.doBuGang = function(e, t) {
var i = {
arr: t.arr,
pid: t.pid,
bu: t.order,
type: t.type,
uid: t.uid
};
if (0 == e) {
this.canPutCard = !0;
for (var o = 0; o < this.mainCardsData.place.length; o++) this.mainCardsData.place[o].pid == t.pid && this.mainCardsData.place.splice(o, 1);
this.mainCardsData.place.push(i);
for (o = 0; o < 1; o++) for (var n = 0; n < this.mainCardsData.cards.length; n++) if (i.arr[o] == this.mainCardsData.cards[n]) {
this.mainCardsData.cards.splice(n, 1);
break;
}
this.mainCardsData.cards.sort();
this.updateMainMj(this.mainCardsData.cards, this.mainCardsData.place);
} else {
this.otherCardsData.cardscount -= 1;
for (o = 0; o < this.otherCardsData.place.length; o++) this.otherCardsData.place[o].pid == t.pid && this.otherCardsData.place.splice(o, 1);
this.otherCardsData.place.push(i);
this.updateOtherMj(this.otherCardsData.cardscount, this.otherCardsData.place);
}
};
t.prototype.doPeng = function(e, t) {
var i = {
arr: t.arr,
pid: t.pid,
bu: t.order,
type: t.type,
uid: t.uid
};
if (0 == e) {
this.canPutCard = !0;
this.mainCardsData.place.push(i);
this.otherChupaiData.pop();
for (var o = 0; o < 2; o++) for (var n = 0; n < this.mainCardsData.cards.length; n++) if (i.arr[o] == this.mainCardsData.cards[n]) {
this.mainCardsData.cards.splice(n, 1);
break;
}
this.skeletonOtherPaitisi.node.active = !1;
this.mainCardsData.cards.sort();
this.updateMainMj(this.mainCardsData.cards, this.mainCardsData.place);
this.updateOtherChupai(this.otherChupaiData);
} else {
this.mainChupaiData.pop();
this.otherCardsData.cardscount -= 2;
this.otherCardsData.place.push(i);
this.updateOtherMj(this.otherCardsData.cardscount, this.otherCardsData.place);
this.updateMainChupai(this.mainChupaiData);
this.skeletonMainPaitisi.node.active = !1;
}
};
t.prototype.doChi = function(e, t) {
var i = {
arr: t.arr,
pid: t.pid,
bu: t.order,
type: t.type,
uid: t.uid
};
if (0 == e) {
this.canPutCard = !0;
this.mainCardsData.place.push(i);
this.otherChupaiData.pop();
for (var o = 0; o < 3; o++) for (var n = 0; n < this.mainCardsData.cards.length; n++) if (i.arr[o] == this.mainCardsData.cards[n] && i.arr[o] != i.pid) {
this.mainCardsData.cards.splice(n, 1);
break;
}
this.mainCardsData.cards.sort();
this.skeletonOtherPaitisi.node.active = !1;
this.updateMainMj(this.mainCardsData.cards, this.mainCardsData.place);
this.updateOtherChupai(this.otherChupaiData);
} else {
this.mainChupaiData.pop();
this.otherCardsData.cardscount -= 2;
this.otherCardsData.place.push(i);
this.updateOtherMj(this.otherCardsData.cardscount, this.otherCardsData.place);
this.updateMainChupai(this.mainChupaiData);
this.skeletonMainPaitisi.node.active = !1;
}
};
t.prototype.setTingState = function() {
this.isTing = !1;
this.is_listen = 2;
for (var e = 0; e < 14; e++) if (this["nodeMainMj" + (e + 1)].active) {
this["nodeMainMj" + (e + 1)].canSelect = !1;
this["nodeMainMj" + (e + 1)].getChildByName("sprite").color = cc.color(150, 150, 150);
this["nodeMainMj" + (e + 1)].getChildByName("spriteNum").color = cc.color(150, 150, 150);
this["nodeMainMj" + (e + 1)].y = 78;
}
};
t.prototype.addCard = function(e) {
this.nodeMainAction.active = !1;
var t = this.controll.getSeat(e.uid);
0 == Array.isArray(e.ready_do) && 0 == t ? this.showAction(e.ready_do) : 0 == t ? this.canPutCard = !0 : this.nodeMainAction.active = !1;
this.setDirction(t, e.time);
this.lastMjNum--;
this.labelMjNum.string = this.lastMjNum.toString();
if (!(0 == e.pid || e.pid >= 60)) if (0 == t) {
this.mainCardsData.cards.push(e.pid);
this.nodeMainMj14.active = !0;
this.nodeMainMj14.x = this.mjPositionData[13].x;
this.nodeMainMj14.y = this.mjPositionData[13].y;
this.nodeMainMj14.angle = 0;
this.nodeMainMj14.pid = e.pid;
this.nodeMainMj14.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + e.pid);
this.nodeMainMj14.canSelect = !0;
this.nodeMainMj14.getChildByName("sprite").color = cc.color(255, 255, 255);
this.nodeMainMj14.getChildByName("spriteNum").color = cc.color(255, 255, 255);
e.pid >= 60 && (this.nodeMainMj14.canSelect = !1);
} else {
this.otherCardsData.cardscount += 1;
this.otherCardsData.cardscount >= 14 && (this.otherCardsData.cardscount = 14);
this.updateOtherMj(this.otherCardsData.cardscount, this.otherCardsData.place);
}
};
t.prototype.updateMainChupai = function(e) {
this.nodeCardAni.active = !1;
this.nodeMainChupai.active = !0;
for (var t = 0; t < 26; t++) if (t < e.length) {
this["nodeMainChupai" + (t + 1)].active = !0;
this["nodeMainChupai" + (t + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e[t]);
} else this["nodeMainChupai" + (t + 1)].active = !1;
this.mainChupaiData = e;
};
t.prototype.updateMainBuhua = function(e) {
this.nodeCardAni.active = !1;
this.nodeMainBuhua.active = !0;
for (var t = 0; t < 8; t++) if (t < e.length) {
this["nodeMainBuhua" + (t + 1)].active = !0;
this["nodeMainBuhua" + (t + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e[t]);
} else this["nodeMainBuhua" + (t + 1)].active = !1;
this.mainBuhuaData = e;
};
t.prototype.updateOtherMj = function(e, t) {
this.nodeCardAni.active = !1;
this.nodeOtherMj.active = !0;
for (var i = 0; i < 14; i++) for (var o = 0; o < 14; o++) if (o < 3 * t.length) this["nodeOtherMj" + (o + 1)].active = !1; else if (o < e + 3 * t.length) {
this["nodeOtherMj" + (o + 1)].active = !0;
this["nodeOtherMj" + (o + 1)].y = 0;
} else this["nodeOtherMj" + (o + 1)].active = !1;
for (i = 0; i < 4; i++) if (i < t.length) {
this["nodeOtherMjGang" + (i + 1)].active = !0;
for (var n = 0; n < 4; n++) if (n < t[i].arr.length) {
this["nodeOtherMjGang" + (i + 1) + "_" + (n + 1)].active = !0;
this["nodeOtherMjGang" + (i + 1) + "_" + (n + 1)].getChildByName("spriteNum").active = !0;
if (4 == t[i].type || 5 == t[i].type || 6 == t[i].type) {
this["nodeOtherMjGang" + (i + 1) + "_" + (n + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_layFg");
this["nodeOtherMjGang" + (i + 1) + "_" + (n + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + t[i].arr[n]);
} else if (3 == t[i].type) if (t[i].uid != wGameData.getKey("uid")) {
this["nodeOtherMjGang" + (i + 1) + "_" + (n + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_layBg");
this["nodeOtherMjGang" + (i + 1) + "_" + (n + 1)].getChildByName("spriteNum").active = !1;
} else {
this["nodeOtherMjGang" + (i + 1) + "_" + (n + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_layFg");
this["nodeOtherMjGang" + (i + 1) + "_" + (n + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + t[i].arr[n]);
this["nodeOtherMjGang" + (i + 1) + "_" + (n + 1)].getChildByName("spriteNum").active = !0;
}
} else this["nodeOtherMjGang" + (i + 1) + "_" + (n + 1)].active = !1;
} else this["nodeOtherMjGang" + (i + 1)].active = !1;
this.otherCardsData = {
cardscount: e,
place: t
};
};
t.prototype.showOtherCard = function(e, t) {
var i = this;
this.nodeCardAni.active = !1;
this.nodeOtherShowCard.active = !0;
for (var o = [ 310, 259, 208, 157, 106, 55, 4, -47, -98, -149, -200, -251, -302 ], n = function(e) {
a["nodeOtherShowCard" + (e + 1)].active = !1;
a["nodeOtherMj" + (e + 1)].runAction(cc.sequence(cc.moveTo(.2, a["nodeOtherMj" + (e + 1)].x, -25), cc.callFunc(function() {
i["nodeOtherMj" + (e + 1)].active = !1;
})));
}, a = this, r = 0; r < 14; r++) n(r);
var d = 14 - 3 * t.length, c = [];
for (r = 0; r < d - 1; r++) r < e.length && c.push(e[r]);
c.sort(function(e, t) {
return e - t;
});
var s = [];
for (r = 0; r < c.length; r++) c[r] < 20 && s.push(c[r]);
for (r = 0; r < c.length; r++) c[r] > 50 && c[r] < 55 && s.push(c[r]);
for (r = 0; r < c.length; r++) c[r] > 40 && c[r] < 44 && s.push(c[r]);
for (r = 0; r < c.length; r++) c[r] > 60 && s.push(c[r]);
e.length >= d && (s[d - 1] = e[d - 1]);
e = s;
var h = function(n) {
if (n < 3 * t.length) l["nodeOtherShowCard" + (n + 1)].active = !1; else if (n < e.length + 3 * t.length) {
l["nodeOtherShowCard" + (n + 1)].active = !0;
l["nodeOtherShowCard" + (n + 1)].x = o[n];
l["nodeOtherShowCard" + (n + 1)].y = -30;
l["nodeOtherShowCard" + (n + 1)].pid = e[n - 3 * t.length];
l["nodeOtherShowCard" + (n + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = l.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e[n - 3 * t.length]);
l["nodeOtherShowCard" + (n + 1)].children[0].active = !1;
l["nodeOtherShowCard" + (n + 1)].children[1].active = !1;
l["nodeOtherShowCard" + (n + 1)].runAction(cc.sequence(cc.delayTime(.2), cc.callFunc(function() {
i["nodeOtherShowCard" + (n + 1)].children[0].active = !0;
i["nodeOtherShowCard" + (n + 1)].children[1].active = !0;
}), cc.delayTime(.5), cc.moveTo(.2, o[n], -12)));
} else l["nodeOtherShowCard" + (n + 1)].active = !1;
}, l = this;
for (r = 0; r < 14; r++) h(r);
};
t.prototype.updateOtherChupai = function(e) {
this.nodeCardAni.active = !1;
this.nodeOtherChupai.active = !0;
for (var t = 0; t < 26; t++) if (t < e.length) {
this["nodeOtherChupai" + (t + 1)].active = !0;
this["nodeOtherChupai" + (t + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e[t]);
} else this["nodeOtherChupai" + (t + 1)].active = !1;
this.otherChupaiData = e;
};
t.prototype.updateOtherBuhua = function(e) {
this.nodeCardAni.active = !1;
this.nodeOtherBuhua.active = !0;
for (var t = 0; t < 8; t++) if (t < e.length) {
this["nodeOtherBuhua" + (t + 1)].active = !0;
this["nodeOtherBuhua" + (t + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e[t]);
} else this["nodeOtherBuhua" + (t + 1)].active = !1;
this.otherBuhuaData = e;
};
t.prototype.showAction = function(e) {
if (0 != e.length) {
this.canPutCard = !1;
this.nodeMainAction.active = !0;
this.btnMainGuo.node.active = !0;
this.btnMainChi.node.active = !1;
this.btnMainPeng.node.active = !1;
this.btnMainGang.node.active = !1;
this.btnMainHu.node.active = !1;
this.btnMainTing.node.active = !1;
var t = 0;
for (var i in e) {
var o = e[i];
if (-99 == Number(i)) ; else if (1 == Number(i)) ; else if (2 == Number(i)) {
this.waithucard = o[0];
this.btnMainHu.node.active = !0;
this.btnMainHu.node.x = -185 * t - 185;
t++;
} else if (3 == Number(i) || 4 == Number(i)) {
this.waitgangcard = o[0];
this.btnMainGang.node.active = !0;
this.btnMainGang.node.x = -185 * t - 185;
t++;
} else if (5 == Number(i)) {
this.waitpengcard = o[0];
this.btnMainPeng.node.active = !0;
this.btnMainPeng.node.x = -185 * t - 185;
t++;
} else if (6 == Number(i)) {
this.chicard = o;
this.btnMainChi.node.active = !0;
this.btnMainChi.node.x = -185 * t - 185;
t++;
} else if (7 == Number(i)) {
this.btnMainTing.node.active = !0;
this.btnMainTing.node.x = -185 * t - 185;
t++;
this.canPutCard = !0;
} else this.canPutCard = !0;
}
0 == t && (this.nodeMainAction.active = !1);
}
};
t.prototype.setTing = function(e) {
this.tingData = e;
};
t.prototype.setBuHua = function(e) {
0 == this.controll.getSeat(e.uid) ? this.showBuhuaMain(e) : this.showBuhuaOther(e);
this.lastMjNum--;
this.labelMjNum.string = this.lastMjNum.toString();
};
t.prototype.showBuHua = function() {
if (!(this.controll.state < 3)) {
this.mainWaitBuhuaData.length > 0 && this.showMainBuhua();
this.otherWaitBuhuaData.length > 0 && this.showOtherBuhua();
}
};
t.prototype.showBuhuaMain = function(e) {
var t = this, i = !1;
if (0 == i) {
i = !0;
for (var o = this.mainCardsData.cards, n = !1, a = -1, r = !1, d = 0; d < o.length; d++) o[d] == e.hua_pid && (r = !0);
if (!r) {
o.push(e.hua_pid);
this.updateMainMj(o, this.mainCardsData.place);
}
for (d = 0; d < o.length; d++) if (o[d] == e.hua_pid && !n) {
n = !0;
a = d;
break;
}
if (a < 0) return;
var c = [];
for (d = 0; d < o.length; d++) o[d] != e.hua_pid && c.push(o[d]);
r && c.push(e.pid);
this.updateMainMj(c, this.mainCardsData.place);
if (a >= 0) {
this.nodeMainBuhuaAni.stopAllActions();
var s = this["nodeMainMj" + (a + 1)].x - this.nodeMainBuhua.x;
this.nodeMainBuhuaAni.scale = 1.5;
this.nodeMainBuhuaAni.x = s;
this.nodeMainBuhuaAni.y = -30;
this.nodeMainBuhuaAni.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.hua_pid);
this.nodeMainBuhuaAni.active = !0;
var h = this["nodeMainBuhua" + (this.mainBuhuaData.length + 1)].x, l = this["nodeMainBuhua" + (this.mainBuhuaData.length + 1)].y;
this.nodeMainBuhuaAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(.25, 1), cc.moveTo(.25, h, l)), cc.callFunc(function() {
t.mainWaitBuhuaData.shift();
var o = t.mainBuhuaData;
o.push(e.hua_pid);
t.updateMainBuhua(o);
t.nodeMainBuhuaAni.active = !1;
i = !1;
})));
}
}
wAudioMgr.playSound("sound/man/buhua", "ERQS");
};
t.prototype.showBuhuaOther = function(e) {
var t = this, i = !1;
if (0 == i) {
i = !0;
this.nodeOtherBuhuaAni.stopAllActions();
this.nodeOtherBuhuaAni.scale = 1.5;
this.nodeOtherBuhuaAni.x = 60;
this.nodeOtherBuhuaAni.y = 80;
this.nodeOtherBuhuaAni.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.hua_pid);
this.nodeOtherBuhuaAni.active = !0;
var o = this["nodeOtherBuhua" + (this.otherBuhuaData.length + 1)].x, n = this["nodeOtherBuhua" + (this.otherBuhuaData.length + 1)].y;
this.nodeOtherBuhuaAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(.25, 1), cc.moveTo(.25, o, n)), cc.callFunc(function() {
t.otherWaitBuhuaData.shift();
var o = t.otherBuhuaData;
o.push(e.hua_pid);
t.updateOtherBuhua(o);
t.nodeOtherBuhuaAni.active = !1;
i = !1;
})));
}
wAudioMgr.playSound("sound/man/buhua", "ERQS");
};
t.prototype.showMainBuhua = function() {
var e = this, t = !1, i = this.mainWaitBuhuaData[0];
if (0 == t) {
t = !0;
for (var o = this.mainCardsData.cards, n = [], a = !1, r = -1, d = 0; d < o.length; d++) if (o[d] != i.hua_pid || a) n.push(o[d]); else {
a = !0;
r = d;
}
if (r < 0) return;
n.length < 14 && n.push(i.pid);
this.updateMainMj(n, this.mainCardsData.place);
if (r >= 0) {
this.nodeMainBuhuaAni.stopAllActions();
var c = this["nodeMainMj" + (r + 1)].x - this.nodeMainBuhua.x;
this.nodeMainBuhuaAni.scale = 1.5;
this.nodeMainBuhuaAni.x = c;
this.nodeMainBuhuaAni.y = -30;
this.nodeMainBuhuaAni.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + i.hua_pid);
this.nodeMainBuhuaAni.active = !0;
var s = this["nodeMainBuhua" + (this.mainBuhuaData.length + 1)].x, h = this["nodeMainBuhua" + (this.mainBuhuaData.length + 1)].y;
this.nodeMainBuhuaAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(.25, 1), cc.moveTo(.25, s, h)), cc.callFunc(function() {
e.mainWaitBuhuaData.shift();
var o = e.mainBuhuaData;
o.push(i.hua_pid);
e.updateMainBuhua(o);
e.nodeMainBuhuaAni.active = !1;
t = !1;
})));
}
}
wAudioMgr.playSound("sound/man/buhua", "ERQS");
};
t.prototype.showOtherBuhua = function() {
var e = this, t = !1, i = this.otherWaitBuhuaData[0];
if (0 == t) {
t = !0;
this.nodeOtherBuhuaAni.stopAllActions();
this.nodeOtherBuhuaAni.scale = 1.5;
this.nodeOtherBuhuaAni.x = 60;
this.nodeOtherBuhuaAni.y = 80;
this.nodeOtherBuhuaAni.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + i.hua_pid);
this.nodeOtherBuhuaAni.active = !0;
var o = this["nodeOtherBuhua" + (this.otherBuhuaData.length + 1)].x, n = this["nodeOtherBuhua" + (this.otherBuhuaData.length + 1)].y;
this.nodeOtherBuhuaAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(.25, 1), cc.moveTo(.25, o, n)), cc.callFunc(function() {
e.otherWaitBuhuaData.shift();
var o = e.otherBuhuaData;
o.push(i.hua_pid);
e.updateOtherBuhua(o);
e.nodeOtherBuhuaAni.active = !1;
t = !1;
})));
}
wAudioMgr.playSound("sound/man/buhua", "ERQS");
};
t.prototype.showTingView = function(e) {
var t = Object.keys(e);
this.nodeMainAction.active = !1;
this.nodeMainTing.active = !0;
var i = [];
this.nodeMainTingReal.active = !0;
0 == e.length && (this.nodeMainTingReal.active = !1);
this.nodeMainTingDetail.destroyAllChildren();
if (1 == t.length) {
this.spriteMainTingBg.node.x = 0;
this.spriteMainTingBg.node.width = 320;
this.spriteMainTingBg.node.height = 170;
this.spriteMainTingHu.node.x = -95;
this.spriteMainTingHu.node.y = 100;
i[0] = {
x: 34,
y: 86
};
} else if (2 == t.length) {
this.spriteMainTingBg.node.x = 0;
this.spriteMainTingBg.node.width = 515;
this.spriteMainTingBg.node.height = 170;
this.spriteMainTingHu.node.x = -195;
this.spriteMainTingHu.node.y = 100;
i[0] = {
x: -67,
y: 86
};
i[1] = {
x: 125,
y: 86
};
} else if (3 == t.length) {
this.spriteMainTingBg.node.x = 15;
this.spriteMainTingBg.node.width = 700;
this.spriteMainTingBg.node.height = 170;
this.spriteMainTingHu.node.x = -270;
this.spriteMainTingHu.node.y = 100;
i[0] = {
x: -142,
y: 86
};
i[1] = {
x: 50,
y: 86
};
i[2] = {
x: 242,
y: 86
};
} else if (4 == t.length) {
this.spriteMainTingBg.node.x = 15;
this.spriteMainTingBg.node.width = 700;
this.spriteMainTingBg.node.height = 290;
this.spriteMainTingHu.node.x = -270;
this.spriteMainTingHu.node.y = 220;
i[0] = {
x: -142,
y: 206
};
i[1] = {
x: 50,
y: 206
};
i[2] = {
x: 242,
y: 206
};
i[3] = {
x: -142,
y: 86
};
} else if (5 == t.length) {
this.spriteMainTingBg.node.x = 15;
this.spriteMainTingBg.node.width = 700;
this.spriteMainTingBg.node.height = 290;
this.spriteMainTingHu.node.x = -270;
this.spriteMainTingHu.node.y = 220;
i[0] = {
x: -142,
y: 206
};
i[1] = {
x: 50,
y: 206
};
i[2] = {
x: 242,
y: 206
};
i[3] = {
x: -142,
y: 86
};
i[4] = {
x: 50,
y: 86
};
} else if (6 == t.length) {
this.spriteMainTingBg.node.x = 15;
this.spriteMainTingBg.node.width = 700;
this.spriteMainTingBg.node.height = 290;
this.spriteMainTingHu.node.x = -270;
this.spriteMainTingHu.node.y = 220;
i[0] = {
x: -142,
y: 206
};
i[1] = {
x: 50,
y: 206
};
i[2] = {
x: 242,
y: 206
};
i[3] = {
x: -142,
y: 86
};
i[4] = {
x: 50,
y: 86
};
i[5] = {
x: 242,
y: 86
};
} else if (7 == t.length) {
this.spriteMainTingBg.node.x = 15;
this.spriteMainTingBg.node.width = 700;
this.spriteMainTingBg.node.height = 410;
this.spriteMainTingHu.node.x = -270;
this.spriteMainTingHu.node.y = 340;
i[0] = {
x: -142,
y: 326
};
i[1] = {
x: 50,
y: 326
};
i[2] = {
x: 242,
y: 326
};
i[3] = {
x: -142,
y: 206
};
i[4] = {
x: 50,
y: 206
};
i[5] = {
x: 242,
y: 206
};
i[6] = {
x: -142,
y: 86
};
} else if (8 == t.length) {
this.spriteMainTingBg.node.x = 15;
this.spriteMainTingBg.node.width = 700;
this.spriteMainTingBg.node.height = 410;
this.spriteMainTingHu.node.x = -270;
this.spriteMainTingHu.node.y = 340;
i[0] = {
x: -142,
y: 326
};
i[1] = {
x: 50,
y: 326
};
i[2] = {
x: 242,
y: 326
};
i[3] = {
x: -142,
y: 206
};
i[4] = {
x: 50,
y: 206
};
i[5] = {
x: 242,
y: 206
};
i[6] = {
x: -142,
y: 86
};
i[7] = {
x: 50,
y: 86
};
} else if (9 == t.length) {
this.spriteMainTingBg.node.x = 15;
this.spriteMainTingBg.node.width = 700;
this.spriteMainTingBg.node.height = 410;
this.spriteMainTingHu.node.x = -270;
this.spriteMainTingHu.node.y = 340;
i[0] = {
x: -142,
y: 326
};
i[1] = {
x: 50,
y: 326
};
i[2] = {
x: 242,
y: 326
};
i[3] = {
x: -142,
y: 206
};
i[4] = {
x: 50,
y: 206
};
i[5] = {
x: 242,
y: 206
};
i[6] = {
x: -142,
y: 86
};
i[7] = {
x: 50,
y: 86
};
i[8] = {
x: 242,
y: 86
};
}
var o = 0;
for (var n in e) {
var a = cc.instantiate(this.nodeMainTingItem);
a.getChildByName("spriteMj").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + n);
a.getChildByName("labelFan").getComponent(cc.Label).string = e[n].fan;
a.getChildByName("labelZhang").getComponent(cc.Label).string = e[n].num;
a.x = i[o].x;
a.y = i[o].y;
this.nodeMainTingDetail.addChild(a);
o++;
}
};
t.prototype.showChiView = function() {
this.nodeMainChi.active = !0;
this.nodeMainAction.active = !1;
for (var e = 0; e < 3; e++) if (this.chicard[e]) for (var t = this.chicard[e].split("_"), i = 0; i < t.length; i++) {
this["nodeMainChi" + (e + 1)].active = !0;
var o = this["nodeMainChiMj" + (e + 1) + "_" + (i + 1)];
o.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + t[i]);
t[i] == this.putpid ? o.y = 15 : o.y = 5;
} else this["nodeMainChi" + (e + 1)].active = !1;
};
t.prototype.showChiAni = function(e) {
this.playSkeletonAni(this.skeletonChi, e);
wAudioMgr.playSound("sound/man/chi", "ERQS");
};
t.prototype.showPengAni = function(e) {
this.playSkeletonAni(this.skeletonPeng, e);
wAudioMgr.playSound("sound/man/peng2", "ERQS");
};
t.prototype.showGangAni = function(e) {
var t = this;
this.nodeSpine.active = !0;
for (var i = 0; i < this.nodeSpine.children.length; i++) this.nodeSpine.children[i].active = !1;
this.skeletonGang.node.active = !0;
this.skeletonGang.node.y = e ? -180 : 180;
var o = this.skeletonGang.setAnimation(0, "animation", !1), n = this.skeletonGang.findAnimation("animation").duration;
this.node.runAction(cc.sequence(cc.delayTime(n), cc.callFunc(function() {
o.animationStart = o.animationEnd;
t.skeletonGang.node.active = !1;
})));
this.skeletonLongjuanPai.node.active = !0;
var a = this.skeletonLongjuanPai.setAnimation(0, "animation", !1), r = this.skeletonLongjuanPai.findAnimation("animation").duration;
this.skeletonLongjuanPai.node.runAction(cc.sequence(cc.delayTime(r), cc.callFunc(function() {
a.animationStart = o.animationEnd;
t.skeletonLongjuanPai.node.active = !1;
})));
wAudioMgr.playSound("sound/man/gang", "ERQS");
};
t.prototype.showTingAni = function(e) {
this.playSkeletonAni(this.skeletonTing, e);
wAudioMgr.playSound("sound/man/tingpaile", "ERQS");
};
t.prototype.showHuAni = function(e) {
this.playSkeletonAni(this.skeletonHu, e);
wAudioMgr.playSound("sound/man/yibuxiaoxinjiuhule", "ERQS");
};
t.prototype.showLiujuAni = function(e) {
this.playSkeletonAni(this.skeletonLiuju, e, !0);
};
t.prototype.showZimoAni = function(e) {
this.playSkeletonAni(this.skeletonZimo, e);
};
t.prototype.showHucardAni = function(e) {
var t = this;
this.nodeSpine.active = !0;
if (e) {
this.skeletonHucard.node.x = 360;
this.skeletonHucard.node.y = -160;
} else {
this.skeletonHucard.node.x = -380;
this.skeletonHucard.node.y = 165;
}
var i = this.skeletonHucard.setAnimation(0, "animation", !1), o = this.skeletonHucard.findAnimation("animation").duration;
this.skeletonHucard.node.runAction(cc.sequence(cc.delayTime(o), cc.callFunc(function() {
i.animationStart = i.animationEnd;
t.skeletonHucard.node.active = !1;
})));
};
t.prototype.playSkeletonAni = function(e, t, i) {
this.nodeSpine.active = !0;
for (var o = 0; o < this.nodeSpine.children.length; o++) this.nodeSpine.children[o].active = !1;
e.node.active = !0;
e.node.y = i ? 0 : t ? -180 : 180;
var n = e.setAnimation(0, "animation", !1), a = e.findAnimation("animation").duration;
e.node.runAction(cc.sequence(cc.delayTime(a), cc.callFunc(function() {
n.animationStart = n.animationEnd;
e.node.active = !1;
})));
};
t.prototype.startGame = function(e) {
var t = this, i = this.controll.getSeat(e.banker);
this.showDiceAni(function() {
t.setDirction(i, e.time);
t.showFaCardReal(t.mainCardsData.cards, []);
e.banker == wGameData.getKey("uid") ? t.updateOtherMj(13, []) : t.updateOtherMj(14, []);
t.controll.state = 3;
});
};
t.prototype.beginBuHua = function() {
this.schedule(this.showBuHua, 1.5);
};
t.prototype.setCountDown = function(e) {
this.countdown = e;
this.countdown < 10 ? this.labelCountDown.string = "0" + this.countdown : this.labelCountDown.string = this.countdown.toString();
this.unschedule(this.updateTime);
this.schedule(this.updateTime, 1);
};
t.prototype.updateTime = function() {
this.countdown -= 1;
this.labelCountDown.string = "" + this.countdown;
this.countdown < 10 && (this.labelCountDown.string = "0" + this.countdown);
this.countdown <= 0 && this.unschedule(this.updateTime);
};
t.prototype.showResult = function(e) {
var t = this;
this.intrustNode.active = !1;
this.nodeMainTing.active = !1;
this.nodeMainAction.active = !1;
if (0 != e.turnover.uid) {
var i = this.controll.getSeat(e.turnover.uid);
this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function() {
if (0 == i) {
e.turnover.is_pao && e.turnover.cards.push(e.turnover.hu_card);
var n = o.Config.GamePrefab[17], a = "prefab/resultWin";
wRes.loadRes(a, function(i, o) {
var n = cc.instantiate(o);
n.parent = t.node;
var a = {
peng: t.mainCardsData.place,
normal: e.turnover.cards,
score: e.gold_change,
fan: e.turnover.fan,
hucard: e.turnover.hu_card,
difen: t.labelDifen.string,
fanlist: e.turnover.hu_type,
ispao: e.turnover.is_pao
};
n.getComponent("ERQS_resultWin").init(a, t.cardtype);
}, n.enName);
} else {
e.turnover.is_pao && e.turnover.cards.push(e.turnover.hu_card);
n = o.Config.GamePrefab[17];
a = "prefab/resultLose";
wRes.loadRes(a, function(i, o) {
var n = cc.instantiate(o);
n.parent = t.node;
var a = {
peng: t.otherCardsData.place,
normal: e.turnover.cards,
score: e.gold_change,
fan: e.turnover.fan,
hucard: e.turnover.hu_card,
difen: t.labelDifen.string,
fanlist: e.turnover.hu_type,
ispao: e.turnover.is_pao
};
n.getComponent("ERQS_resultLose").init(a, t.cardtype);
}, n.enName);
}
})));
} else {
this.showLiujuAni(!0);
this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function() {
t.initNode();
t.nodeOtherPlayer.active = !0;
t.btnStart.active = !0;
})));
}
};
t.prototype.setHuCard = function(e, t, i) {
if (0 == e) {
this.nodeMainHuCard.active = !0;
this.nodeMainHuCard.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_layFg");
this.nodeMainHuCard.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + t);
} else {
this.nodeOtherHuCard.active = !0;
this.nodeOtherHuCard.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_layFg");
this.nodeOtherHuCard.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + t);
}
i ? this.showHuAni(0 == e) : this.showZimoAni(0 == e);
};
__decorate([ c(cc.Node) ], t.prototype, "intrustNode", void 0);
__decorate([ c(cc.Label) ], t.prototype, "labelMjNum", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeCenter", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteDirctionTopBg", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteDirctionTop", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteDirctionBottomBg", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteDirctionBottom", void 0);
__decorate([ c(cc.Label) ], t.prototype, "labelCountDown", void 0);
__decorate([ c(cc.Label) ], t.prototype, "labelDifen", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeDice", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeDice1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeDice2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherPlayer", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteOtherHead", void 0);
__decorate([ c(cc.Label) ], t.prototype, "labelOtherName", void 0);
__decorate([ c(cc.Label) ], t.prototype, "labelOtherGold", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteOtherTingpai", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteOtherZhuan", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainPlayer", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteMainHead", void 0);
__decorate([ c(cc.Label) ], t.prototype, "labelMainName", void 0);
__decorate([ c(cc.Label) ], t.prototype, "labelMainGold", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteMainTingpai", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteMainZhuan", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOther", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang1_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang1_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang1_3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang1_4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang2_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang2_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang2_3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang2_4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang3_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang3_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang3_3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang3_4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang4_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang4_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang4_3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang4_4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj5", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj6", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj7", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj8", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj9", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj10", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj11", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj12", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj13", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj14", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard5", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard6", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard7", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard8", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard9", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard10", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard11", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard12", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard13", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard14", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai5", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai6", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai7", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai8", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai9", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai10", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai11", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai12", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai13", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai14", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai15", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai16", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai17", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai18", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai19", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai20", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai21", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai22", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai23", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai24", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai25", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai26", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonOtherPaitisi", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherBuhua", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherBuhua1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherBuhua2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherBuhua3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherBuhua4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherBuhua5", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherBuhua6", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherBuhua7", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherBuhua8", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherBuhuaAni", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupaiAni", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMain", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai5", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai6", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai7", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai8", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai9", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai10", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai11", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai12", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai13", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai14", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai15", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai16", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai17", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai18", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai19", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai20", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai21", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai22", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai23", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai24", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai25", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai26", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonMainPaitisi", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupaiAni", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainBuhua", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainBuhua1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainBuhua2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainBuhua3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainBuhua4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainBuhua5", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainBuhua6", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainBuhua7", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainBuhua8", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainBuhuaAni", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang1_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang1_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang1_3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang1_4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang2_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang2_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang2_3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang2_4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang3_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang3_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang3_3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang3_4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang4_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang4_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang4_3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang4_4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj4", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj5", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj6", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj7", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj8", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj9", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj10", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj11", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj12", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj13", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj14", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjAni", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnClickMj", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainAction", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainGuo", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainChi", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainPeng", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainGang", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainTing", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainHu", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainTing", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainTingCancel", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainTingReal", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteMainTingBg", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteMainTingHu", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainTingDetail", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainTingItem", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChi", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainChiguo", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChi1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChiMj1_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChiMj1_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChiMj1_3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChi2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChiMj2_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChiMj2_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChiMj2_3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChi3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChiMj3_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChiMj3_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChiMj3_3", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainChiback", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeCardAni", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeCardAniReal", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteCardAni", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainHuCard", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherHuCard", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeSpine", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonChi", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonLongjuanPai", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonGang", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonHu", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonLiuju", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonPeng", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonTing", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonZimo", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonHucard", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnChat", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMenu", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMenuClose", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMenuMask", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "spriteMenuBg", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMenuChange", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMenuBank", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMenuRule", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMenuChat", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMenuSetting", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMenuBack", void 0);
__decorate([ c(cc.Node) ], t.prototype, "btnStart", void 0);
__decorate([ c(cc.SpriteAtlas) ], t.prototype, "spriteAtlasMj", void 0);
__decorate([ c(cc.SpriteAtlas) ], t.prototype, "spriteAtlasDice", void 0);
__decorate([ c(cc.SpriteFrame) ], t.prototype, "spriteFrameMenuNormal", void 0);
__decorate([ c(cc.SpriteFrame) ], t.prototype, "spriteFrameMenuSelect", void 0);
__decorate([ c(cc.SpriteFrame) ], t.prototype, "spriteFrameWestNormal", void 0);
__decorate([ c(cc.SpriteFrame) ], t.prototype, "spriteFrameWestSelect", void 0);
__decorate([ c(cc.SpriteFrame) ], t.prototype, "spriteFrameEastNormal", void 0);
__decorate([ c(cc.SpriteFrame) ], t.prototype, "spriteFrameEastSelect", void 0);
__decorate([ c([ cc.Vec2 ]) ], t.prototype, "mjPositionData", void 0);
return __decorate([ d ], t);
}(cc.Component);
i.default = s;
cc._RF.pop();
}, {
Config: void 0,
ERQS_Controll: "ERQS_Controll",
"FrameAnim ": "FrameAnim "
} ],
ERQS_resultLose: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "734d9rhiSZCLZTzezAyG+0J", "ERQS_resultLose");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = cc._decorator, n = o.ccclass, a = o.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.nodeBg = null;
t.btnBack = null;
t.btnChange = null;
t.skeletonFailure = null;
t.labelScore = null;
t.labelFan = null;
t.labelDifen = null;
t.scrollviewFan = null;
t.scrollviewContent = null;
t.nodeItem = null;
t.nodeMj = null;
t.nodeMjGang1 = null;
t.nodeMjGang1_1 = null;
t.nodeMjGang1_2 = null;
t.nodeMjGang1_3 = null;
t.nodeMjGang1_4 = null;
t.nodeMjGang2 = null;
t.nodeMjGang2_1 = null;
t.nodeMjGang2_2 = null;
t.nodeMjGang2_3 = null;
t.nodeMjGang2_4 = null;
t.nodeMjGang3 = null;
t.nodeMjGang3_1 = null;
t.nodeMjGang3_2 = null;
t.nodeMjGang3_3 = null;
t.nodeMjGang3_4 = null;
t.nodeMjGang4 = null;
t.nodeMjGang4_1 = null;
t.nodeMjGang4_2 = null;
t.nodeMjGang4_3 = null;
t.nodeMjGang4_4 = null;
t.nodeMj1 = null;
t.nodeMj2 = null;
t.nodeMj3 = null;
t.nodeMj4 = null;
t.nodeMj5 = null;
t.nodeMj6 = null;
t.nodeMj7 = null;
t.nodeMj8 = null;
t.nodeMj9 = null;
t.nodeMj10 = null;
t.nodeMj11 = null;
t.nodeMj12 = null;
t.nodeMj13 = null;
t.nodeMj14 = null;
t.spriteHu = null;
t.buttonStart = null;
t.labelCountdown = null;
t.spriteAtlasMj = null;
return t;
}
t.prototype.init = function(e, t) {
this.data = e;
this.cardtypes = t;
this.showResult(e);
};
t.prototype.showResult = function(e) {
var t = this;
this.data = e;
this.labelScore.string = this.data.score;
this.labelFan.string = this.data.fan + "番";
this.labelDifen.string = this.data.difen;
this.updateScrollViewFan(this.data.fanlist);
this.updateMj(this.data);
this.skeletonFailure.setAnimation(0, "start", !1);
var i = this.skeletonFailure.findAnimation("start").duration;
cc.log("time", i);
this.scheduleOnce(function() {
t.skeletonFailure.setAnimation(0, "idle", !0);
}, i);
this.labelScore.node.x = 280;
this.labelScore.node.runAction(cc.moveBy(.3, 45, 0));
this.labelFan.node.x = 30;
this.labelDifen.node.x = 297;
this.labelFan.node.runAction(cc.moveBy(.4, 60, 0));
this.labelDifen.node.runAction(cc.moveBy(.4, 60, 0));
this.scrollviewFan.node.x = -295;
this.scrollviewFan.node.runAction(cc.moveBy(.6, 200, 0));
this.countdown = 15;
this.labelCountdown.string = "15";
this.schedule(this.updateTime, 1);
};
t.prototype.updateTime = function() {
cc.log("updateTime");
this.countdown -= 1;
this.labelCountdown.string = "" + this.countdown;
if (this.countdown <= 0) {
this.unschedule(this.updateTime);
this.node.active = !1;
}
};
t.prototype.updateScrollViewFan = function(e) {
cc.log("updateScrollViewFan");
null == this.itemPoolFan && (this.itemPoolFan = new cc.NodePool());
var t = Math.ceil(e.length / 2);
if (this.scrollviewContent.childrenCount > 0 && this.scrollviewContent.childrenCount > t) {
cc.log(this.scrollviewContent.childrenCount);
for (var i = this.scrollviewContent.childrenCount - 1; i >= t; i--) this.itemPoolFan.put(this.scrollviewContent.children[i]);
}
var o = 40 * t, n = this.scrollviewFan.node.height;
o < n && (o = n);
this.scrollviewContent.height = o;
for (i = 0; i < t; i++) {
var a = null;
if (i < this.scrollviewContent.childrenCount) a = this.scrollviewContent.children[i]; else {
a = this.itemPoolFan.size() > 0 ? this.itemPoolFan.get() : cc.instantiate(this.nodeItem);
this.scrollviewContent.addChild(a);
}
a.setPosition(0, 0 - 40 * (i + 1));
var r = a.getChildByName("labelName1");
a.getChildByName("labelFan1");
var d = a.getChildByName("labelName2");
a.getChildByName("labelFan2");
e[2 * i] && (r.getComponent(cc.Label).string = this.cardtypes[e[2 * i]]);
if (e[2 * i + 1]) {
d.active = !0;
d.getComponent(cc.Label).string = this.cardtypes[e[2 * i + 1]];
} else d.active = !1;
}
};
t.prototype.updateMj = function(e) {
var t = this;
cc.log("updateMj");
cc.log(e.normal);
var i = Object.keys(e.peng).length;
this.spriteHu.node.active = !1;
e.normal.sort();
cc.log(e.normal);
if (0 == i) {
this.nodeMjGang1.active = !1;
this.nodeMjGang2.active = !1;
this.nodeMjGang3.active = !1;
this.nodeMjGang4.active = !1;
this.nodeMj.x = -96;
this.nodeMj.y = -125;
for (var o = function(i) {
n["nodeMj" + (i + 1)].active = !0;
n["nodeMj" + (i + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = n.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + e.normal[i]);
if (e.normal[i] == e.hucard) {
n.spriteHu.node.active = !0;
n.spriteHu.node.x = n["nodeMj" + (i + 1)].x;
}
n["nodeMj" + (i + 1)].opacity = 1;
n["nodeMj" + (i + 1)].y = -20;
n["nodeMj" + (i + 1)].runAction(cc.sequence(cc.delayTime(.033 * (i + 1)), cc.callFunc(function() {
t["nodeMj" + (i + 1)].opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
}, n = this, a = 0; a < e.normal.length; a++) o(a);
} else if (1 == i) {
this.nodeMjGang1.active = !0;
this.nodeMjGang1.x = 44;
this.nodeMjGang2.active = !1;
this.nodeMjGang3.active = !1;
this.nodeMjGang4.active = !1;
this.nodeMj.x = -96;
this.nodeMj.y = -125;
this.index = 0;
var r = function(i) {
if (i < 3) d["nodeMj" + (i + 1)].active = !1; else {
d["nodeMj" + (i + 1)].active = !0;
d["nodeMj" + (i + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = d.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + e.normal[d.index]);
if (e.normal[d.index] == e.hucard) {
d.spriteHu.node.active = !0;
d.spriteHu.node.x = d["nodeMj" + (i + 1)].x;
}
d["nodeMj" + (i + 1)].opacity = 1;
d["nodeMj" + (i + 1)].y = -20;
d["nodeMj" + (i + 1)].runAction(cc.sequence(cc.delayTime(.033 * (i + 4)), cc.callFunc(function() {
t["nodeMj" + (i + 1)].opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
d.index++;
}
}, d = this;
for (a = 0; a < 14; a++) r(a);
} else if (2 == i) {
this.nodeMjGang1.active = !0;
this.nodeMjGang1.x = 36;
this.nodeMjGang2.active = !0;
this.nodeMjGang2.x = 202;
this.nodeMjGang3.active = !1;
this.nodeMjGang4.active = !1;
this.nodeMj.x = -96;
this.nodeMj.y = -125;
this.index = 0;
var c = function(i) {
if (i < 6) s["nodeMj" + (i + 1)].active = !1; else {
s["nodeMj" + (i + 1)].active = !0;
s["nodeMj" + (i + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = s.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + e.normal[s.index]);
if (e.normal[s.index] == e.hucard) {
s.spriteHu.node.active = !0;
s.spriteHu.node.x = s["nodeMj" + (i + 1)].x;
}
s["nodeMj" + (i + 1)].opacity = 1;
s["nodeMj" + (i + 1)].y = -20;
s["nodeMj" + (i + 1)].runAction(cc.sequence(cc.delayTime(.033 * (i + 7)), cc.callFunc(function() {
t["nodeMj" + (i + 1)].opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
s.index++;
}
}, s = this;
for (a = 0; a < 14; a++) c(a);
} else if (3 == i) {
this.nodeMjGang1.active = !0;
this.nodeMjGang1.x = 36;
this.nodeMjGang2.active = !0;
this.nodeMjGang2.x = 202;
this.nodeMjGang3.active = !0;
this.nodeMjGang3.x = 368;
this.nodeMjGang4.active = !1;
this.nodeMj.x = -96;
this.nodeMj.y = -125;
this.index = 0;
var h = function(i) {
if (i < 9) l["nodeMj" + (i + 1)].active = !1; else {
l["nodeMj" + (i + 1)].active = !0;
l["nodeMj" + (i + 1)].x = l["nodeMj" + (i + 1)].x + 13;
l["nodeMj" + (i + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = l.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + e.normal[l.index]);
if (e.normal[l.index] == e.hucard) {
l.spriteHu.node.active = !0;
l.spriteHu.node.x = l["nodeMj" + (i + 1)].x;
}
l["nodeMj" + (i + 1)].opacity = 1;
l["nodeMj" + (i + 1)].y = -20;
l["nodeMj" + (i + 1)].runAction(cc.sequence(cc.delayTime(.033 * (i + 10)), cc.callFunc(function() {
t["nodeMj" + (i + 1)].opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
l.index++;
}
}, l = this;
for (a = 0; a < 14; a++) h(a);
} else if (4 == i) {
this.nodeMjGang1.active = !0;
this.nodeMjGang1.x = 36;
this.nodeMjGang2.active = !0;
this.nodeMjGang2.x = 202;
this.nodeMjGang3.active = !0;
this.nodeMjGang3.x = 368;
this.nodeMjGang4.active = !0;
this.nodeMjGang4.x = 534;
this.nodeMj.x = -96;
this.nodeMj.y = -125;
this.index = 0;
var p = function(i) {
if (i < 12) u["nodeMj" + (i + 1)].active = !1; else {
u["nodeMj" + (i + 1)].active = !0;
u["nodeMj" + (i + 1)].x = u["nodeMj" + (i + 1)].x + 13;
u["nodeMj" + (i + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = u.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + e.normal[u.index]);
if (e.normal[u.index] == e.hucard) {
u.spriteHu.node.active = !0;
u.spriteHu.node.x = u["nodeMj" + (i + 1)].x;
}
u["nodeMj" + (i + 1)].opacity = 1;
u["nodeMj" + (i + 1)].y = -20;
u["nodeMj" + (i + 1)].runAction(cc.sequence(cc.delayTime(.033 * (i + 13)), cc.callFunc(function() {
t["nodeMj" + (i + 1)].opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
u.index++;
}
}, u = this;
for (a = 0; a < 14; a++) p(a);
}
var _ = 0, M = function(t) {
var i = g["nodeMjGang" + (_ + 1) + "_1"], o = g["nodeMjGang" + (_ + 1) + "_2"], n = g["nodeMjGang" + (_ + 1) + "_3"], a = g["nodeMjGang" + (_ + 1) + "_4"];
i.active = !0;
o.active = !0;
n.active = !0;
if (5 == e.peng[t].type) {
g["nodeMjGang" + (_ + 1)].active = !0;
a.active = !1;
i.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
o.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
n.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
} else if (3 == e.peng[t].type || 4 == e.peng[t].type) if (e.peng[t].uid == wGameData.getKey("uid")) {
g["nodeMjGang" + (_ + 1)].active = !0;
a.active = !0;
i.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_layBg");
o.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_layBg");
n.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_layBg");
i.getChildByName("spriteNum").active = !1;
o.getChildByName("spriteNum").active = !1;
n.getChildByName("spriteNum").active = !1;
a.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
} else {
g["nodeMjGang" + (_ + 1)].active = !0;
a.active = !0;
i.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
o.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
n.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
a.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
} else if (6 == e.peng[t].type) {
a.active = !1;
i.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
o.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[1]);
n.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[2]);
}
i.opacity = 1;
i.y = -20;
i.runAction(cc.sequence(cc.delayTime(.033 * (3 * _ + 1)), cc.callFunc(function() {
i.opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
o.opacity = 1;
o.y = -20;
o.runAction(cc.sequence(cc.delayTime(.033 * (3 * _ + 2)), cc.callFunc(function() {
o.opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
n.opacity = 1;
n.y = -20;
n.runAction(cc.sequence(cc.delayTime(.033 * (3 * _ + 3)), cc.callFunc(function() {
n.opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
a.opacity = 1;
a.y = -20;
a.runAction(cc.sequence(cc.delayTime(.099 * _), cc.callFunc(function() {
a.opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
_++;
}, g = this;
for (var m in e.peng) M(m);
};
t.prototype.onClick = function(e, t) {
cc.log("ERQS_view onClick:" + t);
switch (t) {
case "back":
wAudioMgr.playCloseSound();
wNetWork.send("Msg_ERQS_Out", [], !0);
this.node.destroy();
break;

case "change":
wAudioMgr.playCloseSound();
wGEvent.emit("local_Event", "changeTable");
break;

case "start":
wAudioMgr.playCloseSound();
wNetWork.send("Msg_ERQS_Ready", {
ready: !0
});
this.node.destroy();
}
};
__decorate([ a(cc.Node) ], t.prototype, "nodeBg", void 0);
__decorate([ a(cc.Button) ], t.prototype, "btnBack", void 0);
__decorate([ a(cc.Button) ], t.prototype, "btnChange", void 0);
__decorate([ a(sp.Skeleton) ], t.prototype, "skeletonFailure", void 0);
__decorate([ a(cc.Label) ], t.prototype, "labelScore", void 0);
__decorate([ a(cc.Label) ], t.prototype, "labelFan", void 0);
__decorate([ a(cc.Label) ], t.prototype, "labelDifen", void 0);
__decorate([ a(cc.ScrollView) ], t.prototype, "scrollviewFan", void 0);
__decorate([ a(cc.Node) ], t.prototype, "scrollviewContent", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeItem", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang1", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang1_1", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang1_2", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang1_3", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang1_4", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang2", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang2_1", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang2_2", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang2_3", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang2_4", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang3", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang3_1", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang3_2", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang3_3", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang3_4", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang4", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang4_1", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang4_2", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang4_3", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang4_4", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj1", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj2", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj3", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj4", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj5", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj6", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj7", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj8", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj9", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj10", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj11", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj12", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj13", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj14", void 0);
__decorate([ a(cc.Sprite) ], t.prototype, "spriteHu", void 0);
__decorate([ a(cc.Button) ], t.prototype, "buttonStart", void 0);
__decorate([ a(cc.Label) ], t.prototype, "labelCountdown", void 0);
__decorate([ a(cc.SpriteAtlas) ], t.prototype, "spriteAtlasMj", void 0);
return __decorate([ n ], t);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {} ],
ERQS_resultWin: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "558e5XRWthH/agsiNgr3FDE", "ERQS_resultWin");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = cc._decorator, n = o.ccclass, a = o.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.nodeBg = null;
t.btnBack = null;
t.btnChange = null;
t.skeletonWinner = null;
t.labelScore = null;
t.labelFan = null;
t.labelDifen = null;
t.scrollviewFan = null;
t.scrollviewContent = null;
t.nodeItem = null;
t.nodeMj = null;
t.nodeMjGang1 = null;
t.nodeMjGang1_1 = null;
t.nodeMjGang1_2 = null;
t.nodeMjGang1_3 = null;
t.nodeMjGang1_4 = null;
t.nodeMjGang2 = null;
t.nodeMjGang2_1 = null;
t.nodeMjGang2_2 = null;
t.nodeMjGang2_3 = null;
t.nodeMjGang2_4 = null;
t.nodeMjGang3 = null;
t.nodeMjGang3_1 = null;
t.nodeMjGang3_2 = null;
t.nodeMjGang3_3 = null;
t.nodeMjGang3_4 = null;
t.nodeMjGang4 = null;
t.nodeMjGang4_1 = null;
t.nodeMjGang4_2 = null;
t.nodeMjGang4_3 = null;
t.nodeMjGang4_4 = null;
t.nodeMj1 = null;
t.nodeMj2 = null;
t.nodeMj3 = null;
t.nodeMj4 = null;
t.nodeMj5 = null;
t.nodeMj6 = null;
t.nodeMj7 = null;
t.nodeMj8 = null;
t.nodeMj9 = null;
t.nodeMj10 = null;
t.nodeMj11 = null;
t.nodeMj12 = null;
t.nodeMj13 = null;
t.nodeMj14 = null;
t.spriteHu = null;
t.buttonStart = null;
t.labelCountdown = null;
t.spriteAtlasMj = null;
return t;
}
t.prototype.init = function(e, t) {
this.data = e;
this.cardtypes = t;
this.showResult(e);
};
t.prototype.showResult = function(e) {
var t = this;
this.data = e;
this.labelScore.string = this.data.score;
this.labelFan.string = this.data.fan + "番";
this.labelDifen.string = this.data.difen;
this.updateScrollViewFan(this.data.fanlist);
this.updateMj(this.data);
this.skeletonWinner.setAnimation(0, "start", !1);
var i = this.skeletonWinner.findAnimation("start").duration;
cc.log("time", i);
this.scheduleOnce(function() {
t.skeletonWinner.setAnimation(0, "idle", !0);
}, i);
this.labelScore.node.x = 280;
this.labelScore.node.runAction(cc.moveBy(.3, 45, 0));
this.labelFan.node.x = 30;
this.labelDifen.node.x = 297;
this.labelFan.node.runAction(cc.moveBy(.4, 60, 0));
this.labelDifen.node.runAction(cc.moveBy(.4, 60, 0));
this.scrollviewFan.node.x = -295;
this.scrollviewFan.node.runAction(cc.moveBy(.6, 200, 0));
this.countdown = 15;
this.labelCountdown.string = "15";
this.schedule(this.updateTime, 1);
};
t.prototype.updateTime = function() {
cc.log("updateTime");
this.countdown -= 1;
this.labelCountdown.string = "" + this.countdown;
if (this.countdown <= 0) {
this.unschedule(this.updateTime);
this.node.active = !1;
}
};
t.prototype.updateScrollViewFan = function(e) {
cc.log("updateScrollViewFan");
null == this.itemPoolFan && (this.itemPoolFan = new cc.NodePool());
var t = Math.ceil(e.length / 2);
if (this.scrollviewContent.childrenCount > 0 && this.scrollviewContent.childrenCount > t) {
cc.log(this.scrollviewContent.childrenCount);
for (var i = this.scrollviewContent.childrenCount - 1; i >= t; i--) this.itemPoolFan.put(this.scrollviewContent.children[i]);
}
var o = 40 * t, n = this.scrollviewFan.node.height;
o < n && (o = n);
this.scrollviewContent.height = o;
for (i = 0; i < t; i++) {
var a = null;
if (i < this.scrollviewContent.childrenCount) a = this.scrollviewContent.children[i]; else {
a = this.itemPoolFan.size() > 0 ? this.itemPoolFan.get() : cc.instantiate(this.nodeItem);
this.scrollviewContent.addChild(a);
}
a.setPosition(0, 0 - 40 * (i + 1));
var r = a.getChildByName("labelName1");
a.getChildByName("labelFan1");
var d = a.getChildByName("labelName2");
a.getChildByName("labelFan2");
e[2 * i] && (r.getComponent(cc.Label).string = this.cardtypes[e[2 * i]]);
if (e[2 * i + 1]) {
d.active = !0;
d.getComponent(cc.Label).string = this.cardtypes[e[2 * i + 1]];
} else d.active = !1;
}
};
t.prototype.updateMj = function(e) {
var t = this;
cc.log("updateMj");
cc.log(e.normal);
var i = Object.keys(e.peng).length;
this.spriteHu.node.active = !1;
e.normal.sort();
cc.log(e.normal);
if (0 == i) {
this.nodeMjGang1.active = !1;
this.nodeMjGang2.active = !1;
this.nodeMjGang3.active = !1;
this.nodeMjGang4.active = !1;
this.nodeMj.x = -96;
this.nodeMj.y = -125;
for (var o = function(i) {
n["nodeMj" + (i + 1)].active = !0;
n["nodeMj" + (i + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = n.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + e.normal[i]);
if (e.normal[i] == e.hucard) {
n.spriteHu.node.active = !0;
n.spriteHu.node.x = n["nodeMj" + (i + 1)].x;
}
n["nodeMj" + (i + 1)].opacity = 1;
n["nodeMj" + (i + 1)].y = -20;
n["nodeMj" + (i + 1)].runAction(cc.sequence(cc.delayTime(.033 * (i + 1)), cc.callFunc(function() {
t["nodeMj" + (i + 1)].opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
}, n = this, a = 0; a < e.normal.length; a++) o(a);
} else if (1 == i) {
this.nodeMjGang1.active = !0;
this.nodeMjGang1.x = 44;
this.nodeMjGang2.active = !1;
this.nodeMjGang3.active = !1;
this.nodeMjGang4.active = !1;
this.nodeMj.x = -96;
this.nodeMj.y = -125;
this.index = 0;
var r = function(i) {
if (i < 3) d["nodeMj" + (i + 1)].active = !1; else {
d["nodeMj" + (i + 1)].active = !0;
d["nodeMj" + (i + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = d.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + e.normal[d.index]);
if (e.normal[d.index] == e.hucard) {
d.spriteHu.node.active = !0;
d.spriteHu.node.x = d["nodeMj" + (i + 1)].x;
}
d["nodeMj" + (i + 1)].opacity = 1;
d["nodeMj" + (i + 1)].y = -20;
d["nodeMj" + (i + 1)].runAction(cc.sequence(cc.delayTime(.033 * (i + 4)), cc.callFunc(function() {
t["nodeMj" + (i + 1)].opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
d.index++;
}
}, d = this;
for (a = 0; a < 14; a++) r(a);
} else if (2 == i) {
this.nodeMjGang1.active = !0;
this.nodeMjGang1.x = 36;
this.nodeMjGang2.active = !0;
this.nodeMjGang2.x = 202;
this.nodeMjGang3.active = !1;
this.nodeMjGang4.active = !1;
this.nodeMj.x = -96;
this.nodeMj.y = -125;
this.index = 0;
var c = function(i) {
if (i < 6) s["nodeMj" + (i + 1)].active = !1; else {
s["nodeMj" + (i + 1)].active = !0;
s["nodeMj" + (i + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = s.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + e.normal[s.index]);
if (e.normal[s.index] == e.hucard) {
s.spriteHu.node.active = !0;
s.spriteHu.node.x = s["nodeMj" + (i + 1)].x;
}
s["nodeMj" + (i + 1)].opacity = 1;
s["nodeMj" + (i + 1)].y = -20;
s["nodeMj" + (i + 1)].runAction(cc.sequence(cc.delayTime(.033 * (i + 7)), cc.callFunc(function() {
t["nodeMj" + (i + 1)].opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
s.index++;
}
}, s = this;
for (a = 0; a < 14; a++) c(a);
} else if (3 == i) {
this.nodeMjGang1.active = !0;
this.nodeMjGang1.x = 36;
this.nodeMjGang2.active = !0;
this.nodeMjGang2.x = 202;
this.nodeMjGang3.active = !0;
this.nodeMjGang3.x = 368;
this.nodeMjGang4.active = !1;
this.nodeMj.x = -96;
this.nodeMj.y = -125;
this.index = 0;
var h = function(i) {
if (i < 9) l["nodeMj" + (i + 1)].active = !1; else {
l["nodeMj" + (i + 1)].active = !0;
l["nodeMj" + (i + 1)].x = l["nodeMj" + (i + 1)].x + 13;
l["nodeMj" + (i + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = l.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + e.normal[l.index]);
if (e.normal[l.index] == e.hucard) {
l.spriteHu.node.active = !0;
l.spriteHu.node.x = l["nodeMj" + (i + 1)].x;
}
l["nodeMj" + (i + 1)].opacity = 1;
l["nodeMj" + (i + 1)].y = -20;
l["nodeMj" + (i + 1)].runAction(cc.sequence(cc.delayTime(.033 * (i + 10)), cc.callFunc(function() {
t["nodeMj" + (i + 1)].opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
l.index++;
}
}, l = this;
for (a = 0; a < 14; a++) h(a);
} else if (4 == i) {
this.nodeMjGang1.active = !0;
this.nodeMjGang1.x = 36;
this.nodeMjGang2.active = !0;
this.nodeMjGang2.x = 202;
this.nodeMjGang3.active = !0;
this.nodeMjGang3.x = 368;
this.nodeMjGang4.active = !0;
this.nodeMjGang4.x = 534;
this.nodeMj.x = -96;
this.nodeMj.y = -125;
this.index = 0;
var p = function(i) {
if (i < 12) u["nodeMj" + (i + 1)].active = !1; else {
u["nodeMj" + (i + 1)].active = !0;
u["nodeMj" + (i + 1)].x = u["nodeMj" + (i + 1)].x + 13;
u["nodeMj" + (i + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = u.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_" + e.normal[u.index]);
if (e.normal[u.index] == e.hucard) {
u.spriteHu.node.active = !0;
u.spriteHu.node.x = u["nodeMj" + (i + 1)].x;
}
u["nodeMj" + (i + 1)].opacity = 1;
u["nodeMj" + (i + 1)].y = -20;
u["nodeMj" + (i + 1)].runAction(cc.sequence(cc.delayTime(.033 * (i + 13)), cc.callFunc(function() {
t["nodeMj" + (i + 1)].opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
u.index++;
}
}, u = this;
for (a = 0; a < 14; a++) p(a);
}
var _ = 0, M = function(t) {
var i = g["nodeMjGang" + (_ + 1) + "_1"], o = g["nodeMjGang" + (_ + 1) + "_2"], n = g["nodeMjGang" + (_ + 1) + "_3"], a = g["nodeMjGang" + (_ + 1) + "_4"];
i.active = !0;
o.active = !0;
n.active = !0;
if (5 == e.peng[t].type) {
g["nodeMjGang" + (_ + 1)].active = !0;
a.active = !1;
i.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
o.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
n.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
} else if (3 == e.peng[t].type || 4 == e.peng[t].type) if (e.peng[t].uid == wGameData.getKey("uid")) {
g["nodeMjGang" + (_ + 1)].active = !0;
a.active = !0;
i.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_layBg");
o.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_layBg");
n.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_layBg");
i.getChildByName("spriteNum").active = !1;
o.getChildByName("spriteNum").active = !1;
n.getChildByName("spriteNum").active = !1;
a.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
} else {
g["nodeMjGang" + (_ + 1)].active = !0;
a.active = !0;
i.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
o.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
n.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
a.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
} else if (6 == e.peng[t].type) {
a.active = !1;
i.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[0]);
o.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[1]);
n.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = g.spriteAtlasMj.getSpriteFrame("ermjex_plist_mj_sign_l_" + e.peng[t].arr[2]);
}
i.opacity = 1;
i.y = -20;
i.runAction(cc.sequence(cc.delayTime(.033 * (3 * _ + 1)), cc.callFunc(function() {
i.opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
o.opacity = 1;
o.y = -20;
o.runAction(cc.sequence(cc.delayTime(.033 * (3 * _ + 2)), cc.callFunc(function() {
o.opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
n.opacity = 1;
n.y = -20;
n.runAction(cc.sequence(cc.delayTime(.033 * (3 * _ + 3)), cc.callFunc(function() {
n.opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
a.opacity = 1;
a.y = -20;
a.runAction(cc.sequence(cc.delayTime(.099 * _), cc.callFunc(function() {
a.opacity = 255;
}), cc.moveBy(.2, 0, 30), cc.moveBy(.1, 0, -10)));
_++;
}, g = this;
for (var m in e.peng) M(m);
};
t.prototype.onClick = function(e, t) {
cc.log("ERQS_view onClick:" + t);
switch (t) {
case "back":
wAudioMgr.playCloseSound();
wNetWork.send("Msg_ERQS_Out", [], !0);
this.node.destroy();
break;

case "change":
wAudioMgr.playCloseSound();
wGEvent.emit("local_Event", "changeTable");
break;

case "start":
wAudioMgr.playCloseSound();
wNetWork.send("Msg_ERQS_Ready", {
ready: !0
});
this.node.destroy();
}
};
__decorate([ a(cc.Node) ], t.prototype, "nodeBg", void 0);
__decorate([ a(cc.Button) ], t.prototype, "btnBack", void 0);
__decorate([ a(cc.Button) ], t.prototype, "btnChange", void 0);
__decorate([ a(sp.Skeleton) ], t.prototype, "skeletonWinner", void 0);
__decorate([ a(cc.Label) ], t.prototype, "labelScore", void 0);
__decorate([ a(cc.Label) ], t.prototype, "labelFan", void 0);
__decorate([ a(cc.Label) ], t.prototype, "labelDifen", void 0);
__decorate([ a(cc.ScrollView) ], t.prototype, "scrollviewFan", void 0);
__decorate([ a(cc.Node) ], t.prototype, "scrollviewContent", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeItem", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang1", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang1_1", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang1_2", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang1_3", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang1_4", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang2", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang2_1", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang2_2", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang2_3", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang2_4", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang3", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang3_1", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang3_2", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang3_3", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang3_4", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang4", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang4_1", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang4_2", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang4_3", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMjGang4_4", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj1", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj2", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj3", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj4", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj5", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj6", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj7", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj8", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj9", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj10", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj11", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj12", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj13", void 0);
__decorate([ a(cc.Node) ], t.prototype, "nodeMj14", void 0);
__decorate([ a(cc.Sprite) ], t.prototype, "spriteHu", void 0);
__decorate([ a(cc.Button) ], t.prototype, "buttonStart", void 0);
__decorate([ a(cc.Label) ], t.prototype, "labelCountdown", void 0);
__decorate([ a(cc.SpriteAtlas) ], t.prototype, "spriteAtlasMj", void 0);
return __decorate([ n ], t);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {} ],
"FrameAnim ": [ function(e, t, i) {
"use strict";
cc._RF.push(t, "c19b2mIb3dE2bEiQdQJHD21", "FrameAnim ");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = cc._decorator, n = o.ccclass, a = o.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.spriteFrames = [];
t.duration = .1;
t.loop = !1;
t.playOnload = !1;
t.endFunc = null;
t.isPlaying = !1;
t.playTime = 0;
return t;
}
t.prototype.onLoad = function() {
this.sprite = this.node.getComponent(cc.Sprite);
this.sprite || (this.sprite = this.node.addComponent(cc.Sprite));
this.playOnload && (this.loop ? this.playLoop() : this.playOnce(null));
};
t.prototype.updateSpriteFrames = function(e) {
this.spriteFrames = e;
};
t.prototype.playLoop = function() {
this.initFrame(!0, null);
};
t.prototype.playOnce = function(e) {
this.initFrame(!1, e);
};
t.prototype.initFrame = function(e, t) {
if (!(this.spriteFrames.length <= 0)) {
this.isPlaying = !0;
this.playTime = 0;
this.sprite = this.node.getComponent(cc.Sprite);
this.sprite || (this.sprite = this.node.addComponent(cc.Sprite));
this.sprite.spriteFrame = this.spriteFrames[0];
this.loop = e;
this.endFunc = t;
}
};
t.prototype.update = function(e) {
if (this.isPlaying) {
this.playTime += e;
var t = Math.floor(this.playTime / this.duration);
if (this.loop) {
if (t >= this.spriteFrames.length) {
t -= this.spriteFrames.length;
this.playTime -= this.duration * this.spriteFrames.length;
}
this.sprite.spriteFrame = this.spriteFrames[t];
} else if (t >= this.spriteFrames.length) {
this.isPlaying = !1;
this.endFunc && this.endFunc();
} else this.sprite.spriteFrame = this.spriteFrames[t];
}
};
__decorate([ a({
type: [ cc.SpriteFrame ],
tooltip: "帧动画图片数组"
}) ], t.prototype, "spriteFrames", void 0);
__decorate([ a({
tooltip: "每一帧的时长"
}) ], t.prototype, "duration", void 0);
__decorate([ a({
tooltip: "是否循环播放"
}) ], t.prototype, "loop", void 0);
__decorate([ a({
tooltip: "是否在加载的时候就开始播放"
}) ], t.prototype, "playOnload", void 0);
return __decorate([ n ], t);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {} ]
}, {}, [ "ERQS_Controll", "ERQS_Player", "ERQS_RoomLoad", "ERQS_View", "ERQS_resultLose", "ERQS_resultWin", "FrameAnim " ]);