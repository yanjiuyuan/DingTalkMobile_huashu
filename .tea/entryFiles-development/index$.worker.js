if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');


  var AFAppX = self.AFAppX.getAppContext
    ? self.AFAppX.getAppContext().AFAppX
    : self.AFAppX;
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
require('../../page/start/index?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approve/approve?hash=253a9edbf9b44d07ab67b2e03c6673c5f9d58b63');
require('../../page/start/purchase/purchase?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approveDetail/purchase/purchase?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../util/errorPage/errorPage?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/start/finishedPurchase/finishedPurchase?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approveDetail/finishedPurchase/finishedPurchase?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approveDetail/paper/paper?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/start/picking/picking?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/start/intoStorage/intoStorage?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approveDetail/intoStorage/intoStorage?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approveDetail/picking/picking?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approveDetail/meterieCode/meterieCode?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/approveDetail/officePurchase/officePurchase?hash=0586a24eef8e7e701db2de7bdb9c468150d04c51');
require('../../page/start/officesupplies/officesupplies?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/officeSupplies/officeSupplies?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/order/order?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/createProject/createProject?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/changePaper/changePaper?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/createProject/createProject?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/maintain/maintain?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/start/borrowThing/borrowThing?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/borrowThing/borrowThing?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
require('../../page/approveDetail/maintain/maintain?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}