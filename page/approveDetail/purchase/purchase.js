import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        hidden: true,
        totalPrice: "0",
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
        }
        return;
        this.aggreSubmit(param);
    },
    onReady() {
        console.log(this.data.tableData);
    },
});
