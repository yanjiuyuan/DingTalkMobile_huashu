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
            total: 0,
        },
        tableOperate2: "删除",
        tableOperate3: "编辑",
        ifedit: false,
        good: {},
        goods: [],
        searchShow: true,
        addPeopleNodes: [2], //额外添加审批人节点数组
        totalPrice: 0,
        tableItems: [
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
    },
    //表单操作相关
    search(e) {
        let value = e.detail.value;
        console.log(value.keyWord);
        if (!value || !value.keyWord) {
            dd.alert({
                content: promptConf.promptConf.SearchNoInput,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        let that = this;
        dd.showLoading({
            content: promptConf.promptConf.Obtaining,
        });
        let url =
            this.data.jinDomarn +
            "Godown/ReadGodownInfoSingle" +
            that.formatQueryStr({ keyWord: value.keyWord });
        dd.httpRequest({
            url: url,
            method: "GET",
            success: function(res) {
                dd.hideLoading();
                if (res.data.data.length == 0) {
                    dd.alert({
                        content: promptConf.promptConf.SearchNoReturn,
                        buttonText: promptConf.promptConf.Confirm,
                    });
                    return;
                }
                that.setData({
                    "tableParam.total": res.data.data.length,
                    "tableParam.now": 1,
                });
                that.data.data = res.data.data;
                that.getData();
            },
            fail: function(res) {
                dd.alert({ content: JSON.stringify(res) });
            },
        });
    },
    searchByNo(e) {
        let value = e.detail.value;
        if (!value || !value.no) {
            dd.alert({
                content: promptConf.promptConf.SearchNoPurchaseNumber,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        let that = this;
        dd.showLoading({
            content: promptConf.promptConf.Obtaining,
        });
        let url =
            this.data.jinDomarn +
            "Godown/GetGodownInfoByFBillNo" +
            that.formatQueryStr({ FBillNo: value.no });
        dd.httpRequest({
            url: url,
            method: "GET",
            success: function(res) {
                console.log(res.data.data);
                dd.hideLoading();
                if (res.data.data.length == 0) {
                    dd.alert({
                        content: promptConf.promptConf.SearchNoReturn,
                        buttonText: promptConf.promptConf.Confirm,
                    });
                    that.setData({
                        "tableParam2.total": 0,
                    });
                }

                let goods = [];
                goods.push(...res.data.data);
                let purchaseList = [];
                purchaseList.push(...res.data.data);
                that.setData({
                    "tableParam2.total": that.data.tableParam2.total + res.data.data.length,
                    goods: goods,
                    purchaseList: purchaseList,
                });
            },
            fail: function(res) {
                dd.alert({ content: JSON.stringify(res) });
            },
        });
    },
    searchAndAdd(e) {
        dd.showLoading({
            content: promptConf.promptConf.Obtaining,
        });
        let value = e.detail.value;
        console.log(value.keyWord);
        if (!value || !value.keyWord) return;
        let that = this;
        let url =
            this.data.jinDomarn +
            "Godown/ReadGodownInfo" +
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
                        buttonText: promptConf.promptConf.CONFIRE,
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
                    console.log("我会执行");
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
        let arr = [];
        console.log(this.data.purchaseList);
        let that = this;
        let value = e.detail.value;

        if (that.data.projectList[that.data.projectIndex] == undefined) {
            dd.alert({
                content: "项目名称不能为空，请输入！",
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

        if (this.data.purchaseList.length == 0) {
            dd.alert({
                content: "请选择物料",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }

        for (let p of this.data.purchaseList) {
            arr.push(p.fFullName);
        }
        let set = new Set(arr);

        let param = {
            Title: value.title,
            Remark: value.remark,
            ProjectName: that.data.projectList[that.data.projectIndex].ProjectName,
            ProjectId: that.data.projectList[that.data.projectIndex].ProjectId,
        };
        let callBack = function(taskId) {
            console.log("提交审批ok!");
            that.bindAll(taskId);
        };
        console.log(param);
        this.approvalSubmit(param, callBack);
    },
    bindAll(taskId) {
        let that = this;
        let paramArr = [];
        for (let p of that.data.purchaseList) {
            p.TaskId = taskId;
            paramArr.push(p);
        }
        that._postData(
            "Godown/Save",
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
        console.log(good);
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

        console.log(good);

        let reg = /^-?\d+$/;
        if (!reg.test(value.fQty)) {
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
                    if (good.fNumber == g.fNumber && value.fQty > g.fQty) {
                        dd.alert({
                            content: promptConf.promptConf.GreaterThanAvailable,
                            buttonText: promptConf.promptConf.Confirm,
                        });
                        return;
                    }
                }

                if (this.data.purchaseList[i].fNumber == good.fNumber) {
                    good.fQty = value.fQty ? value.fQty + "" : "1";
                    this.setData({
                        [`purchaseList[${i}]`]: good,
                    });
                    break;
                }
            }
        }
        //添加
        else {
            console.log("添加");
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
            if (value.fQty > good.fQty) {
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
                fQty: value.fQty,
                unitName: good.unitName,
                fPrice: good.fPrice ? good.fPrice + "" : "0",
                fAmount: good.fPrice * value.fQty,
                // fAmount: good.fPrice ? good.fAmount + "" : "0",
                fFullName: good.fFullName,
            };

            this.data.goods.push(good);

            let length = this.data.purchaseList.length;
            let setStr = "purchaseList[" + length + "]";
            this.setData({
                [`tableParam2.total`]: length + 1,
                [`purchaseList[${length}]`]: param,
            });
            //数量判断
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
    radioChange(e) {
        console.log("radioChange");
        this.setData({
            searchShow: !this.data.searchShow,
            purchaseList: [],
            tableParam2: {
                total: 0,
            },
        });
    },
});
