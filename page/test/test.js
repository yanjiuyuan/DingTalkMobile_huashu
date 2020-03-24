import lib from "/lib.js";
const app = getApp();
Page({
    data: {
        url: "http://localhost:8081",
    },
    onReady() {
        console.log(app.globalData.url);

        setInterval(() => {
            if (app.globalData.url != this.data.url) {
                this.setData({
                    url: app.globalData.url,
                });
            }
            console.log("s");
        }, 10);
        if (app.globalData.url == this.data.url) {
            console.log(app.globalData.url);
            console.log(this.data.url);
            clearTimeout(a);
        }
    },
});
