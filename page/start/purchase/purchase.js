import pub from '/util/public';
Page({
  ...pub.func,
  ...pub.func.start,
  data: {
    ...pub.data,
    hidden: true,
    tableOperate: '选择',
    purchaseList: [],
    options:[],
    tableParam2: {
      size: 100,
      now: 1,
      total: 0
    },
    SendPosition: [{ name: "研究院" ,checked: true}, { name: "基地"}],
    tableOperate2: '删除',
    good: {},
    totalPrice: 0,
    tableItems: [
      {
        prop: 'FNumber',
        label: '物料编码',
        width: 200
      },
      {
        prop: 'FName',
        label: '物料名称',
        width: 300
      },
      {
        prop: 'FModel',
        label: '规格型号',
        width: 300
      },
      {
        prop: 'FNote',
        label: '预计单价',
        width: 100
      }
    ],
    tableItems2: [
      {
        prop: 'CodeNo',
        label: '物料编码',
        width: 200
      },
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
        prop: 'Unit',
        label: '单位',
        width: 100
      },
      {
        prop: 'Price',
        label: '单价',
        width: 100
      },
      {
        prop: 'Count',
        label: '数量',
        width: 100
      },
      {
        prop: 'Purpose',
        label: '用途',
        width: 300
      },
      {
        prop: 'UrgentDate',
        label: '需用日期',
        width: 200
      },
      {
        prop: 'SendPosition',
        label: '送货地点',
        width: 200
      },
      {
        prop: 'Mark',
        label: '备注',
        width: 300
      }
    ],
    //data:[]
  },
  //表单操作相关
  search(e){
    var value = e.detail.value
    console.log(value) 
    if (!value || !value.keyWord) return
    var that = this
    this._getData('PurchaseNew/GetICItem' + this.formatQueryStr({Key:value.keyWord}),
      (res)=>{
        that.setData({
        'tableParam.total': res.length
      })
      that.data.data =  res
      that.getData()
      }
    )
  },
  submit(e) {
    var value = e.detail.value
    var param = {
        Title: value.title,
        Remark: value.remark,
        ProjectName: this.data.projectList[this.data.projectIndex].ProjectName,
        ProjectId: this.data.projectList[this.data.projectIndex].ProjectId
    }

    this.approvalSubmit(param, (taskId)=>{
      this.bindAll(taskId)
    })
  },
  bindAll(taskId) {
      var that = this
      var paramArr = []
      for (let p of that.data.purchaseList) {
          p.TaskId = taskId
          paramArr.push(p)
      }
      this._postData('PurchaseNew/SavePurchaseTable',
        (res)=>{
          that.doneSubmit()
        },paramArr
      )
  },

  //提交弹窗表单
  addGood(e){
    var value = e.detail.value
    let good = this.data.tableData[this.data.chooseIndex]
    console.log(value) 
    for (let p of this.data.purchaseList) {
        if (p.CodeNo == good.FNumber) return
    }
    if (!value || !value.Unit || !value.Count|| !value.UrgentDate|| !value.Purpose) {
      dd.alert({
        content: `表单填写不完整`,
      });
      return
    }
    let param = {
        CodeNo: good.FNumber,
        Name: good.FName,
        Standard: good.FModel,
        SendPosition: value.SendPosition,
        Unit: value.Unit,
        Price: value.Price ? value.Price + '' : '0',
        Count: value.Count,
        Purpose: value.Purpose,
        UrgentDate: value.UrgentDate,
        Mark: value.Mark
    }
    let length = this.data.purchaseList.length
    let setStr = 'purchaseList[' + length + ']'
    this.setData({
      [`purchaseList[${length}]`]: param,
      totalPrice: (this.data.totalPrice + param.Price * param.Count) + ''
    })
    console.log(param.Purpose)
    this.onModalCloseTap()
  },
  //显示临时保存数据
  saveTempData() {
      localStorage.setItem('purchase', JSON.stringify(this.data.purchaseList))
      dd.alert({content:'保存成功'})
  },
  onShow() {
  },

  
});
