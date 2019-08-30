import pub from '/util/public';
let good = {}
Page({
  ...pub.func,
  ...pub.func.start,
  data: {
    ...pub.data,
    hidden: true,
    tableOperate: '选择',
    purchaseList: [],
    tableParam2: {
      size: 100,
      now: 1,
      total: 0
    },
    tableOperate2: '删除',
    tableOperate3: '编辑',
    ifedit:false,
    good: {},
    goods: [],
    addPeopleNodes: [2], //额外添加审批人节点数组
    totalPrice: 0,
    tableItems: [
      {
        prop: 'fNumber',
        label: '物料编码',
        width: 200
      },
      {
        prop: 'fQty',
        label: '实收数量',
        width: 200
      },
      {
        prop: 'fName',
        label: '物料名称',
        width: 300
      },
      {
        prop: 'fModel',
        label: '规格型号',
        width: 300
      },
       {
        prop: 'unitName',
        label: '单位',
        width: 100
      },
      // {
      //   prop: 'fPrice',
      //   label: '单价',
      //   width: 200
      // },
      // {
      //   prop: 'fAmount',
      //   label: '金额',
      //   width: 200
      //},
      {
        prop: 'fFullName',
        label: '供应商',
        width: 300
      }
    ],
    tableItems2: [
      {
        prop: 'fNumber',
        label: '物料编码',
        width: 200
      },
      {
        prop: 'fQty',
        label: '实收数量',
        width: 200
      },
      {
        prop: 'fName',
        label: '物料名称',
        width: 300
      },
      {
        prop: 'fModel',
        label: '规格型号',
        width: 300
      },
       {
        prop: 'unitName',
        label: '单位',
        width: 100
      },
      // {
      //   prop: 'fPrice',
      //   label: '单价',
      //   width: 200
      // },
      // {
      //   prop: 'fAmount',
      //   label: '金额',
      //   width: 200
      // },
      {
        prop: 'fFullName',
        label: '供应商',
        width: 300
      }
    ],
    //data:[]
  },
  //表单操作相关
  search(e){
    dd.showLoading({
        content: '获取中...'
      });
    var value = e.detail.value
    console.log(value.keyWord) 
    if (!value || !value.keyWord) return
    var that = this
    let url = this.data.jinDomarn + 'Godown/ReadGodownInfoSingle' + that.formatQueryStr({keyWord:value.keyWord})
    dd.httpRequest({
      url: url,
      method: 'GET',
      success: function(res) {
        dd.hideLoading()
        console.log(url)
        console.log(res.data.data)
        if(res.data.data.length == 0){
          dd.showToast({content: '暂无数据'});
        }
        that.setData({
          'tableParam.total': res.data.data.length
        })
        that.data.data =  res.data.data
        that.getData()
      },
      fail: function(res){
        dd.alert({content:JSON.stringify(res)})
      }
    });
  },
  searchByNo(e){
    dd.showLoading({
        content: '获取中...'
      });
    var value = e.detail.value
    console.log(value.no) 
    if (!value || !value.no) return
    var that = this
    let url = this.data.jinDomarn + 'Godown/GetGodownInfoByFBillNo' + that.formatQueryStr({FBillNo:value.no})
    dd.httpRequest({
      url: url,
      method: 'GET',
      success: function(res) {
        dd.hideLoading()
        console.log(url)
        console.log(res.data.data)
        if(res.data.data.length == 0){
          dd.showToast({content: '暂无数据'});
        }
        that.setData({
          'tableParam.total': res.data.data.length
        })
        that.data.data =  res.data.data
        that.getData()
      },
      fail: function(res){
        dd.alert({content:JSON.stringify(res)})
      }
    });
  },
  searchAndAdd(e){
    dd.showLoading({
        content: '获取中...'
      });
    var value = e.detail.value
    console.log(value.keyWord) 
    if (!value || !value.keyWord) return
    var that = this
    let url = this.data.jinDomarn + 'Godown/ReadGodownInfo' + that.formatQueryStr({UnitName:value.keyWord})
    dd.httpRequest({
      url: url,
      method: 'GET',
      success: function(res) {
        dd.hideLoading()
        console.log(url)
        console.log(res.data.data)
        if(res.data.data.length == 0){
          dd.showToast({content: '暂无数据'});
        }
        let addArr = []
        let length = that.data.purchaseList.length
        for(let d of res.data.data){
          let ifBreak = false
          for(let p of that.data.purchaseList){
            if(d.fNumber == p.fNumber) ifBreak = true
          }
          if(ifBreak) break
          that.data.goods.push(d)
          addArr.push(d)
        }
        for(let i = 0; i < addArr.length ;i ++){
          that.setData({
            [`purchaseList[${length + i}]`]: addArr[i]
          })
        }
      },
      fail: function(res){
        dd.alert({content:JSON.stringify(res)})
      }
    });
  },
  submit(e) {
    var arr = []
    for(let p of this.data.purchaseList){
      arr.push(p.fFullName)
    }
    var set = new Set(arr)
    if(this.data.purchaseList.length == 0){
      dd.alert({content:'没有选择物料'})
      return
    }
    var that = this
    var value = e.detail.value;

    var param = {
        Title: value.title,
        Remark: value.remark,
        ProjectName: that.data.projectList[that.data.projectIndex].ProjectName,
        ProjectId: that.data.projectList[that.data.projectIndex].ProjectId
    }
    let callBack = function (taskId) {
        console.log("提交审批ok!")
        that.bindAll(taskId)
    }
    console.log(param)
    this.approvalSubmit(param, callBack)
  },
  bindAll(taskId) {
      var that = this
      var paramArr = []
      for (let p of that.data.purchaseList) {
          p.TaskId = taskId
          paramArr.push(p)
      }
      that._postData("Godown/Save", function(res) {
          that.doneSubmit()
      },paramArr)
  },
  // bindPickerChange(e){
  //   this.data.nodeList[2].AddPeople = 
  //       [{
  //           name: this.data.projectList[e.detail.value].ResponsibleMan,
  //           userId: this.data.projectList[e.detail.value].ResponsibleManId
  //       }]
  //   this.setData({
  //       projectIndex: e.detail.value,
  //       nodeList: this.data.nodeList
  //   })
  // },
  //弹窗表单相关
  //显示弹窗表单
  chooseItem(e){
    if(!e) return
    console.log(e)
    good = e.target.targetDataset.row
    if(!good) return
    
    this.setData({
      hidden: !this.data.hidden,
      ifedit: false
    })
    this.createMaskShowAnim();
    this.createContentShowAnim();
  },
  deleteItem(e){
    if(!e) return
    console.log(e)
    let index = e.target.targetDataset.index
    if((!index) && index != 0)  return
    //默认方法，删除选项
    if(!e.target.targetDataset.opt2){
      console.log(this.data.purchaseList)
      this.data.purchaseList.splice(index, 1)
      this.setData({
        purchaseList:this.data.purchaseList
      })
      console.log(this.data.purchaseList)
    }
    //第二方法，编辑选项
    else{
      good = e.target.targetDataset.row
      if(!good) return
      this.setData({
        hidden: !this.data.hidden,
        ifedit: true
      })
      this.createMaskShowAnim();
      this.createContentShowAnim();
    }
    
  },
  //提交弹窗表单
  addGood(e){
    let value = e.detail.value
    console.log(value) 
    if (!value || !value.fQty) {
      dd.alert({
        content: `表单填写不完整`,
      });
      return
    }
    if(this.data.ifedit){
      for(let i = 0 ;i < this.data.purchaseList.length; i++){
        //数量判断
        for(let g of this.data.goods){
          if(this.data.purchaseList[i].fNumber == g.fNumber && value.fQty > g.fQty){
            dd.alert({content:'大于可用数量'})
          return
          }
        }

        if(this.data.purchaseList[i].fNumber == good.fNumber){
          good.fQty = (value.fQty ? value.fQty + '' : '1')
          this.setData({
            [`purchaseList[${i}]`]: good
          })
        }
        
      }
    }else{
      for (let p of this.data.purchaseList) {
        if (p.fNumber == good.fNumber){
          dd.alert({content:'重复提交'})
          return
        } 
      }
      //数量判断
      if(value.fQty>good.fQty){
        dd.alert({content:'大于可用数量'})
        return
      }

      let param = {
        fNumber: good.fNumber,
        fName: good.fName,
        fModel: good.fModel,
        unitName: good.unitName,
        fQty: value.fQty ? value.fQty + '' : '1',
        fPrice: good.fPrice ? good.fPrice + '' : '0',
        fAmount: good.fAmount ? good.fAmount + '' : '0',
        fFullName: good.fFullName
      }
      let length = this.data.purchaseList.length
      let setStr = 'purchaseList[' + length + ']'
      this.setData({
        [`purchaseList[${length}]`]: param
      })
      //数量判断
      param.fQty = good.fQty
      this.data.goods.push(param)
    }
    this.onModalCloseTap()
  },
  //隐藏弹窗表单
  onModalCloseTap() {
    this.createMaskHideAnim();
    this.createContentHideAnim();
    setTimeout(() => {
      this.setData({
        hidden: true,
      });
    }, 210);
  },
  //显示临时保存数据
  saveTempData() {
      localStorage.setItem('purchase', JSON.stringify(this.data.purchaseList))
      dd.alert({content:'保存成功'})
  },
  loadTempData() {
      var data = JSON.parse(localStorage.getItem('purchase'))
      if (data && data.length && data.length > 0) {
        this.setData({purchaseList: data})
        localStorage.removeItem('purchase')
      }
  },
  onShow() {
    //this.loadTempData()
  },

  
});
