window.__require = function t(e, i, o) {
function s(a, l) {
if (!i[a]) {
if (!e[a]) {
var r = a.split("/");
r = r[r.length - 1];
if (!e[r]) {
var h = "function" == typeof __require && __require;
if (!l && h) return h(r, !0);
if (n) return n(r, !0);
throw new Error("Cannot find module '" + a + "'");
}
a = r;
}
var c = i[a] = {
exports: {}
};
e[a][0].call(c.exports, function(t) {
return s(e[a][1][t] || t);
}, c, c.exports, t, e, i, o);
}
return i[a].exports;
}
for (var n = "function" == typeof __require && __require, a = 0; a < o.length; a++) s(o[a]);
return s;
}({
JCBYBullet: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "f7158/hC7tNn69xtkF6RcXf", "JCBYBullet");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = t("JCBYModel"), s = cc._decorator, n = s.ccclass;
s.property;
var a = function(t) {
__extends(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onLoad = function() {
this.p_width = cc.winSize.width;
this.p_height = cc.winSize.height;
};
e.prototype.init = function(t, e, i) {
var s = this, n = 0;
t.gear > 7 ? n = 2 : t.gear > 4 && (n = 1);
wRes.loadRes(o.JCBYConfig.bulletUrl[n], cc.SpriteFrame, function(t, e) {
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
var e = this.dir.x * o.JCBYConfig.bulletSpeed * t, i = this.dir.y * o.JCBYConfig.bulletSpeed * t, s = this.p_width / 2, n = this.p_height / 2;
if (e + this.node.x > s || e + this.node.x < -s) {
this.dir.x *= -1;
this.lockFishNode = null;
}
if (i + this.node.y > n || i + this.node.y < -n) {
this.dir.y *= -1;
this.lockFishNode = null;
}
e = this.dir.x * o.JCBYConfig.bulletSpeed * t + this.node.x;
i = this.dir.y * o.JCBYConfig.bulletSpeed * t + this.node.y;
var a = -wUtils.GetAngleByVector(this.node.getPosition(), cc.v2(e, i));
this.node.setPosition(cc.v2(e, i));
this.node.angle = a;
};
return __decorate([ n ], e);
}(cc.Component);
i.default = a;
cc._RF.pop();
}, {
JCBYModel: "JCBYModel"
} ],
JCBYControlle: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "ee3bdKwLaVNTb6kLZrgMWF1", "JCBYControlle");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = t("JCBYBullet"), s = t("JCBYFish"), n = t("JCBYModel"), a = t("JCBYView"), l = t("NodePool"), r = t("quadtree"), h = t("Config"), c = cc._decorator, d = c.ccclass, u = c.property, p = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.JCBYView = null;
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
this.JCBYModel.playerData = {};
this.JCBYModel.fishList = {};
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
1 == e.status ? t.JCBYModel.get_uid_data(e.data.uid).battery = e.data.battery : wLog.e("更换炮台失败");
}, this);
wNetWork.send("Msg_Hall_FinishLoad", {
rid: wGameData.roomID
});
wGEvent.on("Msg_" + this.vg_game + "_PlayerAgent", function(e) {
1 == e.status ? t.Msg_JCBY_PlayerAgent(e.data) : wLog.e("更换炮台失败");
}, this);
};
e.prototype.initProxy = function() {
var t = this;
n.JCBYConfig.launchTimeIDX = 0;
this.JCBYModel.onEvevt("lock", function(e) {
e || (t.JCBYModel.getMyData().lockFish = null);
});
for (var e = function(e) {
var o = n.JCBYCreatorPlayerProxy();
o.onEvevt("gear", function(e) {
t.JCBYView.setBattery(o.l_seat, e);
t.JCBYView.setScore(o.l_seat, e * t.JCBYModel.di_score);
});
o.onEvevt("angle", function(e) {
t.JCBYView.setBatteryAngle(o.l_seat, e);
});
o.onEvevt("gold", function(e) {
t.JCBYView.setGold(o.l_seat, e);
});
o.onEvevt("name", function(e) {
t.JCBYView.setName(o.l_seat, e);
});
o.onEvevt("lockFish", function(e) {
o.l_seat == t.JCBYModel.l_seat ? wNetWork.send("Msg_" + t.vg_game + "_Locking", {
fish: null == e ? void 0 : e.id
}) : t.JCBYModel.robotList.includes(o.uid) && wNetWork.send("Msg_" + t.vg_game + "_Locking", {
fish: null == e ? void 0 : e.id,
uid: o.uid
});
t.JCBYView.setLockType(o.l_seat, e);
});
i.JCBYModel.playerData[e] = o;
i.JCBYView.add_delete_player(e, {});
}, i = this, o = 0; o < 4; o++) e(o);
};
e.prototype.initScene = function() {
var t = this;
this.huaJson = this.huaJson.json;
this.pathJson = this.pathJson.json;
this.vg_game = wGameData.getGameName();
this.JCBYModel = n.JCBYCreatorProxy();
this.JCBYView.init(this.JCBYModel);
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
this.bulletPool = new l.default(i, 30);
this.bulletPool.put(i);
for (var a = 0; a < this.fish.length; a++) {
var r = this.fish[a], h = new l.default(r, a < 17 ? 40 : 3);
this.fishPool.push(h);
}
};
e.prototype.initNodeDir = function() {
if (1 == (this.JCBYModel.s_seat > 1 ? 0 : 1)) {
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
this.myTree = new r(o);
};
e.prototype.Msg_JCBY_PlayerAgent = function(t) {
for (var e in t) if (e == wGameData.getKey("uid")) {
this.JCBYModel.robotList = t[e];
this.JCBYModel.robotList.push(wGameData.getKey("uid"));
}
};
e.prototype.Msg_Game_ActChange = function(t) {
var e = t.seat, i = t.level, o = this.JCBYModel.get_s_seat_data(e);
o.gear = i;
this.JCBYView.setBatteryLZ(o.l_seat);
wAudioMgr.playSound("sound/ChangeType", wGameData.getGameName());
};
e.prototype.Msg_Game_PlayerAct = function(t) {
if (!this.JCBYModel.get_uid_data(t.player.uid)) {
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
t.l_seat = this.JCBYModel.s_seat > 1 ? [ 3, 2, 1, 0 ][t.seat] : t.seat;
var e = this.JCBYModel.playerData[t.l_seat];
e.l_seat = t.l_seat;
e.s_seat = t.seat;
e.uid = t.uid;
e.gold = t.gold;
e.gear = t.level;
e.name = t.nickname;
e.angle = 0;
e.battery = t.battery;
this.JCBYView.add_delete_player(t.l_seat, e);
t.uid != wGameData.getKey("uid") && (e.lockFish = null);
};
e.prototype.Msg_Game_Out = function(t) {
var e = t.seat, i = this.JCBYModel.get_s_seat_data(e);
i.uid == wGameData.getKey("uid") && wViewMgr.quitGame(t.gold);
i.uid = "";
this.JCBYView.add_delete_player(i.l_seat, i);
var o = this.JCBYModel.robotList.indexOf(i.uid);
-1 != o && this.JCBYModel.robotList.splice(o, 1);
};
e.prototype.Msg_Game_Locking = function(t) {
if (!this.JCBYModel.robotList.includes(t.uid)) {
var e = this.JCBYModel.get_uid_data(t.uid);
e && (e.lockFish = this.JCBYModel.fishList[t.fish]);
}
};
e.prototype.Msg_Game_RoomInfo = function(t) {
var e = this;
cc.game.on(cc.game.EVENT_SHOW, function() {
wNetWork.send("Msg_" + e.vg_game + "_Out", []);
}, this);
this.JCBYView.exitTips();
var i = t.players, o = i[wGameData.getKey("uid")];
this.JCBYModel.l_seat = o.seat > 1 ? [ 3, 2, 1, 0 ][o.seat] : o.seat;
this.JCBYModel.s_seat = o.seat;
this.JCBYModel.di_score = t.setting.doublescore;
for (var s in i) {
var n = i[s];
n.uid = Number(s);
this.addPlayerData(n);
}
this.JCBYView.showTips(this.JCBYModel.l_seat);
this.initNodeDir();
t.fishtideid ? this.createFishTide(t.fishtideid, t.fishlist, t.time_ms - t.lasttidetime) : this.createFish(t.fishlist, t.time_ms);
t.stoptime && this.initDingFish(t.fishlist, t.time_ms, t.stoptime);
for (var a in this.JCBYModel.playerData) {
var l = this.JCBYModel.playerData[a];
if (l.uid) {
var r = i[l.uid].locking;
r && this.JCBYModel.fishList[r] && (l.lockFish = this.JCBYModel.fishList[r]);
}
}
};
e.prototype.Msg_Game_CreateFish = function(t) {
this.createFish(t.finsh);
};
e.prototype.Msg_Game_GetFish = function(t) {
var e = this, i = this.JCBYModel.get_s_seat_data(t.seat);
i.gold = t.gold;
var o = [], s = 0, a = this.JCBYModel.fishList[t.shootid], l = null == a ? void 0 : a.type;
for (var r in t.fish) {
var h = this.JCBYModel.fishList[r];
s += t.fish[r];
if (h) {
h.gold = t.fish[r];
o.push(h);
} else wLog.w("该鱼失效了:", r, h);
}
"number" != typeof s && wLog.e(t);
var c = s / this.JCBYModel.di_score / i.gear, d = t.seat == this.JCBYModel.s_seat;
if (l) {
if (603 == l) {
this.scheduleOnce(function() {
e.fishSleep(!1);
}, n.JCBYConfig.stopMoveTime);
this.fishSleep(!0);
} else if (l > 90 && l < 700) {
this.JCBYView.showEffect_3(s, t.seat);
for (var u = null, p = [], g = [], f = 0, y = o; f < y.length; f++) if ((v = y[f]).type == l) {
u = wUtils.local_world__POS(v.n);
g = [ {
type: v.type,
gold: s,
pos: u
} ];
} else p.push(wUtils.local_world__POS(v.n));
this.showGold(g, t.seat);
this.JCBYView.lightningLine(u, p);
} else if (l < 90 || l > 700) {
var v = o[0];
this.JCBYView.showGold(v, t.seat);
this.JCBYView.showEffect_3(v.gold, t.seat);
}
d && this.playSound(l);
}
c >= 100 && this.JCBYView.showEffect_1(s, t.seat, l);
c >= 140 && d && wUIHelp.shake(this.node);
for (var _ = 0, C = o; _ < C.length; _++) {
(v = C[_]).JCBYFish.fishDie(l);
this.deleteFishData(v.id);
}
};
e.prototype.playSound = function(t) {
t > 100 && (t = 100 * Math.floor(t / 100));
var e;
switch (t) {
case 17:
case 16:
break;

default:
e = "sound/fisha" + t;
}
e && wAudioMgr.playSound(e, wGameData.getGameName());
};
e.prototype.initDingFish = function(t, e, i) {
var o = this, s = n.JCBYConfig.stopMoveTime - (e - i) / 1e3;
if (!(s <= .2)) {
this.fishSleep(!0);
this.scheduleOnce(function() {
o.fishSleep(!1);
}, s);
}
};
e.prototype.createFish = function(t, e) {
void 0 === e && (e = null);
for (var i in t) {
var o = t[i];
if (1e3 == o.wayid) {
for (var s = this.huaJson[o.circlepoint[0] + "," + o.circlepoint[1]], n = Object.keys(o.fishes), a = Object.values(o.fishes), l = [], r = 0; r < n.length; r++) if (s[r]) {
var h = n[r], c = {
id: h,
path: s[r],
endtime: o.endtime ? o.endtime[h] : null
};
if (1 == a[r]) l.push(c); else if (2 == a[r]) {
c.yuwang = !0;
l.push(c);
}
}
this.createFishNode(l, o, e);
} else {
e || 16 != o.type && 17 != o.type || this.JCBYView.boosTips(16 == o.type ? 1 : 2);
Object.keys(o.fishes).length > 0 && wLog.w("-------------不要这个");
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
var e = this, i = this.JCBYModel.fishPath[t];
if (!i) {
i = this.pathJson[t - 1];
cc.winSize.width;
i.forEach(function(t, o) {
var s = e.AdaptationPos(t);
i[o][0] = s[0];
i[o][1] = s[1];
});
this.JCBYModel.fishPath[t] = i;
}
return i;
};
e.prototype.createFishNode = function(t, e, i) {
var o = this;
void 0 === i && (i = null);
for (var a = this.node.getChildByName("fish"), l = 0; l < 2; l++) {
var r = t.shift();
if (!r) break;
var h = {};
Object.assign(h, e);
h.pathID = e.pathID || 0;
h.path = r.path;
h.id = Number(r.id);
1e3 == e.wayid && (h.pathID = .01);
if (i) {
var c = i - (r.endtime - h.path.length / e.speed * 1e3) - (1e3 != e.wayid ? 600 : 0);
c < 0 && (c = 0);
h.pathID = c / 1e3 * e.speed;
}
if (h.pathID && h.pathID >= h.path.length - 1) {
wLog.w("鱼已经在离场阶段不做创建:", h.id);
return;
}
var d = e.type > 100 ? 100 * Math.floor(e.type / 100) : e.type;
600 == d && (d = e.type);
var u = this.fishPool[n.JCBYConfig.fishConfig[d][0]].getNode, p = u.getComponent(s.default);
p && u.removeComponent(s.default);
p = u.addComponent(s.default);
u.parent = a;
p.init(h, function(t) {
o.deleteFishData(t);
}, this.recoveryFish.bind(this));
if (this.JCBYModel.fishList[h.id]) {
this.recoveryFish(this.JCBYModel.fishList[h.id].n);
this.deleteFishData(h.id);
wLog.w("有重复ID生成：", h.id);
}
this.JCBYModel.fishList[h.id] = {
n: u,
JCBYFish: p,
id: h.id,
type: e.type
};
r.yuwang && wUIHelp.setNodeColor(u, cc.color(255, 0, 0));
}
t.length > 0 && this.createFishNode(t, e, i);
};
e.prototype.recoveryFish = function(t) {
this.fishPool[n.JCBYConfig.fishConfig[t.name][0]].put(t);
};
e.prototype.getLockFish = function() {
var t = [], e = cc.rect(-500, -375, 1e3, 750);
for (var i in this.JCBYModel.fishList) if (Object.prototype.hasOwnProperty.call(this.JCBYModel.fishList, i)) {
var o = this.JCBYModel.fishList[i].n;
if (cc.isValid(o, !0)) {
var s = wUtils.local_world__POS(o);
this.getPointInPolygon(s, e) && t.push(this.JCBYModel.fishList[i]);
}
}
var n = t.filter(function(t) {
if (t.JCBYFish && !t.JCBYFish.kill && !t.JCBYFish.isEnd) return !0;
});
n.sort(function() {
return Math.random() > .5 ? 1 : -1;
});
n.sort(function() {
return Math.random() > .5 ? 1 : -1;
});
return n[0];
};
e.prototype.getPointInPolygon = function(t, e) {
!e && (e = this.node.getBoundingBox());
return e.contains(wUtils.world_local_POS(this.node.parent, t));
};
e.prototype.fishSleep = function(t) {
var e = this.JCBYModel.fishList;
for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (e[i].JCBYFish.ding = t);
this.JCBYView.showDing(t);
};
e.prototype.deleteFishData = function(t) {
this.JCBYModel.fishList[t] = null;
delete this.JCBYModel.fishList[t];
for (var e in this.JCBYModel.playerData) {
var i = this.JCBYModel.playerData[e];
if (i.uid) {
var o = i.lockFish;
o && !this.JCBYModel.fishList[o.id] && (i.uid == wGameData.getKey("uid") ? this.JCBYModel.lock && (i.lockFish = null) : i.lockFish = null);
}
}
};
e.prototype.showGold = function(t, e) {
if (cc.isValid(this, !0)) {
for (var i = 0; i < 4; i++) {
var o = t.shift();
if (!o) break;
this.JCBYView.showGold(o, e);
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
if (o % 2 == 0) for (var n = -90; n < 90; n++) {
var a = 2 * Math.PI / 360 * n, l = s[0] + Math.sin(a) * e, r = s[1] + Math.cos(a) * e;
i.push(this.AdaptationPos([ l, r ]));
} else for (var h = -90; h > -270; h--) {
a = 2 * Math.PI / 360 * h;
l = s[0] + Math.sin(a) * e;
r = s[1] + Math.cos(a) * e;
i.push(this.AdaptationPos([ l, r ]));
}
}
return i;
};
e.prototype.fishTide_4 = function(t, e) {
var i = this, o = function(o, s, n, a, l) {
var r = [ , [] ];
r[0] = i.getYuanPath(o, s);
for (var h = 0, c = r[0]; h < c.length; h++) {
var d = c[h];
r[1].push([ d[0], 750 - d[1] ]);
}
for (var u = 0; u < 2; u++) for (var p = function(o) {
var s = t.shift();
if (!s.status) return "continue";
var h = o * l, c = .01;
if (e) {
var d = e / 1e3, p = d - h;
(h -= d) < 0 && (h = 0);
p > 0 && (c = p * a);
}
var g = r[u];
i.scheduleOnce(function() {
var t = {
type: n,
id: s.id,
speed: a,
path: g,
pathID: c
};
i.createFishNode([ t ], t);
}, h);
}, g = 0; g < 30; g++) p(g);
};
o([ [ 100, 375 ], [ 300, 375 ], [ 500, 375 ], [ 700, 375 ], [ 900, 375 ], [ 1100, 375 ], [ 1300, 375 ] ], 100, 7, 60, .5);
o([ [ 200, 375 ], [ 600, 375 ], [ 1e3, 375 ], [ 1400, 375 ] ], 200, 9, 30, .7);
};
e.prototype.fishTide_1_2_3_4_5 = function(t, e, i) {
void 0 === e && (e = null);
void 0 === i && (i = 0);
return __awaiter(this, void 0, void 0, function() {
var o, s, n, a, l, r, h, c, d, u, p, g, f, y, v, _, C = this;
return __generator(this, function(m) {
switch (m.label) {
case 0:
return (o = this.JCBYModel.tideScene[t]) ? [ 3, 2 ] : [ 4, new Promise(function(e) {
wRes.loadRes("Game/BUYU/fishTide_" + t, function(t, i) {
e(i.json);
});
}) ];

case 1:
o = m.sent();
if (!cc.isValid(this)) return [ 2 ];
o.sort(function(t, e) {
return t[0] - e[0];
});
this.JCBYModel.tideScene[t] = o;
m.label = 2;

case 2:
s = [];
if (4 == t) {
for (r = 51; r < 171; r++) s.push({
id: r
});
for (r = 1; r < 51; r++) s.push({
id: r
});
for (r = 171; r < 175; r++) s.push({
id: r
});
} else for (r = 1; r <= o.length; r++) s.push({
id: r
});
s.forEach(function(t, i) {
s[i].status = !e || !!e[t.id];
});
4 == t && this.fishTide_4(s, i);
n = i / 1e3 * 60;
a = cc.winSize.width / 1334;
l = [];
for (r = 0; r < o.length; r++) if ((h = s.shift()).status) {
c = o[r];
d = c[0];
u = this.AdaptationPos(c[1]);
p = cc.v2.apply(cc, c[2]);
g = c[3] / 2 || 1.5;
g *= a;
if (i) {
f = n * p.x * g;
y = n * p.y * g;
u[0] += f;
u[1] += y;
}
v = {
type: d,
id: h.id,
speed: g,
pos: u,
dir: p,
couples: [ d % 100 ],
moveType: 1
};
l.push(v);
}
(_ = function() {
if (cc.isValid(C, !0)) {
for (var t = 0; t < 10; t++) {
var e = l.shift();
if (!e) return;
C.createFishNode([ e ], e);
}
l.length > 0 && setTimeout(_.bind(C), 10);
}
})();
return [ 2 ];
}
});
});
};
e.prototype.Msg_Game_FishTide = function(t) {
var e = this;
for (var i in this.JCBYModel.fishList) {
var o = this.JCBYModel.fishList[i];
o.JCBYFish.isEnd = !0;
o.JCBYFish.dir.x *= 4;
o.JCBYFish.dir.y *= 4;
}
this.JCBYModel.tide = !0;
this.JCBYModel.isOnClick && wUIManager.showTips("场景切换中,不能发射子弹!", wUIManager.TIPS_OK);
this.JCBYView.showYCTips();
this.scheduleOnce(function() {
for (var t in e.JCBYModel.fishList) {
var i = e.JCBYModel.fishList[t];
e.recoveryFish(i.n);
}
e.JCBYModel.fishList = {};
e.JCBYView.switchBG();
var o = e.JCBYModel.playerData;
for (var t in o) if (Object.prototype.hasOwnProperty.call(o, t)) {
var s = o[t];
s && s.uid && (s.lockFish = 0);
}
}, 2);
this.scheduleOnce(function() {
e.fishTide_1_2_3_4_5(t.tide).catch(function(t) {
wLog.e(t);
});
e.JCBYModel.tide = !1;
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
if (t.seat != this.JCBYModel.getMyData().s_seat) {
var i = this.JCBYModel.get_s_seat_data(t.seat);
if (Object.prototype.hasOwnProperty.call(t, "x")) {
i.angle = t.angle;
i.dir = cc.v2(t.dir_x * this.node.getChildByName("bullet").scaleX, t.dir_y * this.node.getChildByName("bullet").scaleY);
} else {
var o = this.JCBYModel.fishList[t.lockID];
if (o && this.getPointInPolygon(wUtils.local_world__POS(o.n))) {
var s = wUtils.local_world__POS(o.n), n = this.JCBYModel.getAngle(this.JCBYView.getBatteryPos(i.l_seat), s);
n.angle *= this.node.getChildByName("bullet").scaleY;
i.angle = n.angle;
i.dir = n.dir;
} else {
t.lockID = null;
wLog.w("锁定的鱼不在了", t.lockID);
}
}
this.scheduleOnce(function() {
i.gold -= e.JCBYModel.di_score * t.level;
i.bulletStartPos = wUtils.world_local_POS(e.node.getChildByName("bullet"), e.JCBYView.getGunPos(i.l_seat));
e.creatorBullet(i, t.lockID);
});
} else this.JCBYModel.bulletid.push(t.bulletid);
};
e.prototype.creatorBullet = function(t, e) {
var i = this;
if (t.uid == wGameData.getKey("uid")) {
if (t.bulletList.reduce(function(t, e) {
return t + (e ? 1 : 0);
}, 0) >= n.JCBYConfig.maxBullet) {
if (this.JCBYModel.bulletTips_s) {
this.JCBYModel.bulletTips_s = !1;
wUIManager.showTips("您发射的子弹够多了,歇歇吧!", wUIManager.TIPS_OK);
this.scheduleOnce(function() {
i.JCBYModel.bulletTips_s = !0;
}, this.JCBYModel.bulletTips_t);
}
return !1;
}
var s = this.JCBYModel.di_score * t.gear;
if (s > this.JCBYModel.getMyData().gold) {
wUIManager.showTips("金币不足,请先充值!");
this.JCBYModel.isOnClick = !1;
this.JCBYModel.auto = !1;
return !1;
}
e = (e = this.JCBYModel.getMyData().lockFish) ? e.id : 0;
var a = t.bulletStartPos;
wNetWork.send("Msg_" + this.vg_game + "_ActShoot", {
level: t.gear,
x: Number(a.x.toFixed(2)),
y: Number(a.y.toFixed(2)),
angle: t.angle,
dir_x: t.dir.x * this.node.getChildByName("bullet").scaleX,
dir_y: t.dir.y * this.node.getChildByName("bullet").scaleY,
lockID: e
});
t.gold -= s;
}
this.JCBYView.setBatteryStatus(t.l_seat, 1);
var l = this.bulletPool.getNode;
l.parent = this.node.getChildByName("bullet");
var r = l.getComponent(o.default), h = this.JCBYModel.fishList[e];
r.init(t, e, h);
t.bulletList.push(r);
return l;
};
e.prototype.onCollisionEnter = function(t, e) {
if (t && e.node.parent) {
var i = e, o = t.n, s = o.DATA;
if (!i.lockFishNode || !i.lockfishID || i.lockfishID == s.id) {
var n = e.node.DATA;
this.JCBYView.creatorWang(n.gear, wUtils.local_world__POS(e.node));
this.setFishColor(o);
var a = Number(o.DATA.id);
if (n.uid == wGameData.getKey("uid") && this.JCBYModel.fishList[a]) {
var l = this.JCBYModel.bulletid.shift();
if (l) {
var r = {
bulletid: l,
fish: a
};
wNetWork.send("Msg_" + this.vg_game + "_GetFish", r);
} else wLog.w("没有子弹ID了");
}
for (var h = 0; h < n.bulletList.length; h++) if (n.bulletList[h].node == e.node) {
n.bulletList.splice(h, 1);
this.bulletPool.put(e.node);
break;
}
}
}
};
e.prototype.setFishColor = function(t) {
for (var e = 0, i = t.children; e < i.length; e++) {
var o = i[e];
(o.getComponent(cc.Sprite) || o.getComponent(sp.Skeleton)) && o.runAction(this.creatorAni());
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
this.JCBYModel.getMyData().lockFish = this.getLockFish();
break;

case "setbattery":
var s = this.JCBYModel.getMyData();
wViewMgr.openPage({
path: h.Config.ViewConfig.ChangeGuns,
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
this.JCBYModel.auto = !this.JCBYModel.auto;
break;

case "lock":
this.JCBYModel.lock = !this.JCBYModel.lock;
break;

case "exit":
wUIManager.showGameOutTips({
okCB: function() {
if (cc.isValid(o)) {
o.JCBYModel.isOnClick = !1;
o.JCBYModel.auto = !1;
wNetWork.send("Msg_" + o.vg_game + "_Out", [], !0);
}
}
});
wAudioMgr.playCloseSound();
return;

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
(i = this.JCBYModel.getMyData().gear - 1) < 1 && (i = 10);
wNetWork.send("Msg_" + this.vg_game + "_ActChange", {
level: i
});
break;

case "add":
(i = this.JCBYModel.getMyData().gear + 1) > 10 && (i = 1);
wNetWork.send("Msg_" + this.vg_game + "_ActChange", {
level: i
});
break;

case "jiasu":
n.JCBYConfig.launchTimeIDX++;
n.JCBYConfig.launchTimeIDX > 2 && (n.JCBYConfig.launchTimeIDX = 0);
this.JCBYView.setSpeedPaoBtn(n.JCBYConfig.launchTimeIDX);
}
wAudioMgr.playBtnSound();
};
e.prototype.onEvent = function(t, e) {
if ("start" == t) {
this.JCBYView.showBattery(!1);
this.JCBYModel.isOnClick = !0;
var i = e.getLocation();
if (this.JCBYModel.lock && this.JCBYModel.getMyData().lockFish) {
var o = [];
for (var s in this.JCBYModel.fishList) if (Object.prototype.hasOwnProperty.call(this.JCBYModel.fishList, s)) {
var n = this.JCBYModel.fishList[s].JCBYFish;
if (cc.isValid(n, !0)) {
var a = n.getRect();
a && a.contains(i) && o.push(this.JCBYModel.fishList[s]);
}
}
o.sort(function(t, e) {
return e.zIndex - t.zIndex;
});
o[0] && (this.JCBYModel.getMyData().lockFish = o[0]);
} else {
var l = this.JCBYModel.getAngle(this.JCBYView.getBatteryPos(this.JCBYModel.l_seat), i);
this.JCBYModel.getMyData().angle = l.angle;
this.JCBYModel.getMyData().dir = l.dir;
}
} else if ("move" == t) {
if (!this.JCBYModel.lock || !this.JCBYModel.getMyData().lockFish) {
l = this.JCBYModel.getAngle(this.JCBYView.getBatteryPos(this.JCBYModel.l_seat), e.getLocation());
this.JCBYModel.getMyData().angle = l.angle;
this.JCBYModel.getMyData().dir = l.dir;
}
} else this.JCBYModel.isOnClick = !1;
};
e.prototype.launchBullet = function() {
var t = this;
if ((this.JCBYModel.isOnClick || this.JCBYModel.auto) && !this.JCBYModel.tide && this.JCBYModel.isLaunch) {
this.JCBYView.exitTips();
this.JCBYModel.isLaunch = !1;
this.scheduleOnce(function() {
t.JCBYModel.isLaunch = !0;
}, n.JCBYConfig.launchTime[n.JCBYConfig.launchTimeIDX]);
var e = this.JCBYModel.getMyData();
e.bulletStartPos = wUtils.world_local_POS(this.node.getChildByName("bullet"), this.JCBYView.getGunPos(this.JCBYModel.l_seat));
this.creatorBullet(e) && wAudioMgr.playSound("sound/GunFire0", "JCBY");
}
};
e.prototype.lockFish = function() {
for (var t = this.JCBYModel.robotList, e = 0; e < t.length; e++) {
var i = t[e], o = this.JCBYModel.get_uid_data(i);
if ((i != wGameData.getKey("uid") || this.JCBYModel.lock) && o) {
var s = o.lockFish;
if (s) {
if (!cc.isValid(s.n, !0) || !this.getPointInPolygon(wUtils.local_world__POS(s.n))) {
n = this.getLockFish();
o.lockFish = n || null;
}
} else {
var n = this.getLockFish();
n && (o.lockFish = n);
}
}
}
var a = this.JCBYModel.playerData;
for (var l in a) {
var r = a[l];
if (r.uid && r.lockFish) if (cc.isValid(r.lockFish.n, !0)) {
var h = wUtils.local_world__POS(r.lockFish.n);
if (r.uid == wGameData.getKey("uid") || this.getPointInPolygon(h)) {
var c = this.JCBYModel.getAngle(this.JCBYView.getBatteryPos(r.l_seat), h);
r.l_seat > 1 && (c.angle += 180);
r.angle = c.angle;
r.dir = c.dir;
this.JCBYView.setLockLine(r.l_seat, h);
} else r.lockFish = null;
} else wLog.w("鱼消失了不用锁定");
}
};
e.prototype.fishMove = function(t) {
for (var e in this.JCBYModel.fishList) this.JCBYModel.fishList[e].JCBYFish.pathMove(t);
};
e.prototype.bulletMove = function(t) {
for (var e in this.JCBYModel.playerData) {
var i = this.JCBYModel.playerData[e];
if (i.bulletList.length) for (var o = 0, s = i.bulletList; o < s.length; o++) {
var n = s[o];
if (n.lockfishID) {
var a = this.JCBYModel.fishList[n.lockfishID];
a && this.getPointInPolygon(wUtils.local_world__POS(a.n)) || (n.lockFishNode = null);
}
n.moveBullet(t);
}
}
};
e.prototype.quadtreeCollision = function() {
if (this.myTree) {
this.myTree.clear();
var t = this.JCBYModel.fishList;
for (var e in t) {
var i = t[e].JCBYFish;
if (i) {
var o = i.getRect();
o && this.myTree.insert(o);
}
}
for (var e in this.JCBYModel.playerData) {
var s = this.JCBYModel.playerData[e];
if (s.bulletList.length) for (var n = 0, a = s.bulletList; n < a.length; n++) for (var l = a[n], r = l.getRect(), h = 0, c = this.myTree.retrieve(r); h < c.length; h++) {
var d = c[h];
if (l.lockFishNode) {
if (d.id != l.lockfishID) continue;
d.x += d.width / 2 - 20;
d.y += d.height / 2 - 20;
d.width = 40;
d.height = 40;
}
d.intersects(r) && this.onCollisionEnter(this.JCBYModel.fishList[d.id], l);
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
__decorate([ u(a.default) ], e.prototype, "JCBYView", void 0);
__decorate([ u([ cc.Prefab ]) ], e.prototype, "fish", void 0);
__decorate([ u(cc.Asset) ], e.prototype, "huaJson", void 0);
__decorate([ u(cc.Asset) ], e.prototype, "pathJson", void 0);
return __decorate([ d ], e);
}(cc.Component);
i.default = p;
cc._RF.pop();
}, {
Config: void 0,
JCBYBullet: "JCBYBullet",
JCBYFish: "JCBYFish",
JCBYModel: "JCBYModel",
JCBYView: "JCBYView",
NodePool: void 0,
quadtree: void 0
} ],
JCBYFish: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "1b10fUZopZH1o96xt6wilEX", "JCBYFish");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = t("JCBYModel"), s = cc._decorator, n = s.ccclass;
s.property;
var a = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.isStart = !1;
e.cb = null;
e.o_x = -1;
e.o_y = -1;
return e;
}
e.prototype.onEnable = function() {
try {
if ("300" != this.node.name) {
var t = this.node.children[0].children[1];
wUIHelp.playSpine(t, "idle", null, !0);
}
} catch (t) {
wLog.e(this.type, this.node.name);
}
};
e.prototype.init = function(t, e, i) {
return __awaiter(this, void 0, void 0, function() {
var s, n, a, l, r, h, c, d, u, p, g, f, y, v = this;
return __generator(this, function(_) {
switch (_.label) {
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
this.node.zIndex = o.JCBYConfig.zindex[this.type] || this.type;
this.dir = t.dir || cc.v2(0, 0);
if (1 == this.moveType) {
this.node.setPosition(cc.v2.apply(cc, t.pos));
s = this.dir.x * this.speed;
n = this.dir.y * this.speed;
a = cc.v2(this.node.x + s, this.node.y + n);
l = this.node.getPosition();
c = -wUtils.GetAngleByVector(l, a);
(u = this.node.getChildByName("angle")) && (u.angle = c);
} else if (0 == this.pathID) this.startMove(); else {
r = this.initPos_Angle(Math.floor(this.pathID));
h = r.p1;
c = r.angle;
this.node.setPosition(h);
(u = this.node.getChildByName("angle")) && (u.angle = c);
}
switch (d = t.type > 100 ? 100 * Math.floor(t.type / 100) : t.type) {
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
f = _.sent();
if (!(y = cc.find("angle", f))) {
wLog.w("一鱼炸弹出现问题:", this.couples);
return [ 2 ];
}
y.parent = null;
this.node.getChildByName("angle").addChild(y, 1, "zhadan");
f.destroy();
return [ 3, 7 ];

case 3:
u = this.node.children[0];
(p = u.getChildByName("fishList")).destroyAllChildren();
g = u.getChildByName("pos");
5 != this.couples.length && wLog.e("五种鱼炸弹出现错误:", this.couples);
this.couples.sort(function(t, e) {
return t - e;
});
this.couples.forEach(function(t, e) {
return __awaiter(v, void 0, void 0, function() {
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
o.setPosition(g.children[e].getPosition());
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
f = _.sent();
(y = cc.find("angle", f)).parent = null;
this.node.getChildByName("angle").addChild(y, 1, "zhadan");
this.node.getChildByName("bg").scale = wUtils.random(7, 10) / 10;
f.destroy();
return [ 3, 7 ];

case 6:
if (400 == d && 2 != this.couples.length) {
wLog.e("二个鱼炸弹出现错误:", this.couples);
return [ 2 ];
}
if (500 == d && 3 != this.couples.length) {
wLog.e("三种鱼炸弹出现错误:", this.couples);
return [ 2 ];
}
this.node.getChildByName("angle").destroyAllChildren();
this.couples.forEach(function(t) {
return __awaiter(v, void 0, void 0, function() {
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
if (o.getComponent(cc.Sprite) || o.getComponent(sp.Skeleton)) {
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
var e = this.type > 100 ? 100 * Math.floor(this.type / 100) : this.type;
if (300 == e) this.poolPut(); else {
if (200 == e) for (var i = function(t) {
wUIHelp.playSpine(t.children[1], "end", function() {
t.destroy();
});
}, o = 0, s = this.node.children[0].getChildByName("fishList").children; o < s.length; o++) i(s[o]); else if (400 == e || 500 == e || 700 == e) for (var n = function(t) {
!t.children[1] || t.children[1].getComponent(sp.Skeleton);
wUIHelp.playSpine(t.children[1], "end", function() {
t.destroy();
});
}, a = 0, l = this.node.getChildByName("angle").children; a < l.length; a++) n(l[a]);
var r = this.node.children[0].children[1];
wUIHelp.playSpine(r, "end", function() {
return [ t.poolPut() ];
});
}
};
e.prototype.creatorNode = function(t) {
var e = this;
return new Promise(function(i, o) {
var s = "fishPrefab/" + t;
wRes.loadRes(s, function(s, n) {
if (cc.isValid(e)) if (s) {
wLog.e("鱼儿创建失败：", t);
o(!1);
} else if (cc.isValid(e.node, !0)) i(cc.instantiate(n)); else {
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
var t = this, e = this.node, i = this.initPos_Angle(0), o = i.p1, s = i.p2, n = i.angle, a = e.getChildByName("angle");
a && (a.angle = n);
var l = wUtils.Normalize(o, s), r = cc.v2(100 * l.x + o.x, 100 * l.y + o.y);
e.setPosition(r);
var h = cc.moveTo(.6, o).easing(cc.easeOut(1)), c = cc.callFunc(function() {
t.isStart = !1;
});
e.runAction(cc.sequence(h, c));
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
var n = this.dir.mag();
this.dir = this.dir.normalize();
for (var a = this.dir.x * n * e, l = this.dir.y * n * e, r = cc.v2(this.node.x + a, this.node.y + l), h = this.node.getPosition(), c = -wUtils.GetAngleByVector(h, r), d = 0, u = this.node.children; d < u.length; d++) {
var p = u[d], g = p;
"angle" == p.name && (g.angle = c);
}
this.node.x = this.o_x > -1 ? this.o_x : r.x;
this.node.y = this.o_y > -1 ? this.o_y : r.y;
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
var n = this.dir.mag();
this.dir = this.dir.normalize();
var a = +(this.dir.x * n * e).toFixed(2), l = +(this.dir.y * n * e).toFixed(2);
this.node.x += a;
this.node.y += l;
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
return __decorate([ n ], e);
}(cc.Component);
i.default = a;
cc._RF.pop();
}, {
JCBYModel: "JCBYModel"
} ],
JCBYLoad: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "f6c8eegrt5B459eWRIwJEVr", "JCBYLoad");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = t("Config"), s = cc._decorator, n = s.ccclass, a = s.property, l = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.prog = null;
e.prefabList = null;
return e;
}
e.prototype.onLoad = function() {
return __awaiter(this, void 0, void 0, function() {
var t, e;
return __generator(this, function(i) {
switch (i.label) {
case 0:
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
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
var e = cc.find("main/logo", this.node), i = cc.fadeOut(.2), o = cc.moveBy(.2, cc.v2(0, 150)), s = cc.spawn(i, o), n = cc.callFunc(function() {
t.node.destroy();
}), a = cc.sequence(s, n);
e.runAction(a);
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
var s = o.Config.GamePrefab[wGameData.gameID], n = [ s.prefabUrl, "prefab/Room" ];
wRes.loadRes(n, function(i, o) {
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
__decorate([ a(cc.Node) ], e.prototype, "prog", void 0);
return __decorate([ n ], e);
}(cc.Component);
i.default = l;
cc._RF.pop();
}, {
Config: void 0
} ],
JCBYModel: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "216211e6MlFqZasdB76bCNk", "JCBYModel");
Object.defineProperty(i, "__esModule", {
value: !0
});
i.JCBYCreatorProxy = i.JCBYModel = i.JCBYCreatorPlayerProxy = i.JCBYPlayer = i.JCBYConfig = void 0;
i.JCBYConfig = {
maxGear: 10,
bulletSpeed: 800,
maxBullet: 50,
launchTimeIDX: 0,
launchTime: [ .2, .15, .1 ],
stopMoveTime: 15,
shadow: !0,
bulletUrl: [ "res/bullet/dntgtest_Bullet_1_1", "res/bullet/dntgtest_Bullet_2_1", "res/bullet/dntgtest_Bullet_3_1" ],
wangUrl: [ "res/bullet/dntgtest_Net_1_1", "res/bullet/dntgtest_Net_2_1", "res/bullet/dntgtest_Net_3_1" ],
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
602: [ 33, 32 ],
603: [ 34, 32 ],
700: [ 35, 28 ]
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
i.JCBYPlayer = o;
i.JCBYCreatorPlayerProxy = function() {
var t = new o();
return new Proxy(t, {
get: function(t, e) {
return t[e];
},
set: function(t, e, o) {
switch (e) {
case "gear":
o > i.JCBYConfig.maxGear && (o = 1);
o < 1 && (o = i.JCBYConfig.maxGear);
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
i.JCBYModel = s;
i.JCBYCreatorProxy = function() {
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
JCBYRoom: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "8b886kWFL9JdazIDPs0JKov", "JCBYRoom");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = t("Config"), s = cc._decorator, n = s.ccclass, a = s.property, l = function(t) {
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
var n = o.children[s], a = cc.v2(n.x, n.y);
n.x += 150;
var l = cc.moveTo(.2, a).easing(cc.easeBackOut());
l.speed(.35);
n.runAction(l);
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
__decorate([ a(cc.Node) ], e.prototype, "content", void 0);
__decorate([ a(cc.Node) ], e.prototype, "top", void 0);
__decorate([ a(cc.Node) ], e.prototype, "bottom", void 0);
__decorate([ a(cc.Sprite) ], e.prototype, "head", void 0);
__decorate([ a(cc.Label) ], e.prototype, "nickname", void 0);
__decorate([ a(cc.Label) ], e.prototype, "gold", void 0);
__decorate([ a(cc.Label) ], e.prototype, "bankGold", void 0);
return __decorate([ n ], e);
}(cc.Component);
i.default = l;
cc._RF.pop();
}, {
Config: void 0
} ],
JCBYView: [ function(t, e, i) {
"use strict";
cc._RF.push(e, "efa3cJO+DBNyZ+R7C0xCWnK", "JCBYView");
Object.defineProperty(i, "__esModule", {
value: !0
});
var o = t("NodePool"), s = t("JCBYModel"), n = cc._decorator, a = n.ccclass, l = n.property, r = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.player = [];
e.lock = null;
e.bgImg = [];
e.bgIdx = 0;
e.switchFish = null;
e.JCBYModel = null;
e.goldShow = {};
e.num = {};
e.line = null;
e.guang = null;
e.PT = [];
return e;
}
e.prototype.onLoad = function() {
var t = this.node.getChildByName("copyItem");
this.goldShow[1] = this.creatorNodePool(t.getChildByName("goldAnim1"), 10);
this.goldShow[2] = this.creatorNodePool(t.getChildByName("goldAnim2"), 10);
this.num[1] = this.creatorNodePool(t.getChildByName("num1"), 2);
this.num[2] = this.creatorNodePool(t.getChildByName("num2"), 5);
this.goldShow3 = this.creatorNodePool(t.getChildByName("goldShow3"), 10);
this.line = this.creatorNodePool(t.getChildByName("line"), 5);
this.guang = this.creatorNodePool(t.getChildByName("guang"), 5);
this.wangPool = this.creatorNodePool(t.getChildByName("wang"), 10);
};
e.prototype.onDestroy = function() {
this.wangPool.clear();
this.goldShow[1].clear();
this.goldShow[2].clear();
this.num[1].clear();
this.num[2].clear();
this.goldShow3.clear();
this.line.clear();
this.guang.clear();
};
e.prototype.creatorNodePool = function(t, e) {
var i = new o.default(t, e);
i.put(t);
return i;
};
e.prototype.init = function(t) {
this.JCBYModel = t;
};
e.prototype.add_delete_player = function(t, e) {
if (e.uid) {
this.setBatteryStatus(t, 0);
this.setLockType(t, "");
if (e.uid == wGameData.getKey("uid")) {
this.player[t].getChildByName("btn").active = !0;
wLog.w("----------------在这里打开换炮按钮");
}
this.setPlayerNode(t, !0);
} else this.setPlayerNode(t, !1);
};
e.prototype.setPlayerNode = function(t, e) {
this.lock.getChildByName("" + t).active = !1;
this.player[t].active = e;
};
e.prototype.setName = function(t, e) {
this.player[t].getChildByName("name").getComponent(cc.Label).string = "" + e;
};
e.prototype.setGold = function(t, e) {
this.player[t].getChildByName("gold").getComponent(cc.Label).string = "" + e;
};
e.prototype.setScore = function(t, e) {
e >= 1e4 && (e = Math.floor(e / 1e4) + "万");
cc.find("fen/label", this.player[t]).getComponent(cc.Label).string = "" + e;
};
e.prototype.playWinSpine = function(t) {
var e = this.player[t].getChildByName("goldbg").getChildByName("sp");
e.active = !0;
wUIHelp.playSpine(e, "animation", function() {
e.active = !1;
});
};
e.prototype.setLockType = function(t, e) {
this.lock.getChildByName("" + t).active = Boolean(e);
if (t == this.JCBYModel.l_seat) {
this.switchFish.active = Boolean(e);
if (e && cc.isValid(e.n, !0)) {
var i = this.switchFish.getChildByName("fish"), o = cc.instantiate(e.n);
i.destroyAllChildren();
o.parent = i;
wUIHelp.setNodeColor(o, cc.color(255, 255, 255));
o.setPosition(0, 0);
var s = o.children[0];
s.angle = 0;
var n = s.children[0].getContentSize(), a = n.width > n.height ? n.width : n.height;
o.scale = a > 150 ? 150 / a : 1;
}
}
};
e.prototype.setLockLine = function(t, e) {
var i = this.lock.getChildByName("" + t);
i.getChildByName("end").setPosition(wUtils.world_local_POS(i, e));
var o = i.getChildByName("layout");
wUIHelp.hideSonNode(o);
var s = this.getGunPos(t), n = e.sub(s), a = wUtils.GetAngleByVector(s, e), l = n.mag();
n = n.normalize();
for (var r = Math.floor(l / 40), h = 1; h <= r; h++) {
var c = cc.v2(n.x * h * 40 + s.x, n.y * h * 40 + s.y), d = o.children[h - 1];
d || ((d = cc.instantiate(o.children[0])).parent = o);
d.angle = -a;
d.active = !0;
d.setPosition(wUtils.world_local_POS(o, c));
}
};
e.prototype.setBatteryAngle = function(t, e) {
cc.find("PT/paotai", this.player[t]).angle = e;
};
e.prototype.setBatteryLZ = function(t) {
var e = this.player[t].getChildByName("mul");
e.active = !0;
for (var i = 0; i < e.childrenCount; i++) {
var o = e.children[i];
i < 2 ? o.getComponent(cc.ParticleSystem).resetSystem() : wUIHelp.playSpine(o, "animation");
}
var s = cc.delayTime(.3), n = cc.callFunc(function() {
e.active = !1;
}), a = cc.sequence(s, n);
e.stopAllActions();
e.runAction(a);
};
e.prototype.setBattery = function(t, e) {
var i = this, o = cc.find("PT/paotai", this.player[t]), s = e < 7 ? 0 : 1;
if (!o.childrenCount || o.children[0].name != "paotai" + s) {
o.destroyAllChildren();
var n = cc.instantiate(this.PT[s]);
n.parent = o;
n.setPosition(0, 0);
e && this.scheduleOnce(function() {
i.setBatteryStatus(t, 1);
});
}
};
e.prototype.setBatteryStatus = function(t, e) {
e && cc.find("PT/paotai", this.player[t]).children[0].getComponent(cc.Animation).play();
};
e.prototype.getBatteryPos = function(t) {
var e = cc.find("PT/paotai", this.player[t]);
return wUtils.local_world__POS(e);
};
e.prototype.getGunPos = function(t) {
var e = cc.find("PT/paotai", this.player[t]);
e = e.children[0].getChildByName("b");
return wUtils.local_world__POS(e);
};
e.prototype.showTips = function(t) {
var e = this, i = this.node.getChildByName("tips").getChildByName("posTips");
this.scheduleOnce(function() {
i.active = !0;
var o = e.getBatteryPos(t);
o = wUtils.world_local_POS(e.node, o);
i.x = o.x;
}, .1);
this.scheduleOnce(function() {
var t = cc.fadeOut(.25), e = cc.callFunc(function() {
i.destroy();
}), o = cc.sequence(t, e);
i.runAction(o);
}, 3);
};
e.prototype.switchBG = function() {
var t = this.node.getChildByName("bg"), e = t.getChildByName("bg"), i = t.getChildByName("di");
i.getComponent(cc.Sprite).spriteFrame = e.getComponent(cc.Sprite).spriteFrame;
this.bgIdx++;
this.bgIdx > 3 && (this.bgIdx = 0);
var o = t.getChildByName("ani");
o.active = !0;
e.x = o.x;
e.getComponent(cc.Sprite).spriteFrame = this.bgImg[this.bgIdx];
cc.tween(o).to(2.5, {
x: -900
}).call(function() {
o.x = 900;
o.active = !1;
}).start();
cc.tween(e).to(2.5, {
x: i.x
}).call(function() {}).start();
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
}), s = cc.sequence(cc.repeat(cc.sequence(i, o), 9), cc.callFunc(function() {
wNetWork.send("Msg_" + wGameData.getGameName() + "_Out", [], !0);
}));
t.runAction(s);
}), o = cc.sequence(e, i);
this.node.runAction(o).setTag(100);
};
e.prototype.showBattery = function(t) {
this.node.getChildByName("tips").getChildByName("battery").active = t;
};
e.prototype.showGold = function(t, e) {
return __awaiter(this, void 0, void 0, function() {
var i, o, s, n, a, l, r, h, c, d, u, p, g, f, y, v, _, C, m, w, B, M, Y, J = this;
return __generator(this, function(b) {
switch (b.label) {
case 0:
(i = this.JCBYModel.get_s_seat_data(e)).uid == wGameData.getKey("uid") && wAudioMgr.playSound("sound/collect_coin", "JCBY");
e = i.l_seat;
o = i.gear * this.JCBYModel.di_score;
s = this.player[e];
n = t.pos || wUtils.local_world__POS(t.n);
n = wUtils.world_local_POS(this.node, n);
a = e == this.JCBYModel.l_seat ? 1 : 2;
l = this.node.getChildByName("UI_parent");
(r = this.num[a].getNode).getComponent(cc.Label).string = "" + t.gold;
l.addChild(r, 10);
r.setPosition(n.x, n.y - 40);
r.scale = 0;
r.opacity = 0;
h = cc.fadeIn(.15);
c = cc.scaleTo(.15, 1);
d = cc.moveBy(.15, cc.v2(0, 40));
u = cc.spawn(h, c, d);
p = cc.delayTime(.5);
g = cc.moveBy(.15, cc.v2(0, 20));
f = cc.fadeOut(.2);
y = cc.spawn(g, f);
v = cc.callFunc(function() {
J.num[a].put(r);
});
_ = cc.sequence(u, p, y, v);
r.runAction(_);
(C = Math.floor(t.gold / o / 2)) < 2 && (C = 2);
C > 15 && (C = 15);
m = [];
w = function() {
var t = B.goldShow[a].getNode;
l.addChild(t, 3);
m.push(t);
t.active = !0;
var e = wUtils.random(-140, 140), i = wUtils.random(-140, 140);
t.setPosition(n.x + e, n.y + i);
wUIHelp.playSpine(t, "start", function() {
wUIHelp.playSpine(t, "idle", null, !0);
});
};
B = this;
for (Y = 0; Y < C; Y++) w();
return [ 4, wUtils.syncDelayed(.8, this) ];

case 1:
b.sent();
if (!cc.isValid(this.node, !0)) return [ 2 ];
n = wUtils.local_world__POS(cc.find("goldbg", s));
n = wUtils.world_local_POS(l, n);
M = function(t) {
var i = m[t], o = cc.delayTime(.06 * t), s = n.sub(i.getPosition()).mag() / 500 * .3, l = cc.moveTo(s, n).easing(cc.easeIn(3)), r = cc.scaleTo(s, .4), h = cc.spawn(l, r), c = cc.callFunc(function() {
i.scale = .8;
J.goldShow[a].put(i);
J.playWinSpine(e);
}), d = cc.sequence(o, h, c);
i.runAction(d);
};
for (Y = 0; Y < C; Y++) M(Y);
return [ 2 ];
}
});
});
};
e.prototype.showEffect_3 = function(t, e) {
return __awaiter(this, void 0, void 0, function() {
var i, o, s, n, a, l, r, h, c, d, u, p = this;
return __generator(this, function(g) {
switch (g.label) {
case 0:
return e != this.JCBYModel.get_uid_data(wGameData.getKey("uid")).s_seat ? [ 2 ] : [ 4, wUtils.syncDelayed(1, this) ];

case 1:
g.sent();
wAudioMgr.playSound("sound/drop_gold", "JCBY");
e = this.JCBYModel.get_s_seat_data(e).l_seat;
i = this.goldShow3.getNode;
o = this.player[e].getChildByName("goldbg");
i.getChildByName("label").getComponent(cc.Label).string = "+" + t;
i.parent = o;
i.setPosition(1.5, 30);
i.opacity = 0;
s = cc.fadeIn(.1);
n = cc.moveBy(.2, cc.v2(0, 40));
a = cc.spawn(s, n);
l = cc.delayTime(.5);
r = cc.moveBy(.1, cc.v2(0, 15));
h = cc.fadeOut(.1);
c = cc.spawn(r, h);
d = cc.callFunc(function() {
p.goldShow3.put(i);
});
u = cc.sequence(a, l, c, d);
i.runAction(u);
return [ 2 ];
}
});
});
};
e.prototype.showEffect_1 = function(t, e) {
wAudioMgr.playSound("sound/CJ", "JCBY");
e = this.JCBYModel.get_s_seat_data(e).l_seat;
var i = this.player[e].getChildByName("anim");
if (!i.active) {
i.active = !0;
i.scale = 0;
i.getChildByName("label").getComponent(cc.Label).string = "" + wUtils.goldFormat(t);
wUIHelp.easeBackOut(i);
i.getComponent(cc.Animation).play();
var o = cc.delayTime(2), s = cc.callFunc(function() {
i.active = !1;
}), n = cc.sequence(o, s);
i.runAction(n);
}
};
e.prototype.lightningLine = function(t, e) {
var i = this, o = this.node.getChildByName("UI_parent");
t = wUtils.world_local_POS(o, t);
var s = function(t) {
for (var e = 0; e < 4; e++) i.scheduleOnce(function() {
var e = i.guang.getNode;
e.parent = o;
e.setPosition(t);
wUIHelp.playSpine(e, "animation", function() {
i.guang.put(e);
}, !1);
}, .15 * e);
};
s(t);
for (var n = function(n) {
var l = e[n];
if (!l) return "break";
var r = a.line.getNode;
r.parent = o;
r.active = !0;
r.zIndex = 2;
r.setPosition(t);
l = wUtils.world_local_POS(o, l);
s(l);
var h = wUtils.VectorLen(t, l);
r.width = h;
r.angle = 90 - wUtils.GetAngleByVector(t, l);
var c = r.getChildByName("spine");
wUIHelp.playSpine(c, "start", function() {
i.line.put(r);
});
}, a = this, l = 0; l < e.length && "break" !== n(l); l++) ;
wAudioMgr.playSound("sound/electric", wGameData.getGameName());
};
e.prototype.showDing = function(t) {
var e = this.node.getChildByName("ding");
e.active = t;
if (t) for (var i = 0, o = e.getChildByName("lizi").children; i < o.length; i++) o[i].getComponent(cc.ParticleSystem).resetSystem();
};
e.prototype.creatorWang = function(t, e) {
var i = this, o = 0;
t > 7 ? o = 2 : t > 4 && (o = 1);
var n = this.node.getChildByName("UI_parent");
e = wUtils.world_local_POS(n, e);
wRes.loadRes(s.JCBYConfig.wangUrl[o], cc.SpriteFrame, function(o, s) {
if (cc.isValid(i)) {
var a = i.wangPool.getNode;
a.setPosition(e);
a.scale = .85;
n.addChild(a, -1 * t);
a.getComponent(cc.Sprite).spriteFrame = s;
a.active = !0;
var l = a.getComponent(cc.Animation);
l.off("stop");
l.on("stop", function() {
i.wangPool.put(a);
});
l.play();
}
}, wGameData.getGameName());
};
e.prototype.setSpeedPaoBtn = function(t) {
var e = cc.find("btn/js/sd", this.node);
wUIHelp.hideSonNode(e);
if (0 != t) {
e.getChildByName("" + t).active = !0;
e.getChildByName("node").active = !0;
}
};
e.prototype.boosTips = function(t) {
var e = this.node.getChildByName("boostips").getComponent(sp.Skeleton);
e.node.active = !0;
e.setSkin(t);
wUIHelp.playSpine(e, "animation", function() {
e.node.active = !1;
});
};
e.prototype.showYCTips = function() {
var t = this.node.getChildByName("flshboomtips").getComponent(sp.Skeleton);
t.node.active = !0;
wUIHelp.playSpine(t, "animation", function() {
t.node.active = !1;
});
};
__decorate([ l([ cc.Node ]) ], e.prototype, "player", void 0);
__decorate([ l(cc.Node) ], e.prototype, "lock", void 0);
__decorate([ l([ cc.SpriteFrame ]) ], e.prototype, "bgImg", void 0);
__decorate([ l(cc.Node) ], e.prototype, "switchFish", void 0);
__decorate([ l(cc.Prefab) ], e.prototype, "PT", void 0);
return __decorate([ a ], e);
}(cc.Component);
i.default = r;
cc._RF.pop();
}, {
JCBYModel: "JCBYModel",
NodePool: void 0
} ]
}, {}, [ "JCBYBullet", "JCBYControlle", "JCBYFish", "JCBYLoad", "JCBYModel", "JCBYRoom", "JCBYView" ]);