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
QZNNLoad: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "3ee1dmRPBFBfZop9oPMlqgO", "QZNNLoad");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("Config"), a = cc._decorator, n = a.ccclass;
a.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(e) {
switch (e.label) {
case 0:
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
this.preloadGameRes();
return [ 4, Promise.all([ this.playSpine(), this.loadConfig() ]) ];

case 1:
e.sent();
this.loadRoom();
return [ 2 ];
}
});
});
};
t.prototype.playSpine = function() {
var e = this;
return new Promise(function(t) {
return __awaiter(e, void 0, void 0, function() {
var e;
return __generator(this, function(i) {
switch (i.label) {
case 0:
e = cc.find("main/spine", this.node);
wUIHelp.playSpine(e, "start", function() {
wUIHelp.playSpine(e, "idle", null, !0);
});
return [ 4, wUtils.syncDelayed(.8, this) ];

case 1:
i.sent();
t();
return [ 2 ];
}
});
});
});
};
t.prototype.loadConfig = function() {
var e = this;
return new Promise(function(t, i) {
if (wGameData.isReconnect) t(); else {
var o = wGEvent.on("Msg_Hall_GameSessions", function(a) {
wGEvent.off(o);
o = null;
e.unscheduleAllCallbacks();
if (1 == a.status && a.data) {
wGameData.roomConfig = a.data;
t();
} else {
wLog.e("请求游戏配置失败");
wViewMgr.enterHall();
i();
}
}, e);
e.scheduleOnce(function() {
if (o) {
wUIManager.showTips("请求游戏配置失败");
wGEvent.off(o);
wViewMgr.enterHall();
i();
}
}, 10);
wNetWork.send("Msg_Hall_GameSessions", {
gtype: wGameData.gameID
});
}
});
};
t.prototype.preloadGameRes = function() {
var e = o.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir(e.prefabUrl, e.enName);
wRes.preloadDir("prefab/Room", e.enName);
};
t.prototype.loadRoom = function() {
var e = this, t = wGameData.gameID, i = cc.Canvas.instance.node.getChildByName("Room");
i.active = !0;
var a = o.Config.GamePrefab[t];
wRes.loadRes("prefab/Room", function(t, o) {
return __awaiter(e, void 0, void 0, function() {
return __generator(this, function() {
if (t) {
wViewMgr.enterHall();
return [ 2 ];
}
cc.instantiate(o).parent = i;
wGameData.isReconnect ? this.node.zIndex = 100 : this.node.destroy();
return [ 2 ];
});
});
}, a.enName);
};
return __decorate([ n ], t);
}(cc.Component);
i.default = s;
cc._RF.pop();
}, {
Config: void 0
} ],
QZNNRoom: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "84e43sCyL5HNqxnsUwWkXfK", "QZNNRoom");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("Config"), a = cc._decorator, n = a.ccclass, s = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.top = null;
t.bottom = null;
t.head = null;
t.nickname = null;
t.gold = null;
t.bankGold = null;
t.isEnterRoom = !1;
t.isExit = !1;
return t;
}
t.prototype.onLoad = function() {
var e = this;
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
e.initShow();
}, this);
wGameData.isReconnect ? this.loadGame() : this.initRoom();
};
t.prototype.onEnable = function() {
if (!wGameData.isReconnect) {
this.gold && (this.gold.string = wUtils.numConvert(wGameData.getKey("gold")));
this.enterAni();
}
};
t.prototype.local_Event = function(e) {
switch (e) {
case "up_Gold":
this.gold && (this.gold.string = wUtils.numConvert(wGameData.getKey("gold")));
this.bankGold && (this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank")));
}
};
t.prototype.initRoom = function() {
this.head && wUIHelp.setHead(this.head, wGameData.getKey("headimgurl"));
this.nickname && (this.nickname.string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10));
this.bankGold && (this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank")));
};
t.prototype.initShow = function() {
this.isEnterRoom = !1;
this.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
this.node.parent.destroyAllChildren();
}
};
t.prototype.enterAni = function() {
var e = this.content;
this.node.getChildByName("main").opacity = 0;
var t = cc.fadeTo(.5, 255);
this.node.getChildByName("main").runAction(t);
for (var i = 0; i < e.childrenCount; i++) {
var o = e.children[i], a = cc.v2(o.x, o.y);
o.x += 250;
var n = cc.moveTo(.2, a).easing(cc.easeBackOut());
n.speed(.35);
o.runAction(n);
}
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
var e = o.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(e.prefabUrl, function() {}, function(e, t) {
e ? wLog.e(e) : wViewMgr.openGame(t);
}, e.enName);
};
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
QZNN_Controlle: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "143d0gLsSdLHL71/6Ablyxe", "QZNN_Controlle");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("PokerBase"), a = e("QZNN_Player"), n = cc._decorator, s = n.ccclass, r = n.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.playerView = [];
t.titleImg = [];
t.playerList = {};
t.isStartAnim = !0;
return t;
}
t.prototype.start = function() {
this.initMsgEvevt();
this.m_init();
cc.find("bg/type", this.node).getComponent(cc.Sprite).spriteFrame = this.titleImg[wGameData.roomLevel - 1];
};
t.prototype.addPlayer = function(e) {
if ((e = JSON.parse(JSON.stringify(e))).uid) {
var t = e.seat - this.my_s_seat;
t < 0 && (t += 5);
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
t.prototype.m_roomInfo = function(e) {
this.doublescore = e.doublescore;
cc.find("bg/layout/df", this.node).getComponent(cc.Label).string = "" + wUtils.numConvert(e.doublescore);
this.hands = e.hands;
this.banker = e.banker;
this.gameState = e.gameState;
var t = e.players;
this.addPlayer(t[this.my_uid]);
for (var i in t) if (i != this.my_uid) {
(a = t[i]).uid = i;
this.addPlayer(a);
}
if (0 != this.gameState) if (1 != this.gameState) if (2 != this.gameState) if (3 != this.gameState) 4 == this.gameState && this.setTips("jjks", !0, e.msg.time); else {
for (var o in this.playerList) if ((a = this.playerList[o]).isrealy) {
a.poker = e.msg.players[o];
a.view.initPoker(e.msg.players[o], a.ishow);
if (!a.ishow) {
o == this.my_uid && this.setKP(!0);
a.view.setProgTime(e.msg.time);
}
o == this.banker ? a.view.setState("qz", a.callbanker) : a.view.setState("bet", a.bet);
} else o == this.my_uid && this.setTips("ddks", !0);
this.showBanker();
} else {
for (var o in this.playerList) {
var a = this.playerList[o];
o == this.banker ? a.view.setState("qz", a.callbanker) : a.view.setState("bet", a.bet);
if (o == this.my_uid) if (a.isrealy) {
this.setXZ(!a.bet && o != this.banker);
this.setTips("xz", a.bet);
} else this.setTips("ddks", !0);
a.isrealy && !a.bet && o != this.banker && a.view.setProgTime(e.msg.time);
}
this.showBanker();
} else for (var o in this.playerList) {
(a = this.playerList[o]).view.setState("qz", a.callbanker);
if (o == this.my_uid) if (a.isrealy) {
this.setQZ(-1 == a.callbanker);
this.setTips("qz", a.callbanker);
} else this.setTips("ddks", !0);
a.isrealy && -1 == a.callbanker && a.view.setProgTime(e.msg.time);
} else Object.keys(this.playerList).length < 2 && this.setTips("ddjr", !0);
};
t.prototype.Msg_QZNN_CallBanker = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i;
return __generator(this, function(o) {
switch (o.label) {
case 0:
this.node.getChildByName("banker").active = !1;
for (t in this.playerList) {
(i = this.playerList[t]).view.initShow();
i.isrealy = !0;
i.callbanker = -1;
i.view.setProgTime(e.time);
}
this.setTips("ddks", !1);
this.gameState = 1;
if (!this.isStartAnim) return [ 3, 2 ];
wAudioMgr.playSound("sound/effect_game_start", "QZNN");
this.showStartAnim();
this.isStartAnim = !1;
return [ 4, wUtils.syncDelayed(.5, this) ];

case 1:
o.sent();
o.label = 2;

case 2:
this.setQZ(!0);
return [ 2 ];
}
});
});
};
t.prototype.Msg_QZNN_Act_CallBanker = function(e) {
var t = this.playerList[e.uid];
t.callbanker = e.type;
t.view.setState("qz", e.type);
t.view.setProgTime(0);
if (e.uid == this.my_uid) {
this.setQZ(!1);
this.setTips("qz", !0);
}
};
t.prototype.Msg_QZNN_Bet = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o;
return __generator(this, function(a) {
switch (a.label) {
case 0:
this.my_info.isrealy && this.setTips("qz", !1);
this.gameState = 2;
this.banker = e.banker;
return [ 4, this.showBankAnim() ];

case 1:
a.sent();
(t = this.playerList[this.banker]).callbanker < 1 && (t.callbanker = 1);
for (i in this.playerList) (o = this.playerList[i]).isrealy && (i != e.banker ? o.view.setProgTime(e.time - 2) : o.view.setState("qz", t.callbanker));
e.banker != this.my_uid && this.my_info.isrealy && this.setXZ(!0);
e.banker == this.my_uid && this.setTips("xz", !0);
return [ 2 ];
}
});
});
};
t.prototype.Msg_QZNN_Act_Bet = function(e) {
var t = this.playerList[e.uid];
wAudioMgr.playSound("sound/effect_money", "QZNN");
t.view.setState("bet", e.bet);
t.view.setProgTime(0);
t.bet = e.bet;
if (e.uid == this.my_uid) {
this.setXZ(!1);
this.setTips("xz", !0);
}
};
t.prototype.Msg_QZNN_FaCards = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o, a, n, s, r = this;
return __generator(this, function() {
this.my_info.isrealy && this.setTips("xz", !1);
this.gameState = 3;
t = [];
for (i in this.playerList) {
o = this.playerList[i];
t.push(o);
o.isrealy && o.view.setProgTime(0);
}
wAudioMgr.playSound("sound/effect_send_card", "QZNN");
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
r.my_info.isrealy && r.setKP(!0);
}, 1);
return [ 2 ];
});
});
};
t.prototype.Msg_QZNN_Act_Show = function(e) {
var t = this.playerList[e.uid];
t.ishow = !0;
if (e.uid == this.my_uid) {
t.view.setPokerType(t.poker.type);
this.setKP(!1);
} else t.view.setOK(!0);
};
t.prototype.Msg_QZNN_Res = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o, a, n, s, r, c, l, d, p, h, u, m, y, g;
return __generator(this, function(_) {
switch (_.label) {
case 0:
this.gameState = 4;
this.setKP(!1);
t = e.players;
i = function(e) {
var i = o.playerList[e];
i.isrealy = 0;
i.view.setOK(!1);
i.view.setProgTime(0);
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
for (g in this.playerList) i(g);
return [ 4, wUtils.syncDelayed(1, this) ];

case 1:
_.sent();
this.setTips("ddks", !0);
a = this.playerList[this.banker];
n = [];
s = [];
wAudioMgr.playSound("sound/effect_win_gold", "QZNN");
for (y in t) {
r = t[y];
if (c = this.playerList[y]) {
c.gold = r.gold;
c.view.setGold(r.gold);
if (y == this.my_uid) {
c.allWinScore += r.score;
c.winScore = r.score;
r.score > 0 ? wAudioMgr.playSound("sound/effect_win", "QZNN") : wAudioMgr.playSound("sound/effect_lose", "QZNN");
}
r.score > 0 ? n.push(y) : s.push(y);
if (this.banker != y) {
l = r.score > 0 ? a.c_seat : c.c_seat;
d = r.score > 0 ? c.c_seat : a.c_seat;
this.showWinGoldAnim(l, d);
}
}
}
p = function(e) {
var t = h.playerList[e];
h.scheduleOnce(function() {
t.view && t.view.showWinAnim();
}, .5);
};
h = this;
u = 0;
for (m = n; u < m.length; u++) {
y = m[u];
p(y);
}
return [ 4, wUtils.syncDelayed(1, this) ];

case 2:
_.sent();
for (g in this.playerList) this.playerList[g].deleteInfo && delete this.playerList[g];
this.setTips("jjks", !0, e.time - 2);
this.gameState = 0;
return [ 2 ];
}
});
});
};
t.prototype.showBankAnim = function() {
var e = this, t = null, i = new Promise(function(e) {
t = e;
}), o = this.node.getChildByName("banker");
o.active = !0;
o.getChildByName("bg").active = !0;
o.getChildByName("anim").active = !1;
wUIHelp.hideSonNode(o);
var a = o.getChildByName("select"), n = [], s = null, r = this.playerList[this.banker].callbanker;
for (var c in this.playerList) {
var l = this.playerList[c];
if (l.isrealy && l.callbanker == r) {
c == this.banker && (s = n.length);
n.push(l.view.node);
}
}
var d = function() {
return __awaiter(e, void 0, void 0, function() {
var e, i, r = this;
return __generator(this, function() {
a.active = !1;
o.getChildByName("bg").active = !1;
(e = o.getChildByName("anim")).active = !0;
(i = wUtils.world_local_POS(o, wUtils.local_world__POS(n[s]))).y += 10;
e.setPosition(i);
this.scheduleOnce(function() {
return __awaiter(r, void 0, void 0, function() {
return __generator(this, function(e) {
switch (e.label) {
case 0:
wAudioMgr.playSound("sound/effect_banker", "QZNN");
return [ 4, this.showBanker(!0) ];

case 1:
e.sent();
return [ 2 ];
}
});
});
}, .5);
t();
return [ 2 ];
});
});
};
1 == n.length ? d() : function(e, t, i, s, r, c) {
void 0 === t && (t = 0);
void 0 === i && (i = 0);
void 0 === s && (s = 23);
void 0 === r && (r = .13);
void 0 === c && (c = 3);
var l = t, d = c * (s + 1) - t + i + 1, p = new Date().getTime(), h = cc.callFunc(function() {
var e = new Date().getTime();
e - p > 80 && (p = e);
a.active = !0;
var t = wUtils.world_local_POS(o, wUtils.local_world__POS(n[l++]));
t.y += 10;
a.setPosition(t);
l >= s && (l = 0);
}), u = cc.delayTime(r), m = cc.sequence(u, h), y = cc.repeat(m, d).easing(cc.easeInOut(2)), g = cc.callFunc(function() {
e && e();
}), _ = cc.sequence(y, g);
o.stopAllActions();
o.runAction(_);
}(function() {
d();
}, 0, s, n.length);
return i;
};
t.prototype.showBanker = function(e) {
var t = this;
void 0 === e && (e = !1);
return new Promise(function(i) {
var o = t.node.getChildByName("banker");
o.active = !0;
var a = o.getChildByName("img"), n = cc.find("state/bank", t.playerList[t.banker].view.node);
n = wUtils.world_local_POS(o, wUtils.local_world__POS(n));
a.setPosition(n);
if (e) {
var s = o.getChildByName("spine");
s.setPosition(n);
s.active = !0;
wUIHelp.playSpine(s, "animation", function() {
a.active = !0;
a.getChildByName("lz").active = !0;
a.getChildByName("lz").getComponent(cc.ParticleSystem).resetSystem();
s.active = !1;
o.getChildByName("anim").active = !1;
i();
});
} else {
a.active = !0;
a.getChildByName("lz").active = !1;
}
});
};
t.prototype.showStartAnim = function() {
var e = this.node.getChildByName("start");
e.active = !0;
wUIHelp.playSpine(e, "animation", function() {
e.active = !1;
});
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
t.prototype.setTips = function(e, t, i) {
var o = this.node.getChildByName("tips");
wUIHelp.hideSonNode(o);
o.getChildByName(e).active = t;
if (t && "jjks" == e) {
var a = cc.find(e + "/time", o);
a.getComponent(cc.Label).string = "" + i;
var n = cc.callFunc(function() {
a.getComponent(cc.Label).string = "" + --i;
}), s = cc.delayTime(1), r = cc.repeat(cc.sequence(n, s), i);
a.stopAllActions();
a.runAction(r);
}
};
t.prototype.setQZ = function(e) {
var t = this.node.getChildByName("btn");
wUIHelp.hideSonNode(t);
t.getChildByName("bank").active = e;
};
t.prototype.onClick_QZ = function(e, t) {
wAudioMgr.playBtnSound();
wNetWork.send("Msg_QZNN_Act_CallBanker", {
type: Number(t)
});
this.setQZ(!1);
};
t.prototype.setXZ = function(e) {
var t = this.node.getChildByName("btn");
wUIHelp.hideSonNode(t);
t.getChildByName("bet").active = e;
};
t.prototype.onClick_XZ = function(e, t) {
wAudioMgr.playBtnSound();
var i = Number(t);
if (i * this.doublescore > this.my_info.gold) wUIManager.showTips("金币不足!", wUIManager.TIPS_OK); else {
wNetWork.send("Msg_QZNN_Act_Bet", {
bet: i
});
this.setXZ(!1);
}
};
t.prototype.setKP = function(e) {
var t = this.node.getChildByName("btn");
wUIHelp.hideSonNode(t);
t.getChildByName("openPoker").active = e;
};
t.prototype.onClick = function(e, t) {
switch (t) {
case "hall":
if (0 != this.gameState && this.my_info.isrealy) {
wUIManager.showTips("游戏正在进行中！", wUIManager.TIPS_OK);
return;
}
wAudioMgr.playCloseSound();
this.m_quitGame();
return;

case "openPoker":
this.setKP(!1);
wNetWork.send("Msg_QZNN_Act_Show", []);
break;

case "exit":
wNetWork.send("Msg_QZNN_ACT_Delay", {
type: 0
});
break;

case "jx":
wNetWork.send("Msg_QZNN_ACT_Delay", {
type: 1
});
}
wAudioMgr.playBtnSound();
};
t.prototype.initMsgEvevt = function() {
var e = this;
this.my_uid = wGameData.getKey("uid");
for (var t = function(t) {
wGEvent.on(t, function(i) {
1 == i.status ? e[t](i.data) : console.error("evevt", i);
}, i);
}, i = this, o = 0, a = [ "Msg_QZNN_CallBanker", "Msg_QZNN_Bet", "Msg_QZNN_FaCards", "Msg_QZNN_Res", "Msg_QZNN_Act_CallBanker", "Msg_QZNN_DelayOut", "Msg_QZNN_ACT_Delay", "Msg_QZNN_Act_Bet", "Msg_QZNN_Act_Show", "Msg_QZNN_Add", "Msg_QZNN_ChangGold", "Msg_QZNN_Out" ]; o < a.length; o++) t(a[o]);
};
t.prototype.Msg_QZNN_ChangGold = function(e) {
var t = this.playerList[e.uid];
t.gold = e.gold;
t.view.setGold(e.gold);
};
t.prototype.Msg_QZNN_Out = function(e) {
if (e.uid != this.my_uid) if (this.playerList[e.uid]) {
this.playerList[e.uid].view.deletePlayer();
4 != this.gameState ? delete this.playerList[e.uid] : this.playerList[e.uid].deleteInfo = !0;
Object.keys(this.playerList).length < 2 && this.setTips("ddjr", !0);
} else wLog.e("没有该玩家了----------------");
};
t.prototype.Msg_QZNN_Add = function(e) {
this.addPlayer(e);
};
t.prototype.m_NetWorkState = function() {};
t.prototype.m_upGameGold = function() {
var e = wGameData.getKey("gold");
this.my_info.gold = e;
this.my_info.view.setGold(e);
};
t.prototype.Msg_QZNN_ACT_Delay = function() {};
t.prototype.Msg_QZNN_DelayOut = function() {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function() {
wNetWork.send("Msg_QZNN_ACT_Delay", {
type: 1
});
return [ 2 ];
});
});
};
__decorate([ r(a.default) ], t.prototype, "playerView", void 0);
__decorate([ r([ cc.SpriteFrame ]) ], t.prototype, "titleImg", void 0);
return __decorate([ s ], t);
}(o.default);
i.default = c;
cc._RF.pop();
}, {
PokerBase: void 0,
QZNN_Player: "QZNN_Player"
} ],
QZNN_Player: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "eefdeggGEdLC4D2eHDejqxG", "QZNN_Player");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = cc._decorator, a = o.ccclass, n = o.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.poker = null;
t.typeImg = [];
t.bgImg = [];
t.gold = null;
t.state = null;
t.prog = null;
return t;
}
t.prototype.onLoad = function() {
this.gold = this.node.getChildByName("gold").getComponent(cc.Label);
this.state = this.node.getChildByName("state");
this.prog = this.node.getChildByName("prog");
for (var e = this.node.getChildByName("poker"), t = 0; t < 5; t++) {
var i = e.children[t];
i.startPos = i.getPosition();
}
this.node.active = !1;
};
t.prototype.addPlayer = function(e) {
this.node.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(e.nickname, 7);
wUIHelp.setHead(this.node.getChildByName("head"), e.headimgurl);
this.setGold(e.gold);
this.initShow();
this.node.active = !0;
};
t.prototype.initShow = function() {
this.node.getChildByName("renx").active = !1;
this.setState();
this.initPoker();
this.setOK();
this.setWinGold(0);
};
t.prototype.deletePlayer = function() {
this.node.active = !1;
};
t.prototype.setGold = function(e) {
this.gold.string = wUtils.goldFormat(e);
};
t.prototype.setState = function(e, t) {
var i = this.state.getChildByName(e);
wUIHelp.hideSonNode(this.state);
if (i) {
i.active = t;
if ("qz" == e) {
var o = "";
if (0 == t) {
i.active = !0;
o = "0";
} else t > 0 ? o = "x" + t : i.active = !1;
i.getChildByName("qz").getComponent(cc.Label).string = o;
} else "bet" == e && t && (i.getChildByName("qz").getComponent(cc.Label).string = "x" + t);
}
};
t.prototype.setProgTime = function(e) {
if (e <= 0) this.prog.active = !1; else {
this.prog.active = !0;
this.prog.getComponent(cc.Animation).play("progAnim").speed = 1 / e;
}
};
t.prototype.setOK = function(e) {
void 0 === e && (e = !1);
var t = this.node.getChildByName("ok");
t && (t.active = e);
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
try {
var e = this.node.getChildByName("renx");
e.active = !0;
wUIHelp.playSpine(e, "animation", function() {
e.active = !1;
});
} catch (e) {
wLog.w("---------", e);
}
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
for (var i = t % 100 - 1, o = {
pai: "plist_puke_value_" + i % 2 + "_" + Math.floor(t / 100),
hua: "plist_puke_color_small_" + i,
dh: "plist_puke_color_big_" + i
}, a = 0, n = e.children; a < n.length; a++) {
var s = n[a], r = this.poker.getSpriteFrame(o[s.name]);
s.getComponent(cc.Sprite).spriteFrame = r;
s.active = !0;
}
};
t.prototype.setPokerType = function(e) {
this.node.getChildByName("type").active = !0;
var t = this.typeImg[e - 1];
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
this.node.getChildByName("type").getComponent(cc.Sprite).spriteFrame = this.bgImg[i];
if (0 != i) for (var o = 2; o < 5; o++) this.node.getChildByName("poker").getChildByName("" + o).x += 20;
if ("0" == this.node.name) {
var a = 1;
wGameData.getKey("headimgurl") % 12 < 6 && (a = 0);
var n = e - 1;
n > 10 && (n = 10);
var s = "sound/effect_niu_" + a + "_" + n;
wAudioMgr.playSound(s, "QZNN");
}
};
t.prototype.showFPAnim = function(e) {
var t = this, i = this.node.getChildByName("poker");
i.active = !0;
var o = wUtils.world_local_POS(i, wUtils.local_world__POS(this.node.parent));
o.y -= 85;
var a = i.children[0].startPos, n = wUtils.VectorLen(o, a), s = "0" == this.node.name ? -300 : 0, r = cc.v2(o.x + n / 2 + s, o.y + 120), c = n / 500 * .32;
c < .25 && (c = .3);
for (var l = 0; l < 5; l++) {
var d = i.children[l];
wUIHelp.hideSonNode(d, !1);
var p = this.poker.getSpriteFrame("plist_puke_back_big_2");
d.getComponent(cc.Sprite).spriteFrame = p;
d.setPosition(o);
d.scale = .2;
var h = cc.delayTime(.05 * l), u = cc.callFunc(function() {}), m = cc.bezierTo(c, [ o, r, a ]).easing(cc.easeIn(.8)), y = cc.scaleTo(c, 1), g = cc.spawn(m, y), _ = void 0;
if (4 == l) {
var f = cc.callFunc(function() {
t.movePokerAnim(e);
});
_ = cc.sequence(h, u, g, f);
} else _ = cc.sequence(h, u, g);
d.runAction(_);
}
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
__decorate([ n(cc.SpriteFrame) ], t.prototype, "typeImg", void 0);
__decorate([ n(cc.SpriteFrame) ], t.prototype, "bgImg", void 0);
return __decorate([ a ], t);
}(cc.Component);
i.default = s;
cc._RF.pop();
}, {} ]
}, {}, [ "QZNNLoad", "QZNNRoom", "QZNN_Controlle", "QZNN_Player" ]);