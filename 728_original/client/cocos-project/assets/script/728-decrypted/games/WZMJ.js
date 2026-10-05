window.__require = function e(t, o, i) {
function a(r, d) {
if (!o[r]) {
if (!t[r]) {
var c = r.split("/");
c = c[c.length - 1];
if (!t[c]) {
var s = "function" == typeof __require && __require;
if (!d && s) return s(c, !0);
if (n) return n(c, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = c;
}
var p = o[r] = {
exports: {}
};
t[r][0].call(p.exports, function(e) {
return a(t[r][1][e] || e);
}, p, p.exports, e, t, o, i);
}
return o[r].exports;
}
for (var n = "function" == typeof __require && __require, r = 0; r < i.length; r++) a(i[r]);
return a;
}({
WZMJ_Controll: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "36f6a01G6pMXIKpwXGMh0ca", "WZMJ_Controll");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("PokerTableBase"), a = e("WZMJ_Player"), n = e("WZMJ_View"), r = cc._decorator, d = r.ccclass, c = r.property, s = function(e) {
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
this.View = this.node.getComponent(n.default);
this.initMsgEvevt();
this.p_init();
};
t.prototype.p_roomInfo = function(e) {
var t = e.players;
for (var o in t) {
var i = t[o];
i.uid = o;
var a = this.getSeat(o);
i.seat = a;
var n = this.playerView[i.seat];
n.updatePlayerInfo(i);
e.banker == o ? n.updateZhuanView(!0) : n.updateZhuanView(!1);
i.playerView = n;
this.playerList[a] = i;
0 == a && (this.View.btnStart.active = 1 != i.ready);
e.game_status > 1 && e.game_status < 6 && (this.View.btnStart.active = !1);
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
this.View.maiNode.active = !0;
break;

case 3:
this.View.caishenid = e.money_card;
this.View.showCaiShenNum();
a = this.getSeat(e.turn.uid);
this.View.setDirction(a, e.time);
0 == a && (this.View.canPutCard = !0);
this.View.labelMjNum.node.parent.active = !0;
for (var o in e.players) if (o == wGameData.getKey("uid")) {
for (var r in e.players[o].place) for (var d = e.players[o].place[r], c = 0; c < d.length; c++) this.View.mainCardsData.place.push(d[c]);
this.View.updateMainMj(e.cards, this.View.mainCardsData.place);
this.View.updateMainChupai(e.players[o].outCards);
this.View.showAction(e.players[o].ready_do);
this.View.canPutCard = 1 == e.players[o].need_put;
this.View.isIntrust = 1 == e.players[o].intrust;
1 == e.players[o].intrust && (this.View.intrustNode.active = !0);
} else {
for (var r in e.players[o].place) {
d = e.players[o].place[r];
for (c = 0; c < d.length; c++) this.View.otherCardsData.place.push(d[c]);
}
this.View.updateOtherMj(e.players[o].cardsCount, this.View.otherCardsData.place);
this.View.updateOtherChupai(e.players[o].outCards);
}
}
};
t.prototype.p_quitGame = function() {
this.playerView[1].updatePlayerInfo(null);
this.node.getChildByName("nodeOther").active = !1;
};
t.prototype.p_upGameGold = function(e) {
this.playerList[0].gold = e;
this.playerList[0].playerView.setGold(e);
};
t.prototype.initMsgEvevt = function() {
for (var e = this, t = function(t) {
wGEvent.on(t, function(o) {
1 == o.status ? e[t](o.data) : console.error("evevt", o);
}, o);
}, o = this, i = 0, a = [ "Msg_WZMJ_StartGame", "Msg_WZMJ_Add", "Msg_WZMJ_Out", "Msg_WZMJ_Deing", "Msg_WZMJ_Mai", "Msg_WZMJ_CheckListen", "Msg_WZMJ_Listen", "Msg_WZMJ_Hua", "Msg_WZMJ_Flop", "Msg_WZMJ_PutListen", "Msg_WZMJ_ChangGold", "Msg_WZMJ_PutCard", "Msg_WZMJ_Deal", "Msg_WZMJ_ShowCards", "Msg_WZMJ_GoldChange", "Msg_GAME_ChangGold", "Msg_WZMJ_CHECK", "Msg_WZMJ_RUN", "Msg_WZMJ_InTrust", "Msg_WZMJ_Ready", "Msg_WZMJ_RefSinglePlayer" ]; i < a.length; i++) t(a[i]);
};
t.prototype.getSeat = function(e) {
return e == wGameData.getKey("uid") ? 0 : 1;
};
t.prototype.getPlayer = function(e) {
return this.playerList[this.getSeat(e)];
};
t.prototype.Msg_WZMJ_StartGame = function(e) {
this.state = 1;
this.roomInfo.banker = e.banker;
for (var t in this.playerList) {
var o = this.playerList[t], i = this.playerView[o.seat];
i.updateReady(!1);
e.banker == this.playerList[t].uid ? i.updateZhuanView(!0) : i.updateZhuanView(!1);
}
this.View.startGame(e);
};
t.prototype.Msg_WZMJ_Mai = function(e) {
var t = this.getSeat(e.uid), o = this.playerView[t], i = 0;
2 == e.is_mai ? i = 2 : 1 == e.is_mai && (i = this.roomInfo.banker == wGameData.getKey("uid") ? 1 : 0);
o.setQiPao(!0, i);
0 == t && (this.View.maiNode.active = !1);
};
t.prototype.Msg_WZMJ_Out = function(e) {
if (e.uid != wGameData.getKey("uid")) {
var t = e, o = this.getSeat(t.uid);
t.seat = o;
var i = this.playerView[t.seat];
i && i.updateOtherInfo(null);
}
};
t.prototype.Msg_WZMJ_Add = function(e) {
var t = e, o = this.getSeat(t.uid);
t.seat = o;
var i = this.playerView[t.seat];
i.updateOtherInfo(t);
t.playerView = i;
this.playerList[o] = t;
};
t.prototype.Msg_WZMJ_Deing = function(e) {
this.View.setFaCard(e);
for (var t in this.playerList) {
var o = this.playerList[t];
this.playerView[o.seat].setQiPao(!1, 0);
}
};
t.prototype.Msg_WZMJ_Flop = function(e) {
this.View.addCard(e);
};
t.prototype.Msg_WZMJ_PutCard = function(e) {
for (var t in e.uids) if (e.uids[t].ready_do) 0 == this.getSeat(t) && this.View.showAction(e.uids[t].ready_do); else if (t != wGameData.getKey("uid")) {
this.View.playOtherChupaiAni(e.uids[t].pid);
this.View.setDirction(0, e.time);
} else {
this.View.canPutCard = !1;
this.View.setDirction(1, e.time);
this.View.playMainChuPaiAni(e.uids[t].pid, 592, 78, !1);
}
};
t.prototype.sendMsgPutCard = function(e) {
wNetWork.send("Msg_WZMJ_PutCard", {
card: e
});
};
t.prototype.Msg_WZMJ_Deal = function(e) {
this.View.showDeal(e);
};
t.prototype.sendMsgDeal = function(e) {
wNetWork.send("Msg_WZMJ_Deal", {
do: e.do,
pid: e.pid
});
};
t.prototype.Msg_WZMJ_ShowCards = function(e) {
for (var t in e.uids) 0 == this.getSeat(t) ? this.View.updateMainMj(e.uids[t], this.View.mainCardsData.place) : this.View.showOtherCard(e.uids[t], this.View.otherCardsData.place);
};
t.prototype.Msg_WZMJ_GoldChange = function(e) {
cc.log("Msg_WZMJ_GoldChange");
cc.log(e);
for (var t in e.uids) {
var o = this.getPlayer(t);
o.gold = e.uids[t].gold;
o.playerView.setGold(e.uids[t].gold);
}
};
t.prototype.Msg_WZMJ_CHECK = function(e) {
cc.log("Msg_WZMJ_CHECK");
cc.log(e);
this.state = 0;
this.View.showResult(e);
};
t.prototype.Msg_WZMJ_RUN = function(e) {
cc.log("Msg_WZMJ_RUN");
cc.log(e);
};
t.prototype.Msg_WZMJ_InTrust = function(e) {
if (0 == this.getSeat(e.uid)) {
this.View.isIntrust = e.intrust;
1 == e.intrust && (this.View.intrustNode.active = !0);
}
};
t.prototype.sendInTrust = function(e) {
void 0 === e && (e = 0);
this.View.isIntrust && wNetWork.send("Msg_WZMJ_InTrust", {
intrust: e
});
};
t.prototype.Msg_WZMJ_Ready = function(e) {
e.uid == wGameData.getKey("uid") && this.View.initNode();
var t = this.getSeat(e.uid);
this.playerView[t].updateReady(!0);
0 == t && (this.View.btnStart.active = !1);
};
t.prototype.Msg_WZMJ_RefSinglePlayer = function(e) {
cc.log("Msg_WZMJ_RefSinglePlayer");
cc.log(e);
};
t.prototype.Msg_WZMJ_PutListen = function() {};
t.prototype.Msg_WZMJ_Listen = function() {};
t.prototype.Msg_WZMJ_CheckListen = function() {};
t.prototype.Msg_WZMJ_ChangGold = function() {};
t.prototype.Msg_GAME_ChangGold = function(e) {
var t = this.getPlayer(e.uid);
t.gold = e.gold;
t.playerView.setGold(e.gold);
};
__decorate([ c(a.default) ], t.prototype, "playerView", void 0);
return __decorate([ d ], t);
}(i.default);
o.default = s;
cc._RF.pop();
}, {
PokerTableBase: void 0,
WZMJ_Player: "WZMJ_Player",
WZMJ_View: "WZMJ_View"
} ],
WZMJ_FrameAnim: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "d01e3pdYF1HxLIVglZ5330O", "WZMJ_FrameAnim");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, a = i.ccclass, n = i.property, r = function(e) {
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
__decorate([ n({
type: [ cc.SpriteFrame ],
tooltip: "帧动画图片数组"
}) ], t.prototype, "spriteFrames", void 0);
__decorate([ n({
tooltip: "每一帧的时长"
}) ], t.prototype, "duration", void 0);
__decorate([ n({
tooltip: "是否循环播放"
}) ], t.prototype, "loop", void 0);
__decorate([ n({
tooltip: "是否在加载的时候就开始播放"
}) ], t.prototype, "playOnload", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {} ],
WZMJ_Player: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "9343bJB2ldIPJJmOeS51XcB", "WZMJ_Player");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, a = i.ccclass, n = i.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.spriteHead = null;
t.labelName = null;
t.labelGold = null;
t.spriteZhuan = null;
t.spriteReady = null;
t.qipao = null;
t.qipaoSprite = null;
t.qipaoImg = [];
return t;
}
t.prototype.onLoad = function() {
this.spriteZhuan.node.active = !1;
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
t.prototype.setGold = function(e, t) {
void 0 === t && (t = !1);
this.labelGold.string = wUtils.goldFormat(e);
if (t) {
var o = cc.scaleTo(.3, 1.3), i = cc.delayTime(.3), a = cc.scaleTo(.3, 1), n = cc.sequence(o, i, a);
this.labelGold.node.runAction(n);
}
};
t.prototype.updateZhuanView = function(e) {
this.spriteZhuan.node.active = e;
};
t.prototype.updateReady = function(e) {
this.spriteReady.node.active = e;
};
t.prototype.updateOtherInfo = function(e) {
if (e) {
this.node.active = !0;
this.labelName.string = e.nickname;
wUIHelp.setHead(this.spriteHead, e.headimgurl, !0);
this.setGold(e.gold);
} else this.node.active = !1;
};
t.prototype.setQiPao = function(e, t) {
this.qipao.active = e;
this.qipaoSprite.spriteFrame = this.qipaoImg[t];
};
__decorate([ n(cc.Sprite) ], t.prototype, "spriteHead", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelName", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelGold", void 0);
__decorate([ n(cc.Sprite) ], t.prototype, "spriteZhuan", void 0);
__decorate([ n(cc.Sprite) ], t.prototype, "spriteReady", void 0);
__decorate([ n(cc.Node) ], t.prototype, "qipao", void 0);
__decorate([ n(cc.Sprite) ], t.prototype, "qipaoSprite", void 0);
__decorate([ n([ cc.SpriteFrame ]) ], t.prototype, "qipaoImg", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {} ],
WZMJ_RoomLoad: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "c69f9NHB/NFRptCAsU9WMmk", "WZMJ_RoomLoad");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("Config"), a = cc._decorator, n = a.ccclass, r = a.property, d = function(e) {
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
for (var o = 0; o < 4; o++) e.content.getChildByName("" + o).getChildByName("difen").getComponent(cc.Label).string = "准入" + t[o + 1].min_gold;
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
var t = e.content, o = e.isAnim ? e.room.getChildByName("scrollView") : e.room;
o.opacity = 0;
var i = cc.fadeTo(.2, 255);
o.runAction(i);
for (var a = 1; a < t.childrenCount; a++) {
var n = t.children[a];
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
var o = this.load.getChildByName("logo");
o.y = 150;
var i = cc.moveTo(.15, cc.v2(0, 0)), a = cc.fadeTo(.1, 255), n = cc.delayTime(.05), r = cc.fadeTo(.06, 0), d = cc.moveTo(.1, cc.v2(0, 150)), c = cc.callFunc(function() {
e.load.active = !1;
}), s = cc.sequence(cc.spawn(i, a), n, cc.spawn(r, d), c);
o.runAction(s);
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
var o = this.room.getChildByName("scrollView"), i = cc.fadeTo(.15, 0), a = cc.callFunc(function() {
o.opacity = 255;
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
o.runAction(cc.sequence(i, a));
for (var n = function(e) {
var o = t.children[e], i = cc.v2(o.x, o.y), a = cc.moveBy(.2, cc.v2(250, 0)), n = cc.callFunc(function() {
o.setPosition(i);
});
o.runAction(cc.sequence(a, n));
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
var o = wGameData.roomConfig[e];
if (o) if (o.min_gold > wGameData.getKey("gold")) wUIManager.enterRoomFailTips(o.min_gold); else if (wGameData.gameRepair()) wUIManager.showTips("游戏维护中"); else {
this.isEnterRoom = !0;
var i = wGEvent.on("Msg_Hall_EnterGame", function(e) {
t.Msg_Hall_EnterGame(e);
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
wNetWork.send("Msg_Hall_EnterGame", {
tableid: 0,
gtype: Number(wGameData.gameID),
level: e
});
} else wUIManager.showTips("游戏配置错误，请重新进入游戏！");
}
};
t.prototype.faststart = function() {
var e = wGameData.getKey("gold"), t = wGameData.roomConfig, o = 1;
for (var i in t) Object.prototype.hasOwnProperty.call(t, i) && "5" != i && t[i].min_gold <= e && (o = t[i].level);
this.enterRoom(o);
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
var e = this, t = i.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(t.prefabUrl, function() {}, function(t, o) {
if (t) wLog.e(t); else {
wViewMgr.openGame(o);
e.scheduleOnce(function() {
e.exitAnim();
});
}
}, t.enName);
};
t.prototype.preloadGameRes = function() {
var e = i.Config.GamePrefab[wGameData.gameID];
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
o.default = d;
cc._RF.pop();
}, {
Config: void 0
} ],
WZMJ_TableSelect: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "7d360J9GotCk5uQauuhMP7h", "WZMJ_TableSelect");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, a = i.ccclass, n = i.property, r = function(e) {
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
var o = {
tableID: t,
player: e[t].players,
status: e[t].status
};
this.tableList[t] = o;
this.initItem(o);
}
};
t.prototype.initItem = function(e) {
var t = e.tableID, o = this.content.getChildByName("" + t);
if (!o) {
o = cc.instantiate(this.copyItem);
this.content.addChild(o, 1, "" + t);
}
o.getChildByName("idx").getComponent(cc.Label).string = e.tableID < 10 ? "0" + e.tableID : e.tableID;
for (var i = 0; i < 2; i++) {
var a = o.getChildByName("player" + i);
a.getChildByName("info").active = !1;
a.getChildByName("zw").active = !0;
}
for (var n in e.player) if (Object.prototype.hasOwnProperty.call(e.player, n)) {
var r = o.getChildByName("player" + (Number(n) - 1));
wUIHelp.setHead(cc.find("info/head", r), e.player[n].head, !0);
cc.find("info/name", r).getComponent(cc.Label).string = wUtils.handleNameLen(e.player[n].nickname, 8);
cc.find("info/zb", r).active = 0 == e.status;
r.getChildByName("info").active = !0;
r.getChildByName("zw").active = !1;
}
o.stopAllActions();
o.active = !0;
o.getChildByName("bg").tableID = e.tableID;
var d = o.getChildByName("state");
d.active = Object.keys(e.player).length >= this.maxTableNum && 1 == e.status;
if (d.active) for (var n in e.player) if (Object.prototype.hasOwnProperty.call(e.player, n)) {
r = o.getChildByName("player" + (Number(n) - 1));
cc.find("info/zb", r).active = !1;
}
};
t.prototype.kuStartSend = function() {
for (var e = [], t = -1, o = 1; o <= wConstant.maxTable; o++) {
var i = this.tableList[o];
Object.keys(i.player).length < this.maxTableNum && e.push(i);
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
__decorate([ n([ cc.SpriteFrame ]) ], t.prototype, "titleImg", void 0);
__decorate([ n(cc.Sprite) ], t.prototype, "title", void 0);
__decorate([ n(cc.Node) ], t.prototype, "content", void 0);
__decorate([ n(cc.Node) ], t.prototype, "copyItem", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {} ],
WZMJ_View: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "d409eH7L2hC6KmRZteCbW5O", "WZMJ_View");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("Config"), a = e("WZMJ_Controll"), n = e("WZMJ_FrameAnim"), r = cc._decorator, d = r.ccclass, c = r.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.btnMaiSprite = null;
t.tips1 = null;
t.tips2 = null;
t.tips3 = null;
t.intrustNode = null;
t.maiNode = null;
t.mjNumNode = null;
t.labelMjNum = null;
t.caishenNode = null;
t.caishenBG = null;
t.caishenNum = null;
t.nodeCaiShenAni = null;
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
t.nodeMainPlayer = null;
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
t.nodeOtherMjGang5 = null;
t.nodeOtherMjGang5_1 = null;
t.nodeOtherMjGang5_2 = null;
t.nodeOtherMjGang5_3 = null;
t.nodeOtherMjGang5_4 = null;
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
t.nodeOtherMj15 = null;
t.nodeOtherMj16 = null;
t.nodeOtherMj17 = null;
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
t.nodeOtherShowCard15 = null;
t.nodeOtherShowCard16 = null;
t.nodeOtherShowCard17 = null;
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
t.nodeOtherChupai27 = null;
t.nodeOtherChupai28 = null;
t.nodeOtherChupai29 = null;
t.nodeOtherChupai30 = null;
t.nodeOtherChupai31 = null;
t.nodeOtherChupai32 = null;
t.nodeOtherChupai33 = null;
t.nodeOtherChupai34 = null;
t.nodeOtherChupai35 = null;
t.nodeOtherChupai36 = null;
t.nodeOtherChupai37 = null;
t.nodeOtherChupai38 = null;
t.nodeOtherChupai39 = null;
t.nodeOtherChupai40 = null;
t.nodeOtherChupai41 = null;
t.nodeOtherChupai42 = null;
t.nodeOtherChupai43 = null;
t.nodeOtherChupai44 = null;
t.nodeOtherChupai45 = null;
t.nodeOtherChupai46 = null;
t.nodeOtherChupai47 = null;
t.nodeOtherChupai48 = null;
t.nodeOtherChupai49 = null;
t.nodeOtherChupai50 = null;
t.nodeOtherChupai51 = null;
t.nodeOtherChupai52 = null;
t.nodeOtherChupai53 = null;
t.nodeOtherChupai54 = null;
t.nodeOtherChupai55 = null;
t.nodeOtherChupai56 = null;
t.nodeOtherChupai57 = null;
t.nodeOtherChupai58 = null;
t.nodeOtherChupai59 = null;
t.nodeOtherChupai60 = null;
t.nodeOtherChupai61 = null;
t.nodeOtherChupai62 = null;
t.nodeOtherChupai63 = null;
t.nodeOtherChupai64 = null;
t.skeletonOtherPaitisi = null;
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
t.nodeMainChupai27 = null;
t.nodeMainChupai28 = null;
t.nodeMainChupai29 = null;
t.nodeMainChupai30 = null;
t.nodeMainChupai31 = null;
t.nodeMainChupai32 = null;
t.nodeMainChupai33 = null;
t.nodeMainChupai34 = null;
t.nodeMainChupai35 = null;
t.nodeMainChupai36 = null;
t.nodeMainChupai37 = null;
t.nodeMainChupai38 = null;
t.nodeMainChupai39 = null;
t.nodeMainChupai40 = null;
t.nodeMainChupai41 = null;
t.nodeMainChupai42 = null;
t.nodeMainChupai43 = null;
t.nodeMainChupai44 = null;
t.nodeMainChupai45 = null;
t.nodeMainChupai46 = null;
t.nodeMainChupai47 = null;
t.nodeMainChupai48 = null;
t.nodeMainChupai49 = null;
t.nodeMainChupai50 = null;
t.nodeMainChupai51 = null;
t.nodeMainChupai52 = null;
t.nodeMainChupai53 = null;
t.nodeMainChupai54 = null;
t.nodeMainChupai55 = null;
t.nodeMainChupai56 = null;
t.nodeMainChupai57 = null;
t.nodeMainChupai58 = null;
t.nodeMainChupai59 = null;
t.nodeMainChupai60 = null;
t.nodeMainChupai61 = null;
t.nodeMainChupai62 = null;
t.nodeMainChupai63 = null;
t.nodeMainChupai64 = null;
t.skeletonMainPaitisi = null;
t.nodeMainChupaiAni = null;
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
t.nodeMainMjGang5 = null;
t.nodeMainMjGang5_1 = null;
t.nodeMainMjGang5_2 = null;
t.nodeMainMjGang5_3 = null;
t.nodeMainMjGang5_4 = null;
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
t.nodeMainMj15 = null;
t.nodeMainMj16 = null;
t.nodeMainMj17 = null;
t.nodeMainMjAni = null;
t.btnClickMj = null;
t.nodeMainAction = null;
t.btnMainGuo = null;
t.btnMainChi = null;
t.btnMainPeng = null;
t.btnMainGang = null;
t.btnMainHu = null;
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
t.skeletonCaiShen = null;
t.skeletonChi = null;
t.skeletonLongjuanPai = null;
t.skeletonGang = null;
t.skeletonHu = null;
t.skeletonLiuju = null;
t.skeletonPeng = null;
t.skeletonZimo = null;
t.skeletonLuoxuan = null;
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
t.skeletonHucard = null;
t.spriteFrameMaidi = null;
t.spriteFrameDingdi = null;
t.mjPositionData = [];
t.nodeSelectMj = null;
t.startNodePosition = null;
t.startPosition = null;
t.mainCardsData = {
cards: [],
place: []
};
t.mainChupaiData = [];
t.otherCardsData = {
cardscount: 0,
place: []
};
t.otherChupaiData = [];
t.controll = null;
t.mainDirectionSpirte = [];
t.otherDirectionSpirte = [];
t.lastMjNum = 0;
t.countdown = 0;
t.totalcount = 64;
t.putpid = 0;
t.canPutCard = !1;
t.cardid = 0;
t.isIntrust = !1;
t.caishenid = 0;
t.hucard = 0;
t.cardtype = {
ruanpai: "软牌",
yingpai: "硬牌",
shuangfan: "双番",
caishen: "财神",
yingbaidui: "硬八对",
tainhu: "天胡",
dihu: "地胡",
dandiao: "单吊",
pengpenghu: "碰碰和"
};
return t;
}
t.prototype.onLoad = function() {
cc.log("WZMJ_View onLoad");
this.controll = this.node.getComponent(a.default);
this.initNode();
this.nodeOtherPlayer.active = !1;
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
for (var t = e.getLocation(), o = this.nodeMainMj.convertToNodeSpaceAR(t), i = 1; i <= 17; i++) {
var a = this["nodeMainMj" + i];
if (Math.abs(a.x - o.x) < 44 && Math.abs(a.y - o.y) < 64 && a.active) {
this.nodeSelectMj = a;
this.startNodePosition = cc.v2(a.x, a.y);
this.startPosition = o;
break;
}
}
};
t.prototype.onClickMove = function(e) {
var t = e.getLocation(), o = this.nodeMainMj.convertToNodeSpaceAR(t);
if (null != this.startPosition && this.nodeSelectMj) {
this.nodeSelectMj.x = this.startNodePosition.x + (o.x - this.startPosition.x);
this.nodeSelectMj.y = this.startNodePosition.y + (o.y - this.startPosition.y);
}
};
t.prototype.onClickEnd = function(e) {
var t = e.getLocation(), o = this.nodeMainMj.convertToNodeSpaceAR(t);
if (this.nodeSelectMj) if (o.y < 180) if (null != this.startPosition && Math.abs(o.x - this.startPosition.x) < 5 && Math.abs(o.y - this.startPosition.y) < 5 && !0 === this.canPutCard) if (78 == this.startNodePosition.y) {
for (var i = 1; i <= 17; i++) this["nodeMainMj" + i].y = 78;
this.nodeSelectMj.y = 88;
this.nodeSelectMj.x = this.startNodePosition.x;
} else if (88 == this.startNodePosition.y && this.nodeSelectMj.pid == this.caishenid) {
for (i = 1; i <= 17; i++) {
this["nodeMainMj" + i].y = 78;
this["nodeMainMj" + i].x = this.mjPositionData[i - 1].x;
}
this.showTips(1);
this.nodeSelectMj = null;
} else if (88 != this.startNodePosition.y || this.checkCanPut(this.nodeSelectMj.pid)) {
cc.log("出牌:" + this.nodeSelectMj.pid);
this.canPutCard = !1;
var a = this.nodeSelectMj.pid;
this.nodeSelectMj.x;
this.controll.sendMsgPutCard(a);
} else {
for (i = 1; i <= 17; i++) {
this["nodeMainMj" + i].y = 78;
this["nodeMainMj" + i].x = this.mjPositionData[i - 1].x;
}
this.showTips(2);
this.nodeSelectMj = null;
} else for (i = 1; i <= 17; i++) {
this["nodeMainMj" + i].y = 78;
this["nodeMainMj" + i].x = this.mjPositionData[i - 1].x;
} else if (this.nodeSelectMj.pid == this.caishenid) {
for (i = 1; i <= 17; i++) {
this["nodeMainMj" + i].y = 78;
this["nodeMainMj" + i].x = this.mjPositionData[i - 1].x;
}
this.showTips(1);
this.nodeSelectMj = null;
} else if (this.checkCanPut(this.nodeSelectMj.pid)) if (!1 === this.canPutCard) {
for (i = 1; i <= 14; i++) {
this["nodeMainMj" + i].y = 78;
this["nodeMainMj" + i].x = this.mjPositionData[i - 1].x;
}
this.nodeSelectMj = null;
} else {
cc.log("出牌:" + this.nodeSelectMj.pid);
a = this.nodeSelectMj.pid;
this.nodeSelectMj.x;
this.nodeSelectMj.y;
this.controll.sendMsgPutCard(a);
} else {
for (i = 1; i <= 17; i++) {
this["nodeMainMj" + i].y = 78;
this["nodeMainMj" + i].x = this.mjPositionData[i - 1].x;
}
this.showTips(2);
this.nodeSelectMj = null;
}
this.startPosition = null;
this.startNodePosition = null;
};
t.prototype.checkCanPut = function(e) {
var t = this.checkMainCard();
if (e > 40 && 1 == t[e]) return !0;
for (var o in t) if (1 == t[o]) return !1;
return !0;
};
t.prototype.checkMainCard = function() {
for (var e = [], t = 0; t < this.mainCardsData.cards.length; t++) 43 != this.caishenid && this.caishenid < 40 ? this.mainCardsData.cards[t] > 40 && this.mainCardsData.cards[t] != this.caishenid && 43 != this.mainCardsData.cards[t] && e.push(this.mainCardsData.cards[t]) : this.mainCardsData.cards[t] > 40 && this.mainCardsData.cards[t] != this.caishenid && e.push(this.mainCardsData.cards[t]);
var o = {
41: 0,
42: 0,
43: 0,
51: 0,
52: 0,
53: 0,
54: 0
};
for (t = 0; t < e.length; t++) for (var i in o) i == e[t] && o[i]++;
return o;
};
t.prototype.playMainChuPaiAni = function(e, t, o, i) {
var a = this;
this.nodeMainAction.active = !1;
var n = 17;
if (0 == i) if (null == this.nodeSelectMj) n = 17; else {
this.nodeSelectMj.active = !1;
n = parseInt(this.nodeSelectMj.name.substring(6));
this.nodeSelectMj = null;
}
this.nodeMainChupaiAni.stopAllActions();
this.nodeMainChupaiAni.x = t;
this.nodeMainChupaiAni.y = o;
this.nodeMainChupaiAni.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e);
this.nodeMainChupaiAni.active = !0;
var r = this["nodeMainChupai" + (this.mainChupaiData.length + 1)].x + this.nodeMainChupai.x, d = this["nodeMainChupai" + (this.mainChupaiData.length + 1)].y + this.nodeMainChupai.y;
this.nodeMainChupaiAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(.1, 1), cc.moveTo(.1, r, d)), cc.callFunc(function() {
a.skeletonOtherPaitisi.node.active = !1;
a.skeletonMainPaitisi.node.active = !0;
a.skeletonMainPaitisi.setAnimation(0, "animation", !0);
a.skeletonMainPaitisi.node.setPosition(cc.v2(a["nodeMainChupai" + (a.mainChupaiData.length + 1)].x, a["nodeMainChupai" + (a.mainChupaiData.length + 1)].y + 50));
var t = a.mainChupaiData;
t.push(e);
a.updateMainChupai(t);
for (var o = a.mainCardsData.cards[a.mainCardsData.cards.length - 1], i = 0; i < a.mainCardsData.cards.length; i++) if (e == a.mainCardsData.cards[i]) {
a.mainCardsData.cards.splice(i, 1);
break;
}
var r = a.mainCardsData.cards, d = a.mainCardsData.place;
if (17 != n) {
var c = 17 - 3 * d.length, s = [];
for (i = 0; i < c - 1; i++) i < r.length && s.push(r[i]);
s.sort(function(e, t) {
return e - t;
});
var p = [];
for (i = 0; i < s.length; i++) s[i] < 40 && p.push(s[i]);
for (i = 0; i < s.length; i++) s[i] > 50 && s[i] < 55 && p.push(s[i]);
for (i = 0; i < s.length; i++) s[i] > 40 && s[i] < 44 && p.push(s[i]);
p = a.sortMainCard(p);
r = p;
var h = -1;
for (i = 0; i < r.length; i++) if (r[i] == o) {
h = i + 3 * d.length;
break;
}
var l = function(e) {
if (e < 3 * d.length) a["nodeMainMj" + (e + 1)].active = !1; else if (e < r.length + 3 * d.length) {
a["nodeMainMj" + (e + 1)].active = !0;
a["nodeMainMj" + (e + 1)].x = a.mjPositionData[e].x;
a["nodeMainMj" + (e + 1)].y = a.mjPositionData[e].y;
a["nodeMainMj" + (e + 1)].pid = r[e - 3 * d.length];
a["nodeMainMj" + (e + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = a.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + r[e - 3 * d.length]);
r[e - 3 * d.length] == a.caishenid ? a["nodeMainMj" + (e + 1)].getChildByName("caishen").active = !0 : a["nodeMainMj" + (e + 1)].getChildByName("caishen").active = !1;
if (h == e) {
a["nodeMainMj" + (e + 1)].active = !1;
a.nodeMainMjAni.stopAllActions();
a.nodeMainMjAni.active = !0;
a.nodeMainMjAni.x = a.mjPositionData[16].x;
a.nodeMainMjAni.y = a.mjPositionData[16].y;
a.nodeMainMjAni.angle = 0;
a.nodeMainMjAni.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = a.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + r[e - 3 * d.length]);
a.nodeMainMjAni.runAction(cc.sequence(cc.spawn(cc.moveBy(.167, 0, 78), cc.rotateTo(.167, 20)), cc.moveBy(.1, a.mjPositionData[e].x - a.mjPositionData[16].x, 0), cc.spawn(cc.moveBy(.167, 0, -78), cc.rotateTo(.167, 0)), cc.callFunc(function() {
a["nodeMainMj" + (e + 1)].active = !0;
a.nodeMainMjAni.active = !1;
})));
}
} else a["nodeMainMj" + (e + 1)].active = !1;
};
for (i = 0; i < 17; i++) l(i);
} else a.updateMainMj(r, d);
a.nodeMainChupaiAni.active = !1;
})));
cc.log(this.mainCardsData.cards);
wAudioMgr.playSound("sound/card_" + e + "_0", "WZMJ");
};
t.prototype.playOtherChupaiAni = function(e) {
var t = this;
this.putpid = e;
this.updateOtherMj(this.otherCardsData.cardscount - 1, this.otherCardsData.place);
this.nodeOtherChupaiAni.stopAllActions();
this.nodeOtherChupaiAni.x = -365;
this.nodeOtherChupaiAni.y = 0;
this.nodeOtherChupaiAni.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e);
this.nodeOtherChupaiAni.active = !0;
var o = this["nodeOtherChupai" + (this.otherChupaiData.length + 1)].x + this.nodeOtherChupai.x, i = this["nodeOtherChupai" + (this.otherChupaiData.length + 1)].y + this.nodeOtherChupai.y;
this.nodeOtherChupaiAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(.2, 1), cc.moveTo(.2, o, i)), cc.callFunc(function() {
var o = t.otherChupaiData;
o.push(e);
t.updateOtherChupai(o);
t.nodeOtherChupaiAni.active = !1;
t.skeletonMainPaitisi.node.active = !1;
t.skeletonOtherPaitisi.node.active = !0;
t.skeletonOtherPaitisi.setAnimation(0, "animation", !0);
t.skeletonOtherPaitisi.node.setPosition(cc.v2(t["nodeOtherChupai" + t.otherChupaiData.length].x, t["nodeOtherChupai" + t.otherChupaiData.length].y + 50));
})));
wAudioMgr.playSound("sound/card_" + e + "_0", "WZMJ");
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
cc.log("WZMJ_view onClick:" + t);
var o = 0;
switch (t) {
case "guo":
o = -99;
wNetWork.send("Msg_WZMJ_Deal", {
do: o
}, !0);
this.nodeMainAction.active = !1;
this.canPutCard = !0;
this.controll.sendInTrust();
break;

case "chi":
o = 6;
this.showChiView();
this.nodeMainAction.active = !1;
this.controll.sendInTrust();
break;

case "peng":
o = 5;
wNetWork.send("Msg_WZMJ_Deal", {
do: o,
pid: this.waitpengcard
}, !0);
this.nodeMainAction.active = !1;
this.controll.sendInTrust();
break;

case "gang":
o = 3;
wNetWork.send("Msg_WZMJ_Deal", {
do: o,
pid: this.waitgangcard
}, !0);
this.nodeMainAction.active = !1;
this.controll.sendInTrust();
break;

case "hu":
o = 2;
this.controll.sendInTrust();
wNetWork.send("Msg_WZMJ_Deal", {
do: o,
pid: this.waithucard
}, !0);
this.nodeMainAction.active = !1;
break;

case "chiguo":
this.nodeMainChi.active = !1;
this.nodeMainAction.active = !0;
this.controll.sendInTrust();
break;

case "chi1":
o = 6;
wNetWork.send("Msg_WZMJ_Deal", {
do: o,
pid: this.chicard[0]
}, !0);
this.nodeMainChi.active = !1;
this.controll.sendInTrust();
break;

case "chi2":
o = 6;
wNetWork.send("Msg_WZMJ_Deal", {
do: o,
pid: this.chicard[1]
}, !0);
this.nodeMainChi.active = !1;
this.controll.sendInTrust();
break;

case "chi3":
o = 6;
wNetWork.send("Msg_WZMJ_Deal", {
do: o,
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
bundle: "WZMJ"
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
wNetWork.send("Msg_WZMJ_Out", [], !0);
break;

case "start":
wAudioMgr.playCloseSound();
wNetWork.send("Msg_WZMJ_Ready", {
ready: !0
});
break;

case "mai":
wAudioMgr.playCloseSound();
wNetWork.send("Msg_WZMJ_Mai", {
is_mai: 1
}, !0);
break;

case "bumai":
wAudioMgr.playCloseSound();
wNetWork.send("Msg_WZMJ_Mai", {
is_mai: 2
}, !0);
break;

case "intrust":
this.controll.sendInTrust(0);
this.intrustNode.active = !1;
}
};
t.prototype.hideMenuNode = function() {
var e = this;
cc.log("hideMenuNode");
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
this.lastMjNum = 135;
this.labelMjNum.node.parent.active = !0;
this.labelMjNum.string = "135";
this.controll.state = 3;
this.nodeDice.active = !0;
for (var o = this.random(1, 7), i = this.random(1, 7), a = [], r = 0; r < 31; r++) a[r] = r < 9 ? this.spriteAtlasDice.getSpriteFrame("star_anim_" + o + "_00" + (r + 1)) : this.spriteAtlasDice.getSpriteFrame("star_anim_" + i + "_0" + (r + 1));
var d = this.nodeDice1.getComponent(n.default);
d.updateSpriteFrames(a);
d.playOnce(function() {
t.showCaiShen(e);
t.nodeDice.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
t.nodeDice.active = !1;
})));
});
var c = [];
for (r = 0; r < 31; r++) c[r] = r < 9 ? this.spriteAtlasDice.getSpriteFrame("star_anim_" + o + "_00" + (r + 1)) : this.spriteAtlasDice.getSpriteFrame("star_anim_" + o + "_0" + (r + 1));
var s = this.nodeDice2.getComponent(n.default);
s.updateSpriteFrames(c);
s.playOnce();
};
t.prototype.playFaCardAni = function(e) {
var t = this;
this.nodeCardAni.active = !0;
this.nodeMainMj.active = !1;
this.nodeMainChupai.active = !1;
cc.winSize.width < 1334 ? this.nodeCardAni.scale = 1334 / cc.winSize.width : this.nodeCardAni.scale = 1;
this.nodeCardAniReal.destroyAllChildren();
for (var o = function(e) {
var o = cc.instantiate(i.spriteCardAni.node);
o.active = !0;
o.scale = .3;
o.opacity = 1;
o.x = 3 * e - 33;
o.y = 335;
i.nodeCardAniReal.addChild(o);
o.runAction(cc.sequence(cc.delayTime(.25 * Math.floor(e / 4)), cc.callFunc(function() {
o.opacity = 255;
t.lastMjNum -= 2;
t.labelMjNum.string = t.lastMjNum.toString();
e % 4 == 1 && wAudioMgr.playSound("sound/fa1", "WZMJ");
}), cc.spawn(cc.scaleTo(.25, 1), cc.moveTo(.25, 77.3 * (e - 1) - 628, 80))));
o.runAction(cc.sequence(cc.delayTime(1 + .033 * e), cc.callFunc(function() {
e % 4 == 1 && wAudioMgr.playSound("sound/fa2", "WZMJ");
}), cc.scaleTo(.033, 1.1), cc.scaleTo(.033, 1)));
}, i = this, a = 1; a <= 16; a++) o(a);
this.node.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function() {
e && e();
})));
};
t.prototype.showCaiShen = function(e) {
var t = this;
cc.log("showCaiShen");
this.nodeCaiShenAni.stopAllActions();
this.nodeCaiShenAni.scale = .1;
this.nodeCaiShenAni.x = 7;
this.nodeCaiShenAni.y = 5;
this.nodeCaiShenAni.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + this.caishenid);
this.nodeCaiShenAni.active = !0;
this.caishenNode.active = !0;
var o = this.caishenNode.x, i = this.caishenNode.y;
this.playSkeletonAni(this.skeletonCaiShen, !1, !0);
this.nodeCaiShenAni.runAction(cc.sequence(cc.scaleTo(.2, 1.5), cc.scaleTo(.3, 1), cc.moveTo(.5, o, i), cc.callFunc(function() {
t.nodeCaiShenAni.active = !1;
t.caishenBG.active = !0;
t.playFaCardAni(e);
t.caishenNum.node.active = !0;
t.caishenNum.getComponent(cc.Sprite).spriteFrame = t.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + t.caishenid);
})));
};
t.prototype.showCaiShenNum = function() {
this.caishenNode.active = !0;
this.caishenBG.active = !0;
this.caishenNum.node.active = !0;
this.caishenNum.getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + this.caishenid);
};
t.prototype.showFaCardReal = function(e, t) {
cc.log("WZMJ_View showFaCardReal");
cc.log(e);
this.updateMainMj(e, t);
this.updateMainChupai([]);
for (var o in e.uids) {
var i = e.uids[o];
1 == this.controll.getSeat(o) && this.updateOtherMj(i, []);
}
};
t.prototype.setFaCard = function(e) {
var t = this;
this.mainCardsData.cards = e.cards;
this.mainCardsData.place = [];
this.caishenid = e.money_card;
this.maiNode.active = !1;
var o = this.controll.getSeat(this.controll.roomInfo.banker);
this.mjNumNode.active = !0;
this.setDirction(o, 15);
this.showDiceAni(function() {
t.showFaCardReal(t.mainCardsData.cards, []);
t.controll.roomInfo.banker == wGameData.getKey("uid") ? t.updateOtherMj(16, []) : t.updateOtherMj(17, []);
t.controll.state = 4;
});
};
t.prototype.initNode = function() {
cc.log("initNode");
this.mjPositionData = [ cc.v2(-628, 78), cc.v2(-553, 78), cc.v2(-478, 78), cc.v2(-403, 78), cc.v2(-328, 78), cc.v2(-253, 78), cc.v2(-178, 78), cc.v2(-103, 78), cc.v2(-28, 78), cc.v2(47, 78), cc.v2(122, 78), cc.v2(197, 78), cc.v2(272, 78), cc.v2(347, 78), cc.v2(422, 78), cc.v2(497, 78), cc.v2(592, 78) ];
this.spriteDirctionTopBg.node.active = !1;
this.spriteDirctionTop.node.active = !1;
this.spriteDirctionBottomBg.node.active = !1;
this.spriteDirctionBottom.node.active = !1;
this.labelMjNum.node.parent.active = !1;
this.nodeMainPlayer.active = !0;
this.spriteMainZhuan.node.active = !1;
this.nodeMain.active = !0;
this.nodeMainChupai.active = !0;
this.nodeMainHuCard.active = !1;
this.nodeOtherHuCard.active = !1;
for (var e = 1; e <= this.totalcount; e++) this["nodeMainChupai" + e].active = !1;
this.skeletonMainPaitisi.node.active = !1;
this.nodeMainMj.active = !0;
for (e = 1; e <= 5; e++) this["nodeMainMjGang" + e].active = !1;
for (e = 1; e <= 17; e++) this["nodeMainMj" + e].active = !1;
this.nodeMainMjAni.active = !1;
this.nodeMainAction.active = !1;
this.nodeMainChi.active = !1;
this.nodeOther.active = !0;
this.nodeOtherChupai.active = !0;
for (e = 1; e <= this.totalcount; e++) this["nodeOtherChupai" + e].active = !1;
this.skeletonOtherPaitisi.node.active = !1;
this.nodeOtherMj.active = !0;
for (e = 1; e <= 5; e++) this["nodeOtherMjGang" + e].active = !1;
for (e = 1; e <= 17; e++) this["nodeOtherMj" + e].active = !1;
for (e = 1; e <= 17; e++) this["nodeOtherShowCard" + e].active = !1;
this.nodeOtherChupaiAni.active = !1;
this.btnMenu.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrameMenuNormal;
this.btnMenuClose.node.active = !1;
this.nodeMenuMask.active = !1;
this.btnMenuClose.node.active = !1;
this.nodeMenuMask.active = !1;
this.mainCardsData.cards = [];
this.mainCardsData.place = [];
this.mainChupaiData = [];
this.otherCardsData.cardscount = 0;
this.otherCardsData.place = [];
this.otherChupaiData = [];
this.lastMjNum = 0;
this.cardid = 0;
this.chicard = [];
this.waitgangcard = 0;
this.waitpengcard = 0;
this.waithucard = 0;
this.canPutCard = !1;
this.putpid = 0;
this.maiNode.active = !1;
this.mjNumNode.active = !1;
this.caishenNode.active = !1;
this.caishenBG.active = !1;
this.intrustNode.active = !1;
this.tips1.active = !1;
this.tips2.active = !1;
this.tips3.active = !1;
this.caishenNum.node.active = !1;
for (e = 0; e < 2; e++) this.controll.playerView[e].updateZhuanView(!1);
};
t.prototype.setRoomInfo = function(e) {
this.labelMjNum.string = e.cards_last;
this.lastMjNum = e.cards_last;
this.labelCountDown.string = "15";
this.setCountDown(15);
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
t.prototype.sortMainCard = function(e) {
for (var t = 0, o = 0, i = 0; i < 4; i++) for (var a = 0; a < e.length; a++) if (43 == e[a]) {
o++;
e.splice(a, 1);
} else if (e[a] == this.caishenid) {
t++;
e.splice(a, 1);
}
var n = [];
if (43 != this.caishenid) {
for (a = 0; a < t; a++) n.push(this.caishenid);
for (a = 0; a < e.length; a++) e[a] < this.caishenid && n.push(e[a]);
for (a = 0; a < o; a++) n.push(43);
for (a = 0; a < e.length; a++) e[a] > this.caishenid && n.push(e[a]);
} else {
for (a = 0; a < e.length; a++) e[a] < this.caishenid ? n.push(e[a]) : e[a] > this.caishenid && n.push(e[a]);
for (a = 0; a < t; a++) n.push(this.caishenid);
}
return n;
};
t.prototype.updateMainMj = function(e, t) {
this.nodeCardAni.active = !1;
this.nodeMainMj.active = !0;
for (var o = 17 - 3 * t.length, i = [], a = 0; a < o - 1; a++) a < e.length && i.push(e[a]);
i.sort(function(e, t) {
return e - t;
});
var n = [];
for (a = 0; a < i.length; a++) i[a] < 40 && n.push(i[a]);
for (a = 0; a < i.length; a++) i[a] > 50 && i[a] < 55 && n.push(i[a]);
for (a = 0; a < i.length; a++) i[a] > 40 && i[a] < 44 && n.push(i[a]);
n = this.sortMainCard(n);
e.length >= o && (n[o - 1] = e[o - 1]);
e = n;
for (a = 0; a < 17; a++) if (a < 3 * t.length) this["nodeMainMj" + (a + 1)].active = !1; else if (a < e.length + 3 * t.length) {
this["nodeMainMj" + (a + 1)].active = !0;
this["nodeMainMj" + (a + 1)].x = this.mjPositionData[a].x;
this["nodeMainMj" + (a + 1)].y = this.mjPositionData[a].y;
this["nodeMainMj" + (a + 1)].angle = 0;
this["nodeMainMj" + (a + 1)].pid = e[a - 3 * t.length];
this["nodeMainMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e[a - 3 * t.length]);
e[a - 3 * t.length] == this.caishenid ? this["nodeMainMj" + (a + 1)].getChildByName("caishen").active = !0 : this["nodeMainMj" + (a + 1)].getChildByName("caishen").active = !1;
} else this["nodeMainMj" + (a + 1)].active = !1;
for (a = 0; a < 5; a++) if (a < t.length) {
this["nodeMainMjGang" + (a + 1)].active = !0;
for (var r = 0; r < 4; r++) if (r < t[a].arr.length) {
this["nodeMainMjGang" + (a + 1) + "_" + (r + 1)].active = !0;
this["nodeMainMjGang" + (a + 1) + "_" + (r + 1)].getChildByName("spriteNum").active = !0;
if (4 == t[a].type || 5 == t[a].type || 6 == t[a].type) {
this["nodeMainMjGang" + (a + 1) + "_" + (r + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layFg");
this["nodeMainMjGang" + (a + 1) + "_" + (r + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + t[a].arr[r]);
} else if (3 == t[a].type) if (t[a].uid == wGameData.getKey("uid")) if (r < 3) {
this["nodeMainMjGang" + (a + 1) + "_" + (r + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layBg");
this["nodeMainMjGang" + (a + 1) + "_" + (r + 1)].getChildByName("spriteNum").active = !1;
} else {
this["nodeMainMjGang" + (a + 1) + "_" + (r + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layFg");
this["nodeMainMjGang" + (a + 1) + "_" + (r + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + t[a].arr[r]);
} else {
this["nodeMainMjGang" + (a + 1) + "_" + (r + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layFg");
this["nodeMainMjGang" + (a + 1) + "_" + (r + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + t[a].arr[r]);
}
} else this["nodeMainMjGang" + (a + 1) + "_" + (r + 1)].active = !1;
} else this["nodeMainMjGang" + (a + 1)].active = !1;
this.mainCardsData = {
cards: e,
place: t
};
};
t.prototype.showDeal = function(e) {
for (var t in e.uids) {
var o = this.controll.getSeat(t), i = e.uids[t].doFinish;
this.setDirction(o, 8);
for (var a in i) switch (a) {
case "2":
var n = i[a], r = void 0;
for (var d in n) r = d;
this.doHu(o, e, r);
0 == o && (this.nodeMainAction.active = !1);
this.canPutCard = !1;
break;

case "3":
this.doGang(o, i[a]);
this.showGangAni(0 == o);
break;

case "4":
this.doBuGang(o, i[a]);
this.showGangAni(0 == o);
break;

case "5":
this.doPeng(o, i[a]);
this.showPengAni(0 == o);
break;

case "6":
this.doChi(o, i[a]);
this.showChiAni(0 == o);
}
}
};
t.prototype.doHu = function(e, t, o) {
this.setHuCard(e, o, t.is_pao);
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
var o = {
arr: t.arr,
pid: t.pid,
bu: t.order,
type: t.type,
uid: t.uid
}, i = this.controll.getSeat(t.uid);
if (0 == e) {
this.canPutCard = !0;
this.mainCardsData.place.push(o);
if (0 == i) {
for (var a = 0; a < 4; a++) for (var n = 0; n < this.mainCardsData.cards.length; n++) if (o.arr[a] == this.mainCardsData.cards[n]) {
this.mainCardsData.cards.splice(n, 1);
break;
}
} else {
this.otherChupaiData.pop();
for (a = 0; a < 3; a++) for (n = 0; n < this.mainCardsData.cards.length; n++) if (o.arr[a] == this.mainCardsData.cards[n]) {
this.mainCardsData.cards.splice(n, 1);
break;
}
this.updateOtherChupai(this.otherChupaiData);
this.skeletonOtherPaitisi.node.active = !1;
}
this.mainCardsData.cards.sort();
this.updateMainMj(this.mainCardsData.cards, this.mainCardsData.place);
} else {
var r = 0;
if (1 == i) r = 4; else {
this.mainChupaiData.pop();
r = 3;
this.updateMainChupai(this.mainChupaiData);
this.skeletonMainPaitisi.node.active = !1;
}
this.otherCardsData.cardscount -= r;
this.otherCardsData.place.push(o);
this.updateOtherMj(this.otherCardsData.cardscount, this.otherCardsData.place);
}
};
t.prototype.doBuGang = function(e, t) {
var o = {
arr: t.arr,
pid: t.pid,
bu: t.order,
type: t.type,
uid: t.uid
};
if (0 == e) {
this.canPutCard = !0;
for (var i = 0; i < this.mainCardsData.place.length; i++) this.mainCardsData.place[i].pid == t.pid && this.mainCardsData.place.splice(i, 1);
this.mainCardsData.place.push(o);
for (i = 0; i < 1; i++) for (var a = 0; a < this.mainCardsData.cards.length; a++) if (o.arr[i] == this.mainCardsData.cards[a]) {
this.mainCardsData.cards.splice(a, 1);
break;
}
this.mainCardsData.cards.sort();
this.updateMainMj(this.mainCardsData.cards, this.mainCardsData.place);
} else {
this.otherCardsData.cardscount -= 1;
for (i = 0; i < this.otherCardsData.place.length; i++) this.otherCardsData.place[i].pid == t.pid && this.otherCardsData.place.splice(i, 1);
this.otherCardsData.place.push(o);
this.updateOtherMj(this.otherCardsData.cardscount, this.otherCardsData.place);
}
};
t.prototype.doPeng = function(e, t) {
var o = {
arr: t.arr,
pid: t.pid,
bu: t.order,
type: t.type,
uid: t.uid
};
if (0 == e) {
this.canPutCard = !0;
this.mainCardsData.place.push(o);
this.otherChupaiData.pop();
for (var i = 0; i < 2; i++) for (var a = 0; a < this.mainCardsData.cards.length; a++) if (o.arr[i] == this.mainCardsData.cards[a]) {
this.mainCardsData.cards.splice(a, 1);
break;
}
this.updateOtherChupai(this.otherChupaiData);
this.skeletonOtherPaitisi.node.active = !1;
this.mainCardsData.cards.sort();
this.updateMainMj(this.mainCardsData.cards, this.mainCardsData.place);
} else {
this.mainChupaiData.pop();
this.otherCardsData.cardscount -= 2;
this.otherCardsData.place.push(o);
this.updateOtherMj(this.otherCardsData.cardscount, this.otherCardsData.place);
this.updateMainChupai(this.mainChupaiData);
this.skeletonMainPaitisi.node.active = !1;
}
};
t.prototype.doChi = function(e, t) {
var o = {
arr: t.arr,
pid: t.pid,
bu: t.order,
type: t.type,
uid: t.uid
};
if (0 == e) {
this.canPutCard = !0;
this.mainCardsData.place.push(o);
this.otherChupaiData.pop();
for (var i = 0; i < 3; i++) for (var a = 0; a < this.mainCardsData.cards.length; a++) if (o.arr[i] == this.mainCardsData.cards[a] && o.arr[i] != o.pid) {
this.mainCardsData.cards.splice(a, 1);
break;
}
this.mainCardsData.cards.sort();
this.skeletonOtherPaitisi.node.active = !1;
this.updateMainMj(this.mainCardsData.cards, this.mainCardsData.place);
this.updateOtherChupai(this.otherChupaiData);
} else {
this.mainChupaiData.pop();
this.otherCardsData.cardscount -= 2;
this.otherCardsData.place.push(o);
this.updateOtherMj(this.otherCardsData.cardscount, this.otherCardsData.place);
this.updateMainChupai(this.mainChupaiData);
this.skeletonMainPaitisi.node.active = !1;
}
};
t.prototype.addCard = function(e) {
this.nodeMainAction.active = !1;
var t = this.controll.getSeat(e.uid);
0 == Array.isArray(e.ready_do) && 0 == t ? this.showAction(e.ready_do) : 0 == t ? this.canPutCard = !0 : this.nodeMainAction.active = !1;
this.setDirction(t, e.time);
this.lastMjNum--;
this.labelMjNum.string = this.lastMjNum.toString();
if (0 != e.pid) if (0 == t) {
this.mainCardsData.cards.push(e.pid);
this.nodeMainMj17.active = !0;
this.nodeMainMj17.x = this.mjPositionData[16].x;
this.nodeMainMj17.y = this.mjPositionData[16].y;
this.nodeMainMj17.angle = 0;
this.nodeMainMj17.pid = e.pid;
this.nodeMainMj17.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.pid);
e.pid == this.caishenid ? this.nodeMainMj17.getChildByName("caishen").active = !0 : this.nodeMainMj17.getChildByName("caishen").active = !1;
} else {
this.otherCardsData.cardscount += 1;
this.otherCardsData.cardscount >= 17 && (this.otherCardsData.cardscount = 17);
this.updateOtherMj(this.otherCardsData.cardscount, this.otherCardsData.place);
}
};
t.prototype.updateMainChupai = function(e) {
cc.log("updateMainChupai");
this.nodeCardAni.active = !1;
this.nodeMainChupai.active = !0;
for (var t = 0; t < this.totalcount; t++) if (t < e.length) {
this["nodeMainChupai" + (t + 1)].active = !0;
this["nodeMainChupai" + (t + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e[t]);
} else this["nodeMainChupai" + (t + 1)].active = !1;
this.mainChupaiData = e;
};
t.prototype.updateOtherMj = function(e, t) {
cc.log("otherplace");
cc.log(t);
this.nodeCardAni.active = !1;
this.nodeOtherMj.active = !0;
for (var o = 0; o < 17; o++) for (var i = 0; i < 17; i++) if (i < 3 * t.length) this["nodeOtherMj" + (i + 1)].active = !1; else if (i < e + 3 * t.length) {
this["nodeOtherMj" + (i + 1)].active = !0;
this["nodeOtherMj" + (i + 1)].y = 0;
} else this["nodeOtherMj" + (i + 1)].active = !1;
for (o = 0; o < 5; o++) if (o < t.length) {
this["nodeOtherMjGang" + (o + 1)].active = !0;
for (var a = 0; a < 4; a++) if (a < t[o].arr.length) {
this["nodeOtherMjGang" + (o + 1) + "_" + (a + 1)].active = !0;
this["nodeOtherMjGang" + (o + 1) + "_" + (a + 1)].getChildByName("spriteNum").active = !0;
if (4 == t[o].type || 5 == t[o].type || 6 == t[o].type) {
this["nodeOtherMjGang" + (o + 1) + "_" + (a + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layFg");
this["nodeOtherMjGang" + (o + 1) + "_" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + t[o].arr[a]);
} else if (3 == t[o].type) if (t[o].uid != wGameData.getKey("uid")) {
this["nodeOtherMjGang" + (o + 1) + "_" + (a + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layBg");
this["nodeOtherMjGang" + (o + 1) + "_" + (a + 1)].getChildByName("spriteNum").active = !1;
} else {
this["nodeOtherMjGang" + (o + 1) + "_" + (a + 1)].getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layFg");
this["nodeOtherMjGang" + (o + 1) + "_" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + t[o].arr[a]);
}
} else this["nodeOtherMjGang" + (o + 1) + "_" + (a + 1)].active = !1;
} else this["nodeOtherMjGang" + (o + 1)].active = !1;
this.otherCardsData = {
cardscount: e,
place: t
};
};
t.prototype.showOtherCard = function(e, t) {
var o = this;
this.nodeCardAni.active = !1;
this.nodeOtherShowCard.active = !0;
for (var i = [ 360, 316, 272, 228, 184, 140, 96, 52, 8, -36, -80, -124, -168, -212, -256, -300 ], a = function(e) {
n["nodeOtherShowCard" + (e + 1)].active = !1;
n["nodeOtherMj" + (e + 1)].runAction(cc.sequence(cc.moveTo(.2, n["nodeOtherMj" + (e + 1)].x, -25), cc.callFunc(function() {
o["nodeOtherMj" + (e + 1)].active = !1;
})));
}, n = this, r = 0; r < 17; r++) a(r);
var d = 17 - 3 * t.length, c = [];
for (r = 0; r < d - 1; r++) r < e.length && c.push(e[r]);
c.sort(function(e, t) {
return e - t;
});
var s = [];
for (r = 0; r < c.length; r++) c[r] < 40 && s.push(c[r]);
for (r = 0; r < c.length; r++) c[r] > 50 && c[r] < 55 && s.push(c[r]);
for (r = 0; r < c.length; r++) c[r] > 40 && c[r] < 44 && s.push(c[r]);
for (r = 0; r < c.length; r++) c[r] > 60 && s.push(c[r]);
e.length >= d && (s[d - 1] = e[d - 1]);
e = s;
var p = function(a) {
if (a < 3 * t.length) h["nodeOtherShowCard" + (a + 1)].active = !1; else if (a < e.length + 3 * t.length) {
h["nodeOtherShowCard" + (a + 1)].active = !0;
h["nodeOtherShowCard" + (a + 1)].x = i[a];
h["nodeOtherShowCard" + (a + 1)].y = -30;
h["nodeOtherShowCard" + (a + 1)].pid = e[a - 3 * t.length];
h["nodeOtherShowCard" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = h.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e[a - 3 * t.length]);
h["nodeOtherShowCard" + (a + 1)].children[0].active = !1;
h["nodeOtherShowCard" + (a + 1)].children[1].active = !1;
e[a - 3 * t.length] == h.caishenid ? h["nodeOtherShowCard" + (a + 1)].getChildByName("caishen").active = !0 : h["nodeOtherShowCard" + (a + 1)].getChildByName("caishen").active = !1;
h["nodeOtherShowCard" + (a + 1)].runAction(cc.sequence(cc.delayTime(.2), cc.callFunc(function() {
o["nodeOtherShowCard" + (a + 1)].children[0].active = !0;
o["nodeOtherShowCard" + (a + 1)].children[1].active = !0;
}), cc.delayTime(.5), cc.moveTo(.2, i[a], -12)));
} else h["nodeOtherShowCard" + (a + 1)].active = !1;
}, h = this;
for (r = 0; r < 17; r++) p(r);
};
t.prototype.updateOtherChupai = function(e) {
cc.log("updateOtherChupai");
this.nodeCardAni.active = !1;
this.nodeOtherChupai.active = !0;
for (var t = 0; t < this.totalcount; t++) if (t < e.length) {
this["nodeOtherChupai" + (t + 1)].active = !0;
this["nodeOtherChupai" + (t + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e[t]);
} else this["nodeOtherChupai" + (t + 1)].active = !1;
this.otherChupaiData = e;
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
var t = 0;
for (var o in e) {
var i = e[o];
if (-99 == Number(o)) ; else if (1 == Number(o)) ; else if (2 == Number(o)) {
this.waithucard = i[0];
this.btnMainHu.node.active = !0;
this.btnMainHu.node.x = -185 * t - 185;
t++;
} else if (3 == Number(o) || 4 == Number(o)) {
this.waitgangcard = i[0];
this.btnMainGang.node.active = !0;
this.btnMainGang.node.x = -185 * t - 185;
t++;
} else if (5 == Number(o)) {
this.waitpengcard = i[0];
this.btnMainPeng.node.active = !0;
this.btnMainPeng.node.x = -185 * t - 185;
t++;
} else if (6 == Number(o)) {
this.chicard = i;
this.btnMainChi.node.active = !0;
this.btnMainChi.node.x = -185 * t - 185;
t++;
} else this.canPutCard = !0;
}
0 == t && (this.nodeMainAction.active = !1);
}
};
t.prototype.showChiView = function() {
this.nodeMainChi.active = !0;
this.nodeMainAction.active = !1;
for (var e = 0; e < 3; e++) if (this.chicard[e]) for (var t = this.chicard[e].split("_"), o = 0; o < t.length; o++) {
this["nodeMainChi" + (e + 1)].active = !0;
var i = this["nodeMainChiMj" + (e + 1) + "_" + (o + 1)];
i.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + t[o]);
t[o] == this.putpid ? i.y = 15 : i.y = 5;
} else this["nodeMainChi" + (e + 1)].active = !1;
};
t.prototype.showChiAni = function(e) {
this.playSkeletonAni(this.skeletonChi, e);
wAudioMgr.playSound("sound/type_chi_0", "WZMJ");
};
t.prototype.showPengAni = function(e) {
this.playSkeletonAni(this.skeletonPeng, e);
wAudioMgr.playSound("sound/type_peng_0", "WZMJ");
};
t.prototype.showGangAni = function(e) {
var t = this;
cc.log("showGangAni");
this.nodeSpine.active = !0;
for (var o = 0; o < this.nodeSpine.children.length; o++) this.nodeSpine.children[o].active = !1;
this.skeletonGang.node.active = !0;
this.skeletonGang.node.y = e ? -180 : 180;
var i = this.skeletonGang.setAnimation(0, "animation", !1);
cc.log(i);
var a = this.skeletonGang.findAnimation("animation").duration;
cc.log("time", a);
this.node.runAction(cc.sequence(cc.delayTime(a), cc.callFunc(function() {
i.animationStart = i.animationEnd;
t.skeletonGang.node.active = !1;
})));
this.skeletonLongjuanPai.node.active = !0;
var n = this.skeletonLongjuanPai.setAnimation(0, "animation", !1), r = this.skeletonLongjuanPai.findAnimation("animation").duration;
cc.log("time2", r);
this.skeletonLongjuanPai.node.runAction(cc.sequence(cc.delayTime(r), cc.callFunc(function() {
n.animationStart = i.animationEnd;
t.skeletonLongjuanPai.node.active = !1;
})));
wAudioMgr.playSound("sound/type_gang_0", "WZMJ");
};
t.prototype.showHuAni = function(e) {
var t = this;
cc.log("showHuAni");
this.playSkeletonAni(this.skeletonHu, e);
this.node.runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
t.showLuoxuanAni(e);
})));
wAudioMgr.playSound("sound/type_hu_0", "WZMJ");
};
t.prototype.showLiujuAni = function(e) {
cc.log("showLiujuAni");
this.playSkeletonAni(this.skeletonLiuju, e, !0);
wAudioMgr.playSound("sound/liuju", "WZMJ");
};
t.prototype.showZimoAni = function(e) {
cc.log("showZimoAni");
this.playSkeletonAni(this.skeletonZimo, e);
wAudioMgr.playSound("sound/type_zimo_0", "WZMJ");
};
t.prototype.showLuoxuanAni = function(e) {
var t = this;
cc.log("showLuoxuanAni");
this.playSkeletonAni(this.skeletonLuoxuan, e);
this.nodeSpine.active = !0;
for (var o = 0; o < this.nodeSpine.children.length; o++) this.nodeSpine.children[o].active = !1;
this.skeletonLuoxuan.node.active = !0;
if (e) {
this.skeletonLuoxuan.node.x = 441;
this.skeletonLuoxuan.node.y = -146;
} else {
this.skeletonLuoxuan.node.x = -382;
this.skeletonLuoxuan.node.y = 203;
}
var i = this.skeletonLuoxuan.setAnimation(0, "animation", !1), a = this.skeletonLuoxuan.findAnimation("animation").duration;
cc.log("time", a);
this.skeletonLuoxuan.node.runAction(cc.sequence(cc.delayTime(a), cc.callFunc(function() {
i.animationStart = i.animationEnd;
t.skeletonHucard.node.active = !1;
})));
wAudioMgr.playSound("sound/wu", "WZMJ");
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
var o = this.skeletonHucard.setAnimation(0, "animation", !1), i = this.skeletonHucard.findAnimation("animation").duration;
this.skeletonHucard.node.runAction(cc.sequence(cc.delayTime(i), cc.callFunc(function() {
o.animationStart = o.animationEnd;
t.skeletonHucard.node.active = !1;
})));
};
t.prototype.playSkeletonAni = function(e, t, o) {
this.nodeSpine.active = !0;
for (var i = 0; i < this.nodeSpine.children.length; i++) this.nodeSpine.children[i].active = !1;
e.node.active = !0;
e.node.y = o ? 0 : t ? -180 : 180;
var a = e.setAnimation(0, "animation", !1), n = e.findAnimation("animation").duration;
cc.log("time", n);
e.node.runAction(cc.sequence(cc.delayTime(n), cc.callFunc(function() {
a.animationStart = a.animationEnd;
e.node.active = !1;
})));
};
t.prototype.startGame = function(e) {
this.controll.getSeat(e.banker);
this.setCountDown(8);
this.maiNode.active = !0;
e.banker == wGameData.getKey("uid") ? this.btnMaiSprite.spriteFrame = this.spriteFrameDingdi : this.btnMaiSprite.spriteFrame = this.spriteFrameMaidi;
};
t.prototype.setCountDown = function(e) {
this.countdown = e;
this.countdown < 10 ? this.labelCountDown.string = "0" + this.countdown : this.labelCountDown.string = this.countdown.toString();
this.unschedule(this.updateTime);
this.schedule(this.updateTime, 1);
};
t.prototype.updateTime = function() {
cc.log("updateTime");
this.countdown -= 1;
this.labelCountDown.string = "" + this.countdown;
this.countdown < 10 && (this.labelCountDown.string = "0" + this.countdown);
this.countdown <= 0 && this.unschedule(this.updateTime);
};
t.prototype.showResult = function(e) {
var t = this;
this.intrustNode.active = !1;
this.nodeMainAction.active = !1;
if (0 != e.turnover.uid) {
var o = this.controll.getSeat(e.turnover.uid);
this.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function() {
if (0 == o) {
e.turnover.is_pao && e.turnover.cards.push(e.turnover.hu_card);
var a = i.Config.GamePrefab[28], n = "prefab/resultWin";
wRes.loadRes(n, function(o, i) {
var a = cc.instantiate(i);
a.parent = t.node;
var n = {
peng: t.mainCardsData.place,
normal: e.turnover.cards,
score: e.gold_change,
fan: e.turnover.fan,
hucard: e.turnover.hu_card,
difen: t.labelDifen.string,
fanlist: e.turnover.hu_type,
ispao: e.turnover.is_pao,
maibei: e.turnover.mai_bei,
bankermai: e.turnover.banker_mai,
xianjiamai: e.turnover.is_mai,
caishen: t.caishenid,
bei: e.turnover.bei
};
a.getComponent("WZMJ_resultWin").init(n, t.cardtype);
}, a.enName);
} else {
e.turnover.is_pao && e.turnover.cards.push(e.turnover.hu_card);
a = i.Config.GamePrefab[28];
n = "prefab/resultLose";
wRes.loadRes(n, function(o, i) {
var a = cc.instantiate(i);
a.parent = t.node;
var n = {
peng: t.otherCardsData.place,
normal: e.turnover.cards,
score: e.gold_change,
fan: e.turnover.fan,
hucard: e.turnover.hu_card,
difen: t.labelDifen.string,
fanlist: e.turnover.hu_type,
ispao: e.turnover.is_pao,
maibei: e.turnover.mai_bei,
bankermai: e.turnover.banker_mai,
xianjiamai: e.turnover.is_mai,
caishen: t.caishenid,
bei: e.turnover.bei
};
a.getComponent("WZMJ_resultLose").init(n, t.cardtype);
}, a.enName);
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
t.prototype.setHuCard = function(e, t, o) {
if (0 == e) {
this.nodeMainHuCard.active = !0;
this.nodeMainHuCard.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layFg");
this.nodeMainHuCard.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + t);
this.nodeMainHuCard.getChildByName("mask").active = t == this.caishenid;
} else {
this.nodeOtherHuCard.active = !0;
this.nodeOtherHuCard.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layFg");
this.nodeOtherHuCard.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + t);
this.nodeOtherHuCard.getChildByName("caishen").active = t == this.caishenid;
}
o ? this.showHuAni(0 == e) : this.showZimoAni(0 == e);
};
t.prototype.showTips = function(e) {
var t = this.tips1;
switch (e) {
case 1:
t = this.tips1;
break;

case 2:
t = this.tips2;
break;

case 3:
t = this.tips3;
}
t.active = !0;
var o = cc.fadeIn(.15), i = cc.delayTime(2), a = cc.fadeOut(.3), n = cc.callFunc(function() {
t.active = !1;
}), r = cc.sequence(o, i, a, n);
t.runAction(r);
};
__decorate([ c(cc.Sprite) ], t.prototype, "btnMaiSprite", void 0);
__decorate([ c(cc.Node) ], t.prototype, "tips1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "tips2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "tips3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "intrustNode", void 0);
__decorate([ c(cc.Node) ], t.prototype, "maiNode", void 0);
__decorate([ c(cc.Node) ], t.prototype, "mjNumNode", void 0);
__decorate([ c(cc.Label) ], t.prototype, "labelMjNum", void 0);
__decorate([ c(cc.Node) ], t.prototype, "caishenNode", void 0);
__decorate([ c(cc.Node) ], t.prototype, "caishenBG", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "caishenNum", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeCaiShenAni", void 0);
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
__decorate([ c(cc.Node) ], t.prototype, "nodeMainPlayer", void 0);
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
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang5", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang5_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang5_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang5_3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMjGang5_4", void 0);
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
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj15", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj16", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherMj17", void 0);
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
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard15", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard16", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherShowCard17", void 0);
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
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai27", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai28", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai29", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai30", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai31", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai32", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai33", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai34", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai35", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai36", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai37", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai38", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai39", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai40", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai41", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai42", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai43", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai44", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai45", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai46", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai47", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai48", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai49", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai50", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai51", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai52", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai53", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai54", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai55", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai56", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai57", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai58", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai59", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai60", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai61", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai62", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai63", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeOtherChupai64", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonOtherPaitisi", void 0);
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
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai27", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai28", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai29", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai30", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai31", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai32", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai33", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai34", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai35", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai36", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai37", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai38", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai39", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai40", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai41", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai42", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai43", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai44", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai45", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai46", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai47", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai48", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai49", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai50", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai51", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai52", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai53", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai54", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai55", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai56", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai57", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai58", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai59", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai60", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai61", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai62", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai63", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupai64", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonMainPaitisi", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainChupaiAni", void 0);
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
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang5", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang5_1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang5_2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang5_3", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjGang5_4", void 0);
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
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj15", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj16", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMj17", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainMjAni", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnClickMj", void 0);
__decorate([ c(cc.Node) ], t.prototype, "nodeMainAction", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainGuo", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainChi", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainPeng", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainGang", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btnMainHu", void 0);
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
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonCaiShen", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonChi", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonLongjuanPai", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonGang", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonHu", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonLiuju", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonPeng", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonZimo", void 0);
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonLuoxuan", void 0);
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
__decorate([ c(sp.Skeleton) ], t.prototype, "skeletonHucard", void 0);
__decorate([ c(cc.SpriteFrame) ], t.prototype, "spriteFrameMaidi", void 0);
__decorate([ c(cc.SpriteFrame) ], t.prototype, "spriteFrameDingdi", void 0);
__decorate([ c([ cc.Vec2 ]) ], t.prototype, "mjPositionData", void 0);
return __decorate([ d ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {
Config: void 0,
WZMJ_Controll: "WZMJ_Controll",
WZMJ_FrameAnim: "WZMJ_FrameAnim"
} ],
WZMJ_resultLose: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "fa9b6RgQTlD+6FGWfUM3hFB", "WZMJ_resultLose");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, a = i.ccclass, n = i.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.nodeBg = null;
t.skeletonFailure = null;
t.skeletonFailure2 = null;
t.labelScore = null;
t.labelFan = null;
t.labelDifen = null;
t.labelBei = null;
t.labelFans = null;
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
t.nodeMjGang5 = null;
t.nodeMjGang5_1 = null;
t.nodeMjGang5_2 = null;
t.nodeMjGang5_3 = null;
t.nodeMjGang5_4 = null;
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
t.nodeMj15 = null;
t.nodeMj16 = null;
t.nodeMj17 = null;
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
var o = "";
e.bankermai ? o += "庄家买底: +1倍  " : o += "庄家不买底  ";
e.xianjiamai ? o += "闲家顶底: +1倍" : o += "闲家不顶底";
this.labelBei.string = o;
var i = "";
0 == e.ispao && (i += "自摸、");
for (var a = 0; a < e.fanlist.length; a++) for (var n in this.cardtypes) e.fanlist[a].type == n && (a < e.fanlist.length - 1 ? i = i + this.cardtypes[n] + "、" : i += this.cardtypes[n]);
this.labelFans.string = i + ":" + this.data.bei + "番";
this.labelScore.string = this.data.score;
this.labelFan.string = this.data.fan;
this.labelDifen.string = "底注：" + this.data.difen;
this.updateMj(this.data);
this.skeletonFailure.setAnimation(0, "start", !1);
var r = this.skeletonFailure.findAnimation("start").duration;
cc.log("time", r);
this.scheduleOnce(function() {
t.skeletonFailure.setAnimation(0, "idle", !0);
}, r);
this.skeletonFailure2.setAnimation(0, "start", !1);
var d = this.skeletonFailure2.findAnimation("start").duration;
cc.log("time", r);
this.scheduleOnce(function() {
t.skeletonFailure2.setAnimation(0, "idle", !0);
}, d);
this.countdown = 15;
this.labelCountdown.string = "15";
this.schedule(this.updateTime, 1);
wAudioMgr.playSound("sound/lose", "WZMJ");
};
t.prototype.updateTime = function() {
cc.log("updateTime");
this.countdown -= 1;
this.labelCountdown.string = "" + this.countdown;
if (this.countdown <= 0) {
this.unschedule(this.updateTime);
this.node.active = !1;
wNetWork.send("Msg_WZMJ_Ready", {
ready: !0
});
}
};
t.prototype.updateMj = function(e) {
cc.log("updateMj");
var t = e.peng.length;
this.spriteHu.node.active = !1;
for (var o = [], i = 17 - 3 * t, a = 0; a < i; a++) a < e.normal.length && o.push(e.normal[a]);
o.sort(function(e, t) {
return e - t;
});
var n = [];
for (a = 0; a < o.length; a++) o[a] < 40 && n.push(o[a]);
for (a = 0; a < o.length; a++) o[a] > 50 && o[a] < 55 && n.push(o[a]);
for (a = 0; a < o.length; a++) o[a] > 40 && o[a] < 44 && n.push(o[a]);
n = this.sortMainCard(n);
e.normal = n;
if (0 == t) {
this.nodeMjGang1.active = !1;
this.nodeMjGang2.active = !1;
this.nodeMjGang3.active = !1;
this.nodeMjGang4.active = !1;
this.nodeMjGang5.active = !1;
for (a = 0; a < 17; a++) {
this["nodeMj" + (a + 1)].active = !0;
this["nodeMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.normal[a]);
this["nodeMj" + (a + 1)].getChildByName("caishen").active = e.normal[a] == this.data.caishen;
if (e.normal[a] == e.hucard) {
this.spriteHu.node.active = !0;
this.spriteHu.node.x = this["nodeMj" + (a + 1)].x;
}
}
} else if (1 == t) {
this.nodeMjGang1.active = !0;
this.nodeMjGang2.active = !1;
this.nodeMjGang3.active = !1;
this.nodeMjGang4.active = !1;
this.nodeMjGang5.active = !1;
for (a = 0; a < 17; a++) if (a < 3) this["nodeMj" + (a + 1)].active = !1; else {
this["nodeMj" + (a + 1)].active = !0;
this["nodeMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.normal[a - 3]);
this["nodeMj" + (a + 1)].getChildByName("caishen").active = e.normal[a - 3] == this.data.caishen;
if (e.normal[a - 3] == e.hucard) {
this.spriteHu.node.active = !0;
this.spriteHu.node.x = this["nodeMj" + (a + 1)].x;
}
}
} else if (2 == t) {
this.nodeMjGang1.active = !0;
this.nodeMjGang2.active = !0;
this.nodeMjGang3.active = !1;
this.nodeMjGang4.active = !1;
this.nodeMjGang5.active = !1;
for (a = 0; a < 17; a++) if (a < 6) this["nodeMj" + (a + 1)].active = !1; else {
this["nodeMj" + (a + 1)].active = !0;
this["nodeMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.normal[a - 6]);
this["nodeMj" + (a + 1)].getChildByName("caishen").active = e.normal[a - 6] == this.data.caishen;
if (e.normal[a - 6] == e.hucard) {
this.spriteHu.node.active = !0;
this.spriteHu.node.x = this["nodeMj" + (a + 1)].x;
}
}
} else if (3 == t) {
this.nodeMjGang1.active = !0;
this.nodeMjGang2.active = !0;
this.nodeMjGang3.active = !0;
this.nodeMjGang4.active = !1;
this.nodeMjGang5.active = !1;
for (a = 0; a < 17; a++) if (a < 9) this["nodeMj" + (a + 1)].active = !1; else {
this["nodeMj" + (a + 1)].active = !0;
this["nodeMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.normal[a - 9]);
this["nodeMj" + (a + 1)].getChildByName("caishen").active = e.normal[a - 9] == this.data.caishen;
if (e.normal[a - 9] == e.hucard) {
this.spriteHu.node.active = !0;
this.spriteHu.node.x = this["nodeMj" + (a + 1)].x;
}
}
} else if (4 == t) {
this.nodeMjGang1.active = !0;
this.nodeMjGang2.active = !0;
this.nodeMjGang3.active = !0;
this.nodeMjGang4.active = !0;
this.nodeMjGang5.active = !1;
for (a = 0; a < 17; a++) if (a < 12) this["nodeMj" + (a + 1)].active = !1; else {
this["nodeMj" + (a + 1)].active = !0;
this["nodeMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.normal[a - 12]);
this["nodeMj" + (a + 1)].getChildByName("caishen").active = e.normal[a - 12] == this.data.caishen;
if (e.normal[a - 12] == e.hucard) {
this.spriteHu.node.active = !0;
this.spriteHu.node.x = this["nodeMj" + (a + 1)].x;
}
}
} else if (5 == t) {
this.nodeMjGang1.active = !0;
this.nodeMjGang2.active = !0;
this.nodeMjGang3.active = !0;
this.nodeMjGang4.active = !0;
this.nodeMjGang4.active = !0;
this.nodeMjGang5.active = !0;
for (a = 0; a < 17; a++) if (a < 15) this["nodeMj" + (a + 1)].active = !1; else {
this["nodeMj" + (a + 1)].active = !0;
this["nodeMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.normal[a - 15]);
this["nodeMj" + (a + 1)].getChildByName("caishen").active = e.normal[a - 15] == this.data.caishen;
if (e.normal[a - 15] == e.hucard) {
this.spriteHu.node.active = !0;
this.spriteHu.node.x = this["nodeMj" + (a + 1)].x;
}
}
}
var r = 0;
for (var d in e.peng) {
var c = this["nodeMjGang" + (r + 1) + "_1"], s = this["nodeMjGang" + (r + 1) + "_2"], p = this["nodeMjGang" + (r + 1) + "_3"], h = this["nodeMjGang" + (r + 1) + "_4"];
c.active = !0;
s.active = !0;
p.active = !0;
if (5 == e.peng[d].type) {
this["nodeMjGang" + (r + 1)].active = !0;
h.active = !1;
c.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
s.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
p.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
} else if (3 == e.peng[d].type || 4 == e.peng[d].type) if (e.peng[d].uid == wGameData.getKey("uid")) {
this["nodeMjGang" + (r + 1)].active = !0;
h.active = !0;
c.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layBg");
s.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layBg");
p.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layBg");
c.getChildByName("spriteNum").active = !1;
s.getChildByName("spriteNum").active = !1;
p.getChildByName("spriteNum").active = !1;
h.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
} else {
this["nodeMjGang" + (r + 1)].active = !0;
h.active = !0;
c.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
s.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
p.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
h.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
} else if (6 == e.peng[d].type) {
h.active = !1;
c.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
s.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[1]);
p.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[2]);
}
r++;
}
};
t.prototype.onClick = function(e, t) {
cc.log("WZMJ_view onClick:" + t);
switch (t) {
case "back":
wAudioMgr.playCloseSound();
wNetWork.send("Msg_WZMJ_Out", [], !0);
this.node.destroy();
break;

case "change":
wAudioMgr.playCloseSound();
wGEvent.emit("local_Event", "changeTable");
break;

case "start":
wAudioMgr.playCloseSound();
wNetWork.send("Msg_WZMJ_Ready", {
ready: !0
});
this.node.destroy();
}
};
t.prototype.sortMainCard = function(e) {
for (var t = 0, o = 0, i = 0; i < 4; i++) for (var a = 0; a < e.length; a++) if (43 == e[a]) {
o++;
e.splice(a, 1);
} else if (e[a] == this.data.caishen) {
t++;
e.splice(a, 1);
}
var n = [];
if (43 != this.data.caishen) {
for (a = 0; a < t; a++) n.push(this.data.caishen);
for (a = 0; a < e.length; a++) e[a] < this.data.caishen && n.push(e[a]);
for (a = 0; a < o; a++) n.push(43);
for (a = 0; a < e.length; a++) e[a] > this.data.caishen && n.push(e[a]);
} else {
for (a = 0; a < e.length; a++) e[a] < this.data.caishen ? n.push(e[a]) : e[a] > this.data.caishen && n.push(e[a]);
for (a = 0; a < t; a++) n.push(this.data.caishen);
}
return n;
};
__decorate([ n(cc.Node) ], t.prototype, "nodeBg", void 0);
__decorate([ n(sp.Skeleton) ], t.prototype, "skeletonFailure", void 0);
__decorate([ n(sp.Skeleton) ], t.prototype, "skeletonFailure2", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelScore", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelFan", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelDifen", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelBei", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelFans", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang1_1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang1_2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang1_3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang1_4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang2_1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang2_2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang2_3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang2_4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang3_1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang3_2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang3_3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang3_4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang4_1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang4_2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang4_3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang4_4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang5", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang5_1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang5_2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang5_3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang5_4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj5", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj6", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj7", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj8", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj9", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj10", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj11", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj12", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj13", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj14", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj15", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj16", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj17", void 0);
__decorate([ n(cc.Sprite) ], t.prototype, "spriteHu", void 0);
__decorate([ n(cc.Button) ], t.prototype, "buttonStart", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelCountdown", void 0);
__decorate([ n(cc.SpriteAtlas) ], t.prototype, "spriteAtlasMj", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {} ],
WZMJ_resultWin: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "86a8f9vZ3dFKqXYc6nuEma7", "WZMJ_resultWin");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, a = i.ccclass, n = i.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.nodeBg = null;
t.skeletonFailure = null;
t.skeletonFailure2 = null;
t.labelScore = null;
t.labelFan = null;
t.labelDifen = null;
t.labelBei = null;
t.labelFans = null;
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
t.nodeMjGang5 = null;
t.nodeMjGang5_1 = null;
t.nodeMjGang5_2 = null;
t.nodeMjGang5_3 = null;
t.nodeMjGang5_4 = null;
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
t.nodeMj15 = null;
t.nodeMj16 = null;
t.nodeMj17 = null;
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
var o = "";
1 == e.bankermai ? o += "庄家买底: +1倍  " : o += "庄家不买底  ";
1 == e.xianjiamai ? o += "闲家顶底: +1倍" : o += "闲家不顶底";
this.labelBei.string = o;
var i = "";
0 == e.ispao && (i += "自摸、");
for (var a = 0; a < e.fanlist.length; a++) for (var n in this.cardtypes) e.fanlist[a].type == n && (a < e.fanlist.length - 1 ? i = i + this.cardtypes[n] + "、" : i += this.cardtypes[n]);
this.labelFans.string = i + ":" + this.data.bei + "番";
this.labelScore.string = this.data.score;
this.labelFan.string = this.data.fan;
this.labelDifen.string = "底注：" + this.data.difen;
this.updateMj(this.data);
this.skeletonFailure.setAnimation(0, "start", !1);
var r = this.skeletonFailure.findAnimation("start").duration;
cc.log("time", r);
this.scheduleOnce(function() {
t.skeletonFailure.setAnimation(0, "idle", !0);
}, r);
this.skeletonFailure2.setAnimation(0, "start", !1);
var d = this.skeletonFailure2.findAnimation("start").duration;
cc.log("time", r);
this.scheduleOnce(function() {
t.skeletonFailure2.setAnimation(0, "idle", !0);
}, d);
this.countdown = 15;
this.labelCountdown.string = "15";
this.schedule(this.updateTime, 1);
wAudioMgr.playSound("sound/win", "WZMJ");
};
t.prototype.updateTime = function() {
cc.log("updateTime");
this.countdown -= 1;
this.labelCountdown.string = "" + this.countdown;
if (this.countdown <= 0) {
this.unschedule(this.updateTime);
this.node.active = !1;
wNetWork.send("Msg_WZMJ_Ready", {
ready: !0
});
}
};
t.prototype.updateMj = function(e) {
cc.log("updateMj");
var t = e.peng.length;
this.spriteHu.node.active = !1;
for (var o = [], i = 17 - 3 * t, a = 0; a < i; a++) a < e.normal.length && o.push(e.normal[a]);
o.sort(function(e, t) {
return e - t;
});
var n = [];
for (a = 0; a < o.length; a++) o[a] < 40 && n.push(o[a]);
for (a = 0; a < o.length; a++) o[a] > 50 && o[a] < 55 && n.push(o[a]);
for (a = 0; a < o.length; a++) o[a] > 40 && o[a] < 44 && n.push(o[a]);
n = this.sortMainCard(n);
e.normal = n;
if (0 == t) {
this.nodeMjGang1.active = !1;
this.nodeMjGang2.active = !1;
this.nodeMjGang3.active = !1;
this.nodeMjGang4.active = !1;
this.nodeMjGang5.active = !1;
for (a = 0; a < 17; a++) {
this["nodeMj" + (a + 1)].active = !0;
this["nodeMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.normal[a]);
this["nodeMj" + (a + 1)].getChildByName("caishen").active = e.normal[a] == this.data.caishen;
if (e.normal[a] == e.hucard) {
this.spriteHu.node.active = !0;
this.spriteHu.node.x = this["nodeMj" + (a + 1)].x;
}
}
} else if (1 == t) {
this.nodeMjGang1.active = !0;
this.nodeMjGang2.active = !1;
this.nodeMjGang3.active = !1;
this.nodeMjGang4.active = !1;
this.nodeMjGang5.active = !1;
for (a = 0; a < 17; a++) if (a < 3) this["nodeMj" + (a + 1)].active = !1; else {
this["nodeMj" + (a + 1)].active = !0;
this["nodeMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.normal[a - 3]);
this["nodeMj" + (a + 1)].getChildByName("caishen").active = e.normal[a - 3] == this.data.caishen;
if (e.normal[a - 3] == e.hucard) {
this.spriteHu.node.active = !0;
this.spriteHu.node.x = this["nodeMj" + (a + 1)].x;
}
}
} else if (2 == t) {
this.nodeMjGang1.active = !0;
this.nodeMjGang2.active = !0;
this.nodeMjGang3.active = !1;
this.nodeMjGang4.active = !1;
this.nodeMjGang5.active = !1;
for (a = 0; a < 17; a++) if (a < 6) this["nodeMj" + (a + 1)].active = !1; else {
this["nodeMj" + (a + 1)].active = !0;
this["nodeMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.normal[a - 6]);
this["nodeMj" + (a + 1)].getChildByName("caishen").active = e.normal[a - 6] == this.data.caishen;
if (e.normal[a - 6] == e.hucard) {
this.spriteHu.node.active = !0;
this.spriteHu.node.x = this["nodeMj" + (a + 1)].x;
}
}
} else if (3 == t) {
this.nodeMjGang1.active = !0;
this.nodeMjGang2.active = !0;
this.nodeMjGang3.active = !0;
this.nodeMjGang4.active = !1;
this.nodeMjGang5.active = !1;
for (a = 0; a < 17; a++) if (a < 9) this["nodeMj" + (a + 1)].active = !1; else {
this["nodeMj" + (a + 1)].active = !0;
this["nodeMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.normal[a - 9]);
this["nodeMj" + (a + 1)].getChildByName("caishen").active = e.normal[a - 9] == this.data.caishen;
if (e.normal[a - 9] == e.hucard) {
this.spriteHu.node.active = !0;
this.spriteHu.node.x = this["nodeMj" + (a + 1)].x;
}
}
} else if (4 == t) {
this.nodeMjGang1.active = !0;
this.nodeMjGang2.active = !0;
this.nodeMjGang3.active = !0;
this.nodeMjGang4.active = !0;
this.nodeMjGang5.active = !1;
for (a = 0; a < 17; a++) if (a < 12) this["nodeMj" + (a + 1)].active = !1; else {
this["nodeMj" + (a + 1)].active = !0;
this["nodeMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.normal[a - 12]);
this["nodeMj" + (a + 1)].getChildByName("caishen").active = e.normal[a - 12] == this.data.caishen;
if (e.normal[a - 12] == e.hucard) {
this.spriteHu.node.active = !0;
this.spriteHu.node.x = this["nodeMj" + (a + 1)].x;
}
}
} else if (5 == t) {
this.nodeMjGang1.active = !0;
this.nodeMjGang2.active = !0;
this.nodeMjGang3.active = !0;
this.nodeMjGang4.active = !0;
this.nodeMjGang4.active = !0;
this.nodeMjGang5.active = !0;
for (a = 0; a < 17; a++) if (a < 15) this["nodeMj" + (a + 1)].active = !1; else {
this["nodeMj" + (a + 1)].active = !0;
this["nodeMj" + (a + 1)].getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_" + e.normal[a - 15]);
this["nodeMj" + (a + 1)].getChildByName("caishen").active = e.normal[a - 15] == this.data.caishen;
if (e.normal[a - 15] == e.hucard) {
this.spriteHu.node.active = !0;
this.spriteHu.node.x = this["nodeMj" + (a + 1)].x;
}
}
}
var r = 0;
for (var d in e.peng) {
var c = this["nodeMjGang" + (r + 1) + "_1"], s = this["nodeMjGang" + (r + 1) + "_2"], p = this["nodeMjGang" + (r + 1) + "_3"], h = this["nodeMjGang" + (r + 1) + "_4"];
this["nodeMjGang" + (r + 1) + "_5"];
c.active = !0;
s.active = !0;
p.active = !0;
if (5 == e.peng[d].type) {
this["nodeMjGang" + (r + 1)].active = !0;
h.active = !1;
c.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
s.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
p.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
} else if (3 == e.peng[d].type || 4 == e.peng[d].type) if (e.peng[d].uid == wGameData.getKey("uid")) {
this["nodeMjGang" + (r + 1)].active = !0;
h.active = !0;
c.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layBg");
s.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layBg");
p.getChildByName("sprite").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("layBg");
c.getChildByName("spriteNum").active = !1;
s.getChildByName("spriteNum").active = !1;
p.getChildByName("spriteNum").active = !1;
h.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
} else {
this["nodeMjGang" + (r + 1)].active = !0;
h.active = !0;
c.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
s.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
p.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
h.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
} else if (6 == e.peng[d].type) {
h.active = !1;
c.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[0]);
s.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[1]);
p.getChildByName("spriteNum").getComponent(cc.Sprite).spriteFrame = this.spriteAtlasMj.getSpriteFrame("plist_mj_sign_l_" + e.peng[d].arr[2]);
}
r++;
}
};
t.prototype.onClick = function(e, t) {
cc.log("WZMJ_view onClick:" + t);
switch (t) {
case "back":
wAudioMgr.playCloseSound();
wNetWork.send("Msg_WZMJ_Out", [], !0);
this.node.destroy();
break;

case "change":
wAudioMgr.playCloseSound();
wGEvent.emit("local_Event", "changeTable");
break;

case "start":
wAudioMgr.playCloseSound();
wNetWork.send("Msg_WZMJ_Ready", {
ready: !0
});
this.node.destroy();
}
};
t.prototype.sortMainCard = function(e) {
for (var t = 0, o = 0, i = 0; i < 4; i++) for (var a = 0; a < e.length; a++) if (43 == e[a]) {
o++;
e.splice(a, 1);
} else if (e[a] == this.data.caishen) {
t++;
e.splice(a, 1);
}
var n = [];
if (43 != this.data.caishen) {
for (a = 0; a < t; a++) n.push(this.data.caishen);
for (a = 0; a < e.length; a++) e[a] < this.data.caishen && n.push(e[a]);
for (a = 0; a < o; a++) n.push(43);
for (a = 0; a < e.length; a++) e[a] > this.data.caishen && n.push(e[a]);
} else {
for (a = 0; a < e.length; a++) e[a] < this.data.caishen ? n.push(e[a]) : e[a] > this.data.caishen && n.push(e[a]);
for (a = 0; a < t; a++) n.push(this.data.caishen);
}
return n;
};
__decorate([ n(cc.Node) ], t.prototype, "nodeBg", void 0);
__decorate([ n(sp.Skeleton) ], t.prototype, "skeletonFailure", void 0);
__decorate([ n(sp.Skeleton) ], t.prototype, "skeletonFailure2", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelScore", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelFan", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelDifen", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelBei", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelFans", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang1_1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang1_2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang1_3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang1_4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang2_1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang2_2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang2_3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang2_4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang3_1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang3_2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang3_3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang3_4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang4_1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang4_2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang4_3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang4_4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang5", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang5_1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang5_2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang5_3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMjGang5_4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj1", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj2", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj3", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj4", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj5", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj6", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj7", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj8", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj9", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj10", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj11", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj12", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj13", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj14", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj15", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj16", void 0);
__decorate([ n(cc.Node) ], t.prototype, "nodeMj17", void 0);
__decorate([ n(cc.Sprite) ], t.prototype, "spriteHu", void 0);
__decorate([ n(cc.Button) ], t.prototype, "buttonStart", void 0);
__decorate([ n(cc.Label) ], t.prototype, "labelCountdown", void 0);
__decorate([ n(cc.SpriteAtlas) ], t.prototype, "spriteAtlasMj", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {} ]
}, {}, [ "WZMJ_Controll", "WZMJ_FrameAnim", "WZMJ_Player", "WZMJ_RoomLoad", "WZMJ_TableSelect", "WZMJ_View", "WZMJ_resultLose", "WZMJ_resultWin" ]);