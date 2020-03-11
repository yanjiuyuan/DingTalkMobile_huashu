import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        hidden: true,
        dataList: [], //循环多个表格需要
        deletedList: [], //删除的表格项
        totalPrice: 0.0,
        tableOperate: "删除",
        tableParam: {
            size: 5000,
            now: 1,
            total: 0
        },
        tableItems: [
            {
                prop: "CodeNo",
                label: "物料编码",
                width: 200
            },
            {
                prop: "Name",
                label: "物料名称",
                width: 300
            },
            {
                prop: "Standard",
                label: "规格型号",
                width: 300
            },
            {
                prop: "Unit",
                label: "单位",
                width: 100
            },
            {
                prop: "Price",
                label: "预计单价",
                width: 100
            },
            {
                prop: "Count",
                label: "数量",
                width: 100
            },
            {
                prop: "totalPrice",
                label: "总价",
                width: 200
            },
            {
                prop: "Purpose",
                label: "用途",
                width: 300
            }
        ]
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark
        };
        if (this.data.nodeid == 2) {
            let listParam = [];
            for (let d of this.data.deletedList) {
                listParam.push(d);
                d.IsDelete = true;
            }
            for (let dept of this.data.dataList) {
                for (let v of dept.value) {
                    listParam.push(v);
                }
            }
            console.log(listParam);
            this._postData(
                "OfficeSuppliesPurchase/ModifyTable",
                res => {
                    this.aggreSubmit(param);
                },
                listParam
            );
            return;
        }
        this.aggreSubmit(param);
    },
    deleteItem(e) {
        if (!e) return;
        let row = e.target.targetDataset.row;
        let index = e.target.targetDataset.index;

        if (!index && index != 0) {
            return;
        }
        for (let d of this.data.dataList) {
            if (d.name == row.Dept) {
                console.log(this.data.totalPrice);
                this.data.totalPrice = (
                    parseFloat(this.data.totalPrice) -
                    parseFloat(row.Price) * parseFloat(row.Count)
                ).toFixed(2);

                d.tmpTotalPrice = Number(this.data.totalPrice);
                this.data.deletedList.push(d.value.splice(index, 1)[0]);
            }
        }
        this.setData({
            dataList: this.data.dataList,
            totalPrice: this.data.totalPrice,
            "tableParam.total": this.data.dataList[0].value.length
        });
    },
    getBomInfo() {
        this.requestData("GET", "OfficeSuppliesPurchase/ReadTable?TaskId=" + this.data.taskid, res => {
            this.data.dataList = [];
            let deptList = [];
            let deptStr = "";
            res = JSON.parse(res.data);
            for (let d of res) {
                if (d.Dept && deptStr.indexOf(d.Dept) < 0) {
                    deptStr = deptStr + d.Dept + ",";
                }
            }
            deptStr = deptStr.substring(0, deptStr.length - 1);
            deptList = deptStr.split(",");
            for (let d of deptList) {
                this.data.dataList.push({
                    name: d,
                    value: [],
                    tmpTotalPrice: 0,
                    tableParam: {
                        total: 0
                    }
                });
            }

            for (let d of res) {
                for (let l of this.data.dataList) {
                    if (d.Dept == l.name) {
                        this.data.totalPrice = (
                            parseFloat(this.data.totalPrice) +
                            parseFloat(d.Price) * parseFloat(d.Count)
                        ).toFixed(2);
                        d["totalPrice"] = (parseFloat(d.Price) * parseFloat(d.Count)).toFixed(2);
                        l.value.push(d);
                        l.tableParam.total++;
                        l.tmpTotalPrice += parseFloat(d["totalPrice"]);

                        break;
                    }
                }
            }
            this.setData({
                dataList: this.data.dataList,
                totalPrice: this.data.totalPrice,
                "tableParam.total": this.data.dataList[0].value.length
            });
        });
    },
    onShow() {
        if (this.data.index != 0 || this.data.nodeid != 2) {
            this.data.tableOperate = "";
        }
    }
});
