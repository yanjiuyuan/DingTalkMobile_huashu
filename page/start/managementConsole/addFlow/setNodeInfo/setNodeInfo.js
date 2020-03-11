import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    data: {
        ...pub.data,
        FirstArray: [
            { name: "是", label: true },
            { name: "否", label: false }
        ], //退回
        SecondArray: [
            { name: "是", label: true },
            { name: "否", label: false }
        ], //抄送
        thirdArray: [
            { name: "是", label: true },
            { name: "否", label: false }
        ], //选人
        firstNeedArray: [],
        secondNeedArray: [],
        thirdNeedArray: []
    },
    onLoad(option) {
        let that = this;
        let nodeList = [
            {
                NodeId: 0,
                NodeName: "申请人发起"
            },
            {
                NodeId: 1,
                NodeName: "结束"
            }
        ];
        this.setData({
            nodeList: nodeList
        });
    },
    delete(e) {
        let that = this;
        let NodeId = e.currentTarget.dataset.NodeId;
        dd.confirm({
            content: "是否删除该节点？",
            confirmButtonText: promptConf.promptConf.Confirm,
            cancelButtonText: promptConf.promptConf.Cancel,
            success: result => {
                console.log(result);
                if (result.confirm == true) {
                    for (let i = 0, lengh = that.data.nodeList.length; i < lengh - 1; i++) {
                        console.log(NodeId);
                        console.log(that.data.nodeList[i].NodeId);

                        if (NodeId == that.data.nodeList[i].NodeId) {
                            console.log("我执行了");
                            that.data.nodeList.splice(i, 1);
                            for (let j = i, length = that.data.nodeList.length; j < length; j++) {
                                that.data.nodeList[j].NodeId -= 1;
                                that.data.nodeList[j].PreNodeId -= 1;
                            }
                            break;
                        }
                    }
                    console.log(that.data.nodeList);
                    that.setData({
                        nodeList: that.data.nodeList
                    });
                }
            }
        });
    },
    add(e) {
        let that = this;
        let NodeId = e.currentTarget.dataset.NodeId;
        let length = this.data.nodeList.length; //减去结束节点
        let arr = [];
        console.log(NodeId);
        for (let i = NodeId + 2; i < length; i++) {
            arr.push({ name: i, value: i });
        }
        this.setData({
            needChoose: arr,
            NodeId: NodeId,
            hidden: !this.data.hidden
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },
    choosePeople(e) {
        let that = this;
        console.log("start choose people");
        console.log(e);
        let PeopleId = e.currentTarget.dataset.PeopleId;
        let NodeName = e.currentTarget.dataset.NodeName;
        let NodeId = e.currentTarget.dataset.NodeId;
        dd.complexChoose({
            ...that.data.chooseParam,
            title: "选择审批人",
            pickedUsers: PeopleId || [],
            multiple: NodeName.indexOf("抄送") != -1 ? true : false,
            success: function(res) {
                console.log(res);
                let names = [];
                let ids = [];
                if (res.departments.length == 0) {
                    for (let d of res.users) {
                        names.push(d.name);
                        ids.push(d.userId);
                    }
                    that.setData({
                        ["nodeList[NodeId].NodePeople"]: names,
                        ["nodeList[NodeId].PeopleId"]: ids
                    });
                } else {
                    let deptId = [];
                    for (let i of res.departments) {
                        deptId.push(i.id);
                    }
                    that.postDataReturnData(
                        "DingTalkServers/GetDeptAndChildUserListByDeptId",
                        res => {
                            console.log(res.data);
                            that.data.pickedUsers = [];
                            let userlist = [];
                            for (let i in res.data) {
                                let data = JSON.parse(res.data[i]);
                                that.data.pickedDepartments.push(i);
                                userlist.push(...data.userlist);
                                for (let d of data.userlist) {
                                    that.data.pickedUsers.push(d.userid);
                                    names.push(d.name);
                                    ids.push(d.userid);
                                    d.userId = d.userid;
                                }
                            }
                            names = [...new Set(names)]; //数组去重
                            ids = [...new Set(ids)]; //数组去重
                            that.setData({
                                ["nodeList[NodeId].NodePeople"]: names,
                                ["nodeList[NodeId].PeopleId"]: ids
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function(err) {}
        });
    },
    choosePeoples(e) {
        let that = this;
        console.log("start choose people");
        dd.complexChoose({
            ...that.data.chooseParam,
            title: "选择审批人",
            multiple: that.data.multiple || false,
            success: function(res) {
                console.log(res);
                let names = [];
                let ids = [];
                let addPeoples = [];
                if (res.departments.length == 0) {
                    for (let d of res.users) {
                        names.push(d.name);
                        ids.push(d.userId);
                        addPeoples.push({
                            name: d.name,
                            userId: d.userId
                        });
                    }
                    that.setData({
                        Approver: names.join(","),
                        PeopleId: ids.join(",")
                    });
                } else {
                    let deptId = [];
                    for (let i of res.departments) {
                        deptId.push(i.id);
                    }
                    that.postDataReturnData(
                        "DingTalkServers/GetDeptAndChildUserListByDeptId",
                        res => {
                            console.log(res.data);
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
                                    addPeoples.push({
                                        name: d.name,
                                        userId: d.userId
                                    });
                                    d.userId = d.userid;
                                }
                            }
                            names = [...new Set(names)]; //数组去重
                            ids = [...new Set(ids)]; //数组去重
                            that.setData({
                                Approver: names.join(","),
                                PeopleId: ids.join(",")
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function(err) {}
        });
    },
    cancel() {
        this.setData({
            hidden: !this.data.hidden
        });
        this.createMaskHideAnim();
        this.createContentHideAnim();
    },
    radioChangeOne(e) {
        this.setData({
            IsBack: e.detail.value
        });
    },
    //是否抄送
    radioChangeTwo(e) {
        console.log(e);
        this.setData({
            Approver: "",
            isBack: false,
            show: false,
            multiple: e.detail.value,
            IsSend: e.detail.value
        });
    },
    radioChangeThree(e) {
        this.setData({
            show: e.detail.value
        });
    },
    onChanges(e) {
        let arr = e.detail.value.sort();

        let arr1 = [];
        let arr2 = [];
        let arr3 = [];
        let arr4 = [];

        for (let i = 0, len = arr.length; i < len; i++) {
            arr1.push({ name: arr[i], value: arr[i] });
            arr2.push({ name: arr[i], value: arr[i] });
            arr3.push({ name: arr[i], value: arr[i] });
        }
        for (let i = 0, length = this.data.needChoose.length; i < length; i++) {
            for (let j of arr) {
                if (j == this.data.needChoose[i].value) {
                    arr4[i] = j;
                    break;
                }
            }
        }

        this.setData({
            firstNeedArray: arr1, //需要多选节点
            secondNeedArray: arr2, //必选节点
            thirdNeedArray: arr3, //角色选人
            ChoseNodeId: arr4
        });
    },
    onChangeFisrt(e) {
        let arr = [];
        let value = e.detail.value;
        for (let i = 0, length = this.data.needChoose.length; i < length; i++) {
            for (let j of value) {
                if (j == this.data.needChoose[i].value) {
                    arr[i] = 1;
                    break;
                } else {
                    arr[i] = 0;
                }
            }
        }
        this.setData({
            IsSelectMore: arr
        });
    },
    onChangeSecond(e) {
        let arr = [];
        let value = e.detail.value;
        for (let i = 0, length = this.data.needChoose.length; i < length; i++) {
            for (let j of value) {
                if (j == this.data.needChoose[i].value) {
                    arr[i] = 1;
                    break;
                } else {
                    arr[i] = 0;
                }
            }
        }
        this.setData({
            IsMandatory: arr
        });
    },
    onChangeThird(e) {
        let arr = e.detail.value.sort();
        let value = e.detail.value;
        let arrs = [];
        let arr2 = [];
        for (let i of arr) {
            arrs.push({
                index: i,
                roleIndex: -1
            });
        }
        for (let i = 0, length = this.data.needChoose.length; i < length; i++) {
            for (let j of value) {
                if (j == this.data.needChoose[i].value) {
                    arr2[i] = 1;
                    break;
                } else {
                    arr2[i] = 0;
                }
            }
        }
        this.setData({
            choosePeopleArray: arrs,
            ChoseType: arr2
        });
    },
    change(e) {
        let item = e.currentTarget.dataset.item;
        for (let i of this.data.choosePeopleArray) {
            if (item.index == i.index) {
                i.roleIndex = e.detail.value;
                i.RoleNames = this.data.roleList[i.roleIndex];
            }
        }
        console.log(this.data.choosePeopleArray);

        this.setData({
            choosePeopleArray: this.data.choosePeopleArray
        });
    },
    onReady() {
        let that = this;
        this._postData("Role/GetRoleInfoList", res => {
            let roleList = [];
            for (let i in res) {
                roleList.push(i);
            }
            that.setData({
                roleList: roleList
            });
        });
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        if (value.NodeName == "") {
            dd.alert({
                content: "节点名称不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.NodePeople == "") {
            dd.alert({
                content: "审批人不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        // ChoseType
        let str = "";

        for (let j = 0, len = this.data.needChoose.length; j < len; j++) {
            for (let i of this.data.choosePeopleArray) {
                if (i.index == this.data.needChoose[j].value) {
                    str += i.RoleNames;
                    break;
                }
            }
            if (j < len - 1) {
                str += ",";
            }
        }

        let nodeInfo = {
            NodeId: that.data.NodeId + 1,
            FlowId: that.data.FlowId.flowId,
            NodeName: value.NodeName,
            NodePeople: value.NodePeople.split(","),
            PeopleId: that.data.PeopleId.split(","),
            PreNodeId: that.data.NodeId + 2,
            IsAllAllow: true,
            IsBack: value.IsBack || false,
            IsNeedChose: value.IsNeedChose || false,
            IsSend: that.data.IsSend,
            BackNodeId: value.BackNodeId || "",
            ChoseNodeId: that.data.ChoseNodeId ? that.data.ChoseNodeId.join(",") : "",
            IsSelectMore: that.data.IsSelectMore ? that.data.IsSelectMore.join(",") : "",
            IsMandatory: that.data.IsMandatory ? that.data.IsMandatory.join(",") : "",
            ChoseType: that.data.ChoseType ? that.data.ChoseType.join(",") : "",
            RoleNames: str || "",
            RolesList: {}
        };
        for (let i = 0, length = this.data.nodeList.length; i < length; i++) {
            if (this.data.NodeId == this.data.nodeList[i].NodeId) {
                this.data.nodeList.splice(this.data.NodeId + 1, 0, nodeInfo);
                for (let j = i + 2, length = that.data.nodeList.length; j < length; j++) {
                    that.data.nodeList[j].NodeId += 1;
                    that.data.nodeList[j].PreNodeId = (parseInt(that.data.nodeList[j].PreNodeId) + 1).toString();
                }
            }
        }
        console.log(this.data.nodeList);
        this.setData({
            nodeList: this.data.nodeList,
            hidden: !this.data.hidden
        });
        this.createMaskHideAnim();
        this.createContentHideAnim();
    },
    save() {
        console.log(this.data.nodeList);
        let nodeArray = this.data.nodeList;
        for (let i = 0, length = this.data.nodeList.length; i < length; i++) {
            console.log(i);
            nodeArray[i].NodePeople = nodeArray[i].NodePeople ? nodeArray[i].NodePeople.join(",") : "";
            nodeArray[i].PeopleId = nodeArray[i].PeopleId ? nodeArray[i].PeopleId.join(",") : "";
        }

        this._postData(
            "FlowInfoNew/UpdateNodeInfos",
            res => {
                dd.navigateBack({
                    delta: 1
                });
            },
            nodeArray
        );
    }
});
