import lib from "/lib.js";
const app = getApp();
Page({
    data: {
        url: "http://47.93.56.50:8081",
    },
    onReady() {
        let i = setInterval(() => {
            console.log(this.data.url);
            console.log(app.globalData.url);
            if (app.globalData.url != this.data.url && app.globalData.url) {
                this.setData({
                    url: app.globalData.url,
                });
            }
            if (app.globalData.url && app.globalData.url == this.data.url) {
                clearInterval(i);
            }
        }, 10);
    },
});
