import pub from "/util/public";
import promptConf from "/util/promptConf.js";
let good = {};
Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        hidden: true,
        addPeopleNodes: [1], //额外添加审批人节点数组
        tableOperate: "选择",
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
                prop: "Supplier",
                label: "供应商",
                width: 200,
            },
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
                prop: "Purpose",
                label: "用途",
                width: 300,
            },
            {
                prop: "StartTime",
                label: "开始日期",
                width: 200,
            },
            {
                prop: "EndTime",
                label: "结束日期",
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
    //表单操作相关
    search(e) {
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
    submit(e) {
        let that = this;
        if (that.data.projectList[that.data.projectIndex] == undefined) {
            dd.alert({
                content: "项目名称不能为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        let value = e.detail.value;
        if (value.title.trim() == "") {
            dd.alert({
                content: `标题不能为空，请输入!`,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
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
            "Borrow/Save",
            res => {
                this.doneSubmit();
            },
            paramArr
        );
    },
    //弹窗表单相关
    //显示弹窗表单
    chooseItem(e) {
        if (!e) return;
        console.log(e);
        good = e.target.targetDataset.row;
        if (!good) return;

        for (let p of this.data.purchaseList) {
            if (p.CodeNo == good.FNumber) {
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

    //提交弹窗表单
    addGood(e) {
        this.setData({
            startDateStr: "",
            endDateStr: "",
        });
        let value = e.detail.value;
        console.log(value);
        if (value.Supplier.trim() == "") {
            dd.alert({
                content: "供应商不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
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
        if (value.StartTime.trim() == "") {
            dd.alert({
                content: "开始日期不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (value.EndTime.trim() == "") {
            dd.alert({
                content: "结束日期不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }

        if (value.Purpose.trim() == "") {
            dd.alert({
                content: "用途不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        let param = {
            Supplier: value.Supplier,
            CodeNo: good.FNumber,
            Name: good.FName,
            Standard: good.FModel,
            Unit: value.Unit,
            Price: value.Price ? value.Price + "" : "",
            Count: value.Count,
            Purpose: value.Purpose,
            StartTime: value.StartTime,
            EndTime: value.EndTime,
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
});
