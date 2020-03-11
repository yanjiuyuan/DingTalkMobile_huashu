import pub from "/util/public";
import promptConf from "/util/promptConf.js";

Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        tableParam2: {
            total: 0
        },
        tableItems2: [
            {
                prop: "GiftName",
                label: "礼品名称",
                width: 400
            },

            {
                prop: "GiftCount",
                label: "数量",
                width: 400
            }
        ]
    },
    onReady() {
        this._getData("Gift/GetTable" + this.formatQueryStr({ TaskId: this.data.taskid }), res => {
            console.log(res);
            this.setData({
                purchaseList: res,
                "tableParam2.total": res.length
            });
        });
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark
        };
        this.aggreSubmit(param);
    }
});
