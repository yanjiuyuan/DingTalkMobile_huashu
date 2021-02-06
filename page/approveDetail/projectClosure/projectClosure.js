import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        hiddens: true,
        hidden: true,

        good: {},
        result: {},
        tableParam4: {
            total: 15
        },

        uploadFileConfig: [
            {
                label: "立项书或建议书",
                attribute: "SuggestBook1",
                point: "系统有的内容自动关联文件，没有就是手动上传",
                fileList: []
            },
            {
                label: "评审PPT",
                attribute: "PPT2",
                point: "系统有的内容自动关联文件，没有就是手动上传",
                fileList: []
            },
            {
                label: "需求规格说明书、产品总体设计书",
                attribute: "DemandBook3",
                point: "打包上传",
                fileList: []
            },
            {
                label: "机械设计图纸",
                attribute: "Drawing4",
                point: "打包上传",
                fileList: []
            },
            {
                label: "电气图纸",
                attribute: "Electrical5",
                point: "打包上传",
                fileList: []
            },

            {
                label: "BOM表",
                attribute: "Bom6",
                point: "打包上传",
                fileList: []
            },

            {
                label: "软件源代码",
                attribute: "SourceCode7",
                point: "打包上传",
                fileList: []
            },
            {
                label: "使用说明书/操作手册/技术方案/规格说明书",
                attribute: "UseBook8",
                point: "打包上传",
                fileList: []
            },
            {
                label: "合作协议",
                attribute: "CooperationAgreement9",
                point: "打包上传",
                fileList: []
            },
            {
                label: "产品（样机/成品）图片/影像",
                attribute: "Product10",
                point: "打包上传",
                fileList: []
            },
            {
                label: "阶段性整理的问题的分析、解决方案及计划表",
                attribute: "Solution11",
                point: "打包上传",
                fileList: []
            },
            {
                label: "纵向项目申请/中期检查/验收资料",
                attribute: "AcceptanceData14",
                point: "打包上传",
                fileList: []
            },
            {
                label: "其他过程文档设计报告、评审报告、项目计划、设计更改报告等",
                attribute: "ProcessDocumentation15",
                point: "打包上传",
                fileList: []
            },
            {
                label: "项目终止情况报告",
                attribute: "TerminationReport16",
                point: "打包上传",
                fileList: []
            },
            {
                label: "装箱单",
                attribute: "PackingList17",
                point: "打包上传",
                fileList: []
            },
            {
                label: "客户验收单",
                attribute: "AcceptanceSlip18",
                point: "打包上传",
                fileList: []
            }
        ],

        rotate: "RotateToTheRight",
        show: "hidden",

        rotate1: "RotateToTheRight",
        show1: "hidden",

        rotate2: "RotateToTheRight",
        show2: "hidden",

        rotate3: "RotateToTheRight",
        show3: "hidden",

        rotate4: "RotateToTheRight",
        show4: "hidden",

        tableItems1: [
            {
                prop: "Type",
                label: "类别",
                width: 200
            },
            {
                prop: "ApplyMan",
                label: "申请人",
                width: 200
            },
            {
                prop: "ApplyTime",
                label: "申请时间",
                width: 250
            },
            {
                prop: "OldTaskId",
                label: "流水号",
                width: 200
            }
        ],
        tableItems5: [
            {
                prop: "Types",
                label: "类别",
                width: 200
            },
            {
                prop: "ApplyMan",
                label: "申请人",
                width: 200
            },
            {
                prop: "ApplyTime",
                label: "申请时间",
                width: 250
            },
            {
                prop: "OldTaskId",
                label: "流水号",
                width: 200
            }
        ],

        tableItems2: [
            {
                prop: "ApplicationUnitName",
                label: "转化/应用单位",
                width: 200
            },  
            {
                prop: "Customer",
                label: "客户/联系人",
                width: 200
            },
            {
                prop: "Post",
                label: "职务",
                width: 200
            }, 
            {
                prop: "Tel",
                label: "联系方式",
                width: 200
            }
        ], 

        tableItems3: [
            {
                prop: "Name", 
                label: "申报政策名称",
                width: 200
            },
            {
                prop: "No",
                label: "专项专题编号",
                width: 200
            },
            {
                prop: "Money",
                label: "国拨经费/万",
                width: 200
            },
            {
                prop: "ActualMoney",
                label: "实际到账/万",
                width: 200
            }
        ],

        tableItems4: [
            {
                prop: "Subject",
                label: "科目/备注",
                width: 200
            },
            {
                prop: "Money",
                label: "支出数(资料科目合计)",
                width: 300
            },
            {
                prop: "NameAndMoney",
                label: "支出数计算依据(名称+金额)",
                width: 300
            }
        ],
        tableData4: [
            {
                Money: "",
                NameAndMoney: "",
                Subject: "1、设备费",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "其中：购置",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "试制",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "2、材料费",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "3、测试化验加工费",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "4、燃料动力费",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "5、差旅费",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "6、会议费",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "7、合作与交流费",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "8、出版/文献/信息传播/知识产权事务费",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "9、劳务费",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "10、专家咨询费",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "11、管理费",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "12、其他(如用车成本等)",
                TaskId: null
            },
            {
                Money: "",
                NameAndMoney: "",
                Subject: "合计",
                TaskId: null
            }
        ]
    },
    submit(e) {
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark
        };

        this.data.result.projectFundingList = this.data.tableData4;
        this.data.result.NodeId = this.data.nodeid;
        console.log(this.data.result.projectFundingList);
        console.log(this.data.result);
        let flag = true;
        if (this.data.nodeid == 2) {
            console.log("bbbb");
            for (let i of this.data.result.projectFundingList) {
                if (i.Money == "" || i.NameAndMoney == "") {
                    dd.alert({
                        content: "请完整填写项目经费表",
                        buttonText: promptConf.promptConf.Confirm
                    });
                    flag = false;
                    break;
                }
                flag = true;
            }
        }
        if (flag == true) {
            if (this.data.nodeid == 2) {
                this._postData("ProjectClosure/Modify", res => {}, this.data.result);
            }

            this.aggreSubmit(param);
        }
    },

    onReady() {
        //特殊步骤需要隐藏，需要重置nodeid
        if (this.data.index == 1) {
            this.resetNodeId();
        }
        if (this.data.nodeid == 2 && this.data.index == 0) {
            this.setData({
                tableOperate: "填写"
            });
        }
        for (let i of this.data.tableData4) {
            i.TaskId = this.data.taskid;
        }

        this._getData("ProjectClosure/Read" + this.formatQueryStr({ TaskId: this.data.taskid }), res => {
            console.log(res);

            if (this.data.state != "已完成") {
                // for (let i of this.data.nodeList) {
                // 	if (i.ApplyMan == this.data.DingData.nickName) {
                // 		this.setData({
                // 			nodeid: i.NodeId,
                // 		})
                // 		break;//申请人是否可以是部长
                // 	}
                // }
            }

            let arr1 = [];
            let arr2 = [];
            for (let i of res.detailedLists) {
                if (i.Type == "知识产权申请") {
                    arr1.push(i);
                } else {
                    arr2.push(i);
                }
            }
            //获取知识产权类型
            for (let i of arr1) {
                this._getData("IntellectualProperty/Read" + this.formatQueryStr({ TaskId: i.OldTaskId }), res => {
                    i.Types = res.Type;
                    this.setData({
                        intellectualProperty: arr1
                    });
                });
            }

            for (let i in res.projectClosure) {
                for (let j of this.data.uploadFileConfig) {
                    if (i == j.attribute) {
                        if(res.projectClosure[i]) j.fileList = JSON.parse(res.projectClosure[i]);
                    }
                } 
            }

            this.setData({
                uploadFileConfig: this.data.uploadFileConfig,
                result: res,
                table: res.projectClosure,
                tableData1: arr2,
                "tableParam1.total": arr2.length,
                "tableParam5.total": arr1.length,

                tableData2: res.applicationUnitList,
                "tableParam2.total": res.applicationUnitList.length,
                "tableParam3.total": res.longitudinalProject.length,
                // "tableParam4.total": res.longitudinalProject.length,
                tableData3: res.longitudinalProject,
                tableData4: res.projectFundingList.length !== 0 ? res.projectFundingList : this.data.tableData4,

                Ind: this.data.index
            });
        });
    },

    //显示弹窗表单
    chooseItem(e) {
        if (!e) return;
        console.log(e);
        this.data.good = e.target.targetDataset.row;
        if (!this.data.good) return;

        this.setData({
            Subject: this.data.good.Subject,
            idx: e.target.targetDataset.index,
            hiddens: !this.data.hiddens
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },

    //隐藏弹窗表单
    onModalCloseTap() {
        this.createMaskHideAnim();
        this.createContentHideAnim();
        setTimeout(() => {
            this.setData({
                hiddens: true,
                hidden: true
            });
        }, 210);
    },

    //提交弹窗表单
    addGood(e) {
        let value = e.detail.value;

        console.log(e);
        if (!value || !value.NameAndMoney || !value.Money) {
            dd.alert({
                content: `表单填写不完整`,
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        let param = {
            Id: this.data.good.Id,
            Money: value.Money,
            NameAndMoney: value.NameAndMoney,
            Subject: this.data.good.Subject,
            TaskId: this.data.taskid
        };
        let index = e.buttonTarget.dataset.index;
        console.log(param);

        let Money = 0;
        let NameAndMoney = 0;
        this.data.tableData4[index] = param;
        for (let i = 1, len = this.data.tableData4.length - 1; i < len; i++) {
            Money += this.data.tableData4[i].Money - 0;
            NameAndMoney += this.data.tableData4[i].NameAndMoney - 0;
        }
        let oneMoney = this.data.tableData4[1].Money - 0 + (this.data.tableData4[2].Money - 0);
        let oneNameAndMoney = this.data.tableData4[1].NameAndMoney - 0 + (this.data.tableData4[2].NameAndMoney - 0);

        console.log(this.data.tableData4);

        console.log(Money);
        console.log(NameAndMoney);

        this.setData({
            [`tableData4[${index}]`]: param,
            [`tableData4[0].Money`]: oneMoney,
            [`tableData4[0].NameAndMoney`]: oneNameAndMoney,
            [`tableData4[14].Money`]: Money,
            [`tableData4[14].NameAndMoney`]: NameAndMoney
        });
        this.onModalCloseTap(); //隐藏
    },

    PrintOne() {
        let param = {
            UserId: this.data.DingData.userid,
            TaskId: this.data.taskid,
            Type: 1
        };
        this._postData(
            "ProjectClosure/PrintExcel",
            res => {
                dd.alert({
                    content: promptConf.promptConf.PrintFrom,
                    buttonText: promptConf.promptConf.Confirm
                });
            },
            param
        );
    },
    PrintTwo() {
        let param = {
            UserId: this.data.DingData.userid,
            TaskId: this.data.taskid,
            Type: 2
        };
        this._postData(
            "ProjectClosure/PrintExcel",
            res => {
                dd.alert({
                    content: promptConf.promptConf.PrintFrom,
                    buttonText: promptConf.promptConf.Confirm
                });
            },
            param
        );
    },
    PrintThree() {
        let param = {
            UserId: this.data.DingData.userid,
            TaskId: this.data.taskid,
            Type: 3
        };
        this._postData(
            "ProjectClosure/PrintExcel",
            res => {
                dd.alert({
                    content: promptConf.promptConf.PrintFrom,
                    buttonText: promptConf.promptConf.Confirm
                });
            },
            param
        );
    },

    // 展示和隐藏
    showOrClose() {
        if (this.data.rotate == "RotateToTheRight") {
            this.setData({
                rotate: "Rotate-downward",
                show: "show"
            });
        } else if (this.data.rotate == "Rotate-downward") {
            this.setData({
                rotate: "RotateToTheRight",
                show: "hidden"
            });
        }
    },

    showOrCloseOne() {
        if (this.data.rotate1 == "RotateToTheRight") {
            this.setData({
                rotate1: "Rotate-downward",
                show1: "show"
            });
        } else if (this.data.rotate1 == "Rotate-downward") {
            this.setData({
                rotate1: "RotateToTheRight",
                show1: "hidden"
            });
        }
    },
    showOrCloseTwo() {
        if (this.data.rotate2 == "RotateToTheRight") {
            this.setData({
                rotate2: "Rotate-downward",
                show2: "show"
            });
        } else if (this.data.rotate2 == "Rotate-downward") {
            this.setData({
                rotate2: "RotateToTheRight",
                show2: "hidden"
            });
        }
    },
    showOrCloseThree() {
        if (this.data.rotate3 == "RotateToTheRight") {
            this.setData({
                rotate3: "Rotate-downward",
                show3: "show"
            });
        } else if (this.data.rotate3 == "Rotate-downward") {
            this.setData({
                rotate3: "RotateToTheRight",
                show3: "hidden"
            });
        }
    },

    showOrCloseFour() {
        if (this.data.rotate4 == "RotateToTheRight") {
            this.setData({
                rotate4: "Rotate-downward",
                show4: "show"
            });
        } else if (this.data.rotate4 == "Rotate-downward") {
            this.setData({
                rotate4: "RotateToTheRight",
                show4: "hidden"
            });
        }
    }
});
