import pub from "/util/public";
import promptConf from "/util/promptConf.js";
const app = getApp();
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        hidden: true,
        totalPrice: "0",
        selectOperate: "选择采购员",
        tableOptions: [],
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
                label: "单价(预计)",
                width: 200,
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
                prop: "Mark",
                label: "备注",
                width: 300,
            },
        ],
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark,
        };
        if (this.data.nodeid == 5) {
            this._postData(
                "Purchase/ModifyPurchaseTable",
                res => {
                    that.aggreSubmit(param);
                },
                this.data.tableData
            );
            return;
        }
        this.aggreSubmit(param);
    },

    onShow() {
        let obj = {
            prop: "PurchaseMan",
            label: "采购员",
            width: 200,
        };

        if (
            this.data.nodeid > 5 &&
            JSON.stringify(this.data.tableItems2).indexOf(JSON.stringify(obj)) == -1
        ) {
            this.data.tableItems2.push(obj);
            this.setData({
                tableItems2: this.data.tableItems2,
            });
        }
    },
    setChooseMan() {
        let that = this;
        if (this.data.nodeid != 5) return;
        let mans = [];
        for (let d of this.data.tableData) {
            let opt = this.data.tableOptions[d.index];
            d.PurchaseMan = opt.name;
            d.PurchaseManId = opt.emplId;
            mans.push({
                name: opt.name,
                userId: opt.emplId,
            });
        }
        let hash = {};
        console.log(mans);
        mans = mans.reduce((preVal, curVal) => {
            hash[curVal.userId] ? "" : (hash[curVal.userId] = true && preVal.push(curVal));
            return preVal;
        }, []);
        let nodeId = parseInt(this.data.nodeid) + 2;
        let nodeList = this.data.nodeList;
        console.log(mans);
        for (let i = 0; i < nodeList.length; i++) {
            if (nodeList[i].NodeId == nodeId) {
                nodeList[i].AddPeople = mans;
                this.setData({
                    [`nodeList[${i}]`]: nodeList[i],
                });
            }
        }
    },
    //下拉框选择后回调
    tableSelect(e) {
        console.log("//下拉框选择后回调");
        let selectIndex = e.detail.value;
        let rowIndex = e.target.dataset.index;
        let row = this.data.tableData[rowIndex];
        row.index = selectIndex;
        this.setData({
            [`tableData[${rowIndex}]`]: row,
        });
        this.setChooseMan();
    },
    onReady() {
        let that = this;
        this.getDataReturnData(
            "Role/GetRoleInfo" + that.formatQueryStr({ RoleName: "采购员" }),
            data => {
                console.log(data.data);
                let options = data.data;
                that._getData(
                    "/PurchaseNew/ReadPurchaseTable" +
                        that.formatQueryStr({ TaskId: this.data.taskid }),
                    res => {
                        if (this.data.nodeid == 5) {
                            for (let i of res) {
                                i.index = 0;
                                for (let j of options) {
                                    if (j.name == "巫仕座") {
                                        i["PurchaseMan"] = j.name;
                                        i["PurchaseManId"] = j.emplId;
                                        this.data.nodeList[7].AddPeople = [
                                            {
                                                name: j.name,
                                                uerid: j.emplId,
                                            },
                                        ];
                                    }
                                }
                            }
                        }

                        if (that.data.nodeid == 7 && that.data.index == 0) {
                            let tmp = [];
                            for (let d of res) {
                                if (d.PurchaseManId == app.userInfo.userid) {
                                    tmp.push(d);
                                }
                            }
                            res = tmp;
                        }
                        that.setData({
                            nodeList: that.data.nodeList,
                            tableData: res,
                            "tableParam.total": res.length,
                            tableOptions: options,
                        });
                        that.data.data = res;
                        that.getData();
                    }
                );
            }
        );
    },
});
