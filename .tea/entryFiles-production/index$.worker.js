/*BUGME_START*/
const __BUGME_START__ = 1;
!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=43)}({0:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.Connect="RemoteX.connect",e.Disconnect="RemoteX.disconnect",e.PageChanged="RemoteX.pageChanged",e.DataChanged="RemoteX.dataChanged",e.EvaluteScript="RemoteX.evaluteScript",e.RegisterChannel="RemoteX.registerChannel",e.PassByWorker="RemoteX.PassByWorker",e.syncStorage="RemoteX.syncStorage",e.setStorage="RemoteX.setStorage",e.removeStorage="RemoteX.removeStoarge",e.requestWillBeSent="RemoteX.requestWillBeSent",e.requestFinished="RemoteX.requestFinished",e.ExitApp="RemoteX.exitApp",e.Ping="RemoteX.ping",e.Pong="RemoteX.pong",e.PerfTrace="Perf.trace",e.NativeTrace="Perf.native",e.NetworkTrace="Perf.network",e.JsapiTrace="Perf.jsapi"}(t.RemoteXMethods||(t.RemoteXMethods={}))},1:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getUserAgent=function(){return navigator.swuserAgent||navigator.userAgent||""},t.checkIOS=function(){return/\(i[^;]+;( U;)? CPU.+Mac OS X/.test(t.getUserAgent())};var o=self.AlipayJSBridge&&self.AlipayJSBridge.call,r=self.fetch;t.callInternalAPI=function(e,t){var n={data:{method:e,param:t},action:"internalAPI"},s=encodeURIComponent(JSON.stringify(n));r?r("https://alipay.kylinBridge/?data="+s,{mode:"no-cors"}).then((function(){})).catch((function(){})):o&&o("internalAPI",{method:e,param:t})},t.getStartupParams=function(){return self.__appxStartupParams||{}},t.getBridge=function(){return self.AFAppX.bridge},t.debug=console.log,t.waitForAppx=function(e){self.AFAppX?e():setTimeout((function(){t.waitForAppx(e)}),50)};var s=Function;t.executeScript=function(e){return new s("var res = "+e+"; return res;")()}},11:function(e,t){
/*!
Copyright (C) 2013-2017 by Andrea Giammarchi - @WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
var n="\\x"+("0"+"~".charCodeAt(0).toString(16)).slice(-2),o="\\"+n,r=new RegExp(n,"g"),s=new RegExp(o,"g"),a=new RegExp("(?:^|([^\\\\]))"+o),i=[].indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},c=String;function u(e,t,n){return t instanceof Array?function(e,t,n){for(var o=0,r=t.length;o<r;o++)t[o]=u(e,t[o],n);return t}(e,t,n):t instanceof c?t.length?n.hasOwnProperty(t)?n[t]:n[t]=function(e,t){for(var n=0,o=t.length;n<o;e=e[t[n++].replace(s,"~")]);return e}(e,t.split("~")):e:t instanceof Object?function(e,t,n){for(var o in t)t.hasOwnProperty(o)&&(t[o]=u(e,t[o],n));return t}(e,t,n):t}var l={stringify:function(e,t,s,a){return l.parser.stringify(e,function(e,t,s){var a,c,u=!1,l=!!t,d=[],f=[e],g=[e],h=[s?"~":"[Circular]"],p=e,m=1;return l&&(c="object"==typeof t?function(e,n){return""!==e&&t.indexOf(e)<0?void 0:n}:t),function(e,t){return l&&(t=c.call(this,e,t)),u?(p!==this&&(a=m-i.call(f,this)-1,m-=a,f.splice(m,f.length),d.splice(m-1,d.length),p=this),"object"==typeof t&&t?(i.call(f,t)<0&&f.push(p=t),m=f.length,(a=i.call(g,t))<0?(a=g.push(t)-1,s?(d.push((""+e).replace(r,n)),h[a]="~"+d.join("~")):h[a]=h[0]):t=h[a]):"string"==typeof t&&s&&(t=t.replace(n,o).replace("~",n))):u=!0,t}}(e,t,!a),s)},parse:function(e,t){return l.parser.parse(e,function(e){return function(t,r){var s="string"==typeof r;return s&&"~"===r.charAt(0)?new c(r.slice(1)):(""===t&&(r=u(r,r,{})),s&&(r=r.replace(a,"$1~").replace(o,n)),e?e.call(this,t,r):r)}}(t))},parser:JSON};e.exports=l},4:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(5),r=n(0),s=n(1);t.ChannelPot={_activeViewId:null,_map:{},get:function(e){return this._map[e]||null},set:function(e,t){this._map[e]=t},remove:function(e){delete this._map[e]},setActiveId:function(e){this._activeViewId=e},sendToMainChannel:function(e){o.SocketConn.send(e)},sendToActiveChannel:function(e){this.get(this._activeViewId)?this.get(this._activeViewId).postMessage(e):s.debug("[bugme] missing active channel",e,this._activeViewId)}};var a=function(){function e(e){var t=this;this._port=e,this._port.onmessage=this.onMessage,Object.defineProperty(e,"onmessage",{get:function(){return t.onMessage},set:function(){}})}return e.prototype.onMessage=function(e){if(e.data){var n=e.data,o=n.method,s=n.params;o===r.RemoteXMethods.PassByWorker&&t.ChannelPot.sendToMainChannel(s)}},e.prototype.postMessage=function(e){this._port.postMessage(e)},e}();t.ChannelHandler=a},43:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(44),r=n(47),s=n(1);s.getStartupParams().isRemoteX?s.waitForAppx(o.registerRemoteX):r.registerPreview()},44:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(4),r=n(5),s=n(1),a=n(0),i=n(45);t.registerRemoteX=function(){if(self.addEventListener&&self.navigator){s.debug("[bugme] start to register remotex"),i.listenEvents(),r.SocketConn.open(),self.addEventListener("message",(function(e){if(e&&e.data){var t=e.data;if(t.method===a.RemoteXMethods.RegisterChannel){var n=e.ports[0],r=String(t.params.viewId);o.ChannelPot.set(r,new o.ChannelHandler(n)),o.ChannelPot.setActiveId(r),o.ChannelPot.sendToMainChannel({method:a.RemoteXMethods.PageChanged})}}})),self.bugmeAPI={send:function(e){r.SocketConn.send(e)}};self.document&&self.document.dispatchEvent?self.document.dispatchEvent("bugmeInjected"):self.dispatchEvent&&self.dispatchEvent(new CustomEvent("bugmeInjected"))}}},45:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(4),r=n(0),s=n(1),a=n(5),i=n(46);function c(e){if(!e||"object"!=typeof e)return{};var t={};return Object.keys(e).forEach((function(n){t[n]=""+e[n]})),t}var u=/^https?:\/\/hpmweb\.alipay\.com/,l=function(e){u.test(e.url)||o.ChannelPot.sendToMainChannel({method:r.RemoteXMethods.requestWillBeSent,params:{reqId:e.requestId,url:e.url,method:(e.method||"GET").toUpperCase(),body:e.postBody,headers:c(e.headers)}})},d=function(e){u.test(e.url)||o.ChannelPot.sendToMainChannel({method:r.RemoteXMethods.requestFinished,params:{reqId:e.requestId,url:e.url,status:e.status,body:e.body,headers:c(e.headers)}})},f=function(e){u.test(e.url)||o.ChannelPot.sendToMainChannel({method:r.RemoteXMethods.requestFinished,params:{reqId:e.requestId,url:e.url,status:null}})},g=function(e){var t={};Object.keys(e.data).forEach((function(n){try{t[n]=JSON.parse(e.data[n]).APDataStorage}catch(e){}})),o.ChannelPot.sendToMainChannel({method:r.RemoteXMethods.syncStorage,params:{data:t}})};t.listenEvents=function(){var e=s.getBridge();e.on("pageResume",(function(){var e=self.getCurrentPages().filter((function(e){return e})),t=e[e.length-1].$viewId;o.ChannelPot.setActiveId(String(t)),o.ChannelPot.sendToMainChannel({method:r.RemoteXMethods.PageChanged})})),e.on("tinyRemoteDebugPanelButtonClick",(function(){a.SocketConn.close()})),s.checkIOS()?(e.on(i.ERiverDebugEvent.networkRequest,(function(e){var t=e.data;l(t)})),e.on(i.ERiverDebugEvent.networkResponse,(function(e){var t=e.data;d(t)})),e.on(i.ERiverDebugEvent.networkError,(function(e){var t=e.data;f(t)})),e.on(i.ERiverDebugEvent.storageChanged,(function(e){var t=e.data;g(t)}))):e.on(i.ERiverDebugEvent.debugConsole,(function(e){var t,n=e.data,o=n.type,r=n.content;try{t=JSON.parse(r)}catch(e){return}switch(o){case i.ERiverDebugEvent.networkRequest:l(t);break;case i.ERiverDebugEvent.networkResponse:d(t);break;case i.ERiverDebugEvent.networkError:f(t);break;case i.ERiverDebugEvent.storageChanged:g(t)}}))}},46:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e){e.networkRequest="tinyAppRemoteDebug_network_request",e.networkResponse="tinyAppRemoteDebug_network_response",e.networkError="tinyAppRemoteDebug_network_error",e.storageChanged="tinyAppRemoteDebug_storage",e.debugConsole="onTinyDebugConsole"}(t.ERiverDebugEvent||(t.ERiverDebugEvent={}))},47:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(11),r=n(1),s=function(e,t){return void 0===t?"©undefined":null===t?"©null":t===-1/0?"©- Infinity":t===1/0?"©Infinity":"number"==typeof t&&isNaN(t)?"©NaN":"function"==typeof t?"©function":t},a=Function,i=function(e){try{if(e.fromVConsoleToWorker){var t=e.requestId;if("exec"===e.method){try{new a("requestId","sendBack","var res = "+e.script+";console.log(res);")(t,(function(e){return r.callInternalAPI("tinyDebugConsole",{type:"msgFromWorkerToVConsole",content:o.stringify({requestId:t,returnValue:e},s)})}))}catch(e){console.error(e.name+":"+e.message)}}}}catch(e){}};t.registerPreview=function(){setTimeout((function(){self.document?self.document.addEventListener("push",(function(e){try{var t=e.data.param;i(JSON.parse(t.content||t.data.content))}catch(e){}})):self.addEventListener&&self.addEventListener("push",(function(e){try{var t=JSON.parse(JSON.parse(e.data.text()).param.data.content);i(t)}catch(e){}}))}),10),["log","info","error","debug","warn"].forEach((function(e){var t="o"+e;console[t]||(console[t]=console[e],console[e]=function(){for(var n,a=[],i=0;i<arguments.length;i++)a[i]=arguments[i];console[t].apply(console,a);try{n=o.stringify(a.map((function(e){return e instanceof Error?e.name+": "+e.message:e})),s)}catch(e){return void console.error(e.name+": "+e.message)}r.callInternalAPI("tinyDebugConsole",{content:n,type:"console_"+e})})}))}},5:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(11),r=n(4),s=n(1),a=n(0),i=function(){s.getBridge().call("showRemoteDebugPanel",{status:"connecting",text:"远程调试准备中",buttonTitle:"退出"})},c=function(){s.getBridge().call("showRemoteDebugPanel",{status:"connected",text:"远程调试已连接",buttonTitle:"退出"})},u=function(){s.getBridge().call("showRemoteDebugPanel",{status:"disconnected",text:"远程调试已断开",buttonTitle:"退出"})},l=function(){r.ChannelPot.sendToActiveChannel({method:a.RemoteXMethods.ExitApp})};t.SocketConn={messageQueue:[],socketTask:null,send:function(e){var t=this,n="string"==typeof e?e:JSON.stringify(e);n.length>5242880?s.debug("[bugme] socket send failed, size: ",n.length):this.socketTask?(this.messageQueue.length&&(this.messageQueue.forEach((function(e){t.socketTask.send({data:e})})),this.messageQueue=[]),this.socketTask.send({data:n})):this.messageQueue.push(n)},close:function(){this.socketTask?this.socketTask.close():l()},connect:function(e){var t=this,n=s.getBridge(),o=n.connectSocket({url:e,multiple:!0});o.onOpen((function(){t.socketTask=o,t.onopen()})),o.onMessage((function(e){t.onmessage(e)})),o.onClose((function(){t.onclose()})),o.onError((function(){t.socketTask||(u(),n.showToast({content:"本次真机调试已结束，请重新生成调试版本",duration:2e3,success:function(){l()}}))}))},open:function(){var e=this,t=s.getStartupParams().channelId;if(t){i();var n=s.getBridge(),o="wss://openchannel.alipay.com/host/"+t;if(s.checkIOS()){this.connect(o);var r=n.connectSocket;n.connectSocket=function(e){if(e&&e.multiple)return r(e);n.showToast({content:"iOS 真机调试暂不支持 connectSocket JSAPI",duration:1e3})},n.onSocketOpen=n.offSocketOpen=n.onSocketMessage=n.offSocketMessage=function(){}}else setTimeout((function(){e.connect(o)}),1200)}else s.debug("[bugme] missing channelId in startup params")},onopen:function(){var e=s.getBridge(),t=e.getSystemInfoSync();this.send({method:a.RemoteXMethods.Connect,params:{userAgent:s.getUserAgent(),sdkVersion:e.SDKVersion,alipayVersion:t.version,model:t.model,system:t.system}}),c()},onmessage:function(e){try{var t=JSON.parse(e.data.data),n=t.method,i=t.id,c=t.params;if(n===a.RemoteXMethods.Disconnect)this.close();else if(n===a.RemoteXMethods.EvaluteScript){if(c&&c.code)try{var u=s.executeScript(c.code);this.send({returnId:i,payload:o.stringify(u)})}catch(e){s.debug("[remoteX worker evaluteScript] ",e)}}else n===a.RemoteXMethods.Ping?this.send({method:a.RemoteXMethods.Pong,params:{returnId:i}}):r.ChannelPot.sendToActiveChannel(t)}catch(t){s.debug("RemoteX onSocketMessage error",t,e)}},onclose:function(){this.socketTask=null,this.messageQueue=[],u(),s.getBridge().call("alert",{title:"调试中断",button:"退出"},(function(){l()}))}}}});
const __BUGME_END__ = 1;
/*BUGME_END*/if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');
require('./importScripts$');

var AFAppX = self.AFAppX;
self.getCurrentPages = AFAppX.getCurrentPages;
self.getApp = AFAppX.getApp;
self.Page = AFAppX.Page;
self.App = AFAppX.App;
self.my = AFAppX.bridge || AFAppX.abridge;
self.abridge = self.my;
self.Component = AFAppX.WorkerComponent || function(){};
self.$global = AFAppX.$global;
self.requirePlugin = AFAppX.requirePlugin;


if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../util/table/table?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../util/table/column/column?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ddui/es/list/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../node_modules/mini-ddui/es/list/list-item/index?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/my-picker/my-picker?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/my-close/my-close?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/my-uploadFiles/my-uploadFiles?hash=bf65d8f0fcc39754499e376c2032b121121304cc');
require('../../components/my-checkbox-group/my-checkbox-group?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../page/start/index?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approve/approve?hash=253a9edbf9b44d07ab67b2e03c6673c5f9d58b63');
require('../../page/start/purchase/purchase?hash=d9e1d28e3a7a0002d1f248e5d6782649d2046d8d');
require('../../page/approveDetail/purchase/purchase?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../util/errorPage/errorPage?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/start/finishedPurchase/finishedPurchase?hash=d9e1d28e3a7a0002d1f248e5d6782649d2046d8d');
require('../../page/approveDetail/finishedPurchase/finishedPurchase?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approveDetail/paper/paper?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/start/picking/picking?hash=d9e1d28e3a7a0002d1f248e5d6782649d2046d8d');
require('../../page/start/intoStorage/intoStorage?hash=d9e1d28e3a7a0002d1f248e5d6782649d2046d8d');
require('../../page/approveDetail/intoStorage/intoStorage?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approveDetail/picking/picking?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approveDetail/meterieCode/meterieCode?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approveDetail/officePurchase/officePurchase?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/start/officesupplies/officesupplies?hash=1843e4342add8461cd5ea49fda83621d6d6284a9');
require('../../page/approveDetail/officeSupplies/officeSupplies?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approveDetail/order/order?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/createProject/createProject?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/changePaper/changePaper?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/createProject/createProject?hash=54731a45c39dc50866f1d3121b4269aa4fa64f21');
require('../../page/start/maintain/maintain?hash=d9e1d28e3a7a0002d1f248e5d6782649d2046d8d');
require('../../page/start/borrowThing/borrowThing?hash=1843e4342add8461cd5ea49fda83621d6d6284a9');
require('../../page/approveDetail/borrowThing/borrowThing?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/maintain/maintain?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/productionOrder/productionOrder?hash=d9e1d28e3a7a0002d1f248e5d6782649d2046d8d');
require('../../page/start/gift/gift?hash=1843e4342add8461cd5ea49fda83621d6d6284a9');
require('../../page/approveDetail/gift/gift?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/goOut/goOut?hash=d9e1d28e3a7a0002d1f248e5d6782649d2046d8d');
require('../../page/start/crossHelp/crossHelp?hash=1843e4342add8461cd5ea49fda83621d6d6284a9');
require('../../page/approveDetail/crossHelp/crossHelp?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/letGoodsGo/letGoodsGo?hash=1843e4342add8461cd5ea49fda83621d6d6284a9');
require('../../page/approveDetail/letGoodsGo/letGoodsGo?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/usePublicCar/usePublicCar?hash=dbc6514c480ea86c74b24ac6112914ed031eccff');
require('../../page/approveDetail/usePublicCar/usePublicCar?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/useCar/useCar?hash=dbc6514c480ea86c74b24ac6112914ed031eccff');
require('../../page/approveDetail/useCar/useCar?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/sendRead/sendRead?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/carManager/carManager?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/goOut/goOut?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/productionOrder/productionOrder?hash=d9e1d28e3a7a0002d1f248e5d6782649d2046d8d');
require('../../page/start/productionPreInvestment/productionPreInvestment?hash=d9e1d28e3a7a0002d1f248e5d6782649d2046d8d');
require('../../page/start/preInvestmentReport/preInvestmentReport?hash=d9e1d28e3a7a0002d1f248e5d6782649d2046d8d');
require('../../page/start/managementConsole/managementConsole?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/managementConsole/flowDetail/flowDetail?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/managementConsole/flowDetail/setNodeInfo/setNodeInfo?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/managementConsole/addFlow/setNodeInfo/setNodeInfo?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/managementConsole/addShortcut/addShortcut?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/managementConsole/sortTest/sortTest?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/managementConsole/addFlow/addFlow?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../util/people/people?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/role/role?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/intellectualProperty/intellectualProperty?hash=1843e4342add8461cd5ea49fda83621d6d6284a9');
require('../../page/approveDetail/intellectualProperty/intellectualProperty?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/techonologySupply/techonologySupply?hash=dbc6514c480ea86c74b24ac6112914ed031eccff');
require('../../page/approveDetail/techonologySupply/techonologySupply?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/projectClosure/projectClosure?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/processManagement/processManagement?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/productionOrder/productionOrder?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/productionPreInvestment/productionPreInvestment?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/preInvestmentReport/preInvestmentReport?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/orderManager/orderManager?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/borrowBook/borrowBook?hash=1843e4342add8461cd5ea49fda83621d6d6284a9');
require('../../page/approveDetail/borrowBook/borrowBook?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}