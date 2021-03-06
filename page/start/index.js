import pub from "/util/public";
import lib from "/lib.js";

let globalData = getApp().globalData;
let app = getApp();
Page({
    ...pub.func,
    onLoad() {
        let that = this;
        // this.update();
        this.checkLogin2(function() {
            that.getMenu();
        });
        this.getDepartmentList();  
        this.getProjectList(); //获取项目列表
        this.getContractNameList(); //获取合同列表
        this.getUserInfo();
        this.getAllAdmin();
    },

    data: {
        ...pub.data,
        pageName: "component/index", 
        pageInfo: {
            pageId: 0,
        },
        curIndex: 0,
        userIndex: -1,
        userList: [],
        sort: [],
        sortItems: [],
        adminRoleList:[],
    },
        //获取超级管理员
    getAllAdmin() {
        let that = this;
        let obj = {
            RoleName: "超级管理员"
        }
        this.getDataReturnData("Role/GetRoleInfo" + lib.func.formatQueryStr(obj), function (res) {
            let a = res.data.map(item=>{
                return item.emplId;
            })
            that.setData({
                adminRoleList: a,
            })

        })


    },
    //选人控件方法
    choosePeople(e) {
        console.log("start choose people");
        let that = this;
        dd.complexChoose({
            ...that.chooseParam,
            multiple: false,
            success: function(res) {
                console.log(res);
                if (res.users.length > 0) {
                    let name = res.users[0].name;
                    let userId = res.users[0].userId;
                    let app = getApp();
                    app.userInfo.name = name;
                    app.userInfo.userid = userId;
                    app.userInfo.nickName = name;
                    that.setData({
                        DingData: {
                            nickName: name,
                            userid: userId,
                        },
                    });
                    dd.httpRequest({
                        url:
                            that.data.dormainName +
                            "DingTalkServers/getUserDetail" +
                            lib.func.formatQueryStr({ userid: res.users[0].userId }),
                        method: "POST",
                        data: "",
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                            Accept: "application/json",
                        },
                        success: function(res) {
                            console.log(res);
                            let name = res.data.name;
                            let DingData = {
                                nickName: name,
                                departName: null,
                                userid: app.userInfo.userid,
                                departmentList: res.data.dept,
                            };
                            app.userInfo = DingData;
                            console.log(DingData);
                            dd.hideLoading();
                            that.setData({ DingData: DingData });
                            that.onLoad(); //更换人物，重新登录
                        },
                    });
                }
            },
            fail: function(err) {},
        });
    },
    update(){
       const updateManager = dd.getUpdateManager();

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate); // 是否有更新
        });

        updateManager.onUpdateReady(function (ret) {
            console.log(ret.version) // 更新版本号
            dd.confirm({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate();
                    }
                }
            })
        });

        updateManager.onUpdateFailed(function () {
            // 新版本下载失败
        })
    },
    upLoadFile() {
        dd.uploadAttachmentToDingTalk({
            image: { multiple: true, compress: false, max: 9, spaceId: "12345" },
            space: { spaceId: "12345", isCopy: 1, max: 9 },
            file: { spaceId: "12345", max: 1 },
            types: ["photo", "camera", "file", "space"], //PC端仅支持["photo","file","space"]
            success: res => {
                console.log(res);
                dd.alert({
                    content: JSON.stringify(res),
                });
            },
            fail: err => {
                dd.alert({
                    content: JSON.stringify(err),
                });
            },
        });
    },

    //选人操作
    selectUser(value) {
        let userIndex = value.detail.value;
        let name = this.data.userList[userIndex].NodePeople;
        let userId = this.data.userList[userIndex].PeopleId;
        let app = getApp();
        app.userInfo.name = name;
        app.userInfo.userid = userId;
        app.userInfo.nickName = name;
        this.onLoad();
        this.setData({
            DingData: {
                nickName: name,
                userid: userId,
            },
            userIndex: value.detail.value,
        });
    },

    getUserInfo() {
        let that = this;
        this._getData("FlowInfoNew/GetUserInfo", data => {
            data.unshift(
                {
                    PeopleId: "056652031835326264",
                    NodePeople: "许瑜瑜",
                },
                {
                    PeopleId: "1561941679066303",
                    NodePeople: "梁炳灿",
                },
                {
                    PeopleId: "175508475239722073",
                    NodePeople: "黄俊生",
                },
                {
                    PeopleId: "100367431324638845",
                    NodePeople: "张顺林",
                },
                {
                    PeopleId: "30426359483381436",
                    NodePeople: "cs",
                },
                {
                    PeopleId: "023300645120473453",
                    NodePeople: "傅云龙",
                }
            );
            that.setData({
                userList: data,
            });
        });
    },

    //点击展示
    showOrClose(event) {
        let index = event.target.dataset.index;
        if (this.data.sortItems[index].text == "展开") {
            let item = this.data.sortItems;
            item[index] = {
                text: "收起",
                class: "dropdown-content-show",
            };
            this.setData({
                sortItems: item,
            });
        } else if (this.data.sortItems[index].text === "收起") {
            let item = this.data.sortItems;
            item[index] = {
                text: "展开",
                class: "dropdown-content",
            };
            this.setData({
                sortItems: item,
            });
        }
    },
});
