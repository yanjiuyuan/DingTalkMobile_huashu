import pub from "/util/public";
import promptConf from "/util/promptConf.js";
const app = getApp();
Page({
    ...pub.data,
    ...pub.func,
    data: {
        tableParam: {
            total: 0,
            now: 1,
            size: 5,
        },

        tableParam2: {
            total: 0,
        },
        tableOperate: "详情",
        flowNameList: ["生产指令单", "生产预投单", "试制预投报告"],
        tableOptions: [
            {
                name: "排单",
            },
            {
                name: "生产",
            },
            {
                name: "检验",
            },
            {
                name: "入库",
            },
        ],
        tableItems: [
            {
                prop: "TaskId",
                label: "流水号",
                width: 200,
            },
            {
                prop: "FlowName",
                label: "流程类型",
                width: 300,
            },
            {
                prop: "ApplyMan",
                label: "申请人",
                width: 300,
            },
            // {
            //     prop: "Progress",
            //     label: "进度",
            //     width: 100,
            // },
        ],

        tableItems2: [
            {
                prop: "ProductNumber",
                label: "批次号",
                width: 200,
            },
            {
                prop: "CodeNumber",
                label: "物料编码",
                width: 300,
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
                width: 300,
            },
            {
                prop: "Date",
                label: "预计交货日期",
                width: 200,
            },
        ],
    },
    bindObjPickerChangeOne(e) {
        this.setData({
            flowIndex: e.detail.value,
        });
    },
    bindObjPickerChangeTwo(e) {
        this.setData({
            processIndex: e.detail.value,
        });
    },
    //下拉框选择后回调
    tableSelect(e) {
        let selectIndex = e.detail.value;
        console.log(e.target.dataset.index);
        let rowIndex = e.target.dataset.index + (this.data.tableParam.now - 1) * 5;
        let row = this.data.tableData[rowIndex];
        row.index = selectIndex;
        row.Progress = this.data.tableOptions[selectIndex].name;
        this._postData(
            "ProductionOrder/Modify",
            res => {
                dd.alert({
                    content: promptConf.promptConf.UpdateSuccess,
                    buttonText: promptConf.promptConf.Confirm,
                });
            },
            row
        );
        this.setData({
            [`tableData[${rowIndex}]`]: row,
        });
    },

    onShow() {
        this.data.tableItems = [
            {
                prop: "TaskId",
                label: "流水号",
                width: 200,
            },
            {
                prop: "FlowName",
                label: "流程类型",
                width: 300,
            },
            {
                prop: "ApplyMan",
                label: "申请人",
                width: 300,
            },
        ];
    },
    onReady() {
        let that = this;
        this.getTableData();
        this.getDataReturnData(
            "Role/GetRoleInfo" + that.formatQueryStr({ RoleName: "生产下单管理员" }),
            res => {
                console.log(res.data);
                let flag = false;
                for (let i of res.data) {
                    if (i.emplId == app.userInfo.userid) {
                        flag = true;
                        that.setData({
                            selectOperate: "进度",
                        });
                    }
                }

                if (flag == false) {
                    this.data.tableItems.splice(0, 0, {
                        prop: "Progress",
                        label: "进度",
                        width: 200,
                    });
                    this.setData({
                        tableItems: this.data.tableItems,
                    });
                }
            }
        );
    },
    getTableData(flowName, progress) {
        let obj = {};
        if (flowName) obj.flowName = flowName;
        if (progress) obj.progress = progress;
        this._getData("ProductionOrder/Query" + this.formatQueryStr(obj), res => {
            if (res.length == 0) {
                dd.alert({
                    content: promptConf.promptConf.SearchNoReturn,
                    buttonText: promptConf.promptConf.Confirm,
                });
                return;
            }
            for (let i of res) {
                if (i.Progress == "排单") {
                    i.index = 0;
                } else if (i.Progress == "生产") {
                    i.index = 1;
                } else if (i.Progress == "检验") {
                    i.index = 2;
                } else if (i.Progress == "入库") {
                    i.index = 3;
                } else {
                    i.index = -1;
                }
            }
            this.setData({
                tableData: res,
                "tableParam.total": res.length,
                "tableParam.now": 1,
                tableData2: [],
                "tableParam2.total": 0,
            });
            this.data.data = res;
            this.getData();
        });
    },
    //搜索
    search() {
        let flowName = this.data.flowNameList[this.data.flowIndex] || "";
        let progress =
            this.data.processIndex >= 0 ? this.data.tableOptions[this.data.processIndex].name : "";
        this.getTableData(flowName, progress);
    },

    chooseItem(e) {
        console.log(e);
        if (!e.target.targetDataset.row) return;
        this.setData({
            tableData2: e.target.targetDataset.row.ProductionOrderDetails,
            "tableParam2.total": e.target.targetDataset.row.ProductionOrderDetails.length,
        });
    },
});
