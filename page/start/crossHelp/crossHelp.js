import pub from "/util/public";
import promptConf from "/util/promptConf.js";
const app = getApp();
let good = {};
Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        addPeopleNodes: [4, 6] //额外添加审批人节点数组
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        value["CooperateDept"] = this.data.DeptNames[this.data.departIndex];
        value["CooperateManId"] = this.data.table.CooperateManId;
        value["CooperateMan"] = this.data.table.CooperateMan; 

        console.log(value);

        if (value.title.trim() == "") {
            dd.alert({
                content: `标题不能为空，请输入!`,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.CooperateDept == undefined) {
            dd.alert({
                content: "协作部门不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }

        if (value.CooperateMan == undefined) {
            dd.alert({
                content: "协作人不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }

        if (value.CooperateContent.trim() == "") {
            dd.alert({
                content: "协作内容不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.PlanBeginTime.trim() == "") {
            dd.alert({
                content: "开始时间不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }

        if (value.PlanEndTime.trim() == "") {
            dd.alert({
                content: "结束时间不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }

        let callBack = function(taskId) {
            value.TaskId = taskId;
            that._postData(
                "Cooperate/Save",
                res => {
                    that.doneSubmit();
                },
                value
            );
        };
        this.data.nodeList[4].AddPeople = this.data.nodeList[2].AddPeople;
        this.data.nodeList[6].AddPeople = [...this.data.nodeList[1].AddPeople, ...this.data.nodeList[2].AddPeople];
        console.log(this.data.nodeList);
        this.approvalSubmit(
            {
                Title: value.title,
                Remark: value.remark
            },
            callBack
        );
    },
    //选人控件方法
    choosePeopleOne(e) {
        console.log("start choose people");
        let nodeId = e.target.targetDataset.NodeId;
        let that = this;
        dd.complexChoose({
            ...that.data.chooseParam,
            pickedUsers: that.data.pickedUsers || [], //已选用户
            multiple: true,
            title: "协作人",
            success: function(res) {
                console.log(res);
                let names = []; //userId
                let ids = [];

                // 单选组织外的人
                if (res.departments.length == 0 && res.users.length > 0) {
                    that.data.pickedUsers = [];
                    for (let d of res.users) {
                        that.data.pickedUsers.push(d.userId);
                        names.push(d.name);
                        ids.push(d.userId);
                    }
                    that.setData({
                        "table.CooperateMan": names.join(","),
                        "table.CooperateManId": ids.join(",")
                    });
                }
                //单选组织
                else if (res.departments.length > 0 && res.users.length == 0) {
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
                                    ids.push(d.userid);
                                    d.userId = d.userid;
                                }
                            }

                            that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                            names = [...new Set(names)]; //数组去重
                            ids = [...new Set(ids)]; //数组去重

                            that.setData({
                                "table.CooperateMan": names.join(","),
                                "table.CooperateManId": ids.join(",")
                            });
                        },
                        deptId
                    );
                }
                //既选组织外的人又选组织
                else if (res.departments.length > 0 && res.users.length > 0) {
                    console.log("我会执行");
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
                            //组织里的人
                            for (let i in result.data) {
                                let data = JSON.parse(result.data[i]);
                                that.data.pickedDepartments.push(i);
                                userlist.push(...data.userlist);
                                for (let d of data.userlist) {
                                    that.data.pickedUsers.push(d.userid);
                                    names.push(d.name);
                                    ids.push(d.userid);
                                    d.userId = d.userid;
                                }
                            }
                            //组织外的人
                            for (let i of res.users) {
                                that.data.pickedUsers.push(i.userId);
                                names.push(i.name);
                                ids.push(i.userId);
                            }
                            that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                            names = [...new Set(names)]; //数组去重
                            ids = [...new Set(ids)]; //数组去重

                            that.setData({
                                "table.CooperateMan": names.join(","),
                                "table.CooperateManId": ids.join(",")
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function(err) {}
        });
    },
    selectStartDate() {
        let that = this;
        dd.datePicker({
            format: "yyyy-MM-dd",
            currentDate: this.data.DateStr,
            startDate: this.data.DateStr,
            endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day,
            success: res => {
                if (that.data.table.PlanEndTime) {
                    let iDay = that.DateDiff(that.data.table.PlanEndTime, res.date); //計算天數
                    if (iDay < 0) {
                        dd.alert({
                            content: promptConf.promptConf.TimeComparison,
                            buttonText: promptConf.promptConf.Confirm
                        });
                        return;
                    }
                    that.setData({
                        "table.PlanDays": iDay
                    });
                }

                this.setData({
                    startDateStr: res.date,
                    "table.PlanBeginTime": res.date
                });
            }
        });
    },

    selectEndDate() {
        let that = this;
        let iDay = 0;
        dd.datePicker({
            format: "yyyy-MM-dd",
            currentDate: this.data.DateStr,
            startDate: this.data.DateStr,
            endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day,
            success: res => {
                if (that.data.table.PlanBeginTime) {
                    iDay = that.DateDiff(res.date, that.data.table.PlanBeginTime); //計算天數
                    if (iDay < 0) {
                        dd.alert({
                            content: promptConf.promptConf.TimeComparison,
                            buttonText: promptConf.promptConf.Confirm
                        });
                        return;
                    }
                }
                this.setData({
                    "table.PlanDays": iDay,
                    endDateStr: res.date,
                    "table.PlanEndTime": res.date
                });
            }
        });
    },
    //选择协作部门
    bindDeptChange(e) {
        this.setData({
            departIndex: e.detail.value
        });
    }
});
