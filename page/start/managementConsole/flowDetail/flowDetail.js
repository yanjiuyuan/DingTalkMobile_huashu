import pub from "/util/public";
import promptConf from "/util/promptConf.js";
const app = getApp();
Page({
    ...pub.func,
    data: {
        ...pub.data,

        background: [
            {
                url: "/image/icons/1-1.png",
            },
            {
                url: "/image/icons/1-2.png",
            },
            {
                url: "/image/icons/1-3.png",
            },
            {
                url: "/image/icons/1-4.png",
            },
            {
                url: "/image/icons/1-5.png",
            },
            {
                url: "/image/icons/1-6.png",
            },
            {
                url: "/image/icons/1-7.png",
            },
            {
                url: "/image/icons/1-8.png",
            },
            {
                url: "/image/icons/1-9.png",
            },
            {
                url: "/image/icons/2-1.png",
            },
            {
                url: "/image/icons/2-2.png",
            },
            {
                url: "/image/icons/2-3.png",
            },
            {
                url: "/image/icons/2-4.png",
            },
            {
                url: "/image/icons/2-5.png",
            },
            {
                url: "/image/icons/2-6.png",
            },
            {
                url: "/image/icons/2-7.png",
            },
            {
                url: "/image/icons/2-8.png",
            },
            {
                url: "/image/icons/2-9.png",
            },
            {
                url: "/image/icons/3-1.png",
            },
            {
                url: "/image/icons/3-2.png",
            },
            {
                url: "/image/icons/3-3.png",
            },
            {
                url: "/image/icons/3-4.png",
            },
            {
                url: "/image/icons/3-5.png",
            },
            {
                url: "/image/icons/3-6.png",
            },
            {
                url: "/image/icons/3-7.png",
            },
            {
                url: "/image/icons/3-8.png",
            },
            {
                url: "/image/icons/3-9.png",
            },
            {
                url: "/image/icons/4-1.png",
            },
            {
                url: "/image/icons/4-2.png",
            },
            {
                url: "/image/icons/4-3.png",
            },
            {
                url: "/image/icons/4-4.png",
            },
            {
                url: "/image/icons/4-5.png",
            },
            {
                url: "/image/icons/4-6.png",
            },
            {
                url: "/image/icons/4-7.png",
            },
            {
                url: "/image/icons/4-8.png",
            },
            {
                url: "/image/icons/4-9.png",
            },
            {
                url: "/image/icons/5-1.png",
            },
            {
                url: "/image/icons/5-2.png",
            },
            {
                url: "/image/icons/5-3.png",
            },
            {
                url: "/image/icons/5-4.png",
            },
            {
                url: "/image/icons/5-5.png",
            },
            {
                url: "/image/icons/5-6.png",
            },
            {
                url: "/image/icons/5-7.png",
            },
            {
                url: "/image/icons/5-8.png",
            },
            {
                url: "/image/icons/5-9.png",
            },
        ],
        activeColor: "#4796fa",
        IsEnableArray: [
            { name: "是", label: 1 },
            { name: "否", label: 0 },
        ],
        IsSupportMobileArray: [
            { name: "是", label: true },
            { name: "否", label: false },
        ],
        IsFlowArray: [
            { name: "是", label: true },
            { name: "否", label: false },
        ],
    },

    onLoad(option) {
        let that = this;

        // let item = JSON.parse(option.item);
        // let sort = JSON.parse(option.sort);

        let Sort_ID = option.Sort_ID;
        let FlowId = option.FlowId;

        this._getData(
            "FlowInfoNew/LoadFlowSort" +
                that.formatQueryStr({ userid: app.userInfo.userid, IsAll: true }),
            function(res) {
                console.log(res);
                let item, sort;
                for (let i of res) {
                    if (Sort_ID == i.Sort_ID) {
                        for (let j of i.flows) {
                            if (FlowId == j.FlowId) {
                                sort = i;
                                item = j;
                                break;
                            }
                        }
                    }
                }
                console.log(item);
                for (let i of that.data.IsEnableArray) {
                    if (item.IsEnable == i.label) {
                        i.checked = true;
                    } else {
                        i.checked = false;
                    }
                }
                for (let i of that.data.IsSupportMobileArray) {
                    if (item.IsSupportMobile == i.label) {
                        i.checked = true;
                    } else {
                        i.checked = false;
                    }
                }

                for (let i of that.data.IsFlowArray) {
                    if (item.IsFlow == i.label) {
                        i.checked = true;
                    } else {
                        i.checked = false;
                    }
                }
                let current = that.pxToCurrent(item.Position);
                that.setData({
                    tableInfo: item,
                    current: current,
                    originalCurrent: current,
                    sort: sort,
                    IsEnableArray: that.data.IsEnableArray,
                    IsSupportMobileArray: that.data.IsSupportMobileArray,
                    IsFlowArray: that.data.IsFlowArray,
                });
            }
        );
    },
    //配置节点信息
    setNodeInfo() {
        dd.navigateTo({
            url: "setNodeInfo/setNodeInfo?flowId=" + this.data.tableInfo.FlowId,
        });
    },
    choosePeople(e) {
        console.log("start choose people");
        let that = this;
        dd.complexChoose({
            ...that.data.chooseParam,
            pickedUsers: that.data.pickedUsers || [], //已选用户
            multiple: true,
            title: "权限成员",
            success: function(res) {
                console.log(res);
                let names = []; //userId
                let ids = [];
                if (res.departments.length == 0) {
                    that.data.pickedUsers = [];
                    for (let d of res.users) {
                        that.data.pickedUsers.push(d.userId);
                        names.push(d.name);
                        ids.push(d.userId);
                    }
                    that.setData({
                        "tableInfo.ApplyMan": names.join(","),
                        "tableInfo.ApplyManId": ids.join(","),
                    });
                } else {
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
                                "tableInfo.ApplyMan": names.join(","),
                                "tableInfo.ApplyManId": ids.join(","),
                            });
                        },
                        deptId
                    );
                }
            },
            fail: function(err) {},
        });
    },
    radioChangeTwo(e) {
        this.setData({
            ["tableInfo.IsSupportMobile"]: !this.data.tableInfo.IsSupportMobile,
        });
    },
    radioChangeThree(e) {
        this.setData({
            ["tableInfo.IsFlow"]: !this.data.tableInfo.IsFlow,
        });
    },
    submit(e) {
        let value = e.detail.value;
        console.log(value);
        if (value.FlowName.trim() == "") {
            dd.alert({
                content: "流程名称不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (value.PcUrl.trim() == "") {
            dd.alert({
                content: "PC页面路径不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        if (value.hasOwnProperty("ApproveUrl") && value.ApproveUrl.trim() == "") {
            dd.alert({
                content: "移动端通知路径不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }

        for (let i in this.data.tableInfo) {
            for (let j in value) {
                if (i == j) {
                    this.data.tableInfo[i] = value[j];
                }
            }
        }

        this.data.sort.flows = [this.data.tableInfo];
        let obj = {
            applyManId: app.userInfo.userid,
            FlowSortList: [this.data.sort],
        };
        this._postData(
            "FlowInfoNew/LoadFlowModify",
            res => {
                dd.alert({
                    content: promptConf.promptConf.UpdateSuccess,
                    buttonText: promptConf.promptConf.Confirm,
                });
                setTimeout(() => {
                    // dd.redirectTo({
                    //     url: "/page/start/managementConsole/managementConsole"
                    // });
                    dd.navigateBack({
                        delta: 1,
                    });
                }, 500);
            },
            obj
        );
    },

    pxToCurrent(str) {
        let arr = str.split(" ");
        let x = -arr[0].replace("px", "") / 90;
        let y = -arr[1].replace("px", "") / 90;
        let current = y * 9 + x;
        console.log(current);
        return current;
    },
    choose(e) {
        console.log(e);
        let index = e.target.dataset.index;
        let x = -(index % 9) * 90 + "px";
        let y = -parseInt(index / 9) * 90 + "px";
        let position = x + " " + y;
        this.setData({
            current: index,
            "tableInfo.position": position,
        });
    },
});
