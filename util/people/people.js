Page({
    data: {},
    onLoad(option) {
        console.log(option);
        this.setData({
            chooseMan: option.chooseMan.split(",")
        });
    }
});
