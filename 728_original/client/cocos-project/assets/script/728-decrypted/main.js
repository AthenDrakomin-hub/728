window.__require = function e(t, o, n) {
function i(s, c) {
if (!o[s]) {
if (!t[s]) {
var r = s.split("/");
r = r[r.length - 1];
if (!t[r]) {
var l = "function" == typeof __require && __require;
if (!c && l) return l(r, !0);
if (a) return a(r, !0);
throw new Error("Cannot find module '" + s + "'");
}
s = r;
}
var p = o[s] = {
exports: {}
};
t[s][0].call(p.exports, function(e) {
return i(t[s][1][e] || e);
}, p, p.exports, e, t, o, n);
}
return o[s].exports;
}
for (var a = "function" == typeof __require && __require, s = 0; s < n.length; s++) i(n[s]);
return i;
}({
APlayerInfo: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "6df198NACNKFaa+FWOrgMdL", "APlayerInfo");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Constant"), a = cc._decorator, s = a.ccclass, c = a.property, r = {
"-1": "控",
0: "正常",
1: "放"
}, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.top = null;
t.kongzhi = null;
t.info = null;
t.time = null;
t.c_editbox = null;
t.g_editbox = null;
t.loginStatus = 1;
t.uid = null;
t.control = 0;
t.controlGold = 0;
return t;
}
t.prototype.onLoad = function() {
wGEvent.on("Msg_Hall_BanUser", this.Msg_Hall_BanUser, this);
wGEvent.on("Msg_Hall_ControlLevel", this.Msg_Hall_ControlLevel, this);
this.initDW();
};
t.prototype.Msg_Hall_ControlLevel = function(e) {
1 == e.status && this.initKongzhi();
};
t.prototype.Msg_Hall_BanUser = function(e) {
if (1 == e.status) {
var t = e.data.status;
this.info.getChildByName("s").getComponent(cc.Label).string = 1 == t ? "未封禁" : "已封禁";
this.loginStatus = t;
}
};
t.prototype.init = function(e) {
if ("cjbySx" != wGameData.getCJBY() || "jhlmTest" == i.Constant.serverType) {
this.uid = e.uid;
this.top.getChildByName("name").getComponent(cc.Label).string = "昵称： " + e.nickname;
this.top.getChildByName("uid").getComponent(cc.Label).string = "ID： " + e.uid;
this.top.getChildByName("gold").getComponent(cc.Label).string = "" + wUtils.goldFormat(e.gold);
this.top.getChildByName("bank").getComponent(cc.Label).string = "" + wUtils.goldFormat(e.bank);
this.top.getChildByName("dhk").getComponent(cc.Label).string = "" + wUtils.numConvert(e.rcard);
wUIHelp.setHead(cc.find("head/h", this.top), e.headimgurl);
wUIHelp.setHeadFrame(cc.find("head/k", this.top), e.pictureframe);
this.info.getChildByName("YK").active = e.monthlyend;
e.monthlyend && (cc.find("YK/time", this.info).getComponent(cc.Label).string = e.monthlyend);
this.info.getChildByName("s").getComponent(cc.Label).string = 1 == e.status ? "未封禁" : "已封禁";
this.loginStatus = e.status;
this.info.getChildByName("r").getComponent(cc.Label).string = "" + wUtils.goldFormat(e.income);
this.info.getChildByName("c").getComponent(cc.Label).string = "" + wUtils.goldFormat(e.expenditure);
this.time.getChildByName("ct").getComponent(cc.Label).string = "创建日期:" + e.created;
this.time.getChildByName("zt").getComponent(cc.Label).string = "最后登录时间:" + e.last_time;
this.control = e.control;
this.controlGold = e.flagget || 0;
this.initKongzhi();
} else this.node.destroy();
};
t.prototype.initKongzhi = function() {
this.kongzhi.getChildByName("s").getComponent(cc.Label).string = r[this.control];
this.kongzhi.getChildByName("gold").getComponent(cc.Label).string = wUtils.goldFormat(this.controlGold);
this.g_editbox.string = "";
this.c_editbox.string = "";
};
t.prototype.initDW = function() {
var e = wGameData.getKey("power");
if (0 != e) {
var t = this.main.getChildByName("content").getChildByName("Layout");
wUIHelp.hideSonNode(t);
for (var o = 2 == e ? 3 : 2, n = {
0: -1,
1: 0,
2: 1
}, i = 0; i < o; i++) {
var a = t.children[i], s = n[i];
a.children[0].getComponent(cc.Label).string = r[s];
a.active = !0;
a.DW = s;
}
} else {
this.kongzhi.active = !1;
this.kongzhi.parent.getComponent(cc.Layout).paddingTop = -118;
}
};
t.prototype.onClick = function(e, t) {
var o = this;
wAudioMgr.playBtnSound();
switch (t) {
case "fh":
var n = 1 == this.loginStatus ? "确定将该玩家封禁?" : "确定将该玩家解除封禁?";
wUIManager.showConfirmUI({
content: n,
okCB: function() {
wNetWork.send("Msg_Hall_BanUser", {
uid: o.uid,
status: Number(!o.loginStatus)
}, !0);
}
});
break;

case "kz":
if (!this.c_editbox.string) {
wUIManager.showTips("请选择控制挡位！", wUIManager.TIPS_OK);
return;
}
if (!this.g_editbox.string) {
wUIManager.showTips("请输入需要控制的金币数！", wUIManager.TIPS_OK);
return;
}
wUIManager.showConfirmUI({
content: "确定控制该玩家？",
okCB: function() {
o.controlGold = Number(o.g_editbox.string);
wNetWork.send("Msg_Hall_ControlLevel", {
uid: o.uid,
level: o.control,
flagget: o.controlGold
}, !0);
}
});
break;

case "setdw":
this.main.getChildByName("content").active = !0;
break;

case "closeDW":
this.main.getChildByName("content").active = !1;
break;

default:
this.control = e.target.DW;
this.c_editbox.string = r[this.control];
this.main.getChildByName("content").active = !1;
}
};
__decorate([ c(cc.Node) ], t.prototype, "top", void 0);
__decorate([ c(cc.Node) ], t.prototype, "kongzhi", void 0);
__decorate([ c(cc.Node) ], t.prototype, "info", void 0);
__decorate([ c(cc.Node) ], t.prototype, "time", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "c_editbox", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "g_editbox", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = l;
cc._RF.pop();
}, {
Constant: "Constant",
PopupBase: "PopupBase"
} ],
A_GameRecord: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "3b68fqq+sNLiKfyg6G7eno5", "A_GameRecord");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Config"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.pageNum = null;
t.uidEditbox = null;
t.content = null;
t.view = null;
t.btn_s = null;
t.btn_x = null;
t.page = 1;
t.totalpage = 1;
return t;
}
t.prototype.onLoad = function() {
wGEvent.on("Msg_Hall_GameRecord", this.Msg_Hall_GameRecord, this);
this.node.on("toggle", function() {
wAudioMgr.playBtnSound();
}, this);
};
t.prototype.Msg_Hall_GameRecord = function(e) {
if (1 == e.status) {
this.page = e.data.page;
this.totalpage = e.data.totalpage;
this.initList(e.data.list);
this.initPageNum();
}
};
t.prototype.initList = function(e) {
wUIHelp.hideSonNode(this.content);
for (var t = 0; t < e.length; t++) {
var o = e[t], i = this.content.children[t];
i || ((i = cc.instantiate(this.content.children[0])).parent = this.content);
i.getChildByName("gameName").getComponent(cc.Label).string = n.Config.GamePrefab[o.gtype].zhName;
i.getChildByName("jtime").getComponent(cc.Label).string = o.begintime;
i.getChildByName("ctime").getComponent(cc.Label).string = o.endtime;
i.getChildByName("jgold").getComponent(cc.Label).string = wUtils.numConvert(o.begingold);
i.getChildByName("cgold").getComponent(cc.Label).string = wUtils.numConvert(o.endgold);
var a = o.endgold - o.begingold;
i.getChildByName("win").color = a >= 0 ? cc.color(0, 255, 24) : cc.color(255, 0, 0);
i.getChildByName("win").getComponent(cc.Label).string = (a >= 0 ? "+" : "-") + wUtils.numConvert(Math.abs(a));
i.active = !0;
}
this.view.scrollToTop();
this.view.node.getChildByName("no").active = !e || e.length <= 0;
};
t.prototype.initPageNum = function() {
this.pageNum.string = this.page + "  / " + this.totalpage;
this.btn_s.interactable = this.page > 1;
this.btn_x.interactable = this.totalpage > this.page;
};
t.prototype.sendMsg = function() {
wNetWork.send("Msg_Hall_GameRecord", {
uid: this.zsUid,
page: this.page
}, !0);
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "s":
this.page--;
this.sendMsg();
break;

case "x":
this.page++;
this.sendMsg();
break;

case "sx":
case "cx":
if (!this.uidEditbox.string) {
wUIManager.showTips("请输入玩家ID！", wUIManager.TIPS_OK);
return;
}
this.zsUid = Number(this.uidEditbox.string);
this.page = 1;
this.totalpage = 1;
this.sendMsg();
}
};
__decorate([ s(cc.Label) ], t.prototype, "pageNum", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "uidEditbox", void 0);
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
__decorate([ s(cc.ScrollView) ], t.prototype, "view", void 0);
__decorate([ s(cc.Button) ], t.prototype, "btn_s", void 0);
__decorate([ s(cc.Button) ], t.prototype, "btn_x", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {
Config: "Config"
} ],
A_Give: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "68405AZqbFCepQuO2+olVqq", "A_Give");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Config"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.myDhkNum = null;
t.myYkNum = null;
t.dhkNum = null;
t.ykNum = null;
t.dukUidEditbox = null;
t.ykUidEditbox = null;
t.dhkZsNum = 0;
t.ykZsNum = 0;
return t;
}
t.prototype.onLoad = function() {
var e = this;
this.node.on("toggle", function() {
wAudioMgr.playBtnSound();
}, this);
wGEvent.on("local_Event", function(t) {
switch (t) {
case "up_Mcard":
e.myYkNum.string = wGameData.getKey("mcard");
break;

case "up_Excard":
e.myDhkNum.string = wGameData.getKey("rcard");
}
}, this);
this.initData();
};
t.prototype.initData = function() {
this.myDhkNum.string = wGameData.getKey("rcard");
this.myYkNum.string = wGameData.getKey("mcard");
};
t.prototype.sendDHKMsg = function() {
var e = this;
this.dhkZsNum ? this.dhkZsNum > wGameData.getKey("rcard") ? wUIManager.showTips("兑换卡不足!", wUIManager.TIPS_OK) : wUIManager.showConfirmUI({
content: "确定给该玩家赠送【" + this.dhkZsNum + "】张兑换卡？",
okCB: function() {
return __awaiter(e, void 0, void 0, function() {
return __generator(this, function(t) {
switch (t.label) {
case 0:
return [ 4, (o = this.dhkZsNum, new Promise(function(t) {
var n = wGEvent.on("Msg_Hall_BankTransfer", function(e) {
wGEvent.off(n);
1 == e.status ? t(!0) : t(!1);
}, e);
wNetWork.send("Msg_Hall_BankTransfer", {
touid: Number(e.dukUidEditbox.string),
type: 2,
num: o
});
})) ];

case 1:
if (t.sent()) {
wUIManager.showTips("兑换卡赠送成功!", wUIManager.TIPS_OK);
wGameData.setKey("rcard", wGameData.getKey("rcard") - this.dhkZsNum);
this.dhkZsNum = 0;
this.dhkNum.string = "" + this.dhkZsNum;
}
return [ 2 ];
}
var o;
});
});
}
}) : wUIManager.showTips("请输入正确的赠送数量!", wUIManager.TIPS_OK);
};
t.prototype.sendYKMsg = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t = this;
return __generator(this, function() {
if (!this.ykZsNum) {
wUIManager.showTips("请输入正确的赠送数量!", wUIManager.TIPS_OK);
return [ 2 ];
}
e = function(e, o) {
return new Promise(function(n) {
var i = wGEvent.on("Msg_Hall_BankTransfer", function(e) {
wGEvent.off(i);
1 == e.status ? n(!0) : n(!1);
}, t);
wNetWork.send("Msg_Hall_BankTransfer", {
touid: Number(t.ykUidEditbox.string),
type: e,
num: o
});
});
};
if (this.ykZsNum) if (this.ykZsNum > wGameData.getKey("mcard")) wUIManager.showTips("月卡不足!", wUIManager.TIPS_OK); else {
if (this.ykUidEditbox.string.length >= 8 && this.ykZsNum > 1) {
wUIManager.showTips("一次只能赠送一张月卡哟!", wUIManager.TIPS_OK);
return [ 2 ];
}
wUIManager.showConfirmUI({
content: "确定给该玩家赠送【" + this.ykZsNum + "】张月卡？",
okCB: function() {
return __awaiter(t, void 0, void 0, function() {
return __generator(this, function(t) {
switch (t.label) {
case 0:
return [ 4, e(3, this.ykZsNum) ];

case 1:
if (t.sent()) {
wUIManager.showTips("月卡赠送成功!", wUIManager.TIPS_OK);
wGameData.setKey("mcard", wGameData.getKey("mcard") - this.ykZsNum);
this.ykZsNum = 0;
this.ykNum.string = "" + this.ykZsNum;
}
return [ 2 ];
}
});
});
}
});
}
return [ 2 ];
});
});
};
t.prototype.onEditbox = function(e) {
this.dhkZsNum = Number(e.string);
!this.dhkZsNum && (this.dhkZsNum = 0);
this.dhkNum.string = "" + this.dhkZsNum;
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "bank":
wGameData.bankPow == wGameData.getKey("bankpass") ? wViewMgr.openPage({
path: n.Config.ViewConfig.Bank,
isDestroy: !0
}) : wViewMgr.openPage({
path: n.Config.ViewConfig.BankCheck
});
break;

case "ykzs":
this.sendYKMsg();
break;

case "dhkzs":
this.sendDHKMsg();
break;

case "dhkadd":
this.dhkZsNum++;
this.dhkNum.string = "" + this.dhkZsNum;
break;

case "dhksub":
this.dhkZsNum--;
this.dhkZsNum < 0 && (this.dhkZsNum = 0);
this.dhkNum.string = "" + this.dhkZsNum;
break;

case "ykadd":
this.ykZsNum++;
this.ykNum.string = "" + this.ykZsNum;
break;

case "yksub":
this.ykZsNum--;
this.ykZsNum < 0 && (this.ykZsNum = 0);
this.ykNum.string = "" + this.ykZsNum;
}
};
__decorate([ s(cc.Label) ], t.prototype, "myDhkNum", void 0);
__decorate([ s(cc.Label) ], t.prototype, "myYkNum", void 0);
__decorate([ s(cc.Label) ], t.prototype, "dhkNum", void 0);
__decorate([ s(cc.Label) ], t.prototype, "ykNum", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "dukUidEditbox", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "ykUidEditbox", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {
Config: "Config"
} ],
A_MyAgent: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "02b0d3fEPpFooBBzy2xFVnq", "A_MyAgent");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("SDKManager"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = {
"-1": "控",
0: "正常",
1: "放"
}, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.playerNum1 = null;
t.playerNum2 = null;
t.pageNum = null;
t.uidEditbox = null;
t.content = null;
t.view = null;
t.btn_s = null;
t.btn_x = null;
t.type = 1;
t.upPage = 1;
t.lowerPage = 1;
t.evevt = null;
return t;
}
t.prototype.start = function() {
var e = this;
wGEvent.on("Msg_Hall_QueryAgentList", this.Msg_Hall_QueryAgentList, this);
var t = !0;
this.node.on("toggle", function() {
wAudioMgr.playBtnSound();
if (t) {
t = !1;
e.sendMsg(e.type, 1);
}
}, this);
};
t.prototype.onEnable = function() {
this.evevt = wGEvent.on("Msg_Hall_QueryUserInfo", this.Msg_Hall_QueryUserInfo, this);
};
t.prototype.onDisable = function() {
wGEvent.off(this.evevt);
};
t.prototype.Msg_Hall_QueryUserInfo = function(e) {
1 == e.status && this.node.getComponent(cc.Toggle).isChecked && wViewMgr.openPage({
path: i.Config.ViewConfig.APlayerInfo,
data: e.data
});
};
t.prototype.sendMsg = function(e, t) {
wNetWork.send("Msg_Hall_QueryAgentList", {
type: e,
page: t
}, !0);
};
t.prototype.Msg_Hall_QueryAgentList = function(e) {
if (1 == e.status) {
var t = e.data.list;
this.initPlayerNum(e.data.online, e.data.totalnum);
this.upPage = e.data.page;
this.lowerPage = e.data.totalpage;
this.initList(t);
this.initPageNum();
}
};
t.prototype.initList = function(e) {
wUIHelp.hideSonNode(this.content);
for (var t = function(t) {
var i = e[t], a = o.content.children[t];
a || ((a = cc.instantiate(o.content.children[0])).parent = o.content);
a.getChildByName("uid").getComponent(cc.Label).string = "ID:" + i.uid;
var s = a.getChildByName("uid").children[0];
s.off("click");
s.on("click", function() {
n.wSDK.copyToClipboard(i.uid);
}, o);
a.getChildByName("name").getComponent(cc.Label).string = "昵称:" + i.nickname;
a.getChildByName("rgold").getComponent(cc.Label).string = wUtils.goldFormat(i.income);
a.getChildByName("cgold").getComponent(cc.Label).string = wUtils.goldFormat(i.expenditure);
a.getChildByName("s").getComponent(cc.Label).string = wGameData.getKey("power") ? r[i.control] : "正常";
a.getChildByName("pos").getComponent(cc.Label).string = 1 == o.type ? "在线" : "离线";
a.active = !0;
a.UID = i.uid;
}, o = this, i = 0; i < e.length; i++) t(i);
this.view.scrollToTop();
this.view.node.getChildByName("no").active = e.length <= 0;
};
t.prototype.initPageNum = function() {
this.pageNum.string = this.upPage + "  / " + this.lowerPage;
this.btn_s.interactable = this.upPage > 1;
this.btn_x.interactable = this.lowerPage > this.upPage;
};
t.prototype.initPlayerNum = function(e, t) {
this.playerNum1.string = "" + e;
this.playerNum2.string = "" + t;
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "sx":
this.sendMsg(this.type, 1);
break;

case "cx":
if (!this.uidEditbox.string || this.uidEditbox.string.length >= 8) {
wUIManager.showTips("请输入正确的玩家ID！");
return;
}
wNetWork.send("Msg_Hall_QueryUserInfo", {
uid: Number(this.uidEditbox.string)
}, !0);
break;

case "ck":
wNetWork.send("Msg_Hall_QueryUserInfo", {
uid: e.target.parent.UID
}, !0);
break;

case "s":
this.sendMsg(this.type, this.upPage - 1);
break;

case "x":
this.sendMsg(this.type, this.upPage + 1);
break;

default:
var o = Number(t);
if (o == this.type) return;
this.type = o;
this.sendMsg(this.type, 1);
}
};
__decorate([ c(cc.Label) ], t.prototype, "playerNum1", void 0);
__decorate([ c(cc.Label) ], t.prototype, "playerNum2", void 0);
__decorate([ c(cc.Label) ], t.prototype, "pageNum", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "uidEditbox", void 0);
__decorate([ c(cc.Node) ], t.prototype, "content", void 0);
__decorate([ c(cc.ScrollView) ], t.prototype, "view", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btn_s", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btn_x", void 0);
return __decorate([ s ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {
Config: "Config",
SDKManager: "SDKManager"
} ],
A_MyInfo: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "f6931gX+LhBaYQ3msMbMaTI", "A_MyInfo");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Config"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.labelParent = null;
t.content = null;
t.getextension = 0;
return t;
}
t.prototype.onLoad = function() {
this.init();
this.sendMsg();
};
t.prototype.sendMsg = function() {
wNetWork.send("Msg_Hall_Agent", [], !0);
};
t.prototype.init = function() {
var e = this;
wGEvent.on("Msg_Hall_Agent", this.Msg_Hall_Agent, this);
wGEvent.on("Msg_Hall_PromotionFundList", this.Msg_Hall_PromotionFundList, this);
wGEvent.on("Msg_Hall_GetPromotionFund", this.Msg_Hall_GetPromotionFund, this);
wUIHelp.setHead(this.content.getChildByName("0"), wGameData.getKey("headimgurl"));
wUIHelp.setHeadFrame(this.content.getChildByName("headframe"), wGameData.getKey("pictureframe"));
this.labelParent.getChildByName("name").getComponent(cc.Label).string = wGameData.getKey("nickname");
this.labelParent.getChildByName("myuid").getComponent(cc.Label).string = wGameData.getKey("uid");
this.labelParent.getChildByName("rcard").getComponent(cc.Label).string = wGameData.getKey("rcard");
this.node.on("toggle", function() {
wAudioMgr.playBtnSound();
}, this);
wGEvent.on("local_Event", function(t) {
switch (t) {
case "up_Mcard":
e.labelParent.getChildByName("mcard").getComponent(cc.Label).string = wGameData.getKey("mcard");
break;

case "up_Excard":
e.labelParent.getChildByName("rcard").getComponent(cc.Label).string = wGameData.getKey("rcard");
}
}, this);
};
t.prototype.Msg_Hall_GetPromotionFund = function(e) {
if (1 == e.status) {
wUIManager.showTips("领取成功", wUIManager.TIPS_OK);
wGameData.setKey("bank", e.data.bank);
this.getextension = 0;
this.labelParent.getChildByName("getextension").getComponent(cc.Label).string = "0";
}
};
t.prototype.Msg_Hall_PromotionFundList = function(e) {
1 == e.status && wViewMgr.openPage({
path: n.Config.ViewConfig.AReceiveRecord,
data: e.data
});
};
t.prototype.Msg_Hall_Agent = function(e) {
if (1 == e.status) {
var t = e.data;
this.labelParent.getChildByName("superior").getComponent(cc.Label).string = t.superior;
this.labelParent.getChildByName("agentnum").getComponent(cc.Label).string = wUtils.numConvert(t.agentnum);
this.labelParent.getChildByName("playernum").getComponent(cc.Label).string = wUtils.numConvert(t.playernum);
this.labelParent.getChildByName("insertplayer").getComponent(cc.Label).string = wUtils.numConvert(t.insertplayer);
this.labelParent.getChildByName("income").getComponent(cc.Label).string = wUtils.goldFormat(t.income);
this.labelParent.getChildByName("expenditure").getComponent(cc.Label).string = wUtils.goldFormat(t.expenditure);
this.labelParent.getChildByName("getextension").getComponent(cc.Label).string = wUtils.numConvert(t.getextension);
this.labelParent.getChildByName("mcard").getComponent(cc.Label).string = wUtils.numConvert(t.mcard);
this.labelParent.getChildByName("use").getComponent(cc.Label).string = wUtils.numConvert(t.use);
this.labelParent.getChildByName("recv").getComponent(cc.Label).string = wUtils.numConvert(t.recv);
this.labelParent.getChildByName("rcard").getComponent(cc.Label).string = wUtils.numConvert(t.rcard);
wGameData.setKey("bank", t.bank);
wGameData.setKey("gold", t.gold);
wGameData.setKey("mcard", t.mcard);
wGameData.setKey("power", t.power);
this.getextension = t.getextension;
}
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "sx":
this.sendMsg();
break;

case "tq":
if (this.getextension <= 0) {
wUIManager.showTips("暂无推广金", wUIManager.TIPS_OK);
return;
}
wNetWork.send("Msg_Hall_GetPromotionFund", [], !0);
break;

case "tqjl":
wNetWork.send("Msg_Hall_PromotionFundList", [], !0);
}
};
__decorate([ s(cc.Node) ], t.prototype, "labelParent", void 0);
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {
Config: "Config"
} ],
A_MyPlayer: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "92776qCL4lBUZgaBt6Jj1yp", "A_MyPlayer");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("SDKManager"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = {
"-1": "控",
0: "正常",
1: "放"
}, l = {
1: "体验场",
2: "初级场",
3: "中级场",
4: "高级场",
5: "大师场",
6: "游戏中"
}, p = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.playerNum1 = null;
t.playerNum2 = null;
t.pageNum = null;
t.uidEditbox = null;
t.content = null;
t.view = null;
t.btn_s = null;
t.btn_x = null;
t.topImg = null;
t.top = null;
t.type = 1;
t.upPage = 1;
t.lowerPage = 1;
return t;
}
t.prototype.start = function() {
var e = this;
wGEvent.on("Msg_Hall_QueryUserList", this.Msg_Hall_QueryUserList, this);
var t = !0;
this.node.on("toggle", function() {
wAudioMgr.playBtnSound();
if (t) {
t = !1;
e.sendMsg(e.type, 1);
}
}, this);
"cjbySx" == wGameData.getCJBY() && (this.top.spriteFrame = this.topImg);
};
t.prototype.onEnable = function() {
this.evevt = wGEvent.on("Msg_Hall_QueryUserInfo", this.Msg_Hall_QueryUserInfo, this);
};
t.prototype.onDisable = function() {
wGEvent.off(this.evevt);
};
t.prototype.Msg_Hall_QueryUserInfo = function(e) {
1 == e.status && this.node.getComponent(cc.Toggle).isChecked && wViewMgr.openPage({
path: i.Config.ViewConfig.APlayerInfo,
data: e.data
});
};
t.prototype.sendMsg = function(e, t) {
wNetWork.send("Msg_Hall_QueryUserList", {
type: e,
page: t
}, !0);
};
t.prototype.Msg_Hall_QueryUserList = function(e) {
if (1 == e.status) {
var t = e.data.list;
this.initPlayerNum(e.data.online, e.data.totalnum);
this.upPage = e.data.page;
this.lowerPage = e.data.totalpage;
this.initList(t);
this.initPageNum();
}
};
t.prototype.initList = function(e) {
var t = wGameData.getCJBY();
wUIHelp.hideSonNode(this.content);
for (var o = function(o) {
var s = e[o], c = a.content.children[o];
c || ((c = cc.instantiate(a.content.children[0])).parent = a.content);
c.getChildByName("uid").getComponent(cc.Label).string = "ID:" + s.uid;
var p = c.getChildByName("uid").children[0];
p.off("click");
p.on("click", function() {
n.wSDK.copyToClipboard(s.uid);
}, a);
c.getChildByName("name").getComponent(cc.Label).string = "昵称:" + s.nickname;
if ("cjbySx" == t) {
c.getChildByName("rgold").getComponent(cc.Label).string = wUtils.goldFormat(s.income);
c.getChildByName("cgold").getComponent(cc.Label).string = wUtils.goldFormat(s.expenditure);
} else {
c.getChildByName("rgold").getComponent(cc.Label).string = wUtils.goldFormat(s.gold);
c.getChildByName("cgold").getComponent(cc.Label).string = wUtils.goldFormat(s.bank);
}
c.getChildByName("s").getComponent(cc.Label).string = wGameData.getKey("power") ? r[s.control] : "正常";
if (1 == a.type) if (0 == s.status.gtype) c.getChildByName("pos").getComponent(cc.Label).string = "大厅"; else {
var u = i.Config.GamePrefab[s.status.gtype], d = u.zhName + "   ";
u.type != i.Config.RoomType.ARCADE && u.type != i.Config.RoomType.FISHING || "26" == s.status.gtyp || (d = u.zhName + "   " + l[s.status.level]);
c.getChildByName("pos").getComponent(cc.Label).string = d;
} else c.getChildByName("pos").getComponent(cc.Label).string = "离线";
c.active = !0;
c.UID = s.uid;
}, a = this, s = 0; s < e.length; s++) o(s);
this.view.scrollToTop();
this.view.node.getChildByName("no").active = e.length <= 0;
};
t.prototype.initPageNum = function() {
this.pageNum.string = this.upPage + "  / " + this.lowerPage;
this.btn_s.interactable = this.upPage > 1;
this.btn_x.interactable = this.lowerPage > this.upPage;
};
t.prototype.initPlayerNum = function(e, t) {
this.playerNum1.string = "" + e;
this.playerNum2.string = "" + t;
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "sx":
this.sendMsg(this.type, 1);
break;

case "cx":
if (!this.uidEditbox.string || this.uidEditbox.string.length < 4) {
wUIManager.showTips("请输入正确的玩家ID！");
return;
}
wNetWork.send("Msg_Hall_QueryUserInfo", {
uid: Number(this.uidEditbox.string)
}, !0);
break;

case "ck":
wNetWork.send("Msg_Hall_QueryUserInfo", {
uid: e.target.parent.UID
}, !0);
break;

case "s":
this.sendMsg(this.type, this.upPage - 1);
break;

case "x":
this.sendMsg(this.type, this.upPage + 1);
break;

default:
var o = Number(t);
if (o == this.type) return;
this.type = o;
this.sendMsg(this.type, 1);
}
};
__decorate([ c(cc.Label) ], t.prototype, "playerNum1", void 0);
__decorate([ c(cc.Label) ], t.prototype, "playerNum2", void 0);
__decorate([ c(cc.Label) ], t.prototype, "pageNum", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "uidEditbox", void 0);
__decorate([ c(cc.Node) ], t.prototype, "content", void 0);
__decorate([ c(cc.ScrollView) ], t.prototype, "view", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btn_s", void 0);
__decorate([ c(cc.Button) ], t.prototype, "btn_x", void 0);
__decorate([ c(cc.SpriteFrame) ], t.prototype, "topImg", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "top", void 0);
return __decorate([ s ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
}, {
Config: "Config",
SDKManager: "SDKManager"
} ],
A_ReceiveRecord: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "58644306UVIcrRptrBpgmIV", "A_ReceiveRecord");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.contnet = null;
return t;
}
t.prototype.init = function(e) {
this.main.getChildByName("no").active = e.length <= 0;
for (var t = 0; t < e.length; t++) {
var o = e[t], n = this.contnet.children[t];
n || ((n = cc.instantiate(this.contnet.children[0])).parent = this.contnet);
n.getChildByName("time").getComponent(cc.Label).string = o.createtime;
n.getChildByName("gold").getComponent(cc.Label).string = wUtils.numConvert(o.getextension);
n.active = !0;
}
};
__decorate([ s(cc.Node) ], t.prototype, "contnet", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
A_TradeRecord: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "af446RW8GJHypyY9hlpDx2N", "A_TradeRecord");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.pageNum = null;
t.uidEditbox = null;
t.content = null;
t.view = null;
t.btn_s = null;
t.btn_x = null;
t.agent = 0;
t.agentList = {
3: !0,
4: !0
};
t.type = 1;
t.page = 1;
t.totalpage = 1;
t.zsUid = 0;
return t;
}
t.prototype.onLoad = function() {
var e = this;
wGEvent.on("Msg_Hall_GoldDetailed", this.Msg_Hall_GoldDetailed, this);
var t = !0;
this.node.on("toggle", function() {
wAudioMgr.playBtnSound();
if (t) {
t = !1;
e.sendMsg();
}
}, this);
};
t.prototype.sendMsg = function() {
wNetWork.send("Msg_Hall_GoldDetailed", {
uid: this.zsUid,
agent: this.agent,
type: this.type,
page: this.page
}, !0);
};
t.prototype.Msg_Hall_GoldDetailed = function(e) {
if (1 == e.status) {
this.page = e.data.page;
this.totalpage = e.data.totalpage;
this.initList(e.data.list);
this.initPageNum();
}
};
t.prototype.initList = function(e) {
wUIHelp.hideSonNode(this.content);
for (var t = 0; t < e.length; t++) {
var o = e[t], n = this.content.children[t];
n || ((n = cc.instantiate(this.content.children[0])).parent = this.content);
if (1 == this.type) {
n.getChildByName("id").getComponent(cc.Label).string = wGameData.getKey("uid");
n.getChildByName("name").getComponent(cc.Label).string = wGameData.getKey("nickname");
n.getChildByName("id1").getComponent(cc.Label).string = o.uid;
n.getChildByName("name1").getComponent(cc.Label).string = o.nickname;
} else {
n.getChildByName("id1").getComponent(cc.Label).string = wGameData.getKey("uid");
n.getChildByName("name1").getComponent(cc.Label).string = wGameData.getKey("nickname");
n.getChildByName("id").getComponent(cc.Label).string = o.uid;
n.getChildByName("name").getComponent(cc.Label).string = o.nickname;
}
n.getChildByName("time").getComponent(cc.Label).string = o.created;
n.getChildByName("gold").getComponent(cc.Label).string = wUtils.numConvert(o.number);
n.active = !0;
}
this.view.scrollToTop();
this.view.node.getChildByName("no").active = !e || e.length <= 0;
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "1":
case "2":
this.type = Number(t);
this.page = 1;
this.totalpage = 1;
this.sendMsg();
break;

case "3":
case "4":
this.agentList[e.node.name] = e.isChecked;
if (this.agentList[3] || this.agentList[4]) {
this.agentList[3] && this.agentList[4] ? this.agent = 0 : this.agentList[3] ? this.agent = 1 : this.agent = 2;
this.page = 1;
this.totalpage = 1;
this.sendMsg();
} else {
this.agentList[e.node.name] = !0;
e.check();
}
break;

case "s":
this.page--;
this.sendMsg();
break;

case "x":
this.page++;
this.sendMsg();
break;

case "sx":
this.page = 1;
this.totalpage = 1;
this.sendMsg();
break;

case "cx":
if (!this.uidEditbox.string) {
wUIManager.showTips("请输入玩家ID！", wUIManager.TIPS_OK);
return;
}
this.zsUid = Number(this.uidEditbox.string);
this.page = 1;
this.totalpage = 1;
this.sendMsg();
}
};
t.prototype.initPageNum = function() {
this.pageNum.string = this.page + "  / " + this.totalpage;
this.btn_s.interactable = this.page > 1;
this.btn_x.interactable = this.totalpage > this.page;
};
t.prototype.editboxEvevt = function(e) {
if (e.string.length < 6 && this.zsUid) {
this.zsUid = 0;
this.page = 1;
this.totalpage = 1;
this.sendMsg();
e.string = "";
}
};
__decorate([ a(cc.Label) ], t.prototype, "pageNum", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "uidEditbox", void 0);
__decorate([ a(cc.Node) ], t.prototype, "content", void 0);
__decorate([ a(cc.ScrollView) ], t.prototype, "view", void 0);
__decorate([ a(cc.Button) ], t.prototype, "btn_s", void 0);
__decorate([ a(cc.Button) ], t.prototype, "btn_x", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
AccountLogin: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e0dfedj0Y1KtZfa6tBTN8zx", "AccountLogin");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.acc = null;
t.pow = null;
t.typeLabel = null;
return t;
}
t.prototype.onShow = function() {
var e = wGameData.getLastLogin();
if (e && 11 == String(e.uid).length) {
this.acc.string = "" + e.uid;
this.pow.string = "" + e.password;
} else {
this.acc.placeholder = "手机号/账号";
this.pow.placeholder = "请输入密码";
}
};
t.prototype.onLoad = function() {
wGEvent.on("local_Event", this.local_Event, this);
var e = wConstant.platformType[wConstant.platform][0];
this.typeLabel.string = "《" + e + "服务协议》";
};
t.prototype.local_Event = function(e) {
switch (e) {
case i.Config.local_Event.login_Success:
this.hide(!1);
}
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "hb":
wViewMgr.openPage({
path: i.Config.ViewConfig.ChangeBindPhone
});
break;

case "wjpow":
wViewMgr.openPage({
path: "Prefab/ForgetPassword"
});
break;

case "acclogin":
this.accountLogin();
break;

case "zc":
wViewMgr.openPage({
path: "Prefab/Register"
});
}
};
t.prototype.accountLogin = function() {
var e = this.acc.string, t = this.pow.string;
if (e) if (t) if (wUtils.checkUser(e)) if (wUtils.checkPwd(t)) if (this.main.getChildByName("qr").getComponent(cc.Toggle).isChecked) {
var o = {
acc: e,
pwd: t
};
this.send_account_login(o);
} else wUIManager.showTips("需要同意《728游戏服务协议》才能进行下一步操作"); else wUIManager.showTips("请输入合法的密码"); else wUIManager.showTips("请输入合法的账号"); else wUIManager.showTips("请输入密码"); else wUIManager.showTips("请输入账号");
};
t.prototype.send_account_login = function(e) {
var t = this, o = {
uid: Number(e.acc),
password: e.pwd,
equipmentcard: wGameData.getAPPID(),
type: 1,
code: -1
};
wGameData.accLoginInfo = o;
wNetWork.HttpRequest("Msg_User_Login", o, !0).then(function(e) {
wGEvent.emit("local_Event", i.Config.local_Event.login_Success, e);
t.hide(!1);
}).catch(function() {});
};
__decorate([ c(cc.EditBox) ], t.prototype, "acc", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "pow", void 0);
__decorate([ c(cc.Label) ], t.prototype, "typeLabel", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase"
} ],
AdaptView: [ function(e, t) {
"use strict";
cc._RF.push(t, "f27484xFSZDh7iuSO2idoNn", "AdaptView");
var o = cc.Enum({
LEFT: 1,
RIGHT: 2,
TOP: 3,
DOWN: 4
});
cc.Class({
extends: cc.Component,
properties: {
type: {
default: o.LEFT,
type: o,
tooltip: "1.LEFT:靠左\n2.RIGHT：靠右\n3.TOP：靠上\n4.down：靠下"
},
spacingRight: {
default: 0,
type: cc.Integer,
tooltip: "本节点与父节点的距离",
visible: function() {
return this.type == o.RIGHT;
}
},
spacingLeft: {
default: 0,
type: cc.Integer,
tooltip: "本节点与父节点的距离",
visible: function() {
return this.type == o.LEFT;
}
},
spacing: {
default: 0,
type: cc.Integer,
tooltip: "本节点与父节点的距离",
visible: function() {
return this.type == o.TOP || this.type == o.DOWN;
}
}
},
onLoad: function() {
if (cc.winSize.width / cc.winSize.height > 2) {
var e = this.node.getComponent(cc.Widget);
e || (e = this.node.addComponent(cc.Widget));
this.type == o.LEFT ? e.left = this.spacingLeft : this.type == o.RIGHT && (e.right = this.spacingRight);
e.updateAlignment();
} else if (cc.winSize.height / cc.winSize.width < 2) {
var t = this.node.getComponent(cc.Widget);
t || (t = this.node.addComponent(cc.Widget));
this.type == o.TOP ? t.top = this.spacing : this.type == o.DOWN && (t.bottom = this.spacing);
t.updateAlignment();
}
}
});
cc._RF.pop();
}, {} ],
Agent: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "8540cSe1VlFcailtF+ibuLc", "Agent");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onClick = function() {
wUIManager.showConfirmUI({
content: "您确定退出当前账号返回登录界面吗？",
okCB: function() {
wNetWork.rejectReconnect();
wNetWork.close();
wViewMgr.openScene("Main");
}
});
};
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
AllAccount: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "7c0eaY+H99AhJEVRuEzBK49", "AllAccount");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.item = null;
t.content = null;
t.loginList = [];
return t;
}
t.prototype.onLoad = function() {
this.content.children[0].zIndex = 1e3;
this.loginList = wGameData.getAllAccInfo();
for (var e in this.loginList) Object.prototype.hasOwnProperty.call(this.loginList, e) && this.creatorItem(this.loginList[e]);
wGEvent.on("local_Event", this.local_Event, this);
};
t.prototype.local_Event = function(e) {
switch (e) {
case i.Config.local_Event.login_Success:
this.hide(!1);
}
};
t.prototype.creatorItem = function(e) {
var t = cc.instantiate(this.item);
t.parent = this.content;
var o = e.info;
wUIHelp.setHead(t.getChildByName("head"), o.headimgurl);
t.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(o.nickname, 10);
t.getChildByName("uid").getComponent(cc.Label).string = o.uid;
if (o.isbind) {
var n = o.isbind.slice(0, 3) + "*".repeat(6) + o.isbind.slice(-2);
t.getChildByName("phone").getComponent(cc.Label).string = n;
} else t.getChildByName("phone").getComponent(cc.Label).string = "【游客用户】";
t.data = e;
t.y = 0;
t.active = !0;
};
t.prototype.login = function(e) {
var t = this, o = e.accInfo;
wGameData.accLoginInfo = o;
wNetWork.HttpRequest("Msg_User_Login", o, !0).then(function(e) {
wGEvent.emit("local_Event", i.Config.local_Event.login_Success, e);
t.hide(!1);
}).catch(function(e) {
e && 2 == e.status && wViewMgr.openPage({
path: i.Config.ViewConfig.LoginCheck,
data: o
});
});
};
t.prototype.deleteLoginInfo = function(e) {
var t = e.info.uid, o = wGameData.getAllAccInfo();
delete o[t];
wGameData.setAllAccInfo(o);
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
var o = e.target.parent.data;
switch (t) {
case "register":
wViewMgr.openPage({
path: "Prefab/Register"
});
break;

case "login":
this.login(o);
break;

case "del":
this.deleteLoginInfo(o);
e.target.parent.destroy();
}
};
__decorate([ c(cc.Node) ], t.prototype, "item", void 0);
__decorate([ c(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase"
} ],
Animation: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "76c62s7vvlL2ZUJZnl4lG5X", "Animation");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc.Enum({
SCALE: 1,
IMGPLAY: 2,
OPACITY: 3,
ANGLE: 4
}), i = cc.Enum({
LOAD: 1,
ATLAS: 2,
MOUNT: 3
}), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.type = n.SCALE;
t.time = 1;
t.startOpacity = 255;
t.endOpacity = 150;
t.startScale = 1;
t.endScale = .9;
t.loadRes = i.LOAD;
t.loadPath = "";
t.resAtlas = null;
t.loadName = "";
t.startIdx = 0;
t.endIdx = 0;
t.spriteFrame = [];
t.isBool = !0;
t.wrapMode = cc.WrapMode.Loop;
t.startPlay = !0;
t.imgArr = null;
t.endCb = null;
return t;
}
t.prototype.onLoad = function() {
switch (this.type) {
case n.SCALE:
this.startData = this.node.scale;
break;

case n.OPACITY:
this.startData = this.node.opacity;
break;

case n.IMGPLAY:
this.startData = this.node.getComponent(cc.Sprite).spriteFrame;
this.initImg();
}
this.startPlay && this.play();
};
t.prototype.initImg = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t, o, n, a, s, c, r = this;
return __generator(this, function(l) {
switch (l.label) {
case 0:
this.imgArr = [];
if (this.loadRes != i.MOUNT) return [ 3, 1 ];
this.imgArr = this.spriteFrame;
return [ 3, 4 ];

case 1:
if (this.loadRes != i.ATLAS) return [ 3, 2 ];
if (this.loadName) for (a = this.startIdx; a <= this.endIdx; a++) {
s = a;
this.isBool && s < 10 && (s = "0" + s);
e = this.resAtlas.getSpriteFrame(this.loadName + s);
this.imgArr.push(e);
} else this.imgArr = Object.values(this.resAtlas._spriteFrames);
return [ 3, 4 ];

case 2:
t = function(e, t) {
return new Promise(function(o) {
wRes.loadRes(e, cc.SpriteFrame, function(e, n) {
r.imgArr[t] = n;
o(n);
});
});
};
o = [];
n = 0;
for (a = this.startIdx; a <= this.endIdx; a++) {
s = a;
this.isBool && s < 10 && (s = "0" + s);
c = this.loadPath + "/" + this.loadName + s;
o.push(t(c, n++));
}
return [ 4, Promise.all(o) ];

case 3:
l.sent();
l.label = 4;

case 4:
return [ 2 ];
}
});
});
};
t.prototype.runImg = function() {
var e = this.node.getComponent(cc.Animation);
if (!e) {
e = this.node.addComponent(cc.Animation);
var t = cc.AnimationClip.createWithSpriteFrames(this.imgArr, 10);
t.sample = 60;
t.speed = this.time;
t.name = "anim_run";
t.wrapMode = this.wrapMode;
e.addClip(t);
e.on("stop", this.endCall, this);
}
e.play("anim_run");
};
t.prototype.runScale = function() {
if (this.wrapMode == cc.WrapMode.Loop) {
var e = cc.scaleTo(this.time, this.startScale), t = cc.scaleTo(this.time, this.endScale), o = cc.repeatForever(cc.sequence(e, t));
this.node.runAction(o).setTag(100);
} else {
e = cc.scaleTo(this.time, this.startScale);
t = cc.scaleTo(this.time, this.endScale);
o = cc.sequence(e, t, cc.callFunc(this.endCall.bind(this)));
this.node.runAction(o).setTag(100);
}
};
t.prototype.endCall = function(e) {
if (this.endCb) switch (this.type) {
case n.SCALE:
this.endCb && this.endCb();
this.node.scale = this.startData;
break;

case n.IMGPLAY:
"stop" == e && this.endCb && this.endCb();
}
};
t.prototype.stop = function() {
switch (this.type) {
case n.SCALE:
this.node.stopActionByTag(100);
this.node.scale = this.startData;
break;

case n.OPACITY:
this.node.stopActionByTag(100);
this.node.opacity = this.startData;
break;

case n.ANGLE:
this.node.stopActionByTag(100);
break;

case n.IMGPLAY:
var e = this.node.getComponent(cc.Animation);
if (e) {
e.stop();
this.node.getComponent(cc.Sprite).spriteFrame = this.startData;
}
}
};
t.prototype.play = function(e) {
this.endCb = e;
switch (this.type) {
case n.SCALE:
this.runScale();
break;

case n.OPACITY:
this.runOpacity();
break;

case n.ANGLE:
this.runAngle();
break;

case n.IMGPLAY:
this.runImg();
}
};
t.prototype.runAngle = function() {
var e = cc.rotateBy(this.time, 360), t = cc.repeatForever(e);
this.node.runAction(t).setTag(100);
};
t.prototype.runOpacity = function() {
if (this.wrapMode == cc.WrapMode.Loop) {
var e = cc.fadeTo(this.time, this.startOpacity), t = cc.fadeTo(this.time, this.endOpacity), o = cc.repeatForever(cc.sequence(e, t));
this.node.runAction(o).setTag(100);
} else {
e = cc.fadeTo(this.time, this.startOpacity);
t = cc.fadeTo(this.time, this.endOpacity);
o = cc.sequence(e, t, cc.callFunc(this.endCall.bind(this)));
this.node.runAction(o).setTag(100);
}
};
__decorate([ c({
type: n,
tooltip: "1.SCALE:缩放动画\n2.IMGPLAY：图片轮播\n3.OPACITY：透明度\n4.ANGLE：旋转角度"
}) ], t.prototype, "type", void 0);
__decorate([ c({
tooltip: "动作运行的间隔时间"
}) ], t.prototype, "time", void 0);
__decorate([ c({
tooltip: "放大的倍数",
visible: function() {
return this.type == n.OPACITY;
}
}) ], t.prototype, "startOpacity", void 0);
__decorate([ c({
tooltip: "缩小的倍数",
visible: function() {
return this.type == n.OPACITY;
}
}) ], t.prototype, "endOpacity", void 0);
__decorate([ c({
tooltip: "放大的倍数",
visible: function() {
return this.type == n.SCALE;
}
}) ], t.prototype, "startScale", void 0);
__decorate([ c({
tooltip: "缩小的倍数",
visible: function() {
return this.type == n.SCALE;
}
}) ], t.prototype, "endScale", void 0);
__decorate([ c({
tooltip: "1.LOAD:动态加载\n2.ATLAS:图集加载\n3.MOUNT:资源挂载",
type: i,
visible: function() {
return this.type == n.IMGPLAY;
}
}) ], t.prototype, "loadRes", void 0);
__decorate([ c({
tooltip: "资源加载的路径",
visible: function() {
return this.type == n.IMGPLAY && this.loadRes == i.LOAD;
}
}) ], t.prototype, "loadPath", void 0);
__decorate([ c({
tooltip: "图集资源",
type: cc.SpriteAtlas,
visible: function() {
return this.type == n.IMGPLAY && this.loadRes == i.ATLAS;
}
}) ], t.prototype, "resAtlas", void 0);
__decorate([ c({
tooltip: "资源加载的名称",
visible: function() {
return this.type == n.IMGPLAY && (this.loadRes == i.LOAD || this.loadRes == i.ATLAS);
}
}) ], t.prototype, "loadName", void 0);
__decorate([ c({
tooltip: "资源加载的开始下标",
type: cc.Integer,
visible: function() {
return this.type == n.IMGPLAY && (this.loadRes == i.LOAD || this.loadRes == i.ATLAS);
}
}) ], t.prototype, "startIdx", void 0);
__decorate([ c({
tooltip: "资源加载的结束下标",
type: cc.Integer,
visible: function() {
return this.type == n.IMGPLAY && (this.loadRes == i.LOAD || this.loadRes == i.ATLAS);
}
}) ], t.prototype, "endIdx", void 0);
__decorate([ c({
tooltip: "直接挂载在节点上",
type: [ cc.SpriteFrame ],
visible: function() {
return this.type == n.IMGPLAY && this.loadRes == i.MOUNT;
}
}) ], t.prototype, "spriteFrame", void 0);
__decorate([ c({
tooltip: "小于二位数时是否前面补0",
visible: function() {
return this.type == n.IMGPLAY && (this.loadRes == i.ATLAS || this.loadRes == i.LOAD);
}
}) ], t.prototype, "isBool", void 0);
__decorate([ c({
tooltip: "动画使用的循环模式",
type: cc.WrapMode
}) ], t.prototype, "wrapMode", void 0);
__decorate([ c({
tooltip: "是否一开始就播放动画"
}) ], t.prototype, "startPlay", void 0);
return __decorate([ s ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {} ],
ArcadeBase: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "50a6ekImnlFUr2czAfzHu3j", "ArcadeBase");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("NetInterface"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.vg_socket = !0;
t.vg_sendData = null;
t.vg_isSend = 0;
t.vg_isInit = !1;
return t;
}
t.prototype.vg_setBankBtn = function(e) {
wGEvent.emit("local_Event", "setGameBankBtn", e);
};
t.prototype.vg_sendRollMsg = function(e) {
wConstant.arcadeSceneData = e;
if (this.vg_socket) {
this.vg_isSend = 1;
wNetWork.send("Msg_" + this.vg_game + "_Start", e);
} else {
this.vg_isSend = 2;
wLog.w("网络已断开，游戏消息发送失败");
}
this.vg_sendData = e;
};
t.prototype.vg_init = function() {
var e = this;
this.vg_game = wGameData.getGameName();
wGEvent.on("Msg_" + this.vg_game + "_Out", this.vg_msg_quitGame, this);
wGEvent.on("Msg_" + this.vg_game + "_Start", function(t) {
if (wConstant.isDebug) {
var o = cc.Canvas.instance.node.getChildByName("UIShow");
o && o.getChildByName("arcadeScene") || e.vg_rollMessage(t);
} else e.vg_rollMessage(t);
e.vg_isSend = 0;
e.vg_sendData = null;
}, this);
wGEvent.on("Msg_Hall_FinishLoad", this.Msg_Hall_FinishLoad, this);
wGEvent.on("Msg_" + this.vg_game + "_RoomInfo", function(t) {
wUIManager.hideLoadingUI();
if (1 == t.status) {
e.vg_roomInfo(t.data);
e.vg_isInit = !0;
2 == e.vg_isSend && e.vg_sendData && e.vg_sendRollMsg(e.vg_sendData);
} else {
wLog.e("获取游戏场景信息失败");
e.vg_msg_quitGame({
status: 1
});
}
}, this);
wGEvent.on("Msg_Hall_Connect", function(t) {
if (1 == t.status) {
if (wGameData.getKey("rid")) {
wUIManager.showLoadingUI();
if (1 == e.vg_isSend) {
e.vg_isInit = !1;
e.vg_isSend = 0;
}
e.scheduleOnce(function() {
wNetWork.send("Msg_Hall_FinishLoad", {
rid: wGameData.roomID
});
}, .1);
} else {
wUIManager.showTips("房间以解散", wUIManager.TIPS_OK);
e.vg_msg_quitGame({
status: 1
});
}
e.vg_socket = !0;
} else wLog.e("验证失败");
}, this);
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("local_SocketState", function(t) {
t != n.netWorkState.CLOSEDING && t != n.netWorkState.CLOSED || (e.vg_socket = !1);
e.vg_NetWorkState(t);
}, this);
wNetWork.send("Msg_Hall_FinishLoad", {
rid: wGameData.roomID
});
};
t.prototype.Msg_Hall_FinishLoad = function(e) {
if (1 == e.status) ; else {
wLog.e("进房加载消息失败");
this.vg_msg_quitGame({
status: 1
});
}
};
t.prototype.vg_msg_quitGame = function(e) {
var t;
if (1 == e.status) {
var o = null === (t = e.data) || void 0 === t ? void 0 : t.gold;
wViewMgr.quitGame(o);
} else wLog.e("退出游戏失败");
};
t.prototype.vg_quitGame = function(e) {
var t = this;
void 0 === e && (e = !1);
wUIManager.showGameOutTips({
okCB: function() {
wNetWork.send("Msg_" + t.vg_game + "_Out", [], !0);
},
isGameRun: e
});
};
t.prototype.local_Event = function(e) {
switch (e) {
case "up_Gold":
this.vg_upGameGold();
}
};
return __decorate([ a ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {
NetInterface: "NetInterface"
} ],
AudioManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "51bbajOJqFLUrOmydtDoAPo", "AudioManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.AudioManager = void 0;
var n = function() {
function e() {
this.musicVolume = 1;
this.soundVolume = 1;
this.currentBgMusicUrl = null;
this.soundUrl = {};
this.commonSoundPath = {
button: "sound/effect/btn_click",
close: "sound/effect/btn_close",
selected: "sound/effect/BT_GET"
};
this.init();
}
e.prototype.playBtnSound = function() {
this.playSound(this.commonSoundPath.button);
};
e.prototype.playCloseSound = function() {
this.playSound(this.commonSoundPath.close);
};
e.prototype.playSelectedSound = function() {
this.playSound(this.commonSoundPath.selected);
};
e.prototype.playBgMusic = function(e, t) {
var o = this;
if (this.currentBgMusicUrl != e) {
this.currentBgMusicUrl = e;
wRes.loadRes(e, null, null, function(n, i) {
if (n) console.warn("背景音乐加载失败：", e, t); else if (o.currentBgMusicUrl == e) {
cc.audioEngine.isMusicPlaying() && cc.audioEngine.stopMusic();
cc.audioEngine.playMusic(i, !0);
}
}, t);
}
};
e.prototype.playSound = function(e, t, o) {
var n = this;
void 0 === t && (t = null);
void 0 === o && (o = !1);
wRes.loadRes(e, null, null, function(t, i) {
if (t) wLog.w("------------音效加载失败", e); else {
n.soundUrl[e] = cc.audioEngine.play(i, o, n.soundVolume);
if (Object.values(n.commonSoundPath).includes(e)) {
n.soundUrl[e] = null;
delete n.soundUrl[e];
} else cc.audioEngine.setFinishCallback(n.soundUrl[e], function() {
delete n.soundUrl[e];
});
}
}, t);
};
e.prototype.stopEffects = function(e) {
if (this.soundUrl[e]) {
cc.audioEngine.stop(this.soundUrl[e]);
delete this.soundUrl[e];
return !0;
}
return !1;
};
e.prototype.stopAllEffects = function() {
for (var e in this.soundUrl) this.stopEffects(e);
};
e.prototype.stopBgMusic = function() {
this.currentBgMusicUrl = null;
cc.audioEngine.isMusicPlaying() && cc.audioEngine.stopMusic();
};
e.prototype.pauseMusic = function() {
cc.audioEngine.isMusicPlaying() && cc.audioEngine.pauseMusic();
};
e.prototype.resumeMusic = function() {
cc.audioEngine.resumeMusic();
};
e.prototype.init = function() {
if (null === cc.sys.localStorage.getItem("MusicVolume")) {
cc.sys.localStorage.setItem("MusicVolume", this.musicVolume);
cc.sys.localStorage.setItem("SoundVolume", this.soundVolume);
} else {
this.musicVolume = parseFloat(cc.sys.localStorage.getItem("MusicVolume"));
this.soundVolume = parseFloat(cc.sys.localStorage.getItem("SoundVolume"));
}
cc.audioEngine.setMusicVolume(this.musicVolume);
cc.audioEngine.setEffectsVolume(this.soundVolume);
};
e.prototype.setMusicVolume = function(e) {
this.musicVolume = parseFloat(e.toFixed(1));
this.musicVolume === parseFloat(cc.sys.localStorage.getItem("MusicVolume")) || cc.sys.localStorage.setItem("MusicVolume", this.musicVolume);
cc.audioEngine.setMusicVolume(this.musicVolume);
};
e.prototype.getMusicVolume = function() {
return this.musicVolume;
};
e.prototype.setSoundVolume = function(e) {
this.soundVolume = parseFloat(e.toFixed(1));
this.soundVolume === parseFloat(cc.sys.localStorage.getItem("SoundVolume")) || cc.sys.localStorage.setItem("SoundVolume", this.soundVolume);
cc.audioEngine.setEffectsVolume(this.soundVolume);
for (var t in this.soundUrl) if (Object.prototype.hasOwnProperty.call(this.soundUrl, t)) {
var o = this.soundUrl[t];
cc.audioEngine.setVolume(o, this.soundVolume);
}
};
e.prototype.getSoundVolume = function() {
return this.soundVolume;
};
return e;
}();
o.AudioManager = n;
cc._RF.pop();
}, {} ],
BUYUSet: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "f34421TZnJO164aEF5RsUYS", "BUYUSet");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.zdy_t = null;
t.lc_t = null;
t.m_t = null;
t.s_t = null;
t.y_t = null;
t.t_t = null;
t.content = null;
t.shadowCB = null;
t.specialCb = null;
return t;
}
t.prototype.onEnable = function() {
this.initUpdate();
};
t.prototype.init = function(e) {
this.shadowCB = e.shadowCB;
this.specialCb = e.specialCb;
};
t.prototype.initUpdate = function() {
this.updateEffect();
this.updateMusic();
this.shadowEffectn();
this.specialEffects();
for (var e = !0, t = 0, o = this.content.children; t < o.length; t++) if (!o[t].getComponent(cc.Toggle).isChecked) {
e = !1;
break;
}
e ? this.lc_t.check() : this.zdy_t.check();
};
t.prototype.updateEffect = function() {
cc.sys.localStorage.getItem("SoundVolume") > 0 ? this.s_t.uncheck() : this.s_t.check();
};
t.prototype.updateMusic = function() {
cc.sys.localStorage.getItem("MusicVolume") > 0 ? this.m_t.uncheck() : this.m_t.check();
};
t.prototype.shadowEffectn = function() {
var e = cc.sys.localStorage.getItem("shadowEffectn");
(e = Number(e)) ? this.y_t.check() : this.y_t.uncheck();
this.shadowCB && this.shadowCB(e);
};
t.prototype.specialEffects = function() {
var e = cc.sys.localStorage.getItem("specialEffects");
(e = Number(e)) ? this.t_t.check() : this.t_t.uncheck();
this.specialCb && this.specialCb(e);
};
t.prototype.onClick = function(e, t) {
switch (t) {
case "zdy":
wAudioMgr.setMusicVolume(1);
wAudioMgr.setSoundVolume(1);
cc.sys.localStorage.setItem("shadowEffectn", 0);
cc.sys.localStorage.setItem("specialEffects", 0);
break;

case "lc":
wAudioMgr.setMusicVolume(0);
wAudioMgr.setSoundVolume(0);
cc.sys.localStorage.setItem("shadowEffectn", 1);
cc.sys.localStorage.setItem("specialEffects", 1);
break;

case "m":
wAudioMgr.setMusicVolume(this.m_t.isChecked ? 0 : 1);
break;

case "s":
wAudioMgr.setSoundVolume(this.s_t.isChecked ? 0 : 1);
break;

case "y":
cc.sys.localStorage.setItem("shadowEffectn", this.y_t.isChecked ? 1 : 0);
break;

case "t":
cc.sys.localStorage.setItem("specialEffects", this.t_t.isChecked ? 1 : 0);
}
this.initUpdate();
wAudioMgr.playBtnSound();
};
__decorate([ s(cc.Toggle) ], t.prototype, "zdy_t", void 0);
__decorate([ s(cc.Toggle) ], t.prototype, "lc_t", void 0);
__decorate([ s(cc.Toggle) ], t.prototype, "m_t", void 0);
__decorate([ s(cc.Toggle) ], t.prototype, "s_t", void 0);
__decorate([ s(cc.Toggle) ], t.prototype, "y_t", void 0);
__decorate([ s(cc.Toggle) ], t.prototype, "t_t", void 0);
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
BankCheck: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "bd21dfMELhDBKXIjyYpPI3o", "BankCheck");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.bankPow = null;
t.isbool = !0;
return t;
}
t.prototype.start = function() {
this.bankPow.placeholder = "";
};
t.prototype.onShow = function() {
this.bankPow.placeholder = "请输入密码";
};
t.prototype.onClick = function(e, t) {
var o = this;
if (this.isbool) {
wAudioMgr.playBtnSound();
switch (t) {
case "ok":
if (this.bankPow.string == wGameData.getKey("bankpass")) {
this.isbool = !1;
wViewMgr.openPage({
path: i.Config.ViewConfig.Bank
});
wGameData.bankPow = this.bankPow.string;
this.node.zIndex = 1e3;
this.scheduleOnce(function() {
o.hide(!1);
}, .3);
return;
}
wUIManager.showTips("密码不正确!");
break;

case "pow":
if (!wGameData.getKey("isbind")) {
wUIManager.showTips("请先绑定手机再修改银行密码！");
return;
}
this.hide(!1);
wViewMgr.openPage({
path: "Prefab/ForgetPassword_YH"
});
}
}
};
__decorate([ c(cc.EditBox) ], t.prototype, "bankPow", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase"
} ],
Bank: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "ff335l8be9GIYZpzRuaOGaq", "Bank");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
BigWin: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "2ff80dSxSBCwJoXRAXKylPc", "BigWin");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.coins = null;
t.showNode = null;
t.time = 8;
t.actC = {
4: "epicwin-xiaoshi-100-",
2: "megawin-xiaoshi-100-",
3: "superwin-xiaoshi-100-"
};
t.tc = {
4: 17,
3: 12.4,
2: 8
};
t.isRun = !0;
t.audioUrl = "Game/NewRes/bigWin/audio/";
t.pos = 1;
t.agoAudio = "";
return t;
}
t.prototype.init = function(e) {
this.coins.active = !1;
this.cb = e.cb;
this.type = e.type;
this.gold = e.gold;
this.time = this.tc[e.type];
this.dir = wGameData.getGame().dir || i.Config.SCREEN_DIR.V;
var t = cc.find("bg", this.main).getComponent(sp.Skeleton);
if (this.dir == i.Config.SCREEN_DIR.H) {
this.showNode = this.main.getChildByName("H");
t.setAnimation(1, "guang-1100", !0);
for (var o = cc.v2(0, -600), n = 0, a = this.coins.children; n < a.length; n++) a[n].getComponent(cc.ParticleSystem).gravity = o;
} else {
this.showNode = this.main.getChildByName("V");
t.setAnimation(1, "guang-1100-shu", !0);
o = cc.v2(0, -500);
for (var s = 0, c = this.coins.children; s < c.length; s++) c[s].getComponent(cc.ParticleSystem).gravity = o;
}
};
t.prototype.onHide = function() {
this.cb && this.cb();
};
t.prototype.onShow = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t = this;
return __generator(this, function() {
this.coins.active = !0;
this.showNode.active = !0;
(e = this.showNode.getChildByName("label").getComponent(cc.Label)).string = "";
this.showNode.getChildByName("spine2").getComponent(sp.Skeleton).setAnimation(0, "win-1100" + (this.dir == i.Config.SCREEN_DIR.V ? "-shu" : ""), !1);
wUIHelp.CountUp_(e.node, 0, this.gold, this.time);
this.scheduleOnce(function() {
t.animEnd();
}, this.time);
this.scheduleOnce(function() {
t.background.on("click", t.onclick, t);
}, 1);
this.playAudio("big_win");
this.scheduleOnce(function() {
t.pos = 2;
t.playAudio("mega_win");
t.showAnim();
}, 4.6);
this.type >= 2 && this.scheduleOnce(function() {
t.pos = 3;
t.playAudio("super_win");
t.showAnim();
}, 8.6);
this.type >= 3 && this.scheduleOnce(function() {
t.pos = 4;
t.playAudio("epic_win");
}, 13.6);
return [ 2 ];
});
});
};
t.prototype.onclick = function() {
this.isRun ? this.animEnd() : this.close();
};
t.prototype.showAnim = function() {
var e = cc.scaleTo(.1, 1.15), t = cc.scaleTo(.2, 1), o = cc.sequence(e, t);
cc.Canvas.instance.node.runAction(o);
};
t.prototype.animEnd = function() {
for (var e = this, t = 0, o = this.coins.children; t < o.length; t++) o[t].getComponent(cc.ParticleSystem).stopSystem();
this.node.stopAllActions();
this.unscheduleAllCallbacks();
this.isRun = !1;
var n = this.showNode.getChildByName("label").getComponent(cc.Label);
n.string = wUtils.numConvert(this.gold);
n.node.stopAllActions();
this.scheduleOnce(function() {
e.close(!1);
}, 5);
if (this.pos < this.type) {
this.playAudio({
2: "mega_win",
3: "super_win",
4: "epic_win"
}[this.type]);
var a = this.showNode.getChildByName("spine1").getComponent(sp.Skeleton);
a.node.active = !0;
a.setAnimation(0, {
2: "mega_dianliu-83",
3: "super_dianliu-157",
4: "epic_dianliu-104"
}[this.type], !1);
}
var s = this.showNode.getChildByName("spine2").getComponent(sp.Skeleton), c = this.actC[this.type] + (this.dir == i.Config.SCREEN_DIR.H ? "type" : "shu-type");
s.setAnimation(0, c, !1);
};
t.prototype.close = function(e) {
void 0 === e && (e = !0);
this.stopAudio();
this.background.off("click", this.onclick, this);
this.coins.active = !1;
this.hide(e);
};
t.prototype.stopAudio = function() {
this.agoAudio && wAudioMgr.stopEffects(this.agoAudio);
};
t.prototype.playAudio = function(e) {
this.stopAudio();
e = "" + this.audioUrl + e;
this.agoAudio = e;
wAudioMgr.playSound(e);
};
__decorate([ c(cc.Node) ], t.prototype, "coins", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase"
} ],
BindGiveGold: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b3e12QHykFAeo9Qhim+ReZI", "BindGiveGold");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onClick = function() {
wAudioMgr.playBtnSound();
this.hide(!1);
wViewMgr.openPage({
path: "Prefab/SetPlayerInfo"
});
wViewMgr.openPage({
path: "Prefab/BindPhone"
});
};
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
BindPhone: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "5030dhzBwJJoq9hOeDlNAK7", "BindPhone");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Constant"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.phoneNode = null;
t.code = null;
t.nickname = null;
t.pow = null;
t.getCodeBtn = null;
t.getCodeTime = null;
return t;
}
t.prototype.sendMsg = function() {
var e = this, t = this.phoneNode.string;
if (wUtils.checkMobile(t)) {
var o = this.code.string;
if (o) {
var n = this.nickname.string;
if (n) {
var i = this.pow.string;
if (wUtils.checkPwd(i)) {
var a = {
uid: wGameData.getKey("uid"),
password: i,
code: o,
telephone: t,
nickname: n
};
wNetWork.HttpRequest("Msg_User_upgrade", a, !0).then(function() {
wGameData.setLastLogin({
uid: t,
password: i,
equipmentcard: wGameData.getAPPID(),
type: 1,
code: -1
});
var o = wGameData.getKey("uid"), s = wGameData.getAllAccInfo();
s[o].accInfo = wGameData.getLastLogin();
s[o].info.isbind = t;
wGameData.setAllAccInfo(s);
wUIManager.showTips("升级账号成功", wUIManager.TIPS_OK);
wGameData.setKey("isbind", a.telephone);
wGameData.setKey("nickname", n);
e.hide(!1);
}).catch(function(e) {
e && "玩家已经是正式玩家" == e.msg && wUIManager.showConfirmUI({
content: "该手机号已经绑定了其他账号，无法重复绑定",
djsTime: 3,
openRClose: !1
});
});
} else wUIManager.showTips("请输入密码!");
} else wUIManager.showTips("请输入昵称!");
} else wUIManager.showTips("验证码不能为空!");
} else wUIManager.showTips("请输入手机号码!");
};
t.prototype.onClick = function(e, t) {
var o = this;
wAudioMgr.playBtnSound();
switch (t) {
case "sj":
this.nickname.string = i.randomName();
break;

case "qr":
this.sendMsg();
break;

case "code":
var n = this.phoneNode.string;
if (!wUtils.checkMobile(n)) {
wUIManager.showTips("请输入手机号码!");
return;
}
this.getCodeBtn.active = !1;
wNetWork.HttpRequest("Msg_User_getCode", {
telephone: n
}).then(function() {
wUIManager.showTips("发送成功,请注意查收!", wUIManager.TIPS_OK);
wGameData.startCodeTime();
o.getCode(60);
});
}
};
t.prototype.getCode = function(e) {
var t = this;
this.getCodeTime.string = e + "s";
this.getCodeBtn.active = !1;
this.schedule(function() {
if (0 != --e) t.getCodeTime.string = e + "s"; else {
t.getCodeBtn.active = !0;
t.getCodeTime.string = "";
t.unscheduleAllCallbacks();
}
}, 1);
};
__decorate([ c(cc.EditBox) ], t.prototype, "phoneNode", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "code", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "nickname", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "pow", void 0);
__decorate([ c(cc.Node) ], t.prototype, "getCodeBtn", void 0);
__decorate([ c(cc.Label) ], t.prototype, "getCodeTime", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Constant: "Constant",
PopupBase: "PopupBase"
} ],
BtnDelayedClick: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "dff4eT9SqFK1LVRNi4CUlLW", "BtnDelayedClick");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass;
n.property;
var a = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.timeout = null;
t.delayTime = 5e3;
t.btn = null;
return t;
}
t.prototype.onLoad = function() {
var e = this;
this.btn = this.node.getComponent(cc.Button);
this.node.on("click", function() {
e.btn.interactable = !1;
null !== e.timeout && clearTimeout(e.timeout);
e.timeout = setTimeout(function() {
if (cc.isValid(e)) {
clearTimeout(e.timeout);
e.btn.interactable = !0;
}
}, e.delayTime);
}, this);
};
t.prototype.onDestroy = function() {
null !== this.timeout && clearTimeout(this.timeout);
};
return __decorate([ i ], t);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
ButtonTrinsItion: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "a9523111ZBCAI6bR1YBlF3w", "ButtonTrinsItion");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.btn_scale = 1.05;
return t;
}
t.prototype.start = function() {
var e = this;
this.node.on(cc.Node.EventType.TOUCH_START, function() {
e.node.getComponent(cc.Button).interactable && (e.node.scale = e.btn_scale);
}, this);
this.node.on(cc.Node.EventType.TOUCH_END, function() {
e.node.scale = 1;
}, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, function() {
e.node.scale = 1;
}, this);
};
__decorate([ a({
tooltip: "放大的倍数"
}) ], t.prototype, "btn_scale", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
CQRCode: [ function(e, t) {
"use strict";
cc._RF.push(t, "ad9bazoym1HSaCcvMdbrCTl", "CQRCode");
function o(e) {
this.mode = i.MODE_8BIT_BYTE;
this.data = e;
}
o.prototype = {
getLength: function() {
return this.data.length;
},
write: function(e) {
for (var t = 0; t < this.data.length; t++) e.put(this.data.charCodeAt(t), 8);
}
};
var n = function(e, t) {
this.typeNumber = e;
this.errorCorrectLevel = t;
this.modules = null;
this.moduleCount = 0;
this.dataCache = null;
this.dataList = new Array();
};
n.prototype = {
addData: function(e) {
var t = new o(e);
this.dataList.push(t);
this.dataCache = null;
},
isDark: function(e, t) {
if (e < 0 || this.moduleCount <= e || t < 0 || this.moduleCount <= t) throw new Error(e + "," + t);
return this.modules[e][t];
},
getModuleCount: function() {
return this.moduleCount;
},
make: function() {
if (this.typeNumber < 1) {
var e = 1;
for (e = 1; e < 40; e++) {
for (var t = u.getRSBlocks(e, this.errorCorrectLevel), o = new d(), n = 0, i = 0; i < t.length; i++) n += t[i].dataCount;
for (var s = 0; s < this.dataList.length; s++) {
var c = this.dataList[s];
o.put(c.mode, 4);
o.put(c.getLength(), a.getLengthInBits(c.mode, e));
c.write(o);
}
if (o.getLengthInBits() <= 8 * n) break;
}
this.typeNumber = e;
}
this.makeImpl(!1, this.getBestMaskPattern());
},
makeImpl: function(e, t) {
this.moduleCount = 4 * this.typeNumber + 17;
this.modules = new Array(this.moduleCount);
for (var o = 0; o < this.moduleCount; o++) {
this.modules[o] = new Array(this.moduleCount);
for (var i = 0; i < this.moduleCount; i++) this.modules[o][i] = null;
}
this.setupPositionProbePattern(0, 0);
this.setupPositionProbePattern(this.moduleCount - 7, 0);
this.setupPositionProbePattern(0, this.moduleCount - 7);
this.setupPositionAdjustPattern();
this.setupTimingPattern();
this.setupTypeInfo(e, t);
this.typeNumber >= 7 && this.setupTypeNumber(e);
null == this.dataCache && (this.dataCache = n.createData(this.typeNumber, this.errorCorrectLevel, this.dataList));
this.mapData(this.dataCache, t);
},
setupPositionProbePattern: function(e, t) {
for (var o = -1; o <= 7; o++) if (!(e + o <= -1 || this.moduleCount <= e + o)) for (var n = -1; n <= 7; n++) t + n <= -1 || this.moduleCount <= t + n || (this.modules[e + o][t + n] = 0 <= o && o <= 6 && (0 == n || 6 == n) || 0 <= n && n <= 6 && (0 == o || 6 == o) || 2 <= o && o <= 4 && 2 <= n && n <= 4);
},
getBestMaskPattern: function() {
for (var e = 0, t = 0, o = 0; o < 8; o++) {
this.makeImpl(!0, o);
var n = a.getLostPoint(this);
if (0 == o || e > n) {
e = n;
t = o;
}
}
return t;
},
createMovieClip: function(e, t, o) {
var n = e.createEmptyMovieClip(t, o);
this.make();
for (var i = 0; i < this.modules.length; i++) for (var a = 1 * i, s = 0; s < this.modules[i].length; s++) {
var c = 1 * s;
if (this.modules[i][s]) {
n.beginFill(0, 100);
n.moveTo(c, a);
n.lineTo(c + 1, a);
n.lineTo(c + 1, a + 1);
n.lineTo(c, a + 1);
n.endFill();
}
}
return n;
},
setupTimingPattern: function() {
for (var e = 8; e < this.moduleCount - 8; e++) null == this.modules[e][6] && (this.modules[e][6] = e % 2 == 0);
for (var t = 8; t < this.moduleCount - 8; t++) null == this.modules[6][t] && (this.modules[6][t] = t % 2 == 0);
},
setupPositionAdjustPattern: function() {
for (var e = a.getPatternPosition(this.typeNumber), t = 0; t < e.length; t++) for (var o = 0; o < e.length; o++) {
var n = e[t], i = e[o];
if (null == this.modules[n][i]) for (var s = -2; s <= 2; s++) for (var c = -2; c <= 2; c++) this.modules[n + s][i + c] = -2 == s || 2 == s || -2 == c || 2 == c || 0 == s && 0 == c;
}
},
setupTypeNumber: function(e) {
for (var t = a.getBCHTypeNumber(this.typeNumber), o = 0; o < 18; o++) {
var n = !e && 1 == (t >> o & 1);
this.modules[Math.floor(o / 3)][o % 3 + this.moduleCount - 8 - 3] = n;
}
for (var i = 0; i < 18; i++) {
var s = !e && 1 == (t >> i & 1);
this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = s;
}
},
setupTypeInfo: function(e, t) {
for (var o = this.errorCorrectLevel << 3 | t, n = a.getBCHTypeInfo(o), i = 0; i < 15; i++) {
var s = !e && 1 == (n >> i & 1);
i < 6 ? this.modules[i][8] = s : i < 8 ? this.modules[i + 1][8] = s : this.modules[this.moduleCount - 15 + i][8] = s;
}
for (var c = 0; c < 15; c++) {
var r = !e && 1 == (n >> c & 1);
c < 8 ? this.modules[8][this.moduleCount - c - 1] = r : c < 9 ? this.modules[8][15 - c - 1 + 1] = r : this.modules[8][15 - c - 1] = r;
}
this.modules[this.moduleCount - 8][8] = !e;
},
mapData: function(e, t) {
for (var o = -1, n = this.moduleCount - 1, i = 7, s = 0, c = this.moduleCount - 1; c > 0; c -= 2) {
6 == c && c--;
for (;;) {
for (var r = 0; r < 2; r++) if (null == this.modules[n][c - r]) {
var l = !1;
s < e.length && (l = 1 == (e[s] >>> i & 1));
a.getMask(t, n, c - r) && (l = !l);
this.modules[n][c - r] = l;
if (-1 == --i) {
s++;
i = 7;
}
}
if ((n += o) < 0 || this.moduleCount <= n) {
n -= o;
o = -o;
break;
}
}
}
}
};
n.PAD0 = 236;
n.PAD1 = 17;
n.createData = function(e, t, o) {
for (var i = u.getRSBlocks(e, t), s = new d(), c = 0; c < o.length; c++) {
var r = o[c];
s.put(r.mode, 4);
s.put(r.getLength(), a.getLengthInBits(r.mode, e));
r.write(s);
}
for (var l = 0, p = 0; p < i.length; p++) l += i[p].dataCount;
if (s.getLengthInBits() > 8 * l) throw new Error("code length overflow. (" + s.getLengthInBits() + ">" + 8 * l + ")");
s.getLengthInBits() + 4 <= 8 * l && s.put(0, 4);
for (;s.getLengthInBits() % 8 != 0; ) s.putBit(!1);
for (;!(s.getLengthInBits() >= 8 * l); ) {
s.put(n.PAD0, 8);
if (s.getLengthInBits() >= 8 * l) break;
s.put(n.PAD1, 8);
}
return n.createBytes(s, i);
};
n.createBytes = function(e, t) {
for (var o = 0, n = 0, i = 0, s = new Array(t.length), c = new Array(t.length), r = 0; r < t.length; r++) {
var l = t[r].dataCount, u = t[r].totalCount - l;
n = Math.max(n, l);
i = Math.max(i, u);
s[r] = new Array(l);
for (var d = 0; d < s[r].length; d++) s[r][d] = 255 & e.buffer[d + o];
o += l;
var h = a.getErrorCorrectPolynomial(u), g = new p(s[r], h.getLength() - 1).mod(h);
c[r] = new Array(h.getLength() - 1);
for (var f = 0; f < c[r].length; f++) {
var m = f + g.getLength() - c[r].length;
c[r][f] = m >= 0 ? g.get(m) : 0;
}
}
for (var _ = 0, y = 0; y < t.length; y++) _ += t[y].totalCount;
for (var v = new Array(_), w = 0, C = 0; C < n; C++) for (var b = 0; b < t.length; b++) C < s[b].length && (v[w++] = s[b][C]);
for (var M = 0; M < i; M++) for (var N = 0; N < t.length; N++) M < c[N].length && (v[w++] = c[N][M]);
return v;
};
for (var i = {
MODE_NUMBER: 1,
MODE_ALPHA_NUM: 2,
MODE_8BIT_BYTE: 4,
MODE_KANJI: 8
}, a = {
PATTERN_POSITION_TABLE: [ [], [ 6, 18 ], [ 6, 22 ], [ 6, 26 ], [ 6, 30 ], [ 6, 34 ], [ 6, 22, 38 ], [ 6, 24, 42 ], [ 6, 26, 46 ], [ 6, 28, 50 ], [ 6, 30, 54 ], [ 6, 32, 58 ], [ 6, 34, 62 ], [ 6, 26, 46, 66 ], [ 6, 26, 48, 70 ], [ 6, 26, 50, 74 ], [ 6, 30, 54, 78 ], [ 6, 30, 56, 82 ], [ 6, 30, 58, 86 ], [ 6, 34, 62, 90 ], [ 6, 28, 50, 72, 94 ], [ 6, 26, 50, 74, 98 ], [ 6, 30, 54, 78, 102 ], [ 6, 28, 54, 80, 106 ], [ 6, 32, 58, 84, 110 ], [ 6, 30, 58, 86, 114 ], [ 6, 34, 62, 90, 118 ], [ 6, 26, 50, 74, 98, 122 ], [ 6, 30, 54, 78, 102, 126 ], [ 6, 26, 52, 78, 104, 130 ], [ 6, 30, 56, 82, 108, 134 ], [ 6, 34, 60, 86, 112, 138 ], [ 6, 30, 58, 86, 114, 142 ], [ 6, 34, 62, 90, 118, 146 ], [ 6, 30, 54, 78, 102, 126, 150 ], [ 6, 24, 50, 76, 102, 128, 154 ], [ 6, 28, 54, 80, 106, 132, 158 ], [ 6, 32, 58, 84, 110, 136, 162 ], [ 6, 26, 54, 82, 110, 138, 166 ], [ 6, 30, 58, 86, 114, 142, 170 ] ],
G15: 1335,
G18: 7973,
G15_MASK: 21522,
getBCHTypeInfo: function(e) {
for (var t = e << 10; a.getBCHDigit(t) - a.getBCHDigit(a.G15) >= 0; ) t ^= a.G15 << a.getBCHDigit(t) - a.getBCHDigit(a.G15);
return (e << 10 | t) ^ a.G15_MASK;
},
getBCHTypeNumber: function(e) {
for (var t = e << 12; a.getBCHDigit(t) - a.getBCHDigit(a.G18) >= 0; ) t ^= a.G18 << a.getBCHDigit(t) - a.getBCHDigit(a.G18);
return e << 12 | t;
},
getBCHDigit: function(e) {
for (var t = 0; 0 != e; ) {
t++;
e >>>= 1;
}
return t;
},
getPatternPosition: function(e) {
return a.PATTERN_POSITION_TABLE[e - 1];
},
getMask: function(e, t, o) {
switch (e) {
case 0:
return (t + o) % 2 == 0;

case 1:
return t % 2 == 0;

case 2:
return o % 3 == 0;

case 3:
return (t + o) % 3 == 0;

case 4:
return (Math.floor(t / 2) + Math.floor(o / 3)) % 2 == 0;

case 5:
return t * o % 2 + t * o % 3 == 0;

case 6:
return (t * o % 2 + t * o % 3) % 2 == 0;

case 7:
return (t * o % 3 + (t + o) % 2) % 2 == 0;

default:
throw new Error("bad maskPattern:" + e);
}
},
getErrorCorrectPolynomial: function(e) {
for (var t = new p([ 1 ], 0), o = 0; o < e; o++) t = t.multiply(new p([ 1, s.gexp(o) ], 0));
return t;
},
getLengthInBits: function(e, t) {
if (1 <= t && t < 10) switch (e) {
case i.MODE_NUMBER:
return 10;

case i.MODE_ALPHA_NUM:
return 9;

case i.MODE_8BIT_BYTE:
case i.MODE_KANJI:
return 8;

default:
throw new Error("mode:" + e);
} else if (t < 27) switch (e) {
case i.MODE_NUMBER:
return 12;

case i.MODE_ALPHA_NUM:
return 11;

case i.MODE_8BIT_BYTE:
return 16;

case i.MODE_KANJI:
return 10;

default:
throw new Error("mode:" + e);
} else {
if (!(t < 41)) throw new Error("type:" + t);
switch (e) {
case i.MODE_NUMBER:
return 14;

case i.MODE_ALPHA_NUM:
return 13;

case i.MODE_8BIT_BYTE:
return 16;

case i.MODE_KANJI:
return 12;

default:
throw new Error("mode:" + e);
}
}
},
getLostPoint: function(e) {
for (var t = e.getModuleCount(), o = 0, n = 0; n < t; n++) for (var i = 0; i < t; i++) {
for (var a = 0, s = e.isDark(n, i), c = -1; c <= 1; c++) if (!(n + c < 0 || t <= n + c)) for (var r = -1; r <= 1; r++) i + r < 0 || t <= i + r || 0 == c && 0 == r || s == e.isDark(n + c, i + r) && a++;
a > 5 && (o += 3 + a - 5);
}
for (var l = 0; l < t - 1; l++) for (var p = 0; p < t - 1; p++) {
var u = 0;
e.isDark(l, p) && u++;
e.isDark(l + 1, p) && u++;
e.isDark(l, p + 1) && u++;
e.isDark(l + 1, p + 1) && u++;
0 != u && 4 != u || (o += 3);
}
for (var d = 0; d < t; d++) for (var h = 0; h < t - 6; h++) e.isDark(d, h) && !e.isDark(d, h + 1) && e.isDark(d, h + 2) && e.isDark(d, h + 3) && e.isDark(d, h + 4) && !e.isDark(d, h + 5) && e.isDark(d, h + 6) && (o += 40);
for (var g = 0; g < t; g++) for (var f = 0; f < t - 6; f++) e.isDark(f, g) && !e.isDark(f + 1, g) && e.isDark(f + 2, g) && e.isDark(f + 3, g) && e.isDark(f + 4, g) && !e.isDark(f + 5, g) && e.isDark(f + 6, g) && (o += 40);
for (var m = 0, _ = 0; _ < t; _++) for (var y = 0; y < t; y++) e.isDark(y, _) && m++;
return o + Math.abs(100 * m / t / t - 50) / 5 * 10;
}
}, s = {
glog: function(e) {
if (e < 1) throw new Error("glog(" + e + ")");
return s.LOG_TABLE[e];
},
gexp: function(e) {
for (;e < 0; ) e += 255;
for (;e >= 256; ) e -= 255;
return s.EXP_TABLE[e];
},
EXP_TABLE: new Array(256),
LOG_TABLE: new Array(256)
}, c = 0; c < 8; c++) s.EXP_TABLE[c] = 1 << c;
for (var r = 8; r < 256; r++) s.EXP_TABLE[r] = s.EXP_TABLE[r - 4] ^ s.EXP_TABLE[r - 5] ^ s.EXP_TABLE[r - 6] ^ s.EXP_TABLE[r - 8];
for (var l = 0; l < 255; l++) s.LOG_TABLE[s.EXP_TABLE[l]] = l;
function p(e, t) {
if (null == e.length) throw new Error(e.length + "/" + t);
for (var o = 0; o < e.length && 0 == e[o]; ) o++;
this.num = new Array(e.length - o + t);
for (var n = 0; n < e.length - o; n++) this.num[n] = e[n + o];
}
p.prototype = {
get: function(e) {
return this.num[e];
},
getLength: function() {
return this.num.length;
},
multiply: function(e) {
for (var t = new Array(this.getLength() + e.getLength() - 1), o = 0; o < this.getLength(); o++) for (var n = 0; n < e.getLength(); n++) t[o + n] ^= s.gexp(s.glog(this.get(o)) + s.glog(e.get(n)));
return new p(t, 0);
},
mod: function(e) {
if (this.getLength() - e.getLength() < 0) return this;
for (var t = s.glog(this.get(0)) - s.glog(e.get(0)), o = new Array(this.getLength()), n = 0; n < this.getLength(); n++) o[n] = this.get(n);
for (var i = 0; i < e.getLength(); i++) o[i] ^= s.gexp(s.glog(e.get(i)) + t);
return new p(o, 0).mod(e);
}
};
function u(e, t) {
this.totalCount = e;
this.dataCount = t;
}
u.RS_BLOCK_TABLE = [ [ 1, 26, 19 ], [ 1, 26, 16 ], [ 1, 26, 13 ], [ 1, 26, 9 ], [ 1, 44, 34 ], [ 1, 44, 28 ], [ 1, 44, 22 ], [ 1, 44, 16 ], [ 1, 70, 55 ], [ 1, 70, 44 ], [ 2, 35, 17 ], [ 2, 35, 13 ], [ 1, 100, 80 ], [ 2, 50, 32 ], [ 2, 50, 24 ], [ 4, 25, 9 ], [ 1, 134, 108 ], [ 2, 67, 43 ], [ 2, 33, 15, 2, 34, 16 ], [ 2, 33, 11, 2, 34, 12 ], [ 2, 86, 68 ], [ 4, 43, 27 ], [ 4, 43, 19 ], [ 4, 43, 15 ], [ 2, 98, 78 ], [ 4, 49, 31 ], [ 2, 32, 14, 4, 33, 15 ], [ 4, 39, 13, 1, 40, 14 ], [ 2, 121, 97 ], [ 2, 60, 38, 2, 61, 39 ], [ 4, 40, 18, 2, 41, 19 ], [ 4, 40, 14, 2, 41, 15 ], [ 2, 146, 116 ], [ 3, 58, 36, 2, 59, 37 ], [ 4, 36, 16, 4, 37, 17 ], [ 4, 36, 12, 4, 37, 13 ], [ 2, 86, 68, 2, 87, 69 ], [ 4, 69, 43, 1, 70, 44 ], [ 6, 43, 19, 2, 44, 20 ], [ 6, 43, 15, 2, 44, 16 ], [ 4, 101, 81 ], [ 1, 80, 50, 4, 81, 51 ], [ 4, 50, 22, 4, 51, 23 ], [ 3, 36, 12, 8, 37, 13 ], [ 2, 116, 92, 2, 117, 93 ], [ 6, 58, 36, 2, 59, 37 ], [ 4, 46, 20, 6, 47, 21 ], [ 7, 42, 14, 4, 43, 15 ], [ 4, 133, 107 ], [ 8, 59, 37, 1, 60, 38 ], [ 8, 44, 20, 4, 45, 21 ], [ 12, 33, 11, 4, 34, 12 ], [ 3, 145, 115, 1, 146, 116 ], [ 4, 64, 40, 5, 65, 41 ], [ 11, 36, 16, 5, 37, 17 ], [ 11, 36, 12, 5, 37, 13 ], [ 5, 109, 87, 1, 110, 88 ], [ 5, 65, 41, 5, 66, 42 ], [ 5, 54, 24, 7, 55, 25 ], [ 11, 36, 12 ], [ 5, 122, 98, 1, 123, 99 ], [ 7, 73, 45, 3, 74, 46 ], [ 15, 43, 19, 2, 44, 20 ], [ 3, 45, 15, 13, 46, 16 ], [ 1, 135, 107, 5, 136, 108 ], [ 10, 74, 46, 1, 75, 47 ], [ 1, 50, 22, 15, 51, 23 ], [ 2, 42, 14, 17, 43, 15 ], [ 5, 150, 120, 1, 151, 121 ], [ 9, 69, 43, 4, 70, 44 ], [ 17, 50, 22, 1, 51, 23 ], [ 2, 42, 14, 19, 43, 15 ], [ 3, 141, 113, 4, 142, 114 ], [ 3, 70, 44, 11, 71, 45 ], [ 17, 47, 21, 4, 48, 22 ], [ 9, 39, 13, 16, 40, 14 ], [ 3, 135, 107, 5, 136, 108 ], [ 3, 67, 41, 13, 68, 42 ], [ 15, 54, 24, 5, 55, 25 ], [ 15, 43, 15, 10, 44, 16 ], [ 4, 144, 116, 4, 145, 117 ], [ 17, 68, 42 ], [ 17, 50, 22, 6, 51, 23 ], [ 19, 46, 16, 6, 47, 17 ], [ 2, 139, 111, 7, 140, 112 ], [ 17, 74, 46 ], [ 7, 54, 24, 16, 55, 25 ], [ 34, 37, 13 ], [ 4, 151, 121, 5, 152, 122 ], [ 4, 75, 47, 14, 76, 48 ], [ 11, 54, 24, 14, 55, 25 ], [ 16, 45, 15, 14, 46, 16 ], [ 6, 147, 117, 4, 148, 118 ], [ 6, 73, 45, 14, 74, 46 ], [ 11, 54, 24, 16, 55, 25 ], [ 30, 46, 16, 2, 47, 17 ], [ 8, 132, 106, 4, 133, 107 ], [ 8, 75, 47, 13, 76, 48 ], [ 7, 54, 24, 22, 55, 25 ], [ 22, 45, 15, 13, 46, 16 ], [ 10, 142, 114, 2, 143, 115 ], [ 19, 74, 46, 4, 75, 47 ], [ 28, 50, 22, 6, 51, 23 ], [ 33, 46, 16, 4, 47, 17 ], [ 8, 152, 122, 4, 153, 123 ], [ 22, 73, 45, 3, 74, 46 ], [ 8, 53, 23, 26, 54, 24 ], [ 12, 45, 15, 28, 46, 16 ], [ 3, 147, 117, 10, 148, 118 ], [ 3, 73, 45, 23, 74, 46 ], [ 4, 54, 24, 31, 55, 25 ], [ 11, 45, 15, 31, 46, 16 ], [ 7, 146, 116, 7, 147, 117 ], [ 21, 73, 45, 7, 74, 46 ], [ 1, 53, 23, 37, 54, 24 ], [ 19, 45, 15, 26, 46, 16 ], [ 5, 145, 115, 10, 146, 116 ], [ 19, 75, 47, 10, 76, 48 ], [ 15, 54, 24, 25, 55, 25 ], [ 23, 45, 15, 25, 46, 16 ], [ 13, 145, 115, 3, 146, 116 ], [ 2, 74, 46, 29, 75, 47 ], [ 42, 54, 24, 1, 55, 25 ], [ 23, 45, 15, 28, 46, 16 ], [ 17, 145, 115 ], [ 10, 74, 46, 23, 75, 47 ], [ 10, 54, 24, 35, 55, 25 ], [ 19, 45, 15, 35, 46, 16 ], [ 17, 145, 115, 1, 146, 116 ], [ 14, 74, 46, 21, 75, 47 ], [ 29, 54, 24, 19, 55, 25 ], [ 11, 45, 15, 46, 46, 16 ], [ 13, 145, 115, 6, 146, 116 ], [ 14, 74, 46, 23, 75, 47 ], [ 44, 54, 24, 7, 55, 25 ], [ 59, 46, 16, 1, 47, 17 ], [ 12, 151, 121, 7, 152, 122 ], [ 12, 75, 47, 26, 76, 48 ], [ 39, 54, 24, 14, 55, 25 ], [ 22, 45, 15, 41, 46, 16 ], [ 6, 151, 121, 14, 152, 122 ], [ 6, 75, 47, 34, 76, 48 ], [ 46, 54, 24, 10, 55, 25 ], [ 2, 45, 15, 64, 46, 16 ], [ 17, 152, 122, 4, 153, 123 ], [ 29, 74, 46, 14, 75, 47 ], [ 49, 54, 24, 10, 55, 25 ], [ 24, 45, 15, 46, 46, 16 ], [ 4, 152, 122, 18, 153, 123 ], [ 13, 74, 46, 32, 75, 47 ], [ 48, 54, 24, 14, 55, 25 ], [ 42, 45, 15, 32, 46, 16 ], [ 20, 147, 117, 4, 148, 118 ], [ 40, 75, 47, 7, 76, 48 ], [ 43, 54, 24, 22, 55, 25 ], [ 10, 45, 15, 67, 46, 16 ], [ 19, 148, 118, 6, 149, 119 ], [ 18, 75, 47, 31, 76, 48 ], [ 34, 54, 24, 34, 55, 25 ], [ 20, 45, 15, 61, 46, 16 ] ];
u.getRSBlocks = function(e, t) {
var o = u.getRsBlockTable(e, t);
if (null == o) throw new Error("bad rs block @ typeNumber:" + e + "/errorCorrectLevel:" + t);
for (var n = o.length / 3, i = new Array(), a = 0; a < n; a++) for (var s = o[3 * a + 0], c = o[3 * a + 1], r = o[3 * a + 2], l = 0; l < s; l++) i.push(new u(c, r));
return i;
};
u.getRsBlockTable = function(e, t) {
switch (t) {
case 1:
return u.RS_BLOCK_TABLE[4 * (e - 1) + 0];

case 0:
return u.RS_BLOCK_TABLE[4 * (e - 1) + 1];

case 3:
return u.RS_BLOCK_TABLE[4 * (e - 1) + 2];

case 2:
return u.RS_BLOCK_TABLE[4 * (e - 1) + 3];

default:
return;
}
};
function d() {
this.buffer = new Array();
this.length = 0;
}
d.prototype = {
get: function(e) {
var t = Math.floor(e / 8);
return 1 == (this.buffer[t] >>> 7 - e % 8 & 1);
},
put: function(e, t) {
for (var o = 0; o < t; o++) this.putBit(1 == (e >>> t - o - 1 & 1));
},
getLengthInBits: function() {
return this.length;
},
putBit: function(e) {
var t = Math.floor(this.length / 8);
this.buffer.length <= t && this.buffer.push(0);
e && (this.buffer[t] |= 128 >>> this.length % 8);
this.length++;
}
};
var h = cc.Class({
extends: cc.Graphics,
properties: {
string: {
default: "Hello World!",
notify: function(e) {
this.string !== e && this.setContent();
}
},
backColor: {
type: cc.Color,
default: cc.Color.WHITE,
notify: function() {
this.setContent();
}
},
foreColor: {
type: cc.Color,
default: cc.Color.BLACK,
notify: function() {
this.node.color = this.foreColor;
this.setContent();
}
},
margin: {
type: cc.Float,
default: 10,
notify: function(e) {
e !== this.margin && this.setContent();
}
},
_size: 200,
size: {
type: cc.Float,
get: function() {
return this._size;
},
set: function(e) {
if (this._size !== e) {
this.node.setContentSize(e, e);
this.setContent();
this._size = e;
}
}
}
},
onLoad: function() {
this.node.setContentSize(this._size, this._size);
this.setContent();
},
setContent: function() {
this.clear();
this.fillColor = this.backColor;
var e = this.node.width, t = -e * this.node.anchorX, o = -e * this.node.anchorY;
this.rect(t, o, e, e);
this.fill();
this.close();
var i = new n(-1, 2);
i.addData(this.string);
i.make();
this.fillColor = this.foreColor;
for (var a = e - 2 * this.margin, s = i.getModuleCount(), c = a / s, r = a / s, l = Math.ceil(c), p = Math.ceil(r), u = 0; u < s; u++) for (var d = 0; d < s; d++) if (i.isDark(u, d)) {
this.rect(t + this.margin + d * c, t + a - r - Math.round(u * r) + this.margin, l, p);
this.fill();
}
}
});
cc.Class.Attr.setClassAttr(h, "lineWidth", "visible", !1);
cc.Class.Attr.setClassAttr(h, "lineJoin", "visible", !1);
cc.Class.Attr.setClassAttr(h, "lineCap", "visible", !1);
cc.Class.Attr.setClassAttr(h, "strokeColor", "visible", !1);
cc.Class.Attr.setClassAttr(h, "miterLimit", "visible", !1);
cc.Class.Attr.setClassAttr(h, "fillColor", "visible", !1);
t.exports = h;
cc._RF.pop();
}, {} ],
ChangeBindPhone: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "fbcf2kVdktFHrUCQR6vcXFE", "ChangeBindPhone");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.yPhoneNode = null;
t.xPhoneNode = null;
t.smsCodeNode = null;
t.pwdNode = null;
t.getCodeBtn = null;
t.getCodeTime = null;
return t;
}
t.prototype.start = function() {
wGameData.codeTime && wGameData.codeTime > 0 && this.getCode(wGameData.codeTime);
};
t.prototype.revisePhone = function() {
var e = this, t = this.yPhoneNode.string, o = this.xPhoneNode.string, n = this.pwdNode.string, i = this.smsCodeNode.string;
if (wUtils.checkMobile(t) && wUtils.checkMobile(o)) if (wUtils.checkPwd(n)) if (i) {
var a = {
telephone: t,
password: n,
newTelephone: o,
code: Number(i)
};
wNetWork.HttpRequest("Msg_User_changePhone", a, !0).then(function() {
wUIManager.showTips("更换成功", wUIManager.TIPS_OK);
var n = wGameData.getAllAccInfo();
for (var i in n) {
var a = n[i];
if (a.accInfo.uid == t) {
a.accInfo.uid = o;
a.info.isbind = o;
}
}
e.hide(!1);
}).catch(function() {});
} else wUIManager.showTips("请输入验证码"); else wUIManager.showTips("请输入正确的密码"); else wUIManager.showTips("请输入正确的手机号码");
};
t.prototype.getCode = function(e) {
var t = this;
this.getCodeTime.string = e + "秒后可重新获取";
this.getCodeBtn.active = !1;
this.schedule(function() {
if (--e <= 0) {
t.getCodeBtn.active = !0;
t.getCodeTime.string = "";
t.unscheduleAllCallbacks();
} else t.getCodeTime.string = e + "秒后可重新获取";
}, 1);
};
t.prototype.onClick = function(e, t) {
var o = this;
wAudioMgr.playBtnSound();
if ("ok" != t) if ("code" != t) ; else {
var n = this.xPhoneNode.string;
if (!wUtils.checkMobile(n)) {
wUIManager.showTips("请输入正确的手机号码");
return;
}
this.getCodeBtn.active = !1;
wNetWork.HttpRequest("Msg_User_getCode", {
telephone: n
}).then(function() {
wUIManager.showTips("发送成功", wUIManager.TIPS_OK);
wGameData.startCodeTime();
o.getCode(59);
});
} else this.revisePhone();
};
__decorate([ s(cc.EditBox) ], t.prototype, "yPhoneNode", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "xPhoneNode", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "smsCodeNode", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "pwdNode", void 0);
__decorate([ s(cc.Node) ], t.prototype, "getCodeBtn", void 0);
__decorate([ s(cc.Label) ], t.prototype, "getCodeTime", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
ChangeGuns: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "5bb0a7zuFpDh5Wnl1XH+D/t", "ChangeGuns");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.leftSp = null;
t.leftImg = null;
t.tips = null;
t.content = null;
t.img = [];
t.scrollView = null;
t.select = null;
return t;
}
t.prototype.init = function(e) {
var t = this;
this.cb = e.cb;
var o = !wGameData.getKey("monthcard");
this.select = this.content.children[e.idx];
for (var n = 0; n < 13; n++) {
var i = this.content.children[n], a = i.getChildByName("set"), s = i.getChildByName("get");
if (0 != n) {
i.getChildByName("s").active = !o;
i.getChildByName("m").active = o;
s.active = o;
} else a.active = e.idx != n;
a.on("click", this.onClick, this);
s.on("click", this.onClick, this);
o && 0 != n ? i.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.img[0] : n == e.idx ? i.getChildByName("img").getComponent(cc.Sprite).spriteFrame = this.img[1] : i.getChildByName("img").active = !1;
}
this.setLeft();
this.scheduleOnce(function() {
t.scrollView.scrollToOffset(cc.v2(248 * e.idx, 0));
});
};
t.prototype.setLeft = function() {
this.leftImg.spriteFrame = this.select.getChildByName("title").getComponent(cc.Sprite).spriteFrame;
var e = cc.find("s/spine", this.select).getComponent(sp.Skeleton);
this.leftSp.skeletonData = e.skeletonData;
this.leftSp.setAnimation(0, "standby", !0);
};
t.prototype.setSelect = function(e) {
this.select.getChildByName("img").active = !1;
this.select.getChildByName("set").active = !0;
this.select = e;
this.select.getChildByName("img").active = !0;
this.select.getChildByName("set").active = !1;
this.setLeft();
};
t.prototype.onClick = function(e) {
wAudioMgr.playBtnSound();
var t = e.node.name, o = e.node.parent.name;
switch (t) {
case "get":
this.hide(!1);
wViewMgr.openPage({
path: i.Config.ViewConfig.PrivilegeShop
});
break;

case "set":
if (o == this.select.name) {
wLog.i("选择的是同一个");
return;
}
this.setSelect(e.node.parent);
}
};
t.prototype.onHide = function() {
this.cb(Number(this.select.name));
};
__decorate([ c(sp.Skeleton) ], t.prototype, "leftSp", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "leftImg", void 0);
__decorate([ c(cc.Label) ], t.prototype, "tips", void 0);
__decorate([ c(cc.Node) ], t.prototype, "content", void 0);
__decorate([ c([ cc.SpriteFrame ]) ], t.prototype, "img", void 0);
__decorate([ c(cc.ScrollView) ], t.prototype, "scrollView", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase"
} ],
ChatTools: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "984fb7yZgJCIIXsmkQsbO72", "ChatTools");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e() {}
e.prototype.request = function(e) {
if (!wConstant.isDebug) {
var t = e.url, o = new XMLHttpRequest();
o.responseType = "json";
o.onload = function() {
if (200 === o.status) {
var t = o.response;
e.cb && e.cb(null, t);
} else e.cb && e.cb("请求失败", null);
};
o.onerror = function() {
setTimeout(function() {
e.cb && e.cb("连接超时", null);
}, 1e3);
};
o.timeout = 3e3;
o.ontimeout = function() {
e.cb && e.cb("请求超时", null);
};
o.open(e.method || "GET", t, !0);
var n = {
"Content-Type": "application/x-www-form-urlencoded"
};
for (var i in n) o.setRequestHeader(i, n[i]);
o.send();
}
};
e.prototype.GetServiceHead = function() {
var e = this;
return new Promise(function(t, o) {
var n = {
url: wConstant.getKFUrl + "/api/service/avatar",
method: "GET",
data: {},
cb: function(e, n) {
if (e) {
wLog.e("请求失败");
o();
} else if (200 != n.code) {
wLog.e("请求失败");
o();
} else t(n.data);
}
};
e.request(n);
});
};
e.prototype.GetChatList = function(e) {
var t = this;
return new Promise(function(o, n) {
var i = {
url: wConstant.getKFUrl + "/api/visitor/chat/service?visitorId=" + e,
method: "GET",
data: {},
cb: function(e, t) {
if (e) {
wLog.e("请求失败");
n();
} else if (200 != t.code) {
wLog.e("请求失败");
n();
} else o(t.data);
}
};
t.request(i);
});
};
e.prototype.GetMsgCount = function(e) {
var t = this;
return new Promise(function(o, n) {
var i = {
url: wConstant.getKFUrl + "/api/visitor/unread/count?visitorId=" + e,
method: "GET",
data: {},
cb: function(e, t) {
if (e) {
wLog.e("请求失败");
n();
} else if (200 != t.code) {
wLog.e("请求失败");
n();
} else o(t.data);
}
};
t.request(i);
});
};
return e;
}();
o.default = new n();
cc._RF.pop();
}, {} ],
Config: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b88ae4e6fZLa7xskF95baMx", "Config");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.Config = void 0;
(function(e) {
e.ViewConfig = {
AccountLogin: "Prefab/AccountLogin",
Register_RetrievePow: "Prefab/Register_RetrievePow",
AllAccount: "Prefab/AllAccount",
LoginCheck: "Prefab/LoginCheck",
SetPlayerInfo: "Prefab/SetPlayerInfo",
SoundOnOff: "Prefab/SoundOnOff",
SetHead: "Prefab/SetHead",
BankCheck: "Prefab/BankCheck",
Bank: "Prefab/Bank",
ChangeBindPhone: "Prefab/ChangeBindPhone",
MaintainGame: "Prefab/MaintainGame",
HotUpDateGame: "Prefab/HotUpDateGame",
GiveEvidence: "Prefab/GiveEvidence",
Mail: "Prefab/Mail",
MailDetails: "Prefab/MailDetails",
Ranking: "Prefab/Ranking",
SignIn: "Prefab/SignIn",
Privilege: "Prefab/Privilege",
PrivilegeShop: "Prefab/PrivilegeShop",
PrivilegeHelp: "Prefab/PrivilegeHelp",
PopUpNotice: "Prefab/PopUpNotice",
PlayerCheck: "Prefab/PlayerCheck",
Agent: "Agent/Agent",
AReceiveRecord: "Agent/AReceiveRecord",
APlayerInfo: "Agent/APlayerInfo",
ChangeGuns: "Game/BUYU/ChangeGuns/ChangeGuns",
BUYUSet: "Game/BUYU/BUYUSet/BUYUSet",
GamePlayerList: "Game/prefab/GamePlayerList",
GuestTips: "UICommon/GuestTips",
GameExitTips: "UICommon/GameExitTips",
UserAgreement: "UICommon/UserAgreement",
Knapsack: "Prefab/Knapsack",
PopUpNoticeTips: "Prefab/PopUpNoticeTips",
Service: "Prefab/Service",
WEB: "Prefab/WEB",
RankTips: "Prefab/RankTips"
};
var t;
(function(e) {
e[e.FISHING = 1] = "FISHING";
e[e.POKER = 2] = "POKER";
e[e.MULTI = 3] = "MULTI";
e[e.ARCADE = 4] = "ARCADE";
e[e.CASUAL = 5] = "CASUAL";
})(t = e.RoomType || (e.RoomType = {}));
(function(e) {
e.H = "横屏游戏";
e.V = "竖屏游戏";
})(e.SCREEN_DIR || (e.SCREEN_DIR = {}));
e.GamePrefab = {
10: {
type: t.FISHING,
prefabUrl: "prefab/XLDBMain",
zhName: "寻龙夺宝",
enName: "XLDB",
music: "sound/game_Fish_bgMusic_01",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(0, 360)
},
11: {
type: t.FISHING,
prefabUrl: "prefab/LKBYMain",
zhName: "捕鱼大亨",
enName: "LKPY",
music: "sound/bgm/room",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(0, 360)
},
12: {
type: t.FISHING,
prefabUrl: "prefab/JCBYMain",
zhName: "大闹天宫2",
enName: "JCBY",
music: "sound/bgm/buyuBgMusic1",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(0, 360)
},
13: {
type: t.FISHING,
prefabUrl: "prefab/DNTGMain",
zhName: "大闹天宫",
enName: "DNTG",
music: "sound/bgm/bgm1",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(0, 360)
},
3: {
type: t.MULTI,
prefabUrl: "prefab/HBSLMain",
zhName: "红包扫雷",
enName: "HBSL",
music: "sound/bgm",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 300),
noticePos2: cc.v2(0, 530),
dir: e.SCREEN_DIR.H
},
1: {
type: t.MULTI,
prefabUrl: "prefab/FQZSMain",
zhName: "飞禽走兽",
enName: "FQZS",
music: "sound/BACK_GROUND",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 315),
noticePos2: cc.v2(0, 265)
},
2: {
type: t.MULTI,
prefabUrl: "prefab/BRNNMain",
zhName: "百人牛牛",
enName: "BRNN",
music: "sound/BACK_GROUND",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(0, 295)
},
6: {
type: t.MULTI,
prefabUrl: "prefab/LHDMain",
zhName: "龙虎斗",
enName: "LHD",
music: "sound/bg",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 250),
noticePos2: cc.v2(-355, 270)
},
7: {
type: t.MULTI,
prefabUrl: "prefab/BCBMMain",
zhName: "奔驰宝马",
enName: "BCBM",
music: "sound/BACK_GROUND",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 305),
noticePos2: cc.v2(0, 250)
},
8: {
type: t.MULTI,
prefabUrl: "prefab/BJLMain",
zhName: "欢乐30秒",
enName: "BJL",
music: "sound/BACK_GROUND",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(-235, 295)
},
9: {
type: t.MULTI,
prefabUrl: "prefab/SDBMain",
zhName: "十点半",
enName: "SDB",
music: "sound/bgm/BACK_GROUND",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 307),
noticePos2: cc.v2(0, 355)
},
29: {
type: t.MULTI,
prefabUrl: "prefab/HLZZMain",
zhName: "欢乐至尊",
enName: "HLZZ",
music: "sound/bgm",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 230),
noticePos2: cc.v2(0, 355)
},
4: {
type: t.MULTI,
prefabUrl: "prefab/SLWHMain",
zhName: "森林舞会",
enName: "SLWH",
music: "sound/bg",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 230),
noticePos2: cc.v2(0, 355)
},
14: {
type: t.POKER,
prefabUrl: "prefab/QZNNMain",
zhName: "抢庄牛牛",
enName: "QZNN",
music: "sound/bgm/bgm_bg",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(-195, 300)
},
15: {
type: t.POKER,
prefabUrl: "prefab/ERNNMain",
zhName: "二人牛牛",
enName: "ERNN",
music: "sound/bgm/bgm_bg",
table: !0,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 285),
noticePos2: cc.v2(-195, 300)
},
19: {
type: t.POKER,
prefabUrl: "prefab/DZPKMain",
zhName: "德州扑克",
enName: "DZPK",
music: "sound/back",
table: !1,
loadMaxSpeed: !1,
noticePos1: cc.v2(0, 294),
noticePos2: cc.v2(-195, 300)
},
20: {
type: t.POKER,
prefabUrl: "prefab/ZJHMain",
zhName: "炸金花",
enName: "ZJH",
music: "sound/0_BGM",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 294),
noticePos2: cc.v2(0, 300)
},
21: {
type: t.POKER,
prefabUrl: "prefab/SRNNMain",
zhName: "四人牛牛",
enName: "SRNN",
music: "sound/bgm/bgm_bg",
table: !0,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(-195, 300)
},
18: {
type: t.POKER,
prefabUrl: "prefab/TBNNMain",
zhName: "通比牛牛",
enName: "TBNN",
music: "sound/bgm/bgm_bg",
table: !0,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(-195, 300)
},
16: {
type: t.POKER,
prefabUrl: "prefab/HLWZMain",
zhName: "欢乐五张",
enName: "HLWZ",
music: "sound/bgm",
table: !0,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(-195, 300)
},
17: {
type: t.POKER,
prefabUrl: "prefab/ERQSGame",
zhName: "二人雀神",
enName: "ERQS",
music: "sound/erqs_bg",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(-195, 300)
},
28: {
type: t.POKER,
prefabUrl: "prefab/WZMJMain",
zhName: "温州麻将",
enName: "WZMJ",
music: "sound/bgm",
table: !0,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(-195, 300)
},
22: {
type: t.ARCADE,
prefabUrl: "prefab/JXLWMain",
zhName: "九线拉王",
enName: "JXLW",
music: "sound/music-tiger-bg",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(-138, 280)
},
23: {
type: t.ARCADE,
prefabUrl: "prefab/SHZMain",
zhName: "水浒传",
enName: "SHZ",
music: "sound/sound_water_bg",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 262),
noticePos2: cc.v2(0, 300)
},
26: {
type: t.ARCADE,
prefabUrl: "prefab/DFDCMain",
zhName: "多福多财",
enName: "DFDC",
music: "sound/sound-bg",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(0, 365)
},
1e3: {
zhName: "麻将合集",
enName: "MJHJ",
music: "sound/bgm/bgm1",
table: !1,
loadMaxSpeed: !0,
noticePos1: cc.v2(0, 351),
noticePos2: cc.v2(0, 360)
}
};
e.local_Event = {
login_Success: "login_Success",
up_Gold: "up_Gold",
up_Nickname: "up_Nickname",
up_Head: "up_Head",
up_HeadFrame: "up_HeadFrame",
bind_Phone: "bind_Phone",
bind_Agent: "bind_Agent",
setGameBankBtn: "setGameBankBtn",
mailHD: "MailHD",
sginHD: "sginHD",
up_Excard: "up_Excard",
up_Mcard: "up_Mcard",
changeTable: "changeTable"
};
e.colorSet = {
ash: cc.color(140, 140, 140),
white: cc.color(255, 255, 255)
};
e.NoTipsMsg = {
Msg_Hall_GetBenefits: 1,
Msg_Hall_QueryUserInfo: 1
};
e.NoLogMsg = {
Msg_Hall_Heart: 1,
Msg_Game_Jackpot: 1,
Msg_Hall_HorseLamp: 1
};
e.DeBugGame = [ 22, 26, 23, 25, 24, 36, 38, 37, 39, 40 ];
e.GameConfig = {
11: {
1: 0,
2: 1e4,
3: 1e5,
4: 1e6,
5: 5e6
},
12: {
1: 0,
2: 1e4,
3: 1e5,
4: 1e6,
5: 5e6
},
13: {
1: 0,
2: 1e4,
3: 1e5,
4: 1e6,
5: 5e6
},
3: {
5: 0
},
1: {
5: 0
},
2: {
5: 0
},
6: {
5: 0
},
7: {
5: 0
},
8: {
5: 0
},
9: {
5: 0
},
29: {
5: 0
},
4: {
5: 0
},
14: {
1: 0,
2: 5e5,
3: 1e6,
4: 25e5,
5: 5e6
},
15: {
1: 0,
2: 1e3,
3: 1e5,
4: 1e6,
5: 1e7
},
19: {
1: 0,
2: 1e6,
3: 5e6
},
20: {
1: 0,
2: 5e4,
3: 5e5,
4: 5e6
},
21: {
1: 0,
2: 1e3,
3: 1e5,
4: 1e6
},
18: {
1: 0,
2: 1e5,
3: 4e5,
4: 2e6
},
16: {
1: 0,
2: 1e3,
3: 5e5,
4: 1e6,
5: 5e6
},
17: {
1: 0,
2: 1e5,
3: 5e6,
4: 2e7
},
28: {
1: 0,
2: 1e4,
3: 1e5,
4: 2e6
},
22: {
1: 0,
2: 5e4,
3: 5e4,
4: 1e5,
5: 1e6
},
23: {
1: 0,
2: 1e3,
3: 5e3,
4: 1e4,
5: 1e5
},
26: {
2: 0,
3: 0,
4: 0,
5: 0
}
};
})(o.Config || (o.Config = {}));
cc._RF.pop();
}, {} ],
ConfirmBox_B: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "3a3cd4HcJxFAapkC+t5lscV", "ConfirmBox_B");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.okBtn = null;
t.cb = null;
t.T = null;
t.animNode = null;
return t;
}
t.prototype.init = function(e) {
var t = this.okBtn.getChildByName("label").getComponent(cc.Label);
Object.prototype.hasOwnProperty.call(e, "openRClose") ? this.main.getChildByName("close").active = e.openRClose : this.main.getChildByName("close").active = !0;
Object.prototype.hasOwnProperty.call(e, "okTips") ? t.string = e.okTips : t.string = "是";
if (Object.prototype.hasOwnProperty.call(e, "djsTime")) {
var o = this.okBtn.getComponent(cc.Button);
o.interactable = !1;
t.string = "3";
var n = 3;
this.schedule(function() {
t.string = "" + --n;
1 == n ? o.interactable = !0 : 0 == n && (t.string = "是");
}, 1, 2);
}
this.T = e;
var i = "";
1 == e.type ? i = "<color=#ffffff>您有</c><color=#DDDA89>" + e.gold + "</c><color=#ffffff>欢乐豆已经到账,\n您可以通过取款或银行查收！祝您游戏愉快，财源广进！</color>" : 2 == e.type ? i = "<color=#ffffff>您成功充值月卡</c><color=#DDDA89>30</c><color=#ffffff>天。</c><color=#DDDA89>\n" + e.gold + "</c><color=#ffffff>欢乐豆已到账，可通过银行查收！\n祝您好运连连，财源广进！</color>" : 3 == e.type && (i = "<color=#ffffff>温馨提示：体验场每次进入都会提供</c><color=#16F016>1000w</c><color=#ffffff>欢乐豆供您体验，退出房间后清零。</color>");
this.content.string = i;
};
t.prototype.onHide = function() {
this.node.destroy();
this.cb && this.cb();
};
t.prototype.okOnClick = function() {
this.cb = this.T.okCB;
this.hide(!1);
wAudioMgr.playBtnSound();
};
t.prototype.cancelOnClick = function() {
this.cb = this.T.cancelCB;
this.hide();
wAudioMgr.playCloseSound();
};
t.prototype.show = function(e) {
var t = this;
this.init(e);
this.background.opacity = 0;
this.background.active = !0;
this.main.opacity = 0;
this.main.active = !0;
this.node.active = !0;
this.main.scale = 1;
var o = cc.fadeTo(.04, 255), n = cc.scaleTo(.1, 1.1).easing(cc.easeIn(1)), i = cc.scaleTo(.1, 1).easing(cc.easeIn(1)), a = cc.spawn(o, n), s = cc.callFunc(function() {
1 != t.T.type && 2 != t.T.type || t.showAnim();
}), c = cc.sequence(a, i, s);
this.main.runAction(c);
};
t.prototype.hide = function() {
var e = this, t = cc.fadeTo(.1, 0), o = cc.callFunc(function() {
e.node.opacity = 255;
e.onHide();
}), n = cc.sequence(t, o);
this.node.runAction(n);
};
t.prototype.showAnim = function() {
var e = this;
cc.director.getPhysicsManager().enabled = !0;
this.animNode.active = !0;
for (var t = this.animNode.getChildByName("list"), o = 0; o < 460; o++) {
var n = Math.floor(o / 2);
this.scheduleOnce(function() {
var o = cc.instantiate(e.animNode.children[0]);
o.active = !0;
o.parent = t;
o.scale = wUtils.random(9, 13) / 10;
o.angle = wUtils.random(-5, 5);
o.y += wUtils.random(0, 300);
o.x = wUtils.random(-800, 800);
}, .01 * n);
}
};
t.prototype.onDestroy = function() {
cc.director.getPhysicsManager().enabled = !1;
};
__decorate([ s(cc.RichText) ], t.prototype, "content", void 0);
__decorate([ s(cc.Node) ], t.prototype, "okBtn", void 0);
__decorate([ s(cc.Node) ], t.prototype, "animNode", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
ConfirmBox: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "d9e84Epr3FO8610AFIu+R/4", "ConfirmBox");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.okBtn_a = null;
t.okBtn_b = null;
t.cb = null;
t.T = null;
return t;
}
t.prototype.init = function(e) {
this.content.string = e.content || "";
var t = this.okBtn_a.getChildByName("label").getComponent(cc.Label);
Object.prototype.hasOwnProperty.call(e, "openRClose") ? this.main.getChildByName("close").active = e.openRClose : this.main.getChildByName("close").active = !0;
this.main.getChildByName("title").getComponent(cc.Label).string = e.title || "";
Object.prototype.hasOwnProperty.call(e, "okTips") ? t.string = e.okTips : t.string = "是";
Object.prototype.hasOwnProperty.call(e, "horizntalAlign") ? this.content.horizontalAlign = e.horizntalAlign : this.content.horizontalAlign = cc.Label.HorizontalAlign.LEFT;
Object.prototype.hasOwnProperty.call(e, "ok_b_open") ? this.okBtn_b.active = e.ok_b_open : this.okBtn_b.active = !1;
t = this.okBtn_b.getChildByName("label").getComponent(cc.Label);
Object.prototype.hasOwnProperty.call(e, "ok_b_Tips") ? t.string = e.ok_b_Tips : t.string = "是";
if (Object.prototype.hasOwnProperty.call(e, "djsTime")) {
var o = this.okBtn_a.getComponent(cc.Button);
o.interactable = !1;
t.string = "3";
var n = 3;
this.schedule(function() {
t.string = "" + --n;
1 == n ? o.interactable = !0 : 0 == n && (t.string = "是");
}, 1, 2);
}
this.T = e;
};
t.prototype.onHide = function() {
this.cb && this.cb();
};
t.prototype.ok_a_OnClick = function() {
this.cb = this.T.okCB;
this.hide(!1);
wAudioMgr.playBtnSound();
};
t.prototype.ok_b_OnClick = function() {
this.cb = this.T.ok_b_CB;
this.hide(!1);
wAudioMgr.playBtnSound();
};
t.prototype.cancelOnClick = function() {
this.cb = this.T.cancelCB;
this.hide();
wAudioMgr.playCloseSound();
};
t.prototype.show = function(e) {
this.init(e);
this.background.opacity = 0;
this.background.active = !0;
this.main.opacity = 0;
this.main.active = !0;
this.node.active = !0;
this.main.scale = 1;
var t = cc.fadeTo(.04, 255), o = cc.scaleTo(.1, 1.1).easing(cc.easeIn(1)), n = cc.scaleTo(.1, 1).easing(cc.easeIn(1)), i = cc.spawn(t, o), a = cc.sequence(i, n);
this.main.runAction(a);
};
t.prototype.hide = function() {
var e = this;
this.onHide();
var t = cc.fadeTo(.1, 0), o = cc.callFunc(function() {
e.node.opacity = 255;
e.node.active = !1;
}), n = cc.sequence(t, o);
this.node.runAction(n);
};
__decorate([ s(cc.Label) ], t.prototype, "content", void 0);
__decorate([ s(cc.Node) ], t.prototype, "okBtn_a", void 0);
__decorate([ s(cc.Node) ], t.prototype, "okBtn_b", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
Constant: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "bb6aeENx89FYofUeIs1IxZw", "Constant");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.randomName = o.Constant = o.ServiceListID = o.ServerConfig = void 0;
o.ServerConfig = {
NWC: {
hotUpDateUrl: "http://localhost:8000/hotupdate/",
httpServer: "http://localhost:8000/",
webServer: "ws://localhost:10000"
},
gameWEB: {
platform: 1,
hotUpDateUrl: "http://localhost:8000/hotupdate/",
gameHotUpDateUrl: "http://localhost:8000/hotupdate/",
KF_AZ_Url: "http://localhost:8000/",
getKFUrl: "http://localhost:9002/",
httpServer: "http://localhost:8000/",
webServer: "ws://localhost:10000"
},
gdjmqeb: {
platform: 5,
hotUpDateUrl: "http://localhost:8000/hotupdate/",
gameHotUpDateUrl: "http://localhost:8000/hotupdate/",
KF_AZ_Url: "http://localhost:8000/",
getKFUrl: "http://localhost:9002/",
httpServer: "http://localhost:8000/",
webServer: "ws://localhost:10000",
D_KEY: ""
},
sxqeb: {
platform: 1,
hotUpDateUrl: "http://localhost:8000/hotupdate/",
gameHotUpDateUrl: "http://localhost:8000/hotupdate/",
KF_AZ_Url: "http://localhost:8000/",
getKFUrl: "http://localhost:9002/",
httpServer: "http://localhost:8000/",
webServer: "ws://localhost:10000",
D_KEY: ""
},
lllqeb: {
platform: 5,
hotUpDateUrl: "http://localhost:8000/hotupdate/",
gameHotUpDateUrl: "http://localhost:8000/hotupdate/",
KF_AZ_Url: "http://localhost:8000/",
getKFUrl: "http://localhost:9002/",
httpServer: "http://localhost:8000/",
webServer: "ws://localhost:10000",
D_KEY: ""
},
sxtest: {
platform: 1,
hotUpDateUrl: "http://localhost:8000/hotupdate/",
gameHotUpDateUrl: "http://localhost:8000/hotupdate/",
KF_AZ_Url: "http://localhost:8000/",
getKFUrl: "http://localhost:9002/",
httpServer: "http://localhost:8000/",
webServer: "ws://localhost:10000",
D_KEY: ""
}
};
o.ServiceListID = {
kfzx: 1,
czkf: 1,
cztskf: 1,
tsjykf: 1,
logokf: 1
};
var n = function() {
function e() {
this.arcadeSceneData = null;
this.isDebug = !1;
this.platformType = {
1: [ "728游戏", "https://www.728game.org", "https://t.me/youxi728" ],
2: [ "一言棋牌", "https://www.728game.org", "https://t.me/youxi728" ],
3: [ "850游戏", "https://www.728game.org", "https://t.me/youxi728" ],
4: [ "玖玖壹游戏" ],
5: [ "728游戏", "https://www.728game.com", "https://t.me/youxi728" ]
};
this.platform = o.ServerConfig[e.serverType].platform;
this.getKFUrl = o.ServerConfig[e.serverType].getKFUrl;
this.gameHotUpDateUrl = o.ServerConfig[e.serverType].gameHotUpDateUrl;
this.hotUpDateUrl = o.ServerConfig[e.serverType].hotUpDateUrl;
this.httpServer = o.ServerConfig[e.serverType].httpServer;
this.webServer = o.ServerConfig[e.serverType].webServer;
this.D_KEY = o.ServerConfig[e.serverType].D_KEY;
this.KF_AZ_Url = o.ServerConfig[e.serverType].KF_AZ_Url;
this.R_S_List = {};
this.autoLogin = !1;
this.isCheckHotUp = !1;
this.autoReconnect = 30;
this.token = "";
this.nLevel = 3;
this.openScene = "Main";
this.gameStatus = 0;
this.maxTable = 50;
this.chatCount = {
serviceOne: 0,
other: 0
};
}
e.serverType = "sxqeb";
return e;
}();
o.Constant = n;
o.randomName = function() {
for (var e = "子车语柔鄢湛静端婉丽肥俊拔贸渟袁晴丽功晗玥皇甫山蝶晋颖秀碧鲁晓博闪飞阳\n    明冷玉惠延黄青柏厉月杉盈茜古彦灵称智宸荆骊婧隽辰龙仆姝好仍冬卉六幻翠宜霞雰\n    摩晓曼麻雪枫尧琬琰学德运邸津温新瑶哈艾苍吉星焉涵煦盍歌韵九初蓝梁丘嘉荣屠湛\n    恩权竹筱柔子昂捷笑阳龚筠心仰凌兰旅嘉庆粘友叔慕梅兰鹏云恭阳羽洋曼彤禽如云芒\n    傲薇南门听云承琬凝潘芊丽谷夜玉藩寻梅仁若薇劳暄和戈修能枚雅彤宫晓丝隋和歌广\n    如容励忆之仲孙燕岚阮白凡赖升闽南晴白静安皋浦和刀彬彬喜盼易江煦茂欣荣关白亦\n    邬云岚阳华采怀炳太史晴丽理琦珍骑灵松赏依薇蓬司辰罕含玉钟卓然尚娥赫春柏简暖\n    梦速素欣休晓灵仙颖初首天蓉环怀寒范珠星庆艳芳释白萱慈清奇伏洋晏易槐韦成化伊\n    承悦麴锋蒿天睿衅晟俟梦影佘珺琪玉燕舞竭巧香康映雪牟妍歌邝绮山郑怡月帛运鸿由\n    绿蝶尉云飞盛怀芹施文惠宾静竹庞雅柔诸葛悠逸俎豫延颖馨佟辰赛婉清道南风虢昊天\n    阙心思永以冬姜向露都曦夹谷晴曦谈隽拱若申瑾度雁风督天曼其玲琅申屠映菱历雅柔\n    羿松月马佳傲柏邱力行镇夜蓉郜夜柳门歌柳祺福亥飞柏鄞聪慧方微熹殷昊乾黎智杰代\n    骊媛戚静云爱夏蓉郁小之始经同映天蚁清懿员雅懿无清雅李成周铎慧智满初曼岳半梅\n    官乐山裘听枫仵香萱运语心塞智纯裴琛瑞念欣荣边弘方依嘉歆梁怀桃昔碧玉户子芸招\n    梦香酆易梦东郭珠水访波合清悦弓雨安宣安青路一少辰阳贯从凝鲁灵通初阳徭驰鸿孛\n    俊材张廖千易贲坤出伟泽考天宇敬忆雪任溶吾香洁望冰绿常栋睦丝柳司建章位娟娟郸\n    灵松汝晗蕾花怀薇牢泽洋成幼怡堂以筠谌山槐訾湛娟中云化春晓隐元容柴晓兰闻茵茵\n    公孙思菱城柔婉候绣希雨双平欣合钟离问风泰育宝雅柔穆忆敏羊舌运恒师怀扬畅虎悠\n    馨板文校鸿云浦雪曼南宫宛亦戎志新刑菀菀曹夏菡蹉唱表旺甲梦丝泣鹏海生雅彤容南\n    蕾法攸钦一雯笃忆丹将俊侠隗灿修昕妤占含之孔紫菱濮阳芸欣赫连一南福冷珍势秀慧\n    亢思萌褒如松别淼淼宋春桃尉迟晨希卢元姓傲安区芷蝶让幻竹扈萝桐寄云夕晓蕾那实\n    忻寄风彭慧雅费莫绮兰友安民仉乐康浑舒长孙卿空文耀璩和雅郎默逄寄文闫巧云圣昂\n    然蔡馨母鸿运於夜南光子杨霞月偶高雅冼曼安宦舞公良阳曦章佳雪兰陀嘉云詹鸿煊磨\n    淑穆系醉山金忆梅斛秀娟瞿忻愉段干昕杞湛蓝绍梦蕊力夏寒翦方雅司空谷云左悠溥水\n    凡暴允晨烟珑玲腾韵诗遇萧库念巧公羊灵珊战平春薄芳蔼闾清宁曲元勋勤坚白闳梓萱\n    覃其雨昂欣嘉党从凝老沈思买颖慧奇君丽源温书过觅翠臧怀曼辜诗翠刚萦怀言紫桐滕\n    念桃毋冰洁尤存阎友灵苑康德鞠秋双芳润有烨磊僪采佴寄容智思天百锐进孝诗翠郭芷\n    珊朋雪晴陶珑步天骄农琰琬肖又莲舜开霁粟光济微生妮娜敖妙颜胥欢悦求景彰孟霞飞\n    狄忻慕藏英博第璎玑检曜曦改曼青相依秋才访文俞凡白束鹏程厍怡乐充访烟信天骄甘\n    又亦抗诚沈阳普嘉美计惜芹不暮芸越德泽宓凝芙漆雕蓓蕾贵湛蓝受尔蝶程半蕾拜佁然\n    耿螺何元魁禾如冰宇绮梦巧鸿文逯古兰桓碧蓉莱代灵妫傲白欧阳迎夏伦卿云翠胤骞况\n    润丽丑婷美蒯倚云万俟思萱那拉骊洁辛暄美颜修真么慕熊婉静大芷荷丙颖馨姒惜玉慕\n    容良畴巨恬雅纵和光经名姝豆春冬融兴言壤驷斯巩水荷载家馨卜沛性恨桃冉忆安窦问\n    梅长琭虞诗晗盘妙珍禄安怡戢凯歌似依丝尹俊美旁若山毛映秋屈孤容肇清懿宰父水风\n    韩雅隽段以蕊叶合美祁欣悦接晏然戴闵雨牧沛凝闭鹏煊析俊豪锐濡霈丰小晨佟佳正初\n    东昊磊齐彤云伍醉冬紫含娇问含巧所冬灵盖明亮仲可儿封从丹海鸿哲以月桃犹妙芙霍\n    成荫浮驰车慕诗圭雅琴东门敬曦本秀美兴和顺郝白枫百里柔怀伯俊杰弘运鹏卷炫闾丘\n    雁凡睢凝冬瓮绮美寇寻巧端木信瑞南瀚玥泉香春邹景明湛永思青锦欣泷浩邈彤涵局雁\n    芙乌迎曼奕婉召锐思咎鸿骞苗海之林痴瑶北迎彤完颜和悦喻向松安寄蓝寸敏练英发匡\n    沛容登和怡祝骏阿斯乔翟谷梦终清逸罗湛芳敛曲费春桃仪鸿运于婉容丛孟夏冠忆梅乌\n    雅晔衷笑雯呼延凌丝谬采南蔺叶彤台佳文芮炎彬在鸿煊貊暄玲云春梅脱敏叡童锐哀绮\n    琴舒彭湃祢盼翠乔涵涵邛问寒嘉和静禚飞飙弥乐双宇文念柏允秋柔剑昆杰殳熠彤真代\n    郦专晁寒烟饶采白强凌柏郁涵润羽长菁凌新翰革颜乘青前慧美衡偲偲士清怡原昕靓唐\n    晨旭储开朗吉诗柳牵发夔修诚楚飞松史忆枫陆英悟但博雅娄冷松植寻绿靳晓慧薛凝丝\n    危慕山硕永康香乐成己宛秋愚曲静红浩荡苌和硕邴玟玉塔涵易上官华乐井添智索安荷\n    赤飞兰巴菁菁闵冰蝶徐鸿熙阚梦兰奉熙怡卞思真厚采文公叔学文凭天心钮元龙靖云逸\n    颛孙康复树德泽止嘉禾素盼夏朴小楠祭幻巧聂明旭糜雅香书萌阳汲康胜干布应腾綦芮澜洛正志凤会养浩博戏晴画裔蓝尹威秀筠墨月朗鱼薇歌魏苑杰贾迎海卫欣跃及承教汉水瑶多颀赧绮丽侍萍韵类苑玄宏伟支新蕾谭飞鹏慕合初紫易侨翠琴刁鸿晖斯代玉夙慕梅郏易文说志仇莞然节馥芬钱安娜逢乾眭梅荀洁雀波涛乜秋荣线银瑶贝忆南庄夏山诺彦慎夏彤山如南宿一凡稽清逸朱寒凝苏奇伟万曼丽华高驰弭谷之丁恨风谢琪睿驹凝洁籍驰雪贰昊东星饮香利迎梅萧昆锐夏侯雅素礼韵梅进言田欣然缑冷菱秦蓓樊惜香留潍解谷蕊楼烨煜姬映颖委翰池鲍澜邗凡霜钭霜布兴生资乐圣房鸣渠芝兰崔觅荷毓雨安奈明俊赵玉泽琦辰韦司马韫玉易恨瑶恽施诗公西玛丽悉雅洁营博远牛淳雅栾曼蔓诗梦凡坚清秋冷恨竹滑文丽示闳邶赞府英叡壬绿兰仝欣艳习鹏池从骊霞严亦凝桑青易回南烟狂天青冒令锋蒲元绿董彦芝飞立诚嵇澹聊含之菅成业陈安顺印鸿飞集晓彤周子实乙锦诗守宏畅繁悦人德会雯秘爰美诸旷宁大班芳洲蹇友安歧鹏鲸蒙甫千雁芙尔曾琪须莹玉羊春岚游冬雪宗政逸馨茅杰毕念双沐书萱清令婧斋若骞暨英飙甫元洲濮寄容保梦秋竺凝然声同和丹天骄席欣愉吕嘉禧佛葛菲卓曼冬向新之绳正豪京飞槐松英毅左丘惜玉矫寻菱英晗蕾沃高朗开桃艾诗柳衣路亓烨华居霞冀陶然迟霞姝霜智晖郗雄勇宏放潭琦巧闻人绿竹柯紫文欧婉慧箕庆雪独明辉后泰华公冶乐邦元洲森纶包梦晨燕含烟茆运骏昌达却婷美谷梁思聪茹盼孙恬欣季林沙冰彦年琳瑜后秋柔镜香之尾霞绮雷含灵钞思楠畅浩浩鲜于书萱藤福善骞北龙宝漆骊红皇依珊鲜友栗舒兰时芳菲机俊良业善字夏蓉宏慕凝笪芷文和代芙寒蕴是清芬皮光临蒋正卿宰芦蒉欣怿邓智敏杭思佳介白秋义忆曼郯宛白谏惜珊庹启澄铭晨佼童彤贡芳茵辉苗东方璇娟祖兰梦实傲霜频莲掌之轩辕秋白剧鹏赋纳同光错梧符婉淑钊博赡亓官宜民马惠勾雨信麦西连悠雅淳于醉柳謇惜寒辟毅君家宇范姜燕桦夷沛槐项芳华章宛凝褚忆柏典傲易禹碧琴逮子美春听露穰英纵国涵蕾蛮跃莘星", t = wUtils.random(4, 6), o = "", n = 0; n < t; n++) {
var i = e[wUtils.random(0, e.length - 1)];
"\n" != i && " " != i ? o += i : --n;
}
return o;
};
cc._RF.pop();
}, {} ],
CountUp: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "7c7c2EMGKpERYYYsAi0rT66", "CountUp");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.CountUp = void 0;
var n = function() {
function e(e, t, o) {
var n = this;
this.target = e;
this.endVal = t;
this.options = o;
this.version = "2.0.7";
this.defaults = {
startVal: 0,
decimalPlaces: 0,
duration: 2,
useEasing: !0,
useGrouping: !0,
smartEasingThreshold: 999,
smartEasingAmount: 333,
separator: ",",
decimal: ".",
prefix: "",
suffix: ""
};
this.startTime = null;
this.remaining = 0;
this.finalEndVal = null;
this.useEasing = !0;
this.countDown = !1;
this.callback = null;
this.error = "";
this.startVal = 0;
this.duration = 2;
this.paused = !0;
this.count = function(e) {
n.startTime || (n.startTime = e);
var t = e - n.startTime;
n.remaining = n.duration - t;
n.useEasing ? n.countDown ? n.frameVal = n.startVal - n.easingFn(t, 0, n.startVal - n.endVal, n.duration) : n.frameVal = n.easingFn(t, n.startVal, n.endVal - n.startVal, n.duration) : n.countDown ? n.frameVal = n.startVal - (n.startVal - n.endVal) * (t / n.duration) : n.frameVal = n.startVal + (n.endVal - n.startVal) * (t / n.duration);
n.countDown ? n.frameVal = n.frameVal < n.endVal ? n.endVal : n.frameVal : n.frameVal = n.frameVal > n.endVal ? n.endVal : n.frameVal;
n.frameVal = Number(n.frameVal.toFixed(n.options.decimalPlaces));
n.printValue(n.frameVal);
t < n.duration ? n.rAF = requestAnimationFrame(n.count) : null !== n.finalEndVal ? n.update(n.finalEndVal) : n.callback && n.callback();
};
this.formatNumber = function(e) {
var t, o, i, a, s, c = e < 0 ? "-" : "";
t = Math.abs(e).toFixed(n.options.decimalPlaces);
i = (o = (t += "").split("."))[0];
a = o.length > 1 ? n.options.decimal + o[1] : "";
if (n.options.useGrouping) {
s = "";
for (var r = 0, l = i.length; r < l; ++r) {
0 !== r && r % 3 == 0 && (s = n.options.separator + s);
s = i[l - r - 1] + s;
}
i = s;
}
var p = n.options.numerals || [];
if (p && p.length) {
i = i.replace(/[0-9]/g, function(e) {
return p[+e];
});
a = a.replace(/[0-9]/g, function(e) {
return p[+e];
});
}
return c + n.options.prefix + i + a + n.options.suffix;
};
this.easeOutExpo = function(e, t, o, n) {
return o * (1 - Math.pow(2, -10 * e / n)) * 1024 / 1023 + t;
};
this.options = Object.assign(this.defaults, o);
this.formattingFn = this.options.formattingFn ? this.options.formattingFn : this.formatNumber;
this.easingFn = this.options.easingFn ? this.options.easingFn : this.easeOutExpo;
this.endVal = this.validateValue(t);
var i = Number(this.options.startVal || this.endVal);
this.startVal = this.validateValue(i);
this.frameVal = this.startVal;
var a = this.options.decimalPlaces || 0;
this.options.decimalPlaces = Math.max(0, a);
this.resetDuration();
this.options.separator = String(this.options.separator);
this.options.useEasing = this.options.useEasing || !1;
this.useEasing = this.options.useEasing;
"" === this.options.separator && (this.options.useGrouping = !1);
this.el = e;
this.el ? this.printValue(this.startVal) : this.error = "[CountUp] target is null or undefined";
}
e.prototype.determineDirectionAndSmartEasing = function() {
var e = this.finalEndVal ? this.finalEndVal : this.endVal;
this.countDown = this.startVal > e;
var t = e - this.startVal;
this.options.smartEasingThreshold = this.options.smartEasingThreshold || 0;
this.options.smartEasingAmount = this.options.smartEasingAmount || 0;
if (Math.abs(t) > this.options.smartEasingThreshold) {
this.finalEndVal = e;
var o = this.countDown ? 1 : -1;
this.endVal = e + o * this.options.smartEasingAmount;
this.duration = this.duration / 2;
} else {
this.endVal = e;
this.finalEndVal = null;
}
if (this.finalEndVal) this.useEasing = !1; else {
this.options.useEasing = this.options.useEasing || !1;
this.useEasing = this.options.useEasing;
}
};
e.prototype.start = function(e) {
if (!this.error) {
e && (this.callback = e);
if (this.duration > 0) {
this.determineDirectionAndSmartEasing();
this.paused = !1;
this.rAF = requestAnimationFrame(this.count);
} else this.printValue(this.endVal);
}
};
e.prototype.pauseResume = function() {
if (this.paused) {
this.startTime = null;
this.duration = this.remaining;
this.startVal = this.frameVal;
this.determineDirectionAndSmartEasing();
this.rAF = requestAnimationFrame(this.count);
} else cancelAnimationFrame(this.rAF);
this.paused = !this.paused;
};
e.prototype.reset = function() {
cancelAnimationFrame(this.rAF);
this.paused = !0;
this.resetDuration();
var e = Number(this.options.startVal || this.endVal);
this.startVal = this.validateValue(e);
this.frameVal = this.startVal;
this.printValue(this.startVal);
};
e.prototype.update = function(e) {
cancelAnimationFrame(this.rAF);
this.startTime = null;
this.endVal = this.validateValue(e);
if (this.endVal !== this.frameVal) {
this.startVal = this.frameVal;
this.finalEndVal || this.resetDuration();
this.finalEndVal = null;
this.determineDirectionAndSmartEasing();
this.rAF = requestAnimationFrame(this.count);
}
};
e.prototype.printValue = function(e) {
cc.isValid(this.el, !0) && (this.el.string = this.formattingFn(e));
};
e.prototype.ensureNumber = function(e) {
return "number" == typeof e && !isNaN(e);
};
e.prototype.validateValue = function(e) {
var t = Number(e);
if (this.ensureNumber(t)) return t;
this.error = "[CountUp] invalid start or end value: " + e;
return 0;
};
e.prototype.resetDuration = function() {
this.startTime = null;
this.duration = 1e3 * Number(this.options.duration);
this.remaining = this.duration;
};
return e;
}();
o.CountUp = n;
cc._RF.pop();
}, {} ],
Deposit: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "11b42SBUrNKbqJiNYeNZl5+", "Deposit");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.showPage = null;
t.gold = null;
t.bankGold = null;
t.inputGold = null;
t.slider = null;
t.progress = null;
t.dxGold = null;
t.depositNum = 0;
t.Handle = null;
return t;
}
t.prototype.onLoad = function() {
this.node.on("toggle", this.toggle, this);
wGEvent.on("local_Event", this.local_Event, this);
this.init();
this.Handle = this.progress.node.getChildByName("Handle");
var e = this.Handle.getChildByName("jd");
this.Handle.on(cc.Node.EventType.TOUCH_START, function() {
wGameData.getKey("gold") <= 0 && wUIManager.showTips("可取款金额为0");
e.active = !0;
}, this);
this.Handle.on(cc.Node.EventType.TOUCH_END, function() {
e.active = !1;
}, this);
this.Handle.on(cc.Node.EventType.TOUCH_CANCEL, function() {
e.active = !1;
}, this);
};
t.prototype.init = function() {
this.gold.string = wUtils.numConvert(wGameData.getKey("gold"));
this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank"));
};
t.prototype.editboxEvent = function(e) {
var t = Number(e.string) || 0;
if (wGameData.getKey("gold") <= 0) {
this.inputGold.string = "";
this.inputGold.blur();
} else {
if (t > wGameData.getKey("gold")) {
t = wGameData.getKey("gold");
this.inputGold.blur();
}
this.setInputGold(t);
}
};
t.prototype.sliderEvevt = function(e) {
if (wGameData.getKey("gold") <= 0) e.progress = 0; else {
var t = e.progress, o = Math.ceil(wGameData.getKey("gold") * t);
o > wGameData.getKey("gold") && (o = wGameData.getKey("gold"));
this.setInputGold(o);
}
};
t.prototype.setInputGold = function(e) {
this.inputGold.string = "" + (e ? wUtils.numConvert(e) : "");
var t = e / wGameData.getKey("gold") || 0;
this.slider.progress = t;
this.progress.progress = t;
this.depositNum = e;
this.dxGold.string = "(" + wUtils.smalltoBIG(e) + ")";
cc.find("jd/label", this.Handle).getComponent(cc.Label).string = Math.floor(100 * t) + "%";
this.Handle.getChildByName("jd");
};
t.prototype.onClick = function(e, t) {
var o = this;
wAudioMgr.playBtnSound();
switch (t) {
case "all":
if (wGameData.getKey("gold") <= 0) return;
this.setInputGold(wGameData.getKey("gold"));
break;

case "deposit":
if (!this.depositNum) {
wUIManager.showTips("存款金额不能为0");
return;
}
wUtils.sendMsg("Msg_Hall_BankAccess", {
gold: -this.depositNum
}, this).then(function(e) {
wUIManager.showTips("存款成功", wUIManager.TIPS_OK);
wGameData.setKey("bank", e.bank);
wGameData.setKey("gold", e.gold);
o.setInputGold(0);
});
break;

case "cz":
wViewMgr.openPage({
path: "Prefab/Recharge"
});
}
};
t.prototype.local_Event = function(e) {
switch (e) {
case "up_Gold":
this.init();
}
};
t.prototype.toggle = function() {
wAudioMgr.playBtnSound();
this.showPage.check();
};
__decorate([ a(cc.Toggle) ], t.prototype, "showPage", void 0);
__decorate([ a(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ a(cc.Label) ], t.prototype, "bankGold", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "inputGold", void 0);
__decorate([ a(cc.Slider) ], t.prototype, "slider", void 0);
__decorate([ a(cc.ProgressBar) ], t.prototype, "progress", void 0);
__decorate([ a(cc.Label) ], t.prototype, "dxGold", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
DropDown: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "dd06ck0p19G2JW5MXup71gd", "DropDown");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.switchBtn = null;
t.switchImg = [];
t.panel = null;
t.closeBtn = null;
t.bottomY = 490;
t.isShow = !1;
t.showY = 0;
t.moveTime = .3;
t.isAction = !1;
return t;
}
t.prototype.start = function() {
var e = this;
this.bottomY = this.panel.y;
this.panel.active = !1;
this.panel.opacity = 0;
this.closeBtn.active = !1;
wGEvent.on("local_Event", function(t, o) {
switch (t) {
case "setGameBankBtn":
cc.find("bank", e.panel).getComponent(cc.Button).interactable = o;
}
}, this);
};
t.prototype.showCloseBtn = function() {
this.switchBtn.spriteFrame = this.switchImg[0];
this.closeBtn.active = !0;
};
t.prototype.hideCloseBtn = function() {
this.switchBtn.spriteFrame = this.switchImg[1];
this.closeBtn.active = !1;
};
t.prototype.onClickBtn = function(e, t) {
switch (t) {
case "switch":
this.onClickSwitchBtn();
break;

case "rule":
this.onClickRuleBtn();
break;

case "close":
this.onClickCloseBtn();
return;

case "bank":
this.onClickBankBtn();
return;

case "set":
this.onClickSetBtn();
}
wAudioMgr.playBtnSound();
};
t.prototype.onClickSwitchBtn = function() {
var e = this;
if (!this.isAction) {
this.isAction = !0;
this.isShow = !this.isShow;
var t = null, o = null;
if (this.isShow) {
this.panel.y += 100;
t = cc.v2(this.panel.x, this.bottomY);
o = 255;
} else {
t = cc.v2(this.panel.x, this.bottomY + 100);
o = 0;
}
var n = cc.moveTo(this.moveTime, t).easing(cc.easeBackOut()), i = cc.fadeTo(.25, o), a = cc.spawn(n, i), s = cc.callFunc(function() {
e.isAction = !1;
e.panel.active = o;
});
this.panel.active = !0;
this.isShow ? this.panel.runAction(cc.sequence(cc.callFunc(this.showCloseBtn.bind(this)), a, s)) : this.panel.runAction(cc.sequence(cc.callFunc(this.hideCloseBtn.bind(this)), a, s));
}
};
t.prototype.onClickRuleBtn = function() {
wViewMgr.openPage({
path: "prefab/Rule",
bundle: wGameData.getGameName()
});
this.onClickSwitchBtn();
};
t.prototype.onClickCloseBtn = function() {
this.onClickSwitchBtn();
};
t.prototype.onClickBankBtn = function() {
this.onClickSwitchBtn();
};
t.prototype.onClickSetBtn = function() {
this.onClickSwitchBtn();
wViewMgr.openPage({
path: "prefab/Set",
bundle: wGameData.getGameName()
});
};
__decorate([ a(cc.Sprite) ], t.prototype, "switchBtn", void 0);
__decorate([ a([ cc.SpriteFrame ]) ], t.prototype, "switchImg", void 0);
__decorate([ a(cc.Node) ], t.prototype, "panel", void 0);
__decorate([ a(cc.Node) ], t.prototype, "closeBtn", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
DummyPlayer: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "8e643eTv2hO1o9XEwYkpqjW", "DummyPlayer");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Config"), i = e("Constant"), a = {}, s = [ 0, 35, 45, 55, 65, 35, 30 ], c = [ 0, 10, 25, 35, 45, 25, 10 ], r = {
1: [ 1e6, 2e7 ],
2: [ 1e5, 2e6 ],
3: [ 1e6, 2e7 ],
4: [ 1e7, 2e8 ],
5: [ 1e7, 2e9 ]
}, l = cc._decorator, p = l.ccclass, u = l.property, d = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.label = null;
t.list = {};
t.goldConfig = null;
return t;
}
t.prototype.start = function() {
this.label.string = "";
if (wGameData.getGame().type == n.Config.RoomType.ARCADE) {
this.goldConfig = r[wGameData.roomLevel];
a[wGameData.gameID] || (a[wGameData.gameID] = {});
if (!a[wGameData.gameID][wGameData.roomLevel]) {
var e = this.creatorList();
a[wGameData.gameID][wGameData.roomLevel] = e;
}
this.list = a[wGameData.gameID][wGameData.roomLevel];
this.list[wGameData.getKey("uid")] = {
headimgurl: wGameData.getKey("headimgurl"),
nickname: wGameData.getKey("nickname"),
gold: 1 == wGameData.roomLevel ? 1e7 : wGameData.getKey("gold")
};
this.label.string = "" + Object.keys(this.list).length;
this.schedule(this.randomAddPlayer.bind(this), 10);
} else {
wGEvent.on("Msg_Game_GetUserList", this.Msg_Game_GetUserList, this);
this.schedule(function() {
wNetWork.send("Msg_Game_GetUserList", {
gtype: wGameData.gameID
});
}, 1);
}
};
t.prototype.randomAddPlayer = function() {
var e = wUtils.random(1, 100), t = Object.keys(this.list).length, o = wUtils.random(1, 2);
if (e > 50 && t + o < s[wGameData.roomLevel] + 6) for (var n = 0; n < o; n++) this.list[n + t] = this.creatorPlayer(); else if (t - o > 2) for (n = 0; n < o; n++) delete this.list[t - n];
this.label.string = "" + Object.keys(this.list).length;
a[wGameData.gameID][wGameData.roomLevel] = this.list;
};
t.prototype.creatorList = function() {
for (var e = wUtils.random(c[wGameData.roomLevel], s[wGameData.roomLevel]), t = {}, o = 0; o < e; o++) t[o] = this.creatorPlayer();
var n = 0;
for (o = 0; o < 4; o++) t[n++] = this.creatorPlayer(this.goldConfig[1] / 2, this.goldConfig[1]);
if (5 == wGameData.roomLevel) {
e -= 7;
for (o = 0; o < 7; o++) {
var i = wUtils.random(1, 9);
t[n++] = this.creatorPlayer(1e8 * i, 1e8 * (i + 1) - 1);
}
}
for (o = 0; o < e - 4; o++) {
i = wUtils.random(1, 9);
t[n++] = this.creatorPlayer(this.goldConfig[0] * i, this.goldConfig[0] * (i + 1) - 1);
}
return t;
};
t.prototype.creatorPlayer = function(e, t) {
!t && (t = this.goldConfig[1]);
!e && (e = this.goldConfig[0]);
return {
headimgurl: wUtils.random(1, 100),
nickname: i.randomName(),
gold: wUtils.random(e, t)
};
};
t.prototype.Msg_Game_GetUserList = function(e) {
if (1 == e.status) {
this.list = e.data;
this.label.string = "" + Object.keys(this.list).length;
}
};
t.prototype.onClick = function() {
this.list[wGameData.getKey("uid")] && (this.list[wGameData.getKey("uid")].gold = 1 == wGameData.roomLevel ? 1e7 : wGameData.getKey("gold"));
wViewMgr.openPage({
path: n.Config.ViewConfig.GamePlayerList,
data: this.list
});
};
__decorate([ u(cc.Label) ], t.prototype, "label", void 0);
return __decorate([ p ], t);
}(cc.Component);
o.default = d;
cc._RF.pop();
}, {
Config: "Config",
Constant: "Constant"
} ],
EventDispatcher: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "ac967OCVBxLMJqs1Lqe1h6P", "EventDispatcher");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.EventDispatcher = void 0;
var n = function() {
function e() {
this.events = new Map();
}
e.prototype.on = function(e, t, o) {
this.events.has(e) || this.events.set(e, {
auto: 0,
listeners: {}
});
var n = this.events.get(e), i = ++n.auto;
n.listeners[i] = {
cb: t.bind(o),
target: o
};
return {
name: e,
id: i,
target: o
};
};
e.prototype.off = function(e) {
var t = e.name;
this.events.has(t) && delete this.events.get(t).listeners[e.id];
};
e.prototype.emit = function(e) {
for (var t = this, o = [], n = 1; n < arguments.length; n++) o[n - 1] = arguments[n];
var i = this.events.has(e);
if (i) {
var a = this.events.get(e);
Object.keys(a.listeners).forEach(function(e) {
return __awaiter(t, void 0, void 0, function() {
var t;
return __generator(this, function() {
t = a.listeners[e];
cc.isValid(t.target, !0) ? t.cb.apply(t, o) : delete a.listeners[e];
return [ 2 ];
});
});
});
}
};
e.prototype.clear = function(e) {
this.events.delete(e);
};
return e;
}();
o.EventDispatcher = n;
cc._RF.pop();
}, {} ],
Experience: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "f785eX8rFlEnoQpetOxmgi3", "Experience");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.showPage = null;
t.myDHK = null;
t.useNum = null;
t.useRcard = 0;
return t;
}
t.prototype.onLoad = function() {
if (wGameData.getKey("uid").toString().length < 4) {
this.node.parent.getComponent(cc.Layout).spacingY = 20;
this.node.active = !1;
} else {
this.node.on("toggle", this.toggle, this);
wGEvent.on("local_Event", this.local_Event, this);
this.myDHK.string = wGameData.getKey("rcard");
wLog.e(wGameData.getKey("rcard"));
}
};
t.prototype.sendMsg = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t, o;
return __generator(this, function(n) {
switch (n.label) {
case 0:
this.useRcard = Number(this.useNum.string);
if (wGameData.getKey("rcard") <= 0 || this.useRcard > wGameData.getKey("rcard")) {
wUIManager.showTips("当前兑换卡不足！", wUIManager.TIPS_OK);
return [ 2 ];
}
if (this.useRcard <= 0) {
wUIManager.showTips("请输入要使用的数量！", wUIManager.TIPS_OK);
return [ 2 ];
}
e = Math.ceil(this.useRcard / 2);
t = 0;
n.label = 1;

case 1:
if (!(t < e)) return [ 3, 4 ];
o = t == e - 1 ? this.useRcard % 2 == 0 ? 2 : 1 : 2;
return [ 4, this.sendUseExchangeCard(o) ];

case 2:
n.sent();
n.label = 3;

case 3:
t++;
return [ 3, 1 ];

case 4:
wUIManager.showTips("兑换卡使用成功", wUIManager.TIPS_OK);
return [ 2 ];
}
});
});
};
t.prototype.sendUseExchangeCard = function(e) {
var t = this;
return new Promise(function(o) {
wNetWork.send("Msg_Hall_UseExchangeCard", {
num: e
}, !0);
var n = wGEvent.on("Msg_Hall_UseExchangeCard", function(t) {
o(1);
wGEvent.off(n);
if (1 == t.status) {
var i = t.data.gold;
wGameData.setKey("gold", i);
wGameData.setKey("rcard", wGameData.getKey("rcard") - e);
}
}, t);
});
};
t.prototype.local_Event = function(e) {
switch (e) {
case "up_Excard":
this.myDHK.string = wGameData.getKey("rcard");
}
};
t.prototype.toggle = function() {
wAudioMgr.playBtnSound();
this.node.getComponent(cc.Toggle).isChecked && this.showPage.check();
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "sy":
this.sendMsg();
break;

case "add":
this.useRcard = Number(this.useNum.string) + 1;
this.useNum.string = "" + this.useRcard;
break;

case "sub":
this.useRcard = Number(this.useNum.string) - 1;
this.useRcard < 0 && (this.useRcard = 0);
this.useNum.string = "" + this.useRcard;
}
};
t.prototype.Msg_Hall_UseExchangeCard = function(e) {
if (1 == e.status) {
var t = e.data.gold;
wUIManager.showTips("兑换卡使用成功", wUIManager.TIPS_OK);
wGameData.setKey("gold", t);
wGameData.setKey("rcard", wGameData.getKey("rcard") - this.useRcard);
}
};
__decorate([ a(cc.Toggle) ], t.prototype, "showPage", void 0);
__decorate([ a(cc.Label) ], t.prototype, "myDHK", void 0);
__decorate([ a(cc.Label) ], t.prototype, "useNum", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
FirstHotupDate: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "bb822Eqg6pOmacJdwQhkmA2", "FirstHotupDate");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("HotUpDate"), i = e("SDKManager"), a = e("Config"), s = e("UIProgress"), c = !1, r = cc._decorator, l = r.ccclass, p = r.property, u = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.showNode = null;
t.prog = null;
t.gameUpCount = {};
t.hallUpCount = 0;
t.tips = [ "提示：要进行存款和取款操作需要点击“银行”按钮哦", "提示：充值的欢乐豆需要在银行领取哦" ];
t.getUrlcount = 0;
return t;
}
t.prototype.onLoad = function() {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(e) {
switch (e.label) {
case 0:
cc.sys.localStorage.setItem("MainHotUpdate", 0);
wAudioMgr.playBgMusic("sound/bgm/bg_main");
if (!wConstant.isCheckHotUp) return [ 3, 1 ];
this.getHotUpDateUrl();
return [ 3, 4 ];

case 1:
if (c) return [ 3, 2 ];
this.imitatePorr();
return [ 3, 4 ];

case 2:
return [ 4, wUtils.syncDelayed(.2, this) ];

case 3:
e.sent();
this.removeNode();
e.label = 4;

case 4:
return [ 2 ];
}
});
});
};
t.prototype.getHotUpDateUrl = function() {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function() {
this.checkUpdate();
return [ 2 ];
});
});
};
t.prototype.onEnable = function() {
this.prog.setTP("游戏正在启动中，请稍后片刻 ...", 0);
};
t.prototype.checkUpdate = function() {
var e = this, t = wConstant.hotUpDateUrl + "allEdition.json";
cc.assetManager.loadRemote(t, {
reload: !0,
cacheAsset: !1,
cacheEnabled: !1
}, function(t, o) {
return __awaiter(e, void 0, void 0, function() {
var e, a = this;
return __generator(this, function(s) {
switch (s.label) {
case 0:
if (t) {
wUIManager.showConfirmUI({
content: "子游戏版本信息请求超时，\n请稍后再试",
okCB: function() {
a.checkUpdate();
},
cancelCB: function() {
cc.game.end();
},
horizntalAlign: cc.Label.HorizontalAlign.CENTER
});
return [ 2 ];
}
wGameData.allVersion = o.json;
if (wGameData.allVersion.KF_Url_AZ) {
wConstant.KF_AZ_Url = wGameData.allVersion.KF_Url_AZ;
e = wConstant.KF_AZ_Url.lastIndexOf(":");
wConstant.getKFUrl = wConstant.KF_AZ_Url.slice(0, e + 1) + "9002";
}
if (wConstant.D_KEY) {
i.wSDK.stopYXD();
this.scheduleOnce(function() {
i.wSDK.openYXD(wConstant.D_KEY);
});
}
cc.assetManager.releaseAsset(o);
return [ 4, this.checkGameUp() ];

case 1:
s.sent();
n.wHotUpDate.checkUpdate(this.checkUpCB.bind(this));
return [ 2 ];
}
});
});
});
};
t.prototype.checkGameUp = function() {
var e = this, t = a.Config.GamePrefab, o = [];
for (var i in t) if (Object.prototype.hasOwnProperty.call(t, i)) {
var s = t[i], c = n.wHotUpDate.getAllVersion(s.enName);
(!c || "0.0.0" == c || wGameData.allVersion[s.enName] > c) && o.push(s.enName);
}
return new Promise(function(t) {
o.length ? function n(i) {
e.gameUpCount[i] = 0;
e.upGameCall(i, function() {
var e = o.pop();
e ? n(e) : t(!0);
});
}(o.pop()) : t(!0);
});
};
t.prototype.upGameCall = function(e, t) {
var o = this;
n.wHotUpDate.upDateGame(function i(a) {
if (a != n.HotUpDateState.UPDATE_PROGRESSION) if (a != n.HotUpDateState.UPDATE_FAILED) if (a != n.HotUpDateState.ERROR_PARSE_MANIFEST) if (a != n.HotUpDateState.UPDATE_FINISHED) t(); else {
n.wHotUpDate.saveVersion(e, wGameData.allVersion[e]);
t();
} else t(); else {
wLog.e("重新下载游戏");
o.gameUpCount[e]++;
if (o.gameUpCount[e] > 5) {
n.wHotUpDate.saveVersion(e, "0.0.0");
var s = jsb.fileUtils.getWritablePath() + e;
jsb.fileUtils.removeDirectory(s);
t();
} else n.wHotUpDate.upDateGame(i, e);
}
}, e);
};
t.prototype.gameRepair = function() {};
t.prototype.checkUpCB = function(e) {
var t = this;
if (e != n.HotUpDateState.ALREADY_UP_TO_DATE) if (e != n.HotUpDateState.NEW_VERSION_FOUND) {
this.hallUpCount++;
if (this.hallUpCount >= 2) {
this.hallUpCount = 0;
this.gameRepair();
} else wUIManager.showConfirmUI({
content: "版本信息请求超时，\n请稍后再试",
okCB: function() {
n.wHotUpDate.checkUpdate(t.checkUpCB.bind(t));
},
cancelCB: function() {
cc.game.end();
},
horizntalAlign: cc.Label.HorizontalAlign.CENTER
});
} else {
this.hallUpCount = 0;
n.wHotUpDate.upDateGame(this.upHallCB.bind(this));
} else c ? this.removeNode() : this.imitatePorr();
};
t.prototype.upHallCB = function(e, t) {
var o = this;
if (e != n.HotUpDateState.UPDATE_PROGRESSION) {
if (e == n.HotUpDateState.UPDATE_FAILED || e == n.HotUpDateState.ERROR_PARSE_MANIFEST) {
this.unscheduleAllCallbacks();
this.hallUpCount++;
if (this.hallUpCount >= 2) {
this.hallUpCount = 0;
this.gameRepair();
return;
}
this.scheduleOnce(function() {
wUIManager.showConfirmUI({
content: "大厅版本信息请求超时，\n请稍后再试",
okCB: function() {
n.wHotUpDate.checkUpdate(o.checkUpCB.bind(o));
},
cancelCB: function() {
cc.game.end();
},
horizntalAlign: cc.Label.HorizontalAlign.CENTER
});
}, .5);
}
if (e == n.HotUpDateState.UPDATE_FINISHED) {
wLog.i("更新完成");
this.prog.setTP("正在更新游戏：100% / 100%", 1);
n.wHotUpDate.saveVersion("Main", wGameData.allVersion.Main);
}
} else {
var i = t.downloadedBytes / t.totalBytes || 0, a = "正在更新游戏：" + Math.ceil(100 * i) + "% / 100%";
this.prog.setTP(a, i);
}
};
t.prototype.removeNode = function() {
this.showNode.active = !0;
this.node.active = !1;
};
t.prototype.imitatePorr = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t, o = this;
return __generator(this, function(n) {
switch (n.label) {
case 0:
e = [ "Prefab/Bank", "Prefab/BankCheck", "Prefab/BindPhone", "Prefab/Propose", "Prefab/Ranking", "Prefab/Recharge", "Prefab/Service", "Prefab/SetPlayerInfo", "Prefab/SoundOnOff", "Prefab/PopUpNoticeTips_A", "Prefab/SignIn" ];
wRes.preloadDir(e);
t = function() {
return new Promise(function(e) {
cc.tween(o.prog.progress).to(1.2, {
progress: 1
}, {
progress: function(e, t, n, i) {
var a = e + (t - e) * i;
o.prog.setProg(a);
return a;
}
}).delay(.4).call(function() {
e(!0);
}).start();
});
};
wUtils.syncDelayed(.8, this);
return [ 4, t() ];

case 1:
n.sent();
c = !0;
this.removeNode();
return [ 2 ];
}
});
});
};
t.prototype.preload = function() {
return __awaiter(this, void 0, void 0, function() {
var e = this;
return __generator(this, function(t) {
switch (t.label) {
case 0:
this.node.active = !0;
this.prog.setTips(this.tips[wUtils.random(0, 1)]);
return [ 4, new Promise(function(t) {
cc.tween(e.prog.progress).to(1.2, {
progress: 1
}, {
progress: function(t, o, n, i) {
var a = t + (o - t) * i;
e.prog.setProg(a);
return a;
}
}).delay(.4).call(function() {
t(!0);
}).start();
}) ];

case 1:
t.sent();
wViewMgr.openScene("Hall", function() {
wUIManager.hideLoadingUI();
});
return [ 2 ];
}
});
});
};
__decorate([ p(cc.Node) ], t.prototype, "showNode", void 0);
__decorate([ p(s.default) ], t.prototype, "prog", void 0);
return __decorate([ l ], t);
}(cc.Component);
o.default = u;
cc._RF.pop();
}, {
Config: "Config",
HotUpDate: "HotUpDate",
SDKManager: "SDKManager",
UIProgress: "UIProgress"
} ],
ForgetPasswordB: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "77980/4s59IvLH21Ww9hNB9", "ForgetPasswordB");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.pow = null;
t.qrpow = null;
t.isAcc = !1;
return t;
}
t.prototype.start = function() {
this.pow.placeholder = "";
this.qrpow.placeholder = "";
};
t.prototype.onShow = function() {
wUIManager.showTips("请重设您的密码！", wUIManager.TIPS_OK);
this.pow.placeholder = "6~10位数字或字母";
this.qrpow.placeholder = "再次输入密码";
};
t.prototype.init = function(e) {
this.phone = e.phone;
this.code = e.code;
this.type = e.type;
};
t.prototype.sendMsg = function() {
var e = this, t = this.phone, o = this.pow.string, n = this.qrpow.string, a = Number(this.code);
if (wUtils.checkPwd(o)) if (o == n) if ("ForgetPassword" == this.type) {
var s = {
ph: t,
pwd: o,
code: a
}, c = {
uid: s.ph,
password: s.pwd,
code: s.code
};
wNetWork.HttpRequest("Msg_User_ChangePassword", c, !0).then(function() {
var t = {
uid: Number(s.ph),
password: s.pwd,
equipmentcard: wGameData.getAPPID(),
type: 1,
code: -1
};
wGameData.accLoginInfo = t;
wNetWork.HttpRequest("Msg_User_Login", t, !0).then(function(t) {
wGEvent.emit("local_Event", i.Config.local_Event.login_Success, t);
e.isAcc = !0;
e.hide(!1);
});
});
} else {
c = {
uid: wGameData.getKey("uid"),
password: o,
code: a
};
wNetWork.HttpRequest("Msg_User_forgeBank", c, !0).then(function() {
wGameData.setKey("bankpass", o);
wUIManager.showTips("修改密码成功!", wUIManager.TIPS_OK);
e.hide(!1);
wViewMgr.openPage({
path: i.Config.ViewConfig.BankCheck
});
});
} else wUIManager.showTips("密码不一致，请重新输入!"); else wUIManager.showTips("请输入密码!");
};
t.prototype.onHide = function() {
this.isAcc && wUIManager.showTips("重设密码成功", wUIManager.TIPS_OK);
};
t.prototype.onClick = function() {
wAudioMgr.playBtnSound();
this.sendMsg();
};
__decorate([ c(cc.EditBox) ], t.prototype, "pow", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "qrpow", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase"
} ],
ForgetPassword_YH: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "0564bw/4VpBf63hokfKJUIq", "ForgetPassword_YH");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.phoneNode = null;
t.code = null;
t.getCodeBtn = null;
t.getCodeTime = null;
return t;
}
t.prototype.start = function() {
var e = String(wGameData.getKey("isbind"));
this.phoneNode.string = "" + (e.slice(0, 3) + "*".repeat(4) + e.slice(-4));
this.code.placeholder = "";
};
t.prototype.onShow = function() {
this.code.placeholder = "验证码";
};
t.prototype.sendMsg = function() {
var e = this, t = this.code.string;
if (t) {
var o = {
phone: wGameData.getKey("isbind"),
code: t,
type: "ForgetPassword_YH"
};
wViewMgr.openPage({
path: "Prefab/ForgetPasswordB",
data: o
});
this.scheduleOnce(function() {
e.node.destroy();
}, .1);
} else wUIManager.showTips("请输入验证码!");
};
t.prototype.onClick = function(e, t) {
var o = this;
wAudioMgr.playBtnSound();
switch (t) {
case "confirm":
this.sendMsg();
break;

case "code":
var n = wGameData.getKey("isbind");
if (!wUtils.checkMobile(n)) {
wUIManager.showTips("请输入手机号码!");
return;
}
this.getCodeBtn.active = !1;
wNetWork.HttpRequest("Msg_User_getCode", {
telephone: n
}).then(function() {
wUIManager.showTips("发送成功,请注意查收!", wUIManager.TIPS_OK);
wGameData.startCodeTime();
o.getCode(60);
});
}
};
t.prototype.getCode = function(e) {
var t = this;
this.getCodeTime.string = e + "s";
this.getCodeBtn.active = !1;
this.schedule(function() {
if (0 != --e) t.getCodeTime.string = e + "s"; else {
t.getCodeBtn.active = !0;
t.getCodeTime.string = "";
t.unscheduleAllCallbacks();
}
}, 1);
};
__decorate([ s(cc.Label) ], t.prototype, "phoneNode", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "code", void 0);
__decorate([ s(cc.Node) ], t.prototype, "getCodeBtn", void 0);
__decorate([ s(cc.Label) ], t.prototype, "getCodeTime", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
ForgetPassword: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "50837dq6Y5LOJjAMyqMCq4J", "ForgetPassword");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.phoneNode = null;
t.code = null;
t.getCodeBtn = null;
t.getCodeTime = null;
return t;
}
t.prototype.start = function() {
this.phoneNode.placeholder = "";
this.code.placeholder = "";
};
t.prototype.onShow = function() {
var e = wGameData.getLastLogin();
e && 11 == String(e.uid).length ? this.phoneNode.string = "" + e.uid : this.phoneNode.placeholder = "手机号/账号";
this.code.placeholder = "验证码";
};
t.prototype.sendMsg = function() {
var e = this, t = this.phoneNode.string;
if (wUtils.checkMobile(t)) {
var o = this.code.string;
if (o) {
var n = {
phone: t,
code: o,
type: "ForgetPassword"
};
wViewMgr.openPage({
path: "Prefab/ForgetPasswordB",
data: n
});
this.scheduleOnce(function() {
e.node.destroy();
}, .1);
} else wUIManager.showTips("请输入验证码!");
} else wUIManager.showTips("请输入手机号码!");
};
t.prototype.onClick = function(e, t) {
var o = this;
wAudioMgr.playBtnSound();
switch (t) {
case "confirm":
this.sendMsg();
break;

case "code":
var n = this.phoneNode.string;
if (!wUtils.checkMobile(n)) {
wUIManager.showTips("请输入手机号码!");
return;
}
this.getCodeBtn.active = !1;
wNetWork.HttpRequest("Msg_User_getCode", {
telephone: n
}).then(function() {
wUIManager.showTips("发送成功,请注意查收!", wUIManager.TIPS_OK);
wGameData.startCodeTime();
o.getCode(60);
});
}
};
t.prototype.getCode = function(e) {
var t = this;
this.getCodeTime.string = e + "s";
this.getCodeBtn.active = !1;
this.schedule(function() {
if (0 != --e) t.getCodeTime.string = e + "s"; else {
t.getCodeBtn.active = !0;
t.getCodeTime.string = "";
t.unscheduleAllCallbacks();
}
}, 1);
};
__decorate([ s(cc.EditBox) ], t.prototype, "phoneNode", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "code", void 0);
__decorate([ s(cc.Node) ], t.prototype, "getCodeBtn", void 0);
__decorate([ s(cc.Label) ], t.prototype, "getCodeTime", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
GameBank: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "5f912OUA+FHM7tmcUKZuinR", "GameBank");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.gold = null;
t.bankGold = null;
t.inputGold = null;
t.slider = null;
t.prog = null;
t.pwd = null;
t.czBtn = null;
t.progTips = null;
t.dxLabel = null;
t.depositNum = 0;
t.bankStatus = !0;
return t;
}
t.prototype.onLoad = function() {
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("Msg_Hall_BankAccess", this.Msg_Hall_BankAccess, this);
this.init();
wNetWork.send("Msg_Hall_ChangeGolds", []);
var e = this.main.getChildByName("Slider");
e = e ? e.getChildByName("Handle") : cc.find("layout/Slider/Handle", this.main);
var t = cc.find("prog", e);
t.opacity = 0;
e.on("touchstart", function() {
t.stopAllActions();
var e = cc.fadeTo(.1, 255);
t.runAction(e);
});
e.on("touchend", function() {
t.stopAllActions();
var e = cc.fadeTo(.1, 0);
t.runAction(e);
});
e.on("touchcancel", function() {
t.stopAllActions();
var e = cc.fadeTo(.1, 0);
t.runAction(e);
});
wGameData.bankPow == wGameData.getKey("bankpass") && (cc.find("layout/pwd", this.main).active = !1);
};
t.prototype.Msg_Hall_BankAccess = function(e) {
if (1 == e.status) {
var t = e.data;
wGameData.setKey("bank", t.bank);
wGameData.setKey("gold", t.gold);
this.setInputGold(0);
wUIManager.showTips("取款成功", wUIManager.TIPS_OK);
this.hide(!1);
}
};
t.prototype.init = function() {
this.gold.string = wUtils.numConvert(wGameData.getKey("gold"));
this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank"));
};
t.prototype.editboxEvent = function(e) {
if (wGameData.getKey("bank") <= 0) {
this.inputGold.string = "";
this.inputGold.blur();
} else {
if (e > wGameData.getKey("bank")) {
this.inputGold.blur();
e = wGameData.getKey("bank");
}
this.setInputGold(e);
}
};
t.prototype.sliderEvevt = function(e) {
if (wGameData.getKey("bank") <= 0) {
e.progress = 0;
this.prog.progress = 0;
} else {
var t = e.progress, o = Math.ceil(wGameData.getKey("bank") * t);
o > wGameData.getKey("bank") && (o = wGameData.getKey("bank"));
this.setInputGold(o);
this.progTips.string = Math.floor(100 * e.progress) + "%";
}
};
t.prototype.setInputGold = function(e) {
this.inputGold.string = "" + (e ? wUtils.numConvert(e) : "");
var t = e / wGameData.getKey("bank") || 0;
this.slider.progress = t;
this.prog.progress = t;
this.depositNum = e;
this.dxLabel.string = wUtils.smalltoBIG(e);
this.czBtn.active = Boolean(e);
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "all":
if (wGameData.getKey("bank") <= 0) return;
this.setInputGold(wGameData.getKey("bank"));
break;

case "deposit":
if (!this.depositNum || this.depositNum < 1e3) {
wUIManager.showTips("取款不能少于1000");
return;
}
if (wGameData.bankPow != wGameData.getKey("bankpass")) {
if (!this.pwd.string) {
wUIManager.showTips("密码不能为空");
return;
}
if (this.pwd.string != wGameData.getKey("bankpass")) {
wUIManager.showTips("密码不正确！");
this.setInputGold(0);
this.pwd.string = "";
return;
}
wGameData.bankPow = wGameData.getKey("bankpass");
}
wNetWork.send("Msg_Hall_BankAccess", {
gold: Number(this.depositNum)
}, !0);
break;

case "purge":
this.setInputGold(0);
}
};
t.prototype.local_Event = function(e, t) {
switch (e) {
case "up_Gold":
this.init();
break;

case "setGameBankBtn":
cc.find("btn/ok", this.main).getComponent(cc.Button).interactable = t;
}
};
__decorate([ s(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ s(cc.Label) ], t.prototype, "bankGold", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "inputGold", void 0);
__decorate([ s(cc.Slider) ], t.prototype, "slider", void 0);
__decorate([ s(cc.ProgressBar) ], t.prototype, "prog", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "pwd", void 0);
__decorate([ s(cc.Node) ], t.prototype, "czBtn", void 0);
__decorate([ s(cc.Label) ], t.prototype, "progTips", void 0);
__decorate([ s(cc.Label) ], t.prototype, "dxLabel", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
GameData: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "af080Ha0RZMIrQ877rtU5Vq", "GameData");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.HallCreatorProxy = o.GameData = void 0;
var n = e("Config"), i = function() {
function e() {
this.user = {};
this.isReconnect = !1;
this.accLoginInfo = null;
this.bankPow = null;
this.gameID = null;
this.resAsset = null;
this.roomConfig = {};
this.roomID = null;
this.roomLevel = null;
this.tableList = null;
this.allVersion = {};
this.typeData = {};
this.gameState = wUtils.creatorProxy({});
this.codeTime = 0;
this.keyEvent = {};
cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.sceneSwitch.bind(this));
}
e.prototype.sceneSwitch = function() {
if ("Main" == wConstant.openScene) {
this.accLoginInfo = null;
this.setPlayerData({});
this.bankPow = null;
}
};
e.prototype.getAPPID = function() {
var e = cc.sys.localStorage.getItem("JHTYAPPToken");
"null" != e && "undefined" != e || (e = null);
return e;
};
e.prototype.setAPPID = function(e) {
cc.sys.localStorage.setItem("JHTYAPPToken", e);
};
e.prototype.getLastLogin = function() {
var e = cc.sys.localStorage.getItem("lastLoginInfo");
(!e && "null" == e || "undefined" == e) && (e = null);
e && (e = JSON.parse(e));
return e;
};
e.prototype.setLastLogin = function(e) {
e && (e = JSON.stringify(e));
cc.sys.localStorage.setItem("lastLoginInfo", e);
};
e.prototype.getAllAccInfo = function() {
var e = cc.sys.localStorage.getItem("AllAccInfo");
return e && "null" != e && "undefined" != e ? JSON.parse(e) : {};
};
e.prototype.setAllAccInfo = function(e) {
e && (e = JSON.stringify(e));
cc.sys.localStorage.setItem("AllAccInfo", e);
};
e.prototype.setPlayerData = function(e) {
this.user.gold = e.gold;
this.user.bank = e.bank;
this.user.rcard = e.rcard;
Object.assign(this.user, e);
};
e.prototype.setKey = function(e, t) {
this.user[e] = t;
switch (e) {
case "bank":
case "gold":
wGEvent.emit("local_Event", n.Config.local_Event.up_Gold);
break;

case "nickname":
wGEvent.emit("local_Event", n.Config.local_Event.up_Nickname);
break;

case "headimgurl":
wGEvent.emit("local_Event", n.Config.local_Event.up_Head);
break;

case "pictureframe":
wGEvent.emit("local_Event", n.Config.local_Event.up_HeadFrame);
break;

case "isbind":
wGEvent.emit("local_Event", n.Config.local_Event.bind_Phone);
break;

case "rcard":
wGEvent.emit("local_Event", n.Config.local_Event.up_Excard);
break;

case "mcard":
wGEvent.emit("local_Event", n.Config.local_Event.up_Mcard);
break;

case "lastsigntime":
wGEvent.emit("local_Event", n.Config.local_Event.sginHD);
break;

case "mail":
wGEvent.emit("local_Event", n.Config.local_Event.mailHD);
break;

case "relief":
t < 0 && (this.user[e] = 0);
}
};
e.prototype.getKey = function(e) {
return this.user[e];
};
e.prototype.getGameName = function() {
return n.Config.GamePrefab[this.gameID].enName;
};
e.prototype.getGame = function() {
return n.Config.GamePrefab[this.gameID] || {};
};
e.prototype.gameRepair = function() {
return !(2 != this.gameState[this.gameID] && !wConstant.gameStatus);
};
e.prototype.getCJBY = function() {
return "cjbySx";
};
e.prototype.startCodeTime = function(e) {
var t = this;
if (!e) {
e = 59;
this.codeTime = 59;
}
setTimeout(function() {
t.codeTime = --e;
e && t.startCodeTime(e);
}, 1e3);
};
e.prototype.setTypeData = function(e, t) {
this.typeData[e] = t;
};
e.prototype.getTypeData = function(e) {
return this.typeData[e];
};
e.prototype.get_day_night = function() {
var e = new Date().getHours(), t = 1;
e >= 0 && e < 12 ? t = 0 : e >= 12 && e < 18 && (t = 0);
return t;
};
e.prototype.onEvevt = function(e, t) {
if ("function" == typeof t) {
!this.keyEvent[e] && (this.keyEvent[e] = []);
this.keyEvent[e].push(t);
} else wLog.e("对象绑定错误");
};
return e;
}();
o.GameData = i;
o.HallCreatorProxy = function() {
var e = new i();
return new Proxy(e, {
get: function(e, t) {
return e[t];
},
set: function(e, t, o) {
e[t] = o;
e.keyEvent[t] && e.keyEvent[t].forEach(function(e) {
cc.isValid(e) && e(o);
});
return !0;
}
});
};
cc._RF.pop();
}, {
Config: "Config"
} ],
GameExitTips: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "031cf667GZLdadVYa/iy0Aq", "GameExitTips");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.tips = null;
t.cb = null;
t.T = null;
return t;
}
t.prototype.init = function(e) {
e.content && (this.content.string = e.content);
Object.prototype.hasOwnProperty.call(e, "opencancelBtn") && (this.main.getChildByName("close").active = e.opencancelBtn);
this.T = e;
this.tips.node.active = e.isGameRun;
e.isGameRun && this.startTimeTips();
};
t.prototype.startTimeTips = function() {
var e = this, t = 10;
this.tips.string = "（" + t + "秒后关闭页面）";
this.schedule(function() {
if (--t < 0) {
e.unscheduleAllCallbacks();
e.hide(!1);
} else e.tips.string = "（" + t + "秒后关闭页面）";
}, 1, t + 1, 1);
};
t.prototype.onHide = function() {
this.node.destroy();
this.cb && this.cb();
};
t.prototype.okOnClick = function() {
this.cb = this.T.okCB;
this.hide(!1);
wAudioMgr.playBtnSound();
};
t.prototype.cancelOnClick = function() {
this.cb = this.T.cancelCB;
this.hide();
};
__decorate([ s(cc.Label) ], t.prototype, "content", void 0);
__decorate([ s(cc.Label) ], t.prototype, "tips", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
GameNotice: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "267da8uQsRPF5wlFNxxtbu4", "GameNotice");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.item = null;
t.c = [ 36, 37, 38, 39 ];
t.list = [];
return t;
}
t.prototype.onLoad = function() {
this.node.opacity = 0;
wGEvent.on("Msg_Hall_HorseLamp", this.Msg_Hall_HorseLamp, this);
};
t.prototype.Msg_Hall_HorseLamp = function(e) {
if (1 == e.status) {
if (e.data && !this.c.includes(e.data.gtype)) {
this.list.push(e.data);
0 == this.node.opacity && this.startAnim();
}
} else wLog.e("跑马灯居然还会有失败的情况？");
};
t.prototype.startAnim = function() {
var e = this;
this.node.opacity = 255;
this.node.scaleY = 0;
var t = cc.scaleTo(.4, 1, 1), o = cc.callFunc(function() {
e.show();
}), n = cc.sequence(t, o);
this.node.runAction(n);
};
t.prototype.endAnim = function() {
var e = this, t = cc.scaleTo(.4, 1, 0), o = cc.callFunc(function() {
e.list.length > 0 ? e.startAnim() : e.node.opacity = 0;
}), n = cc.sequence(t, o);
this.node.runAction(n);
};
t.prototype.show = function() {
var e = this, t = this.list.shift();
if (t) {
this.item.getChildByName("name").getComponent(cc.Label).string = "" + t.nickname;
var o = this.item.getChildByName("game").getComponent(cc.Sprite);
o.spriteFrame = null;
wRes.loadRes("Notice/" + t.gtype, cc.SpriteFrame, function(e, t) {
o.spriteFrame = t;
});
if (t.score > 1e6 || !t.double) {
this.item.getChildByName("gold3").getComponent(cc.Label).string = wUtils.goldFormat(t.score) + "金币";
for (var n = 2; n < 4; n++) this.item.getChildByName("gold" + n).active = !0;
this.item.getChildByName("bai").active = !1;
} else {
for (n = 2; n < 4; n++) this.item.getChildByName("gold" + n).active = !1;
this.item.getChildByName("bai").active = !0;
this.item.getChildByName("bai").getComponent(cc.Label).string = t.double + "倍";
}
this.item.getComponent(cc.Layout).updateLayout();
this.item.y = -70;
var i = cc.moveTo(.3, cc.v2(0, 0)).easing(cc.easeOut(3)), a = cc.delayTime(1.3), s = cc.moveTo(.3, cc.v2(0, 70)).easing(cc.easeIn(3)), c = cc.delayTime(.1), r = cc.callFunc(function() {
e.show();
}), l = cc.sequence(i, a, s, c, r);
this.item.runAction(l);
} else this.endAnim();
};
__decorate([ a(cc.Node) ], t.prototype, "item", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
GamePlayerList: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "34ae6qrd7lAYqMadKrCvKUm", "GamePlayerList");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.playerNum = null;
t.content = null;
t.startX = 0;
t.isAnim = !1;
return t;
}
t.prototype.onEnable = function() {
var e = this;
this.main.opacity = 0;
this.scheduleOnce(function() {
e.startX = e.main.x;
e.main.x -= 600;
e.main.opacity = 255;
e.isAnim = !0;
var t = cc.moveTo(.3, cc.v2(e.startX, 0)).easing(cc.easeInOut(3)), o = cc.callFunc(function() {
e.isAnim = !1;
});
e.main.stopAllActions();
e.main.runAction(cc.sequence(t, o));
});
};
t.prototype.show = function(e) {
this.playerNum.string = "" + Object.keys(e).length;
this.init(e);
};
t.prototype.init = function(e) {
var t, o = [];
for (var n in e) if (Object.prototype.hasOwnProperty.call(e, n)) {
e[n].uid = n;
o.push(e[n]);
}
for (var i = o.length, a = 0; a < i; a++) {
var s = wUtils.random(0, i - 1), c = o[a];
o[a] = o[s];
o[s] = c;
}
for (var n in o) if (Object.prototype.hasOwnProperty.call(o, n)) {
o[n].winNum = (null === (t = o[n]) || void 0 === t ? void 0 : t.uid) == wGameData.getKey("uid") ? 1 : wUtils.random(1, 30);
this.content.getComponent("Layout_z")._addClick(o[n], o[n].uid == wGameData.getKey("uid") ? 1 : 2);
}
};
t.prototype.onClick = function() {
var e = this;
if (!this.isAnim) {
this.isAnim = !0;
var t = cc.moveTo(.3, cc.v2(this.startX - 600, 0)).easing(cc.easeInOut(3)), o = cc.callFunc(function() {
e.node.destroy();
});
this.main.runAction(cc.sequence(t, o));
}
};
t.prototype.initItem = function(e, t) {
wUIHelp.setHead(e.getChildByName("head"), t.headimgurl, !0);
e.getChildByName("name").getComponent(cc.Label).string = t.nickname;
e.getChildByName("gold").getComponent(cc.Label).string = wUtils.goldFormat(t.gold);
e.getChildByName("idx").getComponent(cc.Label).string = t.winNum;
e.active = !0;
};
__decorate([ s(cc.Label) ], t.prototype, "playerNum", void 0);
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
GameRepair: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "0a8b9fwz3tG4rJQwzRmsLTP", "GameRepair");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass;
n.property;
var a = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.start = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t, o, n, i = this;
return __generator(this, function(a) {
switch (a.label) {
case 0:
(e = this.node).active = !0;
(t = e.getChildByName("tips").getComponent(cc.Label)).string = "正在检测...";
(o = e.getChildByName("prog").getComponent(cc.Label)).string = "";
return [ 4, wUtils.syncDelayed(1, this) ];

case 1:
a.sent();
n = 0;
this.schedule(function() {
return __awaiter(i, void 0, void 0, function() {
var e = this;
return __generator(this, function(i) {
switch (i.label) {
case 0:
if (!((n += 1) > 100)) return [ 3, 2 ];
o.string = "100%";
return [ 4, wUtils.syncDelayed(.5, this) ];

case 1:
i.sent();
t.string = "检测完成";
o.string = "";
this.unscheduleAllCallbacks();
this.scheduleOnce(function() {
wUIManager.showConfirmUI({
content: "无需修复， 请继续游戏！",
horizntalAlign: cc.Label.HorizontalAlign.CENTER
});
e.node.destroy();
}, 1.5);
return [ 2 ];

case 2:
o.string = n + "%";
return [ 2 ];
}
});
});
}, .01);
return [ 2 ];
}
});
});
};
return __decorate([ i ], t);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
Game: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b62b3hubYtMjYVlGyfpWdAC", "Game");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Config"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.isClose = !1;
t.GameNotice = null;
t.startNoticePos = null;
t.arcadeScene = null;
return t;
}
t.prototype.onLoad = function() {
cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);
this.GameNotice = this.node.parent.getChildByName("GameNotice");
this.arcadeScene = this.node.parent.getChildByName("arcadeScene");
};
t.prototype.onShow = function() {
if (this.isClose) {
this.isClose = !1;
wNetWork.connect();
}
};
t.prototype.onHide = function() {
if (this.node.active) {
this.isClose = !0;
wNetWork.rejectReconnect();
wNetWork.close();
}
};
t.prototype.onEnable = function() {
wUIManager.initNoticePos("Game");
if (wConstant.isDebug) {
this.arcadeScene.active = n.Config.DeBugGame.includes(wGameData.gameID);
wConstant.arcadeSceneData = null;
}
};
t.prototype.onDisable = function() {
wUIManager.initNoticePos("Hall");
if (wConstant.isDebug) {
this.arcadeScene.active = !1;
wConstant.arcadeSceneData = null;
}
};
return __decorate([ a ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {
Config: "Config"
} ],
GiveConfirm: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "ee503G/pLdPeKir2sqWIwRV", "GiveConfirm");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.init = function(e) {
this.gold = e.gold;
this.zsuid = e.uid;
this.main.getChildByName("gold").getComponent(cc.Label).string = wUtils.numConvert(e.gold);
this.main.getChildByName("js").getComponent(cc.Label).string = "ID:" + e.uid;
var t = "<color=#ffffff>" + wGameData.getKey("nickname") + "</c><color=#8C90FB><color=#8C90FB>  (ID:</c><color=#8C90FB>" + wGameData.getKey("uid") + ")</color>";
this.main.getChildByName("zs").getComponent(cc.RichText).string = t;
};
t.prototype.onClick = function() {
var e = this;
wAudioMgr.playBtnSound();
this.gold < 1e5 ? wUIManager.showTips("赠送数额不能低于100000") : this.zsuid != wGameData.getKey("uid") ? this.gold > wGameData.getKey("bank") ? wUIManager.showTips("赠送数额不足") : wUtils.sendMsg("Msg_Hall_QueryUserInfo", {
uid: this.zsuid
}, this).then(function() {
var t = {
touid: Number(e.zsuid),
type: 1,
num: e.gold
};
wUtils.sendMsg("Msg_Hall_BankTransfer", t, e).then(function() {
e.hide(!1);
}).catch(function() {});
}).catch(function() {
wUIManager.showTips("ID不存在，请重新输入！");
}) : wUIManager.showTips("不能赠送给自己，操作失败");
};
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
GiveEvidence: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "10466I9m8BAZqcprcEXCGw0", "GiveEvidence");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.urlImg = [];
t.logoImg = [];
return t;
}
t.prototype.init = function(e) {
this.main.getChildByName("gold").getComponent(cc.Label).string = wUtils.numConvert(e.gold);
this.main.getChildByName("dx").getComponent(cc.Label).string = wUtils.smalltoBIG(e.gold);
this.main.getChildByName("time").getComponent(cc.Label).string = wUtils.timestampToTime(new Date().getTime() / 1e3);
var t = "<color=#ffffff>" + wGameData.getKey("nickname") + "</c><color=#8C90FB><color=#8C90FB>  (ID:</c><color=#8C90FB>" + wGameData.getKey("uid") + ")</color>";
this.main.getChildByName("zs").getComponent(cc.RichText).string = t;
var o = "<color=#ffffff>" + e.nickname + "</c><color=#8C90FB><color=#8C90FB>  (ID:</c><color=#8C90FB>" + e.js + ")</color>";
this.main.getChildByName("js").getComponent(cc.RichText).string = o;
cc.find("url", this.main).getComponent(cc.Sprite).spriteFrame = this.urlImg[wConstant.platform - 1];
cc.find("logo", this.main).getComponent(cc.Sprite).spriteFrame = this.logoImg[wConstant.platform - 1];
};
__decorate([ s(cc.SpriteFrame) ], t.prototype, "urlImg", void 0);
__decorate([ s(cc.SpriteFrame) ], t.prototype, "logoImg", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
GiveJL: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "be8603pYQBB/oTAaHEgE0w6", "GiveJL");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.showPage = null;
t.noData = null;
t.content = null;
t.scrollview = null;
t.page = 0;
t.totalpage = 1;
t.allList = [];
t.isSend = !0;
return t;
}
t.prototype.onLoad = function() {
this.node.on("toggle", this.toggle, this);
wGEvent.on("Msg_Hall_GoldDetailed", this.Msg_Hall_GoldDetailed, this);
this.scrollview.node.on("scroll-to-bottom", this.scroll_to_bottom, this);
};
t.prototype.scroll_to_bottom = function() {
this.totalpage > this.page && this.sendMsg();
};
t.prototype.toggle = function() {
wAudioMgr.playBtnSound();
if (this.node.getComponent(cc.Toggle).isChecked) {
this.showPage.check();
if (this.isSend) this.isSend = !1; else {
this.page = 0;
this.allList = [];
}
this.sendMsg();
}
};
t.prototype.sendMsg = function() {
wNetWork.send("Msg_Hall_GoldDetailed", {
uid: 0,
agent: 0,
page: this.page + 1
});
};
t.prototype.Msg_Hall_GoldDetailed = function(e) {
wUIManager.hideLoadingUI();
if (1 == e.status) {
var t = e.data.list;
this.page = e.data.page;
this.totalpage = e.data.totalpage;
this.initList(t);
}
};
t.prototype.initList = function(e) {
var t, o = this.allList.length;
o <= 0 && wUIHelp.hideSonNode(this.content);
for (var n = 0; n < e.length; n++) {
var i = e[n], a = this.content.children[n + o];
a || ((a = cc.instantiate(this.content.children[0])).parent = this.content);
this.initItem(a, i, n + 1 + o);
}
(t = this.allList).push.apply(t, e);
this.noData.active = !this.allList.length;
};
t.prototype.initItem = function(e, t, o) {
e.active = !0;
var n = this.allList.length + o;
e.zIndex = n;
var i = "[" + (2 == t.type ? "赠予" : "受赠") + "]" + t.nickname + "  (id:" + t.uid + ")";
e.getChildByName("uid").getComponent(cc.Label).string = i;
i = (2 == t.type ? "-" : "+") + wUtils.numConvert(t.number);
e.getChildByName("gold").color = 2 == t.type ? cc.color(112, 190, 255) : cc.color(250, 203, 95);
e.getChildByName("gold").getComponent(cc.Label).string = i;
e.getChildByName("time").getComponent(cc.Label).string = "" + t.created;
};
__decorate([ a(cc.Toggle) ], t.prototype, "showPage", void 0);
__decorate([ a(cc.Node) ], t.prototype, "noData", void 0);
__decorate([ a(cc.Node) ], t.prototype, "content", void 0);
__decorate([ a(cc.ScrollView) ], t.prototype, "scrollview", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
Give: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "ed0daeB1fpFd5ywJEduSo3a", "Give");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Config"), i = e("Bank"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.bank = null;
t.showPage = null;
t.gold = null;
t.bankGold = null;
t.playerID = null;
t.inputGold = null;
t.slider = null;
t.progress = null;
t.dxGold = null;
t.playerName = null;
t.giveList = null;
t.dirImg = [];
t.listContent = null;
t.depositNum = 0;
t.Handle = null;
t.isAgent = !1;
return t;
}
t.prototype.onLoad = function() {
this.init();
this.node.on("toggle", this.toggle, this);
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("Msg_Hall_BankTransfer", this.Msg_Hall_BankTransfer, this);
wGEvent.on("Msg_Hall_QueryUserInfo", this.Msg_Hall_QueryUserInfo, this);
this.Handle = this.progress.node.getChildByName("Handle");
var e = this.Handle.getChildByName("jd");
this.Handle.on(cc.Node.EventType.TOUCH_START, function() {
wGameData.getKey("bank") <= 0 && wUIManager.showTips("可赠送金额为0");
e.active = !0;
}, this);
this.Handle.on(cc.Node.EventType.TOUCH_END, function() {
e.active = !1;
}, this);
this.Handle.on(cc.Node.EventType.TOUCH_CANCEL, function() {
e.active = !1;
}, this);
var t = JSON.parse(cc.sys.localStorage.getItem("GiveList")) || [];
this.giveList.active = t.length;
this.isAgent = String(wGameData.getKey("uid")).length < 4;
if (this.isAgent) {
this.slider.node.active = !1;
this.slider.node.parent.getChildByName("agentBtn").active = !0;
}
};
t.prototype.toggle = function() {
var e = this;
wAudioMgr.playBtnSound();
this.showPage.check();
wGameData.getKey("isbind") || this.isAgent || wUIManager.showConfirmUI({
content: "赠送前需绑定手机和邮箱，\n请立即前往绑定？",
okTips: "绑定手机",
okCB: function() {
e.bank.hide(!1);
wViewMgr.openPage({
path: n.Config.ViewConfig.SetPlayerInfo
});
wViewMgr.openPage({
path: "Prefab/BindPhone"
});
}
});
};
t.prototype.local_Event = function(e) {
switch (e) {
case "up_Gold":
this.init();
}
};
t.prototype.init = function() {
this.gold.string = wUtils.numConvert(wGameData.getKey("gold"));
this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank"));
};
t.prototype.openGiveList = function() {
cc.find("1/list", this.showPage.node).active = !0;
this.giveList.children[0].getComponent(cc.Sprite).spriteFrame = this.dirImg[0];
var e = JSON.parse(cc.sys.localStorage.getItem("GiveList")) || [];
wUIHelp.hideSonNode(this.listContent);
for (var t = 0; t < e.length; t++) {
var o = this.listContent.children[t];
o.active = !0;
o.getChildByName("uid").getComponent(cc.Label).string = "ID:" + e[t].uid;
o.getChildByName("name").getComponent(cc.Label).string = "(" + wUtils.handleNameLen(e[t].nickname, 12) + ")";
o.getChildByName("name").color = cc.color(140, 140, 140);
o.name = "" + e[t].uid;
}
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "cxuid":
var o = Number(this.playerID.string);
if (!o || this.playerID.string.length < 4) {
wUIManager.showTips("系统提示：请输入正确的用户ID（6位以上纯数字）");
return;
}
wNetWork.send("Msg_Hall_QueryUserInfo", {
uid: o
});
break;

case "give":
this.giveGold();
break;

case "all":
if (wGameData.getKey("bank") <= 0) return;
this.setInputGold(wGameData.getKey("bank"));
break;

case "list":
this.openGiveList();
break;

case "gblist":
cc.find("1/list", this.showPage.node).active = !1;
this.giveList.children[0].getComponent(cc.Sprite).spriteFrame = this.dirImg[1];
break;

case "item":
cc.find("1/list", this.showPage.node).active = !1;
this.giveList.children[0].getComponent(cc.Sprite).spriteFrame = this.dirImg[1];
this.playerID.string = e.target.name;
break;

case "qcgold":
this.setInputGold(0);
break;

default:
this.setInputGold(this.depositNum + [ 15e3, 15e4, 75e4, 15e5, 15e6 ][t]);
}
};
t.prototype.giveGold = function() {
var e = this;
if (wGameData.getKey("isbind") || this.isAgent) {
var t = this.playerID.string, o = this.depositNum;
!t || t.length < 4 ? wUIManager.showTips("系统提示：请输入正确的用户ID（6位以上纯数字）") : !o || o <= 0 ? wUIManager.showTips("赠送数量为空时不能赠送成功的额~~") : wViewMgr.openPage({
path: "Prefab/GiveConfirm",
data: {
uid: this.playerID.string,
gold: this.depositNum
}
});
} else wUIManager.showConfirmUI({
content: "赠送前需绑定手机和邮箱，\n请立即前往绑定？",
okTips: "绑定手机",
okCB: function() {
e.bank.hide(!1);
wViewMgr.openPage({
path: n.Config.ViewConfig.SetPlayerInfo
});
wViewMgr.openPage({
path: "Prefab/BindPhone"
});
}
});
};
t.prototype.Msg_Hall_BankTransfer = function(e) {
wUIManager.hideLoadingUI();
if (1 == e.status) {
var t = e.data;
wViewMgr.openPage({
path: n.Config.ViewConfig.GiveEvidence,
data: {
zc: wGameData.getKey("uid"),
js: this.playerID.string,
gold: this.depositNum,
nickname: t.nickname || ""
}
});
wGameData.setKey("bank", t.bank);
this.setInputGold(0);
var o = JSON.parse(cc.sys.localStorage.getItem("GiveList")) || [];
o.unshift({
uid: this.playerID.string,
nickname: t.nickname
});
for (var i = 1; i < o.length; i++) o[0].uid != o[i].uid || o.splice(i, 1);
o.length > 5 && o.pop();
cc.sys.localStorage.setItem("GiveList", JSON.stringify(o));
this.playerID.string = "";
}
};
t.prototype.editboxEvent = function(e) {
var t = Number(e.string) || 0;
if (wGameData.getKey("bank") <= 0) {
this.inputGold.string = "";
this.inputGold.blur();
} else {
if (t > wGameData.getKey("bank")) {
this.inputGold.blur();
t = wGameData.getKey("bank");
}
this.setInputGold(t);
}
};
t.prototype.sliderEvevt = function(e) {
if (wGameData.getKey("bank") <= 0) e.progress = 0; else {
var t = e.progress, o = Math.ceil(wGameData.getKey("bank") * t);
o > wGameData.getKey("bank") && (o = wGameData.getKey("bank"));
this.setInputGold(o);
}
};
t.prototype.setInputGold = function(e) {
this.inputGold.string = "" + (e ? wUtils.numConvert(e) : "");
var t = e / wGameData.getKey("bank") || 0;
this.slider.progress = t;
this.progress.progress = t;
this.depositNum = e;
this.dxGold.string = "(" + wUtils.smalltoBIG(e) + ")";
cc.find("jd/label", this.Handle).getComponent(cc.Label).string = Math.floor(100 * t) + "%";
};
t.prototype.Msg_Hall_QueryUserInfo = function(e) {
1 == e.status ? this.playerName.string = "(" + e.data.nickname + ")" : wUIManager.showTips("ID不存在，请重新输入！");
};
t.prototype.uidEditboxEvent = function() {
this.playerName.string = "";
};
__decorate([ c(i.default) ], t.prototype, "bank", void 0);
__decorate([ c(cc.Toggle) ], t.prototype, "showPage", void 0);
__decorate([ c(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ c(cc.Label) ], t.prototype, "bankGold", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "playerID", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "inputGold", void 0);
__decorate([ c(cc.Slider) ], t.prototype, "slider", void 0);
__decorate([ c(cc.ProgressBar) ], t.prototype, "progress", void 0);
__decorate([ c(cc.Label) ], t.prototype, "dxGold", void 0);
__decorate([ c(cc.Label) ], t.prototype, "playerName", void 0);
__decorate([ c(cc.Node) ], t.prototype, "giveList", void 0);
__decorate([ c(cc.SpriteFrame) ], t.prototype, "dirImg", void 0);
__decorate([ c(cc.Node) ], t.prototype, "listContent", void 0);
return __decorate([ s ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {
Bank: "Bank",
Config: "Config"
} ],
GoldAnim: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "57fc2g0lWxGmYGUT6Hv+VYo", "GoldAnim");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.count = 120;
return t;
}
t.prototype.start = function() {
for (var e = 0; e < this.count; e++) {
var t = cc.instantiate(this.node.getChildByName("copy").children[wUtils.random(0, 1)]);
t.parent = this.content;
t.scale = wUtils.random(.4, 9) / 10;
t.angle = wUtils.random(0, 360);
}
this.playAnim();
};
t.prototype.playAnim = function() {
for (var e = this, t = [ .01, .02, .03 ], o = function(o) {
n.scheduleOnce(function() {
var t = cc.v2(wUtils.random(-10, 10) / 10, wUtils.random(-10, 10) / 10), n = wUtils.random(500, 700), i = cc.v2(t.x * n, t.y * n), a = e.content.children[o];
a.setPosition(0, 0);
a.active = !0;
a.opacity = 255;
var s = cc.moveTo(.4, i).easing(cc.easeOut(4)), c = cc.fadeOut(.6), r = cc.sequence(s, c);
a.runAction(r);
}, t[wUtils.random(0, 2)]);
}, n = this, i = 0; i < this.count; i++) o(i);
};
__decorate([ a(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
GoldRoll: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "02e10MIlA9Dn4M1EjT4U5ix", "GoldRoll");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.numCount = [];
t.rollTime = 3;
t.itemH = null;
t._singleTime = 0;
return t;
}
t.prototype.onLoad = function() {
this.itemH = this.numCount[0].children[0].children[0].height;
this._singleTime = this.rollTime / (10 * this.itemH);
};
t.prototype.initNum = function(e) {
e = e.toString();
for (var t = "*".repeat(this.numCount.length - e.length) + e, o = 0; o < this.numCount.length; o++) {
var n = this.numCount[o].children[0];
this.numCount[o].active = "*" != t[o];
var i = Number(t[o]);
n.y = i * -this.itemH;
}
};
t.prototype.setNum = function(e, t) {
void 0 === t && (t = !1);
return __awaiter(this, void 0, void 0, function() {
var o, n, i, a;
return __generator(this, function() {
e = e.toString();
o = "*".repeat(this.numCount.length - e.length) + e;
n = function(e) {
var n = i.numCount[e].children[0];
n.stopAllActions();
if ("*" == o[e]) {
i.numCount[e].active = !1;
return "continue";
}
i.numCount[e].active = !0;
var a = Number(o[e]) * -i.itemH, s = n.y;
n.x = 0;
if (s == a && !t) {
n.y = a;
return "continue";
}
if (s > a) {
var c = i._singleTime * Math.abs(s - a), r = cc.moveTo(c, cc.v2(0, a)), l = cc.callFunc(function() {
n.y = a;
});
n.runAction(cc.sequence(r, l));
} else {
var p = i._singleTime * Math.abs(n.y - -10 * i.itemH), u = i._singleTime * Math.abs(a);
r = cc.moveTo(p, cc.v2(0, -10 * i.itemH));
l = cc.callFunc(function() {
n.y = 0;
});
var d = cc.moveTo(u, cc.v2(0, a)), h = cc.callFunc(function() {
n.y = a;
});
n.runAction(cc.sequence(r, l, d, h));
}
};
i = this;
for (a = 0; a < this.numCount.length; a++) n(a);
return [ 2 ];
});
});
};
__decorate([ a([ cc.Node ]) ], t.prototype, "numCount", void 0);
__decorate([ a(cc.Integer) ], t.prototype, "rollTime", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
GuestTips: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "6a5a6yss71KJobhIaULTq3w", "GuestTips");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = cc._decorator, s = a.ccclass;
a.property;
var c = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onClick = function() {
wAudioMgr.playBtnSound();
this.hide(!1);
wViewMgr.openPage({
path: i.Config.ViewConfig.Register_RetrievePow,
parameter: {
type: "Register",
key: "BindPhone"
}
});
};
t.prototype.init = function(e) {
this.cb = e;
};
t.prototype.onHide = function() {
this.cb && this.cb();
};
return __decorate([ s ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase"
} ],
HTTP: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "29eecgWlQdJ+qoLvrmM0o6I", "HTTP");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.HTTPState = void 0;
var n;
(function(e) {
e.OVERTIME = "请求超时";
e.REQUESTFAIL = "请求失败";
e.NETWORKERROR = "网络错误";
})(n = o.HTTPState || (o.HTTPState = {}));
var i = function() {
function e() {}
e.prototype.request = function(e) {
var t = e.url, o = new XMLHttpRequest();
o.responseType = "json";
o.onload = function() {
if (200 === o.status) {
var t = o.response;
e.cb && e.cb(null, t);
} else e.cb && e.cb(n.REQUESTFAIL, null);
};
o.onerror = function() {
setTimeout(function() {
e.cb && e.cb(n.NETWORKERROR, null);
}, 1e3);
};
o.timeout = 1e4;
o.ontimeout = function() {
e.cb && e.cb(n.OVERTIME, null);
};
o.open(e.method || "POST", t, !0);
var i = {
"Content-Type": "application/x-www-form-urlencoded"
};
for (var a in i) o.setRequestHeader(a, i[a]);
o.send(e.data);
};
e.prototype.makeParams = function(e, t, o, i, a) {
return {
url: e,
method: t,
data: o,
cb: function(t, o) {
wUIManager.hideLoadingUI();
if (t) {
e.includes("HotUpDate") || (t === n.REQUESTFAIL ? wUIManager.showTips("请求失败") : t === n.NETWORKERROR ? wUIManager.showTips("网络错误") : t === n.OVERTIME && wUIManager.showTips("请求超时"));
a && a();
} else if (1 != o.status) {
wUIManager.showTips(o.msg);
a && a(o);
} else i && i(o);
}.bind(this)
};
};
e.prototype.httpRequest = function(e, t, o, n, i) {
var a = e, s = this.makeParams(a, i, t, o, n);
this.request(s);
};
return e;
}();
o.default = new i();
cc._RF.pop();
}, {} ],
Hall_Controlle: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "7f196+hJ1hFIYKw2TmaOZ+V", "Hall_Controlle");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Scenebase"), i = e("SDKManager"), a = e("Config"), s = e("Hall_View"), c = cc._decorator, r = c.ccclass, l = c.property, p = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.Hall_View = null;
t.isIconBtnClick = !0;
return t;
}
t.prototype.start = function() {
this.init();
};
t.prototype.init = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t, o;
return __generator(this, function() {
if (wGameData.getKey("rid") && !wGameData.gameRepair()) {
wLog.w("---\x3e>>>有重连进入游戏");
wUIManager.showLoadingUI();
wGameData.isReconnect = !0;
wGameData.roomID = wGameData.getKey("rid");
wGameData.gameID = Math.floor(wGameData.roomID / 1e7);
wGameData.roomLevel = wGameData.getKey("level");
e = function() {
var e = a.Config.GamePrefab[wGameData.gameID];
wRes.preloadDir("prefab/Load", function() {
wViewMgr.enterSite();
wUIManager.hideLoadingUI();
}, e.enName);
};
wLog.w("重连游戏ID：", wGameData.gameID);
t = this.node.getComponent("Hall_GameStatus");
if (o = t.checkUp(wGameData.gameID)) {
wUIManager.showTips("【" + a.Config.GamePrefab[wGameData.gameID].zhName + "】  已加入安装队列", wUIManager.TIPS_OK);
t.downLoadGame(o.node, e);
} else e();
return [ 2 ];
}
wViewMgr.openPage({
path: "Prefab/PopUpNoticeTips_A",
data: {
type: 1
}
});
return [ 2 ];
});
});
};
t.prototype.iconOnClick = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, o = this;
return __generator(this, function(n) {
switch (n.label) {
case 0:
if (!this.isIconBtnClick) return [ 2 ];
wAudioMgr.playBtnSound();
if (wGameData.getKey("uid").toString().length < 4) {
wUIManager.showTips("权限不足", wUIManager.TIPS_OK);
return [ 2 ];
}
t = Number(e.target.name);
console.warn("点击了游戏：" + t);
wGameData.gameID = t;
if (!a.Config.GamePrefab[t]) {
wUIManager.showTips("游戏暂未开启");
return [ 2 ];
}
if (wGameData.gameRepair()) {
wUIManager.showTips("游戏维护中");
return [ 2 ];
}
this.isIconBtnClick = !1;
this.scheduleOnce(function() {
o.isIconBtnClick = !0;
}, 10);
return [ 4, wViewMgr.enterSite() ];

case 1:
n.sent();
this.unscheduleAllCallbacks();
this.isIconBtnClick = !0;
return [ 2 ];
}
});
});
};
t.prototype.onClick = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
var o, n;
return __generator(this, function() {
switch (t) {
case "arcadeScene":
if (wConstant.arcadeSceneData) {
wGameData.getGame().dir == a.Config.SCREEN_DIR.V && wUIHelp.setOrientation("H");
wViewMgr.openPage({
path: "UICommon/arcadeScene"
});
} else wUIManager.showTips("请先提前旋转一把好收集当前的压注数据", wUIManager.TIPS_OK);
break;

case "info":
wViewMgr.openPage({
path: a.Config.ViewConfig.SetPlayerInfo
});
break;

case "yktq":
wViewMgr.openPage({
path: a.Config.ViewConfig.Privilege
});
break;

case "yh":
wGameData.bankPow == wGameData.getKey("bankpass") ? wViewMgr.openPage({
path: a.Config.ViewConfig.Bank
}) : wViewMgr.openPage({
path: a.Config.ViewConfig.BankCheck
});
break;

case "copy":
i.wSDK.copyToClipboard("" + wGameData.getKey("url"));
return [ 2 ];

case "exit":
wAudioMgr.playCloseSound();
this.Hall_View.gameListAni_b();
return [ 2 ];

case "multi":
case "fishing":
case "poker":
case "arcade":
case "casual":
this.Hall_View.showPage(t);
return [ 2 ];

case "mail":
this.Hall_View.openTelegarm(!0);
break;

case "phb":
wViewMgr.openPage({
path: a.Config.ViewConfig.Ranking
});
break;

case "sign":
e.target.getChildByName("hd").active = !1;
wViewMgr.openPage({
path: a.Config.ViewConfig.SignIn
});
break;

case "yk":
wViewMgr.openPage({
path: a.Config.ViewConfig.PrivilegeShop
});
break;

case "agent":
wViewMgr.openPage({
path: a.Config.ViewConfig.Agent,
isDestroy: !0
});
break;

case "kf":
wViewMgr.openPage({
path: a.Config.ViewConfig.Service
});
break;

case "recharge":
e.target.getChildByName("img").active = !1;
wViewMgr.openPage({
path: "Prefab/Recharge"
});
break;

case "kfmsg":
wUIHelp.setOrientation("V");
wViewMgr.openPage({
path: "Prefab/KFMsg"
});
break;

case "yjjy":
wViewMgr.openPage({
path: "Prefab/Propose"
});
break;

case "jjj":
if (wGameData.getKey("monthcard")) {
o = wGameData.getKey("bank") + wGameData.getKey("gold");
(n = wGameData.getKey("relief")) < 0 && (n = 0);
o >= 1e4 || n <= 0 ? wUIManager.showConfirmUI({
content: "您今天还能领取" + n + "次救济金，每次可领取10000欢乐豆(欢乐豆不足10000时可领取)"
}) : wUtils.sendMsg("Msg_Hall_GetBenefits", {}, this).then(function() {
wViewMgr.openPage({
path: "Prefab/RewardAnim",
data: 1e4
});
wGameData.setKey("relief", n - 1);
var e = wGameData.getKey("mail");
wGameData.setKey("mail", e + 1);
}).catch(function() {});
} else wUIManager.showConfirmUI({
content: "非常抱歉，领取救济金只对月卡用户开放！"
});
break;

case "bind":
wViewMgr.openPage({
path: "Prefab/BindGiveGold"
});
break;

case "fjclose":
this.Hall_View.openTelegarm(!1);
wAudioMgr.playCloseSound();
return [ 2 ];

case "tzfj":
wAudioMgr.playBtnSound();
i.wSDK.openFJ();
this.Hall_View.openTelegarm(!1);
return [ 2 ];
}
wAudioMgr.playBtnSound();
return [ 2 ];
});
});
};
t.prototype.Msg_Hall_Connect = function() {};
t.prototype.fastStartGame = function() {
var e = this;
wAudioMgr.playBtnSound();
var t = cc.sys.localStorage.getItem("fastStartGame");
t && (t = JSON.parse(t));
var o = wGameData.getKey("gold"), n = function(e) {
var t = 0;
for (var n in e) e.prototype.hasOwnProperty.call(e, n) && o >= e[n] && (t = Number[n]);
return t;
};
if (t) {
t.gtype = Math.floor(t.gtype / 1e7);
(c = a.Config.GameConfig[t.gtype])[t.level] > o && (t.level = n(a.Config.GameConfig[t.gtype]));
} else {
var i = Object.keys(a.Config.GameConfig), s = i[wUtils.random(0, i.length - 1)], c = a.Config.GameConfig[s];
(t = {}).gtype = s;
t.level = 5;
if (1 != Object.keys(c).length) {
a.Config.GamePrefab[s].table;
t.level = n(c);
}
}
t.tableid = 0;
var r = t.gtype, l = function() {
wUtils.sendMsg("Msg_Hall_EnterRoom", t, e, !0).then(function(t) {
wGameData.setKey("rid", t.rid);
wGameData.setKey("level", t.level);
e.init();
}).catch(function() {});
};
a.Config.GamePrefab[r].table ? wUtils.sendMsg("Msg_Hall_EnterGame", t, this, !0).then(function(e) {
for (var t = 1; t <= 50; t++) if (!e[t]) {
e.tableid = t;
break;
}
l();
}) : l();
};
__decorate([ l(s.default) ], t.prototype, "Hall_View", void 0);
return __decorate([ r ], t);
}(n.SceneBase);
o.default = p;
cc._RF.pop();
}, {
Config: "Config",
Hall_View: "Hall_View",
SDKManager: "SDKManager",
Scenebase: "Scenebase"
} ],
Hall_GameStatus: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b5dddS39xVCupoIKdGTWA0M", "Hall_GameStatus");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("HotUpDate"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.HotUpDateGame = null;
t.download = [];
t.gameList = {};
return t;
}
t.prototype.start = function() {
var e = this;
this.scheduleOnce(function() {
e.initGameList();
});
};
t.prototype.initGameList = function() {
for (var e = this, t = 0; t < 4; t++) {
var o = this.content.children[t].getComponent(cc.ScrollView).content, a = function(t) {
var a = o.children[t].children[0], c = a.parent.name, r = i.Config.GamePrefab[c];
if (!r) return "continue";
s.setMaintainGame(wGameData.gameState[c], a);
wGameData.gameState.onEvevt(c, function(t) {
e.setMaintainGame(t, a);
});
if (!wConstant.isCheckHotUp) return "continue";
var l = n.wHotUpDate.getAllVersion(r.enName) || "0.0.0", p = wGameData.allVersion[r.enName] || "0.0.1";
l = Number(l.split(".")[2]);
if ((p = Number(p.split(".")[2])) > l) {
var u = cc.instantiate(s.HotUpDateGame);
a.addChild(u, 1, c);
u.setPosition(0, 0);
u.on("click", s.addDownload, s);
s.gameList[c] = {
node: u
};
}
}, s = this;
for (var c in o.children) a(c);
}
};
t.prototype.setMaintainGame = function(e, t) {
if (cc.isValid(t, !0)) if (2 == e) t.getChildByName("maintain") || wRes.loadRes(i.Config.ViewConfig.MaintainGame, function(e, o) {
try {
var n = cc.instantiate(o);
if (!cc.isValid(t, !0)) return;
t.addChild(n, 10, "maintain");
n.on("click", function() {
wUIManager.showTips("游戏维护中");
});
} catch (e) {
wLog.i(e);
}
}); else {
var o = t.getChildByName("maintain");
o && o.destroy();
}
};
t.prototype.addDownload = function(e) {
if (!this.download.includes(e.node)) {
this.download.push(e.node);
if (1 == this.download.length) this.downLoadGame(e.node); else {
var t = e.node.name, o = "<color=#29E618>「</c><color=#ffffff>" + i.Config.GamePrefab[t].zhName + "<color=#29E618>」已加入安装队列！</c></color>";
wUIManager.showTips(o);
}
e.node.getChildByName("img").active = !1;
e.node.getChildByName("prog").active = !0;
}
};
t.prototype.downLoadGame = function(e, t) {
var o = this, a = e.getChildByName("prog").getComponent(cc.ProgressBar), s = a.node.getChildByName("label").getComponent(cc.Label), c = e.name, r = i.Config.GamePrefab[c], l = "<color=#29E618>「</c><color=#ffffff>" + r.zhName + "<color=#29E618>」已开始下载！</c></color>";
wUIManager.showTips(l);
n.wHotUpDate.upDateGame(function i(l, p) {
if (l != n.HotUpDateState.UPDATE_PROGRESSION) if (l != n.HotUpDateState.UPDATE_FAILED) {
if (l == n.HotUpDateState.UPDATE_FINISHED) {
e.destroy();
n.wHotUpDate.saveVersion(r.enName, wGameData.allVersion[r.enName]);
delete o.gameList[c];
var u = "<color=#29E618>「</c><color=#ffffff>" + r.zhName + "<color=#29E618>」已成功安装！</c></color>";
wUIManager.showTips(u);
if (t) {
t();
return;
}
}
o.download.shift();
o.download.length && o.downLoadGame(o.download[0]);
} else {
wLog.e("重新下载游戏");
n.wHotUpDate.upDateGame(i, r.enName);
} else {
var d = p.downloadedBytes / p.totalBytes || 0;
a.progress = d;
s.string = Math.floor(100 * d) + "%";
}
}, r.enName);
};
t.prototype.checkUp = function(e) {
return this.gameList[e];
};
__decorate([ c(cc.Node) ], t.prototype, "content", void 0);
__decorate([ c(cc.Prefab) ], t.prototype, "HotUpDateGame", void 0);
return __decorate([ s ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
HotUpDate: "HotUpDate"
} ],
Hall_View: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "39160IjpBJITYbe6/pstNZY", "Hall_View");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("SDKManager"), i = e("ChatTools"), a = e("Config"), s = cc._decorator, c = s.ccclass, r = s.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.shield = null;
t.crowdImg = null;
t.gameNotice = null;
t.systemNotice = null;
t.homePage = null;
t.content = null;
t.h_top = null;
t.right = null;
t.gameList = null;
t.g_top = null;
t.spine = null;
t.showNode = null;
t.playerInfo = null;
t.gold = null;
t.bank = null;
t.nickName = null;
t.head = null;
t.headFrame = null;
t.mailHD = null;
t.signHD = null;
t.btn_agent = null;
t.DLProg = null;
return t;
}
t.prototype.onLoad = function() {
this.initPlayerInfo();
this.initDL();
};
t.prototype.initDL = function() {
var e = this, t = cc.callFunc(function() {
e.DLProg.progress = n.wSDK.getBatteryLevel();
}), o = cc.delayTime(60), i = cc.sequence(t, o), a = cc.repeatForever(i);
this.DLProg.node.runAction(a);
};
t.prototype.showPage = function(e) {
var t = this;
this.openShield();
this.showNode = this.gameList.getChildByName(e);
var o = this.spine.getChildByName(e);
wUIHelp.hideSonNode(this.spine);
o.active = !0;
wUIHelp.playSpine(o, "animation", null, !0);
this.scheduleOnce(function() {
t.nodeAni_a();
t.gameListAni_a();
});
this.scheduleOnce(function() {
wAudioMgr.playSelectedSound();
}, .08);
};
t.prototype.nodeAni_a = function() {
for (var e = this.showNode.children[0], t = 0; t < e.childrenCount; t++) for (var o = 0, n = e.children[t].children; o < n.length; o++) {
var i = n[o];
i.opacity = 0;
var a = i.startPos;
if (!a) {
i.startPos = cc.v2(i.x, i.y);
a = i.startPos;
}
i.x = a.x + 120;
var s = t;
e.childrenCount > 7 && 0 != t && (s = Math.floor(t / 2));
var c = cc.delayTime(.06 * s), r = cc.fadeTo(.35, 255), l = cc.moveTo(.3, a).easing(cc.easeBackOut());
i.stopAllActions();
i.runAction(cc.sequence(c, cc.spawn(r, l)));
}
};
t.prototype.nodeAni_b = function() {
for (var e = this.showNode.children[0], t = 0, o = e.childrenCount - 1; o >= 0; o--, 
t++) for (var n = 0, i = e.children[o].children; n < i.length; n++) {
var a = i[n], s = a.startPos;
if (!s) {
a.startPos = cc.v2(a.x, a.y);
s = a.startPos;
}
var c = cc.delayTime(.06 * t), r = cc.fadeTo(.22, 255), l = cc.moveBy(.3, cc.v2(s.x + 200, s.y));
a.stopAllActions();
a.runAction(cc.sequence(c, cc.spawn(r, l)));
}
};
t.prototype.gameListAni_a = function() {
this.showNode.active = !0;
var e = cc.moveTo(.56, cc.v2(0, 0)).easing(cc.easeBackOut());
this.g_top.runAction(e);
this.gameTypeAni_b();
this.gameNotice.runAction(cc.moveTo(.25, cc.v2(-24, 280)));
this.systemNotice.runAction(cc.moveTo(.25, cc.v2(0, 340)));
};
t.prototype.gameListAni_b = function() {
var e = this;
if (this.showNode) {
this.nodeAni_b();
var t = cc.moveTo(.56, cc.v2(0, 150)).easing(cc.easeBackOut());
this.g_top.runAction(t);
this.gameNotice.runAction(cc.moveTo(.25, cc.v2(-24, 250)));
this.systemNotice.runAction(cc.moveTo(.25, cc.v2(-140, 290)));
var o = cc.fadeOut(.2), n = cc.callFunc(function() {
e.showNode.active = !1;
e.showNode.opacity = 255;
e.showNode = null;
e.gameTypeAni_a(!1);
}), i = cc.sequence(o, n);
this.showNode.runAction(i);
} else this.gameTypeAni_a(!1);
};
t.prototype.enterGameAni_b = function() {
wNetWork.send("Msg_Hall_ChangeGolds", []);
if (this.showNode) {
for (var e = 0, t = this.showNode.children[0].children; e < t.length; e++) {
var o = t[e];
o.getComponent(cc.Button).interactable = !0;
o.opacity = 255;
}
this.g_top.setPosition(0, 0);
this.playerInfo.setPosition(0, -321);
} else this.gameTypeAni_a(!1);
};
t.prototype.gameTypeAni_a = function(e) {
void 0 === e && (e = !0);
this.content.opacity = 255;
this.h_top.opacity = 255;
this.right.opacity = 255;
this.openShield(.5);
this.node.getChildByName("homePage").getComponent(cc.Animation).play("hallAnim");
e && this.node.getChildByName("bgk").getComponent(cc.Animation).play("hallBGAnim");
};
t.prototype.gameTypeAni_b = function() {
this.openShield();
this.content.opacity = 0;
this.h_top.opacity = 0;
this.right.opacity = 0;
};
t.prototype.showMailRed = function(e) {
this.mailHD.active = e;
e && (this.mailHD.getChildByName("label").getComponent(cc.Label).string = "" + e);
};
t.prototype.showSignRed = function(e) {
this.signHD.active = e;
};
t.prototype.showChatRed = function(e) {
cc.find("cz/hd", this.playerInfo).active = e.other;
cc.find("msg/hd", this.playerInfo).active = e.other;
e && (cc.find("msg/hd/count", this.playerInfo).getComponent(cc.Label).string = "" + e.other);
this.showMailRed(e.serviceOne + wGameData.getKey("mail"));
};
t.prototype.initPlayerInfo = function() {
var e = this;
this.gold.string = wUtils.numConvert(wGameData.getKey("gold"));
this.bank.string = wUtils.numConvert(wGameData.getKey("bank"));
this.nickName.string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10);
wUIHelp.setHead(this.head, wGameData.getKey("headimgurl"));
this.h_top.getChildByName("bind").active = !1;
this.showSignRed(!wGameData.getKey("lastsigntime"));
this.showMailRed(wGameData.getKey("mail"));
wGEvent.on("local_Event", function(t, o) {
switch (t) {
case a.Config.local_Event.up_Gold:
e.gold.string = wUtils.numConvert(wGameData.getKey("gold"));
e.bank.string = wUtils.numConvert(wGameData.getKey("bank"));
break;

case a.Config.local_Event.up_Nickname:
e.nickName.string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10);
break;

case a.Config.local_Event.up_Head:
wUIHelp.setHead(e.head, wGameData.getKey("headimgurl"));
break;

case a.Config.local_Event.bind_Phone:
e.h_top.getChildByName("bind").active = !1;
break;

case a.Config.local_Event.sginHD:
e.showSignRed(!wGameData.getKey("lastsigntime"));
break;

case a.Config.local_Event.mailHD:
e.showMailRed(wGameData.getKey("mail") + wConstant.chatCount.serviceOne);
break;

case "ChatCount":
e.showChatRed(o);
}
}, this);
};
t.prototype.openShield = function(e) {
var t = this;
void 0 === e && (e = .3);
this.shield.active = !0;
this.scheduleOnce(function() {
t.shield.active = !1;
}, e);
};
t.prototype.onEnable = function() {
var e = this;
this.gameTypeAni_a();
if (wConstant.getKFUrl) {
var t = wGameData.getKey("uid"), o = cc.callFunc(function() {
return __awaiter(e, void 0, void 0, function() {
return __generator(this, function() {
i.default.GetMsgCount(t).then(function(e) {
wConstant.chatCount = e;
wGEvent.emit("local_Event", "ChatCount", e);
}).catch(function() {
wConstant.chatCount = {
serviceOne: 0,
other: 0
};
wGEvent.emit("local_Event", "ChatCount", 0);
});
return [ 2 ];
});
});
}), n = cc.delayTime(3), a = cc.repeatForever(cc.sequence(o, n));
this.node.stopAllActions();
this.node.runAction(a);
}
};
t.prototype.onDisable = function() {
this.node.stopAllActions();
};
t.prototype.openTelegarm = function(e) {
var t = this.node.getChildByName("fj");
if (!t.isAnim) {
t.isAnim = !0;
t.active = !0;
var o = cc.find("main", t);
o.active = !0;
if (e) {
o.opacity = 0;
var n = cc.fadeIn(.15), i = cc.callFunc(function() {
t.isAnim = !1;
}), a = cc.sequence(n, i);
o.runAction(a);
} else {
n = cc.fadeOut(.15);
i = cc.callFunc(function() {
t.active = !1;
o.active = !1;
t.isAnim = !1;
});
a = cc.sequence(n, i);
o.runAction(a);
}
}
};
__decorate([ r(cc.Node) ], t.prototype, "shield", void 0);
__decorate([ r(cc.SpriteAtlas) ], t.prototype, "crowdImg", void 0);
__decorate([ r(cc.Node) ], t.prototype, "gameNotice", void 0);
__decorate([ r(cc.Node) ], t.prototype, "systemNotice", void 0);
__decorate([ r(cc.Node) ], t.prototype, "homePage", void 0);
__decorate([ r(cc.Node) ], t.prototype, "content", void 0);
__decorate([ r(cc.Node) ], t.prototype, "h_top", void 0);
__decorate([ r(cc.Node) ], t.prototype, "right", void 0);
__decorate([ r(cc.Node) ], t.prototype, "gameList", void 0);
__decorate([ r(cc.Node) ], t.prototype, "g_top", void 0);
__decorate([ r(cc.Node) ], t.prototype, "spine", void 0);
__decorate([ r(cc.Node) ], t.prototype, "playerInfo", void 0);
__decorate([ r(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ r(cc.Label) ], t.prototype, "bank", void 0);
__decorate([ r(cc.Label) ], t.prototype, "nickName", void 0);
__decorate([ r(cc.Sprite) ], t.prototype, "head", void 0);
__decorate([ r(cc.Sprite) ], t.prototype, "headFrame", void 0);
__decorate([ r(cc.Node) ], t.prototype, "mailHD", void 0);
__decorate([ r(cc.Node) ], t.prototype, "signHD", void 0);
__decorate([ r(cc.Node) ], t.prototype, "btn_agent", void 0);
__decorate([ r(cc.ProgressBar) ], t.prototype, "DLProg", void 0);
return __decorate([ c ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {
ChatTools: "ChatTools",
Config: "Config",
SDKManager: "SDKManager"
} ],
HotUpDateGame: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "20076KPG65ILbg9wlf9rFiY", "HotUpDateGame");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Config"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.prog = null;
t.img = null;
t.status = null;
t.statusImg = [];
t.label = null;
t.gameId = null;
return t;
}
t.prototype.onLoad = function() {
var e = this.node.parent;
this.gameId = this.node.name;
var t = e.getComponent(cc.Sprite);
this.img.spriteFrame = t.spriteFrame;
};
t.prototype.setProg = function(e, t) {
this.prog.progress = 1 - e;
this.label.string = t;
};
t.prototype.setStatus = function(e) {
this.status.spriteFrame = this.statusImg[e];
switch (e) {
case 0:
break;

case 1:
this.setProg(0, "0%");
break;

case 2:
this.setProg(0, "");
}
};
t.prototype.onClick = function() {
wUIManager.showTips("【" + n.Config.GamePrefab[this.gameId].zhName + "】  已加入安装队列", wUIManager.TIPS_OK);
};
__decorate([ s(cc.ProgressBar) ], t.prototype, "prog", void 0);
__decorate([ s(cc.Sprite) ], t.prototype, "img", void 0);
__decorate([ s(cc.Sprite) ], t.prototype, "status", void 0);
__decorate([ s([ cc.SpriteFrame ]) ], t.prototype, "statusImg", void 0);
__decorate([ s(cc.Label) ], t.prototype, "label", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {
Config: "Config"
} ],
HotUpDate: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "99c007F5WJGUp6HCW6GyVD0", "HotUpDate");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.wHotUpDate = o.HotUpDateState = void 0;
var n, i = function(e, t) {
for (var o = e.split("."), n = t.split("."), i = 0; i < o.length; ++i) {
var a = parseInt(o[i]), s = parseInt(n[i] || 0);
if (a !== s) return a - s;
}
return n.length > o.length ? -1 : 0;
}, a = function(e, t) {
return t.size == jsb.fileUtils.getFileSize(e);
};
(function(e) {
e.ISNATIVE = "非原生环境";
e.NEW_VERSION_FOUND = "找到新版本";
e.ERROR_NO_LOCAL_MANIFEST = "未找到本地清单文件";
e.ERROR_PARSE_MANIFEST = "无法下载清单文件";
e.ALREADY_UP_TO_DATE = "已经是最新的远程版本";
e.UPDATE_PROGRESSION = "下载中";
e.UPDATE_FINISHED = "更新完成";
e.UPDATE_FAILED = "更新失败";
})(n = o.HotUpDateState || (o.HotUpDateState = {}));
var s = function() {
function e() {
this._storagePath = null;
this._am = null;
this._upState = !1;
this._manifest = null;
this._modularName = null;
this.cb = null;
}
e.prototype.init = function(e, t, o) {
this.storagePath = e;
this.cb = t;
this.manifest = o;
};
e.prototype._initAssetsManager = function() {
if (this._upState) return this._upState;
this._am && this._am.setEventCallback(null);
this._am = new jsb.AssetsManager("", this.storagePath, i);
this._am.setVerifyCallback(a);
cc.sys.os === cc.sys.OS_ANDROID && this._am.setMaxConcurrentTask(10);
if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
var e = this.manifest;
cc.assetManager.md5Pipe && (e = cc.assetManager.md5Pipe.transformURL(this.manifest));
this._am.loadLocalManifest(e);
}
if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) return !0;
this._upState = !1;
return this._upState;
};
e.prototype._checkUpdate = function() {
if (!this._initAssetsManager()) {
this._am.setEventCallback(this._checkCb.bind(this));
this._am.checkUpdate();
this._upState = !0;
}
};
e.prototype._checkCb = function(e) {
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.cb(n.ERROR_NO_LOCAL_MANIFEST);
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
this.cb(n.ERROR_PARSE_MANIFEST);
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this.cb(n.ALREADY_UP_TO_DATE);
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
this.cb(n.NEW_VERSION_FOUND);
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
case jsb.EventAssetsManager.ERROR_UPDATING:
this.cb(n.UPDATE_FAILED);
break;

default:
return;
}
this._am.setEventCallback(null);
this._upState = !1;
};
e.prototype._hotUpdate = function() {
if (!this._initAssetsManager()) {
this._am.setEventCallback(this._updateCb.bind(this));
this._am.update();
this._upState = !0;
}
};
e.prototype._updateCb = function(e) {
var t = this, o = !1;
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.cb(n.ERROR_NO_LOCAL_MANIFEST);
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
var i = {
downloadedFiles: e.getDownloadedFiles(),
totalFiles: e.getTotalFiles(),
downloadedBytes: e.getDownloadedFiles(),
totalBytes: e.getTotalFiles()
};
i.downloadedFiles / i.totalFiles && this.cb(n.UPDATE_PROGRESSION, i);
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this.cb(n.ALREADY_UP_TO_DATE);
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
this.cb(n.UPDATE_FINISHED);
o = !0;
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
this.cb(n.UPDATE_FAILED);
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
this.cb(n.ERROR_PARSE_MANIFEST);
}
if (o) {
this._am.setEventCallback(null);
this._upState = !1;
"Main" == this._modularName && setTimeout(function() {
var e = jsb.fileUtils.getWritablePath() + t._modularName;
jsb.fileUtils.addSearchPath(e, !0);
localStorage.setItem("HotUpdateSearchPaths", JSON.stringify([ e ]));
localStorage.setItem("MainHotUpdate", "1");
cc.audioEngine.stopAll();
cc.game.restart();
}, 200);
}
};
Object.defineProperty(e.prototype, "storagePath", {
get: function() {
return this._storagePath;
},
set: function(e) {
this._modularName = e;
this._storagePath = jsb.fileUtils.getWritablePath() + e;
},
enumerable: !1,
configurable: !0
});
Object.defineProperty(e.prototype, "manifest", {
get: function() {
return this._manifest;
},
set: function(e) {
if (e) this._manifest = e.nativeUrl; else {
var t = jsb.fileUtils.getWritablePath() + this._modularName, o = t + "/project.manifest";
if (!jsb.fileUtils.isFileExist(o)) {
jsb.fileUtils.isDirectoryExist(t) || jsb.fileUtils.createDirectory(t);
jsb.fileUtils.writeStringToFile((i = "Main" == (n = this._modularName) ? wConstant.hotUpDateUrl : wConstant.gameHotUpDateUrl, 
JSON.stringify({
packageUrl: i,
remoteManifestUrl: i + n + "/project.manifest",
remoteVersionUrl: i + n + "/version.manifest",
version: "Main" == n ? "0.0.1" : "0.0.0",
assets: {},
searchPaths: []
})), o);
}
this._manifest = o;
}
var n, i;
},
enumerable: !1,
configurable: !0
});
return e;
}(), c = function() {
function e() {
this.isDownload = {};
this.isDown = !1;
this.downloadArr = [];
}
e.prototype.getAssetsManager = function(e, t) {
void 0 === t && (t = "Main");
return __awaiter(this, void 0, void 0, function() {
var o, n, i, a, c;
return __generator(this, function(r) {
switch (r.label) {
case 0:
o = new s();
n = null;
if ("Main" != t) return [ 3, 2 ];
i = jsb.fileUtils.getWritablePath() + t;
a = i + "/project.manifest";
return jsb.fileUtils.isFileExist(a) ? [ 3, 2 ] : [ 4, wUIHelp.a_loadRes("project", cc.Asset) ];

case 1:
if (!(c = r.sent()).err) {
jsb.fileUtils.isDirectoryExist(i) || jsb.fileUtils.createDirectory(i);
jsb.fileUtils.writeStringToFile(c.res._$nativeAsset, a);
}
r.label = 2;

case 2:
o.init(t, e, n);
return [ 2, o ];
}
});
});
};
e.prototype.upDateGame = function(e, t) {
void 0 === t && (t = "Main");
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(o) {
switch (o.label) {
case 0:
this.isDownload[t] = e;
return [ 4, this.getAssetsManager(function(t, o) {
e && e(t, o);
}, t) ];

case 1:
o.sent()._hotUpdate();
return [ 2 ];
}
});
});
};
e.prototype.checkUpdate = function(e, t) {
void 0 === t && (t = "Main");
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function(o) {
switch (o.label) {
case 0:
return [ 4, this.getAssetsManager(e, t) ];

case 1:
o.sent()._checkUpdate();
return [ 2 ];
}
});
});
};
e.prototype.getIsDownload = function() {
return Object.keys(this.isDownload);
};
e.prototype.getAllVersion = function(e) {
return cc.sys.localStorage.getItem(e + "Version");
};
e.prototype.saveVersion = function(e, t) {
cc.sys.localStorage.setItem(e + "Version", t);
};
return e;
}();
o.wHotUpDate = new c();
cc._RF.pop();
}, {} ],
ImportantTips: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "95863tyDctFgJz/CznRZXmS", "ImportantTips");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
IncomeJL: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "90189ePdxhLRrEzhv+nowhD", "IncomeJL");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.showPage = null;
t.noData = null;
t.content = null;
t.scrollview = null;
t.page = 0;
t.totalpage = 1;
t.allList = [];
t.isSend = !0;
return t;
}
t.prototype.onLoad = function() {
this.node.on("toggle", this.toggle, this);
wGEvent.on("Msg_Hall_GoldDetailed", this.Msg_Hall_GoldDetailed, this);
this.scrollview.node.on("scroll-to-bottom", this.scroll_to_bottom, this);
};
t.prototype.scroll_to_bottom = function() {
this.totalpage > this.page && this.sendMsg(!0);
};
t.prototype.toggle = function() {
wAudioMgr.playBtnSound();
if (this.node.getComponent(cc.Toggle).isChecked) {
this.showPage.check();
if (this.isSend) this.isSend = !1; else {
this.page = 0;
this.allList = [];
}
this.sendMsg(!0);
}
};
t.prototype.sendMsg = function(e) {
void 0 === e && (e = !1);
wNetWork.send("Msg_Hall_GoldDetailed", {
type: 1,
uid: 0,
agent: 0,
page: this.page + 1
}, !0);
};
t.prototype.Msg_Hall_GoldDetailed = function(e) {
wUIManager.hideLoadingUI();
if (1 == e.status && 1 == e.data.type) {
var t = e.data.list;
this.page = e.data.page;
this.totalpage = e.data.totalpage;
this.initList(t);
}
};
t.prototype.initList = function(e) {
var t, o = this.allList.length;
o <= 0 && wUIHelp.hideSonNode(this.content);
for (var n = 0; n < e.length; n++) {
var i = e[n], a = this.content.children[n + o];
a || ((a = cc.instantiate(this.content.children[0])).parent = this.content);
this.initItem(a, i, n + 1 + o);
}
(t = this.allList).push.apply(t, e);
this.noData.active = !this.allList.length;
};
t.prototype.initItem = function(e, t, o) {
var n = this.allList.length + o;
e.zIndex = n;
e.getChildByName("xh").getComponent(cc.Label).string = n + "";
e.getChildByName("uid").getComponent(cc.Label).string = "ID:" + wGameData.getKey("uid");
e.getChildByName("gold").getComponent(cc.Label).string = "" + wUtils.numConvert(t.number);
e.getChildByName("time").getComponent(cc.Label).string = "" + t.created;
var i = e.getChildByName("s").getComponent(cc.Label);
switch (t.status) {
case 3:
i.string = "已撤回";
break;

case 4:
case 2:
i.string = "已领取";
break;

default:
i.string = "未领取";
}
e.active = !0;
};
__decorate([ a(cc.Toggle) ], t.prototype, "showPage", void 0);
__decorate([ a(cc.Node) ], t.prototype, "noData", void 0);
__decorate([ a(cc.Node) ], t.prototype, "content", void 0);
__decorate([ a(cc.ScrollView) ], t.prototype, "scrollview", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
JackpotNum: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "f167769RtZM1rOat3AZAFh3", "JackpotNum");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Config"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.gameID = null;
return t;
}
t.prototype.start = function() {
var e = this, t = this.node.parent.name;
"jackcount" == t && (t = this.node.name);
Number(t) ? this.gameID = Number(t) : this.gameID = wGameData.getGameID();
var o = wGameData.getData("JackPot");
if (o && o[this.gameID]) {
this.node.getComponent(cc.Label).string = "" + o[this.gameID];
this.show();
} else this.node.getComponent(cc.Label).string = "";
wGEvent.on(n.local_Event.UpJackPot, function() {
e.show();
}, this);
};
t.prototype.show = function() {
var e = this;
this.node.stopAllActions();
this.unscheduleAllCallbacks();
var t = wGameData.getData("JackPot")[this.gameID], o = Number(this.node.getComponent(cc.Label).string);
if (!o || o == t || Math.abs(t - o) < 5e3) {
o = t;
t += 5e4;
}
this.numAction(this.node, o, t, 5.2, function() {
e.show();
});
};
t.prototype.numAction = function(e, t, o, n, i) {
var a = Math.ceil((o - t) / (120 * n));
!(a % 2) && (a += 1);
var s = cc.delayTime(.01), c = cc.callFunc(function() {
var o = "" + Math.ceil(t += a);
e.getComponent(cc.Label).string = o;
}), r = cc.repeat(cc.sequence(s, c), 120 * n), l = cc.callFunc(function() {
i && i();
}), p = cc.sequence(r, l);
e.stopAllActions();
e.runAction(p);
};
return __decorate([ a ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {
Config: "Config"
} ],
KFMsg: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "c5f53V/yA1ErIJmWrhcQbTR", "KFMsg");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("ChatTools"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.chatlist = [];
t.agentList = [];
return t;
}
t.prototype.onLoad = function() {
this.node.scale = cc.winSize.width / 750;
this.node.height = cc.winSize.height / (cc.winSize.width / 750);
wUIHelp.hideSonNode(this.content);
this.sendMsg();
};
t.prototype.sendMsg = function() {
return __awaiter(this, void 0, Promise, function() {
var e, t = this;
return __generator(this, function(o) {
switch (o.label) {
case 0:
e = wGameData.getKey("uid");
return [ 4, n.default.GetChatList(e).then(function(e) {
for (var o = 0; o < e.length; o++) {
var n = e[o];
if (!n.lastChatTimestamp || !n.lastChatContent) {
e.splice(o, 1);
o--;
}
}
t.chatlist = e;
cc.find("main/no", t.node).active = !e.length;
t.chatlist.length && wUtils.sendMsg("Msg_Hall_TheRich", {}, t).then(function(e) {
t.agentList = e;
t.initList();
}).catch(function() {});
}).catch(function() {}) ];

case 1:
o.sent();
return [ 2 ];
}
});
});
};
t.prototype.initList = function() {
for (var e = function(e) {
wLog.e(e);
var o = t.chatlist[e], n = cc.instantiate(t.content.children[0]);
n.parent = t.content;
n.active = !0;
var i = t.agentList.find(function(e) {
return e.kf == o.serviceId;
}), a = wConstant.KF_AZ_Url + o.avatar;
wUIHelp.loadHead(n.getChildByName("head"), a);
var s = i ? i.nickname : o.nickName;
n.getChildByName("name").getComponent(cc.Label).string = "" + s;
var c = wUtils.timestampToTime(o.lastChatTimestamp);
n.getChildByName("time").getComponent(cc.Label).string = "" + c;
var r = i ? "代理：" + i.uid : "";
n.getChildByName("dluid").getComponent(cc.Label).string = r;
var l = o.lastChatContent.includes("img") ? "[图片]" : o.lastChatContent;
n.getChildByName("msg").getComponent(cc.Label).string = l;
n.getChildByName("hd").active = o.unreadCount;
cc.find("hd/count", n).getComponent(cc.Label).string = "" + o.unreadCount;
o.name = s;
n.service = o;
}, t = this, o = 0; o < this.chatlist.length; o++) e(o);
};
t.prototype.onClick = function(e, t) {
if ("close" == t) {
wUIHelp.setOrientation("H");
this.node.destroy();
} else {
var o = e.target;
o.getChildByName("hd").active = !1;
var n = o.service;
wUIManager.showServiceChat(n.serviceId, n.name);
}
};
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {
ChatTools: "ChatTools"
} ],
Knapsack: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e21c6IGkyRDhYuCzff9kkn/", "Knapsack");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.start = function() {};
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
LPDropDown: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "eb9f1ht7cJDkZsRMLuFm6ts", "LPDropDown");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.switchBtn = null;
t.switchImg = [];
t.panel = null;
t.effectBtn = null;
t.effectImg = [];
t.musicBtn = null;
t.musicImg = [];
t.closeBtn = null;
t.exitBtn = null;
t.bankBtn = null;
t.soundVolumeBank = 0;
t.musicVolumeBank = 0;
t.soundVolume = 0;
t.musicVolume = 0;
t.isShow = !1;
t.showX = 0;
t.moveTime = .2;
t.isAction = !1;
return t;
}
t.prototype.start = function() {
var e = this;
this.updateEffectBtn();
this.updateMusicBtn();
this.closeBtn.active = !1;
wGEvent.on("local_Event", function(t, o) {
switch (t) {
case "setGameBankBtn":
cc.find("panel/bank", e.panel).getComponent(cc.Button).interactable = o;
}
}, this);
this.panel.getComponent(cc.Widget).updateAlignment();
this.panel.getComponent(cc.Widget).enabled = !1;
this.panel.active = !1;
for (var t = 0; t < 4; t++) this.panel.children[1].children[t].x += 300;
};
t.prototype.onEnable = function() {};
t.prototype.updateEffectBtn = function() {
this.soundVolume = cc.sys.localStorage.getItem("SoundVolume");
this.soundVolumeBank = this.soundVolume;
if (this.soundVolume > 0) this.effectBtn.spriteFrame = this.effectImg[1]; else {
this.effectBtn.spriteFrame = this.effectImg[0];
this.soundVolumeBank = 1;
}
};
t.prototype.updateMusicBtn = function() {
this.musicVolume = cc.sys.localStorage.getItem("MusicVolume");
this.musicVolumeBank = this.musicVolume;
if (this.musicVolume > 0) this.musicBtn.spriteFrame = this.musicImg[1]; else {
this.musicBtn.spriteFrame = this.musicImg[0];
this.musicVolumeBank = 1;
}
};
t.prototype.showCloseBtn = function() {
this.switchBtn.spriteFrame = this.switchImg[0];
this.closeBtn.active = !0;
this.panel.active = !0;
};
t.prototype.hideCloseBtn = function() {
this.switchBtn.spriteFrame = this.switchImg[1];
this.closeBtn.active = !1;
this.panel.active = !1;
};
t.prototype.onClickBtn = function(e, t) {
switch (t) {
case "switch":
this.onClickSwitchBtn();
break;

case "effect":
this.onClickEffectBtn();
break;

case "music":
this.onClickMusicBtn();
break;

case "rule":
this.onClickRuleBtn();
break;

case "close":
this.onClickCloseBtn();
break;

case "bank":
this.onClickBankBtn();
return;
}
wAudioMgr.playBtnSound();
};
t.prototype.onClickSwitchBtn = function() {
var e = this;
if (!this.isAction) {
this.panel.active = !0;
this.isAction = !0;
this.isShow = !this.isShow;
var t = this.panel.getChildByName("panel"), o = this.panel.getChildByName("mask"), n = cc.moveBy(this.moveTime, cc.v2(300 * (this.isShow ? -1 : 1), 0)).easing(cc.easeBackIn()), i = cc.fadeTo(this.moveTime, this.isShow ? 100 : 0);
if (this.isShow) {
for (var a = function(e) {
var o = t.children[e];
s.scheduleOnce(function() {
o.runAction(n.clone());
}, .03 * e);
}, s = this, c = 0; c < 4; c++) a(c);
o.opacity = 0;
o.runAction(i);
} else {
var r = function(e) {
var o = t.children[e];
l.scheduleOnce(function() {
o.runAction(n.clone());
}, .03 * (3 - e));
}, l = this;
for (c = 3; c > -1; c--) r(c);
this.scheduleOnce(function() {
o.runAction(i);
}, .1);
}
this.scheduleOnce(function() {
e.isAction = !1;
e.isShow ? e.showCloseBtn() : e.hideCloseBtn();
}, .15 + this.moveTime);
}
};
t.prototype.onClickEffectBtn = function() {
if (this.soundVolume > 0) {
this.soundVolume = 0;
this.effectBtn.spriteFrame = this.effectImg[0];
} else {
this.soundVolume = this.soundVolumeBank;
this.effectBtn.spriteFrame = this.effectImg[1];
}
wAudioMgr.setSoundVolume(Number(this.soundVolume));
};
t.prototype.onClickMusicBtn = function() {
if (this.musicVolume > 0) {
this.musicVolume = 0;
this.musicBtn.spriteFrame = this.musicImg[0];
} else {
this.musicBtn.spriteFrame = this.musicImg[1];
this.musicVolume = this.musicVolumeBank;
}
wAudioMgr.setMusicVolume(Number(this.musicVolume));
};
t.prototype.onClickHallBtn = function() {};
t.prototype.onClickRuleBtn = function() {
wViewMgr.openPage({
path: "prefab/Rule",
bundle: wGameData.getGameName()
});
this.onClickSwitchBtn();
};
t.prototype.onClickCloseBtn = function() {
this.onClickSwitchBtn();
};
t.prototype.onClickBankBtn = function() {
this.onClickSwitchBtn();
};
__decorate([ a(cc.Sprite) ], t.prototype, "switchBtn", void 0);
__decorate([ a([ cc.SpriteFrame ]) ], t.prototype, "switchImg", void 0);
__decorate([ a(cc.Node) ], t.prototype, "panel", void 0);
__decorate([ a(cc.Sprite) ], t.prototype, "effectBtn", void 0);
__decorate([ a([ cc.SpriteFrame ]) ], t.prototype, "effectImg", void 0);
__decorate([ a(cc.Sprite) ], t.prototype, "musicBtn", void 0);
__decorate([ a([ cc.SpriteFrame ]) ], t.prototype, "musicImg", void 0);
__decorate([ a(cc.Node) ], t.prototype, "closeBtn", void 0);
__decorate([ a(cc.Button) ], t.prototype, "exitBtn", void 0);
__decorate([ a(cc.Button) ], t.prototype, "bankBtn", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
LPPlayerList: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "1a270r9LEtP/r0hWZ1YQwIw", "LPPlayerList");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.itemBG = [];
t.rankBG = [];
t.content = null;
t.list = [];
return t;
}
t.prototype.onLoad = function() {
var e = this;
wUIManager.showLoadingUI();
wNetWork.send("Msg_" + wGameData.getGameName() + "_GetUserList", {}, !0);
wGEvent.on("Msg_" + wGameData.getGameName() + "_GetUserList", function(t) {
1 == t.status ? e.msg(t.data) : e.hide();
}, this);
};
t.prototype.msg = function(e) {
var t = this, o = [];
for (var n in e) {
e[n].uid = n;
o.push(e[n]);
}
o.sort(function(e, t) {
return t.wincircle - e.wincircle;
});
o.length > 0 && this.list.push(o[0]);
o.sort(function(e, t) {
return t.gold - e.gold;
});
for (var i = 0, a = o; i < a.length; i++) {
var s = a[i];
s.uid != this.list[0].uid && this.list.push(s);
}
this.scheduleOnce(function() {
for (var e = 0; e < t.list.length; e++) {
t.list[e].order = e;
t.content.getComponent("Layout_z")._addClick(t.list[e]);
}
});
};
t.prototype.initItem = function(e, t) {
var o = e.getChildByName("t");
wUIHelp.hideSonNode(o);
t.order < 2 ? e.getComponent(cc.Sprite).spriteFrame = this.itemBG[0] : e.getComponent(cc.Sprite).spriteFrame = this.itemBG[1];
switch (!0) {
case 0 == t.order:
o.getChildByName("ssz").active = !0;
break;

case t.order <= 8:
o.getChildByName("dfh").active = !0;
o.getChildByName("dfh").getComponent(cc.Sprite).spriteFrame = this.rankBG[t.order - 1];
break;

default:
o.getChildByName("m").active = !0;
cc.find("m/idx", o).getComponent(cc.Label).string = "" + t.order;
}
e.active = !0;
e.getChildByName("gold").getComponent(cc.Label).string = wUtils.numConvert(t.gold);
e.getChildByName("xz").getComponent(cc.Label).string = wUtils.goldFormat(t.allbet);
e.getChildByName("win").getComponent(cc.Label).string = "" + t.wincircle;
e.getChildByName("name").getComponent(cc.Label).string = "" + t.nickname;
wUIHelp.setHead(e.getChildByName("head"), t.headimgurl, !0);
};
__decorate([ s([ cc.SpriteFrame ]) ], t.prototype, "itemBG", void 0);
__decorate([ s([ cc.SpriteFrame ]) ], t.prototype, "rankBG", void 0);
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
Layout_z: [ function(e, t) {
"use strict";
cc._RF.push(t, "71ba0INkkVEnLvsWbVeQbjG", "Layout_z");
function o(e, t) {
for (var o = 0; o < t.length; o++) {
var n = t[o];
n.enumerable = n.enumerable || !1;
n.configurable = !0;
"value" in n && (n.writable = !0);
Object.defineProperty(e, n.key, n);
}
}
function n(e, t, n) {
t && o(e.prototype, t);
n && o(e, n);
return e;
}
var i = cc.Enum({
HORIZONTAL: 1,
VERTICAL: 2,
GRID: 3
}), a = cc.Enum({
BOTTOM_TO_TOP: 0,
TOP_TO_BOTTOM: 1
}), s = cc.Enum({
LEFT_TO_RIGHT: 0,
RIGHT_TO_LEFT: 1
}), c = function() {
function e(e, t) {
Object.assign(this, e);
this.pos = cc.v2(0, 0);
this.active = !0;
this.node = null;
this.component = t;
}
var t = e.prototype;
t._delete = function() {
this.component.InfoDelete(this);
};
t._init = function(e) {
this != e && Object.assign(this, e);
this.component.InifInit(this);
};
n(e, [ {
key: "_zindex",
get: function() {
return this.zIndex;
},
set: function(e) {
if (this.zIndex != e) {
this.zIndex = e;
this.component.InfoZindex(this);
}
}
}, {
key: "_active",
set: function(e) {
if (this.active != e) {
this.active = e;
this.component.InfoActive(this);
}
}
} ]);
return e;
}();
cc.Class({
extends: cc.Component,
properties: {
type: {
default: i.VERTICAL,
type: i,
tooltip: "1.VERTICAL:垂直自动排布子物体\n2.HORIZONTAL：横向自动排布子物体\n3.GRID:采用网格方式对子物体进行布局"
},
copy: cc.Node,
eventHandler: cc.Component.EventHandler,
spacingY: {
default: 0,
type: cc.Integer,
visible: function() {
return this.type != i.HORIZONTAL;
}
},
spacingX: {
default: 0,
type: cc.Integer,
visible: function() {
return this.type != i.VERTICAL;
}
},
verticalDirection: {
default: a.TOP_TO_BOTTOM,
type: a,
visible: function() {
return this.type == i.VERTICAL;
}
},
horizontalDirection: {
default: s.LEFT_TO_RIGHT,
type: s,
visible: function() {
return this.type == i.HORIZONTAL;
}
},
HNum: {
default: 2,
type: cc.Integer,
tooltip: "横向的个数",
visible: function() {
return this.type == i.GRID;
}
}
},
onLoad: function() {
var e = this;
this.isMove = !0;
this.infoList = [];
this.copyW = this.copy.width * this.copy.scaleX;
this.copyH = this.copy.height * this.copy.scaleY;
this.Half = 0;
this.enemyPool = new cc.NodePool();
this.viewPos = this.node.parent.convertToWorldSpaceAR(cc.v2(0, 0));
this.viewSize = this.node.parent.getContentSize();
this.viewRect = this.node.parent.getContentSize();
this.node.on("position-changed", function() {
if (e.isMove) {
e.isMove = !1;
e.SetNodePos();
}
}, this);
this.node.setContentSize(this.viewSize);
this.HalfH = this.copyH / 2;
this.HalfW = this.copyW / 2;
this.type == i.VERTICAL ? this.VDIR = this.verticalDirection == a.TOP_TO_BOTTOM ? 1 : -1 : this.type == i.HORIZONTAL ? this.VDIR = this.horizontalDirection == s.LEFT_TO_RIGHT ? -1 : 1 : this.VDIR = 1;
switch (this.type) {
case i.HORIZONTAL:
this.viewRect.width += 2 * this.copyW;
break;

case i.VERTICAL:
case i.GRID:
this.viewRect.height += 2 * this.copyH;
}
},
_addClick: function(e, t) {
void 0 === t && (t = 0);
var o = new c(e, this);
this.infoList.push(o);
o._zindex = t;
return o;
},
_removeAllChildren: function() {
this.infoList = [];
for (;this.node.childrenCount > 0; ) this.RecoveryNode(this.node.children[0]);
this.SetInfoPos();
},
SetInfoPos: function() {
this.infoList.sort(function(e, t) {
return e.zIndex - t.zIndex;
});
for (var e = 0, t = 0; t < this.infoList.length; t++) if (this.infoList[t].active) {
var o = void 0, n = void 0;
switch (this.type) {
case i.HORIZONTAL:
o = (0 - e * this.copyW - this.HalfW - e * this.spacingX) * this.VDIR;
this.infoList[t].pos = cc.v2(o, 0);
break;

case i.VERTICAL:
n = (0 - e * this.copyH - this.HalfH - e * this.spacingY) * this.VDIR;
this.infoList[t].pos = cc.v2(0, n);
break;

case i.GRID:
var a = Math.floor(e / this.HNum), s = e % this.HNum;
o = s * this.copyW + this.HalfW + s * this.spacingX;
n = -1 * (this.HalfH + a * this.copyH + a * this.spacingY);
this.infoList[t].pos = cc.v2(o, n);
}
e++;
}
if (this.type == i.GRID) {
e = Math.ceil(e / this.HNum);
this.SetLayoutSize(i.HORIZONTAL, e);
this.SetLayoutSize(i.VERTICAL, e);
} else this.SetLayoutSize(this.type, e);
this.SetNodePos();
},
SetLayoutSize: function(e, t) {
switch (e) {
case i.HORIZONTAL:
var o = t * this.copyW + (t - 1) * this.spacingX;
this.viewSize.width > o ? this.node.width = this.viewSize.width : this.node.width = o;
break;

case i.VERTICAL:
var n = t * this.copyH + (t - 1) * this.spacingY;
this.viewSize.height > n ? this.node.height = this.viewSize.height : this.node.height = n;
}
},
GetRcet: function(e, t) {
return cc.rect(e.x - t.width / 2, e.y - t.height / 2, t.width, t.height);
},
SetNodePos: function() {
for (var e = this.node.parent.convertToWorldSpaceAR(cc.v2(0, 0)), t = this.GetRcet(this.node.convertToNodeSpaceAR(e), this.viewRect), o = 0; o < this.infoList.length; o++) if (this.infoList[o].active) {
var n = this.infoList[o].pos, i = this.GetRcet(n, cc.size(this.copyW, this.copyH));
if (t.intersects(i)) if (this.infoList[o].node) this.infoList[o].node.setPosition(this.infoList[o].pos); else {
var a = this.GetNode();
this.eventHandler.target.getComponent(this.eventHandler._componentName)[this.eventHandler.handler](a, this.infoList[o]);
a.setPosition(this.infoList[o].pos);
a.parent = this.node;
this.infoList[o].node = a;
} else if (this.infoList[o].node) {
this.RecoveryNode(this.infoList[o].node);
this.infoList[o].node = null;
}
}
},
InfoZindex: function() {
this.SetInfoPos();
},
InfoDelete: function(e) {
for (var t = 0; t < this.infoList.length; t++) if (this.infoList[t] != e) ; else {
e.node && this.RecoveryNode(e.node);
cc.js.array.removeAt(this.infoList, t);
}
this.SetInfoPos();
},
InfoActive: function(e) {
if (!e.active && e.node) {
this.RecoveryNode(e.node);
e.node = null;
}
this.SetInfoPos();
},
InifInit: function(e) {
e.node && this.eventHandler.target.getComponent(this.eventHandler._componentName)[this.eventHandler.handler](e.node, e);
},
GetNode: function() {
return this.enemyPool.size() > 0 ? this.enemyPool.get() : cc.instantiate(this.copy);
},
RecoveryNode: function(e) {
this.enemyPool.put(e);
},
onDestroy: function() {
this.enemyPool.clear();
this.node.off("position-changed", this.SetNodePos, this);
},
update: function() {
this.isMove = !0;
}
});
cc._RF.pop();
}, {} ],
LoadHallRes: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "59c60IfbU1EzLSSWjfCLvns", "LoadHallRes");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("HotUpDate"), i = e("Config"), a = e("UIProgress"), s = !1, c = cc._decorator, r = c.ccclass, l = c.property, p = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.showNode = null;
t.prog = null;
t.gameUpCount = {};
t.hallUpCount = 0;
return t;
}
t.prototype.onEnable = function() {
cc.sys.localStorage.setItem("MainHotUpdate", 0);
wAudioMgr.playBgMusic("sound/bgm/bg_main");
this.prog.setTips("正在启动游戏");
this.checkUpdate();
};
t.prototype.checkUpdate = function() {
var e = this, t = wConstant.hotUpDateUrl + "allEdition.json";
cc.assetManager.loadRemote(t, {
reload: !0,
cacheAsset: !1,
cacheEnabled: !1
}, function(t, o) {
return __awaiter(e, void 0, void 0, function() {
var e = this;
return __generator(this, function() {
if (t) {
wUIManager.showConfirmUI({
content: "获取子游戏版本失败,是否重试?",
okCB: function() {
e.checkUpdate();
},
cancelCB: function() {
cc.game.end();
}
});
return [ 2 ];
}
wGameData.allVersion = o.json;
wConstant.KF_AZ_Url = wGameData.allVersion.KF_Url_AZ;
cc.assetManager.releaseAsset(o);
return [ 2 ];
});
});
});
};
t.prototype.checkGameUp = function() {
var e = this, t = i.Config.GamePrefab, o = [];
for (var a in t) if (Object.prototype.hasOwnProperty.call(t, a)) {
var s = t[a], c = n.wHotUpDate.getAllVersion(s.enName);
c && "0.0.0" != c && wGameData.allVersion[s.enName] > c && o.push(s.enName);
}
return new Promise(function(t) {
o.length ? function n(i) {
e.gameUpCount[i] = 0;
e.upGameCall(i, function() {
var e = o.pop();
e ? n(e) : t(!0);
});
}(o.pop()) : t(!0);
});
};
t.prototype.upGameCall = function(e, t) {
var o = this;
n.wHotUpDate.upDateGame(function i(a) {
if (a != n.HotUpDateState.UPDATE_PROGRESSION) if (a != n.HotUpDateState.UPDATE_FAILED) if (a != n.HotUpDateState.ERROR_PARSE_MANIFEST) if (a != n.HotUpDateState.UPDATE_FINISHED) t(); else {
n.wHotUpDate.saveVersion(e, wGameData.allVersion[e]);
t();
} else t(); else {
wLog.e("重新下载游戏");
o.gameUpCount[e]++;
if (o.gameUpCount[e] > 5) {
n.wHotUpDate.saveVersion(e, "0.0.0");
var s = jsb.fileUtils.getWritablePath() + e;
jsb.fileUtils.removeDirectory(s);
t();
} else n.wHotUpDate.upDateGame(i, e);
}
}, e);
};
t.prototype.gameRepair = function() {};
t.prototype.checkUpCB = function(e) {
var t = this;
if (e != n.HotUpDateState.ALREADY_UP_TO_DATE) if (e != n.HotUpDateState.NEW_VERSION_FOUND) {
this.hallUpCount++;
if (this.hallUpCount >= 2) {
this.hallUpCount = 0;
this.gameRepair();
} else wUIManager.showConfirmUI({
content: "热更新检测失败,是否重试?",
okCB: function() {
n.wHotUpDate.checkUpdate(t.checkUpCB.bind(t));
},
cancelCB: function() {
cc.game.end();
}
});
} else {
this.hallUpCount = 0;
n.wHotUpDate.upDateGame(this.upHallCB.bind(this));
} else this.preload();
};
t.prototype.upHallCB = function(e, t) {
var o = this;
if (e != n.HotUpDateState.UPDATE_PROGRESSION) {
if (e == n.HotUpDateState.UPDATE_FAILED || n.HotUpDateState.ERROR_PARSE_MANIFEST) {
this.unscheduleAllCallbacks();
this.hallUpCount++;
if (this.hallUpCount >= 2) {
this.hallUpCount = 0;
this.gameRepair();
return;
}
this.scheduleOnce(function() {
wUIManager.showConfirmUI({
content: "热更新检测失败,是否重试?",
okCB: function() {
n.wHotUpDate.checkUpdate(o.checkUpCB.bind(o));
},
cancelCB: function() {
cc.game.end();
}
});
}, .5);
}
if (e == n.HotUpDateState.UPDATE_FINISHED) {
wLog.i("更新完成");
this.prog.setTP("正在更新游戏：100% / 100%", 1);
n.wHotUpDate.saveVersion("Main", wGameData.allVersion.Main);
}
} else {
var i = t.downloadedBytes / t.totalBytes || 0, a = "正在更新游戏：" + Math.ceil(100 * i) + "% / 100%";
this.prog.setTP(a, i);
}
};
t.prototype.removeNode = function() {
this.showNode.active = !0;
this.node.active = !1;
this.node.destroy();
};
t.prototype.preload = function() {
return __awaiter(this, void 0, void 0, function() {
var e = this;
return __generator(this, function(t) {
switch (t.label) {
case 0:
if (s) {
this.removeNode();
return [ 2 ];
}
s = !0;
return [ 4, new Promise(function(t) {
cc.director.preloadScene("Hall", function(t, o) {
e.prog.setProg(t / o || 0);
}, function() {
wLog.i("-----------\x3e预加载大厅资源成功");
t(!0);
});
}) ];

case 1:
t.sent();
this.removeNode();
return [ 2 ];
}
});
});
};
__decorate([ l(cc.Node) ], t.prototype, "showNode", void 0);
__decorate([ l(a.default) ], t.prototype, "prog", void 0);
return __decorate([ r ], t);
}(cc.Component);
o.default = p;
cc._RF.pop();
}, {
Config: "Config",
HotUpDate: "HotUpDate",
UIProgress: "UIProgress"
} ],
Load: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "3e6c1F6F5hO3KP00bJsgtVf", "Load");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("NetInterface"), i = e("Config"), a = e("UIProgress"), s = cc._decorator, c = s.ccclass, r = s.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.prog = null;
t.netWorkState = !0;
return t;
}
t.prototype.start = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t = this;
return __generator(this, function() {
if (wGameData.getGame().dir == i.Config.SCREEN_DIR.V) {
wUIHelp.setOrientation("V");
wUIManager.initNoticePos("Game");
(e = this.node.children[1]) && (e.scale = cc.winSize.width / 750);
}
wGEvent.on("Msg_Hall_EnterRoom", this.Msg_Hall_EnterRoom, this);
wGEvent.on("local_SocketState", this.vg_NetWorkState, this);
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
t.node.parent.active = !1;
t.node.destroy();
}, this);
if (wGameData.isReconnect) {
this.loadGame();
return [ 2 ];
}
this.enterRoom();
return [ 2 ];
});
});
};
t.prototype.enterRoom = function() {
var e = Object.values(wGameData.roomConfig)[0];
wGameData.roomLevel = e.level;
wNetWork.send("Msg_Hall_EnterRoom", {
tableid: 0,
gtype: Number(wGameData.gameID),
level: e.level
});
};
t.prototype.Msg_Hall_EnterRoom = function(e) {
if (1 == e.status) {
wGameData.roomID = e.data.rid;
this.loadGame();
} else {
wLog.e("进入房间消息失败");
this.node.removeFromParent();
this.node.destroy();
wViewMgr.enterHall();
}
};
t.prototype.loadGame = function() {
var e = this;
this.prog.setProg(0);
i.Config.GamePrefab[wGameData.gameID].loadMaxSpeed ? this.loadGameRes(function(t) {
e.prog.setProg(t);
}, function(t) {
if (e.netWorkState) {
wGameData.isReconnect = !1;
wViewMgr.openGame(t);
} else var o = wGEvent.on("local_SocketState", function(i) {
if (i == n.netWorkState.CONNECTSUCCESS || i == n.netWorkState.RECONNECTSUCCESS) {
e.netWorkState = !0;
wGameData.isReconnect = !1;
wViewMgr.openGame(t);
wGEvent.off(o);
}
}, e);
}) : this.preloadGameRes(function(t) {
e.prog.setProg(t);
}, function() {
e.loadGameRes(null, function(t) {
if (e.netWorkState) {
wViewMgr.openGame(t);
wGameData.isReconnect = !1;
} else var o = wGEvent.on("local_SocketState", function(i) {
if (i == n.netWorkState.CONNECTSUCCESS || i == n.netWorkState.RECONNECTSUCCESS) {
e.netWorkState = !0;
wViewMgr.openGame(t);
wGEvent.off(o);
wGameData.isReconnect = !1;
}
}, e);
});
});
};
t.prototype.loadGameRes = function(e, t) {
var o = i.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(o.prefabUrl, function(t, o) {
e && e(t / o);
}, function(e, o) {
e ? wLog.e(e) : t && t(o);
}, o.enName);
};
t.prototype.preloadGameRes = function(e, t) {
var o = i.Config.GamePrefab[wGameData.gameID];
wRes.preloadBundle(o.prefabUrl, function(t, o) {
e && e(t / o);
}, function(e) {
e ? wLog.e(e) : t && t();
}, o.enName);
};
t.prototype.vg_NetWorkState = function(e) {
e == n.netWorkState.CLOSEDING || e == n.netWorkState.CLOSED ? this.netWorkState = !1 : e != n.netWorkState.CONNECTSUCCESS && e != n.netWorkState.RECONNECTSUCCESS || (this.netWorkState = !0);
};
__decorate([ r(a.default) ], t.prototype, "prog", void 0);
return __decorate([ c ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {
Config: "Config",
NetInterface: "NetInterface",
UIProgress: "UIProgress"
} ],
LogManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "0a153l0snVNdqZIa86XRVc+", "LogManager");
var n;
Object.defineProperty(o, "__esModule", {
value: !0
});
o.LogManager = void 0;
(function(e) {
e[e.INFO = 3] = "INFO";
e[e.WARN = 2] = "WARN";
e[e.ERROR = 1] = "ERROR";
})(n || (n = {}));
var i = function() {
function e() {}
e.prototype.i = function(e) {
for (var t = [], o = 1; o < arguments.length; o++) t[o - 1] = arguments[o];
wConstant.nLevel >= n.INFO && cc.log.apply(cc, __spreadArrays([ e ], t));
};
e.prototype.w = function(e) {
for (var t = [], o = 1; o < arguments.length; o++) t[o - 1] = arguments[o];
wConstant.nLevel >= n.WARN && cc.warn.apply(cc, __spreadArrays([ e ], t));
};
e.prototype.e = function(e) {
for (var t = [], o = 1; o < arguments.length; o++) t[o - 1] = arguments[o];
wConstant.nLevel >= n.ERROR && cc.error.apply(cc, __spreadArrays([ e ], t));
};
return e;
}();
o.LogManager = i;
cc._RF.pop();
}, {} ],
LoginCheck: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "d991ao4l6lPvbpJ5rgbzjLF", "LoginCheck");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.phone = null;
t.smsCodeNode = null;
t.getCodeBtn = null;
t.getCodeTime = null;
return t;
}
t.prototype.init = function(e) {
this.phone.string = "" + e.uid;
};
t.prototype.onClick = function(e, t) {
var o = this;
wAudioMgr.playBtnSound();
switch (t) {
case "login":
this.login();
break;

case "code":
var n = this.phone.string;
this.getCodeBtn.active = !1;
wNetWork.HttpRequest("Msg_User_getCode", {
telephone: Number(n)
}).then(function() {
wUIManager.showTips("发送成功", 1);
wGameData.startCodeTime();
o.getCode(59);
});
}
};
t.prototype.start = function() {
wGameData.codeTime && wGameData.codeTime > 0 && this.getCode(wGameData.codeTime);
};
t.prototype.login = function() {
var e = Number(this.smsCodeNode.string);
if (e) {
var t = {
uid: Number(this.phone.string),
code: e,
equipmentcard: wGameData.getAPPID()
};
wNetWork.HttpRequest("Msg_User_VerificationCode", t).then(function(e) {
wGEvent.emit("local_Event", i.Config.local_Event.login_Success, e);
});
} else wUIManager.showTips("请输入验证码");
};
t.prototype.getCode = function(e) {
var t = this;
this.getCodeTime.string = e + "秒后可重新获取";
this.getCodeBtn.active = !1;
this.schedule(function() {
if (0 != --e) t.getCodeTime.string = e + "秒后可重新获取"; else {
t.getCodeBtn.active = !0;
t.getCodeTime.string = "";
t.unscheduleAllCallbacks();
}
}, 1);
};
__decorate([ c(cc.Label) ], t.prototype, "phone", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "smsCodeNode", void 0);
__decorate([ c(cc.Node) ], t.prototype, "getCodeBtn", void 0);
__decorate([ c(cc.Label) ], t.prototype, "getCodeTime", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase"
} ],
Login: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "4cbd4RnNY9ItZekwXSZnsKY", "Login");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("SDKManager"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.version = null;
t.bottom = null;
t.isBtnEvevt = !1;
return t;
}
t.prototype.start = function() {
this.isAutoLogin();
};
t.prototype.onEnable = function() {
return __awaiter(this, void 0, void 0, function() {
var e;
return __generator(this, function() {
e = "v1.0." + wConstant.platform + ".8-0.1." + (wGameData.allVersion.Main || "0.0.1");
this.version.string = e;
return [ 2 ];
});
});
};
t.prototype.isAutoLogin = function() {
this.isBtnEvevt = !0;
var e = wGameData.getLastLogin();
if (e && wConstant.autoLogin) this.sendLogin(e); else {
var t = wGameData.getAPPID();
if (!t) {
t = n.wSDK.getUserToken();
wGameData.setAPPID(t);
}
}
};
t.prototype.sendLogin = function(e) {
if (!e.equipmentcard) {
var t = n.wSDK.getUserToken();
wGameData.setAPPID(t);
e.equipmentcard = t;
}
wGameData.accLoginInfo = e;
wNetWork.HttpRequest("Msg_User_Login", e).then(function(e) {
wGEvent.emit("local_Event", i.Config.local_Event.login_Success, e);
}).catch(function(t) {
t && 2 == t.status && wViewMgr.openPage({
path: i.Config.ViewConfig.LoginCheck,
data: e
});
});
};
t.prototype.guestLogin = function() {
var e = wGameData.getLastLogin();
e || (e = {
equipmentcard: wGameData.getAPPID(),
type: 2,
code: -1
});
this.sendLogin(e);
};
t.prototype.onClick = function(e) {
if (this.isBtnEvevt) {
wAudioMgr.playBtnSound();
switch (e.target.name) {
case "guest":
this.guestLogin();
break;

case "login":
wViewMgr.openPage({
path: i.Config.ViewConfig.AccountLogin
});
break;

case "wx":
wUIManager.showTips("暂未开放");
break;

case "all":
wViewMgr.openPage({
path: i.Config.ViewConfig.AllAccount
});
}
}
};
__decorate([ c(cc.Label) ], t.prototype, "version", void 0);
__decorate([ c(cc.Node) ], t.prototype, "bottom", void 0);
return __decorate([ s ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
SDKManager: "SDKManager"
} ],
LuckyPlayer: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e7271ss+jROuJbn/BqlZYfo", "LuckyPlayer");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.listPb = null;
t.showPb = null;
t.typeImg = [];
t.rankingImg = [];
t.content = null;
t.item = null;
t.listName = [];
t.newList = [];
t.historyList = [];
t.btnList = [];
t.isPlay = !0;
return t;
}
t.prototype.onLoad = function() {
wGEvent.on("Msg_Game_Back_List", this.Msg_Game_Back_List, this);
var e = wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function(t) {
if (1 == t.status) {
wGEvent.off(e);
wNetWork.send("Msg_Game_Back_List", {
level: wGameData.roomLevel
});
}
}, this);
};
t.prototype.Msg_Game_Back_List = function(e) {
var t = this;
if (1 == e.status) {
this.newList = e.data.new;
this.historyList = e.data.history;
this.listName = [];
this.newList.forEach(function(e) {
t.listName.push({
name: e.nickname,
type: e.type
});
});
this.historyList.forEach(function(e) {
t.listName.push({
name: e.nickname,
type: e.type
});
});
this.carouselName();
}
};
t.prototype.openShow = function() {
var e = this, t = cc.instantiate(this.listPb);
this.node.addChild(t, 10, "listContent");
var o = t.getChildByName("main");
wUIHelp.easeBackOut(o);
o.getChildByName("close").on("click", this.closeList, this);
var n = cc.find("content/toggle1", o), i = cc.find("checkmark/scrollView", n).getComponent(cc.ScrollView).content;
this.initList(i, this.newList);
n.on("click", function() {
wAudioMgr.playBtnSound();
});
var a = cc.find("content/toggle2", o);
a.on("toggle", function t() {
var o = cc.find("checkmark/scrollView", a).getComponent(cc.ScrollView).content;
e.initList(o, e.historyList);
a.off("toggle", t, e);
}, this);
a.on("click", function() {
wAudioMgr.playBtnSound();
});
};
t.prototype.carouselName = function() {
var e = this;
if (!(this.listName.length <= 0)) {
var t = function(t) {
e.item.getChildByName("label").getComponent(cc.Label).string = wUtils.handleNameLen(t.name, 8);
e.item.getChildByName("type").getComponent(cc.Sprite).spriteFrame = e.typeImg[t.type - 1];
}, o = 0;
t(this.listName[o++]);
var n = cc.delayTime(4), i = cc.moveTo(.2, cc.v2(0, 40)), a = cc.callFunc(function() {
e.item.y = -40;
o >= e.listName.length && (o = 0);
t(e.listName[o++]);
}), s = cc.moveTo(.2, cc.v2(0, 0)), c = cc.repeatForever(cc.sequence(n, i, a, s));
this.item.stopAllActions();
this.item.runAction(c);
}
};
t.prototype.initItem = function(e, t) {
var o = t.i, n = e.getChildByName("play");
n.data = t;
n.on("click", this.play, this);
var i = n.getComponent(cc.Button);
i.interactable = this.isPlay;
this.btnList.push(i);
e.getChildByName("type").getComponent(cc.Sprite).spriteFrame = this.typeImg[t.type - 1];
e.getChildByName("gold").getComponent(cc.Label).string = "23" == wGameData.gameID ? wUtils.numConvert(t.score) : t.score;
e.getChildByName("count").getComponent(cc.Label).string = t.playnum;
e.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(t.nickname, 12);
wUIHelp.setHead(e.getChildByName("head"), t.headimgurl);
var a = t.created.split(" ");
e.getChildByName("time1").getComponent(cc.Label).string = a[0];
e.getChildByName("time2").getComponent(cc.Label).string = a[1];
var s = e.getChildByName("ranking");
s.getComponent(cc.Sprite).spriteFrame = this.rankingImg[o > 3 ? 3 : o];
s.getChildByName("label").getComponent(cc.Label).string = o > 2 ? "" + (o + 1) : "";
e.active = !0;
var c = e.getChildByName("btn_ax");
if (c) {
var r = "" + wGameData.gameID + t.id + t.created, l = cc.sys.localStorage.getItem(r);
c.off("click");
c.getComponent(cc.Button).interactable = !l;
if (l) {
e.getChildByName("ax").getComponent(cc.Label).string = "1";
return;
}
e.getChildByName("ax").getComponent(cc.Label).string = "0";
c.on("click", function() {
cc.sys.localStorage.setItem(r, 1);
e.getChildByName("ax").getComponent(cc.Label).string = "1";
c.getComponent(cc.Button).interactable = !1;
}, this);
}
};
t.prototype.initList = function(e, t) {
var o = e.getComponent("Layout_z"), n = new cc.Component.EventHandler();
n.target = this.node;
n.component = "LuckyPlayer";
n.handler = "initItem";
o.eventHandler = n;
for (var i = 0; i < t.length; i++) {
var a = t[i];
a.i = i;
o._addClick(a);
}
};
t.prototype.closeList = function() {
wAudioMgr.playCloseSound();
var e = this.node.getChildByName("listContent"), t = e.getChildByName("main");
wUIHelp.easeIn(t, function() {
e.destroy();
});
};
t.prototype.openList = function() {
var e = this;
wAudioMgr.playBtnSound();
wNetWork.send("Msg_Game_Back_List", {
level: wGameData.roomLevel
}, !0);
var t = wGEvent.on("Msg_Game_Back_List", function() {
e.scheduleOnce(function() {
e.openShow();
wGEvent.off(t);
});
}, this);
};
t.prototype.play = function(e) {
var t = this;
wAudioMgr.playBtnSound();
var o = e.node.data;
wLog.i("--\x3e>要播放的信息：", o);
var n = wGEvent.on("Msg_Game_Back_Info", function(e) {
wGEvent.off(n);
if (1 == e.status) {
var i = cc.instantiate(t.showPb);
i.data = e.data;
i.data.nickname = o.nickname;
i.data.headimgurl = o.headimgurl;
wGameData.setTypeData("LP_DATA", e.data);
cc.Canvas.instance.node.getChildByName("Game").addChild(i, 1e3);
}
}, this);
wNetWork.send("Msg_Game_Back_Info", {
id: o.id
}, !0);
};
t.prototype.setBtnState = function(e) {
this.isPlay = e;
for (var t = 0, o = this.btnList; t < o.length; t++) o[t].interactable = e;
};
__decorate([ a(cc.Prefab) ], t.prototype, "listPb", void 0);
__decorate([ a(cc.Prefab) ], t.prototype, "showPb", void 0);
__decorate([ a([ cc.SpriteFrame ]) ], t.prototype, "typeImg", void 0);
__decorate([ a([ cc.SpriteFrame ]) ], t.prototype, "rankingImg", void 0);
__decorate([ a(cc.Node) ], t.prototype, "content", void 0);
__decorate([ a(cc.Node) ], t.prototype, "item", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
MailDetails: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "836d2c1iZtJMJNr/qfYri9K", "MailDetails");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.cb = null;
return t;
}
t.prototype.onLoad = function() {};
t.prototype.init = function(e) {
this.cb = e.cb;
this.main.getChildByName("tips").getComponent(cc.Label).string = e.data.content;
};
t.prototype.onClick = function() {
wAudioMgr.playBtnSound();
this.cb && this.cb();
this.hide();
};
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
Mail: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "271b3pS5VlCJYc9EkObOIJZ", "Mail");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = e("Constant"), s = cc._decorator, c = s.ccclass, r = s.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.img = [];
return t;
}
t.prototype.onLoad = function() {
wGameData.setKey("mail", 0);
wGEvent.on("Msg_Hall_MailList", this.Msg_Hall_MailList, this);
wNetWork.send("Msg_Hall_MailList", []);
};
t.prototype.Msg_Hall_MailList = function(e) {
1 == e.status && this.initList(JSON.parse(JSON.stringify(e.data)));
};
t.prototype.initList = function(e) {
var t = this;
e.sort(function(e, t) {
return e.status - t.status;
});
for (var o = {
1: "【赠送】",
2: "【系统邮件】"
}, n = function(n) {
var s = i.content.children[n], c = e[n];
if (3 == c.status) {
wLog.e("有撤回的邮件");
return "continue";
}
s || ((s = cc.instantiate(i.content.children[0])).parent = i.content);
"cjbySx" == wGameData.getCJBY() && "jhlmTest" != a.Constant.serverType && (c.status = 2);
var r = s.getChildByName("time").getComponent(cc.Label);
r.string = c.created;
r.node.color = 2 == c.type ? cc.color(210, 221, 255) : cc.color(255, 255, 255);
s.getChildByName("ID").getComponent(cc.Label).string = 2 == c.type ? "" : c.outuid;
var l = s.getChildByName("t").getComponent(cc.Label);
l.string = o[c.type];
l.node.color = 2 == c.type ? cc.color(210, 221, 255) : cc.color(255, 246, 0);
var p = s.getChildByName("btn_sc");
p.active = c.status > 1;
var u = s.getChildByName("btn_ck");
u.active = !p.active;
var d = s.getChildByName("s").getComponent(cc.Sprite);
d.spriteFrame = 0 == c.status ? i.img[1] : i.img[0];
s.active = !0;
s.zIndex = c.status;
s.DATA = wUtils.creatorProxy(c);
s.DATA.onEvevt("status", function(e) {
p.active = e > 1;
u.active = !p.active;
s.zIndex = e;
d.spriteFrame = 0 == e ? t.img[1] : t.img[0];
});
s.DATA.onEvevt("delete", function() {
s.destroy();
t.main.getChildByName("no").active = t.content.childrenCount <= 0;
wNetWork.send("Msg_Hall_TouchMail", {
id: c.id,
type: 3
});
});
}, i = this, s = 0; s < e.length; s++) n(s);
this.main.getChildByName("no").active = !e.length;
};
t.prototype.onHide = function() {
if (1 != wGameData.getKey("mail")) {
for (var e = 0, t = this.content.children; e < t.length; e++) {
var o = t[e];
if (o.DATA && o.DATA.status < 2) {
wGameData.setKey("mail", 1);
wGEvent.emit("local_Event", i.Config.local_Event.mailHD, !0);
return;
}
}
wGEvent.emit("local_Event", i.Config.local_Event.mailHD, !1);
} else wGEvent.emit("local_Event", i.Config.local_Event.mailHD, !0);
};
t.prototype.onClick = function(e, t) {
if ("sc" == t) e.target.parent.DATA.delete = !0; else {
var o = e.target.DATA;
!o && (o = e.target.parent.DATA);
if (0 == o.status) {
o.status = 1;
wNetWork.send("Msg_Hall_TouchMail", {
id: o.id,
type: 1
});
}
wViewMgr.openPage({
path: i.Config.ViewConfig.MailDetails,
data: o
});
}
};
__decorate([ r(cc.Node) ], t.prototype, "content", void 0);
__decorate([ r([ cc.SpriteFrame ]) ], t.prototype, "img", void 0);
return __decorate([ c ], t);
}(n.default);
o.default = l;
cc._RF.pop();
}, {
Config: "Config",
Constant: "Constant",
PopupBase: "PopupBase"
} ],
Main: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "9de9a34JkBAIJ12HOkaTZrA", "Main");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Constant"), i = e("AudioManager"), a = e("UIManager"), s = e("EventDispatcher"), c = e("LogManager"), r = e("NetWork"), l = e("GameData"), p = e("Utils"), u = e("UIHelp"), d = e("ViewManager"), h = e("ResLoader"), g = e("Config"), f = e("Scenebase"), m = e("FirstHotupDate"), _ = cc._decorator, y = _.ccclass, v = _.property, w = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.HotupDate = null;
t.logo = [];
return t;
}
t.prototype.onLoad = function() {
this.init();
cc.find("bg/xf", this.node).active = !0;
var e = cc.find("bg/logo" + wConstant.platform, this.node);
e && (e.active = !0);
wGEvent.on("local_Event", this.local_Event, this);
cc.sys.os == cc.sys.OS_IOS && jsb.reflection.callStaticMethod("RootViewController", "removeSplashImageView");
if (wGameData.resAsset) {
for (var t = 0, o = wGameData.resAsset; t < o.length; t++) {
var n = o[t];
wRes.releaseAsset(n);
}
wGameData.resAsset = null;
}
cc.director.getPhysicsManager().enabled = !0;
};
t.prototype.local_Event = function(e, t) {
switch (e) {
case g.Config.local_Event.login_Success:
wConstant.token = t.token;
wNetWork.connect();
}
};
t.prototype.Msg_Hall_Connect = function(e) {
var t = wGameData.accLoginInfo;
wGameData.setLastLogin(t);
var o = wGameData.getAllAccInfo();
o[e.uid] || (o[e.uid] = {});
o[e.uid].accInfo = t;
var n = JSON.parse(JSON.stringify(e));
delete n.gameinfo;
delete n.gamestatus;
o[e.uid].info = n;
wGameData.setAllAccInfo(o);
this.node.getChildByName("FirstHotupDate").getComponent("FirstHotupDate").preload();
this.node.getChildByName("Login").active = !1;
};
t.prototype.init = function() {
this.node.getChildByName("kf").zIndex = 299;
var e = window;
if (!e.wConstant) {
e.wUtils = new p.Utils();
e.wUIHelp = new u.UIHelp();
e.wGameData = l.HallCreatorProxy();
e.wConstant = new n.Constant();
e.wAudioMgr = new i.AudioManager();
e.wUIManager = new a.UIManager();
e.wGEvent = new s.EventDispatcher();
e.wLog = new c.LogManager();
e.wNetWork = new r.NetWork();
e.wViewMgr = new d.ViewManager();
e.wRes = new h.ResLoader();
var t = this.node.parent, o = t.getChildByName("ConfirmBox");
o.active = !1;
o.zIndex = 100;
cc.game.addPersistRootNode(o);
var g = t.getChildByName("Tips");
cc.game.addPersistRootNode(g);
g.zIndex = 200;
var f = t.getChildByName("Loading");
f.active = !1;
f.zIndex = 300;
cc.game.addPersistRootNode(f);
var m = t.getChildByName("Night");
m.opacity = 0;
m.zIndex = 999;
cc.game.addPersistRootNode(m);
this.node.getChildByName("WEB").destroy();
if (wConstant.isCheckHotUp) {
jsb.Device.setKeepScreenOn(!0);
this.initTryCatch();
}
cc.game.setFrameRate(59);
cc.macro.ENABLE_MULTI_TOUCH = !1;
cc.debug.setDisplayStats(!1);
if (wConstant.isCheckHotUp) {
(_ = cc.assetManager.presets.preload).maxConcurrency = 4;
_.maxRequestsPerFrame = 4;
} else {
var _;
(_ = cc.assetManager.presets.preload).maxConcurrency = 8;
_.maxRequestsPerFrame = 8;
}
cc.director.preloadScene("Hall", function() {}, function() {
wLog.i("-----------\x3e预加载大厅资源成功");
});
this.initWeb();
}
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "xf":
wViewMgr.openPage({
path: "Prefab/GameRepair"
});
break;

case "kf":
wUIManager.showServiceChat(n.ServiceListID.logokf, "游戏客服");
break;

case "webbg":
cc.view.enableAutoFullScreen(!1);
break;

case "yes":
wLog.i("----------打开全屏");
cc.sys.os === cc.sys.OS_IOS && wLog.i("----------ios打开全屏-------");
cc.view.enableAutoFullScreen(!1);
this.scheduleOnce(function() {
cc.view.enableAutoFullScreen(!0);
});
cc.find("WEB", this.node).destroy();
break;

case "no":
wLog.i("----------不打开全屏");
cc.view.enableAutoFullScreen(!1);
cc.find("WEB", this.node).destroy();
}
};
t.prototype.initTryCatch = function() {
var e = window;
cc.sys.isNative || cc.sys.isMobile ? e.__errorHandler = function(e, t, o, n, i) {
var a = {};
a.errorMessage = e;
a.file = t;
a.line = o;
a.message = n;
a.error = i;
JSON.stringify(a.error.stack);
} : cc.sys.isBrowser && (e.onerror = function(t, o, n, i, a) {
var s = {};
s.errorMessage = t;
s.file = o;
s.line = n;
s.message = i;
s.error = a;
var c = JSON.stringify(s.error.stack);
e.exception != c && (e.exception = c);
});
};
t.prototype.initWeb = function() {};
__decorate([ v(m.default) ], t.prototype, "HotupDate", void 0);
__decorate([ v(sp.SkeletonData) ], t.prototype, "logo", void 0);
return __decorate([ y ], t);
}(f.SceneBase);
o.default = w;
cc._RF.pop();
}, {
AudioManager: "AudioManager",
Config: "Config",
Constant: "Constant",
EventDispatcher: "EventDispatcher",
FirstHotupDate: "FirstHotupDate",
GameData: "GameData",
LogManager: "LogManager",
NetWork: "NetWork",
ResLoader: "ResLoader",
Scenebase: "Scenebase",
UIHelp: "UIHelp",
UIManager: "UIManager",
Utils: "Utils",
ViewManager: "ViewManager"
} ],
ModIfyBankPwd: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "28124lcWq1ElL2l0ziWCZFj", "ModIfyBankPwd");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.showPage = null;
t.usedPwd = null;
t.pwd = null;
t.confirmPwd = null;
t.gold = null;
t.bankGold = null;
return t;
}
t.prototype.onLoad = function() {
this.init();
wGEvent.on("local_Event", this.local_Event, this);
this.node.on("toggle", this.toggle, this);
wGEvent.on("Msg_Hall_ChangeBankPass", this.Msg_Hall_ChangeBankPass, this);
};
t.prototype.local_Event = function(e) {
switch (e) {
case "up_Gold":
this.init();
}
};
t.prototype.init = function() {
this.gold.string = wUtils.numConvert(wGameData.getKey("gold"));
this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank"));
};
t.prototype.Msg_Hall_ChangeBankPass = function(e) {
if (1 == e.status) {
wUIManager.showTips("保险柜密码修改成功，请牢记您的新保险柜密码！", wUIManager.TIPS_OK);
wGameData.setKey("bankpass", this.pwd.string);
wGameData.bankPow = this.pwd.string;
this.usedPwd.string = "";
this.pwd.string = "";
this.confirmPwd.string = "";
}
};
t.prototype.toggle = function() {
wAudioMgr.playBtnSound();
this.showPage.check();
};
t.prototype.send = function() {
var e = this.usedPwd.string, t = this.pwd.string, o = this.confirmPwd.string;
if (wUtils.checkPwd(e) && e) if (wUtils.checkPwd(t) && t) if (o) if (t == o) if (t != e) if (wGameData.getKey("bankpass") == e) {
var n = {
oldpass: e,
newpass: t
};
wNetWork.send("Msg_Hall_ChangeBankPass", n);
} else wUIManager.showTips("密码不正确！"); else wUIManager.showTips("新密码和旧密码不能一样"); else wUIManager.showTips("密码不一致，请重新输入！"); else wUIManager.showTips("请再次输入密码！"); else wUIManager.showTips("请输入密码！"); else wUIManager.showTips("请输入密码！");
};
t.prototype.onClick = function() {
wAudioMgr.playBtnSound();
this.send();
};
__decorate([ a(cc.Toggle) ], t.prototype, "showPage", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "usedPwd", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "pwd", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "confirmPwd", void 0);
__decorate([ a(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ a(cc.Label) ], t.prototype, "bankGold", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
MultiBase: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "47238aHDB5DDJxO+Lt8//62", "MultiBase");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass;
n.property;
var a = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.m_quitGame = function() {
var e = this, t = !1, o = setTimeout(function() {
if (!t) {
t = !0;
wViewMgr.quitGame();
}
}, 1e4);
wUIManager.showGameOutTips({
okCB: function() {
wNetWork.send("Msg_" + e.m_game + "_Out", [], !0);
setTimeout(function() {
if (!t) {
t = !0;
clearTimeout(o);
wViewMgr.quitGame();
}
}, 3e3);
}
});
};
t.prototype.m_setBankBtn = function(e) {
wGEvent.emit("local_Event", "setGameBankBtn", e);
};
t.prototype.m_init = function() {
var e = this;
this.m_game = wGameData.getGameName();
wGEvent.on("Msg_" + this.m_game + "_Out", this.m_msg_quitGame, this);
wGEvent.on("Msg_Hall_FinishLoad", this.Msg_Hall_FinishLoad, this);
wGEvent.on("Msg_" + this.m_game + "_RoomInfo", function(t) {
wUIManager.hideLoadingUI();
if (1 == t.status) e.m_roomInfo(t.data); else {
wLog.e("获取游戏场景信息失败");
e.m_msg_quitGame({
status: 1
});
}
}, this);
wGEvent.on("Msg_Hall_Connect", function(t) {
if (1 == t.status) if (wGameData.getKey("rid")) {
var o = wGameData.getGame();
wRes.loadRes(o.prefabUrl, function(t, o) {
wUIManager.showLoadingUI();
wAudioMgr.stopAllEffects();
cc.instantiate(o).parent = e.node.parent;
e.node.removeFromParent();
e.node.destroy();
}, o.enName);
} else {
wUIManager.showTips("房间以解散", wUIManager.TIPS_OK);
e.m_msg_quitGame({
status: 1,
data: {
uid: wGameData.getKey("uid")
}
});
} else wLog.e("验证失败");
}, this);
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("local_SocketState", this.m_NetWorkState, this);
wNetWork.send("Msg_Hall_FinishLoad", {
rid: wGameData.roomID
});
};
t.prototype.local_Event = function(e) {
switch (e) {
case "up_Gold":
this.m_upGameGold();
}
};
t.prototype.Msg_Hall_FinishLoad = function(e) {
if (1 == e.status) ; else {
wLog.e("进房加载消息失败");
this.m_msg_quitGame({
status: 1,
data: {
uid: wGameData.getKey("uid")
}
});
}
};
t.prototype.m_msg_quitGame = function(e) {
if (1 == e.status) {
if (e.data && e.data.uid == wGameData.getKey("uid")) {
var t = e.data.gold;
try {
var o = cc.Canvas.instance.node.getChildByName("Room"), n = o && o.children[0];
if (n) {
n.removeFromParent();
n.destroy();
}
} catch (e) {
wLog.e("退出清理节点异常: " + e);
}
wViewMgr.quitGame(t);
}
} else wLog.e("退出游戏失败");
};
return __decorate([ i ], t);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
NetInterface: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e7101qCPhRI6qxIYhBQsKJq", "NetInterface");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ProtocolHelper = o.netWorkState = void 0;
var n = e("Config");
(function(e) {
e.CLOSED = "socket---已关闭";
e.CLOSEDING = "socket---关闭中";
e.CONNECTING = "socket---连接中";
e.CONNECTSUCCESS = "socket---连接成功";
e.RECONNECT = "socket---重新连接中";
e.RECONNECTSUCCESS = "socket---重新连接成功";
e.RECONNECTFAIL = "socket---重新连接失败";
})(o.netWorkState || (o.netWorkState = {}));
var i = function() {
function e() {}
e.prototype.setMsgData = function(e, t) {
void 0 === t && (t = []);
var o = {
event: e,
area: 0,
uid: wGameData.getKey("uid") || 0,
data: t
};
n.Config.NoLogMsg[e] || wLog.i("send: " + e, JSON.stringify(o));
return Base64.encode(JSON.stringify(o));
};
e.prototype.setMsgPackage = function(e, t) {
return this.setMsgData(e, t);
};
e.prototype.getMsgUnpack = function(e) {
e = JSON.parse(Base64.decode(e));
n.Config.NoLogMsg[e.event] || wLog.i("Message: " + e.event, JSON.stringify(e));
return e;
};
return e;
}();
o.ProtocolHelper = new i();
cc._RF.pop();
}, {
Config: "Config"
} ],
NetNode: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "10b0aEMvgNDiqjLx1vQkhcs", "NetNode");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.NetNode = void 0;
var n = e("NetInterface"), i = e("WebSock"), a = function() {
function e(e, t) {
this._isSocketInit = !1;
this._socket = null;
this._state = n.netWorkState.CLOSED;
this._socketUrl = null;
this._keepAliveTimer = null;
this._receiveMsgTimer = null;
this._reconnectTimer = null;
this._heartTime = 5e3;
this._receiveTime = 1e4;
this._reconnetTimeOut = 500;
this._autoReconnect = wConstant.autoReconnect;
this._isReconnet = !1;
this._loadingUIList = {};
wLog.w("创建 socker");
this._socket = new i.WebSock();
this.netWorkStateCB = e;
this.onMessageCB = t;
}
e.prototype.connect = function(e) {
if (this._socket && this._state == n.netWorkState.CLOSED) {
this.netWorkStateCB(n.netWorkState.CONNECTING);
this._isSocketInit || this.initSocket();
this._state = n.netWorkState.CONNECTING;
if (!this._socket.connect(e)) return !1;
this._socketUrl = e;
return !0;
}
return !1;
};
e.prototype.close = function() {
if (this._state != n.netWorkState.CLOSED) {
this.clearTimer();
this.netWorkStateCB(n.netWorkState.CLOSEDING);
this._state = n.netWorkState.CLOSED;
this._socket && this._socket.close();
}
};
e.prototype.onClosed = function() {
var e = this;
this.clearTimer();
this._state = n.netWorkState.CLOSED;
this.netWorkStateCB(n.netWorkState.CLOSED);
if (this.isAutoReconnect()) {
this._isReconnet = !0;
this.netWorkStateCB(n.netWorkState.RECONNECT);
this._reconnectTimer = setTimeout(function() {
e._socket.close();
e.connect(e._socketUrl);
if (e._autoReconnect > 0) {
e._autoReconnect -= 1;
wLog.w("第" + (wConstant.autoReconnect - e._autoReconnect) + "次重新连接");
}
}, this._reconnetTimeOut);
} else if (this._isReconnet) {
wLog.w("重新连接失败");
this.netWorkStateCB(n.netWorkState.RECONNECTFAIL);
this.rejectReconnect();
}
};
e.prototype.onConnected = function() {
this.openReconnect();
this._state = n.netWorkState.CONNECTSUCCESS;
this._isReconnet ? this.netWorkStateCB(n.netWorkState.RECONNECTSUCCESS) : this.netWorkStateCB(n.netWorkState.CONNECTSUCCESS);
this._isReconnet = !1;
this.resetHearbeatTimer();
};
e.prototype.onMessage = function(e) {
e = n.ProtocolHelper.getMsgUnpack(e);
if (this._loadingUIList[e.event]) {
wUIManager.hideLoadingUI();
delete this._loadingUIList[e.event];
}
this.onMessageCB(e);
this.resetReceiveMsgTimer();
};
e.prototype.send = function(e, t, o) {
void 0 === o && (o = !1);
if (this._state == n.netWorkState.CONNECTSUCCESS) {
if (o) {
wUIManager.showLoadingUI();
this._loadingUIList[e] = !0;
}
var i = n.ProtocolHelper.setMsgPackage(e, t);
return this._socket.send(i);
}
wLog.e("发送失败:", this._state);
return !1;
};
e.prototype.onError = function() {};
e.prototype.resetReceiveMsgTimer = function() {
var e = this;
null !== this._receiveMsgTimer && clearTimeout(this._receiveMsgTimer);
this._receiveMsgTimer = setTimeout(function() {
e._socket.close();
}, this._receiveTime);
};
e.prototype.resetHearbeatTimer = function() {
var e = this;
null !== this._keepAliveTimer && clearTimeout(this._keepAliveTimer);
this._keepAliveTimer = setInterval(function() {
e.send("Msg_Hall_Heart", []);
}, this._heartTime);
};
e.prototype.clearTimer = function() {
null !== this._receiveMsgTimer && clearTimeout(this._receiveMsgTimer);
null !== this._keepAliveTimer && clearTimeout(this._keepAliveTimer);
null !== this._reconnectTimer && clearTimeout(this._reconnectTimer);
};
e.prototype.isAutoReconnect = function() {
return 0 != this._autoReconnect;
};
e.prototype.rejectReconnect = function() {
this._autoReconnect = 0;
this.clearTimer();
};
e.prototype.openReconnect = function() {
this._autoReconnect = wConstant.autoReconnect;
this.clearTimer();
};
e.prototype.initSocket = function() {
var e = this;
this._socket.onConnected = function(t) {
e.onConnected(t);
};
this._socket.onMessage = function(t) {
e.onMessage(t);
};
this._socket.onError = function(t) {
e.onError(t);
};
this._socket.onClosed = function(t) {
e.onClosed(t);
};
this._isSocketInit = !0;
};
return e;
}();
o.NetNode = a;
cc._RF.pop();
}, {
NetInterface: "NetInterface",
WebSock: "WebSock"
} ],
NetWork: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "d7855539HVInLmli0+7ZB9C", "NetWork");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.NetWork = void 0;
var n = e("SDKManager"), i = e("HTTP"), a = e("NetInterface"), s = e("NetNode"), c = e("Config");
function r(e, t, o) {
void 0 === t && (t = null);
void 0 === o && (o = !1);
o && wUIManager.showLoadingUI();
var n = {
event: e,
data: t
};
e = wConstant.httpServer + e.split("_")[2];
wLog.i("请求URL：", e);
wLog.i("发送数据:", JSON.stringify(n));
n = "data=" + JSON.stringify(n);
return new Promise(function(t, o) {
i.default.httpRequest(e, n, function(e) {
wLog.i("收到数据:", JSON.stringify(e));
t(e.data);
}, function(e) {
o(e);
wLog.e("HTTP错误:", e);
});
});
}
var l = function(e) {
return __awaiter(void 0, void 0, void 0, function() {
var t, o;
return __generator(this, function() {
wLog.w("socket状态：  " + e);
if (e == a.netWorkState.CLOSED) ; else if (e == a.netWorkState.CLOSEDING) ; else if (e == a.netWorkState.CONNECTING) ; else if (e == a.netWorkState.CONNECTSUCCESS || e == a.netWorkState.RECONNECTSUCCESS) if ("Main" != wConstant.openScene) {
if (!(t = wGameData.getLastLogin() || {}).equipmentcard) {
o = n.wSDK.getUserToken();
wGameData.setAPPID(o);
t.equipmentcard = o;
}
wGameData.accLoginInfo = t;
wNetWork.HttpRequest("Msg_User_Login", t).then(function(e) {
return __awaiter(void 0, void 0, void 0, function() {
return __generator(this, function() {
wConstant.token = e.token;
wNetWork.send("Msg_Hall_Connect", {
token: wConstant.token
}, !0);
return [ 2 ];
});
});
}).catch(function() {
wUIManager.showConfirmUI({
content: "登录信息已失效，请重新登录",
okCB: function() {
wViewMgr.openScene("Main");
},
openRClose: !1,
horizntalAlign: cc.Label.HorizontalAlign.CENTER
});
});
} else wNetWork.send("Msg_Hall_Connect", {
token: wConstant.token
}); else if (e == a.netWorkState.RECONNECT) wUIManager.showLoadingUI(); else if (e == a.netWorkState.RECONNECTFAIL) {
wUIManager.hideLoadingUI();
wUIManager.showConfirmUI({
content: "登录信息已失效，请重新登录",
okCB: function() {
"Main" != wConstant.openScene && wViewMgr.openScene("Main");
},
openRClose: !1,
horizntalAlign: cc.Label.HorizontalAlign.CENTER
});
}
wGEvent.emit("local_SocketState", e);
return [ 2 ];
});
});
}, p = function(e) {
return __awaiter(void 0, void 0, void 0, function() {
var t, o, n, i, a;
return __generator(this, function() {
if ("Msg_Hall_Heart" == e.event) return [ 2 ];
1 == e.status || c.Config.NoTipsMsg[e.event] || wUIManager.showTips(e.msg);
if ("Msg_Hall_Connect" == e.event) {
if (1 == e.status) {
wGameData.roomID = e.data.rid;
wGameData.setPlayerData(e.data);
t = e.data.gamestatus;
for (o in t) {
n = t[o];
for (i in n) wGameData.gameState[i] = n[i];
}
} else wUIManager.showConfirmUI({
content: "登录信息已失效，请重新登录！",
okCB: function() {
if ("Main" != wConstant.openScene) {
wNetWork.rejectReconnect();
wNetWork.close();
wViewMgr.openScene("Main");
}
},
openRClose: !1
});
wUIManager.hideLoadingUI();
} else if ("Msg_Hall_ERROR" == e.event) {
wUIManager.hideLoadingUI();
switch ((a = e.data).state) {
case 1:
wNetWork.rejectReconnect();
wNetWork.close();
wUIManager.showConfirmUI({
content: "网络连接中断，请重新登录！",
okCB: function() {
wViewMgr.openScene("Main");
},
openRClose: !1
});
return [ 2 ];

case 2:
wUIManager.showTips(a.info);
return [ 2 ];

case 3:
wViewMgr.enterHall();
return [ 2 ];
}
} else if ("Msg_Hall_GameStatus" == e.event) {
t = e.data;
for (o in t) {
n = t[o];
for (i in n) wGameData.gameState[i] = n[i];
}
} else if ("Msg_Hall_GameMaintenance" == e.event) wConstant.gameStatus = e.data.state; else if ("Msg_Hall_ChangeGolds" == e.event) {
a = e.data;
wGameData.setKey("bank", a.bank);
wGameData.setKey("gold", a.gold);
if (1 == a.type) wUIManager.showConfirmUI_B({
type: 1,
gold: a.recharge
}); else if (2 == a.type) {
wGameData.setKey("monthcard", 30);
wGameData.setKey("relief", 3);
wUIManager.showConfirmUI_B({
type: 2,
gold: a.recharge
});
}
} else if ("Msg_Hall_EnterRoom" == e.event) 1 != e.status && (wGameData.roomID = null); else if ("Msg_Hall_GetBenefits" == e.event && 1 == e.status) {
wLog.w("领取救济金成功");
wGameData.setKey("bank", e.data.bank);
}
wGEvent.emit(e.event, e);
return [ 2 ];
});
});
}, u = function() {
function e() {
this.HttpRequest = r;
this.socket = null;
cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);
}
e.prototype.connect = function() {
this.socket || (this.socket = new s.NetNode(l, p));
return this.socket.connect(wConstant.webServer);
};
e.prototype.send = function(e, t, o) {
void 0 === o && (o = !1);
if (this.socket) return this.socket.send(e, t, o);
wLog.e("socket 未连接! 调用发送接口");
return !1;
};
e.prototype.rejectReconnect = function() {
this.socket ? this.socket.rejectReconnect() : wLog.e("socket 未连接! 调用取消重连接口");
};
e.prototype.close = function() {
this.socket ? this.socket.close() : wLog.e("socket 未连接! 调用关闭接口");
};
e.prototype.onShow = function() {
wLog.w("切换到前台");
};
e.prototype.onHide = function() {
wLog.w("切换到后台");
};
return e;
}();
o.NetWork = u;
cc._RF.pop();
}, {
Config: "Config",
HTTP: "HTTP",
NetInterface: "NetInterface",
NetNode: "NetNode",
SDKManager: "SDKManager"
} ],
Night: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "4fea84nHKpGEp0V3SoHzbAA", "Night");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass;
n.property;
var a = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.start = function() {
var e = Number(cc.sys.localStorage.getItem("Night")), t = wGameData.get_day_night();
e ? 1 == e ? wUIManager.show_day_night(!1) : 2 == e && wUIManager.show_day_night(!0) : wUIManager.show_day_night(t);
};
return __decorate([ i ], t);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
NodePool: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "a6b08KBa6BMQ4jgGV/880rU", "NodePool");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = function() {
function e(e, t) {
void 0 === t && (t = 0);
this.copy = e;
this.count = t;
this.enemyPool = new cc.NodePool();
for (var o = 0; o < this.count; ++o) {
var n = cc.instantiate(this.copy);
this.enemyPool.put(n);
}
}
Object.defineProperty(e.prototype, "getNode", {
get: function() {
return this.enemyPool.size() > 0 ? this.enemyPool.get() : cc.instantiate(this.copy);
},
enumerable: !1,
configurable: !0
});
e.prototype.put = function(e) {
cc.isValid(e) && this.enemyPool.put(e);
};
e.prototype.clear = function() {
this.enemyPool.clear();
};
e.prototype.recoveryAll = function(e) {
if (cc.isValid(e)) for (;e.childrenCount > 0; ) this.put(e.children[0]);
};
return e;
}();
o.default = n;
cc._RF.pop();
}, {} ],
PageViewIndicator_z: [ function(e, t) {
"use strict";
cc._RF.push(t, "098ecf3apBHfZ6M/2at4djM", "PageViewIndicator_z");
cc.Class({
extends: cc.PageViewIndicator,
editor: !1,
_changedState: function() {
var e = this._indicators;
if (0 !== e.length) {
var t = this._pageView._curPageIdx;
if (!(t > e.length)) {
for (var o = 0; o < e.length; ++o) e[o].opacity = 127.5;
var n = t - 1;
n < 0 && (n = e.length - 1);
e[n].opacity = 255;
}
}
},
_refresh: function() {
if (this._pageView) {
var e = this._indicators, t = this._pageView.getPages();
if (t.length !== e.length) {
var o = 0;
if (t.length > e.length) for (o = 0; o < t.length - 2; ++o) e[o] || (e[o] = this._createIndicator()); else for (o = e.length - t.length; o > 0; --o) {
var n = e[o - 1];
this.node.removeChild(n);
e.splice(o - 1, 1);
}
this._layout && this._layout.enabledInHierarchy && this._layout.updateLayout();
this._changedState();
}
}
}
});
cc._RF.pop();
}, {} ],
PageView_z: [ function(e, t) {
"use strict";
cc._RF.push(t, "7ee76kgqHBDMZ2+w3H3R86w", "PageView_z");
cc.Class({
extends: cc.Component,
editor: {
executionOrder: -1
},
properties: {
loopPlay: {
default: !0,
displayName: "自动播放"
},
loopTime: {
default: 3,
displayName: "播放时间间隔"
}
},
onLoad: function() {
var e = this;
this.parview = this.node.getComponent(cc.PageView);
this.viewNode = this.parview.content;
for (var t = [], o = 0; o < this.viewNode.children.length; o++) {
var n = this.viewNode.children[o];
n.active && t.push(n);
}
this.itemLen = t.length;
this.viewNode.removeAllChildren();
this.parview.insertPage(cc.instantiate(t[t.length - 1]), 0);
for (var i = 0; i < t.length; i++) this.parview.insertPage(t[i], i + 1);
this.parview.insertPage(cc.instantiate(t[0]), t.length + 1);
this.node.on("page-turning", this.PageTurning, this);
if (this.loopPlay) {
this.node.on("scroll-began", function() {
e.Scrolling("scroll-began");
}, this);
this.node.on("scroll-ended", function() {
e.Scrolling("scroll-ended");
}, this);
this._bool = !0;
this.unscheduleAllCallbacks();
this.StopAndPlay();
}
var a = this.parview.indicator, s = a.spriteFrame, c = a.cellSize, r = a.spacing, l = a.direction;
a.node.removeAllChildren();
var p = a.node.addComponent("PageViewIndicator_z");
p.spriteFrame = s;
p.cellSize = c;
p.spacing = r;
p.direction = l;
this.parview.indicator = p;
},
start: function() {
var e = this;
this.scheduleOnce(function() {
e.parview.scrollToPage(1, .01);
});
},
StopAndPlay: function() {
var e = this;
if (this._bool) {
this._bool = !1;
this.schedule(function() {
e.parview.isScrolling() || e.parview.scrollToPage(e.parview.getCurrentPageIndex() + 1, e.parview.pageTurningSpeed);
}, this.loopTime);
}
},
PageTurning: function() {
var e = this.parview.getCurrentPageIndex();
e == this.itemLen + 1 ? this.parview.scrollToPage(1, .01) : 0 == e && this.parview.scrollToPage(this.itemLen, .01);
},
Scrolling: function(e) {
switch (e) {
case "scroll-began":
this._bool = !0;
this.unscheduleAllCallbacks();
break;

case "scroll-ended":
this.StopAndPlay();
}
},
onDestroy: function() {
this.unscheduleAllCallbacks();
}
});
cc._RF.pop();
}, {} ],
PlayerCheck: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "f66e9V1TjlH+rs+HstCQzOl", "PlayerCheck");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.uid = null;
t.nickname = null;
t.head = null;
t.headF = null;
return t;
}
t.prototype.init = function(e) {
this.uid.string = "" + e.uid;
this.nickname.string = "" + e.nickname;
wUIHelp.setHead(this.head, e.headimgurl);
wUIHelp.setHeadFrame(this.headF, e.pictureframe);
};
__decorate([ s(cc.Label) ], t.prototype, "uid", void 0);
__decorate([ s(cc.Label) ], t.prototype, "nickname", void 0);
__decorate([ s(cc.Sprite) ], t.prototype, "head", void 0);
__decorate([ s(cc.Sprite) ], t.prototype, "headF", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
PokerBase: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "633bbf97q9FQa25NtKVgtOp", "PokerBase");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass;
n.property;
var a = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.m_quitGame = function() {
var e = this;
wUIManager.showGameOutTips({
okCB: function() {
wNetWork.send("Msg_" + e.m_game + "_Out", [], !0);
}
});
};
t.prototype.m_setBankBtn = function(e) {
wGEvent.emit("local_Event", "setGameBankBtn", e);
};
t.prototype.m_init = function() {
var e = this;
this.m_game = wGameData.getGameName();
wGEvent.on("Msg_" + this.m_game + "_Out", this.m_msg_quitGame, this);
wGEvent.on("Msg_Hall_FinishLoad", this.Msg_Hall_FinishLoad, this);
wGEvent.on("Msg_" + this.m_game + "_RoomInfo", function(t) {
wUIManager.hideLoadingUI();
if (1 == t.status) e.m_roomInfo(t.data); else {
wLog.e("获取游戏场景信息失败");
e.m_msg_quitGame({
status: 1
});
}
}, this);
wGEvent.on("Msg_Hall_Connect", function(t) {
if (1 == t.status) if (wGameData.getKey("rid")) {
var o = wGameData.getGame();
wRes.loadRes(o.prefabUrl, function(t, o) {
wUIManager.showLoadingUI();
wAudioMgr.stopAllEffects();
cc.instantiate(o).parent = e.node.parent;
e.node.removeFromParent();
e.node.destroy();
}, o.enName);
} else {
wUIManager.showTips("房间以解散", wUIManager.TIPS_OK);
e.m_msg_quitGame({
status: 1,
data: {
uid: wGameData.getKey("uid")
}
});
} else wLog.e("验证失败");
}, this);
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("local_SocketState", this.m_NetWorkState, this);
wNetWork.send("Msg_Hall_FinishLoad", {
rid: wGameData.roomID
});
};
t.prototype.local_Event = function(e) {
switch (e) {
case "up_Gold":
this.m_upGameGold();
}
};
t.prototype.Msg_Hall_FinishLoad = function(e) {
if (1 == e.status) ; else {
wLog.e("进房加载消息失败");
wNetWork.send("Msg_Hall_EnterRoom", {
tableid: 0,
gtype: wGameData.gameID,
level: wGameData.roomLevel
});
this.m_msg_quitGame({
status: 1,
data: {
uid: wGameData.getKey("uid")
}
});
}
};
t.prototype.m_msg_quitGame = function(e) {
wUIManager.hideLoadingUI();
if (1 == e.status) {
if (e.data && e.data.uid == wGameData.getKey("uid")) {
var t = e.data.gold;
wViewMgr.quitGame(t);
}
} else wLog.e("退出游戏失败");
};
return __decorate([ i ], t);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
PokerTableBase: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "29e95VEwqxLkrit+VP3nw1t", "PokerTableBase");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass;
n.property;
var a = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.p_init = function() {
wGEvent.on("Msg_" + wGameData.getGameName() + "_Out", this.Msg_Game_QuitGame, this);
wGEvent.on("local_Event", this.local_Event, this);
this.p_roomInfo(this.node.RoomInfo);
};
t.prototype.p_setBankBtn = function(e) {
wGEvent.emit("local_Event", "setGameBankBtn", e);
};
t.prototype.p_sendQuitGame = function() {
wNetWork.send("Msg_" + wGameData.getGameName() + "_Out", [], !0);
};
t.prototype.local_Event = function(e) {
switch (e) {
case "up_Gold":
this.p_upGameGold(wGameData.getKey("gold"));
}
};
t.prototype.Msg_Game_QuitGame = function(e) {
wUIManager.hideLoadingUI();
1 == e.status ? e.data.uid != wGameData.getKey("uid") && this.p_quitGame(e.data) : wLog.e("退出游戏失败");
};
return __decorate([ i ], t);
}(cc.Component);
o.default = a;
cc._RF.pop();
}, {} ],
PopUpManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "4fdb7qFjwtFoYAlBnxVcOh6", "PopUpManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.PopUp = void 0;
var n, i = e("PopupBase"), a = e("Config");
(function(e) {
e[e.superimpose = 0] = "superimpose";
e[e.noSuperimpose = 1] = "noSuperimpose";
})(n || (n = {}));
var s = function() {
function e() {
var e = this;
this.pathArr = [];
this.popUpParent = null;
this.popUpNode = {};
cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, function() {
e.init();
});
}
e.prototype.init = function() {
this.pathArr.length = 0;
for (var e in this.popUpNode) if (Object.prototype.hasOwnProperty.call(this.popUpNode, e)) {
var t = this.popUpNode[e];
cc.isValid(t, !0) && !t.parent && t.destroy();
}
this.popUpNode = {};
};
e.prototype.loadPrefab = function(e, t) {
return new Promise(function(o, n) {
wRes.loadRes(e, function(t, i) {
if (t) {
wLog.e("打开页面出现错误:", e);
n(t);
} else {
var a = cc.instantiate(i);
o(a);
}
}, t);
});
};
e.prototype.showPopUp = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, o, n, s, c = this;
return __generator(this, function(r) {
switch (r.label) {
case 0:
t = this.popUpNode[e.path];
return cc.isValid(t) ? [ 3, 2 ] : [ 4, this.loadPrefab(e.path, e.bundle) ];

case 1:
t = r.sent();
this.popUpNode[e.path] = t;
r.label = 2;

case 2:
if (!cc.isValid(this.popUpParent)) {
this.popUpParent = new cc.Node();
cc.Canvas.instance.node.addChild(this.popUpParent, 10, "UIShow");
this.popUpParent.setContentSize(cc.winSize);
this.popUpParent.addComponent(cc.BlockInputEvents);
this.popUpParent.on("child-removed", function() {
c.popUpParent.childrenCount > 0 || (0 == c.pathArr.length ? c.popUpParent.active = !1 : c.showPopUp(c.pathArr.shift()));
}, this);
}
this.popUpParent.active = !0;
t.parent = this.popUpParent;
t.name = e.path.split("/").pop();
if (o = t.getComponent(i.default)) {
o.show(e.parameter || e.data);
o.setFinishCallback(function() {
e.isDestroy ? t.removeFromParent() : t.destroy();
});
if ((null == (n = cc.Canvas.instance.node.getChildByName("Game")) ? void 0 : n.childrenCount) && wGameData.getGame().dir == a.Config.SCREEN_DIR.V) {
s = cc.winSize.width / 840;
t.scale = s;
o.background.scale *= 4;
}
} else {
t.active = !0;
e.parameter && wLog.e("这里还未实现传参方法");
}
return [ 2 ];
}
});
});
};
e.prototype.openPage = function(e) {
switch (!0) {
case !cc.isValid(this.popUpParent):
case 1 == this.popUpParent.childrenCount:
this.showPopUp(e);
break;

case !!this.popUpParent.getChildByName(e.path.split("/").pop()):
wLog.e("页面正在显示中：", e.path);
break;

case !e.showMode:
this.showPopUp(e);
break;

case -1 != this.pathArr.findIndex(function(t) {
return t.path == e.path;
}):
this.pathArr[this.pathArr.findIndex(function(t) {
return t.path == e.path;
})] = e;
break;

case -1 == this.pathArr.findIndex(function(t) {
return t.path == e.path;
}):
this.pathArr.push(e);
}
};
return e;
}();
o.PopUp = new s();
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase"
} ],
PopUpNoticeTips: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "cedb2Jg7vlCbLj8nEezdCN2", "PopUpNoticeTips");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onLoad = function() {};
t.prototype.init = function(e) {
this.main.getChildByName("" + e.type).active = !0;
this.onHide = function() {
e.cb && e.cb();
};
};
t.prototype.onClick = function() {
wAudioMgr.playBtnSound();
cc.sys.openURL(wConstant.platformType[wConstant.platform][1]);
};
t.prototype.close = function(e, t) {
var o = this;
t ? wAudioMgr.playBtnSound() : wAudioMgr.playCloseSound();
this.onHide();
var n = cc.fadeTo(.1, 0), i = cc.callFunc(function() {
o.node.destroy();
}), a = cc.sequence(n, i);
this.node.runAction(a);
};
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
PopUpNotice: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "3e3b95ayGhGz5WPqS0W0Yyp", "PopUpNotice");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.toggle1 = null;
t.toggle2 = null;
t.select1 = null;
t.select2 = null;
t.xzToggle = [];
t.isNotice = !1;
t.isDQ = !1;
t.isxz = !1;
return t;
}
t.prototype.start = function() {
var e = this;
this.toggle1.node.children[0].active = !1;
this.toggle1.node.on("toggle", function() {
wAudioMgr.playBtnSound();
e.toggle1.node.children[0].active = !1;
e.toggle2.node.children[0].active = !0;
}, this);
this.toggle2.node.on("toggle", function() {
wAudioMgr.playBtnSound();
e.toggle2.node.children[0].active = !1;
e.toggle1.node.children[0].active = !0;
}, this);
};
t.prototype.onHide = function() {
this.cb && this.cb();
};
t.prototype.onClick = function(e, t) {
switch (t) {
case "xz":
if (!this.isNotice) return;
this.isxz = !this.isxz;
if (this.isxz) {
this.xzToggle[0].check();
this.xzToggle[1].check();
} else {
this.xzToggle[0].uncheck();
this.xzToggle[1].uncheck();
}
break;

case "ck":
cc.sys.localStorage.setItem("PopUpNoticeDQ", 1);
wViewMgr.openPage({
path: i.Config.ViewConfig.PopUpNoticeTips
});
this.init(this.cb);
break;

case "sc":
cc.sys.localStorage.setItem("PopUpNotice", 1);
cc.sys.localStorage.setItem("PopUpNoticeDQ", 1);
this.init(this.cb);
}
wAudioMgr.playBtnSound();
};
t.prototype.init = function(e) {
this.cb = e;
this.isNotice = 1 != cc.sys.localStorage.getItem("PopUpNotice");
this.isDQ = 1 != cc.sys.localStorage.getItem("PopUpNoticeDQ");
this.select1.getChildByName("no").active = !this.isNotice;
var t = cc.find("content/view/content/item", this.select1);
t.active = this.isNotice;
if (this.isNotice) {
t.getChildByName("yj").getComponent(cc.Button).interactable = this.isDQ;
t.getChildByName("yd").active = !this.isDQ;
} else {
this.xzToggle[0].uncheck();
this.xzToggle[1].uncheck();
this.xzToggle[0].interactable = !1;
this.xzToggle[1].interactable = !1;
}
};
__decorate([ c(cc.Toggle) ], t.prototype, "toggle1", void 0);
__decorate([ c(cc.Toggle) ], t.prototype, "toggle2", void 0);
__decorate([ c(cc.Node) ], t.prototype, "select1", void 0);
__decorate([ c(cc.Node) ], t.prototype, "select2", void 0);
__decorate([ c(cc.Toggle) ], t.prototype, "xzToggle", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase"
} ],
PopupBase: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "ea435SW70pJ36bxmU+INnSM", "PopupBase");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.background = null;
t.main = null;
t.blocker = null;
t.animTime = .2;
t.options = null;
t.finishCallback = null;
return t;
}
t.prototype.show = function(e) {
var t = this;
this.options = e;
this.background.opacity = 0;
this.background.active = !0;
this.main.opacity = 0;
this.main.active = !0;
this.node.active = !0;
this.main.scale = 1;
this.init(this.options);
this.updateDisplay(this.options);
cc.tween(this.background).to(.8 * this.animTime, {
opacity: 80
}).start();
var o = cc.fadeTo(.04, 255), n = cc.scaleTo(.1, 1.1).easing(cc.easeIn(1)), i = cc.scaleTo(.1, 1).easing(cc.easeIn(1)), a = cc.spawn(o, n), s = cc.callFunc(function() {
t.onShow && t.onShow();
}), c = cc.sequence(a, i, s);
this.main.runAction(c);
};
t.prototype.hide = function(e) {
var t = this;
void 0 === e && (e = !0);
e && wAudioMgr.playCloseSound();
if (!this.blocker) {
this.blocker = new cc.Node("blocker");
this.blocker.addComponent(cc.BlockInputEvents);
this.blocker.setParent(this.node);
this.blocker.setContentSize(this.node.getContentSize());
}
this.blocker.active = !0;
cc.tween(this.background).delay(.2 * this.animTime).to(.8 * this.animTime, {
opacity: 0
}).call(function() {
t.background.active = !1;
}).start();
wUIHelp.easeIn(this.main, function() {
t.blocker.active = !1;
t.main.active = !1;
t.node.active = !1;
t.onHide && t.onHide();
t.finishCallback && t.finishCallback();
});
};
t.prototype.init = function() {};
t.prototype.updateDisplay = function() {};
t.prototype.setFinishCallback = function(e) {
this.finishCallback = e;
};
t.prototype.onShow = function() {};
t.prototype.onHide = function() {};
__decorate([ a({
type: cc.Node
}) ], t.prototype, "background", void 0);
__decorate([ a({
type: cc.Node
}) ], t.prototype, "main", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
PrivilegeHelp: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "7d768d4tXZMQ6FDGMkUprp7", "PrivilegeHelp");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.start = function() {};
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
PrivilegeShop: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "67a3fqgFMhC+43w+r0O6UrZ", "PrivilegeShop");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = e("Constant"), s = cc._decorator, c = s.ccclass;
s.property;
var r = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.start = function() {
var e = this;
this.initShow();
wGEvent.on("local_Event", function(t) {
switch (t) {
case i.Config.local_Event.up_Mcard:
e.initShow();
}
}, this);
};
t.prototype.initShow = function() {
var e = wGameData.getKey("monthcard"), t = e ? "x" + e + "t" : "s";
this.main.getChildByName("time").getComponent(cc.Label).string = t;
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "cz":
var o = Object.values(wConstant.R_S_List);
if (o.length) {
var n = o[wUtils.random(0, o.length - 1)];
wUIManager.showServiceChat(n.kf, n.nickname);
} else wUIManager.showServiceChat(a.ServiceListID.kfzx, "游戏客服");
}
};
return __decorate([ c ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
Constant: "Constant",
PopupBase: "PopupBase"
} ],
Privilege: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "ef8d2tv2wJJFovkUblurZKw", "Privilege");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.imgTime = null;
t.pageview = null;
t.btn_left = null;
t.btn_right = null;
t.idx = 0;
t.len = 9;
t.isOpenPage = !1;
return t;
}
t.prototype.onLoad = function() {
var e = wGameData.getKey("monthcard");
if (e) {
var t = this.main.getChildByName("tips");
t.getComponent(cc.Sprite).spriteFrame = this.imgTime;
t.children[0].active = !0;
t.children[0].getComponent(cc.Label).string = e + "天后!";
this.main.getChildByName("btn_gm").active = !1;
}
this.btn_left.active = !1;
this.pageview.node.on("page-turning", this.PageTurning, this);
};
t.prototype.PageTurning = function() {
this.idx = this.pageview.getCurrentPageIndex();
this.initButton();
};
t.prototype.initButton = function() {
this.btn_left.active = 0 != this.idx;
this.btn_right.active = this.idx != this.len;
};
t.prototype.onHide = function() {
this.isOpenPage && wViewMgr.openPage({
path: i.Config.ViewConfig.PrivilegeShop
});
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "left":
this.idx--;
this.pageview.scrollToPage(this.idx, this.pageview.pageTurningSpeed);
break;

case "right":
this.idx++;
this.pageview.scrollToPage(this.idx, this.pageview.pageTurningSpeed);
break;

default:
this.hide(!1);
this.isOpenPage = !0;
}
};
__decorate([ c(cc.SpriteFrame) ], t.prototype, "imgTime", void 0);
__decorate([ c(cc.PageView) ], t.prototype, "pageview", void 0);
__decorate([ c(cc.Node) ], t.prototype, "btn_left", void 0);
__decorate([ c(cc.Node) ], t.prototype, "btn_right", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase"
} ],
Propose: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "5a950qchGlJYprJwp4nsOSH", "Propose");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Constant"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.editbox = null;
t.count = null;
t.time = 0;
return t;
}
t.prototype.start = function() {};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "kf":
wUIManager.showServiceChat(i.ServiceListID.tsjykf, "举报客服");
break;

case "tj":
this.opinionSubmit();
}
};
t.prototype.opinionSubmit = function() {
if (this.editbox.string) {
var e = new Date().getTime();
this.time = cc.sys.localStorage.getItem("opinionSubmitTime") || 0;
this.time *= 1;
if ((e - this.time) / 1e3 > 900) {
cc.sys.localStorage.setItem("opinionSubmitTime", "" + e);
wUIManager.hideLoadingUI();
this.editbox.string = "";
this.count.string = "0/140";
wUIManager.showTips("投诉建议提交成功！", wUIManager.TIPS_OK);
} else wUIManager.showTips("亲，每15分钟只能提交一次建议，请您稍后再试");
} else wUIManager.showTips("请输入投诉建议");
};
t.prototype.editboxEnd = function(e) {
this.count.string = e.length + "/140";
};
__decorate([ c(cc.EditBox) ], t.prototype, "editbox", void 0);
__decorate([ c(cc.Label) ], t.prototype, "count", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Constant: "Constant",
PopupBase: "PopupBase"
} ],
ProxyNodeShow: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "9ce2f1glXZIW7JjnJwBQRV3", "ProxyNodeShow");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.proxyNode = [];
return t;
}
t.prototype.onEnable = function() {
this.proxyNode.forEach(function(e) {
e.active = !0;
});
};
t.prototype.onDisable = function() {
this.proxyNode.forEach(function(e) {
e.active = !1;
});
};
__decorate([ a([ cc.Node ]) ], t.prototype, "proxyNode", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
RankTips: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "33e1d17ZYtMFoNScLqpbMyi", "RankTips");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("SDKManager"), a = cc._decorator, s = a.ccclass;
a.property;
var c = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.init = function(e) {
this.vx = String(e.wx);
wUIHelp.setHead(this.main.getChildByName("head"), e.head, !0);
this.main.getChildByName("name").getComponent(cc.Label).string = e.nickname;
this.main.getChildByName("id").getComponent(cc.Label).string = "ID:" + e.uid;
this.main.getChildByName("content").getComponent(cc.Label).string = "" + e.tips;
};
t.prototype.onClick = function() {
cc.sys.openURL("weixin://");
i.wSDK.copyToClipboard(this.vx);
};
return __decorate([ s ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase",
SDKManager: "SDKManager"
} ],
Ranking: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "0fce7lMoBtBx5vXMAJ8EFvG", "Ranking");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.no = null;
t.content = null;
t.c_layout = null;
t.anim = null;
t.headImg = null;
t.xbImg = [];
t.list = [];
t.showType = "cfzb";
return t;
}
t.prototype.start = function() {
var e = this;
this.no.active = !1;
this.content.opacity = 0;
wGEvent.on("Msg_Hall_TheRich", function(t) {
if (1 == t.status && cc.isValid(e)) {
e.initList(t.data);
e.listAnim();
}
}, this);
this.anim.play("rankAnim");
this.scheduleOnce(function() {
wNetWork.send("Msg_Hall_TheRich", []);
}, .25);
};
t.prototype.initList = function(e) {
e.sort(function() {
return Math.random() - .5;
});
this.c_layout.enabled = !0;
wUIHelp.hideSonNode(this.c_layout.node);
this.list = e;
for (var t = 0; t < this.list.length; t++) {
this.list[t].i = t;
var o = this.c_layout.node.children[t];
o || ((o = cc.instantiate(this.c_layout.node.children[3])).parent = this.c_layout.node);
this.initItem(o, this.list[t]);
wConstant.R_S_List[e[t].kf] = e[t];
}
this.c_layout.updateLayout();
this.c_layout.enabled = !1;
this.no.active = !this.list.length;
this.content.opacity = this.list.length ? 255 : 0;
};
t.prototype.listAnim = function() {
if (!(this.list.length <= 0)) for (var e = function(e) {
var o = t.c_layout.node.children[e];
if (!o) return "continue";
var n = 150 * (7 - e);
o.y -= n;
o.opacity = 0;
t.scheduleOnce(function() {
var e = cc.moveBy(.2, cc.v2(0, n)).easing(cc.easeOut(8)), t = cc.fadeTo(.3, 255).easing(cc.easeOut(8)), i = cc.spawn(e, t);
o.runAction(i);
}, .05 * e);
}, t = this, o = 0; o < 7; o++) e(o);
};
t.prototype.initItem = function(e, t) {
t.i >= 3 && (e.getChildByName("xh").getComponent(cc.Label).string = "" + (t.i + 1));
var o = e.getChildByName("head").getChildByName("haeddi").getComponent(cc.Sprite), n = Number(t.headimgurl) % 12, i = n <= 5 ? "female" : "male";
i = "plist_head_" + i + "_" + (n % 6 + 1);
o.spriteFrame = this.headImg.getSpriteFrame(i);
e.getChildByName("name").getComponent(cc.Label).string = t.nickname;
e.getChildByName("uid").getComponent(cc.Label).string = "ID:" + t.uid;
e.active = !0;
e.data = t;
};
t.prototype.openTips = function(e) {
var t = cc.find("main/tips", this.node);
if (e) {
t.active = !0;
e.headimgurl % 12 < 6 ? t.getChildByName("xb").getComponent(cc.Sprite).spriteFrame = this.xbImg[1] : t.getChildByName("xb").getComponent(cc.Sprite).spriteFrame = this.xbImg[0];
wUIHelp.setHead(cc.find("head/haeddi", t), e.headimgurl);
t.getChildByName("name").getComponent(cc.Label).string = wUtils.handleNameLen(e.nickname, 14);
t.getChildByName("tips").getComponent(cc.Label).string = e.brief;
t.data = e;
t.opacity = 0;
t.scale = 1;
var o = cc.fadeTo(.04, 255), n = cc.scaleTo(.1, 1.1).easing(cc.easeIn(1)), i = cc.scaleTo(.1, 1).easing(cc.easeIn(1)), a = cc.spawn(o, n), s = cc.sequence(a, i);
t.stopAllActions();
t.runAction(s);
} else if (t.active) {
var c = cc.fadeTo(.1, 0), r = cc.callFunc(function() {
t.opacity = 255;
t.active = !1;
}), l = cc.sequence(c, r);
t.stopAllActions();
t.runAction(l);
}
};
t.prototype.onClick = function(e, t) {
var o = this;
this.openTips();
switch (t) {
case "kf":
var n = e.target.parent.data;
wUIManager.showServiceChat(n.kf, n.nickname);
break;

case "item":
this.openTips(e.target.data);
break;

case "cfzb":
this.showType != t && this.initList(this.list);
this.showType = t;
break;

case "mrjb":
this.no.active = !0;
this.content.opacity = 0;
this.showType = t;
break;

case "close":
wAudioMgr.playCloseSound();
this.anim.play("rankExit");
this.anim.on("stop", function() {
o.node.destroy();
}, this);
this.scheduleOnce(function() {
cc.Canvas.instance.node.getChildByName("Hall").getComponent("Hall_View").gameTypeAni_a(!1);
}, .15);
return;

case "xqclose":
wAudioMgr.playCloseSound();
}
wAudioMgr.playBtnSound();
};
__decorate([ a(cc.Node) ], t.prototype, "no", void 0);
__decorate([ a(cc.Node) ], t.prototype, "content", void 0);
__decorate([ a(cc.Layout) ], t.prototype, "c_layout", void 0);
__decorate([ a(cc.Animation) ], t.prototype, "anim", void 0);
__decorate([ a(cc.SpriteAtlas) ], t.prototype, "headImg", void 0);
__decorate([ a(cc.SpriteFrame) ], t.prototype, "xbImg", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
RechargeRecord: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "e1d3ak0GThKVJeojrQnnxdF", "RechargeRecord");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.start = function() {
this.animNode(cc.find("leftBtns/2/select/Sprite", this.main));
};
t.prototype.animNode = function(e) {
e.stopAllActions();
wUIHelp.hideSonNode(e);
e.children[1].active = !0;
var t = cc.delayTime(.2), o = cc.callFunc(function() {
wUIHelp.hideSonNode(e);
e.children[0].active = !0;
}), n = cc.sequence(t, o);
e.runAction(n);
};
t.prototype.onClick = function(e) {
wAudioMgr.playBtnSound();
this.animNode(cc.find("select/Sprite", e.node));
};
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
Recharge: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "52824+WOA1FcaIgNkpGYvPH", "Recharge");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("ChatTools"), i = e("Constant"), a = !0, s = cc._decorator, c = s.ccclass, r = s.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.listContent = null;
t.nickname = null;
t.btn_list = null;
t.hdContent = [];
t.showList = [];
t.headList = [];
return t;
}
t.prototype.onEnable = function() {
var e = this, t = this.node.getComponent(cc.Animation);
t.play("startAnim");
t.on("stop", function() {
t.off("stop");
var o = cc.find("main/tips", e.node), n = cc.fadeIn(.3), i = cc.delayTime(3), a = cc.fadeOut(.3), s = cc.sequence(n, i, a);
o.runAction(s);
}, this);
};
t.prototype.onLoad = function() {
var e = this, t = function(t) {
for (var o = 0, n = e.hdContent; o < n.length; o++) n[o].active = Boolean(t);
};
t(wConstant.chatCount.other);
wGEvent.on("local_Event", function(e) {
switch (e) {
case "ChatCount":
t(wConstant.chatCount.other);
}
}, this);
wUIHelp.hideSonNode(this.content);
this.sendMsg();
if (a) {
a = !1;
wViewMgr.openPage({
path: "Prefab/ImportantTips"
});
}
};
t.prototype.sendMsg = function() {
return __awaiter(this, void 0, Promise, function() {
var e = this;
return __generator(this, function(t) {
switch (t.label) {
case 0:
return [ 4, n.default.GetServiceHead().then(function(t) {
e.headList = t;
}).catch(function() {}) ];

case 1:
t.sent();
wUtils.sendMsg("Msg_Hall_TheRich", {}, this).then(function(t) {
e.showList = t || [];
e.initList(e.showList);
}).catch(function() {});
return [ 2 ];
}
});
});
};
t.prototype.initList = function(e) {
var t = this;
e.sort(function() {
return Math.random() - .5;
});
wUIHelp.hideSonNode(this.content);
for (var o = this.node.getChildByName("item"), n = 0; n < e.length; n++) {
var i = this.content.getChildByName("" + n);
if (!i) {
i = cc.instantiate(o);
this.content.addChild(i, 1, "" + n);
}
wConstant.R_S_List[e[n].kf] = e[n];
this.initItem(i, e[n]);
}
this.scheduleOnce(function() {
t.content.getComponent(cc.Layout).updateLayout();
}, .1);
};
t.prototype.initItem = function(e, t) {
var o = this.headList.find(function(e) {
return e.serviceId == t.kf;
}), n = cc.find("head/head", e).getComponent(cc.Sprite);
if (o) {
var i = wConstant.KF_AZ_Url + o.avatar;
wUIHelp.loadHead(n, i);
} else wUIHelp.setHead(n, t.headimgurl);
var a = t.pj || wUtils.random(500, 1e4);
t.pj = a;
cc.find("name", e).getComponent(cc.Label).string = "" + t.nickname;
cc.find("pj", e).getComponent(cc.Label).string = "" + a;
var s = (wUtils.random(44, 49) / 10).toFixed(1);
cc.find("pf", e).getComponent(cc.Label).string = "" + s;
cc.find("pfLayout/4", e).getComponent(cc.Toggle).isChecked = s >= "4.5";
var c = cc.find("czLayout", e);
wUIHelp.hideSonNode(c);
var r = t.list || [];
if (!t.list) for (var l = wUtils.random(3, 6), p = 0; p < l; p++) r.push(wUtils.random(0, 5));
t.list = r;
for (p = 0; p < r.length; p++) c.children[r[p]].active = !0;
e.active = !0;
e.data = t;
var u = e.getChildByName("btn_cz");
u.off("click");
u.on("click", function() {
wUIManager.showServiceChat(t.kf, t.nickname);
});
};
t.prototype.onClick = function(e, t) {
var o = this;
wAudioMgr.playBtnSound();
switch (t) {
case "close":
var n = this.node.getComponent(cc.Animation);
n.play("exitAnim");
n.on("stop", function() {
o.node.destroy();
}, this);
if (3 == wGameData.gameID || 1e3 == wGameData.gameID) return;
this.scheduleOnce(function() {
cc.Canvas.instance.node.getChildByName("Hall").getComponent("Hall_View").gameListAni_b();
}, .15);
break;

case "sx":
this.initList(this.showList);
break;

case "kf":
wUIManager.showServiceChat(i.ServiceListID.czkf, "游戏客服");
break;

case "xx":
wUIHelp.setOrientation("V");
wViewMgr.openPage({
path: "Prefab/KFMsg"
});
break;

case "ts":
wViewMgr.openPage({
path: "Prefab/ReportTips"
});
break;

case "czjl":
wViewMgr.openPage({
path: "Prefab/RechargeRecord"
});
break;

case "list":
this.openList(!this.listContent.active);
break;

case "item":
this.nickname.string = e.target.name;
this.etitboxEnd(this.nickname);
}
};
t.prototype.openList = function(e) {
var t = this.listContent;
t.active = e;
this.btn_list.children[0].active = !e;
this.btn_list.children[1].active = e;
if (e) {
var o = t.getChildByName("layout");
wUIHelp.hideSonNode(o);
o.children[0].active = !0;
for (var n = JSON.parse(cc.sys.localStorage.getItem("Recharge_CX_List")) || [], i = 0; i < n.length && i < 3; i++) {
var a = o.children[i + 1];
a.children[0].getComponent(cc.Label).string = n[i];
a.name = n[i];
a.active = !0;
}
}
};
t.prototype.etitboxEnd = function(e) {
this.openList(!1);
var t = e.string;
if (t) {
for (var o = [], n = 0; n < this.showList.length; n++) -1 != this.showList[n].nickname.indexOf(e.string) && o.push(this.showList[n]);
if (o.length) this.initList(o); else {
var i = cc.color(255, 255, 255);
wUIManager.showTips("店铺未找到", i);
}
var a = JSON.parse(cc.sys.localStorage.getItem("Recharge_CX_List")) || [];
a.unshift(t);
for (n = 1; n < a.length; n++) a[0] != a[n] || a.splice(n, 1);
a.length > 3 && a.pop();
cc.sys.localStorage.setItem("Recharge_CX_List", JSON.stringify(a));
} else for (var s = 0, c = this.content.children; s < c.length; s++) {
var r = c[s];
"item" != r.name && (r.active = !0);
}
};
__decorate([ r(cc.Node) ], t.prototype, "content", void 0);
__decorate([ r(cc.Node) ], t.prototype, "listContent", void 0);
__decorate([ r(cc.EditBox) ], t.prototype, "nickname", void 0);
__decorate([ r(cc.Node) ], t.prototype, "btn_list", void 0);
__decorate([ r(cc.Node) ], t.prototype, "hdContent", void 0);
return __decorate([ c ], t);
}(cc.Component);
o.default = l;
cc._RF.pop();
}, {
ChatTools: "ChatTools",
Constant: "Constant"
} ],
RegisterA: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "332feRNKI9KMKlacr2jHwDc", "RegisterA");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = e("Constant"), s = cc._decorator, c = s.ccclass, r = s.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.nickname = null;
t.pow = null;
t.qrpow = null;
return t;
}
t.prototype.start = function() {
this.nickname.placeholder = "";
this.pow.placeholder = "";
this.qrpow.placeholder = "";
};
t.prototype.onShow = function() {
this.nickname.placeholder = "请输入昵称";
this.pow.placeholder = "6~10位数字或字母";
this.qrpow.placeholder = "再次输入密码";
};
t.prototype.init = function(e) {
this.phone = e.phone;
this.code = e.code;
this.type = e.type;
};
t.prototype.sendMsg = function() {
var e = this, t = this.phone, o = this.pow.string, n = this.qrpow.string, a = Number(this.code);
if (this.nickname.string) if (wUtils.checkPwd(o)) if (o == n) {
var s = {
ph: t,
pwd: o,
code: a
}, c = {
telephone: Number(s.ph),
password: s.pwd,
code: s.code,
nickname: this.nickname.string,
equipmentcard: wGameData.getAPPID()
};
wNetWork.HttpRequest("Msg_User_register", c, !0).then(function(t) {
wGameData.accLoginInfo = {
uid: s.ph,
password: s.pwd,
equipmentcard: c.equipmentcard,
type: 1,
code: -1
};
wGEvent.emit("local_Event", i.Config.local_Event.login_Success, t);
e.scheduleOnce(function() {
e.node.destroy();
}, 1);
}).catch(function() {});
} else wUIManager.showTips("二次输入的密码不一致!"); else wUIManager.showTips("请输入密码!"); else wUIManager.showTips("请输入昵称!");
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
"sj" == t ? this.nickname.string = a.randomName() : this.sendMsg();
};
__decorate([ r(cc.EditBox) ], t.prototype, "nickname", void 0);
__decorate([ r(cc.EditBox) ], t.prototype, "pow", void 0);
__decorate([ r(cc.EditBox) ], t.prototype, "qrpow", void 0);
return __decorate([ c ], t);
}(n.default);
o.default = l;
cc._RF.pop();
}, {
Config: "Config",
Constant: "Constant",
PopupBase: "PopupBase"
} ],
Register_RetrievePow: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "11bda0gpKRBH7xWq92OECYw", "Register_RetrievePow");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.phoneNode = null;
t.pwdNode = null;
t.spwdNode = null;
t.smsCodeNode = null;
t.getCodeBtn = null;
t.getCodeTime = null;
t.userAgr = null;
t.layout = null;
return t;
}
t.prototype.init = function(e) {
this.type = e.type;
this.key = e.key;
cc.find("main/" + this.type, this.node).active = !0;
if ("Register" != this.type) {
this.layout.getComponent(cc.Layout).spacingY = 10;
this.layout.getChildByName("agr").active = !1;
}
if ("ReviseBankPow" == this.type) {
this.phoneNode.string = wGameData.getKey("isbind");
this.phoneNode.enabled = !1;
}
};
t.prototype.onClick = function(e, t) {
var o = this;
wAudioMgr.playBtnSound();
switch (t) {
case "useragr":
wViewMgr.openPage({
path: i.Config.ViewConfig.UserAgreement
});
break;

case "confirm":
this.register();
break;

case "code":
var n = this.phoneNode.string;
if (!wUtils.checkMobile(n)) {
wUIManager.showTips("请输入正确的手机号码");
return;
}
this.getCodeBtn.active = !1;
wNetWork.HttpRequest("Msg_User_getCode", {
telephone: n
}).then(function() {
wUIManager.showTips("发送成功", wUIManager.TIPS_OK);
wGameData.startCodeTime();
o.getCode(59);
});
}
};
t.prototype.start = function() {
wGameData.codeTime && wGameData.codeTime > 0 && this.getCode(wGameData.codeTime);
};
t.prototype.register = function() {
var e = this.phoneNode.string, t = this.pwdNode.string, o = this.spwdNode.string, n = Number(this.smsCodeNode.string);
if (wUtils.checkMobile(e)) if (wUtils.checkPwd(t)) if (t == o) if (n) {
var i = {
ph: e,
pwd: t,
code: n
};
switch (this.type) {
case "Register":
if (!this.userAgr.isChecked) {
wUIManager.showTips("请同意用户协议!");
return;
}
"BindPhone" == this.key ? this.send_BindPhone(i) : this.send_register(i);
break;

case "RetrievePow":
this.send_RetrievePow(i);
break;

case "ReviseBankPow":
this.send_change_pwd(i);
}
} else wUIManager.showTips("请输入验证码"); else wUIManager.showTips("二次输入的密码不一致"); else wUIManager.showTips("请输入正确的密码"); else wUIManager.showTips("请输入正确的手机号码");
};
t.prototype.send_RetrievePow = function(e) {
var t = this, o = {
uid: e.ph,
password: e.pwd,
code: e.code
};
wNetWork.HttpRequest("Msg_User_ChangePassword", o, !0).then(function() {
wUIManager.showTips("修改成功", wUIManager.TIPS_OK);
t.hide(!1);
});
};
t.prototype.send_BindPhone = function(e) {
var t = this, o = {
uid: wGameData.getKey("uid"),
password: e.pwd,
code: e.code,
telephone: e.ph
};
wNetWork.HttpRequest("Msg_User_upgrade", o, !0).then(function() {
wGameData.setLastLogin({
uid: e.ph,
password: e.pwd,
equipmentcard: wGameData.getAPPID(),
type: 1,
code: -1
});
var n = wGameData.getKey("uid"), i = wGameData.getAllAccInfo();
i[n].accInfo = wGameData.getLastLogin();
i[n].info.isbind = e.ph;
wGameData.setAllAccInfo(i);
wUIManager.showTips("绑定成功", wUIManager.TIPS_OK);
wGameData.setKey("isbind", o.telephone);
t.hide(!1);
}).catch(function(e) {
e && 2 == e.status && wViewMgr.openPage({
path: i.Config.ViewConfig.LoginCheck,
data: o
});
});
};
t.prototype.send_register = function(e) {
var t = {
telephone: Number(e.ph),
password: e.pwd,
code: e.code,
equipmentcard: wGameData.getAPPID()
};
wNetWork.HttpRequest("Msg_User_register", t, !0).then(function(o) {
wUIManager.showTips("注册成功", wUIManager.TIPS_OK);
wGameData.accLoginInfo = {
uid: e.ph,
password: e.pwd,
equipmentcard: t.equipmentcard,
type: 1,
code: -1
};
wGEvent.emit("local_Event", i.Config.local_Event.login_Success, o);
}).catch(function(e) {
e && 2 == e.status && wViewMgr.openPage({
path: i.Config.ViewConfig.LoginCheck,
data: t
});
});
};
t.prototype.send_change_pwd = function(e) {
var t = this, o = {
uid: wGameData.getKey("uid"),
password: e.pwd,
code: e.code
};
wNetWork.HttpRequest("Msg_User_forgeBank", o, !0).then(function() {
wGameData.setKey("bankpass", e.pwd);
wUIManager.showTips("修改成功", wUIManager.TIPS_OK);
t.hide(!1);
});
};
t.prototype.getCode = function(e) {
var t = this;
this.getCodeTime.string = e + "秒后可重新获取";
this.getCodeBtn.active = !1;
this.schedule(function() {
if (0 != --e) t.getCodeTime.string = e + "秒后可重新获取"; else {
t.getCodeBtn.active = !0;
t.getCodeTime.string = "";
t.unscheduleAllCallbacks();
}
}, 1);
};
__decorate([ c(cc.EditBox) ], t.prototype, "phoneNode", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "pwdNode", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "spwdNode", void 0);
__decorate([ c(cc.EditBox) ], t.prototype, "smsCodeNode", void 0);
__decorate([ c(cc.Node) ], t.prototype, "getCodeBtn", void 0);
__decorate([ c(cc.Label) ], t.prototype, "getCodeTime", void 0);
__decorate([ c(cc.Toggle) ], t.prototype, "userAgr", void 0);
__decorate([ c(cc.Node) ], t.prototype, "layout", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase"
} ],
Register: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "da4c8BbVz1ACZ1pMrZ2Eoyu", "Register");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.phoneNode = null;
t.code = null;
t.getCodeBtn = null;
t.getCodeTime = null;
return t;
}
t.prototype.start = function() {
this.phoneNode.placeholder = "";
this.code.placeholder = "";
};
t.prototype.onShow = function() {
this.phoneNode.placeholder = "手机号/账号";
this.code.placeholder = "验证码";
};
t.prototype.openPage = function() {
var e = this, t = this.phoneNode.string;
if (wUtils.checkMobile(t)) {
var o = this.code.string;
if (o) if (this.main.getChildByName("qr").getComponent(cc.Toggle).isChecked) {
var n = {
phone: t,
code: o,
type: "Register"
};
wViewMgr.openPage({
path: "Prefab/RegisterA",
data: n
});
this.scheduleOnce(function() {
e.node.destroy();
}, .1);
} else wUIManager.showTips("需要同意《728游戏服务协议》才能进行下一步操作"); else wUIManager.showTips("请输入验证码!");
} else wUIManager.showTips("请输入手机号码!");
};
t.prototype.onClick = function(e, t) {
var o = this;
wAudioMgr.playBtnSound();
switch (t) {
case "confirm":
this.openPage();
break;

case "code":
var n = this.phoneNode.string;
if (!wUtils.checkMobile(n)) {
wUIManager.showTips("请输入手机号码!");
return;
}
this.getCodeBtn.active = !1;
wNetWork.HttpRequest("Msg_User_getCode", {
telephone: n
}).then(function() {
wUIManager.showTips("发送成功,请注意查收!", wUIManager.TIPS_OK);
wGameData.startCodeTime();
o.getCode(60);
});
}
};
t.prototype.getCode = function(e) {
var t = this;
this.getCodeTime.string = e + "s";
this.getCodeBtn.active = !1;
this.schedule(function() {
if (0 != --e) t.getCodeTime.string = e + "s"; else {
t.getCodeBtn.active = !0;
t.getCodeTime.string = "";
t.unscheduleAllCallbacks();
}
}, 1);
};
__decorate([ s(cc.EditBox) ], t.prototype, "phoneNode", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "code", void 0);
__decorate([ s(cc.Node) ], t.prototype, "getCodeBtn", void 0);
__decorate([ s(cc.Label) ], t.prototype, "getCodeTime", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
ReportTips: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "62d9bpsIT9Eh5s8YMV6lwo2", "ReportTips");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("Constant"), a = cc._decorator, s = a.ccclass;
a.property;
var c = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.hide = function() {
var e = this;
wAudioMgr.playCloseSound();
this.onHide();
var t = cc.fadeTo(.1, 0), o = cc.callFunc(function() {
e.node.destroy();
}), n = cc.sequence(t, o);
this.node.runAction(n);
};
t.prototype.onClick = function() {
wAudioMgr.playBtnSound();
wUIManager.showServiceChat(i.ServiceListID.cztskf, "举报代理客服");
};
return __decorate([ s ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
Constant: "Constant",
PopupBase: "PopupBase"
} ],
ResLoader: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "779e5jteGFDiYD82I7xsRUA", "ResLoader");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ResLoader = void 0;
var n = e("Constant"), i = function() {
function e() {}
e.prototype.loadRes = function() {
var e = __spreadArrays(arguments);
e[e.length - 1] || e.pop();
e.length > 1 && "string" == typeof e[e.length - 1] ? this.loadBundleRes(e.pop(), e) : cc.resources.load.apply(cc.resources, e);
};
e.prototype.loadResDir = function() {
var e = __spreadArrays(arguments);
e[e.length - 1] || e.pop();
e.length > 1 && "string" == typeof e[e.length - 1] ? this.loadBundleDir(e.pop(), e) : cc.resources.loadDir.apply(cc.resources, e);
};
e.prototype.preloadDir = function() {
var e = __spreadArrays(arguments);
e[e.length - 1] || e.pop();
e.length > 1 && "string" == typeof e[e.length - 1] ? this.preloadBundle(e.pop(), e) : cc.resources.preloadDir.apply(cc.resources, e);
};
e.prototype.loadRemoteRes = function() {
cc.assetManager.loadRemote.apply(cc.assetManager, arguments);
};
e.prototype.releaseArray = function(e) {
for (var t = 0; t < e.length; ++t) this.releaseAsset(e[t]);
};
e.prototype.releaseAsset = function(e) {
e.decRef();
};
e.prototype.releaseBundle = function(e) {
var t = cc.assetManager.getBundle(e);
if (t) {
t.releaseAll();
cc.assetManager.removeBundle(t);
}
};
e.prototype.loadBundle = function(e, t) {
e = wConstant.isCheckHotUp ? jsb.fileUtils.getWritablePath() + "/" + e : e;
("jhlmEXE" == n.Constant.serverType || (wConstant.isDebug, 0) && "gameWEB" == n.Constant.serverType) && (e = wConstant.hotUpDateUrl + e);
cc.assetManager.loadBundle(e, function(e, o) {
e ? console.error(e) : t(e, o);
});
};
e.prototype.preloadBundle = function(e, t) {
this.loadBundle(e, function(e, o) {
o.preload.apply(o, t);
});
};
e.prototype.loadBundleRes = function(e, t) {
this.loadBundle(e, function(e, o) {
o.load.apply(o, t);
});
};
e.prototype.loadBundleDir = function(e, t) {
this.loadBundle(e, function(e, o) {
o.loadDir.apply(o, t);
});
};
return e;
}();
o.ResLoader = i;
cc._RF.pop();
}, {
Constant: "Constant"
} ],
RewardAnim: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "d38b6jQT2BEmoRX30Okdyqn", "RewardAnim");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.gold = null;
return t;
}
t.prototype.init = function(e) {
this.gold.string = "x" + wUtils.numConvert(e);
};
t.prototype.show = function(e) {
var t = this;
this.init(e);
var o = this.main.getChildByName("node");
wUIHelp.easeBackOut(o);
var n = this.main.getChildByName("spine").getComponent(sp.Skeleton);
wUIHelp.playSpine(n, "start", function() {
wUIHelp.playSpine(n, "idle", null, !0);
});
this.scheduleOnce(function() {
var e = t.main.getChildByName("btn");
e.active = !0;
var o = cc.fadeIn(.3);
e.runAction(o);
}, 1);
};
t.prototype.hide = function() {
var e = this, t = cc.fadeTo(.1, 0), o = cc.callFunc(function() {
e.node.destroy();
}), n = cc.sequence(t, o);
this.node.runAction(n);
};
__decorate([ s(cc.Label) ], t.prototype, "gold", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
RoomChoose: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "d3efcryMUdN4pvxegoyrfhQ", "RoomChoose");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc.Enum({
img1: 1,
img2: 2
}), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.img1 = [];
t.img2 = [];
t.type = n.img1;
t.img = null;
return t;
}
t.prototype.start = function() {
var e = this;
this.img = this["img" + this.type];
this.random();
this.schedule(function() {
e.random();
}, 10);
};
t.prototype.random = function() {
var e = wUtils.random(1, 100);
e = e < 70 ? 0 : e < 90 ? 1 : 2;
this.node.getComponent(cc.Sprite).spriteFrame = this.img[e];
};
__decorate([ s(cc.SpriteFrame) ], t.prototype, "img1", void 0);
__decorate([ s(cc.SpriteFrame) ], t.prototype, "img2", void 0);
__decorate([ s({
type: n,
tooltip: "选择使用img1的资源还是img2的资源"
}) ], t.prototype, "type", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {} ],
RoomTips: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "7d76ec9HKBMRKVKBe/rsPds", "RoomTips");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.isClick = !1;
return t;
}
t.prototype.init = function(e) {
this.cb = e.cb;
3 == e.level && (this.main.getChildByName("4").active = !1);
};
t.prototype.onHide = function() {
this.isClick && this.cb && this.cb();
};
t.prototype.onClick = function() {
if (!this.isClick) {
this.isClick = !0;
this.hide();
}
};
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
Room_Load: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b7221Gldy1C3JtczOOO0krX", "Room_Load");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("NetInterface"), i = e("Config"), a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.selectRoom = null;
t.loadNode = null;
t.content = null;
t.top = null;
t.bottom = null;
t.head = null;
t.headframe = null;
t.nickname = null;
t.gold = null;
t.bankGold = null;
t.netWorkState = !0;
t.isLoad = !1;
t.isExit = !1;
return t;
}
t.prototype.onLoad = function() {
var e = this;
this.loadGameRes(null, function() {
e.init();
e.isLoad = !0;
});
};
t.prototype.init = function() {
var e = this;
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("Msg_Hall_EnterRoom", this.Msg_Hall_EnterRoom, this);
wGEvent.on("Msg_Hall_EnterGame", this.Msg_Hall_EnterGame, this);
wGEvent.on("Msg_Hall_Connect", this.Msg_Hall_Connect, this);
wGEvent.on("Msg_" + wGameData.getGameName() + "_RoomInfo", function() {
e.initShow();
}, this);
wGEvent.on("local_SocketState", this.vg_NetWorkState, this);
wGameData.isReconnect ? this.loadGame() : this.initRoom();
};
t.prototype.start = function() {
wAudioMgr.stopBgMusic();
};
t.prototype.onEnable = function() {
this.scheduleOnce(function() {
wAudioMgr.playBgMusic(wGameData.getGame().music, wGameData.getGameName());
}, .5);
if (!wGameData.isReconnect) {
this.gold && (this.gold.string = wUtils.numConvert(wGameData.getKey("gold")));
this.isLoad && this.enterAni();
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
var o = Number(t) - 1;
this.content.getChildByName("" + o).on("click", this.roomOnClick, this);
}
this.head && wUIHelp.setHead(this.head, wGameData.getKey("headimgurl"), !0);
this.nickname && (this.nickname.string = wUtils.handleNameLen(wGameData.getKey("nickname"), 10));
this.bankGold && (this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank")));
this.selectRoom.active = !0;
this.loadNode.active = !1;
this.enterAni();
};
t.prototype.initShow = function() {
this.loadNode.active = !1;
this.selectRoom.active = !0;
this.node.parent.active = !1;
if (wGameData.isReconnect) {
wGameData.isReconnect = !1;
this.node.destroy();
}
};
t.prototype.enterAni = function() {
this.top.stopAllActions();
this.top.y = 450;
var e = cc.moveTo(.25, cc.v2(0, 375)).easing(cc.easeBackOut());
this.top.runAction(e);
this.bottom.stopAllActions();
this.bottom.y = -100;
var t = cc.moveTo(.25, cc.v2(0, 0)).easing(cc.easeBackOut());
this.bottom.runAction(t);
var o = this.content;
this.selectRoom.opacity = 0;
var n = cc.fadeTo(.4, 255);
this.selectRoom.runAction(n);
for (var i = 0; i < o.childrenCount; i++) {
var a = o.children[i], s = cc.v2(a.x, a.y);
a.x += 300;
var c = cc.moveTo(.4, s).easing(cc.easeBackOut());
a.runAction(c);
}
};
t.prototype.Msg_Hall_Connect = function(e) {
if (1 == e.status) {
if (!wGameData.getKey("rid")) {
wUIHelp.setOrientation("H");
this.loadNode.active = !1;
this.selectRoom.active = !0;
}
} else wLog.e("验证失败");
};
t.prototype.Msg_Hall_EnterRoom = function(e) {
if (1 == e.status) {
wGameData.roomID = e.data.rid;
wGameData.getGame().table || this.loadGame();
} else {
wLog.e("进入房间消息失败");
wGameData.roomID = null;
wGameData.isReconnect = !1;
wUIManager.hideLoadingUI();
wUIManager.showTips(e.msg || "进入房间失败");
}
};
t.prototype.Msg_Hall_EnterGame = function(e) {
if (1 == e.status) {
wGameData.tableList = e.data;
this.node.parent.active && this.loadGame();
} else {
wLog.e("进入赛事消息失败");
wUIManager.hideLoadingUI();
wUIManager.showTips(e.msg || "进入赛事失败");
}
};
t.prototype.enterRoom = function(e) {
wGameData.roomLevel = e;
var t = wGameData.roomConfig[e];
if (t) if (t.min_gold > wGameData.getKey("gold")) {
wUIManager.showTips("抱歉，您的游戏币低于入场最低限制:" + t.min_gold + "，不能进入该游戏房间!", wUIManager.TIPS_OK);
wViewMgr.openPage({
path: "UICommon/GameExitTips",
data: {
isGameRun: !0,
content: "游戏币不足，是否立即跳转充值？",
okCB: function() {
wViewMgr.openPage({
path: "Prefab/Recharge"
});
}
}
});
} else wGameData.gameRepair() ? wUIManager.showTips("游戏维护中") : wGameData.getGame().table ? wNetWork.send("Msg_Hall_EnterGame", {
gtype: Number(wGameData.gameID),
level: wGameData.roomLevel
}, !0) || wUIManager.showTips("网络连接失败") : wNetWork.send("Msg_Hall_EnterRoom", {
tableid: 0,
gtype: Number(wGameData.gameID),
level: e
}, !0) || wUIManager.showTips("网络连接失败"); else wUIManager.showTips("游戏配置错误，请重新进入游戏！");
};
t.prototype.faststart = function() {
var e = wGameData.getKey("gold"), t = wGameData.roomConfig, o = 1;
for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && t[n].min_gold <= e && (o = t[n].level);
this.enterRoom(o);
};
t.prototype.roomOnClick = function(e) {
var t = this;
wAudioMgr.playBtnSound();
var o = e.node.name;
22 != wGameData.gameID || 2 != o && 3 != o ? this.enterRoom(Number(o) + 1) : wViewMgr.openPage({
path: "Prefab/RoomTIps",
data: {
cb: function() {
t.enterRoom(Number(o) + 1);
},
level: o
}
});
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
t.prototype.loadGameRes = function(e, t) {
var o = i.Config.GamePrefab[wGameData.gameID];
wRes.loadRes(o.prefabUrl, function(t, o) {
e && e(t / o);
}, function(e, o) {
e ? wLog.e(e) : t && t(o);
}, o.enName);
};
t.prototype.loadGame = function() {
var e = this;
this.selectRoom.active = !1;
if (wGameData.getGame().dir == i.Config.SCREEN_DIR.V) {
wUIHelp.setOrientation("V");
this.loadNode.scale = cc.winSize.width / 750;
}
this.loadNode.active = !0;
i.Config.GamePrefab[wGameData.gameID].loadMaxSpeed ? this.loadGameRes(function() {}, function(t) {
if (e.netWorkState) {
wViewMgr.openGame(t);
wGameData.getGame().table && e.initShow();
} else var o = wGEvent.on("local_SocketState", function(i) {
if (i == n.netWorkState.CONNECTSUCCESS || i == n.netWorkState.RECONNECTSUCCESS) {
e.netWorkState = !0;
wViewMgr.openGame(t);
wGEvent.off(o);
wGameData.getGame().table && e.initShow();
}
}, e);
}) : this.loadGameRes(null, function(t) {
if (e.netWorkState) {
wViewMgr.openGame(t);
wGameData.getGame().table && e.initShow();
} else var o = wGEvent.on("local_SocketState", function(i) {
if (i == n.netWorkState.CONNECTSUCCESS || i == n.netWorkState.RECONNECTSUCCESS) {
e.netWorkState = !0;
wViewMgr.openGame(t);
wGEvent.off(o);
wGameData.getGame().table && e.initShow();
}
}, e);
});
};
t.prototype.vg_NetWorkState = function(e) {
e == n.netWorkState.CLOSEDING || e == n.netWorkState.CLOSED ? this.netWorkState = !1 : e != n.netWorkState.CONNECTSUCCESS && e != n.netWorkState.RECONNECTSUCCESS || (this.netWorkState = !0);
};
__decorate([ c(cc.Node) ], t.prototype, "selectRoom", void 0);
__decorate([ c(cc.Node) ], t.prototype, "loadNode", void 0);
__decorate([ c(cc.Node) ], t.prototype, "content", void 0);
__decorate([ c(cc.Node) ], t.prototype, "top", void 0);
__decorate([ c(cc.Node) ], t.prototype, "bottom", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "head", void 0);
__decorate([ c(cc.Sprite) ], t.prototype, "headframe", void 0);
__decorate([ c(cc.Label) ], t.prototype, "nickname", void 0);
__decorate([ c(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ c(cc.Label) ], t.prototype, "bankGold", void 0);
return __decorate([ s ], t);
}(cc.Component);
o.default = r;
cc._RF.pop();
}, {
Config: "Config",
NetInterface: "NetInterface"
} ],
Rule: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "54b1fUbldVKFbGa96khzXcp", "Rule");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.pageNode = null;
t.butLeft = null;
t.butRight = null;
t.pageView = null;
t.idx = 0;
t.len = 0;
return t;
}
t.prototype.onLoad = function() {
if (this.pageNode) {
this.pageNode.on("page-turning", this.PageTurning, this);
this.pageView = this.pageNode.getComponent(cc.PageView);
this.len = this.pageView.content.childrenCount - 1;
this.initButton();
}
};
t.prototype.initButton = function() {
this.butLeft.getComponent(cc.Button).interactable = 0 != this.idx;
this.butRight.getComponent(cc.Button).interactable = this.idx != this.len;
};
t.prototype.PageTurning = function() {
this.idx = this.pageView.getCurrentPageIndex();
this.initButton();
};
t.prototype.onClickBut = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "left":
this.idx--;
this.pageView.scrollToPage(this.idx, this.pageView.pageTurningSpeed);
break;

case "right":
this.idx++;
this.pageView.scrollToPage(this.idx, this.pageView.pageTurningSpeed);
}
};
__decorate([ s(cc.Node) ], t.prototype, "pageNode", void 0);
__decorate([ s(cc.Node) ], t.prototype, "butLeft", void 0);
__decorate([ s(cc.Node) ], t.prototype, "butRight", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
SDKManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "60173rE+DBBA6Sqj8Pc47BA", "SDKManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.wSDK = void 0;
var n = function() {
function e() {
this.classPath = "DeviceModule";
this.AndroidClassPath = "org/cocos2dx/javascript/" + this.classPath;
}
e.prototype.getUserToken = function() {
var e = "";
cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative ? e = jsb.reflection.callStaticMethod(this.AndroidClassPath, "getUserToken", "()Ljava/lang/String;") : cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative && (e = jsb.reflection.callStaticMethod(this.classPath, "getUserToken"));
e && "null" != e && "undefined" != e || (e = wUtils.randomString());
return e;
};
e.prototype.copyToClipboard = function(e) {
e = String(e);
if (cc.sys.isNative) try {
if (cc.sys.os === cc.sys.OS_ANDROID) return jsb.reflection.callStaticMethod(this.AndroidClassPath, "copyToClipboard", "(Ljava/lang/String;)V", e);
if (cc.sys.os === cc.sys.OS_IOS) return jsb.reflection.callStaticMethod(this.classPath, "copyToClipboard:", e);
} catch (t) {
wLog.w("copyToClipboard native failed: " + t);
} else {
var t = document.createElement("textarea");
t.value = e;
document.body.appendChild(t);
t.select();
try {
document.execCommand("copy");
} catch (e) {
console.error("copyTextToClipboard " + e);
alert("Oops, unable to copy");
}
document.body.removeChild(t);
}
};
e.prototype.openYXD = function(e) {
if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative) return jsb.reflection.callStaticMethod(this.AndroidClassPath, "openYXD", "(Ljava/lang/String;)I", e);
if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative) return jsb.reflection.callStaticMethod(this.classPath, "openYXD:", e);
wLog.i("不需要打开");
};
e.prototype.stopYXD = function() {
return cc.sys.os === cc.sys.OS_ANDROID && cc.sys.isNative ? jsb.reflection.callStaticMethod(this.AndroidClassPath, "stopYXD", "()V") : cc.sys.os === cc.sys.OS_IOS && cc.sys.isNative ? jsb.reflection.callStaticMethod(this.classPath, "stopYXD") : void 0;
};
e.prototype.getBatteryLevel = function() {
return cc.sys.os === cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(this.AndroidClassPath, "getBatteryLevel", "()F") : cc.sys.os === cc.sys.OS_IOS ? jsb.reflection.callStaticMethod(this.classPath, "getBatteryLevel") : 1;
};
e.prototype.openQQ = function(e) {
cc.sys.openURL("mqqwpa://im/chat?chat_type=wpa&uin=" + e + "&version=1");
};
e.prototype.openWechat = function() {
cc.sys.openURL("weixin://");
};
e.prototype.openFJ = function() {
var e = wConstant.platformType[wConstant.platform][2];
e && cc.sys.openURL(e);
};
e.prototype.shareImg = function(e) {
var t = this.captureScreen(e).filePath;
cc.sys.os === cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(this.AndroidClassPath, "shareimg", "(Ljava/lang/String;)V", t) : cc.sys.os === cc.sys.OS_IOS && jsb.reflection.callStaticMethod(this.classPath, "Share:", t);
};
e.prototype.captureScreen = function(e) {
var t;
if (e) t = e.getContentSize(); else {
e = new cc.Node();
t = cc.view.getVisibleSize();
e.parent = cc.director.getScene();
e.x = Math.floor(t.width) / 2;
e.y = Math.floor(t.height) / 2;
e.name = "delete";
}
var o = e.getComponent(cc.Camera);
o || (o = e.addComponent(cc.Camera));
o.cullingMask = 4294967295;
var n = Math.floor(t.width), i = Math.floor(t.height), a = new cc.RenderTexture();
a.initWithSize(n, i, 36168);
o.targetTexture = a;
o.render();
for (var s = a.readPixels(), c = new Uint8Array(n * i * 4), r = 4 * n, l = 0; l < i; l++) for (var p = (i - 1 - l) * n * 4, u = l * n * 4, d = 0; d < r; d++) c[u + d] = s[p + d];
var h = jsb.fileUtils.getWritablePath() + "render_to_sprite_image.png", g = jsb.saveImageData(c, n, i, h);
"delete" == e.name ? e.destroy() : e.removeComponent(cc.Camera);
if (g) {
cc.log("save image data success, file: " + h);
return {
filePath: h
};
}
cc.error("save image data failed!");
return "";
};
e.prototype.onBtnSaveToPhoto = function() {
var e = this.captureScreen().filePath;
this.saveFileToPhoto(e);
};
e.prototype.saveFileToPhoto = function(e) {
cc.sys.os === cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(this.AndroidClassPath, "saveFileToPhoto", "(Ljava/lang/String;)V", e) : cc.sys.os === cc.sys.OS_IOS && jsb.reflection.callStaticMethod(this.classPath, "saveFileToPhoto:", e);
};
return e;
}();
o.wSDK = new n();
cc._RF.pop();
}, {} ],
Scenebase: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "71957TLT5dGu7kX6LRrShic", "Scenebase");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.SceneBase = void 0;
var n = cc._decorator, i = n.ccclass;
n.property;
var a = {}, s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.onEnable = function() {
var e = this;
a.Socket = wGEvent.on("local_SocketState", this.socketState, this);
a.Center_entryRes = wGEvent.on("Msg_Hall_Connect", function(t) {
1 == t.status && e.Msg_Hall_Connect(t.data);
}, this);
};
t.prototype.onDisable = function() {
wGEvent.off(a.Socket);
wGEvent.off(a.Center_entryRes);
};
t.prototype.Msg_Hall_Connect = function() {};
t.prototype.socketState = function(e) {
this[e] && this[e]();
};
return __decorate([ i ], t);
}(cc.Component);
o.SceneBase = s;
cc._RF.pop();
}, {} ],
ScrollViewAssist: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "3556dJoYcFP/pQ0yWbX0TSR", "ScrollViewAssist");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.scroll = null;
t.content = null;
t.left = null;
t.right = null;
t.isOpen = !1;
return t;
}
t.prototype.onLoad = function() {
this.left = this.node.getChildByName("left");
this.left.active = !1;
this.right = this.node.getChildByName("right");
this.right.active = !1;
this.scroll.node.on("bounce-left", this.scroll_to_left, this);
this.scroll.node.on("bounce-right", this.scroll_to_right, this);
};
t.prototype.scroll_to_left = function() {
if (this.isOpen) {
this.left.active = !1;
this.right.active = !0;
this.right.stopAllActions();
this.right.runAction(this.creatorAnim());
}
};
t.prototype.creatorAnim = function() {
var e = cc.scaleTo(.3, .9), t = cc.scaleTo(.3, 1), o = cc.sequence(e, t);
return cc.repeatForever(o);
};
t.prototype.scroll_to_right = function() {
if (this.isOpen) {
this.left.active = !0;
this.right.active = !1;
this.left.stopAllActions();
this.left.runAction(this.creatorAnim());
}
};
t.prototype.onDisable = function() {
this.left.active = !1;
this.right.active = !1;
};
t.prototype.onEnable = function() {
var e = this;
this.scheduleOnce(function() {
if (e.content.width > cc.winSize.width) {
e.isOpen = !0;
e.scroll_to_left();
}
});
};
t.prototype.leftOnClick = function() {
var e = this;
wAudioMgr.playBtnSound();
this.scroll.scrollToLeft(.3);
this.left.getComponent(cc.Button).interactable = !1;
this.scheduleOnce(function() {
e.left.getComponent(cc.Button).interactable = !0;
e.scroll_to_left();
}, .3);
};
t.prototype.rightOnClick = function() {
var e = this;
wAudioMgr.playBtnSound();
this.scroll.scrollToRight(.3);
this.right.getComponent(cc.Button).interactable = !1;
this.scheduleOnce(function() {
e.right.getComponent(cc.Button).interactable = !0;
e.scroll_to_right();
}, .3);
};
__decorate([ a(cc.ScrollView) ], t.prototype, "scroll", void 0);
__decorate([ a(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
Scrollview_z: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "31470zacTNJW42IKml/O9Qk", "Scrollview_z");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass;
n.property;
var a = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.isevent = !0;
t.isbool = !0;
return t;
}
t.prototype._hasNestedViewGroup = function(e) {
return this.event(e.type, e);
};
t.prototype.event = function(e, t) {
if ("touchstart" == e) {
this.isevent = !0;
this.isbool = !0;
return !1;
}
if ("touchmove" == e && this.isbool) {
var o = t.touch._startPoint.sub(t.touch._prevPoint);
if ((o = Math.abs(o.mag())) > 10) {
this.isbool = !1;
Math.abs(t.touch._startPoint.x - t.touch._prevPoint.x) > 1.5 * Math.abs(t.touch._startPoint.y - t.touch._prevPoint.y) || (this.isevent = !1);
}
}
return this.isevent;
};
return __decorate([ i ], t);
}(cc.ScrollView);
o.default = a;
cc._RF.pop();
}, {} ],
Service: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "af6a1RmwtpPN7YgVQDcEyHk", "Service");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("SDKManager"), a = e("Constant"), s = cc._decorator, c = s.ccclass, r = s.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.kfHD = null;
t.mailHD = null;
t.mailContent = null;
t.mailImg = [];
t.time = 0;
return t;
}
t.prototype.onLoad = function() {
var e = this, t = function(t) {
e.kfHD.active = t;
t && (cc.find("label", e.kfHD).getComponent(cc.Label).string = "" + t);
};
t(wConstant.chatCount.serviceOne);
wGEvent.on("local_Event", function(e) {
switch (e) {
case "ChatCount":
t(wConstant.chatCount.serviceOne);
}
}, this);
cc.find("id", this.main).getComponent(cc.Label).string = "" + wGameData.getKey("uid");
wUIHelp.hideSonNode(this.mailContent);
this.showHD(wGameData.getKey("mail"));
wUtils.sendMsg("Msg_Hall_SysMail", {}, this).then(function(t) {
e.initList(t.mail);
});
};
t.prototype.showHD = function(e) {
this.mailHD.active = e;
e && (this.mailHD.getChildByName("label").getComponent(cc.Label).string = "" + e);
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "copyID":
wUIManager.showTips("用户ID复制成功", wUIManager.TIPS_OK);
i.wSDK.copyToClipboard(wGameData.getKey("uid"));
break;

case "kf":
wUIManager.showServiceChat(a.ServiceListID.kfzx, "游戏客服");
break;

case "mail":
this.openMail(e.target);
break;

case "delmail":
this.deleteMail();
break;

case "dq":
this.readAllMail();
break;

case "qx":
this.selectMail(e);
}
};
t.prototype.readAllMail = function() {
for (var e = 0, t = this.mailContent.children; e < t.length; e++) {
var o = t[e];
if (o.active && !o.getChildByName("toggle").active) {
wNetWork.send("Msg_Hall_TouchMail", {
type: 1,
id: o.data.id
});
this.upItem(o, !0);
}
}
wGameData.setKey("mail", 0);
this.showHD(wGameData.getKey("mail"));
};
t.prototype.selectMail = function(e) {
for (var t = 0, o = this.mailContent.children; t < o.length; t++) {
var n = o[t];
if (n.active) {
var i = n.getChildByName("toggle");
i.active && (i.getComponent(cc.Toggle).isChecked = e.isChecked);
}
}
};
t.prototype.deleteMail = function() {
for (var e = [], t = 0, o = this.mailContent.children; t < o.length; t++) if ((a = o[t]).active) {
var n = a.getChildByName("toggle");
n.active && n.getComponent(cc.Toggle).isChecked && e.push(a);
}
if (!(e.length <= 0)) for (var i = 0; i < e.length; i++) {
var a, s = (a = e[i]).data.id;
wNetWork.send("Msg_Hall_TouchMail", {
type: 3,
id: s
});
a.destroy();
}
};
t.prototype.openMail = function(e) {
var t = e.data;
if (1 == t.status) {
wNetWork.send("Msg_Hall_TouchMail", {
type: 1,
id: t.id
});
this.upItem(e, !0);
var o = wGameData.getKey("mail");
wGameData.setKey("mail", o - 1);
this.showHD(wGameData.getKey("mail"));
}
wViewMgr.openPage({
path: "Prefab/MailDetails",
data: {
data: t,
cb: function() {
e.destroy();
wNetWork.send("Msg_Hall_TouchMail", {
type: 3,
id: t.id
});
}
}
});
};
t.prototype.initList = function(e) {
var t = 0;
wUIHelp.hideSonNode(this.mailContent);
for (var o = 0; o < e.length; o++) {
var n = this.mailContent.children[o];
n || ((n = cc.instantiate(this.mailContent.children[0])).parent = this.mailContent);
var i = e[o];
this.upItem(n, 2 == i.status);
n.getChildByName("name").getComponent(cc.Label).string = "发件人：" + (i.type < 6 ? "活动消息" : "系统消息");
var a = "";
4 == i.type ? a = "签到获得 " + i.num + " 欢乐豆，已发送到银行，请注意查收！" : 5 == i.type && (a = "救济金获得 " + i.num + " 欢乐豆，已发送到银行，请注意查收！");
i.content = a;
n.getChildByName("content").getComponent(cc.Label).string = wUtils.handleNameLen(i.content, 32);
var s = i.created.split(" "), c = s[0].split("-"), r = c[1] + "月" + c[2] + "日 " + s[1];
n.getChildByName("time").getComponent(cc.Label).string = r;
n.active = !0;
n.data = i;
1 == i.status && t++;
}
wGameData.setKey("mail", t);
this.showHD(wGameData.getKey("mail"));
};
t.prototype.upItem = function(e, t) {
e.getChildByName("toggle").active = t;
e.getChildByName("type").getComponent(cc.Sprite).spriteFrame = this.mailImg[t ? 1 : 0];
e.getChildByName("type").opacity = t ? 120 : 255;
e.getChildByName("content").color = t ? cc.color(117, 119, 205) : cc.color(200, 202, 255);
e.getChildByName("time").color = t ? cc.color(82, 86, 187) : cc.color(128, 136, 238);
e.zIndex = t ? 2 : 1;
};
__decorate([ r(cc.Node) ], t.prototype, "kfHD", void 0);
__decorate([ r(cc.Node) ], t.prototype, "mailHD", void 0);
__decorate([ r(cc.Node) ], t.prototype, "mailContent", void 0);
__decorate([ r(cc.SpriteFrame) ], t.prototype, "mailImg", void 0);
return __decorate([ c ], t);
}(n.default);
o.default = l;
cc._RF.pop();
}, {
Constant: "Constant",
PopupBase: "PopupBase",
SDKManager: "SDKManager"
} ],
SetHead: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "59feeFmXXtDqpVQjfptTjwP", "SetHead");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.content = null;
t.headImg = null;
t.headID = 0;
return t;
}
t.prototype.onEnable = function() {
var e = this;
this.headID = wGameData.getKey("headimgurl") % 12;
if (this.headID > 5) for (var t = 6; t < 12; t++) this.content.children[t].zIndex = 12 - t - 10;
this.scheduleOnce(function() {
e.content.getChildByName("" + e.headID).getComponent(cc.Toggle).check();
});
};
t.prototype.onHide = function() {
for (var e = "0", t = 0, o = this.content.children; t < o.length; t++) {
var n = o[t];
if (n.getComponent(cc.Toggle).isChecked) {
e = n.name;
break;
}
}
wLog.w("选择的头像ID为：", e);
if (Number(e) != this.headID) {
wNetWork.send("Msg_Hall_ChangeHeadFrame", {
head: Number(e)
});
wGameData.setKey("headimgurl", Number(e));
}
};
t.prototype.onClick = function() {
wAudioMgr.playBtnSound();
};
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
__decorate([ s(cc.SpriteAtlas) ], t.prototype, "headImg", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
SetName: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "f2531M26SBEEq5+BABseMKk", "SetName");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.nickname = null;
return t;
}
t.prototype.onLoad = function() {
var e = this;
this.main.getChildByName("tips").active = !wGameData.getKey("monthcard");
wGEvent.on("Msg_Hall_ChangeNickName", function(t) {
wUIManager.hideLoadingUI();
var o = e.nickname.getComponent(cc.EditBox);
if (1 == t.status) {
wGameData.setKey("nickname", o.string);
wUIManager.showTips("修改成功!", wUIManager.TIPS_OK);
e.hide(!1);
} else o.string = wGameData.getKey("nickname");
}, this);
};
t.prototype.onClick = function() {
wAudioMgr.playBtnSound();
var e = String(wGameData.getKey("uid")).length < 4;
if (wGameData.getKey("monthcard") || e) {
var t = this.nickname.string;
if (!t) {
wUIManager.showTips("请输入昵称!");
return;
}
wNetWork.send("Msg_Hall_ChangeNickName", {
name: t
});
} else {
this.hide(!1);
wViewMgr.openPage({
path: "Prefab/PrivilegeShop"
});
}
};
__decorate([ s(cc.EditBox) ], t.prototype, "nickname", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
SetPlayerInfo: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "67f39ohzwxAG5RqR5SGCEfo", "SetPlayerInfo");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = e("SDKManager"), a = e("Config"), s = cc._decorator, c = s.ccclass, r = s.property, l = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.uid = null;
t.nickname = null;
t.phone = null;
t.head = null;
t.xbImg = [];
return t;
}
t.prototype.onLoad = function() {
this.uid.string = "" + wGameData.getKey("uid");
wGameData.getKey("headimgurl") % 12 < 6 ? this.main.getChildByName("xb").getComponent(cc.Sprite).spriteFrame = this.xbImg[0] : this.main.getChildByName("xb").getComponent(cc.Sprite).spriteFrame = this.xbImg[1];
wUIHelp.setHead(this.head, wGameData.getKey("headimgurl"));
this.init();
wGEvent.on("local_Event", this.local_Event, this);
};
t.prototype.local_Event = function(e) {
switch (e) {
case a.Config.local_Event.bind_Phone:
this.init();
break;

case a.Config.local_Event.up_Nickname:
this.nickname.getComponent(cc.Label).string = wGameData.getKey("nickname");
break;

case a.Config.local_Event.up_Head:
wGameData.getKey("headimgurl") % 12 < 6 ? this.main.getChildByName("xb").getComponent(cc.Sprite).spriteFrame = this.xbImg[0] : this.main.getChildByName("xb").getComponent(cc.Sprite).spriteFrame = this.xbImg[1];
wUIHelp.setHead(this.head, wGameData.getKey("headimgurl"));
wUIManager.showTips("更换成功", wUIManager.TIPS_OK);
}
};
t.prototype.init = function() {
var e = Boolean(wGameData.getKey("isbind")), t = wGameData.getKey("isbind");
t = t ? "+86-" + (t.slice(0, 3) + "*".repeat(4) + t.slice(-4)) : "未绑定";
this.phone.getChildByName("state").getComponent(cc.Label).string = t;
this.phone.getChildByName("btnbind").active = !e;
this.nickname.getComponent(cc.Label).string = wGameData.getKey("nickname");
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "setname":
var o = wGameData.getKey("isbind"), n = String(wGameData.getKey("uid")).length < 4;
o || n ? wViewMgr.openPage({
path: "Prefab/SetName"
}) : wViewMgr.openPage({
path: "UICommon/SystemTips",
data: function() {
wViewMgr.openPage({
path: "Prefab/BindPhone"
});
}
});
break;

case "head":
wViewMgr.openPage({
path: a.Config.ViewConfig.SetHead
});
break;

case "copy":
i.wSDK.copyToClipboard(wGameData.getKey("uid"));
wUIManager.showTips("用户ID复制成功", wUIManager.TIPS_OK);
break;

case "set":
wViewMgr.openPage({
path: a.Config.ViewConfig.SoundOnOff
});
break;

case "exitacc":
wNetWork.rejectReconnect();
wNetWork.close();
wViewMgr.openScene("Main");
break;

case "bindAcc":
wViewMgr.openPage({
path: "Prefab/BindPhone"
});
}
};
__decorate([ r(cc.Label) ], t.prototype, "uid", void 0);
__decorate([ r(cc.Node) ], t.prototype, "nickname", void 0);
__decorate([ r(cc.Node) ], t.prototype, "phone", void 0);
__decorate([ r(cc.Sprite) ], t.prototype, "head", void 0);
__decorate([ r(cc.SpriteFrame) ], t.prototype, "xbImg", void 0);
return __decorate([ c ], t);
}(n.default);
o.default = l;
cc._RF.pop();
}, {
Config: "Config",
PopupBase: "PopupBase",
SDKManager: "SDKManager"
} ],
Set: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "a1620EgCLtEJIt9xU6fN9HW", "Set");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.start = function() {
this.initVolume();
this.initNight();
var e = "v1.0." + wConstant.platform + ".8-0.1." + (wGameData.allVersion.Main || "0.0.1"), t = this.main.getChildByName("vs");
t && (t.getComponent(cc.Label).string = e);
var o = this.main.getChildByName("xf");
o && (o.active = !0);
};
t.prototype.initVolume = function() {
var e = cc.sys.localStorage.getItem("SoundVolume"), t = cc.sys.localStorage.getItem("MusicVolume");
if (0 == e && 0 == t) {
cc.find("m/jy", this.main).getComponent(cc.Toggle).check();
cc.find("m/yl", this.main).getComponent(cc.Toggle).isChecked = !1;
cc.find("m/yx", this.main).getComponent(cc.Toggle).isChecked = !1;
} else {
cc.find("m/yl", this.main).getComponent(cc.Toggle).isChecked = 0 != t;
cc.find("m/yx", this.main).getComponent(cc.Toggle).isChecked = 0 != e;
cc.find("m/jy", this.main).getComponent(cc.Toggle).isChecked = !1;
}
for (var o = 0, n = this.main.getChildByName("m").children; o < n.length; o++) {
var i = n[o], a = i.getComponent(cc.Toggle).isChecked;
i.children[0].active = !a;
}
};
t.prototype.initNight = function() {
var e = Number(cc.sys.localStorage.getItem("Night")), t = wGameData.get_day_night(), o = "";
if (e) {
if (1 == e) {
o = "bt";
wUIManager.show_day_night(!1);
} else if (2 == e) {
o = "yj";
wUIManager.show_day_night(!0);
}
} else {
o = "zd";
wUIManager.show_day_night(t);
}
for (var n = 0, i = this.main.getChildByName("scene").children; n < i.length; n++) {
var a = i[n];
a.getComponent(cc.Toggle).isChecked = a.name == o;
a.children[0].active = !(a.name == o);
}
};
t.prototype.YXonClick = function(e, t) {
switch (t) {
case "jy":
if (e.isChecked) {
wAudioMgr.setSoundVolume(0);
wAudioMgr.setMusicVolume(0);
} else {
wAudioMgr.setSoundVolume(1);
wAudioMgr.setMusicVolume(1);
}
this.initVolume();
break;

case "yl":
e.isChecked ? wAudioMgr.setMusicVolume(1) : wAudioMgr.setMusicVolume(0);
this.initVolume();
break;

case "yx":
e.isChecked ? wAudioMgr.setSoundVolume(1) : wAudioMgr.setSoundVolume(0);
this.initVolume();
}
wAudioMgr.playBtnSound();
};
t.prototype.CJonClick = function(e, t) {
switch (t) {
case "zd":
e.isChecked ? cc.sys.localStorage.setItem("Night", 0) : cc.sys.localStorage.setItem("Night", wGameData.get_day_night() + 1);
break;

case "bt":
e.isChecked ? cc.sys.localStorage.setItem("Night", 1) : cc.sys.localStorage.setItem("Night", 2);
break;

case "yj":
e.isChecked ? cc.sys.localStorage.setItem("Night", 2) : cc.sys.localStorage.setItem("Night", 1);
}
this.initNight();
wAudioMgr.playBtnSound();
};
t.prototype.onXF = function() {
wViewMgr.openPage({
path: "Prefab/GameRepair"
});
};
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
SignIn: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "9556dWDIyNEDIrxsHOzal8h", "SignIn");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.btn_lq = null;
t.content = null;
t.signNum = 0;
return t;
}
t.prototype.start = function() {
wUIHelp.hideSonNode(this.content);
this.initBtn();
wGEvent.on("Msg_Hall_SignList", this.Msg_Hall_SignList, this);
wGEvent.on("Msg_Hall_UserSign", this.Msg_Hall_UserSign, this);
wNetWork.send("Msg_Hall_SignList", []);
};
t.prototype.initBtn = function() {
this.btn_lq.node.active = !wGameData.getKey("lastsigntime");
this.main.getChildByName("signOK").active = wGameData.getKey("lastsigntime");
var e = this.main.getChildByName("tips").getComponent(cc.Label);
wGameData.getKey("monthcard") ? e.string = "剩余有效期：" + wGameData.getKey("monthcard") + "天" : e.string = "请先购买月卡，再领取福利";
};
t.prototype.initDays = function() {
for (var e in this.content.children) {
var t = this.content.children[e];
t.active = !0;
t.getChildByName("ok").active = Number(e) < this.signNum;
t.getChildByName("item").opacity = Number(e) < this.signNum ? 100 : 255;
t.getChildByName("lq").active = Number(e) == this.signNum && !wGameData.getKey("lastsigntime") && wGameData.getKey("monthcard");
}
};
t.prototype.Msg_Hall_UserSign = function(e) {
if (1 == e.status) {
var t = this.main.getChildByName("spine");
t.active = !0;
wUIHelp.playSpine(t, "animation", function() {
t.active = !1;
});
wGameData.setKey("lastsigntime", 1);
++this.signNum;
this.initDays();
this.initBtn();
wViewMgr.openPage({
path: "Prefab/RewardAnim",
data: e.data.bonus
});
var o = wGameData.getKey("mail");
wGameData.setKey("mail", o + 1);
}
};
t.prototype.Msg_Hall_SignList = function(e) {
if (1 == e.status) {
var t = e.data;
this.signNum = t.days;
this.initDays();
}
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
switch (t) {
case "lq":
if (!wGameData.getKey("monthcard")) {
wUIManager.showTips("请先购买月卡，再领取福利");
return;
}
wNetWork.send("Msg_Hall_UserSign", []);
}
};
__decorate([ s(cc.Button) ], t.prototype, "btn_lq", void 0);
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
SoundSet: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "91df9N06H9OGLUrc5A+J2OQ", "SoundSet");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.off_on_bg = [];
t.musicBg_N = null;
t.soundBg_N = null;
return t;
}
t.prototype.start = function() {
var e = wAudioMgr.getMusicVolume();
this.musicBg_N.spriteFrame = this.off_on_bg[e];
var t = wAudioMgr.getSoundVolume();
this.soundBg_N.spriteFrame = this.off_on_bg[t];
};
t.prototype.onClick = function(e, t) {
wAudioMgr.playBtnSound();
if ("m" == t) {
o = (o = wAudioMgr.getMusicVolume()) ? 0 : 1;
wAudioMgr.setMusicVolume(o);
this.musicBg_N.spriteFrame = this.off_on_bg[o];
} else {
var o = (o = wAudioMgr.getSoundVolume()) ? 0 : 1;
wAudioMgr.setSoundVolume(o);
this.soundBg_N.spriteFrame = this.off_on_bg[o];
}
wAudioMgr.playBtnSound();
};
__decorate([ s([ cc.SpriteFrame ]) ], t.prototype, "off_on_bg", void 0);
__decorate([ s(cc.Sprite) ], t.prototype, "musicBg_N", void 0);
__decorate([ s(cc.Sprite) ], t.prototype, "soundBg_N", void 0);
return __decorate([ a ], t);
}(n.default);
o.default = c;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
SystemNotice: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "ab7c4IWkRlHyZSg43N47iCt", "SystemNotice");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.item = null;
t.isMotion = !1;
t.noticeData = null;
t.sTime = 20;
return t;
}
t.prototype.start = function() {
this.width = this.node.width;
wGEvent.on("Msg_Hall_Maintenance", this.Msg_Hall_Maintenance, this);
wGEvent.on("Msg_Hall_Connect ", this.Msg_Hall_Connect, this);
this.node.scaleY = 0;
this.noticeData = wGameData.getKey("maintenance");
this.playNotice();
};
t.prototype.Msg_Hall_Connect = function(e) {
if (1 == e.status) {
this.noticeData = e.data.maintenance;
this.playNotice();
}
};
t.prototype.Msg_Hall_Maintenance = function(e) {
if (1 == e.status) {
this.noticeData = e.data.string;
this.playNotice();
}
};
t.prototype.playNotice = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t, o, n, i, a, s, c, r, l = this;
return __generator(this, function() {
if (this.isMotion) return [ 2 ];
if (!(e = this.noticeData)) {
this.showAnim(0);
return [ 2 ];
}
this.isMotion = !0;
this.item.x = 0;
this.item.active = !0;
this.item.stopAllActions();
(t = this.item.getComponent(cc.Label)).string = e;
t._forceUpdateRenderData(!0);
0 == this.node.scaleY && this.showAnim(1);
o = this.width + this.item.width + 100;
n = 5 / this.width * o;
i = cc.moveBy(n, cc.v2(-o, 0));
a = cc.callFunc(function() {
l.showAnim(0);
});
s = cc.delayTime(this.sTime);
c = cc.callFunc(function() {
l.item.active = !1;
l.isMotion = !1;
l.playNotice();
});
r = cc.sequence(i, a, s, c);
this.item.runAction(r);
return [ 2 ];
});
});
};
t.prototype.showAnim = function(e) {
this.node.stopActionByTag(99);
var t = cc.scaleTo(.25, 1, e);
this.node.runAction(t);
};
__decorate([ a(cc.Node) ], t.prototype, "item", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
SystemTips: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "01a47Pj9uRPVbz5nwGZhS/A", "SystemTips");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
t.prototype.init = function(e) {
this.cb = e;
};
t.prototype.onHide = function() {};
t.prototype.onClick = function() {
wAudioMgr.playBtnSound();
this.hide(!1);
this.cb && this.cb();
};
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
TableControlle: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "ec5edWF09lGCbY3CP+FRDen", "TableControlle");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.table = null;
t.game = null;
t.tableParent = null;
t.gameParent = null;
return t;
}
t.prototype.onLoad = function() {
this.m_game = wGameData.getGameName();
wGEvent.on("Msg_Hall_EnterRoom", this.Msg_Hall_EnterRoom, this);
wGEvent.on("Msg_Hall_FinishLoad", this.Msg_Hall_FinishLoad, this);
wGEvent.on("Msg_Hall_OutGame", this.Msg_Hall_OutGame, this);
wGEvent.on("Msg_Hall_Connect", this.Msg_Hall_Connect, this);
wGEvent.on("Msg_" + this.m_game + "_Out", this.Msg_Game_QuitGame, this);
wGEvent.on("Msg_" + this.m_game + "_RoomInfo", this.Msg_Game_RoomInfo, this);
wGEvent.on("local_Event", this.local_Event, this);
wGEvent.on("Msg_Hall_SyncGameTables", this.Msg_Hall_SyncGameTables, this);
cc.instantiate(this.table).parent = this.tableParent;
wGameData.isReconnect && wNetWork.send("Msg_Hall_FinishLoad", {
rid: wGameData.roomID
}, !0);
};
t.prototype.Msg_Hall_SyncGameTables = function(e) {
1 == e.status ? wGameData.tableList = e.data : wLog.e("桌面同步消息失败");
};
t.prototype.Msg_Hall_Connect = function(e) {
if (1 == e.status) if (wGameData.getKey("rid")) this.scheduleOnce(function() {
wNetWork.send("Msg_Hall_FinishLoad", {
rid: wGameData.roomID
}, !0);
}, .1); else {
this.Msg_Game_QuitGame({
status: 1,
data: {
uid: wGameData.getKey("uid"),
gold: wGameData.getKey("gold")
}
});
wLog.e(wGameData.roomLevel);
this.scheduleOnce(function() {
wNetWork.send("Msg_Hall_EnterGame", {
gtype: Number(wGameData.gameID),
level: wGameData.roomLevel
}, !0);
}, .1);
} else wLog.e("验证失败");
};
t.prototype.Msg_Hall_EnterRoom = function(e) {
if (1 == e.status) {
wGameData.roomID = e.data.rid;
wNetWork.send("Msg_Hall_FinishLoad", {
rid: wGameData.roomID
}, !0);
} else wLog.e("进入房间消息失败");
};
t.prototype.Msg_Hall_FinishLoad = function(e) {
1 == e.status || wLog.e("进入房间消息失败");
};
t.prototype.Msg_Game_RoomInfo = function(e) {
wUIManager.hideLoadingUI();
if (1 == e.status) {
this.tableParent.active = !1;
this.gameParent.destroyAllChildren();
this.gameParent.active = !0;
var t = cc.instantiate(this.game);
t.RoomInfo = e.data;
t.parent = this.gameParent;
} else wLog.e("获取游戏场景信息失败");
};
t.prototype.Msg_Hall_OutGame = function(e) {
1 == e.status && wViewMgr.quitGame();
};
t.prototype.Msg_Game_QuitGame = function(e) {
wUIManager.hideLoadingUI();
if (1 == e.status) {
if (e.data.uid == wGameData.getKey("uid")) {
wGameData.setKey("gold", e.data.gold);
this.tableParent.active = !0;
this.gameParent.active = !1;
this.gameParent.destroyAllChildren();
}
} else wLog.e("退出游戏失败");
};
t.prototype.local_Event = function(e, t) {
switch (e) {
case "changeTable":
this.changeTable(t);
}
};
t.prototype.changeTable = function(e) {
e ? wNetWork.send("Msg_Hall_EnterRoom", {
tableid: e,
gtype: wGameData.gameID,
level: wGameData.roomLevel
}, !0) : wLog.e("请求换桌");
};
__decorate([ a(cc.Prefab) ], t.prototype, "table", void 0);
__decorate([ a(cc.Prefab) ], t.prototype, "game", void 0);
__decorate([ a(cc.Node) ], t.prototype, "tableParent", void 0);
__decorate([ a(cc.Node) ], t.prototype, "gameParent", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
TakeOut: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "eb15cvn93NDnqlr4sTBLZGp", "TakeOut");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.showPage = null;
t.gold = null;
t.bankGold = null;
t.inputGold = null;
t.slider = null;
t.progress = null;
t.dxGold = null;
t.depositNum = 0;
t.Handle = null;
return t;
}
t.prototype.onLoad = function() {
this.node.on("toggle", this.toggle, this);
wGEvent.on("local_Event", this.local_Event, this);
this.init();
this.Handle = this.progress.node.getChildByName("Handle");
var e = this.Handle.getChildByName("jd");
this.Handle.on(cc.Node.EventType.TOUCH_START, function() {
wGameData.getKey("bank") <= 0 && wUIManager.showTips("可取款金额为0");
e.active = !0;
}, this);
this.Handle.on(cc.Node.EventType.TOUCH_END, function() {
e.active = !1;
}, this);
this.Handle.on(cc.Node.EventType.TOUCH_CANCEL, function() {
e.active = !1;
}, this);
};
t.prototype.init = function() {
this.gold.string = wUtils.numConvert(wGameData.getKey("gold"));
this.bankGold.string = wUtils.numConvert(wGameData.getKey("bank"));
};
t.prototype.editboxEvent = function(e) {
var t = Number(e.string) || 0;
if (wGameData.getKey("bank") <= 0) {
this.inputGold.string = "";
this.inputGold.blur();
} else {
if (t > wGameData.getKey("bank")) {
this.inputGold.blur();
t = wGameData.getKey("bank");
}
this.setInputGold(t);
}
};
t.prototype.sliderEvevt = function(e) {
if (wGameData.getKey("bank") <= 0) e.progress = 0; else {
var t = e.progress, o = Math.ceil(wGameData.getKey("bank") * t);
o > wGameData.getKey("bank") && (o = wGameData.getKey("bank"));
this.setInputGold(o);
}
};
t.prototype.setInputGold = function(e) {
this.inputGold.string = "" + (e ? wUtils.numConvert(e) : "");
var t = e / wGameData.getKey("bank") || 0;
this.slider.progress = t;
this.progress.progress = t;
this.depositNum = e;
this.dxGold.string = "(" + wUtils.smalltoBIG(e) + ")";
cc.find("jd/label", this.Handle).getComponent(cc.Label).string = Math.floor(100 * t) + "%";
};
t.prototype.onClick = function(e, t) {
var o = this;
wAudioMgr.playBtnSound();
switch (t) {
case "all":
if (wGameData.getKey("bank") <= 0) return;
this.setInputGold(wGameData.getKey("bank"));
break;

case "deposit":
if (!this.depositNum) {
wUIManager.showTips("欢乐豆提取失败!");
return;
}
wUtils.sendMsg("Msg_Hall_BankAccess", {
gold: this.depositNum
}, this).then(function(e) {
wUIManager.showTips("取款成功", wUIManager.TIPS_OK);
wGameData.setKey("bank", e.bank);
wGameData.setKey("gold", e.gold);
o.setInputGold(0);
});
break;

case "purge":
this.setInputGold(0);
}
};
t.prototype.local_Event = function(e) {
switch (e) {
case "up_Gold":
this.init();
}
};
t.prototype.toggle = function() {
wAudioMgr.playBtnSound();
this.showPage.check();
};
__decorate([ a(cc.Toggle) ], t.prototype, "showPage", void 0);
__decorate([ a(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ a(cc.Label) ], t.prototype, "bankGold", void 0);
__decorate([ a(cc.EditBox) ], t.prototype, "inputGold", void 0);
__decorate([ a(cc.Slider) ], t.prototype, "slider", void 0);
__decorate([ a(cc.ProgressBar) ], t.prototype, "progress", void 0);
__decorate([ a(cc.Label) ], t.prototype, "dxGold", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
TipsLabel: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "d14cbgyYzFLeJhzlQTDXmZP", "TipsLabel");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = [ "敢于下注，赢家永远属于您", "大牌要你命，小牌能救命", "打鱼靠技术，心态要稳，手不能抖", "玩是高级娱乐，博是低级趣味", "针对不同类型的选手要有不同的打法", "人生如麻将，一见钟情叫天胡", "一样的游戏，不一样的体验", "输赢都不走，能做一把手", "哪个小孩天天哭，哪个牌友天天输", "尊重对手的加注，尤其是反加", "只要思想不滑坡，办法总比苦难多", "不要过度在于牌局的输赢，这只是你漫长牌局中的小波折", "游戏开始后的感觉就像回家一样", "只要你不是最大的牌，就要想一想对手下重注的理由", "现存的一切美好事物，无一不是创新的结果", "胜不骄败不馁，好的心态能让你在游戏中做出正确的决策", "人生只有一条路不能选择，就是放弃的路", "给自己适当的休息时间，这样继续牌局时才有动力和激情", "世界上最美的湖，就是碰碰胡", "下次对决时，我也不是现在的我", "不要较劲，学会放弃，也许对手的底牌超乎您的想象", "冲动是魔鬼，好心态，好运自然来", "一想到有您这样的牌有，就不枉选择了这条路", "当鱼潮来临时，抓紧打一波小鱼也是挺赚的", "拼一拼，草房变洋房，再拼一拼，夏利变宾利", "不要羡慕其他人的运气，命运是公平的，好运迟早会眷顾您", "尝试欺骗对手您有一副好牌，但并不容易成功", "不是无路可走的时候，最好不要起手就全压", "错不了，就是你，是我一辈子的劲敌", "光脚不怕穿鞋的，也许对手的顾虑比您更多", "每个牌局都好似人生，该出手时就出手，不要事后后悔", "机会总是留给有准备的人的", "小输十把没关系，大赢一把就OK", "你还记得大明湖畔的夏雨荷吗", "人生在世无非让别人笑笑，偶尔笑笑别人", "拼一拼 草房变洋房，再拼一拼，夏利变宾利", "尊重对手就是尊重自己的钱包", "不是无路可走的时候，最好不要起手就全压", "游戏开始后的感觉就像回家一样，so sweet", "中国的老话，软的怕硬的，硬的怕不要命的", "需要两个实力相当的凑在一起，才能够达到神乎其技！", "岁月是把杀猪刀，紫了葡萄，黑了木耳，软了香蕉", "输了不投降，竞争意识强", "错不了，就是你，你就是我一辈子的劲敌！", "现在一切美好的事物，无一不是创新的结果", "只要你不是最大的牌，你就要想对手下重注的理由", "输赢都不走，能做一把手", "打鱼靠技术，心态不能急，手不能抖！", "搏一搏，单车边摩托，再搏一搏，路虎变航母", "世界上最漂亮的花，就是杠上花", "只要思想不滑坡，办法总比困难多！", "爱拼才会赢，敢下就会红！要想富，下重注！", "敢于下注，赢家永远属于你！", "晚一步不如早一步，问题您来了！", "虽然保守不是最好的策略，但是冲动只会让你结束的更快。", "胜者才有资格往上爬！", "打多打少全凭一个缘字，打多打少别声张", "只要你活得比对手时间长你就赢了", "一想到有你这样得牌友，就觉得不枉选了这条路", "一样得游戏，不一样得体验", "针对不同的对手要有不同的打法", "世界最美的湖，是碰碰湖", "只有一条路不能选择——那就是放弃的路", "唯一比凶猛的对手更可怕的是你的错误打法", "人生只有走出来的精彩，没有等出来的辉煌。", "下次对决时，我也不会是今天的我", "弃牌是最常见的策略，牌不好就等下一次机会", "每个牌局好似人生，该出手时就出手，不因为错过而后悔", "人生如麻将，一见钟情叫天胡", "永不言败，推到再来" ], i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.index = null;
return t;
}
t.prototype.start = function() {
this.initShow();
};
t.prototype.getindex = function() {
var e = wUtils.random(0, n.length - 1);
return e == this.index ? this.getindex() : e;
};
t.prototype.initShow = function() {
var e = this;
this.index = this.getindex();
this.getComponent(cc.Label).string = n[this.index];
this.node.opacity = 0;
cc.tween(this.node).to(1, {
opacity: 255
}).delay(3).to(1, {
opacity: 0
}).delay(.3).call(function() {
e.initShow();
}).start();
};
return __decorate([ a ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
Tips: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "84788mhYgtIi57oNYRrUYrX", "Tips");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("NodePool"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.copy = null;
t.content = null;
t.nodePool = null;
t.startY = null;
t.spacingY = 5;
return t;
}
t.prototype.start = function() {
this.nodePool = new n.default(this.copy);
this.nodePool.put(this.copy);
this.startY = this.copy.y;
};
t.prototype.showTip = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
var o, n, i, a, s, c, r, l, p, u, d, h, g, f, m = this;
return __generator(this, function(_) {
switch (_.label) {
case 0:
if (!e) {
wLog.w("提示内容：" + e);
return [ 2 ];
}
(o = this.nodePool.getNode).active = !0;
(n = o.getChildByName("content").getComponent(cc.RichText)).string = e;
(i = n.node.width + 160) < 700 && (i = 700);
o.width = i;
o.getComponent(cc.Layout).updateLayout();
n.node.color = t;
a = 0;
for (s = this.content.children; a < s.length; a++) {
c = s[a];
r = cc.moveBy(.15, cc.v2(0, o.height + this.spacingY));
c.runAction(r);
}
return [ 4, wUtils.syncDelayed(.15, this) ];

case 1:
_.sent();
o.setPosition(0, this.startY);
o.parent = this.content;
l = cc.moveTo(.15, cc.v2(0, this.startY)).easing(cc.easeOut(2));
p = cc.fadeIn(.15);
u = cc.spawn(l, p);
d = cc.delayTime(1.2);
h = cc.fadeOut(.3);
g = cc.callFunc(function() {
m.nodePool.put(o);
});
f = cc.sequence(u, d, h, g);
o.stopAllActions();
o.runAction(f);
return [ 2 ];
}
});
});
};
__decorate([ s(cc.Node) ], t.prototype, "copy", void 0);
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {
NodePool: "NodePool"
} ],
UIHelp: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "424b1wFgRFHpoEJtzmZI+kH", "UIHelp");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.UIHelp = void 0;
var n = e("CountUp"), i = function() {
function e() {}
e.prototype.easeBackOut = function(e, t) {
e.scale = .5;
e.active = !0;
cc.tween(e).to(.2, {
scale: 1
}, {
easing: "backOut"
}).call(function() {
t && t();
}).start();
};
e.prototype.easeIn = function(e, t) {
e.scale = 1;
e.active = !0;
cc.tween(e).to(.1, {
scale: 0
}).call(function() {
t && t();
}).start();
};
e.prototype.CountUp = function(e, t, o, i, a, s, c) {
void 0 === i && (i = 2);
void 0 === a && (a = "");
void 0 === c && (c = !0);
var r = {
startVal: t || 1,
decimalPlaces: 0,
duration: i,
useGrouping: c,
useEasing: !1,
prefix: a
};
e instanceof cc.Node && (e = e.getComponent(cc.Label));
if (0 != o) {
var l = new n.CountUp(e, o, r);
l.error ? wLog.e(l.error) : l.start(function() {
s && s();
l = void 0;
});
return l;
}
e.string = "0";
};
e.prototype.CountUp_ = function(e, t, o, n, i, a) {
void 0 === a && (a = "");
if (0 != o) {
var s = Math.ceil((o - t) / (60 * n)), c = cc.delayTime(.01), r = null, l = cc.callFunc(function() {
if ((t += s) > o) {
if (r) {
e.stopAction(r);
e.getComponent(cc.Label).string = a + wUtils.numConvert(o);
i && i();
r = null;
}
} else e.getComponent(cc.Label).string = a + wUtils.numConvert(t);
});
e.getComponent(cc.Label).string = a + wUtils.numConvert(t);
r = cc.repeatForever(cc.sequence(c, l));
e.runAction(r);
} else {
e.getComponent(cc.Label).string = "0";
i && i();
}
};
e.prototype.hideSonNode = function(e, t) {
void 0 === t && (t = !1);
for (var o = 0, n = e.children; o < n.length; o++) n[o].active = t;
};
e.prototype.runActionSync = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function() {
return [ 2, new Promise(function(o) {
t.clone(e).then(cc.callFunc(function() {
o(!0);
})).start();
}) ];
});
});
};
e.prototype.a_loadRes = function(e, t, o) {
void 0 === t && (t = cc.SpriteFrame);
return new Promise(function(n) {
wRes.loadRes(e, t, function(t, o) {
t && wLog.e("资源加载错误：" + e);
n({
err: t,
res: o
});
}, o);
});
};
e.prototype.setSpriteFrame = function(e, t) {
wRes.loadRes(e, cc.SpriteFrame, function(o, n) {
if (o) wLog.e("图片资源加载错误：" + e); else if (cc.isValid(t)) {
t instanceof cc.Node && (t = t.getComponent(cc.Sprite));
t.spriteFrame = n;
}
});
};
e.prototype.setHead = function(e, t, o) {
void 0 === o && (o = !1);
t = Number(t) % 12;
wRes.loadRes("Hall/Head/plist_head", cc.SpriteAtlas, function(o, n) {
if (o) wLog.e("图片资源加载错误：", NaN); else {
var i = t <= 5 ? "female" : "male";
i = "plist_head_" + i + "_" + (t % 6 + 1);
if (cc.isValid(e)) {
e instanceof cc.Node && (e = e.getComponent(cc.Sprite));
e.spriteFrame = n._spriteFrames[i];
}
}
});
};
e.prototype.loadHead = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function() {
e instanceof cc.Node && (e = e.getComponent(cc.Sprite));
try {
cc.assetManager.loadRemote(t, function(t, o) {
if (t) wLog.e(t); else {
var n = new cc.SpriteFrame(o);
n ? cc.isValid(e) && (e.spriteFrame = n) : cc.assetManager.releaseAsset(o);
}
});
} catch (e) {
wLog.w("-------------------头像获取跨域了");
}
return [ 2 ];
});
});
};
e.prototype.setHeadFrame = function(e, t) {
t = Number(t) || 0;
t %= 11;
this.setSpriteFrame("Hall/HeadFrame/" + t, e);
};
e.prototype.shake = function(e) {
var t = e.x, o = e.y, n = cc.repeatForever(cc.sequence(cc.moveTo(.032, cc.v2(t + 5, o + 7)), cc.moveTo(.032, cc.v2(t - 6, o + 7)), cc.moveTo(.032, cc.v2(t - 13, o + 3)), cc.moveTo(.032, cc.v2(t + 3, o - 6)), cc.moveTo(.032, cc.v2(t - 5, o + 5)), cc.moveTo(.032, cc.v2(t + 2, o - 8)), cc.moveTo(.032, cc.v2(t - 8, o - 10)), cc.moveTo(.032, cc.v2(t + 3, o + 10)), cc.moveTo(.032, cc.v2(t + 0, o + 0))));
e.stopActionByTag(111);
n.setTag(111);
e.runAction(n);
setTimeout(function() {
if (cc.isValid(e, !0)) {
e.stopActionByTag(111);
e.x = t;
e.y = o;
}
}, 1e3);
};
e.prototype.setNodeColor = function(e, t) {
e.color = t;
for (var o = 0, n = e.children; o < n.length; o++) {
var i = n[o];
this.setNodeColor(i, t);
}
};
e.prototype.setOrientation = function(e) {
cc.sys.os == cc.sys.OS_ANDROID && cc.sys.isNative ? jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setOrientation", "(Ljava/lang/String;)V", e) : cc.sys.os == cc.sys.OS_IOS && cc.sys.isNative && jsb.reflection.callStaticMethod("AppController", "setOrientation:", e);
var t = cc.view.getFrameSize();
if ("V" == e) {
cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
t.width > t.height && cc.view.setFrameSize(t.height, t.width);
cc.Canvas.instance.designResolution = cc.size(750, 1334);
} else {
cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
if (t.height > t.width) {
cc.view.setFrameSize(t.height, t.width);
cc.Canvas.instance.designResolution = cc.size(1334, 750);
}
}
try {
window.dispatchEvent(new Event("resize"));
} catch (e) {}
};
e.prototype.playSpine = function(e, t, o, n) {
void 0 === o && (o = null);
void 0 === n && (n = !1);
e instanceof cc.Node && (e = e.getComponent(sp.Skeleton));
e.clearTracks();
e.setToSetupPose();
var i = e.setAnimation(0, t, n);
n || e.setTrackCompleteListener(i, function() {
o && o();
});
};
return e;
}();
o.UIHelp = i;
cc._RF.pop();
}, {
CountUp: "CountUp"
} ],
UIManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "b1d73foaTVIVbkGzqrSbtme", "UIManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.UIManager = void 0;
var n, i, a = e("Config");
(function(e) {
e[e.ERROR = cc.color(255, 0, 0)] = "ERROR";
e[e.OK = cc.color(40, 249, 8)] = "OK";
e[e.WHITE = cc.color(255, 255, 255)] = "WHITE";
})(n || (n = {}));
(function(e) {
e.Hall = "Hall";
e.Game = "Game";
})(i || (i = {}));
var s = function() {
function e() {
this.TIPS_OK = n.OK;
this.TIPS_ERROR = n.ERROR;
this.TIPS_WHITE = n.WHITE;
this.loading = null;
this.confirmBox = null;
this.tips = null;
this.day_nigh = null;
var e = cc.Canvas.instance.node.parent;
this.loading = e.getChildByName("Loading");
this.confirmBox = e.getChildByName("ConfirmBox");
this.tips = e.getChildByName("Tips");
this.day_nigh = e.getChildByName("Night");
}
e.prototype.show_day_night = function(e) {
this.day_nigh.opacity = e ? 255 : 0;
};
e.prototype.initNoticePos = function(e) {
var t = cc.Canvas.instance.node.getChildByName("GameNotice");
t.stopActionByTag(100);
t.stopActionByTag(101);
if (e == i.Hall) {
if (t.startPos) {
var o = cc.moveTo(.25, t.startPos);
o.setTag(100);
t.runAction(o);
}
(l = cc.scaleTo(.25, 1)).setTag(101);
t.runAction(l).setTag(101);
} else if (e == i.Game) {
t.startPos = t.getPosition();
var n = wGameData.getGame().noticePos1;
"HBSL" == wGameData.getGame().enName && (n = cc.v2(0, cc.winSize.height / 2 - 181));
(l = cc.moveTo(.25, n)).setTag(100);
t.runAction(l);
if (wGameData.getGame().dir == a.Config.SCREEN_DIR.V) {
var s = cc.winSize.width / 840, c = cc.scaleTo(.25, s);
c.setTag(101);
t.runAction(c);
}
}
var r = cc.Canvas.instance.node.getChildByName("SystemNotice");
r.stopActionByTag(100);
if (e == i.Hall) {
if (r.startPos) {
(l = cc.moveTo(.25, r.startPos)).setTag(100);
r.runAction(l);
}
} else if (e == i.Game) {
r.startPos = r.getPosition();
var l;
n = wGameData.getGame().noticePos2;
"HBSL" == wGameData.getGame().enName && (n = cc.v2(0, cc.winSize.height / 2 - 151));
(l = cc.moveTo(.25, n)).setTag(100);
r.runAction(l);
}
};
e.prototype.showLoadingUI = function() {
var e = this;
this.loading.active = !0;
var t = cc.delayTime(30), o = cc.callFunc(function() {
wUIManager.showTips("连接超时");
e.loading.active = !1;
}), n = cc.sequence(t, o);
this.loading.stopAllActions();
this.loading.runAction(n);
};
e.prototype.hideLoadingUI = function() {
this.loading.stopAllActions();
this.loading.active = !1;
};
e.prototype.showConfirmUI = function(e) {
this.confirmBox.getComponent("ConfirmBox").show(e);
};
e.prototype.showConfirmUI_B = function(e) {
wViewMgr.openPage({
path: "UICommon/ConfirmBox",
data: e
});
};
e.prototype.showTips = function(e, t) {
void 0 === t && (t = n.ERROR);
"消息不存在" != e && this.tips.getComponent("Tips").showTip(e, t);
};
e.prototype.showScreenDir = function(e) {
var t = this;
return new Promise(function(o) {
wRes.loadRes("Prefab/ScreenDir", function(n, i) {
return __awaiter(t, void 0, void 0, function() {
var t;
return __generator(this, function(n) {
switch (n.label) {
case 0:
(t = cc.instantiate(i)).parent = cc.Canvas.instance.node;
t.zIndex = 1e4;
t.children[0].getComponent(sp.Skeleton).setAnimation(0, "animation", !1);
return [ 4, wUtils.syncDelayed(1.4, t) ];

case 1:
n.sent();
t.destroy();
e && e();
o(!0);
return [ 2 ];
}
});
});
});
});
};
e.prototype.showGameOutTips = function(e) {
if (1 == wGameData.roomLevel) {
e.content = "温馨提示：您现在正在免费体验房间，退出房间后体验欢乐豆将会清零";
e.isGameRun = !1;
wUIManager.showConfirmUI({
content: e.content,
okCB: e.okCB
});
} else e.okCB && e.okCB();
};
e.prototype.enterRoomFailTips = function(e) {
var t = this;
wUIManager.showConfirmUI({
content: "进入房间失败，最低进入欢乐豆是" + e,
okCB: function() {
wViewMgr.openPage({
path: "prefab/Bank",
bundle: wGameData.getGameName()
});
},
okTips: "去银行",
ok_b_open: !0,
ok_b_Tips: "去充值",
ok_b_CB: function() {
return __awaiter(t, void 0, void 0, function() {
return __generator(this, function(e) {
switch (e.label) {
case 0:
wViewMgr.enterHall();
cc.Canvas.instance.node.getChildByName("Hall").getComponent("Hall_View").gameListAni_b();
return [ 4, wUtils.syncDelayed(.2, this) ];

case 1:
e.sent();
wViewMgr.openPage({
path: "Prefab/Recharge"
});
return [ 2 ];
}
});
});
}
});
};
e.prototype.showServiceChat = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, o;
return __generator(this, function() {
if (!wConstant.KF_AZ_Url) return [ 2 ];
wLog.w("----------客服ID:  ", e);
o = wGameData.getKey("uid") || "";
t = wConstant.KF_AZ_Url + "/index/index/home?visiter_id=" + o + "&visiter_name=" + o + "&avatar=&business_id=" + e + "&groupid=0&special=" + e;
if (cc.sys.isBrowser) window.open(t, "_blank"); else {
wUIHelp.setOrientation("V");
wViewMgr.openPage({
path: a.Config.ViewConfig.WEB,
showMode: 0,
data: t
});
}
return [ 2 ];
});
});
};
return e;
}();
o.UIManager = s;
cc._RF.pop();
}, {
Config: "Config"
} ],
UIProgress: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "6f8ee19dyFL9I2L2Q1hHrhH", "UIProgress");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = cc._decorator, i = n.ccclass, a = n.property, s = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.tips = null;
t.progress = null;
t.bfb = null;
return t;
}
t.prototype.onLoad = function() {
var e = this.progress.node.getChildByName("bfb");
e && (this.bfb = e.getComponent(cc.Label));
};
t.prototype.setTips = function(e) {
this.tips.string = e;
};
t.prototype.setProg = function(e) {
if (!(e && e < this.progress.progress)) {
this.progress.progress = e;
this.bfb && (this.bfb.string = Math.floor(100 * e) + "%");
}
};
t.prototype.setTP = function(e, t) {
this.tips.string = e;
this.progress.progress = t;
this.bfb && (this.bfb.string = Math.floor(100 * t) + "%");
};
__decorate([ a(cc.Label) ], t.prototype, "tips", void 0);
__decorate([ a(cc.ProgressBar) ], t.prototype, "progress", void 0);
return __decorate([ i ], t);
}(cc.Component);
o.default = s;
cc._RF.pop();
}, {} ],
UserAgreement: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "2084dLBaUBHtZfTiBj2sKKa", "UserAgreement");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = cc._decorator, a = i.ccclass;
i.property;
var s = function(e) {
__extends(t, e);
function t() {
return null !== e && e.apply(this, arguments) || this;
}
return __decorate([ a ], t);
}(n.default);
o.default = s;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
Utils: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "32ccfLq1/5FZr792RUF0XPd", "Utils");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.Utils = void 0;
var n = function() {
function e() {
this.world_local_POS = function(e, t) {
return e.convertToNodeSpaceAR(t);
};
this.clone = function(e) {
if (e) return JSON.parse(JSON.stringify(e));
};
this.random = function(e, t) {
e = Math.floor(e);
t = Math.floor(t);
return Math.floor(Math.random() * (t - e + 1) + e);
};
}
e.prototype.strlen = function(e) {
for (var t = 0, o = 0; o < e.length; o++) {
var n = e.charCodeAt(o);
n >= 1 && n <= 126 || 65376 <= n && n <= 65439 ? t++ : t += 2;
}
return t;
};
e.prototype.handleNameLen = function(e, t, o) {
void 0 === o && (o = !0);
var n = "", i = 0;
if (this.strlen(e) > t) {
for (var a = 0; a < t; a) {
var s = e.charCodeAt(i);
s >= 1 && s <= 126 || 65376 <= s && s <= 65439 ? a++ : a += 2;
n += e[i++];
if (e.length <= i) break;
}
o && (n += "...");
} else n = e;
return n;
};
e.prototype.local_world__POS = function(e, t) {
var o = e.convertToWorldSpaceAR(cc.v2(0, 0));
return t ? this.world_local_POS(t, o) : o;
};
e.prototype.checkPwd = function(e) {
return !!/^(\w){6,10}$/.exec(e);
};
e.prototype.checkUser = function(e) {
return !!/^[a-zA-z0-9]\w{3,15}$/.test(e);
};
e.prototype.checkMobile = function(e) {
return !!/^1\d{10}$/.test(e);
};
e.prototype.checkSpecialChar = function(e) {
return !!new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]").test(e);
};
e.prototype.checkStrLen = function(e) {
for (var t = 0, o = 0; o < e.length; o++) e.charCodeAt(o) > 127 || 94 == e.charCodeAt(o) ? t += 2 : t++;
return t;
};
e.prototype.smalltoBIG = function(e) {
var t = [ "角", "分" ], o = [ "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖" ], n = [ [ "", "万", "亿" ], [ "", "拾", "佰", "仟" ] ];
e = Math.abs(e);
for (var i = "", a = 0; a < t.length; a++) i += (o[Math.floor(10 * e * Math.pow(10, a)) % 10] + t[a]).replace(/零./, "");
i = i || "";
e = Math.floor(e);
for (a = 0; a < n[0].length && e > 0; a++) {
for (var s = "", c = 0; c < n[1].length && e > 0; c++) {
s = o[e % 10] + n[1][c] + s;
e = Math.floor(e / 10);
}
i = s.replace(/(零.)*零$/, "").replace(/^$/, "零") + n[0][a] + i;
}
return "" + i.replace(/(零.)*零/, "").replace(/(零.)+/g, "零").replace(/^$/, "零");
};
e.prototype.getAngle = function(e, t) {
var o = t.x - e.x, n = t.y - e.y;
return -cc.v2(o, n).signAngle(cc.v2(1, 0)) / Math.PI * 180;
};
e.prototype.GetAngleByVector = function(e, t) {
var o = t.y - e.y, n = t.x - e.x;
if (0 == n && e.y < t.y) return 0;
if (0 == n && e.y > t.y) return 180;
if (0 == o && e.x > t.x) return -90;
if (0 == o && e.x < t.x) return 90;
var i = Math.abs(o) / Math.abs(n), a = 0;
o > 0 && n < 0 ? a = -(90 - 180 * Math.atan(i) / Math.PI) : o > 0 && n > 0 ? a = 90 - 180 * Math.atan(i) / Math.PI : o < 0 && n < 0 ? a = -180 * Math.atan(i) / Math.PI - 90 : o < 0 && n > 0 && (a = 180 * Math.atan(i) / Math.PI + 90);
return a;
};
e.prototype.Normalize = function(e, t) {
return this.VectorSub(e, t).normalize();
};
e.prototype.VectorSub = function(e, t) {
return e.sub(t);
};
e.prototype.VectorLen = function(e, t) {
return this.VectorSub(e, t).mag();
};
e.prototype.timestampToTime = function(e) {
var t = new Date(1e3 * e);
return t.getFullYear() + "-" + (t.getMonth() + 1 < 10 ? "0" + (t.getMonth() + 1) : t.getMonth() + 1) + "-" + (t.getDate() < 10 ? "0" + t.getDate() : t.getDate()) + " " + (t.getHours() < 10 ? "0" + t.getHours() : t.getHours()) + ":" + (t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes()) + ":" + (t.getSeconds() < 10 ? "0" + t.getSeconds() : t.getSeconds());
};
e.prototype.getFormatDuringTime = function(e) {
var t = Math.floor(e / 1) % 60, o = (e = Math.floor(e / 60)) % 60, n = (e = Math.floor(e / 60)) % 24;
n < 10 && (n = "0" + n);
o < 10 && (o = "0" + o);
t < 10 && (t = "0" + t);
return n + ":" + o + ":" + t;
};
e.prototype.syncDelayed = function(e, t) {
return new Promise(function(o) {
setTimeout(function() {
cc.isValid(t, !0) && o(!0);
}, 1e3 * e);
});
};
e.prototype.randomString = function(e) {
void 0 === e && (e = 16);
for (var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678", o = t.length, n = "", i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * o));
return n;
};
e.prototype.numConvert = function(e) {
var t = e.toString(), o = t.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
return t.replace(o, "$1,");
};
e.prototype.creatorProxy = function(e, t) {
void 0 === t && (t = !1);
var o = new Proxy(e, {
get: function(e, t) {
return e[t];
},
set: function(e, n, i) {
e[n] = i;
if (t) {
for (var a in o.keyCb) if (Object.prototype.hasOwnProperty.call(o.keyCb, a)) {
var s = o.keyCb[a];
s && s.forEach(function(e) {
e && e(i);
});
}
} else o.keyCb[n] && o.keyCb[n].forEach(function(e) {
e && e(i);
});
return !0;
}
});
o.keyCb = {};
o.onEvevt = function(e, t) {
if ("function" == typeof t) {
!this.keyCb[e] && (this.keyCb[e] = []);
this.keyCb[e].push(t);
} else wLog.e("对象绑定错误");
};
return o;
};
e.prototype.goldFormat = function(e, t, o) {
void 0 === t && (t = 1);
void 0 === o && (o = 3);
var n = 0;
if (!((e = Number(e)) < 1e4)) {
if (e < 1e8) {
var i = Math.pow(10, t);
n = e / 1e4;
return (n = (parseInt(String(Math.round(n * i))) / i).toFixed(t)) + "万";
}
i = Math.pow(10, o);
n = e / 1e8;
return (n = (parseInt(String(Math.round(n * i))) / i).toFixed(o)) + "亿";
}
return e;
};
e.prototype.getLerpPoints = function(e, t) {
if (null != e && e.length > 0 && t > 0) {
var o = [];
o.push([ e[0][0], e[0][1] ]);
for (var n = 0; n < t; ++n) o.push(this.getLerpPoint(e, t, n + 1));
return o;
}
return null;
};
e.prototype.getLerpPoint = function(e, t, o) {
if (e.length > 1) {
for (var n = [], i = 0; i < e.length - 1; ++i) {
var a = e[i], s = e[i + 1], c = (a[0] + (s[0] - a[0]) * o / t).toFixed(2), r = (a[1] + (s[1] - a[1]) * o / t).toFixed(2);
n.push([ Number(c), Number(r) ]);
}
return this.getLerpPoint(n, t, o);
}
return e[0];
};
e.prototype.convertToChinaNum = function(e) {
var t = new Array("零", "一", "二", "三", "四", "五", "六", "七", "八", "九"), o = new Array("", "十", "百", "千", "万", "十", "百", "千", "亿", "十", "百", "千", "万", "十", "百", "千", "亿");
if (!e || isNaN(e)) return "零";
for (var n = e.toString().split(""), i = "", a = 0; a < n.length; a++) {
var s = n.length - 1 - a;
i = o[a] + i;
i = t[n[s]] + i;
}
return (i = (i = (i = (i = (i = i.replace(/零(千|百|十)/g, "零").replace(/十零/g, "十")).replace(/零+/g, "零")).replace(/零亿/g, "亿").replace(/零万/g, "万")).replace(/亿万/g, "亿")).replace(/零+$/, "")).replace(/^一十/g, "十");
};
e.prototype.splitBet = function(e, t) {
for (var o = wUtils.clone(e), n = [], i = [], a = (o = o.sort(function(e, t) {
return e - t;
})).length - 1; a >= 0; --a) {
var s = o[a];
if (t >= s) {
t -= s;
n.push(s);
i.push(a);
a += 1;
}
}
return [ n, i ];
};
e.prototype.runActionSync = function(e, t) {
return __awaiter(this, void 0, void 0, function() {
return __generator(this, function() {
return [ 2, new Promise(function(o) {
t.clone(e).then(cc.callFunc(function() {
o(!0);
})).start();
}) ];
});
});
};
e.prototype.sendMsg = function(e, t, o, n) {
var i = this;
void 0 === n && (n = !1);
return new Promise(function(a, s) {
var c = wGEvent.on(e, function(e) {
wGEvent.off(c);
1 == e.status && cc.isValid(o, !0) ? a(e.data) : s();
}, i);
wNetWork.send(e, t, n);
});
};
e.prototype.saveForWebBrowser = function(e, t) {
var o = JSON.stringify(e);
if (cc.sys.isBrowser) {
var n = new Blob([ o ]), i = document.createElement("a");
i.download = t;
i.innerHTML = "Download File";
if (null != window.URL) i.href = window.URL.createObjectURL(n); else {
i.href = window.URL.createObjectURL(n);
i.onclick = function() {
document.body.removeChild(i);
};
i.style.display = "none";
document.body.appendChild(i);
}
i.click();
}
};
return e;
}();
o.Utils = n;
cc._RF.pop();
}, {} ],
ViewManager: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "7da5dafSQVA+ZULvnANl2vo", "ViewManager");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.ViewManager = void 0;
var n = e("Config"), i = e("PopUpManager"), a = function() {
function e() {
this.bundle = null;
}
e.prototype.openPage = function(e) {
i.PopUp.openPage(e);
};
e.prototype.openScene = function(e, t) {
wConstant.openScene = e;
cc.director.loadScene(e, function(e) {
t && t(e);
e && wLog.e("场景加载错误");
});
};
e.prototype.enterSite = function() {
var e = this;
return new Promise(function(t) {
try {
var o = wGameData.gameID, i = null;
(i = 1e3 != wGameData.gameID ? cc.Canvas.instance.node.getChildByName("Room") : cc.Canvas.instance.node.getChildByName("MJHJ")).active = !0;
var a = n.Config.GamePrefab[o];
if (!a) {
wNetWork.send("SaveClientError", "错误1：config配置文件为空");
return;
}
e.bundle = a.enName;
wRes.loadRes("prefab/Load", function(o, n) {
return __awaiter(e, void 0, void 0, function() {
return __generator(this, function() {
t();
if (o) {
this.enterHall();
return [ 2 ];
}
cc.instantiate(n).parent = i;
return [ 2 ];
});
});
}, a.enName);
} catch (o) {
t();
e.enterHall();
wUIManager.showTips("游戏加载错误");
wNetWork.send("SaveClientError", o);
}
});
};
e.prototype.enterHall = function() {
wGameData.isReconnect = !1;
wGameData.tableList = {};
var e = cc.Canvas.instance.node.getChildByName("Hall"), t = cc.Canvas.instance.node.getChildByName("Game"), o = cc.Canvas.instance.node.getChildByName("Room");
e.getComponent("Hall_View").enterGameAni_b();
e.opacity = 255;
t.active = !1;
t.destroyAllChildren();
o.active = !1;
o.destroyAllChildren();
if (this.bundle) {
wRes.releaseBundle(this.bundle);
this.bundle = null;
}
setTimeout(function() {
wAudioMgr.playBgMusic("sound/bgm/bg_main");
}, 500);
};
e.prototype.openGame = function(e) {
var t = cc.Canvas.instance.node.getChildByName("Hall"), o = cc.Canvas.instance.node.getChildByName("Game");
cc.instantiate(e).parent = o;
t.opacity = 0;
o.active = !0;
};
e.prototype.quitGame = function(e) {
wAudioMgr.stopAllEffects();
var t = cc.Canvas.instance.node.getChildByName("UIShow");
t && t.destroyAllChildren();
"number" == typeof e && wGameData.setKey("gold", e);
var o = cc.Canvas.instance.node.getChildByName("Game");
cc.Canvas.instance.node.getChildByName("Hall");
var n = cc.Canvas.instance.node.getChildByName("Room");
wGameData.roomLevel = 5;
if (o.childrenCount) {
for (var i = 0, a = o.children; i < a.length; i++) a[i].destroy();
o.active = !1;
n.active = !0;
if (!n.childrenCount) {
wGameData.gameID = null;
this.enterHall();
}
}
};
return e;
}();
o.ViewManager = a;
cc._RF.pop();
}, {
Config: "Config",
PopUpManager: "PopUpManager"
} ],
WEB: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "37528ALD+lEeJfDp44O6NNT", "WEB");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("PopupBase"), i = window;
cc.sys.isBrowser && window.addEventListener("message", function(e) {
console.log("收到web发来得消息--\x3e>>:", e.data);
"closeWeb" == e.data && i.closeWebView(e);
});
var a = cc._decorator, s = a.ccclass, c = a.property, r = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.webView = null;
t.colseWeb = null;
t.isTime = !1;
return t;
}
t.prototype.start = function() {
var e = this;
function t() {
var t = cc.winSize;
wLog.e("---winSize:", t.width, t.height);
e.webView.node.setContentSize(cc.size(t.width, t.height));
e.webView.node.setAnchorPoint(.5, .5);
e.webView.node.setPosition(0, 0);
e.webView.url = e.url + (e.url.indexOf("?") >= 0 ? "&" : "?") + "ignore=" + Date.now();
e.webView.setJavascriptInterfaceScheme("testkey");
e.webView.setOnJSCallback(e.cocosToWeb.bind(e));
i.closeWebView = e.closeWebView.bind(e);
}
cc.sys.isNative ? setTimeout(t, 500) : t();
};
t.prototype.init = function(e) {
var t = Number(wGameData.getKey("headimgurl")) || 0;
t %= 12;
e = e.replace("avatar=", "avatar=" + wConstant.KF_AZ_Url + "/assets/images/head/" + t + ".png");
this.url = e;
wLog.e("---客服地址:", e);
cc.sys.isNative && "undefined" != typeof wUIHelp && wUIHelp.setOrientation && wUIHelp.setOrientation("V");
};
t.prototype.cocosToWeb = function(e, t) {
var o = t.replace("testkey://", "");
console.log("jsCallback-------str-------", o, e);
if (1 == o) i.closeWebView(e, t); else if (2 == o) {
var n = wGameData.getKey("uid") || "", a = {
isNative: cc.sys.isNative,
uid: n
};
if (cc.sys.isBrowser) {
wLog.i("-------cocos发送当前环境到web--\x3e>:", cc.sys.isNative);
this.webView._impl._iframe.contentWindow.postMessage(JSON.stringify(a), "*");
} else cc.sys.isNative && this.webView.evaluateJS("setGameInfo(" + JSON.stringify(a) + ")");
}
this.webView.node.active = !0;
};
t.prototype.onWebFinishLoad = function(e, t) {
wLog.w("-------------:web当前状态");
if (t === cc.WebView.EventType.LOADED) {
this.cocosToWeb("AAAAAA", "testkey://2");
wLog.e("-----网页加载成功");
} else if (t === cc.WebView.EventType.LOADING) wLog.e("-----网页加载中"); else if (t === cc.WebView.EventType.ERROR) {
wLog.e("-----网页失败");
this.closeWebView();
wUIManager.showTips("客服打开失败！");
}
};
t.prototype.closeWebView = function() {
var e = this.node.parent.getChildByName("KFMsg");
this.node.destroy();
!e && wUIHelp.setOrientation("");
};
__decorate([ c(cc.WebView) ], t.prototype, "webView", void 0);
__decorate([ c(cc.WebView) ], t.prototype, "colseWeb", void 0);
return __decorate([ s ], t);
}(n.default);
o.default = r;
cc._RF.pop();
}, {
PopupBase: "PopupBase"
} ],
WebSock: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "5b31apqE2BBG4wx8FTEavIN", "WebSock");
Object.defineProperty(o, "__esModule", {
value: !0
});
o.WebSock = void 0;
var n = function() {
function e() {
this._ws = null;
this.onConnected = null;
this.onMessage = null;
this.onError = null;
this.onClosed = null;
}
e.prototype.connect = function(e) {
var t = this;
if (this._ws && this._ws.readyState === WebSocket.CONNECTING) {
console.log("websocket connecting, wait for a moment...");
return !1;
}
wLog.w("socket url:  ", e);
this._ws = new WebSocket(e);
this._ws.onmessage = function(e) {
t.onMessage(e.data);
};
this._ws.onopen = this.onConnected;
this._ws.onerror = this.onError;
this._ws.onclose = this.onClosed;
return !0;
};
e.prototype.send = function(e) {
if (this._ws.readyState == WebSocket.OPEN) {
this._ws.send(e);
return !0;
}
return !1;
};
e.prototype.close = function() {
this._ws.close();
};
return e;
}();
o.WebSock = n;
cc._RF.pop();
}, {} ],
arcadeScene: [ function(e, t, o) {
"use strict";
cc._RF.push(t, "470d71ICg9JHLCzWaxZAKxg", "arcadeScene");
Object.defineProperty(o, "__esModule", {
value: !0
});
var n = e("Config"), i = cc._decorator, a = i.ccclass, s = i.property, c = function(e) {
__extends(t, e);
function t() {
var t = null !== e && e.apply(this, arguments) || this;
t.gold = null;
t.winGold = null;
t.xzGold = null;
t.title = null;
t.num = null;
t.time = null;
t.content = null;
t.isRun = !1;
t.conscore = 0;
t.myGold = 0;
t.rcGold = 0;
t.endPos = [ -30, 0 ];
t.maxX = 0;
t.maxY = 0;
t.index = 0;
t.len = 1;
t.timer = null;
t.stop = !1;
return t;
}
t.prototype.start = function() {
this.myGold = wGameData.getKey("gold");
this.rcGold = wGameData.getKey("gold");
this.gold.string = "入场金币: " + this.myGold;
this.xzGold.string = "当前身上的金币：" + this.myGold;
this.title.string = n.Config.GamePrefab[wGameData.gameID].zhName;
this.gameType = n.Config.GamePrefab[wGameData.gameID].enName;
};
t.prototype.JXLWLine = function(e) {
for (var t = {
1: {
3: 50,
4: 200,
5: 2e3
},
2: {
3: 20,
4: 50,
5: 300
},
3: {
3: 15,
4: 25,
5: 250
},
4: {
3: 10,
4: 20,
5: 200
},
6: {
3: 8,
4: 20,
5: 150
},
7: {
3: 6,
4: 20,
5: 100
},
10: {
3: 5,
4: 40,
5: 90
},
9: {
3: 8,
4: 35,
5: 85
},
8: {
3: 6,
4: 30,
5: 80
},
5: {
3: 5,
4: 15,
5: 75
},
11: {
2: 5,
3: 100,
4: 900,
5: 6e3
},
12: {
3: 1e3,
4: 3e3,
5: 5e3
},
13: {
3: 5,
4: 10,
5: 20
},
14: {
3: .1,
4: .3,
5: .5
}
}, o = 0, n = e.win; o < n.length; o++) {
var i = n[o];
i.type >= 13 || t[i.type][i.num] != i.multiple && wLog.e("倍数出现问题了");
}
e.score;
e.curfree && wLog.i("---------------出现了免费------------------");
};
t.prototype.SHZLine = function(e) {
for (var t = 0, o = {
1: {
5: 2e3
},
2: {
3: 50,
4: 200,
5: 1e3
},
3: {
3: 20,
4: 80,
5: 400
},
4: {
3: 15,
4: 40,
5: 200
},
5: {
3: 10,
4: 30,
5: 160
},
6: {
3: 7,
4: 20,
5: 100
},
7: {
3: 5,
4: 15,
5: 60
},
8: {
3: 3,
4: 10,
5: 40
},
9: {
3: 2,
4: 5,
5: 20
}
}, n = 0, i = e.win; n < i.length; n++) {
var a = i[n], s = o[a.type][a.num];
t += s;
s != a.multiple && wLog.e("倍数出现问题了");
}
(t *= 500) != e.score && wLog.e("金币计算错误");
};
t.prototype.DFDCLine = function(e) {
var t = {
2: {
1: {
5: 1e3,
4: 200,
3: 100
},
2: {
5: 500,
4: 100,
3: 50
},
3: {
5: 400,
4: 80,
3: 40
},
4: {
5: 250,
4: 50,
3: 25
},
5: {
5: 50,
4: 10,
3: 5
},
6: {
5: 50,
4: 10,
3: 5
},
7: {
5: 50,
4: 10,
3: 5
},
8: {
5: 50,
4: 10,
3: 5
},
9: {
5: 50,
4: 10,
3: 5
},
10: {
5: 100,
4: 20,
3: 10
},
12: {
5: 50,
4: 10,
3: 5
},
13: {
5: 50,
4: 10,
3: 5
},
14: {
5: 50,
4: 10,
3: 5
},
15: {
5: 50,
4: 10,
3: 5
},
16: {
5: 50,
4: 10,
3: 5
},
17: {
5: 50,
4: 10,
3: 5
}
},
3: {
1: {
5: 680,
4: 128,
3: 68
},
2: {
5: 380,
4: 88,
3: 38
},
3: {
5: 280,
4: 68,
3: 28
},
4: {
5: 180,
4: 68,
3: 28
},
5: {
5: 30,
4: 10,
3: 5
},
6: {
5: 30,
4: 10,
3: 5
},
7: {
5: 20,
4: 10,
3: 5
},
8: {
5: 20,
4: 10,
3: 5
},
9: {
5: 50,
4: 10,
3: 5
},
10: {
5: 128,
4: 28,
3: 8
},
12: {
5: 15,
4: 8,
3: 5
},
13: {
5: 15,
4: 8,
3: 5
},
14: {
5: 15,
4: 8,
3: 5
},
15: {
5: 15,
4: 8,
3: 5
},
16: {
5: 15,
4: 8,
3: 5
},
17: {
5: 15,
4: 8,
3: 5
}
},
4: {
1: {
5: 750,
4: 150,
3: 100
},
2: {
5: 450,
4: 100,
3: 50
},
3: {
5: 300,
4: 80,
3: 40
},
4: {
5: 200,
4: 50,
3: 20
},
5: {
5: 50,
4: 15,
3: 10
},
6: {
5: 50,
4: 15,
3: 10
},
7: {
5: 50,
4: 15,
3: 10
},
8: {
5: 50,
4: 15,
3: 10
},
9: {
5: 50,
4: 10,
3: 5
},
10: {
5: 138,
4: 25,
3: 10
},
12: {
5: 30,
4: 10,
3: 5
},
13: {
5: 30,
4: 10,
3: 5
},
14: {
5: 25,
4: 10,
3: 5
},
15: {
5: 25,
4: 10,
3: 5
},
16: {
5: 20,
4: 10,
3: 5
},
17: {
5: 20,
4: 10,
3: 5
}
},
5: {
1: {
5: 800,
4: 200,
3: 100
},
2: {
5: 400,
4: 100,
3: 50
},
3: {
5: 200,
4: 75,
3: 30
},
4: {
5: 150,
4: 50,
3: 25
},
5: {
5: 50,
4: 15,
3: 5
},
6: {
5: 50,
4: 10,
3: 5
},
7: {
5: 30,
4: 10,
3: 5
},
8: {
5: 30,
4: 10,
3: 5
},
9: {
5: 50,
4: 10,
3: 5
},
10: {
5: 100,
4: 25,
3: 15
},
12: {
5: 20,
4: 10,
3: 5
},
13: {
5: 20,
4: 10,
3: 5
},
14: {
5: 20,
4: 10,
3: 5
},
15: {
5: 15,
4: 10,
3: 5
},
16: {
5: 15,
4: 10,
3: 5
},
17: {
5: 15,
4: 10,
3: 5
}
}
};
t = t[wGameData.roomLevel];
for (var o = 0, n = e.win; o < n.length; o++) {
var i = n[o];
t[i.type][i.num];
i.multiple;
}
e.curfree && wLog.e("1111111111111111111");
if (e.jackpot) {
wLog.e("1111111111111111111");
this.end();
}
};
t.prototype.XSZYLine = function(e) {
for (var t = {
100: {
3: 10,
4: 25,
5: 50
},
120: {
3: 10,
4: 25,
5: 50
},
130: {
3: 10,
4: 25,
5: 50
},
11: {
3: 10,
4: 20,
5: 75
},
10: {
3: 10,
4: 15,
5: 60
},
9: {
3: 5,
4: 15,
5: 50
},
8: {
3: 5,
4: 10,
5: 30
},
7: {
3: 5,
4: 10,
5: 15
},
6: {
3: 5,
4: 10,
5: 20
},
5: {
3: 2,
4: 5,
5: 15
},
4: {
3: 2,
4: 5,
5: 15
},
3: {
3: 2,
4: 5,
5: 15
},
2: {
3: 1,
4: 5,
5: 10
},
1: {
3: 1,
4: 5,
5: 10
}
}, o = 0, n = e.win; o < n.length; o++) {
var i = n[o];
t[i.type][i.num] != i.multiple && wLog.e("倍数出现问题了");
}
};
t.prototype.CLZSLine = function(e) {
for (var t = 0, o = 0, n = e.win; o < n.length; o++) t += n[o].multiple;
e.freebeishu && (t *= e.freebeishu);
if (e.curfree && e.conscore) {
for (var i = 0, a = 0; a < e.map.length; a++) i += e.map[a].reduce(function(e, t) {
return e + (3 == t ? 1 : 0);
}, 0);
i > 5 && (i = 5);
i > 2 && (t += {
3: 100,
4: 500,
5: 1e3
}[i]);
}
t != e.beishu && wLog.e("倍数出现问题了");
};
t.prototype.Msg_Game_Start = function(e) {
return __awaiter(this, void 0, void 0, function() {
var t, o, n, i, a = this;
return __generator(this, function(s) {
switch (s.label) {
case 0:
if (1 != e.status) {
this.end();
return [ 2 ];
}
t = e.data;
switch (wGameData.gameID) {
case 22:
this.JXLWLine(t);
break;

case 23:
this.SHZLine(t);
break;

case 26:
this.DFDCLine(t);
break;

case 36:
this.XSZYLine(t);
break;

case 38:
this.CLZSLine(t);
}
if (!(t.game > 0)) return [ 3, 2 ];
if ("23" != wGameData.gameID) return [ 3, 2 ];
n = function() {
var e, o = wGEvent.on("Msg_SHZ_Game", function(n) {
if (1 == n.status) {
wGEvent.off(o);
for (var i = 0, a = n.data; i < a.length; i++) {
var s = a[i];
t.gold += s.gold;
}
e();
} else wLog.e("小游戏出现错误");
}, a);
return new Promise(function(t) {
e = t;
});
};
wNetWork.send("Msg_SHZ_Game", []);
return [ 4, n() ];

case 1:
s.sent();
s.label = 2;

case 2:
if ("25" != wGameData.gameID) return [ 3, 3 ];
this.conscore || (this.conscore = 5 * t.curscore);
t.gold += t.score + (t.jackpot || 0);
this.initItem(t.gold, t.score + (t.jackpot || 0));
return [ 3, 13 ];

case 3:
if ("36" != wGameData.gameID) return [ 3, 4 ];
this.conscore || (this.conscore = 5 * t.conscore);
t.gold = this.myGold - t.conscore + t.win;
this.initItem(t.gold, 0);
return [ 3, 13 ];

case 4:
if ("37" != wGameData.gameID) return [ 3, 5 ];
this.conscore || (this.conscore = 5 * t.conscore);
t.gold = this.myGold - t.conscore + t.score + t.jackpot + t.collect_win;
this.initItem(t.gold, 0);
return [ 3, 13 ];

case 5:
if ("40" != wGameData.gameID) return [ 3, 6 ];
this.conscore || (this.conscore = 5 * t.conscore);
t.gold = this.myGold - t.conscore + t.score;
this.initItem(t.gold, 0);
return [ 3, 13 ];

case 6:
if ("26" != wGameData.gameID) return [ 3, 12 ];
this.conscore || (this.conscore = 5 * t.conscore);
if (3 != wGameData.roomLevel) return [ 3, 9 ];
if (!t.free || !t.conscore) return [ 3, 8 ];
o = [ 3, 4, 5 ];
n = function() {
var e, t = wGEvent.on("Msg_DFDC_ChangeMap", function() {
wGEvent.off(t);
e();
}, a);
return new Promise(function(t) {
e = t;
});
};
wNetWork.send("Msg_DFDC_ChangeMap", {
width: o[wUtils.random(0, 2)]
});
return [ 4, n() ];

case 7:
s.sent();
s.label = 8;

case 8:
return [ 3, 11 ];

case 9:
if (4 != wGameData.roomLevel) return [ 3, 11 ];
if (!t.free || !t.conscore) return [ 3, 11 ];
o = [ 1, 2, 3, 4, 5 ][wUtils.random(0, 4)];
n = function() {
var e, t = wGEvent.on("Msg_DFDC_ChangeIcon", function() {
wGEvent.off(t);
e();
}, a);
return new Promise(function(t) {
e = t;
});
};
wNetWork.send("Msg_DFDC_ChangeIcon", {
type: 5 == o ? 10 : o
});
return [ 4, n() ];

case 10:
s.sent();
s.label = 11;

case 11:
this.initItem(t.gold, 0);
return [ 3, 13 ];

case 12:
if ("38" == wGameData.gameID) {
this.conscore || (this.conscore = 5 * t.conscore);
t.curfree && wLog.w("中免费次数:", t.curfree);
if (t.jackpot) {
i = [ "", "最小奖", "倒数第二奖", "中间奖", "第二大奖", "最大奖" ];
wLog.w("中奖池:", t.jackpot, "   倍数:" + t.jackpotbeishu, "    类型: " + i[t.jackpotleve]);
}
this.initItem(t.gold, t.score + t.jackpot * t.jackpotbeishu);
} else {
this.conscore || (this.conscore = 5 * t.conscore);
this.initItem(t.gold, t.score + (t.jackpot || 0));
}
s.label = 13;

case 13:
this.myGold = t.gold;
this.xzGold.string = "当前身上的金币：" + this.myGold;
this.winGold.string = "总输赢：" + (this.myGold - this.rcGold);
return [ 2, new Promise(function(e) {
e(!0);
}) ];
}
});
});
};
t.prototype.initItem = function(e) {
var t = this.content.children[1].children[0].getComponent(cc.Graphics);
t.moveTo.apply(t, this.endPos);
var o = (this.rcGold - e) / this.conscore * this.len * -1;
this.endPos[0] += this.len;
this.endPos[1] = o;
t.lineTo.apply(t, this.endPos);
e > this.myGold ? t.strokeColor = cc.color(0, 0, 0, 255) : t.strokeColor = cc.color(0, 255, 0, 255);
t.stroke();
this.index++;
this.maxX = this.endPos[0];
Math.abs(this.endPos[1]) > this.maxY && (this.maxY = Math.abs(this.endPos[1]));
this.content.width = this.maxX > 1334 ? this.maxX : 1334;
this.setLine(this.maxX);
this.content.height = 2 * this.maxY > 550 ? 2 * this.maxY : 550;
this.initWH();
};
t.prototype.initWH = function() {
this.content.width *= this.content.scale;
this.content.height *= this.content.scale;
};
t.prototype.setLine = function(e) {
var t = this.content.children[0].children[0].getComponent(cc.Graphics);
t.clear();
t.moveTo(-30, 0);
t.lineTo(e + 100, 0);
t.stroke();
};
t.prototype.sendMsgStart = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t = this;
return __generator(this, function(o) {
switch (o.label) {
case 0:
if (this.myGold < this.conscore) {
wUIManager.showTips("钱不够了");
this.end();
return [ 2 ];
}
e = function() {
var e, o = wGEvent.on("Msg_" + t.gameType + "_Start", function(n) {
wGEvent.off(o);
t.Msg_Game_Start(n);
e();
}, t);
return new Promise(function(t) {
e = t;
});
};
wNetWork.send("Msg_" + this.gameType + "_Start", wConstant.arcadeSceneData);
return [ 4, e() ];

case 1:
o.sent();
return [ 2 ];
}
});
});
};
t.prototype.run = function() {
return __awaiter(this, void 0, void 0, function() {
var e, t;
return __generator(this, function(o) {
switch (o.label) {
case 0:
if (!(e = Number(this.num.string))) {
wUIManager.showTips("输入旋转次数");
return [ 2 ];
}
if (this.isRun) {
wUIManager.showTips("正在请求中");
return [ 2 ];
}
this.isRun = !0;
t = 0;
o.label = 1;

case 1:
if (!(t < e)) return [ 3, 4 ];
this.num.string = "" + (e - t);
return [ 4, this.sendMsgStart() ];

case 2:
o.sent();
if (this.stop) return [ 3, 4 ];
o.label = 3;

case 3:
t++;
return [ 3, 1 ];

case 4:
this.stop = !1;
return [ 2 ];
}
});
});
};
t.prototype.onDestroy = function() {
if (this.timer) {
clearTimeout(this.timer);
this.timer = null;
}
};
t.prototype.end = function() {
this.unscheduleAllCallbacks();
this.num.string = "";
this.node.stopAllActions();
this.isRun = !1;
this.stop = !0;
};
t.prototype.onClick = function(e, t) {
switch (t) {
case "exit":
wGameData.setKey("gold", this.myGold);
this.end();
this.node.destroy();
break;

case "zt":
this.end();
break;

case "ks":
this.run();
break;

case "fd":
this.content.scale += .1;
this.initWH();
break;

case "sx":
this.content.scale -= .1;
this.initWH();
}
};
t.prototype.onDisable = function() {
wGameData.getGame().dir == n.Config.SCREEN_DIR.V && wUIHelp.setOrientation("V");
};
__decorate([ s(cc.Label) ], t.prototype, "gold", void 0);
__decorate([ s(cc.Label) ], t.prototype, "winGold", void 0);
__decorate([ s(cc.Label) ], t.prototype, "xzGold", void 0);
__decorate([ s(cc.Label) ], t.prototype, "title", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "num", void 0);
__decorate([ s(cc.EditBox) ], t.prototype, "time", void 0);
__decorate([ s(cc.Node) ], t.prototype, "content", void 0);
return __decorate([ a ], t);
}(cc.Component);
o.default = c;
cc._RF.pop();
}, {
Config: "Config"
} ],
quadtree: [ function(e, t) {
"use strict";
cc._RF.push(t, "b4761CLeJFCppjS3Ako9AcF", "quadtree");
(function() {
function e(e, t, o, n) {
this.max_objects = t || 10;
this.max_levels = o || 4;
this.level = n || 0;
this.bounds = e;
this.objects = [];
this.nodes = [];
}
e.prototype.split = function() {
var t = this.level + 1, o = this.bounds.width / 2, n = this.bounds.height / 2, i = this.bounds.x, a = this.bounds.y;
this.nodes[0] = new e({
x: i + o,
y: a,
width: o,
height: n
}, this.max_objects, this.max_levels, t);
this.nodes[1] = new e({
x: i,
y: a,
width: o,
height: n
}, this.max_objects, this.max_levels, t);
this.nodes[2] = new e({
x: i,
y: a + n,
width: o,
height: n
}, this.max_objects, this.max_levels, t);
this.nodes[3] = new e({
x: i + o,
y: a + n,
width: o,
height: n
}, this.max_objects, this.max_levels, t);
};
e.prototype.getIndex = function(e) {
var t = [], o = this.bounds.x + this.bounds.width / 2, n = this.bounds.y + this.bounds.height / 2, i = e.y < n, a = e.x < o, s = e.x + e.width > o, c = e.y + e.height > n;
i && s && t.push(0);
a && i && t.push(1);
a && c && t.push(2);
s && c && t.push(3);
return t;
};
e.prototype.insert = function(e) {
var t, o = 0;
if (this.nodes.length) {
t = this.getIndex(e);
for (o = 0; o < t.length; o++) this.nodes[t[o]].insert(e);
} else {
this.objects.push(e);
if (this.objects.length > this.max_objects && this.level < this.max_levels) {
this.nodes.length || this.split();
for (o = 0; o < this.objects.length; o++) {
t = this.getIndex(this.objects[o]);
for (var n = 0; n < t.length; n++) this.nodes[t[n]].insert(this.objects[o]);
}
this.objects = [];
}
}
};
e.prototype.retrieve = function(e) {
var t = this.getIndex(e), o = this.objects;
if (this.nodes.length) for (var n = 0; n < t.length; n++) o = o.concat(this.nodes[t[n]].retrieve(e));
return o = o.filter(function(e, t) {
return o.indexOf(e) >= t;
});
};
e.prototype.clear = function() {
this.objects = [];
for (var e = 0; e < this.nodes.length; e++) this.nodes.length && this.nodes[e].clear();
this.nodes = [];
};
"undefined" != typeof t && "undefined" != typeof t.exports ? t.exports = e : window.Quadtree = e;
})();
cc._RF.pop();
}, {} ],
ts: [ function(e, t) {
"use strict";
cc._RF.push(t, "90561LZHwxDf4HIuAbnxYIq", "ts");
cc._RF.pop();
}, {} ]
}, {}, [ "APlayerInfo", "A_GameRecord", "A_Give", "A_MyAgent", "A_MyInfo", "A_MyPlayer", "A_ReceiveRecord", "A_TradeRecord", "AccountLogin", "AdaptView", "Agent", "AllAccount", "Animation", "ArcadeBase", "AudioManager", "BUYUSet", "Bank", "BankCheck", "BigWin", "BindGiveGold", "BindPhone", "BtnDelayedClick", "ButtonTrinsItion", "CQRCode", "ChangeBindPhone", "ChangeGuns", "ChatTools", "Config", "ConfirmBox", "ConfirmBox_B", "Constant", "CountUp", "Deposit", "DropDown", "DummyPlayer", "EventDispatcher", "Experience", "FirstHotupDate", "ForgetPassword", "ForgetPasswordB", "ForgetPassword_YH", "Game", "GameBank", "GameData", "GameExitTips", "GameNotice", "GamePlayerList", "GameRepair", "Give", "GiveConfirm", "GiveEvidence", "GiveJL", "GoldAnim", "GoldRoll", "GuestTips", "HTTP", "Hall_Controlle", "Hall_GameStatus", "Hall_View", "HotUpDate", "HotUpDateGame", "ImportantTips", "IncomeJL", "JackpotNum", "KFMsg", "Knapsack", "LPDropDown", "LPPlayerList", "Layout_z", "Load", "LoadHallRes", "LogManager", "Login", "LoginCheck", "LuckyPlayer", "Mail", "MailDetails", "Main", "ModIfyBankPwd", "MultiBase", "NetInterface", "NetNode", "NetWork", "Night", "NodePool", "PageViewIndicator_z", "PageView_z", "PlayerCheck", "PokerBase", "PokerTableBase", "PopUpManager", "PopUpNotice", "PopUpNoticeTips", "PopupBase", "Privilege", "PrivilegeHelp", "PrivilegeShop", "Propose", "ProxyNodeShow", "RankTips", "Ranking", "Recharge", "RechargeRecord", "Register", "RegisterA", "Register_RetrievePow", "ReportTips", "ResLoader", "RewardAnim", "RoomChoose", "RoomTips", "Room_Load", "Rule", "SDKManager", "Scenebase", "ScrollViewAssist", "Scrollview_z", "Service", "Set", "SetHead", "SetName", "SetPlayerInfo", "SignIn", "SoundSet", "SystemNotice", "SystemTips", "TableControlle", "TakeOut", "Tips", "TipsLabel", "UIHelp", "UIManager", "UIProgress", "UserAgreement", "Utils", "ViewManager", "WEB", "WebSock", "arcadeScene", "quadtree", "ts" ]);