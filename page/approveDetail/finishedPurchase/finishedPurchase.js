import pub from "/util/public";
const app = getApp();
let good = {};
let items = [
    { prop: "CodeNo", label: "物料编码", width: 200 },
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
        prop: "SendPosition",
        label: "送货地点",
        width: 200,
    },
    {
        prop: "Mark",
        label: "备注",
        width: 300,
    },
];
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        hidden: true,
        totalPrice: "0",
        selectOperate: "选择采购员",
        tableOptions: [],
        tableItems: items,
        tableParam: {
            size: 885,
            now: 1,
            total: 0,
        },
        // tableItems2: [{prop: 'PurchaseMan',
        //     label: '采购员',
        //     width: 200},...items
        //     ],
        //data:[]
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark,
        };

        if (this.data.nodeid == "4") {
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
    //设置采购员
    setChooseMan() {
        let that = this;
        if (this.data.nodeid != 4) return;
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
    print() {
        this._postData(
            "PurchaseNew/PrintAndSend",
            function(res) {
                dd.alert({ content: "获取成功" });
            },
            {
                UserId: this.data.DingData.userid,
                TaskId: this.data.taskid,
            }
        );
    },
    output() {
        this._getData(
            "api/PurchaseManage" +
                this.formatQueryStr({
                    UserId: this.data.DingData.userid,
                    TaskId: this.data.taskid,
                }),
            function(res) {
                dd.alert({ content: "获取成功" });
            }
        );
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
                        if (this.data.nodeid == 4) {
                            for (let i of res) {
                                for (let j of options) {
                                    if (j.name == "杜双凤") {
                                        i["PurchaseMan"] = j.name;
                                        i["PurchaseManId"] = j.emplId;
                                        this.data.nodeList[6].AddPeople = [
                                            {
                                                name: j.name,
                                                uerid: j.emplId,
                                            },
                                        ];
                                    }
                                }
                            }
                        }

                        if (that.data.nodeid == 6 && that.data.index == 0) {
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
                            tableOptions: options,
                        });
                    }
                );
            }
        );
    },
});
