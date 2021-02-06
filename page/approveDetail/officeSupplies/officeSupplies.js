import pub from "/util/public";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        hidden: true,
        tableItems2: [
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
                prop: "ExpectPrice",
                label: "预计单价",
                width: 100
            },
            {
                prop: "Count",
                label: "数量",
                width: 100
            },
            {
                prop: "Purpose",
                label: "用途",
                width: 300
            },
            {
                prop: "Mark",
                label: "备注",
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
        if (this.data.index == 0 && this.data.nodeid == 3) {
            this._postData("OfficeSupplies/ModifyTable", res => {}, this.data.data);
        }
        this.aggreSubmit(param);
    },
     update(e) {
        console.log(e.target.targetDataset);
        if (this.data.index == 0 && this.data.nodeid == 3) {
            let index =
                this.data.tableParam.size * (this.data.tableParam.now - 1) +
                e.target.targetDataset.index;
            if (e.target.targetDataset.opt2) {
                console.log("还原");
                if (this.data.data[index].IsDelete) {
                    this.data.totalPrice = parseFloat(this.data.totalPrice) + parseFloat(e.target.targetDataset.row.Count) * parseFloat(e.target.targetDataset.row.ExpectPrice);
                    this.setData({
                        totalPrice: this.data.totalPrice.toFixed(2),
                    })
                }
                this.data.data[index].IsDelete = false;
                this.data.data[index].IsDeletes = "否";
            } else if (!e.target.targetDataset.opt2) {
                console.log("删除");
                // debugger;
                if (!this.data.data[index].IsDelete) {
                    this.data.totalPrice = parseFloat(this.data.totalPrice) - parseFloat(e.target.targetDataset.row.Count) * parseFloat(e.target.targetDataset.row.ExpectPrice);
                    this.setData({
                        totalPrice: this.data.totalPrice.toFixed(2),
                    })
                }
                this.data.data[index].IsDelete = true;
                this.data.data[index].IsDeletes = "是";
            }
            this.setData({
                data: this.data.data,
            });
            this.getData();
        }
    },
    onReady() {
        if (this.data.index == 0 && this.data.nodeid == 3) {
            console.log(this.data.tableItems2);
            this.data.tableItems2.unshift({
                prop: "IsDeletes",
                label: "是否删除",
                width: 100
            });
            this.setData({
                tableOperate: "删除",
                tableOperate2: "还原",
                tableItems2: this.data.tableItems2
            });
        }
    }
});
// OfficeSupplies / ModifyTable;
