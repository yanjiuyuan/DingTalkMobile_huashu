import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        carName: "",
        carIndex: -1,
        carList: [],
        useTimeList: [],
        table: {}
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Remark: value.remark
        };
        this.data.table["CarNumber"] = this.data.table.CarId;
        this.data.table["StartKilometres"] = value.StartKilometres;
        this.data.table["EndKilometres"] = value.EndKilometres;
        this.data.table["UseKilometres"] = (value.EndKilometres - 0 - (value.StartKilometres - 0)).toFixed(2);
        this.data.table["FactTravelWay"] = value.FactTravelWay;

        if ((!value.StartKilometres || !value.EndKilometres) && (this.data.nodeid == 3 || this.data.nodeid == 4)) {
            dd.alert({
                content: "表单未填写完整",
                buttonText: promptConf.promptConf.Confirm
            });
            return;
        }
        if (this.data.nodeid == 2) {
            if (!this.data.table["CarId"]) {
                dd.alert({
                    content: "车辆不允许为空，请选择！",
                    buttonText: promptConf.promptConf.Confirm
                });
                return;
            }

            if (!this.data.carList[this.data.carIndex]) {
                dd.alert({
                    content: "车辆不允许为空，请选择！",
                    buttonText: promptConf.promptConf.Confirm
                });
                return;
            }
            if (this.data.carList[this.data.carIndex].IsOccupyCar == true) {
                dd.alert({
                    content: "车辆已被占用，请重新选择！",
                    buttonText: promptConf.promptConf.Confirm
                });
                return;
            }
            param["Title"] = this.data.tableInfo.Title + "-" + this.data.carList[this.data.carIndex].Name;
        }
        this.setData({ disablePage: true });
        this._postData(
            "CarTableNew/TableModify",
            res => {
                that.aggreSubmit(param);
            },
            this.data.table
        );
    },
    //选车操作
    selectCar(value) {
        let car = this.data.carList[value.detail.value];
        this.setData({ useTimeList: [] });
        console.log(car);
        this.data.table["CarId"] = car.Id;
        this.data.table["Name"] = car.Name;
        this.data.table["CarNumber"] = car.CarNumber;
        this.data.table["OccupyCarId"] = car.OccupyCarId;
        this.data.table["IsOccupyCar"] = car.IsOccupyCar;
        this.setData({
            carIndex: value.detail.value,
            carName: car.Name + " - " + car.CarNumber
        });

        if (!car.UseMan) return;
        let useTimeList = [];
        let nameList = car.UseMan.split(",");
        let timeList = car.UseTimes.split(",");
        for (let i = 0; i < nameList.length; i++) {
            if (car.IsOccupyCar) {
                useTimeList.push({
                    name: nameList[i],
                    time: timeList[i]
                });
            }
        }
        this.setData({ useTimeList: useTimeList });
        console.log(this.data.useTimeList);
    },
    reApproval() {
        this.data.localStorage = JSON.stringify({
            valid: true,
            flowid: this.data.flowid,
            title: this.data.tableInfo.Title,
            table: this.data.table
        });
        for (let m of this.data.menu) {
            if (m.flowId == this.data.flowid) {
                dd.redirectTo({
                    url: "/page/start/" + m.url + "?flowid=" + m.flowId
                });
            }
        }
    },
    onReady() {
        let that = this;
        this._getData("CarTableNew/TableQuary" + this.formatQueryStr({ TaskId: this.data.taskid }), res => {
            let data = res[0];
            if (!data.FactTravelWay) data.FactTravelWay = data.PlantTravelWay;
            if (!data.PeerNumber) data.PeerNumber = "";
            console.log(data);
            this.setData({
                table: data
            });

            that._getData(
                "CarMananger/QuaryByTimeNew" +
                    that.formatQueryStr({ startTime: data.StartTime, endTime: data.EndTime }),
                res => {
                    for (let d of res) {
                        d["text"] = d.Name + " - " + d.CarNumber;
                        if (d.Id == data.CarId) {
                            that.setData({
                                carName: d.Name + " - " + d.CarNumber,
                                "table.Name": d.Name
                            });
                        }
                    }
                    if (!that.data.table.CarId && res.length > 0) {
                        let car = res[0];
                        that.data.table["CarId"] = car.Id;
                        that.data.table["Name"] = car.Name;
                        that.data.table["OccupyCarId"] = car.OccupyCarId;
                        that.data.table["IsOccupyCar"] = car.IsOccupyCar;
                    }
                    that.setData({
                        carList: res
                    });
                }
            );
        });
    },
    startKilometres(e) {
        console.log(e.detail.value);
        let value = e.detail.value;
        if (this.data.table.EndKilometres != null) {
            this.setData({
                ["table.UseKilometres"]: (this.data.table.EndKilometres - value).toFixed(1)
            });
        }
        this.setData({
            ["table.StartKilometres"]: value
        });
    },
    endKilometres(e) {
        console.log(e.detail.value);
        console.log(this.data.table.StartKilometres);

        let value = e.detail.value;
        if (this.data.table.StartKilometres != null) {
            this.setData({
                ["table.UseKilometres"]: (value - this.data.table.StartKilometres).toFixed(1)
            });
        }
        this.setData({
            ["table.EndKilometres"]: value
        });
    }
});
