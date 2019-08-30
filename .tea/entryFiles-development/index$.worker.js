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
        


function success() {
require('../../app');
require('../../util/table/table');
require('../../util/table/column/column');
require('../../node_modules/mini-ddui/es/list/index');
require('../../node_modules/mini-ddui/es/list/list-item/index');
require('../../page/start/index');
require('../../page/approve/approve');
require('../../page/start/purchase/purchase');
require('../../page/approveDetail/purchase/purchase');
require('../../util/errorPage/errorPage');
require('../../page/start/finishedPurchase/finishedPurchase');
require('../../page/approveDetail/finishedPurchase/finishedPurchase');
require('../../page/approveDetail/paper/paper');
require('../../page/start/picking/picking');
require('../../page/start/intoStorage/intoStorage');
require('../../page/approveDetail/intoStorage/intoStorage');
require('../../page/approveDetail/picking/picking');
require('../../page/approveDetail/meterieCode/meterieCode');
require('../../page/approveDetail/officePurchase/officePurchase');
require('../../page/start/officesupplies/officesupplies');
require('../../page/approveDetail/officeSupplies/officeSupplies');
require('../../page/approveDetail/order/order');
require('../../page/approveDetail/createProject/createProject');
require('../../page/approveDetail/changePaper/changePaper');
require('../../page/start/createProject/createProject');
require('../../page/start/maintain/maintain');
require('../../page/start/borrowThing/borrowThing');
require('../../page/approveDetail/borrowThing/borrowThing');
require('../../page/approveDetail/maintain/maintain');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}