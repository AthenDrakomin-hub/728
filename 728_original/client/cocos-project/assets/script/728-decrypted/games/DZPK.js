window.__require = function e(t, i, o) {
function a(s, l) {
if (!i[s]) {
if (!t[s]) {
var r = s.split("/");
r = r[r.length - 1];
if (!t[r]) {
var c = "function" == typeof __require && __require;
if (!l && c) return c(r, !0);
if (n) return n(r, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = r;
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
DZPKControlle: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "e45b6rAZhdG87JEInxfZr/2", "DZPKControlle");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("PokerBase"), a = e("DZPKMode"), n = e("DZPKView"), s = cc._decorator, l = s.ccclass;
s.property;
var r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.Model = null;
t.View = null;
return t;
}
t.prototype.onLoad = function() {
this.initProxy();
this.initEvevt();
this.m_init();
};
t.prototype.initProxy = function() {
var e = this;
this.Model = wUtils.creatorProxy(new a.DZPKModel());
this.View = this.node.getComponent(n.default);
this.View.initShow();
this.Model.onEvevt("allBet", function(t) {
e.View.setAllBet(t);
});
this.Model.onEvevt("stage", function() {});
this.Model.onEvevt("bankeruid", function(t) {
if (t) {
var i = e.Model.getPlayer("uid", t);
e.View.setPlayerBanker(i.l_seat);
}
});
};
t.prototype.m_roomInfo = function(e) {
if (!e.publiccards.length && 2 == e.stage) for (var t in e.allbets) {
!e.curbet[t] && (e.curbet[t] = {
act: 0
});
e.curbet[t].gold = e.allbets[t];
}
this.Model.initRoom(e);
this.Model.stage > 0 ? 0 != this.Model.my_data.cards.length && 3 != this.Model.stage || this.View.showTips("wait", !0) : this.Model.playerList.length < 3 && this.View.showTips("oth", !0);
for (var i = 0; i < this.Model.playerList.length; i++) {
var o = this.Model.playerList[i];
this.addPlayer(o);
if (0 != this.Model.stage && 3 != this.Model.stage) {
var a = this.Model.curbet[o.uid];
a && (o.betGold += a.gold);
if (0 == o.cards.length) this.View.setPlayerOpacity(o.l_seat, !1); else {
o.join = !0;
a && (o.act = a.act);
a && 5 == a.act && this.View.setPlayerOpacity(o.l_seat, !1);
this.View.setPlayerPoker(o.l_seat, o.cards, o.act);
if (0 == o.l_seat) {
var n = e.px[wGameData.getKey("uid")];
n && this.Model.publiccards.length && 5 != o.act && this.View.setPlayerPokerTips(n);
}
if (a) {
this.View.setPlayerBet(o.l_seat, a.gold, !1);
this.View.setPlayerTips(o.l_seat, 4 == a.act && 0 == a.gold ? "3_0" : a.act);
}
}
}
}
if (3 != this.Model.stage) {
this.View.setPubliccards(this.Model.publiccards);
this.Model.notice instanceof Array || this.Msg_DZPK_CallUserAct(this.Model.notice);
var s = {}, l = 0;
for (var r in e.curbet) {
var c = e.curbet[r];
6 == c.act && (s[r] = c.gold);
l += c.gold > 0 ? c.gold : 0;
}
this.Model.currentBet = this.Model.allBet - l;
this.Model.publiccards && this.Model.publiccards.length && this.View.setCurrentBet(this.Model.currentBet, !1);
} else this.Model.allBet = 0;
};
t.prototype.addPlayer = function(e) {
var t = this;
this.View.add_Delete_Player(e.l_seat, e);
e.onEvevt("gold", function() {
t.View.setPlayerGold(e.l_seat, e.gold);
});
};
t.prototype.Msg_DZPK_FaCards = function(e) {
var t = this;
this.View.setPlayerPokerTips(null);
this.Model.publiccards = [];
this.View.setPubliccards([]);
this.Model.stage = 1;
this.Model.bankeruid = e.bankeruid;
var i = e.ingame;
i.includes(wGameData.getKey("uid")) ? this.View.showTips(null, !1) : this.View.showTips("wait", !0);
this.Model.allBet = 0;
for (var o = 0; o < this.Model.playerList.length; o++) {
var a = this.Model.playerList[o];
a.betGold = 0;
this.View.initPlayer(a.l_seat);
this.View.setPlayerOpacity(a.l_seat, i.includes(a.uid));
a.join = i.includes(a.uid);
}
var n = 0, s = this.Model.getPlayer("uid", this.Model.bankeruid).l_seat, l = function(i) {
s > 5 && (s = 0);
var o = r.Model.getPlayer("l_seat", s++);
if (!o || !o.join) return "continue";
o.cards = e.cards;
r.scheduleOnce(function() {
wAudioMgr.playSound("sound/fapaib", "DZPK");
t.View.showFaPai(o.l_seat, e.cards, i >= 6);
}, .1 * n++);
}, r = this;
for (o = 0; o < 12; o++) l(o);
};
t.prototype.Msg_DZPK_StageBet = function(e) {
var t = e.bets;
for (var i in t) {
var o = this.Model.getPlayer("uid", i), a = t[i];
o.betGold += a;
o.gold -= a;
this.View.setPlayerBet(o.l_seat, t[i]);
this.Model.allBet += a;
}
};
t.prototype.Msg_DZPK_CallUserAct = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o, a, n, s, l = this;
return __generator(this, function(r) {
switch (r.label) {
case 0:
this.Model.genGold = e.minbet;
this.Model.callUid = e.uid;
t = this.Model.getPlayer("uid", e.uid);
i = 0;
for (o = this.Model.playerList; i < o.length; i++) {
a = o[i];
this.View.setPlayerTime(a.l_seat, 0);
}
return [ 4, wUtils.syncDelayed(.5, this) ];

case 1:
r.sent();
this.View.setPlayerTime(t.l_seat, e.time);
this.View.setPlayerTips(t.l_seat, null);
if (0 == t.l_seat) if (this.Model.autoList.includes(1)) for (n = 0; n < this.Model.autoList.length; n++) {
s = this.Model.autoList[n];
if (2 == n && s) {
this.scheduleOnce(function() {
l.sendMsgActBet(t.gold >= e.minbet ? e.minbet : t.gold);
}, 1);
break;
}
if (s) {
0 == e.minbet ? this.scheduleOnce(function() {
l.sendMsgActBet(0);
}, 1) : this.scheduleOnce(function() {
l.sendMsgActBet(-1);
}, 1);
this.Model.autoList[n] = 0;
this.View.showAutoBtn(-1);
break;
}
} else this.View.showBtn("bet", e.minbet, this.Model); else 5 != this.Model.my_data.act && this.Model.my_data.join ? this.View.showBtn("auto") : this.View.showBtn("");
return [ 2 ];
}
});
});
};
t.prototype.Msg_DZPK_ActBet = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i;
return __generator(this, function() {
t = this.Model.getPlayer("uid", this.Model.callUid);
i = "young_man";
wGameData.getKey("headimgurl") % 12 < 6 && (i = "young_woman");
switch (e.act) {
case 3:
case 4:
break;

case 5:
wAudioMgr.playSound("sound/" + i + "/fold", "DZPK");
this.View.setPlayerOpacity(t.l_seat, !1);
this.View.recoveryPoker(t.l_seat);
}
if (6 == e.act) {
wAudioMgr.playSound("sound/" + i + "/allin", "DZPK");
this.View.setPlayerTips(t.l_seat, 6, !0);
} else if (0 == e.gold && 5 != e.act) {
wAudioMgr.playSound("sound/dongdong", "DZPK");
this.View.playBGAnim(4);
this.View.setPlayerTips(t.l_seat, "3_0");
} else {
4 == e.act ? wAudioMgr.playSound("sound/" + i + "/call", "DZPK") : 3 == e.act && wAudioMgr.playSound("sound/" + i + "/raise", "DZPK");
this.View.setPlayerTips(t.l_seat, e.act);
}
t.act = e.act;
if (e.gold <= 0) return [ 2 ];
this.Model.allBet += e.gold;
t.gold -= e.gold;
t.betGold += e.gold;
this.View.setPlayerBet(t.l_seat, t.betGold);
return [ 2 ];
});
});
};
t.prototype.Msg_DZPK_PublicCards = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o, a, n, s;
return __generator(this, function(l) {
switch (l.label) {
case 0:
return [ 4, wUtils.syncDelayed(.5, this) ];

case 1:
l.sent();
(s = this.Model.publiccards).push.apply(s, e.cards);
t = 0;
i = 0;
for (o = this.Model.playerList; i < o.length; i++) if ((a = o[i]).join) {
a.betGold && this.View.recoverBet(a.l_seat);
if (a.act < 5) {
this.View.initPlayerBetTips(a.l_seat);
this.View.setPlayerTips(a.l_seat, null);
}
t += a.betGold;
a.betGold = 0;
}
if (!(t > 0)) return [ 3, 3 ];
wAudioMgr.playSound("sound/chipfly", "DZPK");
return [ 4, wUtils.syncDelayed(.7, this) ];

case 2:
l.sent();
this.View.setCurrentBet(this.Model.allBet);
l.label = 3;

case 3:
this.View.showPubliccards(this.Model.publiccards, e.cards.length);
return [ 4, wUtils.syncDelayed(.5, this) ];

case 4:
l.sent();
(n = e.px[wGameData.getKey("uid")]) && this.Model.my_data.join && 5 != this.Model.my_data.act && this.View.setPlayerPokerTips(n);
return [ 2 ];
}
});
});
};
t.prototype.Msg_DZPK_Result = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o, a, n, s, l, r, c, d, h, u, p, g, y, f, m, w;
return __generator(this, function(_) {
switch (_.label) {
case 0:
this.View.showBtn("");
t = 0;
for (i = this.Model.playerList; t < i.length; t++) {
o = i[t];
this.View.setPlayerTime(o.l_seat, 0);
o.betGold = 0;
o.join = !1;
o.act = 0;
}
return [ 4, wUtils.syncDelayed(1.5, this) ];

case 1:
_.sent();
a = this.Model.getPlayer("uid", e.winner);
n = !1;
s = 0;
for (l = this.Model.playerList; s < l.length; s++) {
r = l[s];
this.View.recoverBet(r.l_seat);
r.join && r.betGold && (n = !0);
}
n && wAudioMgr.playSound("sound/chipfly", "DZPK");
return [ 4, wUtils.syncDelayed(.7, this) ];

case 2:
_.sent();
this.View.setCurrentBet(this.Model.allBet);
return [ 4, wUtils.syncDelayed(1, this) ];

case 3:
_.sent();
c = null;
d = null;
h = e.cards;
for (g in h) {
u = h[g];
p = this.Model.getPlayer("uid", g);
this.View.setPlayerPoker(p.l_seat, null, null);
if (u.cards && u.cards.length) {
this.View.playerBrightCard(p.l_seat, a.l_seat, u.hcards, u.cards, u.value);
if (g == a.uid) {
c = u.cards;
d = u.value;
}
}
}
wAudioMgr.playSound("sound/jiesuantishi", "DZPK");
return [ 4, wUtils.syncDelayed(.5, this) ];

case 4:
_.sent();
d && this.View.setPubLiccardColor(c, this.Model.publiccards);
this.Model.my_data.cards = [];
this.View.showGetPlayerBet(a.l_seat);
return [ 4, wUtils.syncDelayed(.5, this) ];

case 5:
_.sent();
this.View.showWinGold(a.l_seat, e.wingold);
e.wingold / this.Model.doublescore > 100 ? wAudioMgr.playSound("sound/bigying", "DZPK") : wAudioMgr.playSound("sound/ying", "DZPK");
for (g in e.usergold) (y = this.Model.getPlayer("uid", g)) && (y.gold = e.usergold[g]);
this.Model.stage = 0;
this.Model.allBet = 0;
return [ 4, wUtils.syncDelayed(4, this) ];

case 6:
_.sent();
this.View.showTips("oth", !0);
this.View.setPubLiccardColor(null, null);
this.View.initAllPoker();
f = 0;
for (m = this.Model.playerList; f < m.length; f++) {
w = m[f];
this.View.setPlayerOpacity(w.l_seat, !0);
this.View.setPlayerPokerOpacity(w.l_seat);
this.View.setPlayerTips(w.l_seat);
}
return [ 2 ];
}
});
});
};
t.prototype.Msg_DZPK_PlayerAct = function(e) {
var t = this.Model.addPlayer(e);
this.addPlayer(t);
0 != this.Model.stage ? this.View.setPlayerOpacity(t.l_seat, !1) : this.View.setPlayerOpacity(t.l_seat, !0);
};
t.prototype.Msg_DZPK_Out = function(e) {
for (var t = 0; t < this.Model.playerList.length; t++) {
var i = this.Model.playerList[t];
if (i.uid == e.uid) {
this.View.add_Delete_Player(i.l_seat, null);
this.Model.playerList.splice(t, 1);
return;
}
}
};
t.prototype.onClick = function(e, t) {
switch (t) {
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
if (this.Model.my_data.join && 5 != this.Model.my_data.act) {
wUIManager.showTips("游戏正在进行中！");
return;
}
wAudioMgr.playCloseSound();
this.m_quitGame();
return;

case "qi":
this.sendMsgActBet(-1);
break;

case "gen":
this.sendMsgActBet(this.Model.genGold);
break;

case "rang":
this.sendMsgActBet(0);
break;

case "jia":
this.View.openSelectBet(!0, this.Model.getSelectBet(), this.Model.my_data.gold, this.Model.doublescore);
break;

case "closeJz":
this.View.openSelectBet(!1);
}
wAudioMgr.playBtnSound();
};
t.prototype.autoOnClick = function(e, t) {
if (this.Model.autoList[t]) this.Model.autoList[t] = 0; else {
this.Model.autoList = [ 0, 0, 0 ];
this.Model.autoList[t] = 1;
this.View.showAutoBtn(t);
wAudioMgr.playBtnSound();
}
};
t.prototype.dmOnClick = function(e, t) {
this.sendMsgActBet(this.Model.getDMBet()[t]);
wAudioMgr.playBtnSound();
};
t.prototype.dcOnClick = function(e, t) {
this.sendMsgActBet(this.Model.getDCBet()[t]);
wAudioMgr.playBtnSound();
};
t.prototype.selectBet = function(e) {
this.sendMsgActBet(e.target.betGold);
};
t.prototype.sendMsgActBet = function(e) {
this.node.getChildByName("btn").active = !1;
wNetWork.send("Msg_DZPK_ActBet", {
gold: e
});
};
t.prototype.initEvevt = function() {
var e = this;
wGEvent.on("Msg_DZPK_PlayerAct", function(t) {
1 == t.status ? e.Msg_DZPK_PlayerAct(t.data) : wLog.e("Msg_DZPK_PlayerAct");
}, this);
wGEvent.on("Msg_DZPK_FaCards", function(t) {
1 == t.status ? e.Msg_DZPK_FaCards(t.data) : wLog.e("Msg_DZPK_FaCards");
}, this);
wGEvent.on("Msg_DZPK_PublicCards", function(t) {
1 == t.status ? e.Msg_DZPK_PublicCards(t.data) : wLog.e("Msg_DZPK_PublicCards");
}, this);
wGEvent.on("Msg_DZPK_StageBet", function(t) {
1 == t.status ? e.Msg_DZPK_StageBet(t.data) : wLog.e("Msg_DZPK_StageBet");
}, this);
wGEvent.on("Msg_DZPK_CallUserAct", function(t) {
1 == t.status ? e.Msg_DZPK_CallUserAct(t.data) : wLog.e("Msg_DZPK_CallUserAct");
}, this);
wGEvent.on("Msg_DZPK_ActBet", function(t) {
1 == t.status ? e.Msg_DZPK_ActBet(t.data) : wLog.e("Msg_DZPK_ActBet");
}, this);
wGEvent.on("Msg_DZPK_Result", function(t) {
1 == t.status ? e.Msg_DZPK_Result(t.data) : wLog.e("Msg_DZPK_Result");
}, this);
wGEvent.on("Msg_DZPK_ChangGold", function(t) {
1 == t.status ? e.Msg_DZPK_ChangGold(t.data) : wLog.e("Msg_DZPK_ChangGold");
}, this);
wGEvent.on("Msg_DZPK_Out", function(t) {
1 == t.status ? e.Msg_DZPK_Out(t.data) : wLog.e("Msg_DZPK_ChangGold");
}, this);
};
t.prototype.Msg_DZPK_ChangGold = function(e) {
this.Model.getPlayer("uid", e.uid).gold = e.gold;
};
t.prototype.m_upGameGold = function() {};
t.prototype.m_NetWorkState = function() {};
return __decorate([ l ], t);
}(o.default);
i.default = r;
cc._RF.pop();
}, {
DZPKMode: "DZPKMode",
DZPKView: "DZPKView",
PokerBase: void 0
} ],
DZPKLoad: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "39d81r3ir9KKp/jByesNis5", "DZPKLoad");
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
var e, t = this;
return __generator(this, function(i) {
switch (i.label) {
case 0:
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
this.preloadGameRes();
return [ 4, new Promise(function(e) {
var i = t.node.getChildByName("main").getChildByName("spine");
wUIHelp.playSpine(i, "start", function() {
wUIHelp.playSpine(i, "idle", null, !0);
});
t.scheduleOnce(function() {
e();
}, .7);
}) ];

case 1:
i.sent();
if (wGameData.isReconnect) this.loadRoom(); else {
e = wGEvent.on("Msg_Hall_GameSessions", function(i) {
t.Msg_Hall_GameSessions(i);
wGEvent.off(e);
t.unscheduleAllCallbacks();
e = null;
}, this);
this.scheduleOnce(function() {
if (e) {
wUIManager.showTips("请求游戏配置失败");
wGEvent.off(e);
wViewMgr.enterHall();
}
}, 10);
wNetWork.send("Msg_Hall_GameSessions", {
gtype: wGameData.gameID
});
}
return [ 2 ];
}
});
});
};
t.prototype.Msg_Hall_GameSessions = function(e) {
if (1 == e.status && e.data) {
wGameData.roomConfig = e.data;
this.loadRoom();
} else {
wLog.e("请求游戏配置失败");
wViewMgr.enterHall();
}
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
DZPKMode: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "a89c09QJp5A3a0pM7Jz4SK5", "DZPKMode");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.DZPKModel = i.DZPKConfig = void 0;
i.DZPKConfig = {
betTime: 15,
pokerColor: {
4: "black",
3: "red",
2: "black",
1: "red"
},
pokerID: {
2: "2",
3: "3",
4: "4",
5: "5",
6: "6",
7: "7",
8: "8",
9: "9",
10: "10",
11: "11",
12: "12",
13: "13",
14: "1"
},
pokerShape: {
4: "shape_spade",
3: "shape_heart",
2: "shape_club",
1: "shape_diamond"
}
};
var o = function(e) {
this.betGold = 0;
Object.assign(this, e);
}, a = function() {
function e() {
this.playerList = [];
this.currentBet = 0;
this.my_l_seat = 0;
this.autoList = [ 0, 0, 0 ];
this.genGold = 0;
}
e.prototype.initRoom = function(e) {
this.publiccards = e.publiccards || [];
this.allBet = e.allbet;
this.notice = e.notice;
var t = e.players.find(function(e) {
return e.uid == wGameData.getKey("uid");
});
this.my_s_seat = t.seat;
for (var i = 0; i < e.players.length; i++) {
var o = this.addPlayer(e.players[i]);
o.uid == wGameData.getKey("uid") && (this.my_data = o);
}
this.level = e.level;
this.doublescore = e.doublescore;
this.curbet = e.curbet;
this.allbets = e.allbets;
this.bankeruid = e.bankeruid;
this.stage = e.stage;
};
e.prototype.addPlayer = function(e) {
var t = e.seat - this.my_s_seat;
t < 0 && (t += 6);
e.l_seat = t;
var i = wUtils.creatorProxy(new o(e));
this.playerList.push(i);
return i;
};
e.prototype.getPlayer = function(e, t) {
for (var i = 0; i < this.playerList.length; i++) {
var o = this.playerList[i];
if (o[e] == t) return o;
}
wLog.w("没有找到该玩家", e, t);
};
e.prototype.getDCBet = function() {
var e = [];
e.push(Math.ceil(.5 * this.allBet));
e.push(Math.ceil(this.allBet * (2 / 3)));
e.push(this.allBet);
return e;
};
e.prototype.getDMBet = function() {
var e = [];
e.push(6 * this.doublescore);
e.push(8 * this.doublescore);
e.push(this.allBet);
return e;
};
e.prototype.getSelectBet = function() {
var e = this.doublescore, t = [];
t.push(20 * e);
t.push(40 * e);
t.push(100 * e);
t.push(200 * e);
t.push(400 * e);
var i = 2 * e + this.genGold;
i = Math.ceil(i);
t.push(i > this.my_data.gold ? this.my_data.gold : i);
return t;
};
e.prototype.getMaxObj = function(e) {
var t = 0;
for (var i in e) e[i] > t && (t = e[i]);
return t;
};
return e;
}();
i.DZPKModel = a;
cc._RF.pop();
}, {} ],
DZPKRoom: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "337d4IIgaFKZqbZRbcW+YNw", "DZPKRoom");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("Config"), a = cc._decorator, n = a.ccclass, s = a.property, l = function(e) {
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
var e = wGameData.roomConfig;
for (var t in e) if (Object.prototype.hasOwnProperty.call(e, t)) {
var i = Number(t) - 1;
this.content.getChildByName("" + i).on("click", this.roomOnClick, this);
}
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
this.top.stopAllActions();
this.top.y = 500;
var e = cc.delayTime(.15), t = cc.moveTo(.2, cc.v2(0, 375)).easing(cc.easeOut(1.5));
this.top.runAction(cc.sequence(e, t));
var i = cc.find("main/spine", this.node);
i.x = -585;
var o = cc.moveTo(.2, cc.v2(-435, -370.37)).easing(cc.easeOut(1.5));
i.opacity = 0;
var a = cc.fadeTo(.3, 255), n = cc.spawn(o, a);
i.runAction(n);
var s = this.content;
s.x = 265;
o = cc.moveTo(.2, cc.v2(115, 0)).easing(cc.easeOut(1.5));
s.opacity = 0;
a = cc.fadeTo(.3, 255);
n = cc.spawn(o, a);
s.runAction(n);
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
var t = e.node.name;
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
i.default = l;
cc._RF.pop();
}, {
Config: void 0
} ],
DZPKView: [ function(e, t, i) {
"use strict";
cc._RF.push(t, "3dc3c0cOyZGKoLtv0D/b2m/", "DZPKView");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = e("Config"), a = e("NodePool"), n = cc._decorator, s = n.ccclass, l = n.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.othTips = null;
t.players = null;
t.allBet = null;
t.currentBet = null;
t.pokerImg = null;
t.typeImg = null;
t.myGold = 0;
t.zdBet = 0;
t.pokerPool = null;
t.chipPool = null;
return t;
}
t.prototype.initShow = function() {
wUIHelp.hideSonNode(this.players);
var e = [ "体验场", "新手场", "初级场", "中级场", "高级场" ][wGameData.roomLevel - 1] + "  小/大盲注:" + [ "1万/2万  前注:20万", "1千/2千  前注:2万", "5千/1万  前注:10万" ][wGameData.roomLevel - 1];
this.node.getChildByName("gameType").getComponent(cc.Label).string = e;
var t = this.node.getChildByName("s_pos").getChildByName("item");
this.pokerPool = new a.default(t, 10);
this.pokerPool.put(t);
t = this.node.getChildByName("chip").getChildByName("item");
this.chipPool = new a.default(t, 10);
this.chipPool.put(t);
this.initAllPoker();
this.setPubliccards([]);
this.playBGAnim(wUtils.random(1, 4));
this.node.getChildByName("allBet").scaleY = cc.winSize.width / 1334;
};
t.prototype.playBGAnim = function(e) {
var t = this, i = this.node.getChildByName("spine");
wUIHelp.playSpine(i, "suiji" + e, function() {
t.playBGAnim(wUtils.random(1, 4));
});
};
t.prototype.add_Delete_Player = function(e, t) {
var i = this.players.children[e];
!i.spos && (i.spos = i.getPosition());
var o = i.getChildByName("info");
if (t) {
e < 2 ? o.y = -360 : o.x = e < 4 ? -360 : 360;
n = cc.moveTo(.25, cc.v2(0, 0));
o.stopAllActions();
o.runAction(n);
i.active = !0;
this.setPlayerInfo(e, t);
this.initPlayer(e);
} else if (i.active) {
var a = e < 2 ? cc.v2(0, -360) : e < 4 ? cc.v2(-360, 0) : cc.v2(360, 0), n = cc.moveTo(.25, a), s = cc.callFunc(function() {
i.active = !1;
});
o.stopAllActions();
o.runAction(cc.sequence(n, s));
}
};
t.prototype.setPlayerInfo = function(e, t) {
var i = this.players.children[e].getChildByName("info");
wUIHelp.setHead(i.getChildByName("head"), t.headimgurl, !0);
var o = t.nickname;
o = wUtils.handleNameLen(o, 3, !1);
i.getChildByName("name").getComponent(cc.Label).string = o;
this.setPlayerGold(e, t.gold);
};
t.prototype.setPlayerGold = function(e, t) {
this.players.children[e].getChildByName("info").getChildByName("gold").getComponent(cc.Label).string = wUtils.goldFormat(t, 2);
};
t.prototype.initPlayer = function(e) {
this.setPlayerTips(e);
this.setPlayerTime(e, null);
this.setPlayerBet(e, null);
this.setPlayerPoker(e, null, null);
this.setPlayerOpacity(e, !0);
};
t.prototype.setPlayerTips = function(e, t, i) {
var o = this.players.children[e].getChildByName("info"), a = o.getChildByName("tips"), n = -1;
switch (t = String(t)) {
case "6":
n = 4;
break;

case "4":
n = 1;
break;

case "5":
n = 2;
break;

case "3":
n = 0;
break;

case "3_0":
n = 3;
}
a.active = -1 != n;
o.getChildByName("name").active = -1 == n;
o.getChildByName("allBet").active = 4 == n;
if (-1 != n) {
var s = this.typeImg.getSpriteFrame("t" + n + ".png");
a.getComponent(cc.Sprite).spriteFrame = s;
if (4 == n && i) {
var l = this.node.getChildByName("allBet");
l.active = !0;
l.stopAllActions();
var r = cc.delayTime(3), c = cc.callFunc(function() {
l.active = !1;
}), d = cc.sequence(r, c);
l.runAction(d);
}
}
};
t.prototype.setPlayerTime = function(e, t) {
var i = this.players.children[e].getChildByName("info").getChildByName("prog");
i.active = Boolean(t);
if (t) {
i.getComponent(cc.Animation).play().speed = 1 / t;
i.stopAllActions();
if (t > 3 && !e) {
var o = cc.delayTime(t - 3), a = cc.callFunc(function() {
wAudioMgr.playSound("sound/half_time", "DZPK");
}), n = cc.sequence(o, a);
i.runAction(n);
}
}
};
t.prototype.setPlayerBet = function(e, t, i) {
void 0 === i && (i = !0);
return __awaiter(this, void 0, void 0, function() {
var o, a, n, s, l, r, c, d, h, u = this;
return __generator(this, function(p) {
switch (p.label) {
case 0:
o = this.players.children[e];
a = o.getChildByName("bet");
if (!t) {
a.active = !1;
return [ 2 ];
}
if (!i) {
a.active = !0;
a.getChildByName("label").getComponent(cc.Label).string = wUtils.goldFormat(t, 2);
return [ 2 ];
}
wAudioMgr.playSound("sound/hechip", "DZPK");
n = this.node.getChildByName("chip");
s = o.getPosition();
l = wUtils.local_world__POS(cc.find("bet/img", o));
l = wUtils.world_local_POS(n, l);
r = [];
c = function(e) {
var i, o, c, h;
return __generator(this, function(p) {
switch (p.label) {
case 0:
(i = d.chipPool.getNode).parent = n;
i.setPosition(s);
i.active = !0;
r.push(i);
o = cc.moveTo(.15, l);
c = cc.callFunc(function() {
if (2 == e) {
for (var i = 0, o = r; i < o.length; i++) {
var n = o[i];
u.chipPool.put(n);
}
a.active = !0;
a.getChildByName("label").getComponent(cc.Label).string = wUtils.goldFormat(t, 2);
}
});
h = cc.sequence(o, c);
i.stopAllActions();
i.runAction(h);
return [ 4, wUtils.syncDelayed(.075, d) ];

case 1:
p.sent();
return [ 2 ];
}
});
};
d = this;
h = 0;
p.label = 1;

case 1:
return h < 3 ? [ 5, c(h) ] : [ 3, 4 ];

case 2:
p.sent();
p.label = 3;

case 3:
h++;
return [ 3, 1 ];

case 4:
return [ 2 ];
}
});
});
};
t.prototype.setPlayerPoker = function(e, t, i) {
var a = this.players.children[e].getChildByName("poker");
a.active = Boolean(t);
t || "0" != e || this.setPlayerPokerTips(null);
if (5 != i || 0 == e) {
if (t && t.length && "0" == a.parent.name) for (var n = 0; n < t.length; n++) {
var s = a.children[n];
wUIHelp.hideSonNode(s);
s.getComponent(cc.Sprite).spriteFrame = this.pokerImg.getSpriteFrame("plist_puke_front_big");
this.setPokerNode(t[n], s);
wUIHelp.setNodeColor(s, 5 == i ? o.Config.colorSet.ash : o.Config.colorSet.white);
}
} else a.active = !1;
};
t.prototype.setPlayerOpacity = function(e, t) {
var i = this.players.children[e].getChildByName("info");
wUIHelp.setNodeColor(i, t ? o.Config.colorSet.white : o.Config.colorSet.ash);
};
t.prototype.initAllPoker = function() {
for (var e = 1; e < 6; e++) {
var t = this.players.children[e].getChildByName("poker");
t.active = !1;
wUIHelp.setNodeColor(t, o.Config.colorSet.white);
}
};
t.prototype.getPokerUrl = function(e) {
var t = Math.floor(e / 100), i = e % 100 - 1;
t >= 14 && (t = 1);
return {
p: "plist_puke_value_" + i % 2 + "_" + t,
xh: "plist_puke_color_big_" + i,
dh: "plist_puke_color_small_" + i
};
};
t.prototype.setPokerNode = function(e, t) {
for (var i = this.getPokerUrl(e), o = 0, a = t.children; o < a.length; o++) {
var n = a[o], s = this.pokerImg.getSpriteFrame(i[n.name]);
n.getComponent(cc.Sprite).spriteFrame = s;
if (!s) {
wLog.w(i);
wLog.e(i[n.name]);
}
n.active = !0;
}
};
t.prototype.setPlayerBanker = function(e) {
var t = this.players.children[e].getChildByName("D"), i = this.node.getChildByName("BankD"), o = wUtils.local_world__POS(t);
o = wUtils.world_local_POS(this.node, o);
if (i.active) {
var a = cc.moveTo(.3, o);
i.runAction(a);
} else {
i.active = !0;
i.setPosition(o);
}
};
t.prototype.setAllBet = function(e) {
this.allBet.string = "底池:" + wUtils.goldFormat(e, 2);
};
t.prototype.setCurrentBet = function(e, t) {
var i = this;
void 0 === t && (t = !0);
this.currentBet.active = Boolean(e);
if (e) {
t && this.scheduleOnce(function() {
var e = i.node.getChildByName("chip");
i.chipPool.recoveryAll(e);
}, .2);
this.currentBet.getChildByName("label").getComponent(cc.Label).string = wUtils.goldFormat(e, 2);
}
};
t.prototype.setThbBet = function(e) {
if (e) {
var t = cc.find("label/cazhi", this.node);
t.getChildByName("label").getComponent(cc.Label).string = wUtils.goldFormat(e, 2);
t.active = !1;
}
};
t.prototype.showTips = function(e, t) {
var i = this.node.getChildByName("tips");
wUIHelp.hideSonNode(i);
var o = i.getChildByName(e);
o ? o.active = t : this.unscheduleAllCallbacks();
};
t.prototype.showBtn = function(e, t, i) {
var a = this.node.getChildByName("btn");
a.active = !0;
wUIHelp.hideSonNode(a);
var n = a.getChildByName(e);
if (n) {
n.active = !0;
if ("bet" == e) {
if (i.publiccards.length > 0) {
var s = n.getChildByName("dichi");
s.active = !0;
n.getChildByName("dm").active = !1;
for (var l = i.getDCBet(), r = 0, c = s.children; r < c.length; r++) {
var d = l[(g = c[r]).name] >= t && l[g.name] <= i.my_data.gold;
g.getComponent(cc.Button).interactable = d;
wUIHelp.setNodeColor(g, d ? o.Config.colorSet.white : o.Config.colorSet.ash);
}
} else {
var h = n.getChildByName("dm");
n.getChildByName("dichi").active = !1;
h.active = !0;
l = i.getDMBet();
for (var u = 0, p = h.children; u < p.length; u++) {
var g;
d = l[(g = p[u]).name] >= t && l[g.name] <= i.my_data.gold;
g.getComponent(cc.Button).interactable = d;
wUIHelp.setNodeColor(g, d ? o.Config.colorSet.white : o.Config.colorSet.ash);
}
}
n.getChildByName("btn_yellow").getComponent(cc.Button).interactable = t + 2 * i.doublescore <= i.my_data.gold;
n.getChildByName("btn_rang").active = t <= 0;
n.getChildByName("btn_green").active = !(t <= 0);
cc.find("btn_green/layout/label", n).getComponent(cc.Label).string = wUtils.goldFormat(t);
}
}
};
t.prototype.showAutoBtn = function(e) {
for (var t = this.node.getChildByName("btn").getChildByName("auto"), i = 0; i < 3; i++) e != i && t.children[i].getComponent(cc.Toggle).uncheck();
};
t.prototype.openSelectBet = function(e, t, i, o) {
var a = this;
this.myGold = i;
var n = this.node.getChildByName("btn").getChildByName("jiabet");
n.active = e;
this.node.getChildByName("btn").getChildByName("bet").active = !e;
if (e) {
for (var s = 0; s < 5; s++) {
var l = n.getChildByName("" + s);
l.children[0].getComponent(cc.Label).string = wUtils.goldFormat(t[s], 2);
l.getComponent(cc.Button).interactable = t[s] <= i;
l.betGold = t[s];
}
var r = n.getChildByName("btn");
r.betGold = t[5];
this.zdBet = t[5];
var c = cc.find("slider/slider/Handle/btn_add", n), d = cc.find("slider/slider/Handle/btn_sub", n);
c.off("click");
d.off("click");
var h = function(e) {
var t = r.betGold + e * o;
a.sliderEvevt({
progress: t / a.myGold
});
};
c.on("click", function() {
h(1);
});
d.on("click", function() {
h(-1);
});
this.sliderEvevt({
progress: 0
});
}
};
t.prototype.sliderEvevt = function(e) {
var t = e.progress, i = this.zdBet / this.myGold;
t < i && (t = i);
t > 1 && (t = 1);
var o = cc.find("btn/jiabet/slider", this.node);
o.getChildByName("slider").getComponent(cc.Slider).progress = t;
o.getChildByName("slider").getComponent(cc.ProgressBar).progress = t;
var a = this.myGold * t;
a = Math.floor(a);
cc.find("slider/Handle/label", o).getComponent(cc.Label).string = wUtils.goldFormat(a, 2);
o.parent.getChildByName("btn").betGold = a;
var n = cc.find("slider/spine", o);
if (t < 1) n.active = !1; else if (!n.active) {
n.active = !0;
wUIHelp.playSpine(n, "start", function() {
wUIHelp.playSpine(n, "idle", null, !1);
});
}
var s = cc.find("slider/bar/layout", o), l = Math.floor(31 * t);
l < 2 && (l = 2);
for (var r = 1; r < 32; r++) s.children[r - 1].active = l >= r;
var c = s.getChildByName("anim");
c.active = !0;
c.setPosition(s.children[l - 1].getPosition());
c.y += 12;
c.children[0].getComponent(cc.Animation).play();
};
t.prototype.showFaPai = function(e, t, i) {
return __awaiter(this, void 0, void 0, function() {
var o, a, n, s, l, r, c, d, h, u, p, g, y, f, m, w, _, v, P, b = this;
return __generator(this, function(C) {
switch (C.label) {
case 0:
o = this.players.children[e].getChildByName("poker");
if (!i) {
o.active = !0;
wUIHelp.hideSonNode(o);
}
a = this.node.getChildByName("s_pos");
(n = this.pokerPool.getNode).parent = a;
n.setPosition(0, 3);
n.scale = .4;
n.angle = -180;
n.active = !0;
s = o.children[Number(i)];
if ("0" == e) {
this.setPokerNode(t[Number(i)], s);
wUIHelp.hideSonNode(s);
s.getComponent(cc.Sprite).spriteFrame = this.pokerImg.getSpriteFrame("plist_puke_back_big_1");
}
l = wUtils.local_world__POS(s);
l = wUtils.world_local_POS(a, l);
r = cc.moveTo(.2, l);
c = cc.rotateTo(.2, 0);
d = cc.scaleTo(.2, s.scaleX, s.scaleY);
h = cc.spawn(r, c, d);
u = cc.callFunc(function() {
s.active = !0;
b.pokerPool.put(n);
});
p = cc.sequence(h, u);
n.runAction(p);
return [ 4, wUtils.syncDelayed(.15, this) ];

case 1:
C.sent();
(g = this.pokerPool.getNode).parent = a;
g.setPosition(0, 3);
g.scale = .4;
g.angle = -180;
g.active = !0;
y = cc.moveTo(.2, l);
f = cc.rotateTo(.2, 0);
m = cc.scaleTo(.2, s.scaleX, s.scaleY);
w = cc.fadeTo(.2, 80);
_ = cc.spawn(y, f, m, w);
v = cc.callFunc(function() {
b.pokerPool.put(g);
"0" == e && 1 == i && b.scheduleOnce(function() {
for (var e = 0, t = o.children; e < t.length; e++) {
var i = t[e];
wUIHelp.hideSonNode(i, !0);
i.getComponent(cc.Sprite).spriteFrame = b.pokerImg.getSpriteFrame("plist_puke_front_big");
}
}, .25);
});
P = cc.sequence(_, v);
g.runAction(P);
return [ 2 ];
}
});
});
};
t.prototype.recoverBet = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o, a, n, s, l, r;
return __generator(this, function(c) {
switch (c.label) {
case 0:
t = this.players.children[e];
if (!(i = t.getChildByName("bet").children[0]).parent.active) return [ 2 ];
o = this.node.getChildByName("chip");
a = wUtils.local_world__POS(i);
a = wUtils.world_local_POS(o, a);
(n = wUtils.local_world__POS(cc.find("label/allbet", this.node))).x += 10;
n = wUtils.world_local_POS(o, n);
s = 0;
c.label = 1;

case 1:
if (!(s < 4)) return [ 3, 4 ];
(l = this.chipPool.getNode).parent = o;
l.setPosition(a);
l.act = !0;
r = cc.moveTo(.25, n);
l.stopAllActions();
l.runAction(r);
return [ 4, wUtils.syncDelayed(.07, this) ];

case 2:
c.sent();
c.label = 3;

case 3:
s++;
return [ 3, 1 ];

case 4:
i.parent.active = !1;
return [ 2 ];
}
});
});
};
t.prototype.showGetPlayerBet = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, o, a, n, s, l, r = this;
return __generator(this, function(c) {
switch (c.label) {
case 0:
t = this.node.getChildByName("chip");
i = this.players.children[e];
o = wUtils.local_world__POS(i);
o = wUtils.world_local_POS(this.node, o);
a = wUtils.local_world__POS(cc.find("label/allbet/img", this.node));
a = wUtils.world_local_POS(t, a);
n = function() {
var e, i, n, l, c;
return __generator(this, function(d) {
switch (d.label) {
case 0:
(e = s.chipPool.getNode).opacity = 255;
e.parent = t;
e.setPosition(a);
e.act = !0;
i = cc.moveTo(.25, o);
n = cc.fadeOut(.15);
l = cc.callFunc(function() {
e.opacity = 255;
r.chipPool.put(e);
});
c = cc.sequence(i, n, l);
e.stopAllActions();
e.runAction(c);
return [ 4, wUtils.syncDelayed(.08, s) ];

case 1:
d.sent();
return [ 2 ];
}
});
};
s = this;
l = 0;
c.label = 1;

case 1:
return l < 5 ? [ 5, n(l) ] : [ 3, 4 ];

case 2:
c.sent();
c.label = 3;

case 3:
l++;
return [ 3, 1 ];

case 4:
return [ 4, wUtils.syncDelayed(1, this) ];

case 5:
c.sent();
this.setCurrentBet(null);
return [ 2 ];
}
});
});
};
t.prototype.showWinGold = function(e, t) {
var i = this.node.getChildByName("win"), o = i.getChildByName("winlabel");
o.zIndex = 20;
o.getComponent(cc.Label).string = "+" + wUtils.goldFormat(t);
var a = this.players.children[e].getPosition();
o.active = !0;
o.setPosition(a);
var n = cc.moveBy(.2, 0, 100).easing(cc.easeOut(1)), s = cc.delayTime(2), l = cc.callFunc(function() {
o.active = !1;
}), r = cc.sequence(n, s, l);
o.runAction(r);
if ("0" == e) {
var c = i.getChildByName("spine");
c.active = !0;
wUIHelp.playSpine(c, "animation", function() {
c.active = !1;
});
}
var d = i.getChildByName("" + e);
if (d) {
d.getChildByName("gold").getComponent(cc.Label).string = wUtils.goldFormat(t);
var h = d.getChildByName("spine");
h.active = !0;
wUIHelp.playSpine(h, "animation", function() {
h.active = !1;
});
} else {
var u = i.getChildByName("winspine");
u.active = !0;
u.setPosition(a);
wUIHelp.playSpine(u, "animation", function() {
u.active = !1;
});
}
};
t.prototype.playerBrightCard = function(e, t, i, a, n) {
return __awaiter(this, void 0, void 0, function() {
var s, l, r, c, d, h, u, p, g, y, f, m, w, _, v, P, b;
return __generator(this, function(C) {
switch (C.label) {
case 0:
s = this.getPokerType(n);
l = this.node.getChildByName("win");
r = l.getChildByName(e == t ? "win" : "lose");
s > 6 && e == t && (r = l.getChildByName("bigwin"));
c = cc.instantiate(r);
l.addChild(c, 10, "" + e);
this.scheduleOnce(function() {
c.destroy();
}, 5);
d = this.players.children[e].getPosition();
c.setPosition(d);
c.active = !0;
h = this.typeImg.getSpriteFrame((e == t ? "w" : "") + s + ".png");
c.getChildByName("type").getComponent(cc.Sprite).spriteFrame = h;
u = c.getChildByName("poker");
p = function(e) {
g.setPokerNode(i[e.name], e);
e.setPosition(-24.5, 3);
var t = cc.moveBy(.15, 0, 50), o = cc.moveBy(.15, 0, -50), a = cc.sequence(t, o).easing(cc.easeOut(1.5)), n = cc.callFunc(function() {
if ("1" == e.name) {
var t = cc.moveTo(.15, cc.v2(28, 3));
e.runAction(t);
}
});
e.runAction(cc.sequence(a, n));
};
g = this;
y = 0;
for (f = u.children; y < f.length; y++) {
_ = f[y];
p(_);
}
return [ 4, wUtils.syncDelayed(.5, this) ];

case 1:
C.sent();
m = 0;
for (w = u.children; m < w.length; m++) {
_ = w[m];
if (e != t) wUIHelp.setNodeColor(_, o.Config.colorSet.ash); else {
v = a.includes(i[_.name]) ? o.Config.colorSet.white : o.Config.colorSet.ash;
wUIHelp.setNodeColor(_, v);
}
}
if (s > 6) {
P = this.node.getChildByName("dwin1");
wUIHelp.hideSonNode(P);
(b = P.getChildByName("" + s)).active = !0;
wUIHelp.playSpine(b, "animation", function() {
b.active = !1;
});
}
return [ 2 ];
}
});
});
};
t.prototype.recoveryPoker = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, i, a, n, s, l, r, c, d, h, u, p, g, y, f = this;
return __generator(this, function(m) {
switch (m.label) {
case 0:
t = this.players.children[e].getChildByName("poker");
i = wUtils.local_world__POS(this.node.getChildByName("s_pos"));
i = wUtils.world_local_POS(t, i);
if (0 == e) return [ 3, 1 ];
a = function(e) {
var a = e.getPosition(), n = cc.moveTo(.3, cc.v2(i)), s = cc.fadeOut(.3), l = cc.callFunc(function() {
f.scheduleOnce(function() {
t.active = !1;
e.opacity = 255;
wUIHelp.setNodeColor(e, o.Config.colorSet.white);
e.setPosition(a);
});
}), r = cc.sequence(n, s, l);
e.runAction(r);
};
n = 0;
for (s = t.children; n < s.length; n++) {
p = s[n];
a(p);
}
return [ 3, 10 ];

case 1:
this.setPlayerPokerTips(null);
l = function(e) {
var t, a, n, s, l, c, d, h;
return __generator(this, function(u) {
switch (u.label) {
case 0:
t = e.getPosition();
a = cc.moveTo(.35, cc.v2(i));
n = cc.fadeTo(.35, 80);
s = cc.scaleTo(.35, .4);
l = cc.rotateTo(.35, -180);
c = cc.callFunc(function() {
f.scheduleOnce(function() {
e.active = !1;
e.opacity = 255;
e.scale = .58;
e.angle = 0;
wUIHelp.setNodeColor(e, o.Config.colorSet.white);
e.setPosition(t);
});
});
d = cc.spawn(a, n, s, l);
h = cc.sequence(d, c);
e.runAction(h);
return [ 4, wUtils.syncDelayed(.15, r) ];

case 1:
u.sent();
return [ 2 ];
}
});
};
r = this;
c = 0;
d = t.children;
m.label = 2;

case 2:
if (!(c < d.length)) return [ 3, 5 ];
p = d[c];
return [ 5, l(p) ];

case 3:
m.sent();
m.label = 4;

case 4:
c++;
return [ 3, 2 ];

case 5:
return [ 4, wUtils.syncDelayed(.2, this) ];

case 6:
m.sent();
h = 0;
u = t.children;
m.label = 7;

case 7:
if (!(h < u.length)) return [ 3, 10 ];
(p = u[h]).active = !0;
g = p.getPosition();
p.y -= 200;
wUIHelp.setNodeColor(p, o.Config.colorSet.ash);
y = cc.moveTo(.3, cc.v2(g));
p.runAction(y);
return [ 4, wUtils.syncDelayed(.06, this) ];

case 8:
m.sent();
m.label = 9;

case 9:
h++;
return [ 3, 7 ];

case 10:
return [ 2 ];
}
});
});
};
t.prototype.initPlayerBetTips = function(e) {
this.players.children[e].getChildByName("info").getChildByName("tips").active = !1;
};
t.prototype.setPlayerPokerOpacity = function(e) {
for (var t = 0, i = this.players.children[e].getChildByName("poker").children; t < i.length; t++) {
var a = i[t];
wUIHelp.setNodeColor(a, o.Config.colorSet.white);
}
};
t.prototype.setPlayerPokerTips = function(e) {
var t = this.players.children[0].getChildByName("type");
t.active = Boolean(e);
if (e) {
var i = this.getPokerType(e), o = this.typeImg.getSpriteFrame(i + ".png");
t.getChildByName("img").getComponent(cc.Sprite).spriteFrame = o;
}
};
t.prototype.getPokerType = function(e) {
var t = e.slice(-10), i = e.length - t.length;
return e.slice(0, i);
};
t.prototype.setPubliccards = function(e) {
var t = this.node.getChildByName("poker");
wUIHelp.hideSonNode(t);
if (e && 0 != e.length) {
t.getChildByName("di").active = !0;
for (var i = 0; i < e.length; i++) {
var o = t.children[i + 1];
o.active = !0;
o.getComponent(cc.Sprite).spriteFrame = this.pokerImg.getSpriteFrame("plist_puke_front_big");
wUIHelp.hideSonNode(o);
this.setPokerNode(e[i], o);
}
}
};
t.prototype.showPubliccards = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
var i, o, a, n, s, l, r, c, d, h, u = this;
return __generator(this, function(p) {
switch (p.label) {
case 0:
i = this.node.getChildByName("poker");
if (0 == e.length) {
wUIHelp.hideSonNode(i);
return [ 2 ];
}
i.active = !0;
if (3 != t && 5 != t) return [ 3, 6 ];
wUIHelp.hideSonNode(i);
i.getChildByName("di").active = !0;
h = 0;
p.label = 1;

case 1:
if (!(h < e.length)) return [ 3, 4 ];
s = i.children[h + 1];
wAudioMgr.playSound("sound/fapaia", "DZPK");
wUIHelp.hideSonNode(s);
s.getComponent(cc.Sprite).spriteFrame = this.pokerImg.getSpriteFrame("plist_puke_back_big_1");
s.active = !0;
!s.spos && (s.spos = s.getPosition());
s.scale = .2;
s.setPosition(-6, 206);
o = cc.scaleTo(.25, .66);
a = cc.moveTo(.25, -246, 13.338);
n = cc.spawn(o, a);
s.runAction(n);
return [ 4, wUtils.syncDelayed(.1, this) ];

case 2:
p.sent();
p.label = 3;

case 3:
h++;
return [ 3, 1 ];

case 4:
return [ 4, wUtils.syncDelayed(.2, this) ];

case 5:
p.sent();
for (h = 0; h < e.length; h++) {
(s = i.children[h + 1]).getComponent(cc.Sprite).spriteFrame = this.pokerImg.getSpriteFrame("plist_puke_front_big");
this.setPokerNode(e[h], s);
if (h) {
l = cc.moveTo(.15, s.spos);
s.runAction(l);
}
}
return [ 3, 10 ];

case 6:
r = i.children[4].active ? 4 : 3;
c = function(t) {
var o, a, n, s, l, r;
return __generator(this, function(c) {
switch (c.label) {
case 0:
wAudioMgr.playSound("sound/fapaia", "DZPK");
o = i.children[t + 1];
wUIHelp.hideSonNode(o);
o.getComponent(cc.Sprite).spriteFrame = d.pokerImg.getSpriteFrame("plist_puke_back_big_1");
o.active = !0;
!o.spos && (o.spos = o.getPosition());
o.scale = .2;
o.setPosition(-6, 206);
a = cc.scaleTo(.25, .66);
n = cc.moveTo(.25, o.spos);
s = cc.spawn(a, n);
l = cc.callFunc(function() {
o.getComponent(cc.Sprite).spriteFrame = u.pokerImg.getSpriteFrame("plist_puke_front_big");
u.setPokerNode(e[t], o);
});
r = cc.sequence(s, l);
o.runAction(r);
return [ 4, wUtils.syncDelayed(.2, d) ];

case 1:
c.sent();
return [ 2 ];
}
});
};
d = this;
h = r;
p.label = 7;

case 7:
return h < e.length ? [ 5, c(h) ] : [ 3, 10 ];

case 8:
p.sent();
p.label = 9;

case 9:
h++;
return [ 3, 7 ];

case 10:
return [ 2 ];
}
});
});
};
t.prototype.setPubLiccardColor = function(e, t) {
var i = this.node.getChildByName("poker");
if (e) for (var a = 0; a < t.length; a++) {
var n = i.children[a + 1], s = e.includes(t[a]) ? o.Config.colorSet.white : o.Config.colorSet.ash;
wUIHelp.setNodeColor(n, s);
} else {
wUIHelp.hideSonNode(i);
wUIHelp.setNodeColor(i, o.Config.colorSet.white);
}
};
__decorate([ l(cc.Node) ], t.prototype, "othTips", void 0);
__decorate([ l(cc.Node) ], t.prototype, "players", void 0);
__decorate([ l(cc.Label) ], t.prototype, "allBet", void 0);
__decorate([ l(cc.Node) ], t.prototype, "currentBet", void 0);
__decorate([ l(cc.SpriteAtlas) ], t.prototype, "pokerImg", void 0);
__decorate([ l(cc.SpriteAtlas) ], t.prototype, "typeImg", void 0);
return __decorate([ s ], t);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {
Config: void 0,
NodePool: void 0
} ]
}, {}, [ "DZPKControlle", "DZPKLoad", "DZPKMode", "DZPKRoom", "DZPKView" ]);