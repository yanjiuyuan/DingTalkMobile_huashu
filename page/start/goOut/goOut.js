import pub from "/util/public";
import promptConf from "/util/promptConf.js";
let good = {};
const app = getApp();
Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        placeArr: [],
        disablePage: false
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        console.log(value);
        console.log(this.data.nodeList);
        if (!value.BeginTime || !value.EndTime || !value.Content || !value.Duration) {
            dd.alert({
                content: "表单未填写完整",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.title.trim() == "") {
            dd.alert({
                content: `标题不能为空，请输入!`,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        value["LocationPlace"] = "";
        value["Place"] = this.data.table.Place;
        value["EvectionMan"] = this.data.table.EvectionMan;
        value["EvectionManId"] = this.data.table.EvectionManId;
        value["Content"] = value.Content.replace(/\s+/g, "");

        console.log(value);
        if (!value.Place || !value.BeginTime || !value.EndTime || !value.Content || !value.Duration) {
            dd.alert({
                content: "表单未填写完整",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (
            this.data.nodeList[1].AddPeople.length > 0 &&
            this.data.nodeList[1].AddPeople[0].userId == this.data.nodeList[0].AddPeople[0].userId
        ) {
            dd.alert({
                content: promptConf.promptConf.NoChooseYourself,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }

        let callBack = function(taskId) {
            console.log("提交审批ok!");
            value.TaskId = taskId;
            that._postData(
                "Evection/Save",
                res => {
                    that.doneSubmit();
                },
                value
            );
        };
        this.approvalSubmit(value, callBack, {
            Title: value.Title
        });
    },

    //显示外出地点输入框
    showInput() {
        this.setData({
            hidden: !this.data.hidden
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },

    //添加，输入外出地点
    addPlace(e) {
        let value = e.detail.value;
        console.log(value);
        if (!value || !value.place.trim()) {
            dd.alert({
                content: `请输入外出地点!`,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        this.data.placeArr.push(value.place.trim());
        console.log(this.data.placeArr);
        this.setData({
            "table.Place": this.data.placeArr.join(",")
        });
        this.onModalCloseTap();
    },
    //加载重新发起数据
    loadReApproval() {
        let localStorage = this.data.localStorage;
        if (!localStorage || !localStorage.valid) return;
        localStorage.valid = false;
        this.setData({
            table: localStorage.table,
            "tableInfo.Title": localStorage.title,
            flowid: localStorage.flowid,
            localStorage: localStorage
        });
    },
    //上传文件方法
    upLoadFile(e) {
        console.log(e);
        dd.uploadFile({
            url: "/drawingupload/UploadAndGetInfo",
            fileType: "image",
            fileName: "file",
            filePath: "...",
            success: res => {
                dd.alert({
                    content: "上传成功",
                    buttonText: promptConf.promptConf.Confirm
                });
            }
        });
    },
    //删除一个外出地点
    removePlace() {
        this.data.placeArr.pop();
        this.setData({
            "table.Place": this.data.placeArr.join("-")
        });
    },

    //选人控件方法
    choosePeoples(e) {
        console.log("start choose people");
        let nodeId = e.target.targetDataset.NodeId;
        let that = this;
        dd.complexChoose({
            ...that.data.chooseParam,
            pickedUsers: that.data.pickedUsers || [], //已选用户
            multiple: true,
            title: "同行人",
            success: function(res) {
                console.log(res);
                let names = []; //userId
                let userids = [];
                if (res.departments.length == 0 && res.users.length > 0) {
                    that.data.pickedUsers = [];
                    for (let d of res.users) {
                        that.data.pickedUsers.push(d.userId);
                        names.push(d.name);
                        userids.push(d.userId);
                    }
                    that.setData({
                        "table.EvectionMan": names.join(","),
                        "table.EvectionManId": userids.join(",")
                    });
                } else if (res.departments.length > 0 && res.users.length == 0) {
                    let deptId = [];
                    for (let i of res.departments) {
                        deptId.push(i.id);
                    }

                    that.postDataReturnData(
                        "DingTalkServers/GetDeptAndChildUserListByDeptId",
                        result => {
                            console.log(result.data);
                            that.data.pickedUsers = [];
                            that.data.pickedDepartments = [];
                            let userlist = [];
                            for (let i in result.data) {
                                let data = JSON.parse(result.data[i]);
                                that.data.pickedDepartments.push(i);
                                userlist.push(...data.userlist);
                                for (let d of data.userlist) {
                                    that.data.pickedUsers.push(d.userid);
                                    names.push(d.name);
                                    userids.push(d.userid);
                                    d.userId = d.userid;
                                }
                            }
                            that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                            names = [...new Set(names)]; //数组去重
                            userids = [...new Set(userids)]; //数组去重

                            that.setData({
                                "table.EvectionMan": names.join(","),
                                "table.EvectionManId": userids.join(",")
                            });
                        },
                        deptId
                    );
                } else if (res.departments.length > 0 && res.users.length > 0) {
                    let deptId = [];
                    for (let i of res.departments) {
                        deptId.push(i.id);
                    }

                    that.postDataReturnData(
                        "DingTalkServers/GetDeptAndChildUserListByDeptId",
                        result => {
                            console.log(result.data);
                            that.data.pickedUsers = [];
                            that.data.pickedDepartments = [];
                            let userlist = [];
                            for (let i in result.data) {
                                let data = JSON.parse(result.data[i]);
                                that.data.pickedDepartments.push(i);
                                userlist.push(...data.userlist);
                                for (let d of data.userlist) {
                                    that.data.pickedUsers.push(d.userid);
                                    names.push(d.name);
                                    userids.push(d.userid);
                                    d.userId = d.userid;
                                }
                            }
                            for (let i of res.users) {
                                that.data.pickedUsers.push(i.userId);
                                names.push(i.name);
                                userids.push(i.userId);
                            }
                            that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                            names = [...new Set(names)]; //数组去重
                            userids = [...new Set(userids)]; //数组去重

                            that.setData({
                                "table.EvectionMan": names.join(","),
                                "table.EvectionManId": userids.join(",")
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function(err) {}
        });
    },
    //选择时间
    selectStartDateTime() {
        dd.datePicker({
            format: "yyyy-MM-dd HH:mm",
            currentDate: this.data.DateStr + " " + this.data.TimeStr,
            startDate: this.data.DateStr + " " + this.data.TimeStr,
            endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day + " " + this.data.TimeStr,
            success: res => {
                if (this.data.endDateStr) {
                    //判断时间
                    let start = new Date(res.date.replace(/-/g, "/")).getTime();
                    let end = new Date(this.data.endDateStr.replace(/-/g, "/")).getTime();
                    if (end < start) {
                        dd.alert({
                            content: promptConf.promptConf.TimeComparison,
                            buttonText: promptConf.promptConf.Confirm
                        });
                        return;
                    }
                    this.setData({
                        "table.Duration": this._computeDurTime(
                            new Date(res.date.replace(/-/g, "/")),
                            new Date(this.data.endDateStr.replace(/-/g, "/")),
                            "h"
                        )
                    });
                }
                this.setData({
                    startDateStr: res.date,
                    "table.BeginTime": res.date
                });
            }
        });
    },
    selectEndDateTime() {
        dd.datePicker({
            format: "yyyy-MM-dd HH:mm",
            currentDate: this.data.DateStr + " " + this.data.TimeStr,
            startDate: this.data.DateStr + " " + this.data.TimeStr,
            endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day + " " + this.data.TimeStr,
            success: res => {
                if (this.data.startDateStr) {
                    //判断时间
                    let end = new Date(res.date.replace(/-/g, "/")).getTime();
                    let start = new Date(this.data.startDateStr.replace(/-/g, "/")).getTime();
                    if (end < start) {
                        dd.alert({
                            content: promptConf.promptConf.TimeComparison,
                            buttonText: promptConf.promptConf.Confirm
                        });
                        return;
                    }

                    this.setData({
                        "table.Duration": this._computeDurTime(
                            new Date(this.data.startDateStr.replace(/-/g, "/")),
                            new Date(res.date.replace(/-/g, "/")),
                            "h"
                        )
                    });
                }
                this.setData({
                    endDateStr: res.date,
                    "table.EndTime": res.date
                });
            }
        });
    }
});
