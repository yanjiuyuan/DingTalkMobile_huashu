import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        placeArr: [],
        planLength: 0,
        imgUrlList: [],
        locationLength: 0,
        table: {},
        rotate: "RotateToTheRight",
        show: "hidden",
        fileLists: [], // 相关文件数组
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark,
            ImageUrl: this.data.tableInfo["ImageUrl"],
        };
        if (
            this.data.nodeid == 2 &&
            this.data.tableInfo.ImageUrl.split(",").length < this.data.planLength
        ) {
            dd.alert({ content: "定位照片数小于计划外出地点数" });
            return;
        }
        if (this.data.nodeid == 2) {
            if (value.ContactPeople == "") {
                dd.alert({
                    content: "接触人员不允许为空，请输入！",
                    buttonText: promptConf.promptConf.Confirm,
                });
                return;
            }
            this.data.table.ContactPeople = value.ContactPeople;
            that._postData(
                "Evection/Modify",
                res => {
                    this.aggreSubmit(param);
                },
                this.data.table
            );
            return;
        }
        this.setData({ disablePage: true });
        this._postData(
            "Evection/Modify",
            res => {
                this.aggreSubmit(param);
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
    //添加定位
    addPlace() {
        let that = this;
        //上传图片
        dd.chooseImage({
            count: 1,
            sourceType: ["camera"],
            success: res => {
                for (let p of res.apFilePaths) {
                    that.setData({ disablePage: true });
                    dd.showLoading({
                        content: promptConf.promptConf.PictureProcessing,
                    });
                    dd.uploadFile({
                        url: that.data.dormainName + "drawingupload/Upload?IsWaterMark=true",
                        fileType: "image",
                        fileName: p.substring(7),
                        IsWaterMark: true,
                        filePath: p,
                        success: res => {
                            if (that.data.tableInfo["ImageUrl"])
                                that.data.tableInfo["ImageUrl"] += ",";
                            else that.data.tableInfo["ImageUrl"] = "";
                            if (
                                JSON.parse(res.data).Content == "null" ||
                                !JSON.parse(res.data).Content
                            ) {
                                dd.alert({
                                    content: promptConf.promptConf.PictureProcessingError,
                                    buttonText: promptConf.promptConf.Confirm,
                                });
                                return;
                            }
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
            fail: res => {
                if (res.error == "3") {
                    dd.alert({
                        content: "请在android的“设置-应用-权限”选项中，允许访问你的相机",
                        buttonText: promptConf.promptConf.Confirm,
                    });
                }
            },
        });
        return;
        dd.getLocation({
            success(res) {
                console.log(res);
                res = { address: "研究院" };
                that.data.placeArr.push(res.address);
                that.setData({
                    "table.LocationPlace": that.data.placeArr.join("-"),
                });
            },
            fail() {
                dd.alert({ title: "定位失败" });
            },
        });
    },
    addPlace2() {
        let that = this;
        //上传图片
        dd.chooseImage({
            count: 1,
            sourceType: ["album"],
            success: res => {
                for (let p of res.apFilePaths) {
                    that.setData({ disablePage: true });
                    dd.showLoading({
                        content: promptConf.promptConf.PictureProcessing,
                    });
                    dd.uploadFile({
                        url: that.data.dormainName + "drawingupload/Upload?IsWaterMark=true",
                        fileType: "image",
                        fileName: p.substring(7),
                        IsWaterMark: true,
                        filePath: p,
                        success: res => {
                            if (that.data.tableInfo["ImageUrl"])
                                that.data.tableInfo["ImageUrl"] += ",";
                            else that.data.tableInfo["ImageUrl"] = "";
                            if (
                                JSON.parse(res.data).Content == "null" ||
                                !JSON.parse(res.data).Content
                            ) {
                                dd.alert({
                                    content: promptConf.promptConf.PictureProcessingError,
                                    buttonText: promptConf.promptConf.Confirm,
                                });
                                return;
                            }
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
            fail: res => {
                if (res.error == "3") {
                    dd.alert({
                        content: "请在android的“设置-应用-权限”选项中，允许访问你的照片",
                        buttonText: promptConf.promptConf.Confirm,
                    });
                }
            },
        });
        return;
        dd.getLocation({
            success(res) {
                console.log(res);
                res = { address: "研究院" };
                that.data.placeArr.push(res.address);
                that.setData({
                    "table.LocationPlace": that.data.placeArr.join("-"),
                });
            },
            fail() {
                dd.alert({ title: "定位失败" });
            },
        });
    },

    onReady() {
        let that = this;
        this._getData("Evection/Read" + this.formatQueryStr({ TaskId: this.data.taskid }), res => {
            console.log(that.data.nodeList[1]);
            let ApplyTime = that.data.nodeList[1].ApplyTime || null;
            if (ApplyTime) {
                let dateTmp = res.EndTime.replace(/-/g, "/");
                let timestamp = Date.parse(dateTmp);
                let dateTmp2 = ApplyTime.replace(/-/g, "/");
                let timestamp2 = Date.parse(dateTmp2);

                console.log(timestamp2);
                console.log(timestamp);

                if (timestamp2 + 1800000 > timestamp) {
                    this.setData({
                        timeUp: true,
                    });
                }
            }
            this.setData({
                table: res,
            });
        });

        let param = {
            ApplyManId: this.data.DingData.userid,
            nodeId: this.data.nodeid,
            TaskId: this.data.taskid,
        };
        this._getData(
            "FlowInfoNew/GetApproveInfo" + this.formatQueryStr(param),
            function(res) {
                let fileLists = [];
                if (typeof res.MediaId === "string") {
                    let MediaId = res.MediaId.split(",");
                    let OldFileUrl = res.OldFileUrl.split(",");
                    for (let i = 0, len = OldFileUrl.length; i < len; i++) {
                        fileLists.push({
                            OldFileUrl: OldFileUrl[i],
                            MediaId: MediaId[i],
                        });
                    }
                }

                that.setData({
                    fileLists: fileLists,
                    tableInfo: res,
                });
                that.handleUrlData(res);
            },
            this.data.DingData
        );
    },
    //删除照片
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

    //删除图片
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

    // 展示和隐藏
    showOrClose() {
        if (this.data.rotate == "RotateToTheRight") {
            this.setData({
                rotate: "Rotate-downward",
                show: "show",
            });
        } else if (this.data.rotate == "Rotate-downward") {
            this.setData({
                rotate: "RotateToTheRight",
                show: "hidden",
            });
        }
    },

    ding() {
        //电脑接收
        dd.createDing({
            users: this.data.dingList, // 用户列表，工号
            type: 1, // 附件类型 1：image  2：link
            alertType: 2, // 钉发送方式 0:电话, 1:短信, 2:应用内
            text: "请帮我审批一下，审批编号为:" + this.data.taskid, // 正文
            success: function(res) {
                console.log(res);
            },
            fail: function(err) {
                console.log(err);
            },
        });
    },
});
