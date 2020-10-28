import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        table: {},
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Remark: value.remark,
        };
        console.log(value);
        if (
            (value.FactBeginTime == "" ||
                value.FactEndTime == "" ||
                value.FactDays == "" ||
                value.FactCooperateContent == "" ||
                value.FactCooperateMan == "") &&
            this.data.nodeid == 4
        ) {
            dd.alert({
                content: "表单未填写完整",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (this.data.nodeid == 4) {
            this.data.table["FactBeginTime"] = value.FactBeginTime;
            this.data.table["FactEndTime"] = value.FactEndTime;
            this.data.table["FactDays"] = value.FactDays;
            this.data.table["FactCooperateContent"] = value.FactCooperateContent;
            this.data.addPeopleNodes = [7];
            //this.data.table['FactCooperateMan'] = value.FactCooperateMan
        }

        this.setData({ disablePage: true });
        this._postData(
            "Cooperate/Modify",
            res => {
                that.aggreSubmit(param);
            },
            this.data.table
        );
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
            title: "实际协作人",
            success: function(res) {
                console.log(res);
                let names = []; //userId
                let ids = [];
                if (res.departments.length == 0 && res.users.length > 0) {
                    that.data.pickedUsers = [];
                    for (let d of res.users) {
                        that.data.pickedUsers.push(d.userId);
                        names.push(d.name);
                        ids.push(d.userId);
                    }
                    let a = [];
                    for (let i = 0; i < names.length; i++) {
                        a.push({ name: names[i], userId: ids[i] });
                    }
                    that.data.nodeList[7].AddPeople = a;
                    that.data.nodeList[7].NodePeople = names;

                    that.setData({
                        "table.FactCooperateMan": names.join(","),
                        "table.FactCooperateManId": ids.join(","),
                        nodeList: that.data.nodeList,
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
                            ids = [...new Set(ids)];
                            let a = [];
                            for (let i = 0; i < names.length; i++) {
                                a.push({ name: names[i], userId: ids[i] });
                            }
                            that.data.nodeList[7].NodePeople = names;
                            that.data.nodeList[7].AddPeople = a;
                            that.setData({
                                "table.FactCooperateMan": names.join(","),
                                "table.FactCooperateManId": ids.join(","),
                                nodeList: that.data.nodeList,
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
                            for (let i of res.users) {
                                that.data.pickedUsers.push(i.userId);
                                names.push(i.name);
                                ids.push(i.userId);
                            }
                            that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                            names = [...new Set(names)]; //数组去重
                            ids = [...new Set(ids)];
                            let a = [];
                            for (let i = 0; i < names.length; i++) {
                                a.push({ name: names[i], userId: ids[i] });
                            }
                            that.data.nodeList[7].NodePeople = names;
                            that.data.nodeList[7].AddPeople = a;
                            that.setData({
                                "table.FactCooperateMan": names.join(","),
                                "table.FactCooperateManId": ids.join(","),
                                nodeList: that.data.nodeList,
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function(err) {
                // if (this.rebackAble && node.IsSend == false && node.ApplyTime && node.ApplyManId && node.ApplyManId != DingData.userid) {
                // 	this.rebackAble = false
                // }
            },
        });
    },
    onReady() {
        let that = this;
        console.log;
        this._getData("Cooperate/Read" + this.formatQueryStr({ TaskId: this.data.taskid }), res => {
            console.log(res);
            if (this.data.nodeid == 1) {
                // res['FactBeginTime'] = res.PlanBeginTime
                // res['FactEndTime'] = res.PlanEndTime
                // res['FactDays'] = res.PlanDays
                // res['FactCooperateContent'] = res.CooperateContent
                // res['FactCooperateMan'] = res.CooperateMan
            }
            res["FactCooperateMan"] = res.FactCooperateMan || "";
            res["FactCooperateContent"] = res.FactCooperateContent || "";

            if (this.data.nodeid == 4) {
                that.data.nodeList[7].NodePeople = [];

                let CooperateMan = res.CooperateMan.split(",");
                let CooperateManId = res.CooperateManId.split(",");
                for (let i = 0; i < CooperateMan.length; i++) {
                    that.data.nodeList[7].NodePeople.push(CooperateMan[i]);

                    that.data.nodeList[7].AddPeople.push({
                        name: CooperateMan[i],
                        userId: CooperateManId[i],
                    });
                }
                console.log(this.data.nodeList);
            }

            this.setData({
                table: res,
                nodeList: that.data.nodeList,
            });
        });
    },

    selectStartDate() {
        dd.datePicker({
            format: "yyyy-MM-dd",
            currentDate: this.data.DateStr,
            startDate: this.data.DateStr,
            endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day,
            success: res => {
                if(that.data.table.FactEndTime){
                    let iDay = that.DateDiff(that.data.table.FactEndTime, res.date); //計算天數
                    if (iDay < 0) {
                    dd.alert({
                            content: promptConf.promptConf.TimeComparison,
                            buttonText: promptConf.promptConf.Confirm
                    });
                    return;
                    }
                    that.setData({
                        "table.FactDays": iDay
                    });
                }
                this.setData({
                    "table.FactBeginTime": res.date,
                });
            },
        });
    },
    selectEndDate() {
        let that = this;
        dd.datePicker({
            format: "yyyy-MM-dd",
            currentDate: this.data.DateStr,
            startDate: this.data.DateStr,
            endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day,
            success: res => {
                if (that.data.table.FactBeginTime) {
                    let iDay = that.DateDiff(res.date, that.data.table.FactBeginTime); //計算天數
                    if (iDay < 0) {
                        dd.alert({
                            content: promptConf.promptConf.TimeComparison,
                            buttonText: promptConf.promptConf.Confirm
                        });
                        return;
                    }
                    this.setData({
                    "table.FactDays": iDay,
                    })
                }
                this.setData({
                    "table.FactEndTime": res.date,
                });
            },
        });
    },
});
