Component({
    mixins: [],
    data: {
        cache: []
    },
    props: {
        onChange() {},
        itemList: {
            type: Array,
            default: []
        },
        name: {
            type: String
        },
        selectedItem: {
            type: String,
            default: ""
        }
    },
    didMount() {
        this.StringToArray();
        console.log("初始");
    },
    didUpdate() {
        console.log("跟新");
        //选人控件会清空itemList数组
        if (this.data.cache.length == 0) {
            console.log("第一次更新");
            this.data.cache = this.props.itemList;
        } else {
            console.log("不是第一次更新");
            for (let i = 0, length = this.props.itemList.length; i < length; i++) {
                if (this.props.itemList[i].checked == true) {
                    this.data.cache[i].checked = this.props.itemList[i].checked;
                }
            }

            this.setData({
                itemList: this.data.cache
            });
        }
    },
    didUnmount() {},
    methods: {
        //改变项的checked值
        onChanges(e) {
            let value = e.detail.value;
            this.props.onChange({
                detail: {
                    value: e.detail.value
                }
            }); //传递参数出去);
        },
        //把已选择的字符串转成项
        StringToArray() {
            if (this.props.selectedItem.default == undefined) {
                let array = this.props.selectedItem.split(",");
                for (let i of array) {
                    for (let j of this.props.itemList) {
                        if (i == j.value) {
                            j.checked = true;
                        }
                    }
                }
                this.setData({
                    itemList: this.props.itemList
                });
            }
        }
    }
});
