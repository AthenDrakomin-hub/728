window.__require = function t(e, o, n) {
function i(l, s) {
if (!o[l]) {
if (!e[l]) {
var r = l.split("/");
r = r[r.length - 1];
if (!e[r]) {
var c = "function" == typeof __require && __require;
if (!s && c) return c(r, !0);
if (a) return a(r, !0);
throw new Error("Cannot find module '" + l + "'");
}
l = r;
}
var d = o[l] = {
exports: {}
};
e[l][0].call(d.exports, function(t) {
return i(e[l][1][t] || t);
}, d, d.exports, t, e, o, n);
}
return o[l].exports;
}
for (var a = "function" == typeof __require && __require, l = 0; l < n.length; l++) i(n[l]);
return i;
}({
SLWHControlle: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "36acdGxBU1KNrfx1XPYeo0W", "SLWHControlle");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = t("MultiBase"), i = t("SLWHModel"), a = t("SLWHView"), l = cc._decorator, s = l.ccclass;
l.property;
var r = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.View = null;
e.Model = null;
return e;
}
e.prototype.update = function(t) {
if (this.Model.time) {
this.Model.newTime += t;
this.Model.newTime > 1 && this.Model.time--;
}
};
e.prototype.initProxy = function() {
var t = this;
this.View = this.node.getComponent(a.default);
this.Model = wUtils.creatorProxy(new i.SLWHModel());
this.Model.onEvevt("gameState", function(e) {
t.View.setBetBtn(1 == e);
1 != e ? t.View.chip_On_Off(0) : t.Model.gold = t.Model.gold;
t.m_setBankBtn(1 == e);
});
this.Model.onEvevt("time", function(e) {
e = !e || e <= 0 ? 0 : e;
t.View.setTime(e || 0, t.Model.gameState);
t.Model.newTime = 0;
2 == t.Model.gameState && 2 == e && t.ininStart();
});
this.Model.onEvevt("gold", function(e) {
t.View.setMyGold(e);
1 == t.Model.gameState && t.View.chip_On_Off(e);
var o = t.Model.getLastbet(t.Model.lastbet);
1 == t.Model.gameState && o && t.Model.gold;
if (e < i.SLWHConfig.chip[t.Model.selectChip]) for (;i.SLWHConfig.chip[--t.Model.selectChip] && !(e >= i.SLWHConfig.chip[t.Model.selectChip]); ) ;
});
this.Model.onEvevt("selectChip", function(e) {
t.View.selectChip(e);
});
this.Model.onEvevt("playerNum", function(e) {
t.View.upPlayerCpunt(e);
});
this.Model.onEvevt("autoBet", function(e) {
wLog.e(e);
t.View.setBtn_XY(!e);
});
this.Model.onEvevt("lastbet", function(e) {
t.View.setBtn_XY_Img(t.Model.getLastbet(e) && !t.Model.isMyAutoBet);
});
for (var e = function(e) {
var o = Number(e.name);
e.on("click", function() {
t.playerBet(o);
});
}, o = 0, n = cc.find("Node_Region", this.View.UIContent).children; o < n.length; o++) e(n[o]);
var l = !1;
this.View.btn_go_on.on("touchstart", function() {
if (t.Model.getLastbet(t.Model.lastbet)) {
l = !1;
var e = cc.delayTime(1), o = cc.callFunc(function() {
l = !0;
t.Model.autoBet = !0;
if (1 == t.Model.gameState) {
t.Model.isMyAutoBet = !0;
t.lastBet();
}
}), n = cc.sequence(e, o);
t.node.runAction(n);
}
});
this.View.btn_go_on.on("touchend", function() {
if (t.Model.getLastbet(t.Model.lastbet) && !l) {
t.node.stopAllActions();
t.Model.isMyAutoBet = !0;
t.lastBet();
}
});
};
e.prototype.start = function() {
var t = this;
this.initProxy();
this.initNetWorkEvevt();
this.scheduleOnce(function() {
t.m_init();
});
};
e.prototype.m_roomInfo = function(t) {
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic("sound/bg1", "SLWH");
this.Model.initRoom(JSON.parse(JSON.stringify(t)));
this.View.upTrend(this.Model.history);
this.View.initPlayer(t.player);
this.View.init_3D_Deng(this.Model.color_arr);
var e = t.history[t.history.length - 1] || {
other: 1
};
this.View.initDrawAprize(e.other);
this.Model.selectChip = 0;
if (1 == this.Model.gameState) {
this.Model.gold = this.Model.gold;
this.View.setBtn_Bank(!0);
this.Model.getLastbet(this.Model.bet) && (this.Model.lastbet = this.Model.bet);
var o = this.Model.allBet;
for (var n in o) {
var i = this.Model.maxScoreSplit(o[n]);
this.View.initChip(i, n);
this.View.setBetNum(n, o[n]);
this.Model.totalBet += o[n];
}
this.View.setTotalBetNum(this.Model.totalBet);
o = t.mybet;
for (var n in o) {
this.View.setMyBetNum(n, o[n]);
this.Model.myTotalBet += o[n];
}
this.View.setMyTotalBetNum(this.Model.myTotalBet);
} else this.Model.time > 3 && this.View.start_wait();
};
e.prototype.Msg_SLWH_StageBet = function(t) {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function() {
this.Model.color_arr = t.color_arr;
this.View.init_3D_Deng(this.Model.color_arr);
this.View.showBetAnim("show");
this.View.initPlayer(t.player);
this.View.start_bet();
this.Model.gameState = 1;
this.Model.time = t.time;
this.Model.gold = this.Model.gold;
this.Model.selectChip = this.Model.selectChip;
this.Model.isMyAutoBet = !1;
if (this.Model.autoBet) {
this.Model.isMyAutoBet = !0;
this.lastBet();
}
return [ 2 ];
});
});
};
e.prototype.Msg_SLWH_StageEnd = function(t) {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(e) {
switch (e.label) {
case 0:
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic("sound/stop", "SLWH");
this.View.showBetAnim("close");
this.launchAllChip();
this.Model.gameState = 2;
this.Model.time = t.time;
this.View.stop_bet();
this.View.drawAprize(t.result.other);
this.View.showPointerRotate(t.color_index, this.Model.color_arr);
return [ 4, this.View.playAnimalRotate(t.result.animal, t.color_index) ];

case 1:
e.sent();
wAudioMgr.playSound("sound/c" + t.result.color, "SLWH");
this.scheduleOnce(function() {
wAudioMgr.playSound("sound/dw" + t.result.animal, "SLWH");
}, 1);
this.View.moveCamera(!0);
return [ 4, this.View.playAnimalJump(t.result.animal) ];

case 2:
e.sent();
return [ 4, wUtils.syncDelayed(.5, this) ];

case 3:
e.sent();
this.View.moveCamera(!1);
this.View.showResult(t, this.Model);
this.Model.history.push(t.result);
this.View.upTrend(this.Model.history);
this.Model.gold = t.gold;
this.Model.isMyAutoBet = !1;
this.Model.getLastbet(this.Model.bet) && (this.Model.lastbet = this.Model.bet);
this.Model.bet = {};
this.Model.color_arr = t.color_arr;
this.scheduleOnce(function() {
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic("sound/bg1", "SLWH");
}, 3);
return [ 2 ];
}
});
});
};
e.prototype.ininStart = function() {
this.Model.initDesktop();
this.View.initAllBetNum();
this.View.setTotalBetNum(0);
this.View.setMyTotalBetNum(0);
this.View.recoveryChip();
this.View.show_3D_Deng(this.Model.color_arr);
this.View.closeResult();
};
e.prototype.Msg_SLWH_ActBet = function(t) {
var e = wGameData.getKey("uid");
!this.Model.bet[t.region] && (this.Model.bet[t.region] = []);
this.Model.bet[t.region].push(t.gold);
this.upPlayerGold(e, this.Model.gold - t.gold);
for (var o = 0, n = 0, a = this.Model.bet[t.region]; n < a.length; n++) o += a[n];
this.View.setMyBetNum(t.region, o);
this.Model.myTotalBet += t.gold;
this.View.setMyTotalBetNum(this.Model.myTotalBet);
var l = [ t.gold ];
-1 == i.SLWHConfig.chip.indexOf(t.gold) && (l = this.Model.maxScoreSplit(t.gold));
for (var s = 0; s < l.length; s++) this.View.myBet(t.region, l[s]);
};
e.prototype.Msg_SLWH_SysActBet = function(t) {
var e = t.bets;
for (var o in e) {
var n = e[o];
!this.Model.allBet[o] && (this.Model.allBet[o] = 0);
var i = n - this.Model.allBet[o];
this.Model.allBet[o] = n;
for (var a = 0, l = this.Model.scoreSplit(i); a < l.length; a++) {
var s = l[a];
this.Model.jettonList.push([ s, o ]);
}
}
this.initFhip();
};
e.prototype.initFhip = function() {
var t = this;
if (!(this.Model.jettonList.length <= 0)) {
this.Model.jettonList.sort(function() {
return Math.random() > .5 ? -1 : 1;
});
var e = this.Model.time > 2 ? 2 : .5;
this.unscheduleAllCallbacks();
this.schedule(function() {
t.launchFhip();
}, e / this.Model.jettonList.length);
this.schedule(function() {
t.Model.jettonSound = !0;
}, .4);
this.schedule(function() {
t.Model.jettonSound1 = !0;
}, .1);
}
};
e.prototype.launchFhip = function() {
var t = this.Model.jettonList.shift();
if (t) {
this.View.playerBet(t[0], t[1]);
var e = cc.find("Node_UI/View_Jetton", this.node).active;
if (this.Model.jettonSound && e) {
this.Model.jettonSound = !1;
wAudioMgr.playSound("sound/chip", this.m_game);
}
if (this.Model.jettonSound1 && e) {
this.Model.jettonSound1 = !1;
wAudioMgr.playSound("sound/chip1", this.m_game);
}
this.Model.totalBet += t[0];
this.View.setTotalBetNum(this.Model.totalBet);
!this.Model.xzAllBet[t[1]] && (this.Model.xzAllBet[t[1]] = 0);
this.Model.xzAllBet[t[1]] += t[0];
this.View.setBetNum(t[1], this.Model.xzAllBet[t[1]]);
} else this.unscheduleAllCallbacks();
};
e.prototype.upPlayerGold = function(t, e) {
if (t == wGameData.getKey("uid")) {
wGameData.setKey("gold", e);
this.Model.gold = e;
}
};
e.prototype.launchAllChip = function() {
this.unscheduleAllCallbacks();
};
e.prototype.onClick = function(t, e) {
switch (e) {
case "hall":
if (this.Model.getLastbet(this.Model.bet)) {
wUIManager.showTips("游戏进行中,请等待游戏结束", wUIManager.TIPS_OK);
break;
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
break;

case "xzjm":
this.View.showBetAnim("close");
break;

case "xzjm1":
this.View.showBetAnim("show");
break;

case "0":
case "1":
case "2":
case "3":
case "4":
wAudioMgr.playSound("sound/SELECTED", "SLWH");
this.Model.selectChip != e && (this.Model.selectChip = e);
return;

case "playerlist":
wViewMgr.openPage({
path: "prefab/PlayerList",
bundle: "SLWH"
});
break;

case "qxxy":
this.Model.autoBet = !1;
}
wAudioMgr.playBtnSound();
};
e.prototype.playerBet = function(t) {
1 == this.Model.gameState ? -1 != this.Model.selectChip ? wNetWork.send("Msg_SLWH_ActBet", {
gold: i.SLWHConfig.chip[this.Model.selectChip],
region: Number(t)
}) : wUIManager.showTips("请选择下注筹码！", wUIManager.TIPS_WHITE) : wUIManager.showTips("请稍后，还没到下注时间哟！", wUIManager.TIPS_WHITE);
};
e.prototype.lastBet = function() {
var t = this.Model.lastbet, e = !1;
for (var o in t) if (Object.prototype.hasOwnProperty.call(t, o)) {
for (var n = 0, i = 0, a = t[o]; i < a.length; i++) {
var l = a[i];
n += Number(l);
}
if (n) {
wNetWork.send("Msg_SLWH_ActBet", {
gold: n,
region: Number(o)
});
e = !0;
}
}
e && (this.Model.lastbet = {});
};
e.prototype.m_upGameGold = function() {
this.Model.gold = wGameData.getKey("gold");
};
e.prototype.m_NetWorkState = function() {};
e.prototype.initNetWorkEvevt = function() {
var t = this;
wGEvent.on("Msg_SLWH_Out", function(e) {
1 == e.status ? t.Msg_SLWH_Out(e.data) : wLog.e("玩家退出失败");
}, this);
wGEvent.on("Msg_SLWH_StageBet", function(e) {
1 == e.status ? t.Msg_SLWH_StageBet(e.data) : wLog.e("玩家押注失败");
}, this);
wGEvent.on("Msg_SLWH_StageEnd", function(e) {
1 == e.status ? t.Msg_SLWH_StageEnd(e.data) : wLog.e("玩家开奖失败");
}, this);
wGEvent.on("Msg_SLWH_ActBet", function(e) {
1 == e.status ? t.Msg_SLWH_ActBet(e.data) : wLog.e("玩家下注失败");
}, this);
wGEvent.on("Msg_SLWH_SysActBet", function(e) {
1 == e.status ? t.Msg_SLWH_SysActBet(e.data) : wLog.e("桌面情况失败");
}, this);
wGEvent.on("Msg_SLWH_PlayerAct", function(e) {
1 == e.status ? t.Msg_SLWH_PlayerAct(e.data) : wLog.e("玩家退出失败");
}, this);
};
e.prototype.Msg_SLWH_PlayerAct = function() {
this.Model.playerNum++;
};
e.prototype.Msg_SLWH_Out = function(t) {
t.uid != wGameData.getKey("uid") && this.Model.playerNum--;
};
return __decorate([ s ], e);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
MultiBase: void 0,
SLWHModel: "SLWHModel",
SLWHView: "SLWHView"
} ],
SLWHModel: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "22689+K+yNMcpKToOwh9hGc", "SLWHModel");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.SLWHModel = o.SLWH_Icon_Config = o.SLWHConfig = void 0;
o.SLWHConfig = {
chip: [ 1e3, 1e4, 1e5, 1e6, 5e6 ],
angle: [ 0, 13, 27, 42, 56, 71, 86, 100, 115, 131, 147, 163, 180, 196, 211, 228, 244, 259, 274, 289, 304, 318, 332, 345, 0 ],
startPos: [ -187.5, -66, -129 ],
endPos: [ -1105.3, -983.8, -1047 ]
};
o.SLWH_Icon_Config = {
11: 3,
12: 2,
13: 1,
14: 0,
21: 7,
22: 6,
23: 5,
24: 4,
31: 11,
32: 10,
33: 9,
34: 8,
1: 12,
2: 14,
3: 13
};
var n = function() {
function t() {
this.gameState = 1;
this.time = 0;
this.newTime = 0;
this.jettonSound = !0;
this.jettonSound1 = !0;
this.jettonList = [];
this.allBet = {};
this.xzAllBet = {};
this.totalBet = 0;
this.myTotalBet = 0;
this.bet = {};
this.lastbet = {};
this.selectChip = -1;
this.autoBet = !1;
this.isMyAutoBet = !1;
}
t.prototype.initRoom = function(t) {
this.history = t.history;
this.color_arr = t.color_arr;
this.allBet = t.allbet;
this.playerNum = t.allnum;
for (var e in t.mybet) this.bet[e] = [ t.mybet[e] ];
this.gold = wGameData.getKey("gold");
this.gameState = t.stage;
this.time = t.time;
};
t.prototype.getLastbet = function(t) {
var e = 0;
for (var o in t) for (var n = 0, i = t[o]; n < i.length; n++) e += i[n];
return e;
};
t.prototype.initDesktop = function() {
this.allBet = {};
this.xzAllBet = {};
this.bet = {};
this.jettonList = [];
this.totalBet = 0;
this.myTotalBet = 0;
};
t.prototype.scoreSplit = function(t) {
for (var e = []; ;) {
for (var n = 0, i = 4; i > -1; i--) if (t > o.SLWHConfig.chip[i]) {
n = i;
break;
}
if (n < 1) {
for (;t > 0; ) {
e.push(1e3);
t -= 1e3;
}
break;
}
var a = n - 1 > -1 ? n - 1 : 0, l = o.SLWHConfig.chip[wUtils.random(a, n)];
e.push(l);
t -= l;
}
return e;
};
t.prototype.maxScoreSplit = function(t) {
for (var e = [], n = 4; n > -1; n--) for (var i = o.SLWHConfig.chip[n]; t >= i; ) {
e.push(i);
t -= i;
}
return e;
};
return t;
}();
o.SLWHModel = n;
cc._RF.pop();
}, {} ],
SLWHPlayerList: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "f341bWlHBBNx7w1JyEu0WM4", "SLWHPlayerList");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = t("PopupBase"), i = cc._decorator, a = i.ccclass, l = i.property, s = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.content = null;
return e;
}
e.prototype.onLoad = function() {
var t = this;
wUtils.sendMsg("Msg_SLWH_GetUserList", {}, this).then(function(e) {
var o = [];
for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
e[n].uid = n;
o.push(e[n]);
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
var n = cc.instantiate(e);
n.parent = this.content;
n.active = !0;
var i = t[o], a = i.uid == wGameData.getKey("uid") ? i.nickname : i.username;
n.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(a, 5);
wUIHelp.setHead(cc.find("Img_Mask/Img_Head", n), i.headimgurl);
n.getChildByName("gold").getComponent(cc.Label).string = wUtils.goldFormat(i.gold, 1, 1);
}
};
__decorate([ l(cc.Node) ], e.prototype, "content", void 0);
return __decorate([ a ], e);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
SLWHView: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "4c279IJsLFNIr8twKJL1QYZ", "SLWHView");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = t("NodePool"), i = t("SLWHModel"), a = cc._decorator, l = a.ccclass, s = a.property, r = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.chipContent = null;
e.btn_Bank = null;
e.btn_go_on = null;
e.jetton = null;
e.jettonContent = null;
e.jettonPool = null;
e.jettonMovePool = null;
e.jettonMoveSp = null;
e.UIContent = null;
e.trendContent = null;
e.trendImg = null;
e.stage = [];
e.isJettonAnim = !1;
e.betEndPos = {};
e.dengContent = null;
e.dengImg = [];
e.pointer = null;
e.startIDX = 0;
e.animalContent = null;
e.animalClip = [];
e.returnAnimal = null;
e.UICamera = null;
e.SceneCamera = null;
e.dsNode = null;
e.layout = null;
e.result = null;
e.resultImg = null;
e.material = [];
e.winGold = 0;
return e;
}
e.prototype.start = function() {
var t = this, e = function() {
if (t._pendingChips) {
for (var e in t._pendingChips) t.initChip(t._pendingChips[e], e);
t._pendingChips = null;
}
if (t._pendingTrend) {
t.upTrend(t._pendingTrend);
t._pendingTrend = null;
}
if (t._pendingResult) {
t.showResult(t._pendingResult[0], t._pendingResult[1]);
t._pendingResult = null;
}
if (t._pendingJettonAni) {
for (var o = 0; o < t._pendingJettonAni.length; o++) {
var n = t._pendingJettonAni[o];
t.jettonAni(n[0], n[1], n[2], n[3], n[4]);
}
t._pendingJettonAni = null;
}
};
this.jetton || wRes.loadRes("image/ui/slwh_jetton/slwh_jetton", cc.SpriteAtlas, function(o, n) {
o || (t.jetton = n);
e();
}, "SLWH");
this.trendImg || wRes.loadRes("image/ui/slwh_battle_animal_time/slwh_battle_animal_time", cc.SpriteAtlas, function(o, n) {
o || (t.trendImg = n);
e();
}, "SLWH");
this.resultImg || wRes.loadRes("image/ui/slwh_result_sprite/slwh_result_sprite", cc.SpriteAtlas, function(o, n) {
o || (t.resultImg = n);
e();
}, "SLWH");
var o = cc.find("Node_UI/Node_Player/Node_Info/Img_Mask/Img_Head", this.node);
wUIHelp.setHead(o, wGameData.getKey("headimgurl"));
var i = cc.find("Node_UI/Node_Player/Node_Info/Lab_Name", this.node);
i.getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10);
(i = cc.find("Img_Name/Lab_Text", this.UIContent)).getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10);
this.initAllBetNum();
var a = new cc.Node();
a.addComponent(cc.Sprite);
this.jetton && (a.getComponent(cc.Sprite).spriteFrame = this.jetton.getSpriteFrame("1000"));
this.jettonPool = new n.default(a);
this.jettonPool.put(a);
a = cc.find("Node_UI/jettoncopy", this.node);
this.jettonMoveSp = a.getComponent(cc.Sprite).spriteFrame;
this.jettonMovePool = new n.default(a);
this.jettonMovePool.put(a);
for (var l = 0, s = cc.find("Node_Region", this.UIContent).children; l < s.length; l++) {
var r = s[l], c = wUtils.local_world__POS(cc.find("Node_PosArr", r));
c = wUtils.world_local_POS(this.jettonContent, c);
this.betEndPos[r.name] = c;
}
this.scheduleOnce(function() {
cc.find("Node_UI/View_Jetton", t.node).active = !1;
});
};
e.prototype.initChip = function(t, e) {
if (this.jetton) for (var o = 0; o < t.length; o++) {
var n = t[o], i = JSON.parse(JSON.stringify(this.betEndPos[e]));
i.x = wUtils.random(i.x - 35, i.x + 40);
i.y = wUtils.random(i.y - 9, i.y + 9);
var a = this.jettonPool.getNode, l = this.jetton.getSpriteFrame("" + Math.floor(n));
a.getComponent(cc.Sprite).spriteFrame = l;
a.active = !0;
a.setPosition(i);
this.jettonContent.addChild(a, 1, "" + e);
} else {
this._pendingChips || (this._pendingChips = {});
this._pendingChips[e] = t;
}
};
e.prototype.playerBet = function(t, e) {
var o = cc.v2(-520, 308), n = JSON.parse(JSON.stringify(this.betEndPos[e]));
n.x = wUtils.random(n.x - 35, n.x + 40);
n.y = wUtils.random(n.y - 9, n.y + 9);
this.jettonAni(o, n, t, e, 1);
};
e.prototype.myBet = function(t, e) {
var o = i.SLWHConfig.chip.indexOf(e), n = wUtils.local_world__POS(this.chipContent.children[o]);
n = wUtils.world_local_POS(this.jettonContent, n);
var a = JSON.parse(JSON.stringify(this.betEndPos[t]));
a.x = wUtils.random(a.x - 35, a.x + 40);
a.y = wUtils.random(a.y - 9, a.y + 9);
this.jettonAni(n, a, e, t, 1);
};
e.prototype.jettonAni = function(t, e, o, n, i) {
var a = this;
if (this.jetton) {
var l = this.jettonPool.getNode, s = this.jetton.getSpriteFrame("" + Math.floor(o));
l.getComponent(cc.Sprite).spriteFrame = s;
l.active = !1;
l.stopAllActions();
l.setPosition(e);
this.jettonContent.addChild(l, i, "" + n);
if (this.isJettonAnim) {
var r = this.jettonMovePool.getNode;
this.jettonContent.addChild(r, 20, "moveItem");
r.active = !0;
r.setPosition(t);
r.getComponent(cc.Sprite).spriteFrame = this.jettonMoveSp;
var c = t.sub(e).mag() / 200 * .1, d = cc.moveTo(c, e), h = cc.callFunc(function() {
a.jettonMovePool.put(r);
l.active = !0;
}), p = cc.sequence(d, h);
r.runAction(p);
} else l.active = !0;
} else {
this._pendingJettonAni || (this._pendingJettonAni = []);
this._pendingJettonAni.push([ t, e, o, n, i ]);
}
};
e.prototype.recoveryChip = function() {
this.jettonContent.children.length && wLog.w("还有节点没有回收");
this.jettonPool.recoveryAll(this.jettonContent);
};
e.prototype.showBetAnim = function(t) {
var e = this, o = cc.find("Node_UI/View_Jetton", this.node);
if ("close" != t || o.active) {
o.active = !0;
var n = o.getComponent(cc.Animation), i = cc.find("Node_UI/Node_Player/btn_XZ", this.node);
n.on("stop", function() {
if ("show" != t) o.active = !1; else {
e.isJettonAnim = !0;
for (var i = 0, a = e.jettonContent.children; i < a.length; i++) {
var l = a[i];
if ("moveItem" == l.name) {
l.stopAllActions();
e.jettonMovePool.put(l);
} else l.active = !0;
}
}
n.off("stop");
}, this);
n.play(t);
i.active = "show" != t;
"close" == t && (this.isJettonAnim = !1);
}
};
e.prototype.setBetBtn = function(t) {
var e = cc.find("Node_UI/Node_Player/btn_XZ", this.node);
e.getComponent(cc.Button).interactable = t;
wUIHelp.hideSonNode(e);
e.children[Number(t)].active = !0;
};
e.prototype.setBtn_XY = function(t) {
this.btn_go_on.active = t;
};
e.prototype.setBtn_XY_Img = function(t) {
this.btn_go_on.getComponent(cc.Button).interactable = Boolean(t);
};
e.prototype.selectChip = function(t) {
for (var e = 0, o = this.chipContent.children; e < o.length; e++) {
var n = o[e];
if (n.children[1].active && t != n.name) {
n.children[1].active = !1;
var i = n.children[0];
i.y = 10;
var a = cc.moveTo(.1, cc.v2(0, 0));
i.stopAllActions();
i.runAction(a);
}
}
var l = this.chipContent.children[t];
if (l && !l.children[1].active) {
var s = l.children[0];
s.y = 0;
var r = cc.moveTo(.1, cc.v2(0, 10));
s.stopAllActions();
s.runAction(r);
l.children[1].active = !0;
}
};
e.prototype.setBtn_Bank = function() {};
e.prototype.chip_On_Off = function(t) {
for (var e = i.SLWHConfig.chip, o = 0, n = this.chipContent.children; o < n.length; o++) {
var a = n[o], l = Number(a.name);
a.children[0].getComponent(cc.Button).interactable = t >= e[l];
if (t < e[l]) {
a.children[0].setPosition(0, 0);
a.children[1].active = !1;
}
}
};
e.prototype.upTrend = function(t) {
if (this.trendImg) {
var e = this.trendContent.getComponent("Layout_z");
e._removeAllChildren();
var o = cc.find("Node_Record/ScrollView/view/Node_Root", this.UIContent).getComponent("Layout_z");
o._removeAllChildren();
for (var n = t.length, i = n - 1; i >= 0; i--) {
var a = t[i];
a.new = i == n - 1;
e._addClick(a);
o._addClick(a);
}
} else this._pendingTrend = t;
};
e.prototype.upTrendItem = function(t, e) {
if (this.trendImg) {
t.active = !0;
t.getChildByName("spine").active = e.new;
var o = 10 * e.color + e.animal, n = "slwh_animal_" + i.SLWH_Icon_Config[o];
t.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.trendImg.getSpriteFrame(n);
n = "slwh_animal_" + i.SLWH_Icon_Config[e.other];
t.getChildByName("type").getComponent(cc.Sprite).spriteFrame = this.trendImg.getSpriteFrame(n);
}
};
e.prototype.setMyGold = function(t) {
var e = cc.find("Node_UI/Node_Player/Node_Gold/Lab_Count", this.node).getComponent(cc.Label);
e.string = wUtils.goldFormat(t, 2);
(e = cc.find("Img_Gold/Lab_Text", this.UIContent).getComponent(cc.Label)).string = wUtils.goldFormat(t, 2);
};
e.prototype.setMyTotalBetNum = function(t) {
cc.find("Node_UI/Node_Player/Node_DownScore/Lab_Count", this.node).getComponent(cc.Label).string = wUtils.numConvert(t);
};
e.prototype.setTotalBetNum = function(t) {
cc.find("Img_Jetton/Lab_Text", this.UIContent).getComponent(cc.Label).string = wUtils.numConvert(t);
};
e.prototype.initAllBetNum = function() {
for (var t = 0, e = cc.find("Node_Region", this.UIContent).children; t < e.length; t++) {
var o = e[t], n = Number(o.name);
this.setBetNum(n, 0);
this.setMyBetNum(n, 0);
}
};
e.prototype.setBetNum = function(t, e) {
var o = cc.find("Node_Region/" + t + "/Lab_Jetton", this.UIContent);
o && o.getComponent(cc.Label) ? o.getComponent(cc.Label).string = e ? wUtils.numConvert(e) : "0" : wLog.e(t);
};
e.prototype.setMyBetNum = function(t, e) {
cc.find("Node_Region/" + t + "/Lab_SelfJetton", this.UIContent).getComponent(cc.Label).string = e ? wUtils.numConvert(e) : "0";
};
e.prototype.upPlayerCpunt = function(t) {
cc.find("Node_UI/View_Jetton/Node_Up/Btn_PlayerList/Node_Action/Lab_Count", this.node).getComponent(cc.Label).string = "" + t;
};
e.prototype.initPlayer = function(t) {
var e = cc.find("Node_UI/View_Jetton/Node_Up/Lay_PlayerList", this.node);
wUIHelp.hideSonNode(e);
for (var o = 0; o < t.length; o++) {
var n = t[o], i = e.children[o];
if (i) {
wUIHelp.setHead(cc.find("Img_Mask/Img_Head", i), n.headimgurl);
i.getChildByName("Lab_Gold").getComponent(cc.Label).string = wUtils.goldFormat(n.gold, 2);
i.getChildByName("Lab_Name").getComponent(cc.Label).string = n.name;
i.active = !0;
}
}
};
e.prototype.setTime = function(t, e) {
var o = cc.find("Node_UI/Node_Time", this.node), n = o.getChildByName("Img_Text").getComponent(cc.Sprite), i = o.getChildByName("Lab_Time").getComponent(cc.Label), a = o.getChildByName("time_spine");
i.string = (t < 10 ? "0" : "") + t;
if (1 == e) {
n.spriteFrame = this.stage[1];
var l = t <= 5;
i.node.active = !l;
a.active = l;
if (l) {
a.getComponent(sp.Skeleton).setSkin("" + t);
wUIHelp.playSpine(a, "animation");
}
}
if (2 == e) if (t <= 3) {
i.node.active = !0;
a.active = !1;
n.spriteFrame = this.stage[0];
} else {
n.spriteFrame = this.stage[2];
var s = t - 3;
i.string = (s < 10 ? "0" : "") + s;
l = s <= 5;
i.node.active = !l;
a.active = l;
if (l) {
a.getComponent(sp.Skeleton).setSkin("" + s);
wUIHelp.playSpine(a, "animation");
}
}
};
e.prototype.stop_bet = function() {
var t = this.node.getChildByName("Node_UI").getChildByName("tips");
t.active = !0;
t.getComponent(sp.Skeleton).setSkin("3");
wUIHelp.playSpine(t, "animation", function() {
t.active = !1;
});
};
e.prototype.start_bet = function() {
wAudioMgr.playSound("sound/start", "SLWH");
var t = this.node.getChildByName("Node_UI").getChildByName("tips");
t.active = !0;
t.getComponent(sp.Skeleton).setSkin("1");
wUIHelp.playSpine(t, "animation", function() {
t.active = !1;
});
};
e.prototype.start_wait = function() {
var t = this.node.getChildByName("Node_UI").getChildByName("tips");
t.active = !0;
t.getComponent(sp.Skeleton).setSkin("2");
wUIHelp.playSpine(t, "animation2", null);
};
e.prototype.init_3D_Deng = function(t) {
for (var e = 0; e < t.length; e++) {
var o = t[e];
this.dengContent.children[e].getChildByName("default").getComponent(cc.MeshRenderer).setMaterial(0, this.dengImg[o]);
}
};
e.prototype.show_3D_Deng = function(t) {
return __awaiter(this, void 0, void 0, function() {
var e, o, n, i;
return __generator(this, function(a) {
switch (a.label) {
case 0:
this.pointer.stopAllActions();
if (this.returnAnimal) {
this.returnAnimal();
this.returnAnimal = null;
}
e = .03;
o = t.length;
n = o - 1;
a.label = 1;

case 1:
if (!(n >= 0)) return [ 3, 4 ];
this.dengContent.children[n].getChildByName("default").getComponent(cc.MeshRenderer).setMaterial(0, this.dengImg[0]);
return [ 4, wUtils.syncDelayed(e, this) ];

case 2:
a.sent();
a.label = 3;

case 3:
n--;
return [ 3, 1 ];

case 4:
n = o - 1;
a.label = 5;

case 5:
if (!(n >= 0)) return [ 3, 8 ];
i = t[n];
this.dengContent.children[n].getChildByName("default").getComponent(cc.MeshRenderer).setMaterial(0, this.dengImg[i]);
return [ 4, wUtils.syncDelayed(e, this) ];

case 6:
a.sent();
a.label = 7;

case 7:
n--;
return [ 3, 5 ];

case 8:
return [ 2 ];
}
});
});
};
e.prototype.show_One_Deng_L = function(t, e) {
this.dengContent.children[t].getChildByName("default").getComponent(cc.MeshRenderer).setMaterial(0, this.dengImg[e + 3]);
};
e.prototype.show_One_Deng_A = function(t, e) {
this.dengContent.children[t].getChildByName("default").getComponent(cc.MeshRenderer).setMaterial(0, this.dengImg[e]);
};
e.prototype.showPointerRotate = function(t, e) {
var o = this;
wLog.w("-------当前颜色是->:", [ "", "红色", "绿色", "黄色" ][e[t]]);
var n = -1;
this.Play_WheelAction(this.startIDX, t, function() {
o.startIDX = t;
var n = cc.delayTime(.5), i = cc.callFunc(function() {
o.show_One_Deng_A(t, e[t]);
}), a = cc.delayTime(.5), l = cc.callFunc(function() {
o.show_One_Deng_L(t, e[t]);
}), s = cc.repeatForever(cc.sequence(n, i, a, l));
o.pointer.runAction(s);
}, function(t, a) {
var l = i.SLWHConfig.angle[t], s = cc.rotateTo(a, -l), r = cc.callFunc(function() {
-1 != n && o.show_One_Deng_A(n, e[n]);
n = t;
o.show_One_Deng_L(n, e[n]);
}), c = cc.sequence(s, r);
o.pointer.runAction(c);
});
};
e.prototype.Play_WheelAction = function(t, e, o, n) {
for (var i, a, l = this, s = t, r = function(t, e) {
cc.isValid(l) && n(t, e);
}, c = function(t, e) {
void 0 === e && (e = 1);
return (t += e) % 24;
}, d = ((i = t) < (a = e) ? a - i : 24 - i + a) + 72, h = cc.tween({}), p = 0, u = d - 0 - 12; p < u; p++) h.then(cc.tween().call(function() {
r(s = c(s), .026);
}).delay(.026));
var g = function(t) {
var e, o = (e = t / 12) <= 0 ? .026 : e >= 1 ? .2 : .2 * e + .026 * (1.4 - e);
0 == t ? h.then(cc.tween().call(function() {
r(s = c(s), o);
})) : h.then(cc.tween().delay(o).call(function() {
r(s = c(s), o);
}));
};
for (p = 0; p < 12; p++) g(p);
h.then(cc.tween().delay(.1).call(function() {
cc.isValid(l) && o && o();
}));
h.start();
};
e.prototype.playAnimalRotate = function(t, e) {
var o = this;
return new Promise(function(n) {
wLog.w("-------当前动物是->:", [ "", "兔子", "猴子", "熊猫", "狮子" ][t]);
var i = o.animalContent.getChildByName("" + t), a = o.dengContent.children[e].angle - i.angle;
cc.tween(o.animalContent).to(5, {
angle: a + -1800
}, {
easing: "fade"
}).call(function() {
o.animalContent.angle = o.animalContent.angle % 360;
n(1);
}).start();
});
};
e.prototype.playAnimalJump = function(t) {
var e = this;
return new Promise(function(o) {
var n = e.animalContent.getChildByName("" + t).children[1], i = function() {
var o = e.animalClip[t - 1 + 8];
o.speed = 1.3;
o.wrapMode = cc.WrapMode.Normal;
var i = n.getComponent(cc.SkeletonAnimation);
i.stop();
i.defaultClip = o;
i.removeClip(i.getClips()[0]);
i.addClip(o);
i.play();
};
i();
var a = cc.v3(0, 0, 0);
a = n.getPosition(a);
var l = 0 - (Math.abs(n.parent.angle) + n.parent.parent.angle), s = 3 != t ? .3 : .2, r = 3 != t ? .5 : .4;
cc.tween(n).delay(s).to(r, {
position: cc.v3(0, -1, 0)
}).call(function() {
cc.tween(n).delay(.5).by(.4, {
rotationY: (l - 180) % 360
}).delay(.1).call(function() {
e.playAnimalDance(t, o);
}).start();
}).start();
e.returnAnimal = function() {
cc.tween(n).to(.4, {
rotationY: 0
}).call(function() {
i();
}).delay(s).to(r, {
position: a
}).call(function() {
cc.tween(n).delay(.5).to(.4, {
rotationY: -180
}).delay(.1).call(function() {
e.playAnimalStandby(t);
}).start();
}).start();
};
});
};
e.prototype.playAnimalDance = function(t, e) {
var o = this;
wAudioMgr.playSound("sound/s" + t, "SLWH");
var n = cc.find("Node_UI/slwh_dancinggs", this.node);
n.active = !0;
var i = this.animalContent.getChildByName("" + t).children[1], a = this.animalClip[t - 1 + 4];
a.wrapMode = cc.WrapMode.Normal;
var l = i.getComponent(cc.SkeletonAnimation);
l.stop();
l.defaultClip = a;
l.removeClip(l.getClips()[0]);
l.addClip(a);
l.play();
this.scheduleOnce(function() {
l.on("stop", function() {
l.off("stop");
e && e();
o.playAnimalStandby(t);
o.scheduleOnce(function() {
n.active = !1;
}, .5);
});
});
};
e.prototype.playAnimalStandby = function(t) {
var e = this.animalContent.getChildByName("" + t).children[1], o = this.animalClip[t - 1];
o.wrapMode = cc.WrapMode.Loop;
var n = e.getComponent(cc.SkeletonAnimation);
n.stop();
n.defaultClip = o;
n.removeClip(n.getClips()[0], !0);
n.addClip(o);
n.play();
};
e.prototype.moveCamera = function(t) {
cc.tween(this.UICamera).to(1.5, {
position: cc.v3(0, 0, t ? -7 : 0)
}).start();
cc.tween(this.SceneCamera).to(1.5, {
position: cc.v3(0, 0, t ? -1 : 0)
}).start();
};
e.prototype.drawAprize = function(t) {
var e = this, o = i.SLWHConfig.endPos[t - 1], n = i.SLWHConfig.startPos[t - 1], a = this.layout.parent.parent.children[1].children[0].getComponent(cc.MeshRenderer), l = this.layout.parent.parent.children[2].children[0].getComponent(cc.MeshRenderer);
cc.tween(this.layout).to(3, {
position: cc.v3(4.2, o, -26.45)
}, {
easing: "fade"
}).call(function() {
e.layout.y = n;
}).start();
cc.tween(this.dsNode).to(.1, {
rotationY: 5
}).call(function() {
a.setMaterial(0, e.material[0]);
l.setMaterial(0, e.material[1]);
}).to(.1, {
rotationY: -5
}).call(function() {
a.setMaterial(0, e.material[1]);
l.setMaterial(0, e.material[0]);
}).union().repeat(15).call(function() {
a.setMaterial(0, e.material[0]);
l.setMaterial(0, e.material[0]);
}).to(.1, {
rotationY: 0
}).call(function() {
a.setMaterial(0, e.material[1]);
l.setMaterial(0, e.material[1]);
wAudioMgr.playSound("sound/t" + t, "SLWH");
}).start();
};
e.prototype.initDrawAprize = function(t) {
var e = i.SLWHConfig.startPos[t - 1];
this.layout.y = e;
};
e.prototype.showResult = function(t, e) {
if (this.resultImg) {
var o = this, n = this.node.getChildByName("View_GameOver");
n.active = !0;
var a = n.getChildByName("Node_Controller");
a.active = !1;
for (var l = n.getChildByName("spine"), s = 0, r = l.children; s < r.length; s++) r[s].getComponent(cc.ParticleSystem).resetSystem();
wUIHelp.playSpine(l, "start", function() {
wUIHelp.playSpine(l, "idle", null, !0);
});
this.scheduleOnce(function() {
a.active = !0;
n.children[0].on("click", function() {
o.closeResult();
});
}, .4);
var c = cc.find("Node_Time/Lay_Time/Lab_Text", a).getComponent(cc.Label);
c.string = "" + (e.time - 3);
var d = cc.delayTime(.1), h = cc.callFunc(function() {
c.string = "" + (e.time - 3);
}), p = cc.repeatForever(cc.sequence(d, h));
n.runAction(p);
cc.find("Lay_Gold/Lab_Send", a).getComponent(cc.Label).string = wUtils.numConvert(t.bet);
var u = cc.find("Lay_Gold/Lab_Get", a).getComponent(cc.Label);
if (t.win > 0) {
this.winGold = t.win;
wUIHelp.CountUp_(u.node, 0, t.win, 1.5);
} else u.string = "0";
var g = 10 * t.result.color + t.result.animal, m = "slwh_result_animal_" + (i.SLWH_Icon_Config[g] + 1);
this.resultImg && (cc.find("layout/dw/Icon", a).getComponent(cc.Sprite).spriteFrame = this.resultImg.getSpriteFrame(m));
var _ = cc.find("Node_Region/" + g + "/Lab_Text", this.UIContent).getComponent(cc.Label).string;
cc.find("layout/dw/Img_Addr/Lab_Text", a).getComponent(cc.Label).string = "x" + _;
this.resultImg && (cc.find("layout/zx/Icon", a).getComponent(cc.Sprite).spriteFrame = this.resultImg.getSpriteFrame({
1: "slwh_result_animal_13",
2: "slwh_result_animal_15",
3: "slwh_result_animal_14"
}[t.result.other]));
} else this._pendingResult = [ t, e ];
};
e.prototype.closeResult = function() {
var t = this.node.getChildByName("View_GameOver");
t.stopAllActions();
t.children[0].off("click");
if (t.children[0].active && t.active) {
t.children[0].active = !1;
wUIHelp.easeIn(t, function() {
t.active = !1;
t.scale = 1;
t.children[0].active = !0;
});
if (this.winGold) {
var e = cc.find("Node_Controller/Lay_Gold/Lab_Get", t);
e.getComponent(cc.Label).string = "";
var o = wUtils.local_world__POS(e);
o = wUtils.world_local_POS(this.node, o);
this.playWInAnim(this.winGold, o);
this.winGold = 0;
}
}
};
e.prototype.playWInAnim = function(t, e) {
var o = this, n = this.node.getChildByName("win"), i = n.getChildByName("label");
i.scale = .5;
i.getComponent(cc.Label).string = "+" + wUtils.numConvert(t);
i.setPosition(e);
i.active = !0;
var a = n.getChildByName("lz").getComponent(cc.ParticleSystem);
a.node.active = !0;
a.resetSystem();
var l = cc.moveTo(.5, cc.v2(-345, -310)), s = cc.callFunc(function() {
a.stopSystem();
var t = n.getChildByName("spine");
t.active = !0;
wUIHelp.playSpine(t, "animation", function() {
t.active = !1;
});
}), r = cc.scaleTo(.2, 1), c = cc.moveBy(.4, cc.v2(0, 40)), d = cc.callFunc(function() {
o.scheduleOnce(function() {
i.active = !1;
}, .3);
}), h = cc.sequence(l.clone(), s, r, c, d);
i.runAction(h);
a.node.setPosition(e);
a.node.runAction(l);
};
__decorate([ s(cc.Node) ], e.prototype, "chipContent", void 0);
__decorate([ s(cc.Button) ], e.prototype, "btn_Bank", void 0);
__decorate([ s(cc.Node) ], e.prototype, "btn_go_on", void 0);
__decorate([ s(cc.SpriteAtlas) ], e.prototype, "jetton", void 0);
__decorate([ s(cc.Node) ], e.prototype, "jettonContent", void 0);
__decorate([ s(cc.Node) ], e.prototype, "UIContent", void 0);
__decorate([ s(cc.Node) ], e.prototype, "trendContent", void 0);
__decorate([ s(cc.SpriteAtlas) ], e.prototype, "trendImg", void 0);
__decorate([ s(cc.SpriteFrame) ], e.prototype, "stage", void 0);
__decorate([ s(cc.Node) ], e.prototype, "dengContent", void 0);
__decorate([ s(cc.Material) ], e.prototype, "dengImg", void 0);
__decorate([ s(cc.Node) ], e.prototype, "pointer", void 0);
__decorate([ s(cc.Node) ], e.prototype, "animalContent", void 0);
__decorate([ s(cc.SkeletonAnimationClip) ], e.prototype, "animalClip", void 0);
__decorate([ s(cc.Node) ], e.prototype, "UICamera", void 0);
__decorate([ s(cc.Node) ], e.prototype, "SceneCamera", void 0);
__decorate([ s(cc.Node) ], e.prototype, "dsNode", void 0);
__decorate([ s(cc.Node) ], e.prototype, "layout", void 0);
__decorate([ s(cc.Node) ], e.prototype, "result", void 0);
__decorate([ s(cc.SpriteAtlas) ], e.prototype, "resultImg", void 0);
__decorate([ s(cc.Material) ], e.prototype, "material", void 0);
return __decorate([ l ], e);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {
NodePool: void 0,
SLWHModel: "SLWHModel"
} ],
SLWH_Load: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "bf5b9VkU75JkrSfc+pyNaJj", "SLWH_Load");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = t("Config"), i = cc._decorator, a = i.ccclass;
i.property;
var l = function(t) {
__extends(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onLoad = function() {
var t = this, e = n.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir(e.prefabUrl, e.enName);
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
this.scheduleOnce(function() {
var e = t.node.getChildByName("spine");
try {
e && wUIHelp.playSpine(e, "start", function() {
wUIHelp.playSpine(e, "idle", function() {
e.active = !1;
}, !1);
});
} catch (e) {}
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
t.node.runAction(cc.sequence(cc.delayTime(.1), cc.fadeOut(1), cc.callFunc(function() {
t.node.destroy();
})));
}, this);
var o = wGEvent.on("Msg_Hall_EnterRoom", function(e) {
t.Msg_Hall_EnterRoom(e);
wGEvent.off(o);
t.unscheduleAllCallbacks();
o = null;
}, this);
t.scheduleOnce(function() {
o && wGEvent.off(o);
}, 20);
wNetWork.send("Msg_Hall_EnterRoom", {
tableid: 0,
gtype: Number(wGameData.gameID),
level: 5
});
}, .6);
};
e.prototype.loadGame = function() {
var t = n.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(t.prefabUrl, function() {}, function(t, e) {
t ? wLog.e(t) : wViewMgr.openGame(e);
}, t.enName);
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
}
};
return __decorate([ a ], e);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {
Config: void 0
} ]
}, {}, [ "SLWHControlle", "SLWHModel", "SLWHPlayerList", "SLWHView", "SLWH_Load" ]);