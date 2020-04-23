import pub from "/util/public";
import promptConf from "/util/promptConf.js";
let good = {};
Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        isPaper: true,
        isEdit: false,
        arr: [
            { name: "纸质版", checked: true, label: true },
            { name: "电子版", checked: false, label: false },
        ],
        arr2: [
            { name: "是", checked: false, label: true },
            { name: "否", checked: true, label: false },
        ],
    },
    radioChange(e) {
        this.data.arr;
        for (let i of this.data.arr) {
            i.checked = e.detail.value == i.label ? true : false;
        }
        this.setData({
            isPaper: e.detail.value,
        });
    },
    radioChangeOne(e) {
        for (let i of this.data.arr2) {
            i.checked = e.detail.value == i.label ? true : false;
        }
        this.setData({
            isEdit: e.detail.value,
        });
    },

    selectStartDateTime() {
        dd.datePicker({
            format: "yyyy-MM-dd",
            currentDate: this.data.DateStr,
            startDate: this.data.DateStr,
            endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day,
            success: res => {
                this.setData({
                    "table.ReceivingTime": res.date,
                });
            },
        });
    },

    submit(e) {
        let that = this;
        let value = e.detail.value;
        console.log(e.detail.value);
        if (value.content.trim() == "") {
            dd.alert({
                content: "借阅内容不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (value.contentPurpose.trim() == "") {
            dd.alert({
                content: "借阅用途不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (value.hasOwnProperty("ReceivingTime") && value.ReceivingTime == "") {
            dd.alert({
                content: "归还时间不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        let obj = {
            content: value.content,
            contentPurpose: value.contentPurpose,
            ReceivingTime: value.ReceivingTime ? value.ReceivingTime : "",
            isPaper: this.data.isPaper,
            isEdit: this.data.isEdit ? "是" : "否",
        };
        let param = {
            Title: value.title,
            Remark: value.remark,
            counts: JSON.stringify(obj),
        };
        let callBack = function(taskId) {
            that.bindAll(taskId);
        };
        console.log(param);
        this.approvalSubmit(param, callBack);
    },
    bindAll(taskId) {
        this.doneSubmit();
    },
});
