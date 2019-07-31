import pub from '/util/public';
Page({
  ...pub.func,
  ...pub.func.dowith,
  data: {
    ...pub.data,
    IsReview:true,
    copyMans: [],
    table:{},
  },
  submit(e) {
    var value = e.detail.value
    var param = {
        Remark: value.remark
    }
    this.data.table.IsReview = this.data.IsReview
    this.data.table.ProjectId = value.ProjectId
    if(this.data.nodeid == 3 || this.data.nodeid == 1){
      if (!this.data.table.ProjectId) {
        console.log(this.data.table)
        dd.alert({content:"项目编号不能为空"})
        return
      }
      //if(this.data.nodeid == 1) this.data.nodeList[5].AddPeople = this.data.copyMans
      console.log(this.data.nodeList)
      this.setData({disablePage:true})
      this._postData("CreateProject/Modify",
        (res) => {
          this.requestData("POST","Project/AddProject?IsPower=true"  ,(res) => {
            this.aggreSubmit(param)
         }, this.data.table)

        },this.data.table
      )
    }else{
      this.aggreSubmit(param)
    }
  },
  print(){
    var that = this
    this._postData('CreateProject/GetPrintPDF',
      (res) => {
         dd.alert({content:"获取成功，请在钉钉PC端查收"})
      },
      {
        UserId: that.data.DingData.userid,
        TaskId: that.data.taskid,
        IsPublic: true
      }
    )
  },
  radioChange: function(e) {
    this.data.IsReview = e.detail.value
  },
  onReady(){
     this._getData("CreateProject/Read" + this.formatQueryStr({TaskId:this.data.taskid}),
      (res) => {
        this.setData({
          table: res
        })
        // let roleName = ''
        // if (res.CompanyName == '泉州华中科技大学智能制造研究院') {
        //     roleName = '研究院项目抄送人员'
        // } else { roleName = '华数项目抄送人员' }
        // if (this.data.nodeid == 1)
        //  this.requestData("GET","Role/GetRoleInfo"  ,(res) => {
        //    this.data.copyMans = res.data           
        //  }, {RoleName:'研究院项目抄送人员'})
      }
    )
  },
});
