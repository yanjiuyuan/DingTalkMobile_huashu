import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        hidden2: true,
        tableParam2: {
            total: 0,
        },
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
    chooseItem(e) {
        if (!e) return;
        console.log(e);
        this.data.good = e.target.targetDataset.row;
        if (!this.data.good) return;
        this.setData({
            hidden2: !this.data.hidden2,
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },
    //隐藏弹窗表单
    onModalCloseTap() {
        this.createMaskHideAnim();
        this.createContentHideAnim();
        this.setData({
            t: {},
            hidden2: true,
        });
    },
    onReady() {
        let that = this;
        //生产计划员填写
        if (this.data.nodeid == 6 && this.data.index == 0) {
            this.setData({
                tableOperate2: "编辑",
            });
        }
        this._getData(
            "ProductionOrder/Read" + this.formatQueryStr({ TaskId: this.data.taskid }),
            res => {
                console.log(res);
                this.setData({
                    table: res,
                    purchaseList: res.ProductionOrderDetails,
                    "tableParam2.total": res.ProductionOrderDetails.length,
                });
            }
        );
    },
    addGood(e) {
        let value = e.detail.value;

        if (!value.ProductNumber.trim()) {
            dd.alert({
                content: `请填写已选信息！`,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        for (let i of this.data.purchaseList) {
            if (this.data.good.CodeNumber == i.CodeNumber) {
                i.ProductNumber = value.ProductNumber;
            }
        }
        this.setData({
            purchaseList: this.data.purchaseList,
        });
        this.onModalCloseTap();
    },
    submit(e) {
        if (this.data.nodeid == 6) {
            for (let i of this.data.purchaseList) {
                if (!i.ProductNumber) {
                    dd.alert({
                        content: "生产批次号不允许为空，请输入！",
                        buttonText: promptConf.promptConf.Confirm,
                    });
                    return;
                }
                this.data.table.ProductionOrderDetails = this.data.purchaseList;
                this._postData("ProductionOrder/Modify", res => {}, this.data.table);
            }
        }
        let that = this;
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark,
        };
        this.aggreSubmit(param);
    },
});
