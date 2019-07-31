import pub from '/util/public';
let good = {}
let items =[
      {
        prop: 'Name',
        label: '物料名称',
        width: 300
      },
      {
        prop: 'Standard',
        label: '规格型号',
        width: 300
      },
      {
        prop: 'BigCode',
        label: '物料大类编码',
        width: 300
      },
      {
        prop: 'SmallCode',
        label: '物料小类编码',
        width: 300
      },

      {
        prop: 'Unit',
        label: '单位',
        width: 100
      },
      {
        prop: 'SurfaceTreatment',
        label: '表面处理',
        width: 300
      },
      {
        prop: 'PerformanceLevel',
        label: '性能等级',
        width: 200
      },
      {
        prop: 'StandardNumber',
        label: '标准号',
        width: 200
      },
      {
        prop: 'Features',
        label: '典型特征',
        width: 300
      },
       {
        prop: 'purpose',
        label: '用途',
        width: 300
      },

      {
        prop: 'CodeNo',
        label: '物料编码',
        width: 200
      },
      {
        prop: 'FNote',
        label: '预计价格',
        width: 200
      },
      
    ] 
Page({
  ...pub.func,
  ...pub.func.dowith,
  data: {
    ...pub.data,
    hidden: true,
    hiddenReturn: true,
    codeTypes: [{ label: '1', name: "零部件" ,checked: true}, {label: '2', name: "办公用品"}],
    tableOptions:[],
    tableOperate: '编辑',
    tableItems: items,
    tableParam: {
      size: 885,
      now: 1,
      total: 0
    }
  },
  submit(e) {
    var that = this
    var value = e.detail.value
    var param = {
        Title: value.title,
        Remark: value.remark
    }
    console.log(value)
    console.log(this.data.tableData)
    if(this.data.nodeid == '2'){
      for(let d of this.data.tableData){
        if(!d.FNote || !d.CodeNo) {
          dd.alert({
            content: `表单填写不完整`,
          });
          return
        }
      }
      //第一层，修改table
      this.requestData('post','ItemCodeAdd/TableModify',(res)=> {
        let url2 = 'ItemCodeAdd/InsertPurcahse'
        if (this.value.codeType == '2') url2 = 'ItemCodeAdd/InsertOffice'
        let paramArr = []
        for (let t of this.data.tableData) {
            paramArr.push({
                "FNumber": t.CodeNo,
                "FName": t.Name,
                "FModel": t.Standard,
                "FNote": t.FNote
            })
        }
        console.error(paramArr)
        //第二层，提交到金蝶
        this.requestData('post',url2,(res)=> {
          //第三层，提交审批
          this.aggreSubmit(param)
        },paramArr)


      },this.data.tableData)

    }
    this.aggreSubmit(param)
  },
  edit(e){
    var value = e.detail.value
    if (!value || !value.CodeNo) {
      dd.alert({
        content: `表单填写不完整`,
      });
      return
    }
    var index = this.data.chooseIndex
    let param = this.data.tableData[index]
    param.CodeNo = value.CodeNo
    param.FNote = value.FNote
    this.setData({
      [`tableData[${index}]`]: param
    })
    console.log(param)
    this.onModalCloseTap()
  },
  print(){
    this._postData('PurchaseNew/PrintAndSend',
      function(res){
        dd.alert({content:'获取成功'})
      },
      {
        UserId: this.data.DingData.userid,
        TaskId: this.data.taskid
      }
    )
  },
  output(){
    this._getData('api/PurchaseManage' + this.formatQueryStr({UserId:this.data.DingData.userid,TaskId: this.data.taskid}),
      function(res){
        dd.alert({content:'获取成功'})
      }
    )
  },
});
