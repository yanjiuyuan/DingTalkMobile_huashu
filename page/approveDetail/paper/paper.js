import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        hidden: true,
        totalPrice: "0",
        tableItems: [
            {
                prop: "Sorts",
                label: "类别",
                width: 100
            },
            {
                prop: "DrawingNo",
                label: "代号",
                width: 300
            },
            {
                prop: "Name",
                label: "名称",
                width: 300
            },
            {
                prop: "Count",
                label: "数量",
                width: 100
            },
            {
                prop: "MaterialScience",
                label: "材料",
                width: 200
            },
            {
                prop: "Unit",
                label: "单位",
                width: 100
            },
            {
                prop: "SingleWeight",
                label: "单重",
                width: 100
            },
            {
                prop: "AllWeight",
                label: "总重",
                width: 100
            },
            {
                prop: "NeedTime",
                label: "需用日期",
                width: 200
            },
            {
                prop: "Mark",
                label: "备注",
                width: 300
            }
        ],

        imageList: [],
        fileList: [],
        pdfList: []
        //data:[]
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark
        };
        this.aggreSubmit(param);
    },
    downloadAllPdf() {
        this._getData(
            "NewsAndCases/GetAllPDF" +
                this.formatQueryStr({ ApplyManId: this.data.DingData.userid, taskId: this.data.taskid }),
            function(res) {
                dd.alert({
                    content: promptConf.promptConf.Download,
                    buttonText: promptConf.promptConf.Confirm
                });
            }
        );
    },
    //PDF文件查看后，点击按钮设置状态
    setPdfState(e) {
        let index = e.target.dataset.index;
        this.data.pdfList[index].state == "1"
            ? (this.data.pdfList[index].state = "0")
            : (this.data.pdfList[index].state = "1");
        this.setData({ pdfList: this.data.pdfList });
        let states = [];
        for (let p of this.data.pdfList) {
            states.push(p.state);
        }
        let url = "FileNew/UpdatePDFState?TaskId=" + this.data.taskid + "&PDFState=" + states.join(",");
        this._getData(url, function(res) {});
    },

    onReady() {
        let that = this;
        let param = {
            ApplyManId: this.data.DingData.userid,
            nodeId: this.data.nodeid,
            TaskId: this.data.taskid
        };
        this._getData(
            "FlowInfoNew/GetApproveInfo" + this.formatQueryStr(param),
            function(res) {
                console.log(JSON.parse(res.counts).Designer);
                that.setData({
                    ["tableInfo.counts"]: JSON.parse(res.counts)
                });
            },
            this.data.DingData
        );
    }
});
