import pub from "/util/public";
import promptConf from "/util/promptConf.js";
let good = {};
Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        hidden: true,
        tableOperate: "选择",
        purchaseList: [],
        tableParam2: {
            total: 0
        },
        tableOperate2: "删除",
        good: {},
        totalPrice: 0.0,
        tableItems: [
            {
                prop: "fNumber",
                label: "物料编码",
                width: 200
            },
            {
                prop: "fName",
                label: "物料名称",
                width: 300
            },
            {
                prop: "fModel",
                label: "规格型号",
                width: 300
            },
            {
                prop: "unitName",
                label: "单位",
                width: 100
            },
            {
                prop: "fNote",
                label: "预计单价",
                width: 100
            }
        ],
        tableItems2: [
            {
                prop: "CodeNo",
                label: "物料编码",
                width: 200
            },
            {
                prop: "Name",
                label: "物料名称",
                width: 300
            },
            {
                prop: "Standard",
                label: "规格型号",
                width: 300
            },
            {
                prop: "Unit",
                label: "单位",
                width: 100
            },
            {
                prop: "ExpectPrice",
                label: "预计单价",
                width: 100
            },
            {
                prop: "Count",
                label: "数量",
                width: 100
            },
            {
                prop: "Purpose",
                label: "用途",
                width: 300
            },
            {
                prop: "Mark",
                label: "备注",
                width: 300
            }
        ]
        //data:[]
    },
    //表单操作相关
    search(e) {
        let that = this;
        let value = e.detail.value;
        console.log(this.data.chooseParam);
        console.log(value);
        if (!value || !value.keyWord.trim()) {
            dd.alert({
                content: promptConf.promptConf.SearchNoInput,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        let url =
            that.data.jinDomarn + "OfficeSupply/GetOfficeInfo" + that.formatQueryStr({ Key: value.keyWord.trim() });
        dd.httpRequest({
            url: url,
            method: "GET",
            headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
            success: function(res) {
                let data = res.data.data;
                console.log(url);
                console.log(data);
                if (data.length == 0) {
                    dd.alert({
                        content: promptConf.promptConf.SearchNoReturn,
                        buttonText: promptConf.promptConf.Confirm
                    });
                }
                that.setData({
                    "tableParam.total": data.length,
                    "tableParam.now": 1
                });
                that.data.data = data;
                that.getData();
            },
            fail: function(res) {
                if (JSON.stringify(res) == "{}") return;
                dd.alert({ content: "获取数据失败-" + url + "报错:" + JSON.stringify(res) });
            }
        });
        return;
        that.requestData("GET", "OfficeSupplies/GetICItem" + that.formatQueryStr({ Key: value.keyWord }), function(
            res
        ) {
            console.log(JSON.parse(res.data));
            that.setData({
                "tableParam.total": JSON.parse(res.data).length
            });
            that.data.data = JSON.parse(res.data);
            that.getData();
        });
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark
        };
        if (!that.data.purchaseList.length) {
            dd.alert({
                content: `请选择办公用品`,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.title.trim() == "") {
            dd.alert({
                content: `标题不能为空，请输入!`,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        let callBack = function(taskId) {
            that.bindAll(taskId);
        };
        console.log(param);
        //return
        this.approvalSubmit(param, callBack);
    },

    bindAll(taskId) {
        let that = this;
        let paramArr = [];

        for (let p of that.data.purchaseList) {
            p.TaskId = taskId;
            paramArr.push(p);
        }
        that.requestJsonData(
            "POST",
            "OfficeSupplies/SaveTable",
            function(res) {
                that.doneSubmit();
            },
            JSON.stringify(paramArr)
        );
    },

    //弹窗表单相关
    //显示弹窗表单
    chooseItem(e) {
        if (!e) return;
        console.log(e);
        good = e.target.targetDataset.row;
        if (!good) return;

        for (let i of this.data.purchaseList) {
            if (i.CodeNo == good.fNumber) {
                dd.alert({
                    content: promptConf.promptConf.Repeat,
                    buttonText: promptConf.promptConf.Confirm
                });
                return;
            }
        }
        this.setData({
            hidden: !this.data.hidden
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },
    deleteItem(e) {
        if (!e) return;
        console.log(e);
        let index = e.target.targetDataset.index;
        let row = e.target.targetDataset.row;
        if (!index && index != 0) return;
        console.log(this.data.purchaseList);
        let length = this.data.purchaseList.length;
        this.data.purchaseList.splice(index, 1);

        let totalPrice = (
            parseFloat(this.data.totalPrice) -
            parseFloat(row.ExpectPrice) * parseFloat(row.Count)
        ).toFixed(2);
        this.setData({
            "tableParam2.total": length - 1,
            purchaseList: this.data.purchaseList,
            totalPrice: totalPrice
        });
        console.log(this.data.purchaseList);
    },
    selectDate() {
        dd.datePicker({
            currentDate: this.data.DateStr,
            startDate: this.data.DateStr,
            endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day,
            success: res => {
                this.setData({
                    dateStr: res.date
                });
            }
        });
    },
    //提交弹窗表单
    addGood(e) {
        let value = e.detail.value;
        console.log(value);
        for (let p of this.data.purchaseList) {
            if (p.CodeNo == good.FNumber) return;
        }

        let reg = /^-?\d+$/;
        if (!reg.test(value.Count)) {
            dd.alert({
                content: `数量必须为整数，请重新输入！`,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.Count <= 0) {
            dd.alert({
                content: `数量必须大于0，请重新输入！`,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }

        if (!value || !value.Count) {
            dd.alert({
                content: `数量不允许为空，请输入！`,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }

        let param = {
            CodeNo: good.fNumber,
            Name: good.fName,
            Standard: good.fModel,
            Unit: good.unitName,
            ExpectPrice: good.fNote,
            Count: value.Count,
            Purpose: value.Purpose.trim(),
            Mark: value.Mark.trim()
        };
        let length = this.data.purchaseList.length;
        let setStr = "purchaseList[" + length + "]";
        let totalPrice = (
            parseFloat(this.data.totalPrice) +
            parseFloat(param.ExpectPrice) * parseFloat(param.Count)
        ).toFixed(2);
        console.log(totalPrice);
        this.setData({
            "tableParam2.total": length + 1,
            [`purchaseList[${length}]`]: param,
            totalPrice: totalPrice
        });
        this.onModalCloseTap();
    },

    loadTempData() {
        let data = JSON.parse(localStorage.getItem("purchase"));
        if (data && data.length && data.length > 0) {
            this.setData({ purchaseList: data });
            localStorage.removeItem("purchase");
        }
    }
});
