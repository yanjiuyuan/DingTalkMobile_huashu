import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
    },
    onReady() {},

    getFormData() {
        let that = this;
        let param = {
            ApplyManId: this.data.DingData.userid,
            nodeId: this.data.nodeid,
            TaskId: this.data.taskid,
        };
        this._getData(
            "FlowInfoNew/GetApproveInfo" + this.formatQueryStr(param),
            function(res) {
                let obj = JSON.parse(res.counts);
                obj.isPaper = obj.isPaper ? "纸质版" : "电子版";
                that.setData({
                    tableInfo: res,
                    table: obj,
                });
                that.handleUrlData(res);
            },
            this.data.DingData
        );
    },

    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark,
        };
        this.aggreSubmit(param);
    },
});
