import pub from "/util/public";
import promptConf from "/util/promptConf.js";
const app = getApp();
Page({
    ...pub.func,
    data: {
        ...pub.data,
        typeArray: ["公车", "私车"],
        carIndex: 0,
        disablePages: true,
        tableItems: [
            {
                prop: "Name",
                label: "名称",
                width: 300
            },
            {
                prop: "Type",
                label: "大类",
                width: 200
            },
            {
                prop: "CarNumber",
                label: "车牌号",
                width: 300
            },
            {
                prop: "Color",
                label: "颜色",
                width: 200
            },
            {
                prop: "FinnalEndTime",
                label: "最近使用时间",
                width: 400
            },
            {
                prop: "UnitPricePerKilometre",
                label: "每公里单价（元）",
                width: 100
            },
            {
                prop: "Remark",
                label: "备注",
                width: 100
            }
        ],

        // 公车
        tableItem2: [
            {
                prop: "TaskId",
                label: "流水号",
                width: 200
            },
            {
                prop: "Dept",
                label: "使用部门",
                width: 200
            },
            {
                prop: "ApplyMan",
                label: "申请人",
                width: 200
            },
            {
                prop: "UseTime",
                label: "用车日期",
                width: 500
            },
            {
                prop: "Name",
                label: "使用车辆",
                width: 300
            },
            {
                prop: "MainContent",
                label: "用途",
                width: 300
            },
            {
                prop: "UseKilometres",
                label: "总里程/KM",
                width: 200
            },
            {
                prop: "FactKilometre",
                label: "实际里程/KM",
                width: 200
            },
            {
                prop: "UnitPricePerKilometre",
                label: "每公里单价/元",
                width: 200
            },
            {
                prop: "AllPrice",
                label: "费用估计/元",
                width: 200
            }
        ],
        //私车
        tableItem3: [
            {
                prop: "Dept",
                label: "使用部门",
                width: 200
            },
            {
                prop: "ApplyMan",
                label: "申请人",
                width: 200
            },
            {
                prop: "UseTime",
                label: "用车日期",
                width: 500
            },
            {
                prop: "MainContent",
                label: "用途",
                width: 300
            },
            {
                prop: "StartKilometres",
                label: "起始公里/KM",
                width: 200
            },
            {
                prop: "EndKilometres",
                label: "结束公里/KM",
                width: 200
            },
            {
                prop: "UseKilometres",
                label: "总里程/KM",
                width: 100
            }
        ],
        tableParam: {
            size: 5,
            now: 1
        },
        tableParam2: {
            total: 0
        },
        tableOperate: "编辑",
        tableOperate2: "删除"
    },
    onReady() {
        this.setData({
            items: this.data.tableItem2
        });
        this.getCar();
    },
    //获取所有车辆
    getCar(Key) {
        let key = Key || "";
        let that = this;
        let param = {
            key: key,
            applyManId: app.userInfo.userid
        };
        this._getData("CarMananger/Quary" + this.formatQueryStr(param), res => {
            if (res.length == 0) {
                dd.alert({
                    content: promptConf.promptConf.SearchNoReturn,
                    buttonText: promptConf.promptConf.Confirm
                });
                return;
            }
            that.setData({
                tableData: res,
                "tableParam.total": res.length
            });
            that.data.data = res;
            that.getData();
        });
    },
    search(e) {
        let value = e.detail.value;
        if (value.keyWord.trim() == "") {
            dd.alert({
                content: promptConf.promptConf.SearchNoInput,
                buttonText: promptConf.promptConf.Confirmm
            });
            return;
        }
        this.getCar(value.keyWord);
    },
    chooseItem(e) {
        if (!e) return;
        console.log(e);
        let index = e.target.targetDataset.index;
        if (!index && index != 0) return;

        let that = this;
        let row = e.target.targetDataset.row;
        if (!e.target.targetDataset.opt2) {
            console.log("编辑");
            this.setData({
                row: row,
                hidden: !this.data.hidden
            });
            this.createMaskShowAnim();
            this.createContentShowAnim();
        } else {
            console.log("删除");
            dd.confirm({
                title: "温馨提示",
                content: "是否删除该车辆？",
                confirmButtonText: promptConf.promptConf.Confirm,
                cancelButtonText: promptConf.promptConf.Cancel,
                success: result => {
                    if (result.confirm == true) {
                        let param = {
                            Id: row.Id,
                            ApplyManId: app.userInfo.userid
                        };
                        this.getDataReturnData("CarMananger/Delete" + this.formatQueryStr(param), res => {
                            console.log(res.data);
                            if (res.data.errorMessage == "没有权限") {
                                dd.alert({
                                    content: "没有操作权限",
                                    buttonText: promptConf.promptConf.Confirm
                                });
                                return;
                            }
                            dd.alert({
                                content: "删除成功",
                                buttonText: promptConf.promptConf.Confirm
                            });
                            that.getCar();
                        });
                    }
                }
            });
        }
    },
    addCar() {
        this.setData({
            row: {},
            hidden: !this.data.hidden
        });
        this.createMaskShowAnim();
        this.createContentShowAnim();
    },
    cancel(e) {
        this.setData({
            row: {},
            hidden: !this.data.hidden
        });
    },
    confirm(e) {
        let that = this;
        let value = e.detail.value;
        console.log(this.data.row);

        if (value.Name.trim() == "") {
            dd.alert({
                content: "名称不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.Type.trim() == "") {
            dd.alert({
                content: "品牌不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.CarNumber.trim() == "") {
            dd.alert({
                content: "车牌号不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (value.UnitPricePerKilometre == "") {
            dd.alert({
                content: "每公里单价不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        //编辑
        if (this.data.row.Name) {
            console.log("编辑");
            this.data.row.Name = value.Name;
            this.data.row.Type = value.Type;
            this.data.row.CarNumber = value.CarNumber;
            this.data.row.Color = value.Color;
            this.data.row.UnitPricePerKilometre = value.UnitPricePerKilometre;
            this.data.row.Remark = value.Remark;
            console.log(this.data.row);
            this.data.row.ApplyManId = app.userInfo.userid;
            this.postDataReturnData(
                "CarMananger/Modify",
                res => {
                    console.log(res.data);
                    if (res.data.errorMessage == "没有权限") {
                        dd.alert({
                            content: "没有操作权限",
                            buttonText: promptConf.promptConf.Confirm
                        });
                        return;
                    }
                    dd.alert({
                        content: "修改成功",
                        buttonText: promptConf.promptConf.Confirm
                    });
                    that.setData({
                        row: undefined,
                        hidden: !this.data.hidden
                    });
                    that.getCar();
                },
                this.data.row
            );
        }
        //添加
        else if (!this.data.row.Name) {
            console.log("添加");
            let obj = {
                ApplyManId: app.userInfo.userid,
                Name: value.Name,
                Type: value.Type,
                CarNumber: value.CarNumber,
                Color: value.Color,
                UnitPricePerKilometre: value.UnitPricePerKilometre,
                Remark: value.Remark
            };
            this.postDataReturnData(
                "CarMananger/Add",
                res => {
                    console.log(res.data);
                    if (res.data.errorMessage == "没有权限") {
                        dd.alert({
                            content: "没有操作权限",
                            buttonText: promptConf.promptConf.Confirm
                        });
                        return;
                    }
                    dd.alert({
                        content: "添加成功",
                        buttonText: promptConf.promptConf.Confirm
                    });
                    that.setData({
                        hidden: !this.data.hidden
                    });
                    that.getCar();
                },
                obj
            );
        }
    },
    selectStartDateTime() {
        dd.datePicker({
            format: "yyyy-MM-dd HH:mm",
            currentDate: this.data.DateStr + " " + this.data.TimeStr,
            startDate: "2015-01-01",
            endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day + " " + this.data.TimeStr,
            success: res => {
                if (this.data.endDates) {
                    //判断时间
                    let start = new Date(res.date.replace(/-/g, "/")).getTime();
                    let end = new Date(this.data.endDates.replace(/-/g, "/")).getTime();
                    if (end < start) {
                        dd.alert({
                            content: promptConf.promptConf.TimeComparison,
                            buttonText: promptConf.promptConf.Confirm
                        });
                        return;
                    }
                }
                this.setData({
                    startDates: res.date
                });
            }
        });
    },
    selectEndDateTime() {
        dd.datePicker({
            format: "yyyy-MM-dd HH:mm",
            currentDate: this.data.DateStr + " " + this.data.TimeStr,
            startDate: "2015-01-01",
            endDate: this.data.Year + 1 + "-" + this.data.Month + "-" + this.data.Day + " " + this.data.TimeStr,
            success: res => {
                if (this.data.startDates) {
                    //判断时间
                    let start = new Date(this.data.startDates.replace(/-/g, "/")).getTime();
                    let end = new Date(res.date.replace(/-/g, "/")).getTime();
                    if (end < start) {
                        dd.alert({
                            content: promptConf.promptConf.TimeComparison,
                            buttonText: promptConf.promptConf.Confirm
                        });
                        return;
                    }
                }
                this.setData({
                    endDates: res.date
                });
            }
        });
    },

    bindPickerChange(e) {
        if (e.detail.value == 0) {
            this.setData({
                items: this.data.tableItem2
            });
        }
        if (e.detail.value == 1) {
            this.setData({
                items: this.data.tableItem3
            });
        }
        this.setData({
            carIndex: e.detail.value
        });
    },
    //第二个搜索
    secondSearch(e) {
        let that = this;
        let value = e.detail.value;
        console.log(e);
        if (value.key.trim() == "") {
            dd.alert({
                content: promptConf.promptConf.SearchNoInput,
                buttonText: promptConf.promptConf.Confirmm
            });
            return;
        }

        if (value.startTime.trim() == "") {
            dd.alert({
                content: "开始时间不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirmm
            });
            return;
        }
        if (value.endTime.trim() == "") {
            dd.alert({
                content: "结束时间不允许为空，请输入！",
                buttonText: promptConf.promptConf.Confirmm
            });
            return;
        }

        let obj = {
            applyManId: app.userInfo.userid,
            key: value.key,
            startTime: value.startTime,
            endTime: value.endTime,
            pageIndex: 1,
            pageSize: 9999,
            IsSend: e.buttonTarget.dataset.IsSend,
            IsPublic: this.data.typeArray[this.data.carIndex] == "公车" ? true : false
        };

        console.log(obj);

        //搜索
        if (e.buttonTarget.dataset.IsSend == false) {
            console.log("搜索");
            this.getDataReturnData("CarMananger/QuaryPrintExcel" + this.formatQueryStr(obj), res => {
                console.log(res.data.data);
                if (res.data.data.length == 0) {
                    dd.alert({
                        content: promptConf.promptConf.SearchNoReturn,
                        buttonText: promptConf.promptConf.Confirm
                    });
                    return;
                }
                this.setData({
                    tableData2: res.data.data,
                    disablePages: false,
                    "tableParam2.total": res.data.data.length
                });
            });
        }
        //打印表单
        else if (e.buttonTarget.dataset.IsSend == true) {
            console.log("打印表单");

            this.getDataReturnData("CarMananger/QuaryPrintExcel" + this.formatQueryStr(obj), res => {
                console.log(res.data);
                if (res.data.error.errorCode == 0) {
                    dd.alert({
                        content: promptConf.promptConf.PrintFrom,
                        buttonText: promptConf.promptConf.Confirm
                    });
                }
            });
        }

        return;
    }
});
