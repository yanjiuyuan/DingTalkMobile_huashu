import pub from '/util/public';
Page({
  ...pub.func,
  data: {
    ...pub.data,
    tableParam: {
      size: 15,
      now: 1,
      total: 0
    },
    tableItems: [
      {
        prop: 'ApplyMan',
        label: '申请人',
        width: 200
      },
      {
        prop: 'ApplyManId',
        label: '申请人id',
        width: 300
      },
      {
        prop: 'ApplyTime',
        label: '调用时间',
        width: 300
      },
      {
        prop: 'Url',
        label: '接口路径',
        width: 400
      },
      {
        prop: 'ErrorCode',
        label: '错误码',
        width: 100
      },
      {
        prop: 'ErrorMsg',
        label: '错误信息',
        width: 400
      },
      {
        prop: 'Para',
        label: '参数',
        width: 400
      },
      {
        prop: 'GetOrPost',
        label: 'Method类型',
        width: 200
      }
    ],
  },
  onLoad(){
    let that = this
    let url = "ErrorLog/Read"
    this.requestNofailData('POST', url,
      function(res) {
        that.setData({
          data: res.data.data,
          'tableParam.total': res.data.data.length
        })
        that.getData()
    })
  }
 
});
