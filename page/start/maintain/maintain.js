import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        hidden: true,
        addPeopleNodes: [2], //额外添加审批人节点数组
        tableOperate: "选择",

        searchShow: true,
        purchaseList: [],
        tableParam2: {
            total: 0,
        },
        tableOperate2: "删除",
        good: {},
        totalPrice: 0,
        tableItems: [
            {
                prop: "FNumber",
                label: "物料编码",
                width: 200,
            },
            {
                prop: "FName",
                label: "物料名称",
                width: 300,
            },
            {
                prop: "FModel",
                label: "规格型号",
                width: 300,
            },
            {
                prop: "FNote",
                label: "预计单价",
                width: 100,
            },
        ],
        tableItems2: [
            {
                prop: "CodeNo",
                label: "物料编码",
                width: 200,
            },
            {
                prop: "Name",
                label: "物料名称",
                width: 300,
            },
            {
                prop: "Standard",
                label: "规格型号",
                width: 300,
            },
            {
                prop: "Unit",
                label: "单位",
                width: 100,
            },
            {
                prop: "Price",
                label: "单价",
                width: 100,
            },
            {
                prop: "Count",
                label: "数量",
                width: 100,
            },
            {
                prop: "MaintainContent",
                label: "维修内容",
                width: 300,
            },
            {
                prop: "NeedTime",
                label: "需用时间",
                width: 200,
            },
            {
                prop: "Mark",
                label: "备注",
                width: 300,
            },
        ],
        //data:[]
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        if (this.data.purchaseList.length == 0) {
            dd.alert({
                content: `表单填写不完整`,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (value.title.trim() == "") {
            dd.alert({
                content: `标题不能为空，请输入!`,
                buttonText: promptConf.promptConf.Confirm,
            });
        }
        let param = {
            Title: value.title,
            Remark: value.remark,
            ProjectName: that.data.projectList[that.data.projectIndex].ProjectName,
            ProjectId: that.data.projectList[that.data.projectIndex].ProjectId,
        };
        let callBack = function(taskId) {
            that.bindAll(taskId);
        };
        console.log(param);
        this.approvalSubmit(param, callBack);
    },
    bindAll(taskId) {
        let paramArr = [];
        for (let p of this.data.purchaseList) {
            p.TaskId = taskId;
            paramArr.push(p);
        }
        this._postData(
            "Maintain/Save",
            res => {
                this.doneSubmit();
            },
            paramArr
        );
    },
    //选择物料
    chooseItem(e) {
        if (!e) return;
        console.log(e);
        this.data.good = e.target.targetDataset.row;
        if (!this.data.good) return;

        for (let p of this.data.purchaseList) {
            if (p.CodeNo == this.data.good.FNumber) {
                dd.alert({
                    content: promptConf.promptConf.DuplicateFormItem,
                    buttonText: promptConf.promptConf.Confirm,
                });
                return;
            }
        }

        this.setData({
            hidden: !this.data.hidden,
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },
    //提交弹窗表单
    addGood(e) {
        this.setData({
            startDateStr: "",
        });
        let value = e.detail.value;
        console.log(value);

        if (value.Unit.trim() == "") {
            dd.alert({
                content: "单位不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }

        if (value.Count.trim() == "") {
            dd.alert({
                content: "数量不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (value.NeedTime.trim() == "") {
            dd.alert({
                content: "需用日期不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (value.MaintainContent.trim() == "") {
            dd.alert({
                content: "维修内容不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        let param = {
            CodeNo: this.data.good.FNumber,
            Name: this.data.good.FName,
            Standard: this.data.good.FModel,
            Unit: value.Unit,
            Price: value.Price ? value.Price + "" : "",
            Count: value.Count,
            MaintainContent: value.MaintainContent,
            NeedTime: value.NeedTime,
            Mark: value.Mark,
        };
        let length = this.data.purchaseList.length;
        let setStr = "purchaseList[" + length + "]";
        this.setData({
            [`purchaseList[${length}]`]: param,
            "tableParam2.total": length + 1,
        });
        this.onModalCloseTap();
    },
    searchOfficesupplies(e) {
        let that = this;
        let value = e.detail.value;
        console.log(this.data.chooseParam);
        console.log(value);
        if (!value || !value.keyWord.trim()) {
            dd.alert({
                content: promptConf.promptConf.SearchNoInput,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        let url =
            that.data.jinDomarn +
            "OfficeSupply/GetOfficeInfo" +
            that.formatQueryStr({ Key: value.keyWord.trim() });
        dd.httpRequest({
            url: url,
            method: "GET",
            headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
            success: function(res) {
                let data = res.data.data;
                if (data.length == 0) {
                    dd.alert({
                        content: promptConf.promptConf.SearchNoReturn,
                        buttonText: promptConf.promptConf.Confirm,
                    });
                }
                that.setData({
                    "tableParam.total": data.length,
                    "tableParam.now": 1,
                });
                that.data.data = data;
                that.getData();
            },
            fail: function(res) {
                if (JSON.stringify(res) == "{}") return;
                dd.alert({ content: "获取数据失败-" + url + "报错:" + JSON.stringify(res) });
            },
        });
        return;
    },
    async test(e) {
        this.data.flowid = 100;
        await this.getNodeList();
        await this.changeIndex(e);
    },
    changeIndex(e) {
        console.log(this.data.nodeList);
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
    bindPickerChange(e) {
        //for循环是判断是否需要需要审批节点
        this.test(e);
    },
    radioChange(e) {
        console.log("radioChange");
        if (this.data.flowid == 101 || this.data.flowid == 100) {
            this.data.flowid = 102;
            this.getNodeList();
        } else {
            this.data.flowid = 101;
            this.getNodeList();
        }

        this.setData({
            searchShow: !this.data.searchShow,
            purchaseList: [],
            tableParam: {
                total: 0,
            },
            tableParam2: {
                total: 0,
            },
        });
    },
});
