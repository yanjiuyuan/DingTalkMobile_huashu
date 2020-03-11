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
                prop: "fQty",
                label: "实收数量",
                width: 200
            },
            {
                prop: "fAmount",
                label: "金额",
                width: 200
            },
            {
                prop: "fFullName",
                label: "供应商",
                width: 300
            }
        ]
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark
        };
        console.log(e);
        this.aggreSubmit(param);
    }
});
