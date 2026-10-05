window.__require = function t(e, o, i) {
function n(a, l) {
if (!o[a]) {
if (!e[a]) {
var c = a.split("/");
c = c[c.length - 1];
if (!e[c]) {
var r = "function" == typeof __require && __require;
if (!l && r) return r(c, !0);
if (s) return s(c, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = c;
}
var d = o[a] = {
exports: {}
};
e[a][0].call(d.exports, function(t) {
return n(e[a][1][t] || t);
}, d, d.exports, t, e, o, i);
}
return o[a].exports;
}
for (var s = "function" == typeof __require && __require, a = 0; a < i.length; a++) n(i[a]);
return n;
}({
SHZBiBei: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "9b442qnLGJOu5rmlsb6JsgT", "SHZBiBei");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("PopupBase"), n = cc._decorator, s = n.ccclass, a = n.property, l = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.allImg = null;
e.content = null;
e.zsImg = [];
e.winGold = null;
e.zbet = null;
e.btnList = [];
e.sfBtn = null;
e.playerSpine = null;
return e;
}
e.prototype.init = function(t) {
var e = t.Model, o = t.cb;
this.Model = e;
this.cb = o;
this.zbet.string = wUtils.numConvert(e.score);
this.initHistory();
wGEvent.on("Msg_SHZ_Than", this.Msg_SHZ_Than, this);
wAudioMgr.pauseMusic();
this.playSound();
this.playStartAnim();
};
e.prototype.show = function(t) {
this.init(t);
};
e.prototype.hide = function() {
this.onHide();
this.node.destroy();
};
e.prototype.playSound = function() {
var t = cc.delayTime(8), e = cc.callFunc(function() {
wAudioMgr.playSound("sound/sound_water_compare_wait" + wUtils.random(1, 5), "SHZ");
}), o = cc.repeatForever(cc.sequence(t, e));
this.node.stopAllActions();
this.node.runAction(o);
};
e.prototype.playStartAnim = function() {
for (var t = this, e = 0, o = this.btnList; e < o.length; e++) {
var i = o[e];
wUIHelp.hideSonNode(i.node);
}
this.setSZ(null);
this.setBtnStaus(!1);
wUIHelp.playSpine(this.playerSpine, "shz_shiqian_yaosaizi", function() {
t.playDJAnim();
t.setBtnStaus(!0);
});
};
e.prototype.playDJAnim = function() {
var t = this;
wUIHelp.playSpine(this.playerSpine, "shz_shiqian_idle_1", function() {
wUIHelp.playSpine(t.playerSpine, "shz_shiqian_idle_2", function() {
wUIHelp.playSpine(t.playerSpine, "shz_shiqian_idle_3", function() {
t.playDJAnim();
});
});
});
};
e.prototype.onClick = function(t, e) {
if (this.Model.score) {
wAudioMgr.playBtnSound();
switch (e) {
case "shou":
this.Model.score && wNetWork.send("Msg_SHZ_Collect", []);
this.hide(!1);
break;

default:
this.sfBtn.interactable = !1;
this.setBtnStaus(!1);
wNetWork.send("Msg_SHZ_Than", {
type: Number(e)
});
this.select = this.btnList[Number(e) - 1].node;
this.select.children[0].active = !0;
this.select.children[0].children[0].active = !0;
this.select.children[0].children[1].active = !1;
}
}
};
e.prototype.Msg_SHZ_Than = function(t) {
var e = this;
if (1 == t.status) {
t = t.data;
this.wingold = t.gold;
this.Model.history = t.history;
wAudioMgr.playSound("sound/sound_water_compare_rock", "SHZ");
this.scheduleOnce(function() {
e.setSZ(t.res);
e.showWinGold();
if (t.gold <= 0) wAudioMgr.playSound("sound/sound_water_compare_lose", "SHZ"); else {
wAudioMgr.playSound("sound/sound_water_compare_win", "SHZ");
e.select.children[0].children[1].active = !1;
e.select.children[0].children[1].active = !0;
}
}, .5);
wUIHelp.playSpine(this.playerSpine, t.gold <= 0 ? "shz_shiqian_win" : "shz_shiqian_lose", function() {
wUIHelp.playSpine(e.playerSpine, t.gold <= 0 ? "shz_shiqian_win_daiji" : "shz_shiqian_lose_daiji", function() {
if (t.gold > 0) {
e.scheduleOnce(function() {
e.setSZ(null);
}, .7);
wUIHelp.playSpine(e.playerSpine, "shz_shiqian_gai", function() {
e.playStartAnim();
});
} else e.initEnd();
});
});
} else wLog.e(t);
};
e.prototype.showWinGold = function() {
var t = this.main.getChildByName("win_tip").getChildByName("" + Number(Boolean(this.wingold)));
t.active = !0;
t.getChildByName("label").getComponent(cc.Label).string = this.wingold > 0 ? "" + this.wingold : "" + this.Model.score;
this.initHistory();
this.zbet.string = wUtils.numConvert(this.Model.score);
this.winGold.string = wUtils.numConvert(this.wingold);
this.Model.score = this.wingold;
};
e.prototype.initEnd = function() {
var t = this;
this.Model.score ? this.playSound() : this.scheduleOnce(function() {
t.hide(!1);
}, .5);
};
e.prototype.setSZ = function(t) {
var e = this.main.getChildByName("panzi");
e.active = Boolean(t);
if (t) {
for (var o = 0; o < t.length; o++) {
var i = this.allImg.getSpriteFrame("shzDiceSmall_" + t[o] + "_" + wUtils.random(1, 4));
e.children[o].getComponent(cc.Sprite).spriteFrame = i;
}
var n = this.main.getChildByName("" + this.Model.history[this.Model.history.length - 1]).children[1];
n.active = !0;
for (o = 0; o < t.length; o++) {
i = this.allImg.getSpriteFrame("shzDicBig_" + t[o]);
n.children[o].getComponent(cc.Sprite).spriteFrame = i;
}
var s = t[0] + t[1];
wAudioMgr.playSound("sound/sound_water_compare_point" + s, "SHZ");
} else wUIHelp.hideSonNode(this.main.getChildByName("win_tip"));
};
e.prototype.setBtnStaus = function(t) {
for (var e = 0, o = this.btnList; e < o.length; e++) o[e].interactable = t;
this.main.getChildByName("spine").active = t;
this.sfBtn.interactable = !0;
};
e.prototype.initHistory = function() {
wUIHelp.hideSonNode(this.content);
for (var t = this.Model.history, e = 0; e < t.length; e++) {
var o = this.content.children[e];
o || ((o = cc.instantiate(this.content.children[0])).parent = this.content);
o.getComponent(cc.Sprite).spriteFrame = this.zsImg[t[e] - 1];
o.active = !0;
}
this.content.parent.getComponent(cc.ScrollView).scrollToLeft(0);
};
e.prototype.onHide = function() {
wAudioMgr.resumeMusic();
this.cb && this.cb(this.Model.score);
};
__decorate([ a(cc.SpriteAtlas) ], e.prototype, "allImg", void 0);
__decorate([ a(cc.Node) ], e.prototype, "content", void 0);
__decorate([ a(cc.SpriteFrame) ], e.prototype, "zsImg", void 0);
__decorate([ a(cc.Label) ], e.prototype, "winGold", void 0);
__decorate([ a(cc.Label) ], e.prototype, "zbet", void 0);
__decorate([ a(cc.Button) ], e.prototype, "btnList", void 0);
__decorate([ a(cc.Button) ], e.prototype, "sfBtn", void 0);
__decorate([ a(sp.Skeleton) ], e.prototype, "playerSpine", void 0);
return __decorate([ s ], e);
}(i.default);
o.default = l;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
SHZControlle: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "85396CtLB9Cg7CncJ17spxB", "SHZControlle");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("ArcadeBase"), n = t("SHZLuckyPlayerList"), s = t("SHZModel"), a = t("SHZRotate"), l = t("SHZView"), c = cc._decorator, r = c.ccclass, d = c.property, h = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.btn_auto = null;
e.Rotate = null;
e.View = null;
e.Model = null;
e.LuckyPlayer = null;
return e;
}
e.prototype.start = function() {
this.initProxy();
this.vg_init();
};
e.prototype.initProxy = function() {
var t = this;
this.View = this.node.getComponent(l.default);
this.Model = wUtils.creatorProxy(new s.SHZModel());
this.Model.onEvevt("gameState", function(e) {
t.View.setBtnEnabled(0 == e, t.Model.auto);
t.LuckyPlayer.setBtnState(0 == e);
0 != e ? t.offEvent() : t.onEvent();
});
this.Model.onEvevt("gear", function(e) {
if (e <= 0) t.Model.gear = t.Model.maxgear; else if (e > t.Model.maxgear) t.Model.gear = 1; else {
var o = e * t.Model.di_score;
t.View.setGear(o, o * t.Model.linnum);
cc.sys.localStorage.setItem("SHZgear" + wGameData.roomLevel, e);
}
});
this.Model.onEvevt("gold", function(e) {
t.View.setGold(e);
});
this.Model.onEvevt("auto", function(e) {
t.View.setAutoState(e, t.Model.autoNum);
e && 0 == t.Model.gameState && t.requestRoll();
});
this.Model.onEvevt("autoSelect", function(e) {
t.View.setAutoSelect(e);
});
this.Model.onEvevt("autoNum", function(e) {
t.View.setAutoNum(e);
});
this.Model.gameState = 0;
this.Model.auto = !1;
this.Model.autoSelect = !1;
};
e.prototype.vg_roomInfo = function(t) {
if (!this.vg_isInit) {
this.Model.roomlv = t.level;
this.Model.gold = t.gold;
this.Model.di_score = t.doublescore;
this.Model.history = t.history;
var e = Number(cc.sys.localStorage.getItem("SHZgear" + wGameData.roomLevel)) || t.curgrade;
this.Model.gear = e;
this.Model.maxgear = t.max_multiple;
this.Model.auto = !1;
this.Model.iconList = t.map;
if (t.game) {
this.Model.subGamecount = t.game;
this.Model.gameState = 3;
this.processControlle(3);
return;
}
if (t.score) {
t.resinfo.score = t.score;
this.Model.initRollMsg(t.resinfo);
this.Model.gameState = 3;
this.processControlle(3, "roominfo");
return;
}
}
1 == this.Model.roomlv && 1e7 == this.Model.gold && wUIManager.showConfirmUI_B({
type: 3
});
};
e.prototype.vg_rollMessage = function(t) {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(e) {
switch (e.label) {
case 0:
if (1 != t.status) {
wLog.e("旋转消息出现错误");
this.Model.auto = !1;
return [ 2 ];
}
this.View.showIconStatus(null, !0);
this.View.initRoll();
return [ 4, wUtils.syncDelayed(.1, this) ];

case 1:
e.sent();
this.Model.gameState = 2;
this.Model.initRollMsg(t.data);
this.Model.gold -= this.Model.conscore;
this.View.setMixIcon();
this.View.setTopIcon(this.Model.iconList);
this.View.setStopState(!0);
this.Model.rotateStop = !1;
this.Rotate.roll();
this.Model.subGamecount && wLog.w("----------------------中小游戏了");
wAudioMgr.playSound("sound/sound_water_bt_start", "SHZ");
return [ 2 ];
}
});
});
};
e.prototype.processControlle = function(t, e) {
return __awaiter(this, void 0, void 0, function() {
var t, o, i, n, a, l;
return __generator(this, function(c) {
switch (c.label) {
case 0:
this.View.setBottomIcon(this.Model.iconList);
this.View.setStopState(!1);
return this.Model.rotateStop ? [ 3, 2 ] : [ 4, wUtils.syncDelayed(.2, this) ];

case 1:
c.sent();
c.label = 2;

case 2:
this.View.showIconStatus(this.Model.iconList, !1);
t = 0;
return this.Model.winline.length ? this.Model.rotateStop || e ? [ 3, 5 ] : [ 4, wUtils.syncDelayed(.2, this) ] : [ 3, 7 ];

case 3:
c.sent();
return [ 4, this.View.showLineAnim(this.Model.winline) ];

case 4:
c.sent();
c.label = 5;

case 5:
o = 0;
for (i = 0; i < this.Model.winline.length; i++) {
if ((n = this.Model.winline[i]).multiple > o) {
o = n.multiple;
t = n.type;
}
a = [ n ];
this.View.showIconResult(a);
this.View.showLine(a);
}
this.View.showNodeWinBG();
wAudioMgr.playSound("sound/sound_water_bigwin_shuihu", "SHZ");
return [ 4, wUtils.syncDelayed(.3, this) ];

case 6:
c.sent();
c.label = 7;

case 7:
return this.Model.score ? [ 4, wUtils.syncDelayed(.6, this) ] : [ 3, 10 ];

case 8:
c.sent();
this.View.showWinIcon(this.Model.winline);
this.Model.winType > 2 && s.SHZConfig.soundConfig[t] && wAudioMgr.playSound(s.SHZConfig.soundConfig[t], "SHZ");
return [ 4, this.View.showWinType(this.Model) ];

case 9:
l = c.sent();
this.Model.gold += l;
this.View.hideWinIcon();
this.View.hideLine();
c.label = 10;

case 10:
return this.Model.subGamecount ? [ 4, wUtils.syncDelayed(.4, this) ] : [ 3, 15 ];

case 11:
c.sent();
return [ 4, this.View.startSmallGameAnim() ];

case 12:
c.sent();
return [ 4, this.startSmallGame() ];

case 13:
l = c.sent();
this.Model.gold += l;
return [ 4, wUtils.syncDelayed(.4, this) ];

case 14:
c.sent();
c.label = 15;

case 15:
if (this.Model.auto) if (-1 == this.Model.autoNum) this.requestRoll(); else {
this.Model.autoNum--;
if (this.Model.autoNum > 0) this.requestRoll(); else {
this.Model.gameState = 0;
this.Model.auto = !1;
}
} else {
this.Model.gameState = 0;
this.Model.auto = !1;
}
return [ 2 ];
}
});
});
};
e.prototype.startSmallGame = function() {
var t = this;
return new Promise(function(e) {
wViewMgr.openPage({
path: "prefab/SHZ_smallgame",
data: {
Model: t.Model,
cb: e
},
bundle: "SHZ"
});
});
};
e.prototype.startEvent = function() {
var t = this;
wAudioMgr.playSound("sound/sound-water-bt-click", "SHZ");
this.scheduleOnce(function() {
t.Model.autoSelect = !0;
}, 1);
};
e.prototype.endEvent = function() {
this.unscheduleAllCallbacks();
if (!this.Model.autoSelect) {
this.Model.autoNum = -1;
this.Model.auto = !0;
}
};
e.prototype.onClilk = function(t, e) {
switch (e) {
case "bank":
if (1 == this.Model.roomlv) {
wUIManager.showTips("体验场不能打开银行", wUIManager.TIPS_OK);
return;
}
if (0 != this.Model.gameState) {
wUIManager.showTips("游戏进行中,请等待游戏结束", wUIManager.TIPS_OK);
return;
}
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
break;

case "hall":
wAudioMgr.playCloseSound();
this.vg_quitGame(0 != this.Model.gameState);
return;

case "start":
this.Model.auto || 0 != this.Model.gameState || this.requestRoll();
break;

case "stop":
if (2 == this.Model.gameState) {
this.Model.rotateStop = this.Rotate.stop();
this.View.setStopState(!1);
}
break;

case "closeAuto":
this.Model.autoSelect = !1;
break;

case "stopAuto":
this.Model.auto = !1;
break;

case "add":
wAudioMgr.playSound("sound/sound-water-bt-click", "SHZ");
this.Model.gear++;
return;

case "sub":
wAudioMgr.playSound("sound/sound-water-bt-click", "SHZ");
this.Model.gear--;
return;

default:
this.Model.autoNum = Number(e);
this.Model.auto = !0;
this.Model.autoSelect = !1;
return;
}
wAudioMgr.playBtnSound();
};
e.prototype.requestRoll = function() {
if (this.Model.gear * this.Model.di_score * this.Model.linnum > this.Model.gold) {
this.Model.gameState = 0;
this.Model.auto = !1;
wUIManager.showTips("金币不足");
} else {
this.Model.gameState = 1;
this.vg_sendRollMsg({
multiple: this.Model.gear
});
}
};
e.prototype.rollEnd = function() {
this.Model.gameState = 3;
this.processControlle(this.Model.gameState);
wAudioMgr.stopEffects("sound/sound_water_bt_start");
};
e.prototype.onEvent = function() {
var t = this.btn_auto;
t.on(cc.Node.EventType.TOUCH_START, this.startEvent, this);
t.on(cc.Node.EventType.TOUCH_END, this.endEvent, this);
t.on(cc.Node.EventType.TOUCH_CANCEL, this.endEvent, this);
this.Rotate.setEndCall(this.rollEnd.bind(this));
};
e.prototype.offEvent = function() {
var t = this.btn_auto;
t.off(cc.Node.EventType.TOUCH_START, this.startEvent, this);
t.off(cc.Node.EventType.TOUCH_END, this.endEvent, this);
t.off(cc.Node.EventType.TOUCH_CANCEL, this.endEvent, this);
};
e.prototype.vg_upGameGold = function() {
this.Model.gold = wGameData.getKey("gold");
};
e.prototype.vg_NetWorkState = function() {};
__decorate([ d(cc.Node) ], e.prototype, "btn_auto", void 0);
__decorate([ d(a.default) ], e.prototype, "Rotate", void 0);
__decorate([ d(n.default) ], e.prototype, "LuckyPlayer", void 0);
return __decorate([ r ], e);
}(i.default);
o.default = h;
cc._RF.pop();
}, {
ArcadeBase: void 0,
SHZLuckyPlayerList: "SHZLuckyPlayerList",
SHZModel: "SHZModel",
SHZRotate: "SHZRotate",
SHZView: "SHZView"
} ],
SHZLoad: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "8bd51Sd8slOY6/EujPOctCQ", "SHZLoad");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("Config"), n = cc._decorator, s = n.ccclass, a = n.property, l = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.prog = null;
return e;
}
e.prototype.onLoad = function() {
return __awaiter(this, void 0, void 0, function() {
var t;
return __generator(this, function(e) {
switch (e.label) {
case 0:
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
if (wGameData.isReconnect) return [ 3, 2 ];
t = [ this.preloadGameRes(), this.sendMsg() ];
return [ 4, Promise.all(t) ];

case 1:
e.sent();
e.label = 2;

case 2:
return [ 4, this.preloadGameRes() ];

case 3:
e.sent();
this.loadRoom();
return [ 2 ];
}
});
});
};
e.prototype.sendMsg = function() {
var t = this;
return new Promise(function(e) {
var o = wGEvent.on("Msg_Hall_GameSessions", function(i) {
t.Msg_Hall_GameSessions(i);
wGEvent.off(o);
t.unscheduleAllCallbacks();
o = null;
e();
}, t);
t.scheduleOnce(function() {
if (o) {
wUIManager.showTips("请求游戏配置失败");
wGEvent.off(o);
wViewMgr.enterHall();
e();
}
}, 10);
wNetWork.send("Msg_Hall_GameSessions", {
gtype: wGameData.gameID
});
});
};
e.prototype.Msg_Hall_GameSessions = function(t) {
if (1 == t.status && t.data) wGameData.roomConfig = t.data; else {
wLog.e("请求游戏配置失败");
wViewMgr.enterHall();
}
};
e.prototype.preloadGameRes = function() {
var t = this;
return new Promise(function(e) {
var o = i.Config.GamePrefab[wGameData.gameID], n = [ o.prefabUrl, "prefab/Room" ];
wRes.preloadDir(n, function(e, o) {
var i = e / o || 0;
i *= 544;
t.prog.width < i && (t.prog.width = i);
}, function() {
t.scheduleOnce(function() {
e();
}, .5);
}, o.enName);
});
};
e.prototype.loadRoom = function() {
var t = this, e = wGameData.gameID, o = cc.Canvas.instance.node.getChildByName("Room");
o.active = !0;
var n = i.Config.GamePrefab[e];
wRes.loadRes("prefab/Room", function(e, i) {
return __awaiter(t, void 0, void 0, function() {
return __generator(this, function() {
if (e) {
wViewMgr.enterHall();
return [ 2 ];
}
cc.instantiate(i).parent = o;
wGameData.isReconnect ? this.node.zIndex = 100 : this.node.destroy();
return [ 2 ];
});
});
}, n.enName);
};
__decorate([ a(cc.Node) ], e.prototype, "prog", void 0);
return __decorate([ s ], e);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {
Config: void 0
} ],
SHZLuckyPlayerList: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "18ae9yZ7FlLN7Ydw579i+2P", "SHZLuckyPlayerList");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, n = i.ccclass, s = i.property, a = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.listPb = null;
e.showPb = null;
e.typeImg = [];
e.typeImg_a = [];
e.mulImg = [];
e.mulImg_a = [];
e.rankingImg = [];
e.content = null;
e.item = null;
e.listName = [];
e.newList = [];
e.historyList = [];
e.btnList = [];
e.isPlay = !0;
return e;
}
e.prototype.onLoad = function() {
wGEvent.on("Msg_Game_Back_List", this.Msg_Game_Back_List, this);
var t = wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function(e) {
if (1 == e.status) {
wGEvent.off(t);
wNetWork.send("Msg_Game_Back_List", {
level: wGameData.roomLevel
});
}
}, this);
};
e.prototype.Msg_Game_Back_List = function(t) {
var e = this;
if (1 == t.status) {
this.newList = t.data.new;
this.historyList = t.data.history;
this.listName = [];
this.newList.forEach(function(t) {
e.listName.push({
name: t.nickname,
type: t.type
});
});
this.historyList.forEach(function(t) {
e.listName.push({
name: t.nickname,
type: t.type
});
});
this.carouselName();
}
};
e.prototype.openShow = function() {
var t = this, e = cc.instantiate(this.listPb);
this.node.addChild(e, 10, "listContent");
var o = e.getChildByName("main");
wUIHelp.easeBackOut(o);
o.getChildByName("close").on("click", this.closeList, this);
var i = cc.find("content/toggle1", o), n = cc.find("content/toggle2", o), s = cc.find("checkmark/scrollView", i).getComponent(cc.ScrollView).content;
this.initList(s, this.newList);
i.on("click", function() {
wAudioMgr.playBtnSound();
n.children[0].active = !0;
i.children[0].active = !1;
});
n.on("toggle", function e() {
n.children[0].active = !1;
i.children[0].active = !0;
var o = cc.find("checkmark/scrollView", n).getComponent(cc.ScrollView).content;
t.initList(o, t.historyList);
n.off("toggle", e, t);
}, this);
n.on("click", function() {
wAudioMgr.playBtnSound();
});
};
e.prototype.carouselName = function() {
var t = this;
if (!(this.listName.length <= 0)) {
var e = {
200: 0,
400: 1,
1e3: 2,
2e3: 3
}, o = function(o) {
t.item.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(o.name, 8);
var i = t.item.getChildByName("mul");
i.active = !1;
var n = t.item.getChildByName("type").getComponent(cc.Sprite);
if (1 == o.type) n.spriteFrame = t.typeImg[0]; else if (o.type % 1e4 == 0) n.spriteFrame = t.typeImg[1]; else {
i.active = !0;
n.spriteFrame = t.typeImg[Math.floor(o.type / 1e4) + 1];
i.getComponent(cc.Sprite).spriteFrame = t.mulImg_a[e[o.type % 1e4]];
}
}, i = 0;
o(this.listName[i++]);
var n = cc.delayTime(4), s = cc.moveTo(.2, cc.v2(0, 40)), a = cc.callFunc(function() {
t.item.y = -40;
i >= t.listName.length && (i = 0);
o(t.listName[i++]);
}), l = cc.moveTo(.2, cc.v2(0, 0)), c = cc.repeatForever(cc.sequence(n, s, a, l));
this.item.stopAllActions();
this.item.runAction(c);
}
};
e.prototype.initItem = function(t, e) {
var o = e.i, i = t.getChildByName("play");
i.data = e;
i.on("click", this.play, this);
var n = i.getComponent(cc.Button);
n.interactable = this.isPlay;
this.btnList.push(n);
t.getChildByName("gold").getComponent(cc.Label).string = wUtils.numConvert(e.score);
t.getChildByName("count").getComponent(cc.Label).string = e.playnum;
t.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(e.nickname, 10);
wUIHelp.setHead(cc.find("head/head", t), e.headimgurl);
var s = e.created;
t.getChildByName("time1").getComponent(cc.Label).string = s;
var a = t.getChildByName("ranking");
wUIHelp.hideSonNode(a);
if (o < 3) {
a.getChildByName("img").active = !0;
a.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.rankingImg[o];
} else {
a.getChildByName("label").active = !0;
a.getChildByName("label").getComponent(cc.Label).string = "" + (o + 1);
}
var l = t.getChildByName("type");
wUIHelp.hideSonNode(l);
if (1 == e.type) l.children[0].active = !0; else if (e.type % 1e4 == 0) {
l.children[1].active = !0;
var c = Math.floor(e.type / 1e4) - 1;
l.children[1].getComponent(cc.Sprite).spriteFrame = this.typeImg_a[c];
} else {
l.children[2].active = !0;
c = Math.floor(e.type / 1e4) - 1;
l.children[2].getComponent(cc.Sprite).spriteFrame = this.typeImg_a[c];
l.children[2].children[0].getComponent(cc.Sprite).spriteFrame = this.mulImg[{
200: 0,
400: 1,
1e3: 2,
2e3: 3
}[e.type % 1e4]];
}
t.active = !0;
};
e.prototype.initList = function(t, e) {
var o = t.getComponent("Layout_z"), i = new cc.Component.EventHandler();
i.target = this.node;
i.component = "SHZLuckyPlayerList";
i.handler = "initItem";
o.eventHandler = i;
for (var n = 0; n < e.length; n++) {
var s = e[n];
s.i = n;
o._addClick(s);
}
};
e.prototype.closeList = function() {
wAudioMgr.playCloseSound();
var t = this.node.getChildByName("listContent"), e = t.getChildByName("main");
wUIHelp.easeIn(e, function() {
t.destroy();
});
};
e.prototype.openList = function() {
var t = this;
wAudioMgr.playBtnSound();
wNetWork.send("Msg_Game_Back_List", {
level: wGameData.roomLevel
}, !0);
var e = wGEvent.on("Msg_Game_Back_List", function() {
t.scheduleOnce(function() {
t.openShow();
wGEvent.off(e);
});
}, this);
};
e.prototype.play = function(t) {
var e = this;
wAudioMgr.playBtnSound();
var o = t.node.data;
wLog.i("--\x3e>要播放的信息：", o);
var i = wGEvent.on("Msg_Game_Back_Info", function(t) {
wGEvent.off(i);
if (1 == t.status) {
var n = cc.instantiate(e.showPb);
n.data = t.data;
n.data.nickname = o.nickname;
n.data.headimgurl = o.headimgurl;
wGameData.setTypeData("LP_DATA", t.data);
cc.Canvas.instance.node.getChildByName("Game").addChild(n, 1e3);
}
}, this);
wNetWork.send("Msg_Game_Back_Info", {
id: o.id
}, !0);
};
e.prototype.setBtnState = function(t) {
this.isPlay = t;
for (var e = 0, o = this.btnList; e < o.length; e++) o[e].interactable = t;
};
__decorate([ s(cc.Prefab) ], e.prototype, "listPb", void 0);
__decorate([ s(cc.Prefab) ], e.prototype, "showPb", void 0);
__decorate([ s([ cc.SpriteFrame ]) ], e.prototype, "typeImg", void 0);
__decorate([ s([ cc.SpriteFrame ]) ], e.prototype, "typeImg_a", void 0);
__decorate([ s(cc.SpriteFrame) ], e.prototype, "mulImg", void 0);
__decorate([ s(cc.SpriteFrame) ], e.prototype, "mulImg_a", void 0);
__decorate([ s([ cc.SpriteFrame ]) ], e.prototype, "rankingImg", void 0);
__decorate([ s(cc.Node) ], e.prototype, "content", void 0);
__decorate([ s(cc.Node) ], e.prototype, "item", void 0);
return __decorate([ n ], e);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
SHZLuckyPlayer: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "903ecGol61Hw4KIZj6AOrRs", "SHZLuckyPlayer");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("SHZModel"), n = t("SHZRotate"), s = t("SHZView"), a = cc._decorator, l = a.ccclass, c = a.property, r = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.Rotate = null;
e.cbBtn = null;
e.View = null;
e.Model = null;
e.gameList = [];
return e;
}
e.prototype.onEnable = function() {
this.initProxy();
this.init();
};
e.prototype.init = function() {
var t = this;
this.cbBtn.node.active = !1;
this.cbBtn.interactable = !1;
this.unscheduleAllCallbacks();
var e = JSON.parse(JSON.stringify(this.node.data));
cc.find("bottom/info/name", this.node).getComponent(cc.Label).string = wUtils.handleNameLen(e.nickname, 10);
wUIHelp.setHead(cc.find("bottom/info/head/head", this.node), e.headimgurl);
this.Model.Lucky = e.gameinfo;
this.gameList = [ e.resinfo ];
e.gold = e.resinfo.gold + e.resinfo.conscore;
this.vg_roomInfo(e);
this.scheduleOnce(function() {
var e = {
status: 1,
data: t.gameList.shift()
};
t.vg_rollMessage(e);
}, .3);
};
e.prototype.vg_roomInfo = function(t) {
this.Model.gameState = 1;
this.Model.roomlv = t.level;
this.Model.gold = t.gold;
this.Model.di_score = t.doublescore;
this.Model.history = t.history;
this.Model.gear = t.curgrade;
this.Model.maxgear = t.max_multiple;
this.Model.auto = !1;
this.Model.iconList = t.map;
this.View.setBottomIcon(this.Model.iconList);
};
e.prototype.vg_rollMessage = function(t) {
if (1 == t.status) {
this.View.initRoll();
this.Model.gameState = 2;
this.Model.initRollMsg(t.data);
this.Model.gold -= this.Model.conscore;
this.View.setMixIcon();
this.View.setTopIcon(this.Model.iconList);
this.Rotate.roll();
this.Model.subGamecount && wLog.w("----------------------中小游戏了");
wAudioMgr.playSound("sound/sound_water_bt_start", "SHZ");
} else {
wLog.e("旋转消息出现错误");
this.Model.auto = !1;
}
};
e.prototype.processControlle = function() {
return __awaiter(this, void 0, void 0, function() {
var t, e, o, n, s, a, l = this;
return __generator(this, function(c) {
switch (c.label) {
case 0:
this.View.setBottomIcon(this.Model.iconList);
this.View.setStopState(!1);
return this.Model.rotateStop ? [ 3, 2 ] : [ 4, wUtils.syncDelayed(.2, this) ];

case 1:
c.sent();
c.label = 2;

case 2:
this.View.showIconStatus(this.Model.iconList, !1);
t = 0;
return this.Model.winline.length ? this.Model.rotateStop ? [ 3, 5 ] : [ 4, wUtils.syncDelayed(.2, this) ] : [ 3, 7 ];

case 3:
c.sent();
return [ 4, this.View.showLineAnim(this.Model.winline) ];

case 4:
c.sent();
c.label = 5;

case 5:
e = 0;
for (o = 0; o < this.Model.winline.length; o++) {
if ((n = this.Model.winline[o]).multiple > e) {
e = n.multiple;
t = n.type;
}
s = [ n ];
this.View.showIconResult(s);
this.View.showLine(s);
}
this.View.showNodeWinBG();
wAudioMgr.playSound("sound/sound_water_bigwin_shuihu", "SHZ");
return [ 4, wUtils.syncDelayed(.3, this) ];

case 6:
c.sent();
c.label = 7;

case 7:
return this.Model.score ? [ 4, wUtils.syncDelayed(.6, this) ] : [ 3, 10 ];

case 8:
c.sent();
this.View.showWinIcon(this.Model.winline);
this.Model.winType > 2 && i.SHZConfig.soundConfig[t] && wAudioMgr.playSound(i.SHZConfig.soundConfig[t], "SHZ");
return [ 4, this.View.showWinType(this.Model) ];

case 9:
a = c.sent();
this.Model.gold += a;
this.View.hideWinIcon();
this.View.hideLine();
c.label = 10;

case 10:
return this.Model.subGamecount ? [ 4, wUtils.syncDelayed(.4, this) ] : [ 3, 15 ];

case 11:
c.sent();
return [ 4, this.View.startSmallGameAnim() ];

case 12:
c.sent();
return [ 4, this.startSmallGame() ];

case 13:
a = c.sent();
this.Model.gold += a;
return [ 4, wUtils.syncDelayed(.4, this) ];

case 14:
c.sent();
c.label = 15;

case 15:
if (this.Model.auto) if (-1 == this.Model.autoNum) this.requestRoll(); else {
this.Model.autoNum--;
if (this.Model.autoNum > 0) this.requestRoll(); else {
this.Model.gameState = 0;
this.Model.auto = !1;
}
} else {
this.Model.gameState = 0;
this.Model.auto = !1;
this.cbBtn.node.active = !0;
this.scheduleOnce(function() {
wUIManager.showConfirmUI({
content: "回放已经结束",
horizntalAlign: cc.Label.HorizontalAlign.CENTER,
okTips: "重播",
ok_b_Tips: "去赚豆",
title: "提示",
ok_b_open: !0,
ok_b_CB: function() {
wAudioMgr.stopAllEffects();
cc.isValid(l, !0) && l.node.destroy();
},
okCB: function() {
cc.isValid(l, !0) && l.init();
},
cancelCB: function() {
wAudioMgr.stopAllEffects();
cc.isValid(l, !0) && l.node.destroy();
}
});
}, 5);
}
return [ 2 ];
}
});
});
};
e.prototype.startSmallGame = function() {
var t = this;
return new Promise(function(e) {
wViewMgr.openPage({
path: "prefab/SHZ_smallgame",
data: {
Model: t.Model,
cb: e
},
bundle: "SHZ"
});
});
};
e.prototype.onClilk = function(t, e) {
switch (e) {
case "hall":
wAudioMgr.stopAllEffects();
wAudioMgr.playCloseSound();
this.node.destroy();
return;

case "cb":
this.init();
}
wAudioMgr.playBtnSound();
};
e.prototype.requestRoll = function() {
this.Model.gameState = 1;
};
e.prototype.rollEnd = function() {
this.Model.gameState = 3;
this.processControlle(this.Model.gameState);
wAudioMgr.stopEffects("sound/sound_water_bt_start");
};
e.prototype.initProxy = function() {
var t = this;
this.Rotate.setEndCall(this.rollEnd.bind(this));
this.View = this.node.getComponent(s.default);
this.Model = wUtils.creatorProxy(new i.SHZModel());
this.Model.onEvevt("gameState", function(e) {
t.cbBtn.interactable = 0 == e;
});
this.Model.onEvevt("gear", function(e) {
if (e <= 0) t.Model.gear = t.Model.maxgear; else if (e > t.Model.maxgear) t.Model.gear = 1; else {
var o = e * t.Model.di_score;
t.View.setGear(o, o * t.Model.linnum);
}
});
this.Model.onEvevt("gold", function(e) {
t.View.setGold(e);
});
this.Model.auto = !1;
this.Model.autoSelect = !1;
};
__decorate([ c(n.default) ], e.prototype, "Rotate", void 0);
__decorate([ c(cc.Button) ], e.prototype, "cbBtn", void 0);
return __decorate([ l ], e);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {
SHZModel: "SHZModel",
SHZRotate: "SHZRotate",
SHZView: "SHZView"
} ],
SHZModel: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "3b937HbXzxCeIA/lR2K4rR5", "SHZModel");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.SHZModel = o.SHZConfig = void 0;
o.SHZConfig = {
iconUrl: "shz_icon_",
mixUrl: "shz_icon_",
greyUrl: "shz_iconAng_",
iconNum: 9,
icon_obj: {
1: 9,
2: 1,
3: 2,
4: 3,
5: 4,
6: 5,
7: 6,
8: 7,
9: 8
},
lineConfig: [ [], [ 1, 1, 1, 1, 1 ], [ 2, 2, 2, 2, 2 ], [ 0, 0, 0, 0, 0 ], [ 2, 1, 0, 1, 2 ], [ 0, 1, 2, 1, 0 ], [ 2, 2, 1, 2, 2 ], [ 0, 0, 1, 0, 0 ], [ 1, 0, 0, 0, 1 ], [ 1, 2, 2, 2, 1 ] ],
spineList: [ "", "resiconSpine/shz_spine_9/shz_spine_9", "resiconSpine/shz_spine_1/shz_spine_1", "resiconSpine/shz_spine_2/shz_spine_2", "resiconSpine/shz_spine_3/shz_spine_3", "resiconSpine/shz_spine_4/shz_spine_4", "resiconSpine/shz_spine_5/shz_spine_5", "resiconSpine/shz_spine_6/shz_spine_6", "resiconSpine/shz_spine_7/shz_spine_7", "resiconSpine/shz_spine_8/shz_spine_8" ],
soundConfig: {
1: "sound/sound_water_shuihuzhuan",
2: "sound/sound_water_zhongyitiang",
3: "sound/sound_water_titianxingdao",
4: "sound/sound_water_song",
5: "sound/sound_water_lin",
6: "sound/sound_water_lu",
7: "sound/sound_water_dadao",
8: "sound/sound_water_yingqiang",
9: "sound/sound_water_futou"
}
};
var i = function() {
function t() {
this.gold = 0;
this.experienceGold = 0;
this.win = 0;
this.iconList = [ [], [], [], [], [] ];
this.auto = !1;
this.autoNum = 0;
this.autoSelect = !1;
this.linnum = 9;
this.gear = 1;
this.maxgear = 6;
this.di_score = 100;
this.roomlv = 0;
this.score = 0;
this.conscore = 0;
this.winline = [];
this.history = [];
this.gameState = 0;
this.winType = 1;
this.subGamecount = 0;
this.Lucky = !1;
}
t.prototype.initRollMsg = function(t) {
this.winline = t.win;
this.subGamecount = t.game;
this.score = t.score;
this.conscore = t.conscore;
this.iconList = t.map;
this.winType = t.type || 4;
};
return t;
}();
o.SHZModel = i;
cc._RF.pop();
}, {} ],
SHZRoom: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "52c8cDWH1VAlqiwAi3CpkX8", "SHZRoom");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("Config"), n = cc._decorator, s = n.ccclass, a = n.property, l = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.content = null;
e.top = null;
e.bottom = null;
e.head = null;
e.nickname = null;
e.gold = null;
e.bankGold = null;
e.isEnterRoom = !1;
e.isExit = !1;
return e;
}
e.prototype.onLoad = function() {
var t = this;
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
t.initShow();
}, this);
wGameData.isReconnect ? this.loadGame() : this.initRoom();
};
e.prototype.onEnable = function() {
if (!wGameData.isReconnect) {
this.gold && (this.gold.string = wUtils.numConvert(wGameData.getKey("gold")));
this.enterAni();
}
};
e.prototype.local_Event = function(t) {
switch (t) {
case "up_Gold":
this.gold && (this.gold.string = wUtils.numConvert(wGameData.getKey("gold")));
this.bankGold && (this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank")));
}
};
e.prototype.initRoom = function() {
var t = wGameData.roomConfig;
for (var e in t) if (Object.prototype.hasOwnProperty.call(t, e)) {
var o = Number(e) - 1;
this.content.getChildByName("" + o).on("click", this.roomOnClick, this);
}
this.head && wUIHelp.setHead(this.head, wGameData.getKey("headimgurl"));
this.nickname && (this.nickname.string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10));
this.bankGold && (this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank")));
};
e.prototype.initShow = function() {
this.isEnterRoom = !1;
this.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
this.node.parent.destroyAllChildren();
}
};
e.prototype.enterAni = function() {
this.top.stopAllActions();
this.top.y = 550;
var t = cc.moveTo(.26, cc.v2(0, 375)).easing(cc.easeOut(1)), e = cc.delayTime(.15), o = cc.sequence(e, t);
this.top.runAction(o);
this.node.getChildByName("main").opacity = 0;
var i = cc.fadeTo(.4, 255);
this.node.getChildByName("main").runAction(i);
for (var n = this.content, s = 0; s < n.childrenCount; s++) {
var a = n.children[s], l = cc.v2(a.x, a.y);
a.x += 250;
var c = cc.moveTo(.2, l).easing(cc.easeBackOut());
c.speed(.35);
a.runAction(c);
}
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
e.prototype.enterRoom = function(t) {
var e = this;
if (!this.isEnterRoom) {
wGameData.roomLevel = t;
var o = wGameData.roomConfig[t];
if (o) if (o.min_gold > wGameData.getKey("gold")) wUIManager.enterRoomFailTips(o.min_gold); else if (wGameData.gameRepair()) wUIManager.showTips("游戏维护中"); else {
this.isEnterRoom = !0;
var i = wGEvent.on("Msg_Hall_EnterRoom", function(t) {
e.Msg_Hall_EnterRoom(t);
wGEvent.off(i);
e.unscheduleAllCallbacks();
i = null;
}, this);
this.scheduleOnce(function() {
if (i) {
e.isEnterRoom = !1;
wGEvent.off(i);
}
}, 20);
wNetWork.send("Msg_Hall_EnterRoom", {
tableid: 0,
gtype: Number(wGameData.gameID),
level: t
});
} else wUIManager.showTips("游戏配置错误，请重新进入游戏！");
}
};
e.prototype.faststart = function() {
var t = wGameData.getKey("gold"), e = wGameData.roomConfig, o = 1;
for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && e[i].min_gold <= t && (o = e[i].level);
this.enterRoom(o);
};
e.prototype.roomOnClick = function(t) {
wAudioMgr.playBtnSound();
var e = t.node.name;
this.enterRoom(Number(e) + 1);
};
e.prototype.onClick = function(t) {
if (!this.isExit) {
switch (t.target.name) {
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
e.prototype.loadGame = function() {
var t = i.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(t.prefabUrl, function() {}, function(t, e) {
t ? wLog.e(t) : wViewMgr.openGame(e);
}, t.enName);
};
__decorate([ a(cc.Node) ], e.prototype, "content", void 0);
__decorate([ a(cc.Node) ], e.prototype, "top", void 0);
__decorate([ a(cc.Node) ], e.prototype, "bottom", void 0);
__decorate([ a(cc.Sprite) ], e.prototype, "head", void 0);
__decorate([ a(cc.Label) ], e.prototype, "nickname", void 0);
__decorate([ a(cc.Label) ], e.prototype, "gold", void 0);
__decorate([ a(cc.Label) ], e.prototype, "bankGold", void 0);
return __decorate([ s ], e);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {
Config: void 0
} ],
SHZRotate: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "6a3f6w75OdIbIiEKOtU9W4Z", "SHZRotate");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = cc._decorator, n = i.ccclass, s = i.property, a = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.rollNodes = [];
e.onRoll = !1;
e.onStop = !1;
e.oneCallback = null;
e.item_h = null;
e.view_h = 3;
return e;
}
e.prototype.onLoad = function() {
this.item_h = this.node.height;
};
e.prototype.roll = function() {
var t = this;
if (this.onRoll) this.stop(); else {
this.onRoll = !0;
for (var e = function(e) {
var i = o.rollNodes[e], n = -(i.height - 2 * o.item_h), s = -(i.height - o.item_h + 40), a = .04 * i.childrenCount;
i.one_pos = n;
i.two_pos = s;
var l = cc.moveTo(a, cc.v2(i.x, n)), c = cc.callFunc(function() {
3 == e && (t.onStop = !0);
}), r = cc.moveTo(.3, cc.v2(i.x, s)).easing(cc.easeOut(5)), d = cc.moveBy(.4, cc.v2(0, 40)).easing(cc.easeBackOut()), h = cc.callFunc(function() {
if (e == t.rollNodes.length - 1) {
t.rotateEnd();
t.oneCallback && t.oneCallback();
}
}), u = cc.sequence(l, c, r, d, h);
i.runAction(u);
}, o = this, i = 0; i < this.rollNodes.length; ++i) e(i);
}
};
e.prototype.stop = function() {
if (!this.onStop) {
this.onStop = !0;
for (var t = 0; t < this.rollNodes.length; ++t) {
var e = this.rollNodes[t];
e.stopAllActions();
var o = e.two_pos + 50;
e.y = o;
if (t == this.rollNodes.length - 1) {
this.rotateEnd();
this.oneCallback && this.oneCallback();
return !0;
}
}
return !1;
}
};
e.prototype.rotateEnd = function() {
this.onRoll = !1;
this.onStop = !1;
};
e.prototype.setEndCall = function(t) {
this.oneCallback = t;
};
__decorate([ s([ cc.Node ]) ], e.prototype, "rollNodes", void 0);
return __decorate([ n ], e);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
SHZSmallGame: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "0b173ZyF2tORKgCT4q4Gjy7", "SHZSmallGame");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("PopupBase"), n = t("SHZModel"), s = cc._decorator, a = s.ccclass, l = s.property, c = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.selectContent = null;
e.rollContent = null;
e.yazhu = null;
e.zj = null;
e.zzj = null;
e.count = null;
e.iconImg = null;
e.winContent = null;
e.list = [];
e.startId = 0;
e.endId = 0;
e.allWinGold = 0;
e.rollData = null;
return e;
}
e.prototype.init = function(t) {
Object.assign(this, t);
this.count.string = "" + this.Model.subGamecount;
var e = 9 * this.Model.gear * this.Model.di_score;
this.yazhu.string = "" + e;
};
e.prototype.show = function(t) {
this.init(t);
this.onShow();
};
e.prototype.hide = function() {
this.onHide();
this.node.destroy();
};
e.prototype.onShow = function() {
wAudioMgr.playBgMusic("sound/sound_water_mary_bg", "SHZ");
this.startAnim();
};
e.prototype.onHide = function() {
this.cb(this.allWinGold);
wAudioMgr.playBgMusic("sound/sound_water_bg", "SHZ");
};
e.prototype.onLoad = function() {
wGEvent.on("Msg_SHZ_Game", this.Msg_SHZ_Game, this);
this.initIcon();
};
e.prototype.initIcon = function() {
this.rollContent.children.forEach(function(t, e) {
for (var o = 0; o < 80 + 2 * e; o++) {
var i = t.children[o];
i || ((i = cc.instantiate(t.children[0])).parent = t);
}
});
};
e.prototype.startAnim = function() {
var t = this;
this.scheduleOnce(function() {
t.sendMsg();
}, 1);
};
e.prototype.endAnim = function() {
var t = this, e = this.main.getChildByName("end");
e.active = !0;
var o = e.children[0], i = 3;
this.schedule(function() {
i--;
o.getComponent(cc.Label).string = "游戏结束 " + i + " 秒后退出！";
i <= 0 && t.hide(!1);
}, 1, 3, 1);
};
e.prototype.sendMsg = function() {
this.unscheduleAllCallbacks();
this.Model.Lucky ? this.Msg_SHZ_Game({
status: 1,
data: this.Model.Lucky
}) : wNetWork.send("Msg_SHZ_Game", []);
};
e.prototype.Msg_SHZ_Game = function(t) {
if (1 == t.status) {
this.list = t.data;
this.playRoll();
}
};
e.prototype.playRoll = function() {
var t = this, e = this.list.shift();
if (e) {
this.rollData = e;
this.endId = this.getEndID(e.outType);
this.Play_WheelAction(this.startId, this.endId, this.endRoll.bind(this));
this.setTopIcon(e.innerTypes);
this.setMixIcon();
this.scheduleOnce(function() {
t.rollContent.getComponent("SHZRotate").roll();
}, .2);
} else this.endAnim();
};
e.prototype.endRoll = function() {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(t) {
switch (t.label) {
case 0:
return [ 4, wUtils.syncDelayed(.5, this) ];

case 1:
t.sent();
this.setBottomIcon(this.rollData.innerTypes);
this.startId = this.endId;
this.allWinGold += this.rollData.gold;
this.zzj.string = wUtils.numConvert(this.allWinGold);
this.zj.string = wUtils.numConvert(this.rollData.gold);
this.count.string = "" + this.rollData.game;
if (this.rollData.gold) {
this.showWinTips(this.rollData.gold);
this.showIconAnim();
}
1 == this.rollData.outType && wAudioMgr.playSound("sound/sound_water_mary_roll_inner", "SHZ");
return [ 4, wUtils.syncDelayed(1.5, this) ];

case 2:
t.sent();
this.playRoll();
return [ 2 ];
}
});
});
};
e.prototype.getEndID = function(t) {
for (var e = [], o = 0, i = this.selectContent.children; o < i.length; o++) {
var n = i[o].name.split("_");
n[1] == t && e.push(Number(n[0]));
}
return e[wUtils.random(0, e.length - 1)];
};
e.prototype.showWinTips = function(t) {
var e = this.main.getChildByName("win_tip");
e.active = !0;
e.children[0].getComponent(cc.Label).string = wUtils.numConvert(t);
e.y -= 120;
var o = cc.moveTo(.3, cc.v2(0, 0)).easing(cc.easeBackOut()), i = cc.delayTime(1.5), n = cc.fadeOut(.3), s = cc.callFunc(function() {
e.active = !1;
e.opacity = 255;
}), a = cc.sequence(o, i, n, s);
e.runAction(a);
};
e.prototype.showIconAnim = function() {
for (var t = this.rollData.outType, e = this.rollData.innerTypes, o = function(o) {
var s = e[o];
if (s == t) {
var a = i.rollContent.children[o].children[0], l = cc.instantiate(i.main.getChildByName("icon"));
l.parent = a.children[0];
l.active = !0;
l.setPosition(0, 0);
var c = n.SHZConfig.spineList[s], r = l.getComponent(sp.Skeleton);
wRes.loadRes(c, sp.SkeletonData, function(t, e) {
r.skeletonData = e;
r.setAnimation(1, "animation", !0);
}, wGameData.getGameName());
var d = i.winContent.getChildByName("" + t);
d.active = !0;
i.scheduleOnce(function() {
d.active = !1;
l.destroy();
}, 1.5);
}
}, i = this, s = 0; s < e.length; s++) o(s);
};
e.prototype.Play_WheelAction = function(t, e, o) {
for (var i, n, s = this, a = t, l = new Date().getTime(), c = function(t) {
var e = new Date().getTime();
if (e - l > 80) {
wAudioMgr.playSound("sound/sound_water_mary_roll_out", "SHZ");
l = e;
}
s.selectContent.children[t].getComponent(cc.Toggle).check();
}, r = function(t, e) {
void 0 === e && (e = 1);
return (t += e) % 24;
}, d = function(t, e, o) {
return o <= 0 ? t : o >= 1 ? e : e * o + t * (1 - o);
}, h = ((i = t) < (n = e) ? n - i : 24 - i + n) + 72, u = cc.tween({}), p = 0; p < 8; p++) {
var m = d(.022, .4, (8 - p) / 8);
u.then(cc.tween().call(function() {
c(a = r(a));
}).delay(m));
}
p = 0;
for (var g = h - 8 - 8; p < g; p++) u.then(cc.tween().call(function() {
c(a = r(a));
}).delay(.022));
for (p = 0; p < 8; p++) {
m = d(.022, 1, p / 8);
0 == p ? u.then(cc.tween().call(function() {
c(a = r(a));
})) : u.then(cc.tween().delay(m).call(function() {
c(a = r(a));
}));
}
u.then(cc.tween().delay(.1).call(function() {
o && o();
}));
u.start();
};
e.prototype.setBottomIcon = function(t) {
var e = this;
this.rollContent.children.forEach(function(o, i) {
var s = o.children[0].children[0].getComponent(cc.Sprite), a = "" + n.SHZConfig.iconUrl + n.SHZConfig.icon_obj[t[i]];
s.spriteFrame = e.iconImg.getSpriteFrame(a);
o.y = 0;
});
};
e.prototype.setTopIcon = function(t) {
var e = this;
this.rollContent.children.forEach(function(o, i) {
var s = o.childrenCount - 1, a = o.children[s].children[0].getComponent(cc.Sprite), l = "" + n.SHZConfig.iconUrl + n.SHZConfig.icon_obj[t[i]];
a.spriteFrame = e.iconImg.getSpriteFrame(l);
});
};
e.prototype.setMixIcon = function() {
var t = this;
this.rollContent.children.forEach(function(e) {
for (var o = e.childrenCount - 1, i = 1; i < o; i++) {
var s = e.children[i].children[0].getComponent(cc.Sprite), a = wUtils.random(1, n.SHZConfig.iconNum);
s.spriteFrame = t.iconImg.getSpriteFrame("" + n.SHZConfig.mixUrl + a);
}
});
};
__decorate([ l(cc.Node) ], e.prototype, "selectContent", void 0);
__decorate([ l(cc.Node) ], e.prototype, "rollContent", void 0);
__decorate([ l(cc.Label) ], e.prototype, "yazhu", void 0);
__decorate([ l(cc.Label) ], e.prototype, "zj", void 0);
__decorate([ l(cc.Label) ], e.prototype, "zzj", void 0);
__decorate([ l(cc.Label) ], e.prototype, "count", void 0);
__decorate([ l(cc.SpriteAtlas) ], e.prototype, "iconImg", void 0);
__decorate([ l(cc.Node) ], e.prototype, "winContent", void 0);
return __decorate([ a ], e);
}(i.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: void 0,
SHZModel: "SHZModel"
} ],
SHZView: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "afa9aQ9i3lH275lJucVpBNg", "SHZView");
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("NodePool"), n = t("SHZModel"), s = cc._decorator, a = s.ccclass, l = s.property, c = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.gold = null;
e.bet = null;
e.gear = null;
e.btn_start = null;
e.btn_stop = null;
e.btn_auto = null;
e.btn_auto1 = null;
e.iconImg = null;
e.iconRotate = null;
e.iconResult = null;
e.lineList = null;
e.autoSelect = null;
e.winIcon = null;
e.iconPool = null;
e.winIconImg = [];
e.nodePosX = {};
e.nodePosY = {};
return e;
}
e.prototype.onLoad = function() {
this.onEvent(this.btn_start);
this.onEvent(this.btn_stop);
this.onEvent(this.btn_auto);
this.onEvent(this.btn_auto1);
this.initShow();
};
e.prototype.initShow = function() {
var t = this;
wRes.preloadDir("iconSpine", "SHZ");
cc.find("bottom/info/name", this.node).getComponent(cc.Label).string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10);
wUIHelp.setHead(cc.find("bottom/info/head/head", this.node), wGameData.getKey("headimgurl"));
var e = wUtils.random(1, 9);
this.iconRotate.children.forEach(function(o, i) {
for (var s = 0; s < 14 + 4 * i; s++) {
var a = o.children[s];
a || ((a = cc.instantiate(o.children[0])).parent = o);
if (s < 3) {
var l = a.children[0].getComponent(cc.Sprite), c = "" + n.SHZConfig.iconUrl + n.SHZConfig.icon_obj[e];
l.spriteFrame = t.iconImg.getSpriteFrame(c);
}
}
});
this.iconPool = new i.default(this.iconResult.children[0], 5);
this.iconPool.put(this.iconResult.children[0]);
};
e.prototype.initRoll = function() {
for (;this.iconResult.childrenCount; ) this.iconPool.put(this.iconResult.children[0]);
this.hideLine();
this.hideWinIcon();
};
e.prototype.showWinIcon = function(t) {
if (15 != t[0].num) {
this.winIcon.active = !0;
var e = this.winIcon.getChildByName("content");
wUIHelp.hideSonNode(e);
e.active = !0;
for (var o = 0; o < t.length; o++) if (t[o].line) {
var i = e.children[o];
i || ((i = cc.instantiate(e.children[0])).parent = e);
i.getChildByName("num").getComponent(cc.Label).string = "x" + t[o].multiple;
i.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.winIconImg[t[o].type - 1];
i.active = !0;
}
}
};
e.prototype.hideWinIcon = function() {
wUIHelp.hideSonNode(this.winIcon);
this.winIcon.active = !1;
};
e.prototype.showWinType = function(t) {
var e, o = this, i = 1, n = t.score, s = t.subGamecount, a = t.auto;
0 == i && (i = 1);
var l = cc.find("win/win" + i, this.node);
l.active = !0;
var c = cc.find("win/label", this.node);
c.setPosition(0, -163);
var r = l.getChildByName("evevt"), d = l.getChildByName("bb");
d.active = !s;
var h = l.getChildByName("sf");
h.x = s ? 0 : -172.171;
if (1 == i) {
l.active = !0;
wUIHelp.CountUp_(c, 0, n, 1.2, null, "+");
}
var u = function i() {
wAudioMgr.playCloseSound();
o.unscheduleAllCallbacks();
r.off("click", i, o);
h.off("click", i, o);
d.off("click", p, o);
o.endShowWin(n);
l.active = !1;
s || t.Lucky || wNetWork.send("Msg_SHZ_Collect", []);
e(n);
}, p = function i() {
wAudioMgr.playBtnSound();
o.unscheduleAllCallbacks();
r.off("click", u, o);
h.off("click", u, o);
d.off("click", i, o);
c.stopAllActions();
c.getComponent(cc.Label).string = "+" + wUtils.numConvert(n);
l.active = !1;
wViewMgr.openPage({
path: "prefab/bibei",
bundle: "SHZ",
data: {
Model: t,
cb: function(t) {
if (t) wUIHelp.CountUp_(c, Math.floor(.7 * n), n, .5, function() {
o.scheduleOnce(function() {
o.endShowWin(t);
e(t);
}, .3);
}, "+"); else {
c.getComponent(cc.Label).string = "";
e(t);
}
}
}
});
};
t.Lucky || this.scheduleOnce(function() {
r.on("click", u, o);
h.on("click", u, o);
d.on("click", p, o);
}, .5);
(a || s || t.Lucky) && this.scheduleOnce(function() {
u();
}, 2.5);
return new Promise(function(t) {
e = t;
});
};
e.prototype.endShowWin = function(t) {
var e = cc.find("win/label", this.node);
e.setPosition(0, -163);
e.stopAllActions();
e.getComponent(cc.Label).string = "+" + wUtils.numConvert(t);
var o = cc.moveTo(.3, cc.v2(460, 330)), i = cc.fadeTo(.3, 150), n = cc.scaleTo(.3, .2).easing(cc.easeBackIn()), s = cc.fadeTo(.3, 0), a = cc.callFunc(function() {
e.opacity = 255;
e.scale = 1;
e.getComponent(cc.Label).string = "";
wAudioMgr.playSound("sound/sound_water_compare_bt", "SHZ");
}), l = cc.sequence(cc.spawn(o, i), cc.spawn(n, s), a);
e.runAction(l);
};
e.prototype.showNodeWinBG = function() {
for (var t = 0, e = this.iconResult.children; t < e.length; t++) {
var o = e[t], i = o.getChildByName("line");
i.active = !0;
wUIHelp.hideSonNode(i);
var n = o.posx, s = o.posy;
this.nodePosY[s] && !this.nodePosY[s].includes(n - 1) && this.playBGKuang(i, "z");
this.nodePosY[s] && !this.nodePosY[s].includes(n + 1) && this.playBGKuang(i, "y");
this.nodePosX[n] && !this.nodePosX[n].includes(s + 1) && this.playBGKuang(i, "s");
this.nodePosX[n] && !this.nodePosX[n].includes(s - 1) && this.playBGKuang(i, "x");
}
};
e.prototype.playBGKuang = function(t, e) {
var o = t.getChildByName(e);
o.active = !0;
wUIHelp.playSpine(o, "start", function() {
wUIHelp.playSpine(o, "idle", null, !0);
});
};
e.prototype.getLineNode = function(t) {
var e = [], o = t.num;
if (15 == o) for (var i = 0, s = this.iconRotate.children; i < s.length; i++) for (var a = s[i], l = 0; l < 3; l++) {
var c = a.children[l];
e.push(c);
} else {
var r = n.SHZConfig.lineConfig[t.line];
({})[t.line] = !0;
var d = 0;
if (2 == t.dir) {
d = 5 - o;
o = 5;
}
for (l = d; l < o; l++) {
c = this.iconRotate.children[l].children[r[l]];
e.push(c);
}
}
return e;
};
e.prototype.showIconResult = function(t) {
var e = this, o = new Map();
for (var i in t) for (var s = 0, a = this.getLineNode(t[i]); s < a.length; s++) {
var l = a[s];
o.set(l, l.icon);
}
var c = this.iconResult;
o.forEach(function(t, o) {
var i = wUtils.local_world__POS(o);
i = wUtils.world_local_POS(c, i);
var s = e.iconPool.getNode;
s.parent = c;
s.getChildByName("line").active = !1;
s.setPosition(i);
var a = n.SHZConfig.spineList[t], l = s.getChildByName("icon").getComponent(sp.Skeleton);
s.posx = o.posx;
s.posy = o.posy;
!e.nodePosX[o.posx] && (e.nodePosX[o.posx] = []);
e.nodePosX[o.posx].push(o.posy);
!e.nodePosY[o.posy] && (e.nodePosY[o.posy] = []);
e.nodePosY[o.posy].push(o.posx);
wRes.loadRes(a, sp.SkeletonData, function(t, e) {
l.skeletonData = e;
l.setAnimation(1, "animation", !0);
}, wGameData.getGameName());
s.active = !0;
});
};
e.prototype.hideIconResult = function() {
wUIHelp.hideSonNode(this.iconResult);
};
e.prototype.showLineAnim = function(t) {
var e = this;
return new Promise(function(o) {
return __awaiter(e, void 0, void 0, function() {
var e, i, n, s, a, l, c;
return __generator(this, function(r) {
switch (r.label) {
case 0:
e = null;
i = 0;
n = t;
r.label = 1;

case 1:
if (!(i < n.length)) return [ 3, 4 ];
s = n[i];
a = s.line;
if (e) {
l = this.getLineNode(e);
this.setStatusNode(l, !1);
}
e = s;
c = this.getLineNode(e);
this.setStatusNode(c, !0);
this.hideLine();
wAudioMgr.playSound("sound/sound_water_line", "SHZ");
return [ 4, this.playLineAnim(a) ];

case 2:
r.sent();
r.label = 3;

case 3:
i++;
return [ 3, 1 ];

case 4:
o(1);
return [ 2 ];
}
});
});
});
};
e.prototype.playLineAnim = function(t) {
var e = this;
return new Promise(function(o) {
var i = e.lineList.getChildByName("" + t);
i || o();
i.active = !0;
var n = i.children[2];
n.width = 50;
cc.tween(n).to(.3, {
width: 1172
}).delay(.15).call(function() {
o();
}).start();
});
};
e.prototype.showLine = function(t) {
for (var e = 0, o = t; e < o.length; e++) {
var i = o[e].line, n = this.lineList.getChildByName("" + i);
if (n) {
n.active = !0;
n.children[2].width = 1172;
}
}
};
e.prototype.hideLine = function() {
wUIHelp.hideSonNode(this.lineList);
};
e.prototype.setStatusNode = function(t, e) {
for (var o = 0, i = t; o < i.length; o++) {
var s = i[o], a = s.icon, l = s.children[0].getComponent(cc.Sprite), c = e ? "iconUrl" : "greyUrl", r = "" + n.SHZConfig[c] + n.SHZConfig.icon_obj[a];
l.spriteFrame = this.iconImg.getSpriteFrame(r);
}
};
e.prototype.showIconStatus = function(t, e) {
var o = this;
this.iconRotate.children.forEach(function(i, s) {
for (var a = 0; a < 3; a++) {
var l = i.children[a], c = t ? t[s][a] : l.icon;
if (!c) break;
var r = l.children[0].getComponent(cc.Sprite), d = e ? "iconUrl" : "greyUrl", h = "" + n.SHZConfig[d] + n.SHZConfig.icon_obj[c];
r.spriteFrame = o.iconImg.getSpriteFrame(h);
}
});
};
e.prototype.setBottomIcon = function(t) {
var e = this;
this.nodePosX = {};
this.nodePosY = {};
this.iconRotate.children.forEach(function(o, i) {
for (var s = 0; s < 3; s++) {
var a = o.children[s], l = t[i][s];
a.icon = l;
var c = a.children[0].getComponent(cc.Sprite), r = "" + n.SHZConfig.iconUrl + n.SHZConfig.icon_obj[l];
c.spriteFrame = e.iconImg.getSpriteFrame(r);
a.posx = i;
a.posy = s;
}
o.y = 0;
});
};
e.prototype.setTopIcon = function(t) {
var e = this;
this.iconRotate.children.forEach(function(o, i) {
for (var s = o.childrenCount - 3, a = s; a < o.childrenCount; a++) {
var l = o.children[a].children[0].getComponent(cc.Sprite), c = "" + n.SHZConfig.iconUrl + n.SHZConfig.icon_obj[t[i][a - s]];
l.spriteFrame = e.iconImg.getSpriteFrame(c);
}
});
};
e.prototype.setMixIcon = function() {
var t = this;
this.iconRotate.children.forEach(function(e) {
for (var o = e.childrenCount - 3, i = 3; i < o; i++) {
var s = e.children[i].children[0].getComponent(cc.Sprite), a = wUtils.random(1, n.SHZConfig.iconNum);
s.spriteFrame = t.iconImg.getSpriteFrame("" + n.SHZConfig.mixUrl + a);
}
});
};
e.prototype.setBtnEnabled = function(t, e) {
for (var o = cc.find("bottom/btn", this.node), i = 0; i < 3; i++) o.children[i].getComponent(cc.Button).interactable = t;
this.btn_auto.getComponent(cc.Button).interactable = t;
this.btn_start.getComponent(cc.Button).interactable = t && !e;
this.btn_stop.active = !t && !e;
};
e.prototype.setGear = function(t, e) {
this.bet.string = wUtils.numConvert(t);
this.gear.string = wUtils.numConvert(e);
};
e.prototype.setGold = function(t) {
this.gold.string = wUtils.numConvert("" + t);
};
e.prototype.setAutoState = function(t, e) {
this.btn_auto.active = !t;
this.btn_auto1.active = t;
if (t) {
this.btn_auto1.getChildByName("sd").active = -1 == e;
this.btn_auto1.getChildByName("num").active = -1 != e;
e > 0 && (this.btn_auto1.getChildByName("num").getComponent(cc.Label).string = "" + e);
}
};
e.prototype.setAutoSelect = function(t) {
this.autoSelect.active = t;
};
e.prototype.setAutoNum = function(t) {
this.btn_auto1.getChildByName("sd").active = -1 == t;
this.btn_auto1.getChildByName("num").active = -1 != t;
t > 0 && (this.btn_auto1.getChildByName("num").getComponent(cc.Label).string = "" + t);
};
e.prototype.setStopState = function(t) {
this.btn_stop && (this.btn_stop.getComponent(cc.Button).interactable = t);
};
e.prototype.onEvent = function(t) {
if (t) {
t.on(cc.Node.EventType.TOUCH_START, function() {
t.getComponent(cc.Button).interactable && (t.scale = 1.05);
}, this);
t.on(cc.Node.EventType.TOUCH_END, function() {
t.scale = 1;
}, this);
t.on(cc.Node.EventType.TOUCH_CANCEL, function() {
t.scale = 1;
}, this);
}
};
e.prototype.startSmallGameAnim = function() {
var t = this;
return new Promise(function(e) {
var o = t.node.getChildByName("smallgame");
o.active = !0;
wUIHelp.playSpine(o.getChildByName("spine"), "animation", function() {
e();
});
wUIHelp.playSpine(o.getChildByName("spine1"), "animation");
});
};
__decorate([ l(cc.Label) ], e.prototype, "gold", void 0);
__decorate([ l(cc.Label) ], e.prototype, "bet", void 0);
__decorate([ l(cc.Label) ], e.prototype, "gear", void 0);
__decorate([ l(cc.Node) ], e.prototype, "btn_start", void 0);
__decorate([ l(cc.Node) ], e.prototype, "btn_stop", void 0);
__decorate([ l(cc.Node) ], e.prototype, "btn_auto", void 0);
__decorate([ l(cc.Node) ], e.prototype, "btn_auto1", void 0);
__decorate([ l(cc.SpriteAtlas) ], e.prototype, "iconImg", void 0);
__decorate([ l(cc.Node) ], e.prototype, "iconRotate", void 0);
__decorate([ l(cc.Node) ], e.prototype, "iconResult", void 0);
__decorate([ l(cc.Node) ], e.prototype, "lineList", void 0);
__decorate([ l(cc.Node) ], e.prototype, "autoSelect", void 0);
__decorate([ l(cc.Node) ], e.prototype, "winIcon", void 0);
__decorate([ l(cc.SpriteFrame) ], e.prototype, "winIconImg", void 0);
return __decorate([ a ], e);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {
NodePool: void 0,
SHZModel: "SHZModel"
} ]
}, {}, [ "SHZBiBei", "SHZControlle", "SHZLoad", "SHZLuckyPlayer", "SHZLuckyPlayerList", "SHZModel", "SHZRoom", "SHZRotate", "SHZSmallGame", "SHZView" ]);