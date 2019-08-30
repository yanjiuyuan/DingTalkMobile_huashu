import lib from "/lib.js"
import template from "/util/template/template.js"

let logs = [];
var x = -54
var y = -46
var xTap = -90
var yTap = -90
let States = ['在研', '已完成', '终止']
let ProjectTypes = ['自研项目', '纵向项目', '横向项目','测试项目']
let DeptNames = ['', '智慧工厂事业部', '数控一代事业部', '机器人事业部', '行政部', '财务部', '制造试验部', '项目推进部']
let CompanyNames = ['泉州华中科技大学智能制造研究院', '泉州华数机器人有限公司']
let IntellectualPropertyTypes = ['发明','实用新型','外观','软件著作权']
let localStorage = ''
export default {
  data:{
    ...lib.data,
    ...template.data,
    version: 2.12,
    DingData:{
      nickName:'',
      departName:'',
      userid:''
    },
    hideMask: false,
    param: {},
    IsNeedChose:false,
    flowid:0,
    taskid:0,
    nodeid:0,
    state:'',
    id:0,
    projectIndex:0,
    nodeList:[],
    projectList:[],
    nodeInfo:{},
    FileUrl:'',
    FilePDFUrl:'',
    chooseIndex: 0,//点击 编辑 表单，获取所在行数

    States: States,  stateIndex:0,
    localStorage: localStorage,
    ProjectTypes: ProjectTypes,  projectIndex:-1,
    departIndex: 0,
    DeptNames: DeptNames,  deptIndex:0,  
    CompanyNames: CompanyNames,  companyIndex:0,
    IntellectualPropertyTypes:IntellectualPropertyTypes,  iptIndex:0,

    dateStr: '',
    startDateStr:'',
    endDateStr:'',

    menu:[
    {
      flowId: 1,
      title:'办公用品申请',
      url: 'officesupplies/officesupplies',
      position: '-413px -47px'
    },
    {
      flowId: 24,
      title:'零部件采购申请',
      url: 'purchase/purchase',
      position: '-414px -137px'
    },
    {
      flowId: 26,
      title:'成品采购',
      url: 'finishedPurchase/finishedPurchase',
      position: (x + 8 * xTap) + 'px ' + (y + 3 * yTap) + 'px'
    },
    {
        flowId: 27,
        title:'入库申请',
        url: 'intoStorage/intoStorage',
        position: (x + 3 * xTap) + 'px ' + (y + 4 * yTap) + 'px'
    },
    {
        flowId: 28,
        title:'领料申请',
        url: 'picking/picking',
        position: (x + 1 * xTap) + 'px ' + (y + 4 * yTap) + 'px'
    }, 
    // {
    //     flowId: 31,
    //     sortId: 2,
    //     title:'立项申请',
    //     url: 'createProject/createProject',
    //     position: (x + 8 * xTap -3) + 'px ' + (y + 1 * yTap - 3) + 'px'}
    // ,
    {
        flowId: 67,

        title:'借入申请',
        url: 'borrowThing/borrowThing',
        position: (x + 6 * xTap) + 'px ' + (y + 0 * yTap) + 'px'
    },{
        flowId: 68,

        title:'维修申请',
        url: 'maintain/maintain',
        position: (x + 4 * xTap) + 'px ' + (y + 4 * yTap) + 'px'
    }
  ],
    //审批页面变量
    index: 0,
    imageList: [],
    fileList: [],
    pdfList: [],
    dingList:[],//需要钉一下的人
    tableInfo:{},//审批表单信息
    isback: false,
    hidden: true,
    hiddenCrmk: true,
    remark:'',
    ReApprovalTempData:{},//重新发起的临时变量
    disablePage:false
  },

  func:{
    ...lib.func,
    ...template.func,
    
    start: {
      onLoad(param) {
        console.log('start page on load~~~~~~~~~~')
        console.log(param)
        var that = this
        let title = ''
        for(let m of this.data.menu){
          if(m.flowId == param.flowid){
            title = m.title
            break
          }
        }
        this.setData({
          flowid:param.flowid,
          'tableInfo.Title':title
        })
        let callBack = function(){
          that.getNodeList()
          that.getProjectList()
          that.getNodeInfo()
        }
        this.checkLogin(callBack)
      },
      //提交审批
      approvalSubmit(param = {}, callBack, param2 = {}) {
          if(!this.data.DingData.userid){
            dd.alert({
              content:'尚未登录'
            });
            return
          }
          var that = this
          that.disablePage = true
          var paramArr = []
          var applyObj = {
              "ApplyMan": that.data.DingData.nickName,
              "ApplyManId": that.data.DingData.userid,
              "Dept": that.data.DingData.departName,
              "NodeId": "0",
              "ApplyTime": that._getTime(),
              "IsEnable": "1",
              "FlowId": that.data.flowid + '',
              "IsSend": false,
              "State": "1",
          }
          for (let p in param) {
              applyObj[p] = param[p]
          }
          paramArr.push(applyObj)
          for (let node of that.data.nodeList) {
              if ((that.data.nodeInfo.IsNeedChose && that.data.nodeInfo.ChoseNodeId && (that.data.nodeInfo.ChoseNodeId.indexOf(node.NodeId) >= 0 || (that.data.addPeopleNodes && that.data.addPeopleNodes.indexOf(node.NodeId) >= 0))) || (node.NodeName.indexOf('申请人') >= 0 && node.NodeId>0)) {
                  if (node.AddPeople.length == 0) {
                      dd.alert({
                        content:'您尚未选择审批人'
                      })
                      that.data.disablePage = false
                      return
                  }
                  for (let a of node.AddPeople) {
                      let tmpParam = {
                          "ApplyMan": a.name,
                          "ApplyManId": a.userId,
                          "IsEnable": 1,
                          "FlowId": that.data.flowid + '',
                          "NodeId": node.NodeId + '',
                          "IsSend": node.IsSend,
                          "State": 0,
                          "OldFileUrl": null,
                          "IsBack": null
                      }
                      for (let p2 in param2) {
                            tmpParam[p2] = param2[p2]
                      }
                      paramArr.push(tmpParam)
                  }
              }
          }
          that._postData("FlowInfoNew/CreateTaskInfo", function(res) {
            let taskid = res
            console.log(taskid)
            callBack(taskid)
          },paramArr)
      },
      //加载重新发起数据
      loadReApproval(){
        let ReApprovalTempData = JSON.parse(localStorage.getItem("ReApprovalTempData"))
        if (!ReApprovalTempData || !ReApprovalTempData.valid) return
        console.log('重新发起的数据~~~~~~~~~~~')
        console.log(ReApprovalTempData)
        ReApprovalTempData.valid = false
        if(ReApprovalTempData.flowid == 8){
          this.setData({
            purchaseList: ReApprovalTempData.data
          })
        }else{
          this.setData({
            data: ReApprovalTempData.data
          })
        }
        this.setData({
          'tableInfo.Title': ReApprovalTempData.title,
          flowid:ReApprovalTempData.flowid,
          tableItems: ReApprovalTempData.tableItems
        })
        localStorage.setItem("ReApprovalTempData",JSON.stringify(ReApprovalTempData))
      },
      //搜索物料编码
      searchCode(e){
        var value = e.detail.value
        console.log(value) 
        if (!value || !value.keyWord) return
        var that = this
        that.requestData('GET', 'Purchase/GetICItem' + that.formatQueryStr({Key:value.keyWord}) , function(res) { 
          console.log(JSON.parse(res.data))
          that.setData({
            'tableParam.total': JSON.parse(res.data).length
          })
          that.data.data =  JSON.parse(res.data)
          that.getData()
        })
      },
      //弹窗表单相关
      //显示弹窗表单
      chooseItem(e){
        if(!e) return
        console.log(e)
        this.data.good = e.target.targetDataset.row
        if(!this.data.good) return
        this.setData({
          hidden: !this.data.hidden
        })
        this.createMaskShowAnim();
        this.createContentShowAnim();
      },
      deleteItem(e){
        if(!e) return
        console.log(e)
        let index = e.target.targetDataset.index
        if((!index) && index != 0)  return
        console.log(this.data.purchaseList)
        this.data.purchaseList.splice(index, 1)
        this.setData({
          purchaseList:this.data.purchaseList
        })
        console.log(this.data.purchaseList)
      },
    },
    dowith: {
      onLoad(param) {
        console.log('dowith page on load~~~~~~~~~~')
        console.log(param)
        var that = this
        this.setData({
          flowid:param.flowid,
          index:param.index,
          nodeid:param.nodeid,
          taskid:param.taskid,
          state:param.state
        })
        let callBack = function(){
          that.getFormData()
          that.getBomInfo(param.flowid,param.nodeid,param.index)
          that.getNodeList()
          that.getNodeInfo()
          that.getDingList(param.taskid)
        }
        this.checkLogin(callBack)
        
      },
      onReady() {
        
      },
      //审批-同意
      aggreSubmit(param, param2 = {}){
        if(!this.data.DingData.userid){
          dd.alert({
            content:'尚未登录'
          });
          return
        }
        this.setData({
          disablePage:true
        })
        var paramArr = []
        var that = this
        paramArr.push({
            "TaskId": that.data.taskid,
            "ApplyMan": that.data.DingData.nickName,
            "ApplyManId": that.data.DingData.userid,
            "Dept": that.data.DingData.departName,
            "NodeId": that.data.nodeid,
            "ApplyTime": that._getTime(),
            "IsEnable": "1",
            "FlowId": that.data.flowid,
            "IsSend": "false",
            "State": "1",
            "Id": that.data.tableInfo.Id,
            "Remark": that.data.remark
        })
        
        for (let p in param) {
            paramArr[0][p] = param[p]
        }
        for (let node of this.data.nodeList) {
            if ( (that.data.nodeInfo.IsNeedChose && that.data.nodeInfo.ChoseNodeId && that.data.nodeInfo.ChoseNodeId.indexOf(node.NodeId) >= 0) || (that.data.addPeopleNodes && that.data.addPeopleNodes.indexOf(node.NodeId) >= 0) || (node.NodeName == "采购员采购" && node.AddPeople.length > 0))  {
                if (node.AddPeople.length == 0) {
                    dd.alert({
                      content:'您尚未选择审批人'
                    });
                    this.setData({
                      disablePage:false
                    })
                    return
                }
                for (let a of node.AddPeople) {
                    let tmpParam = {
                        "ApplyMan": a.name,
                        "ApplyManId": a.userId,
                        "TaskId": that.data.taskid,
                        "ApplyTime": null,
                        "IsEnable": 1,
                        "FlowId": that.data.flowid,
                        "NodeId": node.NodeId,
                        "Remark": null,
                        "IsSend": node.IsSend,
                        "State": 0,
                        "ImageUrl": null,
                        "FileUrl": null,
                        "IsPost": false,
                        "OldImageUrl": null,
                        "OldFileUrl": null,
                        "IsBack": null
                    }
                    for (let p2 in param2) {
                        tmpParam[p2] = param2[p2]
                    }
                    paramArr.push(tmpParam)
                }
            }
        }
        that._postData("FlowInfoNew/SubmitTaskInfo", function(res) {
            dd.alert({
              content:'审批成功',
              success: () => {
                dd.switchTab({
                  url: '/page/approve/approve'
                  //url: '/page/start/index'
                })
              }
            });
          },paramArr)
      },

      //退回审批
      returnSubmit(e) {
        this.setData({
          disablePage:true
        })
        var that = this
        var param = {
            "TaskId": that.data.taskid,
            "ApplyMan": that.data.DingData.nickName,
            "ApplyManId": that.data.DingData.userid,
            "Dept": that.data.DingData.departName,
            "NodeId": that.data.nodeid,
            "ApplyTime": that._getTime(),
            "IsEnable": "1",
            "FlowId": that.data.flowid,
            "IsSend": "false",
            "State": "1",
            "BackNodeId": that.data.nodeInfo.BackNodeId,
            "Id": that.data.tableInfo.Id
        }
        if(e && e.detail && e.detail.value){
          param["Remark"] = e.detail.value.remark
        }else{
          param["NodeId"] = 0
        }
        that._postData("FlowInfoNew/FlowBack", function(res) {
            dd.alert({
              content:'退回成功',
              success: () => {
                dd.switchTab({
                  url: '/page/approve/approve'
                })
              }
            });
          },param)
      },

      //重新发起
      reApproval(){
        localStorage.setItem('ReApprovalTempData',
          JSON.stringify({
              valid: true,
              flowid:this.data.flowid,
              data: this.data.data,
              title: this.data.tableInfo.Title,
              tableItems: this.data.tableItems
          }))
        this.setData({
          disablePage:true
        })
        for (let m of this.data.menu) {
            if (m.flowId == this.data.flowid) {
              dd.switchTab({
                url: '/page/start/' + m.url
              })
            }
        }
      },

      //获取审批表单信息
      getFormData(){
        var that = this
        var param = {
          ApplyManId:this.data.DingData.userid,
          nodeId:this.data.nodeid,
          TaskId:this.data.taskid
        }
        this._getData("FlowInfoNew/GetApproveInfo" + this.formatQueryStr(param),
        function(res) {
          that.setData({
            tableInfo: res
          })
          that.handleUrlData(res)
        },this.data.DingData)
      },
      //获取审批表单Bom表数据
      getBomInfo(flowid,nodeid,index){
        if(!flowid) return
        var that = this
        var url = ''
        switch(flowid){
          case '1': url = "OfficeSupplies/ReadTable"; break;
          case '6': url = "DrawingUploadNew/GetPurchase"; break;
          case '8': url = "ItemCodeAdd/GetTable"; break;
          case '23': url = "PurchaseOrder/QuaryByTaskId"; break;
          case '24': url = "PurchaseNew/ReadPurchaseTable"; break;
          case '26': url = "PurchaseNew/ReadPurchaseTable"; break;
          case '27': url = "Godown/Read"; break;
          case '28': url = "Pick/Read"; break;
          case '67': url = "Borrow/Read"; break;
          case '68': url = "Maintain/Read"; break;
        }
        if(!url) return
        console.log('3333333333333333333333333333333333')
        console.log(flowid)
        console.log(nodeid)
        url += this.formatQueryStr({TaskId:this.data.taskid})
        //if(flowid == 24){
        if((flowid == 24 && nodeid == 5) || (flowid == 26 && nodeid == 4)){
          this._getData('Role/GetRoleInfoNew' + this.formatQueryStr({RoleName:"采购员"}),(res)=>{
            
            that.setData({tableOptions:res})
            that._getData(url,(data)=>{
              let name = ''
              nodeid == 5 ?  name = '巫仕座' :  name = '杜双凤'
              for(let d of data)
                for(let i =0;i < that.data.tableOptions.length;i++){
                  let o = that.data.tableOptions[i]
                  if (o.name == name) {
                      d['PurchaseMan'] = o.name
                      d['PurchaseManId'] = o.emplId
                      d['index'] = i
                  }
                }
              that.setData({
                data: data,
                'tableParam.total': data.length
              })
              that.getData()
              that.setChooseMan()
            })
          })
          return
        }
        if((flowid == 24 && nodeid == 7 && index == 0) || (flowid == 26 && nodeid == 6 && index == 0)){
          that._getData(url,(data)=>{
            let tmp = []
            for(let d of data){
              if (d.PurchaseManId == that.data.DingData.userid) {
                  tmp.push(d)
              }
              data = tmp
            }
            that.setData({
              data: data,
              'tableParam.total': data.length
            })
            that.getData()
            console.log('3333333333333333333333333333333333')
            console.log(that.data.DingData.userid)
            console.log(that.data.data)
          })
          return
        }
        if(flowid == 8){
          this.requestData('get',url,(res)=> {
              console.warn(res)
              console.warn(res.data.length)
              that.setData({
                data: res.data,
                'tableParam.total': res.data.length
              })
              that.getData()
          })
          return
        }
        this._getData(url,(res)=> {
            that.setData({
              data: res,
              'tableParam.total': res.length
            })
            that.getData()
        })
      },
      //根据taskId获取下一个需要审批的人，即要钉的人
      getDingList(taskId) {
          var that = this
          this._getData('DingTalkServers/Ding?taskId=' + taskId, function (data) {
              if (data.ApplyManId) {
                  that.data.dingList.push(data.ApplyManId)
              }
              else that.data.dingList = []
          })
      },
      //钉一下功能
      ding(){
        dd.createDing({
          users : this.data.dingList,// 用户列表，工号
          type: 1, // 附件类型 1：image  2：link
          alertType: 2, // 钉发送方式 0:电话, 1:短信, 2:应用内
          text: '请帮我审批一下，审批编号为:'+ this.data.taskid,  // 正文
        });
      },
      //打印流程表单
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
      //处理表单中的图片、PDF等文件显示
      handleUrlData(data) {
        var that = this
        let imageList = []
        let fileList = []
        let pdfList = []
        if (data.ImageUrl && data.ImageUrl.length > 5) {
            var tempList = data.ImageUrl.split(',')
            for (let img of tempList) {
                imageList.push(that.data.dormainName + (img.substring(2)).replace(/\\/g, "/"))
            }
            that.setData({imageList:imageList})
        }
        if (data.FileUrl && data.FileUrl.length > 5) {
            that.data.FileUrl = data.FileUrl
            var urlList = data.FileUrl.split(',')
            var oldUrlList = data.OldFileUrl.split(',')
            var MediaIdList = data.MediaId ? data.MediaId.split(',') : []
            for (var i = 0; i < urlList.length; i++) {
                fileList.push({
                    name: oldUrlList[i],
                    url: that.data.dormainName + (urlList[i].substring(2)).replace(/\\/g, "/"),
                    mediaId: MediaIdList[i]
                })
            }
            that.setData({fileList:fileList})
        }
        if (data.FilePDFUrl && data.FilePDFUrl.length > 5) {
            that.data.FilePDFUrl = data.FilePDFUrl
            var urlList = data.FilePDFUrl.split(',')
            var oldUrlList = data.OldFilePDFUrl.split(',')
            var MediaIdList = data.MediaIdPDF ? data.MediaIdPDF.split(',') : []
            var stateList = data.PdfState ? data.PdfState.split(',') : []
            for (var i = 0; i < urlList.length; i++) {
                pdfList.push({
                    name: oldUrlList[i],
                    url: that.data.dormainName + (urlList[i].substring(2)).replace(/\\/g, "/"),
                    mediaId: MediaIdList[i],
                    state: stateList[i]
                })
            }
            that.setData({pdfList:pdfList})
        }
    }
    },
    //审批所有流程通过，后续处理
    doneSubmit(text) {
        if (!text) text = '提交审批成功'
        dd.alert({
          content:text,
          success(){
            dd.switchTab({
              url: '/page/start/index'
            })
          }
        })
        
    },
    //获取节点列表
    getNodeList() {
      var that = this
      let param = {
        FlowId:this.data.flowid,
        TaskId:this.data.taskid
      }
      this._getData("FlowInfoNew/GetSign" + this.formatQueryStr(param), function(res) {
        let lastNode = {}
        let tempNodeList = []
        //审批人分组
        for (let node of res) {
            if (lastNode.NodeName == node.NodeName && !lastNode.ApplyTime && !node.ApplyTime) {
                tempNodeList[tempNodeList.length - 1].ApplyMan = tempNodeList[tempNodeList.length - 1].ApplyMan + ',' + node.ApplyMan
            }
            else {
                tempNodeList.push(node)
            }
            lastNode = node
        }
        for (let node of tempNodeList) {
            node['AddPeople'] = []
            //抄送人分组
            if (node.ApplyMan && node.ApplyMan.length > 0)
                node.NodePeople = node.ApplyMan.split(',')
            //申请人设置当前人信息
            if (node.NodeName.indexOf('申请人') >= 0 && !node.ApplyMan) {
                node.ApplyMan = that.data.DingData.nickName
                node.AddPeople = [{
                    name: that.data.DingData.nickName,
                    userId: that.data.DingData.userid
                }]
            }
        }
        that.setData({
          nodeList:tempNodeList,
          isBack:res[0].IsBack
        })
      })
    },
    //获取项目列表
    getProjectList() {
      var that = this
      if(this.data.flowid == '26'){
        this._getData("ContractManager/Quary" + this.formatQueryStr({pageIndex:1,pageSize:1000}), function(res) {
          for(let r of res){
            r['text'] =  ' 编号: ' + r.ContractNo + "-" + r.ContractName 
          }
          that.setData({
            projectList:res
          })
        })
        return
      }
      this._getData("ProjectNew/GetAllProJect", function(res) {
        that.setData({
          projectList:res
        })
      })
    },
    //获取当前节点信息
    getNodeInfo() {
      var that = this
      this._getData("FlowInfoNew/getnodeinfo" + this.formatQueryStr({FlowId:this.data.flowid,nodeId:this.data.nodeid}),
       function(res) {
        that.setData({
          nodeInfo:res[0],
          IsNeedChose: res[0].IsNeedChose
        })
      })
    },
    
    //选择时间
    selectStartDateTime(){
        dd.datePicker({
          format: 'yyyy-MM-dd HH:mm',
          currentDate: this.data.DateStr + ' ' + this.data.TimeStr,
          startDate: this.data.DateStr + ' ' + this.data.TimeStr,
          endDate: this.data.Year+1 + '-' + this.data.Month + '-' + this.data.Day + ' ' + this.data.TimeStr,
          success: (res) => {
            this.setData({
              startDateStr: res.date
            })
          },
        });
      },
      selectEndDateTime(){
        dd.datePicker({
          format: 'yyyy-MM-dd HH:mm',
          currentDate: this.data.DateStr + ' ' + this.data.TimeStr,
          startDate: this.data.DateStr + ' ' + this.data.TimeStr,
          endDate: this.data.Year+1 + '-' + this.data.Month + '-' + this.data.Day + ' ' + this.data.TimeStr,
          success: (res) => {
            this.setData({
              endDateStr: res.date
            })
          },
        });
      },
      //选择时间
      selectDate(){
        dd.datePicker({
          currentDate: this.data.DateStr,
          startDate: this.data.DateStr,
          endDate: this.data.Year+1 + '-' + this.data.Month + '-' + this.data.Day,
          success: (res) => {
            this.setData({
              dateStr: res.date
            })
          },
        });
      },
      selectStartDate(){
        dd.datePicker({
          format: 'yyyy-MM-dd',
          currentDate: this.data.DateStr,
          startDate: this.data.DateStr,
          endDate: this.data.Year+1 + '-' + this.data.Month + '-' + this.data.Day,
          success: (res) => {
            this.setData({
              startDateStr: res.date
            })
          },
        });
      },
      selectEndDate(){
        dd.datePicker({
          format: 'yyyy-MM-dd',
          currentDate: this.data.DateStr,
          startDate: this.data.DateStr,
          endDate: this.data.Year+1 + '-' + this.data.Month + '-' + this.data.Day,
          success: (res) => {
            this.setData({
              endDateStr: res.date
            })
          },
        });
      },
 
    //预览图片
    previewImg(e){
      console.log(e.target.dataset.url)
      dd.previewImage({
        urls: [e.target.dataset.url],
      });
    },
    //上传图片
    uploadImg(e){
      console.log('2333333333')
      var that = this
      dd.chooseImage({
        count: 2,
        success: (res) => {
          that.setData({imageList:that.data.imageList})
          //dd.alert({content:'ues ' + JSON.stringify(res)})
          for(let p of res.apFilePaths){
            that.data.imageList.push(p)
            that.setData({disablePage:true})
            dd.uploadFile({
              url: that.data.dormainName + 'drawingupload/Upload',
              fileType: 'image',
              fileName: p.substring(7),
              filePath: p,
              success: (res) => {
                //dd.alert({content:'你返回的 ' + JSON.stringify(res)})
                console.log(JSON.parse(res.data).Content)
                that.data.imgUrlList.push(JSON.parse(res.data).Content)
                that.setData({disablePage:false})
              },
              fail:(err) => {
                dd.alert({content:'sorry' + JSON.stringify(err)})
              }
            });
          }
          that.setData({imageList:that.data.imageList})
        },
      });
    },
    //弹窗表单相关
    //显示弹窗表单
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
    chooseItem(e){
      if(!e) return
      console.log(e)
      this.data.chooseIndex = e.target.targetDataset.index
      this.setData({
        hidden: !this.data.hidden
      })
      this.createMaskShowAnim();
      this.createContentShowAnim();
    },
    tapReturn(e){
      if(!e) return
      this.setData({
        hidden: !this.data.hidden
      })
      this.createMaskShowAnim();
      this.createContentShowAnim();
    },
    deleteItem(e){
      if(!e) return
      console.log(e)
      let index = e.target.targetDataset.index
      if((!index) && index != 0)  return
      console.log(this.data.purchaseList)
      this.data.purchaseList.splice(index, 1)
      this.setData({
        purchaseList:this.data.purchaseList
      })
      console.log(this.data.purchaseList)
    },
    //隐藏弹窗表单
    changeSuggest(e){
      console.log(e.target.dataset.Id)
      this.data.changeRemarkId = e.target.dataset.Id
      this.data.changeRemarkNodeid = e.target.dataset.NodeId
      if(!e) return
      this.setData({
        hiddenCrmk: !this.data.hiddenCrmk,
        //hehe: e.target.dataset.remark
      })
      this.createMaskShowAnim();
      this.createContentShowAnim();
    },
    changeRemark(e){
      this.setData({
        disablePage:true
      })
      let param = {
        Id:this.data.changeRemarkId,
        Remark:e.detail.value.remark
        //nodeId: this.data.changeRemarkNodeid
      }
      let id = this.data.changeRemarkNodeid
      this.setData({
        [`nodeList[${id}].Remark`]: param.Remark
      })
      console.log("DingTalkServers/ChangeRemark   !!!!!!!")
      console.log(param)
      this._postData("DingTalkServers/ChangeRemark",(res)=>{
        this.setData({
          disablePage:false
        })
        dd.alert({content:'修改成功'})
        this.onModalCloseTap2()
      },param)
      return
      this._getData("FlowInfoNew/ChangeRemark?Id="+param.Id+'&Remark='+param.Remark, (res)=> {
          this.setData({
            disablePage:false
          })
          dd.alert({content:'修改成功'})
        })
    },
    onModalCloseTap() {
      this.createMaskHideAnim();
      this.createContentHideAnim();
      setTimeout(() => {
        this.setData({
          hidden: true,
        });
      }, 210);
    },
    onModalCloseTap2() {
      this.createMaskHideAnim();
      this.createContentHideAnim();
      setTimeout(() => {
        this.setData({
          hiddenCrmk: true,
        });
      }, 210);
    },
    //下载文件
    downloadFile(e){
      console.log('下载文件~~~~~~~~~~')
      var url = "DingTalkServers/sendFileMessage"
      var param = {
        UserId: this.data.DingData.userid,
        Media_Id: e.target.dataset.mediaId
      }
      console.log(url)
      this.requestData('POST', url , function(res) { 
        dd.alert({content:'提示信息:' + JSON.parse(res.data).errmsg})
      },param)
    },
    //检查是否登录
    checkLogin(callBack){
      var that = this
      var app = getApp()
      //检查登录
      if (app.userInfo) {
        var DingData = {
          nickName:app.userInfo.name,
          departName:app.userInfo.dept,
          userid:app.userInfo.userid
        }

        that.setData({DingData:DingData })
        callBack()
        return
      }
      dd.showLoading({
        content: '登录中...'
      });
      
      dd.getAuthCode({
        success: (res) => {
          console.log(res.authCode);
          // lib.func._getData('LoginMobile/Bintang' + lib.func.formatQueryStr({authCode:res.authCode}),function(res){
          //   app.userInfo = res
            
          //   console.log("sssssssssssssssssssssssss");
          //   console.log(res);
            
          //   var DingData = {
          //     nickName:res.name,
          //     departName:res.dept,
          //     userid:res.userid
          //   }
          //   dd.hideLoading()

          //   that.setData({ DingData:DingData })
          //   callBack()
          // })
          lib.func._getData('LoginMobile/Bintang' + lib.func.formatQueryStr({authCode:res.authCode}),(res) => {
              let result = res;          
              dd.httpRequest({
                    url: that.data.dormainName + "DingTalkServers/getUserDetail" +lib.func.formatQueryStr({userid:res.userid}),
                    method: 'POST',
                    headers:{'Content-Type':'application/json; charset=utf-8','Accept': 'application/json',},
                    success: function(res) {
        
                      let name = JSON.parse(res.data).name;
                      if(!result.userid){
                        dd.alert({
                          content:res.errmsg+',请关掉应用重新打开试试~'
                        });
                        return
                      }
                      app.userInfo = result
                      var DingData = {
                        // nickName:result.name,
                        nickName:name || result.name,
                        departName:result.dept,
                        userid:result.userid
                      }
                      dd.hideLoading()
                      that.setData({ DingData:DingData })
                      callBack()
                    }


                  }) 

          })
        },
        // fail: (err) => {
        //   console.log('免登失败')
        //   dd.alert({ content: "免登失败" });
        //   //dd.alert({ content: JSON.stringify(err) })
        // }
      })
    },
    bindPickerChange(e){
      for(let i = 0;i<this.data.nodeList.length;i++){
        if(this.data.nodeList[i].NodeName.indexOf('项目负责人') >= 0){
          this.data.nodeList[i].AddPeople = 
            [{
                name: this.data.projectList[e.detail.value].ResponsibleMan,
                userId: this.data.projectList[e.detail.value].ResponsibleManId
            }]

            let newTitle = this.data.projectList[e.detail.value].ProjectId  + "-" + this.data.projectList[e.detail.value].ProjectName;
            if(newTitle.indexOf("undefined") > -1){
              newTitle = undefined;
            }
            let a = this.data.projectList[e.detail.value].ContractNo + "-" + this.data.projectList[e.detail.value].ContractName;

            console.log(this.data.projectList);
          this.setData({
            ['tableInfo.Title']:newTitle || a,
            projectIndex: e.detail.value,
            nodeList: this.data.nodeList
          });
        }
      }
    },
    bindDeptChange(e){
        this.setData({
        departIndex: e.detail.value,
      });
    }
  },
  

  
};

