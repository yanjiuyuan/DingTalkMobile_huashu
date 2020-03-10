Component({
    mixins: [],
    data: {}, //存放组件内部数据
    props: {
        onChange() {}, //传递index参数出去
        range: {
            type: Array,
            value: [],
        }, //范围数组
        index: {
            type: Number,
        }, //索引
        value: {
            type: String,
            value: "",
        }, //值
        name: {
            type: String,
        }, //在表单中的名字
        rangeKey: {
            type: String,
        }, //当 range 是一个 Object[] 时，通过 rangeKey 来指定 Object 中 key 的值作为选择器显示内容
    },
    //组件初始化
    didMount() {
        if (typeof this.props.rangeKey == "object") {
            this.StringValueToIndex();
        }

        if (typeof this.props.rangeKey == "string") {
            this.ObjectValueToIndex();
        }
    },
    //组件传入动态获取的数据
    didUpdate() {
        if (typeof this.props.rangeKey == "string") {
            this.ObjectValueToIndex();
        }
    },
    didUnmount() {},
    methods: {
        bindPickerChange(e) {
            this.setData({
                index: e.detail.value,
            });
            this.props.onChange({
                detail: {
                    value: e.detail.value,
                },
            }); //传递参数出去
        },
        //输入为字符串数组时把value值转换成index
        StringValueToIndex() {
            if (typeof this.props.value != "object") {
                for (let i = 0, len = this.props.range.length; i < len; i++) {
                    if (this.props.value == this.props.range[i]) {
                        this.setData({
                            index: i,
                        });
                        this.props.onChange({
                            detail: {
                                value: i,
                            },
                        }); //传递参数出去
                    }
                }
            }
        },
        //输入为对象数组时把value转成index
        ObjectValueToIndex() {
            if (typeof this.props.value != "object") {
                for (let i = 0, len = this.props.range.length; i < len; i++) {
                    if (this.props.value == this.props.range[i][this.props.rangeKey]) {
                        this.setData({
                            index: i,
                        });
                        this.props.onChange({
                            detail: {
                                value: i,
                            },
                        }); //传递参数出去
                    }
                }
            }
        },
    },
});
