import pub from '/util/public';
Page({
  ...pub.func,
  ...pub.func.dowith,
  data: {
    ...pub.data,
    hidden: true,
    dataList: [],//循环多个表格需要
    totalPrice: 0,
    tableParam: {
      size: 5000,
      now: 1,
      total: 0
    },
    tableItems: [
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
        label: '预计单价',
        width: 100
      },
      {
        prop: 'Count',
        label: '数量',
        width: 100
      },
       {
        prop: 'totalPrice',
        label: '总价',
        width: 200
      },
      {
        prop: 'Purpose',
        label: '用途',
        width: 300
      }
    ],
  },
  submit(e) {
    var that = this
    var value = e.detail.value
    var param = {
        Title: value.title,
        Remark: value.remark
    }
    this.aggreSubmit(param)
  },
  //打印流程表单
  print(){
    this._postData('OfficeSuppliesPurchase/PrintPDF',
      function(res){
        dd.alert({content:'获取成功'})
      },
      {
        UserId: this.data.DingData.userid,
        TaskId: this.data.taskid
      }
    )
  },
  getBomInfo(){
    //this._getData('OfficeSuppliesPurchase/ReadTable?TaskId='+this.data.taskid,(res) => {
    this.requestData('GET','OfficeSuppliesPurchase/ReadTable?TaskId='+this.data.taskid,(res) => {
      var deptList = []
      var deptStr = ''
      res = JSON.parse(res.data)
      for (let d of res) {
          if (d.Dept && deptStr.indexOf(d.Dept) < 0) {
              deptStr = deptStr + d.Dept + ','
          }
      }
      deptStr = deptStr.substring(0, deptStr.length - 1)
      deptList = deptStr.split(',')
      for (let d of deptList) {
          this.data.dataList.push({
              name: d,
              value: [],
              tmpTotalPrice: 0
          })
      }
      for (let d of res) {
          for (let l of this.data.dataList) {
              if (d.Dept == l.name) {
                  d['totalPrice'] = parseInt(d.Price * d.Count)
                  l.value.push(d)
                  l.tmpTotalPrice += parseInt(d.Price * d.Count)
                  this.data.totalPrice += parseInt(d.Price * d.Count)
                  break
              }
          }
      }
      this.setData({
        dataList:this.data.dataList,
        totalPrice:this.data.totalPrice
      })
    })
  }
});
