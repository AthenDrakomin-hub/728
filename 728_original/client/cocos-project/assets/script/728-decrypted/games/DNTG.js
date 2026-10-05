window.__require = function t(e, i, o) {
function s(n, r) {
if (!i[n]) {
if (!e[n]) {
var l = n.split("/");
l = l[l.length - 1];
if (!e[l]) {
var c = "function" == typeof __require && __require;
if (!r && c) return c(l, !0);
if (a) return a(l, !0);
throw new Error("Cannot find module '" + n + "'");
}
n = l;
}
var h = i[n] = {
exports: {}
};
e[n][0].call(h.exports, function(t) {
return s(e[n][1][t] || t);
}, h, h.exports, t, e, i, o);
}
return i[n].exports;
}
for (var a = "function" == typeof __require && __require, n = 0; n < o.length; n++) s(o[n]);
return s;
}({
DNTGBullet: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "16e0bC8DeNMv5GsJnnmXHdQ", "DNTGBullet");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = t("DNTGModel"), s = cc._decorator, a = s.ccclass;
s.property;
var n = function(t) {
__extends(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onLoad = function() {
this.p_width = cc.winSize.width;
this.p_height = cc.winSize.height;
};
e.prototype.init = function(t, e, i) {
var s = this;
wRes.loadRes(o.DNTGConfig.bulletUrl[t.gear > 6 ? 1 : 0], cc.SpriteFrame, function(t, e) {
cc.isValid(s, !0) && (s.node.getComponent(cc.Sprite).spriteFrame = e);
}, wGameData.getGameName());
this.lockfishID = e;
this.lockFishNode = i;
this.info = t;
this.dir = cc.v2(t.dir.x * this.node.parent.scaleX, t.dir.y * this.node.parent.scaleY);
this.node.angle = t.angle;
this.node.setPosition(t.bulletStartPos);
this.node.DATA = this.info;
this.node.BULLET = this;
this.fishParent = this.node.parent.parent.getChildByName("fish");
};
e.prototype.getRect = function() {
return this.node.children[0].getBoundingBoxToWorld();
};
e.prototype.getlockFishDir = function() {
if (!this.lockFishNode) return !1;
var t = wUtils.local_world__POS(this.node), e = wUtils.local_world__POS(this.lockFishNode.n), i = this.getAngle_Dir(t, e);
i.angle;
var o = i.dir;
o.x *= this.node.parent.scaleX;
o.y *= this.node.parent.scaleY;
this.dir = o;
};
e.prototype.getAngle_Dir = function(t, e) {
return {
angle: Number((-wUtils.GetAngleByVector(t, Number)).toFixed(2)),
dir: wUtils.Normalize(e, t)
};
};
e.prototype.moveBullet = function(t) {
this.getlockFishDir();
var e = this.dir.x * o.DNTGConfig.bulletSpeed * t, i = this.dir.y * o.DNTGConfig.bulletSpeed * t, s = this.p_width / 2, a = this.p_height / 2;
if (e + this.node.x > s || e + this.node.x < -s) {
this.dir.x *= -1;
this.lockFishNode = null;
}
if (i + this.node.y > a || i + this.node.y < -a) {
this.dir.y *= -1;
this.lockFishNode = null;
}
e = this.dir.x * o.DNTGConfig.bulletSpeed * t + this.node.x;
i = this.dir.y * o.DNTGConfig.bulletSpeed * t + this.node.y;
var n = -wUtils.GetAngleByVector(this.node.getPosition(), cc.v2(e, i));
this.node.setPosition(cc.v2(e, i));
this.node.angle = n;
};
return __decorate([ a ], e);
}(cc.Component);
i.default = n;
cc._RF.pop();
}, {
DNTGModel: "DNTGModel"
} ],
DNTGControlle: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "86082cwkyhLM5tzMv/swXbu", "DNTGControlle");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = t("DNTGBullet"), s = t("DNTGFish"), a = t("DNTGModel"), n = t("DNTGView"), r = t("NodePool"), l = t("quadtree"), c = t("Config"), h = cc._decorator, d = h.ccclass, u = h.property, p = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.DNTGView = null;
e.fish = [];
e.vg_game = null;
e.fishPool = [];
e.huaJson = null;
e.pathJson = null;
return e;
}
e.prototype.onLoad = function() {
this.initScene();
this.initProxy();
this.initNetWorkEvevt();
};
e.prototype.onDestroy = function() {
this.bulletPool.clear();
this.DNTGModel.playerData = {};
this.DNTGModel.fishList = {};
};
e.prototype.initNetWorkEvevt = function() {
var t = this;
wGEvent.on("Msg_Hall_FinishLoad", function(t) {
1 != t.status && wViewMgr.quitGame();
}, this);
wGEvent.on("Msg_" + this.vg_game + "_Out", function(e) {
1 == e.status ? t.Msg_Game_Out(e.data) : wLog.e("退出消息失败");
}, this);
wGEvent.on("Msg_" + this.vg_game + "_PlayerAct", function(e) {
1 == e.status ? t.Msg_Game_PlayerAct(e.data) : wLog.e("玩家进入失败");
}, this);
wGEvent.on("Msg_" + this.vg_game + "_ActChange", function(e) {
1 == e.status ? t.Msg_Game_ActChange(e.data) : wLog.e("切换炮台失败");
}, this);
wGEvent.on("Msg_" + this.vg_game + "_RoomInfo", function(e) {
wUIManager.hideLoadingUI();
if (1 == e.status) t.Msg_Game_RoomInfo(e.data); else {
wLog.e("获取游戏场景信息失败");
wViewMgr.quitGame();
}
}, this);
wGEvent.on("Msg_Hall_Connect", function(t) {
if (1 == t.status) {
wGameData.getKey("rid") && wLog.e("断线重连有房间号");
wViewMgr.quitGame();
} else wLog.e("验证失败");
}, this);
wGEvent.on("Msg_" + this.vg_game + "_ActShoot", function(e) {
1 == e.status ? t.Msg_Game_ActShoot(e.data) : wLog.e("发射炮弹失败");
}, this);
wGEvent.on("Msg_" + this.vg_game + "_CreateFish", function(e) {
1 == e.status ? t.Msg_Game_CreateFish(e.data) : wLog.e("生成鱼失败");
}, this);
wGEvent.on("Msg_" + this.vg_game + "_GetFish", function(e) {
1 == e.status ? t.Msg_Game_GetFish(e.data) : wLog.e("捕鱼失败");
}, this);
wGEvent.on("Msg_" + this.vg_game + "_Locking", function(e) {
1 == e.status ? t.Msg_Game_Locking(e.data) : wLog.e("锁鱼失败");
}, this);
wGEvent.on("Msg_" + this.vg_game + "_FishTide", function(e) {
1 == e.status ? t.Msg_Game_FishTide(e.data) : wLog.e("鱼潮生成失败");
}, this);
wGEvent.on("Msg_" + this.vg_game + "_FishBattery", function(e) {
1 == e.status ? t.DNTGModel.get_uid_data(e.data.uid).battery = e.data.battery : wLog.e("更换炮台失败");
}, this);
wNetWork.send("Msg_Hall_FinishLoad", {
rid: wGameData.roomID
});
wGEvent.on("Msg_" + this.vg_game + "_PlayerAgent", function(e) {
1 == e.status ? t.Msg_DNTG_PlayerAgent(e.data) : wLog.e("更换炮台失败");
}, this);
};
e.prototype.initProxy = function() {
var t = this;
this.DNTGModel.onEvevt("lock", function(e) {
e || (t.DNTGModel.getMyData().lockFish = null);
});
for (var e = function(e) {
var o = a.DNTGCreatorPlayerProxy();
o.onEvevt("gear", function(e) {
t.DNTGView.setBattery(o.l_seat, e);
t.DNTGView.setScore(o.l_seat, e * t.DNTGModel.di_score);
});
o.onEvevt("angle", function(e) {
t.DNTGView.setBatteryAngle(o.l_seat, e);
});
o.onEvevt("gold", function(e) {
t.DNTGView.setGold(o.l_seat, e);
});
o.onEvevt("name", function(e) {
t.DNTGView.setName(o.l_seat, e);
});
o.onEvevt("lockFish", function(e) {
o.l_seat == t.DNTGModel.l_seat ? wNetWork.send("Msg_" + t.vg_game + "_Locking", {
fish: null == e ? void 0 : e.id
}) : t.DNTGModel.robotList.includes(o.uid) && wNetWork.send("Msg_" + t.vg_game + "_Locking", {
fish: null == e ? void 0 : e.id,
uid: o.uid
});
t.DNTGView.setLockType(o.l_seat, e);
});
i.DNTGModel.playerData[e] = o;
i.DNTGView.add_delete_player(e, {});
}, i = this, o = 0; o < 4; o++) e(o);
};
e.prototype.initScene = function() {
var t = this;
wAudioMgr.playBgMusic("sound/bgm/bgm2", wGameData.getGameName());
this.huaJson = this.huaJson.json;
this.pathJson = this.pathJson.json;
this.vg_game = wGameData.getGameName();
this.DNTGModel = a.DNTGCreatorProxy();
this.DNTGView.init(this.DNTGModel);
var e = this.node.getChildByName("click");
e.on("touchstart", function(e) {
t.onEvent("start", e);
}, this);
e.on("touchmove", function(e) {
t.onEvent("move", e);
}, this);
e.on("touchend", function(e) {
t.onEvent("end", e);
}, this);
var i = new cc.Node();
i.addComponent(o.default);
i.addComponent(cc.Sprite);
var s = new cc.Node();
s.setContentSize(30, 50);
s.parent = i;
this.bulletPool = new r.default(i, 30);
this.bulletPool.put(i);
for (var n = 0; n < this.fish.length; n++) {
var l = this.fish[n], c = new r.default(l, n < 17 ? 40 : 3);
this.fishPool.push(c);
}
};
e.prototype.initNodeDir = function() {
if (1 == (this.DNTGModel.s_seat > 1 ? 0 : 1)) {
var t = this.node.getChildByName("fish");
t.setScale(-1, 1);
t.setPosition(667, -375);
var e = t.getComponent(cc.Widget);
e.isAlignLeft = !1;
e.isAlignRight = !0;
e.right = 0;
e.updateAlignment();
this.node.getChildByName("bullet").setScale(1, 1);
}
var i = wUtils.local_world__POS(this.node), o = {
x: i.x - cc.winSize.width / 2,
y: i.y - cc.winSize.height / 2,
width: cc.winSize.width,
height: cc.winSize.height
};
this.myTree = new l(o);
};
e.prototype.Msg_DNTG_PlayerAgent = function(t) {
for (var e in t) if (e == wGameData.getKey("uid")) {
this.DNTGModel.robotList = t[e];
this.DNTGModel.robotList.push(wGameData.getKey("uid"));
}
};
e.prototype.Msg_Game_ActChange = function(t) {
var e = t.seat, i = t.level, o = this.DNTGModel.get_s_seat_data(e);
o.gear = i;
this.DNTGView.setBatteryLZ(o.l_seat);
wAudioMgr.playSound("sound/MakeUP", wGameData.getGameName());
};
e.prototype.Msg_Game_PlayerAct = function(t) {
if (!this.DNTGModel.get_uid_data(t.player.uid)) {
var e = {
seat: t.seat,
uid: t.player.uid,
gold: t.player.gold,
nickname: t.player.nickname,
level: 1,
battery: t.battery
};
this.addPlayerData(e);
}
};
e.prototype.addPlayerData = function(t) {
t.l_seat = this.DNTGModel.s_seat > 1 ? [ 3, 2, 1, 0 ][t.seat] : t.seat;
var e = this.DNTGModel.playerData[t.l_seat];
e.l_seat = t.l_seat;
e.s_seat = t.seat;
e.uid = t.uid;
e.gold = t.gold;
e.gear = t.level;
e.name = t.nickname;
e.angle = 0;
e.battery = t.battery;
this.DNTGView.add_delete_player(t.l_seat, e);
t.uid != wGameData.getKey("uid") && (e.lockFish = null);
};
e.prototype.Msg_Game_Out = function(t) {
var e = t.seat, i = this.DNTGModel.get_s_seat_data(e);
i.uid == wGameData.getKey("uid") && wViewMgr.quitGame(t.gold);
i.uid = "";
this.DNTGView.add_delete_player(i.l_seat, i);
var o = this.DNTGModel.robotList.indexOf(i.uid);
-1 != o && this.DNTGModel.robotList.splice(o, 1);
};
e.prototype.Msg_Game_Locking = function(t) {
if (!this.DNTGModel.robotList.includes(t.uid)) {
var e = this.DNTGModel.get_uid_data(t.uid);
e && (e.lockFish = this.DNTGModel.fishList[t.fish]);
}
};
e.prototype.Msg_Game_RoomInfo = function(t) {
var e = this;
cc.game.on(cc.game.EVENT_SHOW, function() {
wNetWork.send("Msg_" + e.vg_game + "_Out", []);
}, this);
this.DNTGView.exitTips();
var i = t.players, o = i[wGameData.getKey("uid")];
this.DNTGModel.l_seat = o.seat > 1 ? [ 3, 2, 1, 0 ][o.seat] : o.seat;
this.DNTGModel.s_seat = o.seat;
this.DNTGModel.di_score = t.setting.doublescore;
for (var s in i) {
var a = i[s];
a.uid = Number(s);
this.addPlayerData(a);
}
this.DNTGView.showTips(this.DNTGModel.l_seat);
this.initNodeDir();
t.fishtideid ? this.createFishTide(t.fishtideid, t.fishlist, t.time_ms - t.lasttidetime) : this.createFish(t.fishlist, t.time_ms);
t.stoptime && this.initDingFish(t.fishlist, t.time_ms, t.stoptime);
for (var n in this.DNTGModel.playerData) {
var r = this.DNTGModel.playerData[n];
if (r.uid) {
var l = i[r.uid].locking;
l && this.DNTGModel.fishList[l] && (r.lockFish = this.DNTGModel.fishList[l]);
}
}
};
e.prototype.Msg_Game_CreateFish = function(t) {
this.createFish(t.finsh);
};
e.prototype.Msg_Game_GetFish = function(t) {
var e = this, i = this.DNTGModel.get_s_seat_data(t.seat);
i.gold = t.gold;
var o = [], s = 0, n = this.DNTGModel.fishList[t.shootid], r = null == n ? void 0 : n.type;
for (var l in t.fish) {
var c = this.DNTGModel.fishList[l];
s += t.fish[l];
if (c) {
c.gold = t.fish[l];
o.push(c);
} else wLog.w("该鱼失效了:", l, c);
}
"number" != typeof s && wLog.e(t);
var h = s / this.DNTGModel.di_score / i.gear, d = t.seat == this.DNTGModel.s_seat;
if (r) if (603 == r) {
wAudioMgr.playSound("sound/fish-tx-zhengyaojingangta", wGameData.getGameName());
this.DNTGView.showDing(n.n);
this.DNTGView.showBomb(n, 603);
this.scheduleOnce(function() {
e.fishSleep(!1);
}, a.DNTGConfig.stopMoveTime);
this.fishSleep(!0);
} else if (r > 90 && r < 700) {
this.DNTGView.showEffect_3(s, t.seat);
for (var u = null, p = [], f = [], g = 0, y = o; g < y.length; g++) {
(v = y[g]).type == r ? u = wUtils.local_world__POS(v.n) : p.push(wUtils.local_world__POS(v.n));
v.gold && f.push({
pos: wUtils.local_world__POS(v.n),
gold: v.gold,
type: v.type
});
}
this.showGold(f, t.seat);
if (601 == r) {
wAudioMgr.playSound("sound/fish-tx-dinhaishenzhen", wGameData.getGameName());
this.DNTGView.showBomb(n, 601);
} else if (602 == r) {
wAudioMgr.playSound("sound/fish-tx-wudifenghuolun", wGameData.getGameName());
this.DNTGView.showBomb(n, 602);
} else if (92 == r) {
wAudioMgr.playSound("sound/fish-tx-quanpinzhadan", wGameData.getGameName());
this.DNTGView.showFullBomb(n);
} else this.DNTGView.lightningLine(u, p);
} else if (r < 90 || r > 700) {
var v = o[0];
this.DNTGView.showGold(v, t.seat);
this.DNTGView.showEffect_3(v.gold, t.seat);
}
if (a.DNTGConfig.winType[r]) {
this.DNTGView.showEffect_1(s, t.seat, r);
wAudioMgr.playSound("sound/CJ", wGameData.getGameName());
}
h >= 140 && d && wUIHelp.shake(this.node);
for (var m = 0, _ = o; m < _.length; m++) {
v = _[m];
this.DNTGView.fishDing(v.n, !1);
v.DNTGFish.fishDie(r);
this.deleteFishData(v.id);
}
};
e.prototype.playSound = function(t) {
t > 100 && (t = 100 * Math.floor(t / 100));
var e;
switch (t) {
case 11:
e = "sound/fish6_1";
break;

case 10:
e = "sound/fish9_1";
break;

case 13:
e = "sound/fish12_1";
break;

case 15:
e = "sound/fish14_1";
break;

case 19:
e = "sound/fish15_1";
break;

case 20:
e = "sound/fish16_1";
break;

case 18:
e = "sound/fish18_1";
break;

case 24:
e = "sound/fish19_1";
break;

case 25:
e = "sound/fish20_1";
break;

case 22:
e = "sound/fish22_1";
break;

case 23:
e = "sound/fish23_1";
break;

case 21:
e = "sound/fish24_1";
break;

case 26:
e = "sound/fish25_1";
break;

case 17:
e = "sound/fish26_1";
break;

case 16:
e = "sound/fish27_1";
break;

case 200:
e = "sound/fish28_1";
break;

case 27:
e = "sound/fish29_1";
break;

case 400:
e = "sound/fish30_1";
break;

case 500:
e = "sound/fish33_1";
}
e && wAudioMgr.playSound(e, wGameData.getGameName());
};
e.prototype.initDingFish = function(t, e, i) {
var o = this, s = a.DNTGConfig.stopMoveTime - (e - i) / 1e3;
if (!(s <= .2)) {
var n = [];
for (var r in t) if (t[r].createtime < i) {
var l = this.DNTGModel.fishList[r];
l && n.push(l.n);
}
for (var c = 0, h = n; c < h.length; c++) {
var d = h[c];
cc.isValid(d) && this.DNTGView.fishDing(d, !0);
}
this.fishSleep(!0);
this.scheduleOnce(function() {
o.fishSleep(!1);
for (var t = 0, e = n; t < e.length; t++) {
var i = e[t];
cc.isValid(i) && o.DNTGView.fishDing(i, !1);
}
}, s);
}
};
e.prototype.createFish = function(t, e) {
void 0 === e && (e = null);
for (var i in t) {
var o = t[i];
if (1e3 == o.wayid) {
for (var s = this.huaJson[o.circlepoint[0] + "," + o.circlepoint[1]], a = Object.keys(o.fishes), n = Object.values(o.fishes), r = [], l = 0; l < a.length; l++) if (s[l]) {
var c = a[l], h = {
id: c,
path: s[l],
endtime: o.endtime ? o.endtime[c] : null
};
if (1 == n[l]) r.push(h); else if (2 == n[l]) {
h.yuwang = !0;
r.push(h);
}
}
this.createFishNode(r, o, e);
} else {
Object.values(o.fishes).length > 0 && wLog.e("11111111111111111111111");
var d = this.getPath(o.wayid);
this.createFishNode([ {
path: d,
id: o.id,
endtime: o.endtime
} ], o, e);
}
}
};
e.prototype.getPath = function(t) {
var e = this, i = this.DNTGModel.fishPath[t];
if (!i) {
i = this.pathJson[t - 1];
cc.winSize.width;
i.forEach(function(t, o) {
var s = e.AdaptationPos(t);
i[o][0] = s[0];
i[o][1] = s[1];
});
this.DNTGModel.fishPath[t] = i;
}
return i;
};
e.prototype.createFishNode = function(t, e, i) {
var o = this;
void 0 === i && (i = null);
for (var n = this.node.getChildByName("fish"), r = 0; r < 2; r++) {
var l = t.shift();
if (!l) break;
var c = {};
Object.assign(c, e);
c.pathID = e.pathID || 0;
c.path = l.path;
c.id = Number(l.id);
1e3 == e.wayid && (c.pathID = .01);
if (i) {
var h = i - (l.endtime - c.path.length / e.speed * 1e3) - (1e3 != e.wayid ? 600 : 0);
h < 0 && (h = 0);
c.pathID = h / 1e3 * e.speed;
}
if (c.pathID && c.pathID >= c.path.length - 1) {
wLog.w("鱼已经在离场阶段不做创建:", c.id);
return;
}
var d = e.type > 100 ? 100 * Math.floor(e.type / 100) : e.type, u = this.fishPool[a.DNTGConfig.fishConfig[d][0]].getNode, p = u.getComponent(s.default);
p && u.removeComponent(s.default);
p = u.addComponent(s.default);
u.parent = n;
p.init(c, function(t) {
o.deleteFishData(t);
}, this.recoveryFish.bind(this));
if (this.DNTGModel.fishList[c.id]) {
this.recoveryFish(this.DNTGModel.fishList[c.id].n);
this.deleteFishData(c.id);
wLog.w("有重复ID生成：", c.id);
}
this.DNTGModel.fishList[c.id] = {
n: u,
DNTGFish: p,
id: c.id,
type: e.type
};
l.yuwang && wUIHelp.setNodeColor(u, cc.color(255, 0, 0));
}
t.length > 0 && this.createFishNode(t, e, i);
};
e.prototype.recoveryFish = function(t) {
this.fishPool[a.DNTGConfig.fishConfig[t.name][0]].put(t);
};
e.prototype.getLockFish = function() {
var t = [], e = cc.rect(-500, -375, 1e3, 750);
for (var i in this.DNTGModel.fishList) if (Object.prototype.hasOwnProperty.call(this.DNTGModel.fishList, i)) {
var o = this.DNTGModel.fishList[i].n;
if (cc.isValid(o, !0)) {
var s = wUtils.local_world__POS(o);
this.getPointInPolygon(s, e) && t.push(this.DNTGModel.fishList[i]);
}
}
var a = t.filter(function(t) {
if (t.type > 9 && t.DNTGFish && !t.DNTGFish.kill && !t.DNTGFish.isEnd) return !0;
});
a.sort(function() {
return Math.random() > .5 ? 1 : -1;
});
a.sort(function() {
return Math.random() > .5 ? 1 : -1;
});
return a[0];
};
e.prototype.getPointInPolygon = function(t, e) {
!e && (e = this.node.getBoundingBox());
return e.contains(wUtils.world_local_POS(this.node.parent, t));
};
e.prototype.fishSleep = function(t) {
var e = this.DNTGModel.fishList;
for (var i in e) if (Object.prototype.hasOwnProperty.call(e, i)) {
e[i].DNTGFish.ding = t;
this.DNTGView.fishDing(e[i].n, t);
}
};
e.prototype.deleteFishData = function(t) {
this.DNTGModel.fishList[t] = null;
delete this.DNTGModel.fishList[t];
for (var e in this.DNTGModel.playerData) {
var i = this.DNTGModel.playerData[e];
if (i.uid) {
var o = i.lockFish;
o && !this.DNTGModel.fishList[o.id] && (i.uid == wGameData.getKey("uid") ? this.DNTGModel.lock && (i.lockFish = null) : i.lockFish = null);
}
}
};
e.prototype.showGold = function(t, e) {
if (cc.isValid(this, !0)) {
for (var i = 0; i < 4; i++) {
var o = t.shift();
if (!o) break;
this.DNTGView.showGold(o, e);
}
t.length > 0 && setTimeout(this.showGold.bind(this), 20, t, e);
}
};
e.prototype.AdaptationPos = function(t) {
var e = cc.winSize.width / 1334, i = cc.v2.apply(cc, t), o = i.mag();
return [ o * (i = i.normalize()).x * e, o * i.y ];
};
e.prototype.getYuanPath = function(t, e) {
for (var i = [], o = 0; o < t.length; o++) {
var s = t[o];
if (o % 2 == 0) for (var a = -90; a < 90; a++) {
var n = 2 * Math.PI / 360 * a, r = s[0] + Math.sin(n) * e, l = s[1] + Math.cos(n) * e;
i.push(this.AdaptationPos([ r, l ]));
} else for (var c = -90; c > -270; c--) {
n = 2 * Math.PI / 360 * c;
r = s[0] + Math.sin(n) * e;
l = s[1] + Math.cos(n) * e;
i.push(this.AdaptationPos([ r, l ]));
}
}
return i;
};
e.prototype.fishTide_4 = function(t, e) {
var i = this, o = function(o, s, a, n, r) {
var l = [ , [] ];
l[0] = i.getYuanPath(o, s);
for (var c = 0, h = l[0]; c < h.length; c++) {
var d = h[c];
l[1].push([ d[0], 750 - d[1] ]);
}
for (var u = 0; u < 2; u++) for (var p = function(o) {
var s = t.shift();
if (!s.status) return "continue";
var c = o * r, h = .01;
if (e) {
var d = e / 1e3, p = d - c;
(c -= d) < 0 && (c = 0);
p > 0 && (h = p * n);
}
var f = l[u];
i.scheduleOnce(function() {
var t = {
type: a,
id: s.id,
speed: n,
path: f,
pathID: h
};
i.createFishNode([ t ], t);
}, c);
}, f = 0; f < 30; f++) p(f);
};
o([ [ 100, 375 ], [ 300, 375 ], [ 500, 375 ], [ 700, 375 ], [ 900, 375 ], [ 1100, 375 ], [ 1300, 375 ] ], 100, 7, 60, .5);
o([ [ 200, 375 ], [ 600, 375 ], [ 1e3, 375 ], [ 1400, 375 ] ], 200, 9, 30, .7);
};
e.prototype.fishTide_1_2_3_4_5 = function(t, e, i) {
void 0 === e && (e = null);
void 0 === i && (i = 0);
return __awaiter(this, void 0, void 0, function() {
var o, s, a, n, r, l, c, h, d, u, p, f, g, y, v, m, _ = this;
return __generator(this, function(w) {
switch (w.label) {
case 0:
return (o = this.DNTGModel.tideScene[t]) ? [ 3, 2 ] : [ 4, new Promise(function(e) {
wRes.loadRes("Game/BUYU/fishTide_" + t, function(t, i) {
e(i.json);
});
}) ];

case 1:
o = w.sent();
if (!cc.isValid(this)) return [ 2 ];
o.sort(function(t, e) {
return t[0] - e[0];
});
this.DNTGModel.tideScene[t] = o;
w.label = 2;

case 2:
s = [];
if (4 == t) {
for (l = 51; l < 171; l++) s.push({
id: l
});
for (l = 1; l < 51; l++) s.push({
id: l
});
for (l = 171; l < 175; l++) s.push({
id: l
});
} else for (l = 1; l <= o.length; l++) s.push({
id: l
});
s.forEach(function(t, i) {
s[i].status = !e || !!e[t.id];
});
4 == t && this.fishTide_4(s, i);
a = i / 1e3 * 60;
n = cc.winSize.width / 1334;
r = [];
for (l = 0; l < o.length; l++) if ((c = s.shift()).status) {
h = o[l];
d = h[0];
u = this.AdaptationPos(h[1]);
p = cc.v2.apply(cc, h[2]);
f = h[3] / 2 || 1.5;
f *= n;
if (i) {
g = a * p.x * f;
y = a * p.y * f;
u[0] += g;
u[1] += y;
}
v = {
type: d,
id: c.id,
speed: f,
pos: u,
dir: p,
couples: [ d % 100 ],
moveType: 1
};
r.push(v);
}
(m = function() {
if (cc.isValid(_, !0)) {
for (var t = 0; t < 10; t++) {
var e = r.shift();
if (!e) return;
_.createFishNode([ e ], e);
}
r.length > 0 && setTimeout(m.bind(_), 10);
}
})();
return [ 2 ];
}
});
});
};
e.prototype.Msg_Game_FishTide = function(t) {
var e = this;
for (var i in this.DNTGModel.fishList) {
var o = this.DNTGModel.fishList[i];
o.DNTGFish.isEnd = !0;
o.DNTGFish.dir.x *= 4;
o.DNTGFish.dir.y *= 4;
}
this.DNTGModel.tide = !0;
this.DNTGModel.isOnClick && wUIManager.showTips("场景切换中,不能发射子弹!", wUIManager.TIPS_OK);
this.scheduleOnce(function() {
for (var t in e.DNTGModel.fishList) {
var i = e.DNTGModel.fishList[t];
e.DNTGView.fishDing(i.n, !1);
e.recoveryFish(i.n);
}
e.DNTGModel.fishList = {};
e.DNTGView.switchBG();
var o = e.DNTGModel.playerData;
for (var t in o) if (Object.prototype.hasOwnProperty.call(o, t)) {
var s = o[t];
s && s.uid && (s.lockFish = 0);
}
}, 2);
this.scheduleOnce(function() {
e.fishTide_1_2_3_4_5(t.tide).catch(function(t) {
wLog.e(t);
});
e.DNTGModel.tide = !1;
}, 5);
};
e.prototype.createFishTide = function(t, e, i) {
var o = this;
i - 5e3 <= 0 ? this.scheduleOnce(function() {
o.fishTide_1_2_3_4_5(t).catch(function(t) {
wLog.e(t);
});
}, (5e3 - i) / 1e3) : this.fishTide_1_2_3_4_5(t, e, i - 5e3).catch(function(t) {
wLog.e(t);
});
};
e.prototype.Msg_Game_ActShoot = function(t) {
var e = this;
if (t.seat != this.DNTGModel.getMyData().s_seat) {
var i = this.DNTGModel.get_s_seat_data(t.seat);
if (Object.prototype.hasOwnProperty.call(t, "x")) {
i.angle = t.angle;
i.dir = cc.v2(t.dir_x * this.node.getChildByName("bullet").scaleX, t.dir_y * this.node.getChildByName("bullet").scaleY);
} else {
var o = this.DNTGModel.fishList[t.lockID];
if (o && this.getPointInPolygon(wUtils.local_world__POS(o.n))) {
var s = wUtils.local_world__POS(o.n), a = this.DNTGModel.getAngle(this.DNTGView.getBatteryPos(i.l_seat), s);
a.angle *= this.node.getChildByName("bullet").scaleY;
i.angle = a.angle;
i.dir = a.dir;
} else {
t.lockID = null;
wLog.w("锁定的鱼不在了", t.lockID);
}
}
this.scheduleOnce(function() {
i.gold -= e.DNTGModel.di_score * t.level;
i.bulletStartPos = wUtils.world_local_POS(e.node.getChildByName("bullet"), e.DNTGView.getGunPos(i.l_seat));
e.creatorBullet(i, t.lockID);
});
} else this.DNTGModel.bulletid.push(t.bulletid);
};
e.prototype.creatorBullet = function(t, e) {
var i = this;
if (t.uid == wGameData.getKey("uid")) {
if (t.bulletList.reduce(function(t, e) {
return t + (e ? 1 : 0);
}, 0) >= a.DNTGConfig.maxBullet) {
if (this.DNTGModel.bulletTips_s) {
this.DNTGModel.bulletTips_s = !1;
wUIManager.showTips("您发射的子弹够多了,歇歇吧!", wUIManager.TIPS_OK);
this.scheduleOnce(function() {
i.DNTGModel.bulletTips_s = !0;
}, this.DNTGModel.bulletTips_t);
}
return !1;
}
var s = this.DNTGModel.di_score * t.gear;
if (s > this.DNTGModel.getMyData().gold) {
wUIManager.showTips("金币不足,请先充值!");
this.DNTGModel.isOnClick = !1;
this.DNTGModel.auto = !1;
return !1;
}
e = (e = this.DNTGModel.getMyData().lockFish) ? e.id : 0;
var n = t.bulletStartPos;
wNetWork.send("Msg_" + this.vg_game + "_ActShoot", {
level: t.gear,
x: Number(n.x.toFixed(2)),
y: Number(n.y.toFixed(2)),
angle: t.angle,
dir_x: t.dir.x * this.node.getChildByName("bullet").scaleX,
dir_y: t.dir.y * this.node.getChildByName("bullet").scaleY,
lockID: e
});
t.gold -= s;
}
this.DNTGView.setBatteryStatus(t.l_seat, 1);
var r = this.bulletPool.getNode;
r.parent = this.node.getChildByName("bullet");
var l = r.getComponent(o.default), c = this.DNTGModel.fishList[e];
l.init(t, e, c);
t.bulletList.push(l);
return r;
};
e.prototype.onCollisionEnter = function(t, e) {
if (t && e.node.parent) {
var i = e, o = t.n, s = o.DATA;
if (!i.lockFishNode || !i.lockfishID || i.lockfishID == s.id) {
var a = e.node.DATA;
this.DNTGView.creatorWang(a.battery, wUtils.local_world__POS(e.node));
this.setFishColor(o);
var n = Number(o.DATA.id);
if (a.uid == wGameData.getKey("uid") && this.DNTGModel.fishList[n]) {
wAudioMgr.playSound("sound/GunFire0", "DNTG");
var r = this.DNTGModel.bulletid.shift();
if (r) {
var l = {
bulletid: r,
fish: n
};
wNetWork.send("Msg_" + this.vg_game + "_GetFish", l);
} else wLog.w("没有子弹ID了");
}
for (var c = 0; c < a.bulletList.length; c++) if (a.bulletList[c].node == e.node) {
a.bulletList.splice(c, 1);
this.bulletPool.put(e.node);
break;
}
}
}
};
e.prototype.setFishColor = function(t) {
for (var e = 0, i = t.children; e < i.length; e++) {
var o = i[e];
o.getComponent(cc.Sprite) && o.runAction(this.creatorAni());
this.setFishColor(o);
}
};
e.prototype.creatorAni = function() {
var t = cc.tintTo(.05, 255, 0, 0), e = cc.tintTo(.05, 255, 255, 255);
return cc.sequence(t, e);
};
e.prototype.onClick = function(t, e) {
var i, o = this;
switch (e) {
case "switchFish":
this.DNTGModel.getMyData().lockFish = this.getLockFish();
break;

case "setbattery":
var s = this.DNTGModel.getMyData();
wViewMgr.openPage({
path: c.Config.ViewConfig.ChangeGuns,
data: {
idx: s.battery,
cb: function(t) {
s.battery != t && wNetWork.send("Msg_" + o.vg_game + "_FishBattery", {
battery: t
});
}
}
});
break;

case "auto":
this.DNTGModel.auto = !this.DNTGModel.auto;
break;

case "lock":
this.DNTGModel.lock = !this.DNTGModel.lock;
break;

case "exit":
wUIManager.showGameOutTips({
okCB: function() {
if (cc.isValid(o)) {
o.DNTGModel.isOnClick = !1;
o.DNTGModel.auto = !1;
wNetWork.send("Msg_" + o.vg_game + "_Out", [], !0);
}
}
});
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

case "reduce":
(i = this.DNTGModel.getMyData().gear - 1) < 1 && (i = 10);
wNetWork.send("Msg_" + this.vg_game + "_ActChange", {
level: i
});
break;

case "add":
(i = this.DNTGModel.getMyData().gear + 1) > 10 && (i = 1);
wNetWork.send("Msg_" + this.vg_game + "_ActChange", {
level: i
});
}
wAudioMgr.playBtnSound();
};
e.prototype.onEvent = function(t, e) {
if ("start" == t) {
this.DNTGView.showBattery(!1);
this.DNTGModel.isOnClick = !0;
var i = e.getLocation();
if (!this.DNTGModel.lock || !this.DNTGModel.getMyData().lockFish) {
var o = this.DNTGModel.getAngle(this.DNTGView.getBatteryPos(this.DNTGModel.l_seat), i);
this.DNTGModel.getMyData().angle = o.angle;
this.DNTGModel.getMyData().dir = o.dir;
}
} else if ("move" == t) {
if (!this.DNTGModel.lock || !this.DNTGModel.getMyData().lockFish) {
o = this.DNTGModel.getAngle(this.DNTGView.getBatteryPos(this.DNTGModel.l_seat), e.getLocation());
this.DNTGModel.getMyData().angle = o.angle;
this.DNTGModel.getMyData().dir = o.dir;
}
} else this.DNTGModel.isOnClick = !1;
};
e.prototype.launchBullet = function() {
var t = this;
if ((this.DNTGModel.isOnClick || this.DNTGModel.auto) && !this.DNTGModel.tide && this.DNTGModel.isLaunch) {
this.DNTGView.exitTips();
this.DNTGModel.isLaunch = !1;
this.scheduleOnce(function() {
t.DNTGModel.isLaunch = !0;
}, a.DNTGConfig.launchTime);
var e = this.DNTGModel.getMyData();
e.bulletStartPos = wUtils.world_local_POS(this.node.getChildByName("bullet"), this.DNTGView.getGunPos(this.DNTGModel.l_seat));
this.creatorBullet(e) && wAudioMgr.playSound("sound/Fire", "DNTG");
}
};
e.prototype.lockFish = function() {
for (var t = this.DNTGModel.robotList, e = 0; e < t.length; e++) {
var i = t[e], o = this.DNTGModel.get_uid_data(i);
if ((i != wGameData.getKey("uid") || this.DNTGModel.lock) && o) {
var s = o.lockFish;
if (s) {
if (!cc.isValid(s.n, !0) || !this.getPointInPolygon(wUtils.local_world__POS(s.n))) {
a = this.getLockFish();
o.lockFish = a || null;
}
} else {
var a = this.getLockFish();
a && (o.lockFish = a);
}
}
}
var n = this.DNTGModel.playerData;
for (var r in n) {
var l = n[r];
if (l.uid && l.lockFish) if (cc.isValid(l.lockFish.n, !0)) {
var c = wUtils.local_world__POS(l.lockFish.n);
if (l.uid == wGameData.getKey("uid") || this.getPointInPolygon(c)) {
var h = this.DNTGModel.getAngle(this.DNTGView.getBatteryPos(l.l_seat), c);
l.l_seat > 1 && (h.angle += 180);
l.angle = h.angle;
l.dir = h.dir;
this.DNTGView.setLockLine(l.l_seat, c);
} else l.lockFish = null;
} else wLog.w("鱼消失了不用锁定");
}
};
e.prototype.fishMove = function(t) {
for (var e in this.DNTGModel.fishList) this.DNTGModel.fishList[e].DNTGFish.pathMove(t);
};
e.prototype.bulletMove = function(t) {
for (var e in this.DNTGModel.playerData) {
var i = this.DNTGModel.playerData[e];
if (i.bulletList.length) for (var o = 0, s = i.bulletList; o < s.length; o++) {
var a = s[o];
if (a.lockfishID) {
var n = this.DNTGModel.fishList[a.lockfishID];
n && this.getPointInPolygon(wUtils.local_world__POS(n.n)) || (a.lockFishNode = null);
}
a.moveBullet(t);
}
}
};
e.prototype.quadtreeCollision = function() {
if (this.myTree) {
this.myTree.clear();
var t = this.DNTGModel.fishList;
for (var e in t) {
var i = t[e].DNTGFish;
if (i) {
var o = i.getRect();
o && this.myTree.insert(o);
}
}
for (var e in this.DNTGModel.playerData) {
var s = this.DNTGModel.playerData[e];
if (s.bulletList.length) for (var a = 0, n = s.bulletList; a < n.length; a++) for (var r = n[a], l = r.getRect(), c = 0, h = this.myTree.retrieve(l); c < h.length; c++) {
var d = h[c];
if (r.lockFishNode) {
if (d.id != r.lockfishID) continue;
d.x += d.width / 2 - 20;
d.y += d.height / 2 - 20;
d.width = 40;
d.height = 40;
}
d.intersects(l) && this.onCollisionEnter(this.DNTGModel.fishList[d.id], r);
}
}
}
};
e.prototype.update = function(t) {
!t && (t = 1 / 60);
this.fishMove(t);
this.bulletMove(t);
this.lockFish();
this.launchBullet(t);
this.quadtreeCollision();
};
__decorate([ u(n.default) ], e.prototype, "DNTGView", void 0);
__decorate([ u([ cc.Prefab ]) ], e.prototype, "fish", void 0);
__decorate([ u(cc.Asset) ], e.prototype, "huaJson", void 0);
__decorate([ u(cc.Asset) ], e.prototype, "pathJson", void 0);
return __decorate([ d ], e);
}(cc.Component);
i.default = p;
cc._RF.pop();
}, {
Config: void 0,
DNTGBullet: "DNTGBullet",
DNTGFish: "DNTGFish",
DNTGModel: "DNTGModel",
DNTGView: "DNTGView",
NodePool: void 0,
quadtree: void 0
} ],
DNTGFish: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "7f4c55CHbVFVZT0NnFS+wsW", "DNTGFish");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = t("DNTGModel"), s = cc._decorator, a = s.ccclass;
s.property;
var n = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.isStart = !1;
e.cb = null;
e.o_x = -1;
e.o_y = -1;
return e;
}
e.prototype.init = function(t, e, i) {
return __awaiter(this, void 0, void 0, function() {
var s, a, n, r, l, c, h, d, u, p, f, g, y, v, m, _, w = this;
return __generator(this, function(N) {
switch (N.label) {
case 0:
this.node.setPosition(0, 0);
this.node.DATA = this;
this.recoveryFishCB = i;
this.cb = e;
this.ding = !1;
this.kill = !1;
this.isEnd = !1;
this.isStart = !1;
this.moveType = 0;
this.o_x = -1;
this.o_y = -1;
Object.assign(this, t);
this.node.zIndex = o.DNTGConfig.zindex[this.type] || this.type;
this.dir = t.dir || cc.v2(0, 0);
if (1 == this.moveType) {
this.node.setPosition(cc.v2.apply(cc, t.pos));
s = this.dir.x * this.speed;
a = this.dir.y * this.speed;
n = cc.v2(this.node.x + s, this.node.y + a);
r = this.node.getPosition();
h = -wUtils.GetAngleByVector(r, n);
(d = this.node.getChildByName("angle")) && (d.angle = h);
} else if (0 == this.pathID) this.startMove(); else {
l = this.initPos_Angle(Math.floor(this.pathID));
c = l.p1;
h = l.angle;
this.node.setPosition(c);
(d = this.node.getChildByName("angle")) && (d.angle = h);
}
switch (u = t.type > 100 ? 100 * Math.floor(t.type / 100) : t.type) {
case 700:
case 100:
return [ 3, 1 ];

case 200:
return [ 3, 3 ];

case 300:
return [ 3, 4 ];

case 400:
case 500:
return [ 3, 6 ];
}
return [ 3, 7 ];

case 1:
this.node.getChildByName("angle").destroyAllChildren();
return [ 4, this.creatorNode(this.couples[0]) ];

case 2:
m = N.sent();
if (!cc.isValid(this.node, !0)) return [ 2 ];
if (!(_ = cc.find("angle/icon", m))) {
wLog.w("一鱼炸弹出现问题:", this.couples);
return [ 2 ];
}
_.parent = null;
this.node.getChildByName("angle").addChild(_, 1, "zhadan");
m.destroy();
return [ 3, 7 ];

case 3:
p = this.node.children[0];
f = [];
for (g = 6; g < p.childrenCount; g++) f.push(p.children[g]);
y = 0;
for (v = f; y < v.length; y++) v[y].destroy();
5 != this.couples.length && wLog.e("五种鱼炸弹出现错误:", this.couples);
this.couples.sort(function(t, e) {
return t - e;
});
this.couples.forEach(function(t, e) {
return __awaiter(w, void 0, void 0, function() {
var i, o;
return __generator(this, function(s) {
switch (s.label) {
case 0:
return [ 4, this.creatorNode(t) ];

case 1:
i = s.sent();
if (!cc.isValid(this.node, !0)) return [ 2 ];
(o = cc.find("angle", i)).parent = null;
p.addChild(o, 1, "angle");
o.setPosition(p.children[e].getPosition());
o = o.children[0];
i.destroy();
return [ 2 ];
}
});
});
});
return [ 3, 7 ];

case 4:
this.node.getChildByName("angle").destroyAllChildren();
return [ 4, this.creatorNode(this.type % 100) ];

case 5:
m = N.sent();
if (!cc.isValid(this.node, !0)) return [ 2 ];
(_ = cc.find("angle/icon", m)).parent = null;
this.node.getChildByName("angle").addChild(_, 1, "zhadan");
this.node.getChildByName("bg").scale = wUtils.random(7, 10) / 10;
m.destroy();
return [ 3, 7 ];

case 6:
if (400 == u && 2 != this.couples.length) {
wLog.e("二个鱼炸弹出现错误:", this.couples);
return [ 2 ];
}
if (500 == u && 3 != this.couples.length) {
wLog.e("三种鱼炸弹出现错误:", this.couples);
return [ 2 ];
}
this.node.getChildByName("angle").destroyAllChildren();
this.couples.forEach(function(t) {
return __awaiter(w, void 0, void 0, function() {
var e, i;
return __generator(this, function(o) {
switch (o.label) {
case 0:
return [ 4, this.creatorNode(t) ];

case 1:
e = o.sent();
if (!cc.isValid(this.node, !0)) return [ 2 ];
(i = cc.find("angle", e)).parent = null;
i.children[1] || wLog.w(this.couples);
i.width = i.children[1].width;
this.node.getChildByName("angle").addChild(i, 1, "zhadan");
e.destroy();
return [ 2 ];
}
});
});
});
return [ 3, 7 ];

case 7:
this.initScale();
this.collider = this.node.children[0].children[0];
this.setNodeColor(this.node);
if (Object.prototype.hasOwnProperty.call(t, "o_x")) {
this.o_x = t.o_x;
this.node.x = t.o_x;
}
if (Object.prototype.hasOwnProperty.call(t, "o_y")) {
this.o_y = t.o_y;
this.node.y = t.o_y;
}
return [ 2 ];
}
});
});
};
e.prototype.setNodeColor = function(t) {
for (var e = 0, i = t.children; e < i.length; e++) {
var o = i[e];
if (o.getComponent(cc.Sprite)) {
o.stopAllActions();
o.color = cc.color(255, 255, 255);
}
this.setNodeColor(o);
}
};
e.prototype.getRect = function() {
if (!this.node.parent) return null;
this.collider || (this.collider = this.node.children[0].children[0]);
var t = this.collider.getBoundingBoxToWorld();
t.id = this.id;
return t;
};
e.prototype.initScale = function() {
if ({
18: !0,
17: !0,
16: !0,
27: !0
}[this.type]) {
this.node.scaleX = 1;
var t = -1 * this.dir.x || this.path[0][0] - this.path[this.path.length - 1][0];
this.node.scaleY = this.node.parent.scaleY;
t > 0 && (this.node.scaleX = -1);
}
if (100 * Math.floor(this.type / 100) == 600 || 92 == this.type) {
this.node.scaleY = this.node.parent.scaleY;
this.node.scaleX = this.node.parent.scaleX;
}
};
e.prototype.fishDie = function() {
var t = this;
this.path = null;
this.kill = !0;
this.node.stopAllActions();
if (this.type > 89) this.poolPut(); else {
var e = this.node, i = cc.repeat(cc.sequence(cc.rotateBy(.08, 30), cc.rotateBy(.08, -30)), 8);
e.runAction(cc.sequence(i, cc.callFunc(function() {
t.poolPut();
})));
}
};
e.prototype.creatorNode = function(t) {
var e = this;
return new Promise(function(i, o) {
var s = "fishPrefab/" + t;
wRes.loadRes(s, function(s, a) {
if (cc.isValid(e)) if (s) {
wLog.e("鱼儿创建失败：", t);
o(!1);
} else if (cc.isValid(e.node, !0)) i(cc.instantiate(a)); else {
wLog.e("鱼儿创建回来节点已失效");
o(!1);
}
}, wGameData.getGameName());
});
};
e.prototype.initPos_Angle = function(t) {
var e = this.path[t];
e = cc.v2(e[0], e[1]);
var i = this.path[t + 1];
return {
p1: e,
p2: i = cc.v2(i[0], i[1]),
angle: -wUtils.GetAngleByVector(e, i)
};
};
e.prototype.startMove = function() {
var t = this, e = this.node, i = this.initPos_Angle(0), o = i.p1, s = i.p2, a = i.angle, n = e.getChildByName("angle");
n && (n.angle = a);
var r = wUtils.Normalize(o, s), l = cc.v2(100 * r.x + o.x, 100 * r.y + o.y);
e.setPosition(l);
var c = cc.moveTo(.6, o).easing(cc.easeOut(1)), h = cc.callFunc(function() {
t.isStart = !1;
});
e.runAction(cc.sequence(c, h));
this.isStart = !0;
};
e.prototype.poolPut = function() {
this.recoveryFishCB(this.node);
};
e.prototype.pathMove = function(t) {
this.kill || this.ding || this.isStart || this.isEnd || (1e3 == this.wayid ? this.dirMove(t) : 1 == this.moveType ? this.tideMove_5(t) : this.posMove(t));
};
e.prototype.tideMove_5 = function() {
var t = this.dir.x * this.speed, e = this.dir.y * this.speed, i = cc.v2(this.node.x + t, this.node.y + e);
this.node.setPosition(i);
if (this.dir.y > 0 && this.node.y > cc.winSize.height) {
this.isEnd = !0;
this.cb(this.id);
} else if (this.dir.y < 0 && this.node.y < 0) {
this.isEnd = !0;
this.cb(this.id);
}
if (this.dir.x > 0 && this.node.x > cc.winSize.width) {
this.isEnd = !0;
this.cb(this.id);
} else if (this.dir.x < 0 && this.node.x < 0) {
this.isEnd = !0;
this.cb(this.id);
}
};
e.prototype.posMove = function(t) {
var e = this.speed * t;
this.pathID += e;
if (Math.ceil(this.pathID) >= this.path.length - 1) {
this.pathID = this.path.length - 1;
this.isEnd = !0;
this.cb(this.id);
}
var i = Math.ceil(this.pathID), o = cc.v2(this.path[i][0], this.path[i][1]), s = cc.v2(this.path[i - 1][0], this.path[i - 1][1]);
this.dir = o.sub(s);
var a = this.dir.mag();
this.dir = this.dir.normalize();
for (var n = this.dir.x * a * e, r = this.dir.y * a * e, l = cc.v2(this.node.x + n, this.node.y + r), c = this.node.getPosition(), h = -wUtils.GetAngleByVector(c, l), d = 0, u = this.node.children; d < u.length; d++) {
var p = u[d], f = p;
"angle" == p.name && (f.angle = h);
}
this.node.x = this.o_x > -1 ? this.o_x : l.x;
this.node.y = this.o_y > -1 ? this.o_y : l.y;
};
e.prototype.dirMove = function(t) {
var e = this.speed * t;
this.pathID += e;
if (Math.ceil(this.pathID) >= this.path.length - 1) {
this.pathID = this.path.length - 1;
this.cb(this.id);
this.isEnd = !0;
}
var i = Math.ceil(this.pathID), o = cc.v2(this.path[i][0], this.path[i][1]), s = cc.v2(this.path[i - 1][0], this.path[i - 1][1]);
this.dir = o.sub(s);
var a = this.dir.mag();
this.dir = this.dir.normalize();
var n = +(this.dir.x * a * e).toFixed(2), r = +(this.dir.y * a * e).toFixed(2);
this.node.x += n;
this.node.y += r;
};
e.prototype.endMove = function() {
var t = 1.5 * this.dir.x, e = 1.5 * this.dir.y;
if (!t && !e) {
var i = this.path.length - 1, o = cc.v2(this.path[i][0], this.path[i][1]), s = cc.v2(this.path[i - 20][0], this.path[i - 20][1]);
this.dir = o.sub(s).normalize();
}
this.node.x += t;
this.node.y += e;
this.node.x > cc.winSize.width + 100 || this.node.x < -100 ? this.poolPut() : (this.node.y > cc.winSize.height + 100 || this.node.y < -100) && this.poolPut();
};
e.prototype.update = function() {
!this.isEnd || this.kill || this.ding || this.endMove();
};
return __decorate([ a ], e);
}(cc.Component);
i.default = n;
cc._RF.pop();
}, {
DNTGModel: "DNTGModel"
} ],
DNTGLoad: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "58a8c9Lbw5Fd6R/62CQJgVQ", "DNTGLoad");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = t("Config"), s = cc._decorator, a = s.ccclass, n = s.property, r = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.prog = null;
e.prefabList = null;
return e;
}
e.prototype.onLoad = function() {
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
};
e.prototype.start = function() {
return __awaiter(this, void 0, Promise, function() {
var t, e;
return __generator(this, function(i) {
switch (i.label) {
case 0:
if (wGameData.isReconnect) return [ 3, 2 ];
t = [ this.preloadGameRes(), this.sendMsg() ];
return [ 4, Promise.all(t) ];

case 1:
i.sent();
i.label = 2;

case 2:
e = this;
return [ 4, this.preloadGameRes() ];

case 3:
e.prefabList = i.sent();
this.loadRoom();
return [ 2 ];
}
});
});
};
e.prototype.onEnable = function() {
var t = cc.find("main/logo", this.node);
t.opacity = 0;
t.y += 150;
var e = cc.fadeIn(.2), i = cc.moveBy(.2, cc.v2(0, -150)).easing(cc.easeOut(1.5)), o = cc.spawn(e, i);
t.runAction(o);
};
e.prototype.hide = function() {
var t = this;
cc.find("bg", this.node).active = !1;
var e = cc.find("main/logo", this.node), i = cc.fadeOut(.2), o = cc.moveBy(.2, cc.v2(0, 150)), s = cc.spawn(i, o), a = cc.callFunc(function() {
t.node.destroy();
}), n = cc.sequence(s, a);
e.runAction(n);
};
e.prototype.sendMsg = function() {
var t = this;
return new Promise(function(e) {
var i = wGEvent.on("Msg_Hall_GameSessions", function(o) {
t.Msg_Hall_GameSessions(o);
wGEvent.off(i);
t.unscheduleAllCallbacks();
i = null;
e();
}, t);
t.scheduleOnce(function() {
if (i) {
wUIManager.showTips("请求游戏配置失败");
wGEvent.off(i);
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
var t = this, e = cc.find("main/progLabel", this.node).getComponent(cc.Label);
return new Promise(function(i) {
var s = o.Config.GamePrefab[wGameData.gameID], a = [ s.prefabUrl, "prefab/Room" ];
wRes.loadRes(a, function(i, o) {
var s = i / o || 0;
s *= 672;
if (t.prog.width < s) {
t.prog.width = s;
e.string = Math.floor(i / o * 100) + "%";
e.node.x = -326.5 + s;
}
}, function(t, e) {
i(e);
}, s.enName);
});
};
e.prototype.loadRoom = function() {
var t = cc.Canvas.instance.node.getChildByName("Room");
t.active = !0;
for (var e = 0, i = this.prefabList; e < i.length; e++) {
var o = i[e];
if ("Room" == o.name) {
cc.instantiate(o).parent = t;
this.node.zIndex = 100;
wGameData.isReconnect || this.hide();
}
}
};
__decorate([ n(cc.Node) ], e.prototype, "prog", void 0);
return __decorate([ a ], e);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {
Config: void 0
} ],
DNTGModel: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "27632JN+i5J3pVmrxaoRsaN", "DNTGModel");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.DNTGCreatorProxy = i.DNTGModel = i.DNTGCreatorPlayerProxy = i.DNTGPlayer = i.DNTGConfig = void 0;
i.DNTGConfig = {
maxGear: 10,
bulletSpeed: 800,
maxBullet: 100,
launchTime: .2,
stopMoveTime: 15,
shadow: !0,
bulletUrl: [ "res/bullet/dntg_bullet00", "res/bullet/dntg_bullet10" ],
battery: [ "res/paotai1/paotai1", "res/paotai2/paotai2" ],
sound: [ "Game/BUYU/sound/fire-vip0", "Game/BUYU/sound/fire-vip1", "Game/BUYU/sound/fire-vip2", "Game/BUYU/sound/fire-vip3", "Game/BUYU/sound/fire-vip4", "Game/BUYU/sound/fire-vip5", "Game/BUYU/sound/fire-vip6", "Game/BUYU/sound/fire-vip7", "Game/BUYU/sound/fire-vip8", "Game/BUYU/sound/fire-vip9", "Game/BUYU/sound/fire-vip10", "Game/BUYU/sound/fire-zhouka", "Game/BUYU/sound/fire-yueka" ],
fishConfig: {
1: [ 0, 0 ],
2: [ 1, 1 ],
3: [ 2, 2 ],
4: [ 3, 3 ],
5: [ 4, 4 ],
6: [ 5, 5 ],
7: [ 6, 6 ],
8: [ 7, 7 ],
9: [ 8, 8 ],
10: [ 9, 9 ],
11: [ 10, 10 ],
12: [ 11, 11 ],
13: [ 12, 12 ],
14: [ 13, 13 ],
15: [ 14, 14 ],
16: [ 15, 26 ],
17: [ 16, 25 ],
18: [ 17, 18 ],
19: [ 18, 15 ],
20: [ 19, 16 ],
21: [ 20, 21 ],
22: [ 21, 19 ],
23: [ 22, 20 ],
24: [ 23, 17 ],
25: [ 24, 22 ],
26: [ 25, 23 ],
27: [ 26, 24 ],
92: [ 27, 33 ],
200: [ 28, 31 ],
300: [ 29, 27 ],
400: [ 30, 29 ],
500: [ 31, 30 ],
600: [ 32, 32 ],
601: [ 32, 32 ],
602: [ 32, 32 ],
603: [ 32, 32 ],
700: [ 33, 28 ]
},
zindex: {
27: 1e3,
16: 1016,
17: 1017,
26: 1026,
92: 1092,
25: 1001
},
winType: {
19: "fish-name-15",
20: "fish-name-16",
24: "fish-name-17",
18: "fish-name-18",
22: "fish-name-19",
23: "fish-name-20",
21: "fish-name-21",
25: "fish-name-22",
26: "fish-name-23",
27: "fish-name-24",
17: "fish-name-25",
16: "fish-name-26"
}
};
var o = function() {
function t() {
this.uid = 0;
this.l_seat = null;
this.s_seat = null;
this.gold = null;
this.gear = 0;
this.battery = 0;
this.lockFish = null;
this.angle = 0;
this.dir = cc.v2(0, 1);
this.bulletStartPos = null;
this.bulletList = [];
this.openShadow = !0;
this.keyCb = {};
}
t.prototype.onEvevt = function(t, e) {
if ("function" == typeof e) {
!this.keyCb[t] && (this.keyCb[t] = []);
this.keyCb[t].push(e);
} else wLog.e("对象绑定错误");
};
return t;
}();
i.DNTGPlayer = o;
i.DNTGCreatorPlayerProxy = function() {
var t = new o();
return new Proxy(t, {
get: function(t, e) {
return t[e];
},
set: function(t, e, o) {
switch (e) {
case "gear":
o > i.DNTGConfig.maxGear && (o = 1);
o < 1 && (o = i.DNTGConfig.maxGear);
}
t[e] = o;
t.keyCb[e] && t.keyCb[e].forEach(function(t) {
t && t(o);
});
return !0;
}
});
};
var s = function() {
function t() {
this.auto = !1;
this.lock = !1;
this.di_score = 100;
this.playerData = {};
this.l_seat = null;
this.s_seat = null;
this.isOnClick = !1;
this.isLaunch = !0;
this.bulletid = [];
this.bulletTips_s = !1;
this.bulletTips_t = 10;
this.fishPath = [ "" ];
this.fishList = {};
this.tide = !1;
this.tideScene = {};
this.robotList = [ wGameData.getKey("uid") ];
this.keyCb = {};
this.getAngle = function(t, e) {
var i = Number((-wUtils.GetAngleByVector(t, e)).toFixed(2)), o = wUtils.Normalize(e, t);
o.x = Number(o.x.toFixed(2));
o.y = Number(o.y.toFixed(2));
return {
angle: i,
dir: o
};
};
}
t.prototype.onEvevt = function(t, e) {
if ("function" == typeof e) {
!this.keyCb[t] && (this.keyCb[t] = []);
this.keyCb[t].push(e);
} else wLog.e("对象绑定错误");
};
t.prototype.getMyData = function() {
return this.playerData[this.l_seat];
};
t.prototype.get_uid_data = function(t) {
for (var e in this.playerData) {
var i = this.playerData[e];
if (i.uid == t) return i;
}
};
t.prototype.get_s_seat_data = function(t) {
for (var e in this.playerData) {
var i = this.playerData[e];
if (i.s_seat == t) return i;
}
};
return t;
}();
i.DNTGModel = s;
i.DNTGCreatorProxy = function() {
var t = new s();
return new Proxy(t, {
get: function(t, e) {
return t[e];
},
set: function(t, e, i) {
t[e] = i;
t.keyCb[e] && t.keyCb[e].forEach(function(t) {
t && t(i);
});
return !0;
}
});
};
cc._RF.pop();
}, {} ],
DNTGRoom: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "936cfk0R4lFL5ITU+RC/pNL", "DNTGRoom");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = t("Config"), s = cc._decorator, a = s.ccclass, n = s.property, r = function(t) {
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
var i = Number(e) - 1;
this.content.getChildByName("" + i).on("click", this.roomOnClick, this);
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
var t = cc.moveTo(.26, cc.v2(0, 375)).easing(cc.easeBackOut());
this.top.runAction(t);
this.bottom.stopAllActions();
this.bottom.y = -100;
var e = cc.moveTo(.26, cc.v2(0, 0)).easing(cc.easeBackOut());
this.bottom.runAction(e);
this.node.getChildByName("main").opacity = 0;
var i = cc.fadeTo(.4, 255);
this.node.getChildByName("main").runAction(i);
for (var o = this.content, s = 0; s < o.childrenCount; s++) {
var a = o.children[s], n = cc.v2(a.x, a.y);
a.x += 150;
var r = cc.moveTo(.2, n).easing(cc.easeBackOut());
r.speed(.35);
a.runAction(r);
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
var i = wGameData.roomConfig[t];
if (i) if (i.min_gold > wGameData.getKey("gold")) wUIManager.enterRoomFailTips(i.min_gold); else if (wGameData.gameRepair()) wUIManager.showTips("游戏维护中"); else {
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
} else wUIManager.showTips("游戏配置错误，请重新进入游戏！");
}
};
e.prototype.faststart = function() {
wAudioMgr.playBtnSound();
var t = wGameData.getKey("gold"), e = wGameData.roomConfig, i = 1;
for (var o in e) Object.prototype.hasOwnProperty.call(e, o) && e[o].min_gold <= t && (i = e[o].level);
this.enterRoom(i);
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
return;
}
wAudioMgr.playBtnSound();
}
};
e.prototype.loadGame = function() {
var t = o.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(t.prefabUrl, function() {}, function(t, e) {
t ? wLog.e(t) : wViewMgr.openGame(e);
}, t.enName);
};
__decorate([ n(cc.Node) ], e.prototype, "content", void 0);
__decorate([ n(cc.Node) ], e.prototype, "top", void 0);
__decorate([ n(cc.Node) ], e.prototype, "bottom", void 0);
__decorate([ n(cc.Sprite) ], e.prototype, "head", void 0);
__decorate([ n(cc.Label) ], e.prototype, "nickname", void 0);
__decorate([ n(cc.Label) ], e.prototype, "gold", void 0);
__decorate([ n(cc.Label) ], e.prototype, "bankGold", void 0);
return __decorate([ a ], e);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {
Config: void 0
} ],
DNTGView: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "95a2fH/JrBMVYGxO8TKqQjm", "DNTGView");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = t("NodePool"), s = t("DNTGModel"), a = cc._decorator, n = a.ccclass, r = a.property, l = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.player = [];
e.lockImg = null;
e.lock = null;
e.paotai = null;
e.info = null;
e.mul = null;
e.waitTips = null;
e.bgImg = [];
e.bgIdx = 0;
e.switchFish = null;
e.DNTGModel = null;
e.goldShow = null;
e.fishNum = null;
e.line = {};
return e;
}
e.prototype.onLoad = function() {
var t = this.node.getChildByName("copyItem");
this.goldShow = this.creatorNodePool(t.getChildByName("goldAnim"), 30);
this.fishNum = this.creatorNodePool(t.getChildByName("num"), 5);
this.goldShow3 = this.creatorNodePool(t.getChildByName("goldShow3"), 10);
this.line[1] = this.creatorNodePool(t.getChildByName("line1"), 30);
this.line[2] = this.creatorNodePool(t.getChildByName("line2"), 30);
this.wangPool = this.creatorNodePool(t.getChildByName("wang"), 10);
};
e.prototype.onDestroy = function() {
this.wangPool.clear();
this.goldShow.clear();
this.fishNum.clear();
this.goldShow3.clear();
this.line[1].clear();
this.line[2].clear();
};
e.prototype.creatorNodePool = function(t, e) {
var i = new o.default(t, e);
i.put(t);
return i;
};
e.prototype.init = function(t) {
this.DNTGModel = t;
};
e.prototype.add_delete_player = function(t, e) {
if (e.uid) {
this.setBatteryStatus(t, 0);
this.setLockType(t, "");
if (e.uid == wGameData.getKey("uid")) {
this.player[t].getChildByName("btn").active = !0;
var i = this.node.getChildByName("tips").getChildByName("battery"), o = this.paotai.getChildByName("paotai" + t);
i.x = o.x;
o.on("click", function() {
i.active = !i.active;
});
}
this.setPlayerNode(t, !0);
} else this.setPlayerNode(t, !1);
};
e.prototype.setPlayerNode = function(t, e) {
this.lock.getChildByName("" + t).active = !1;
this.paotai.getChildByName("paotai" + t).active = e;
this.info.getChildByName("name" + t).active = e;
this.info.getChildByName("gold" + t).active = e;
this.mul.getChildByName("fen" + t).active = e;
this.waitTips.getChildByName("" + t).active = !e;
this.player[t].active = e;
};
e.prototype.setName = function(t, e) {
this.info.getChildByName("name" + t).getComponent(cc.Label).string = "" + e;
};
e.prototype.setGold = function(t, e) {
this.info.getChildByName("gold" + t).getComponent(cc.Label).string = "" + e;
};
e.prototype.setScore = function(t, e) {
this.mul.getChildByName("fen" + t).getComponent(cc.Label).string = "" + e;
};
e.prototype.setLockType = function(t, e) {
this.lock.getChildByName("" + t).active = Boolean(e);
if (t == this.DNTGModel.l_seat) {
this.switchFish.active = Boolean(e);
if (e && cc.isValid(e.n, !0)) {
var i = this.switchFish.getChildByName("fish"), o = cc.instantiate(e.n);
i.destroyAllChildren();
o.parent = i;
wUIHelp.setNodeColor(o, cc.color(255, 255, 255));
o.setPosition(0, 0);
var s = o.children[0];
s.angle = 0;
var a = s.children[0].getContentSize(), n = a.width > a.height ? a.width : a.height;
o.scale = n > 150 ? 150 / n : 1;
}
}
};
e.prototype.setLockLine = function(t, e) {
var i = this.lock.getChildByName("" + t);
i.getChildByName("end").setPosition(wUtils.world_local_POS(i, e));
var o = i.getChildByName("layout");
wUIHelp.hideSonNode(o);
var s = this.getGunPos(t), a = e.sub(s), n = a.mag();
a = a.normalize();
for (var r = Math.floor(n / 40), l = 1; l <= r; l++) {
var c = cc.v2(a.x * l * 40 + s.x, a.y * l * 40 + s.y), h = o.children[l - 1];
h || ((h = cc.instantiate(o.children[0])).parent = o);
h.active = !0;
h.setPosition(wUtils.world_local_POS(o, c));
}
};
e.prototype.setBatteryAngle = function(t, e) {
this.paotai.getChildByName("paotai" + t).angle = e;
};
e.prototype.setBatteryLZ = function(t) {
var e = cc.find("player/mulAnim/" + t, this.node);
e.active = !0;
for (var i = 0; i < e.childrenCount; i++) e.children[i].getComponent(cc.ParticleSystem).resetSystem();
var o = cc.delayTime(.3), s = cc.callFunc(function() {
e.active = !1;
}), a = cc.sequence(o, s);
e.stopAllActions();
e.runAction(a);
};
e.prototype.setBattery = function(t, e) {
var i = this, o = cc.find("paotai" + t + "/spine", this.paotai).getComponent(sp.Skeleton);
!o.PTType && (o.PTType = 0);
var a = e < 7 ? 0 : 1;
if (a != o.PTType) {
o.PTType = a;
var n = s.DNTGConfig.battery[a];
wRes.loadRes(n, sp.SkeletonData, function(e, s) {
if (cc.isValid(i.node, !0)) {
o.skeletonData = s;
i.setBatteryStatus(t, 1);
o.node.y = 0 == a ? 30 : 0;
}
}, "DNTG");
}
};
e.prototype.setBatteryStatus = function(t, e) {
if (e) {
var i = cc.find("paotai" + t + "/spine", this.paotai);
wUIHelp.playSpine(i, "animation");
}
};
e.prototype.getBatteryPos = function(t) {
var e = this.paotai.getChildByName("paotai" + t);
return wUtils.local_world__POS(e);
};
e.prototype.getGunPos = function(t) {
var e = cc.find("paotai" + t, this.paotai);
e = e.getChildByName("b");
return wUtils.local_world__POS(e);
};
e.prototype.showTips = function(t) {
var e = this.node.getChildByName("tips").getChildByName("posTips"), i = this.getBatteryPos(t);
i = wUtils.world_local_POS(this.node, i);
e.x = i.x;
this.scheduleOnce(function() {
var t = cc.fadeOut(.25), i = cc.callFunc(function() {
e.destroy();
}), o = cc.sequence(t, i);
e.runAction(o);
}, 3);
t || (cc.find("btn/switch", this.node).x = -310);
};
e.prototype.switchBG = function() {
var t = this, e = this.node.getChildByName("bg");
this.bgIdx++;
this.bgIdx > 3 && (this.bgIdx = 0);
var i = e.getChildByName("di");
i.active = !0;
var o = e.getChildByName("bg");
i.getComponent(cc.Sprite).spriteFrame = this.bgImg[this.bgIdx];
var s = e.getChildByName("ani");
s.active = !0;
s.getComponent(cc.ParticleSystem).resetSystem();
cc.tween(s).to(2.5, {
x: -900
}).call(function() {
s.x = 900;
s.active = !1;
}).start();
cc.tween(o).to(2.5, {
width: 0
}).call(function() {
o.getComponent(cc.Sprite).spriteFrame = t.bgImg[t.bgIdx];
o.width = 1624;
i.active = !1;
wAudioMgr.playBgMusic("sound/bgm/bgm" + (t.bgIdx + 1), wGameData.getGameName());
}).start();
};
e.prototype.exitTips = function() {
var t = this.node.getChildByName("tips").getChildByName("exittips");
t.stopAllActions();
t.active = !1;
this.node.stopActionByTag(100);
var e = cc.delayTime(120), i = cc.callFunc(function() {
t.active = !0;
var e = 10, i = cc.delayTime(1), o = cc.callFunc(function() {
var t = "您长时间没有发炮，您将在 " + --e + " 秒后离开游戏！";
wUIManager.showTips(t);
}), s = cc.sequence(cc.repeat(cc.sequence(i, o), 10), cc.callFunc(function() {
wNetWork.send("Msg_" + wGameData.getGameName() + "_Out", [], !0);
}));
t.runAction(s);
}), o = cc.sequence(e, i);
this.node.runAction(o).setTag(100);
};
e.prototype.showBattery = function(t) {
this.node.getChildByName("tips").getChildByName("battery").active = t;
};
e.prototype.specialEffects = function(t) {
cc.find("bg/ripple", this.node).active = !t;
};
e.prototype.showGold = function(t, e) {
return __awaiter(this, void 0, void 0, function() {
var i, o, s, a, n, r, l, c, h, d, u, p, f, g, y, v, m, _, w, N, G, D, T, M, b, C, P = this;
return __generator(this, function(k) {
switch (k.label) {
case 0:
wAudioMgr.playSound("sound/fish-gold", "DNTG");
i = this.DNTGModel.get_s_seat_data(e);
e = i.l_seat;
o = i.gear * this.DNTGModel.di_score;
s = this.player[e];
a = t.pos || wUtils.local_world__POS(t.n);
a = wUtils.world_local_POS(this.node, a);
n = this.node.getChildByName("UI_parent");
(r = this.fishNum.getNode).getComponent(cc.Label).string = "" + t.gold;
n.addChild(r, 10);
r.setPosition(a.x, a.y - 80);
r.scale = 0;
r.opacity = 0;
l = cc.fadeIn(.1);
c = cc.scaleTo(.1, 1);
h = cc.moveBy(.1, cc.v2(0, 50));
d = cc.spawn(l, c, h);
u = cc.moveBy(.1, cc.v2(0, 30));
p = cc.delayTime(.5);
f = cc.moveBy(.15, cc.v2(0, 80));
g = cc.fadeOut(.2);
y = cc.spawn(f, g);
v = cc.callFunc(function() {
P.fishNum.put(r);
});
m = cc.sequence(d, u, p, y, v);
r.runAction(m);
(_ = Math.floor(t.gold / o)) > 15 && (_ = 15);
w = [];
C = 0;
k.label = 1;

case 1:
return C < _ ? [ 4, wUtils.syncDelayed(C ? .1 : 0, this) ] : [ 3, 4 ];

case 2:
k.sent();
N = this.goldShow.getNode;
n.addChild(N, 3);
N.setPosition(a);
w.push(N);
N.angle = wUtils.random(-360, 360);
N.active = !0;
G = wUtils.random(-140, 140);
D = wUtils.random(-140, 140);
T = cc.moveBy(.2, cc.v2(G, D));
N.runAction(T);
k.label = 3;

case 3:
C++;
return [ 3, 1 ];

case 4:
return [ 4, wUtils.syncDelayed(1, this) ];

case 5:
k.sent();
if (!cc.isValid(this.node, !0)) return [ 2 ];
a = wUtils.local_world__POS(cc.find("goldbg", s));
a = wUtils.world_local_POS(n, a);
M = function() {
var t = s.getChildByName("lz");
t.active = !0;
t.stopAllActions();
var e = cc.callFunc(function() {
t.children[0].getComponent(cc.ParticleSystem).resetSystem();
}), i = cc.delayTime(.2), o = cc.callFunc(function() {
t.active = !1;
}), a = cc.sequence(e, i, o);
t.runAction(a);
};
b = function(t) {
var e = w[t], i = cc.delayTime(.1 * t), o = a.sub(e.getPosition()).mag() / 500 * .3, s = cc.moveTo(o, a).easing(cc.easeIn(3)), n = cc.callFunc(function() {
P.goldShow.put(e);
M();
}), r = cc.sequence(i, s, n);
e.runAction(r);
};
for (C = 0; C < _; C++) b(C);
return [ 2 ];
}
});
});
};
e.prototype.showEffect_3 = function(t, e) {
return __awaiter(this, void 0, void 0, function() {
var i, o, s, a, n, r, l = this;
return __generator(this, function(c) {
switch (c.label) {
case 0:
return [ 4, wUtils.syncDelayed(.5, this) ];

case 1:
c.sent();
e = this.DNTGModel.get_s_seat_data(e).l_seat;
i = this.goldShow3.getNode;
o = this.player[e].getChildByName("goldbg");
i.parent = o;
i.setPosition(140, 43);
i.getChildByName("label").getComponent(cc.Label).string = "+" + t;
s = e < 2 ? 50 : -50;
a = cc.moveBy(.6, cc.v2(0, s));
n = cc.callFunc(function() {
l.goldShow3.put(i);
});
r = cc.sequence(a, n);
i.runAction(r);
return [ 2 ];
}
});
});
};
e.prototype.showEffect_1 = function(t, e) {
e = this.DNTGModel.get_s_seat_data(e).l_seat;
var i = this.player[e].getChildByName("anim");
if (!i.active) {
i.active = !0;
i.scale = 0;
i.getChildByName("label").getComponent(cc.Label).string = "" + t;
wUIHelp.easeBackOut(i);
i.getChildByName("img").getComponent(cc.Animation).play();
var o = cc.delayTime(2), s = cc.callFunc(function() {
i.active = !1;
}), a = cc.sequence(o, s);
i.runAction(a);
}
};
e.prototype.lightningLine = function(t, e) {
var i = this, o = this.node.getChildByName("UI_parent");
t = wUtils.world_local_POS(o, t);
(function s() {
if (cc.isValid(i, !0)) {
for (var a = function() {
var s = e.shift();
if (!s) return "break";
var a = i.line[1].getNode;
a.parent = o;
a.width = 0;
a.opacity = 0;
a.active = !0;
a.zIndex = 2;
a.setPosition(t);
s = wUtils.world_local_POS(o, s);
var n = wUtils.VectorLen(t, s);
a.angle = 90 - wUtils.GetAngleByVector(t, s);
cc.tween(a).to(.3, {
width: n,
opacity: 200
}).delay(.3).to(.1, {
opacity: 0
}).call(function() {
i.line[1].put(a);
}).start();
}, n = 0; n < 4 && "break" !== a(); n++) ;
e.length > 0 && setTimeout(s.bind(i), 20);
}
})();
wAudioMgr.playSound("sound/fish-qipao", wGameData.getGameName());
};
e.prototype.showEffect_5 = function(t, e, i, o) {
return __awaiter(this, void 0, void 0, function() {
var s, a, n, r, l, c, h, d, u, p, f, g = this;
return __generator(this, function(y) {
switch (y.label) {
case 0:
s = function(t) {
return new Promise(function(e) {
wRes.loadRes("fishPrefab/300", function(i, o) {
wRes.loadRes("fishPrefab/" + t, function(t, i) {
if (cc.isValid(g.node, !0)) {
var s = cc.instantiate(o);
cc.instantiate(i).parent = s;
e(s);
}
}, wGameData.getGameName());
}, wGameData.getGameName());
});
};
a = [];
n = 0;
r = o;
y.label = 1;

case 1:
if (!(n < r.length)) return [ 3, 4 ];
if ((l = r[n]) > 299) return [ 3, 3 ];
h = (c = a).push;
return [ 4, s(l) ];

case 2:
h.apply(c, [ y.sent() ]);
y.label = 3;

case 3:
n++;
return [ 3, 1 ];

case 4:
return [ 4, Promise.all(a) ];

case 5:
y.sent();
if (!cc.isValid(this.node, !0)) return [ 2 ];
o = a;
d = this.DNTGModel.get_s_seat_data(i).l_seat;
u = this.node.getChildByName("UI_parent");
p = wUtils.local_world__POS(t);
p = wUtils.world_local_POS(u, p);
t.parent = u;
t.zIndex = 1;
t.setPosition(p);
p = wUtils.world_local_POS(u, this.getBatteryPos(d));
f = cc.moveTo(.5, cc.v2(p.x, 0));
t.runAction(f);
return [ 4, wUtils.syncDelayed(.5, this) ];

case 6:
y.sent();
if (!cc.isValid(this.node, !0)) return [ 2 ];
o.forEach(function(s, a) {
var n = cc.delayTime(.5 * a), r = cc.callFunc(function() {
var n = cc.v2(wUtils.random(0, 1334), wUtils.random(0, 750));
s.position = wUtils.world_local_POS(u, n);
var r = t.position.sub(s.position), l = r.mag() - wUtils.random(50, 120), c = (r = r.normalize()).x * l, h = r.y * l, d = cc.v2(s.x + c, s.y + h), p = cc.moveTo(.5, d), f = cc.callFunc(function() {
if (a == o.length - 1) {
g.showGold({
n: t,
gold: e
}, i);
g.showEffect_3(e, i);
t.destroy();
o.forEach(function(t) {
t.destroy();
});
}
}), y = cc.sequence(p, f);
s.runAction(y);
wAudioMgr.playSound("sound/fish-shandian", wGameData.getGameName());
var v = g.line[2].getNode;
v.parent = u;
v.width = wUtils.VectorLen(t.position, s.position);
v.active = !0;
v.setPosition(t.position);
v.angle = 90 - wUtils.GetAngleByVector(t.position, s.position);
cc.tween(v).to(.4, {
width: 0
}).call(function() {
g.line[2].put(v);
}).start();
}), l = cc.sequence(n, r);
s.parent = u;
s.y = 1800;
s.runAction(l);
});
return [ 2 ];
}
});
});
};
e.prototype.showBomb = function(t, e) {
var i = wUtils.local_world__POS(t.n);
i = wUtils.world_local_POS(this.node, i);
var o = this.node.getChildByName("bomb").getChildByName("" + e);
o.setPosition(i);
o.active = !0;
for (var s = function(t) {
var i = o.children[t];
a.scheduleOnce(function() {
i.active = !0;
i.getComponent(sp.Skeleton).setAnimation(1, 601 == e ? "move" : "Animation1", !1);
}, 2 * t);
}, a = this, n = 0; n < o.childrenCount; n++) s(n);
this.scheduleOnce(function() {
o.active = !1;
}, 5);
};
e.prototype.showFullBomb = function() {
wAudioMgr.playSound("sound/fish-fire", wGameData.getGameName());
var t = this.node.getChildByName("fullBomb");
t.active = !0;
t.children[0].getComponent(sp.Skeleton).setAnimation(1, "Animation1", !1);
for (var e = 0, i = t.children; e < i.length; e++) {
var o = i[e];
"content" == o.name && o.getComponent(cc.Animation).play();
}
this.scheduleOnce(function() {
t.active = !1;
}, 3);
};
e.prototype.showDing = function() {};
e.prototype.fishDing = function() {};
e.prototype.creatorWang = function(t, e) {
var i = this, o = this.node.getChildByName("UI_parent");
e = wUtils.world_local_POS(o, e);
var s = this.wangPool.getNode;
s.setPosition(e);
o.addChild(s, -1 * t);
s.active = !0;
var a = s.getComponent(cc.Animation);
a.off("stop");
a.on("stop", function() {
i.wangPool.put(s);
});
a.play();
};
__decorate([ r([ cc.Node ]) ], e.prototype, "player", void 0);
__decorate([ r(cc.SpriteAtlas) ], e.prototype, "lockImg", void 0);
__decorate([ r(cc.Node) ], e.prototype, "lock", void 0);
__decorate([ r(cc.Node) ], e.prototype, "paotai", void 0);
__decorate([ r(cc.Node) ], e.prototype, "info", void 0);
__decorate([ r(cc.Node) ], e.prototype, "mul", void 0);
__decorate([ r(cc.Node) ], e.prototype, "waitTips", void 0);
__decorate([ r([ cc.SpriteFrame ]) ], e.prototype, "bgImg", void 0);
__decorate([ r(cc.Node) ], e.prototype, "switchFish", void 0);
return __decorate([ n ], e);
}(cc.Component);
i.default = l;
cc._RF.pop();
}, {
DNTGModel: "DNTGModel",
NodePool: void 0
} ]
}, {}, [ "DNTGBullet", "DNTGControlle", "DNTGFish", "DNTGLoad", "DNTGModel", "DNTGRoom", "DNTGView" ]);