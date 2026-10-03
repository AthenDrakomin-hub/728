window.__require = function t(e, o, a) {
function i(d, c) {
if (!o[d]) {
if (!e[d]) {
var r = d.split("/");
r = r[r.length - 1];
if (!e[r]) {
var s = "function" == typeof __require && __require;
if (!c && s) return s(r, !0);
if (n) return n(r, !0);
throw new Error("Cannot find module '" + d + "'");
}
d = r;
}
var l = o[d] = {
exports: {}
};
e[d][0].call(l.exports, function(t) {
return i(e[d][1][t] || t);
}, l, l.exports, t, e, o, a);
}
return o[d].exports;
}
for (var n = "function" == typeof __require && __require, d = 0; d < a.length; d++) i(a[d]);
return i;
}({
HBSL_Controlle: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "0eb5cHWRWJIbYFL/h+NXYWo", "HBSL_Controlle");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = t("MultiBase"), i = t("Config"), n = t("HBSL_DataMgr"), d = t("HBSL_View"), c = cc._decorator, r = c.ccclass;
c.property;
var s = function(t) {
__extends(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.m_roomInfo = function() {};
e.prototype.m_upGameGold = function() {};
e.prototype.m_NetWorkState = function() {};
e.prototype.onLoad = function() {
this.DataMgr = new n.default();
this.DataMgr.Game_Controlle = this;
this.DataMgr.Game_View = this.node.getComponent(d.default);
this.DataMgr.Init();
this.DataMgr.Game_View.DataMgr = this.DataMgr;
this.DataMgr.Game_View.Init();
};
e.prototype.start = function() {
this.Monitor_NetworkEvent();
this.m_setBankBtn(!1);
this.m_init();
};
e.prototype.Monitor_NetworkEvent = function() {
var t = this;
wGEvent.on("Msg_HBSL_RoomInfo", function(e) {
if (1 == e.status) {
var o = t.DataMgr.GameData;
o.PlayerUser.Gold = +wGameData.getKey("gold");
o.SelfUserID = "" + e.uid;
if (e.data.red_bag && e.data.red_bag.length > 0) for (var a = 0, i = e.data.red_bag.length; a < i; a++) {
var n = {
ID: "" + (d = e.data.red_bag[a]).id,
Time: +d.date,
SendUserID: "" + d.uid,
SendUserName: "" + d.nickname,
SendUserHeadPath: "" + d.headimgurl,
RadGold: +d.score,
RadCount: +d.num,
RadBoomCount: +d.thunder,
Probability: t.DataMgr.Get_Multiple(+d.num),
IsSelfGet: !1
};
t.DataMgr.Game_View.RedPacketPool.Add_RadPackBufferList(n);
t.DataMgr.Game_View.RedPacketPool.Add_DelayRedPack(n, a == i - 1);
}
if (e.data.rich) {
a = 0;
for (i = e.data.rich.length; a < i; a++) {
var d = e.data.rich[a];
t.DataMgr.Game_View.SetUI_RankPlayerList(a + 1, {
UserName: "" + d.nickname,
Gold: +d.gold,
UserID: "" + d.uid,
UserHead: +d.headimgurl
});
}
}
if (e.data.right && Object.keys(e.data.right).length > 0) {
var c = 1;
for (var r in e.data.right) if (e.data.right.hasOwnProperty(r)) {
d = e.data.right[r];
t.DataMgr.Game_View.SetUI_RightPlayerList(c++, {
UserName: "" + d.nickname,
Gold: +d.gold,
UserID: "" + r,
UserHead: +d.headimgurl
});
}
}
t.DataMgr.Game_View.SetUI_PlayerInfo({
UserName: "" + wGameData.getKey("nickname"),
Gold: o.PlayerUser.Gold,
UserID: o.SelfUserID,
UserHead: +wGameData.getKey("headimgurl")
});
t.DataMgr.Game_View.SetText_PlayerGold(o.PlayerUser.Gold);
} else wLog.e("初始化房间");
}, this);
wGEvent.on("Msg_HBSL_Act_Fa", function(e) {
if (1 == e.status) {
var o = t.DataMgr.GameData, a = {
ID: "" + e.data.id,
Time: +e.data.date,
SendUserID: "" + e.data.uid,
SendUserName: "" + e.data.nickname,
SendUserHeadPath: "" + e.data.headimgurl,
RadGold: +e.data.score,
RadCount: +e.data.num,
RadBoomCount: +e.data.thunder,
Probability: t.DataMgr.Get_Multiple(+e.data.num),
IsSelfGet: !1
};
if (t.DataMgr.GameData.SelfUserID == a.SendUserID) {
o.PlayerUser.Gold -= a.RadGold;
t.DataMgr.Game_View.SetText_PlayerGold(t.DataMgr.GameData.PlayerUser.Gold);
}
t.DataMgr.Game_View.RedPacketPool.Add_RadPackBufferList(a);
t.DataMgr.Game_View.RedPacketPool.Add_DelayRedPack(a, !0);
} else wLog.e("玩家发红包");
}, this);
wGEvent.on("Msg_HBSL_Act_Qiang", function(e) {
var o;
if (1 == e.status) if (0 != Object.keys(e.data).length) {
var a = t.DataMgr.Game_View.RedPacketPool.Get_SendRedpackPlayerData(e.data.id), i = t.DataMgr.GameData;
if (e.data.uid == i.SelfUserID) {
t.DataMgr.Game_RedPackInfo && (null === (o = t.DataMgr.Game_RedPackInfo) || void 0 === o || o.OpenRedPack({
ID: e.data.id,
SendUserID: "" + e.data.uid,
SendUserName: "" + e.data.nickname,
SendUserHeadPath: "" + e.data.headimgurl,
GetUserID: "" + i.SelfUserID,
GetUserName: "" + wGameData.getKey("nickname"),
GetRadGold: +e.data.score,
IndemnityGold: +e.data.boom
}));
t.DataMgr.GameData.PlayerUser.Gold = +e.data.gold;
t.DataMgr.Game_View.SetText_PlayerGold(t.DataMgr.GameData.PlayerUser.Gold);
t.DataMgr.Game_View.RedPacketPool.Set_GetRedPack(e.data.id);
if (t.DataMgr.Game_View.RedPacketPool.FastRedPack[e.data.id]) {
t.DataMgr.Game_View.RedPacketPool.FastGetRedpack(e.data.id, e.data.boom || e.data.score);
delete t.DataMgr.Game_View.RedPacketPool.FastRedPack[e.data.id];
} else i.IsAutoGetRadPack && t.DataMgr.Game_View.RedPacketPool.FastGetRedpack(e.data.id, e.data.boom || e.data.score);
if (a) {
a.IsSelfGet = !0;
t.DataMgr.Game_View.RedPacketPool.Update_RedPack(e.data.id);
}
}
if (e.data.boom > 0) if (e.data.uid == i.SelfUserID) ; else if (a && a.SendUserID == i.SelfUserID) {
t.DataMgr.GameData.PlayerUser.Gold += +e.data.boom - +e.data.shrinkScore;
t.DataMgr.Game_View.SetText_PlayerGold(t.DataMgr.GameData.PlayerUser.Gold);
wUIManager.showConfirmUI({
title: "",
content: "有人中雷了！赶紧看看红包记录吧！",
okCB: function() {}
});
}
if (Object.keys(e.data.get_user).length > 0) {
if (a && a.SendUserID == t.DataMgr.GameData.SelfUserID) {
t.Auto_SendRadPack();
wUIManager.showConfirmUI({
title: "",
content: "您刚刚发的红包" + a.RadGold + "欢乐豆，被抢光了",
okCB: function() {}
});
}
t.DataMgr.Game_View.RedPacketPool.Remove_RadPackBufferList(e.data.id);
t.DataMgr.Game_View.RedPacketPool.Remove_DelayRedPack(e.data.id, e.data.get_user);
t.DataMgr.Game_View.RedPacketPool.FastRedPack[e.data.id] && delete t.DataMgr.Game_View.RedPacketPool.FastRedPack[e.data.id];
}
} else wUIManager.showTips("红包已经被抢完！"); else wLog.e("玩家抢红包");
}, this);
wGEvent.on("Msg_HBSL_Return", function(e) {
if (1 == e.status) {
t.DataMgr.GameData;
var o = t.DataMgr.Game_View.RedPacketPool.Get_SendRedpackPlayerData(e.data.id);
if (o && o.SendUserID == t.DataMgr.GameData.SelfUserID) {
wUIManager.showTips("红包被退回了");
t.DataMgr.GameData.PlayerUser.Gold = e.data.gold;
t.DataMgr.Game_View.SetText_PlayerGold(t.DataMgr.GameData.PlayerUser.Gold);
t.Auto_SendRadPack();
}
t.DataMgr.Game_View.RedPacketPool.Remove_RadPackBufferList(e.data.id);
t.DataMgr.Game_View.RedPacketPool.Remove_DelayRedPack(e.data.id, null);
t.DataMgr.Game_View.RedPacketPool.FastRedPack[e.data.id] && delete t.DataMgr.Game_View.RedPacketPool.FastRedPack[e.data.id];
} else wLog.e("红包时间过期后退还通知");
}, this);
wGEvent.on("Msg_HBSL_RichMan", function(e) {
if (1 == e.status) {
t.DataMgr.GameData;
for (var o = 1; o <= 4; o++) t.DataMgr.Game_View.SetUI_RankPlayerList(o, null);
if (e.data.rich) for (var a = 0, i = e.data.rich.length; a < i; a++) {
var n = e.data.rich[a];
t.DataMgr.Game_View.SetUI_RankPlayerList(a + 1, {
UserName: "" + n.nickname,
Gold: +n.gold,
UserID: "" + n.uid,
UserHead: +n.headimgurl
});
}
} else wLog.e("更新富豪榜列表");
}, this);
wGEvent.on("Msg_Game_Jackpot", function(e) {
if (1 == e.status) {
var o = e.data[0] ? e.data[0].jackpot : 0;
0 == wUtils.random(0, 1) ? o -= wUtils.random(1e5, 1e6) : o += wUtils.random(1e5, 1e6);
o = String(o);
t.DataMgr.Game_View.SetText_PrizePool(o);
}
}, this);
this.node.stopAllActions();
var e = cc.callFunc(function() {
wNetWork.send("Msg_Game_Jackpot", {
gtype: wGameData.gameID,
level: 5
});
}), o = cc.delayTime(5), a = cc.repeatForever(cc.sequence(e, o));
this.node.runAction(a);
};
e.prototype.Auto_SendRadPack = function() {
var t = this.DataMgr.GameData;
if (this.DataMgr.GameData.IsAutoSendGetRadPack) if (this.DataMgr.Check_GoldMeetJetton(t.AutoSendRedPachData.HBGold)) if (0 == t.AutoSendRedPachData.HBGold) {
this.DataMgr.GameData.IsAutoSendGetRadPack = !1;
this.DataMgr.Game_View.SetUI_SendAutoRadPack(this.DataMgr.GameData.IsAutoSendGetRadPack);
} else if (-1 == this.DataMgr.GameData.AutoSendRedPachData.FFCount) wNetWork.send("Msg_HBSL_Act_Fa", {
score: t.AutoSendRedPachData.HBGold,
num: -1 == t.AutoSendRedPachData.HBCount ? wUtils.random(5, 10) : t.AutoSendRedPachData.HBCount,
thunder: -1 == t.AutoSendRedPachData.BoomCount ? wUtils.random(0, 9) : t.AutoSendRedPachData.BoomCount
}, !0); else if (this.DataMgr.GameData.AutoSendRedPachData.SYCount > 1) {
this.DataMgr.GameData.AutoSendRedPachData.SYCount--;
wNetWork.send("Msg_HBSL_Act_Fa", {
score: t.AutoSendRedPachData.HBGold,
num: -1 == t.AutoSendRedPachData.HBCount ? wUtils.random(5, 10) : t.AutoSendRedPachData.HBCount,
thunder: -1 == t.AutoSendRedPachData.BoomCount ? wUtils.random(0, 9) : t.AutoSendRedPachData.BoomCount
}, !0);
} else {
this.DataMgr.GameData.IsAutoSendGetRadPack = !1;
this.DataMgr.Game_View.SetUI_SendAutoRadPack(this.DataMgr.GameData.IsAutoSendGetRadPack);
wUIManager.showTips("红包发放完成");
} else {
wUIManager.showTips("您身上的欢乐豆不足！");
this.DataMgr.GameData.IsAutoSendGetRadPack = !1;
this.DataMgr.Game_View.SetUI_SendAutoRadPack(this.DataMgr.GameData.IsAutoSendGetRadPack);
}
};
e.OpenGame = function() {
var t = i.Config.GamePrefab[3];
wRes.loadRes(t.prefabUrl, function() {}, function(t, e) {
t ? wLog.e(t) : wViewMgr.openGame(e);
}, t.enName);
};
return __decorate([ r ], e);
}(a.default);
o.default = s;
cc._RF.pop();
}, {
Config: void 0,
HBSL_DataMgr: "HBSL_DataMgr",
HBSL_View: "HBSL_View",
MultiBase: void 0
} ],
HBSL_DataMgr: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "d54f3RUsqdF9rLMEGwHBd5m", "HBSL_DataMgr");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a, i = t("HBSL_PoolItemTool");
(function(t) {
t[t.QBKJ = 1] = "QBKJ";
t[t.JXSKQHB = 2] = "JXSKQHB";
t[t.ZDFW = 3] = "ZDFW";
})(a || (a = {}));
var n = function() {
function t() {}
t.prototype.Init = function() {
this.GameData = {};
this.GameData.SelfUserID = "123";
this.GameData.PlayerUser = {};
this.GameData.PrizePoolGold = 0;
this.GameData.IsAutoGetRadPack = !1;
this.GameData.RankPlayerUser = {
1: {},
2: {},
3: {}
};
this.GameData.RecordList = [];
this.GameData.ShowRadPackType = +(cc.sys.localStorage.getItem("HBSL_ShowRadPackType") || "" + a.QBKJ);
this.GameData.ShowRadPackStartGold = +(cc.sys.localStorage.getItem("HBSL_ShowRadPackStartGold") || "0");
this.GameData.ShowRadPackEndGold = +(cc.sys.localStorage.getItem("HBSL_ShowRadPackEndGold") || "0");
this.GameData.SDSendRedPachData = {
HBGold: +(cc.sys.localStorage.getItem("HBSL_SDSendRedPachData_HBGold") || "0"),
HBCount: +(cc.sys.localStorage.getItem("HBSL_SDSendRedPachData_HBCount") || "5"),
BoomCount: +(cc.sys.localStorage.getItem("HBSL_SDSendRedPachData_BoomCount") || "0")
};
this.GameData.AutoSendRedPachData = {
HBGold: +(cc.sys.localStorage.getItem("HBSL_AutoSendRedPachData_HBGold") || "0"),
HBCount: +(cc.sys.localStorage.getItem("HBSL_AutoSendRedPachData_HBCount") || "5"),
BoomCount: +(cc.sys.localStorage.getItem("HBSL_AutoSendRedPachData_BoomCount") || "0"),
FFCount: +(cc.sys.localStorage.getItem("HBSL_AutoSendRedPachData_FFCount") || "5"),
SYCount: 0
};
this.GameData.SDSendRedPachData.HBGold = Math.floor(this.GameData.SDSendRedPachData.HBGold);
this.GameData.AutoSendRedPachData.HBGold = Math.floor(this.GameData.AutoSendRedPachData.HBGold);
(isNaN(this.GameData.SDSendRedPachData.HBGold) || this.GameData.SDSendRedPachData.HBGold < 0 || this.GameData.SDSendRedPachData.HBGold > 5e7) && (this.GameData.SDSendRedPachData.HBGold = 0);
(isNaN(this.GameData.AutoSendRedPachData.HBGold) || this.GameData.AutoSendRedPachData.HBGold < 0 || this.GameData.AutoSendRedPachData.HBGold > 5e7) && (this.GameData.AutoSendRedPachData.HBGold = 0);
-1 == [ 5, 6, 7, 8, 9, 10 ].indexOf(this.GameData.SDSendRedPachData.HBCount) && (this.GameData.SDSendRedPachData.HBCount = 5);
-1 == [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ].indexOf(this.GameData.SDSendRedPachData.BoomCount) && (this.GameData.SDSendRedPachData.BoomCount = 0);
-1 == [ -1, 5, 6, 7, 8, 9, 10 ].indexOf(this.GameData.AutoSendRedPachData.HBCount) && (this.GameData.AutoSendRedPachData.HBCount = 5);
-1 == [ -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ].indexOf(this.GameData.AutoSendRedPachData.BoomCount) && (this.GameData.AutoSendRedPachData.BoomCount = 0);
-1 == [ -1, 5, 10, 15, 20 ].indexOf(this.GameData.AutoSendRedPachData.FFCount) && (this.GameData.AutoSendRedPachData.FFCount = 0);
this.PoolItemTool = new i.default();
};
t.prototype.Close = function() {
var t;
null === (t = this.PoolItemTool) || void 0 === t || t.Clear();
};
t.prototype.GetTimeDataToTime = function(t) {
return new Date((t.Year || 2e3) + "-" + (t.Month || 1) + "-" + (t.Day || 1) + " " + (t.Hour || 0) + ":" + (t.Minute || 0) + ":" + (t.Second || 0) + ":" + (t.Millisecond || 0)).getTime();
};
t.prototype.ConfigNum = function(t, e, o) {
return t < 0 ? "-" + wUtils.goldFormat(Math.abs(t), e, o) : wUtils.goldFormat(Math.abs(t), e, o);
};
t.prototype.ScoreSplit = function(t) {
if (0 == t) return [];
for (var e = [ 1, 10, 100 ], o = [], a = e.length - 1; ;) {
var i = -1;
if (t >= e[a]) i = wUtils.random(0, a); else for (var n = a - 1; n > -1; n--) if (t >= e[n]) {
i = n;
break;
}
if (i >= 0) {
var d = e[i];
o.push(d);
t -= d;
} else console.error("异常", t);
if (t <= 0 || t < e[0]) return o;
}
};
t.prototype.MaxScoreSplit = function(t) {
for (var e = [], o = [ 1, 10, 100 ], a = o.length - 1; a >= 0; a--) for (var i = o[a]; t >= i; ) {
e.push(i);
t -= i;
}
return e;
};
t.prototype.Get_Multiple = function(t) {
return {
5: 2,
6: 1.8,
7: 1.5,
8: 1.3,
9: 1.2,
10: 1.1
}[t] || 1;
};
t.prototype.Check_GoldMeetJetton = function(t) {
return this.GameData.PlayerUser.Gold >= t;
};
return t;
}();
o.default = n;
cc._RF.pop();
}, {
HBSL_PoolItemTool: "HBSL_PoolItemTool"
} ],
HBSL_LayoutPro: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "95b7cHSCRdCjbnug/k5dU8o", "HBSL_LayoutPro");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = cc._decorator, i = a.ccclass;
a.property;
var n = function(t) {
__extends(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.onLoad = function() {
this.enabled = !1;
};
return __decorate([ i ], e);
}(cc.Layout);
o.default = n;
cc._RF.pop();
}, {} ],
HBSL_Load: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "c22c8C3cLFAqpSj7xSdchcL", "HBSL_Load");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = t("Config"), i = cc._decorator, n = i.ccclass;
i.property;
var d = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.isEnterRoom = !1;
return e;
}
e.prototype.onLoad = function() {
var t = this, e = a.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir(e.prefabUrl, e.enName);
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
t.initShow();
}, this);
this.enterRoom(5);
};
e.prototype.initShow = function() {
var t = this;
this.isEnterRoom = !1;
var e = cc.fadeOut(.2), o = cc.callFunc(function() {
t.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
t.node.parent.destroyAllChildren();
}
}), a = cc.sequence(e, o);
this.node.runAction(a);
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
wViewMgr.enterHall();
}
};
e.prototype.enterRoom = function(t) {
var e = this;
if (!this.isEnterRoom) {
wGameData.roomLevel = t;
if (wGameData.gameRepair()) {
wUIManager.showTips("游戏维护中");
wViewMgr.enterHall();
} else {
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
wUIManager.hideLoadingUI();
}
}, 5);
if (!wNetWork.send("Msg_Hall_EnterRoom", {
tableid: 0,
gtype: Number(wGameData.gameID),
level: t
})) {
if (o) {
wGEvent.off(o);
e.unscheduleAllCallbacks();
o = null;
}
wUIManager.showTips("网络连接失败");
}
}
}
};
e.prototype.loadGame = function() {
var t = a.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(t.prefabUrl, function() {}, function(t, e) {
t ? wLog.e(t) : wViewMgr.openGame(e);
}, t.enName);
};
return __decorate([ n ], e);
}(cc.Component);
o.default = d;
cc._RF.pop();
}, {
Config: void 0
} ],
HBSL_PoolItemTool: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "af0a1JBFopFtqMSu+XlVQ/h", "HBSL_PoolItemTool");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = function() {
function t() {
this._All_Pool = null;
this._All_PoolPrefabl = null;
this._All_PoolInitCallback = null;
this._All_Pool = [];
this._All_PoolPrefabl = {};
this._All_PoolInitCallback = {};
}
t.GetInstance = function() {
this._Instance || (this._Instance = new t());
return this._Instance;
};
t.prototype.MonitorPoolItem = function(t, e, o, a) {
if (!this._All_PoolPrefabl[t]) {
var i = this.Clone(e);
i.Name = t;
i.parent = null;
this._All_PoolPrefabl[t] = i;
"function" == typeof o && (this._All_PoolInitCallback[t] = o);
this._All_Pool[t] || (this._All_Pool[t] = new cc.NodePool());
if ("number" == typeof a) for (var n = 0; n < a; n++) {
var d = this.Clone(this._All_PoolPrefabl[t]);
d.__TypeName__ = t;
this._All_Pool[t].put(d);
}
}
};
t.prototype.GetPoolItem = function(t) {
var e = this;
this._All_Pool[t] || (this._All_Pool[t] = new cc.NodePool());
var o = this._All_Pool[t].get();
if (!o) {
if (!this._All_PoolPrefabl[t]) return null;
(o = this.Clone(this._All_PoolPrefabl[t])).Destroy = function() {
e.RemovePoolItem(o);
};
}
o.__TypeName__ = t;
this._All_PoolInitCallback[t] && this._All_PoolInitCallback[t](o);
return o;
};
t.prototype.RootRemovePoolItem = function(t) {
if (cc.isValid(t) && t.children.length > 0) {
for (var e = t.children, o = [], a = 0, i = e.length; a < i; a++) o.push(e[a]);
a = 0;
for (i = o.length; a < i; a++) {
this.RootRemovePoolItem(o[a]);
o[a].Destroy && o[a].Destroy();
}
}
};
t.prototype.RemovePoolItem = function(t) {
if (t) {
if (t.OnDestroy) {
t.OnDestroy();
delete t.OnDestroy;
}
this._All_Pool[t.__TypeName__] || (this._All_Pool[t.__TypeName__] = new cc.NodePool());
this._All_Pool[t.__TypeName__].put(t);
}
};
t.prototype.SetNodeOnDestroy = function(t, e, o) {
if (t.__TypeName__) {
t.OnDestroy = "undefined" != typeof o ? e.bind(o) : e;
return !0;
}
return !1;
};
t.prototype.Clear = function(t) {
if (t && this._All_Pool[t]) {
this._All_Pool[t].clear();
delete this._All_Pool[t];
} else {
for (var e in this._All_Pool) this._All_Pool.hasOwnProperty(e) && this._All_Pool[e].clear();
this._All_Pool = [];
this._All_PoolPrefabl = {};
this._All_PoolInitCallback = {};
}
};
t.prototype.Clone = function(t) {
return cc.instantiate(t);
};
t._Instance = null;
return t;
}();
o.default = a;
cc._RF.pop();
}, {} ],
HBSL_Ranking: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "c5dbeNjib1LkJlPlwFlmiH7", "HBSL_Ranking");
var a;
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("PopupBase"), n = t("HBSL_ScrollViewPro");
(function(t) {
t[t.Null = 0] = "Null";
t[t.ZXRW = 1] = "ZXRW";
t[t.LSPH = 2] = "LSPH";
})(a || (a = {}));
var d = cc._decorator, c = d.ccclass;
d.property;
var r = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.CurOpenViewID = a.Null;
return e;
}
e.prototype.init = function(t) {
var e = this;
this.PlayerDataBuffer = {};
this.DataMgr = t.DataMgr;
cc.find("Node_Controller/Node_ScrollView/Node_Copy", this.node).active = !1;
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_ZXRW", this.node), function() {
wAudioMgr.playBtnSound();
e.Switch_View(a.ZXRW);
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_LSPH", this.node), function() {
wAudioMgr.playBtnSound();
e.Switch_View(a.LSPH);
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_Close", this.node), function() {
wAudioMgr.playBtnSound();
e.hide();
}, [ cc.Node.EventType.TOUCH_END ]);
var o = [], i = cc.find("Node_Controller/Node_ScrollView", this.node).getComponent(n.default);
i.Bind_ItemUpdateEvent(function(t, a) {
e.Create_PlayerItem(t, o[a]);
});
wGEvent.clear("Msg_HBSL_JackpotHistory");
wGEvent.on("Msg_HBSL_JackpotHistory", function(t) {
if (1 == t.status) {
i.Lenght = 0;
o = [];
for (var a = 0, n = t.data.length; a < n; a++) {
var d = t.data[a], c = {};
c.GetGold = +d.jackpot;
c.GetRadPack = +d.getscore;
c.HeadPath = "" + d.headimgurl;
c.Name = "" + d.nickname;
c.ID = "" + d.id;
c.IsLike = -1 != d.help.indexOf(+e.DataMgr.GameData.SelfUserID);
c.LikeCount = d.help.length;
c.Ranking = a + 1;
c.Time = +d.created;
o.push(c);
}
i.Lenght = o.length;
} else wLog.e("奖池记录");
}, this);
this.Close_View();
this.Switch_View(a.ZXRW);
};
e.prototype.onHide = function() {
this.node.destroy();
};
e.prototype.onDestroy = function() {
wGEvent.clear("Msg_HBSL_JackpotHistory");
};
e.prototype.Switch_View = function(t) {
if (this.CurOpenViewID != t) {
this.CurOpenViewID = t;
cc.find("Node_Controller/Btn_ZXRW/Img_Off", this.node).active = this.CurOpenViewID != a.ZXRW;
cc.find("Node_Controller/Btn_LSPH/Img_Off", this.node).active = this.CurOpenViewID != a.LSPH;
t == a.ZXRW ? wNetWork.send("Msg_HBSL_JackpotHistory", {
type: 1
}, !0) : wNetWork.send("Msg_HBSL_JackpotHistory", {
type: 2
}, !0);
}
};
e.prototype.Close_View = function() {
cc.find("Node_Controller/Node_ScrollView/Node_View/Node_Content", this.node).y = 0;
cc.find("Node_Controller/Node_ScrollView/Node_View/Node_Content", this.node).removeAllChildren();
};
e.prototype.Create_PlayerItem = function(t, e) {
t.active = !0;
wUIHelp.setHead(cc.find("Node_Player/Node_Head/Img_Head", t), e.HeadPath);
cc.find("Node_Player/Lab_Name", t).getComponent(cc.Label).string = "" + wUtils.handleNameLen(e.Name, 5);
cc.find("Node_Player/Lab_Time", t).getComponent(cc.Label).string = "" + this.DataMgr.Game_View.GetFormatString("AAAA-bb-cc ee:ff:gg");
for (var o = 0, a = cc.find("Node_Level", t).children; o < a.length; o++) a[o].active = !1;
if (e.Ranking > 3) {
cc.find("Node_Level/Lab_Num", t).active = !0;
cc.find("Node_Level/Lab_Num", t).getComponent(cc.Label).string = "" + e.Ranking;
} else cc.find("Node_Level/Img_" + e.Ranking, t).active = !0;
cc.find("Node_Gold/Lab_Count", t).getComponent(cc.Label).string = "" + wUtils.numConvert(e.GetGold);
cc.find("Node_RadPack/Lab_Count", t).getComponent(cc.Label).string = "" + wUtils.numConvert(e.GetRadPack);
cc.find("Node_Like/Lab_Count", t).getComponent(cc.Label).string = "" + e.LikeCount;
cc.find("Node_Like/Btn_Like/Img_On", t).active = !!e.IsLike;
cc.find("Node_Like/Btn_Like/Sp_Action", t).active = !1;
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Like/Btn_Like", t), function() {
wAudioMgr.playBtnSound();
if (!e.IsLike) {
e.IsLike = !0;
wNetWork.send("Msg_HBSL_JackpotHelp", {
id: e.ID
}, !0);
cc.find("Node_Like/Btn_Like/Sp_Action", t).active = !0;
wUIHelp.playSpine(cc.find("Node_Like/Btn_Like/Sp_Action", t), "animation", function() {
cc.find("Node_Like/Btn_Like/Sp_Action", t).active = !1;
cc.find("Node_Like/Btn_Like/Img_On", t).active = !!e.IsLike;
});
e.LikeCount++;
cc.find("Node_Like/Lab_Count", t).getComponent(cc.Label).string = "" + e.LikeCount;
}
}, [ cc.Node.EventType.TOUCH_END ]);
};
return __decorate([ c ], e);
}(i.default);
o.default = r;
cc._RF.pop();
}, {
HBSL_ScrollViewPro: "HBSL_ScrollViewPro",
PopupBase: void 0
} ],
HBSL_Record: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "8640fhUxtBNsorY4q4hp5Y6", "HBSL_Record");
var a;
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("PopupBase"), n = t("HBSL_ScrollViewPro");
(function(t) {
t[t.Null = 0] = "Null";
t[t.FCHB = 1] = "FCHB";
t[t.SDHB = 2] = "SDHB";
t[t.ZLJL = 3] = "ZLJL";
})(a || (a = {}));
var d = cc._decorator, c = d.ccclass;
d.property;
var r = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.CurOpenViewID = a.Null;
e._PlayerDataList = [];
return e;
}
e.prototype.init = function(t) {
var e = this;
this.DataMgr = t.DataMgr;
var o = !0;
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_FCHB", this.node), function() {
wAudioMgr.playBtnSound();
o || e.Switch_View(a.FCHB);
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_SDHB", this.node), function() {
wAudioMgr.playBtnSound();
o || e.Switch_View(a.SDHB);
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_ZLJL", this.node), function() {
wAudioMgr.playBtnSound();
o || e.Switch_View(a.ZLJL);
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_Close", this.node), function() {
wAudioMgr.playBtnSound();
e.hide();
}, [ cc.Node.EventType.TOUCH_END ]);
cc.find("Node_Controller/ScrollView/Node_Copy", this.node).active = !1;
this.DataMgr.GameData.RecordList = [];
this._PlayerDataList = [];
cc.find("Node_Controller/ScrollView", this.node).getComponent(n.default).Bind_ItemUpdateEvent(function(t, o) {
e._PlayerDataList.sort(function(t, e) {
return e.Time - t.Time;
});
e.Create_Record(t, e._PlayerDataList[o]);
});
var i = function(t) {
wGEvent.clear("Msg_HBSL_SelfHistoryInfo");
wGEvent.on("Msg_HBSL_SelfHistoryInfo", function(o) {
if (1 == o.status) {
wGEvent.clear("Msg_HBSL_SelfHistoryInfo");
if (o.data && o.data.length > 0) for (var a = 0, i = o.data; a < i.length; a++) {
var n = i[a];
e.DataMgr.GameData.RecordList.push({
Time: 1e3 * +n.created,
SendUserID: n.uid,
SendUserName: n.nickname,
SendUserHeadPath: n.headimgurl,
GetUserID: 0 == n.isend ? null : n.get_uid,
GetUserName: 0 == n.isend ? null : n.get_nickname,
RadGold: n.score,
GetRadGold: n.get_score,
RadCount: n.num,
RadBoomCount: n.thunder,
Probability: n.double,
IndemnityGold: n.boom
});
}
null == t || t();
} else wLog.e("游戏记录");
}, e);
};
wNetWork.send("Msg_HBSL_SelfHistoryInfo", {
type: 2
}, !0);
new Promise(function(t) {
i(function() {
t();
});
wNetWork.send("Msg_HBSL_SelfHistoryInfo", {
type: 1
}, !0);
}).then(function() {
return new Promise(function(t) {
i(function() {
t();
});
wNetWork.send("Msg_HBSL_SelfHistoryInfo", {
type: 2
}, !0);
});
}).then(function() {
e.Switch_View(a.FCHB);
});
this.node.runAction(cc.sequence(cc.delayTime(.3), cc.callFunc(function() {
o = !1;
})));
};
e.prototype.onHide = function() {
this.node.destroy();
};
e.prototype.onDestroy = function() {
wGEvent.clear("Msg_HBSL_SelfHistoryInfo");
};
e.prototype.Switch_View = function(t) {
if (this.CurOpenViewID != t) {
this.CurOpenViewID = t;
cc.find("Node_Controller/Btn_FCHB/Img_Off", this.node).active = this.CurOpenViewID != a.FCHB;
cc.find("Node_Controller/Btn_SDHB/Img_Off", this.node).active = this.CurOpenViewID != a.SDHB;
cc.find("Node_Controller/Btn_ZLJL/Img_Off", this.node).active = this.CurOpenViewID != a.ZLJL;
cc.find("Node_Controller/ScrollView/Mask_View/Node_Content", this.node).removeAllChildren();
cc.find("Node_Controller/Img_BG/Lab_Gold", this.node).Count = 0;
cc.find("Node_Controller/Img_BG/Lab_Gold", this.node).getComponent(cc.Label).string = "" + cc.find("Node_Controller/Img_BG/Lab_Gold", this.node).Count;
this._PlayerDataList = [];
cc.find("Node_Controller/ScrollView", this.node).getComponent(n.default).Lenght = this._PlayerDataList.length;
var e = function(t, e) {
return "<color=" + t + ">" + e + "</c>";
};
if (this.DataMgr.GameData.RecordList.length > 0) {
console.log("【】" + JSON.stringify(this.DataMgr.GameData.RecordList));
for (var o = 0, i = this.DataMgr.GameData.RecordList; o < i.length; o++) {
var d = i[o];
d.GetUserID == this.DataMgr.GameData.SelfUserID ? cc.find("Node_Controller/Img_BG/Lab_Gold", this.node).Count += d.GetRadGold : d.SendUserID == this.DataMgr.GameData.SelfUserID && d.IndemnityGold > 0 && (cc.find("Node_Controller/Img_BG/Lab_Gold", this.node).Count += d.IndemnityGold);
switch (this.CurOpenViewID) {
case a.FCHB:
if (d.SendUserID == this.DataMgr.GameData.SelfUserID) {
var c = "";
c = d.GetUserName ? "<color=#2B2116>您的</c><color=#710B0B>红包（" + d.RadGold + "欢乐豆/" + d.RadCount + "包/" + d.Probability + "倍/雷点" + d.RadBoomCount + "）</c><color=#2B2116>被</c><color=#710B0B>" + d.GetUserName + "</c><color=#2B2116>领取获得了</c><color=#710B0B>" + d.GetRadGold + "欢乐豆</c>" : "<color=#2B2116>您的</c><color=#710B0B>红包（" + d.RadGold + "欢乐豆/" + d.RadCount + "包/" + d.Probability + "倍/雷点" + d.RadBoomCount + "）</c><color=#2B2116>已经被领取完啦，再去发一个吧！</c>";
this._PlayerDataList.push({
Time: d.GetUserName ? d.Time : d.Time + 1,
Info: c
});
}
break;

case a.SDHB:
if (d.GetUserID == this.DataMgr.GameData.SelfUserID) {
c = "";
c += "" + e("#2B2116", "您领取了");
c += "" + e("#710B0B", "" + d.SendUserName);
c += "" + e("#2B2116", "的");
c += "" + e("#710B0B", "红包（" + d.RadGold + "欢乐豆/" + d.RadCount + "包/" + d.Probability + "倍/雷点" + d.RadBoomCount + "）");
c += "" + e("#2B2116", "获得");
c += "" + e("#710B0B", d.GetRadGold + "欢乐豆");
this._PlayerDataList.push({
Time: d.Time,
Info: c
});
}
break;

case a.ZLJL:
wLog.e(d);
if (d.IndemnityGold > 0 && d.GetUserName) {
c = "";
if (d.SendUserID == this.DataMgr.GameData.SelfUserID) {
c += "" + e("#2B2116", "您的");
c += "" + e("#710B0B", "红包（" + d.RadGold + "欢乐豆/" + d.RadCount + "包/" + d.Probability + "倍/雷点" + d.RadBoomCount + "）");
c += "" + e("#2B2116", "被");
c += "" + e("#710B0B", "" + d.GetUserName);
c += "" + e("#2B2116", "领取获得了");
c += "" + e("#710B0B", d.GetRadGold + "欢乐豆");
c += "" + e("#2B2116", "。踩雷了！");
c += "" + e("#710B0B", "" + d.GetUserName);
c += "" + e("#2B2116", "发给您");
c += "" + e("#710B0B", d.IndemnityGold + "欢乐豆");
} else {
c += "" + e("#2B2116", "您领取了");
c += "" + e("#710B0B", "" + d.SendUserName);
c += "" + e("#2B2116", "的");
c += "" + e("#710B0B", "红包（" + d.RadGold + "欢乐豆/" + d.RadCount + "包/" + d.Probability + "倍/雷点" + d.RadBoomCount + "）");
c += "" + e("#2B2116", "获得");
c += "" + e("#710B0B", d.GetRadGold + "欢乐豆");
c += "" + e("#2B2116", "，您踩雷了！发给");
c += "" + e("#710B0B", d.SendUserName + " " + d.IndemnityGold + "欢乐豆");
}
this._PlayerDataList.push({
Time: d.Time,
Info: c
});
}
}
}
cc.find("Node_Controller/Img_BG/Lab_Gold", this.node).getComponent(cc.Label).string = "" + cc.find("Node_Controller/Img_BG/Lab_Gold", this.node).Count;
}
cc.find("Node_Controller/ScrollView", this.node).getComponent(n.default).Lenght = this._PlayerDataList.length;
cc.find("Node_Controller/Img_BG/Lab_Count", this.node).getComponent(cc.Label).string = "最近" + this._PlayerDataList.length + "条记录";
}
};
e.prototype.Create_Record = function(t, e) {
cc.find("Node_Controller/Img_BG/Lab_Count", this.node).getComponent(cc.Label).string = "最近" + this._PlayerDataList.length + "条记录";
cc.find("Lab_Time_1", t).getComponent(cc.Label).string = "" + this.DataMgr.Game_View.GetFormatString("AAAA-bb-cc", e.Time);
cc.find("Lab_Time_2", t).getComponent(cc.Label).string = "" + this.DataMgr.Game_View.GetFormatString("ee:ff:gg", e.Time);
cc.find("Lab_Info", t).getComponent(cc.RichText).string = "" + e.Info;
};
return __decorate([ c ], e);
}(i.default);
o.default = r;
cc._RF.pop();
}, {
HBSL_ScrollViewPro: "HBSL_ScrollViewPro",
PopupBase: void 0
} ],
HBSL_RedPackInfo: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "c6bbaQOlatFL7CPYFYk2rI6", "HBSL_RedPackInfo");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = t("PopupBase"), i = cc._decorator, n = i.ccclass;
i.property;
var d = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.SelfRedPackData = null;
return e;
}
e.prototype.init = function(t) {
var e = this, o = !1;
this.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
o = !0;
})));
this.DataMgr = t.DataMgr;
this.DataMgr.Game_RedPackInfo = this;
cc.find("Node_Point", this.node).active = !1;
this.DataMgr.Game_View.AddNodeClick(cc.find("Img_Mask", this.node), function() {
if (o) {
wAudioMgr.playBtnSound();
cc.find("Node_Controller", e.node).IsWin ? e.Play_Score() : e.hide();
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_Open", this.node), function() {
wAudioMgr.playBtnSound();
e.DataMgr.Check_GoldMeetJetton(e.SelfRedPackData.Probability * e.SelfRedPackData.RadGold) ? e.DataMgr.Game_View.RedPacketPool.Check_RedPackQW(e.SelfRedPackData.ID) ? wUIManager.showTips("哎呀，红包被领取完了，请开别的红包吧！") : wNetWork.send("Msg_HBSL_Act_Qiang", {
id: e.SelfRedPackData.ID
}, !0) : wUIManager.showTips("欢乐豆不足");
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_Close", this.node), function() {
if (o) {
wAudioMgr.playBtnSound();
cc.find("Node_Controller", e.node).IsWin ? e.Play_Score() : e.hide();
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Node_Root2/Node_Loser/Btn_OK", this.node), function() {
wAudioMgr.playBtnSound();
e.hide();
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddSpineEvent(cc.find("Node_Controller/Sp_BG", this.node), function(t, e) {
"start" == e ? t.getComponent(sp.Skeleton).setAnimation(0, "idle2", !0) : "start2" == e && t.getComponent(sp.Skeleton).setAnimation(0, "idle3", !0);
});
cc.find("Node_Controller/Sp_BG", this.node).getComponent(sp.Skeleton).setAnimation(0, "idle", !0);
this.SelfRedPackData = t.RedPackData;
this.Set_View1(t.RedPackData || {});
};
e.prototype.onHide = function() {
this.node.destroy();
};
e.prototype.onDestroy = function() {
this.DataMgr.Game_RedPackInfo = null;
};
e.prototype.Set_View1 = function(t) {
cc.find("Node_Controller/Node_Root1", this.node).active = !0;
cc.find("Node_Controller/Node_Root2", this.node).active = !1;
wUIHelp.setHead(cc.find("Node_Controller/Node_Root1/Node_Head/Img_Head", this.node), t.SendUserHeadPath);
cc.find("Node_Controller/Node_Root1/Lab_Name", this.node).getComponent(cc.Label).string = wUtils.handleNameLen(t.SendUserName, 5) + "的红包";
cc.find("Node_Controller/Node_Root1/Lab_Info", this.node).getComponent(cc.Label).string = t.RadGold + "欢乐豆/" + t.RadCount + "包/" + t.Probability + "倍/雷点" + t.RadBoomCount;
cc.find("Node_Controller/Node_Root2/Lab_Info", this.node).getComponent(cc.Label).string = t.RadGold + "欢乐豆/" + t.RadCount + "包/" + t.Probability + "倍/雷点" + t.RadBoomCount;
};
e.prototype.OpenRedPack = function(t) {
var e = this;
if (this.SelfRedPackData.ID == t.ID) {
this.Set_View2(t);
t.IndemnityGold > 0 ? cc.find("Node_Controller/Sp_BG", this.node).getComponent(sp.Skeleton).setAnimation(0, "start2", !1) : cc.find("Node_Controller/Sp_BG", this.node).getComponent(sp.Skeleton).setAnimation(0, "start", !1);
cc.find("Node_Controller/Node_Root1", this.node).runAction(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
cc.find("Node_Controller/Node_Root1", e.node).active = !1;
var t = cc.find("Node_Controller/Node_Root2", e.node);
t.active = !0;
t.opacity = 0;
t.stopAllActions();
t.runAction(cc.sequence(cc.delayTime(0), cc.fadeIn(.5)));
})));
wUIHelp.playSpine(cc.find("Node_Controller/Btn_Open/Sp", this.node), "start", function() {
cc.find("Node_Controller/Btn_Open/Sp", e.node).active = !1;
});
cc.find("Node_Controller", this.node).IsWin = 0 == t.IndemnityGold;
}
};
e.prototype.Set_View2 = function(t) {
wUIHelp.setHead(cc.find("Node_Controller/Node_Root2/Node_Head/Img_Head", this.node), t.SendUserHeadPath);
cc.find("Node_Controller/Node_Root2/Lab_Name", this.node).getComponent(cc.Label).string = wUtils.handleNameLen(t.SendUserName, 5) + "的红包";
cc.find("Node_Controller/Node_Root2/Node_Win/Lab_Gold", this.node).getComponent(cc.Label).string = "+" + t.GetRadGold;
cc.find("Node_Controller/Node_Root2/Node_Loser/Lab_Gold", this.node).getComponent(cc.Label).string = "-" + t.IndemnityGold;
cc.find("Node_Controller/Node_Root2/Node_Loser/Lab_GetGold", this.node).getComponent(cc.Label).string = "+" + t.GetRadGold;
cc.find("Node_Controller/Node_Root2/Node_Win", this.node).active = 0 == t.IndemnityGold;
cc.find("Node_Controller/Node_Root2/Node_Loser", this.node).active = t.IndemnityGold > 0;
};
e.prototype.Play_Score = function() {
var t = this;
cc.find("Img_Mask", this.node).active = !1;
cc.find("Node_Controller", this.node).stopAllActions();
cc.find("Node_Controller", this.node).runAction(cc.scaleTo(.5, 0, 0));
cc.find("Node_Controller", this.node).runAction(cc.sequence(cc.moveTo(.5, cc.v2(cc.find("Node_Point", this.node).position)).easing(cc.easeIn(1)), cc.callFunc(function() {
cc.find("Node_Controller", t.node).active = !1;
cc.find("Node_Point", t.node).active = !0;
wUIHelp.playSpine(cc.find("Node_Point", t.node), "animation", function() {
t.node.destroy();
});
})));
};
return __decorate([ n ], e);
}(a.default);
o.default = d;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
HBSL_RedPack: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "db0d69Ac2BHWZQrD3jOxFF+", "HBSL_RedPack");
var a;
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("PopupBase");
(function(t) {
t[t.Null = 0] = "Null";
t[t.SDFB = 1] = "SDFB";
t[t.ZDFB = 2] = "ZDFB";
})(a || (a = {}));
var n = cc._decorator, d = n.ccclass;
n.property;
var c = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.CurOpenViewID = a.Null;
return e;
}
e.prototype.init = function(t) {
var e = this;
this.DataMgr = t.DataMgr;
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Node_View2/Btn_Switch", this.node), function() {
wAudioMgr.playBtnSound();
e.Switch_View(a.SDFB);
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Node_View1/Btn_Switch", this.node), function() {
wAudioMgr.playBtnSound();
e.Switch_View(a.ZDFB);
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_Close", this.node), function() {
wAudioMgr.playBtnSound();
e.hide();
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Node_View1/Node_HBJE/Btn_GoldClose", this.node), function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.SDSendRedPachData.HBGold = 0;
cc.sys.localStorage.setItem("HBSL_SDSendRedPachData_HBGold", "" + e.DataMgr.GameData.SDSendRedPachData.HBGold);
e.Update_View();
}, [ cc.Node.EventType.TOUCH_END ]);
for (var o = function(t) {
i.DataMgr.Game_View.AddNodeClick(t, function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.SDSendRedPachData.HBGold += +t.name;
e.DataMgr.GameData.SDSendRedPachData.HBGold > 5e7 && (e.DataMgr.GameData.SDSendRedPachData.HBGold = 5e7);
cc.sys.localStorage.setItem("HBSL_SDSendRedPachData_HBGold", "" + e.DataMgr.GameData.SDSendRedPachData.HBGold);
e.Update_View();
}, [ cc.Node.EventType.TOUCH_END ]);
}, i = this, n = 0, d = cc.find("Node_Controller/Node_View1/Node_HBJE/Lay", this.node).children; n < d.length; n++) o(d[n]);
for (var c = function(t) {
r.DataMgr.Game_View.AddNodeClick(t, function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.SDSendRedPachData.HBCount = +t.name;
cc.sys.localStorage.setItem("HBSL_SDSendRedPachData_HBCount", "" + e.DataMgr.GameData.SDSendRedPachData.HBCount);
e.Update_View();
}, [ cc.Node.EventType.TOUCH_END ]);
}, r = this, s = 0, l = cc.find("Node_Controller/Node_View1/Node_HBGS/Lay", this.node).children; s < l.length; s++) c(l[s]);
for (var _ = function(t) {
h.DataMgr.Game_View.AddNodeClick(t, function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.SDSendRedPachData.BoomCount = +t.name;
cc.sys.localStorage.setItem("HBSL_SDSendRedPachData_BoomCount", "" + e.DataMgr.GameData.SDSendRedPachData.BoomCount);
e.Update_View();
}, [ cc.Node.EventType.TOUCH_END ]);
}, h = this, u = 0, f = cc.find("Node_Controller/Node_View1/Node_LDS/Lay", this.node).children; u < f.length; u++) _(f[u]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Node_View1/Btn_SQJHB", this.node), function() {
wAudioMgr.playBtnSound();
e.SendRedPack(!1, function(t) {
t && e.Play_SendRedPack();
});
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Node_View2/Node_BG/Node_HBJE/Btn_GoldClose", this.node), function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.AutoSendRedPachData.HBGold = 0;
cc.sys.localStorage.setItem("HBSL_AutoSendRedPachData_HBGold", "" + e.DataMgr.GameData.AutoSendRedPachData.HBGold);
e.Update_View();
}, [ cc.Node.EventType.TOUCH_END ]);
for (var p = function(t) {
g.DataMgr.Game_View.AddNodeClick(t, function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.AutoSendRedPachData.HBGold += +t.name;
e.DataMgr.GameData.AutoSendRedPachData.HBGold > 5e7 && (e.DataMgr.GameData.AutoSendRedPachData.HBGold = 5e7);
cc.sys.localStorage.setItem("HBSL_AutoSendRedPachData_HBGold", "" + e.DataMgr.GameData.AutoSendRedPachData.HBGold);
e.Update_View();
}, [ cc.Node.EventType.TOUCH_END ]);
}, g = this, D = 0, P = cc.find("Node_Controller/Node_View2/Node_BG/Node_HBJE/Lay", this.node).children; D < P.length; D++) p(P[D]);
for (var S = function(t) {
m.DataMgr.Game_View.AddNodeClick(t, function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.AutoSendRedPachData.HBCount = +t.name;
cc.sys.localStorage.setItem("HBSL_AutoSendRedPachData_HBCount", "" + e.DataMgr.GameData.AutoSendRedPachData.HBCount);
e.Update_View();
}, [ cc.Node.EventType.TOUCH_END ]);
}, m = this, y = 0, G = cc.find("Node_Controller/Node_View2/Node_BG/Node_HBGS/Lay", this.node).children; y < G.length; y++) S(G[y]);
for (var C = function(t) {
N.DataMgr.Game_View.AddNodeClick(t, function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.AutoSendRedPachData.BoomCount = +t.name;
cc.sys.localStorage.setItem("HBSL_AutoSendRedPachData_BoomCount", "" + e.DataMgr.GameData.AutoSendRedPachData.BoomCount);
e.Update_View();
}, [ cc.Node.EventType.TOUCH_END ]);
}, N = this, w = 0, L = cc.find("Node_Controller/Node_View2/Node_BG/Node_LDS/Lay", this.node).children; w < L.length; w++) C(L[w]);
for (var R = function(t) {
B.DataMgr.Game_View.AddNodeClick(t, function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.AutoSendRedPachData.FFCount = +t.name;
cc.sys.localStorage.setItem("HBSL_AutoSendRedPachData_FFCount", "" + e.DataMgr.GameData.AutoSendRedPachData.FFCount);
e.Update_View();
}, [ cc.Node.EventType.TOUCH_END ]);
}, B = this, I = 0, v = cc.find("Node_Controller/Node_View2/Node_BG/Node_FHGS/Lay", this.node).children; I < v.length; I++) R(v[I]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Node_View2/Btn_KSFHB", this.node), function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.IsAutoSendGetRadPack = !0;
e.SendRedPack(!0, function(t) {
if (t) {
-1 != e.DataMgr.GameData.AutoSendRedPachData.FFCount && (e.DataMgr.GameData.AutoSendRedPachData.SYCount = e.DataMgr.GameData.AutoSendRedPachData.FFCount);
e.DataMgr.Game_View.SetUI_SendAutoRadPack(e.DataMgr.GameData.IsAutoSendGetRadPack);
e.Play_SendRedPack();
} else e.DataMgr.GameData.IsAutoSendGetRadPack = !1;
});
e.Update_View();
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Node_View2/Btn_ZDFHBZ", this.node), function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.IsAutoSendGetRadPack = !1;
e.Update_View();
e.DataMgr.Game_View.SetUI_SendAutoRadPack(e.DataMgr.GameData.IsAutoSendGetRadPack);
}, [ cc.Node.EventType.TOUCH_END ]);
this.Update_View();
this.DataMgr.GameData.IsAutoSendGetRadPack ? this.Switch_View(a.ZDFB) : this.Switch_View(a.SDFB);
};
e.prototype.onHide = function() {
this.node.destroy();
};
e.prototype.Update_View = function() {
cc.find("Node_Controller/Node_View1/Node_HBJE/Lab_Count", this.node).getComponent(cc.Label).string = "" + this.DataMgr.GameData.SDSendRedPachData.HBGold;
cc.find("Node_Controller/Node_View1/Node_HBGS/Lab_Count", this.node).getComponent(cc.Label).string = "" + this.DataMgr.GameData.SDSendRedPachData.HBCount;
cc.find("Node_Controller/Node_View1/Node_LDS/Lab_Count", this.node).getComponent(cc.Label).string = "" + this.DataMgr.GameData.SDSendRedPachData.BoomCount;
cc.find("Node_Controller/Node_View2/Node_BG/Node_HBJE/Lab_Count", this.node).getComponent(cc.Label).string = "" + this.DataMgr.GameData.AutoSendRedPachData.HBGold;
cc.find("Node_Controller/Node_View2/Node_BG/Node_HBGS/Lab_Count", this.node).getComponent(cc.Label).string = "" + (-1 == this.DataMgr.GameData.AutoSendRedPachData.HBCount ? "随机" : this.DataMgr.GameData.AutoSendRedPachData.HBCount);
cc.find("Node_Controller/Node_View2/Node_BG/Node_LDS/Lab_Count", this.node).getComponent(cc.Label).string = "" + (-1 == this.DataMgr.GameData.AutoSendRedPachData.BoomCount ? "随机" : this.DataMgr.GameData.AutoSendRedPachData.BoomCount);
cc.find("Node_Controller/Node_View2/Node_BG/Node_FHGS/Lab_Count", this.node).getComponent(cc.Label).string = "" + (-1 == this.DataMgr.GameData.AutoSendRedPachData.FFCount ? "一直发" : this.DataMgr.GameData.AutoSendRedPachData.FFCount);
cc.find("Node_Controller/Node_View2/Lab_SYCount", this.node).getComponent(cc.Label).string = "剩余数量:" + this.DataMgr.GameData.AutoSendRedPachData.SYCount;
cc.find("Node_Controller/Node_View2/Node_BG", this.node).opacity = this.DataMgr.GameData.IsAutoSendGetRadPack ? 127 : 255;
cc.find("Node_Controller/Node_View2/Node_NoTouch", this.node).active = this.DataMgr.GameData.IsAutoSendGetRadPack;
cc.find("Node_Controller/Node_View2/Btn_Switch", this.node).active = !this.DataMgr.GameData.IsAutoSendGetRadPack;
cc.find("Node_Controller/Node_View2/Lab_SYCount", this.node).active = this.DataMgr.GameData.IsAutoSendGetRadPack && this.DataMgr.GameData.AutoSendRedPachData.SYCount > 0 && -1 != this.DataMgr.GameData.AutoSendRedPachData.FFCount;
cc.find("Node_Controller/Node_View2/Btn_ZDFHBZ", this.node).active = this.DataMgr.GameData.IsAutoSendGetRadPack;
cc.find("Node_Controller/Node_View2/Btn_KSFHB", this.node).active = !this.DataMgr.GameData.IsAutoSendGetRadPack;
};
e.prototype.Switch_View = function(t) {
if (this.CurOpenViewID != t) {
this.CurOpenViewID = t;
cc.find("Node_Controller/Node_View1", this.node).active = this.CurOpenViewID == a.SDFB;
cc.find("Node_Controller/Node_View2", this.node).active = this.CurOpenViewID == a.ZDFB;
}
};
e.prototype.SendRedPack = function(t, e) {
var o = this.DataMgr.GameData;
if (this.DataMgr.GameData.IsAutoSendGetRadPack) {
if (!this.DataMgr.Check_GoldMeetJetton(o.AutoSendRedPachData.HBGold)) {
wUIManager.showTips("您身上的欢乐豆不足！");
null == e || e(!1);
return;
}
if (0 == this.DataMgr.GameData.AutoSendRedPachData.HBGold) {
wUIManager.showTips("请选择有效的金额！");
null == e || e(!1);
return;
}
wNetWork.send("Msg_HBSL_Act_Fa", {
score: o.AutoSendRedPachData.HBGold,
num: -1 == o.AutoSendRedPachData.HBCount ? wUtils.random(5, 10) : o.AutoSendRedPachData.HBCount,
thunder: -1 == o.AutoSendRedPachData.BoomCount ? wUtils.random(0, 9) : o.AutoSendRedPachData.BoomCount
}, !0);
null == e || e(!0);
} else {
if (!this.DataMgr.Check_GoldMeetJetton(o.SDSendRedPachData.HBGold)) {
wUIManager.showTips("您身上的欢乐豆不足！");
null == e || e(!1);
return;
}
if (0 == o.SDSendRedPachData.HBGold) {
wUIManager.showTips("请选择有效的金额！");
null == e || e(!1);
return;
}
wNetWork.send("Msg_HBSL_Act_Fa", {
score: o.SDSendRedPachData.HBGold,
num: o.SDSendRedPachData.HBCount,
thunder: o.SDSendRedPachData.BoomCount
}, !0);
null == e || e(!0);
}
};
e.prototype.Play_SendRedPack = function() {
var t = this;
cc.find("Img_Mask", this.node).active = !1;
cc.find("Node_Controller/Node_View1", this.node).runAction(cc.fadeOut(.3));
cc.find("Node_Controller/Node_View2", this.node).runAction(cc.fadeOut(.3));
cc.find("Node_Controller/Btn_Close", this.node).runAction(cc.fadeOut(.3));
wUIHelp.playSpine(cc.find("Node_Controller/Sp_BG", this.node), "start", function() {
t.node.destroy();
});
};
return __decorate([ d ], e);
}(i.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
HBSL_ScrollViewPro: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "6d1dfG0rS5DiYdRUTSdn8rw", "HBSL_ScrollViewPro");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = t("HBSL_LayoutPro"), i = cc._decorator, n = i.ccclass, d = i.property, c = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.Property_ItemPrefab = null;
e.Property_ItemNode = null;
e.Property_ItemSize = cc.Size.ZERO;
e.Property_Reservation = 2;
e.Property_SlidingOffset = 1;
e.Property_IsNodePool = !1;
e.MaxShowItemCount = 0;
e.PointShowTable = {};
e.ShowItemCount = 0;
e.ContinueGropItemCount = 1;
e.IsOneSlidingEvent = !1;
e.NodePool = null;
e._Length = 0;
return e;
}
Object.defineProperty(e.prototype, "Utils_LayoutPro", {
get: function() {
this._Utils_LayoutPro || (this._Utils_LayoutPro = this.content.getComponent(a.default));
return this._Utils_LayoutPro;
},
enumerable: !1,
configurable: !0
});
e.prototype.Bind_ItemUpdateEvent = function(t) {
this.ItemUpdateEvent = t;
};
e.prototype.Bind_PreloadingEvent = function(t) {
this.PreloadingEvent = t;
};
e.prototype.Update_PreloadingEvent = function() {
this.IsOneSlidingEvent = !1;
};
Object.defineProperty(e.prototype, "Lenght", {
set: function(t) {
var e = this.Utils_LayoutPro.node.getPosition();
this.stopAutoScroll();
this._Length = t;
this.Update_ContentSize();
0 != this._Length ? this.Utils_LayoutPro.node.setPosition(e) : this.Utils_LayoutPro.node.setPosition(cc.Vec2.ZERO);
this.Check_ScrollView(!1);
this.Update_ScrollView();
},
enumerable: !1,
configurable: !0
});
e.prototype.onDestroy = function() {
this.NodePool.clear();
};
e.prototype.start = function() {
this.NodePool = new cc.NodePool();
this.node.zIndex = 99999;
t.prototype.start.call(this);
this.Property_ItemNode && (this.Property_ItemNode.active = !1);
this.Utils_LayoutPro.node.removeAllChildren();
this.Init_ConfigShowItemCount();
this.Init_Event();
};
e.prototype.Init_Event = function() {
var t = this;
this.node.off("scrolling");
this.node.on("scrolling", function() {
t.Check_ScrollView(!0);
t.Check_PreloadingEvent();
}, this);
this.node.off("scroll-began");
this.node.on("scroll-began", function() {
t.IsOneSlidingEvent = !1;
}, this);
};
e.prototype.Init_ConfigShowItemCount = function() {
if (this.Utils_LayoutPro.type == cc.Layout.Type.VERTICAL) {
this.MaxShowItemCount = Math.floor((this.node.height + this.Utils_LayoutPro.paddingTop + this.Utils_LayoutPro.paddingBottom) / (this.Utils_LayoutPro.spacingY + this.Property_ItemSize.height)) + 1;
this.MaxShowItemCount += 2 * this.Property_Reservation;
} else if (this.Utils_LayoutPro.type == cc.Layout.Type.HORIZONTAL) {
this.MaxShowItemCount = Math.floor((this.node.width + this.Utils_LayoutPro.paddingLeft + this.Utils_LayoutPro.paddingRight) / (this.Utils_LayoutPro.spacingX + this.Property_ItemSize.width)) + 1;
this.MaxShowItemCount += 2 * this.Property_Reservation;
} else if (this.Utils_LayoutPro.type == cc.Layout.Type.GRID) {
if (this.Utils_LayoutPro.startAxis == cc.Layout.AxisDirection.HORIZONTAL) {
this.MaxShowItemCount = Math.floor((this.node.height + this.Utils_LayoutPro.paddingTop + this.Utils_LayoutPro.paddingBottom) / (this.Utils_LayoutPro.spacingY + this.Property_ItemSize.height)) + 1;
var t = this.Utils_LayoutPro.node.width - this.Utils_LayoutPro.paddingLeft - this.Utils_LayoutPro.paddingRight;
t -= this.Property_ItemSize.width;
this.ContinueGropItemCount = Math.floor(t / (this.Property_ItemSize.width + this.Utils_LayoutPro.spacingX));
this.ContinueGropItemCount += 1;
} else if (this.Utils_LayoutPro.startAxis == cc.Layout.AxisDirection.VERTICAL) {
this.MaxShowItemCount = Math.floor((this.node.width + this.Utils_LayoutPro.paddingLeft + this.Utils_LayoutPro.paddingRight) / (this.Utils_LayoutPro.spacingX + this.Property_ItemSize.width)) + 1;
var e = this.Utils_LayoutPro.node.height - this.Utils_LayoutPro.paddingTop - this.Utils_LayoutPro.paddingBottom;
e -= this.Property_ItemSize.height;
this.ContinueGropItemCount = Math.floor(e / (this.Property_ItemSize.height + this.Utils_LayoutPro.spacingY));
this.ContinueGropItemCount += 1;
}
this.MaxShowItemCount *= this.ContinueGropItemCount;
this.MaxShowItemCount += 2 * this.Property_Reservation * this.ContinueGropItemCount;
}
};
e.prototype.Get_VerticalProgress = function() {
var t = 0;
(t = this.Utils_LayoutPro.verticalDirection == cc.Layout.VerticalDirection.TOP_TO_BOTTOM ? this.Utils_LayoutPro.node.y / this.Utils_LayoutPro.node.height : -this.Utils_LayoutPro.node.y / this.Utils_LayoutPro.node.height) < 0 && (t = 0);
t > 1 && (t = 1);
return t;
};
e.prototype.Get_HorizontalProgress = function() {
var t = 0;
(t = this.Utils_LayoutPro.horizontalDirection == cc.Layout.HorizontalDirection.LEFT_TO_RIGHT ? -this.Utils_LayoutPro.node.x / this.Utils_LayoutPro.node.width : this.Utils_LayoutPro.node.x / this.Utils_LayoutPro.node.width) < 0 && (t = 0);
t > 1 && (t = 1);
return t;
};
e.prototype.Get_ShowIndesList = function() {
var t = [];
if (this._Length <= this.MaxShowItemCount) {
for (var e = 0; e < this._Length; e++) t.push(e);
return t;
}
if (this.horizontal) {
var o = 0;
if (this.Utils_LayoutPro.type == cc.Layout.Type.HORIZONTAL) o = Math.floor(this._Length * this.Get_HorizontalProgress()); else if (this.Utils_LayoutPro.type == cc.Layout.Type.GRID) {
var a = Math.floor(this._Length / this.ContinueGropItemCount);
if (this.Utils_LayoutPro.startAxis == cc.Layout.AxisDirection.VERTICAL) {
o = Math.floor(a * this.Get_HorizontalProgress());
o *= this.ContinueGropItemCount;
}
}
for (e = 0; e < this.MaxShowItemCount; e++) e + o < this._Length && t.push(e + o);
} else if (this.vertical) {
o = 0;
if (this.Utils_LayoutPro.type == cc.Layout.Type.VERTICAL) o = Math.floor(this._Length * this.Get_VerticalProgress()); else if (this.Utils_LayoutPro.type == cc.Layout.Type.GRID) {
a = Math.floor(this._Length / this.ContinueGropItemCount);
if (this.Utils_LayoutPro.startAxis == cc.Layout.AxisDirection.HORIZONTAL) {
o = Math.floor(a * this.Get_VerticalProgress());
o *= this.ContinueGropItemCount;
}
}
for (e = 0; e < this.MaxShowItemCount; e++) e + o < this._Length && t.push(e + o);
}
return t;
};
e.prototype.Check_PreloadingEvent = function() {
var t;
if (!this.IsOneSlidingEvent) {
var e = 0;
(e = this.horizontal ? this.Utils_LayoutPro.horizontalDirection == cc.Layout.HorizontalDirection.LEFT_TO_RIGHT ? -this.getScrollOffset().x / this.getMaxScrollOffset().x : 1 + this.getScrollOffset().x / this.getMaxScrollOffset().x : this.Utils_LayoutPro.verticalDirection == cc.Layout.VerticalDirection.TOP_TO_BOTTOM ? this.getScrollOffset().y / this.getMaxScrollOffset().y : 1 - this.getScrollOffset().y / this.getMaxScrollOffset().y) < 0 && (e = 0);
e > 1 && (e = 1);
if (e >= this.Property_SlidingOffset) {
this.IsOneSlidingEvent = !0;
null === (t = this.PreloadingEvent) || void 0 === t || t.call(this);
}
}
};
e.prototype.Check_ScrollView = function(t) {
var e = this.Get_ShowIndesList(), o = {};
if (Object.keys(this.PointShowTable).length > 0) for (var a in this.PointShowTable) if (this.PointShowTable.hasOwnProperty(a)) {
var i = this.PointShowTable[a];
o[a] = i;
}
for (var n = 0, d = e.length; n < d; n++) {
var c = e[n];
this.PointShowTable[c] ? delete o[c] : t ? this.ItemUpdateEvent(this.Create_Node(c), c) : this.Create_Node(c);
}
if (Object.keys(o).length > 0) for (var a in o) if (o.hasOwnProperty(a)) {
(i = o[a]).parent = null;
this.Property_IsNodePool ? this.NodePool.put(i) : i.destroy();
delete this.PointShowTable[a];
}
this.ShowItemCount = e.length;
};
e.prototype.Create_Node = function(t) {
var e = null;
this.Property_IsNodePool && (e = this.NodePool.get());
e || (e = cc.instantiate(this.Property_ItemPrefab || this.Property_ItemNode));
e.active = !0;
e.setPosition(cc.Vec2.ZERO);
if (this.Utils_LayoutPro.type == cc.Layout.Type.VERTICAL) if (this.Utils_LayoutPro.verticalDirection == cc.Layout.VerticalDirection.TOP_TO_BOTTOM) {
e.y -= this.Utils_LayoutPro.paddingTop;
e.y -= this.Property_ItemSize.height / 2;
if (t > 0) {
e.y -= t * this.Utils_LayoutPro.spacingY;
e.y -= t * this.Property_ItemSize.height;
}
} else {
e.y += this.Utils_LayoutPro.paddingBottom;
e.y += this.Property_ItemSize.height / 2;
if (t > 0) {
e.y += t * this.Utils_LayoutPro.spacingY;
e.y += t * this.Property_ItemSize.height;
}
} else if (this.Utils_LayoutPro.type == cc.Layout.Type.HORIZONTAL) if (this.Utils_LayoutPro.horizontalDirection == cc.Layout.HorizontalDirection.LEFT_TO_RIGHT) {
e.x += this.Utils_LayoutPro.paddingLeft;
e.x += this.Property_ItemSize.width / 2;
if (t > 0) {
e.x += t * this.Utils_LayoutPro.spacingX;
e.x += t * this.Property_ItemSize.width;
}
} else {
e.x -= this.Utils_LayoutPro.paddingRight;
e.x -= this.Property_ItemSize.width / 2;
if (t > 0) {
e.x -= t * this.Utils_LayoutPro.spacingX;
e.x -= t * this.Property_ItemSize.width;
}
} else if (this.Utils_LayoutPro.type == cc.Layout.Type.GRID) {
var o = t % this.ContinueGropItemCount, a = Math.floor(t / this.ContinueGropItemCount);
if (this.Utils_LayoutPro.startAxis == cc.Layout.AxisDirection.HORIZONTAL) {
if (this.Utils_LayoutPro.horizontalDirection == cc.Layout.HorizontalDirection.LEFT_TO_RIGHT) {
e.x = -this.Utils_LayoutPro.node.width / 2;
e.x += this.Utils_LayoutPro.paddingLeft;
e.x += this.Property_ItemSize.width / 2;
if (o > 0) {
e.x += o * this.Utils_LayoutPro.spacingX;
e.x += o * this.Property_ItemSize.width;
}
} else {
e.x = this.Utils_LayoutPro.node.width / 2;
e.x -= this.Utils_LayoutPro.paddingRight;
e.x -= this.Property_ItemSize.width / 2;
if (o > 0) {
e.x -= o * this.Utils_LayoutPro.spacingX;
e.x -= o * this.Property_ItemSize.width;
}
}
if (this.Utils_LayoutPro.verticalDirection == cc.Layout.VerticalDirection.TOP_TO_BOTTOM) {
e.y -= this.Utils_LayoutPro.paddingTop;
e.y -= this.Property_ItemSize.height / 2;
if (a > 0) {
e.y -= a * this.Utils_LayoutPro.spacingY;
e.y -= a * this.Property_ItemSize.height;
}
} else {
e.y += this.Utils_LayoutPro.paddingBottom;
e.y += this.Property_ItemSize.height / 2;
if (a > 0) {
e.y += a * this.Utils_LayoutPro.spacingY;
e.y += a * this.Property_ItemSize.height;
}
}
} else if (this.Utils_LayoutPro.startAxis == cc.Layout.AxisDirection.VERTICAL) {
if (this.Utils_LayoutPro.verticalDirection == cc.Layout.VerticalDirection.TOP_TO_BOTTOM) {
e.y = this.Utils_LayoutPro.node.height / 2;
e.y -= this.Utils_LayoutPro.paddingTop;
e.y -= this.Property_ItemSize.height / 2;
if (o > 0) {
e.y -= o * this.Utils_LayoutPro.spacingY;
e.y -= o * this.Property_ItemSize.height;
}
} else {
e.y = -this.Utils_LayoutPro.node.height / 2;
e.y += this.Utils_LayoutPro.paddingBottom;
e.y += this.Property_ItemSize.height / 2;
if (o > 0) {
e.y += o * this.Utils_LayoutPro.spacingY;
e.y += o * this.Property_ItemSize.height;
}
}
if (this.Utils_LayoutPro.horizontalDirection == cc.Layout.HorizontalDirection.LEFT_TO_RIGHT) {
e.x += this.Utils_LayoutPro.paddingLeft;
e.x += this.Property_ItemSize.width / 2;
if (a > 0) {
e.x += a * this.Utils_LayoutPro.spacingX;
e.x += a * this.Property_ItemSize.width;
}
} else {
e.x -= this.Utils_LayoutPro.paddingRight;
e.x -= this.Property_ItemSize.width / 2;
if (a > 0) {
e.x -= a * this.Utils_LayoutPro.spacingX;
e.x -= a * this.Property_ItemSize.width;
}
}
}
}
this.Utils_LayoutPro.node.addChild(e);
this.PointShowTable[t] = e;
return e;
};
e.prototype.Update_ContentSize = function() {
if (this.Utils_LayoutPro.type == cc.Layout.Type.VERTICAL) {
this.Utils_LayoutPro.node.height = this.Utils_LayoutPro.paddingTop + this.Utils_LayoutPro.paddingBottom;
this.Utils_LayoutPro.node.height += (this._Length - 1) * this.Utils_LayoutPro.spacingY;
this.Utils_LayoutPro.node.height += this._Length * this.Property_ItemSize.height;
} else if (this.Utils_LayoutPro.type == cc.Layout.Type.HORIZONTAL) {
this.Utils_LayoutPro.node.width = this.Utils_LayoutPro.paddingLeft + this.Utils_LayoutPro.paddingRight;
this.Utils_LayoutPro.node.width += (this._Length - 1) * this.Utils_LayoutPro.spacingX;
this.Utils_LayoutPro.node.width += this._Length * this.Property_ItemSize.width;
} else if (this.Utils_LayoutPro.type == cc.Layout.Type.GRID) {
var t = Math.floor(this._Length / this.ContinueGropItemCount);
if (this.Utils_LayoutPro.startAxis == cc.Layout.AxisDirection.HORIZONTAL) {
this.Utils_LayoutPro.node.height = this.Utils_LayoutPro.paddingTop + this.Utils_LayoutPro.paddingBottom;
this.Utils_LayoutPro.node.height += (t - 1) * this.Utils_LayoutPro.spacingY;
this.Utils_LayoutPro.node.height += t * this.Property_ItemSize.height;
} else if (this.Utils_LayoutPro.startAxis == cc.Layout.AxisDirection.VERTICAL) {
this.Utils_LayoutPro.node.width = this.Utils_LayoutPro.paddingLeft + this.Utils_LayoutPro.paddingRight;
this.Utils_LayoutPro.node.width += (t - 1) * this.Utils_LayoutPro.spacingX;
this.Utils_LayoutPro.node.width += t * this.Property_ItemSize.width;
}
}
};
e.prototype.Update_ScrollView = function() {
if (this.ShowItemCount > 0) for (var t in this.PointShowTable) if (this.PointShowTable.hasOwnProperty(t)) {
var e = this.PointShowTable[t];
this.ItemUpdateEvent(e, +t);
}
};
__decorate([ d({
type: cc.Prefab,
displayName: "元素预制体"
}) ], e.prototype, "Property_ItemPrefab", void 0);
__decorate([ d({
type: cc.Node,
displayName: "元素节点"
}) ], e.prototype, "Property_ItemNode", void 0);
__decorate([ d({
type: cc.Size,
displayName: "元素宽高"
}) ], e.prototype, "Property_ItemSize", void 0);
__decorate([ d({
type: cc.Integer,
displayName: "向两边预留的个数",
range: [ 0, 100 ]
}) ], e.prototype, "Property_Reservation", void 0);
__decorate([ d({
type: cc.Float,
displayName: "滑动预加载的偏移量",
tooltip: "滑动预加载的偏移量",
range: [ .5, 1 ]
}) ], e.prototype, "Property_SlidingOffset", void 0);
__decorate([ d({
type: cc.Boolean,
displayName: "是否启用对象池",
tooltip: "是否启用对象池"
}) ], e.prototype, "Property_IsNodePool", void 0);
return __decorate([ n ], e);
}(cc.ScrollView);
o.default = c;
cc._RF.pop();
}, {
HBSL_LayoutPro: "HBSL_LayoutPro"
} ],
HBSL_Setting: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "c710707dvVHyr9LWGDLF+kh", "HBSL_Setting");
var a;
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = t("PopupBase");
(function(t) {
t[t.QBKJ = 1] = "QBKJ";
t[t.JXSKQHB = 2] = "JXSKQHB";
t[t.ZDFW = 3] = "ZDFW";
})(a || (a = {}));
var n = cc._decorator, d = n.ccclass;
n.property;
var c = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.CurPoint = a.QBKJ;
return e;
}
e.prototype.init = function(t) {
var e = this;
this.DataMgr = t.DataMgr;
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_Close", this.node), function() {
wAudioMgr.playBtnSound();
e.hide();
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_QBKJ", this.node), function() {
wAudioMgr.playBtnSound();
e.Update_Point(a.QBKJ);
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_XSKQHB", this.node), function() {
wAudioMgr.playBtnSound();
e.Update_Point(a.JXSKQHB);
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_ZDFW", this.node), function() {
wAudioMgr.playBtnSound();
e.Update_Point(a.ZDFW);
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_Controller/Btn_Save", this.node), function() {
wAudioMgr.playBtnSound();
var t = +cc.find("Node_Controller/Input_Start", e.node).getComponent(cc.EditBox).string, o = +cc.find("Node_Controller/Input_End", e.node).getComponent(cc.EditBox).string;
if (e.CurPoint == a.ZDFW) {
if (0 == o) {
wUIManager.showConfirmUI({
content: "上限不能为0，请重新输入！",
okCB: function() {}
});
return;
}
if (o < t) {
wUIManager.showConfirmUI({
content: "数组范围上限不能低于下限，请重新输入！",
okCB: function() {}
});
return;
}
}
e.DataMgr.GameData.ShowRadPackType = e.CurPoint;
e.DataMgr.GameData.ShowRadPackStartGold = t;
e.DataMgr.GameData.ShowRadPackEndGold = o;
e.DataMgr.Game_View.RedPacketPool.Switch_ShowMode();
cc.sys.localStorage.setItem("HBSL_ShowRadPackType", "" + e.DataMgr.GameData.ShowRadPackType);
cc.sys.localStorage.setItem("HBSL_ShowRadPackStartGold", "" + e.DataMgr.GameData.ShowRadPackStartGold);
cc.sys.localStorage.setItem("HBSL_ShowRadPackEndGold", "" + e.DataMgr.GameData.ShowRadPackEndGold);
e.DataMgr.Game_View.RedPacketPool.UpdateText_RedPackSelectionInfo();
e.hide();
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddEditBoxClick(cc.find("Node_Controller/Input_Start", this.node), function(t) {
t.string = isNaN(+t.string) ? "0" : "" + +t.string;
});
this.DataMgr.Game_View.AddEditBoxClick(cc.find("Node_Controller/Input_Start", this.node), function(t) {
t.string = isNaN(+t.string) ? "0" : "" + +t.string;
});
cc.find("Node_Controller/Input_Start", this.node).getComponent(cc.EditBox).string = "" + this.DataMgr.GameData.ShowRadPackStartGold;
cc.find("Node_Controller/Input_End", this.node).getComponent(cc.EditBox).string = "" + this.DataMgr.GameData.ShowRadPackEndGold;
this.Update_Point(this.DataMgr.GameData.ShowRadPackType);
};
e.prototype.onHide = function() {
this.node.destroy();
};
e.prototype.Update_Point = function(t) {
this.CurPoint = t;
cc.find("Node_Controller/Btn_QBKJ/Img_Touch", this.node).active = t == a.QBKJ;
cc.find("Node_Controller/Btn_XSKQHB/Img_Touch", this.node).active = t == a.JXSKQHB;
cc.find("Node_Controller/Btn_ZDFW/Img_Touch", this.node).active = t == a.ZDFW;
cc.find("Node_Controller/Img_BG/Img_Gold", this.node).opacity = t == a.ZDFW ? 255 : 127;
cc.find("Node_Controller/Input_Start", this.node).getComponent(cc.EditBox).enabled = t == a.ZDFW;
cc.find("Node_Controller/Input_End", this.node).getComponent(cc.EditBox).enabled = t == a.ZDFW;
};
e.PointType = a;
return __decorate([ d ], e);
}(i.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
HBSL_View: [ function(t, e, o) {
"use strict";
cc._RF.push(e, "3ae4bGaJ55Odb6q9mrAYoqc", "HBSL_View");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = cc._decorator, i = a.ccclass;
a.property;
var n = function(t) {
__extends(e, t);
function e() {
return null !== t && t.apply(this, arguments) || this;
}
e.prototype.Init = function() {
this.Init_Node();
this.Init_Buttons();
};
e.prototype.Init_Buttons = function() {
var t = this;
this.AddNodeClick(cc.find("Node_UI/Node_Buttons/Btn_Close", this.node), function() {
wAudioMgr.playBtnSound();
t.DataMgr.Game_Controlle.m_quitGame();
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Node_Buttons/Btn_Rule", this.node), function() {
wAudioMgr.playBtnSound();
wViewMgr.openPage({
path: "prefab/Rule",
bundle: "HBSL"
});
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Node_Buttons/Btn_Shopping", this.node), function() {
wAudioMgr.playBtnSound();
wViewMgr.openPage({
path: "Prefab/Recharge"
});
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Btn_Setting", this.node), function() {
wAudioMgr.playBtnSound();
wViewMgr.openPage({
path: "prefab/Setting",
bundle: "HBSL",
data: {
DataMgr: t.DataMgr
}
});
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Node_Buttons/Btn_JL", this.node), function() {
wAudioMgr.playBtnSound();
wViewMgr.openPage({
path: "prefab/Record",
bundle: "HBSL",
data: {
DataMgr: t.DataMgr
}
});
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Node_Buttons/Btn_ZJWJ", this.node), function() {
wAudioMgr.playBtnSound();
wViewMgr.openPage({
path: "prefab/Ranking",
bundle: "HBSL",
data: {
DataMgr: t.DataMgr
}
});
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Node_Buttons/Btn_Auto", this.node), function() {
wAudioMgr.playBtnSound();
t.DataMgr.GameData.IsAutoGetRadPack = !t.DataMgr.GameData.IsAutoGetRadPack;
t.SetUI_GetAutoRadPack(t.DataMgr.GameData.IsAutoGetRadPack);
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Node_Buttons/Btn_Send", this.node), function() {
wAudioMgr.playBtnSound();
wViewMgr.openPage({
path: "prefab/RedPack",
bundle: "HBSL",
data: {
DataMgr: t.DataMgr
}
});
}, [ cc.Node.EventType.TOUCH_END ]);
};
e.prototype.Init_Node = function() {
this.SetText_PrizePool(0);
this.SetUI_GetAutoRadPack(!1);
this.SetUI_SendAutoRadPack(!1);
this.SetText_PlayerGold(0);
for (var t = 1; t <= 3; t++) this.SetUI_RankPlayerList(t, null);
for (t = 1; t <= 4; t++) this.DataMgr.Game_View.SetUI_RightPlayerList(t, null);
cc.find("Node_UI/Node_Player/Sp", this.node).active = !1;
this.RedPacketPool = cc.find("Node_UI/Node_RedPacketPool", this.node).addComponent(d);
this.RedPacketPool.DataMgr = this.DataMgr;
this.RedPacketPool.Init();
};
e.prototype.SetText_PrizePool = function(t) {
cc.find("Node_UI/Node_PrizePool/Lab_Count", this.node).getComponent(cc.Label).string = "" + wUtils.numConvert(t);
};
e.prototype.SetText_PlayerGold = function(t) {
cc.find("Node_UI/Node_Player/Img_Gold/Lab_Gold", this.node).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(t, 2, 2);
};
e.prototype.SetUI_GetAutoRadPack = function(t) {
cc.find("Node_UI/Node_Buttons/Btn_Auto/Img_On", this.node).active = !!t;
cc.find("Node_UI/Node_Buttons/Btn_Auto/Img_OFF", this.node).active = !t;
};
e.prototype.SetUI_SendAutoRadPack = function(t) {
cc.find("Node_UI/Node_Buttons/Btn_Send/Sp_Auto", this.node).active = !!t;
cc.find("Node_UI/Node_Buttons/Btn_Send/Sp_Send", this.node).active = !t;
};
e.prototype.SetUI_PlayerInfo = function(t) {
wUIHelp.setHead(cc.find("Node_UI/Node_Player/Node_Head/Img_Head", this.node), t.UserHead);
cc.find("Node_UI/Node_Player/Lab_Name", this.node).getComponent(cc.Label).string = "" + wUtils.handleNameLen(t.UserName, 10);
};
e.prototype.SetUI_RankPlayerList = function(t, e) {
var o = cc.find("Node_UI/Node_RankPlayer/Node_" + t, this.node);
if (t && o) if (e) {
o.active = !0;
cc.find("Node_Gold/Lab_Gold", o).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(e.Gold, 2, 2);
if (o.UserID != e.UserID) {
wUIHelp.setHead(cc.find("Node_Head/Img_Head", o), e.UserHead);
cc.find("Lab_Name", o).getComponent(cc.Label).string = "" + wUtils.handleNameLen(e.UserName, 4);
}
o.UserID = e.UserID;
} else o.active = !1;
};
e.prototype.SetUI_RightPlayerList = function(t, e) {
var o = cc.find("Node_UI/Node_RedPacketPool/Node_PlayerList/" + t, this.node);
if (t && o) if (e) {
o.active = !0;
wUIHelp.setHead(cc.find("Node_Head/Img_Head", o), e.UserHead);
cc.find("Lab_Name", o).getComponent(cc.Label).string = "" + wUtils.handleNameLen(e.UserName, 4);
cc.find("Sp_Action", o).active = !1;
} else o.active = !1;
};
e.prototype.Play_PlayerAddScore = function() {
var t = this;
cc.find("Node_UI/Node_Player/Sp", this.node).active = !0;
wUIHelp.playSpine(cc.find("Node_UI/Node_Player/Sp", this.node), "animation", function() {
cc.find("Node_UI/Node_Player/Sp", t.node).active = !1;
});
};
e.prototype.GetNodeWorldPos = function(t) {
var e = wUtils.local_world__POS(t);
e.x -= cc.winSize.width / 2;
e.y -= cc.winSize.height / 2;
return e;
};
e.prototype.AddSpineEvent = function(t, e) {
cc.isValid(t) && t.getComponent(sp.Skeleton).setCompleteListener(function(o) {
var a = o.animation ? o.animation.name : "";
e(t, a);
});
};
e.prototype.AddNodeClick = function(t, e, o) {
var a = t.active;
t.active = !1;
if (o) for (var i = function(a) {
switch (o[a]) {
case cc.Node.EventType.TOUCH_START:
case cc.Node.EventType.TOUCH_MOVE:
case cc.Node.EventType.TOUCH_END:
case cc.Node.EventType.TOUCH_CANCEL:
t.on("" + o[a], function(t) {
e(t, o[a]);
});
}
}, n = 0, d = o.length; n < d; n++) i(n); else {
t.on(cc.Node.EventType.TOUCH_START, function(t) {
e(t, cc.Node.EventType.TOUCH_START);
});
t.on(cc.Node.EventType.TOUCH_MOVE, function(t) {
e(t, cc.Node.EventType.TOUCH_MOVE);
});
t.on(cc.Node.EventType.TOUCH_END, function(t) {
e(t, cc.Node.EventType.TOUCH_END);
});
t.on(cc.Node.EventType.TOUCH_CANCEL, function(t) {
e(t, cc.Node.EventType.TOUCH_CANCEL);
});
}
t.active = a;
};
e.prototype.NumberLerp = function(t, e, o) {
return o <= 0 ? t : o >= 1 ? e : e * o + t * (1 - o);
};
e.prototype.GetFormatString = function(t, e) {
var o = new Date();
"number" == typeof e && o.setTime(e);
var a = t, i = null;
a.indexOf("AAAA") >= 0 && (a = a.replace("AAAA", "" + o.getFullYear()));
if (a.indexOf("bb") >= 0) {
i = o.getMonth() + 1;
a = a.replace("bb", "" + (i < 10 ? "0" + i : i));
}
a.indexOf("BB") >= 0 && (a = a.replace("BB", "" + (o.getMonth() + 1)));
if (a.indexOf("cc") >= 0) {
i = o.getDate();
a = a.replace("cc", "" + (i < 10 ? "0" + i : i));
}
a.indexOf("CC") >= 0 && (a = a.replace("CC", "" + o.getDate()));
a.indexOf("DDNum") >= 0 && (a = a.replace("DDNum", "" + o.getDay()));
a.indexOf("DDString") >= 0 && (a = a.replace("DDString", "" + {
1: "一",
2: "二",
3: "三",
4: "四",
5: "五",
6: "六",
7: "天"
}[o.getDay()]));
if (a.indexOf("ee") >= 0) {
i = o.getHours();
a = a.replace("ee", "" + (i < 10 ? "0" + i : i));
}
if (a.indexOf("EE") >= 0) {
i = o.getHours();
a = a.replace("EE", "" + i);
}
if (a.indexOf("ff") >= 0) {
i = o.getMinutes();
a = a.replace("ff", "" + (i < 10 ? "0" + i : i));
}
if (a.indexOf("FF") >= 0) {
i = o.getMinutes();
a = a.replace("FF", "" + i);
}
if (a.indexOf("gg") >= 0) {
i = o.getSeconds();
a = a.replace("gg", "" + (i < 10 ? "0" + i : i));
}
if (a.indexOf("GG") >= 0) {
i = o.getSeconds();
a = a.replace("GG", "" + i);
}
if (a.indexOf("hh") >= 0) {
var n = i = o.getMilliseconds();
n = i < 10 ? "00" + i : i < 100 ? "0" + i : i;
a = a.replace("hh", "" + n);
}
a.indexOf("HH") >= 0 && (a = a.replace("HH", "" + o.getMilliseconds()));
return a;
};
e.prototype.AddEditBoxClick = function(t, e) {
t.on("editing-did-ended", function(t) {
e(t);
});
};
return __decorate([ i ], e);
}(cc.Component);
o.default = n;
var d = function(t) {
__extends(e, t);
function e() {
var e = null !== t && t.apply(this, arguments) || this;
e.ShowRedPackCount = 0;
e.FastRedPack = {};
return e;
}
e.prototype.Init = function() {
this.IsAction = !1;
this.RedPackList = [];
this.RemoveRedPackList = [];
this.BufferPackList = [];
this.Init_View();
};
e.prototype.Init_View = function() {
cc.find("Img_UpCountRed", this.node).active = !1;
cc.find("ScrollView/Node_Copy", this.node).active = !1;
cc.find("Node_Action/Node_HLD", this.node).active = !1;
cc.find("Node_Action/Node_Boom", this.node).active = !1;
cc.find("Node_Action/Node_Gold_L", this.node).active = !1;
cc.find("Node_Action/Node_Gold_W", this.node).active = !1;
cc.find("Sp_Action", this.node).active = !1;
this.UpdateText_RedPackSelectionInfo();
};
e.prototype.Close_View = function() {
cc.find("ScrollView/Node_View/Node_Content", this.node).removeAllChildren();
};
e.prototype.Check_RedPackQW = function(t) {
for (var e = null, o = 0, a = this.BufferPackList.length; o < a; o++) {
var i = this.BufferPackList[o];
if (i.ID == t) {
e = i;
break;
}
}
return !e;
};
e.prototype.Check_RedPackSelfQ = function(t) {
for (var e = null, o = 0, a = this.BufferPackList.length; o < a; o++) {
var i = this.BufferPackList[o];
if (i.ID == t) {
e = i;
break;
}
}
return !!e.IsSelfGet;
};
e.prototype.Get_SendRedpackPlayerData = function(t) {
for (var e = 0, o = this.BufferPackList.length; e < o; e++) {
var a = this.BufferPackList[e];
if (a.ID == t) return a;
}
return null;
};
e.prototype.Add_RadPackBufferList = function(t) {
this.BufferPackList.push(t);
};
e.prototype.Set_GetRedPack = function(t) {
for (var e = 0, o = this.BufferPackList.length; e < o; e++) {
var a = this.BufferPackList[e];
if (a.ID == t) {
a.IsSelfGet = !0;
return;
}
}
};
e.prototype.Remove_RadPackBufferList = function(t) {
for (var e = [], o = 0, a = this.BufferPackList.length; o < a; o++) {
var i = this.BufferPackList[o];
i.IsSelfGet;
i.ID != t && e.push(i);
}
this.BufferPackList = e;
};
e.prototype.Play_HLD = function(t, e, o) {
var a = this, i = cc.find("Node_Action", this.node), n = t.parent.convertToWorldSpaceAR(t.position);
n.x -= cc.winSize.width / 2;
n.y -= cc.winSize.height / 2;
if (!(n.y < -350 || n.y > 250)) {
var d = cc.instantiate(cc.find("Node_Action/Node_HLD", this.node));
d.active = !0;
i.addChild(d);
d.setPosition(n);
var c = e.parent.convertToWorldSpaceAR(e.position);
c.x -= cc.winSize.width / 2;
c.y -= cc.winSize.height / 2;
d.runAction(cc.sequence(cc.delayTime(o), cc.moveTo(.3, cc.v2(c)), cc.callFunc(function() {
if (cc.find("Sp_Action", e)) {
cc.find("Sp_Action", e).active = !0;
wUIHelp.playSpine(cc.find("Sp_Action", e), "animation", function() {
cc.find("Sp_Action", e).active = !1;
});
} else {
cc.find("Sp_Action", a.node).active = !0;
wUIHelp.playSpine(cc.find("Sp_Action", a.node), "animation", function() {
cc.find("Sp_Action", a.node).active = !1;
});
}
}), cc.removeSelf()));
}
};
e.prototype.Play_Boom = function(t, e, o) {
var a = this, i = cc.find("Node_Action", this.node), n = t.parent.convertToWorldSpaceAR(t.position);
n.x -= cc.winSize.width / 2;
n.y -= cc.winSize.height / 2;
if (!(n.y < -350 || n.y > 250)) {
var d = cc.instantiate(cc.find("Node_Action/Node_Boom", this.node));
d.active = !0;
i.addChild(d);
d.setPosition(n);
var c = e.parent.convertToWorldSpaceAR(e.position);
c.x -= cc.winSize.width / 2;
c.y -= cc.winSize.height / 2;
d.runAction(cc.sequence(cc.delayTime(o), cc.moveTo(.3, cc.v2(c)), cc.callFunc(function() {
if (cc.find("Sp_Action", e)) {
cc.find("Sp_Action", e).active = !0;
wUIHelp.playSpine(cc.find("Sp_Action", e), "animation", function() {
cc.find("Sp_Action", e).active = !1;
});
} else {
cc.find("Sp_Action", a.node).active = !0;
wUIHelp.playSpine(cc.find("Sp_Action", a.node), "animation", function() {
cc.find("Sp_Action", a.node).active = !1;
});
}
}), cc.removeSelf()));
}
};
e.prototype.FastGetRedpack = function(t, e) {
var o = cc.find("ScrollView/Node_View/Node_Content", this.node).getChildByName("" + t);
if (o) {
o.Data;
var a = cc.find("Node_Action", this.node), i = null;
(i = e > 0 ? cc.instantiate(cc.find("Node_Action/Node_Gold_W", this.node)) : cc.instantiate(cc.find("Node_Action/Node_Gold_L", this.node))).active = !0;
a.addChild(i);
i.getComponent(cc.Label).string = (e > 0 ? "+" : "") + e;
var n = cc.find("Node_RedPack/Img_Open", o).parent.convertToWorldSpaceAR(cc.find("Node_RedPack/Img_Open", o).position);
n.x -= cc.winSize.width / 2;
n.y -= cc.winSize.height / 2;
n.y -= 20;
cc.find("Node_RedPack/Img_Hide", o).active = !1;
cc.find("Node_RedPack/Img_Open", o).active = !0;
i.setPosition(n);
i.runAction(cc.sequence(cc.moveBy(.5, cc.v2(0, 50)), cc.callFunc(function() {
wAudioMgr.playSound("sound/gold", "HBSL");
e > 0 ? wAudioMgr.playSound("sound/win", "HBSL") : wAudioMgr.playSound("sound/lo", "HBSL");
}), cc.moveTo(.5, cc.v2(cc.find("Node_GoldPos", this.node).position)).easing(cc.easeIn(2)), cc.moveBy(.5, cc.v2(0, 50)), cc.removeSelf()));
if (e > 0) for (var d = 1; d <= 3; d++) this.Play_HLD(cc.find("Node_RedPack/Img_Open", o), cc.find("Node_GoldPos", this.node), .5 + .1 * d); else this.Play_Boom(cc.find("Node_RedPack/Img_Open", o), cc.find("Node_GoldPos", this.node), 0);
}
};
e.prototype.Check_Create = function() {
if (!this.IsAction && this.RedPackList.length > 0) {
for (var t = {}, e = 0, o = this.RedPackList; e < o.length; e++) {
var a = o[e];
t[a.ID] = a;
}
for (var i in t) if (Object.prototype.hasOwnProperty.call(t, i)) {
var n = t[i];
this.Create_RedPack(n);
}
this.Play_UpRedPackShow(Object.keys(t).length);
this.RedPackList = [];
}
};
e.prototype.Create_RedPack = function(t) {
var e = this, o = cc.find("ScrollView/Node_View/Node_Content", this.node);
if (!o.getChildByName("" + t.ID)) {
t = this.DataMgr.Game_View.RedPacketPool.Get_SendRedpackPlayerData(t.ID) || t;
var a = cc.instantiate(cc.find("ScrollView/Node_Copy", this.node));
o.addChild(a);
a.Data = t;
a.active = !0;
a.name = "" + t.ID;
wUIHelp.setHead(cc.find("Node_Head/Img_Head", a), t.SendUserHeadPath);
cc.find("Node_RedPack/Lab_Name", a).getComponent(cc.Label).string = "" + t.SendUserName;
cc.find("Node_RedPack/Lab_Info", a).getComponent(cc.Label).string = t.RadCount + "包/" + t.Probability + "倍/雷点" + t.RadBoomCount;
cc.find("Node_RedPack/Lab_Gold", a).getComponent(cc.Label).string = t.RadGold + "欢乐豆";
cc.find("Node_RedPack/Img_Open", a).active = t.IsSelfGet;
cc.find("Node_RedPack/Img_Hide", a).active = !t.IsSelfGet;
this.DataMgr.Game_View.AddNodeClick(a, function() {
wAudioMgr.playBtnSound();
if (e.DataMgr.GameData.IsAutoGetRadPack) wUIManager.showTips("自动抢包中..."); else {
for (var o = null, a = 0, i = e.BufferPackList.length; a < i; a++) {
var n = e.BufferPackList[a];
if (n.ID == t.ID) {
o = n;
break;
}
}
o ? o.IsSelfGet ? wUIManager.showTips("自己已经抢了红包") : wViewMgr.openPage({
path: "prefab/RedPackInfo",
bundle: "HBSL",
data: {
DataMgr: e.DataMgr,
RedPackData: t
}
}) : wUIManager.showTips("红包已经领完了！");
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.Game_View.AddNodeClick(cc.find("Node_RedPack/Btn_KS", a), function() {
wAudioMgr.playBtnSound();
if (e.DataMgr.GameData.IsAutoGetRadPack) wUIManager.showTips("自动抢包中..."); else {
for (var o = null, a = 0, i = e.BufferPackList.length; a < i; a++) {
var n = e.BufferPackList[a];
if (n.ID == t.ID) {
o = n;
break;
}
}
if (o) if (o.IsSelfGet) wUIManager.showTips("自己已经抢了红包"); else if (e.DataMgr.Check_GoldMeetJetton(t.Probability * t.RadGold)) {
wNetWork.send("Msg_HBSL_Act_Qiang", {
id: t.ID
}, !0);
e.DataMgr.Game_View.RedPacketPool.FastRedPack[t.ID] = !0;
} else wUIManager.showTips("欢乐豆不足"); else wUIManager.showTips("红包已经被抢完！");
}
}, [ cc.Node.EventType.TOUCH_END ]);
a.y = -cc.find("ScrollView/Node_Copy", this.node).height / 2;
a.y -= this.ShowRedPackCount * cc.find("ScrollView/Node_Copy", this.node).height;
a.y -= 20 * this.ShowRedPackCount;
this.ShowRedPackCount++;
this.Update_RootSize();
var i = this.DataMgr.GameData;
if (i.IsAutoGetRadPack) {
var n = !0;
1 == i.ShowRadPackType ? n = (n = n && this.DataMgr.Check_GoldMeetJetton(t.Probability * t.RadGold)) && !this.DataMgr.Game_View.RedPacketPool.Check_RedPackQW(t.ID) : 2 == i.ShowRadPackType ? n = (n = n && this.DataMgr.Check_GoldMeetJetton(t.Probability * t.RadGold)) && !this.DataMgr.Game_View.RedPacketPool.Check_RedPackQW(t.ID) : 3 == i.ShowRadPackType && (n = t.RadGold >= 1e4 * this.DataMgr.GameData.ShowRadPackStartGold && t.RadGold <= 1e4 * this.DataMgr.GameData.ShowRadPackEndGold && (n = n && this.DataMgr.Check_GoldMeetJetton(t.Probability * t.RadGold)) && !this.DataMgr.Game_View.RedPacketPool.Check_RedPackQW(t.ID));
n && wNetWork.send("Msg_HBSL_Act_Qiang", {
id: t.ID
}, !1);
}
}
};
e.prototype.Update_RedPack = function(t) {
var e = this.DataMgr.Game_View.RedPacketPool.Get_SendRedpackPlayerData(t);
if (e) {
var o = cc.find("ScrollView/Node_View/Node_Content", this.node).getChildByName(t);
if (o) {
o.Data.IsSelfGet = e.IsSelfGet;
cc.find("Node_RedPack/Img_Open", o).active = e.IsSelfGet;
cc.find("Node_RedPack/Img_Hide", o).active = !e.IsSelfGet;
}
}
};
e.prototype.Delete_RedPack = function() {
for (var t = this, e = {}, o = 0, a = this.RemoveRedPackList; o < a.length; o++) e[a[o]] = !0;
this.RemoveRedPackList = [];
var i = Object.keys(e), n = cc.find("ScrollView/Node_View/Node_Content", this.node), d = cc.find("ScrollView/Node_Copy", this.node).height + 20;
this.Check_Create();
this.IsAction = !0;
n.stopAllActions();
n.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
t.IsAction = !1;
t.Delete_RedPack();
})));
for (var c = [], r = function(e) {
for (var o = !1, a = null, r = 0, l = n.children.length; r < l; r++) {
var _ = (p = n.children[r]).Data;
o && p.runAction(cc.sequence(cc.delayTime(.5), cc.moveBy(.2, cc.v2(0, d))));
if (_.ID == i[e]) {
a = p;
o = !0;
}
}
if (a) {
c.push(a.Data.ID);
s.ShowRedPackCount--;
a.opacity = 127;
a.runAction(cc.sequence(cc.delayTime(.5), cc.spawn(cc.scaleTo(.2, 0), cc.moveBy(.2, cc.v2(0, a.height - 20))), cc.callFunc(function() {
a.destroy();
t.Update_RootSize();
})));
if (a.UserData) {
for (var h = 1; h <= 4; h++) s.DataMgr.Game_View.SetUI_RightPlayerList(h, null);
var u = 1;
for (var f in a.UserData) if (a.UserData.hasOwnProperty(f)) {
var p = a.UserData[f];
s.DataMgr.Game_View.SetUI_RightPlayerList(u++, {
UserName: "" + p.nickname,
Gold: +p.score,
UserID: "" + f,
UserHead: +p.headimgurl
});
}
for (var g = 0, D = cc.find("Node_PlayerList", s.node).children; g < D.length; g++) {
var P = D[g];
P.active = !0;
if (P.active) for (var S = 1; S <= 5; S++) s.Play_HLD(a, P, .1 * S);
}
}
}
}, s = this, l = 0, _ = i.length; l < _; l++) r(l);
this.Update_RootSize();
};
e.prototype.Add_DelayRedPack = function(t, e) {
2 == this.DataMgr.GameData.ShowRadPackType ? this.DataMgr.GameData.PlayerUser.Gold >= t.RadGold * t.Probability && this.RedPackList.push(t) : 3 == this.DataMgr.GameData.ShowRadPackType ? t.RadGold >= 1e4 * this.DataMgr.GameData.ShowRadPackStartGold && t.RadGold <= 1e4 * this.DataMgr.GameData.ShowRadPackEndGold && this.RedPackList.push(t) : this.RedPackList.push(t);
e && this.Check_Create();
};
e.prototype.Remove_DelayRedPack = function(t, e) {
this.RemoveRedPackList.push(t);
var o = cc.find("ScrollView/Node_View/Node_Content/" + t, this.node);
o && (o.UserData = e);
this.IsAction || this.Delete_RedPack();
};
e.prototype.Switch_ShowMode = function() {
var t = cc.find("ScrollView/Node_View/Node_Content", this.node);
if (1 == this.DataMgr.GameData.ShowRadPackType) {
for (var e = 0, o = this.BufferPackList; e < o.length; e++) {
var a = o[e];
this.Add_DelayRedPack(a, !1);
}
this.Check_Create();
} else if (2 == this.DataMgr.GameData.ShowRadPackType) {
this.RedPackList = [];
for (var i = 0, n = this.BufferPackList; i < n.length; i++) {
a = n[i];
this.DataMgr.GameData.PlayerUser.Gold >= a.RadGold * a.Probability && this.Add_DelayRedPack(a, !1);
}
this.Check_Create();
for (var d = 0, c = t.children; d < c.length; d++) {
var r = (a = c[d]).Data;
this.DataMgr.GameData.PlayerUser.Gold < r.RadGold * r.Probability && this.Remove_DelayRedPack(r.ID, null);
}
} else if (3 == this.DataMgr.GameData.ShowRadPackType) {
this.RedPackList = [];
for (var s = 0, l = this.BufferPackList; s < l.length; s++) (a = l[s]).RadGold >= 1e4 * this.DataMgr.GameData.ShowRadPackStartGold && a.RadGold <= 1e4 * this.DataMgr.GameData.ShowRadPackEndGold && this.Add_DelayRedPack(a, !1);
this.Check_Create();
for (var _ = 0, h = t.children; _ < h.length; _++) (r = (a = h[_]).Data).RadGold >= 1e4 * this.DataMgr.GameData.ShowRadPackStartGold && r.RadGold <= 1e4 * this.DataMgr.GameData.ShowRadPackEndGold || this.Remove_DelayRedPack(r.ID, null);
}
};
e.prototype.Update_RootSize = function() {
cc.find("ScrollView/Node_View/Node_Content", this.node).height = 20 * (this.ShowRedPackCount - 1) + this.ShowRedPackCount * cc.find("ScrollView/Node_Copy", this.node).height;
};
e.prototype.UpdateText_RedPackSelectionInfo = function() {
switch (this.DataMgr.GameData.ShowRadPackType) {
case 1:
cc.find("Lab_Info", this.node).getComponent(cc.Label).string = "全部可见";
break;

case 2:
cc.find("Lab_Info", this.node).getComponent(cc.Label).string = "仅显示可抢红包";
break;

case 3:
cc.find("Lab_Info", this.node).getComponent(cc.Label).string = this.DataMgr.GameData.ShowRadPackStartGold + "万 - " + this.DataMgr.GameData.ShowRadPackEndGold + "万";
}
};
e.prototype.Play_UpRedPackShow = function(t) {
cc.find("Img_UpCountRed", this.node).active = !0;
cc.find("Img_UpCountRed/Lab_Count", this.node).getComponent(cc.RichText).string = "<color=#ffffff>新增</c><color=#fac300>" + t + "</color><color=#ffffff>个红包</c>";
cc.find("Img_UpCountRed", this.node).opacity = 0;
cc.find("Img_UpCountRed", this.node).stopAllActions();
cc.find("Img_UpCountRed", this.node).runAction(cc.sequence(cc.fadeIn(.2), cc.delayTime(1), cc.fadeOut(.2)));
};
return e;
}(cc.Component);
cc._RF.pop();
}, {} ]
}, {}, [ "HBSL_Controlle", "HBSL_DataMgr", "HBSL_LayoutPro", "HBSL_Load", "HBSL_PoolItemTool", "HBSL_Ranking", "HBSL_Record", "HBSL_RedPack", "HBSL_RedPackInfo", "HBSL_ScrollViewPro", "HBSL_Setting", "HBSL_View" ]);