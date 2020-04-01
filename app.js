App({
    onLaunch(options) {
        //第一次打开触发
        console.log("第一次打开触发");
    },
    onShow() {
        //后台进前台触发
        console.log("后台进前台触发");
        dd.getAuthCode({
            success: res => {
                console.log(res.authCode);
                let url = "http://47.93.56.50?authCode=" + res.authCode;
                this.globalData.url = url;
            },

            fail: res => {
                console.log(res);
            },
        });
    },
    onHide() {
        //前台进后台触发
        console.log("前台进后台触发");
    },
    userInfo: null,
    globalData: {
        hasLogin: false,
        appId: 189694580,
        a: "",
        table: {},
        valid: false, //表示全局table变量是否可用
    },
});
