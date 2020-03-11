import pub from "/util/public";
import promptConf from "/util/promptConf.js";

let good = {};
Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        stateIndex: 0,
        companyIndex: 0,
        deptIndex: 0,
        typeIndex: 0,
        disablePage: true
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        value["CreateTime"] = "";
        value["CompanyName"] = "泉州华中科技大学智能制造研究院";
        value["ApplyManId"] = this.data.DingData.userid;
        value["ResponsibleMan"] = this.data.DingData.nickName;
        value["ResponsibleManId"] = this.data.DingData.userid;
        value["TeamMembersId"] = this.data.tableInfo.TeamMembersId;
        value["DeptName"] = this.data.DeptNames[this.data.deptIndex];
        value["ProjectSmallType"] = this.data.ProjectTypes[this.data.typeIndex];
        value["ProjectState"] = this.data.States[this.data.stateIndex];
        console.log(value);
        if (!value.ResponsibleMan || !value.StartTime) {
            dd.alert({ content: "表单未填写完整" });
            return;
        }
        if (value.title == "") {
            dd.alert({
                content: "标题不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.ProjectName == "") {
            dd.alert({
                content: "项目名称不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.Customer == "") {
            dd.alert({
                content: "协作单位不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.TeamMembers == "") {
            dd.alert({
                content: "项目组成员不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.StartTime == "") {
            dd.alert({
                content: "开始时间不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.EndTime == "") {
            dd.alert({
                content: "结束时间不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        let callBack = function(taskId) {
            console.log("提交审批ok!");
            value.TaskId = taskId;
            that._postData(
                "CarTableNew/TableSave",
                res => {
                    that.doneSubmit();
                },
                value
            );
        };
        this.approvalSubmit(value, callBack);
    },

    chooseMans(e) {
        console.log("start choose people");
        let that = this;
        dd.complexChoose({
            ...that.data.chooseParam,
            pickedUsers: that.data.pickedUsers || [], //已选用户
            multiple: true,
            title: "其他工程师",
            success: function(res) {
                console.log(res);
                let names = []; //userId
                let userids = [];
                if (res.departments.length == 0 && res.users.length > 0) {
                    that.data.pickedUsers = [];
                    for (let d of res.users) {
                        that.data.pickedUsers.push(d.userId);
                        userids.push(d.userId);
                        names.push(d.name);
                    }
                    that.setData({
                        "tableInfo.TeamMembers": names.join(","),
                        "tableInfo.TeamMembersId": userids.join(",")
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
                                }
                            }
                            that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                            names = [...new Set(names)]; //数组去重
                            userids = [...new Set(userids)]; //数组去重
                            console.log(userids);

                            that.setData({
                                "tableInfo.TeamMembers": names.join(","),
                                "tableInfo.TeamMembersId": userids.join(",")
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
                                }
                            }
                            //组织外的人

                            for (let i of res.users) {
                                that.data.pickedUsers.push(i.userId);
                                userids.push(i.userId);
                                names.push(i.name);
                            }
                            that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                            names = [...new Set(names)]; //数组去重
                            userids = [...new Set(userids)]; //数组去重
                            console.log(userids);

                            that.setData({
                                "tableInfo.TeamMembers": names.join(","),
                                "tableInfo.TeamMembersId": userids.join(",")
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function(err) {}
        });
    },

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
                }
                this.setData({
                    startDateStr: res.date,
                    "table.StartTime": res.date
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
                    let start = new Date(this.data.startDateStr.replace(/-/g, "/")).getTime();
                    let end = new Date(res.date.replace(/-/g, "/")).getTime();
                    if (end < start) {
                        dd.alert({
                            content: promptConf.promptConf.TimeComparison,
                            buttonText: promptConf.promptConf.Confirm
                        });
                        return;
                    }
                }
                this.setData({
                    endDateStr: res.date,
                    "table.EndTime": res.date
                });
            }
        });
    },

    changeState(e) {
        this.setData({
            stateIndex: e.detail.value
        });
    },
    changeCompany(e) {
        this.setData({
            companyIndex: e.detail.value
        });
    },
    changeDept(e) {
        this.setData({
            deptIndex: e.detail.value
        });
    },
    changeType(e) {
        this.setData({
            typeIndex: e.detail.value
        });
    },
    getArray(e) {
        console.log(e.detail.value);
    },
    upLoadFile(e) {
        console.log(e);
        // dd.chooseImage({
        //   sourceType: ['camera','album'],
        //   count: 1,
        //   success: (res) => {
        //     console.log(res);
        //     console.log("chooseImage success");
        //     dd.uploadFile({
        //             url: this.data.dormainName + '/drawingupload/Upload',
        //             fileType: 'image',
        //             fileName: 'file',
        //             filePath: res.filePaths[0],
        //             success: (res) => {
        //             console.log(res);
        //             console.log("uploadFile success");

        //               dd.alert({
        //               content: '上传成功'
        //             });
        //           },

        //           fail:(res) => {

        //             console.log("uploadFile fail");

        //             console.log(res);
        //           }
        //     });
        //   },
        //   fail:()=>{
        //     console.log("chooseImage fail");
        //     my.showToast({
        //       content: '选择失败',
        //     });
        //   }
        // })
    }
});
