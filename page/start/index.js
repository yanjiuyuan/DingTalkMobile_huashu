import pub from '/util/public';


var globalData = getApp().globalData
Page({
  ...pub.func,
  onLoad(){
    this.getMenu();
    this.checkLogin(function(){});
    this.getUserInfo();
  },
  data: {
    ...pub.data,
    pageName: 'component/index',
    pageInfo: {
      pageId: 0,
    },
    curIndex: 0,
    userIndex: -1,
    userList:[],
    sort: [],
	sortItems:[],


  },
  //选人控件方法
  choosePeople(e){

    // this.upLoadFile()
    // return
    console.log('start choose people')
    var that = this
    dd.complexChoose({
      ...that.chooseParam,
      multiple: false,
      success: function(res) {
        console.log(res)
        if(res.users.length > 0){
          let name = res.users[0].name
          let userId = res.users[0].userId
          var app = getApp()
          app.userInfo.name = name
          app.userInfo.userid = userId
          that.setData({ DingData:{
            nickName:name,
            userid:userId
          } })
        }
      },
      fail: function(err) {

      }
    })
  },

  upLoadFile(){
    dd.uploadAttachmentToDingTalk({
        image:{multiple:true,compress:false,max:9,spaceId: "12345"},
        space:{spaceId:"12345",isCopy:1 , max:9},
        file: {spaceId:"12345",max:1},
        types:["photo","camera","file","space"],//PC端仅支持["photo","file","space"]
        success: (res) => {
          console.log(res)
          dd.alert({
              content:JSON.stringify(res)
          })
        },
        fail: (err) =>{
            dd.alert({
                content:JSON.stringify(err)
            })
        }
    })
  },
  //选人操作
  selectUser(value) {
    console.log(value)
    console.log(value.detail.value)
    let userIndex = value.detail.value
    let name = this.data.userList[userIndex].NodePeople
    let userId = this.data.userList[userIndex].PeopleId
    var app = getApp()
    app.userInfo.name = name
    app.userInfo.userid = userId
    this.setData({ DingData:{
        nickName:name,
        userid:userId
      },
      userIndex:value.detail.value
    })
  },
  getUserInfo() {
      var that = this
      this._getData('FlowInfoNew/GetUserInfo',function(data){
        that.setData({
          userList: data
        })
      })
  },
  getMenu(){
    var that = this
    this._getData('FlowInfoNew/LoadFlowSort?id=123', function(data) {
      let sorts = data;
      that.setData({sort:data});
	  let sortItem=[];
      that._getData('FlowInfoNew/LoadFlowInfo?id=123',function(data){
        var temp = that.mergeObjectArr(data,that.data.menu,'flowId')
        for(let s of sorts){
			let item={
				text:"收起",
				class:"dropdown-content-show"
			}
			sortItem.push(item);
          s['show'] = false
          for(let t of temp){
            if(t.url && t.sortId == s.SORT_ID){
              s['show'] = true;
              break;
            }
          }
        }
        that.setData({
          sort:sorts,
          menu: temp,
		  sortItems: sortItem
        })
      })
    })
  },






  //点击展示
  showOrClose(event){

	  console.log(this.data.DingData);

		console.log(this.data.menu);

		let index=event.target.dataset.index;
		if(this.data.sortItems[index].text == "展开"){
		  let item=this.data.sortItems;
		  item[index]={
			  text:"收起",
			  class:"dropdown-content-show"
		  }
		  this.setData({
			  sortItems:item
	  		})
	  }
	else  if(this.data.sortItems[index].text === "收起"){
		  let item=this.data.sortItems;
		  item[index]={
			  text:"展开",
			  class:"dropdown-content"
		  }
		  this.setData({
			  sortItems:item
	  		})
	  }
	
  }
 
  
});
