const app = getApp();
import pub from "/util/public";
import index from "/page/start/index.js";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    data: {
        ...pub.data,
        ifName: false, //用来新增分组
        hidden: false, //用来修改分组名
        title: "请输入分组名称",
        title_1: "请输入新分组名称",
        editor: false,
        SecondArray: [
            { name: "是", label: 1, checked: true },
            { name: "否", label: 0 }
        ],
        animMaskData: [] //遮罩层
    },
    onLoad() {
        this.getMenu(true);
        this.setData({
            sort: app.globalData.sort,
            menu: app.globalData.menu,
            sortItems: app.globalData.sortItem
        });
    },

    //添加快捷方式
    addShortcut(e) {
        console.log(e);
        let item = JSON.stringify(e.target.dataset.item);
        dd.navigateTo({
            // url: "/page/managementConsole/addShortcut/addShortcut?item=" + item
            url: "/page/start/managementConsole/addFlow/addFlow?item=" + item
        });
    },

    //修改名字
    modifyName(e) {
        let item = e.target.dataset.item;
        console.log(item);
        this.setData({
            tableInfo: item,
            editor: !this.data.editor,
            ifName: !this.data.ifName
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },

    //删除一整个分组
    delete(e) {
        let that = this;
        let item = e.target.dataset.item;
        console.log(item);

        dd.confirm({
            content: "是否删除" + item.SORT_NAME + "整个分组",
            confirmButtonText: promptConf.promptConf.Confirm,
            cancelButtonText: promptConf.promptConf.Cancel,
            success: result => {
                if (result.confirm == true) {
                    let obj = {
                        FlowSortList: [item],
                        applyManId: app.userInfo.userid
                    };
                    console.log(item);
                    this._postData(
                        "FlowInfoNew/FlowSortDelete",
                        res => {
                            this.getMenu(true);
                            dd.alert({
                                content: promptConf.promptConf.DeleteSuccess,
                                buttonText: promptConf.promptConf.Confirm
                            });
                        },
                        obj
                    );
                }
            }
        });
    },
    //删除这一项
    deleteItem(e) {
        console.log(e);
        let item = e.target.dataset.item;
        let obj = {
            applyManId: app.userInfo.userid,
            flowsList: [item]
        };
        console.log(obj);
        dd.confirm({
            title: "温馨提示",
            content: "是否删除" + item.FlowName,
            confirmButtonText: promptConf.promptConf.Confirm,
            cancelButtonText: promptConf.promptConf.Cancel,
            success: result => {
                if (result.confirm == true) {
                    this._postData(
                        "FlowInfoNew/FlowDelete",
                        res => {
                            this.getMenu(true);
                            dd.alert({
                                content: promptConf.promptConf.DeleteSuccess,
                                buttonText: promptConf.promptConf.Confirm
                            });
                        },
                        obj
                    );
                }
            }
        });
    },

    // 新增
    increase() {
        this.setData({
            ifName: !this.data.ifName
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },

    //排序
    sort() {
        dd.navigateTo({
            // url: "/page/managementConsole/sort/sort"
            url: "/page/start/managementConsole/sortTest/sortTest"
            // url: "/page/managementConsole/sortTest_1/sortTest_1"
        });
    },
    confirm(e) {
        let that = this;
        let groupName = e.detail.value.groupName;
        let value = e.detail.value;
        if (value.Sort_ID == "") {
            dd.alert({
                content: "类别Id不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.SORT_NAME == "") {
            dd.alert({
                content: "类别名称不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }

        if (this.data.editor) {
            console.log("编辑");
            console.log(this.data.tableInfo);

            this.data.tableInfo.IsEnable = value.IsEnable;
            this.data.tableInfo.SORT_NAME = value.SORT_NAME;
            this.data.tableInfo.Sort_ID = value.Sort_ID;

            let obj = { FlowSortList: [this.data.tableInfo], applyManId: app.userInfo.userid };

            this._postData(
                "FlowInfoNew/LoadFlowModify",
                res => {
                    this.getMenu(true);
                    dd.alert({
                        content: promptConf.promptConf.UpdateSuccess,
                        buttonText: promptConf.promptConf.Confirm
                    });
                },
                obj
            );
        }
        if (!this.data.editor) {
            console.log("添加");
            let obj = {
                FlowSortList: [
                    {
                        CreateTime: this.data.DateStr + " " + this.data.TimeStr,
                        IsEnable: value.IsEnable,
                        OrderBY: app.globalData.sort[app.globalData.sort.length - 1].OrderBY + 1,
                        SORT_NAME: value.SORT_NAME,
                        ApplyMan: "",
                        ApplyManId: "",
                        Sort_ID: (app.globalData.sort[app.globalData.sort.length - 1].Sort_ID - 0 + 1).toString(),
                        State: 1
                    }
                ],
                applyManId: app.userInfo.userid
            };
            this._postData(
                "FlowInfoNew/FlowSortAdd",
                res => {
                    this.getMenu(true);
                    dd.alert({
                        content: promptConf.promptConf.AddSuccess,
                        buttonText: promptConf.promptConf.Confirm
                    });
                },
                obj
            );
        }

        this.setData({
            ifName: !this.data.ifName,
            editor: !this.data.editor
        });
    },

    cancel(e) {
        this.setData({
            ifName: !this.data.ifName,
            editor: false,
            tableInfo: {}
        });
    },
    //跳转到流程详细信息
    toChange(e) {
        console.log(e);
        let item = e.target.dataset.item;
        let sort = e.target.dataset.sort;
        delete sort.flows;
        dd.navigateTo({
            // url: "flowDetail/flowDetail?item=" + JSON.stringify(item) + "&sort=" + JSON.stringify(sort)
            url: "flowDetail/flowDetail?FlowId=" + item.FlowId + "&Sort_ID=" + sort.Sort_ID
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
                        "tableInfo.ApplyMan": names.join(","),
                        "tableInfo.ApplyManId": userids.join(",")
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
                                "tableInfo.ApplyMan": names.join(","),
                                "tableInfo.ApplyManId": userids.join(",")
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
                                "tableInfo.ApplyMan": names.join(","),
                                "tableInfo.ApplyManId": userids.join(",")
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function(err) {}
        });
    }
});
