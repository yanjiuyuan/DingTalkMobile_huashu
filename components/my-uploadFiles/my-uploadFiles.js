//上传文件组件
Component({
    mixins: [],
    data: {
        fileList: [
            {
                fileId: "2194424840",
                fileName: "培训通知(1).docx",
                fileSize: 12703,
                fileType: "docx",
                spaceId: "1699083579"
            }
        ]
    },
    props: {
        onGetArray: () => {},
        title: {
            type: String
        },
        spaceId: {
            type: String
        },
        type: {
            type: Array
        }
    },
    didMount() {
        console.log(this.props);
    },
    didUpdate() {},
    didUnmount() {},
    methods: {
        //删除文件
        delete(e) {
            let that = this;
            let fileId = e.currentTarget.dataset.fileId;
            for (let i = 0, length = that.data.fileList.length; i < length; i++) {
                if (that.data.fileList[i].fileId == fileId) {
                    console.log(i);
                    that.data.fileList.splice(i, 1);
                }
            }
            that.setData({
                fileList: that.data.fileList
            });
        },
        //预览文件
        preview(e) {
            console.log(e);
            let file = e.currentTarget.dataset.item;
            dd.previewFileInDingTalk({
                corpId: "dingac9b87fa3acab57135c2f4657eb6378f",
                spaceId: file.spaceId,
                fileId: file.fileId,
                fileName: file.fileName,
                fileSize: file.fileSize,
                fileType: file.fileType
            });
        },
        //上传文件
        uploadFiles() {
            let that = this;
            dd.uploadAttachmentToDingTalk({
                image: { multiple: true, compress: false, max: 9, spaceId: this.props.spaceId },
                space: { spaceId: this.props.spaceId, isCopy: 1, max: 9 },
                file: { spaceId: this.props.spaceId, max: 1 },
                types: ["photo", "camera", "file", "space"],
                success: res => {
                    console.log(res);
                    that.data.fileList.push(res.data[0]);
                    that.setData({
                        fileList: that.data.fileList
                    });
                    that.props.onGetArray({
                        detail: {
                            value: that.data.fileList
                        }
                    }); //传递参数出去
                },
                fail: err => {
                    that.props.onGetArray({
                        detail: {
                            value: that.data.fileList
                        }
                    }); //传递参数出去
                    dd.alert({
                        content: JSON.stringify(err)
                    });
                }
            });
        }
    }
});
