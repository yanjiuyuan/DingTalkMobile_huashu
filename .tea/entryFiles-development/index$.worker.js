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
require('../../components/my-picker/my-picker?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/my-close/my-close?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../components/my-uploadFiles/my-uploadFiles?hash=bf65d8f0fcc39754499e376c2032b121121304cc');
require('../../components/my-checkbox-group/my-checkbox-group?hash=05d2a9730dd6009bf9446182f9c985f40f8c0f43');
require('../../page/test/test?hash=32d7d2807ed4e666ef03b4b3fe8c38ecf2e34e68');
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
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}