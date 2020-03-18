import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.data,
    ...pub.func,
    data: {
        tableParam: {
            total: 0,
        },
        selectOperate: "进度",
        flowNameList: ["生产指令单", "生产预投单", "小批量试制预投报告"],
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
        let rowIndex = e.target.dataset.index;
        let row = this.data.tableData[rowIndex];
        row.index = selectIndex;
        row.Progress = this.data.tableOptions[selectIndex].name;
        this.setData({
            [`tableData[${rowIndex}]`]: row,
        });
    },
    onReady() {
        this.getTableData();
    },
    getTableData(flowName, progress) {
        let obj = {};
        if (flowName) obj.flowName = flowName;
        if (progress) obj.progress = progress;
        this._getData("ProductionOrder/Query" + this.formatQueryStr(obj), res => {
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
            });
        });
    },

    search() {
        let flowName = this.data.flowNameList[this.data.flowIndex] || "";
        let progress = this.data.tableOptions[this.data.processIndex].name || "";
    },
});
