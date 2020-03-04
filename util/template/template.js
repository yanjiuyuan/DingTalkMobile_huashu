let globalData = getApp().globalData;
import pub from "/util/public";
import lib from "/lib.js";
export default {
    data: {
        animMaskData: [],
        animContentData: [],
        //选人变量
        nodeList: [],
        chooseParam: {
            title: "审批选人", //标题
            multiple: false, //是否多选
            limitTips: "超出了人数范围", //超过限定人数返回提示
            maxUsers: 10, //最大可选人数
            pickedUsers: [], //已选用户
            pickedDepartments: [], //已选部门
            appId: globalData.appId, //微应用的Id
            responseUserOnly: false, //返回人，或者返回人和部门
            startWithDepartmentId: 0 // 0表示从企业最上层开始},
        },
        //表格变量
        tableData: [],
        tableParam: {
            size: 5,
            now: 1,
            total: 0
        }
    },
    func: {
        //选人控件方法
        choosePeople(e) {
            console.log("start choose people");
            let that = this;
            let nodeId = e.target.dataset.NodeId;
            let arr = that.data.nodeList;
            let index = nodeId;
            let IsMultipleSelection = 0;
            for (let i = nodeId - 1; 0 <= i; i--) {
                if (arr[i].NodeName.indexOf("项目负责人") == 0 || arr[i].NodeName.indexOf("抄送") == 0) {
                    index--;
                }
                if (arr[i].NodeName.indexOf("项目负责人") == -1 && arr[i].IsSelectMore != null) {
                    let IsSelectMoreArray = arr[i].IsSelectMore.split(",");
                    console.log(IsSelectMoreArray);
                    IsMultipleSelection = IsSelectMoreArray[index - 1];
                    console.log("index:" + (index - 1));
                    console.log(IsMultipleSelection);
                }
            }

            dd.complexChoose({
                ...that.data.chooseParam,
                multiple: IsMultipleSelection == 0 || IsMultipleSelection == undefined ? false : true,
                pickedUsers: that.data.pickedUsers || [], //已选用户
                success: function(res) {
                    console.log(res);
                    let users = []; //部门
                    //只选部门外的人
                    if (res.departments.length == 0 && res.users.length > 0) {
                        that.data.pickedUsers = [];
                        for (let d of res.users) {
                            that.data.pickedUsers.push(d.userId);
                        }

                        for (let node of that.data.nodeList) {
                            if (node.NodeId == nodeId) {
                                node.AddPeople = res.users;
                            }
                        }
                        console.log(that.data.nodeList);
                        that.setData({
                            nodeList: that.data.nodeList
                        });
                    }
                    //只选部门，不选部门外的人
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
                                        users.push(d);
                                        d.userId = d.userid;
                                    }
                                }
                                that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                                users = that.objectArrayDuplication(users, "userId"); //对象数组去重
                                for (let node of that.data.nodeList) {
                                    if (node.NodeId == nodeId) {
                                        node.AddPeople = users;
                                    }
                                }
                                console.log(that.data.nodeList);
                                that.setData({
                                    nodeList: that.data.nodeList
                                });
                            },
                            deptId
                        );
                    }
                    //部门外的人和部门一起选
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
                                        users.push(d);
                                        d.userId = d.userid;
                                    }
                                }
                                for (let i of res.users) {
                                    that.data.pickedUsers.push(i.userId);
                                    users.push(i);
                                }
                                that.data.pickedUsers = [...new Set(that.data.pickedUsers)];
                                users = that.objectArrayDuplication(users, "userId"); //对象数组去重
                                for (let node of that.data.nodeList) {
                                    if (node.NodeId == nodeId) {
                                        node.AddPeople = users;
                                    }
                                }
                                console.log(that.data.nodeList);
                                that.setData({
                                    nodeList: that.data.nodeList
                                });
                            },
                            deptId
                        );
                    }

                    /////////////////////////////////旧的选人函数，不支持结合部门的选择
                    // console.log(res);
                    // let result = res;
                    // dd.httpRequest({
                    //     url:
                    //         that.data.dormainName +
                    //         "DingTalkServers/getUserDetail" +
                    //         lib.func.formatQueryStr({ userid: res.users[0].userId }),
                    //     method: "POST",
                    //     headers: { "Content-Type": "application/json; charset=utf-8", Accept: "application/json" },
                    //     success: function(res) {
                    //         let name = res.data.name;
                    //         for (let node of that.data.nodeList) {
                    //             if (node.NodeId == nodeId) {
                    //                 result.users.name = name;
                    //                 node.AddPeople = result.users;
                    //                 console.log(result.users);
                    //             }
                    //         }
                    //         console.log("选择了一个人");
                    //         console.log(that.data.nodeList);
                    //         that.setData({
                    //             nodeList: that.data.nodeList
                    //         });
                    //     }
                    // });
                },
                fail: function(err) {}
            });
        },

        NodePeople(e) {
            console.log(e.currentTarget.dataset.NodePeople);
            let that = this;
            dd.complexChoose({
                title: "已选人数", //标题
                success: function(res) {},
                fail: function(err) {
                    console.log("fail!!");
                }
            });
        },
        showHiding(e) {
            console.log(e.currentTarget.dataset.NodePeople);
            let NodePeople = e.currentTarget.dataset.NodePeople;
            console.log();
            if (typeof NodePeople[0] == "object") {
                let arr = [];
                for (let i of NodePeople) {
                    arr.push(i.name);
                }
                NodePeople = arr;
            }

            dd.navigateTo({
                url: "/util/people/people?chooseMan=" + NodePeople.join(",")
            });
        },
        //翻頁相關事件
        getData(table) {
            let start = this.data.tableParam.size * (this.data.tableParam.now - 1);
            let arr = this.data.data.slice(start, start + this.data.tableParam.size);
            if (table) {
                this.setData({
                    [table]: arr
                });
            } else {
                this.setData({
                    tableData: arr
                });
            }
        },
        handleCurrentChange: function(event) {
            console.log(event.target.dataset.page);

            let page = event.target.dataset.page;
            this.setData({
                "tableParam.now": page
            });
            this.getData();
        },
        //遮罩相关方法
        createMaskShowAnim() {
            console.log("createMaskShowAnim");
            const animation = dd.createAnimation({
                duration: 200,
                timingFunction: "cubic-bezier(.55, 0, .55, .2)"
            });
            this.maskAnim = animation;
            animation.opacity(1).step();
            this.setData({
                animMaskData: animation.export()
            });
        },
        createMaskHideAnim() {
            console.log("createMaskHideAnim");
            this.maskAnim.opacity(0).step();
            this.setData({
                animMaskData: this.maskAnim.export()
            });
        },
        createContentShowAnim() {
            console.log("createContentShowAnim");
            const animation = dd.createAnimation({
                duration: 200,
                timingFunction: "cubic-bezier(.55, 0, .55, .2)"
            });
            this.contentAnim = animation;
            animation.translateY(0).step();
            this.setData({
                animContentData: animation.export()
            });
        },
        createContentHideAnim() {
            console.log("createContentHideAnim");

            this.contentAnim.translateY("100%").step();
            this.setData({
                animContentData: this.contentAnim.export()
            });
        },
        //季老师修改意见
        changeSuggest(e) {
            this.setData({
                changeRemarkId: e.target.targetDataset.NodeId
            });
        },

        bindObjPickerChange(e) {
            this.setData({
                departmentIdnex: e.detail.value
            });
        }
    }
};
