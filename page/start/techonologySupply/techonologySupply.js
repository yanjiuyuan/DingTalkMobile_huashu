import pub from "/util/public";
import lib from "/lib.js";
import promptConf from "/util/promptConf.js";
let app = getApp();
let good = {};

Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        addPeopleNodes: [1],
        names: [],
        array1: ["研发类", "产品类", "教育类"],
        index1: -1,
        array2: ["高", "中", "低"],
        index2: 0,
        OtherEngineers: "",
        ResponsibleMan: "",
        rotate: "RotateToTheRight",
        show: "hidden"
    },

    //选人控件方法
    choosePeoples(e) {
        console.log("start choose people");
        let nodeId = e.target.targetDataset.NodeId;
        let that = this;
        dd.complexChoose({
            ...that.data.chooseParam,
            multiple: false,
            title: "项目负责人",
            success: function(res) {
                console.log(res);
                let names = []; //userId
                for (let d of res.users) names.push(d.name);
                for (let node of that.data.nodeList) {
                    if (node.NodeId == 1) {
                        node.AddPeople = res.users;
                    }
                }

                console.log(JSON.stringify(that.data.items));

                that.setData({
                    "table.ResponsibleMan": names.join(","),
                    ResponsibleMan: res.users[0],
                    nodeList: that.data.nodeList
                });
            },
            fail: function(err) {}
        });
    },

    //选人 可以实现
    choosePeople(e) {
        console.log("start choose people");
        let nodeId = e.target.targetDataset.NodeId;
        let that = this;
        dd.complexChoose({
            ...that.data.chooseParam,
            pickedUsers: that.data.pickedUsers || [], //已选用户
            multiple: true,
            title: "其他工程师",
            success: function(res) {
                console.log(res);
                let names = []; //userId
                let ids = []; //userId

                if (res.departments.length == 0 && res.users.length > 0) {
                    that.data.pickedUsers = [];
                    for (let d of res.users) {
                        that.data.pickedUsers.push(d.userId);
                        names.push(d.name);
                        ids.push(d.userId);
                    }
                    console.log(JSON.stringify(that.data.items));
                    that.setData({
                        "table.OtherEngineers": names.join(","),
                        "table.OtherEngineerId": ids.join(","),
                        OtherEngineers: res.users
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
                                    ids.push(d.userid);
                                    d.userId = d.userid;
                                }
                            }
                            that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                            names = [...new Set(names)]; //数组去重
                            let OtherEngineers = that.objectArrayDuplication(userlist, "userId");
                            that.setData({
                                "table.OtherEngineers": names.join(","),
                                "table.OtherEngineerId": ids.join(","),
                                OtherEngineers: OtherEngineers //去重
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
                                    ids.push(d.userid);
                                    d.userId = d.userid;
                                }
                            }
                            //组织外的人
                            for (let i of res.users) {
                                that.data.pickedUsers.push(i.userId);
                                ids.push(i.userId);
                                names.push(i.name);
                            }
                            that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                            names = [...new Set(names)]; //数组去重
                            let OtherEngineers = that.objectArrayDuplication(userlist, "userId");

                            that.setData({
                                "table.OtherEngineers": names.join(","),
                                "table.OtherEngineerId": ids.join(","),
                                OtherEngineers: OtherEngineers //去重
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function(err) {}
        });
    },

    // 项目大类选择
    bindPickerChangeOne(e) {
        console.log("picker发送选择改变，携带值为", e.detail.value);
        this.setData({
            index1: e.detail.value
        });
    },

    // 紧急情况选择
    bindPickerChangeTwo(e) {
        console.log("picker发送选择改变，携带值为", e.detail.value);
        this.setData({
            index2: e.detail.value
        });
    },

    submit(e) {
        let value = e.detail.value;
        console.log(value);
        let that = this;
        if (value.title.trim() == "") {
            dd.alert({
                content: `标题不能为空，请输入！`,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        let CreateTaskInfo = [
            {
                ApplyMan: this.data.DingData.nickName,
                ApplyManId: this.data.DingData.userid,
                ApplyTime: value.TimeRequired,
                Dept: this.data.DingData.departmentList[this.data.departmentIdnex],
                FlowId: "34",
                IsEnable: "1",
                IsSend: false,
                NodeId: "0",
                Remark: value.remark,
                State: "1",
                Title: value.title
            },
            {
                ApplyMan: that.data.ResponsibleMan.name || value.ResponsibleMan,
                ApplyManId: that.data.ResponsibleMan.userId || that.data.table.ResponsibleManId,
                FlowId: "34",
                IsBack: null,
                IsEnable: 1,
                IsSend: false,
                NodeId: "1",
                OldFileUrl: null,
                State: 0
            }
        ];

        let body = {
            DeptName: value.DeptName.toString(),
            Customer: value.Customer,
            EmergencyLevel: that.data.array2[that.data.index2],
            OtherEngineers: value.OtherEngineers,
            OtherEngineersId: that.data.table.OtherEngineersId,
            ResponsibleMan: that.data.ResponsibleMan.name || value.ResponsibleMan,
            ResponsibleManId: that.data.ResponsibleMan.userId || that.data.table.ResponsibleManId,
            ProjectOverview: value.ProjectOverview.replace(/\s+/g, ""),
            ProjectType: that.data.array1[that.data.index1],
            Title: value.title,
            TaskId: "",
            TimeRequired: value.TimeRequired,
            remark: value.remark,
            MainPoints: value.MainPoints.replace(/\s+/g, "")
        };
        if (
            !body.ResponsibleMan ||
            !body.Customer ||
            !body.Title ||
            !body.ProjectType ||
            !body.TimeRequired ||
            !body.MainPoints ||
            !body.ProjectOverview
        ) {
        }
        console.log(body);

        if (body.Title.trim() == "") {
            dd.alert({
                content: "标题不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (body.DeptName.trim() == "") {
            dd.alert({
                content: "技术支持部门不允许为空，请选择！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (body.ResponsibleMan == "") {
            dd.alert({
                content: "项目负责人不允许为空，请选择！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (body.Customer.trim() == "") {
            dd.alert({
                content: "合作单位不允许为空，请选择！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (body.ProjectType == undefined) {
            dd.alert({
                content: "项目大类不允许为空，请选择！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }

        if (body.TimeRequired == "") {
            dd.alert({
                content: "要求完成时间不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }

        if (body.ProjectOverview.trim() == "") {
            dd.alert({
                content: "客户项目整体情况不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (body.MainPoints.trim() == "") {
            dd.alert({
                content: "技术支持内容要点不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        this.setData({
            disablePage: true
        });
        this._postData(
            "FlowInfoNew/CreateTaskInfo",
            data => {
                body.TaskId = data;
                this._postData(
                    "TechnicalSupport/Save",
                    data => {
                        that.setData({
                            names: []
                        });
                        dd.alert({
                            content: promptConf.promptConf.Submission,
                            buttonText: promptConf.promptConf.Confirm,
                            success: () => {
                                dd.navigateBack({
                                    delta: 2
                                });
                            }
                        });
                    },
                    body
                );
            },
            CreateTaskInfo
        );
    },

    showOrClose() {
        if (this.data.rotate == "RotateToTheRight") {
            this.setData({
                rotate: "Rotate-downward",
                show: "show"
            });
        } else if (this.data.rotate == "Rotate-downward") {
            this.setData({
                rotate: "RotateToTheRight",
                show: "hidden"
            });
        }
    },
    //选择时间
    selectStartDateTime() {
        dd.datePicker({
            format: "yyyy-MM-dd HH:mm",
            currentDate: this.data.DateStr + " " + this.data.TimeStr,
            startDate: this.data.DateStr + " " + this.data.TimeStr,
            endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day + " " + this.data.TimeStr,
            success: res => {
                this.setData({
                    startDateStr: res.date,
                    "table.TimeRequired": res.date
                });
            }
        });
    },
    onShow() {
        //未临时保存
        if (app.globalData[`${this.data.flowid}`] == false || app.globalData[`${this.data.flowid}`] == undefined) {
            this.data.items = [];
            for (let i of this.data.DeptNames) {
                this.data.items.push({
                    name: i,
                    value: i
                });
            }
            this.setData({
                items: this.data.items
            });
        }
    }
});
