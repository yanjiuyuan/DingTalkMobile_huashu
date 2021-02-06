import promptConf from "/util/promptConf.js";
Component({
    mixins: [],
    data: {
        image: [], //显示的图片数组
        imgUrl: [] //在服务器中的保存路径数组
    },
    props: {
        onUpload: () => {}, //给父组件传递参数
        title: {
            //标题
            type: String
        },
        isFill: {
            //是否有必填星号
            type: Boolean
        },
        count: {
            //上传数量
            type: String
        },
        url: {
            //上传到的服务路径
            type: String
        },
        imageList: {
            //已有的图片数组
            type: Array
        }
    },
    didMount() {
        console.log(this.props);
    },
    didUpdate() {},
    didUnmount() {},
    methods: {
        //上传图片
        uploadPictures() {
            let that = this;
            dd.chooseImage({
                count: 2,
                success: res => {
                    for (let p of res.apFilePaths) {
                        console.log("imageList:", p);
                        that.data.image.push(p);
                        dd.uploadFile({
                            url: that.props.url,
                            fileType: "image",
                            fileName: p.substring(7).replace(/\//g,""),
                            filePath: p,
                            success: res => {
                                console.log("imgUrlList:", JSON.parse(res.data).Content);
                                that.data.imgUrl.push(JSON.parse(res.data).Content);
                                that.props.onUpload({
                                    detail: {
                                        value: that.data.imgUrl
                                    }
                                });
                            },
                            fail: err => {
                                dd.alert({
                                    content: "sorry" + JSON.stringify(err)
                                });
                            }
                        });
                    }
                    that.setData({ image: that.data.image });
                }
            });
        },
        //删除图片
        deletePhoto(e) {
            my.confirm({
                title: "温馨提示",
                content: promptConf.promptConf.DeletePicture,
                confirmButtonText: promptConf.promptConf.Confirm,
                cancelButtonText: promptConf.promptConf.Cancel,
                success: result => {
                    if (result.confirm == true) {
                        let index = e.currentTarget.dataset.index;
                        this.data.image.splice(index, 1);
                        this.data.imgUrl.splice(index, 1);

                        this.props.onUpload({
                            detail: {
                                value: this.data.imgUrl
                            }
                        });
                        this.setData({
                            image: this.data.image,
                            imgUrl: this.data.imgUrl
                        });
                    }
                }
            });
        }
    }
});
