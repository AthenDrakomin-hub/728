window.__require = function e(t, o, a) {
function n(r, c) {
if (!o[r]) {
if (!t[r]) {
var d = r.split("/");
d = d[d.length - 1];
if (!t[d]) {
var l = "function" == typeof __require && __require;
if (!c && l) return l(d, !0);
if (i) return i(d, !0);
throw new Error("Cannot find module '" + r + "'");
}
r = d;
}
var s = o[r] = {
exports: {}
};
t[r][0].call(s.exports, function(e) {
return n(t[r][1][e] || e);
}, s, s.exports, e, t, o, a);
}
return o[r].exports;
}
for (var i = "function" == typeof __require && __require, r = 0; r < a.length; r++) n(a[r]);
return n;
}({
BCBM_Controlle: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "bb31fzqV/9Fsbhblv0g1P29", "BCBM_Controlle");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = e("MultiBase"), n = e("Config"), i = e("BCBM_DataMgr"), r = e("BCBM_GameOver"), c = e("BCBM_View"), d = cc._decorator, l = d.ccclass;
d.property;
var s = function(e) {
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
this.DataMgr.Game_View.UpdateImg_ButtonJetton();
}
};
t.prototype.m_NetWorkState = function() {};
t.prototype.onLoad = function() {
this.DataMgr = new i.default();
this.DataMgr.Game_Controlle = this;
this.DataMgr.Game_View = this.node.getComponent(c.default);
this.DataMgr.Init();
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
wGEvent.on("Msg_BCBM_RoomInfo", function(t) {
if (1 == t.status) {
console.error("初始化房间", JSON.stringify(t));
var o = e.DataMgr.GameData;
o.CurChipCount = 0;
o.IsDown = !1;
o.PreparePutList = [];
e.DataMgr.Game_View.Play_CarMove({
IsInit: !0,
EndIndex: 0
});
e.DataMgr.Game_View.Play_CarLighting(!0);
o.GameType = +t.data.stage;
e.DataMgr.Game_View.Play_DownTime(o.GameType, t.data.time);
e.DataMgr.Game_View.Play_DelayWheelDisc(1 == o.GameType);
o.PlayerCount = +t.data.allnum;
e.DataMgr.Game_View.SetText_PlayerCount(o.PlayerCount);
o.BankerUser = {};
if (t.data.banker) {
o.BankerUser.Circle = +t.data.banker.circle;
o.BankerUser.Gold = +t.data.banker.gold;
o.BankerUser.UserName = "" + t.data.banker.nickname;
o.BankerUser.UserID = "" + t.data.banker.uid;
o.BankerUser.UserSex = +t.data.banker.sex;
o.BankerUser.UserHead = "" + t.data.banker.headimgurl;
e.DataMgr.Game_View.SetUI_Banker(o.BankerUser);
} else {
o.BankerUser.Circle = 0;
o.BankerUser.Gold = 0;
}
e.DataMgr.Game_View.SetText_ContinueBankerCount(o.BankerUser.Circle);
e.DataMgr.Game_View.SetText_BankerGold(o.BankerUser.Gold);
o.UpBankerList = t.data.bankerlist || [];
e.DataMgr.Game_View.SetText_UpBankerCount(o.UpBankerList.length);
e.DataMgr.Game_View.UpdateButton_Banker();
e.DataMgr.Game_View.SetUI_Player(o.PlayerUser);
e.DataMgr.Game_View.SetText_PlayerGold(o.PlayerUser.Gold);
o.BufferHistoryList = [];
for (var a = 0, n = t.data.history.length; a < n; a++) o.BufferHistoryList[a] = e.DataMgr.Get_ServerRegion_To_LocalRegion(t.data.history[a]);
1 != o.GameType && (o.BufferHistory = o.BufferHistoryList.pop());
e.DataMgr.Game_View.SetUI_HistoryList(o.BufferHistoryList);
o.CurWheelDiscIndex = 0;
o.BetOnRegionScore = {};
o.MyBetOnRegionScore = {};
for (a = 1; a <= 8; a++) {
o.BetOnRegionScore[a] = 0;
o.MyBetOnRegionScore[a] = 0;
}
if (t.data.mybet && Object.keys(t.data.mybet).length > 0) for (var i in t.data.mybet) if (t.data.mybet.hasOwnProperty(i)) {
o.IsDown = !0;
var r = t.data.mybet[i], c = e.DataMgr.Get_ServerRegion_To_LocalRegion(+i);
a = 0;
for (n = (d = e.DataMgr.ScoreSplit(+r)).length; a < n; a++) {
o.IsPrepare = !0;
o.PreparePutList.push({
Region: c,
Count: d[a]
});
}
}
e.DataMgr.Game_View.UpdateButton_XYType();
for (var i in t.data.mybet) if (t.data.mybet.hasOwnProperty(i)) {
o.IsDown = !0;
r = t.data.mybet[i];
c = e.DataMgr.Get_ServerRegion_To_LocalRegion(+i);
t.data.allbet[i] -= r;
t.data.allbet[i] < 0 && (t.data.allbet[i] = 0);
o.MyBetOnRegionScore[c] += +r;
a = 0;
for (n = (d = e.DataMgr.ScoreSplit(+r)).length; a < n; a++) e.DataMgr.Game_View.SetUI_AddDesktopJettonIcon({
Region: c,
JettonCount: +d[a],
IsMy: !0
});
}
for (var i in t.data.allbet) if (t.data.allbet.hasOwnProperty(i)) {
r = t.data.allbet[i];
c = e.DataMgr.Get_ServerRegion_To_LocalRegion(+i);
o.BetOnRegionScore[c] += +r;
var d;
a = 0;
for (n = (d = e.DataMgr.ScoreSplit(+r)).length; a < n; a++) e.DataMgr.Game_View.SetUI_AddDesktopJettonIcon({
Region: c,
JettonCount: +d[a],
IsMy: !1
});
}
for (a = 1; a <= 8; a++) {
e.DataMgr.Game_View.SetText_RegionJetton(a, o.BetOnRegionScore[a]);
e.DataMgr.Game_View.SetText_RegionSelfJetton(a, o.MyBetOnRegionScore[a]);
}
e.DataMgr.Game_View.UpdateImg_ButtonJetton();
t.data.result && 2 == o.GameType && e.GameOver(t.data.result, !0);
} else wLog.e("初始化房间");
}, this);
wGEvent.on("Msg_BCBM_ActBet", function(t) {
if (1 == t.status) {
var o = e.DataMgr.GameData;
e.DataMgr.Game_View.Play_CarLighting(!0);
for (var a = e.DataMgr.Get_ServerRegion_To_LocalRegion(+t.data.region), n = e.DataMgr.ScoreSplit(+t.data.gold), i = 0, r = n.length; i < r; i++) e.DataMgr.Game_View.Play_RunJetton({
Region: a,
JettonCount: +n[i],
DelTime: 0,
IsMy: !0
});
o.IsDown = !0;
o.BetOnRegionScore[a] += +t.data.gold;
o.MyBetOnRegionScore[a] += +t.data.gold;
e.DataMgr.Game_View.UpdateButton_XYType();
e.DataMgr.Game_View.UpdateImg_ButtonJetton();
o.PlayerUser.Gold -= +t.data.gold;
e.DataMgr.Game_View.SetText_PlayerGold(o.PlayerUser.Gold);
if (o.IsPrepare) {
o.IsPrepare = !1;
o.PreparePutList = [];
}
o.PreparePutList.push({
Region: a,
Count: +t.data.gold
});
} else wLog.e("玩家下注");
}, this);
wGEvent.on("Msg_BCBM_SysActBet", function(t) {
if (1 == t.status) {
var o = e.DataMgr.GameData;
for (var a in t.data.bets) if (t.data.bets.hasOwnProperty(a)) {
var n = t.data.bets[a], i = e.DataMgr.Get_ServerRegion_To_LocalRegion(+a), r = e.DataMgr.ScoreSplit(+n - +o.BetOnRegionScore[i]);
o.BetOnRegionScore[i] = +n;
for (var c = 2 / r.length, d = 0, l = r.length; d < l; d++) e.DataMgr.Game_View.Play_RunJetton({
Region: i,
JettonCount: +r[d],
DelTime: d * c,
IsMy: !1
});
}
} else wLog.e("同步下注信息");
}, this);
wGEvent.on("Msg_BCBM_StageBet", function(t) {
var o, a, n;
if (1 == t.status) {
null === (a = null === (o = e.node.getChildByName("GameOver")) || void 0 === o ? void 0 : o.getComponent(r.default)) || void 0 === a || a.Hide();
cc.find("Node_UI/Node_JettonEffect/Node_Root", e.node).stopAllActions();
null === (n = e.DataMgr.Game_View.WheelAction) || void 0 === n || n.stop();
var i = e.DataMgr.GameData;
i.GameType = 1;
e.DataMgr.Game_View.Play_SwitchStage(1);
i.IsDown = !1;
e.DataMgr.Game_View.Close_RegionJetton();
if (i.BufferHistory) {
i.BufferHistoryList.push(i.BufferHistory);
i.BufferHistory = null;
}
e.DataMgr.Game_View.SetUI_HistoryList(i.BufferHistoryList);
i.IsPrepare = !0;
e.DataMgr.Game_View.UpdateButton_XYType();
e.DataMgr.Game_View.UpdateImg_ButtonJetton();
e.DataMgr.Game_View.Play_DownTime(i.GameType, t.data.time);
e.DataMgr.Game_View.Close_RegionJettonText();
i.BetOnRegionScore = {};
i.MyBetOnRegionScore = {};
for (var c = 1; c <= 8; c++) {
i.BetOnRegionScore[c] = 0;
i.MyBetOnRegionScore[c] = 0;
}
e.DataMgr.Game_View.Play_CarMove({
IsInit: !0,
EndIndex: i.CurWheelDiscIndex < 0 ? 0 : i.CurWheelDiscIndex
});
e.DataMgr.Game_View.Play_DelayWheelDisc(!0);
e.DataMgr.Game_View.SetText_ContinueBankerCount(++i.BankerUser.Circle);
} else wLog.e("下注阶段");
}, this);
wGEvent.on("Msg_BCBM_StageEnd", function(t) {
if (1 == t.status) {
e.DataMgr.Game_View.Play_DelayWheelDisc(!1);
e.GameOver(t.data, !1);
} else wLog.e("结算阶段");
}, this);
wGEvent.on("Msg_BCBM_ToBanker", function(t) {
if (1 == t.status) {
var o = e.DataMgr.GameData, a = -1 != e.DataMgr.GameData.UpBankerList.indexOf(+e.DataMgr.GameData.PlayerUser.UserID);
o.UpBankerList = t.data.list || [];
var n = -1 != e.DataMgr.GameData.UpBankerList.indexOf(+e.DataMgr.GameData.PlayerUser.UserID);
e.DataMgr.Game_View.SetText_UpBankerCount(o.UpBankerList.length);
e.DataMgr.Game_View.UpdateButton_Banker();
!a && n ? wUIManager.showTips("上庄申请成功") : a && !n && wUIManager.showTips("下庄申请成功");
} else wLog.e("玩家上庄");
}, this);
wGEvent.on("Msg_BCBM_BankerInfo", function(t) {
if (1 == t.status) {
var o = e.DataMgr.GameData;
o.BankerUser.UserID == o.PlayerUser.UserID && o.PlayerUser.UserID != "" + t.data.uid && wUIManager.showTips("下庄申请成功");
o.BankerUser = {};
if (t.data) {
o.BankerUser.Circle = 0;
o.BankerUser.Gold = +t.data.gold;
o.BankerUser.UserName = "" + t.data.nickname;
o.BankerUser.UserID = "" + t.data.uid;
o.BankerUser.UserSex = t.data.sex || 1;
o.BankerUser.UserHead = "" + t.data.headimgurl;
e.DataMgr.Game_View.SetUI_Banker(o.BankerUser);
} else {
o.BankerUser.Circle = 0;
o.BankerUser.Gold = 0;
}
e.DataMgr.Game_View.SetText_ContinueBankerCount(o.BankerUser.Circle);
e.DataMgr.Game_View.SetText_BankerGold(o.BankerUser.Gold);
} else wLog.e("庄家信息");
}, this);
wGEvent.on("Msg_BCBM_PlayerAct", function(t) {
if (1 == t.status) {
var o = e.DataMgr.GameData;
o.PlayerCount++;
e.DataMgr.Game_View.SetText_PlayerCount(o.PlayerCount);
} else wLog.e("加入玩家");
}, this);
wGEvent.on("Msg_BCBM_Out", function(t) {
if (1 == t.status) {
var o = e.DataMgr.GameData;
o.PlayerCount--;
e.DataMgr.Game_View.SetText_PlayerCount(o.PlayerCount);
} else wLog.e("玩家退出");
}, this);
};
t.OpenGame = function() {
var e = n.Config.GamePrefab[7];
wRes.loadRes(e.prefabUrl, function() {}, function(e, t) {
e ? wLog.e(e) : wViewMgr.openGame(t);
}, e.enName);
};
t.prototype.GameOver = function(e, t) {
var o = this, a = this.DataMgr.GameData;
a.GameType = 2;
a.GameOverData = {
IsWin: +e.win >= 0,
IconType: this.DataMgr.Get_LocalIndex_To_LocalIcon(this.DataMgr.Get_ServerIcon_To_LocalIndex(+e.result)),
BankerData: {
Name: a.BankerUser.UserName,
Score: +e.bankerwin
},
PlayerData: {
Name: a.PlayerUser.UserName,
Score: +e.win,
IsDown: a.IsDown
},
PlayerListData: []
};
console.error(a.GameOverData);
for (var n in e.bigwin) e.bigwin.hasOwnProperty(n) && (+e.bigwin[n].win < 0 || a.GameOverData.PlayerListData.push({
Name: "" + e.bigwin[n].nickname,
Score: +e.bigwin[n].win
}));
a.GameOverData.PlayerListData.sort(function(e, t) {
return t.Score - e.Score;
});
a.PlayerUser.Gold = +e.gold;
a.BankerUser.Gold += +e.bankerwin;
a.IsDown = !1;
var i = a.CurWheelDiscIndex;
a.CurWheelDiscIndex = this.DataMgr.Get_ServerIcon_To_LocalIndex(+e.result);
if (t) {
this.DataMgr.Game_View.Play_CarMove({
IsInit: !0,
EndIndex: a.CurWheelDiscIndex < 0 ? 0 : a.CurWheelDiscIndex
});
this.DataMgr.Game_View.Play_JettonPointAction(this.DataMgr.Get_LocalIndex_To_LocalIcon(a.CurWheelDiscIndex), function() {
o.DataMgr.Game_View.SetText_BankerGold(a.BankerUser.Gold);
o.DataMgr.Game_View.SetText_PlayerGold(a.PlayerUser.Gold);
o.DataMgr.Game_View.OpenGameOver();
a.BufferHistory && (a.BufferHistory = null);
a.BufferHistoryList.length >= 20 && a.BufferHistoryList.shift();
a.BufferHistoryList.push(o.DataMgr.Get_LocalIndex_To_LocalIcon(a.CurWheelDiscIndex));
o.DataMgr.Game_View.SetUI_HistoryList(a.BufferHistoryList);
});
} else this.DataMgr.Game_View.Play_SwitchStage(2, function() {
o.DataMgr.Game_View.Play_WheelDiscAction(i, a.CurWheelDiscIndex, function() {
o.DataMgr.Game_View.Play_JettonPointAction(o.DataMgr.Get_LocalIndex_To_LocalIcon(a.CurWheelDiscIndex), function() {
o.DataMgr.Game_View.SetText_BankerGold(a.BankerUser.Gold);
o.DataMgr.Game_View.SetText_PlayerGold(a.PlayerUser.Gold);
o.DataMgr.Game_View.OpenGameOver();
10 == a.BankerUser.Circle && o.DataMgr.Game_View.Play_SwitchStage(3);
a.BufferHistoryList.length >= 20 && a.BufferHistoryList.shift();
a.BufferHistoryList.push(o.DataMgr.Get_LocalIndex_To_LocalIcon(a.CurWheelDiscIndex));
o.DataMgr.Game_View.SetUI_HistoryList(a.BufferHistoryList);
});
});
});
this.DataMgr.GameData.CurChipCount = 0;
this.DataMgr.Game_View.UpdateImg_ButtonJetton();
this.DataMgr.Game_View.Play_DownTime(a.GameType, e.time);
this.DataMgr.Game_View.UpdateButton_XYType();
};
return __decorate([ l ], t);
}(a.default);
o.default = s;
cc._RF.pop();
}, {
BCBM_DataMgr: "BCBM_DataMgr",
BCBM_GameOver: "BCBM_GameOver",
BCBM_View: "BCBM_View",
Config: void 0,
MultiBase: void 0
} ],
BCBM_DataMgr: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "c82d8LmH0NHErcF/CoHK+u8", "BCBM_DataMgr");
var a, n, i, r, c;
Object.defineProperty(o, "__esModule", {
value: !0
});
var d = e("BCBM_PoolItemTool");
(function(e) {
e[e.Big_BaoShiJie = 1] = "Big_BaoShiJie";
e[e.Big_BenChi = 2] = "Big_BenChi";
e[e.Big_BaoMa = 3] = "Big_BaoMa";
e[e.Big_DaZhong = 4] = "Big_DaZhong";
e[e.Small_BaoShiJie = 5] = "Small_BaoShiJie";
e[e.Small_BenChi = 6] = "Small_BenChi";
e[e.Small_BaoMa = 7] = "Small_BaoMa";
e[e.Small_DaZhong = 8] = "Small_DaZhong";
})(c || (c = {}));
(a = {})[c.Big_BaoShiJie] = {
LocalRegion: c.Big_BaoShiJie,
ServerRegion: 21,
Odds: 40
};
a[c.Big_BenChi] = {
LocalRegion: c.Big_BenChi,
ServerRegion: 22,
Odds: 30
};
a[c.Big_BaoMa] = {
LocalRegion: c.Big_BaoMa,
ServerRegion: 23,
Odds: 20
};
a[c.Big_DaZhong] = {
LocalRegion: c.Big_DaZhong,
ServerRegion: 24,
Odds: 10
};
a[c.Small_BaoShiJie] = {
LocalRegion: c.Small_BaoShiJie,
ServerRegion: 11,
Odds: 5
};
a[c.Small_BenChi] = {
LocalRegion: c.Small_BenChi,
ServerRegion: 12,
Odds: 5
};
a[c.Small_BaoMa] = {
LocalRegion: c.Small_BaoMa,
ServerRegion: 13,
Odds: 5
};
a[c.Small_DaZhong] = {
LocalRegion: c.Small_DaZhong,
ServerRegion: 14,
Odds: 5
};
var l = a;
(n = {})[l[c.Big_BaoShiJie].ServerRegion + "1"] = 2;
n[l[c.Big_BaoShiJie].ServerRegion + "2"] = 10;
n[l[c.Big_BaoShiJie].ServerRegion + "3"] = 18;
n[l[c.Big_BaoShiJie].ServerRegion + "4"] = 26;
n[l[c.Big_BenChi].ServerRegion + "1"] = 4;
n[l[c.Big_BenChi].ServerRegion + "2"] = 12;
n[l[c.Big_BenChi].ServerRegion + "3"] = 20;
n[l[c.Big_BenChi].ServerRegion + "4"] = 28;
n[l[c.Big_BaoMa].ServerRegion + "1"] = 6;
n[l[c.Big_BaoMa].ServerRegion + "2"] = 14;
n[l[c.Big_BaoMa].ServerRegion + "3"] = 22;
n[l[c.Big_BaoMa].ServerRegion + "4"] = 30;
n[l[c.Big_DaZhong].ServerRegion + "1"] = 0;
n[l[c.Big_DaZhong].ServerRegion + "2"] = 8;
n[l[c.Big_DaZhong].ServerRegion + "3"] = 16;
n[l[c.Big_DaZhong].ServerRegion + "4"] = 24;
n[l[c.Small_BaoShiJie].ServerRegion + "1"] = 3;
n[l[c.Small_BaoShiJie].ServerRegion + "2"] = 11;
n[l[c.Small_BaoShiJie].ServerRegion + "3"] = 19;
n[l[c.Small_BaoShiJie].ServerRegion + "4"] = 27;
n[l[c.Small_BenChi].ServerRegion + "1"] = 5;
n[l[c.Small_BenChi].ServerRegion + "2"] = 13;
n[l[c.Small_BenChi].ServerRegion + "3"] = 21;
n[l[c.Small_BenChi].ServerRegion + "4"] = 29;
n[l[c.Small_BaoMa].ServerRegion + "1"] = 7;
n[l[c.Small_BaoMa].ServerRegion + "2"] = 15;
n[l[c.Small_BaoMa].ServerRegion + "3"] = 23;
n[l[c.Small_BaoMa].ServerRegion + "4"] = 31;
n[l[c.Small_DaZhong].ServerRegion + "1"] = 1;
n[l[c.Small_DaZhong].ServerRegion + "2"] = 9;
n[l[c.Small_DaZhong].ServerRegion + "3"] = 17;
n[l[c.Small_DaZhong].ServerRegion + "4"] = 25;
var s = n;
(i = {})[0] = c.Big_DaZhong;
i[1] = c.Small_DaZhong;
i[2] = c.Big_BaoShiJie;
i[3] = c.Small_BaoShiJie;
i[4] = c.Big_BenChi;
i[5] = c.Small_BenChi;
i[6] = c.Big_BaoMa;
i[7] = c.Small_BaoMa;
i[8] = c.Big_DaZhong;
i[9] = c.Small_DaZhong;
i[10] = c.Big_BaoShiJie;
i[11] = c.Small_BaoShiJie;
i[12] = c.Big_BenChi;
i[13] = c.Small_BenChi;
i[14] = c.Big_BaoMa;
i[15] = c.Small_BaoMa;
i[16] = c.Big_DaZhong;
i[17] = c.Small_DaZhong;
i[18] = c.Big_BaoShiJie;
i[19] = c.Small_BaoShiJie;
i[20] = c.Big_BenChi;
i[21] = c.Small_BenChi;
i[22] = c.Big_BaoMa;
i[23] = c.Small_BaoMa;
i[24] = c.Big_DaZhong;
i[25] = c.Small_DaZhong;
i[26] = c.Big_BaoShiJie;
i[27] = c.Small_BaoShiJie;
i[28] = c.Big_BenChi;
i[29] = c.Small_BenChi;
i[30] = c.Big_BaoMa;
i[31] = c.Small_BaoMa;
var _ = i;
(r = {})[0] = .08;
r[1] = .11;
r[2] = .142;
r[3] = .169;
r[4] = .198;
r[5] = .225;
r[6] = .252;
r[7] = .28;
r[8] = .306;
r[9] = .332;
r[10] = .363;
r[11] = .394;
r[12] = .438;
r[13] = .471;
r[14] = .497;
r[15] = .525;
r[16] = .575;
r[17] = .607;
r[18] = .641;
r[19] = .669;
r[20] = .695;
r[21] = .722;
r[22] = .748;
r[23] = .773;
r[24] = .8;
r[25] = .828;
r[26] = .86;
r[27] = .898;
r[28] = .943;
r[29] = .972;
r[30] = 0;
r[31] = .04;
var g = r, f = [ 1e3, 1e4, 1e5, 1e6, 5e6, 1e7 ], h = function() {
function e() {}
e.prototype.Init = function() {
this.GameData = {};
this.GameData.MaxWheelDiscCount = 32;
this.GameData.SelfUserID = "" + wGameData.getKey("uid");
this.GameData.PlayerUser = {};
this.GameData.PlayerUser.UserID = "" + wGameData.getKey("uid");
this.GameData.PlayerUser.UserName = "" + wGameData.getKey("nickname");
this.GameData.PlayerUser.UserHead = +wGameData.getKey("headimgurl");
this.GameData.PlayerUser.Gold = +wGameData.getKey("gold");
this.GameData.BankerUser = {};
this.GameData.JettonBufferPosList = {};
this.PoolItemTool = new d.default();
this.GameData.GameOverData = {};
};
e.prototype.Close = function() {
var e;
null === (e = this.PoolItemTool) || void 0 === e || e.Clear();
};
e.prototype.Get_IndexData = function(e) {
var t = {
NextIndex: e + 1,
CurIndex: e,
FrontIndex: e - 1
};
t.NextIndex >= this.GameData.MaxWheelDiscCount && (t.NextIndex -= this.GameData.MaxWheelDiscCount);
t.FrontIndex < 0 && (t.FrontIndex += this.GameData.MaxWheelDiscCount);
return t;
};
e.prototype.Get_WheelDiscTypeData = function(e) {
return l[e];
};
e.prototype.Get_ServerRegion_To_LocalRegion = function(e) {
for (var t in l) if (l.hasOwnProperty(t)) {
var o = l[t];
if (o.ServerRegion == e) return o.LocalRegion;
}
return 0;
};
e.prototype.Get_ServerIcon_To_LocalIndex = function(e) {
return s[e];
};
e.prototype.Get_LocalIndex_To_LocalIcon = function(e) {
return _[e];
};
e.prototype.Get_SpineCarPoint = function(e) {
return g[e];
};
e.prototype.Get_ChipButtonUp = function() {
if (this.GameData.PlayerUser.Gold >= this.GameData.CurChipCount) {
for (var e = 0, t = f.length; e < t; e++) if ((o = f[e]) == this.GameData.CurChipCount) return e + 1;
} else {
e = f.length - 1;
for (t = 0; e >= t; e--) {
var o = f[e];
if (this.GameData.PlayerUser.Gold >= o) {
this.GameData.CurChipCount = o;
return e + 1;
}
}
}
return 0;
};
e.prototype.Get_JettonType = function(e) {
for (var t = 0, o = f.length; t < o; t++) if (f[t] == e) return t + 1;
return 1;
};
e.prototype.Get_JettonIDToCount = function(e) {
return f[e - 1];
};
e.prototype.ScoreSplit = function(e) {
if (0 == e) return [];
for (var t = f, o = [], a = t.length - 1; ;) {
var n = -1;
if (e >= t[a]) n = wUtils.random(0, a); else for (var i = a - 1; i > -1; i--) if (e >= t[i]) {
n = i;
break;
}
if (n >= 0) {
var r = t[n];
o.push(r);
e -= r;
} else console.error("异常", e);
if (e <= 0 || e < t[0]) return o;
}
};
e.prototype.MaxScoreSplit = function(e) {
for (var t = [], o = 5; o > -1; o--) for (var a = f[o]; e >= a; ) {
t.push(a);
e -= a;
}
return t;
};
e.prototype.Check_XT = function() {
for (var e = this.GameData.BankerUser.UserID != this.GameData.PlayerUser.UserID && 1 == this.GameData.GameType, t = 0, o = 0, a = this.GameData.PreparePutList.length; o < a; o++) t += this.GameData.PreparePutList[o].Count;
return !(!e || 0 == t || !this.GameData.IsPrepare);
};
e.prototype.Check_GoldMeetJetton = function(e) {
return this.GameData.PlayerUser.Gold >= e;
};
e.prototype.IsMyBanker = function() {
return !!this.GameData.BankerUser.UserID && this.GameData.BankerUser.UserID == this.GameData.SelfUserID;
};
e.prototype.GetNodeWorldPos = function(e) {
var t = wUtils.local_world__POS(e);
t.x -= cc.winSize.width / 2;
t.y -= cc.winSize.height / 2;
return t;
};
e.prototype.AddNodeClick = function(e, t, o) {
var a = e.active;
e.active = !1;
if (o) for (var n = function(a) {
switch (o[a]) {
case cc.Node.EventType.TOUCH_START:
case cc.Node.EventType.TOUCH_MOVE:
case cc.Node.EventType.TOUCH_END:
case cc.Node.EventType.TOUCH_CANCEL:
e.on("" + o[a], function(e) {
t(e, o[a]);
});
}
}, i = 0, r = o.length; i < r; i++) n(i); else {
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
e.active = a;
};
e.prototype.ConfigNum = function(e, t, o) {
return e < 0 ? "-" + wUtils.goldFormat(Math.abs(e), t, o) : wUtils.goldFormat(Math.abs(e), t, o);
};
e.prototype.NumberLerp = function(e, t, o) {
return o <= 0 ? e : o >= 1 ? t : t * o + e * (1 - o);
};
return e;
}();
o.default = h;
cc._RF.pop();
}, {
BCBM_PoolItemTool: "BCBM_PoolItemTool"
} ],
BCBM_GameOver: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "f3d00KMSwBMRZu25EedgcpH", "BCBM_GameOver");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = cc._decorator, n = a.ccclass;
a.property;
var i = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.start = function() {
this.Init_Node();
};
t.prototype.Init_Node = function() {
var e = this;
this.DataMgr.AddNodeClick(cc.find("Node_Controller/Node_View/Btn_OK", this.node), function() {
wAudioMgr.playBtnSound();
e.Hide();
}, [ cc.Node.EventType.TOUCH_END ]);
};
t.prototype.Hide = function() {
var e = this;
cc.find("Img_Mask", this.node).opacity = 0;
cc.find("Node_Controller", this.node).runAction(cc.sequence(cc.spawn(cc.scaleTo(.2, .2), cc.fadeTo(.2, 0)), cc.callFunc(function() {
e.node.destroy();
})));
};
t.prototype.Show = function(e) {
var t = this;
this.DataMgr = e;
cc.find("Node_Controller/Node_View", this.node).runAction(cc.sequence(cc.scaleTo(.3, 1.2), cc.scaleTo(.3, 1)));
cc.find("Node_Controller/Node_View/Node_Win", this.node).active = this.DataMgr.GameData.GameOverData.IsWin;
cc.find("Node_Controller/Node_View/Node_Lost", this.node).active = !this.DataMgr.GameData.GameOverData.IsWin;
cc.find("Node_Controller/Sp_Win", this.node).active = !1;
cc.find("Node_Controller/Sp_Lost", this.node).active = !1;
if (this.DataMgr.GameData.GameOverData.IsWin) {
cc.find("Node_Controller/Sp_Win", this.node).active = !0;
wUIHelp.playSpine(cc.find("Node_Controller/Sp_Win", this.node), "start", function() {
wUIHelp.playSpine(cc.find("Node_Controller/Sp_Win", t.node), "idle", function() {});
});
for (var o = 0, a = cc.find("Node_Controller/Node_View/Node_Win/Node_Addr", this.node).children; o < a.length; o++) a[o].active = !1;
cc.find("Node_Controller/Node_View/Node_Win/Node_Addr/" + this.DataMgr.Get_WheelDiscTypeData(this.DataMgr.GameData.GameOverData.IconType).Odds, this.node).active = !0;
wAudioMgr.playSound("sound/GAME_WIN", "BCBM");
} else {
cc.find("Node_Controller/Sp_Lost", this.node).active = !0;
wUIHelp.playSpine(cc.find("Node_Controller/Sp_Lost", this.node), "start", function() {
wUIHelp.playSpine(cc.find("Node_Controller/Sp_Lost", t.node), "idle", function() {});
});
for (var n = 0, i = cc.find("Node_Controller/Node_View/Node_Lost/Node_Addr", this.node).children; n < i.length; n++) i[n].active = !1;
cc.find("Node_Controller/Node_View/Node_Lost/Node_Addr/" + this.DataMgr.Get_WheelDiscTypeData(this.DataMgr.GameData.GameOverData.IconType).Odds, this.node).active = !0;
wAudioMgr.playSound("sound/GAME_LOSE", "BCBM");
}
for (var r = 0, c = cc.find("Node_Controller/Node_View/Img_Icon", this.node).children; r < c.length; r++) c[r].active = !1;
for (var d = 0, l = cc.find("Node_Controller/Node_View/Img_IconDI", this.node).children; d < l.length; d++) l[d].active = !1;
cc.find("Node_Controller/Node_View/Img_Icon/" + this.DataMgr.GameData.GameOverData.IconType, this.node).active = !0;
cc.find("Node_Controller/Node_View/Img_IconDI/" + this.DataMgr.GameData.GameOverData.IconType, this.node).active = !0;
for (var s = 0, _ = cc.find("Node_Controller/Node_View/Node_List", this.node).children; s < _.length; s++) {
var g = _[s];
cc.find("Node_GameType/Img_Win", g).active = this.DataMgr.GameData.GameOverData.IsWin;
cc.find("Node_GameType/Img_Lost", g).active = !this.DataMgr.GameData.GameOverData.IsWin;
}
for (var f = 3, h = 3; h <= 7; h++) (p = cc.find("Node_Controller/Node_View/Node_List/" + f++, this.node)).active = !1;
f = 3;
for (var u = 0, m = this.DataMgr.GameData.GameOverData.PlayerListData; u < m.length; u++) {
var p;
g = m[u];
if (p = cc.find("Node_Controller/Node_View/Node_List/" + f++, this.node)) {
p.active = !0;
cc.find("Node_Info/Lab_Name", p).getComponent(cc.Label).string = "" + g.Name;
cc.find("Node_Info/Lab_LostGold", p).active = !this.DataMgr.GameData.GameOverData.IsWin;
cc.find("Node_Info/Lab_WinGold", p).active = this.DataMgr.GameData.GameOverData.IsWin;
cc.find("Node_Info/Lab_LostGold", p).getComponent(cc.Label).string = (g.Score > 0 ? "+" : "") + wUtils.numConvert(g.Score);
cc.find("Node_Info/Lab_WinGold", p).getComponent(cc.Label).string = (g.Score > 0 ? "+" : "") + wUtils.numConvert(g.Score);
}
}
cc.find("Node_Controller/Node_View/Node_List/1/Node_Info/Lab_Name", this.node).getComponent(cc.Label).string = "" + this.DataMgr.GameData.GameOverData.PlayerData.Name;
cc.find("Node_Controller/Node_View/Node_List/1/Node_Info/Img_WXZ", this.node).active = !this.DataMgr.GameData.GameOverData.PlayerData.IsDown;
cc.find("Node_Controller/Node_View/Node_List/1/Node_Info/Img_WTZ", this.node).active = this.DataMgr.GameData.GameOverData.PlayerData.IsDown && 0 == this.DataMgr.GameData.GameOverData.PlayerData.Score;
cc.find("Node_Controller/Node_View/Node_List/1/Node_Info/Lab_LostGold", this.node).active = this.DataMgr.GameData.GameOverData.PlayerData.IsDown && this.DataMgr.GameData.GameOverData.PlayerData.Score < 0;
cc.find("Node_Controller/Node_View/Node_List/1/Node_Info/Lab_WinGold", this.node).active = this.DataMgr.GameData.GameOverData.PlayerData.IsDown && this.DataMgr.GameData.GameOverData.PlayerData.Score > 0;
cc.find("Node_Controller/Node_View/Node_List/1/Node_Info/Lab_LostGold", this.node).getComponent(cc.Label).string = "" + wUtils.numConvert(this.DataMgr.GameData.GameOverData.PlayerData.Score);
cc.find("Node_Controller/Node_View/Node_List/1/Node_Info/Lab_WinGold", this.node).getComponent(cc.Label).string = "+" + wUtils.numConvert(this.DataMgr.GameData.GameOverData.PlayerData.Score);
cc.find("Node_Controller/Node_View/Node_List/2/Node_Info/Lab_Name", this.node).getComponent(cc.Label).string = "" + this.DataMgr.GameData.GameOverData.BankerData.Name;
cc.find("Node_Controller/Node_View/Node_List/2/Node_Info/Lab_LostGold", this.node).active = this.DataMgr.GameData.GameOverData.BankerData.Score < 0;
cc.find("Node_Controller/Node_View/Node_List/2/Node_Info/Lab_WinGold", this.node).active = this.DataMgr.GameData.GameOverData.BankerData.Score > 0;
cc.find("Node_Controller/Node_View/Node_List/2/Node_Info/Lab_LostGold", this.node).getComponent(cc.Label).string = "" + wUtils.numConvert(this.DataMgr.GameData.GameOverData.BankerData.Score);
cc.find("Node_Controller/Node_View/Node_List/2/Node_Info/Lab_WinGold", this.node).getComponent(cc.Label).string = "+" + wUtils.numConvert(this.DataMgr.GameData.GameOverData.BankerData.Score);
cc.find("Node_Controller/Node_View/Node_List/1/Node_GameType", this.node).scaleY = .7;
cc.find("Node_Controller/Node_View/Node_List/2/Node_GameType", this.node).scaleY = .2;
cc.find("Node_Controller/Node_View/Node_List/1/Node_GameType", this.node).runAction(cc.scaleTo(.5, 1));
cc.find("Node_Controller/Node_View/Node_List/2/Node_GameType", this.node).runAction(cc.scaleTo(.5, 1));
cc.find("Node_Controller/Node_View/Node_List/1/Node_Info", this.node).scaleY = 0;
cc.find("Node_Controller/Node_View/Node_List/2/Node_Info", this.node).scaleY = 0;
cc.find("Node_Controller/Node_View/Node_List/1/Node_Info", this.node).runAction(cc.sequence(cc.delayTime(.5), cc.scaleTo(.5, 1)));
cc.find("Node_Controller/Node_View/Node_List/2/Node_Info", this.node).runAction(cc.sequence(cc.delayTime(.5), cc.scaleTo(.5, 1)));
};
return __decorate([ n ], t);
}(cc.Component);
o.default = i;
cc._RF.pop();
}, {} ],
BCBM_Load: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "1efc5ZhFf1Ev4zIdVajMaVM", "BCBM_Load");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = e("Config"), n = cc._decorator, i = n.ccclass;
n.property;
var r = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t, o = this;
return __generator(this, function(n) {
switch (n.label) {
case 0:
e = a.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir(e.prefabUrl, e.enName);
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
return [ 4, new Promise(function(e) {
var t = o.node.getChildByName("Sp_Load");
wUIHelp.playSpine(t, "start", function() {
wUIHelp.playSpine(t, "idle", function() {
t.active = !1;
}, !1);
e();
});
}) ];

case 1:
n.sent();
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
var e = this, t = a.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(t.prefabUrl, function() {}, function(t, o) {
if (t) wLog.e(t); else {
e.node.runAction(cc.sequence(cc.fadeOut(1), cc.callFunc(function() {
e.node.destroy();
})));
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
return __decorate([ i ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {
Config: void 0
} ],
BCBM_PlayerList: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "69443k+N6hL/4v5sRHHocpM", "BCBM_PlayerList");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = e("PopupBase"), n = cc._decorator, i = n.ccclass;
n.property;
var r = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.init = function(e) {
var t = this;
this.DataMgr = e.DataMgr;
this.Init_Node();
this.Init_View();
this.Init_Event();
new Promise(function(e) {
wGEvent.clear("Msg_BCBM_GetUserList");
wGEvent.on("Msg_BCBM_GetUserList", function(t) {
if (1 == t.status) {
console.error("玩家列表", t);
e(t);
} else wLog.e("玩家列表");
}, t);
wNetWork.send("Msg_BCBM_GetUserList", {}, !0);
}).then(function(e) {
var o = Object.keys(e.data).length;
if (o > 0) for (var a in e.data) if (e.data.hasOwnProperty(a)) {
var n = e.data[a];
t.Create_Player({
Sex: n.sex,
Name: n.username,
HeadPath: n.headimgurl,
Gold: +n.gold
});
}
t.SetText_PlayerCount(o);
});
};
t.prototype.onDestroy = function() {
wGEvent.clear("Msg_BCBM_GetUserList");
};
t.prototype.Init_Node = function() {
var e = this;
this.DataMgr.AddNodeClick(cc.find("Node_Controller/Btn_Close", this.node), function() {
wAudioMgr.playBtnSound();
e.hide();
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.AddNodeClick(cc.find("Node_Controller/Btn_OK", this.node), function() {
wAudioMgr.playBtnSound();
e.hide();
}, [ cc.Node.EventType.TOUCH_END ]);
};
t.prototype.Init_View = function() {
cc.find("Node_Controller/ScrollView/Node_Copy", this.node).active = !1;
this.SetText_PlayerCount(0);
};
t.prototype.Init_Event = function() {
wGEvent.clear("Msg_HBSL_JackpotHistory");
wGEvent.on("Msg_HBSL_JackpotHistory", function(e) {
1 == e.status || wLog.e("玩家列表");
}, this);
wNetWork.send("Msg_HBSL_JackpotHistory", {}, !0);
};
t.prototype.SetText_PlayerCount = function(e) {
cc.find("Node_Controller/Lab_Count", this.node).getComponent(cc.Label).string = e + "在线";
};
t.prototype.Create_Player = function(e) {
var t = cc.find("Node_Controller/ScrollView/Node_Mask/Node_Content", this.node), o = cc.instantiate(cc.find("Node_Controller/ScrollView/Node_Copy", this.node));
t.addChild(o);
o.active = !0;
cc.find("Node_Sex/1", o).active = 2 != e.Sex;
cc.find("Node_Sex/2", o).active = 2 == e.Sex;
wUIHelp.setHead(cc.find("Img_Head", o), e.HeadPath);
cc.find("Lab_Name", o).getComponent(cc.Label).string = "" + wUtils.handleNameLen(e.Name, 5);
cc.find("Lab_Gold", o).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(e.Gold, 1, 1);
};
t.Show = function(e) {
wViewMgr.openPage({
path: "prefab/PlayerList",
bundle: "BCBM",
data: {
DataMgr: e
}
});
};
return __decorate([ i ], t);
}(a.default);
o.default = r;
cc._RF.pop();
}, {
PopupBase: void 0
} ],
BCBM_PoolItemTool: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "c702cnNz/lNHYMDByIarppS", "BCBM_PoolItemTool");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = function() {
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
e.prototype.MonitorPoolItem = function(e, t, o, a) {
if (!this._All_PoolPrefabl[e]) {
var n = this.Clone(t);
n.Name = e;
n.parent = null;
this._All_PoolPrefabl[e] = n;
"function" == typeof o && (this._All_PoolInitCallback[e] = o);
this._All_Pool[e] || (this._All_Pool[e] = new cc.NodePool());
if ("number" == typeof a) for (var i = 0; i < a; i++) {
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
for (var t = e.children, o = [], a = 0, n = t.length; a < n; a++) o.push(t[a]);
a = 0;
for (n = o.length; a < n; a++) {
this.RootRemovePoolItem(o[a]);
o[a].Destroy && o[a].Destroy();
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
o.default = a;
cc._RF.pop();
}, {} ],
BCBM_View: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "bc4f11J87dICpop8sFePT4i", "BCBM_View");
Object.defineProperty(o, "__esModule", {
value: !0
});
var a = e("DropDown"), n = e("BCBM_GameOver"), i = e("BCBM_PlayerList"), r = cc._decorator, c = r.ccclass, d = r.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.JettonList = [];
t.GameOverPrefab = null;
return t;
}
t.prototype.onDestroy = function() {
var e, t;
null === (e = this.TweenCar) || void 0 === e || e.stop();
this.TweenCar = null;
null === (t = this.WheelAction) || void 0 === t || t.stop();
this.WheelAction = null;
};
t.prototype.Init = function() {
this.Init_Node();
this.Init_Buttons();
this.Init_View();
};
t.prototype.Init_Node = function() {
this.DataMgr.PoolItemTool.MonitorPoolItem("Jetton", cc.find("Node_UI/Node_JettonEffect/Node_Copy", this.node), function(e) {
e.active = !0;
e.scale = 1;
e.stopAllActions();
e.Data = {};
});
this.DataMgr.PoolItemTool.MonitorPoolItem("BufferIcon", cc.find("Node_UI/Node_Record/ScrollView/Node_Copy", this.node), function(e) {
e.active = !0;
for (var t = 0, o = cc.find("Node_Type", e).children; t < o.length; t++) o[t].active = !1;
});
cc.find("Node_UI/Node_JettonEffect/Node_Copy", this.node).active = !1;
cc.find("Node_UI/Node_Record/ScrollView/Node_Copy", this.node).active = !1;
cc.find("Node_UI/Node_GameTypeAction", this.node).active = !1;
};
t.prototype.Init_View = function() {
this.SetText_BankerGold(0);
this.SetText_PlayerGold(0);
this.SetText_PlayerCount(0);
this.SetText_ContinueBankerCount(0);
this.SetText_UpBankerCount(0);
for (var e = 1; e <= 8; e++) {
cc.find("Node_UI/Node_Region/" + e + "/Img_Touch", this.node).active = !1;
this.SetText_RegionJetton(e, 0);
this.SetText_RegionSelfJetton(e, 0);
}
this.SetUI_HistoryList([]);
this.Close_WheelDisc();
this.Play_CarLighting(!1);
};
t.prototype.Init_Buttons = function() {
var e = this;
this.DataMgr.AddNodeClick(cc.find("Node_UI/Node_Button/Btn_Player", this.node), function() {
wAudioMgr.playBtnSound();
i.default.Show(e.DataMgr);
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.AddNodeClick(cc.find("DropDown/switchBtn/mask/panel/bank", this.node), function() {
wAudioMgr.playBtnSound();
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
cc.find("DropDown", e.node).getComponent(a.default).onClickSwitchBtn();
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.AddNodeClick(cc.find("Node_UI/Node_Player/Btn_Add", this.node), function() {
wAudioMgr.playBtnSound();
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.AddNodeClick(cc.find("DropDown/switchBtn/mask/panel/return", this.node), function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.IsDown ? wUIManager.showConfirmUI({
content: "您当前已开始游戏，如已下注系统将扣除一定欢乐豆，确定退出本局游戏?",
okCB: function() {
e.DataMgr.Game_Controlle.m_quitGame();
}
}) : e.DataMgr.Game_Controlle.m_quitGame();
cc.find("DropDown", e.node).getComponent(a.default).onClickSwitchBtn();
}, [ cc.Node.EventType.TOUCH_END ]);
for (var t = function(t) {
o.DataMgr.AddNodeClick(cc.find("Node_UI/Node_Jetton/" + t + "/Img_On", o.node), function() {
e.DataMgr.GameData.CurChipCount = e.DataMgr.Get_JettonIDToCount(t);
e.DataMgr.Game_View.UpdateImg_ButtonJetton();
}, [ cc.Node.EventType.TOUCH_END ]);
}, o = this, n = 1; n <= 6; n++) t(n);
for (var r = function(t) {
c.DataMgr.AddNodeClick(cc.find("Node_UI/Node_Region/" + t, c.node), function(o, a) {
if (a == cc.Node.EventType.TOUCH_END) {
wAudioMgr.playBtnSound();
cc.find("Node_UI/Node_Region/" + t + "/Img_Touch", e.node).active = !1;
var n = e.DataMgr.GameData;
if (1 != n.GameType) return;
if (0 == n.CurChipCount) {
wUIManager.showTips("请选择下注筹码！");
return;
}
e.DataMgr.GameData.PlayerUser.Gold >= e.DataMgr.GameData.CurChipCount && 1 == e.DataMgr.GameData.GameType && wNetWork.send("Msg_BCBM_ActBet", {
region: e.DataMgr.Get_WheelDiscTypeData(t).ServerRegion,
gold: e.DataMgr.GameData.CurChipCount
}, !1);
} else a == cc.Node.EventType.TOUCH_START ? cc.find("Node_UI/Node_Region/" + t + "/Img_Touch", e.node).active = !0 : cc.find("Node_UI/Node_Region/" + t + "/Img_Touch", e.node).active = !1;
}, [ cc.Node.EventType.TOUCH_END, cc.Node.EventType.TOUCH_START, cc.Node.EventType.TOUCH_CANCEL ]);
}, c = this, d = 1; d <= 8; d++) r(d);
this.DataMgr.AddNodeClick(cc.find("Node_UI/Node_Button/Btn_XY", this.node), function() {
if (cc.find("Node_UI/Node_Button/Btn_XY/Img_On", e.node).active) {
wAudioMgr.playBtnSound();
for (var t = 0, o = {}, a = 0, n = e.DataMgr.GameData.PreparePutList.length; a < n; a++) {
o[(r = e.DataMgr.GameData.PreparePutList[a]).Region] ? o[r.Region] += r.Count : o[r.Region] = r.Count;
t += r.Count;
}
if (t <= e.DataMgr.GameData.PlayerUser.Gold && e.DataMgr.GameData.PreparePutList.length > 0) for (var i in o) if (o.hasOwnProperty(i)) {
var r = o[i];
e.DataMgr.GameData.PlayerUser.Gold >= e.DataMgr.GameData.CurChipCount && 1 == e.DataMgr.GameData.GameType && wNetWork.send("Msg_BCBM_ActBet", {
region: e.DataMgr.Get_WheelDiscTypeData(+i).ServerRegion,
gold: +r
}, !0);
}
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.AddNodeClick(cc.find("Node_UI/Node_Button/Btn_Banker/Img_SZ", this.node), function() {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.PlayerUser.Gold < 2e8 ? wUIManager.showConfirmUI({
title: "系统提示",
content: "您的欢乐豆不足，无法上庄\n上庄条件：2亿欢乐豆",
okCB: function() {}
}) : wNetWork.send("Msg_BCBM_ToBanker", {
stage: 1
}, !0);
}, [ cc.Node.EventType.TOUCH_END ]);
this.DataMgr.AddNodeClick(cc.find("Node_UI/Node_Button/Btn_Banker/Img_XZ", this.node), function() {
wAudioMgr.playBtnSound();
wNetWork.send("Msg_BCBM_ToBanker", {
stage: 0
}, !0);
}, [ cc.Node.EventType.TOUCH_END ]);
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
for (var e = 1; e <= 8; e++) {
this.SetText_RegionJetton(e, 0);
this.SetText_RegionSelfJetton(e, 0);
}
};
t.prototype.Close_RegionJetton = function() {
this.DataMgr.PoolItemTool.RootRemovePoolItem(cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node));
};
t.prototype.SetText_PlayerGold = function(e) {
cc.find("Node_UI/Node_Player/Lab_Gold", this.node).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(e, 2, 2);
};
t.prototype.SetText_BankerGold = function(e) {
cc.find("Node_UI/Node_Banker/Lab_Gold", this.node).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(e, 2, 2);
};
t.prototype.SetText_PlayerCount = function(e) {
cc.find("Node_UI/Node_Info/Lab_PlayerCount", this.node).getComponent(cc.Label).string = "" + e;
};
t.prototype.SetText_ContinueBankerCount = function(e) {
console.error(e);
cc.find("Node_UI/Node_Info/Lab_Contine", this.node).getComponent(cc.Label).string = "连庄" + e + "轮";
};
t.prototype.SetText_UpBankerCount = function(e) {
cc.find("Node_UI/Node_Info/Lab_Banker", this.node).getComponent(cc.Label).string = e + "人在排队";
};
t.prototype.SetText_RegionJetton = function(e, t) {
var o = cc.find("Node_UI/Node_Region/" + e, this.node);
if (o) {
o.Jetton = t;
cc.find("Lab_Jetton", o).getComponent(cc.Label).string = 0 == t ? "" : "" + wUtils.numConvert(o.Jetton);
}
};
t.prototype.SetText_AddRegionJetton = function(e, t) {
var o = cc.find("Node_UI/Node_Region/" + e, this.node);
if (o) {
o.Jetton || (o.Jetton = 0);
if (t) {
o.Jetton += t;
cc.find("Lab_Jetton", o).getComponent(cc.Label).string = "" + wUtils.numConvert(o.Jetton);
}
}
};
t.prototype.SetText_RegionSelfJetton = function(e, t) {
var o = cc.find("Node_UI/Node_Region/" + e, this.node);
if (o) {
o.SelfJetton = t;
cc.find("Lab_SelfJetton", o).getComponent(cc.Label).string = 0 == t ? "" : "" + wUtils.numConvert(o.SelfJetton);
}
};
t.prototype.SetText_AddRegionSelfJetton = function(e, t) {
var o = cc.find("Node_UI/Node_Region/" + e, this.node);
if (o) {
o.SelfJetton || (o.SelfJetton = 0);
if (t) {
o.SelfJetton += t;
cc.find("Lab_SelfJetton", o).getComponent(cc.Label).string = "" + wUtils.numConvert(o.SelfJetton);
}
}
};
t.prototype.SetImg_DesktopJetton = function(e, t) {
e.Jetton = t;
var o = this.JettonList[this.DataMgr.Get_JettonType(t) - 1];
o && (e.getComponent(cc.Sprite).spriteFrame = o);
};
t.prototype.SetUI_Banker = function(e) {
cc.find("Node_UI/Node_Banker/Node_Sex/1", this.node).active = 2 != e.UserSex;
cc.find("Node_UI/Node_Banker/Node_Sex/2", this.node).active = 2 == e.UserSex;
cc.find("Node_UI/Node_Banker/Lab_Name", this.node).getComponent(cc.Label).string = "" + wUtils.handleNameLen(e.UserName, 6);
wUIHelp.setHead(cc.find("Node_UI/Node_Banker/Img_Head", this.node), e.UserHead);
};
t.prototype.SetUI_Player = function(e) {
cc.find("Node_UI/Node_Player/Node_Sex/1", this.node).active = 2 != e.UserSex;
cc.find("Node_UI/Node_Player/Node_Sex/2", this.node).active = 2 == e.UserSex;
cc.find("Node_UI/Node_Player/Lab_Name", this.node).getComponent(cc.Label).string = "" + wUtils.handleNameLen(e.UserName, 6);
wUIHelp.setHead(cc.find("Node_UI/Node_Player/Img_Head", this.node), e.UserHead);
};
t.prototype.SetUI_HistoryList = function(e) {
this.DataMgr.PoolItemTool.RootRemovePoolItem(cc.find("Node_UI/Node_Record/ScrollView/Node_Root", this.node));
for (var t = 0, o = e.length; t < o; t++) this.SetUI_AddHistoryList(e[t]);
};
t.prototype.SetUI_AddHistoryList = function(e) {
for (var t = this, o = cc.find("Node_UI/Node_Record/ScrollView/Node_Root", this.node), a = this.DataMgr.PoolItemTool.GetPoolItem("BufferIcon"), n = 0, i = o.children; n < i.length; n++) {
var r = i[n];
cc.find("Img_Point", r).active = !1;
}
o.addChild(a);
cc.find("Img_Point", a).active = !0;
for (var c = 0, d = cc.find("Node_Type", a).children; c < d.length; c++) (r = d[c]).active = r.name == "" + e;
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
var o = {
IsMy: !!e.IsMy,
Region: e.Region,
Jetton: e.JettonCount
};
t.JettonData = o;
var a = t.JettonData;
this.SetImg_DesktopJetton(t, a.Jetton);
t.setPosition(this.GetPos_RegionRandomPos(e.Region));
this.SetText_AddRegionJetton(e.Region, e.JettonCount);
e.IsMy && this.SetText_AddRegionSelfJetton(e.Region, e.JettonCount);
};
t.prototype.UpdateImg_ButtonJetton = function() {
for (var e = 1; e <= 6; e++) {
var t = this.DataMgr.Check_GoldMeetJetton(this.DataMgr.Get_JettonIDToCount(e)), o = 1 == this.DataMgr.GameData.GameType, a = this.DataMgr.Get_JettonIDToCount(e) == this.DataMgr.GameData.CurChipCount;
cc.find("Node_UI/Node_Jetton/" + e + "/Img_OFF", this.node).active = !t || !o;
cc.find("Node_UI/Node_Jetton/" + e + "/Img_On", this.node).active = t && !a && o;
cc.find("Node_UI/Node_Jetton/" + e + "/Img_Up", this.node).active = t && a && o;
}
};
t.prototype.UpdateButton_Banker = function() {
var e = -1 != this.DataMgr.GameData.UpBankerList.indexOf(+this.DataMgr.GameData.PlayerUser.UserID);
cc.find("Node_UI/Node_Button/Btn_Banker/Img_SZ", this.node).active = !this.DataMgr.IsMyBanker() && !e;
cc.find("Node_UI/Node_Button/Btn_Banker/Img_XZ", this.node).active = e || this.DataMgr.IsMyBanker();
};
t.prototype.UpdateButton_XYType = function() {
var e = this.DataMgr.Check_XT();
cc.find("Node_UI/Node_Button/Btn_XY/Img_On", this.node).active = e;
cc.find("Node_UI/Node_Button/Btn_XY/Img_OFF", this.node).active = !e;
};
t.prototype.Play_DownTime = function(e, t) {
var o = cc.find("Node_UI/Node_Record/Node_Time", this.node), a = cc.find("Node_UI/Node_Record/Node_GameType", this.node);
o.stopAllActions();
cc.find("Img_XZ", a).active = 1 == e;
cc.find("Img_KJ", a).active = 2 == e;
cc.find("Img_KX", a).active = 0 == e;
cc.find("Lab_Time", o).getComponent(cc.Label).string = "";
cc.find("Lab_Time", o).stopAllActions();
cc.Tween.stopAllByTarget(cc.find("Img_Time", o).getComponent(cc.ProgressBar));
cc.find("Img_Time", o).getComponent(cc.ProgressBar).progress = 1;
t > 0 && o.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
if (t <= 5 && 1 == e) {
cc.find("Lab_Time", o).stopAllActions();
cc.find("Lab_Time", o).runAction(cc.sequence(cc.scaleTo(.25, .8), cc.scaleTo(.25, 1)));
wAudioMgr.playSound("sound/TIME_WARIMG", "BCBM");
}
if (t <= 0) {
t = 0;
o.stopAllActions();
}
cc.find("Lab_Time", o).getComponent(cc.Label).string = "" + (t >= 10 ? t : "0" + t);
cc.Tween.stopAllByTarget(cc.find("Img_Time", o).getComponent(cc.ProgressBar));
cc.find("Img_Time", o).getComponent(cc.ProgressBar).progress = 1;
cc.tween(cc.find("Img_Time", o).getComponent(cc.ProgressBar)).to(1, {
progress: 0
}).start();
t -= 1;
}), cc.delayTime(1))));
};
t.prototype.Play_WheelDiscAction = function(e, t, o) {
var a, n, i = this, r = this.DataMgr.GameData.MaxWheelDiscCount, c = e < 0 ? 0 : e, d = cc.find("Node_UI/Node_WheelDisc", this.node), l = null, s = function() {
if (cc.isValid(l)) {
var e = cc.find("Img_Light", l);
if (e.active) {
e.stopAllActions();
e.runAction(cc.sequence(cc.fadeOut(.1), cc.callFunc(function() {
e.active = !1;
})));
}
}
l = null;
}, _ = function(e) {
s();
if (cc.isValid(d)) {
l = d.getChildByName("" + e);
cc.find("Img_Light", l).stopAllActions();
cc.find("Img_Light", l).active = !0;
cc.find("Img_Light", l).opacity = 255;
wAudioMgr.playSound("sound/TURN", "BCBM");
} else this.WheelAction && this.WheelAction.stop();
}, g = function(e, t) {
void 0 === t && (t = 1);
return (e += t) % r;
};
this.WheelAction && this.WheelAction.stop();
s();
this.Play_CarLighting(!1);
var f = ((a = e) < (n = t) ? n - a : r - a + n) + 2 * r;
this.WheelAction = cc.tween({});
this.Play_CarMove({
IsInit: !0,
EndIndex: c
});
this.Play_CarMove({
StartIndex: c,
EndIndex: g(c),
Time: this.DataMgr.NumberLerp(.04, .4, 1)
});
for (var h = function(e) {
var t = u.DataMgr.NumberLerp(.04, .4, (8 - e) / 8), o = u.DataMgr.NumberLerp(.04, .4, (8 - (e + 1)) / 8);
u.WheelAction.then(cc.tween().delay(t).call(function() {
c = g(c);
i.Play_CarMove({
StartIndex: c,
EndIndex: g(c),
Time: o
});
_(c);
}));
}, u = this, m = 0; m < 8; m++) h(m);
m = 0;
for (var p = f - 8 - 8; m < p; m++) this.WheelAction.then(cc.tween().delay(.04).call(function() {
c = g(c);
i.Play_CarMove({
StartIndex: c,
EndIndex: g(c),
Time: .04
});
_(c);
}));
var D = function(e) {
var t = y.DataMgr.NumberLerp(.04, 1.04, e / 8);
7 == e ? y.WheelAction.then(cc.tween().delay(t).call(function() {
c = g(c);
_(c);
i.Play_CarLighting(!0);
})) : y.WheelAction.then(cc.tween().delay(t).call(function() {
c = g(c);
i.Play_CarMove({
StartIndex: c,
EndIndex: g(c),
Time: i.DataMgr.NumberLerp(.04, 1.04, (e + 1) / 8)
});
_(c);
}));
}, y = this;
for (m = 0; m < 8; m++) D(m);
this.WheelAction.then(cc.tween().delay(.1).call(function() {
cc.isValid(d) ? o && o() : i.WheelAction && i.WheelAction.stop();
}));
this.WheelAction.start();
};
t.prototype.Play_SwitchStage = function(e, t) {
var o = this;
cc.find("Node_UI/Node_GameTypeAction", this.node).active = !0;
cc.find("Node_UI/Node_GameTypeAction/Node_Type", this.node).active = !0;
cc.find("Node_UI/Node_GameTypeAction/Img_BG", this.node).active = !0;
cc.find("Node_UI/Node_GameTypeAction/Node_Type", this.node).x = 700;
cc.find("Node_UI/Node_GameTypeAction/Img_BG", this.node).x = -700;
cc.find("Node_UI/Node_GameTypeAction/Node_Type/Img_KSXZ", this.node).active = 1 == e;
cc.find("Node_UI/Node_GameTypeAction/Node_Type/Img_XZJS", this.node).active = 2 == e;
cc.find("Node_UI/Node_GameTypeAction/Node_Type/Img_ZJLH", this.node).active = 3 == e;
cc.find("Node_UI/Node_GameTypeAction/Node_Type", this.node).stopAllActions();
cc.find("Node_UI/Node_GameTypeAction/Img_BG", this.node).stopAllActions();
cc.find("Node_UI/Node_GameTypeAction", this.node).stopAllActions();
1 == e ? wAudioMgr.playSound("sound/START_W", "BCBM") : 2 == e && wAudioMgr.playSound("sound/STOP_W", "BCBM");
cc.find("Node_UI/Node_GameTypeAction/Img_BG", this.node).runAction(cc.sequence(cc.moveTo(.25, cc.v2(0, 0)), cc.delayTime(1), cc.moveTo(.25, cc.v2(-700, 0)), cc.callFunc(function() {
cc.find("Node_UI/Node_GameTypeAction/Img_BG", o.node).active = !1;
})));
cc.find("Node_UI/Node_GameTypeAction/Node_Type", this.node).runAction(cc.sequence(cc.moveTo(.25, cc.v2(0, 0)), cc.delayTime(1), cc.moveTo(.25, cc.v2(700, 0)), cc.callFunc(function() {
cc.find("Node_UI/Node_GameTypeAction/Node_Type", o.node).active = !1;
})));
cc.find("Node_UI/Node_GameTypeAction", this.node).runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(function() {
cc.find("Node_UI/Node_GameTypeAction", o.node).active = !1;
null == t || t();
})));
};
t.prototype.Play_CarMove = function(e) {
var t, o, a = function(e, t) {
var o = e.getCurrent(0);
t >= 1 && (t -= 1);
var a = o.animationEnd * t;
o.animationStart = a;
};
null === (t = this.TweenCar) || void 0 === t || t.stop();
this.TweenCar = null;
var n = null === (o = cc.find("Node_UI/Sp_Car", this.node)) || void 0 === o ? void 0 : o.getComponent(sp.Skeleton);
if (n) {
n.timeScale = 0;
var i = {
Start: this.DataMgr.Get_SpineCarPoint(e.StartIndex),
End: this.DataMgr.Get_SpineCarPoint(e.EndIndex)
};
if (e.IsInit) a(n, i.End); else {
i.End < i.Start && (i.End += 1);
a(n, i.Start);
this.TweenCar = cc.tween({
Point: i.Start
}).to(e.Time, {
Point: i.End
}, {
onUpdate: function(e) {
a(n, e.Point);
}
});
this.TweenCar.start();
}
}
};
t.prototype.Play_CarLighting = function(e) {
cc.find("Node_UI/Sp_Car/ATTACHED_NODE_TREE/ATTACHED_NODE:root/ATTACHED_NODE:bcbmgameche/Sp_Start", this.node).active = !!e;
cc.find("Node_UI/Sp_Car/ATTACHED_NODE_TREE/ATTACHED_NODE:root/ATTACHED_NODE:bcbmgameche/Sp_End", this.node).active = !!e;
};
t.prototype.Play_DelayWheelDisc = function(e) {
var t = cc.find("Node_UI/Node_WheelDisc", this.node);
t.stopAllActions();
for (var o = 0, a = t.children; o < a.length; o++) {
var n = a[o];
cc.find("Img_Light", n).stopAllActions();
cc.find("Img_Light", n).active = !1;
cc.find("Img_Light", n).opacity = 255;
}
if (e) {
var i = [ [ 0, 8, 16, 24 ], [ 1, 9, 17, 25 ], [ 2, 10, 18, 26 ], [ 3, 11, 19, 27 ], [ 4, 12, 20, 28 ], [ 5, 13, 21, 29 ], [ 6, 14, 22, 30 ], [ 7, 15, 23, 31 ] ], r = 0;
t.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function() {
for (var e = 0, o = t.children; e < o.length; e++) {
var a = o[e];
cc.find("Img_Light", a).stopAllActions();
cc.find("Img_Light", a).active = !1;
cc.find("Img_Light", a).opacity = 255;
}
for (var n = 0, c = i[r]; n < c.length; n++) {
a = c[n];
var d = t.getChildByName("" + a);
cc.find("Img_Light", d).active = !0;
}
r = (r + 1) % i.length;
}), cc.delayTime(1))));
}
};
t.prototype.Play_RunJetton = function(e) {
var t = this;
(e.Region < 1 || e.Region > 8) && (e.Region = 1);
var o = cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node), a = this.DataMgr.PoolItemTool.GetPoolItem("Jetton");
o.addChild(a);
a.name = "" + e.Region;
var n = {
IsMy: !!e.IsMy,
Region: e.Region,
Jetton: e.JettonCount
};
a.JettonData = n;
o.Time || (o.Time = 0);
o.Time2 || (o.Time2 = 0);
n.IsMy ? a.setPosition(this.DataMgr.GetNodeWorldPos(cc.find("Node_UI/Node_Jetton/" + this.DataMgr.Get_JettonType(e.JettonCount), this.node))) : a.setPosition(this.DataMgr.GetNodeWorldPos(cc.find("Node_UI/Node_Button/Btn_Player", this.node)));
this.SetImg_DesktopJetton(a, e.JettonCount);
a.runAction(cc.sequence(cc.delayTime(e.DelTime), cc.callFunc(function() {}), cc.moveTo(.5, this.GetPos_RegionRandomPos(e.Region)), cc.scaleTo(.1, 1.2), cc.callFunc(function() {
var a = new Date().getTime();
if (a - o.Time > 150) {
o.Time = a;
wAudioMgr.playSound("sound/ADD_GOLD", "BCBM");
}
if (a - o.Time2 > 1e3) {
o.Time2 = a;
wAudioMgr.playSound("sound/ADD_GOLD_EX", "BCBM");
}
t.SetText_AddRegionJetton(e.Region, e.JettonCount);
e.IsMy && t.SetText_AddRegionSelfJetton(e.Region, e.JettonCount);
}), cc.scaleTo(.1, 1)));
return a;
};
t.prototype.Play_OneJettonAtion = function(e) {
var t = this, o = this.DataMgr.PoolItemTool.GetPoolItem("Jetton");
cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node).addChild(o);
e.StartPos && o.setPosition(e.StartPos);
this.SetImg_DesktopJetton(o, e.JettonCount);
e.DelTime ? o.runAction(cc.sequence(cc.delayTime(e.DelTime), cc.moveTo(.5, e.EndPos), cc.callFunc(function() {
e.EndPos2 ? o.runAction(cc.sequence(cc.moveTo(.5, e.EndPos2), cc.callFunc(function() {
t.DataMgr.PoolItemTool.RemovePoolItem(o);
}))) : t.DataMgr.PoolItemTool.RemovePoolItem(o);
}))) : o.runAction(cc.sequence(cc.moveTo(.5, e.EndPos), cc.callFunc(function() {
t.DataMgr.PoolItemTool.RemovePoolItem(o);
})));
return o;
};
t.prototype.Play_JettonPointAction = function(e, t, o) {
var a = this;
if (!(e < 1 || e > 8)) {
var n = cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node).children;
cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node).stopAllActions();
var i = 0, r = 0;
if (0 == n.length) {
t && t();
o && o();
} else {
for (var c = this.DataMgr.GetNodeWorldPos(cc.find("Node_UI/Node_Banker", this.node)), d = this.DataMgr.GetNodeWorldPos(cc.find("Node_UI/Node_Player", this.node)), l = this.DataMgr.GetNodeWorldPos(cc.find("Node_UI/Node_Button/Btn_Player", this.node)), s = function(t) {
var s = n[t], g = s.JettonData;
s.stopAllActions();
if (g.Region == e) {
i++;
if (g.IsMy) for (var f = 0, h = _.DataMgr.Get_WheelDiscTypeData(g.Region).Odds; f < h; f++) _.Play_OneJettonAtion({
JettonCount: g.Jetton,
DelTime: wUtils.random(80, 200) / 100 * 1,
StartPos: s.getPosition(),
EndPos: d
});
_.Play_OneJettonAtion({
JettonCount: g.Jetton,
DelTime: wUtils.random(50, 100) / 100,
StartPos: c,
EndPos: cc.v2(s.position),
EndPos2: g.IsMy ? d : l
});
s.runAction(cc.sequence(cc.delayTime(1), cc.moveTo(wUtils.random(80, 200) / 100 * .5, g.IsMy ? d : l).easing(cc.easeQuadraticActionInOut()), cc.callFunc(function() {
a.DataMgr.PoolItemTool.RemovePoolItem(s);
++r == i && o && o();
})));
} else s.runAction(cc.sequence(cc.moveTo(wUtils.random(80, 200) / 100 * .5, c).easing(cc.easeQuadraticActionInOut()), cc.callFunc(function() {
a.DataMgr.PoolItemTool.RemovePoolItem(s);
})));
}, _ = this, g = 0, f = n.length; g < f; g++) s(g);
cc.find("Node_UI/Node_JettonEffect", this.node).stopAllActions();
cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node).runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function() {
t && t();
})));
}
}
};
t.prototype.CloceJetton = function() {
this.DataMgr.PoolItemTool.RootRemovePoolItem(cc.find("Node_UI/Node_JettonEffect/Node_Root", this.node));
};
t.prototype.OpenGameOver = function() {
var e;
null === (e = this.node.getChildByName("GameOver")) || void 0 === e || e.destroy();
var t = cc.instantiate(this.GameOverPrefab);
t.name = "GameOver";
this.node.addChild(t);
t.getComponent(n.default).Show(this.DataMgr);
};
t.prototype.GetPos_RegionRandomPos = function(e) {
var t = cc.find("Node_UI/Node_Region/" + e + "/Node_PosArr", this.node);
t || console.error(e);
var o = cc.v2(0, 0), a = wUtils.random(0, t.childrenCount - 1);
this.DataMgr.GameData.JettonBufferPosList[e] || (this.DataMgr.GameData.JettonBufferPosList[e] = {});
if (this.DataMgr.GameData.JettonBufferPosList[e][a]) o = this.DataMgr.GameData.JettonBufferPosList[e][a]; else {
o = this.DataMgr.GetNodeWorldPos(t.children[a]);
this.DataMgr.GameData.JettonBufferPosList[e][a] = o;
}
return o;
};
__decorate([ d({
type: cc.SpriteFrame,
displayName: "筹码图集",
tooltip: "筹码图集"
}) ], t.prototype, "JettonList", void 0);
__decorate([ d({
type: cc.Prefab,
displayName: "结算节点",
tooltip: "结算节点"
}) ], t.prototype, "GameOverPrefab", void 0);
return __decorate([ c ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {
BCBM_GameOver: "BCBM_GameOver",
BCBM_PlayerList: "BCBM_PlayerList",
DropDown: void 0
} ]
}, {}, [ "BCBM_Controlle", "BCBM_DataMgr", "BCBM_GameOver", "BCBM_Load", "BCBM_PlayerList", "BCBM_PoolItemTool", "BCBM_View" ]);