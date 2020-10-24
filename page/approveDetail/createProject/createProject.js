import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        copyMans: [],
        table: {},
        IsReview:true,
    }, 
    submit(e) { 
        let value = e.detail.value;
        let param = {
            Remark: value.remark 
        };

        console.log(value);
        console.log(this.data.table);

        if (this.data.nodeid == 4) {
            this.data.table.IsReview = value.IsReview;
            if(this.data.table.IsReview && this.data.table.ReviewTime == null){
                dd.alert({
                    content: "评审时间不能为空，请输入！",
                    buttonText: promptConf.promptConf.Confirm
                });
                return;
            }
        }
        this.data.table.ProjectId = value.ProjectId;
        if (this.data.nodeid == 5 || this.data.nodeid == 4) {
            if (this.data.nodeid == 5 && !this.data.table.ProjectId) {
                console.log(this.data.table);
                dd.alert({
                    content: "项目编号不能为空，请输入！",
                    buttonText: promptConf.promptConf.Confirm
                });
                return;
            }
            // if (this.data.nodeid == 5 && !this.data.reg4.test(value.ProjectId)) {
            //     dd.alert({
            //         content: "请规范填写项目编号",
            //         buttonText: promptConf.promptConf.Confirm
            //     });
            //     return;
            // }


            if( this.data.nodeid == 5 && value.ProjectId.trim().length < 7 ){
                dd.alert({
                    content:  '项目编号长度不小于7位',
                    buttonText: promptConf.promptConf.Confirm 
                }); 
                return;
            }


            this.data.table.CompanyName = "泉州华中科技大学智能制造研究院";

            this._postData(
                "CreateProject/Modify",
                res => {
                    if (this.data.nodeid != 5) {
                        this.aggreSubmit(param);
                        return;
                    }
                    this.data.table.ApplyManId = this.data.DingData.userid; 
                    this.data.table.ApplyMan = this.data.DingData.nickName;
                    this._postData(
                        "ProjectNew/AddProject",
                        res => {
                            this.aggreSubmit(param);
                        },
                        [this.data.table]
                    );
                },
                this.data.table
            );
        } else {
            this.aggreSubmit(param);
        }
    },
    //下载文件
    downloadServerFile(e) {
        dd.downloadFile({
            url: e.target.dataset.url,
            success({ filePath }) {
                dd.previewImage({
                    urls: [filePath]
                });
            },
            fail(res) {
                dd.alert({
                    content: res.errorMessage || res.error
                });
            }
        });
    },

    //选择时间
    selectStartDateTime() {
            dd.datePicker({
                format: "yyyy-MM-dd HH:mm",
                currentDate: this.data.DateStr + " " + this.data.TimeStr,
                startDate: this.data.DateStr + " " + this.data.TimeStr,
                endDate:
                    this.data.Year +
                    1 +
                    "-" +
                    this.data.Month +
                    "-" +
                    this.data.Day +
                    " " +
                    this.data.TimeStr,
                success: res => {
                    this.setData({
                        "table.ReviewTime": res.date,
                    });
                },
            });
    },
    radioChange: function(e) {
        this.data.IsReview = e.detail.value;
        if(e.detail.value == false){
            this.data.table.ReviewTime = ""; 
            this.setData({
                ReviewTime:""
            })
        }
        this.setData({
            IsReview:e.detail.value,
        })
    },
    onReady() {
        let that = this;

        this._getData("CreateProject/Read" + this.formatQueryStr({ TaskId: this.data.taskid }), res => {
            if (that.data.nodeid > 4) {
                that.data.IsReview = res.IsReview == true ? "是" : "否";
            }
            console.log(that.data.nodeid);
            console.log(that.data.index == 4 && that.data.state == "未完成" && that.data.nodeid == 0);

            this.setData({
                table: res,
                IsReview: that.data.IsReview
            });
        });
    }
});
