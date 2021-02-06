import pub from "/util/public";
import promptConf from "/util/promptConf.js";
Page({
    ...pub.func,
    ...pub.func.dowith,
    data: {
        ...pub.data,
        hidden: true,
        totalPrice: "0",
        imgUrlList: [],
        tableItems2: [
            {
                prop: "fNumber",
                label: "物料编码",
                width: 200,
            },
            {
                prop: "fName",
                label: "物料名称",
                width: 300,
            },
            {
                prop: "fModel",
                label: "规格型号",
                width: 300,
            },
            {
                prop: "unitName",
                label: "单位",
                width: 100,
            },
            {
                prop: "fQty",
                label: "实收数量",
                width: 200,
            },
            {
                prop: "fFullName",
                label: "供应商",
                width: 300,
            },
        ],
    },
    submit(e) {
        let that = this;
        let value = e.detail.value;
        let param = {
            Title: value.title,
            Remark: value.remark,
        };

        // dd.alert({
        //     content: JSON.stringify(this.data.imageList) + JSON.stringify(this.data.imgUrlList),
        // });
        // return;
        if (this.data.imgUrlList.length > 0) {
            param["ImageUrl"] = this.data.imgUrlList.join(",");
        } else if (this.data.nodeid == 3 && this.data.imgUrlList.length == 0) {
            dd.alert({
                content: promptConf.promptConf.NoPicture,
                buttonText: promptConf.promptConf.Confirm,
            });
            return;
        }
        //return
        this.aggreSubmit(param);
    },

    //上传图片
    uploadImg(e) {

        let that = this;
        dd.chooseImage({
            count: 1,
            success: res => {
                dd.compressImage({
                    filePaths: res.apFilePaths,
                    compressLevel: 2,
                    success: res => {
                        that.setData({ imageList: that.data.imageList });
                        for (let p of res.apFilePaths) {
                            that.setData({ disablePage: true });

                            console.log("imageList:", JSON.stringify(p));
                            that.data.imageList.push(p);
                            dd.uploadFile({
                                url: that.data.dormainName + "drawingupload/Upload?IsWaterMark=true",
                                fileType: "image",
                                fileName: p.substring(7).replace(/\//g,""),
                                filePath: p,
                                success: res => {
                                    // dd.alert({
                                    //     content: JSON.stringify(res),
                                    //     buttonText: "ss",
                                    // });
                                    console.log(
                                        "imgUrlList:",
                                        JSON.stringify(JSON.parse(res.data).Content)
                                    );
                                    that.data.imgUrlList.push(JSON.parse(res.data).Content);

                                    that.setData({ disablePage: false });
                                },
                                fail: err => {
                                    dd.alert({
                                        content: "sorry" + JSON.stringify(err),
                                    });
                                },
                            });
                        }
                        that.setData({ imageList: that.data.imageList });
                    },
                });
            },
        });
    },

    //上传图片
    // uploadImg() {
    //     let that = this;
    //     //上传图片
    //     dd.chooseImage({
    //         count: 1,
    //         success: res => {
    //             dd.compressImage({
    //                 filePaths: res.apFilePaths,
    //                 compressLevel: 2,
    //                 success: res => {
    //                     that.setData({ imageList: that.data.imageList });
    //                     for (let p of res.apFilePaths) {
    //                         that.setData({ disablePage: true });

    //                         that.data.imageList.push(p);
    //                         dd.uploadFile({
    //                             url: that.data.dormainName + "drawingupload/Upload",
    //                             fileType: "image",
    //                             fileName: p.substring(7),
    //                             // IsWaterMark: true,
    //                             filePath: p,
    //                             success: res => {
    //                                 dd.alert({
    //                                     content: JSON.stringify(res),
    //                                     buttonText: "ss",
    //                                 });
    //                                 // return;
    //                                 console.log(
    //                                     "imgUrlList:",
    //                                     JSON.stringify(JSON.parse(res.data).Content)
    //                                 );
    //                                 that.data.imgUrlList.push(JSON.parse(res.data).Content);

    //                                 that.setData({ disablePage: false });
    //                             },
    //                             fail: err => {
    //                                 dd.alert({ content: "sorry" + JSON.stringify(err) });
    //                             },
    //                         });
    //                     }
    //                     that.setData({ imageList: that.data.imageList });
    //                 },
    //             });
    //         },
    //         fail: res => {
    //             if (res.error == "3") {
    //                 dd.alert({
    //                     content: "请在“设置-应用-权限”选项中，允许访问你的照片",
    //                     buttonText: promptConf.promptConf.Confirm,
    //                 });
    //             }
    //         },
    //     });
    // },

    deletePhoto(e) {
        dd.confirm({
            title: "温馨提示",
            content: promptConf.promptConf.DeletePicture,
            confirmButtonText: promptConf.promptConf.Confirm,
            cancelButtonText: promptConf.promptConf.Cancel,
            success: result => {
                if (result.confirm == true) {
                    let index = e.currentTarget.dataset.index;
                    this.data.imageList.splice(index, 1);
                    this.data.imgUrlList.splice(index, 1);

                    this.setData({
                        imageList: this.data.imageList,
                        imgUrlList: this.data.imgUrlList,
                    });
                }
            },
        });
    },
});
