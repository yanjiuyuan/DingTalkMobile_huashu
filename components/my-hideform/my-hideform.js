Component({
    mixins: [],
    data: {
        animMaskData: [],
        animContentData: []
    },
    props: {
        title: {
            type: String
        },
        hidden: {
            type: Boolean
        }
    },
    didMount() {
        console.log("初始化");
        console.log(this.props.hidden);
    },
    didUpdate() {
        console.log("更新");
        console.log(this.props.hidden);
    },
    didUnmount() {},
    methods: {
        createMaskShowAnim() {
            const animation = dd.createAnimation({
                duration: 200,
                timingFunction: "cubic-bezier(.55, 0, .55, .2)"
            });
            this.maskAnim = animation;
            animation.opacity(1).step();
            this.setData({
                animMaskData: animation.export()
            });
        },
        createMaskHideAnim() {
            this.maskAnim.opacity(0).step();
            this.setData({
                animMaskData: this.maskAnim.export()
            });
        },
        createContentShowAnim() {
            const animation = dd.createAnimation({
                duration: 200,
                timingFunction: "cubic-bezier(.55, 0, .55, .2)"
            });
            this.contentAnim = animation;
            animation.translateY(0).step();
            this.setData({
                animContentData: animation.export()
            });
        },
        createContentHideAnim() {
            this.contentAnim.translateY("100%").step();
            this.setData({
                animContentData: this.contentAnim.export()
            });
        },
        confirm() {
            this.setData({
                hidden: !this.props.hidden
            });
        },
        cancel(e) {
            this.setData({
                hidden: !this.props.hidden
            });
        }
    }
});
