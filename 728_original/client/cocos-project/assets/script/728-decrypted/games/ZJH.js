window.__require = function e(a, t, o) {
function n(c, d) {
if (!t[c]) {
if (!a[c]) {
var r = c.split("/");
r = r[r.length - 1];
if (!a[r]) {
var s = "function" == typeof __require && __require;
if (!d && s) return s(r, !0);
if (i) return i(r, !0);
throw new Error("Cannot find module '" + c + "'");
}
c = r;
}
var l = t[c] = {
exports: {}
};
a[c][0].call(l.exports, function(e) {
return n(a[c][1][e] || e);
}, l, l.exports, e, a, t, o);
}
return t[c].exports;
}
for (var i = "function" == typeof __require && __require, c = 0; c < o.length; c++) n(o[c]);
return n;
}({
ZJH_Controlle: [ function(e, a, t) {
"use strict";
cc._RF.push(a, "80543936eFBsrqlcDU1W2Qa", "ZJH_Controlle");
Object.defineProperty(t, "__esModule", {
value: !0
});
var o = e("PokerBase"), n = e("ZJH_DataMgr"), i = e("ZJH_View"), c = cc._decorator, d = c.ccclass;
c.property;
var r = function(e) {
__extends(a, e);
function a() {
return null !== e && e.apply(this, arguments) || this;
}
a.prototype.m_roomInfo = function() {};
a.prototype.m_upGameGold = function() {
var e = +wGameData.getKey("gold");
this.DataMgr.PlayerDatas[this.DataMgr.GameData.SelfUserID] && (this.DataMgr.PlayerDatas[this.DataMgr.GameData.SelfUserID].Gold = e);
};
a.prototype.m_NetWorkState = function() {};
a.prototype.onLoad = function() {
this.DataMgr = new n.default();
this.DataMgr.Game_Controlle = this;
this.DataMgr.Game_View = this.node.getComponent(i.default);
this.DataMgr.Init();
this.DataMgr.Game_View.DataMgr = this.DataMgr;
this.DataMgr.Game_View.Init();
};
a.prototype.start = function() {
this.Monitor_NetworkEvent();
this.m_setBankBtn(!1);
this.m_init();
};
a.prototype.Monitor_NetworkEvent = function() {
var e = this;
wGEvent.on("Msg_ZJH_RoomInfo", function(a) {
if (1 == a.status) {
e.node.stopAllActions();
e.DataMgr.Game_View.Init_Game();
var t = a.data;
e.DataMgr.GameData.DiZhuGold = t.rule.doublescore;
e.DataMgr.GameData.SelfUserID = a.uid;
e.DataMgr.GameData.RoomType = +t.rule.level;
e.DataMgr.GameData.AllGameCount = +t.all_circle;
e.DataMgr.GameData.CurGameCount = +t.cur_cirle;
e.DataMgr.GameData.OneJettonLimit = +t.max_bet;
e.DataMgr.GameData.GengZhuGold = e.DataMgr.GameData.DiZhuGold;
e.DataMgr.GameData.AllJetton = 0;
e.DataMgr.GameData.IsSelfSeeCard = !1;
e.DataMgr.GameData.AllOperateTime = t.alltime ? +t.alltime : 12;
e.DataMgr.Game_View.Set_RoomInfo(e.DataMgr.GameData);
cc.find("Node_UI/Btn_SeeCard", e.node).active = !1;
e.DataMgr.GameData.IsAutoGengZhu = !1;
for (var o = 0, n = t.players; o < n.length; o++) {
var i = n[o];
e.DataMgr.Set_PlayerData(i);
}
var c = e.DataMgr.PlayerDatas[e.DataMgr.GameData.SelfUserID].ServerSeat;
for (var d in e.DataMgr.PlayerDatas) if (e.DataMgr.PlayerDatas.hasOwnProperty(d)) {
(s = e.DataMgr.PlayerDatas[d]).LocalSeat = e.GetLocalIndex(s.ServerSeat + 1, c + 1, 5);
e.DataMgr.Game_View.Set_PlayerInfo(s);
s.IsGame && 0 != t.gamestage && (s.IsDiuQiCard && 1 != s.LocalSeat || e.DataMgr.Game_View.Set_PlayerCard(s.LocalSeat, !0));
e.DataMgr.Game_View.Set_PlayerCold(s.LocalSeat, s.Gold);
}
e.DataMgr.GameData.XianShouPlayerID = t.bankeruid;
t.bankeruid && e.DataMgr.Game_View.Set_XianShouPlayer(e.DataMgr.PlayerDatas[e.DataMgr.GameData.XianShouPlayerID].LocalSeat, !1);
if (t.curbet && Object.keys(t.curbet).length > 0) for (var r in t.curbet) if (t.curbet.hasOwnProperty(r)) {
var s = t.curbet[r];
if (l = e.DataMgr.PlayerDatas[r]) {
l.Jetton = s.gold;
e.DataMgr.GameData.AllJetton += l.Jetton;
l.IsSeeCard = !!s.look;
if (l.IsSeeCard) {
+r == e.DataMgr.GameData.SelfUserID && (e.DataMgr.GameData.IsSelfSeeCard = !0);
e.DataMgr.Game_View.Set_IsSeeCard(l.LocalSeat);
if (1 == l.LocalSeat && 0 != t.mycards.length) {
e.DataMgr.Game_View.Set_SeeCard(t.mycards);
e.DataMgr.Game_View.Set_HeadCardQType(l.IsDiuQiCard || l.IsVSCardLose);
e.DataMgr.Game_View.Set_SelfCardTypeShow(t.mycards);
}
}
l.IsDiuQiCard = 5 == s.act;
l.IsVSCardLose && e.DataMgr.Game_View.Set_IsBPSCard(l.LocalSeat);
l.IsDiuQiCard && e.DataMgr.Game_View.Set_IsDQCard(l.LocalSeat);
e.DataMgr.Game_View.Set_Jetton(l.LocalSeat, l.Jetton);
e.DataMgr.Game_View.Set_JettonItems(l.UserID, l.Jetton);
}
}
e.DataMgr.Game_View.Set_AllJetton(e.DataMgr.GameData.AllJetton);
if (t.notice && Object.keys(t.notice).length > 0) {
var l;
(l = e.DataMgr.PlayerDatas[t.notice.uid]).IsSeeCard = !!t.notice.is_look;
l.IsSeeCard && e.DataMgr.Game_View.Set_IsSeeCard(l.LocalSeat);
e.DataMgr.Game_View.Play_PlayerDownTime(l.LocalSeat, t.notice.time);
e.DataMgr.GameData.OperateUserID = t.notice.uid;
e.DataMgr.GameData.GengZhuGold = t.notice.minbet;
0 != t.maxda && (e.DataMgr.GameData.MaxYaGold = +t.notice.maxda);
}
e.DataMgr.Game_View.Set_HeadCardQType(e.DataMgr.Get_SelfPlayerData().IsDiuQiCard || e.DataMgr.Get_SelfPlayerData().IsVSCardLose);
e.DataMgr.Game_View.Update_ButtonState(!1);
} else wLog.e("Msg_ZJH_RoomInfo");
}, this);
wGEvent.on("Msg_ZJH_AddPlayer", function(a) {
if (1 == a.status) {
var t = a.data, o = e.DataMgr.Set_PlayerData(t), n = e.DataMgr.PlayerDatas[e.DataMgr.GameData.SelfUserID].ServerSeat;
o.LocalSeat = e.GetLocalIndex(o.ServerSeat + 1, n + 1, 5);
e.DataMgr.Game_View.Init_PlayerInfo(o.LocalSeat);
e.DataMgr.Game_View.Play_EnterPlayer(o);
e.DataMgr.Game_View.Set_PlayerCold(o.LocalSeat, o.Gold);
} else wLog.e("Msg_ZJH_AddPlayer");
}, this);
wGEvent.on("Msg_ZJH_Out", function(a) {
if (1 == a.status) {
var t = a.data, o = e.DataMgr.PlayerDatas[t.uid];
e.DataMgr.Game_View.Init_PlayerInfo(o.LocalSeat);
e.DataMgr.Game_View.Play_ClosePlayer(o);
delete e.DataMgr.PlayerDatas[o.UserID];
} else wLog.e("Msg_ZJH_Out");
}, this);
wGEvent.on("Msg_ZJH_GameStart", function(a) {
if (1 == a.status) {
e.node.stopAllActions();
e.DataMgr.Game_View.Init_Game();
var t = a.data;
e.DataMgr.GameData.XianShouPlayerID = t.bank;
e.DataMgr.GameData.OperateUserID = t.bank;
e.DataMgr.GameData.CurGameCount = 1;
e.DataMgr.Game_View.Set_RoomInfo(e.DataMgr.GameData);
e.DataMgr.GameData.IsAutoGengZhu = !1;
e.DataMgr.GameData.AllJetton = 0;
e.DataMgr.GameData.MaxYaGold = 0;
e.DataMgr.GameData.IsSelfSeeCard = !1;
e.DataMgr.Game_View.Set_XianShouPlayer(e.DataMgr.PlayerDatas[e.DataMgr.GameData.XianShouPlayerID].LocalSeat, !0);
for (var o in e.DataMgr.PlayerDatas) if (e.DataMgr.PlayerDatas.hasOwnProperty(o)) {
(i = e.DataMgr.PlayerDatas[o]).Jetton = 0;
i.IsSeeCard = !1;
i.IsDiuQiCard = !1;
}
for (var n in t.act) if (t.act.hasOwnProperty(n)) {
var i = t.act[n], c = e.DataMgr.PlayerDatas[n];
if (c && 1 == i.act) {
e.DataMgr.GameData.AllJetton += i.gold;
c.Jetton += i.gold;
c.Gold -= i.gold;
e.DataMgr.Game_View.Set_Jetton(c.LocalSeat, c.Jetton);
e.DataMgr.Game_View.Set_AllJetton(e.DataMgr.GameData.AllJetton);
e.DataMgr.Game_View.Play_JettonRegion(c.UserID, i.gold);
e.DataMgr.Game_View.Set_PlayerCold(c.LocalSeat, c.Gold);
}
}
wAudioMgr.playSound("sound/0_l_ksxz", "ZJH");
e.DataMgr.Game_View.Update_PlayerGameState();
e.DataMgr.Game_View.Update_ButtonState(!1);
} else wLog.e("Msg_ZJH_GameStart");
}, this);
wGEvent.on("Msg_ZJH_FaCards", function(a) {
if (1 == a.status) {
e.DataMgr.Game_View.Close_Card();
var t = a.data;
cc.Tween.stopAllByTarget(e.node);
for (var o = cc.tween(e.node), n = function(a, n) {
var i = t.ingame[a], c = e.DataMgr.PlayerDatas[i];
c.IsGame = !0;
c.IsDiuQiCard = !1;
e.DataMgr.Game_View.Set_PlayerStartGame(c.LocalSeat, c.IsGame);
o.call(function() {
e.DataMgr.Game_View.Play_FaCard(c.LocalSeat, a == n - 1);
}).delay(.3);
}, i = 0, c = t.ingame.length; i < c; i++) n(i, c);
o.start();
e.DataMgr.Game_View.Set_SelfCardTypeShow(null);
e.DataMgr.Game_View.Update_PlayerGameState();
e.DataMgr.Game_View.Update_ButtonState(!1);
} else wLog.e("Msg_ZJH_FaCards");
}, this);
wGEvent.on("Msg_ZJH_CallUserAct", function(a) {
if (1 == a.status) {
var t = a.data;
e.DataMgr.GameData.GengZhuGold = t.minbet;
e.DataMgr.GameData.OperateUserID = t.uid;
e.DataMgr.GameData.CurGameCount = t.curcircle;
e.DataMgr.Game_View.Set_RoomInfo(e.DataMgr.GameData);
var o = e.DataMgr.PlayerDatas[t.uid];
e.DataMgr.Game_View.Play_PlayerDownTime(o.LocalSeat, t.time);
0 != t.maxda && (e.DataMgr.GameData.MaxYaGold = +t.maxda);
0 == t.maxda && t.uid == e.DataMgr.GameData.SelfUserID ? e.DataMgr.Game_View.Find_VsCard() : t.uid == e.DataMgr.GameData.SelfUserID && e.DataMgr.GameData.IsAutoGengZhu ? wNetWork.send("Msg_ZJH_ActBet", {
act: 2,
gold: e.DataMgr.GameData.GengZhuGold
}, !0) : e.DataMgr.Game_View.Update_ButtonState(!1);
e.DataMgr.Game_View.Close_VSCardView();
} else wLog.e("Msg_ZJH_CallUserAct");
}, this);
wGEvent.on("Msg_ZJH_ActBet", function(a) {
if (1 == a.status) {
var t = a.data, o = e.DataMgr.GameData, n = e.DataMgr.PlayerDatas[t.uid];
if (1 == t.act || 2 == t.act || 3 == t.act || 4 == t.act) {
n.Jetton += t.gold;
n.Gold -= t.gold;
o.AllJetton += t.gold;
e.DataMgr.Game_View.Set_AllJetton(o.AllJetton);
e.DataMgr.Game_View.Play_JettonRegion(n.UserID, t.gold, 4 == t.act);
e.DataMgr.Game_View.Set_Jetton(n.LocalSeat, n.Jetton);
e.DataMgr.Game_View.Set_PlayerCold(n.LocalSeat, n.Gold);
if (4 == t.act) {
e.DataMgr.Game_View.Play_PlayerQD(n.LocalSeat);
wAudioMgr.playSound("sound/0_" + (1 == n.UserSex ? "n" : "l") + "_qy", "ZJH");
}
2 == t.act && wAudioMgr.playSound("sound/0_" + (1 == n.UserSex ? "n" : "l") + "_wg", "ZJH");
3 == t.act && wAudioMgr.playSound("sound/0_" + (1 == n.UserSex ? "n" : "l") + "_wjz", "ZJH");
} else {
n.IsDiuQiCard = !0;
e.DataMgr.Game_View.Play_DiscardCard(n.LocalSeat);
e.DataMgr.Game_View.Set_IsDQCard(n.LocalSeat);
wAudioMgr.playSound("sound/0_" + (1 == n.UserSex ? "n" : "l") + "_wfql", "ZJH");
e.DataMgr.Game_View.Update_PlayerGameState();
}
t.uid == e.DataMgr.GameData.SelfUserID && 5 == t.act && e.DataMgr.Game_View.Set_HeadCardQType(e.DataMgr.Get_SelfPlayerData().IsDiuQiCard || e.DataMgr.Get_SelfPlayerData().IsVSCardLose);
e.DataMgr.Game_View.Update_ButtonState(!1);
e.DataMgr.Game_View.Close_VSCardView();
} else wLog.e("Msg_ZJH_ActBet");
}, this);
wGEvent.on("Msg_ZJH_LookCards", function(a) {
if (1 == a.status) {
var t = a.data, o = e.DataMgr.PlayerDatas[t.uid];
o.IsSeeCard = !0;
if (t.uid == e.DataMgr.GameData.SelfUserID) {
e.DataMgr.Game_View.Play_SeeCard(t.cards, o.IsDiuQiCard || o.IsVSCardLose);
e.DataMgr.Game_View.Set_SelfCardTypeShow(t.cards);
e.DataMgr.GameData.GengZhuGold *= 2;
e.DataMgr.GameData.IsSelfSeeCard = !0;
e.DataMgr.Game_View.Update_ButtonState(!1);
}
wAudioMgr.playSound("sound/0_" + (1 == o.UserSex ? "n" : "l") + "_kpb", "ZJH");
o.IsDiuQiCard || e.DataMgr.Game_View.Set_IsSeeCard(o.LocalSeat);
} else wLog.e("Msg_ZJH_ActBet");
}, this);
wGEvent.on("Msg_ZJH_CompareCards", function(a) {
if (1 == a.status) {
var t = a.data, o = e.DataMgr.GameData, n = e.DataMgr.PlayerDatas[t.touch], i = e.DataMgr.PlayerDatas[t.compaer];
e.DataMgr.PlayerDatas[t.loser].IsVSCardLose = !0;
e.DataMgr.Game_View.Set_IsBPSCard(e.DataMgr.PlayerDatas[t.loser].LocalSeat);
e.DataMgr.Game_View.Play_PKAction(n.LocalSeat, i.LocalSeat, t.loser == t.touch ? i.LocalSeat : n.LocalSeat, function() {
e.DataMgr.Game_View.Update_PlayerGameState();
t.loser != e.DataMgr.GameData.SelfUserID ? e.DataMgr.Game_View.Play_DiscardCard(e.DataMgr.PlayerDatas[t.loser].LocalSeat) : e.DataMgr.Game_View.Set_HeadCardQType(e.DataMgr.Get_SelfPlayerData().IsDiuQiCard || e.DataMgr.Get_SelfPlayerData().IsVSCardLose);
t.touch == t.loser ? wAudioMgr.playSound("sound/0_bpsl", "ZJH") : wAudioMgr.playSound("sound/0_bpyl", "ZJH");
});
t.loser == e.DataMgr.GameData.SelfUserID && e.DataMgr.Game_View.Update_ButtonState(!0);
wAudioMgr.playSound("sound/0_" + (1 == n.UserSex ? "n_bbsps" : "l_lbpb"), "ZJH");
e.DataMgr.Game_View.Close_VSCardView();
n.Jetton += t.gold;
n.Gold -= t.gold;
o.AllJetton += t.gold;
e.DataMgr.Game_View.Set_AllJetton(o.AllJetton);
e.DataMgr.Game_View.Play_JettonRegion(n.UserID, t.gold);
e.DataMgr.Game_View.Set_Jetton(n.LocalSeat, n.Jetton);
e.DataMgr.Game_View.Set_PlayerCold(n.LocalSeat, n.Gold);
e.DataMgr.Game_View.Close_PlayerDownTime(0);
} else wLog.e("Msg_ZJH_CompareCards");
}, this);
wGEvent.on("Msg_ZJH_Result", function(a) {
if (1 == a.status) {
e.node.stopAllActions();
for (var t = function(a) {
var t = e.DataMgr.PlayerDatas[a.uid];
t.Gold = a.gold;
t.IsDiuQiCard = !1;
t.IsVSCardLose = !1;
if (a.win > 0) {
for (var o = {}, n = 0, i = a.cards; n < i.length; n++) {
var c = i[n], d = Math.floor(c / 100);
o[d] = o[d] ? 1 : o[d] + 1;
}
if (1 == Object.keys(o).length) e.DataMgr.Game_View.Play_STAction(t.LocalSeat, a.cards); else {
if (1 == t.LocalSeat) {
e.DataMgr.Game_View.Play_SelfWinAction();
wAudioMgr.playSound("sound/0_jb", "ZJH");
t.IsSeeCard || e.DataMgr.Game_View.Play_SeeCard(a.cards, t.IsDiuQiCard || t.IsVSCardLose);
} else wAudioMgr.playSound("sound/0_win", "ZJH");
e.DataMgr.Game_View.Play_PlayWinAction(t.UserID, a.cards);
}
e.DataMgr.Game_View.Close_JettonRegion(t.LocalSeat, function() {
e.DataMgr.Game_View.Set_PlayerCold(t.LocalSeat, t.Gold);
e.DataMgr.Game_View.Play_SelfAddScore(t.LocalSeat, a.win);
t.IsGame = !1;
});
e.node.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(function() {
e.DataMgr.Game_View.Init_Game();
e.DataMgr.Game_View.Update_PlayerGameState();
})));
} else {
t.IsGame = !1;
e.DataMgr.Game_View.Set_PlayerCold(t.LocalSeat, t.Gold);
if (!t.IsSeeCard && 1 == t.LocalSeat) {
e.DataMgr.Game_View.Play_SeeCard(a.cards, t.IsDiuQiCard);
e.DataMgr.Game_View.Set_SelfCardTypeShow(a.cards);
}
}
}, o = 0, n = a.data.players; o < n.length; o++) t(n[o]);
e.DataMgr.Game_View.Update_ButtonState(!0);
e.DataMgr.Game_View.Close_PlayerDownTime(0);
} else wLog.e("Msg_ZJH_Result");
}, this);
};
a.prototype.GetLocalIndex = function(e, a, t) {
return 1 == a ? e : (e - a + t) % t + 1;
};
return __decorate([ d ], a);
}(o.default);
t.default = r;
cc._RF.pop();
}, {
PokerBase: void 0,
ZJH_DataMgr: "ZJH_DataMgr",
ZJH_View: "ZJH_View"
} ],
ZJH_DataMgr: [ function(e, a, t) {
"use strict";
cc._RF.push(a, "4ef27d7a+1DYLpDLP0WXaNE", "ZJH_DataMgr");
Object.defineProperty(t, "__esModule", {
value: !0
});
var o = function() {
function e() {}
e.prototype.Init = function() {
this.GameData = {};
this.PlayerDatas = {};
};
e.prototype.Set_PlayerData = function(e) {
var a = {};
a.UserID = e.uid;
a.UserName = e.nickname;
a.Gold = e.gold;
a.HeadPath = e.headimgurl;
a.ServerSeat = e.seat;
a.Jetton = 0;
a.IsGame = !!e.ingame;
a.IsSeeCard = !!e.status;
a.IsDiuQiCard = !!e.giveup;
a.UserSex = +e.sex;
a.IsVSCardLose = !1;
this.PlayerDatas[a.UserID] = a;
return a;
};
e.prototype.Get_PlayerData = function(e) {
return this.PlayerDatas[e];
};
e.prototype.Get_SelfPlayerData = function() {
return this.PlayerDatas[this.GameData.SelfUserID];
};
e.prototype.ConfigNum = function(e, a, t) {
return e < 0 ? "-" + wUtils.goldFormat(Math.abs(e), a, t) : wUtils.goldFormat(Math.abs(e), a, t);
};
e.prototype.ScoreSplit = function(e, a) {
var t = [ 1e3, 1e4, 1e5, 1e6, 5e6, 1e7 ];
t.push(1 * this.GameData.DiZhuGold);
t.push(3 * this.GameData.DiZhuGold);
t.push(5 * this.GameData.DiZhuGold);
t.push(8 * this.GameData.DiZhuGold);
t.push(10 * this.GameData.DiZhuGold);
if (this.PlayerDatas[e].IsSeeCard) {
t.push(6 * this.GameData.DiZhuGold);
t.push(16 * this.GameData.DiZhuGold);
t.push(20 * this.GameData.DiZhuGold);
}
var o = [];
t.sort(function(e, a) {
return e - a;
});
for (var n = 5; n > -1; n--) for (var i = t[n]; a >= i; ) {
o.push(i);
a -= i;
}
return o;
};
return e;
}();
t.default = o;
cc._RF.pop();
}, {} ],
ZJH_DownTimeAction: [ function(e, a, t) {
"use strict";
cc._RF.push(a, "ad44ePEdL9Jh45SyjmTKGDz", "ZJH_DownTimeAction");
Object.defineProperty(t, "__esModule", {
value: !0
});
var o = cc._decorator, n = o.ccclass, i = o.property, c = function(e) {
__extends(a, e);
function a() {
var a = null !== e && e.apply(this, arguments) || this;
a.CurTime = 0;
return a;
}
__decorate([ i({
type: cc.Float,
displayName: "显示名称",
tooltip: "工具提示"
}) ], a.prototype, "CurTime", void 0);
return __decorate([ n ], a);
}(cc.Component);
t.default = c;
cc._RF.pop();
}, {} ],
ZJH_Load: [ function(e, a, t) {
"use strict";
cc._RF.push(a, "ce8d0ncEjpPuLukBv1GKjdr", "ZJH_Load");
Object.defineProperty(t, "__esModule", {
value: !0
});
var o = e("Config"), n = cc._decorator, i = n.ccclass;
n.property;
var c = function(e) {
__extends(a, e);
function a() {
return null !== e && e.apply(this, arguments) || this;
}
a.prototype.onLoad = function() {
return __awaiter(this, void 0, void 0, function() {
var e, a = this;
return __generator(this, function(t) {
switch (t.label) {
case 0:
wAudioMgr.stopBgMusic();
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
this.preloadGameRes();
return [ 4, new Promise(function(e) {
var t = a.node.getChildByName("Sp_Load");
wUIHelp.playSpine(t, "start", function() {
wUIHelp.playSpine(t, "idle", null, !0);
});
a.scheduleOnce(function() {
e();
}, .7);
}) ];

case 1:
t.sent();
if (wGameData.isReconnect) this.loadRoom(); else {
e = wGEvent.on("Msg_Hall_GameSessions", function(t) {
a.Msg_Hall_GameSessions(t);
wGEvent.off(e);
a.unscheduleAllCallbacks();
e = null;
}, this);
this.scheduleOnce(function() {
if (e) {
wUIManager.showTips("请求游戏配置失败");
wGEvent.off(e);
e = null;
wViewMgr.enterHall();
}
}, 10);
if (!wNetWork.send("Msg_Hall_GameSessions", {
gtype: wGameData.gameID
})) {
if (e) {
wGEvent.off(e);
e = null;
}
wUIManager.showTips("网络连接失败");
}
}
return [ 2 ];
}
});
});
};
a.prototype.Msg_Hall_GameSessions = function(e) {
if (1 == e.status && e.data) {
wGameData.roomConfig = e.data;
this.loadRoom();
} else {
wLog.e("请求游戏配置失败");
wViewMgr.enterHall();
}
};
a.prototype.preloadGameRes = function() {
var e = o.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir(e.prefabUrl, e.enName);
wRes.preloadDir("prefab/Room", e.enName);
};
a.prototype.loadRoom = function() {
var e = this, a = wGameData.gameID, t = cc.Canvas.instance.node.getChildByName("Room");
t.active = !0;
var n = o.Config.GamePrefab[a];
wRes.loadRes("prefab/Room", function(a, o) {
return __awaiter(e, void 0, void 0, function() {
return __generator(this, function() {
if (a) {
wViewMgr.enterHall();
return [ 2 ];
}
cc.instantiate(o).parent = t;
wGameData.isReconnect ? this.node.zIndex = 100 : this.node.destroy();
return [ 2 ];
});
});
}, n.enName);
};
return __decorate([ i ], a);
}(cc.Component);
t.default = c;
cc._RF.pop();
}, {
Config: void 0
} ],
ZJH_Room: [ function(e, a, t) {
"use strict";
cc._RF.push(a, "86b86s5N7FAPqcJFH4/OPOq", "ZJH_Room");
Object.defineProperty(t, "__esModule", {
value: !0
});
var o = e("Config"), n = cc._decorator, i = n.ccclass, c = n.property, d = function(e) {
__extends(a, e);
function a() {
var a = null !== e && e.apply(this, arguments) || this;
a.content = null;
a.top = null;
a.bottom = null;
a.head = null;
a.headframe = null;
a.nickname = null;
a.gold = null;
a.bankGold = null;
a.isEnterRoom = !1;
a.isExit = !1;
return a;
}
a.prototype.onLoad = function() {
var e = this;
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
e.initShow();
}, this);
wGameData.isReconnect ? this.loadGame() : this.initRoom();
};
a.prototype.AddSpineEvent = function(e, a) {
cc.isValid(e) && e.getComponent(sp.Skeleton).setCompleteListener(function(t) {
var o = t.animation ? t.animation.name : "";
a(e, o);
});
};
a.prototype.PlaySpineAnimation = function(e, a, t) {
e && e.getComponent(sp.Skeleton) && e.getComponent(sp.Skeleton).setAnimation(0, a, t);
};
a.prototype.ConfigNum = function(e) {
return e < 0 ? "-" + wUtils.goldFormat(Math.abs(e)) : wUtils.goldFormat(Math.abs(e));
};
a.prototype.onEnable = function() {
if (!wGameData.isReconnect) {
this.gold && (this.gold.string = wUtils.numConvert(wGameData.getKey("gold")));
this.enterAni();
}
};
a.prototype.local_Event = function(e) {
switch (e) {
case "up_Gold":
this.gold && (this.gold.string = wUtils.numConvert(wGameData.getKey("gold")));
this.bankGold && (this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank")));
}
};
a.prototype.initRoom = function() {
var e = this, a = wGameData.roomConfig;
this.nickname && (this.nickname.string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10));
this.bankGold && (this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank")));
this.head && wUIHelp.setHead(this.head, wGameData.getKey("headimgurl"), !0);
var t = function(t) {
if (!Object.prototype.hasOwnProperty.call(a, t)) return "continue";
cc.find("Game_Content/" + t + "/Lay/Text_mfty", o.node).active = 0 == a[t].min_gold;
cc.find("Game_Content/" + t + "/Lay/Text_zr", o.node).active = a[t].min_gold > 0;
var n = o.content.getChildByName("" + t);
o.AddNodeClick(n, function() {
wAudioMgr.playBtnSound();
e.enterRoom(Number(n.name));
}, [ cc.Node.EventType.TOUCH_END ]);
}, o = this;
for (var n in a) t(n);
};
a.prototype.AddNodeClick = function(e, a, t) {
var o = e.active;
e.active = !1;
if (t) for (var n = function(o) {
switch (t[o]) {
case cc.Node.EventType.TOUCH_START:
case cc.Node.EventType.TOUCH_MOVE:
case cc.Node.EventType.TOUCH_END:
case cc.Node.EventType.TOUCH_CANCEL:
e.on("" + t[o], function(e) {
a(e, t[o]);
});
}
}, i = 0, c = t.length; i < c; i++) n(i); else {
e.on(cc.Node.EventType.TOUCH_START, function(e) {
a(e, cc.Node.EventType.TOUCH_START);
});
e.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
a(e, cc.Node.EventType.TOUCH_MOVE);
});
e.on(cc.Node.EventType.TOUCH_END, function(e) {
a(e, cc.Node.EventType.TOUCH_END);
});
e.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
a(e, cc.Node.EventType.TOUCH_CANCEL);
});
}
e.active = o;
};
a.prototype.initShow = function() {
this.isEnterRoom = !1;
this.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
this.node.parent.destroyAllChildren();
}
};
a.prototype.enterAni = function() {
this.top.stopAllActions();
this.top.y = 450;
var e = cc.moveTo(.25, cc.v2(0, 375)).easing(cc.easeBackOut());
this.top.runAction(e);
this.bottom.stopAllActions();
this.bottom.y = -100;
var a = cc.moveTo(.25, cc.v2(0, 0)).easing(cc.easeBackOut());
this.bottom.runAction(a);
for (var t = this.content, o = 0; o < t.childrenCount; o++) {
var n = t.children[o], i = cc.v2(n.x, n.y);
n.x += 300;
var c = cc.moveTo(.4, i).easing(cc.easeBackOut());
n.runAction(c);
}
};
a.prototype.Msg_Hall_EnterRoom = function(e) {
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
a.prototype.Msg_Hall_EnterGame = function(e) {
if (1 == e.status) {
wGameData.tableList = e.data;
this.node.parent.active && this.loadGame();
} else {
wLog.e("进入赛事消息失败");
wUIManager.hideLoadingUI();
}
};
a.prototype.enterRoom = function(e) {
var a = this;
if (!this.isEnterRoom) {
wGameData.roomLevel = e;
var t = wGameData.roomConfig[e];
if (t) if (t.min_gold > wGameData.getKey("gold")) wUIManager.enterRoomFailTips(t.min_gold); else if (wGameData.gameRepair()) wUIManager.showTips("游戏维护中"); else {
this.isEnterRoom = !0;
var o = wGEvent.on("Msg_Hall_EnterRoom", function(e) {
a.Msg_Hall_EnterRoom(e);
wGEvent.off(o);
a.unscheduleAllCallbacks();
o = null;
}, this);
this.scheduleOnce(function() {
if (o) {
a.isEnterRoom = !1;
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
a.prototype.faststart = function() {
wAudioMgr.playBtnSound();
var e = wGameData.getKey("gold"), a = wGameData.roomConfig, t = 1;
for (var o in a) Object.prototype.hasOwnProperty.call(a, o) && a[o].min_gold <= e && (t = a[o].level);
this.enterRoom(t);
};
a.prototype.roomOnClick = function(e) {
wAudioMgr.playBtnSound();
var a = e.node.name;
this.enterRoom(Number(a) + 1);
};
a.prototype.onClick = function(e) {
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
"19" == wGameData.gameID ? wViewMgr.openPage({
path: "prefab/RoomBank",
bundle: wGameData.getGameName()
}) : wViewMgr.openPage({
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
a.prototype.loadGame = function() {
var e = o.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(e.prefabUrl, function() {}, function(e, a) {
e ? wLog.e(e) : wViewMgr.openGame(a);
}, e.enName);
};
__decorate([ c(cc.Node) ], a.prototype, "content", void 0);
__decorate([ c(cc.Node) ], a.prototype, "top", void 0);
__decorate([ c(cc.Node) ], a.prototype, "bottom", void 0);
__decorate([ c(cc.Sprite) ], a.prototype, "head", void 0);
__decorate([ c(cc.Sprite) ], a.prototype, "headframe", void 0);
__decorate([ c(cc.Label) ], a.prototype, "nickname", void 0);
__decorate([ c(cc.Label) ], a.prototype, "gold", void 0);
__decorate([ c(cc.Label) ], a.prototype, "bankGold", void 0);
return __decorate([ i ], a);
}(cc.Component);
t.default = d;
cc._RF.pop();
}, {
Config: void 0
} ],
ZJH_Setting: [ function(e, a, t) {
"use strict";
cc._RF.push(a, "19bebIga8FOPrG3y87sbTpx", "ZJH_Setting");
Object.defineProperty(t, "__esModule", {
value: !0
});
var o = cc._decorator, n = o.ccclass, i = o.property, c = function(e) {
__extends(a, e);
function a() {
var a = null !== e && e.apply(this, arguments) || this;
a.label = null;
a.text = "hello";
return a;
}
a.prototype.start = function() {};
__decorate([ i(cc.Label) ], a.prototype, "label", void 0);
__decorate([ i ], a.prototype, "text", void 0);
return __decorate([ n ], a);
}(cc.Component);
t.default = c;
cc._RF.pop();
}, {} ],
ZJH_View: [ function(e, a, t) {
"use strict";
cc._RF.push(a, "7f156kXcspHSJ/MBgKVbDAQ", "ZJH_View");
Object.defineProperty(t, "__esModule", {
value: !0
});
var o = cc._decorator, n = o.ccclass, i = o.property, c = function(e) {
__extends(a, e);
function a() {
var a = null !== e && e.apply(this, arguments) || this;
a.IsVsCard = !1;
a.CardAtlas = null;
a.AnimationClip = null;
return a;
}
a.prototype.Init = function() {
this.Init_Data();
this.Init_Buttons();
this.Init_Node();
};
a.prototype.Init_Buttons = function() {
var e = this;
this.AddNodeClick(cc.find("Node_UI/Btn_SeeCard", this.node), function() {
wAudioMgr.playBtnSound();
wNetWork.send("Msg_ZJH_LookCards", {}, !0);
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Touch", this.node), function() {
wAudioMgr.playBtnSound();
cc.find("Node_UI/Sp_QD", e.node).active = !0;
cc.find("Node_UI/Sp_QD", e.node).scaleY = e.node.width / 1334;
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Lay_Operate/Btn_QP", this.node), function(e) {
if (cc.find("On", e.target).active) {
wAudioMgr.playBtnSound();
wNetWork.send("Msg_ZJH_ActBet", {
act: 5,
gold: -1
}, !0);
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Lay_Operate/Btn_BP", this.node), function(a) {
if (cc.find("On", a.target).active) {
wAudioMgr.playBtnSound();
e.Find_VsCard();
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Lay_Operate/Btn_QY", this.node), function(a) {
if (cc.find("On", a.target).active) {
wAudioMgr.playBtnSound();
wNetWork.send("Msg_ZJH_ActBet", {
act: 4,
gold: e.DataMgr.GameData.MaxYaGold
}, !0);
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Lay_Operate/Btn_GZ", this.node), function(a) {
if (cc.find("On", a.target).active) {
wAudioMgr.playBtnSound();
wNetWork.send("Msg_ZJH_ActBet", {
act: 2,
gold: e.DataMgr.GameData.GengZhuGold
}, !0);
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Lay_Operate/Btn_JZ", this.node), function(e) {
cc.find("On", e.target).active && wAudioMgr.playBtnSound();
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Lay_Operate/Node_Data/Lay/1", this.node), function(a) {
if (cc.find("On", a.target).active) {
wAudioMgr.playBtnSound();
var t = e.DataMgr.GameData.IsSelfSeeCard ? 6 * e.DataMgr.GameData.DiZhuGold : 3 * e.DataMgr.GameData.DiZhuGold;
wNetWork.send("Msg_ZJH_ActBet", {
act: 3,
gold: Math.floor(t)
}, !0);
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Lay_Operate/Node_Data/Lay/2", this.node), function(a) {
if (cc.find("On", a.target).active) {
wAudioMgr.playBtnSound();
var t = e.DataMgr.GameData.IsSelfSeeCard ? 10 * e.DataMgr.GameData.DiZhuGold : 5 * e.DataMgr.GameData.DiZhuGold;
wNetWork.send("Msg_ZJH_ActBet", {
act: 3,
gold: Math.floor(t)
}, !0);
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Lay_Operate/Node_Data/Lay/3", this.node), function(a) {
if (cc.find("On", a.target).active) {
wAudioMgr.playBtnSound();
var t = e.DataMgr.GameData.IsSelfSeeCard ? 16 * e.DataMgr.GameData.DiZhuGold : 8 * e.DataMgr.GameData.DiZhuGold;
wNetWork.send("Msg_ZJH_ActBet", {
act: 3,
gold: Math.floor(t)
}, !0);
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Lay_Operate/Node_Data/Lay/4", this.node), function(a) {
if (cc.find("On", a.target).active) {
wAudioMgr.playBtnSound();
var t = e.DataMgr.GameData.IsSelfSeeCard ? 20 * e.DataMgr.GameData.DiZhuGold : 10 * e.DataMgr.GameData.DiZhuGold;
wNetWork.send("Msg_ZJH_ActBet", {
act: 3,
gold: Math.floor(t)
}, !0);
}
}, [ cc.Node.EventType.TOUCH_END ]);
for (var a = function(a) {
if ("1" == a.name) return "continue";
t.AddNodeClick(cc.find("Node_Vs/Img_BG", a), function() {
wAudioMgr.playBtnSound();
for (var t in e.DataMgr.PlayerDatas) if (e.DataMgr.PlayerDatas.hasOwnProperty(t)) {
var o = e.DataMgr.PlayerDatas[t];
if (o.LocalSeat == +a.name) {
wNetWork.send("Msg_ZJH_CompareCards", {
uid: o.UserID
}, !0);
e.Close_VSCardView();
break;
}
}
}, [ cc.Node.EventType.TOUCH_END ]);
}, t = this, o = 0, n = cc.find("Node_UI/Node_Players", this.node).children; o < n.length; o++) a(n[o]);
this.AddNodeClick(cc.find("Node_UI/Lay_Operate/Btn_GDD", this.node), function(a) {
if (cc.find("On", a.target).active) {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.IsAutoGengZhu = !0;
cc.find("Node_UI/Lay_Operate/Btn_GDD", e.node).active = !e.DataMgr.GameData.IsAutoGengZhu;
cc.find("Node_UI/Lay_Operate/Btn_QXGZ", e.node).active = e.DataMgr.GameData.IsAutoGengZhu;
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("Node_UI/Lay_Operate/Btn_QXGZ", this.node), function(a) {
if (cc.find("On", a.target).active) {
wAudioMgr.playBtnSound();
e.DataMgr.GameData.IsAutoGengZhu = !1;
cc.find("Node_UI/Lay_Operate/Btn_GDD", e.node).active = !e.DataMgr.GameData.IsAutoGengZhu;
cc.find("Node_UI/Lay_Operate/Btn_QXGZ", e.node).active = e.DataMgr.GameData.IsAutoGengZhu;
}
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("DropDown/switchBtn/mask/panel/exit", this.node), function() {
wAudioMgr.playBtnSound();
e.DataMgr.Game_Controlle.m_quitGame();
}, [ cc.Node.EventType.TOUCH_END ]);
this.AddNodeClick(cc.find("DropDown/switchBtn/mask/panel/bank", this.node), function() {
wAudioMgr.playBtnSound();
wUIManager.showTips("在房间内不能进行取款操作");
}, [ cc.Node.EventType.TOUCH_END ]);
};
a.prototype.Init_Data = function() {
for (var e = 1; e <= 5; e++) {
for (var a = 0, t = cc.find("Node_UI/Node_Players/" + e + "/Node_Cards", this.node).children; a < t.length; a++) {
var o = t[a];
o.Init_Pos = o.position;
}
cc.find("Node_UI/Node_Players/" + e + "/Img_IsXian", this.node).Init_Pos = cc.find("Node_UI/Node_Players/" + e + "/Img_IsXian", this.node).position;
}
};
a.prototype.Init_Node = function() {
for (var e = this, a = 0, t = cc.find("Node_UI/Node_Players", this.node).children; a < t.length; a++) {
var o = t[a];
o.active = !1;
o.Init_Pos = o.position;
cc.find("Node_Cards", o).active = !1;
cc.find("Img_IsXian", o).active = !1;
cc.find("Node_Player", o).active = !0;
cc.find("Img_KP", o).active = !1;
cc.find("Img_BPS", o).active = !1;
cc.find("Img_QP", o).active = !1;
cc.find("Lab_Count", o).active = !1;
cc.find("Node_Player/Lab_Name", o).getComponent(cc.Label).string = "";
cc.find("Node_Player/Lab_Gold", o).getComponent(cc.Label).string = "";
cc.find("Node_Player/Node_Time", o).active = !1;
cc.find("Node_Player/SP_QD", o).active = !1;
cc.find("Img_Jetton", o).active = !1;
for (var n = 0, i = cc.find("Node_Cards", o).children; n < i.length; n++) {
(l = i[n]).Init_Pos = l.position;
cc.find("Node_Mask", l).active = !1;
}
cc.find("Node_Win", o).active = !1;
for (var c = 0, d = cc.find("Node_Win/Node_Type", o).children; c < d.length; c++) (l = d[c]).active = !1;
for (var r = 0, s = cc.find("Node_Win/Node_Cards", o).children; r < s.length; r++) {
var l;
(l = s[r]).Init_Pos = l.position;
}
"1" == o.name && (cc.find("Lab_DelayStart", o).active = !1);
}
for (var _ = 0, f = cc.find("Node_UI/Node_ST/Node_OpenCards", this.node).children; _ < f.length; _++) (m = f[_]).Init_Pos = m.position;
for (var g = 0, p = cc.find("Node_UI/Node_Players/1/Node_OpenCards", this.node).children; g < p.length; g++) {
var m;
(m = p[g]).Init_Pos = m.position;
cc.find("Node_Mask", m).active = !1;
}
cc.find("Node_UI/Node_SelfWin", this.node).active = !1;
this.AddSpineEvent(cc.find("Node_UI/Node_SelfWin/Sp_SelfWin", this.node), function() {
cc.find("Node_UI/Node_SelfWin", e.node).active = !1;
});
cc.find("Node_UI/SP_Win", this.node).active = !1;
this.AddSpineEvent(cc.find("Node_UI/SP_Win", this.node), function() {
cc.find("Node_UI/SP_Win", e.node).active = !1;
});
cc.find("Node_UI/Img_SelfCardType", this.node).active = !1;
cc.find("Node_UI/Node_JettonRegion/Node_Copys", this.node).active = !1;
cc.find("Node_UI/Node_JettonRegion/Node_Points", this.node).active = !1;
cc.find("Node_UI/Node_JettonRegion/Node_Root", this.node).removeAllChildren();
cc.find("Node_UI/Lab_RoomInfo", this.node).getComponent(cc.Label).string = "";
cc.find("Node_UI/Img_AllJetton/Lab_Gold", this.node).getComponent(cc.Label).string = "0";
cc.find("Node_UI/Btn_SeeCard", this.node).active = !1;
cc.find("Node_UI/Node_VSView/Left_Player", this.node).Init_Pos = cc.find("Node_UI/Node_VSView/Left_Player", this.node).getPosition();
cc.find("Node_UI/Node_VSView/Right_Player", this.node).Init_Pos = cc.find("Node_UI/Node_VSView/Right_Player", this.node).getPosition();
cc.find("Node_UI/Node_VSView/Img_Left", this.node).Init_Pos = cc.find("Node_UI/Node_VSView/Img_Left", this.node).getPosition();
cc.find("Node_UI/Node_VSView/Img_Right", this.node).Init_Pos = cc.find("Node_UI/Node_VSView/Img_Right", this.node).getPosition();
cc.find("Node_UI/Node_VSView", this.node).active = !1;
cc.find("Node_UI/Sp_QD", this.node).active = !1;
cc.find("Node_UI/Node_ST", this.node).active = !1;
cc.find("Node_UI/Lay_Operate", this.node).active = !1;
cc.find("Node_UI/Img_FaCard", this.node).active = !1;
this.Close_VSCardView();
};
a.prototype.Init_Game = function() {
for (var e = 0, a = cc.find("Node_UI/Node_Players", this.node).children; e < a.length; e++) {
var t = a[e];
cc.find("Img_IsXian", t).active = !1;
cc.find("Img_KP", t).active = !1;
cc.find("Img_QP", t).active = !1;
cc.find("Img_BPS", t).active = !1;
cc.find("Node_Player/Node_Time", t).active = !1;
cc.find("Node_Cards", t).active = !1;
cc.find("Img_Jetton", t).active = !1;
cc.find("Lab_Count", t).active = !1;
cc.find("Node_Player/SP_QD", t).active = !1;
for (var o = 0, n = cc.find("Node_Cards", t).children; o < n.length; o++) {
var i = n[o];
cc.find("Node_Mask", i).active = !1;
}
cc.find("Node_Win", t).active = !1;
for (var c = 0, d = cc.find("Node_Win/Node_Type", t).children; c < d.length; c++) (i = d[c]).active = !1;
"1" == t.name && (cc.find("Lab_DelayStart", t).active = !1);
}
cc.find("Node_UI/Lay_Operate", this.node).active = !1;
for (var r = 0, s = cc.find("Node_UI/Node_Players/1/Node_OpenCards", this.node).children; r < s.length; r++) {
var l = s[r];
l.Init_Pos = l.position;
cc.find("Node_Mask", l).active = !1;
}
cc.find("Node_UI/Node_Players/1/Node_OpenCards", this.node).active = !1;
cc.find("Node_UI/Node_VSView", this.node).active = !1;
cc.find("Node_UI/Sp_QD", this.node).active = !1;
cc.find("Node_UI/Node_ST", this.node).active = !1;
cc.find("Node_UI/Img_FaCard", this.node).active = !1;
cc.find("Node_UI/Img_SelfCardType", this.node).active = !1;
this.Set_AllJetton(0);
this.Close_PlayerDownTime(0);
};
a.prototype.Update_ButtonState = function(e) {
var a = cc.find("Node_UI/Lay_Operate", this.node);
a.active = !0;
for (var t = 0, o = a.children; t < o.length; t++) o[t].active = !1;
cc.find("Node_UI/Btn_SeeCard", this.node).active = !1;
if (!e) {
var n = this.DataMgr.PlayerDatas[this.DataMgr.GameData.SelfUserID], i = n.Jetton <= this.DataMgr.GameData.DiZhuGold, c = !0, d = 0, r = this.DataMgr.GameData.OperateUserID == this.DataMgr.GameData.SelfUserID;
for (var s in this.DataMgr.PlayerDatas) if (this.DataMgr.PlayerDatas.hasOwnProperty(s)) {
var l = this.DataMgr.PlayerDatas[s];
l.IsGame && !l.IsDiuQiCard && l.Jetton <= this.DataMgr.GameData.DiZhuGold && (c = !1);
l.IsGame && !l.IsDiuQiCard && d++;
}
if (n.IsGame) {
n.IsSeeCard || (cc.find("Node_UI/Btn_SeeCard", this.node).active = c || n.IsDiuQiCard);
if (!n.IsDiuQiCard && !n.IsVSCardLose) if (r) {
cc.find("Btn_QP", a).active = !0;
cc.find("Btn_BP", a).active = !0;
cc.find("Btn_BP/On", a).active = !i;
cc.find("Btn_BP/OFF", a).active = i;
cc.find("Btn_QY", a).active = !0;
cc.find("Btn_QY/On", a).active = 2 == d;
cc.find("Btn_QY/OFF", a).active = 2 != d;
cc.find("Btn_GZ", a).active = !0;
cc.find("Btn_GZ/On", a).active = !0;
cc.find("Btn_GZ/OFF", a).active = !1;
cc.find("Node_Data", a).active = !0;
var _ = this.DataMgr.GameData.GengZhuGold, f = this.DataMgr.GameData.IsSelfSeeCard, g = f ? _ <= 6 * this.DataMgr.GameData.DiZhuGold : _ <= 3 * this.DataMgr.GameData.DiZhuGold;
cc.find("Node_Data/Lay/1/On", a).active = g;
cc.find("Node_Data/Lay/1/Off", a).active = !g;
cc.find("Node_Data/Lay/1/Lab_Text", a).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(f ? Math.floor(6 * this.DataMgr.GameData.DiZhuGold) : Math.floor(3 * this.DataMgr.GameData.DiZhuGold));
g = f ? _ <= 10 * this.DataMgr.GameData.DiZhuGold : _ <= 5 * this.DataMgr.GameData.DiZhuGold;
cc.find("Node_Data/Lay/2/On", a).active = g;
cc.find("Node_Data/Lay/2/Off", a).active = !g;
cc.find("Node_Data/Lay/2/Lab_Text", a).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(f ? Math.floor(10 * this.DataMgr.GameData.DiZhuGold) : Math.floor(5 * this.DataMgr.GameData.DiZhuGold));
g = f ? _ <= 16 * this.DataMgr.GameData.DiZhuGold : _ <= 8 * this.DataMgr.GameData.DiZhuGold;
cc.find("Node_Data/Lay/3/On", a).active = g;
cc.find("Node_Data/Lay/3/Off", a).active = !g;
cc.find("Node_Data/Lay/3/Lab_Text", a).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(f ? Math.floor(16 * this.DataMgr.GameData.DiZhuGold) : Math.floor(8 * this.DataMgr.GameData.DiZhuGold));
g = f ? _ <= 20 * this.DataMgr.GameData.DiZhuGold : _ <= 10 * this.DataMgr.GameData.DiZhuGold;
cc.find("Node_Data/Lay/4/On", a).active = g;
cc.find("Node_Data/Lay/4/Off", a).active = !g;
cc.find("Node_Data/Lay/4/Lab_Text", a).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(f ? Math.floor(20 * this.DataMgr.GameData.DiZhuGold) : Math.floor(10 * this.DataMgr.GameData.DiZhuGold));
} else {
cc.find("Btn_QP", a).active = !0;
cc.find("Btn_GDD", a).active = !this.DataMgr.GameData.IsAutoGengZhu;
cc.find("Btn_GDD/On", a).active = !0;
cc.find("Btn_GDD/OFF", a).active = !1;
cc.find("Btn_QXGZ", a).active = this.DataMgr.GameData.IsAutoGengZhu;
cc.find("Btn_QXGZ/On", a).active = !0;
cc.find("Btn_QXGZ/OFF", a).active = !1;
}
}
}
};
a.prototype.Set_RoomInfo = function(e) {
var a = {
1: "体验场房",
2: "初级场房",
3: "普通场房",
4: "中级场房",
5: "高级场房"
};
e.CurGameCount > 0 ? cc.find("Node_UI/Lab_RoomInfo", this.node).getComponent(cc.Label).string = a[e.RoomType] + " 底注:" + this.DataMgr.ConfigNum(e.DiZhuGold, 0, 0) + " 单注上限:" + this.DataMgr.ConfigNum(e.OneJettonLimit, 0, 0) + " 第" + e.CurGameCount + "/" + e.AllGameCount + "轮" : cc.find("Node_UI/Lab_RoomInfo", this.node).getComponent(cc.Label).string = a[e.RoomType] + " 底注:0 单注上限:0";
};
a.prototype.Set_PlayerInfo = function(e) {
var a = cc.find("Node_UI/Node_Players/" + e.LocalSeat, this.node);
a.active = !0;
cc.find("Node_Player", a).opacity = !e.IsGame || e.IsVSCardLose || e.IsDiuQiCard ? 127 : 255;
1 == e.LocalSeat && "1" == a.name && (cc.find("Lab_DelayStart", a).active = !e.IsGame && !e.IsVSCardLose && !e.IsDiuQiCard);
cc.find("Node_Player/Lab_Name", a).getComponent(cc.Label).string = "" + wUtils.handleNameLen(e.UserName, 6);
wUIHelp.setHead(cc.find("Node_Player/Img_Head", a), e.HeadPath);
this.DataMgr.GameData.XianShouPlayerID == e.UserID && this.Set_XianShouPlayer(e.LocalSeat, !1);
};
a.prototype.Play_EnterPlayer = function(e) {
this.Set_PlayerInfo(e);
JSON.stringify(e);
var a = cc.find("Node_UI/Node_Players/" + e.LocalSeat, this.node);
a.stopAllActions();
a.Init_Pos.x < 0 ? a.x -= 200 : a.x += 200;
a.runAction(cc.moveTo(.2, cc.v2(a.Init_Pos)));
};
a.prototype.Set_PlayerCold = function(e, a) {
var t = cc.find("Node_UI/Node_Players/" + e, this.node);
cc.find("Node_Player/Lab_Gold", t).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(a);
};
a.prototype.Set_PlayerStartGame = function(e, a) {
var t = cc.find("Node_UI/Node_Players/" + e, this.node);
cc.find("Node_Player", t).opacity = a ? 255 : 127;
};
a.prototype.Play_ClosePlayer = function(e) {
var a = cc.find("Node_UI/Node_Players/" + e.LocalSeat, this.node);
a.stopAllActions();
a.Init_Pos.x < 0 ? a.runAction(cc.sequence(cc.moveTo(.2, cc.v2(a.Init_Pos.x - 200, a.Init_Pos.y)), cc.callFunc(function() {
a.active = !1;
}))) : a.runAction(cc.sequence(cc.moveTo(.2, cc.v2(a.Init_Pos.x + 200, a.Init_Pos.y)), cc.callFunc(function() {
a.active = !1;
})));
};
a.prototype.Update_PlayerGameState = function() {
for (var e in this.DataMgr.PlayerDatas) if (this.DataMgr.PlayerDatas.hasOwnProperty(e)) {
var a = this.DataMgr.PlayerDatas[e], t = cc.find("Node_UI/Node_Players/" + a.LocalSeat, this.node);
cc.find("Node_Player", t).opacity = !a.IsGame || a.IsVSCardLose || a.IsDiuQiCard ? 127 : 255;
+e == this.DataMgr.GameData.SelfUserID && "1" == t.name && (cc.find("Lab_DelayStart", t).active = !a.IsGame && !a.IsVSCardLose && !a.IsDiuQiCard);
for (var o = 0, n = cc.find("Node_Cards", t).children; o < n.length; o++) {
var i = n[o];
cc.find("Node_Mask", i).active = !a.IsGame || a.IsVSCardLose || a.IsDiuQiCard;
}
if (1 == a.LocalSeat) for (var c = 0, d = cc.find("Node_UI/Node_Players/1/Node_OpenCards", this.node).children; c < d.length; c++) {
var r = d[c];
r.Init_Pos = r.position;
cc.find("Node_Mask", r).active = !a.IsGame || a.IsVSCardLose || a.IsDiuQiCard;
}
}
};
a.prototype.Play_SelfWinAction = function() {
cc.find("Node_UI/SP_Win", this.node).active = !0;
cc.find("Node_UI/SP_Win", this.node).getComponent(sp.Skeleton).setAnimation(0, "animation", !1);
};
a.prototype.Play_SelfAddScore = function(e, a) {
var t = cc.find("Node_UI/Node_Players/" + e, this.node);
cc.find("Lab_Count", t).active = !0;
cc.find("Lab_Count", t).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(a);
cc.find("Lab_Count", t).stopAllActions();
cc.find("Lab_Count", t).setPosition(cc.v2(0, 0));
cc.find("Lab_Count", t).runAction(cc.sequence(cc.moveBy(.2, cc.v2(0, 150)), cc.delayTime(1), cc.callFunc(function() {
cc.find("Lab_Count", t).active = !1;
})));
};
a.prototype.Play_STAction = function(e, a) {
var t = this, o = cc.find("Node_UI/Node_Players/" + e + "/Node_Player", this.node);
cc.find("Node_UI/Node_ST", this.node).active = !0;
var n = cc.find("Node_UI/Node_ST/Node_OpenCards", this.node);
n.active = !1;
cc.find("Node_UI/Node_ST/Img_Head", this.node).active = !1;
cc.find("Node_UI/Node_ST/Lab_Name", this.node).active = !1;
this.AddSpineEvent(cc.find("Node_UI/Node_ST/SP_ST", this.node), function(e, o) {
if ("start" == o) {
cc.find("Node_UI/Node_ST/Img_Head", t.node).active = !0;
cc.find("Node_UI/Node_ST/Lab_Name", t.node).active = !0;
cc.find("Node_UI/Node_ST/SP_ST", t.node).getComponent(sp.Skeleton).setAnimation(0, "idle", !1);
n.active = !0;
for (var i = cc.find("1", n).Init_Pos, c = 0, d = n.children.length; c < d; c++) {
var r = n.children[c];
r.stopAllActions();
r.setPosition(cc.v2(i.x, i.y));
t.Set_CardValue(r, a[c]);
r.runAction(cc.sequence(cc.moveTo(.1, cc.v2(i.x, i.y + 40)), cc.moveTo(.1, cc.v2(i.x, i.y)), cc.moveTo(.2, cc.v2(r.Init_Pos))));
}
} else "idle" == o ? cc.find("Node_UI/Node_ST/SP_ST", t.node).getComponent(sp.Skeleton).setAnimation(0, "end", !1) : "end" == o && (cc.find("Node_UI/Node_ST", t.node).active = !1);
});
cc.find("Node_UI/Node_ST/Img_Head", this.node).getComponent(cc.Sprite).spriteFrame = cc.find("Img_Head", o).getComponent(cc.Sprite).spriteFrame;
cc.find("Node_UI/Node_ST/Lab_Name", this.node).getComponent(cc.Label).string = cc.find("Lab_Name", o).getComponent(cc.Label).string;
for (var i = {}, c = {}, d = 0, r = a; d < r.length; d++) {
var s = r[d], l = s % 100, _ = Math.floor(s / 100);
i[l] = i[l] ? 1 : i[l] + 1;
c[_] = c[_] ? 1 : c[_] + 1;
}
a.sort(function(e, a) {
var t = Math.floor(e / 100), o = Math.floor(a / 100);
return e + 1e3 * c[t] + c[e % 100] - (a + 1e3 * c[o] + c[a % 100]);
});
cc.find("Node_UI/Node_ST/SP_ST", this.node).getComponent(sp.Skeleton).setAnimation(0, "start", !1);
};
a.prototype.Find_VsCard = function() {
var e = this.DataMgr.PlayerDatas[this.DataMgr.GameData.SelfUserID];
if (e.IsGame && !e.IsDiuQiCard) {
var a = 0;
for (var t in this.DataMgr.PlayerDatas) this.DataMgr.PlayerDatas.hasOwnProperty(t) && (o = this.DataMgr.PlayerDatas[t]).IsGame && !o.IsDiuQiCard && +o.UserID != this.DataMgr.GameData.SelfUserID && a++;
if (1 == a) {
for (var t in this.DataMgr.PlayerDatas) if (this.DataMgr.PlayerDatas.hasOwnProperty(t)) {
var o;
if ((o = this.DataMgr.PlayerDatas[t]).IsGame && !o.IsDiuQiCard && +o.UserID != this.DataMgr.GameData.SelfUserID) {
wNetWork.send("Msg_ZJH_CompareCards", {
uid: o.UserID
}, !0);
break;
}
}
} else a > 1 && this.Open_VSCardView();
}
};
a.prototype.Play_PlayerDownTime = function(e, a) {
this.Close_PlayerDownTime(0);
var t = cc.find("Node_UI/Node_Players/" + e + "/Node_Player/Node_Time", this.node);
t.active = !0;
cc.find("Par_Point", t).getComponent(cc.ParticleSystem).resetSystem();
(function e(a, t) {
if (a.comps) for (var o in a.comps) if (a.comps.hasOwnProperty(o)) {
var n = a.comps[o];
for (var i in n) if (n.hasOwnProperty(i)) for (var c = 0, d = n[i]; c < d.length; c++) {
(l = d[c]).Init_Frame || (l.Init_Frame = l.frame);
l.frame = l.Init_Frame * t;
}
}
if (a.props) for (var o in a.props) if (a.props.hasOwnProperty(o)) for (var r = 0, s = n = a.props[o]; r < s.length; r++) {
var l;
(l = s[r]).Init_Frame || (l.Init_Frame = l.frame);
l.frame = l.Init_Frame * t;
}
if (a.paths) for (var o in a.paths) a.paths.hasOwnProperty(o) && e(a.paths[o], t);
})(this.AnimationClip.curveData, this.DataMgr.GameData.AllOperateTime);
this.AnimationClip._duration = this.DataMgr.GameData.AllOperateTime;
t.getComponent(cc.Animation).currentClip = this.AnimationClip;
t.getComponent(cc.Animation).stop();
t.getComponent(cc.Animation).play("anim_player_time", this.DataMgr.GameData.AllOperateTime - a);
t.runAction(cc.sequence(cc.delayTime(a - 7), cc.callFunc(function() {
t.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1), cc.callFunc(function() {
wAudioMgr.playSound("sound/0_downtime", "ZJH");
}))));
})));
};
a.prototype.Close_PlayerDownTime = function(e) {
if (0 == e) for (var a = 0, t = cc.find("Node_UI/Node_Players", this.node).children; a < t.length; a++) {
var o = t[a];
cc.find("Node_Player/Node_Time", o).stopAllActions();
cc.find("Node_Player/Node_Time", o).active = !1;
cc.find("Node_Player/Node_Time/Par_Point", o).getComponent(cc.ParticleSystem).resetSystem();
} else {
o = cc.find("Node_UI/Node_Players/" + e + "/Node_Player/Node_Time", this.node);
cc.find("Par_Point", o).getComponent(cc.ParticleSystem).resetSystem();
o.getComponent(cc.Animation).stop();
}
};
a.prototype.Set_XianShouPlayer = function(e, a) {
for (var t = 0, o = cc.find("Node_UI/Node_Players", this.node).children; t < o.length; t++) {
var n = o[t];
cc.find("Img_IsXian", n).active = n.name == "" + e;
cc.find("Img_IsXian", n).stopAllActions();
}
if (a) {
var i = cc.find("Node_UI/Node_Players/" + e + "/Img_IsXian", this.node), c = i.Init_Pos, d = i.parent.convertToNodeSpaceAR(cc.v2(0, 0));
d.x += this.node.width / 2;
d.y += this.node.height / 2;
i.setPosition(d);
i.runAction(cc.moveTo(.2, cc.v2(c)));
}
};
a.prototype.Set_Jetton = function(e, a) {
var t = cc.find("Node_UI/Node_Players/" + e + "/Img_Jetton", this.node);
t.active = a > 0;
a > 0 && (cc.find("Lab_Gold", t).getComponent(cc.Label).string = "" + a);
};
a.prototype.Set_AllJetton = function(e) {
cc.find("Node_UI/Img_AllJetton/Lab_Gold", this.node).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(e);
};
a.prototype.Close_JettonRegion = function(e, a) {
if (e > 0) for (var t = cc.find("Node_UI/Node_Players/" + e, this.node), o = cc.find("Node_UI/Node_JettonRegion/Node_Root", this.node).children, n = function(e, n) {
o[e].runAction(cc.sequence(cc.moveTo(.3, cc.v2(t.position)), cc.callFunc(function() {
wAudioMgr.playSound("sound/0_cm", "ZJH");
e == n - 1 && a && a();
}), cc.removeSelf()));
}, i = 0, c = o.length; i < c; i++) n(i, c); else cc.find("Node_UI/Node_JettonRegion/Node_Root", this.node).removeAllChildren();
};
a.prototype.Play_JettonRegion = function(e, a, t) {
var o = cc.find("Node_UI/Node_JettonRegion/Node_Root", this.node), n = null, i = {}, c = this.DataMgr.PlayerDatas[e];
if (t) n = cc.instantiate(cc.find("Node_UI/Node_JettonRegion/Node_Copys/5", this.node)); else {
i = c.IsSeeCard ? {
1: 0,
2: 6 * this.DataMgr.GameData.DiZhuGold,
3: 10 * this.DataMgr.GameData.DiZhuGold,
4: 16 * this.DataMgr.GameData.DiZhuGold
} : {
1: 0,
2: 3 * this.DataMgr.GameData.DiZhuGold,
3: 5 * this.DataMgr.GameData.DiZhuGold,
4: 8 * this.DataMgr.GameData.DiZhuGold
};
for (var d = 4; d >= 1; d--) if (a >= i[d]) {
n = cc.instantiate(cc.find("Node_UI/Node_JettonRegion/Node_Copys/" + d, this.node));
break;
}
}
o.addChild(n);
var r = cc.find("Node_UI/Node_JettonRegion/Node_Points", this.node).children, s = r[wUtils.random(0, r.length - 1)].position;
n.setPosition(cc.find("Node_UI/Node_Players/" + c.LocalSeat, this.node).position);
n.runAction(cc.sequence(cc.spawn(cc.moveTo(.5, cc.v2(s)), cc.rotateTo(.5, wUtils.random(0, 50) - 25)), cc.callFunc(function() {
wAudioMgr.playSound("sound/0_dcm", "ZJH");
})).easing(cc.easeSineOut()));
a >= 1e8 && "" + a[("" + a).length - 8] == "0" ? cc.find("Lab_Count", n).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(a, 0, 0) : a >= 1e4 && "" + a[("" + a).length - 4] == "0" ? cc.find("Lab_Count", n).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(a, 0) : cc.find("Lab_Count", n).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(a);
};
a.prototype.Set_JettonItems = function(e, a, t) {
var o, n = this.DataMgr.ScoreSplit(e, a), i = cc.find("Node_UI/Node_JettonRegion/Node_Points", this.node).children, c = cc.find("Node_UI/Node_JettonRegion/Node_Root", this.node), d = this.DataMgr.PlayerDatas[e];
if (t) {
(o = cc.instantiate(cc.find("Node_UI/Node_JettonRegion/Node_Copys/5", this.node))).setPosition(i[wUtils.random(0, i.length - 1)].position);
a >= 1e8 && "" + a[("" + a).length - 8] == "0" ? cc.find("Lab_Count", o).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(a, 0, 0) : a >= 1e4 && "" + a[("" + a).length - 4] == "0" ? cc.find("Lab_Count", o).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(a, 0) : cc.find("Lab_Count", o).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(a);
c.addChild(o);
} else for (var r = {}, s = 0, l = n; s < l.length; s++) {
var _ = l[s];
o = cc.instantiate(cc.find("Node_UI/Node_JettonRegion/Node_Copys/1", this.node));
r = d.IsSeeCard ? {
1: 0,
2: 6 * this.DataMgr.GameData.DiZhuGold,
3: 10 * this.DataMgr.GameData.DiZhuGold,
4: 16 * this.DataMgr.GameData.DiZhuGold
} : {
1: 0,
2: 3 * this.DataMgr.GameData.DiZhuGold,
3: 5 * this.DataMgr.GameData.DiZhuGold,
4: 8 * this.DataMgr.GameData.DiZhuGold
};
for (var f = 4; f >= 1; f--) if (_ >= r[f]) {
o = cc.instantiate(cc.find("Node_UI/Node_JettonRegion/Node_Copys/" + f, this.node));
break;
}
c.addChild(o);
o.setPosition(i[wUtils.random(0, i.length - 1)].position);
cc.find("Lab_Count", o).getComponent(cc.Label).string = _ >= 1e8 && "0" == ("" + _)[("" + _).length - 8] ? "" + this.DataMgr.ConfigNum(_, 0, 0) : _ >= 1e4 && "0" == ("" + _)[("" + _).length - 4] ? "" + this.DataMgr.ConfigNum(_, 0) : "" + this.DataMgr.ConfigNum(_);
}
};
a.prototype.Init_PlayerInfo = function(e) {
var a = cc.find("Node_UI/Node_Players/" + e, this.node);
cc.find("Img_IsXian", a).active = !1;
cc.find("Img_KP", a).active = !1;
cc.find("Img_QP", a).active = !1;
cc.find("Img_BPS", a).active = !1;
cc.find("Node_Player/Node_Time", a).active = !1;
cc.find("Node_Cards", a).active = !1;
cc.find("Img_Jetton", a).active = !1;
cc.find("Lab_Count", a).active = !1;
cc.find("Node_Player/SP_QD", a).active = !1;
for (var t = 0, o = cc.find("Node_Cards", a).children; t < o.length; t++) {
var n = o[t];
cc.find("Node_Mask", n).active = !1;
}
cc.find("Node_Win", a).active = !1;
for (var i = 0, c = cc.find("Node_Win/Node_Type", a).children; i < c.length; i++) (n = c[i]).active = !1;
};
a.prototype.Close_Card = function() {
for (var e = 0, a = cc.find("Node_UI/Node_Players", this.node).children; e < a.length; e++) {
var t = a[e];
cc.find("Node_Cards", t).active = !1;
}
cc.find("Node_UI/Node_Players/1/Node_OpenCards", this.node).active = !1;
};
a.prototype.Play_FaCard = function(e, a) {
var t = this, o = cc.find("Node_UI/Node_Players/" + e + "/Node_Cards", this.node);
o.active = !0;
cc.find("Node_UI/Img_FaCard", this.node).active = !0;
for (var n = function(e, n) {
var i = o.children[e], c = i.Init_Pos, d = cc.v2(0 - o.parent.x - o.x, 0 - o.parent.y - o.y);
d.y += 100;
d.x /= o.scaleX;
d.y /= o.scaleY;
i.position = cc.v3(d);
i.stopAllActions();
i.opacity = 0;
i.angle = 180;
i.scale = 1;
i.runAction(cc.sequence(cc.delayTime(.05 * e), cc.callFunc(function() {
a && e == n - 1 && (cc.find("Node_UI/Img_FaCard", t.node).active = !1);
}), cc.spawn(cc.moveTo(.2, cc.v2(c)), cc.rotateTo(.2, 0), cc.fadeIn(.2)), cc.callFunc(function() {
wAudioMgr.playSound("sound/0_fp", "ZJH");
})));
}, i = 0, c = o.children.length; i < c; i++) n(i, c);
};
a.prototype.Play_PKAction = function(e, a, t, o) {
var n = this;
cc.find("Node_UI/Node_VSView", this.node).active = !0;
cc.find("Node_UI/Node_VSView", this.node).opacity = 255;
var i = cc.find("Node_UI/Node_Players/" + e, this.node), c = cc.find("Node_UI/Node_Players/" + a, this.node), d = cc.find("Node_UI/Node_VSView/Left_Player", this.node), r = cc.find("Node_UI/Node_VSView/Right_Player", this.node);
cc.find("Sp_Lose", d).active = !1;
cc.find("Sp_Lose", r).active = !1;
cc.find("Lab_Name", d).getComponent(cc.Label).string = cc.find("Node_Player/Lab_Name", i).getComponent(cc.Label).string;
cc.find("Lab_Name", r).getComponent(cc.Label).string = cc.find("Node_Player/Lab_Name", c).getComponent(cc.Label).string;
cc.find("Lab_Gold", d).getComponent(cc.Label).string = cc.find("Node_Player/Lab_Gold", i).getComponent(cc.Label).string;
cc.find("Lab_Gold", r).getComponent(cc.Label).string = cc.find("Node_Player/Lab_Gold", c).getComponent(cc.Label).string;
cc.find("Img_Head", d).getComponent(cc.Sprite).spriteFrame = cc.find("Node_Player/Img_Head", i).getComponent(cc.Sprite).spriteFrame;
cc.find("Img_Head", r).getComponent(cc.Sprite).spriteFrame = cc.find("Node_Player/Img_Head", c).getComponent(cc.Sprite).spriteFrame;
cc.find("Node_Player", i).active = !1;
cc.find("Node_Player", c).active = !1;
d.scale = 1;
r.scale = 1;
d.stopAllActions();
r.stopAllActions();
d.setPosition(i.Init_Pos);
r.setPosition(c.Init_Pos);
d.active = !0;
d.opacity = 255;
r.active = !0;
r.opacity = 255;
cc.find("Node_UI/Node_VSView", this.node).stopAllActions();
cc.find("Node_UI/Node_VSView", this.node).getComponent(cc.Animation).play("anim_pk_start");
cc.find("Sp_Lose", d).active = !1;
cc.find("Sp_Lose", r).active = !1;
this.AddSpineEvent(cc.find("Node_UI/Node_VSView/Sp_PZ", this.node), function() {
cc.find("Node_UI/Node_VSView/Sp_PZ", n.node).active = !1;
});
cc.find("Node_UI/Node_VSView", this.node).runAction(cc.sequence(cc.callFunc(function() {
d.runAction(cc.sequence(cc.scaleTo(.1, 1.2), cc.moveBy(.1, cc.v2(d.Init_Pos.x > i.Init_Pos.x ? -100 : 100, 0)), cc.spawn(cc.moveTo(.1, d.Init_Pos), cc.scaleTo(.1, 1))));
r.runAction(cc.sequence(cc.scaleTo(.1, 1.2), cc.moveBy(.1, cc.v2(r.Init_Pos.x < c.Init_Pos.x ? -100 : 100, 0)), cc.spawn(cc.moveTo(.1, r.Init_Pos), cc.scaleTo(.1, 1))));
}), cc.delayTime(.25), cc.callFunc(function() {
cc.find("Node_UI/Node_VSView/Sp_PZ", n.node).active = !0;
cc.find("Node_UI/Node_VSView/Sp_PZ", n.node).getComponent(sp.Skeleton).setAnimation(0, "animation", !1);
}), cc.delayTime(.5), cc.callFunc(function() {
wAudioMgr.playSound("sound/0_dj", "ZJH");
if (t == e) {
n.AddSpineEvent(cc.find("Sp_Lose", r), function() {
cc.find("Sp_Lose", r).active = !1;
});
cc.find("Sp_Lose", r).active = !0;
cc.find("Sp_Lose", r).getComponent(sp.Skeleton).setAnimation(0, "animation", !1);
r.opacity = 127;
} else {
n.AddSpineEvent(cc.find("Sp_Lose", d), function() {
cc.find("Sp_Lose", d).active = !1;
});
cc.find("Sp_Lose", d).active = !0;
cc.find("Sp_Lose", d).getComponent(sp.Skeleton).setAnimation(0, "animation", !1);
d.opacity = 127;
}
}), cc.delayTime(.3), cc.callFunc(function() {
cc.find("Node_UI/Node_VSView", n.node).getComponent(cc.Animation).play("anim_pk_end");
d.stopAllActions();
r.stopAllActions();
d.runAction(cc.sequence(cc.moveTo(.2, i.Init_Pos), cc.callFunc(function() {
cc.find("Node_Player", i).active = !0;
d.active = !1;
})));
r.runAction(cc.sequence(cc.moveTo(.2, c.Init_Pos), cc.callFunc(function() {
cc.find("Node_Player", c).active = !0;
r.active = !1;
})));
}), cc.delayTime(.2), cc.callFunc(function() {
o && o();
cc.find("Node_UI/Node_VSView", n.node).opacity = 0;
}), cc.delayTime(1), cc.callFunc(function() {
cc.find("Node_UI/Node_VSView", n.node).active = !1;
})));
};
a.prototype.Play_PlayerQD = function(e) {
var a = cc.find("Node_UI/Node_Players/" + e + "/Node_Player/SP_QD", this.node);
a.active = !0;
a.getComponent(sp.Skeleton).setAnimation(0, "animation", !0);
cc.find("Node_UI/Sp_QD", this.node).active = !0;
cc.find("Node_UI/Sp_QD", this.node).scaleY = this.node.width / 1334;
};
a.prototype.Set_PlayerCard = function(e, a) {
var t = cc.find("Node_UI/Node_Players/" + e + "/Node_Cards", this.node);
t.active = a;
for (var o = 0, n = t.children.length; o < n; o++) {
var i = t.children[o];
i.setPosition(i.Init_Pos);
i.stopAllActions();
i.opacity = 255;
i.angle = 0;
i.scale = 1;
}
};
a.prototype.Set_IsSeeCard = function(e) {
cc.find("Node_UI/Node_Players/" + e + "/Img_BPS", this.node).active = !1;
cc.find("Node_UI/Node_Players/" + e + "/Img_KP", this.node).active = !0;
cc.find("Node_UI/Node_Players/" + e + "/Img_QP", this.node).active = !1;
};
a.prototype.Set_IsDQCard = function(e) {
cc.find("Node_UI/Node_Players/" + e + "/Img_BPS", this.node).active = !1;
cc.find("Node_UI/Node_Players/" + e + "/Img_KP", this.node).active = !1;
cc.find("Node_UI/Node_Players/" + e + "/Img_QP", this.node).active = !0;
};
a.prototype.Set_IsBPSCard = function(e) {
cc.find("Node_UI/Node_Players/" + e + "/Img_BPS", this.node).active = !0;
cc.find("Node_UI/Node_Players/" + e + "/Img_KP", this.node).active = !1;
cc.find("Node_UI/Node_Players/" + e + "/Img_QP", this.node).active = !1;
};
a.prototype.Close_CardInfo = function() {
for (var e = 0, a = cc.find("Node_UI/Node_Players", this.node).children; e < a.length; e++) {
var t = a[e];
cc.find("Img_QP", t).active = !1;
cc.find("Img_BPS", t).active = !1;
cc.find("Img_KP", t).active = !1;
}
};
a.prototype.Play_SeeCard = function(e, a) {
for (var t = this, o = {}, n = {}, i = 0, c = e; i < c.length; i++) {
var d = (g = c[i]) % 100, r = Math.floor(g / 100);
o[d] = o[d] ? 1 : o[d] + 1;
n[r] = n[r] ? 1 : n[r] + 1;
}
e.sort(function(e, a) {
var t = Math.floor(e / 100), o = Math.floor(a / 100);
return e + 1e3 * n[t] + n[e % 100] - (a + 1e3 * n[o] + n[a % 100]);
});
cc.find("Node_UI/Btn_SeeCard", this.node).active = !1;
var s = cc.find("Node_UI/Node_Players/1/Node_Cards", this.node), l = cc.find("Node_UI/Node_Players/1/Node_OpenCards", this.node);
l.active = !1;
s.active = !0;
s.stopAllActions();
for (var _ = 0, f = s.children; _ < f.length; _++) {
var g;
(g = f[_]).stopAllActions();
g.runAction(cc.moveTo(.2, cc.v2(cc.find("1", s).Init_Pos)));
}
s.runAction(cc.sequence(cc.delayTime(.2), cc.callFunc(function() {
l.active = !0;
s.active = !1;
for (var o = 0, n = l.children.length; o < n; o++) {
var i = l.children[o];
i.stopAllActions();
cc.find("Node_Mask", i).active = !!a;
t.Set_CardValue(i, e[o]);
i.setPosition(cc.find("1", l).Init_Pos);
i.runAction(cc.moveTo(.2, cc.v2(i.Init_Pos)));
}
l.runAction(cc.sequence(cc.delayTime(.2), cc.callFunc(function() {})));
})));
};
a.prototype.Set_SeeCard = function(e) {
for (var a = {}, t = {}, o = 0, n = e; o < n.length; o++) {
var i = n[o], c = i % 100, d = Math.floor(i / 100);
a[c] = a[c] ? 1 : a[c] + 1;
t[d] = t[d] ? 1 : t[d] + 1;
}
e.sort(function(e, a) {
var o = Math.floor(e / 100), n = Math.floor(a / 100);
return e + 1e3 * t[o] + t[e % 100] - (a + 1e3 * t[n] + t[a % 100]);
});
cc.find("Node_UI/Btn_SeeCard", this.node).active = !1;
var r = cc.find("Node_UI/Node_Players/1/Node_Cards", this.node), s = cc.find("Node_UI/Node_Players/1/Node_OpenCards", this.node);
r.active = !1;
s.active = !0;
for (var l = 0, _ = s.children.length; l < _; l++) {
var f = s.children[l];
f.stopAllActions();
f.setPosition(cc.v2(f.Init_Pos));
this.Set_CardValue(f, e[l]);
}
};
a.prototype.Set_HeadCardQType = function(e) {
for (var a = cc.find("Node_UI/Node_Players/1/Node_OpenCards", this.node), t = cc.find("Node_UI/Node_Players/1/Node_Cards", this.node), o = 0, n = a.children.length; o < n; o++) {
var i = a.children[o];
cc.find("Node_Mask", i).active = !!e;
}
o = 0;
for (n = t.children.length; o < n; o++) {
i = t.children[o];
cc.find("Node_Mask", i).active = !!e;
}
};
a.prototype.Play_DiscardCard = function(e) {
var a = this, t = cc.find("Node_UI/Node_Players/" + e + "/Node_Cards", this.node);
t.active = !0;
for (var o = function(e) {
var a = t.children[e];
a.stopAllActions();
a.setPosition(a.Init_Pos);
a.angle = 0;
a.scale = 1;
a.opacity = 255;
var o = cc.v2(0 - t.parent.x - t.x, 0 - t.parent.y - t.y);
o.y += 150;
o.x /= t.scaleX;
o.y /= t.scaleY;
a.runAction(cc.sequence(cc.delayTime(.1 * e), cc.spawn(cc.moveTo(.5, cc.v2(o)), cc.rotateTo(.5, 180), cc.scaleTo(.5, .5), cc.fadeTo(.5, 80)), cc.delayTime(.02), cc.callFunc(function() {
a.angle = 0;
a.scale = 1;
a.opacity = 0;
wAudioMgr.playSound("sound/0_dqp", "ZJH");
})));
}, n = 0, i = t.children.length; n < i; n++) o(n);
t.stopAllActions();
t.runAction(cc.sequence(cc.delayTime(.9), cc.callFunc(function() {
t.active = !1;
if (1 == e) if (a.DataMgr.PlayerDatas[a.DataMgr.GameData.SelfUserID].IsSeeCard) {
cc.find("Node_UI/Node_Players/" + e + "/Node_OpenCards", a.node).active = !0;
for (var o = 0, n = cc.find("Node_UI/Node_Players/" + e + "/Node_OpenCards", a.node).children; o < n.length; o++) {
(d = n[o]).stopAllActions();
d.setPosition(cc.v2(d.Init_Pos.x, d.Init_Pos.y - 200));
d.runAction(cc.moveTo(.5, d.Init_Pos));
}
} else {
t.active = !0;
for (var i = 0, c = t.children; i < c.length; i++) {
var d;
(d = c[i]).stopAllActions();
d.setPosition(cc.v2(d.Init_Pos.x, d.Init_Pos.y - 200));
d.opacity = 255;
d.angle = 0;
d.scale = 1;
d.runAction(cc.moveTo(.5, d.Init_Pos));
}
}
})));
if (1 == e) {
cc.find("Node_UI/Node_Players/" + e + "/Node_OpenCards", this.node).active = !1;
cc.find("Node_UI/Btn_SeeCard", this.node).active = !1;
}
};
a.prototype.Play_PlayWinAction = function(e, a) {
if (a && 3 == a.length) {
if (+e == this.DataMgr.GameData.SelfUserID) {
cc.find("Node_UI/Node_SelfWin", this.node).active = !0;
cc.find("Node_UI/Node_SelfWin/Sp_SelfWin", this.node).getComponent(sp.Skeleton).setAnimation(0, "animation", !1);
}
var t = this.DataMgr.PlayerDatas[e];
if (t) {
var o = cc.find("Node_UI/Node_Players/" + t.LocalSeat, this.node);
cc.find("Node_Win", o).active = !0;
cc.find("Node_Win", o).stopAllActions();
a.sort(function(e, a) {
return e - a;
});
for (var n = {}, i = {}, c = 0, d = a; c < d.length; c++) {
var r = (u = d[c]) % 100, s = Math.floor(u / 100);
n[r] = n[r] ? 1 : n[r] + 1;
i[s] = i[s] ? 1 : i[s] + 1;
}
for (var l = Math.floor(a[0] / 100) + 1 == Math.floor(a[1] / 100) && Math.floor(a[1] / 100) + 1 == Math.floor(a[2] / 100), _ = 1 == Object.keys(n).length, f = 1 == Object.keys(i).length, g = 2 == Object.keys(i).length, p = 0, m = cc.find("Node_Win/Node_Type", o).children; p < m.length; p++) {
var u;
(u = m[p]).active = !1;
}
_ ? l ? cc.find("Node_Win/Node_Type/Node_THS", o).active = !0 : cc.find("Node_Win/Node_Type/Node_TH", o).active = !0 : i[2] && i[3] && i[5] ? cc.find("Node_Win/Node_Type/Node_235", o).active = !0 : f ? cc.find("Node_Win/Node_Type/Node_ST", o).active = !0 : g ? cc.find("Node_Win/Node_Type/Node_DZ", o).active = !0 : l ? cc.find("Node_Win/Node_Type/Node_SZ", o).active = !0 : cc.find("Node_Win/Node_Type/Node_GP", o).active = !0;
a.sort(function(e, a) {
var t = Math.floor(e / 100), o = Math.floor(a / 100);
return e + 1e3 * i[t] + i[e % 100] - (a + 1e3 * i[o] + i[a % 100]);
});
cc.find("Node_Win/Lab_Gold", o).active = !1;
cc.find("Node_Win/Lab_Gold", o).getComponent(cc.Label).string = "" + this.DataMgr.ConfigNum(t.Gold);
for (var D = 0; D < 3; D++) {
var h = cc.find("Node_Win/Node_Cards/" + (D + 1), o);
this.Set_CardValue(h, a[D]);
var y = cc.find("Node_Win/Node_Cards/1", o).Init_Pos;
h.stopAllActions();
h.setPosition(cc.v2(y.x, y.y + 25));
h.runAction(cc.sequence(cc.moveTo(.1, cc.v2(y)), cc.moveTo(.1, cc.v2(h.Init_Pos)), cc.callFunc(function() {
cc.find("Node_Win/Lab_Gold", o).active = !0;
})));
}
this.AddSpineEvent(cc.find("Node_Win/Sp", o), function() {
cc.find("Node_Win/Sp", o).active = !1;
});
cc.find("Node_Win/Sp", o).active = !0;
cc.find("Node_Win/Sp", o).getComponent(sp.Skeleton).setAnimation(0, "animation", !1);
cc.find("Node_Win", o).runAction(cc.sequence(cc.delayTime(3), cc.callFunc(function() {
cc.find("Node_Win", o).active = !1;
})));
}
} else console.error("数据异常 请检查!");
};
a.prototype.Set_SelfCardTypeShow = function(e) {
cc.find("Node_UI/Img_SelfCardType", this.node).active = !1;
if (e && 3 == e.length) {
e.sort(function(e, a) {
return e - a;
});
for (var a = {}, t = {}, o = 0, n = e; o < n.length; o++) {
var i = n[o], c = i % 100, d = Math.floor(i / 100);
a[c] = a[c] ? a[c] + 1 : 1;
t[d] = t[d] ? t[d] + 1 : 1;
}
var r = Math.floor(e[0] / 100) + 1 == Math.floor(e[1] / 100) && Math.floor(e[1] / 100) + 1 == Math.floor(e[2] / 100), s = 1 == Object.keys(a).length, l = 1 == Object.keys(t).length, _ = 2 == Object.keys(t).length;
cc.find("Node_UI/Img_SelfCardType", this.node).active = !0;
s ? cc.find("Node_UI/Img_SelfCardType/Node_Info", this.node).getComponent(cc.Label).string = r ? "同花顺" : "同花" : t[2] && t[3] && t[5] ? cc.find("Node_UI/Img_SelfCardType/Node_Info", this.node).getComponent(cc.Label).string = "235" : cc.find("Node_UI/Img_SelfCardType/Node_Info", this.node).getComponent(cc.Label).string = l ? "三条" : _ ? "对子" : r ? "顺子" : "高牌";
}
};
a.prototype.Set_CardValue = function(e, a) {
for (var t = a % 100, o = Math.floor(a / 100), n = {
1: {
D: "plist_puke_color_big_3",
X: "plist_puke_color_small_3"
},
2: {
D: "plist_puke_color_big_2",
X: "plist_puke_color_small_2"
},
3: {
D: "plist_puke_color_big_1",
X: "plist_puke_color_small_1"
},
4: {
D: "plist_puke_color_big_0",
X: "plist_puke_color_small_0"
}
}, i = {}, c = 1; c <= 13; c++) i[c] = {
1: "plist_puke_value_1_" + c,
2: "plist_puke_value_0_" + c,
3: "plist_puke_value_1_" + c,
4: "plist_puke_value_0_" + c
};
i[14] = {
1: "plist_puke_value_1_1",
2: "plist_puke_value_0_1",
3: "plist_puke_value_1_1",
4: "plist_puke_value_0_1"
};
cc.find("Num", e).getComponent(cc.Sprite).spriteFrame = this.CardAtlas.getSpriteFrame(i[o][t]);
cc.find("Type/Img_Big", e).getComponent(cc.Sprite).spriteFrame = this.CardAtlas.getSpriteFrame(n[t].D);
cc.find("Type/Img_Small", e).getComponent(cc.Sprite).spriteFrame = this.CardAtlas.getSpriteFrame(n[t].X);
};
a.prototype.Open_VSCardView = function() {
var e = this.DataMgr.PlayerDatas[this.DataMgr.GameData.SelfUserID];
if (e.IsGame && !e.IsDiuQiCard) {
for (var a = 0, t = cc.find("Node_UI/Node_Players", this.node).children; a < t.length; a++) {
var o = t[a];
cc.find("Node_Vs", o) && (cc.find("Node_Vs", o).active = !1);
}
for (var n in this.DataMgr.PlayerDatas) if (this.DataMgr.PlayerDatas.hasOwnProperty(n) && this.DataMgr.GameData.SelfUserID != +n) {
var i = this.DataMgr.PlayerDatas[n];
if (i.IsGame && !i.IsDiuQiCard) {
this.IsVsCard = !0;
cc.find("Node_UI/Node_Players/" + i.LocalSeat + "/Node_Vs", this.node).active = !0;
}
}
this.IsVsCard ? cc.find("Node_UI/Img_IsVSCard", this.node).active = !0 : cc.find("Node_UI/Img_IsVSCard", this.node).active = !1;
}
};
a.prototype.Close_VSCardView = function() {
for (var e = 0, a = cc.find("Node_UI/Node_Players", this.node).children; e < a.length; e++) {
var t = a[e];
cc.find("Node_Vs", t) && (cc.find("Node_Vs", t).active = !1);
}
cc.find("Node_UI/Img_IsVSCard", this.node).active = !1;
this.IsVsCard = !1;
};
a.prototype.AddSpineEvent = function(e, a) {
cc.isValid(e) && e.getComponent(sp.Skeleton).setCompleteListener(function(t) {
var o = t.animation ? t.animation.name : "";
a(e, o);
});
};
a.prototype.AddNodeClick = function(e, a, t) {
var o = e.active;
e.active = !1;
if (t) for (var n = function(o) {
switch (t[o]) {
case cc.Node.EventType.TOUCH_START:
case cc.Node.EventType.TOUCH_MOVE:
case cc.Node.EventType.TOUCH_END:
case cc.Node.EventType.TOUCH_CANCEL:
e.on("" + t[o], function(e) {
a(e, t[o]);
});
}
}, i = 0, c = t.length; i < c; i++) n(i); else {
e.on(cc.Node.EventType.TOUCH_START, function(e) {
a(e, cc.Node.EventType.TOUCH_START);
});
e.on(cc.Node.EventType.TOUCH_MOVE, function(e) {
a(e, cc.Node.EventType.TOUCH_MOVE);
});
e.on(cc.Node.EventType.TOUCH_END, function(e) {
a(e, cc.Node.EventType.TOUCH_END);
});
e.on(cc.Node.EventType.TOUCH_CANCEL, function(e) {
a(e, cc.Node.EventType.TOUCH_CANCEL);
});
}
e.active = o;
};
__decorate([ i({
type: cc.SpriteAtlas,
displayName: "牌图片图集",
tooltip: "牌图片图集"
}) ], a.prototype, "CardAtlas", void 0);
__decorate([ i({
type: cc.AnimationClip,
displayName: "倒计时动画",
tooltip: "倒计时动画"
}) ], a.prototype, "AnimationClip", void 0);
return __decorate([ n ], a);
}(cc.Component);
t.default = c;
cc._RF.pop();
}, {} ]
}, {}, [ "ZJH_Controlle", "ZJH_DataMgr", "ZJH_DownTimeAction", "ZJH_Load", "ZJH_Room", "ZJH_Setting", "ZJH_View" ]);