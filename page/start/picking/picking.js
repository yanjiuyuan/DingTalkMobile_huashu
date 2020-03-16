import pub from "/util/public";
import promptConf from "/util/promptConf.js";
const app = getApp();
let good = {};
Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        hidden: true,
        tableOperate: "选择",
        purchaseList: [],
        tableOperate2: "删除",
        tableOperate3: "编辑",
        ifedit: false,
        tableParam2: {
            total: 0,
        },
        good: {},
        goods: [],
        totalPrice: 0,
        addPeopleNodes: [1], //额外添加审批人节点数组
        tableItems: [
            {
                prop: "fNumber",
                label: "物料编码",
                width: 200,
            },
            {
                prop: "fName",
                label: "物料名称",
                width: 300,
            },
            {
                prop: "fCommitQty",
                label: "库存数量",
                width: 200,
            },
            {
                prop: "fModel",
                label: "规格型号",
                width: 300,
            },
            {
                prop: "unitName",
                label: "单位",
                width: 100,
            },
            {
                prop: "fFullName",
                label: "供应商",
                width: 300,
            },
        ],
        tableItems2: [
            {
                prop: "fNumber",
                label: "物料编码",
                width: 200,
            },
            {
                prop: "fQty",
                label: "实收数量",
                width: 200,
            },
            {
                prop: "fCommitQty",
                label: "库存数量",
                width: 200,
            },
            {
                prop: "fName",
                label: "物料名称",
                width: 300,
            },
            {
                prop: "fModel",
                label: "规格型号",
                width: 300,
            },
            {
                prop: "unitName",
                label: "单位",
                width: 100,
            },
            {
                prop: "fFullName",
                label: "供应商",
                width: 300,
            },
        ],

        //data:[]
    },
    //表单操作相关
    search(e) {
        let that = this;
        if (!e.detail.value.keyWord) {
            dd.alert({
                content: promptConf.promptConf.SearchNoInput,
                buttonText: promptConf.promptConf.Confirm,
            });
        } else {
            dd.showLoading({
                content: promptConf.promptConf.Obtaining,
            });
        }
        let value = e.detail.value;
        console.log(value.keyWord);
        if (!value || !value.keyWord) return;
        let url =
            this.data.jinDomarn +
            "Pick/ReadPickInfoSingle" +
            this.formatQueryStr({ keyWord: value.keyWord });
        dd.httpRequest({
            url: url,
            method: "GET",
            success: function(res) {
                dd.hideLoading();
                console.log(url);
                console.log(res.data.data);
                let data = res.data.data;
                if (data.length == 0) {
                    dd.alert({
                        content: promptConf.promptConf.SearchNoReturn,
                        buttonText: promptConf.promptConf.Confirm,
                    });
                    return;
                }
                that.setData({
                    "tableParam.total": data.length,
                    "tableParam.now": 1,
                });
                that.data.data = data;
                that.getData();
            },
        });
    },
    searchAndAdd2(e) {
        if (!e.detail.value.keyWord) {
            dd.alert({
                content: promptConf.promptConf.SearchNoSerialNumber,
                buttonText: promptConf.promptConf.Confirm,
            });
        }
        let value = e.detail.value;

        console.log(value.keyWord);
        if (!value || !value.keyWord) return;
        let that = this;

        this._getData(
            "Pick/ReadDefault" +
                this.formatQueryStr({
                    ApplyManId: that.data.DingData.userid,
                    TaskId: value.keyWord,
                }),
            function(res) {
                dd.hideLoading();
                let addArr = [];
                let length = that.data.purchaseList.length;
                if (res.length == 0) {
                    dd.alert({
                        content: promptConf.promptConf.SearchNoReturn,
                        buttonText: promptConf.promptConf.Confirm,
                    });
                }
                for (let d of res) {
                    let ifBreak = false;
                    for (let p of that.data.purchaseList) {
                        if (d.fNumber == p.fNumber) ifBreak = true;
                    }
                    if (ifBreak) break;
                    that.data.goods.push(d);
                    addArr.push(d);
                }
                for (let i = 0; i < addArr.length; i++) {
                    that.setData({
                        [`purchaseList[${length + i}]`]: addArr[i],
                    });
                }
                that.setData({
                    "tableParam2.total": res.length,
                });
            }
        );
    },
    searchAndAdd(e) {
        if (!e.detail.value.keyWord) {
            dd.showToast({
                content: promptConf.promptConf.SearchNoSerialNumber,
            });
        } else {
            dd.showLoading({
                content: promptConf.promptConf.Obtaining,
            });
        }
        let value = e.detail.value;
        console.log(value.keyWord);
        if (!value || !value.keyWord) return;
        let that = this;
        let url =
            this.data.jinDomarn +
            "Pick/ReadPickingInfo" +
            that.formatQueryStr({ UnitName: value.keyWord });
        dd.httpRequest({
            url: url,
            method: "GET",
            success: function(res) {
                dd.hideLoading();
                console.log(url);
                console.log(res.data.data);
                if (res.data.data.length == 0) {
                    dd.alert({
                        content: promptConf.promptConf.SearchNoReturn,
                        buttonText: promptConf.promptConf.Confirm,
                    });
                }
                let addArr = [];
                let length = that.data.purchaseList.length;
                for (let d of res.data.data) {
                    let ifBreak = false;
                    for (let p of that.data.purchaseList) {
                        if (d.fNumber == p.fNumber) ifBreak = true;
                    }
                    if (ifBreak) break;
                    that.data.goods.push(d);
                    addArr.push(d);
                }
                for (let i = 0; i < addArr.length; i++) {
                    that.setData({
                        [`purchaseList[${length + i}]`]: addArr[i],
                    });
                }
            },
            fail: function(res) {
                dd.alert({ content: JSON.stringify(res) });
            },
        });
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
        if (this.data.projectIndex < 0 || !value.title) {
            console.log(value);
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
            return;
        }
        if (this.data.purchaseList.length == 0) {
            dd.alert({
                content: `请选择物料!`,
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
        this.approvalSubmit(param, callBack, {
            ProjectId: param.ProjectId,
        });
    },
    bindAll(taskId) {
        let that = this;
        let paramArr = [];
        for (let p of that.data.purchaseList) {
            p.TaskId = taskId;
            paramArr.push(p);
        }
        that._postData(
            "Pick/Save",
            function(res) {
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
        //默认方法，删除选项
        if (!e.target.targetDataset.opt2) {
            let length = this.data.purchaseList.length;
            this.data.purchaseList.splice(index, 1);
            this.setData({
                [`tableParam2.total`]: length - 1,
                purchaseList: this.data.purchaseList,
                goods: this.data.purchaseList,
            });
            console.log(this.data.purchaseList);
        }
        //第二方法，编辑选项
        else {
            good = e.target.targetDataset.row;
            if (!good) return;
            this.setData({
                hidden: !this.data.hidden,
                ifedit: true,
            });
            this.createMaskShowAnim();
            this.createContentShowAnim();
        }
    },
    //提交弹窗表单
    addGood(e) {
        let value = e.detail.value;

        let reg3 = /^[\.\d]*$/; //纯数字包括小数

        if (!reg3.test(value.fQty)) {
            dd.alert({
                content: `数量必须为整数，请重新输入！`,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (value.fQty == 0) {
            dd.alert({
                content: `数量不允许为0，请重新输入！`,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (!value || !value.fQty) {
            dd.alert({
                content: `数量不允许为空，请输入！`,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        //编辑
        if (this.data.ifedit) {
            for (let i = 0; i < this.data.purchaseList.length; i++) {
                //数量判断
                for (let g of this.data.goods) {
                    if (
                        good.fNumber == g.fNumber &&
                        parseInt(value.fQty) > parseInt(g.fCommitQty)
                    ) {
                        dd.alert({
                            content: promptConf.promptConf.GreaterThanAvailable,
                            buttonText: promptConf.promptConf.Confirm,
                        });
                        return;
                    }
                }

                if (this.data.purchaseList[i].fNumber == good.fNumber) {
                    good.fQty = value.fQty ? value.fQty + "" : "1";
                    good.fAmount = parseInt(good.fQty) * parseInt(good.fPrice);
                    this.setData({
                        [`purchaseList[${i}]`]: good,
                    });
                }
            }
        }
        // 添加
        else {
            for (let p of this.data.purchaseList) {
                if (p.fNumber == good.fNumber) {
                    dd.alert({
                        content: promptConf.promptConf.Repeat,
                        buttonText: promptConf.promptConf.Confirm,
                    });
                    return;
                }
            }

            //数量判断
            if (value.fQty > good.fCommitQty) {
                dd.alert({
                    content: promptConf.promptConf.GreaterThanAvailable,
                    buttonText: promptConf.promptConf.Confirm,
                });
                return;
            }
            let param = {
                fNumber: good.fNumber,
                fName: good.fName,
                fModel: good.fModel,
                unitName: good.unitName,
                fCommitQty: good.fCommitQty,
                fQty: value.fQty ? value.fQty + "" : "1",
                fPrice: good.fPrice ? good.fPrice + "" : "0",
                fAmount: parseInt(value.fQty) * parseInt(good.fPrice),
                fFullName: good.fFullName,
            };
            let length = this.data.purchaseList.length;
            let setStr = "purchaseList[" + length + "]";
            this.setData({
                [`tableParam2.total`]: length + 1,
                [`purchaseList[${length}]`]: param,
                [`goods[${length}]`]: param,
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
                hidden: true,
            });
        }, 210);
    },

    onReady() {
        let that = this;
        app.globalData.valid = true;
        if (app.globalData.valid == true) {
            for (let i of this.data.purchaseList) {
                let url =
                    this.data.jinDomarn +
                    "Pick/ReadPickInfoSingle" +
                    this.formatQueryStr({ keyWord: i.fNumber });
                dd.httpRequest({
                    url: url,
                    method: "GET",
                    success: function(res) {
                        let data = res.data.data;
                        i.fCommitQty = res.data.data[0].fQty;
                        that.setData({
                            purchaseList: that.data.purchaseList,
                        });
                    },
                });
            }

            this.setData({
                tableItems2: [
                    {
                        prop: "fNumber",
                        label: "物料编码",
                        width: 200,
                    },
                    {
                        prop: "fQty",
                        label: "实收数量",
                        width: 200,
                    },
                    {
                        prop: "fCommitQty",
                        label: "库存数量",
                        width: 200,
                    },
                    {
                        prop: "fName",
                        label: "物料名称",
                        width: 300,
                    },
                    {
                        prop: "fModel",
                        label: "规格型号",
                        width: 300,
                    },
                    {
                        prop: "unitName",
                        label: "单位",
                        width: 100,
                    },
                    {
                        prop: "fFullName",
                        label: "供应商",
                        width: 300,
                    },
                ],
                goods: this.data.purchaseList,
            });
            app.globalData.valid = false;
        }
    },
});
