const app = getApp();
import pub from '/util/public';
Page({
  ...pub.func,
  data: {
  ...pub.data,

  },
  onLoad(options) {
    let item = JSON.parse(options.item);
    console.log(item);
    this.setData({
      menu:app.globalData.menu,
      sort_one:item,
      title:item.SORT_NAME
    })
  },


  //添加
  add(e){
    // if(this.data.sort_one.flows == undefined){
    //     this.data.sort_one.flows = [];
    // }
    let item = e.target.dataset.item;
    item.sortName = this.data.title;
    item.SORT_ID = this.data.sort_one.Sort_ID;
    let obj = {
      applyManId:app.userInfo.userid,
      flowsList:[item]
    }
    console.log(obj);
    this._postData("FlowInfoNew/FlowAdd",(res)=>{
        console.log(res);
    },obj)
    // this.data.sort_one.flows.push(item);
    // console.log(this.data.sort_one.flows);

  }
});
