import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        useTimeList: [],
        imgUrlList: [],
        table: {},
    },
    uploadImg(e) {
        let that = this;
        dd.chooseImage({
            count: 2,
            success: res => {
                dd.compressImage({
                    filePaths: res.apFilePaths,
                    compressLevel: 2,
                    success: res => {
                        for (let p of res.apFilePaths) {
                            that.setData({ disablePage: true });
                            dd.showLoading({
                                content: promptConf.promptConf.PictureProcessing,
                            });
                            dd.uploadFile({
                                url: that.data.dormainName + "drawingupload/Upload",
                                fileType: "image",
                                fileName: p.substring(7),
                                IsWaterMark: true,
                                filePath: p,
                                success: res => {
                                    console.log(res);
                                    if (that.data.tableInfo["ImageUrl"])
                                        that.data.tableInfo["ImageUrl"] += ",";
                                    else that.data.tableInfo["ImageUrl"] = "";
                                    that.data.tableInfo["ImageUrl"] += JSON.parse(res.data).Content;
                                    that._postData(
                                        "FlowInfoNew/TaskModify",
                                        res => {
                                            that.getFormData();
                                            that.setData({ disablePage: false });
                                            dd.hideLoading();
                                        },
                                        that.data.tableInfo
                                    );
                                },
                                fail: err => {
                                    dd.alert({ content: "sorry" + JSON.stringify(err) });
                                },
                            });
                        }
                    },
                });
            },
        });
    },
    deleteImg() {
        this.data.imgUrlList = this.data.tableInfo.ImageUrl.split(",");
        this.setData({
            imageList: this.data.imageList.splice(0, this.data.imageList.length - 1),
        });
        //
        this.data.tableInfo["ImageUrl"] = this.data.imgUrlList
            .slice(0, this.data.imgUrlList.length - 1)
            .join(",");
        this._postData("FlowInfoNew/TaskModify", res => {}, this.data.tableInfo);
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        if (
            (!value.StartKilometres || !value.EndKilometres) &&
            (this.data.nodeid == 3 || this.data.nodeid == 4)
        ) {
            dd.alert({
                content: "表单未填写完整",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (this.data.nodeid == 3 && this.data.imageList.length < 2) {
            console.log(this.data.imageList);
            dd.alert({
                content: promptConf.promptConf.NoPicture,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        let param = {
            Title: value.title,
            Remark: value.remark,
        };
        this.data.table["FactTravelWay"] = value.FactTravelWay;
        this.data.table["StartKilometres"] = value.StartKilometres;
        this.data.table["EndKilometres"] = value.EndKilometres;
        this.data.table["UseKilometres"] =
            parseInt(value.EndKilometres) - parseInt(value.StartKilometres);
        this.setData({ disablePage: true });
        this._postData(
            "CarTableNew/TableModify",
            res => {
                that.aggreSubmit(param);
            },
            this.data.table
        );
    },

    reApproval() {
        this.data.localStorage = JSON.stringify({
            valid: true,
            flowid: this.data.flowid,
            title: this.data.tableInfo.Title,
            table: this.data.table,
        });
        for (let m of this.data.menu) {
            if (m.flowId == this.data.flowid) {
                dd.redirectTo({
                    url: "/page/start/" + m.url + "?flowid=" + m.flowId,
                });
            }
        }
    },
    onReady() {
        this._getData(
            "CarTableNew/TableQuary" + this.formatQueryStr({ TaskId: this.data.taskid }),
            res => {
                let data = res[0];
                if (!data.FactTravelWay) data.FactTravelWay = data.PlantTravelWay;
                if (!data.PeerNumber) data.PeerNumber = "";
                this.setData({
                    table: data,
                });
            }
        );
    },
    deletePhoto(e) {
        my.confirm({
            title: "温馨提示",
            content: promptConf.promptConf.DeletePicture,
            confirmButtonText: promptConf.promptConf.Confirm,
            cancelButtonText: promptConf.promptConf.Cancel,
            success: result => {
                if (result.confirm == true) {
                    let index = e.currentTarget.dataset.index;
                    this.data.imageList.splice(index, 1);
                    this.setData({
                        imageList: this.data.imageList,
                    });
                    this.data.imgUrlList = this.data.tableInfo.ImageUrl.split(",");
                    this.data.imgUrlList.splice(index, 1);
                    this.data.tableInfo["ImageUrl"] = this.data.imgUrlList.join(",");
                    this._postData("FlowInfoNew/TaskModify", res => {}, this.data.tableInfo);
                }
            },
        });
    },
    startKilometres(e) {
        console.log(e.detail.value);
        let value = e.detail.value;
        if (this.data.table.EndKilometres != null) {
            this.setData({
                ["table.UseKilometres"]: (this.data.table.EndKilometres - value).toFixed(1),
            });
        }
        this.setData({
            ["table.StartKilometres"]: value,
        });
    },
    endKilometres(e) {
        console.log(e.detail.value);
        console.log(this.data.table.StartKilometres);

        let value = e.detail.value;
        if (this.data.table.StartKilometres != null) {
            this.setData({
                ["table.UseKilometres"]: (value - this.data.table.StartKilometres).toFixed(1),
            });
        }
        this.setData({
            ["table.EndKilometres"]: value,
        });
    },
});
