App({
    onLaunch(options) {
        //第一次打开触发
        console.log("第一次打开触发");


    },
    onShow() {
    if (dd.canIUse('getUpdateManager')) {
                const updateManager = dd.getUpdateManager();
                updateManager.onCheckForUpdate(function (res) {

                    if (res.hasUpdate) {
                        updateManager.onUpdateReady(function (ret) {
                            console.log(ret.version) // 更新版本号
                            dd.confirm({
                                title: '更新提示',
                                content: '新版本已经准备好，是否重启应用？',
                                success: function (res) {
                                    if (res.confirm) {
                                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                                        updateManager.applyUpdate()
                                    } 
                                }
                            })
                        })
                    }
                    //console.log(res.hasUpdate) // 是否有更新
                })
                updateManager.onUpdateFailed(function () {
                    // 新版本下载失败
                })
    }
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
