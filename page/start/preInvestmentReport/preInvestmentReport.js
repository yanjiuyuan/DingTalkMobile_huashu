import pub from "/util/public";
import promptConf from "/util/promptConf.js";
let good = {};
Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        good: {},
        hidden: true,
        tableOperate: "选择",
        purchaseList: [],
        addPeopleNodes: [1], //额外添加审批人节点数组
        tableParam2: {
            total: 0,
        },
        tableOperate2: "删除",
        tableOperate3: "编辑",
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
                prop: "CodeNumber",
                label: "物料编码",
                width: 200,
            },
            {
                prop: "CodeName",
                label: "物料名称",
                width: 300,
            },
            {
                prop: "Standards",
                label: "规格型号",
                width: 300,
            },
            {
                prop: "Count",
                label: "数量",
                width: 100,
            },
            {
                prop: "Date",
                label: "预计交货期",
                width: 200,
            },

            {
                prop: "Purpose",
                label: "用途",
                width: 300,
            },

            {
                prop: "Remark",
                label: "备注",
                width: 300,
            },
            {
                prop: "ProductNumber",
                label: "试制批次号",
                width: 200,
            },
        ],
    },

    //提交弹窗表单
    addGood(e) {
        let value = e.detail.value;
        console.log(value);
        let reg = /^-?\d+$/; //只能是整数数字

        let reg2 = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$ /; //正浮点数

        let reg3 = /^[\.\d]*$/; //纯数字包括小数

        if (!value.Count.trim() || !value.Date.trim() || !value.Purpose.trim()) {
            dd.alert({
                content: `请填写已选信息！`,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (value.Count == 0) {
            dd.alert({
                content: "数量必须大于0！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }

        if (!reg.test(value.Count)) {
            dd.alert({
                content: "数量必须为整数！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }

        if (this.data.ifedit) {
            let param = {
                CodeNumber: this.data.good.FNumber,
                CodeName: this.data.good.FName,
                Standards: this.data.good.FModel,
                Count: value.Count.trim(),
                Date: value.Date,
                Purpose: value.Purpose.trim(),
                Remark: value.Remark.trim(),
                // ProductNumber: value.ProductNumber.trim(),
            };
            console.log("编辑");
            for (let i of this.data.purchaseList) {
                if (param.CodeNumber == i.CodeNumber) {
                    i.Count = param.Count;
                    i.Remark = param.Remark;
                    i.Purpose = param.Purpose;
                    i.Date = param.Date;
                    (i.ProductNumber = param.ProductNumber),
                        this.setData({
                            dateStr: "",
                            t: {},
                        });
                }
            }
            console.log(this.data.purchaseList);
            this.setData({
                purchaseList: this.data.purchaseList,
            });
        } else {
            let param = {
                CodeNumber: this.data.good.FNumber,
                CodeName: this.data.good.FName,
                Standards: this.data.good.FModel,
                Count: value.Count.trim(),
                Date: value.Date,
                Purpose: value.Purpose.trim(),
                Remark: value.Remark.trim(),
                // ProductNumber: value.ProductNumber.trim(),
            };
            console.log("添加");
            console.log(param);
            let length = this.data.purchaseList.length;
            let setStr = "purchaseList[" + length + "]";
            this.setData({
                "tableParam2.total": length + 1,
                [`purchaseList[${length}]`]: param,
                dateStr: "",
            });
        }
        this.onModalCloseTap();
    },
    //隐藏弹窗表单
    onModalCloseTap() {
        this.createMaskHideAnim();
        this.createContentHideAnim();
        setTimeout(() => {
            this.setData({
                t: {},
                dateStr: "",
                hidden: true,
            });
        }, 210);
    },
    //表单操作相关
    search(e) {
        let value = e.detail.value;
        console.log(value);
        if (!value || !value.keyWord.trim()) {
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
    //表单判断
    judge(value) {
        let that = this;

        if (that.data.projectList[that.data.projectIndex] == undefined) {
            dd.alert({
                content: "项目名称不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return false;
        }
        if (value.ExpectPurpose.trim() == "") {
            dd.alert({
                content: "预投目的不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return false;
        }
        if (that.data.purchaseList.length == 0) {
            dd.alert({
                content: "物料不允许为空，请选择！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return false;
        }
        return true;
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;

        if (this.judge(value) == false) {
            return;
        }
        value.ProjectName = this.data.projectList[this.data.projectIndex].ProjectName;
        value.ProjectNumber = this.data.projectList[this.data.projectIndex].ProjectId;
        value.ExpectDept = this.data.DingData.departmentList[this.data.departmentIdnex];
        let param = {
            Title: value.title,
            Remark: value.remark,
            ProjectName: that.data.projectList[that.data.projectIndex].ProjectName,
            ProjectId: that.data.projectList[that.data.projectIndex].ProjectId,
        };
        let callBack = function(taskId) {
            that.bindAll(taskId, value);
        };
        console.log(param);
        this.approvalSubmit(param, callBack);
    },

    bindAll(taskId, value) {
        let that = this;
        let paramArr = [];
        for (let p of that.data.purchaseList) {
            p.TaskId = taskId;
            paramArr.push(p);
        }
        value.TaskId = taskId;
        value.ProductionOrderDetails = paramArr;
        that.requestJsonData(
            "POST",
            "ProductionOrder/Save",
            function(res) {
                that.doneSubmit();
            },
            JSON.stringify(value)
        );
    },
});
