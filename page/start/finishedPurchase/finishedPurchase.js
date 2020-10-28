import pub from "/util/public";
import promptConf from "/util/promptConf";
let good = {};
Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        hidden: true,
        tableOperate: "选择",
        ContractNameIndex: -1,
        purchaseList: [],
        options: [],
        tableParam2: {
            size: 100,
            // now: 1,
            total: 0,
        },

        SendPosition: [{ name: "华数", checked: true }, { name: "基地" }],
        tableOperate2: "删除",
        tableOperate3: "编辑",
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
                prop: "Purpose",
                label: "用途",
                width: 300,
            },
            {
                prop: "UrgentDate",
                label: "需用日期",
                width: 200,
            },
            {
                prop: "SendPosition",
                label: "送货地点",
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
        var value = e.detail.value;
        console.log(value);
        if (!value || !value.keyWord) return;
        var that = this;
        this._getData(
            "PurchaseNew/GetICItem" + this.formatQueryStr({ Key: value.keyWord }),
            res => {
                that.setData({
                    "tableParam.total": res.length,
                });
                that.data.data = res;
                that.getData();
            }
        );
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;

        if (this.data.ContractNameIndex == -1) {
            dd.alert({
                content: "合同名称不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        let param = {
            Title: value.title,
            Remark: value.remark,
            ProjectName: that.data.ContractNameList[that.data.ContractNameIndex].ContractName,
            ProjectId: that.data.ContractNameList[that.data.ContractNameIndex].ContractNo,
        };
        let callBack = function (taskId) {
            that.bindAll(taskId);
        };
        console.log(param);
        this.approvalSubmit(param, callBack, {
            ProjectId: param.ProjectId,
        });
    },
    bindAll(taskId) {
        var that = this;
        var paramArr = [];
        for (let p of that.data.purchaseList) {
            p.TaskId = taskId;
            paramArr.push(p);
        }
        this._postData(
            "PurchaseNew/SavePurchaseTable",
            res => {
                that.doneSubmit();
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

        this.setData({
            hidden: !this.data.hidden,
            ifedit: false,
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },
    deleteItem(e) {
        if (!e) return;
        console.log(e);
        let index = e.target.targetDataset.index;
        if (!index && index != 0) return;
        if (!e.target.targetDataset.opt2) {
            console.log('刪除')
            console.log(this.data.purchaseList);
            this.data.purchaseList.splice(index, 1);
            this.setData({
                purchaseList: this.data.purchaseList,
                "tableParam2.total": this.data.purchaseList.length,
            });
            console.log(this.data.purchaseList);
        }
        else {
            console.log('編輯')
            good = e.target.targetDataset.row;
            if (!good) return;
            this.setData({
                t: good,
                dateStr: good.UrgentDate,
                hidden: !this.data.hidden,
                ifedit: true,
            });
            this.createMaskShowAnim();
            this.createContentShowAnim();

        }

    },
    selectDate() {
        dd.datePicker({
            currentDate: this.data.DateStr,
            startDate: this.data.DateStr,
            endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day,
            success: res => {
                this.setData({
                    dateStr: res.date,
                });
            },
        });
    },
    //提交弹窗表单
    addGood(e) {
        var value = e.detail.value;
        console.log(value);
        for (let p of this.data.purchaseList) {
            if (p.CodeNo == good.FNumber) {
                dd.alert({
                    content: "物料编码重复，请重新输入！",
                    buttonText: promptConf.promptConf.Confirm,
                });
                return;
            }
        }
        if (!value || !value.Unit || !value.Count || !value.UrgentDate || !value.Purpose) {
            dd.alert({
                content: `表单填写不完整`,
            });
            return;
        }
        if (this.data.ifedit) {
            console.log("編輯");
            let param = {
                CodeNo: good.CodeNo,
                Name: good.Name,
                Standard: good.Standard,
                SendPosition: value.SendPosition,
                Unit: value.Unit,
                Price: value.Price ? value.Price + "" : "0",
                Count: value.Count,
                Purpose: value.Purpose,
                UrgentDate: value.UrgentDate,
                Mark: value.Mark,
                SendPosition:value.SendPosition
            };
            for (let i of this.data.purchaseList) {
                if (param.CodeNo == i.CodeNo) {
                    
                    i.Count = param.Count;
                    i.Mark = param.Mark;
                    i.Price = param.Price;
                    i.Purpose = param.Purpose;
                    i.Unit = param.Unit;
                    i.UrgentDate = param.UrgentDate;
                    i.SendPosition = param.SendPosition
                }
            }
            this.setData({
                purchaseList: this.data.purchaseList,
            });
        }
        else {
            let param = {
                CodeNo: good.FNumber,
                Name: good.FName,
                Standard: good.FModel,
                SendPosition: value.SendPosition,
                Unit: value.Unit,
                Price: value.Price ? value.Price + "" : "0",
                Count: value.Count,
                Purpose: value.Purpose,
                UrgentDate: value.UrgentDate,
                Mark: value.Mark,
            };
            let length = this.data.purchaseList.length;

            let setStr = "purchaseList[" + length + "]";
            this.setData({
                [`purchaseList[${length}]`]: param,
                "tableParam2.total": length + 1,
                totalPrice: this.data.totalPrice + param.Price * param.Count + "",
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
    //显示临时保存数据
    saveTempData() {
        localStorage.setItem("purchase", JSON.stringify(this.data.purchaseList));
        dd.alert({ content: "保存成功" });
    },
    loadTempData() {
        var data = JSON.parse(localStorage.getItem("purchase"));
        if (data && data.length && data.length > 0) {
            this.setData({ purchaseList: data });
            localStorage.removeItem("purchase");
        }
    },
});
