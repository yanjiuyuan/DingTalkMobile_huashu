import lib from "/lib.js";
import template from "/util/template/template.js";
import promptConf from "/util/promptConf.js";

let app = getApp();
let logs = [];
let x = -55;
let y = -47;
let xTap = -90;
let yTap = -90;

let States = ["在研", "已完成", "终止"];
let ProjectTypes = ["自研项目", "纵向项目", "横向项目", "测试项目"];
let CompanyNames = ["泉州华中科技大学智能制造研究院", "泉州华数机器人有限公司"];
let IntellectualPropertyTypes = ["发明", "实用新型", "外观", "软件著作权"];
let localStorage = "";

export default {
    data: {
        ...lib.data,
        ...template.data,
        version: "2.1.17",
        DingData: {
            nickName: "",
            departName: "",
            userid: "",
        },

        reg: /^-?\d+$/, //只能是整数数字
        reg2: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$ /, //正浮点数
        reg3: /^[\.\d]*$/, //纯数字包括小数
        reg4: /^\d{4}\w{3}\d{3}$|^\d{4}\w{2}\d{3}$/, //项目编号规范2019bbb000

        departmentIdnex: 0, //选择部门时用到的下标
        hideMask: false,
        param: {},
        IsNeedChose: false,
        flowid: 0,
        taskid: 0,
        nodeid: 0,
        state: "",
        id: 0,
        nodeList: [],
        projectList: [],
        ContractNameList: [],
        nodeInfo: {},
        rebackAble: true,
        FileUrl: "",
        FilePDFUrl: "",
        States: States,
        stateIndex: -1,
        localStorage: localStorage,
        ProjectTypes: ProjectTypes,
        ContractNameIndex: -1,
        projectIndex: -1,
        departIndex: -1,
        DeptNames: [],
        deptIndex: -1,
        CompanyNames: CompanyNames,
        companyIndex: 0,
        IntellectualPropertyTypes: IntellectualPropertyTypes,
        iptIndex: -1,
        dateStr: "",
        startDateStr: "",
        endDateStr: "",
        changeRemarkId: 0,
        changeRemarkNodeid: 0,

        // 发起页上传文件列表

        //审批页面变量
        imgUrlList: [],
        imageList: [],
        fileList: [],
        pdfList: [],
        dingList: [], //需要钉一下的人
        tableInfo: {}, //审批表单信息
        table: {},
        isback: false,
        hidden: true,
        hiddenCrmk: true,
        remark: "",
        disablePage: false,
    },

    func: {
        ...lib.func,
        ...template.func,

        start: {
            onLoad(param) {
                console.log("start page on load~~~~~~~~~~");
                let that = this;
                this.setData({
                    flowid: param.flowid,
                    "tableInfo.Title": param.title,
                });
                let callBack = function() {
                    //临时保存后无需再向服务器请求数据
                    if (
                        app.globalData[`${param.flowid}`] == undefined ||
                        app.globalData[`${param.flowid}`] == false
                    ) {
                        that.setData({
                            table: {}, //清除表单数据
                            imageList: [],
                            imgUrlList: [], //清除图片数据
                        });
                        that.getNodeList(); //获取审批列表
                        that.getProjectList(); //获取项目列表
                        that.getContractNameList(); //获取合同列表
                        that.getNodeInfo(); //获取审批列表当前节点的信息
                    }

                    //临时保存
                    if (app.globalData[`${param.flowid}`] == true) {
                        that.readData(param.flowid);
                    }
                    //重新发起
                    if (app.globalData.valid == true) {
                        let data = JSON.parse(param.data);

                        for (let d in data) {
                            that.setData({
                                [`${d}`]: data[d],
                            });
                        }
                        if (data.imageList.length > 0) {
                            that.imageListToImgUrlList(data.imageList);
                        }
                        if (that.data.flowid == 12) {
                            console.log("我会执行");
                            that.setData({
                                purchaseList: [],
                                tableData: [],
                                tableOperate: "删除",
                                tableParam: {
                                    total: 0,
                                },
                            });
                        } else if (that.data.flowid == 36) {
                            that.setData({
                                addPeopleNodes: [2, 5],
                            });
                        } else if (that.data.flowid == 30) {
                            let placeArr = data.table.Place.split(",");
                            that.setData({
                                placeArr: placeArr,
                            });
                        } else if (that.data.flowid == 23) {
                            that.setData({
                                reg: /^-?\d+$/, //只能是整数数字
                                tableParam: {
                                    total: 0,
                                },
                                tableParam2: {
                                    total: data.tableParam.total,
                                },
                                tableData: [],
                                tableData2: data.data,
                                tableData3: data.tableInfo,
                            });
                        } else if (that.data.flowid == 24) {
                        } else {
                            console.log("sssss");
                            that.setData({
                                tableParam2: {
                                    total: data.tableParam.total,
                                },
                                tableParam: {
                                    size: 5,
                                    now: 1,
                                    total: 0,
                                },
                                taskid: 0,
                                purchaseList: that.data.data, // 发起的物料表单
                                tableData: [],
                            });
                        }

                        app.globalData.valid = false;
                    }
                };
                this.checkLogin(callBack);
            },
            //提交审批
            approvalSubmit(param = {}, callBack, param2 = {}) {
                if (!this.data.DingData.userid) {
                    dd.alert({
                        content: promptConf.promptConf.LoginPrompt,
                        buttonText: promptConf.promptConf.Confirm,
                    });
                    return;
                }
                let that = this;
                this.setData({ disablePage: true });
                let paramArr = [];
                let applyObj = {
                    ApplyMan: that.data.DingData.nickName,
                    ApplyManId: that.data.DingData.userid,
                    Dept: that.data.DingData.departmentList[this.data.departmentIdnex],
                    NodeId: "0",
                    ApplyTime: that._getTime(),
                    IsEnable: "1",
                    FlowId: that.data.flowid + "",
                    IsSend: false,
                    State: "1",
                };
                for (let p in param) {
                    applyObj[p] = param[p];
                }

                paramArr.push(applyObj);

                let mustList = [];
                let choseList = [];

                //是否必选
                if (that.data.nodeInfo.IsMandatory) {
                    mustList = that.data.nodeInfo.IsMandatory.split(",");
                }
                // 该节点需要选择的节点
                if (that.data.nodeInfo.ChoseNodeId) {
                    choseList = that.data.nodeInfo.ChoseNodeId.split(",");
                }
                console.log(mustList);
                console.log(choseList);
                for (let node of that.data.nodeList) {
                    //第一个if 判断该节点是否需要选人
                    if (
                        (that.data.nodeInfo.IsNeedChose &&
                            that.data.nodeInfo.ChoseNodeId &&
                            that.data.nodeInfo.ChoseNodeId.indexOf(node.NodeId) >= 0) ||
                        (that.data.addPeopleNodes &&
                            that.data.addPeopleNodes.indexOf(node.NodeId) >= 0) ||
                        (node.NodeName.indexOf("申请人") >= 0 && node.NodeId > 0)
                    ) {
                        //第二个if表示判断该节点是否是必选节点
                        if (
                            (node.AddPeople.length == 0 &&
                                mustList[choseList.indexOf(node.NodeId + "")] == "1") ||
                            (node.AddPeople.length == 0 &&
                                that.data.addPeopleNodes &&
                                that.data.addPeopleNodes.indexOf(node.NodeId) >= 0)
                        ) {
                            dd.alert({
                                content: promptConf.promptConf.Approver,
                                buttonText: promptConf.promptConf.Confirm,
                            });
                            that.setData({
                                disablePage: false,
                            });
                            return;
                        }

                        for (let a of node.AddPeople) {
                            console.log(node);

                            if (
                                a.name == null ||
                                a.name == "" ||
                                a.userId == null ||
                                a.userId == ""
                            ) {
                                dd.alert({
                                    content: promptConf.promptConf.Approver,
                                    buttonText: promptConf.promptConf.Confirm,
                                });
                                return;
                            }

                            let tmpParam = {
                                ApplyMan: a.name,
                                ApplyManId: a.userId,
                                IsEnable: 1,
                                FlowId: that.data.flowid + "",
                                NodeId: node.NodeId + "",
                                IsSend: node.IsSend,
                                State: 0,
                                OldFileUrl: null,
                                IsBack: null,
                            };
                            for (let p2 in param2) {
                                tmpParam[p2] = param2[p2];
                            }
                            paramArr.push(tmpParam);
                        }
                    }
                }
                this.setData({
                    disablePage: true,
                });
                that._postData(
                    "FlowInfoNew/CreateTaskInfo",
                    function(res) {
                        let taskid = res;
                        callBack(taskid);
                    },
                    paramArr
                );
            },

            //搜索物料编码
            searchCode(e) {
                let value = e.detail.value;
                console.log(value);
                if (!value || !value.keyWord) {
                    dd.alert({
                        content: promptConf.promptConf.SearchNoInput,
                        buttonText: promptConf.promptConf.Confirm,
                    });
                    return;
                }
                let that = this;
                that.requestData(
                    "GET",
                    "Purchase/GetICItem" + that.formatQueryStr({ Key: value.keyWord }),
                    function(res) {
                        console.log(JSON.parse(res.data));
                        if (JSON.parse(res.data).length == 0) {
                            dd.alert({
                                content: promptConf.promptConf.SearchNoReturn,
                                buttonText: promptConf.promptConf.Confirm,
                            });
                            return;
                        }
                        that.setData({
                            "tableParam.total": JSON.parse(res.data).length,
                            "tableParam.now": 1,
                        });
                        that.data.data = JSON.parse(res.data);
                        that.getData();
                    }
                );
            },
            //弹窗表单相关
            //显示弹窗表单
            chooseItem(e) {
                if (!e) return;
                console.log(e);
                this.data.good = e.target.targetDataset.row;
                if (!this.data.good) return;
                this.setData({
                    hidden: !this.data.hidden,
                });
                this.createMaskShowAnim();
                this.createContentShowAnim();
            },
            deleteItem(e) {
                if (!e) return;
                console.log(e);
                let index = e.target.targetDataset.index;
                if (!index && index != 0) return;
                console.log(this.data.purchaseList);
                let length = this.data.purchaseList.length;
                this.data.purchaseList.splice(index, 1);
                this.setData({
                    purchaseList: this.data.purchaseList,
                    "tableParam2.total": length - 1,
                });
                console.log(this.data.purchaseList);
            },
        },
        dowith: {
            onLoad(param) {
                console.log("dowith page on load~~~~~~~~~~");
                console.log(param);
                this.data.imgUrlList = [];
                let that = this;
                this.setData({
                    flowid: param.flowid,
                    index: param.index,
                    nodeid: parseInt(param.nodeid),
                    taskid: param.taskid,
                    state: param.state,
                    flowname: param.flowname,
                });

                let callBack = function() {
                    that.getFormData();
                    that.getBomInfo(param.flowid);
                    that.getNodeList();
                    that.getNodeInfo();
                    that.getDingList(param.taskid);
                };
                this.checkLogin(callBack);
            },

            //审批-同意
            aggreSubmit(param, param2 = {}) {
                if (!this.data.DingData.userid) {
                    dd.alert({
                        content: promptConf.promptConf.LoginPrompt,
                        buttonText: promptConf.promptConf.Confirm,
                    });
                    return;
                }
                this.setData({
                    disablePage: true,
                });
                let paramArr = [];
                let that = this;
                paramArr.push({
                    TaskId: that.data.taskid,
                    ApplyMan: that.data.DingData.nickName,
                    ApplyManId: that.data.DingData.userid,
                    Dept: that.data.DingData.departName,
                    NodeId: that.data.nodeid,
                    ApplyTime: that._getTime(),
                    IsEnable: "1",
                    FlowId: that.data.flowid,
                    IsSend: "false",
                    State: "1",
                    Id: that.data.tableInfo.Id,
                    Remark: that.data.remark,
                });

                for (let p in param) {
                    paramArr[0][p] = param[p];
                }
                let mustList = [];
                let choseList = [];

                //是否必选
                if (that.data.nodeInfo.IsMandatory) {
                    mustList = that.data.nodeInfo.IsMandatory.split(",");
                }
                // 该节点需要选择的节点
                if (that.data.nodeInfo.ChoseNodeId) {
                    choseList = that.data.nodeInfo.ChoseNodeId.split(",");
                }
                for (let node of this.data.nodeList) {
                    if (
                        (that.data.nodeInfo.IsNeedChose &&
                            that.data.nodeInfo.ChoseNodeId &&
                            that.data.nodeInfo.ChoseNodeId.indexOf(node.NodeId) >= 0) ||
                        (that.data.addPeopleNodes &&
                            that.data.addPeopleNodes.indexOf(node.NodeId) >= 0)
                    ) {
                        if (
                            (node.AddPeople.length == 0 &&
                                mustList[choseList.indexOf(node.NodeId + "")] == "1") ||
                            (node.AddPeople.length == 0 &&
                                that.data.addPeopleNodes &&
                                that.data.addPeopleNodes.indexOf(node.NodeId) >= 0)
                        ) {
                            dd.alert({
                                content: promptConf.promptConf.Approver,
                                buttonText: promptConf.promptConf.Confirm,
                            });
                            this.setData({
                                disablePage: false,
                            });
                            return;
                        }
                    }

                    for (let a of node.AddPeople) {
                        let tmpParam = {
                            ApplyMan: a.name,
                            ApplyManId: a.userId,
                            TaskId: that.data.taskid,
                            ApplyTime: null,
                            IsEnable: 1,
                            FlowId: that.data.flowid,
                            NodeId: node.NodeId,
                            Remark: null,
                            IsSend: node.IsSend,
                            State: 0,
                            ImageUrl: null,
                            FileUrl: null,
                            IsPost: false,
                            OldImageUrl: null,
                            OldFileUrl: null,
                            IsBack: null,
                        };
                        for (let p2 in param2) {
                            tmpParam[p2] = param2[p2];
                        }
                        paramArr.push(tmpParam);
                    }
                }
                that._postData(
                    "FlowInfoNew/SubmitTaskInfo",
                    function(res) {
                        dd.alert({
                            content: promptConf.promptConf.SuccessfulSubmission,
                            buttonText: promptConf.promptConf.Confirm,
                            success: () => {
                                dd.switchTab({
                                    url: "/page/approve/approve",
                                });
                            },
                        });
                    },
                    paramArr
                );
            },

            //撤回审批
            returnSubmit(e) {
                dd.confirm({
                    title: "温馨提示",
                    content: promptConf.promptConf.Withdraw,
                    confirmButtonText: promptConf.promptConf.Confirm,
                    cancelButtonText: promptConf.promptConf.Cancel,
                    success: result => {
                        if (result.confirm == true) {
                            this.setData({
                                disablePage: true,
                            });
                            let that = this;
                            let param = {
                                TaskId: that.data.taskid,
                                ApplyMan: that.data.DingData.nickName,
                                ApplyManId: that.data.DingData.userid,
                                Dept: that.data.DingData.departName,
                                NodeId: that.data.nodeid,
                                ApplyTime: that._getTime(),
                                IsEnable: "1",
                                FlowId: that.data.flowid,
                                IsSend: "false",
                                State: "1",
                                BackNodeId: that.data.nodeInfo.BackNodeId,
                                Id: that.data.tableInfo.Id,
                            };
                            if (e && e.detail && e.detail.value) {
                                param["Remark"] = e.detail.value.remark;
                            } else {
                                param["NodeId"] = 0;
                            }
                            that._postData(
                                "FlowInfoNew/FlowBack",
                                function(res) {
                                    dd.alert({
                                        content: promptConf.promptConf.ApplicationWithdrawn,
                                        buttonText: promptConf.promptConf.Confirm,
                                        success: () => {
                                            dd.switchTab({
                                                url: "/page/approve/approve",
                                            });
                                        },
                                    });
                                },
                                param
                            );
                        }
                    },
                });
            },
            //退回审批
            returnsSubmit(e) {
                dd.confirm({
                    title: "温馨提示",
                    content: promptConf.promptConf.Return,
                    confirmButtonText: promptConf.promptConf.Confirm,
                    cancelButtonText: promptConf.promptConf.Cancel,
                    success: result => {
                        if (result.confirm == true) {
                            this.setData({
                                disablePage: true,
                            });
                            let that = this;
                            let param = {
                                TaskId: that.data.taskid,
                                ApplyMan: that.data.DingData.nickName,
                                ApplyManId: that.data.DingData.userid,
                                Dept: that.data.DingData.departName,
                                NodeId: that.data.nodeid,
                                ApplyTime: that._getTime(),
                                IsEnable: "1",
                                FlowId: that.data.flowid,
                                IsSend: "false",
                                State: "1",
                                BackNodeId: that.data.nodeInfo.BackNodeId,
                                Id: that.data.tableInfo.Id,
                            };
                            if (e && e.detail && e.detail.value) {
                                param["Remark"] = e.detail.value.remark;
                            } else {
                                param["NodeId"] = 0;
                            }
                            that._postData(
                                "FlowInfoNew/FlowBack",
                                function(res) {
                                    dd.alert({
                                        content: promptConf.promptConf.ApplicationReturned,
                                        buttonText: promptConf.promptConf.Confirm,
                                        success: () => {
                                            dd.switchTab({
                                                url: "/page/approve/approve",
                                            });
                                        },
                                    });
                                },
                                param
                            );
                        }
                    },
                });
            },
            //获取审批表单信息
            getFormData() {
                let that = this;
                let param = {
                    ApplyManId: this.data.DingData.userid,
                    nodeId: this.data.nodeid,
                    TaskId: this.data.taskid,
                };
                this._getData(
                    "FlowInfoNew/GetApproveInfo" + this.formatQueryStr(param),
                    function(res) {
                        that.setData({
                            tableInfo: res,
                        });
                        that.handleUrlData(res);
                    },
                    this.data.DingData
                );
            },
            //获取审批表单Bom表数据
            getBomInfo(flowid) {
                let that = this;
                let url = "";
                switch (flowid) {
                    case "1":
                        url = "OfficeSupplies/ReadTable";
                        break; //办公用品申请
                    case "6":
                        url = "DrawingUploadNew/GetPurchase";
                        break; //图纸审批
                    case "8":
                        url = "ItemCodeAdd/GetTable";
                        break; //物料编码
                    case "24":
                        url = "PurchaseNew/ReadPurchaseTable";
                        break; //零部件采购
                    case "26":
                        url = "PurchaseNew/ReadPurchaseTable";
                        break; //成品
                    case "23":
                        url = "PurchaseOrder/QuaryByTaskId";
                        break; //图纸下单
                    case "28":
                        url = "Pick/Read";
                        break; //领料
                    case "27":
                        url = "Godown/Read";
                        break; //入库
                    case "33":
                        url = "DrawingChange/Read";
                        break; //图纸变更
                    case "67":
                        url = "Borrow/Read";
                        break; //借入
                    case "68":
                        url = "Maintain/Read";
                        break; //维修
                }
                if (!url) return;
                if (flowid == "8") {
                    this.requestData(
                        "GET",
                        url,
                        res => {
                            if (flowid == "1") {
                                res = JSON.parse(res.data);
                            }
                            if (flowid == "8") {
                                res = res.data;
                                this.setData({
                                    purchaseList: res,
                                });
                            }

                            this.setData({
                                data: res,
                                "tableParam.total": res.length,
                            });
                            this.getData();
                        },
                        { TaskId: this.data.taskid }
                    );
                    return;
                }
                this._getData(
                    url + this.formatQueryStr({ TaskId: this.data.taskid }),
                    function(res) {
                        if (flowid == "33") {
                            res = res.DrawingChangeList;
                            for (let r of res) {
                                r.ChangeType == 1
                                    ? (r.ChangeType = "添加")
                                    : (r.ChangeType = "删除");
                            }
                        }

                        if (flowid == "1") {
                            let totalPrice = 0.0;
                            for (let i of res) {
                                totalPrice = (
                                    parseFloat(totalPrice) +
                                    parseFloat(i.ExpectPrice) * parseFloat(i.Count)
                                ).toFixed(2);
                            }

                            that.setData({
                                totalPrice: totalPrice == "NaN" ? 0 : totalPrice,
                            });
                        }
                        if (flowid == "24") {
                            let totalPrice = 0.0;
                            for (let i of res) {
                                totalPrice = (
                                    parseFloat(totalPrice) +
                                    parseFloat(i.Price) * parseFloat(i.Count)
                                ).toFixed(2);
                            }

                            that.setData({
                                totalPrice: totalPrice == "NaN" ? 0 : totalPrice,
                            });
                        }
                        if (flowid == "23") {
                        }
                        that.setData({
                            data: res,
                            "tableParam.total": res.length,
                        });
                        that.getData();
                    },
                    that.data.DingData
                );
            },
            //根据taskId获取下一个需要审批的人，即要钉的人
            getDingList(taskId) {
                let that = this;
                that.data.dingList = [];
                this._getData("DingTalkServers/Ding?taskId=" + taskId, data => {
                    if (data == null) {
                        return;
                    }
                    if (data.ApplyManId != null) {
                        that.data.dingList.push(data.ApplyManId);
                    } else that.data.dingList = [];
                });
            },
            //钉一下功能
            ding() {
                console.log(this.data);
                let param = {
                    userId: this.data.dingList[0],
                    title: "请帮我审核一下流水号为 " + this.data.taskid + " 的流程",
                    applyMan: this.data.DingData.nickName,
                    taskId: this.data.taskid,
                    flowName: this.data.flowname,
                    linkUrl: "eapp://page/approve/approve?index=0",
                };
                this._postData(
                    "DingTalkServers/sendOaMessage" + this.formatQueryStr(param),
                    res => {
                        dd.alert({
                            content: promptConf.promptConf.Ding,
                            buttonText: promptConf.promptConf.Confirm,
                        });
                    }
                );
            },
            //打印流程表单
            print(flowid) {
                let that = this;
                let url = "";
                let method = "";
                console.log(this.data.flowid);
                switch (this.data.flowid) {
                    case "6":
                        (url = "DrawingUploadNew/PrintAndSend"), (method = "post");
                        break; //图纸审批
                    case ("24", "26"):
                        (url = "PurchaseNew/PrintAndSend"), (method = "post");
                        break; //零部件采购
                    case "13":
                        (url = "CarTableNew/GetPrintPDF"), (method = "post");
                        break; //公车
                    case "14":
                        (url = "CarTableNew/GetPrintPDF"), (method = "post");
                        break; //私车
                    case "18":
                        (url = "OfficeSuppliesPurchase/PrintPDF"), (method = "post");
                        break; //办公用品采购
                    case "19":
                        (url = "Receiving/GetReport"), (method = "get");
                        break; //文件阅办单
                    case "23":
                        (url = "DrawingUpload/PrintAndSend"), (method = "post");
                        break; //图纸下单
                    case "28":
                        (url = "Pick/PrintPDF"), (method = "post");
                        break; //领料申请
                    case "27":
                        (url = "Godown/PrintPDF"), (method = "post");
                        break; //入库
                    case "30":
                        (url = "Evection/GetPrintPDF"), (method = "post");
                        break; //外出
                    case "31":
                        (url = "CreateProject/PrintPDF"), (method = "post");
                        break; //立项
                    case "33":
                        (url = "DrawingChange/PrintAndSend"), (method = "post");
                        break; //图纸变更
                    case "34":
                        (url = "TechnicalSupport/PrintAndSend"), (method = "post");
                        break; //项目技术支持
                    case "35":
                        (url = "MaterialRelease/PrintAndSend"), (method = "post");
                        break; //物资放行条
                    case "36":
                        (url = "IntellectualProperty/Print"), (method = "post");
                        break; //知识产权
                    case "67":
                        (url = "Borrow/PrintPDF"), (method = "post");
                        break; //借入
                    case "68":
                        (url = "Maintain/PrintPDF"), (method = "post");
                        break; //维修
                    case "69":
                        (url = "ProjectClosure/PrintAndSend"), (method = "post");
                        break; //结题
                    case "75":
                        (url = "ProductionOrder/PrintPDF"), (method = "post");
                        break; //生产指令单
                    case "76":
                        (url = "ProductionOrder/PrintPDF"), (method = "post");
                        break; //生产预投单
                    case "77":
                        (url = "ProductionOrder/PrintPDF"), (method = "post");
                        break; //小批量试制报告
                    case "78":
                        (url = "Gift/GetPrintPDF"), (method = "get");
                        break; //礼品
                    case "88":
                        (url = "Gift/GetPrintPDF"), (method = "get");
                        break; //礼品
                }
                let obj = {
                    UserId: that.data.DingData.userid,
                    TaskId: that.data.taskid,
                };
                //图纸变更需要多一个参数
                if (this.data.flowid == "33" || this.data.flowid == "6") {
                    obj.OldPath = that.data.FilePDFUrl.replace(/\\/g, "\\\\");
                }
                if (this.data.flowid == "13") {
                    obj.IsPublic = true;
                }

                //GET方法
                if (method == "get") {
                    this._getData(url + this.formatQueryStr(obj), function(res) {
                        dd.alert({
                            content: promptConf.promptConf.PrintFrom,
                            buttonText: promptConf.promptConf.Confirm,
                        });
                    });
                }
                //POST方法
                if (method == "post") {
                    this._postData(
                        url,
                        function(res) {
                            dd.alert({
                                content: promptConf.promptConf.PrintFrom,
                                buttonText: promptConf.promptConf.Confirm,
                            });
                        },
                        obj
                    );
                }
            },
            //导出bom表
            output() {
                let that = this;
                let url = "";
                let method = "";
                let obj = {};
                console.log(this.data.flowid);
                switch (this.data.flowid) {
                    case "6":
                        (url = "DrawingUploadNew/GetExcelReport"), (method = "get");
                        break; //图纸审批-
                    case "23":
                        (url = "PurchaseOrder/GetExcelReport"), (method = "get");
                        break; //图纸下单-
                    case "24":
                        (url = "Purchase/PrintExcel"), (method = "get");
                        break; //零部件采购
                    case "26":
                        (url = "Purchase/PrintExcel"), (method = "get");
                        break; //成品采购-
                    case "28":
                        (url = "Pick/PrintExcel"), (method = "post");
                        break; //领料申请-
                    case "27":
                        (url = "Godown/PrintExcel"), (method = "post");
                        break; //入库-
                    case "33":
                        (url = "DrawingChange/GetExcelReport"), (method = "get");
                        break; //图纸变更-
                    case "67":
                        (url = "Borrow/PrintExcel"), (method = "post");
                        break; //借入-
                    case "68":
                        (url = "Maintain/PrintExcel"), (method = "post");
                        break; //维修-
                }

                if (method == "get") {
                    obj = {
                        applyManId: this.data.DingData.userid,
                        taskId: this.data.taskid,
                    };
                    if (this.data.flowid == "24" || this.data.flowid == "26") {
                        obj = {
                            UserId: this.data.DingData.userid,
                            taskId: this.data.taskid,
                        };
                    }
                    this._getData(url + this.formatQueryStr(obj), function(res) {
                        dd.alert({
                            content: promptConf.promptConf.OutPutBom,
                            buttonText: promptConf.promptConf.Confirm,
                        });
                    });
                }
                if (method == "post") {
                    obj = {
                        UserId: this.data.DingData.userid,
                        TaskId: this.data.taskid,
                    };
                    this._postData(
                        url,
                        function(res) {
                            dd.alert({
                                content: promptConf.promptConf.OutPutBom,
                                buttonText: promptConf.promptConf.Confirm,
                            });
                        },
                        obj
                    );
                }
            },

            //处理表单中的图片、PDF等文件显示
            handleUrlData(data) {
                let that = this;
                let imageList = [];
                let fileList = [];
                let pdfList = [];
                if (data.ImageUrl == null) {
                    that.setData({ imageList: imageList });
                }
                if (data.FilePDFUrl == null) {
                    that.setData({ pdfList: pdfList });
                }
                if (data.FileUrl == null) {
                    that.setData({ fileList: fileList });
                }
                if (data.ImageUrl && data.ImageUrl.length > 5) {
                    let tempList = data.ImageUrl.split(",");
                    for (let img of tempList) {
                        imageList.push(that.data.dormainName + this.urlEncode(img.substring(2)));
                    }
                    that.setData({ imageList: imageList });
                }
                if (data.FileUrl && data.FileUrl.length > 5) {
                    that.data.FileUrl = data.FileUrl;
                    let urlList = data.FileUrl.split(",");
                    let oldUrlList = data.OldFileUrl.split(",");
                    let MediaIdList = data.MediaId ? data.MediaId.split(",") : [];
                    for (let i = 0; i < urlList.length; i++) {
                        fileList.push({
                            name: oldUrlList[i],
                            path: urlList[i].replace(/\\/g, "/"),
                            url:
                                that.data.dormainName + urlList[i].substring(2).replace(/\\/g, "/"),
                            mediaId: MediaIdList[i],
                        });
                    }
                    that.setData({ fileList: fileList });
                }
                if (data.FilePDFUrl && data.FilePDFUrl.length > 5) {
                    that.data.FilePDFUrl = data.FilePDFUrl;
                    let urlList = data.FilePDFUrl.split(",");
                    let oldUrlList = data.OldFilePDFUrl.split(",");
                    let MediaIdList = data.MediaIdPDF ? data.MediaIdPDF.split(",") : [];
                    let stateList = data.PdfState ? data.PdfState.split(",") : [];
                    for (let i = 0; i < urlList.length; i++) {
                        pdfList.push({
                            name: oldUrlList[i],
                            url:
                                that.data.dormainName + urlList[i].substring(2).replace(/\\/g, "/"),
                            mediaId: MediaIdList[i],
                            state: stateList[i] || 1,
                        });
                    }

                    that.setData({ pdfList: pdfList });
                }
            },
        },
        // url特殊字符转换
        urlEncode(str) {
            return str
                .replace(/\\/g, "/")
                .replace(/\s/g, "%20")
                .replace(/\&/g, "%26")
                .replace(/[\(]/g, "%28")
                .replace(/[\)]/g, "%29");
            // .replace(/\#/g, "%23")
            // .replace(/\%/g, "%25")
            // .replace(/\+/g, "%2B")
            // .replace(/\,/g, "%2C")
            // .replace(/\:/g, "%3A")
            // .replace(/\;/g, "%3B")
            // .replace(/\</g, "%3C")
            // .replace(/\=/g, "%3D")
            // .replace(/\>/g, "%3E")
            // .replace(/\?/g, "%3F")
            // .replace(/\@/g, "%40")
            // .replace(/\|/g, "%7C");
        },
        //审批所有流程通过，后续处理
        doneSubmit(text) {
            if (!text) text = promptConf.promptConf.Submission;
            dd.alert({
                content: text,
                buttonText: promptConf.promptConf.Confirm,
                success() {
                    dd.switchTab({
                        url: "/page/start/index",
                    });
                },
            });
        },
        //获取节点列表
        getNodeList() {
            let that = this;
            let param = {
                FlowId: this.data.flowid,
                TaskId: this.data.taskid,
            };
            this._getData("FlowInfoNew/GetSign" + this.formatQueryStr(param), res => {
                let lastNode = {};
                let tempNodeList = [];
                //审批人分组
                for (let node of res) {
                    if (
                        lastNode.NodeName == node.NodeName &&
                        !lastNode.ApplyTime &&
                        !node.ApplyTime &&
                        (lastNode.NodeName == "抄送" ||
                            lastNode.NodeName == "抄送相关人员" ||
                            lastNode.NodeName == "抄送小组成员" ||
                            lastNode.NodeName == "抄送所有人" ||
                            lastNode.NodeName == "抄送相关部长" ||
                            lastNode.NodeName == "抄送实际协作人") &&
                        (node.NodeName == "抄送" ||
                            node.NodeName == "抄送相关人员" ||
                            node.NodeName == "抄送小组成员" ||
                            node.NodeName == "抄送所有人" ||
                            node.NodeName == "抄送相关部长" ||
                            node.NodeName == "抄送实际协作人")
                    ) {
                        tempNodeList[tempNodeList.length - 1].ApplyMan =
                            tempNodeList[tempNodeList.length - 1].ApplyMan + "," + node.ApplyMan;
                    } else {
                        tempNodeList.push(node);
                    }
                    lastNode = node;
                }
                for (let node of tempNodeList) {
                    node["AddPeople"] = [];
                    //抄送人分组
                    if (node.ApplyMan && node.ApplyMan.length > 0) {
                        node.NodePeople = node.ApplyMan.split(",");
                    }
                    if (
                        this.data.rebackAble &&
                        node.IsSend == false &&
                        node.ApplyTime &&
                        node.ApplyManId &&
                        node.ApplyManId != that.data.DingData.userid
                    ) {
                        this.setData({
                            rebackAble: false,
                        });
                        this.data.rebackAble = false;
                    }

                    //申请人设置当前人信息
                    if (node.NodeName.indexOf("申请人") >= 0 && !node.ApplyMan) {
                        node.ApplyMan = that.data.DingData.nickName;
                        node.AddPeople = [
                            {
                                name: that.data.DingData.nickName,
                                userId: that.data.DingData.userid,
                            },
                        ];
                    }
                }

                //只有重新发起才会有初始的nodeList
                if (this.data.nodeList.length > 0) {
                    for (let i = 0, length = this.data.nodeList.length; i < length; i++) {
                        if (this.data.nodeList[i].NodePeople == undefined) {
                            break;
                        }
                        if (
                            this.data.nodeList[i].NodeName != "结束" &&
                            this.data.nodeList[i].NodePeople.length > 0 &&
                            tempNodeList[i].ApplyMan == null
                        ) {
                            tempNodeList[i].AddPeople = [
                                {
                                    name: this.data.nodeList[i].ApplyMan,
                                    userId: this.data.nodeList[i].ApplyManId,
                                },
                            ];
                        }
                    }
                }
                that.setData({
                    nodeList: tempNodeList,
                    isBack: res[0].IsBack,
                });
            });
        },
        //获取菜单
        getMenu(isAll) {
            let that = this;
            this._getData(
                "FlowInfoNew/LoadFlowSort" +
                    that.formatQueryStr({ userid: app.userInfo.userid, IsAll: isAll }),
                function(data) {
                    let sorts = data;
                    app.globalData.ALLsort = JSON.parse(JSON.stringify(data));
                    that.setData({ sort: data });
                    let sortItem = []; //用于存放sort打开展开收起的数据
                    let tempdata = []; //用于存放流程数据
                    for (let s of sorts) {
                        for (let f of s.flows) {
                            tempdata.push(f);
                        }
                    }
                    for (let s of sorts) {
                        let item = {
                            text: "收起",
                            class: "dropdown-content-show",
                        };
                        s["show"] = false;
                        sortItem.push(item);
                        for (let t of tempdata) {
                            if (t.PhoneUrl && t.SORT_ID == s.Sort_ID) {
                                s["show"] = true;
                                break;
                            }
                        }
                    }
                    app.globalData.sort = sorts;
                    app.globalData.menu = tempdata;
                    app.globalData.sortItems = sortItem;

                    // console.log(sorts);

                    // console.log(tempdata);

                    that.setData({
                        sort: sorts,
                        menu: tempdata,
                        sortItems: sortItem,
                    });
                }
            );
        },
        getNodeList_done(nodeList) {},
        //获取项目列表
        getProjectList() {
            let that = this;
            this._getData("ProjectNew/GetAllProJect", res => {
                that.setData({
                    projectList: res,
                });
            });
        },
        //获取合同列表
        getContractNameList() {
            let that = this;
            this._getData("ContractManager/Quary?pageIndex=1&pageSize=1000", res => {
                console.log(res);
                this.setData({
                    ContractNameList: res,
                });
            });
        },
        //获取当前节点信息
        getNodeInfo() {
            let that = this;
            this._getData(
                "FlowInfoNew/getnodeinfo" +
                    this.formatQueryStr({ FlowId: this.data.flowid, nodeId: this.data.nodeid }),
                function(res) {
                    that.setData({
                        nodeInfo: res[0],
                        IsNeedChose: res[0].IsNeedChose,
                    });
                }
            );
        },

        //选择时间
        selectStartDateTime() {
            dd.datePicker({
                format: "yyyy-MM-dd HH:mm",
                currentDate: this.data.DateStr + " " + this.data.TimeStr,
                startDate: this.data.DateStr + " " + this.data.TimeStr,
                endDate:
                    this.data.Year +
                    1 +
                    "-" +
                    this.data.Month +
                    "-" +
                    this.data.Day +
                    " " +
                    this.data.TimeStr,
                success: res => {
                    this.setData({
                        startDateStr: res.date,
                        "table.StartTime": res.date,
                    });
                },
            });
        },
        selectEndDateTime() {
            dd.datePicker({
                format: "yyyy-MM-dd HH:mm",
                currentDate: this.data.DateStr + " " + this.data.TimeStr,
                startDate: this.data.DateStr + " " + this.data.TimeStr,
                endDate:
                    this.data.Year +
                    1 +
                    "-" +
                    this.data.Month +
                    "-" +
                    this.data.Day +
                    " " +
                    this.data.TimeStr,
                success: res => {
                    this.setData({
                        endDateStr: res.date,
                        "table.EndTime": res.date,
                    });
                },
            });
        },
        //选择时间
        selectDate() {
            dd.datePicker({
                currentDate: this.data.DateStr,
                startDate: this.data.DateStr,
                endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day,
                success: res => {
                    this.setData({
                        dateStr: res.date,
                        "table.dateStr": res.date,
                    });
                },
            });
        },
        selectStartDate() {
            dd.datePicker({
                format: "yyyy-MM-dd",
                currentDate: this.data.DateStr,
                startDate: this.data.DateStr,
                endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day,
                success: res => {
                    this.setData({
                        startDateStr: res.date,
                        "table.StartTime": res.date,
                    });
                },
            });
        },
        selectEndDate() {
            dd.datePicker({
                format: "yyyy-MM-dd",
                currentDate: this.data.DateStr,
                startDate: this.data.DateStr,
                endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day,
                success: res => {
                    this.setData({
                        endDateStr: res.date,
                        "table.EndTime": res.date,
                    });
                },
            });
        },

        //预览图片
        previewImg(e) {
            console.log(e.target.dataset.url);
            dd.previewImage({
                urls: [e.target.dataset.url],
            });
        },
        //上传图片
        uploadImg(e) {
            let that = this;
            dd.chooseImage({
                count: 2,
                success: res => {
                    that.setData({ imageList: that.data.imageList });
                    for (let p of res.apFilePaths) {
                        console.log("imageList:", JSON.stringify(p));
                        that.data.imageList.push(p);
                        that.setData({ disablePage: true });
                        dd.uploadFile({
                            url: that.data.dormainName + "drawingupload/Upload",
                            fileType: "image",
                            fileName: p.substring(7),
                            filePath: p,
                            success: res => {
                                console.log(
                                    "imgUrlList:",
                                    JSON.stringify(JSON.parse(res.data).Content)
                                );
                                that.data.imgUrlList.push(JSON.parse(res.data).Content);
                                that.setData({ disablePage: false });
                            },
                            fail: err => {
                                dd.alert({
                                    content: "sorry" + JSON.stringify(err),
                                });
                            },
                        });
                    }
                    that.setData({ imageList: that.data.imageList });
                },
            });
        },
        //显示弹窗表单
        tapReturn(e) {
            if (!e) return;
            this.setData({
                hidden: !this.data.hidden,
            });
            this.createMaskShowAnim();
            this.createContentShowAnim();
        },
        changeSuggest(e) {
            console.log(e.target.dataset.Id);
            this.data.changeRemarkId = e.target.dataset.Id;
            this.data.changeRemarkNodeid = e.target.dataset.NodeId;
            if (!e) return;
            this.setData({
                hiddenCrmk: !this.data.hiddenCrmk,
            });
            this.createMaskShowAnim();
            this.createContentShowAnim();
        },
        changeRemark(e) {
            this.setData({
                disablePage: true,
            });
            let param = {
                Id: this.data.changeRemarkId,
                Remark: e.detail.value.remark,
            };
            console.log(this.data.changeRemarkId);
            return;
            let id = this.data.changeRemarkNodeid;
            this.setData({
                [`nodeList[${id}].Remark`]: param.Remark,
            });
            console.log("DingTalkServers/ChangeRemark   !!!!!!!");
            this._postData(
                "DingTalkServers/ChangeRemark",
                res => {
                    this.setData({
                        disablePage: false,
                    });
                    dd.alert({
                        content: promptConf.promptConf.ModifiyComment,
                        buttonText: promptConf.promptConf.Confirm,
                    });
                    this.onModalCloseTap2();
                },
                param
            );
            return;
        },
        //隐藏弹窗表单
        onModalCloseTap() {
            this.createMaskHideAnim();
            this.createContentHideAnim();
            setTimeout(() => {
                this.setData({
                    hidden: true,
                    a: true,
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
        downloadFile(e) {
            console.log("下载文件~~~~~~~~~~");
            let url = "DingTalkServers/sendFileMessage";
            let param = {
                UserId: this.data.DingData.userid,
                Media_Id: e.target.dataset.mediaId,
            };
            this.requestData(
                "POST",
                url,
                function(res) {
                    if (JSON.parse(res.data).errmsg == "ok") {
                        dd.alert({
                            content: promptConf.promptConf.Download,
                            buttonText: promptConf.promptConf.Confirm,
                        });
                    }
                },
                param
            );
        },
        //检查是否登录
        checkLogin(callBack) {
            let that = this;
            //检查登录
            if (app.userInfo) {
                let DingData = {
                    nickName: app.userInfo.nickName,
                    departName: app.userInfo.departName,
                    userid: app.userInfo.userid,
                    departmentList: app.userInfo.departmentList,
                };

                that.setData({
                    DingData: DingData,
                    DeptNames: app.globalData.DeptNames,
                });
                callBack();
                return;
            }
            dd.showLoading({
                content: promptConf.promptConf.Logining,
                buttonText: promptConf.promptConf.Confirm,
            });
            dd.getAuthCode({
                success: res => {
                    console.log(res.authCode);

                    lib.func._getData(
                        "LoginMobile/Bintang" + lib.func.formatQueryStr({ authCode: res.authCode }),
                        res => {
                            let result = res;
                            dd.httpRequest({
                                url:
                                    that.data.dormainName +
                                    "DingTalkServers/getUserDetail" +
                                    lib.func.formatQueryStr({ userid: res.userid }),
                                method: "POST",
                                data: "",
                                headers: {
                                    "Content-Type": "application/json; charset=utf-8",
                                    Accept: "application/json",
                                },
                                success: res => {
                                    console.log(res);
                                    let name = res.data.name;

                                    if (!result.userid) {
                                        dd.alert({
                                            content:
                                                res.errmsg +
                                                "," +
                                                promptConf.promptConf.CloseApplication,
                                            buttonText: promptConf.promptConf.Confirm,
                                        });
                                        return;
                                    }
                                    app.userInfo = result;
                                    let DingData = {
                                        nickName: name || result.name,
                                        departName: result.dept,
                                        userid: result.userid,
                                        departmentList: res.data.dept,
                                    };
                                    console.log(DingData);
                                    dd.hideLoading();
                                    that.setData({ DingData: DingData });
                                    callBack();
                                },
                            });
                        }
                    );
                },
                fail: res => {
                    dd.alert({
                        content: "失败" + JSON.stringify(res),
                    });
                },
            });
        },

        // 检查登录
        checkLogin2(callBack) {
            let that = this;
            //检查登录
            if (app.userInfo) {
                let DingData = {
                    nickName: app.userInfo.nickName,
                    departName: app.userInfo.departName,
                    userid: app.userInfo.userid,
                    departmentList: app.userInfo.departmentList,
                };

                that.setData({ DingData: DingData, DeptNames: app.globalData.DeptNames });
                callBack();
                return;
            }
            dd.showLoading({
                content: "登录中...",
            });

            dd.getAuthCode({
                success: res => {
                    console.log(res.authCode);
                    lib.func._getData(
                        "LoginMobile/Bintang" + lib.func.formatQueryStr({ authCode: res.authCode }),
                        res => {
                            let result = res;
                            dd.httpRequest({
                                url:
                                    that.data.dormainName +
                                    "DingTalkServers/getUserDetail" +
                                    lib.func.formatQueryStr({ userid: res.userid }),
                                method: "POST",
                                data: "",
                                headers: {
                                    "Content-Type": "application/json; charset=utf-8",
                                    Accept: "application/json",
                                },
                                success: function(res) {
                                    console.log(res);
                                    let name = res.data.name;
                                    if (!result.userid) {
                                        dd.alert({
                                            content:
                                                res.errmsg +
                                                "," +
                                                promptConf.promptConf.CloseApplication,
                                            buttonText: promptConf.promptConf.Confirm,
                                        });
                                        return;
                                    }

                                    let DingData = {
                                        nickName: name || result.name,
                                        // nickName: "蔡兴桐",
                                        departName: result.dept,
                                        userid: result.userid,
                                        // userid: "083452125733424957",
                                        departmentList: res.data.dept,
                                    };
                                    app.userInfo = DingData;

                                    console.log(DingData);
                                    dd.hideLoading();
                                    that.setData({ DingData: DingData });
                                    callBack();
                                },
                            });
                        }
                    );
                },
                fail: res => {
                    dd.alert({
                        content: "失败" + JSON.stringify(res),
                    });
                },
            });
        },
        //获取全部部门信息
        getDepartmentList() {
            this.postDataReturnData("DingTalkServers/departmentList", res => {
                let departmentList = JSON.parse(res.data).department;
                let department = [];
                for (let i of departmentList) {
                    department.push(i.name);
                }
                app.globalData.DeptNames = department;
            });
        },
        //选择项目名称之后 修改审批节点和标题
        bindPickerChange(e) {
            //for循环是判断是否需要需要审批节点
            for (let i = 0; i < this.data.nodeList.length; i++) {
                if (this.data.nodeList[i].NodeName.indexOf("项目负责人") >= 0) {
                    this.data.nodeList[i].AddPeople = [
                        {
                            name: this.data.projectList[e.detail.value].ResponsibleMan,
                            userId: this.data.projectList[e.detail.value].ResponsibleManId,
                        },
                    ];
                    this.setData({
                        nodeList: this.data.nodeList,
                    });
                }
            }
            //选择完项目名称后修改标题
            let newTitle =
                this.data.projectList[e.detail.value].ProjectId +
                "-" +
                this.data.projectList[e.detail.value].ProjectName;
            if (newTitle.indexOf("undefined") > -1) {
                newTitle = undefined;
            }
            let a =
                this.data.projectList[e.detail.value].ContractNo +
                "-" +
                this.data.projectList[e.detail.value].ContractName;
            console.log("picker发送选择改变，携带值为" + e.detail.value);
            this.setData({
                ["tableInfo.Title"]: newTitle || a,
                projectIndex: e.detail.value,
            });
        },

        //选择部门函数
        bindDeptChange(e) {
            this.setData({
                departIndex: e.detail.value,
            });
        },

        //重新发起审批
        relaunch(e) {
            app.globalData.table = this.data.table;
            app.globalData.valid = true;
            let str = JSON.stringify(this.data).replace(/%/g, "%25");
            let arr = this.route.split("/");
            let url = "/page/start/" + arr[2] + "/" + arr[3];
            console.log(url);
            dd.redirectTo({
                url: url + "?" + "flowid=" + this.data.tableInfo.FlowId + "&" + "data=" + str,
            });
        },

        // 转imageList成imgUrlList
        imageListToImgUrlList(imageList) {
            let arr = [];
            for (let i = 0, len = imageList.length; i < len; i++) {
                arr.push(
                    "~\\" +
                        imageList[i]
                            .slice(this.data.dormainName.length)
                            .replace("/", "\\")
                            .replace("/", "\\")
                );
                this.setData({
                    imgUrlList: arr,
                });
            }
        },
        //計算相差天數,会去除星期六日
        DateDiff(sDate1, sDate2) {
            //sDate1和sDate2是2017-9-25格式 ,sData1会比较大
            let aDate, oDate1, oDate2, iDays;

            aDate = sDate1.split("-");
            oDate1 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]); //转换为9-25-2017格式
            aDate = sDate2.split("-");
            oDate2 = new Date(aDate[1] + "-" + aDate[2] + "-" + aDate[0]);

            iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 / 24);

            if (iDays < 0) {
                return iDays;
            }
            let first = oDate2.getTime();
            let last = oDate1.getTime();
            let count = 0;
            for (let i = first; i <= last; i += 24 * 3600 * 1000) {
                let d = new Date(i);
                if (d.getDay() >= 1 && d.getDay() <= 5) {
                    count++;
                }
            }
            return count;
        },
        //合同选择
        bindPickerContractChange(e) {
            this.setData({
                ContractNameIndex: e.detail.value,
            });
        },
        //临时保存
        temporaryPreservation(e) {
            let that = this;
            dd.setStorage({
                key: `${that.data.flowid}`,
                data: {
                    data: that.data,
                },
                success: function() {
                    app.globalData[`${that.data.flowid}`] = true;
                    dd.alert({
                        content: promptConf.promptConf.TemporaryPreservation,
                        buttonText: promptConf.promptConf.Confirm,
                    });
                },
            });
        }, // 读取临时保存数据
        readData(flowid) {
            let that = this;
            dd.getStorage({
                key: `${flowid}`,
                success: function(res) {
                    that.data = res.data.data;
                    for (let d in that.data) {
                        that.setData({
                            [`${d}`]: that.data[d],
                        });
                    }
                    dd.removeStorage({
                        key: `${flowid}`,
                        success: function() {
                            app.globalData[`${flowid}`] = false;
                        },
                    });
                },
                fail: function(res) {},
            });
        },
        //流程图
        processOn() {
            console.log("我执行了");
            dd.navigateTo({
                url: "/page/processOn/processOn" + "?" + "flowid=" + this.data.flowid,
            });
        },
        //保存表单数据函数
        inputToTable(e) {
            let name = e.currentTarget.dataset.name;
            this.data.table[name] = e.detail.value;
        },
        inputToTableInfo(e) {
            let name = e.currentTarget.dataset.name;
            this.data.tableInfo[name] = e.detail.value;
            if (name == "Title") {
                this.setData({
                    "tableInfo.Title": this.data.tableInfo[name],
                });
            }
        },
        //checkBox选择按钮更新
        onChange(e) {
            let value = e.detail.value;
            for (let j of this.data.items) {
                j.checked = false;
                for (let i of value) {
                    if (i == j.name) {
                        j.checked = true;
                        break;
                    }
                }
            }
            this.setData({
                items: this.data.items,
            });
        },
        //部门选择函数
        bindObjPickerChange(e) {
            console.log("picker发送选择改变，携带值为", e.detail.value);
            this.setData({
                departmentIdnex: e.detail.value,
            });
        },
        //选择附件
        uploadFiles() {
            let that = this;
            dd.uploadAttachmentToDingTalk({
                image: { multiple: true, compress: false, max: 9, spaceId: "1699083579" },
                space: { spaceId: "1699083579", isCopy: 1, max: 9 },
                file: { spaceId: "1699083579", max: 1 },
                types: ["photo", "camera", "file", "space"],
                success: res => {
                    console.log(res);
                    that.data.fileList.push(res.data);
                    that.setData({
                        fileList: that.data.fileList,
                    });
                },
                fail: err => {
                    dd.alert({
                        content: JSON.stringify(err),
                    });
                },
            });
        },
        //对象数组去重,//pre为累加器，[]为pre的初始值，item为对象中要去重的key
        objectArrayDuplication(objectArray, item) {
            let obj = {};
            let array = objectArray.reduce((pre, next) => {
                obj[next[item]] ? "" : (obj[next[item]] = true && pre.push(next));
                return pre;
            }, []);
            return array;
        },
        //重置nodeid,也可以写在getNodeList()里，不过要换html表单显示条件，
        resetNodeId() {
            let param = {
                FlowId: this.data.flowid,
                TaskId: this.data.taskid,
            };
            this._getData("FlowInfoNew/GetSign" + this.formatQueryStr(param), res => {
                console.log(res);
                for (let i = res.length - 1; 0 <= i; i--) {
                    if (res[i].ApplyManId == app.userInfo.userid) {
                        console.log(res[i].NodeId);
                        this.setData({
                            nodeid: res[i].NodeId,
                        });
                        return res[i].NodeId;
                    }
                }
            });
        },
    },
};
