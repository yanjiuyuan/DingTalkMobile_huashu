import pub from "/util/public";
import promptConf from "/util/promptConf.js";
//涉及参数，数组太多，把添加和编辑分开比较不容易乱
Page({
    ...pub.func,
    data: {
        ...pub.data,
        /**添加涉及的参数 */

        //添加--退回
        FirstArray: [
            { name: "是", label: true },
            { name: "否", label: false, checked: true },
        ],
        //添加--抄送
        SecondArray: [
            { name: "是", label: true },
            { name: "否", label: false, checked: true },
        ],
        //添加--选人
        thirdArray: [
            { name: "是", label: true },
            { name: "否", label: false, checked: true },
        ],
        IsSend: false,
        IsBack: false,
        show: false,
        //添加--需要多选节点
        firstNeedArray: [],
        //添加--必选节点
        secondNeedArray: [],
        //添加--角色选人节点
        thirdNeedArray: [],

        choosePeopleArray: [],
        /**编辑涉及的参数 */
        //编辑--退回
        editorFirstArray: [
            { name: "是", label: true },
            { name: "否", label: false },
        ],
        //编辑--抄送
        editorSecondArray: [
            { name: "是", label: true },
            { name: "否", label: false },
        ],
        //编辑--选人
        editorThirdArray: [
            { name: "是", label: true },
            { name: "否", label: false },
        ],
    },
    //初始化加载
    onLoad(option) {
        let that = this;
        console.log(option);

        this._getData("FlowInfoNew/GetNodeInfos" + this.formatQueryStr(option), res => {
            let lastNode = {};
            let tempNodeList = [];
            //审批人分组
            if (res.length == 0) {
                let tempNodeList = [
                    {
                        NodeId: 0,
                        FlowId: option.flowId,
                        NodeName: "申请人发起",
                        NodePeople: null,
                        PeopleId: null,
                        PreNodeId: "1",
                        IsAllAllow: true,
                        Condition: "1",
                        IsBack: false,
                        IsNeedChose: false,
                        IsSend: false,
                        BackNodeId: null,
                        ChoseNodeId: "1",
                        IsSelectMore: "0",
                        IsMandatory: "1",
                        ChoseType: "0",
                        RoleNames: null,
                        RolesList: null,
                        AddPeople: [],
                    },
                    {
                        NodeId: 1,
                        FlowId: option.flowId,
                        NodeName: "结束",
                        NodePeople: null,
                        PeopleId: null,
                        PreNodeId: null,
                        IsAllAllow: true,
                        Condition: "0",
                        IsBack: false,
                        IsNeedChose: false,
                        IsSend: false,
                        BackNodeId: null,
                        ChoseNodeId: null,
                        IsSelectMore: null,
                        IsMandatory: null,
                        ChoseType: null,
                        RoleNames: null,
                        RolesList: null,
                        AddPeople: [],
                    },
                ];
                that.setData({
                    nodeList: tempNodeList,
                    FlowId: option,
                });
                return;
            }
            for (let node of res) {
                if (
                    lastNode.NodeName == node.NodeName &&
                    !lastNode.ApplyTime &&
                    !node.ApplyTime &&
                    (lastNode.NodeName == "抄送" ||
                        lastNode.NodeName == "抄送相关人员" ||
                        lastNode.NodeName == "抄送小组成员" ||
                        lastNode.NodeName == "抄送所有人") &&
                    (node.NodeName == "抄送" ||
                        node.NodeName == "抄送相关人员" ||
                        node.NodeName == "抄送小组成员" ||
                        node.NodeName == "抄送所有人")
                ) {
                    tempNodeList[tempNodeList.length - 1].ApplyMan =
                        tempNodeList[tempNodeList.length - 1].ApplyMan + "," + node.ApplyMan;
                } else {
                    tempNodeList.push(node);
                }
                lastNode = node;
            }
            for (let node of tempNodeList) {
                node["AddPeople"] = [];
                if (node["NodePeople"] != null && node["NodePeople"] != "") {
                    node["NodePeople"] = node["NodePeople"].split(",");
                    node["PeopleId"] = node["PeopleId"].split(",");
                }

                //抄送人分组
                if (node.ApplyMan && node.ApplyMan.length > 0) {
                    node.NodePeople = node.ApplyMan.split(",");
                }

                //申请人设置当前人信息
                if (node.NodeName.indexOf("申请人") >= 0 && !node.ApplyMan) {
                    node.ApplyMan = that.data.DingData.nickName;
                    node.AddPeople = [
                        {
                            name: that.data.DingData.nickName,
                            userId: that.data.DingData.userid,
                        },
                    ];
                }
            }

            console.log(tempNodeList);
            that.setData({
                nodeList: tempNodeList,
                FlowId: option,
            });
        });
    },
    //删除
    delete(e) {
        let that = this;
        let NodeId = e.currentTarget.dataset.NodeId;
        dd.confirm({
            title: "温馨提示",
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
                        nodeList: that.data.nodeList,
                    });
                }
            },
        });
    },
    //添加
    add(e) {
        let that = this;
        let NodeId = e.currentTarget.dataset.NodeId;
        let length = this.data.nodeList.length; //减去结束节点
        let arr = [];
        console.log(NodeId);
        for (let i = NodeId + 2; i < length; i++) {
            arr.push({ name: `${i}`, value: `${i}` });
        }
        this.setData({
            needChoose: arr,
            NodeId: NodeId,
            hidden: !this.data.hidden,
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },
    //编辑，需要把IsSend，IsBack，IsNeedChose，IsMandatory，IsSelectMore装换成前端能用的数租
    editor(e) {
        let that = this;
        let NodeId = e.currentTarget.dataset.NodeId;
        let length = this.data.nodeList.length; //减去结束节点
        let nodeInfo = this.data.nodeList[NodeId];
        let arr = [];
        for (let i = NodeId + 1; i < length - 1; i++) {
            arr.push({ name: i, value: i });
        }
        console.log(this.data.nodeList[NodeId]);
        //IsSend
        for (let i of that.data.editorSecondArray) {
            if (nodeInfo.IsSend == i.label) {
                i.checked = true;
            } else {
                i.checked = false;
            }
        }
        //IsBack
        for (let i of that.data.editorFirstArray) {
            if (nodeInfo.IsBack == i.label) {
                i.checked = true;
            } else {
                i.checked = false;
            }
        }
        // IsNeedChose
        for (let i of that.data.editorThirdArray) {
            if (nodeInfo.IsNeedChose == i.label) {
                i.checked = true;
            } else {
                i.checked = false;
            }
        }

        let IsSelectMore, IsMandatory, ChoseType, ChoseNodeId;
        let firstNeedArray = []; //需要多选节点
        let secondNeedArray = []; //必选节点
        let thirdNeedArray = []; //角色选人节点
        let choosePeopleArray = [];

        if (nodeInfo.ChoseNodeId) {
            ChoseNodeId = nodeInfo.ChoseNodeId.split(",");
            for (let i of ChoseNodeId) {
                for (let j of arr) {
                    if (j.value == i) {
                        console.log(i);
                        j.checked = true;
                        firstNeedArray.push({ name: i, value: i });
                        secondNeedArray.push({ name: i, value: i });
                        thirdNeedArray.push({ name: i, value: i });
                        break;
                    }
                }
            }
        }
        if (nodeInfo.IsSelectMore) {
            IsSelectMore = nodeInfo.IsSelectMore.split(",");
        }
        if (nodeInfo.IsMandatory) {
            IsMandatory = nodeInfo.IsMandatory.split(",");
        }
        if (nodeInfo.ChoseType) {
            ChoseType = nodeInfo.ChoseType.split(",");
        }

        //跟据ChoseNodeId生成需要选择节点的数租，在生成IsSelectMore需要用的数组和IsMandatory需要用的数租

        // 给firstNeedArray，secondNeedArray数组赋值
        if (firstNeedArray.length > 0) {
            for (let i = 0, length = firstNeedArray.length; i < length; i++) {
                if (IsSelectMore[i] && IsSelectMore[i] == 1) {
                    firstNeedArray[i].checked = true;
                }
                if (IsMandatory[i] && IsMandatory[i] == 1) {
                    secondNeedArray[i].checked = true;
                }
                if (ChoseType[i] && ChoseType[i] == 1) {
                    thirdNeedArray[i].checked = true;
                }
            }

            for (let i of thirdNeedArray) {
                if (i.checked) {
                    choosePeopleArray.push({
                        index: i.value,
                        roleIndex: -1,
                    });
                }
            }

            this.setData({
                ChoseNodeId: ChoseNodeId,
                IsSelectMore: IsSelectMore,
                IsMandatory: IsMandatory,
                ChoseType: ChoseType,

                firstNeedArray: firstNeedArray,
                secondNeedArray: secondNeedArray,
                thirdNeedArray: thirdNeedArray,
                choosePeopleArray: choosePeopleArray,
            });
        }

        this.setData({
            needChoose: arr,
            NodeId: NodeId,
            Approver: nodeInfo.NodePeople ? nodeInfo.NodePeople.join(",") : "",

            editorFirstArray: that.data.editorFirstArray, //退回
            editorSecondArray: that.data.editorSecondArray, //抄送
            editorThirdArray: that.data.editorThirdArray, //选人

            IsSend: nodeInfo.IsSend,
            IsBack: nodeInfo.IsBack,
            show: nodeInfo.IsNeedChose,
            nodeInfo: nodeInfo,
            hidden2: !this.data.hidden2,
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },
    //编辑选人
    choosePeople(e) {
        let that = this;
        console.log("start choose people");
        console.log(e);
        let PeopleId = e.currentTarget.dataset.PeopleId || that.data.pickedUsers;
        let NodeName = e.currentTarget.dataset.NodeName;
        let NodeId = e.currentTarget.dataset.NodeId;
        dd.complexChoose({
            ...that.data.chooseParam,
            title: "选择审批人",
            pickedUsers: PeopleId || [],
            // multiple: NodeName.indexOf("抄送") != -1 ? true : false,
            multiple: true,
            success: function (res) {
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
                    that.data.nodeList[NodeId].NodePeople = names;
                    that.data.nodeList[NodeId].PeopleId = userids;
                    console.log(that.data.nodeList);
                    that.setData({
                        nodeList: that.data.nodeList,
                    });
                }
                else if (res.departments.length == 0 && res.users.length == 0) {
                    that.data.nodeList[NodeId].NodePeople = "";
                    that.data.nodeList[NodeId].PeopleId = "";
                    that.setData({
                        nodeList: that.data.nodeList,
                    });
                }
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
                                    userids.push(d.userid);
                                    d.userId = d.userid;
                                }
                            }
                            that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                            names = [...new Set(names)]; //数组去重
                            userids = [...new Set(userids)]; //数组去重
                            that.data.nodeList[NodeId].NodePeople = names;
                            that.data.nodeList[NodeId].PeopleId = userids;
                            console.log(that.data.nodeList);
                            that.setData({
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
                            that.data.nodeList[NodeId].NodePeople = names;
                            that.data.nodeList[NodeId].PeopleId = userids;
                            console.log(that.data.nodeList);
                            that.setData({
                                nodeList: that.data.nodeList,
                            });
                        },
                        deptId
                    );
                }
                ///////////////////////////////////
                if (res.departments.length == 0) {
                    for (let d of res.users) {
                        names.push(d.name);
                        ids.push(d.userId);
                    }
                    that.data.nodeList[NodeId].NodePeople = names;
                    that.data.nodeList[NodeId].PeopleId = ids;
                    console.log(that.data.nodeList);
                    that.setData({
                        nodeList: that.data.nodeList,
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
                                ["nodeList[NodeId].PeopleId"]: ids,
                            });
                        },  
                        deptId
                    );
                }
            },
            fail: function (err) { },
        });
    },
    choosePeoples(e) {
        console.log("start choose people");
        let nodeId = e.target.targetDataset.NodeId;
        let that = this;
        dd.complexChoose({
            ...that.data.chooseParam,
            pickedUsers: that.data.pickedUsers || [], //已选用户
            multiple: true, 
            title: "权限成员",
            success: function (res) { 
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
                        Approver: names.join(","),
                        PeopleId: userids.join(","),
                    });

                }
                else if (res.departments.length == 0 && res.users.length == 0) {
                    that.setData({
                        Approver: names.join(","),
                        PeopleId: userids.join(","),
                    });
                }
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
                                    userids.push(d.userid);
                                    d.userId = d.userid;
                                }
                            }
                            that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                            names = [...new Set(names)]; //数组去重
                            userids = [...new Set(userids)]; //数组去重

                            that.setData({
                                Approver: names.join(","),
                                PeopleId: userids.join(","),
                            });
                        },
                        deptId
                    );
                }
                else if (res.departments.length > 0 && res.users.length > 0) {
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
                                Approver: names.join(","),
                                PeopleId: userids.join(","),
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function (err) { },
        });
    },
    // choosePeoples(e) {
    //     let that = this;
    //     console.log("start choose people");
    //     dd.complexChoose({
    //         ...that.data.chooseParam,
    //         title: "选择审批人",
    //         multiple: that.data.multiple || false,
    //         success: function(res) {
    //             console.log(res);
    //             let names = [];
    //             let ids = [];
    //             let addPeoples = [];

    //             if (res.departments.length == 0) {
    //                 for (let d of res.users) {
    //                     names.push(d.name);
    //                     ids.push(d.userId);
    //                     addPeoples.push({
    //                         name: d.name,
    //                         userId: d.userId,
    //                     });
    //                 }
    //                 that.setData({
    //                     Approver: names.join(","),
    //                     PeopleId: ids.join(","),
    //                 });
    //             } else {
    //                 let deptId = [];
    //                 for (let i of res.departments) {
    //                     deptId.push(i.id);
    //                 }
    //                 that.postDataReturnData(
    //                     "DingTalkServers/GetDeptAndChildUserListByDeptId",
    //                     res => {
    //                         console.log(res.data);
    //                         that.data.pickedUsers = [];
    //                         that.data.pickedDepartments = [];
    //                         let userlist = [];
    //                         for (let i in res.data) {
    //                             let data = JSON.parse(res.data[i]);
    //                             that.data.pickedDepartments.push(i);
    //                             userlist.push(...data.userlist);
    //                             for (let d of data.userlist) {
    //                                 that.data.pickedUsers.push(d.userid);
    //                                 names.push(d.name);
    //                                 ids.push(d.userid);
    //                                 addPeoples.push({
    //                                     name: d.name,
    //                                     userId: d.userId,
    //                                 });
    //                                 d.userId = d.userid;
    //                             }
    //                         }
    //                         names = [...new Set(names)]; //数组去重
    //                         ids = [...new Set(ids)]; //数组去重
    //                         that.setData({
    //                             Approver: names.join(","),
    //                             PeopleId: ids.join(","),
    //                         });
    //                     },
    //                     deptId
    //                 );
    //             }
    //         },
    //         fail: function(err) {},
    //     });
    // },
    //添加--取消
    cancel() {
        this.setData({
            IsSend: false,
            IsBack: false,
            show: false,
            firstNeedArray: [],
            secondNeedArray: [],
            thirdNeedArray: [],
            choosePeopleArray: [],
            ChoseType: [],
            Approver: "",
            hidden: !this.data.hidden,
        });
        this.createMaskHideAnim();
        this.createContentHideAnim();
    },
    //编辑--取消
    cancel2() {
        this.setData({
            IsSend: false,
            IsBack: false,
            show: false,
            firstNeedArray: [],
            secondNeedArray: [],
            thirdNeedArray: [],
            choosePeopleArray: [],
            ChoseType: [],
            Approver: "",
            hidden2: !this.data.hidden2,
        });
        this.createMaskHideAnim();
        this.createContentHideAnim();
    },
    //添加--是否退回
    radioChangeOne(e) {
        this.setData({
            IsBack: e.detail.value,
        });
    },
    //添加--是否抄送
    radioChangeTwo(e) {
        console.log(e);
        this.setData({
            Approver: "",
            isBack: false,
            show: false,
            multiple: e.detail.value,
            IsSend: e.detail.value,
        });
    },
    //添加--是否需要选人
    radioChangeThree(e) {
        this.setData({
            show: e.detail.value,
        });
    },
    // 变换需要选人节点时，相应三个节点数组 也要跟着变
    onChanges(e) {
        let arr = e.detail.value.sort();

        let arr1 = [];
        let arr2 = [];
        let arr3 = [];
        let arr4 = [];

        for (let i = 0, len = arr.length; i < len; i++) {
            arr1.push({ name: `${arr[i]}`, value: `${arr[i]}`, checked: false });
            arr2.push({ name: `${arr[i]}`, value: `${arr[i]}`, checked: false });
            arr3.push({ name: `${arr[i]}`, value: `${arr[i]}`, checked: false });
        }
        if (this.data.firstNeedArray.length > 0) {
            for (let i of this.data.firstNeedArray) {
                for (let j of arr1) {
                    if (i.checked == true && i.value == j.value) {
                        j.checked = true;
                    }
                }
            }
        }
        if (this.data.secondNeedArray.length > 0) {
            for (let i of this.data.secondNeedArray) {
                for (let j of arr2) {
                    if (i.checked == true && i.value == j.value) {
                        j.checked = true;
                    }
                }
            }
        }
        if (this.data.thirdNeedArray.length > 0) {
            for (let i of this.data.thirdNeedArray) {
                for (let j of arr3) {
                    if (i.checked == true && i.value == j.value) {
                        j.checked = true;
                    }
                }
            }
        }

        for (let i = 0, length = this.data.needChoose.length; i < length; i++) {
            for (let j of arr) {
                if (j == this.data.needChoose[i].value) {
                    arr4.push(`${j}`);
                    break;
                }
            }
        }
        console.log(arr);

        console.log(arr1);
        console.log(arr2);
        console.log(arr3);

        this.setData({
            firstNeedArray: arr1, //需要多选节点
            secondNeedArray: arr2, //必选节点
            thirdNeedArray: arr3, //角色选人
            ChoseNodeId: arr4,
        });
    },
    //添加--需要多选节点IsSelectMore
    onChangeFisrt(e) {
        let value = e.detail.value;
        console.log(value);
        console.log(this.data.firstNeedArray);

        for (let i of this.data.firstNeedArray) {
            if (value.length > 0) {
                for (let j of value) {
                    if (j == i.value) {
                        i.checked = true;
                        break;
                    } else {
                        i.checked = false;
                    }
                }
            } else {
                i.checked = false;
            }
        }
        this.setData({
            firstNeedArray: this.data.firstNeedArray,
        });
    },
    //添加--必选节点IsMandatory
    onChangeSecond(e) {
        let value = e.detail.value;
        console.log(value);
        console.log(this.data.secondNeedArray);
        for (let i of this.data.secondNeedArray) {
            if (value.length > 0) {
                for (let j of value) {
                    if (j == i.value) {
                        i.checked = true;
                        break;
                    } else {
                        i.checked = false;
                    }
                }
            } else {
                i.checked = false;
            }
        }
        this.setData({
            secondNeedArray: this.data.secondNeedArray,
        });
    },
    //添加--角色选人节点ChoseType
    onChangeThird(e) {
        let arr = e.detail.value.sort();
        let value = e.detail.value;
        let arrs = [];
        for (let i of arr) {
            arrs.push({
                index: i,
                roleIndex: -1,
            });
        }
        console.log(value);
        console.log(this.data.secondNeedArray);
        for (let i of this.data.thirdNeedArray) {
            if (value.length > 0) {
                for (let j of value) {
                    if (j == i.value) {
                        i.checked = true;
                        break;
                    } else {
                        i.checked = false;
                    }
                }
            } else {
                i.checked = false;
            }
        }
        this.setData({
            choosePeopleArray: arrs,
            ChoseType: this.data.thirdNeedArray,
        });
    },
    //添加--角色选人函数
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
            choosePeopleArray: this.data.choosePeopleArray,
        });
    },
    //获取所有角色信息
    onReady() {
        let that = this;
        this._postData("Role/GetRoleInfoList", res => {
            let roleList = [];
            for (let i in res) {
                roleList.push(i);
            }
            that.setData({
                roleList: roleList,
            });
        });
    },
    changeArray() {
        console.log(this.data.ChoseNodeId);
        console.log(this.data.firstNeedArray);
        console.log(this.data.secondNeedArray);
        console.log(this.data.thirdNeedArray);

        let IsSelectMore = [],
            IsMandatory = [],
            ChoseType = [];
        if (this.data.ChoseNodeId) {
            for (let i = 0, len = this.data.ChoseNodeId.length; i < len; i++) {
                if (this.data.firstNeedArray[i].checked) {
                    IsSelectMore[i] = "1";
                } else {
                    IsSelectMore[i] = "0";
                }
            }

            for (let i = 0, len = this.data.ChoseNodeId.length; i < len; i++) {
                if (this.data.secondNeedArray[i].checked) {
                    IsMandatory[i] = "1";
                } else {
                    IsMandatory[i] = "0";
                }
            }
            for (let i = 0, len = this.data.ChoseNodeId.length; i < len; i++) {
                if (this.data.thirdNeedArray[i].checked) {
                    ChoseType[i] = "1";
                } else {
                    ChoseType[i] = "0";
                }
            }
            console.log(IsSelectMore);
            console.log(IsMandatory);
            console.log(ChoseType);
            this.setData({
                IsSelectMore: IsSelectMore,
                IsMandatory: IsMandatory,
                ChoseType: ChoseType,
            });
        }
    },
    //添加提交
    submit(e) {
        let that = this;
        let value = e.detail.value;

        if (value.NodeName == "") {
            dd.alert({
                content: "节点名称不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        // if (value.NodePeople == "") {
        //     dd.alert({
        //         content: "审批人不允许为空，请输入！",
        //         buttonText: promptConf.promptConf.Confirm
        //     });
        //     return;
        // }
        // ChoseType

        this.changeArray();

        let str = "";
        if (this.data.choosePeopleArray.length > 0) {
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
        }

        let nodeInfo = {
            NodeId: that.data.NodeId + 1,
            FlowId: that.data.FlowId.flowId,
            NodeName: value.NodeName,
            NodePeople: value.NodePeople ? value.NodePeople.split(",") : "",
            PeopleId: that.data.PeopleId ? that.data.PeopleId.split(",") : "",
            PreNodeId: that.data.NodeId + 2,
            IsAllAllow: true,
            IsBack: value.IsBack || false,
            IsNeedChose: value.IsNeedChose || false,
            IsSend: that.data.IsSend || false,
            BackNodeId: value.BackNodeId || "",
            ChoseNodeId: that.data.ChoseNodeId ? that.data.ChoseNodeId.join(",") : "",
            IsSelectMore: that.data.IsSelectMore ? that.data.IsSelectMore.join(",") : "",
            IsMandatory: that.data.IsMandatory ? that.data.IsMandatory.join(",") : "",
            ChoseType: that.data.ChoseType ? that.data.ChoseType.join(",") : "",
            RoleNames: str || "",
            RolesList: {},
        };
        for (let i = 0, length = this.data.nodeList.length; i < length; i++) {
            if (this.data.NodeId == this.data.nodeList[i].NodeId) {
                this.data.nodeList.splice(this.data.NodeId + 1, 0, nodeInfo);
                for (let j = i + 2, length = that.data.nodeList.length; j < length; j++) {
                    that.data.nodeList[j].NodeId += 1;
                    that.data.nodeList[j].PreNodeId = (
                        parseInt(that.data.nodeList[j].PreNodeId) + 1
                    ).toString();
                }
            }
        }
        console.log(this.data.nodeList); 
        this.setData({
            nodeList: this.data.nodeList,
            IsSend: false,
            IsBack: false,
            show: false,
            firstNeedArray: [],
            secondNeedArray: [],
            thirdNeedArray: [],
            ChoseType: [],
            hidden: !this.data.hidden,
        });
        this.createMaskHideAnim();
        this.createContentHideAnim();
    },
    //编辑提交
    editorSubmit(e) {
        let that = this;

        let value = e.detail.value;
        if (value.NodeName == "") {
            dd.alert({
                content: "节点名称不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        // if (value.NodePeople == "") {
        //     dd.alert({
        //         content: "审批人不允许为空，请输入！",
        //         buttonText: promptConf.promptConf.Confirm
        //     });
        //     return;
        // }
        // ChoseType

        this.changeArray();

        let str = "";
        if (this.data.choosePeopleArray.length > 0) {
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
        }

        let nodeInfo = {
            NodeId: that.data.NodeId,
            FlowId: that.data.FlowId.flowId,
            NodeName: value.NodeName,
            NodePeople: value.NodePeople ? value.NodePeople.split(",") : "",
            PeopleId: that.data.PeopleId
                ? that.data.PeopleId.split(",")
                : that.data.nodeInfo.PeopleId,
            PreNodeId: that.data.nodeInfo.PreNodeId,
            IsAllAllow: true,
            IsBack: value.IsBack || false,
            IsNeedChose: value.IsNeedChose || false,
            IsSend: that.data.IsSend || false,
            BackNodeId: value.BackNodeId || "",
            ChoseNodeId: that.data.ChoseNodeId ? that.data.ChoseNodeId.join(",") : "",
            IsSelectMore: that.data.IsSelectMore ? that.data.IsSelectMore.join(",") : "",
            IsMandatory: that.data.IsMandatory ? that.data.IsMandatory.join(",") : "",
            ChoseType: that.data.ChoseType ? that.data.ChoseType.join(",") : "",
            RoleNames: str || "",
            RolesList: {},
        };
        console.log(nodeInfo);
        this.data.nodeList[this.data.NodeId] = nodeInfo;
        this.setData({
            nodeList: this.data.nodeList,
            IsSend: false,
            IsBack: false,
            show: false,
            firstNeedArray: [],
            secondNeedArray: [],
            thirdNeedArray: [],
            choosePeopleArray: [],
            ChoseType: [],
            hidden2: !this.data.hidden2,
        });
        this.createMaskHideAnim();
        this.createContentHideAnim();
    },

    //保存所有节点
    save() {
        console.log(this.data.nodeList);
        let nodeArray = this.data.nodeList;
        for (let i = 0, length = this.data.nodeList.length; i < length; i++) {
            console.log(i);
            nodeArray[i].NodePeople = nodeArray[i].NodePeople
                ? nodeArray[i].NodePeople.join(",")
                : "";
            nodeArray[i].PeopleId = nodeArray[i].PeopleId ? nodeArray[i].PeopleId.join(",") : "";
        }

        this._postData(
            "FlowInfoNew/UpdateNodeInfos",
            res => {
                dd.alert({
                    content: promptConf.promptConf.UpdateSuccess,
                    buttonText: promptConf.promptConf.Confirm,
                });
                setTimeout(() => {
                    dd.navigateBack({
                        delta: 1,
                    });
                }, 500);
            },
            nodeArray
        );
    },
});
