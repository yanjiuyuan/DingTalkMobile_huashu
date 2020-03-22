import pub from "/util/public";
import promptConf from "/util/promptConf.js";
let good = {};
Page({
    ...pub.func,
    ...pub.func.start,
    data: {
        ...pub.data,
        // disablePage: false,
        chosePeople: [],
        addPeopleNodes: [2, 5], //额外添加审批人节点数组
        //研究院id
        managers: [
            {
                name: "徐丽华",
                userId: "15543527578095619"
            },
            {
                name: "陈思杨",
                userId: "15545554432996107"
            }
        ]
    },
    submit(e) {
        let value = e.detail.value;
        console.log(value);

        if (value.title.trim() == "") {
            dd.alert({
                content: `标题不能为空，请输入!`,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.Name.trim() == "") {
            dd.alert({
                content: `申请名称不能为空，请输入!`,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (this.data.stateIndex == -1) {
            dd.alert({
                content: "申请类别不能为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (this.data.projectIndex == -1) {
            dd.alert({
                content: "项目名称不能为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }

        if (value.Inventor == "") {
            dd.alert({
                content: "申请发明人不能为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        value["Type"] = this.data.IntellectualPropertyTypes[this.data.stateIndex];
        value["ActualName"] = value["Name"];
        value["Project"] = this.data.projectList[this.data.projectIndex].ProjectName;
        value["ProjectNo"] = this.data.projectList[this.data.projectIndex].ProjectId;
        value["ProjectId"] = this.data.projectList[this.data.projectIndex].ProjectId;
        value["ProjectName"] = this.data.projectList[this.data.projectIndex].ProjectName;
        value["InventorId"] = this.data.table.InventorId;
        value["Inventor"] = this.data.table.Inventor;
        value["ActualInventor"] = this.data.table.ActualInventor;
        value["ActualInventorId"] = this.data.table.ActualInventorId;

        value["Type"] == "软件著作权"
            ? (this.data.nodeList[5].AddPeople = [this.data.managers[1]])
            : (this.data.nodeList[5].AddPeople = [this.data.managers[0]]);
        let callBack = taskId => {
            console.log("提交审批ok!");
            value.TaskId = taskId;
            this._postData(
                "IntellectualProperty/Save",
                res => {
                    this.doneSubmit();
                },
                value
            );
        };
        this.approvalSubmit(value, callBack, value["ProjectId"]);
    },
    //选人 可以实现
    chooseMans(e) {
        console.log("start choose people");
        let nodeId = e.target.targetDataset.NodeId;
        let that = this;
        dd.complexChoose({
            ...that.data.chooseParam,
            // pickedUsers: that.data.pickedUsers || [], //已选用户
            multiple: true,
            title: "申请发明人",
            disabledDepartments: [],
            success: function(res) {
                // console.log("sssssss");
                // console.log(JSON.stringify(res));
                // console.log(JSON.stringify(that.data.chosePeople));
                let names = [];
                let userids = [];

                if (res.departments.length == 0 && res.users.length > 0) {
                    // that.data.pickedUsers = [];
                    for (let d of res.users) {
                        // that.data.pickedUsers.push(d.userId);
                        names.push(d.name);
                        userids.push(d.userId);
                        //添加
                        // if (that.data.chosePeople.indexOf(d.name) == -1) {
                        //     that.data.chosePeople.push(d.name);
                        // }
                        //删除
                    }

                    // console.log(JSON.stringify(that.data.pickedUsers));
                    // console.log(JSON.stringify(that.data.chosePeople));

                    that.setData({
                        "table.Inventor": names.join(","),
                        // "table.Inventor": that.data.chosePeople.join(","),
                        "table.InventorId": userids.join(","),
                        "table.ActualInventor": names.join(","),
                        "table.ActualInventorId": userids.join(",")
                    });
                }
                //全选部门，不选部门外的人
                else if (res.departments.length > 0 && res.users.length == 0) {
                    dd.alert({
                        content: "贡献度和部门人员名单顺序可能不符合，请逐个添加。",
                        buttonText: promptConf.promptConf.Confirm
                    });
                    return;
                }
                // 选择部门也选择部门外的人
                else if (res.departments.length > 0 && res.users.length > 0) {
                    dd.alert({
                        content: "部门人员名单顺序和贡献度可能不符合，请逐个添加。",
                        buttonText: promptConf.promptConf.Confirm
                    });
                    return;
                }
            },
            fail: function(err) {}
        });
    },
    changeState(e) {
        console.log(e.detail.value);
        let Type = this.data.IntellectualPropertyTypes[e.detail.value];
        Type == "软件著作权"
            ? (this.data.nodeList[5].AddPeople = [this.data.managers[1]])
            : (this.data.nodeList[5].AddPeople = [this.data.managers[0]]);

        this.setData({
            stateIndex: e.detail.value,
            nodeList: this.data.nodeList
        });
    },
    changeCompany(e) {
        this.setData({
            companyIndex: e.detail.value
        });
    },
    changeDept(e) {
        this.setData({
            deptIndex: e.detail.value
        });
    },
    changeType(e) {
        this.setData({
            typeIndex: e.detail.value
        });
    }
});
