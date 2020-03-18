import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        hidden: true,
        tableOperate: "添加",
        tableOperate2: "删除",
        totalPrice: 0,
        tableParam: {
            size: 5,
            now: 1,
            total: 0,
        },
        tableParam2: {
            total: 0,
        },
        purchaseList: [], //已选列表
        tableItems: [
            {
                prop: "Type",
                label: "大类",
                width: 200,
            },
            {
                prop: "ProjectName",
                label: "小类",
                width: 300,
            },
            {
                prop: "GiftName",
                label: "名称",
                width: 300,
            },
            {
                prop: "Stock",
                label: "库存",
                width: 100,
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
        ],
        tableItems2: [
            {
                prop: "GiftName",
                label: "礼品名称",
                width: 500,
            },
            {
                prop: "GiftCount",
                label: "礼品数量",
                width: 300,
            },
        ],
    },

    search(e) {
        let value = e.detail.value;
        console.log(value);
        if (value.keyWord == "") {
            dd.alert({
                content: promptConf.promptConf.SearchNoInput,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        let param = {
            key: value.keyWord,
        };
        this._getData("Gift/GetStock" + this.formatQueryStr(param), res => {
            console.log(res);
            if (res.length == 0) {
                dd.alert({
                    content: promptConf.promptConf.SearchNoReturn,
                    buttonText: promptConf.promptConf.Confirm,
                });
            } else if (res.length > 0) {
                this.setData({
                    tableData: res,
                    "tableParam.total": res.length,
                    "tableParam.now": 1,
                });
                this.data.data = res;
                this.getData();
            }
        });
    },

    //添加
    chooseItem(e) {
        if (!e) return;
        this.data.good = e.target.targetDataset.row;
        if (!this.data.good) return;
        console.log(e.target.targetDataset.row);
        console.log(this.data.purchaseList);

        for (let i of this.data.purchaseList) {
            if (e.target.targetDataset.row.Id == i.GiftNo) {
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
    //删除
    deleteItem(e) {
        if (!e) return;
        let index = e.target.targetDataset.index;
        let row = e.target.targetDataset.row;
        console.log(row);
        if (!index && index != 0) return;
        let length = this.data.purchaseList.length;
        this.data.purchaseList.splice(index, 1);
        this.data.totalPrice -= parseFloat((row.GiftCount * row.Price).toFixed(2));
        if (this.data.totalPrice < 500) {
            this.data.flowid = 78;
            this.getNodeList();
        }
        this.setData({
            "tableParam2.total": length - 1,
            totalPrice: this.data.totalPrice,
            purchaseList: this.data.purchaseList,
        });
    },

    //提交弹窗表单
    addGood(e) {
        let value = e.detail.value;
        console.log(value);
        console.log(this.data.good);

        if (!value || !value.GiftCount) {
            dd.alert({
                content: `表单填写不完整`,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (parseInt(this.data.good.Stock) < parseInt(value.GiftCount)) {
            dd.alert({
                content: promptConf.promptConf.GreaterThanAvailable,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        let param = {
            GiftName: this.data.good.GiftName,
            GiftNo: this.data.good.Id,
            Price: this.data.good.Price,
            GiftCount: value.GiftCount,
        };
        this.data.totalPrice += parseFloat((value.GiftCount * this.data.good.Price).toFixed(2));
        let length = this.data.purchaseList.length;
        if (this.data.totalPrice >= 500) {
            this.data.flowid = 88;
            this.getNodeList();
        }
        this.setData({
            totalPrice: this.data.totalPrice,
            "tableParam2.total": length + 1,
            [`purchaseList[${length}]`]: param,
        });
        this.onModalCloseTap();
    },

    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark,
        };
        if (value.title.trim() == "") {
            dd.alert({
                content: `标题不能为空，请输入!`,
                buttonText: promptConf.promptConf.Confirm,
            });
        }
        if (!that.data.purchaseList.length) {
            dd.alert({
                content: `请选择礼品`,
                buttonText: promptConf.promptConf.Confirm,
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
            "Gift/TableSave",
            function(res) {
                that.doneSubmit();
            },
            JSON.stringify(paramArr)
        );
    },
});
