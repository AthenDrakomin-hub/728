window.__require = function e(t, o, n) {
function a(r, c) {
if (!o[r]) {
if (!t[r]) {
var d = r.split("/");
d = d[d.length - 1];
if (!t[d]) {
var s = "function" == typeof __require && __require;
if (!c && s) return s(d, !0);
if (i) return i(d, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = d;
}
var l = o[r] = {
exports: {}
};
t[r][0].call(l.exports, function(e) {
return a(t[r][1][e] || e);
}, l, l.exports, e, t, o, n);
}
return o[r].exports;
}
for (var i = "function" == typeof __require && __require, r = 0; r < n.length; r++) a(n[r]);
return a;
}({
FQZS_Controlle: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "41f8aIUPdZIXq+23CS+oWKE", "FQZS_Controlle");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("MultiBase"), a = e("FQZS_DataMgr"), i = e("FQZS_View"), r = cc._decorator, c = r.ccclass;
r.property;
var d = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.m_roomInfo = function() {};
t.prototype.m_upGameGold = function() {
var e = +wGameData.getKey("gold");
if (this.DataMgr.GameData.PlayerUser) {
this.DataMgr.GameData.PlayerUser.Gold = e;
this.DataMgr.Game_View.SetText_PlayerGold(this.DataMgr.GameData.PlayerUser.Gold);
}
};
t.prototype.m_NetWorkState = function() {};
t.prototype.onLoad = function() {
this.DataMgr = new a.default();
this.DataMgr.Game_Controlle = this;
this.DataMgr.Game_View = this.node.getComponent(i.default);
this.DataMgr.Init();
this.DataMgr.GameData.MaxWheelDiscCount = cc.find("Node_UI/Node_WheelDisc", this.node).childrenCount;
this.DataMgr.Game_View.DataMgr = this.DataMgr;
this.DataMgr.Game_View.Init();
};
t.prototype.start = function() {
this.Monitor_NetworkEvent();
this.m_setBankBtn(!1);
this.m_init();
};
t.prototype.onDestroy = function() {
var e;
null === (e = this.DataMgr) || void 0 === e || e.Close();
};
t.prototype.Monitor_NetworkEvent = function() {
var e = this;
wGEvent.on("Msg_FQZS_RoomInfo", function(t) {
if (1 == t.status) {
console.error("初始化房间", t);
e.DataMgr.Game_View.Init_Game();
var o = e.DataMgr.GameData;
o.GameType = +t.data.stage;
o.PlayerCount = +t.data.allnum;
o.SelfUserID = "" + t.data.player.uid;
o.AllJettonCount = 0;
o.PreparePutList = [];
o.BetOnRegionScore = {};
o.MyBetOnRegionScore = {};
for (var n = 1; n <= 11; n++) {
o.BetOnRegionScore[n] = 0;
o.MyBetOnRegionScore[n] = 0;
}
if (t.data.player) {
o.PlayerUser = {};
o.PlayerUser.Gold = +t.data.player.gold;
o.PlayerUser.UserID = "" + t.data.player.uid;
o.PlayerUser.UserName = "" + t.data.player.name;
o.PlayerUser.UserSex = +t.data.banker.sex;
o.PlayerUser.UserHead = +t.data.banker.headimgurl || wGameData.getKey("headimgurl");
e.DataMgr.Game_View.SetUI_Player(o.PlayerUser);
e.DataMgr.Game_View.SetText_PlayerGold(o.PlayerUser.Gold);
}
o.BankerUser = {};
if (t.data.banker) {
o.BankerUser.UserID = "" + t.data.banker.uid;
o.BankerUser.UserName = "" + t.data.banker.username;
o.BankerUser.Gold = +t.data.banker.gold;
o.BankerUser.UserSex = +t.data.banker.sex;
o.BankerUser.UserHead = +t.data.banker.headimgurl;
o.BankerUser.Circle = +t.data.banker.circle;
if (o.BankerUser.UserID == o.PlayerUser.UserID) {
o.BankerUser.UserName = o.PlayerUser.UserName;
o.BankerUser.UserHead = o.PlayerUser.UserHead;
}
e.DataMgr.Game_View.SetUI_Banker(o.BankerUser);
e.DataMgr.Game_View.SetText_BankerGold(o.BankerUser.Gold);
} else o.BankerUser.Circle = 0;
e.DataMgr.Game_View.SetText_ContinueBankerCount(o.BankerUser.Circle);
o.UpBankerList = t.data.bankerlist;
e.DataMgr.Game_View.UpdateButton_Banker();
if (t.data.mybet && Object.keys(t.data.mybet).length > 0) for (var a in t.data.mybet) if (t.data.mybet.hasOwnProperty(a)) {
var i = t.data.mybet[a];
n = 0;
for (var r = (c = e.DataMgr.MaxScoreSplit(+i)).length; n < r; n++) {
o.IsPrepare = !0;
o.PreparePutList.push({
Region: e.DataMgr.GetServerIconType(+a),
Count: c[n]
});
}
}
e.DataMgr.Game_View.UpdateButton_XYType();
if (t.data.allbet && Object.keys(t.data.allbet).length > 0) for (var a in t.data.allbet) if (t.data.allbet.hasOwnProperty(a)) {
i = t.data.allbet[a];
if (e.DataMgr.GetServerIconType(+a) && 0 != i) {
o.AllJettonCount += i;
n = 0;
for (r = (c = e.DataMgr.MaxScoreSplit(+i)).length; n < r; n++) e.DataMgr.Game_View.SetUI_AddDesktopJettonIcon({
IsMy: !1,
Jetton: c[n],
Region: e.DataMgr.GetServerIconType(+a)
});
o.BetOnRegionScore[e.DataMgr.GetServerIconType(+a)] += i;
}
}
if (t.data.mybet && Object.keys(t.data.mybet).length > 0) for (var a in t.data.mybet) if (t.data.mybet.hasOwnProperty(a)) {
i = t.data.mybet[a];
if (e.DataMgr.GetServerIconType(+a) && 0 != i) {
o.AllJettonCount += i;
var c;
n = 0;
for (r = (c = e.DataMgr.MaxScoreSplit(+i)).length; n < r; n++) e.DataMgr.Game_View.SetUI_AddDesktopJettonIcon({
IsMy: !0,
Jetton: c[n],
Region: e.DataMgr.GetServerIconType(+a)
});
o.BetOnRegionScore[e.DataMgr.GetServerIconType(+a)] += i;
o.MyBetOnRegionScore[e.DataMgr.GetServerIconType(+a)] += i;
}
}
o.BankerUser.DelayBankerCount = t.data.bankerlist.length;
e.DataMgr.Game_View.SetText_DelayUpBankerCount(o.BankerUser.DelayBankerCount);
o.BufferHistoryList = [];
n = 0;
for (r = t.data.history.length; n < r; n++) o.BufferHistoryList[n] = e.DataMgr.GetServerIconType(t.data.history[n]);
e.DataMgr.Game_View.SetUI_HistoryList(o.BufferHistoryList);
e.DataMgr.Game_View.Play_DownTime(o.GameType, +t.data.time);
e.DataMgr.Game_View.SetText_AllJetton(o.AllJettonCount);
e.DataMgr.Game_View.UpdateButton_DownJetton(e.DataMgr.Get_ChipButtonUp());
} else wLog.e("初始化房间");
}, this);
wGEvent.on("Msg_FQZS_PlayerAct", function(t) {
if (1 == t.status) {
console.error("加入玩家", t);
e.DataMgr.GameData.PlayerCount++;
} else wLog.e("加入玩家");
}, this);
wGEvent.on("Msg_FQZS_Out", function(t) {
if (1 == t.status) {
console.error("退出玩家", t);
e.DataMgr.GameData.PlayerCount--;
} else wLog.e("退出玩家");
}, this);
wGEvent.on("Msg_FQZS_StageBet", function(t) {
if (1 == t.status) {
console.error("下注阶段", t);
e.DataMgr.Game_View.Play_TipsAction(1);
e.DataMgr.Game_View.Init_Game();
var o = e.DataMgr.GameData;
o.GameType = 1;
o.IsPrepare = !0;
e.DataMgr.Game_View.SetText_BankerGold(o.BankerUser.Gold);
e.DataMgr.Game_View.SetText_PlayerGold(o.PlayerUser.Gold);
e.DataMgr.Game_View.UpdateButton_XYType();
o.AllJettonCount = 0;
e.DataMgr.Game_View.Play_DownTime(o.GameType, +t.data.time);
o.CurChipCount = 0;
e.DataMgr.Game_View.UpdateButton_DownJetton(e.DataMgr.Get_ChipButtonUp());
o.BetOnRegionScore = {};
o.MyBetOnRegionScore = {};
for (var n = 1; n <= 11; n++) {
o.BetOnRegionScore[n] = 0;
o.MyBetOnRegionScore[n] = 0;
}
o.BankerUser.Circle++;
e.DataMgr.Game_View.SetText_ContinueBankerCount(o.BankerUser.Circle);
} else wLog.e("下注阶段");
}, this);
wGEvent.on("Msg_FQZS_ActBet", function(t) {
if (1 == t.status) {
console.error("玩家下注", t);
var o = e.DataMgr.GameData, n = e.DataMgr.GetServerIconType(+t.data.region);
o.AllJettonCount += +t.data.gold;
e.DataMgr.Game_View.SetText_AllJetton(o.AllJettonCount);
if (t.data.uid == o.SelfUserID) {
if (o.IsPrepare) {
o.IsPrepare = !1;
o.PreparePutList = [];
}
o.PreparePutList.push({
Region: e.DataMgr.GetServerIconType(+t.data.region),
Count: +t.data.gold
});
e.DataMgr.Game_View.UpdateButton_XYType();
}
for (var a = t.data.uid == o.SelfUserID ? e.DataMgr.MaxScoreSplit(+t.data.gold) : e.DataMgr.ScoreSplit(+t.data.gold), i = 2 / a.length, r = 0, c = a.length; r < c; r++) e.DataMgr.Game_View.Play_RunJetton({
Region: n,
Jetton: a[r],
IsMy: t.data.uid == o.SelfUserID,
DelTime: t.data.uid == o.SelfUserID ? 0 : r * i
});
if (t.data.uid == o.SelfUserID) {
o.PlayerUser.Gold -= +t.data.gold;
e.DataMgr.Game_View.SetText_PlayerGold(o.PlayerUser.Gold);
e.DataMgr.Game_View.UpdateButton_DownJetton(e.DataMgr.Get_ChipButtonUp());
o.MyBetOnRegionScore[n] += +t.data.gold;
}
o.BetOnRegionScore[n] += +t.data.gold;
} else wLog.e("玩家下注");
}, this);
wGEvent.on("Msg_FQZS_SysActBet", function(t) {
if (1 == t.status) {
console.error("同步下注信息", t);
var o = e.DataMgr.GameData;
o.AllJettonCount = 0;
for (var n in t.data.bets) if (t.data.bets.hasOwnProperty(n)) {
var a = +t.data.bets[n];
if (e.DataMgr.GetServerIconType(+n) && o.BetOnRegionScore.hasOwnProperty(e.DataMgr.GetServerIconType(+n))) {
var i = a - o.BetOnRegionScore[e.DataMgr.GetServerIconType(+n)];
o.AllJettonCount += a;
var r = e.DataMgr.ScoreSplit(i);
o.BetOnRegionScore[e.DataMgr.GetServerIconType(+n)] = +a;
for (var c = 2 / r.length, d = 0, s = r.length; d < s; d++) e.DataMgr.Game_View.Play_RunJetton({
Region: e.DataMgr.GetServerIconType(+n),
Jetton: r[d],
IsMy: !1,
DelTime: d * c
});
}
}
e.DataMgr.Game_View.SetText_AllJetton(o.AllJettonCount);
} else wLog.e("同步下注信息");
}, this);
wGEvent.on("Msg_FQZS_StageEnd", function(t) {
if (1 == t.status) {
console.error("结算阶段", t);
var o = e.DataMgr.GameData, n = {
ServerResult: +t.data.result,
PlayerUserGold: 0,
BankerUserGold: 0,
PlayersGold: 0,
IsReconnect: 2 == o.GameType
};
if (t.data.usergold && Object.keys(t.data.usergold).length > 0) for (var a in t.data.usergold) if (t.data.usergold.hasOwnProperty(a)) {
var i = t.data.usergold[a];
a == o.BankerUser.UserID && (o.BankerUser.Gold = +i);
a == o.PlayerUser.UserID && (o.PlayerUser.Gold = +i);
}
if (t.data.userwin && Object.keys(t.data.userwin).length > 0) for (var a in t.data.userwin) if (t.data.userwin.hasOwnProperty(a)) {
i = t.data.userwin[a];
a == o.BankerUser.UserID ? n.BankerUserGold = +i : a == o.PlayerUser.UserID ? n.PlayerUserGold = +i : +i > 0 && (n.PlayersGold += +i);
}
o.GameType = 2;
n.IsReconnect ? e.Start_GameOver(n) : e.DataMgr.Game_View.Play_TipsAction(2, function() {
e.Start_GameOver(n);
});
e.DataMgr.Game_View.UpdateButton_DownJetton(e.DataMgr.Get_ChipButtonUp());
e.DataMgr.Game_View.Play_DownTime(o.GameType, +t.data.time);
} else wLog.e("结算阶段");
}, this);
wGEvent.on("Msg_FQZS_ToBanker", function(t) {
if (1 == t.status) {
console.error("玩家上庄", t);
var o = e.DataMgr.GameData;
o.BankerUser.DelayBankerCount = t.data.list.length;
e.DataMgr.Game_View.SetText_UpBankerCount(o.BankerUser.DelayBankerCount);
var n = -1 != e.DataMgr.GameData.UpBankerList.indexOf(+e.DataMgr.GameData.PlayerUser.UserID);
o.UpBankerList = t.data.list;
var a = -1 != e.DataMgr.GameData.UpBankerList.indexOf(+e.DataMgr.GameData.PlayerUser.UserID);
!n && a ? wUIManager.showTips("上庄申请成功") : n && !a && wUIManager.showTips("下庄申请成功");
e.DataMgr.Game_View.UpdateButton_Banker();
} else wLog.e("玩家上庄");
}, this);
wGEvent.on("Msg_FQZS_QiangBanker", function(t) {
if (1 == t.status) {
console.error("玩家抢庄", t);
var o = e.DataMgr.GameData;
o.BankerUser.DelayBankerCount = t.data.list.length;
e.DataMgr.Game_View.SetText_UpBankerCount(o.BankerUser.DelayBankerCount);
o.UpBankerList = t.data.list;
e.DataMgr.Game_View.UpdateButton_Banker();
} else wLog.e("玩家抢庄");
}, this);
wGEvent.on("Msg_FQZS_BankerInfo", function(t) {
if (1 == t.status) {
console.error("庄家信息", t);
var o = e.DataMgr.GameData;
o.BankerUser.UserID == o.PlayerUser.UserID && o.PlayerUser.UserID != "" + t.data.uid && wUIManager.showTips("下庄申请成功");
o.BankerUser.UserID = "" + t.data.uid;
if (o.BankerUser.UserID == o.SelfUserID) {
o.BankerUser.UserName = o.PlayerUser.UserName;
o.BankerUser.UserHead = o.PlayerUser.UserHead;
} else {
o.BankerUser.UserName = "" + t.data.username;
o.BankerUser.UserHead = +t.data.headimgurl;
}
o.BankerUser.Gold = +t.data.gold;
o.BankerUser.UserSex = +t.data.sex;
o.BankerUser.Circle = 0;
e.DataMgr.Game_View.SetText_ContinueBankerCount(o.BankerUser.Circle);
e.DataMgr.Game_View.SetUI_Banker(o.BankerUser);
e.DataMgr.Game_View.SetText_BankerGold(o.BankerUser.Gold);
e.DataMgr.Game_View.UpdateButton_Banker();
} else wLog.e("庄家信息");
}, this);
};
t.prototype.Start_GameOver = function(e) {
var t = this, o = this.DataMgr.GameData, n = this.DataMgr.GetServerIconTypeIndex(e.ServerResult);
console.error(e);
this.DataMgr.Game_View.SetText_BankerGold(o.BankerUser.Gold - e.BankerUserGold);
e.PlayerUserGold < 0 ? this.DataMgr.Game_View.SetText_PlayerGold(o.PlayerUser.Gold) : this.DataMgr.Game_View.SetText_PlayerGold(o.PlayerUser.Gold - e.PlayerUserGold);
var a = function() {
o.CurWheelDiscIndex = n;
for (var a = 0, i = t.DataMgr.WheelDiscConfigData[t.DataMgr.GetIndexIconType(n)].Include; a < i.length; a++) {
var r = i[a];
t.DataMgr.Game_View.Play_RegionFlicker(r);
}
t.DataMgr.Game_View.Play_EffectIconShow(t.DataMgr.GetIndexIconType(n), function() {
t.DataMgr.Game_View.Close_RegionJettonText();
t.DataMgr.Game_View.Play_JettonPointAction(t.DataMgr.WheelDiscConfigData[t.DataMgr.GetIndexIconType(n)].Include, function() {}, function() {
0 != e.PlayerUserGold && t.DataMgr.Game_View.Play_UpPlayerScore(2, e.PlayerUserGold);
0 != e.BankerUserGold && t.DataMgr.Game_View.Play_UpPlayerScore(3, e.BankerUserGold);
e.PlayersGold > 0 && t.DataMgr.Game_View.Play_UpPlayerScore(1, e.PlayersGold);
t.DataMgr.Game_View.SetText_BankerGold(o.BankerUser.Gold);
t.DataMgr.Game_View.Close_RegionFlicker();
t.DataMgr.Game_View.SetText_PlayerGold(o.PlayerUser.Gold);
10 == o.BankerUser.Circle && t.DataMgr.Game_View.Play_TipsAction(3);
});
});
};
if (e.IsReconnect) {
this.DataMgr.Game_View.SetUI_PointWheelDisc(n);
a();
} else this.DataMgr.Game_View.Play_WheelDiscAction(o.CurWheelDiscIndex, n, function() {
e.PlayerUserGold > 0 ? wAudioMgr.playSound("sound/GAME_WIN", "FQZS") : e.PlayerUserGold < 0 && wAudioMgr.playSound("sound/GAME_LOSE", "FQZS");
t.DataMgr.Game_View.SetUI_AddHistoryList(t.DataMgr.GetIndexIconType(n));
a();
});
};
return __decorate([ c ], t);
}(n.default);
o.default = d;
cc._RF.pop();
}, {
FQZS_DataMgr: "FQZS_DataMgr",
FQZS_View: "FQZS_View",
MultiBase: void 0
} ],
FQZS_DataMgr: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "13913WQs1lPsY32A5Kk9EO7", "FQZS_DataMgr");
var n, a;
Object.defineProperty(o, "__esModule", {
value: !0
});
var i = e("FQZS_PoolItemTool");
(function(e) {
e[e.ZouShou = 1] = "ZouShou";
e[e.FeiQin = 2] = "FeiQin";
e[e.ShiZi = 3] = "ShiZi";
e[e.XiongMao = 4] = "XiongMao";
e[e.HouZi = 5] = "HouZi";
e[e.TuZi = 6] = "TuZi";
e[e.LaoYing = 7] = "LaoYing";
e[e.KongQue = 8] = "KongQue";
e[e.GeZi = 9] = "GeZi";
e[e.YanZi = 10] = "YanZi";
e[e.YinSha = 11] = "YinSha";
e[e.JinSha = 12] = "JinSha";
e[e.TongPei = 13] = "TongPei";
e[e.TongChi = 14] = "TongChi";
})(a || (a = {}));
(n = {})[a.ZouShou] = {
Regin: 1,
ServerRegin: 2,
Odds: 2,
IndexList: [],
Include: [ a.ShiZi, a.XiongMao, a.HouZi, a.TuZi ]
};
n[a.FeiQin] = {
Regin: 2,
ServerRegin: 1,
Odds: 2,
IndexList: [],
Include: [ a.LaoYing, a.KongQue, a.GeZi, a.YanZi ]
};
n[a.ShiZi] = {
Regin: 3,
ServerRegin: 24,
Odds: 12,
IndexList: [ 25, 26, 27 ],
Include: [ a.ShiZi, a.ZouShou ]
};
n[a.XiongMao] = {
Regin: 4,
ServerRegin: 23,
Odds: 8,
IndexList: [ 22, 23, 24 ],
Include: [ a.XiongMao, a.ZouShou ]
};
n[a.HouZi] = {
Regin: 5,
ServerRegin: 22,
Odds: 8,
IndexList: [ 18, 19, 20 ],
Include: [ a.HouZi, a.ZouShou ]
};
n[a.TuZi] = {
Regin: 6,
ServerRegin: 21,
Odds: 6,
IndexList: [ 15, 16, 17 ],
Include: [ a.TuZi, a.ZouShou ]
};
n[a.LaoYing] = {
Regin: 7,
ServerRegin: 14,
Odds: 12,
IndexList: [ 1, 2, 3 ],
Include: [ a.LaoYing, a.FeiQin ]
};
n[a.KongQue] = {
Regin: 8,
ServerRegin: 13,
Odds: 8,
IndexList: [ 4, 5, 6 ],
Include: [ a.KongQue, a.FeiQin ]
};
n[a.GeZi] = {
Regin: 9,
ServerRegin: 12,
Odds: 8,
IndexList: [ 8, 9, 10 ],
Include: [ a.GeZi, a.FeiQin ]
};
n[a.YanZi] = {
Regin: 10,
ServerRegin: 11,
Odds: 6,
IndexList: [ 11, 12, 13 ],
Include: [ a.YanZi, a.FeiQin ]
};
n[a.YinSha] = {
Regin: 11,
ServerRegin: 3,
Odds: 24,
IndexList: [ 0 ],
Include: [ a.YinSha ]
};
n[a.JinSha] = {
Regin: 11,
ServerRegin: 0,
Odds: 100,
IndexList: [ 14 ],
Include: [ a.YinSha ]
};
n[a.TongPei] = {
Regin: 0,
ServerRegin: 0,
Odds: 0,
IndexList: [ 7 ],
Include: [ a.ShiZi, a.XiongMao, a.HouZi, a.TuZi, a.LaoYing, a.KongQue, a.GeZi, a.YanZi, a.ZouShou, a.FeiQin ]
};
n[a.TongChi] = {
Regin: 0,
ServerRegin: 0,
Odds: 0,
IndexList: [ 21 ],
Include: []
};
var r = n, c = [ 100, 1e3, 1e4, 1e5, 1e6, 5e6 ], d = function() {
function e() {
this.WheelDiscConfigData = r;
this.WheelDiscType = a;
this.JettonConfig = c;
}
e.prototype.Init = function() {
this.GameData = {};
this.GameData.SelfUserID = "";
this.GameData.GameType = 1;
this.GameData.AllJettonCount = 0;
this.GameData.PlayerCount = 0;
this.GameData.PreparePutList = [];
this.GameData.IsPrepare = !1;
this.GameData.BufferHistoryList = [];
this.GameData.CurWheelDiscIndex = 0;
this.GameData.PlayerUser = {};
this.GameData.PlayerUser.Gold = 0;
this.GameData.PlayerUser.UserID = "";
this.GameData.PlayerUser.UserName = "";
this.GameData.MaxWheelDiscCount = 0;
this.GameData.CurChipCount = 0;
this.GameData.BankerUser = {};
this.GameData.JettonBufferPosList = {};
this.PoolItemTool = new i.default();
};
e.prototype.Close = function() {
var e;
null === (e = this.PoolItemTool) || void 0 === e || e.Clear();
};
e.prototype.Get_IndexData = function(e) {
var t = {
NextIndex: e + 1,
CurIndex: e,
AboveIndex1: e - 1,
AboveIndex2: e - 2
};
t.NextIndex >= this.GameData.MaxWheelDiscCount && (t.NextIndex -= this.GameData.MaxWheelDiscCount);
t.AboveIndex1 < 0 && (t.AboveIndex1 += this.GameData.MaxWheelDiscCount);
t.AboveIndex2 < 0 && (t.AboveIndex2 += this.GameData.MaxWheelDiscCount);
return t;
};
e.prototype.Get_WheelDiscTypeIndex = function(e) {
var t = r[e].IndexList;
return t[wUtils.random(0, t.length - 1)];
};
e.prototype.Get_WheelDiscTypeData = function(e) {
return r[e];
};
e.prototype.GetServerIconType = function(e) {
return {
2: a.ZouShou,
1: a.FeiQin,
3: a.YinSha,
24: a.ShiZi,
23: a.XiongMao,
22: a.HouZi,
21: a.TuZi,
14: a.LaoYing,
13: a.KongQue,
12: a.GeZi,
11: a.YanZi,
32: a.JinSha,
31: a.YinSha,
90: 999,
91: 999
}[e];
};
e.prototype.GetServerIconTypeIndex = function(e) {
var t;
return ((t = {})[241] = 25, t[242] = 26, t[243] = 27, t[231] = 22, t[232] = 23, 
t[233] = 24, t[221] = 18, t[222] = 19, t[223] = 20, t[211] = 15, t[212] = 16, t[213] = 17, 
t[141] = 1, t[142] = 2, t[143] = 3, t[131] = 4, t[132] = 5, t[133] = 6, t[121] = 8, 
t[122] = 9, t[123] = 10, t[111] = 11, t[112] = 12, t[113] = 13, t[311] = 0, t[321] = 14, 
t[411] = 21, t[421] = 7, t)[e];
};
e.prototype.GetIndexIconType = function(e) {
return {
0: a.YinSha,
1: a.LaoYing,
2: a.LaoYing,
3: a.LaoYing,
4: a.KongQue,
5: a.KongQue,
6: a.KongQue,
7: a.TongPei,
8: a.GeZi,
9: a.GeZi,
10: a.GeZi,
11: a.YanZi,
12: a.YanZi,
13: a.YanZi,
14: a.JinSha,
15: a.TuZi,
16: a.TuZi,
17: a.TuZi,
18: a.HouZi,
19: a.HouZi,
20: a.HouZi,
21: a.TongChi,
22: a.XiongMao,
23: a.XiongMao,
24: a.XiongMao,
25: a.ShiZi,
26: a.ShiZi,
27: a.ShiZi
}[e];
};
e.prototype.Get_ChipButtonUp = function() {
if (this.GameData.PlayerUser.Gold >= this.GameData.CurChipCount) {
for (var e = 0, t = this.JettonConfig.length; e < t; e++) if ((o = this.JettonConfig[e]) == this.GameData.CurChipCount) return e + 1;
} else {
e = this.JettonConfig.length - 1;
for (t = 0; e >= t; e--) {
var o = this.JettonConfig[e];
if (this.GameData.PlayerUser.Gold >= o) {
this.GameData.CurChipCount = o;
return;
}
}
}
return 0;
};
e.prototype.Get_JettonType = function(e) {
for (var t = 0, o = this.JettonConfig.length; t < o; t++) if (this.JettonConfig[t] == e) return t + 1;
return 1;
};
e.prototype.ConfigNum = function(e, t, o) {
return e < 0 ? "-" + wUtils.goldFormat(Math.abs(e), t, o) : wUtils.goldFormat(Math.abs(e), t, o);
};
e.prototype.ScoreSplit = function(e) {
if (0 == e) return [];
for (var t = this.JettonConfig, o = [], n = t.length - 1; ;) {
var a = -1;
if (e >= t[n]) a = wUtils.random(0, n); else for (var i = n - 1; i > -1; i--) if (e >= t[i]) {
a = i;
break;
}
if (a >= 0) {
var r = t[a];
o.push(r);
e -= r;
} else console.error("异常", e);
if (e <= 0 || e < t[0]) return o;
}
};
e.prototype.MaxScoreSplit = function(e) {
for (var t = [], o = 5; o > -1; o--) for (var n = this.JettonConfig[o]; e >= n; ) {
t.push(n);
e -= n;
}
return t;
};
e.prototype.Check_XT = function() {
for (var e = this.GameData.BankerUser.UserID != this.GameData.PlayerUser.UserID && 1 == this.GameData.GameType, t = 0, o = 0, n = this.GameData.PreparePutList.length; o < n; o++) t += this.GameData.PreparePutList[o].Count;
return e && 0 != t && this.GameData.IsPrepare;
};
e.prototype.Check_GoldMeetJetton = function(e) {
return this.GameData.PlayerUser.Gold >= e;
};
e.prototype.IsMyBanker = function() {
return !!this.GameData.BankerUser.UserID && this.GameData.BankerUser.UserID == this.GameData.SelfUserID;
};
return e;
}();
o.default = d;
cc._RF.pop();
}, {
FQZS_PoolItemTool: "FQZS_PoolItemTool"
} ],
FQZS_Load: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b2ba8CfAcxOfLZsbX7+BnHo", "FQZS_Load");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Config"), a = cc._decorator, i = a.ccclass;
a.property;
var r = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t, o = this;
return __generator(this, function(a) {
switch (a.label) {
case 0:
e = n.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir(e.prefabUrl, e.enName);
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
return [ 4, new Promise(function(e) {
var t = o.node.getChildByName("Sp_Load");
wUIHelp.playSpine(t, "start", function() {
wUIHelp.playSpine(t, "idle", null, !0);
e();
});
}) ];

case 1:
a.sent();
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
o.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
o.node.destroy();
}
}, this);
t = wGEvent.on("Msg_Hall_EnterRoom", function(e) {
o.Msg_Hall_EnterRoom(e);
wGEvent.off(t);
o.unscheduleAllCallbacks();
t = null;
}, this);
this.scheduleOnce(function() {
if (t) {
wGEvent.off(t);
t = null;
wUIManager.hideLoadingUI();
}
}, 5);
if (!wNetWork.send("Msg_Hall_EnterRoom", {
tableid: 0,
gtype: Number(wGameData.gameID),
level: 5
})) {
if (t) {
wGEvent.off(t);
o.unscheduleAllCallbacks();
t = null;
}
wUIManager.showTips("网络连接失败");
}
return [ 2 ];
}
});
});
};
t.prototype.loadGame = function() {
var e = this, t = n.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(t.prefabUrl, function() {}, function(t, o) {
if (t) wLog.e(t); else {
e.node.destroy();
wViewMgr.openGame(o);
}
}, t.enName);
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
t.OpenGame = function() {
wGameData.gameID = 1;
wViewMgr.enterSite();
};
return __decorate([ i ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {
Config: void 0
} ],
FQZS_PlayerList: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "d418116KKFLNbIFEm3O1UWA", "FQZS_PlayerList");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), a = cc._decorator, i = a.ccclass;
a.property;
var r = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {
var e = this;
wGEvent.on("Msg_FQZS_GetUserList", function(t) {
if (1 == t.status) {
console.error("玩家列表", t);
var o = Object.keys(t.data).length;
if (o > 0) for (var n in t.data) if (t.data.hasOwnProperty(n)) {
var a = t.data[n];
e.Add_Player({
Sex: a.sex,
Name: a.username,
ID: a.uid == wGameData.getKey("uid") ? a.nickname : a.username,
HeadPath: a.headimgurl,
Gold: +a.gold
});
}
cc.find("Node_View/Lab_PlayerCount", e.node).getComponent(cc.Label).string = o + "在线";
} else wLog.e("玩家列表");
}, this);
wNetWork.send("Msg_FQZS_GetUserList", {}, !0);
cc.find("Node_View/Lab_PlayerCount", this.node).getComponent(cc.Label).string = "0在线";
cc.find("Node_View/ScrollView/Node_Copy", this.node).active = !1;
cc.find("Node_View/ScrollView/Mask_View/Node_Content", this.node).removeAllChildren();
};
t.prototype.Add_Player = function(e) {
var t = cc.find("Node_View/ScrollView/Mask_View/Node_Content", this.node), o = cc.instantiate(cc.find("Node_View/ScrollView/Node_Copy", this.node));
o.active = !0;
t.addChild(o);
cc.find("Node_Head/Node_Sex/Img_Boy", o).active = 1 == e.Sex;
cc.find("Node_Head/Node_Sex/Img_Girl", o).active = 1 != e.Sex;
wUIHelp.setHead(cc.find("Node_Head/Img_Head", o), e.HeadPath);
cc.find("Lab_Name", o).getComponent(cc.Label).string = "" + wUtils.handleNameLen(e.Name, 8);
cc.find("Lab_Gold", o).getComponent(cc.Label).string = "" + wUtils.goldFormat(e.Gold, 1, 1);
};
return __decorate([ i ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
FQZS_PoolItemTool: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "76d67QMF4RCvr8BjCGAHXka", "FQZS_PoolItemTool");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {
this._All_Pool = null;
this._All_PoolPrefabl = null;
this._All_PoolInitCallback = null;
this._All_Pool = [];
this._All_PoolPrefabl = {};
this._All_PoolInitCallback = {};
}
e.GetInstance = function() {
this._Instance || (this._Instance = new e());
return this._Instance;
};
e.prototype.MonitorPoolItem = function(e, t, o, n) {
if (!this._All_PoolPrefabl[e]) {
var a = this.Clone(t);
a.Name = e;
a.parent = null;
this._All_PoolPrefabl[e] = a;
"function" == typeof o && (this._All_PoolInitCallback[e] = o);
this._All_Pool[e] || (this._All_Pool[e] = new cc.NodePool());
if ("number" == typeof n) for (var i = 0; i < n; i++) {
var r = this.Clone(this._All_PoolPrefabl[e]);
r.__TypeName__ = e;
this._All_Pool[e].put(r);
}
}
};
e.prototype.GetPoolItem = function(e) {
var t = this;
this._All_Pool[e] || (this._All_Pool[e] = new cc.NodePool());
var o = this._All_Pool[e].get();
if (!o) {
if (!this._All_PoolPrefabl[e]) return null;
(o = this.Clone(this._All_PoolPrefabl[e])).Destroy = function() {
t.RemovePoolItem(o);
};
}
o.__TypeName__ = e;
this._All_PoolInitCallback[e] && this._All_PoolInitCallback[e](o);
return o;
};
e.prototype.RootRemovePoolItem = function(e) {
if (cc.isValid(e) && e.children.length > 0) {
for (var t = e.children, o = [], n = 0, a = t.length; n < a; n++) o.push(t[n]);
n = 0;
for (a = o.length; n < a; n++) {
this.RootRemovePoolItem(o[n]);
o[n].Destroy && o[n].Destroy();
}
}
};
e.prototype.RemovePoolItem = function(e) {
if (e) {
if (e.OnDestroy) {
e.OnDestroy();
delete e.OnDestroy;
}
this._All_Pool[e.__TypeName__] || (this._All_Pool[e.__TypeName__] = new cc.NodePool());
this._All_Pool[e.__TypeName__].put(e);
}
};
e.prototype.SetNodeOnDestroy = function(e, t, o) {
if (e.__TypeName__) {
e.OnDestroy = "undefined" != typeof o ? t.bind(o) : t;
return !0;
}
return !1;
};
e.prototype.Clear = function(e) {
if (e && this._All_Pool[e]) {
this._All_Pool[e].clear();
delete this._All_Pool[e];
} else {
for (var t in this._All_Pool) this._All_Pool.hasOwnProperty(t) && this._All_Pool[t].clear();
this._All_Pool = [];
this._All_PoolPrefabl = {};
this._All_PoolInitCallback = {};
}
};
e.prototype.Clone = function(e) {
return cc.instantiate(e);
};
e._Instance = null;
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
FQZS_View: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "62ec1WoEkFCYarKNLG3pcOn", "FQZS_View");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("DropDown"), a = cc._decorator, i = a.ccclass, r = a.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.JettonAtlas = null;
return t;
}
t.prototype.Init = function() {
this.Init_Data();
this.Init_Buttons();
this.Init_Node();
this.Init_Game();
};
t.prototype.Init_Buttons = function() {
var e = this;
this.AddNodeClick(cc.find("Node_UI/Node_BankerBtn/Btn_QiangBanker", this.node), function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.PlayerUser.Gold < 6e8 ? wUIManager.showConfirmUI({
title: "系统提示",
content: "您的欢乐豆不足，无法抢庄\n抢庄条件：6亿欢乐豆",
okCB: function() {}
}) : wNetWork.send("Msg_FQZS_QiangBanker", {}, !0);
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Node_BankerBtn/Node_UpBanker/Btn_UpBanker", this.node), function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.PlayerUser.Gold < 2e8 ? wUIManager.showConfirmUI({
title: "系统提示",
content: "您的欢乐豆不足，无法上庄\n上庄条件：2亿欢乐豆",
okCB: function() {}
}) : wNetWork.send("Msg_FQZS_ToBanker", {
stage: 1
}, !0);
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Node_BankerBtn/Btn_DownBanker", this.node), function() {
wAudioMgr.playBtnSound();
wNetWork.send("Msg_FQZS_ToBanker", {
stage: 0
}, !0);
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Btn_XY", this.node), function() {
if (cc.find("Node_UI/Btn_XY/Img_On", e.node).active) {
wAudioMgr.playBtnSound();
for (var t = 0, o = {}, n = 0, a = e.DataMgr.GameData.PreparePutList.length; n < a; n++) {
o[(r = e.DataMgr.GameData.PreparePutList[n]).Region] ? o[r.Region] += r.Count : o[r.Region] = r.Count;
t += r.Count;
}
if (t <= e.DataMgr.GameData.PlayerUser.Gold && e.DataMgr.GameData.PreparePutList.length > 0) for (var i in o) if (o.hasOwnProperty(i)) {
var r = o[i];
e.DataMgr.GameData.PlayerUser.Gold >= e.DataMgr.GameData.CurChipCount && 1 == e.DataMgr.GameData.GameType && wNetWork.send("Msg_FQZS_ActBet", {
region: e.DataMgr.WheelDiscConfigData[i].ServerRegin,
gold: +r
}, !0);
}
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Node_Players/Btn_Players", this.node), function() {
wAudioMgr.playBtnSound();
wViewMgr.openPage({
path: "prefab/PlayerList",
bundle: "FQZS"
});
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/DropDown/switchBtn/mask/panel/bank", this.node), function() {
wAudioMgr.playBtnSound();
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
cc.find("Node_UI/DropDown", e.node).getComponent(n.default).onClickSwitchBtn();
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Node_User/Img_Gold/Btn_Add", this.node), function() {
wAudioMgr.playBtnSound();
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/DropDown/switchBtn/mask/panel/exit", this.node), function() {
if (1 == e.DataMgr.GameData.GameType) {
wAudioMgr.playBtnSound();
e.DataMgr && e.DataMgr.Game_Controlle ? e.DataMgr.Game_Controlle.m_quitGame() : wViewMgr.quitGame();
} else wUIManager.showTips("当前状态不能退出!");
}, [ cc.Node.EventType.TOUCH_END ]);
for (var t = function(t) {
o.AddNodeClick(cc.find("Node_UI/Node_Region/Node_" + t, o.node), function(o, n) {
if (n == cc.Node.EventType.TOUCH_END) {
wAudioMgr.playBtnSound();
cc.find("Node_UI/Node_Region/Node_" + t + "/Img_Touch", e.node).active = !1;
var a = e.DataMgr.GameData;
if (1 != a.GameType) {
wUIManager.showTips("下注时间已过！");
return;
}
if (0 == a.CurChipCount) {
wUIManager.showTips("请选择下注筹码！");
return;
}
e.DataMgr.GameData.PlayerUser.Gold >= e.DataMgr.GameData.CurChipCount && 1 == e.DataMgr.GameData.GameType && wNetWork.send("Msg_FQZS_ActBet", {
region: e.DataMgr.WheelDiscConfigData[t].ServerRegin,
gold: e.DataMgr.GameData.CurChipCount
}, !1);
} else n == cc.Node.EventType.TOUCH_START ? cc.find("Node_UI/Node_Region/Node_" + t + "/Img_Touch", e.node).active = !cc.find("Node_UI/Node_Region/Node_" + t + "/Img_Act", e.node).active : cc.find("Node_UI/Node_Region/Node_" + t + "/Img_Touch", e.node).active = !1;
}, [ cc.Node.EventType.TOUCH_END, cc.Node.EventType.TOUCH_START, cc.Node.EventType.TOUCH_CANCEL ]);
}, o = this, a = 1; a <= 11; a++) t(a);
for (var i = function(t) {
r.AddNodeClick(cc.find("Node_UI/Node_Jetton/Jetton_" + (t + 1) + "/Img_Jetton", r.node), function() {
wAudioMgr.playSound("sound/BT_CLOSE", "FQZS");
e.DataMgr.GameData.CurChipCount = e.DataMgr.JettonConfig[t];
e.DataMgr.Game_View.UpdateButton_DownJetton(e.DataMgr.Get_ChipButtonUp());
}, [ cc.Node.EventType.TOUCH_END ]);
}, r = this, c = 0; c < this.DataMgr.JettonConfig.length; c++) i(c);
};
t.prototype.Init_Data = function() {};
t.prototype.Init_Node = function() {
this.SetUI_UIJettonButton(this.DataMgr.JettonConfig);
this.UpdateButton_XYType();
cc.find("Node_UI/Node_ActionTips", this.node).active = !1;
this.SetText_PlayerGold(0);
this.SetText_BankerGold(0);
this.SetText_BankerContinue(0);
this.SetText_DelayUpBankerCount(0);
this.SetText_ContinueBankerCount(0);
cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node).removeAllChildren();
cc.find("Node_UI/Node_JettonEffect/Node_Copy", this.node).active = !1;
cc.find("Node_UI/Node_Record/ScrollView/Node_Root", this.node).removeAllChildren();
cc.find("Node_UI/Node_Record/ScrollView/Node_Copy", this.node).active = !1;
cc.find("Node_UI/Node_JettonEffect/Node_Copy", this.node).active = !1;
cc.find("Node_UI/Node_EffectShowAction", this.node).active = !1;
cc.find("Node_UI/Node_BankerBtn/Btn_QiangBanker", this.node).active = !1;
cc.find("Node_UI/Node_BankerBtn/Node_UpBanker", this.node).active = !1;
cc.find("Node_UI/Node_BankerBtn/Btn_DownBanker", this.node).active = !1;
cc.find("Node_BG/Lab_DownTime", this.node).getComponent(cc.Label).string = "00";
cc.find("Node_BG/Node_Text/Img_XZSJ", this.node).active = !1;
cc.find("Node_BG/Node_Text/Img_KJSJ", this.node).active = !1;
cc.find("Node_BG/Node_Text/Img_KXSJ", this.node).active = !1;
this.DataMgr.PoolItemTool.MonitorPoolItem("Jetton", cc.find("Node_UI/Node_JettonEffect/Node_Copy", this.node), function(e) {
e.active = !0;
e.scale = .3;
e.stopAllActions();
e.Data = {};
});
this.DataMgr.PoolItemTool.MonitorPoolItem("BufferIcon", cc.find("Node_UI/Node_Record/ScrollView/Node_Copy", this.node), function(e) {
e.active = !0;
for (var t = 0, o = cc.find("Node_Type", e).children; t < o.length; t++) o[t].active = !1;
var n = cc.find("Img_Point", e);
n.active = !0;
n.stopAllActions();
n.runAction(cc.repeatForever(cc.sequence(cc.delayTime(.5), cc.callFunc(function() {
n.opacity = 0 == n.opacity ? 255 : 0;
}))));
n.active = !1;
});
};
t.prototype.Init_Game = function() {
var e;
this.SetText_AllJetton(0);
this.Close_RegionFlicker();
this.Close_RegionJettonText();
this.Close_RegionJetton();
this.Close_WheelDisc();
this.Close_UpPlayerScore();
null === (e = this.WheelAction) || void 0 === e || e.stop();
};
t.prototype.Close_RegionFlicker = function() {
for (var e = 0, t = cc.find("Node_UI/Node_Region", this.node).children; e < t.length; e++) {
var o = t[e];
cc.find("Img_Act", o).stopAllActions();
cc.find("Img_Act", o).active = !1;
cc.find("Img_Act", o).opacity = 255;
cc.find("Img_Touch", o).active = !1;
}
};
t.prototype.Close_RegionJetton = function() {
this.DataMgr.PoolItemTool.RootRemovePoolItem(cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node));
};
t.prototype.Close_HistoryList = function() {
this.DataMgr.PoolItemTool.RootRemovePoolItem(cc.find("Node_UI/Node_Record/ScrollView/Node_Root", this.node));
};
t.prototype.Close_WheelDisc = function() {
for (var e = 0, t = cc.find("Node_UI/Node_WheelDisc", this.node).children; e < t.length; e++) {
var o = t[e];
cc.find("Img_Light", o).active = !1;
cc.find("Img_Light", o).opacity = 255;
}
};
t.prototype.Close_RegionJettonText = function() {
for (var e = 1; e <= 11; e++) {
this.SetText_RegionJetton(e, 0);
this.SetText_RegionSelfJetton(e, 0);
}
};
t.prototype.Close_UpPlayerScore = function() {
cc.find("Node_UI/Node_Players/Lab_UpScore", this.node).active = !1;
cc.find("Node_UI/Node_User/Lab_UpScore", this.node).active = !1;
cc.find("Node_UI/Node_Banker/Lab_UpScore", this.node).active = !1;
cc.find("Node_UI/Node_Players/Lab_DownScore", this.node).active = !1;
cc.find("Node_UI/Node_User/Lab_DownScore", this.node).active = !1;
cc.find("Node_UI/Node_Banker/Lab_DownScore", this.node).active = !1;
};
t.prototype.SetText_UpBankerCount = function(e) {
cc.find("Node_UI/Node_BankerBtn/Node_UpBanker/Lab_Count", this.node).getComponent(cc.Label).string = e + "人排队";
};
t.prototype.SetText_AllJetton = function(e) {
cc.find("Node_UI/Lab_AllJetton", this.node).getComponent(cc.Label).string = "" + wUtils.numConvert(e);
};
t.prototype.SetText_RegionJetton = function(e, t) {
var o = cc.find("Node_UI/Node_Region/Node_" + e, this.node);
if (o) {
o.Jetton = t;
cc.find("Lab_Jetton", o).getComponent(cc.Label).string = 0 == t ? "" : "" + wUtils.numConvert(o.Jetton);
}
};
t.prototype.SetText_RegionSelfJetton = function(e, t) {
var o = cc.find("Node_UI/Node_Region/Node_" + e, this.node);
if (o) {
o.SelfJetton = t;
cc.find("Lab_SelfJetton", o).getComponent(cc.Label).string = 0 == t ? "" : "" + wUtils.numConvert(o.SelfJetton);
}
};
t.prototype.SetText_AddRegionJetton = function(e, t) {
var o = cc.find("Node_UI/Node_Region/Node_" + e, this.node);
if (o) {
o.Jetton || (o.Jetton = 0);
if (t) {
o.Jetton += t;
cc.find("Lab_Jetton", o).getComponent(cc.Label).string = "" + wUtils.numConvert(o.Jetton);
}
}
};
t.prototype.SetText_AddRegionSelfJetton = function(e, t) {
var o = cc.find("Node_UI/Node_Region/Node_" + e, this.node);
if (o) {
o.SelfJetton || (o.SelfJetton = 0);
if (t) {
o.SelfJetton += t;
cc.find("Lab_SelfJetton", o).getComponent(cc.Label).string = "" + wUtils.numConvert(o.SelfJetton);
}
}
};
t.prototype.SetText_ContinueBankerCount = function(e) {
cc.find("Node_BG/Lab_LZ", this.node).getComponent(cc.Label).string = "连\n庄\n" + e;
};
t.prototype.SetText_PlayerGold = function(e) {
cc.find("Node_UI/Node_User/Img_Gold/Lab_Count", this.node).getComponent(cc.Label).string = "" + wUtils.numConvert(e);
};
t.prototype.SetText_BankerGold = function(e) {
cc.find("Node_UI/Node_Banker/Img_Gold/Lab_Count", this.node).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(e);
};
t.prototype.SetText_BankerContinue = function(e) {
cc.find("Node_BG/Lab_LZ", this.node).getComponent(cc.Label).string = "连\n庄\n" + e;
};
t.prototype.SetText_DelayUpBankerCount = function(e) {
cc.find("Node_UI/Node_BankerBtn/Node_UpBanker/Lab_Count", this.node).getComponent(cc.Label).string = e + "人排队";
};
t.prototype.SetUI_UIJettonButton = function(e) {
if (6 == e.length) for (var t = cc.find("Node_UI/Node_Jetton", this.node), o = 0, n = e.length; o < n; o++) {
this.SetImg_Jetton(cc.find("Jetton_" + (o + 1) + "/Img_Jetton", t), e[o], !0);
cc.find("Jetton_" + (o + 1) + "/Sp_Touch", t).active = !1;
}
};
t.prototype.SetUI_Player = function(e) {
wUIHelp.setHead(cc.find("Node_UI/Node_User/Img_Head", this.node), e.UserHead);
cc.find("Node_UI/Node_User/Node_Sex/1", this.node).active = 1 == e.UserSex;
cc.find("Node_UI/Node_User/Node_Sex/2", this.node).active = 1 != e.UserSex;
cc.find("Node_UI/Node_User/Lab_Name", this.node).getComponent(cc.Label).string = "" + wUtils.handleNameLen(e.UserName, 10);
};
t.prototype.SetUI_Banker = function(e) {
wUIHelp.setHead(cc.find("Node_UI/Node_Banker/Img_Head", this.node), e.UserHead);
cc.find("Node_UI/Node_Banker/Node_Sex/1", this.node).active = 1 == e.UserSex;
cc.find("Node_UI/Node_Banker/Node_Sex/2", this.node).active = 1 != e.UserSex;
cc.find("Node_UI/Node_Banker/Lab_Name", this.node).getComponent(cc.Label).string = "" + wUtils.handleNameLen(e.UserName, 6);
};
t.prototype.SetUI_HistoryList = function(e) {
for (var t = 0, o = e.length; t < o; t++) this.SetUI_AddHistoryList(e[t]);
};
t.prototype.SetUI_AddHistoryList = function(e) {
for (var t = this, o = cc.find("Node_UI/Node_Record/ScrollView/Node_Root", this.node), n = this.DataMgr.PoolItemTool.GetPoolItem("BufferIcon"), a = 0, i = o.children; a < i.length; a++) {
var r = i[a];
cc.find("Img_Point", r).active = !1;
}
o.addChild(n);
cc.find("Img_Point", n).active = !0;
for (var c = 0, d = cc.find("Node_Type", n).children; c < d.length; c++) (r = d[c]).active = r.name == "" + e;
(function e() {
if (o.childrenCount > 20) {
t.DataMgr.PoolItemTool.RemovePoolItem(o.children[0]);
e();
}
})();
o.stopAllActions();
o.runAction(cc.sequence(cc.delayTime(.05), cc.callFunc(function() {
o.parent.getComponent(cc.ScrollView).stopAutoScroll();
o.parent.getComponent(cc.ScrollView).scrollToBottom(.05);
})));
};
t.prototype.SetUI_AddDesktopJettonIcon = function(e) {
var t = this.DataMgr.PoolItemTool.GetPoolItem("Jetton");
cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node).addChild(t);
var o = t.Data;
o.Region = e.Region;
o.IsMy = !!e.IsMy;
o.Jetton = e.Jetton;
this.SetImg_Jetton(t, o.Jetton, !1);
t.setPosition(this.GetPos_RegionRandomPos(e.Region));
this.SetText_AddRegionJetton(e.Region, e.Jetton);
e.IsMy && this.SetText_AddRegionSelfJetton(e.Region, e.Jetton);
};
t.prototype.SetUI_PointWheelDisc = function(e) {
for (var t = 0, o = cc.find("Node_UI/Node_WheelDisc", this.node).children; t < o.length; t++) {
var n = o[t];
cc.find("Img_Light", n).active = !1;
cc.find("Img_Light", n).opacity = 255;
n.name == "" + e && (cc.find("Img_Light", n).active = !0);
}
};
t.prototype.SetImg_Jetton = function(e, t, o) {
void 0 === o && (o = !1);
e.Jetton = t;
var n = o ? this.DataMgr.Check_GoldMeetJetton(t) && 1 == this.DataMgr.GameData.GameType ? this.JettonAtlas.getSpriteFrame("fqzs_btn_jetton_3_" + t) : this.JettonAtlas.getSpriteFrame("fqzs_btn_jetton_1_" + t) : this.JettonAtlas.getSpriteFrame("fqzs_btn_jetton_2_" + t);
n && (e.getComponent(cc.Sprite).spriteFrame = n);
};
t.prototype.GetPos_RegionRandomPos = function(e) {
var t = cc.find("Node_UI/Node_Region/Node_" + e + "/Node_PosArr", this.node);
t || console.error(e);
var o = cc.v2(0, 0), n = wUtils.random(0, t.childrenCount - 1);
this.DataMgr.GameData.JettonBufferPosList[e] || (this.DataMgr.GameData.JettonBufferPosList[e] = {});
if (this.DataMgr.GameData.JettonBufferPosList[e][n]) o = this.DataMgr.GameData.JettonBufferPosList[e][n]; else {
o = this.GetNodeWorldPos(t.children[n]);
this.DataMgr.GameData.JettonBufferPosList[e][n] = o;
}
return o;
};
t.prototype.UpdateButton_XYType = function() {
console.error("更新续压");
var e = this.DataMgr.Check_XT();
cc.find("Node_UI/Btn_XY/Img_On", this.node).active = e;
cc.find("Node_UI/Btn_XY/Img_Off", this.node).active = !e;
};
t.prototype.UpdateButton_DownJetton = function(e) {
for (var t = cc.find("Node_UI/Node_Jetton", this.node), o = 1; o <= t.children.length; o++) {
var n = cc.find("Jetton_" + o + "/Img_Jetton", t), a = this.DataMgr.Check_GoldMeetJetton(n.Jetton) && 1 == this.DataMgr.GameData.GameType;
this.SetImg_Jetton(n, n.Jetton, !0);
n.y = o == e && a ? 5 : 0;
cc.find("Jetton_" + o + "/Sp_Touch", t).active = n.y > 0;
}
};
t.prototype.UpdateButton_Banker = function() {
var e = -1 != this.DataMgr.GameData.UpBankerList.indexOf(+this.DataMgr.GameData.PlayerUser.UserID);
cc.find("Node_UI/Node_BankerBtn/Btn_QiangBanker", this.node).active = !this.DataMgr.IsMyBanker();
cc.find("Node_UI/Node_BankerBtn/Node_UpBanker", this.node).active = !this.DataMgr.IsMyBanker() && !e;
cc.find("Node_UI/Node_BankerBtn/Btn_DownBanker", this.node).active = e || this.DataMgr.IsMyBanker();
};
t.prototype.Play_TipsAction = function(e, t) {
var o = cc.find("Node_UI/Node_ActionTips", this.node);
o.stopAllActions();
if (1 == e || 2 == e || 3 == e) {
cc.find("Node_UI/Node_ActionTips/Img_KSXZ", this.node).active = 1 == e;
cc.find("Node_UI/Node_ActionTips/Img_TZXZ", this.node).active = 2 == e;
cc.find("Node_UI/Node_ActionTips/Img_LHZJ", this.node).active = 3 == e;
1 == e ? wAudioMgr.playSound("sound/START_W", "FQZS") : 2 == e && wAudioMgr.playSound("sound/STOP_W", "FQZS");
o.active = !0;
o.opacity = 0;
o.runAction(cc.sequence(cc.fadeTo(.5, 255), cc.delayTime(.5), cc.fadeTo(.5, 0), cc.callFunc(function() {
o.active = !1;
null == t || t();
})));
}
};
t.prototype.Play_DownTime = function(e, t) {
var o = cc.find("Node_BG/Sp_DownTime", this.node);
o.stopAllActions();
cc.find("Node_BG/Node_Text/Img_XZSJ", this.node).active = 1 == e;
cc.find("Node_BG/Node_Text/Img_KJSJ", this.node).active = 2 == e;
cc.find("Node_BG/Node_Text/Img_KXSJ", this.node).active = 0 == e;
t > 0 && o.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
o.getComponent(sp.Skeleton).setSkin("" + (t > 15 ? 15 : t));
wUIHelp.playSpine(o, "animation", function() {});
if (t <= 0) {
t = 0;
o.stopAllActions();
}
t < 5 && 1 == e && wAudioMgr.playSound("sound/TIME_WARIMG", "FQZS");
t % 2 == 1 && 0 != t && 1 == e && wAudioMgr.playSound("sound/ADD_GOLD_EX", "FQZS");
t -= 1;
}), cc.delayTime(1))));
};
t.prototype.Play_RegionFlicker = function(e) {
var t = cc.find("Node_UI/Node_Region/Node_" + e + "/Img_Act", this.node);
if (t) {
cc.find("Node_UI/Node_Region/Node_" + e + "/Img_Touch", this.node).active = !1;
t.active = !0;
t.opacity = 255;
t.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(.5), cc.fadeIn(.5))));
}
};
t.prototype.Play_WheelDiscAction = function(e, t, o) {
var n, a, i = this, r = this.DataMgr.GameData.MaxWheelDiscCount, c = e, d = cc.find("Node_UI/Node_WheelDisc", this.node), s = null, l = function() {
if (cc.isValid(s)) {
var e = cc.find("Img_Light", s);
if (e.active) {
e.stopAllActions();
e.runAction(cc.sequence(cc.fadeOut(.1), cc.callFunc(function() {
e.active = !1;
})));
}
}
s = null;
}, _ = function(e) {
l();
if (cc.isValid(d)) {
s = d.getChildByName("" + e);
cc.find("Img_Light", s).stopAllActions();
cc.find("Img_Light", s).active = !0;
cc.find("Img_Light", s).opacity = 255;
wAudioMgr.playSound("sound/TURN", "FQZS");
} else this.WheelAction && this.WheelAction.stop();
}, u = function(e, t) {
void 0 === t && (t = 1);
return (e += t) % r;
};
this.WheelAction && this.WheelAction.stop();
l();
var g = ((n = e) < (a = t) ? a - n : r - n + a) + 3 * r;
this.WheelAction = cc.tween({});
for (var p = 0; p < 8; p++) {
var f = this.NumberLerp(.022, .4, (8 - p) / 8);
this.WheelAction.then(cc.tween().call(function() {
_(c = u(c));
}).delay(f));
}
p = 0;
for (var h = g - 8 - 8; p < h; p++) this.WheelAction.then(cc.tween().call(function() {
_(c = u(c));
}).delay(.022));
for (p = 0; p < 8; p++) {
f = this.NumberLerp(.022, 1, p / 8);
0 == p ? this.WheelAction.then(cc.tween().call(function() {
_(c = u(c));
})) : this.WheelAction.then(cc.tween().delay(f).call(function() {
_(c = u(c));
}));
}
this.WheelAction.then(cc.tween().delay(.1).call(function() {
cc.isValid(d) ? o && o() : i.WheelAction && i.WheelAction.stop();
}));
this.WheelAction.start();
};
t.prototype.Play_RunJetton = function(e) {
var t = this;
if (!(e.Region < 1 || e.Region > 11)) {
var o = this.DataMgr.PoolItemTool.GetPoolItem("Jetton"), n = cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node);
n.addChild(o);
var a = o.Data;
a.Region = e.Region;
a.IsMy = !!e.IsMy;
a.Jetton = e.Jetton;
e.IsMy ? o.setPosition(this.GetNodeWorldPos(cc.find("Node_UI/Node_Jetton/Jetton_" + this.DataMgr.Get_JettonType(a.Jetton), this.node))) : o.setPosition(this.GetNodeWorldPos(cc.find("Node_UI/Node_Players", this.node)));
this.SetImg_Jetton(o, a.Jetton, !1);
n.Time || (n.Time = 0);
o.runAction(cc.sequence(cc.delayTime(e.DelTime || 0), cc.callFunc(function() {
var e = new Date().getTime();
if (e - n.Time > 150) {
n.Time = e;
o.RunAudio = !0;
}
}), cc.moveTo(e.IsMy ? .2 : .5, this.GetPos_RegionRandomPos(e.Region)), cc.callFunc(function() {
if (o.RunAudio) {
o.RunAudio = !1;
wAudioMgr.playSound("sound/ADD_GOLD", "FQZS");
}
t.SetText_AddRegionJetton(e.Region, e.Jetton);
e.IsMy && t.SetText_AddRegionSelfJetton(e.Region, e.Jetton);
})));
return o;
}
};
t.prototype.Play_EffectIconShow = function(e, t) {
var o = cc.find("Node_UI/Node_EffectShowAction", this.node);
o.active = !0;
for (var n = 0, a = cc.find("Node_Spines", o).children; n < a.length; n++) a[n].active = !1;
var i = function(e) {
wUIHelp.playSpine(e, "start", function() {
wUIHelp.playSpine(e, "idle", function() {
o.active = !1;
t && t();
});
});
};
switch (e) {
case this.DataMgr.WheelDiscType.YinSha:
wAudioMgr.playSound("sound/an/sound_an_11", "FQZS");
cc.find("Node_Spines/Spine_YSY", o).active = !0;
i(cc.find("Node_Spines/Spine_YSY", o));
break;

case this.DataMgr.WheelDiscType.JinSha:
wAudioMgr.playSound("sound/an/sound_an_12", "FQZS");
cc.find("Node_Spines/Spine_JSY", o).active = !0;
i(cc.find("Node_Spines/Spine_JSY", o));
break;

case this.DataMgr.WheelDiscType.TongChi:
wAudioMgr.playSound("sound/an/sound_an_14", "FQZS");
cc.find("Node_Spines/Spine_TC", o).active = !0;
i(cc.find("Node_Spines/Spine_TC", o));
break;

case this.DataMgr.WheelDiscType.TongPei:
wAudioMgr.playSound("sound/an/sound_an_13", "FQZS");
cc.find("Node_Spines/Spine_TP", o).active = !0;
i(cc.find("Node_Spines/Spine_TP", o));
break;

default:
cc.find("Node_Spines/Spine_DW", o).active = !0;
switch (e) {
case this.DataMgr.WheelDiscType.ShiZi:
wAudioMgr.playSound("sound/an/sound_an_3", "FQZS");
cc.find("Node_Spines/Spine_DW", o).getComponent(sp.Skeleton).setSkin("1");
break;

case this.DataMgr.WheelDiscType.XiongMao:
wAudioMgr.playSound("sound/an/sound_an_4", "FQZS");
cc.find("Node_Spines/Spine_DW", o).getComponent(sp.Skeleton).setSkin("2");
break;

case this.DataMgr.WheelDiscType.HouZi:
wAudioMgr.playSound("sound/an/sound_an_5", "FQZS");
cc.find("Node_Spines/Spine_DW", o).getComponent(sp.Skeleton).setSkin("4");
break;

case this.DataMgr.WheelDiscType.TuZi:
wAudioMgr.playSound("sound/an/sound_an_6", "FQZS");
cc.find("Node_Spines/Spine_DW", o).getComponent(sp.Skeleton).setSkin("3");
break;

case this.DataMgr.WheelDiscType.LaoYing:
wAudioMgr.playSound("sound/an/sound_an_7", "FQZS");
cc.find("Node_Spines/Spine_DW", o).getComponent(sp.Skeleton).setSkin("6");
break;

case this.DataMgr.WheelDiscType.KongQue:
wAudioMgr.playSound("sound/an/sound_an_8", "FQZS");
cc.find("Node_Spines/Spine_DW", o).getComponent(sp.Skeleton).setSkin("7");
break;

case this.DataMgr.WheelDiscType.GeZi:
wAudioMgr.playSound("sound/an/sound_an_9", "FQZS");
cc.find("Node_Spines/Spine_DW", o).getComponent(sp.Skeleton).setSkin("8");
break;

case this.DataMgr.WheelDiscType.YanZi:
wAudioMgr.playSound("sound/an/sound_an_10", "FQZS");
cc.find("Node_Spines/Spine_DW", o).getComponent(sp.Skeleton).setSkin("5");
}
i(cc.find("Node_Spines/Spine_DW", o));
}
};
t.prototype.Play_OneJettonAtion = function(e) {
var t = this, o = this.DataMgr.PoolItemTool.GetPoolItem("Jetton");
cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node).addChild(o);
e.StartPos && o.setPosition(e.StartPos);
this.SetImg_Jetton(o, e.Jetton, !1);
e.DelTime ? o.runAction(cc.sequence(cc.delayTime(e.DelTime), cc.moveTo(.5, e.EndPos), cc.callFunc(function() {
e.EndPos2 ? o.runAction(cc.sequence(cc.moveTo(.5, e.EndPos2), cc.callFunc(function() {
t.DataMgr.PoolItemTool.RemovePoolItem(o);
}))) : t.DataMgr.PoolItemTool.RemovePoolItem(o);
}))) : o.runAction(cc.sequence(cc.moveTo(.5, e.EndPos), cc.callFunc(function() {
e.EndPos2 ? o.runAction(cc.sequence(cc.moveTo(.5, e.EndPos2), cc.callFunc(function() {
t.DataMgr.PoolItemTool.RemovePoolItem(o);
}))) : t.DataMgr.PoolItemTool.RemovePoolItem(o);
})));
return o;
};
t.prototype.Play_JettonPointAction = function(e, t, o) {
var n = this, a = cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node).children, i = 0, r = 0, c = 0, d = 0;
if (0 == a.length) {
t && t();
o && o();
} else {
for (var s = {}, l = 0, _ = e; l < _.length; l++) {
var u = _[l];
s[u] = !0;
}
for (var g = this.GetNodeWorldPos(cc.find("Node_UI/Node_Banker", this.node)), p = this.GetNodeWorldPos(cc.find("Node_UI/Node_Players", this.node)), f = this.GetNodeWorldPos(cc.find("Node_UI/Node_User", this.node)), h = function(e) {
var l = a[e], _ = l.Data;
l.stopAllActions();
if (s[_.Region]) {
i++;
if (_.IsMy) for (var u = 0, h = m.DataMgr.WheelDiscConfigData[_.Region].Odds; u < h; u++) m.Play_OneJettonAtion({
Jetton: _.Jetton,
DelTime: wUtils.random(80, 200) / 100 * 1,
StartPos: l.getPosition(),
EndPos: f
});
m.Play_OneJettonAtion({
Jetton: _.Jetton,
DelTime: wUtils.random(50, 100) / 100,
StartPos: g,
EndPos: cc.v2(l.position),
EndPos2: _.IsMy ? f : p
});
l.runAction(cc.sequence(cc.delayTime(1), cc.moveTo(wUtils.random(80, 200) / 100 * .5, _.IsMy ? f : p).easing(cc.easeQuadraticActionInOut()), cc.callFunc(function() {
n.DataMgr.PoolItemTool.RemovePoolItem(l);
++c == i && o && o();
})));
} else {
r++;
l.runAction(cc.sequence(cc.moveTo(wUtils.random(80, 200) / 100 * .5, g).easing(cc.easeQuadraticActionInOut()), cc.callFunc(function() {
n.DataMgr.PoolItemTool.RemovePoolItem(l);
++d == r && t && t();
})));
}
}, m = this, y = 0, D = a.length; y < D; y++) h(y);
cc.find("Node_UI/Node_JettonEffect", this.node).stopAllActions();
}
};
t.prototype.Play_UpPlayerScore = function(e, t) {
var o = null;
if (1 == e) o = t >= 0 ? cc.find("Node_UI/Node_Players/Lab_UpScore", this.node) : cc.find("Node_UI/Node_Players/Lab_DownScore", this.node); else if (2 == e) o = t >= 0 ? cc.find("Node_UI/Node_User/Lab_UpScore", this.node) : cc.find("Node_UI/Node_User/Lab_DownScore", this.node); else {
if (3 != e) return;
o = t >= 0 ? cc.find("Node_UI/Node_Banker/Lab_UpScore", this.node) : cc.find("Node_UI/Node_Banker/Lab_DownScore", this.node);
}
o.stopAllActions();
o.active = !0;
o.y = 0;
o.opacity = 127;
o.getComponent(cc.Label).string = (t >= 0 ? "+" : "") + wUtils.numConvert(t);
o.runAction(cc.sequence(cc.spawn(cc.fadeIn(.3), cc.moveBy(.3, cc.v2(0, 30))), cc.delayTime(1), cc.spawn(cc.fadeOut(.3), cc.moveBy(.3, cc.v2(0, 30)))));
};
t.prototype.GetNodeWorldPos = function(e) {
var t = wUtils.local_world__POS(e);
t.x -= cc.winSize.width / 2;
t.y -= cc.winSize.height / 2;
return t;
};
t.prototype.AddSpineEvent = function(e, t) {
cc.isValid(e) && e.getComponent(sp.Skeleton).setCompleteListener(function(o) {
var n = o.animation ? o.animation.name : "";
t(e, n);
});
};
t.prototype.AddNodeClick = function(e, t, o) {
var n = e.active;
e.active = !1;
if (o) for (var a = function(n) {
switch (o[n]) {
case cc.Node.EventType.TOUCH_START:
case cc.Node.EventType.TOUCH_MOVE:
case cc.Node.EventType.TOUCH_END:
case cc.Node.EventType.TOUCH_CANCEL:
e.on("" + o[n], function(e) {
t(e, o[n]);
});
}
}, i = 0, r = o.length; i < r; i++) a(i); else {
e.on(cc.Node.EventType.TOUCH_START, function(e) {
t(e, cc.Node.EventType.TOUCH_START);
});
e.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
t(e, cc.Node.EventType.TOUCH_MOVE);
});
e.on(cc.Node.EventType.TOUCH_END, function(e) {
t(e, cc.Node.EventType.TOUCH_END);
});
e.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
t(e, cc.Node.EventType.TOUCH_CANCEL);
});
}
e.active = n;
};
t.prototype.NumberLerp = function(e, t, o) {
return o <= 0 ? e : o >= 1 ? t : t * o + e * (1 - o);
};
__decorate([ r({
type: cc.SpriteAtlas,
displayName: "筹码图集",
tooltip: "筹码图集"
}) ], t.prototype, "JettonAtlas", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {
DropDown: void 0
} ]
}, {}, [ "FQZS_Controlle", "FQZS_DataMgr", "FQZS_Load", "FQZS_PlayerList", "FQZS_PoolItemTool", "FQZS_View" ]);