import pub from '/util/public';
Page({
  ...pub.func,
  ...pub.func.dowith,
  data: {
    ...pub.data,
    hidden: true,
    totalPrice: '0',
    tableItems: [
      {
        prop: 'Sorts',
        label: '类别',
        width: 100
      },
      {
        prop: 'DrawingNo',
        label: '代号',
        width: 300
      },
      {
        prop: 'Name',
        label: '名称',
        width: 300
      },
      {
        prop: 'Count',
        label: '数量',
        width: 100
      },
      {
        prop: 'MaterialScience',
        label: '材料',
        width: 200
      },
      {
        prop: 'Unit',
        label: '单位',
        width: 100
      },
      {
        prop: 'SingleWeight',
        label: '单重',
        width: 100
      },
      {
        prop: 'AllWeight',
        label: '总重',
        width: 100
      }
    ],

    pdfList:[],
    //data:[]
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
  downloadAllFile(){
    this._getData("NewsAndCases/GetAllPDF" + this.formatQueryStr({ applyManId: this.data.DingData.userid,taskId: this.data.taskid}),
    (res) => {
       dd.alert({content:'获取成功，请在钉钉工作通知中查收'})
    })
  },
  output(){
    var that = this
    this._getData('DrawingUploadNew/GetExcelReport'+ that.formatQueryStr({ApplyManId:that.data.DingData.userid,taskId:that.data.taskid}),
      function(res){
        dd.alert({content:'获取成功，请在钉钉工作通知中查收'})
      },
      {
      }
    )
  },

});
