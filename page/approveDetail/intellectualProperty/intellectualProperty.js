import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        addPeopleNodes: [], //额外添加审批人节点数组

        table: {},
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Remark: value.remark,
        };
        if (this.data.nodeid == 5) {
            this.data.table["ActualName"] = value.ActualName;
            // this.data.table["Company"] = this.data.CompanyNames[this.data.companyIndex];

            this.data.table["Company"] = value.Company;

            this.data.table["ActualType"] = this.data.IntellectualPropertyTypes[
                this.data.stateIndexs
            ];
            console.log(this.data.table);
            if (this.data.table.ActualName.trim() == "") {
                dd.alert({
                    content: "申报名称不允许空，请输入！",
                    buttonText: promptConf.promptConf.Confirm,
                });
                return;
            }
            if (this.data.table.ActualType == undefined) {
                dd.alert({
                    content: "申报类别不允许为空，请输入！",
                    buttonText: promptConf.promptConf.Confirm,
                });
                return;
            }
            if (this.data.table.Company == "") {
                dd.alert({
                    content: "申报单位不允许为空，请输入！",
                    buttonText: promptConf.promptConf.Confirm,
                });
                return;
            }
        }
        this.setData({ disablePage: true });
        this._postData(
            "IntellectualProperty/Modify",
            res => {
                that.aggreSubmit(param);
            },
            this.data.table
        );
    },
    //下拉框选择处理
    changeIptIndex(e) {
        this.setData({
            stateIndexs: e.detail.value,
        });
    },
    changeCompany(e) {
        this.setData({
            companyIndex: e.detail.value,
        });
    },
    //选人控件方法

    choosePeoples(e) {
        this.data.addPeopleNodes = [5];
        let that = this;
        dd.complexChoose({
            ...that.data.chooseParam,
            multiple: true,
            success: function(res) {
                let names = []; //userId
                let ids = [];
                for (let d of res.users) {
                    names.push(d.name);
                    ids.push(d.userId);
                }
                that.setData({
                    //[${i}]
                    "table.ActualInventor": names.join(","),
                    "table.ActualInventorId": ids.join(","),
                });
            },
            fail: function(err) {},
        });
    },
    //选人 可以实现
    choosePeoples(e) {
        console.log("start choose people");
        let nodeId = e.target.targetDataset.NodeId;
        let that = this;
        dd.complexChoose({
            ...that.data.chooseParam,
            pickedUsers: that.data.pickedUsers || [], //已选用户
            multiple: true,
            title: "发明人或设计人",
            success: function(res) {
                console.log(res);
                let names = [];
                let ids = [];
                if (res.departments.length == 0 && res.users.length > 0) {
                    that.data.pickedUsers = [];
                    for (let d of res.users) {
                        that.data.pickedUsers.push(d.userId);
                        names.push(d.name);
                        ids.push(d.userId);
                    }
                    that.setData({
                        "table.ActualInventor": names.join(","),
                        "table.ActualInventorId": ids.join(","),
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
                            ids = [...new Set(ids)]; //数组去重

                            that.setData({
                                "table.ActualInventor": names.join(","),
                                "table.ActualInventorId": ids.join(","),
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
                                names.push(i.name);
                                ids.push(i.userId);
                            }
                            that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                            names = [...new Set(names)]; //数组去重
                            ids = [...new Set(ids)]; //数组去重

                            that.setData({
                                "table.ActualInventor": names.join(","),
                                "table.ActualInventorId": ids.join(","),
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function(err) {},
        });
    },
    onReady() {
        let that = this;
        console.log(this.data.nodeid == 5 && this.data.index == 0);
        this._getData(
            "IntellectualProperty/Read" + this.formatQueryStr({ TaskId: this.data.taskid }),
            res => {
                for (let r in res) {
                    if (res[r] === null) res[r] = "";
                }
                let index = 0;
                for (let i = 0, len = this.data.IntellectualPropertyTypes.length; i < len; i++) {
                    if (res.Type == this.data.IntellectualPropertyTypes[i]) {
                        index = i;
                    }
                }
                this.setData({
                    stateIndex: index,
                    table: res,
                });
            }
        );
    },
});
