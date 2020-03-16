import pub from "/util/public";
import promptConf from "/util/promptConf.js";
const app = getApp();
Page({
    ...pub.data,
    ...pub.func,
    data: {
        List: []
    },
    onLoad() {},

    choosePeople(e) {
        let that = this;
        dd.complexChoose({
            title: "选择离职人员", //标题
            multiple: false, //是否多选
            limitTips: "超出了人数范围", //超过限定人数返回提示
            maxUsers: 10, //最大可选人数
            pickedUsers: [], //已选用户
            pickedDepartments: [], //已选部门
            appId: app.globalData.appId, //微应用的Id
            responseUserOnly: false, //返回人，或者返回人和部门
            startWithDepartmentId: 0, // 0表示从企业最上层开始},
            success: function(res) {
                that.setData({
                    user: res.users[0]
                });
                that._getData("FlowInfoNew/GetNodeInfoInfoByApplyManId?applyManId=" + res.users[0].userId, result => {
                    // that._getData("FlowInfoNew/GetNodeInfoInfoByApplyManId?applyManId=" + "023752010629202711", result => {
                    if (JSON.stringify(result) == "{}") {
                        that.setData({
                            severanceOfficer: res.users[0].name,
                            severanceOfficerId: res.users[0].userId
                        });
                        dd.alert({
                            content: promptConf.promptConf.NoNodeInformation,
                            buttonText: promptConf.promptConf.Confirm
                        });
                        return;
                    }
                    let processData = [];
                    let sortItems = [];
                    let resultKey = Object.keys(result);
                    for (let i in result) {
                        processData.push(result[i]);
                        sortItems.push({
                            show: "hidden",
                            rotate: "RotateToTheRight"
                        });
                    }
                    for (let i in processData) {
                        processData[i] = {
                            flowName: resultKey[i],
                            nodeList: that.Arrangement(processData[i], res.users[0].name, res.users[0].userId)
                            // nodeList: that.Arrangement(processData[i], "王平江", "023752010629202711")
                        };
                    }
                    console.log(processData);
                    that.setData({
                        processData: processData,
                        sortItems: sortItems,
                        severanceOfficer: res.users[0].name,
                        severanceOfficerId: res.users[0].userId
                    });
                });
            },
            fail: function(err) {}
        });
    },
    //整理数组
    Arrangement(array, name, id) {
        //单人
        for (let i = 0, len = array.length; i < len; i++) {
            if (array[i].PeopleId != null && array[i].PeopleId.indexOf(id) != -1) {
                array[i].AddPeople = [{ name: name, userId: id }];
            }
        }
        //多人
        // for (let i = 0, len = array.length; i < len; i++) {
        // 	if (array[i].PeopleId != null) {
        // 		let NodePeople = array[i].NodePeople.split(',');
        // 		let PeopleId = array[i].PeopleId.split(',');
        // 		console.log(NodePeople);
        // 		console.log(PeopleId);
        // 		for (let j = 0, len = NodePeople.length; j < len; j++) {
        // 			if (array[i].NodePeople.indexOf(NodePeople[j]) != -1) {
        // 				array[i].AddPeople = array[i].AddPeople || [];
        // 				array[i].AddPeople.push({ name: NodePeople[j], userId: PeopleId[j] });
        // 			}
        // 		}
        // 	}
        // }
        console.log(array);
        return array;
    },
    choosePeopleAndChange(e) {
        let index = e.currentTarget.dataset.index;
        let NodeId = e.currentTarget.dataset.NodeId;
        let that = this;
        console.log(index);
        console.log(NodeId);

        dd.complexChoose({
            title: "选择变更人员", //标题
            multiple: false, //是否多选
            limitTips: "超出了人数范围", //超过限定人数返回提示
            maxUsers: 10, //最大可选人数
            pickedUsers: [], //已选用户
            pickedDepartments: [], //已选部门
            appId: app.globalData.appId, //微应用的Id
            responseUserOnly: false, //返回人，或者返回人和部门
            startWithDepartmentId: 0, // 0表示从企业最上层开始},
            success: function(res) {
                that.data.processData[index].nodeList[NodeId].NodePeople = that.data.processData[index].nodeList[
                    NodeId
                ].NodePeople.replace(that.data.user.name, res.users[0].name);
                that.data.processData[index].nodeList[NodeId].PeopleId = that.data.processData[index].nodeList[
                    NodeId
                ].PeopleId.replace(that.data.user.userId, res.users[0].userId);

                that.data.processData[index].nodeList[NodeId].AddPeople = [
                    { name: res.users[0].name, userId: res.users[0].userId }
                ];
                console.log(that.data.processData[index].nodeList);
                that._postData(
                    "FlowInfoNew/UpdateNodeInfos",
                    res => {
                        that.setData({
                            processData: that.data.processData
                        });
                        dd.alert({
                            content: promptConf.promptConf.UpdateSuccess,
                            buttonText: promptConf.promptConf.Confirm
                        });
                    },
                    that.data.processData[index].nodeList
                );
            }
        });
    },
    showOrClose(e) {
        let index = e.target.dataset.index;
        if (this.data.sortItems[index].rotate == "RotateToTheRight") {
            let item = this.data.sortItems;
            item[index] = {
                show: "show",
                rotate: "Rotate-downward"
            };
            this.setData({
                sortItems: item
            });
        } else if (this.data.sortItems[index].rotate === "Rotate-downward") {
            let item = this.data.sortItems;
            item[index] = {
                show: "hidden",
                rotate: "RotateToTheRight"
            };
            this.setData({
                sortItems: item
            });
        }

        // /FlowInfoNew/UpdateNodeInfos
    },
    search(e) {
        let that = this;
        let value = e.detail.value;
        if (value.CooperateMan.trim() == "") {
            dd.alert({
                content: "离职人员不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }

        let obj = {
            applyMan: value.CooperateMan
        };
        this.setData({
            processData: undefined
        });
        this._getData("FlowInfoNew/GetAllUserInfo" + this.formatQueryStr(obj), res => {
            if (res.length == 0) {
                dd.alert({
                    content: promptConf.promptConf.SearchNoReturn,
                    buttonText: promptConf.promptConf.Confirm
                });
                that.setData({
                    People: res
                });
                return;
            }
            if (res.length == 1) {
                that.getSortData(res[0]);
                that.setData({
                    People: res
                });
            }
            if (res.length > 1) {
                that.setData({
                    People: res
                });
            }
        });
    },
    getSortData(user) {
        let that = this;
        that._getData("FlowInfoNew/GetNodeInfoInfoByApplyManId?applyManId=" + user.applyManId, result => {
            if (JSON.stringify(result) == "{}") {
                that.setData({
                    severanceOfficer: user.applyMan,
                    severanceOfficerId: user.applyManId
                });
                dd.alert({
                    content: promptConf.promptConf.NoNodeInformation,
                    buttonText: promptConf.promptConf.Confirm
                });
                return;
            }
            let processData = [];
            let sortItems = [];
            let resultKey = Object.keys(result);
            for (let i in result) {
                processData.push(result[i]);
                sortItems.push({
                    show: "hidden",
                    rotate: "RotateToTheRight"
                });
            }
            for (let i in processData) {
                processData[i] = {
                    flowName: resultKey[i],
                    nodeList: that.Arrangement(processData[i], user.applyMan, user.applyManId)
                };
            }
            console.log(processData);
            that.setData({
                processData: processData,
                sortItems: sortItems,
                severanceOfficer: user.applyMan,
                severanceOfficerId: user.applyManId
            });
        });
    },
    chose(e) {
        console.log(e);
        let user = e.currentTarget.dataset.item;
        this.getSortData(user);
    }
});
