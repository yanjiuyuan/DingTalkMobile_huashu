import pub from "/util/public";
import promptConf from "/util/promptConf.js";
const app = getApp();
Page({
    ...pub.func,
    data: {
        ...pub.data,
        tableOperate: "编辑",
        tableParam: {
            size: 5,
            now: 1,
            total: 0
        },
        IsEnableArray: [
            { name: "是", label: true },
            { name: "否", label: false, checked: true }
        ],
        SecondArray: [
            { name: "是", label: true },
            { name: "否", label: false }
        ],
        tableItems: [
            {
                prop: "RoleName",
                label: "角色名称",
                width: 300
            },
            {
                prop: "CreateTime",
                label: "创建时间",
                width: 300
            },
            {
                prop: "IsEnable",
                label: "是否启用",
                width: 300
            }
        ]
    },
    onReady() {
        let that = this;
        this._getData("Role/GetRole" + that.formatQueryStr({ applyManId: app.userInfo.userid }), function(res) {
            console.log(res);
            for (let i of res) {
                i.IsEnable = i.IsEnable == true ? "是" : "否";
            }
            that.setData({
                tableData: res,
                "tableParam.total": res.length
            });
            that.data.data = res;
            that.getData();
        });
    },
    //修改选人
    choosePeoples(e) {
        let that = this;
        console.log("start choose people");
        dd.complexChoose({
            ...that.data.chooseParam,
            title: "权限成员",
            multiple: true,
            success: function(res) {
                console.log(res);
                let names = [];
                let ids = [];
                let thirdNeedArray = [];
                if (res.departments.length == 0) {
                    for (let d of res.users) {
                        names.push(d.name);
                        ids.push(d.userId);
                        thirdNeedArray.push({
                            name: d.name,
                            value: d.name,
                            id: d.userId
                        });
                    }
                    thirdNeedArray = that.objectArrayDuplication(thirdNeedArray, "name");
                    console.log(thirdNeedArray);
                    that.setData({
                        permissionMember: names.join(","),
                        PeopleId: ids.join(","),
                        thirdNeedArray: thirdNeedArray
                    });
                } else {
                    let deptId = [];
                    for (let i of res.departments) {
                        deptId.push(i.id);
                    }
                    that.postDataReturnData(
                        "DingTalkServers/GetDeptAndChildUserListByDeptId",
                        res => {
                            that.data.pickedUsers = [];
                            that.data.pickedDepartments = [];
                            let userlist = [];
                            for (let i in res.data) {
                                let data = JSON.parse(res.data[i]);
                                that.data.pickedDepartments.push(i);
                                userlist.push(...data.userlist);
                                for (let d of data.userlist) {
                                    that.data.pickedUsers.push(d.userid);
                                    names.push(d.name);
                                    ids.push(d.userid);
                                    thirdNeedArray.push({
                                        name: d.name,
                                        value: d.name,
                                        id: d.userid
                                    });
                                    d.userId = d.userid;
                                }
                            }
                            thirdNeedArray = that.objectArrayDuplication(thirdNeedArray, "id"); //对象数组去重
                            console.log(thirdNeedArray);

                            names = [...new Set(names)]; //数组去重
                            ids = [...new Set(ids)]; //数组去重
                            that.setData({
                                permissionMember: names.join(","),
                                PeopleId: ids.join(","),
                                thirdNeedArray: thirdNeedArray
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function(err) {}
        });
    },
    //添加选人
    choosePeople(e) {
        let that = this;
        console.log("start choose people");
        dd.complexChoose({
            ...that.data.chooseParam,
            title: "权限成员",
            multiple: true,
            success: function(res) {
                console.log(res);
                let names = [];
                let ids = [];
                let twoNeedArray = [];
                if (res.departments.length == 0) {
                    for (let d of res.users) {
                        names.push(d.name);
                        ids.push(d.userId);
                        twoNeedArray.push({
                            name: d.name,
                            value: d.name,
                            id: d.userId
                        });
                    }
                    that.setData({
                        addPermissionMember: names.join(","),
                        PeopleId: ids.join(","),
                        twoNeedArray: twoNeedArray
                    });
                } else {
                    let deptId = [];
                    for (let i of res.departments) {
                        deptId.push(i.id);
                    }
                    that.postDataReturnData(
                        "DingTalkServers/GetDeptAndChildUserListByDeptId",
                        res => {
                            that.data.pickedUsers = [];
                            that.data.pickedDepartments = [];
                            let userlist = [];
                            for (let i in res.data) {
                                let data = JSON.parse(res.data[i]);
                                that.data.pickedDepartments.push(i);
                                userlist.push(...data.userlist);
                                for (let d of data.userlist) {
                                    that.data.pickedUsers.push(d.userid);
                                    names.push(d.name);
                                    ids.push(d.userid);
                                    twoNeedArray.push({
                                        name: d.name,
                                        value: d.name,
                                        id: d.userid
                                    });
                                    d.userId = d.userid;
                                }
                            }
                            names = [...new Set(names)]; //数组去重
                            ids = [...new Set(ids)]; //数组去重
                            that.setData({
                                addPermissionMember: names.join(","),
                                PeopleId: ids.join(","),
                                twoNeedArray: twoNeedArray
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function(err) {}
        });
    },
    chooseItem(e) {
        // console.log(e);
        if (!e.target.targetDataset.row) return;
        console.log(e.target.targetDataset.row);
        let that = this;
        let index = e.target.targetDataset.index;
        let row = e.target.targetDataset.row;

        for (let i of this.data.SecondArray) {
            if (row.IsEnable == i.label) {
                i.checked = true;
            } else {
                i.checked = false;
            }
        }
        let str = "";
        let arr = [];
        for (let i of row.roles) {
            if (i.IsEnable == true) {
                arr.push({ name: i.UserName, value: i.UserName, id: i.UserId, checked: true });
            } else {
                arr.push({ name: i.UserName, value: i.UserName, id: i.UserId, checked: false });
            }
            str += i.UserName + ",";
        }

        that.setData({
            row: row,
            tableInfo: row,
            permissionMember: str,
            thirdNeedArray: arr,
            SecondArray: this.data.SecondArray
        });
        this.setData({
            hidden: !this.data.hidden
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },
    cancel(e) {
        this.setData({
            hidden: !this.data.hidden
        });
    },
    onChangeThird(e) {
        let value = e.detail.value;
        for (let i of this.data.thirdNeedArray) {
            for (let j of value) {
                if (i.id == j.id) {
                    i.checked = true;
                    break;
                } else {
                    i.checked = false;
                }
            }
            if (value.length == 0) {
                i.checked = false;
            }
        }
    },
    onChanges(e) {
        let value = e.detail.value;
        for (let i of this.data.twoNeedArray) {
            for (let j of value) {
                if (i.id == j.id) {
                    i.checked = true;
                    break;
                } else {
                    i.checked = false;
                }
            }
            if (value.length == 0) {
                i.checked = false;
            }
        }
        console.log(this.data.twoNeedArray);
    },
    confirm(e) {
        let value = e.detail.value;
        console.log(this.data.row);
        this.data.row.IsEnable = value.IsEnable;
        this.data.row.RoleName = value.RoleName;
        this.data.row.Remark = value.Remark;

        //给存在的权限成员IsEnable是否启用赋值
        let rolesList = [];
        for (let i of this.data.thirdNeedArray) {
            let obj = {
                CreateMan: app.userInfo.nickName,
                CreateManId: app.userInfo.userid,
                RoleId: this.data.row.Id,
                UserName: i.name,
                UserId: i.id,
                IsEnable: i.checked
            };
            rolesList.push(obj);
        }
        this.data.row.roles = rolesList;
        let obj = {
            applyManId: app.userInfo.userid,
            roles: [this.data.row]
        };
        this._postData(
            "Role/ModifyRole",
            res => {
                dd.alert({
                    content: promptConf.promptConf.UpdateSuccess,
                    buttonText: promptConf.promptConf.confirm
                });
                this.onReady(); //重新刷新
                this.setData({
                    hidden: !this.data.hidden
                });
            },
            obj
        );
    },
    submit(e) {
        let value = e.detail.value;
        console.log(value);
        if (value.RoleName == "") {
            dd.alert({
                content: "角色名称不允许为空，请输入！",
                buttonText: promptConf.promptConf.confirm
            });
            return;
        }
        if (value.people == "") {
            dd.alert({
                content: "权限成员不允许为空，请输入！",
                buttonText: promptConf.promptConf.confirm
            });
            return;
        }
        let row = {
            CreateMan: app.userInfo.nickName,
            CreateManId: app.userInfo.userid,
            CreateTime: this.data.DateStr + " " + this.data.TimeStr,
            IsEnable: value.IsEnable,
            RoleName: value.RoleName,
            Remark: value.Remark
        };

        let rolesList = [];
        for (let i of this.data.twoNeedArray) {
            let obj = {
                CreateMan: app.userInfo.nickName,
                CreateManId: app.userInfo.userid,
                CreateTime: this.data.DateStr + " " + this.data.TimeStr,
                UserName: i.name,
                UserId: i.id,
                IsEnable: i.checked
            };
            rolesList.push(obj);
        }
        row.roles = rolesList;

        console.log(row);
        this._postData(
            "Role/AddRole",
            res => {
                dd.alert({
                    content: promptConf.promptConf.AddSuccess,
                    buttonText: promptConf.promptConf.Confirm
                });
                this.onReady(); //重新刷新
            },
            [row]
        );
    }
});
