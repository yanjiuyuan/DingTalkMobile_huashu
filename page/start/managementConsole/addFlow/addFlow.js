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
        current: 0,
        position: "0px 0px",
        IsEnableArray: [
            { name: "是", label: 1, checked: true },
            { name: "否", label: 0 },
        ],
        IsSupportMobileArray: [
            { name: "是", label: true, checked: true },
            { name: "否", label: false },
        ],
        IsFlowArray: [
            { name: "是", label: true, checked: true },
            { name: "否", label: false },
        ],
        IsSupportMobile: true,
    },
    onLoad(options) {
        let item = JSON.parse(options.item);

        this.setData({
            item: item,
            CreateMan: app.userInfo.nickName,
            CreateManId: app.userInfo.userid,
        });
    },

    radioChangeTwo(e) {
        console.log(e.detail.value);
        this.setData({
            IsSupportMobile: e.detail.value,
        });
    },
    //配置节点信息
    setNodeInfo() {
        dd.navigateTo({
            url: "../addFlow/setNodeInfo/setNodeInfo",
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
    submit(e) {
        let value = e.detail.value;
        console.log(value);
        if (value.flowId.trim() == "") {
            dd.alert({
                content: "流程Id不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
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
        value.ApplyTime = this.data.DateStr + " " + this.data.TimeStr;
        value.CreateManId = app.userInfo.userid;
        value.OrderBY = 998;
        value.State = 1;
        value.Sort_ID = this.data.item.Sort_ID;
        value.Title = "";
        value.IsFlow = false;
        value.ApplyMan = "";
        value.position = this.data.position;
        let obj = {
            applyManId: app.userInfo.userid,
            flowsList: [value],
        };
        console.log(obj);
        this._postData(
            "FlowInfoNew/FlowAdd",
            res => {
                dd.alert({
                    content: promptConf.promptConf.AddSuccess,
                    buttonText: promptConf.promptConf.Confirm,
                });
                setTimeout(() => {
                    dd.navigateBack({
                        delta: 1,
                    });
                }, 500);
            },
            obj
        );
    },
    choose(e) {
        let index = e.target.dataset.index;
        let x = -(index % 9) * 90 + "px";
        let y = -parseInt(index / 9) * 90 + "px";
        let position = x + " " + y;
        this.setData({
            current: index,
            position: position,
        });
    },
});
